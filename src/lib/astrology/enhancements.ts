/**
 * Kundli Enhancement Calculations
 * Panchang data, Sade Sati, Rashi Akshar, Lucky items,
 * House Lords, Aspects, Combustion, Vargottam, Bhav Sandhi,
 * Chart-specific interpretations, Pratyantar Dasha
 */

import { RASHIS, NAKSHATRAS, DASHA_ORDER, TOTAL_DASHA_YEARS } from "./constants";
import type { KundliResult, PlanetPosition } from "./calculator";
import { calculatePanchang } from "./calculator";
import type { DivisionalChart } from "./divisional";

// ─── Rashi Akshar (Name Letters) ───────────────────────────────
// Based on Moon nakshatra + pada — standard Vedic naming convention
const NAKSHATRA_AKSHAR: Record<string, string[]> = {
  "Ashwini":            ["चु", "चे", "चो", "ला"],
  "Bharani":            ["ली", "लू", "ले", "लो"],
  "Krittika":           ["अ", "ई", "उ", "ए"],
  "Rohini":             ["ओ", "वा", "वी", "वू"],
  "Mrigashira":         ["वे", "वो", "का", "की"],
  "Ardra":              ["कु", "घ", "ङ", "छ"],
  "Punarvasu":          ["के", "को", "हा", "ही"],
  "Pushya":             ["हु", "हे", "हो", "डा"],
  "Ashlesha":           ["डी", "डू", "डे", "डो"],
  "Magha":              ["मा", "मी", "मू", "मे"],
  "Purva Phalguni":     ["मो", "टा", "टी", "टू"],
  "Uttara Phalguni":    ["टे", "टो", "पा", "पी"],
  "Hasta":              ["पू", "ष", "ण", "ठ"],
  "Chitra":             ["पे", "पो", "रा", "री"],
  "Swati":              ["रू", "रे", "रो", "ता"],
  "Vishakha":           ["ती", "तू", "ते", "तो"],
  "Anuradha":           ["ना", "नी", "नू", "ने"],
  "Jyeshtha":           ["नो", "या", "यी", "यू"],
  "Moola":              ["ये", "यो", "भा", "भी"],
  "Purva Ashadha":      ["भू", "धा", "फा", "ढा"],
  "Uttara Ashadha":     ["भे", "भो", "जा", "जी"],
  "Shravana":           ["खी", "खू", "खे", "खो"],
  "Dhanishta":          ["गा", "गी", "गू", "गे"],
  "Shatabhisha":        ["गो", "सा", "सी", "सू"],
  "Purva Bhadrapada":   ["से", "सो", "दा", "दी"],
  "Uttara Bhadrapada":  ["दू", "थ", "झ", "ञ"],
  "Revati":             ["दे", "दो", "चा", "ची"],
};

export function getRashiAkshar(nakshatraEn: string, pada: number): string {
  const letters = NAKSHATRA_AKSHAR[nakshatraEn];
  if (!letters) return "—";
  const padaIdx = Math.max(0, Math.min(3, pada - 1));
  // Return this pada's letter + neighboring letters for more options
  const allLetters = new Set<string>();
  allLetters.add(letters[padaIdx]);
  // Add all letters from the rashi (all 4 padas of nakshatra group)
  letters.forEach(l => allLetters.add(l));
  return Array.from(allLetters).join(", ");
}

// ─── Sade Sati Detection ──────────────────────────────────────
export interface SadeSatiStatus {
  active: boolean;
  phase: string; // "rising" | "peak" | "setting" | "none"
  phaseMr: string;
  phaseEn: string;
  descriptionMr: string;
  descriptionEn: string;
}

export function detectSadeSati(moonRashiIndex: number, planets: PlanetPosition[]): SadeSatiStatus {
  const saturn = planets.find(p => p.id === "Saturn");
  if (!saturn) return { active: false, phase: "none", phaseMr: "नाही", phaseEn: "Not Active", descriptionMr: "साडेसाती चालू नाही.", descriptionEn: "Sade Sati is not active." };

  const saturnRashi = saturn.rashiIndex;
  const diff = ((saturnRashi - moonRashiIndex) + 12) % 12;

  if (diff === 11) {
    return { active: true, phase: "rising", phaseMr: "उदय (पहिला चरण)", phaseEn: "Rising Phase (1st)", descriptionMr: "साडेसाती सुरू — आर्थिक ताण, मानसिक अस्वस्थता शक्य. धैर्य ठेवा.", descriptionEn: "Sade Sati starting — financial stress and mental unrest possible." };
  }
  if (diff === 0) {
    return { active: true, phase: "peak", phaseMr: "शिखर (दुसरा चरण)", phaseEn: "Peak Phase (2nd)", descriptionMr: "साडेसाती शिखरावर — सर्वाधिक प्रभाव. आरोग्य, करिअर, नातेसंबंधांवर परिणाम. शनि उपासना करा.", descriptionEn: "Sade Sati at peak — maximum impact on health, career, relationships." };
  }
  if (diff === 1) {
    return { active: true, phase: "setting", phaseMr: "अस्त (तिसरा चरण)", phaseEn: "Setting Phase (3rd)", descriptionMr: "साडेसाती उतरती — हळूहळू परिस्थिती सुधारते. शेवटचा टप्पा.", descriptionEn: "Sade Sati waning — situation gradually improves." };
  }

  return { active: false, phase: "none", phaseMr: "चालू नाही", phaseEn: "Not Active", descriptionMr: "साडेसाती चालू नाही.", descriptionEn: "Sade Sati is not active." };
}

// ─── Pitra Dosha Detection ────────────────────────────────────
export interface PitraDosha {
  present: boolean;
  reasonMr: string;
  reasonEn: string;
}

export function detectPitraDosha(planets: PlanetPosition[]): PitraDosha {
  const sun = planets.find(p => p.id === "Sun");
  const rahu = planets.find(p => p.id === "Rahu");
  const saturn = planets.find(p => p.id === "Saturn");

  // Sun + Rahu conjunction in same house
  if (sun && rahu && sun.house === rahu.house) {
    return { present: true, reasonMr: "सूर्य-राहु युती (ग्रहण योग) — पितृ दोष. पितरांची शांती करावी.", reasonEn: "Sun-Rahu conjunction (Grahan Yoga) — Pitra Dosha present." };
  }
  // Sun in 9th house with malefic
  if (sun && sun.house === 9 && saturn && saturn.house === 9) {
    return { present: true, reasonMr: "सूर्य + शनि ९ व्या भावात — पितृ दोष. पितरांसाठी श्राद्ध करावे.", reasonEn: "Sun + Saturn in 9th house — Pitra Dosha." };
  }
  // Rahu in 9th house
  if (rahu && rahu.house === 9) {
    return { present: true, reasonMr: "राहु ९ व्या भावात — पितृ दोष संकेत. पितरांसाठी तर्पण करावे.", reasonEn: "Rahu in 9th house — indicates Pitra Dosha." };
  }

  return { present: false, reasonMr: "पितृ दोष नाही.", reasonEn: "No Pitra Dosha." };
}

