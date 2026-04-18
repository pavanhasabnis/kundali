/**
 * Upagrahas (sub-planets) — Gulika, Mandi, Yamakantaka, Kala, Ardhaprahara, Mrityu, Dhooma.
 * Computed from day-length kala divisions per weekday.
 * Uses swisseph to get ascendant at kala start time.
 */

import swisseph from "swisseph";
import type { KundliResult } from "./calculator";
import { RASHIS } from "./constants";

// Kala index (1-8) per weekday for each upagraha during DAY birth
// Row = weekday (0=Sun ... 6=Sat). Columns = upagraha kala position.
const DAY_KALA: Record<string, number[]> = {
  // Weekday: Sun Mon Tue Wed Thu Fri Sat
  Gulika:       [7, 6, 5, 4, 3, 2, 1],
  Mandi:        [6, 5, 4, 3, 2, 1, 7],
  Yamakantaka:  [4, 3, 2, 1, 7, 6, 5],
  Kala:         [1, 7, 6, 5, 4, 3, 2],
  Ardhaprahara: [5, 4, 3, 2, 1, 7, 6],
  Mrityu:       [2, 1, 7, 6, 5, 4, 3],
  Dhooma:       [3, 2, 1, 7, 6, 5, 4],
};

// Night birth uses different kala
const NIGHT_KALA: Record<string, number[]> = {
  Gulika:       [3, 2, 1, 7, 6, 5, 4],
  Mandi:        [2, 1, 7, 6, 5, 4, 3],
  Yamakantaka:  [8, 7, 6, 5, 4, 3, 2],
  Kala:         [4, 3, 2, 1, 7, 6, 5],
  Ardhaprahara: [1, 7, 6, 5, 4, 3, 2],
  Mrityu:       [6, 5, 4, 3, 2, 1, 7],
  Dhooma:       [7, 6, 5, 4, 3, 2, 1],
};

const UPAGRAHA_META: Record<string, { mr: string; en: string; hi: string; descMr: string; descEn: string; descHi: string }> = {
  Gulika: {
    mr: "गुलिक", en: "Gulika", hi: "गुलिक",
    descMr: "शनी पुत्र — सर्वात महत्त्वाचा उपग्रह. ज्या भावात गुलिक असेल तेथील बाबींत विलंब, अडचणी व कर्मबंधन दर्शवतो.",
    descEn: "Son of Saturn — the most significant upagraha. The house containing Gulika shows delays, obstacles and karmic bondage.",
    descHi: "शनि पुत्र — सर्वाधिक महत्वपूर्ण उपग्रह. जिस भाव में गुलिक हो उसमें विलंब व अवरोध.",
  },
  Mandi: {
    mr: "मांदी", en: "Mandi", hi: "मांदी",
    descMr: "शनीचा दुसरा पुत्र — गुलिकाशी साधर्म्य. ज्या राशीत असेल त्याच्या विषयांत गूढ अडथळे.",
    descEn: "Saturn's second son — similar to Gulika. Brings subtle obstacles to the sign's significations.",
    descHi: "शनि का द्वितीय पुत्र — गुलिक के समान. सूक्ष्म अवरोध.",
  },
  Yamakantaka: {
    mr: "यमकंटक", en: "Yamakantaka", hi: "यमकंटक",
    descMr: "गुरूचा पुत्र — बौद्धिक व धार्मिक बाबींत सावधगिरी दर्शवतो.",
    descEn: "Son of Jupiter — warns caution in intellectual and religious matters.",
    descHi: "गुरु पुत्र — बौद्धिक व धार्मिक बातों में सावधानी.",
  },
  Kala: {
    mr: "काल", en: "Kala", hi: "काल",
    descMr: "सूर्य पुत्र — त्या भावात जिथे असेल तेथे तीव्र प्रभाव, कालबाधा शक्य.",
    descEn: "Son of Sun — intense effect on the house; possible kala-badha (time-obstacles).",
    descHi: "सूर्य पुत्र — तीव्र प्रभाव, काल बाधा संभव.",
  },
  Ardhaprahara: {
    mr: "अर्धप्रहर", en: "Ardhaprahara", hi: "अर्धप्रहर",
    descMr: "बुध पुत्र — संवाद व व्यापार बाबींत सौम्य प्रभाव.",
    descEn: "Son of Mercury — mild effect on communication and trade.",
    descHi: "बुध पुत्र — संवाद व व्यापार में हल्का प्रभाव.",
  },
  Mrityu: {
    mr: "मृत्यू", en: "Mrityu", hi: "मृत्यु",
    descMr: "मंगळ पुत्र — आयु व आरोग्य बाबींत विचार करावा लागतो.",
    descEn: "Son of Mars — relates to longevity and health concerns.",
    descHi: "मंगल पुत्र — आयु व स्वास्थ्य संबंधित विचार.",
  },
  Dhooma: {
    mr: "धूम", en: "Dhooma", hi: "धूम",
    descMr: "धुराचा कारक — अस्थिरता, गोंधळ दर्शवतो.",
    descEn: "Signifies smoke — unrest and confusion.",
    descHi: "धुएं का कारक — अस्थिरता व भ्रम.",
  },
};

