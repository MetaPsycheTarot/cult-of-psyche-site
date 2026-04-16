export default function Clips() {
  const clips = [
    { id: 1, title: "Clip 1", duration: "2:45" },
    { id: 2, title: "Clip 2", duration: "3:12" },
    { id: 3, title: "Clip 3", duration: "1:58" },
    { id: 4, title: "Clip 4", duration: "4:33" },
    { id: 5, title: "Clip 5", duration: "2:15" },
    { id: 6, title: "Clip 6", duration: "3:47" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <div className="container max-w-6xl mx-auto py-20 px-4">
        <h1 className="text-5xl font-bold mb-8" style={{ color: "var(--color-hot-pink)" }}>
          Clips
        </h1>
        <p className="text-lg mb-12" style={{ color: "var(--color-text-secondary)" }}>
          Short-form content. Bite-sized wisdom. TikTok-style discovery.
        </p>

        {/* Clips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              style={{
                background: "rgba(0, 217, 255, 0.1)",
                border: "1px solid rgba(0, 217, 255, 0.2)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/50 transition-all">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--color-hot-pink)" }}
                >
                  <span style={{ color: "var(--color-midnight)" }}>▶</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {clip.title}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {clip.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
