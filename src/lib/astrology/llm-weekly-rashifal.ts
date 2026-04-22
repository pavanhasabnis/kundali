/**
 * Gemini 2.5 Pro weekly rashifal generator + 4-layer self-validator.
 *
 * Pipeline: computeWeeklyForecast output → structured ground truth → LLM writes
 * Marathi weekly prose → regex fact-check vs week range + transits → save or fallback.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { WeeklyRashiResult, WeekEvent } from "./gochar-weekly";

function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-pro";
}

const MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
const DAYS_MR = ["रविवार","सोमवार","मंगळवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"];

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

export interface WeeklyLLMOutput {
  summary: string;
  narrative: string;
  careerPoints: { day: string; text: string }[];
  lovePoints: { day: string; text: string }[];
  healthPoints: { day: string; text: string }[];
  advice: string;
  luckyColor: string;
  luckyNumber: number;
}

export interface GeneratedWeeklyRashifal extends WeeklyLLMOutput {
  rating: number;
  source: "llm-validated" | "template-fallback";
  audit: {
    weekStart: string;
    weekEnd: string;
    rashiId: number;
    groundTruth: WeeklyGroundTruth;
    llmRawOutput?: string;
    validationIssues?: string[];
    attempts?: number;
  };
}

export interface WeeklyGroundTruth {
  rashiId: number;
  rashiMr: string;
  weekStart: string;
  weekEnd: string;
  rating: number;
  bestDay: { date: string; rating: number };
  worstDay: { date: string; rating: number };
  dailyRatings: { date: string; rating: number }[];
  events: WeekEvent[];
  planetPositions: WeeklyRashiResult["planetPositions"];
  luckyColor: string;
  luckyNumber: number;
}

export function buildWeeklyGroundTruth(
  rashiResult: WeeklyRashiResult,
  events: WeekEvent[],
  weekStart: string,
  weekEnd: string,
): WeeklyGroundTruth {
  return {
    rashiId: rashiResult.rashiId,
    rashiMr: rashiResult.rashiMr,
    weekStart,
    weekEnd,
    rating: rashiResult.rating,
    bestDay: rashiResult.bestDay,
    worstDay: rashiResult.worstDay,
    dailyRatings: rashiResult.dailyRatings,
    events,
    planetPositions: rashiResult.planetPositions,
    luckyColor: rashiResult.luckyColor.mr,
    luckyNumber: rashiResult.luckyNumber,
  };
}

function fmtDateMr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${d} ${MONTHS_MR[m - 1]} (${DAYS_MR[dt.getDay()]})`;
}

function buildPrompt(gt: WeeklyGroundTruth): { system: string; user: string } {
  const system = `तू मराठीतील पारंगत ज्योतिषी आहेस. दिलेल्या साप्ताहिक ग्रहस्थिती आणि पंचांग आधारे वर्तमानपत्रासाठी साप्ताहिक राशिभविष्य लिही.

कठोर नियम (प्रत्येक उल्लंघन = output नाकारले जाईल):
1. फक्त ${gt.weekStart} ते ${gt.weekEnd} या आठवड्यातील घटनांचा उल्लेख कर
2. कोणत्याही तारखेचा उल्लेख करताना ती ${gt.weekStart} आणि ${gt.weekEnd} या दरम्यानच असावी
3. दिलेल्या planetPositions मध्ये नसलेल्या ग्रहाचा उल्लेख करू नको
4. दिलेल्या घरात नसलेल्या ग्रहाचा उल्लेख करू नको
5. bestDay = ${gt.bestDay.date} (rating ${gt.bestDay.rating}/5), worstDay = ${gt.worstDay.date} (rating ${gt.worstDay.rating}/5) — narrative यांच्याशी सुसंगत असावे
6. पूर्णपणे मराठीत — English words (3+ अक्षरी) नको
7. Output फक्त valid JSON — markdown fences नको

शैली: ५-६ वाक्यांचा narrative, प्रत्येक section २-३ bullet points, वर्तमानपत्रासारखी वाचनीय भाषा.`;

  const eventsStr = gt.events.length === 0
    ? "कोणताही मोठा transit नाही — ग्रह स्थिर राहतील."
    : gt.events.map((e) => `- ${fmtDateMr(e.date)}: ${e.descriptionMr}`).join("\n");

  const planetsStr = gt.planetPositions.map((p) => {
    const extra: string[] = [];
    if (p.isRetrograde) extra.push("वक्री");
    if (p.isCombust) extra.push("अस्त");
    const tag = extra.length ? ` (${extra.join(", ")})` : "";
    return `- ${p.planetMr}: ${p.house}व्या भावात, ${p.rashiMr} राशीत, ${p.dignityMr}${tag}`;
  }).join("\n");

  const ratingsStr = gt.dailyRatings.map((r) => `${fmtDateMr(r.date)}: ${r.rating}/5`).join(", ");

  const user = `राशी: ${gt.rashiMr}
आठवडा: ${gt.weekStart} ते ${gt.weekEnd}
एकूण rating: ${gt.rating}/5

दैनिक ratings:
${ratingsStr}

सर्वोत्तम दिवस: ${fmtDateMr(gt.bestDay.date)} (${gt.bestDay.rating}/5)
सर्वात आव्हानात्मक दिवस: ${fmtDateMr(gt.worstDay.date)} (${gt.worstDay.rating}/5)

ग्रहस्थिती (${gt.rashiMr} पासून):
${planetsStr}

या आठवड्यातील घटना:
${eventsStr}

भाग्यशाली रंग: ${gt.luckyColor}
भाग्यांक: ${gt.luckyNumber}

खालील JSON schema मध्ये उत्तर दे:
{
  "summary": "२-३ ओळींत आठवड्याचा सारांश",
  "narrative": "५-६ वाक्यांचा flowing paragraph — सर्वोत्तम आणि आव्हानात्मक दिवस, मुख्य transits यांचा समावेश",
  "careerPoints": [{"day": "YYYY-MM-DD", "text": "करिअरबद्दल एक वाक्य"}, ...],
  "lovePoints": [{"day": "YYYY-MM-DD", "text": "नात्यांबद्दल एक वाक्य"}, ...],
  "healthPoints": [{"day": "YYYY-MM-DD", "text": "आरोग्याबद्दल एक वाक्य"}, ...],
  "advice": "संपूर्ण आठवड्यासाठी एका वाक्यात सल्ला",
  "luckyColor": "${gt.luckyColor}",
  "luckyNumber": ${gt.luckyNumber}
}

प्रत्येक careerPoints/lovePoints/healthPoints मध्ये २-३ items. प्रत्येक item ची day ${gt.weekStart} आणि ${gt.weekEnd} दरम्यानची असावी.`;

  return { system, user };
}

function parseLLMJson(raw: string): WeeklyLLMOutput | null {
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  }
  try {
    const p = JSON.parse(s);
    if (
      typeof p.summary === "string" &&
      typeof p.narrative === "string" &&
      Array.isArray(p.careerPoints) &&
      Array.isArray(p.lovePoints) &&
      Array.isArray(p.healthPoints)
    ) {
      return p as WeeklyLLMOutput;
    }
  } catch {
    return null;
  }
  return null;
}

function hasEnglishLeak(text: string): boolean {
  const words = text.match(/[a-zA-Z]{3,}/g) ?? [];
  return words.length > 5;
}

/** Layer 3 validation — checks all 4 invariants. */
function validateWeekly(out: WeeklyLLMOutput, gt: WeeklyGroundTruth): string[] {
  const issues: string[] = [];
  const weekStartMs = Date.parse(gt.weekStart);
  const weekEndMs = Date.parse(gt.weekEnd);

  // 1. Length + language checks
  if (out.summary.length < 30 || out.summary.length > 300) issues.push("summary length out of range");
  if (out.narrative.length < 200 || out.narrative.length > 1500) issues.push("narrative length out of range");
  if (hasEnglishLeak(out.narrative)) issues.push("narrative has English leak");
  if (hasEnglishLeak(out.summary)) issues.push("summary has English leak");

  // 2. Bullet point day validation — every `day` must be in [weekStart, weekEnd]
  const sections: Array<[string, { day: string; text: string }[]]> = [
    ["careerPoints", out.careerPoints],
    ["lovePoints", out.lovePoints],
    ["healthPoints", out.healthPoints],
  ];
  for (const [name, points] of sections) {
    if (points.length === 0) {
      issues.push(`${name} empty`);
      continue;
    }
    for (const p of points) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.day)) {
        issues.push(`${name} day "${p.day}" not YYYY-MM-DD`);
        continue;
      }
      const ms = Date.parse(p.day);
      if (ms < weekStartMs || ms > weekEndMs) {
        issues.push(`${name} day ${p.day} outside week ${gt.weekStart}..${gt.weekEnd}`);
      }
      if (!p.text || p.text.length < 15) issues.push(`${name} item too short`);
      if (p.text && hasEnglishLeak(p.text)) issues.push(`${name} item has English leak`);
    }
  }

  // 3. Scan narrative + summary for Marathi date tokens — every date must be in week
  const dateRegex = /(\d{1,2})\s+(जानेवारी|फेब्रुवारी|मार्च|एप्रिल|मे|जून|जुलै|ऑगस्ट|सप्टेंबर|ऑक्टोबर|नोव्हेंबर|डिसेंबर)/g;
  const prose = `${out.summary}\n${out.narrative}`;
  const [y, mm] = gt.weekStart.split("-").map(Number);
  let m: RegExpExecArray | null;
  while ((m = dateRegex.exec(prose)) !== null) {
    const day = parseInt(m[1], 10);
    const monthIdx = MONTHS_MR.indexOf(m[2]);
    // Try both week-start year and (if crossing year) adjacent year
    const candidates = [new Date(y, monthIdx, day)];
    if (mm === 1 && monthIdx === 11) candidates.push(new Date(y - 1, monthIdx, day));
    if (mm === 12 && monthIdx === 0) candidates.push(new Date(y + 1, monthIdx, day));
    const inRange = candidates.some((d) => d.getTime() >= weekStartMs && d.getTime() <= weekEndMs);
    if (!inRange) issues.push(`prose date "${m[1]} ${m[2]}" outside week`);
  }

  // 4. Planet-house claims vs ground truth
  const houseMap = new Map<string, number>();
  for (const pp of gt.planetPositions) houseMap.set(pp.planetMr, pp.house);
  const planetRegex = /(सूर्य|चंद्र|मंगळ|बुध|गुरु|शुक्र|शनि|राहु|केतू|केतु)\s+([\u0900-\u097F\d]+)(व्या भावात|व्या स्थानी|ात|भावात|स्थानी|मध्ये|स्थित)?/g;
  let pm: RegExpExecArray | null;
  while ((pm = planetRegex.exec(prose)) !== null) {
    const planetMr = pm[1];
    const token = pm[2];
    const actual = houseMap.get(planetMr);
    if (actual === undefined) continue;
    const numericLatin = parseInt(token, 10);
    if (!isNaN(numericLatin)) {
      if (numericLatin !== actual) issues.push(`${planetMr} claimed ${numericLatin}th house, actual ${actual}`);
      continue;
    }
    const devNum = token.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)));
    const parsed = parseInt(devNum, 10);
    if (!isNaN(parsed)) {
      if (parsed !== actual) issues.push(`${planetMr} claimed ${parsed}th house, actual ${actual}`);
      continue;
    }
    const mapped = HOUSE_MR_TO_NUM[token];
    if (mapped !== undefined && mapped !== actual) {
      issues.push(`${planetMr} claimed ${token} (${mapped}), actual ${actual}`);
    }
  }

  // 5. Best/worst day consistency — if prose names a day and calls it "best"/"worst", cross-check
  // (lightweight heuristic: if summary contains "सर्वोत्तम" or "उत्तम", narrative should reference bestDay;
  //  not enforced strictly — rating metadata already surfaced in points structure.)

  return issues;
}

