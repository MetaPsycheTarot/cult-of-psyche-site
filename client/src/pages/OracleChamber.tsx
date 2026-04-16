import { Eye } from "lucide-react";

export default function OracleChamber() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Eye size={40} style={{ color: "var(--color-electric-blue)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-electric-blue)" }}>Oracle Chamber</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            An oracle and divination interactive app for insight and prophecy. Seek guidance through ancient divination systems and intuitive readings.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Tarot Readings</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Receive personalized tarot readings that offer insight into your current situation and guidance for the path ahead.
              </p>
              <button className="btn-neon w-full">Draw Cards</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>I Ching Divination</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Consult the ancient wisdom of the I Ching for guidance on life decisions and understanding the flow of change.
              </p>
              <button className="btn-neon w-full">Consult I Ching</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Numerology</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Discover the hidden meanings in numbers and how they relate to your personality, destiny, and life path.
              </p>
              <button className="btn-neon w-full">Calculate Numbers</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Astrology Insights</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Explore your birth chart and receive astrological insights about your cosmic nature and planetary influences.
              </p>
              <button className="btn-neon w-full">View Chart</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-electric-blue), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
