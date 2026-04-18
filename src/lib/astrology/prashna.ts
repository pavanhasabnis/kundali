import type { KundliResult, PlanetPosition } from "./calculator";

export type PrashnaCategory =
  | "marriage"
  | "career"
  | "health"
  | "money"
  | "travel"
  | "litigation"
  | "education"
  | "property"
  | "children"
  | "enemy"
  | "general";

export const PRASHNA_CATEGORY_MR: Record<PrashnaCategory, string> = {
  marriage: "विवाह",
  career: "करिअर / नोकरी",
  health: "आरोग्य",
  money: "धन / संपत्ती",
  travel: "प्रवास",
  litigation: "खटला / कज्जा",
  education: "शिक्षण",
  property: "जमीन / घर",
  children: "संतती",
  enemy: "शत्रू / विरोधक",
  general: "सामान्य",
};

export const PRASHNA_CATEGORY_EN: Record<PrashnaCategory, string> = {
  marriage: "Marriage",
  career: "Career / Job",
  health: "Health",
  money: "Money / Wealth",
  travel: "Travel",
  litigation: "Litigation / Lawsuit",
  education: "Education",
  property: "Property / Home",
  children: "Children",
  enemy: "Enemy / Opposition",
  general: "General",
};

// Primary house(s) signifying the question category (traditional Jataka Parijata / BPHS mapping)
const CATEGORY_HOUSES: Record<PrashnaCategory, number[]> = {
  marriage: [7],
  career: [10, 6],
  health: [1, 6, 8],
  money: [2, 11],
  travel: [3, 9, 12],
  litigation: [6],
  education: [4, 5],
  property: [4],
  children: [5],
  enemy: [6],
  general: [1],
};

// Classical benefics / malefics
const BENEFICS = new Set(["Jupiter", "Venus", "Moon", "Mercury"]);
const MALEFICS = new Set(["Saturn", "Mars", "Sun", "Rahu", "Ketu"]);

// Sign modality — 0-indexed (Aries=0)
const MOVABLE = new Set([0, 3, 6, 9]); // Aries, Cancer, Libra, Capricorn
const FIXED = new Set([1, 4, 7, 10]); // Taurus, Leo, Scorpio, Aquarius
const DUAL = new Set([2, 5, 8, 11]); // Gemini, Virgo, Sagittarius, Pisces

// Rashi lord (0-indexed)
const RASHI_LORD: string[] = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const KENDRAS = new Set([1, 4, 7, 10]);
const TRIKONAS = new Set([1, 5, 9]);
const DUSTHANAS = new Set([6, 8, 12]);
const UPACHAYAS = new Set([3, 6, 10, 11]);

export type Verdict = "favorable" | "mixed" | "unfavorable";

export interface PrashnaResult {
  verdict: Verdict;
  verdictLabel: { mr: string; en: string };
  score: number;
  timing: { mr: string; en: string };
  category: PrashnaCategory;
  questionHouses: number[];
  reasoning: { mr: string; en: string; polarity: "+" | "-" | "0" }[];
  moonIndicator: {
    house: number;
    rashiIndex: number;
    inKendra: boolean;
    aspectedByBenefic: boolean;
    aspectedByMalefic: boolean;
  };
  lagnaModality: "movable" | "fixed" | "dual";
}

function findPlanet(result: KundliResult, id: string): PlanetPosition | undefined {
  return result.planets.find((p) => p.id === id);
}

// Sign aspect — simplified: benefic/malefic in same house OR 7th from question house
function planetsInHouseOrAspecting(result: KundliResult, house: number): PlanetPosition[] {
  const seventh = ((house - 1 + 6) % 12) + 1;
  return result.planets.filter((p) => p.house === house || p.house === seventh);
}

