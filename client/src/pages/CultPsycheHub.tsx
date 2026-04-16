import { Users } from "lucide-react";

export default function CultPsycheHub() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 border-b" style={{ borderColor: "rgba(0, 217, 255, 0.3)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Users size={40} style={{ color: "var(--color-cyan)" }} />
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "var(--color-cyan)" }}>Cult Psyche Hub</h1>
          </div>
          <p className="text-lg max-w-2xl" style={{ color: "var(--color-text-secondary)" }}>
            A community and dashboard hub for connection, collaboration, and collective growth. Join fellow seekers on the path of transformation.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-cyan)" }}>Community Forum</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Connect with other members, share insights, and engage in meaningful discussions about the mysteries of the psyche.
              </p>
              <button className="btn-neon w-full">Join Discussions</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>Your Dashboard</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Track your progress, view your contributions, and manage your profile within the Cult of Psyche community.
              </p>
              <button className="btn-neon w-full">View Dashboard</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-magenta)" }}>Events & Gatherings</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Discover upcoming events, workshops, and group experiences designed for collective exploration and growth.
              </p>
              <button className="btn-neon w-full">View Events</button>
            </div>

            <div className="card-neon">
              <h3 className="text-2xl font-bold mb-4" style={{ color: "var(--color-electric-blue)" }}>Member Directory</h3>
              <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
                Explore profiles of fellow seekers, find mentors, and build meaningful connections within our community.
              </p>
              <button className="btn-neon w-full">Browse Members</button>
            </div>
          </div>
        </div>
      </section>

      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, var(--color-cyan), var(--color-magenta), transparent)" }}></div>
    </div>
  );
}
