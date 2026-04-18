import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { TAROT_DECK } from "../data/tarotDeck";
import { getCardImageUrl } from "../data/tarotCardImages";

export const tarotRouter = router({
  pull: protectedProcedure
    .input(
      z.object({
        cardCount: z.enum(["1", "3", "5", "10"]),
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
        const card = shuffled[i]!;
        // Randomly determine if card is reversed (50% chance)
        const isReversed = Math.random() > 0.5;
        cards.push({
          ...card,
          isReversed,
        });
      }

      // Generate AI interpretation
      const cardNames = cards.map((c) => `${c.name}${c.isReversed ? " (Reversed)" : ""}`).join(", ");
      const cardMeanings = cards
        .map((c) => `${c.name}${c.isReversed ? " (Reversed)" : ""} (${c.suit}): ${c.meaning}`)
        .join("\n");

      const reversedInfo = cards.map((c) => c.isReversed ? `${c.name} is REVERSED - consider shadow meanings, inversions, and challenges` : `${c.name} is UPRIGHT - consider direct meanings and positive aspects`).join("\n");
      
      const prompt =
        input.question
          ? `You are a mystical tarot reader for the Cult of Psyche. A member asks: "${input.question}"\n\nThey drew: ${cardNames}\n\nCard meanings:\n${cardMeanings}\n\nCard Orientations (Upright/Reversed):\n${reversedInfo}\n\nProvide a brief, mysterious, and insightful interpretation that connects these cards to their question. Pay special attention to reversed cards as they carry shadow meanings, inversions, and hidden challenges. Upright cards show direct meanings and positive aspects. Keep it under 250 words. Use poetic language that fits the neon-noir aesthetic of the Cult of Psyche. Reference the show, community, or occult themes when relevant.`
          : `You are a mystical tarot reader for the Cult of Psyche. A member drew: ${cardNames}\n\nCard meanings:\n${cardMeanings}\n\nCard Orientations (Upright/Reversed):\n${reversedInfo}\n\nProvide a brief, mysterious, and insightful interpretation of what these cards reveal. Pay special attention to reversed cards as they carry shadow meanings, inversions, and hidden challenges. Upright cards show direct meanings and positive aspects. Keep it under 250 words. Use poetic language that fits the neon-noir aesthetic of the Cult of Psyche. Reference the show, community, or occult themes when relevant.`;

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
    return TAROT_DECK.map((card) => ({
      ...card,
      imageUrl: getCardImageUrl(card.name.toLowerCase().replace(/\s+/g, "-")),
    }));
  }),

  // Analyze and compare two readings
  analyzeReadingComparison: protectedProcedure
    .input(
      z.object({
        reading1: z.object({
          cards: z.array(z.object({ name: z.string(), suit: z.string(), isReversed: z.boolean() })),
          spreadType: z.string(),
          interpretation: z.string(),
        }),
        reading2: z.object({
          cards: z.array(z.object({ name: z.string(), suit: z.string(), isReversed: z.boolean() })),
          spreadType: z.string(),
          interpretation: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { reading1, reading2 } = input;
      
      const reading1Cards = reading1.cards.map((c) => `${c.name}${c.isReversed ? " (Reversed)" : ""}`).join(", ");
      const reading2Cards = reading2.cards.map((c) => `${c.name}${c.isReversed ? " (Reversed)" : ""}`).join(", ");
      
      const prompt = `You are a mystical tarot analyst for the Cult of Psyche. Analyze and compare these two readings:

Reading 1 (${reading1.spreadType}):
Cards: ${reading1Cards}
Interpretation: ${reading1.interpretation}

Reading 2 (${reading2.spreadType}):
Cards: ${reading2Cards}
Interpretation: ${reading2.interpretation}

Provide a brief, mystical analysis that:
1. Identifies common themes or patterns between the readings
2. Explains how the readings complement or contrast each other
3. Offers spiritual insights about what these readings reveal together
4. Suggests guidance on how to interpret the relationship between them

Keep it under 300 words. Use poetic language fitting the neon-noir aesthetic of the Cult of Psyche.`;

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a mystical tarot analyst for the Cult of Psyche. Speak in poetic, mysterious language deeply connected to streaming culture, community dynamics, and occult themes. Provide profound insights about reading patterns and spiritual connections.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const analysis =
        typeof response.choices[0]?.message.content === "string"
          ? response.choices[0].message.content
          : "The cards reveal their secrets in silence.";

      return { analysis };
    }),

  // Get card by ID
  getCardById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const card = TAROT_DECK.find((card) => card.id === input.id);
      if (!card) return null;
      return {
        ...card,
        imageUrl: getCardImageUrl(card.name.toLowerCase().replace(/\s+/g, "-")),
      };
    }),
});
