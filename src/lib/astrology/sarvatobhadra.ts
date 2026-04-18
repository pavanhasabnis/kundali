/**
 * Sarvatobhadra Chakra — transit vedha analysis.
 * 28 nakshatras arranged on perimeter of 9×9 grid.
 * Vedha from natal Janma nakshatra determines current auspiciousness.
 *
 * Classic vedha positions from Janma (natal Moon) nakshatra:
 *   1 Janma · 3 Sanghatik · 5 Samudaya · 7 Jati ·
 *   10 Karma · 12 Desha · 14 Adhana · 16 Manasa ·
 *   18 Naidhana · 19 Vinasha · 23 Vainashika · 25 Maanas
 */

import swisseph from "swisseph";
import { NAKSHATRAS } from "./constants";
import { calculateKundli, type KundliResult } from "./calculator";

export interface SbcTransitPlanet {
  id: string;
  nameMr: string;
  nameEn: string;
  nameHi: string;
  nakshatraIndex: number;
  nakshatraMr: string;
  nakshatraEn: string;
  offsetFromNatal: number;    // 1-27
  vedhaType: string | null;   // "janma" | "sanghatik" | ... | null
  vedhaTypeMr: string | null;
  vedhaTypeEn: string | null;
  vedhaTypeHi: string | null;
  isBenefic: boolean;
  effect: "auspicious" | "inauspicious" | "neutral";
}

export interface SbcGridCell {
  nakshatraIndex: number;
  nakshatraMr: string;
  nakshatraEn: string;
  isNatal: boolean;
  isVedhaPosition: boolean;
  vedhaType: string | null;
  transitPlanets: string[]; // planet IDs currently at this nakshatra
}

