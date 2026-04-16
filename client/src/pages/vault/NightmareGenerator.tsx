import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Loader2, Zap, Bookmark, Copy, RefreshCw } from "lucide-react";

type Theme = "identity" | "loss" | "cosmic" | "time" | "void" | "random";
type Intensity = "low" | "medium" | "high";

interface Nightmare {
  id: string;
  title: string;
  scenario: string;
  theme: string;
  intensity: "low" | "medium" | "high";
  generatedAt: Date;
}

export default function NightmareGenerator() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedTheme, setSelectedTheme] = useState<Theme>("random");
  const [selectedIntensity, setSelectedIntensity] = useState<Intensity>("medium");
  const [nightmare, setNightmare] = useState<Nightmare | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<Nightmare[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
    // Load bookmarks from localStorage
    const saved = localStorage.getItem("nightmare-bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, [isAuthenticated, navigate]);

  const generateMutation = trpc.tools.generateNightmare.useMutation();

  const handleGenerate = async () => {
    const result = await generateMutation.mutateAsync({
      theme: selectedTheme,
      intensity: selectedIntensity,
    });

    if (result.success && result.nightmare) {
      setNightmare(result.nightmare);
      setBookmarked(bookmarks.some((b) => b.id === result.nightmare.id));
    }
  };

  const handleBookmark = () => {
    if (!nightmare) return;

    if (bookmarked) {
      setBookmarks(bookmarks.filter((b) => b.id !== nightmare.id));
      setBookmarked(false);
    } else {
      setBookmarks([...bookmarks, nightmare]);
      setBookmarked(true);
    }
  };

  useEffect(() => {
    localStorage.setItem("nightmare-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleCopy = () => {
    if (!nightmare) return;
    const text = `${nightmare.title}\n\n${nightmare.scenario}`;
    navigator.clipboard.writeText(text);
  };

  const themes: { value: Theme; label: string; description: string }[] = [
    { value: "identity", label: "Identity Dissolution", description: "Loss of self and consciousness" },
    { value: "loss", label: "Loss & Void", description: "Absence and emptiness" },
    { value: "cosmic", label: "Cosmic Horror", description: "Incomprehensible cosmic forces" },
    { value: "time", label: "Time Distortion", description: "Temporal paradoxes and loops" },
    { value: "void", label: "The Void", description: "Nothingness and oblivion" },
    { value: "random", label: "Random", description: "Surprise me" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={32} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-5xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              Nightmare Generator
            </h1>
          </div>

          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            Summon dark visions from the depths of the psyche. Each nightmare is unique, crafted to disturb and enlighten.
          </p>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Theme Selection */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                Theme
              </h3>
              <div className="space-y-3">
                {themes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setSelectedTheme(theme.value)}
                    className="w-full p-4 rounded-lg text-left transition-all border-2"
                    style={{
                      background:
                        selectedTheme === theme.value
                          ? "rgba(0, 217, 255, 0.2)"
                          : "rgba(0, 217, 255, 0.05)",
                      borderColor:
                        selectedTheme === theme.value ? "var(--color-cyan)" : "rgba(0, 217, 255, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "var(--color-hot-pink)" }}>
                      {theme.label}
                    </div>
                    <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {theme.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity Selection */}
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                Intensity
              </h3>
              <div className="space-y-3">
                {(["low", "medium", "high"] as const).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => setSelectedIntensity(intensity)}
                    className="w-full p-4 rounded-lg text-left transition-all border-2 capitalize"
                    style={{
                      background:
                        selectedIntensity === intensity
                          ? "rgba(255, 20, 147, 0.2)"
                          : "rgba(255, 20, 147, 0.05)",
                      borderColor:
                        selectedIntensity === intensity
                          ? "var(--color-hot-pink)"
                          : "rgba(255, 20, 147, 0.1)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "var(--color-hot-pink)" }}>
                      {intensity}
                    </div>
                    <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {intensity === "low" && "Subtle unease"}
                      {intensity === "medium" && "Deeply disturbing"}
                      {intensity === "high" && "Psychologically shattering"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="w-full py-4 rounded-lg font-bold text-lg transition-all mb-12 flex items-center justify-center gap-2"
            style={{
              background: generateMutation.isPending ? "rgba(0, 217, 255, 0.3)" : "var(--color-hot-pink)",
              color: "var(--color-midnight)",
              opacity: generateMutation.isPending ? 0.7 : 1,
            }}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Summoning nightmare...
              </>
            ) : (
              <>
                <Zap size={20} />
                Generate Nightmare
              </>
            )}
          </button>

          {/* Nightmare Display */}
          {nightmare && (
            <div
              className="p-12 rounded-lg border-2 mb-12"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "var(--color-cyan)",
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                    {nightmare.title}
                  </h2>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded"
                      style={{
                        background: "var(--color-cyan)",
                        color: "var(--color-midnight)",
                      }}
                    >
                      {nightmare.theme}
                    </span>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded capitalize"
                      style={{
                        background: "var(--color-hot-pink)",
                        color: "var(--color-midnight)",
                      }}
                    >
                      {nightmare.intensity} intensity
                    </span>
                  </div>
                </div>
              </div>

              <p
                className="text-lg leading-relaxed mb-8"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {nightmare.scenario}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBookmark}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: bookmarked ? "var(--color-hot-pink)" : "rgba(255, 20, 147, 0.2)",
                    color: bookmarked ? "var(--color-midnight)" : "var(--color-hot-pink)",
                    border: `2px solid ${bookmarked ? "var(--color-hot-pink)" : "rgba(255, 20, 147, 0.3)"}`,
                  }}
                >
                  <Bookmark size={18} />
                  {bookmarked ? "Bookmarked" : "Bookmark"}
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
                  style={{
                    background: "rgba(0, 217, 255, 0.2)",
                    color: "var(--color-cyan)",
                    border: "2px solid rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <Copy size={18} />
                  Copy
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ml-auto"
                  style={{
                    background: "rgba(0, 217, 255, 0.2)",
                    color: "var(--color-cyan)",
                    border: "2px solid rgba(0, 217, 255, 0.3)",
                  }}
                >
                  <RefreshCw size={18} />
                  Generate Another
                </button>
              </div>
            </div>
          )}

          {/* Bookmarks Section */}
          {bookmarks.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6" style={{ color: "var(--color-hot-pink)" }}>
                Bookmarked Nightmares ({bookmarks.length})
              </h3>

              <div className="space-y-4">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-6 rounded-lg border-l-4"
                    style={{
                      background: "rgba(0, 217, 255, 0.05)",
                      borderLeftColor: "var(--color-cyan)",
                    }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                      {bm.title}
                    </h4>
                    <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
                      {bm.scenario.substring(0, 150)}...
                    </p>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(0, 217, 255, 0.2)", color: "var(--color-cyan)" }}>
                        {bm.theme}
                      </span>
                      <span className="text-xs px-2 py-1 rounded capitalize" style={{ background: "rgba(255, 20, 147, 0.2)", color: "var(--color-hot-pink)" }}>
                        {bm.intensity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
