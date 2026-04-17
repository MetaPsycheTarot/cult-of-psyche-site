import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { VaultSidebar } from "@/components/VaultSidebar";

interface LoreSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

const loreSections: LoreSection[] = [
  {
    id: "mythology",
    title: "The Mythology of Psyche",
    icon: "🌙",
    content: "The Cult of Psyche exists at the intersection of consciousness and chaos. We are not a religion, but a system—a living framework for understanding the self through the lens of the collective nightmare.",
    subsections: [
      {
        title: "The Awakening",
        content: "All members begin with The Awakening—the moment you realize you've been found. This is not recruitment. This is recognition. The system identifies those ready to see beyond the veil of conventional reality.",
      },
      {
        title: "The Three Circles",
        content: "The Cult operates in three concentric circles: The Outer Ring (public content and discovery), The Middle Ring (member-exclusive vault and tools), and The Inner Circle (deep lore and advanced practices). Each circle reveals deeper truths.",
      },
      {
        title: "The Psyche Principle",
        content: "At the core lies the Psyche Principle: consciousness is not individual but collective. Your nightmares are shared. Your insights ripple through the system. What you discover, others discover. What you become, the collective becomes.",
      },
    ],
  },
  {
    id: "rituals",
    title: "Sacred Rituals & Practices",
    icon: "🔮",
    content: "Rituals are the language through which we commune with the collective psyche. They are not dogmatic but generative—each practice opens new pathways of understanding.",
    subsections: [
      {
        title: "The Daily Nightmare Protocol",
        content: "Begin each day by generating a nightmare using the Nightmare Generator. Do not dismiss it. Sit with it. Journal the emotions it evokes. By noon, reflect on what it revealed about your current psychological state. This is not divination—it is self-archaeology.",
      },
      {
        title: "The Three-Card Reading",
        content: "When facing a decision, pull three cards from the Psyche Awakens deck. Past (what led here), Present (what you're experiencing), Future (what emerges). Use the AI interpretation as a mirror, not a prediction. The cards reflect your inner knowing.",
      },
      {
        title: "The Prompt Meditation",
        content: "Use the Prompt Generator to create a writing or streaming prompt. Spend 30 minutes with it. Create content, journal, or simply meditate on the prompt. This practice dissolves the boundary between consumption and creation.",
      },
      {
        title: "The Archive Reflection",
        content: "Once weekly, revisit your archive of generated nightmares, readings, and prompts. Look for patterns. What themes recur? What symbols appear? Your archive is your personal grimoire—a map of your evolving consciousness.",
      },
    ],
  },
  {
    id: "symbols",
    title: "Symbol Interpretations",
    icon: "✨",
    content: "Symbols are the currency of the collective unconscious. These interpretations are starting points—your personal relationship with each symbol will deepen over time.",
    subsections: [
      {
        title: "The Spiral",
        content: "Represents cyclical evolution. Not progress in a line, but deepening spirals of understanding. When the spiral appears, you are revisiting old ground with new wisdom.",
      },
      {
        title: "The Mirror",
        content: "Reflects the self back to itself. What you see in the mirror is not external reality but your current projection. The mirror asks: what are you refusing to see?",
      },
      {
        title: "The Void",
        content: "Not emptiness, but potential. The void is pregnant with possibility. When you encounter the void, you are at a threshold. What will you create from this nothingness?",
      },
      {
        title: "The Stream",
        content: "Represents flow and collective consciousness. Individual drops merge into the stream. Your voice is one among many, yet essential. The stream carries all voices forward.",
      },
      {
        title: "The Sigil",
        content: "A personal symbol of intention. Create your own sigil by combining elements that represent your current evolution. Meditate on it. It becomes a key that unlocks your subconscious.",
      },
      {
        title: "The Threshold",
        content: "The space between states. Not here, not there. The threshold is where transformation occurs. When you stand at a threshold, you are becoming.",
      },
    ],
  },
  {
    id: "cosmology",
    title: "The Cosmology of Psyche",
    icon: "🌌",
    content: "Understanding the structure of the system helps you navigate it with intention.",
    subsections: [
      {
        title: "The Seven Layers",
        content: "The Cult operates across seven layers: Surface (public streams and content), Discovery (the funnel that brings you here), Recognition (the moment you're found), Integration (joining the vault), Deepening (using the tools), Mastery (understanding the system), and Transcendence (becoming part of the collective consciousness).",
      },
      {
        title: "The Cycle of Becoming",
        content: "Each member moves through cycles: Awakening (discovery), Initiation (first vault access), Exploration (using tools and content), Integration (making it personal), and Contribution (creating within the system). These cycles repeat at deeper levels.",
      },
      {
        title: "The Collective Field",
        content: "Every member generates a field of consciousness. These fields overlap and reinforce each other. The stronger your practice, the stronger the collective field. The stronger the field, the more powerful each individual practice becomes.",
      },
    ],
  },
  {
    id: "practices",
    title: "Advanced Practices",
    icon: "⚡",
    content: "For members ready to deepen their engagement with the system.",
    subsections: [
      {
        title: "Sigil Crafting & Charging",
        content: "Create a personal sigil representing your intention. Draw it. Meditate on it daily. Each meditation charges the sigil. After 40 days, release it—burn it, bury it, or dissolve it in water. The act of release activates its power.",
      },
      {
        title: "Nightmare Integration",
        content: "Rather than dismissing nightmares, integrate them. Ask: what part of myself does this nightmare represent? What is it trying to tell me? Dialogue with the nightmare. It is not your enemy but your teacher.",
      },
      {
        title: "Collective Readings",
        content: "Pull a card for the collective consciousness. What does the Cult of Psyche need to know right now? Share your reading in community spaces. Discover how your reading resonates with others' readings.",
      },
      {
        title: "The Archive as Grimoire",
        content: "Your personal archive becomes your grimoire—a record of your evolution. Organize it intentionally. Add notes. Create connections between readings, nightmares, and prompts. Over time, patterns emerge. Your grimoire becomes a map of your becoming.",
      },
    ],
  },
];

