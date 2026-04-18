import { useNotification, type Notification } from "@/contexts/NotificationContext";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const typeStyles = {
  success: {
    bg: "bg-green-900/20",
    border: "border-green-500/30",
    icon: CheckCircle,
    text: "text-green-400",
  },
  error: {
    bg: "bg-red-900/20",
    border: "border-red-500/30",
    icon: AlertCircle,
    text: "text-red-400",
  },
  info: {
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    icon: Info,
    text: "text-blue-400",
  },
  warning: {
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/30",
    icon: AlertTriangle,
    text: "text-yellow-400",
  },
};

function ToastItem({ toast }: { toast: Notification }) {
  const { removeToast } = useNotification();
  const [isExiting, setIsExiting] = useState(false);
  const style = typeStyles[toast.type];
  const IconComponent = style.icon;

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300);
  };

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-3 flex items-start gap-3 transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
    >
      <IconComponent className={`${style.text} w-5 h-5 flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <h3 className={`${style.text} font-semibold text-sm`}>{toast.title}</h3>
        <p className="text-gray-300 text-sm mt-1">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleDismiss();
            }}
            className={`${style.text} text-xs font-semibold mt-2 hover:underline`}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      {toast.dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-200 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
