/**
 * Vedic Astrology Analysis Engine
 * Planetary strength, Yogas, Doshas, House analysis, Predictions & Remedies
 */

import type { PlanetPosition, KundliResult } from "./calculator";

// ─── Planetary Dignity ───────────────────────────────────────────────

// Exaltation signs (rashiIndex)
const EXALTATION: Record<string, number> = {
  Sun: 0,      // Aries
  Moon: 1,     // Taurus
  Mars: 9,     // Capricorn
  Mercury: 5,  // Virgo
  Jupiter: 3,  // Cancer
  Venus: 11,   // Pisces
  Saturn: 6,   // Libra
};

// Debilitation signs (opposite of exaltation)
const DEBILITATION: Record<string, number> = {
  Sun: 6,      // Libra
  Moon: 7,     // Scorpio
  Mars: 3,     // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9,  // Capricorn
  Venus: 5,    // Virgo
  Saturn: 0,   // Aries
};

// Own signs
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4],           // Leo
  Moon: [3],          // Cancer
  Mars: [0, 7],       // Aries, Scorpio
  Mercury: [2, 5],    // Gemini, Virgo
  Jupiter: [8, 11],   // Sagittarius, Pisces
  Venus: [1, 6],      // Taurus, Libra
  Saturn: [9, 10],    // Capricorn, Aquarius
};

// Moolatrikona signs
const MOOLATRIKONA: Record<string, number> = {
  Sun: 4,       // Leo
  Moon: 1,      // Taurus
  Mars: 0,      // Aries
  Mercury: 5,   // Virgo
  Jupiter: 8,   // Sagittarius
  Venus: 6,     // Libra
  Saturn: 10,   // Aquarius
};

// Friendly planets
const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"],
};

const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: ["Rahu", "Ketu"],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"],
};

export type PlanetDignity = "exalted" | "moolatrikona" | "own" | "friendly" | "neutral" | "enemy" | "debilitated";

export interface PlanetStrength {
  id: string;
  nameMr: string;
  nameEn: string;
  dignity: PlanetDignity;
  dignityMr: string;
  dignityEn: string;
  isRetrograde: boolean;
  isCombust: boolean;
  house: number;
  strengthScore: number; // 0-100
}

const DIGNITY_MR: Record<PlanetDignity, string> = {
  exalted: "उच्च",
  moolatrikona: "मूलत्रिकोण",
  own: "स्वगृही",
  friendly: "मित्रगृही",
  neutral: "समगृही",
  enemy: "शत्रुगृही",
  debilitated: "नीच",
};

const DIGNITY_EN: Record<PlanetDignity, string> = {
  exalted: "Exalted",
  moolatrikona: "Moolatrikona",
  own: "Own Sign",
  friendly: "Friendly Sign",
  neutral: "Neutral",
  enemy: "Enemy Sign",
  debilitated: "Debilitated",
};

function getPlanetDignity(planet: PlanetPosition): PlanetDignity {
  const id = planet.id;
  if (id === "Rahu" || id === "Ketu") return "neutral";

  if (EXALTATION[id] === planet.rashiIndex) return "exalted";
  if (DEBILITATION[id] === planet.rashiIndex) return "debilitated";

  // Moolatrikona: only in specific degree ranges within the sign
  // Sun: Leo 0-20°, Moon: Taurus 4-20°, Mars: Aries 0-12°, Mercury: Virgo 16-20°,
  // Jupiter: Sagittarius 0-10°, Venus: Libra 0-15°, Saturn: Aquarius 0-20°
  const mtRanges: Record<string, { sign: number; from: number; to: number }> = {
    Sun: { sign: 4, from: 0, to: 20 },
    Moon: { sign: 1, from: 4, to: 20 },
    Mars: { sign: 0, from: 0, to: 12 },
    Mercury: { sign: 5, from: 16, to: 20 },
    Jupiter: { sign: 8, from: 0, to: 10 },
    Venus: { sign: 6, from: 0, to: 15 },
    Saturn: { sign: 10, from: 0, to: 20 },
  };
  const mt = mtRanges[id];
  if (mt && planet.rashiIndex === mt.sign && planet.degreeInSign >= mt.from && planet.degreeInSign <= mt.to) {
    return "moolatrikona";
  }

  if (OWN_SIGNS[id]?.includes(planet.rashiIndex)) return "own";

  // Check sign lord friendship
  const signLords: Record<number, string> = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
    6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
  };
  const signLord = signLords[planet.rashiIndex];
  if (FRIENDS[id]?.includes(signLord)) return "friendly";
  if (ENEMIES[id]?.includes(signLord)) return "enemy";
  return "neutral";
}

function isCombust(planet: PlanetPosition, sun: PlanetPosition): boolean {
  if (planet.id === "Sun" || planet.id === "Rahu" || planet.id === "Ketu") return false;
  const diff = Math.abs(planet.siderealLongitude - sun.siderealLongitude);
  const distance = Math.min(diff, 360 - diff);
  const combustDegrees: Record<string, number> = {
    Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15,
  };
  return distance < (combustDegrees[planet.id] || 15);
}

export function analyzePlanetaryStrength(kundli: KundliResult): PlanetStrength[] {
  const sun = kundli.planets.find((p) => p.id === "Sun")!;

  return kundli.planets.map((p) => {
    const dignity = getPlanetDignity(p);
    const combust = isCombust(p, sun);

    // Simple strength scoring
    const dignityScores: Record<PlanetDignity, number> = {
      exalted: 95, moolatrikona: 85, own: 75, friendly: 60, neutral: 50, enemy: 35, debilitated: 15,
    };
    let score = dignityScores[dignity];
    if (combust) score -= 15;
    // Retrograde planets: per Phaladeepika, retrograde planets gain strength (like exalted)
    // They give delayed but intensified results — NOT weaker
    if (p.isRetrograde && (p.id !== "Rahu" && p.id !== "Ketu")) score += 5;
    // Planets in kendra (1,4,7,10) get a boost
    if ([1, 4, 7, 10].includes(p.house)) score += 10;
    // Planets in trikona (1,5,9) get a boost
    if ([5, 9].includes(p.house)) score += 8;
    // Planets in dusthana (6,8,12) get a penalty
    if ([6, 8, 12].includes(p.house)) score -= 10;
    score = Math.max(5, Math.min(100, score));

    return {
      id: p.id,
      nameMr: p.nameMr,
      nameEn: p.name,
      dignity,
      dignityMr: DIGNITY_MR[dignity],
      dignityEn: DIGNITY_EN[dignity],
      isRetrograde: p.isRetrograde,
      isCombust: combust,
      house: p.house,
      strengthScore: score,
    };
  });
}

// ─── Yoga Detection ──────────────────────────────────────────────────

export interface Yoga {
  nameMr: string;
  nameEn: string;
  descriptionMr: string;
  descriptionEn: string;
  type: "benefic" | "malefic" | "neutral";
  strength: "strong" | "moderate" | "weak";
}

