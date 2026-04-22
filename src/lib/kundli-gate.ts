/**
 * Kundli generation gating. Enforces KUNDLI_LIMITS per tier on the
 * /api/kundli endpoint. Logged-in users are tracked in the
 * kundli_generations table; anonymous users are rate-limited by IP.
 */

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, kundliGenerations } from "@/lib/db/schema";
import { and, eq, gte } from "drizzle-orm";
import { KUNDLI_LIMITS, type Plan } from "@/lib/pricing";
import type { NextRequest } from "next/server";

/** IST day string YYYY-MM-DD. Using a fixed UTC+5:30 offset so rate limits
 *  reset at midnight India time regardless of server tz. */
function istDate(d: Date = new Date()): string {
  const ms = d.getTime() + 5.5 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

function istYearMonth(d: Date = new Date()): string {
  return istDate(d).slice(0, 7);
}

export interface GateResult {
  ok: boolean;
  /** Reason for a 429/403 — null when ok. */
  reason?: "anon_day_limit" | "day_limit" | "month_limit" | "period_limit";
  /** Human-readable message safe to show to the user. */
  message?: string;
  /** Plan used for the check (for logging / response). */
  plan: Plan;
  /** User id, or null when anonymous. */
  userId: string | null;
}

/* ─── Anonymous IP-based rate limit (in-memory, best-effort) ───── */

// Simple LRU-ish map keyed by IP+date. Resets when process restarts.
// For production hardening, swap to Vercel KV / Redis. Phase 1 accepts
// the laxness since most usage is authed.
const anonHits = new Map<string, number>();
const ANON_MAX_KEYS = 5000;
function anonKey(ip: string, date: string) {
  return `${ip}:${date}`;
}

function bumpAnonHit(ip: string, date: string): number {
  if (anonHits.size > ANON_MAX_KEYS) {
    // Drop oldest 20% to cap memory on bot traffic
    const drop = Math.floor(ANON_MAX_KEYS * 0.2);
    let i = 0;
    for (const k of anonHits.keys()) {
      if (i++ >= drop) break;
      anonHits.delete(k);
    }
  }
  const k = anonKey(ip, date);
  const next = (anonHits.get(k) ?? 0) + 1;
  anonHits.set(k, next);
  return next;
}

function getClientIp(req: NextRequest | Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  return fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anon";
}

/* ─── Main entry ─────────────────────────────────────────────── */

/** Check whether the current caller may generate one more kundli.
 *  Call BEFORE the expensive compute so we reject early.
 *
 *  - Anon users get the "free" limit, rate-limited by IP.
 *  - Authed users are gated by their plan, tracked in kundli_generations.
 *  - Starter's perPeriod cap is tied to their current paid window
 *    (users.planExpiresAt back-dated by starter's 30-day span). */
export async function checkKundliQuota(
  req: NextRequest | Request,
): Promise<GateResult> {
  const session = await auth();

  /* ─── Anonymous path ─── */
  if (!session?.user?.email) {
    const ip = getClientIp(req);
    const today = istDate();
    const count = bumpAnonHit(ip, today);
    const limit = KUNDLI_LIMITS.free.perDay ?? Infinity;
    if (count > limit) {
      return {
        ok: false,
        plan: "free",
        userId: null,
        reason: "anon_day_limit",
        message: `Free users get ${limit} kundli/day. Sign up for more or upgrade to Premium.`,
      };
    }
    return { ok: true, plan: "free", userId: null };
  }

  /* ─── Authed path ─── */
  const user = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });
  if (!user) return { ok: true, plan: "free", userId: null };

  // Treat expired paid plans as free — downgrade at read time so we don't
  // need a cron just to flip the flag.
  const plan = effectivePlan(user.plan as Plan, user.planExpiresAt);
  const limits = KUNDLI_LIMITS[plan];

  // perDay check
  if (limits.perDay !== null) {
    const today = istDate();
    const rows = await db.query.kundliGenerations.findMany({
      where: and(
        eq(kundliGenerations.userId, user.id),
        eq(kundliGenerations.date, today),
      ),
    });
    if (rows.length >= limits.perDay) {
      return {
        ok: false,
        plan,
        userId: user.id,
        reason: "day_limit",
        message: `You've hit today's limit (${limits.perDay}/day on ${plan}). Upgrade for more.`,
      };
    }
  }

  // perMonth check
  if (limits.perMonth !== null) {
    const ym = istYearMonth();
    const rows = await db.query.kundliGenerations.findMany({
      where: and(
        eq(kundliGenerations.userId, user.id),
        eq(kundliGenerations.yearMonth, ym),
      ),
    });
    if (rows.length >= limits.perMonth) {
      return {
        ok: false,
        plan,
        userId: user.id,
        reason: "month_limit",
        message: `You've used all ${limits.perMonth} kundlis for this month on ${plan}. Upgrade to Plus for unlimited.`,
      };
    }
  }

  // perPeriod check — only Starter right now (1 kundli for the 30-day pass).
  // Count generations since plan started.
  if (limits.perPeriod !== null) {
    const periodStart = planPeriodStart(user.planExpiresAt, /* expiryDays */ 30);
    if (periodStart) {
      const rows = await db
        .select({ id: kundliGenerations.id })
        .from(kundliGenerations)
        .where(
          and(
            eq(kundliGenerations.userId, user.id),
            gte(kundliGenerations.createdAt, periodStart),
          ),
        );
      if (rows.length >= limits.perPeriod) {
        return {
          ok: false,
          plan,
          userId: user.id,
          reason: "period_limit",
          message: `Starter includes ${limits.perPeriod} detailed kundli. Upgrade to Premium for unlimited.`,
        };
      }
    }
  }

  return { ok: true, plan, userId: user.id };
}

/** Record a successful generation. Call AFTER the kundli is returned so we
 *  don't count failures against the user's quota. */
export async function recordGeneration(
  userId: string,
  plan: Plan,
  kundliId?: string,
): Promise<void> {
  const now = new Date();
  await db.insert(kundliGenerations).values({
    id: crypto.randomUUID(),
    userId,
    date: istDate(now),
    yearMonth: istYearMonth(now),
    plan,
    kundliId: kundliId ?? null,
    createdAt: now.toISOString(),
  });
}

/* ─── Helpers ─────────────────────────────────────────────────── */

function effectivePlan(plan: Plan | null | undefined, expiresAt: string | null | undefined): Plan {
  if (!plan || plan === "free") return "free";
  if (!expiresAt) return plan;
  if (new Date(expiresAt).getTime() < Date.now()) return "free";
  return plan;
}

/** planExpiresAt is end of period; work backwards `expiryDays` to get start.
 *  Returns ISO date or null if no expiry. */
function planPeriodStart(expiresAt: string | null | undefined, expiryDays: number): string | null {
  if (!expiresAt) return null;
  const end = new Date(expiresAt);
  end.setDate(end.getDate() - expiryDays);
  return end.toISOString();
}
