import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { MembershipBanner } from "@/components/MembershipBanner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useEffect } from "react";
import { SchemaMarkup, organizationSchema, websiteSchema } from "@/components/SchemaMarkup";

export default function Home() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Set document title for SEO
    document.title = "Cult of Psyche - Exclusive Occult Content & Tarot System";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Join the Cult of Psyche to access exclusive livestreams, tarot readings, and occult wisdom. Explore Psyche's Nightmares and unlock the system."
      );
    }
  }, []);

  return (
    <>
      <SchemaMarkup schema={organizationSchema} />
      <SchemaMarkup schema={websiteSchema} />
      <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        {/* Accent lines */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 opacity-50"
          style={{
            background: "linear-gradient(to bottom, var(--color-cyan), var(--color-magenta), transparent)",
          }}
        ></div>
        <div
          className="absolute right-0 top-0 bottom-0 w-1 opacity-50"
          style={{
            background: "linear-gradient(to bottom, var(--color-magenta), var(--color-cyan), transparent)",
          }}
        ></div>

        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6" style={{ color: "var(--color-hot-pink)" }}>
            Enter the Codex: Exclusive Occult Content & Tarot Readings
          </h1>
          <p className="text-2xl mb-8" style={{ color: "var(--color-cyan)" }}>
            Join the Cult of Psyche for exclusive livestreams, tarot readings, and occult wisdom.
          </p>

          <div
            className="h-1 w-32 mx-auto mb-12"
            style={{
              background: "linear-gradient(to right, var(--color-cyan), var(--color-magenta), transparent)",
            }}
          ></div>

          <p className="text-lg leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            You've seen the streams. The chaos. The panels. The readings. What you haven't seen is what's behind it.
          </p>

          <button
            onClick={() => navigate(isAuthenticated ? "/vault" : "/join")}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
          >
            {isAuthenticated ? "Enter the Vault" : "Enter the Codex"}
          </button>
        </div>
      </section>

      {/* Membership Banner */}
      <section className="py-8 px-4">
        <div className="container max-w-4xl">
          <MembershipBanner showName="Psyche's Nightmares" ctaUrl="https://cultcodex.me" />
        </div>
      </section>

      {/* YouTube Livestream Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              Watch Psyche's Nightmares Livestreams
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Tune into exclusive livestreams for occult content, rituals, tarot readings, and esoteric wisdom.
            </p>
          </div>
          <YouTubeEmbed className="h-96 md:h-screen-1/2" />
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "var(--color-hot-pink)" }}>
            Exclusive Tarot System, Content & Occult Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Exclusive Occult Content",
                description: "Full episodes, extended cuts, and uncensored occult segments from Psyche's Nightmares livestreams.",
                icon: "🎥",
              },
              {
                title: "Tarot Reading System",
                description: "Psyche Awakens tarot deck with detailed readings, interpretations, and esoteric guidance.",
                icon: "🃏",
              },
              {
                title: "Occult Tools & Generators",
                description: "Nightmare generator, tarot pulls, prompt tools, and esoteric resources for spiritual exploration.",
                icon: "🧰",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-lg border-2 text-center"
                style={{
                  background: "rgba(0, 217, 255, 0.05)",
                  borderColor: "var(--color-cyan)",
                }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                  {item.title}
                </h3>
                <p style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* Vault Tease */}
          <div
            className="p-12 rounded-lg border-2 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(0, 217, 255, 0.1))",
              borderColor: "var(--color-hot-pink)",
            }}
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              Not a channel. Not a community. A living system.
            </h3>
            <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
              The vault is where the real work happens. Where members go to deepen their understanding and participation in the system.
            </p>
            <button
              onClick={() => navigate(isAuthenticated ? "/vault" : "/join")}
              className="px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
              style={{
                background: "var(--color-cyan)",
                color: "var(--color-midnight)",
              }}
            >
              Explore the System
            </button>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 border-t" style={{ borderTopColor: "rgba(0, 217, 255, 0.2)" }}>
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: "var(--color-hot-pink)" }}>
            You Didn't Find Us. We Found You.
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
            The system is waiting. Are you ready to go deeper?
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? "/vault" : "/join")}
            className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
          >
            {isAuthenticated ? "Go to Vault" : "Join Now"}
          </button>
        </div>
      </section>
    </div>
    </>
  );
}