export function detectYogas(kundli: KundliResult): Yoga[] {
  const yogas: Yoga[] = [];
  const planets = kundli.planets;
  const getP = (id: string) => planets.find((p) => p.id === id)!;
  const moon = getP("Moon");
  const jupiter = getP("Jupiter");
  const sun = getP("Sun");
  const mars = getP("Mars");
  const venus = getP("Venus");
  const saturn = getP("Saturn");
  const mercury = getP("Mercury");
  const rahu = getP("Rahu");
  const ketu = getP("Ketu");

  // Gajakesari Yoga: Jupiter in kendra from Moon
  // Weakened if Jupiter is debilitated, combust, or in enemy sign
  const jupFromMoon = ((jupiter.rashiIndex - moon.rashiIndex + 12) % 12);
  if ([0, 3, 6, 9].includes(jupFromMoon)) {
    const jupDignity = getPlanetDignity(jupiter);
    const jupCombust = isCombust(jupiter, sun);
    const isWeak = jupDignity === "debilitated" || jupDignity === "enemy" || jupCombust;
    yogas.push({
      nameMr: "गजकेसरी योग",
      nameEn: "Gajakesari Yoga",
      descriptionMr: isWeak
        ? `गुरु चंद्रापासून केंद्रस्थानी आहे, पण गुरु ${jupDignity === "debilitated" ? "नीच" : "दुर्बल"} ${jupCombust ? "आणि अस्त" : ""} आहे. योगाचे पूर्ण फळ मिळणार नाही. मर्यादित बुद्धिमत्ता आणि प्रतिष्ठा.`
        : "गुरु चंद्रापासून केंद्रस्थानी आहे. हा योग बुद्धिमत्ता, प्रसिद्धी आणि संपत्ती देतो. तुम्हाला समाजात मान-सन्मान मिळेल.",
      descriptionEn: isWeak
        ? `Jupiter is in a kendra from Moon, but Jupiter is ${jupDignity}${jupCombust ? " and combust" : ""}. Yoga effect is diminished. Limited fame and recognition.`
        : "Jupiter is in a kendra from Moon. This yoga bestows wisdom, fame, and wealth. You will earn respect and recognition in society.",
      type: "benefic",
      strength: isWeak ? "weak" : (jupiter.house === 1 || jupiter.house === 10 ? "strong" : "moderate"),
    });
  }

  // Budhaditya Yoga: Sun and Mercury in same sign
  // Note: This is very common (~60% charts) since Mercury never goes far from Sun.
  // Strength depends on: house placement, Mercury's combustion status, and dignity.
  if (sun.rashiIndex === mercury.rashiIndex) {
    const mercCombust = isCombust(mercury, sun);
    const inGoodHouse = [1, 4, 5, 7, 9, 10].includes(sun.house);
    yogas.push({
      nameMr: "बुधादित्य योग",
      nameEn: "Budhaditya Yoga",
      descriptionMr: mercCombust
        ? "सूर्य आणि बुध एकाच राशीत आहेत, पण बुध अस्त (सूर्याजवळ) आहे. योगाचे फळ कमी — बुद्धिमत्ता आहे पण व्यक्त करण्यात अडचण."
        : "सूर्य आणि बुध एकाच राशीत आहेत. हा योग तीव्र बुद्धिमत्ता, वक्तृत्व कौशल्य आणि व्यावसायिक यश देतो.",
      descriptionEn: mercCombust
        ? "Sun and Mercury are in the same sign, but Mercury is combust. Yoga effect is reduced — intellect is present but expression is hindered."
        : "Sun and Mercury are in the same sign. This yoga gives sharp intellect, eloquence, and professional success.",
      type: "benefic",
      strength: mercCombust ? "weak" : inGoodHouse ? "strong" : "moderate",
    });
  }

  // Chandra-Mangal Yoga: Moon and Mars in same sign
  if (moon.rashiIndex === mars.rashiIndex) {
    yogas.push({
      nameMr: "चंद्र-मंगळ योग",
      nameEn: "Chandra-Mangal Yoga",
      descriptionMr: "चंद्र आणि मंगळ एकाच राशीत आहेत. आर्थिक लाभ, धैर्य आणि व्यापारात यश मिळते.",
      descriptionEn: "Moon and Mars are in the same sign. This brings financial gains, courage, and success in business.",
      type: "benefic",
      strength: "moderate",
    });
  }

  // Raj Yoga: Lord of a kendra (1,4,7,10) conjunct with lord of a trikona (1,5,9)
  // Must check actual house lords based on lagna rashi
  const signLords: Record<number, string> = {
    0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
    6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
  };
  const lagnaIdx = kundli.lagnaRashiIndex;
  const kendraHouseRashis = [0, 3, 6, 9].map(offset => (lagnaIdx + offset) % 12);
  const trikonaHouseRashis = [0, 4, 8].map(offset => (lagnaIdx + offset) % 12);
  const kendraLords = new Set(kendraHouseRashis.map(r => signLords[r]));
  const trikonaLords = new Set(trikonaHouseRashis.map(r => signLords[r]));
  // Remove lagna lord from both (it's both kendra and trikona lord, doesn't count by itself)
  const lagnaLord = signLords[lagnaIdx];

  // Check if any kendra lord and trikona lord are conjunct (same rashi)
  const kendraLordPlanets = planets.filter(p => kendraLords.has(p.id) && p.id !== lagnaLord);
  const trikonaLordPlanets = planets.filter(p => trikonaLords.has(p.id) && p.id !== lagnaLord);
  for (const kp of kendraLordPlanets) {
    for (const tp of trikonaLordPlanets) {
      if (kp.id !== tp.id && kp.rashiIndex === tp.rashiIndex) {
        yogas.push({
          nameMr: "राजयोग",
          nameEn: "Raj Yoga",
          descriptionMr: `केंद्राधिपती ${kp.nameMr} आणि त्रिकोणाधिपती ${tp.nameMr} एकाच राशीत आहेत. राजकीय/सामाजिक उन्नती, अधिकार आणि सत्ता प्राप्ती.`,
          descriptionEn: `Kendra lord ${kp.id} and Trikona lord ${tp.id} are conjunct. This indicates political/social elevation, authority, and power.`,
          type: "benefic",
          strength: [1, 4, 7, 10].includes(kp.house) ? "strong" : "moderate",
        });
        break; // Only report one Raj Yoga
      }
    }
    if (yogas.some(y => y.nameEn === "Raj Yoga")) break;
  }

  // Dhana Yoga: Natural benefics (Jupiter/Venus/Mercury) in 2nd or 11th house
  // Only counts if the planet is NOT debilitated or combust (weak benefic won't give wealth)
  const beneficsInWealth = planets.filter(
    (p) => (p.house === 2 || p.house === 11) && ["Jupiter", "Venus", "Mercury"].includes(p.id)
  );
  const strongBeneficsInWealth = beneficsInWealth.filter((p) => {
    const dig = getPlanetDignity(p);
    const comb = isCombust(p, sun);
    return dig !== "debilitated" && !comb;
  });
  if (strongBeneficsInWealth.length > 0) {
    const names = strongBeneficsInWealth.map(p => p.nameMr).join(", ");
    const namesEn = strongBeneficsInWealth.map(p => p.id).join(", ");
    yogas.push({
      nameMr: `धनयोग — ${names} धनस्थानी`,
      nameEn: `Dhana Yoga — ${namesEn} in wealth house`,
      descriptionMr: "शुभ ग्रह धनस्थानी (2/11 भाव) बलवान स्थितीत आहेत. आर्थिक समृद्धी, संपत्ती वृद्धी आणि भौतिक सुखसमृद्धी.",
      descriptionEn: "Strong benefic planets in wealth houses (2nd/11th). Financial prosperity, wealth growth, and material abundance.",
      type: "benefic",
      strength: strongBeneficsInWealth.length > 1 ? "strong" : "moderate",
    });
  }

  // Viparita Raja Yoga: Lord of 6th in 8th/12th, lord of 8th in 6th/12th, lord of 12th in 6th/8th
  // Must check actual house lords for this lagna
  {
    const h6Rashi = (lagnaIdx + 5) % 12;
    const h8Rashi = (lagnaIdx + 7) % 12;
    const h12Rashi = (lagnaIdx + 11) % 12;
    const lord6 = signLords[h6Rashi];
    const lord8 = signLords[h8Rashi];
    const lord12 = signLords[h12Rashi];
    const lord6Planet = planets.find(p => p.id === lord6);
    const lord8Planet = planets.find(p => p.id === lord8);
    const lord12Planet = planets.find(p => p.id === lord12);

    const isVRY = (lord6Planet && [8, 12].includes(lord6Planet.house)) ||
                  (lord8Planet && [6, 12].includes(lord8Planet.house)) ||
                  (lord12Planet && [6, 8].includes(lord12Planet.house));

    if (isVRY) {
      yogas.push({
        nameMr: "विपरीत राजयोग",
        nameEn: "Viparita Raja Yoga",
        descriptionMr: "दुःस्थानाधिपती (6/8/12) दुसऱ्या दुःस्थानात आहे. संकटातून अनपेक्षित यश, शत्रूंवर विजय, अडचणी सोडवण्याची क्षमता.",
        descriptionEn: "Lord of dusthana (6/8/12) is placed in another dusthana. Unexpected success through adversity, ability to overcome obstacles.",
        type: "benefic",
        strength: "moderate",
      });
    }
  }

  // Hamsa Yoga (Pancha Mahapurusha): Jupiter in own/exalted sign in kendra
  if ([1, 4, 7, 10].includes(jupiter.house) &&
    (jupiter.rashiIndex === 3 || jupiter.rashiIndex === 8 || jupiter.rashiIndex === 11)) {
    yogas.push({
      nameMr: "हंस योग (पंचमहापुरुष)",
      nameEn: "Hamsa Yoga (Pancha Mahapurusha)",
      descriptionMr: "गुरु स्वगृही/उच्चीत केंद्रस्थानी आहे. उच्च नैतिकता, ज्ञान, आध्यात्मिक उन्नती आणि सन्मान.",
      descriptionEn: "Jupiter in own/exalted sign in kendra. High morality, knowledge, spiritual growth, and honor.",
      type: "benefic",
      strength: "strong",
    });
  }

  // Malavya Yoga: Venus in own/exalted sign in kendra
  if ([1, 4, 7, 10].includes(venus.house) &&
    (venus.rashiIndex === 1 || venus.rashiIndex === 6 || venus.rashiIndex === 11)) {
    yogas.push({
      nameMr: "मालव्य योग (पंचमहापुरुष)",
      nameEn: "Malavya Yoga (Pancha Mahapurusha)",
      descriptionMr: "शुक्र स्वगृही/उच्चीत केंद्रस्थानी आहे. सुंदर जीवनसाथी, कलात्मक गुण, भौतिक सुख.",
      descriptionEn: "Venus in own/exalted sign in kendra. Beautiful spouse, artistic talents, material comforts.",
      type: "benefic",
      strength: "strong",
    });
  }

  // Ruchaka Yoga: Mars in own/exalted sign in kendra
  if ([1, 4, 7, 10].includes(mars.house) &&
    (mars.rashiIndex === 0 || mars.rashiIndex === 7 || mars.rashiIndex === 9)) {
    yogas.push({
      nameMr: "रुचक योग (पंचमहापुरुष)",
      nameEn: "Ruchaka Yoga (Pancha Mahapurusha)",
      descriptionMr: "मंगळ स्वगृही/उच्चीत केंद्रस्थानी आहे. शारीरिक बल, धैर्य, नेतृत्व गुण.",
      descriptionEn: "Mars in own/exalted sign in kendra. Physical strength, courage, and leadership qualities.",
      type: "benefic",
      strength: "strong",
    });
  }

  // Shasha Yoga: Saturn in own/exalted sign in kendra
  if ([1, 4, 7, 10].includes(saturn.house) &&
    (saturn.rashiIndex === 6 || saturn.rashiIndex === 9 || saturn.rashiIndex === 10)) {
    yogas.push({
      nameMr: "शश योग (पंचमहापुरुष)",
      nameEn: "Shasha Yoga (Pancha Mahapurusha)",
      descriptionMr: "शनि स्वगृही/उच्चीत केंद्रस्थानी आहे. अधिकार, प्रशासनिक कौशल्य, दीर्घायुष्य.",
      descriptionEn: "Saturn in own/exalted sign in kendra. Authority, administrative skills, longevity.",
      type: "benefic",
      strength: "strong",
    });
  }

  // Bhadra Yoga: Mercury in own/exalted sign in kendra
  if ([1, 4, 7, 10].includes(mercury.house) &&
    (mercury.rashiIndex === 2 || mercury.rashiIndex === 5)) {
    yogas.push({
      nameMr: "भद्र योग (पंचमहापुरुष)",
      nameEn: "Bhadra Yoga (Pancha Mahapurusha)",
      descriptionMr: "बुध स्वगृही/उच्चीत केंद्रस्थानी आहे. तीक्ष्ण बुद्धी, संवाद कौशल्य, व्यापार कुशलता.",
      descriptionEn: "Mercury in own/exalted sign in kendra. Sharp intellect, communication skills, business acumen.",
      type: "benefic",
      strength: "strong",
    });
  }

  // Kemdrum Yoga: No planets on either side of Moon
  const moonIdx = moon.rashiIndex;
  const prevSign = (moonIdx + 11) % 12;
  const nextSign = (moonIdx + 1) % 12;
  const planetsAdjacentMoon = planets.filter(
    (p) => p.id !== "Moon" && p.id !== "Rahu" && p.id !== "Ketu" &&
    (p.rashiIndex === prevSign || p.rashiIndex === nextSign)
  );
  if (planetsAdjacentMoon.length === 0) {
    yogas.push({
      nameMr: "केमद्रुम योग",
      nameEn: "Kemdrum Yoga",
      descriptionMr: "चंद्राच्या दोन्ही बाजूला कोणताही ग्रह नाही. आर्थिक अस्थिरता, मानसिक चिंता. मात्र गुरुच्या दृष्टीने हा दोष कमी होतो.",
      descriptionEn: "No planets adjacent to Moon. Financial instability and mental worries, though Jupiter's aspect can reduce this.",
      type: "malefic",
      strength: "moderate",
    });
  }

  // Daridra Yoga: Lord of 11th house placed in 6th, 8th, or 12th in debilitated state
  // An empty 11th house does NOT mean Daridra Yoga
  {
    const h11Rashi = (lagnaIdx + 10) % 12;
    const lord11 = signLords[h11Rashi];
    const lord11Planet = planets.find(p => p.id === lord11);
    if (lord11Planet && [6, 8, 12].includes(lord11Planet.house)) {
      const lord11Dignity = getPlanetDignity(lord11Planet);
      if (lord11Dignity === "debilitated" || lord11Dignity === "enemy") {
        yogas.push({
          nameMr: "दरिद्र योग",
          nameEn: "Daridra Yoga",
          descriptionMr: `लाभस्थानाचा स्वामी ${lord11Planet.nameMr} दुःस्थानात (${lord11Planet.house}वा भाव) ${lord11Dignity === "debilitated" ? "नीच" : "शत्रुगृही"} स्थितीत आहे. आर्थिक लाभासाठी अधिक प्रयत्न करावे लागतील.`,
          descriptionEn: `11th house lord ${lord11Planet.id} is in dusthana (house ${lord11Planet.house}) in ${lord11Dignity} dignity. Extra effort needed for financial gains.`,
          type: "malefic",
          strength: lord11Dignity === "debilitated" ? "strong" : "moderate",
        });
      }
    }
  }

  return yogas;
}

