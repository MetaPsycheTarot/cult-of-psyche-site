import { useState } from "react";
import { Upload, Play, Grid, List, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface FanArtItem {
  id: string;
  title: string;
  artist: string;
  type: "image" | "video";
  imageUrl: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  description: string;
}

// Sample fan art data
const sampleFanArt: FanArtItem[] = [
  {
    id: "1",
    title: "Psyche's Awakening",
    artist: "ShadowArtist",
    type: "image",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=500&fit=crop",
    likes: 234,
    comments: 18,
    shares: 12,
    createdAt: "2 days ago",
    description: "A mystical interpretation of the Psyche Awakens deck's major arcana",
  },
  {
    id: "2",
    title: "Neon Nightmare",
    artist: "DarkVision",
    type: "image",
    imageUrl: "https://images.unsplash.com/photo-1578321272176-fff2b9b1e0a4?w=500&h=500&fit=crop",
    likes: 456,
    comments: 42,
    shares: 28,
    createdAt: "5 days ago",
    description: "Inspired by the nightmare generator tool, this piece captures the essence of digital horror",
  },
  {
    id: "3",
    title: "Cult Ritual Animation",
    artist: "MotionMage",
    type: "video",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 789,
    comments: 65,
    shares: 45,
    createdAt: "1 week ago",
    description: "An animated short film exploring the mythology of the Cult of Psyche",
  },
  {
    id: "4",
    title: "Tarot Card Reimagined",
    artist: "CardCollector",
    type: "image",
    imageUrl: "https://images.unsplash.com/photo-1578926314433-c6e7ad7eb744?w=500&h=500&fit=crop",
    likes: 345,
    comments: 28,
    shares: 15,
    createdAt: "1 week ago",
    description: "A fresh take on the traditional tarot deck with a modern aesthetic",
  },
  {
    id: "5",
    title: "Cult Community Showcase",
    artist: "CommunityCreator",
    type: "video",
    imageUrl: "https://images.unsplash.com/photo-1535016120754-fd58615602c5?w=500&h=500&fit=crop",
    videoUrl: "https://www.youtube.com/embed/jNQXAC9IVRw",
    likes: 567,
    comments: 52,
    shares: 34,
    createdAt: "2 weeks ago",
    description: "A compilation of fan submissions celebrating the Cult of Psyche community",
  },
];

export default function FanArt() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [selectedItem, setSelectedItem] = useState<FanArtItem | null>(null);

  const filteredArt = sampleFanArt.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleLike = (id: string) => {
    toast.success("Added to your favorites");
  };

  const handleShare = (item: FanArtItem) => {
    navigator.clipboard.writeText(`Check out "${item.title}" by ${item.artist}`);
    toast.success("Copied to clipboard");
  };

  const handleSubmit = () => {
    toast.success("Your fan art has been submitted for review!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight via-midnight/95 to-midnight/90 text-foreground">
      {/* Header */}
      <div className="border-b border-magenta/20 bg-midnight/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-4xl font-bold text-magenta mb-2">Fan Art Gallery</h1>
              <p className="text-cyan/80">Showcase your creativity and celebrate the Cult of Psyche</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search by title, artist, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-midnight/50 border-cyan/30 focus:border-magenta text-foreground placeholder:text-cyan/50"
              />
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-2 bg-midnight/50 border border-cyan/30 rounded-md text-cyan hover:border-magenta transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                </select>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-cyan/60">
                {filteredArt.length} {filteredArt.length === 1 ? "item" : "items"} found
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-magenta hover:bg-magenta/90" : ""}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-magenta hover:bg-magenta/90" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Submit Button */}
        <div className="mb-12">
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-magenta to-cyan hover:from-magenta/90 hover:to-cyan/90 text-midnight font-bold gap-2"
          >
            <Upload className="w-4 h-4" />
            Submit Your Fan Art
          </Button>
        </div>

        {/* Gallery Grid */}
        {filteredArt.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredArt.map((item) => (
              <Card
                key={item.id}
                className="bg-midnight/50 border-cyan/20 hover:border-magenta/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                      <Play className="w-12 h-12 text-magenta fill-magenta" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-magenta">{item.title}</CardTitle>
                  <p className="text-sm text-cyan/70">by {item.artist}</p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/80 line-clamp-2">{item.description}</p>

                  <div className="flex items-center justify-between text-sm text-cyan/60">
                    <span>{item.createdAt}</span>
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-cyan/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(item.id);
                      }}
                      className="flex items-center gap-1 text-cyan/60 hover:text-magenta transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{item.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-cyan/60 hover:text-magenta transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{item.comments}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(item);
                      }}
                      className="flex items-center gap-1 text-cyan/60 hover:text-magenta transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">{item.shares}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-cyan/60 mb-4">No fan art found matching your search</p>
            <Button onClick={() => setSearchTerm("")} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Modal for detailed view */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <Card className="bg-midnight border-magenta/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-2xl text-magenta">{selectedItem.title}</CardTitle>
                <p className="text-sm text-cyan/70 mt-1">by {selectedItem.artist}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-cyan/60 hover:text-magenta transition-colors"
              >
                ✕
              </button>
            </CardHeader>

            <CardContent className="space-y-4">
              {selectedItem.type === "image" ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedItem.videoUrl}
                    title={selectedItem.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              )}

              <p className="text-foreground/80">{selectedItem.description}</p>

              <div className="flex gap-4 pt-4 border-t border-cyan/10">
                <Button
                  onClick={() => handleLike(selectedItem.id)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Heart className="w-4 h-4" />
                  {selectedItem.likes} Likes
                </Button>
                <Button
                  onClick={() => handleShare(selectedItem)}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
