import { NextRequest, NextResponse } from "next/server";
import { calculatePanchang } from "@/lib/astrology/calculator";
import {
  FESTIVAL_RULES,
  FIXED_HOLIDAYS,
  calculateMuhuratTags,
  classifyDay,
  type MuhuratTag,
  type DayType,
} from "@/lib/astrology/calendar";

export interface CalendarDay {
  date: string;          // YYYY-MM-DD
  day: number;           // 1-31
  dayOfWeek: number;     // 0=Sun
  dayName: string;       // मराठी day name
  tithi: string;         // तिथी name
  tithiIndex: number;    // 0-29
  paksha: string;        // शुक्ल/कृष्ण
  nakshatra: string;     // नक्षत्र (Marathi)
  nakshatraEn: string;
  yoga: string;
  karana: string;
  rahuKaal: string;
  moonRashi: string;
  sunRashi: string;
  masa: string;
  sunrise: string;
  sunset: string;
  festivals: { name: string; nameMr: string; type: string }[];
  muhuratTags: MuhuratTag[];
  dayType: DayType;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month"); // 1-12
    const yearParam = searchParams.get("year");

    // Use IST for current date
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    const year = yearParam ? Number(yearParam) : nowIST.getUTCFullYear();
    const month = monthParam ? Number(monthParam) : nowIST.getUTCMonth() + 1;

    const daysInMonth = new Date(year, month, 0).getDate();
    const days: CalendarDay[] = [];

    // Default location: Pune (central Maharashtra)
    const lat = 18.5204;
    const lng = 73.8567;
    const tz = 5.5;

    const rashiMrToIdx: Record<string, number> = {
      "मेष": 0, "वृषभ": 1, "मिथुन": 2, "कर्क": 3, "सिंह": 4, "कन्या": 5,
      "तुला": 6, "वृश्चिक": 7, "धनु": 8, "मकर": 9, "कुंभ": 10, "मीन": 11,
    };

    const dayPanchang = (date: Date, atHour?: number, atMinute?: number) => {
      const p = calculatePanchang(date, lat, lng, tz, atHour, atMinute);
      const isKrishna = p.paksha === "कृष्ण पक्ष";
      const tithiIdx = (isKrishna ? 15 : 0) + (p.tithiIndex - 1);
      const sunMasa = rashiMrToIdx[p.sunRashi] ?? -1;
      return {
        panchang: p,
        tithiIdx,
        pakshaType: (isKrishna ? "krishna" : "shukla") as "krishna" | "shukla",
        pakshaTithi: (tithiIdx % 15) + 1,
        sunMasa,
      };
    };

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      const sunriseView = dayPanchang(date);       // default — sunrise-vyapini rule
      const noonView = dayPanchang(date, 12, 0);   // for Pratipada tithi-arambha rule

      const panchang = sunriseView.panchang;
      const tithiIdx = sunriseView.tithiIdx;
      const dayOfWeek = date.getDay();

      // Festival match rules:
      // - Pratipada (tithi=1) festivals use noon-tithi rule. Pratipada often begins after
      //   sunrise when Amavasya/Purnima ends; classical tradition celebrates on the day
      //   when Pratipada is dominant during daytime (Gudi Padwa, Ghatasthapana, Padwa).
      // - All other tithi festivals use sunrise-vyapini rule (standard).
      const matchedNames = new Set<string>();
      const lunarFestivals: { name: string; nameMr: string; type: string }[] = [];
      for (const f of FESTIVAL_RULES) {
        const view = f.tithi === 1 ? noonView : sunriseView;
        const matched = f.masa === view.sunMasa && f.paksha === view.pakshaType && f.tithi === view.pakshaTithi;
        if (matched && !matchedNames.has(f.name)) {
          matchedNames.add(f.name);
          lunarFestivals.push({ name: f.name, nameMr: f.nameMr, type: f.type });
        }
      }

      // Fixed-date holidays (English calendar)
      const fixedFestivals = FIXED_HOLIDAYS.filter(
        (h) => h.month === month && h.day === d
      ).map((h) => ({ name: h.name, nameMr: h.nameMr, type: h.type }));

      const festivals = [...lunarFestivals, ...fixedFestivals];

      // Derive yoga index from yoga name (simplified — use position in known list)
      const yogaNames = [
        "विष्कम्भ", "प्रीती", "आयुष्मान", "सौभाग्य", "शोभन",
        "अतिगंड", "सुकर्मा", "धृती", "शूल", "गंड",
        "वृद्धी", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
        "सिद्धी", "व्यतिपात", "वरीयान", "परिघ", "शिव",
        "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म",
        "ऐंद्र", "वैधृती",
      ];
      const yogaIndex = yogaNames.indexOf(panchang.yoga);

      // Calculate muhurat tags
      const muhuratTags = calculateMuhuratTags(tithiIdx, panchang.nakshatraEn, dayOfWeek, yogaIndex);

      // Classify day
      const dayType = classifyDay(tithiIdx, panchang.nakshatraEn, dayOfWeek, festivals.length > 0);

      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      days.push({
        date: dateStr,
        day: d,
        dayOfWeek,
        dayName: panchang.day,
        tithi: panchang.tithi,
        tithiIndex: tithiIdx,
        paksha: panchang.paksha,
        nakshatra: panchang.nakshatra,
        nakshatraEn: panchang.nakshatraEn,
        yoga: panchang.yoga,
        karana: panchang.karana,
        rahuKaal: panchang.rahuKaal,
        moonRashi: panchang.moonRashi,
        sunRashi: panchang.sunRashi,
        masa: panchang.masa,
        sunrise: panchang.sunrise || "06:00",
        sunset: panchang.sunset || "18:30",
        festivals,
        muhuratTags,
        dayType,
      });
    }

    return NextResponse.json({
      year,
      month,
      daysInMonth,
      firstDayOfWeek: new Date(year, month - 1, 1).getDay(),
      days,
    });
  } catch (error: unknown) {
    console.error("Calendar calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate calendar" }, { status: 500 });
  }
}
