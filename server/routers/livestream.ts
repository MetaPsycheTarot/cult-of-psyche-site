import { publicProcedure, router } from "../_core/trpc";
import { fetchPsychesNightmaresLivestreams, getRandomLivestream, getEmbedUrl } from "../youtube";

export const livestreamRouter = router({
  /**
   * Get a random livestream from @psychesnightmares channel
   */
  random: publicProcedure.query(async () => {
    try {
      const videos = await fetchPsychesNightmaresLivestreams();
      const randomVideo = getRandomLivestream(videos);

      if (!randomVideo) {
        return {
          success: false,
          error: "No livestreams found",
          data: null,
        };
      }

      return {
        success: true,
        error: null,
        data: {
          id: randomVideo.id,
          title: randomVideo.title,
          description: randomVideo.description,
          thumbnail: randomVideo.thumbnail,
          publishedAt: randomVideo.publishedAt,
          channelTitle: randomVideo.channelTitle,
          embedUrl: getEmbedUrl(randomVideo.id),
        },
      };
    } catch (error) {
      console.error("[Livestream Router] Error fetching random livestream:", error);
      return {
        success: false,
        error: "Failed to fetch livestream",
        data: null,
      };
    }
  }),
});
