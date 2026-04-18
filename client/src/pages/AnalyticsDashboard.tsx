import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, Zap, Calendar, Download, Filter } from "lucide-react";

interface AnalyticsData {
  totalReadings: number;
  totalUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
  readingsByDay: Array<{ date: string; count: number }>;
  userGrowth: Array<{ month: string; users: number }>;
  engagementByFeature: Array<{ feature: string; usage: number }>;
  topCards: Array<{ name: string; pulls: number }>;
  spreadTypeDistribution: Array<{ name: string; value: number }>;
  userRetention: Array<{ day: number; retention: number }>;
}

export default function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Simulate analytics data calculation from localStorage
    const readings = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
    const comparisons = JSON.parse(localStorage.getItem("comparisonAnalyses") || "[]");
    const forumPosts = JSON.parse(localStorage.getItem("forumPosts") || "[]");
    const nightmares = JSON.parse(localStorage.getItem("nightmareBookmarks") || "[]");
    const prompts = JSON.parse(localStorage.getItem("promptBookmarks") || "[]");

    // Calculate basic metrics
    const totalReadings = readings.length;
    const totalEngagementItems = totalReadings + comparisons.length + forumPosts.length;
    const engagementRate = totalEngagementItems > 0 ? Math.min(100, (totalEngagementItems / 100) * 100) : 0;

    // Generate mock data for visualization
    const readingsByDay = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      count: Math.floor(Math.random() * 10),
    }));

    const userGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      users: Math.floor(100 + i * 15 + Math.random() * 20),
    }));

    const engagementByFeature = [
      { feature: "Tarot Readings", usage: totalReadings },
      { feature: "Comparisons", usage: comparisons.length },
      { feature: "Forum Posts", usage: forumPosts.length },
      { feature: "Nightmares", usage: nightmares.length },
      { feature: "Prompts", usage: prompts.length },
    ];

    const topCards = readings
      .flatMap((r: any) => r.cards || [])
      .reduce((acc: any, card: any) => {
        const existing = acc.find((c: any) => c.name === card.name);
        if (existing) {
          existing.pulls++;
        } else {
          acc.push({ name: card.name, pulls: 1 });
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => b.pulls - a.pulls)
      .slice(0, 8);

    const spreadCounts: Record<string, number> = {};
    readings.forEach((r: any) => {
      spreadCounts[r.spreadType] = (spreadCounts[r.spreadType] || 0) + 1;
    });

    const spreadTypeDistribution = Object.entries(spreadCounts).map(([name, value]) => ({
      name: name === "single" ? "Single" : name === "threecard" ? "3-Card" : name === "pyramid" ? "Pyramid" : "Celtic Cross",
      value: value as number,
    }));

    const userRetention = Array.from({ length: 7 }, (_, i) => ({
      day: i,
      retention: Math.max(20, 100 - i * 12 + Math.random() * 10),
    }));

    setAnalytics({
      totalReadings,
      totalUsers: Math.floor(100 + Math.random() * 50),
      engagementRate,
      averageSessionDuration: Math.floor(15 + Math.random() * 30),
      readingsByDay,
      userGrowth,
      engagementByFeature,
      topCards: topCards.length > 0 ? topCards : [{ name: "No data", pulls: 0 }],
      spreadTypeDistribution: spreadTypeDistribution.length > 0 ? spreadTypeDistribution : [{ name: "No data", value: 0 }],
      userRetention,
    });

    setLoading(false);
  }, [dateRange]);

  if (!isAuthenticated) {
    return null;
  }

  const COLORS = ["#FF1493", "#00D9FF", "#FFD700", "#FF69B4", "#00FF00", "#FF4500", "#00CED1", "#FF00FF"];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            📊 ADVANCED ANALYTICS
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Deep insights into your spiritual journey and community engagement
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8 p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
          <div className="flex items-center gap-4 flex-wrap">
            <Calendar size={20} style={{ color: "var(--color-cyan)" }} />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 rounded bg-card border text-sm"
              style={{ borderColor: "rgba(0, 217, 255, 0.3)", color: "var(--color-text-primary)" }}
              placeholder="Start Date"
            />
            <span style={{ color: "var(--color-text-secondary)" }}>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 rounded bg-card border text-sm"
              style={{ borderColor: "rgba(0, 217, 255, 0.3)", color: "var(--color-text-primary)" }}
              placeholder="End Date"
            />
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="px-4 py-2 text-xs rounded transition-all"
              style={{ background: "rgba(0, 217, 255, 0.1)", color: "var(--color-cyan)" }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-hot-pink)", background: "rgba(255, 20, 147, 0.1)" }}>
                <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Total Readings
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                  {analytics.totalReadings}
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-cyan)", background: "rgba(0, 217, 255, 0.1)" }}>
                <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Engagement Rate
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-cyan)" }}>
                  {Math.round(analytics.engagementRate)}%
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-magenta)", background: "rgba(255, 20, 147, 0.1)" }}>
                <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Avg Session Duration
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-magenta)" }}>
                  {analytics.averageSessionDuration}m
                </div>
              </div>

              <button
                onClick={() => {
                  const dataStr = JSON.stringify(analytics, null, 2);
                  const dataBlob = new Blob([dataStr], { type: "application/json" });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
                  link.click();
                }}
                className="p-6 rounded-lg border transition-all hover:scale-105"
                style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}
              >
                <Download size={20} style={{ color: "var(--color-cyan)", marginBottom: "8px" }} />
                <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Export Report
                </div>
              </button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Reading Frequency */}
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} style={{ color: "var(--color-cyan)" }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-cyan)" }}>
                    READING FREQUENCY (30 DAYS)
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.readingsByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.2)" />
                    <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-cyan)" }} />
                    <Area type="monotone" dataKey="count" stroke="var(--color-cyan)" fill="rgba(0, 217, 255, 0.2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* User Growth */}
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(255, 20, 147, 0.3)", background: "rgba(255, 20, 147, 0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Users size={20} style={{ color: "var(--color-hot-pink)" }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                    USER GROWTH (12 MONTHS)
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 20, 147, 0.2)" />
                    <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-hot-pink)" }} />
                    <Line type="monotone" dataKey="users" stroke="var(--color-hot-pink)" strokeWidth={2} dot={{ fill: "var(--color-magenta)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement by Feature */}
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} style={{ color: "var(--color-cyan)" }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-cyan)" }}>
                    ENGAGEMENT BY FEATURE
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.engagementByFeature}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.2)" />
                    <XAxis dataKey="feature" stroke="var(--color-text-secondary)" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="var(--color-text-secondary)" />
                    <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-cyan)" }} />
                    <Bar dataKey="usage" fill="var(--color-cyan)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Spread Type Distribution */}
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(255, 20, 147, 0.3)", background: "rgba(255, 20, 147, 0.05)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={20} style={{ color: "var(--color-hot-pink)" }} />
                  <h2 className="text-xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                    SPREAD TYPE DISTRIBUTION
                  </h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.spreadTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.spreadTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-hot-pink)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Cards */}
            {analytics.topCards.length > 0 && (
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                  🃏 TOP PULLED CARDS
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {analytics.topCards.map((card, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border text-center"
                      style={{ borderColor: "rgba(0, 217, 255, 0.2)", background: "rgba(0, 0, 0, 0.3)" }}
                    >
                      <div className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                        #{index + 1}
                      </div>
                      <div style={{ color: "var(--color-cyan)" }} className="font-semibold">
                        {card.name}
                      </div>
                      <div style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                        {card.pulls} pulls
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {loading && (
          <div style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "40px" }}>
            Loading analytics...
          </div>
        )}
      </div>
    </div>
  );
}
