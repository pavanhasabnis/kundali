import { NextRequest, NextResponse } from "next/server";
import { calculateKundli } from "@/lib/astrology/calculator";
import { calculateMatching } from "@/lib/astrology/matching";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { boy, girl } = body;

    if (!boy || !girl) {
      return NextResponse.json({ error: "Both boy and girl details required" }, { status: 400 });
    }

    const boyKundli = calculateKundli({
      year: Number(boy.year),
      month: Number(boy.month),
      day: Number(boy.day),
      hour: Number(boy.hour || 0),
      minute: Number(boy.minute || 0),
      latitude: Number(boy.latitude),
      longitude: Number(boy.longitude),
      timezone: Number(boy.timezone || 5.5),
    });

    const girlKundli = calculateKundli({
      year: Number(girl.year),
      month: Number(girl.month),
      day: Number(girl.day),
      hour: Number(girl.hour || 0),
      minute: Number(girl.minute || 0),
      latitude: Number(girl.latitude),
      longitude: Number(girl.longitude),
      timezone: Number(girl.timezone || 5.5),
    });

    const matchResult = calculateMatching(
      boyKundli.moonNakshatraIndex,
      boyKundli.moonRashiIndex,
      girlKundli.moonNakshatraIndex,
      girlKundli.moonRashiIndex
    );

    return NextResponse.json({
      matching: matchResult,
      boyDetails: {
        rashi: boyKundli.moonRashiMr,
        nakshatra: boyKundli.moonNakshatraMr,
        lagna: boyKundli.lagnaRashiMr,
      },
      girlDetails: {
        rashi: girlKundli.moonRashiMr,
        nakshatra: girlKundli.moonNakshatraMr,
        lagna: girlKundli.lagnaRashiMr,
      },
    });
  } catch (error: unknown) {
    console.error("Matching calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate matching" }, { status: 500 });
  }
}
