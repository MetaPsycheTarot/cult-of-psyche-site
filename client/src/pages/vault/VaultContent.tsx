import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Lock, Play } from "lucide-react";

type ContentFilter = "all" | "exclusive" | "episodes" | "removed";

interface ContentItem {
  id: string;
  title: string;
  type: "exclusive" | "episode" | "removed";
  thumbnail: string;
  duration: string;
  description: string;
  locked: boolean;
}

const sampleContent: ContentItem[] = [
  {
    id: "1",
    title: "The Ritual of Awakening - Full Cut",
    type: "exclusive",
    thumbnail: "🔮",
    duration: "2h 15m",
    description: "Uncut, uncensored. The complete ritual from the vault.",
    locked: false,
  },
  {
    id: "2",
    title: "Chaos Segment: The Void Speaks",
    type: "removed",
    thumbnail: "🌑",
    duration: "47m",
    description: "Removed from YouTube. Too intense for public.",
    locked: false,
  },
  {
    id: "3",
    title: "Exclusive Interview: The Architect",
    type: "exclusive",
    thumbnail: "🎤",
    duration: "1h 33m",
    description: "Members-only conversation about the system's origins.",
    locked: false,
  },
  {
    id: "4",
    title: "Tarot Deep Dive: The Psyche Awakens",
    type: "episode",
    thumbnail: "🃏",
    duration: "1h 8m",
    description: "Full episode exploring each card's hidden meanings.",
    locked: false,
  },
  {
    id: "5",
    title: "Behind the Veil: Production Notes",
    type: "exclusive",
    thumbnail: "📹",
    duration: "32m",
    description: "How the streams are created. The mechanics revealed.",
    locked: false,
  },
];

export default function VaultContent() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<ContentFilter>("all");
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>(sampleContent);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredContent(sampleContent);
    } else {
      const typeMap: Record<ContentFilter, ContentItem["type"] | null> = {
        all: null,
        exclusive: "exclusive",
        episodes: "episode",
        removed: "removed",
      };
      const typeFilter = typeMap[filter];
      setFilteredContent(sampleContent.filter((item) => item.type === typeFilter));
    }
  }, [filter]);

  const hasMembership = user?.role === "admin";

  const filterButtons: { label: string; value: ContentFilter }[] = [
    { label: "All", value: "all" },
    { label: "Exclusive", value: "exclusive" },
    { label: "Full Episodes", value: "episodes" },
    { label: "Removed Scenes", value: "removed" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            🎥 Exclusive Content
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            Full episodes, extended cuts, and removed segments. Members only.
          </p>

          {/* Filter Bar */}
          <div className="flex gap-4 mb-12 overflow-x-auto pb-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className="px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
                style={{
                  background: filter === btn.value ? "var(--color-hot-pink)" : "rgba(0, 217, 255, 0.1)",
                  color: filter === btn.value ? "var(--color-midnight)" : "var(--color-cyan)",
                  border: `2px solid ${filter === btn.value ? "var(--color-hot-pink)" : "rgba(0, 217, 255, 0.2)"}`,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Member Warning */}
          {!hasMembership && (
            <div
              className="p-6 rounded-lg mb-12 border-l-4 flex items-start gap-4"
              style={{
                background: "rgba(255, 20, 147, 0.1)",
                borderLeftColor: "var(--color-hot-pink)",
              }}
            >
              <Lock size={24} style={{ color: "var(--color-hot-pink)", marginTop: "4px" }} />
              <div>
                <h3 className="font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                  This content is members-only
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Join the vault to unlock exclusive episodes, extended cuts, and removed scenes.
                </p>
                <a
                  href="/join"
                  className="inline-block mt-4 px-6 py-2 rounded-lg font-semibold"
                  style={{
                    background: "var(--color-hot-pink)",
                    color: "var(--color-midnight)",
                  }}
                >
                  View Membership
                </a>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="group rounded-lg overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: item.locked ? "rgba(255, 20, 147, 0.3)" : "var(--color-cyan)",
                }}
              >
                {/* Thumbnail */}
                <div
                  className="aspect-video flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 20, 147, 0.1))",
                  }}
                >
                  {item.thumbnail}
                  {!item.locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all">
                      <Play size={48} style={{ color: "var(--color-hot-pink)" }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  {item.locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Lock size={32} style={{ color: "var(--color-hot-pink)" }} />
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold px-2 py-1 rounded capitalize"
                      style={{
                        background:
                          item.type === "exclusive"
                            ? "rgba(255, 20, 147, 0.2)"
                            : item.type === "episode"
                              ? "rgba(0, 217, 255, 0.2)"
                              : "rgba(255, 215, 0, 0.2)",
                        color:
                          item.type === "exclusive"
                            ? "var(--color-hot-pink)"
                            : item.type === "episode"
                              ? "var(--color-cyan)"
                              : "#FFD700",
                      }}
                    >
                      {item.type === "removed" ? "Removed" : item.type}
                    </span>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                      {item.duration}
                    </span>
                  </div>

                  <h3 className="font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                    {item.title}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                    {item.description}
                  </p>

                  {hasMembership && !item.locked && (
                    <button
                      className="w-full py-2 rounded-lg font-semibold transition-all"
                      style={{
                        background: "var(--color-cyan)",
                        color: "var(--color-midnight)",
                      }}
                    >
                      Watch Now
                    </button>
                  )}

                  {item.locked && (
                    <button
                      className="w-full py-2 rounded-lg font-semibold transition-all"
                      style={{
                        background: "rgba(255, 20, 147, 0.2)",
                        color: "var(--color-hot-pink)",
                        border: "2px solid rgba(255, 20, 147, 0.3)",
                      }}
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
