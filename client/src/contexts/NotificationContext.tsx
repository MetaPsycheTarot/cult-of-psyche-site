import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // milliseconds, undefined = persistent
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  toasts: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  addToast: (toast: Omit<Notification, "id">) => string;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Notification[]>([]);

  const generateId = useCallback(() => `notif-${Date.now()}-${Math.random()}`, []);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      dismissible: notification.dismissible !== false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove if duration is specified
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, [generateId]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addToast = useCallback((toast: Omit<Notification, "id">) => {
    const id = generateId();
    const duration = toast.duration ?? 4000; // Default 4 seconds

    const newToast: Notification = {
      ...toast,
      id,
      duration,
      dismissible: toast.dismissible !== false,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        toasts,
        addNotification,
        removeNotification,
        clearNotifications,
        addToast,
        removeToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}
