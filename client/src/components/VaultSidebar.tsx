import { useLocation } from "wouter";
import { Zap, Film, Sparkles, Archive, LogOut, Wand2, BookOpen, Image } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const navItems = [
  { label: "Latest Drops", path: "/vault/latest-drops", icon: Zap },
  { label: "Content", path: "/vault/content", icon: Film },
  { label: "Tarot", path: "/vault/tarot", icon: Sparkles },
  { label: "Tools", path: "/vault/tools", icon: Wand2 },
  { label: "Lore", path: "/vault/lore", icon: BookOpen },
  { label: "Gallery", path: "/vault/gallery", icon: Image },
  { label: "Archive", path: "/vault/archive", icon: Archive },
];

export function VaultSidebar() {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
    navigate("/");
  };

  return (
    <div
      className="w-64 h-screen fixed left-0 top-0 p-6 border-r overflow-y-auto"
      style={{
        background: "var(--color-midnight)",
        borderRightColor: "rgba(0, 217, 255, 0.2)",
      }}
    >
      <div className="mb-12">
        <h2 className="text-2xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
          VAULT
        </h2>
        <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
          Welcome inside. You're in the system now.
        </p>
      </div>

      <nav className="space-y-2 mb-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
              style={{
                background: isActive ? "rgba(0, 217, 255, 0.2)" : "transparent",
                color: isActive ? "var(--color-cyan)" : "var(--color-text-secondary)",
              }}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
        style={{
          background: "rgba(255, 20, 147, 0.1)",
          color: "var(--color-hot-pink)",
        }}
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
}
