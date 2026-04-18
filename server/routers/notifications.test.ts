import { describe, it, expect, beforeEach, vi } from "vitest";
import { notificationsRouter } from "./notifications";
import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";

// Mock getDb
vi.mock("../db", () => ({
  getDb: vi.fn(),
}));

describe("Notifications Router", () => {
  const mockUser = {
    id: 1,
    openId: "test-user-1",
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
  };

  const mockAdminUser = {
    ...mockUser,
    role: "admin" as const,
  };

  const mockNotification = {
    id: 1,
    userId: 1,
    type: "success" as const,
    title: "Test Notification",
    message: "This is a test notification",
    actionLabel: null,
    actionUrl: null,
    isRead: false,
    createdAt: new Date(),
    expiresAt: null,
  };

  describe("getNotifications", () => {
    it("should return user notifications with pagination", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([mockNotification]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.getNotifications({ limit: 50, offset: 0 });

      expect(result).toEqual([mockNotification]);
    });

    it("should filter unread notifications when requested", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockResolvedValue([mockNotification]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      await caller.getNotifications({ limit: 50, offset: 0, unreadOnly: true });

      expect(mockDb.where).toHaveBeenCalled();
    });
  });

  describe("getUnreadCount", () => {
    it("should return count of unread notifications", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([{ count: 1 }]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.getUnreadCount();

      expect(result).toBe(1);
    });

    it("should return 0 when no unread notifications", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.getUnreadCount();

      expect(result).toBe(0);
    });
  });

  describe("markAsRead", () => {
    it("should mark notification as read", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockNotification]).mockResolvedValueOnce({}),
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.markAsRead({ id: 1 });

      expect(result).toEqual({ success: true });
      expect(mockDb.update).toHaveBeenCalled();
    });

    it("should throw error if notification not found", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);

      expect(caller.markAsRead({ id: 999 })).rejects.toThrow("NOT_FOUND");
    });

    it("should throw error if user doesn't own notification", async () => {
      const otherUserNotification = {
        ...mockNotification,
        userId: 999,
      };

      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue([otherUserNotification]),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);

      expect(caller.markAsRead({ id: 1 })).rejects.toThrow("FORBIDDEN");
    });
  });

  describe("markAllAsRead", () => {
    it("should mark all notifications as read", async () => {
      const mockDb = {
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.markAllAsRead();

      expect(result).toEqual({ success: true });
      expect(mockDb.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a notification", async () => {
      const mockDb = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValueOnce([mockNotification]).mockResolvedValueOnce({}),
        delete: vi.fn().mockReturnThis(),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.delete({ id: 1 });

      expect(result).toEqual({ success: true });
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe("deleteAll", () => {
    it("should delete all notifications for user", async () => {
      const mockDb = {
        delete: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);
      const result = await caller.deleteAll();

      expect(result).toEqual({ success: true });
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe("cleanupExpired", () => {
    it("should allow admin to cleanup expired notifications", async () => {
      const mockDb = {
        delete: vi.fn().mockReturnThis(),
        where: vi.fn().mockResolvedValue({}),
      };

      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockAdminUser, req: {}, res: {} } as any);
      const result = await caller.cleanupExpired();

      expect(result).toEqual({ success: true });
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("should deny non-admin users from cleanup", async () => {
      const mockDb = {};
      vi.mocked(getDb).mockResolvedValue(mockDb as any);

      const caller = notificationsRouter.createCaller({ user: mockUser, req: {}, res: {} } as any);

      expect(caller.cleanupExpired()).rejects.toThrow("FORBIDDEN");
    });
  });
});
