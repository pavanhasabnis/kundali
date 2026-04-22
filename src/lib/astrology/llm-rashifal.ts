/**
 * Gemini 2.5 Pro daily rashifal generator + self-validator.
 *
 * Pipeline: real panchang + gochar state → structured JSON → LLM writes
 * Marathi prose → regex fact-check vs ground truth → save or fallback.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateGochar, type TransitPlanet } from "./gochar";
import { buildPanchangForRashi, type PanchangForRashi } from "./panchang-for-rashi";
import { getCuratedPrediction } from "../curated-rashifal";

// Model name read at call-time (env may load after module import under tsx).
// Override via GEMINI_MODEL env. Default = 2.5-pro (paid tier).
function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-pro";
}

export interface GeneratedRashifal {
  overall: string;
  career: string;
  love: string;
  health: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
  rating: number;
  source: "llm-validated" | "template-fallback" | "curated";
  audit: {
    groundTruth: GroundTruth;
    llmRawOutput?: string;
    validationIssues?: string[];
    attempts?: number;
  };
}

export interface GroundTruth {
  rashiId: number;
  rashiMr: string;
  date: string;
  panchang: PanchangForRashi;
  transits: Array<{
    planet: string;
    planetMr: string;
    house: number;
    rashi: string;
    dignity: string;
    dignityMr: string;
  }>;
  rating: number;
}

const PLANET_MR_TO_EN: Record<string, string> = {
  "सूर्य": "Sun", "चंद्र": "Moon", "मंगळ": "Mars", "बुध": "Mercury",
  "गुरु": "Jupiter", "शुक्र": "Venus", "शनि": "Saturn",
  "राहु": "Rahu", "केतू": "Ketu", "केतु": "Ketu",
};

const HOUSE_MR_TO_NUM: Record<string, number> = {
  "लग्न": 1, "लग्नात": 1,
  "धन": 2, "धनभाव": 2, "धनभावात": 2,
  "तृतीय": 3, "तृतीयात": 3,
  "चतुर्थ": 4, "चतुर्थात": 4, "सुख": 4, "सुखभाव": 4,
  "पंचम": 5, "पंचमात": 5,
  "षष्ठ": 6, "षष्ठात": 6,
  "सप्तम": 7, "सप्तमात": 7,
  "अष्टम": 8, "अष्टमात": 8,
  "नवम": 9, "नवमात": 9, "भाग्य": 9, "भाग्यभाव": 9,
  "दशम": 10, "दशमात": 10, "कर्म": 10, "कर्मभाव": 10,
  "एकादश": 11, "एकादशात": 11, "लाभ": 11, "लाभभाव": 11,
  "द्वादश": 12, "द्वादशात": 12, "व्यय": 12, "व्ययभाव": 12,
};

/** Build the Gemini prompt with system instructions + structured ground truth. */
function buildPrompt(gt: GroundTruth): { system: string; user: string } {
  const system = `तू मराठीतील पारंगत ज्योतिषी आहेस. दिलेल्या ग्रहस्थिती आणि पंचांगावर आधारित इंस्टाग्रामसाठी आकर्षक राशिभविष्य लिही.

कठोर नियम:
- फक्त दिलेल्या माहितीचा वापर कर
- दिलेल्या घरात नसलेल्या ग्रहाचा उल्लेख करू नको
- चुकीचे घर/राशी/नक्षत्र लिहू नको
- प्रत्येक परिच्छेद 25-35 शब्द
- सुरुवात आकर्षक (hook-style) करा
- शुद्ध मराठी — हिंदी/इंग्रजी शब्द टाळ
- भावनिक स्पर्श, उबदार स्वर

आउटपुट फॉरमॅट (JSON only, no markdown fences):
{
  "overall": "...",
  "career": "...",
  "love": "...",
  "health": "...",
  "advice": "...",
  "luckyColor": "...",
  "luckyNumber": 1-9
}`;

  const transitsList = gt.transits
    .map((t) => `${t.planetMr}: ${t.rashi} (${t.house}व्या भावात, ${t.dignityMr})`)
    .join("\n  ");

  const user = `राशी: ${gt.rashiMr}
दिनांक: ${gt.date}
रेटिंग (1-5): ${gt.rating}

पंचांग:
  तिथी: ${gt.panchang.paksha} ${gt.panchang.tithi}
  नक्षत्र: ${gt.panchang.nakshatra} (स्वामी ${gt.panchang.nakshatraLord})
  वार: ${gt.panchang.vaar} (स्वामी ${gt.panchang.vaarLord} — ${gt.panchang.vaarNature})
  योग: ${gt.panchang.yoga}
  करण: ${gt.panchang.karana}

${gt.rashiMr} राशीसाठी:
  चंद्र बल: ${gt.panchang.chandraBala}  (चंद्र ${gt.panchang.moonHouseFromRashi}व्या भावात)
  तारा बल: ${gt.panchang.tarabalaMr} — ${gt.panchang.tarabalaEffect}

ग्रह स्थिती:
  ${transitsList}

या सर्व माहितीचा वापर करून चार परिच्छेद लिही: overall / career / love / health. शेवटी advice + लकी रंग + लकी अंक.`;

  return { system, user };
}

