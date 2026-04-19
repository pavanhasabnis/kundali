"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";
import { KundliChatDrawer } from "@/components/kundli-chat-drawer";

// Re-use all the same interfaces
interface PlanetData { id: string; nameMr: string; name: string; rashiMr: string; rashi: string; degreeDMS: string; nakshatraMr: string; nakshatra: string; nakshatraLord: string; pada: number; house: number; isRetrograde: boolean; }
interface ChartPlanetData { id: string; name: string; nameMr: string; rashiIndex: number; rashi: string; rashiMr: string; house: number; degreeInSign: number; isRetrograde: boolean; }
interface DivisionalChartData { id: string; name: string; nameMr: string; planets: ChartPlanetData[]; }
interface AntarDashaData { lord: string; startDate: string; endDate: string; years: number; }
interface DashaData { lord: string; startDate: string; endDate: string; years: number; antardashas: AntarDashaData[]; }
interface PlanetStrengthData { id: string; nameMr: string; nameEn: string; dignity: string; dignityMr: string; dignityEn: string; isRetrograde: boolean; isCombust: boolean; house: number; strengthScore: number; }
interface YogaData { nameMr: string; nameEn: string; descriptionMr: string; descriptionEn: string; type: "benefic" | "malefic" | "neutral"; strength: "strong" | "moderate" | "weak"; }
interface DoshaData { nameMr: string; nameEn: string; present: boolean; severity: string; descriptionMr: string; descriptionEn: string; remedyMr: string; remedyEn: string; }
interface HousePredictionData { house: number; titleMr: string; titleEn: string; iconLabel: string; predictionMr: string; predictionEn: string; rating: number; }
interface DashaInterpData { lordMr: string; lordEn: string; periodMr: string; periodEn: string; careerMr: string; careerEn: string; financeMr: string; financeEn: string; healthMr: string; healthEn: string; relationshipMr: string; relationshipEn: string; adviceMr: string; adviceEn: string; }
interface RemedyData { categoryMr: string; categoryEn: string; items: { mr: string; en: string }[]; }
interface EnhancementsData {
  birthPanchang: { day: string; sunrise: string; sunset: string; dinman: string; tithi: string; paksha: string; yoga: string; karana: string; masa: string; shakaSamvat: number; nakshatraPayaMr: string; nakshatraPayaEn: string };
  rashiAkshar: string;
  balanceDasha: { lordMr: string; lordEn: string; years: number; months: number; days: number };
  ashtottariBalance: { lordMr: string; lordEn: string; years: number; months: number; days: number; totalYears: number };
  sadeSati: { active: boolean; phase: string; phaseMr: string; phaseEn: string; descriptionMr: string; descriptionEn: string };
  pitraDosha: { present: boolean; reasonMr: string; reasonEn: string };
  luckyItems: { gemstone: { mr: string; en: string; planet: string }; color: { mr: string; en: string }; number: number; day: { mr: string; en: string }; direction: { mr: string; en: string }; metal: { mr: string; en: string } };
  combustion: { id: string; isCombust: boolean; distance: number }[];
  houseLords: { house: number; rashiMr: string; rashiEn: string; subjectMr: string; subjectEn: string; lordId: string; lordMr: string; lordEn: string; lordHouse: number; lordRashiMr: string; lordStrengthMr: string; lordStrengthEn: string }[];
  aspects: { fromId: string; toId: string; type: string; aspectHouse: number; descriptionMr: string; descriptionEn: string }[];
  vargottam: { id: string; nameMr: string; nameEn: string; rashiMr: string; rashiEn: string; descriptionMr: string; descriptionEn: string }[];
  bhavSandhi: { house: number; cuspDegree: number; cuspDMS: string; rashiMr: string; rashiEn: string }[];
  houseShifts: { planetId: string; planetMr: string; d1House: number; chalitHouse: number; shifted: boolean }[];
  chandraYogas: { nameMr: string; nameEn: string; present: boolean; descriptionMr: string; descriptionEn: string; type: string }[];
  lagnaAnalysis: { rashiDescMr: string; rashiDescEn: string; lagnaLordPositionMr: string; lagnaLordPositionEn: string };
  mentalTemperament: { descriptionMr: string; descriptionEn: string; moonStrengthMr: string; moonStrengthEn: string };
  marriageAnalysis: { venusMr: string; venusEn: string; seventhMr: string; seventhEn: string; timingMr: string; timingEn: string };
  careerAnalysis: { careerTypeMr: string; careerTypeEn: string; jobOrBusinessMr: string; jobOrBusinessEn: string };
  childrenAnalysis: { yogaMr: string; yogaEn: string; timingMr: string; timingEn: string };
  housePredictions?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  planetBhavaPredictions?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  planetRashiPredictions?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  nakshatraDeep?: { mr: string; en: string } | null;
  lagnaLifeAreas?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  panchangFal?: {
    tithi: { mr: string; en: string } | null;
    vaar: { mr: string; en: string } | null;
    masa: { mr: string; en: string } | null;
    ritu: { mr: string; en: string } | null;
  };
}

interface MangalDoshData {
  present: boolean; severity: string;
  severityMr: string; severityEn: string; severityHi: string;
  fromLagna: boolean; fromMoon: boolean; fromVenus: boolean;
  marsHouse: number; marsRashi: string; marsRashiMr: string;
  cancellations: string[]; cancellationsMr: string[]; cancellationsHi: string[];
  affectedAreasMr: string[]; affectedAreasEn: string[]; affectedAreasHi: string[];
  remediesMr: string[]; remediesEn: string[]; remediesHi: string[];
  summaryMr: string; summaryEn: string; summaryHi: string;
}

interface KalsarpDoshData {
  present: boolean; partial: boolean; type: string | null;
  typeMr: string; typeEn: string; typeHi: string;
  rahuHouse: number; ketuHouse: number; udit: boolean; planetsOutside: string[];
  effectsEn: string; effectsMr: string; effectsHi: string;
  remediesEn: string[]; remediesMr: string[]; remediesHi: string[];
  yatraRecommendationEn: string; yatraRecommendationMr: string; yatraRecommendationHi: string;
  summaryEn: string; summaryMr: string; summaryHi: string;
}

interface ShadBalaPlanetData {
  id: string; nameMr: string; nameEn: string;
  sthana: number; dig: number; kala: number; chesta: number; naisargika: number; drik: number;
  total: number; totalPoints: number; required: number;
  isStrong: boolean; strengthRank: number; percentOfRequired: number;
  verdict: string; verdictMr: string; verdictEn: string; verdictHi: string;
  remediesMr?: string[]; remediesEn?: string[]; remediesHi?: string[];
}

interface BhinnashtakaChartData {
  planetId: string; planetMr: string; planetEn: string;
  bindus: number[]; total: number;
  contributions: Record<string, number[]>;
}
interface AshtakvargaData {
  bhinnashtaka: BhinnashtakaChartData[];
  sarvashtaka: number[];
  sarvashtakaTotal: number;
  rashiNames: { mr: string; en: string }[];
  strongestRashi: { index: number; mr: string; en: string; bindus: number };
  weakestRashi: { index: number; mr: string; en: string; bindus: number };
  houseStrength: Array<{
    house: number; rashiIndex: number;
    rashiMr: string; rashiEn: string; sav: number;
    verdict: string; verdictMr: string; verdictEn: string; verdictHi: string;
    remediesMr?: string[]; remediesEn?: string[]; remediesHi?: string[];
  }>;
  summaryMr: string; summaryEn: string; summaryHi: string;
}

interface SbcTransitPlanetData {
  id: string; nameMr: string; nameEn: string; nameHi: string;
  nakshatraIndex: number; nakshatraMr: string; nakshatraEn: string;
  offsetFromNatal: number;
  vedhaType: string | null; vedhaTypeMr: string | null; vedhaTypeEn: string | null; vedhaTypeHi: string | null;
  isBenefic: boolean;
  effect: "auspicious" | "inauspicious" | "neutral";
}
interface SbcGridCellData {
  nakshatraIndex: number; nakshatraMr: string; nakshatraEn: string;
  isNatal: boolean; isVedhaPosition: boolean; vedhaType: string | null;
  transitPlanets: string[];
}
interface SarvatobhadraData {
  natalNakshatraIndex: number;
  natalNakshatraMr: string; natalNakshatraEn: string; natalNakshatraHi: string;
  transits: SbcTransitPlanetData[];
  grid: SbcGridCellData[];
  auspiciousCount: number; inauspiciousCount: number; neutralCount: number;
  rating: number;
  verdict: string; verdictMr: string; verdictEn: string; verdictHi: string;
  remediesMr?: string[]; remediesEn?: string[]; remediesHi?: string[];
  summaryMr: string; summaryEn: string; summaryHi: string;
}

interface ShadBalaData {
  planets: ShadBalaPlanetData[];
  strongestEn: string; strongestMr: string;
  weakestEn: string; weakestMr: string;
  summaryMr: string; summaryEn: string; summaryHi: string;
}

interface KundliData {
  lagnaRashiIndex: number;
  lagnaRashiMr: string; lagnaRashi: string; lagnaDMS: string; lagnaNakshatraMr: string; lagnaNakshatra: string;
  moonRashiMr: string; moonRashi: string; moonRashiIndex: number; moonNakshatraMr: string; moonNakshatra: string; moonNakshatraIndex: number; moonNakshatraLord: string; moonPada: number; ayanamsa: number;
  planets: PlanetData[]; dashas: DashaData[];
  analysis: { planetaryStrength: PlanetStrengthData[]; yogas: YogaData[]; doshas: DoshaData[]; housePredictions: HousePredictionData[]; currentDasha: DashaInterpData | null; remedies: RemedyData[]; };
  divisionalCharts: DivisionalChartData[];
  enhancements?: EnhancementsData;
  mangalDosh?: MangalDoshData;
  kalsarpDosh?: KalsarpDoshData;
  shadBala?: ShadBalaData;
  ashtakvarga?: AshtakvargaData;
  sarvatobhadra?: SarvatobhadraData;
  jaimini?: JaiminiData;
  mitraShatru?: MitraShatruData[];
  grahaYuddha?: GrahaYuddhaData[];
  combustionDetails?: CombustionDetailData[];
  bhavaBala?: BhavaBalaData[];
  marriageTiming?: MarriageTimingData;
  careerTiming?: CareerTimingData;
  deepDasha?: DeepDashaData;
  namesSuggestion?: NamesSuggestionData;
  upagrahas?: UpagrahaData[];
  gocharNaadi?: GocharTransitData[];
  vimshopakBala?: VimshopakPlanetData[];
}

interface VimshopakVargaEntryData {
  vargaId: string; vargaMr: string; vargaEn: string;
  weight: number; rashiIndex: number;
  dignity: string; dignityMr: string; dignityEn: string;
  factor: number; score: number;
}

interface VimshopakPlanetData {
  id: string; nameMr: string; nameEn: string;
  vargas: VimshopakVargaEntryData[];
  totalBala: number; percent: number;
  verdict: string; verdictMr: string; verdictEn: string; verdictHi: string;
}

interface UpagrahaData {
  id: string; nameMr: string; nameEn: string; nameHi: string;
  siderealLongitude: number;
  rashiIndex: number; rashiMr: string; rashiEn: string;
  degreeInSign: number; degreeDMS: string;
  house: number; kalaIndex: number; isDayBirth: boolean;
  descMr: string; descEn: string; descHi: string;
}

interface GocharTransitData {
  id: string; nameMr: string; nameEn: string; nameHi: string;
  currentRashiIndex: number;
  currentRashiMr: string; currentRashiEn: string;
  houseFromLagna: number; houseFromMoon: number;
  effect: string;
  effectMr: string; effectEn: string; effectHi: string;
}

interface DeepDashaPeriodData {
  lord: string; lordMr: string;
  startDate: string; endDate: string;
  durationDays: number; isCurrent: boolean;
  sookshmas?: DeepDashaPeriodData[];
}

interface DeepDashaData {
  currentMahadasha: { lord: string; lordMr: string; startDate: string; endDate: string };
  currentAntardasha: { lord: string; lordMr: string; startDate: string; endDate: string };
  currentPratyantar: DeepDashaPeriodData | null;
  currentSookshma: DeepDashaPeriodData | null;
  pratyantars: DeepDashaPeriodData[];
  nextMilestoneMr: string; nextMilestoneEn: string; nextMilestoneHi: string;
}

interface NameEntryData {
  name: string; nameEn: string; gender: string;
  meaningMr: string; meaningEn: string;
}

interface NamesSuggestionData {
  primaryAkshara: string;
  allAksharas: string[];
  boyNames: NameEntryData[];
  girlNames: NameEntryData[];
  unisexNames: NameEntryData[];
}

interface TimingWindowData {
  startDate: string; endDate: string;
  mahadashaLord: string; mahadashaLordMr: string;
  antardashaLord: string; antardashaLordMr: string;
  score: number;
  reasonMr: string; reasonEn: string; reasonHi: string;
  ageAtStart: number;
}

interface MarriageTimingData {
  windows: TimingWindowData[];
  primaryKarakaMr: string; primaryKarakaEn: string;
  seventhLordMr: string; seventhLordEn: string; seventhLordHouse: number;
  seventhLordStrength: string;
  predictedAgeRange: string; predictedAgeRangeEn: string;
  overallMr: string; overallEn: string; overallHi: string;
  remediesMr: string[]; remediesEn: string[]; remediesHi: string[];
}

interface CareerTimingData {
  windows: TimingWindowData[];
  tenthLordMr: string; tenthLordEn: string; tenthLordHouse: number;
  fieldSuggestionsMr: string[]; fieldSuggestionsEn: string[]; fieldSuggestionsHi: string[];
  overallMr: string; overallEn: string; overallHi: string;
}

interface GrahaYuddhaData {
  planet1: string; planet1Mr: string;
  planet2: string; planet2Mr: string;
  distance: number;
  winner: string; winnerMr: string;
  loser: string; loserMr: string;
  rashiMr: string; rashiEn: string;
  reasonMr: string; reasonEn: string; reasonHi: string;
  effectMr: string; effectEn: string; effectHi: string;
}

interface CombustionDetailData {
  id: string; nameMr: string; nameEn: string;
  isCombust: boolean;
  distance: number; threshold: number;
  severity: string;
  severityMr: string; severityEn: string; severityHi: string;
  effectMr: string; effectEn: string; effectHi: string;
  remedyMr: string; remedyEn: string; remedyHi: string;
}

interface BhavaBalaData {
  house: number; rashiIndex: number;
  rashiMr: string; rashiEn: string;
  subjectMr: string; subjectEn: string;
  bhavAdhipati: number; bhavDig: number; bhavDrishti: number;
  total: number;
  verdict: string; verdictMr: string; verdictEn: string; verdictHi: string;
}

interface JaiminiData {
  atmakarakaId: string;
  atmakarakaNameMr: string; atmakarakaNameEn: string;
  atmakarakaRashiMr: string; atmakarakaRashiEn: string;
  atmakarakaDegree: number;
  karakamshaRashiIndex: number;
  karakamshaRashiMr: string; karakamshaRashiEn: string;
  ishtaDevataRashiIndex: number;
  ishtaDevataRashiMr: string; ishtaDevataRashiEn: string;
  ishtaDevataMr: string; ishtaDevataEn: string; ishtaDevataHi: string;
  mantraMr: string; mantraEn: string;
  significanceMr: string; significanceEn: string; significanceHi: string;
  charakarakas: Array<{ id: string; nameMr: string; nameEn: string; karakaMr: string; karakaEn: string; role: string; roleMr: string; degree: number }>;
}

interface MitraShatruData {
  planetId: string; planetMr: string; planetEn: string;
  relations: Array<{
    otherId: string; otherMr: string; otherEn: string;
    naisargika: string; naisargikaEn: string;
    tatkalik: string; tatkalikEn: string;
    panchadha: string; panchadhaEn: string;
  }>;
}

const PLANET_LORD_MR: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };

// Rashi → ruling planet (English id)
const RASHI_LORD_EN = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
// Nakshatra-indexed attribute tables (0..26). Mirrors lib/astrology/constants.ts.
const NAK_VARNA = [1,1,2,2,2,3,3,0,0, 1,1,1,2,2,3,3,0,0, 1,1,1,2,2,3,3,0,0];
const NAK_YONI = [0,1,2,3,3,4,5,2,5, 6,6,7,8,9,8,9,10,10, 4,11,12,11,13,0,13,7,1];
const NAK_GANA = [0,1,2,1,0,1,0,0,2, 2,1,1,0,2,0,2,0,2, 2,1,1,0,2,2,1,1,0];
const NAK_NADI = [0,1,2,2,1,0,0,1,2, 0,1,2,2,1,0,0,1,2, 0,1,2,2,1,0,0,1,2];
const VARNA_MR = ["ब्राह्मण","क्षत्रिय","वैश्य","शूद्र"];
const YONI_MR = ["अश्व","गज","मेष","सर्प","श्वान","मार्जार","मूषक","गो","महिष","व्याघ्र","मृग","वानर","नकुल","सिंह"];
const GANA_MR = ["देव","मनुष्य","राक्षस"];
const NADI_MR = ["आदि","मध्य","अंत्य"];

const MARATHI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMr(val: string | number): string {
  return String(val).replace(/[0-9]/g, (d) => MARATHI_DIGITS[parseInt(d)]);
}

// Transliterate English name to Devanagari (Marathi)
function toDevanagari(input: string): string {
  const cMap: [string, string][] = [
    ['ksh', 'क्ष'], ['gny', 'ज्ञ'], ['tr', 'त्र'],
    ['chh', 'छ'], ['shh', 'ष'],
    ['kh', 'ख'], ['gh', 'घ'],
    ['ch', 'च'], ['jh', 'झ'],
    ['th', 'थ'], ['dh', 'ध'],
    ['ph', 'फ'], ['bh', 'भ'],
    ['sh', 'श'],
    ['k', 'क'], ['g', 'ग'],
    ['c', 'क'], ['j', 'ज'],
    ['t', 'त'], ['d', 'द'], ['n', 'न'],
    ['p', 'प'], ['b', 'ब'], ['m', 'म'],
    ['y', 'य'], ['r', 'र'], ['l', 'ल'],
    ['v', 'व'], ['w', 'व'],
    ['s', 'स'], ['h', 'ह'],
    ['f', 'फ'], ['z', 'ज़'], ['q', 'क़'],
  ];
  const vMap: [string, string, string][] = [
    ['aa', 'आ', 'ा'], ['ee', 'ई', 'ी'], ['oo', 'ऊ', 'ू'],
    ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'],
    ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'],
    ['e', 'ए', 'े'], ['o', 'ओ', 'ो'],
  ];
  return input.split(/(\s+)/).map(word => {
    if (/^\s+$/.test(word)) return word;
    let res = '', i = 0;
    const s = word.toLowerCase();
    while (i < s.length) {
      if (!/[a-z]/.test(s[i])) { res += word[i]; i++; continue; }
      let cm = false;
      for (const [cp, cd] of cMap) {
        if (s.substring(i, i + cp.length) === cp) {
          const vi = i + cp.length;
          let vm2 = false;
          for (const [vp, , vm] of vMap) {
            if (s.substring(vi, vi + vp.length) === vp) {
              res += cd + (vp === 'a' && vi + vp.length === s.length ? 'ा' : vm);
              i = vi + vp.length; vm2 = true; break;
            }
          }
          if (!vm2) { res += cd + (vi >= s.length ? '' : '्'); i += cp.length; }
          cm = true; break;
        }
      }
      if (!cm) {
        let vm2 = false;
        for (const [vp, vs] of vMap) {
          if (s.substring(i, i + vp.length) === vp) { res += vs; i += vp.length; vm2 = true; break; }
        }
        if (!vm2) { res += word[i]; i++; }
      }
    }
    return res;
  }).join('');
}

const TABS = [
  { id: "all-charts", mr: "सर्व कुंडली", en: "All Charts", group: "charts" },
  { id: "chart", mr: "लग्न कुंडली", en: "Birth Chart", group: "charts" },
  { id: "chandra", mr: "चंद्र कुंडली", en: "Moon Chart", group: "charts" },
  { id: "navamsha", mr: "नवमांश (D9)", en: "Navamsha (D9)", group: "charts" },
  { id: "bhav-chalit", mr: "भाव चलित", en: "Bhav Chalit", group: "charts" },
  { id: "dashamsha", mr: "दशमांश (D10)", en: "Dashamsha (D10)", group: "charts" },
  { id: "saptamsha", mr: "सप्तांश (D7)", en: "Saptamsha (D7)", group: "charts" },
  { id: "dwadashamsha", mr: "द्वादशांश (D12)", en: "Dwadashamsha (D12)", group: "charts" },
  { id: "shodashamsha", mr: "षोडशांश (D16)", en: "Shodashamsha (D16)", group: "charts" },
  { id: "trimshamsha", mr: "त्रिंशांश (D30)", en: "Trimshamsha (D30)", group: "charts" },
  { id: "planets", mr: "ग्रह स्पष्ट", en: "Planet Positions", group: "analysis" },
  { id: "strength", mr: "ग्रह बल", en: "Planet Strength", group: "analysis" },
  { id: "yogas", mr: "योग", en: "Yogas", group: "analysis" },
  { id: "doshas", mr: "दोष", en: "Doshas", group: "analysis" },
  { id: "mangal-dosh", mr: "मंगळ दोष", en: "Mangal Dosh", group: "analysis" },
  { id: "kalsarp-dosh", mr: "काळसर्प दोष", en: "Kalsarp Dosh", group: "analysis" },
  { id: "shadbala", mr: "षड्बल", en: "Shadbala", group: "analysis" },
  { id: "ashtakvarga", mr: "अष्टकवर्ग", en: "Ashtakvarga", group: "analysis" },
  { id: "sarvatobhadra", mr: "सर्वतोभद्र चक्र", en: "Sarvatobhadra Chakra", group: "analysis" },
  { id: "birth-panchang", mr: "जन्म पंचांग", en: "Birth Panchang", group: "analysis" },
  { id: "jaimini", mr: "आत्मकारक व इष्टदेवता", en: "Atmakaraka & Ishta Devata", group: "analysis" },
  { id: "mitra-shatru", mr: "मित्र-शत्रु चक्र", en: "Mitra-Shatru Chakra", group: "analysis" },
  { id: "asta-yuddha", mr: "अस्त-युद्ध तपशील", en: "Combustion & Planetary War", group: "analysis" },
  { id: "bhava-bala", mr: "भाव बल", en: "Bhava Bala", group: "analysis" },
  { id: "marriage-timing", mr: "विवाह काल", en: "Marriage Timing", group: "analysis" },
  { id: "career-timing", mr: "करिअर काल", en: "Career Timing", group: "analysis" },
  { id: "deep-dasha", mr: "प्रत्यंतर व सूक्ष्म दशा", en: "Pratyantar & Sookshma", group: "analysis" },
  { id: "names", mr: "राशी अक्षर व नावसूचना", en: "Nakshatra Letters & Names", group: "analysis" },
  { id: "upagrahas", mr: "उपग्रह", en: "Upagrahas", group: "analysis" },
  { id: "gochar-naadi", mr: "गोचर नाडी", en: "Gochar Naadi (Transits)", group: "analysis" },
  { id: "vimshopak-bala", mr: "विंशोपक बल", en: "Vimshopak Bala", group: "analysis" },
  { id: "predictions", mr: "भविष्यकथन", en: "Predictions", group: "analysis" },
  { id: "dasha", mr: "चालू दशा फल", en: "Current Dasha", group: "analysis" },
  { id: "timeline", mr: "दशा कालावधी", en: "Dasha Timeline", group: "analysis" },
  { id: "remedies", mr: "उपाय", en: "Remedies", group: "analysis" },
];

const PrintHeaderContent = () => (
  <div className="print-page-header">
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src="/logos/navbar-dark-mr.svg" alt="भाग्यवेध" style={{ height: "28px", width: "auto" }} />
    </div>
    <div style={{ color: "#d4a843", fontSize: "10px", opacity: 0.5 }}>॥ श्री गणेशाय नमः ॥</div>
  </div>
);

const PrintFooterContent = () => (
  <div className="print-page-footer">
    <span style={{ color: "#d4a843", fontSize: "9px", fontWeight: 700, letterSpacing: "2px" }}>Bhaagyavedh</span>
    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px" }}>bhaagyavedh.com</span>
  </div>
);

function PrintPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-page">
      <PrintHeaderContent />
      <div className="print-page-content">{children}</div>
      <PrintFooterContent />
    </div>
  );
}

function PrintChartsPages({ planets, divisionalCharts, lagnaRashi }: { planets: PlanetData[]; divisionalCharts: DivisionalChartData[]; lagnaRashi: number }) {
  const { t } = useLang();
  const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
    const map: Record<number, typeof planetList> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
    return map;
  };
  const allCharts = [
    { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: buildHouseMap(planets), label: t("लग्न", "Asc"), lagnaRashi },
    ...divisionalCharts.map(c => ({
      id: c.id, name: t(c.nameMr, c.name), houseMap: buildHouseMap(c.planets),
      label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
      lagnaRashi: getChartLagnaRashi(c.planets),
    })),
  ];
  // Split into chunks of 4 charts per page
  const chunks: typeof allCharts[] = [];
  for (let i = 0; i < allCharts.length; i += 4) {
    chunks.push(allCharts.slice(i, i + 4));
  }
  return (
    <>
      {chunks.map((chunk, ci) => (
        <PrintPage key={ci}>
          {ci === 0 && <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "12px" }}>{t("सर्व कुंडली चार्ट", "All Kundli Charts")}</h2>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {chunk.map((chart) => (
              <div key={chart.id} style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#3d0c0c", marginBottom: "6px" }}>{chart.name}</h3>
                <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
              </div>
            ))}
          </div>
        </PrintPage>
      ))}
    </>
  );
}

