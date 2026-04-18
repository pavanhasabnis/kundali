import swisseph from "swisseph";
import { RASHIS, NAKSHATRAS, DASHA_ORDER, TOTAL_DASHA_YEARS } from "./constants";

export interface BirthInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: number; // offset in hours, e.g. 5.5 for IST
}

export interface PlanetPosition {
  id: string;
  name: string;
  nameMr: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  rashiIndex: number;
  rashi: string;
  rashiMr: string;
  degreeInSign: number;
  degreeDMS: string;
  nakshatraIndex: number;
  nakshatra: string;
  nakshatraMr: string;
  nakshatraLord: string;
  pada: number;
  house: number;
  isRetrograde: boolean;
  speed: number;
}

export interface AntarDasha {
  lord: string;
  startDate: Date;
  endDate: Date;
  years: number;
}

export interface DashaPeriod {
  lord: string;
  startDate: Date;
  endDate: Date;
  years: number;
  antardashas: AntarDasha[];
}

export interface KundliResult {
  birthInput: BirthInput;
  julianDay: number;
  ayanamsa: number;
  lagnaRashiIndex: number;
  lagnaRashi: string;
  lagnaRashiMr: string;
  lagnaDegree: number;
  lagnaDMS: string;
  lagnaSiderealLongitude: number;
  lagnaNakshatraIndex: number;
  lagnaNakshatra: string;
  lagnaNakshatraMr: string;
  houseCusps: number[]; // 12 sidereal cusp degrees (index 0 = house 1)
  planets: PlanetPosition[];
  moonRashiIndex: number;
  moonRashi: string;
  moonRashiMr: string;
  moonNakshatraIndex: number;
  moonNakshatra: string;
  moonNakshatraMr: string;
  moonNakshatraLord: string;
  moonPada: number;
  dashas: DashaPeriod[];
}

function toJulianDay(input: BirthInput): number {
  // Convert local time to UTC
  const utcHour = input.hour + input.minute / 60 - input.timezone;
  let day = input.day;
  let month = input.month;
  let year = input.year;

  if (utcHour < 0) {
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        month = 12;
        year -= 1;
      }
      day = new Date(year, month, 0).getDate();
    }
  }

  const adjustedHour = ((utcHour % 24) + 24) % 24;
  return swisseph.swe_julday(year, month, day, adjustedHour, swisseph.SE_GREG_CAL);
}

function getSiderealLong(tropicalLong: number, ayanamsa: number): number {
  let sid = tropicalLong - ayanamsa;
  if (sid < 0) sid += 360;
  return sid;
}

function getRashiIndex(sidLong: number): number {
  return Math.floor(sidLong / 30);
}

function getNakshatraIndex(sidLong: number): number {
  return Math.floor(sidLong / (360 / 27));
}

function getPada(sidLong: number): number {
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = sidLong % nakshatraSpan;
  return Math.floor(posInNakshatra / (nakshatraSpan / 4)) + 1;
}

