import { NAKSHATRAS, RASHIS, NAKSHATRA_VARNA, NAKSHATRA_YONI, NAKSHATRA_GANA, NAKSHATRA_NADI, YONI_ENEMIES } from "./constants";

export interface MatchResult {
  factor: string;
  factorMr: string;
  maxPoints: number;
  scored: number;
  description: string;
}

export interface MatchingResult {
  boyNakshatra: string;
  girlNakshatra: string;
  boyRashi: string;
  girlRashi: string;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  verdict: string;
  verdictMr: string;
  factors: MatchResult[];
}

// Varna matching (1 point)
// Boy's varna should be equal or higher than girl's
// 0=Brahmin(highest), 1=Kshatriya, 2=Vaishya, 3=Shudra(lowest)
function matchVarna(boyNak: number, girlNak: number): number {
  const boyVarna = NAKSHATRA_VARNA[boyNak] ?? 2;
  const girlVarna = NAKSHATRA_VARNA[girlNak] ?? 2;
  // Lower number = higher varna. Boy should be <= girl.
  return boyVarna <= girlVarna ? 1 : 0;
}

// Vashya matching (2 points)
// Per classical texts: 5 groups based on rashi
// 0=Chatushpada(quadruped), 1=Manav(human), 2=Jalachara(aquatic), 3=Vanachara(wild), 4=Keeta(insect)
function matchVashya(boyRashi: number, girlRashi: number): number {
  // Aries=Chatushpada, Taurus=Chatushpada, Gemini=Manav, Cancer=Jalachara/Keeta,
  // Leo=Vanachara, Virgo=Manav, Libra=Manav, Scorpio=Keeta,
  // Sagittarius=Manav(first half)/Chatushpada(second), Capricorn=Jalachara/Chatushpada, Aquarius=Manav, Pisces=Jalachara
  const vashyaGroup = [0, 0, 1, 4, 3, 1, 1, 4, 1, 2, 1, 2];
  const bg = vashyaGroup[boyRashi];
  const gg = vashyaGroup[girlRashi];

  if (boyRashi === girlRashi) return 2; // Same rashi = full points
  if (bg === gg) return 2;

  // Specific Vashya relationships per classical texts
  // Leo is Vashya to Aries; Cancer/Scorpio are mutual Vashya
  const vashyaPairs: [number, number][] = [
    [0, 4], // Aries → Leo
    [3, 7], // Cancer → Scorpio
    [7, 3], // Scorpio → Cancer
    [8, 11], // Sagittarius → Pisces
    [9, 10], // Capricorn → Aquarius
  ];
  const isPair = vashyaPairs.some(([a, b]) => (boyRashi === a && girlRashi === b) || (boyRashi === b && girlRashi === a));
  if (isPair) return 2;

  // Same group but not pair
  if (bg === gg) return 2;
  // Human is vashya to all
  if (bg === 1 || gg === 1) return 1;
  return 0;
}

// Tara matching (3 points) — check BOTH directions, take better score
function matchTara(boyNak: number, girlNak: number): number {
  const favorable = [1, 2, 4, 6, 8, 9]; // Janma, Sampat, Kshema, Sadhana, Mitra, Ati-Mitra

  // Boy's tara from girl
  const diff1 = ((boyNak - girlNak + 27) % 27);
  const tara1 = (diff1 % 9) + 1;

  // Girl's tara from boy
  const diff2 = ((girlNak - boyNak + 27) % 27);
  const tara2 = (diff2 % 9) + 1;

  const boyGood = favorable.includes(tara1);
  const girlGood = favorable.includes(tara2);

  if (boyGood && girlGood) return 3;
  if (boyGood || girlGood) return 1.5;
  return 0;
}

// Yoni matching (4 points) — uses proper enemy pair matrix
function matchYoni(boyNak: number, girlNak: number): number {
  const boyYoni = NAKSHATRA_YONI[boyNak] ?? 0;
  const girlYoni = NAKSHATRA_YONI[girlNak] ?? 0;

  // Same animal = 4 points
  if (boyYoni === girlYoni) return 4;

  // Check if they are enemy pairs
  const isEnemy = YONI_ENEMIES.some(
    ([a, b]) => (boyYoni === a && girlYoni === b) || (boyYoni === b && girlYoni === a)
  );
  if (isEnemy) return 0;

  // Not enemy, not same — check if friendly (same type roughly)
  // Neutral pairs get 2, somewhat compatible get 3
  return 2;
}

// Graha Maitri (5 points) - based on Rashi lords' friendship
function matchGrahaMaitri(boyRashi: number, girlRashi: number): number {
  const lords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const boyLord = lords[boyRashi];
  const girlLord = lords[girlRashi];

  const friends: Record<string, string[]> = {
    Sun: ["Moon", "Mars", "Jupiter"],
    Moon: ["Sun", "Mercury"],
    Mars: ["Sun", "Moon", "Jupiter"],
    Mercury: ["Sun", "Venus"],
    Jupiter: ["Sun", "Moon", "Mars"],
    Venus: ["Mercury", "Saturn"],
    Saturn: ["Mercury", "Venus"],
  };

  const enemies: Record<string, string[]> = {
    Sun: ["Venus", "Saturn"],
    Moon: [],       // Moon has no enemies per BPHS
    Mars: ["Mercury"],
    Mercury: ["Moon"],
    Jupiter: ["Mercury", "Venus"],
    Venus: ["Sun", "Moon"],
    Saturn: ["Sun", "Moon", "Mars"],
  };

  if (boyLord === girlLord) return 5;
  // Both consider each other friends
  if (friends[boyLord]?.includes(girlLord) && friends[girlLord]?.includes(boyLord)) return 5;
  // One friend, other neutral
  if (friends[boyLord]?.includes(girlLord) || friends[girlLord]?.includes(boyLord)) return 4;
  // Both neutral
  if (!enemies[boyLord]?.includes(girlLord) && !enemies[girlLord]?.includes(boyLord)) return 3;
  // One friend, other enemy
  if ((friends[boyLord]?.includes(girlLord) && enemies[girlLord]?.includes(boyLord)) ||
      (friends[girlLord]?.includes(boyLord) && enemies[boyLord]?.includes(girlLord))) return 1;
  // Both enemies
  if (enemies[boyLord]?.includes(girlLord) && enemies[girlLord]?.includes(boyLord)) return 0;
  // One enemy
  return 1;
}

