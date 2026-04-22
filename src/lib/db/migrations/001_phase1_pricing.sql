-- Phase 1 pricing schema additions (run once; idempotent via PRAGMA check).
--
-- SQLite doesn't support ADD COLUMN IF NOT EXISTS before 3.35+, and we can't
-- rely on version. This script uses a migration marker table so it runs once.

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS __migrations (
  id TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Guard: only apply if not already run
-- (SQLite doesn't have variables; we rely on the main app's migrator to gate
--  on SELECT id FROM __migrations WHERE id='001_phase1_pricing'.)

ALTER TABLE users ADD COLUMN billing_cycle TEXT;
ALTER TABLE users ADD COLUMN trial_ends_at TEXT;
ALTER TABLE users ADD COLUMN family_owner_id TEXT;

CREATE TABLE IF NOT EXISTS kundli_generations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,
  year_month TEXT NOT NULL,
  plan TEXT NOT NULL,
  kundli_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kg_user_date ON kundli_generations (user_id, date);
CREATE INDEX IF NOT EXISTS idx_kg_user_month ON kundli_generations (user_id, year_month);

INSERT INTO __migrations (id) VALUES ('001_phase1_pricing');

COMMIT;