// ─── Dosha Detection ─────────────────────────────────────────────────

export interface Dosha {
  nameMr: string;
  nameEn: string;
  present: boolean;
  severity: "high" | "medium" | "low" | "none";
  descriptionMr: string;
  descriptionEn: string;
  remedyMr: string;
  remedyEn: string;
}

export function detectDoshas(kundli: KundliResult): Dosha[] {
  const planets = kundli.planets;
  const sun = planets.find((p) => p.id === "Sun")!;
  const mars = planets.find((p) => p.id === "Mars")!;
  const rahu = planets.find((p) => p.id === "Rahu")!;
  const ketu = planets.find((p) => p.id === "Ketu")!;
  const saturn = planets.find((p) => p.id === "Saturn")!;
  const moon = planets.find((p) => p.id === "Moon")!;

  const doshas: Dosha[] = [];

  // ── Mangal Dosha (Manglik) ──
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const isManglik = manglikHouses.includes(mars.house);
  // Cancellation conditions (per Brihat Parashara Hora Shastra & Lal Kitab)
  let manglikCancelled = false;
  if (isManglik) {
    const jupiter = planets.find((p) => p.id === "Jupiter")!;
    const venus = planets.find((p) => p.id === "Venus")!;
    // 1. Mars in own sign (Aries/Scorpio) or exalted (Capricorn)
    if ([0, 7, 9].includes(mars.rashiIndex)) manglikCancelled = true;
    // 2. Jupiter aspects the 7th house (Jupiter in 1st, 5th, 7th, or 9th house)
    if ([1, 5, 7, 9].includes(jupiter.house)) manglikCancelled = true;
    // 3. Venus or Jupiter in 7th house
    if (venus.house === 7 || jupiter.house === 7) manglikCancelled = true;
    // 4. Mars in 2nd house AND in Gemini or Virgo (Mercury signs)
    if (mars.house === 2 && [2, 5].includes(mars.rashiIndex)) manglikCancelled = true;
    // 5. Mars in 12th house AND in Taurus or Libra (Venus signs)
    if (mars.house === 12 && [1, 6].includes(mars.rashiIndex)) manglikCancelled = true;
    // 6. Mars is conjunct with Jupiter (same rashi)
    if (mars.rashiIndex === jupiter.rashiIndex) manglikCancelled = true;
    // 7. Mars in 1st/4th/7th/8th in Aries, Leo, Sagittarius, Aquarius, or Capricorn
    if ([1, 4, 7, 8].includes(mars.house) && [0, 4, 8, 10, 9].includes(mars.rashiIndex)) manglikCancelled = true;
  }

  doshas.push({
    nameMr: "मांगलिक दोष (मंगळ दोष)",
    nameEn: "Mangal Dosha (Manglik)",
    present: isManglik,
    severity: isManglik ? (manglikCancelled ? "low" : (mars.house === 7 || mars.house === 8 ? "high" : "medium")) : "none",
    descriptionMr: isManglik
      ? manglikCancelled
        ? `मंगळ ${mars.house}व्या भावात आहे, पण दोष निवारण स्थिती आहे. विवाहात किरकोळ अडथळे येऊ शकतात.`
        : `मंगळ ${mars.house}व्या भावात आहे. विवाह विलंब, वैवाहिक तणाव, जोडीदाराशी मतभेद होऊ शकतात. मांगलिक व्यक्तीशी विवाह उत्तम.`
      : "मंगळ दोष नाही. विवाह संबंधात कोणताही अडथळा नाही.",
    descriptionEn: isManglik
      ? manglikCancelled
        ? `Mars is in house ${mars.house}, but cancellation conditions exist. Minor obstacles in marriage possible.`
        : `Mars is in house ${mars.house}. May cause marriage delay, marital tension, or disagreements. Marriage with another Manglik is recommended.`
      : "No Mangal Dosha present. No obstacles in marriage matters.",
    remedyMr: isManglik
      ? "हनुमान चालीसा रोज वाचा. मंगळवारी हनुमान मंदिरात जा. लाल प्रवाळ (Red Coral) रत्न धारण करा. मंगळनाथ मंदिरात पूजा करा."
      : "उपाय आवश्यक नाही.",
    remedyEn: isManglik
      ? "Recite Hanuman Chalisa daily. Visit Hanuman temple on Tuesdays. Wear Red Coral gemstone. Perform puja at Mangalnath temple."
      : "No remedy needed.",
  });

  // ── Kaal Sarp Dosha ──
  // All 7 planets (Sun-Saturn) between Rahu and Ketu
  const rahuIdx = rahu.rashiIndex;
  const ketuIdx = ketu.rashiIndex;
  const sevenPlanets = planets.filter(
    (p) => !["Rahu", "Ketu"].includes(p.id)
  );

  function isBetween(planetIdx: number, fromIdx: number, toIdx: number): boolean {
    if (fromIdx < toIdx) {
      return planetIdx > fromIdx && planetIdx < toIdx;
    }
    return planetIdx > fromIdx || planetIdx < toIdx;
  }

  const allBetweenRahuKetu = sevenPlanets.every((p) =>
    isBetween(p.rashiIndex, rahuIdx, ketuIdx)
  );
  const allBetweenKetuRahu = sevenPlanets.every((p) =>
    isBetween(p.rashiIndex, ketuIdx, rahuIdx)
  );
  const isKaalSarp = allBetweenRahuKetu || allBetweenKetuRahu;

  doshas.push({
    nameMr: "काल सर्प दोष",
    nameEn: "Kaal Sarp Dosha",
    present: isKaalSarp,
    severity: isKaalSarp ? "high" : "none",
    descriptionMr: isKaalSarp
      ? "सर्व ग्रह राहु-केतूच्या अक्षात आहेत. अचानक अडथळे, मानसिक अशांती, आयुष्यात उतार-चढाव. पण ३५ वर्षांनंतर प्रभाव कमी होतो."
      : "काल सर्प दोष नाही. राहु-केतू अक्षाचा नकारात्मक प्रभाव नाही.",
    descriptionEn: isKaalSarp
      ? "All planets are hemmed between Rahu-Ketu axis. Sudden obstacles, mental unrest, life ups and downs. Effect reduces after age 35."
      : "No Kaal Sarp Dosha. No negative influence from Rahu-Ketu axis.",
    remedyMr: isKaalSarp
      ? "त्र्यंबकेश्वर/काळहस्ती मंदिरात काल सर्प शांती पूजा करा. महामृत्युंजय मंत्र जप करा. रुद्राभिषेक करा. गोमेद रत्न धारण करा."
      : "उपाय आवश्यक नाही.",
    remedyEn: isKaalSarp
      ? "Perform Kaal Sarp Shanti Puja at Trimbakeshwar/Kalahasti. Chant Mahamrityunjay Mantra. Perform Rudrabhishek. Wear Gomed gemstone."
      : "No remedy needed.",
  });

  // ── Sade Sati ──
  const moonSign = moon.rashiIndex;
  const saturnSign = saturn.rashiIndex;
  const sadeSatiDiff = ((saturnSign - moonSign + 12) % 12);
  const isSadeSati = sadeSatiDiff === 11 || sadeSatiDiff === 0 || sadeSatiDiff === 1;
  const sadeSatiPhase = sadeSatiDiff === 11 ? "rising" : sadeSatiDiff === 0 ? "peak" : "setting";

  doshas.push({
    nameMr: "साडेसाती",
    nameEn: "Sade Sati",
    present: isSadeSati,
    severity: isSadeSati ? (sadeSatiPhase === "peak" ? "high" : "medium") : "none",
    descriptionMr: isSadeSati
      ? `जन्मकुंडलीत शनि चंद्रापासून ${sadeSatiPhase === "rising" ? "12व्या (चढती)" : sadeSatiPhase === "peak" ? "1ल्या (शिखर)" : "2ऱ्या (उतरती)"} स्थानात आहे. कर्मफल, शारीरिक/मानसिक तणाव, पण शिस्त आणि मेहनतीने यश मिळते.`
      : "जन्मकुंडलीत साडेसाती नाही. शनिचा चंद्रावर थेट प्रभाव नाही.",
    descriptionEn: isSadeSati
      ? `Saturn is in the ${sadeSatiPhase === "rising" ? "12th (rising)" : sadeSatiPhase === "peak" ? "1st (peak)" : "2nd (setting)"} position from Moon. Karma lessons, physical/mental stress, but discipline and hard work bring success.`
      : "No Sade Sati in birth chart. Saturn has no direct influence on Moon.",
    remedyMr: isSadeSati
      ? "शनिवारी हनुमान मंदिरात तेल अर्पण करा. शनिदेवाची पूजा करा. निळा नीलम रत्न (ज्योतिष सल्ल्याने) धारण करा. दान-धर्म करा."
      : "उपाय आवश्यक नाही.",
    remedyEn: isSadeSati
      ? "Offer oil at Hanuman temple on Saturdays. Worship Lord Shani. Wear Blue Sapphire (with astrologer advice). Practice charity."
      : "No remedy needed.",
  });

  // ── Pitra Dosha ──
  const sunWithRahu = sun.rashiIndex === rahu.rashiIndex;
  const sunInNine = sun.house === 9;
  const rahuInNine = rahu.house === 9;
  const isPitrDosha = sunWithRahu || (sunInNine && rahuInNine);

  doshas.push({
    nameMr: "पितृ दोष",
    nameEn: "Pitra Dosha",
    present: isPitrDosha,
    severity: isPitrDosha ? "medium" : "none",
    descriptionMr: isPitrDosha
      ? "सूर्य-राहू युती/9व्या भावात प्रभाव. पितृकार्यात अडथळे, पिढ्यांचे अपूर्ण कर्म. संतती/करिअरमध्ये विलंब."
      : "पितृ दोष नाही.",
    descriptionEn: isPitrDosha
      ? "Sun-Rahu conjunction or influence in 9th house. Obstacles in ancestral matters, generational karma. Delays in progeny/career."
      : "No Pitra Dosha present.",
    remedyMr: isPitrDosha
      ? "पितृ तर्पण करा. श्राद्ध विधी नियमित करा. गया/प्रयागमध्ये पिंडदान करा. रविवारी सूर्यदेवाला अर्घ्य द्या."
      : "उपाय आवश्यक नाही.",
    remedyEn: isPitrDosha
      ? "Perform Pitru Tarpan. Observe regular Shraddha rituals. Offer Pind Daan at Gaya/Prayag. Offer Arghya to Sun on Sundays."
      : "No remedy needed.",
  });

  return doshas;
}

// ─── House-wise Predictions ──────────────────────────────────────────

export interface HousePrediction {
  house: number;
  titleMr: string;
  titleEn: string;
  iconLabel: string;
  predictionMr: string;
  predictionEn: string;
  rating: number; // 1-5 stars
}

