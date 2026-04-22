import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ── Users ──────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // nanoid or Google sub
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"), // bcrypt hash — null for Google-only users
  image: text("image"), // profile photo URL
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"), // ISO date
  birthTime: text("birth_time"), // HH:mm
  birthPlace: text("birth_place"),
  language: text("language").default("mr"), // mr | en
  role: text("role").default("user"), // user | admin
  plan: text("plan").default("free"), // free | starter | premium | plus | family
  planExpiresAt: text("plan_expires_at"), // ISO date for paid plans
  /** monthly | yearly | onetime (starter). Null for free users. */
  billingCycle: text("billing_cycle"),
  /** ISO date — end of free trial (Premium monthly signup). Null if never on trial. */
  trialEndsAt: text("trial_ends_at"),
  /** For Family plan seats — id of the owning user. Null for standalone users. */
  familyOwnerId: text("family_owner_id"),
  /** One-shot flag: once Starter's ₹99 credit is redeemed on upgrade, flip
   *  to 1. Prevents double-dipping across multiple Premium/Plus purchases. */
  starterCreditApplied: integer("starter_credit_applied", { mode: "boolean" }).default(false),
  provider: text("provider").default("google"), // google
  providerAccountId: text("provider_account_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Saved Kundlis ──────────────────────────────────────────────────
export const kundlis = sqliteTable("kundlis", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(), // person's name
  dateOfBirth: text("date_of_birth").notNull(),
  birthTime: text("birth_time").notNull(),
  birthPlace: text("birth_place").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  resultJson: text("result_json"), // cached kundli result
  pdfUrl: text("pdf_url"), // stored PDF path if any
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Payments ───────────────────────────────────────────────────────
export const payments = sqliteTable("payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  amount: integer("amount").notNull(), // in paise (e.g., 19900 = ₹199)
  currency: text("currency").default("INR"),
  plan: text("plan").notNull(), // premium
  status: text("status").default("created"), // created | paid | failed | refunded
  /** Paise deducted from order total — e.g. Starter ₹99 upgrade credit. Kept
   *  for audit + to drive the starterCreditApplied flip on capture. */
  discountAmount: integer("discount_amount").default(0),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Contact Enquiries ──────────────────────────────────────────────
export const contactEnquiries = sqliteTable("contact_enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default("unread"), // unread | read | replied
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Site Settings (key-value) ──────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(), // e.g., "banner_text", "banner_active", "seo_home_title"
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Travel Packages ───────────────────────────────────────────────
export const travelPackages = sqliteTable("travel_packages", {
  id: text("id").primaryKey(),
  titleMr: text("title_mr").notNull(),
  titleEn: text("title_en").notNull(),
  descriptionMr: text("description_mr"),
  descriptionEn: text("description_en"),
  category: text("category").notNull(), // jyotirlinga | char_dham | ashtavinayak | shakti_peeth | datta | panch_kedar | varanasi | rameshwaram | dwarka | shirdi | tirupati | pandharpur | local | custom
  duration: text("duration"), // e.g., "3 Days / 2 Nights"
  priceFrom: integer("price_from"), // starting price in rupees
  priceTo: integer("price_to"),
  inclusions: text("inclusions"), // JSON array of strings
  itineraryMr: text("itinerary_mr"), // markdown itinerary
  itineraryEn: text("itinerary_en"),
  highlights: text("highlights"), // JSON array of strings
  imageUrl: text("image_url"), // AI-generated or uploaded image
  locationMr: text("location_mr"),
  locationEn: text("location_en"),
  active: integer("active", { mode: "boolean" }).default(true),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Travel Enquiries ──────────────────────────────────────────────
export const travelEnquiries = sqliteTable("travel_enquiries", {
  id: text("id").primaryKey(),
  packageId: text("package_id").references(() => travelPackages.id),
  packageTitle: text("package_title"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  travelDate: text("travel_date"),
  travelers: integer("travelers").default(1),
  message: text("message"),
  status: text("status").default("new"), // new | contacted | confirmed | cancelled
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Kundli Generations (rate limit per tier) ─────────────────────
export const kundliGenerations = sqliteTable("kundli_generations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  /** YYYY-MM-DD (IST) — for perDay limit. */
  date: text("date").notNull(),
  /** YYYY-MM (IST) — for perMonth limit. */
  yearMonth: text("year_month").notNull(),
  /** Denormalised plan at time of generation, for audit + period counting. */
  plan: text("plan").notNull(),
  /** Optional — if persisted via /save, links to the kundli row. */
  kundliId: text("kundli_id"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Chat Usage (rate limit for kundli consultation chat) ──────────
export const chatUsage = sqliteTable("chat_usage", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  date: text("date").notNull(), // YYYY-MM-DD (IST)
  count: integer("count").notNull().default(0),
});

// ── Book Orders (printed bound kundli book shipped to user) ────────
export const bookOrders = sqliteTable("book_orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  kundliId: text("kundli_id").notNull().references(() => kundlis.id),
  kundliName: text("kundli_name").notNull(), // snapshot at order time
  recipientName: text("recipient_name").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pin: text("pin").notNull(),
  phone: text("phone").notNull(),
  planAtOrder: text("plan_at_order").notNull(), // free | premium | plus
  amountPaid: integer("amount_paid").notNull().default(0), // paise; 0 = free claim
  razorpayPaymentId: text("razorpay_payment_id"),
  status: text("status").notNull().default("pending"), // pending | printing | shipped | delivered | cancelled
  trackingNumber: text("tracking_number"),
  courier: text("courier"), // e.g., "Shiprocket", "DTDC"
  adminNotes: text("admin_notes"),
  shippedAt: text("shipped_at"),
  deliveredAt: text("delivered_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Daily Rashifal (LLM-generated Marathi prose cached per date per rashi) ──
export const dailyRashifal = sqliteTable("daily_rashifal", {
  id: text("id").primaryKey(),
  /** YYYY-MM-DD (IST) — the date the rashifal applies to. */
  date: text("date").notNull(),
  /** 0-11 — 0=Aries, 10=Aquarius, 11=Pisces. */
  rashiId: integer("rashi_id").notNull(),
  /** Rashi name (mr) for easy querying. */
  rashiMr: text("rashi_mr").notNull(),
  overall: text("overall").notNull(),
  career: text("career").notNull(),
  love: text("love").notNull(),
  health: text("health").notNull(),
  advice: text("advice"),
  luckyColor: text("lucky_color"),
  luckyNumber: integer("lucky_number"),
  rating: integer("rating"), // 1-5
  /** "llm-validated" | "template-fallback" */
  source: text("source").notNull(),
  /** JSON string: ground truth used + LLM input/output for audit. */
  auditJson: text("audit_json"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ── Weekly Rashifal (LLM-generated Marathi prose cached per week per rashi) ──
export const weeklyRashifal = sqliteTable("weekly_rashifal", {
  id: text("id").primaryKey(),
  /** YYYY-MM-DD (IST) — Monday of the week the rashifal applies to. */
  weekStart: text("week_start").notNull(),
  /** YYYY-MM-DD (IST) — Sunday = weekStart + 6. Denormalized for easy range checks. */
  weekEnd: text("week_end").notNull(),
  /** 0-11 — 0=Aries, 10=Aquarius, 11=Pisces. */
  rashiId: integer("rashi_id").notNull(),
  /** Rashi name (mr) for easy querying. */
  rashiMr: text("rashi_mr").notNull(),
  /** Short 2-3 line summary. */
  summary: text("summary").notNull(),
  /** Full 300-400 word narrative prose. */
  narrative: text("narrative").notNull(),
  /** JSON array of { day: "YYYY-MM-DD", text: "..." } — career bullets. */
  careerPointsJson: text("career_points_json").notNull(),
  /** JSON array — love bullets. */
  lovePointsJson: text("love_points_json").notNull(),
  /** JSON array — health bullets. */
  healthPointsJson: text("health_points_json").notNull(),
  advice: text("advice"),
  luckyColor: text("lucky_color"),
  luckyNumber: integer("lucky_number"),
  rating: integer("rating"),
  /** "llm-validated" | "template-fallback" | "curated" */
  source: text("source").notNull(),
  /** JSON — ground truth + raw LLM output for audit. */
  auditJson: text("audit_json"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// Type exports
export type User = typeof users.$inferSelect;
export type DailyRashifal = typeof dailyRashifal.$inferSelect;
export type NewDailyRashifal = typeof dailyRashifal.$inferInsert;
export type WeeklyRashifal = typeof weeklyRashifal.$inferSelect;
export type NewWeeklyRashifal = typeof weeklyRashifal.$inferInsert;
export type NewUser = typeof users.$inferInsert;
export type Kundli = typeof kundlis.$inferSelect;
export type NewKundli = typeof kundlis.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type ContactEnquiry = typeof contactEnquiries.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type TravelPackage = typeof travelPackages.$inferSelect;
export type NewTravelPackage = typeof travelPackages.$inferInsert;
export type TravelEnquiry = typeof travelEnquiries.$inferSelect;
export type ChatUsage = typeof chatUsage.$inferSelect;
export type NewChatUsage = typeof chatUsage.$inferInsert;
export type KundliGeneration = typeof kundliGenerations.$inferSelect;
export type NewKundliGeneration = typeof kundliGenerations.$inferInsert;
export type BookOrder = typeof bookOrders.$inferSelect;
export type NewBookOrder = typeof bookOrders.$inferInsert;
