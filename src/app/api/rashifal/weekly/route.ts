import { NextRequest, NextResponse } from "next/server";
import { computeWeeklyForecast } from "@/lib/astrology/gochar-weekly";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    let anchor: Date;
    if (dateStr) {
      const [y, m, d] = dateStr.split("-").map(Number);
      anchor = new Date(y, m - 1, d);
    } else {
      // Current IST date → week that contains today.
      const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      anchor = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
    }
    const forecast = computeWeeklyForecast(anchor);
    return NextResponse.json(forecast);
  } catch (error: unknown) {
    console.error("Weekly rashifal error:", error);
    return NextResponse.json({ error: "Failed to compute weekly forecast" }, { status: 500 });
  }
}