// ─── Lucky Items based on Lagna Lord ──────────────────────────
export interface LuckyItems {
  gemstone: { mr: string; en: string; planet: string };
  color: { mr: string; en: string };
  number: number;
  day: { mr: string; en: string };
  direction: { mr: string; en: string };
  metal: { mr: string; en: string };
}

const PLANET_LUCKY: Record<string, LuckyItems> = {
  Sun:     { gemstone: { mr: "माणिक", en: "Ruby", planet: "सूर्य" }, color: { mr: "लाल / केशरी", en: "Red / Orange" }, number: 1, day: { mr: "रविवार", en: "Sunday" }, direction: { mr: "पूर्व", en: "East" }, metal: { mr: "सोने", en: "Gold" } },
  Moon:    { gemstone: { mr: "मोती", en: "Pearl", planet: "चंद्र" }, color: { mr: "पांढरा / चंदेरी", en: "White / Silver" }, number: 2, day: { mr: "सोमवार", en: "Monday" }, direction: { mr: "वायव्य", en: "Northwest" }, metal: { mr: "चांदी", en: "Silver" } },
  Mars:    { gemstone: { mr: "प्रवाळ", en: "Red Coral", planet: "मंगळ" }, color: { mr: "लाल", en: "Red" }, number: 9, day: { mr: "मंगळवार", en: "Tuesday" }, direction: { mr: "दक्षिण", en: "South" }, metal: { mr: "तांबे", en: "Copper" } },
  Mercury: { gemstone: { mr: "पन्ना", en: "Emerald", planet: "बुध" }, color: { mr: "हिरवा", en: "Green" }, number: 5, day: { mr: "बुधवार", en: "Wednesday" }, direction: { mr: "उत्तर", en: "North" }, metal: { mr: "पितळ", en: "Brass" } },
  Jupiter: { gemstone: { mr: "पुष्कराज", en: "Yellow Sapphire", planet: "गुरु" }, color: { mr: "पिवळा", en: "Yellow" }, number: 3, day: { mr: "गुरुवार", en: "Thursday" }, direction: { mr: "ईशान्य", en: "Northeast" }, metal: { mr: "सोने", en: "Gold" } },
  Venus:   { gemstone: { mr: "हिरा", en: "Diamond", planet: "शुक्र" }, color: { mr: "पांढरा / रंगीत", en: "White / Multicolor" }, number: 6, day: { mr: "शुक्रवार", en: "Friday" }, direction: { mr: "आग्नेय", en: "Southeast" }, metal: { mr: "चांदी", en: "Silver" } },
  Saturn:  { gemstone: { mr: "नीलम", en: "Blue Sapphire", planet: "शनि" }, color: { mr: "निळा / काळा", en: "Blue / Black" }, number: 8, day: { mr: "शनिवार", en: "Saturday" }, direction: { mr: "पश्चिम", en: "West" }, metal: { mr: "लोखंड", en: "Iron" } },
  Rahu:    { gemstone: { mr: "गोमेद", en: "Hessonite", planet: "राहु" }, color: { mr: "निळा / धुरकट", en: "Smoky Blue" }, number: 4, day: { mr: "शनिवार", en: "Saturday" }, direction: { mr: "नैऋत्य", en: "Southwest" }, metal: { mr: "शिसे", en: "Lead" } },
  Ketu:    { gemstone: { mr: "लसण्या", en: "Cat's Eye", planet: "केतु" }, color: { mr: "राखाडी", en: "Grey" }, number: 7, day: { mr: "मंगळवार", en: "Tuesday" }, direction: { mr: "नैऋत्य", en: "Southwest" }, metal: { mr: "लोखंड", en: "Iron" } },
};

export function getLuckyItems(lagnaRashiIndex: number): LuckyItems {
  const lord = RASHIS[lagnaRashiIndex].lord;
  return PLANET_LUCKY[lord] || PLANET_LUCKY["Sun"];
}

// ─── Combustion Detection ─────────────────────────────────────
// Planets too close to Sun become "combust" (अस्त)
const COMBUSTION_DEGREES: Record<string, number> = {
  Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
};

export interface CombustionData {
  id: string;
  isCombust: boolean;
  distance: number;
}

export function detectCombustion(planets: PlanetPosition[]): CombustionData[] {
  const sun = planets.find(p => p.id === "Sun");
  if (!sun) return [];

  return planets.filter(p => p.id !== "Sun" && p.id !== "Rahu" && p.id !== "Ketu").map(p => {
    let dist = Math.abs(p.siderealLongitude - sun.siderealLongitude);
    if (dist > 180) dist = 360 - dist;
    const threshold = COMBUSTION_DEGREES[p.id] || 15;
    return { id: p.id, isCombust: dist <= threshold, distance: Math.round(dist * 100) / 100 };
  });
}

// ─── House Lords Table ────────────────────────────────────────
export interface HouseLordData {
  house: number;
  rashiIndex: number;
  rashiMr: string;
  rashiEn: string;
  subjectMr: string;
  subjectEn: string;
  lordId: string;
  lordMr: string;
  lordEn: string;
  lordHouse: number;
  lordRashiMr: string;
  lordStrengthMr: string;
  lordStrengthEn: string;
}

const HOUSE_SUBJECTS: { mr: string; en: string }[] = [
  { mr: "तनु / व्यक्तिमत्व", en: "Self / Personality" },
  { mr: "धन / कुटुंब", en: "Wealth / Family" },
  { mr: "पराक्रम / भावंडे", en: "Courage / Siblings" },
  { mr: "सुख / माता / घर", en: "Happiness / Mother / Home" },
  { mr: "संतती / विद्या", en: "Children / Education" },
  { mr: "शत्रू / रोग / कर्ज", en: "Enemies / Disease / Debt" },
  { mr: "विवाह / भागीदारी", en: "Marriage / Partnership" },
  { mr: "आयुष्य / अडचणी", en: "Longevity / Obstacles" },
  { mr: "भाग्य / पिता / धर्म", en: "Fortune / Father / Dharma" },
  { mr: "कर्म / व्यवसाय", en: "Career / Profession" },
  { mr: "लाभ / मित्र / इच्छापूर्ती", en: "Gains / Friends / Desires" },
  { mr: "खर्च / मोक्ष / परदेश", en: "Expenses / Liberation / Foreign" },
];

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

