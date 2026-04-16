import { YouTubeEmbed } from "@/components/YouTubeEmbed";

export default function Watch() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <div className="container max-w-6xl mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
          Watch
        </h1>
        <p className="mb-12" style={{ color: "var(--color-text-secondary)" }}>
          Tune into Psyche's Nightmares livestreams and exclusive content.
        </p>

        {/* Latest Livestream */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--color-cyan)" }}>
            Latest Livestream
          </h2>
          <YouTubeEmbed className="h-96 md:h-screen-1/2" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Panels", "Tarot", "Chaos Segments"].map((category) => (
            <div
              key={category}
              className="p-6 rounded-lg border-l-4"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderLeftColor: "var(--color-cyan)",
              }}
            >
              <h3 className="text-xl font-bold" style={{ color: "var(--color-hot-pink)" }}>
                {category}
              </h3>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
                Coming soon
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
