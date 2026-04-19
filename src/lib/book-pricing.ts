import { db } from "@/lib/db";
import { bookOrders } from "@/lib/db/schema";
import { and, eq, gte } from "drizzle-orm";

export const BOOK_BASE_PRICE = 79900;     // ₹799 non-subscriber
export const BOOK_PREMIUM_PRICE = 64900;  // ₹649 Premium or Plus-after-free-claim
export const BOOK_PLUS_FREE = 0;          // ₹0 Plus free yearly claim

export interface BookPrice {
  amount: number; // paise
  reason: "free_claim" | "premium_rate" | "base_rate";
  usedFreeClaim: boolean;
}

/**
 * Compute book order price for a user based on plan + prior free-claim usage.
 * Single source of truth for both /api/book-order and /api/payment/create.
 */
export async function getBookPriceForUser(userId: string, plan: string | null): Promise<BookPrice> {
  const yearStart = `${new Date().getUTCFullYear()}-01-01T00:00:00.000Z`;
  const priorFreeClaims = await db.query.bookOrders.findMany({
    where: and(
      eq(bookOrders.userId, userId),
      eq(bookOrders.planAtOrder, "plus"),
      gte(bookOrders.createdAt, yearStart),
    ),
  });
  const usedFreeClaim = priorFreeClaims.filter(o => o.amountPaid === 0 && o.status !== "cancelled").length > 0;

  if (plan === "plus" && !usedFreeClaim) {
    return { amount: BOOK_PLUS_FREE, reason: "free_claim", usedFreeClaim: false };
  }
  if (plan === "premium" || plan === "plus") {
    return { amount: BOOK_PREMIUM_PRICE, reason: "premium_rate", usedFreeClaim };
  }
  return { amount: BOOK_BASE_PRICE, reason: "base_rate", usedFreeClaim: false };
}
