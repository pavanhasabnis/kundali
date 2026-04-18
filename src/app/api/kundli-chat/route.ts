import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { getSessionUser } from "@/lib/dev-session";
import { db } from "@/lib/db";
import { users, chatUsage } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60;

const DAILY_LIMIT = 20;

function todayIST(): string {
  const istMs = Date.now() + 5.5 * 3600 * 1000;
  return new Date(istMs).toISOString().slice(0, 10);
}

function summarizeChart(chart: Record<string, unknown>): string {
  try {
    // Shrink to a manageable summary instead of sending full JSON (which can be huge)
    const pick = (k: string) => chart[k];
    const planets = (pick("planets") as Array<Record<string, unknown>> | undefined)?.map((p) => ({
      id: p.id,
      rashi: p.rashi,
      rashiMr: p.rashiMr,
      degree: p.degreeDMS,
      house: p.house,
      nakshatra: p.nakshatra,
      pada: p.pada,
      retro: p.isRetrograde,
    }));
    const summary = {
      lagna: { rashi: pick("lagnaRashi"), rashiMr: pick("lagnaRashiMr"), dms: pick("lagnaDMS") },
      moon: { rashi: pick("moonRashi"), rashiMr: pick("moonRashiMr"), nakshatra: pick("moonNakshatra"), pada: pick("moonPada") },
      ayanamsa: pick("ayanamsa"),
      planets,
      currentDasha: pick("currentDashaSummary"),
      yogas: pick("yogaSummary"),
      doshas: pick("doshaSummary"),
    };
    return JSON.stringify(summary);
  } catch {
    return JSON.stringify(chart).slice(0, 8000);
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser?.email) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }
    const user = await db.query.users.findFirst({ where: eq(users.email, sessionUser.email) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Rate limit check
    const today = todayIST();
    const existing = await db.query.chatUsage.findFirst({
      where: and(eq(chatUsage.userId, user.id), eq(chatUsage.date, today)),
    });
    const used = existing?.count ?? 0;
    if (user.role !== "admin" && used >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily chat limit reached (${DAILY_LIMIT}/day). Try again tomorrow.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages: UIMessage[] = body.messages ?? [];
    const chartContext = body.chartContext ?? {};
    const lang: "mr" | "en" | "hi" = body.lang ?? "mr";

    const chartSummary = summarizeChart(chartContext);

    const langInstruction =
      lang === "mr"
        ? "तुम्ही एक अनुभवी वैदिक ज्योतिषी आहात. नेहमी मराठीत उत्तर द्या. पारंपरिक शब्दावली वापरा (राशी, भाव, ग्रह, दशा, योग, दोष). व्यावहारिक आणि दयाळू सल्ला द्या."
        : lang === "hi"
        ? "आप एक अनुभवी वैदिक ज्योतिषी हैं. हमेशा हिंदी में उत्तर दें. पारंपरिक शब्दावली का उपयोग करें. व्यावहारिक और दयालु सलाह दें."
        : "You are an experienced Vedic astrologer. Respond in clear English using traditional Jyotish terminology. Give practical and compassionate advice.";

    const system = `${langInstruction}

The user's birth chart (kundli) summary:
${chartSummary}

Rules:
- Base answers on the provided chart data only.
- When citing planets, houses, rashis, or dashas, reference specifics from the chart.
- Do not invent data not present in the summary.
- Never give medical, legal, or financial advice as fact — frame as astrological perspective.
- Include traditional remedies (mantra / donation / temple visit) when relevant.
- Keep answers focused (under ~200 words) unless the user asks for depth.`;

    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: anthropic("claude-sonnet-4-6"),
      system,
      messages: modelMessages,
      temperature: 0.6,
    });

    // Increment usage count (non-admin only)
    if (user.role !== "admin") {
      if (existing) {
        await db.update(chatUsage).set({ count: used + 1 }).where(eq(chatUsage.id, existing.id));
      } else {
        await db.insert(chatUsage).values({
          id: `${user.id}-${today}`,
          userId: user.id,
          date: today,
          count: 1,
        });
      }
    }

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Chat error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