export function interpretPrashna(result: KundliResult, category: PrashnaCategory): PrashnaResult {
  const questionHouses = CATEGORY_HOUSES[category];
  const primaryHouse = questionHouses[0];

  const reasoning: PrashnaResult["reasoning"] = [];
  let score = 0;

  // 1. Lagna modality — speed of result
  const lagnaRashi = result.lagnaRashiIndex;
  const lagnaModality: "movable" | "fixed" | "dual" = MOVABLE.has(lagnaRashi)
    ? "movable"
    : FIXED.has(lagnaRashi)
    ? "fixed"
    : "dual";

  if (lagnaModality === "movable") {
    score += 1;
    reasoning.push({
      mr: "लग्न चर राशीत — निकाल लवकर",
      en: "Lagna in movable sign — quick result",
      polarity: "+",
    });
  } else if (lagnaModality === "fixed") {
    score -= 1;
    reasoning.push({
      mr: "लग्न स्थिर राशीत — विलंबाचा संकेत",
      en: "Lagna in fixed sign — delay indicated",
      polarity: "-",
    });
  } else {
    reasoning.push({
      mr: "लग्न द्विस्वभाव राशीत — मिश्र / मध्यम वेग",
      en: "Lagna in dual sign — mixed / moderate pace",
      polarity: "0",
    });
  }

  // 2. Moon — primary indicator in Prashna
  const moon = findPlanet(result, "Moon");
  const moonHouse = moon?.house ?? 1;
  const moonInKendra = KENDRAS.has(moonHouse);
  const moonInTrikona = TRIKONAS.has(moonHouse);
  const moonInDusthana = DUSTHANAS.has(moonHouse);

  if (moonInKendra || moonInTrikona) {
    score += 2;
    reasoning.push({
      mr: `चंद्र ${moonHouse} भावात (केंद्र/त्रिकोण) — शुभ संकेत`,
      en: `Moon in house ${moonHouse} (kendra/trikona) — auspicious`,
      polarity: "+",
    });
  } else if (moonInDusthana) {
    score -= 2;
    reasoning.push({
      mr: `चंद्र ${moonHouse} भावात (दुःस्थान) — अडथळा`,
      en: `Moon in house ${moonHouse} (dusthana) — obstacle`,
      polarity: "-",
    });
  }

  // Moon conjunction / aspect
  const moonCoHouse = result.planets.filter((p) => p.id !== "Moon" && p.house === moonHouse);
  const moonBenefic = moonCoHouse.some((p) => BENEFICS.has(p.id));
  const moonMalefic = moonCoHouse.some((p) => MALEFICS.has(p.id));
  if (moonBenefic) {
    score += 1;
    reasoning.push({
      mr: "चंद्रासोबत शुभ ग्रह — अनुकूल",
      en: "Moon with benefic — favorable",
      polarity: "+",
    });
  }
  if (moonMalefic) {
    score -= 1;
    reasoning.push({
      mr: "चंद्रासोबत पाप ग्रह — प्रतिकूल",
      en: "Moon with malefic — unfavorable",
      polarity: "-",
    });
  }

  // 3. Question house lord placement
  const qHouseRashiIdx = (lagnaRashi + primaryHouse - 1) % 12;
  const qHouseLord = RASHI_LORD[qHouseRashiIdx];
  const qLordPlanet = findPlanet(result, qHouseLord);
  const qLordHouse = qLordPlanet?.house ?? 0;

  if (KENDRAS.has(qLordHouse) || TRIKONAS.has(qLordHouse) || qLordHouse === 11) {
    score += 2;
    reasoning.push({
      mr: `${primaryHouse} भावाधिपती ${qHouseLord} — शुभ स्थानी (${qLordHouse} भाव)`,
      en: `${primaryHouse}th lord ${qHouseLord} in auspicious house (${qLordHouse})`,
      polarity: "+",
    });
  } else if (DUSTHANAS.has(qLordHouse)) {
    score -= 2;
    reasoning.push({
      mr: `${primaryHouse} भावाधिपती ${qHouseLord} — दुःस्थानी (${qLordHouse} भाव)`,
      en: `${primaryHouse}th lord ${qHouseLord} in dusthana (${qLordHouse})`,
      polarity: "-",
    });
  }

  // 4. Benefic/Malefic on question house
  const occupants = planetsInHouseOrAspecting(result, primaryHouse);
  const beneficOnQ = occupants.some((p) => BENEFICS.has(p.id));
  const maleficOnQ = occupants.some((p) => MALEFICS.has(p.id));
  if (beneficOnQ) {
    score += 1;
    reasoning.push({
      mr: `${primaryHouse} भावावर शुभ ग्रहांचा प्रभाव`,
      en: `Benefic influence on ${primaryHouse}th house`,
      polarity: "+",
    });
  }
  if (maleficOnQ) {
    score -= 1;
    reasoning.push({
      mr: `${primaryHouse} भावावर पाप ग्रहांचा प्रभाव`,
      en: `Malefic influence on ${primaryHouse}th house`,
      polarity: "-",
    });
  }

  // 5. Upachaya bonus for enemy/litigation/health (6th) — 6th lord in 6/8/12 is actually good
  if (category === "enemy" || category === "litigation" || category === "health") {
    if (UPACHAYAS.has(qLordHouse)) {
      score += 1;
      reasoning.push({
        mr: `शत्रु/व्याधीसाठी ६/३/१० भाव (उपचय) मध्ये अधिपती — विजय`,
        en: "Upachaya placement of lord favors overcoming enemy/ailment",
        polarity: "+",
      });
    }
  }

  // Determine verdict
  const verdict: Verdict = score >= 3 ? "favorable" : score <= -3 ? "unfavorable" : "mixed";
  const verdictLabel = {
    favorable: { mr: "अनुकूल — होय", en: "Favorable — Yes" },
    mixed: { mr: "मिश्र — विलंब / प्रयत्न आवश्यक", en: "Mixed — Delay / effort required" },
    unfavorable: { mr: "प्रतिकूल — नाही", en: "Unfavorable — No" },
  }[verdict];

  // Timing based on lagna modality + moon pada
  const timingMap = {
    movable: { mr: "दिवस ते आठवडे", en: "Days to weeks" },
    dual: { mr: "आठवडे ते महिने", en: "Weeks to months" },
    fixed: { mr: "महिने ते वर्ष", en: "Months to a year" },
  };
  const timing = timingMap[lagnaModality];

  return {
    verdict,
    verdictLabel,
    score,
    timing,
    category,
    questionHouses,
    reasoning,
    moonIndicator: {
      house: moonHouse,
      rashiIndex: moon?.rashiIndex ?? 0,
      inKendra: moonInKendra,
      aspectedByBenefic: moonBenefic,
      aspectedByMalefic: moonMalefic,
    },
    lagnaModality,
  };
}
