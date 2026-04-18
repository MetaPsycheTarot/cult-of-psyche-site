/**
 * Comprehensive Stripe Webhook Handler
 * Processes all Stripe events for subscription and payment management
 * Handles 20+ event types with complete business logic
 */

import Stripe from "stripe";
import { getDb } from "../db";
import { userSubscriptions, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { upsertUserSubscription, getSubscriptionTierByName } from "../db/subscriptions";
import { notifyOwner } from "./notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, any>;
    previous_attributes?: Record<string, any>;
  };
}

// ============================================================================
// PAYMENT INTENT HANDLERS
// ============================================================================

/**
 * Handle payment_intent.succeeded event
 * Payment has been successfully captured
 */
export async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.user_id;
  const tierId = paymentIntent.metadata?.tier_id;

  if (!userId) {
    console.warn("[Stripe] payment_intent.succeeded: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update user subscription if tier_id provided
  if (tierId) {
    await upsertUserSubscription(parseInt(userId), parseInt(tierId), {
      stripeCustomerId: paymentIntent.customer as string,
      status: "active",
    });
  }

  console.log(
    `[Stripe] Payment succeeded for user ${userId}: $${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`
  );

  // Notify owner of successful payment
  await notifyOwner({
    title: "Payment Received",
    content: `User ${userId} paid $${(paymentIntent.amount / 100).toFixed(2)}. Payment Intent: ${paymentIntent.id}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

/**
 * Handle payment_intent.payment_failed event
 * Payment method was declined or error occurred
 */
export async function handlePaymentIntentPaymentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] payment_intent.payment_failed: Missing user_id in metadata");
    return;
  }

  const failureCode = (paymentIntent as any).last_payment_error?.code || "unknown";
  const failureMessage = (paymentIntent as any).last_payment_error?.message || "Unknown error";

  console.warn(
    `[Stripe] Payment failed for user ${userId}: ${failureCode} - ${failureMessage}`
  );

  // Notify owner of failed payment
  await notifyOwner({
    title: "Payment Failed",
    content: `User ${userId} payment failed. Reason: ${failureMessage} (${failureCode})`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

/**
 * Handle payment_intent.canceled event
 * Payment was canceled
 */
export async function handlePaymentIntentCanceled(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const userId = paymentIntent.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] payment_intent.canceled: Missing user_id in metadata");
    return;
  }

  console.log(`[Stripe] Payment canceled for user ${userId}`);
}

// ============================================================================
// CHECKOUT SESSION HANDLERS
// ============================================================================

/**
 * Handle checkout.session.completed event
 * Checkout session was completed successfully
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;

  if (!userId) {
    console.warn("[Stripe] checkout.session.completed: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Create or update subscription
  await upsertUserSubscription(parseInt(userId), parseInt(tierId || "1"), {
    stripeSubscriptionId: session.subscription as string,
    stripeCustomerId: session.customer as string,
    status: "active",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log(`[Stripe] Checkout completed for user ${userId}`);

  // Notify owner
  await notifyOwner({
    title: "New Subscription",
    content: `User ${userId} completed checkout. Subscription: ${session.subscription}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

/**
 * Handle checkout.session.expired event
 * Checkout session expired
 */
export async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log(`[Stripe] Checkout session expired: ${session.id}`);
}

/**
 * Handle checkout.session.async_payment_succeeded event
 * Async payment (bank transfer, etc.) succeeded
 */
export async function handleCheckoutSessionAsyncPaymentSucceeded(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;

  if (!userId) {
    console.warn("[Stripe] checkout.session.async_payment_succeeded: Missing user_id");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update subscription to active
  await upsertUserSubscription(parseInt(userId), parseInt(tierId || "1"), {
    status: "active",
  });

  console.log(`[Stripe] Async payment succeeded for user ${userId}`);
}

/**
 * Handle checkout.session.async_payment_failed event
 * Async payment failed
 */
export async function handleCheckoutSessionAsyncPaymentFailed(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] checkout.session.async_payment_failed: Missing user_id");
    return;
  }

  console.warn(`[Stripe] Async payment failed for user ${userId}`);

  await notifyOwner({
    title: "Async Payment Failed",
    content: `User ${userId} async payment failed. Session: ${session.id}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

// ============================================================================
// SUBSCRIPTION HANDLERS
// ============================================================================

/**
 * Handle customer.subscription.created event
 * New subscription created
 */
export async function handleCustomerSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = subscription.metadata?.user_id;
  const tierId = subscription.metadata?.tier_id;

  if (!userId) {
    console.warn("[Stripe] customer.subscription.created: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const billingCycle = (subscription.items.data[0]?.plan?.interval || "month") as
    | "monthly"
    | "annual";

  await upsertUserSubscription(parseInt(userId), parseInt(tierId || "1"), {
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: subscription.customer as string,
    status: subscription.status as any,
    billingCycle,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });

  console.log(`[Stripe] Subscription created for user ${userId}: ${subscription.id}`);
}

/**
 * Handle customer.subscription.updated event
 * Subscription was updated (tier change, status change, etc.)
 */
export async function handleCustomerSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previousAttributes?: Record<string, any>
): Promise<void> {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] customer.subscription.updated: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Detect what changed
  const statusChanged = previousAttributes?.status && previousAttributes.status !== subscription.status;
  const tierChanged = previousAttributes?.items; // Items array changed

  // Update subscription
  await upsertUserSubscription(parseInt(userId), 1, {
    stripeSubscriptionId: subscription.id,
    status: subscription.status as any,
    currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
  });

  if (statusChanged) {
    console.log(`[Stripe] Subscription status changed for user ${userId}: ${subscription.status}`);
  }

  if (tierChanged) {
    console.log(`[Stripe] Subscription tier changed for user ${userId}`);
  }

  // Notify owner of important changes
  if (statusChanged && subscription.status === "past_due") {
    await notifyOwner({
      title: "Subscription Past Due",
      content: `User ${userId} subscription is past due. Subscription: ${subscription.id}`,
    }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
  }
}

/**
 * Handle customer.subscription.deleted event
 * Subscription was canceled
 */
export async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] customer.subscription.deleted: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update subscription status to canceled
  await upsertUserSubscription(parseInt(userId), 1, {
    status: "canceled",
    canceledAt: new Date(),
  });

  // Downgrade user role to "user"
  await db
    .update(users)
    .set({ role: "user" })
    .where(eq(users.id, parseInt(userId)));

  console.log(`[Stripe] Subscription canceled for user ${userId}`);

  await notifyOwner({
    title: "Subscription Canceled",
    content: `User ${userId} subscription was canceled. Subscription: ${subscription.id}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

// ============================================================================
// INVOICE HANDLERS
// ============================================================================

/**
 * Handle invoice.paid event
 * Invoice payment was received
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const userId = invoice.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] invoice.paid: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update subscription to active
  if ((invoice as any).subscription) {
    await upsertUserSubscription(parseInt(userId), 1, {
      stripeSubscriptionId: (invoice as any).subscription as string,
      status: "active",
    });
  }

  console.log(
    `[Stripe] Invoice paid for user ${userId}: $${(invoice.total / 100).toFixed(2)} (Invoice: ${invoice.id})`
  );
}

/**
 * Handle invoice.payment_failed event
 * Invoice payment failed
 */
export async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const userId = invoice.metadata?.user_id;

  if (!userId) {
    console.warn("[Stripe] invoice.payment_failed: Missing user_id in metadata");
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  // Update subscription to past_due
  if ((invoice as any).subscription) {
    await upsertUserSubscription(parseInt(userId), 1, {
      stripeSubscriptionId: (invoice as any).subscription as string,
      status: "past_due",
    });
  }

  console.warn(`[Stripe] Invoice payment failed for user ${userId}: ${invoice.id}`);

  await notifyOwner({
    title: "Invoice Payment Failed",
    content: `User ${userId} invoice payment failed. Amount: $${(invoice.total / 100).toFixed(2)}. Invoice: ${invoice.id}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

/**
 * Handle invoice.upcoming event
 * Invoice is about to be charged
 */
export async function handleInvoiceUpcoming(invoice: Stripe.Invoice): Promise<void> {
  console.log(`[Stripe] Upcoming invoice for customer ${invoice.customer}: ${invoice.id}`);
}

/**
 * Handle invoice.finalized event
 * Invoice has been finalized and is ready for payment
 */
export async function handleInvoiceFinalized(invoice: Stripe.Invoice): Promise<void> {
  console.log(`[Stripe] Invoice finalized: ${invoice.id}`);
}

// ============================================================================
// CUSTOMER HANDLERS
// ============================================================================

/**
 * Handle customer.created event
 * New customer created
 */
export async function handleCustomerCreated(customer: Stripe.Customer): Promise<void> {
  console.log(`[Stripe] Customer created: ${customer.id} (${customer.email})`);
}

/**
 * Handle customer.updated event
 * Customer information was updated
 */
export async function handleCustomerUpdated(customer: Stripe.Customer): Promise<void> {
  console.log(`[Stripe] Customer updated: ${customer.id}`);
}

/**
 * Handle customer.deleted event
 * Customer was deleted
 */
export async function handleCustomerDeleted(customer: Stripe.Customer): Promise<void> {
  console.log(`[Stripe] Customer deleted: ${customer.id}`);
}

// ============================================================================
// CHARGE HANDLERS
// ============================================================================

/**
 * Handle charge.succeeded event
 * Charge was successful
 */
export async function handleChargeSucceeded(charge: Stripe.Charge): Promise<void> {
  console.log(
    `[Stripe] Charge succeeded: ${charge.id} ($${(charge.amount / 100).toFixed(2)} ${charge.currency.toUpperCase()})`
  );
}

/**
 * Handle charge.failed event
 * Charge failed
 */
export async function handleChargeFailed(charge: Stripe.Charge): Promise<void> {
  console.warn(
    `[Stripe] Charge failed: ${charge.id} - ${charge.failure_message}`
  );
}

/**
 * Handle charge.refunded event
 * Charge was refunded
 */
export async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  console.log(
    `[Stripe] Charge refunded: ${charge.id} ($${(charge.amount_refunded / 100).toFixed(2)} of $${(charge.amount / 100).toFixed(2)})`
  );

  await notifyOwner({
    title: "Charge Refunded",
    content: `Charge ${charge.id} was refunded. Amount: $${(charge.amount_refunded / 100).toFixed(2)}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

/**
 * Handle charge.dispute.created event
 * Chargeback/dispute was created
 */
export async function handleChargeDisputeCreated(dispute: Stripe.Dispute): Promise<void> {
  console.error(`[Stripe] Dispute created: ${dispute.id} (Charge: ${dispute.charge})`);

  await notifyOwner({
    title: "Chargeback/Dispute",
    content: `Dispute created for charge ${dispute.charge}. Reason: ${dispute.reason}. Amount: $${(dispute.amount / 100).toFixed(2)}`,
  }).catch(err => console.error("[Stripe] Failed to notify owner:", err));
}

// ============================================================================
// MAIN WEBHOOK PROCESSOR
// ============================================================================

/**
 * Process Stripe webhook event
 * Routes event to appropriate handler
 */
export async function processStripeWebhook(event: StripeWebhookEvent): Promise<void> {
  try {
    switch (event.type) {
      // Payment Intent Events
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentIntentPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.canceled":
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      // Checkout Session Events
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.async_payment_succeeded":
        await handleCheckoutSessionAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.async_payment_failed":
        await handleCheckoutSessionAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session);
        break;

      // Subscription Events
      case "customer.subscription.created":
        await handleCustomerSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleCustomerSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
          event.data.previous_attributes
        );
        break;

      case "customer.subscription.deleted":
        await handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // Invoice Events
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "invoice.upcoming":
        await handleInvoiceUpcoming(event.data.object as Stripe.Invoice);
        break;

      case "invoice.finalized":
        await handleInvoiceFinalized(event.data.object as Stripe.Invoice);
        break;

      // Customer Events
      case "customer.created":
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case "customer.updated":
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case "customer.deleted":
        await handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;

      // Charge Events
      case "charge.succeeded":
        await handleChargeSucceeded(event.data.object as Stripe.Charge);
        break;

      case "charge.failed":
        await handleChargeFailed(event.data.object as Stripe.Charge);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case "charge.dispute.created":
        await handleChargeDisputeCreated(event.data.object as Stripe.Dispute);
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
 * Verify Stripe webhook signature and return event
 * Uses Stripe SDK constructEvent for verification
 */
export function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): StripeWebhookEvent {
  return stripe.webhooks.constructEvent(body, signature, secret) as StripeWebhookEvent;
}
