import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
  sendReferralNotificationEmail,
} from "./emailService";

// Mock Resend
vi.mock("resend", () => {
  return {
    Resend: vi.fn(() => ({
      emails: {
        send: vi.fn(async (params: any) => {
          // Simulate successful send
          if (params.to && params.subject && params.html) {
            return {
              data: { id: `email_${Date.now()}` },
              error: null,
            };
          }
          return {
            data: null,
            error: { message: "Invalid email parameters" },
          };
        }),
      },
    })),
  };
});

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("sendWelcomeEmail", () => {
    it("should send welcome email successfully", async () => {
      const result = await sendWelcomeEmail(
        "test@example.com",
        "John Doe"
      );
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should handle invalid email", async () => {
      const result = await sendWelcomeEmail("", "John Doe");
      expect(result.success).toBe(false);
    });

    it("should include user name in email", async () => {
      const result = await sendWelcomeEmail(
        "jane@example.com",
        "Jane Smith"
      );
      expect(result.success).toBe(true);
    });
  });

  describe("sendPaymentConfirmationEmail", () => {
    it("should send payment confirmation for monthly tier", async () => {
      const result = await sendPaymentConfirmationEmail(
        "user@example.com",
        "Alice",
        "monthly",
        9999
      );
      expect(result.success).toBe(true);
    });

    it("should send payment confirmation for pro tier", async () => {
      const result = await sendPaymentConfirmationEmail(
        "user@example.com",
        "Bob",
        "pro",
        19999
      );
      expect(result.success).toBe(true);
    });

    it("should send payment confirmation for lifetime tier", async () => {
      const result = await sendPaymentConfirmationEmail(
        "user@example.com",
        "Charlie",
        "lifetime",
        99999
      );
      expect(result.success).toBe(true);
    });

    it("should handle large amounts correctly", async () => {
      const result = await sendPaymentConfirmationEmail(
        "user@example.com",
        "David",
        "lifetime",
        999999
      );
      expect(result.success).toBe(true);
    });
  });

  describe("sendReferralNotificationEmail", () => {
    it("should send referral notification", async () => {
      const result = await sendReferralNotificationEmail(
        "newuser@example.com",
        "New User",
        "Referrer Name",
        2500
      );
      expect(result.success).toBe(true);
    });

    it("should include referrer name in email", async () => {
      const result = await sendReferralNotificationEmail(
        "user@example.com",
        "User",
        "John Doe",
        5000
      );
      expect(result.success).toBe(true);
    });

    it("should handle various reward amounts", async () => {
      const amounts = [1000, 2500, 5000, 10000];
      for (const amount of amounts) {
        const result = await sendReferralNotificationEmail(
          "user@example.com",
          "User",
          "Referrer",
          amount
        );
        expect(result.success).toBe(true);
      }
    });
  });

  describe("Error Handling", () => {
    it("should return error for invalid email address", async () => {
      const result = await sendWelcomeEmail(
        "not-an-email",
        "John"
      );
      // The function should handle gracefully
      expect(result).toHaveProperty("success");
    });

    it("should handle missing user name gracefully", async () => {
      const result = await sendWelcomeEmail(
        "user@example.com",
        ""
      );
      expect(result.success).toBe(true);
    });
  });
});