const HOUSE_THEMES: {
  house: number; titleMr: string; titleEn: string; icon: string;
  goodMr: string; goodEn: string; badMr: string; badEn: string; emptyMr: string; emptyEn: string;
}[] = [
  {
    house: 1, titleMr: "व्यक्तिमत्व / आरोग्य", titleEn: "Personality / Health", icon: "🧍",
    goodMr: "आत्मविश्वासी, आकर्षक व्यक्तिमत्व. चांगले आरोग्य, नेतृत्वगुण. लोक तुमच्याकडे आकर्षित होतात.",
    goodEn: "Confident, attractive personality. Good health, leadership qualities. People are naturally drawn to you.",
    badMr: "आरोग्याकडे विशेष लक्ष द्या. आत्मविश्वासाची कमतरता जाणवू शकते. स्वतःवर काम करा.",
    badEn: "Pay extra attention to health. May feel lack of confidence at times. Work on self-improvement.",
    emptyMr: "व्यक्तिमत्व लग्नराशीच्या स्वामीवर अवलंबून. सामान्यपणे संतुलित आरोग्य.",
    emptyEn: "Personality depends on ascendant lord. Generally balanced health.",
  },
  {
    house: 2, titleMr: "धन / कुटुंब / वाणी", titleEn: "Wealth / Family / Speech", icon: "💰",
    goodMr: "आर्थिक स्थिती मजबूत. मधुर वाणी, कुटुंबात सुख. संपत्ती वाढत राहील. बचतीची सवय लाभदायक.",
    goodEn: "Strong financial position. Sweet speech, family happiness. Wealth will keep growing. Savings habit beneficial.",
    badMr: "आर्थिक व्यवस्थापन शिका. कठोर वाणीमुळे संबंध बिघडू शकतात. कुटुंबात मतभेद.",
    badEn: "Learn financial management. Harsh speech may strain relationships. Possible family disagreements.",
    emptyMr: "आर्थिक स्थिती मध्यम. स्वतःच्या प्रयत्नांवर अवलंबून. कुटुंब सामान्य.",
    emptyEn: "Average financial situation. Depends on own efforts. Normal family life.",
  },
  {
    house: 3, titleMr: "पराक्रम / भावंडे / संवाद", titleEn: "Courage / Siblings / Communication", icon: "💪",
    goodMr: "धाडसी, संवाद कुशल. भावंडांशी चांगले संबंध. लेखन/मीडिया/संवाद क्षेत्रात यश. छोट्या प्रवासांमधून लाभ.",
    goodEn: "Courageous, skilled communicator. Good sibling relations. Success in writing/media. Gains through short travels.",
    badMr: "निर्णय घेताना घाई करू नका. भावंडांशी मतभेद होऊ शकतात. अतिउत्साहापासून सावध.",
    badEn: "Don't rush decisions. Possible sibling disagreements. Be cautious of over-enthusiasm.",
    emptyMr: "सामान्य पराक्रम. भावंडांशी तटस्थ संबंध. संवाद कौशल्य विकसित करा.",
    emptyEn: "Average courage. Neutral sibling relations. Develop communication skills.",
  },
  {
    house: 4, titleMr: "सुख / माता / घर / वाहन", titleEn: "Happiness / Mother / Home / Vehicle", icon: "🏠",
    goodMr: "मातेचे प्रेम, घरगुती सुख. स्वतःचे घर/वाहन मिळेल. शैक्षणिक यश. मानसिक शांतता.",
    goodEn: "Mother's love, domestic happiness. Will acquire own house/vehicle. Academic success. Mental peace.",
    badMr: "घरगुती तणाव. मातेच्या आरोग्याची काळजी घ्या. मालमत्ता संबंधी काळजीपूर्वक निर्णय घ्या.",
    badEn: "Domestic stress possible. Take care of mother's health. Make property decisions carefully.",
    emptyMr: "सुख मध्यम. स्वतःच्या कर्तृत्वाने सुख-सोयी मिळवाव्या लागतील.",
    emptyEn: "Moderate happiness. Will need to earn comforts through own effort.",
  },
  {
    house: 5, titleMr: "बुद्धी / संतती / प्रेम / शिक्षण", titleEn: "Intelligence / Children / Romance / Education", icon: "🎓",
    goodMr: "तीक्ष्ण बुद्धिमत्ता, शैक्षणिक उत्कृष्टता. प्रेमात यश. संतती सुखी. शेअर बाजार/सट्टा लाभदायक.",
    goodEn: "Sharp intelligence, academic excellence. Success in romance. Happy children. Stock market/speculation profitable.",
    badMr: "शिक्षणात अडथळे येऊ शकतात. प्रेमसंबंधात सावध राहा. संतती विलंब शक्य.",
    badEn: "Education obstacles possible. Be cautious in romance. Possible delay in having children.",
    emptyMr: "बुद्धी सामान्य. शिक्षण मेहनतीने मिळेल. संतती सामान्य.",
    emptyEn: "Average intelligence. Education through hard work. Normal progeny.",
  },
  {
    house: 6, titleMr: "शत्रू / रोग / कर्ज / स्पर्धा", titleEn: "Enemies / Disease / Debt / Competition", icon: "⚔️",
    goodMr: "शत्रूंवर विजय. स्पर्धा परीक्षांत यश. रोगांवर मात. सेवा क्षेत्रात उत्तम. कर्जमुक्ती.",
    goodEn: "Victory over enemies. Success in competitive exams. Overcoming diseases. Excellent in service sector. Debt freedom.",
    badMr: "आरोग्य समस्या, शत्रूंचा त्रास. कर्ज वाढू शकते. कायदेशीर वाद टाळा.",
    badEn: "Health issues, trouble from enemies. Debts may increase. Avoid legal disputes.",
    emptyMr: "शत्रू कमी. आरोग्य सामान्य. स्पर्धा मध्यम.",
    emptyEn: "Few enemies. Average health. Moderate competition.",
  },
  {
    house: 7, titleMr: "विवाह / भागीदारी / जोडीदार", titleEn: "Marriage / Partnership / Spouse", icon: "💑",
    goodMr: "सुखी वैवाहिक जीवन. चांगला जोडीदार. व्यावसायिक भागीदारी लाभदायक. सार्वजनिक संबंध उत्तम.",
    goodEn: "Happy married life. Good spouse. Business partnerships profitable. Excellent public relations.",
    badMr: "विवाहात विलंब/अडथळे. जोडीदाराशी मतभेद. भागीदारी सावधगिरीने करा.",
    badEn: "Marriage delays/obstacles. Disagreements with spouse. Be cautious in partnerships.",
    emptyMr: "विवाह सामान्य. लग्नाचा ७वा भाव स्वामीवर अवलंबून.",
    emptyEn: "Normal marriage. Depends on 7th house lord placement.",
  },
  {
    house: 8, titleMr: "आयुष्य / गुप्त ज्ञान / वारसा", titleEn: "Longevity / Occult / Inheritance", icon: "🔮",
    goodMr: "दीर्घायुष्य. गूढ विद्या/ज्योतिषात रस. अनपेक्षित वारसा. संशोधन क्षमता.",
    goodEn: "Longevity. Interest in occult/astrology. Unexpected inheritance. Research abilities.",
    badMr: "अचानक संकटे. गुप्त शत्रू. दीर्घकालीन आजार सावधगिरी. वारसा वादात अडकू शकतो.",
    badEn: "Sudden crises. Hidden enemies. Chronic disease caution. Inheritance disputes possible.",
    emptyMr: "सामान्य आयुष्य. गूढ विषयांत मध्यम रस.",
    emptyEn: "Normal longevity. Moderate interest in occult matters.",
  },
  {
    house: 9, titleMr: "भाग्य / धर्म / पिता / लांबचा प्रवास", titleEn: "Fortune / Religion / Father / Long Travel", icon: "🍀",
    goodMr: "अत्यंत भाग्यवान. पित्याचा आशीर्वाद. धार्मिक/आध्यात्मिक वृत्ती. परदेश प्रवास/उच्च शिक्षणात यश.",
    goodEn: "Very fortunate. Father's blessings. Religious/spiritual inclination. Success in foreign travel/higher education.",
    badMr: "भाग्य विलंबाने मिळेल. पित्याशी मतभेद. धर्म/श्रद्धेत संभ्रम. परदेश अडथळे.",
    badEn: "Fortune comes late. Father disagreements. Confusion in faith. Foreign travel obstacles.",
    emptyMr: "भाग्य मध्यम. स्वतःच्या कर्मावर अवलंबून. मेहनत फळ देईल.",
    emptyEn: "Average fortune. Depends on own karma. Hard work will pay off.",
  },
  {
    house: 10, titleMr: "करिअर / कीर्ती / व्यवसाय", titleEn: "Career / Fame / Profession", icon: "💼",
    goodMr: "उत्कृष्ट करिअर. सामाजिक प्रतिष्ठा. सरकारी/उच्च पदावर नियुक्ती. नेतृत्व गुण. व्यवसायात यश.",
    goodEn: "Excellent career. Social prestige. Government/high position appointment. Leadership. Business success.",
    badMr: "करिअरमध्ये अडथळे. वरिष्ठांशी मतभेद. नोकरी बदल. कीर्तीला धोका.",
    badEn: "Career obstacles. Disagreements with superiors. Job changes. Reputation risks.",
    emptyMr: "करिअर सामान्य. मेहनत आणि कौशल्यावर अवलंबून.",
    emptyEn: "Average career. Depends on effort and skills.",
  },
  {
    house: 11, titleMr: "लाभ / मित्र / आकांक्षा", titleEn: "Gains / Friends / Aspirations", icon: "🎯",
    goodMr: "सर्व इच्छांची पूर्ती. मित्रांचा सहकार. आर्थिक लाभ. सामाजिक नेटवर्क मजबूत. ज्येष्ठ भावंडांचा लाभ.",
    goodEn: "Fulfillment of desires. Friends' support. Financial gains. Strong social network. Benefits from elder siblings.",
    badMr: "इच्छापूर्तीत विलंब. मित्रांपासून निराशा. आर्थिक लाभ अनियमित.",
    badEn: "Delay in wish fulfillment. Disappointment from friends. Irregular financial gains.",
    emptyMr: "लाभ मध्यम. स्वतःच्या प्रयत्नांवर अधिक अवलंबून.",
    emptyEn: "Average gains. Mostly depends on own efforts.",
  },
  {
    house: 12, titleMr: "खर्च / मोक्ष / परदेश / झोप", titleEn: "Expenses / Liberation / Foreign / Sleep", icon: "✈️",
    goodMr: "आध्यात्मिक उन्नती. परदेश यश. चांगली झोप. दानधर्मात रस. मोक्षप्राप्तीची शक्यता.",
    goodEn: "Spiritual growth. Foreign success. Good sleep. Interest in charity. Possibility of liberation.",
    badMr: "अनावश्यक खर्च. झोपेच्या समस्या. गुप्त शत्रू. रुग्णालय/न्यायालय संबंध. एकाकीपणा.",
    badEn: "Unnecessary expenses. Sleep problems. Hidden enemies. Hospital/court connections. Loneliness.",
    emptyMr: "खर्च सामान्य. आध्यात्मिक विकासासाठी प्रयत्न करा.",
    emptyEn: "Normal expenses. Make effort for spiritual development.",
  },
];

