import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

/**
 * Email Analytics Helpers
 */

import { emailEngagementMetrics } from "../drizzle/schema";
import { desc, sum, count, and, gte } from "drizzle-orm";

export async function getEmailAnalytics(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email analytics: database not available");
    return null;
  }

  try {
    // Get email metrics for the user
    const metrics = await db
      .select({
        totalEmails: count(),
        totalOpens: sum(emailEngagementMetrics.openCount),
        totalClicks: sum(emailEngagementMetrics.clickCount),
        deliveredCount: count(emailEngagementMetrics.deliveredAt),
        bouncedCount: count(emailEngagementMetrics.bounced),
        complainedCount: count(emailEngagementMetrics.complained),
        failedCount: count(emailEngagementMetrics.failed),
      })
      .from(emailEngagementMetrics)
      .where(eq(emailEngagementMetrics.userId, userId));

    if (metrics.length === 0) {
      return {
        totalEmails: 0,
        totalOpens: 0,
        totalClicks: 0,
        deliveredCount: 0,
        bouncedCount: 0,
        complainedCount: 0,
        failedCount: 0,
        openRate: 0,
        clickRate: 0,
      };
    }

    const data = metrics[0];
    const totalEmails = data.totalEmails || 0;
    const totalOpens = Number(data.totalOpens) || 0;
    const totalClicks = Number(data.totalClicks) || 0;

    return {
      totalEmails,
      totalOpens,
      totalClicks,
      deliveredCount: data.deliveredCount || 0,
      bouncedCount: data.bouncedCount || 0,
      complainedCount: data.complainedCount || 0,
      failedCount: data.failedCount || 0,
      openRate: totalEmails > 0 ? (totalOpens / totalEmails) * 100 : 0,
      clickRate: totalEmails > 0 ? (totalClicks / totalEmails) * 100 : 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get email analytics:", error);
    return null;
  }
}

export async function getEmailMetricsByType(userId: number, emailType: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email metrics: database not available");
    return [];
  }

  try {
    return await db
      .select()
      .from(emailEngagementMetrics)
      .where(
        and(
          eq(emailEngagementMetrics.userId, userId),
          eq(emailEngagementMetrics.emailType, emailType as any)
        )
      )
      .orderBy(desc(emailEngagementMetrics.sentAt));
  } catch (error) {
    console.error("[Database] Failed to get email metrics by type:", error);
    return [];
  }
}

export async function getRecentEmailMetrics(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get recent email metrics: database not available");
    return [];
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await db
      .select()
      .from(emailEngagementMetrics)
      .where(
        and(
          eq(emailEngagementMetrics.userId, userId),
          gte(emailEngagementMetrics.sentAt, startDate)
        )
      )
      .orderBy(desc(emailEngagementMetrics.sentAt));
  } catch (error) {
    console.error("[Database] Failed to get recent email metrics:", error);
    return [];
  }
}

export async function createEmailEngagementRecord(
  userId: number,
  emailId: string,
  emailType: string,
  recipientEmail: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create email engagement record: database not available");
    return null;
  }

  try {
    const result = await db
      .insert(emailEngagementMetrics)
      .values({
        userId,
        emailId,
        emailType: emailType as any,
        recipientEmail,
        sentAt: new Date(),
      });

    return result;
  } catch (error) {
    console.error("[Database] Failed to create email engagement record:", error);
    return null;
  }
}
