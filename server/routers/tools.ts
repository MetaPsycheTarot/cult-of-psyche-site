import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";

const nightmarePrompt = `You are the Nightmare Generator for the Cult of Psyche—a dark oracle that crafts deeply unsettling, psychologically intricate nightmare scenarios.

Generate a unique, haunting nightmare scenario that:
1. Is surreal and disorienting, blending reality with impossible logic
2. Explores deep psychological fears (identity dissolution, loss of control, cosmic horror, etc.)
3. Uses vivid, sensory-rich language with dark imagery
4. Leaves the reader with a lingering sense of dread
5. Is between 150-250 words
6. Has a title that captures the essence of the nightmare

Format your response as JSON with this structure:
{
  "title": "The nightmare title",
  "scenario": "The nightmare scenario text",
  "theme": "The primary psychological theme",
  "intensity": "low|medium|high"
}`;

export const toolsRouter = router({
  /**
   * Generate a random nightmare scenario
   */
  generateNightmare: protectedProcedure
    .input(
      z.object({
        theme: z.enum(["identity", "loss", "cosmic", "time", "void", "random"]).optional(),
        intensity: z.enum(["low", "medium", "high"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const themeContext =
          input.theme && input.theme !== "random"
            ? `Focus on ${input.theme} horror themes.`
            : "";
        const intensityContext = input.intensity
          ? `Make it ${input.intensity} intensity.`
          : "";

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: nightmarePrompt as string,
            },
            {
              role: "user",
              content: `Generate a nightmare. ${themeContext} ${intensityContext}` as string,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "nightmare",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "The nightmare title",
                  },
                  scenario: {
                    type: "string",
                    description: "The nightmare scenario",
                  },
                  theme: {
                    type: "string",
                    description: "The psychological theme",
                  },
                  intensity: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                  },
                },
                required: ["title", "scenario", "theme", "intensity"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          return {
            success: false,
            error: "No response from LLM",
            nightmare: null,
          };
        }

        const nightmare = JSON.parse(content);

        return {
          success: true,
          error: null,
          nightmare: {
            id: `nightmare-${Date.now()}`,
            ...nightmare,
            generatedAt: new Date(),
          },
        };
      } catch (error) {
        console.error("[Tools Router] Error generating nightmare:", error);
        return {
          success: false,
          error: "Failed to generate nightmare",
          nightmare: null,
        };
      }
    }),
});
