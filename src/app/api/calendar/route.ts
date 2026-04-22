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
  gulikaKaal: string;
  yamaganda: string;
  moonRashi: string;
  sunRashi: string;
  masa: string;
  sunrise: string;
  sunset: string;
  tithiEnd: string | null;
  karanaEnd: string | null;
  yogaEnd: string | null;
  moonRashiEnd: string | null;
  nakshatras: { name: string; nameEn: string; end: string | null }[];
  karanas: { name: string; end: string | null }[];
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

      // Festival match: union of sunrise-view (सूर्योदय-व्यापिनी) and noon-view
      // (मध्याह्न-व्यापिनी). Noon-view catches festivals whose tithi starts after
      // sunrise (Akshaya Tritiya, Gudi Padwa, Hartalika, Ganesh Chaturthi, Navratri).
      // Sunrise-view catches the complement — festivals whose tithi ends before
      // madhyanna (monthly Vinayaki Chaturthi, Ekadashis, Sankashti).
      const matchedNames = new Set<string>();
      const lunarFestivals: { name: string; nameMr: string; type: string }[] = [];
      for (const f of FESTIVAL_RULES) {
        const matchesSun = f.masa === sunriseView.sunMasa && f.paksha === sunriseView.pakshaType && f.tithi === sunriseView.pakshaTithi;
        const matchesNoon = f.masa === noonView.sunMasa && f.paksha === noonView.pakshaType && f.tithi === noonView.pakshaTithi;
        if ((matchesSun || matchesNoon) && !matchedNames.has(f.name)) {
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
        gulikaKaal: panchang.gulikaKaal,
        yamaganda: panchang.yamaganda,
        moonRashi: panchang.moonRashi,
        sunRashi: panchang.sunRashi,
        masa: panchang.masa,
        sunrise: panchang.sunrise || "06:00",
        sunset: panchang.sunset || "18:30",
        tithiEnd: panchang.tithiEnd ?? null,
        karanaEnd: panchang.karanaEnd ?? null,
        yogaEnd: panchang.yogaEnd ?? null,
        moonRashiEnd: panchang.moonRashiEnd ?? null,
        nakshatras: panchang.nakshatras ?? [],
        karanas: panchang.karanas ?? [],
        festivals,
        muhuratTags,
        dayType,
      });
    }

    // Dedup consecutive-day festival matches. A tithi often spans two sunrises so
    // the sunrise-OR-noon match fires on both days. Classical anchor rule:
    //   - Krishna paksha festivals (Sankashti, krishna Ekadashi) are moonrise-anchored —
    //     keep the LATER day (moonrise falls in second day's night window).
    //   - Shukla paksha festivals (Vinayaki, shukla Ekadashi) are sunrise-anchored —
    //     keep the EARLIER day.
    const nameToRule: Record<string, { paksha: "shukla" | "krishna" }> = {};
    for (const r of FESTIVAL_RULES) nameToRule[r.name] = { paksha: r.paksha };
    for (let i = 0; i < days.length - 1; i++) {
      const cur = days[i];
      const nxt = days[i + 1];
      const curNames = new Set(cur.festivals.map((f) => f.name));
      const dupNames = nxt.festivals.filter((f) => curNames.has(f.name)).map((f) => f.name);
      for (const name of dupNames) {
        const rule = nameToRule[name];
        if (!rule) continue;
        if (rule.paksha === "krishna") {
          // drop from earlier day
          cur.festivals = cur.festivals.filter((f) => f.name !== name);
        } else {
          // drop from later day
          nxt.festivals = nxt.festivals.filter((f) => f.name !== name);
        }
      }
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
