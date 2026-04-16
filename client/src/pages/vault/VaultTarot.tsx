import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface TarotCard {
  id: number;
  name: string;
  arcana: "major" | "minor";
  suit?: "cups" | "wands" | "swords" | "pentacles";
  number?: number;
  emoji: string;
  meaning: string;
  interpretation: string;
  reversed?: string;
}

const psycheAwakensCards: TarotCard[] = [
  {
    id: 1,
    name: "The Awakening",
    arcana: "major",
    emoji: "✨",
    meaning: "Consciousness emerging from the void",
    interpretation:
      "The moment awareness breaks through the veil. You are beginning to see what was always hidden. This is the first step of the journey.",
    reversed: "Denial of truth. Resistance to awakening.",
  },
  {
    id: 2,
    name: "The Descent",
    arcana: "major",
    emoji: "🌑",
    meaning: "Journey into the depths of self",
    interpretation:
      "You must go deeper to understand. The answers lie in the shadow. This is not a journey of comfort, but of truth.",
    reversed: "Avoidance of inner work. Surface-level understanding.",
  },
  {
    id: 3,
    name: "The Mirror",
    arcana: "major",
    emoji: "🪞",
    meaning: "Reflection of what is real",
    interpretation:
      "You see yourself as you truly are. All illusions fall away. This is both terrifying and liberating.",
    reversed: "Self-deception. Distorted self-image.",
  },
  {
    id: 4,
    name: "The Void",
    arcana: "major",
    emoji: "⚫",
    meaning: "Emptiness and infinite potential",
    interpretation:
      "In the void, all things are possible. You stand at the threshold between what was and what will be. Surrender to the unknown.",
    reversed: "Fear of emptiness. Clinging to the familiar.",
  },
  {
    id: 5,
    name: "The Serpent",
    arcana: "major",
    emoji: "🐍",
    meaning: "Transformation and shedding",
    interpretation:
      "You are shedding your old skin. What you were is dying so that what you will become can be born. Embrace the metamorphosis.",
    reversed: "Resistance to change. Stagnation.",
  },
  {
    id: 6,
    name: "The Architect",
    arcana: "major",
    emoji: "🏗️",
    meaning: "Builder of reality",
    interpretation:
      "You have the power to construct your own reality. Every thought is a blueprint. Every action is a building block. Create consciously.",
    reversed: "Powerlessness. Victim mentality.",
  },
  {
    id: 7,
    name: "The Threshold",
    arcana: "major",
    emoji: "🚪",
    meaning: "Passage between worlds",
    interpretation:
      "You stand at the boundary. The old world is behind you. The new world awaits. Choose whether to cross.",
    reversed: "Hesitation. Inability to commit.",
  },
  {
    id: 8,
    name: "The Chorus",
    arcana: "major",
    emoji: "👥",
    meaning: "Collective consciousness",
    interpretation:
      "You are not alone. You are part of something greater. The voices of many speak through you. Listen to the collective wisdom.",
    reversed: "Isolation. Disconnection from others.",
  },
];

export default function VaultTarot() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-6xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            🃏 Psyche Awakens Tarot
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            The deck of awakening. Each card holds a key to understanding the self.
          </p>

          {/* Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {psycheAwakensCards.map((card) => (
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
                  className="aspect-square flex flex-col items-center justify-center p-4 text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 20, 147, 0.1))",
                  }}
                >
                  <div className="text-5xl mb-2 group-hover:scale-125 transition-transform">{card.emoji}</div>
                  <h3
                    className="text-sm font-bold group-hover:text-base transition-all"
                    style={{ color: "var(--color-hot-pink)" }}
                  >
                    {card.name}
                  </h3>
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
                    {card.arcana === "major" ? "Major" : "Minor"}
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
                  <div className="text-7xl mb-4">{selectedCard.emoji}</div>
                  <h2 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                    {selectedCard.name}
                  </h2>
                  <p style={{ color: "var(--color-cyan)" }} className="font-semibold">
                    {selectedCard.arcana === "major" ? "Major Arcana" : "Minor Arcana"}
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

                  {selectedCard.reversed && (
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                        Reversed
                      </h3>
                      <p style={{ color: "var(--color-text-secondary)" }}>{selectedCard.reversed}</p>
                    </div>
                  )}

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
