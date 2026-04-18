/**
 * Life event timing — marriage and career windows from dasha analysis.
 * Scans Mahadasha + Antardasha periods for favorable lord combinations.
 */

import type { KundliResult, PlanetPosition, DashaPeriod } from "./calculator";

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon", 4: "Sun", 5: "Mercury",
  6: "Venus", 7: "Mars", 8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

// Per-planet career flavor text — BPHS-based dasha effects on karma-bhava.
const CAREER_MD_TEXT: Record<string, { mr: string; en: string; hi: string }> = {
  Sun: {
    mr: "अधिकारपद, शासकीय सेवा व नेतृत्वास अनुकूल काळ. पदोन्नती व सन्मान.",
    en: "Favourable for authority, govt service and leadership. Promotions and honors.",
    hi: "अधिकार पद, सरकारी सेवा व नेतृत्व अनुकूल. पदोन्नति व सम्मान.",
  },
  Moon: {
    mr: "जनसंपर्क, हॉस्पिटॅलिटी, मीडिया क्षेत्रात प्रगती. लोकप्रियता वाढेल.",
    en: "Progress in public relations, hospitality, media. Popularity increases.",
    hi: "जनसंपर्क, आतिथ्य, मीडिया में प्रगति. लोकप्रियता बढ़ेगी.",
  },
  Mars: {
    mr: "पराक्रमातून उन्नती — सैन्य, पोलिस, अभियांत्रिकी, मालमत्ता क्षेत्र. धाडसी निर्णयांचे फल.",
    en: "Rise through valor — military, police, engineering, real estate. Rewards for bold decisions.",
    hi: "पराक्रम से उन्नति — सेना, पुलिस, अभियांत्रिकी, रियल एस्टेट. साहसी निर्णयों का फल.",
  },
  Mercury: {
    mr: "व्यवसाय, IT, लेखन, शिक्षण, वाणिज्यात चमक. बुद्धिमत्तेचा वापर कामी येईल.",
    en: "Shine in business, IT, writing, education, commerce. Intellect pays off.",
    hi: "व्यापार, IT, लेखन, शिक्षा, वाणिज्य में चमक. बुद्धि का लाभ मिलेगा.",
  },
  Jupiter: {
    mr: "शिक्षण, सल्लागार, न्याय, अर्थ क्षेत्रात विस्तार. गुरुकृपेने पदोन्नती.",
    en: "Expansion in education, advisory, law, finance. Promotion via guru-grace.",
    hi: "शिक्षा, सलाहकार, न्याय, वित्त में विस्तार. गुरु कृपा से पदोन्नति.",
  },
  Venus: {
    mr: "कला, मनोरंजन, फॅशन, सौंदर्य, भागीदारी-व्यवसायात यश. विलासी जीवनशैली.",
    en: "Success in arts, entertainment, fashion, beauty, partnership business. Luxurious lifestyle.",
    hi: "कला, मनोरंजन, फैशन, सौंदर्य, साझेदारी व्यवसाय में सफलता. विलासी जीवनशैली.",
  },
  Saturn: {
    mr: "दीर्घ-कर्मातून स्थायी उन्नती — प्रशासन, खाण, बांधकाम, सरकारी पदे. कष्टाने सत्ता.",
    en: "Lasting rise through long labor — administration, mining, construction, govt posts. Power through hardship.",
    hi: "दीर्घ कर्म से स्थायी उन्नति — प्रशासन, खनन, निर्माण, सरकारी पद. परिश्रम से सत्ता.",
  },
  Rahu: {
    mr: "परदेशी संधी, तंत्रज्ञान, राजकारण, असामान्य क्षेत्रात चमत्कारी झेप. अनपेक्षित लाभ.",
    en: "Foreign opportunities, technology, politics, unusual fields — miraculous leap. Unexpected gains.",
    hi: "विदेशी अवसर, तकनीक, राजनीति, असामान्य क्षेत्रों में चमत्कारी छलांग. अप्रत्याशित लाभ.",
  },
  Ketu: {
    mr: "संशोधन, आध्यात्म, गूढविद्या, सल्ला क्षेत्रात यश. आतील शक्ती प्रकट होईल.",
    en: "Success in research, spirituality, occult, consulting. Inner power emerges.",
    hi: "अनुसंधान, अध्यात्म, गूढ विद्या, परामर्श में सफलता. आंतरिक शक्ति प्रकट होगी.",
  },
};