export function generateHousePredictions(kundli: KundliResult): HousePrediction[] {
  const strengths = analyzePlanetaryStrength(kundli);

  return HOUSE_THEMES.map((theme) => {
    const planetsInHouse = kundli.planets.filter((p) => p.house === theme.house);
    const benefics = planetsInHouse.filter((p) => ["Jupiter", "Venus", "Mercury", "Moon"].includes(p.id));
    const malefics = planetsInHouse.filter((p) => ["Saturn", "Mars", "Rahu", "Ketu", "Sun"].includes(p.id));

    // Check planet strength in this house
    const houseStrengths = planetsInHouse.map((p) => strengths.find((s) => s.id === p.id)!);
    const avgStrength = houseStrengths.length > 0
      ? houseStrengths.reduce((a, b) => a + b.strengthScore, 0) / houseStrengths.length
      : 50;

    let rating: number;
    let predMr: string;
    let predEn: string;

    if (planetsInHouse.length === 0) {
      predMr = theme.emptyMr;
      predEn = theme.emptyEn;
      rating = 3;
    } else if (benefics.length > malefics.length || avgStrength > 60) {
      predMr = theme.goodMr;
      predEn = theme.goodEn;
      rating = benefics.length >= 2 ? 5 : 4;
    } else {
      predMr = theme.badMr;
      predEn = theme.badEn;
      rating = malefics.length >= 2 ? 1 : 2;
    }

    // Add personalized planet notes with their dignity
    if (planetsInHouse.length > 0) {
      const detailsMr = planetsInHouse.map((p) => {
        const s = strengths.find((x) => x.id === p.id);
        const digText = s ? ` (${s.dignityMr}, बल ${s.strengthScore}%)` : "";
        return `${p.nameMr}${digText}`;
      }).join(", ");
      const detailsEn = planetsInHouse.map((p) => {
        const s = strengths.find((x) => x.id === p.id);
        const digText = s ? ` (${s.dignityEn}, ${s.strengthScore}%)` : "";
        return `${p.name}${digText}`;
      }).join(", ");
      predMr = `या भावात ${detailsMr} — ` + predMr;
      predEn = `${detailsEn} in this house — ` + predEn;
    }

    return {
      house: theme.house,
      titleMr: theme.titleMr,
      titleEn: theme.titleEn,
      iconLabel: theme.icon,
      predictionMr: predMr,
      predictionEn: predEn,
      rating,
    };
  });
}

// ─── Current Dasha Interpretation ────────────────────────────────────

export interface DashaInterpretation {
  lordMr: string;
  lordEn: string;
  periodMr: string;
  periodEn: string;
  careerMr: string;
  careerEn: string;
  financeMr: string;
  financeEn: string;
  healthMr: string;
  healthEn: string;
  relationshipMr: string;
  relationshipEn: string;
  adviceMr: string;
  adviceEn: string;
}

const DASHA_INTERP: Record<string, {
  careerMr: string; careerEn: string;
  financeMr: string; financeEn: string;
  healthMr: string; healthEn: string;
  relationshipMr: string; relationshipEn: string;
  adviceMr: string; adviceEn: string;
}> = {
  Sun: {
    careerMr: "सरकारी क्षेत्र/अधिकारपदात संधी. नेतृत्व गुण उजळतील. प्रशासन, राजकारण, वैद्यकीय क्षेत्रात यश.",
    careerEn: "Opportunities in government/authority positions. Leadership qualities shine. Success in administration, politics, medicine.",
    financeMr: "पित्याकडून/सरकारकडून आर्थिक लाभ. स्थिर उत्पन्न. सोने/सूर्य संबंधित गुंतवणूक फायदेशीर.",
    financeEn: "Financial gains from father/government. Stable income. Gold/Sun-related investments beneficial.",
    healthMr: "हृदय, डोळे, हाडांची काळजी घ्या. शरीरात उष्णता वाढू शकते. सकाळी सूर्यप्रकाश घ्या.",
    healthEn: "Take care of heart, eyes, bones. Body heat may increase. Get morning sunlight.",
    relationshipMr: "पित्याशी संबंध सुधारतील. सत्ताधाऱ्यांशी चांगले संबंध. आत्मकेंद्रीपणा टाळा.",
    relationshipEn: "Father relations improve. Good relations with authorities. Avoid self-centeredness.",
    adviceMr: "रविवारी सूर्योदयाला सूर्यनमस्कार करा. आदित्य हृदय स्तोत्र वाचा. माणिक रत्न धारण करा.",
    adviceEn: "Do Surya Namaskar at sunrise on Sundays. Recite Aditya Hridaya Stotra. Wear Ruby gemstone.",
  },
  Moon: {
    careerMr: "सृजनशील/कलात्मक क्षेत्रात यश. जनसंपर्क, हॉटेल, पर्यटन क्षेत्रात संधी. मातृप्रेम.",
    careerEn: "Success in creative/artistic fields. Opportunities in PR, hospitality, tourism. Mother's love.",
    financeMr: "द्रवपदार्थ/पाणी संबंधित व्यवसायातून लाभ. मातेकडून संपत्ती. चांदी गुंतवणूक उत्तम.",
    financeEn: "Gains from liquid/water-related business. Property from mother. Silver investment good.",
    healthMr: "मानसिक आरोग्य महत्वाचे. झोपेचे चक्र सांभाळा. पाण्याशी संबंधित आजार सावध.",
    healthEn: "Mental health important. Maintain sleep cycle. Be careful of water-related ailments.",
    relationshipMr: "भावनिक नाती मजबूत. मातेशी जवळीक. पण भावनिक अस्थिरता टाळा.",
    relationshipEn: "Emotional bonds strengthen. Closeness with mother. But avoid emotional instability.",
    adviceMr: "सोमवारी शिवपूजा करा. चांदीचा चंद्र धारण करा. मोती रत्न लाभदायक.",
    adviceEn: "Worship Lord Shiva on Mondays. Wear silver Moon. Pearl gemstone beneficial.",
  },
  Mars: {
    careerMr: "पोलीस, सैन्य, खेळ, इंजिनिअरिंग, शस्त्रक्रिया क्षेत्रात यश. स्वतःचा उद्योग सुरू करा. जमीन/मालमत्ता लाभ.",
    careerEn: "Success in police, military, sports, engineering, surgery. Start own business. Land/property gains.",
    financeMr: "जमीन/मालमत्ता गुंतवणूक लाभदायक. भावंडांपासून आर्थिक सहकार्य. लाल प्रवाळ शुभ.",
    financeEn: "Land/property investment beneficial. Financial support from siblings. Red Coral auspicious.",
    healthMr: "रक्त, स्नायू, अपघातांची काळजी घ्या. क्रोधावर नियंत्रण ठेवा. नियमित व्यायाम करा.",
    healthEn: "Take care of blood, muscles, accidents. Control anger. Exercise regularly.",
    relationshipMr: "भावंडांशी सहकार्य. वैवाहिक जीवनात उत्कटता. पण भांडणे टाळा.",
    relationshipEn: "Sibling cooperation. Passion in married life. But avoid arguments.",
    adviceMr: "मंगळवारी हनुमान चालीसा वाचा. लाल प्रवाळ रत्न धारण करा. दान करा.",
    adviceEn: "Recite Hanuman Chalisa on Tuesdays. Wear Red Coral. Practice charity.",
  },
  Mercury: {
    careerMr: "व्यापार, लेखन, IT, कायदा, शिक्षण क्षेत्रात उत्कृष्ट. संवाद कौशल्य शिखरावर. विश्लेषणात्मक कामे.",
    careerEn: "Excellent in business, writing, IT, law, education. Communication skills at peak. Analytical work.",
    financeMr: "व्यापार/शेअर बाजारातून लाभ. बौद्धिक कामातून उत्पन्न. हिरवा पन्ना शुभ.",
    financeEn: "Gains from business/stock market. Income from intellectual work. Emerald auspicious.",
    healthMr: "त्वचा, मज्जासंस्था, फुफ्फुसांची काळजी. मानसिक तणाव कमी करा. ध्यान करा.",
    healthEn: "Care for skin, nervous system, lungs. Reduce mental stress. Meditate.",
    relationshipMr: "मित्रांशी उत्तम संबंध. बौद्धिक जोडीदार भेटेल. संवाद सुधारा.",
    relationshipEn: "Great relations with friends. May meet intellectual partner. Improve communication.",
    adviceMr: "बुधवारी विष्णू पूजा करा. पन्ना रत्न धारण करा. हिरवे कपडे वापरा.",
    adviceEn: "Worship Lord Vishnu on Wednesdays. Wear Emerald. Use green clothing.",
  },
  Jupiter: {
    careerMr: "शिक्षण, ज्योतिष, कायदा, बँकिंग, आध्यात्मिक क्षेत्रात यश. गुरू/मार्गदर्शक भेटतील. सन्मान प्राप्ती.",
    careerEn: "Success in education, astrology, law, banking, spiritual fields. Will find guru/mentors. Receive honors.",
    financeMr: "गुरूंच्या कृपेने आर्थिक वृद्धी. धार्मिक कार्यातून लाभ. पुखराज रत्न शुभ. सोने गुंतवणूक.",
    financeEn: "Financial growth through guru's grace. Gains from religious work. Yellow Sapphire auspicious. Gold investment.",
    healthMr: "यकृत, मधुमेह, वजन वाढीची काळजी. सात्त्विक आहार घ्या. आध्यात्मिक साधना करा.",
    healthEn: "Care for liver, diabetes, weight. Take sattvic diet. Practice spiritual sadhana.",
    relationshipMr: "गुरूजनांचा आशीर्वाद. संतती सुख. धार्मिक जोडीदार भेटेल. कुटुंबात सुसंवाद.",
    relationshipEn: "Blessings from elders. Progeny happiness. May meet religious partner. Family harmony.",
    adviceMr: "गुरुवारी विष्णू/बृहस्पती पूजा करा. पुखराज धारण करा. पिवळे कपडे वापरा. केळी दान करा.",
    adviceEn: "Worship Vishnu/Brihaspati on Thursdays. Wear Yellow Sapphire. Use yellow clothes. Donate bananas.",
  },
  Venus: {
    careerMr: "कला, संगीत, सिनेमा, फॅशन, सौंदर्य प्रसाधने, हॉटेल क्षेत्रात यश. भौतिक सुख वाढेल. विलासिता.",
    careerEn: "Success in art, music, cinema, fashion, cosmetics, hospitality. Material comforts increase. Luxury.",
    financeMr: "भौतिक संपत्ती वाढेल. कलात्मक कामातून उत्पन्न. हिरा/ओपल शुभ. वाहन/घर खरेदी.",
    financeEn: "Material wealth increases. Income from artistic work. Diamond/Opal auspicious. Vehicle/home purchase.",
    healthMr: "मूत्रपिंड, प्रजनन अवयव, मधुमेह काळजी. सौंदर्य वाढेल. अतिभोग टाळा.",
    healthEn: "Kidney, reproductive organs, diabetes care. Beauty enhances. Avoid excess indulgence.",
    relationshipMr: "प्रेम फुलेल. सुंदर जोडीदार. वैवाहिक सुख. पण मोहापासून सावध.",
    relationshipEn: "Love blossoms. Beautiful spouse. Marital happiness. But beware of temptation.",
    adviceMr: "शुक्रवारी लक्ष्मी पूजा करा. हिरा/ओपल धारण करा. पांढरे कपडे वापरा.",
    adviceEn: "Worship Lakshmi on Fridays. Wear Diamond/Opal. Use white clothes.",
  },
  Saturn: {
    careerMr: "कठोर परिश्रमाचे फळ. सरकारी नोकरी, लोह/तेल उद्योग, न्याय क्षेत्रात यश. धीमी पण निश्चित प्रगती.",
    careerEn: "Fruit of hard work. Government job, iron/oil industry, justice sector success. Slow but steady progress.",
    financeMr: "विलंबाने पण स्थिर आर्थिक प्रगती. जमीन/इमारत गुंतवणूक. निळा नीलम शुभ. बचत करा.",
    financeEn: "Delayed but stable financial progress. Land/building investment. Blue Sapphire auspicious. Save money.",
    healthMr: "सांधे, दात, हाडे, पाय काळजी. वात विकार सावध. नियमित व्यायाम अत्यंत आवश्यक.",
    healthEn: "Care for joints, teeth, bones, legs. Beware of Vata disorders. Regular exercise essential.",
    relationshipMr: "ज्येष्ठांचा आदर करा. नम्रता आणा. एकाकीपणा जाणवू शकतो. सेवाभावी वृत्ती ठेवा.",
    relationshipEn: "Respect elders. Cultivate humility. May feel loneliness. Maintain service-oriented attitude.",
    adviceMr: "शनिवारी हनुमान मंदिरात तेल चढवा. शनिदेव मंत्र जप करा. काळे कपडे वापरा. गरिबांना दान करा.",
    adviceEn: "Offer oil at Hanuman temple on Saturdays. Chant Shani mantra. Wear black clothes. Donate to poor.",
  },
  Rahu: {
    careerMr: "तंत्रज्ञान, IT, विदेश, राजकारण, मीडिया क्षेत्रात अनपेक्षित यश. नवीन मार्ग. अपारंपरिक करिअर.",
    careerEn: "Unexpected success in technology, IT, foreign, politics, media. New paths. Unconventional career.",
    financeMr: "अचानक लाभ/हानी. शेअर बाजार सावधगिरीने. विदेशी चलन/तंत्रज्ञान गुंतवणूक. गोमेद शुभ.",
    financeEn: "Sudden gains/losses. Stock market with caution. Foreign currency/tech investment. Hessonite auspicious.",
    healthMr: "गूढ/असामान्य आजार सावध. विषबाधा, त्वचारोग काळजी. मानसिक शांतता राखा.",
    healthEn: "Beware of mysterious/unusual ailments. Poisoning, skin disease care. Maintain mental peace.",
    relationshipMr: "परकीय/विदेशी व्यक्तींशी संबंध. गैरसमज टाळा. मोह/भ्रम सावध.",
    relationshipEn: "Relations with foreign/outsider people. Avoid misunderstandings. Beware of illusion/temptation.",
    adviceMr: "राहू मंत्र जप करा. गोमेद धारण करा. दुर्गा पूजा करा. नारळ दान करा.",
    adviceEn: "Chant Rahu mantra. Wear Hessonite. Worship Durga. Donate coconut.",
  },
  Ketu: {
    careerMr: "आध्यात्मिक/गूढ क्षेत्रात रस. संशोधन, IT, वैद्यकीय क्षेत्रात यश. भौतिक वैराग्य.",
    careerEn: "Interest in spiritual/occult fields. Success in research, IT, medicine. Material detachment.",
    financeMr: "अनपेक्षित लाभ. वारसा संपत्ती. भौतिक गोष्टींपासून अलिप्तता. लहसुनिया शुभ.",
    financeEn: "Unexpected gains. Inherited wealth. Detachment from material things. Cat's Eye auspicious.",
    healthMr: "गूढ आजार, शस्त्रक्रिया, अपघात सावध. आध्यात्मिक उपचार लाभदायक.",
    healthEn: "Mysterious ailments, surgery, accidents caution. Spiritual healing beneficial.",
    relationshipMr: "वैराग्य भावना. कुटुंबापासून अलिप्तता. आध्यात्मिक साथीदार भेटेल.",
    relationshipEn: "Detachment feeling. Distance from family. May meet spiritual companion.",
    adviceMr: "केतू मंत्र जप करा. गणपती पूजा करा. लहसुनिया धारण करा. कुत्र्याला अन्न द्या.",
    adviceEn: "Chant Ketu mantra. Worship Ganesha. Wear Cat's Eye. Feed dogs.",
  },
};

