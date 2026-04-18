/**
 * Subscription Management Database Helpers
 * Handles subscription tiers, user subscriptions, and usage tracking
 */

import { getDb } from "../db";
import {
  subscriptionTiers,
  userSubscriptions,
  usageTracking,
  readingRecommendations,
  type SubscriptionTier,
  type UserSubscription,
  type UsageTracking,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Initialize default subscription tiers
 */
export async function initializeSubscriptionTiers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(subscriptionTiers);
  if (existing.length > 0) return; // Already initialized

  const tiers = [
    {
      name: "Free",
      description: "Perfect for exploring tarot readings",
      monthlyPrice: "0",
      annualPrice: "0",
      features: ["5 readings per month", "Basic interpretations", "Archive access"],
      maxReadingsPerMonth: 5,
      maxComparisonsPerMonth: 2,
      pdfExportEnabled: false,
      recommendationsEnabled: false,
      prioritySupport: false,
    },
    {
      name: "Pro",
      description: "For serious spiritual practitioners",
      monthlyPrice: "9.99",
      annualPrice: "99.99",
      features: [
        "50 readings per month",
        "Advanced AI interpretations",
        "Comparison analysis",
        "PDF export",
        "Personalized recommendations",
        "Priority support",
      ],
      maxReadingsPerMonth: 50,
      maxComparisonsPerMonth: 20,
      pdfExportEnabled: true,
      recommendationsEnabled: true,
      prioritySupport: true,
    },
    {
      name: "Premium",
      description: "Unlimited access for dedicated seekers",
      monthlyPrice: "19.99",
      annualPrice: "199.99",
      features: [
        "Unlimited readings",
        "Advanced AI interpretations",
        "Unlimited comparisons",
        "PDF export",
        "Personalized recommendations",
        "Priority support",
        "Community forum access",
        "Custom spreads",
      ],
      maxReadingsPerMonth: -1, // Unlimited
      maxComparisonsPerMonth: -1,
      pdfExportEnabled: true,
      recommendationsEnabled: true,
      prioritySupport: true,
    },
  ];

  for (const tier of tiers) {
    await db.insert(subscriptionTiers).values({
      ...tier,
      features: JSON.stringify(tier.features),
    } as any);
  }
}

/**
 * Get subscription tier by ID
 */
export async function getSubscriptionTier(tierId: number): Promise<SubscriptionTier | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(subscriptionTiers).where(eq(subscriptionTiers.id, tierId));
  return result[0] || null;
}

/**
 * Get subscription tier by name
 */
export async function getSubscriptionTierByName(name: string): Promise<SubscriptionTier | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(subscriptionTiers)
    .where(eq(subscriptionTiers.name, name));
  return result[0] || null;
}

/**
 * Get all subscription tiers
 */
export async function getAllSubscriptionTiers(): Promise<SubscriptionTier[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptionTiers);
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));
  return result[0] || null;
}

/**
 * Get user's subscription tier
 */
export async function getUserSubscriptionTier(userId: number): Promise<SubscriptionTier | null> {
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    // Return free tier by default
    return getSubscriptionTierByName("Free");
  }
  return getSubscriptionTier(subscription.tierId);
}

/**
 * Create or update user subscription
 */
export async function upsertUserSubscription(
  userId: number,
  tierId: number,
  data: Partial<UserSubscription>
) {
  const db = await getDb();
  if (!db) return;
  const existing = await getUserSubscription(userId);

  if (existing) {
    await db
      .update(userSubscriptions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));
  } else {
    await db.insert(userSubscriptions).values({
      userId,
      tierId,
      ...data,
    } as any);
  }
}

/**
 * Get or create usage tracking for user
 */
export async function getOrCreateUsageTracking(userId: number): Promise<UsageTracking> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  let tracking = await db
    .select()
    .from(usageTracking)
    .where(eq(usageTracking.userId, userId));

  if (tracking.length === 0) {
    await db.insert(usageTracking).values({
      userId,
      readingsThisMonth: 0,
      comparisonsThisMonth: 0,
      pdfExportsThisMonth: 0,
      lastResetDate: new Date(),
    } as any);

    tracking = await db
      .select()
      .from(usageTracking)
      .where(eq(usageTracking.userId, userId));
  }

  return tracking[0];
}

/**
 * Check if user can perform action based on tier limits
 */
