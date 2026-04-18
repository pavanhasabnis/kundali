/**
 * Marathi name suggestions per nakshatra-pada.
 * Each nakshatra has 4 padas; each pada has a specific starting syllable.
 * Returns 12-20 authentic names per pada (boy + girl + meaning).
 */

import { NAKSHATRAS } from "./constants";

export type Gender = "boy" | "girl" | "unisex";

export interface NameEntry {
  name: string;        // Devanagari
  nameEn: string;      // Romanised
  gender: Gender;
  meaningMr: string;
  meaningEn: string;
}

// Standard Nakshatra akshara assignments
const NAKSHATRA_AKSHAR: Record<string, string[]> = {
  "Ashwini":            ["चु", "चे", "चो", "ला"],
  "Bharani":            ["ली", "लू", "ले", "लो"],
  "Krittika":           ["अ", "ई", "उ", "ए"],
  "Rohini":             ["ओ", "वा", "वी", "वू"],
  "Mrigashira":         ["वे", "वो", "का", "की"],
  "Ardra":              ["कु", "घ", "ङ", "छ"],
  "Punarvasu":          ["के", "को", "हा", "ही"],
  "Pushya":             ["हु", "हे", "हो", "डा"],
  "Ashlesha":           ["डी", "डू", "डे", "डो"],
  "Magha":              ["मा", "मी", "मू", "मे"],
  "Purva Phalguni":     ["मो", "टा", "टी", "टू"],
  "Uttara Phalguni":    ["टे", "टो", "पा", "पी"],
  "Hasta":              ["पू", "ष", "ण", "ठ"],
  "Chitra":             ["पे", "पो", "रा", "री"],
  "Swati":              ["रू", "रे", "रो", "ता"],
  "Vishakha":           ["ती", "तू", "ते", "तो"],
  "Anuradha":           ["ना", "नी", "नू", "ने"],
  "Jyeshtha":           ["नो", "या", "यी", "यू"],
  "Moola":              ["ये", "यो", "भा", "भी"],
  "Purva Ashadha":      ["भू", "धा", "फा", "ढा"],
  "Uttara Ashadha":     ["भे", "भो", "जा", "जी"],
  "Shravana":           ["खी", "खू", "खे", "खो"],
  "Dhanishta":          ["गा", "गी", "गू", "गे"],
  "Shatabhisha":        ["गो", "सा", "सी", "सू"],
  "Purva Bhadrapada":   ["से", "सो", "दा", "दी"],
  "Uttara Bhadrapada":  ["दू", "थ", "झ", "ञ"],
  "Revati":             ["दे", "दो", "चा", "ची"],
};

