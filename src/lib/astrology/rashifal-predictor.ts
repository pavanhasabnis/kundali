import swisseph from "swisseph";
import { calculateGochar, type TransitPlanet, type GocharResult } from "./gochar";
import { db } from "@/lib/db";
import { dailyRashifal } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

function sidereal(tropical: number, ayanamsa: number): number {
  let s = tropical - ayanamsa;
  if (s < 0) s += 360;
  return s;
}

export function computeTransitPlanets(date: Date = new Date()): TransitPlanet[] {
  const timezone = 5.5;
  const jd = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    12 - timezone,
    swisseph.SE_GREG_CAL,
  );

  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

  const planets: TransitPlanet[] = [];
  for (const p of PLANET_IDS) {
    const r = swisseph.swe_calc_ut(jd, p.seId, swisseph.SEFLG_SWIEPH) as { longitude: number };
    planets.push({ id: p.id, rashiIndex: Math.floor(sidereal(r.longitude, ayanamsa) / 30) });
  }
  const rahu = planets.find((p) => p.id === "Rahu")!;
  planets.push({ id: "Ketu", rashiIndex: (rahu.rashiIndex + 6) % 12 });
  return planets;
}

export function predictRashifal(rashiId: number, date?: Date): GocharResult {
  const d = date ?? (() => {
    const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    return new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
  })();
  const planets = computeTransitPlanets(d);
  const result = calculateGochar(planets, rashiId);

  // Overlay DB-cached LLM prose when available for (date, rashi).
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  try {
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
      if (c.advice)      result.advice    = { mr: c.advice, en: result.advice.en };
      if (c.luckyColor)  result.luckyColor.mr = c.luckyColor;
      if (c.luckyNumber) result.luckyNumber = c.luckyNumber;
      if (c.rating)      result.rating = c.rating;
      result.narrative = {
        mr: `${c.overall}\n\n${c.career}\n\n${c.love}\n\n${c.health}`,
        en: result.narrative.en,
      };
    }
  } catch {
    // DB unavailable during build — return algorithmic result
  }
  return result;
}
