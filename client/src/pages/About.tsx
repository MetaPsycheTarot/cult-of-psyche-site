export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <div className="container max-w-4xl mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-8" style={{ color: "var(--color-hot-pink)" }}>
          About
        </h1>

        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              What This Is
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Cult of Psyche is not a channel. Not a community. It's a living system—a carefully constructed ecosystem of content, tools, and knowledge designed to awaken consciousness and expand understanding of the psyche.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              Your Role
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              You're not a consumer. You're a participant in a system. Whether you're watching the streams, pulling tarot, exploring the lore, or diving into the vault—you're part of the ritual. Every interaction deepens the system.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>
              What CultCodex Is
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              CultCodex is the vault. The inner sanctum. Where the real work happens. Full episodes, exclusive cuts, the tarot system, tools, rituals, and the lore that binds it all together. This is where members go to deepen their understanding and participation in the system.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
