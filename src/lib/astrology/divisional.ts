/**
 * Divisional Chart (Varga) Calculations
 * Based on Brihat Parashara Hora Shastra (BPHS)
 *
 * Charts: Chandra Kundli, Navamsha (D9), Bhav Chalit,
 *         Saptamsha (D7), Dashamsha (D10), Dwadashamsha (D12),
 *         Shodashamsha (D16), Trimshamsha (D30)
 */

import { RASHIS } from "./constants";
import type { KundliResult, PlanetPosition } from "./calculator";

export interface ChartPlanet {
  id: string;
  name: string;
  nameMr: string;
  rashiIndex: number;
  rashi: string;
  rashiMr: string;
  house: number;
  degreeInSign: number;
  isRetrograde: boolean;
}

export interface DivisionalChart {
  id: string;
  name: string;
  nameMr: string;
  planets: ChartPlanet[];
}

// ─── Chandra Kundli ──────────────────────────────────────────
// Same as Lagna chart but houses counted from Moon sign

export function calculateChandraKundli(result: KundliResult): DivisionalChart {
  const moonRashiIdx = result.moonRashiIndex;

  const planets: ChartPlanet[] = result.planets.map((p) => ({
    id: p.id,
    name: p.name,
    nameMr: p.nameMr,
    rashiIndex: p.rashiIndex,
    rashi: p.rashi,
    rashiMr: p.rashiMr,
    house: ((p.rashiIndex - moonRashiIdx + 12) % 12) + 1,
    degreeInSign: p.degreeInSign,
    isRetrograde: p.isRetrograde,
  }));

  return {
    id: "chandra",
    name: "Chandra Kundli (Moon Chart)",
    nameMr: "चंद्र कुंडली",
    planets,
  };
}

// ─── Navamsha (D9) ───────────────────────────────────────────
// Each sign divided into 9 parts of 3°20' (10/3 degrees)
// Total 108 navamshas across zodiac
// navamsha_rashi = floor(siderealLongitude * 9 / 30) counted from starting sign
// Fire signs (0,4,8): start from Aries
// Earth signs (1,5,9): start from Capricorn
// Air signs (2,6,10): start from Libra
// Water signs (3,7,11): start from Cancer

function getNavamshaRashi(sidLong: number): number {
  // Simple universal formula:
  // The navamsha index across the full zodiac
  const navamshaIndex = Math.floor(sidLong / (10 / 3));
  return navamshaIndex % 12;
}

export function calculateNavamsha(result: KundliResult): DivisionalChart {
  // Lagna navamsha
  const lagnaNavRashi = getNavamshaRashi(result.lagnaSiderealLongitude);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const navRashi = getNavamshaRashi(p.siderealLongitude);
    const house = ((navRashi - lagnaNavRashi + 12) % 12) + 1;
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: navRashi,
      rashi: RASHIS[navRashi].en,
      rashiMr: RASHIS[navRashi].mr,
      house,
      degreeInSign: (p.siderealLongitude % (10 / 3)) * 9,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "navamsha",
    name: "Navamsha (D9)",
    nameMr: "नवमांश (D9)",
    planets,
  };
}

// ─── Bhav Chalit ─────────────────────────────────────────────
// Uses Placidus house cusps. Each cusp is the midpoint of the house.
// House boundary = midpoint between two consecutive cusps.
// Planets may shift houses compared to rashi-based placement.

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function midpoint(a: number, b: number): number {
  const diff = normalizeAngle(b - a);
  return normalizeAngle(a + diff / 2);
}

function isAngleBetween(angle: number, start: number, end: number): boolean {
  angle = normalizeAngle(angle);
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (start <= end) {
    return angle >= start && angle < end;
  }
  // Wraps around 360°
  return angle >= start || angle < end;
}

export function calculateBhavChalit(result: KundliResult): DivisionalChart {
  const cusps = result.houseCusps; // 12 sidereal cusp degrees

  // Calculate house boundaries (midpoint between consecutive cusps)
  const boundaries: { start: number; end: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const prevIdx = (i + 11) % 12;
    const nextIdx = (i + 1) % 12;
    const start = midpoint(cusps[prevIdx], cusps[i]);
    const end = midpoint(cusps[i], cusps[nextIdx]);
    boundaries.push({ start, end });
  }

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const sidLong = normalizeAngle(p.siderealLongitude);
    let bhavHouse = 1;

    for (let i = 0; i < 12; i++) {
      if (isAngleBetween(sidLong, boundaries[i].start, boundaries[i].end)) {
        bhavHouse = i + 1;
        break;
      }
    }

    const rashiIdx = Math.floor(sidLong / 30);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: rashiIdx,
      rashi: RASHIS[rashiIdx].en,
      rashiMr: RASHIS[rashiIdx].mr,
      house: bhavHouse,
      degreeInSign: p.degreeInSign,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "bhav-chalit",
    name: "Bhav Chalit (House Chart)",
    nameMr: "निरयण भाव चलित",
    planets,
  };
}

