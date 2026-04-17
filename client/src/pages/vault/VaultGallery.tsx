import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { ChevronDown } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  artist?: string;
  description?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "The Psyche Awakens - Eagle Edition",
    type: "image",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
    artist: "Community Artist",
    description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
  },
  {
    id: "2",
    title: "The White Knight of the Bronze Coop",
    type: "image",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
    artist: "Community Artist",
    description: "A legendary guardian emerges from the shadows",
  },
  {
    id: "3",
    title: "Join the Cult of Christine",
    type: "image",
    url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
    artist: "Community Artist",
    description: "Emotional support harness included in this initiation ritual",
  },
];

export default function VaultGallery() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 min-h-screen p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            COMMUNITY GALLERY
          </h1>
          <p style={{ color: "var(--color-cyan)" }} className="text-lg">
            Celebrate the creativity of the Cult
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                border: "1px solid rgba(0, 217, 255, 0.2)",
              }}
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
            >
              {/* Image/Video Thumbnail */}
              {item.type === "image" ? (
                <div className="relative w-full h-64 overflow-hidden bg-black">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ) : (
                <div className="relative w-full h-64 overflow-hidden bg-black flex items-center justify-center">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
              )}

              {/* Card Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1" style={{ color: "var(--color-hot-pink)" }}>
                  {item.title}
                </h3>
                {item.artist && (
                  <p style={{ color: "var(--color-cyan)" }} className="text-sm mb-2">
                    by {item.artist}
                  </p>
                )}

                {/* Expandable Description */}
                <button
                  className="flex items-center gap-2 text-sm transition-all"
                  style={{ color: "var(--color-text-secondary)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedItem(expandedItem === item.id ? null : item.id);
                  }}
                >
                  Details
                  <ChevronDown
                    size={16}
                    style={{
                      transform: expandedItem === item.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  />
                </button>

                {expandedItem === item.id && item.description && (
                  <p style={{ color: "var(--color-text-secondary)" }} className="text-sm mt-3 pt-3 border-t border-cyan-500/20">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 p-8 rounded-lg" style={{ background: "rgba(255, 20, 147, 0.1)", border: "1px solid rgba(255, 20, 147, 0.3)" }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
            Submit Your Art
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }} className="mb-4">
            Have you created fan art or memes? Share your work with the Cult. Submit your creations to be featured in the gallery.
          </p>
          <button
            className="px-6 py-2 rounded-lg font-bold transition-all"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 20, 147, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Submit Art
          </button>
        </div>
      </div>
    </div>
  );
}