export interface UpagrahaPosition {
  id: string;
  nameMr: string;
  nameEn: string;
  nameHi: string;
  siderealLongitude: number;
  rashiIndex: number;
  rashiMr: string;
  rashiEn: string;
  degreeInSign: number;
  degreeDMS: string;
  house: number;
  kalaIndex: number;
  isDayBirth: boolean;
  descMr: string;
  descEn: string;
  descHi: string;
}

function toDMS(deg: number): string {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

function weekdayFromJD(jd: number): number {
  // swe_day_of_week: Monday=0..Sunday=6. Convert to our 0=Sun..6=Sat.
  const sweDay = Math.floor(jd + 1.5) % 7;
  // jd + 1.5 gives a 0-6 value where 0 = Monday; adjust to 0=Sun
  // Actually, for JD at noon: floor(jd + 1.5) % 7 gives: 0=Mon, 1=Tue ... 6=Sun
  // We want 0=Sun..6=Sat, so:
  return (sweDay + 1) % 7;
}

export function calculateUpagrahas(k: KundliResult, sunriseStr: string, sunsetStr: string): UpagrahaPosition[] {
  const [srH, srM] = sunriseStr.split(":").map(Number);
  const [ssH, ssM] = sunsetStr.split(":").map(Number);
  const sunriseHours = srH + srM / 60;
  const sunsetHours = ssH + ssM / 60;

  const birthHours = k.birthInput.hour + k.birthInput.minute / 60;
  const isDayBirth = birthHours >= sunriseHours && birthHours < sunsetHours;

  // Period length (hours)
  const dayLength = sunsetHours - sunriseHours;
  const nightLength = 24 - dayLength;
  const periodLength = isDayBirth ? dayLength : nightLength;
  const kalaDuration = periodLength / 8; // hours

  // Determine weekday (from birth date)
  const birthDate = new Date(k.birthInput.year, k.birthInput.month - 1, k.birthInput.day);
  const weekday = birthDate.getDay(); // 0=Sun..6=Sat

  const kalaTable = isDayBirth ? DAY_KALA : NIGHT_KALA;

  const results: UpagrahaPosition[] = [];

  for (const [id, kalaRow] of Object.entries(kalaTable)) {
    const kalaIdx = kalaRow[weekday]; // 1-8
    // Start of kala from sunrise (or sunset for night)
    const startOffsetHours = (kalaIdx - 1) * kalaDuration;
    const kalaStartLocalHours = isDayBirth
      ? sunriseHours + startOffsetHours
      : sunsetHours + startOffsetHours;

    // Compute JD for that moment
    const year = k.birthInput.year;
    const month = k.birthInput.month;
    let day = k.birthInput.day;
    let localHours = kalaStartLocalHours;
    if (localHours >= 24) { localHours -= 24; day += 1; }
    const utcHours = localHours - k.birthInput.timezone;

    let adjustedYear = year;
    let adjustedMonth = month;
    let adjustedDay = day;
    let adjustedHour = utcHours;
    if (adjustedHour < 0) {
      adjustedHour += 24;
      adjustedDay -= 1;
      if (adjustedDay < 1) {
        adjustedMonth -= 1;
        if (adjustedMonth < 1) { adjustedMonth = 12; adjustedYear -= 1; }
        adjustedDay = new Date(adjustedYear, adjustedMonth, 0).getDate();
      }
    } else if (adjustedHour >= 24) {
      adjustedHour -= 24;
      adjustedDay += 1;
    }

    const jd = swisseph.swe_julday(adjustedYear, adjustedMonth, adjustedDay, adjustedHour, swisseph.SE_GREG_CAL);

    // Calculate ascendant at that moment (sidereal Lahiri)
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
    const houseRes = swisseph.swe_houses(jd, k.birthInput.latitude, k.birthInput.longitude, "P");
    if (!("ascendant" in houseRes)) continue;

    // Get ayanamsha
    const ayanRes = swisseph.swe_get_ayanamsa_ut(jd);
    const ayanamsa = typeof ayanRes === "number" ? ayanRes : 0;

    let sidLong = houseRes.ascendant - ayanamsa;
    if (sidLong < 0) sidLong += 360;
    sidLong = sidLong % 360;

    const rashiIdx = Math.floor(sidLong / 30);
    const degreeInSign = sidLong - rashiIdx * 30;
    const house = ((rashiIdx - k.lagnaRashiIndex + 12) % 12) + 1;

    const meta = UPAGRAHA_META[id];
    results.push({
      id,
      nameMr: meta.mr,
      nameEn: meta.en,
      nameHi: meta.hi,
      siderealLongitude: Math.round(sidLong * 100) / 100,
      rashiIndex: rashiIdx,
      rashiMr: RASHIS[rashiIdx].mr,
      rashiEn: RASHIS[rashiIdx].en,
      degreeInSign: Math.round(degreeInSign * 100) / 100,
      degreeDMS: toDMS(degreeInSign),
      house,
      kalaIndex: kalaIdx,
      isDayBirth,
      descMr: meta.descMr,
      descEn: meta.descEn,
      descHi: meta.descHi,
    });
  }

  return results;
}

// ─── Gochar Naadi — Transit overlay on natal chart ──────────────

const GOOD_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 11],
};

