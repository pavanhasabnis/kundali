/**
 * Advanced strength calculations:
 *  - Graha Yuddha (planetary war) — detailed winner/loser when 2 planets within 1°
 *  - Bhava Bala — 12 house strengths (BPHS)
 *  - Combustion details with proximity and effect-severity
 */

import type { KundliResult, PlanetPosition } from "./calculator";
import { RASHIS } from "./constants";

// ─── Graha Yuddha (Planetary War) ──────────────────────────────

const WAR_PLANETS = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;

const PLANET_BRIGHTNESS: Record<string, number> = {
  // Higher = brighter (naisargika)
  Venus: 10, Jupiter: 9, Mars: 7, Saturn: 5, Mercury: 4,
};

export interface GrahaYuddhaEntry {
  planet1: string;
  planet1Mr: string;
  planet2: string;
  planet2Mr: string;
  distance: number;
  winner: string;
  winnerMr: string;
  loser: string;
  loserMr: string;
  rashiMr: string;
  rashiEn: string;
  reasonMr: string;
  reasonEn: string;
  reasonHi: string;
  effectMr: string;
  effectEn: string;
  effectHi: string;
}

export interface CombustionDetail {
  id: string;
  nameMr: string;
  nameEn: string;
  isCombust: boolean;
  distance: number;
  threshold: number;
  severity: "severe" | "moderate" | "mild" | "none";
  severityMr: string;
  severityEn: string;
  severityHi: string;
  effectMr: string;
  effectEn: string;
  effectHi: string;
  remedyMr: string;
  remedyEn: string;
  remedyHi: string;
}

const COMBUSTION_DEGREES: Record<string, number> = {
  Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
};

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};

const COMBUST_EFFECT: Record<string, { mr: string; en: string; hi: string; remedyMr: string; remedyEn: string; remedyHi: string }> = {
  Moon: {
    mr: "मनाची अस्थिरता, भावनांचे नियंत्रण कठीण, मातेचे आरोग्य व मानसिक शांती प्रभावित.",
    en: "Emotional instability, difficulty controlling feelings; mother's health and mental peace affected.",
    hi: "भावनाओं में अस्थिरता, माता के स्वास्थ्य व मानसिक शांति पर प्रभाव.",
    remedyMr: "सोमवारी शिव मंदिरात कच्चे दूध अर्पण. महामृत्युंजय मंत्र १०८ × ४० दिवस. मोती चांदीत धारण.",
    remedyEn: "Offer raw milk at Shiva temple on Mondays. Mahamrityunjaya 108 × 40 days. Wear Pearl in silver.",
    remedyHi: "सोमवार शिव मंदिर में कच्चा दूध अर्पण. महामृत्युंजय १०८ × ४० दिन. मोती चांदी में धारण.",
  },
  Mars: {
    mr: "क्रोध, अपघात व शस्त्रक्रियेची शक्यता; भावंडांशी मतभेद; मंगलकारक क्षीण.",
    en: "Anger, accident/surgery risk; friction with siblings; Mars significations weakened.",
    hi: "क्रोध, दुर्घटना/शल्य क्रिया जोखिम; भाई-बहनों से मतभेद; मंगल कारक क्षीण.",
    remedyMr: "हनुमान चालीसा मंगळवारी ११ वेळा. मूंगा धारण. लाल मसूर, तांबे दान.",
    remedyEn: "Hanuman Chalisa 11 times on Tuesdays. Wear Red Coral. Donate red masoor and copper.",
    remedyHi: "मंगलवार हनुमान चालीसा ११ बार. मूंगा धारण. लाल मसूर, तांबा दान.",
  },
  Mercury: {
    mr: "बुद्धी मंदावते, संवादात अडथळे, त्वचा व मज्जासंस्थेची समस्या, व्यापारात गोंधळ.",
    en: "Dulled intellect, communication blocks, skin and nervous issues, business confusion.",
    hi: "बुद्धि मंद, संवाद में अवरोध, त्वचा व तंत्रिका तंत्र समस्या.",
    remedyMr: "गणेश अथर्वशीर्ष २१ वेळा. बुधवारी पन्ना धारण. मूग डाळ, हिरवा वस्त्र दान.",
    remedyEn: "Ganesh Atharvashirsha 21 times. Wear Emerald on Wednesday. Donate moong dal and green cloth.",
    remedyHi: "गणेश अथर्वशीर्ष २१ बार. बुधवार पन्ना धारण. मूंग दाल, हरा वस्त्र दान.",
  },
  Jupiter: {
    mr: "गुरूकृपेचा अभाव, शिक्षणात व्यत्यय, धार्मिक-आध्यात्मिक मार्गदर्शन कमी, संततीसंबंधी चिंता.",
    en: "Diminished guru's grace, educational interruptions, reduced spiritual guidance, child-related worries.",
    hi: "गुरु कृपा में कमी, शिक्षा में व्यवधान, संतान संबंधी चिंता.",
    remedyMr: "गुरुवारी विष्णू सहस्रनाम + गुरुचरित्र. पुखराज धारण. हळद, केळी, चण्याची डाळ दान.",
    remedyEn: "Thursday Vishnu Sahasranama + Gurucharitra. Wear Yellow Sapphire. Donate turmeric, bananas, chana dal.",
    remedyHi: "गुरुवार विष्णु सहस्रनाम + गुरुचरित्र. पुखराज धारण. हल्दी, केले, चना दाल दान.",
  },
  Venus: {
    mr: "वैवाहिक जीवनात तणाव, जोडीदाराचे आरोग्य, भौतिक सुख-सोयींचा अभाव, कला-क्षेत्रात व्यत्यय.",
    en: "Marital tension, spouse's health, reduced material comforts, obstacles in artistic pursuits.",
    hi: "वैवाहिक तनाव, जीवनसाथी स्वास्थ्य, भौतिक सुख में कमी.",
    remedyMr: "शुक्रवारी महालक्ष्मी अष्टक, श्री सूक्त. हीरा/ओपल धारण. पांढरे कपडे, साखर, अत्तर दान.",
    remedyEn: "Friday Mahalakshmi Ashtak, Shri Sukta. Wear Diamond/Opal. Donate white cloth, sugar, perfume.",
    remedyHi: "शुक्रवार महालक्ष्मी अष्टक. हीरा/ओपल धारण. सफेद वस्त्र, शक्कर, इत्र दान.",
  },
  Saturn: {
    mr: "परिश्रमाचे फळ विलंबाने; वडीलधार्‍यांशी मतभेद; सरकारी कामात अडचणी; सेवक वर्गाशी संघर्ष.",
    en: "Delayed rewards for effort; friction with elders; government-related obstacles; worker troubles.",
    hi: "परिश्रम का फल देर से; ज्येष्ठों से मतभेद; सरकारी कार्य में बाधा.",
    remedyMr: "शनि शिंगणापूर तेलाभिषेक. हनुमान चालीसा ११ वेळा शनिवारी. काळे तीळ, लोह, कंबळ दान.",
    remedyEn: "Shani Shingnapur oil abhishek. Hanuman Chalisa 11 times on Saturdays. Donate black sesame, iron, blankets.",
    remedyHi: "शनि शिंगणापुर तेलाभिषेक. शनिवार हनुमान चालीसा ११ बार. काले तिल, लोहा, कंबल दान.",
  },
};

