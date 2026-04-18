import { useLocation } from "wouter";

export function Footer() {
  const [, navigate] = useLocation();

  return (
    <footer
      className="border-t py-12 px-4"
      style={{
        background: "var(--color-midnight)",
        borderTopColor: "rgba(0, 217, 255, 0.2)",
      }}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
              Cult of Psyche
            </h3>
            <p style={{ color: "var(--color-text-secondary)" }}>Enter the system.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Watch", path: "/watch" },
                { label: "Join", path: "/join" },
                { label: "Lore", path: "/lore" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="transition-colors"
                    style={{ color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "var(--color-cyan)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Vault */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              Vault
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Content", path: "/vault/content" },
                { label: "Tarot", path: "/vault/tarot" },
                { label: "Tools", path: "/vault/tools" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="transition-colors"
                    style={{ color: "var(--color-text-secondary)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "var(--color-cyan)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                    }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/PsycheAwakens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                  }}
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@PsychesNightmares"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                  }}
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61584496550976"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--color-text-secondary)";
                  }}
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="border-t pt-8"
          style={{
            borderTopColor: "rgba(0, 217, 255, 0.2)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p style={{ color: "var(--color-text-secondary)" }}>
              © 2026 Cult of Psyche. All rights reserved.
            </p>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Powered by{" "}
              <span style={{ color: "var(--color-hot-pink)" }} className="font-bold">
                CultCodex
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