export interface SarvatobhadraResult {
  natalNakshatraIndex: number;
  natalNakshatraMr: string;
  natalNakshatraEn: string;
  natalNakshatraHi: string;
  transits: SbcTransitPlanet[];
  grid: SbcGridCell[];          // 28 cells, perimeter order
  auspiciousCount: number;
  inauspiciousCount: number;
  neutralCount: number;
  rating: number;               // 1-5
  verdict: "very auspicious" | "auspicious" | "mixed" | "challenging" | "avoid";
  verdictMr: string;
  verdictEn: string;
  verdictHi: string;
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

// Per-vedha-rating remedies — traditional transit mitigation upaya
const VEDHA_REMEDIES: Record<1 | 2 | 3 | 4 | 5, { mr: string[]; en: string[]; hi: string[] }> = {
  5: {
    mr: [
      "अत्यंत शुभ गोचर — महत्त्वाची कार्ये, नवीन सुरुवात, विवाह, व्यापार, घर खरेदी यास श्रेष्ठ काळ आहे. शुभ मुहूर्तानुसार कार्य करा.",
      "या काळात दान, यात्रा, गुरु सेवा व धार्मिक कार्ये वाढवून शुभ फल दीर्घकाळ टिकवता येते.",
    ],
    en: [
      "Very auspicious transits — ideal time for major actions: new ventures, marriage, business, home purchase. Act per muhurat.",
      "Increase charity, pilgrimage, guru seva and religious practices now to extend the good phala.",
    ],
    hi: [
      "अत्यंत शुभ गोचर — नए कार्य, विवाह, व्यवसाय, गृह क्रय के लिए श्रेष्ठ काल. मुहूर्त अनुसार कार्य करें.",
      "इस काल में दान, यात्रा, गुरु सेवा व धार्मिक कार्य बढ़ाकर शुभ फल दीर्घकालीन बनेगा.",
    ],
  },
  4: {
    mr: [
      "शुभ गोचर — बहुतांश कार्ये अनुकूल होतील. विशेष काळजी न घेताही सामान्य कार्ये सफल होतील.",
      "गुरुवारी विष्णू सहस्रनाम, शुक्रवारी लक्ष्मी पूजन करून लाभ वाढवा. दानधर्म चालू ठेवा.",
    ],
    en: [
      "Auspicious transits — most undertakings will succeed. Routine work proceeds smoothly without special precautions.",
      "Boost gains by reciting Vishnu Sahasranama on Thursdays and Lakshmi pujan on Fridays. Continue charity.",
    ],
    hi: [
      "शुभ गोचर — अधिकांश कार्य अनुकूल. सामान्य कार्य बिना विशेष सावधानी के सफल होंगे.",
      "गुरुवार विष्णु सहस्रनाम, शुक्रवार लक्ष्मी पूजन. दानधर्म जारी रखें.",
    ],
  },
  3: {
    mr: [
      "मिश्र गोचर — काही क्षेत्रे अनुकूल, काही अडचणी. मोठे निर्णय घेण्यापूर्वी योग्य मुहूर्त पाहा व ज्योतिषीचा सल्ला घ्या.",
      "दररोज सकाळी १०८ गायत्री मंत्र जप. हनुमान चालीसा व महामृत्युंजय नित्य. शुभ कार्यासाठी वार व तिथी पाहूनच कार्य.",
      "दानधर्म व गरीब-सेवा करून अशुभ प्रभाव कमी करा. शुक्रवारी दुर्गा सप्तशती पाठ.",
    ],
    en: [
      "Mixed transits — some areas favorable, some challenging. Before major decisions, check muhurta and consult an astrologer.",
      "Chant 108 Gayatri mantra each morning. Hanuman Chalisa and Mahamrityunjaya daily. Undertake auspicious work only on suitable vaar/tithi.",
      "Charity and service to the poor reduce malefic effects. Durga Saptashati paath on Fridays.",
    ],
    hi: [
      "मिश्रित गोचर — कुछ क्षेत्र अनुकूल, कुछ चुनौतीपूर्ण. बड़े निर्णय से पहले मुहूर्त व ज्योतिषी परामर्श.",
      "प्रातः १०८ गायत्री मंत्र. हनुमान चालीसा व महामृत्युंजय नित्य. शुभ कार्य वार/तिथि देखकर.",
      "दान व गरीब सेवा से अशुभ प्रभाव कम करें. शुक्रवार दुर्गा सप्तशती पाठ.",
    ],
  },
  2: {
    mr: [
      "सावधगिरीचा काळ — मोठ्या निर्णयांस टाळा, आर्थिक जोखीम व वाद विवाद टाळा. दररोज महामृत्युंजय मंत्र १०८ वेळा.",
      "प्रत्येक शनिवारी शनी मंदिर, हनुमान मंदिरात जा. तेलाभिषेक, हनुमान चालीसा ११ वेळा.",
      "दान — काळे तीळ, लोखंड, कपडे, अन्न. दुर्बल व आजारी लोकांची सेवा. मीठ कमी खा, मद्य-मांस वर्ज्य.",
      "रुद्राक्ष ५-मुखी धारण. सोमवार, प्रदोष, शिवरात्री उपवास व शिवाभिषेक.",
    ],
    en: [
      "Challenging transits — avoid major decisions, financial risks and disputes. Chant Mahamrityunjaya mantra 108 times daily.",
      "Every Saturday visit Shani and Hanuman temples — oil abhishek, Hanuman Chalisa 11 times.",
      "Donate black sesame, iron, clothes, food. Serve the weak and sick. Reduce salt; avoid alcohol and meat.",
      "Wear 5-mukhi Rudraksha. Fast on Monday, Pradosh, Shivaratri with Shiva abhishek.",
    ],
    hi: [
      "चुनौतीपूर्ण काल — बड़े निर्णय, आर्थिक जोखिम, विवाद टालें. नित्य महामृत्युंजय १०८ जाप.",
      "शनिवार शनि व हनुमान मंदिर — तेलाभिषेक, हनुमान चालीसा ११ बार.",
      "काले तिल, लोहा, वस्त्र, अन्न दान. रोगी सेवा. नमक कम, मद्य-मांस वर्ज्य.",
      "५-मुखी रुद्राक्ष. सोमवार, प्रदोष, शिवरात्रि उपवास व शिवाभिषेक.",
    ],
  },
  1: {
    mr: [
      "अत्यंत गंभीर गोचर — महत्त्वाची कामे, विवाह, व्यापार सुरू करणे, मालमत्ता खरेदी हे पूर्णतः टाळा. सुमारे ३-६ महिने प्रतीक्षा.",
      "त्रिदोष निवारण पूजा — ग्रह शांती हवन, नवग्रह पूजा प्रामाणिक पंडितांकडून करवा. त्र्यंबकेश्वर किंवा नाशिक येथे शांती यज्ञ.",
      "दररोज महामृत्युंजय १०८ + हनुमान चालीसा ११ + रुद्राभिषेक साप्ताहिक. ॐ नमः शिवाय व दुर्गा सप्तशती नित्य.",
      "विशेष सावधानी — प्रवास, शस्त्रक्रिया, आर्थिक व्यवहार, कायदेशीर बाबी पुढे ढकला. ज्योतिषीच्या मार्गदर्शनानुसार उपाय करा.",
      "गरीबांना रोज अन्नदान, वस्त्र व औषधी दान. गौसेवा, वृद्ध-सेवा, अंध व अपंग व्यक्तींना मदत. पितृ तर्पण अमावस्येला अवश्य.",
      "रुद्राक्ष, पोवळा, नीलम यांसारखी रत्ने ज्योतिषीच्या मार्गदर्शनानुसार धारण. शिव-कालभैरव-हनुमान ही त्रिमूर्ती उपास्य.",
    ],
    en: [
      "Very serious transits — absolutely avoid major undertakings, marriage, business launches, property purchases. Wait 3-6 months.",
      "Tridosh nivarana pooja — Graha shanti havan, Navagraha pooja by qualified pandits. Shanti yajna at Trimbakeshwar or Nashik.",
      "Daily: Mahamrityunjaya 108 + Hanuman Chalisa 11 + weekly Rudrabhishek. Om Namah Shivaya and Durga Saptashati daily.",
      "Postpone travel, surgery, financial deals, legal matters. Follow astrologer's remedies strictly.",
      "Daily food, clothing and medicine donations. Go-seva, elder service, help to blind and disabled. Pitru tarpana every Amavasya.",
      "Wear Rudraksha, coral, blue sapphire under expert guidance. Shiva-Kalabhairava-Hanuman is the protective triad.",
    ],
    hi: [
      "अत्यंत गंभीर गोचर — विवाह, व्यवसाय, संपत्ति क्रय पूर्णतः टालें. ३-६ माह प्रतीक्षा.",
      "त्रिदोष निवारण पूजा — ग्रह शांति हवन, नवग्रह पूजा. त्र्यंबकेश्वर या नाशिक में शांति यज्ञ.",
      "नित्य महामृत्युंजय १०८ + हनुमान चालीसा ११ + साप्ताहिक रुद्राभिषेक. ॐ नमः शिवाय व दुर्गा सप्तशती.",
      "यात्रा, शल्यक्रिया, आर्थिक लेन-देन, कानूनी कार्य स्थगित. ज्योतिषी की मार्गदर्शन के अनुसार उपाय.",
      "नित्य अन्न, वस्त्र, औषधि दान. गौ-सेवा, वृद्ध-सेवा, अंध-विकलांग सहायता. अमावस्या पितृ तर्पण.",
      "रुद्राक्ष, मूंगा, नीलम ज्योतिषी अनुसार धारण. शिव-काल भैरव-हनुमान उपासना.",
    ],
  },
};

const PLANET_META: Record<string, { mr: string; en: string; hi: string; benefic: boolean; sweCode: number }> = {
  Sun:     { mr: "सूर्य", en: "Sun",     hi: "सूर्य", benefic: false, sweCode: swisseph.SE_SUN },
  Moon:    { mr: "चंद्र", en: "Moon",    hi: "चंद्र", benefic: true,  sweCode: swisseph.SE_MOON },
  Mars:    { mr: "मंगळ", en: "Mars",    hi: "मंगल",  benefic: false, sweCode: swisseph.SE_MARS },
  Mercury: { mr: "बुध",  en: "Mercury", hi: "बुध",   benefic: true,  sweCode: swisseph.SE_MERCURY },
  Jupiter: { mr: "गुरु", en: "Jupiter", hi: "गुरु",  benefic: true,  sweCode: swisseph.SE_JUPITER },
  Venus:   { mr: "शुक्र", en: "Venus",   hi: "शुक्र", benefic: true,  sweCode: swisseph.SE_VENUS },
  Saturn:  { mr: "शनि",  en: "Saturn",  hi: "शनि",  benefic: false, sweCode: swisseph.SE_SATURN },
  Rahu:    { mr: "राहु", en: "Rahu",    hi: "राहु",  benefic: false, sweCode: swisseph.SE_TRUE_NODE },
};

// Vedha positions from Janma nakshatra (1-indexed offset)
const VEDHA_POSITIONS: Record<number, { id: string; mr: string; en: string; hi: string; effect: "auspicious" | "inauspicious" }> = {
  1:  { id: "janma",       mr: "जन्म",        en: "Janma",       hi: "जन्म",       effect: "inauspicious" },
  3:  { id: "sanghatik",   mr: "संघातिक",     en: "Sanghatik",   hi: "संघातिक",    effect: "inauspicious" },
  5:  { id: "samudaya",    mr: "समुदाय",      en: "Samudaya",    hi: "समुदाय",     effect: "inauspicious" },
  7:  { id: "jati",        mr: "जाती",         en: "Jati",        hi: "जाति",       effect: "inauspicious" },
  10: { id: "karma",       mr: "कर्म",        en: "Karma",       hi: "कर्म",       effect: "auspicious"  },
  12: { id: "desha",       mr: "देश",         en: "Desha",       hi: "देश",        effect: "auspicious"  },
  14: { id: "adhana",      mr: "आधान",        en: "Adhana",      hi: "आधान",       effect: "inauspicious" },
  16: { id: "manasa",      mr: "मानस",        en: "Manasa",      hi: "मानस",       effect: "auspicious"  },
  18: { id: "naidhana",    mr: "नैधन",        en: "Naidhana",    hi: "नैधन",       effect: "inauspicious" },
  19: { id: "vinasha",     mr: "विनाश",       en: "Vinasha",     hi: "विनाश",      effect: "inauspicious" },
  23: { id: "vainashika",  mr: "वैनाशिक",     en: "Vainashika",  hi: "वैनाशिक",    effect: "inauspicious" },
  25: { id: "maanas",      mr: "मानस",        en: "Maanas",      hi: "मानस",       effect: "auspicious"  },
};

function nakshatraFromSidereal(sidLong: number): number {
  return Math.floor(sidLong / (360 / 27)) % 27;
}

function currentTransitNakshatras(): Record<string, number> {
  const now = new Date();
  const jd = swisseph.swe_julday(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60,
    swisseph.SE_GREG_CAL
  );
  // Set sidereal mode (Lahiri)
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);

