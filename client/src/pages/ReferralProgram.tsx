import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { Copy, Share2, Users, Gift, TrendingUp, CheckCircle } from "lucide-react";

interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  referrals: Array<{
    id: string;
    email: string;
    referredAt: string;
    status: "pending" | "active" | "inactive";
    rewardEarned: number;
  }>;
}

export default function ReferralProgram() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Initialize referral data from localStorage
    const storedReferrals = JSON.parse(localStorage.getItem("referralData") || "null");

    if (!storedReferrals) {
      // Generate new referral code for user
      const referralCode = `PSYCHE${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const referralLink = `${window.location.origin}?ref=${referralCode}`;

      const newReferralData: ReferralData = {
        referralCode,
        referralLink,
        totalReferrals: 0,
        activeReferrals: 0,
        totalRewards: 0,
        referrals: [],
      };

      localStorage.setItem("referralData", JSON.stringify(newReferralData));
      setReferralData(newReferralData);
    } else {
      setReferralData(storedReferrals);
    }

    setLoading(false);
  }, []);

  const handleCopyLink = () => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareOnSocial = (platform: string) => {
    if (!referralData) return;

    const shareText = `Join the Cult of Psyche and unlock exclusive tarot readings, mystical tools, and spiritual insights. Use my referral code: ${referralData.referralCode}`;
    const encodedText = encodeURIComponent(shareText);
    const encodedLink = encodeURIComponent(referralData.referralLink);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedLink}`,
      email: `mailto:?subject=Join the Cult of Psyche&body=${encodedText}%0A%0A${encodedLink}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            🎁 REFERRAL PROGRAM
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Invite friends to the Cult and earn exclusive rewards
          </p>
        </div>

        {referralData && !loading && (
          <>
            {/* Main Referral Card */}
            <div className="mb-8 p-8 rounded-lg border" style={{ borderColor: "rgba(255, 20, 147, 0.3)", background: "rgba(255, 20, 147, 0.05)" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Referral Code & Link */}
                <div>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
                    Your Referral Code
                  </h2>

                  {/* Code Display */}
                  <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                    <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      Share this code with friends
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold font-mono" style={{ color: "var(--color-cyan)" }}>
                        {referralData.referralCode}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(referralData.referralCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="p-2 rounded transition-all"
                        style={{ background: "rgba(0, 217, 255, 0.2)", color: "var(--color-cyan)" }}
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Link Display */}
                  <div className="p-4 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                    <div className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      Or share this link
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralData.referralLink}
                        readOnly
                        className="flex-1 px-3 py-2 rounded text-sm bg-card border"
                        style={{ borderColor: "rgba(0, 217, 255, 0.3)", color: "var(--color-text-secondary)" }}
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-2 rounded transition-all"
                        style={{
                          background: copied ? "rgba(0, 217, 255, 0.3)" : "rgba(0, 217, 255, 0.2)",
                          color: "var(--color-cyan)",
                        }}
                      >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Social Share Buttons */}
                <div>
                  <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
                    Share on Social
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleShareOnSocial("twitter")}
                      className="w-full p-4 rounded-lg border transition-all hover:scale-105"
                      style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.1)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Share2 size={20} style={{ color: "var(--color-cyan)" }} />
                        <span style={{ color: "var(--color-cyan)" }}>Share on Twitter</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleShareOnSocial("facebook")}
                      className="w-full p-4 rounded-lg border transition-all hover:scale-105"
                      style={{ borderColor: "rgba(255, 20, 147, 0.3)", background: "rgba(255, 20, 147, 0.1)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Share2 size={20} style={{ color: "var(--color-hot-pink)" }} />
                        <span style={{ color: "var(--color-hot-pink)" }}>Share on Facebook</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleShareOnSocial("whatsapp")}
                      className="w-full p-4 rounded-lg border transition-all hover:scale-105"
                      style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.1)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Share2 size={20} style={{ color: "var(--color-cyan)" }} />
                        <span style={{ color: "var(--color-cyan)" }}>Share on WhatsApp</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleShareOnSocial("email")}
                      className="w-full p-4 rounded-lg border transition-all hover:scale-105"
                      style={{ borderColor: "rgba(255, 20, 147, 0.3)", background: "rgba(255, 20, 147, 0.1)" }}
                    >
                      <div className="flex items-center gap-3">
                        <Share2 size={20} style={{ color: "var(--color-hot-pink)" }} />
                        <span style={{ color: "var(--color-hot-pink)" }}>Share via Email</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-cyan)", background: "rgba(0, 217, 255, 0.1)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <Users size={20} style={{ color: "var(--color-cyan)" }} />
                  <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Total Referrals
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-cyan)" }}>
                  {referralData.totalReferrals}
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-hot-pink)", background: "rgba(255, 20, 147, 0.1)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={20} style={{ color: "var(--color-hot-pink)" }} />
                  <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Active Referrals
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                  {referralData.activeReferrals}
                </div>
              </div>

              <div className="p-6 rounded-lg border" style={{ borderColor: "var(--color-magenta)", background: "rgba(255, 20, 147, 0.1)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <Gift size={20} style={{ color: "var(--color-magenta)" }} />
                  <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Total Rewards
                  </div>
                </div>
                <div className="text-3xl font-bold" style={{ color: "var(--color-magenta)" }}>
                  ${referralData.totalRewards}
                </div>
              </div>
            </div>

            {/* Referral History */}
            {referralData.referrals.length > 0 ? (
              <div className="p-6 rounded-lg border" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
                  Your Referrals
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {referralData.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="p-4 rounded-lg border flex items-center justify-between"
                      style={{ borderColor: "rgba(0, 217, 255, 0.2)", background: "rgba(0, 0, 0, 0.3)" }}
                    >
                      <div>
                        <div style={{ color: "var(--color-cyan)" }} className="font-semibold">
                          {referral.email}
                        </div>
                        <div style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                          {new Date(referral.referredAt).toLocaleDateString()} • Status: {referral.status}
                        </div>
                      </div>
                      <div className="text-right">
                        <div style={{ color: "var(--color-hot-pink)" }} className="font-bold">
                          +${referral.rewardEarned}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg border text-center" style={{ borderColor: "rgba(0, 217, 255, 0.3)", background: "rgba(0, 217, 255, 0.05)" }}>
                <Users size={40} style={{ color: "var(--color-text-secondary)", margin: "0 auto 16px" }} />
                <p style={{ color: "var(--color-text-secondary)" }}>
                  No referrals yet. Start sharing your code to earn rewards!
                </p>
              </div>
            )}

            {/* Rewards Info */}
            <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: "rgba(255, 215, 0, 0.3)", background: "rgba(255, 215, 0, 0.05)" }}>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--color-gold)" }}>
                How Rewards Work
              </h3>
              <ul className="space-y-2" style={{ color: "var(--color-text-secondary)" }}>
                <li>✦ Earn $5 for each friend who signs up with your code</li>
                <li>✦ Earn $10 when they make their first purchase</li>
                <li>✦ Earn 5% of their monthly subscription value</li>
                <li>✦ Rewards are credited to your account automatically</li>
                <li>✦ Minimum payout: $50 (via PayPal or store credit)</li>
              </ul>
            </div>
          </>
        )}

        {loading && (
          <div style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: "40px" }}>
            Loading referral program...
          </div>
        )}
      </div>
    </div>
  );
}
