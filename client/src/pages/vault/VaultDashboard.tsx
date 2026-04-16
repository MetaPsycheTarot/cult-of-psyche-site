import { VaultSidebar } from "@/components/VaultSidebar";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function VaultDashboard() {
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
            Welcome inside.
          </h1>
          <p className="text-xl mb-12" style={{ color: "var(--color-text-secondary)" }}>
            You're in the system now.
          </p>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "🔮 Latest Drops",
                description: "Fresh content, exclusive episodes, and new rituals.",
                path: "/vault/latest-drops",
              },
              {
                title: "🧠 Knowledge",
                description: "Lore, philosophy, and hidden meanings.",
                path: "/vault/knowledge",
              },
              {
                title: "🧰 Tools",
                description: "Generators, tarot pulls, and utilities.",
                path: "/vault/tools",
              },
              {
                title: "🗂 Archive",
                description: "Organized by date, theme, and guest.",
                path: "/vault/archive",
              },
            ].map((card) => (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="p-8 rounded-lg border-2 text-left transition-all hover:scale-105"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                  {card.title}
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>{card.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
