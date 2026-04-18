import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Calendar, Sparkles, Download } from "lucide-react";

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
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [stats, setStats] = useState({
    totalReadings: 0,
    mostPulledCards: [] as Array<{ name: string; count: number }>,
    spreadDistribution: [] as Array<{ name: string; value: number }>,
    readingsByDate: [] as Array<{ date: string; count: number }>,
  });

  useEffect(() => {
    // Load readings from localStorage
    const savedReadings = localStorage.getItem("tarotReadings");
    if (savedReadings) {
      const parsed = JSON.parse(savedReadings);
      setReadings(parsed);

      // Calculate statistics
      const cardFrequency: Record<string, number> = {};
      const spreadCounts: Record<string, number> = {};
      const dateFrequency: Record<string, number> = {};

      parsed.forEach((reading: SavedReading) => {
        // Count cards
        reading.cards.forEach((card) => {
          cardFrequency[card.name] = (cardFrequency[card.name] || 0) + 1;
        });

        // Count spreads
        spreadCounts[reading.spreadType] = (spreadCounts[reading.spreadType] || 0) + 1;

        // Count by date
        const date = new Date(reading.timestamp).toLocaleDateString();
        dateFrequency[date] = (dateFrequency[date] || 0) + 1;
      });

      // Sort most pulled cards
      const mostPulled = Object.entries(cardFrequency)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Format spread distribution
      const spreadDist = Object.entries(spreadCounts).map(([name, value]) => ({
        name: name === "single" ? "Single" : name === "threecard" ? "3-Card" : name === "pyramid" ? "Pyramid" : "Celtic Cross",
        value,
      }));

      // Format readings by date
      const readingsByDate = Object.entries(dateFrequency)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-30); // Last 30 days

      setStats({
        totalReadings: parsed.length,
        mostPulledCards: mostPulled,
        spreadDistribution: spreadDist,
        readingsByDate,
      });
    }
  }, []);

  const handleExport = () => {
    const dataStr = JSON.stringify(readings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tarot-readings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-midnight)" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Please log in to view your reading statistics.</p>
      </div>
    );
  }

  const COLORS = ["#FF1493", "#00D9FF", "#FFD700", "#FF69B4", "#00CED1", "#FF00FF"];

  return (
    <div style={{ background: "var(--color-midnight)", color: "var(--color-text-primary)" }} className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={32} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-4xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              Reading Statistics
            </h1>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Track your tarot reading history and discover patterns in your spiritual journey
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "var(--color-hot-pink)",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mb-2">
              Total Readings
            </p>
            <p className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              {stats.totalReadings}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "var(--color-cyan)",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mb-2">
              Most Pulled Card
            </p>
            <p className="text-lg font-bold" style={{ color: "var(--color-cyan)" }}>
              {stats.mostPulledCards[0]?.name || "N/A"}
            </p>
            <p style={{ color: "var(--color-text-secondary)" }} className="text-xs mt-1">
              {stats.mostPulledCards[0]?.count || 0} times
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(255, 215, 0, 0.05)",
              borderColor: "var(--color-gold)",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mb-2">
              Favorite Spread
            </p>
            <p className="text-lg font-bold" style={{ color: "var(--color-gold)" }}>
              {stats.spreadDistribution[0]?.name || "N/A"}
            </p>
          </div>

          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(0, 255, 136, 0.05)",
              borderColor: "var(--color-green)",
            }}
          >
            <button
              onClick={handleExport}
              className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"
              style={{ color: "var(--color-green)" }}
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Most Pulled Cards */}
          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "var(--color-hot-pink)",
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              🃏 Top 10 Most Pulled Cards
            </h3>
            {stats.mostPulledCards.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.mostPulledCards}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 20, 147, 0.2)" />
                  <XAxis dataKey="name" stroke="var(--color-text-secondary)" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="var(--color-text-secondary)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 14, 39, 0.9)",
                      border: "2px solid var(--color-hot-pink)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--color-hot-pink)" }}
                  />
                  <Bar dataKey="count" fill="var(--color-hot-pink)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: "var(--color-text-secondary)" }}>No readings yet</p>
            )}
          </div>

          {/* Spread Distribution */}
          <div
            className="p-6 rounded-lg border-2"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "var(--color-cyan)",
            }}
          >
            <h3 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              📊 Spread Type Distribution
            </h3>
            {stats.spreadDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={stats.spreadDistribution} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {stats.spreadDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 14, 39, 0.9)",
                      border: "2px solid var(--color-cyan)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "var(--color-cyan)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ color: "var(--color-text-secondary)" }}>No readings yet</p>
            )}
          </div>
        </div>

        {/* Reading Frequency Timeline */}
        <div
          className="p-6 rounded-lg border-2 mb-12"
          style={{
            background: "rgba(255, 215, 0, 0.05)",
            borderColor: "var(--color-gold)",
          }}
        >
          <h3 className="font-bold mb-4" style={{ color: "var(--color-gold)" }}>
            📈 Reading Frequency (Last 30 Days)
          </h3>
          {stats.readingsByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.readingsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 215, 0, 0.2)" />
                <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 14, 39, 0.9)",
                    border: "2px solid var(--color-gold)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-gold)" }}
                />
                <Line type="monotone" dataKey="count" stroke="var(--color-gold)" strokeWidth={2} dot={{ fill: "var(--color-gold)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "var(--color-text-secondary)" }}>No readings yet</p>
          )}
        </div>

        {/* Recent Readings */}
        <div
          className="p-6 rounded-lg border-2"
          style={{
            background: "rgba(0, 255, 136, 0.05)",
            borderColor: "var(--color-green)",
          }}
        >
          <h3 className="font-bold mb-4" style={{ color: "var(--color-green)" }}>
            📚 Recent Readings
          </h3>
          {readings.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {readings
                .slice()
                .reverse()
                .slice(0, 10)
                .map((reading) => (
                  <div
                    key={reading.id}
                    className="p-3 rounded border"
                    style={{
                      background: "rgba(0, 255, 136, 0.1)",
                      borderColor: "var(--color-green)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold" style={{ color: "var(--color-green)" }}>
                          {reading.spreadType === "single" && "🃏 Single Card"}
                          {reading.spreadType === "threecard" && "📖 Three Card"}
                          {reading.spreadType === "pyramid" && "🔺 Pyramid"}
                          {reading.spreadType === "celticcross" && "✝️ Celtic Cross"}
                        </p>
                        <p style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                          {new Date(reading.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span style={{ color: "var(--color-cyan)" }} className="text-xs font-bold">
                        {reading.cardCount} cards
                      </span>
                    </div>
                    {reading.question && (
                      <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mb-2">
                        Q: {reading.question}
                      </p>
                    )}
                    <p style={{ color: "var(--color-text-secondary)" }} className="text-xs line-clamp-2">
                      {reading.cards.map((c) => c.name).join(", ")}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-secondary)" }}>No readings yet. Start your first reading in the Tarot Pull tool!</p>
          )}
        </div>
      </div>
    </div>
  );
}
