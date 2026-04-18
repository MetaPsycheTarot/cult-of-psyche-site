import { describe, it, expect, beforeEach, vi } from "vitest";
import { emailAnalyticsRouter } from "./emailAnalytics";
import { getEmailAnalytics, getEmailMetricsByType, getRecentEmailMetrics } from "../db";

// Mock the database functions
vi.mock("../db", () => ({
  getEmailAnalytics: vi.fn(),
  getEmailMetricsByType: vi.fn(),
  getRecentEmailMetrics: vi.fn(),
}));

describe("Email Analytics Router", () => {
  const mockUserId = 1;
  const mockCtx = {
    user: { id: mockUserId },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOverallAnalytics", () => {
    it("should return overall email analytics for a user", async () => {
      const mockAnalytics = {
        totalEmails: 100,
        totalOpens: 45,
        totalClicks: 12,
        deliveredCount: 98,
        bouncedCount: 2,
        complainedCount: 0,
        failedCount: 0,
        openRate: 45,
        clickRate: 12,
      };

      vi.mocked(getEmailAnalytics).mockResolvedValue(mockAnalytics);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getOverallAnalytics();

      expect(result).toEqual(mockAnalytics);
      expect(getEmailAnalytics).toHaveBeenCalledWith(mockUserId);
    });

    it("should return default analytics when no data exists", async () => {
      vi.mocked(getEmailAnalytics).mockResolvedValue(null);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getOverallAnalytics();

      expect(result).toEqual({
        totalEmails: 0,
        totalOpens: 0,
        totalClicks: 0,
        deliveredCount: 0,
        bouncedCount: 0,
        complainedCount: 0,
        failedCount: 0,
        openRate: 0,
        clickRate: 0,
      });
    });
  });

  describe("getMetricsByType", () => {
    it("should return metrics for a specific email type", async () => {
      const mockMetrics = [
        {
          id: 1,
          emailId: "email-1",
          emailType: "welcome",
          recipientEmail: "user@example.com",
          sentAt: new Date("2026-04-18"),
          deliveredAt: new Date("2026-04-18"),
          openedAt: new Date("2026-04-18T01:00:00"),
          openCount: 1,
          clickCount: 0,
          lastClickedAt: null,
          bounced: false,
          complained: false,
          failed: false,
          userId: mockUserId,
          failureReason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(getEmailMetricsByType).mockResolvedValue(mockMetrics as any);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getMetricsByType({ emailType: "welcome" });

      expect(result).toHaveLength(1);
      expect(result[0].emailType).toBe("welcome");
      expect(getEmailMetricsByType).toHaveBeenCalledWith(mockUserId, "welcome");
    });

    it("should handle empty metrics for email type", async () => {
      vi.mocked(getEmailMetricsByType).mockResolvedValue([]);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getMetricsByType({ emailType: "payment_confirmation" });

      expect(result).toEqual([]);
    });
  });

  describe("getRecentMetrics", () => {
    it("should return recent metrics for specified days", async () => {
      const mockMetrics = [
        {
          id: 1,
          emailId: "email-1",
          emailType: "welcome",
          recipientEmail: "user@example.com",
          sentAt: new Date(),
          deliveredAt: new Date(),
          openedAt: new Date(),
          openCount: 1,
          clickCount: 1,
          lastClickedAt: new Date(),
          bounced: false,
          complained: false,
          failed: false,
          userId: mockUserId,
          failureReason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(getRecentEmailMetrics).mockResolvedValue(mockMetrics as any);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getRecentMetrics({ days: 30 });

      expect(result).toHaveLength(1);
      expect(getRecentEmailMetrics).toHaveBeenCalledWith(mockUserId, 30);
    });

    it("should use default 30 days when not specified", async () => {
      vi.mocked(getRecentEmailMetrics).mockResolvedValue([]);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      await caller.getRecentMetrics({});

      expect(getRecentEmailMetrics).toHaveBeenCalledWith(mockUserId, 30);
    });

    it("should validate days parameter", async () => {
      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);

      // Should reject days > 365
      await expect(caller.getRecentMetrics({ days: 366 })).rejects.toThrow();

      // Should reject days < 1
      await expect(caller.getRecentMetrics({ days: 0 })).rejects.toThrow();
    });
  });

  describe("getEngagementSummary", () => {
    it("should return engagement summary with recent emails", async () => {
      const mockAnalytics = {
        totalEmails: 50,
        totalOpens: 25,
        totalClicks: 5,
        deliveredCount: 48,
        bouncedCount: 2,
        complainedCount: 0,
        failedCount: 0,
        openRate: 50,
        clickRate: 10,
      };

      const mockRecent = [
        {
          id: 1,
          emailId: "email-1",
          emailType: "welcome",
          recipientEmail: "user@example.com",
          sentAt: new Date(),
          deliveredAt: new Date(),
          openedAt: new Date(),
          openCount: 1,
          clickCount: 0,
          lastClickedAt: null,
          bounced: false,
          complained: false,
          failed: false,
          userId: mockUserId,
          failureReason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(getEmailAnalytics).mockResolvedValue(mockAnalytics);
      vi.mocked(getRecentEmailMetrics).mockResolvedValue(mockRecent as any);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getEngagementSummary();

      expect(result.totalEmails).toBe(50);
      expect(result.openRate).toBe("50.0");
      expect(result.clickRate).toBe("10.0");
      expect(result.deliveryRate).toBe("96.0");
      expect(result.bounceRate).toBe("4.0");
      expect(result.recentEmails).toHaveLength(1);
    });

    it("should handle null analytics gracefully", async () => {
      vi.mocked(getEmailAnalytics).mockResolvedValue(null);
      vi.mocked(getRecentEmailMetrics).mockResolvedValue([]);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getEngagementSummary();

      expect(result.totalEmails).toBe(0);
      expect(result.openRate).toBe("+0");
      expect(result.clickRate).toBe("+0");
      expect(result.recentEmails).toEqual([]);
    });

    it("should limit recent emails to 5", async () => {
      const mockAnalytics = {
        totalEmails: 10,
        totalOpens: 5,
        totalClicks: 1,
        deliveredCount: 10,
        bouncedCount: 0,
        complainedCount: 0,
        failedCount: 0,
        openRate: 50,
        clickRate: 10,
      };

      const mockRecent = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        emailId: `email-${i}`,
        emailType: "welcome",
        recipientEmail: `user${i}@example.com`,
        sentAt: new Date(),
        deliveredAt: new Date(),
        openedAt: new Date(),
        openCount: 1,
        clickCount: 0,
        lastClickedAt: null,
        bounced: false,
        complained: false,
        failed: false,
        userId: mockUserId,
        failureReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      vi.mocked(getEmailAnalytics).mockResolvedValue(mockAnalytics);
      vi.mocked(getRecentEmailMetrics).mockResolvedValue(mockRecent as any);

      const caller = emailAnalyticsRouter.createCaller(mockCtx as any);
      const result = await caller.getEngagementSummary();

      expect(result.recentEmails).toHaveLength(5);
    });
  });
});