export function calculateHouseLords(kundli: KundliResult): HouseLordData[] {
  const result: HouseLordData[] = [];
  for (let h = 0; h < 12; h++) {
    const rashiIdx = (kundli.lagnaRashiIndex + h) % 12;
    const lord = RASHIS[rashiIdx].lord;
    const lordPlanet = kundli.planets.find(p => p.id === lord);

    let strengthMr = "";
    let strengthEn = "";
    if (lordPlanet) {
      if (lordPlanet.isRetrograde) { strengthMr += "वक्री"; strengthEn += "Retrograde"; }
      // Check if in own sign
      const ownSigns = RASHIS.filter(r => r.lord === lord).map(r => r.id);
      if (ownSigns.includes(lordPlanet.rashiIndex)) {
        strengthMr += (strengthMr ? ", " : "") + "स्वगृही";
        strengthEn += (strengthEn ? ", " : "") + "Own Sign";
      }
    }

    result.push({
      house: h + 1,
      rashiIndex: rashiIdx,
      rashiMr: RASHIS[rashiIdx].mr,
      rashiEn: RASHIS[rashiIdx].en,
      subjectMr: HOUSE_SUBJECTS[h].mr,
      subjectEn: HOUSE_SUBJECTS[h].en,
      lordId: lord,
      lordMr: PLANET_MR[lord] || lord,
      lordEn: lord,
      lordHouse: lordPlanet?.house || 0,
      lordRashiMr: lordPlanet?.rashiMr || "—",
      lordStrengthMr: strengthMr || "—",
      lordStrengthEn: strengthEn || "—",
    });
  }
  return result;
}

// ─── Planetary Aspects ────────────────────────────────────────
export interface AspectData {
  fromId: string;
  toId: string;
  type: "7th" | "special";
  aspectHouse: number; // 3,4,5,7,8,9,10
  descriptionMr: string;
  descriptionEn: string;
}

export function calculateAspects(planets: PlanetPosition[]): AspectData[] {
  const aspects: AspectData[] = [];
  const PLANET_IDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const from of planets) {
    if (!PLANET_IDS.includes(from.id)) continue;
    for (const to of planets) {
      if (from.id === to.id || !PLANET_IDS.includes(to.id)) continue;
      const houseDiff = ((to.house - from.house) + 12) % 12;

      // 7th aspect — all planets
      if (houseDiff === 6) { // 7th house from planet
        aspects.push({ fromId: from.id, toId: to.id, type: "7th", aspectHouse: 7, descriptionMr: `${PLANET_MR[from.id]} → ${PLANET_MR[to.id]} (७ वी दृष्टी)`, descriptionEn: `${from.id} aspects ${to.id} (7th aspect)` });
      }

      // Mars special: 4th and 8th
      if (from.id === "Mars") {
        if (houseDiff === 3) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 4, descriptionMr: `मंगळ → ${PLANET_MR[to.id]} (४ थी विशेष दृष्टी)`, descriptionEn: `Mars → ${to.id} (4th special aspect)` });
        if (houseDiff === 7) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 8, descriptionMr: `मंगळ → ${PLANET_MR[to.id]} (८ वी विशेष दृष्टी)`, descriptionEn: `Mars → ${to.id} (8th special aspect)` });
      }

      // Jupiter special: 5th and 9th
      if (from.id === "Jupiter") {
        if (houseDiff === 4) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 5, descriptionMr: `गुरु → ${PLANET_MR[to.id]} (५ वी विशेष दृष्टी)`, descriptionEn: `Jupiter → ${to.id} (5th special aspect)` });
        if (houseDiff === 8) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 9, descriptionMr: `गुरु → ${PLANET_MR[to.id]} (९ वी विशेष दृष्टी)`, descriptionEn: `Jupiter → ${to.id} (9th special aspect)` });
      }

      // Saturn special: 3rd and 10th
      if (from.id === "Saturn") {
        if (houseDiff === 2) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 3, descriptionMr: `शनि → ${PLANET_MR[to.id]} (३ री विशेष दृष्टी)`, descriptionEn: `Saturn → ${to.id} (3rd special aspect)` });
        if (houseDiff === 9) aspects.push({ fromId: from.id, toId: to.id, type: "special", aspectHouse: 10, descriptionMr: `शनि → ${PLANET_MR[to.id]} (१० वी विशेष दृष्टी)`, descriptionEn: `Saturn → ${to.id} (10th special aspect)` });
      }
    }
  }
  return aspects;
}

// ─── Vargottam Detection ──────────────────────────────────────
export interface VargottamPlanet {
  id: string;
  nameMr: string;
  nameEn: string;
  rashiMr: string;
  rashiEn: string;
  descriptionMr: string;
  descriptionEn: string;
}

export function detectVargottam(planets: PlanetPosition[], divisionalCharts: DivisionalChart[]): VargottamPlanet[] {
  const navamsha = divisionalCharts.find(c => c.id === "navamsha");
  if (!navamsha) return [];

  const result: VargottamPlanet[] = [];
  for (const p of planets) {
    const d9Planet = navamsha.planets.find(np => np.id === p.id);
    if (d9Planet && p.rashiIndex === d9Planet.rashiIndex) {
      result.push({
        id: p.id,
        nameMr: PLANET_MR[p.id] || p.id,
        nameEn: p.id,
        rashiMr: p.rashiMr,
        rashiEn: p.rashi,
        descriptionMr: `${PLANET_MR[p.id]} D1 आणि D9 दोन्हीत ${p.rashiMr} राशीत — अत्यंत बलवान`,
        descriptionEn: `${p.id} in ${p.rashi} in both D1 and D9 — extremely strong`,
      });
    }
  }
  return result;
}

// ─── Bhav Sandhi (House Cusps for display) ────────────────────
export interface BhavSandhiData {
  house: number;
  cuspDegree: number;
  cuspDMS: string;
  rashiMr: string;
  rashiEn: string;
}

