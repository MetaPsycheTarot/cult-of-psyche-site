import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription tiers for monetization
 */
export const subscriptionTiers = mysqlTable("subscription_tiers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull(), // "Free", "Pro", "Premium"
  description: text("description"),
  monthlyPrice: decimal("monthlyPrice", { precision: 10, scale: 2 }).default("0"),
  annualPrice: decimal("annualPrice", { precision: 10, scale: 2 }).default("0"),
  features: json("features").$type<string[]>().default(sql`json_array()`),
  maxReadingsPerMonth: int("maxReadingsPerMonth").default(-1), // -1 = unlimited
  maxComparisonsPerMonth: int("maxComparisonsPerMonth").default(-1),
  pdfExportEnabled: boolean("pdfExportEnabled").default(false),
  recommendationsEnabled: boolean("recommendationsEnabled").default(false),
  prioritySupport: boolean("prioritySupport").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SubscriptionTier = typeof subscriptionTiers.$inferSelect;
export type InsertSubscriptionTier = typeof subscriptionTiers.$inferInsert;

/**
 * User subscriptions
 */
export const userSubscriptions = mysqlTable("user_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tierId: int("tierId").notNull().references(() => subscriptionTiers.id),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "paused"]).default("active"),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "annual"]).default("monthly"),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Usage tracking for rate limiting
 */
export const usageTracking = mysqlTable("usage_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  readingsThisMonth: int("readingsThisMonth").default(0),
  comparisonsThisMonth: int("comparisonsThisMonth").default(0),
  pdfExportsThisMonth: int("pdfExportsThisMonth").default(0),
  lastResetDate: timestamp("lastResetDate").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UsageTracking = typeof usageTracking.$inferSelect;
export type InsertUsageTracking = typeof usageTracking.$inferInsert;

/**
 * Reading recommendations based on user history
 */
export const readingRecommendations = mysqlTable("reading_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardId: int("cardId").notNull(),
  cardName: varchar("cardName", { length: 255 }).notNull(),
  frequency: int("frequency").default(0), // How many times this card appeared
  lastAppeared: timestamp("lastAppeared"),
  recommendationScore: decimal("recommendationScore", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReadingRecommendation = typeof readingRecommendations.$inferSelect;
export type InsertReadingRecommendation = typeof readingRecommendations.$inferInsert;
/**
 * Email engagement metrics for tracking opens and clicks
 */
export const emailEngagementMetrics = mysqlTable("email_engagement_metrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  emailId: varchar("emailId", { length: 255 }).notNull(), // Resend email ID
  emailType: mysqlEnum("emailType", ["welcome", "payment_confirmation", "referral_notification"]).notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  sentAt: timestamp("sentAt").notNull(),
  deliveredAt: timestamp("deliveredAt"),
  openedAt: timestamp("openedAt"),
  openCount: int("openCount").default(0),
  clickCount: int("clickCount").default(0),
  lastClickedAt: timestamp("lastClickedAt"),
  bounced: boolean("bounced").default(false),
  complained: boolean("complained").default(false),
  failed: boolean("failed").default(false),
  failureReason: text("failureReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmailEngagementMetric = typeof emailEngagementMetrics.$inferSelect;
export type InsertEmailEngagementMetric = typeof emailEngagementMetrics.$inferInsert;

/**
 * User notifications for in-app messaging
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["success", "error", "info", "warning"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  actionLabel: varchar("actionLabel", { length: 100 }),
  actionUrl: varchar("actionUrl", { length: 2048 }),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
