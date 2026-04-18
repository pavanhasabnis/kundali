/**
 * Vimshopak Bala — 16-varga composite strength (Shodashavarga Vimshopaka).
 * For each planet, dignity in each of 16 divisional charts is scored (0-1);
 * weighted by classical Vimshopak points (total = 20).
 */

import type { KundliResult } from "./calculator";
import type { DivisionalChart } from "./divisional";

// Vimshopak weights (Shodashavarga scheme — Parashari): total = 20
const VIMSHOPAK_WEIGHTS: Record<string, number> = {
  rashi: 3.5,           // D1
  hora: 1.0,            // D2
  drekkana: 1.0,        // D3
  chaturthamsha: 0.5,   // D4
  saptamsha: 0.5,       // D7
  navamsha: 3.0,        // D9
  dashamsha: 1.5,       // D10
  dwadashamsha: 0.5,    // D12
  shodashamsha: 2.0,    // D16
  vimshamsha: 0.5,      // D20
  siddhamsha: 0.5,      // D24
  bhamsha: 0.5,         // D27
  trimshamsha: 1.0,     // D30
  khavedamsha: 0.5,     // D40
  akshavedamsha: 0.5,   // D45
  shashtiamsha: 4.0,    // D60
};

// Exaltation, Debilitation, Own, Moolatrikona per planet
const EXALTATION: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
const DEBILITATION: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};
const MOOLATRIKONA: Record<string, number> = { Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10 };

// Natural friendship table (Naisargika)
const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};

const VARGA_NAME_MR: Record<string, string> = {
  rashi: "राशी (D1)", hora: "होरा (D2)", drekkana: "द्रेक्काण (D3)", chaturthamsha: "चतुर्थांश (D4)",
  saptamsha: "सप्तांश (D7)", navamsha: "नवमांश (D9)", dashamsha: "दशमांश (D10)", dwadashamsha: "द्वादशांश (D12)",
  shodashamsha: "षोडशांश (D16)", vimshamsha: "विंशांश (D20)", siddhamsha: "सिद्धांश (D24)", bhamsha: "भांश (D27)",
  trimshamsha: "त्रिंशांश (D30)", khavedamsha: "खवेदांश (D40)", akshavedamsha: "अक्षवेदांश (D45)", shashtiamsha: "षष्ट्यांश (D60)",
};

const VARGA_NAME_EN: Record<string, string> = {
  rashi: "Rashi (D1)", hora: "Hora (D2)", drekkana: "Drekkana (D3)", chaturthamsha: "Chaturthamsha (D4)",
  saptamsha: "Saptamsha (D7)", navamsha: "Navamsha (D9)", dashamsha: "Dashamsha (D10)", dwadashamsha: "Dwadashamsha (D12)",
  shodashamsha: "Shodashamsha (D16)", vimshamsha: "Vimshamsha (D20)", siddhamsha: "Siddhamsha (D24)", bhamsha: "Bhamsha (D27)",
  trimshamsha: "Trimshamsha (D30)", khavedamsha: "Khavedamsha (D40)", akshavedamsha: "Akshavedamsha (D45)", shashtiamsha: "Shashtiamsha (D60)",
};

type Dignity = "exalted" | "moolatrikona" | "own" | "friend" | "neutral" | "enemy" | "debilitated";

function dignityFactor(d: Dignity): number {
  switch (d) {
    case "exalted": return 1.0;
    case "moolatrikona": return 0.85;
    case "own": return 0.85;
    case "friend": return 0.675;
    case "neutral": return 0.5;
    case "enemy": return 0.325;
    case "debilitated": return 0.0;
  }
}

function dignityLabelMr(d: Dignity): string {
  const map: Record<Dignity, string> = {
    exalted: "उच्च", moolatrikona: "मूलत्रिकोण", own: "स्वराशी",
    friend: "मित्रराशी", neutral: "सम", enemy: "शत्रुराशी", debilitated: "नीच",
  };
  return map[d];
}
function dignityLabelEn(d: Dignity): string {
  const map: Record<Dignity, string> = {
    exalted: "Exalted", moolatrikona: "Moolatrikona", own: "Own",
    friend: "Friend", neutral: "Neutral", enemy: "Enemy", debilitated: "Debilitated",
  };
  return map[d];
}