// Gana matching (6 points)
function matchGana(boyNak: number, girlNak: number): number {
  const bg = NAKSHATRA_GANA[boyNak] ?? 0;
  const gg = NAKSHATRA_GANA[girlNak] ?? 0;
  // Same gana = full points
  if (bg === gg) return 6;
  // Deva boy + Manushya girl or vice versa = 5
  if ((bg === 0 && gg === 1) || (bg === 1 && gg === 0)) return 5;
  // Deva + Rakshasa = 1 (very bad)
  if ((bg === 0 && gg === 2) || (bg === 2 && gg === 0)) return 1;
  // Manushya + Rakshasa = 0
  if ((bg === 1 && gg === 2) || (bg === 2 && gg === 1)) return 0;
  return 0;
}

// Bhakoot matching (7 points) — check BOTH directions
function matchBhakoot(boyRashi: number, girlRashi: number): number {
  const diff1 = ((boyRashi - girlRashi + 12) % 12) + 1;
  const diff2 = ((girlRashi - boyRashi + 12) % 12) + 1;

  // Inauspicious pairs: 2/12, 5/9, 6/8 (from either direction)
  const badPairs: [number, number][] = [[2, 12], [5, 9], [6, 8]];
  const isBad = badPairs.some(([a, b]) =>
    (diff1 === a && diff2 === b) || (diff1 === b && diff2 === a)
  );

  return isBad ? 0 : 7;
}

// Nadi matching (8 points)
function matchNadi(boyNak: number, girlNak: number): number {
  const bn = NAKSHATRA_NADI[boyNak] ?? 0;
  const gn = NAKSHATRA_NADI[girlNak] ?? 0;
  // Same nadi = 0 points (Nadi Dosha — serious health/progeny concern)
  if (bn === gn) return 0;
  return 8;
}

export function calculateMatching(
  boyNakIndex: number,
  boyRashiIndex: number,
  girlNakIndex: number,
  girlRashiIndex: number
): MatchingResult {
  const factors: MatchResult[] = [
    { factor: "Varna", factorMr: "वर्ण", maxPoints: 1, scored: matchVarna(boyNakIndex, girlNakIndex), description: "आध्यात्मिक सुसंगतता" },
    { factor: "Vashya", factorMr: "वश्य", maxPoints: 2, scored: matchVashya(boyRashiIndex, girlRashiIndex), description: "परस्पर आकर्षण" },
    { factor: "Tara", factorMr: "तारा", maxPoints: 3, scored: matchTara(boyNakIndex, girlNakIndex), description: "जन्म नक्षत्र सुसंगतता" },
    { factor: "Yoni", factorMr: "योनि", maxPoints: 4, scored: matchYoni(boyNakIndex, girlNakIndex), description: "शारीरिक सुसंगतता" },
    { factor: "Graha Maitri", factorMr: "ग्रह मैत्री", maxPoints: 5, scored: matchGrahaMaitri(boyRashiIndex, girlRashiIndex), description: "मानसिक सुसंगतता" },
    { factor: "Gana", factorMr: "गण", maxPoints: 6, scored: matchGana(boyNakIndex, girlNakIndex), description: "स्वभाव सुसंगतता" },
    { factor: "Bhakoot", factorMr: "भकूट", maxPoints: 7, scored: matchBhakoot(boyRashiIndex, girlRashiIndex), description: "परस्पर प्रभाव" },
    { factor: "Nadi", factorMr: "नाडी", maxPoints: 8, scored: matchNadi(boyNakIndex, girlNakIndex), description: "आरोग्य व वंश" },
  ];

  const totalPoints = factors.reduce((sum, f) => sum + f.scored, 0);
  const maxPoints = 36;
  const percentage = Math.round((totalPoints / maxPoints) * 100);

  let verdict = "";
  let verdictMr = "";
  if (totalPoints >= 28) { verdict = "Excellent Match"; verdictMr = "उत्तम जोडी"; }
  else if (totalPoints >= 21) { verdict = "Very Good Match"; verdictMr = "अतिशय चांगली जोडी"; }
  else if (totalPoints >= 18) { verdict = "Good Match"; verdictMr = "चांगली जोडी"; }
  else if (totalPoints >= 14) { verdict = "Average Match"; verdictMr = "सामान्य जोडी"; }
  else { verdict = "Not Recommended"; verdictMr = "विवाह योग्य नाही"; }

  return {
    boyNakshatra: NAKSHATRAS[boyNakIndex].mr,
    girlNakshatra: NAKSHATRAS[girlNakIndex].mr,
    boyRashi: RASHIS[boyRashiIndex].mr,
    girlRashi: RASHIS[girlRashiIndex].mr,
    totalPoints,
    maxPoints,
    percentage,
    verdict,
    verdictMr,
    factors,
  };
}
