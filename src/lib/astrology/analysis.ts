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
  Moon: [],
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
  // Mercury & Venus have smaller combustion ranges when retrograde (per Surya Siddhanta)
  const combustDegrees: Record<string, number> = {
    Moon: 12, Mars: 17, Mercury: planet.isRetrograde ? 12 : 14,
    Jupiter: 11, Venus: planet.isRetrograde ? 8 : 10, Saturn: 15,
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
  const sunDebilitatedInNine = sun.rashiIndex === DEBILITATION["Sun"] && sunInNine;
  const isPitrDoshaStrong = sunWithRahu || (sunInNine && rahuInNine);
  const isPitrDoshaMild = !isPitrDoshaStrong && sunDebilitatedInNine;
  const isPitrDosha = isPitrDoshaStrong || isPitrDoshaMild;

  doshas.push({
    nameMr: "पितृ दोष",
    nameEn: "Pitra Dosha",
    present: isPitrDosha,
    severity: isPitrDoshaStrong ? "medium" : isPitrDoshaMild ? "low" : "none",
    descriptionMr: isPitrDoshaStrong
      ? "सूर्य-राहू युती/९व्या भावात प्रभाव. पितृकार्यात अडथळे, पिढ्यांचे अपूर्ण कर्म. संतती/करिअरमध्ये विलंब."
      : isPitrDoshaMild
      ? "सूर्य नीच स्थितीत ९व्या भावात (धर्म/पिता स्थान). पितृ संबंधात काळजी आवश्यक. पित्याच्या आरोग्याकडे लक्ष द्या. पैतृक संपत्तीबाबत विलंब शक्य."
      : "पितृ दोष नाही.",
    descriptionEn: isPitrDoshaStrong
      ? "Sun-Rahu conjunction or influence in 9th house. Obstacles in ancestral matters, generational karma. Delays in progeny/career."
      : isPitrDoshaMild
      ? "Sun debilitated in 9th house (house of father/dharma). Mild Pitru Dosha — care needed regarding father's health and ancestral matters. Possible delays in paternal blessings."
      : "No Pitra Dosha present.",
    remedyMr: isPitrDoshaStrong
      ? "पितृ तर्पण करा. श्राद्ध विधी नियमित करा. गया/प्रयागमध्ये पिंडदान करा. रविवारी सूर्यदेवाला अर्घ्य द्या."
      : isPitrDoshaMild
      ? "रविवारी सूर्योदयाला सूर्याला अर्घ्य द्या. आदित्य हृदय स्तोत्र वाचा. पित्याची सेवा करा. लाल वस्तू दान करा."
      : "उपाय आवश्यक नाही.",
    remedyEn: isPitrDoshaStrong
      ? "Perform Pitru Tarpan. Observe regular Shraddha rituals. Offer Pind Daan at Gaya/Prayag. Offer Arghya to Sun on Sundays."
      : isPitrDoshaMild
      ? "Offer Arghya to Sun at sunrise on Sundays. Recite Aditya Hrudaya Stotra. Serve and respect your father. Donate red items."
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
    house: 1, titleMr: "तनु भाव — व्यक्तिमत्व, आरोग्य, दृष्टिकोन", titleEn: "Tanu Bhava — Personality, Health, Outlook", icon: "🧍",
    goodMr: "लग्नभाव बलवान — आत्मविश्वास, आकर्षक व्यक्तिमत्व, नेतृत्वगुण यांमुळे लोक सहज आकर्षित होतात. शारीरिक आरोग्य उत्तम व दीर्घायुष्याची शक्यता आहे. स्वतःच्या गुणांवर विश्वास ठेवून कार्य केल्यास यश निश्चित. जन्मकुंडलीतील लग्नेश मजबूत असल्याने शरीर-तेज, ओज व कीर्ती वाढेल. चेहऱ्यावर नैसर्गिक तेजस्विता व प्रभाव दिसेल.",
    goodEn: "A strong 1st house gives confidence, magnetic personality and leadership that draws people naturally. Physical health is robust and longevity favourable. Acting from conviction brings guaranteed success. A strong Lagna lord adds radiance, vitality and fame. A natural glow and impactful presence are visible.",
    badMr: "लग्नभाव कमजोर असल्याने आरोग्याकडे विशेष लक्ष द्यावे — डोके, डोळे व मज्जासंस्था यांच्या विकारांची शक्यता. आत्मविश्वासाची कमतरता व आत्मशंकेची भावना जाणवू शकते. शरीरात थकवा, झोपेच्या समस्या, पचनविकार शक्य आहेत. सूर्यनमस्कार, प्राणायाम व नियमित ध्यान अत्यंत आवश्यक. लग्नेशाचे रत्न धारण करून शिव उपासना करा.",
    badEn: "A weak 1st house calls for extra care of health — head, eyes and nervous system may be vulnerable. Self-doubt and fatigue can surface. Sleep and digestive issues possible. Daily Surya Namaskar, pranayama and meditation are essential. Wear the gem of the Lagna lord and worship Shiva regularly.",
    emptyMr: "लग्नभाव रिक्त असल्यास व्यक्तिमत्व पूर्णतः लग्नेशाच्या बलावर अवलंबून. सामान्यपणे संतुलित आरोग्य व मध्यम आत्मविश्वास. लग्नेशाच्या भावानुसार जीवनाची दिशा ठरते — तो भाव पाहून सविस्तर विश्लेषण करा.",
    emptyEn: "With 1st house empty, personality depends wholly on the strength of its lord. Balanced health and moderate confidence generally. Life's direction is shaped by where the Lagna lord sits — study that house for deeper insight.",
  },
  {
    house: 2, titleMr: "धन भाव — संपत्ती, कुटुंब, वाणी, खाद्य", titleEn: "Dhana Bhava — Wealth, Family, Speech, Food", icon: "💰",
    goodMr: "धनभाव मजबूत असल्याने आर्थिक स्थिरता, बचतीची सवय व संपत्तीची सतत वाढ होते. वाणी मधुर व प्रभावी असते — जेणेकरून वक्तृत्व, शिक्षण किंवा विक्री क्षेत्रात यश. कुटुंबात सुसंवाद व ज्येष्ठांच्या आशीर्वादाने भरपूर सुख. स्थावर-जंगम मालमत्ता, दागदागिने व वाहने यांचा संग्रह होईल. गुरुवारी लक्ष्मी पूजन व श्रीसूक्त पठण केल्याने धनलाभ वाढतो.",
    goodEn: "A strong 2nd house gives financial stability, a savings mindset and steady wealth growth. Speech is sweet and influential — helpful in oratory, teaching or sales. Family harmony and elders' blessings bring abundance. Accumulation of property, jewellery and vehicles follows. Thursday Lakshmi pujan and Shri Sukta paath amplify prosperity.",
    badMr: "धनभाव दुर्बल झाल्यास आर्थिक व्यवस्थापन आव्हानात्मक बनते — अनावश्यक खर्च व कर्जात अडकण्याची शक्यता. कठोर वाणीमुळे कुटुंब व मित्रांशी संबंध ताणले जाऊ शकतात. तोंडाचे आजार, दातांच्या समस्या, डोळ्यांची काळजी घ्या. श्री सूक्त व कनकधारा स्तोत्र दररोज पठण करा. घरात तुळशी, श्रीयंत्र व कुबेर यंत्र स्थापन करा.",
    badEn: "A weak 2nd house makes finance challenging — unnecessary expenses and debt risk. Harsh speech can strain family and friendships. Watch for mouth, teeth and eye issues. Recite Shri Sukta and Kanakadhara Stotra daily. Install Tulsi, Shri Yantra and Kubera Yantra at home.",
    emptyMr: "धनभाव रिक्त असल्यास आर्थिक स्थिती मध्यम व धनेशाच्या स्थानावर अवलंबून. स्वकर्तृत्वाने संपत्ती वाढवावी लागेल. शुक्रवारी लक्ष्मी पूजन व दानधर्माने धनलाभ.",
    emptyEn: "Empty 2nd house — finances are moderate and depend on the 2nd lord's placement. Wealth must be built by personal effort. Friday Lakshmi pujan and charity improve income.",
  },
  {
    house: 3, titleMr: "पराक्रम भाव — धैर्य, भावंडे, संवाद, लेखन", titleEn: "Parakrama Bhava — Courage, Siblings, Communication", icon: "💪",
    goodMr: "पराक्रम भाव बलवान — आत्मनिर्भरता, धाडस व उपक्रमशीलता यामुळे जीवनातील संकटांवर मात करता येते. लेखन, पत्रकारिता, मीडिया, मार्केटिंग, विक्री व प्रकाशन क्षेत्रात उत्तम यश मिळते. भावंडांशी स्नेह व सहकार्य — विशेषतः लहान भावंडांकडून पाठिंबा. छोटे प्रवास व तीर्थाटने लाभदायक. हनुमान चालीसा व विष्णू सहस्रनाम मंगळवारी पठण केल्याने धैर्य वाढते.",
    goodEn: "A strong 3rd house gives self-reliance, courage and initiative that overcome life's challenges. Excellent success in writing, journalism, media, marketing, sales and publishing. Close bonds with siblings — especially support from younger ones. Short travels and pilgrimages prove fruitful. Reciting Hanuman Chalisa and Vishnu Sahasranama on Tuesdays builds courage.",
    badMr: "तृतीय भाव दुर्बल — निर्णय घेण्यात घाई व अतिआत्मविश्वास टाळा. भावंडांशी मतभेद, सहकार्याचा अभाव व संवादात अडथळे येऊ शकतात. कान, घसा व श्वसनसंस्थेच्या समस्या सावध. हनुमान चालीसा मंगळवारी व शनिवारी ११ वेळा पठण करा. भावंडांना मदत व दानधर्म केल्याने संबंध सुधारतात.",
    badEn: "A weak 3rd house — avoid rushed decisions and over-confidence. Sibling disputes, lack of support and communication obstacles possible. Beware of ear, throat and respiratory issues. Recite Hanuman Chalisa 11 times on Tuesdays and Saturdays. Helping siblings and charity improves relations.",
    emptyMr: "तृतीय भाव रिक्त असल्यास सामान्य पराक्रम. भावंडांशी तटस्थ संबंध. संवाद कौशल्य हेतुपूर्वक विकसित करा. बुधवारी गणपती पूजनाने बुद्धी व वाणी कौशल्य वाढते.",
    emptyEn: "Empty 3rd house — moderate courage and neutral sibling ties. Develop communication skills deliberately. Wednesday Ganesha worship sharpens intellect and speech.",
  },
  {
    house: 4, titleMr: "सुख भाव — माता, घर, वाहन, शिक्षण, मानसिक शांती", titleEn: "Sukha Bhava — Mother, Home, Vehicle, Education, Peace", icon: "🏠",
    goodMr: "सुख भाव मजबूत — मातेचे अपार प्रेम व मानसिक समाधान जीवनाचा आधार बनते. स्वतःचे घर, भव्य वाहन, शेतजमीन व भौतिक सुखसोयींची प्राप्ती होते. शैक्षणिक क्षेत्रात यश, कुटुंबाचा आधार व घरात लक्ष्मीचा वास दिसून येतो. सोमवारी शिवाभिषेक व महामृत्युंजय मंत्र पठण करून सुख स्थिर ठेवा. तुळशीपूजा व शंखध्वनी घरातील नकारात्मक ऊर्जा दूर करते.",
    goodEn: "A strong 4th house gives boundless mother's love and inner contentment as life's foundation. Attainment of own home, fine vehicle, ancestral land and material comforts. Academic success, family backing and the grace of Lakshmi at home. Monday Shiva abhishek and Mahamrityunjaya chanting maintain this happiness. Tulsi worship and blowing a conch clear negative energy.",
    badMr: "चतुर्थ भाव दुर्बल — घरगुती तणाव, मानसिक अस्वस्थता व माता-पित्याच्या आरोग्याच्या काळजी शक्य. मालमत्ता, घर-वाहन संबंधित व्यवहारात सावधगिरी बाळगा — कायदेशीर वाद टाळा. छातीचे आजार, फुफ्फुसे, हृदयाची काळजी घ्या. मातेची सेवा, गौ-सेवा व दानधर्म हे अत्यंत प्रभावी उपाय. सोमवारी शिव मंदिरात कच्चे दूध अर्पण करा.",
    badEn: "A weak 4th house — domestic stress, emotional unease and concern for mother's/parents' health. Be cautious in property, vehicle and real-estate dealings — avoid legal disputes. Guard chest, lungs and heart. Serving the mother, cow-seva and charity are highly effective. Offer raw milk on a Shiva Lingam on Mondays.",
    emptyMr: "चतुर्थ भाव रिक्त — सुख मध्यम, स्वकर्तृत्वाने सुख-सोयी मिळवाव्या लागतील. चतुर्थेशाच्या स्थानावर विशेष अवलंबून. घरात नित्य भजन व ध्यान मानसिक शांतीस पोषक.",
    emptyEn: "Empty 4th house — moderate comfort, to be earned through personal effort. Depends heavily on the 4th lord's placement. Daily bhajan and meditation at home nurture mental peace.",
  },
  {
    house: 5, titleMr: "पुत्र भाव — बुद्धी, संतती, प्रेम, पूर्वपुण्य, शिक्षण", titleEn: "Putra Bhava — Intellect, Children, Romance, Purva Punya", icon: "🎓",
    goodMr: "पंचम भाव मजबूत — तीक्ष्ण बुद्धिमत्ता, विद्वत्ता व स्मरणशक्ती यांमुळे शैक्षणिक उत्कृष्टता. स्पर्धा परीक्षा, संशोधन, लेखन, शिक्षण क्षेत्रात नाव कमावता येईल. प्रेमसंबंध सुखी, संतती भाग्यवान व कुलाला शोभादायक. शेअर बाजार, सट्टा, गुंतवणूक यातून मोठा लाभ. पूर्वजन्माच्या पुण्यामुळे मंत्रसिद्धी, उपासना फळते. गुरुवारी विष्णू सहस्रनाम व संतान गोपाल मंत्र पठण करा.",
    goodEn: "A strong 5th house gives sharp intellect, scholarship and memory for academic excellence. Competitive exams, research, writing and teaching bring renown. Happy romantic life, fortunate children who honour the lineage. Large gains from stocks, speculation and investments. Purva-punya ripens — mantras and sadhana bear fruit. Thursday Vishnu Sahasranama and Santan Gopal mantra deepen this blessing.",
    badMr: "पंचम भाव दुर्बल — शिक्षणात अडथळे, एकाग्रता कमी व स्मरणशक्तीची समस्या. प्रेमसंबंधात निराशा, विवाहपूर्व संबंधात सावध राहा. संततीप्राप्तीत विलंब किंवा संतती संबंधी चिंता शक्य. शेअर बाजार व सट्टा सर्वथा टाळा — मोठे नुकसान संभवते. संतान गोपाल मंत्र, कृष्ण उपासना व गरीब मुलांना शिक्षण दान हे प्रमुख उपाय.",
    badEn: "A weak 5th house — obstacles in studies, poor focus and memory issues. Disappointment in love; caution in pre-marital ties. Possible delay or worry about children. Avoid stock-market speculation — major losses likely. Santan Gopal mantra, Krishna worship and sponsoring education of poor children are prime remedies.",
    emptyMr: "पंचम भाव रिक्त — बुद्धी व शिक्षण सामान्य, कठोर मेहनतीने यश मिळेल. संतती सुख मध्यम. पंचमेशाच्या स्थानावर अवलंबून. गुरुवारी गुरु उपासना व विद्यार्थ्यांना पुस्तके दान केल्याने पूर्वपुण्य वाढते.",
    emptyEn: "Empty 5th house — average intellect and studies, success through diligence. Children bring moderate joy; depends on 5th lord. Thursday Guru worship and donating books to students build purva-punya.",
  },
  {
    house: 6, titleMr: "रिपु भाव — शत्रू, रोग, कर्ज, सेवा, स्पर्धा", titleEn: "Ripu Bhava — Enemies, Disease, Debt, Service, Competition", icon: "⚔️",
    goodMr: "षष्ठ भाव मजबूत — शत्रूंवर विजय, स्पर्धा परीक्षांत उज्ज्वल यश व कायदेशीर बाबींत विजय. रोग लवकर बरे होतात, कर्जमुक्ती होते व आर्थिक स्थैर्य लाभते. सेवा क्षेत्र, वैद्यकीय, सैन्य, कायदा, पोलीस व प्रशासन यांत उत्तम करिअर. मातुल (मामा-मावशी) यांचा पाठिंबा व त्यांच्यापासून लाभ. हनुमान बाहुक व बजरंग बाण मंगळवार-शनिवारी पठण करा.",
    goodEn: "A strong 6th house gives victory over enemies, brilliant success in competitive exams and favourable legal outcomes. Illnesses heal quickly, debts clear and finances stabilise. Outstanding career in service sector, medicine, military, law, police and administration. Support and benefit from maternal uncles/aunts. Recite Hanuman Bahuk and Bajrang Baan on Tuesdays and Saturdays.",
    badMr: "षष्ठ भाव दुर्बल — दीर्घकालीन आजार, शत्रूंचा त्रास, कायदेशीर खटले व कर्जवाढ संभवते. पोट, आतडे, मूत्रपिंड यांच्या विकारांची काळजी घ्या. नोकरी-सहकाऱ्यांशी संघर्ष व चोरीचा धोका. महामृत्युंजय मंत्र १०८ वेळा × ४० दिवस व आयुष्यमान कोश पाठ करा. आजारी व गरीबांची सेवा, अन्नदान हे शक्तिशाली उपाय.",
    badEn: "A weak 6th house — chronic illness, enemy trouble, litigation and rising debts possible. Guard stomach, intestines and kidneys. Workplace conflicts and risk of theft. Chant Mahamrityunjaya 108 × 40 days and recite Ayushyamana Kosha. Serving the sick and poor with food donation are potent remedies.",
    emptyMr: "षष्ठ भाव रिक्त असणे सामान्यपणे शुभ — शत्रू कमी, आरोग्य सामान्य व स्पर्धेत मध्यम यश. कर्ज कमी राहील. पण षष्ठेशाच्या स्थानावर अंतिम फळ अवलंबून.",
    emptyEn: "An empty 6th house is usually auspicious — few enemies, moderate health and middling competitive success. Debts remain low. Final outcome depends on the 6th lord's position.",
  },
  {
    house: 7, titleMr: "कलत्र भाव — विवाह, जोडीदार, भागीदारी, सार्वजनिक संबंध", titleEn: "Kalatra Bhava — Marriage, Spouse, Partnership, Public Relations", icon: "💑",
    goodMr: "सप्तम भाव मजबूत — सुखी वैवाहिक जीवन, समर्पित व सौंदर्यवान जोडीदार प्राप्त होईल. व्यावसायिक भागीदारी अत्यंत लाभदायक — संयुक्त व्यवसाय भरभराटेस येतील. सार्वजनिक संबंध, राजकारण, मुत्सद्देगिरी व परदेश व्यापारात यश. जोडीदाराच्या कुटुंबाकडून आर्थिक व सामाजिक लाभ. शुक्रवारी महालक्ष्मी पूजन व श्री सूक्त पठणाने वैवाहिक सुख स्थिर.",
    goodEn: "A strong 7th house gives a happy married life with a devoted and attractive spouse. Business partnerships prove highly profitable — joint ventures flourish. Success in public relations, politics, diplomacy and foreign trade. Financial and social gains from spouse's family. Friday Mahalakshmi pujan and Shri Sukta paath sustain marital bliss.",
    badMr: "सप्तम भाव दुर्बल — विवाहात विलंब, जोडीदाराशी मतभेद व विवाह बंधनात ताण. व्यावसायिक भागीदारीत फसवणूक व नुकसान शक्य. तुळजापूर भवानी किंवा कोल्हापूर महालक्ष्मी यात्रा वैवाहिक बाधा दूर करते. मंगळ दोष असल्यास 'कुंभ विवाह' करा. गुरुवारी पिवळे वस्त्र, केळी व चण्याची डाळ दान.",
    badEn: "A weak 7th house — marriage delays, spousal discord and strain in the bond. Business partnerships may face cheating and losses. Yatra to Tuljapur Bhavani or Kolhapur Mahalaxmi removes marital afflictions. If Manglik, perform Kumbh Vivah. On Thursdays donate yellow clothes, bananas and chana dal.",
    emptyMr: "सप्तम भाव रिक्त — विवाह सामान्य व सप्तमेशाच्या स्थानावर अवलंबून. भागीदारी साधारण. विवाहासाठी योग्य काळ व मुहूर्त पाहून निर्णय घ्या.",
    emptyEn: "Empty 7th house — ordinary marriage depending on the 7th lord. Partnerships average. Decide marriage carefully by timing and muhurta.",
  },
  {
    house: 8, titleMr: "आयुर् भाव — आयुष्य, गुप्त ज्ञान, वारसा, अकस्मात", titleEn: "Ayur Bhava — Longevity, Occult, Inheritance, Sudden Events", icon: "🔮",
    goodMr: "अष्टम भाव मजबूत — दीर्घायुष्य, गूढविद्या, तंत्र, ज्योतिष व मंत्रशास्त्रात विशेष रस. अनपेक्षित वारसा, जोडीदाराच्या कुटुंबाकडून संपत्ती व विमा/भविष्य निर्वाह यातून लाभ. संशोधन, इतिहास, पुरातत्व, तत्त्वज्ञान यात अधिकार. कुंडलिनी जागृती व आध्यात्मिक साधनेत यश. महामृत्युंजय जप व शिव उपासना दीर्घायुष्य देणारी.",
    goodEn: "A strong 8th house gives longevity and deep interest in occult, tantra, astrology and mantra-shastra. Unexpected inheritance, wealth through spouse's family, and gains from insurance. Mastery in research, history, archaeology and philosophy. Kundalini awakening and spiritual sadhana flourish. Mahamrityunjaya japa and Shiva worship grant long life.",
    badMr: "अष्टम भाव दुर्बल — अकस्मात संकटे, अपघात, शस्त्रक्रिया व दीर्घकालीन आजारांची शक्यता. गुप्त शत्रू, मानसिक तणाव, नैराश्य व वारसा वादात अडकणे संभवते. विषबाधा, विषारी औषधे व जलसंबंधित धोक्यांपासून सावध राहा. महामृत्युंजय मंत्र १०८ × ४० दिवस, रुद्राभिषेक व भैरव उपासना. अमावस्येला पितृतर्पण अवश्य.",
    badEn: "A weak 8th house — sudden crises, accidents, surgeries and chronic ailments possible. Hidden enemies, mental stress, depression and inheritance disputes. Guard against poisoning and water-related dangers. Mahamrityunjaya 108 × 40 days, Rudrabhishek and Bhairava worship. Perform pitru-tarpana on every Amavasya.",
    emptyMr: "अष्टम भाव रिक्त असणे बहुशुभ — सामान्य आयुष्य, अनपेक्षित संकटे कमी. गूढ विषयांत मध्यम रस. शिव उपासना व ध्यान आत्मविकासास पोषक.",
    emptyEn: "An empty 8th house is generally beneficial — normal longevity with fewer sudden crises. Moderate interest in the occult. Shiva worship and meditation fuel self-growth.",
  },
  {
    house: 9, titleMr: "भाग्य भाव — धर्म, गुरू, पिता, लांब प्रवास, उच्च शिक्षण", titleEn: "Bhagya Bhava — Fortune, Guru, Father, Long Travel, Higher Learning", icon: "🍀",
    goodMr: "नवम भाव अत्यंत बलवान — अतूट भाग्य, पित्याचा आशीर्वाद व गुरुकृपेमुळे जीवनात सतत उन्नती. धार्मिक-आध्यात्मिक वृत्ती, तीर्थयात्रा, दान व यज्ञ यांमधून विशेष पुण्य. परदेश प्रवास व उच्च शिक्षण यातून प्रतिष्ठा. कायदा, न्यायपालिका, शिक्षण, धर्म व बॅंकिंग क्षेत्रात उत्कृष्ट करिअर. गुरुवारी गुरुचरित्र पारायण व दत्त मंदिर (गाणगापूर, नृसिंहवाडी) दर्शन केल्याने भाग्यवृद्धी.",
    goodEn: "A very strong 9th house — unbroken fortune, father's blessings and guru's grace ensure steady rise. Religious-spiritual inclination; pilgrimages, donations and yajnas yield special punya. Prestige through foreign travel and higher studies. Excellent career in law, judiciary, education, religion and banking. Thursday Gurucharitra parayana and darshan at Datta mandirs (Ganagapur, Narasobawadi) amplify fortune.",
    badMr: "नवम भाव दुर्बल — भाग्योदयास विलंब, पित्याशी मतभेद व धर्मश्रद्धेत संभ्रम. परदेश प्रवासात अडथळे, उच्च शिक्षणात व्यत्यय शक्य. गुरुवारी पिवळे वस्त्र, पुखराज रत्न, केळी व चण्याची डाळ दान करा. दत्त यात्रा, गुरुचरित्र पारायण, पिंपळ पूजा व पिंडदान अत्यंत प्रभावी.",
    badEn: "A weak 9th house — delayed fortune, differences with father and confusion in faith. Obstacles in foreign travel and interruptions in higher studies. On Thursdays donate yellow cloth, Pukhraj, bananas and chana dal. Datta yatra, Gurucharitra parayana, peepal worship and pinda-daan are highly effective.",
    emptyMr: "नवम भाव रिक्त — भाग्य मध्यम, स्वकर्मावर व नवमेशाच्या स्थानावर अवलंबून. नियमित गुरु-सेवा, धार्मिक यात्रा व सात्विक आचरणाने भाग्य जागृत होते.",
    emptyEn: "Empty 9th house — moderate fortune, depending on karma and the 9th lord. Regular guru-seva, pilgrimages and sattvic conduct awaken latent fortune.",
  },
  {
    house: 10, titleMr: "कर्म भाव — करिअर, कीर्ती, व्यवसाय, सार्वजनिक प्रतिष्ठा", titleEn: "Karma Bhava — Career, Fame, Profession, Public Standing", icon: "💼",
    goodMr: "दशम भाव अत्यंत मजबूत — उत्कृष्ट करिअर, सामाजिक प्रतिष्ठा व कीर्ती यांमुळे नेतृत्वाच्या पदांवर नियुक्ती. सरकारी/प्रशासकीय सेवा, राजकारण, न्यायपालिका, व्यवसाय, कॉर्पोरेट क्षेत्रात शिखर गाठाल. पित्याकडून व गुरुकडून मार्गदर्शन व आशीर्वाद. रविवारी सूर्याला अर्घ्य, आदित्य हृदय पठण व तांब्याच्या पात्रातून जल सेवन केल्याने कर्मबल वाढते. नम्रता व प्रामाणिकतेने दीर्घ कीर्ती टिकून राहते.",
    goodEn: "A very strong 10th house brings outstanding career, social prestige and fame leading to leadership roles. Peak positions in government/administration, politics, judiciary, business and corporate fields. Father's and guru's guidance and blessings. Sunday arghya to the Sun, Aditya Hridaya paath and drinking water from a copper vessel enhance karma-bala. Humility and honesty preserve lasting fame.",
    badMr: "दशम भाव दुर्बल — करिअरमध्ये अडथळे, वरिष्ठांशी मतभेद व वारंवार नोकरी बदलाची शक्यता. कीर्तीला धक्का व सामाजिक बदनामी टाळण्यासाठी सावध वागा. रविवारी सूर्य पूजा, शनिवारी शनी तेलाभिषेक व हनुमान चालीसा पठण. पिंपळ पूजा, पित्याची सेवा व गरीबांना दान हे आवश्यक उपाय.",
    badEn: "A weak 10th house — career obstacles, conflicts with seniors and frequent job changes. Guard reputation against defamation. Sunday Surya pujan, Saturday Shani oil abhishek and Hanuman Chalisa paath. Peepal worship, service to father and charity to the poor are essential remedies.",
    emptyMr: "दशम भाव रिक्त — करिअर सामान्य, मेहनत व कौशल्यावर अवलंबून. दशमेशाच्या स्थानानुसार व्यवसाय निवडा. सूर्य उपासना व नेतृत्व गुणांचा विकास महत्त्वाचा.",
    emptyEn: "Empty 10th house — average career depending on skill and effort. Choose a field based on the 10th lord's placement. Sun worship and leadership development are key.",
  },
  {
    house: 11, titleMr: "लाभ भाव — उत्पन्न, मित्र, आकांक्षा, ज्येष्ठ भावंडे", titleEn: "Labha Bhava — Income, Friends, Aspirations, Elder Siblings", icon: "🎯",
    goodMr: "एकादश भाव मजबूत — सर्व इच्छांची पूर्ती, अनेक स्त्रोतांकडून सतत लाभ व संपत्तीचा ओघ. मित्रांचा प्रबळ पाठिंबा व सामाजिक नेटवर्क यामुळे व्यावसायिक उंची. ज्येष्ठ भावंडांकडून मार्गदर्शन व आर्थिक सहकार्य. राजकारण, सामाजिक कार्य, संघटन, व्यापार यात यश. गुरुवार व एकादशीचे उपवास, विष्णू सहस्रनाम पठण व तिजोरीत कुबेर यंत्र स्थापन केल्याने लाभ वृद्धी.",
    goodEn: "A strong 11th house — fulfilment of all desires, steady gains from many sources and flowing wealth. Mighty support from friends and social networks lift you high. Elder siblings' guidance and financial support. Success in politics, social work, organisations and trade. Thursday and Ekadashi fasts, Vishnu Sahasranama paath, and installing Kubera Yantra in your safe multiply gains.",
    badMr: "एकादश भाव दुर्बल — इच्छापूर्तीत विलंब, मित्रांपासून विश्वासघात व अनियमित उत्पन्न. ज्येष्ठ भावंडांशी मतभेद शक्य. श्रीसूक्त व कनकधारा स्तोत्र दररोज पठण. तिजोरीत चांदीचा सिक्का, श्रीयंत्र व लाल कपडा ठेवा. शुक्रवारी गरीबांना वस्त्र व अन्नदान केल्याने उत्पन्नात स्थिरता.",
    badEn: "A weak 11th house — delayed fulfilment, betrayal by friends and irregular income. Possible discord with elder siblings. Daily Shri Sukta and Kanakadhara Stotra. Keep a silver coin, Shri Yantra and red cloth in the safe. Friday donation of clothes and food to the poor steadies income.",
    emptyMr: "एकादश भाव रिक्त — लाभ मध्यम, स्वतःच्या प्रयत्नांवर व एकादशेशाच्या स्थानावर अवलंबून. कुबेर उपासना, गणपती पूजा व लक्ष्मी नारायण मंदिरात दान लाभदायक.",
    emptyEn: "Empty 11th house — gains are moderate, dependent on personal effort and 11th lord. Kubera worship, Ganesha pujan and donations at Lakshmi-Narayan temples help.",
  },
  {
    house: 12, titleMr: "व्यय भाव — खर्च, मोक्ष, परदेश, झोप, आध्यात्मिक उन्नती", titleEn: "Vyaya Bhava — Expenses, Moksha, Foreign, Sleep, Spirituality", icon: "✈️",
    goodMr: "द्वादश भाव मजबूत — आध्यात्मिक उन्नती, ध्यान-साधना व मोक्षमार्गाकडे प्रबळ कल. परदेश प्रवास, परदेशी शिक्षण व परदेशी संबंधांतून मोठा लाभ. चांगली झोप, स्वप्नदृष्टी व अंतःप्रेरणा प्रखर. दानधर्म, गुप्त सेवा व गरिबांना मदत केल्याने पुण्य संचय. हॉस्पिटल, आश्रम, अध्ययन-केंद्र व धर्मस्थळांशी जोडलेले कार्य फलदायी. एकादशीचा उपवास व विष्णू सहस्रनाम पठण मोक्षदायक.",
    goodEn: "A strong 12th house — spiritual evolution, meditation-sadhana and strong pull towards moksha. Substantial gains from foreign travel, overseas education and international connections. Restful sleep, vivid dreams and sharp intuition. Charity, anonymous service and help to the poor build punya. Work connected with hospitals, ashrams, study centres and religious places flourishes. Ekadashi fast and Vishnu Sahasranama confer liberation.",
    badMr: "द्वादश भाव दुर्बल — अनावश्यक खर्च, कर्ज, झोपेच्या समस्या व मानसिक अस्वस्थता. गुप्त शत्रू, रुग्णालय-न्यायालय संबंध व एकाकीपणाची शक्यता. डोळे, पाय व रोगप्रतिकार शक्तीची काळजी घ्या. शनिवारी तेल दीप, हनुमान चालीसा ११ वेळा व गणपती पूजा. गरिबांना रोज अन्नदान व विष्णू सहस्रनाम पठण. परदेश प्रवासापूर्वी दुर्गा व गणेश यंत्र स्थापन करा.",
    badEn: "A weak 12th house — unnecessary expenses, debt, sleep issues and emotional restlessness. Hidden enemies, hospital/court dealings and loneliness possible. Guard eyes, feet and immunity. Saturday oil lamp, Hanuman Chalisa 11 times and Ganesha puja. Daily food donation to the poor and Vishnu Sahasranama paath. Before foreign travel, install Durga and Ganesh Yantras.",
    emptyMr: "द्वादश भाव रिक्त — खर्च सामान्य. आध्यात्मिक विकासासाठी जाणीवपूर्वक प्रयत्न करा. नियमित ध्यान, एकादशी उपवास व दानधर्म यामुळे गुप्त पुण्य वाढते.",
    emptyEn: "Empty 12th house — routine expenses. Make deliberate effort for spiritual growth. Regular meditation, Ekadashi fasts and charity build hidden punya.",
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

  // ─── Planet → Deity mapping (detailed traditional Maharashtrian practices) ───
  const planetDeity: Record<string, { deityMr: string; deityEn: string; poojaMr: string; poojaEn: string; day: string; dayMr: string }> = {
    Sun: {
      deityMr: "श्री सूर्यनारायण / श्री राम",
      deityEn: "Lord Surya / Lord Ram",
      poojaMr: "रविवारी सूर्योदयाच्या वेळी तांब्याच्या पात्रातून अर्घ्य (लाल फुल, कुमकुम, साखर मिसळून) द्या. आदित्य हृदय स्तोत्र नित्य पठण — रामायणातील सर्वश्रेष्ठ सूर्य मंत्र. सूर्य गायत्री १०८ वेळा जपा. १२ सूर्यनमस्कार दररोज सकाळी. माणिक रत्न ज्योतिषीच्या सल्ल्याने धारण करा. सूर्य मंदिर (कोणार्क, मोढेरा) यात्रा.",
      poojaEn: "On Sundays at sunrise offer arghya from a copper vessel (red flower, kumkum, sugar mixed). Recite Aditya Hridaya Stotra daily — the supreme Sun mantra from the Ramayana. Chant Surya Gayatri 108 times. 12 Surya Namaskars every morning. Wear Ruby (Manik) on astrologer's advice. Yatra to Sun temples (Konark, Modhera).",
      day: "Sunday", dayMr: "रविवार",
    },
    Moon: {
      deityMr: "श्री शंकर (महादेव) / पार्वती माता",
      deityEn: "Lord Shiva / Goddess Parvati",
      poojaMr: "सोमवारी शिव मंदिरात रुद्राभिषेक करा — पंचामृत (दूध, दही, तूप, मध, साखर), गंगाजल, बेलपत्र अर्पण. शिवलिंगावर कच्चे दूध अर्पण, ॐ नमः शिवाय व महामृत्युंजय मंत्र पठण. पौर्णिमेला चंद्राकडे पाहून चंद्र नमस्कार. मोती (मुक्ता) चांदीत जडवून धारण. माहुर, सप्तशृंगी, कोल्हापूर महालक्ष्मी यात्रा.",
      poojaEn: "On Mondays perform Rudrabhishek at a Shiva temple — Panchamrit (milk, curd, ghee, honey, sugar), Ganga jal, bilva leaves. Offer raw milk on the Shiva Lingam; chant Om Namah Shivaya and Mahamrityunjaya. On Purnima offer Moon Namaskar. Wear Pearl (Mukta) set in silver. Yatra to Mahur, Saptashrungi, Kolhapur Mahalaxmi.",
      day: "Monday", dayMr: "सोमवार",
    },
    Mars: {
      deityMr: "श्री हनुमान / भगवान कार्तिकेय / श्री खंडोबा",
      deityEn: "Lord Hanuman / Lord Kartikeya / Khandoba",
      poojaMr: "मंगळवारी व शनिवारी हनुमान मंदिरात जाऊन हनुमान चालीसा ११ वेळा पठण. शेंदूर, चमेलीचे तेल व लाल फुले अर्पण. मंगळनाथ (उज्जैन) शांती पूजा सर्वश्रेष्ठ. महाराष्ट्रात जेजुरी खंडोबा व मोरगाव मयूरेश्वर दर्शन. मूंगा (लाल पोवळा) धारण. लाल मसूर डाळ, गूळ व तांबे दान.",
      poojaEn: "On Tuesdays and Saturdays visit Hanuman temple; recite Hanuman Chalisa 11 times; offer sindoor, jasmine oil and red flowers. Mangalnath (Ujjain) shanti pooja is supreme. In Maharashtra, darshan at Jejuri Khandoba and Morgaon Mayureshwar. Wear Red Coral. Donate red masoor dal, jaggery and copper.",
      day: "Tuesday", dayMr: "मंगळवार",
    },
    Mercury: {
      deityMr: "श्री विष्णू / श्री कृष्ण / श्री गणपती",
      deityEn: "Lord Vishnu / Lord Krishna / Lord Ganesha",
      poojaMr: "बुधवारी विष्णू सहस्रनाम व श्री सूक्त पठण. गणपतीला दूर्वा, मोदक व जास्वंद अर्पण; गणेश अथर्वशीर्ष २१ वेळा. तुळशीची नित्य पूजा. पन्ना (एमरल्ड) सोन्यात जडवून धारण. हिरवी मूग डाळ, पुस्तके, पेन दान. मोरेश्वर (मोरगाव) व चिंतामणी (थेऊर) अष्टविनायक यात्रा.",
      poojaEn: "On Wednesdays recite Vishnu Sahasranama and Shri Sukta. Offer durva, modak and hibiscus to Ganesha; recite Ganesh Atharvashirsha 21 times. Daily Tulsi worship. Wear Emerald (Panna) in gold. Donate moong dal, books and pens. Yatra to Moreshwar (Morgaon) and Chintamani (Theur) Ashtavinayaks.",
      day: "Wednesday", dayMr: "बुधवार",
    },
    Jupiter: {
      deityMr: "श्री दत्तात्रेय / श्री बृहस्पती / श्री विष्णू",
      deityEn: "Lord Dattatreya / Lord Brihaspati / Lord Vishnu",
      poojaMr: "गुरुवारी गुरुचरित्र पारायण (५३ अध्याय ३ दिवसांत) — दत्तात्रेयांची सर्वश्रेष्ठ उपासना. गाणगापूर, नृसिंहवाडी, औदुंबर, माहूर, अक्कलकोट या दत्त क्षेत्रांची यात्रा. पिवळे वस्त्र, केशर टिळा, पुखराज धारण. केळी, हळद, चण्याची डाळ, तूप दान. ब्राह्मण-गुरूला भोजन व दक्षिणा. पिंपळाखाली तुपाचा दीप.",
      poojaEn: "On Thursdays perform Gurucharitra parayana (53 adhyayas over 3 days) — the supreme Dattatreya sadhana. Yatra to Datta kshetras: Ganagapur, Narasobawadi, Audumbar, Mahur, Akkalkot. Yellow clothes, saffron tilak, Yellow Sapphire. Donate bananas, turmeric, chana dal, ghee. Feed Brahmins/guru with dakshina. Light a ghee lamp under a Peepal tree.",
      day: "Thursday", dayMr: "गुरुवार",
    },
    Venus: {
      deityMr: "श्री महालक्ष्मी / श्री पार्वती",
      deityEn: "Goddess Mahalakshmi / Goddess Parvati",
      poojaMr: "शुक्रवारी महालक्ष्मी अष्टक, श्री सूक्त व कनकधारा स्तोत्र पठण. पांढरी-गुलाबी फुले, केसर, चांदीचे पात्र लक्ष्मीला अर्पण. कोल्हापूर महालक्ष्मी, तुळजापूर भवानी — महाराष्ट्रातील शक्ति पीठ यात्रा. हीरा/ओपल सोन्यात धारण. शुक्रवारी तांदूळ, साखर, पांढरे वस्त्र, अत्तर दान. गरीब स्त्रियांना व कन्यांना मदत.",
      poojaEn: "On Fridays recite Mahalakshmi Ashtak, Shri Sukta and Kanakadhara Stotra. Offer white-pink flowers, saffron, silver vessel to Lakshmi. Yatra to Kolhapur Mahalaxmi and Tuljapur Bhavani — Maharashtra's Shakti Peethas. Wear Diamond/Opal in gold. Donate rice, sugar, white cloth, perfume on Fridays. Help poor women and girls.",
      day: "Friday", dayMr: "शुक्रवार",
    },
    Saturn: {
      deityMr: "श्री शनिदेव / श्री हनुमान / श्री शंकर",
      deityEn: "Lord Shani / Lord Hanuman / Lord Shiva",
      poojaMr: "शनिवारी शनि शिंगणापूर (महाराष्ट्र) येथे तेलाभिषेक व काळे वस्त्र अर्पण. हनुमान चालीसा ११ वेळा + सुंदरकांड पाठ — शनी व हनुमान मित्र आहेत. शिव मंदिरात रुद्राभिषेक साप्ताहिक. 'ॐ शं शनैश्चराय नमः' १०८ × ४० दिवस. काळे तीळ-गूळ, काळी उडीद, लोखंड, कंबळ दान. वृद्ध, अपंग व मजुरांची सेवा.",
      poojaEn: "On Saturdays offer oil abhishek and black cloth at Shani Shingnapur (Maharashtra). Hanuman Chalisa 11 times + Sundarkand paath — Shani and Hanuman are friends. Weekly Rudrabhishek at a Shiva temple. Chant 'Om Sham Shanaishcharaya Namah' 108 × 40 days. Donate black sesame-jaggery, urad, iron, blanket. Serve elders, the disabled and labourers.",
      day: "Saturday", dayMr: "शनिवार",
    },
    Rahu: {
      deityMr: "श्री दुर्गा माता / काळभैरव / श्री सरस्वती",
      deityEn: "Goddess Durga / Kaal Bhairav / Goddess Saraswati",
      poojaMr: "दुर्गा सप्तशती पाठ — नवरात्रीत नित्य. राहु मंत्र 'ॐ रां राहवे नमः' १८००० × ४० दिवसांत अनुष्ठान. त्र्यंबकेश्वर येथे काळसर्प शांती (गंभीर राहु दोषासाठी). ८ मुखी रुद्राक्ष धारण, गोमेद रत्न. काळे उडीद, नारळ, कंबळ दान. भैरव मंदिरात शनिवारी तेल दीप. कुत्र्यांना अन्न. अमावस्येला पितृ तर्पण.",
      poojaEn: "Recite Durga Saptashati — daily through Navratri. Anushthana of Rahu mantra 'Om Ram Rahave Namah' — 18,000 over 40 days. Kalsarp Shanti at Trimbakeshwar for severe Rahu dosha. Wear 8-mukhi Rudraksha, Hessonite. Donate black urad, coconut, blanket. Saturday oil lamp at Bhairava temple. Feed dogs. Pitru tarpana on Amavasya.",
      day: "Saturday", dayMr: "शनिवार",
    },
    Ketu: {
      deityMr: "श्री गणपती / भगवान चित्रगुप्त / श्री सुब्रह्मण्य",
      deityEn: "Lord Ganesha / Lord Chitragupta / Lord Subrahmanya",
      poojaMr: "गणेश अथर्वशीर्ष २१ वेळा, संकष्टी चतुर्थी व्रत मासिक. अष्टविनायक यात्रा (मोरगाव, सिद्धटेक, पाली, महाड, थेऊर, लेण्याद्री, ओझर, रांजणगाव). केतु मंत्र 'ॐ स्रां स्रीं स्रौं सः केतवे नमः' ७००० × ४० दिवसांत. ९ मुखी रुद्राक्ष, लहसुनिया रत्न. गणपतीला दूर्वा, मोदक नैवेद्य. कुत्र्याला रोज अन्न. गरीबांना कंबळ दान.",
      poojaEn: "Recite Ganesh Atharvashirsha 21 times; monthly Sankashti Chaturthi vrata. Ashtavinayak yatra (Morgaon, Siddhatek, Pali, Mahad, Theur, Lenyadri, Ozar, Ranjangaon). Anushthana of Ketu mantra 'Om Sraam Sreem Sraum Sah Ketave Namah' — 7000 over 40 days. Wear 9-mukhi Rudraksha, Cat's Eye. Offer durva and modak to Ganesha. Feed dogs daily. Donate blankets to the poor.",
      day: "Tuesday", dayMr: "मंगळवार",
    },
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
        doshaItems.push(
          { mr: "साडेसाती शांती: सोमवारी शिव मंदिरात रुद्राभिषेक करा — पंचामृत (दूध, दही, तूप, मध, साखर), गंगाजल, कच्चे दूध, बेलपत्र व धोतरा अर्पण. श्रावण महिन्यात विशेष फलदायी. ॐ नमः शिवाय व महामृत्युंजय नित्य जप.", en: "Sade Sati shanti: Perform Rudrabhishek at a Shiva temple on Mondays — offer Panchamrit (milk, curd, ghee, honey, sugar), Ganga jal, raw milk, bilva leaves and dhatura. Especially potent during Shravan month. Chant Om Namah Shivaya and Mahamrityunjaya daily." },
          { mr: "महामृत्युंजय मंत्र — 'ॐ त्र्यंबकं यजामहे सुगंधिं पुष्टिवर्धनम्, उर्वारुकमिव बंधनान् मृत्योर्मुक्षीय मामृतात्' — रुद्राक्ष माळेवर १०८ वेळा, ४० दिवस अखंड. सकाळी स्नानानंतर व रात्री झोपण्यापूर्वी.", en: "Chant Mahamrityunjaya mantra — 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityormukshiya Mamritat' — 108 times on a rudraksha mala for 40 unbroken days. After morning bath and before bed." },
          { mr: "शनिवारी शनि शिंगणापूर (महाराष्ट्र) येथे तेलाभिषेक व काळे वस्त्र अर्पण. हनुमान चालीसा ११ वेळा व सुंदरकांड पाठ — हनुमान व शनि यांची मैत्री शनी प्रसन्न करते.", en: "On Saturdays offer oil abhishek and black cloth at Shani Shingnapur (Maharashtra). Recite Hanuman Chalisa 11 times and Sundarkand — the friendship of Hanuman and Shani pleases Shani." },
          { mr: "पिंपळ वृक्षाला शनिवारी पाणी घाला, तेलाचा दीप लावा व सात प्रदक्षिणा घाला. काळे तीळ-गूळ, काळी उडीद, लोखंड व कंबळ गरीबांना दान. वृद्ध व अपंगांची सेवा अत्यंत फलदायी.", en: "Water the Peepal tree on Saturdays, light an oil lamp and do seven pradakshinas. Donate black sesame-jaggery, urad, iron and blankets to the poor. Service to elders and the disabled is especially beneficial." },
          { mr: "५-मुखी किंवा ७-मुखी रुद्राक्ष धारण, नीलम रत्न केवळ अनुभवी ज्योतिषीच्या सल्ल्यानेच. शनि गायत्री — 'ॐ कृष्णांगाय विद्महे, रवी सुताय धीमही, तन्नो मंदः प्रचोदयात्' — १९००० जप ४० दिवसांत.", en: "Wear 5-mukhi or 7-mukhi Rudraksha; Blue Sapphire only under expert astrologer's guidance. Anushthana of Shani Gayatri — 'Om Krishnangaya Vidmahe, Ravi Sutaya Dhimahi, Tanno Mandah Prachodayat' — 19,000 japa over 40 days." },
        );
      }
      if (dosha.nameEn.includes("Mangal")) {
        doshaItems.push(
          { mr: "मंगळ दोष उपाय: हनुमान चालीसा रोज वाचा. मंगळवारी व शनिवारी हनुमान मंदिरात जाऊन ११ वेळा पठण. हनुमानाला शेंदूर, चमेलीचे तेल व लाल फुले अर्पण.", en: "Mangal Dosha: Recite Hanuman Chalisa daily. On Tuesdays and Saturdays, visit a Hanuman temple and recite it 11 times. Offer sindoor, jasmine oil and red flowers to Hanuman." },
          { mr: "मंगळनाथ मंदिर (उज्जैन) — मंगळाचे जन्मस्थान — येथे ग्रह शांती पूजा सर्वश्रेष्ठ. महाराष्ट्रात जेजुरी खंडोबा व मोरगाव मयूरेश्वर दर्शन. खंडोबाला भंडार-खोबरे अर्पण.", en: "Mangalnath Mandir (Ujjain) — the birthplace of Mars — offers supreme shanti pooja. In Maharashtra visit Jejuri Khandoba and Morgaon Mayureshwar; offer bhandar and coconut to Khandoba." },
          { mr: "मंगळवारी लाल सिंदूर हनुमानाला अर्पण. लाल मसूर डाळ, गहू, गूळ, तांबे व लाल फळे गरीब ब्राह्मणांना दान. लाल मुंग्या व गायीला लाल अन्न खाऊ घाला.", en: "Offer red sindoor to Hanuman on Tuesdays. Donate red masoor dal, wheat, jaggery, copper and red fruits to poor Brahmins. Feed red ants and a cow with red grains." },
          { mr: "मंगळ गायत्री — 'ॐ वीरध्वजाय विद्महे, विघ्नहस्ताय धीमही, तन्नो भौमः प्रचोदयात्' — १०८ × ४० दिवस जप. 'ॐ अंगारकाय नमः' मंत्र मंगळवारी २१ माळ.", en: "Mangal Gayatri — 'Om Viradhwajaya Vidmahe, Vighnahastaya Dhimahi, Tanno Bhaumah Prachodayat' — 108 × 40 days. Chant 'Om Angarakaya Namah' 21 malas on Tuesdays." },
          { mr: "मूंगा (लाल पोवळा) ५-११ कॅरेट, सोन्यात, उजव्या हाताच्या अनामिकेत, मंगळवारी सूर्योदयी धारण. विवाहापूर्वी तीव्र मंगळ दोष असल्यास 'कुंभ विवाह' किंवा 'अर्क विवाह'.", en: "Wear Red Coral (Moonga) 5-11 carats, set in gold, right ring finger, on Tuesday at sunrise. If severe before marriage, perform 'Kumbh Vivah' or 'Ark Vivah'." },
          { mr: "मंगळवारी उपवास — गूळ-चणे किंवा गोड खीर. मीठ, तेल, मांस व मसूर वर्ज्य. किमान ४० मंगळवार. रक्तदान वर्षातून एकदा — मंगळ रक्ताचा कारक. तांब्याच्या पात्रातून जल सेवन.", en: "Tuesday Vrata — jaggery-gram or sweet kheer; avoid salt, oil, meat, lentils. For at least 40 Tuesdays. Donate blood once a year — Mars rules blood. Drink water from a copper vessel." },
        );
      }
      if (dosha.nameEn.includes("Kaal Sarp") || dosha.nameEn.includes("Kalsarp")) {
        doshaItems.push(
          { mr: "काळसर्प शांती: त्र्यंबकेश्वर (नाशिक) येथे नारायण-नागबली + त्रिपिंडी श्राद्ध + काळसर्प शांती विधी — ३ दिवसांचे विधान सर्वश्रेष्ठ. कुशावर्त कुंडात स्नान, पंडितांकडून विधी करवा. पूजेपूर्वी २४ तास उपवास.", en: "Kalsarp Shanti: At Trimbakeshwar (Nashik) perform Narayan-Nagbali + Tripindi Shraddha + Kalsarp Shanti — the 3-day vidhi is supreme. Bathe in Kushavarta Kund; engage temple pandits. 24-hour fast before the ritual." },
          { mr: "नाग पंचमी (श्रावण शुद्ध पंचमी) दिवशी नाग देवतेची पूजा. कच्चे दूध, तांदळाची लाही, हळद-कुंकू अर्पण. नाग बिळात दूध ओता. नागस्तोत्र व मनसा देवी स्तुती.", en: "On Nag Panchami (Shravan Shukla Panchami) worship Naga devta. Offer raw milk, puffed rice, turmeric-kumkum. Pour milk at a snake hole. Recite Naga Stotra and Manasa Devi Stuti." },
          { mr: "महामृत्युंजय मंत्र १०८ वेळा दररोज + रुद्राभिषेक साप्ताहिक — पंचामृत, गंगाजल, बेलपत्र, धोतरा अर्पण. सोमवार, प्रदोष, महाशिवरात्रीचा उपवास.", en: "108 Mahamrityunjaya daily + weekly Rudrabhishek — Panchamrit, Ganga jal, bilva leaves, dhatura. Fast on Monday, Pradosh, Mahashivaratri." },
          { mr: "चांदीचा नाग-नागिण जोडीदार बनवून शिव मंदिरात २१ दिवस पूजा, नंतर गंगा, गोदावरी किंवा पवित्र वाहत्या नदीत विसर्जन.", en: "Make a silver pair of naga-nagin; worship at a Shiva temple for 21 days; then immerse in the Ganga, Godavari or any sacred flowing river." },
          { mr: "८-मुखी रुद्राक्ष (राहुसाठी), ९-मुखी (केतुसाठी) धारण. राहु मंत्र 'ॐ रां राहवे नमः' १८००० × ४० दिवस. काळे तीळ, काळी उडीद, लोखंड शनिवार-अमावस्येला दान.", en: "Wear 8-mukhi (Rahu) and 9-mukhi (Ketu) Rudraksha. Anushthana of Rahu mantra 'Om Ram Rahave Namah' — 18,000 in 40 days. Donate black sesame, urad, iron on Saturdays and Amavasya." },
          { mr: "५ जुन्या जयोतिर्लिंगांची (त्र्यंबकेश्वर, भीमाशंकर, घृष्णेश्वर, औंढा नागनाथ, परळी वैजनाथ) यात्रा. काळ्या कुत्र्यांची सेवा व अमावस्येला पितृ तर्पण.", en: "Yatra to 5 Maharashtra Jyotirlingas (Trimbakeshwar, Bhimashankar, Grishneshwar, Aundha Nagnath, Parli Vaijnath). Serve black dogs; pitru tarpana on Amavasya." },
        );
      }
      if (dosha.nameEn.includes("Pitra") || dosha.nameEn.includes("Pitru")) {
        doshaItems.push(
          { mr: "पितृ दोष शांती: पितृपक्षात (भाद्रपद कृष्ण पक्ष) सर्व १६ दिवसांत विधीवत पिंडदान व तर्पण करा. गया (बिहार) हे पिंडदानाचे सर्वश्रेष्ठ क्षेत्र; प्रयाग, वाराणसी, नाशिक त्र्यंबकेश्वर देखील उत्तम.", en: "Pitra Dosha: During Pitru Paksha (16 days of Bhadrapada Krishna paksha) perform pinda-daan and tarpana each day. Gaya (Bihar) is supreme; Prayag, Varanasi, Nashik-Trimbakeshwar are also excellent." },
          { mr: "अमावस्येला पितृ तर्पण — तीळ, जल, कुश, चंदन यांनी. दर अमावस्येला पितरांच्या नावाने ब्राह्मण-भोजन व कपडे दान.", en: "Every Amavasya perform pitru-tarpana with til, water, kush grass, sandalwood. Feed Brahmins and donate clothes in the ancestors' names each Amavasya." },
          { mr: "रविवारी सूर्याला तांब्याच्या पात्रातून अर्घ्य. आदित्य हृदय स्तोत्र पठण. पिंपळाच्या झाडाखाली तेल/तुपाचा दीप दर शनिवारी.", en: "Offer Surya arghya from a copper vessel on Sundays; recite Aditya Hridaya Stotra. Light an oil or ghee lamp under a Peepal tree every Saturday." },
          { mr: "ब्राह्मण-भोजन, गाय-सेवा, कावळ्यांना खाद्य, कुत्र्याला अन्न, मुंग्यांना साखर — हे सर्व पितृ तुष्टी कारक. श्राद्ध दिवशी हे सर्व अवश्य करा.", en: "Feed Brahmins, serve cows, feed crows, dogs and sugar to ants — all pacify the ancestors. Definitely perform these on shraddha days." },
          { mr: "त्रिपिंडी श्राद्ध त्र्यंबकेश्वर येथे, नारायण नागबली तेथेच — ३ पिढ्यांच्या अतृप्त पितरांसाठी विशेष शांती विधी. विष्णू सहस्रनाम व गरुड पुराण पाठ लाभदायक.", en: "Tripindi Shraddha at Trimbakeshwar and Narayan-Nagbali there — for 3 generations of unsatisfied ancestors. Recitation of Vishnu Sahasranama and Garuda Purana is beneficial." },
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