export function calculateGrahaYuddha(k: KundliResult): GrahaYuddhaEntry[] {
  const entries: GrahaYuddhaEntry[] = [];
  const planets = k.planets.filter((p) => (WAR_PLANETS as readonly string[]).includes(p.id));

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      if (p1.rashiIndex !== p2.rashiIndex) continue; // must be in same sign
      const dist = Math.abs(p1.degreeInSign - p2.degreeInSign);
      if (dist > 1) continue; // must be within 1° for Graha Yuddha

      // Winner — planet further north (lower longitude), or brighter if tied
      const b1 = PLANET_BRIGHTNESS[p1.id] ?? 0;
      const b2 = PLANET_BRIGHTNESS[p2.id] ?? 0;
      const winner = b1 >= b2 ? p1 : p2;
      const loser = winner.id === p1.id ? p2 : p1;

      const reasonMr = `${winner.nameMr} हा अधिक तेजस्वी ग्रह असल्याने विजयी — ${loser.nameMr} याचे कारकत्व क्षीण होते.`;
      const reasonEn = `${winner.name} wins due to greater natural brightness — ${loser.name}'s significations are weakened.`;
      const reasonHi = `${winner.nameMr} अधिक तेजस्वी होने के कारण विजयी — ${loser.nameMr} का कारकत्व क्षीण होता है.`;

      entries.push({
        planet1: p1.id,
        planet1Mr: p1.nameMr,
        planet2: p2.id,
        planet2Mr: p2.nameMr,
        distance: Math.round(dist * 100) / 100,
        winner: winner.id,
        winnerMr: winner.nameMr,
        loser: loser.id,
        loserMr: loser.nameMr,
        rashiMr: p1.rashiMr,
        rashiEn: p1.rashi,
        reasonMr, reasonEn, reasonHi,
        effectMr: `पराजित ${loser.nameMr} ग्रहाचे गुण ४० ते ५०% क्षीण होतात. त्या ग्रहाच्या दशेत विशेष उपाय करावेत.`,
        effectEn: `The defeated ${loser.name}'s qualities reduce by 40-50%. Take extra remedies during its dasha period.`,
        effectHi: `पराजित ${loser.nameMr} के गुण ४० से ५०% क्षीण होते हैं. उसकी दशा में उपाय आवश्यक.`,
      });
    }
  }

  return entries;
}