const CAREER_AD_FLAVOR: Record<string, { mr: string; en: string; hi: string }> = {
  Sun: { mr: "सरकारी मान्यता-पदोन्नती संभव", en: "Govt recognition/promotion likely", hi: "सरकारी मान्यता-पदोन्नति संभव" },
  Moon: { mr: "जनसंपर्कातून नव संधी", en: "New opportunities via public contact", hi: "जनसंपर्क से नए अवसर" },
  Mars: { mr: "साहसी कृतीला फल", en: "Bold action rewarded", hi: "साहसी कार्य को फल" },
  Mercury: { mr: "बौद्धिक कार्यात यश", en: "Intellectual work succeeds", hi: "बौद्धिक कार्य में सफलता" },
  Jupiter: { mr: "गुरुजनांचे मार्गदर्शन लाभेल", en: "Mentor/guide's guidance helps", hi: "गुरुजनों का मार्गदर्शन मिलेगा" },
  Venus: { mr: "भागीदारी-कलेतून उत्पन्न", en: "Income via partnership/arts", hi: "साझेदारी-कला से आय" },
  Saturn: { mr: "दीर्घ प्रकल्पांना गती", en: "Long projects gain momentum", hi: "दीर्घ परियोजनाओं को गति" },
  Rahu: { mr: "परदेशी वा तांत्रिक संपर्क लाभ", en: "Foreign/technical contacts benefit", hi: "विदेशी/तकनीकी संपर्क लाभ" },
  Ketu: { mr: "गुप्त प्रकल्पांना यश", en: "Hidden projects succeed", hi: "गुप्त परियोजनाओं में सफलता" },
};

const MARRIAGE_MD_TEXT: Record<string, { mr: string; en: string; hi: string }> = {
  Sun: {
    mr: "उच्च-प्रतिष्ठित जोडीदाराचा योग. सरकारी-व्यावसायिक कुटुंबातून संबंध शक्य.",
    en: "High-prestige spouse yoga. Alliance from govt/professional family possible.",
    hi: "उच्च प्रतिष्ठित जीवनसाथी का योग. सरकारी/व्यावसायिक परिवार से संबंध संभव.",
  },
  Moon: {
    mr: "भावनिक, सौम्य, कौटुंबिक जोडीदार. माता-पक्षातून सुचवणी.",
    en: "Emotional, gentle, family-oriented spouse. Suggestion from maternal side.",
    hi: "भावुक, सौम्य, पारिवारिक जीवनसाथी. मातृ पक्ष से सुझाव.",
  },
  Mars: {
    mr: "धाडसी-स्वतंत्र जोडीदार. मंगळदोष असल्यास सांभाळ आवश्यक.",
    en: "Bold-independent spouse. Mangal-dosh care needed if present.",
    hi: "साहसी-स्वतंत्र जीवनसाथी. मंगल दोष हो तो सावधानी आवश्यक.",
  },
  Mercury: {
    mr: "बुद्धिमान-विनोदी जोडीदार. नातेवाईकांकडून सुचवणी, प्रेमविवाह शक्य.",
    en: "Intelligent-witty spouse. Suggestion from relatives, love marriage possible.",
    hi: "बुद्धिमान-विनोदी जीवनसाथी. रिश्तेदारों से सुझाव, प्रेम विवाह संभव.",
  },
  Jupiter: {
    mr: "धार्मिक-विद्वान जोडीदार, भाग्यशाली विवाह. गुरुकृपेने निर्णय.",
    en: "Religious-scholarly spouse, fortunate marriage. Decision under guru-grace.",
    hi: "धार्मिक-विद्वान जीवनसाथी, भाग्यशाली विवाह. गुरु कृपा से निर्णय.",
  },
  Venus: {
    mr: "सुंदर-कलात्मक जोडीदार. अत्यंत शुभ विवाहयोग — प्रेम व भोगसौख्य.",
    en: "Beautiful-artistic spouse. Highly auspicious marriage yoga — love and sensual joy.",
    hi: "सुंदर-कलात्मक जीवनसाथी. अत्यंत शुभ विवाह योग — प्रेम व भोग सुख.",
  },
  Saturn: {
    mr: "गंभीर, वयस्कर वा प्रौढ जोडीदार. विवाहात विलंब पण स्थिर सहचर.",
    en: "Serious, older or mature spouse. Marriage delays but stable partnership.",
    hi: "गंभीर, वयस्क या प्रौढ जीवनसाथी. विवाह में विलंब पर स्थिर सहचर.",
  },
  Rahu: {
    mr: "असामान्य, परदेशी किंवा आंतरजातीय जोडीदार. अनपेक्षित संबंध.",
    en: "Unusual, foreign or inter-caste spouse. Unexpected alliance.",
    hi: "असामान्य, विदेशी या अंतरजातीय जीवनसाथी. अप्रत्याशित संबंध.",
  },
  Ketu: {
    mr: "आध्यात्मिक-विरक्त जोडीदार. पूर्वजन्म-ऋणबंध संभव.",
    en: "Spiritual-detached spouse. Past-life karmic bond possible.",
    hi: "आध्यात्मिक-विरक्त जीवनसाथी. पूर्व जन्म का ऋण संबंध संभव.",
  },
};

