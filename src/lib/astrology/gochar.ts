/**
 * Gochar (Transit) Engine for Rashifal
 * Calculates real planetary transits and generates predictions based on Vedic rules
 */

export interface TransitPlanet {
  id: string;
  rashiIndex: number; // 0-11
}

export interface GocharResult {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  overall: { mr: string; en: string };
  career: { mr: string; en: string };
  love: { mr: string; en: string };
  health: { mr: string; en: string };
  advice: { mr: string; en: string };
  rating: number; // 1-5
  transits: { planet: string; planetMr: string; house: number; effect: "good" | "bad" | "neutral" }[];
  luckyColor: { mr: string; en: string };
  luckyNumber: number;
}

const RASHI_NAMES = [
  { mr: "मेष", en: "Aries" }, { mr: "वृषभ", en: "Taurus" }, { mr: "मिथुन", en: "Gemini" },
  { mr: "कर्क", en: "Cancer" }, { mr: "सिंह", en: "Leo" }, { mr: "कन्या", en: "Virgo" },
  { mr: "तुला", en: "Libra" }, { mr: "वृश्चिक", en: "Scorpio" }, { mr: "धनु", en: "Sagittarius" },
  { mr: "मकर", en: "Capricorn" }, { mr: "कुंभ", en: "Aquarius" }, { mr: "मीन", en: "Pisces" },
];

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

// ─── Vedic Gochar Rules: which houses are favorable for each planet ───
// Source: Brihat Parashara Hora Shastra, Phaladeepika
const GOOD_HOUSES: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 10, 11],
  Ketu: [3, 6, 11],
};

// ─── Transit effects per planet per house (bilingual) ───

interface HouseEffect {
  mr: string;
  en: string;
  area: "career" | "love" | "health" | "general";
}

