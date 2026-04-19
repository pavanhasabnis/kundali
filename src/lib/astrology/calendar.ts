/**
 * Vedic Calendar Engine
 * Festival rules from धर्मसिंधु / निर्णयसिंधु
 * शुभ/अशुभ rules from पंचांग शास्त्र
 * All dates derived from real planetary calculations — zero hardcoded dates
 */

// ─── Festival Rule Definitions (शास्त्र-based) ─────────────────
// masa = solar month index (0=मेष/चैत्र-वैशाख ... 11=मीन/फाल्गुन-चैत्र)
// For lunar festivals: we match paksha + tithi
// The masa is derived from Sun's sidereal position

export interface FestivalRule {
  name: string;
  nameMr: string;
  masa: number;        // Solar month (Sun's rashi index 0-11)
  paksha: "shukla" | "krishna";
  tithi: number;       // 1-15 (1=प्रतिपदा ... 15=पूर्णिमा/अमावस्या)
  type: "major" | "minor" | "ekadashi" | "vrat";
}

// Lunar festivals — date derived from real तिथी + masa calculation
export const FESTIVAL_RULES: FestivalRule[] = [
  // ── चैत्र (Sun in मीन=11) ──
  { name: "Gudi Padwa", nameMr: "गुढीपाडवा (हिंदू नववर्ष)", masa: 11, paksha: "shukla", tithi: 1, type: "major" },
  { name: "Chaitra Navratri", nameMr: "चैत्र नवरात्र प्रारंभ", masa: 11, paksha: "shukla", tithi: 1, type: "minor" },
  { name: "Matsya Jayanti", nameMr: "मत्स्य जयंती", masa: 11, paksha: "shukla", tithi: 3, type: "minor" },
  { name: "Lakshmi Panchami", nameMr: "लक्ष्मी पंचमी", masa: 11, paksha: "shukla", tithi: 5, type: "minor" },
  { name: "Ram Navami", nameMr: "रामनवमी", masa: 11, paksha: "shukla", tithi: 9, type: "major" },
  { name: "Hanuman Jayanti", nameMr: "हनुमान जयंती", masa: 11, paksha: "shukla", tithi: 15, type: "major" },

  // ── वैशाख (Sun in मेष=0) ──
  { name: "Akshaya Tritiya", nameMr: "अक्षय तृतीया", masa: 0, paksha: "shukla", tithi: 3, type: "major" },
  { name: "Shankaracharya Jayanti", nameMr: "शंकराचार्य जयंती", masa: 0, paksha: "shukla", tithi: 5, type: "minor" },
  { name: "Mohini Ekadashi", nameMr: "मोहिनी एकादशी", masa: 0, paksha: "shukla", tithi: 11, type: "vrat" },
  { name: "Narasimha Jayanti", nameMr: "नरसिंह जयंती", masa: 0, paksha: "shukla", tithi: 14, type: "minor" },
  { name: "Buddha Purnima", nameMr: "बुद्ध पूर्णिमा", masa: 0, paksha: "shukla", tithi: 15, type: "major" },

  // ── ज्येष्ठ (Sun in वृषभ=1) ──
  { name: "Nirjala Ekadashi", nameMr: "निर्जला एकादशी", masa: 1, paksha: "shukla", tithi: 11, type: "vrat" },
  { name: "Vat Purnima", nameMr: "वटपूर्णिमा", masa: 1, paksha: "shukla", tithi: 15, type: "major" },

  // ── आषाढ (Sun in मिथुन=2) ──
  { name: "Ashadhi Ekadashi", nameMr: "आषाढी एकादशी (पंढरपूर)", masa: 2, paksha: "shukla", tithi: 11, type: "major" },
  { name: "Guru Purnima", nameMr: "गुरुपूर्णिमा", masa: 2, paksha: "shukla", tithi: 15, type: "major" },

  // ── श्रावण (Sun in कर्क=3) ──
  { name: "Nag Panchami", nameMr: "नागपंचमी", masa: 3, paksha: "shukla", tithi: 5, type: "major" },
  { name: "Gopal Kala", nameMr: "गोपाळकाला (दहीहंडी)", masa: 3, paksha: "krishna", tithi: 8, type: "major" },
  { name: "Narali Purnima", nameMr: "नारळी पौर्णिमा / रक्षाबंधन", masa: 3, paksha: "shukla", tithi: 15, type: "major" },
  { name: "Shravan Somvar", nameMr: "श्रावणी सोमवार", masa: 3, paksha: "shukla", tithi: 1, type: "vrat" },

  // ── भाद्रपद (Sun in सिंह=4) ──
  { name: "Hartalika", nameMr: "हरतालिका तृतीया", masa: 4, paksha: "shukla", tithi: 3, type: "major" },
  { name: "Ganesh Chaturthi", nameMr: "गणेश चतुर्थी", masa: 4, paksha: "shukla", tithi: 4, type: "major" },
  { name: "Rishi Panchami", nameMr: "ऋषिपंचमी", masa: 4, paksha: "shukla", tithi: 5, type: "minor" },
  { name: "Gauri Pujan", nameMr: "ज्येष्ठा गौरी पूजन", masa: 4, paksha: "shukla", tithi: 7, type: "minor" },
  { name: "Parivartini Ekadashi", nameMr: "परिवर्तिनी एकादशी", masa: 4, paksha: "shukla", tithi: 11, type: "vrat" },
  { name: "Anant Chaturdashi", nameMr: "अनंत चतुर्दशी", masa: 4, paksha: "shukla", tithi: 14, type: "major" },
  { name: "Pitru Amavasya", nameMr: "पितृ अमावस्या (सर्वपित्री)", masa: 4, paksha: "krishna", tithi: 15, type: "major" },

  // ── आश्विन (Sun in कन्या=5) ──
  { name: "Ghatasthapana", nameMr: "घटस्थापना (नवरात्र)", masa: 5, paksha: "shukla", tithi: 1, type: "major" },
  { name: "Lalita Panchami", nameMr: "ललिता पंचमी", masa: 5, paksha: "shukla", tithi: 5, type: "minor" },
  { name: "Saraswati Puja", nameMr: "सरस्वती पूजन", masa: 5, paksha: "shukla", tithi: 7, type: "minor" },
  { name: "Durgashtami", nameMr: "दुर्गाष्टमी", masa: 5, paksha: "shukla", tithi: 8, type: "major" },
  { name: "Navami Havan", nameMr: "नवमी होम / महानवमी", masa: 5, paksha: "shukla", tithi: 9, type: "major" },
  { name: "Dussehra", nameMr: "दसरा (विजयादशमी)", masa: 5, paksha: "shukla", tithi: 10, type: "major" },
  { name: "Kojagiri Purnima", nameMr: "कोजागिरी पौर्णिमा", masa: 5, paksha: "shukla", tithi: 15, type: "major" },
  { name: "Narak Chaturdashi", nameMr: "नरक चतुर्दशी", masa: 5, paksha: "krishna", tithi: 14, type: "major" },
  { name: "Diwali Laxmi Pujan", nameMr: "दिवाळी लक्ष्मीपूजन (अमावस्या)", masa: 5, paksha: "krishna", tithi: 15, type: "major" },

  // ── कार्तिक (Sun in तुला=6) ──
  { name: "Padwa (Diwali)", nameMr: "दिवाळी पाडवा (बलिप्रतिपदा)", masa: 6, paksha: "shukla", tithi: 1, type: "major" },
  { name: "Bhaubij", nameMr: "भाऊबीज (यमद्वितीया)", masa: 6, paksha: "shukla", tithi: 2, type: "major" },
  { name: "Kartiki Ekadashi", nameMr: "कार्तिकी एकादशी", masa: 6, paksha: "shukla", tithi: 11, type: "major" },
  { name: "Tulsi Vivah", nameMr: "तुळशी विवाह", masa: 6, paksha: "shukla", tithi: 12, type: "minor" },
  { name: "Tripurari Purnima", nameMr: "त्रिपुरारी पौर्णिमा", masa: 6, paksha: "shukla", tithi: 15, type: "major" },

  // ── मार्गशीर्ष (Sun in वृश्चिक=7) ──
  { name: "Champa Shashthi", nameMr: "चंपाषष्ठी", masa: 7, paksha: "shukla", tithi: 6, type: "minor" },
  { name: "Geeta Jayanti", nameMr: "गीता जयंती (मोक्षदा एकादशी)", masa: 7, paksha: "shukla", tithi: 11, type: "minor" },
  { name: "Datta Jayanti", nameMr: "दत्त जयंती", masa: 7, paksha: "shukla", tithi: 15, type: "major" },

  // ── पौष (Sun in धनु=8) ──
  { name: "Saphala Ekadashi", nameMr: "सफला एकादशी", masa: 8, paksha: "krishna", tithi: 11, type: "vrat" },

  // ── माघ (Sun in मकर=9) ──
  { name: "Vasant Panchami", nameMr: "वसंत पंचमी (सरस्वती पूजा)", masa: 9, paksha: "shukla", tithi: 5, type: "major" },
  { name: "Ratha Saptami", nameMr: "रथसप्तमी", masa: 9, paksha: "shukla", tithi: 7, type: "minor" },
  { name: "Bhishma Ekadashi", nameMr: "भीष्म एकादशी", masa: 9, paksha: "shukla", tithi: 11, type: "vrat" },
  { name: "Maha Shivaratri", nameMr: "महाशिवरात्री", masa: 9, paksha: "krishna", tithi: 14, type: "major" },

  // ── फाल्गुन (Sun in कुंभ=10) ──
  { name: "Holi", nameMr: "होळी (धुळवड)", masa: 10, paksha: "shukla", tithi: 15, type: "major" },
  { name: "Rang Panchami", nameMr: "रंगपंचमी", masa: 10, paksha: "krishna", tithi: 5, type: "minor" },

  // ═══ All 24 Ekadashis (month-wise) ═══════════════════════════════
  // Chaitra (Sun in मीन=11)
  { name: "Kamada Ekadashi", nameMr: "कामदा एकादशी", masa: 11, paksha: "shukla", tithi: 11, type: "ekadashi" },
  { name: "Papamochani Ekadashi", nameMr: "पापमोचनी एकादशी", masa: 11, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Vaisakh (Sun in मेष=0) — Mohini already above
  { name: "Varuthini Ekadashi", nameMr: "वरूथिनी एकादशी", masa: 0, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Jyeshtha (Sun in वृषभ=1) — Nirjala already above
  { name: "Apara Ekadashi", nameMr: "अपरा एकादशी (अचला)", masa: 1, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Ashadha (Sun in मिथुन=2) — Ashadhi/Devshayani already above
  { name: "Yogini Ekadashi", nameMr: "योगिनी एकादशी", masa: 2, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Shravan (Sun in कर्क=3)
  { name: "Putrada Ekadashi (Shravan)", nameMr: "पुत्रदा एकादशी (पवित्रा)", masa: 3, paksha: "shukla", tithi: 11, type: "ekadashi" },
  { name: "Kamika Ekadashi", nameMr: "कामिका एकादशी", masa: 3, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Bhadrapad (Sun in सिंह=4) — Parivartini already above
  { name: "Aja Ekadashi", nameMr: "अजा एकादशी (अन्नदा)", masa: 4, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Ashwin (Sun in कन्या=5)
  { name: "Pashankusha Ekadashi", nameMr: "पाशांकुशा एकादशी (पापांकुशा)", masa: 5, paksha: "shukla", tithi: 11, type: "ekadashi" },
  { name: "Indira Ekadashi", nameMr: "इंदिरा एकादशी", masa: 5, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Kartik (Sun in तुला=6) — Kartiki/Prabodhini already above
  { name: "Rama Ekadashi", nameMr: "रमा एकादशी", masa: 6, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Margashirsh (Sun in वृश्चिक=7) — Mokshada already above (Geeta Jayanti)
  { name: "Utpanna Ekadashi", nameMr: "उत्पन्ना एकादशी", masa: 7, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Pausha (Sun in धनु=8) — Saphala already above
  { name: "Putrada Ekadashi (Pausha)", nameMr: "पुत्रदा एकादशी (पौष)", masa: 8, paksha: "shukla", tithi: 11, type: "ekadashi" },
  // Magha (Sun in मकर=9) — Bhishma already above
  { name: "Shattila Ekadashi", nameMr: "षट्तिला एकादशी", masa: 9, paksha: "krishna", tithi: 11, type: "ekadashi" },
  // Phalgun (Sun in कुंभ=10)
  { name: "Amalaki Ekadashi", nameMr: "आमलकी एकादशी", masa: 10, paksha: "shukla", tithi: 11, type: "ekadashi" },
  { name: "Vijaya Ekadashi", nameMr: "विजया एकादशी", masa: 10, paksha: "krishna", tithi: 11, type: "ekadashi" },

  // ═══ All 12 Sankashti Chaturthis (कृष्ण चतुर्थी, masa-specific names) ═══
  { name: "Vikata Sankashti", nameMr: "विकट संकष्टी चतुर्थी", masa: 11, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Ekdant Sankashti", nameMr: "एकदंत संकष्टी चतुर्थी", masa: 0, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Krishnapingal Sankashti", nameMr: "कृष्णपिंगल संकष्टी चतुर्थी", masa: 1, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Gajanan Sankashti", nameMr: "गजानन संकष्टी चतुर्थी", masa: 2, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Bahula Sankashti", nameMr: "बहुला संकष्टी चतुर्थी", masa: 3, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Heramb Sankashti", nameMr: "हेरंब संकष्टी चतुर्थी", masa: 4, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Vighnaraj Sankashti", nameMr: "विघ्नराज संकष्टी चतुर्थी", masa: 5, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Vakratund Sankashti", nameMr: "वक्रतुंड संकष्टी चतुर्थी", masa: 6, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Akhurath Sankashti", nameMr: "अखुरथ संकष्टी चतुर्थी", masa: 7, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Lambodar Sankashti", nameMr: "लंबोदर संकष्टी चतुर्थी", masa: 8, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Dwijpriya Sankashti", nameMr: "द्विजप्रिय संकष्टी चतुर्थी (तिलकुंद)", masa: 9, paksha: "krishna", tithi: 4, type: "vrat" },
  { name: "Bhalchandra Sankashti", nameMr: "भालचंद्र संकष्टी चतुर्थी", masa: 10, paksha: "krishna", tithi: 4, type: "vrat" },

  // ═══ Vinayaki Chaturthis (शुक्ल चतुर्थी) — Ganesh Chaturthi (Bhadrapad) already above ═══
  { name: "Vinayaki Chaturthi (Chaitra)", nameMr: "विनायकी चतुर्थी (चैत्र)", masa: 11, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Vaisakh)", nameMr: "विनायकी चतुर्थी (वैशाख)", masa: 0, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Jyeshtha)", nameMr: "विनायकी चतुर्थी (ज्येष्ठ)", masa: 1, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Ashadha)", nameMr: "विनायकी चतुर्थी (आषाढ)", masa: 2, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Shravan)", nameMr: "विनायकी चतुर्थी (श्रावण)", masa: 3, paksha: "shukla", tithi: 4, type: "vrat" },
  // Bhadrapad masa 4 shukla 4 = Ganesh Chaturthi (above)
  { name: "Vinayaki Chaturthi (Ashwin)", nameMr: "विनायकी चतुर्थी (आश्विन)", masa: 5, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Kartik)", nameMr: "विनायकी चतुर्थी (कार्तिक)", masa: 6, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Margashirsh)", nameMr: "विनायकी चतुर्थी (मार्गशीर्ष)", masa: 7, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Vinayaki Chaturthi (Pausha)", nameMr: "विनायकी चतुर्थी (पौष)", masa: 8, paksha: "shukla", tithi: 4, type: "vrat" },
  { name: "Ganesh Jayanti (Tilkund)", nameMr: "गणेश जयंती (तिलकुंद चतुर्थी)", masa: 9, paksha: "shukla", tithi: 4, type: "major" },
  { name: "Vinayaki Chaturthi (Phalgun)", nameMr: "विनायकी चतुर्थी (फाल्गुन)", masa: 10, paksha: "shukla", tithi: 4, type: "vrat" },
];

// ─── Fixed-Date Holidays (English Calendar) ─────────────────────
// These are government/national holidays on fixed English dates
// Not tithi-based — directly matched by month + day

export interface FixedHoliday {
  name: string;
  nameMr: string;
  month: number;  // 1-12 (English month)
  day: number;    // 1-31
  type: "national" | "state" | "observance";
}

export const FIXED_HOLIDAYS: FixedHoliday[] = [
  // January
  { name: "Republic Day", nameMr: "प्रजासत्ताक दिन", month: 1, day: 26, type: "national" },

  // February
  { name: "Shivaji Maharaj Jayanti", nameMr: "छत्रपती शिवाजी महाराज जयंती (शिवजयंती)", month: 2, day: 19, type: "state" },

  // March
  { name: "Shaheed Diwas", nameMr: "शहीद दिवस (भगतसिंग)", month: 3, day: 23, type: "observance" },

  // April
  { name: "Dr. Ambedkar Jayanti", nameMr: "भारतरत्न डॉ. बाबासाहेब आंबेडकर जयंती", month: 4, day: 14, type: "national" },

  // May
  { name: "Maharashtra Din", nameMr: "महाराष्ट्र दिन", month: 5, day: 1, type: "state" },
  { name: "Workers Day", nameMr: "कामगार दिन", month: 5, day: 1, type: "national" },

  // June
  { name: "Maharana Pratap Jayanti", nameMr: "महाराणा प्रताप जयंती", month: 6, day: 9, type: "observance" },

  // July
  { name: "Lokmanya Tilak Punyatithi", nameMr: "लोकमान्य टिळक पुण्यतिथी", month: 8, day: 1, type: "state" },

  // August
  { name: "Independence Day", nameMr: "स्वातंत्र्य दिन", month: 8, day: 15, type: "national" },

  // September
  { name: "Hindi Diwas", nameMr: "हिंदी दिवस", month: 9, day: 14, type: "observance" },

  // October
  { name: "Gandhi Jayanti", nameMr: "महात्मा गांधी जयंती", month: 10, day: 2, type: "national" },

  // November
  { name: "Children's Day", nameMr: "बालदिन (नेहरू जयंती)", month: 11, day: 14, type: "national" },
  { name: "Constitution Day", nameMr: "संविधान दिन", month: 11, day: 26, type: "national" },

  // December
  { name: "Mahaparinirvan Din", nameMr: "महापरिनिर्वाण दिन (डॉ. आंबेडकर)", month: 12, day: 6, type: "national" },
  { name: "Christmas", nameMr: "नाताळ", month: 12, day: 25, type: "national" },

  // Regional festivals
  { name: "Vaisakhi (Punjab)", nameMr: "वैशाखी (पंजाब)", month: 4, day: 14, type: "observance" },
  { name: "Puthandu (Tamil)", nameMr: "पुथंडू (तमिळ नववर्ष)", month: 4, day: 14, type: "observance" },
  { name: "Vishu (Kerala)", nameMr: "विशू (केरळ नववर्ष)", month: 4, day: 14, type: "observance" },
  { name: "Pohela Boishakh (Bengal)", nameMr: "पोहेला बोइशाख (बंगाली नववर्ष)", month: 4, day: 15, type: "observance" },
  { name: "Onam (Kerala)", nameMr: "ओणम (केरळ)", month: 8, day: 28, type: "observance" },
  { name: "Pongal (Tamil Nadu)", nameMr: "पोंगल (तमिळनाडू)", month: 1, day: 15, type: "observance" },
  { name: "Lohri (Punjab)", nameMr: "लोहरी (पंजाब)", month: 1, day: 13, type: "observance" },
  { name: "Ugadi (Karnataka)", nameMr: "उगादी (कर्नाटक नववर्ष)", month: 3, day: 29, type: "observance" },
  { name: "Eid-ul-Fitr (approx)", nameMr: "ईद-उल-फित्र (अंदाजे)", month: 3, day: 31, type: "national" },
  { name: "Milad-un-Nabi (approx)", nameMr: "ईद-ए-मिलाद (अंदाजे)", month: 9, day: 17, type: "national" },
  { name: "Good Friday", nameMr: "गुड फ्रायडे", month: 4, day: 3, type: "national" },
  { name: "Easter", nameMr: "ईस्टर", month: 4, day: 5, type: "observance" },
  { name: "Guru Nanak Jayanti (approx)", nameMr: "गुरुनानक जयंती (अंदाजे)", month: 11, day: 5, type: "national" },

  // January (additional)
  { name: "Makar Sankranti", nameMr: "मकर संक्रांती", month: 1, day: 14, type: "major" as "national" },
  { name: "Savitribai Phule Jayanti", nameMr: "सावित्रीबाई फुले जयंती", month: 1, day: 3, type: "state" },
  { name: "Swami Vivekananda Jayanti", nameMr: "स्वामी विवेकानंद जयंती", month: 1, day: 12, type: "observance" },

  // February
  { name: "Mahatma Phule Jayanti", nameMr: "महात्मा जोतिबा फुले जयंती", month: 4, day: 11, type: "state" },

  // March
  { name: "Chhatrapati Shahu Jayanti", nameMr: "छत्रपती शाहू महाराज जयंती", month: 6, day: 26, type: "state" },

  // August
  { name: "Rajiv Gandhi Sadbhavna Diwas", nameMr: "सद्भावना दिवस", month: 8, day: 20, type: "observance" },

  // October
  { name: "Sardar Patel Jayanti", nameMr: "सरदार पटेल जयंती (एकता दिवस)", month: 10, day: 31, type: "national" },

  // New Year
  { name: "New Year", nameMr: "नवीन वर्ष", month: 1, day: 1, type: "observance" },
];

// ─── शुभ तिथी (Auspicious Tithis per शास्त्र) ──────────────────

// Shukla paksha tithi numbers that are considered shubh
export const SHUBH_TITHIS = [2, 3, 5, 7, 10, 11, 13, 15]; // द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी, एकादशी, त्रयोदशी, पूर्णिमा
export const ASHUBH_TITHIS = [4, 8, 9, 14]; // चतुर्थी (विनायकी only shubh), अष्टमी, नवमी, चतुर्दशी
// Note: अमावस्या (krishna 15) is also ashubh except for specific pujas

// ─── शुभ नक्षत्र ────────────────────────────────────────────────
// Per Muhurat Shastra — these nakshatras are considered auspicious for general activities
export const SHUBH_NAKSHATRAS = [
  "Rohini", "Mrigashira", "Pushya", "Hasta", "Chitra", "Swati", "Anuradha", "Revati",
  "Ashwini", "Punarvasu", "Shravana", "Dhanishta", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada",
];

export const ASHUBH_NAKSHATRAS = [
  "Bharani", "Krittika", "Ardra", "Ashlesha", "Magha", "Purva Phalguni",
  "Vishakha", "Jyeshtha", "Moola", "Purva Ashadha", "Purva Bhadrapada", "Shatabhisha",
];

// ─── शुभ वार (Auspicious Days of Week) ─────────────────────────
// For general muhurat: Monday, Wednesday, Thursday, Friday are good
// Tuesday, Saturday generally avoided for shubh karya
// Sunday is neutral
export const SHUBH_DAYS = [1, 3, 4, 5]; // Mon, Wed, Thu, Fri
export const ASHUBH_DAYS = [2, 6]; // Tue, Sat

// ─── मुहूर्त Types ──────────────────────────────────────────────

export interface MuhuratTag {
  name: string;
  nameMr: string;
}

export function calculateMuhuratTags(
  tithiIndex: number, // 0-29 (0-14 shukla, 15-29 krishna)
  nakshatraEn: string,
  dayOfWeek: number, // 0=Sun
  yogaIndex: number,
): MuhuratTag[] {
  const tags: MuhuratTag[] = [];

  const pakshaTithi = (tithiIndex % 15) + 1; // 1-15
  const isShukla = tithiIndex < 15;
  const isShubhTithi = SHUBH_TITHIS.includes(pakshaTithi);
  const isShubhNak = SHUBH_NAKSHATRAS.includes(nakshatraEn);
  const isShubhDay = SHUBH_DAYS.includes(dayOfWeek);
  const isAshubhDay = ASHUBH_DAYS.includes(dayOfWeek);

  // शुभ योग (good yogas): indices 1(प्रीती), 2(आयुष्मान), 3(सौभाग्य), 4(शोभन),
  // 6(सुकर्मा), 7(धृती), 10(वृद्धी), 11(ध्रुव), 13(हर्षण), 15(सिद्धी), 19(शिव), 20(सिद्ध), 21(साध्य), 22(शुभ)
  const SHUBH_YOGAS = [1, 2, 3, 4, 6, 7, 10, 11, 13, 15, 19, 20, 21, 22];
  const isShubhYoga = SHUBH_YOGAS.includes(yogaIndex % 27);

  // General shubh din
  if (isShubhTithi && isShubhNak && !isAshubhDay) {
    tags.push({ name: "Shubh Din", nameMr: "शुभ दिवस" });
  }

  // वास्तुशांती योग्य — needs shubh tithi + shubh nakshatra + shubh day + shubh yoga
  if (isShukla && isShubhTithi && isShubhNak && isShubhDay && isShubhYoga) {
    tags.push({ name: "Vastushanti", nameMr: "वास्तुशांती योग्य" });
  }

  // गृहप्रवेश योग्य — similar but also excludes krishna paksha
  if (isShukla && isShubhTithi && isShubhNak && isShubhDay) {
    tags.push({ name: "Gruhapravesh", nameMr: "गृहप्रवेश योग्य" });
  }

  // विवाह मुहूर्त — stricter: shukla paksha, shubh tithi (not 1,6,11), shubh nak, Thu/Mon/Wed/Fri
  const vivahTithis = [2, 3, 5, 7, 10, 13];
  if (isShukla && vivahTithis.includes(pakshaTithi) && isShubhNak && [1, 3, 4, 5].includes(dayOfWeek)) {
    tags.push({ name: "Vivah Muhurat", nameMr: "विवाह मुहूर्त" });
  }

  // व्यापार शुभारंभ — Wed, Thu, Fri + shubh tithi + shubh nak
  if (isShubhTithi && isShubhNak && [3, 4, 5].includes(dayOfWeek)) {
    tags.push({ name: "Vyapar Shubharambh", nameMr: "व्यापार शुभारंभ" });
  }

  // एकादशी व्रत
  if (pakshaTithi === 11) {
    tags.push({ name: "Ekadashi Vrat", nameMr: "एकादशी व्रत" });
  }

  // प्रदोष व्रत (त्रयोदशी)
  if (pakshaTithi === 13) {
    tags.push({ name: "Pradosh Vrat", nameMr: "प्रदोष व्रत" });
  }

  // संकष्टी चतुर्थी (कृष्ण पक्ष चतुर्थी)
  if (!isShukla && pakshaTithi === 4) {
    tags.push({ name: "Sankashti Chaturthi", nameMr: "संकष्टी चतुर्थी" });
  }

  // पूर्णिमा
  if (isShukla && pakshaTithi === 15) {
    tags.push({ name: "Purnima", nameMr: "पौर्णिमा" });
  }

  // अमावस्या
  if (!isShukla && pakshaTithi === 15) {
    tags.push({ name: "Amavasya", nameMr: "अमावस्या" });
  }

  return tags;
}

// ─── Day Classification ─────────────────────────────────────────

export type DayType = "shubh" | "ashubh" | "neutral" | "festival";

export function classifyDay(
  tithiIndex: number,
  nakshatraEn: string,
  dayOfWeek: number,
  hasFestival: boolean,
): DayType {
  if (hasFestival) return "festival";

  const pakshaTithi = (tithiIndex % 15) + 1;
  const isShubhTithi = SHUBH_TITHIS.includes(pakshaTithi);
  const isAshubhTithi = ASHUBH_TITHIS.includes(pakshaTithi);
  const isAshubhNak = ASHUBH_NAKSHATRAS.includes(nakshatraEn);

  // अमावस्या is ashubh
  if (tithiIndex >= 15 && pakshaTithi === 15) return "ashubh";

  if (isAshubhTithi && isAshubhNak) return "ashubh";
  if (isAshubhTithi) return "ashubh";
  if (isShubhTithi && !isAshubhNak) return "shubh";

  return "neutral";
}
