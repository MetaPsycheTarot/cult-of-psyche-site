import { describe, expect, it } from "vitest";
import { verifyStripeSignature } from "./stripe";
import crypto from "crypto";

describe("Stripe webhook signature verification", () => {
  it("verifies a valid signature", () => {
    const secret = "whsec_test_secret";
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({ type: "checkout.session.completed", data: {} });

    // Create a valid signature
    const signedContent = `${timestamp}.${payload}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(signedContent)
      .digest("hex");

    const signatureHeader = `t=${timestamp},v1=${signature}`;

    const isValid = verifyStripeSignature(payload, signatureHeader, secret);
    expect(isValid).toBe(true);
  });

  it("rejects an invalid signature", () => {
    const secret = "whsec_test_secret";
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({ type: "checkout.session.completed", data: {} });

    const signatureHeader = `t=${timestamp},v1=invalid_signature_here`;

    const isValid = verifyStripeSignature(payload, signatureHeader, secret);
    expect(isValid).toBe(false);
  });

  it("rejects an old timestamp (replay attack)", () => {
    const secret = "whsec_test_secret";
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const payload = JSON.stringify({ type: "checkout.session.completed", data: {} });

    // Create a valid signature with old timestamp
    const signedContent = `${oldTimestamp}.${payload}`;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(signedContent)
      .digest("hex");

    const signatureHeader = `t=${oldTimestamp},v1=${signature}`;

    const isValid = verifyStripeSignature(payload, signatureHeader, secret);
    expect(isValid).toBe(false);
  });

  it("handles malformed signature header", () => {
    const secret = "whsec_test_secret";
    const payload = JSON.stringify({ type: "checkout.session.completed", data: {} });

    const isValid = verifyStripeSignature(payload, "malformed", secret);
    expect(isValid).toBe(false);
  });
});