const MARRIAGE_AD_FLAVOR: Record<string, { mr: string; en: string; hi: string }> = {
  Sun: { mr: "पित्याच्या संमतीने निर्णय", en: "Decision with father's consent", hi: "पिता की सहमति से निर्णय" },
  Moon: { mr: "माता-कृपेने सुचवणी", en: "Suggestion via mother's grace", hi: "माता कृपा से सुझाव" },
  Mars: { mr: "धाडसी निर्णय, साखरपुड्यात वेग", en: "Bold decision, engagement hastens", hi: "साहसी निर्णय, सगाई में तेज़ी" },
  Mercury: { mr: "नातेवाईकांमार्फत प्रस्ताव", en: "Proposal via relatives", hi: "रिश्तेदारों के माध्यम से प्रस्ताव" },
  Jupiter: { mr: "शुभ मुहूर्त व आशीर्वाद", en: "Auspicious muhurta and blessings", hi: "शुभ मुहूर्त व आशीर्वाद" },
  Venus: { mr: "प्रेम-आकर्षण चरमावर", en: "Peak attraction/love", hi: "प्रेम-आकर्षण चरम पर" },
  Saturn: { mr: "विचारपूर्वक पण टिकाऊ निर्णय", en: "Considered, lasting decision", hi: "विचारपूर्वक, टिकाऊ निर्णय" },
  Rahu: { mr: "असामान्य मार्गाने संबंध", en: "Alliance through unusual route", hi: "असामान्य मार्ग से संबंध" },
  Ketu: { mr: "गूढ/पूर्वनिर्धारित बंधन", en: "Karmic/predestined bond", hi: "गूढ/पूर्वनिर्धारित संबंध" },
};

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

      let reasonMr = "";
      let reasonEn = "";
      let reasonHi = "";
      if (area === "marriage") {
        const mdText = MARRIAGE_MD_TEXT[md.lord] ?? { mr: "वैवाहिक योग अनुकूल.", en: "Favourable for marriage.", hi: "विवाह हेतु अनुकूल." };
        const adFlav = MARRIAGE_AD_FLAVOR[ad.lord] ?? { mr: "अंतर्दशा पोषक", en: "antardasha supportive", hi: "अंतर्दशा पोषक" };
        reasonMr = `${mdMr} महादशा — ${mdText.mr} ${adMr} अंतर्दशा: ${adFlav.mr}. शक्ती ${combinedScore}/१०.`;
        reasonEn = `${md.lord} mahadasha — ${mdText.en} ${ad.lord} antardasha: ${adFlav.en}. Strength ${combinedScore}/10.`;
        reasonHi = `${mdMr} महादशा — ${mdText.hi} ${adMr} अंतर्दशा: ${adFlav.hi}. शक्ति ${combinedScore}/10.`;
      } else {
        const mdText = CAREER_MD_TEXT[md.lord] ?? { mr: "करिअरमध्ये उन्नती संभव.", en: "Career advancement likely.", hi: "करियर में उन्नति संभव." };
        const adFlav = CAREER_AD_FLAVOR[ad.lord] ?? { mr: "अंतर्दशा पोषक", en: "antardasha supportive", hi: "अंतर्दशा पोषक" };
        reasonMr = `${mdMr} महादशा — ${mdText.mr} ${adMr} अंतर्दशा: ${adFlav.mr}. शक्ती ${combinedScore}/१०.`;
        reasonEn = `${md.lord} mahadasha — ${mdText.en} ${ad.lord} antardasha: ${adFlav.en}. Strength ${combinedScore}/10.`;
        reasonHi = `${mdMr} महादशा — ${mdText.hi} ${adMr} अंतर्दशा: ${adFlav.hi}. शक्ति ${combinedScore}/10.`;
      }

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
