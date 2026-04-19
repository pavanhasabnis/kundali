/**
 * Weekly Gochar engine — samples planetary positions across 7 days,
 * detects rashi-transitions / retro stations / combustion events,
 * aggregates daily ratings, composes weekly forecast.
 *
 * Real astrology — no hand-written content. Same engine as daily gochar,
 * widened to a 7-day window.
 */
import swisseph from "swisseph";
import { calculateGochar, type TransitPlanet, type GocharResult } from "./gochar";

const RASHI_MR = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];
const RASHI_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};
const SE_IDS: { id: string; seId: number }[] = [
  { id: "Sun", seId: swisseph.SE_SUN },
  { id: "Moon", seId: swisseph.SE_MOON },
  { id: "Mars", seId: swisseph.SE_MARS },
  { id: "Mercury", seId: swisseph.SE_MERCURY },
  { id: "Jupiter", seId: swisseph.SE_JUPITER },
  { id: "Venus", seId: swisseph.SE_VENUS },
  { id: "Saturn", seId: swisseph.SE_SATURN },
  { id: "Rahu", seId: swisseph.SE_MEAN_NODE },
];
const COMBUST_ORB: Record<string, number> = {
  Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
};

function getSiderealLong(tropical: number, ayanamsa: number): number {
  let s = tropical - ayanamsa;
  if (s < 0) s += 360;
  return s;
}

function computePlanetsForDate(date: Date): TransitPlanet[] {
  // Noon IST Julian Day.
  const timezone = 5.5;
  const jd = swisseph.swe_julday(
    date.getFullYear(), date.getMonth() + 1, date.getDate(),
    12 - timezone, swisseph.SE_GREG_CAL,
  );
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

  const planets: TransitPlanet[] = [];
  let sunLong = 0;
  for (const p of SE_IDS) {
    const r = swisseph.swe_calc_ut(jd, p.seId, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
    if (!("longitude" in r)) continue;
    const sidLong = getSiderealLong(r.longitude, ayanamsa);
    const rashiIndex = Math.floor(sidLong / 30);
    const degreeInSign = sidLong - rashiIndex * 30;
    const speed = "longitudeSpeed" in r ? r.longitudeSpeed : 0;
    if (p.id === "Sun") sunLong = sidLong;
    planets.push({
      id: p.id, rashiIndex, sidLong, degreeInSign, speed,
      isRetrograde: p.id !== "Sun" && p.id !== "Moon" && speed < 0,
      isCombust: false,
    });
  }
  // Ketu = Rahu + 180°
  const rahu = planets.find((p) => p.id === "Rahu")!;
  const ketuLong = (rahu.sidLong! + 180) % 360;
  planets.push({
    id: "Ketu", rashiIndex: (rahu.rashiIndex + 6) % 12,
    sidLong: ketuLong, degreeInSign: ketuLong - Math.floor(ketuLong / 30) * 30,
    speed: rahu.speed, isRetrograde: true, isCombust: false,
  });
  // Combustion
  for (const tp of planets) {
    const orb = COMBUST_ORB[tp.id];
    if (!orb) continue;
    let diff = Math.abs(tp.sidLong! - sunLong);
    if (diff > 180) diff = 360 - diff;
    if (diff <= orb) tp.isCombust = true;
  }
  return planets;
}

export interface WeekEvent {
  date: string;       // YYYY-MM-DD
  type: "rashi-change" | "retrograde-start" | "retrograde-end" | "combust-start" | "combust-end";
  planet: string;
  planetMr: string;
  fromRashiMr?: string;
  toRashiMr?: string;
  fromRashiEn?: string;
  toRashiEn?: string;
  descriptionMr: string;
  descriptionEn: string;
}

export interface WeeklyRashiResult {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  rating: number;              // 1-5 (week average)
  bestDay: { date: string; rating: number };
  worstDay: { date: string; rating: number };
  summary: { mr: string; en: string };                // One-line header.
  narrative: { mr: string; en: string };              // 200-300 word flowing prose.
  careerPoints: { mr: string; en: string }[];
  lovePoints: { mr: string; en: string }[];
  healthPoints: { mr: string; en: string }[];
  advice: { mr: string; en: string };
  dailyRatings: { date: string; rating: number }[];
  luckyColor: { mr: string; en: string };
  luckyNumber: number;
  // Per-rashi planet positions at week midpoint — where each planet sits from this rashi.
  planetPositions: {
    planet: string;
    planetMr: string;
    rashiMr: string;
    rashiEn: string;
    house: number;
    dignity: string;
    dignityMr: string;
    isRetrograde: boolean;
    isCombust: boolean;
  }[];
}

export interface WeeklyForecast {
  weekStart: string;           // Monday YYYY-MM-DD
  weekEnd: string;             // Sunday YYYY-MM-DD
  events: WeekEvent[];
  predictions: WeeklyRashiResult[];
}

// Return Monday of the week containing the given date (IST).
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const dow = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const offsetToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offsetToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDateMr(d: Date): string {
  const digits = "०१२३४५६७८९";
  const day = String(d.getDate()).replace(/\d/g, (c) => digits[parseInt(c)]);
  const months = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
  return `${day} ${months[d.getMonth()]}`;
}

// ─── Narrative composer — 200-300 word weekly prose from transit data ────
// Each paragraph built from real planet positions + week events + best/worst days.
// No hand-written content per rashi — everything derived from today's sky.

interface NarrativeInput {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  rating: number;
  planetPositions: {
    planet: string; planetMr: string; rashiMr: string; rashiEn: string;
    house: number; dignity: string; dignityMr: string;
    isRetrograde: boolean; isCombust: boolean;
  }[];
  events: WeekEvent[];
  bestDayLabelMr: string;
  bestDayLabelEn: string;
  worstDayLabelMr: string;
  worstDayLabelEn: string;
}

const HOUSE_NAME_MR: Record<number, string> = {
  1: "लग्न", 2: "धन", 3: "पराक्रम", 4: "सुख", 5: "पुत्र", 6: "रिपु",
  7: "कलत्र", 8: "आयुष्य", 9: "भाग्य", 10: "कर्म", 11: "लाभ", 12: "व्यय",
};

const GOOD_FOR_PLANET: Record<string, number[]> = {
  Sun: [3, 6, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11], Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12], Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11], Ketu: [3, 6, 11],
};

