import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { VaultSidebar } from "@/components/VaultSidebar";
import { MessageCircle, Heart, Reply, Trash2, Plus } from "lucide-react";

interface ForumPost {
  id: string;
  author: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: number;
  likes: number;
  replies: number;
  category: "insights" | "nightmares" | "rituals" | "general" | "support";
  isPinned?: boolean;
}

interface ForumReply {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: number;
  likes: number;
}

export default function CommunityForum() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "insights" | "nightmares" | "rituals" | "general" | "support">("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<"insights" | "nightmares" | "rituals" | "general" | "support">("general");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load posts from localStorage
    const saved = localStorage.getItem("forumPosts");
    const pinnedPost: ForumPost = {
      id: "pinned-getting-started",
      author: "System",
      authorId: "system",
      title: "📌 Getting Started - Frequently Asked Questions",
      content: "Welcome to the Cult of Psyche! Here are answers to common questions:\n\nHow do I use the Nightmare Generator?\nThe Nightmare Generator helps you explore and process your subconscious fears. Go to the Vault > Nightmare Generator, set your intensity level, and let the system guide you through a personalized nightmare scenario. Save your nightmares to your archive for later reflection.\n\nWhat is Tarot Pull?\nTarot Pull is an AI-powered divination tool that draws cards from the Major and Minor Arcana. Each card has detailed interpretations. You can save your readings to track patterns and synchronicities over time.\n\nHow do I access the Vault?\nClick VAULT in the sidebar to access all tools: Nightmare Generator, Tarot Pull, Prompts, Gallery, Archive, and Lore. You must be logged in to use Vault features.\n\nWhat's the difference between the categories?\n- Nightmares: Share and discuss dream experiences\n- Insights: Share spiritual observations and synchronicities\n- Rituals: Discuss practices and techniques\n- General: Off-topic discussions\n- Help & Support: Ask questions and get assistance\n\nHow do I earn engagement points?\nCreate posts, reply to others, and like content. Your engagement score determines your member level from Novice to Master.\n\nCan I export my data?\nYes! Go to Archive and use the export button to download your saved content as JSON.\n\nStill have questions? Post in the Help & Support category and our community will help!",
      createdAt: Date.now() - 604800000,
      likes: 0,
      replies: 0,
      category: "support",
      isPinned: true,
    };
    
    if (saved) {
      const parsedPosts = JSON.parse(saved);
      // Ensure pinned post is always present
      const hasPinned = parsedPosts.some((p: ForumPost) => p.isPinned);
      if (!hasPinned) {
        setPosts([pinnedPost, ...parsedPosts]);
        localStorage.setItem("forumPosts", JSON.stringify([pinnedPost, ...parsedPosts]));
      } else {
        setPosts(parsedPosts);
      }
    } else {
      // Initialize with sample posts
      const samplePosts: ForumPost[] = [
        {
          id: "pinned-getting-started",
          author: "System",
          authorId: "system",
          title: "📌 Getting Started - Frequently Asked Questions",
          content: "Welcome to the Cult of Psyche! Here are answers to common questions:\n\nHow do I use the Nightmare Generator?\nThe Nightmare Generator helps you explore and process your subconscious fears. Go to the Vault > Nightmare Generator, set your intensity level, and let the system guide you through a personalized nightmare scenario. Save your nightmares to your archive for later reflection.\n\nWhat is Tarot Pull?\nTarot Pull is an AI-powered divination tool that draws cards from the Major and Minor Arcana. Each card has detailed interpretations. You can save your readings to track patterns and synchronicities over time.\n\nHow do I access the Vault?\nClick VAULT in the sidebar to access all tools: Nightmare Generator, Tarot Pull, Prompts, Gallery, Archive, and Lore. You must be logged in to use Vault features.\n\nWhat's the difference between the categories?\n- Nightmares: Share and discuss dream experiences\n- Insights: Share spiritual observations and synchronicities\n- Rituals: Discuss practices and techniques\n- General: Off-topic discussions\n- Help & Support: Ask questions and get assistance\n\nHow do I earn engagement points?\nCreate posts, reply to others, and like content. Your engagement score determines your member level from Novice to Master.\n\nCan I export my data?\nYes! Go to Archive and use the export button to download your saved content as JSON.\n\nStill have questions? Post in the Help & Support category and our community will help!",
          createdAt: Date.now() - 604800000,
          likes: 0,
          replies: 0,
          category: "support",
          isPinned: true,
        },
        {
          id: "1",
          author: "Seeker",
          authorId: "user-1",
          title: "My First Nightmare Integration",
          content: "I've been practicing the nightmare integration ritual for a week now. The dreams are becoming clearer, and I'm starting to see patterns in the symbols. Has anyone else experienced this?",
          createdAt: Date.now() - 86400000,
          likes: 12,
          replies: 5,
          category: "nightmares",
        },
        {
          id: "2",
          author: "Adept",
          authorId: "user-2",
          title: "Tarot Synchronicity",
          content: "Pulled the Tower card three times this week. Each time it appeared in different contexts but with the same message about transformation. The collective field is definitely active right now.",
          createdAt: Date.now() - 172800000,
          likes: 23,
          replies: 8,
          category: "insights",
        },
        {
          id: "3",
          author: "Initiate",
          authorId: "user-3",
          title: "New to the Cult",
          content: "Just joined yesterday. The system is overwhelming but fascinating. Any tips for a complete beginner?",
          createdAt: Date.now() - 259200000,
          likes: 7,
          replies: 12,
          category: "general",
        },
      ];
      setPosts(samplePosts);
      localStorage.setItem("forumPosts", JSON.stringify(samplePosts));
    }
  }, []);

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !user) return;

    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: user.name || "Anonymous",
      authorId: (user.id || "unknown").toString(),
      title: newPostTitle,
      content: newPostContent,
      createdAt: Date.now(),
      likes: 0,
      replies: 0,
      category: newPostCategory,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("forumPosts", JSON.stringify(updated));

    setNewPostTitle("");
    setNewPostContent("");
    setShowNewPost(false);
  };

  const handleLikePost = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (newLiked.has(postId) ? 1 : -1) }
          : post
      )
    );
  };

  const handleDeletePost = (postId: string) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    localStorage.setItem("forumPosts", JSON.stringify(updated));
  };

  const filteredPosts = (selectedCategory === "all" 
    ? posts 
    : posts.filter((p) => p.category === selectedCategory))
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query);
    })
    .sort((a, b) => {
      // Pinned posts always come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then sort by creation date (newest first)
      return b.createdAt - a.createdAt;
    })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "insights":
        return "var(--color-cyan)";
      case "nightmares":
        return "var(--color-magenta)";
      case "rituals":
        return "var(--color-hot-pink)";
      case "support":
        return "#FFD700";
      default:
        return "var(--color-text-secondary)";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-midnight)" }}>
      <VaultSidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-hot-pink)" }}>
              💬 COMMUNITY FORUM
            </h1>
            <p style={{ color: "var(--color-cyan)" }} className="text-lg">
              Share insights, nightmares, and rituals with fellow members
            </p>
          </div>

          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all"
            style={{
              background: "var(--color-hot-pink)",
              color: "var(--color-midnight)",
            }}
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div
            className="rounded-lg border p-6 mb-8"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: "rgba(0, 217, 255, 0.2)",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-hot-pink)" }}>
              Create New Post
            </h3>

            <input
              type="text"
              placeholder="Post title..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                border: "1px solid rgba(0, 217, 255, 0.2)",
                color: "var(--color-text-primary)",
              }}
            />

            <textarea
              placeholder="Share your thoughts, insights, or experiences..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg h-32"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                border: "1px solid rgba(0, 217, 255, 0.2)",
                color: "var(--color-text-primary)",
              }}
            />

            <div className="flex gap-4 mb-4">
              <select
                value={newPostCategory}
                onChange={(e) => setNewPostCategory(e.target.value as "insights" | "nightmares" | "rituals" | "general" | "support")}
                className="px-4 py-2 rounded-lg"
                style={{
                  background: "rgba(0, 217, 255, 0.1)",
                  border: "1px solid rgba(0, 217, 255, 0.2)",
                  color: "var(--color-text-primary)",
                }}
              >
                <option value="general">General Discussion</option>
                <option value="nightmares">Nightmares</option>
                <option value="insights">Insights</option>
                <option value="rituals">Rituals & Practices</option>
                <option value="support">Help & Support</option>
              </select>

              <button
                onClick={handleCreatePost}
                className="px-6 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: "var(--color-hot-pink)",
                  color: "var(--color-midnight)",
                }}
              >
                Post
              </button>

              <button
                onClick={() => setShowNewPost(false)}
                className="px-6 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: "rgba(0, 217, 255, 0.1)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border font-mono transition-all"
            style={{
              background: "rgba(0, 217, 255, 0.05)",
              borderColor: searchQuery ? "var(--color-cyan)" : "rgba(0, 217, 255, 0.2)",
              color: "var(--color-text-primary)",
            }}
          />
          {searchQuery && (
            <p style={{ color: "var(--color-cyan)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Found {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {(["all", "insights", "nightmares", "rituals", "general", "support"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
              style={{
                background:
                  selectedCategory === cat
                    ? "var(--color-hot-pink)"
                    : "rgba(0, 217, 255, 0.1)",
                color:
                  selectedCategory === cat
                    ? "var(--color-midnight)"
                    : "var(--color-text-secondary)",
              }}
            >
              {cat === "all" ? "All Posts" : cat === "support" ? "Help & Support" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-lg border overflow-hidden transition-all"
                style={{
                  background: post.isPinned ? "rgba(255, 215, 0, 0.08)" : "rgba(0, 217, 255, 0.03)",
                  borderColor: post.isPinned ? "rgba(255, 215, 0, 0.4)" : "rgba(0, 217, 255, 0.2)",
                  borderWidth: post.isPinned ? "2px" : "1px",
                }}
              >
                {/* Post Header */}
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="w-full p-4 flex items-start justify-between hover:bg-opacity-50 transition-all text-left"
                  style={{
                    background:
                      expandedPost === post.id ? "rgba(0, 217, 255, 0.1)" : "transparent",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {post.isPinned && (
                        <span className="text-lg" title="Pinned Post">
                          📌
                        </span>
                      )}
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{
                          background: `${getCategoryColor(post.category)}20`,
                          color: getCategoryColor(post.category),
                        }}
                      >
                        {post.category.toUpperCase()}
                      </span>
                      <span style={{ color: "var(--color-text-secondary)" }} className="text-sm">
                        by {post.author}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--color-hot-pink)" }}>
                      {post.title}
                    </h3>
                  </div>
                </button>

                {/* Post Content */}
                {expandedPost === post.id && (
                  <div
                    className="border-t p-4"
                    style={{ borderTopColor: "rgba(0, 217, 255, 0.2)" }}
                  >
                    <p
                      style={{ color: "var(--color-text-secondary)" }}
                      className="mb-4 whitespace-pre-wrap"
                    >
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: likedPosts.has(post.id)
                            ? "rgba(255, 20, 147, 0.2)"
                            : "rgba(0, 217, 255, 0.1)",
                          color: likedPosts.has(post.id)
                            ? "var(--color-hot-pink)"
                            : "var(--color-text-secondary)",
                        }}
                      >
                        <Heart size={16} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                        {post.likes}
                      </button>

                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: "rgba(0, 217, 255, 0.1)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        <MessageCircle size={16} />
                        {post.replies}
                      </button>

                      {user?.id?.toString() === post.authorId && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ml-auto"
                          style={{
                            background: "rgba(255, 20, 147, 0.1)",
                            color: "var(--color-hot-pink)",
                          }}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>

                    <div style={{ color: "var(--color-text-secondary)" }} className="text-xs">
                      Posted {new Date(post.createdAt).toLocaleDateString()} at{" "}
                      {new Date(post.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              className="p-12 rounded-lg border-2 text-center"
              style={{
                background: "rgba(0, 217, 255, 0.05)",
                borderColor: "rgba(0, 217, 255, 0.2)",
                borderStyle: "dashed",
              }}
            >
              <p style={{ color: "var(--color-text-secondary)" }} className="text-lg">
                No posts in this category yet. Be the first to share!
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div
          className="mt-8 p-6 rounded-lg border"
          style={{
            background: "rgba(255, 20, 147, 0.05)",
            borderColor: "rgba(255, 20, 147, 0.3)",
          }}
        >
          <p style={{ color: "var(--color-text-secondary)" }}>
            <span style={{ color: "var(--color-hot-pink)" }}>💡 Community Guidelines:</span> Share
            authentically. Respect all perspectives. Support fellow members. No spam or
            self-promotion. Together, we strengthen the collective field.
          </p>
        </div>
      </div>
    </div>
  );
}