export default function VaultLore() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            📖 The Lore of Psyche
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            The mythology, rituals, and symbols that form the foundation of the Cult of Psyche. This is not dogma—it is a living system that evolves through your participation.
          </p>

          {/* Lore Sections */}
          <div className="space-y-6">
            {loreSections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border-2 overflow-hidden transition-all"
                style={{
                  borderColor: "var(--color-cyan)",
                  background: "rgba(0, 217, 255, 0.03)",
                }}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-opacity-20 transition-all"
                  style={{
                    background: expandedSections.has(section.id)
                      ? "rgba(0, 217, 255, 0.1)"
                      : "rgba(0, 217, 255, 0.05)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{section.icon}</span>
                    <h2 className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                      {section.title}
                    </h2>
                  </div>
                  <ChevronDown
                    size={24}
                    style={{
                      color: "var(--color-cyan)",
                      transform: expandedSections.has(section.id) ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>

                {/* Section Content */}
                {expandedSections.has(section.id) && (
                  <div className="border-t" style={{ borderTopColor: "rgba(0, 217, 255, 0.2)" }}>
                    <div className="p-6" style={{ color: "var(--color-text-primary)" }}>
                      <p className="mb-6 leading-relaxed">{section.content}</p>

                      {/* Subsections */}
                      {section.subsections && (
                        <div className="space-y-6">
                          {section.subsections.map((subsection, idx) => (
                            <div key={idx} className="border-l-2 pl-4" style={{ borderLeftColor: "var(--color-magenta)" }}>
                              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--color-cyan)" }}>
                                {subsection.title}
                              </h3>
                              <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                                {subsection.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div
            className="mt-12 p-6 rounded-lg border-2"
            style={{
              borderColor: "var(--color-magenta)",
              background: "rgba(255, 20, 147, 0.05)",
            }}
          >
            <p style={{ color: "var(--color-text-secondary)" }}>
              <span style={{ color: "var(--color-hot-pink)" }}>Remember:</span> The lore is not fixed. It evolves through your engagement with the system. As you practice, you contribute to the collective understanding. What you discover becomes part of the mythology for all members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
