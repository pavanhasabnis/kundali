import { NextRequest, NextResponse } from "next/server";
import swisseph from "swisseph";
import { calculateGochar, type TransitPlanet } from "@/lib/astrology/gochar";
import { db } from "@/lib/db";
import { dailyRashifal } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// Rashifal rotates daily — prevent browser/CDN stale cache.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Planet IDs
const PLANET_IDS: { id: string; seId: number }[] = [
  { id: "Sun", seId: swisseph.SE_SUN },
  { id: "Moon", seId: swisseph.SE_MOON },
  { id: "Mars", seId: swisseph.SE_MARS },
  { id: "Mercury", seId: swisseph.SE_MERCURY },
  { id: "Jupiter", seId: swisseph.SE_JUPITER },
  { id: "Venus", seId: swisseph.SE_VENUS },
  { id: "Saturn", seId: swisseph.SE_SATURN },
  { id: "Rahu", seId: swisseph.SE_MEAN_NODE },
];

function getSiderealLong(tropical: number, ayanamsa: number): number {
  let sid = tropical - ayanamsa;
  if (sid < 0) sid += 360;
  return sid;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rashiParam = searchParams.get("rashi"); // 0-11 or "all"
    const dateStr = searchParams.get("date");

    // Parse as local date to avoid UTC offset issues
    let date: Date;
    if (dateStr) {
      const [y, m, d] = dateStr.split("-").map(Number);
      date = new Date(y, m - 1, d);
    } else {
      // IST = UTC+5:30, get current IST date
      const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
      date = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
    }
    const timezone = 5.5; // IST

    // Calculate Julian Day for noon IST
    const jd = swisseph.swe_julday(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      12 - timezone,
      swisseph.SE_GREG_CAL
    );

    // Set Lahiri Ayanamsa
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

    // Calculate all planet positions (sidereal) + speed (for retrograde) + combust check
    const transitPlanets: TransitPlanet[] = [];
    let sunSidLong = 0;

    for (const planet of PLANET_IDS) {
      const result = swisseph.swe_calc_ut(jd, planet.seId, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
      // swisseph result shape can be error | numbers object; narrow via 'longitude' presence.
      if (!("longitude" in result)) continue;
      const sidLong = getSiderealLong(result.longitude, ayanamsa);
      const rashiIndex = Math.floor(sidLong / 30);
      const degreeInSign = sidLong - rashiIndex * 30;
      const speed = "longitudeSpeed" in result ? result.longitudeSpeed : 0;

      if (planet.id === "Sun") sunSidLong = sidLong;

      transitPlanets.push({
        id: planet.id,
        rashiIndex,
        sidLong,
        degreeInSign,
        speed,
        isRetrograde: planet.id !== "Sun" && planet.id !== "Moon" && speed < 0,
        isCombust: false, // filled below after Sun long known
      });
    }

    // Ketu is always 180° from Rahu — same speed sign; nodes are always retrograde.
    const rahu = transitPlanets.find(p => p.id === "Rahu")!;
    const ketuSidLong = (rahu.sidLong + 180) % 360;
    transitPlanets.push({
      id: "Ketu",
      rashiIndex: (rahu.rashiIndex + 6) % 12,
      sidLong: ketuSidLong,
      degreeInSign: ketuSidLong - Math.floor(ketuSidLong / 30) * 30,
      speed: rahu.speed,
      isRetrograde: true,
      isCombust: false,
    });

    // Combustion — planet within classical orb of Sun (exception: Sun itself, Rahu/Ketu).
    // Orbs (degrees): Moon 12, Mars 17, Mercury 14 (retro 12), Jupiter 11, Venus 10 (retro 8), Saturn 15.
    const combustOrb: Record<string, number> = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };
    for (const tp of transitPlanets) {
      const orb = combustOrb[tp.id];
      if (!orb) continue;
      let diff = Math.abs(tp.sidLong - sunSidLong);
      if (diff > 180) diff = 360 - diff;
      if (diff <= orb) tp.isCombust = true;
    }

    // Calculate Gochar for requested rashi(s)
    if (rashiParam === "all" || !rashiParam) {
      const results = [];
      for (let i = 0; i < 12; i++) {
        results.push(calculateGochar(transitPlanets, i));
      }
      const dateStrAll = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

      // Overlay DB-cached LLM prose onto each result when available.
      const cachedAll = db
        .select()
        .from(dailyRashifal)
        .where(eq(dailyRashifal.date, dateStrAll))
        .all();
      const byRashi = new Map(cachedAll.map((c) => [c.rashiId, c]));
      let anyCached = false;
      for (const r of results) {
        const c = byRashi.get(r.rashiId);
        if (!c) continue;
        anyCached = true;
        r.overall = { mr: c.overall, en: r.overall.en };
        r.career  = { mr: c.career,  en: r.career.en  };
        r.love    = { mr: c.love,    en: r.love.en    };
        r.health  = { mr: c.health,  en: r.health.en  };
        if (c.advice)      r.advice    = { mr: c.advice, en: r.advice.en };
        if (c.luckyColor)  r.luckyColor.mr = c.luckyColor;
        if (c.luckyNumber) r.luckyNumber = c.luckyNumber;
        if (c.rating)      r.rating = c.rating;
        r.narrative = {
          mr: `${c.overall}\n\n${c.career}\n\n${c.love}\n\n${c.health}`,
          en: r.narrative.en,
        };
      }

      return NextResponse.json({
        date: dateStrAll,
        transitPlanets: transitPlanets.map(p => {
          const rashiEn = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][p.rashiIndex];
          const rashiMr = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"][p.rashiIndex];
          const planetMr: Record<string,string> = { Sun:"सूर्य", Moon:"चंद्र", Mars:"मंगळ", Mercury:"बुध", Jupiter:"गुरु", Venus:"शुक्र", Saturn:"शनि", Rahu:"राहु", Ketu:"केतु" };
          return { ...p, rashiEn, rashiMr, planetMr: planetMr[p.id] || p.id };
        }),
        predictions: results,
        source: anyCached ? "llm-cached" : "live",
      });
    } else {
      const rashiId = parseInt(rashiParam);
      if (isNaN(rashiId) || rashiId < 0 || rashiId > 11) {
        return NextResponse.json({ error: "Invalid rashi ID (0-11)" }, { status: 400 });
      }
      const result = calculateGochar(transitPlanets, rashiId);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

      // Check DB cache for LLM-generated prose for this (date, rashi).
      // Overrides algorithmic narrative + scene fields when available.
      const cached = db
        .select()
        .from(dailyRashifal)
        .where(and(eq(dailyRashifal.date, dateStr), eq(dailyRashifal.rashiId, rashiId)))
        .limit(1)
        .all();
      if (cached.length > 0) {
        const c = cached[0];
        result.overall = { mr: c.overall, en: result.overall.en };
        result.career  = { mr: c.career,  en: result.career.en  };
        result.love    = { mr: c.love,    en: result.love.en    };
        result.health  = { mr: c.health,  en: result.health.en  };
        if (c.advice)       result.advice    = { mr: c.advice, en: result.advice.en };
        if (c.luckyColor)   result.luckyColor.mr = c.luckyColor;
        if (c.luckyNumber)  result.luckyNumber = c.luckyNumber;
        if (c.rating)       result.rating = c.rating;
        result.narrative = {
          mr: `${c.overall}\n\n${c.career}\n\n${c.love}\n\n${c.health}`,
          en: result.narrative.en,
        };
      }

      return NextResponse.json({
        date: dateStr,
        transitPlanets: transitPlanets.map(p => {
          const rashiEn = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][p.rashiIndex];
          const rashiMr = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"][p.rashiIndex];
          const planetMr: Record<string,string> = { Sun:"सूर्य", Moon:"चंद्र", Mars:"मंगळ", Mercury:"बुध", Jupiter:"गुरु", Venus:"शुक्र", Saturn:"शनि", Rahu:"राहु", Ketu:"केतु" };
          return { ...p, rashiEn, rashiMr, planetMr: planetMr[p.id] || p.id };
        }),
        prediction: result,
        source: cached.length > 0 ? cached[0].source : "live",
      });
    }
  } catch (error: unknown) {
    console.error("Rashifal calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate rashifal" }, { status: 500 });
  }
}
