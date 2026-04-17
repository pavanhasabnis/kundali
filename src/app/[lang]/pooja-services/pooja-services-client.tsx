"use client";

import { useLang } from "@/lib/astrology/language-context";
import { useState } from "react";
import { EnquiryPopup } from "@/components/enquiry-popup";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

interface PoojaService {
  id: string;
  nameMr: string;
  nameEn: string;
  icon: string;
  category: string;
  descMr: string;
  descEn: string;
  durationMr: string;
  durationEn: string;
  includesMr: string[];
  includesEn: string[];
}

const CATEGORIES = [
  { id: "graha", mr: "ग्रह शांती", en: "Graha Shanti" },
  { id: "gruh", mr: "गृह संबंधित", en: "Home Related" },
  { id: "dosh", mr: "दोष निवारण", en: "Dosha Nivaran" },
  { id: "dev", mr: "देवता पूजा", en: "Deity Pooja" },
  { id: "sanskar", mr: "संस्कार विधी", en: "Sanskar Rituals" },
  { id: "shanti", mr: "शांती व पाठ", en: "Shanti & Path" },
  { id: "pitru", mr: "पितृ विधी", en: "Pitru Rituals" },
  { id: "special", mr: "विशेष पूजा", en: "Special Pooja" },
];

const SERVICES: PoojaService[] = [
  // ── ग्रह शांती ──
  {
    id: "navagraha-shanti",
    nameMr: "नवग्रह शांती पूजा",
    nameEn: "Navagraha Shanti Puja",
    icon: "☉",
    category: "graha",
    descMr: "नवग्रहांची शांती करून ग्रहांचा अशुभ प्रभाव कमी करणे. सर्व नऊ ग्रहांची विधिवत पूजा.",
    descEn: "Pacify all nine planets to reduce their malefic effects. Ritualistic worship of all nine grahas.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["नवग्रह मंत्र जप", "हवन/होम", "नवग्रह स्थापना", "प्रसाद वाटप", "नवग्रह यंत्र पूजा"],
    includesEn: ["Navagraha mantra chanting", "Havan/Hom", "Navagraha Sthapana", "Prasad distribution", "Navagraha Yantra puja"],
  },
  {
    id: "shani-shanti",
    nameMr: "शनि शांती पूजा",
    nameEn: "Shani Shanti Puja",
    icon: "♄",
    category: "graha",
    descMr: "साडेसाती, शनि दशा किंवा शनि दोष असल्यास शनिदेवाची शांती पूजा. शनिचा अशुभ प्रभाव कमी होतो.",
    descEn: "Pacify Lord Shani during Sade Sati, Shani Dasha or Shani Dosha. Reduces Saturn's malefic influence.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["शनि मंत्र जप (२३,००० वेळा)", "तिळाचा होम", "शनिदेवाला तेल अर्पण", "काळे तीळ दान"],
    includesEn: ["Shani mantra chanting (23,000 times)", "Til Hom", "Oil offering to Shani Dev", "Black sesame donation"],
  },
  {
    id: "mangal-shanti",
    nameMr: "मंगळ शांती पूजा",
    nameEn: "Mangal Shanti Puja",
    icon: "♂",
    category: "graha",
    descMr: "मंगळ दोष किंवा मंगळ ग्रहाचा अशुभ प्रभाव कमी करण्यासाठी. विवाहात अडथळे असल्यास विशेष उपयोगी.",
    descEn: "Reduce malefic effects of Mars. Especially useful when facing marriage obstacles due to Mangal Dosha.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["मंगळ मंत्र जप", "हवन", "हनुमान पूजा", "लाल प्रवाळ अभिषेक", "दान विधी"],
    includesEn: ["Mangal mantra chanting", "Havan", "Hanuman Puja", "Red Coral Abhishek", "Donation rituals"],
  },

  // ── गृह संबंधित ──
  {
    id: "vastushanti",
    nameMr: "वास्तुशांती",
    nameEn: "Vastushanti",
    icon: "🏠",
    category: "gruh",
    descMr: "नवीन घर/कार्यालयातील वास्तुदोष दूर करण्यासाठी. वास्तुपुरुषाची पूजा करून सकारात्मक ऊर्जा निर्माण.",
    descEn: "Remove Vastu defects in new home/office. Worship of Vastu Purusha to create positive energy flow.",
    durationMr: "४-५ तास",
    durationEn: "4-5 hours",
    includesMr: ["वास्तुपुरुष पूजा", "नवग्रह शांती", "वास्तु होम", "दिशा शुद्धी", "कलश स्थापना", "प्रसाद"],
    includesEn: ["Vastu Purusha puja", "Navagraha Shanti", "Vastu Hom", "Direction purification", "Kalash Sthapana", "Prasad"],
  },
  {
    id: "gruhapravesh",
    nameMr: "गृहप्रवेश पूजा",
    nameEn: "Gruhapravesh Puja",
    icon: "🚪",
    category: "gruh",
    descMr: "नवीन घरात प्रवेश करताना विधिवत पूजा. गणपती पूजा, हवन आणि शुभ मुहूर्तावर प्रवेश.",
    descEn: "Ritualistic puja when entering a new home. Ganpati puja, havan and entry at auspicious muhurat.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["गणपती स्थापना", "कलश पूजा", "हवन/होम", "नवग्रह पूजा", "दूध उतू काढणे", "प्रसाद"],
    includesEn: ["Ganpati Sthapana", "Kalash Puja", "Havan/Hom", "Navagraha Puja", "Milk boiling ritual", "Prasad"],
  },

  // ── दोष निवारण ──
  {
    id: "kaalsarp-shanti",
    nameMr: "काल सर्प शांती पूजा",
    nameEn: "Kaal Sarp Shanti Puja",
    icon: "🐍",
    category: "dosh",
    descMr: "कुंडलीत काल सर्प दोष असल्यास. त्र्यंबकेश्वर / काळहस्ती येथे विशेष पूजा. अडथळे दूर होतात.",
    descEn: "For Kaal Sarp Dosha in kundli. Special puja at Trimbakeshwar/Kalahasti. Removes obstacles in life.",
    durationMr: "३-५ तास",
    durationEn: "3-5 hours",
    includesMr: ["नाग पूजा", "रुद्राभिषेक", "महामृत्युंजय जप", "सर्प सूक्त पाठ", "नागबळी (ऐच्छिक)"],
    includesEn: ["Nag Puja", "Rudrabhishek", "Mahamrityunjay Jap", "Sarpa Sukta recitation", "Nagbali (optional)"],
  },
  {
    id: "pitru-dosh-nivaran",
    nameMr: "पितृ दोष निवारण पूजा",
    nameEn: "Pitru Dosha Nivaran Puja",
    icon: "🙏",
    category: "dosh",
    descMr: "पितृ दोष असल्यास पूर्वजांच्या आत्मशांतीसाठी. संतती/करिअरमधील अडथळे दूर होतात.",
    descEn: "For Pitru Dosha — peace for ancestors' souls. Removes obstacles in progeny/career.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["पितृ तर्पण", "पिंडदान", "श्राद्ध विधी", "ब्राह्मण भोजन", "गायदान (ऐच्छिक)"],
    includesEn: ["Pitru Tarpan", "Pind Daan", "Shraddha Vidhi", "Brahmin bhojan", "Cow donation (optional)"],
  },
  {
    id: "mangal-dosh-nivaran",
    nameMr: "मंगळ दोष निवारण",
    nameEn: "Mangal Dosha Nivaran",
    icon: "♂",
    category: "dosh",
    descMr: "विवाहात अडथळे, वैवाहिक तणाव यासाठी मंगळ दोष शांती. हनुमान पूजा आणि मंगळ ग्रह शांती.",
    descEn: "For marriage obstacles and marital tension. Hanuman puja and Mars planet pacification.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["हनुमान चालीसा पाठ", "मंगळ मंत्र जप", "लाल प्रवाळ पूजा", "हवन", "दान विधी"],
    includesEn: ["Hanuman Chalisa recitation", "Mangal mantra chanting", "Red Coral puja", "Havan", "Donation rituals"],
  },

  // ── देवता पूजा ──
  {
    id: "satyanarayan",
    nameMr: "सत्यनारायण पूजा / कथा",
    nameEn: "Satyanarayan Puja / Katha",
    icon: "🙏",
    category: "dev",
    descMr: "कुटुंबाच्या सुख-समृद्धीसाठी. गृहप्रवेश, वाढदिवस, पूर्णिमा यानिमित्त केली जाते.",
    descEn: "For family happiness and prosperity. Performed during housewarming, birthdays, Purnima.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["सत्यनारायण कथा वाचन", "षोडशोपचार पूजा", "प्रसाद (शिरा)", "आरती", "प्रसाद वाटप"],
    includesEn: ["Satyanarayan Katha recitation", "Shodashopchar puja", "Prasad (Sheera)", "Aarti", "Prasad distribution"],
  },
  {
    id: "rudrabhishek",
    nameMr: "रुद्राभिषेक",
    nameEn: "Rudrabhishek",
    icon: "🔱",
    category: "dev",
    descMr: "शिवलिंगावर दूध, पाणी, मध, दही, तूप यांचा अभिषेक. आरोग्य, शांती आणि समृद्धीसाठी.",
    descEn: "Abhishek on Shivlinga with milk, water, honey, curd, ghee. For health, peace and prosperity.",
    durationMr: "१.५-२ तास",
    durationEn: "1.5-2 hours",
    includesMr: ["रुद्र सूक्त पाठ", "पंचामृत अभिषेक", "बिल्वपत्र अर्पण", "शिव आरती", "प्रसाद"],
    includesEn: ["Rudra Sukta recitation", "Panchamrit Abhishek", "Bilva leaf offering", "Shiv Aarti", "Prasad"],
  },
  {
    id: "ganpati-atharvashirsha",
    nameMr: "गणपती अथर्वशीर्ष / पूजा",
    nameEn: "Ganapati Atharvashirsha / Puja",
    icon: "🐘",
    category: "dev",
    descMr: "विघ्नहर्ता गणपतीची पूजा. नवीन कार्य, व्यवसाय सुरू करताना. संकष्टी चतुर्थीला विशेष.",
    descEn: "Worship of Lord Ganesha, remover of obstacles. For new ventures and businesses. Special on Sankashti.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["गणपती स्थापना", "अथर्वशीर्ष पाठ (२१ वेळा)", "मोदक अर्पण", "दुर्वा पूजा", "आरती"],
    includesEn: ["Ganpati Sthapana", "Atharvashirsha recitation (21 times)", "Modak offering", "Durva puja", "Aarti"],
  },
  {
    id: "laxmi-puja",
    nameMr: "लक्ष्मी पूजा / श्री सूक्त पाठ",
    nameEn: "Lakshmi Puja / Shri Sukta Path",
    icon: "💰",
    category: "dev",
    descMr: "आर्थिक समृद्धी, व्यवसाय वृद्धी आणि ऐश्वर्यासाठी. दिवाळी, शुक्रवारी विशेष.",
    descEn: "For financial prosperity, business growth and abundance. Special on Diwali and Fridays.",
    durationMr: "१.५-२ तास",
    durationEn: "1.5-2 hours",
    includesMr: ["श्री सूक्त पाठ", "लक्ष्मी षोडशोपचार पूजा", "कमळ पूजा", "हवन", "प्रसाद"],
    includesEn: ["Shri Sukta recitation", "Lakshmi Shodashopchar puja", "Lotus puja", "Havan", "Prasad"],
  },
  {
    id: "datta-puja",
    nameMr: "दत्त पूजा / गुरुचरित्र पारायण",
    nameEn: "Datta Puja / Gurucharitra Parayan",
    icon: "☸",
    category: "dev",
    descMr: "गुरु कृपा, ज्ञान आणि आध्यात्मिक उन्नतीसाठी. गुरुवारी विशेष. गुरु दत्तात्रेयांची पूजा.",
    descEn: "For Guru's blessings, knowledge and spiritual growth. Special on Thursdays. Lord Dattatreya worship.",
    durationMr: "२-७ दिवस (पारायण)",
    durationEn: "2-7 days (Parayan)",
    includesMr: ["दत्त मंत्र जप", "गुरुचरित्र वाचन", "हवन", "ब्राह्मण भोजन", "प्रसाद"],
    includesEn: ["Datta mantra chanting", "Gurucharitra reading", "Havan", "Brahmin bhojan", "Prasad"],
  },
  {
    id: "hanuman-puja",
    nameMr: "हनुमान पूजा / चालीसा पाठ",
    nameEn: "Hanuman Puja / Chalisa Path",
    icon: "🐒",
    category: "dev",
    descMr: "भय, शत्रू, न्यायालयीन वाद, मंगळ दोष निवारणासाठी. मंगळवार/शनिवारी विशेष.",
    descEn: "For removing fear, enemies, court cases, Mangal Dosha. Special on Tuesdays/Saturdays.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["हनुमान चालीसा (११ वेळा)", "सुंदरकांड पाठ", "लाल सिंदूर अर्पण", "हवन", "प्रसाद"],
    includesEn: ["Hanuman Chalisa (11 times)", "Sundarkand recitation", "Red Sindoor offering", "Havan", "Prasad"],
  },

  // ── संस्कार विधी ──
  {
    id: "lagna-vidhi",
    nameMr: "लग्न विधी / विवाह संस्कार",
    nameEn: "Wedding Rituals / Marriage Ceremony",
    icon: "💍",
    category: "sanskar",
    descMr: "संपूर्ण वैदिक लग्न विधी. मंगलाष्टक, सप्तपदी, कन्यादान, लाजाहोम सर्व विधी.",
    descEn: "Complete Vedic wedding rituals. Mangalashtak, Saptapadi, Kanyadaan, Lajahom — all rituals.",
    durationMr: "३-५ तास",
    durationEn: "3-5 hours",
    includesMr: ["गणपती पूजा", "मंगलाष्टक", "कन्यादान", "सप्तपदी", "लाजाहोम", "अक्षता समारंभ"],
    includesEn: ["Ganpati Puja", "Mangalashtak", "Kanyadaan", "Saptapadi", "Lajahom", "Akshata ceremony"],
  },
  {
    id: "munj-upnayan",
    nameMr: "मुंज / उपनयन संस्कार",
    nameEn: "Munj / Thread Ceremony",
    icon: "🧵",
    category: "sanskar",
    descMr: "मुलाचा जानवे (यज्ञोपवीत) संस्कार. वेदाध्ययनाचा प्रारंभ. ब्राह्मण संस्कार.",
    descEn: "Boy's sacred thread ceremony. Beginning of Vedic education. Brahmin Sanskar.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["गणपती पूजा", "होम", "यज्ञोपवीत धारण", "गायत्री उपदेश", "भिक्षा मागणे", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Hom", "Sacred thread wearing", "Gayatri Upadesh", "Bhiksha ritual", "Prasad"],
  },
  {
    id: "namkaran",
    nameMr: "नामकरण संस्कार",
    nameEn: "Naming Ceremony",
    icon: "👶",
    category: "sanskar",
    descMr: "बाळाचे विधिवत नामकरण. कुंडलीनुसार योग्य अक्षर निवड आणि नाव ठेवणे.",
    descEn: "Ritualistic naming of the baby. Selection of appropriate letter as per kundli and naming.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["गणपती पूजा", "कुंडलीनुसार अक्षर निवड", "नाव ठेवणे", "आशीर्वाद", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Letter selection per kundli", "Naming", "Blessings", "Prasad"],
  },
  {
    id: "barse",
    nameMr: "बारसे / जातकर्म",
    nameEn: "Barse / Jatakarma",
    icon: "🍼",
    category: "sanskar",
    descMr: "बाळाच्या जन्मानंतर बाराव्या दिवशी केले जाणारे विधी. बाळाचे प्रथम दर्शन.",
    descEn: "Rituals performed on the 12th day after baby's birth. Baby's first public appearance.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["गणपती पूजा", "बाळाचे पाळणा विधी", "आशीर्वाद", "सुवासिनी पूजा", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Cradle ceremony", "Blessings", "Suvasini Puja", "Prasad"],
  },

  // ── शांती व पाठ ──
  {
    id: "mahamrityunjay",
    nameMr: "महामृत्युंजय जप / हवन",
    nameEn: "Mahamrityunjay Jap / Havan",
    icon: "🔥",
    category: "shanti",
    descMr: "गंभीर आजार, अपघात भय, दीर्घायुष्यासाठी. सर्वात शक्तिशाली शिव मंत्र.",
    descEn: "For serious illness, accident fear, longevity. Most powerful Shiva mantra.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["महामृत्युंजय मंत्र जप (१,२५,००० वेळा)", "रुद्राभिषेक", "होम", "प्रसाद"],
    includesEn: ["Mahamrityunjay mantra chanting (1,25,000 times)", "Rudrabhishek", "Hom", "Prasad"],
  },
  {
    id: "sundarkand",
    nameMr: "सुंदरकांड पाठ",
    nameEn: "Sundarkand Path",
    icon: "📖",
    category: "shanti",
    descMr: "रामायणातील सुंदरकांड पाठ. अडथळे दूर होतात, मानसिक शांती मिळते.",
    descEn: "Sundarkand recitation from Ramayan. Removes obstacles, brings mental peace.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["सुंदरकांड पाठ", "हनुमान पूजा", "आरती", "प्रसाद वाटप"],
    includesEn: ["Sundarkand recitation", "Hanuman Puja", "Aarti", "Prasad distribution"],
  },
  {
    id: "havan",
    nameMr: "हवन / होम",
    nameEn: "Havan / Hom",
    icon: "🔥",
    category: "shanti",
    descMr: "अग्नि देवतेला आहुती देऊन वातावरण शुद्ध करणे. गृहशांती, आरोग्य, समृद्धीसाठी.",
    descEn: "Purify the environment by offering to fire deity. For home peace, health, prosperity.",
    durationMr: "१.५-२ तास",
    durationEn: "1.5-2 hours",
    includesMr: ["अग्नि स्थापना", "मंत्रोच्चार", "आहुती", "पूर्णाहुती", "प्रसाद"],
    includesEn: ["Agni Sthapana", "Mantra chanting", "Offerings", "Purnahuti", "Prasad"],
  },
  {
    id: "vastu-dosh-nivaran",
    nameMr: "वास्तु दोष निवारण पूजा",
    nameEn: "Vastu Dosha Nivaran Puja",
    icon: "🏗",
    category: "shanti",
    descMr: "जुन्या घर/कार्यालयातील वास्तुदोष निवारण. दिशा दोष, भूमी दोष शांती.",
    descEn: "Remove Vastu defects in old home/office. Direction and land defect pacification.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["वास्तु पुरुष पूजा", "दिशा शुद्धी", "नवग्रह शांती", "हवन", "यंत्र स्थापना"],
    includesEn: ["Vastu Purusha Puja", "Direction purification", "Navagraha Shanti", "Havan", "Yantra Sthapana"],
  },

  // ── पितृ विधी ──
  {
    id: "shraddha",
    nameMr: "श्राद्ध विधी",
    nameEn: "Shraddha Rituals",
    icon: "🙏",
    category: "pitru",
    descMr: "पूर्वजांच्या स्मरणार्थ वार्षिक श्राद्ध विधी. पितृपक्षात विशेष महत्व.",
    descEn: "Annual rituals in memory of ancestors. Special significance during Pitru Paksha.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["पिंडदान", "तर्पण", "ब्राह्मण भोजन", "दान विधी", "पितृ प्रार्थना"],
    includesEn: ["Pind Daan", "Tarpan", "Brahmin bhojan", "Donation rituals", "Pitru prayers"],
  },
  {
    id: "narayan-nagbali",
    nameMr: "नारायण नागबळी",
    nameEn: "Narayan Nagbali",
    icon: "🐍",
    category: "pitru",
    descMr: "त्र्यंबकेश्वर येथे केली जाणारी विशेष पूजा. पितृ दोष, नाग दोष, अकाली मृत्यू दोष निवारण.",
    descEn: "Special puja at Trimbakeshwar. Pitru Dosha, Naga Dosha, untimely death dosha removal.",
    durationMr: "३ दिवस",
    durationEn: "3 days",
    includesMr: ["नारायण बळी", "नागबळी", "त्रिपिंडी श्राद्ध", "रुद्राभिषेक", "ब्राह्मण भोजन"],
    includesEn: ["Narayan Bali", "Nagbali", "Tripindi Shraddha", "Rudrabhishek", "Brahmin bhojan"],
  },
  {
    id: "tripindi-shraddha",
    nameMr: "त्रिपिंडी श्राद्ध",
    nameEn: "Tripindi Shraddha",
    icon: "🕯",
    category: "pitru",
    descMr: "तीन पिढ्यांच्या पूर्वजांसाठी एकत्रित श्राद्ध. पितृ दोष निवारणासाठी अत्यंत प्रभावी.",
    descEn: "Combined shraddha for ancestors of three generations. Highly effective for Pitru Dosha removal.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["तीन पिंडदान", "तर्पण", "हवन", "ब्राह्मण भोजन", "गायदान (ऐच्छिक)"],
    includesEn: ["Three Pind Daan", "Tarpan", "Havan", "Brahmin bhojan", "Cow donation (optional)"],
  },

  // ── ग्रह शांती (additional) ──
  {
    id: "rahu-shanti",
    nameMr: "राहु शांती पूजा",
    nameEn: "Rahu Shanti Puja",
    icon: "☊",
    category: "graha",
    descMr: "राहु दशा, राहु दोष किंवा राहुचा अशुभ प्रभाव कमी करण्यासाठी. अचानक अडथळे, मानसिक अशांती दूर होते.",
    descEn: "For Rahu Dasha, Rahu Dosha or reducing Rahu's malefic effects. Removes sudden obstacles and mental unrest.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["राहु मंत्र जप (१८,००० वेळा)", "दुर्गा पूजा", "होम", "नारळ दान", "गोमेद अभिषेक"],
    includesEn: ["Rahu mantra chanting (18,000 times)", "Durga Puja", "Hom", "Coconut donation", "Gomed Abhishek"],
  },
  {
    id: "ketu-shanti",
    nameMr: "केतु शांती पूजा",
    nameEn: "Ketu Shanti Puja",
    icon: "☋",
    category: "graha",
    descMr: "केतु दशा किंवा केतु दोष असल्यास. गूढ आजार, अपघात, आध्यात्मिक अडथळे दूर होतात.",
    descEn: "For Ketu Dasha or Ketu Dosha. Removes mysterious ailments, accidents, spiritual obstacles.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["केतु मंत्र जप (७,००० वेळा)", "गणपती पूजा", "होम", "कुत्र्याला अन्नदान", "लहसुनिया अभिषेक"],
    includesEn: ["Ketu mantra chanting (7,000 times)", "Ganapati Puja", "Hom", "Feeding dogs", "Cat's Eye Abhishek"],
  },
  {
    id: "budh-shanti",
    nameMr: "बुध शांती पूजा",
    nameEn: "Budh (Mercury) Shanti Puja",
    icon: "☿",
    category: "graha",
    descMr: "बुध दशा, बुद्धी/वाणी/व्यापारातील अडथळे दूर करण्यासाठी. शिक्षण आणि संवाद कौशल्य सुधारते.",
    descEn: "For Budh Dasha, removing obstacles in intellect/speech/business. Improves education and communication.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["बुध मंत्र जप (९,००० वेळा)", "विष्णू पूजा", "होम", "हिरव्या वस्तू दान", "पन्ना अभिषेक"],
    includesEn: ["Budh mantra chanting (9,000 times)", "Vishnu Puja", "Hom", "Green items donation", "Emerald Abhishek"],
  },
  {
    id: "guru-shanti",
    nameMr: "गुरु/बृहस्पती शांती पूजा",
    nameEn: "Guru (Jupiter) Shanti Puja",
    icon: "♃",
    category: "graha",
    descMr: "गुरु दशा, गुरु दोष किंवा गुरु अस्त असल्यास. ज्ञान, संतती, भाग्य वाढवण्यासाठी.",
    descEn: "For Guru Dasha, Guru Dosha or combust Jupiter. Enhances knowledge, progeny and fortune.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["गुरु मंत्र जप (१९,००० वेळा)", "दत्तात्रेय पूजा", "होम", "केळी/हळद दान", "पुखराज अभिषेक"],
    includesEn: ["Guru mantra chanting (19,000 times)", "Dattatreya Puja", "Hom", "Banana/turmeric donation", "Yellow Sapphire Abhishek"],
  },
  {
    id: "shukra-shanti",
    nameMr: "शुक्र शांती पूजा",
    nameEn: "Shukra (Venus) Shanti Puja",
    icon: "♀",
    category: "graha",
    descMr: "शुक्र दशा, वैवाहिक सुख, भौतिक सुख-सोयींसाठी. सौंदर्य, कला आणि प्रेम वाढवते.",
    descEn: "For Shukra Dasha, marital happiness, material comforts. Enhances beauty, art and love.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["शुक्र मंत्र जप (१६,००० वेळा)", "लक्ष्मी पूजा", "होम", "पांढरे कपडे/साखर दान", "हिरा अभिषेक"],
    includesEn: ["Shukra mantra chanting (16,000 times)", "Lakshmi Puja", "Hom", "White cloth/sugar donation", "Diamond Abhishek"],
  },

  // ── देवता पूजा (additional) ──
  {
    id: "durga-saptashati",
    nameMr: "दुर्गा सप्तशती पाठ",
    nameEn: "Durga Saptashati Path",
    icon: "⚔",
    category: "dev",
    descMr: "देवी दुर्गेचे ७०० श्लोक. शत्रूनाश, भय निवारण, रोगमुक्ती. नवरात्रीत विशेष फलदायी.",
    descEn: "700 shlokas of Goddess Durga. Destroys enemies, removes fear, cures diseases. Especially fruitful during Navratri.",
    durationMr: "४-५ तास",
    durationEn: "4-5 hours",
    includesMr: ["दुर्गा सप्तशती पारायण", "देवी पूजा", "हवन", "कुमारिका पूजा", "नैवेद्य"],
    includesEn: ["Durga Saptashati recitation", "Devi Puja", "Havan", "Kumarika Puja", "Naivedya"],
  },
  {
    id: "vishnu-sahasranama",
    nameMr: "विष्णु सहस्रनाम पाठ",
    nameEn: "Vishnu Sahasranama Path",
    icon: "🙏",
    category: "dev",
    descMr: "भगवान विष्णूंच्या १००० नावांचा पाठ. सर्व प्रकारच्या संकटातून मुक्ती, शांती आणि समृद्धी.",
    descEn: "Recitation of 1000 names of Lord Vishnu. Freedom from all troubles, peace and prosperity.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["विष्णु सहस्रनाम पाठ", "विष्णू पूजा", "तुळशी अर्पण", "आरती", "प्रसाद"],
    includesEn: ["Vishnu Sahasranama recitation", "Vishnu Puja", "Tulsi offering", "Aarti", "Prasad"],
  },
  {
    id: "shri-sukta-hom",
    nameMr: "श्री सूक्त होम",
    nameEn: "Shri Sukta Hom",
    icon: "🔥",
    category: "dev",
    descMr: "लक्ष्मी देवीचे श्री सूक्त मंत्रांसह हवन. आर्थिक अडचणी दूर होतात, संपत्ती वाढते.",
    descEn: "Havan with Shri Sukta mantras of Goddess Lakshmi. Removes financial difficulties, increases wealth.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["श्री सूक्त पाठ", "लक्ष्मी पूजा", "होम/हवन", "कमळ अर्पण", "प्रसाद"],
    includesEn: ["Shri Sukta recitation", "Lakshmi Puja", "Hom/Havan", "Lotus offering", "Prasad"],
  },
  {
    id: "navchandi-yagna",
    nameMr: "नवचंडी यज्ञ",
    nameEn: "Navchandi Yagna",
    icon: "🔥",
    category: "dev",
    descMr: "दुर्गा सप्तशतीचे ९ वेळा पारायण आणि यज्ञ. अत्यंत शक्तिशाली — गंभीर संकट, रोग, शत्रू निवारण.",
    descEn: "9 recitations of Durga Saptashati with Yagna. Extremely powerful — for serious crises, diseases, enemy removal.",
    durationMr: "३-५ दिवस",
    durationEn: "3-5 days",
    includesMr: ["दुर्गा सप्तशती ९ पारायण", "नवचंडी होम", "कुमारिका पूजा", "ब्राह्मण भोजन", "महानैवेद्य"],
    includesEn: ["Durga Saptashati 9 recitations", "Navchandi Hom", "Kumarika Puja", "Brahmin bhojan", "Maha Naivedya"],
  },
  {
    id: "mahalaxmi-vrat",
    nameMr: "महालक्ष्मी व्रत पूजा",
    nameEn: "Mahalakshmi Vrat Puja",
    icon: "🪷",
    category: "dev",
    descMr: "महालक्ष्मी व्रत कथा आणि पूजा. कुटुंबाच्या सुख-समृद्धीसाठी. भाद्रपद शुक्ल अष्टमीला विशेष.",
    descEn: "Mahalakshmi Vrat Katha and Puja. For family happiness and prosperity. Special on Bhadrapada Shukla Ashtami.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["महालक्ष्मी व्रत कथा", "षोडशोपचार पूजा", "१६ दोऱ्यांची पूजा", "नैवेद्य", "आरती"],
    includesEn: ["Mahalakshmi Vrat Katha", "Shodashopchar Puja", "16 threads puja", "Naivedya", "Aarti"],
  },
  {
    id: "shivling-abhishek",
    nameMr: "शिवलिंग अभिषेक",
    nameEn: "Shivling Abhishek",
    icon: "🔱",
    category: "dev",
    descMr: "शिवलिंगावर विविध द्रव्यांचा अभिषेक. सोमवारी आणि महाशिवरात्रीला विशेष. रोगमुक्ती, शांती.",
    descEn: "Abhishek on Shivlinga with various substances. Special on Mondays and Mahashivratri. Health and peace.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["पंचामृत अभिषेक", "रुद्र सूक्त", "बिल्वपत्र अर्पण", "धतुरा/आक अर्पण", "शिव आरती"],
    includesEn: ["Panchamrit Abhishek", "Rudra Sukta", "Bilva leaf offering", "Dhatura/Aak offering", "Shiv Aarti"],
  },
  {
    id: "tulsi-vivah",
    nameMr: "तुळशी विवाह",
    nameEn: "Tulsi Vivah",
    icon: "🌿",
    category: "dev",
    descMr: "कार्तिक शुद्ध द्वादशीला तुळशीचा विवाह शाळीग्रामासोबत. विवाह हंगामाची सुरुवात.",
    descEn: "Marriage of Tulsi with Shaligram on Kartik Shudha Dwadashi. Marks beginning of wedding season.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["तुळशी सजावट", "शाळीग्राम पूजा", "लग्न विधी", "आरती", "प्रसाद"],
    includesEn: ["Tulsi decoration", "Shaligram Puja", "Marriage rituals", "Aarti", "Prasad"],
  },

  // ── संस्कार विधी (additional) ──
  {
    id: "annaprashan",
    nameMr: "अन्नप्राशन / पहिला घास",
    nameEn: "Annaprashan / First Rice Feeding",
    icon: "🍚",
    category: "sanskar",
    descMr: "बाळाला प्रथम अन्न भरवण्याचा संस्कार. साधारणतः ६व्या महिन्यात केला जातो.",
    descEn: "Ceremony of feeding the baby solid food for the first time. Usually done in the 6th month.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["गणपती पूजा", "अन्न भरवणे विधी", "आशीर्वाद", "भविष्य निवड (वस्तू ठेवणे)", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Feeding ritual", "Blessings", "Future selection (object picking)", "Prasad"],
  },
  {
    id: "karnavedh",
    nameMr: "कर्णवेध संस्कार",
    nameEn: "Karnavedh (Ear Piercing) Ceremony",
    icon: "👂",
    category: "sanskar",
    descMr: "बाळाचे कान टोचण्याचा विधी. शुभ मुहूर्तावर विधिवत केला जातो.",
    descEn: "Ritualistic ear piercing ceremony for the child. Done at an auspicious muhurat.",
    durationMr: "१ तास",
    durationEn: "1 hour",
    includesMr: ["गणपती पूजा", "शुभ मुहूर्त", "कर्णवेध विधी", "आशीर्वाद", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Auspicious muhurat", "Ear piercing ritual", "Blessings", "Prasad"],
  },
  {
    id: "vidyarambh",
    nameMr: "विद्यारंभ संस्कार",
    nameEn: "Vidyarambh (Education Beginning)",
    icon: "📚",
    category: "sanskar",
    descMr: "बाळाच्या शिक्षणाची विधिवत सुरुवात. पाटीवर पहिले अक्षर लिहिणे. सरस्वती पूजा.",
    descEn: "Ritualistic beginning of child's education. Writing first letter on slate. Saraswati Puja.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["सरस्वती पूजा", "गणपती पूजा", "पहिले अक्षर लेखन", "गुरू आशीर्वाद", "प्रसाद"],
    includesEn: ["Saraswati Puja", "Ganpati Puja", "First letter writing", "Guru blessings", "Prasad"],
  },
  {
    id: "vahan-puja",
    nameMr: "वाहन पूजा",
    nameEn: "New Vehicle Puja",
    icon: "🚗",
    category: "sanskar",
    descMr: "नवीन वाहन (कार, बाइक) खरेदी केल्यावर पूजा. सुरक्षित प्रवासासाठी देवाचा आशीर्वाद.",
    descEn: "Puja after purchasing new vehicle (car, bike). God's blessings for safe travel.",
    durationMr: "३०-४५ मिनिटे",
    durationEn: "30-45 minutes",
    includesMr: ["गणपती पूजा", "नारळ फोडणे", "लिंबू-मिरची", "आरती", "प्रसाद"],
    includesEn: ["Ganpati Puja", "Coconut breaking", "Lemon-chilli", "Aarti", "Prasad"],
  },
  {
    id: "shop-office-opening",
    nameMr: "दुकान / ऑफिस उद्घाटन पूजा",
    nameEn: "Shop / Office Opening Puja",
    icon: "🏪",
    category: "sanskar",
    descMr: "नवीन व्यवसाय, दुकान किंवा कार्यालय सुरू करताना शुभ मुहूर्तावर पूजा. व्यवसायाची भरभराट.",
    descEn: "Puja at auspicious muhurat when starting new business, shop or office. Business prosperity.",
    durationMr: "१-२ तास",
    durationEn: "1-2 hours",
    includesMr: ["गणपती स्थापना", "लक्ष्मी पूजा", "हवन", "नारळ फोडणे", "प्रसाद वाटप"],
    includesEn: ["Ganpati Sthapana", "Lakshmi Puja", "Havan", "Coconut breaking", "Prasad distribution"],
  },

  // ── शांती व पाठ (additional) ──
  {
    id: "ayushya-hom",
    nameMr: "आयुष्य होम",
    nameEn: "Ayushya Hom",
    icon: "🔥",
    category: "shanti",
    descMr: "दीर्घायुष्य आणि आरोग्यासाठी विशेष हवन. बाळाच्या जन्मानंतर किंवा वयोवृद्धांसाठी.",
    descEn: "Special havan for longevity and health. After child's birth or for elderly persons.",
    durationMr: "२-३ तास",
    durationEn: "2-3 hours",
    includesMr: ["आयुष्य सूक्त पाठ", "मृत्युंजय मंत्र", "होम", "औषधी आहुती", "प्रसाद"],
    includesEn: ["Ayushya Sukta recitation", "Mrityunjay mantra", "Hom", "Herbal offerings", "Prasad"],
  },
  {
    id: "chandi-path",
    nameMr: "चंडी पाठ",
    nameEn: "Chandi Path",
    icon: "📖",
    category: "shanti",
    descMr: "देवी चंडिकेचा पाठ. शत्रूनाश, विघ्ननाश आणि संकटनिवारणासाठी अत्यंत प्रभावी.",
    descEn: "Recitation of Goddess Chandika. Extremely effective for destroying enemies, obstacles and crises.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["चंडी पाठ", "देवी पूजा", "हवन", "कुमारिका पूजा", "नैवेद्य"],
    includesEn: ["Chandi Path recitation", "Devi Puja", "Havan", "Kumarika Puja", "Naivedya"],
  },
  {
    id: "bhagwat-saptah",
    nameMr: "श्रीमद्भागवत सप्ताह",
    nameEn: "Shrimad Bhagwat Saptah",
    icon: "📖",
    category: "shanti",
    descMr: "भगवान श्रीकृष्णाच्या लीलांचे ७ दिवसांचे पारायण. मोक्ष, भक्ती आणि ज्ञान प्राप्ती.",
    descEn: "7-day recitation of Lord Krishna's divine play. Attainment of liberation, devotion and knowledge.",
    durationMr: "७ दिवस",
    durationEn: "7 days",
    includesMr: ["भागवत कथा (७ दिवस)", "विष्णू/कृष्ण पूजा", "आरती", "प्रसाद", "ब्राह्मण भोजन"],
    includesEn: ["Bhagwat Katha (7 days)", "Vishnu/Krishna Puja", "Aarti", "Prasad", "Brahmin bhojan"],
  },
  {
    id: "ramayan-parayan",
    nameMr: "रामायण पारायण",
    nameEn: "Ramayan Parayan",
    icon: "📖",
    category: "shanti",
    descMr: "संपूर्ण रामायणाचे पारायण. कुटुंबात शांती, सुख, एकोपा. रामनवमीला विशेष.",
    descEn: "Complete Ramayan recitation. Family peace, happiness, harmony. Special on Ram Navami.",
    durationMr: "७-९ दिवस",
    durationEn: "7-9 days",
    includesMr: ["रामायण पारायण", "राम पूजा", "हनुमान पूजा", "आरती", "प्रसाद"],
    includesEn: ["Ramayan recitation", "Ram Puja", "Hanuman Puja", "Aarti", "Prasad"],
  },
  {
    id: "vishnu-yagna",
    nameMr: "विष्णु यज्ञ",
    nameEn: "Vishnu Yagna",
    icon: "🔥",
    category: "shanti",
    descMr: "भगवान विष्णूंची प्रसन्नता आणि आशीर्वादासाठी यज्ञ. समृद्धी, रक्षण आणि शांती.",
    descEn: "Yagna for Lord Vishnu's blessings. Prosperity, protection and peace.",
    durationMr: "३-४ तास",
    durationEn: "3-4 hours",
    includesMr: ["विष्णू सहस्रनाम", "होम/यज्ञ", "तुळशी अर्पण", "पूर्णाहुती", "प्रसाद"],
    includesEn: ["Vishnu Sahasranama", "Hom/Yagna", "Tulsi offering", "Purnahuti", "Prasad"],
  },

  // ── विशेष पूजा (Special) ──
  {
    id: "navratri-ghatsthapana",
    nameMr: "नवरात्री घटस्थापना",
    nameEn: "Navratri Ghatsthapana",
    icon: "🪔",
    category: "special",
    descMr: "नवरात्रीची विधिवत सुरुवात. कलश स्थापना, अखंड ज्योत, ९ दिवस देवी पूजा.",
    descEn: "Ritualistic beginning of Navratri. Kalash Sthapana, eternal flame, 9 days Devi Puja.",
    durationMr: "१-२ तास (स्थापना) + ९ दिवस",
    durationEn: "1-2 hours (setup) + 9 days",
    includesMr: ["कलश स्थापना", "अखंड ज्योत प्रतिष्ठापना", "देवी पूजा (९ दिवस)", "हवन (अष्टमी/नवमी)", "कुमारिका पूजा"],
    includesEn: ["Kalash Sthapana", "Eternal flame setup", "Devi Puja (9 days)", "Havan (Ashtami/Navami)", "Kumarika Puja"],
  },
  {
    id: "ganpati-sthapana-visarjan",
    nameMr: "गणपती स्थापना व विसर्जन",
    nameEn: "Ganpati Sthapana & Visarjan",
    icon: "🐘",
    category: "special",
    descMr: "गणेश चतुर्थीला गणपती स्थापना, रोज पूजा-आरती, आणि विसर्जन विधी.",
    descEn: "Ganpati installation on Ganesh Chaturthi, daily puja-aarti, and immersion rituals.",
    durationMr: "१.५ दिवस / ५ / ७ / १० दिवस",
    durationEn: "1.5 / 5 / 7 / 10 days",
    includesMr: ["प्राणप्रतिष्ठा", "अथर्वशीर्ष पाठ", "दररोज पूजा-आरती", "मोदक नैवेद्य", "उत्तरपूजा व विसर्जन"],
    includesEn: ["Pran Pratishtha", "Atharvashirsha recitation", "Daily puja-aarti", "Modak Naivedya", "Uttar Puja & Visarjan"],
  },
  {
    id: "mahashivratri-puja",
    nameMr: "महाशिवरात्री पूजा",
    nameEn: "Mahashivratri Puja",
    icon: "🔱",
    category: "special",
    descMr: "महाशिवरात्रीला चार प्रहरांची पूजा. रात्रभर जागरण, अभिषेक, बिल्वपत्र अर्पण.",
    descEn: "Four-prahara puja on Mahashivratri. Night-long vigil, abhishek, bilva leaf offering.",
    durationMr: "रात्रभर (४ प्रहर)",
    durationEn: "Overnight (4 Prahars)",
    includesMr: ["चार प्रहर पूजा", "शिवलिंग अभिषेक (प्रत्येक प्रहरी)", "रुद्राष्टाध्यायी पाठ", "बिल्वपत्र अर्पण", "महानैवेद्य"],
    includesEn: ["Four Prahar Puja", "Shivlinga Abhishek (each prahar)", "Rudrashtadhyayi recitation", "Bilva leaf offering", "Maha Naivedya"],
  },
  {
    id: "diwali-laxmi-puja",
    nameMr: "दिवाळी लक्ष्मी पूजा",
    nameEn: "Diwali Lakshmi Puja",
    icon: "🪔",
    category: "special",
    descMr: "दिवाळीच्या लक्ष्मी पूजनाची विधी. लक्ष्मी-गणपती-सरस्वती-कुबेर पूजा. आर्थिक समृद्धीसाठी.",
    descEn: "Diwali Lakshmi Pujan rituals. Lakshmi-Ganpati-Saraswati-Kuber Puja. For financial prosperity.",
    durationMr: "१.५-२ तास",
    durationEn: "1.5-2 hours",
    includesMr: ["लक्ष्मी-गणपती पूजा", "कुबेर पूजा", "श्री सूक्त पाठ", "दीपोत्सव", "प्रसाद"],
    includesEn: ["Lakshmi-Ganpati Puja", "Kuber Puja", "Shri Sukta recitation", "Deepotsav", "Prasad"],
  },
];

