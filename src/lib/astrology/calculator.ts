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
  // JD at UT midnight of the requested date (start of search window for rise/set)
  const dayStartJD = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    0,
    swisseph.SE_GREG_CAL
  );

  // Actual sunrise via Swiss Ephemeris.
  // Binding signature: (tjd_ut, ipl, starname, epheflag, rsmi, longitude, latitude, height, atpress, attemp).
  // Passing geopos as an array or `0` for starname silently corrupts the result.
  const approxSunriseUTC = 6 - timezone;
  let sunriseHourUTC = approxSunriseUTC;
  try {
    const riseResult = swisseph.swe_rise_trans(
      dayStartJD,
      swisseph.SE_SUN,
      null,
      swisseph.SEFLG_SWIEPH,
      swisseph.SE_CALC_RISE,
      longitude,
      latitude,
      0,
      0,
      0,
    );
    if (riseResult && "transitTime" in riseResult && riseResult.transitTime) {
      sunriseHourUTC = (riseResult.transitTime - dayStartJD) * 24;
    }
  } catch {
    sunriseHourUTC = approxSunriseUTC;
  }

  const jd = swisseph.swe_julday(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    sunriseHourUTC,
    swisseph.SE_GREG_CAL
  );

  const sunriseLocal = sunriseHourUTC + timezone;
  let sunsetLocal = sunriseLocal + 12;
  try {
    const setResult = swisseph.swe_rise_trans(
      dayStartJD,
      swisseph.SE_SUN,
      null,
      swisseph.SEFLG_SWIEPH,
      swisseph.SE_CALC_SET,
      longitude,
      latitude,
      0,
      0,
      0,
    );
    if (setResult && "transitTime" in setResult && setResult.transitTime) {
      sunsetLocal = ((setResult.transitTime - dayStartJD) * 24) + timezone;
    }
  } catch { /* fall back to approx */ }

  // Round minutes to nearest (panchang convention) instead of truncating.
  const toHHMM = (hoursFloat: number) => {
    let totalMin = Math.round(hoursFloat * 60);
    if (totalMin < 0) totalMin += 24 * 60;
    totalMin = totalMin % (24 * 60);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return { h, m };
  };
  const { h: sunriseH, m: sunriseM } = toHHMM(sunriseLocal);
  const { h: sunsetH, m: sunsetM } = toHHMM(sunsetLocal);

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

  // Inauspicious time slots — sunrise-based (Kalnirnay / Drik / Datepanchang convention).
  // Daylight (sunrise → sunset) split into 8 equal parts; slot varies by vaar.
  const dayOfWeek = date.getDay();
  const RAHU_SLOT     = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const GULIKA_SLOT   = [7, 6, 5, 4, 3, 2, 1];
  const YAMAGANDA_SLOT = [5, 4, 3, 2, 1, 7, 6];
  const fmt12 = (hoursFloat: number) => {
    let totalMin = Math.round(hoursFloat * 60);
    totalMin = ((totalMin % 1440) + 1440) % 1440;
    let h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 === 0 ? 12 : h % 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
  };
  const daylightHours = sunsetLocal - sunriseLocal;
  const slotSize = daylightHours / 8;
  const slotRange = (slot: number) => {
    const start = sunriseLocal + (slot - 1) * slotSize;
    const end = start + slotSize;
    return `${fmt12(start)} - ${fmt12(end)}`;
  };
  const rahuKaalStr = slotRange(RAHU_SLOT[dayOfWeek]);
  const gulikaKaalStr = slotRange(GULIKA_SLOT[dayOfWeek]);
  const yamagandaStr = slotRange(YAMAGANDA_SLOT[dayOfWeek]);

  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

  // ── Panchang transitions (end-times for tithi/nakshatra/yoga/karana/moon-rashi) ──
  // Sample Sun + Moon every 30 min from sunrise over a 30h window; detect boundary
  // crossings via linear interpolation (angular velocity is quasi-constant at this scale).
  const NAK_STEP = 360 / 27;
  const RASHI_STEP = 30;
  const windowStartJD = jd;                  // sunrise JD (UT)
  const windowEndJD = jd + 30 / 24;          // +30h to catch events up to next sunrise + buffer
  const sampleStepJD = 0.5 / 24;             // 30 min
  type Sample = { jd: number; diffC: number; moonC: number; yogaC: number };
  const samples: Sample[] = [];
  let prevDiff = NaN, prevMoon = NaN, prevYoga = NaN;
  for (let t = windowStartJD; t <= windowEndJD + sampleStepJD; t += sampleStepJD) {
    const ayan = swisseph.swe_get_ayanamsa_ut(t);
    const sunR = swisseph.swe_calc_ut(t, swisseph.SE_SUN, swisseph.SEFLG_SWIEPH);
    const moonR = swisseph.swe_calc_ut(t, swisseph.SE_MOON, swisseph.SEFLG_SWIEPH);
    const sunS = getSiderealLong(sunR.longitude, ayan);
    const moonS = getSiderealLong(moonR.longitude, ayan);
    let diff = moonS - sunS; if (diff < 0) diff += 360;
    let yogaSum = sunS + moonS; if (yogaSum >= 360) yogaSum -= 360;
    let moonC = moonS;
    if (samples.length > 0) {
      // Unwrap: these quantities are monotonically increasing (mod 360) over a day.
      while (diff < prevDiff - 0.01) diff += 360;
      while (moonC < prevMoon - 0.01) moonC += 360;
      while (yogaSum < prevYoga - 0.01) yogaSum += 360;
    }
    samples.push({ jd: t, diffC: diff, moonC, yogaC: yogaSum });
    prevDiff = diff; prevMoon = moonC; prevYoga = yogaSum;
  }

  const jdToLocalMinutes = (jdUT: number) => {
    // Return minutes past local midnight on the sunrise day (can exceed 1440 for ghatika-style display).
    return (jdUT - dayStartJD) * 24 * 60 + timezone * 60;
  };
  const formatHHMM = (jdUT: number) => {
    const totalMin = Math.round(jdToLocalMinutes(jdUT));
    const hours = Math.floor(totalMin / 60);
    const mins = ((totalMin % 60) + 60) % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };
  const findCrossings = (field: "diffC" | "moonC" | "yogaC", stepDeg: number) => {
    const out: { jdEnd: number; fromIdx: number; toIdx: number }[] = [];
    for (let i = 1; i < samples.length; i++) {
      const a = samples[i - 1][field];
      const b = samples[i][field];
      const idxA = Math.floor(a / stepDeg);
      const idxB = Math.floor(b / stepDeg);
      for (let k = idxA + 1; k <= idxB; k++) {
        const target = k * stepDeg;
        const frac = (target - a) / (b - a);
        const jdEnd = samples[i - 1].jd + frac * (samples[i].jd - samples[i - 1].jd);
        out.push({ jdEnd, fromIdx: k - 1, toIdx: k });
      }
    }
    return out;
  };

  const tithiCross = findCrossings("diffC", 12);
  const karanaCross = findCrossings("diffC", 6);
  const nakCross = findCrossings("moonC", NAK_STEP);
  const yogaCross = findCrossings("yogaC", NAK_STEP);
  const moonRashiCross = findCrossings("moonC", RASHI_STEP);

  const tithiEnd = tithiCross[0] ? formatHHMM(tithiCross[0].jdEnd) : null;
  const karanaEnd = karanaCross[0] ? formatHHMM(karanaCross[0].jdEnd) : null;
  const yogaEnd = yogaCross[0] ? formatHHMM(yogaCross[0].jdEnd) : null;
  const moonRashiEnd = moonRashiCross[0] ? formatHHMM(moonRashiCross[0].jdEnd) : null;
  const sunriseMin = timezone * 60 + sunriseHourUTC * 60;
  const nextSunriseMin = sunriseMin + 24 * 60;

  // Build karana list (current at sunrise + each subsequent karana up to next sunrise).
  // BPHS sequence — for karana index k ∈ [0,59]: 0 Kimstughna (first half of Shukla Pratipada),
  // 1-56 movable (7-cycle Bava/Balava/Kaulava/Taitila/Gara/Vanija/Vishti), 57 Shakuni,
  // 58 Chatushpada, 59 Naga.
  const movableKaranaNames = ["बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टी"];
  const karanaNameFor = (absIdx: number): string => {
    const k = ((absIdx % 60) + 60) % 60;
    if (k === 0) return "किंस्तुघ्न";
    if (k <= 56) return movableKaranaNames[(k - 1) % 7];
    if (k === 57) return "शकुनी";
    if (k === 58) return "चतुष्पाद";
    return "नाग";
  };
  const karanaList: { name: string; end: string | null }[] = [];
  karanaList.push({
    name: karanaName,
    end: karanaCross[0] ? formatHHMM(karanaCross[0].jdEnd) : null,
  });
  for (let i = 0; i < karanaCross.length; i++) {
    const c = karanaCross[i];
    const endMin = jdToLocalMinutes(c.jdEnd);
    if (endMin <= sunriseMin) continue;
    if (endMin > nextSunriseMin) break;
    const nextKarana = karanaNameFor(c.toIdx);
    const laterCross = karanaCross[i + 1];
    const lastInList = karanaList[karanaList.length - 1];
    if (lastInList.name !== nextKarana) {
      karanaList.push({
        name: nextKarana,
        end: laterCross ? formatHHMM(laterCross.jdEnd) : null,
      });
    }
  }

  // Nakshatras that touch the 24h window starting at sunrise.
  // Include current nakshatra + any that moon enters before next sunrise.
  const nakshatraList: { name: string; nameEn: string; end: string | null }[] = [];
  // Current nakshatra (from sunrise): end time is first nakCross if any, else null
  nakshatraList.push({
    name: NAKSHATRAS[nakIndex].mr,
    nameEn: NAKSHATRAS[nakIndex].en,
    end: nakCross[0] ? formatHHMM(nakCross[0].jdEnd) : null,
  });
  for (const c of nakCross) {
    const endMin = jdToLocalMinutes(c.jdEnd);
    if (endMin <= sunriseMin) continue;
    if (endMin > nextSunriseMin) break;
    const nextIdx = c.toIdx % 27;
    if (nakshatraList.length === 0 || nakshatraList[nakshatraList.length - 1].nameEn !== NAKSHATRAS[nextIdx].en) {
      // This crossing ends the current-in-list nakshatra at c.jdEnd; push the next one
      // with its own end time (if available from a later crossing).
      const laterCross = nakCross.find((x) => x.jdEnd > c.jdEnd + 1e-6);
      nakshatraList.push({
        name: NAKSHATRAS[nextIdx].mr,
        nameEn: NAKSHATRAS[nextIdx].en,
        end: laterCross ? formatHHMM(laterCross.jdEnd) : null,
      });
    }
  }

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
    rahuKaal: rahuKaalStr,
    gulikaKaal: gulikaKaalStr,
    yamaganda: yamagandaStr,
    masa: masaNames[sunRashi],
    moonRashi: RASHIS[getRashiIndex(moonSid)].mr,
    sunRashi: RASHIS[sunRashi].mr,
    sunrise: `${String(sunriseH).padStart(2, "0")}:${String(sunriseM).padStart(2, "0")}`,
    sunset: `${String(sunsetH).padStart(2, "0")}:${String(sunsetM).padStart(2, "0")}`,
    tithiEnd,
    karanaEnd,
    yogaEnd,
    moonRashiEnd,
    nakshatras: nakshatraList,
    karanas: karanaList,
  };
}
