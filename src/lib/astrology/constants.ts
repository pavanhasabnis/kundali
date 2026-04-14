// Vedic Astrology Constants

export const RASHIS = [
  { id: 0, en: "Aries", hi: "मेष", mr: "मेष", lord: "Mars", symbol: "♈" },
  { id: 1, en: "Taurus", hi: "वृषभ", mr: "वृषभ", lord: "Venus", symbol: "♉" },
  { id: 2, en: "Gemini", hi: "मिथुन", mr: "मिथुन", lord: "Mercury", symbol: "♊" },
  { id: 3, en: "Cancer", hi: "कर्क", mr: "कर्क", lord: "Moon", symbol: "♋" },
  { id: 4, en: "Leo", hi: "सिंह", mr: "सिंह", lord: "Sun", symbol: "♌" },
  { id: 5, en: "Virgo", hi: "कन्या", mr: "कन्या", lord: "Mercury", symbol: "♍" },
  { id: 6, en: "Libra", hi: "तुला", mr: "तुला", lord: "Venus", symbol: "♎" },
  { id: 7, en: "Scorpio", hi: "वृश्चिक", mr: "वृश्चिक", lord: "Mars", symbol: "♏" },
  { id: 8, en: "Sagittarius", hi: "धनु", mr: "धनु", lord: "Jupiter", symbol: "♐" },
  { id: 9, en: "Capricorn", hi: "मकर", mr: "मकर", lord: "Saturn", symbol: "♑" },
  { id: 10, en: "Aquarius", hi: "कुंभ", mr: "कुंभ", lord: "Saturn", symbol: "♒" },
  { id: 11, en: "Pisces", hi: "मीन", mr: "मीन", lord: "Jupiter", symbol: "♓" },
];

export const NAKSHATRAS = [
  { id: 0, en: "Ashwini", mr: "अश्विनी", lord: "Ketu", deity: "अश्विनी कुमार" },
  { id: 1, en: "Bharani", mr: "भरणी", lord: "Venus", deity: "यम" },
  { id: 2, en: "Krittika", mr: "कृत्तिका", lord: "Sun", deity: "अग्नि" },
  { id: 3, en: "Rohini", mr: "रोहिणी", lord: "Moon", deity: "ब्रह्मा" },
  { id: 4, en: "Mrigashira", mr: "मृगशीर्ष", lord: "Mars", deity: "चंद्र" },
  { id: 5, en: "Ardra", mr: "आर्द्रा", lord: "Rahu", deity: "रुद्र" },
  { id: 6, en: "Punarvasu", mr: "पुनर्वसु", lord: "Jupiter", deity: "अदिती" },
  { id: 7, en: "Pushya", mr: "पुष्य", lord: "Saturn", deity: "बृहस्पती" },
  { id: 8, en: "Ashlesha", mr: "आश्लेषा", lord: "Mercury", deity: "सर्प" },
  { id: 9, en: "Magha", mr: "मघा", lord: "Ketu", deity: "पितर" },
  { id: 10, en: "Purva Phalguni", mr: "पूर्वा फाल्गुनी", lord: "Venus", deity: "भग" },
  { id: 11, en: "Uttara Phalguni", mr: "उत्तरा फाल्गुनी", lord: "Sun", deity: "अर्यमन" },
  { id: 12, en: "Hasta", mr: "हस्त", lord: "Moon", deity: "सवितार" },
  { id: 13, en: "Chitra", mr: "चित्रा", lord: "Mars", deity: "त्वष्टा" },
  { id: 14, en: "Swati", mr: "स्वाती", lord: "Rahu", deity: "वायू" },
  { id: 15, en: "Vishakha", mr: "विशाखा", lord: "Jupiter", deity: "इंद्राग्नी" },
  { id: 16, en: "Anuradha", mr: "अनुराधा", lord: "Saturn", deity: "मित्र" },
  { id: 17, en: "Jyeshtha", mr: "ज्येष्ठा", lord: "Mercury", deity: "इंद्र" },
  { id: 18, en: "Moola", mr: "मूळ", lord: "Ketu", deity: "निऋती" },
  { id: 19, en: "Purva Ashadha", mr: "पूर्वाषाढा", lord: "Venus", deity: "अपः" },
  { id: 20, en: "Uttara Ashadha", mr: "उत्तराषाढा", lord: "Sun", deity: "विश्वदेव" },
  { id: 21, en: "Shravana", mr: "श्रवण", lord: "Moon", deity: "विष्णू" },
  { id: 22, en: "Dhanishta", mr: "धनिष्ठा", lord: "Mars", deity: "वसू" },
  { id: 23, en: "Shatabhisha", mr: "शतभिषा", lord: "Rahu", deity: "वरुण" },
  { id: 24, en: "Purva Bhadrapada", mr: "पूर्वाभाद्रपदा", lord: "Jupiter", deity: "अजैकपात" },
  { id: 25, en: "Uttara Bhadrapada", mr: "उत्तराभाद्रपदा", lord: "Saturn", deity: "अहिर्बुध्न्य" },
  { id: 26, en: "Revati", mr: "रेवती", lord: "Mercury", deity: "पूषन" },
];

