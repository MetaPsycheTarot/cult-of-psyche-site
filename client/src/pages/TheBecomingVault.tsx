import { Archive } from "lucide-react";

export default function TheBecomingVault() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Archive size={40} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-hot-pink)" }}>The Becoming Vault</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            A personal growth and archive app for transformation and remembrance. Document your journey, track your evolution, and preserve your memories.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Personal Journal</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Write and reflect on your personal journey, capturing moments of growth, challenges, and transformation.
              </p>
              <button className="btn-neon w-full">Open Journal</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>Growth Milestones</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Track your achievements, breakthroughs, and significant moments that mark your personal evolution and becoming.
              </p>
              <button className="btn-neon w-full">View Milestones</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Memory Archive</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Store photos, documents, and memories that represent important chapters in your personal transformation story.
              </p>
              <button className="btn-neon w-full">Access Archive</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Reflection Prompts</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Engage with guided reflection questions designed to deepen your self-awareness and document your inner transformation.
              </p>
              <button className="btn-neon w-full">Start Reflecting</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-hot-pink), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