// Opening paragraph — pure outcome language, no planet/house jargon.
function composeOpeningMr(n: NarrativeInput): string {
  const { rashiMr, rating, planetPositions, events } = n;
  const tone = rating >= 4
    ? `या आठवड्यात ${rashiMr} राशीच्या व्यक्तींसाठी सकारात्मक वातावरण आहे.`
    : rating === 3
    ? `या आठवड्यात ${rashiMr} राशीच्या व्यक्तींसाठी दिवस मिश्र असले तरी संधी समोर उभ्या आहेत.`
    : `या आठवड्यात ${rashiMr} राशीच्या व्यक्तींनी आव्हानांना धीराने सामोरे जावे लागेल.`;

  const sun = planetPositions.find((p) => p.planet === "Sun")!;
  const jup = planetPositions.find((p) => p.planet === "Jupiter")!;

  // Only highlight dignity when the planet is ALSO in a favorable house for THIS rashi —
  // otherwise a "Sun exalted = confidence" line contradicts a low rashi rating.
  const sunHouseGood = GOOD_FOR_PLANET.Sun!.includes(sun.house);
  const jupHouseGood = GOOD_FOR_PLANET.Jupiter!.includes(jup.house);
  let second = "";
  if (sun.dignity === "exalted" && sunHouseGood) {
    second = " आत्मविश्वास शिखरावर राहील, नेतृत्वगुण समोर येतील आणि समाजात प्रतिष्ठा वाढेल.";
  } else if (sun.dignity === "exalted" && !sunHouseGood) {
    second = " आत्मविश्वास असला तरी तो योग्य दिशेने वळवण्याची गरज आहे — बाह्य यशापेक्षा आंतरिक समाधानावर लक्ष द्या.";
  } else if (sun.dignity === "debilitated") {
    second = " आत्मविश्वासावर थोडा परिणाम होऊ शकतो, पण अंतर्गत प्रेरणा कायम राहील; निर्णयांत घाई टाळा.";
  } else if ((jup.dignity === "exalted" || jup.dignity === "own") && jupHouseGood) {
    second = " ज्ञान, आर्थिक संधी आणि ज्येष्ठांकडून मिळणारे मार्गदर्शन या आठवड्याचे प्रमुख आधार ठरतील.";
  } else if (rating <= 2) {
    second = " काही बाबतींत धीर धरावा लागेल; नियतीने नियंत्रण स्वतःच्या हातात न ठेवता वेळेवर सोपवणे उपयुक्त ठरेल.";
  } else {
    second = " जीवनाच्या वेगवेगळ्या क्षेत्रांत समतोल राखण्याचा हा काळ आहे; योग्य कृती दीर्घकालीन फायदेशीर ठरेल.";
  }

  const moonEvt = events.find((e) => e.type === "rashi-change" && e.planet === "Moon" && e.toRashiMr === n.rashiMr);
  const sunEvt = events.find((e) => e.type === "rashi-change" && e.planet === "Sun");
  const bigEvt = events.find((e) => e.type === "rashi-change" && (e.planet === "Jupiter" || e.planet === "Saturn"));
  let third = "";
  if (moonEvt) {
    third = " आठवड्याच्या मध्याला मानसिक स्पष्टता वाढेल आणि अंतर्ज्ञान तीक्ष्ण होईल — महत्त्वाच्या निर्णयांसाठी तोच क्षण सर्वोत्तम.";
  } else if (sunEvt && sunHouseGood) {
    third = " वातावरणात नवीन ऊर्जा येईल आणि जुन्या कामांना चालना मिळेल.";
  } else if (sunEvt && !sunHouseGood) {
    third = " सौम्य बदलांचा प्रारंभ — त्यांचा खरा परिणाम पुढील आठवड्यांत दिसेल.";
  } else if (bigEvt) {
    third = " एका मोठ्या बदलाची सुरुवात होत आहे — त्याचा दीर्घकालीन परिणाम पुढील काही महिने जाणवेल.";
  }
  return tone + second + third;
}

