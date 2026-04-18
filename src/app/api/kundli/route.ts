import { NextRequest, NextResponse } from "next/server";
import { calculateKundli } from "@/lib/astrology/calculator";
import {
  analyzePlanetaryStrength,
  detectYogas,
  detectDoshas,
  generateHousePredictions,
  interpretCurrentDasha,
  generateRemedies,
} from "@/lib/astrology/analysis";
import { calculateAllDivisionalCharts } from "@/lib/astrology/divisional";
import { calculateAllEnhancements } from "@/lib/astrology/enhancements";
import { detectMangalDosh, detectKalsarpDosh } from "@/lib/astrology/doshas-mh";
import { calculateShadBala } from "@/lib/astrology/shadbala";
import { calculateAshtakvarga } from "@/lib/astrology/ashtakvarga";
import { calculateSarvatobhadra } from "@/lib/astrology/sarvatobhadra";
import { calculateJaimini, calculateMitraShatru } from "@/lib/astrology/jaimini";
import { calculateGrahaYuddha, calculateCombustionDetails, calculateBhavaBala } from "@/lib/astrology/advanced";
import { analyzeMarriageTiming, analyzeCareerTiming } from "@/lib/astrology/timing";
import { calculateDeepDasha } from "@/lib/astrology/deep-dasha";
import { getNamesForPada } from "@/lib/astrology/names";
import { calculateUpagrahas, calculateGocharNaadi } from "@/lib/astrology/upagraha";
import { calculateVimshopakBala } from "@/lib/astrology/vimshopak";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, day, hour, minute, latitude, longitude, timezone } = body;

    if (!year || !month || !day || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = calculateKundli({
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: Number(hour || 0),
      minute: Number(minute || 0),
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone || 5.5),
    });

    // Calculate all divisional charts first (needed for yoga detection + shadbala)
    const divisionalCharts = calculateAllDivisionalCharts(result);
    const navamshaForYogas = divisionalCharts.find((c) => c.id === "navamsha");

    // Run all analysis
    const planetaryStrength = analyzePlanetaryStrength(result);
    const yogas = detectYogas(result, navamshaForYogas);
    const doshas = detectDoshas(result);
    const housePredictions = generateHousePredictions(result);
    const currentDasha = interpretCurrentDasha(result);
    const remedies = generateRemedies(result);

    // Calculate all enhancements (panchang, aspects, house lords, etc.)
    const enhancements = calculateAllEnhancements(result, divisionalCharts);

    // Maharashtra dosha detectors
    const mangalDosh = detectMangalDosh(result);
    const kalsarpDosh = detectKalsarpDosh(result);
    const shadBala = calculateShadBala(result, divisionalCharts);
    const ashtakvarga = calculateAshtakvarga(result);
    const sarvatobhadra = calculateSarvatobhadra(result);
    const navamshaChart = divisionalCharts.find((c) => c.id === "navamsha");
    const dwadashamshaChart = divisionalCharts.find((c) => c.id === "dwadashamsha");
    const jaimini = calculateJaimini(result, navamshaChart, dwadashamshaChart);
    const mitraShatru = calculateMitraShatru(result);
    const grahaYuddha = calculateGrahaYuddha(result);
    const combustionDetails = calculateCombustionDetails(result);
    const bhavaBala = calculateBhavaBala(result);
    const marriageTiming = analyzeMarriageTiming(result);
    const careerTiming = analyzeCareerTiming(result);
    const deepDasha = calculateDeepDasha(result);
    const namesSuggestion = getNamesForPada(result.moonNakshatra, result.moonPada);
    const upagrahas = calculateUpagrahas(result, enhancements.birthPanchang.sunrise, enhancements.birthPanchang.sunset);
    const gocharNaadi = calculateGocharNaadi(result);
    const vimshopakBala = calculateVimshopakBala(result, divisionalCharts);

    // Serialize dates in dasha
    const serialized = {
      ...result,
      dashas: result.dashas.map((d) => ({
        ...d,
        startDate: d.startDate.toISOString(),
        endDate: d.endDate.toISOString(),
        antardashas: d.antardashas.map((ad) => ({
          ...ad,
          startDate: ad.startDate.toISOString(),
          endDate: ad.endDate.toISOString(),
        })),
      })),
      analysis: {
        planetaryStrength,
        yogas,
        doshas,
        housePredictions,
        currentDasha,
        remedies,
      },
      divisionalCharts,
      enhancements,
      mangalDosh,
      kalsarpDosh,
      shadBala,
      ashtakvarga,
      sarvatobhadra,
      jaimini,
      mitraShatru,
      grahaYuddha,
      combustionDetails,
      bhavaBala,
      marriageTiming,
      careerTiming,
      deepDasha,
      namesSuggestion,
      upagrahas,
      gocharNaadi,
      vimshopakBala,
    };

    return NextResponse.json(serialized);
  } catch (error: unknown) {
    console.error("Kundli calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate kundli" },
      { status: 500 }
    );
  }
}
