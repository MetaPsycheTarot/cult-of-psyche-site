import { Router } from "express";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

const router = Router();

/**
 * Stripe webhook handler for membership access
 * POST /api/webhooks/stripe
 *
 * Handles:
 * - checkout.session.completed → grant membership access
 * - customer.subscription.updated → update membership status
 * - customer.subscription.deleted → revoke membership access
 */
router.post("/stripe", async (req, res) => {
  const event = req.body;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Extract user email from session
        const userEmail = session.customer_email;
        if (!userEmail) {
          console.warn("[Webhook] No customer email in session");
          return res.status(200).json({ received: true });
        }

        // Update user membership status in database
        const db = await getDb();
        if (!db) {
          console.error("[Webhook] Database not available");
          return res.status(500).json({ error: "Database unavailable" });
        }

        // Find user by email and update membership status
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.email, userEmail))
          .limit(1);

        if (userRecord.length > 0) {
          // Update user role to indicate membership
          // Note: Using "admin" role to indicate paid membership
          // You may want to extend the role enum to include "member" or "subscriber"
          await db
            .update(users)
            .set({
              role: "admin", // Indicates membership/paid tier
              updatedAt: new Date(),
            })
            .where(eq(users.id, userRecord[0].id));

          console.log(`[Webhook] Membership granted to ${userEmail}`);
        } else {
          console.warn(
            `[Webhook] User not found for email: ${userEmail}. Consider auto-creating user.`
          );
        }

        return res.status(200).json({ received: true });
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userEmail = subscription.metadata?.email;

        if (userEmail) {
          const db = await getDb();
          if (db) {
            const userRecord = await db
              .select()
              .from(users)
              .where(eq(users.email, userEmail))
              .limit(1);

            if (userRecord.length > 0) {
              await db
                .update(users)
                .set({
                  updatedAt: new Date(),
                })
                .where(eq(users.id, userRecord[0].id));

              console.log(`[Webhook] Subscription updated for ${userEmail}`);
            }
          }
        }

        return res.status(200).json({ received: true });
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userEmail = subscription.metadata?.email;

        if (userEmail) {
          const db = await getDb();
          if (db) {
            const userRecord = await db
              .select()
              .from(users)
              .where(eq(users.email, userEmail))
              .limit(1);

            if (userRecord.length > 0) {
              // Revert user role to "user"
              await db
                .update(users)
                .set({
                  role: "user",
                  updatedAt: new Date(),
                })
                .where(eq(users.id, userRecord[0].id));

              console.log(`[Webhook] Membership revoked for ${userEmail}`);
            }
          }
        }

        return res.status(200).json({ received: true });
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
        return res.status(200).json({ received: true });
    }
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
});

export default router;
