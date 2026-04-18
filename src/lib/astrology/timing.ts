/**
 * Life event timing — marriage and career windows from dasha analysis.
 * Scans Mahadasha + Antardasha periods for favorable lord combinations.
 */

import type { KundliResult, PlanetPosition, DashaPeriod } from "./calculator";
import { CAREER_MD_AD, MARRIAGE_MD_AD } from "./content/dasha-timing";

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

// 9×9=81 combo texts moved to ./content/dasha-timing.ts (CAREER_MD_AD, MARRIAGE_MD_AD).

export interface TimingWindow {
  startDate: string;
  endDate: string;
  mahadashaLord: string;
  mahadashaLordMr: string;
  antardashaLord: string;
  antardashaLordMr: string;
  score: number;               // 1-10 favorability
  reasonMr: string;
  reasonEn: string;
  reasonHi: string;
  ageAtStart: number;
}

export interface MarriageTiming {
  windows: TimingWindow[];
  primaryKarakaMr: string;
  primaryKarakaEn: string;
  seventhLordMr: string;
  seventhLordEn: string;
  seventhLordHouse: number;
  seventhLordStrength: "good" | "moderate" | "weak";
  predictedAgeRange: string;
  predictedAgeRangeEn: string;
  overallMr: string;
  overallEn: string;
  overallHi: string;
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
}

export interface CareerTiming {
  windows: TimingWindow[];
  tenthLordMr: string;
  tenthLordEn: string;
  tenthLordHouse: number;
  fieldSuggestionsMr: string[];
  fieldSuggestionsEn: string[];
  fieldSuggestionsHi: string[];
  overallMr: string;
  overallEn: string;
  overallHi: string;
}

function scorePlanetForArea(planet: PlanetPosition, area: "marriage" | "career", k: KundliResult): number {
  let score = 5;
  const MARRIAGE_KARAKAS = ["Venus", "Jupiter"];
  const MARRIAGE_FRIENDLY = ["Moon", "Mercury"];
  const MARRIAGE_MALEFIC = ["Saturn", "Mars", "Rahu", "Ketu"];

  const CAREER_KARAKAS = ["Sun", "Saturn"];
  const CAREER_FRIENDLY = ["Mars", "Mercury", "Jupiter"];

  if (area === "marriage") {
    if (MARRIAGE_KARAKAS.includes(planet.id)) score += 3;
    else if (MARRIAGE_FRIENDLY.includes(planet.id)) score += 1;
    else if (MARRIAGE_MALEFIC.includes(planet.id)) score -= 2;
    // 7th lord
    const seventhRashi = (k.lagnaRashiIndex + 6) % 12;
    const seventhLord = SIGN_LORDS[seventhRashi];
    if (planet.id === seventhLord) score += 3;
  } else {
    if (CAREER_KARAKAS.includes(planet.id)) score += 3;
    else if (CAREER_FRIENDLY.includes(planet.id)) score += 1;
    // 10th lord
    const tenthRashi = (k.lagnaRashiIndex + 9) % 12;
    const tenthLord = SIGN_LORDS[tenthRashi];
    if (planet.id === tenthLord) score += 3;
  }

  // House placement: kendra/trikona good, dusthana bad
  if ([1, 4, 5, 7, 9, 10].includes(planet.house)) score += 1;
  else if ([6, 8, 12].includes(planet.house)) score -= 1;

  return Math.max(1, Math.min(10, score));
}