// ─── Saptamsha (D7) — Children/Progeny ───────────────────────
// Each sign divided into 7 parts of 4°17'8.57" (30/7 degrees)
// Odd signs: count from the sign itself
// Even signs: count from the 7th sign from it

function getSaptamshaRashi(rashiIndex: number, degreeInSign: number): number {
  const portion = Math.floor(degreeInSign * 7 / 30);
  if (rashiIndex % 2 === 0) {
    // Odd sign (0-indexed even = 1st, 3rd, etc.)
    return (rashiIndex + portion) % 12;
  } else {
    // Even sign
    return (rashiIndex + 6 + portion) % 12;
  }
}

export function calculateSaptamsha(result: KundliResult): DivisionalChart {
  const lagnaRashi = Math.floor(result.lagnaSiderealLongitude / 30);
  const lagnaDeg = result.lagnaSiderealLongitude % 30;
  const lagnaD7Rashi = getSaptamshaRashi(lagnaRashi, lagnaDeg);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const d7Rashi = getSaptamshaRashi(p.rashiIndex, p.degreeInSign);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: d7Rashi,
      rashi: RASHIS[d7Rashi].en,
      rashiMr: RASHIS[d7Rashi].mr,
      house: ((d7Rashi - lagnaD7Rashi + 12) % 12) + 1,
      degreeInSign: (p.degreeInSign % (30 / 7)) * 7,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "saptamsha",
    name: "Saptamsha (D7) — Children",
    nameMr: "सप्तांश (D7) — संतती",
    planets,
  };
}

// ─── Dashamsha (D10) — Career/Profession ─────────────────────
// Each sign divided into 10 parts of 3° each
// Odd signs: count from the sign itself
// Even signs: count from the 9th sign from it

function getDashamshaRashi(rashiIndex: number, degreeInSign: number): number {
  const portion = Math.floor(degreeInSign / 3);
  if (rashiIndex % 2 === 0) {
    return (rashiIndex + portion) % 12;
  } else {
    return (rashiIndex + 8 + portion) % 12;
  }
}

export function calculateDashamsha(result: KundliResult): DivisionalChart {
  const lagnaRashi = Math.floor(result.lagnaSiderealLongitude / 30);
  const lagnaDeg = result.lagnaSiderealLongitude % 30;
  const lagnaD10Rashi = getDashamshaRashi(lagnaRashi, lagnaDeg);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const d10Rashi = getDashamshaRashi(p.rashiIndex, p.degreeInSign);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: d10Rashi,
      rashi: RASHIS[d10Rashi].en,
      rashiMr: RASHIS[d10Rashi].mr,
      house: ((d10Rashi - lagnaD10Rashi + 12) % 12) + 1,
      degreeInSign: (p.degreeInSign % 3) * 10,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "dashamsha",
    name: "Dashamsha (D10) — Career",
    nameMr: "दशमांश (D10) — करिअर",
    planets,
  };
}

// ─── Dwadashamsha (D12) — Parents/Ancestry ───────────────────
// Each sign divided into 12 parts of 2.5° each
// Always starts from the sign itself

function getDwadashamshaRashi(rashiIndex: number, degreeInSign: number): number {
  const portion = Math.floor(degreeInSign * 12 / 30);
  return (rashiIndex + portion) % 12;
}

export function calculateDwadashamsha(result: KundliResult): DivisionalChart {
  const lagnaRashi = Math.floor(result.lagnaSiderealLongitude / 30);
  const lagnaDeg = result.lagnaSiderealLongitude % 30;
  const lagnaD12Rashi = getDwadashamshaRashi(lagnaRashi, lagnaDeg);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const d12Rashi = getDwadashamshaRashi(p.rashiIndex, p.degreeInSign);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: d12Rashi,
      rashi: RASHIS[d12Rashi].en,
      rashiMr: RASHIS[d12Rashi].mr,
      house: ((d12Rashi - lagnaD12Rashi + 12) % 12) + 1,
      degreeInSign: (p.degreeInSign % 2.5) * 12,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "dwadashamsha",
    name: "Dwadashamsha (D12) — Parents",
    nameMr: "द्वादशांश (D12) — पितृ/वंश",
    planets,
  };
}

// ─── Shodashamsha (D16) — Vehicles/Comforts ──────────────────
// Each sign divided into 16 parts of 1.875° (30/16) each
// Movable signs (0,3,6,9): start from Aries
// Fixed signs (1,4,7,10): start from Leo
// Dual/Mutable signs (2,5,8,11): start from Sagittarius

function getShodashamshaRashi(rashiIndex: number, degreeInSign: number): number {
  const portion = Math.floor(degreeInSign * 16 / 30);
  const modality = rashiIndex % 3;
  let startSign: number;
  if (modality === 0) startSign = 0;       // Movable → Aries
  else if (modality === 1) startSign = 4;  // Fixed → Leo
  else startSign = 8;                      // Dual → Sagittarius

  return (startSign + portion) % 12;
}

