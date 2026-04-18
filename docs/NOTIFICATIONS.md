# Notification System Documentation

The Cult of Psyche website includes a comprehensive notification system with two types of notifications: toast notifications for temporary messages and persistent notifications stored in the database.

## Overview

The notification system provides:

- **Toast Notifications**: Temporary, auto-dismissing notifications that appear in the bottom-right corner
- **Notification Center**: A persistent notification panel accessible via a bell icon in the top navigation
- **Database Storage**: Notifications can be persisted to the database for later retrieval
- **Real-time Updates**: Notifications sync between the database and UI components
- **Type Support**: Success, error, info, and warning notification types

## Architecture

### Components

**NotificationContext** (`client/src/contexts/NotificationContext.tsx`)
- Manages notification state globally
- Provides hooks for adding/removing notifications
- Handles auto-dismissal and duration management

**Toast Component** (`client/src/components/Toast.tsx`)
- Displays temporary toast notifications
- Auto-dismisses after configurable duration (default: 4 seconds)
- Shows in bottom-right corner of the screen

**NotificationCenter Component** (`client/src/components/NotificationCenter.tsx`)
- Bell icon in the top navigation
- Dropdown panel showing all persistent notifications
- Displays unread count badge
- Allows marking as read and deletion

**Notification Hooks** (`client/src/hooks/useNotifications.ts`)
- `useNotifications()`: Load and manage database notifications
- `useToast()`: Quick access to toast notification methods

### Backend

**Notifications Router** (`server/routers/notifications.ts`)
- `getNotifications`: Fetch user's notifications with pagination
- `getUnreadCount`: Get count of unread notifications
- `markAsRead`: Mark a notification as read
- `markAllAsRead`: Mark all notifications as read
- `delete`: Delete a specific notification
- `deleteAll`: Delete all notifications
- `cleanupExpired`: Admin-only procedure to clean up expired notifications

**Database Schema** (`drizzle/schema.ts`)
- `notifications` table stores persistent notifications
- Fields: id, userId, type, title, message, actionLabel, actionUrl, isRead, createdAt, expiresAt

## Usage

### Showing Toast Notifications

```tsx
import { useToast } from "@/hooks/useNotifications";

function MyComponent() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success("Success!", "Operation completed")}>
      Show Toast
    </button>
  );
}
```

### Creating Persistent Notifications

To create a notification that persists in the database, call the tRPC procedure from the backend:

```ts
// In a tRPC procedure
import { getDb } from "../db";
import { notifications } from "../../drizzle/schema";

const db = await getDb();
await db.insert(notifications).values({
  userId: ctx.user.id,
  type: "success",
  title: "Payment Received",
  message: "Your payment of $99.99 was processed successfully",
  isRead: false,
});
```

### Loading Notifications in Components

```tsx
import { useNotifications } from "@/hooks/useNotifications";

function NotificationPanel() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <div>
      <h2>Notifications ({unreadCount})</h2>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <h3>{notif.title}</h3>
          <p>{notif.message}</p>
          <button onClick={() => markAsRead(notif.id)}>Mark as Read</button>
        </div>
      ))}
    </div>
  );
}
```

## Notification Types

| Type | Color | Use Case |
|------|-------|----------|
| success | Green | Successful operations, confirmations |
| error | Red | Errors, failures, warnings |
| info | Blue | General information, updates |
| warning | Yellow | Cautions, important notices |

## Configuration

### Toast Duration

Default duration is 4000ms (4 seconds). Customize per notification:

```ts
toast.success("Title", "Message", 6000); // 6 second duration
```

### Notification Expiration

Notifications can expire automatically by setting `expiresAt`:

```ts
await db.insert(notifications).values({
  userId: ctx.user.id,
  type: "info",
  title: "Limited Time Offer",
  message: "This offer expires in 24 hours",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
});
```

Admin users can clean up expired notifications:

```ts
// Call from admin panel
trpc.notifications.cleanupExpired.useMutation();
```

## Best Practices

1. **Use Toast for Temporary Feedback**: Show toasts for immediate user actions (form submissions, button clicks)
2. **Use Persistent Notifications for Important Messages**: Store important notifications in the database for later review
3. **Set Appropriate Durations**: Keep toast duration short (3-5 seconds) for non-critical messages
4. **Include Action Buttons**: Add actionLabel and actionUrl for notifications requiring user response
5. **Clean Up Old Notifications**: Periodically remove expired notifications to keep the database clean
6. **Provide Context**: Always include clear title and message text
7. **Use Correct Types**: Match notification type to the message severity

## Examples

### Payment Confirmation

```ts
const db = await getDb();
await db.insert(notifications).values({
  userId: ctx.user.id,
  type: "success",
  title: "Payment Successful",
  message: `Your payment of $${amount} has been processed`,
  actionLabel: "View Receipt",
  actionUrl: `/receipts/${receiptId}`,
});
```

### System Maintenance Alert

```ts
// Notify all users
const users = await db.select().from(usersTable);
for (const user of users) {
  await db.insert(notifications).values({
    userId: user.id,
    type: "warning",
    title: "Scheduled Maintenance",
    message: "The system will be down for 2 hours tomorrow at 2 AM",
    expiresAt: new Date(maintenanceTime),
  });
}
```

### Error Notification

```ts
toast.error("Upload Failed", "File size exceeds 10MB limit");
```

## Troubleshooting

**Notifications not appearing?**
- Ensure NotificationProvider is wrapped around your app in main.tsx
- Check that ToastContainer and NotificationCenter are rendered in App.tsx
- Verify database connection for persistent notifications

**Notifications not dismissing?**
- Check that dismissible is not set to false
- Verify duration is set correctly for toasts

**Unread count not updating?**
- Ensure markAsRead mutation is being called
- Check database for isRead field updates

## Future Enhancements

- Email notifications integration
- Push notifications via service workers
- Notification preferences per user
- Notification categories and filtering
- Sound/vibration alerts
- Notification history/archive
- Bulk notification operations
