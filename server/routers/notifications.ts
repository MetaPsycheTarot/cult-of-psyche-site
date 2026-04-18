import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";
import { eq, and, desc, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  /**
   * Get all notifications for the current user
   */
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().max(100).default(50),
        offset: z.number().int().nonnegative().default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      const query = db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, ctx.user.id),
            input.unreadOnly ? eq(notifications.isRead, false) : undefined
          )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return await query;
    }),

  /**
   * Get unread notification count
   */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    const result = await db
      .select({ count: notifications.id })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.isRead, false)
        )
      );

    return result.length > 0 ? result[0].count : 0;
  }),

  /**
   * Mark a notification as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Verify ownership
      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id));

      if (notification.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });
      }

      if (notification[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot mark other user's notification as read",
        });
      }

      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, input.id));

      return { success: true };
    }),

  /**
   * Mark all notifications as read
   */
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.isRead, false)
        )
      );

    return { success: true };
  }),

  /**
   * Delete a notification
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      // Verify ownership
      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, input.id));

      if (notification.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });
      }

      if (notification[0].userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot delete other user's notification",
        });
      }

      await db.delete(notifications).where(eq(notifications.id, input.id));

      return { success: true };
    }),

  /**
   * Delete all notifications
   */
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    await db
      .delete(notifications)
      .where(eq(notifications.userId, ctx.user.id));

    return { success: true };
  }),

  /**
   * Clean up expired notifications (admin helper)
   */
  cleanupExpired: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can cleanup expired notifications",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    await db
      .delete(notifications)
      .where(lte(notifications.expiresAt, new Date()));

    return { success: true };
  }),
});
