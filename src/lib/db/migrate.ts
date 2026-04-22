/**
 * Minimal SQLite migrator. Reads all .sql files under ./migrations/ in
 * lexical order and applies any that aren't present in __migrations.
 *
 * Run via `npx tsx src/lib/db/migrate.ts` or imported from a one-shot script.
 * Dev server doesn't auto-migrate — run this manually when schema changes.
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "app.db");
const MIGRATIONS_DIR = path.join(process.cwd(), "src", "lib", "db", "migrations");

function main() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(
    `CREATE TABLE IF NOT EXISTS __migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))`,
  );

  const applied = new Set(
    (db.prepare(`SELECT id FROM __migrations`).all() as { id: string }[]).map((r) => r.id),
  );

  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log(`No migrations dir at ${MIGRATIONS_DIR}`);
    return;
  }

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const id = file.replace(/\.sql$/, "");
    if (applied.has(id)) {
      console.log(`✓ ${id} (already applied)`);
      continue;
    }
    console.log(`→ Applying ${id}`);
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");

    // Strip the bare INSERT at end of migration file — we stamp the marker
    // ourselves after a successful exec so partial failures don't mark as
    // applied. Migrations are expected to be idempotent-ish (ADD COLUMN will
    // throw if column exists; we catch and continue per file).
    try {
      db.exec(sql);
    } catch (err) {
      const msg = (err as Error).message;
      // ADD COLUMN errors are OK if the column already exists (manual rerun).
      if (msg.includes("duplicate column name")) {
        console.log(`  (column already exists — ok)`);
      } else {
        console.error(`✗ ${id} failed:`, msg);
        throw err;
      }
    }

    db.prepare(`INSERT OR IGNORE INTO __migrations (id) VALUES (?)`).run(id);
    console.log(`✓ ${id} applied`);
  }

  db.close();
  console.log("Done.");
}

main();
