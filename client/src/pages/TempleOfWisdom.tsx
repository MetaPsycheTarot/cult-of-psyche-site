import { BookMarked } from "lucide-react";

export default function TempleOfWisdom() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BookMarked size={40} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-hot-pink)" }}>Temple of Wisdom</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            A knowledge and wisdom resource app for enlightenment and understanding. Access sacred texts, teachings, and insights from the collective consciousness.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Sacred Texts</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Explore curated collections of wisdom teachings, philosophical texts, and spiritual knowledge from various traditions.
              </p>
              <button className="btn-neon w-full">Browse Texts</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>Teachings & Lessons</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Learn from expert teachers and guides who share their insights on consciousness, psychology, and spiritual development.
              </p>
              <button className="btn-neon w-full">View Teachings</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Meditation Guides</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Access guided meditations and contemplative practices designed to deepen your understanding and inner peace.
              </p>
              <button className="btn-neon w-full">Start Meditating</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Knowledge Base</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Search through our comprehensive library of articles, concepts, and definitions related to psychology and spirituality.
              </p>
              <button className="btn-neon w-full">Search Knowledge</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-hot-pink), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
