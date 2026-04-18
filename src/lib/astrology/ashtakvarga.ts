/**
 * Ashtakvarga — Bhinnashtakavarga (per-planet) + Sarvashtakvarga (total).
 * Bindu contribution tables from BPHS.
 *
 * Each of 7 planets + Lagna contributes bindus to specific houses (counted from itself)
 * in each of the 7 planet charts. Sum per rashi = BAV. Sum all BAVs = SAV.
 */

import type { KundliResult } from "./calculator";
import { RASHIS } from "./constants";

type BenefactorId = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Lagna";
type PlanetId = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

// Bindu rules: for each planet's chart, houses from each benefactor that give 1 bindu
const BINDU_RULES: Record<PlanetId, Record<BenefactorId, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11],
    Moon: [1, 3, 6, 7, 9, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [5, 6, 11, 12],
    Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11],
    Lagna: [1, 3, 4, 6, 10, 11],
  },
};

export interface BhinnashtakaChart {
  planetId: string;
  planetMr: string;
  planetEn: string;
  bindus: number[]; // 12 entries, index 0 = Aries
  total: number;
  contributions: Record<string, number[]>; // benefactor -> [bindu per rashi]
}

export interface AshtakvargaResult {
  bhinnashtaka: BhinnashtakaChart[];
  sarvashtaka: number[]; // 12 entries per rashi
  sarvashtakaTotal: number;
  rashiNames: { mr: string; en: string }[];
  strongestRashi: { index: number; mr: string; en: string; bindus: number };
  weakestRashi: { index: number; mr: string; en: string; bindus: number };
  houseStrength: Array<{
    house: number;
    rashiIndex: number;
    rashiMr: string;
    rashiEn: string;
    sav: number;
    verdict: "very strong" | "strong" | "average" | "weak";
    verdictMr: string;
    verdictEn: string;
    verdictHi: string;
    remediesMr: string[];
    remediesEn: string[];
    remediesHi: string[];
  }>;
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

const PLANET_MR: Record<PlanetId, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि",
};

const PLANET_ORDER: PlanetId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

