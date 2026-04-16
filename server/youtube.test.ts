import { describe, it, expect } from "vitest";
import { fetchPsychesNightmaresLivestreams, getRandomLivestream } from "./youtube";

describe("YouTube Integration", () => {
  it("should fetch livestreams from @psychesnightmares channel", async () => {
    const videos = await fetchPsychesNightmaresLivestreams();

    // Should return an array
    expect(Array.isArray(videos)).toBe(true);

    // If videos are found, validate structure
    if (videos.length > 0) {
      const video = videos[0];
      expect(video).toHaveProperty("id");
      expect(video).toHaveProperty("title");
      expect(video).toHaveProperty("description");
      expect(video).toHaveProperty("thumbnail");
      expect(video).toHaveProperty("publishedAt");
      expect(video).toHaveProperty("channelTitle");

      // Validate types
      expect(typeof video.id).toBe("string");
      expect(typeof video.title).toBe("string");
      expect(video.id.length).toBeGreaterThan(0);
      expect(video.title.length).toBeGreaterThan(0);
    }
  });

  it("should return a random livestream from the list", async () => {
    const videos = await fetchPsychesNightmaresLivestreams();

    if (videos.length > 0) {
      const randomVideo = getRandomLivestream(videos);
      expect(randomVideo).not.toBeNull();
      expect(randomVideo?.id).toBeDefined();
      expect(randomVideo?.title).toBeDefined();
    }
  });

  it("should handle empty video list gracefully", () => {
    const randomVideo = getRandomLivestream([]);
    expect(randomVideo).toBeNull();
  });
});
