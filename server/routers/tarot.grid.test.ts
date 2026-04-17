import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("tarot.getAllCards", () => {
  it("returns all 78 cards with image URLs", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cards = await caller.tarot.getAllCards();

    expect(cards).toHaveLength(78);
    expect(cards[0]).toHaveProperty("id");
    expect(cards[0]).toHaveProperty("name");
    expect(cards[0]).toHaveProperty("suit");
    expect(cards[0]).toHaveProperty("imageUrl");
  });

  it("includes all four suits plus major arcana", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cards = await caller.tarot.getAllCards();
    const suits = new Set(cards.map((c) => c.suit));

    expect(suits).toContain("major");
    expect(suits).toContain("wands");
    expect(suits).toContain("cups");
    expect(suits).toContain("swords");
    expect(suits).toContain("pentacles");
  });

  it("major arcana has 22 cards", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cards = await caller.tarot.getAllCards();
    const majorCards = cards.filter((c) => c.suit === "major");

    expect(majorCards).toHaveLength(22);
  });

  it("each suit has 14 cards", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cards = await caller.tarot.getAllCards();
    const suits = ["wands", "cups", "swords", "pentacles"] as const;

    for (const suit of suits) {
      const suitCards = cards.filter((c) => c.suit === suit);
      expect(suitCards).toHaveLength(14);
    }
  });

  it("all cards have image URLs", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cards = await caller.tarot.getAllCards();

    for (const card of cards) {
      expect(card.imageUrl).toBeDefined();
      expect(typeof card.imageUrl).toBe("string");
      expect(card.imageUrl?.length).toBeGreaterThan(0);
    }
  });
});

describe("tarot.getCardsBySuit", () => {
  it("returns only cards from specified suit", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const wandsCards = await caller.tarot.getCardsBySuit({ suit: "wands" });

    expect(wandsCards).toHaveLength(14);
    expect(wandsCards.every((c) => c.suit === "wands")).toBe(true);
  });

  it("includes image URLs for suit cards", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const cupsCards = await caller.tarot.getCardsBySuit({ suit: "cups" });

    expect(cupsCards.every((c) => c.imageUrl)).toBe(true);
  });
});

describe("tarot.getCardById", () => {
  it("returns card with image URL", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const card = await caller.tarot.getCardById({ id: 1 });

    expect(card).toBeDefined();
    expect(card?.imageUrl).toBeDefined();
  });

  it("returns null for non-existent card", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const card = await caller.tarot.getCardById({ id: 9999 });

    expect(card).toBeNull();
  });
});
