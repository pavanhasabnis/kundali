import { NextRequest, NextResponse } from "next/server";
import { calculateKundli } from "@/lib/astrology/calculator";

// Lightweight daily chart: planet positions + lagna at noon local for a given date/location.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const lat = Number(searchParams.get("lat") || "18.5204");
    const lng = Number(searchParams.get("lng") || "73.8567");
    const tz = Number(searchParams.get("tz") || "5.5");

    let year: number, month: number, day: number;
    if (dateStr) {
      const parts = dateStr.split("-").map(Number);
      year = parts[0]; month = parts[1]; day = parts[2];
    } else {
      const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      year = now.getUTCFullYear(); month = now.getUTCMonth() + 1; day = now.getUTCDate();
    }

    const kundli = calculateKundli({
      year, month, day,
      hour: 12, minute: 0,
      latitude: lat, longitude: lng, timezone: tz,
    });

    return NextResponse.json({
      date: dateStr,
      lagnaRashiIndex: kundli.lagnaRashiIndex,
      lagnaRashi: kundli.lagnaRashi,
      lagnaRashiMr: kundli.lagnaRashiMr,
      planets: kundli.planets.map((p) => ({
        id: p.id,
        name: p.name,
        nameMr: p.nameMr,
        rashiIndex: p.rashiIndex,
        rashi: p.rashi,
        rashiMr: p.rashiMr,
        house: p.house,
        isRetrograde: p.isRetrograde,
        degreeDMS: p.degreeDMS,
        nakshatraMr: p.nakshatraMr,
        nakshatra: p.nakshatra,
      })),
    });
  } catch (error: unknown) {
    console.error("Day chart calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate day chart" }, { status: 500 });
  }
}
