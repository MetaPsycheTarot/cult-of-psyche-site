import { ArrowRight } from "lucide-react";

const apps = [
  {
    id: 1,
    name: "Crimson Quill Tales",
    description: "A creative writing and storytelling app where imagination meets the written word.",
    path: "/crimson-quill-tales",
    icon: "✍️",
    color: "from-hot-pink to-magenta",
  },
  {
    id: 2,
    name: "Cult Psyche Hub",
    description: "A community and dashboard hub for connection, collaboration, and collective growth.",
    path: "/cult-psyche-hub",
    icon: "🌐",
    color: "from-cyan to-electric-blue",
  },
  {
    id: 3,
    name: "Temple of Wisdom",
    description: "A knowledge and wisdom resource app for enlightenment and understanding.",
    path: "/temple-of-wisdom",
    icon: "🏛️",
    color: "from-magenta to-hot-pink",
  },
  {
    id: 4,
    name: "Oracle Chamber",
    description: "An oracle and divination interactive app for insight and prophecy.",
    path: "/oracle-chamber",
    icon: "🔮",
    color: "from-electric-blue to-cyan",
  },
  {
    id: 5,
    name: "The Becoming Vault",
    description: "A personal growth and archive app for transformation and remembrance.",
    path: "/the-becoming-vault",
    icon: "🗝️",
    color: "from-hot-pink to-electric-blue",
  },
  {
    id: 6,
    name: "Psyche Path",
    description: "A guided journey and path app for self-discovery and spiritual exploration.",
    path: "/psyche-path",
    icon: "🛤️",
    color: "from-cyan to-magenta",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-pulse-glow" style={{ color: "var(--color-hot-pink)" }}>
            CULT OF PSYCHE
          </h1>
          <div
            className="h-1 w-32 mx-auto mb-8"
            style={{
              background: "linear-gradient(to right, var(--color-cyan), var(--color-magenta), transparent)",
            }}
          ></div>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Welcome to the central hub of mystical experiences. Explore six transformative apps designed to awaken your consciousness and expand your understanding of the psyche.
          </p>
          <div
            className="h-1 w-32 mx-auto"
            style={{
              background: "linear-gradient(to right, transparent, var(--color-magenta), var(--color-cyan))",
            }}
          ></div>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app, index) => (
              <div key={app.id} className="group relative" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Card */}
                <a href={app.path} className="card-neon card-hover-animated flex flex-col h-full">
                  {/* Icon */}
                  <div className="card-icon text-5xl mb-4 transition-transform duration-300">{app.icon}</div>

                  {/* Title */}
                  <h3 className="card-title text-xl font-bold mb-3 transition-all duration-300" style={{ color: "var(--color-hot-pink)" }}>
                    {app.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm mb-6 flex-grow" style={{ color: "var(--color-text-secondary)" }}>
                    {app.description}
                  </p>

                  {/* CTA */}
                  <div className="card-cta flex items-center gap-2 transition-all duration-300" style={{ color: "var(--color-cyan)" }}>
                    <span className="font-semibold">Explore</span>
                    <ArrowRight size={18} className="transition-transform duration-300" />
                  </div>
                </a>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-lg transition-all duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 20, 147, 0.05), rgba(217, 70, 239, 0.03), rgba(0, 217, 255, 0.05))",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 border-t border-cyan/30">
        <div className="container max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Journey</h2>
          <p className="text-text-secondary text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
            Each app within the Cult of Psyche offers unique pathways to self-discovery and transformation. Choose your first destination and unlock the mysteries that await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/crimson-quill-tales" className="btn-neon">
              Start Exploring
            </a>
            <a
              href="#"
              className="px-6 py-3 font-bold uppercase tracking-widest rounded-lg border-2 transition-all duration-300"
              style={{ borderColor: "var(--color-cyan)", color: "var(--color-cyan)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 217, 255, 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer Accent */}
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(to right, var(--color-cyan), var(--color-magenta), transparent)",
        }}
      ></div>
    </div>
  );
}
