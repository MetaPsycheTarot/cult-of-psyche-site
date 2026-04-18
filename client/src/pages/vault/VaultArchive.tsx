import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { ChevronDown, Download, Trash2, Search, Sparkles } from "lucide-react";
import { getComparisonAnalysesSorted, deleteComparisonAnalysis } from "@/lib/comparisonAnalysisStorage";
import type { ComparisonAnalysis } from "@/lib/comparisonAnalysisStorage";

interface ArchiveItem {
  id: string;
  type: "nightmare" | "reading" | "prompt" | "comparison";
  title: string;
  content: string;
  createdAt: number;
  metadata?: Record<string, any>;
  storageKey?: string; // Track which localStorage key this came from
}

export default function VaultArchive() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ArchiveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "nightmare" | "reading" | "prompt" | "comparison">("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load archive items from localStorage
    const nightmares = JSON.parse(localStorage.getItem("nightmareBookmarks") || "[]");
    const readings = JSON.parse(localStorage.getItem("tarot_readings") || "[]");
    const prompts = JSON.parse(localStorage.getItem("promptBookmarks") || "[]");
    const comparisons = getComparisonAnalysesSorted();

    const items: ArchiveItem[] = [
      ...nightmares.map((n: any) => ({
        id: `nightmare-${n.id || Date.now()}`,
        type: "nightmare" as const,
        title: n.title || "Untitled Nightmare",
        content: n.content || "",
        createdAt: n.createdAt || Date.now(),
        metadata: n,
        storageKey: "nightmareBookmarks",
      })),
      ...readings.map((r: any) => ({
        id: `reading-${r.id || Date.now()}`,
        type: "reading" as const,
        title: r.title || `${r.cardCount}-Card Reading`,
        content: r.interpretation || "",
        createdAt: new Date(r.timestamp || Date.now()).getTime(),
        metadata: r,
        storageKey: "tarot_readings",
      })),
      ...prompts.map((p: any) => ({
        id: `prompt-${p.id || Date.now()}`,
        type: "prompt" as const,
        title: p.title || `${p.category} Prompt`,
        content: p.content || "",
        createdAt: p.createdAt || Date.now(),
        metadata: p,
        storageKey: "promptBookmarks",
      })),
      ...comparisons.map((c: ComparisonAnalysis) => ({
        id: c.id,
        type: "comparison" as const,
        title: `${c.reading1SpreadType} ↔ ${c.reading2SpreadType}`,
        content: c.analysis,
        createdAt: c.createdAt,
        metadata: c,
        storageKey: "comparisonAnalyses",
      })),
    ];

    setArchiveItems(items.sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  useEffect(() => {
    let filtered = archiveItems;

    // Apply type filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((item) => item.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [archiveItems, searchQuery, selectedFilter]);

  const handleDelete = (id: string, storageKey?: string) => {
    const itemToDelete = archiveItems.find((item) => item.id === id);
    
    if (itemToDelete && storageKey) {
      // Handle comparison analysis deletion separately
      if (itemToDelete.type === "comparison") {
        deleteComparisonAnalysis(id);
      } else {
        // Update localStorage for other types
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const updated = stored.filter((item: any) => {
          if (itemToDelete.type === "reading") {
            return item.id !== itemToDelete.metadata?.id;
          }
          return item.id !== itemToDelete.metadata?.id;
        });
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
    }

    setArchiveItems(archiveItems.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      items: archiveItems,
      stats: {
        totalItems: archiveItems.length,
        nightmares: archiveItems.filter((i) => i.type === "nightmare").length,
        readings: archiveItems.filter((i) => i.type === "reading").length,
        prompts: archiveItems.filter((i) => i.type === "prompt").length,
        comparisons: archiveItems.filter((i) => i.type === "comparison").length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `psyche-archive-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return null;
  }

  const stats = {
    total: archiveItems.length,
    nightmares: archiveItems.filter((i) => i.type === "nightmare").length,
    readings: archiveItems.filter((i) => i.type === "reading").length,
    prompts: archiveItems.filter((i) => i.type === "prompt").length,
    comparisons: archiveItems.filter((i) => i.type === "comparison").length,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "nightmare":
        return "🌙";
      case "reading":
        return "🔮";
      case "prompt":
        return "✍️";
      case "comparison":
        return "✨";
      default:
        return "📝";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "nightmare":
        return "var(--color-magenta)";
      case "reading":
        return "var(--color-cyan)";
      case "prompt":
        return "var(--color-hot-pink)";
      case "comparison":
        return "#a78bfa"; // Purple for comparison analyses
      default:
        return "var(--color-text-secondary)";
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            📚 YOUR ARCHIVE
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            A complete record of your journey through the Cult of Psyche
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div style={{ color: "var(--color-cyan)" }} className="text-sm font-semibold">
              Total Items
            </div>
            <div className="text-3xl font-bold mt-2" style={{ color: "var(--color-hot-pink)" }}>
              {stats.total}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "rgba(255, 20, 147, 0.2)",
            }}
          >
            <div style={{ color: "var(--color-hot-pink)" }} className="text-sm font-semibold">
              Nightmares
            </div>
            <div className="text-3xl font-bold mt-2" style={{ color: "var(--color-magenta)" }}>
              {stats.nightmares}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <div style={{ color: "var(--color-cyan)" }} className="text-sm font-semibold">
              Readings
            </div>
            <div className="text-3xl font-bold mt-2" style={{ color: "var(--color-cyan)" }}>
              {stats.readings}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(255, 20, 147, 0.05)",
              borderColor: "rgba(255, 20, 147, 0.2)",
            }}
          >
            <div style={{ color: "var(--color-hot-pink)" }} className="text-sm font-semibold">
              Prompts
            </div>
            <div className="text-3xl font-bold mt-2" style={{ color: "var(--color-hot-pink)" }}>
              {stats.prompts}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(167, 139, 250, 0.05)",
              borderColor: "rgba(167, 139, 250, 0.2)",
            }}
          >
            <div style={{ color: "#a78bfa" }} className="text-sm font-semibold">
              Comparisons
            </div>
            <div className="text-3xl font-bold mt-2" style={{ color: "#a78bfa" }}>
              {stats.comparisons}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={20}
              style={{ color: "var(--color-cyan)" }}
              className="absolute left-3 top-3"
            />
            <input
              type="text"
              placeholder="Search your archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                border: "1px solid rgba(0, 217, 255, 0.2)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          {/* Filter & Export */}
          <div className="flex gap-4 justify-between">
            <div className="flex gap-2">
              {(["all", "nightmare", "reading", "prompt", "comparison"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className="px-4 py-2 rounded-lg font-semibold transition-all"
                  style={{
                    background:
                      selectedFilter === filter
                        ? "var(--color-hot-pink)"
                        : "rgba(0, 217, 255, 0.1)",
                    color:
                      selectedFilter === filter
                        ? "var(--color-midnight)"
                        : "var(--color-text-secondary)",
                  }}
                >
                  {filter === "all" ? "All" : filter === "comparison" ? "Comparisons" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: "rgba(0, 217, 255, 0.1)",
                color: "var(--color-cyan)",
              }}
            >
              <Download size={18} />
              Export Archive
            </button>
          </div>
        </div>

        {/* Archive Items */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border overflow-hidden transition-all"
                style={{
                  background: "rgba(0, 217, 255, 0.03)",
                  borderColor: "rgba(0, 217, 255, 0.2)",
                }}
              >
                {/* Item Header */}
                <button
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-all"
                  style={{
                    background:
                      expandedItem === item.id ? "rgba(0, 217, 255, 0.1)" : "transparent",
                  }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl">{getTypeIcon(item.type)}</span>
                    <div className="text-left">
                      <h3 className="font-bold" style={{ color: getTypeColor(item.type) }}>
                        {item.title}
                      </h3>
                      <p style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                        {new Date(item.createdAt).toLocaleDateString()} at{" "}
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={20}
                    style={{
                      color: "var(--color-cyan)",
                      transform: expandedItem === item.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </button>

                {/* Item Content */}
                {expandedItem === item.id && (
                  <div
                    className="border-t p-4"
                    style={{ borderTopColor: "rgba(0, 217, 255, 0.2)" }}
                  >
                    <p
                      style={{ color: "var(--color-text-secondary)" }}
                      className="mb-4 whitespace-pre-wrap"
                    >
                      {item.content}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id, item.storageKey)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: "rgba(255, 20, 147, 0.1)",
                          color: "var(--color-hot-pink)",
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className="p-12 rounded-lg border-2 text-center"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "rgba(0, 217, 255, 0.2)",
                borderStyle: "dashed",
              }}
            >
              <p style={{ color: "var(--color-text-secondary)" }} className="text-lg">
                {archiveItems.length === 0
                  ? "Your archive is empty. Start using the tools to build your collection."
                  : "No items match your search."}
              </p>
            </div>
          )}
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
            <span style={{ color: "var(--color-hot-pink)" }}>💡 Tip:</span> Your archive is a
            personal grimoire. Review it regularly to identify patterns in your nightmares,
            recurring themes in your readings, and evolution in your prompts. Export your archive
            to keep a backup or share insights with trusted members.
          </p>
        </div>
      </div>
    </div>
  );
}