// Per-house upaya when house is weak — 3-sentence traditional practices
const HOUSE_REMEDIES: Record<number, { mr: string[]; en: string[]; hi: string[] }> = {
  1: {
    mr: [
      "लग्न कमजोर असल्यास व्यक्तिमत्त्व व आरोग्य दुर्बल होते. दररोज सूर्यनमस्कार १२ वेळा व आदित्य हृदय स्तोत्र पठण करा.",
      "लग्नाच्या स्वामीचे रत्न धारण करा (ज्योतिषीच्या सल्ल्याने). शिव उपासना, रुद्राक्ष धारण, तुळशी-पूजा शरीर व आत्मशक्तीस पुष्टि देते.",
    ],
    en: [
      "Weak 1st house affects personality and health. Do 12 Surya Namaskars daily and recite Aditya Hridaya Stotra.",
      "Wear the gem of the Lagna lord (astrologer's advice). Shiva worship, Rudraksha and Tulsi puja strengthen body and self-confidence.",
    ],
    hi: [
      "लग्न कमजोर हो तो व्यक्तित्व व स्वास्थ्य दुर्बल. नित्य १२ सूर्य नमस्कार व आदित्य हृदय स्तोत्र पाठ.",
      "लग्नेश का रत्न धारण करें. शिव उपासना, रुद्राक्ष व तुलसी पूजा शरीर व आत्मबल बढ़ाती है.",
    ],
  },
  2: {
    mr: [
      "द्वितीय भाव कमजोर — आर्थिक, कुटुंब व वाणी दोष. गुरुवारी श्रीसूक्त व कनकधारा स्तोत्र पठण. घरातील तुळशीला रोज पाणी.",
      "चांदीच्या पात्रात दूध-खीर अर्पण. पिवळ्या वस्त्रातील हळद-साखर २१ दिवस ठेवून मग पितळ्यात ठेवा — धन-संचय वाढतो.",
    ],
    en: [
      "Weak 2nd — wealth, family, speech issues. Recite Shri Sukta and Kanakadhara Stotra on Thursdays. Water the home Tulsi daily.",
      "Offer milk-kheer in a silver vessel. Wrap turmeric and sugar in yellow cloth for 21 days, then store in a brass pot to grow savings.",
    ],
    hi: [
      "द्वितीय भाव कमजोर — धन, परिवार, वाणी दोष. गुरुवार को श्री सूक्त व कनकधारा स्तोत्र पाठ. घर की तुलसी में नित्य जल.",
      "चांदी के पात्र में दूध-खीर अर्पण. पीले वस्त्र में हल्दी-शक्कर २१ दिन रखकर पीतल के पात्र में रखें — धन संचय बढ़ता है.",
    ],
  },
  3: {
    mr: [
      "तृतीय भाव कमजोर — धैर्य, भावंडे, छोटे प्रवास. हनुमान चालीसा ११ वेळा मंगळवारी. हनुमानाला शेंदूर व बुंदीचा प्रसाद.",
      "हरितकीचे (बेहडा) सेवन, शस्त्र-साधना (योग व व्यायाम) दररोज. भावंडांशी सलोखा व संवाद.",
    ],
    en: [
      "Weak 3rd — courage, siblings, short journeys. Hanuman Chalisa 11 times on Tuesdays; sindoor and boondi offering.",
      "Take haritaki, do daily yoga/exercise. Mend ties with siblings.",
    ],
    hi: [
      "तृतीय भाव कमजोर — साहस, भाई-बहन, छोटी यात्राएं. मंगलवार हनुमान चालीसा ११ बार, सिंदूर व बूंदी प्रसाद.",
      "हरीतकी सेवन, नित्य योग. भाई-बहनों से सौहार्द.",
    ],
  },
  4: {
    mr: [
      "चतुर्थ भाव कमजोर — मातृसुख, घर, वाहन, मानसिक शांती. सोमवारी शिवाभिषेक व कच्चे दूध अर्पण. मातेची सेवा अत्यंत महत्त्वाची.",
      "घरात शंख वाजवणे, तुळशीची नित्य पूजा. चांदीच्या वस्तू घरात ठेवा. पांढरे व गुलाबी रंग घरात अधिक वापरा.",
    ],
    en: [
      "Weak 4th — mother, home, vehicle, peace of mind. Shiva abhishek and raw milk on Mondays. Serving the mother is paramount.",
      "Blow a conch at home, worship Tulsi daily. Keep silver items. Use more white and pink in decor.",
    ],
    hi: [
      "चतुर्थ भाव कमजोर — मातृसुख, गृह, वाहन, मानसिक शांति. सोमवार शिवाभिषेक व कच्चा दूध. माता की सेवा.",
      "घर में शंख, तुलसी पूजा. चांदी की वस्तुएं रखें. सफेद व गुलाबी रंग का प्रयोग.",
    ],
  },
  5: {
    mr: [
      "पंचम भाव कमजोर — संतती, शिक्षण, प्रेम. गुरुवारी विष्णू सहस्रनाम व संतान गोपाल मंत्र. श्रीकृष्ण पूजा.",
      "गाईची सेवा, लहान मुलांना मदत व शैक्षणिक दान. पिवळे वस्त्र व केळी ब्राह्मणांना दान.",
    ],
    en: [
      "Weak 5th — children, education, romance. Thursday Vishnu Sahasranama and Santan Gopal mantra; Krishna worship.",
      "Serve cows, help children with education, donate yellow cloth and bananas to Brahmins.",
    ],
    hi: [
      "पंचम भाव कमजोर — संतान, शिक्षा, प्रेम. गुरुवार विष्णु सहस्रनाम व संतान गोपाल मंत्र. कृष्ण पूजा.",
      "गौसेवा, बच्चों को शिक्षा सहायता, पीले वस्त्र व केले का दान.",
    ],
  },
  6: {
    mr: [
      "षष्ठ भाव — शत्रू, रोग, कर्ज. कर्ज-निवारणासाठी हनुमान बाहुक, बजरंग बाण पाठ. दर मंगळवारी व शनिवारी.",
      "आरोग्यासाठी महामृत्युंजय मंत्र, तुळशी काढा, नियमित व्यायाम. आजारी व्यक्तींची सेवा.",
    ],
    en: [
      "6th — enemies, disease, debt. Recite Hanuman Bahuk and Bajrang Baan on Tuesdays and Saturdays for debt relief.",
      "For health, chant Mahamrityunjaya, consume Tulsi decoction, exercise regularly. Serve the sick.",
    ],
    hi: [
      "षष्ठ भाव — शत्रु, रोग, ऋण. मंगलवार व शनिवार हनुमान बाहुक व बजरंग बाण पाठ.",
      "स्वास्थ्य हेतु महामृत्युंजय, तुलसी काढ़ा, नियमित व्यायाम. रोगी सेवा.",
    ],
  },
  7: {
    mr: [
      "सप्तम भाव कमजोर — विवाह, जोडीदार, भागीदारी. शुक्रवारी महालक्ष्मी पूजन, श्रीसूक्त, पांढरी-गुलाबी फुले अर्पण.",
      "दर गुरुवारी पिवळे वस्त्र परिधान व केळी दान. विवाहासाठी तुळजापूर भवानी किंवा कोल्हापूर महालक्ष्मी दर्शन.",
    ],
    en: [
      "Weak 7th — marriage, spouse, partnerships. Friday Mahalakshmi pujan, Shri Sukta, white-pink flowers.",
      "Wear yellow on Thursdays and donate bananas. Visit Tuljapur Bhavani or Kolhapur Mahalaxmi for marriage.",
    ],
    hi: [
      "सप्तम भाव कमजोर — विवाह, जीवनसाथी, साझेदारी. शुक्रवार महालक्ष्मी पूजन.",
      "गुरुवार पीले वस्त्र, केले दान. तुलजापुर भवानी या कोल्हापुर महालक्ष्मी यात्रा.",
    ],
  },
  8: {
    mr: [
      "अष्टम भाव — आयु, गुप्त बाबी, अनपेक्षित घटना. महामृत्युंजय मंत्र १०८ × ४० दिवस. शिव मंदिरात जलाभिषेक.",
      "पिंडदान, पितृतर्पण अमावस्येला. भैरव उपासना व काळ्या कुत्र्याची सेवा अशुभ शक्ती दूर करते.",
    ],
    en: [
      "8th — longevity, occult, sudden events. Chant Mahamrityunjaya 108 × 40 days. Jal-abhishek at Shiva temple.",
      "Perform pinda-daan and pitru-tarpana on Amavasya. Bhairava worship and serving a black dog dispel malefic energies.",
    ],
    hi: [
      "अष्टम भाव — आयु, गुप्त, अकस्मात. महामृत्युंजय १०८ × ४० दिन. शिव मंदिर जलाभिषेक.",
      "पिंडदान, पितृ तर्पण अमावस्या को. भैरव उपासना व काले कुत्ते की सेवा.",
    ],
  },
  9: {
    mr: [
      "नवम भाव — भाग्य, धर्म, गुरू, पिता. गुरुवारी गुरु पूजन, गुरुचरित्र पारायण. दत्त मंदिरात (गाणगापूर, नृसिंहवाडी) दर्शन.",
      "पित्याची सेवा, ज्येष्ठांना आदर. धार्मिक यात्रा, तीर्थक्षेत्र भेट — तिरुपती, बद्रीनाथ, केदारनाथ पैकी एक.",
    ],
    en: [
      "9th — fortune, dharma, guru, father. Guru worship on Thursday, Gurucharitra parayan. Darshan at Datta temples (Ganagapur, Narasobawadi).",
      "Serve father, respect elders. Undertake a tirtha yatra — Tirupati, Badrinath or Kedarnath.",
    ],
    hi: [
      "नवम भाव — भाग्य, धर्म, गुरु, पिता. गुरुवार गुरु पूजन, गुरुचरित्र पारायण. दत्त मंदिर दर्शन.",
      "पिता की सेवा, ज्येष्ठों का सम्मान. तीर्थ यात्रा — तिरुपति, बद्रीनाथ या केदारनाथ.",
    ],
  },
  10: {
    mr: [
      "दशम भाव — करिअर, प्रतिष्ठा, कर्म. सूर्याला रोज अर्घ्य व आदित्य हृदय पठण. नेतृत्व व प्रामाणिक कर्म.",
      "शनी-मंगळ दोष असल्यास शनी शिंगणापूर व हनुमान मंदिरात जा. पिंपळ वृक्षाखाली दीप व ध्यान.",
    ],
    en: [
      "10th — career, status, karma. Daily arghya to Sun and Aditya Hridaya. Leadership and honest work.",
      "If Shani-Mangal afflicted, visit Shani Shingnapur and a Hanuman temple. Light a lamp under a Peepal tree and meditate.",
    ],
    hi: [
      "दशम भाव — करियर, प्रतिष्ठा, कर्म. नित्य सूर्य अर्घ्य व आदित्य हृदय.",
      "शनि-मंगल दोष हो तो शनि शिंगणापुर व हनुमान मंदिर दर्शन. पीपल दीप व ध्यान.",
    ],
  },
  11: {
    mr: [
      "लाभ भाव — उत्पन्न, इच्छापूर्ती, मित्र. शुक्रवारी लक्ष्मी नारायण पूजन. एकादशीचा उपवास व विष्णू सहस्रनाम पठण.",
      "हिरवा, पिवळा रंग वापरा. श्रीयंत्र/कुबेर यंत्र घरात तिजोरीत. गरीब मित्र किंवा नातलगांना दान.",
    ],
    en: [
      "11th — income, fulfilment, friends. Friday Lakshmi-Narayan pujan. Ekadashi fast and Vishnu Sahasranama.",
      "Use green and yellow. Place Shri Yantra or Kubera Yantra in the safe at home. Donate to poor friends/relatives.",
    ],
    hi: [
      "लाभ भाव — आय, इच्छा पूर्ति, मित्र. शुक्रवार लक्ष्मी-नारायण पूजन. एकादशी व्रत व विष्णु सहस्रनाम.",
      "हरा, पीला रंग. श्री यंत्र/कुबेर यंत्र तिजोरी में. गरीब मित्रों/रिश्तेदारों को दान.",
    ],
  },
  12: {
    mr: [
      "व्यय भाव — खर्च, परदेश, मोक्ष. अनावश्यक खर्चासाठी बजट ठेवा. शनिवारी तेल दीप व शनी स्तोत्र.",
      "परदेश प्रवासापूर्वी गणपती व दुर्गा पूजन. ध्यान, योग व एकांत साधना. गरीबांना रोज अन्नदान.",
    ],
    en: [
      "12th — expenses, foreign, moksha. Budget strictly. Saturday oil lamp and Shani stotra.",
      "Before foreign travel, worship Ganesha and Durga. Meditation, yoga, solitude sadhana. Daily food donation to the poor.",
    ],
    hi: [
      "व्यय भाव — खर्च, विदेश, मोक्ष. कठोर बजट. शनिवार तेल दीप व शनि स्तोत्र.",
      "विदेश यात्रा पूर्व गणेश व दुर्गा पूजन. ध्यान, योग. गरीबों को नित्य अन्नदान.",
    ],
  },
};

