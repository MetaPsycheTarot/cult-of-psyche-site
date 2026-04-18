/**
 * Stripe Webhook Handler
 * Processes Stripe events for subscription and payment management
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { userSubscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, any>;
  };
}

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id;
  const tierId = parseInt(session.metadata?.tier_id || "1");

  if (!userId) {
    console.error("[Stripe] No user_id in session metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update user subscription
  await db.insert(userSubscriptions).values({
    userId: parseInt(userId),
    tierId,
    stripeSubscriptionId: session.subscription as string,
    stripeCustomerId: session.customer as string,
    status: "active",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log(`[Stripe] Subscription activated for user ${userId}`);
}

/**
 * Handle payment_intent.succeeded event
 */
export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.user_id;

  if (!userId) {
    console.log("[Stripe] No user_id in payment intent metadata");
    return;
  }

  console.log(`[Stripe] Payment succeeded for user ${userId}: $${paymentIntent.amount / 100}`);
}

/**
 * Handle customer.subscription.updated event
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.log("[Stripe] No user_id in subscription metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  const status = subscription.status === "active" ? "active" : "canceled";

  await db
    .update(userSubscriptions)
    .set({
      status,
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    })
    .where(eq(userSubscriptions.userId, parseInt(userId)));

  console.log(`[Stripe] Subscription updated for user ${userId}: ${status}`);
}

/**
 * Handle customer.subscription.deleted event
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.log("[Stripe] No user_id in subscription metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db
    .update(userSubscriptions)
    .set({ status: "canceled" })
    .where(eq(userSubscriptions.userId, parseInt(userId)));

  console.log(`[Stripe] Subscription canceled for user ${userId}`);
}

/**
 * Handle invoice.paid event
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const userId = invoice.metadata?.user_id;

  if (!userId) {
    console.log("[Stripe] No user_id in invoice metadata");
    return;
  }

  console.log(
    `[Stripe] Invoice paid for user ${userId}: $${invoice.total / 100} (Invoice: ${invoice.id})`
  );
}

/**
 * Process Stripe webhook event
 */
export async function processStripeWebhook(event: StripeWebhookEvent): Promise<void> {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error(`[Stripe] Error processing webhook:`, error);
    throw error;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): StripeWebhookEvent {
  return stripe.webhooks.constructEvent(body, signature, secret) as StripeWebhookEvent;
}
