import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  emoji: string;
  path: string;
  status: "active" | "coming-soon";
}

const tools: Tool[] = [
  {
    id: "nightmare",
    name: "Nightmare Generator",
    description: "Generate dark, surreal nightmare scenarios tailored to your themes and intensity levels.",
    emoji: "🌑",
    path: "/vault/tools/nightmare-generator",
    status: "active",
  },
  {
    id: "tarot-pull",
    name: "Tarot Pull",
    description: "Draw from the Psyche Awakens deck. One card, three cards, or full spreads with AI interpretation.",
    emoji: "🃏",
    path: "/vault/tools/tarot-pull",
    status: "active",
  },
  {
    id: "prompt-generator",
    name: "Prompt Generator",
    description: "Generate creative prompts for writing, streaming, or rituals. TikTok, stream ideas, horror stories.",
    emoji: "✍️",
    path: "/vault/tools/prompt-generator",
    status: "active",
  },
];

export default function VaultTools() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            🧰 Vault Tools
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            Interactive systems for creation, divination, and exploration. Each tool is designed to deepen your
            connection to the system.
          </p>

          {/* Tools Grid */}
          <div className="space-y-6">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  if (tool.status === "active") {
                    navigate(tool.path);
                  }
                }}
                disabled={tool.status === "coming-soon"}
                className="w-full p-8 rounded-lg border-2 transition-all text-left group"
                style={{
                  background: tool.status === "active" ? "rgba(0, 217, 255, 0.05)" : "rgba(0, 217, 255, 0.02)",
                  borderColor: tool.status === "active" ? "var(--color-cyan)" : "rgba(0, 217, 255, 0.1)",
                  opacity: tool.status === "coming-soon" ? 0.6 : 1,
                  cursor: tool.status === "active" ? "pointer" : "not-allowed",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="text-5xl mt-2">{tool.emoji}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                          {tool.name}
                        </h3>
                        {tool.status === "coming-soon" && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded"
                          style={{
                            background: "rgba(255, 215, 0, 0.2)",
                            color: "#FFD700",
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                      {tool.status === "active" && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded"
                          style={{
                            background: "rgba(0, 217, 255, 0.2)",
                            color: "var(--color-cyan)",
                          }}
                        >
                          Active
                        </span>
                      )}
                      </div>
                      <p style={{ color: "var(--color-text-secondary)" }}>{tool.description}</p>
                    </div>
                  </div>
                  {tool.status === "active" && (
                    <ChevronRight
                      size={32}
                      style={{ color: "var(--color-cyan)" }}
                      className="group-hover:translate-x-2 transition-transform mt-2"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Info Section */}
          <div
            className="mt-12 p-8 rounded-lg border-2"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              What are Vault Tools?
            </h3>
            <p style={{ color: "var(--color-text-secondary)" }} className="mb-4">
              These are interactive systems designed to deepen your engagement with the Cult of Psyche universe. Each
              tool uses AI and randomization to generate unique, personalized experiences.
            </p>
            <p style={{ color: "var(--color-text-secondary)" }}>
              More tools are coming. The vault is constantly evolving. Check back regularly for new systems and
              features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