export default function PoojaServicesPageClient() {
  const { t, lang } = useLang();
  const isMr = lang === "mr";
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupSubject, setPopupSubject] = useState("");

  const openEnquiry = (subject: string) => {
    setPopupSubject(subject);
    setPopupOpen(true);
  };

  const filtered = SERVICES.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      s.nameEn.toLowerCase().includes(q) ||
      s.nameMr.includes(q) ||
      s.descEn.toLowerCase().includes(q) ||
      s.descMr.includes(q);
    const matchesCategory = !categoryFilter || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={{
        ...serviceSchema({ name: "Pooja Services — पूजा सेवा", description: "Book authentic Vedic pooja, path & ritual services in Pune. Satyanarayan Puja, Griha Shanti, Navgraha Shanti, Rudrabhishek, Vastu Puja performed by experienced priests.", url: "https://bhaagyavedh.com/pooja-services" }),
        offers: { "@type": "AggregateOffer", lowPrice: "0", highPrice: "199", priceCurrency: "INR", availability: "https://schema.org/InStock" },
      }} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://bhaagyavedh.com" }, { name: "Pooja Services", url: "https://bhaagyavedh.com/pooja-services" }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("पूजा, पाठ व कर्मकांड सेवा", "Pooja, Path & Ritual Services")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t(
              "वास्तुशांती, गृहप्रवेश, सत्यनारायण, लग्नविधी, हवन, दोष निवारण — सर्व धार्मिक विधींची माहिती.",
              "Vastushanti, Gruhapravesh, Satyanarayan, Wedding, Havan, Dosha Nivaran — all ritual services info."
            )}
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("पूजा शोधा...", "Search pooja...")}
              className="w-full rounded-lg border border-[#d4a843]/30 bg-white px-4 py-2.5 text-sm text-[#3d0c0c] placeholder:text-[#5c1a1a]/40 focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-[#d4a843]/30 bg-white px-4 py-2.5 text-sm text-[#3d0c0c] focus:border-[#d4a843] focus:outline-none focus:ring-1 focus:ring-[#d4a843]/50"
          >
            <option value="">{t("सर्व पूजा प्रकार", "All Pooja Types")}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{t(cat.mr, cat.en)}</option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${!categoryFilter ? "bg-[#3d0c0c] text-[#d4a843]" : "bg-white text-[#5c1a1a]/70 border border-[#d4a843]/20 hover:bg-[#FFF8E7]"}`}
          >
            {t("सर्व", "All")} ({SERVICES.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = SERVICES.filter(s => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id === categoryFilter ? "" : cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${categoryFilter === cat.id ? "bg-[#3d0c0c] text-[#d4a843]" : "bg-white text-[#5c1a1a]/70 border border-[#d4a843]/20 hover:bg-[#FFF8E7]"}`}
              >
                {t(cat.mr, cat.en)} ({count})
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-[#5c1a1a]/60 mb-4">
          {t(`${filtered.length} पूजा सेवा`, `${filtered.length} pooja services`)}
        </p>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-[#d4a843]/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {/* Card Header */}
              <div className="px-5 pt-5 pb-3 flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-2xl"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-[#3d0c0c] leading-tight">
                    {t(s.nameMr, s.nameEn)}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FFF8E7] text-[#5c1a1a] border border-[#d4a843]/20">
                      {t(CATEGORIES.find(c => c.id === s.category)?.mr || "", CATEGORIES.find(c => c.id === s.category)?.en || "")}
                    </span>
                    <span className="text-xs text-[#5c1a1a]/50">
                      {t(s.durationMr, s.durationEn)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 pb-3">
                <p className="text-sm text-[#5c1a1a]/70 leading-relaxed">
                  {t(s.descMr, s.descEn)}
                </p>
              </div>

              {/* What's included */}
              <div className="px-5 pb-4 flex-1">
                <p className="text-xs font-semibold text-[#3d0c0c] mb-1.5">{t("यात समाविष्ट", "Includes")}</p>
                <ul className="space-y-1">
                  {(isMr ? s.includesMr : s.includesEn).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-[#5c1a1a]/60">
                      <span className="text-[#d4a843] mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => openEnquiry(t(s.nameMr, s.nameEn))}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition hover:opacity-90 cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}
                >
                  {t("चौकशी करा", "Enquire Now")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[#5c1a1a]/60">
              {t("कोणतीही पूजा सापडली नाही. शोध बदला.", "No pooja found. Try a different search.")}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-[#FFF8E7] border border-[#d4a843]/20 text-xs text-[#5c1a1a]/60 text-center">
          {t(
            "सूचना: पूजा सामग्री, पुरोहित शुल्क आणि वेळ स्थान/शहरानुसार बदलू शकतात. अधिक माहितीसाठी संपर्क करा.",
            "Note: Pooja materials, purohit fees and timings may vary by location. Contact us for more details."
          )}
        </div>
      </div>
      <EnquiryPopup open={popupOpen} onClose={() => setPopupOpen(false)} subject={popupSubject} />
    </div>
  );
}
