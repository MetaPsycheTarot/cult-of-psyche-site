import { describe, expect, it } from "vitest";
import { TAROT_DECK } from "../data/tarotDeck";

describe("tarot search filtering", () => {
  it("filters cards by name", () => {
    const query = "psyche";
    const results = TAROT_DECK.filter((card) =>
      card.name.toLowerCase().includes(query.toLowerCase())
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((card) => card.name.toLowerCase().includes("psyche"))).toBe(true);
  });

  it("filters cards by meaning", () => {
    const query = "stream";
    const results = TAROT_DECK.filter((card) =>
      card.meaning.toLowerCase().includes(query.toLowerCase())
    );

    expect(results.length).toBeGreaterThan(0);
  });

  it("filters cards by interpretation", () => {
    const query = "clarity";
    const results = TAROT_DECK.filter((card) =>
      card.interpretation.toLowerCase().includes(query.toLowerCase())
    );

    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for non-matching query", () => {
    const query = "xyzabc123notacard";
    const results = TAROT_DECK.filter(
      (card) =>
        card.name.toLowerCase().includes(query.toLowerCase()) ||
        card.meaning.toLowerCase().includes(query.toLowerCase()) ||
        card.interpretation.toLowerCase().includes(query.toLowerCase())
    );

    expect(results).toHaveLength(0);
  });

  it("case-insensitive search works", () => {
    const query = "ORACLE";
    const results = TAROT_DECK.filter((card) =>
      card.name.toLowerCase().includes(query.toLowerCase())
    );

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((card) => card.name.includes("Oracle"))).toBe(true);
  });

  it("partial word search works", () => {
    const query = "wand";
    const results = TAROT_DECK.filter((card) => card.suit.includes(query));

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((card) => card.suit === "wands")).toBe(true);
  });

  it("search across all 78 cards", () => {
    expect(TAROT_DECK).toHaveLength(78);

    // Test that we can search all cards
    const allSearchable = TAROT_DECK.every(
      (card) => card.name && card.meaning && card.interpretation
    );

    expect(allSearchable).toBe(true);
  });
});
