import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";

export default function Success() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(3);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!autoRedirectEnabled) return;

    if (countdown <= 0) {
      navigate("/vault/content");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, autoRedirectEnabled, navigate]);

  const handleManualRedirect = () => {
    setAutoRedirectEnabled(false);
    navigate("/vault/content");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--color-midnight)" }}
    >
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div
              className="relative w-24 h-24 flex items-center justify-center rounded-full animate-pulse"
              style={{
                background: "rgba(0, 217, 255, 0.1)",
                border: "2px solid var(--color-cyan)",
              }}
            >
              <CheckCircle
                size={64}
                style={{ color: "var(--color-hot-pink)" }}
              />
            </div>
          </div>

          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: "var(--color-hot-pink)" }}
          >
            Welcome Inside.
          </h1>

          <p
            className="text-xl mb-8"
            style={{ color: "var(--color-cyan)" }}
          >
            You're now part of the system.
          </p>

          <div
            className="p-6 rounded-lg border-2 mb-8"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "var(--color-cyan)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: "var(--color-text-secondary)" }}>
                Membership Status
              </span>
              <span
                className="font-bold px-4 py-2 rounded"
                style={{
                  background: "rgba(255, 20, 147, 0.2)",
                  color: "var(--color-hot-pink)",
                }}
              >
                ✓ Active
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>
                Member Name
              </span>
              <span
                className="font-bold"
                style={{ color: "var(--color-cyan)" }}
              >
                {user?.name || "Initiate"}
              </span>
            </div>
          </div>

          <div
            className="p-6 rounded-lg border-2 mb-12"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "var(--color-hot-pink)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap size={20} style={{ color: "var(--color-hot-pink)" }} />
              <h3
                className="font-bold text-lg"
                style={{ color: "var(--color-hot-pink)" }}
              >
                What's Waiting Inside
              </h3>
            </div>

            <ul
              className="space-y-3 text-left"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--color-cyan)" }}>▸</span>
                Exclusive episodes & removed scenes
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--color-cyan)" }}>▸</span>
                Psyche Awakens tarot system
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--color-cyan)" }}>▸</span>
                Nightmare generator & creative tools
              </li>
              <li className="flex items-center gap-2">
                <span style={{ color: "var(--color-cyan)" }}>▸</span>
                Vault archive & rituals
              </li>
            </ul>
          </div>

          {/* Auto-redirect countdown */}
          <div
            className="mb-8 p-4 rounded-lg text-center"
            style={{
              background: "rgba(0, 217, 255, 0.1)",
              borderLeft: "4px solid var(--color-cyan)",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)" }}>
              Redirecting to vault in{" "}
              <span
                className="font-bold"
                style={{ color: "var(--color-cyan)" }}
              >
                {countdown}s
              </span>
              ...
            </p>
          </div>

          {/* Manual redirect button */}
          <button
            onClick={handleManualRedirect}
            className="w-full py-4 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
          >
            <span>Enter the Vault Now</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          {/* Disable auto-redirect toggle */}
          <button
            onClick={() => setAutoRedirectEnabled(!autoRedirectEnabled)}
            className="mt-4 text-sm underline"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {autoRedirectEnabled ? "Stop" : "Resume"} auto-redirect
          </button>
        </div>

        {/* Footer message */}
        <div
          className="text-center pt-8 border-t-2"
          style={{
            borderColor: "rgba(0, 217, 255, 0.1)",
            color: "var(--color-text-secondary)",
          }}
        >
          <p className="text-sm">
            Questions? Check the{" "}
            <a
              href="/about"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-cyan)" }}
            >
              about page
            </a>{" "}
            or reach out to support.
          </p>
        </div>
      </div>
    </div>
  );
}
