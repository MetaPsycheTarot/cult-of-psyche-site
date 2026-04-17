import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Wand2, Bookmark, BookmarkCheck, Trash2, RotateCcw, Info, Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";

interface TarotCardType {
  id: number;
  name: string;
  suit: "major" | "wands" | "cups" | "swords" | "pentacles";
  number: number;
  meaning: string;
  interpretation: string;
  imageUrl?: string;
  reversed?: boolean;
}

interface SavedReading {
  id: string;
  cards: TarotCardType[];
  interpretation: string;
  cardCount: number;
  spreadType: string;
  timestamp: string;
  question?: string;
  notes?: string;
}

export default function TarotPull() {
  const [cardCount, setCardCount] = useState<"1" | "3" | "5" | "10">("3");
  const [spreadType, setSpreadType] = useState<"single" | "threecard" | "celticcross" | "pyramid">("threecard");
  const [question, setQuestion] = useState("");
  const [suit, setSuit] = useState<"major" | "wands" | "cups" | "swords" | "pentacles" | "all">("all");
  const [reading, setReading] = useState<{
    cards: TarotCardType[];
    interpretation: string;
    cardCount: number;
  } | null>(null);
  const [savedReadings, setSavedReadings] = useState<SavedReading[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [readingNotes, setReadingNotes] = useState("");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showInterpretationGuide, setShowInterpretationGuide] = useState(false);

  const pullMutation = trpc.tarot.pull.useMutation();

  // Load saved readings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tarot_readings");
    if (saved) {
      setSavedReadings(JSON.parse(saved));
    }
  }, []);

  // Update card count based on spread type
  useEffect(() => {
    switch (spreadType) {
      case "single":
        setCardCount("1");
        break;
      case "threecard":
        setCardCount("3");
        break;
      case "celticcross":
        setCardCount("10");
        break;
      case "pyramid":
        setCardCount("5");
        break;
    }
  }, [spreadType]);

  const handlePull = async () => {
    const result = await pullMutation.mutateAsync({
      cardCount,
      question: question || undefined,
      suit,
    });
    setReading(result);
    setIsBookmarked(false);
    setReadingNotes("");
    setSelectedCard(null);
  };

  const handleBookmark = () => {
    if (!reading) return;

    const newReading: SavedReading = {
      id: Date.now().toString(),
      cards: reading.cards,
      interpretation: reading.interpretation,
      cardCount: reading.cardCount,
      spreadType,
      timestamp: new Date().toISOString(),
      question: question || undefined,
      notes: readingNotes || undefined,
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

  const getSpreadDescription = (spread: string) => {
    const descriptions: Record<string, string> = {
      single: "A single card pull for quick guidance on any question.",
      threecard: "Past, Present, Future - understand your journey through time.",
      celticcross: "The classic 10-card spread revealing deep insights into your situation.",
      pyramid: "A 5-card pyramid spread for layered understanding and clarity.",
    };
    return descriptions[spread] || "";
  };

  const getSpreadPositions = (spread: string, count: number) => {
    const positions: Record<string, string[]> = {
      single: ["The Card"],
      threecard: ["Past", "Present", "Future"],
      celticcross: ["You", "Cross", "Crown", "Foundation", "Recent", "Near Future", "You", "External", "Hopes", "Outcome"],
      pyramid: ["Foundation", "Challenge", "Influence", "Guidance", "Outcome"],
    };
    return positions[spread] || [];
  };

  const spreadPositions = getSpreadPositions(spreadType, parseInt(cardCount));

  return (
    <div className="min-h-screen p-4" style={{ background: "var(--color-midnight)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={32} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-4xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
              Tarot Readings
            </h1>
          </div>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Consult the Cult of Psyche 78-card deck for profound guidance and insight
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left: Pull Interface */}
          <div className="lg:col-span-2">
            {/* Spread Type Selection */}
            <div
              className="rounded-lg p-6 border-2 mb-6"
              style={{
                background: "rgba(255, 20, 147, 0.05)",
                borderColor: "var(--color-hot-pink)",
              }}
            >
              <h3 className="font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
                ✨ Spread Type
              </h3>
              <div className="space-y-2">
                {(["single", "threecard", "pyramid", "celticcross"] as const).map((spread) => (
                  <button
                    key={spread}
                    onClick={() => setSpreadType(spread)}
                    className="w-full py-3 px-4 rounded-lg font-bold transition-all text-left"
                    style={{
                      background: spreadType === spread ? "var(--color-hot-pink)" : "rgba(255, 20, 147, 0.1)",
                      color: spreadType === spread ? "var(--color-midnight)" : "var(--color-hot-pink)",
                      border: spreadType === spread ? "2px solid var(--color-hot-pink)" : "2px solid rgba(255, 20, 147, 0.3)",
                    }}
                  >
                    <div className="font-bold">
                      {spread === "single" && "🃏 Single Card"}
                      {spread === "threecard" && "📖 Three Card (Past/Present/Future)"}
                      {spread === "pyramid" && "🔺 Pyramid (5 Cards)"}
                      {spread === "celticcross" && "✝️ Celtic Cross (10 Cards)"}
                    </div>
                    <div className="text-xs opacity-75 mt-1">{getSpreadDescription(spread)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suit Selection */}
            <div
              className="rounded-lg p-6 border-2 mb-6"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "var(--color-cyan)",
              }}
            >
              <h3 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                Deck Section
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(["all", "major", "wands", "cups", "swords", "pentacles"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSuit(s)}
                    className="py-2 px-3 rounded-lg font-bold transition-all text-sm"
                    style={{
                      background: suit === s ? "var(--color-cyan)" : "rgba(0, 217, 255, 0.1)",
                      color: suit === s ? "var(--color-midnight)" : "var(--color-cyan)",
                      border: suit === s ? "2px solid var(--color-cyan)" : "2px solid rgba(0, 217, 255, 0.3)",
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
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
              <h3 className="font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
                Your Question (Optional)
              </h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek guidance on? Be specific for deeper insights..."
                className="w-full p-3 rounded-lg bg-opacity-10 text-white placeholder-gray-500 focus:outline-none"
                style={{
                  background: "rgba(0, 217, 255, 0.1)",
                  borderBottom: "2px solid var(--color-cyan)",
                  color: "var(--color-text-primary)",
                }}
                rows={4}
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
              {pullMutation.isPending ? "Drawing from the deck..." : "Pull Cards"}
            </button>

            {/* Interpretation Guide */}
            <button
              onClick={() => setShowInterpretationGuide(!showInterpretationGuide)}
              className="w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              style={{
                background: "rgba(0, 217, 255, 0.1)",
                color: "var(--color-cyan)",
                border: "2px solid rgba(0, 217, 255, 0.3)",
              }}
            >
              <Info size={18} />
              {showInterpretationGuide ? "Hide" : "Show"} Interpretation Guide
            </button>

            {showInterpretationGuide && (
              <div
                className="rounded-lg p-6 border-2 mt-6"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                <h4 className="font-bold mb-3" style={{ color: "var(--color-cyan)" }}>
                  💡 How to Interpret Your Reading
                </h4>
                <div className="space-y-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  <p>• <strong>Card Position:</strong> Each position in the spread has specific meaning</p>
                  <p>• <strong>Card Meaning:</strong> Consider the card's traditional meaning and your intuition</p>
                  <p>• <strong>Suit Significance:</strong> Wands (action), Cups (emotion), Swords (thought), Pentacles (material)</p>
                  <p>• <strong>Your Question:</strong> Relate the cards back to your specific question</p>
                  <p>• <strong>Trust Your Intuition:</strong> Your first impression often holds the deepest truth</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Reading Display & History */}
          <div className="lg:col-span-2 space-y-6">
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
                  <h2 className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                    {spreadType === "single" && "Your Card"}
                    {spreadType === "threecard" && "Your Reading"}
                    {spreadType === "pyramid" && "Your Pyramid"}
                    {spreadType === "celticcross" && "Celtic Cross"}
                  </h2>
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: isBookmarked ? "rgba(255, 20, 147, 0.2)" : "rgba(0, 217, 255, 0.1)",
                      color: isBookmarked ? "var(--color-hot-pink)" : "var(--color-cyan)",
                    }}
                  >
                    {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                </div>

                {/* Cards Grid */}
                <div className={`grid gap-4 mb-6 ${reading.cardCount === 1 ? "grid-cols-1" : reading.cardCount === 3 ? "grid-cols-3" : reading.cardCount === 5 ? "grid-cols-2" : "grid-cols-2"}`}>
                  {reading.cards.map((card, idx) => (
                    <button
                      key={card.id}
                      onClick={() => setSelectedCard(selectedCard === idx ? null : idx)}
                      className="p-4 rounded-lg text-center transition-all cursor-pointer"
                      style={{
                        background: selectedCard === idx ? "rgba(255, 20, 147, 0.2)" : "rgba(255, 20, 147, 0.1)",
                        borderLeft: selectedCard === idx ? "4px solid var(--color-hot-pink)" : "4px solid var(--color-hot-pink)",
                        opacity: selectedCard === idx ? 1 : 0.8,
                      }}
                    >
                      {spreadPositions[idx] && (
                        <p className="text-xs font-bold mb-2 uppercase" style={{ color: "var(--color-cyan)" }}>
                          {spreadPositions[idx]}
                        </p>
                      )}
                      {card.imageUrl && (
                        <img src={card.imageUrl} alt={card.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <p className="text-sm font-bold mb-1" style={{ color: "var(--color-hot-pink)" }}>
                        {card.name}
                      </p>
                      <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>
                        {card.suit.charAt(0).toUpperCase() + card.suit.slice(1)} {card.number}
                      </p>
                      <p className="text-xs" style={{ color: "var(--color-cyan)" }}>
                        {card.meaning}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Selected Card Details */}
                {selectedCard !== null && reading.cards[selectedCard] && (
                  <div
                    className="p-4 rounded-lg border-l-4 mb-6"
                    style={{
                      background: "rgba(0, 217, 255, 0.05)",
                      borderColor: "var(--color-cyan)",
                    }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: "var(--color-cyan)" }}>
                      {reading.cards[selectedCard].name} - Detailed Meaning
                    </h4>
                    <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {reading.cards[selectedCard].interpretation}
                    </p>
                  </div>
                )}

                {/* Interpretation */}
                <div
                  className="p-6 rounded-lg border-l-4 mb-6"
                  style={{
                    background: "rgba(0, 217, 255, 0.05)",
                    borderColor: "var(--color-cyan)",
                  }}
                >
                  <h3 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                    ✨ Interpretation
                  </h3>
                  <div style={{ color: "var(--color-text-primary)" }} className="text-sm">
                    <Streamdown>{reading.interpretation}</Streamdown>
                  </div>
                </div>

                {/* Reading Notes */}
                <div
                  className="p-4 rounded-lg border-2"
                  style={{
                    background: "rgba(255, 20, 147, 0.05)",
                    borderColor: "var(--color-hot-pink)",
                  }}
                >
                  <h4 className="font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                    Your Notes
                  </h4>
                  <textarea
                    value={readingNotes}
                    onChange={(e) => setReadingNotes(e.target.value)}
                    placeholder="Add personal notes about this reading..."
                    className="w-full p-3 rounded-lg bg-opacity-10 text-white placeholder-gray-500 focus:outline-none text-sm"
                    style={{
                      background: "rgba(0, 217, 255, 0.1)",
                      borderBottom: "2px solid var(--color-cyan)",
                      color: "var(--color-text-primary)",
                    }}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* History */}
            <div
              className="rounded-lg p-6 border-2 sticky top-4"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "var(--color-cyan)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: "var(--color-cyan)" }}>
                  📚 Reading History
                </h3>
                {savedReadings.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs font-bold"
                    style={{ color: "var(--color-hot-pink)" }}
                  >
                    {showHistory ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              {showHistory && savedReadings.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {savedReadings.map((reading) => (
                    <div
                      key={reading.id}
                      className="p-3 rounded-lg text-sm"
                      style={{
                        background: "rgba(255, 20, 147, 0.1)",
                        borderLeft: "2px solid var(--color-hot-pink)",
                      }}
                    >
                      <p className="font-bold mb-1" style={{ color: "var(--color-hot-pink)" }}>
                        {reading.spreadType === "single" && "🃏"}
                        {reading.spreadType === "threecard" && "📖"}
                        {reading.spreadType === "pyramid" && "🔺"}
                        {reading.spreadType === "celticcross" && "✝️"}
                        {" "}{reading.cards.map((c) => c.name).join(" + ")}
                      </p>
                      <p className="text-xs mb-1" style={{ color: "var(--color-text-secondary)" }}>
                        {new Date(reading.timestamp).toLocaleDateString()} {new Date(reading.timestamp).toLocaleTimeString()}
                      </p>
                      {reading.question && (
                        <p className="text-xs italic mb-2" style={{ color: "var(--color-cyan)" }}>
                          Q: "{reading.question}"
                        </p>
                      )}
                      {reading.notes && (
                        <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          📝 {reading.notes}
                        </p>
                      )}
                      <button
                        onClick={() => handleDeleteReading(reading.id)}
                        className="text-xs font-bold transition-all"
                        style={{ color: "var(--color-hot-pink)" }}
                      >
                        <Trash2 size={12} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  ))}
                  {savedReadings.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: "rgba(255, 20, 147, 0.2)",
                        color: "var(--color-hot-pink)",
                      }}
                    >
                      <RotateCcw size={12} className="inline mr-1" />
                      Clear All
                    </button>
                  )}
                </div>
              )}

              {!showHistory && savedReadings.length > 0 && (
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {savedReadings.length} reading{savedReadings.length !== 1 ? "s" : ""} saved
                </p>
              )}

              {savedReadings.length === 0 && (
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  No saved readings yet. Bookmark readings to save them here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
