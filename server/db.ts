import { eq, desc, gte, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emailEngagementMetrics } from "../drizzle/schema";
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

import { sum, count } from "drizzle-orm";

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


/**
 * Get user engagement metrics for all users (admin view)
 */
export async function getUserEngagementMetrics() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user engagement metrics: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        userId: emailEngagementMetrics.userId,
        userName: users.name,
        userEmail: users.email,
        totalEmails: sql<number>`COUNT(*)`,
        totalOpens: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END)`,
        totalClicks: sql<number>`SUM(${emailEngagementMetrics.clickCount})`,
        avgOpenCount: sql<number>`AVG(${emailEngagementMetrics.openCount})`,
        avgClickCount: sql<number>`AVG(${emailEngagementMetrics.clickCount})`,
        openRate: sql<number>`ROUND(SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`,
        clickRate: sql<number>`ROUND(SUM(${emailEngagementMetrics.clickCount}) * 100.0 / COUNT(*), 1)`,
        lastEngagementAt: sql<Date>`MAX(COALESCE(${emailEngagementMetrics.lastClickedAt}, ${emailEngagementMetrics.openedAt}))`,
      })
      .from(emailEngagementMetrics)
      .leftJoin(users, eq(emailEngagementMetrics.userId, users.id))
      .groupBy(emailEngagementMetrics.userId, users.id, users.name, users.email)
      .orderBy(desc(sql`SUM(${emailEngagementMetrics.clickCount})`));

    return result;
  } catch (error) {
    console.error("[Database] Failed to get user engagement metrics:", error);
    return [];
  }
}

/**
 * Get top engaged users (ranked by opens and clicks)
 */
export async function getTopEngagedUsers(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get top engaged users: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        userId: emailEngagementMetrics.userId,
        userName: users.name,
        userEmail: users.email,
        totalEmails: sql<number>`COUNT(*)`,
        totalOpens: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END)`,
        totalClicks: sql<number>`SUM(${emailEngagementMetrics.clickCount})`,
        openRate: sql<number>`ROUND(SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`,
        clickRate: sql<number>`ROUND(SUM(${emailEngagementMetrics.clickCount}) * 100.0 / COUNT(*), 1)`,
        engagementScore: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) + SUM(${emailEngagementMetrics.clickCount}) * 2`,
      })
      .from(emailEngagementMetrics)
      .leftJoin(users, eq(emailEngagementMetrics.userId, users.id))
      .groupBy(emailEngagementMetrics.userId, users.id, users.name, users.email)
      .orderBy(desc(sql`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) + SUM(${emailEngagementMetrics.clickCount}) * 2`))
      .limit(limit);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get top engaged users:", error);
    return [];
  }
}

/**
 * Get detailed engagement history for a specific user
 */
export async function getUserEngagementHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user engagement history: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        id: emailEngagementMetrics.id,
        emailId: emailEngagementMetrics.emailId,
        emailType: emailEngagementMetrics.emailType,
        recipientEmail: emailEngagementMetrics.recipientEmail,
        sentAt: emailEngagementMetrics.sentAt,
        deliveredAt: emailEngagementMetrics.deliveredAt,
        openedAt: emailEngagementMetrics.openedAt,
        openCount: emailEngagementMetrics.openCount,
        clickCount: emailEngagementMetrics.clickCount,
        lastClickedAt: emailEngagementMetrics.lastClickedAt,
        bounced: emailEngagementMetrics.bounced,
        complained: emailEngagementMetrics.complained,
        failed: emailEngagementMetrics.failed,
      })
      .from(emailEngagementMetrics)
      .where(eq(emailEngagementMetrics.userId, userId))
      .orderBy(desc(emailEngagementMetrics.sentAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get user engagement history:", error);
    return [];
  }
}

/**
 * Get user engagement stats for a specific user
 */
export async function getUserEngagementStats(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user engagement stats: database not available");
    return null;
  }

  try {
    const result = await db
      .select({
        userId: emailEngagementMetrics.userId,
        totalEmails: sql<number>`COUNT(*)`,
        totalOpens: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END)`,
        totalClicks: sql<number>`SUM(${emailEngagementMetrics.clickCount})`,
        avgOpenCount: sql<number>`AVG(${emailEngagementMetrics.openCount})`,
        avgClickCount: sql<number>`AVG(${emailEngagementMetrics.clickCount})`,
        openRate: sql<number>`ROUND(SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`,
        clickRate: sql<number>`ROUND(SUM(${emailEngagementMetrics.clickCount}) * 100.0 / COUNT(*), 1)`,
        lastEngagementAt: sql<Date>`MAX(COALESCE(${emailEngagementMetrics.lastClickedAt}, ${emailEngagementMetrics.openedAt}))`,
        bounceCount: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.bounced} = true THEN 1 ELSE 0 END)`,
        complaintCount: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.complained} = true THEN 1 ELSE 0 END)`,
      })
      .from(emailEngagementMetrics)
      .where(eq(emailEngagementMetrics.userId, userId))
      .groupBy(emailEngagementMetrics.userId);

    return result[0] || null;
  } catch (error) {
    console.error("[Database] Failed to get user engagement stats:", error);
    return null;
  }
}

/**
 * Get engagement metrics by email type for a specific user
 */
export async function getUserEngagementByEmailType(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user engagement by email type: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        emailType: emailEngagementMetrics.emailType,
        totalEmails: sql<number>`COUNT(*)`,
        totalOpens: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END)`,
        totalClicks: sql<number>`SUM(${emailEngagementMetrics.clickCount})`,
        openRate: sql<number>`ROUND(SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1)`,
        clickRate: sql<number>`ROUND(SUM(${emailEngagementMetrics.clickCount}) * 100.0 / COUNT(*), 1)`,
      })
      .from(emailEngagementMetrics)
      .where(eq(emailEngagementMetrics.userId, userId))
      .groupBy(emailEngagementMetrics.emailType)
      .orderBy(desc(sql`COUNT(*)`));

    return result;
  } catch (error) {
    console.error("[Database] Failed to get user engagement by email type:", error);
    return [];
  }
}

/**
 * Get engagement trends for a user over time
 */
export async function getUserEngagementTrends(userId: number, days: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user engagement trends: database not available");
    return [];
  }

  try {
    const result = await db
      .select({
        date: sql<string>`DATE(${emailEngagementMetrics.sentAt})`,
        emailCount: sql<number>`COUNT(*)`,
        openCount: sql<number>`SUM(CASE WHEN ${emailEngagementMetrics.openCount} > 0 THEN 1 ELSE 0 END)`,
        clickCount: sql<number>`SUM(${emailEngagementMetrics.clickCount})`,
      })
      .from(emailEngagementMetrics)
      .where(
        and(
          eq(emailEngagementMetrics.userId, userId),
          gte(emailEngagementMetrics.sentAt, sql`DATE_SUB(NOW(), INTERVAL ${days} DAY)`)
        )
      )
      .groupBy(sql`DATE(${emailEngagementMetrics.sentAt})`)
      .orderBy(sql`DATE(${emailEngagementMetrics.sentAt})`);

    return result;
  } catch (error) {
    console.error("[Database] Failed to get user engagement trends:", error);
    return [];
  }
}
