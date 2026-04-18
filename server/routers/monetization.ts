/**
 * Monetization Router
 * Handles subscription, payment, and feature access procedures
 */

import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllSubscriptionTiers,
  getUserSubscriptionTier,
  getUserUsageStats,
  canUserPerformAction,
  incrementUsage,
  initializeSubscriptionTiers,
} from "../db/subscriptions";
import { exportReadingAsPDF, exportComparisonAsPDF } from "../_core/pdfExport";

export const monetizationRouter = router({
  /**
   * Get all available subscription tiers
   */
  getTiers: publicProcedure.query(async () => {
    await initializeSubscriptionTiers();
    const tiers = await getAllSubscriptionTiers();
    return tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      monthlyPrice: tier.monthlyPrice,
      annualPrice: tier.annualPrice,
      features: typeof tier.features === "string" ? JSON.parse(tier.features) : tier.features,
      maxReadingsPerMonth: tier.maxReadingsPerMonth,
      maxComparisonsPerMonth: tier.maxComparisonsPerMonth,
      pdfExportEnabled: tier.pdfExportEnabled,
      recommendationsEnabled: tier.recommendationsEnabled,
      prioritySupport: tier.prioritySupport,
    }));
  }),

  /**
   * Get current user's subscription tier and usage stats
   */
  getUserTier: protectedProcedure.query(async ({ ctx }) => {
    const tier = await getUserSubscriptionTier(ctx.user.id);
    const stats = await getUserUsageStats(ctx.user.id);

    return {
      tier: tier?.name || "Free",
      features: {
        maxReadingsPerMonth: tier?.maxReadingsPerMonth || 5,
        maxComparisonsPerMonth: tier?.maxComparisonsPerMonth || 2,
        pdfExportEnabled: tier?.pdfExportEnabled || false,
        recommendationsEnabled: tier?.recommendationsEnabled || false,
        prioritySupport: tier?.prioritySupport || false,
      },
      usage: stats,
    };
  }),

  /**
   * Check if user can perform an action
   */
  canPerformAction: protectedProcedure
    .input(
      z.enum(["reading", "comparison", "pdfExport"])
    )
    .query(async ({ ctx, input }) => {
      const canPerform = await canUserPerformAction(ctx.user.id, input);
      if (!canPerform) {
        const tier = await getUserSubscriptionTier(ctx.user.id);
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your ${tier?.name || "Free"} tier does not allow this action. Please upgrade your subscription.`,
        });
      }
      return { allowed: true };
    }),

  /**
   * Track usage after action completion
   */
  trackUsage: protectedProcedure
    .input(
      z.enum(["reading", "comparison", "pdfExport"])
    )
    .mutation(async ({ ctx, input }) => {
      await incrementUsage(ctx.user.id, input);
      return { tracked: true };
    }),

  /**
   * Generate PDF export for reading
   */
  exportReadingPDF: protectedProcedure
    .input(
      z.object({
        readingId: z.string(),
        spreadType: z.string(),
        question: z.string().optional(),
        cards: z.array(
          z.object({
            name: z.string(),
            suit: z.string(),
            number: z.number(),
            meaning: z.string(),
            reversed: z.boolean(),
          })
        ),
        interpretation: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user can export PDF
      const canExport = await canUserPerformAction(ctx.user.id, "pdfExport");
      if (!canExport) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "PDF export is not available on your subscription tier",
        });
      }

      try {
        const pdfBuffer = await exportReadingAsPDF(
          {
            id: input.readingId,
            spreadType: input.spreadType,
            question: input.question,
            cards: input.cards,
            interpretation: input.interpretation,
            createdAt: new Date(),
          },
          `reading-${input.readingId}.pdf`
        );

        // Track usage
        await incrementUsage(ctx.user.id, "pdfExport");

        return {
          success: true,
          pdfData: pdfBuffer.toString("base64"),
          filename: `reading-${input.readingId}.pdf`,
        };
      } catch (error) {
        console.error("[PDF Export] Error generating PDF:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate PDF",
        });
      }
    }),

  /**
   * Generate PDF export for comparison
   */
  exportComparisonPDF: protectedProcedure
    .input(
      z.object({
        comparisonId: z.string(),
        reading1: z.object({
          spreadType: z.string(),
          question: z.string().optional(),
          cards: z.array(
            z.object({
              name: z.string(),
              suit: z.string(),
              number: z.number(),
              meaning: z.string(),
              reversed: z.boolean(),
            })
          ),
          interpretation: z.string(),
        }),
        reading2: z.object({
          spreadType: z.string(),
          question: z.string().optional(),
          cards: z.array(
            z.object({
              name: z.string(),
              suit: z.string(),
              number: z.number(),
              meaning: z.string(),
              reversed: z.boolean(),
            })
          ),
          interpretation: z.string(),
        }),
        analysis: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user can export PDF
      const canExport = await canUserPerformAction(ctx.user.id, "pdfExport");
      if (!canExport) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "PDF export is not available on your subscription tier",
        });
      }

      try {
        const pdfBuffer = await exportComparisonAsPDF(
          {
            id: input.comparisonId,
            reading1: {
              id: "reading1",
              spreadType: input.reading1.spreadType,
              question: input.reading1.question,
              cards: input.reading1.cards,
              interpretation: input.reading1.interpretation,
              createdAt: new Date(),
            },
            reading2: {
              id: "reading2",
              spreadType: input.reading2.spreadType,
              question: input.reading2.question,
              cards: input.reading2.cards,
              interpretation: input.reading2.interpretation,
              createdAt: new Date(),
            },
            analysis: input.analysis,
            createdAt: new Date(),
          },
          `comparison-${input.comparisonId}.pdf`
        );

        // Track usage
        await incrementUsage(ctx.user.id, "pdfExport");

        return {
          success: true,
          pdfData: pdfBuffer.toString("base64"),
          filename: `comparison-${input.comparisonId}.pdf`,
        };
      } catch (error) {
        console.error("[PDF Export] Error generating comparison PDF:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate PDF",
        });
      }
    }),

  /**
   * Create Stripe checkout session
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        tierId: z.number(),
        billingCycle: z.enum(["monthly", "annual"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // This would integrate with Stripe
      // For now, returning a placeholder
      return {
        checkoutUrl: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substring(7)}`,
        sessionId: `cs_test_${Math.random().toString(36).substring(7)}`,
      };
    }),

  /**
   * Get user's subscription status
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const tier = await getUserSubscriptionTier(ctx.user.id);
    return {
      currentTier: tier?.name || "Free",
      status: "active",
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }),
});
