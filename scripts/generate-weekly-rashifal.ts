/**
 * Weekly rashifal generator — cron entry point (newspaper Sunday model).
 *
 * Usage:
 *   tsx scripts/generate-weekly-rashifal.ts              # next Monday's week (×12 rashis)
 *   tsx scripts/generate-weekly-rashifal.ts 2026-04-27   # explicit week start
 *   tsx scripts/generate-weekly-rashifal.ts --rashi 10   # single rashi, current+next week
 *   tsx scripts/generate-weekly-rashifal.ts --force      # regenerate even if exists
 *
 * Cron (server, newspaper Sunday model):
 *   0 3 * * 0 cd /path/to/venkaa-kundali && /usr/bin/env tsx scripts/generate-weekly-rashifal.ts >> /var/log/rashifal-weekly.log 2>&1
 */

import * as dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config({ path: path.join(process.cwd(), ".env") });

import { eq, and } from "drizzle-orm";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { nanoid } from "nanoid";
import { weeklyRashifal } from "../src/lib/db/schema";
import { computeWeeklyForecast, getWeekStart } from "../src/lib/astrology/gochar-weekly";
import { generateWeeklyRashifal } from "../src/lib/astrology/llm-weekly-rashifal";

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let specificWeek: string | null = null;
  let specificRashi: number | null = null;
  let force = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--rashi") {
      specificRashi = parseInt(args[++i], 10);
    } else if (args[i] === "--force") {
      force = true;
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(args[i])) {
      specificWeek = args[i];
    }
  }
  return { specificWeek, specificRashi, force };
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠ GEMINI_API_KEY not set — all runs will use template fallback.");
  }

  const { specificWeek, specificRashi, force } = parseArgs();

  // Determine target weeks (Mondays).
  const weekStarts: Date[] = [];
  if (specificWeek) {
    const [y, m, d] = specificWeek.split("-").map(Number);
    weekStarts.push(getWeekStart(new Date(y, m - 1, d)));
  } else {
    // Newspaper default: NEXT Monday only (no buffer — weekly publish Sun for upcoming Mon-Sun).
    const now = new Date();
    const istNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Jump to tomorrow → getWeekStart returns next Monday when run Sun-Sat.
    const tomorrow = new Date(istNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextMonday = getWeekStart(tomorrow);
    weekStarts.push(nextMonday);
  }

  const rashis = specificRashi !== null ? [specificRashi] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const sqlite = new Database("./data/app.db");
  const db = drizzle(sqlite);

  let generated = 0, skipped = 0, llm = 0, fallback = 0;

  for (const weekStart of weekStarts) {
    const weekStartStr = fmtDate(weekStart);
    console.log(`\n══ Week starting ${weekStartStr} ══`);

    const forecast = computeWeeklyForecast(weekStart);

    for (const rashiId of rashis) {
      if (!force) {
        const existing = db
          .select()
          .from(weeklyRashifal)
          .where(and(eq(weeklyRashifal.weekStart, weekStartStr), eq(weeklyRashifal.rashiId, rashiId)))
          .limit(1)
          .all();
        if (existing.length > 0) {
          skipped++;
          continue;
        }
      }

      const rashiResult = forecast.predictions[rashiId];
      if (!rashiResult) {
        console.warn(`  ⚠ No forecast for rashi ${rashiId}`);
        continue;
      }

      console.log(`→ ${weekStartStr} rashi ${rashiId} (${rashiResult.rashiMr})...`);
      const result = await generateWeeklyRashifal(
        rashiResult,
        forecast.events,
        forecast.weekStart,
        forecast.weekEnd,
      );

      if (result.source === "llm-validated") llm++;
      else fallback++;

      // Upsert: delete existing first if --force, then insert.
      if (force) {
        db.delete(weeklyRashifal)
          .where(and(eq(weeklyRashifal.weekStart, weekStartStr), eq(weeklyRashifal.rashiId, rashiId)))
          .run();
      }

      db.insert(weeklyRashifal).values({
        id: nanoid(),
        weekStart: weekStartStr,
        weekEnd: forecast.weekEnd,
        rashiId,
        rashiMr: rashiResult.rashiMr,
        summary: result.summary,
        narrative: result.narrative,
        careerPointsJson: JSON.stringify(result.careerPoints),
        lovePointsJson: JSON.stringify(result.lovePoints),
        healthPointsJson: JSON.stringify(result.healthPoints),
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
  console.log(`Generated:         ${generated}`);
  console.log(`Skipped (exists):  ${skipped}`);
  console.log(`  LLM-validated:    ${llm}`);
  console.log(`  Template fallback: ${fallback}`);
}

main().catch((err) => {
  console.error("Weekly rashifal generator failed:", err);
  process.exit(1);
});
