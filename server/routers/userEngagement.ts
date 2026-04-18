import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import {
  getUserEngagementMetrics,
  getTopEngagedUsers,
  getUserEngagementHistory,
  getUserEngagementStats,
  getUserEngagementByEmailType,
  getUserEngagementTrends,
} from "../db";

export const userEngagementRouter = router({
  /**
   * Get all user engagement metrics (admin only)
   */
  getAllUserMetrics: adminProcedure.query(async () => {
    const metrics = await getUserEngagementMetrics();
    return metrics.map((m) => ({
      userId: m.userId,
      userName: m.userName || "Unknown",
      userEmail: m.userEmail || "N/A",
      totalEmails: m.totalEmails || 0,
      totalOpens: m.totalOpens || 0,
      totalClicks: m.totalClicks || 0,
      avgOpenCount: parseFloat((m.avgOpenCount || 0).toString()).toFixed(2),
      avgClickCount: parseFloat((m.avgClickCount || 0).toString()).toFixed(2),
      openRate: parseFloat((m.openRate || 0).toString()).toFixed(1),
      clickRate: parseFloat((m.clickRate || 0).toString()).toFixed(1),
      lastEngagementAt: m.lastEngagementAt || null,
    }));
  }),

  /**
   * Get top engaged users (admin only)
   */
  getTopEngaged: adminProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ input }) => {
      const users = await getTopEngagedUsers(input.limit);
      return users.map((u) => ({
        userId: u.userId,
        userName: u.userName || "Unknown",
        userEmail: u.userEmail || "N/A",
        totalEmails: u.totalEmails || 0,
        totalOpens: u.totalOpens || 0,
        totalClicks: u.totalClicks || 0,
        openRate: parseFloat((u.openRate || 0).toString()).toFixed(1),
        clickRate: parseFloat((u.clickRate || 0).toString()).toFixed(1),
        engagementScore: u.engagementScore || 0,
      }));
    }),

  /**
   * Get engagement history for a specific user (protected)
   */
  getUserHistory: protectedProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      // Users can only view their own history unless they're admin
      const targetUserId = input.userId && ctx.user.role === "admin" ? input.userId : ctx.user.id;

      const history = await getUserEngagementHistory(targetUserId, input.limit);
      return history.map((h) => ({
        id: h.id,
        emailId: h.emailId,
        emailType: h.emailType,
        recipientEmail: h.recipientEmail,
        sentAt: h.sentAt,
        deliveredAt: h.deliveredAt,
        openedAt: h.openedAt,
        openCount: h.openCount || 0,
        clickCount: h.clickCount || 0,
        lastClickedAt: h.lastClickedAt,
        bounced: h.bounced || false,
        complained: h.complained || false,
        failed: h.failed || false,
      }));
    }),

  /**
   * Get engagement stats for a specific user (protected)
   */
  getUserStats: protectedProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      // Users can only view their own stats unless they're admin
      const targetUserId = input.userId && ctx.user.role === "admin" ? input.userId : ctx.user.id;

      const stats = await getUserEngagementStats(targetUserId);
      if (!stats) {
        return {
          userId: targetUserId,
          totalEmails: 0,
          totalOpens: 0,
          totalClicks: 0,
          avgOpenCount: "0.00",
          avgClickCount: "0.00",
          openRate: "0.0",
          clickRate: "0.0",
          lastEngagementAt: null,
          bounceCount: 0,
          complaintCount: 0,
        };
      }

      return {
        userId: stats.userId,
        totalEmails: stats.totalEmails || 0,
        totalOpens: stats.totalOpens || 0,
        totalClicks: stats.totalClicks || 0,
        avgOpenCount: parseFloat((stats.avgOpenCount || 0).toString()).toFixed(2),
        avgClickCount: parseFloat((stats.avgClickCount || 0).toString()).toFixed(2),
        openRate: parseFloat((stats.openRate || 0).toString()).toFixed(1),
        clickRate: parseFloat((stats.clickRate || 0).toString()).toFixed(1),
        lastEngagementAt: stats.lastEngagementAt || null,
        bounceCount: stats.bounceCount || 0,
        complaintCount: stats.complaintCount || 0,
      };
    }),

  /**
   * Get engagement metrics by email type for a user (protected)
   */
  getUserEngagementByType: protectedProcedure
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      // Users can only view their own data unless they're admin
      const targetUserId = input.userId && ctx.user.role === "admin" ? input.userId : ctx.user.id;

      const metrics = await getUserEngagementByEmailType(targetUserId);
      return metrics.map((m) => ({
        emailType: m.emailType,
        totalEmails: m.totalEmails || 0,
        totalOpens: m.totalOpens || 0,
        totalClicks: m.totalClicks || 0,
        openRate: parseFloat((m.openRate || 0).toString()).toFixed(1),
        clickRate: parseFloat((m.clickRate || 0).toString()).toFixed(1),
      }));
    }),

  /**
   * Get engagement trends for a user over time (protected)
   */
  getUserTrends: protectedProcedure
    .input(
      z.object({
        userId: z.number().optional(),
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      // Users can only view their own trends unless they're admin
      const targetUserId = input.userId && ctx.user.role === "admin" ? input.userId : ctx.user.id;

      const trends = await getUserEngagementTrends(targetUserId, input.days);
      return trends.map((t) => ({
        date: t.date,
        emailCount: t.emailCount || 0,
        openCount: t.openCount || 0,
        clickCount: t.clickCount || 0,
      }));
    }),
});
