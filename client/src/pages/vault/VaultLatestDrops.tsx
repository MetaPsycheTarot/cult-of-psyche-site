import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Lock } from "lucide-react";

const sampleContent = [
  {
    id: 1,
    title: "The Ritual of Awakening",
    type: "Episode",
    duration: "2h 15m",
    description: "A deep dive into the foundational rituals that bind the system.",
    locked: false,
  },
  {
    id: 2,
    title: "Uncensored: The Chaos Segment",
    type: "Extended Cut",
    duration: "47m",
    description: "The parts that never made it to the public stream.",
    locked: false,
  },
  {
    id: 3,
    title: "Psyche Awakens Tarot Reading",
    type: "Exclusive",
    duration: "1h 3m",
    description: "A full tarot reading using the Psyche Awakens deck.",
    locked: false,
  },
];

export default function VaultLatestDrops() {
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const hasMembership = user?.role === "admin";

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            🔮 Latest Drops
          </h1>
          <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
            Fresh content, exclusive episodes, and new rituals.
          </p>

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
                  This section is members-only
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  Upgrade to a membership to unlock exclusive content, tools, and the complete vault.
                </p>
                <a
                  href="/join"
                  className="inline-block mt-4 px-6 py-2 rounded-lg font-semibold"
                  style={{
                    background: "var(--color-hot-pink)",
                    color: "var(--color-midnight)",
                  }}
                >
                  View Membership Options
                </a>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="space-y-6">
            {sampleContent.map((content) => (
              <div
                key={content.id}
                className="p-8 rounded-lg border-2 transition-all hover:scale-102"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: content.locked ? "rgba(255, 20, 147, 0.5)" : "var(--color-cyan)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: "var(--color-cyan)", color: "var(--color-midnight)" }}>
                        {content.type}
                      </span>
                      <span style={{ color: "var(--color-text-secondary)" }}>{content.duration}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                      {content.title}
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)" }}>{content.description}</p>
                  </div>
                  {content.locked && (
                    <Lock size={24} style={{ color: "var(--color-hot-pink)", marginLeft: "16px" }} />
                  )}
                </div>

                {hasMembership && (
                  <button
                    className="mt-6 px-6 py-2 rounded-lg font-semibold transition-all"
                    style={{
                      background: "var(--color-hot-pink)",
                      color: "var(--color-midnight)",
                    }}
                  >
                    Watch Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
