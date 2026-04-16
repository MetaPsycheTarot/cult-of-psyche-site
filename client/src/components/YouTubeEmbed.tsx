import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface YouTubeEmbedProps {
  className?: string;
}

export function YouTubeEmbed({ className = "" }: YouTubeEmbedProps) {
  const { data, isLoading, error } = trpc.livestream.random.useQuery();
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (data?.success && data.data?.embedUrl) {
      setEmbedUrl(data.data.embedUrl);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-black/50 rounded-lg ${className}`}>
        <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-cyan)" }} />
      </div>
    );
  }

  if (error || !embedUrl) {
    return (
      <div className={`flex items-center justify-center bg-black/50 rounded-lg ${className}`}>
        <p style={{ color: "var(--color-text-secondary)" }}>Unable to load livestream</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          title="Psyche's Nightmares Livestream"
          className="absolute top-0 left-0 w-full h-full rounded-lg border"
          style={{
            borderColor: "rgba(0, 217, 255, 0.3)",
            boxShadow: "0 0 20px rgba(0, 217, 255, 0.1)",
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
