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

    // Run all analysis
    const planetaryStrength = analyzePlanetaryStrength(result);
    const yogas = detectYogas(result);
    const doshas = detectDoshas(result);
    const housePredictions = generateHousePredictions(result);
    const currentDasha = interpretCurrentDasha(result);
    const remedies = generateRemedies(result);

    // Calculate all divisional charts
    const divisionalCharts = calculateAllDivisionalCharts(result);

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
