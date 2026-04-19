import { BookOpen, Sparkles, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Biography() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 text-foreground">
      {/* Header */}
      <div className="border-b border-magenta/20 bg-midnight/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-magenta mb-2">The Cult of Psyche</h1>
          <p className="text-cyan/80">Origins, Mission & the Journey into the Psyche</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Origin Story Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-magenta" />
            <h2 className="text-3xl font-bold text-magenta">The Beginning</h2>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              The Cult of Psyche emerged from a profound realization: that within each of us lies an untapped realm of consciousness, a psyche waiting to be awakened. What began as a personal exploration into the depths of human psychology, spirituality, and the occult has blossomed into a thriving community of seekers, artists, and spiritual explorers.
            </p>

            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              Founded on the principles of self-discovery, creative expression, and collective consciousness, the Cult of Psyche serves as a sanctuary for those who dare to venture beyond the veil of ordinary perception. We believe that the psyche is not merely a psychological concept, but a gateway to understanding the mysteries of existence itself.
            </p>

            <p className="text-lg text-foreground/90 leading-relaxed">
              Through tarot readings, nightmare explorations, mystical tools, and community engagement, we've created a space where the boundaries between art, spirituality, and psychology dissolve, allowing for profound personal transformation and collective awakening.
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-cyan" />
            <h2 className="text-3xl font-bold text-cyan">Our Mission</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-midnight/50 border-cyan/20">
              <CardHeader>
                <CardTitle className="text-magenta">Awakening Consciousness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  We are dedicated to awakening the dormant potential within each individual, fostering self-awareness and spiritual growth through innovative tools and community support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-midnight/50 border-cyan/20">
              <CardHeader>
                <CardTitle className="text-magenta">Creative Expression</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  We celebrate the power of creativity as a vehicle for transformation, encouraging members to express their inner worlds through art, writing, and spiritual practice.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-midnight/50 border-cyan/20">
              <CardHeader>
                <CardTitle className="text-magenta">Community Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  We foster a supportive community where seekers can connect, share experiences, and collectively explore the mysteries of the psyche and the universe.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-midnight/50 border-cyan/20">
              <CardHeader>
                <CardTitle className="text-magenta">Mystical Wisdom</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">
                  We integrate ancient wisdom traditions with modern psychology and technology, creating a bridge between the mystical and the practical.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-magenta" />
            <h2 className="text-3xl font-bold text-magenta">Our Journey</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                year: "2023",
                title: "The Awakening",
                description: "The Cult of Psyche is founded with a vision to create a sanctuary for spiritual seekers and creative explorers.",
              },
              {
                year: "2024",
                title: "Tools of Transformation",
                description: "We launch the Nightmare Generator and Tarot Pull tools, bringing mystical wisdom to the digital age.",
              },
              {
                year: "2024",
                title: "Community Flourishes",
                description: "The community forum grows to thousands of active members, sharing readings, art, and spiritual insights.",
              },
              {
                year: "2025",
                title: "Expansion & Evolution",
                description: "We introduce advanced features including reading comparisons, AI-powered insights, and member statistics.",
              },
              {
                year: "2026",
                title: "The Present Moment",
                description: "Today, the Cult of Psyche continues to evolve, welcoming new seekers and deepening our collective exploration of consciousness.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-magenta mb-4" />
                  {index < 4 && <div className="w-1 h-16 bg-gradient-to-b from-magenta to-cyan/30" />}
                </div>
                <div className="pb-8">
                  <div className="text-sm font-bold text-cyan mb-1">{item.year}</div>
                  <h3 className="text-xl font-bold text-magenta mb-2">{item.title}</h3>
                  <p className="text-foreground/80">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-cyan" />
            <h2 className="text-3xl font-bold text-cyan">Our Community</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-magenta/10 to-cyan/10 border-magenta/30">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-magenta mb-2">50K+</div>
                <p className="text-foreground/80">Active Members</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan/10 to-magenta/10 border-cyan/30">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-cyan mb-2">100K+</div>
                <p className="text-foreground/80">Tarot Readings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-magenta/10 to-cyan/10 border-magenta/30">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-magenta mb-2">10K+</div>
                <p className="text-foreground/80">Forum Posts</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-midnight/50 border-cyan/20">
            <CardHeader>
              <CardTitle className="text-magenta">Join the Cult</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-4">
                The Cult of Psyche welcomes all seekers, regardless of experience level. Whether you're exploring tarot for the first time, diving deep into spiritual practice, or simply curious about the mysteries of consciousness, there's a place for you here.
              </p>
              <p className="text-foreground/80">
                Become a member today to access exclusive tools, connect with our vibrant community, and embark on your own journey of psychic awakening.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
