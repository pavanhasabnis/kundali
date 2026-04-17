import { NextRequest, NextResponse } from "next/server";
import swisseph from "swisseph";
import { calculateGochar, type TransitPlanet } from "@/lib/astrology/gochar";

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

    // Calculate all planet positions (sidereal)
    const transitPlanets: TransitPlanet[] = [];

    for (const planet of PLANET_IDS) {
      const result = swisseph.swe_calc_ut(jd, planet.seId, swisseph.SEFLG_SWIEPH);
      const sidLong = getSiderealLong(result.longitude, ayanamsa);
      const rashiIndex = Math.floor(sidLong / 30);

      transitPlanets.push({ id: planet.id, rashiIndex });
    }

    // Ketu is always 180° from Rahu
    const rahu = transitPlanets.find(p => p.id === "Rahu")!;
    transitPlanets.push({ id: "Ketu", rashiIndex: (rahu.rashiIndex + 6) % 12 });

    // Calculate Gochar for requested rashi(s)
    if (rashiParam === "all" || !rashiParam) {
      const results = [];
      for (let i = 0; i < 12; i++) {
        results.push(calculateGochar(transitPlanets, i));
      }
      return NextResponse.json({
        date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`,
        transitPlanets: transitPlanets.map(p => {
          const rashiEn = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][p.rashiIndex];
          const rashiMr = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"][p.rashiIndex];
          const planetMr: Record<string,string> = { Sun:"सूर्य", Moon:"चंद्र", Mars:"मंगळ", Mercury:"बुध", Jupiter:"गुरु", Venus:"शुक्र", Saturn:"शनि", Rahu:"राहु", Ketu:"केतु" };
          return { ...p, rashiEn, rashiMr, planetMr: planetMr[p.id] || p.id };
        }),
        predictions: results,
      });
    } else {
      const rashiId = parseInt(rashiParam);
      if (isNaN(rashiId) || rashiId < 0 || rashiId > 11) {
        return NextResponse.json({ error: "Invalid rashi ID (0-11)" }, { status: 400 });
      }
      const result = calculateGochar(transitPlanets, rashiId);
      return NextResponse.json({
        date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`,
        transitPlanets: transitPlanets.map(p => {
          const rashiEn = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"][p.rashiIndex];
          const rashiMr = ["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"][p.rashiIndex];
          const planetMr: Record<string,string> = { Sun:"सूर्य", Moon:"चंद्र", Mars:"मंगळ", Mercury:"बुध", Jupiter:"गुरु", Venus:"शुक्र", Saturn:"शनि", Rahu:"राहु", Ketu:"केतु" };
          return { ...p, rashiEn, rashiMr, planetMr: planetMr[p.id] || p.id };
        }),
        prediction: result,
      });
    }
  } catch (error: unknown) {
    console.error("Rashifal calculation error:", error);
    return NextResponse.json({ error: "Failed to calculate rashifal" }, { status: 500 });
  }
}
