import { Router, Request, Response } from "express";
import { ENV } from "./_core/env";
import { processStripeWebhook, verifyStripeSignature } from "./_core/stripeWebhookComplete";
import { processResendWebhook, ResendWebhookEvent } from "./_core/resendWebhookHandler";

const router = Router();

/**
 * Stripe webhook handler for all payment events
 * POST /api/webhooks/stripe
 *
 * Handles 20+ Stripe events:
 * - Payment Intent: succeeded, payment_failed, canceled
 * - Checkout Session: completed, expired, async_payment_succeeded/failed
 * - Subscription: created, updated, deleted
 * - Invoice: paid, payment_failed, upcoming, finalized
 * - Customer: created, updated, deleted
 * - Charge: succeeded, failed, refunded, dispute.created
 */
router.post("/stripe", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;
  const stripeSecret = ENV.stripeWebhookSecret;

  if (!stripeSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  if (!signature) {
    console.warn("[Webhook] Missing Stripe signature header");
    return res.status(401).json({ error: "Missing signature" });
  }

  const rawBody = (req as any).rawBody || JSON.stringify(req.body);

  try {
    // Verify signature and parse event
    const event = verifyStripeSignature(rawBody, signature, stripeSecret);

    // Detect test events
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    // Process the webhook event
    await processStripeWebhook(event);

    // Return success
    return res.status(200).json({ received: true });
  } catch (error: any) {
    if (error.type === "StripeSignatureVerificationError") {
      console.warn("[Webhook] Invalid Stripe signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    console.error("[Webhook] Error processing Stripe webhook:", error);
    // Always return 200 to prevent Stripe from retrying
    return res.status(200).json({ error: "Webhook processing failed", received: true });
  }
});

/**
 * Resend webhook handler for email tracking events
 * POST /api/webhooks/resend
 *
 * Handles email tracking events:
 * - email.sent
 * - email.delivered
 * - email.opened
 * - email.clicked
 * - email.bounced
 * - email.complained
 * - email.failed
 */
router.post("/resend", async (req: Request, res: Response) => {
  try {
    const event = req.body as ResendWebhookEvent;

    // Validate event structure
    if (!event.id || !event.type || !event.data) {
      console.warn("[Webhook] Invalid Resend event structure");
      return res.status(400).json({ error: "Invalid event structure" });
    }

    // Log the event
    console.log(`[Webhook] Resend event received: ${event.type} (${event.id})`);

    // Process the webhook event
    await processResendWebhook(event);

    // Return success
    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("[Webhook] Error processing Resend event:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