// Career paragraph — outcome language only.
function composeCareerMr(n: NarrativeInput): string {
  const careerHouses = new Set([2, 6, 10, 11]);
  const cp = n.planetPositions.filter((p) => careerHouses.has(p.house));
  const sun = n.planetPositions.find((p) => p.planet === "Sun")!;
  const mars = n.planetPositions.find((p) => p.planet === "Mars")!;
  const merc = n.planetPositions.find((p) => p.planet === "Mercury")!;
  const sat = n.planetPositions.find((p) => p.planet === "Saturn")!;

  const parts: string[] = [`करिअर व आर्थिक क्षेत्र:`];
  const goodCount = cp.filter((p) => GOOD_FOR_PLANET[p.planet]?.includes(p.house)).length;
  const badCount = cp.length - goodCount;

  if (goodCount > badCount && goodCount >= 2) {
    parts.push("व्यावसायिक प्रगतीच्या संधी अनेक ठिकाणांहून येतील — नवीन प्रकल्प, पदोन्नती किंवा आर्थिक लाभ यापैकी एखादी गोष्ट प्रत्यक्षात उतरण्याची शक्यता आहे.");
  } else if (badCount > goodCount) {
    parts.push("कामाच्या ठिकाणी काही अडथळे जाणवतील — वरिष्ठांशी संयमाने बोला, घाईघाईचे निर्णय टाळा.");
  } else {
    parts.push("नियमित कामात स्थिर प्रगती दिसेल; मोठ्या बदलांऐवजी सातत्य लाभदायक ठरेल.");
  }

  if (merc.dignity === "debilitated" && careerHouses.has(merc.house)) {
    parts.push("व्यापार किंवा संवाद-आधारित कामांत जरा सावधगिरी बाळगावी लागेल — कागदपत्रे, करार दुहेरी तपासा.");
  }
  if (mars.isRetrograde === false && careerHouses.has(mars.house) && !GOOD_FOR_PLANET.Mars!.includes(mars.house)) {
    parts.push("सहकाऱ्यांशी किंवा वरिष्ठांशी मतभेद होऊ शकतात; शांत डोके ठेवा.");
  }
  if (sat.house === 10) {
    parts.push("मेहनतीचे फळ त्वरित न मिळता टप्प्याटप्प्याने समोर येईल — संयम हीच किल्ली.");
  }
  if (sun.dignity === "exalted") {
    parts.push("प्रतिष्ठेच्या कामांमध्ये, सरकारी व्यवहारांत किंवा अधिकाराच्या जागांवर सकारात्मक प्रतिसाद मिळेल.");
  }
  parts.push(`महत्त्वाचे व्यावसायिक निर्णय ${n.bestDayLabelMr} दिवशी घेतल्यास अनुकूल फळ मिळेल; ${n.worstDayLabelMr} दिवशी मोठे करार टाळा.`);
  return parts.join(" ");
}