function toDMSStr(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

export function getBhavSandhi(houseCusps: number[]): BhavSandhiData[] {
  return houseCusps.map((cusp, i) => {
    const rashiIdx = Math.floor(cusp / 30);
    const degInSign = cusp % 30;
    return {
      house: i + 1,
      cuspDegree: cusp,
      cuspDMS: toDMSStr(degInSign),
      rashiMr: RASHIS[rashiIdx]?.mr || "—",
      rashiEn: RASHIS[rashiIdx]?.en || "—",
    };
  });
}

// ─── Planet House Shift (D1 → Bhav Chalit) ────────────────────
export interface HouseShift {
  planetId: string;
  planetMr: string;
  d1House: number;
  chalitHouse: number;
  shifted: boolean;
}

export function detectHouseShifts(planets: PlanetPosition[], divisionalCharts: DivisionalChart[]): HouseShift[] {
  const chalit = divisionalCharts.find(c => c.id === "bhav-chalit");
  if (!chalit) return [];

  return planets.map(p => {
    const chalitPlanet = chalit.planets.find(cp => cp.id === p.id);
    const chalitHouse = chalitPlanet?.house || p.house;
    return {
      planetId: p.id,
      planetMr: PLANET_MR[p.id] || p.id,
      d1House: p.house,
      chalitHouse,
      shifted: p.house !== chalitHouse,
    };
  });
}

// ─── Chandra Yoga Detection ───────────────────────────────────
export interface ChandraYoga {
  nameMr: string;
  nameEn: string;
  present: boolean;
  descriptionMr: string;
  descriptionEn: string;
  type: "benefic" | "malefic" | "neutral";
}

export function detectChandraYogas(planets: PlanetPosition[]): ChandraYoga[] {
  const moon = planets.find(p => p.id === "Moon");
  if (!moon) return [];

  const moonHouse = moon.house;
  // Planets in 2nd from Moon
  const in2nd = planets.filter(p => p.id !== "Moon" && p.id !== "Rahu" && p.id !== "Ketu" && p.house === ((moonHouse % 12) + 1));
  // Planets in 12th from Moon
  const in12th = planets.filter(p => p.id !== "Moon" && p.id !== "Rahu" && p.id !== "Ketu" && p.house === ((moonHouse - 2 + 12) % 12 + 1));

  const yogas: ChandraYoga[] = [];

  if (in2nd.length > 0 && in12th.length > 0) {
    yogas.push({ nameMr: "दुरुधरा योग", nameEn: "Durudhara Yoga", present: true, descriptionMr: "चंद्रापासून २ ऱ्या आणि १२ व्या दोन्ही भावांत ग्रह — संपन्नता, सुखी जीवन, चांगले मित्र.", descriptionEn: "Planets on both sides of Moon — prosperity, happy life, good friends.", type: "benefic" });
  } else if (in2nd.length > 0) {
    yogas.push({ nameMr: "सुनफा योग", nameEn: "Sunapha Yoga", present: true, descriptionMr: "चंद्रापासून २ ऱ्या भावात ग्रह — स्वकर्तृत्वाने धन, बुद्धिमत्ता, चांगली प्रतिष्ठा.", descriptionEn: "Planets in 2nd from Moon — self-earned wealth, intelligence.", type: "benefic" });
  } else if (in12th.length > 0) {
    yogas.push({ nameMr: "अनफा योग", nameEn: "Anapha Yoga", present: true, descriptionMr: "चंद्रापासून १२ व्या भावात ग्रह — आरोग्य उत्तम, सुंदर रूप, चांगली वाणी.", descriptionEn: "Planets in 12th from Moon — good health, attractive personality.", type: "benefic" });
  }

  if (in2nd.length === 0 && in12th.length === 0) {
    // Check for Kemadruma — no planets in 2nd or 12th from Moon, and no planets conjunct Moon
    const conjunct = planets.filter(p => p.id !== "Moon" && p.id !== "Rahu" && p.id !== "Ketu" && p.house === moonHouse);
    if (conjunct.length === 0) {
      yogas.push({ nameMr: "केमद्रुम योग", nameEn: "Kemadruma Yoga", present: true, descriptionMr: "चंद्राच्या दोन्ही बाजूंस ग्रह नाहीत — मानसिक एकटेपणा शक्य. गुरु/शुक्र दृष्टी असल्यास दोष कमी.", descriptionEn: "No planets adjacent to Moon — possible mental loneliness. Jupiter/Venus aspect cancels.", type: "malefic" });
    }
  }

  return yogas;
}

// ─── Lagna Analysis ──────────────────────────────────────────
export interface LagnaAnalysis {
  rashiDescMr: string;
  rashiDescEn: string;
  lagnaLordPositionMr: string;
  lagnaLordPositionEn: string;
}

const RASHI_PERSONALITY: Record<number, { mr: string; en: string }> = {
  0: { mr: "साहसी, नेतृत्वगुणी, उत्साही, स्वतंत्र विचार.", en: "Adventurous, leadership, enthusiastic, independent." },
  1: { mr: "स्थिर, सौंदर्यप्रेमी, धनप्राप्ती, कलात्मक.", en: "Stable, beauty-loving, wealth-oriented, artistic." },
  2: { mr: "बुद्धिमान, जिज्ञासू, संवाद कौशल्य उत्तम, बहुमुखी.", en: "Intelligent, curious, excellent communication, versatile." },
  3: { mr: "भावनिक, कुटुंबप्रेमी, संवेदनशील, काळजी घेणारे.", en: "Emotional, family-oriented, sensitive, caring." },
  4: { mr: "आत्मविश्वासी, उदार, नेतृत्व, प्रतिष्ठा-प्रिय.", en: "Confident, generous, leadership, status-conscious." },
  5: { mr: "विश्लेषक, व्यवस्थित, सेवाभावी, परिपूर्णतावादी.", en: "Analytical, organized, service-oriented, perfectionist." },
  6: { mr: "कलात्मक, सौंदर्यप्रेमी, न्यायप्रिय, संतुलित.", en: "Artistic, beauty-loving, justice-oriented, balanced." },
  7: { mr: "तीव्र, रहस्यमय, दृढनिश्चयी, संशोधक.", en: "Intense, mysterious, determined, researcher." },
  8: { mr: "आशावादी, दार्शनिक, साहसी, ज्ञानप्रेमी.", en: "Optimistic, philosophical, adventurous, knowledge-seeking." },
  9: { mr: "महत्त्वाकांक्षी, शिस्तबद्ध, कर्तव्यदक्ष, व्यावहारिक.", en: "Ambitious, disciplined, dutiful, practical." },
  10: { mr: "मानवतावादी, मुक्त विचार, नवीन कल्पना, समाजसेवी.", en: "Humanitarian, free-thinking, innovative, social." },
  11: { mr: "अंतर्ज्ञानी, कलात्मक, आध्यात्मिक, दयाळू.", en: "Intuitive, artistic, spiritual, compassionate." },
};

export function analyzeLagna(kundli: KundliResult): LagnaAnalysis {
  const personality = RASHI_PERSONALITY[kundli.lagnaRashiIndex] || { mr: "—", en: "—" };
  const lagnaLord = RASHIS[kundli.lagnaRashiIndex].lord;
  const lordPlanet = kundli.planets.find(p => p.id === lagnaLord);

  let positionMr = "—";
  let positionEn = "—";
  if (lordPlanet) {
    const retro = lordPlanet.isRetrograde ? "वक्री, " : "";
    positionMr = `${PLANET_MR[lagnaLord]} (लग्नेश) भाव ${lordPlanet.house} मध्ये, ${lordPlanet.rashiMr} राशीत${retro ? ", " + retro : ""}.`;
    positionEn = `${lagnaLord} (Lagna Lord) in house ${lordPlanet.house}, ${lordPlanet.rashi}${lordPlanet.isRetrograde ? ", Retrograde" : ""}.`;
  }

  return {
    rashiDescMr: `${kundli.lagnaRashiMr} — ${PLANET_MR[lagnaLord]} स्वामित्व. ${personality.mr}`,
    rashiDescEn: `${kundli.lagnaRashi} — ${lagnaLord} ruled. ${personality.en}`,
    lagnaLordPositionMr: positionMr,
    lagnaLordPositionEn: positionEn,
  };
}

// ─── Birth Panchang for Kundli ────────────────────────────────
export interface BirthPanchang {
  day: string;       // weekday in Marathi
  sunrise: string;
  sunset: string;
  dinman: string;    // day duration
  tithi: string;
  paksha: string;
  yoga: string;
  karana: string;
  masa: string;
  shakaSamvat: number;
  nakshatraPayaMr: string;   // metal per pada: सुवर्ण/चांदी/ताम्र/लोह
  nakshatraPayaEn: string;   // Gold/Silver/Copper/Iron
}

// Pada to metal mapping (simplified Maharashtrian tradition)
const PAYA_MR = ["सुवर्ण", "चांदी", "ताम्र", "लोह"];
const PAYA_EN = ["Gold", "Silver", "Copper", "Iron"];

function getNakshatraPaya(moonPada: number): { mr: string; en: string } {
  const idx = Math.max(0, Math.min(3, moonPada - 1));
  return { mr: PAYA_MR[idx], en: PAYA_EN[idx] };
}

export function calculateBirthPanchang(year: number, month: number, day: number, lat: number, lng: number, tz: number, hour = 0, minute = 0, moonPada = 1): BirthPanchang {
  const date = new Date(year, month - 1, day);
  const panchang = calculatePanchang(date, lat, lng, tz, hour, minute);

  // Calculate dinman (day duration)
  const sunriseMinutes = parseInt(panchang.sunrise.split(":")[0]) * 60 + parseInt(panchang.sunrise.split(":")[1]);
  const sunsetMinutes = parseInt(panchang.sunset.split(":")[0]) * 60 + parseInt(panchang.sunset.split(":")[1]);
  const dinmanMinutes = sunsetMinutes - sunriseMinutes;
  const dinmanH = Math.floor(dinmanMinutes / 60);
  const dinmanM = dinmanMinutes % 60;
  const dinman = `${String(dinmanH).padStart(2, "0")}:${String(dinmanM).padStart(2, "0")}`;

  // Shaka Samvat: year - 78 (after Chaitra), year - 79 (before Chaitra March)
  const shakaSamvat = month >= 3 ? year - 78 : year - 79;

  const paya = getNakshatraPaya(moonPada);

  return {
    day: panchang.day,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    dinman,
    tithi: `${panchang.paksha} ${panchang.tithi}`,
    paksha: panchang.paksha,
    yoga: panchang.yoga,
    karana: panchang.karana,
    masa: panchang.masa,
    shakaSamvat,
    nakshatraPayaMr: paya.mr,
    nakshatraPayaEn: paya.en,
  };
}

// ─── Balance Dasha at Birth ───────────────────────────────────
export interface BalanceDasha {
  lordMr: string;
  lordEn: string;
  years: number;
  months: number;
  days: number;
}

export function calculateBalanceDasha(moonNakshatraIndex: number, moonSiderealLongitude: number): BalanceDasha {
  const nakshatraLord = NAKSHATRAS[moonNakshatraIndex].lord;
  const dashaEntry = DASHA_ORDER.find(d => d.lord === nakshatraLord);
  if (!dashaEntry) return { lordMr: "—", lordEn: "—", years: 0, months: 0, days: 0 };

  const nakshatraSpan = 360 / 27;
  const posInNakshatra = moonSiderealLongitude % nakshatraSpan;
  const fractionRemaining = 1 - (posInNakshatra / nakshatraSpan);
  const totalYears = dashaEntry.years * fractionRemaining;

  const years = Math.floor(totalYears);
  const remainMonths = (totalYears - years) * 12;
  const months = Math.floor(remainMonths);
  const days = Math.floor((remainMonths - months) * 30);

  return {
    lordMr: PLANET_MR[nakshatraLord] || nakshatraLord,
    lordEn: nakshatraLord,
    years,
    months,
    days,
  };
}

// ─── Ashtottari Dasha (108-year alternate system) ─────────────
// Used in Maharashtrian/Kerala tradition alongside Vimshottari.
// Lords: Sun(6), Moon(15), Mars(8), Mercury(17), Saturn(10), Jupiter(19), Rahu(12), Venus(21) = 108 years
// Nakshatra mapping (Nirnaya Sindhu tradition):
//   Sun     — Ardra, Punarvasu, Pushya, Ashlesha           (idx 5-8)
//   Moon    — Magha, P.Phalguni, U.Phalguni                (idx 9-11)
//   Mars    — Hasta, Chitra, Swati, Vishakha               (idx 12-15)
//   Mercury — Anuradha, Jyeshtha, Moola                    (idx 16-18)
//   Saturn  — P.Ashadha, U.Ashadha, Shravana, Dhanishtha   (idx 19-22)
//   Jupiter — Shatabhisha, P.Bhadra, U.Bhadra              (idx 23-25)
//   Rahu    — Revati, Ashwini, Bharani                     (idx 26, 0, 1)
//   Venus   — Krittika, Rohini, Mrigashira                 (idx 2, 3, 4)

interface AshtottariLord { lord: string; years: number; nakshatras: number[] }
const ASHTOTTARI_ORDER: AshtottariLord[] = [
  { lord: "Sun",     years: 6,  nakshatras: [5, 6, 7, 8] },
  { lord: "Moon",    years: 15, nakshatras: [9, 10, 11] },
  { lord: "Mars",    years: 8,  nakshatras: [12, 13, 14, 15] },
  { lord: "Mercury", years: 17, nakshatras: [16, 17, 18] },
  { lord: "Saturn",  years: 10, nakshatras: [19, 20, 21, 22] },
  { lord: "Jupiter", years: 19, nakshatras: [23, 24, 25] },
  { lord: "Rahu",    years: 12, nakshatras: [26, 0, 1] },
  { lord: "Venus",   years: 21, nakshatras: [2, 3, 4] },
];

export interface AshtottariBalance {
  lordMr: string;
  lordEn: string;
  years: number;
  months: number;
  days: number;
  totalYears: number;
}

export function calculateAshtottariBalance(moonNakshatraIndex: number, moonSiderealLongitude: number): AshtottariBalance {
  const entry = ASHTOTTARI_ORDER.find(e => e.nakshatras.includes(moonNakshatraIndex));
  if (!entry) return { lordMr: "—", lordEn: "—", years: 0, months: 0, days: 0, totalYears: 0 };

  // Compute group span on ecliptic
  const nakSpan = 360 / 27;
  const groupStart = entry.nakshatras[0] * nakSpan;
  const groupSpan = entry.nakshatras.length * nakSpan;

  // Moon's position relative to group start, handling wrap (Rahu crosses 27→0)
  let rel = moonSiderealLongitude - groupStart;
  if (rel < 0) rel += 360;
  if (rel > groupSpan) rel -= 360;  // wrap for Rahu group
  if (rel < 0) rel += groupSpan;    // ensure positive

  const fractionElapsed = rel / groupSpan;
  const totalYears = entry.years * (1 - fractionElapsed);
  const years = Math.floor(totalYears);
  const remainMonths = (totalYears - years) * 12;
  const months = Math.floor(remainMonths);
  const days = Math.floor((remainMonths - months) * 30);

  return {
    lordMr: PLANET_MR[entry.lord] || entry.lord,
    lordEn: entry.lord,
    years,
    months,
    days,
    totalYears: entry.years,
  };
}

// ─── Career Analysis from D10 ─────────────────────────────────
export interface CareerAnalysis {
  careerTypeMr: string;
  careerTypeEn: string;
  jobOrBusinessMr: string;
  jobOrBusinessEn: string;
}

const CAREER_MAP: Record<string, { mr: string; en: string }> = {
  Sun: { mr: "सरकारी सेवा, प्रशासन, राजकारण, औषधशास्त्र", en: "Government, administration, politics, medicine" },
  Moon: { mr: "जनसंपर्क, हॉटेल, नर्सिंग, जलसंबंधित व्यवसाय", en: "Public relations, hospitality, nursing, water-related" },
  Mars: { mr: "लष्कर, पोलिस, अभियांत्रिकी, शस्त्रक्रिया, रिअल इस्टेट", en: "Military, police, engineering, surgery, real estate" },
  Mercury: { mr: "तंत्रज्ञान, लेखन, व्यापार, संगणक, गणित, लेखा", en: "Technology, writing, commerce, computers, accounting" },
  Jupiter: { mr: "शिक्षण, कायदा, बँकिंग, धार्मिक, सल्लागार", en: "Education, law, banking, religious, consulting" },
  Venus: { mr: "कला, संगीत, फॅशन, चित्रपट, सौंदर्य उद्योग", en: "Arts, music, fashion, film, beauty industry" },
  Saturn: { mr: "खनिज, बांधकाम, कृषी, कारखाना, तेल/लोह उद्योग", en: "Mining, construction, agriculture, factory, oil/iron" },
};

export function analyzeCareer(kundli: KundliResult, divisionalCharts: DivisionalChart[]): CareerAnalysis {
  const NON_KARAKA = new Set(["Rahu", "Ketu"]);

  // D1 10th lord + 10th house occupants
  const d1TenthLord = RASHIS[(kundli.lagnaRashiIndex + 9) % 12].lord;
  const d1TenthLordPlanet = kundli.planets.find(p => p.id === d1TenthLord);
  const d1TenthOccupants = kundli.planets.filter(p => p.house === 10 && !NON_KARAKA.has(p.id));

  // D10 10th lord + 10th house occupants
  const d10 = divisionalCharts.find(c => c.id === "dashamsha");
  let d10TenthLord: string | null = null;
  let d10TenthOccupants: string[] = [];
  if (d10 && d10.planets.length > 0) {
    const ref = d10.planets[0];
    const d10LagnaRashi = (ref.rashiIndex - (ref.house - 1) + 12) % 12;
    const d10TenthRashi = (d10LagnaRashi + 9) % 12;
    d10TenthLord = RASHIS[d10TenthRashi].lord;
    d10TenthOccupants = d10.planets
      .filter(p => p.rashiIndex === d10TenthRashi && !NON_KARAKA.has(p.id))
      .map(p => p.id);
  }

  // Amatyakaraka (Jaimini): 2nd highest degree among 7 chara karakas
  const charaKarakaIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const byDegree = kundli.planets
    .filter(p => charaKarakaIds.includes(p.id))
    .sort((a, b) => b.degreeInSign - a.degreeInSign);
  const amatyakaraka = byDegree[1]?.id;

  // Budhaditya yoga: Sun+Mercury co-located
  const sun = kundli.planets.find(p => p.id === "Sun");
  const mercury = kundli.planets.find(p => p.id === "Mercury");
  const budhadityaYoga = !!(sun && mercury && sun.rashiIndex === mercury.rashiIndex);

  // Weighted vote across karma-significators
  const votes: Record<string, number> = {};
  const vote = (planet: string | null | undefined, weight: number) => {
    if (!planet || NON_KARAKA.has(planet)) return;
    votes[planet] = (votes[planet] || 0) + weight;
  };
  vote(d1TenthLord, 2);
  vote(d10TenthLord, 3);
  d1TenthOccupants.forEach(p => vote(p.id, 2));
  d10TenthOccupants.forEach(p => vote(p, 2));
  vote(amatyakaraka, 2);
  if (budhadityaYoga) vote("Mercury", 3);

  const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const primary = ranked[0]?.[0];
  const secondary = ranked[1]?.[0];

  const fallback = { mr: "विविध क्षेत्रे अनुकूल", en: "Various fields suitable" };
  const primaryCareer = (primary && CAREER_MAP[primary]) || fallback;
  const secondaryCareer = secondary && secondary !== primary ? CAREER_MAP[secondary] : null;
  const careerMr = secondaryCareer ? `${primaryCareer.mr} | सहाय्यक: ${secondaryCareer.mr}` : primaryCareer.mr;
  const careerEn = secondaryCareer ? `${primaryCareer.en} | Secondary: ${secondaryCareer.en}` : primaryCareer.en;

  // Job vs business: 10th lord vs 7th lord placement
  const seventhLord = RASHIS[(kundli.lagnaRashiIndex + 6) % 12].lord;
  const seventhLordPlanet = kundli.planets.find(p => p.id === seventhLord);
  let jobBiz = { mr: "नोकरी आणि व्यवसाय दोन्ही अनुकूल.", en: "Both job and business are suitable." };
  if (d1TenthLordPlanet && seventhLordPlanet) {
    if (d1TenthLordPlanet.house === 10 || d1TenthLordPlanet.house === 1) {
      jobBiz = { mr: "नोकरीत विशेष यश — दशमेश बलवान.", en: "Strong success in job — 10th lord is strong." };
    } else if (seventhLordPlanet.house === 7 || seventhLordPlanet.house === 10) {
      jobBiz = { mr: "व्यवसाय/भागीदारीत यश — सप्तमेश बलवान.", en: "Success in business/partnership — 7th lord strong." };
    }
  }

  return {
    careerTypeMr: careerMr,
    careerTypeEn: careerEn,
    jobOrBusinessMr: jobBiz.mr,
    jobOrBusinessEn: jobBiz.en,
  };
}

// ─── Children Analysis from D7 ────────────────────────────────
export interface ChildrenAnalysis {
  yogaMr: string;
  yogaEn: string;
  timingMr: string;
  timingEn: string;
}

export function analyzeChildren(kundli: KundliResult): ChildrenAnalysis {
  const fifthLord = RASHIS[(kundli.lagnaRashiIndex + 4) % 12].lord;
  const fifthLordPlanet = kundli.planets.find(p => p.id === fifthLord);
  const jupiter = kundli.planets.find(p => p.id === "Jupiter");
  const planetsIn5th = kundli.planets.filter(p => p.house === 5);

  let yogaMr = "संतती सुखाचे सामान्य संकेत.";
  let yogaEn = "Normal indications for children.";

  if (jupiter && (jupiter.house === 5 || jupiter.house === 9 || jupiter.house === 1)) {
    yogaMr = "गुरु बलवान स्थितीत — संतती सुख उत्तम. पुत्र योग.";
    yogaEn = "Jupiter in strong position — excellent children happiness.";
  }
  if (planetsIn5th.some(p => ["Saturn", "Rahu", "Ketu"].includes(p.id))) {
    yogaMr = "५ व्या भावात पापग्रह — संतती प्राप्तीत विलंब शक्य. उपाय करावेत.";
    yogaEn = "Malefic in 5th house — possible delay in children. Remedies advised.";
  }

  const timingMr = `पंचमेश (${PLANET_MR[fifthLord]}) दशा/अंतर्दशा काळात — संतती प्राप्तीचा अनुकूल काळ.`;
  const timingEn = `During ${fifthLord} dasha/antardasha — favorable period for children.`;

  return { yogaMr, yogaEn, timingMr, timingEn };
}

// ─── Marriage Analysis from D9 ────────────────────────────────
export interface MarriageAnalysis {
  venusMr: string;
  venusEn: string;
  seventhMr: string;
  seventhEn: string;
  timingMr: string;
  timingEn: string;
}

export function analyzeMarriage(kundli: KundliResult, divisionalCharts: DivisionalChart[]): MarriageAnalysis {
  const venus = kundli.planets.find(p => p.id === "Venus");
  const seventhLord = RASHIS[(kundli.lagnaRashiIndex + 6) % 12].lord;
  const seventhLordPlanet = kundli.planets.find(p => p.id === seventhLord);

  let venusMr = "शुक्र सामान्य स्थितीत.";
  let venusEn = "Venus in normal position.";
  if (venus) {
    if (venus.isRetrograde) {
      venusMr = `शुक्र ${venus.rashiMr} राशीत, वक्री — विवाहात विलंब शक्य, परंतु जीवनसाथी कलाप्रेमी.`;
      venusEn = `Venus in ${venus.rashi}, retrograde — possible marriage delay, but spouse is artistic.`;
    } else {
      venusMr = `शुक्र ${venus.rashiMr} राशीत, भाव ${venus.house} — विवाह सुख ${venus.house === 7 ? "उत्तम" : "चांगले"}.`;
      venusEn = `Venus in ${venus.rashi}, house ${venus.house} — marriage happiness ${venus.house === 7 ? "excellent" : "good"}.`;
    }
  }

  let seventhMr = "सप्तमेश सामान्य.";
  let seventhEn = "7th lord in normal position.";
  if (seventhLordPlanet) {
    seventhMr = `सप्तमेश ${PLANET_MR[seventhLord]} भाव ${seventhLordPlanet.house} मध्ये — ${seventhLordPlanet.house === 1 ? "जीवनसाथी प्रभावशाली" : seventhLordPlanet.house === 7 ? "वैवाहिक सुख उत्तम" : "सामान्य विवाह सुख"}.`;
    seventhEn = `7th lord ${seventhLord} in house ${seventhLordPlanet.house}.`;
  }

  const timingMr = `सप्तमेश (${PLANET_MR[seventhLord]}) दशा/अंतर्दशा काळात — विवाह योग्य काळ.`;
  const timingEn = `During ${seventhLord} dasha/antardasha — favorable marriage period.`;

  return { venusMr, venusEn, seventhMr, seventhEn, timingMr, timingEn };
}

// ─── Moon mental temperament ──────────────────────────────────
export interface MentalTemperament {
  descriptionMr: string;
  descriptionEn: string;
  moonStrengthMr: string;
  moonStrengthEn: string;
}

export function analyzeMentalTemperament(kundli: KundliResult): MentalTemperament {
  const moon = kundli.planets.find(p => p.id === "Moon");
  if (!moon) return { descriptionMr: "—", descriptionEn: "—", moonStrengthMr: "—", moonStrengthEn: "—" };

  const rashiLord = RASHIS[moon.rashiIndex].lord;
  const MENTAL_MAP: Record<string, { mr: string; en: string }> = {
    Mars: { mr: "उत्साही, साहसी, चंचल मन. कधी कधी आक्रमक विचार.", en: "Enthusiastic, adventurous, restless. Sometimes aggressive thoughts." },
    Venus: { mr: "कलात्मक, सौंदर्यप्रेमी, रोमँटिक, शांत मन.", en: "Artistic, beauty-loving, romantic, peaceful mind." },
    Mercury: { mr: "तर्कशील, विश्लेषणात्मक, चंचल मन. बौद्धिक क्षमता उत्तम.", en: "Logical, analytical, restless. Excellent intellectual capacity." },
    Moon: { mr: "भावनिक, संवेदनशील, कल्पनाशील, काळजी करणारे.", en: "Emotional, sensitive, imaginative, worrying nature." },
    Sun: { mr: "आत्मविश्वासी, नेतृत्वगुणी, स्वाभिमानी, दृढ.", en: "Confident, leadership, self-respecting, determined." },
    Jupiter: { mr: "आशावादी, दार्शनिक, उदार, ज्ञानप्रेमी. शांत मन.", en: "Optimistic, philosophical, generous, knowledge-loving. Calm mind." },
    Saturn: { mr: "गंभीर, विचारशील, जबाबदार, कधी निराशावादी.", en: "Serious, thoughtful, responsible, sometimes pessimistic." },
  };

  const temperament = MENTAL_MAP[rashiLord] || { mr: "—", en: "—" };

  // Moon strength based on paksha
  const moonDeg = moon.siderealLongitude;
  // Simple check: if Moon is in first 15 tithis (shukla), it's waxing = stronger
  // We'll use the moon's distance from Sun as proxy
  const sun = kundli.planets.find(p => p.id === "Sun");
  let strengthMr = "चंद्र सामान्य बलाचा.";
  let strengthEn = "Moon has average strength.";
  if (sun) {
    let diff = moon.siderealLongitude - sun.siderealLongitude;
    if (diff < 0) diff += 360;
    if (diff > 180) {
      strengthMr = "कृष्ण पक्ष — चंद्र क्षीण. मानसिक शांतीसाठी ध्यान/प्राणायाम उपयुक्त.";
      strengthEn = "Krishna Paksha — Moon is waning. Meditation helpful for mental peace.";
    } else {
      strengthMr = "शुक्ल पक्ष — चंद्र वाढता/बलवान. भावनिक स्थिरता चांगली.";
      strengthEn = "Shukla Paksha — Moon is waxing/strong. Good emotional stability.";
    }
  }

  return {
    descriptionMr: `चंद्र ${RASHIS[moon.rashiIndex].mr} राशीत (${PLANET_MR[rashiLord]} स्वामित्व) — ${temperament.mr}`,
    descriptionEn: `Moon in ${RASHIS[moon.rashiIndex].en} (${rashiLord} ruled) — ${temperament.en}`,
    moonStrengthMr: strengthMr,
    moonStrengthEn: strengthEn,
  };
}

// ─── Master Enhancement Function ──────────────────────────────
// Calculates all enhancements in one call
export interface KundliEnhancements {
  birthPanchang: BirthPanchang;
  rashiAkshar: string;
  balanceDasha: BalanceDasha;
  ashtottariBalance: AshtottariBalance;
  sadeSati: SadeSatiStatus;
  pitraDosha: PitraDosha;
  luckyItems: LuckyItems;
  combustion: CombustionData[];
  houseLords: HouseLordData[];
  aspects: AspectData[];
  vargottam: VargottamPlanet[];
  bhavSandhi: BhavSandhiData[];
  houseShifts: HouseShift[];
  chandraYogas: ChandraYoga[];
  lagnaAnalysis: LagnaAnalysis;
  mentalTemperament: MentalTemperament;
  marriageAnalysis: MarriageAnalysis;
  careerAnalysis: CareerAnalysis;
  childrenAnalysis: ChildrenAnalysis;
}

export function calculateAllEnhancements(
  kundli: KundliResult,
  divisionalCharts: DivisionalChart[],
): KundliEnhancements {
  const { birthInput } = kundli;

  const moonSidLong = kundli.planets.find(p => p.id === "Moon")!.siderealLongitude;
  return {
    birthPanchang: calculateBirthPanchang(birthInput.year, birthInput.month, birthInput.day, birthInput.latitude, birthInput.longitude, birthInput.timezone, birthInput.hour, birthInput.minute, kundli.moonPada),
    rashiAkshar: getRashiAkshar(kundli.moonNakshatra, kundli.moonPada),
    balanceDasha: calculateBalanceDasha(kundli.moonNakshatraIndex, moonSidLong),
    ashtottariBalance: calculateAshtottariBalance(kundli.moonNakshatraIndex, moonSidLong),
    sadeSati: detectSadeSati(kundli.moonRashiIndex, kundli.planets),
    pitraDosha: detectPitraDosha(kundli.planets),
    luckyItems: getLuckyItems(kundli.lagnaRashiIndex),
    combustion: detectCombustion(kundli.planets),
    houseLords: calculateHouseLords(kundli),
    aspects: calculateAspects(kundli.planets),
    vargottam: detectVargottam(kundli.planets, divisionalCharts),
    bhavSandhi: getBhavSandhi(kundli.houseCusps),
    houseShifts: detectHouseShifts(kundli.planets, divisionalCharts),
    chandraYogas: detectChandraYogas(kundli.planets),
    lagnaAnalysis: analyzeLagna(kundli),
    mentalTemperament: analyzeMentalTemperament(kundli),
    marriageAnalysis: analyzeMarriage(kundli, divisionalCharts),
    careerAnalysis: analyzeCareer(kundli, divisionalCharts),
    childrenAnalysis: analyzeChildren(kundli),
  };
}
