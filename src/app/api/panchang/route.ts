import { NextRequest, NextResponse } from "next/server";
import { calculatePanchang } from "@/lib/astrology/calculator";
import { FESTIVAL_RULES, FIXED_HOLIDAYS } from "@/lib/astrology/calendar";

const rashiMrToIdx: Record<string, number> = {
  "मेष": 0, "वृषभ": 1, "मिथुन": 2, "कर्क": 3, "सिंह": 4, "कन्या": 5,
  "तुला": 6, "वृश्चिक": 7, "धनु": 8, "मकर": 9, "कुंभ": 10, "मीन": 11,
};

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

    const latN = Number(lat);
    const lngN = Number(lng);
    const tzN = Number(tz);

    // Sunrise-view (default) for display + one of two festival anchors.
    const panchang = calculatePanchang(date, latN, lngN, tzN);
    // Noon-view drives the other half — मध्याह्न-व्यापिनी rule covers Akshaya Tritiya etc.
    // where the target tithi begins after sunrise. Sunrise-view covers Vinayaki Chaturthi
    // etc. where the tithi ends before madhyanna. Union catches both cases.
    const noon = calculatePanchang(date, latN, lngN, tzN, 12, 0);

    const viewKey = (p: typeof panchang) => ({
      paksha: (p.paksha === "कृष्ण पक्ष" ? "krishna" : "shukla") as "krishna" | "shukla",
      tithi: p.tithiIndex,
      masa: rashiMrToIdx[p.sunRashi] ?? -1,
    });
    const sv = viewKey(panchang);
    const nv = viewKey(noon);

    const matched = new Set<string>();
    const lunarFestivals: { name: string; nameMr: string; type: string }[] = [];
    for (const f of FESTIVAL_RULES) {
      const matchesSunrise = f.masa === sv.masa && f.paksha === sv.paksha && f.tithi === sv.tithi;
      const matchesNoon = f.masa === nv.masa && f.paksha === nv.paksha && f.tithi === nv.tithi;
      if ((matchesSunrise || matchesNoon) && !matched.has(f.name)) {
        matched.add(f.name);
        lunarFestivals.push({ name: f.name, nameMr: f.nameMr, type: f.type });
      }
    }
    const fixed = FIXED_HOLIDAYS.filter(
      (h) => h.month === date.getMonth() + 1 && h.day === date.getDate()
    ).map((h) => ({ name: h.name, nameMr: h.nameMr, type: h.type }));

    return NextResponse.json({ ...panchang, festivals: [...lunarFestivals, ...fixed] });
  } catch (error: unknown) {
    console.error("Panchang calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate panchang" }, { status: 500 });
  }
}
