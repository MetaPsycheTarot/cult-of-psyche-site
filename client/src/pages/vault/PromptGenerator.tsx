import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Copy, Loader2, BookmarkPlus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Category = "tiktok" | "stream" | "horror";

interface GeneratedPrompt {
  id: string;
  category: Category;
  theme: string;
  content: string;
  generatedAt: Date;
}

export default function PromptGenerator() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [category, setCategory] = useState<Category>("tiktok");
  const [theme, setTheme] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [bookmarks, setBookmarks] = useState<GeneratedPrompt[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const generateMutation = trpc.prompts.generatePrompt.useMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    // Load bookmarks from localStorage
    const saved = localStorage.getItem("prompt-bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load bookmarks:", e);
      }
    }
  }, [isAuthenticated, navigate]);

  const handleGenerate = async () => {
    try {
      const result = await generateMutation.mutateAsync({
        category,
        theme: theme || undefined,
      });

      if (result.success && result.prompt) {
        setGeneratedPrompt({
          ...result.prompt,
          content: typeof result.prompt.content === 'string' ? result.prompt.content : String(result.prompt.content),
        });
        setShowBookmarks(false);
        toast.success("Prompt generated!");
      } else {
        toast.error(result.error || "Failed to generate prompt");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate prompt. Please try again.");
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt.content);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleBookmark = () => {
    if (!generatedPrompt) return;

    const updated = [generatedPrompt, ...bookmarks];
    setBookmarks(updated);
    localStorage.setItem("prompt-bookmarks", JSON.stringify(updated));
    toast.success("Prompt bookmarked!");
  };

  const handleDeleteBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("prompt-bookmarks", JSON.stringify(updated));
    toast.success("Bookmark removed");
  };

  const categoryInfo = {
    tiktok: {
      name: "TikTok",
      description: "Short, viral video concepts designed to grab attention in seconds",
      emoji: "📱",
    },
    stream: {
      name: "Stream Ideas",
      description: "Engaging stream segments and interactive content ideas",
      emoji: "🎬",
    },
    horror: {
      name: "Horror Stories",
      description: "Dark, unsettling story premises with psychological depth",
      emoji: "🖤",
    },
  };

  const currentInfo = categoryInfo[category];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            ✍️ Prompt Generator
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            Generate ready-to-use prompts for creators. Choose a category and optional theme to get started.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Generator Panel */}
            <div className="lg:col-span-2">
              <div
                className="rounded-lg p-8 border-2"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                {/* Category Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                    Select Category
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(Object.keys(categoryInfo) as Category[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className="p-4 rounded-lg border-2 transition-all text-center"
                        style={{
                          background: category === cat ? "var(--color-hot-pink)" : "rgba(0, 217, 255, 0.1)",
                          borderColor: category === cat ? "var(--color-hot-pink)" : "rgba(0, 217, 255, 0.2)",
                          color: category === cat ? "var(--color-midnight)" : "var(--color-text-secondary)",
                        }}
                      >
                        <div className="text-2xl mb-2">{categoryInfo[cat].emoji}</div>
                        <div className="font-bold text-sm">{categoryInfo[cat].name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Input */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                    Optional Theme
                  </h3>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g., 'time distortion', 'void awakening', 'chaos ritual'"
                    className="w-full p-4 rounded-lg border-2 bg-opacity-50"
                    style={{
                      background: "rgba(0, 217, 255, 0.05)",
                      borderColor: "rgba(0, 217, 255, 0.2)",
                      color: "var(--color-text-secondary)",
                    }}
                  />
                  <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
                    Leave blank for a random prompt, or specify a theme to guide generation.
                  </p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "var(--color-hot-pink)",
                    color: "var(--color-midnight)",
                    opacity: generateMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Prompt"
                  )}
                </button>

                {/* Generated Prompt Display */}
                {generatedPrompt && (
                  <div
                    className="mt-8 p-6 rounded-lg border-2"
                    style={{
                      background: "rgba(255, 20, 147, 0.05)",
                      borderColor: "var(--color-hot-pink)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold" style={{ color: "var(--color-hot-pink)" }}>
                        Generated Prompt
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopyToClipboard}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            background: "rgba(0, 217, 255, 0.2)",
                            color: "var(--color-cyan)",
                          }}
                          title="Copy to clipboard"
                        >
                          <Copy size={20} />
                        </button>
                        <button
                          onClick={handleBookmark}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            background: "rgba(255, 20, 147, 0.2)",
                            color: "var(--color-hot-pink)",
                          }}
                          title="Bookmark this prompt"
                        >
                          <BookmarkPlus size={20} />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: "var(--color-text-secondary)", lineHeight: "1.8" }}>
                      {generatedPrompt.content}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bookmarks Sidebar */}
            <div>
              <div
                className="rounded-lg p-6 border-2 sticky top-12"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "rgba(0, 217, 255, 0.2)",
                }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                  📚 Bookmarks ({bookmarks.length})
                </h3>

                {bookmarks.length === 0 ? (
                  <p style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                    No bookmarks yet. Generate and bookmark prompts to save them here.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="p-3 rounded-lg border group"
                        style={{
                          background: "rgba(0, 217, 255, 0.1)",
                          borderColor: "rgba(0, 217, 255, 0.2)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span
                            className="text-xs font-bold px-2 py-1 rounded"
                            style={{
                              background: "rgba(255, 20, 147, 0.2)",
                              color: "var(--color-hot-pink)",
                            }}
                          >
                            {categoryInfo[bookmark.category].emoji} {categoryInfo[bookmark.category].name}
                          </span>
                          <button
                            onClick={() => handleDeleteBookmark(bookmark.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            style={{ color: "var(--color-hot-pink)" }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p
                          className="text-xs line-clamp-3 cursor-pointer hover:line-clamp-none"
                          style={{ color: "var(--color-text-secondary)" }}
                          onClick={() => {
                            navigator.clipboard.writeText(bookmark.content);
                            toast.success("Copied!");
                          }}
                          title="Click to copy"
                        >
                          {bookmark.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
