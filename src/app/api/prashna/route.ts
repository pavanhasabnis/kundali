import { NextRequest, NextResponse } from "next/server";
import { calculateKundli } from "@/lib/astrology/calculator";
import { interpretPrashna, type PrashnaCategory } from "@/lib/astrology/prashna";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, latitude, longitude, timestamp, question } = body;

    if (!category || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = timestamp ? new Date(timestamp) : new Date();
    // Convert to IST for calculation (IST offset 5.5)
    const istMs = now.getTime() + 5.5 * 3600 * 1000;
    const ist = new Date(istMs);

    const result = calculateKundli({
      year: ist.getUTCFullYear(),
      month: ist.getUTCMonth() + 1,
      day: ist.getUTCDate(),
      hour: ist.getUTCHours(),
      minute: ist.getUTCMinutes(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: 5.5,
    });

    const prashna = interpretPrashna(result, category as PrashnaCategory);

    return NextResponse.json({
      question: question || "",
      prashna,
      chart: {
        ayanamsa: result.ayanamsa,
        lagnaRashi: result.lagnaRashi,
        lagnaRashiMr: result.lagnaRashiMr,
        lagnaRashiIndex: result.lagnaRashiIndex,
        lagnaDMS: result.lagnaDMS,
        moonRashi: result.moonRashi,
        moonRashiMr: result.moonRashiMr,
        moonNakshatra: result.moonNakshatra,
        moonNakshatraMr: result.moonNakshatraMr,
        moonPada: result.moonPada,
        planets: result.planets,
      },
      castAt: now.toISOString(),
    });
  } catch (error: unknown) {
    console.error("Prashna calculation error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to cast prashna: ${msg}` }, { status: 500 });
  }
}