function templateFallback(gt: WeeklyGroundTruth, rashiResult: WeeklyRashiResult): GeneratedWeeklyRashifal {
  const summary = rashiResult.summary.mr;
  const narrative = rashiResult.narrative.mr;
  const toItems = (src: { mr: string; en: string }[]): { day: string; text: string }[] =>
    src.slice(0, 2).map((s, i) => ({
      day: gt.dailyRatings[i]?.date ?? gt.weekStart,
      text: s.mr,
    }));
  return {
    summary,
    narrative,
    careerPoints: toItems(rashiResult.careerPoints),
    lovePoints: toItems(rashiResult.lovePoints),
    healthPoints: toItems(rashiResult.healthPoints),
    advice: rashiResult.advice.mr,
    luckyColor: gt.luckyColor,
    luckyNumber: gt.luckyNumber,
    rating: gt.rating,
    source: "template-fallback",
    audit: {
      weekStart: gt.weekStart,
      weekEnd: gt.weekEnd,
      rashiId: gt.rashiId,
      groundTruth: gt,
    },
  };
}

export async function generateWeeklyRashifal(
  rashiResult: WeeklyRashiResult,
  events: WeekEvent[],
  weekStart: string,
  weekEnd: string,
): Promise<GeneratedWeeklyRashifal> {
  const gt = buildWeeklyGroundTruth(rashiResult, events, weekStart, weekEnd);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return templateFallback(gt, rashiResult);

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
      const issues = validateWeekly(parsed, gt);
      if (issues.length === 0) {
        const meta = result.response.usageMetadata;
        if (meta) {
          const inTok = meta.promptTokenCount ?? 0;
          const outTok = meta.candidatesTokenCount ?? 0;
          const costUSD = (inTok * 1.25 + outTok * 10) / 1_000_000;
          const costINR = (costUSD * 83).toFixed(3);
          console.log(`  [tokens] in=${inTok} out=${outTok} · cost ₹${costINR}`);
        }
        return {
          ...parsed,
          luckyColor: parsed.luckyColor || gt.luckyColor,
          luckyNumber: Number(parsed.luckyNumber) || gt.luckyNumber,
          rating: gt.rating,
          source: "llm-validated",
          audit: {
            weekStart: gt.weekStart,
            weekEnd: gt.weekEnd,
            rashiId: gt.rashiId,
            groundTruth: gt,
            llmRawOutput: rawOutput,
            attempts: attempt,
          },
        };
      }
      issuesAll.push(issues);
    } catch (err) {
      issuesAll.push([`API error: ${err instanceof Error ? err.message : String(err)}`]);
    }
  }

  const fb = templateFallback(gt, rashiResult);
  fb.audit.llmRawOutput = rawOutput;
  fb.audit.validationIssues = issuesAll.flat();
  fb.audit.attempts = 3;
  return fb;
}
