import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const apps = [
  { name: "Home", path: "/" },
  { name: "Crimson Quill Tales", path: "/crimson-quill-tales" },
  { name: "Cult Psyche Hub", path: "/cult-psyche-hub" },
  { name: "Temple of Wisdom", path: "/temple-of-wisdom" },
  { name: "Oracle Chamber", path: "/oracle-chamber" },
  { name: "The Becoming Vault", path: "/the-becoming-vault" },
  { name: "Psyche Path", path: "/psyche-path" },
];

export default function TopNav() {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm shadow-lg" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Brand Header */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-cyan via-magenta to-transparent"></div>
            <a href="/" className="flex items-center gap-3 group">
              <div className="text-2xl font-bold text-glow-pink animate-pulse-glow">
                CULT OF PSYCHE
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {apps.map((app) => (
              <a
                key={app.path}
                href={app.path}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  location === app.path
                    ? "shadow-neon-pink"
                    : ""
                }`}
                style={{
                  color: location === app.path ? "var(--color-hot-pink)" : "var(--color-text-secondary)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-cyan)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = location === app.path ? "var(--color-hot-pink)" : "var(--color-text-secondary)")}
              >
                {app.name}
              </a>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm" style={{ color: "rgba(0, 217, 255, 0.8)" }}>{user?.name || "User"}</span>
                <button
                  onClick={handleLogout}
                  className="btn-neon text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href={getLoginUrl()}
                className="btn-neon text-xs"
              >
                Login
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 transition-colors"
              style={{ color: "var(--color-cyan)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-hot-pink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-cyan)")}
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
            <div className="lg:hidden border-t bg-card/98 py-4 space-y-2" style={{ borderColor: "var(--color-cyan)" }}>
            {apps.map((app) => (
              <a
                key={app.path}
                href={app.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                  location === app.path
                    ? "border-l-2"
                    : ""
                }`}
                style={{
                  backgroundColor: location === app.path ? "rgba(0, 217, 255, 0.1)" : "transparent",
                  color: location === app.path ? "var(--color-hot-pink)" : "var(--color-text-secondary)",
                  borderColor: location === app.path ? "var(--color-hot-pink)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 217, 255, 0.05)";
                  e.currentTarget.style.color = "var(--color-cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = location === app.path ? "rgba(0, 217, 255, 0.1)" : "transparent";
                  e.currentTarget.style.color = location === app.path ? "var(--color-hot-pink)" : "var(--color-text-secondary)";
                }}
              >
                {app.name}
              </a>
            ))}
            <div className="border-t pt-4 mt-4" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
              {isAuthenticated ? (
                <div className="space-y-3 px-4">
                  <p className="text-sm" style={{ color: "var(--color-cyan)" }}>{user?.name || "User"}</p>
                  <button
                    onClick={handleLogout}
                    className="btn-neon w-full text-xs"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href={getLoginUrl()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-neon block text-center text-xs mx-4"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