// Love / relationships paragraph — pure outcome language.
function composeLoveMr(n: NarrativeInput): string {
  const venus = n.planetPositions.find((p) => p.planet === "Venus")!;
  const mars = n.planetPositions.find((p) => p.planet === "Mars")!;
  const moon = n.planetPositions.find((p) => p.planet === "Moon")!;
  const parts: string[] = [`प्रेम व कुटुंब:`];

  if (venus.dignity === "exalted" || venus.dignity === "own") {
    parts.push("जोडीदाराशी संवाद अधिक गोड होईल; सौंदर्य, कला व घरगुती सजावटीतून आनंद मिळेल.");
  } else if (venus.dignity === "debilitated") {
    parts.push("नातेसंबंधांत थोडा गैरसमज होऊ शकतो — स्पष्ट आणि शांतपणे बोला.");
  } else {
    parts.push("जोडीदाराबरोबर मौन वेळ किंवा छोटासा प्रवास नात्याला नवी उर्जा देईल.");
  }

  const loveAffliction = [4, 5, 7].includes(mars.house);
  if (loveAffliction) {
    parts.push("कुटुंबात वा जोडीदाराशी मतभेदाच्या प्रसंगांत कठोर शब्द टाळा; राग व्यक्त करण्याऐवजी संभाषण निवडा.");
  } else {
    parts.push("कौटुंबिक वातावरण शांत आणि उबदार राहील; ज्येष्ठांचा आशीर्वाद सोबत असेल.");
  }

  if (moon.isCombust) {
    parts.push("मानसिक चंचलता जाणवल्यास एकट्यात वेळ घालवा — निसर्ग, ध्यान किंवा कुटुंबासह शांत संध्याकाळ उपयुक्त ठरेल.");
  } else if ([5, 7].includes(moon.house)) {
    parts.push("मध्य आठवड्यात भावनिक जवळीक वाढण्याची शक्यता आहे.");
  }
  return parts.join(" ");
}

// Health paragraph — pure outcome language.
function composeHealthMr(n: NarrativeInput): string {
  const hp = n.planetPositions.filter((p) => [6, 8, 12].includes(p.house));
  const moon = n.planetPositions.find((p) => p.planet === "Moon")!;
  const mars = n.planetPositions.find((p) => p.planet === "Mars")!;
  const parts: string[] = [`आरोग्य:`];

  if (hp.length === 0) {
    parts.push("आरोग्य स्थिर राहील; नियमित दिनचर्या आणि पुरेशी झोप पुरेशी आहे.");
  } else {
    const has8 = hp.some((p) => p.house === 8);
    const has12 = hp.some((p) => p.house === 12);
    const has6 = hp.some((p) => p.house === 6);
    if (has12) parts.push("झोप, विश्रांती आणि मानसिक शांतीकडे लक्ष द्या — रात्री लवकर झोपण्याचा नियम करा.");
    if (has8) parts.push("अनपेक्षित आरोग्य समस्यांपासून सावधगिरी बाळगा; नियमित तपासणी उपयुक्त ठरेल.");
    if (has6) parts.push("पचनसंस्था व रोगप्रतिकारकशक्ती यांवर लक्ष — हलका आहार आणि भरपूर पाणी.");
  }
  if (moon.isCombust) {
    parts.push("मानसिक थकवा किंवा चंचलता जाणवल्यास ध्यान आणि प्राणायाम नियमित करा.");
  }
  if (mars.dignity === "exalted" || mars.dignity === "own") {
    parts.push("शारीरिक ऊर्जा उच्च राहील — व्यायाम, खेळ, प्रवास फायदेशीर.");
  }
  parts.push("पित्तवर्धक व तिखट पदार्थ टाळा, रोज १५–२० मिनिटे चालणे किंवा योगा नित्य ठेवा.");
  return parts.join(" ");
}

// Closing paragraph — tactical advice + weekly mantra.
function composeClosingMr(n: NarrativeInput): string {
  const tipByRating = n.rating >= 4
    ? `आठवडा एकूणच फलदायी. ${n.bestDayLabelMr} दिवशी नवीन सुरुवात, करार व गुंतवणूक यशस्वी ठरू शकते.`
    : n.rating === 3
    ? `मिश्र आठवडा — सर्वोत्तम दिवस ${n.bestDayLabelMr}, सर्वात सावध दिवस ${n.worstDayLabelMr}. पुढील आठवड्यासाठी योजना तयार करण्याचा चांगला काळ.`
    : `आव्हानात्मक आठवडा — धीर ठेवा, मोठे निर्णय पुढील आठवड्यापर्यंत ढकलल्यास हानी टळेल.`;
  const mantra = n.rating >= 4
    ? "आठवड्याचा मंत्र — आत्मविश्वास + कृती = यश."
    : n.rating === 3
    ? "आठवड्याचा मंत्र — संयम + विवेक = दीर्घकालीन फळ."
    : "आठवड्याचा मंत्र — शांती + प्रतीक्षा = योग्य वेळेचे फळ.";
  return `${tipByRating} ${mantra}`;
}