export async function canUserPerformAction(
  userId: number,
  action: "reading" | "comparison" | "pdfExport"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const tier = await getUserSubscriptionTier(userId);
  if (!tier) return false;

  const usage = await getOrCreateUsageTracking(userId);

  // Check if monthly limits apply
  const now = new Date();
  const lastReset = new Date(usage.lastResetDate);
  const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

  if (isNewMonth) {
    // Reset usage
    await db
      .update(usageTracking)
      .set({
        readingsThisMonth: 0,
        comparisonsThisMonth: 0,
        pdfExportsThisMonth: 0,
        lastResetDate: now,
      })
      .where(eq(usageTracking.userId, userId));
    return true; // New month, can perform action
  }

  // Check limits
  const readingsThisMonth = usage.readingsThisMonth ?? 0;
  const comparisonsThisMonth = usage.comparisonsThisMonth ?? 0;
  
  switch (action) {
    case "reading":
      return (tier.maxReadingsPerMonth ?? -1) === -1 || readingsThisMonth < (tier.maxReadingsPerMonth ?? 0);
    case "comparison":
      return (
        (tier.maxComparisonsPerMonth ?? -1) === -1 ||
        comparisonsThisMonth < (tier.maxComparisonsPerMonth ?? 0)
      );
    case "pdfExport":
      return tier.pdfExportEnabled ?? false;
    default:
      return false;
  }
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
  userId: number,
  action: "reading" | "comparison" | "pdfExport"
) {
  const db = await getDb();
  if (!db) return;
  const usage = await getOrCreateUsageTracking(userId);

  const updates: Record<string, number> = {};
  const readingsThisMonth = Number(usage.readingsThisMonth ?? 0);
  const comparisonsThisMonth = Number(usage.comparisonsThisMonth ?? 0);
  const pdfExportsThisMonth = Number(usage.pdfExportsThisMonth ?? 0);
  
  switch (action) {
    case "reading":
      updates.readingsThisMonth = readingsThisMonth + 1;
      break;
    case "comparison":
      updates.comparisonsThisMonth = comparisonsThisMonth + 1;
      break;
    case "pdfExport":
      updates.pdfExportsThisMonth = pdfExportsThisMonth + 1;
      break;
  }

  await db
    .update(usageTracking)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(usageTracking.userId, userId));
}

/**
 * Get user's usage stats
 */
export async function getUserUsageStats(userId: number) {
  const tier = await getUserSubscriptionTier(userId);
  const usage = await getOrCreateUsageTracking(userId);

  return {
    tier: tier?.name ?? "Free",
    readingsUsed: usage.readingsThisMonth ?? 0,
    readingsLimit: tier?.maxReadingsPerMonth ?? 0,
    comparisonsUsed: usage.comparisonsThisMonth || 0,
    comparisonsLimit: tier?.maxComparisonsPerMonth ?? 0,
    pdfExportsUsed: usage.pdfExportsThisMonth || 0,
    pdfExportEnabled: tier?.pdfExportEnabled ?? false,
    recommendationsEnabled: tier?.recommendationsEnabled ?? false,
  };
}

/**
 * Add reading recommendation
 */
export async function addReadingRecommendation(
  userId: number,
  cardId: number,
  cardName: string
) {
  const db = await getDb();
  if (!db) return;
  const existing = await db
    .select()
    .from(readingRecommendations)
    .where(
      and(
        eq(readingRecommendations.userId, userId),
        eq(readingRecommendations.cardId, cardId)
      )
    );

  if (existing.length > 0) {
    // Increment frequency
    const frequency = Number(existing[0].frequency ?? 0);
    const score = Number(existing[0].recommendationScore ?? 0);
    await db
      .update(readingRecommendations)
      .set({
        frequency: frequency + 1,
        lastAppeared: new Date(),
        recommendationScore: String(score + 0.1) as any,
      })
      .where(
        and(
          eq(readingRecommendations.userId, userId),
          eq(readingRecommendations.cardId, cardId)
        )
      );
  } else {
    await db.insert(readingRecommendations).values({
      userId,
      cardId,
      cardName,
      frequency: 1,
      lastAppeared: new Date(),
      recommendationScore: 1,
    } as any);
  }
}

/**
 * Get user's top recommended cards
 */
export async function getUserRecommendedCards(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  const recommendations = await db
    .select()
    .from(readingRecommendations)
    .where(eq(readingRecommendations.userId, userId))
    .orderBy((t: any) => t.recommendationScore)
    .limit(limit);

  return recommendations;
}
