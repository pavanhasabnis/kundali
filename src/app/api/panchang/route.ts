import { NextRequest, NextResponse } from "next/server";
import { calculatePanchang } from "@/lib/astrology/calculator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const lat = searchParams.get("lat") || "18.5204"; // Default: Pune
    const lng = searchParams.get("lng") || "73.8567";
    const tz = searchParams.get("tz") || "5.5";

    // Parse date as local (IST) to avoid UTC offset issues
    let date: Date;
    if (dateStr) {
      const [y, m, d] = dateStr.split("-").map(Number);
      date = new Date(y, m - 1, d);
    } else {
      const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      date = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
    }

    const panchang = calculatePanchang(
      date,
      Number(lat),
      Number(lng),
      Number(tz)
    );

    return NextResponse.json(panchang);
  } catch (error: unknown) {
    console.error("Panchang calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate panchang" }, { status: 500 });
  }
}
