import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const promptsRouter = router({
  generatePrompt: protectedProcedure
    .input(
      z.object({
        category: z.enum(["tiktok", "stream", "horror"]),
        theme: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const categoryDescriptions = {
        tiktok: "a viral TikTok video concept that is short, punchy, and designed to grab attention in the first 3 seconds",
        stream: "a compelling stream idea or segment that would engage viewers for 30-60 minutes, with hooks and interactive elements",
        horror: "a dark, unsettling horror story premise that blends psychological dread with surreal imagery",
      };

      const themeContext = input.theme ? `The prompt should incorporate the theme: ${input.theme}. ` : "";

      const systemPrompt = `You are a creative prompt generator for content creators in the occult and dark aesthetic space. Generate ${categoryDescriptions[input.category]}. ${themeContext}Make it specific, actionable, and aligned with the Cult of Psyche universe. Include references to chaos, awakening, and psychological exploration when relevant.`;

      const userPrompt = `Generate a single ${input.category === "tiktok" ? "TikTok" : input.category === "stream" ? "stream" : "horror story"} prompt for creators. Make it unique, compelling, and ready to use immediately.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        });

        const promptContent = response.choices[0]?.message.content || "";

        return {
          success: true,
          prompt: {
            id: `prompt-${Date.now()}`,
            category: input.category,
            theme: input.theme || "general",
            content: promptContent,
            generatedAt: new Date(),
          },
        };
      } catch (error) {
        console.error("[Prompt Generation] Error:", error);
        return {
          success: false,
          error: "Failed to generate prompt. Please try again.",
        };
      }
    }),
});
