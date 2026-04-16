import { BookOpen } from "lucide-react";

export default function CrimsonQuillTales() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen size={40} style={{ color: "var(--color-hot-pink)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-hot-pink)" }}>Crimson Quill Tales</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            A creative writing and storytelling app where imagination meets the written word. Craft narratives, explore characters, and weave tales that transcend reality.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Write Your Story</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Begin your creative journey with our intuitive writing interface. Craft stories, poems, and narratives with powerful tools designed for writers.
              </p>
              <button className="btn-neon w-full">Start Writing</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>Explore Tales</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Discover stories from the community. Read, comment, and connect with other writers in the Crimson Quill Tales universe.
              </p>
              <button className="btn-neon w-full">Browse Stories</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Character Library</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Build and manage your cast of characters. Track their arcs, relationships, and development throughout your narratives.
              </p>
              <button className="btn-neon w-full">Manage Characters</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Writing Prompts</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Get inspired with daily writing prompts. Challenge yourself with creative exercises designed to unlock your imagination.
              </p>
              <button className="btn-neon w-full">View Prompts</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Accent */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-hot-pink), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
