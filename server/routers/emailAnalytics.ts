import { router, protectedProcedure } from "../_core/trpc";
import {
  getEmailAnalytics,
  getEmailMetricsByType,
  getRecentEmailMetrics,
} from "../db";
import { z } from "zod";

export const emailAnalyticsRouter = router({
  /**
   * Get overall email analytics for the current user
   */
  getOverallAnalytics: protectedProcedure.query(async ({ ctx }) => {
    const analytics = await getEmailAnalytics(ctx.user.id);
    return analytics || {
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
  }),

  /**
   * Get email metrics by type (welcome, payment_confirmation, referral_notification)
   */
  getMetricsByType: protectedProcedure
    .input(
      z.object({
        emailType: z.enum(["welcome", "payment_confirmation", "referral_notification"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const metrics = await getEmailMetricsByType(ctx.user.id, input.emailType);
      return metrics.map((m) => ({
        id: m.id,
        emailId: m.emailId,
        emailType: m.emailType,
        recipientEmail: m.recipientEmail,
        sentAt: m.sentAt,
        deliveredAt: m.deliveredAt,
        openedAt: m.openedAt,
        openCount: m.openCount,
        clickCount: m.clickCount,
        lastClickedAt: m.lastClickedAt,
        bounced: m.bounced,
        complained: m.complained,
        failed: m.failed,
      }));
    }),

  /**
   * Get recent email metrics (last N days)
   */
  getRecentMetrics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const metrics = await getRecentEmailMetrics(ctx.user.id, input.days);
      return metrics.map((m) => ({
        id: m.id,
        emailId: m.emailId,
        emailType: m.emailType,
        recipientEmail: m.recipientEmail,
        sentAt: m.sentAt,
        deliveredAt: m.deliveredAt,
        openedAt: m.openedAt,
        openCount: m.openCount,
        clickCount: m.clickCount,
        lastClickedAt: m.lastClickedAt,
        bounced: m.bounced,
        complained: m.complained,
        failed: m.failed,
      }));
    }),

  /**
   * Get email engagement summary for dashboard
   */
  getEngagementSummary: protectedProcedure.query(async ({ ctx }) => {
    const analytics = await getEmailAnalytics(ctx.user.id);
    const recent = await getRecentEmailMetrics(ctx.user.id, 7);

    if (!analytics) {
      return {
        totalEmails: 0,
        openRate: 0,
        clickRate: 0,
        deliveryRate: 0,
        bounceRate: 0,
        recentEmails: [],
      };
    }

    const deliveryRate =
      analytics.totalEmails > 0
        ? ((analytics.deliveredCount / analytics.totalEmails) * 100).toFixed(1)
        : "0";

    const bounceRate =
      analytics.totalEmails > 0
        ? ((analytics.bouncedCount / analytics.totalEmails) * 100).toFixed(1)
        : "0";

    return {
      totalEmails: analytics.totalEmails,
      openRate: analytics.openRate.toFixed(1),
      clickRate: analytics.clickRate.toFixed(1),
      deliveryRate,
      bounceRate,
      recentEmails: recent.slice(0, 5).map((m) => ({
        id: m.id,
        emailType: m.emailType,
        recipientEmail: m.recipientEmail,
        sentAt: m.sentAt,
        openedAt: m.openedAt,
        openCount: m.openCount,
        clickCount: m.clickCount,
      })),
    };
  }),
});
