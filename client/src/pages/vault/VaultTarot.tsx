import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface TarotCard {
  id: number;
  name: string;
  suit: "major" | "wands" | "cups" | "swords" | "pentacles";
  number: number;
  meaning: string;
  interpretation: string;
  imageUrl?: string;
}

export default function VaultTarot() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [suitFilter, setSuitFilter] = useState<"all" | "major" | "wands" | "cups" | "swords" | "pentacles">("all");

  // Fetch all cards from backend
  const { data: allCards = [] } = trpc.tarot.getAllCards.useQuery();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Filter cards by suit
  const filteredCards = suitFilter === "all" ? allCards : allCards.filter((card) => card.suit === suitFilter);

  const getSuitLabel = (suit: string) => {
    if (suit === "major") return "Major Arcana";
    return suit.charAt(0).toUpperCase() + suit.slice(1) + " Suit";
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            🃏 Psyche Awakens Tarot
          </h1>
          <p className="text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
            The complete 78-card deck of awakening. Each card holds a key to understanding the self.
          </p>

          {/* Suit Filter */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(["all", "major", "wands", "cups", "swords", "pentacles"] as const).map((suit) => (
              <button
                key={suit}
                onClick={() => setSuitFilter(suit)}
                className="px-4 py-2 rounded-lg font-semibold transition-all capitalize"
                style={{
                  background: suitFilter === suit ? "var(--color-hot-pink)" : "rgba(0, 217, 255, 0.1)",
                  color: suitFilter === suit ? "var(--color-midnight)" : "var(--color-cyan)",
                  border: suitFilter === suit ? "none" : "2px solid var(--color-cyan)",
                }}
              >
                {suit === "all" ? "All Cards" : suit}
              </button>
            ))}
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="group rounded-lg overflow-hidden border-2 transition-all hover:scale-110 hover:shadow-2xl cursor-pointer"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                <div
                  className="aspect-square flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 20, 147, 0.1))",
                  }}
                >
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-5xl mb-2 group-hover:scale-125 transition-transform">🃏</div>
                  )}
                </div>
                <div className="p-3 text-center" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
                  <h3 className="text-xs font-bold line-clamp-2" style={{ color: "var(--color-hot-pink)" }}>
                    {card.name}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    {card.suit === "major" ? "Major" : card.suit.charAt(0).toUpperCase() + card.suit.slice(1)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Modal */}
          {selectedCard && (
            <div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              style={{ background: "rgba(0, 0, 0, 0.7)" }}
              onClick={() => setSelectedCard(null)}
            >
              <div
                className="rounded-lg max-w-2xl w-full p-8 border-2 relative max-h-[90vh] overflow-y-auto"
                style={{
                  background: "var(--color-midnight)",
                  borderColor: "var(--color-cyan)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-opacity-20 rounded-lg transition-all"
                  style={{
                    color: "var(--color-hot-pink)",
                  }}
                >
                  <X size={24} />
                </button>

                <div className="text-center mb-8">
                  {selectedCard.imageUrl && (
                    <img
                      src={selectedCard.imageUrl}
                      alt={selectedCard.name}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h2 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                    {selectedCard.name}
                  </h2>
                  <p style={{ color: "var(--color-cyan)" }} className="font-semibold">
                    {getSuitLabel(selectedCard.suit)}
                  </p>
                  <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
                    Card #{selectedCard.number}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4" style={{ borderBottomColor: "rgba(0, 217, 255, 0.2)" }}>
                    <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-cyan)" }}>
                      Meaning
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)" }}>{selectedCard.meaning}</p>
                  </div>

                  <div className="border-b pb-4" style={{ borderBottomColor: "rgba(0, 217, 255, 0.2)" }}>
                    <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-cyan)" }}>
                      Interpretation
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)" }}>{selectedCard.interpretation}</p>
                  </div>

                  <div className="pt-4 border-t" style={{ borderTopColor: "rgba(0, 217, 255, 0.2)" }}>
                    <textarea
                      placeholder="Add your personal notes about this card..."
                      className="w-full p-4 rounded-lg border-2 resize-none"
                      rows={4}
                      style={{
                        background: "rgba(0, 217, 255, 0.05)",
                        borderColor: "rgba(0, 217, 255, 0.2)",
                        color: "var(--color-text-secondary)",
                      }}
                    />
                    <button
                      className="mt-4 w-full py-2 rounded-lg font-semibold transition-all"
                      style={{
                        background: "var(--color-cyan)",
                        color: "var(--color-midnight)",
                      }}
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
