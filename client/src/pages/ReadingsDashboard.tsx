import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Calendar, Sparkles, Download, Share2 } from "lucide-react";

interface SavedReading {
  id: string;
  cards: Array<{ name: string; suit: string }>;
  interpretation: string;
  cardCount: number;
  spreadType: string;
  timestamp: string;
  question?: string;
  notes?: string;
}

export default function ReadingsDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [stats, setStats] = useState({
    totalReadings: 0,
    mostPulledCards: [] as Array<{ name: string; count: number }>,
    spreadDistribution: [] as Array<{ name: string; value: number }>,
    readingsByDate: [] as Array<{ date: string; count: number }>,
  });

  useEffect(() => {
    const savedReadings = localStorage.getItem("tarotReadings");
    if (savedReadings) {
      const parsed = JSON.parse(savedReadings);
      setReadings(parsed);
      calculateStats(parsed, dateRange);
    }
  }, [dateRange]);

  const calculateStats = (readingsData: SavedReading[], range: { start: string; end: string }) => {
    let filteredReadings = readingsData;

    if (range.start || range.end) {
      const startDate = range.start ? new Date(range.start) : new Date(0);
      const endDate = range.end ? new Date(range.end) : new Date();
      filteredReadings = readingsData.filter((r) => {
        const readingDate = new Date(r.timestamp);
        return readingDate >= startDate && readingDate <= endDate;
      });
    }

    const cardFrequency: Record<string, number> = {};
    const spreadCounts: Record<string, number> = {};
    const dateFrequency: Record<string, number> = {};

    filteredReadings.forEach((reading: SavedReading) => {
      reading.cards.forEach((card) => {
        cardFrequency[card.name] = (cardFrequency[card.name] || 0) + 1;
      });
      spreadCounts[reading.spreadType] = (spreadCounts[reading.spreadType] || 0) + 1;
      const date = new Date(reading.timestamp).toLocaleDateString();
      dateFrequency[date] = (dateFrequency[date] || 0) + 1;
    });

    const mostPulled = Object.entries(cardFrequency)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const spreadDist = Object.entries(spreadCounts).map(([name, value]) => ({
      name: name === "single" ? "Single" : name === "threecard" ? "3-Card" : name === "pyramid" ? "Pyramid" : "Celtic Cross",
      value,
    }));

    const readingsByDate = Object.entries(dateFrequency)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);

    setStats({
      totalReadings: filteredReadings.length,
      mostPulledCards: mostPulled,
      spreadDistribution: spreadDist,
      readingsByDate,
    });
  };

  const handleShareReading = (reading: SavedReading) => {
    const forumPosts = JSON.parse(localStorage.getItem("forumPosts") || "[]");
    const newPost = {
      id: Date.now().toString(),
      title: `📖 Tarot Reading: ${reading.spreadType} Spread`,
      content: `**Spread Type:** ${reading.spreadType}\n\n**Cards:**\n${reading.cards.map((c) => `- ${c.name} (${c.suit})`).join("\n")}\n\n**Interpretation:**\n${reading.interpretation}${reading.notes ? `\n\n**Notes:**\n${reading.notes}` : ""}`,
      category: "readings",
      author: user?.name || "Anonymous",
      timestamp: new Date().toISOString(),
      replies: [],
      isPinned: false,
    };
    forumPosts.push(newPost);
    localStorage.setItem("forumPosts", JSON.stringify(forumPosts));
    navigate("/forum");
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(stats, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reading-statistics-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const COLORS = ["#FF1493", "#00D9FF", "#FFD700", "#FF69B4", "#00FF00", "#FF4500"];

  return (
    <div className="min-h-screen p-8" style={{ background: "var(--color-midnight)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            📊 READING STATISTICS
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Track your tarot reading history and discover patterns in your spiritual journey
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-hot-pink)", background: "rgba(255, 20, 147, 0.1)" }}>
            <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>Total Readings</div>
            <div className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>{stats.totalReadings}</div>
          </div>
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-cyan)", background: "rgba(0, 217, 255, 0.1)" }}>
            <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>Most Pulled Card</div>
            <div className="text-lg font-bold" style={{ color: "var(--color-cyan)" }}>
              {stats.mostPulledCards.length > 0 ? stats.mostPulledCards[0].name : "N/A"}
            </div>
            <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {stats.mostPulledCards.length > 0 ? `${stats.mostPulledCards[0].count} times` : ""}
            </div>
          </div>
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-gold)", background: "rgba(255, 215, 0, 0.1)" }}>
            <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>Favorite Spread</div>
            <div className="text-lg font-bold" style={{ color: "var(--color-gold)" }}>
              {stats.spreadDistribution.length > 0
                ? stats.spreadDistribution.reduce((a, b) => (a.value > b.value ? a : b)).name
                : "N/A"}
            </div>
          </div>
          <button
            onClick={handleExport}
            className="p-6 rounded-lg border transition-all hover:scale-105"
            style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}
          >
            <Download size={20} style={{ color: "var(--color-cyan)", marginBottom: "8px" }} />
            <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Export Data</div>
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Cards Chart */}
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-hot-pink)", background: "rgba(255, 20, 147, 0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} style={{ color: "var(--color-hot-pink)" }} />
              <h2 className="text-xl font-bold" style={{ color: "var(--color-hot-pink)" }}>TOP 10 MOST PULLED CARDS</h2>
            </div>
            {stats.mostPulledCards.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.mostPulledCards}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.2)" />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="var(--color-text-secondary)" />
                  <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-cyan)" }} />
                  <Bar dataKey="count" fill="var(--color-hot-pink)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "var(--color-text-secondary)" }}>No readings yet</div>
            )}
          </div>

          {/* Spread Distribution */}
          <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-cyan)", background: "rgba(0, 217, 255, 0.05)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} style={{ color: "var(--color-cyan)" }} />
              <h2 className="text-xl font-bold" style={{ color: "var(--color-cyan)" }}>SPREAD TYPE DISTRIBUTION</h2>
            </div>
            {stats.spreadDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.spreadDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {stats.spreadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-cyan)" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: "var(--color-text-secondary)" }}>No readings yet</div>
            )}
          </div>
        </div>

        {/* Reading Frequency Chart */}
        <div className="p-6 rounded-lg border mb-8" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
            📈 READING FREQUENCY (LAST 30 DAYS)
          </h2>
          {stats.readingsByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.readingsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.2)" />
                <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip contentStyle={{ background: "var(--color-midnight)", border: "1px solid var(--color-cyan)" }} />
                <Line type="monotone" dataKey="count" stroke="var(--color-cyan)" strokeWidth={2} dot={{ fill: "var(--color-hot-pink)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ color: "var(--color-text-secondary)" }}>No readings yet</div>
          )}
        </div>

        {/* Recent Readings */}
        <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
            🃏 RECENT READINGS
          </h2>
          {readings.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {readings
                .slice()
                .reverse()
                .slice(0, 10)
                .map((reading) => (
                  <div key={reading.id} className="p-4 rounded border" style={{ borderColor: "rgba(0, 217, 255, 0.2)", background: "rgba(0, 0, 0, 0.3)" }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold" style={{ color: "var(--color-cyan)" }}>
                          {reading.spreadType} Spread ({reading.cardCount} cards)
                        </div>
                        <div className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {new Date(reading.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleShareReading(reading)}
                        className="p-2 rounded transition-all hover:bg-card"
                        style={{ color: "var(--color-cyan)" }}
                        title="Share to forum"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                    <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {reading.cards.map((c) => c.name).join(", ")}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div style={{ color: "var(--color-text-secondary)" }}>
              No readings yet. Start your first reading in the Tarot Pull tool!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