export const PLANETS = [
  { id: "Sun", en: "Sun", mr: "सूर्य", hi: "सूर्य", abbr: "सू" },
  { id: "Moon", en: "Moon", mr: "चंद्र", hi: "चंद्र", abbr: "चं" },
  { id: "Mars", en: "Mars", mr: "मंगळ", hi: "मंगल", abbr: "मं" },
  { id: "Mercury", en: "Mercury", mr: "बुध", hi: "बुध", abbr: "बु" },
  { id: "Jupiter", en: "Jupiter", mr: "गुरु", hi: "गुरु", abbr: "गु" },
  { id: "Venus", en: "Venus", mr: "शुक्र", hi: "शुक्र", abbr: "शु" },
  { id: "Saturn", en: "Saturn", mr: "शनि", hi: "शनि", abbr: "श" },
  { id: "Rahu", en: "Rahu", mr: "राहु", hi: "राहु", abbr: "रा" },
  { id: "Ketu", en: "Ketu", mr: "केतु", hi: "केतु", abbr: "के" },
];

// Vimshottari Dasha order and years
export const DASHA_ORDER = [
  { lord: "Ketu", years: 7 },
  { lord: "Venus", years: 20 },
  { lord: "Sun", years: 6 },
  { lord: "Moon", years: 10 },
  { lord: "Mars", years: 7 },
  { lord: "Rahu", years: 18 },
  { lord: "Jupiter", years: 16 },
  { lord: "Saturn", years: 19 },
  { lord: "Mercury", years: 17 },
];

export const TOTAL_DASHA_YEARS = 120;

// Ashtakoot Guna Milan
export const GUNA_FACTORS = [
  { name: "वर्ण", en: "Varna", maxPoints: 1, description: "spiritual compatibility" },
  { name: "वश्य", en: "Vashya", maxPoints: 2, description: "mutual attraction" },
  { name: "तारा", en: "Tara", maxPoints: 3, description: "birth star compatibility" },
  { name: "योनि", en: "Yoni", maxPoints: 4, description: "physical compatibility" },
  { name: "ग्रह मैत्री", en: "Graha Maitri", maxPoints: 5, description: "mental compatibility" },
  { name: "गण", en: "Gana", maxPoints: 6, description: "temperament" },
  { name: "भकूट", en: "Bhakoot", maxPoints: 7, description: "mutual influence" },
  { name: "नाडी", en: "Nadi", maxPoints: 8, description: "health & genes" },
];

// Nakshatra to Varna mapping (0=Brahmin, 1=Kshatriya, 2=Vaishya, 3=Shudra)
// Per Muhurta Chintamani / classical texts — mapped by rashi of each nakshatra
// Cancer/Scorpio/Pisces=Brahmin, Aries/Leo/Sagittarius=Kshatriya, Taurus/Virgo/Capricorn=Vaishya, Gemini/Libra/Aquarius=Shudra
export const NAKSHATRA_VARNA = [
// Ash  Bha  Kri  Roh  Mri  Ard  Pun  Pus  Ash
   1,   1,   2,   2,   2,   3,   3,   0,   0,
// Mag  PPh  UPh  Has  Chi  Swa  Vis  Anu  Jye
   1,   1,   1,   2,   2,   3,   3,   0,   0,
// Moo  PAs  UAs  Shr  Dha  Sha  PBh  UBh  Rev
   1,   1,   1,   2,   2,   3,   3,   0,   0,
];

