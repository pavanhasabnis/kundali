/**
 * Shared rashi (zodiac) data for pages, SEO, and sitemap.
 * Safe to import in both server and client components.
 */

export interface RashiInfo {
  id: number;
  slug: string;
  mr: string;
  en: string;
  symbol: string;
  dates: string;
  datesEn: string;
  /** Marathi SEO keywords for this rashi */
  keywordsMr: string[];
  /** English SEO keywords for this rashi */
  keywordsEn: string[];
  /** Short Marathi description for meta */
  descMr: string;
  /** Short English description for meta */
  descEn: string;
}

export const RASHI_LIST: RashiInfo[] = [
  {
    id: 0, slug: "mesh", mr: "मेष", en: "Aries", symbol: "♈",
    dates: "मार्च 21 - एप्रिल 19", datesEn: "Mar 21 - Apr 19",
    keywordsMr: ["मेष राशीफल", "मेष राशी भविष्य आज", "आजचे मेष राशीफल", "mesh rashifal"],
    keywordsEn: ["aries horoscope today", "mesh rashifal today", "aries daily horoscope", "mesh rashi bhavishya"],
    descMr: "आजचे मेष राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Aries (Mesh) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 1, slug: "vrushabh", mr: "वृषभ", en: "Taurus", symbol: "♉",
    dates: "एप्रिल 20 - मे 20", datesEn: "Apr 20 - May 20",
    keywordsMr: ["वृषभ राशीफल", "वृषभ राशी भविष्य आज", "आजचे वृषभ राशीफल", "vrushabh rashifal"],
    keywordsEn: ["taurus horoscope today", "vrushabh rashifal today", "taurus daily horoscope", "vrushabh rashi bhavishya"],
    descMr: "आजचे वृषभ राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Taurus (Vrushabh) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 2, slug: "mithun", mr: "मिथुन", en: "Gemini", symbol: "♊",
    dates: "जून 15 - जुलै 14", datesEn: "Jun 15 - Jul 14",
    keywordsMr: ["मिथुन राशीफल", "मिथुन राशी भविष्य आज", "आजचे मिथुन राशीफल", "mithun rashifal"],
    keywordsEn: ["gemini horoscope today", "mithun rashifal today", "gemini daily horoscope", "mithun rashi bhavishya"],
    descMr: "आजचे मिथुन राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Gemini (Mithun) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 3, slug: "kark", mr: "कर्क", en: "Cancer", symbol: "♋",
    dates: "जुलै 15 - ऑगस्ट 14", datesEn: "Jul 15 - Aug 14",
    keywordsMr: ["कर्क राशीफल", "कर्क राशी भविष्य आज", "आजचे कर्क राशीफल", "kark rashifal"],
    keywordsEn: ["cancer horoscope today", "kark rashifal today", "cancer daily horoscope", "kark rashi bhavishya"],
    descMr: "आजचे कर्क राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Cancer (Kark) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 4, slug: "simha", mr: "सिंह", en: "Leo", symbol: "♌",
    dates: "ऑगस्ट 15 - सप्टेंबर 15", datesEn: "Aug 15 - Sep 15",
    keywordsMr: ["सिंह राशीफल", "सिंह राशी भविष्य आज", "आजचे सिंह राशीफल", "simha rashifal"],
    keywordsEn: ["leo horoscope today", "simha rashifal today", "leo daily horoscope", "simha rashi bhavishya"],
    descMr: "आजचे सिंह राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Leo (Simha) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 5, slug: "kanya", mr: "कन्या", en: "Virgo", symbol: "♍",
    dates: "सप्टेंबर 16 - ऑक्टोबर 15", datesEn: "Sep 16 - Oct 15",
    keywordsMr: ["कन्या राशीफल", "कन्या राशी भविष्य आज", "आजचे कन्या राशीफल", "kanya rashifal"],
    keywordsEn: ["virgo horoscope today", "kanya rashifal today", "virgo daily horoscope", "kanya rashi bhavishya"],
    descMr: "आजचे कन्या राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Virgo (Kanya) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 6, slug: "tula", mr: "तुला", en: "Libra", symbol: "♎",
    dates: "ऑक्टोबर 16 - नोव्हेंबर 14", datesEn: "Oct 16 - Nov 14",
    keywordsMr: ["तुला राशीफल", "तुला राशी भविष्य आज", "आजचे तुला राशीफल", "tula rashifal"],
    keywordsEn: ["libra horoscope today", "tula rashifal today", "libra daily horoscope", "tula rashi bhavishya"],
    descMr: "आजचे तुला राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Libra (Tula) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 7, slug: "vrushchik", mr: "वृश्चिक", en: "Scorpio", symbol: "♏",
    dates: "नोव्हेंबर 15 - डिसेंबर 14", datesEn: "Nov 15 - Dec 14",
    keywordsMr: ["वृश्चिक राशीफल", "वृश्चिक राशी भविष्य आज", "आजचे वृश्चिक राशीफल", "vrushchik rashifal"],
    keywordsEn: ["scorpio horoscope today", "vrushchik rashifal today", "scorpio daily horoscope", "vrushchik rashi bhavishya"],
    descMr: "आजचे वृश्चिक राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Scorpio (Vrushchik) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 8, slug: "dhanu", mr: "धनु", en: "Sagittarius", symbol: "♐",
    dates: "डिसेंबर 15 - जानेवारी 13", datesEn: "Dec 15 - Jan 13",
    keywordsMr: ["धनु राशीफल", "धनु राशी भविष्य आज", "आजचे धनु राशीफल", "dhanu rashifal"],
    keywordsEn: ["sagittarius horoscope today", "dhanu rashifal today", "sagittarius daily horoscope", "dhanu rashi bhavishya"],
    descMr: "आजचे धनु राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Sagittarius (Dhanu) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 9, slug: "makar", mr: "मकर", en: "Capricorn", symbol: "♑",
    dates: "जानेवारी 14 - फेब्रुवारी 12", datesEn: "Jan 14 - Feb 12",
    keywordsMr: ["मकर राशीफल", "मकर राशी भविष्य आज", "आजचे मकर राशीफल", "makar rashifal"],
    keywordsEn: ["capricorn horoscope today", "makar rashifal today", "capricorn daily horoscope", "makar rashi bhavishya"],
    descMr: "आजचे मकर राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Capricorn (Makar) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 10, slug: "kumbh", mr: "कुंभ", en: "Aquarius", symbol: "♒",
    dates: "फेब्रुवारी 13 - मार्च 13", datesEn: "Feb 13 - Mar 13",
    keywordsMr: ["कुंभ राशीफल", "कुंभ राशी भविष्य आज", "आजचे कुंभ राशीफल", "kumbh rashifal"],
    keywordsEn: ["aquarius horoscope today", "kumbh rashifal today", "aquarius daily horoscope", "kumbh rashi bhavishya"],
    descMr: "आजचे कुंभ राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Aquarius (Kumbh) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
  {
    id: 11, slug: "meen", mr: "मीन", en: "Pisces", symbol: "♓",
    dates: "मार्च 14 - एप्रिल 13", datesEn: "Mar 14 - Apr 13",
    keywordsMr: ["मीन राशीफल", "मीन राशी भविष्य आज", "आजचे मीन राशीफल", "meen rashifal"],
    keywordsEn: ["pisces horoscope today", "meen rashifal today", "pisces daily horoscope", "meen rashi bhavishya"],
    descMr: "आजचे मीन राशीफल — करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य. वैदिक ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.",
    descEn: "Today's Pisces (Meen) horoscope — career, love, health & finance predictions based on real Vedic planetary transits.",
  },
];

/** Look up a rashi by slug */
export function getRashiBySlug(slug: string): RashiInfo | undefined {
  return RASHI_LIST.find((r) => r.slug === slug);
}