const PLANET_MR_MAP: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

export interface GocharTransit {
  id: string;
  nameMr: string;
  nameEn: string;
  nameHi: string;
  currentRashiIndex: number;
  currentRashiMr: string;
  currentRashiEn: string;
  houseFromLagna: number;
  houseFromMoon: number;
  effect: "favourable" | "neutral" | "challenging";
  effectMr: string;
  effectEn: string;
  effectHi: string;
}

function calcCurrentPlanets(): Record<string, { long: number; rashi: number }> {
  const now = new Date();
  const jd = swisseph.swe_julday(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60,
    swisseph.SE_GREG_CAL
  );
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const planetCodes: Record<string, number> = {
    Sun: swisseph.SE_SUN, Moon: swisseph.SE_MOON, Mars: swisseph.SE_MARS,
    Mercury: swisseph.SE_MERCURY, Jupiter: swisseph.SE_JUPITER,
    Venus: swisseph.SE_VENUS, Saturn: swisseph.SE_SATURN, Rahu: swisseph.SE_MEAN_NODE,
  };

  const out: Record<string, { long: number; rashi: number }> = {};
  for (const [id, code] of Object.entries(planetCodes)) {
    const res = swisseph.swe_calc_ut(jd, code, swisseph.SEFLG_SIDEREAL);
    if ("longitude" in res) {
      out[id] = { long: res.longitude, rashi: Math.floor(res.longitude / 30) };
    }
  }
  if (out.Rahu) {
    const ketuLong = (out.Rahu.long + 180) % 360;
    out.Ketu = { long: ketuLong, rashi: Math.floor(ketuLong / 30) };
  }
  return out;
}

export function calculateGocharNaadi(k: KundliResult): GocharTransit[] {
  const current = calcCurrentPlanets();
  const out: GocharTransit[] = [];

  const effectLabels = {
    favourable: { mr: "अनुकूल गोचर — शुभ फल प्राप्तीचा कालखंड", en: "Favourable transit — period of good outcomes", hi: "अनुकूल गोचर — शुभ फल" },
    challenging: { mr: "प्रतिकूल गोचर — सावधगिरी व उपाय आवश्यक", en: "Challenging transit — caution and remedies advised", hi: "प्रतिकूल गोचर — सावधानी" },
    neutral: { mr: "तटस्थ गोचर — मिश्र फल", en: "Neutral transit — mixed results", hi: "तटस्थ गोचर — मिश्रित फल" },
  };

  for (const [id, pos] of Object.entries(current)) {
    const hLagna = ((pos.rashi - k.lagnaRashiIndex + 12) % 12) + 1;
    const hMoon = ((pos.rashi - k.moonRashiIndex + 12) % 12) + 1;
    const good = GOOD_HOUSES[id] ?? [];
    // Check both from lagna and from moon; moon takes precedence in gochar
    const goodFromMoon = good.includes(hMoon);
    const goodFromLagna = good.includes(hLagna);
    let effect: "favourable" | "neutral" | "challenging" = "neutral";
    if (goodFromMoon && goodFromLagna) effect = "favourable";
    else if (goodFromMoon || goodFromLagna) effect = "neutral";
    else effect = "challenging";

    out.push({
      id,
      nameMr: PLANET_MR_MAP[id] ?? id,
      nameEn: id,
      nameHi: PLANET_MR_MAP[id] ?? id,
      currentRashiIndex: pos.rashi,
      currentRashiMr: RASHIS[pos.rashi].mr,
      currentRashiEn: RASHIS[pos.rashi].en,
      houseFromLagna: hLagna,
      houseFromMoon: hMoon,
      effect,
      effectMr: effectLabels[effect].mr,
      effectEn: effectLabels[effect].en,
      effectHi: effectLabels[effect].hi,
    });
  }

  return out;
}
