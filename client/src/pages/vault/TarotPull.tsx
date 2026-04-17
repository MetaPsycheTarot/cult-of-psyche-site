import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Wand2, Bookmark, BookmarkCheck, Trash2, RotateCcw } from "lucide-react";
import { Streamdown } from "streamdown";

interface SavedReading {
  id: string;
  cards: Array<{ id: number; name: string; meaning: string; arcana: string }>;
  interpretation: string;
  cardCount: number;
  timestamp: string;
  question?: string;
}

export default function TarotPull() {
  const [cardCount, setCardCount] = useState<"1" | "3">("1");
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<{
    cards: Array<{ id: number; name: string; meaning: string; arcana: string }>;
    interpretation: string;
    cardCount: number;
    timestamp: Date;
  } | null>(null);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const pullMutation = trpc.tarot.pull.useMutation();

  // Load saved readings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tarot_readings");
    if (saved) {
      setSavedReadings(JSON.parse(saved));
    }
  }, []);

  const handlePull = async () => {
    const result = await pullMutation.mutateAsync({
      cardCount,
      question: question || undefined,
    });
    setReading(result);
    setIsBookmarked(false);
  };

  const handleBookmark = () => {
    if (!reading) return;

    const newReading: SavedReading = {
      id: Date.now().toString(),
      cards: reading.cards,
      interpretation: reading.interpretation,
      cardCount: reading.cardCount,
      timestamp: new Date().toISOString(),
      question: question || undefined,
    };

    const updated = [newReading, ...savedReadings];
    setSavedReadings(updated);
    localStorage.setItem("tarot_readings", JSON.stringify(updated));
    setIsBookmarked(true);
  };

  const handleDeleteReading = (id: string) => {
    const updated = savedReadings.filter((r) => r.id !== id);
    setSavedReadings(updated);
    localStorage.setItem("tarot_readings", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm("Clear all saved readings?")) {
      setSavedReadings([]);
      localStorage.removeItem("tarot_readings");
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{ background: "var(--color-midnight)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--color-hot-pink)" }}
          >
            Tarot Pull
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Consult the Psyche Awakens deck for guidance
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Pull Interface */}
          <div className="lg:col-span-2">
            {/* Card Count Selection */}
            <div
              className="rounded-lg p-6 border-2 mb-6"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "var(--color-cyan)",
              }}
            >
              <h3
                className="font-bold mb-4"
                style={{ color: "var(--color-cyan)" }}
              >
                Draw Type
              </h3>
              <div className="flex gap-4">
                {(["1", "3"] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => setCardCount(count)}
                    className="flex-1 py-3 px-4 rounded-lg font-bold transition-all"
                    style={{
                      background:
                        cardCount === count
                          ? "var(--color-hot-pink)"
                          : "rgba(255, 20, 147, 0.1)",
                      color:
                        cardCount === count
                          ? "var(--color-midnight)"
                          : "var(--color-hot-pink)",
                      border:
                        cardCount === count
                          ? "2px solid var(--color-hot-pink)"
                          : "2px solid rgba(255, 20, 147, 0.3)",
                    }}
                  >
                    {count === "1" ? "Single Card" : "Three Card"}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input */}
            <div
              className="rounded-lg p-6 border-2 mb-6"
              style={{
                background: "rgba(255, 20, 147, 0.05)",
                borderColor: "var(--color-hot-pink)",
              }}
            >
              <h3
                className="font-bold mb-4"
                style={{ color: "var(--color-hot-pink)" }}
              >
                Your Question (Optional)
              </h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek guidance on?"
                className="w-full p-3 rounded-lg bg-opacity-10 text-white placeholder-gray-500 focus:outline-none"
                style={{
                  background: "rgba(0, 217, 255, 0.1)",
                  borderBottom: "2px solid var(--color-cyan)",
                  color: "var(--color-text-primary)",
                }}
                rows={3}
              />
            </div>

            {/* Pull Button */}
            <button
              onClick={handlePull}
              disabled={pullMutation.isPending}
              className="w-full py-4 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 mb-8"
              style={{
                background: "var(--color-hot-pink)",
                color: "var(--color-midnight)",
                opacity: pullMutation.isPending ? 0.7 : 1,
              }}
            >
              <Wand2 size={20} />
              {pullMutation.isPending ? "Drawing..." : "Pull Cards"}
            </button>

            {/* Reading Display */}
            {reading && (
              <div
                className="rounded-lg p-8 border-2"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--color-hot-pink)" }}
                  >
                    {reading.cardCount === 1 ? "Your Card" : "Your Reading"}
                  </h2>
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: isBookmarked
                        ? "rgba(255, 20, 147, 0.2)"
                        : "rgba(0, 217, 255, 0.1)",
                      color: isBookmarked
                        ? "var(--color-hot-pink)"
                        : "var(--color-cyan)",
                    }}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={20} />
                    ) : (
                      <Bookmark size={20} />
                    )}
                  </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {reading.cards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-lg text-center"
                      style={{
                        background: "rgba(255, 20, 147, 0.1)",
                        borderLeft: "4px solid var(--color-hot-pink)",
                      }}
                    >
                      {reading.cardCount === 3 && (
                        <p
                          className="text-xs font-bold mb-2 uppercase"
                          style={{ color: "var(--color-cyan)" }}
                        >
                          {idx === 0 ? "Past" : idx === 1 ? "Present" : "Future"}
                        </p>
                      )}
                      <h4
                        className="font-bold mb-2"
                        style={{ color: "var(--color-hot-pink)" }}
                      >
                        {card.name}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {card.meaning}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interpretation */}
                <div
                  className="p-6 rounded-lg mb-6"
                  style={{
                    background: "rgba(0, 217, 255, 0.05)",
                    borderLeft: "4px solid var(--color-cyan)",
                  }}
                >
                  <h3
                    className="font-bold mb-3"
                    style={{ color: "var(--color-cyan)" }}
                  >
                    Interpretation
                  </h3>
                  <div style={{ color: "var(--color-text-secondary)" }}>
                    <Streamdown>
                      {reading.interpretation}
                    </Streamdown>
                  </div>
                </div>

                {/* New Pull Button */}
                <button
                  onClick={() => {
                    setReading(null);
                    setQuestion("");
                  }}
                  className="w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "rgba(0, 217, 255, 0.1)",
                    color: "var(--color-cyan)",
                    border: "2px solid var(--color-cyan)",
                  }}
                >
                  <RotateCcw size={18} />
                  Pull Again
                </button>
              </div>
            )}
          </div>

          {/* Right: History Sidebar */}
          <div>
            <div
              className="rounded-lg p-6 border-2 sticky top-4"
              style={{
                background: "rgba(255, 20, 147, 0.05)",
                borderColor: "var(--color-hot-pink)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-bold"
                  style={{ color: "var(--color-hot-pink)" }}
                >
                  Saved Readings ({savedReadings.length})
                </h3>
                {savedReadings.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "var(--color-hot-pink)" }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {savedReadings.length === 0 ? (
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  No saved readings yet. Bookmark a reading to save it.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {savedReadings.map((saved) => (
                    <div
                      key={saved.id}
                      className="p-3 rounded-lg text-sm"
                      style={{
                        background: "rgba(0, 217, 255, 0.1)",
                        borderLeft: "3px solid var(--color-cyan)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className="font-bold"
                          style={{ color: "var(--color-cyan)" }}
                        >
                          {saved.cardCount === 1 ? "1 Card" : "3 Cards"}
                        </span>
                        <button
                          onClick={() => handleDeleteReading(saved.id)}
                          className="p-1 opacity-60 hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-hot-pink)" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {saved.question && (
                        <p
                          className="text-xs mb-2 italic"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          "{saved.question}"
                        </p>
                      )}
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {new Date(saved.timestamp).toLocaleDateString()}
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
  );
}
