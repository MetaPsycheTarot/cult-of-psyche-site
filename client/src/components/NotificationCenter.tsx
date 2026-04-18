import { useNotification, type Notification } from "@/contexts/NotificationContext";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, Bell } from "lucide-react";
import { useState } from "react";

const typeStyles = {
  success: {
    bg: "bg-green-900/20",
    border: "border-green-500/30",
    icon: CheckCircle,
    text: "text-green-400",
    badge: "bg-green-500",
  },
  error: {
    bg: "bg-red-900/20",
    border: "border-red-500/30",
    icon: AlertCircle,
    text: "text-red-400",
    badge: "bg-red-500",
  },
  info: {
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    icon: Info,
    text: "text-blue-400",
    badge: "bg-blue-500",
  },
  warning: {
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
    text: "text-yellow-400",
    badge: "bg-yellow-500",
  },
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotification();
  const style = typeStyles[notification.type];
  const IconComponent = style.icon;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-3`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`${style.text} w-5 h-5 flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`${style.text} font-semibold`}>{notification.title}</h3>
          <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className={`${style.text} text-xs font-semibold mt-2 hover:underline`}
            >
              {notification.action.label}
            </button>
          )}
        </div>
        {notification.dismissible && (
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-200 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const { notifications, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.length;

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-96 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-40 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Clear All
              </button>
            )}
          </div>

          {unreadCount === 0 ? (
            <p className="text-gray-400 text-center py-8">No notifications</p>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
