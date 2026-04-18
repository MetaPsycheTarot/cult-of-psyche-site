# User Engagement Report Documentation

## Overview

The User Engagement Report provides administrators with detailed analytics on which users are most engaged with emails, including open rates, click-through rates, and engagement trends. This feature enables data-driven decisions about email campaigns and user communication strategies.

## Access & Permissions

The User Engagement Report is accessible exclusively to administrators at the route `/dashboard/user-engagement`. Regular users cannot access this report due to privacy and security considerations.

### Role-Based Access Control

- **Admin Users**: Full access to all user engagement metrics and rankings
- **Regular Users**: Can only view their own engagement statistics (if implemented)
- **Unauthenticated Users**: Redirected to login page

## Features

### Top Engaged Users Rankings

The main dashboard displays a ranked list of the top 20 most engaged users, sorted by engagement score. Users can sort by:

- **Clicks** (default): Total number of link clicks across all emails
- **Opens**: Total number of email opens
- **Emails**: Total number of emails sent to the user

#### Engagement Score Calculation

The engagement score is calculated as:

```
Engagement Score = Opens + (Clicks × 2)
```

This weighting prioritizes click-throughs as a stronger indicator of engagement than opens alone.

### User Rankings Table

The rankings table displays the following metrics for each user:

| Column | Description |
|--------|-------------|
| Rank | User's position in the engagement ranking |
| User | User name and email address |
| Emails | Total number of emails sent to this user |
| Opens | Total number of times emails were opened |
| Clicks | Total number of link clicks in emails |
| Open Rate | Percentage of emails opened (Opens / Emails × 100) |
| Click Rate | Percentage of emails with at least one click (Clicks / Emails × 100) |
| Score | Engagement score (Opens + Clicks × 2) |
| Action | Button to view detailed user analytics |

### User Detail View

Clicking "View" on any user opens a detailed analytics panel with four tabs:

#### Overview Tab

Displays key metrics in card format:

- **Total Emails**: Number of emails sent to this user
- **Opens**: Total number of email opens
- **Clicks**: Total number of link clicks
- **Open Rate**: Percentage of emails opened
- **Click Rate**: Percentage of emails with clicks
- **Last Engagement**: Date of most recent email interaction

#### By Type Tab

Shows email engagement metrics segmented by email type:

- **Email Type Distribution**: Pie chart showing proportion of emails by type
- **Metrics by Type**: Card-based breakdown showing:
  - Email type (welcome, payment_confirmation, referral_notification)
  - Total emails of that type
  - Opens and clicks for that type
  - Open and click rates

#### Trends Tab

Displays a 30-day engagement trend line chart showing:

- **Emails Sent**: Number of emails sent per day
- **Opens**: Number of opens per day
- **Clicks**: Number of clicks per day

This visualization helps identify engagement patterns and seasonal trends.

#### History Tab

Lists the 20 most recent emails sent to the user with:

- Email type (badge)
- Recipient email address
- Send date
- Number of opens and clicks
- Bounce/complaint status if applicable

## Database Schema

The user engagement report relies on the `email_engagement_metrics` table:

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

## API Procedures

The User Engagement Report uses the following tRPC procedures:

### getAllUserMetrics (Admin Only)

Returns engagement metrics for all users in the system.

**Response:**
```typescript
{
  userId: number;
  userName: string;
  userEmail: string;
  totalEmails: number;
  totalOpens: number;
  totalClicks: number;
  avgOpenCount: string;
  avgClickCount: string;
  openRate: string;
  clickRate: string;
  lastEngagementAt: Date | null;
}[]
```

### getTopEngaged (Admin Only)

Returns the top engaged users ranked by engagement score.

**Input:**
```typescript
{ limit: number } // 1-100, default 10
```

**Response:**
```typescript
{
  userId: number;
  userName: string;
  userEmail: string;
  totalEmails: number;
  totalOpens: number;
  totalClicks: number;
  openRate: string;
  clickRate: string;
  engagementScore: number;
}[]
```

### getUserStats

Returns comprehensive engagement statistics for a specific user.

**Input:**
```typescript
{ userId?: number } // Optional, defaults to current user
```

**Response:**
```typescript
{
  userId: number;
  totalEmails: number;
  totalOpens: number;
  totalClicks: number;
  avgOpenCount: string;
  avgClickCount: string;
  openRate: string;
  clickRate: string;
  lastEngagementAt: Date | null;
  bounceCount: number;
  complaintCount: number;
}
```

