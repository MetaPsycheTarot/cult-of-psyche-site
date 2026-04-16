export default function Lore() {
  const loreItems = [
    {
      title: "The Awakening",
      description: "The moment consciousness first fractured into infinite possibilities.",
    },
    {
      title: "The Psyche",
      description: "The unified field where all minds converge and diverge simultaneously.",
    },
    {
      title: "The Nightmares",
      description: "Not fears, but gateways. Each nightmare is a doorway to deeper understanding.",
    },
    {
      title: "The Codex",
      description: "The living system that binds all knowledge, ritual, and transformation.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <div className="container max-w-4xl mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-8" style={{ color: "var(--color-hot-pink)" }}>
          Lore
        </h1>
        <p className="text-lg mb-16" style={{ color: "var(--color-text-secondary)" }}>
          The mythology that binds the Cult of Psyche. Read these to understand the system.
        </p>

        <div className="space-y-8">
          {loreItems.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-lg border-l-4"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderLeftColor: "var(--color-hot-pink)",
              }}
            >
              <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--color-hot-pink)" }}>
                {item.title}
              </h2>
              <p style={{ color: "var(--color-text-secondary)" }}>{item.description}</p>
              <button
                className="mt-4 text-sm font-semibold"
                style={{ color: "var(--color-cyan)" }}
              >
                Read More →
              </button>
            </div>
          ))}
        </div>

        <div
          className="mt-16 p-8 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255, 20, 147, 0.1), rgba(0, 217, 255, 0.1))",
            borderLeft: "4px solid var(--color-cyan)",
          }}
        >
          <p className="italic text-lg" style={{ color: "var(--color-text-secondary)" }}>
            "The lore is not written. It is lived. Every ritual, every reading, every moment of consciousness expanding is part of the story."
          </p>
        </div>
      </div>
    </div>
  );
}
