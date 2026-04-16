/**
 * YouTube API integration for fetching livestreams from @psychesnightmares
 * 
 * This module provides utilities to:
 * - Fetch channel videos/livestreams
 * - Get random livestream for display
 * - Cache results to avoid rate limiting
 */

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
}

// Cache for YouTube videos (in-memory, expires after 1 hour)
let videoCache: YouTubeVideo[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Fetch livestreams from @psychesnightmares channel
 * Uses YouTube Data API v3
 */
export async function fetchPsychesNightmaresLivestreams(): Promise<
  YouTubeVideo[]
> {
  const now = Date.now();

  // Return cached results if still valid
  if (videoCache && now - cacheTimestamp < CACHE_DURATION) {
    console.log("[YouTube] Returning cached livestreams");
    return videoCache;
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.warn("[YouTube] YOUTUBE_API_KEY not configured");
      return [];
    }

    // Step 1: Get channel ID for @psychesnightmares
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=psychesnightmares&type=channel&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      console.error("[YouTube] Failed to fetch channel:", channelResponse.status);
      return [];
    }

    const channelData = await channelResponse.json();
    const channelId = channelData.items?.[0]?.id?.channelId;

    if (!channelId) {
      console.warn("[YouTube] Channel not found for @psychesnightmares");
      return [];
    }

    console.log(`[YouTube] Found channel ID: ${channelId}`);

    // Step 2: Fetch videos from the channel (sorted by date, most recent first)
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50&key=${apiKey}`
    );

    if (!videosResponse.ok) {
      console.error("[YouTube] Failed to fetch videos:", videosResponse.status);
      return [];
    }

    const videosData = await videosResponse.json();

    // Transform API response to our format
    const videos: YouTubeVideo[] = (videosData.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
    }));

    videoCache = videos;
    cacheTimestamp = now;

    console.log(`[YouTube] Fetched ${videos.length} videos from channel`);
    return videos;
  } catch (error) {
    console.error("[YouTube] Error fetching livestreams:", error);
    return [];
  }
}

/**
 * Get a random livestream from the cached list
 */
export function getRandomLivestream(videos: YouTubeVideo[]): YouTubeVideo | null {
  if (videos.length === 0) return null;
  return videos[Math.floor(Math.random() * videos.length)];
}

/**
 * Format video ID for YouTube embed
 */
export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}
