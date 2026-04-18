/**
 * Shadbala — 6-fold planetary strength calculation (BPHS).
 * Unit: Rupa. 60 Rupa = 1 point.
 *
 * Six strengths:
 *  1. Sthana Bala  (positional — dignity + sign parity + kendra)
 *  2. Dig Bala     (directional)
 *  3. Kala Bala    (temporal — day/night, paksha, ayana)
 *  4. Chesta Bala  (motional — retrogression)
 *  5. Naisargika   (natural — fixed per planet)
 *  6. Drik Bala    (aspectual — benefics vs malefics)
 */

import type { KundliResult, PlanetPosition } from "./calculator";
import type { DivisionalChart } from "./divisional";

const PLANET_IDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;
type PlanetId = typeof PLANET_IDS[number];

// ─── Reference tables ────────────────────────────────────────

const EXALTATION_DEG: Record<PlanetId, { rashi: number; deg: number }> = {
  Sun: { rashi: 0, deg: 10 },      // Aries 10°
  Moon: { rashi: 1, deg: 3 },      // Taurus 3°
  Mars: { rashi: 9, deg: 28 },     // Capricorn 28°
  Mercury: { rashi: 5, deg: 15 },  // Virgo 15°
  Jupiter: { rashi: 3, deg: 5 },   // Cancer 5°
  Venus: { rashi: 11, deg: 27 },   // Pisces 27°
  Saturn: { rashi: 6, deg: 20 },   // Libra 20°
};

const NAISARGIKA: Record<PlanetId, number> = {
  Sun: 60, Moon: 51.43, Venus: 42.85, Jupiter: 34.28,
  Mercury: 25.70, Mars: 17.14, Saturn: 8.57,
};

// Dig Bala strongest house per planet (0° rupa at opposite, 60 rupa at strongest)
const DIG_BALA_HOUSE: Record<PlanetId, number> = {
  Sun: 10, Mars: 10,
  Moon: 4, Venus: 4,
  Mercury: 1, Jupiter: 1,
  Saturn: 7,
};

// Minimum required strength in virupa (BPHS)
const REQUIRED_RUPA: Record<PlanetId, number> = {
  Sun: 390, Moon: 360, Mars: 300, Mercury: 420,
  Jupiter: 390, Venus: 330, Saturn: 300,
};

const BENEFICS_NATURAL = new Set(["Jupiter", "Venus", "Moon", "Mercury"]);

// ─── Saptavargaja support tables ─────────────────────────────