export function interpretCurrentDasha(kundli: KundliResult): DashaInterpretation | null {
  // Use IST time for current dasha comparison
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const now = new Date(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate());
  const currentDasha = kundli.dashas.find((d) => now >= d.startDate && now <= d.endDate);
  if (!currentDasha) return null;

  const lord = currentDasha.lord;
  const baseInterp = DASHA_INTERP[lord];
  if (!baseInterp) return null;

  const PLANET_MR: Record<string, string> = {
    Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
    Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
  };

  // Get actual position & strength of dasha lord in the chart
  const strengths = analyzePlanetaryStrength(kundli);
  const lordStrength = strengths.find((s) => s.id === lord);
  const lordPlanet = kundli.planets.find((p) => p.id === lord);
  const lordHouse = lordPlanet?.house ?? 0;
  const score = lordStrength?.strengthScore ?? 50;
  const dignity = lordStrength?.dignityEn ?? "neutral";
  const dignityMr = lordStrength?.dignityMr ?? "सामान्य";
  const isRetro = lordStrength?.isRetrograde ?? false;
  const isCombust = lordStrength?.isCombust ?? false;

  // Build personalized prefix based on actual chart position
  const isStrong = score >= 60;
  const isWeak = score < 40;

  const HOUSE_MEANINGS_MR: Record<number, string> = {
    1: "लग्नात", 2: "धनभावात", 3: "पराक्रमभावात", 4: "सुखभावात",
    5: "पंचमभावात", 6: "षष्ठभावात", 7: "सप्तमभावात", 8: "अष्टमभावात",
    9: "भाग्यभावात", 10: "कर्मभावात", 11: "लाभभावात", 12: "व्ययभावात",
  };
  const HOUSE_MEANINGS_EN: Record<number, string> = {
    1: "1st house (Self)", 2: "2nd house (Wealth)", 3: "3rd house (Courage)", 4: "4th house (Happiness)",
    5: "5th house (Intelligence)", 6: "6th house (Enemies)", 7: "7th house (Marriage)", 8: "8th house (Longevity)",
    9: "9th house (Fortune)", 10: "10th house (Career)", 11: "11th house (Gains)", 12: "12th house (Expenses)",
  };

  const positionNoteMr = `तुमच्या कुंडलीत ${PLANET_MR[lord]} ${HOUSE_MEANINGS_MR[lordHouse] || `${lordHouse}व्या भावात`} ${dignityMr} स्थितीत आहे (बल: ${score}%).`
    + (isRetro ? " हा ग्रह वक्री आहे, त्यामुळे फळात विलंब पण तीव्रता अधिक." : "")
    + (isCombust ? " अस्त असल्यामुळे ग्रहाचे फळ कमी होते." : "");

  const positionNoteEn = `In your chart, ${lord} is placed in the ${HOUSE_MEANINGS_EN[lordHouse] || `house ${lordHouse}`} in ${dignity} dignity (strength: ${score}%).`
    + (isRetro ? " This planet is retrograde — results may be delayed but intense." : "")
    + (isCombust ? " Being combust, the planet's results are weakened." : "");

  // Modify career/finance text based on strength
  const strengthPrefixMr = isStrong
    ? "दशानाथ बलवान असल्यामुळे या काळात उत्तम फळ मिळतील. "
    : isWeak
    ? "दशानाथ दुर्बल असल्यामुळे या काळात अडथळे येऊ शकतात. उपाय करणे आवश्यक. "
    : "दशानाथ मध्यम बलाचा असल्यामुळे मिश्र फळ मिळतील. ";

  const strengthPrefixEn = isStrong
    ? "Since the dasha lord is strong, this period will bring excellent results. "
    : isWeak
    ? "Since the dasha lord is weak, this period may bring challenges. Remedies are recommended. "
    : "Since the dasha lord has moderate strength, results will be mixed. ";

  // Kendra (1,4,7,10) or Trikona (1,5,9) placement is good; Dusthana (6,8,12) is challenging
  const inKendraTrikona = [1, 4, 5, 7, 9, 10].includes(lordHouse);
  const inDusthana = [6, 8, 12].includes(lordHouse);
  const placementMr = inKendraTrikona
    ? "केंद्र/त्रिकोण स्थानात असल्यामुळे शुभ फळ अधिक."
    : inDusthana
    ? "दुःस्थानात असल्यामुळे काही अडचणी येतील."
    : "";
  const placementEn = inKendraTrikona
    ? "Being in Kendra/Trikona, auspicious results are amplified."
    : inDusthana
    ? "Being in Dusthana, some difficulties are expected."
    : "";

  const start = currentDasha.startDate;
  const end = currentDasha.endDate;

  return {
    lordMr: PLANET_MR[lord] || lord,
    lordEn: lord,
    periodMr: `${start.toLocaleDateString("mr-IN")} — ${end.toLocaleDateString("mr-IN")} (${currentDasha.years.toFixed(1)} वर्षे)`,
    periodEn: `${start.toLocaleDateString("en-IN")} — ${end.toLocaleDateString("en-IN")} (${currentDasha.years.toFixed(1)} years)`,
    careerMr: `${positionNoteMr} ${strengthPrefixMr}${placementMr} ${baseInterp.careerMr}`,
    careerEn: `${positionNoteEn} ${strengthPrefixEn}${placementEn} ${baseInterp.careerEn}`,
    financeMr: `${strengthPrefixMr}${baseInterp.financeMr}`,
    financeEn: `${strengthPrefixEn}${baseInterp.financeEn}`,
    healthMr: baseInterp.healthMr,
    healthEn: baseInterp.healthEn,
    relationshipMr: baseInterp.relationshipMr,
    relationshipEn: baseInterp.relationshipEn,
    adviceMr: baseInterp.adviceMr,
    adviceEn: baseInterp.adviceEn,
  };
}

// ─── Gemstone & Remedy Recommendations ───────────────────────────────

export interface Remedy {
  categoryMr: string;
  categoryEn: string;
  items: { mr: string; en: string }[];
}

