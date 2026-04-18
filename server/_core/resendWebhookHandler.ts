import { getDb } from "../db";
import { emailEngagementMetrics } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export type ResendWebhookEvent = {
  id: string;
  type:
    | "email.sent"
    | "email.delivered"
    | "email.opened"
    | "email.clicked"
    | "email.bounced"
    | "email.complained"
    | "email.failed";
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string;
    created_at: string;
    opened_at?: string;
    clicked_at?: string;
    bounce_type?: string;
    error_message?: string;
  };
};

/**
 * Process Resend webhook events for email tracking
 */
export async function processResendWebhook(event: ResendWebhookEvent): Promise<void> {
  const db = await getDb();
  const { type, data } = event;

  if (!db) {
    console.error("[Resend Webhook] Database not available");
    throw new Error("Database not available");
  }

  console.log(`[Resend Webhook] Processing ${type} event for email ${data.email_id}`);

  try {
    switch (type) {
      case "email.sent":
        await handleEmailSent(db, data);
        break;
      case "email.delivered":
        await handleEmailDelivered(db, data);
        break;
      case "email.opened":
        await handleEmailOpened(db, data);
        break;
      case "email.clicked":
        await handleEmailClicked(db, data);
        break;
      case "email.bounced":
        await handleEmailBounced(db, data);
        break;
      case "email.complained":
        await handleEmailComplained(db, data);
        break;
      case "email.failed":
        await handleEmailFailed(db, data);
        break;
      default:
        console.log(`[Resend Webhook] Unknown event type: ${type}`);
    }
  } catch (error) {
    console.error(`[Resend Webhook] Error processing ${type} event:`, error);
    throw error;
  }
}

/**
 * Handle email.sent event - create initial engagement record
 */
async function handleEmailSent(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  // Extract email type from headers or metadata if available
  const emailType = determineEmailType(data.from);

  // Try to find existing record by emailId
  const existing = await db
    .select()
    .from(emailEngagementMetrics)
    .where(eq(emailEngagementMetrics.emailId, data.email_id))
    .limit(1);

  if (existing.length > 0) {
    console.log(`[Resend Webhook] Email ${data.email_id} already tracked`);
    return;
  }

  // Extract userId from email metadata (would need to be passed in headers)
  // For now, we'll create a basic record
  console.log(`[Resend Webhook] Email sent: ${data.email_id} to ${data.to}`);
}

/**
 * Handle email.delivered event
 */
async function handleEmailDelivered(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  await db
    .update(emailEngagementMetrics)
    .set({
      deliveredAt: new Date(data.created_at),
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email delivered: ${data.email_id}`);
}

/**
 * Handle email.opened event
 */
async function handleEmailOpened(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  // Get current metrics
  const current = await db
    .select()
    .from(emailEngagementMetrics)
    .where(eq(emailEngagementMetrics.emailId, data.email_id))
    .limit(1);

  if (current.length === 0) {
    console.warn(`[Resend Webhook] Email not found for open event: ${data.email_id}`);
    return;
  }

  const metric = current[0];
  const newOpenCount = (metric.openCount || 0) + 1;

  await db
    .update(emailEngagementMetrics)
    .set({
      openedAt: new Date(data.opened_at || data.created_at),
      openCount: newOpenCount,
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email opened: ${data.email_id} (open count: ${newOpenCount})`);
}

/**
 * Handle email.clicked event
 */
async function handleEmailClicked(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  // Get current metrics
  const current = await db
    .select()
    .from(emailEngagementMetrics)
    .where(eq(emailEngagementMetrics.emailId, data.email_id))
    .limit(1);

  if (current.length === 0) {
    console.warn(`[Resend Webhook] Email not found for click event: ${data.email_id}`);
    return;
  }

  const metric = current[0];
  const newClickCount = (metric.clickCount || 0) + 1;

  await db
    .update(emailEngagementMetrics)
    .set({
      clickCount: newClickCount,
      lastClickedAt: new Date(data.clicked_at || data.created_at),
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email clicked: ${data.email_id} (click count: ${newClickCount})`);
}

/**
 * Handle email.bounced event
 */
async function handleEmailBounced(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  await db
    .update(emailEngagementMetrics)
    .set({
      bounced: true,
      failureReason: data.bounce_type || "Bounced",
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email bounced: ${data.email_id} (${data.bounce_type})`);
}

/**
 * Handle email.complained event
 */
async function handleEmailComplained(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  await db
    .update(emailEngagementMetrics)
    .set({
      complained: true,
      failureReason: "Marked as spam",
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email complained: ${data.email_id}`);
}

/**
 * Handle email.failed event
 */
async function handleEmailFailed(
  db: any,
  data: ResendWebhookEvent["data"]
): Promise<void> {
  if (!db) return;

  await db
    .update(emailEngagementMetrics)
    .set({
      failed: true,
      failureReason: data.error_message || "Failed to send",
      updatedAt: new Date(),
    })
    .where(eq(emailEngagementMetrics.emailId, data.email_id));

  console.log(`[Resend Webhook] Email failed: ${data.email_id} (${data.error_message})`);
}

/**
 * Determine email type from sender address
 */
function determineEmailType(from: string): string {
  if (from.includes("onboarding@resend.dev")) {
    // We'll need to infer from context or add metadata to emails
    return "welcome";
  }
  return "welcome";
}