function KundliResultContent() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all-charts");
  const [nameMr, setNameMr] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const savedRef = useRef(false);
  const fetchedRef = useRef(false);

  // Auth + limit check
  useEffect(() => {
    async function check() {
      // Admin preview flow: skip auth + limit entirely
      if (searchParams.get("admin") === "1") {
        setUserPlan("admin");
        setAuthChecked(true);
        return;
      }
      // View-mode: loading an already-saved kundli from account list — skip limit gate
      const isViewMode = !!searchParams.get("view");
      try {
        const sRes = await fetch("/api/user");
        const sData = await sRes.json();
        if (!sData?.user?.email) {
          router.replace("/kundli");
          return;
        }
        setUserPlan(sData.user.plan || "free");

        // Check kundli count for free users (skip for admin/premium + view mode)
        if (!isViewMode && (!sData.user.plan || sData.user.plan === "free")) {
          const kRes = await fetch("/api/user/kundlis");
          const kData = await kRes.json();
          const count = kData.kundlis?.length || 0;
          if (count >= 1) {
            setLimitReached(true);
            setLoading(false);
            return;
          }
        }
        setAuthChecked(true);
      } catch {
        router.replace("/kundli");
      }
    }
    check();
  }, [router, searchParams]);

  const name = searchParams.get("name") || "";

  // Fetch Marathi transliteration of name + set PDF filename via document title
  useEffect(() => {
    if (!name) return;
    fetch(`/api/transliterate?text=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(d => {
        if (d.result) {
          setNameMr(d.result);
          document.title = `${d.result} — कुंडली | Bhaagyavedh`;
        }
      })
      .catch(() => {
        const fallback = toDevanagari(name);
        setNameMr(fallback);
        document.title = `${fallback} — कुंडली | Bhaagyavedh`;
      });
    // Set English title immediately as fallback
    document.title = `${name} — Kundli | Bhaagyavedh`;
  }, [name]);

  useEffect(() => {
    if (!authChecked) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function fetchKundli() {
      setLoading(true);
      try {
        const res = await fetch("/api/kundli", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: parseInt(searchParams.get("year") || "2000"),
            month: parseInt(searchParams.get("month") || "1"),
            day: parseInt(searchParams.get("day") || "1"),
            hour: parseInt(searchParams.get("hour") || "12"),
            minute: parseInt(searchParams.get("minute") || "0"),
            latitude: parseFloat(searchParams.get("lat") || "18.52"),
            longitude: parseFloat(searchParams.get("lng") || "73.85"),
            timezone: parseFloat(searchParams.get("tz") || "5.5"),
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResult(data);

        // Auto-save kundli to DB (once per mount). Skip for admin-generated runs, view-mode (already saved), and when no name given.
        const isAdminRun = searchParams.get("admin") === "1";
        const isViewMode = !!searchParams.get("view");
        const hasName = !!searchParams.get("name");
        if (!savedRef.current && !isAdminRun && !isViewMode && hasName) {
          savedRef.current = true;
          try {
            const day = searchParams.get("day") || "1";
            const month = searchParams.get("month") || "1";
            const year = searchParams.get("year") || "2000";
            const hour = searchParams.get("hour") || "12";
            const minute = searchParams.get("minute") || "0";
            await fetch("/api/user/kundlis", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: searchParams.get("name") || "Unknown",
                dateOfBirth: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
                birthTime: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
                birthPlace: searchParams.get("place") || "",
                latitude: searchParams.get("lat") || "",
                longitude: searchParams.get("lng") || "",
                resultJson: data,
              }),
            });
          } catch { /* save failed silently */ }
        }
      } catch {
        setError(t("कुंडली गणना करताना त्रुटी आली.", "Error calculating Kundli."));
      } finally {
        setLoading(false);
      }
    }
    fetchKundli();
  }, [searchParams, t, authChecked]);

  if (limitReached) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#d4a843]/20 overflow-hidden">
          <div className="px-6 py-5 text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
            <h2 className="text-xl font-bold text-[#d4a843]">
              {t("मोफत कुंडली मर्यादा संपली", "Free Kundli Limit Reached")}
            </h2>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-[#5c1a1a]/70 mb-2">
              {t("तुम्ही तुमची १ मोफत कुंडली आधीच बनवली आहे.", "You have already used your 1 free kundli.")}
            </p>
            <p className="text-sm text-[#5c1a1a]/70 mb-6">
              {t("अधिक कुंडल्या बनवण्यासाठी प्रीमियम प्लॅन घ्या.", "Upgrade to premium plan to generate more kundlis.")}
            </p>
            <div className="flex gap-3">
              <button onClick={() => router.push("/account")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
                {t("प्रीमियम प्लॅन पहा", "View Premium Plans")}
              </button>
              <button onClick={() => router.push("/kundli")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-[#5c1a1a]/60 hover:bg-gray-50">
                {t("मागे जा", "Go Back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-stone-500">{t("कुंडली गणना चालू आहे...", "Calculating Kundli...")}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return <div className="text-center py-20 text-red-600">{error || t("कुंडली उपलब्ध नाही", "Kundli not available")}</div>;
  }

  return (
    <div className="bg-[#FAFAF8]">
      {/* Basic Info Header — full width */}
      <div className="no-print text-white px-6 py-5" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">
              {nameMr || name ? `${nameMr || name} — ` : ""}{t("कुंडली", "Kundli")}
            </h1>
            <div className="flex gap-2">
              {/* Save Kundli */}
              <button onClick={async () => {
                // Save to localStorage
                const saved = JSON.parse(localStorage.getItem("savedKundlis") || "[]");
                const entry = { name: name || t("कुंडली", "Kundli"), date: new Date().toISOString(), params: Object.fromEntries(searchParams.entries()) };
                const exists = saved.findIndex((s: { name: string }) => s.name === entry.name);
                if (exists >= 0) saved[exists] = entry; else saved.push(entry);
                localStorage.setItem("savedKundlis", JSON.stringify(saved));

                // Also save to DB for logged-in users
                try {
                  const p = Object.fromEntries(searchParams.entries());
                  const dob = `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`;
                  const birthTime = `${String(p.hour).padStart(2,"0")}:${String(p.minute).padStart(2,"0")}`;
                  await fetch("/api/user/kundlis", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: name || "Kundli",
                      dateOfBirth: dob,
                      birthTime,
                      birthPlace: p.place || "",
                      latitude: parseFloat(p.lat || "0"),
                      longitude: parseFloat(p.lng || "0"),
                      resultJson: result,
                    }),
                  });
                } catch { /* not logged in — ignore */ }

                alert(t("कुंडली सेव्ह झाली!", "Kundli saved!"));
              }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(212,168,67,0.2)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" }}>
                {t("सेव्ह करा", "Save")}
              </button>
              {/* PDF Download */}
              <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(212,168,67,0.2)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" }}>
                {t("PDF", "PDF")}
              </button>
              {/* WhatsApp Share */}
              <button onClick={() => {
                const url = window.location.href;
                const text = `${name ? name + " — " : ""}${t("कुंडली", "Kundli")}%0A${t("लग्न", "Asc")}: ${t(result.lagnaRashiMr, result.lagnaRashi)}%0A${t("राशी", "Moon")}: ${t(result.moonRashiMr, result.moonRashi)}%0A${t("नक्षत्र", "Nak")}: ${t(result.moonNakshatraMr, result.moonNakshatra)}%0A%0A${url}`;
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(37,211,102,0.2)", color: "#25d366", border: "1px solid rgba(37,211,102,0.3)" }}>
                {t("WhatsApp", "WhatsApp")}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("लग्न", "Ascendant")}</p>
              <p className="font-bold">{t(result.lagnaRashiMr, result.lagnaRashi)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("राशी (चंद्र)", "Moon Sign")}</p>
              <p className="font-bold">{t(result.moonRashiMr, result.moonRashi)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र", "Nakshatra")}</p>
              <p className="font-bold">{t(result.moonNakshatraMr, result.moonNakshatra)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र स्वामी", "Nakshatra Lord")}</p>
              <p className="font-bold">{t(PLANET_LORD_MR[result.moonNakshatraLord] || result.moonNakshatraLord, result.moonNakshatraLord)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="no-print md:hidden overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 scrollbar-hide">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id ? "bg-[#5c1a1a] text-white" : "bg-stone-100 text-stone-600"
              }`}>
              {t(tab.mr, tab.en)}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar + Content (hidden during print — print-only section below renders all) */}
      <div className="max-w-7xl mx-auto flex gap-6 px-6 mt-6 pb-12 no-print">
        {/* Left Sidebar */}
        <div className="w-56 shrink-0 hidden md:block no-print">
          <div className="sticky top-20 bg-white rounded-xl border border-stone-200 overflow-hidden py-1 mb-6">
            <p className="px-4 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t("कुंडली","Charts")}</p>
            {TABS.filter(tab => tab.group === "charts").map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-1.5 text-xs transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FFF8E7] text-[#5c1a1a] font-semibold border-l-3 border-l-[#8b2c2c]"
                    : "text-stone-600 hover:bg-stone-50 border-l-3 border-l-transparent"
                }`}>
                {t(tab.mr, tab.en)}
              </button>
            ))}
            <div className="border-t border-stone-200 my-1" />
            <p className="px-4 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t("विश्लेषण","Analysis")}</p>
            {TABS.filter(tab => tab.group === "analysis").map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-1.5 text-xs transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FFF8E7] text-[#5c1a1a] font-semibold border-l-3 border-l-[#8b2c2c]"
                    : "text-stone-600 hover:bg-stone-50 border-l-3 border-l-transparent"
                }`}>
                {t(tab.mr, tab.en)}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content — Patrika Page Style */}
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden"
            style={{
              background: "#fffdf7",
              borderLeft: "1px solid rgba(212,168,67,0.15)",
              borderRight: "1px solid rgba(212,168,67,0.12)",
              boxShadow: "4px 4px 20px rgba(0,0,0,0.06), -1px 0 3px rgba(0,0,0,0.03)",
              minHeight: "80vh",
            }}>
            {/* Page edge effect — left margin line like real notebook */}
            <div className="absolute left-10 top-0 bottom-0 w-px" style={{ background: "rgba(212,168,67,0.12)" }} />
            {/* Subtle page texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"4\" height=\"4\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"1\" height=\"1\" fill=\"%23000\"/%3E%3C/svg%3E')", backgroundSize: "4px 4px" }} />

            {/* Patrika Header */}
            <div className="relative text-center py-4 px-6" style={{ borderBottom: "1px solid rgba(212,168,67,0.12)" }}>
              <p className="text-xs tracking-[0.15em]" style={{ color: "rgba(139,44,44,0.4)" }}>॥ श्री गणेशाय नमः ॥</p>
              <div className="w-24 h-px mx-auto mt-2" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.25), transparent)" }} />
            </div>

            {/* Content */}
            <div className="relative p-6 pl-14">
              {activeTab === "all-charts" && <AllChartsGrid planets={result.planets} divisionalCharts={result.divisionalCharts} lagnaRashi={result.lagnaRashiIndex} />}
              {activeTab === "chart" && <ChartSection planets={result.planets} lagnaRashi={result.lagnaRashiIndex} />}
              {activeTab === "chandra" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "chandra")} description={t("चंद्र कुंडलीमध्ये भाव चंद्राच्या राशीपासून मोजले जातात. हे मानसिक स्थिती, भावना आणि लोकप्रियता दर्शवते.","In Chandra Kundli, houses are counted from Moon sign. It shows mental disposition, emotions, and public image.")} />}
              {activeTab === "navamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "navamsha")} description={t("नवमांश कुंडली विवाह, भाग्य आणि आध्यात्मिक प्रगती दर्शवते. हा सर्वात महत्त्वाचा वर्ग चार्ट आहे.","Navamsha chart reveals marriage, fortune, and spiritual progress. This is the most important divisional chart.")} />}
              {activeTab === "bhav-chalit" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "bhav-chalit")} description={t("भाव चलित कुंडलीमध्ये ग्रह भाव मध्यबिंदूनुसार स्थानांतरित होऊ शकतात. भविष्यवाणीसाठी हे अधिक अचूक आहे.","In Bhav Chalit, planets may shift houses based on cusp midpoints. This is more accurate for predictions.")} />}
              {activeTab === "dashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dashamsha")} description={t("दशमांश कुंडली करिअर, व्यवसाय आणि सामाजिक स्थान दर्शवते.","Dashamsha chart shows career, profession, and social standing.")} />}
              {activeTab === "saptamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "saptamsha")} description={t("सप्तांश कुंडली संतती, मुलांचे भाग्य आणि सृजनशीलता दर्शवते.","Saptamsha chart reveals children, progeny fortune, and creativity.")} />}
              {activeTab === "dwadashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dwadashamsha")} description={t("द्वादशांश कुंडली आई-वडील, पूर्वज आणि वंशपरंपरा दर्शवते.","Dwadashamsha chart shows parents, ancestors, and lineage.")} />}
              {activeTab === "shodashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "shodashamsha")} description={t("षोडशांश कुंडली वाहने, संपत्ती आणि भौतिक सुखसोयी दर्शवते.","Shodashamsha chart reveals vehicles, property, and material comforts.")} />}
              {activeTab === "trimshamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "trimshamsha")} description={t("त्रिंशांश कुंडली अरिष्ट, संकट आणि दुर्दैवी घटना दर्शवते.","Trimshamsha chart indicates misfortunes, calamities, and adversities.")} />}
              {activeTab === "planets" && <PlanetTable planets={result.planets} combustion={result.enhancements?.combustion} />}
              {activeTab === "strength" && <StrengthSection strengths={result.analysis.planetaryStrength} />}
              {activeTab === "yogas" && <YogaSection yogas={result.analysis.yogas} />}
              {activeTab === "doshas" && <DoshaSection doshas={result.analysis.doshas} />}
              {activeTab === "mangal-dosh" && <MangalDoshSection data={result.mangalDosh} />}
              {activeTab === "kalsarp-dosh" && <KalsarpDoshSection data={result.kalsarpDosh} />}
              {activeTab === "shadbala" && <ShadBalaSection data={result.shadBala} />}
              {activeTab === "ashtakvarga" && <AshtakvargaSection data={result.ashtakvarga} />}
              {activeTab === "sarvatobhadra" && <SarvatobhadraSection data={result.sarvatobhadra} />}
              {activeTab === "birth-panchang" && <BirthPanchangSection data={result.enhancements?.birthPanchang} balance={result.enhancements?.balanceDasha} ashtottari={result.enhancements?.ashtottariBalance} />}
              {activeTab === "jaimini" && <JaiminiSection data={result.jaimini} />}
              {activeTab === "mitra-shatru" && <MitraShatruSection data={result.mitraShatru} />}
              {activeTab === "asta-yuddha" && <AstaYuddhaSection combustion={result.combustionDetails} yuddha={result.grahaYuddha} />}
              {activeTab === "bhava-bala" && <BhavaBalaSection data={result.bhavaBala} />}
              {activeTab === "marriage-timing" && <MarriageTimingSection data={result.marriageTiming} />}
              {activeTab === "career-timing" && <CareerTimingSection data={result.careerTiming} />}
              {activeTab === "deep-dasha" && <DeepDashaSection data={result.deepDasha} />}
              {activeTab === "names" && <NamesSection data={result.namesSuggestion} />}
              {activeTab === "upagrahas" && <UpagrahaSection data={result.upagrahas} />}
              {activeTab === "gochar-naadi" && <GocharNaadiSection data={result.gocharNaadi} />}
              {activeTab === "vimshopak-bala" && <VimshopakBalaSection data={result.vimshopakBala} />}
              {activeTab === "predictions" && <PredictionSection predictions={result.analysis.housePredictions} deepPredictions={result.enhancements?.housePredictions} planetBhava={result.enhancements?.planetBhavaPredictions} planetRashi={result.enhancements?.planetRashiPredictions} nakshatraDeep={result.enhancements?.nakshatraDeep} lagnaLifeAreas={result.enhancements?.lagnaLifeAreas} panchangFal={result.enhancements?.panchangFal} />}
              {activeTab === "dasha" && <DashaSection interp={result.analysis.currentDasha} />}
              {activeTab === "timeline" && <TimelineSection dashas={result.dashas} />}
              {activeTab === "remedies" && <RemedySection remedies={result.analysis.remedies} />}
            </div>

            {/* Patrika Footer */}
            <div className="relative text-center py-4 px-6 mt-6" style={{ borderTop: "1px solid rgba(212,168,67,0.12)" }}>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }} />
                <p className="text-[10px] tracking-[0.15em] shrink-0" style={{ color: "rgba(139,44,44,0.3)" }}>भाग्यवेध पत्रिका</p>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }} />
              </div>
            </div>

            {/* Page curl / bottom edge shadow */}
            <div className="h-1" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.04))" }} />
          </div>
        </div>
      </div>

      {/* ─── Print-only: each section wrapped in its own page with header+footer ─── */}
      <div className="print-only">

        {/* ══════ PAGE 1: COVER (premium layout) ══════ */}
        {(() => {
          const year = searchParams.get("year") || "";
          const month = searchParams.get("month") || "";
          const day = searchParams.get("day") || "";
          const hour = parseInt(searchParams.get("hour") || "0");
          const minute = searchParams.get("minute") || "00";
          const lat = searchParams.get("lat") || "";
          const lng = searchParams.get("lng") || "";
          const tz = parseFloat(searchParams.get("tz") || "5.5");
          const tzH = Math.floor(tz);
          const tzM = Math.round((tz - tzH) * 60);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          // Marathi time-of-day period (replaces AM/PM when lang=mr)
          const marathiPeriod =
            hour === 0 ? "रात्री" :
            hour < 6 ? "पहाटे" :
            hour < 12 ? "सकाळी" :
            hour < 16 ? "दुपारी" :
            hour < 19 ? "सायंकाळी" : "रात्री";
          const timeStr = lang === "mr"
            ? `${marathiPeriod} ${String(h12).padStart(2,"0")}:${String(minute).padStart(2,"0")}`
            : `${String(h12).padStart(2,"0")}:${String(minute).padStart(2,"0")} ${ampm}`;
          const MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
          const monthIdx = parseInt(month) - 1;
          const dateStr = lang === "mr" && monthIdx >= 0 && monthIdx < 12
            ? `${toMr(day)} ${MONTHS_MR[monthIdx]} ${toMr(year)}`
            : `${day}/${month}/${year}`;
          const placeMrParam = searchParams.get("placeMr") || "";
          const placeEn = searchParams.get("place") || "";
          const placeDisplay = lang === "mr"
            ? (placeMrParam || (placeEn ? toDevanagari(placeEn) : ""))
            : placeEn;
          const nameDisplay = lang === "mr"
            ? (nameMr || (name ? toDevanagari(name) : ""))
            : (name || nameMr);
          // Marathi number helper — converts all digits when lang is "mr"
          const m = (v: string | number) => lang === "mr" ? toMr(v) : String(v);

          // Find current dasha
          const now = new Date();
          const currentDasha = result.dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
          const currentAntardasha = currentDasha?.antardashas?.find(ad => now >= new Date(ad.startDate) && now <= new Date(ad.endDate));

          // Ayanamsa formatted
          const ayanDeg = result.ayanamsa ? Math.floor(result.ayanamsa) : 0;
          const ayanMin = result.ayanamsa ? Math.floor((result.ayanamsa % 1) * 60) : 0;
          const ayanSec = result.ayanamsa ? Math.round(((result.ayanamsa % 1) * 60 % 1) * 60) : 0;
          const ayanStr = result.ayanamsa ? `${m(ayanDeg)}° ${m(ayanMin)}' ${m(ayanSec)}"` : "—";

          return (
            <>
            <div className="print-page" style={{ position: "relative", background: "#FFF8E7", overflow: "hidden" }}>
              {/* Decorative borders */}
              <div style={{ position: "absolute", inset: "12px", border: "3px solid #8B0000", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: "20px", border: "1px solid #8B0000", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: "28px", border: "1.5px solid #8B0000", pointerEvents: "none" }} />

              {/* Corner rosettes */}
              {([
                { top: "22px", left: "22px" },
                { top: "22px", right: "22px" },
                { bottom: "22px", left: "22px" },
                { bottom: "22px", right: "22px" },
              ] as const).map((pos, i) => (
                <div key={i} style={{ position: "absolute", ...pos, zIndex: 2, background: "#FFF8E7", padding: "3px" }}>
                  <svg viewBox="0 0 40 40" width="36" height="36">
                    <g fill="none" stroke="#8B0000" strokeWidth="1.2">
                      <circle cx="20" cy="20" r="16" />
                      <circle cx="20" cy="20" r="10" />
                      <circle cx="20" cy="20" r="4" fill="#8B0000" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                        const a = (deg * Math.PI) / 180;
                        return (
                          <line key={deg} x1={20 + Math.cos(a) * 10} y1={20 + Math.sin(a) * 10} x2={20 + Math.cos(a) * 16} y2={20 + Math.sin(a) * 16} />
                        );
                      })}
                      <polygon points="20,2 38,20 20,38 2,20" strokeWidth="1" />
                    </g>
                  </svg>
                </div>
              ))}

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1, padding: "56px 70px 20px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", flex: 1 }}>
                {/* Medallion top */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid #8B0000", background: "#FFFDF5", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" }}>
                  <img src="/images/kundli/ganesha-classic.svg" alt="Ganesha" style={{ width: "54px", height: "54px", filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)" }} />
                </div>

                {/* Invocation */}
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#8B0000", marginBottom: "6px", letterSpacing: "1px" }}>॥ अथ श्रीगणेशाय नमः ॥</div>

                {/* Shloka */}
                <div style={{ fontSize: "10px", color: "#8B0000", lineHeight: 1.6, marginBottom: "12px", fontStyle: "italic" }}>
                  गजवदनमचिन्त्यं तीक्ष्णदृष्टं गणेशं,<br />
                  बृहत्तुरम्यमेशं भूतराजं पुराणम्।<br />
                  अमरवरसुपूज्यं रक्तवर्णं धरेशं,<br />
                  पशुपतिसुतमीशं विघ्नराजं नमामि॥
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#8B0000", letterSpacing: "4px", marginBottom: "2px" }}>सम्पूर्ण षडवर्गीय</div>

                {/* Title */}
                <div style={{ fontSize: "52px", fontWeight: 900, color: "#8B0000", letterSpacing: "3px", marginBottom: "10px", fontFamily: "serif", textShadow: "2px 2px 0 #d4a843" }}>जन्म पत्रिका</div>

                {/* Center Ganesha */}
                <div style={{ width: 150, height: 150, borderRadius: "50%", border: "3px solid #8B0000", background: "radial-gradient(circle, #FFFDF5 0%, #FFF8E7 100%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "14px" }}>
                  <img src="/images/kundli/ganesha-classic.svg" alt="Lord Ganesha" style={{ width: "120px", height: "120px", filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)" }} />
                </div>

                {/* Field sections */}
                <div style={{ width: "100%", maxWidth: "520px", textAlign: "left" }}>
                  {(() => {
                    const nakIdx = result.moonNakshatraIndex ?? 0;
                    const moonLord = PLANET_LORD_MR[RASHI_LORD_EN[result.moonRashiIndex ?? 0]] || "—";
                    const lagnaLord = PLANET_LORD_MR[RASHI_LORD_EN[result.lagnaRashiIndex]] || "—";
                    const panch = result.enhancements?.birthPanchang;
                    const sections = [
                      {
                        title: t("जातक माहिती", "Native Info"),
                        rows: [
                          [t("जातकाचे नाव", "Name"), nameDisplay || "—"],
                          [t("जन्मतारीख", "Date"), m(dateStr)],
                          [t("जन्मवेळ", "Time"), m(timeStr)],
                          [t("जन्मस्थळ", "Place"), placeDisplay || `${m(lat)}°N, ${m(lng)}°E`],
                        ],
                      },
                      {
                        title: t("पंचांग", "Panchanga"),
                        rows: [
                          [t("तिथी", "Tithi"), panch ? `${panch.tithi} (${panch.paksha})` : "—"],
                          [t("वार", "Weekday"), panch?.day || "—"],
                          [t("नक्षत्र", "Nakshatra"), `${t(result.moonNakshatraMr, result.moonNakshatra)} — ${t("चरण", "Pada")} ${m(result.moonPada)}`],
                          [t("योग", "Yoga"), panch?.yoga || "—"],
                          [t("करण", "Karana"), panch?.karana || "—"],
                          [t("नक्षत्र पाया", "Nakshatra Paya"), panch ? (lang === "en" ? panch.nakshatraPayaEn : panch.nakshatraPayaMr) : "—"],
                        ],
                      },
                      {
                        title: t("ज्योतिष सार", "Astro Summary"),
                        rows: [
                          [t("जन्म राशी (चंद्र)", "Moon Sign"), `${t(result.moonRashiMr, result.moonRashi)} — ${t("स्वामी", "Lord")} ${moonLord}`],
                          [t("जन्म लग्न", "Ascendant"), `${t(result.lagnaRashiMr, result.lagnaRashi)} — ${t("स्वामी", "Lord")} ${lagnaLord}`],
                          [t("नाडी", "Nadi"), NADI_MR[NAK_NADI[nakIdx]] || "—"],
                          [t("गण", "Gana"), GANA_MR[NAK_GANA[nakIdx]] || "—"],
                          [t("योनी", "Yoni"), YONI_MR[NAK_YONI[nakIdx]] || "—"],
                          [t("वर्ण", "Varna"), VARNA_MR[NAK_VARNA[nakIdx]] || "—"],
                          [t("अयनांश", "Ayanamsha"), ayanStr],
                        ],
                      },
                    ];
                    return sections.map((section, si) => (
                      <div key={si} style={{ marginBottom: si < sections.length - 1 ? "8px" : "0" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#d4a843", background: "#8B0000", padding: "3px 12px", letterSpacing: "3px", textAlign: "center", marginBottom: "4px" }}>
                          {section.title}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "18px" }}>
                          {section.rows.map(([label, value], i) => (
                            <div key={i} style={{ display: "flex", borderBottom: "1px dotted #8B0000", padding: "3px 0", fontSize: "10px" }}>
                              <span style={{ color: "#8B0000", fontWeight: 700, minWidth: "95px" }}>{label}</span>
                              <span style={{ color: "#3d0c0c", flex: 1, wordBreak: "break-word" }}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Page number */}
              <div style={{ position: "relative", zIndex: 1, textAlign: "center", paddingBottom: "40px", fontSize: "11px", color: "#8B0000", fontWeight: 700 }}>॥ १ ॥</div>
            </div>

            {/* ══════ PAGE 2: दोष स्थिती + शुभ माहिती + ग्रह स्थानं ══════ */}
            <PrintPage>
              <div style={{ padding: "0" }}>
                {/* दोष स्थिती — 2-col with color-coded status */}
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("दोष स्थिती", "DOSHA STATUS")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "4px" }}>
                  {(() => {
                    const doshRows: { label: string; value: string; present: boolean }[] = [];
                    result.analysis.doshas.filter(d => d.nameEn.toLowerCase().includes("mangal") || d.nameEn.toLowerCase().includes("manglik")).forEach(d => doshRows.push({ label: t(d.nameMr, d.nameEn), value: d.present ? t("उपस्थित", "Present") : t("अनुपस्थित", "Absent"), present: d.present }));
                    result.analysis.doshas.filter(d => d.nameEn.toLowerCase().includes("kaal") || d.nameEn.toLowerCase().includes("sarp") || d.nameMr?.includes("काळ")).forEach(d => doshRows.push({ label: t(d.nameMr, d.nameEn), value: d.present ? t("उपस्थित", "Present") : t("अनुपस्थित", "Absent"), present: d.present }));
                    if (result.enhancements?.sadeSati) {
                      const ss = result.enhancements.sadeSati;
                      doshRows.push({ label: t("साडेसाती", "Sade Sati"), value: ss.active ? `${t("चालू", "Active")} — ${t(ss.phaseMr, ss.phaseEn)}` : t("नाही", "Not Active"), present: ss.active });
                    }
                    if (result.enhancements?.pitraDosha) {
                      const pd = result.enhancements.pitraDosha;
                      doshRows.push({ label: t("पितृ दोष", "Pitra Dosha"), value: pd.present ? t("उपस्थित", "Present") : t("अनुपस्थित", "Absent"), present: pd.present });
                    }
                    return doshRows.map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: `3px solid ${d.present ? "#c62828" : "#2e7d32"}`, borderRadius: "4px", fontSize: "10px" }}>
                        <span style={{ color: "#3d0c0c", fontWeight: 600 }}>{d.label}</span>
                        <span style={{ color: d.present ? "#c62828" : "#2e7d32", fontWeight: 600, fontSize: "9px" }}>{d.value}</span>
                      </div>
                    ));
                  })()}
                </div>

                {/* शुभ माहिती — 6-col pill row */}
                {result.enhancements?.luckyItems && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginTop: "18px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("शुभ माहिती", "LUCKY ITEMS")}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
                      {[
                        [t("रत्न", "Gemstone"), t(result.enhancements.luckyItems.gemstone.mr, result.enhancements.luckyItems.gemstone.en)],
                        [t("रंग", "Color"), t(result.enhancements.luckyItems.color.mr, result.enhancements.luckyItems.color.en)],
                        [t("अंक", "Number"), m(result.enhancements.luckyItems.number)],
                        [t("वार", "Day"), t(result.enhancements.luckyItems.day.mr, result.enhancements.luckyItems.day.en)],
                        [t("दिशा", "Direction"), t(result.enhancements.luckyItems.direction.mr, result.enhancements.luckyItems.direction.en)],
                        [t("धातू", "Metal"), t(result.enhancements.luckyItems.metal.mr, result.enhancements.luckyItems.metal.en)],
                      ].map(([label, value], i) => (
                        <div key={i} style={{ background: "#FFF8E7", border: "1px solid #d4a843", borderRadius: "6px", padding: "8px 4px", textAlign: "center" }}>
                          <div style={{ fontSize: "8px", color: "#8b6b4a", fontWeight: 600, letterSpacing: "1px", marginBottom: "3px" }}>{label}</div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#3d0c0c", lineHeight: 1.2 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* वर्तमान दशा — fills mid space */}
                {currentDasha && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginTop: "18px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("वर्तमान दशा", "CURRENT DASHA")}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <div style={{ background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "4px", padding: "8px 12px", fontSize: "10px" }}>
                        <div style={{ fontSize: "8px", color: "#8b6b4a", fontWeight: 600, marginBottom: "2px" }}>{t("महादशा", "Mahadasha")}</div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#3d0c0c" }}>{t(PLANET_LORD_MR[currentDasha.lord] || currentDasha.lord, currentDasha.lord)}</div>
                        <div style={{ fontSize: "8px", color: "#8b6b4a", marginTop: "2px" }}>{m(new Date(currentDasha.startDate).getFullYear())} — {m(new Date(currentDasha.endDate).getFullYear())}</div>
                      </div>
                      {currentAntardasha && (
                        <div style={{ background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "4px", padding: "8px 12px", fontSize: "10px" }}>
                          <div style={{ fontSize: "8px", color: "#8b6b4a", fontWeight: 600, marginBottom: "2px" }}>{t("अंतर्दशा", "Antardasha")}</div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#3d0c0c" }}>{t(PLANET_LORD_MR[currentAntardasha.lord] || currentAntardasha.lord, currentAntardasha.lord)}</div>
                          <div style={{ fontSize: "8px", color: "#8b6b4a", marginTop: "2px" }}>{m(new Date(currentAntardasha.startDate).toISOString().slice(0, 10))} — {m(new Date(currentAntardasha.endDate).toISOString().slice(0, 10))}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* ग्रह स्थानं — full planet table fills remaining space */}
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginTop: "18px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("ग्रह स्थानं — लग्न कुंडली (D1)", "PLANET POSITIONS — LAGNA KUNDALI (D1)")}</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
                  <thead>
                    <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
                      <th style={{ padding: "4px 6px", textAlign: "left", fontWeight: 600, fontSize: "8px" }}>{t("ग्रह", "Graha")}</th>
                      <th style={{ padding: "4px 6px", textAlign: "left", fontWeight: 600, fontSize: "8px" }}>{t("राशी", "Rashi")}</th>
                      <th style={{ padding: "4px 6px", textAlign: "center", fontWeight: 600, fontSize: "8px" }}>{t("भाव", "House")}</th>
                      <th style={{ padding: "4px 6px", textAlign: "left", fontWeight: 600, fontSize: "8px" }}>{t("अंश", "Degree")}</th>
                      <th style={{ padding: "4px 6px", textAlign: "left", fontWeight: 600, fontSize: "8px" }}>{t("नक्षत्र", "Nakshatra")}</th>
                      <th style={{ padding: "4px 6px", textAlign: "center", fontWeight: 600, fontSize: "8px" }}>{t("पद", "Pada")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.planets.map((p, i) => (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7" }}>
                        <td style={{ padding: "3px 6px", fontWeight: 600, color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{t(p.nameMr, p.name)}{p.isRetrograde ? t(" (व)", " (R)") : ""}</td>
                        <td style={{ padding: "3px 6px", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{t(p.rashiMr, p.rashi)}</td>
                        <td style={{ padding: "3px 6px", textAlign: "center", fontWeight: 600, color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{m(p.house)}</td>
                        <td style={{ padding: "3px 6px", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{m(p.degreeDMS)}</td>
                        <td style={{ padding: "3px 6px", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{t(p.nakshatraMr, p.nakshatra)}</td>
                        <td style={{ padding: "3px 6px", textAlign: "center", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{m(p.pada)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PrintPage>
            </>
          );
        })()}

        {/* ══════ CHARTS: 2-col layout (chart+placement left, analysis right) ══════ */}
        {(() => {
          const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
            const map: Record<number, typeof planetList> = {};
            for (let i = 1; i <= 12; i++) map[i] = [];
            planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
            return map;
          };
          const enh = result.enhancements;
          const interpBox = { background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0" as const, padding: "10px 12px", marginTop: "8px" };
          const interpLabel = { fontSize: "9px", color: "#8b6b4a", fontWeight: 600 as const, marginBottom: "3px" };
          const interpText = { fontSize: "10px", color: "#3d0c0c", lineHeight: 1.5 };
          const badgeGreen = { display: "inline-block" as const, background: "#e8f5e9", color: "#2e7d32", fontSize: "9px", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 as const, marginRight: "5px" };
          const badgeRed = { display: "inline-block" as const, background: "#fce4ec", color: "#c62828", fontSize: "9px", padding: "2px 7px", borderRadius: "4px", fontWeight: 600 as const, marginRight: "5px" };
          const chartM = (v: string | number) => lang === "mr" ? toMr(v) : String(v);

          const D_CHART_SIGNIFICANCE: Record<string, { mr: string; en: string }> = {
            lagna: { mr: "शरीर, व्यक्तिमत्त्व आणि मूलभूत जीवन पथ — सर्व विश्लेषणाचा पाया.", en: "Body, personality and life path — foundation of all analysis." },
            chandra: { mr: "मन, भावना, मानसिक स्वभाव आणि मातेचा आशीर्वाद.", en: "Mind, emotions, mental disposition, mother's blessings." },
            hora: { mr: "संपत्ती, द्रव्य सुख आणि आर्थिक भाग्य — सूर्य/चंद्र होरा वर्गीकरण.", en: "Wealth and finance — Sun/Moon hora classification." },
            drekkana: { mr: "भावंडे, साहस, परिश्रम आणि जीवनदिशा.", en: "Siblings, courage, effort and life direction." },
            chaturthamsha: { mr: "सुख, घर, वाहन आणि स्थावर मालमत्ता.", en: "Happiness, home, vehicles and fixed assets." },
            saptamsha: { mr: "संतती, मुले आणि सर्जनशीलता.", en: "Children, progeny and creativity." },
            navamsha: { mr: "विवाह, जोडीदार, भाग्य आणि दशाफल — सर्वात महत्त्वाची वर्ग कुंडली.", en: "Marriage, spouse, destiny — the most important varga." },
            dashamsha: { mr: "कर्म, व्यवसाय, कीर्ती आणि सामाजिक प्रतिष्ठा.", en: "Career, profession, fame, social standing." },
            dwadashamsha: { mr: "पितृ-मातृ, पूर्वज आणि कौटुंबिक वारसा.", en: "Parents, ancestry, family heritage." },
            shodashamsha: { mr: "वाहने, भौतिक सुख आणि आनंद.", en: "Vehicles, luxuries, material comforts." },
            vimshamsha: { mr: "उपासना, अध्यात्म आणि देव-उपासना.", en: "Spiritual practice, worship, devotion." },
            siddhamsha: { mr: "विद्या, ज्ञान, शिक्षण आणि कौशल्ये.", en: "Education, knowledge, learning, skills." },
            bhamsha: { mr: "बलाबल, सामर्थ्य, दुर्बलता आणि स्ट्रेस क्षमता.", en: "Strength, weakness, stress tolerance." },
            trimshamsha: { mr: "अरिष्ट, आरोग्य जोखीम आणि अडचणी.", en: "Misfortunes, health risks, obstacles." },
            khavedamsha: { mr: "शुभ/अशुभ फल आणि सामान्य जीवनातील योग.", en: "General auspicious/inauspicious life effects." },
            akshavedamsha: { mr: "सर्वांगीण जीवन फल आणि समग्र विश्लेषण.", en: "Overall life effects — holistic view." },
            shashtiamsha: { mr: "अत्यंत सूक्ष्म विश्लेषण आणि कर्म ऋणानुबंध.", en: "Subtle holistic analysis, karmic bonds." },
            "bhav-chalit": { mr: "भाव संधी आणि ग्रह भाव बदल — अचूक फलित विश्लेषणासाठी.", en: "House cusps and planet-house shifts for accurate predictions." },
          };

          const allCharts: {
            id: string;
            name: string;
            houseMap: Record<number, Array<{ id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }>>;
            label?: string;
            lagnaRashi: number;
            planets: Array<{ id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean; rashi?: string; rashiMr?: string; degreeDMS?: string; degreeInSign?: number }>;
          }[] = [
            { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: buildHouseMap(result.planets), label: t("लग्न", "Asc"), lagnaRashi: result.lagnaRashiIndex, planets: result.planets },
            ...result.divisionalCharts.map(c => ({
              id: c.id, name: t(c.nameMr, c.name), houseMap: buildHouseMap(c.planets),
              label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
              lagnaRashi: getChartLagnaRashi(c.planets),
              planets: c.planets,
            })),
          ];

          const hasSpecificAnalysisSet = new Set(["lagna","chandra","navamsha","bhav-chalit","dashamsha","saptamsha","dwadashamsha","shodashamsha","trimshamsha"]);

          return allCharts.map((chart) => {
            const sig = D_CHART_SIGNIFICANCE[chart.id];
            const hasSpecificAnalysis = hasSpecificAnalysisSet.has(chart.id);
            const occupiedHouses = Object.entries(chart.houseMap).filter(([, list]) => list.length > 0).sort((a, b) => Number(a[0]) - Number(b[0]));

            return (
            <PrintPage key={chart.id}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1c1917", marginBottom: "3px" }}>{chart.name}</h2>
              {sig && <div style={{ fontSize: "9px", color: "#8b6b4a", marginBottom: "8px", lineHeight: 1.4 }}>{t(sig.mr, sig.en)}</div>}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", alignItems: "start" }}>
                {/* LEFT: chart SVG */}
                <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                  <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
                </div>

                {/* RIGHT: chart-specific analysis */}
                <div>

              {/* ── Lagna Analysis ── */}
              {chart.id === "lagna" && enh && (
                <div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("लग्न राशी", "Ascendant Sign")}</div>
                    <div style={interpText}>{t(enh.lagnaAnalysis.rashiDescMr, enh.lagnaAnalysis.rashiDescEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("लग्नेश स्थिती", "Lagna Lord Position")}</div>
                    <div style={interpText}>{t(enh.lagnaAnalysis.lagnaLordPositionMr, enh.lagnaAnalysis.lagnaLordPositionEn)}</div>
                  </div>
                  {result.analysis.doshas.filter(d => d.nameEn?.toLowerCase().includes("mangal") || d.nameEn?.toLowerCase().includes("manglik") || d.nameMr?.includes("मंगळ")).map((d, i) => (
                    <div key={i} style={{ ...interpBox, borderLeft: `3px solid ${d.present ? "#c62828" : "#2e7d32"}` }}>
                      <div style={interpLabel}>{t("मंगळिक स्थिती", "Manglik Status")}</div>
                      <div style={interpText}>
                        <span style={d.present ? badgeRed : badgeGreen}>{d.present ? t("मंगळिक", "Manglik") : t("मंगळिक नाही", "Not Manglik")}</span>
                        {t(d.descriptionMr, d.descriptionEn)}
                      </div>
                    </div>
                  ))}
                  <div style={{ ...interpBox, borderLeft: `3px solid ${enh.sadeSati.active ? "#c62828" : "#2e7d32"}` }}>
                    <div style={interpLabel}>{t("साडेसाती", "Sade Sati")}</div>
                    <div style={interpText}>
                      <span style={enh.sadeSati.active ? badgeRed : badgeGreen}>{t(enh.sadeSati.phaseMr, enh.sadeSati.phaseEn)}</span>
                      {t(enh.sadeSati.descriptionMr, enh.sadeSati.descriptionEn)}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Chandra Analysis ── */}
              {chart.id === "chandra" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("मानसिक स्वभाव", "Mental Temperament")}</div>
                    <div style={interpText}>{t(enh.mentalTemperament.descriptionMr, enh.mentalTemperament.descriptionEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("चंद्र बल", "Moon Strength")}</div>
                    <div style={interpText}>{t(enh.mentalTemperament.moonStrengthMr, enh.mentalTemperament.moonStrengthEn)}</div>
                  </div>
                  {enh.chandraYogas.length > 0 ? enh.chandraYogas.map((y, i) => (
                    <div key={i} style={{ ...interpBox, borderLeft: `3px solid ${y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17"}` }}>
                      <div style={interpLabel}>
                        <span style={{ ...(y.type === "benefic" ? badgeGreen : badgeRed) }}>{y.type === "benefic" ? t("शुभ", "Benefic") : t("अशुभ", "Malefic")}</span>
                        {t(y.nameMr, y.nameEn)}
                      </div>
                      <div style={interpText}>{t(y.descriptionMr, y.descriptionEn)}</div>
                    </div>
                  )) : (
                    <div style={interpBox}>
                      <div style={interpLabel}>{t("चंद्र योग", "Moon Yogas")}</div>
                      <div style={interpText}>{t("विशेष चंद्र योग आढळले नाहीत.", "No special Moon yogas detected.")}</div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Navamsha D9 — Marriage ── */}
              {chart.id === "navamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  {enh.vargottam.length > 0 && (
                    <div style={interpBox}>
                      <div style={interpLabel}>{t("वर्गोत्तम ग्रह", "Vargottam Planets")} — {t("D1 आणि D9 दोन्हीत एकाच राशीत", "Same sign in D1 & D9")}</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginTop: "6px" }}>
                        {enh.vargottam.map((v, i) => (
                          <span key={i} style={{ display: "inline-block", background: "linear-gradient(135deg, #d4a843, #b8922e)", color: "white", fontSize: "10px", padding: "3px 10px", borderRadius: "12px", fontWeight: 600 }}>{t(v.nameMr, v.nameEn)} — {t(v.rashiMr, v.rashiEn)}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("शुक्र स्थिती (विवाह कारक)", "Venus Position")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.venusMr, enh.marriageAnalysis.venusEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("सप्तमेश स्थिती", "7th Lord Position")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.seventhMr, enh.marriageAnalysis.seventhEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("विवाह काळ संकेत", "Marriage Timing")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.timingMr, enh.marriageAnalysis.timingEn)}</div>
                  </div>
                </div>
              )}

              {/* ── Bhav Chalit — House Cusps + Shifts ── */}
              {chart.id === "bhav-chalit" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "6px" }}>{t("भाव संधी", "HOUSE CUSPS")}</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "9px", marginBottom: "12px" }}>
                    <thead><tr>{[t("भाव","House"), t("अंश","Degree"), t("राशी","Sign")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px 6px", textAlign: "left" as const, fontSize: "8px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {enh.bhavSandhi.map((bs, i) => (
                        <tr key={i}><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{bs.house}</td><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{bs.cuspDMS}</td><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(bs.rashiMr, bs.rashiEn)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  {enh.houseShifts.filter(h => h.shifted).length > 0 && (
                    <>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "6px" }}>{t("ग्रह भाव बदल", "PLANET SHIFTS")}</div>
                      {enh.houseShifts.filter(h => h.shifted).map((hs, i) => (
                        <div key={i} style={{ background: "#fff8e1", border: "1px solid #f5efe0", borderRadius: "4px", padding: "6px 12px", marginBottom: "4px", fontSize: "10px", color: "#3d0c0c" }}>
                          <strong style={{ color: "#e65100" }}>{hs.planetMr}</strong> — {t("भाव", "H")} {hs.d1House} → <strong>{t("भाव", "H")} {hs.chalitHouse}</strong>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* ── Dashamsha D10 — Career ── */}
              {chart.id === "dashamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("व्यवसाय प्रकार", "Career Type")}</div>
                    <div style={interpText}>{t(enh.careerAnalysis.careerTypeMr, enh.careerAnalysis.careerTypeEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("नोकरी / व्यवसाय", "Job / Business")}</div>
                    <div style={interpText}>{t(enh.careerAnalysis.jobOrBusinessMr, enh.careerAnalysis.jobOrBusinessEn)}</div>
                  </div>
                </div>
              )}

              {/* ── Saptamsha D7 — Children ── */}
              {chart.id === "saptamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("संतती योग", "Children Yoga")}</div>
                    <div style={interpText}>{t(enh.childrenAnalysis.yogaMr, enh.childrenAnalysis.yogaEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("संतती काळ संकेत", "Children Timing")}</div>
                    <div style={interpText}>{t(enh.childrenAnalysis.timingMr, enh.childrenAnalysis.timingEn)}</div>
                  </div>
                </div>
              )}

              {/* ── D12 — Parents ── */}
              {chart.id === "dwadashamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("पितृ/वंश विश्लेषण", "Parents/Ancestry Analysis")}</div>
                    <div style={interpText}>{t("द्वादशांश कुंडलीवरून पितृ-मातृ संबंध, वंशपरंपरा आणि कौटुंबिक वारसा कळतो.", "D12 reveals relationship with parents, ancestry and family heritage.")}</div>
                  </div>
                </div>
              )}

              {/* ── D16 — Comforts ── */}
              {chart.id === "shodashamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("सुखसोयी विश्लेषण", "Comforts & Vehicles Analysis")}</div>
                    <div style={interpText}>{t("षोडशांश कुंडलीवरून वाहन, मालमत्ता आणि भौतिक सुखसोयींचे संकेत मिळतात.", "D16 indicates vehicles, property and material comforts.")}</div>
                  </div>
                </div>
              )}

              {/* ── D30 — Misfortunes ── */}
              {chart.id === "trimshamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("अरिष्ट विश्लेषण", "Challenges Analysis")}</div>
                    <div style={interpText}>{t("त्रिंशांश कुंडलीवरून आरोग्य जोखीम, अडचणी आणि सावधगिरीची क्षेत्रे कळतात.", "D30 reveals health risks, obstacles and areas requiring caution.")}</div>
                  </div>
                </div>
              )}

              {/* ── Fallback: generic significance (for D-charts without specific analysis) ── */}
              {!hasSpecificAnalysis && sig && (
                <div style={interpBox}>
                  <div style={interpLabel}>{chart.name} — {t("महत्त्व", "Significance")}</div>
                  <div style={interpText}>{t(sig.mr, sig.en)}</div>
                </div>
              )}

                </div>
              </div>

              {/* ── Full-width planet-placement table (below 2-col grid) ── */}
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "4px", paddingBottom: "2px", borderBottom: "1px solid #f5efe0" }}>{t("ग्रह स्थानं — " + chart.name, "PLANET PLACEMENTS — " + chart.name)}</div>
                <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "9px" }}>
                  <thead>
                    <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
                      <th style={{ padding: "3px 6px", textAlign: "left" as const, fontWeight: 600 as const, fontSize: "8px" }}>{t("ग्रह", "Graha")}</th>
                      <th style={{ padding: "3px 6px", textAlign: "left" as const, fontWeight: 600 as const, fontSize: "8px" }}>{t("राशी", "Rashi")}</th>
                      <th style={{ padding: "3px 6px", textAlign: "center" as const, fontWeight: 600 as const, fontSize: "8px" }}>{t("भाव", "House")}</th>
                      <th style={{ padding: "3px 6px", textAlign: "left" as const, fontWeight: 600 as const, fontSize: "8px" }}>{t("अंश", "Degree")}</th>
                      <th style={{ padding: "3px 6px", textAlign: "center" as const, fontWeight: 600 as const, fontSize: "8px" }}>{t("वक्री", "Retro")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.planets.map((p, i) => {
                      const deg = p.degreeDMS ?? (p.degreeInSign !== undefined ? `${Math.floor(p.degreeInSign)}°` : "—");
                      return (
                        <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7" }}>
                          <td style={{ padding: "3px 6px", fontWeight: 600 as const, color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{t(p.nameMr, p.name || p.id)}</td>
                          <td style={{ padding: "3px 6px", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{t(p.rashiMr || "", p.rashi || "")}</td>
                          <td style={{ padding: "3px 6px", textAlign: "center" as const, fontWeight: 600 as const, color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{chartM(p.house)}</td>
                          <td style={{ padding: "3px 6px", color: "#3d0c0c", borderBottom: "1px solid #f5efe0" }}>{chartM(deg)}</td>
                          <td style={{ padding: "3px 6px", textAlign: "center" as const, color: p.isRetrograde ? "#c62828" : "#8b6b4a", borderBottom: "1px solid #f5efe0", fontWeight: 600 as const }}>{p.isRetrograde ? t("वक्री", "R") : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Full-width house-wise summary (only for generic D-charts) ── */}
              {!hasSpecificAnalysis && occupiedHouses.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "4px", paddingBottom: "2px", borderBottom: "1px solid #f5efe0" }}>{t("भावनिहाय स्थान", "HOUSE-WISE PLACEMENT")}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" }}>
                    {occupiedHouses.map(([h, list]) => (
                      <div key={h} style={{ fontSize: "9px", background: "#FFFDF5", border: "1px solid #f5efe0", borderLeft: "2px solid #d4a843", borderRadius: "3px", padding: "4px 8px" }}>
                        <strong style={{ color: "#5c1a1a" }}>{t("भाव", "H")} {chartM(Number(h))}:</strong>{" "}
                        <span style={{ color: "#3d0c0c" }}>{list.map(p => t(p.nameMr, p.name || p.id) + (p.isRetrograde ? t(" (व)", " (R)") : "")).join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PrintPage>
          );});
        })()}

        {/* ══════ CHART ANALYSIS (now merged into chart pages above) ══════ */}
        {false && result.enhancements && (
          <>
            {/* OLD SEPARATE ANALYSIS PAGES — DISABLED, NOW MERGED INTO CHARTS */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("लग्न विश्लेषण", "Lagna Analysis")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("लग्न राशी", "Ascendant Sign")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.lagnaAnalysis.rashiDescMr, result.enhancements.lagnaAnalysis.rashiDescEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("लग्नेश स्थिती", "Lagna Lord Position")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.lagnaAnalysis.lagnaLordPositionMr, result.enhancements.lagnaAnalysis.lagnaLordPositionEn)}</div>
              </div>
              {/* Manglik from doshas */}
              {result.analysis.doshas.filter(d => d.nameEn?.toLowerCase().includes("mangal") || d.nameEn?.toLowerCase().includes("manglik") || d.nameMr?.includes("मंगळ")).map((d, i) => (
                <div key={i} style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${d.present ? "#c62828" : "#2e7d32"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("मंगळिक स्थिती", "Manglik Status")}</div>
                  <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>
                    <span style={{ display: "inline-block", background: d.present ? "#fce4ec" : "#e8f5e9", color: d.present ? "#c62828" : "#2e7d32", fontSize: "11px", padding: "2px 10px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{d.present ? t("मंगळिक", "Manglik") : t("मंगळिक नाही", "Not Manglik")}</span>
                    {t(d.descriptionMr, d.descriptionEn)}
                  </div>
                </div>
              ))}
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${result.enhancements.sadeSati.active ? "#c62828" : "#2e7d32"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("साडेसाती", "Sade Sati")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>
                  <span style={{ display: "inline-block", background: result.enhancements.sadeSati.active ? "#fce4ec" : "#e8f5e9", color: result.enhancements.sadeSati.active ? "#c62828" : "#2e7d32", fontSize: "11px", padding: "2px 10px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{t(result.enhancements.sadeSati.phaseMr, result.enhancements.sadeSati.phaseEn)}</span>
                  {t(result.enhancements.sadeSati.descriptionMr, result.enhancements.sadeSati.descriptionEn)}
                </div>
              </div>
            </PrintPage>

            {/* ── Chandra Analysis ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("चंद्र विश्लेषण", "Moon Analysis")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("मानसिक स्वभाव", "Mental Temperament")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.mentalTemperament.descriptionMr, result.enhancements.mentalTemperament.descriptionEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("चंद्र बल", "Moon Strength")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.mentalTemperament.moonStrengthMr, result.enhancements.mentalTemperament.moonStrengthEn)}</div>
              </div>
              {result.enhancements.chandraYogas.length > 0 && (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("चंद्र योग", "MOON YOGAS")}</div>
                  {result.enhancements.chandraYogas.map((y, i) => (
                    <div key={i} style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "10px" }}>
                      <div style={{ fontSize: "12px", color: "#3d0c0c", fontWeight: 700, marginBottom: "4px" }}>
                        <span style={{ display: "inline-block", background: y.type === "benefic" ? "#e8f5e9" : y.type === "malefic" ? "#fce4ec" : "#fff8e1", color: y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{y.type === "benefic" ? t("शुभ", "Benefic") : y.type === "malefic" ? t("अशुभ", "Malefic") : t("मिश्र", "Mixed")}</span>
                        {t(y.nameMr, y.nameEn)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#5c3a1a", lineHeight: 1.6 }}>{t(y.descriptionMr, y.descriptionEn)}</div>
                    </div>
                  ))}
                </>
              )}
              {result.enhancements.chandraYogas.length === 0 && (
                <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("चंद्र योग", "Moon Yogas")}</div>
                  <div style={{ fontSize: "11px", color: "#3d0c0c" }}>{t("विशेष चंद्र योग आढळले नाहीत.", "No special Moon yogas detected.")}</div>
                </div>
              )}
            </PrintPage>

            {/* ── Navamsha D9 — Marriage Analysis ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("नवमांश (D9) — विवाह विश्लेषण", "Navamsha (D9) — Marriage Analysis")}</h2>
              {result.enhancements.vargottam.length > 0 && (
                <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "8px" }}>{t("वर्गोत्तम ग्रह", "Vargottam Planets")} — {t("D1 आणि D9 दोन्हीत एकाच राशीत — अत्यंत बलवान", "Same sign in D1 & D9 — extremely strong")}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.enhancements.vargottam.map((v, i) => (
                      <span key={i} style={{ display: "inline-block", background: "linear-gradient(135deg, #d4a843, #b8922e)", color: "white", fontSize: "10px", padding: "3px 10px", borderRadius: "12px", fontWeight: 600 }}>{t(v.nameMr, v.nameEn)} — {t(v.rashiMr, v.rashiEn)}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("शुक्र स्थिती (विवाह कारक)", "Venus Position (Marriage Significator)")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.venusMr, result.enhancements.marriageAnalysis.venusEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("सप्तमेश स्थिती (७ वा भाव)", "7th Lord Position")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.seventhMr, result.enhancements.marriageAnalysis.seventhEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("विवाह काळ संकेत", "Marriage Timing Indication")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.timingMr, result.enhancements.marriageAnalysis.timingEn)}</div>
              </div>
            </PrintPage>

            {/* ── Bhav Chalit — House Cusps + Shifts ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("भाव चलित विश्लेषण", "Bhav Chalit Analysis")}</h2>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("भाव संधी (House Cusps)", "HOUSE CUSPS")}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginBottom: "20px" }}>
                <thead><tr>{[t("भाव","House"), t("अंश","Degree"), t("राशी","Sign")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "5px 8px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.enhancements.bhavSandhi.map((bs, i) => (
                    <tr key={i}><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{bs.house}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{bs.cuspDMS}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(bs.rashiMr, bs.rashiEn)}</td></tr>
                  ))}
                </tbody>
              </table>
              {result.enhancements.houseShifts.filter(h => h.shifted).length > 0 && (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("ग्रह भाव बदल (D1 → भाव चलित)", "PLANET HOUSE SHIFTS")}</div>
                  <p style={{ fontSize: "9px", color: "#8b6b4a", marginBottom: "8px" }}>{t("हे ग्रह लग्न कुंडलीपेक्षा भाव चलितमध्ये वेगळ्या भावात बसतात", "These planets shift houses from D1 to Bhav Chalit")}</p>
                  {result.enhancements.houseShifts.filter(h => h.shifted).map((hs, i) => (
                    <div key={i} style={{ background: "#fff8e1", border: "1px solid #f5efe0", borderRadius: "6px", padding: "8px 14px", marginBottom: "6px", fontSize: "11px", color: "#3d0c0c" }}>
                      <span style={{ display: "inline-block", background: "#fff3e0", color: "#e65100", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{hs.planetMr}</span>
                      {t("लग्न कुंडली", "D1")}: {t("भाव", "House")} {hs.d1House} → {t("भाव चलित", "Bhav Chalit")}: <strong>{t("भाव", "House")} {hs.chalitHouse}</strong>
                    </div>
                  ))}
                </>
              )}
            </PrintPage>

            {/* ── D10 Career + D7 Children ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("करिअर विश्लेषण (D10)", "Career Analysis (D10)")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("व्यवसाय प्रकार", "Career Type")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.careerAnalysis.careerTypeMr, result.enhancements.careerAnalysis.careerTypeEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("नोकरी / व्यवसाय", "Job / Business")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.careerAnalysis.jobOrBusinessMr, result.enhancements.careerAnalysis.jobOrBusinessEn)}</div>
              </div>

              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("संतती विश्लेषण (D7)", "Children Analysis (D7)")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("संतती योग", "Children Yoga")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.childrenAnalysis.yogaMr, result.enhancements.childrenAnalysis.yogaEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("संतती काळ संकेत", "Children Timing")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.childrenAnalysis.timingMr, result.enhancements.childrenAnalysis.timingEn)}</div>
              </div>
            </PrintPage>

            {/* ── House Lords Table ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "12px" }}>{t("भाव स्वामी सारणी", "House Lords Table")}</h2>
              <p style={{ fontSize: "9px", color: "#8b6b4a", marginBottom: "10px" }}>{t("प्रत्येक भावाचा स्वामी ग्रह कोणता आणि तो कोणत्या भावात बसला आहे", "Which planet owns each house and where it is placed")}</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead><tr>{[t("भाव","House"), t("राशी","Sign"), t("विषय","Subject"), t("स्वामी","Lord"), t("स्वामी भाव","Lord House"), t("बल","Strength")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "6px 6px", textAlign: "left", fontSize: "8px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.enhancements.houseLords.map((hl, i) => (
                    <tr key={i} style={{ background: i % 2 === 1 ? "#fdfbf6" : "white" }}>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{hl.house}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(hl.rashiMr, hl.rashiEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#8b6b4a", fontSize: "9px" }}>{t(hl.subjectMr, hl.subjectEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#d4a843", fontWeight: 600 }}>{t(hl.lordMr, hl.lordEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{hl.lordHouse}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#8b6b4a", fontSize: "9px" }}>{t(hl.lordStrengthMr, hl.lordStrengthEn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintPage>

            {/* ── Aspects Matrix ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>{t("ग्रह दृष्टी सारणी", "Planetary Aspects Table")}</h2>
              <p style={{ fontSize: "8px", color: "#8b6b4a", marginBottom: "10px" }}>● = {t("७ वी दृष्टी", "7th aspect")} &nbsp; ✦ = {t("विशेष दृष्टी", "Special aspect")} ({t("मंगळ ४/८, गुरु ५/९, शनि ३/१०", "Mars 4/8, Jupiter 5/9, Saturn 3/10")})</p>
              {(() => {
                const pIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                const pMr: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
                const aspectMap = new Map<string, { type: string; house: number }>();
                result.enhancements!.aspects.forEach(a => { aspectMap.set(`${a.fromId}-${a.toId}`, { type: a.type, house: a.aspectHouse }); });
                return (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
                    <thead><tr><th style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px" }}>{t("दृष्टी↓ वर→", "From↓ To→")}</th>{pIds.map(p => <th key={p} style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px", textAlign: "center" }}>{t(pMr[p], p)}</th>)}</tr></thead>
                    <tbody>
                      {pIds.map(from => (
                        <tr key={from}>
                          <th style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px", textAlign: "left" }}>{t(pMr[from], from)}</th>
                          {pIds.map(to => {
                            if (from === to) return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center", color: "#ccc" }}>—</td>;
                            const asp = aspectMap.get(`${from}-${to}`);
                            if (!asp) return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center" }}></td>;
                            return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center", background: asp.type === "special" ? "#fff3e0" : "#e8f5e9", color: asp.type === "special" ? "#e65100" : "#2e7d32", fontWeight: 700 }}>{asp.type === "special" ? `✦${asp.house}` : "●"}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
              {/* Important aspect interpretations */}
              {result.enhancements.aspects.filter(a => a.type === "special").length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("महत्त्वाचे विशेष दृष्टी योग", "IMPORTANT SPECIAL ASPECTS")}</div>
                  {result.enhancements.aspects.filter(a => a.type === "special").slice(0, 6).map((a, i) => (
                    <div key={i} style={{ fontSize: "10px", color: "#3d0c0c", padding: "4px 0", borderBottom: "1px solid #faf5eb" }}>
                      <strong>{t(a.descriptionMr, a.descriptionEn)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </PrintPage>
          </>
        )}

        {/* ══════ PAGE 3: Planet Positions ══════ */}
        <PrintPage>
          <PlanetTable planets={result.planets} combustion={result.enhancements?.combustion} />
        </PrintPage>

        {/* ══════ PAGE 4: Planet Strength ══════ */}
        <PrintPage>
          <StrengthSection strengths={result.analysis.planetaryStrength} />
        </PrintPage>

        {/* ══════ PAGE 5: Yogas ══════ */}
        <PrintPage>
          <YogaSection yogas={result.analysis.yogas} />
        </PrintPage>

        {/* ══════ PAGE 6: Doshas ══════ */}
        <PrintPage>
          <DoshaSection doshas={result.analysis.doshas} />
        </PrintPage>

        {/* ══════ Predictions: split 4/page (3 pages) ══════ */}
        <PrintPage>
          <PredictionSection predictions={result.analysis.housePredictions.slice(0, 4)} />
        </PrintPage>
        <PrintPage>
          <PredictionSection predictions={result.analysis.housePredictions.slice(4, 8)} />
        </PrintPage>
        <PrintPage>
          <PredictionSection predictions={result.analysis.housePredictions.slice(8, 12)} />
        </PrintPage>

        {/* ══════ Deep BPHS House-Lord predictions: 4/page ══════ */}
        {result.enhancements?.housePredictions && result.enhancements.housePredictions.length > 0 && (
          <>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.housePredictions.slice(0, 4)} />
            </PrintPage>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.housePredictions.slice(4, 8)} />
            </PrintPage>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.housePredictions.slice(8, 12)} />
            </PrintPage>
          </>
        )}

        {/* ══════ Planet-in-Bhava predictions: 5/page ══════ */}
        {result.enhancements?.planetBhavaPredictions && result.enhancements.planetBhavaPredictions.length > 0 && (
          <>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.planetBhavaPredictions.slice(0, 5)} title="ग्रहांच्या भाव-स्थिती फल" subtitle="Planets in Bhavas (BPHS)" />
            </PrintPage>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.planetBhavaPredictions.slice(5, 9)} title="ग्रहांच्या भाव-स्थिती फल" subtitle="Planets in Bhavas (BPHS)" />
            </PrintPage>
          </>
        )}

        {/* ══════ Planet-in-Rashi predictions: 5/page ══════ */}
        {result.enhancements?.planetRashiPredictions && result.enhancements.planetRashiPredictions.length > 0 && (
          <>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.planetRashiPredictions.slice(0, 5)} title="ग्रहांच्या राशी-स्थिती फल" subtitle="Planets in Rashis (BPHS)" />
            </PrintPage>
            <PrintPage>
              <DeepPredictionSection predictions={result.enhancements.planetRashiPredictions.slice(5, 9)} title="ग्रहांच्या राशी-स्थिती फल" subtitle="Planets in Rashis (BPHS)" />
            </PrintPage>
          </>
        )}

        {/* ══════ Lagna Life Areas: 6 per page ══════ */}
        {result.enhancements?.lagnaLifeAreas && result.enhancements.lagnaLifeAreas.length > 0 && (
          <PrintPage>
            <DeepPredictionSection predictions={result.enhancements.lagnaLifeAreas} title="लग्नानुसार जीवन क्षेत्रे" subtitle="Lagna Life Areas (6 areas)" />
          </PrintPage>
        )}

        {/* ══════ Nakshatra Deep + Panchang Fal: combined page ══════ */}
        {(result.enhancements?.nakshatraDeep || result.enhancements?.panchangFal) && (
          <PrintPage>
            <PanchangNakshatraFalPage nakshatraDeep={result.enhancements?.nakshatraDeep} panchangFal={result.enhancements?.panchangFal} />
          </PrintPage>
        )}

        {/* ══════ PAGE 8: Current Dasha ══════ */}
        <PrintPage>
          <DashaSection interp={result.analysis.currentDasha} />
        </PrintPage>

        {/* ══════ Dasha Timeline: mahadashas ══════ */}
        <PrintPage>
          <PrintTimelineMahadashas dashas={result.dashas} />
        </PrintPage>

        {/* ══════ Dasha Timeline: current mahadasha antardashas ══════ */}
        <PrintPage>
          <PrintTimelineAntardashas dashas={result.dashas} />
        </PrintPage>

        {/* ══════ Pratyantar Dasha (3rd level) ══════ */}
        {(() => {
          const now = new Date();
          const currentMaha = result.dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
          const currentAntar = currentMaha?.antardashas?.find(ad => now >= new Date(ad.startDate) && now <= new Date(ad.endDate));
          if (!currentMaha || !currentAntar) return null;
          // Calculate pratyantar dashas for current antardasha
          const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
          const DASHA_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
          const antarYears = currentAntar.years;
          const antarStart = new Date(currentAntar.startDate);
          const startIdx = DASHA_LORDS.indexOf(currentAntar.lord);
          const pratyantars: { lord: string; start: Date; end: Date; current: boolean }[] = [];
          let pDate = new Date(antarStart);
          for (let j = 0; j < 9; j++) {
            const pIdx = (startIdx + j) % 9;
            const pLord = DASHA_LORDS[pIdx];
            const pYears = (antarYears * DASHA_YEARS[pLord]) / 120;
            const pStart = new Date(pDate);
            const pEnd = new Date(pDate);
            pEnd.setFullYear(pEnd.getFullYear() + Math.floor(pYears));
            pEnd.setMonth(pEnd.getMonth() + Math.floor((pYears % 1) * 12));
            pEnd.setDate(pEnd.getDate() + Math.floor(((pYears % 1) * 12 % 1) * 30));
            const isCurrent = now >= pStart && now <= pEnd;
            pratyantars.push({ lord: pLord, start: pStart, end: pEnd, current: isCurrent });
            pDate = new Date(pEnd);
          }
          const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
          const lordMr = (l: string) => ({ Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" }[l] || l);
          return (
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>{t("प्रत्यंतर दशा (३ रा स्तर)", "Pratyantar Dasha (3rd Level)")}</h2>
              <p style={{ fontSize: "10px", color: "#8b6b4a", marginBottom: "12px" }}>
                {t("महादशा", "Mahadasha")}: {t(lordMr(currentMaha.lord), currentMaha.lord)} → {t("अंतर्दशा", "Antardasha")}: {t(lordMr(currentAntar.lord), currentAntar.lord)} → {t("प्रत्यंतर दशा", "Pratyantar")}
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead><tr>{[t("प्रत्यंतर दशा", "Pratyantar"), t("प्रारंभ", "Start"), t("अंत", "End"), t("स्थिती", "Status")].map((h, i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "6px 8px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {pratyantars.map((p, i) => (
                    <tr key={i} style={{ background: p.current ? "#FFF8E7" : i % 2 === 1 ? "#fdfbf6" : "white" }}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>
                        {t(lordMr(currentMaha.lord), currentMaha.lord)}-{t(lordMr(currentAntar.lord), currentAntar.lord)}-<span style={{ color: "#d4a843" }}>{t(lordMr(p.lord), p.lord)}</span>
                      </td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{fmtDate(p.start)}</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{fmtDate(p.end)}</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0" }}>
                        {p.current && <span style={{ display: "inline-block", background: "#fff3e0", color: "#e65100", fontSize: "9px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{t("चालू", "Current")}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintPage>
          );
        })()}

        {/* ══════ Birth Panchang ══════ */}
        {result.enhancements?.birthPanchang && (
          <PrintPage>
            <BirthPanchangSection data={result.enhancements.birthPanchang} balance={result.enhancements.balanceDasha} ashtottari={result.enhancements.ashtottariBalance} />
          </PrintPage>
        )}

        {/* ══════ Mangal Dosh (detail) ══════ */}
        {result.mangalDosh && (
          <PrintPage>
            <MangalDoshSection data={result.mangalDosh} />
          </PrintPage>
        )}

        {/* ══════ Kalsarp Dosh (detail) — split top/bottom, paginate remedies ══════ */}
        {result.kalsarpDosh && (
          <>
            <PrintPage>
              <KalsarpDoshSection data={result.kalsarpDosh} chunk="top" />
            </PrintPage>
            {result.kalsarpDosh.present && (() => {
              const rem = result.kalsarpDosh!.remediesMr || [];
              const perPage = 7;
              const pages = Math.max(1, Math.ceil(rem.length / perPage));
              return Array.from({ length: pages }, (_, i) => (
                <PrintPage key={`kalsarp-rem-${i}`}>
                  <KalsarpDoshSection data={result.kalsarpDosh} chunk="bottom" remedySlice={[i * perPage, (i + 1) * perPage]} />
                </PrintPage>
              ));
            })()}
          </>
        )}

        {/* ══════ Shadbala (split: table+balakrama / remedies paginated 2/page) ══════ */}
        {result.shadBala && (
          <>
            <PrintPage>
              <ShadBalaSection data={result.shadBala} chunk="top" />
            </PrintPage>
            {(() => {
              const weakPlanets = result.shadBala.planets.filter(p => !p.isStrong && p.remediesMr && p.remediesMr.length);
              const pages = Math.ceil(weakPlanets.length / 2);
              return Array.from({ length: pages }, (_, i) => (
                <PrintPage key={`shadbala-rem-${i}`}>
                  <ShadBalaSection data={result.shadBala} chunk="bottom" planetSlice={[i * 2, (i + 1) * 2]} />
                </PrintPage>
              ));
            })()}
          </>
        )}

        {/* ══════ Ashtakvarga (split: SAV+houses / bhinnashtaka+remedies) ══════ */}
        {result.ashtakvarga && (
          <>
            <PrintPage>
              <AshtakvargaSection data={result.ashtakvarga} chunk="top" />
            </PrintPage>
            <PrintPage>
              <AshtakvargaSection data={result.ashtakvarga} chunk="bottom" />
            </PrintPage>
          </>
        )}

        {/* ══════ Sarvatobhadra (split: table / chakra+remedies) ══════ */}
        {result.sarvatobhadra && (
          <>
            <PrintPage>
              <SarvatobhadraSection data={result.sarvatobhadra} chunk="top" />
            </PrintPage>
            <PrintPage>
              <SarvatobhadraSection data={result.sarvatobhadra} chunk="bottom" />
            </PrintPage>
          </>
        )}

        {/* ══════ Jaimini (split: atma+ishta / karakamsha+charakarakas) ══════ */}
        {result.jaimini && (
          <>
            <PrintPage>
              <JaiminiSection data={result.jaimini} chunk="top" />
            </PrintPage>
            <PrintPage>
              <JaiminiSection data={result.jaimini} chunk="bottom" />
            </PrintPage>
          </>
        )}

        {/* ══════ Mitra-Shatru Chakra ══════ */}
        {result.mitraShatru && (
          <PrintPage>
            <MitraShatruSection data={result.mitraShatru} />
          </PrintPage>
        )}

        {/* ══════ Asta-Yuddha (Combustion & Planetary War) ══════ */}
        {(result.combustionDetails || result.grahaYuddha) && (
          <PrintPage>
            <AstaYuddhaSection combustion={result.combustionDetails} yuddha={result.grahaYuddha} />
          </PrintPage>
        )}

        {/* ══════ Bhava Bala ══════ */}
        {result.bhavaBala && (
          <PrintPage>
            <BhavaBalaSection data={result.bhavaBala} />
          </PrintPage>
        )}

        {/* ══════ Marriage Timing (header / windows 5/page / remedies) ══════ */}
        {result.marriageTiming && (
          <>
            <PrintPage>
              <MarriageTimingSection data={result.marriageTiming} chunk="header" />
            </PrintPage>
            {(() => {
              const windowsPerPage = 5;
              const totalWindows = result.marriageTiming.windows.length;
              const pages = Math.max(1, Math.ceil(totalWindows / windowsPerPage));
              return Array.from({ length: pages }, (_, i) => (
                <PrintPage key={`mar-win-${i}`}>
                  <MarriageTimingSection data={result.marriageTiming} chunk="windows" windowSlice={[i * windowsPerPage, (i + 1) * windowsPerPage]} />
                </PrintPage>
              ));
            })()}
            <PrintPage>
              <MarriageTimingSection data={result.marriageTiming} chunk="remedies" />
            </PrintPage>
          </>
        )}

        {/* ══════ Career Timing (header / windows 5/page) ══════ */}
        {result.careerTiming && (
          <>
            <PrintPage>
              <CareerTimingSection data={result.careerTiming} chunk="header" />
            </PrintPage>
            {(() => {
              const windowsPerPage = 5;
              const totalWindows = result.careerTiming.windows.length;
              const pages = Math.max(1, Math.ceil(totalWindows / windowsPerPage));
              return Array.from({ length: pages }, (_, i) => (
                <PrintPage key={`car-win-${i}`}>
                  <CareerTimingSection data={result.careerTiming} chunk="windows" windowSlice={[i * windowsPerPage, (i + 1) * windowsPerPage]} />
                </PrintPage>
              ));
            })()}
          </>
        )}

        {/* ══════ Deep Dasha (split: pratyantars / sookshmas) ══════ */}
        {result.deepDasha && (
          <>
            <PrintPage>
              <DeepDashaSection data={result.deepDasha} chunk="top" />
            </PrintPage>
            {((result.deepDasha.currentPratyantar?.sookshmas?.length ?? 0) > 0 || result.deepDasha.nextMilestoneMr) && (
              <PrintPage>
                <DeepDashaSection data={result.deepDasha} chunk="bottom" />
              </PrintPage>
            )}
          </>
        )}

        {/* ══════ Names Suggestion (Nakshatra Letters) ══════ */}
        {result.namesSuggestion && (
          <PrintPage>
            <NamesSection data={result.namesSuggestion} />
          </PrintPage>
        )}

        {/* ══════ Upagrahas (split: table / descriptions) ══════ */}
        {result.upagrahas && (
          <>
            <PrintPage>
              <UpagrahaSection data={result.upagrahas} chunk="top" />
            </PrintPage>
            <PrintPage>
              <UpagrahaSection data={result.upagrahas} chunk="bottom" />
            </PrintPage>
          </>
        )}

        {/* ══════ Gochar Naadi (split: table / descriptions) ══════ */}
        {result.gocharNaadi && (
          <>
            <PrintPage>
              <GocharNaadiSection data={result.gocharNaadi} chunk="top" />
            </PrintPage>
            <PrintPage>
              <GocharNaadiSection data={result.gocharNaadi} chunk="bottom" />
            </PrintPage>
          </>
        )}

        {/* ══════ Vimshopak Bala ══════ */}
        {result.vimshopakBala && (
          <PrintPage>
            <VimshopakBalaSection data={result.vimshopakBala} />
          </PrintPage>
        )}

        {/* ══════ Remedies: 2 categories per page ══════ */}
        {(() => {
          const cats = result.analysis.remedies;
          const perPage = 2;
          const pages = Math.max(1, Math.ceil(cats.length / perPage));
          return Array.from({ length: pages }, (_, i) => {
            const chunk = cats.slice(i * perPage, (i + 1) * perPage);
            const isLast = i === pages - 1;
            return (
              <PrintPage key={`rem-${i}`}>
                <RemedySection remedies={chunk} />
                {isLast && (
                  <div style={{ margin: "20px 0", padding: "14px 18px", borderLeft: "3px solid #d4a843" }}>
                    <p style={{ fontSize: "9px", color: "#8b6b4a", lineHeight: 1.6 }}>
                      <strong>{t("अस्वीकरण:", "Disclaimer:")}</strong> {t("ही पत्रिका लाहिरी अयनांश पद्धतीवर आधारित अचूक खगोलीय गणनेद्वारे तयार केली आहे. ज्योतिषशास्त्र हे मार्गदर्शनासाठी आहे, अंतिम निर्णयासाठी नाही.", "This patrika is generated using precise astronomical calculations (Lahiri Ayanamsha). Astrology is for guidance, not final decisions.")} — Bhaagyavedh
                    </p>
                  </div>
                )}
              </PrintPage>
            );
          });
        })()}

      </div>

      <KundliChatDrawer chartContext={{
        lagnaRashi: result.lagnaRashi,
        lagnaRashiMr: result.lagnaRashiMr,
        lagnaDMS: result.lagnaDMS,
        moonRashi: result.moonRashi,
        moonRashiMr: result.moonRashiMr,
        moonNakshatra: result.moonNakshatra,
        moonPada: result.moonPada,
        ayanamsa: result.ayanamsa,
        planets: result.planets.map((p) => ({
          id: p.id,
          rashi: p.rashi,
          rashiMr: p.rashiMr,
          degreeDMS: p.degreeDMS,
          house: p.house,
          nakshatra: p.nakshatra,
          pada: p.pada,
          isRetrograde: p.isRetrograde,
        })),
        yogaSummary: result.analysis.yogas.filter((y) => y.strength !== "weak").slice(0, 8).map((y) => ({ name: y.nameEn, type: y.type })),
        doshaSummary: result.analysis.doshas.filter((d) => d.present).map((d) => ({ name: d.nameEn, severity: d.severity })),
        currentDashaSummary: (() => {
          const now = new Date();
          const d = result.dashas.find((d) => now >= new Date(d.startDate) && now <= new Date(d.endDate));
          const ad = d?.antardashas?.find((a) => now >= new Date(a.startDate) && now <= new Date(a.endDate));
          return d ? { mahadasha: d.lord, antardasha: ad?.lord, endsAt: d.endDate } : null;
        })(),
      }} />
    </div>
  );
}

export default function KundliResultClient() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" /></div>}>
      <KundliResultContent />
    </Suspense>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function findChart(charts: DivisionalChartData[] | undefined, id: string): DivisionalChartData | null {
  return charts?.find(c => c.id === id) || null;
}

// ─── Reusable North Indian Chart SVG ────────────────────────────

const CHART_PLANET_ABBR: Record<string, { mr: string; en: string }> = {
  Sun: { mr: "र", en: "Su" },
  Moon: { mr: "चं", en: "Mo" },
  Mars: { mr: "मं", en: "Ma" },
  Mercury: { mr: "बु", en: "Me" },
  Jupiter: { mr: "गु", en: "Ju" },
  Venus: { mr: "शु", en: "Ve" },
  Saturn: { mr: "श", en: "Sa" },
  Rahu: { mr: "रा", en: "Ra" },
  Ketu: { mr: "के", en: "Ke" },
};

const RASHI_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 25 }, 2: { x: 100, y: 15 }, 3: { x: 15, y: 100 },
  4: { x: 25, y: 200 }, 5: { x: 15, y: 300 }, 6: { x: 100, y: 385 },
  7: { x: 200, y: 375 }, 8: { x: 300, y: 385 }, 9: { x: 385, y: 300 },
  10: { x: 375, y: 200 }, 11: { x: 385, y: 100 }, 12: { x: 300, y: 15 },
};

const PLANET_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 115 }, 2: { x: 100, y: 55 }, 3: { x: 55, y: 100 },
  4: { x: 115, y: 200 }, 5: { x: 55, y: 300 }, 6: { x: 100, y: 345 },
  7: { x: 200, y: 285 }, 8: { x: 300, y: 345 }, 9: { x: 345, y: 300 },
  10: { x: 285, y: 200 }, 11: { x: 345, y: 100 }, 12: { x: 300, y: 55 },
};

const DIAMOND_HOUSES_NI = new Set([1, 4, 7, 10]);
const THIN_TRIANGLES_NI = new Set([2, 3, 5, 6, 8, 9, 11, 12]);

function getChartLayoutRules(n: number, house: number) {
  if (n <= 2) return { fontSize: 13, lineH: 14, useAbbrev: false, cols: 1 };
  if (n === 3) return { fontSize: 11, lineH: 12, useAbbrev: false, cols: 1 };
  if (n === 4) return { fontSize: 10, lineH: 11, useAbbrev: false, cols: 1 };
  if (n === 5) {
    if (DIAMOND_HOUSES_NI.has(house)) return { fontSize: 10, lineH: 11, useAbbrev: false, cols: 2 };
    return { fontSize: 9, lineH: 10, useAbbrev: false, cols: 1 };
  }
  if (DIAMOND_HOUSES_NI.has(house)) return { fontSize: 9, lineH: 10, useAbbrev: false, cols: 2 };
  return { fontSize: 9, lineH: 10, useAbbrev: THIN_TRIANGLES_NI.has(house), cols: 1 };
}

type NIPlanet = { id: string; nameMr: string; name?: string; isRetrograde: boolean };

function NorthIndianChartSVG({
  houseMap,
  label,
  lagnaRashi,
}: {
  houseMap: Record<number, NIPlanet[]>;
  label?: string;
  lagnaRashi: number;
}) {
  const { t, lang } = useLang();
  const stroke = "#8b2c2c";
  const bg = "#fafaf8";
  const rashiColor = "#8b2c2c";
  const planetColor = "#1f2937";
  const retroColor = "#dc2626";
  const labelColor = "#dc2626";

  const rashiFor = (house: number) => ((lagnaRashi + house - 1) % 12) + 1;
  const nMr = (v: number) => String(v).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[parseInt(d)]);

  const renderPlanet = (p: NIPlanet, x: number, y: number, fontSize: number, useAbbrev: boolean) => {
    const abbr = CHART_PLANET_ABBR[p.id];
    const base = useAbbrev && abbr ? (lang === "mr" ? abbr.mr : abbr.en) : t(p.nameMr, p.name || p.id);
    const retroMark = p.isRetrograde ? t("(व)", "(R)") : "";
    return (
      <text
        key={`${p.id}-${x}-${y}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill={p.isRetrograde ? retroColor : planetColor}
        style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 3, strokeLinejoin: "round" }}
      >
        {base}
        {retroMark}
      </text>
    );
  };

  return (
    <svg viewBox="-12 -12 424 424" className="w-full max-w-md" style={{ background: bg, border: `2px solid ${stroke}` }}>
      <rect x="0" y="0" width="400" height="400" fill="none" stroke={stroke} strokeWidth="2" />
      <line x1="0" y1="0" x2="400" y2="400" stroke={stroke} strokeWidth="1.5" />
      <line x1="400" y1="0" x2="0" y2="400" stroke={stroke} strokeWidth="1.5" />
      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke={stroke} strokeWidth="1.5" />

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
        const planets = houseMap[house] || [];
        const n = planets.length;
        const rules = getChartLayoutRules(n, house);
        const ra = RASHI_ANCHORS_NI[house];
        const pa = PLANET_ANCHORS_NI[house];

        let planetNodes: React.ReactNode[] = [];
        if (rules.cols === 2 && n >= 5) {
          const half = Math.ceil(n / 2);
          const left = planets.slice(0, half);
          const right = planets.slice(half);
          const dx = 28;
          const renderCol = (col: NIPlanet[], xOff: number) =>
            col.map((p, i) => {
              const off = (i - (col.length - 1) / 2) * rules.lineH;
              return renderPlanet(p, pa.x + xOff, pa.y + off, rules.fontSize, rules.useAbbrev);
            });
          planetNodes = [...renderCol(left, -dx / 2), ...renderCol(right, dx / 2)];
        } else {
          planetNodes = planets.map((p, i) => {
            const off = (i - (n - 1) / 2) * rules.lineH;
            return renderPlanet(p, pa.x, pa.y + off, rules.fontSize, rules.useAbbrev);
          });
        }

        const rashiText = lang === "mr" ? nMr(rashiFor(house)) : String(rashiFor(house));

        return (
          <g key={house}>
            <text
              x={ra.x}
              y={ra.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="700"
              fill={rashiColor}
              style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 4, strokeLinejoin: "round" }}
            >
              {rashiText}
            </text>
            {house === 1 && label && (
              <text
                x={pa.x}
                y={pa.y - (n === 0 ? 0 : Math.ceil(n / 2) * rules.lineH + 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill={labelColor}
                style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 3, strokeLinejoin: "round" }}
              >
                {label}
              </text>
            )}
            {planetNodes}
          </g>
        );
      })}
    </svg>
  );
}

function getChartLagnaRashi(planets: ChartPlanetData[]): number {
  if (!planets.length) return 0;
  const ref = planets[0];
  return ((ref.rashiIndex - (ref.house - 1)) % 12 + 12) % 12;
}

// ─── Sub Components ─────────────────────────────────────────────

function DivisionalChartSection({ chart, description }: { chart: DivisionalChartData | null; description: string }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);

  if (!chart) return <p className="text-stone-500">{t("चार्ट उपलब्ध नाही","Chart not available")}</p>;

  const houseMap: Record<number, ChartPlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  chart.planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div className="print-avoid-break">
      <OrnateHeader title={t(chart.nameMr, chart.name, chart.nameMr)} subtitle={description} />
      <div className="flex justify-center mb-6 p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)", border: "2px double #d4a843" }}>
        <NorthIndianChartSVG houseMap={houseMap} label={chart.id === "chandra" ? t("चंद्र","Moon") : undefined} lagnaRashi={getChartLagnaRashi(chart.planets)} />
      </div>
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह","Graha")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("राशी","Rashi")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("भाव","Bhava")}</th>
              <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("वक्री","Vakri")}</th>
            </tr>
          </thead>
          <tbody>
            {chart.planets.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-3 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{t(p.nameMr, p.name)}</td>
                <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{t(p.rashiMr, p.rashi)}</td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{n(p.house)}</td>
                <td className="px-3 py-2 text-center italic" style={{ color: p.isRetrograde ? "#b91c1c" : "rgba(92,26,26,0.5)", fontFamily: "serif" }}>{p.isRetrograde ? t("वक्री","Vakri") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AllChartsGrid({ planets, divisionalCharts, lagnaRashi }: { planets: PlanetData[]; divisionalCharts: DivisionalChartData[]; lagnaRashi: number }) {
  const { t } = useLang();

  const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
    const map: Record<number, typeof planetList> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
    return map;
  };

  const lagnaMap = buildHouseMap(planets);

  const allCharts = [
    { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: lagnaMap, label: t("लग्न", "Asc"), lagnaRashi },
    ...divisionalCharts.map(c => ({
      id: c.id,
      name: t(c.nameMr, c.name),
      houseMap: buildHouseMap(c.planets),
      label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
      lagnaRashi: getChartLagnaRashi(c.planets),
    })),
  ];

  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("सर्व कुंडली चार्ट", "Sarva Kundli Chakra", "सर्व कुंडली चक्र")}
        subtitle={t("लग्न व षोडशवर्ग कुंडल्या", "Lagna and divisional charts", "लग्न व षोडशवर्ग कुंडलियाँ")}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCharts.map((chart) => (
          <div key={chart.id} className="text-center p-3 print-avoid-break rounded-xl" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
            border: "1.5px solid #d4a843",
          }}>
            <h3 className="text-sm font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              ॥ {chart.name} ॥
            </h3>
            <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSection({ planets, lagnaRashi }: { planets: PlanetData[]; lagnaRashi: number }) {
  const { t } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("लग्न कुंडली", "Lagna Kundli", "लग्न कुंडली")}
        subtitle={t("उत्तर भारतीय पद्धती", "North Indian style", "उत्तर भारतीय शैली")}
      />
      <div className="flex justify-center p-5 rounded-xl" style={{
        background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
        border: "2px double #d4a843",
      }}>
        <NorthIndianChartSVG houseMap={houseMap} label={t("लग्न","Asc")} lagnaRashi={lagnaRashi} />
      </div>
    </div>
  );
}

function PlanetTable({ planets, combustion }: { planets: PlanetData[]; combustion?: { id: string; isCombust: boolean; distance: number }[] }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("निरयण ग्रह स्पष्ट", "Nirayana Graha Spashta", "निरयण ग्रह स्पष्ट")}
        subtitle={t("लाहिरी अयनांश अनुसार ग्रहांची स्थिती", "Planetary positions with Lahiri Ayanamsha", "लाहिरी अयनांश से ग्रह स्थिति")}
      />
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह","Graha")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("राशी","Rashi")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("अंश","Amsha")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("नक्षत्र","Nakshatra")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("स्वामी","Swami")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("पद","Pada")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("भाव","Bhava")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("वक्री","Vakri")}</th>
              <th className="px-2 py-2 text-center" style={{ fontFamily: "serif" }}>{t("अस्त","Asta")}</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p, i) => {
              const comb = combustion?.find(c => c.id === p.id);
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                  <td className="px-2 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{t(p.nameMr, p.name||p.id)}</td>
                  <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t(p.rashiMr, p.rashi)}</td>
                  <td className="px-2 py-2 text-center font-mono" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.2)" }}>{n(p.degreeDMS)}</td>
                  <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t(p.nakshatraMr, p.nakshatra)}</td>
                  <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t(PLANET_LORD_MR[p.nakshatraLord] || p.nakshatraLord, p.nakshatraLord)}</td>
                  <td className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{n(p.pada)}</td>
                  <td className="px-2 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{n(p.house)}</td>
                  <td className="px-2 py-2 text-center italic" style={{ color: p.isRetrograde ? "#b91c1c" : "rgba(92,26,26,0.5)", borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{p.isRetrograde ? t("वक्री","Vakri") : "—"}</td>
                  <td className="px-2 py-2 text-center italic" style={{ color: comb?.isCombust ? "#b91c1c" : "rgba(92,26,26,0.5)", fontFamily: "serif" }}>{comb?.isCombust ? t("अस्त","Asta") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StrengthSection({ strengths }: { strengths: PlanetStrengthData[] }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  const strengthColor = (s: number) => s >= 75 ? "#1d7d3a" : s >= 50 ? "#b8860b" : s >= 25 ? "#c97226" : "#b91c1c";
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("ग्रह बल विचार", "Graha Bala Vichara", "ग्रह बल विचार")}
        subtitle={t("ग्रहांची स्थिती व बल विश्लेषण", "Planetary dignity and strength analysis", "ग्रहों की स्थिति व बल विश्लेषण")}
      />
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह","Graha")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("स्थिती","Sthiti")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("भाव","Bhava")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("बल","Bala")}</th>
              <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("विशेष","Vishesha")}</th>
            </tr>
          </thead>
          <tbody>
            {strengths.map((s, i) => (
              <tr key={s.id} className="print-avoid-break" style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-3 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{t(s.nameMr, s.nameEn)}</td>
                <td className="px-3 py-2 text-center italic" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{t(s.dignityMr, s.dignityEn)}</td>
                <td className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.3)" }}>{n(s.house)}</td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: strengthColor(s.strengthScore), borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {n(s.strengthScore)}%
                </td>
                <td className="px-3 py-2 text-center italic" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                  {s.isRetrograde && s.id !== "Rahu" && s.id !== "Ketu" ? t("वक्री","Vakri") : ""}
                  {s.isCombust ? t(" अस्त"," Asta") : ""}
                  {!(s.isRetrograde && s.id !== "Rahu" && s.id !== "Ketu") && !s.isCombust ? "—" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Traditional ornate helpers ──────────────────────────────

function OrnateHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-5" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843", borderRadius: "12px", padding: "14px 12px" }}>
      <div className="text-[10px] tracking-widest text-[#5c1a1a]/70 mb-1">॥ श्रीगणेशाय नमः ॥</div>
      <h2 className="text-xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>॥ {title} ॥</h2>
      {subtitle && <div className="text-[11px] text-[#5c1a1a]/70 mt-1 italic">{subtitle}</div>}
    </div>
  );
}

function OrnateCard({ children, tint }: { children: React.ReactNode; tint?: "cream" | "maroon" | "green" | "red" | "gold" }) {
  const bg =
    tint === "maroon" ? "linear-gradient(180deg, #FFF3D6, #FFE9B8)" :
    tint === "green" ? "linear-gradient(180deg, #F5FBEE, #EAF5D8)" :
    tint === "red" ? "linear-gradient(180deg, #FDF3EC, #F9E5D4)" :
    tint === "gold" ? "linear-gradient(180deg, #FFF8E7, #FFF3D6)" :
    "#FFFDF5";
  return (
    <div className="p-4 print-avoid-break mb-4" style={{ background: bg, border: "2px double #d4a843", borderRadius: "12px" }}>
      {children}
    </div>
  );
}

function verdictTextColor(status: "benefic" | "malefic" | "neutral" | "present" | "absent"): string {
  if (status === "benefic" || status === "absent") return "#1d7d3a";
  if (status === "malefic" || status === "present") return "#b91c1c";
  return "#b8860b";
}

function YogaSection({ yogas }: { yogas: YogaData[] }) {
  const { t, lang } = useLang();
  const typeLabel = (type: "benefic" | "malefic" | "neutral") =>
    type === "benefic" ? t("शुभ योग", "Shubha Yoga", "शुभ योग") :
    type === "malefic" ? t("अशुभ योग", "Ashubha Yoga", "अशुभ योग") :
    t("समयोग", "Samayoga", "समयोग");
  const strengthMr = (s: string) => s === "strong" ? "तीव्र" : s === "moderate" ? "मध्यम" : "मंद";
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("योग विश्लेषण", "Yoga Vishleshana", "योग विश्लेषण")}
        subtitle={t("कुंडलीतील विशेष ग्रह-संयोगांचे वर्णन", "Special planetary combinations in the chart", "कुंडली में विशेष ग्रह-संयोग")}
      />
      {yogas.length === 0 ? (
        <OrnateCard tint="cream">
          <p className="text-center text-[#5c1a1a]/70 italic" style={{ fontFamily: "serif" }}>
            {t("कोणतेही विशेष योग नाहीत.", "No special yogas found.", "कोई विशेष योग नहीं।")}
          </p>
        </OrnateCard>
      ) : (
        <div className="space-y-4">
          {yogas.map((y, i) => (
            <div key={i} className="print-avoid-break p-4 rounded-xl" style={{
              background: y.type === "benefic" ? "linear-gradient(180deg, #F5FBEE, #EAF5D8)" :
                          y.type === "malefic" ? "linear-gradient(180deg, #FDF3EC, #F9E5D4)" :
                          "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
              border: "1.5px solid #d4a843",
              borderLeft: `4px solid ${verdictTextColor(y.type)}`,
            }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-base" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  ॥ {lang === "mr" ? y.nameMr : y.nameEn} ॥
                </h4>
                <div className="text-right">
                  <div className="text-[11px] font-bold italic" style={{ color: verdictTextColor(y.type), fontFamily: "serif" }}>
                    {typeLabel(y.type)}
                  </div>
                  <div className="text-[10px] text-[#5c1a1a]/60">
                    {lang === "mr" ? strengthMr(y.strength) : y.strength}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
                {t(y.descriptionMr, y.descriptionEn)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoshaSection({ doshas }: { doshas: DoshaData[] }) {
  const { t, lang } = useLang();
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("दोष विश्लेषण", "Dosha Vishleshana", "दोष विश्लेषण")}
        subtitle={t("ग्रहदोषांचे निदान व शांती उपाय", "Planetary afflictions and remedies", "ग्रह दोष व उपाय")}
      />
      <div className="space-y-4">
        {doshas.map((d, i) => (
          <div key={i} className="print-avoid-break p-4 rounded-xl" style={{
            background: d.present ? "linear-gradient(180deg, #FDF3EC, #F9E5D4)" : "linear-gradient(180deg, #F5FBEE, #EAF5D8)",
            border: "1.5px solid #d4a843",
            borderLeft: `4px solid ${verdictTextColor(d.present ? "present" : "absent")}`,
          }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-base" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                ॥ {lang === "mr" ? d.nameMr : d.nameEn} ॥
              </h4>
              <span className="text-[11px] font-bold italic" style={{ color: verdictTextColor(d.present ? "present" : "absent"), fontFamily: "serif" }}>
                {d.present ? t("उपस्थित", "Upasthita", "उपस्थित") : t("अनुपस्थित", "Anupasthita", "अनुपस्थित")}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#5c1a1a" }}>
              {t(d.descriptionMr, d.descriptionEn)}
            </p>
            {d.present && (
              <div className="rounded-lg p-3" style={{ background: "#FFFDF5", border: "1px solid rgba(212,168,67,0.4)" }}>
                <div className="text-[11px] font-bold mb-1 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  ॥ {t("उपाय", "Upaya (Remedy)", "उपाय")} ॥
                </div>
                <p className="text-sm" style={{ color: "#5c1a1a" }}>{t(d.remedyMr, d.remedyEn)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MangalDoshSection({ data }: { data?: MangalDoshData }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const pickArr = (mr: string[], en: string[], hi: string[]) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("मंगळ दोष विचार", "Mangal Dosha Vichara", "मंगल दोष विचार")}
        subtitle={t("लग्न, चंद्र व शुक्रापासून मंगळ स्थिती · परिहार · शांती उपाय", "Mars position from Lagna, Moon, Venus · Cancellations · Remedies", "लग्न, चंद्र व शुक्र से मंगल स्थिति · परिहार · उपाय")}
      />

      <div className="p-4 rounded-xl mb-4" style={{
        background: data.present ? "linear-gradient(180deg, #FDF3EC, #F9E5D4)" : "linear-gradient(180deg, #F5FBEE, #EAF5D8)",
        border: "2px double #d4a843",
      }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="font-bold text-sm" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {pick(data.summaryMr, data.summaryEn, data.summaryHi)}
          </p>
          <span className="text-[12px] font-bold italic px-3 py-1 rounded" style={{
            color: verdictTextColor(data.present ? "present" : "absent"),
            background: "#FFFDF5",
            border: `1px solid ${verdictTextColor(data.present ? "present" : "absent")}40`,
            fontFamily: "serif",
          }}>
            {data.present ? `॥ ${pick(data.severityMr, data.severityEn, data.severityHi)} ॥` : `॥ ${t("निर्दोष", "Nirdosha", "निर्दोष")} ॥`}
          </span>
        </div>
        {data.present && (
          <div className="text-xs mt-3 pt-2 grid grid-cols-2 md:grid-cols-4 gap-2" style={{ color: "#5c1a1a", borderTop: "1px dotted #d4a843" }}>
            <span><b>{t("लग्नापासून", "From Lagna", "लग्न से")}:</b> {data.fromLagna ? "✓" : "—"}</span>
            <span><b>{t("चंद्रापासून", "From Moon", "चंद्र से")}:</b> {data.fromMoon ? "✓" : "—"}</span>
            <span><b>{t("शुक्रापासून", "From Venus", "शुक्र से")}:</b> {data.fromVenus ? "✓" : "—"}</span>
            <span><b>{t("मंगळ राशी", "Mars Rashi", "मंगल राशि")}:</b> {lang === "mr" ? data.marsRashiMr : data.marsRashi}</span>
          </div>
        )}
      </div>

      {data.affectedAreasMr.length > 0 && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
          <h4 className="text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("प्रभावित क्षेत्रे", "Prabhavita Kshetra", "प्रभावित क्षेत्र")} ॥
          </h4>
          <ul className="space-y-1">
            {pickArr(data.affectedAreasMr, data.affectedAreasEn, data.affectedAreasHi).map((a, i) => (
              <li key={i} className="text-sm pl-3" style={{ color: "#5c1a1a", borderLeft: "2px solid #d4a843" }}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {data.cancellations.length > 0 && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
          <h4 className="text-[13px] font-bold mb-2 italic text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("परिहार", "Parihara (Cancellations)", "परिहार")} ॥
          </h4>
          <ul className="space-y-1 text-sm" style={{ color: "#5c1a1a" }}>
            {pickArr(data.cancellationsMr, data.cancellations, data.cancellationsHi).map((c, i) => (
              <li key={i} className="text-center" style={{ fontFamily: "serif" }}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {data.present && (
        <div className="p-4 rounded-xl" style={{ background: "#FFFDF5", border: "2px double #d4a843" }}>
          <h4 className="text-[13px] font-bold mb-3 italic text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("शांती उपाय", "Shanti Upaya", "शांति उपाय")} ॥
          </h4>
          <ul className="space-y-2">
            {pickArr(data.remediesMr, data.remediesEn, data.remediesHi).map((r, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: "#5c1a1a" }}>
                <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(i + 1)}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function KalsarpDoshSection({ data, chunk = "full", remedySlice }: { data?: KalsarpDoshData; chunk?: "full" | "top" | "bottom"; remedySlice?: [number, number] }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const pickArr = (mr: string[], en: string[], hi: string[]) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";
  const fullRemedies = pickArr(data.remediesMr, data.remediesEn, data.remediesHi);
  const [startIdx, endIdx] = remedySlice ?? [0, fullRemedies.length];
  const remedies = fullRemedies.slice(startIdx, endIdx);
  return (
    <div className="print-avoid-break">
      {showTop && (
        <>
          <OrnateHeader
            title={t("काळसर्प दोष विचार", "Kalasarpa Dosha Vichara", "कालसर्प दोष विचार")}
            subtitle={t("राहू-केतू अक्षात ग्रहस्थिती · १२ प्रकार · त्र्यंबकेश्वर शांती", "Planets between Rahu-Ketu axis · 12 types · Trimbakeshwar shanti", "राहु-केतु अक्ष में ग्रह · 12 प्रकार · त्र्यंबकेश्वर शांति")}
          />

          <div className="p-4 rounded-xl mb-4" style={{
            background: data.present ? "linear-gradient(180deg, #F5EFFA, #EEE2F5)" : "linear-gradient(180deg, #F5FBEE, #EAF5D8)",
            border: "2px double #d4a843",
          }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <p className="font-bold text-sm" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                {pick(data.summaryMr, data.summaryEn, data.summaryHi)}
              </p>
              <span className="text-[12px] font-bold italic px-3 py-1 rounded" style={{
                color: data.present ? "#6b21a8" : "#1d7d3a",
                background: "#FFFDF5",
                border: `1px solid ${data.present ? "#6b21a840" : "#1d7d3a40"}`,
                fontFamily: "serif",
              }}>
                {data.present ? `॥ ${data.partial ? t("आंशिक", "Anshika", "आंशिक") : t("पूर्ण", "Purna", "पूर्ण")} ॥` : `॥ ${t("निर्दोष", "Nirdosha", "निर्दोष")} ॥`}
              </span>
            </div>
            {data.present && (
              <div className="text-xs mt-3 pt-2 grid grid-cols-2 md:grid-cols-4 gap-2" style={{ color: "#5c1a1a", borderTop: "1px dotted #d4a843" }}>
                <span><b>{t("प्रकार", "Prakara", "प्रकार")}:</b> <span style={{ fontFamily: "serif", color: "#3d0c0c" }}>{pick(data.typeMr, data.typeEn, data.typeHi)}</span></span>
                <span><b>{t("राहू स्थान", "Rahu Bhava", "राहु भाव")}:</b> {num(data.rahuHouse)}</span>
                <span><b>{t("केतू स्थान", "Ketu Bhava", "केतु भाव")}:</b> {num(data.ketuHouse)}</span>
                <span><b>{t("दिशा", "Disha", "दिशा")}:</b> {data.udit ? t("उदित", "Udita", "उदित") : t("अनुदित", "Anudita", "अनुदित")}</span>
              </div>
            )}
          </div>

          {data.present && (
            <>
              <div className="p-4 rounded-xl mb-4" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
                <h4 className="text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  ॥ {t("फल", "Phala (Effects)", "फल")} ॥
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
                  {pick(data.effectsMr, data.effectsEn, data.effectsHi)}
                </p>
              </div>

              <div className="p-4 rounded-xl mb-4" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
                <h4 className="text-[13px] font-bold mb-2 italic text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  ॥ {t("शिफारस केलेले तीर्थक्षेत्र", "Sifarasu Tirthakshetra", "अनुशंसित तीर्थक्षेत्र")} ॥
                </h4>
                <p className="text-sm text-center leading-relaxed mb-3" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                  {pick(data.yatraRecommendationMr, data.yatraRecommendationEn, data.yatraRecommendationHi)}
                </p>
                <div className="text-center">
                  <a href="/temples/trimbakeshwar" className="inline-block text-xs font-bold px-4 py-2 rounded text-white" style={{ background: "#3d0c0c", border: "1px solid #d4a843", fontFamily: "serif" }}>
                    ॥ {t("त्र्यंबकेश्वर दर्शन →", "Trimbakeshwar Darshan →", "त्र्यंबकेश्वर दर्शन →")} ॥
                  </a>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {showBottom && data.present && remedies.length > 0 && (
        <div className="p-4 rounded-xl" style={{ background: "#FFFDF5", border: "2px double #d4a843" }}>
          <h4 className="text-[13px] font-bold mb-3 italic text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("शांती उपाय", "Shanti Upaya", "शांति उपाय")}{remedySlice && fullRemedies.length > endIdx - startIdx ? ` (${num(startIdx + 1)}–${num(Math.min(endIdx, fullRemedies.length))})` : ""} ॥
          </h4>
          <ul className="space-y-2">
            {remedies.map((r, i) => (
              <li key={i} className="text-sm flex gap-2" style={{ color: "#5c1a1a" }}>
                <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(startIdx + i + 1)}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ShadBalaSection({ data, chunk = "full", planetSlice }: { data?: ShadBalaData; chunk?: "full" | "top" | "bottom"; planetSlice?: [number, number] }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const verdictColor = (v: string) =>
    v === "very strong" ? "#1d7d3a" :
    v === "strong" ? "#2d6b2d" :
    v === "average" ? "#b8860b" :
    v === "weak" ? "#c97226" :
    "#b91c1c";

  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break">
      {showTop && <>
      {/* Ornate traditional header */}
      <div className="text-center mb-5" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843", borderRadius: "12px", padding: "14px 12px" }}>
        <div className="text-[10px] tracking-widest text-[#5c1a1a]/70 mb-1">॥ श्रीगणेशाय नमः ॥</div>
        <h2 className="text-xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("षड्बल गणना", "Shadbala Ganana", "षड्बल गणना")} ॥
        </h2>
        <div className="text-[11px] text-[#5c1a1a]/70 mt-1 italic">
          {t("स्थान · दिक् · काल · चेष्टा · नैसर्गिक · दृक्", "Sthana · Dik · Kala · Chesta · Naisargika · Drik", "स्थान · दिक् · काल · चेष्टा · नैसर्गिक · दृक्")}
        </div>
      </div>

      {/* Summary shloka-style */}
      <div className="mb-5 text-center px-4 py-3 rounded-lg" style={{ background: "#FFFDF5", border: "1px solid rgba(212,168,67,0.4)" }}>
        <p className="text-sm text-[#3d0c0c]" style={{ fontFamily: "serif" }}>
          {pick(data.summaryMr, data.summaryEn, data.summaryHi)}
        </p>
      </div>

      {/* Traditional panchang-style table */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-3 text-center font-bold" style={{ borderRight: "1px solid rgba(212,168,67,0.4)" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{t("स्थान", "Sthāna", "स्थान")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{t("दिक्", "Dik", "दिक्")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{t("काल", "Kāla", "काल")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{t("चेष्टा", "Cheṣṭā", "चेष्टा")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{t("नैसर्गिक", "Naisargika", "नैसर्गिक")}</th>
              <th className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)" }}>{t("दृक्", "Dṛk", "दृक्")}</th>
              <th className="px-3 py-3 text-center font-bold" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", background: "rgba(212,168,67,0.15)" }}>{t("योग (रूप)", "Total (Rūpa)", "योग (रूप)")}</th>
              <th className="px-3 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)" }}>{t("आवश्यक", "Required", "आवश्यक")}</th>
              <th className="px-3 py-3 text-center">{t("संज्ञा", "Sanjñā", "संज्ञा")}</th>
            </tr>
          </thead>
          <tbody>
            {data.planets.map((p, i) => (
              <tr key={p.id} style={{
                background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7",
                borderTop: "1px solid rgba(212,168,67,0.3)",
              }}>
                <td className="px-3 py-3 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? p.nameMr : p.nameEn}
                </td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(p.sthana)}</td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(p.dig)}</td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(p.kala)}</td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(p.chesta)}</td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(p.naisargika)}</td>
                <td className="px-2 py-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(p.drik)}</td>
                <td className="px-3 py-3 text-center font-bold" style={{
                  color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)",
                  background: "rgba(212,168,67,0.08)",
                }}>
                  {num(p.total)}
                </td>
                <td className="px-3 py-3 text-center text-stone-500" style={{ borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(p.required)}</td>
                <td className="px-3 py-3 text-center font-bold" style={{ color: verdictColor(p.verdict), fontFamily: "serif" }}>
                  {pick(p.verdictMr, p.verdictEn, p.verdictHi)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
              <td className="px-3 py-2 text-[11px] text-center italic" colSpan={10}>
                {t("६० रूप = १ अंश · पूर्णबल प्रमाणानुसार संज्ञा निर्धारित", "60 Rūpa = 1 Point · Sanjñā determined by Pūrṇabala proportion", "60 रूप = 1 अंश · संज्ञा पूर्णबल प्रमाण से निर्धारित")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Rank order — traditional list */}
      <div className="mt-5 rounded-lg p-4" style={{ background: "#FFF8E7", border: "1px solid rgba(212,168,67,0.3)" }}>
        <h4 className="text-sm font-bold mb-2 text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("बलक्रम", "Balakrama (Rank Order)", "बलक्रम")} ॥
        </h4>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
          {[...data.planets].sort((a, b) => a.strengthRank - b.strengthRank).map((p, i) => (
            <span key={p.id}>
              <span className="font-bold text-[#3d0c0c]">{num(i + 1)}.</span>{" "}
              {lang === "mr" ? p.nameMr : p.nameEn}
              <span className="text-[11px] text-stone-500"> ({num(p.total)})</span>
              {i < data.planets.length - 1 && <span className="text-[#d4a843] mx-2">॥</span>}
            </span>
          ))}
        </div>
      </div>
      </>}

      {/* Remedies for weak planets */}
      {showBottom && data.planets.filter(p => !p.isStrong).length > 0 && (
        <div className="mt-6">
          <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("क्षीण ग्रहांसाठी शांती उपाय", "Shanti Upaya for Weak Planets", "क्षीण ग्रहों के लिए शांति उपाय")} ॥
          </h3>
          <div className="space-y-4">
            {data.planets.filter(p => !p.isStrong && p.remediesMr && p.remediesMr.length).slice(planetSlice?.[0] ?? 0, planetSlice?.[1]).map((p) => {
              const remedies = lang === "en" ? p.remediesEn : lang === "hi" ? p.remediesHi : p.remediesMr;
              return (
                <div key={p.id} className="p-4 rounded-xl" style={{
                  background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
                  border: "1.5px solid #d4a843",
                  borderLeft: "4px solid #c97226",
                }}>
                  <h4 className="text-[13px] font-bold mb-2 pb-2 italic" style={{
                    color: "#3d0c0c", fontFamily: "serif", borderBottom: "1px dotted #d4a843",
                  }}>
                    ॥ {lang === "mr" ? p.nameMr : p.nameEn} — {pick(p.verdictMr, p.verdictEn, p.verdictHi)} ({num(p.percentOfRequired)}%) ॥
                  </h4>
                  <ul className="space-y-2 mt-2">
                    {remedies?.map((r, i) => (
                      <li key={i} className="text-sm flex gap-2 leading-relaxed" style={{ color: "#5c1a1a" }}>
                        <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(i + 1)}.</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AshtakvargaSection({ data, chunk = "full" }: { data?: AshtakvargaData; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const savColor = (b: number) =>
    b >= 33 ? "#1d7d3a" :
    b >= 28 ? "#2d6b2d" :
    b >= 25 ? "#b8860b" :
    "#b91c1c";

  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("अष्टकवर्ग", "Ashtakavarga", "अष्टकवर्ग")}
        subtitle={t("भिन्नाष्टक + सर्वाष्टक · ८ स्त्रोतांचे बिंदू", "Bhinnashtaka + Sarvashtaka · 8-source bindu (points)", "भिन्नाष्टक + सर्वाष्टक · 8 स्रोतों के बिंदु")}
      />

      <div className="p-4 rounded-xl text-center" style={{
        background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)",
        border: "2px double #d4a843",
      }}>
        <p className="text-sm font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {pick(data.summaryMr, data.summaryEn, data.summaryHi)}
        </p>
      </div>

      {/* Sarvashtakvarga — 12 rashi bindus */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("सर्वाष्टकवर्ग (SAV)", "Sarvashtakavarga (SAV)", "सर्वाष्टकवर्ग (SAV)")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-2 py-2" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("राशी", "Rashi", "राशि")}</th>
                {data.rashiNames.map((r, i) => (
                  <th key={i} className="px-1 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>
                    {lang === "mr" ? r.mr : r.en.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#FFFDF5" }}>
                <td className="px-2 py-3 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>SAV</td>
                {data.sarvashtaka.map((b, i) => (
                  <td key={i} className="px-1 py-3 text-center font-bold" style={{
                    color: savColor(b),
                    borderRight: "1px solid rgba(212,168,67,0.2)",
                    fontFamily: "serif",
                    background: b >= 33 ? "rgba(29,125,58,0.1)" : b < 25 ? "rgba(185,28,28,0.08)" : "transparent",
                  }}>{num(b)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-center italic mt-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          ३३+ {t("अत्यंत प्रबळ", "Ati Prabala", "अत्यंत प्रबल")} · २८-३२ {t("प्रबळ", "Prabala", "प्रबल")} · २५-२७ {t("मध्यम", "Madhyama", "मध्यम")} · &lt;२५ {t("क्षीण", "Ksheena", "क्षीण")}
        </p>
      </div>

      {/* House strength */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("भाव बल — लग्नापासून", "Bhava Bala from Lagna", "भाव बल — लग्न से")} ॥
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {data.houseStrength.map((h) => {
            const borderCol = h.verdict === "very strong" ? "#1d7d3a" : h.verdict === "strong" ? "#2d6b2d" : h.verdict === "average" ? "#b8860b" : "#b91c1c";
            return (
              <div key={h.house} className="p-2 text-xs rounded-lg" style={{
                background: "#FFFDF5",
                border: "1px solid rgba(212,168,67,0.4)",
                borderLeft: `3px solid ${borderCol}`,
              }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>भाव {num(h.house)}</span>
                  <span className="font-bold text-sm" style={{ color: borderCol, fontFamily: "serif" }}>{num(h.sav)}</span>
                </div>
                <div style={{ color: "#5c1a1a", fontFamily: "serif" }}>{lang === "mr" ? h.rashiMr : h.rashiEn}</div>
                <div className="text-[10px] italic mt-0.5" style={{ color: borderCol, fontFamily: "serif" }}>
                  {pick(h.verdictMr, h.verdictEn, h.verdictHi)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      </>}
      {showBottom && <>
      {/* Bhinnashtakvarga — per-planet bindu table */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("भिन्नाष्टकवर्ग", "Bhinnashtakavarga", "भिन्नाष्टकवर्ग")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
                {data.rashiNames.map((r, i) => (
                  <th key={i} className="px-1 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>
                    {lang === "mr" ? r.mr : r.en.slice(0, 3)}
                  </th>
                ))}
                <th className="px-2 py-2 text-center" style={{ background: "rgba(212,168,67,0.15)", fontFamily: "serif" }}>{t("योग", "Yoga", "योग")}</th>
              </tr>
            </thead>
            <tbody>
              {data.bhinnashtaka.map((p, i) => (
                <tr key={p.planetId} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                  <td className="px-2 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {lang === "mr" ? p.planetMr : p.planetEn}
                  </td>
                  {p.bindus.map((b, j) => (
                    <td key={j} className="px-1 py-2 text-center" style={{
                      color: b >= 5 ? "#1d7d3a" : b <= 2 ? "#b91c1c" : "#5c1a1a",
                      fontWeight: b >= 5 ? "bold" : "normal",
                      borderRight: "1px solid rgba(212,168,67,0.2)",
                    }}>{num(b)}</td>
                  ))}
                  <td className="px-2 py-2 text-center font-bold" style={{
                    color: "#3d0c0c",
                    background: "rgba(212,168,67,0.08)",
                    fontFamily: "serif",
                  }}>{num(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remedies for weak houses */}
      {data.houseStrength.filter(h => h.verdict === "weak").length > 0 && (
        <div>
          <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("क्षीण भावांसाठी शांती उपाय", "Shanti Upaya for Weak Bhavas", "क्षीण भावों के लिए शांति उपाय")} ॥
          </h3>
          <div className="space-y-4">
            {data.houseStrength.filter(h => h.verdict === "weak" && h.remediesMr && h.remediesMr.length).map((h) => {
              const remedies = lang === "en" ? h.remediesEn : lang === "hi" ? h.remediesHi : h.remediesMr;
              return (
                <div key={h.house} className="p-4 rounded-xl" style={{
                  background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
                  border: "1.5px solid #d4a843",
                  borderLeft: "4px solid #b91c1c",
                }}>
                  <h4 className="text-[13px] font-bold mb-2 pb-2 italic" style={{
                    color: "#3d0c0c", fontFamily: "serif", borderBottom: "1px dotted #d4a843",
                  }}>
                    ॥ {t(`${num(h.house)}वा भाव`, `House ${h.house}`, `${num(h.house)}वां भाव`)} ({lang === "mr" ? h.rashiMr : h.rashiEn}) — SAV {num(h.sav)} · {pick(h.verdictMr, h.verdictEn, h.verdictHi)} ॥
                  </h4>
                  <ul className="space-y-2 mt-2">
                    {remedies?.map((r, i) => (
                      <li key={i} className="text-sm flex gap-2 leading-relaxed" style={{ color: "#5c1a1a" }}>
                        <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(i + 1)}.</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </>}
    </div>
  );
}

function SarvatobhadraSection({ data, chunk = "full" }: { data?: SarvatobhadraData; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const PLANET_ABBR: Record<string, string> = {
    Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के",
  };

  const ratingColor =
    data.rating === 5 ? "#1d7d3a" :
    data.rating === 4 ? "#2d6b2d" :
    data.rating === 3 ? "#b8860b" :
    data.rating === 2 ? "#c97226" : "#b91c1c";

  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("सर्वतोभद्र चक्र", "Sarvatobhadra Chakra", "सर्वतोभद्र चक्र")}
        subtitle={t("जन्म नक्षत्रापासून गोचर वेध · सध्याच्या शुभाशुभाचे निदान", "Transit vedha from Janma nakshatra · current auspiciousness", "जन्म नक्षत्र से गोचर वेध · वर्तमान शुभाशुभ")}
      />

      <div className="p-4 rounded-xl" style={{
        background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)",
        border: "2px double #d4a843",
      }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-sm font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {pick(data.summaryMr, data.summaryEn, data.summaryHi)}
          </p>
          <div style={{ color: "#d4a843", fontSize: "18px" }}>{"★".repeat(data.rating)}{"☆".repeat(5 - data.rating)}</div>
        </div>
        <div className="flex flex-wrap gap-4 text-xs mt-2 pt-2" style={{ color: "#5c1a1a", borderTop: "1px dotted #d4a843", fontFamily: "serif" }}>
          <span style={{ color: "#1d7d3a" }}>◉ {t("शुभ", "Shubha", "शुभ")}: <b>{num(data.auspiciousCount)}</b></span>
          <span style={{ color: "#b91c1c" }}>◉ {t("अशुभ", "Ashubha", "अशुभ")}: <b>{num(data.inauspiciousCount)}</b></span>
          <span style={{ color: "#b8860b" }}>◉ {t("तटस्थ", "Samya", "तटस्थ")}: <b>{num(data.neutralCount)}</b></span>
          <span className="ml-auto italic" style={{ color: ratingColor }}>॥ {pick(data.verdictMr, data.verdictEn, data.verdictHi)} ॥</span>
        </div>
      </div>

      {/* Transit vedha table */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("गोचर ग्रह व वेध", "Gochara Graha & Vedha", "गोचर ग्रह व वेध")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("अंतर", "Antara", "अंतर")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("वेध", "Vedha", "वेध")}</th>
                <th className="px-2 py-2 text-center" style={{ fontFamily: "serif" }}>{t("प्रभाव", "Prabhava", "प्रभाव")}</th>
              </tr>
            </thead>
            <tbody>
              {data.transits.map((tp, i) => {
                const eCol = tp.effect === "auspicious" ? "#1d7d3a" : tp.effect === "inauspicious" ? "#b91c1c" : "#b8860b";
                return (
                  <tr key={tp.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                    <td className="px-2 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                      {lang === "mr" ? tp.nameMr : tp.nameEn}
                    </td>
                    <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                      {lang === "mr" ? tp.nakshatraMr : tp.nakshatraEn}
                    </td>
                    <td className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(tp.offsetFromNatal)}</td>
                    <td className="px-2 py-2 text-center italic" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                      {tp.vedhaType ? pick(tp.vedhaTypeMr ?? "", tp.vedhaTypeEn ?? "", tp.vedhaTypeHi ?? "") : "—"}
                    </td>
                    <td className="px-2 py-2 text-center font-bold italic" style={{ color: eCol, fontFamily: "serif" }}>
                      {tp.effect === "auspicious" ? t("शुभ", "Shubha", "शुभ") :
                       tp.effect === "inauspicious" ? t("अशुभ", "Ashubha", "अशुभ") :
                       t("सम्य", "Samya", "सम्य")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      </>}
      {showBottom && <>
      {/* 27-cell nakshatra wheel */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("नक्षत्र चक्र", "Nakshatra Chakra", "नक्षत्र चक्र")} ॥
        </h3>
        <p className="text-[11px] text-center italic mb-3" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          {t("सोनेरी = जन्म · हिरवा = शुभ वेध · लाल = अशुभ वेध · ग्रहचिन्ह = गोचर", "Gold = natal · Green = auspicious · Red = inauspicious · Symbol = transit", "सोनेरी = जन्म · हरा = शुभ · लाल = अशुभ · चिह्न = गोचर")}
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {data.grid.slice(0, 27).map((cell, i) => {
            const isAuspicious = cell.vedhaType && ["karma", "desha", "manasa", "maanas"].includes(cell.vedhaType);
            const isInauspicious = cell.vedhaType && ["janma", "sanghatik", "samudaya", "jati", "adhana", "naidhana", "vinasha", "vainashika"].includes(cell.vedhaType);
            return (
              <div
                key={i}
                className="relative rounded-lg p-1.5 text-[10px] min-h-[64px]"
                style={{
                  background: cell.isNatal ? "linear-gradient(180deg, #FFF3D6, #FFE9B8)" :
                              isAuspicious ? "linear-gradient(180deg, #F5FBEE, #EAF5D8)" :
                              isInauspicious ? "linear-gradient(180deg, #FDF3EC, #F9E5D4)" :
                              "#FFFDF5",
                  border: cell.isNatal ? "2px double #d4a843" :
                          isAuspicious ? "1.5px solid #1d7d3a" :
                          isInauspicious ? "1.5px solid #b91c1c" :
                          "1px solid rgba(212,168,67,0.4)",
                  boxShadow: cell.isNatal ? "0 0 0 2px rgba(212,168,67,0.4)" : undefined,
                }}
                title={cell.vedhaType ?? ""}
              >
                <div className="font-bold leading-tight" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  {lang === "mr" ? cell.nakshatraMr : cell.nakshatraEn}
                </div>
                {cell.vedhaType && (
                  <div className="text-[10px] italic leading-tight" style={{ color: isAuspicious ? "#1d7d3a" : isInauspicious ? "#b91c1c" : "rgba(92,26,26,0.6)" }}>
                    {cell.vedhaType}
                  </div>
                )}
                {cell.transitPlanets.length > 0 && (
                  <div className="absolute bottom-0.5 right-0.5 flex flex-wrap gap-0.5 max-w-[40px] justify-end">
                    {cell.transitPlanets.map((p) => (
                      <span key={p} className="text-[10px] font-bold px-1 rounded leading-tight" style={{
                        background: "#3d0c0c", color: "#d4a843", border: "1px solid #d4a843", fontFamily: "serif",
                      }}>
                        {PLANET_ABBR[p] ?? p.slice(0, 2)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Vedha remedies */}
      {data.remediesMr && data.remediesMr.length > 0 && (
        <div className="p-4 rounded-xl" style={{
          background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
          border: "2px double #d4a843",
          borderLeft: `4px solid ${ratingColor}`,
        }}>
          <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("वर्तमान गोचरांसाठी शांती उपाय", "Shanti Upaya for Current Transits", "वर्तमान गोचर हेतु शांति उपाय")} ॥
          </h3>
          <ul className="space-y-2">
            {(lang === "en" ? data.remediesEn : lang === "hi" ? data.remediesHi : data.remediesMr)?.map((r, i) => (
              <li key={i} className="text-sm flex gap-2 leading-relaxed" style={{ color: "#5c1a1a" }}>
                <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(i + 1)}.</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      </>}
    </div>
  );
}

function BirthPanchangSection({ data, balance, ashtottari }: { data?: EnhancementsData["birthPanchang"]; balance?: EnhancementsData["balanceDasha"]; ashtottari?: EnhancementsData["ashtottariBalance"] }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const rows: { labelMr: string; labelEn: string; value: string }[] = [
    { labelMr: "वार", labelEn: "Day (Vara)", value: data.day },
    { labelMr: "सूर्योदय", labelEn: "Sunrise", value: num(data.sunrise) },
    { labelMr: "सूर्यास्त", labelEn: "Sunset", value: num(data.sunset) },
    { labelMr: "दिनमान", labelEn: "Day Duration (Dinmana)", value: num(data.dinman) },
    { labelMr: "तिथी", labelEn: "Tithi", value: data.tithi },
    { labelMr: "पक्ष", labelEn: "Paksha", value: data.paksha },
    { labelMr: "योग", labelEn: "Yoga", value: data.yoga },
    { labelMr: "करण", labelEn: "Karana", value: data.karana },
    { labelMr: "मास", labelEn: "Masa (Month)", value: data.masa },
    { labelMr: "नक्षत्र पाया", labelEn: "Nakshatra Paya", value: lang === "en" ? data.nakshatraPayaEn : data.nakshatraPayaMr },
    { labelMr: "शक संवत्", labelEn: "Shaka Samvat", value: num(data.shakaSamvat) },
  ];

  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("जन्म पंचांग", "Janma Panchanga", "जन्म पंचांग")}
        subtitle={t("जन्म क्षणी पंचांगाचे पाच अंग व विम्शोत्तरी बाल दशा", "Five elements of Panchanga at birth + Balance of Dasha", "जन्म समय पंचांग व शेष दशा")}
      />
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-4 py-3 font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif", width: "40%" }}>
                  ॥ {t(r.labelMr, r.labelEn, r.labelMr)} ॥
                </td>
                <td className="px-4 py-3" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                  {r.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {balance && balance.lordMr !== "—" && (
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
            <h4 className="text-center text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              ॥ {t("विंशोत्तरी भोग्यदशा", "Vimshottari Balance", "विंशोत्तरी भोग्यदशा")} ॥
            </h4>
            <p className="text-center text-[11px] italic mb-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
              {t("१२० वर्षे चक्र · जन्म नक्षत्र स्वामी", "120-year cycle · Moon nakshatra lord", "120 वर्ष चक्र · जन्म नक्षत्र स्वामी")}
            </p>
            <p className="text-center text-sm" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
              {t(`${balance.lordMr} महादशा`, `${balance.lordEn} Mahadasha`, `${balance.lordMr} महादशा`)}
              <span className="font-bold block mt-1" style={{ color: "#3d0c0c" }}>
                {num(balance.years)} {t("वर्षे", "y", "वर्ष")} · {num(balance.months)} {t("महिने", "m", "माह")} · {num(balance.days)} {t("दिवस", "d", "दिन")}
              </span>
            </p>
          </div>
        )}
        {ashtottari && ashtottari.lordMr !== "—" && (
          <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
            <h4 className="text-center text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              ॥ {t("अष्टोत्तरी भोग्यदशा", "Ashtottari Balance", "अष्टोत्तरी भोग्यदशा")} ॥
            </h4>
            <p className="text-center text-[11px] italic mb-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
              {t("१०८ वर्षे चक्र · महाराष्ट्रीय परंपरा", "108-year cycle · Maharashtrian tradition", "108 वर्ष चक्र · महाराष्ट्रीय परंपरा")}
            </p>
            <p className="text-center text-sm" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
              {t(`${ashtottari.lordMr} महादशा`, `${ashtottari.lordEn} Mahadasha`, `${ashtottari.lordMr} महादशा`)}
              <span className="font-bold block mt-1" style={{ color: "#3d0c0c" }}>
                {num(ashtottari.years)} {t("वर्षे", "y", "वर्ष")} · {num(ashtottari.months)} {t("महिने", "m", "माह")} · {num(ashtottari.days)} {t("दिवस", "d", "दिन")}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function JaiminiSection({ data, chunk = "full" }: { data?: JaiminiData; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";
  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("आत्मकारक व इष्टदेवता", "Atmakaraka & Ishta Devata", "आत्मकारक व इष्टदेवता")}
        subtitle={t("जैमिनी सूत्रानुसार आत्म्याचा कारक व उपास्य देव", "Per Jaimini Sutras — soul significator and personal deity", "जैमिनी सूत्र — आत्मा कारक व उपास्य देव")}
      />

      {/* Atmakaraka card */}
      <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <h4 className="text-center text-[13px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("आत्मकारक", "Atmakaraka", "आत्मकारक")} ॥
        </h4>
        <div className="text-center">
          <p className="text-2xl font-bold mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {lang === "mr" ? data.atmakarakaNameMr : data.atmakarakaNameEn}
          </p>
          <p className="text-sm" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
            {t("सर्वोच्च अंश असलेला ग्रह", "Planet with highest degree in sign", "सर्वोच्च अंश वाला ग्रह")} — {num(data.atmakarakaDegree)}° {t("अंश", "Amsha", "अंश")} · {lang === "mr" ? data.atmakarakaRashiMr : data.atmakarakaRashiEn} {t("राशी", "Rashi", "राशि")}
          </p>
          <p className="text-[11px] italic mt-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
            {t("आत्मा, जीवन उद्देश व कर्मबंधनाचे प्रतीक — हा ग्रह बलवान करून मोक्षमार्गाकडे वाटचाल.", "Signifies the soul, life purpose and karmic signature — strengthening this planet aids the path to moksha.", "आत्मा, जीवन उद्देश व कर्म बंधन का प्रतीक — इस ग्रह को बलवान करने से मोक्ष मार्ग सुगम.")}
          </p>
        </div>
      </div>

      {/* Ishta Devata card */}
      <div className="p-5 rounded-xl" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)", border: "2px double #d4a843", borderLeft: "4px solid #d4a843" }}>
        <h4 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("इष्टदेवता", "Ishta Devata (Personal Deity)", "इष्टदेवता")} ॥
        </h4>
        <p className="text-center text-[11px] italic mb-3" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          {t(`आत्मकारकाची द्वादशांश (D12) स्थिती: ${data.ishtaDevataRashiMr} राशी`, `Atmakaraka in Dwadashamsha (D12): ${data.ishtaDevataRashiEn}`, `आत्मकारक की द्वादशांश (D12) स्थिति: ${data.ishtaDevataRashiMr} राशि`)}
        </p>
        <p className="text-center text-2xl font-bold mb-3" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {pick(data.ishtaDevataMr, data.ishtaDevataEn, data.ishtaDevataHi)}
        </p>
        <div className="mb-3 p-3 rounded" style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.3)" }}>
          <p className="text-[11px] font-bold mb-1 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {t("बीज मंत्र", "Beej Mantra", "बीज मंत्र")}
          </p>
          <p className="text-sm text-center" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
            {t(data.mantraMr, data.mantraEn, data.mantraMr)}
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
          {pick(data.significanceMr, data.significanceEn, data.significanceHi)}
        </p>
      </div>

      </>}
      {showBottom && <>
      {/* Karakamsha */}
      <div className="p-4 rounded-xl text-center" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
        <h4 className="text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("कारकांश लग्न", "Karakamsha Lagna", "कारकांश लग्न")} ॥
        </h4>
        <p className="text-lg font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {lang === "mr" ? data.karakamshaRashiMr : data.karakamshaRashiEn} {t("राशी", "Rashi", "राशि")}
        </p>
        <p className="text-[11px] italic mt-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          {t("नवमांशातील आत्मकारकाची राशी — आध्यात्मिक प्रवृत्ती व अंतर्मनाची दिशा दर्शवते.", "Sign of Atmakaraka in Navamsha — reveals spiritual inclination and inner direction.", "नवमांश में आत्मकारक की राशि — आध्यात्मिक प्रवृत्ति व अंतर्मन की दिशा.")}
        </p>
      </div>

      {/* Chara Karakas table */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("सात चर कारक", "Seven Chara Karakas", "सात चर कारक")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("कारक", "Karaka", "कारक")}</th>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("अंश", "Degree", "अंश")}</th>
                <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("विषय", "Domain", "विषय")}</th>
              </tr>
            </thead>
            <tbody>
              {data.charakarakas.map((c, i) => (
                <tr key={c.role} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                  <td className="px-3 py-2 font-bold text-center italic" style={{ color: c.role === "AK" ? "#d4a843" : "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {lang === "mr" ? c.karakaMr : c.karakaEn}
                  </td>
                  <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {lang === "mr" ? c.nameMr : c.nameEn}
                  </td>
                  <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {num(c.degree)}°
                  </td>
                  <td className="px-3 py-2 text-center italic" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                    {c.roleMr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>}
    </div>
  );
}

function MitraShatruSection({ data }: { data?: MitraShatruData[] }) {
  const { t, lang } = useLang();
  if (!data || data.length === 0) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;

  const PLANET_IDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const relColor = (pancha: string) => {
    if (pancha.includes("अधिमित्र") || pancha.includes("Adhimitra")) return "#1d7d3a";
    if (pancha.includes("अधिशत्रू") || pancha.includes("Adhishatru")) return "#b91c1c";
    if (pancha === "मित्र" || pancha === "Mitra") return "#2d6b2d";
    if (pancha === "शत्रू" || pancha === "Shatru") return "#c97226";
    return "#5c1a1a";
  };

  // Abbreviation per planet for compact matrix
  const ABBR: Record<string, string> = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श" };
  const ABBR_EN: Record<string, string> = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa" };

  return (
    <div className="print-avoid-break space-y-5">
      <OrnateHeader
        title={t("मित्र-शत्रु चक्र", "Mitra-Shatru Chakra", "मित्र-शत्रु चक्र")}
        subtitle={t("नैसर्गिक + तात्कालिक मैत्री = पंचधा मैत्री", "Naisargika + Tatkalik = Panchadha Maitri", "नैसर्गिक + तात्कालिक मैत्री")}
      />

      {/* Panchadha matrix */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-2 py-2" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह ↓", "Planet ↓", "ग्रह ↓")}</th>
              {PLANET_IDS.map((pid) => (
                <th key={pid} className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>
                  {lang === "mr" ? ABBR[pid] : ABBR_EN[pid]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.planetId} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-2 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? row.planetMr : row.planetEn}
                </td>
                {PLANET_IDS.map((pid) => {
                  if (pid === row.planetId) {
                    return <td key={pid} className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", background: "rgba(212,168,67,0.15)" }}>—</td>;
                  }
                  const rel = row.relations.find((r) => r.otherId === pid);
                  if (!rel) return <td key={pid} className="px-2 py-2">—</td>;
                  const pancha = lang === "en" ? rel.panchadhaEn : rel.panchadha;
                  return (
                    <td key={pid} className="px-2 py-2 text-center italic font-bold" style={{
                      color: relColor(pancha),
                      borderRight: "1px solid rgba(212,168,67,0.2)",
                      fontFamily: "serif",
                      fontSize: "11px",
                    }}>
                      {pancha}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-[11px] italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
        ॥ {t("अधिमित्र > मित्र > सम > शत्रू > अधिशत्रू", "Adhimitra > Mitra > Sama > Shatru > Adhishatru", "अधिमित्र > मित्र > सम > शत्रू > अधिशत्रू")} ॥
      </p>
    </div>
  );
}

function AstaYuddhaSection({ combustion, yuddha }: { combustion?: CombustionDetailData[]; yuddha?: GrahaYuddhaData[] }) {
  const { t, lang } = useLang();
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const sevColor = (s: string) =>
    s === "severe" ? "#b91c1c" : s === "moderate" ? "#c97226" : s === "mild" ? "#b8860b" : "#1d7d3a";

  return (
    <div className="print-avoid-break space-y-5">
      <OrnateHeader
        title={t("अस्त व ग्रह युद्ध", "Asta & Graha Yuddha", "अस्त व ग्रह युद्ध")}
        subtitle={t("सूर्यसान्निध्य + १° अंतरातील ग्रह संघर्ष", "Proximity to Sun + Planetary war within 1°", "सूर्य सामीप्य + ग्रह युद्ध")}
      />

      {/* Combustion table */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("अस्त विचार (सूर्यसंग)", "Asta Vichara (Combustion)", "अस्त विचार (सूर्य सामीप्य)")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("अंतर", "Distance", "अंतर")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("सीमा", "Threshold", "सीमा")}</th>
                <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("अस्त", "Asta", "अस्त")}</th>
                <th className="px-2 py-2 text-center" style={{ fontFamily: "serif" }}>{t("तीव्रता", "Severity", "तीव्रता")}</th>
              </tr>
            </thead>
            <tbody>
              {(combustion || []).map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                  <td className="px-2 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {lang === "mr" ? c.nameMr : c.nameEn}
                  </td>
                  <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(c.distance)}°</td>
                  <td className="px-2 py-2 text-center" style={{ color: "rgba(92,26,26,0.7)", borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(c.threshold)}°</td>
                  <td className="px-2 py-2 text-center italic font-bold" style={{ color: c.isCombust ? "#b91c1c" : "#1d7d3a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                    {c.isCombust ? t("होय", "Yes", "हाँ") : t("नाही", "No", "नहीं")}
                  </td>
                  <td className="px-2 py-2 text-center italic font-bold" style={{ color: sevColor(c.severity), fontFamily: "serif" }}>
                    {pick(c.severityMr, c.severityEn, c.severityHi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Combust planet details */}
        <div className="mt-4 space-y-3">
          {(combustion || []).filter((c) => c.isCombust).map((c) => (
            <div key={c.id} className="p-4 rounded-xl" style={{
              background: "linear-gradient(180deg, #FDF3EC, #F9E5D4)",
              border: "1.5px solid #d4a843",
              borderLeft: `4px solid ${sevColor(c.severity)}`,
            }}>
              <h4 className="text-[13px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                ॥ {lang === "mr" ? c.nameMr : c.nameEn} — {pick(c.severityMr, c.severityEn, c.severityHi)} {t("अस्त", "Asta", "अस्त")} ({num(c.distance)}°) ॥
              </h4>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#5c1a1a" }}>
                {pick(c.effectMr, c.effectEn, c.effectHi)}
              </p>
              <div className="p-2 rounded" style={{ background: "#FFFDF5", border: "1px solid rgba(212,168,67,0.4)" }}>
                <p className="text-[11px] font-bold italic mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  {t("उपाय", "Upaya (Remedy)", "उपाय")}
                </p>
                <p className="text-sm" style={{ color: "#5c1a1a" }}>{pick(c.remedyMr, c.remedyEn, c.remedyHi)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graha Yuddha */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("ग्रह युद्ध", "Graha Yuddha", "ग्रह युद्ध")} ॥
        </h3>
        {yuddha && yuddha.length > 0 ? (
          <div className="space-y-3">
            {yuddha.map((y, i) => (
              <div key={i} className="p-4 rounded-xl" style={{
                background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
                border: "2px double #d4a843",
              }}>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <p className="font-bold text-sm" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                    ॥ {lang === "mr" ? y.planet1Mr : y.planet1} ⚔ {lang === "mr" ? y.planet2Mr : y.planet2} — {lang === "mr" ? y.rashiMr : y.rashiEn} {t("राशी", "rashi", "राशि")} ({num(y.distance)}°) ॥
                  </p>
                </div>
                <div className="flex gap-3 mb-2 flex-wrap">
                  <div className="flex-1 p-2 rounded text-center" style={{ background: "rgba(29,125,58,0.1)", border: "1px solid #1d7d3a" }}>
                    <p className="text-[10px] italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>{t("विजयी", "Winner", "विजयी")}</p>
                    <p className="font-bold text-sm" style={{ color: "#1d7d3a", fontFamily: "serif" }}>{lang === "mr" ? y.winnerMr : y.winner}</p>
                  </div>
                  <div className="flex-1 p-2 rounded text-center" style={{ background: "rgba(185,28,28,0.08)", border: "1px solid #b91c1c" }}>
                    <p className="text-[10px] italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>{t("पराजित", "Loser", "पराजित")}</p>
                    <p className="font-bold text-sm" style={{ color: "#b91c1c", fontFamily: "serif" }}>{lang === "mr" ? y.loserMr : y.loser}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-1" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                  {pick(y.reasonMr, y.reasonEn, y.reasonHi)}
                </p>
                <p className="text-[12px] italic" style={{ color: "rgba(92,26,26,0.8)" }}>
                  {pick(y.effectMr, y.effectEn, y.effectHi)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl text-center" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
            <p className="text-sm italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
              ॥ {t("कोणतेही ग्रह युद्ध नाही — सर्व ग्रह परस्परांपासून सुरक्षित अंतरावर.", "No planetary war — all planets at safe mutual distance.", "कोई ग्रह युद्ध नहीं — सभी ग्रह परस्पर सुरक्षित दूरी पर.")} ॥
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BhavaBalaSection({ data }: { data?: BhavaBalaData[] }) {
  const { t, lang } = useLang();
  if (!data || data.length === 0) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const verdictColor = (v: string) =>
    v === "very strong" ? "#1d7d3a" :
    v === "strong" ? "#2d6b2d" :
    v === "average" ? "#b8860b" :
    "#b91c1c";

  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("भाव बल", "Bhava Bala (House Strength)", "भाव बल")}
        subtitle={t("भावाधिपती + भाव दिग् + भाव दृष्टि = एकूण भाव बल", "Bhavadhipati + Bhav Dig + Bhav Drishti = total Bhava Bala", "भावाधिपति + भाव दिग् + भाव दृष्टि")}
      />

      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("भाव", "Bhava", "भाव")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("राशी", "Rashi", "राशि")}</th>
              <th className="px-2 py-2 text-left" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("विषय", "Subject", "विषय")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("अधिपति", "Adhipati", "अधिपति")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif" }}>{t("दिग्", "Dig", "दिग्")}</th>
              <th className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("दृष्टि", "Drishti", "दृष्टि")}</th>
              <th className="px-2 py-2 text-center font-bold" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif", background: "rgba(212,168,67,0.15)" }}>{t("योग", "Total", "योग")}</th>
              <th className="px-2 py-2 text-center" style={{ fontFamily: "serif" }}>{t("संज्ञा", "Sanjna", "संज्ञा")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((h, i) => (
              <tr key={h.house} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-2 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {num(h.house)}
                </td>
                <td className="px-2 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? h.rashiMr : h.rashiEn}
                </td>
                <td className="px-2 py-2 text-left italic" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif", fontSize: "12px" }}>
                  {lang === "mr" ? h.subjectMr : h.subjectEn}
                </td>
                <td className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(h.bhavAdhipati)}</td>
                <td className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)" }}>{num(h.bhavDig)}</td>
                <td className="px-2 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.3)" }}>{num(h.bhavDrishti)}</td>
                <td className="px-2 py-2 text-center font-bold" style={{
                  color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)",
                  background: "rgba(212,168,67,0.08)", fontFamily: "serif",
                }}>{num(h.total)}</td>
                <td className="px-2 py-2 text-center font-bold italic" style={{ color: verdictColor(h.verdict), fontFamily: "serif" }}>
                  {pick(h.verdictMr, h.verdictEn, h.verdictHi)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
              <td className="px-3 py-2 text-[11px] text-center italic" colSpan={8}>
                {t("१४०+ अत्यंत प्रबळ · ११०-१३९ प्रबळ · ८५-१०९ मध्यम · <८५ क्षीण", "140+ Very Strong · 110-139 Strong · 85-109 Average · <85 Weak", "140+ अत्यंत प्रबल · 110-139 प्रबल · 85-109 मध्यम · <85 क्षीण")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function TimingWindowsTable({ windows, lang, t }: { windows: TimingWindowData[]; lang: string; t: (mr: string, en: string, hi?: string) => string }) {
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  // Green 7+ = strong/favorable. Yellow 5-7 = moderate/mixed. Red <5 = weak/challenging.
  const scoreColor = (s: number) => s >= 7 ? "#1d7d3a" : s >= 5 ? "#b8860b" : "#c0392b";
  const scoreBg = (s: number) => s >= 7 ? "#e8f5e9" : s >= 5 ? "#fff8e1" : "#fdecea";
  const scoreLabel = (s: number) => s >= 7 ? { mr: "अनुकूल", en: "Favourable", hi: "अनुकूल" } : s >= 5 ? { mr: "मध्यम", en: "Moderate", hi: "मध्यम" } : { mr: "आव्हान", en: "Challenging", hi: "चुनौतीपूर्ण" };
  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "short", day: "numeric" });
  };
  if (windows.length === 0) {
    return (
      <div className="p-4 rounded-xl text-center" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
        <p className="text-sm italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          ॥ {t("अनुकूल दशा काळ सापडला नाही — ग्रह शक्ती मर्यादित आहे.", "No strong favourable dasha windows found — planetary strength limited.", "अनुकूल दशा काल नहीं मिला — ग्रह शक्ति सीमित.")} ॥
        </p>
      </div>
    );
  }
  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[10px] mb-3 px-2" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: "#1d7d3a" }} />{t("अनुकूल (७+)", "Favourable (7+)", "अनुकूल (7+)")}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: "#b8860b" }} />{t("मध्यम (५-७)", "Moderate (5-7)", "मध्यम (5-7)")}</span>
        <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded" style={{ background: "#c0392b" }} />{t("आव्हान (<५)", "Challenging (<5)", "चुनौतीपूर्ण (<5)")}</span>
      </div>
      <div className="space-y-3">
        {windows.map((w, i) => {
          const lbl = scoreLabel(w.score);
          return (
            <div key={i} className="p-3 rounded-xl" style={{
              background: scoreBg(w.score),
              border: "1.5px solid #d4a843",
              borderLeft: `4px solid ${scoreColor(w.score)}`,
            }}>
              <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                <p className="font-bold text-sm" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  ॥ {num(w.mahadashaLordMr)} – {num(w.antardashaLordMr)} ॥
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold italic px-2 py-0.5 rounded-full" style={{
                    color: "#FFFDF5", background: scoreColor(w.score),
                    fontFamily: "serif",
                  }}>
                    {t(lbl.mr, lbl.en, lbl.hi)}
                  </span>
                  <span className="text-[12px] font-bold italic px-2 py-0.5 rounded" style={{
                    color: scoreColor(w.score), background: "#FFFDF5", border: `1px solid ${scoreColor(w.score)}40`,
                    fontFamily: "serif",
                  }}>
                    {num(w.score)}/{num(10)}
                  </span>
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
                {formatDate(w.startDate)} → {formatDate(w.endDate)} · {t("वय", "age", "आयु")} {num(w.ageAtStart)}
              </p>
              <p className="text-[12px] italic" style={{ color: "rgba(92,26,26,0.8)", fontFamily: "serif" }}>
                {lang === "en" ? w.reasonEn : lang === "hi" ? w.reasonHi : w.reasonMr}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarriageTimingSection({ data, chunk = "full", windowSlice }: { data?: MarriageTimingData; chunk?: "full" | "header" | "windows" | "remedies"; windowSlice?: [number, number] }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const pickArr = (mr: string[], en: string[], hi: string[]) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const showHeader = chunk === "full" || chunk === "header";
  const showWindows = chunk === "full" || chunk === "windows";
  const showRemedies = chunk === "full" || chunk === "remedies";
  const windowsToShow = windowSlice ? data.windows.slice(windowSlice[0], windowSlice[1]) : data.windows;
  return (
    <div className="print-avoid-break space-y-5">
      {showHeader && <>
      <OrnateHeader
        title={t("विवाह काल विचार", "Marriage Timing (Vivaha Kala)", "विवाह काल विचार")}
        subtitle={t("शुक्र + सप्तमेश दशा विश्लेषणातून अनुकूल वेळा", "Favourable periods from Venus + 7th-lord dasha analysis", "शुक्र + सप्तमेश दशा विश्लेषण")}
      />

      <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <p className="text-sm font-bold mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {pick(data.overallMr, data.overallEn, data.overallHi)}
        </p>
        <div className="text-xs mt-2 pt-2 flex flex-wrap gap-4" style={{ color: "#5c1a1a", borderTop: "1px dotted #d4a843", fontFamily: "serif" }}>
          <span><b>{t("विवाह कारक", "Karaka", "कारक")}:</b> {lang === "mr" ? data.primaryKarakaMr : data.primaryKarakaEn}</span>
          <span><b>{t("सप्तमेश", "7th Lord", "सप्तमेश")}:</b> {lang === "mr" ? data.seventhLordMr : data.seventhLordEn} ({num(data.seventhLordHouse)}व्या स्थानी)</span>
          <span><b>{t("अनुमानित वय", "Predicted age", "अनुमानित आयु")}:</b> <span className="text-[#3d0c0c] font-bold">{lang === "mr" ? data.predictedAgeRange : data.predictedAgeRangeEn}</span></span>
        </div>
      </div>
      </>}

      {showWindows && (
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("शुभ दशा काळ", "Favourable Dasha Windows", "शुभ दशा काल")} ॥
        </h3>
        <TimingWindowsTable windows={windowsToShow} lang={lang} t={t} />
      </div>
      )}

      {showRemedies && (
      <div className="p-4 rounded-xl" style={{ background: "#FFFDF5", border: "2px double #d4a843" }}>
        <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("विवाह उपाय", "Vivaha Upaya", "विवाह उपाय")} ॥
        </h3>
        <ul className="space-y-2">
          {pickArr(data.remediesMr, data.remediesEn, data.remediesHi).map((r, i) => (
            <li key={i} className="text-sm flex gap-2 leading-relaxed" style={{ color: "#5c1a1a" }}>
              <span className="font-bold flex-shrink-0" style={{ color: "#d4a843", fontFamily: "serif" }}>{num(i + 1)}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}

function CareerTimingSection({ data, chunk = "full", windowSlice }: { data?: CareerTimingData; chunk?: "full" | "header" | "windows"; windowSlice?: [number, number] }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const pickArr = (mr: string[], en: string[], hi: string[]) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const showHeader = chunk === "full" || chunk === "header";
  const showWindows = chunk === "full" || chunk === "windows";
  const windowsToShow = windowSlice ? data.windows.slice(windowSlice[0], windowSlice[1]) : data.windows;
  return (
    <div className="print-avoid-break space-y-5">
      {showHeader && <>
      <OrnateHeader
        title={t("करिअर काल विचार", "Career Timing (Karma Kala)", "करियर काल विचार")}
        subtitle={t("दशमेश + कर्म कारक दशा विश्लेषणातून उन्नती काळ", "Ascent periods from 10th-lord + karma karaka dasha", "दशमेश + कर्म कारक दशा")}
      />

      <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <p className="text-sm font-bold mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {pick(data.overallMr, data.overallEn, data.overallHi)}
        </p>
        <div className="text-xs mt-2 pt-2" style={{ color: "#5c1a1a", borderTop: "1px dotted #d4a843", fontFamily: "serif" }}>
          <span><b>{t("दशमेश", "10th Lord", "दशमेश")}:</b> {lang === "mr" ? data.tenthLordMr : data.tenthLordEn} ({num(data.tenthLordHouse)}व्या स्थानी)</span>
        </div>
      </div>

      <div className="p-4 rounded-xl" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
        <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("अनुकूल क्षेत्र (दशमेशाच्या स्वभावानुसार)", "Suitable Fields (by 10th-lord nature)", "अनुकूल क्षेत्र")} ॥
        </h3>
        <ul className="space-y-2">
          {pickArr(data.fieldSuggestionsMr, data.fieldSuggestionsEn, data.fieldSuggestionsHi).map((f, i) => (
            <li key={i} className="text-sm flex gap-2" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
              <span className="font-bold flex-shrink-0" style={{ color: "#d4a843" }}>{num(i + 1)}.</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      </>}

      {showWindows && (
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("करिअर उन्नती दशा काळ", "Career Ascent Dasha Windows", "करियर उन्नति दशा काल")} ॥
        </h3>
        <TimingWindowsTable windows={windowsToShow} lang={lang} t={t} />
      </div>
      )}
    </div>
  );
}

function DeepDashaSection({ data, chunk = "full" }: { data?: DeepDashaData; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const formatDate = (s: string) => new Date(s).toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "short", day: "numeric" });
  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("प्रत्यंतर व सूक्ष्म दशा", "Pratyantar & Sookshma Dasha", "प्रत्यंतर व सूक्ष्म दशा")}
        subtitle={t("सध्याच्या अंतर्दशेतील तिसरा व चौथा स्तर दशा विश्लेषण", "Level 3 & 4 sub-periods within current antardasha", "वर्तमान अंतर्दशा में 3rd व 4th स्तर")}
      />

      {/* Current path */}
      <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <h4 className="text-center text-[13px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("सध्याचा दशा मार्ग", "Current Dasha Path", "वर्तमान दशा मार्ग")} ॥
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="px-3 py-1 rounded font-bold" style={{ background: "#3d0c0c", color: "#d4a843", fontFamily: "serif" }}>
            {lang === "mr" ? data.currentMahadasha.lordMr : data.currentMahadasha.lord}
          </span>
          <span style={{ color: "#d4a843" }}>→</span>
          <span className="px-3 py-1 rounded font-bold" style={{ background: "#5c1a1a", color: "#d4a843", fontFamily: "serif" }}>
            {lang === "mr" ? data.currentAntardasha.lordMr : data.currentAntardasha.lord}
          </span>
          {data.currentPratyantar && (
            <>
              <span style={{ color: "#d4a843" }}>→</span>
              <span className="px-3 py-1 rounded font-bold" style={{ background: "#d4a843", color: "#3d0c0c", fontFamily: "serif" }}>
                {lang === "mr" ? data.currentPratyantar.lordMr : data.currentPratyantar.lord}
              </span>
            </>
          )}
          {data.currentSookshma && (
            <>
              <span style={{ color: "#d4a843" }}>→</span>
              <span className="px-3 py-1 rounded font-bold text-xs" style={{ background: "#FFFDF5", color: "#3d0c0c", border: "1.5px solid #d4a843", fontFamily: "serif" }}>
                {lang === "mr" ? data.currentSookshma.lordMr : data.currentSookshma.lord}
              </span>
            </>
          )}
        </div>
        {data.currentSookshma && (
          <p className="text-center text-[11px] mt-2 italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
            {t("सूक्ष्म दशा", "Sookshma", "सूक्ष्म")}: {formatDate(data.currentSookshma.startDate)} → {formatDate(data.currentSookshma.endDate)}
          </p>
        )}
      </div>

      {/* Pratyantars list within current antardasha */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t(`${data.currentAntardasha.lordMr} अंतर्दशेतील प्रत्यंतर`, `Pratyantars in ${data.currentAntardasha.lord} Antardasha`, `${data.currentAntardasha.lordMr} अंतर्दशा में प्रत्यंतर`)} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("प्रत्यंतर स्वामी", "Pratyantar Lord", "प्रत्यंतर स्वामी")}</th>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("आरंभ", "Start", "आरंभ")}</th>
                <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("समाप्ती", "End", "समाप्ति")}</th>
                <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("दिवस", "Days", "दिन")}</th>
              </tr>
            </thead>
            <tbody>
              {data.pratyantars.map((p, i) => (
                <tr key={i} style={{
                  background: p.isCurrent ? "linear-gradient(180deg, #FFF3D6, #FFE9B8)" : i % 2 === 0 ? "#FFFDF5" : "#FFF8E7",
                  borderTop: "1px solid rgba(212,168,67,0.3)",
                }}>
                  <td className="px-3 py-2 font-bold text-center" style={{
                    color: p.isCurrent ? "#3d0c0c" : "#5c1a1a",
                    borderRight: "1px solid rgba(212,168,67,0.3)",
                    fontFamily: "serif",
                  }}>
                    {p.isCurrent && <span style={{ color: "#d4a843" }}>◉ </span>}
                    {lang === "mr" ? p.lordMr : p.lord}
                  </td>
                  <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{formatDate(p.startDate)}</td>
                  <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>{formatDate(p.endDate)}</td>
                  <td className="px-3 py-2 text-center" style={{ color: "rgba(92,26,26,0.7)" }}>{num(p.durationDays)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      </>}
      {showBottom && <>
      {/* Current pratyantar's sookshma breakdown */}
      {data.currentPratyantar?.sookshmas && data.currentPratyantar.sookshmas.length > 0 && (
        <div>
          <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t(`${data.currentPratyantar.lordMr} प्रत्यंतरातील सूक्ष्म`, `Sookshmas in ${data.currentPratyantar.lord} Pratyantar`, `${data.currentPratyantar.lordMr} प्रत्यंतर में सूक्ष्म`)} ॥
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.currentPratyantar.sookshmas.map((s, i) => (
              <div key={i} className="p-2 rounded-lg text-center text-xs" style={{
                background: s.isCurrent ? "linear-gradient(180deg, #FFF3D6, #FFE9B8)" : "#FFFDF5",
                border: s.isCurrent ? "2px solid #d4a843" : "1px solid rgba(212,168,67,0.4)",
                fontFamily: "serif",
              }}>
                <p className="font-bold" style={{ color: "#3d0c0c" }}>
                  {s.isCurrent && "◉ "}{lang === "mr" ? s.lordMr : s.lord}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(92,26,26,0.7)" }}>
                  {formatDate(s.startDate)}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(92,26,26,0.5)" }}>
                  {num(s.durationDays)} {t("दिवस", "days", "दिन")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.nextMilestoneMr && (
        <p className="text-center text-[12px] italic" style={{ color: "rgba(92,26,26,0.8)", fontFamily: "serif" }}>
          ॥ {pick(data.nextMilestoneMr, data.nextMilestoneEn, data.nextMilestoneHi)} ॥
        </p>
      )}
      </>}
    </div>
  );
}

function NamesSection({ data }: { data?: NamesSuggestionData }) {
  const { t, lang } = useLang();
  if (!data) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;

  const renderCard = (n: NameEntryData) => (
    <div key={n.name} className="p-3 rounded-lg" style={{
      background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
      border: "1.5px solid #d4a843",
    }}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-base font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {n.name}
        </span>
        <span className="text-[11px]" style={{ color: "rgba(92,26,26,0.6)", fontFamily: "serif" }}>
          {n.nameEn}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>
        {lang === "mr" ? n.meaningMr : n.meaningEn}
      </p>
    </div>
  );

  const total = data.boyNames.length + data.girlNames.length + data.unisexNames.length;

  return (
    <div className="print-avoid-break space-y-5">
      <OrnateHeader
        title={t("राशी अक्षर व नावसूचना", "Nakshatra Letters & Name Suggestions", "राशि अक्षर व नाम सुझाव")}
        subtitle={t("जन्म नक्षत्र व पदानुसार पारंपरिक मराठी नावे", "Authentic Marathi names per janma-nakshatra pada", "जन्म नक्षत्र व पद के अनुसार पारंपरिक नाम")}
      />

      {/* Akshara card */}
      <div className="p-4 rounded-xl text-center" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <p className="text-[11px] mb-2 italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          {t("तुमचे प्राथमिक राशी अक्षर", "Your primary nakshatra letter", "आपका प्राथमिक नक्षत्र अक्षर")}
        </p>
        <p className="text-5xl font-bold mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          {data.primaryAkshara || "—"}
        </p>
        <p className="text-xs" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
          {t("पर्यायी अक्षरे", "Alternate letters", "वैकल्पिक अक्षर")}: <b>{data.allAksharas.join(" · ")}</b>
        </p>
      </div>

      {total === 0 ? (
        <div className="p-4 rounded-xl text-center" style={{ background: "#FFFDF5", border: "1.5px solid #d4a843" }}>
          <p className="text-sm italic" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
            ॥ {t("या अक्षरासाठी नावसूची लवकरच उपलब्ध होईल.", "Name database for this letter coming soon.", "इस अक्षर के लिए नाम सूची शीघ्र.")} ॥
          </p>
        </div>
      ) : (
        <>
          {data.boyNames.length > 0 && (
            <div>
              <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                ॥ {t("मुलांची नावे", "Boys' Names", "लड़कों के नाम")} ({data.boyNames.length}) ॥
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.boyNames.map(renderCard)}
              </div>
            </div>
          )}
          {data.girlNames.length > 0 && (
            <div>
              <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                ॥ {t("मुलींची नावे", "Girls' Names", "लड़कियों के नाम")} ({data.girlNames.length}) ॥
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.girlNames.map(renderCard)}
              </div>
            </div>
          )}
          {data.unisexNames.length > 0 && (
            <div>
              <h3 className="text-center text-[14px] font-bold mb-3 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                ॥ {t("दोघांसाठी नावे", "Unisex Names", "द्विलिंगी नाम")} ({data.unisexNames.length}) ॥
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.unisexNames.map(renderCard)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function UpagrahaSection({ data, chunk = "full" }: { data?: UpagrahaData[]; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data || data.length === 0) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));
  const dayBirth = data[0]?.isDayBirth;
  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("उपग्रह", "Upagrahas (Sub-planets)", "उपग्रह")}
        subtitle={t("गुलिक, मांदी, यमकंटक, काल व इतर उपग्रहांची राशी व भाव स्थिती", "Gulika, Mandi, Yamakantaka, Kala and other sub-planets — rashi and house positions", "गुलिक, मांदी, यमकंटक आदि उपग्रह")}
      />

      <div className="p-3 rounded-xl text-center" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <p className="text-[12px] italic" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
          {t(
            `जन्म ${dayBirth ? "दिवसा" : "रात्री"} — दिवस/रात्री कालावधीच्या ८ कलांमध्ये उपग्रह स्थान गणना.`,
            `${dayBirth ? "Day" : "Night"} birth — upagrahas located by 8-kala division of the day or night.`,
            `${dayBirth ? "दिन" : "रात्रि"} जन्म — 8 कला विभाजन से गणना.`
          )}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("उपग्रह", "Upagraha", "उपग्रह")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("राशी", "Rashi", "राशि")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("अंश", "Degree", "अंश")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("भाव", "Bhava", "भाव")}</th>
              <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("कला", "Kala", "कला")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-3 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? u.nameMr : u.nameEn}
                </td>
                <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? u.rashiMr : u.rashiEn}
                </td>
                <td className="px-3 py-2 text-center font-mono text-xs" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)" }}>
                  {u.degreeDMS}
                </td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {num(u.house)}
                </td>
                <td className="px-3 py-2 text-center" style={{ color: "rgba(92,26,26,0.7)" }}>
                  {num(u.kalaIndex)}/{num(8)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </>}
      {showBottom && (
      /* Upagraha descriptions */
      <div className="space-y-3">
        {data.map((u) => (
          <div key={`desc-${u.id}`} className="p-3 rounded-xl" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
            border: "1.5px solid #d4a843",
            borderLeft: "4px solid #d4a843",
          }}>
            <h4 className="text-[13px] font-bold mb-1 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              ॥ {lang === "mr" ? u.nameMr : u.nameEn} — {lang === "mr" ? u.rashiMr : u.rashiEn} {t("राशी", "rashi", "राशि")}, {num(u.house)}{t("व्या", "th", "वां")} {t("भाव", "bhava", "भाव")} ॥
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
              {pick(u.descMr, u.descEn, u.descHi)}
            </p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function GocharNaadiSection({ data, chunk = "full" }: { data?: GocharTransitData[]; chunk?: "full" | "top" | "bottom" }) {
  const { t, lang } = useLang();
  if (!data || data.length === 0) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const effectColor = (e: string) =>
    e === "favourable" ? "#1d7d3a" :
    e === "challenging" ? "#b91c1c" : "#b8860b";

  const favCount = data.filter((t) => t.effect === "favourable").length;
  const chalCount = data.filter((t) => t.effect === "challenging").length;
  const neuCount = data.length - favCount - chalCount;

  const today = new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" });
  const showTop = chunk === "full" || chunk === "top";
  const showBottom = chunk === "full" || chunk === "bottom";

  return (
    <div className="print-avoid-break space-y-5">
      {showTop && <>
      <OrnateHeader
        title={t("गोचर नाडी — सध्याचे संक्रमण", "Gochar Naadi — Current Transits", "गोचर नाडी — वर्तमान संक्रमण")}
        subtitle={t("सध्याच्या ग्रहस्थितीचा जन्म लग्न व चंद्र यांवरील प्रभाव", "Current planetary positions overlaid on natal Lagna and Moon", "वर्तमान ग्रह स्थिति का जन्म लग्न व चंद्र पर प्रभाव")}
      />

      <div className="p-4 rounded-xl" style={{ background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)", border: "2px double #d4a843" }}>
        <p className="text-center text-sm mb-2 font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {today} ॥
        </p>
        <div className="flex justify-center gap-6 text-xs" style={{ fontFamily: "serif" }}>
          <span style={{ color: "#1d7d3a" }}>◉ {t("अनुकूल", "Favourable", "अनुकूल")}: <b>{num(favCount)}</b></span>
          <span style={{ color: "#b8860b" }}>◉ {t("तटस्थ", "Neutral", "तटस्थ")}: <b>{num(neuCount)}</b></span>
          <span style={{ color: "#b91c1c" }}>◉ {t("प्रतिकूल", "Challenging", "प्रतिकूल")}: <b>{num(chalCount)}</b></span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("सध्याची राशी", "Current Rashi", "वर्तमान राशि")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("लग्नापासून", "From Lagna", "लग्न से")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("चंद्रापासून", "From Moon", "चंद्र से")}</th>
              <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("फल", "Effect", "फल")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tp, i) => (
              <tr key={tp.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-3 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? tp.nameMr : tp.nameEn}
                </td>
                <td className="px-3 py-2 text-center" style={{ color: "#5c1a1a", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? tp.currentRashiMr : tp.currentRashiEn}
                </td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {num(tp.houseFromLagna)}
                </td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {num(tp.houseFromMoon)}
                </td>
                <td className="px-3 py-2 text-center italic font-bold" style={{ color: effectColor(tp.effect), fontFamily: "serif" }}>
                  {tp.effect === "favourable" ? t("अनुकूल", "Favourable", "अनुकूल") :
                   tp.effect === "challenging" ? t("प्रतिकूल", "Challenging", "प्रतिकूल") :
                   t("तटस्थ", "Neutral", "तटस्थ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </>}
      {showBottom && (
      /* Per-planet descriptions */
      <div className="space-y-2">
        {data.map((tp) => (
          <div key={`desc-${tp.id}`} className="p-3 rounded-xl" style={{
            background: "#FFFDF5",
            border: "1.5px solid #d4a843",
            borderLeft: `4px solid ${effectColor(tp.effect)}`,
          }}>
            <p className="text-sm" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
              <span className="font-bold" style={{ color: "#3d0c0c" }}>
                {lang === "mr" ? tp.nameMr : tp.nameEn}
              </span>
              {" "}— {pick(tp.effectMr, tp.effectEn, tp.effectHi)}
            </p>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

function VimshopakBalaSection({ data }: { data?: VimshopakPlanetData[] }) {
  const { t, lang } = useLang();
  if (!data || data.length === 0) return <p className="text-stone-500 text-sm">{t("डेटा उपलब्ध नाही.", "Data not available.", "डेटा उपलब्ध नहीं.")}</p>;
  const pick = (mr: string, en: string, hi: string) => (lang === "en" ? en : lang === "hi" ? hi : mr);
  const num = (v: string | number) => (lang === "mr" ? toMr(v) : String(v));

  const verdictColor = (v: string) =>
    v === "excellent" ? "#1d7d3a" :
    v === "strong" ? "#2d6b2d" :
    v === "average" ? "#b8860b" :
    "#b91c1c";

  const dignityColor = (d: string) =>
    d === "exalted" ? "#1d7d3a" :
    d === "moolatrikona" || d === "own" ? "#2d6b2d" :
    d === "friend" ? "#b8860b" :
    d === "neutral" ? "#5c1a1a" :
    d === "enemy" ? "#c97226" :
    "#b91c1c";

  // Use first planet's vargas as column headers (all planets have same 16)
  const vargaHeaders = data[0]?.vargas ?? [];

  return (
    <div className="print-avoid-break space-y-5">
      <OrnateHeader
        title={t("विंशोपक बल — षोडशवर्ग सारांश", "Vimshopak Bala — Shodashavarga Composite", "विंशोपक बल — षोडशवर्ग सारांश")}
        subtitle={t("१६ वर्ग कुंडल्यांमधील ग्रहस्थितीचा भारित सारांश (२० पैकी)", "Weighted dignity across 16 divisional charts (out of 20)", "16 वर्ग कुंडलियों का भारित सारांश (20 में से)")}
      />

      {/* Summary table — totals only */}
      <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("विंशोपक (२० पैकी)", "Vimshopak (of 20)", "विंशोपक (20 में से)")}</th>
              <th className="px-3 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>%</th>
              <th className="px-3 py-2 text-center" style={{ fontFamily: "serif" }}>{t("संज्ञा", "Sanjna", "संज्ञा")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                <td className="px-3 py-2 font-bold text-center" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {lang === "mr" ? p.nameMr : p.nameEn}
                </td>
                <td className="px-3 py-2 text-center font-bold" style={{ color: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.08)", fontFamily: "serif" }}>
                  {num(p.totalBala)}
                </td>
                <td className="px-3 py-2 text-center" style={{ color: verdictColor(p.verdict), borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif" }}>
                  {num(p.percent)}%
                </td>
                <td className="px-3 py-2 text-center font-bold italic" style={{ color: verdictColor(p.verdict), fontFamily: "serif" }}>
                  {pick(p.verdictMr, p.verdictEn, p.verdictHi)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#3d0c0c", color: "#d4a843" }}>
              <td className="px-3 py-2 text-[11px] text-center italic" colSpan={4}>
                {t("१५+ अत्युत्तम · १२-१४ प्रबळ · ८-११ मध्यम · <८ क्षीण", "15+ Excellent · 12-14 Strong · 8-11 Average · <8 Weak", "15+ अत्युत्तम · 12-14 प्रबल · 8-11 मध्यम · <8 क्षीण")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Full matrix — planet × varga → dignity */}
      <div>
        <h3 className="text-center text-[14px] font-bold mb-2 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
          ॥ {t("१६ वर्ग कुंडल्यांमधील ग्रह स्थिती", "Planet Dignity across 16 Vargas", "16 वर्ग कुंडलियों में ग्रह स्थिति")} ॥
        </h3>
        <div className="overflow-x-auto rounded-lg" style={{ border: "2px double #d4a843" }}>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)", color: "#d4a843" }}>
                <th className="px-2 py-2 text-center sticky left-0" style={{ background: "#3d0c0c", borderRight: "1px solid rgba(212,168,67,0.4)", fontFamily: "serif" }}>{t("ग्रह", "Graha", "ग्रह")}</th>
                {vargaHeaders.map((v) => (
                  <th key={v.vargaId} className="px-1 py-2 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.2)", fontFamily: "serif", fontSize: "10px" }}>
                    {v.vargaId.startsWith("rashi") ? "D1" :
                     v.vargaId.startsWith("hora") ? "D2" :
                     v.vargaId.startsWith("drekkana") ? "D3" :
                     v.vargaId.startsWith("chaturthamsha") ? "D4" :
                     v.vargaId.startsWith("saptamsha") ? "D7" :
                     v.vargaId.startsWith("navamsha") ? "D9" :
                     v.vargaId.startsWith("dashamsha") ? "D10" :
                     v.vargaId.startsWith("dwadashamsha") ? "D12" :
                     v.vargaId.startsWith("shodashamsha") ? "D16" :
                     v.vargaId.startsWith("vimshamsha") ? "D20" :
                     v.vargaId.startsWith("siddhamsha") ? "D24" :
                     v.vargaId.startsWith("bhamsha") ? "D27" :
                     v.vargaId.startsWith("trimshamsha") ? "D30" :
                     v.vargaId.startsWith("khavedamsha") ? "D40" :
                     v.vargaId.startsWith("akshavedamsha") ? "D45" : "D60"}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7", borderTop: "1px solid rgba(212,168,67,0.3)" }}>
                  <td className="px-2 py-2 font-bold text-center sticky left-0" style={{
                    color: "#3d0c0c", background: i % 2 === 0 ? "#FFFDF5" : "#FFF8E7",
                    borderRight: "1px solid rgba(212,168,67,0.3)", fontFamily: "serif",
                  }}>
                    {lang === "mr" ? p.nameMr : p.nameEn}
                  </td>
                  {p.vargas.map((v) => (
                    <td key={v.vargaId} className="px-1 py-2 text-center" style={{
                      color: dignityColor(v.dignity),
                      borderRight: "1px solid rgba(212,168,67,0.2)",
                      fontFamily: "serif",
                      fontWeight: (v.dignity === "exalted" || v.dignity === "own" || v.dignity === "moolatrikona") ? "bold" : "normal",
                      fontSize: "10px",
                    }} title={`${lang === "mr" ? v.dignityMr : v.dignityEn} · ${v.score}`}>
                      {v.dignity === "exalted" ? "↑" :
                       v.dignity === "debilitated" ? "↓" :
                       v.dignity === "own" ? "●" :
                       v.dignity === "moolatrikona" ? "◉" :
                       v.dignity === "friend" ? "+" :
                       v.dignity === "enemy" ? "−" : "○"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center text-[10px] italic mt-2" style={{ color: "rgba(92,26,26,0.7)", fontFamily: "serif" }}>
          ↑ {t("उच्च", "Exalted", "उच्च")} · ◉ {t("मूलत्रिकोण", "Moolatrikona", "मूलत्रिकोण")} · ● {t("स्वराशी", "Own", "स्वराशि")} · + {t("मित्र", "Friend", "मित्र")} · ○ {t("सम", "Neutral", "सम")} · − {t("शत्रू", "Enemy", "शत्रु")} · ↓ {t("नीच", "Debilitated", "नीच")}
        </p>
      </div>
    </div>
  );
}

function PredictionSection({ predictions, deepPredictions, planetBhava, planetRashi, nakshatraDeep, lagnaLifeAreas, panchangFal }: {
  predictions: HousePredictionData[];
  deepPredictions?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  planetBhava?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  planetRashi?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  nakshatraDeep?: { mr: string; en: string } | null;
  lagnaLifeAreas?: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  panchangFal?: {
    tithi: { mr: string; en: string } | null;
    vaar: { mr: string; en: string } | null;
    masa: { mr: string; en: string } | null;
    ritu: { mr: string; en: string } | null;
  };
}) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("भावनिहाय भविष्यकथन", "Bhava Phala Vichara", "भाव अनुसार फल")}
        subtitle={t("द्वादश भावांचे फल व रेटिंग", "Predictions for all 12 houses", "द्वादश भावों का फल")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.house} className="print-avoid-break p-4 rounded-xl" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
            border: "1.5px solid #d4a843",
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{
                  background: "linear-gradient(180deg, #5c1a1a, #3d0c0c)",
                  color: "#d4a843",
                  border: "1px solid #d4a843",
                  fontFamily: "serif",
                }}>{n(p.house)}</span>
                <h4 className="font-bold text-sm" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                  {lang === "mr" ? `${n(p.house)}वा भाव` : `House ${p.house}`} — {t(p.titleMr, p.titleEn)}
                </h4>
              </div>
              <div style={{ color: "#d4a843" }}>{"★".repeat(p.rating)}{"☆".repeat(5-p.rating)}</div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
              {t(p.predictionMr, p.predictionEn)}
            </p>
          </div>
        ))}
      </div>

      {deepPredictions && deepPredictions.length > 0 && (
        <div className="mt-8">
          <DeepPredictionSection predictions={deepPredictions} title={t("भाव-स्वामींचे फल", "House-Lord Placements", "भाव-स्वामी फल")} subtitle={t("शास्त्राधारित भविष्यवाणी (बृ.पा.हो.)", "BPHS-based per house lord", "बृ.पा.हो. आधारित")} />
        </div>
      )}

      {planetBhava && planetBhava.length > 0 && (
        <div className="mt-8">
          <DeepPredictionSection predictions={planetBhava} title={t("ग्रहांच्या भाव-स्थिती फल", "Planets in Bhavas", "ग्रहों की भाव स्थिति")} subtitle={t("नवग्रहांचे प्रत्येक भावात फल", "Each planet's bhava placement", "प्रत्येक ग्रह का भाव फल")} />
        </div>
      )}

      {planetRashi && planetRashi.length > 0 && (
        <div className="mt-8">
          <DeepPredictionSection predictions={planetRashi} title={t("ग्रहांच्या राशी-स्थिती फल", "Planets in Rashis", "ग्रहों की राशि स्थिति")} subtitle={t("नवग्रहांची राशी स्थिती व फल", "Each planet's sign placement", "प्रत्येक ग्रह का राशि फल")} />
        </div>
      )}

      {nakshatraDeep && (
        <div className="mt-8 print-avoid-break">
          <OrnateHeader
            title={t("जन्म नक्षत्र फल", "Janma Nakshatra Phala", "जन्म नक्षत्र फल")}
            subtitle={t("शास्त्रानुसार सखोल व्यक्तिमत्त्व विश्लेषण", "Classical in-depth personality analysis", "गहन व्यक्तित्व विश्लेषण")}
          />
          <div className="p-4 rounded-lg" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)",
            border: "1px solid #d4a843",
          }}>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
              {t(nakshatraDeep.mr, nakshatraDeep.en)}
            </p>
          </div>
        </div>
      )}

      {lagnaLifeAreas && lagnaLifeAreas.length > 0 && (
        <div className="mt-8">
          <DeepPredictionSection predictions={lagnaLifeAreas} title={t("लग्नानुसार जीवन क्षेत्रे", "Lagna Life Areas", "लग्नानुसार जीवन क्षेत्र")} subtitle={t("शारीरिक, मानसिक, शिक्षण, करिअर, विवाह, आर्थिक", "Physical, mental, education, career, marriage, finance", "६ क्षेत्रांचे विश्लेषण")} />
        </div>
      )}

      {panchangFal && (panchangFal.tithi || panchangFal.vaar || panchangFal.masa || panchangFal.ritu) && (
        <div className="mt-8 print-avoid-break">
          <OrnateHeader
            title={t("जन्म पंचांग फल", "Birth Panchang Phala", "जन्म पंचांग फल")}
            subtitle={t("तिथि, वार, मास, ऋतू अनुसार फल", "Per tithi, day, month, season", "पंचांग-आधारित विश्लेषण")}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {panchangFal.tithi && (
              <div className="p-4 rounded-lg" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("जन्म तिथि फल", "Tithi")}</h5>
                <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.tithi.mr, panchangFal.tithi.en)}</p>
              </div>
            )}
            {panchangFal.vaar && (
              <div className="p-4 rounded-lg" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("जन्म वार फल", "Vaar")}</h5>
                <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.vaar.mr, panchangFal.vaar.en)}</p>
              </div>
            )}
            {panchangFal.masa && (
              <div className="p-4 rounded-lg" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("जन्म मास फल", "Masa")}</h5>
                <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.masa.mr, panchangFal.masa.en)}</p>
              </div>
            )}
            {panchangFal.ritu && (
              <div className="p-4 rounded-lg" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("जन्म ऋतू फल", "Ritu")}</h5>
                <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.ritu.mr, panchangFal.ritu.en)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PanchangNakshatraFalPage({ nakshatraDeep, panchangFal }: {
  nakshatraDeep?: { mr: string; en: string } | null;
  panchangFal?: {
    tithi: { mr: string; en: string } | null;
    vaar: { mr: string; en: string } | null;
    masa: { mr: string; en: string } | null;
    ritu: { mr: string; en: string } | null;
  };
}) {
  const { t } = useLang();
  return (
    <div className="print-avoid-break">
      {nakshatraDeep && (
        <>
          <OrnateHeader
            title={t("जन्म नक्षत्र फल", "Janma Nakshatra Phala", "जन्म नक्षत्र फल")}
            subtitle={t("शास्त्रानुसार सखोल व्यक्तिमत्त्व विश्लेषण", "Classical in-depth personality analysis")}
          />
          <div className="p-4 rounded-lg mb-6" style={{ background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)", border: "1px solid #d4a843" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
              {t(nakshatraDeep.mr, nakshatraDeep.en)}
            </p>
          </div>
        </>
      )}
      {panchangFal && (panchangFal.tithi || panchangFal.vaar || panchangFal.masa || panchangFal.ritu) && (
        <>
          <OrnateHeader
            title={t("जन्म पंचांग फल", "Birth Panchang Phala", "जन्म पंचांग फल")}
            subtitle={t("तिथि, वार, मास, ऋतू अनुसार फल", "Per tithi, day, month, season")}
          />
          <div className="space-y-3">
            {panchangFal.tithi && (
              <div className="p-3 rounded-lg" style={{ background: "#FFFDF5", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("तिथि फल", "Tithi")}</h5>
                <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.tithi.mr, panchangFal.tithi.en)}</p>
              </div>
            )}
            {panchangFal.vaar && (
              <div className="p-3 rounded-lg" style={{ background: "#FFFDF5", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("वार फल", "Vaar")}</h5>
                <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.vaar.mr, panchangFal.vaar.en)}</p>
              </div>
            )}
            {panchangFal.masa && (
              <div className="p-3 rounded-lg" style={{ background: "#FFFDF5", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("मास फल", "Masa")}</h5>
                <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.masa.mr, panchangFal.masa.en)}</p>
              </div>
            )}
            {panchangFal.ritu && (
              <div className="p-3 rounded-lg" style={{ background: "#FFFDF5", border: "1px solid #d4a843" }}>
                <h5 className="font-bold text-sm mb-1" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t("ऋतू फल", "Ritu")}</h5>
                <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>{t(panchangFal.ritu.mr, panchangFal.ritu.en)}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DeepPredictionSection({ predictions, title, subtitle }: {
  predictions: { titleMr: string; titleEn: string; bodyMr: string; bodyEn: string }[];
  title?: string;
  subtitle?: string;
}) {
  const { t } = useLang();
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={title || t("भाव-स्वामींचे फल", "House-Lord Placements", "भाव-स्वामी फल")}
        subtitle={subtitle || t("बृहत् पराशर होरा शास्त्रानुसार", "Per Brihat Parashara Hora Shastra", "बृ.पा.हो. आधारित")}
      />
      <div className="space-y-3">
        {predictions.map((dp, i) => (
          <div key={i} className="print-avoid-break p-4 rounded-lg" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF4E0)",
            border: "1px solid #d4a843",
          }}>
            <h5 className="font-bold text-sm mb-2" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              {t(dp.titleMr, dp.titleEn)}
            </h5>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
              {t(dp.bodyMr, dp.bodyEn)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashaSection({ interp }: { interp: DashaInterpData | null }) {
  const { t } = useLang();
  if (!interp) return <p className="text-stone-500">{t("सध्याची दशा माहिती उपलब्ध नाही.","Current dasha info not available.")}</p>;
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t(`चालू ${interp.lordMr} महादशा फल`, `Current ${interp.lordEn} Mahadasha`, `वर्तमान ${interp.lordMr} महादशा`)}
        subtitle={t(interp.periodMr, interp.periodEn)}
      />
      <div className="space-y-3">
        {[
          { mr: "करिअर / व्यवसाय", en: "Kārya (Career)", valMr: interp.careerMr, valEn: interp.careerEn },
          { mr: "आर्थिक / धन", en: "Dhana (Finance)", valMr: interp.financeMr, valEn: interp.financeEn },
          { mr: "आरोग्य", en: "Ārogya (Health)", valMr: interp.healthMr, valEn: interp.healthEn },
          { mr: "संबंध / कुटुंब", en: "Sambandha (Relationships)", valMr: interp.relationshipMr, valEn: interp.relationshipEn },
        ].map((area, i) => (
          <div key={i} className="print-avoid-break p-3 rounded-lg" style={{
            background: "#FFFDF5",
            borderLeft: "3px solid #d4a843",
            border: "1px solid rgba(212,168,67,0.4)",
          }}>
            <h4 className="text-[13px] font-bold mb-1 italic" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              ॥ {t(area.mr, area.en)} ॥
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
              {t(area.valMr, area.valEn)}
            </p>
          </div>
        ))}
        <div className="p-4 rounded-xl" style={{
          background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)",
          border: "2px double #d4a843",
        }}>
          <h4 className="text-[13px] font-bold mb-2 italic text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            ॥ {t("उपदेश व शांती उपाय", "Upadesha & Shanti Upaya", "उपदेश व शांति उपाय")} ॥
          </h4>
          <p className="text-sm text-center leading-relaxed" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
            {t(interp.adviceMr, interp.adviceEn)}
          </p>
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const [expanded, setExpanded] = useState<number | null>(null);
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("विंशोत्तरी दशा कालावधी", "Vimshottari Dasha Kalavadhi", "विंशोत्तरी दशा काल")}
        subtitle={t("१२० वर्षांचे ग्रहदशा चक्र", "120-year planetary period cycle", "120 वर्ष का ग्रह दशा चक्र")}
      />
      <div className="space-y-2">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const now = new Date();
          const isCurrent = now >= start && now <= end;
          const isOpen = expanded === i;
          return (
            <div key={i}>
              <button onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-3 text-left transition-all"
                style={{
                  background: isCurrent ? "linear-gradient(180deg, #FFF8E7, #FFF3D6)" : "#FFFDF5",
                  border: isCurrent ? "2px double #d4a843" : "1px solid rgba(212,168,67,0.3)",
                  borderRadius: "8px",
                }}>
                <div className="flex items-center gap-3">
                  {isCurrent && (
                    <span className="text-[10px] font-bold italic px-2 py-0.5 rounded" style={{
                      background: "#3d0c0c", color: "#d4a843", fontFamily: "serif",
                    }}>॥ {t("चालू","Vartamana")} ॥</span>
                  )}
                  <span className="font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                    {t(PLANET_LORD_MR[d.lord]||d.lord, d.lord)} {t("महादशा","Mahadasha")}
                  </span>
                  <span className="text-xs" style={{ color: "#d4a843" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
                <div className="text-right text-sm" style={{ color: "#5c1a1a" }}>
                  <p style={{ fontFamily: "serif" }}>{start.toLocaleDateString(locale)} — {end.toLocaleDateString(locale)}</p>
                  <p className="text-xs">{n(d.years.toFixed(1))} {t("वर्षे","varsha")}</p>
                </div>
              </button>
              {isOpen && d.antardashas && (
                <div className="ml-6 mt-2 mb-3 space-y-1 pl-3" style={{ borderLeft: "2px dotted #d4a843" }}>
                  {d.antardashas.map((ad, j) => {
                    const adStart = new Date(ad.startDate);
                    const adEnd = new Date(ad.endDate);
                    const adCurrent = now >= adStart && now <= adEnd;
                    return (
                      <div key={j} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs" style={{
                        background: adCurrent ? "linear-gradient(180deg, #FFF3D6, #FFE9B8)" : "#FFFDF5",
                        border: adCurrent ? "1.5px solid #d4a843" : "1px solid rgba(212,168,67,0.3)",
                      }}>
                        <div className="flex items-center gap-2">
                          {adCurrent && <span className="w-2 h-2 rounded-full" style={{ background: "#d4a843" }} />}
                          <span className="font-semibold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                            {t(PLANET_LORD_MR[ad.lord]||ad.lord, ad.lord)}
                          </span>
                          <span className="italic" style={{ color: "rgba(92,26,26,0.7)" }}>{t("अंतर्दशा","Antardasha")}</span>
                        </div>
                        <div className="text-right" style={{ color: "#5c1a1a" }}>
                          <span style={{ fontFamily: "serif" }}>{adStart.toLocaleDateString(locale)} — {adEnd.toLocaleDateString(locale)}</span>
                          <span className="ml-2 text-[10px]" style={{ color: "rgba(92,26,26,0.6)" }}>({n(ad.years.toFixed(2))} {t("वर्षे","yr")})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintTimelineMahadashas({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  const now = new Date();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("विंशोत्तरी दशा कालावधी","Vimshottari Dasha Timeline")}</h2>
      <div className="space-y-2">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const isCurrent = now >= start && now <= end;
          return (
            <div key={i} className={`p-3 rounded-xl ${isCurrent ? "bg-[#FFF8E7] border-2 border-[#d4a843]" : "bg-stone-50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCurrent && <span className="text-xs bg-[#5c1a1a] text-white px-2 py-0.5 rounded-full">{t("चालू","Current")}</span>}
                  <span className="font-bold text-stone-800">{t(PLANET_LORD_MR[d.lord]||d.lord, d.lord)} {t("महादशा","Mahadasha")}</span>
                </div>
                <div className="text-right text-sm text-stone-600">
                  <p>{start.toLocaleDateString(locale)} — {end.toLocaleDateString(locale)}</p>
                  <p className="text-xs">{n(d.years.toFixed(1))} {t("वर्षे","years")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintTimelineAntardashas({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  const now = new Date();
  const currentDasha = dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
  if (!currentDasha || !currentDasha.antardashas) return null;
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-2">{t("चालू","Current")} {t(PLANET_LORD_MR[currentDasha.lord]||currentDasha.lord, currentDasha.lord)} {t("महादशा — अंतर्दशा","Mahadasha — Antardashas")}</h2>
      <p className="text-sm text-stone-500 mb-4">{new Date(currentDasha.startDate).toLocaleDateString(locale)} — {new Date(currentDasha.endDate).toLocaleDateString(locale)}</p>
      <div className="space-y-1">
        {currentDasha.antardashas.map((ad, j) => {
          const adStart = new Date(ad.startDate);
          const adEnd = new Date(ad.endDate);
          const adCurrent = now >= adStart && now <= adEnd;
          return (
            <div key={j} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${adCurrent ? "bg-[#FFF3D6] border border-[#d4a843]" : "bg-white border border-stone-100"}`}>
              <div className="flex items-center gap-2">
                {adCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />}
                <span className="font-semibold text-stone-700">{t(PLANET_LORD_MR[ad.lord]||ad.lord, ad.lord)}</span>
                <span className="text-stone-400">{t("अंतर्दशा","Antardasha")}</span>
              </div>
              <div className="text-right text-stone-500">
                <span>{adStart.toLocaleDateString(locale)} — {adEnd.toLocaleDateString(locale)}</span>
                <span className="ml-2 text-stone-400">({n(ad.years.toFixed(2))} {t("वर्षे","yr")})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RemedySection({ remedies }: { remedies: RemedyData[] }) {
  const { t, lang } = useLang();
  const num = (v: number) => (lang === "mr" ? toMr(v) : String(v));
  return (
    <div className="print-avoid-break">
      <OrnateHeader
        title={t("शांती उपाय व रत्न", "Shanti Upaya cha Ratna", "शांति उपाय व रत्न")}
        subtitle={t("ग्रहदोष निवारण · मंत्र · रत्न · दान", "Planetary remedies · Mantras · Gems · Donations", "ग्रह दोष निवारण · मंत्र · रत्न · दान")}
      />
      <div className="space-y-4">
        {remedies.map((r, i) => (
          <div key={i} className="print-avoid-break p-4 rounded-xl" style={{
            background: "linear-gradient(180deg, #FFFDF5, #FFF8E7)",
            border: "1.5px solid #d4a843",
          }}>
            <h3 className="font-bold text-[14px] mb-3 pb-2 text-center italic" style={{
              color: "#3d0c0c",
              fontFamily: "serif",
              borderBottom: "1px dotted #d4a843",
            }}>
              ॥ {t(r.categoryMr, r.categoryEn)} ॥
            </h3>
            <div className="space-y-2">
              {r.items.map((item, j) => (
                <div key={j} className="flex gap-3 p-2 rounded" style={{ background: "#FFFDF5" }}>
                  <span className="flex-shrink-0 font-bold" style={{ color: "#d4a843", fontFamily: "serif" }}>
                    {num(j + 1)}.
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "#5c1a1a" }}>
                    {t(item.mr, item.en)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 p-4 rounded-xl text-center" style={{
        background: "linear-gradient(180deg, #FFF8E7, #FFF3D6)",
        border: "2px double #d4a843",
      }}>
        <p className="text-xs italic" style={{ color: "#5c1a1a", fontFamily: "serif" }}>
          ॥ {t("सूचना: रत्न धारण करण्यापूर्वी अनुभवी ज्योतिषाचा सल्ला अवश्य घ्या.", "Note: Always consult an experienced astrologer before wearing gemstones.", "सूचना: रत्न धारण से पहले अनुभवी ज्योतिषी का परामर्श अवश्य लें.")} ॥
        </p>
      </div>
    </div>
  );
}
