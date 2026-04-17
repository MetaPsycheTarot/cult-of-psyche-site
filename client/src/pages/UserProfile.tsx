import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { Calendar, Zap, BookOpen, Award } from "lucide-react";

interface MemberStats {
  totalNightmares: number;
  totalReadings: number;
  totalPrompts: number;
  joinDate: string;
  lastActive: string;
  membershipTier: "free" | "monthly" | "lifetime";
  engagementScore: number;
}

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<MemberStats>({
    totalNightmares: 0,
    totalReadings: 0,
    totalPrompts: 0,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    membershipTier: "free",
    engagementScore: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Calculate stats from localStorage
    const nightmares = JSON.parse(localStorage.getItem("nightmareBookmarks") || "[]");
    const readings = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
    const prompts = JSON.parse(localStorage.getItem("promptBookmarks") || "[]");

    const totalItems = nightmares.length + readings.length + prompts.length;
    const engagementScore = Math.min(100, (totalItems * 10) + (user?.role === "admin" || user?.role === "user" ? 20 : 0));

    setStats({
      totalNightmares: nightmares.length,
      totalReadings: readings.length,
      totalPrompts: prompts.length,
      joinDate: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      lastActive: new Date().toISOString(),
      membershipTier: user?.role === "admin" || user?.role === "user" ? "lifetime" : "free",
      engagementScore,
    });
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return "Master";
    if (score >= 60) return "Adept";
    if (score >= 40) return "Initiate";
    if (score >= 20) return "Seeker";
    return "Novice";
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            👤 YOUR PROFILE
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Your journey through the Cult of Psyche
          </p>
        </div>

        {/* Profile Card */}
        <div
          className="rounded-lg border p-8 mb-8"
          style={{
            background: "rgba(0, 217, 255, 0.05)",
            borderColor: "rgba(0, 217, 255, 0.2)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                {user?.name || "Member"}
              </h2>
              <p style={{ color: "var(--color-text-secondary)" }} className="text-lg">
                {user?.email}
              </p>
            </div>

            <div className="text-right">
              <div
                className="px-4 py-2 rounded-lg font-bold mb-2"
                style={{
                  background: "var(--color-hot-pink)",
                  color: "var(--color-midnight)",
                }}
              >
                {stats.membershipTier === "free" ? "Free Member" : "Vault Member"}
              </div>
              <p style={{ color: "var(--color-cyan)" }} className="text-sm">
                {getEngagementLevel(stats.engagementScore)} Level
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className="p-6 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} style={{ color: "var(--color-magenta)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                Nightmares
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "var(--color-magenta)" }}>
              {stats.totalNightmares}
            </div>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={20} style={{ color: "var(--color-cyan)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                Readings
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "var(--color-cyan)" }}>
              {stats.totalReadings}
            </div>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "rgba(255, 20, 147, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} style={{ color: "var(--color-hot-pink)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                Prompts
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              {stats.totalPrompts}
            </div>
          </div>

          <div
            className="p-6 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} style={{ color: "var(--color-hot-pink)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                Engagement
              </span>
            </div>
            <div className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              {stats.engagementScore}%
            </div>
          </div>
        </div>

        {/* Engagement Progress */}
        <div
          className="rounded-lg border p-6 mb-8"
          style={{
            background: "rgba(0, 217, 255, 0.05)",
            borderColor: "rgba(0, 217, 255, 0.2)",
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            Engagement Progress
          </h3>
          <div className="space-y-4">
            {[
              { label: "Novice", min: 0, max: 20 },
              { label: "Seeker", min: 20, max: 40 },
              { label: "Initiate", min: 40, max: 60 },
              { label: "Adept", min: 60, max: 80 },
              { label: "Master", min: 80, max: 100 },
            ].map((level) => (
              <div key={level.label}>
                <div className="flex justify-between mb-1">
                  <span style={{ color: "var(--color-text-secondary)" }}>{level.label}</span>
                  <span style={{ color: "var(--color-cyan)" }}>
                    {level.min}% - {level.max}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(0, 217, 255, 0.1)" }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.max(0, Math.min(100, stats.engagementScore) - level.min) / (level.max - level.min) * 100}%`,
                      background:
                        stats.engagementScore >= level.min
                          ? "var(--color-hot-pink)"
                          : "transparent",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div
          className="rounded-lg border p-6"
          style={{
            background: "rgba(255, 20, 147, 0.05)",
            borderColor: "rgba(255, 20, 147, 0.3)",
          }}
        >
          <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>Member Since</span>
              <span style={{ color: "var(--color-cyan)" }} className="font-semibold">
                {new Date(stats.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>Last Active</span>
              <span style={{ color: "var(--color-cyan)" }} className="font-semibold">
                {new Date(stats.lastActive).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>Total Items Created</span>
              <span style={{ color: "var(--color-hot-pink)" }} className="font-semibold">
                {stats.totalNightmares + stats.totalReadings + stats.totalPrompts}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
