import { describe, it, expect, beforeEach, vi } from "vitest";
import { userEngagementRouter } from "./userEngagement";
import {
  getUserEngagementMetrics,
  getTopEngagedUsers,
  getUserEngagementHistory,
  getUserEngagementStats,
  getUserEngagementByEmailType,
  getUserEngagementTrends,
} from "../db";

// Mock the database functions
vi.mock("../db", () => ({
  getUserEngagementMetrics: vi.fn(),
  getTopEngagedUsers: vi.fn(),
  getUserEngagementHistory: vi.fn(),
  getUserEngagementStats: vi.fn(),
  getUserEngagementByEmailType: vi.fn(),
  getUserEngagementTrends: vi.fn(),
}));

describe("User Engagement Router", () => {
  const mockAdminCtx = {
    user: { id: 1, role: "admin" },
  };

  const mockUserCtx = {
    user: { id: 2, role: "user" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllUserMetrics", () => {
    it("should return all user metrics for admin", async () => {
      const mockMetrics = [
        {
          userId: 1,
          userName: "John Doe",
          userEmail: "john@example.com",
          totalEmails: 100,
          totalOpens: 45,
          totalClicks: 12,
          avgOpenCount: 0.45,
          avgClickCount: 0.12,
          openRate: 45,
          clickRate: 12,
          lastEngagementAt: new Date("2026-04-18"),
        },
        {
          userId: 2,
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          totalEmails: 80,
          totalOpens: 60,
          totalClicks: 25,
          avgOpenCount: 0.75,
          avgClickCount: 0.31,
          openRate: 75,
          clickRate: 31,
          lastEngagementAt: new Date("2026-04-18"),
        },
      ];

      vi.mocked(getUserEngagementMetrics).mockResolvedValue(mockMetrics as any);

      const caller = userEngagementRouter.createCaller(mockAdminCtx as any);
      const result = await caller.getAllUserMetrics();

      expect(result).toHaveLength(2);
      expect(result[0].userName).toBe("John Doe");
      expect(result[1].openRate).toBe("75.0");
      expect(getUserEngagementMetrics).toHaveBeenCalled();
    });

    it("should throw error for non-admin users", async () => {
      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      await expect(caller.getAllUserMetrics()).rejects.toThrow();
    });
  });

  describe("getTopEngaged", () => {
    it("should return top engaged users for admin", async () => {
      const mockTopUsers = [
        {
          userId: 1,
          userName: "Top User",
          userEmail: "top@example.com",
          totalEmails: 100,
          totalOpens: 90,
          totalClicks: 50,
          openRate: 90,
          clickRate: 50,
          engagementScore: 190,
        },
      ];

      vi.mocked(getTopEngagedUsers).mockResolvedValue(mockTopUsers as any);

      const caller = userEngagementRouter.createCaller(mockAdminCtx as any);
      const result = await caller.getTopEngaged({ limit: 10 });

      expect(result).toHaveLength(1);
      expect(result[0].engagementScore).toBe(190);
      expect(getTopEngagedUsers).toHaveBeenCalledWith(10);
    });

    it("should validate limit parameter", async () => {
      const caller = userEngagementRouter.createCaller(mockAdminCtx as any);

      // Should reject limit > 100
      await expect(caller.getTopEngaged({ limit: 101 })).rejects.toThrow();

      // Should reject limit < 1
      await expect(caller.getTopEngaged({ limit: 0 })).rejects.toThrow();
    });
  });

  describe("getUserHistory", () => {
    it("should return user's own history", async () => {
      const mockHistory = [
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
        },
      ];

      vi.mocked(getUserEngagementHistory).mockResolvedValue(mockHistory as any);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserHistory({ limit: 50 });

      expect(result).toHaveLength(1);
      expect(result[0].emailType).toBe("welcome");
      expect(getUserEngagementHistory).toHaveBeenCalledWith(2, 50);
    });

    it("should allow admin to view other user's history", async () => {
      const mockHistory = [
        {
          id: 1,
          emailId: "email-1",
          emailType: "payment_confirmation",
          recipientEmail: "other@example.com",
          sentAt: new Date(),
          deliveredAt: new Date(),
          openedAt: new Date(),
          openCount: 2,
          clickCount: 0,
          lastClickedAt: null,
          bounced: false,
          complained: false,
          failed: false,
        },
      ];

      vi.mocked(getUserEngagementHistory).mockResolvedValue(mockHistory as any);

      const caller = userEngagementRouter.createCaller(mockAdminCtx as any);
      const result = await caller.getUserHistory({ userId: 5, limit: 50 });

      expect(result).toHaveLength(1);
      expect(getUserEngagementHistory).toHaveBeenCalledWith(5, 50);
    });
  });

  describe("getUserStats", () => {
    it("should return user stats for current user", async () => {
      const mockStats = {
        userId: 2,
        totalEmails: 50,
        totalOpens: 30,
        totalClicks: 10,
        avgOpenCount: 0.6,
        avgClickCount: 0.2,
        openRate: 60,
        clickRate: 20,
        lastEngagementAt: new Date(),
        bounceCount: 2,
        complaintCount: 0,
      };

      vi.mocked(getUserEngagementStats).mockResolvedValue(mockStats as any);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserStats({});

      expect(result.userId).toBe(2);
      expect(result.openRate).toBe("60.0");
      expect(result.bounceCount).toBe(2);
      expect(getUserEngagementStats).toHaveBeenCalledWith(2);
    });

    it("should return default stats when no data exists", async () => {
      vi.mocked(getUserEngagementStats).mockResolvedValue(null);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserStats({});

      expect(result.totalEmails).toBe(0);
      expect(result.openRate).toBe("0.0");
      expect(result.clickRate).toBe("0.0");
    });
  });

  describe("getUserEngagementByType", () => {
    it("should return engagement metrics by email type", async () => {
      const mockByType = [
        {
          emailType: "welcome",
          totalEmails: 20,
          totalOpens: 18,
          totalClicks: 5,
          openRate: 90,
          clickRate: 25,
        },
        {
          emailType: "payment_confirmation",
          totalEmails: 15,
          totalOpens: 14,
          totalClicks: 8,
          openRate: 93,
          clickRate: 53,
        },
      ];

      vi.mocked(getUserEngagementByEmailType).mockResolvedValue(mockByType as any);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserEngagementByType({});

      expect(result).toHaveLength(2);
      expect(result[0].emailType).toBe("welcome");
      expect(result[1].clickRate).toBe("53.0");
    });

    it("should return empty array when no data exists", async () => {
      vi.mocked(getUserEngagementByEmailType).mockResolvedValue([]);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserEngagementByType({});

      expect(result).toEqual([]);
    });
  });

  describe("getUserTrends", () => {
    it("should return engagement trends over time", async () => {
      const mockTrends = [
        {
          date: "2026-04-01",
          emailCount: 5,
          openCount: 4,
          clickCount: 2,
        },
        {
          date: "2026-04-02",
          emailCount: 3,
          openCount: 2,
          clickCount: 1,
        },
      ];

      vi.mocked(getUserEngagementTrends).mockResolvedValue(mockTrends as any);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserTrends({ days: 30 });

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe("2026-04-01");
      expect(result[0].emailCount).toBe(5);
      expect(getUserEngagementTrends).toHaveBeenCalledWith(2, 30);
    });

    it("should validate days parameter", async () => {
      const caller = userEngagementRouter.createCaller(mockUserCtx as any);

      // Should reject days > 365
      await expect(caller.getUserTrends({ days: 366 })).rejects.toThrow();

      // Should reject days < 1
      await expect(caller.getUserTrends({ days: 0 })).rejects.toThrow();
    });

    it("should use default 30 days when not specified", async () => {
      vi.mocked(getUserEngagementTrends).mockResolvedValue([]);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      await caller.getUserTrends({});

      expect(getUserEngagementTrends).toHaveBeenCalledWith(2, 30);
    });
  });

  describe("Authorization", () => {
    it("should prevent non-admin from accessing getAllUserMetrics", async () => {
      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      await expect(caller.getAllUserMetrics()).rejects.toThrow();
    });

    it("should prevent non-admin from accessing getTopEngaged", async () => {
      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      await expect(caller.getTopEngaged({ limit: 10 })).rejects.toThrow();
    });

    it("should allow users to access their own data", async () => {
      vi.mocked(getUserEngagementStats).mockResolvedValue({
        userId: 2,
        totalEmails: 10,
        totalOpens: 5,
        totalClicks: 2,
        avgOpenCount: 0.5,
        avgClickCount: 0.2,
        openRate: 50,
        clickRate: 20,
        lastEngagementAt: new Date(),
        bounceCount: 0,
        complaintCount: 0,
      } as any);

      const caller = userEngagementRouter.createCaller(mockUserCtx as any);
      const result = await caller.getUserStats({});

      expect(result.userId).toBe(2);
    });
  });
});