const OWN_SIGNS: Record<PlanetId, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
};
const MT_SIGN: Record<PlanetId, number> = {
  Sun: 4, Moon: 1, Mars: 0, Mercury: 5, Jupiter: 8, Venus: 6, Saturn: 10,
};
const SIGN_LORDS: Record<number, PlanetId> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};
const FRIENDS_NAT: Record<PlanetId, PlanetId[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};
const ENEMIES_NAT: Record<PlanetId, PlanetId[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

// Mean daily motion (degrees/day) — used for Chesta Bala motion state
const AVG_SPEED: Record<PlanetId, number> = {
  Sun: 0.9856, Moon: 13.176, Mars: 0.524, Mercury: 1.383,
  Jupiter: 0.0831, Venus: 1.2, Saturn: 0.0335,
};

// ─── Helpers ────────────────────────────────────────────────

function absLongitude(p: PlanetPosition): number {
  return p.rashiIndex * 30 + p.degreeInSign;
}

function angularDistance(long1: number, long2: number): number {
  const diff = Math.abs(long1 - long2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

// ─── 1. Sthana Bala ─────────────────────────────────────────

function uchchaBala(p: PlanetPosition, id: PlanetId): number {
  const ex = EXALTATION_DEG[id];
  const exLong = ex.rashi * 30 + ex.deg;
  const planetLong = absLongitude(p);
  const dist = angularDistance(planetLong, exLong);
  // 60 rupa at exaltation, 0 at debilitation (180° away), linear
  return 60 * (1 - dist / 180);
}

function ojhaYugmaBala(p: PlanetPosition, id: PlanetId): number {
  // Male (odd-sign preferring): Sun, Mars, Jupiter
  // Female (even-sign preferring): Moon, Venus
  // Neutral: Mercury, Saturn (no strong preference)
  const isOdd = p.rashiIndex % 2 === 0; // Aries=0 is odd, Taurus=1 is even
  if (id === "Sun" || id === "Mars" || id === "Jupiter") return isOdd ? 15 : 0;
  if (id === "Moon" || id === "Venus") return isOdd ? 0 : 15;
  return 7.5; // neutral
}

function kendraBala(house: number): number {
  if ([1, 4, 7, 10].includes(house)) return 60;
  if ([2, 5, 8, 11].includes(house)) return 30;
  return 15;
}

function drekkanaBala(p: PlanetPosition, id: PlanetId): number {
  // Drekkana = 10° segments within rashi. Male planets strong in 1st drekkana,
  // female in 2nd, hermaphrodite in 3rd.
  const drekkana = Math.floor(p.degreeInSign / 10); // 0, 1, 2
  if (id === "Sun" || id === "Mars" || id === "Jupiter") return drekkana === 0 ? 15 : 0;
  if (id === "Moon" || id === "Venus") return drekkana === 1 ? 15 : 0;
  return drekkana === 2 ? 15 : 0; // Mercury, Saturn
}

function signDignityVirupa(id: PlanetId, signIdx: number): number {
  // Returns virupa per BPHS Ch. 27 dignity scale
  if (MT_SIGN[id] === signIdx) return 45;       // Moolatrikona
  if (OWN_SIGNS[id].includes(signIdx)) return 30; // Swakshetra
  const lord = SIGN_LORDS[signIdx];
  if (lord === id) return 30;
  if (FRIENDS_NAT[id].includes(lord)) return 15; // Mitra
  if (ENEMIES_NAT[id].includes(lord)) return 3.75; // Shatru
  return 7.5;                                     // Sama
}

function saptavargajaBala(p: PlanetPosition, id: PlanetId, divCharts?: DivisionalChart[]): number {
  // Sum dignity virupa across Rashi, Hora, Drekkana, Saptamsha, Navamsha, Dwadashamsha, Trimshamsha
  let total = signDignityVirupa(id, p.rashiIndex); // D1
  const vargaIds = ["hora", "drekkana", "saptamsha", "navamsha", "dwadashamsha", "trimshamsha"];
  for (const vId of vargaIds) {
    const chart = divCharts?.find((c) => c.id === vId);
    const planet = chart?.planets.find((pp) => pp.id === id);
    if (planet) total += signDignityVirupa(id, planet.rashiIndex);
    else total += 7.5; // neutral fallback when chart missing
  }
  return total;
}

function sthanaBala(p: PlanetPosition, id: PlanetId, divCharts?: DivisionalChart[]): number {
  return (
    uchchaBala(p, id) +
    saptavargajaBala(p, id, divCharts) +
    ojhaYugmaBala(p, id) +
    kendraBala(p.house) +
    drekkanaBala(p, id)
  );
}

// ─── 2. Dig Bala ────────────────────────────────────────────

function digBala(p: PlanetPosition, id: PlanetId): number {
  if (!(id in DIG_BALA_HOUSE)) return 0;
  const strongHouse = DIG_BALA_HOUSE[id];
  // Distance in houses from strong house (0 = strongest, 6 = weakest opposite)
  let dist = Math.abs(p.house - strongHouse);
  if (dist > 6) dist = 12 - dist;
  return 60 * (1 - dist / 6);
}

// ─── 3. Kala Bala ───────────────────────────────────────────

function kalaBala(p: PlanetPosition, id: PlanetId, k: KundliResult): number {
  // Simplified: Nathonnatha + Paksha + Ayana
  let total = 0;

  // Nathonnatha: day strong — Sun, Jupiter, Venus; night strong — Moon, Mars, Saturn; Mercury always
  // Use hour of birth: 6am–6pm = day, else night
  const isDayBirth = k.birthInput.hour >= 6 && k.birthInput.hour < 18;
  const dayStrong = ["Sun", "Jupiter", "Venus"];
  const nightStrong = ["Moon", "Mars", "Saturn"];
  if (id === "Mercury") total += 60;
  else if (dayStrong.includes(id) && isDayBirth) total += 60;
  else if (nightStrong.includes(id) && !isDayBirth) total += 60;
  else total += 0;

  // Paksha: benefics strong in shukla paksha (waxing), malefics in krishna (waning)
  // Use Sun-Moon elongation
  const sun = k.planets.find((pp) => pp.id === "Sun");
  const moon = k.planets.find((pp) => pp.id === "Moon");
  if (sun && moon) {
    const elongation = ((absLongitude(moon) - absLongitude(sun)) + 360) % 360;
    const waxing = elongation < 180; // Shukla paksha
    const isBenefic = BENEFICS_NATURAL.has(id);
    // Moon gets full paksha bala based on elongation
    if (id === "Moon") {
      total += 60 * (waxing ? elongation / 180 : (360 - elongation) / 180);
    } else {
      if ((isBenefic && waxing) || (!isBenefic && !waxing)) total += 60;
      else total += 0;
    }
  }

  // Ayana Bala: declination-based. Kranti = arcsin(sin(obliquity) × sin(tropical_long))
  total += ayanaBala(p, id);

  return total;
}

function ayanaBala(p: PlanetPosition, id: PlanetId): number {
  if (id === "Mercury") return 30; // Mercury always half
  const OBLIQUITY = 23.4367;
  const rad = (x: number) => (x * Math.PI) / 180;
  const sinDecl = Math.sin(rad(OBLIQUITY)) * Math.sin(rad(p.tropicalLongitude));
  const decl = (Math.asin(sinDecl) * 180) / Math.PI;
  // Nocturnal planets (Moon, Saturn) gain with negative declination; diurnal with positive
  const nocturnal = id === "Moon" || id === "Saturn";
  const effDecl = nocturnal ? -decl : decl;
  // Linear: 0 at extreme adverse declination, 60 at extreme favorable
  let bala = (60 * (OBLIQUITY + effDecl)) / (2 * OBLIQUITY);
  bala = Math.max(0, Math.min(60, bala));
  return bala;
}

// ─── 4. Chesta Bala ─────────────────────────────────────────

function chestaBala(p: PlanetPosition, id: PlanetId): number {
  // Sun uses Ayana (returned as Kala component); Moon uses Paksha. Return mid-value.
  if (id === "Sun" || id === "Moon") return 30;
  if (p.isRetrograde) return 60; // Vakra
  const avg = AVG_SPEED[id];
  const ratio = Math.abs(p.speed) / avg;
  // BPHS 8 motion states (Santhanam/Raman virupa values)
  if (ratio < 0.1) return 15;   // Vikala (near stationary)
  if (ratio < 0.5) return 30;   // Mandatara
  if (ratio < 0.9) return 15;   // Manda
  if (ratio < 1.1) return 7.5;  // Sama
  if (ratio < 1.5) return 30;   // Chara
  return 45;                    // Atichara
}

// ─── 5. Naisargika Bala ─────────────────────────────────────

function naisargikaBala(id: PlanetId): number {
  return NAISARGIKA[id];
}

// ─── 6. Drik Bala ───────────────────────────────────────────

function drikBala(p: PlanetPosition, planets: PlanetPosition[]): number {
  let total = 0;
  for (const other of planets) {
    if (other.id === p.id) continue;
    if (!PLANET_IDS.includes(other.id as PlanetId)) continue;
    const diff = ((other.rashiIndex - p.rashiIndex) + 12) % 12;
    // 7th aspect (opposition) — all planets aspect 7th
    let strength = 0;
    if (diff === 6) strength = 60;
    // Special aspects
    if (other.id === "Mars" && (diff === 3 || diff === 7)) strength = 45; // 4th/8th
    if (other.id === "Jupiter" && (diff === 4 || diff === 8)) strength = 45; // 5th/9th
    if (other.id === "Saturn" && (diff === 2 || diff === 9)) strength = 45; // 3rd/10th
    if (strength === 0) continue;

    const isBenefic = BENEFICS_NATURAL.has(other.id);
    total += isBenefic ? strength : -strength;
  }
  // Normalize to positive bala (add 60 neutral)
  return Math.max(0, total + 30);
}

// ─── Main ────────────────────────────────────────────────────

export interface ShadBalaPlanet {
  id: string;
  nameMr: string;
  nameEn: string;
  sthana: number;
  dig: number;
  kala: number;
  chesta: number;
  naisargika: number;
  drik: number;
  total: number;          // in rupa
  totalPoints: number;    // rupa / 60
  required: number;
  isStrong: boolean;
  strengthRank: number;   // 1 = strongest
  percentOfRequired: number;
  verdict: "very strong" | "strong" | "average" | "weak" | "very weak";
  verdictMr: string;
  verdictEn: string;
  verdictHi: string;
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
}

export interface ShadBalaResult {
  planets: ShadBalaPlanet[];
  strongestEn: string;
  strongestMr: string;
  weakestEn: string;
  weakestMr: string;
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

const PLANET_MR: Record<PlanetId, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};

// Detailed traditional remedies per planet — shown when planet is weak
const PLANET_REMEDIES: Record<PlanetId, { mr: string[]; en: string[]; hi: string[] }> = {
  Sun: {
    mr: [
      "रविवारी सूर्योदयाच्या वेळी सूर्याला तांब्याच्या पात्रातून अर्घ्य (जल) द्या — पाण्यात लाल फुल, कुमकुम व साखर मिसळा. सूर्य गायत्री १०८ वेळा जपा.",
      "आदित्य हृदय स्तोत्राचे नित्य पठण (विशेषतः रविवारी) — यशस्वी होण्यासाठी रामायणातील हा सर्वश्रेष्ठ सूर्य मंत्र मानला जातो.",
      "'ॐ घृणिः सूर्याय नमः' किंवा सूर्य गायत्री — 'ॐ भास्कराय विद्महे, दिवाकराय धीमही, तन्नो सूर्यः प्रचोदयात्' — दररोज ७००० जप ४० दिवसांत.",
      "रविवारी उपवास — एकदाच जेवण, मीठ व तेल वर्ज्य. तुपाने बनवलेल्या गव्हाच्या पुरीचा किंवा हलव्याचा आहार.",
      "माणिक रत्न (रुबी) — ३-६ कॅरेट, सोन्यात जडवून उजव्या हाताच्या अनामिकेत, रविवारी सूर्योदयी धारण. अनुभवी ज्योतिषीच्या सल्ल्याने.",
      "वडिलांची सेवा, ब्राह्मण व गुरूला नैवेद्य, गूळ-गहू दान, सूर्य मंदिरात (मॉडलरा, कोणार्क) यात्रा. पितृदोष निवारण अवश्य.",
    ],
    en: [
      "On Sundays at sunrise offer arghya (water) to the Sun from a copper vessel — mix red flower, kumkum and sugar in the water. Chant Surya Gayatri 108 times.",
      "Daily recitation of Aditya Hridaya Stotra (especially on Sundays) — considered the supreme Sun mantra for success in the Ramayana.",
      "Chant 'Om Ghrinih Suryaya Namah' or Surya Gayatri — 'Om Bhaskaraya Vidmahe, Divakaraya Dhimahi, Tanno Suryah Prachodayat' — 7000 times in 40 days.",
      "Fast on Sundays — one meal only, avoiding salt and oil. Eat wheat puri or halwa made in ghee.",
      "Wear Ruby (Manik) — 3-6 carats, set in gold, on the right ring finger, at sunrise on Sunday, after astrologer's guidance.",
      "Serve your father, feed Brahmins and your guru, donate jaggery and wheat, visit Sun temples (Modhera, Konark). Pitru dosha remediation essential.",
    ],
    hi: [
      "रविवार को सूर्योदय के समय तांबे के पात्र से सूर्य को अर्घ्य दें — जल में लाल फूल, कुमकुम व शक्कर मिलाएं. सूर्य गायत्री का १०८ जाप करें.",
      "आदित्य हृदय स्तोत्र का नित्य पाठ (विशेषतः रविवार) — रामायण में यह सर्वोत्तम सूर्य मंत्र माना जाता है.",
      "'ॐ घृणिः सूर्याय नमः' या सूर्य गायत्री का ४० दिनों में ७००० जाप.",
      "रविवार का व्रत — एक समय भोजन, नमक व तेल वर्जित. घी से बनी पुरी या हलवा का आहार.",
      "माणिक (रूबी) रत्न — ३-६ कैरेट, सोने में जड़वाकर रविवार सूर्योदय पर धारण.",
      "पिता की सेवा, ब्राह्मण व गुरु को भोजन, गुड़-गेहूं दान, सूर्य मंदिर (मोढेरा, कोणार्क) यात्रा.",
    ],
  },
  Moon: {
    mr: [
      "सोमवार रात्री पूर्ण चंद्राकडे पाहून चंद्र नमस्कार — 'ॐ सोमाय नमः' १०८ वेळा जपा. पौर्णिमेला गंगा किंवा समुद्र स्नान श्रेष्ठ.",
      "चंद्र गायत्री — 'ॐ क्षीरपुत्राय विद्महे, अमृत तत्वाय धीमही, तन्नो चंद्र प्रचोदयात्' — ११००० जप ४० दिवसांत.",
      "दर सोमवारी शिव मंदिरात जाऊन शिवलिंगावर कच्चे दूध अर्पण. महामृत्युंजय मंत्र ११ वेळा पठण. आईची सेवा.",
      "मोती (मुक्ता) — २-११ कॅरेट, चांदीत जडवून उजव्या हाताच्या करंगळीत, सोमवारी रात्री पूर्ण चंद्राच्या प्रकाशात धारण.",
      "पांढरे अन्न (तांदूळ, दूध, दही, साखर, गोड पदार्थ) दान. सोमवारी सायंकाळी शिवाभिषेक, शंखपूजा.",
      "माहुर, सप्तशृंगी, कोल्हापूर महालक्ष्मी — देवी क्षेत्र यात्रा. मानसिक शांतीसाठी ॐ जप व ध्यान.",
    ],
    en: [
      "On Monday nights, look at the full Moon and offer Moon Namaskar — chant 'Om Somaya Namah' 108 times. Bathe in Ganga or sea on Purnima for best results.",
      "Chant Chandra Gayatri — 'Om Kshirputraya Vidmahe, Amrita Tatvaya Dhimahi, Tanno Chandra Prachodayat' — 11000 times over 40 days.",
      "Visit a Shiva temple every Monday; offer raw milk on the Shiva Lingam; recite Mahamrityunjaya 11 times. Serve your mother.",
      "Wear a Pearl (Mukta) — 2-11 carats, set in silver, on the right little finger, on Monday night under full moonlight.",
      "Donate white items — rice, milk, curd, sugar, sweets. Perform Shiva abhishek and Shankha puja on Monday evenings.",
      "Yatra to Mahur, Saptashrungi, Kolhapur Mahalaxmi — Devi kshetras. For mental peace, Om japa and meditation.",
    ],
    hi: [
      "सोमवार रात्रि पूर्ण चंद्रमा को देखकर चंद्र नमस्कार — 'ॐ सोमाय नमः' १०८ बार जाप. पूर्णिमा पर गंगा या समुद्र स्नान श्रेष्ठ.",
      "चंद्र गायत्री का ४० दिनों में ११००० जाप.",
      "प्रत्येक सोमवार शिव मंदिर में शिवलिंग पर कच्चा दूध अर्पण, महामृत्युंजय ११ बार. माता की सेवा.",
      "मोती (मुक्ता) — २-११ कैरेट, चांदी में जड़वाकर सोमवार रात्रि पूर्ण चंद्र की रोशनी में धारण.",
      "सफेद अन्न (चावल, दूध, दही, शक्कर, मिठाई) दान. सोमवार सायं शिवाभिषेक व शंख पूजा.",
      "माहुर, सप्तशृंगी, कोल्हापुर महालक्ष्मी — देवी क्षेत्र यात्रा. मानसिक शांति के लिए ॐ जप व ध्यान.",
    ],
  },
  Mars: {
    mr: [
      "हनुमान चालीसा दररोज. मंगळवारी व शनिवारी हनुमान मंदिरात जाऊन शेंदूर, चमेलीचे तेल अर्पण.",
      "'ॐ अंगारकाय नमः' किंवा मंगळ गायत्री १०८ वेळा दररोज. ४० दिवस अखंड जप.",
      "मंगळनाथ (उज्जैन) येथे शांती पूजा. जेजुरी खंडोबा व कार्तिकेय (मुरुगन) मंदिर दर्शन.",
      "मूंगा (लाल पोवळा) — ५-११ कॅरेट, सोन्यात जडवून उजव्या हाताच्या अनामिकेत, मंगळवारी सूर्योदयी.",
      "लाल मसूर डाळ, गूळ, तांबे व लाल फळे दान. रक्तदान वर्षातून एकदा.",
      "मंगळवारी उपवास — फक्त गोड आहार. तांबेच्या पात्रातून जल, लाल वस्त्र धारण.",
    ],
    en: [
      "Recite Hanuman Chalisa daily. Visit Hanuman temple on Tuesdays and Saturdays with sindoor and jasmine oil offerings.",
      "Chant 'Om Angarakaya Namah' or Mangal Gayatri 108 times daily for 40 unbroken days.",
      "Mangal Shanti Pooja at Mangalnath (Ujjain). Darshan at Jejuri Khandoba and Kartikeya (Murugan) temples.",
      "Wear Red Coral (Moonga) — 5-11 carats, gold, right ring finger, on Tuesday at sunrise.",
      "Donate red lentils (masoor), jaggery, copper and red fruits. Donate blood once a year.",
      "Fast on Tuesdays — sweet food only. Drink water from copper vessel; wear red clothes.",
    ],
    hi: [
      "हनुमान चालीसा नित्य. मंगलवार व शनिवार हनुमान मंदिर में सिंदूर, चमेली तेल अर्पण.",
      "'ॐ अंगारकाय नमः' या मंगल गायत्री का नित्य १०८ जाप. ४० दिन अखंड.",
      "मंगलनाथ (उज्जैन) शांति पूजा. जेजुरी खंडोबा व कार्तिकेय (मुरुगन) मंदिर दर्शन.",
      "मूंगा (रेड कोरल) — ५-११ कैरेट, सोने में, दाहिने हाथ की अनामिका, मंगलवार सूर्योदय पर.",
      "लाल मसूर दाल, गुड़, तांबा व लाल फल दान. रक्तदान वर्ष में एक बार.",
      "मंगलवार व्रत — केवल मीठा आहार. तांबे के पात्र से जल, लाल वस्त्र धारण.",
    ],
  },
  Mercury: {
    mr: [
      "बुधवारी गणपतीची पूजा — दूर्वा, मोदक, जास्वंद अर्पण. गणेश अथर्वशीर्ष २१ वेळा पठण.",
      "विष्णू सहस्रनाम, श्रीसूक्त बुधवारी पठण. 'ॐ बुं बुधाय नमः' १०८ वेळा जप.",
      "बुधवारी उपवास — हिरवे पालेभाजी, मूग डाळ, दूधाचा आहार. मीठ व तिखट वर्ज्य.",
      "पाचू (पन्ना/एमरल्ड) — ३-७ कॅरेट, सोन्यात जडवून उजव्या हाताच्या करंगळीत, बुधवारी सकाळी.",
      "हिरवी मूग डाळ, पालेभाजी, शिक्षणसामग्री (पुस्तके, वह्या, पेन्सिल) दान. विद्यार्थ्यांना शिष्यवृत्ती.",
      "विद्या देवी सरस्वती मंदिर दर्शन. मोरेश्वर (मोरगाव अष्टविनायक) व चिंतामणी (थेऊर) यात्रा.",
    ],
    en: [
      "On Wednesdays worship Lord Ganesha — offer durva grass, modak and hibiscus. Recite Ganesh Atharvashirsha 21 times.",
      "Recite Vishnu Sahasranama and Shri Sukta on Wednesdays. Chant 'Om Bum Budhaya Namah' 108 times daily.",
      "Fast on Wednesdays — green leafy vegetables, mung dal and milk. Avoid salt and spicy food.",
      "Wear Emerald (Panna) — 3-7 carats, set in gold, on the right little finger, Wednesday morning.",
      "Donate green mung dal, leafy vegetables, study materials (books, pens, notebooks). Sponsor scholarships.",
      "Darshan at Saraswati temples. Yatra to Moreshwar (Morgaon) and Chintamani (Theur) Ashtavinayaks.",
    ],
    hi: [
      "बुधवार गणपति पूजा — दूर्वा, मोदक, गुड़हल अर्पण. गणेश अथर्वशीर्ष २१ बार पाठ.",
      "विष्णु सहस्रनाम, श्री सूक्त बुधवार को पाठ. 'ॐ बुं बुधाय नमः' १०८ जाप.",
      "बुधवार व्रत — हरी सब्जी, मूंग दाल, दूध. नमक व तीखा वर्जित.",
      "पन्ना (एमरल्ड) — ३-७ कैरेट, सोने में, दाहिनी कनिष्ठिका, बुधवार प्रातः.",
      "हरी मूंग दाल, पत्ता सब्जी, अध्ययन सामग्री (पुस्तक, पेन) दान. छात्रवृत्ति.",
      "सरस्वती मंदिर दर्शन. मोरेश्वर (मोरगाव) व चिंतामणि (थेऊर) अष्टविनायक यात्रा.",
    ],
  },
  Jupiter: {
    mr: [
      "गुरुवारी केशर टिळा, पिवळे वस्त्र, पिवळी फुले विष्णू व गुरु बृहस्पतीला अर्पण. विष्णू सहस्रनाम पठण.",
      "गुरु गायत्री — 'ॐ वृषभध्वजाय विद्महे, क्रुणी हस्ताय धीमही, तन्नो गुरु प्रचोदयात्' — १६००० जप ४० दिवसांत.",
      "गुरु बृहस्पती स्तोत्र, श्री गुरुचरित्र पारायण. श्री दत्तात्रेयाची उपासना — गाणगापूर, नृसिंहवाडी यात्रा.",
      "पुष्कराज (पिवळा पुखराज / येलो सफायर) — ३-५ कॅरेट, सोन्यात जडवून उजव्या हाताच्या तर्जनीत, गुरुवारी.",
      "गुरुवारी उपवास, चण्याची डाळ, हळद, केशर, गूळ दान. ब्राह्मण-गुरूला भोजन व दक्षिणा.",
      "शिक्षण, ज्ञान-संस्था व गौ-शाळेस दान. धार्मिक ग्रंथांचे वितरण. पिंपळ वृक्षाची पूजा — गुरुवारी तूपाचा दीप.",
    ],
    en: [
      "On Thursdays apply saffron tilak, wear yellow clothes, offer yellow flowers to Vishnu and Guru Brihaspati. Recite Vishnu Sahasranama.",
      "Chant Guru Gayatri — 'Om Vrishabhadhvajaya Vidmahe, Kruni Hastaya Dhimahi, Tanno Guru Prachodayat' — 16000 times over 40 days.",
      "Recite Guru Brihaspati Stotra and Shri Gurucharitra parayana. Worship Dattatreya — yatra to Ganagapur and Narasobawadi.",
      "Wear Yellow Sapphire (Pukhraj) — 3-5 carats, gold, right index finger, on Thursday.",
      "Fast on Thursdays, donate chana dal, turmeric, saffron, jaggery. Feed and offer dakshina to Brahmins/gurus.",
      "Donate to educational institutions and goshalas. Distribute religious texts. Worship Peepal tree — light a ghee lamp on Thursdays.",
    ],
    hi: [
      "गुरुवार केसर तिलक, पीले वस्त्र, पीले फूल विष्णु व गुरु बृहस्पति को अर्पण. विष्णु सहस्रनाम पाठ.",
      "गुरु गायत्री का ४० दिनों में १६००० जाप.",
      "गुरु बृहस्पति स्तोत्र, श्री गुरुचरित्र पारायण. दत्तात्रेय उपासना — गाणगापुर, नृसिंहवाड़ी यात्रा.",
      "पुष्पराज (पीला पुखराज) — ३-५ कैरेट, सोने में, दाहिनी तर्जनी, गुरुवार को.",
      "गुरुवार व्रत, चना दाल, हल्दी, केसर, गुड़ दान. ब्राह्मण-गुरु को भोजन व दक्षिणा.",
      "शिक्षा संस्था व गौशाला को दान. धार्मिक ग्रंथ वितरण. पीपल वृक्ष पूजा — गुरुवार घी दीप.",
    ],
  },
  Venus: {
    mr: [
      "शुक्रवारी लक्ष्मी पूजन — महालक्ष्मी अष्टक, श्रीसूक्त, कनकधारा स्तोत्र पठण. पांढरी/गुलाबी फुले, केसर.",
      "शुक्र गायत्री — 'ॐ भृगुसुताय विद्महे, दिव्य देहाय धीमही, तन्नो शुक्र प्रचोदयात्' — १६००० जप ४० दिवसांत.",
      "कोल्हापूर महालक्ष्मी, तुळजापूर भवानी, मुंबई सिद्धिविनायकी — शक्तिपीठ यात्रा. शुक्रवारी गरीब स्त्रियांना वस्त्र दान.",
      "हीरा (डायमंड) किंवा ओपल — १-१.५ कॅरेट, सोन्यात जडवून उजव्या हाताच्या मध्यमेत, शुक्रवारी सूर्योदयी.",
      "शुक्रवारी उपवास — दही-भात, मिश्री, गोड पदार्थ. सुगंधी तेल, अत्तर, रेशीम व फुले दान.",
      "कन्या पूजन, लग्नात मदत, सौंदर्य-सेवा. पांढरी/गुलाबी वस्त्र शुक्रवारी धारण.",
    ],
    en: [
      "On Fridays perform Lakshmi pujan — Mahalakshmi Ashtak, Shri Sukta, Kanakadhara Stotra. Offer white/pink flowers and saffron.",
      "Chant Shukra Gayatri — 'Om Bhrigusutaya Vidmahe, Divya Dehaya Dhimahi, Tanno Shukra Prachodayat' — 16000 times in 40 days.",
      "Yatra to Kolhapur Mahalaxmi, Tuljapur Bhavani, Mumbai Siddhivinayaki (Shakti Peethas). Donate clothes to poor women on Fridays.",
      "Wear Diamond or Opal — 1-1.5 carats, set in gold, on the right middle finger, Friday at sunrise.",
      "Fast on Fridays — curd-rice, mishri, sweets. Donate perfumes, silk and flowers.",
      "Perform Kanya pujan, help with weddings of the poor, offer beauty services. Wear white or pink clothes on Fridays.",
    ],
    hi: [
      "शुक्रवार लक्ष्मी पूजन — महालक्ष्मी अष्टक, श्री सूक्त, कनकधारा स्तोत्र पाठ. सफेद/गुलाबी पुष्प, केसर.",
      "शुक्र गायत्री का ४० दिनों में १६००० जाप.",
      "कोल्हापुर महालक्ष्मी, तुलजापुर भवानी, मुंबई सिद्धिविनायकी शक्तिपीठ यात्रा. शुक्रवार गरीब स्त्रियों को वस्त्र दान.",
      "हीरा या ओपल — १-१.५ कैरेट, सोने में, दाहिनी मध्यमा, शुक्रवार सूर्योदय पर.",
      "शुक्रवार व्रत — दही-चावल, मिश्री, मिठाई. इत्र, रेशमी वस्त्र व फूल दान.",
      "कन्या पूजन, गरीब कन्या विवाह सहायता. सफेद/गुलाबी वस्त्र शुक्रवार को धारण.",
    ],
  },
  Saturn: {
    mr: [
      "शनिवारी शनि-शिंगणापूर येथे शनी देव दर्शन. तेलाभिषेक, काळे कापड, काळे तीळ अर्पण. शनैश्चर स्तोत्र पठण.",
      "'ॐ शं शनैश्चराय नमः' किंवा शनि गायत्री — 'ॐ कृष्णांगाय विद्महे, रवी सुताय धीमही, तन्नो मंदः प्रचोदयात्' — १९००० जप ४० दिवसांत.",
      "हनुमान चालीसा शनिवारी ११ वेळा, हनुमान अष्टक व सुंदरकांड पाठ. शनी व हनुमान मित्र मानले जातात — हनुमान साधनेने शनि प्रसन्न.",
      "नीलम (ब्लू सफायर) — ३-५ कॅरेट, लोह किंवा पंचधातूत जडवून उजव्या हाताच्या मध्यमेत, शनिवारी संध्याकाळी. सावधानतेने, ट्रायल पिरियड आवश्यक.",
      "शनिवारी उपवास — काळे तीळ-गूळ, काळी उडीद. मजुरांना, वृद्धांना, अपंगांना जेवण व वस्त्र दान.",
      "पिंपळाखाली दीप, कावळ्यांना अन्न, काळ्या कुत्र्यांची सेवा. शनी तेलाभिषेकासाठी मोहरीचे तेल वापरा.",
    ],
    en: [
      "On Saturdays, visit Shani Shingnapur for Shani darshan. Offer oil abhishek, black cloth, black sesame. Recite Shanaishchara Stotra.",
      "Chant 'Om Sham Shanaishcharaya Namah' or Shani Gayatri — 'Om Krishnangaya Vidmahe, Ravi Sutaya Dhimahi, Tanno Mandah Prachodayat' — 19000 times in 40 days.",
      "Recite Hanuman Chalisa 11 times on Saturdays plus Hanuman Ashtak and Sundarkand. Shani and Hanuman are friends — Hanuman sadhana pleases Shani.",
      "Wear Blue Sapphire (Neelam) — 3-5 carats, iron or panchadhatu, right middle finger, Saturday evening. With caution — trial period essential.",
      "Fast on Saturdays — black sesame-jaggery, black urad. Feed and clothe labourers, elders, and the disabled.",
      "Light a lamp under the Peepal tree, feed crows, serve black dogs. Use mustard oil for Shani abhishek.",
    ],
    hi: [
      "शनिवार शनि शिंगणापुर दर्शन. तेलाभिषेक, काला वस्त्र, काले तिल अर्पण. शनैश्चर स्तोत्र पाठ.",
      "'ॐ शं शनैश्चराय नमः' या शनि गायत्री का ४० दिनों में १९००० जाप.",
      "हनुमान चालीसा शनिवार ११ बार, सुंदरकांड पाठ. शनि व हनुमान मित्र — हनुमान साधना से शनि प्रसन्न.",
      "नीलम — ३-५ कैरेट, लोहे या पंचधातु में, दाहिनी मध्यमा, शनिवार संध्या. सावधानी से, ट्रायल आवश्यक.",
      "शनिवार व्रत — काले तिल-गुड़, काली उड़द. मजदूरों, वृद्धों, विकलांगों को भोजन व वस्त्र दान.",
      "पीपल दीप, कौओं को अन्न, काले कुत्तों की सेवा. शनि तेलाभिषेक हेतु सरसों तेल.",
    ],
  },
};

export function calculateShadBala(k: KundliResult, divCharts?: DivisionalChart[]): ShadBalaResult {
  const results: ShadBalaPlanet[] = [];

  for (const id of PLANET_IDS) {
    const p = k.planets.find((pp) => pp.id === id);
    if (!p) continue;

    const sthana = sthanaBala(p, id, divCharts);
    const dig = digBala(p, id);
    const kala = kalaBala(p, id, k);
    const chesta = chestaBala(p, id);
    const naisargika = naisargikaBala(id);
    const drik = drikBala(p, k.planets);

    const total = sthana + dig + kala + chesta + naisargika + drik;
    const required = REQUIRED_RUPA[id];
    const percent = (total / required) * 100;

    let verdict: ShadBalaPlanet["verdict"];
    let verdictMr: string; let verdictEn: string; let verdictHi: string;
    if (percent >= 140) { verdict = "very strong"; verdictMr = "अत्यंत प्रबळ"; verdictEn = "Very Strong"; verdictHi = "अत्यंत प्रबल"; }
    else if (percent >= 110) { verdict = "strong"; verdictMr = "प्रबळ"; verdictEn = "Strong"; verdictHi = "प्रबल"; }
    else if (percent >= 90) { verdict = "average"; verdictMr = "मध्यम"; verdictEn = "Average"; verdictHi = "मध्यम"; }
    else if (percent >= 70) { verdict = "weak"; verdictMr = "क्षीण"; verdictEn = "Weak"; verdictHi = "क्षीण"; }
    else { verdict = "very weak"; verdictMr = "अत्यंत क्षीण"; verdictEn = "Very Weak"; verdictHi = "अत्यंत क्षीण"; }

    results.push({
      id,
      nameMr: PLANET_MR[id],
      nameEn: id,
      sthana: round2(sthana),
      dig: round2(dig),
      kala: round2(kala),
      chesta: round2(chesta),
      naisargika: round2(naisargika),
      drik: round2(drik),
      total: round2(total),
      totalPoints: round2(total / 60),
      required,
      isStrong: total >= required,
      strengthRank: 0,
      percentOfRequired: round2(percent),
      verdict, verdictMr, verdictEn, verdictHi,
      remediesMr: PLANET_REMEDIES[id].mr,
      remediesEn: PLANET_REMEDIES[id].en,
      remediesHi: PLANET_REMEDIES[id].hi,
    });
  }

  // Rank by total strength
  const sorted = [...results].sort((a, b) => b.total - a.total);
  sorted.forEach((p, i) => {
    const target = results.find((r) => r.id === p.id);
    if (target) target.strengthRank = i + 1;
  });

  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return {
    planets: results,
    strongestEn: strongest.nameEn,
    strongestMr: strongest.nameMr,
    weakestEn: weakest.nameEn,
    weakestMr: weakest.nameMr,
    summaryMr: `सर्वाधिक प्रबळ ग्रह: ${strongest.nameMr} (${strongest.total} रूप). सर्वात कमजोर: ${weakest.nameMr} (${weakest.total} रूप).`,
    summaryEn: `Strongest planet: ${strongest.nameEn} (${strongest.total} rupa). Weakest: ${weakest.nameEn} (${weakest.total} rupa).`,
    summaryHi: `सर्वाधिक प्रबल ग्रह: ${strongest.nameMr} (${strongest.total} रूप). सबसे कमजोर: ${weakest.nameMr} (${weakest.total} रूप).`,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