  const out: Record<string, number> = {};
  for (const [id, meta] of Object.entries(PLANET_META)) {
    const res = swisseph.swe_calc_ut(jd, meta.sweCode, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED);
    if ("longitude" in res) {
      out[id] = nakshatraFromSidereal(res.longitude);
    }
  }
  // Ketu = Rahu + 180°
  if ("Rahu" in out) {
    const rahuRes = swisseph.swe_calc_ut(jd, swisseph.SE_TRUE_NODE, swisseph.SEFLG_SIDEREAL);
    if ("longitude" in rahuRes) {
      const ketuLong = (rahuRes.longitude + 180) % 360;
      out["Ketu"] = nakshatraFromSidereal(ketuLong);
    }
  }
  return out;
}

export function calculateSarvatobhadra(natal: KundliResult): SarvatobhadraResult {
  const natalIdx = natal.moonNakshatraIndex;
  const natalNak = NAKSHATRAS[natalIdx];

  const transitNakshatras = currentTransitNakshatras();

  // Ketu benefic status (Ketu similar to Saturn — malefic)
  const KETU_BENEFIC = false;

  const transits: SbcTransitPlanet[] = [];
  let auspiciousCount = 0, inauspiciousCount = 0, neutralCount = 0;

  for (const [planetId, currentIdx] of Object.entries(transitNakshatras)) {
    const meta = planetId === "Ketu"
      ? { mr: "केतु", en: "Ketu", hi: "केतु", benefic: KETU_BENEFIC }
      : PLANET_META[planetId];
    const offset = ((currentIdx - natalIdx + 27) % 27) + 1; // 1-27
    const vedha = VEDHA_POSITIONS[offset];
    const nak = NAKSHATRAS[currentIdx];

    let effect: "auspicious" | "inauspicious" | "neutral" = "neutral";
    if (vedha) {
      // Benefic at auspicious vedha = auspicious; benefic at inauspicious vedha = softened (neutral);
      // Malefic at auspicious vedha = mixed (neutral); malefic at inauspicious vedha = inauspicious
      if (meta.benefic && vedha.effect === "auspicious") effect = "auspicious";
      else if (meta.benefic && vedha.effect === "inauspicious") effect = "neutral";
      else if (!meta.benefic && vedha.effect === "inauspicious") effect = "inauspicious";
      else effect = "neutral";
    }

    if (effect === "auspicious") auspiciousCount++;
    else if (effect === "inauspicious") inauspiciousCount++;
    else neutralCount++;

    transits.push({
      id: planetId,
      nameMr: meta.mr, nameEn: meta.en, nameHi: meta.hi,
      nakshatraIndex: currentIdx,
      nakshatraMr: nak.mr, nakshatraEn: nak.en,
      offsetFromNatal: offset,
      vedhaType: vedha?.id ?? null,
      vedhaTypeMr: vedha?.mr ?? null,
      vedhaTypeEn: vedha?.en ?? null,
      vedhaTypeHi: vedha?.hi ?? null,
      isBenefic: meta.benefic,
      effect,
    });
  }

  // Build 28-cell perimeter grid
  const grid: SbcGridCell[] = [];
  for (let i = 0; i < 28; i++) {
    const nakIdx = i % 27; // 27 nakshatras, position 27 wraps to Ashwini again (traditional SBC has Abhijit as 28th — we duplicate)
    const nak = NAKSHATRAS[nakIdx];
    const offset = ((nakIdx - natalIdx + 27) % 27) + 1;
    const vedha = VEDHA_POSITIONS[offset];
    const transitsAtCell = transits.filter((tp) => tp.nakshatraIndex === nakIdx).map((tp) => tp.id);
    grid.push({
      nakshatraIndex: nakIdx,
      nakshatraMr: nak.mr,
      nakshatraEn: nak.en,
      isNatal: nakIdx === natalIdx,
      isVedhaPosition: !!vedha,
      vedhaType: vedha?.id ?? null,
      transitPlanets: transitsAtCell,
    });
  }

  // Rating 1-5
  const total = auspiciousCount + inauspiciousCount + neutralCount;
  const netScore = auspiciousCount - inauspiciousCount;
  let rating: number;
  if (netScore >= 3) rating = 5;
  else if (netScore === 2) rating = 4;
  else if (netScore === 1 || netScore === 0) rating = 3;
  else if (netScore === -1) rating = 2;
  else rating = 1;

  let verdict: SarvatobhadraResult["verdict"];
  let verdictMr: string; let verdictEn: string; let verdictHi: string;
  if (rating === 5) { verdict = "very auspicious"; verdictMr = "अत्यंत शुभ"; verdictEn = "Very Auspicious"; verdictHi = "अत्यंत शुभ"; }
  else if (rating === 4) { verdict = "auspicious"; verdictMr = "शुभ"; verdictEn = "Auspicious"; verdictHi = "शुभ"; }
  else if (rating === 3) { verdict = "mixed"; verdictMr = "मिश्र"; verdictEn = "Mixed"; verdictHi = "मिश्रित"; }
  else if (rating === 2) { verdict = "challenging"; verdictMr = "सावधगिरीचा"; verdictEn = "Challenging"; verdictHi = "चुनौतीपूर्ण"; }
  else { verdict = "avoid"; verdictMr = "टाळावे"; verdictEn = "Avoid Important Work"; verdictHi = "बचें"; }

  return {
    natalNakshatraIndex: natalIdx,
    natalNakshatraMr: natalNak.mr,
    natalNakshatraEn: natalNak.en,
    natalNakshatraHi: natalNak.mr,
    transits,
    grid,
    auspiciousCount, inauspiciousCount, neutralCount,
    rating, verdict, verdictMr, verdictEn, verdictHi,
    remediesMr: VEDHA_REMEDIES[rating as 1|2|3|4|5].mr,
    remediesEn: VEDHA_REMEDIES[rating as 1|2|3|4|5].en,
    remediesHi: VEDHA_REMEDIES[rating as 1|2|3|4|5].hi,
    summaryMr: `जन्म नक्षत्र ${natalNak.mr} — सध्याची स्थिती: ${verdictMr}. शुभ गोचर: ${auspiciousCount}, अशुभ: ${inauspiciousCount}, तटस्थ: ${neutralCount}.`,
    summaryEn: `Janma Nakshatra ${natalNak.en} — current transits: ${verdictEn}. Auspicious: ${auspiciousCount}, inauspicious: ${inauspiciousCount}, neutral: ${neutralCount}.`,
    summaryHi: `जन्म नक्षत्र ${natalNak.mr} — वर्तमान स्थिति: ${verdictHi}. शुभ गोचर: ${auspiciousCount}, अशुभ: ${inauspiciousCount}, तटस्थ: ${neutralCount}.`,
  };
}