function scanDashas(dashas: DashaPeriod[], k: KundliResult, area: "marriage" | "career", minScore: number): TimingWindow[] {
  const birthDate = new Date(k.birthInput.year, k.birthInput.month - 1, k.birthInput.day);
  const out: TimingWindow[] = [];

  for (const md of dashas) {
    const mdPlanet = k.planets.find((p) => p.id === md.lord);
    if (!mdPlanet) continue;
    const mdScore = scorePlanetForArea(mdPlanet, area, k);

    for (const ad of md.antardashas) {
      const adPlanet = k.planets.find((p) => p.id === ad.lord);
      if (!adPlanet) continue;
      const adScore = scorePlanetForArea(adPlanet, area, k);
      const combinedScore = Math.round((mdScore * 0.6 + adScore * 0.4) * 10) / 10;
      if (combinedScore < minScore) continue;

      const ageAtStart = Math.floor((new Date(ad.startDate).getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      if (ageAtStart < 18 && area === "marriage") continue;  // skip pre-marriage-age windows
      if (ageAtStart < 20 && area === "career") continue;
      // Cap upper age — periods beyond typical active life are not meaningful
      if (area === "marriage" && ageAtStart > 60) continue;
      if (area === "career" && ageAtStart > 65) continue;

      const startStr = new Date(ad.startDate).toISOString().slice(0, 10);
      const endStr = new Date(ad.endDate).toISOString().slice(0, 10);

      const mdMr = PLANET_MR[md.lord] ?? md.lord;
      const adMr = PLANET_MR[ad.lord] ?? ad.lord;

      const matrix = area === "marriage" ? MARRIAGE_MD_AD : CAREER_MD_AD;
      const snippet = matrix[md.lord]?.[ad.lord];
      const fallback = area === "marriage"
        ? { mr: "वैवाहिक योग अनुकूल.", en: "Favourable for marriage.", hi: "विवाह हेतु अनुकूल." }
        : { mr: "करिअरमध्ये उन्नती संभव.", en: "Career advancement likely.", hi: "करियर में उन्नति संभव." };
      const text = snippet ?? fallback;
      const reasonMr = `${text.mr} शक्ती ${combinedScore}/१०.`;
      const reasonEn = `${text.en} Strength ${combinedScore}/10.`;
      const reasonHi = `${text.hi} शक्ति ${combinedScore}/10.`;

      out.push({
        startDate: startStr,
        endDate: endStr,
        mahadashaLord: md.lord,
        mahadashaLordMr: mdMr,
        antardashaLord: ad.lord,
        antardashaLordMr: adMr,
        score: combinedScore,
        reasonMr, reasonEn, reasonHi,
        ageAtStart,
      });
    }
  }

  // Return all qualifying windows sorted chronologically. Previously capped to top 8
  // by score, which created confusing gaps (e.g. 2022 → 2029 jump). Score filter
  // (minScore) already excludes weak combinations; all remaining are "advancement" windows.
  out.sort((a, b) => a.startDate.localeCompare(b.startDate));
  return out;
}

function analyze7thLordStrength(k: KundliResult): { mr: string; en: string; house: number; strength: "good" | "moderate" | "weak" } {
  const seventhRashi = (k.lagnaRashiIndex + 6) % 12;
  const lordId = SIGN_LORDS[seventhRashi];
  const lord = k.planets.find((p) => p.id === lordId);
  if (!lord) return { mr: "—", en: "—", house: 0, strength: "moderate" };
  let strength: "good" | "moderate" | "weak" = "moderate";
  if ([1, 4, 5, 7, 9, 10, 11].includes(lord.house)) strength = "good";
  else if ([6, 8, 12].includes(lord.house)) strength = "weak";
  return { mr: lord.nameMr, en: lord.name, house: lord.house, strength };
}

function analyze10thLordStrength(k: KundliResult): { mr: string; en: string; house: number } {
  const tenthRashi = (k.lagnaRashiIndex + 9) % 12;
  const lordId = SIGN_LORDS[tenthRashi];
  const lord = k.planets.find((p) => p.id === lordId);
  if (!lord) return { mr: "—", en: "—", house: 0 };
  return { mr: lord.nameMr, en: lord.name, house: lord.house };
}

export function analyzeMarriageTiming(k: KundliResult): MarriageTiming {
  const seventh = analyze7thLordStrength(k);
  const windows = scanDashas(k.dashas, k, "marriage", 6.5);

  let predictedAge = "२४-३० वयोमर्यादा";
  let predictedAgeEn = "ages 24-30";
  if (windows.length > 0) {
    const firstWindow = windows.reduce((earliest, w) => w.ageAtStart < earliest.ageAtStart ? w : earliest);
    const startAge = firstWindow.ageAtStart;
    predictedAge = `${startAge}-${startAge + 3} वयोमर्यादा`;
    predictedAgeEn = `ages ${startAge}-${startAge + 3}`;
  }

  const remediesMr = [
    "शुक्रवारी महालक्ष्मी अष्टक व श्री सूक्त पठण — पांढरी/गुलाबी फुले अर्पण.",
    "गुरुवारी विष्णू सहस्रनाम, पिवळे वस्त्र व केळी दान. गुरूपूजन विवाहयोगास पोषक.",
    "तुळजापूर भवानी किंवा कोल्हापूर महालक्ष्मी यात्रा. देवीचे अर्चन करून नवस.",
    "मंगळ दोष असल्यास मंगळवारी हनुमान चालीसा ११ वेळा व कुंभ विवाह विधी.",
    "स्वयंवर पार्वती मंत्र — 'ॐ ह्रीं योगिनी योगिनी योगेश्वरी' — १०८ × ४० दिवस.",
    "कटयायनी व्रत (माघी पौर्णिमा) व सत्यनारायण पूजन नियमित.",
  ];
  const remediesEn = [
    "On Fridays recite Mahalakshmi Ashtak and Shri Sukta — offer white/pink flowers.",
    "Thursday Vishnu Sahasranama, wear yellow, donate bananas. Guru worship supports marriage yoga.",
    "Yatra to Tuljapur Bhavani or Kolhapur Mahalaxmi — offer navas to the goddess.",
    "If Mangal dosha, Hanuman Chalisa 11 times on Tuesdays and Kumbh Vivah ritual.",
    "Swayamvara Parvati mantra — 'Om Hreem Yogini Yogini Yogeshwari' — 108 × 40 days.",
    "Regular Katyayani vrata (Maghi Purnima) and Satyanarayan pujan.",
  ];
  const remediesHi = [
    "शुक्रवार महालक्ष्मी अष्टक व श्री सूक्त पाठ — सफेद/गुलाबी पुष्प अर्पण.",
    "गुरुवार विष्णु सहस्रनाम, पीले वस्त्र, केले दान. गुरु पूजन विवाह योग को पुष्ट.",
    "तुलजापुर भवानी या कोल्हापुर महालक्ष्मी यात्रा, देवी अर्चन व नवस.",
    "मांगलिक हो तो मंगलवार हनुमान चालीसा ११ बार व कुंभ विवाह विधि.",
    "स्वयंवर पार्वती मंत्र का १०८ × ४० दिन जाप.",
    "कात्यायनी व्रत व सत्यनारायण पूजन.",
  ];

  return {
    windows,
    primaryKarakaMr: "शुक्र (विवाह कारक)",
    primaryKarakaEn: "Venus (Marriage Karaka)",
    seventhLordMr: seventh.mr,
    seventhLordEn: seventh.en,
    seventhLordHouse: seventh.house,
    seventhLordStrength: seventh.strength,
    predictedAgeRange: predictedAge,
    predictedAgeRangeEn: predictedAgeEn,
    overallMr: `७व्या भावाचा स्वामी ${seventh.mr} ${seventh.house}व्या स्थानी — स्थिती ${seventh.strength === "good" ? "अनुकूल" : seventh.strength === "weak" ? "सावधगिरीची" : "मध्यम"}. विवाह अनुकूल काळ ${predictedAge}.`,
    overallEn: `7th house lord ${seventh.en} in house ${seventh.house} — ${seventh.strength}. Favourable marriage period: ${predictedAgeEn}.`,
    overallHi: `७वें भाव के स्वामी ${seventh.mr} ${seventh.house}वें स्थान में — स्थिति ${seventh.strength}. विवाह अनुकूल काल ${predictedAge}.`,
    remediesMr, remediesEn, remediesHi,
  };
}

export function analyzeCareerTiming(k: KundliResult): CareerTiming {
  const tenth = analyze10thLordStrength(k);
  const windows = scanDashas(k.dashas, k, "career", 6.5);

  // Suggest career fields from 10th lord nature
  const fieldMap: Record<string, { mr: string[]; en: string[]; hi: string[] }> = {
    Sun: {
      mr: ["सरकारी/प्रशासकीय सेवा (IAS/IPS/IRS)", "राजकारण व नेतृत्व पदे", "वैद्यकीय क्षेत्र (शल्यचिकित्सा)", "सोने व सरकारी बँकिंग"],
      en: ["Government/administrative services (IAS/IPS/IRS)", "Politics and leadership roles", "Medical field (surgery)", "Gold and government banking"],
      hi: ["सरकारी/प्रशासनिक सेवा", "राजनीति व नेतृत्व", "चिकित्सा क्षेत्र", "सोना व सरकारी बैंकिंग"],
    },
    Moon: {
      mr: ["जलवायू/पर्यटन क्षेत्र", "पत्रकारिता व मीडिया", "मानसिक आरोग्य व समुपदेशन", "डेअरी व दुग्ध व्यवसाय"],
      en: ["Water/hospitality/tourism", "Journalism and media", "Mental health, counselling", "Dairy and milk business"],
      hi: ["जल/पर्यटन क्षेत्र", "पत्रकारिता व मीडिया", "मानसिक स्वास्थ्य परामर्श", "डेयरी व दुग्ध व्यवसाय"],
    },
    Mars: {
      mr: ["सैन्य, पोलिस व सुरक्षा सेवा", "अभियांत्रिकी, शस्त्रक्रिया, क्रीडा", "जमीन व स्थावर मालमत्ता व्यवसाय", "अग्नि-सुरक्षा, यांत्रिक उद्योग"],
      en: ["Military, police, defence services", "Engineering, surgery, sports", "Land/real estate business", "Fire safety, mechanical industries"],
      hi: ["सेना, पुलिस, रक्षा सेवा", "अभियांत्रिकी, शल्य, क्रीड़ा", "भूमि/रियल एस्टेट व्यवसाय", "अग्नि सुरक्षा, यांत्रिक उद्योग"],
    },
    Mercury: {
      mr: ["व्यापार व शेअर बाजार", "माहिती तंत्रज्ञान (IT)", "लेखन, पत्रकारिता, कायदा", "शिक्षण व विश्लेषणात्मक कामे"],
      en: ["Business and stock market", "Information Technology (IT)", "Writing, journalism, law", "Teaching and analytical work"],
      hi: ["व्यापार व शेयर बाज़ार", "IT क्षेत्र", "लेखन, पत्रकारिता, कानून", "शिक्षण व विश्लेषण कार्य"],
    },
    Jupiter: {
      mr: ["शिक्षण, अध्यापन व संशोधन", "कायदा, न्यायपालिका", "बँकिंग व वित्त", "धर्म, आध्यात्मिक उपदेशक, ज्योतिष"],
      en: ["Education, teaching, research", "Law and judiciary", "Banking and finance", "Religion, spiritual teaching, astrology"],
      hi: ["शिक्षा, अध्यापन, अनुसंधान", "कानून व न्यायपालिका", "बैंकिंग व वित्त", "धर्म, आध्यात्मिक उपदेश, ज्योतिष"],
    },
    Venus: {
      mr: ["कला, संगीत, सिनेमा, फॅशन", "सौंदर्य प्रसाधन, हॉटेल व रेस्टॉरंट", "डिझाईन, आर्किटेक्चर", "विलास व सुखोपभोग उद्योग"],
      en: ["Art, music, cinema, fashion", "Cosmetics, hospitality, restaurants", "Design, architecture", "Luxury goods industry"],
      hi: ["कला, संगीत, सिनेमा, फैशन", "सौंदर्य प्रसाधन, आतिथ्य", "डिज़ाइन, वास्तुकला", "विलासिता उद्योग"],
    },
    Saturn: {
      mr: ["सरकारी सेवा, कामगार/मजूर क्षेत्र", "तेल, लोह, खनिज उद्योग", "सामाजिक कार्य, सेवा क्षेत्र", "दीर्घकालीन स्थिर करिअर (न्यायपालिका, प्रशासन)"],
      en: ["Government service, labour sector", "Oil, iron, mining industry", "Social work, service sector", "Long-term stable careers (judiciary, admin)"],
      hi: ["सरकारी सेवा, श्रमिक क्षेत्र", "तेल, लोहा, खनन उद्योग", "सामाजिक कार्य, सेवा क्षेत्र", "दीर्घकालीन स्थिर करियर"],
    },
  };

  const k10Lord = Object.keys(fieldMap).includes(tenth.en) ? tenth.en : "Sun";
  const fields = fieldMap[k10Lord] ?? fieldMap.Sun;

  return {
    windows,
    tenthLordMr: tenth.mr,
    tenthLordEn: tenth.en,
    tenthLordHouse: tenth.house,
    fieldSuggestionsMr: fields.mr,
    fieldSuggestionsEn: fields.en,
    fieldSuggestionsHi: fields.hi,
    overallMr: `१०व्या भावाचा स्वामी ${tenth.mr} ${tenth.house}व्या स्थानी — करिअर मार्गदर्शक ग्रह. कर्मप्रधान वर्ग दर्शविणारा.`,
    overallEn: `10th house lord ${tenth.en} in house ${tenth.house} — your career-guiding planet; indicates your work nature.`,
    overallHi: `१०वें भाव के स्वामी ${tenth.mr} ${tenth.house}वें स्थान में — करियर मार्गदर्शक ग्रह.`,
  };
}
