# Email Analytics Setup Guide

This guide explains how to configure email tracking and analytics for the Cult of Psyche Hub using Resend.

## Overview

Email analytics tracks three key metrics for all emails sent through Resend:

- **Open Rate**: Percentage of recipients who opened the email
- **Click Rate**: Percentage of recipients who clicked a link in the email
- **Delivery Rate**: Percentage of emails successfully delivered
- **Bounce Rate**: Percentage of emails that bounced

These metrics are automatically collected by Resend and delivered via webhooks to your application.

## Architecture

The email analytics system consists of three main components:

### 1. Database Schema

The `email_engagement_metrics` table stores engagement data for each email:

```sql
CREATE TABLE email_engagement_metrics (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL,
  emailId VARCHAR(255) NOT NULL,
  emailType ENUM('welcome', 'payment_confirmation', 'referral_notification'),
  recipientEmail VARCHAR(320) NOT NULL,
  sentAt TIMESTAMP NOT NULL,
  deliveredAt TIMESTAMP,
  openedAt TIMESTAMP,
  openCount INT DEFAULT 0,
  clickCount INT DEFAULT 0,
  lastClickedAt TIMESTAMP,
  bounced BOOLEAN DEFAULT false,
  complained BOOLEAN DEFAULT false,
  failed BOOLEAN DEFAULT false,
  failureReason TEXT,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Webhook Handler

The webhook endpoint at `/api/webhooks/resend` receives events from Resend:

- `email.sent`: Email was sent
- `email.delivered`: Email was delivered
- `email.opened`: Email was opened (requires tracking enabled)
- `email.clicked`: Link in email was clicked (requires tracking enabled)
- `email.bounced`: Email bounced
- `email.complained`: Recipient marked as spam

### 3. Analytics Dashboard

The Email Analytics Dashboard at `/dashboard/email-analytics` displays:

- Key metrics cards (open rate, click rate, delivery rate, bounce rate)
- Engagement timeline chart (opens and clicks over 14 days)
- Email type distribution pie chart
- Recent email activity list

## Setup Instructions

### Step 1: Enable Tracking in Resend Dashboard

1. Log in to [Resend Dashboard](https://dashboard.resend.com)
2. Go to **Domains** section
3. Select your tracking domain (e.g., `emails.cultofpsyche.com`)
4. Enable **Open Tracking** and **Click Tracking**
5. Note the tracking domain CNAME records required

### Step 2: Configure DNS Records

Add the following CNAME records to your DNS provider:

```
Name: [tracking-domain]
Type: CNAME
Value: [provided by Resend]
```

Wait for DNS propagation (typically 24-48 hours).

### Step 3: Configure Webhook

1. In Resend Dashboard, go to **Webhooks**
2. Click **Create Webhook**
3. Set the URL to: `https://your-domain.com/api/webhooks/resend`
4. Select events:
   - `email.sent`
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained`
5. Copy the webhook signing secret
6. Add to your environment variables:
   ```
   RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Step 4: Verify Webhook Delivery

1. In Resend Dashboard, go to **Webhooks**
2. Click on your webhook
3. Send a test event
4. Check the response status (should be 200 OK)
5. Verify the event appears in your database

## Email Engagement Record Creation

When emails are sent through the email service functions, engagement records are automatically created:

```typescript
// In emailService.ts
export async function sendWelcomeEmail(
  userId: number,
  userEmail: string,
  userName: string
): Promise<EmailSendResponse> {
  // ... send email ...
  
  // Create engagement record for tracking
  if (emailId) {
    await createEmailEngagementRecord(userId, emailId, "welcome", userEmail);
  }
}
```

The `createEmailEngagementRecord` function:
- Creates a record in `email_engagement_metrics` table
- Sets `sentAt` to current timestamp
- Initializes `openCount` and `clickCount` to 0

## Webhook Event Processing

When Resend sends webhook events, the handler updates the engagement record:

### email.opened Event
```typescript
// Updates the engagement record
{
  openedAt: event.created_at,
  openCount: openCount + 1
}
```

### email.clicked Event
```typescript
// Updates the engagement record
{
  lastClickedAt: event.created_at,
  clickCount: clickCount + 1
}
```

### email.bounced Event
```typescript
// Updates the engagement record
{
  bounced: true,
  failureReason: event.bounce_type
}
```

## Analytics Queries

The analytics system provides several queries:

### Get Overall Analytics
```typescript
const analytics = await getEmailAnalytics(userId);
// Returns: {
//   totalEmails: number,
//   totalOpens: number,
//   totalClicks: number,
//   deliveredCount: number,
//   bouncedCount: number,
//   openRate: number,
//   clickRate: number
// }
```

### Get Metrics by Email Type
```typescript
const metrics = await getEmailMetricsByType(userId, "welcome");
// Returns: EmailEngagementMetric[]
```

### Get Recent Metrics
```typescript
const recent = await getRecentEmailMetrics(userId, 30);
// Returns: EmailEngagementMetric[] (last 30 days)
```

## Dashboard Access

Users can access the Email Analytics Dashboard at:

```
/dashboard/email-analytics
```

The dashboard displays:
- **Total Emails**: Number of emails sent
- **Open Rate**: Percentage of emails opened
- **Click Rate**: Percentage of emails with clicks
- **Delivery Rate**: Percentage of emails delivered
- **Bounce Rate**: Percentage of emails bounced

## Testing

### Test Webhook Delivery

1. In Resend Dashboard, go to **Webhooks**
2. Click on your webhook
3. Click **Send Test Event**
4. Select event type (e.g., `email.opened`)
5. Check your database for the updated record

### Test Email Tracking

1. Send a test email through the application
2. Open the email in your email client
3. Wait a few seconds for the webhook to be delivered
4. Check the Email Analytics Dashboard
5. Verify the open count increased

## Troubleshooting

### Webhook Not Receiving Events

1. Verify webhook URL is correct and accessible
2. Check webhook signing secret is correct
3. Verify events are enabled in Resend Dashboard
4. Check server logs for webhook delivery errors
5. Use Resend Dashboard webhook logs to see delivery attempts

### Tracking Not Working

1. Verify tracking domain is configured in Resend
2. Verify DNS CNAME records are propagated
3. Verify tracking is enabled for the domain
4. Check that emails are using the tracking domain
5. Wait 24-48 hours for DNS propagation

### Missing Email Records

1. Verify `createEmailEngagementRecord` is called after sending email
2. Check database for records with matching `emailId`
3. Verify user ID is correct
4. Check for database connection errors in logs

## Performance Considerations

- Email engagement records are indexed by `userId` and `sentAt` for fast queries
- Webhook events are processed asynchronously to avoid blocking
- Analytics calculations use aggregation queries for efficiency
- Recent metrics queries are limited to 365 days maximum

## Security

- Webhook signatures are verified using `RESEND_WEBHOOK_SECRET`
- Only authenticated users can view their own email analytics
- Email addresses are stored for reference but not exposed in API responses
- Failed emails include failure reason for debugging (not user-facing)

## Next Steps

1. Configure Resend dashboard with tracking domain
2. Set up DNS CNAME records
3. Configure webhook in Resend
4. Test webhook delivery
5. Send test email and verify tracking
6. Monitor analytics dashboard for engagement metrics
