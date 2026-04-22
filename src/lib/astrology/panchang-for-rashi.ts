/**
 * Panchang helpers for per-rashi daily rashifal generation.
 *
 * Computes values that change daily (unlike outer-planet transits) and drive
 * real daily variation in a rashifal: chandra bala, tarabala, vaar lord, and
 * a short contextual summary suitable for LLM input.
 */

import { calculatePanchang } from "./calculator";

/** Traditional classification used in daily rashifal logic. */
export type ChandraBala = "favorable" | "neutral" | "unfavorable";
export type Tarabala =
  | "janma"     // 1st — obstacles
  | "sampat"    // 2nd — wealth
  | "vipat"     // 3rd — danger
  | "kshema"    // 4th — wellbeing
  | "pratyari"  // 5th — enemy
  | "sadhak"    // 6th — success
  | "vadh"      // 7th — death/damage
  | "mitra"     // 8th — friend
  | "param-mitra"; // 9th — close friend

// Good houses from the Moon for a given rashi (Chandra Bala).
// Position of Moon from rashi (1-based): 1/3/6/7/10/11 = good; 4/8/12 = bad; rest neutral.
const GOOD_CB_HOUSES = new Set([1, 3, 6, 7, 10, 11]);
const BAD_CB_HOUSES = new Set([4, 8, 12]);

export const TARABALA_ORDER: Tarabala[] = [
  "janma", "sampat", "vipat", "kshema", "pratyari",
  "sadhak", "vadh", "mitra", "param-mitra",
];

export const TARABALA_MR: Record<Tarabala, string> = {
  janma: "जन्म तारा", sampat: "संपत तारा", vipat: "विपत तारा",
  kshema: "क्षेम तारा", pratyari: "प्रत्यरी तारा", sadhak: "साधक तारा",
  vadh: "वध तारा", mitra: "मित्र तारा", "param-mitra": "परम मित्र तारा",
};

export const TARABALA_EFFECT_MR: Record<Tarabala, string> = {
  janma: "आत्मपरीक्षा, अडथळे टाळा",
  sampat: "अत्यंत शुभ, आर्थिक लाभ",
  vipat: "सावधगिरी, नवे काम टाळा",
  kshema: "शुभ, आरोग्य-सुख लाभ",
  pratyari: "विरोध शक्य, संयम ठेवा",
  sadhak: "साध्य सिद्धी, प्रयत्न फलदायी",
  vadh: "मोठे निर्णय टाळा, हानी शक्य",
  mitra: "मित्रलाभ, सहकार्य",
  "param-mitra": "सर्वोत्तम शुभ योग",
};

/** Vaar (weekday) planet lord — drives hora/muhurta and tone of the day. */
export const VAAR_LORD_MR: Record<number, { vaar: string; lord: string; nature: string }> = {
  0: { vaar: "रविवार", lord: "सूर्य", nature: "नेतृत्व, आरोग्य, पित्याचे विषय" },
  1: { vaar: "सोमवार", lord: "चंद्र", nature: "मन, भावना, मातेचे विषय" },
  2: { vaar: "मंगळवार", lord: "मंगळ", nature: "धाडस, ऊर्जा, स्पर्धा" },
  3: { vaar: "बुधवार", lord: "बुध", nature: "संवाद, व्यापार, शिक्षण" },
  4: { vaar: "गुरुवार", lord: "गुरु", nature: "ज्ञान, धर्म, मार्गदर्शन" },
  5: { vaar: "शुक्रवार", lord: "शुक्र", nature: "प्रेम, कला, सौंदर्य" },
  6: { vaar: "शनिवार", lord: "शनि", nature: "परिश्रम, शिस्त, कर्मफल" },
};

export interface PanchangForRashi {
  date: string;                 // YYYY-MM-DD
  rashiId: number;              // 0-11
  rashiMr: string;
  // Daily panchang (changes every day):
  tithi: string;
  tithiIndex: number;
  paksha: string;
  nakshatra: string;
  nakshatraEn: string;
  nakshatraLord: string;
  yoga: string;
  karana: string;
  vaar: string;
  vaarLord: string;
  vaarNature: string;
  // Per-rashi computed:
  moonHouseFromRashi: number;   // 1-12 (where Moon is today from this rashi)
  chandraBala: ChandraBala;
  tarabala: Tarabala;
  tarabalaMr: string;
  tarabalaEffect: string;
  // Useful timings:
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  // Moon sign info:
  moonRashi: string;
  sunRashi: string;
}

