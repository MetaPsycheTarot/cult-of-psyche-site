import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

// Psyche Awakens Tarot Deck
const TAROT_DECK = [
  {
    id: 1,
    name: "The Awakening",
    meaning: "Consciousness, initiation, new beginnings",
    arcana: "Major",
  },
  {
    id: 2,
    name: "The Shadow",
    meaning: "Unconscious forces, hidden truths, inner darkness",
    arcana: "Major",
  },
  {
    id: 3,
    name: "The Mirror",
    meaning: "Self-reflection, identity, truth revealed",
    arcana: "Major",
  },
  {
    id: 4,
    name: "The Void",
    meaning: "Emptiness, potential, the unknown",
    arcana: "Major",
  },
  {
    id: 5,
    name: "The Spiral",
    meaning: "Cycles, transformation, evolution",
    arcana: "Major",
  },
  {
    id: 6,
    name: "The Threshold",
    meaning: "Crossroads, choice, transition",
    arcana: "Major",
  },
  {
    id: 7,
    name: "The Ritual",
    meaning: "Intention, manifestation, sacred action",
    arcana: "Major",
  },
  {
    id: 8,
    name: "The Dissolution",
    meaning: "Endings, release, letting go",
    arcana: "Major",
  },
];

function getRandomCards(count: number): typeof TAROT_DECK {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export const tarotRouter = router({
  pull: publicProcedure
    .input(
      z.object({
        cardCount: z.enum(["1", "3"]),
        question: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const count = parseInt(input.cardCount);
      const cards = getRandomCards(count);

      // Generate AI interpretation
      const prompt =
        count === 1
          ? `You are a mystical tarot interpreter for the Psyche Awakens deck. A seeker has drawn one card for guidance${input.question ? ` about: ${input.question}` : ""}.

Card drawn: ${cards[0]?.name}
Meaning: ${cards[0]?.meaning}

Provide a brief, poetic, and insightful interpretation (2-3 sentences) of what this card means for them right now. Be mysterious but helpful.`
          : `You are a mystical tarot interpreter for the Psyche Awakens deck. A seeker has drawn three cards for guidance${input.question ? ` about: ${input.question}` : ""}.

Cards drawn (Past, Present, Future):
1. ${cards[0]?.name} - ${cards[0]?.meaning}
2. ${cards[1]?.name} - ${cards[1]?.meaning}
3. ${cards[2]?.name} - ${cards[2]?.meaning}

Provide a brief, poetic narrative (3-4 sentences) connecting these three cards as a story of transformation. Be mysterious but insightful.`;

      const interpretation = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are a mystical tarot interpreter. Speak in poetic, mysterious language. Keep responses concise but profound.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const interpretationText =
        typeof interpretation.choices[0]?.message.content === "string"
          ? interpretation.choices[0].message.content
          : "The cards speak in whispers beyond words.";

      return {
        cards,
        interpretation: interpretationText,
        cardCount: count,
        timestamp: new Date(),
      };
    }),
});
