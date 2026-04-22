/**
 * Daily rashifal generator — cron entry point.
 *
 * Usage:
 *   tsx scripts/generate-daily-rashifal.ts              # today + tomorrow
 *   tsx scripts/generate-daily-rashifal.ts 2026-04-22   # specific date only
 *   tsx scripts/generate-daily-rashifal.ts --rashi 10   # specific rashi only (all days)
 *
 * Cron (server):
 *   0 5 * * * cd /path/to/venkaa-kundali && /usr/bin/env tsx scripts/generate-daily-rashifal.ts >> /var/log/rashifal.log 2>&1
 */

import * as dotenv from "dotenv";
import path from "node:path";
// Load .env.local first (Next.js convention), then .env as fallback.
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { eq, and } from "drizzle-orm";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import swisseph from "swisseph";
import { dailyRashifal } from "../src/lib/db/schema";
import { calculateGochar, type TransitPlanet } from "../src/lib/astrology/gochar";
import { generateDailyRashifal } from "../src/lib/astrology/llm-rashifal";

const PLANET_IDS: { id: string; seId: number }[] = [
  { id: "Sun", seId: swisseph.SE_SUN },
  { id: "Moon", seId: swisseph.SE_MOON },
  { id: "Mars", seId: swisseph.SE_MARS },
  { id: "Mercury", seId: swisseph.SE_MERCURY },
  { id: "Jupiter", seId: swisseph.SE_JUPITER },
  { id: "Venus", seId: swisseph.SE_VENUS },
  { id: "Saturn", seId: swisseph.SE_SATURN },
  { id: "Rahu", seId: swisseph.SE_MEAN_NODE },
];

function getSid(trop: number, ayan: number): number {
  let s = trop - ayan;
  if (s < 0) s += 360;
  return s;
}

function computeTransits(date: Date): TransitPlanet[] {
  const jd = swisseph.swe_julday(
    date.getFullYear(), date.getMonth() + 1, date.getDate(),
    12 - 5.5, swisseph.SE_GREG_CAL,
  );
  swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0);
  const ayan = swisseph.swe_get_ayanamsa_ut(jd);

  const tp: TransitPlanet[] = [];
  let sunSid = 0;
  for (const pl of PLANET_IDS) {
    const r = swisseph.swe_calc_ut(jd, pl.seId, swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED);
    if (!("longitude" in r)) continue;
    const sid = getSid(r.longitude, ayan);
    const rashi = Math.floor(sid / 30);
    const speed = "longitudeSpeed" in r ? r.longitudeSpeed : 0;
    if (pl.id === "Sun") sunSid = sid;
    tp.push({
      id: pl.id, rashiIndex: rashi, sidLong: sid,
      degreeInSign: sid - rashi * 30, speed,
      isRetrograde: pl.id !== "Sun" && pl.id !== "Moon" && speed < 0,
      isCombust: false,
    });
  }
  const rahu = tp.find((p) => p.id === "Rahu")!;
  const ketuSid = (rahu.sidLong! + 180) % 360;
  tp.push({
    id: "Ketu",
    rashiIndex: Math.floor(ketuSid / 30),
    sidLong: ketuSid,
    degreeInSign: ketuSid - Math.floor(ketuSid / 30) * 30,
    speed: rahu.speed, isRetrograde: true, isCombust: false,
  });

  // Combustion
  const orb: Record<string, number> = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };
  for (const p of tp) {
    const o = orb[p.id];
    if (!o) continue;
    let diff = Math.abs(p.sidLong! - sunSid);
    if (diff > 180) diff = 360 - diff;
    if (diff <= o) p.isCombust = true;
  }
  return tp;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let specificDate: string | null = null;
  let specificRashi: number | null = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--rashi") {
      specificRashi = parseInt(args[++i], 10);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(args[i])) {
      specificDate = args[i];
    }
  }
  return { specificDate, specificRashi };
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠ GEMINI_API_KEY not set — all runs will use template fallback.");
  }

  const { specificDate, specificRashi } = parseArgs();

  // Dates to generate: today + tomorrow (1-day buffer for cron miss / short outage)
  const dates: Date[] = [];
  if (specificDate) {
    const [y, m, d] = specificDate.split("-").map(Number);
    dates.push(new Date(y, m - 1, d));
  } else {
    const now = new Date();
    for (let i = 0; i < 2; i++) {
      dates.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i));
    }
  }

  const rashis = specificRashi !== null ? [specificRashi] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const sqlite = new Database("./data/app.db");
  const db = drizzle(sqlite);

  let generated = 0, skipped = 0, llm = 0, fallback = 0, curated = 0;

  for (const date of dates) {
    const dateStr = fmtDate(date);
    const transits = computeTransits(date);

    for (const rashiId of rashis) {
      // Skip if already exists
      const existing = db
        .select()
        .from(dailyRashifal)
        .where(and(eq(dailyRashifal.date, dateStr), eq(dailyRashifal.rashiId, rashiId)))
        .limit(1)
        .all();
      if (existing.length > 0) {
        skipped++;
        continue;
      }

      const gochar = calculateGochar(transits, rashiId);
      const luckyColor = gochar.luckyColor.mr;
      const luckyNumber = gochar.luckyNumber;

      console.log(`→ ${dateStr} rashi ${rashiId} (${gochar.rashiMr})...`);
      const result = await generateDailyRashifal(
        date,
        rashiId,
        transits,
        gochar.narrative,
        luckyColor,
        luckyNumber,
      );

      if (result.source === "llm-validated") llm++;
      else if (result.source === "template-fallback") fallback++;
      else curated++;

      db.insert(dailyRashifal).values({
        id: nanoid(),
        date: dateStr,
        rashiId,
        rashiMr: gochar.rashiMr,
        overall: result.overall,
        career: result.career,
        love: result.love,
        health: result.health,
        advice: result.advice,
        luckyColor: result.luckyColor,
        luckyNumber: result.luckyNumber,
        rating: result.rating,
        source: result.source,
        auditJson: JSON.stringify(result.audit),
      }).run();
      generated++;

      console.log(`  ✓ ${result.source} (${result.audit.attempts ?? 1} attempt${result.audit.attempts !== 1 ? "s" : ""})`);
    }
  }

  sqlite.close();

  console.log(`\n── Summary ──`);
  console.log(`Generated:  ${generated}`);
  console.log(`Skipped (exists): ${skipped}`);
  console.log(`  LLM-validated:    ${llm}`);
  console.log(`  Curated:          ${curated}`);
  console.log(`  Template fallback: ${fallback}`);

  if (fallback > generated * 0.3) {
    console.warn(`\n⚠ High fallback rate (${Math.round(fallback * 100 / generated)}%) — review prompts/validator.`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
