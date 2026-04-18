import { useEffect, useState } from "react";
import "./SymbolicFeedback.css";

export interface SymbolicNotification {
  id: string;
  message: string;
  symbol: string;
  type: "milestone" | "level-up" | "achievement" | "guidance" | "warning";
  duration?: number;
}

/**
 * Symbolic Feedback System
 * Displays mystical notifications with symbolic elements
 */
export function SymbolicNotificationCenter() {
  const [notifications, setNotifications] = useState<SymbolicNotification[]>(
    []
  );

  const addNotification = (notification: SymbolicNotification) => {
    const id = notification.id || Date.now().toString();
    const duration = notification.duration || 5000;

    setNotifications((prev) => [...prev, { ...notification, id }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  return (
    <div className="symbolic-notification-center">
      {notifications.map((notification) => (
        <SymbolicNotification
          key={notification.id}
          notification={notification}
          onClose={() =>
            setNotifications((prev) =>
              prev.filter((n) => n.id !== notification.id)
            )
          }
        />
      ))}
    </div>
  );
}

/**
 * Individual Symbolic Notification
 */
function SymbolicNotification({
  notification,
  onClose,
}: {
  notification: SymbolicNotification;
  onClose: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const typeStyles = {
    milestone: "notification-milestone",
    "level-up": "notification-level-up",
    achievement: "notification-achievement",
    guidance: "notification-guidance",
    warning: "notification-warning",
  };

  return (
    <div
      className={`symbolic-notification ${typeStyles[notification.type]} ${isExiting ? "exiting" : ""}`}
    >
      <div className="notification-symbol">{notification.symbol}</div>
      <div className="notification-content">
        <p className="notification-message">{notification.message}</p>
      </div>
      <button className="notification-close" onClick={handleClose}>
        ✕
      </button>
      <div className="notification-glow"></div>
    </div>
  );
}

/**
 * Milestone Reveal Component
 * Displays when user unlocks a new milestone
 */
export function MilestoneReveal({
  milestone,
  onComplete,
}: {
  milestone: {
    id: string;
    name: string;
    description: string;
    symbol: string;
  };
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`milestone-reveal ${isVisible ? "visible" : "hidden"}`}>
      <div className="milestone-container">
        <div className="milestone-symbol-large">{milestone.symbol}</div>
        <h2 className="milestone-name">{milestone.name}</h2>
        <p className="milestone-description">{milestone.description}</p>
        <div className="milestone-glow"></div>
      </div>
    </div>
  );
}

/**
 * Level Up Animation
 * Displays when user reaches a new progression level
 */
export function LevelUpAnimation({
  level,
  name,
  onComplete,
}: {
  level: number;
  name: string;
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`level-up-animation ${isVisible ? "visible" : "hidden"}`}>
      <div className="level-up-container">
        <div className="level-number">{level}</div>
        <div className="level-name">{name}</div>
        <div className="level-stars">
          {Array.from({ length: level }).map((_, i) => (
            <span key={i} className="level-star">
              ✦
            </span>
          ))}
        </div>
        <div className="level-glow"></div>
      </div>
    </div>
  );
}

/**
 * Guidance Tooltip
 * Provides contextual mystical guidance
 */
export function GuidanceTooltip({
  message,
  symbol = "◆",
  position = "top",
}: {
  message: string;
  symbol?: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <div className={`guidance-tooltip tooltip-${position}`}>
      <div className="tooltip-symbol">{symbol}</div>
      <div className="tooltip-message">{message}</div>
      <div className="tooltip-glow"></div>
    </div>
  );
}

/**
 * Achievement Badge
 * Displays earned achievements
 */
export function AchievementBadge({
  achievement,
  isUnlocked = false,
}: {
  achievement: {
    id: string;
    name: string;
    description: string;
    symbol: string;
  };
  isUnlocked?: boolean;
}) {
  return (
    <div className={`achievement-badge ${isUnlocked ? "unlocked" : "locked"}`}>
      <div className="badge-symbol">{achievement.symbol}</div>
      <div className="badge-info">
        <h3 className="badge-name">{achievement.name}</h3>
        <p className="badge-description">{achievement.description}</p>
      </div>
      {isUnlocked && <div className="badge-glow"></div>}
    </div>
  );
}
