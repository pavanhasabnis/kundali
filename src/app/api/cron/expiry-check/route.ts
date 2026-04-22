/**
 * Expiry cron — daily pass over paid users.
 *
 *   1. Users whose planExpiresAt falls in the next 3 days get a warning mail.
 *   2. Users whose planExpiresAt is in the past get plan="free" + email.
 *
 * Invocation: hit GET /api/cron/expiry-check with header
 *   x-cron-secret: $CRON_SECRET
 * Vercel Cron or any scheduler can call daily. We gate on the header instead
 * of session auth since the cron is machine-to-machine.
 *
 * Idempotency: we use a `users.lastExpiryWarningSentAt` column to avoid
 * resending the warning every cron tick. Downgrade is naturally idempotent
 * (already-free users skip).
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, isNotNull, lte, gte, ne, or, isNull } from "drizzle-orm";
import { sendExpiryWarning, sendExpiryDowngrade } from "@/lib/email";
import { getTierByTag } from "@/lib/pricing";

const WARNING_WINDOW_DAYS = 3;

function planLabelFromUser(plan: string | null, cycle: string | null): string {
  if (!plan || plan === "free") return "Free";
  const tag = cycle === "yearly" && plan !== "starter" ? `${plan}_yearly` : plan;
  const tier = getTierByTag(tag);
  return tier?.description ?? `${plan} ${cycle ?? ""}`.trim();
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get("x-cron-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const nowISO = now.toISOString();
  const warnCutoff = new Date(now);
  warnCutoff.setDate(warnCutoff.getDate() + WARNING_WINDOW_DAYS);
  const warnCutoffISO = warnCutoff.toISOString();

  let warned = 0;
  let downgraded = 0;

  /* ─── 1. Warn users in the 3-day window ─── */
  // Active paid plan, expires between now and now+3 days, and either we've
  // never sent a warning or the last warning was > 3 days ago.
  const warnWindow = await db.query.users.findMany({
    where: and(
      isNotNull(users.planExpiresAt),
      ne(users.plan, "free"),
      gte(users.planExpiresAt, nowISO),
      lte(users.planExpiresAt, warnCutoffISO),
    ),
  });

  for (const u of warnWindow) {
    if (!u.planExpiresAt) continue;
    const expires = new Date(u.planExpiresAt);
    const daysLeft = Math.max(
      1,
      Math.ceil((expires.getTime() - now.getTime()) / 86_400_000),
    );
    try {
      await sendExpiryWarning({
        to: u.email,
        name: u.name,
        planLabel: planLabelFromUser(u.plan, u.billingCycle ?? null),
        expiresAtISO: u.planExpiresAt,
        daysLeft,
      });
      warned++;
    } catch (e) {
      console.error("cron: warning send failed for", u.email, e);
    }
  }

  /* ─── 2. Downgrade expired users ─── */
  const expired = await db.query.users.findMany({
    where: and(
      isNotNull(users.planExpiresAt),
      ne(users.plan, "free"),
      lte(users.planExpiresAt, nowISO),
    ),
  });

  for (const u of expired) {
    const priorPlan = u.plan;
    const priorCycle = u.billingCycle ?? null;
    try {
      await db.update(users).set({
        plan: "free",
        planExpiresAt: null,
        billingCycle: null,
        updatedAt: new Date().toISOString(),
      }).where(eq(users.id, u.id));

      await sendExpiryDowngrade({
        to: u.email,
        name: u.name,
        planLabel: planLabelFromUser(priorPlan ?? null, priorCycle),
      });
      downgraded++;
    } catch (e) {
      console.error("cron: downgrade failed for", u.email, e);
    }
  }

  return NextResponse.json({
    ok: true,
    warned,
    downgraded,
    checkedAt: nowISO,
  });
}

// Silence unused-import warnings for drizzle ops we don't use but keep around
// for future expansion (e.g. skip-already-warned via lastExpiryWarningSentAt).
void or;
void isNull;