// Nakshatra to Yoni — 14 animal types
// Per Brihat Parashara Hora Shastra / Muhurta Chintamani
// 0=Horse(Ashwa), 1=Elephant(Gaja), 2=Sheep(Mesha), 3=Serpent(Sarpa), 4=Dog(Shwana),
// 5=Cat(Marjara), 6=Rat(Mushaka), 7=Cow(Gau), 8=Buffalo(Mahisha), 9=Tiger(Vyaghra),
// 10=Deer(Mriga), 11=Monkey(Vanara), 12=Mongoose(Nakula), 13=Lion(Simha)
export const NAKSHATRA_YONI = [
// Ashwini=Horse, Bharani=Elephant, Krittika=Sheep, Rohini=Serpent, Mrigashira=Serpent,
// Ardra=Dog, Punarvasu=Cat, Pushya=Sheep, Ashlesha=Cat
   0,   1,   2,   3,   3,   4,   5,   2,   5,
// Magha=Rat, PurvaPhalguni=Rat, UttaraPhalguni=Cow, Hasta=Buffalo, Chitra=Tiger,
// Swati=Buffalo, Vishakha=Tiger, Anuradha=Deer, Jyeshtha=Deer
   6,   6,   7,   8,   9,   8,   9,  10,  10,
// Moola=Dog, PurvaAshadha=Monkey, UttaraAshadha=Mongoose, Shravana=Monkey,
// Dhanishta=Lion, Shatabhisha=Horse, PurvaBhadrapada=Lion, UttaraBhadrapada=Cow, Revati=Elephant
   4,  11,   12,  11,  13,   0,   13,  7,   1,
];

// Yoni enemy pairs — these animals are natural enemies
// Same yoni=4pts, Friendly=3pts, Neutral=2pts, Enemy=0pts
export const YONI_ENEMIES: [number, number][] = [
  [0, 8],   // Horse vs Buffalo — sworn enemies
  [1, 13],  // Elephant vs Lion — enemies
  [3, 12],  // Serpent vs Mongoose — sworn enemies
  [4, 10],  // Dog vs Deer — enemies
  [5, 6],   // Cat vs Rat — sworn enemies
  [7, 9],   // Cow vs Tiger — enemies
  [2, 11],  // Sheep vs Monkey — enemies
];

// Nakshatra to Gana mapping (0=Deva, 1=Manushya, 2=Rakshasa)
// Per Brihat Jataka / classical texts
export const NAKSHATRA_GANA = [
// Ash  Bha  Kri  Roh  Mri  Ard  Pun  Pus  Ash
   0,   1,   2,   1,   0,   1,   0,   0,   2,
// Mag  PPh  UPh  Has  Chi  Swa  Vis  Anu  Jye
   2,   1,   1,   0,   2,   0,   2,   0,   2,
// Moo  PAs  UAs  Shr  Dha  Sha  PBh  UBh  Rev
   2,   1,   1,   0,   2,   2,   1,   1,   0,
];

// Nakshatra to Nadi (0=Aadi/Vata, 1=Madhya/Pitta, 2=Antya/Kapha)
// Per classical Nadi cycle — NOT sequential groups of 3
// The cycle is: Aadi, Madhya, Antya, Antya, Madhya, Aadi, Aadi, Madhya, Antya (repeats 3 times)
export const NAKSHATRA_NADI = [
// Ash  Bha  Kri  Roh  Mri  Ard  Pun  Pus  Ash
   0,   1,   2,   2,   1,   0,   0,   1,   2,
// Mag  PPh  UPh  Has  Chi  Swa  Vis  Anu  Jye
   0,   1,   2,   2,   1,   0,   0,   1,   2,
// Moo  PAs  UAs  Shr  Dha  Sha  PBh  UBh  Rev
   0,   1,   2,   2,   1,   0,   0,   1,   2,
];