### getUserHistory

Returns detailed email engagement history for a user.

**Input:**
```typescript
{
  userId?: number; // Optional, defaults to current user
  limit: number;  // 1-100, default 50
}
```

**Response:**
```typescript
{
  id: number;
  emailId: string;
  emailType: string;
  recipientEmail: string;
  sentAt: Date;
  deliveredAt: Date | null;
  openedAt: Date | null;
  openCount: number;
  clickCount: number;
  lastClickedAt: Date | null;
  bounced: boolean;
  complained: boolean;
  failed: boolean;
}[]
```

### getUserEngagementByType

Returns engagement metrics segmented by email type.

**Input:**
```typescript
{ userId?: number } // Optional, defaults to current user
```

**Response:**
```typescript
{
  emailType: string;
  totalEmails: number;
  totalOpens: number;
  totalClicks: number;
  openRate: string;
  clickRate: string;
}[]
```

### getUserTrends

Returns engagement trends over a specified time period.

**Input:**
```typescript
{
  userId?: number;  // Optional, defaults to current user
  days: number;     // 1-365, default 30
}
```

**Response:**
```typescript
{
  date: string;     // YYYY-MM-DD format
  emailCount: number;
  openCount: number;
  clickCount: number;
}[]
```

## Usage Examples

### Accessing the Dashboard

Navigate to `/dashboard/user-engagement` in your browser. The dashboard will:

1. Verify you are logged in
2. Check your admin status
3. Display an access denied message if you're not an admin
4. Load and display the top engaged users if you have admin access

### Viewing User Details

1. Click the "View" button on any user in the rankings table
2. The user detail panel opens on the right side
3. Click tabs to switch between Overview, By Type, Trends, and History views
4. Click "Close" to collapse the detail panel

### Analyzing Engagement Patterns

Use the Trends tab to identify:

- **Peak engagement days**: When users are most likely to open/click
- **Email type performance**: Which email types drive the most engagement
- **Seasonal patterns**: How engagement varies over time
- **User segments**: Which users are consistently engaged vs. inactive

## Performance Considerations

The User Engagement Report uses optimized database queries with:

- **Aggregation queries**: Pre-calculated metrics reduce query complexity
- **Indexed columns**: userId and sentAt are indexed for fast filtering
- **Pagination**: Limits results to prevent memory overload
- **Caching**: tRPC queries are cached on the client side

## Security & Privacy

The User Engagement Report implements several security measures:

- **Admin-only access**: Only administrators can view the report
- **Role-based authorization**: Enforced at the tRPC procedure level
- **Email masking**: User emails are displayed but not exposed in API responses
- **Data isolation**: Users can only view their own data unless they're admins

## Troubleshooting

### No Data Appearing

If the User Engagement Report shows no data:

1. Verify emails have been sent through the system
2. Check that Resend webhooks are configured and delivering events
3. Verify the `email_engagement_metrics` table exists and has data
4. Check browser console for any API errors

### Incorrect Metrics

If metrics appear incorrect:

1. Verify webhook events are being processed correctly
2. Check the `email_engagement_metrics` table for duplicate records
3. Verify the engagement score calculation is correct
4. Check for any database errors in server logs

### Performance Issues

If the dashboard is slow:

1. Check database query performance
2. Verify indexes exist on userId and sentAt columns
3. Consider limiting the time range for trends queries
4. Check server CPU and memory usage

## Future Enhancements

Potential improvements to the User Engagement Report:

- **Export functionality**: Download engagement reports as CSV/PDF
- **Email activity timeline**: Interactive timeline of all user emails
- **Engagement trend analysis**: Automatic identification of engagement patterns
- **Segmentation**: Group users by engagement level
- **Predictive analytics**: Forecast future engagement
- **A/B testing**: Compare engagement across different email variants
- **Custom date ranges**: Flexible reporting periods
- **Engagement alerts**: Notifications for low engagement users

## Related Features

- **Email Analytics Dashboard** (`/dashboard/email-analytics`): Overall email performance metrics
- **Email Service** (`server/_core/emailService.ts`): Sends emails and creates engagement records
- **Resend Webhooks** (`server/_core/resendWebhookHandler.ts`): Processes email tracking events