export function calculateShodashamsha(result: KundliResult): DivisionalChart {
  const lagnaRashi = Math.floor(result.lagnaSiderealLongitude / 30);
  const lagnaDeg = result.lagnaSiderealLongitude % 30;
  const lagnaD16Rashi = getShodashamshaRashi(lagnaRashi, lagnaDeg);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const d16Rashi = getShodashamshaRashi(p.rashiIndex, p.degreeInSign);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: d16Rashi,
      rashi: RASHIS[d16Rashi].en,
      rashiMr: RASHIS[d16Rashi].mr,
      house: ((d16Rashi - lagnaD16Rashi + 12) % 12) + 1,
      degreeInSign: (p.degreeInSign % (30 / 16)) * 16,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "shodashamsha",
    name: "Shodashamsha (D16) — Comforts",
    nameMr: "षोडशांश (D16) — सुखसोयी",
    planets,
  };
}

// ─── Trimshamsha (D30) — Misfortunes/Evils ───────────────────
// Unequal divisions per BPHS
// Odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius):
//   0-5°: Mars (Aries=0), 5-10°: Saturn (Aquarius=10),
//   10-18°: Jupiter (Sagittarius=8), 18-25°: Mercury (Gemini=2),
//   25-30°: Venus (Libra=6)
// Even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces):
//   0-5°: Venus (Taurus=1), 5-12°: Mercury (Virgo=5),
//   12-20°: Jupiter (Pisces=11), 20-25°: Saturn (Capricorn=9),
//   25-30°: Mars (Scorpio=7)

function getTrimshamshaRashi(rashiIndex: number, degreeInSign: number): number {
  if (rashiIndex % 2 === 0) {
    // Odd sign
    if (degreeInSign < 5) return 0;       // Aries
    if (degreeInSign < 10) return 10;     // Aquarius
    if (degreeInSign < 18) return 8;      // Sagittarius
    if (degreeInSign < 25) return 2;      // Gemini
    return 6;                             // Libra
  } else {
    // Even sign
    if (degreeInSign < 5) return 1;       // Taurus
    if (degreeInSign < 12) return 5;      // Virgo
    if (degreeInSign < 20) return 11;     // Pisces
    if (degreeInSign < 25) return 9;      // Capricorn
    return 7;                             // Scorpio
  }
}

export function calculateTrimshamsha(result: KundliResult): DivisionalChart {
  const lagnaRashi = Math.floor(result.lagnaSiderealLongitude / 30);
  const lagnaDeg = result.lagnaSiderealLongitude % 30;
  const lagnaD30Rashi = getTrimshamshaRashi(lagnaRashi, lagnaDeg);

  const planets: ChartPlanet[] = result.planets.map((p) => {
    const d30Rashi = getTrimshamshaRashi(p.rashiIndex, p.degreeInSign);
    return {
      id: p.id,
      name: p.name,
      nameMr: p.nameMr,
      rashiIndex: d30Rashi,
      rashi: RASHIS[d30Rashi].en,
      rashiMr: RASHIS[d30Rashi].mr,
      house: ((d30Rashi - lagnaD30Rashi + 12) % 12) + 1,
      degreeInSign: p.degreeInSign,
      isRetrograde: p.isRetrograde,
    };
  });

  return {
    id: "trimshamsha",
    name: "Trimshamsha (D30) — Misfortunes",
    nameMr: "त्रिंशांश (D30) — अरिष्ट",
    planets,
  };
}

// ─── Enforce Rahu-Ketu opposition ────────────────────────────
// Rahu and Ketu are always exactly 180° apart astronomically.
// In some divisional charts (D16, D30), the mathematical formula places
// them in the same sign because opposite signs share modality/parity.
// Per standard jyotish practice, Ketu must always be 6 signs from Rahu.

function enforceRahuKetuOpposition(chart: DivisionalChart): DivisionalChart {
  const rahu = chart.planets.find(p => p.id === "Rahu");
  const ketu = chart.planets.find(p => p.id === "Ketu");
  if (!rahu || !ketu) return chart;

  const ketuRashi = (rahu.rashiIndex + 6) % 12;
  if (ketu.rashiIndex === ketuRashi) return chart; // already correct

  // Ketu is always in the 7th house from Rahu
  const ketuHouse = ((rahu.house - 1 + 6) % 12) + 1;

  return {
    ...chart,
    planets: chart.planets.map(p => {
      if (p.id !== "Ketu") return p;
      return {
        ...p,
        rashiIndex: ketuRashi,
        rashi: RASHIS[ketuRashi].en,
        rashiMr: RASHIS[ketuRashi].mr,
        house: ketuHouse,
      };
    }),
  };
}

// ─── Calculate All Charts ────────────────────────────────────

export function calculateAllDivisionalCharts(result: KundliResult): DivisionalChart[] {
  return [
    calculateChandraKundli(result),
    calculateNavamsha(result),
    calculateBhavChalit(result),
    enforceRahuKetuOpposition(calculateSaptamsha(result)),
    enforceRahuKetuOpposition(calculateDashamsha(result)),
    enforceRahuKetuOpposition(calculateDwadashamsha(result)),
    enforceRahuKetuOpposition(calculateShodashamsha(result)),
    enforceRahuKetuOpposition(calculateTrimshamsha(result)),
  ];
}