/** Extract planet-house claims from Marathi prose and verify vs ground truth. */
function validateFactClaims(prose: string, gt: GroundTruth): string[] {
  const issues: string[] = [];
  const houseMap = new Map<string, number>();
  for (const t of gt.transits) houseMap.set(t.planetMr, t.house);

  // Scan "<planet> <house>व्या भावात" / "<planet> <houseKeyword>ात" / "<planet> <house>मध्ये"
  const regex = /(सूर्य|चंद्र|मंगळ|बुध|गुरु|शुक्र|शनि|राहु|केतू|केतु)\s+([\u0900-\u097F\d]+)(व्या भावात|व्या स्थानी|ात|भावात|स्थानी|मध्ये|स्थित)?/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(prose)) !== null) {
    const planetMr = m[1];
    const houseToken = m[2];
    const actualHouse = houseMap.get(planetMr);
    if (actualHouse === undefined) continue;

    // Try numeric first (e.g. "10" or "१०")
    const num = parseInt(houseToken, 10);
    if (!isNaN(num)) {
      if (num !== actualHouse) issues.push(`${planetMr} claimed ${num}th house, actual ${actualHouse}`);
      continue;
    }
    // Devanagari numerals
    const devNum = houseToken.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)));
    const parsed = parseInt(devNum, 10);
    if (!isNaN(parsed)) {
      if (parsed !== actualHouse) issues.push(`${planetMr} claimed ${parsed}th house, actual ${actualHouse}`);
      continue;
    }
    // Marathi keyword lookup
    const mappedHouse = HOUSE_MR_TO_NUM[houseToken];
    if (mappedHouse !== undefined && mappedHouse !== actualHouse) {
      issues.push(`${planetMr} claimed ${houseToken} (${mappedHouse}), actual ${actualHouse}`);
    }
  }
  return issues;
}

/** Build gochar state → ground truth JSON for a given date + rashi. */
export function buildGroundTruth(
  date: Date,
  rashiId: number,
  transitPlanets: TransitPlanet[],
): GroundTruth {
  const gochar = calculateGochar(transitPlanets, rashiId);
  const panchang = buildPanchangForRashi(date, rashiId);

  const transitsForPrompt = gochar.transits.map((t) => ({
    planet: t.planet,
    planetMr: t.planetMr,
    house: t.house,
    rashi: transitPlanets.find((p) => p.id === t.planet)?.rashiIndex !== undefined
      ? ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"][transitPlanets.find((p) => p.id === t.planet)!.rashiIndex]
      : "",
    dignity: t.dignity,
    dignityMr: t.dignityMr,
  }));

  return {
    rashiId,
    rashiMr: panchang.rashiMr,
    date: panchang.date,
    panchang,
    transits: transitsForPrompt,
    rating: gochar.rating,
  };
}

interface LLMResponse {
  overall: string;
  career: string;
  love: string;
  health: string;
  advice: string;
  luckyColor: string;
  luckyNumber: number;
}

function parseLLMJson(raw: string): LLMResponse | null {
  // Strip markdown fences if present
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }
  try {
    const parsed = JSON.parse(s);
    if (
      typeof parsed.overall === "string" &&
      typeof parsed.career === "string" &&
      typeof parsed.love === "string" &&
      typeof parsed.health === "string"
    ) {
      return parsed as LLMResponse;
    }
  } catch {
    return null;
  }
  return null;
}

/** Basic non-Marathi leak check — if >5 ASCII words per paragraph, reject. */
function hasEnglishLeak(text: string): boolean {
  const asciiWords = text.match(/[a-zA-Z]{3,}/g) ?? [];
  return asciiWords.length > 5;
}

