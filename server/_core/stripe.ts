import crypto from "crypto";

/**
 * Verify Stripe webhook signature
 * 
 * This validates that the webhook came from Stripe by checking the signature
 * against your Stripe signing secret.
 * 
 * @param payload - Raw request body as string
 * @param signature - Stripe signature from headers (t=timestamp,v1=signature)
 * @param secret - Your Stripe webhook signing secret
 * @returns true if signature is valid, false otherwise
 */
export function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Parse the signature header
    const parts = signature.split(",");
    let timestamp = "";
    let receivedSignature = "";

    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") receivedSignature = value;
    }

    if (!timestamp || !receivedSignature) {
      console.warn("[Stripe] Invalid signature format");
      return false;
    }

    // Prevent replay attacks - check if timestamp is recent (within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const signedTime = parseInt(timestamp);
    const timeDiff = now - signedTime;

    if (timeDiff > 300) {
      console.warn(`[Stripe] Signature timestamp too old: ${timeDiff}s`);
      return false;
    }

    // Compute expected signature
    const signedContent = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedContent)
      .digest("hex");

    // Compare signatures using constant-time comparison
    // First check if lengths match (prevents timing attacks on length)
    if (receivedSignature.length !== expectedSignature.length) {
      return false;
    }

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(receivedSignature),
        Buffer.from(expectedSignature)
      );
      return isValid;
    } catch (error) {
      console.error("[Stripe] Timing-safe comparison failed:", error);
      return false;
    }
  } catch (error) {
    console.error("[Stripe] Signature verification error:", error);
    return false;
  }
}
