import { useNotification } from "@/contexts/NotificationContext";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

/**
 * Hook to load notifications from the database and manage them
 */
export function useNotifications() {
  const { addNotification, removeNotification } = useNotification();
  const { data: dbNotifications, isLoading } = trpc.notifications.getNotifications.useQuery({
    limit: 50,
    unreadOnly: false,
  });

  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery();
  const markAsReadMutation = trpc.notifications.markAsRead.useMutation();
  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation();
  const deleteMutation = trpc.notifications.delete.useMutation();
  const deleteAllMutation = trpc.notifications.deleteAll.useMutation();

  // Sync database notifications to UI
  useEffect(() => {
    if (dbNotifications && dbNotifications.length > 0) {
      // Load unread notifications into the notification center
      dbNotifications.forEach((notif) => {
        if (!notif.isRead) {
          addNotification({
            type: notif.type as "success" | "error" | "info" | "warning",
            title: notif.title,
            message: notif.message,
            dismissible: true,
          });
        }
      });
    }
  }, [dbNotifications]);

  return {
    notifications: dbNotifications || [],
    unreadCount: unreadCount || 0,
    isLoading,
    markAsRead: (id: number) => markAsReadMutation.mutate({ id }),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    delete: (id: number) => deleteMutation.mutate({ id }),
    deleteAll: () => deleteAllMutation.mutate(),
  };
}

/**
 * Hook to show a toast notification
 */
export function useToast() {
  const { addToast } = useNotification();

  return {
    success: (title: string, message: string, duration?: number) =>
      addToast({ type: "success", title, message, duration }),
    error: (title: string, message: string, duration?: number) =>
      addToast({ type: "error", title, message, duration }),
    info: (title: string, message: string, duration?: number) =>
      addToast({ type: "info", title, message, duration }),
    warning: (title: string, message: string, duration?: number) =>
      addToast({ type: "warning", title, message, duration }),
  };
}