// English parallel — outcome-first, no planet/house jargon.
function composeOpeningEn(n: NarrativeInput): string {
  const tone = n.rating >= 4
    ? `${n.rashiEn} natives enjoy a supportive and expansive week ahead.`
    : n.rating === 3
    ? `${n.rashiEn} faces a mixed but opportunity-rich week.`
    : `${n.rashiEn} will need patience to navigate this week's challenges.`;
  const sun = n.planetPositions.find((p) => p.planet === "Sun")!;
  const jup = n.planetPositions.find((p) => p.planet === "Jupiter")!;
  const sunHouseGood = GOOD_FOR_PLANET.Sun!.includes(sun.house);
  const jupHouseGood = GOOD_FOR_PLANET.Jupiter!.includes(jup.house);
  let second = "";
  if (sun.dignity === "exalted" && sunHouseGood) second = " Confidence and visibility peak — leadership qualities get noticed in public or professional circles.";
  else if (sun.dignity === "exalted" && !sunHouseGood) second = " Confidence is present but needs the right channel — focus inward on meaning rather than outward validation.";
  else if (sun.dignity === "debilitated") second = " Self-assurance may waver; lean on considered judgment rather than impulse.";
  else if ((jup.dignity === "exalted" || jup.dignity === "own") && jupHouseGood) second = " Learning, financial openings, and wise counsel from elders form the backbone of the week.";
  else if (n.rating <= 2) second = " Patience is asked in several areas; loosen control and let timing work in your favor.";
  else second = " The configuration rewards balance — measured action outperforms bold leaps.";
  const moonEvt = n.events.find((e) => e.type === "rashi-change" && e.planet === "Moon" && e.toRashiEn === n.rashiEn);
  const sunEvt = n.events.find((e) => e.type === "rashi-change" && e.planet === "Sun");
  const bigEvt = n.events.find((e) => e.type === "rashi-change" && (e.planet === "Jupiter" || e.planet === "Saturn"));
  let third = "";
  if (moonEvt) third = " Mid-week brings sharper intuition and mental clarity — time important decisions to that window.";
  else if (sunEvt && sunHouseGood) third = " Fresh energy arrives and long-pending work gains momentum.";
  else if (sunEvt && !sunHouseGood) third = " Subtle shifts begin; their real weight will be felt over the coming weeks.";
  else if (bigEvt) third = " A major long-wave shift begins; its effects unfold over coming months.";
  return tone + second + third;
}
function composeCareerEn(n: NarrativeInput): string {
  const careerHouses = new Set([2, 6, 10, 11]);
  const cp = n.planetPositions.filter((p) => careerHouses.has(p.house));
  const goodCount = cp.filter((p) => GOOD_FOR_PLANET[p.planet]?.includes(p.house)).length;
  const badCount = cp.length - goodCount;
  const merc = n.planetPositions.find((p) => p.planet === "Mercury")!;
  const sat = n.planetPositions.find((p) => p.planet === "Saturn")!;
  const sun = n.planetPositions.find((p) => p.planet === "Sun")!;
  const parts: string[] = [`Career & Finance:`];
  if (goodCount > badCount && goodCount >= 2) {
    parts.push("Multiple openings converge — a new project, promotion, or financial gain is likely to materialize.");
  } else if (badCount > goodCount) {
    parts.push("Expect friction at work; speak carefully with seniors and avoid rushed decisions.");
  } else {
    parts.push("Steady progress in routine work; consistency outweighs drastic change.");
  }
  if (merc.dignity === "debilitated" && careerHouses.has(merc.house)) {
    parts.push("Double-check contracts and communication-heavy tasks — small errors carry high cost.");
  }
  if (sat.house === 10) {
    parts.push("Effort yields results gradually rather than instantly — patience is the key virtue.");
  }
  if (sun.dignity === "exalted") {
    parts.push("Dealings with authority, government, or leadership roles carry positive momentum.");
  }
  parts.push(`Schedule important moves on ${n.bestDayLabelEn}; defer heavy deals on ${n.worstDayLabelEn}.`);
  return parts.join(" ");
}
function composeLoveEn(n: NarrativeInput): string {
  const venus = n.planetPositions.find((p) => p.planet === "Venus")!;
  const mars = n.planetPositions.find((p) => p.planet === "Mars")!;
  const moon = n.planetPositions.find((p) => p.planet === "Moon")!;
  const parts: string[] = [`Love & Family:`];
  if (venus.dignity === "exalted" || venus.dignity === "own") parts.push("Partner conversations flow warmly; creative and home-beautifying pursuits bring joy.");
  else if (venus.dignity === "debilitated") parts.push("Minor misunderstandings possible — prefer plain, calm communication over implication.");
  else parts.push("Quiet shared time or a small outing rekindles the bond.");
  if ([4, 5, 7].includes(mars.house)) parts.push("Avoid sharp words in family disputes; dialogue over reaction.");
  else parts.push("Home environment stays warm; elders' blessings are felt.");
  if (moon.isCombust) parts.push("Emotional restlessness may surface — a quiet evening outdoors or meditation helps.");
  else if ([5, 7].includes(moon.house)) parts.push("Mid-week deepens emotional closeness.");
  return parts.join(" ");
}
function composeHealthEn(n: NarrativeInput): string {
  const hp = n.planetPositions.filter((p) => [6, 8, 12].includes(p.house));
  const moon = n.planetPositions.find((p) => p.planet === "Moon")!;
  const mars = n.planetPositions.find((p) => p.planet === "Mars")!;
  const parts: string[] = [`Health:`];
  if (hp.length === 0) parts.push("Health stays stable with regular routine and adequate sleep.");
  else {
    if (hp.some((p) => p.house === 12)) parts.push("Prioritize sleep, rest, and mental quiet — earlier bedtime helps.");
    if (hp.some((p) => p.house === 8)) parts.push("Guard against sudden flare-ups; a regular check-up is worthwhile.");
    if (hp.some((p) => p.house === 6)) parts.push("Digestion and immunity need attention — light meals and hydration.");
  }
  if (moon.isCombust) parts.push("Mental fatigue may show — consistent meditation and breath-work are a steady anchor.");
  if (mars.dignity === "exalted" || mars.dignity === "own") parts.push("Physical energy runs high — channel it into exercise, sport, or travel.");
  parts.push("Avoid spicy and heavy food, walk 15-20 minutes daily.");
  return parts.join(" ");
}
function composeClosingEn(n: NarrativeInput): string {
  const tip = n.rating >= 4
    ? `Week favors action. ${n.bestDayLabelEn} is best for new starts.`
    : n.rating === 3
    ? `Mixed week. Strongest: ${n.bestDayLabelEn}. Most caution: ${n.worstDayLabelEn}.`
    : `Challenging week — defer major decisions.`;
  const mantra = n.rating >= 4 ? "Mantra: confidence + action = success."
    : n.rating === 3 ? "Mantra: patience + discernment = lasting fruit."
    : "Mantra: peace + patience = right-timed results.";
  return `${tip} ${mantra}`;
}