/** Template fallback — builds prose from gochar narrative. */
function templateFallback(gt: GroundTruth, narrative: { mr: string; en: string }, luckyColor: string, luckyNumber: number): GeneratedRashifal {
  const paras = narrative.mr.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  return {
    overall: paras[0] ?? "आज दिवसाची ऊर्जा संमिश्र आहे.",
    career: paras[1] ?? "नियमित कामात स्थिरता ठेवा.",
    love: paras[2] ?? "नात्यांत शांतता राहील.",
    health: paras[3] ?? "आरोग्य स्थिर.",
    advice: "संयम ठेवा, दिवसाच्या प्रवाहाशी जुळवून घ्या.",
    luckyColor,
    luckyNumber,
    rating: gt.rating,
    source: "template-fallback",
    audit: { groundTruth: gt },
  };
}

/**
 * Main entry point: generate rashifal for a given date + rashi.
 * Uses LLM with up to 2 retries; falls back to gochar template on failure.
 */
export async function generateDailyRashifal(
  date: Date,
  rashiId: number,
  transitPlanets: TransitPlanet[],
  narrative: { mr: string; en: string },
  luckyColor: string,
  luckyNumber: number,
): Promise<GeneratedRashifal> {
  const gt = buildGroundTruth(date, rashiId, transitPlanets);

  // Curated override removed — every date now goes to LLM. Curated file is
  // stale and tied to a single hardcoded date. LLM + validator gives fresh,
  // date-accurate prose daily.

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return templateFallback(gt, narrative, luckyColor, luckyNumber);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const { system, user } = buildPrompt(gt);
  const model = genAI.getGenerativeModel({
    model: getModelName(),
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  const issuesAll: string[][] = [];
  let rawOutput = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(
        attempt === 1
          ? user
          : `${user}\n\nमागील प्रयत्नात खालील चुका होत्या. त्या टाळ:\n${issuesAll[issuesAll.length - 1].join("\n")}`,
      );
      rawOutput = result.response.text();
      const parsed = parseLLMJson(rawOutput);
      if (!parsed) {
        issuesAll.push(["JSON parse failed"]);
        continue;
      }

      // Validate
      const issues: string[] = [];
      for (const key of ["overall", "career", "love", "health"] as const) {
        const text = parsed[key];
        if (!text || text.length < 30) issues.push(`${key} too short`);
        if (text && text.length > 400) issues.push(`${key} too long`);
        if (text && hasEnglishLeak(text)) issues.push(`${key} has English leak`);
        if (text) issues.push(...validateFactClaims(text, gt));
      }

      if (issues.length === 0) {
        // Log token usage for cost visibility — helps calibrate spend.
        const meta = result.response.usageMetadata;
        if (meta) {
          const inTok = meta.promptTokenCount ?? 0;
          const outTok = meta.candidatesTokenCount ?? 0;
          const thinkTok = meta.thoughtsTokenCount ?? 0;
          const totalOut = outTok + thinkTok;
          // 2.5 Pro: $1.25/M in, $10/M out (thinking counts as output).
          const costUSD = (inTok * 1.25 + totalOut * 10) / 1_000_000;
          const costINR = (costUSD * 83).toFixed(3);
          console.log(`  [tokens] in=${inTok} out=${outTok} thinking=${thinkTok} total_out=${totalOut} · cost ₹${costINR}`);
        }
        return {
          overall: parsed.overall,
          career: parsed.career,
          love: parsed.love,
          health: parsed.health,
          advice: parsed.advice ?? "संयम ठेवा.",
          luckyColor: parsed.luckyColor ?? luckyColor,
          luckyNumber: Number(parsed.luckyNumber) || luckyNumber,
          rating: gt.rating,
          source: "llm-validated",
          audit: { groundTruth: gt, llmRawOutput: rawOutput, attempts: attempt },
        };
      }
      issuesAll.push(issues);
    } catch (err) {
      issuesAll.push([`API error: ${err instanceof Error ? err.message : String(err)}`]);
    }
  }

  // All attempts failed → template fallback
  const fallback = templateFallback(gt, narrative, luckyColor, luckyNumber);
  fallback.audit.llmRawOutput = rawOutput;
  fallback.audit.validationIssues = issuesAll.flat();
  fallback.audit.attempts = 3;
  return fallback;
}
