import { NextRequest, NextResponse } from "next/server";
import { calculateKundli } from "@/lib/astrology/calculator";
import { detectMangalDosh, detectKalsarpDosh } from "@/lib/astrology/doshas-mh";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, minute, latitude, longitude, timezone } = body;

    if (!year || !month || !day || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const kundli = calculateKundli({
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour || 0),
      minute: Number(minute || 0),
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone || 5.5),
    });

    const mangal = detectMangalDosh(kundli);
    const kalsarp = detectKalsarpDosh(kundli);

    return NextResponse.json({
      mangal,
      kalsarp,
      meta: {
        lagnaRashi: kundli.lagnaRashi,
        lagnaRashiMr: kundli.lagnaRashiMr,
        moonRashi: kundli.moonRashi,
        moonRashiMr: kundli.moonRashiMr,
      },
    });
  } catch (error: unknown) {
    console.error("Doshas MH calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate doshas" }, { status: 500 });
  }
}