function getDignity(planetId: string, rashiIdx: number): Dignity {
  if (EXALTATION[planetId] === rashiIdx) return "exalted";
  if (DEBILITATION[planetId] === rashiIdx) return "debilitated";
  if (MOOLATRIKONA[planetId] === rashiIdx) return "moolatrikona";
  if (OWN_SIGNS[planetId]?.includes(rashiIdx)) return "own";
  const lord = SIGN_LORDS[rashiIdx];
  if (FRIENDS[planetId]?.includes(lord)) return "friend";
  if (ENEMIES[planetId]?.includes(lord)) return "enemy";
  return "neutral";
}

export interface VimshopakVargaEntry {
  vargaId: string;
  vargaMr: string;
  vargaEn: string;
  weight: number;
  rashiIndex: number;
  dignity: Dignity;
  dignityMr: string;
  dignityEn: string;
  factor: number;
  score: number;           // weight * factor
}

export interface VimshopakPlanet {
  id: string;
  nameMr: string;
  nameEn: string;
  vargas: VimshopakVargaEntry[];
  totalBala: number;        // out of 20
  percent: number;          // out of 100
  verdict: "excellent" | "strong" | "average" | "weak";
  verdictMr: string;
  verdictEn: string;
  verdictHi: string;
}

export function calculateVimshopakBala(k: KundliResult, divisionalCharts: DivisionalChart[]): VimshopakPlanet[] {
  const PLANET_IDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const out: VimshopakPlanet[] = [];

  // Build lookup for quick access: chartId → rashiIndex per planet
  const chartLookup: Record<string, Record<string, number>> = { rashi: {} };
  for (const p of k.planets) chartLookup.rashi[p.id] = p.rashiIndex;
  for (const chart of divisionalCharts) {
    chartLookup[chart.id] = {};
    for (const pp of chart.planets) chartLookup[chart.id][pp.id] = pp.rashiIndex;
  }

  for (const pid of PLANET_IDS) {
    const planet = k.planets.find((p) => p.id === pid);
    if (!planet) continue;

    const vargas: VimshopakVargaEntry[] = [];
    let totalScore = 0;

    for (const [vargaId, weight] of Object.entries(VIMSHOPAK_WEIGHTS)) {
      const rashiIdx = chartLookup[vargaId]?.[pid];
      if (rashiIdx === undefined) continue;
      const d = getDignity(pid, rashiIdx);
      const factor = dignityFactor(d);
      const score = Math.round(weight * factor * 100) / 100;
      totalScore += score;
      vargas.push({
        vargaId,
        vargaMr: VARGA_NAME_MR[vargaId],
        vargaEn: VARGA_NAME_EN[vargaId],
        weight,
        rashiIndex: rashiIdx,
        dignity: d,
        dignityMr: dignityLabelMr(d),
        dignityEn: dignityLabelEn(d),
        factor,
        score,
      });
    }

    totalScore = Math.round(totalScore * 100) / 100;
    const percent = Math.round((totalScore / 20) * 100 * 100) / 100;

    let verdict: VimshopakPlanet["verdict"];
    let verdictMr: string; let verdictEn: string; let verdictHi: string;
    if (totalScore >= 15) { verdict = "excellent"; verdictMr = "अत्युत्तम"; verdictEn = "Excellent"; verdictHi = "अत्युत्तम"; }
    else if (totalScore >= 12) { verdict = "strong"; verdictMr = "प्रबळ"; verdictEn = "Strong"; verdictHi = "प्रबल"; }
    else if (totalScore >= 8) { verdict = "average"; verdictMr = "मध्यम"; verdictEn = "Average"; verdictHi = "मध्यम"; }
    else { verdict = "weak"; verdictMr = "क्षीण"; verdictEn = "Weak"; verdictHi = "क्षीण"; }

    out.push({
      id: pid,
      nameMr: PLANET_MR[pid] ?? pid,
      nameEn: pid,
      vargas,
      totalBala: totalScore,
      percent,
      verdict, verdictMr, verdictEn, verdictHi,
    });
  }

  return out;
}