export function calculateCombustionDetails(k: KundliResult): CombustionDetail[] {
  const sun = k.planets.find((p) => p.id === "Sun");
  if (!sun) return [];

  const out: CombustionDetail[] = [];
  for (const p of k.planets) {
    if (p.id === "Sun" || p.id === "Rahu" || p.id === "Ketu") continue;
    let dist = Math.abs(p.siderealLongitude - sun.siderealLongitude);
    if (dist > 180) dist = 360 - dist;
    dist = Math.round(dist * 100) / 100;

    const threshold = COMBUSTION_DEGREES[p.id] ?? 15;
    const isCombust = dist <= threshold;
    let severity: CombustionDetail["severity"] = "none";
    if (isCombust) {
      if (dist <= threshold * 0.3) severity = "severe";
      else if (dist <= threshold * 0.6) severity = "moderate";
      else severity = "mild";
    }

    const sevLabel = {
      severe: { mr: "तीव्र", en: "Severe", hi: "गंभीर" },
      moderate: { mr: "मध्यम", en: "Moderate", hi: "मध्यम" },
      mild: { mr: "सौम्य", en: "Mild", hi: "हल्का" },
      none: { mr: "नाही", en: "None", hi: "नहीं" },
    };

    const effect = COMBUST_EFFECT[p.id];
    out.push({
      id: p.id,
      nameMr: p.nameMr,
      nameEn: p.name,
      isCombust,
      distance: dist,
      threshold,
      severity,
      severityMr: sevLabel[severity].mr,
      severityEn: sevLabel[severity].en,
      severityHi: sevLabel[severity].hi,
      effectMr: isCombust ? effect.mr : "अस्त नाही — ग्रह पूर्ण सामर्थ्याने कार्यरत.",
      effectEn: isCombust ? effect.en : "Not combust — planet operates at full potency.",
      effectHi: isCombust ? effect.hi : "अस्त नहीं — ग्रह पूर्ण सामर्थ्य से कार्यरत.",
      remedyMr: isCombust ? effect.remedyMr : "—",
      remedyEn: isCombust ? effect.remedyEn : "—",
      remedyHi: isCombust ? effect.remedyHi : "—",
    });
  }

  return out;
}

// ─── Bhava Bala — 12 house strength ─────────────────────────────

export interface BhavaBalaEntry {
  house: number;
  rashiIndex: number;
  rashiMr: string;
  rashiEn: string;
  subjectMr: string;
  subjectEn: string;
  bhavAdhipati: number;    // Lord's strength (0-60)
  bhavDig: number;         // Directional strength (0-60)
  bhavDrishti: number;     // Aspect strength (0-60, can be negative from malefics)
  total: number;           // Rupa
  verdict: "very strong" | "strong" | "average" | "weak";
  verdictMr: string;
  verdictEn: string;
  verdictHi: string;
}

const HOUSE_SUBJECTS: { mr: string; en: string }[] = [
  { mr: "तनु — व्यक्तिमत्व, आरोग्य", en: "Tanu — Personality, Health" },
  { mr: "धन — संपत्ती, कुटुंब, वाणी", en: "Dhana — Wealth, Family, Speech" },
  { mr: "सहज — पराक्रम, भावंडे", en: "Sahaja — Courage, Siblings" },
  { mr: "सुख — माता, घर, वाहन", en: "Sukha — Mother, Home, Vehicle" },
  { mr: "पुत्र — बुद्धी, संतती, विद्या", en: "Putra — Intellect, Children, Learning" },
  { mr: "रिपु — शत्रू, रोग, कर्ज", en: "Ripu — Enemies, Disease, Debt" },
  { mr: "कलत्र — विवाह, जोडीदार", en: "Kalatra — Marriage, Spouse" },
  { mr: "आयुर् — आयुष्य, गुप्त, वारसा", en: "Ayur — Longevity, Occult, Inheritance" },
  { mr: "भाग्य — धर्म, गुरू, पिता", en: "Bhagya — Fortune, Guru, Father" },
  { mr: "कर्म — करिअर, कीर्ती", en: "Karma — Career, Fame" },
  { mr: "लाभ — उत्पन्न, इच्छापूर्ती", en: "Labha — Gains, Fulfilment" },
  { mr: "व्यय — खर्च, मोक्ष, परदेश", en: "Vyaya — Expenses, Moksha, Foreign" },
];

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const BENEFICS = new Set(["Jupiter", "Venus", "Moon", "Mercury"]);

