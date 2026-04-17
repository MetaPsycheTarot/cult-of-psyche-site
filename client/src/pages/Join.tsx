import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Join() {
  const tiers = [
    {
      name: "Member",
      price: "$10",
      period: "/month",
      description: "Full vault access",
      features: [
        "Full archive of content",
        "Exclusive episodes + cuts",
        "Psyche Awakens Tarot system",
        "Tools + generators",
        "Lore + rituals",
      ],
      cta: "Join Now",
      href: `https://cultcodex.me?success_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/success' : '')}`,
    },
    {
      name: "Lifetime",
      price: "$100",
      period: "one-time",
      description: "Everything, forever",
      features: [
        "All Member benefits",
        "Lifetime access",
        "Lifetime badge",
        "Future perks included",
      ],
      cta: "Unlock Forever",
      href: `https://cultcodex.me?success_url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + '/success' : '')}`,
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <div className="container max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
            Unlock the Vault
          </h1>
          <p className="text-xl" style={{ color: "var(--color-text-secondary)" }}>
            Access everything that doesn't go public.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-lg p-8 border-2"
              style={{
                background: tier.featured ? "rgba(255, 20, 147, 0.05)" : "rgba(0, 217, 255, 0.05)",
                borderColor: tier.featured ? "var(--color-hot-pink)" : "var(--color-cyan)",
              }}
            >
              {tier.featured && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: "var(--color-hot-pink)",
                    color: "var(--color-midnight)",
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
                {tier.name}
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: "var(--color-cyan)" }}>
                  {tier.price}
                </span>
                <span style={{ color: "var(--color-text-secondary)" }}>{tier.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check size={18} style={{ color: "var(--color-cyan)" }} />
                    <span style={{ color: "var(--color-text-secondary)" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href={tier.href} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                  className="w-full"
                  style={{
                    background: tier.featured ? "var(--color-hot-pink)" : "var(--color-cyan)",
                    color: "var(--color-midnight)",
                  }}
                >
                  {tier.cta}
                </Button>
              </a>
            </div>
          ))}
        </div>

        {/* What You Get Section */}
        <div
          className="rounded-lg p-12 border-l-4"
          style={{
            background: "rgba(0, 217, 255, 0.05)",
            borderLeftColor: "var(--color-cyan)",
          }}
        >
          <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--color-hot-pink)" }}>
            What You Get
          </h2>
          <ul className="space-y-4">
            {[
              "Full archive of content",
              "Exclusive episodes + cuts",
              "Psyche Awakens Tarot system",
              "Tools + generators",
              "Lore + rituals",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "var(--color-hot-pink)" }}
                ></div>
                <span style={{ color: "var(--color-text-secondary)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
