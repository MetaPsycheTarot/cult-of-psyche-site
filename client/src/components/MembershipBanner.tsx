import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Lock, Crown } from "lucide-react";

interface MembershipBannerProps {
  showName?: string;
  ctaUrl?: string;
}

export function MembershipBanner({
  showName = "Psyche's Nightmares",
  ctaUrl = "https://cultcodex.me",
}: MembershipBannerProps) {
  const { user, isAuthenticated } = useAuth();

  // Check if user has membership (admin role indicates paid membership)
  const hasMembership = user?.role === "admin";

  return (
    <div
      className="w-full py-4 px-6 rounded-lg border-l-4 flex items-center justify-between gap-4"
      style={{
        background: "linear-gradient(135deg, rgba(255, 20, 147, 0.05), rgba(0, 217, 255, 0.05))",
        borderLeftColor: "var(--color-hot-pink)",
      }}
    >
      <div className="flex items-center gap-3">
        {hasMembership ? (
          <Crown size={20} style={{ color: "var(--color-hot-pink)" }} />
        ) : (
          <Lock size={20} style={{ color: "var(--color-cyan)" }} />
        )}
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {showName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {hasMembership ? "Member Access Unlocked" : "Join the Psychenomicon"}
          </p>
        </div>
      </div>

      {!hasMembership && (
        <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
          <Button
            className="btn-neon text-xs whitespace-nowrap"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
          >
            Enter the Codex
          </Button>
        </a>
      )}
    </div>
  );
}