// Directional strength: house's own direction quality
const BHAV_DIG_STRENGTH: Record<number, number> = {
  1: 45, 4: 60, 7: 45, 10: 60,       // kendra strong
  2: 30, 5: 30, 8: 20, 11: 45,       // panaphara
  3: 40, 6: 20, 9: 50, 12: 15,       // apoklima
};

export function calculateBhavaBala(k: KundliResult): BhavaBalaEntry[] {
  const out: BhavaBalaEntry[] = [];

  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (k.lagnaRashiIndex + h - 1) % 12;
    const lordId = SIGN_LORDS[rashiIdx];
    const lordPlanet = k.planets.find((p) => p.id === lordId);

    // Bhavadhipati bala — lord's strength (from own dignity)
    let bhavAdhipati = 30;
    if (lordPlanet) {
      if (lordPlanet.rashiIndex === rashiIdx) bhavAdhipati = 60;                        // own sign
      else if (isExalted(lordId, lordPlanet.rashiIndex)) bhavAdhipati = 55;              // exalted
      else if (isDebilitated(lordId, lordPlanet.rashiIndex)) bhavAdhipati = 10;          // debilitated
      else if ([1, 4, 7, 10].includes(lordPlanet.house)) bhavAdhipati = 50;              // kendra
      else if ([5, 9].includes(lordPlanet.house)) bhavAdhipati = 45;                    // trikona
      else if ([6, 8, 12].includes(lordPlanet.house)) bhavAdhipati = 20;                // dusthana
    }

    // Bhav Dig Bala
    const bhavDig = BHAV_DIG_STRENGTH[h] ?? 30;

    // Bhav Drishti — planets in house + planets aspecting
    let bhavDrishti = 30;
    const planetsInHouse = k.planets.filter((p) => p.house === h);
    for (const p of planetsInHouse) {
      if (BENEFICS.has(p.id)) bhavDrishti += 15;
      else if (p.id === "Rahu" || p.id === "Ketu") bhavDrishti -= 10;
      else bhavDrishti -= 8;
    }
    // Simple 7th aspect
    for (const p of k.planets) {
      if (PLANET_MR[p.id] === undefined) continue;
      const aspectedHouse = ((p.house + 6 - 1) % 12) + 1;
      if (aspectedHouse === h) {
        if (BENEFICS.has(p.id)) bhavDrishti += 8;
        else bhavDrishti -= 5;
      }
    }
    bhavDrishti = Math.max(0, Math.min(60, bhavDrishti));

    const total = Math.round((bhavAdhipati + bhavDig + bhavDrishti) * 100) / 100;

    let verdict: BhavaBalaEntry["verdict"];
    let verdictMr: string; let verdictEn: string; let verdictHi: string;
    if (total >= 140) { verdict = "very strong"; verdictMr = "अत्यंत प्रबळ"; verdictEn = "Very Strong"; verdictHi = "अत्यंत प्रबल"; }
    else if (total >= 110) { verdict = "strong"; verdictMr = "प्रबळ"; verdictEn = "Strong"; verdictHi = "प्रबल"; }
    else if (total >= 85) { verdict = "average"; verdictMr = "मध्यम"; verdictEn = "Average"; verdictHi = "मध्यम"; }
    else { verdict = "weak"; verdictMr = "क्षीण"; verdictEn = "Weak"; verdictHi = "क्षीण"; }

    out.push({
      house: h, rashiIndex: rashiIdx,
      rashiMr: RASHIS[rashiIdx].mr, rashiEn: RASHIS[rashiIdx].en,
      subjectMr: HOUSE_SUBJECTS[h - 1].mr, subjectEn: HOUSE_SUBJECTS[h - 1].en,
      bhavAdhipati: Math.round(bhavAdhipati * 100) / 100,
      bhavDig: Math.round(bhavDig * 100) / 100,
      bhavDrishti: Math.round(bhavDrishti * 100) / 100,
      total,
      verdict, verdictMr, verdictEn, verdictHi,
    });
  }

  return out;
}

function isExalted(planetId: string, rashiIdx: number): boolean {
  const map: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  return map[planetId] === rashiIdx;
}
function isDebilitated(planetId: string, rashiIdx: number): boolean {
  const map: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
  return map[planetId] === rashiIdx;
}
