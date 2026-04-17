import swisseph from "swisseph";
import { calculateGochar, type TransitPlanet, type GocharResult } from "./gochar";

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
  return calculateGochar(planets, rashiId);
}