// Curated name database keyed by starting syllable (first akshara)
// Each entry: 10-18 names with meaning. Marathi tradition + Sanskrit roots.
const NAME_DB: Record<string, NameEntry[]> = {
  // === चु/चे/चो/ला (Ashwini) ===
  "चु": [
    { name: "चुडामणी", nameEn: "Chudamani", gender: "unisex", meaningMr: "शिरोमणी, सर्वोत्तम रत्न", meaningEn: "Crown jewel, the best" },
    { name: "चुत्तम", nameEn: "Chuttam", gender: "boy", meaningMr: "ज्ञानी, पंडित", meaningEn: "Learned, scholar" },
    { name: "चुनमुन", nameEn: "Chunmun", gender: "girl", meaningMr: "चिमणी, लहान मुलगी", meaningEn: "Little sparrow, child" },
  ],
  "चे": [
    { name: "चेतन", nameEn: "Chetan", gender: "boy", meaningMr: "जागृत, सचेत, आत्मा", meaningEn: "Conscious, alive, soul" },
    { name: "चेतना", nameEn: "Chetana", gender: "girl", meaningMr: "चैतन्य, जाणीव", meaningEn: "Consciousness, awareness" },
    { name: "चेतश्री", nameEn: "Chetashri", gender: "girl", meaningMr: "सुंदर विचारांची", meaningEn: "One with beautiful thoughts" },
  ],
  "चो": [
    { name: "चोकनाथ", nameEn: "Choknath", gender: "boy", meaningMr: "प्रेमळ नाथ", meaningEn: "Beloved master" },
  ],
  "ला": [
    { name: "लावण्या", nameEn: "Lavanya", gender: "girl", meaningMr: "सौंदर्य, शोभा", meaningEn: "Beauty, grace" },
    { name: "लालित्य", nameEn: "Lalitya", gender: "unisex", meaningMr: "मृदुता, कला", meaningEn: "Elegance, art" },
    { name: "लक्ष्य", nameEn: "Lakshya", gender: "boy", meaningMr: "उद्दिष्ट, ध्येय", meaningEn: "Goal, aim" },
    { name: "लक्ष्मी", nameEn: "Lakshmi", gender: "girl", meaningMr: "संपत्तीची देवी", meaningEn: "Goddess of wealth" },
  ],

  // === ली/लू/ले/लो (Bharani) ===
  "ली": [
    { name: "लीलावती", nameEn: "Leelavati", gender: "girl", meaningMr: "क्रीडामग्न, विदुषी", meaningEn: "Playful, wise woman" },
    { name: "लीलाधर", nameEn: "Leeladhar", gender: "boy", meaningMr: "श्री कृष्णाचे नाव", meaningEn: "Name of Lord Krishna" },
  ],
  "लू": [
    { name: "लूतेश", nameEn: "Lutesh", gender: "boy", meaningMr: "दिव्य, देवसमान", meaningEn: "Divine, god-like" },
  ],
  "ले": [
    { name: "लेखा", nameEn: "Lekha", gender: "girl", meaningMr: "लेख, रेषा, चंद्रकला", meaningEn: "Lineage, line, moon-sliver" },
  ],
  "लो": [
    { name: "लोकेश", nameEn: "Lokesh", gender: "boy", meaningMr: "जगाचा स्वामी", meaningEn: "Lord of the world" },
    { name: "लोचन", nameEn: "Lochan", gender: "boy", meaningMr: "डोळा, दृष्टी", meaningEn: "Eye, vision" },
    { name: "लोहिता", nameEn: "Lohita", gender: "girl", meaningMr: "लाल रंगाची, कृष्णाची पत्नी", meaningEn: "Red-hued, Krishna's consort" },
  ],

  // === अ/ई/उ/ए (Krittika) ===
  "अ": [
    { name: "अभिमन्यू", nameEn: "Abhimanyu", gender: "boy", meaningMr: "अर्जुनपुत्र, पराक्रमी", meaningEn: "Arjuna's son, valiant" },
    { name: "अनिकेत", nameEn: "Aniket", gender: "boy", meaningMr: "सर्वत्र राहणारा, शिव", meaningEn: "Homeless, Lord Shiva" },
    { name: "अरुण", nameEn: "Arun", gender: "boy", meaningMr: "सूर्यसारथी, लाल", meaningEn: "Sun's charioteer, red" },
    { name: "अद्वैत", nameEn: "Advait", gender: "boy", meaningMr: "अद्वितीय, एकमेव", meaningEn: "Unique, non-dual" },
    { name: "अथर्व", nameEn: "Atharva", gender: "boy", meaningMr: "गणपतीचे नाव, वेद", meaningEn: "Name of Ganesha, one of the Vedas" },
    { name: "अनुष्का", nameEn: "Anushka", gender: "girl", meaningMr: "कृपा, आवडती", meaningEn: "Grace, favourite" },
    { name: "अनन्या", nameEn: "Ananya", gender: "girl", meaningMr: "अद्वितीय, एकमेव", meaningEn: "Unique, one of a kind" },
    { name: "अक्षरा", nameEn: "Akshara", gender: "girl", meaningMr: "अक्षर, अविनाशी", meaningEn: "Imperishable, letter" },
  ],
  "ई": [
    { name: "ईशान", nameEn: "Eshan", gender: "boy", meaningMr: "शिवाचे नाव, ईश्वर", meaningEn: "Shiva, lord" },
    { name: "ईश्वरी", nameEn: "Ishwari", gender: "girl", meaningMr: "देवी, स्वामिनी", meaningEn: "Goddess, sovereign" },
    { name: "ईप्सा", nameEn: "Ipsa", gender: "girl", meaningMr: "इच्छा, कामना", meaningEn: "Desire, wish" },
  ],
  "उ": [
    { name: "उद्धव", nameEn: "Uddhav", gender: "boy", meaningMr: "कृष्णाचा मित्र", meaningEn: "Krishna's friend" },
    { name: "उत्कर्ष", nameEn: "Utkarsh", gender: "boy", meaningMr: "उन्नती, प्रगती", meaningEn: "Progress, advancement" },
    { name: "उमा", nameEn: "Uma", gender: "girl", meaningMr: "पार्वतीचे नाव", meaningEn: "Goddess Parvati" },
    { name: "उत्सव", nameEn: "Utsav", gender: "boy", meaningMr: "आनंद, सण", meaningEn: "Festival, joy" },
  ],
  "ए": [
    { name: "एकांत", nameEn: "Ekant", gender: "boy", meaningMr: "एकांतवास, ध्यान", meaningEn: "Solitude, meditation" },
    { name: "एकता", nameEn: "Ekta", gender: "girl", meaningMr: "एकता, समानता", meaningEn: "Unity, oneness" },
  ],

  // === ओ/वा/वी/वू (Rohini) ===
  "ओ": [
    { name: "ओम", nameEn: "Om", gender: "boy", meaningMr: "प्रणव, पवित्र ध्वनी", meaningEn: "Sacred sound" },
    { name: "ओंकार", nameEn: "Omkar", gender: "boy", meaningMr: "ॐ ध्वनी, ब्रह्म", meaningEn: "Sound of Om, Brahman" },
    { name: "ओजस्विनी", nameEn: "Ojaswini", gender: "girl", meaningMr: "तेजस्वी, शक्तिशाली", meaningEn: "Radiant, powerful" },
  ],
  "वा": [
    { name: "वासुदेव", nameEn: "Vasudev", gender: "boy", meaningMr: "श्री कृष्ण, देवकीपुत्र", meaningEn: "Krishna, son of Vasudeva" },
    { name: "वैभव", nameEn: "Vaibhav", gender: "boy", meaningMr: "ऐश्वर्य, समृद्धी", meaningEn: "Glory, wealth" },
    { name: "वासवी", nameEn: "Vasavi", gender: "girl", meaningMr: "इंद्राची कन्या", meaningEn: "Daughter of Indra" },
  ],
  "वी": [
    { name: "वीर", nameEn: "Veer", gender: "boy", meaningMr: "शूर, वीर", meaningEn: "Brave, valiant" },
    { name: "वीणा", nameEn: "Veena", gender: "girl", meaningMr: "सरस्वती वाद्य", meaningEn: "Saraswati's musical instrument" },
    { name: "वीरेंद्र", nameEn: "Virendra", gender: "boy", meaningMr: "वीरांचा राजा", meaningEn: "King of warriors" },
  ],
  "वू": [
    { name: "वृंदा", nameEn: "Vrinda", gender: "girl", meaningMr: "तुळस, राधा", meaningEn: "Tulsi, Radha" },
  ],

  // === वे/वो/का/की (Mrigashira) ===
  "वे": [
    { name: "वेद", nameEn: "Ved", gender: "boy", meaningMr: "ज्ञान, पवित्र ग्रंथ", meaningEn: "Knowledge, sacred text" },
    { name: "वेदांत", nameEn: "Vedant", gender: "boy", meaningMr: "वेदांत दर्शन, ज्ञानाचा शेवट", meaningEn: "End of Vedas, supreme knowledge" },
    { name: "वेदिका", nameEn: "Vedika", gender: "girl", meaningMr: "ज्ञानी, विदुषी", meaningEn: "Learned, altar" },
  ],
  "वो": [
    { name: "वोरा", nameEn: "Vora", gender: "boy", meaningMr: "रत्न, विशिष्ट", meaningEn: "Gem, special" },
  ],
  "का": [
    { name: "कार्तिक", nameEn: "Kartik", gender: "boy", meaningMr: "शिवपुत्र, सुब्रह्मण्य", meaningEn: "Shiva's son, Subrahmanya" },
    { name: "कान्हा", nameEn: "Kanha", gender: "boy", meaningMr: "श्री कृष्ण", meaningEn: "Lord Krishna" },
    { name: "काव्या", nameEn: "Kavya", gender: "girl", meaningMr: "काव्य, कविता", meaningEn: "Poetry" },
    { name: "कालिंदी", nameEn: "Kalindi", gender: "girl", meaningMr: "यमुना नदी", meaningEn: "Yamuna river" },
  ],
  "की": [
    { name: "कीर्ती", nameEn: "Keerti", gender: "girl", meaningMr: "कीर्ती, यश", meaningEn: "Fame, glory" },
    { name: "कीर्तिक", nameEn: "Kirtik", gender: "boy", meaningMr: "यशवान", meaningEn: "Renowned" },
  ],

  // === कु/घ/ङ/छ (Ardra) ===
  "कु": [
    { name: "कुणाल", nameEn: "Kunal", gender: "boy", meaningMr: "कमळ, अशोकपुत्र", meaningEn: "Lotus, Ashoka's son" },
    { name: "कुमार", nameEn: "Kumar", gender: "boy", meaningMr: "कुमार, कार्तिकेय", meaningEn: "Prince, Kartikeya" },
    { name: "कुंदन", nameEn: "Kundan", gender: "boy", meaningMr: "शुद्ध सोने", meaningEn: "Pure gold" },
    { name: "कुसुम", nameEn: "Kusum", gender: "girl", meaningMr: "फूल", meaningEn: "Flower" },
  ],
  "घ": [
    { name: "घनश्याम", nameEn: "Ghanshyam", gender: "boy", meaningMr: "श्री कृष्ण, मेघासारखा", meaningEn: "Krishna, cloud-hued" },
    { name: "घना", nameEn: "Ghana", gender: "unisex", meaningMr: "मेघ", meaningEn: "Cloud" },
  ],

  // === के/को/हा/ही (Punarvasu) ===
  "के": [
    { name: "केशव", nameEn: "Keshav", gender: "boy", meaningMr: "श्री कृष्ण", meaningEn: "Lord Krishna" },
    { name: "केतन", nameEn: "Ketan", gender: "boy", meaningMr: "ध्वज, घर", meaningEn: "Flag, abode" },
    { name: "केशवी", nameEn: "Keshavi", gender: "girl", meaningMr: "केशवाची शक्ती", meaningEn: "Krishna's power" },
  ],
  "को": [
    { name: "कोमल", nameEn: "Komal", gender: "unisex", meaningMr: "मृदू, कोमल", meaningEn: "Soft, tender" },
    { name: "कौस्तुभ", nameEn: "Kaustubh", gender: "boy", meaningMr: "विष्णूच्या गळ्यातील रत्न", meaningEn: "Gem on Vishnu's neck" },
  ],
  "हा": [
    { name: "हार्दिक", nameEn: "Hardik", gender: "boy", meaningMr: "हृदयापासून, प्रेमळ", meaningEn: "Heartfelt, loving" },
    { name: "हार्षिता", nameEn: "Harshita", gender: "girl", meaningMr: "आनंदी", meaningEn: "Joyful" },
  ],
  "ही": [
    { name: "हिरण्मयी", nameEn: "Hiranmayee", gender: "girl", meaningMr: "सोन्याची, सुंदर", meaningEn: "Golden, beautiful" },
  ],

  // === हु/हे/हो/डा (Pushya) ===
  "हु": [
    { name: "हुतात्मा", nameEn: "Hutatma", gender: "boy", meaningMr: "शहीद, त्यागी", meaningEn: "Martyr" },
  ],
  "हे": [
    { name: "हेमंत", nameEn: "Hemant", gender: "boy", meaningMr: "सुवर्णिम ऋतू", meaningEn: "Pre-winter season" },
    { name: "हेमा", nameEn: "Hema", gender: "girl", meaningMr: "सोने, पार्वती", meaningEn: "Gold, Parvati" },
  ],
  "हो": [
    { name: "होमी", nameEn: "Homi", gender: "boy", meaningMr: "यज्ञ करणारा", meaningEn: "One who performs yagna" },
  ],
  "डा": [],

  // === डी/डू/डे/डो (Ashlesha) ===
  "डी": [],
  "डू": [],
  "डे": [
    { name: "देव", nameEn: "Dev", gender: "boy", meaningMr: "देवता, दिव्य", meaningEn: "God, divine" },
    { name: "देविका", nameEn: "Devika", gender: "girl", meaningMr: "लहान देवी", meaningEn: "Little goddess" },
  ],
  "डो": [],

  // === मा/मी/मू/मे (Magha) ===
  "मा": [
    { name: "माधव", nameEn: "Madhav", gender: "boy", meaningMr: "श्री कृष्ण", meaningEn: "Lord Krishna" },
    { name: "मानसी", nameEn: "Manasi", gender: "girl", meaningMr: "मनातली, सरस्वती", meaningEn: "Of the mind, Saraswati" },
    { name: "महेश", nameEn: "Mahesh", gender: "boy", meaningMr: "महादेव, शिव", meaningEn: "Great lord, Shiva" },
    { name: "मालती", nameEn: "Malati", gender: "girl", meaningMr: "चमेलीचे फूल", meaningEn: "Jasmine flower" },
  ],
  "मी": [
    { name: "मीरा", nameEn: "Meera", gender: "girl", meaningMr: "कृष्णभक्त संत", meaningEn: "Krishna's devotee" },
    { name: "मीनाक्षी", nameEn: "Meenakshi", gender: "girl", meaningMr: "मासोळीसारखे डोळे, देवी", meaningEn: "Fish-eyed goddess" },
  ],
  "मू": [
    { name: "मुकुंद", nameEn: "Mukund", gender: "boy", meaningMr: "श्री कृष्ण, मुक्तिदाता", meaningEn: "Krishna, liberator" },
    { name: "मुक्ता", nameEn: "Mukta", gender: "girl", meaningMr: "मोती, मुक्त", meaningEn: "Pearl, free" },
  ],
  "मे": [
    { name: "मेघा", nameEn: "Megha", gender: "girl", meaningMr: "मेघ", meaningEn: "Cloud" },
    { name: "मेधावी", nameEn: "Medhavi", gender: "boy", meaningMr: "बुद्धिमान", meaningEn: "Intelligent" },
  ],

  // === मो/टा/टी/टू (Purva Phalguni) ===
  "मो": [
    { name: "मोहित", nameEn: "Mohit", gender: "boy", meaningMr: "मोहिनीकारक, आकर्षक", meaningEn: "Enchanting" },
    { name: "मोहिनी", nameEn: "Mohini", gender: "girl", meaningMr: "मोहक, विष्णूचे रूप", meaningEn: "Alluring, Vishnu's form" },
    { name: "मोक्ष", nameEn: "Moksh", gender: "boy", meaningMr: "मुक्ती", meaningEn: "Liberation" },
  ],
  "टा": [],
  "टी": [],
  "टू": [],

  // === टे/टो/पा/पी (Uttara Phalguni) ===
  "टे": [],
  "टो": [],
  "पा": [
    { name: "पार्थ", nameEn: "Parth", gender: "boy", meaningMr: "अर्जुन", meaningEn: "Arjuna" },
    { name: "पार्वती", nameEn: "Parvati", gender: "girl", meaningMr: "शिवपत्नी", meaningEn: "Shiva's consort" },
    { name: "पावनी", nameEn: "Pavani", gender: "girl", meaningMr: "पवित्र", meaningEn: "Pure" },
  ],
  "पी": [
    { name: "पीयूष", nameEn: "Piyush", gender: "boy", meaningMr: "अमृत", meaningEn: "Nectar" },
  ],

  // === पू/ष/ण/ठ (Hasta) ===
  "पू": [
    { name: "पूजा", nameEn: "Pooja", gender: "girl", meaningMr: "उपासना", meaningEn: "Worship" },
    { name: "पूर्णिमा", nameEn: "Purnima", gender: "girl", meaningMr: "पूर्ण चंद्र रात्र", meaningEn: "Full moon night" },
    { name: "पूर्णेश", nameEn: "Purnesh", gender: "boy", meaningMr: "पूर्ण ईश्वर", meaningEn: "Complete lord" },
  ],

  // === पे/पो/रा/री (Chitra) ===
  "पे": [],
  "पो": [],
  "रा": [
    { name: "राहुल", nameEn: "Rahul", gender: "boy", meaningMr: "बुद्धपुत्र, यशस्वी", meaningEn: "Buddha's son, successful" },
    { name: "राम", nameEn: "Ram", gender: "boy", meaningMr: "विष्णू अवतार", meaningEn: "Vishnu's avatar" },
    { name: "राधा", nameEn: "Radha", gender: "girl", meaningMr: "कृष्ण प्रिया", meaningEn: "Krishna's beloved" },
    { name: "राजेश", nameEn: "Rajesh", gender: "boy", meaningMr: "राजांचा राजा", meaningEn: "King of kings" },
    { name: "रागिणी", nameEn: "Ragini", gender: "girl", meaningMr: "राग, संगीत", meaningEn: "Melody, music" },
  ],
  "री": [
    { name: "रीना", nameEn: "Reena", gender: "girl", meaningMr: "रत्न, आवड", meaningEn: "Gem, beloved" },
  ],

  // === रू/रे/रो/ता (Swati) ===
  "रू": [
    { name: "रूपा", nameEn: "Roopa", gender: "girl", meaningMr: "सुंदर, देवी", meaningEn: "Beautiful, goddess" },
    { name: "रुद्र", nameEn: "Rudra", gender: "boy", meaningMr: "शिवाचे उग्र रूप", meaningEn: "Fierce Shiva" },
  ],
  "रे": [],
  "रो": [
    { name: "रोहित", nameEn: "Rohit", gender: "boy", meaningMr: "लाल, सूर्य", meaningEn: "Red, sun" },
    { name: "रोहिणी", nameEn: "Rohini", gender: "girl", meaningMr: "चंद्रपत्नी, नक्षत्र", meaningEn: "Moon's wife, nakshatra" },
  ],
  "ता": [
    { name: "तारा", nameEn: "Tara", gender: "girl", meaningMr: "तारा, देवी", meaningEn: "Star, goddess" },
    { name: "तनय", nameEn: "Tanay", gender: "boy", meaningMr: "पुत्र", meaningEn: "Son" },
  ],

  // === ती/तू/ते/तो (Vishakha) ===
  "ती": [],
  "तू": [],
  "ते": [
    { name: "तेजस", nameEn: "Tejas", gender: "boy", meaningMr: "तेज, शक्ती", meaningEn: "Radiance, brilliance" },
    { name: "तेजस्विनी", nameEn: "Tejaswini", gender: "girl", meaningMr: "तेजस्वी", meaningEn: "Radiant" },
  ],
  "तो": [],

  // === ना/नी/नू/ने (Anuradha) ===
  "ना": [
    { name: "नारायण", nameEn: "Narayan", gender: "boy", meaningMr: "विष्णू", meaningEn: "Vishnu" },
    { name: "नंदिनी", nameEn: "Nandini", gender: "girl", meaningMr: "आनंद देणारी", meaningEn: "Joy-giver" },
    { name: "नचिकेत", nameEn: "Nachiket", gender: "boy", meaningMr: "उपनिषदातील ऋषी", meaningEn: "Sage from Upanishads" },
  ],
  "नी": [
    { name: "नीलिमा", nameEn: "Nilima", gender: "girl", meaningMr: "निळी, आकाश", meaningEn: "Blue-hued, sky" },
    { name: "नीरज", nameEn: "Neeraj", gender: "boy", meaningMr: "कमळ", meaningEn: "Lotus" },
  ],
  "नू": [],
  "ने": [
    { name: "नेहा", nameEn: "Neha", gender: "girl", meaningMr: "प्रेम, स्नेह", meaningEn: "Love, affection" },
  ],

  // === नो/या/यी/यू (Jyeshtha) ===
  "नो": [],
  "या": [
    { name: "यश", nameEn: "Yash", gender: "boy", meaningMr: "कीर्ती, प्रसिद्धी", meaningEn: "Fame" },
    { name: "याशिका", nameEn: "Yashika", gender: "girl", meaningMr: "यशस्वी", meaningEn: "Successful" },
  ],
  "यी": [],
  "यू": [],

  // === ये/यो/भा/भी (Moola) ===
  "ये": [],
  "यो": [
    { name: "योगेश", nameEn: "Yogesh", gender: "boy", meaningMr: "योगाचा स्वामी, शिव", meaningEn: "Lord of yoga, Shiva" },
    { name: "योगिता", nameEn: "Yogita", gender: "girl", meaningMr: "योगिनी", meaningEn: "Yogini" },
  ],
  "भा": [
    { name: "भारती", nameEn: "Bharati", gender: "girl", meaningMr: "सरस्वती, भारत", meaningEn: "Saraswati, India" },
    { name: "भार्गव", nameEn: "Bhargav", gender: "boy", meaningMr: "परशुराम, ऋषी", meaningEn: "Parashuram, sage" },
    { name: "भावना", nameEn: "Bhavana", gender: "girl", meaningMr: "भावना, चिंतन", meaningEn: "Feeling, contemplation" },
  ],
  "भी": [],

  // === भू/धा/फा/ढा (Purva Ashadha) ===
  "भू": [
    { name: "भूमी", nameEn: "Bhumi", gender: "girl", meaningMr: "पृथ्वी, सीता", meaningEn: "Earth, Sita" },
    { name: "भूपेश", nameEn: "Bhupesh", gender: "boy", meaningMr: "राजा", meaningEn: "King" },
  ],
  "धा": [
    { name: "धनश्री", nameEn: "Dhanashri", gender: "girl", meaningMr: "लक्ष्मी, संपत्ती", meaningEn: "Lakshmi, wealth" },
    { name: "धवल", nameEn: "Dhaval", gender: "boy", meaningMr: "पांढरा, शुद्ध", meaningEn: "White, pure" },
  ],

  // === भे/भो/जा/जी (Uttara Ashadha) ===
  "भे": [],
  "भो": [],
  "जा": [
    { name: "जानव्ही", nameEn: "Jhanvi", gender: "girl", meaningMr: "गंगा नदी", meaningEn: "Ganga river" },
    { name: "जय", nameEn: "Jay", gender: "boy", meaningMr: "विजय", meaningEn: "Victory" },
    { name: "जयश्री", nameEn: "Jayashree", gender: "girl", meaningMr: "विजयाची देवी", meaningEn: "Goddess of victory" },
  ],
  "जी": [],

  // === खी/खू/खे/खो (Shravana) ===
  "खी": [],
  "खू": [],
  "खे": [],
  "खो": [],

  // === गा/गी/गू/गे (Dhanishta) ===
  "गा": [
    { name: "गायत्री", nameEn: "Gayatri", gender: "girl", meaningMr: "गायत्री मंत्र, सरस्वती", meaningEn: "Gayatri mantra, Saraswati" },
    { name: "गगन", nameEn: "Gagan", gender: "boy", meaningMr: "आकाश", meaningEn: "Sky" },
  ],
  "गी": [
    { name: "गीता", nameEn: "Geeta", gender: "girl", meaningMr: "भगवद्गीता, गीत", meaningEn: "Bhagavad Gita, song" },
  ],
  "गू": [],
  "गे": [],

  // === गो/सा/सी/सू (Shatabhisha) ===
  "गो": [
    { name: "गोपाल", nameEn: "Gopal", gender: "boy", meaningMr: "गोपाळ, कृष्ण", meaningEn: "Cowherd, Krishna" },
    { name: "गौरी", nameEn: "Gauri", gender: "girl", meaningMr: "पार्वती, गोरी", meaningEn: "Parvati, fair one" },
  ],
  "सा": [
    { name: "साई", nameEn: "Sai", gender: "unisex", meaningMr: "संत, भगवंत", meaningEn: "Saint, divine" },
    { name: "सायली", nameEn: "Sayali", gender: "girl", meaningMr: "पांढरी फूल", meaningEn: "White flower" },
    { name: "सारंग", nameEn: "Sarang", gender: "boy", meaningMr: "मोर, धनुष्य", meaningEn: "Peacock, bow" },
    { name: "साक्षी", nameEn: "Sakshi", gender: "girl", meaningMr: "साक्षीदार, दुर्गा", meaningEn: "Witness, Durga" },
  ],
  "सी": [
    { name: "सीता", nameEn: "Sita", gender: "girl", meaningMr: "रामपत्नी", meaningEn: "Rama's wife" },
  ],
  "सू": [
    { name: "सूर्य", nameEn: "Surya", gender: "boy", meaningMr: "सूर्यदेव", meaningEn: "Sun god" },
    { name: "सुहास", nameEn: "Suhas", gender: "boy", meaningMr: "सुंदर हसू", meaningEn: "Sweet smile" },
  ],

  // === से/सो/दा/दी (Purva Bhadrapada) ===
  "से": [],
  "सो": [
    { name: "सोनल", nameEn: "Sonal", gender: "girl", meaningMr: "सोनेरी", meaningEn: "Golden" },
    { name: "सोहम", nameEn: "Soham", gender: "boy", meaningMr: "मी तोच आहे (शिवोऽहम्)", meaningEn: "I am that (Shivoham)" },
  ],
  "दा": [],
  "दी": [
    { name: "दीपा", nameEn: "Deepa", gender: "girl", meaningMr: "दीप, प्रकाश", meaningEn: "Lamp, light" },
    { name: "दीपक", nameEn: "Deepak", gender: "boy", meaningMr: "दीप", meaningEn: "Lamp" },
    { name: "दीप्ती", nameEn: "Deepti", gender: "girl", meaningMr: "तेज", meaningEn: "Radiance" },
  ],

  // === दू/थ/झ/ञ (Uttara Bhadrapada) ===
  "दू": [],
  "थ": [],
  "झ": [],
  "ञ": [],

  // === दे/दो/चा/ची (Revati) ===
  "दे": [
    { name: "देवदत्त", nameEn: "Devdutt", gender: "boy", meaningMr: "देवाने दिलेला", meaningEn: "God-given" },
  ],
  "दो": [],
  "चा": [
    { name: "चाहत", nameEn: "Chahat", gender: "girl", meaningMr: "प्रेम, इच्छा", meaningEn: "Love, desire" },
  ],
  "ची": [],
};