const TRANSIT_EFFECTS: Record<string, Record<number, HouseEffect>> = {
  Jupiter: {
    1: { mr: "गुरु लग्नात — शरीर जड होणे, आळशीपणा, पण ज्ञान वाढेल", en: "Jupiter in 1st — weight gain tendency, but wisdom increases", area: "health" },
    2: { mr: "गुरु धनभावात — आर्थिक लाभ, कुटुंबात सुख, वाणी मधुर", en: "Jupiter in 2nd — financial gains, family happiness, sweet speech", area: "career" },
    3: { mr: "गुरु तृतीयात — भावंडांशी मतभेद, प्रयत्नांना विलंब", en: "Jupiter in 3rd — sibling friction, delays in efforts", area: "general" },
    4: { mr: "गुरु चतुर्थात — मानसिक अशांती, स्थलांतर शक्य", en: "Jupiter in 4th — mental unrest, possible relocation", area: "love" },
    5: { mr: "गुरु पंचमात — बुद्धी तीक्ष्ण, शिक्षणात यश, संतती सुख, प्रेमात यश", en: "Jupiter in 5th — sharp intellect, academic success, child happiness, romance success", area: "love" },
    6: { mr: "गुरु षष्ठात — शत्रू त्रास, कर्ज वाढ, आरोग्य काळजी", en: "Jupiter in 6th — enemy troubles, debt increase, health needs care", area: "health" },
    7: { mr: "गुरु सप्तमात — वैवाहिक सुख, भागीदारी लाभदायक, सामाजिक मान", en: "Jupiter in 7th — marital bliss, profitable partnerships, social respect", area: "love" },
    8: { mr: "गुरु अष्टमात — अनपेक्षित संकटे, आरोग्य बिघाड, मानसिक तणाव", en: "Jupiter in 8th — unexpected crises, health issues, mental stress", area: "health" },
    9: { mr: "गुरु भाग्यभावात — अत्यंत शुभ, भाग्योदय, धार्मिक प्रवृत्ती, पित्याचा आशीर्वाद", en: "Jupiter in 9th — extremely auspicious, fortune rises, spiritual growth, father's blessings", area: "general" },
    10: { mr: "गुरु कर्मभावात — करिअरमध्ये अडथळे, कीर्तीला बाधा", en: "Jupiter in 10th — career obstacles, reputation challenges", area: "career" },
    11: { mr: "गुरु लाभभावात — सर्वोत्तम स्थान, लाभ, इच्छापूर्ती, मित्रांचा सहकार", en: "Jupiter in 11th — best position, gains, wish fulfillment, friends' support", area: "career" },
    12: { mr: "गुरु व्ययभावात — खर्च वाढ, परदेश प्रवास, आध्यात्मिक रस", en: "Jupiter in 12th — expenses increase, foreign travel, spiritual interest", area: "general" },
  },
  Saturn: {
    1: { mr: "शनि लग्नात — शारीरिक थकवा, आळशीपणा, आरोग्य सांभाळा (साडेसाती प्रभाव)", en: "Saturn in 1st — physical fatigue, laziness, take care of health (Sade Sati effect)", area: "health" },
    2: { mr: "शनि धनभावात — आर्थिक अडचणी, कुटुंबात तणाव, वाणीवर नियंत्रण ठेवा", en: "Saturn in 2nd — financial difficulties, family tension, control your speech", area: "career" },
    3: { mr: "शनि तृतीयात — शुभ, धाडस वाढेल, शत्रूंवर विजय, प्रगती", en: "Saturn in 3rd — auspicious, courage increases, victory over enemies, progress", area: "career" },
    4: { mr: "शनि चतुर्थात — घरगुती अशांती, मातेचे आरोग्य, मालमत्ता समस्या", en: "Saturn in 4th — domestic unrest, mother's health, property issues", area: "love" },
    5: { mr: "शनि पंचमात — शिक्षणात अडथळे, संतती चिंता, मानसिक तणाव", en: "Saturn in 5th — education obstacles, child concerns, mental stress", area: "love" },
    6: { mr: "शनि षष्ठात — शुभ, शत्रूनाश, आरोग्य सुधारेल, कर्जमुक्ती", en: "Saturn in 6th — auspicious, enemies destroyed, health improves, debt freedom", area: "health" },
    7: { mr: "शनि सप्तमात — वैवाहिक तणाव, भागीदारीत समस्या, प्रवास", en: "Saturn in 7th — marital stress, partnership issues, travel", area: "love" },
    8: { mr: "शनि अष्टमात — अत्यंत कठीण, आरोग्य बिघाड, अपघात सावध, मानसिक त्रास", en: "Saturn in 8th — very difficult, health deterioration, accident caution, mental agony", area: "health" },
    9: { mr: "शनि भाग्यभावात — भाग्यात अडथळे, पित्याशी मतभेद, धार्मिक श्रद्धा कमी", en: "Saturn in 9th — fortune obstacles, father disagreements, reduced faith", area: "general" },
    10: { mr: "शनि कर्मभावात — करिअरमध्ये बदल, कठोर परिश्रम, विलंबाने फळ", en: "Saturn in 10th — career changes, hard work required, delayed results", area: "career" },
    11: { mr: "शनि लाभभावात — शुभ, आर्थिक लाभ, इच्छापूर्ती, सामाजिक मान", en: "Saturn in 11th — auspicious, financial gains, wish fulfillment, social respect", area: "career" },
    12: { mr: "शनि व्ययभावात — खर्च वाढ, झोप कमी, परदेशात अडचणी", en: "Saturn in 12th — expenses increase, sleep issues, foreign difficulties", area: "general" },
  },
  Mars: {
    1: { mr: "मंगळ लग्नात — ऊर्जा वाढेल पण राग नियंत्रणात ठेवा, अपघात सावध", en: "Mars in 1st — energy rises but control anger, accident caution", area: "health" },
    2: { mr: "मंगळ धनभावात — आर्थिक खर्च, कुटुंबात वाद, कठोर बोलणे टाळा", en: "Mars in 2nd — financial expenses, family arguments, avoid harsh speech", area: "love" },
    3: { mr: "मंगळ तृतीयात — शुभ, धाडस, भावंडांचा सहकार, प्रवासात लाभ", en: "Mars in 3rd — auspicious, courage, sibling support, travel gains", area: "career" },
    4: { mr: "मंगळ चतुर्थात — घरगुती अशांती, वाहन सावध, मातेशी मतभेद", en: "Mars in 4th — domestic unrest, vehicle caution, mother disagreements", area: "love" },
    5: { mr: "मंगळ पंचमात — मुलांची काळजी, गुंतवणूक सावध, प्रेमात वाद", en: "Mars in 5th — child concerns, investment caution, romantic arguments", area: "love" },
    6: { mr: "मंगळ षष्ठात — शुभ, शत्रूनाश, स्पर्धेत विजय, आरोग्य सुधारेल", en: "Mars in 6th — auspicious, enemies defeated, competition victory, health improves", area: "career" },
    7: { mr: "मंगळ सप्तमात — जोडीदाराशी वाद, भागीदारीत तणाव", en: "Mars in 7th — spouse arguments, partnership tension", area: "love" },
    8: { mr: "मंगळ अष्टमात — अपघात/शस्त्रक्रिया सावध, आकस्मिक त्रास", en: "Mars in 8th — accident/surgery caution, sudden troubles", area: "health" },
    9: { mr: "मंगळ नवमात — पित्याशी मतभेद, धार्मिक कार्यात अडथळे", en: "Mars in 9th — father disagreements, religious activity obstacles", area: "general" },
    10: { mr: "मंगळ दशमात — करिअरमध्ये उत्साह, नेतृत्व, पण वरिष्ठांशी वाद", en: "Mars in 10th — career enthusiasm, leadership, but conflicts with superiors", area: "career" },
    11: { mr: "मंगळ लाभभावात — शुभ, आर्थिक लाभ, इच्छापूर्ती", en: "Mars in 11th — auspicious, financial gains, wish fulfillment", area: "career" },
    12: { mr: "मंगळ व्ययभावात — खर्च वाढ, झोप कमी, डोळ्यांची काळजी", en: "Mars in 12th — expenses increase, sleep issues, eye care needed", area: "health" },
  },
  Moon: {
    1: { mr: "चंद्र लग्नात — मन प्रसन्न, आत्मविश्वास, चांगला दिवस", en: "Moon in 1st — cheerful mind, confidence, good day", area: "general" },
    2: { mr: "चंद्र धनभावात — आर्थिक अडचणी, कुटुंबात तणाव", en: "Moon in 2nd — financial difficulties, family tension", area: "career" },
    3: { mr: "चंद्र तृतीयात — शुभ, यश, मित्रांचा सहकार", en: "Moon in 3rd — auspicious, success, friends' support", area: "career" },
    4: { mr: "चंद्र चतुर्थात — मानसिक अशांती, भावनिक अस्थिरता", en: "Moon in 4th — mental unrest, emotional instability", area: "health" },
    5: { mr: "चंद्र पंचमात — बुद्धी तीक्ष्ण, प्रेमात आनंद, मुलांचे सुख", en: "Moon in 5th — sharp intellect, joy in romance, child happiness", area: "love" },
    6: { mr: "चंद्र षष्ठात — शत्रूंवर विजय, पण पोटाचे विकार", en: "Moon in 6th — victory over enemies, but stomach ailments", area: "health" },
    7: { mr: "चंद्र सप्तमात — शुभ, जोडीदाराशी सुसंवाद, सामाजिक मान", en: "Moon in 7th — auspicious, harmony with spouse, social respect", area: "love" },
    8: { mr: "चंद्र अष्टमात — मानसिक तणाव, अनपेक्षित खर्च", en: "Moon in 8th — mental stress, unexpected expenses", area: "health" },
    9: { mr: "चंद्र नवमात — भाग्योदय, धार्मिक कार्य, पित्याचा सहकार", en: "Moon in 9th — fortune rises, religious activities, father's support", area: "general" },
    10: { mr: "चंद्र दशमात — शुभ, कामात यश, सामाजिक प्रतिष्ठा", en: "Moon in 10th — auspicious, work success, social prestige", area: "career" },
    11: { mr: "चंद्र लाभभावात — आर्थिक लाभ, इच्छापूर्ती, शुभ बातम्या", en: "Moon in 11th — financial gains, wish fulfillment, good news", area: "career" },
    12: { mr: "चंद्र व्ययभावात — खर्च, मानसिक अस्वस्थता, झोप जास्त", en: "Moon in 12th — expenses, mental discomfort, excessive sleep", area: "health" },
  },
  Sun: {
    1: { mr: "सूर्य लग्नात — आत्मविश्वास, नेतृत्व, पण डोकेदुखी शक्य", en: "Sun in 1st — confidence, leadership, but headache possible", area: "general" },
    2: { mr: "सूर्य धनभावात — आर्थिक तणाव, सरकारी कामे विलंब", en: "Sun in 2nd — financial stress, government work delays", area: "career" },
    3: { mr: "सूर्य तृतीयात — शुभ, पराक्रम, शत्रूनाश, धाडसी निर्णय", en: "Sun in 3rd — auspicious, valor, enemy destruction, bold decisions", area: "career" },
    4: { mr: "सूर्य चतुर्थात — घरगुती तणाव, मानसिक अशांती", en: "Sun in 4th — domestic tension, mental unrest", area: "love" },
    5: { mr: "सूर्य पंचमात — बुद्धी तीक्ष्ण, पण संतती चिंता", en: "Sun in 5th — sharp intellect, but child concerns", area: "general" },
    6: { mr: "सूर्य षष्ठात — शुभ, शत्रूनाश, रोगमुक्ती, सरकारी लाभ", en: "Sun in 6th — auspicious, enemies destroyed, disease cured, government gains", area: "health" },
    7: { mr: "सूर्य सप्तमात — जोडीदाराशी वाद, प्रवास, भागीदारी तणाव", en: "Sun in 7th — spouse arguments, travel, partnership tension", area: "love" },
    8: { mr: "सूर्य अष्टमात — आरोग्य सावध, अचानक संकटे, ताप शक्य", en: "Sun in 8th — health caution, sudden crises, fever possible", area: "health" },
    9: { mr: "सूर्य नवमात — पित्याशी तणाव, भाग्यात विलंब", en: "Sun in 9th — tension with father, fortune delayed", area: "general" },
    10: { mr: "सूर्य दशमात — शुभ, करिअरमध्ये उन्नती, सरकारी मान", en: "Sun in 10th — auspicious, career advancement, government recognition", area: "career" },
    11: { mr: "सूर्य लाभभावात — शुभ, आर्थिक लाभ, इच्छापूर्ती, पदोन्नती", en: "Sun in 11th — auspicious, financial gains, wish fulfillment, promotion", area: "career" },
    12: { mr: "सूर्य व्ययभावात — खर्च वाढ, डोळ्यांची काळजी, सरकारी दंड", en: "Sun in 12th — expenses increase, eye care, government penalties", area: "health" },
  },
  Mercury: {
    1: { mr: "बुध लग्नात — बुद्धी तीक्ष्ण, संवाद उत्तम, व्यापार लाभ", en: "Mercury in 1st — sharp intellect, excellent communication, business gains", area: "career" },
    2: { mr: "बुध धनभावात — शुभ, वाणी मधुर, आर्थिक लाभ, शिक्षणात यश", en: "Mercury in 2nd — auspicious, sweet speech, financial gains, academic success", area: "career" },
    3: { mr: "बुध तृतीयात — संवाद कौशल्य, लेखनात यश, प्रवास", en: "Mercury in 3rd — communication skills, writing success, travel", area: "career" },
    4: { mr: "बुध चतुर्थात — शुभ, घरगुती सुख, शिक्षणात प्रगती", en: "Mercury in 4th — auspicious, domestic happiness, education progress", area: "love" },
    5: { mr: "बुध पंचमात — बुद्धी अत्यंत तीक्ष्ण, परीक्षांत यश", en: "Mercury in 5th — extremely sharp intellect, exam success", area: "career" },
    6: { mr: "बुध षष्ठात — शुभ, शत्रूनाश, कायदेशीर विजय", en: "Mercury in 6th — auspicious, enemies destroyed, legal victory", area: "career" },
    7: { mr: "बुध सप्तमात — व्यापारात लाभ, भागीदारी शुभ", en: "Mercury in 7th — business gains, partnerships auspicious", area: "career" },
    8: { mr: "बुध अष्टमात — शुभ, गूढ ज्ञान, संशोधनात यश", en: "Mercury in 8th — auspicious, occult knowledge, research success", area: "general" },
    9: { mr: "बुध नवमात — धार्मिक विद्या, उच्च शिक्षण, भाग्य", en: "Mercury in 9th — religious learning, higher education, fortune", area: "general" },
    10: { mr: "बुध दशमात — शुभ, करिअरमध्ये प्रगती, व्यापारात यश", en: "Mercury in 10th — auspicious, career progress, business success", area: "career" },
    11: { mr: "बुध लाभभावात — शुभ, सर्व प्रकारचा लाभ, मित्र सहकार", en: "Mercury in 11th — auspicious, all kinds of gains, friends' support", area: "career" },
    12: { mr: "बुध व्ययभावात — खर्च, मानसिक चिंता, विदेश प्रवास", en: "Mercury in 12th — expenses, mental worry, foreign travel", area: "health" },
  },
  Venus: {
    1: { mr: "शुक्र लग्नात — शुभ, सौंदर्य, आकर्षण, भौतिक सुख", en: "Venus in 1st — auspicious, beauty, attraction, material comforts", area: "general" },
    2: { mr: "शुक्र धनभावात — शुभ, आर्थिक लाभ, कुटुंबात आनंद", en: "Venus in 2nd — auspicious, financial gains, family joy", area: "career" },
    3: { mr: "शुक्र तृतीयात — शुभ, कलात्मक यश, प्रवास आनंददायक", en: "Venus in 3rd — auspicious, artistic success, enjoyable travel", area: "career" },
    4: { mr: "शुक्र चतुर्थात — शुभ, घरगुती सुख, वाहन लाभ, मानसिक शांती", en: "Venus in 4th — auspicious, domestic bliss, vehicle gains, mental peace", area: "love" },
    5: { mr: "शुक्र पंचमात — शुभ, प्रेमात यश, मनोरंजन, कलात्मक कार्य", en: "Venus in 5th — auspicious, romance success, entertainment, artistic work", area: "love" },
    6: { mr: "शुक्र षष्ठात — शत्रूंचा त्रास, आरोग्य काळजी", en: "Venus in 6th — enemy troubles, health care needed", area: "health" },
    7: { mr: "शुक्र सप्तमात — वैवाहिक सुख, प्रेम वाढेल", en: "Venus in 7th — marital happiness, love will grow", area: "love" },
    8: { mr: "शुक्र अष्टमात — शुभ, अनपेक्षित लाभ, वारसा", en: "Venus in 8th — auspicious, unexpected gains, inheritance", area: "career" },
    9: { mr: "शुक्र नवमात — शुभ, भाग्यवृद्धी, धार्मिक प्रवास", en: "Venus in 9th — auspicious, fortune growth, religious travel", area: "general" },
    10: { mr: "शुक्र दशमात — करिअरमध्ये तणाव, प्रतिष्ठा सांभाळा", en: "Venus in 10th — career tension, maintain reputation", area: "career" },
    11: { mr: "शुक्र लाभभावात — शुभ, सर्वोत्तम, भौतिक सुख, लाभ", en: "Venus in 11th — auspicious, best position, material comforts, gains", area: "career" },
    12: { mr: "शुक्र व्ययभावात — शुभ, विलासिता, परदेश सुख", en: "Venus in 12th — auspicious, luxury, foreign comforts", area: "general" },
  },
  Rahu: {
    1: { mr: "राहु लग्नात — मानसिक भ्रम, आरोग्य सावध, अनपेक्षित बदल", en: "Rahu in 1st — mental confusion, health caution, unexpected changes", area: "health" },
    2: { mr: "राहु धनभावात — आर्थिक अनिश्चितता, कुटुंबात तणाव", en: "Rahu in 2nd — financial uncertainty, family tension", area: "career" },
    3: { mr: "राहु तृतीयात — शुभ, धाडस, तंत्रज्ञानात यश", en: "Rahu in 3rd — auspicious, courage, technology success", area: "career" },
    4: { mr: "राहु चतुर्थात — घरगुती अशांती, मालमत्ता वाद", en: "Rahu in 4th — domestic unrest, property disputes", area: "love" },
    5: { mr: "राहु पंचमात — शिक्षणात अडथळे, गुंतवणूक सावध", en: "Rahu in 5th — education obstacles, investment caution", area: "general" },
    6: { mr: "राहु षष्ठात — शुभ, शत्रूनाश, स्पर्धेत विजय", en: "Rahu in 6th — auspicious, enemies destroyed, competition victory", area: "career" },
    7: { mr: "राहु सप्तमात — वैवाहिक तणाव, भ्रमात पडू नका", en: "Rahu in 7th — marital tension, don't fall for illusions", area: "love" },
    8: { mr: "राहु अष्टमात — अचानक संकटे, गूढ अनुभव", en: "Rahu in 8th — sudden crises, mystical experiences", area: "health" },
    9: { mr: "राहु नवमात — धर्मात भ्रम, पित्याशी मतभेद", en: "Rahu in 9th — religious confusion, father disagreements", area: "general" },
    10: { mr: "राहु दशमात — शुभ, करिअरमध्ये अनपेक्षित यश", en: "Rahu in 10th — auspicious, unexpected career success", area: "career" },
    11: { mr: "राहु लाभभावात — शुभ, आर्थिक लाभ, इच्छापूर्ती", en: "Rahu in 11th — auspicious, financial gains, wish fulfillment", area: "career" },
    12: { mr: "राहु व्ययभावात — खर्च, झोप समस्या, परदेश अनुभव", en: "Rahu in 12th — expenses, sleep issues, foreign experiences", area: "health" },
  },
  Ketu: {
    1: { mr: "केतु लग्नात — आध्यात्मिक विकास, पण शारीरिक थकवा", en: "Ketu in 1st — spiritual growth, but physical fatigue", area: "health" },
    2: { mr: "केतु धनभावात — वाणी सावध, आर्थिक अनिश्चितता", en: "Ketu in 2nd — speech caution, financial uncertainty", area: "career" },
    3: { mr: "केतु तृतीयात — शुभ, आध्यात्मिक धाडस, प्रवास", en: "Ketu in 3rd — auspicious, spiritual courage, travel", area: "general" },
    4: { mr: "केतु चतुर्थात — मातेची काळजी, घरगुती अस्थिरता", en: "Ketu in 4th — mother's care needed, domestic instability", area: "love" },
    5: { mr: "केतु पंचमात — बुद्धीत भ्रम, संतती चिंता", en: "Ketu in 5th — intellectual confusion, child concerns", area: "general" },
    6: { mr: "केतु षष्ठात — शुभ, शत्रूनाश, रोगमुक्ती", en: "Ketu in 6th — auspicious, enemies destroyed, disease cured", area: "health" },
    7: { mr: "केतु सप्तमात — वैवाहिक अलिप्तता, भागीदारी सावध", en: "Ketu in 7th — marital detachment, partnership caution", area: "love" },
    8: { mr: "केतु अष्टमात — गूढ अनुभव, अचानक बदल", en: "Ketu in 8th — mystical experiences, sudden changes", area: "general" },
    9: { mr: "केतु नवमात — आध्यात्मिक प्रगती, पण भाग्यात विलंब", en: "Ketu in 9th — spiritual progress, but fortune delayed", area: "general" },
    10: { mr: "केतु दशमात — करिअरमध्ये अनिश्चितता, वैराग्य भावना", en: "Ketu in 10th — career uncertainty, detachment feeling", area: "career" },
    11: { mr: "केतु लाभभावात — शुभ, आध्यात्मिक लाभ", en: "Ketu in 11th — auspicious, spiritual gains", area: "general" },
    12: { mr: "केतु व्ययभावात — शुभ मोक्षासाठी, आध्यात्मिक मुक्ती", en: "Ketu in 12th — auspicious for liberation, spiritual freedom", area: "general" },
  },
};