function toDMS(degrees: number): string {
  const d = Math.floor(degrees);
  const m = Math.floor((degrees - d) * 60);
  const s = Math.floor(((degrees - d) * 60 - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

const PLANET_MAP = [
  { id: "Sun", swId: swisseph.SE_SUN, mr: "सूर्य" },
  { id: "Moon", swId: swisseph.SE_MOON, mr: "चंद्र" },
  { id: "Mars", swId: swisseph.SE_MARS, mr: "मंगळ" },
  { id: "Mercury", swId: swisseph.SE_MERCURY, mr: "बुध" },
  { id: "Jupiter", swId: swisseph.SE_JUPITER, mr: "गुरु" },
  { id: "Venus", swId: swisseph.SE_VENUS, mr: "शुक्र" },
  { id: "Saturn", swId: swisseph.SE_SATURN, mr: "शनि" },
];

export function calculateKundli(input: BirthInput): KundliResult {
  const jd = toJulianDay(input);

  // Set Lahiri Ayanamsa
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jd);

  // Calculate Ascendant and house cusps
  const houses = swisseph.swe_houses(jd, input.latitude, input.longitude, "P".charCodeAt(0));
  const lagnaT = houses.ascendant;
  const lagnaSid = getSiderealLong(lagnaT, ayanamsa);
  const lagnaRashiIdx = getRashiIndex(lagnaSid);
  const lagnaNakIdx = getNakshatraIndex(lagnaSid);

  // Sidereal house cusps (Placidus) — index 0 = house 1
  // swisseph node binding: houses.house is 0-indexed (0=house1, 11=house12)
  const houseCusps: number[] = [];
  for (let i = 0; i < 12; i++) {
    houseCusps.push(getSiderealLong(houses.house[i], ayanamsa));
  }

  // Calculate planets
  const planets: PlanetPosition[] = [];

  for (const p of PLANET_MAP) {
    const result = swisseph.swe_calc_ut(jd, p.swId, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
    const tropLong = result.longitude;
    const speed = result.longitudeSpeed;
    const sidLong = getSiderealLong(tropLong, ayanamsa);
    const rashiIdx = getRashiIndex(sidLong);
    const nakIdx = getNakshatraIndex(sidLong);
    const pada = getPada(sidLong);
    const degInSign = sidLong % 30;
    const houseNum = ((rashiIdx - lagnaRashiIdx + 12) % 12) + 1;

    planets.push({
      id: p.id,
      name: p.id,
      nameMr: p.mr,
      tropicalLongitude: tropLong,
      siderealLongitude: sidLong,
      rashiIndex: rashiIdx,
      rashi: RASHIS[rashiIdx].en,
      rashiMr: RASHIS[rashiIdx].mr,
      degreeInSign: degInSign,
      degreeDMS: toDMS(degInSign),
      nakshatraIndex: nakIdx,
      nakshatra: NAKSHATRAS[nakIdx].en,
      nakshatraMr: NAKSHATRAS[nakIdx].mr,
      nakshatraLord: NAKSHATRAS[nakIdx].lord,
      pada,
      house: houseNum,
      isRetrograde: speed < 0,
      speed,
    });
  }

  // Rahu (True Node)
  const rahuResult = swisseph.swe_calc_ut(jd, swisseph.SE_MEAN_NODE, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
  const rahuSid = getSiderealLong(rahuResult.longitude, ayanamsa);
  const rahuRashi = getRashiIndex(rahuSid);
  const rahuNak = getNakshatraIndex(rahuSid);
  const rahuPada = getPada(rahuSid);
  const rahuHouse = ((rahuRashi - lagnaRashiIdx + 12) % 12) + 1;

  planets.push({
    id: "Rahu",
    name: "Rahu",
    nameMr: "राहु",
    tropicalLongitude: rahuResult.longitude,
    siderealLongitude: rahuSid,
    rashiIndex: rahuRashi,
    rashi: RASHIS[rahuRashi].en,
    rashiMr: RASHIS[rahuRashi].mr,
    degreeInSign: rahuSid % 30,
    degreeDMS: toDMS(rahuSid % 30),
    nakshatraIndex: rahuNak,
    nakshatra: NAKSHATRAS[rahuNak].en,
    nakshatraMr: NAKSHATRAS[rahuNak].mr,
    nakshatraLord: NAKSHATRAS[rahuNak].lord,
    pada: rahuPada,
    house: rahuHouse,
    isRetrograde: true,
    speed: rahuResult.longitudeSpeed,
  });

  // Ketu (180° from Rahu)
  const ketuSid = (rahuSid + 180) % 360;
  const ketuRashi = getRashiIndex(ketuSid);
  const ketuNak = getNakshatraIndex(ketuSid);
  const ketuPada = getPada(ketuSid);
  const ketuHouse = ((ketuRashi - lagnaRashiIdx + 12) % 12) + 1;

  planets.push({
    id: "Ketu",
    name: "Ketu",
    nameMr: "केतु",
    tropicalLongitude: (rahuResult.longitude + 180) % 360,
    siderealLongitude: ketuSid,
    rashiIndex: ketuRashi,
    rashi: RASHIS[ketuRashi].en,
    rashiMr: RASHIS[ketuRashi].mr,
    degreeInSign: ketuSid % 30,
    degreeDMS: toDMS(ketuSid % 30),
    nakshatraIndex: ketuNak,
    nakshatra: NAKSHATRAS[ketuNak].en,
    nakshatraMr: NAKSHATRAS[ketuNak].mr,
    nakshatraLord: NAKSHATRAS[ketuNak].lord,
    pada: ketuPada,
    house: ketuHouse,
    isRetrograde: true,
    speed: rahuResult.longitudeSpeed,
  });

  // Moon details
  const moon = planets.find((p) => p.id === "Moon")!;

  // Calculate Vimshottari Dasha
  const dashas = calculateDasha(moon.nakshatraIndex, moon.siderealLongitude, input);

  return {
    birthInput: input,
    julianDay: jd,
    ayanamsa,
    lagnaRashiIndex: lagnaRashiIdx,
    lagnaRashi: RASHIS[lagnaRashiIdx].en,
    lagnaRashiMr: RASHIS[lagnaRashiIdx].mr,
    lagnaDegree: lagnaSid % 30,
    lagnaDMS: toDMS(lagnaSid % 30),
    lagnaSiderealLongitude: lagnaSid,
    lagnaNakshatraIndex: lagnaNakIdx,
    lagnaNakshatra: NAKSHATRAS[lagnaNakIdx].en,
    lagnaNakshatraMr: NAKSHATRAS[lagnaNakIdx].mr,
    houseCusps,
    planets,
    moonRashiIndex: moon.rashiIndex,
    moonRashi: moon.rashi,
    moonRashiMr: moon.rashiMr,
    moonNakshatraIndex: moon.nakshatraIndex,
    moonNakshatra: moon.nakshatra,
    moonNakshatraMr: moon.nakshatraMr,
    moonNakshatraLord: moon.nakshatraLord,
    moonPada: moon.pada,
    dashas,
  };
}

function calculateDasha(
  moonNakIndex: number,
  moonSidLong: number,
  input: BirthInput
): DashaPeriod[] {
  const nakshatraLord = NAKSHATRAS[moonNakIndex].lord;

  // Find the starting dasha lord in the order
  const startIdx = DASHA_ORDER.findIndex((d) => d.lord === nakshatraLord);

  // Calculate elapsed portion of first dasha
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = moonSidLong % nakshatraSpan;
  const fractionElapsed = posInNakshatra / nakshatraSpan;

  const birthDate = new Date(input.year, input.month - 1, input.day, input.hour, input.minute);

  const dashas: DashaPeriod[] = [];
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 9; i++) {
    const idx = (startIdx + i) % 9;
    const dasha = DASHA_ORDER[idx];
    let years = dasha.years;

    // First dasha: subtract elapsed portion
    if (i === 0) {
      years = dasha.years * (1 - fractionElapsed);
    }

    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + Math.floor(years));
    endDate.setMonth(endDate.getMonth() + Math.floor((years % 1) * 12));
    endDate.setDate(endDate.getDate() + Math.floor(((years % 1) * 12 % 1) * 30));

    // Calculate Antardashas (sub-periods) within this Mahadasha
    // Antardasha sequence starts from the Mahadasha lord itself
    const antardashas: AntarDasha[] = [];
    let adDate = new Date(startDate);
    const mahaYears = years;
    for (let j = 0; j < 9; j++) {
      const adIdx = (idx + j) % 9;
      const adLord = DASHA_ORDER[adIdx];
      // Antardasha duration = (mahadasha years × antardasha lord years) / 120
      const adYears = (mahaYears * adLord.years) / TOTAL_DASHA_YEARS;
      const adStart = new Date(adDate);
      const adEnd = new Date(adDate);
      adEnd.setFullYear(adEnd.getFullYear() + Math.floor(adYears));
      adEnd.setMonth(adEnd.getMonth() + Math.floor((adYears % 1) * 12));
      adEnd.setDate(adEnd.getDate() + Math.floor(((adYears % 1) * 12 % 1) * 30));
      antardashas.push({ lord: adLord.lord, startDate: adStart, endDate: adEnd, years: Math.round(adYears * 100) / 100 });
      adDate = new Date(adEnd);
    }

    dashas.push({
      lord: dasha.lord,
      startDate,
      endDate,
      years: Math.round(years * 100) / 100,
      antardashas,
    });

    currentDate = new Date(endDate);
  }

  return dashas;
}

// Calculate Panchang for a given date and location
// Uses SUNRISE time (not noon) — this is the standard in Indian panchang tradition
// Kalnirnay, Tilak Panchang, and all official panchangs use sunrise as the reference
export function calculatePanchang(date: Date, latitude: number, longitude: number, timezone: number, birthHour?: number, birthMinute?: number) {
  // First calculate JD at approximate sunrise (6 AM local) to find actual sunrise
  const approxSunriseUTC = 6 - timezone; // ~6 AM local in UTC
  const jdApprox = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    approxSunriseUTC,
    swisseph.SE_GREG_CAL
  );

  // Calculate actual sunrise
  let sunriseHourUTC = approxSunriseUTC;
  try {
    const riseResult = swisseph.swe_rise_trans(
      jdApprox - 0.5, // start searching from midnight
      swisseph.SE_SUN,
      0, // star name (not used)
      swisseph.SEFLG_SWIEPH,
      swisseph.SE_CALC_RISE, // sunrise
      [longitude, latitude, 0], // geopos: [lng, lat, altitude]
      0, // atpress
      0, // attemp
    );
    if (riseResult && riseResult.transitTime) {
      // Convert JD of sunrise to UTC hours on this day
      const sunriseJD = riseResult.transitTime;
      const dayStartJD = swisseph.swe_julday(date.getFullYear(), date.getMonth() + 1, date.getDate(), 0, swisseph.SE_GREG_CAL);
      sunriseHourUTC = (sunriseJD - dayStartJD) * 24;
    }
  } catch {
    // If sunrise calculation fails, use 6 AM local as fallback
    sunriseHourUTC = approxSunriseUTC;
  }

  // Calculate panchang at sunrise time
  const jd = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    sunriseHourUTC,
    swisseph.SE_GREG_CAL
  );

  // Calculate sunrise/sunset times for display
  const sunriseLocal = sunriseHourUTC + timezone;
  const sunriseH = Math.floor(sunriseLocal);
  const sunriseM = Math.floor((sunriseLocal - sunriseH) * 60);

  let sunsetLocal = sunriseLocal + 12; // approximate
  try {
    const setResult = swisseph.swe_rise_trans(
      jdApprox - 0.5,
      swisseph.SE_SUN,
      0,
      swisseph.SEFLG_SWIEPH,
      swisseph.SE_CALC_SET, // sunset
      [longitude, latitude, 0],
      0,
      0,
    );
    if (setResult && setResult.transitTime) {
      const dayStartJD = swisseph.swe_julday(date.getFullYear(), date.getMonth() + 1, date.getDate(), 0, swisseph.SE_GREG_CAL);
      sunsetLocal = ((setResult.transitTime - dayStartJD) * 24) + timezone;
    }
  } catch { /* use approximate */ }

  const sunsetH = Math.floor(sunsetLocal);
  const sunsetM = Math.floor((sunsetLocal - sunsetH) * 60);

  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  // For tithi/karana/yoga/nakshatra at birth, use birth-moment JD if provided.
  // Panchang elements change during day — tradition uses birth moment for natal chart.
  const jdForPositions = (birthHour !== undefined && birthMinute !== undefined)
    ? swisseph.swe_julday(date.getFullYear(), date.getMonth() + 1, date.getDate(), birthHour + birthMinute / 60 - timezone, swisseph.SE_GREG_CAL)
    : jd;
  const ayanamsa = swisseph.swe_get_ayanamsa_ut(jdForPositions);

  // Sun and Moon positions at birth moment (not sunrise)
  const sunResult = swisseph.swe_calc_ut(jdForPositions, swisseph.SE_SUN, swisseph.SEFLG_SWIEPH);
  const moonResult = swisseph.swe_calc_ut(jdForPositions, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH);

  const sunSid = getSiderealLong(sunResult.longitude, ayanamsa);
  const moonSid = getSiderealLong(moonResult.longitude, ayanamsa);

  // Tithi (Moon - Sun) / 12
  let diff = moonSid - sunSid;
  if (diff < 0) diff += 360;
  const tithiIndex = Math.floor(diff / 12);

  const tithiNames = [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "अमावस्या",
  ];

  const paksha = tithiIndex < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

  // Nakshatra
  const nakIndex = getNakshatraIndex(moonSid);

  // Yoga (Sun + Moon) / (360/27)
  let sumLong = sunSid + moonSid;
  if (sumLong >= 360) sumLong -= 360;
  const yogaIndex = Math.floor(sumLong / (360 / 27));
  const yogaNames = [
    "विष्कम्भ", "प्रीती", "आयुष्मान", "सौभाग्य", "शोभन",
    "अतिगंड", "सुकर्मा", "धृती", "शूल", "गंड",
    "वृद्धी", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
    "सिद्धी", "व्यतिपात", "वरीयान", "परिघ", "शिव",
    "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म",
    "ऐंद्र", "वैधृती",
  ];

  // Karana (half-tithi)
  // Per BPHS: first half-tithi is Kimstughna (fixed), then 7 movable karanas repeat 8 times (56),
  // then 3 fixed: Shakuni, Chatushpada, Nag. Total = 1 + 56 + 3 = 60.
  const karanaAbsIndex = Math.floor(diff / 6); // 0-59
  const movableNames = ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टी"];
  let karanaName: string;
  if (karanaAbsIndex === 0) karanaName = "किंस्तुघ्न";
  else if (karanaAbsIndex <= 56) karanaName = movableNames[(karanaAbsIndex - 1) % 7];
  else if (karanaAbsIndex === 57) karanaName = "शकुनी";
  else if (karanaAbsIndex === 58) karanaName = "चतुष्पाद";
  else karanaName = "नाग";

  // Rahu Kaal calculation (simplified by day of week)
  const dayOfWeek = date.getDay();
  const rahuKaalSlots = [
    "04:30 PM - 06:00 PM", // Sunday
    "07:30 AM - 09:00 AM", // Monday
    "03:00 PM - 04:30 PM", // Tuesday
    "12:00 PM - 01:30 PM", // Wednesday
    "01:30 PM - 03:00 PM", // Thursday
    "10:30 AM - 12:00 PM", // Friday
    "09:00 AM - 10:30 AM", // Saturday
  ];

  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

  // Sun's rashi for masa (month)
  const sunRashi = getRashiIndex(sunSid);
  const masaNames = [
    "मेष (चैत्र/वैशाख)", "वृषभ (वैशाख/ज्येष्ठ)", "मिथुन (ज्येष्ठ/आषाढ)",
    "कर्क (आषाढ/श्रावण)", "सिंह (श्रावण/भाद्रपद)", "कन्या (भाद्रपद/आश्विन)",
    "तुला (आश्विन/कार्तिक)", "वृश्चिक (कार्तिक/मार्गशीर्ष)", "धनु (मार्गशीर्ष/पौष)",
    "मकर (पौष/माघ)", "कुंभ (माघ/फाल्गुन)", "मीन (फाल्गुन/चैत्र)",
  ];

  return {
    date: date.toLocaleDateString("mr-IN"),
    day: dayNames[dayOfWeek],
    tithi: tithiNames[tithiIndex] || tithiNames[tithiIndex % 30],
    tithiIndex: (tithiIndex % 15) + 1,
    paksha,
    nakshatra: NAKSHATRAS[nakIndex].mr,
    nakshatraEn: NAKSHATRAS[nakIndex].en,
    nakshatraLord: NAKSHATRAS[nakIndex].lord,
    yoga: yogaNames[yogaIndex % 27],
    karana: karanaName,
    rahuKaal: rahuKaalSlots[dayOfWeek],
    masa: masaNames[sunRashi],
    moonRashi: RASHIS[getRashiIndex(moonSid)].mr,
    sunRashi: RASHIS[sunRashi].mr,
    sunrise: `${String(sunriseH).padStart(2, "0")}:${String(sunriseM).padStart(2, "0")}`,
    sunset: `${String(sunsetH).padStart(2, "0")}:${String(sunsetM).padStart(2, "0")}`,
  };
}
