/**
 * Maharashtra-focused Dosha detectors — Mangal & Kalsarp.
 * Traditional Marathi jyotish rules (BPHS + local practice).
 */

import type { KundliResult, PlanetPosition } from "./calculator";

// ─── Mangal Dosh (कुजदोष / मंगळ दोष) ─────────────────────────

export type MangalSeverity = "none" | "mild" | "moderate" | "severe";

export interface MangalDoshResult {
  present: boolean;
  severity: MangalSeverity;
  severityMr: string;
  severityEn: string;
  severityHi: string;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  marsHouse: number;
  marsRashi: string;
  marsRashiMr: string;
  cancellations: string[];
  cancellationsMr: string[];
  cancellationsHi: string[];
  affectedAreasMr: string[];
  affectedAreasEn: string[];
  affectedAreasHi: string[];
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

const MANGAL_HOUSES = [1, 2, 4, 7, 8, 12];

function houseFrom(planetRashi: number, referenceRashi: number): number {
  return ((planetRashi - referenceRashi + 12) % 12) + 1;
}

export function detectMangalDosh(k: KundliResult): MangalDoshResult {
  const mars = k.planets.find((p) => p.id === "Mars");
  if (!mars) {
    return emptyMangalResult();
  }

  const venus = k.planets.find((p) => p.id === "Venus");
  const jupiter = k.planets.find((p) => p.id === "Jupiter");
  const saturn = k.planets.find((p) => p.id === "Saturn");

  const houseFromLagna = houseFrom(mars.rashiIndex, k.lagnaRashiIndex);
  const houseFromMoon = houseFrom(mars.rashiIndex, k.moonRashiIndex);
  const houseFromVenus = venus ? houseFrom(mars.rashiIndex, venus.rashiIndex) : 0;

  const fromLagna = MANGAL_HOUSES.includes(houseFromLagna);
  const fromMoon = MANGAL_HOUSES.includes(houseFromMoon);
  const fromVenus = venus ? MANGAL_HOUSES.includes(houseFromVenus) : false;

  const count = (fromLagna ? 1 : 0) + (fromMoon ? 1 : 0) + (fromVenus ? 1 : 0);

  // Cancellations (Parihara)
  const cancellationsMr: string[] = [];
  const cancellationsEn: string[] = [];
  const cancellationsHi: string[] = [];

  // Mars in own sign (Aries/Scorpio) or exalted (Capricorn)
  if (mars.rashiIndex === 0 || mars.rashiIndex === 7) {
    cancellationsEn.push("Mars in own sign — dosha cancelled");
    cancellationsMr.push("मंगळ स्वराशीत — दोष रद्द");
    cancellationsHi.push("मंगल स्वराशि में — दोष रद्द");
  }
  if (mars.rashiIndex === 9) {
    cancellationsEn.push("Mars exalted in Capricorn — dosha cancelled");
    cancellationsMr.push("मंगळ मकरेत उच्च — दोष रद्द");
    cancellationsHi.push("मंगल मकर में उच्च — दोष रद्द");
  }
  // Jupiter aspect on Mars (5/7/9 aspects)
  if (jupiter) {
    const diff = ((jupiter.rashiIndex - mars.rashiIndex) + 12) % 12;
    if ([4, 6, 8].includes(diff)) {
      cancellationsEn.push("Jupiter aspects Mars — malefic softened");
      cancellationsMr.push("गुरूची मंगळावर दृष्टी — प्रभाव कमी");
      cancellationsHi.push("गुरु की मंगल पर दृष्टि — प्रभाव कम");
    }
  }
  // Saturn aspect on Mars
  if (saturn) {
    const diff = ((saturn.rashiIndex - mars.rashiIndex) + 12) % 12;
    if ([2, 6, 9].includes(diff)) {
      cancellationsEn.push("Saturn aspects Mars — partial cancellation");
      cancellationsMr.push("शनीची मंगळावर दृष्टी — आंशिक रद्द");
      cancellationsHi.push("शनि की मंगल पर दृष्टि — आंशिक रद्द");
    }
  }
  // Mars in 4th or 12th only — considered light
  if (fromLagna && (houseFromLagna === 4 || houseFromLagna === 12) && !fromMoon && !fromVenus) {
    cancellationsEn.push("Mars in 4th/12th only — mild dosha");
    cancellationsMr.push("मंगळ फक्त ४थ्या/१२व्या स्थानी — सौम्य");
    cancellationsHi.push("मंगल केवल ४थे/१२वें भाव में — हल्का");
  }

  // Determine severity
  let severity: MangalSeverity;
  if (count === 0) severity = "none";
  else if (cancellationsEn.length >= 2 || count === 1) severity = "mild";
  else if (count === 2) severity = "moderate";
  else severity = "severe";

  const present = count > 0;

  // Affected areas
  const affectedMr: string[] = [];
  const affectedEn: string[] = [];
  const affectedHi: string[] = [];
  if (fromLagna) {
    if (houseFromLagna === 1) { affectedMr.push("व्यक्तिमत्त्व, आरोग्य"); affectedEn.push("Personality, health"); affectedHi.push("व्यक्तित्व, स्वास्थ्य"); }
    if (houseFromLagna === 2) { affectedMr.push("कुटुंब, संपत्ती, वाणी"); affectedEn.push("Family, wealth, speech"); affectedHi.push("परिवार, धन, वाणी"); }
    if (houseFromLagna === 4) { affectedMr.push("घर, आई, मानसिक शांती"); affectedEn.push("Home, mother, peace"); affectedHi.push("घर, माता, मानसिक शांति"); }
    if (houseFromLagna === 7) { affectedMr.push("विवाह, जोडीदार — सर्वात गंभीर"); affectedEn.push("Marriage, spouse — most serious"); affectedHi.push("विवाह, जीवनसाथी — अत्यंत गंभीर"); }
    if (houseFromLagna === 8) { affectedMr.push("जोडीदाराचे आयुष्य, गुप्त बाबी"); affectedEn.push("Spouse longevity, secrets"); affectedHi.push("जीवनसाथी की आयु, गुप्त बातें"); }
    if (houseFromLagna === 12) { affectedMr.push("शय्यासुख, परदेश"); affectedEn.push("Marital bed, foreign lands"); affectedHi.push("शय्यासुख, विदेश"); }
  }

  // Remedies — traditional Maharashtrian Mangal shanti upaya
  const remediesMr = [
    "हनुमान चालीसा रोज वाचा. मंगळवारी व शनिवारी हनुमान मंदिरात जाऊन ११ वेळा पठण करा. हनुमानाला शेंदूर, चमेलीचे तेल व लाल फुले अर्पण करा.",
    "मंगळनाथ मंदिर (उज्जैन) येथे मंगळ ग्रह शांती पूजा करा. हे मंगळाचे जन्मस्थान मानले जाते — येथील शांती सर्वात प्रभावी मानली आहे. वेळेअभावी स्थानिक नवग्रह मंदिरात मंगळाची पूजा करा.",
    "मंगळवारी लाल सिंदूर हनुमानाला अर्पण करा. लाल मसूर डाळ, गहू, गूळ व तांबे गरीब ब्राह्मण किंवा मंदिरात दान करा. जिवंत प्राण्यांना (विशेषतः लाल मुंग्या किंवा गाय) लाल रंगाचे अन्न द्या.",
    "'ॐ अंगारकाय नमः' किंवा मंगळ गायत्री — 'ॐ वीरध्वजाय विद्महे, विघ्नहस्ताय धीमही, तन्नो भौमः प्रचोदयात्' — या मंत्राचा १०८ वेळा जप दररोज मंगळवारी करा. ४० दिवस नियमित जप फलदायी.",
    "मंगळवारी उपवास करा. संध्याकाळी फक्त गूळ-चणे किंवा गोड खीर खा. मीठ, तेल, मांस व मसूर वर्ज्य. हे व्रत किमान ४० मंगळवार करा.",
    "अनुभवी ज्योतिषीच्या सल्ल्याने मूंगा (लाल पोवळा) रत्न धारण करा — ५ ते ११ कॅरेट, सोन्यात जडवून उजव्या हाताच्या अनामिकेत, मंगळवारी सूर्योदयाच्या वेळी. पूर्वी दूध-गंगाजलात शुद्ध करा.",
    "विवाहापूर्वी तीव्र मंगळ दोष असल्यास 'कुंभ विवाह' (मडक्याशी विवाह) किंवा 'अर्क विवाह' (रुईच्या झाडाशी विवाह) विधी करून मग प्रत्यक्ष विवाह करा. मंगळिकाशी विवाह केल्यास दोष रद्द.",
    "मंगळ कवच स्तोत्र व सुब्रह्मण्यम् भुजंगम् यांचा पाठ. कार्तिकेय (सुब्रह्मण्य/मुरुगन) ही मंगळाची पीठ देवता — कार्तिकेय मंदिरात दीप लावा.",
    "महाराष्ट्रात जेजुरी (खंडोबा) व मोरगाव (मयूरेश्वर) ही मंगळाशी संबंधित क्षेत्रे — तेथे नवस बोला व दर्शन घ्या. खंडोबाला भंडार-खोबरे अर्पण करा.",
    "तांब्याच्या भांड्यातून पाणी प्या. रविवार व मंगळवारी तांब्याच्या पात्रात जल भरून तुळशीत ओता. लाल कपडे मंगळवारी धारण करा.",
    "रक्तदान वर्षातून एकदा करा — मंगळ रक्ताचा कारक. आजारी व्यक्तींची सेवा, रक्तदान व गरीबांना जेवण देणे मंगळ दोष शांत करते.",
    "हनुमान मंदिरात १२ मंगळवार सलग जाऊन मोदक, पेढे किंवा बुंदीचे लाडू अर्पण करून प्रसाद वाटा. प्रत्येक मंगळवारी नवा मौली (लाल दोरा) हनुमानाला बांधून नंतर स्वतःच्या हाती बांधा.",
  ];
  const remediesEn = [
    "Recite Hanuman Chalisa daily. On Tuesdays and Saturdays, visit a Hanuman temple and chant it 11 times. Offer vermilion (sindoor), jasmine oil and red flowers to Hanuman.",
    "Perform Mangal Graha Shanti Pooja at Mangalnath Mandir, Ujjain — the traditional birthplace of Mars, considered the most potent remedy. If travel is not possible, perform the pooja at any Navagraha temple with Mars consecrated.",
    "Offer red sindoor to Hanuman every Tuesday. Donate red masoor dal (lentils), wheat, jaggery and copper to poor Brahmins or temples. Feed red-coloured grains to red ants or a cow.",
    "Chant 'Om Angarakaya Namah' or the Mangal Gayatri — 'Om Viradhwajaya Vidmahe, Vighnahastaya Dhimahi, Tanno Bhaumah Prachodayat' — 108 times every Tuesday. A 40-day continuous japa gives best results.",
    "Observe Tuesday fast (Mangalvar Vrata). Eat only jaggery-gram or sweet kheer in the evening. Avoid salt, oil, meat and lentils. Continue for at least 40 Tuesdays.",
    "Wear Red Coral (Moonga) after astrologer's consultation — 5 to 11 carats, set in gold, on the right ring finger, on Tuesday at sunrise. Purify in milk and Ganga water before wearing.",
    "If severe Manglik dosha, perform 'Kumbh Vivah' (marriage to a pot) or 'Ark Vivah' (marriage to an Arka tree) before the actual wedding. Alternatively, marry a fellow Manglik — the dosha cancels out.",
    "Recite Mangal Kavacha and Subrahmanya Bhujangam. Kartikeya (Subrahmanya/Murugan) is the presiding deity of Mars — light a ghee lamp at a Kartikeya temple on Tuesdays.",
    "In Maharashtra, visit Jejuri (Khandoba) and Morgaon (Mayureshwar) — both associated with Mars. Offer bhandar (turmeric) and coconut to Khandoba and fulfill a vow.",
    "Drink water from a copper vessel daily. On Sundays and Tuesdays, fill a copper pot with water overnight and pour it on a Tulsi plant. Wear red clothes on Tuesdays.",
    "Donate blood once a year — Mars rules blood. Serving the sick, donating blood, and feeding the poor are powerful Mangal shanti karmas.",
    "Visit a Hanuman temple for 12 consecutive Tuesdays with offerings of modak, pedha or boondi laddoos; distribute prasad. Tie a fresh red mouli (sacred thread) around Hanuman and then on your own wrist each week.",
  ];
  const remediesHi = [
    "हनुमान चालीसा नित्य पढ़ें. मंगलवार व शनिवार को हनुमान मंदिर में जाकर ११ बार पाठ करें. हनुमान जी को सिंदूर, चमेली का तेल व लाल पुष्प अर्पित करें.",
    "मंगलनाथ मंदिर (उज्जैन) में मंगल ग्रह शांति पूजा करें. यह मंगल का जन्म स्थान माना जाता है — सर्वाधिक प्रभावी शांति स्थल. समय न हो तो स्थानीय नवग्रह मंदिर में मंगल पूजा करें.",
    "मंगलवार को लाल सिंदूर हनुमान जी को अर्पित करें. लाल मसूर दाल, गेहूं, गुड़ व तांबे का दान गरीब ब्राह्मण या मंदिर में करें. लाल चींटियों या गाय को लाल अन्न खिलाएं.",
    "'ॐ अंगारकाय नमः' या मंगल गायत्री — 'ॐ वीरध्वजाय विद्महे, विघ्नहस्ताय धीमही, तन्नो भौमः प्रचोदयात्' — का १०८ बार जाप प्रति मंगलवार करें. ४० दिन निरंतर जाप फलदायी.",
    "मंगलवार का व्रत करें. संध्या को केवल गुड़-चना या मीठी खीर ग्रहण करें. नमक, तेल, मांस व मसूर वर्ज्य. कम से कम ४० मंगलवार यह व्रत करें.",
    "अनुभवी ज्योतिषी के परामर्श से मूंगा (रेड कोरल) धारण करें — ५ से ११ कैरेट, सोने में जड़वाकर दाहिने हाथ की अनामिका में, मंगलवार सूर्योदय के समय. दूध-गंगाजल में शुद्ध करके पहनें.",
    "विवाह पूर्व तीव्र मांगलिक दोष हो तो 'कुंभ विवाह' (घड़े से विवाह) या 'अर्क विवाह' (आक वृक्ष से विवाह) संस्कार करें. मांगलिक से विवाह करने पर दोष रद्द.",
    "मंगल कवच व सुब्रह्मण्यम् भुजंगम् का पाठ. कार्तिकेय (सुब्रह्मण्य/मुरुगन) मंगल की पीठ देवता — कार्तिकेय मंदिर में घी का दीप जलाएं.",
    "महाराष्ट्र में जेजुरी (खंडोबा) व मोरगाव (मयूरेश्वर) — दोनों मंगल से संबंधित. भंडार (हल्दी) व नारियल खंडोबा को अर्पण करें.",
    "तांबे के पात्र से जल पिएं. रविवार व मंगलवार को तांबे के लोटे में रातभर जल रखकर तुलसी पर डालें. मंगलवार को लाल वस्त्र धारण करें.",
    "वर्ष में एक बार रक्तदान करें — मंगल रक्त का कारक है. रोगी सेवा, रक्तदान व गरीबों को भोजन मंगल शांति का सर्वश्रेष्ठ उपाय है.",
    "१२ मंगलवार निरंतर हनुमान मंदिर जाकर मोदक, पेड़ा या बूंदी के लड्डू अर्पित करें व प्रसाद बांटें. प्रत्येक मंगलवार नया मौली (लाल धागा) हनुमान को बांधकर फिर अपने हाथ में बांधें.",
  ];

  // Summary
  let summaryEn = "No Mangal Dosh detected.";
  let summaryMr = "मंगळ दोष नाही.";
  let summaryHi = "मंगल दोष नहीं है.";
  if (present) {
    const sevLabel = severity === "severe" ? "severe" : severity === "moderate" ? "moderate" : "mild";
    const sevMr = severity === "severe" ? "तीव्र" : severity === "moderate" ? "मध्यम" : "सौम्य";
    const sevHi = severity === "severe" ? "गंभीर" : severity === "moderate" ? "मध्यम" : "हल्का";
    // Emit per-source pair: which reference + which house Mars sits in from that reference.
    // Fixes earlier bug where text always printed houseFromLagna regardless of trigger.
    type Src = { en: string; mr: string; hi: string; house: number };
    const srcs: Src[] = [];
    if (fromLagna) srcs.push({ en: "Lagna", mr: "लग्न", hi: "लग्न", house: houseFromLagna });
    if (fromMoon)  srcs.push({ en: "Moon",  mr: "चंद्र", hi: "चंद्र", house: houseFromMoon });
    if (fromVenus) srcs.push({ en: "Venus", mr: "शुक्र", hi: "शुक्र", house: houseFromVenus });
    const fmtMr = (s: Src) => s.house === 1
      ? (s.en === "Lagna" ? "लग्नात" : `${s.mr}ाशी युती`)
      : `${s.mr}ापासून ${s.house}व्या स्थानी`;
    const fmtEn = (s: Src) => s.house === 1
      ? (s.en === "Lagna" ? "in Lagna" : `conjunct ${s.en}`)
      : `${s.house}th from ${s.en}`;
    const fmtHi = (s: Src) => s.house === 1
      ? (s.en === "Lagna" ? "लग्न में" : `${s.hi} से युति`)
      : `${s.hi} से ${s.house}वें भाव में`;
    summaryEn = `Mangal Dosh present — ${sevLabel} (Mars ${srcs.map(fmtEn).join(", ")}).`;
    summaryMr = `मंगळ दोष आहे — ${sevMr} (मंगळ ${srcs.map(fmtMr).join(", ")}).`;
    summaryHi = `मंगल दोष है — ${sevHi} (मंगल ${srcs.map(fmtHi).join(", ")}).`;
  }

  return {
    present,
    severity,
    severityMr: severity === "severe" ? "तीव्र" : severity === "moderate" ? "मध्यम" : severity === "mild" ? "सौम्य" : "नाही",
    severityEn: severity,
    severityHi: severity === "severe" ? "गंभीर" : severity === "moderate" ? "मध्यम" : severity === "mild" ? "हल्का" : "नहीं",
    fromLagna,
    fromMoon,
    fromVenus,
    marsHouse: houseFromLagna,
    marsRashi: mars.rashi,
    marsRashiMr: mars.rashiMr,
    cancellations: cancellationsEn,
    cancellationsMr,
    cancellationsHi,
    affectedAreasMr: affectedMr,
    affectedAreasEn: affectedEn,
    affectedAreasHi: affectedHi,
    remediesMr,
    remediesEn,
    remediesHi,
    summaryMr,
    summaryEn,
    summaryHi,
  };
}

function emptyMangalResult(): MangalDoshResult {
  return {
    present: false, severity: "none",
    severityMr: "नाही", severityEn: "none", severityHi: "नहीं",
    fromLagna: false, fromMoon: false, fromVenus: false,
    marsHouse: 0, marsRashi: "", marsRashiMr: "",
    cancellations: [], cancellationsMr: [], cancellationsHi: [],
    affectedAreasMr: [], affectedAreasEn: [], affectedAreasHi: [],
    remediesMr: [], remediesEn: [], remediesHi: [],
    summaryMr: "गणना करता आली नाही.",
    summaryEn: "Could not compute.",
    summaryHi: "गणना नहीं हो सकी.",
  };
}

// ─── Kalsarp Dosh (काळसर्प दोष) ──────────────────────────────

export type KalsarpType =
  | "anant" | "kulik" | "vasuki" | "shankapal" | "padma" | "mahapadma"
  | "takshak" | "karkotak" | "shankachud" | "ghatak" | "vishadhar" | "sheshnag";

export interface KalsarpDoshResult {
  present: boolean;
  partial: boolean; // one planet outside Rahu-Ketu axis
  type: KalsarpType | null;
  typeMr: string;
  typeEn: string;
  typeHi: string;
  rahuHouse: number;
  ketuHouse: number;
  udit: boolean; // Udit (progressive) = planets Rahu→Ketu in zodiac direction
  planetsOutside: string[]; // ids of planets outside the axis (if partial)
  effectsMr: string;
  effectsEn: string;
  effectsHi: string;
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
  yatraRecommendationMr: string;
  yatraRecommendationEn: string;
  yatraRecommendationHi: string;
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

const KALSARP_TYPES: Array<{
  id: KalsarpType;
  nameEn: string;
  nameMr: string;
  nameHi: string;
  effectEn: string;
  effectMr: string;
  effectHi: string;
}> = [
  { id: "anant", nameEn: "Anant", nameMr: "अनंत", nameHi: "अनंत",
    effectEn: "Mental stress, legal troubles, marital discord",
    effectMr: "मानसिक ताण, कायदेशीर अडचणी, वैवाहिक मतभेद",
    effectHi: "मानसिक तनाव, कानूनी परेशानी, वैवाहिक विवाद" },
  { id: "kulik", nameEn: "Kulik", nameMr: "कुलिक", nameHi: "कुलिक",
    effectEn: "Financial setbacks, family conflicts, accidents",
    effectMr: "आर्थिक नुकसान, कुटुंब कलह, अपघात",
    effectHi: "आर्थिक नुकसान, पारिवारिक विवाद, दुर्घटना" },
  { id: "vasuki", nameEn: "Vasuki", nameMr: "वासुकी", nameHi: "वासुकी",
    effectEn: "Sibling disputes, short journeys problems, courage issues",
    effectMr: "भावंडांशी वाद, छोट्या प्रवासात अडचण, धैर्यहीनता",
    effectHi: "भाई-बहनों से विवाद, छोटी यात्राओं में समस्या" },
  { id: "shankapal", nameEn: "Shankapal", nameMr: "शंखपाल", nameHi: "शंखपाल",
    effectEn: "Property disputes, mother's health, mental unrest",
    effectMr: "जमीन-मालमत्ता वाद, आईचे आरोग्य, मानसिक अस्वस्थता",
    effectHi: "संपत्ति विवाद, माता का स्वास्थ्य, मानसिक अशांति" },
  { id: "padma", nameEn: "Padma", nameMr: "पद्म", nameHi: "पद्म",
    effectEn: "Child-related problems, education obstacles, creativity blocked",
    effectMr: "संतती विषयक अडचण, शिक्षणात अडथळे",
    effectHi: "संतान समस्या, शिक्षा में बाधा" },
  { id: "mahapadma", nameEn: "Mahapadma", nameMr: "महापद्म", nameHi: "महापद्म",
    effectEn: "Chronic diseases, enemies, debts",
    effectMr: "दीर्घकालीन आजार, शत्रू, कर्ज",
    effectHi: "पुराने रोग, शत्रु, ऋण" },
  { id: "takshak", nameEn: "Takshak", nameMr: "तक्षक", nameHi: "तक्षक",
    effectEn: "Marriage problems, partnership issues — most severe",
    effectMr: "विवाह अडचणी, भागीदारी समस्या — सर्वाधिक गंभीर",
    effectHi: "विवाह समस्याएं, साझेदारी विवाद — सबसे गंभीर" },
  { id: "karkotak", nameEn: "Karkotak", nameMr: "कर्कोटक", nameHi: "कर्कोटक",
    effectEn: "Accidents, surgeries, spouse longevity concerns",
    effectMr: "अपघात, शस्त्रक्रिया, जोडीदार आयुष्य",
    effectHi: "दुर्घटना, शल्यक्रिया, जीवनसाथी की आयु" },
  { id: "shankachud", nameEn: "Shankachud", nameMr: "शंखचूड", nameHi: "शंखचूड",
    effectEn: "Spiritual struggles, father's health, luck delays",
    effectMr: "आध्यात्मिक संघर्ष, वडिलांचे आरोग्य, भाग्योदयास विलंब",
    effectHi: "आध्यात्मिक संघर्ष, पिता का स्वास्थ्य, भाग्य में देरी" },
  { id: "ghatak", nameEn: "Ghatak", nameMr: "घातक", nameHi: "घातक",
    effectEn: "Career obstacles, reputation harm, authority conflicts",
    effectMr: "करिअर अडथळे, प्रतिष्ठेला धक्का, अधिकार्‍यांशी संघर्ष",
    effectHi: "करियर में बाधा, प्रतिष्ठा को आघात" },
  { id: "vishadhar", nameEn: "Vishadhar", nameMr: "विषधर", nameHi: "विषधर",
    effectEn: "Income blocked, unfulfilled desires, elder sibling issues",
    effectMr: "उत्पन्नात अडथळा, अपूर्ण इच्छा, मोठ्या भावंडांशी वाद",
    effectHi: "आय में रुकावट, अपूर्ण इच्छाएं" },
  { id: "sheshnag", nameEn: "Sheshnag", nameMr: "शेषनाग", nameHi: "शेषनाग",
    effectEn: "Expenses, foreign travel hassles, secret enemies",
    effectMr: "खर्च, परदेश प्रवासात अडचण, गुप्त शत्रू",
    effectHi: "खर्च, विदेश यात्रा में समस्याएं, गुप्त शत्रु" },
];

export function detectKalsarpDosh(k: KundliResult): KalsarpDoshResult {
  const rahu = k.planets.find((p) => p.id === "Rahu");
  const ketu = k.planets.find((p) => p.id === "Ketu");

  if (!rahu || !ketu) return emptyKalsarpResult();

  const rahuHouse = houseFrom(rahu.rashiIndex, k.lagnaRashiIndex);
  const ketuHouse = houseFrom(ketu.rashiIndex, k.lagnaRashiIndex);

  // Check all 7 visible planets lie between Rahu and Ketu on one side
  const visiblePlanets = k.planets.filter((p) =>
    ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(p.id)
  );

  // Normalize longitudes relative to Rahu's sidereal longitude
  const rahuLong = rahu.siderealLongitude;
  const ketuLong = ketu.siderealLongitude;

  function angleFromRahu(long: number): number {
    return ((long - rahuLong) + 360) % 360;
  }

  // Rahu→Ketu forward arc = 180°. If planet's angle from Rahu is 0–180° → on "Udit" side
  const uditSide: PlanetPosition[] = [];
  const anuditSide: PlanetPosition[] = [];
  for (const p of visiblePlanets) {
    const ang = angleFromRahu(p.siderealLongitude);
    if (ang > 0 && ang < 180) uditSide.push(p);
    else if (ang > 180 && ang < 360) anuditSide.push(p);
    // exactly on axis — skip (conjunct Rahu/Ketu treated as on the side)
  }

  const allOnUdit = anuditSide.length === 0 && uditSide.length === 7;
  const allOnAnudit = uditSide.length === 0 && anuditSide.length === 7;
  const present = allOnUdit || allOnAnudit;
  const partial = !present && (uditSide.length === 6 || anuditSide.length === 6);

  let udit = allOnUdit;
  let planetsOutside: string[] = [];
  if (partial) {
    if (uditSide.length === 6) {
      udit = true;
      planetsOutside = anuditSide.map((p) => p.id);
    } else {
      udit = false;
      planetsOutside = uditSide.map((p) => p.id);
    }
  }

  if (!present && !partial) {
    return {
      present: false, partial: false, type: null,
      typeMr: "नाही", typeEn: "none", typeHi: "नहीं",
      rahuHouse, ketuHouse, udit: false, planetsOutside: [],
      effectsEn: "", effectsMr: "", effectsHi: "",
      remediesEn: [], remediesMr: [], remediesHi: [],
      yatraRecommendationEn: "", yatraRecommendationMr: "", yatraRecommendationHi: "",
      summaryEn: "No Kalsarp Dosh detected.",
      summaryMr: "काळसर्प दोष नाही.",
      summaryHi: "कालसर्प दोष नहीं है.",
    };
  }

  const typeInfo = KALSARP_TYPES[rahuHouse - 1];

  // Remedies — detailed traditional Kalsarp shanti upaya
  const remediesMr = [
    "त्र्यंबकेश्वर (नाशिक) येथे काळसर्प शांती पूजा हे सर्वात प्रमाणभूत उपाय. कुशावर्त कुंडात स्नान करून पंडितांकडून नारायण-नागबली + त्रिपिंडी श्राद्ध + काळसर्प शांती विधी करा — ३ दिवसांचे विधान. पूजेपूर्वी २४ तास उपवास.",
    "नागपंचमी (श्रावण शुद्ध पंचमी) दिवशी घरी नागदेवतेची पूजा करा. कच्चे दूध, तांदळाची लाही, हळद-कुंकू व तांबुलाचा नैवेद्य अर्पण करा. नाग देवतेच्या बिळात दूध ओता. नागस्तोत्र व मनसा देवी स्तुती पठण करा.",
    "प्रतिदिन महामृत्युंजय मंत्र — 'ॐ त्र्यंबकं यजामहे सुगंधिं पुष्टिवर्धनम्, उर्वारुकमिव बंधनान् मृत्योर्मुक्षीय मामृतात्' — १०८ वेळा जप करा. रुद्राक्षमाळेवर ४० दिवस निरंतर जप.",
    "शिव मंदिरात रुद्राभिषेक करा — पंचामृत (दूध, दही, तूप, मध, साखर), गंगाजल, कच्चे दूध, बेलपत्र व धोतरा अर्पण. विशेषतः सोमवारी, प्रदोष व श्रावण महिन्यात.",
    "चांदीचा नाग-नागिण जोडीदार बनवून गंगा, गोदावरी किंवा पवित्र वाहत्या नदीत विसर्जित करा. विसर्जनाआधी शिव मंदिरात २१ दिवस पूजा करून मग प्रवाहात सोडा.",
    "सोमवार, प्रदोष व महाशिवरात्री यांचे उपवास करा. सोमवारी फक्त दूध-फळ आहार. शिवलिंगावर बेलपत्र अर्पण करा व 'ॐ नमः शिवाय' चा जप करा.",
    "महाराष्ट्रातील १२ ज्योतिर्लिंगांपैकी त्र्यंबकेश्वर, भीमाशंकर, घृष्णेश्वर, औंढा नागनाथ, परळी वैजनाथ ही ५ लिंगे. यांच्यापैकी किमान एका लिंगाची यात्रा करा. त्र्यंबकेश्वर हे काळसर्पासाठी सर्वश्रेष्ठ.",
    "८ मुखी रुद्राक्ष धारण करा — हा राहू ग्रहाचा विशेष रुद्राक्ष. ९ मुखी रुद्राक्ष केतूसाठी. सोमवारी सकाळी अभिमंत्रित करून गळ्यात किंवा दंडात धारण.",
    "सर्पसूक्त (ऋग्वेदातील), गारुड मंत्र व मनसा चालीसा यांचे नियमित पठण. राहू मंत्र 'ॐ रां राहवे नमः' १८००० वेळा अनुष्ठानात जप — ४० दिवसांत.",
    "गरीबांना काळे तीळ, काळी उडीद डाळ, उडीदाची खिचडी व लोखंडी वस्तू शनिवार व अमावस्येला दान करा. मजूर व कामगारांना जेवण द्या.",
    "गायी व विशेषतः काळ्या गायीची सेवा, गो-ग्रास व वृद्धाश्रमात दान राहू दोष शांत करते. दर अमावस्येला पितृतर्पण व पिंडदान करा.",
    "जुने व फाटलेले कपडे घरातून काढून टाका. काचेच्या वस्तू, दर्पण, विषारी औषधे घरात ठेवू नका. दररोज संध्याकाळी तुळशीजवळ तुपाचा दीप लावा.",
    "कुत्र्यांना (विशेषतः काळ्या) रोज अन्न द्या — राहू कुत्र्यांचा कारक. चित्रगुप्ताला व भैरवाला नैवेद्य अर्पण. भैरव मंदिरात शनिवारी तेल दीप लावा.",
    "केतू शांतीसाठी गणपती पूजा — गणेश अथर्वशीर्ष २१ वेळा, सहस्त्रनाम, व मोदक नैवेद्य अर्पण. अष्टविनायक यात्रा विशेष फलदायी.",
  ];
  const remediesEn = [
    "Kalsarpa Shanti Pooja at Trimbakeshwar (Nashik) is the most authoritative remedy. Bathe at Kushavarta Kund; engage temple pandits for Narayan-Nagbali + Tripindi Shraddha + Kalsarp Shanti — a 3-day vidhi. Observe a 24-hour fast before the ritual.",
    "On Nag Panchami (Shravan Shukla Panchami), worship Naga devta at home. Offer raw milk, puffed rice, turmeric-kumkum and betel leaves. Pour milk at a snake hole. Recite Naga Stotra and Manasa Devi Stuti.",
    "Chant the Mahamrityunjaya mantra — 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityormukshiya Mamritat' — 108 times daily on a rudraksha mala. Continue for 40 days unbroken.",
    "Perform Rudrabhishek at a Shiva temple — offer Panchamrit (milk, curd, ghee, honey, sugar), Ganga jal, raw milk, bilva leaves and dhatura. Especially on Mondays, Pradosh, and in the month of Shravan.",
    "Have a pair of silver naga-nagin made and immerse them in the Ganga, Godavari or any sacred flowing river. Before immersion, worship them at a Shiva temple for 21 days.",
    "Observe fasts on Monday, Pradosh and Mahashivaratri. Consume only milk and fruits on Mondays. Offer bilva leaves on the Shiva Lingam and chant 'Om Namah Shivaya'.",
    "Of the 12 Jyotirlingas, 5 lie in Maharashtra: Trimbakeshwar, Bhimashankar, Grishneshwar, Aundha Nagnath, and Parli Vaijnath. Visit at least one; Trimbakeshwar is supreme for Kalsarpa.",
    "Wear an 8-mukhi Rudraksha — the special bead for Rahu (9-mukhi for Ketu). On a Monday morning, energise it with mantras and wear around the neck or upper arm.",
    "Regularly recite the Sarpa Sukta (Rig Veda), Garuda mantra and Manasa Chalisa. Perform an anushthana of the Rahu mantra 'Om Ram Rahave Namah' — 18,000 chants over 40 days.",
    "Donate black sesame, black urad dal, khichadi and iron items to the poor on Saturdays and Amavasya. Feed labourers and manual workers.",
    "Serve cows, especially black ones — offer go-grass and donate at old-age homes; this pacifies Rahu. Perform pitru-tarpana and pinda-daan every Amavasya.",
    "Remove torn clothes, broken glass, old mirrors and poisonous medicines from the home. Light a ghee lamp by a Tulsi plant every evening.",
    "Feed dogs (especially black ones) daily — Rahu rules the dog. Offer naivedya to Chitragupta and Bhairava. Light an oil lamp at a Bhairava temple on Saturdays.",
    "For Ketu shanti, worship Lord Ganesha — recite Ganesh Atharvashirsha 21 times, the Sahasranama, and offer modak. The Ashtavinayak yatra is especially fruitful.",
  ];
  const remediesHi = [
    "त्र्यंबकेश्वर (नाशिक) में कालसर्प शांति पूजा सर्वोच्च प्रामाणिक उपाय है. कुशावर्त कुंड में स्नान करके पंडितों से नारायण-नागबली + त्रिपिंडी श्राद्ध + कालसर्प शांति विधि कराएं — ३ दिन का विधान. पूजा से पहले २४ घंटे उपवास.",
    "नाग पंचमी (श्रावण शुक्ल पंचमी) पर घर में नाग देवता की पूजा करें. कच्चा दूध, लावा, हल्दी-कुंकुम व पान-सुपारी अर्पित करें. नाग के बिल में दूध डालें. नाग स्तोत्र व मनसा देवी स्तुति पढ़ें.",
    "प्रतिदिन महामृत्युंजय मंत्र — 'ॐ त्र्यंबकं यजामहे सुगंधिं पुष्टिवर्धनम्, उर्वारुकमिव बंधनान् मृत्योर्मुक्षीय मामृतात्' — रुद्राक्ष माला पर १०८ बार जाप करें. ४० दिन निरंतर जाप.",
    "शिव मंदिर में रुद्राभिषेक कराएं — पंचामृत (दूध, दही, घी, शहद, शक्कर), गंगाजल, कच्चा दूध, बेल पत्र व धतूरा अर्पित करें. विशेषतः सोमवार, प्रदोष व श्रावण माह में.",
    "चांदी के नाग-नागिन जोड़ा बनवाकर गंगा, गोदावरी या पवित्र बहती नदी में विसर्जित करें. विसर्जन से पूर्व शिव मंदिर में २१ दिन पूजन करके फिर प्रवाह में छोड़ें.",
    "सोमवार, प्रदोष व महाशिवरात्रि के व्रत करें. सोमवार को केवल दूध-फल आहार. शिवलिंग पर बेलपत्र चढ़ाएं व 'ॐ नमः शिवाय' का जाप करें.",
    "महाराष्ट्र के १२ ज्योतिर्लिंगों में से त्र्यंबकेश्वर, भीमाशंकर, घृष्णेश्वर, औंढा नागनाथ, परली वैजनाथ — ५ लिंग हैं. इनमें से कम से कम एक की यात्रा करें. त्र्यंबकेश्वर कालसर्प के लिए सर्वश्रेष्ठ.",
    "८ मुखी रुद्राक्ष धारण करें — राहु का विशेष रुद्राक्ष. ९ मुखी केतु के लिए. सोमवार को प्रातः अभिमंत्रित करके गले या बाहु में धारण करें.",
    "सर्प सूक्त (ऋग्वेद), गारुड़ मंत्र व मनसा चालीसा का नियमित पाठ करें. राहु मंत्र 'ॐ रां राहवे नमः' का १८००० बार अनुष्ठान — ४० दिनों में.",
    "गरीबों को काले तिल, काली उड़द दाल, खिचड़ी व लोहे की वस्तुएं शनिवार व अमावस्या को दान करें. मजदूरों व श्रमिकों को भोजन कराएं.",
    "गाय व विशेषकर काली गाय की सेवा, गो-ग्रास व वृद्धाश्रम में दान राहु दोष को शांत करता है. प्रत्येक अमावस्या पर पितृ तर्पण व पिंडदान करें.",
    "पुराने व फटे कपड़े घर से निकालें. कांच की वस्तुएं, दर्पण, विषैली औषधियां न रखें. प्रतिदिन संध्या को तुलसी के समीप घी का दीप जलाएं.",
    "कुत्तों को (विशेषतः काले) रोज अन्न खिलाएं — राहु कुत्तों का कारक है. चित्रगुप्त व भैरव को नैवेद्य अर्पण. भैरव मंदिर में शनिवार को तेल का दीप जलाएं.",
    "केतु शांति के लिए गणपति पूजा — गणेश अथर्वशीर्ष २१ बार, सहस्त्रनाम, व मोदक का नैवेद्य अर्पण. अष्टविनायक यात्रा विशेष फलदायी.",
  ];

  return {
    present: present || partial,
    partial,
    type: typeInfo.id,
    typeMr: typeInfo.nameMr,
    typeEn: typeInfo.nameEn,
    typeHi: typeInfo.nameHi,
    rahuHouse, ketuHouse, udit, planetsOutside,
    effectsEn: typeInfo.effectEn,
    effectsMr: typeInfo.effectMr,
    effectsHi: typeInfo.effectHi,
    remediesMr, remediesEn, remediesHi,
    yatraRecommendationMr: "त्र्यंबकेश्वर ज्योतिर्लिंग (नाशिक) — काळसर्प शांतीचे सर्वश्रेष्ठ क्षेत्र. तिथे कालसर्प पूजा केल्याने दोष पूर्णपणे निवारण होतो.",
    yatraRecommendationEn: "Trimbakeshwar Jyotirlinga (Nashik) is the foremost destination for Kalsarp Shanti. Performing the ritual there offers complete remedy.",
    yatraRecommendationHi: "त्र्यंबकेश्वर ज्योतिर्लिंग (नाशिक) कालसर्प शांति के लिए सर्वोत्तम स्थान है। वहां पूजा करने से दोष का पूर्ण निवारण होता है।",
    summaryMr: `${partial ? "आंशिक" : "पूर्ण"} ${typeInfo.nameMr} काळसर्प दोष — राहू ${rahuHouse}व्या स्थानी, केतू ${ketuHouse}व्या.`,
    summaryEn: `${partial ? "Partial" : "Full"} ${typeInfo.nameEn} Kalsarp Dosh — Rahu in house ${rahuHouse}, Ketu in house ${ketuHouse}.`,
    summaryHi: `${partial ? "आंशिक" : "पूर्ण"} ${typeInfo.nameHi} कालसर्प दोष — राहु ${rahuHouse}वें भाव में, केतु ${ketuHouse}वें भाव में.`,
  };
}

function emptyKalsarpResult(): KalsarpDoshResult {
  return {
    present: false, partial: false, type: null,
    typeMr: "—", typeEn: "none", typeHi: "—",
    rahuHouse: 0, ketuHouse: 0, udit: false, planetsOutside: [],
    effectsEn: "", effectsMr: "", effectsHi: "",
    remediesEn: [], remediesMr: [], remediesHi: [],
    yatraRecommendationEn: "", yatraRecommendationMr: "", yatraRecommendationHi: "",
    summaryEn: "Could not compute.",
    summaryMr: "गणना करता आली नाही.",
    summaryHi: "गणना नहीं हो सकी.",
  };
}