const LUCKY_COLORS = [
  { mr: "लाल", en: "Red" }, { mr: "हिरवा", en: "Green" }, { mr: "निळा", en: "Blue" },
  { mr: "पांढरा", en: "White" }, { mr: "गुलाबी", en: "Pink" }, { mr: "जांभळा", en: "Purple" },
  { mr: "तपकिरी", en: "Brown" }, { mr: "आकाशी", en: "Sky Blue" },
  { mr: "मरून", en: "Maroon" }, { mr: "राखाडी", en: "Grey" }, { mr: "केशरी", en: "Saffron" },
  { mr: "काळा", en: "Black" },
];

// Calculate which house a transit planet falls in relative to a rashi
function getTransitHouse(transitRashiIndex: number, fromRashiIndex: number): number {
  return ((transitRashiIndex - fromRashiIndex + 12) % 12) + 1;
}

export function calculateGochar(transitPlanets: TransitPlanet[], rashiId: number): GocharResult {
  const transits: GocharResult["transits"] = [];
  let goodCount = 0;
  let badCount = 0;
  const careerNotes: { mr: string; en: string }[] = [];
  const loveNotes: { mr: string; en: string }[] = [];
  const healthNotes: { mr: string; en: string }[] = [];
  const generalNotes: { mr: string; en: string }[] = [];

  for (const tp of transitPlanets) {
    const house = getTransitHouse(tp.rashiIndex, rashiId);
    const isGood = GOOD_HOUSES[tp.id]?.includes(house) ?? false;
    const effect: "good" | "bad" | "neutral" = isGood ? "good" : "neutral";

    transits.push({
      planet: tp.id,
      planetMr: PLANET_MR[tp.id] || tp.id,
      house,
      effect: isGood ? "good" : "bad",
    });

    if (isGood) goodCount++;
    else badCount++;

    // Get specific effect text
    const planetEffects = TRANSIT_EFFECTS[tp.id];
    if (planetEffects && planetEffects[house]) {
      const eff = planetEffects[house];
      const note = { mr: eff.mr, en: eff.en };
      if (eff.area === "career") careerNotes.push(note);
      else if (eff.area === "love") loveNotes.push(note);
      else if (eff.area === "health") healthNotes.push(note);
      else generalNotes.push(note);
    }
  }

  // Calculate rating
  const total = goodCount + badCount;
  const ratio = total > 0 ? goodCount / total : 0.5;
  const rating = ratio >= 0.7 ? 5 : ratio >= 0.55 ? 4 : ratio >= 0.4 ? 3 : ratio >= 0.25 ? 2 : 1;

  // Build overall summary
  const overallMr = goodCount > badCount
    ? `आज बहुतांश ग्रह अनुकूल स्थितीत आहेत (${goodCount} शुभ, ${badCount} अशुभ गोचर). एकंदर चांगला दिवस. ${generalNotes.map(n => n.mr).join(" ")}`
    : goodCount === badCount
    ? `आज ग्रहस्थिती मिश्र आहे (${goodCount} शुभ, ${badCount} अशुभ गोचर). सावधगिरीने काम करा. ${generalNotes.map(n => n.mr).join(" ")}`
    : `आज काही ग्रह प्रतिकूल आहेत (${goodCount} शुभ, ${badCount} अशुभ गोचर). धीर ठेवा, संयमाने वागा. ${generalNotes.map(n => n.mr).join(" ")}`;

  const overallEn = goodCount > badCount
    ? `Most planets are in favorable transit today (${goodCount} good, ${badCount} challenging). Overall a good day. ${generalNotes.map(n => n.en).join(" ")}`
    : goodCount === badCount
    ? `Planetary transits are mixed today (${goodCount} good, ${badCount} challenging). Work with caution. ${generalNotes.map(n => n.en).join(" ")}`
    : `Some planets are unfavorable today (${goodCount} good, ${badCount} challenging). Be patient and composed. ${generalNotes.map(n => n.en).join(" ")}`;

  const careerMr = careerNotes.length > 0 ? careerNotes.map(n => n.mr).join(". ") : "करिअरबद्दल विशेष प्रभाव नाही. सामान्य कार्यदिवस.";
  const careerEn = careerNotes.length > 0 ? careerNotes.map(n => n.en).join(". ") : "No special career influence. Normal working day.";
  const loveMr = loveNotes.length > 0 ? loveNotes.map(n => n.mr).join(". ") : "प्रेम/कुटुंब क्षेत्रात विशेष बदल नाही. शांतता राहील.";
  const loveEn = loveNotes.length > 0 ? loveNotes.map(n => n.en).join(". ") : "No special changes in love/family. Peace will prevail.";
  const healthMr = healthNotes.length > 0 ? healthNotes.map(n => n.mr).join(". ") : "आरोग्य सामान्य राहील. नियमित दिनचर्या पाळा.";
  const healthEn = healthNotes.length > 0 ? healthNotes.map(n => n.en).join(". ") : "Health will be normal. Follow regular routine.";

  // Advice based on dominant transit
  const adviceMr = rating >= 4
    ? "आज शुभ गोचरामुळे महत्वाची कामे करा. निर्णय घ्या. नवीन सुरुवात करा."
    : rating >= 3
    ? "सावधगिरीने पण सकारात्मकपणे काम करा. मध्यम धोका स्वीकारार्ह."
    : "आज महत्वाचे निर्णय टाळा. शांत राहा. उद्या चांगला दिवस असेल.";
  const adviceEn = rating >= 4
    ? "Today's transits are favorable — take important actions, make decisions, start new things."
    : rating >= 3
    ? "Work cautiously but positively. Moderate risk is acceptable."
    : "Avoid important decisions today. Stay calm. Tomorrow will be a better day.";

  // Lucky color based on strongest benefic transit
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const luckyColor = LUCKY_COLORS[(rashiId + dayOfYear) % LUCKY_COLORS.length];
  const luckyNumber = ((rashiId * 3 + dayOfYear * 7) % 9) + 1;

  return {
    rashiId,
    rashiMr: RASHI_NAMES[rashiId].mr,
    rashiEn: RASHI_NAMES[rashiId].en,
    overall: { mr: overallMr, en: overallEn },
    career: { mr: careerMr, en: careerEn },
    love: { mr: loveMr, en: loveEn },
    health: { mr: healthMr, en: healthEn },
    advice: { mr: adviceMr, en: adviceEn },
    rating,
    transits,
    luckyColor,
    luckyNumber,
  };
}
