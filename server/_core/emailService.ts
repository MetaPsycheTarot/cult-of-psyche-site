import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface EmailSendResponse {
  success: boolean;
  emailId?: string;
  error?: string;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<EmailSendResponse> {
  try {
    const html = generateWelcomeEmailHTML(userName);

    const response = await resend.emails.send({
      from: "Cult of Psyche <onboarding@resend.dev>",
      to: userEmail,
      subject: "Welcome to the Cult of Psyche 🔮",
      html,
      headers: {
        "X-Entity-Ref-ID": `welcome-${Date.now()}`,
      },
    });

    if (response.error) {
      console.error("[Email] Welcome email failed:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("[Email] Welcome email sent to:", userEmail, "ID:", response.data?.id);
    return { success: true, emailId: response.data?.id };
  } catch (error) {
    console.error("[Email] Exception sending welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  tier: string,
  amount: number
): Promise<EmailSendResponse> {
  try {
    const html = generatePaymentConfirmationHTML(userName, tier, amount);

    const response = await resend.emails.send({
      from: "Cult of Psyche <onboarding@resend.dev>",
      to: userEmail,
      subject: "Payment Confirmed - Welcome to the Inner Circle 💎",
      html,
      headers: {
        "X-Entity-Ref-ID": `payment-${Date.now()}`,
      },
    });

    if (response.error) {
      console.error("[Email] Payment confirmation failed:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("[Email] Payment confirmation sent to:", userEmail, "ID:", response.data?.id);
    return { success: true, emailId: response.data?.id };
  } catch (error) {
    console.error("[Email] Exception sending payment confirmation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send referral notification email
 */
export async function sendReferralNotificationEmail(
  userEmail: string,
  userName: string,
  referrerName: string,
  rewardAmount: number
): Promise<EmailSendResponse> {
  try {
    const html = generateReferralNotificationHTML(
      userName,
      referrerName,
      rewardAmount
    );

    const response = await resend.emails.send({
      from: "Cult of Psyche <onboarding@resend.dev>",
      to: userEmail,
      subject: `${referrerName} invited you to the Cult of Psyche 🌙`,
      html,
      headers: {
        "X-Entity-Ref-ID": `referral-${Date.now()}`,
      },
    });

    if (response.error) {
      console.error("[Email] Referral notification failed:", response.error);
      return { success: false, error: response.error.message };
    }

    console.log("[Email] Referral notification sent to:", userEmail, "ID:", response.data?.id);
    return { success: true, emailId: response.data?.id };
  } catch (error) {
    console.error("[Email] Exception sending referral notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate welcome email HTML
 */
function generateWelcomeEmailHTML(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e27; color: #e0e0e0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff006e 0%, #00d9ff 100%); padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #1a1f3a; padding: 30px; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; background: #ff006e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔮 Welcome to the Cult of Psyche</h1>
          </div>
          
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p>You've been initiated into the Cult of Psyche, where ancient wisdom meets modern insight. Your journey into self-discovery begins now.</p>
            
            <p><strong>What you can do:</strong></p>
            <ul>
              <li>🎴 Pull tarot readings and explore their meanings</li>
              <li>🌙 Generate personalized nightmare scenarios for shadow work</li>
              <li>💭 Compare readings and discover patterns</li>
              <li>🎨 Create and share insights with the community</li>
              <li>📊 Track your spiritual progression</li>
            </ul>
            
            <p>Ready to explore the mysteries?</p>
            <a href="https://psychehub.manus.space/vault" class="button">Enter the Vault</a>
            
            <p>Questions? Visit our <a href="https://psychehub.manus.space/forum" style="color: #00d9ff;">Community Forum</a> for guidance.</p>
            
            <p>In service of the mysteries,<br><strong>The Cult of Psyche</strong></p>
          </div>
          
          <div class="footer">
            <p>You received this email because you signed up for the Cult of Psyche. <a href="https://psychehub.manus.space/settings" style="color: #00d9ff;">Manage preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate payment confirmation email HTML
 */
function generatePaymentConfirmationHTML(
  userName: string,
  tier: string,
  amount: number
): string {
  const tierBenefits: Record<string, string[]> = {
    monthly: [
      "100 tarot readings per month",
      "50 comparisons per month",
      "Access to advanced analytics",
      "Community forum access",
    ],
    pro: [
      "500 tarot readings per month",
      "200 comparisons per month",
      "Advanced analytics",
      "AI-powered insights",
      "Priority support",
    ],
    lifetime: [
      "Unlimited tarot readings",
      "Unlimited comparisons",
      "Full analytics suite",
      "AI-powered insights",
      "Priority support",
      "Lifetime access",
    ],
  };

  const benefits = tierBenefits[tier.toLowerCase()] || tierBenefits.monthly;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e27; color: #e0e0e0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00d9ff 0%, #ff006e 100%); padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #1a1f3a; padding: 30px; border-radius: 8px; margin-top: 20px; }
          .receipt { background: #0f1428; padding: 20px; border-left: 4px solid #00d9ff; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .receipt-total { border-top: 1px solid #333; padding-top: 10px; font-weight: bold; font-size: 18px; }
          .benefits { list-style: none; padding: 0; }
          .benefits li { padding: 8px 0; }
          .benefits li:before { content: "✓ "; color: #00d9ff; font-weight: bold; margin-right: 8px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💎 Payment Confirmed</h1>
          </div>
          
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p>Thank you for joining the inner circle! Your payment has been processed successfully.</p>
            
            <div class="receipt">
              <div class="receipt-row">
                <span>Tier:</span>
                <strong>${tier.charAt(0).toUpperCase() + tier.slice(1)}</strong>
              </div>
              <div class="receipt-row">
                <span>Amount:</span>
                <strong>$${(amount / 100).toFixed(2)}</strong>
              </div>
              <div class="receipt-row">
                <span>Date:</span>
                <strong>${new Date().toLocaleDateString()}</strong>
              </div>
              <div class="receipt-row receipt-total">
                <span>Status:</span>
                <span style="color: #00d9ff;">✓ Active</span>
              </div>
            </div>
            
            <p><strong>Your ${tier} benefits:</strong></p>
            <ul class="benefits">
              ${benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
            </ul>
            
            <p>Start exploring your new features in the <a href="https://psychehub.manus.space/vault" style="color: #00d9ff;">Vault</a>.</p>
            
            <p>In service of the mysteries,<br><strong>The Cult of Psyche</strong></p>
          </div>
          
          <div class="footer">
            <p><a href="https://psychehub.manus.space/settings" style="color: #00d9ff;">Manage subscription</a> | <a href="https://psychehub.manus.space/forum" style="color: #00d9ff;">Get support</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate referral notification email HTML
 */
function generateReferralNotificationHTML(
  userName: string,
  referrerName: string,
  rewardAmount: number
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e27; color: #e0e0e0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff006e 0%, #00d9ff 100%); padding: 30px; border-radius: 8px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #1a1f3a; padding: 30px; border-radius: 8px; margin-top: 20px; }
          .reward-box { background: #0f1428; border: 2px solid #00d9ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .reward-amount { font-size: 32px; color: #00d9ff; font-weight: bold; }
          .button { display: inline-block; background: #ff006e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌙 You've Been Invited</h1>
          </div>
          
          <div class="content">
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p><strong>${referrerName}</strong> has invited you to join the Cult of Psyche, a mystical community exploring tarot, dreams, and self-discovery.</p>
            
            <div class="reward-box">
              <p>Join now and receive a</p>
              <div class="reward-amount">$${rewardAmount.toFixed(2)}</div>
              <p>credit toward your first purchase!</p>
            </div>
            
            <p>Explore:</p>
            <ul>
              <li>🎴 AI-powered tarot readings</li>
              <li>🌙 Personalized nightmare journeys</li>
              <li>💭 Comparative analysis of readings</li>
              <li>🎨 Vibrant community forum</li>
              <li>📊 Spiritual progression tracking</li>
            </ul>
            
            <a href="https://psychehub.manus.space/join?referral=${referrerName}" class="button">Accept Invitation</a>
            
            <p>Questions? <a href="https://psychehub.manus.space/forum" style="color: #00d9ff;">Ask the community</a>.</p>
            
            <p>In service of the mysteries,<br><strong>The Cult of Psyche</strong></p>
          </div>
          
          <div class="footer">
            <p>You received this email because you were referred by a member. <a href="https://psychehub.manus.space/settings" style="color: #00d9ff;">Manage preferences</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
}