export function generateRemedies(kundli: KundliResult): Remedy[] {
  const strengths = analyzePlanetaryStrength(kundli);
  const doshas = detectDoshas(kundli);
  const planets = kundli.planets;
  const moon = planets.find((p) => p.id === "Moon")!;
  const saturn = planets.find((p) => p.id === "Saturn")!;
  const mars = planets.find((p) => p.id === "Mars")!;
  const rahu = planets.find((p) => p.id === "Rahu")!;
  const sun = planets.find((p) => p.id === "Sun")!;

  const weakPlanets = strengths.filter(
    (s) => s.strengthScore < 40 && s.id !== "Rahu" && s.id !== "Ketu"
  );
  const strongPlanets = strengths.filter((s) => s.strengthScore > 70);

  // ─── Planet → Deity mapping (per Navagraha Parampara) ───
  const planetDeity: Record<string, { deityMr: string; deityEn: string; poojaMr: string; poojaEn: string; day: string; dayMr: string }> = {
    Sun: { deityMr: "श्री सूर्यनारायण / श्री राम", deityEn: "Lord Surya / Lord Ram", poojaMr: "आदित्य हृदय स्तोत्र वाचा. रविवारी सूर्योदयाला अर्घ्य द्या. सूर्यनमस्कार करा.", poojaEn: "Recite Aditya Hridaya Stotra. Offer Arghya at sunrise on Sundays. Do Surya Namaskar.", day: "Sunday", dayMr: "रविवार" },
    Moon: { deityMr: "श्री शंकर (महादेव) / पार्वती माता", deityEn: "Lord Shiva / Goddess Parvati", poojaMr: "सोमवारी शिवमंदिरात रुद्राभिषेक करा. शिवलिंगावर दूध/पाणी अर्पण करा. ॐ नमः शिवाय जप करा.", poojaEn: "Perform Rudrabhishek at Shiv temple on Mondays. Offer milk/water on Shivlinga. Chant Om Namah Shivaya.", day: "Monday", dayMr: "सोमवार" },
    Mars: { deityMr: "श्री हनुमान / भगवान कार्तिकेय", deityEn: "Lord Hanuman / Lord Kartikeya", poojaMr: "मंगळवारी हनुमान मंदिरात जा. हनुमान चालीसा वाचा. लाल सिंदूर अर्पण करा.", poojaEn: "Visit Hanuman temple on Tuesdays. Recite Hanuman Chalisa. Offer red sindoor.", day: "Tuesday", dayMr: "मंगळवार" },
    Mercury: { deityMr: "श्री विष्णू / श्री कृष्ण", deityEn: "Lord Vishnu / Lord Krishna", poojaMr: "बुधवारी विष्णू सहस्रनाम वाचा. तुळशीची पूजा करा. हिरव्या वस्तू दान करा.", poojaEn: "Recite Vishnu Sahasranama on Wednesdays. Worship Tulsi plant. Donate green items.", day: "Wednesday", dayMr: "बुधवार" },
    Jupiter: { deityMr: "श्री दत्तात्रेय / श्री बृहस्पती", deityEn: "Lord Dattatreya / Lord Brihaspati", poojaMr: "गुरुवारी दत्त मंदिरात जा. गुरुचरित्र वाचा. केळी/हळकुंड दान करा. पिवळे कपडे वापरा.", poojaEn: "Visit Datta temple on Thursdays. Read Gurucharitra. Donate bananas/turmeric. Wear yellow.", day: "Thursday", dayMr: "गुरुवार" },
    Venus: { deityMr: "श्री लक्ष्मी / श्री महालक्ष्मी", deityEn: "Goddess Lakshmi / Mahalakshmi", poojaMr: "शुक्रवारी लक्ष्मी पूजा करा. श्री सूक्त वाचा. पांढरे फूल अर्पण करा. महिलांना दान करा.", poojaEn: "Perform Lakshmi Pooja on Fridays. Recite Shri Sukta. Offer white flowers. Donate to women.", day: "Friday", dayMr: "शुक्रवार" },
    Saturn: { deityMr: "श्री शनिदेव / श्री हनुमान / श्री शंकर", deityEn: "Lord Shani / Lord Hanuman / Lord Shiva", poojaMr: "शनिवारी शनि मंदिरात तेल चढवा. हनुमान चालीसा वाचा. शिव मंदिरात रुद्राभिषेक करा. काळे तीळ दान करा.", poojaEn: "Offer oil at Shani temple on Saturdays. Recite Hanuman Chalisa. Perform Rudrabhishek at Shiv temple. Donate black sesame.", day: "Saturday", dayMr: "शनिवार" },
    Rahu: { deityMr: "श्री दुर्गा माता / काळभैरव", deityEn: "Goddess Durga / Kaal Bhairav", poojaMr: "दुर्गा सप्तशती वाचा. नवरात्रीत उपवास करा. नारळ दान करा. राहु मंत्र जप करा.", poojaEn: "Recite Durga Saptashati. Fast during Navratri. Donate coconut. Chant Rahu mantra.", day: "Saturday", dayMr: "शनिवार" },
    Ketu: { deityMr: "श्री गणपती / भगवान चित्रगुप्त", deityEn: "Lord Ganesha / Lord Chitragupta", poojaMr: "गणपती अथर्वशीर्ष वाचा. संकष्टी चतुर्थी व्रत करा. दुर्वा अर्पण करा. कुत्र्याला अन्न द्या.", poojaEn: "Recite Ganapati Atharvashirsha. Observe Sankashti Chaturthi vrat. Offer Durva grass. Feed dogs.", day: "Tuesday", dayMr: "मंगळवार" },
  };

  // ─── Gemstone map (per Ratna Shastra) ───
  const gemstoneMap: Record<string, { mr: string; en: string }> = {
    Sun: { mr: "माणिक (Ruby) — सोन्याच्या अंगठीत, अनामिकेत, रविवारी सूर्योदयाला धारण करा", en: "Ruby — in gold ring, ring finger, wear on Sunday at sunrise" },
    Moon: { mr: "मोती (Pearl) — चांदीच्या अंगठीत, करंगळीत, सोमवारी धारण करा", en: "Pearl — in silver ring, little finger, wear on Monday" },
    Mars: { mr: "लाल प्रवाळ (Red Coral) — सोन्या/तांब्यात, अनामिकेत, मंगळवारी धारण करा", en: "Red Coral — in gold/copper, ring finger, wear on Tuesday" },
    Mercury: { mr: "पन्ना (Emerald) — सोन्यात, करंगळीत, बुधवारी धारण करा", en: "Emerald — in gold, little finger, wear on Wednesday" },
    Jupiter: { mr: "पुखराज (Yellow Sapphire) — सोन्यात, तर्जनीत, गुरुवारी धारण करा", en: "Yellow Sapphire — in gold, index finger, wear on Thursday" },
    Venus: { mr: "हिरा/ओपल (Diamond/Opal) — प्लॅटिनम/चांदीत, अनामिकेत, शुक्रवारी धारण करा", en: "Diamond/Opal — in platinum/silver, ring finger, wear on Friday" },
    Saturn: { mr: "निळा नीलम (Blue Sapphire) — लोह/चांदीत, मध्यमात, शनिवारी (अनुभवी ज्योतिषाच्या सल्ल्याने!)", en: "Blue Sapphire — in iron/silver, middle finger, Saturday (only with expert astrologer advice!)" },
  };

  // ─── Beej Mantra map (per Navagraha Stotra) ───
  const mantras: Record<string, { mr: string; en: string }> = {
    Sun: { mr: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः — रोज ७ वेळा, सूर्योदयाला", en: "Om Hraam Hreem Hraum Sah Suryaya Namah — 7 times daily at sunrise" },
    Moon: { mr: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः — रोज ११ वेळा, रात्री", en: "Om Shraam Shreem Shraum Sah Chandraya Namah — 11 times daily at night" },
    Mars: { mr: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः — रोज ७ वेळा", en: "Om Kraam Kreem Kraum Sah Bhaumaya Namah — 7 times daily" },
    Mercury: { mr: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः — रोज ९ वेळा", en: "Om Braam Breem Braum Sah Budhaya Namah — 9 times daily" },
    Jupiter: { mr: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः — रोज ९ वेळा", en: "Om Graam Greem Graum Sah Gurave Namah — 9 times daily" },
    Venus: { mr: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः — रोज ९ वेळा", en: "Om Draam Dreem Draum Sah Shukraya Namah — 9 times daily" },
    Saturn: { mr: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः — रोज ११ वेळा", en: "Om Praam Preem Praum Sah Shanaischaraya Namah — 11 times daily" },
    Rahu: { mr: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः — रोज १८ वेळा", en: "Om Bhraam Bhreem Bhraum Sah Rahave Namah — 18 times daily" },
    Ketu: { mr: "ॐ स्रां स्रीं स्रौं सः केतवे नमः — रोज ७ वेळा", en: "Om Sraam Sreem Sraum Sah Ketave Namah — 7 times daily" },
  };

  // ─── Daan (donation) map per planet (per Lal Kitab + Parashara) ───
  const daanMap: Record<string, { mr: string; en: string }> = {
    Sun: { mr: "गहू, गूळ, तांबे, लाल कपडा रविवारी दान करा", en: "Donate wheat, jaggery, copper, red cloth on Sundays" },
    Moon: { mr: "तांदूळ, दूध, चांदी, पांढरे कपडे सोमवारी दान करा", en: "Donate rice, milk, silver, white cloth on Mondays" },
    Mars: { mr: "लाल मसूर डाळ, गूळ, लाल कपडा मंगळवारी दान करा", en: "Donate red lentils, jaggery, red cloth on Tuesdays" },
    Mercury: { mr: "मूग डाळ, हिरव्या भाज्या, हिरवा कपडा बुधवारी दान करा", en: "Donate moong dal, green vegetables, green cloth on Wednesdays" },
    Jupiter: { mr: "हळद, केळी, चणे डाळ, पिवळा कपडा गुरुवारी दान करा", en: "Donate turmeric, bananas, chana dal, yellow cloth on Thursdays" },
    Venus: { mr: "तांदूळ, साखर, कापूर, पांढरे कपडे शुक्रवारी दान करा", en: "Donate rice, sugar, camphor, white cloth on Fridays" },
    Saturn: { mr: "काळे तीळ, सरसों तेल, लोखंड, काळा कपडा शनिवारी दान करा", en: "Donate black sesame, mustard oil, iron, black cloth on Saturdays" },
    Rahu: { mr: "नारळ, काळे उडीद, कंबळ शनिवारी/बुधवारी दान करा", en: "Donate coconut, black urad, blanket on Saturday/Wednesday" },
    Ketu: { mr: "काळे-पांढरे तीळ, कंबळ, कुत्र्याला अन्न मंगळवारी दान करा", en: "Donate sesame, blanket, feed dogs on Tuesdays" },
  };

  const remedies: Remedy[] = [];

  // ── 1. DOSHA-SPECIFIC REMEDIES (highest priority) ──
  const activeDoshas = doshas.filter((d) => d.present);
  if (activeDoshas.length > 0) {
    const doshaItems: { mr: string; en: string }[] = [];

    for (const dosha of activeDoshas) {
      if (dosha.nameEn.includes("Sade Sati")) {
        // Sade Sati → Shiv pooja is PRIMARY remedy
        doshaItems.push(
          { mr: "साडेसाती उपाय: शंकर भगवानाची पूजा करा. सोमवारी शिव मंदिरात रुद्राभिषेक करा.", en: "Sade Sati remedy: Worship Lord Shiva. Perform Rudrabhishek at Shiv temple on Mondays." },
          { mr: "महामृत्युंजय मंत्र — 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्' — रोज १०८ वेळा जप करा.", en: "Chant Mahamrityunjay Mantra — 'Om Tryambakam Yajamahe Sugandhim Pushti Vardhanam' — 108 times daily." },
          { mr: "शनिवारी हनुमान मंदिरात तेल अर्पण करा. शनि स्तोत्र वाचा.", en: "Offer oil at Hanuman temple on Saturdays. Recite Shani Stotra." },
          { mr: "पिंपळाच्या झाडाला शनिवारी पाणी घाला. काळे तीळ दान करा.", en: "Water Peepal tree on Saturdays. Donate black sesame seeds." },
        );
      }
      if (dosha.nameEn.includes("Mangal")) {
        doshaItems.push(
          { mr: "मंगळ दोष उपाय: हनुमान चालीसा रोज वाचा. मंगळवारी हनुमान मंदिरात जा.", en: "Mangal Dosha remedy: Recite Hanuman Chalisa daily. Visit Hanuman temple on Tuesdays." },
          { mr: "मंगळनाथ मंदिर (उज्जैन) येथे मंगळ ग्रह शांती पूजा करा.", en: "Perform Mangal Graha Shanti Pooja at Mangalnath Temple (Ujjain)." },
          { mr: "मंगळवारी लाल सिंदूर हनुमानाला अर्पण करा. लाल मसूर डाळ दान करा.", en: "Offer red sindoor to Hanuman on Tuesdays. Donate red masoor dal." },
        );
      }
      if (dosha.nameEn.includes("Kaal Sarp")) {
        doshaItems.push(
          { mr: "काल सर्प दोष उपाय: त्र्यंबकेश्वर (नाशिक) किंवा काळहस्ती (आंध्रप्रदेश) मंदिरात काल सर्प शांती पूजा करा.", en: "Kaal Sarp remedy: Perform Kaal Sarp Shanti Pooja at Trimbakeshwar (Nashik) or Kalahasti (Andhra Pradesh)." },
          { mr: "महामृत्युंजय मंत्र जप करा. रुद्राभिषेक करा. नाग पंचमीला नागदेवतेची पूजा करा.", en: "Chant Mahamrityunjay Mantra. Perform Rudrabhishek. Worship Nag Devata on Nag Panchami." },
          { mr: "चांदीचा नाग शिवलिंगावर अर्पण करा.", en: "Offer silver snake on Shivlinga." },
        );
      }
      if (dosha.nameEn.includes("Pitra")) {
        doshaItems.push(
          { mr: "पितृ दोष उपाय: पितृपक्षात (श्राद्ध) विधीवत पिंडदान करा. गया/प्रयाग तीर्थावर जा.", en: "Pitra Dosha remedy: Perform Pind Daan during Pitru Paksha. Visit Gaya/Prayag tirtha." },
          { mr: "रविवारी सूर्यदेवाला अर्घ्य द्या. पिंपळाच्या झाडाखाली दिवा लावा.", en: "Offer Arghya to Sun on Sundays. Light lamp under Peepal tree." },
          { mr: "ब्राह्मणांना भोजन द्या. गायीला चारा द्या.", en: "Feed Brahmins. Feed cows with green grass." },
        );
      }
    }

    if (doshaItems.length > 0) {
      remedies.push({
        categoryMr: "दोष निवारण उपाय (तुमच्या कुंडलीतील सक्रिय दोषांसाठी)",
        categoryEn: "Dosha Remedies (for active doshas in your chart)",
        items: doshaItems,
      });
    }
  }

  // ── 2. WEAK PLANET DEITY POOJA (based on which planets are weak + their house) ──
  if (weakPlanets.length > 0) {
    const poojaItems: { mr: string; en: string }[] = [];
    for (const wp of weakPlanets) {
      const deity = planetDeity[wp.id];
      if (deity) {
        const houseNote = wp.house === 7 ? " (विवाह/भागीदारी क्षेत्रात अडथळे)" :
          wp.house === 10 ? " (करिअर/व्यवसायात अडथळे)" :
          wp.house === 2 ? " (आर्थिक अडचणी)" :
          wp.house === 5 ? " (शिक्षण/संतती क्षेत्रात काळजी)" :
          wp.house === 12 ? " (खर्च/मानसिक तणाव)" :
          wp.house === 8 ? " (अचानक संकटे/आरोग्य)" :
          wp.house === 1 ? " (आत्मविश्वास/आरोग्य)" :
          "";
        const houseNoteEn = wp.house === 7 ? " (obstacles in marriage/partnership)" :
          wp.house === 10 ? " (obstacles in career)" :
          wp.house === 2 ? " (financial difficulties)" :
          wp.house === 5 ? " (education/children concerns)" :
          wp.house === 12 ? " (expenses/mental stress)" :
          wp.house === 8 ? " (sudden crises/health)" :
          wp.house === 1 ? " (confidence/health)" :
          "";
        poojaItems.push({
          mr: `${wp.nameMr} दुर्बल (भाव ${wp.house}${houseNote}) — ${deity.deityMr} पूजा करा. ${deity.poojaMr}`,
          en: `${wp.nameEn} weak (house ${wp.house}${houseNoteEn}) — Worship ${deity.deityEn}. ${deity.poojaEn}`,
        });
      }
    }
    // Also add Rahu/Ketu if they are in dusthana or with Moon
    const rahuStrength = strengths.find((s) => s.id === "Rahu");
    const ketuStrength = strengths.find((s) => s.id === "Ketu");
    if (rahuStrength && [1, 7, 8].includes(rahu.house)) {
      const deity = planetDeity["Rahu"];
      poojaItems.push({ mr: `राहु ${rahu.house}व्या भावात — ${deity.deityMr} पूजा करा. ${deity.poojaMr}`, en: `Rahu in house ${rahu.house} — Worship ${deity.deityEn}. ${deity.poojaEn}` });
    }

    if (poojaItems.length > 0) {
      remedies.push({
        categoryMr: "देवता पूजा (तुमच्या दुर्बल ग्रहांसाठी)",
        categoryEn: "Deity Worship (for your weak planets)",
        items: poojaItems,
      });
    }
  }

  // ── 3. GEMSTONES (only for weak planets, with caution notes) ──
  if (weakPlanets.length > 0) {
    const gemItems = weakPlanets
      .filter((p) => gemstoneMap[p.id])
      .map((p) => ({
        mr: `${p.nameMr} (${p.dignityMr}, बल ${p.strengthScore}%) — ${gemstoneMap[p.id].mr}`,
        en: `${p.nameEn} (${p.dignityEn}, strength ${p.strengthScore}%) — ${gemstoneMap[p.id].en}`,
      }));
    if (gemItems.length > 0) {
      remedies.push({
        categoryMr: "रत्न धारण (अनुभवी ज्योतिषाच्या सल्ल्याने)",
        categoryEn: "Gemstone Recommendations (consult expert astrologer)",
        items: gemItems,
      });
    }
  }

  // ── 4. MANTRA JAP ──
  if (weakPlanets.length > 0) {
    remedies.push({
      categoryMr: "मंत्र जप (दुर्बल ग्रहांसाठी बीज मंत्र)",
      categoryEn: "Mantra Chanting (Beej Mantras for weak planets)",
      items: weakPlanets
        .filter((p) => mantras[p.id])
        .map((p) => ({
          mr: `${p.nameMr} — ${mantras[p.id].mr}`,
          en: `${p.nameEn} — ${mantras[p.id].en}`,
        })),
    });
  }

  // ── 5. DAAN (Donation) — per weak planets ──
  if (weakPlanets.length > 0) {
    remedies.push({
      categoryMr: "दान (दुर्बल ग्रहांसाठी)",
      categoryEn: "Donations (for weak planets)",
      items: weakPlanets
        .filter((p) => daanMap[p.id])
        .map((p) => ({
          mr: `${p.nameMr} — ${daanMap[p.id].mr}`,
          en: `${p.nameEn} — ${daanMap[p.id].en}`,
        })),
    });
  }

  // ── 6. CURRENT DASHA LORD specific remedy ──
  const nowIST2 = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const now = new Date(nowIST2.getUTCFullYear(), nowIST2.getUTCMonth(), nowIST2.getUTCDate());
  const currentDasha = kundli.dashas.find((d) => now >= d.startDate && now <= d.endDate);
  if (currentDasha) {
    const dashaLord = currentDasha.lord;
    const deity = planetDeity[dashaLord];
    const dashaStrength = strengths.find((s) => s.id === dashaLord);
    if (deity && dashaStrength) {
      const dashaItems: { mr: string; en: string }[] = [];
      dashaItems.push({
        mr: `सध्या ${dashaStrength.nameMr} महादशा चालू आहे (बल ${dashaStrength.strengthScore}%). ${deity.dayMr}ी ${deity.deityMr} पूजा विशेष फलदायी.`,
        en: `Currently ${dashaLord} Mahadasha is running (strength ${dashaStrength.strengthScore}%). Worship ${deity.deityEn} on ${deity.day}s for best results.`,
      });
      dashaItems.push({ mr: deity.poojaMr, en: deity.poojaEn });
      if (mantras[dashaLord]) {
        dashaItems.push({ mr: `दशानाथ मंत्र: ${mantras[dashaLord].mr}`, en: `Dasha lord mantra: ${mantras[dashaLord].en}` });
      }
      if (daanMap[dashaLord]) {
        dashaItems.push({ mr: `दशानाथ दान: ${daanMap[dashaLord].mr}`, en: `Dasha lord donation: ${daanMap[dashaLord].en}` });
      }
      remedies.push({
        categoryMr: `चालू दशा उपाय (${dashaStrength.nameMr} महादशा)`,
        categoryEn: `Current Dasha Remedies (${dashaLord} Mahadasha)`,
        items: dashaItems,
      });
    }
  }

  // ── 7. STRONG PLANETS (what to leverage) ──
  if (strongPlanets.length > 0) {
    remedies.push({
      categoryMr: "बलवान ग्रह — या क्षेत्रांचा लाभ घ्या",
      categoryEn: "Strong Planets — Leverage these areas",
      items: strongPlanets
        .filter((p) => planetDeity[p.id])
        .map((p) => {
          const deity = planetDeity[p.id];
          return {
            mr: `${p.nameMr} बलवान (${p.dignityMr}, बल ${p.strengthScore}%) — ${deity.dayMr}ी ${deity.deityMr} पूजा करा. हा ग्रह तुमच्यासाठी अनुकूल.`,
            en: `${p.nameEn} strong (${p.dignityEn}, ${p.strengthScore}%) — Worship ${deity.deityEn} on ${deity.day}s. This planet favors you.`,
          };
        }),
    });
  }

  return remedies;
}
