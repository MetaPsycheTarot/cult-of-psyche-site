import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { Trophy, Zap, TrendingUp } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  userId: string;
  engagementScore: number;
  totalItems: number;
  nightmares: number;
  readings: number;
  prompts: number;
  forumPosts: number;
}

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [sortBy, setSortBy] = useState<"engagement" | "nightmares" | "readings" | "prompts">("engagement");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Calculate leaderboard from localStorage
    const nightmares = JSON.parse(localStorage.getItem("nightmareBookmarks") || "[]");
    const readings = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
    const prompts = JSON.parse(localStorage.getItem("promptBookmarks") || "[]");
    const forumPosts = JSON.parse(localStorage.getItem("forumPosts") || "[]");

    const totalItems = nightmares.length + readings.length + prompts.length + forumPosts.length;
    const engagementScore = Math.min(100, (totalItems * 10) + 20);

    // Create current user entry
    const currentUserEntry: LeaderboardEntry = {
      rank: 1,
      name: user?.name || "You",
      userId: user?.id?.toString() || "current",
      engagementScore,
      totalItems,
      nightmares: nightmares.length,
      readings: readings.length,
      prompts: prompts.length,
      forumPosts: forumPosts.filter((p: any) => p.authorId === user?.id?.toString()).length,
    };

    // Generate mock leaderboard entries (in production, this would come from a database)
    const mockEntries: LeaderboardEntry[] = [
      {
        rank: 1,
        name: "Cipher",
        userId: "user-cipher",
        engagementScore: 95,
        totalItems: 87,
        nightmares: 24,
        readings: 31,
        prompts: 28,
        forumPosts: 4,
      },
      {
        rank: 2,
        name: "Echo",
        userId: "user-echo",
        engagementScore: 88,
        totalItems: 76,
        nightmares: 18,
        readings: 28,
        prompts: 25,
        forumPosts: 5,
      },
      {
        rank: 3,
        name: "Void",
        userId: "user-void",
        engagementScore: 82,
        totalItems: 68,
        nightmares: 22,
        readings: 24,
        prompts: 20,
        forumPosts: 2,
      },
      {
        rank: 4,
        name: "Seeker",
        userId: "user-seeker",
        engagementScore: 75,
        totalItems: 58,
        nightmares: 16,
        readings: 20,
        prompts: 18,
        forumPosts: 4,
      },
      {
        rank: 5,
        name: "Initiate",
        userId: "user-initiate",
        engagementScore: 68,
        totalItems: 48,
        nightmares: 14,
        readings: 16,
        prompts: 14,
        forumPosts: 4,
      },
    ];

    // Combine and sort
    let combined = [...mockEntries];
    
    // Check if current user should be in top 5
    const currentUserInTop5 = combined.some((e) => e.userId === user?.id?.toString());
    if (!currentUserInTop5 && currentUserEntry.engagementScore > combined[combined.length - 1].engagementScore) {
      combined = combined.slice(0, 4);
      combined.push(currentUserEntry);
    }

    // Sort based on selected metric
    let sorted = [...combined];
    switch (sortBy) {
      case "nightmares":
        sorted.sort((a, b) => b.nightmares - a.nightmares);
        break;
      case "readings":
        sorted.sort((a, b) => b.readings - a.readings);
        break;
      case "prompts":
        sorted.sort((a, b) => b.prompts - a.prompts);
        break;
      default:
        sorted.sort((a, b) => b.engagementScore - a.engagementScore);
    }

    // Update ranks
    sorted = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));

    setLeaderboard(sorted);

    // Find current user's rank
    const userEntry = sorted.find((e) => e.userId === user?.id?.toString());
    if (userEntry) {
      setUserRank(userEntry);
    } else {
      setUserRank(currentUserEntry);
    }
  }, [user, sortBy]);

  if (!isAuthenticated) {
    return null;
  }

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            🏆 LEADERBOARD
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Top members by engagement and contribution
          </p>
        </div>

        {/* Your Rank Card */}
        {userRank && (
          <div
            className="rounded-lg border p-6 mb-8"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "rgba(255, 20, 147, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                  YOUR RANK
                </p>
                <h2 className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                  {getMedalEmoji(userRank.rank)} {userRank.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                    Engagement Score
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "var(--color-cyan)" }}>
                    {userRank.engagementScore}%
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                    {userRank.totalItems}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {(["engagement", "nightmares", "readings", "prompts"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSortBy(metric)}
              className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
              style={{
                background:
                  sortBy === metric
                    ? "var(--color-hot-pink)"
                    : "rgba(0, 217, 255, 0.1)",
                color:
                  sortBy === metric
                    ? "var(--color-midnight)"
                    : "var(--color-text-secondary)",
              }}
            >
              {metric === "engagement" ? "Engagement" : metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className="rounded-lg border p-4 flex items-center justify-between"
              style={{
                background:
                  entry.userId === user?.id?.toString()
                    ? "rgba(255, 20, 147, 0.1)"
                    : "rgba(0, 217, 255, 0.03)",
                borderColor:
                  entry.userId === user?.id?.toString()
                    ? "rgba(255, 20, 147, 0.3)"
                    : "rgba(0, 217, 255, 0.2)",
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold w-12 text-center">
                  {getMedalEmoji(entry.rank)}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold" style={{ color: "var(--color-hot-pink)" }}>
                    {entry.name}
                    {entry.userId === user?.id?.toString() && (
                      <span style={{ color: "var(--color-cyan)" }} className="text-sm ml-2">
                        (You)
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-4 mt-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <span>🌙 {entry.nightmares}</span>
                    <span>🔮 {entry.readings}</span>
                    <span>✍️ {entry.prompts}</span>
                    <span>💬 {entry.forumPosts}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: "var(--color-cyan)" }}>
                  {entry.engagementScore}%
                </div>
                <p style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                  {entry.totalItems} items
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div
          className="mt-8 p-6 rounded-lg border"
          style={{
            background: "rgba(255, 20, 147, 0.05)",
            borderColor: "rgba(255, 20, 147, 0.3)",
          }}
        >
          <p style={{ color: "var(--color-text-secondary)" }}>
            <span style={{ color: "var(--color-hot-pink)" }}>⚡ How Engagement Works:</span> Your
            engagement score is calculated from nightmares generated, tarot readings performed,
            prompts used, and forum contributions. The more you engage with the system, the higher
            your score. Rankings update in real-time as members contribute.
          </p>
        </div>
      </div>
    </div>
  );
}
