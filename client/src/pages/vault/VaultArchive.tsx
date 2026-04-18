import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { ChevronDown, Download, Trash2, Search, Sparkles, Share2, CheckCircle } from "lucide-react";
import { getComparisonAnalysesSorted, deleteComparisonAnalysis } from "@/lib/comparisonAnalysisStorage";
import type { ComparisonAnalysis } from "@/lib/comparisonAnalysisStorage";
import { createComparisonForumPost, saveForumPost, isComparisonAlreadyShared } from "@/lib/forumSharingHelper";

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
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ArchiveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "nightmare" | "reading" | "prompt" | "comparison">("all");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedComparisonForShare, setSelectedComparisonForShare] = useState<ComparisonAnalysis | null>(null);
  const [shareTitle, setShareTitle] = useState("");
  const [shareContent, setShareContent] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [alreadySharedComparisons, setAlreadySharedComparisons] = useState<Set<string>>(new Set());

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

  const handleShareToForum = (comparison: ComparisonAnalysis) => {
    setSelectedComparisonForShare(comparison);
    setShareTitle(`Tarot Comparison: ${comparison.reading1SpreadType} ↔ ${comparison.reading2SpreadType}`);
    setShareContent("");
    setShowShareModal(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedComparisonForShare || !user) return;
    
    setIsSharing(true);
    try {
      const forumPost = createComparisonForumPost(
        selectedComparisonForShare,
        user.name || "Anonymous",
        (user.id || "unknown").toString(),
        shareTitle || undefined,
        shareContent || undefined
      );
      
      const success = saveForumPost(forumPost);
      if (success) {
        setAlreadySharedComparisons(prev => new Set(Array.from(prev).concat([selectedComparisonForShare.id])));
        setShareSuccess(true);
        setTimeout(() => {
          setShowShareModal(false);
          setShareSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to share to forum:', error);
    } finally {
      setIsSharing(false);
    }
  };

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
                      {item.type === "comparison" && (
                        <button
                          onClick={() => handleShareToForum(item.metadata as ComparisonAnalysis)}
                          disabled={alreadySharedComparisons.has(item.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{
                            background: alreadySharedComparisons.has(item.id) 
                              ? "rgba(167, 139, 250, 0.1)" 
                              : "rgba(0, 217, 255, 0.1)",
                            color: alreadySharedComparisons.has(item.id) 
                              ? "#a78bfa" 
                              : "var(--color-cyan)",
                            opacity: alreadySharedComparisons.has(item.id) ? 0.6 : 1,
                          }}
                        >
                          {alreadySharedComparisons.has(item.id) ? (
                            <>
                              <CheckCircle size={16} />
                              Shared
                            </>
                          ) : (
                            <>
                              <Share2 size={16} />
                              Share to Forum
                            </>
                          )}
                        </button>
                      )}
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

        {/* Share to Forum Modal */}
        {showShareModal && selectedComparisonForShare && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => !isSharing && setShowShareModal(false)}
          >
            <div
              className="bg-midnight rounded-lg border p-6 max-w-2xl w-full max-h-96 overflow-y-auto"
              style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
                Share to Community Forum
              </h2>

              {shareSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} style={{ color: "#a78bfa", margin: "0 auto mb-4" }} />
                  <p style={{ color: "#a78bfa" }} className="text-lg font-semibold">
                    Successfully shared to the forum!
                  </p>
                  <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mt-2">
                    Your comparison analysis is now visible to the community.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label style={{ color: "var(--color-cyan)" }} className="block text-sm font-semibold mb-2">
                        Post Title
                      </label>
                      <input
                        type="text"
                        value={shareTitle}
                        onChange={(e) => setShareTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg"
                        style={{
                          background: "rgba(0, 217, 255, 0.05)",
                          border: "1px solid rgba(0, 217, 255, 0.2)",
                          color: "var(--color-text-primary)",
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ color: "var(--color-cyan)" }} className="block text-sm font-semibold mb-2">
                        Additional Comments (Optional)
                      </label>
                      <textarea
                        value={shareContent}
                        onChange={(e) => setShareContent(e.target.value)}
                        placeholder="Add your thoughts or questions about this comparison..."
                        className="w-full px-3 py-2 rounded-lg h-24 resize-none"
                        style={{
                          background: "rgba(0, 217, 255, 0.05)",
                          border: "1px solid rgba(0, 217, 255, 0.2)",
                          color: "var(--color-text-primary)",
                        }}
                      />
                    </div>

                    <div
                      className="p-4 rounded-lg"
                      style={{
                        background: "rgba(167, 139, 250, 0.05)",
                        border: "1px solid rgba(167, 139, 250, 0.2)",
                      }}
                    >
                      <p style={{ color: "#a78bfa" }} className="text-sm font-semibold mb-2">
                        Preview:
                      </p>
                      <p style={{ color: "var(--color-text-secondary)" }} className="text-xs whitespace-pre-wrap">
                        {`Tarot Comparison: ${selectedComparisonForShare.reading1SpreadType} ↔ ${selectedComparisonForShare.reading2SpreadType}\n\nMatching Cards: ${selectedComparisonForShare.matchingCards}\n${shareContent ? `\nThoughts: ${shareContent}` : ''}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowShareModal(false)}
                      disabled={isSharing}
                      className="px-4 py-2 rounded-lg font-semibold transition-all"
                      style={{
                        background: "rgba(255, 20, 147, 0.1)",
                        color: "var(--color-hot-pink)",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmShare}
                      disabled={isSharing || !shareTitle.trim()}
                      className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                      style={{
                        background: isSharing || !shareTitle.trim() ? "rgba(0, 217, 255, 0.2)" : "rgba(0, 217, 255, 0.1)",
                        color: isSharing || !shareTitle.trim() ? "rgba(0, 217, 255, 0.5)" : "var(--color-cyan)",
                      }}
                    >
                      {isSharing ? (
                        <>
                          <Sparkles size={16} className="animate-spin" />
                          Sharing...
                        </>
                      ) : (
                        <>
                          <Share2 size={16} />
                          Share to Forum
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