function composeNarrative(input: NarrativeInput): { mr: string; en: string } {
  // Paragraph break for readable prose blocks.
  const mr = [
    composeOpeningMr(input),
    composeCareerMr(input),
    composeLoveMr(input),
    composeHealthMr(input),
    composeClosingMr(input),
  ].join("\n\n");
  const en = [
    composeOpeningEn(input),
    composeCareerEn(input),
    composeLoveEn(input),
    composeHealthEn(input),
    composeClosingEn(input),
  ].join("\n\n");
  return { mr, en };
}

// Aggregate unique snippets. Dedup key = snippet text BEFORE the "(...)" context note
// so that "बुध धनभावात — ... (नीच राशीत)" appearing 7 times collapses to one entry.
function uniqByBase(items: { mr: string; en: string }[]): { mr: string; en: string }[] {
  const seen = new Set<string>();
  const out: typeof items = [];
  for (const it of items) {
    const key = it.mr.replace(/\s*\([^)]*\)\s*$/, "").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

export function computeWeeklyForecast(anchorDate: Date): WeeklyForecast {
  const weekStart = getWeekStart(anchorDate);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekEnd.getDate() + 6);

  // Snapshot planets for each day of the week.
  const dailySnapshots: { date: Date; planets: TransitPlanet[] }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart); d.setDate(d.getDate() + i);
    dailySnapshots.push({ date: d, planets: computePlanetsForDate(d) });
  }

  // Detect events across consecutive days.
  const events: WeekEvent[] = [];
  for (let i = 1; i < dailySnapshots.length; i++) {
    const prev = dailySnapshots[i - 1];
    const cur = dailySnapshots[i];
    for (const pPrev of prev.planets) {
      const pCur = cur.planets.find((x) => x.id === pPrev.id);
      if (!pCur) continue;
      if (pCur.rashiIndex !== pPrev.rashiIndex) {
        events.push({
          date: fmtDate(cur.date),
          type: "rashi-change",
          planet: pPrev.id,
          planetMr: PLANET_MR[pPrev.id] || pPrev.id,
          fromRashiMr: RASHI_MR[pPrev.rashiIndex],
          toRashiMr: RASHI_MR[pCur.rashiIndex],
          fromRashiEn: RASHI_EN[pPrev.rashiIndex],
          toRashiEn: RASHI_EN[pCur.rashiIndex],
          descriptionMr: `${PLANET_MR[pPrev.id]} ${fmtDateMr(cur.date)}ला ${RASHI_MR[pPrev.rashiIndex]} राशीतून ${RASHI_MR[pCur.rashiIndex]} राशीत प्रवेश करतो.`,
          descriptionEn: `${pPrev.id} enters ${RASHI_EN[pCur.rashiIndex]} from ${RASHI_EN[pPrev.rashiIndex]} on ${fmtDate(cur.date)}.`,
        });
      }
      if (pPrev.isRetrograde === false && pCur.isRetrograde === true && pPrev.id !== "Rahu" && pPrev.id !== "Ketu") {
        events.push({
          date: fmtDate(cur.date),
          type: "retrograde-start",
          planet: pPrev.id,
          planetMr: PLANET_MR[pPrev.id] || pPrev.id,
          descriptionMr: `${PLANET_MR[pPrev.id]} ${fmtDateMr(cur.date)}ला वक्री होतो — परिणाम उलटे येऊ शकतात.`,
          descriptionEn: `${pPrev.id} turns retrograde on ${fmtDate(cur.date)} — effects may reverse.`,
        });
      }
      if (pPrev.isRetrograde === true && pCur.isRetrograde === false && pPrev.id !== "Rahu" && pPrev.id !== "Ketu") {
        events.push({
          date: fmtDate(cur.date),
          type: "retrograde-end",
          planet: pPrev.id,
          planetMr: PLANET_MR[pPrev.id] || pPrev.id,
          descriptionMr: `${PLANET_MR[pPrev.id]} ${fmtDateMr(cur.date)}ला मार्गी होतो — प्रभाव सामान्य होतो.`,
          descriptionEn: `${pPrev.id} turns direct on ${fmtDate(cur.date)} — effects normalize.`,
        });
      }
      if (pPrev.isCombust === false && pCur.isCombust === true) {
        events.push({
          date: fmtDate(cur.date),
          type: "combust-start",
          planet: pPrev.id,
          planetMr: PLANET_MR[pPrev.id] || pPrev.id,
          descriptionMr: `${PLANET_MR[pPrev.id]} ${fmtDateMr(cur.date)}ला अस्त होतो — प्रभाव कमजोर.`,
          descriptionEn: `${pPrev.id} becomes combust on ${fmtDate(cur.date)} — effect weakens.`,
        });
      }
      if (pPrev.isCombust === true && pCur.isCombust === false) {
        events.push({
          date: fmtDate(cur.date),
          type: "combust-end",
          planet: pPrev.id,
          planetMr: PLANET_MR[pPrev.id] || pPrev.id,
          descriptionMr: `${PLANET_MR[pPrev.id]} ${fmtDateMr(cur.date)}ला अस्तातून बाहेर — प्रभाव परत येतो.`,
          descriptionEn: `${pPrev.id} exits combustion on ${fmtDate(cur.date)} — effect returns.`,
        });
      }
    }
  }

  // Per-rashi: aggregate 7 daily gochar results.
  const predictions: WeeklyRashiResult[] = [];
  for (let rashiId = 0; rashiId < 12; rashiId++) {
    const dailyResults: (GocharResult & { date: string })[] = dailySnapshots.map((snap) => ({
      ...calculateGochar(snap.planets, rashiId),
      date: fmtDate(snap.date),
    }));

    const dailyRatings = dailyResults.map((r) => ({ date: r.date, rating: r.rating }));
    const avgScore = dailyRatings.reduce((a, b) => a + b.rating, 0) / dailyRatings.length;
    // Round half-up and clamp 1..5.
    const rating = Math.max(1, Math.min(5, Math.round(avgScore)));

    const sortedByRating = [...dailyRatings].sort((a, b) => b.rating - a.rating);
    const bestDay = sortedByRating[0];
    const worstDay = sortedByRating[sortedByRating.length - 1];

    // Flatten raw per-planet notes across all 7 days, then dedup on base snippet
    // (ignoring parenthetical context). Yields unique planet×house points for the week.
    const allCareer = dailyResults.flatMap((r) => r.careerNotes);
    const allLove = dailyResults.flatMap((r) => r.loveNotes);
    const allHealth = dailyResults.flatMap((r) => r.healthNotes);
    const careerPoints = uniqByBase(allCareer).slice(0, 6);
    const lovePoints = uniqByBase(allLove).slice(0, 6);
    const healthPoints = uniqByBase(allHealth).slice(0, 6);

    const bestDateLabelMr = fmtDateMr(new Date(bestDay.date));
    const bestDateLabelEn = bestDay.date;
    const worstDateLabelMr = fmtDateMr(new Date(worstDay.date));
    const worstDateLabelEn = worstDay.date;

    const summaryMr = rating >= 4
      ? `अनुकूल आठवडा. सर्वोत्तम दिवस: ${bestDateLabelMr}.`
      : rating === 3
      ? `मिश्र आठवडा. सर्वोत्तम: ${bestDateLabelMr} · सावध: ${worstDateLabelMr}.`
      : `कठीण आठवडा. अधिक सावध दिवस: ${worstDateLabelMr}.`;
    const summaryEn = rating >= 4
      ? `Favorable week. Best day: ${bestDateLabelEn}.`
      : rating === 3
      ? `Mixed week. Best: ${bestDateLabelEn}, caution: ${worstDateLabelEn}.`
      : `Challenging week. Hardest day: ${worstDateLabelEn}.`;

    const adviceMr = rating >= 4
      ? `${bestDateLabelMr} दिवशी महत्त्वाची कामे करा. अनुकूल आठवडा.`
      : rating === 3
      ? `${bestDateLabelMr} दिवशी निर्णय घ्या, ${worstDateLabelMr} दिवशी टाळा.`
      : `धीर ठेवा, मोठे निर्णय पुढील आठवड्यापर्यंत पुढे ढकला.`;
    const adviceEn = rating >= 4
      ? `Schedule key actions on ${bestDateLabelEn}.`
      : rating === 3
      ? `Prefer ${bestDateLabelEn} for decisions; avoid heavy moves on ${worstDateLabelEn}.`
      : `Stay patient; defer major decisions to next week.`;

    const mid = dailyResults[Math.floor(dailyResults.length / 2)];
    const midSnapshot = dailySnapshots[Math.floor(dailySnapshots.length / 2)];
    const planetPositions = mid.transits.map((tr) => {
      const raw = midSnapshot.planets.find((p) => p.id === tr.planet);
      const rashiIdx = raw ? raw.rashiIndex : 0;
      return {
        planet: tr.planet,
        planetMr: tr.planetMr,
        rashiMr: RASHI_MR[rashiIdx],
        rashiEn: RASHI_EN[rashiIdx],
        house: tr.house,
        dignity: tr.dignity,
        dignityMr: tr.dignityMr,
        isRetrograde: tr.isRetrograde,
        isCombust: tr.isCombust,
      };
    });

    const narrative = composeNarrative({
      rashiId,
      rashiMr: RASHI_MR[rashiId],
      rashiEn: RASHI_EN[rashiId],
      rating,
      planetPositions,
      events,
      bestDayLabelMr: bestDateLabelMr,
      bestDayLabelEn: bestDateLabelEn,
      worstDayLabelMr: worstDateLabelMr,
      worstDayLabelEn: worstDateLabelEn,
    });

    predictions.push({
      rashiId,
      rashiMr: RASHI_MR[rashiId],
      rashiEn: RASHI_EN[rashiId],
      rating,
      bestDay, worstDay,
      dailyRatings,
      summary: { mr: summaryMr, en: summaryEn },
      narrative,
      careerPoints,
      lovePoints,
      healthPoints,
      advice: { mr: adviceMr, en: adviceEn },
      luckyColor: mid.luckyColor,
      luckyNumber: mid.luckyNumber,
      planetPositions,
    });
  }

  return {
    weekStart: fmtDate(weekStart),
    weekEnd: fmtDate(weekEnd),
    events,
    predictions,
  };
}
