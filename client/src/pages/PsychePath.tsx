import { Compass } from "lucide-react";

export default function PsychePath() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Compass size={40} style={{ color: "var(--color-cyan)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-cyan)" }}>Psyche Path</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            A guided journey and path app for self-discovery and spiritual exploration. Follow personalized pathways toward deeper understanding and awakening.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>Guided Journeys</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Follow curated pathways designed to guide you through specific areas of personal and spiritual development.
              </p>
              <button className="btn-neon w-full">Start Journey</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Path Mapping</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Visualize your personal path, set intentions, and track your progress through different stages of transformation.
              </p>
              <button className="btn-neon w-full">Map Your Path</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Waypoint Markers</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Mark significant waypoints along your journey, creating a personal roadmap of your spiritual and psychological growth.
              </p>
              <button className="btn-neon w-full">Set Waypoints</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Community Paths</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Explore paths shared by other seekers in the community and discover new directions for your own exploration.
              </p>
              <button className="btn-neon w-full">Explore Paths</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-cyan), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
