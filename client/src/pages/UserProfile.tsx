import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { Calendar, Zap, BookOpen, Award, MessageSquare, Clock, Star, Flame } from "lucide-react";
import { AchievementBadge, LevelUpAnimation, MilestoneReveal } from "@/components/SymbolicFeedback";

import {
  calculateProgressionLevel,
  calculateUnlockedMilestones,
  getProgressionNarrative,
} from "@/lib/progressionHelpers";

interface MemberStats {
  totalNightmares: number;
  totalReadings: number;
  totalPrompts: number;
  totalComparisons: number;
  totalForumPosts: number;
  totalPDFExports: number;
  joinDate: string;
  lastActive: string;
  membershipTier: "free" | "monthly" | "lifetime";
  engagementScore: number;
}

interface ForumPost {
  id: string;
  title: string;
  category: string;
  content: string;
  timestamp: number;
  replies: number;
  userId?: string;
}

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<MemberStats>({
    totalNightmares: 0,
    totalReadings: 0,
    totalPrompts: 0,
    totalComparisons: 0,
    totalForumPosts: 0,
    totalPDFExports: 0,
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    membershipTier: "free",
    engagementScore: 0,
  });
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [progression, setProgression] = useState<any>(null);
  const [unlockedMilestones, setUnlockedMilestones] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showMilestone, setShowMilestone] = useState<any>(null);

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
    const comparisons = JSON.parse(localStorage.getItem("comparisonAnalyses") || "[]");
    const allPosts = JSON.parse(localStorage.getItem("forumPosts") || "[]");
    const userPosts = allPosts.filter((post: any) => post.userId === user?.id);

    // Count PDF exports (tracked in readings metadata)
    const pdfExportCount = readings.filter((r: any) => r.exportedToPDF).length;

    const totalItems = nightmares.length + readings.length + prompts.length;
    const engagementScore = Math.min(
      100,
      (totalItems * 10) + (userPosts.length * 5) + (comparisons.length * 8) + (pdfExportCount * 3)
    );

    const newStats: MemberStats = {
      totalNightmares: nightmares.length,
      totalReadings: readings.length,
      totalPrompts: prompts.length,
      totalComparisons: comparisons.length,
      totalForumPosts: userPosts.length,
      totalPDFExports: pdfExportCount,
      joinDate: user?.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      lastActive: new Date().toISOString(),
      membershipTier: (user?.role === "admin" || user?.role === "user" ? "lifetime" : "free") as "free" | "monthly" | "lifetime",
      engagementScore,
    };

    setStats(newStats);

    // Calculate progression level based on reading count
    const progressionData = calculateProgressionLevel(readings.length);
    setProgression(progressionData);

    // Calculate unlocked milestones
    const milestones = calculateUnlockedMilestones({
      readingCount: readings.length,
      comparisonCount: comparisons.length,
      forumCount: userPosts.length,
      pdfExportCount,
    });
    setUnlockedMilestones(milestones);

    // Load recent forum posts
    const recentUserPosts = userPosts
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .slice(0, 5);
    setRecentPosts(recentUserPosts);
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      nightmare: "var(--color-magenta)",
      ritual: "var(--color-cyan)",
      general: "var(--color-hot-pink)",
      help: "#FFD700",
      support: "#FFD700",
    };
    return colors[category] || "var(--color-cyan)";
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Level Up Animation */}
        {showLevelUp && progression && (
          <LevelUpAnimation
            level={progression.level}
            name={progression.name}
            onComplete={() => setShowLevelUp(false)}
          />
        )}

        {/* Milestone Reveal */}
        {showMilestone && (
          <MilestoneReveal
            milestone={showMilestone}
            onComplete={() => setShowMilestone(null)}
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            👤 YOUR PROFILE
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Your journey through the Cult of Psyche
          </p>
        </div>

        {/* Profile Card with Progression */}
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
              {progression && (
                <div className="mb-4">
                  <div
                    className="px-6 py-3 rounded-lg font-bold mb-2 inline-block"
                    style={{
                      background: "linear-gradient(135deg, var(--color-hot-pink), var(--color-magenta))",
                      color: "var(--color-midnight)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{progression.symbol}</span>
                      <span>{progression.name.toUpperCase()}</span>
                    </div>
                  </div>
                  <p style={{ color: "var(--color-cyan)" }} className="text-sm">
                    Level {progression.level} of 7
                  </p>
                </div>
              )}
              <div
                className="px-4 py-2 rounded-lg font-bold"
                style={{
                  background: "var(--color-hot-pink)",
                  color: "var(--color-midnight)",
                }}
              >
                {stats.membershipTier === "free" ? "Free Member" : "Vault Member"}
              </div>
            </div>
          </div>

          {/* Progression Narrative */}
          {progression && (
            <div
              className="mt-6 p-4 rounded-lg border-l-4"
              style={{
                background: "rgba(255, 20, 147, 0.05)",
                borderColor: "var(--color-magenta)",
              }}
            >
              <p style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                "{getProgressionNarrative(progression.level)}"
              </p>
            </div>
          )}
        </div>

        {/* Progression Bar */}
        {progression && (
          <div
            className="rounded-lg border p-6 mb-8"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              ✦ PROGRESSION TO NEXT LEVEL
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {progression.nextLevel ? `${progression.nextLevel.name}` : "ARCHON (Max Level)"}
                  </span>
                  <span style={{ color: "var(--color-cyan)" }}>
                    {stats.totalReadings} / {progression.nextLevel?.minReadings || "∞"} readings
                  </span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: "rgba(0, 217, 255, 0.1)" }}
                >
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${progression.progressToNext}%`,
                      background: "linear-gradient(90deg, var(--color-magenta), var(--color-hot-pink))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div
            className="p-6 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={20} style={{ color: "var(--color-magenta)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Nightmares
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-magenta)" }}>
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
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Readings
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-cyan)" }}>
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
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Prompts
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
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
              <Flame size={20} style={{ color: "var(--color-magenta)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Comparisons
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-magenta)" }}>
              {stats.totalComparisons}
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
              <MessageSquare size={20} style={{ color: "var(--color-cyan)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Forum Posts
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-cyan)" }}>
              {stats.totalForumPosts}
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
              <Star size={20} style={{ color: "var(--color-hot-pink)" }} />
              <span style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                Engagement
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              {stats.engagementScore}%
            </div>
          </div>
        </div>

        {/* Unlocked Milestones */}
        {unlockedMilestones.length > 0 && (
          <div
            className="rounded-lg border p-6 mb-8"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              ✦ UNLOCKED MILESTONES ({unlockedMilestones.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unlockedMilestones.map((milestone) => (
                <AchievementBadge
                  key={milestone.id}
                  achievement={milestone}
                  isUnlocked={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Forum Posts */}
        {recentPosts.length > 0 && (
          <div
            className="rounded-lg border p-6 mb-8"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={24} style={{ color: "var(--color-hot-pink)" }} />
              <h3 className="text-xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                Recent Forum Posts
              </h3>
            </div>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-lg border"
                  style={{
                    background: "rgba(255, 20, 147, 0.03)",
                    borderColor: "rgba(0, 217, 255, 0.1)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: "var(--color-cyan)" }}>
                        {post.title}
                      </h4>
                      <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className="px-2 py-1 rounded"
                          style={{
                            background: `${getCategoryColor(post.category)}20`,
                            color: getCategoryColor(post.category),
                          }}
                        >
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                          <Clock size={14} />
                          {new Date(post.timestamp).toLocaleDateString()}
                        </div>
                        <div style={{ color: "var(--color-cyan)" }}>
                          {post.replies} replies
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--color-text-secondary)" }}>PDF Exports</span>
              <span style={{ color: "var(--color-hot-pink)" }} className="font-semibold">
                {stats.totalPDFExports}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