const RASHI_MR_0IDX = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन",
];

const NAKSHATRA_EN_0IDX = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "P.Phalguni", "U.Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "P.Ashadha", "U.Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "P.Bhadrapada", "U.Bhadrapada", "Revati",
];

// Each rashi's "ruling" nakshatra index — used to anchor tarabala counting.
// Tarabala is traditionally counted from Moon's natal nakshatra → but for
// daily rashifal by rashi (not by natal nakshatra), we approximate using the
// nakshatra that starts the rashi. This matches widely-published daily
// rashifal conventions. (Purists counting from natal nakshatra can still use
// the chart-specific API.)
const RASHI_START_NAKSHATRA_IDX: Record<number, number> = {
  0: 0,   // मेष — starts at Ashwini
  1: 2,   // वृषभ — starts mid Krittika (approximated)
  2: 5,   // मिथुन — Ardra start
  3: 7,   // कर्क — Pushya start
  4: 10,  // सिंह — P.Phalguni mid (approximated)
  5: 12,  // कन्या — Hasta
  6: 14,  // तुला — Swati
  7: 17,  // वृश्चिक — Jyeshtha start
  8: 19,  // धनु — P.Ashadha
  9: 21,  // मकर — Shravana mid (approximated)
  10: 24, // कुंभ — P.Bhadrapada mid (approximated)
  11: 26, // मीन — Revati
};

function nakshatraIndexFromName(nameEn: string): number {
  return NAKSHATRA_EN_0IDX.findIndex((n) => n === nameEn);
}

/**
 * Build per-rashi panchang snapshot for the given date.
 * lat/lng/tz default to Pune IST (most Marathi users).
 */
export function buildPanchangForRashi(
  date: Date,
  rashiId: number,
  latitude = 18.5204,
  longitude = 73.8567,
  timezone = 5.5,
): PanchangForRashi {
  const p = calculatePanchang(date, latitude, longitude, timezone);
  const moonRashiIndex = RASHI_MR_0IDX.indexOf(p.moonRashi);
  const moonHouseFromRashi = ((moonRashiIndex - rashiId + 12) % 12) + 1;

  let chandraBala: ChandraBala = "neutral";
  if (GOOD_CB_HOUSES.has(moonHouseFromRashi)) chandraBala = "favorable";
  else if (BAD_CB_HOUSES.has(moonHouseFromRashi)) chandraBala = "unfavorable";

  // Tarabala: count nakshatras from rashi's anchor nakshatra to current Moon nakshatra (1-27 → mod 9).
  const rashiAnchorNak = RASHI_START_NAKSHATRA_IDX[rashiId] ?? 0;
  const currentNakIdx = nakshatraIndexFromName(p.nakshatraEn);
  const nakDistance = ((currentNakIdx - rashiAnchorNak + 27) % 27) + 1; // 1-27
  const tarabalaIndex = (nakDistance - 1) % 9; // 0-8
  const tarabala = TARABALA_ORDER[tarabalaIndex];

  const vaarIndex = date.getDay();
  const vaarInfo = VAAR_LORD_MR[vaarIndex];

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return {
    date: `${yyyy}-${mm}-${dd}`,
    rashiId,
    rashiMr: RASHI_MR_0IDX[rashiId],
    tithi: p.tithi,
    tithiIndex: p.tithiIndex,
    paksha: p.paksha,
    nakshatra: p.nakshatra,
    nakshatraEn: p.nakshatraEn,
    nakshatraLord: p.nakshatraLord,
    yoga: p.yoga,
    karana: p.karana,
    vaar: vaarInfo.vaar,
    vaarLord: vaarInfo.lord,
    vaarNature: vaarInfo.nature,
    moonHouseFromRashi,
    chandraBala,
    tarabala,
    tarabalaMr: TARABALA_MR[tarabala],
    tarabalaEffect: TARABALA_EFFECT_MR[tarabala],
    sunrise: p.sunrise,
    sunset: p.sunset,
    rahuKaal: p.rahuKaal,
    moonRashi: p.moonRashi,
    sunRashi: p.sunRashi,
  };
}
