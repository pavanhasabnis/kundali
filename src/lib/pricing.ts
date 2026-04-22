/**
 * Pricing source of truth. All tiers, billing cycles, amounts (paise),
 * kundli limits, expiry-day calculations, and upgrade logic live here.
 *
 * Exported to UI (pricing-client, account) and API (payment/create,
 * payment/verify, kundli-gate). Changes here propagate everywhere.
 */

export type Plan = "free" | "starter" | "premium" | "plus" | "family";
export type BillingCycle = "monthly" | "yearly" | "onetime";

export interface TierConfig {
  plan: Plan;
  cycle: BillingCycle;
  /** Price in paise. 0 = free. */
  amount: number;
  /** Display price in rupees for UI — derived, not authoritative. */
  rupees: number;
  /** How long the plan entitles access after successful payment. */
  expiryDays: number;
  /** Shown strikethrough on yearly cards to dramatize savings. */
  monthlyEquivalentRupees?: number;
  /** Order descriptor on Razorpay + payment table. */
  description: string;
  /** Short internal tag used in DB plan column. Combines plan + cycle for
   *  unique identification in payment records. */
  tag: string;
}

/* ─── Tier matrix ────────────────────────────────────────────── */

export const TIERS: Record<string, TierConfig> = {
  // Starter is one-time purchase — unlocks 1 detailed kundli + 1 matching
  // for 30 days. Users who upgrade to Premium within 30 days get ₹99 credit.
  "starter:onetime": {
    plan: "starter",
    cycle: "onetime",
    amount: 9900,
    rupees: 99,
    expiryDays: 30,
    description: "Starter — 1 detailed kundli + 1 matching",
    tag: "starter",
  },

  "premium:monthly": {
    plan: "premium",
    cycle: "monthly",
    amount: 59900,
    rupees: 599,
    expiryDays: 30,
    description: "Premium Monthly — ₹599/month",
    tag: "premium",
  },
  "premium:yearly": {
    plan: "premium",
    cycle: "yearly",
    amount: 499900,
    rupees: 4999,
    expiryDays: 365,
    monthlyEquivalentRupees: 7188, // 12 × 599
    description: "Premium Yearly — ₹4,999/year (save 30%)",
    tag: "premium_yearly",
  },

  "plus:monthly": {
    plan: "plus",
    cycle: "monthly",
    amount: 149900,
    rupees: 1499,
    expiryDays: 30,
    description: "Plus Monthly — ₹1,499/month",
    tag: "plus",
  },
  "plus:yearly": {
    plan: "plus",
    cycle: "yearly",
    amount: 1299900,
    rupees: 12999,
    expiryDays: 365,
    monthlyEquivalentRupees: 17988,
    description: "Plus Yearly — ₹12,999/year (save 28%)",
    tag: "plus_yearly",
  },

  // Family plan — 4 members under one account. Shares Premium entitlements
  // across seats. Seat mgmt lives on the users.familyOwnerId FK.
  "family:monthly": {
    plan: "family",
    cycle: "monthly",
    amount: 149900,
    rupees: 1499,
    expiryDays: 30,
    description: "Premium Family Monthly — 4 seats",
    tag: "family",
  },
  "family:yearly": {
    plan: "family",
    cycle: "yearly",
    amount: 1299900,
    rupees: 12999,
    expiryDays: 365,
    monthlyEquivalentRupees: 17988,
    description: "Premium Family Yearly — 4 seats",
    tag: "family_yearly",
  },
} as const;

/* ─── Kundli generation limits per tier ──────────────────────── */

export interface KundliLimit {
  /** null = unlimited. Positive = cap. */
  perDay: number | null;
  /** null = unlimited. Positive = cap per calendar month (IST). */
  perMonth: number | null;
  /** null = unlimited. Positive = cap for the whole subscription period. */
  perPeriod: number | null;
}

export const KUNDLI_LIMITS: Record<Plan, KundliLimit> = {
  free:    { perDay: 1,    perMonth: null, perPeriod: null },
  // Starter is a 30-day one-time pass. 30 detailed kundlis for the period.
  starter: { perDay: null, perMonth: null, perPeriod: 30 },
  premium: { perDay: null, perMonth: null, perPeriod: null },
  plus:    { perDay: null, perMonth: null, perPeriod: null },
  family:  { perDay: null, perMonth: null, perPeriod: null },
};

/* ─── Trial config ───────────────────────────────────────────── */

export const TRIAL = {
  /** Free trial days offered on Premium monthly signup. */
  premiumMonthlyDays: 7,
  /** Whether the trial requires a payment method upfront. */
  requiresCard: false,
} as const;

/* ─── Helpers ────────────────────────────────────────────────── */

export function tierKey(plan: Exclude<Plan, "free">, cycle: BillingCycle): string {
  return `${plan}:${cycle}`;
}

export function getTier(plan: Exclude<Plan, "free">, cycle: BillingCycle): TierConfig | null {
  return TIERS[tierKey(plan, cycle)] ?? null;
}

export function getTierByTag(tag: string): TierConfig | null {
  const found = Object.values(TIERS).find((t) => t.tag === tag);
  return found ?? null;
}

/** Compute the expiry ISO timestamp for a tier starting from `from` (default: now).
 *  Used by payment/verify to stamp users.planExpiresAt. */
export function computeExpiryISO(tier: TierConfig, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + tier.expiryDays);
  return d.toISOString();
}

/** The set of valid tag values written into the `payments.plan` column.
 *  Used in payment/verify to detect subscription vs one-time product payments. */
export const SUBSCRIPTION_TAGS = new Set(
  Object.values(TIERS).map((t) => t.tag),
);

/** Map tag → the base plan (so we can assign users.plan cleanly regardless
 *  of billing cycle). Yearly and monthly both yield "premium", "plus", etc. */
export function planFromTag(tag: string): Plan | null {
  const tier = getTierByTag(tag);
  return tier?.plan ?? null;
}

/** Clean ordered list for UI rendering. */
export const TIER_ORDER: Plan[] = ["free", "starter", "premium", "plus", "family"];
