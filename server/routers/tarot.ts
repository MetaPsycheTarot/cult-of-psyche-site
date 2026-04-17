import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { TAROT_DECK } from "../data/tarotDeck";
import { getCardImageUrl } from "../data/tarotCardImages";

export const tarotRouter = router({
  pull: protectedProcedure
    .input(
      z.object({
        cardCount: z.enum(["1", "3"]),
        question: z.string().optional(),
        suit: z.enum(["major", "wands", "cups", "swords", "pentacles", "all"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const count = parseInt(input.cardCount);
      let availableCards = TAROT_DECK;

      // Filter by suit if specified
      if (input.suit && input.suit !== "all") {
        availableCards = TAROT_DECK.filter((card) => card.suit === input.suit);
      }

      // Get random cards from filtered deck
      const cards = [];
      const shuffled = [...availableCards].sort(() => Math.random() - 0.5);
      for (let i = 0; i < count && i < shuffled.length; i++) {
        cards.push(shuffled[i]!);
      }

      // Generate AI interpretation
      const cardNames = cards.map((c) => c.name).join(", ");
      const cardMeanings = cards
        .map((c) => `${c.name} (${c.suit}): ${c.meaning}`)
        .join("\n");

      const prompt =
        input.question
          ? `You are a mystical tarot reader for the Cult of Psyche. A member asks: "${input.question}"\n\nThey drew: ${cardNames}\n\nCard meanings:\n${cardMeanings}\n\nProvide a brief, mysterious, and insightful interpretation that connects these cards to their question. Keep it under 250 words. Use poetic language that fits the neon-noir aesthetic of the Cult of Psyche. Reference the show, community, or occult themes when relevant.`
          : `You are a mystical tarot reader for the Cult of Psyche. A member drew: ${cardNames}\n\nCard meanings:\n${cardMeanings}\n\nProvide a brief, mysterious, and insightful interpretation of what these cards reveal. Keep it under 250 words. Use poetic language that fits the neon-noir aesthetic of the Cult of Psyche. Reference the show, community, or occult themes when relevant.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a mystical tarot reader for the Cult of Psyche. Speak in poetic, mysterious language deeply connected to streaming culture, community dynamics, and occult themes. Keep responses concise but profound.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const interpretation =
        typeof response.choices[0]?.message.content === "string"
          ? response.choices[0].message.content
          : "The cards speak in silence.";

      // Add image URLs to cards
      const cardsWithImages = cards.map((card) => ({
        ...card,
        imageUrl: getCardImageUrl(card.name.toLowerCase().replace(/\s+/g, "-")),
      }));

      return {
        cards: cardsWithImages,
        cardCount: count,
        interpretation,
      };
    }),

  // Get all cards by suit
  getCardsBySuit: protectedProcedure
    .input(z.object({ suit: z.enum(["major", "wands", "cups", "swords", "pentacles"]) }))
    .query(({ input }) => {
      return TAROT_DECK.filter((card) => card.suit === input.suit);
    }),

  // Get all cards
  getAllCards: protectedProcedure.query(() => {
    return TAROT_DECK;
  }),

  // Get card by ID
  getCardById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return TAROT_DECK.find((card) => card.id === input.id);
    }),
});