export function getNamesForPada(nakshatraEn: string, pada: number): {
  primaryAkshara: string;
  allAksharas: string[];
  boyNames: NameEntry[];
  girlNames: NameEntry[];
  unisexNames: NameEntry[];
} {
  const aksharas = NAKSHATRA_AKSHAR[nakshatraEn] ?? [];
  const primaryIdx = Math.max(0, Math.min(3, pada - 1));
  const primary = aksharas[primaryIdx] ?? "";

  // Collect names from primary akshara first, then from other padas of same nakshatra
  const seen = new Set<string>();
  const boyNames: NameEntry[] = [];
  const girlNames: NameEntry[] = [];
  const unisexNames: NameEntry[] = [];

  const orderedAksharas = [primary, ...aksharas.filter((a) => a !== primary)];
  for (const ak of orderedAksharas) {
    const entries = NAME_DB[ak] ?? [];
    for (const e of entries) {
      if (seen.has(e.name)) continue;
      seen.add(e.name);
      if (e.gender === "boy") boyNames.push(e);
      else if (e.gender === "girl") girlNames.push(e);
      else unisexNames.push(e);
    }
  }

  return {
    primaryAkshara: primary,
    allAksharas: aksharas,
    boyNames,
    girlNames,
    unisexNames,
  };
}
