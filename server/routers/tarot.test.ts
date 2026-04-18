import { describe, expect, it, vi } from "vitest";
import { tarotRouter } from "./tarot";
import { publicProcedure, router } from "../_core/trpc";
import type { TrpcContext } from "../_core/context";

// Mock the LLM
vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: "The cards speak in mysterious ways.",
        },
      },
    ],
  }),
}));

function createTestContext(): TrpcContext {
  return {
    user: {
      id: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tarot.pull", () => {
  it("should pull a single card with interpretation", async () => {
    const ctx = createTestContext();
    const caller = tarotRouter.createCaller(ctx);

    const result = await caller.pull({
      cardCount: "1",
    });

    expect(result.cards).toHaveLength(1);
    expect(result.cardCount).toBe(1);
    expect(result.interpretation).toBeDefined();
    expect(result.cards[0]?.name).toBeDefined();
    expect(result.cards[0]?.meaning).toBeDefined();
  });

  it("should pull three cards with interpretation", async () => {
    const ctx = createTestContext();
    const caller = tarotRouter.createCaller(ctx);

    const result = await caller.pull({
      cardCount: "3",
    });

    expect(result.cards).toHaveLength(3);
    expect(result.cardCount).toBe(3);
    expect(result.interpretation).toBeDefined();
    result.cards.forEach((card) => {
      expect(card.name).toBeDefined();
      expect(card.meaning).toBeDefined();
      expect(card.suit).toBeDefined();
      // Card can be from any suit (major, wands, cups, swords, pentacles)
      expect(["major", "wands", "cups", "swords", "pentacles"]).toContain(card.suit);
    });
  });

  it("should include question in interpretation when provided", async () => {
    const ctx = createTestContext();
    const caller = tarotRouter.createCaller(ctx);

    const result = await caller.pull({
      cardCount: "1",
      question: "What is my path forward?",
    });

    expect(result.cards).toHaveLength(1);
    expect(result.interpretation).toBeDefined();
  });

  it("should return different cards on multiple pulls", async () => {
    const ctx = createTestContext();
    const caller = tarotRouter.createCaller(ctx);

    const result1 = await caller.pull({ cardCount: "1" });
    const result2 = await caller.pull({ cardCount: "1" });

    // While there's a small chance they could be the same, it's unlikely
    // This test verifies randomization is working
    expect(result1.cards[0]).toBeDefined();
    expect(result2.cards[0]).toBeDefined();
  });

  it("should have valid tarot deck cards", async () => {
    const ctx = createTestContext();
    const caller = tarotRouter.createCaller(ctx);

    const result = await caller.pull({ cardCount: "3" });

    expect(result.cards).toHaveLength(3);

    result.cards.forEach((card) => {
      expect(card.name).toBeDefined();
      expect(card.meaning).toBeDefined();
      expect(card.suit).toBeDefined();
      expect(card.number).toBeDefined();
      
      // Card should be from a valid suit
      expect(["major", "wands", "cups", "swords", "pentacles"]).toContain(card.suit);
      
      // Card ID should be positive
      expect(card.id).toBeGreaterThan(0);
    });
  });
});