export function calculateAshtakvarga(k: KundliResult): AshtakvargaResult {
  // Build benefactor rashi map
  const benefactorRashi: Record<BenefactorId, number> = {
    Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0,
    Lagna: k.lagnaRashiIndex,
  };
  for (const pp of k.planets) {
    if (PLANET_ORDER.includes(pp.id as PlanetId)) {
      benefactorRashi[pp.id as BenefactorId] = pp.rashiIndex;
    }
  }

  const bhinnashtaka: BhinnashtakaChart[] = [];

  for (const planetId of PLANET_ORDER) {
    const bindus = new Array(12).fill(0);
    const contributions: Record<string, number[]> = {};

    const rules = BINDU_RULES[planetId];
    const benefactors: BenefactorId[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Lagna"];

    for (const b of benefactors) {
      const bRashi = benefactorRashi[b];
      const houses = rules[b];
      const contribRow = new Array(12).fill(0);
      for (const h of houses) {
        // House h from benefactor = (benefactor's rashi + h - 1) % 12
        const rashi = (bRashi + h - 1) % 12;
        bindus[rashi] += 1;
        contribRow[rashi] += 1;
      }
      contributions[b] = contribRow;
    }

    const total = bindus.reduce((a, b) => a + b, 0);
    bhinnashtaka.push({
      planetId,
      planetMr: PLANET_MR[planetId],
      planetEn: planetId,
      bindus,
      total,
      contributions,
    });
  }

  // SAV = sum of all 7 BAV per rashi
  const sarvashtaka = new Array(12).fill(0);
  for (let i = 0; i < 12; i++) {
    for (const bav of bhinnashtaka) sarvashtaka[i] += bav.bindus[i];
  }
  const sarvashtakaTotal = sarvashtaka.reduce((a, b) => a + b, 0);

  // Rashi names
  const rashiNames = RASHIS.map((r) => ({ mr: r.mr, en: r.en }));

  // Strongest / weakest rashi
  let maxIdx = 0, minIdx = 0;
  for (let i = 1; i < 12; i++) {
    if (sarvashtaka[i] > sarvashtaka[maxIdx]) maxIdx = i;
    if (sarvashtaka[i] < sarvashtaka[minIdx]) minIdx = i;
  }

  // House strength (from Lagna)
  const houseStrength = [];
  for (let h = 1; h <= 12; h++) {
    const ri = (k.lagnaRashiIndex + h - 1) % 12;
    const sav = sarvashtaka[ri];
    let verdict: "very strong" | "strong" | "average" | "weak";
    let verdictMr: string; let verdictEn: string; let verdictHi: string;
    if (sav >= 33) { verdict = "very strong"; verdictMr = "अत्यंत प्रबळ"; verdictEn = "Very Strong"; verdictHi = "अत्यंत प्रबल"; }
    else if (sav >= 28) { verdict = "strong"; verdictMr = "प्रबळ"; verdictEn = "Strong"; verdictHi = "प्रबल"; }
    else if (sav >= 25) { verdict = "average"; verdictMr = "मध्यम"; verdictEn = "Average"; verdictHi = "मध्यम"; }
    else { verdict = "weak"; verdictMr = "क्षीण"; verdictEn = "Weak"; verdictHi = "क्षीण"; }
    houseStrength.push({
      house: h, rashiIndex: ri,
      rashiMr: rashiNames[ri].mr, rashiEn: rashiNames[ri].en,
      sav, verdict, verdictMr, verdictEn, verdictHi,
      remediesMr: HOUSE_REMEDIES[h].mr,
      remediesEn: HOUSE_REMEDIES[h].en,
      remediesHi: HOUSE_REMEDIES[h].hi,
    });
  }

  return {
    bhinnashtaka,
    sarvashtaka,
    sarvashtakaTotal,
    rashiNames,
    strongestRashi: { index: maxIdx, mr: rashiNames[maxIdx].mr, en: rashiNames[maxIdx].en, bindus: sarvashtaka[maxIdx] },
    weakestRashi: { index: minIdx, mr: rashiNames[minIdx].mr, en: rashiNames[minIdx].en, bindus: sarvashtaka[minIdx] },
    houseStrength,
    summaryMr: `सर्वाधिक प्रबळ राशी: ${rashiNames[maxIdx].mr} (${sarvashtaka[maxIdx]} बिंदू). सर्वात कमजोर: ${rashiNames[minIdx].mr} (${sarvashtaka[minIdx]} बिंदू). एकूण SAV: ${sarvashtakaTotal} (प्रमाण ३३७).`,
    summaryEn: `Strongest rashi: ${rashiNames[maxIdx].en} (${sarvashtaka[maxIdx]} bindus). Weakest: ${rashiNames[minIdx].en} (${sarvashtaka[minIdx]}). Total SAV: ${sarvashtakaTotal} (of 337).`,
    summaryHi: `सर्वाधिक प्रबल राशि: ${rashiNames[maxIdx].mr} (${sarvashtaka[maxIdx]} बिंदु). सबसे कमजोर: ${rashiNames[minIdx].mr} (${sarvashtaka[minIdx]}). कुल SAV: ${sarvashtakaTotal} (कुल 337).`,
  };
}
