/**
 * Content library — lookup helpers for kundli prediction snippets.
 */

import { HOUSE_LORD_IN_HOUSE } from "./house-lord-in-house";
import { PLANET_IN_BHAVA } from "./planet-in-bhava";
import { PLANET_IN_RASHI } from "./planet-in-rashi";
import { NAKSHATRA_DEEP } from "./nakshatra-deep";
import { YOGA_TEXT } from "./yogas-text";
import { LAGNA_LIFE_AREAS, type LifeArea } from "./lagna-life-areas";
import { TITHI_FAL, VAAR_FAL, MASA_FAL, RITU_FAL } from "./panchang-fal";
import type { BilingualSnippet } from "./types";

export type { BilingualSnippet } from "./types";
export type { LifeArea } from "./lagna-life-areas";

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

const RASHI_MR = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तूळ", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन",
];

const RASHI_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const HOUSE_ORD_MR = [
  "", "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम", "षष्ठ",
  "सप्तम", "अष्टम", "नवम", "दशम", "एकादश", "द्वादश",
];

const HOUSE_ORD_EN = [
  "", "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th",
];

export interface RenderedPrediction {
  titleMr: string;
  titleEn: string;
  bodyMr: string;
  bodyEn: string;
}

// ─── House-lord-in-house ──────────────────────────────────────
export function getHouseLordInHouse(lordOfHouse: number, placedInHouse: number): BilingualSnippet | null {
  if (lordOfHouse < 1 || lordOfHouse > 12 || placedInHouse < 1 || placedInHouse > 12) return null;
  return HOUSE_LORD_IN_HOUSE[`${lordOfHouse}-${placedInHouse}`] || null;
}

export function renderHouseLordPrediction(
  lordOfHouse: number,
  placedInHouse: number,
  planetId: string,
): RenderedPrediction | null {
  const snippet = getHouseLordInHouse(lordOfHouse, placedInHouse);
  if (!snippet) return null;
  return {
    titleMr: `${HOUSE_ORD_MR[lordOfHouse]} भावाचा स्वामी ${PLANET_MR[planetId] || planetId}, ${HOUSE_ORD_MR[placedInHouse]} भावात`,
    titleEn: `${HOUSE_ORD_EN[lordOfHouse]} Lord (${planetId}) in ${HOUSE_ORD_EN[placedInHouse]} House`,
    bodyMr: snippet.mr,
    bodyEn: snippet.en,
  };
}

// ─── Planet-in-bhava ──────────────────────────────────────────
export function getPlanetInBhava(planetId: string, house: number): BilingualSnippet | null {
  if (house < 1 || house > 12) return null;
  return PLANET_IN_BHAVA[`${planetId}-${house}`] || null;
}

export function renderPlanetInBhava(planetId: string, house: number): RenderedPrediction | null {
  const snippet = getPlanetInBhava(planetId, house);
  if (!snippet) return null;
  return {
    titleMr: `${PLANET_MR[planetId] || planetId} — ${HOUSE_ORD_MR[house]} भावात`,
    titleEn: `${planetId} in ${HOUSE_ORD_EN[house]} House`,
    bodyMr: snippet.mr,
    bodyEn: snippet.en,
  };
}

// ─── Planet-in-rashi ──────────────────────────────────────────
export function getPlanetInRashi(planetId: string, rashiIndex: number): BilingualSnippet | null {
  if (rashiIndex < 0 || rashiIndex > 11) return null;
  return PLANET_IN_RASHI[`${planetId}-${rashiIndex}`] || null;
}

export function renderPlanetInRashi(planetId: string, rashiIndex: number): RenderedPrediction | null {
  const snippet = getPlanetInRashi(planetId, rashiIndex);
  if (!snippet) return null;
  return {
    titleMr: `${PLANET_MR[planetId] || planetId} — ${RASHI_MR[rashiIndex]} राशीत`,
    titleEn: `${planetId} in ${RASHI_EN[rashiIndex]}`,
    bodyMr: snippet.mr,
    bodyEn: snippet.en,
  };
}

// ─── Nakshatra Deep ───────────────────────────────────────────
export function getNakshatraDeep(nakshatraIndex: number): BilingualSnippet | null {
  if (nakshatraIndex < 0 || nakshatraIndex > 26) return null;
  return NAKSHATRA_DEEP[nakshatraIndex] || null;
}

// ─── Yoga Text ────────────────────────────────────────────────
export function getYogaText(slug: string): BilingualSnippet | null {
  return YOGA_TEXT[slug] || null;
}

// ─── Lagna Life Areas ─────────────────────────────────────────
const LIFE_AREA_TITLE_MR: Record<LifeArea, string> = {
  physical: "शारीरिक रचना",
  mental: "मानसिकता",
  education: "शिक्षण",
  career: "नोकरी / व्यवसाय",
  marriage: "विवाह",
  finance: "आर्थिक स्थिती",
};

const LIFE_AREA_TITLE_EN: Record<LifeArea, string> = {
  physical: "Physical",
  mental: "Mental Temperament",
  education: "Education",
  career: "Career",
  marriage: "Marriage",
  finance: "Finance",
};

export function getLagnaLifeArea(rashiIndex: number, area: LifeArea): BilingualSnippet | null {
  return LAGNA_LIFE_AREAS[`${rashiIndex}-${area}`] || null;
}

export function renderLagnaLifeAreas(rashiIndex: number): RenderedPrediction[] {
  const areas: LifeArea[] = ["physical", "mental", "education", "career", "marriage", "finance"];
  const result: RenderedPrediction[] = [];
  for (const area of areas) {
    const snippet = getLagnaLifeArea(rashiIndex, area);
    if (!snippet) continue;
    result.push({
      titleMr: LIFE_AREA_TITLE_MR[area],
      titleEn: LIFE_AREA_TITLE_EN[area],
      bodyMr: snippet.mr,
      bodyEn: snippet.en,
    });
  }
  return result;
}

// ─── Panchang Fal ─────────────────────────────────────────────
export function getTithiFal(tithiIndex: number): BilingualSnippet | null {
  if (tithiIndex < 1 || tithiIndex > 15) return null;
  return TITHI_FAL[tithiIndex] || null;
}

export function getVaarFal(dayOfWeek: number): BilingualSnippet | null {
  if (dayOfWeek < 0 || dayOfWeek > 6) return null;
  return VAAR_FAL[dayOfWeek] || null;
}

export function getMasaFal(masaIndex: number): BilingualSnippet | null {
  if (masaIndex < 1 || masaIndex > 12) return null;
  return MASA_FAL[masaIndex] || null;
}

export function getRituFal(rituIndex: number): BilingualSnippet | null {
  if (rituIndex < 1 || rituIndex > 6) return null;
  return RITU_FAL[rituIndex] || null;
}
