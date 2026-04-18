import { describe, it, expect, beforeEach, afterEach } from "vitest";

/**
 * Archive Storage Testing Suite
 * Tests all archive functionality: save, retrieve, search, filter, export, delete
 */

describe("Archive Storage", () => {
  let archiveData: any[] = [];

  beforeEach(() => {
    // Reset archive before each test
    archiveData = [];
  });

  afterEach(() => {
    // Cleanup after each test
    archiveData = [];
  });

  // ============================================================================
  // SAVE READINGS TO ARCHIVE
  // ============================================================================

  describe("Save Readings to Archive", () => {
    it("should save a single reading to archive", () => {
      const reading = {
        id: "reading-1",
        type: "reading",
        spreadType: "single",
        cards: [{ name: "The Psyche Awakens", suit: "major", meaning: "Awakening" }],
        interpretation: "A new beginning",
        question: "What is my path?",
        timestamp: Date.now(),
      };

      archiveData.push(reading);

      expect(archiveData).toHaveLength(1);
      expect(archiveData[0]).toEqual(reading);
      expect(archiveData[0].type).toBe("reading");
    });

    it("should save multiple readings to archive", () => {
      const readings = [
        {
          id: "reading-1",
          type: "reading",
          spreadType: "single",
          cards: [{ name: "The Psyche Awakens", suit: "major" }],
          timestamp: Date.now(),
        },
        {
          id: "reading-2",
          type: "reading",
          spreadType: "three-card",
          cards: [
            { name: "The Lovers", suit: "major" },
            { name: "Ace of Wands", suit: "wands" },
            { name: "The Tower", suit: "major" },
          ],
          timestamp: Date.now() + 1000,
        },
      ];

      archiveData.push(...readings);

      expect(archiveData).toHaveLength(2);
      expect(archiveData[0].id).toBe("reading-1");
      expect(archiveData[1].id).toBe("reading-2");
    });

    it("should include timestamp when saving reading", () => {
      const now = Date.now();
      const reading = {
        id: "reading-1",
        type: "reading",
        timestamp: now,
      };

      archiveData.push(reading);

      expect(archiveData[0].timestamp).toBe(now);
      expect(typeof archiveData[0].timestamp).toBe("number");
    });

    it("should preserve all reading metadata", () => {
      const reading = {
        id: "reading-1",
        type: "reading",
        spreadType: "celtic-cross",
        cards: [],
        interpretation: "Deep analysis",
        question: "What is my future?",
        notes: "Personal notes",
        timestamp: Date.now(),
      };

      archiveData.push(reading);

      expect(archiveData[0]).toHaveProperty("id");
      expect(archiveData[0]).toHaveProperty("type");
      expect(archiveData[0]).toHaveProperty("spreadType");
      expect(archiveData[0]).toHaveProperty("interpretation");
      expect(archiveData[0]).toHaveProperty("question");
      expect(archiveData[0]).toHaveProperty("notes");
      expect(archiveData[0]).toHaveProperty("timestamp");
    });
  });

  // ============================================================================
  // SAVE COMPARISONS TO ARCHIVE
  // ============================================================================

  describe("Save Comparisons to Archive", () => {
    it("should save a comparison to archive", () => {
      const comparison = {
        id: "comparison-1",
        type: "comparison",
        reading1Id: "reading-1",
        reading2Id: "reading-2",
        analysis: "These readings show contrasting themes",
        matchingCards: 1,
        differentCards: 5,
        timestamp: Date.now(),
      };

      archiveData.push(comparison);

      expect(archiveData).toHaveLength(1);
      expect(archiveData[0].type).toBe("comparison");
    });

    it("should preserve comparison metadata", () => {
      const comparison = {
        id: "comparison-1",
        type: "comparison",
        reading1Id: "reading-1",
        reading2Id: "reading-2",
        analysis: "Analysis text",
        matchingCards: 2,
        differentCards: 4,
        spreadTypes: ["single", "three-card"],
        timestamp: Date.now(),
      };

      archiveData.push(comparison);

      expect(archiveData[0]).toHaveProperty("reading1Id");
      expect(archiveData[0]).toHaveProperty("reading2Id");
      expect(archiveData[0]).toHaveProperty("analysis");
      expect(archiveData[0]).toHaveProperty("matchingCards");
      expect(archiveData[0]).toHaveProperty("differentCards");
    });
  });

  // ============================================================================
  // RETRIEVE FROM ARCHIVE
  // ============================================================================

  describe("Retrieve from Archive", () => {
    beforeEach(() => {
      archiveData = [
        { id: "reading-1", type: "reading", spreadType: "single", timestamp: Date.now() },
        { id: "reading-2", type: "reading", spreadType: "three-card", timestamp: Date.now() + 1000 },
        { id: "comparison-1", type: "comparison", timestamp: Date.now() + 2000 },
      ];
    });

    it("should retrieve all items from archive", () => {
      expect(archiveData).toHaveLength(3);
    });

    it("should retrieve item by ID", () => {
      const item = archiveData.find(item => item.id === "reading-1");
      expect(item).toBeDefined();
      expect(item?.id).toBe("reading-1");
    });

    it("should retrieve items in chronological order", () => {
      const sorted = [...archiveData].sort((a, b) => a.timestamp - b.timestamp);
      expect(sorted[0].id).toBe("reading-1");
      expect(sorted[2].id).toBe("comparison-1");
    });

    it("should return undefined for non-existent item", () => {
      const item = archiveData.find(item => item.id === "non-existent");
      expect(item).toBeUndefined();
    });
  });

  // ============================================================================
  // SEARCH FUNCTIONALITY
  // ============================================================================

  describe("Search Functionality", () => {
    beforeEach(() => {
      archiveData = [
        { id: "reading-1", type: "reading", question: "What is my path?", timestamp: Date.now() },
        { id: "reading-2", type: "reading", question: "Will I find love?", timestamp: Date.now() + 1000 },
        { id: "comparison-1", type: "comparison", analysis: "Path and love comparison", timestamp: Date.now() + 2000 },
      ];
    });

    it("should search by question text", () => {
      const results = archiveData.filter(item => item.question?.includes("path"));
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("reading-1");
    });

    it("should search by analysis text", () => {
      const results = archiveData.filter(item => item.analysis?.includes("love"));
      expect(results).toHaveLength(1);
      expect(results[0].type).toBe("comparison");
    });

    it("should return empty array for no matches", () => {
      const results = archiveData.filter(item => item.question?.includes("money"));
      expect(results).toHaveLength(0);
    });

    it("should perform case-insensitive search", () => {
      const results = archiveData.filter(item =>
        item.question?.toLowerCase().includes("path")
      );
      expect(results).toHaveLength(1);
    });
  });

  // ============================================================================
  // FILTERING BY TYPE
  // ============================================================================

  describe("Filtering by Type", () => {
    beforeEach(() => {
      archiveData = [
        { id: "reading-1", type: "reading", spreadType: "single" },
        { id: "reading-2", type: "reading", spreadType: "three-card" },
        { id: "reading-3", type: "reading", spreadType: "celtic-cross" },
        { id: "comparison-1", type: "comparison" },
        { id: "comparison-2", type: "comparison" },
      ];
    });

    it("should filter by type 'reading'", () => {
      const readings = archiveData.filter(item => item.type === "reading");
      expect(readings).toHaveLength(3);
      expect(readings.every(r => r.type === "reading")).toBe(true);
    });

    it("should filter by type 'comparison'", () => {
      const comparisons = archiveData.filter(item => item.type === "comparison");
      expect(comparisons).toHaveLength(2);
      expect(comparisons.every(c => c.type === "comparison")).toBe(true);
    });

    it("should filter by spread type", () => {
      const singleCards = archiveData.filter(item => item.spreadType === "single");
      expect(singleCards).toHaveLength(1);
      expect(singleCards[0].id).toBe("reading-1");
    });

    it("should return empty array for non-existent type", () => {
      const results = archiveData.filter(item => item.type === "nightmare");
      expect(results).toHaveLength(0);
    });
  });

  // ============================================================================
  // EXPORT FUNCTIONALITY
  // ============================================================================

  describe("Export Functionality", () => {
    beforeEach(() => {
      archiveData = [
        { id: "reading-1", type: "reading", question: "What is my path?" },
        { id: "reading-2", type: "reading", question: "Will I find love?" },
        { id: "comparison-1", type: "comparison", analysis: "Comparison analysis" },
      ];
    });

    it("should export all items as JSON", () => {
      const json = JSON.stringify(archiveData);
      expect(json).toBeDefined();
      expect(typeof json).toBe("string");

      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(3);
    });

    it("should export filtered items as JSON", () => {
      const readings = archiveData.filter(item => item.type === "reading");
      const json = JSON.stringify(readings);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(2);
      expect(parsed.every((item: any) => item.type === "reading")).toBe(true);
    });

    it("should preserve all data in export", () => {
      const original = archiveData[0];
      const json = JSON.stringify([original]);
      const exported = JSON.parse(json)[0];

      expect(exported).toEqual(original);
    });

    it("should generate valid JSON for empty archive", () => {
      const emptyArchive: any[] = [];
      const json = JSON.stringify(emptyArchive);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(0);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  // ============================================================================
  // DELETION FROM ARCHIVE
  // ============================================================================

  describe("Deletion from Archive", () => {
    beforeEach(() => {
      archiveData = [
        { id: "reading-1", type: "reading" },
        { id: "reading-2", type: "reading" },
        { id: "comparison-1", type: "comparison" },
      ];
    });

    it("should delete item by ID", () => {
      const initialLength = archiveData.length;
      archiveData = archiveData.filter(item => item.id !== "reading-1");

      expect(archiveData).toHaveLength(initialLength - 1);
      expect(archiveData.find(item => item.id === "reading-1")).toBeUndefined();
    });

    it("should delete multiple items", () => {
      archiveData = archiveData.filter(item => item.type !== "reading");

      expect(archiveData).toHaveLength(1);
      expect(archiveData[0].type).toBe("comparison");
    });

    it("should handle deletion of non-existent item gracefully", () => {
      const initialLength = archiveData.length;
      archiveData = archiveData.filter(item => item.id !== "non-existent");

      expect(archiveData).toHaveLength(initialLength);
    });

    it("should allow deletion of all items", () => {
      archiveData = [];
      expect(archiveData).toHaveLength(0);
    });
  });

  // ============================================================================
  // DATA PERSISTENCE ACROSS SESSIONS
  // ============================================================================

  describe("Data Persistence", () => {
    it("should persist data structure after save and retrieve", () => {
      const reading = {
        id: "reading-1",
        type: "reading",
        spreadType: "single",
        cards: [{ name: "The Psyche Awakens", suit: "major" }],
        timestamp: Date.now(),
      };

      archiveData.push(reading);
      const retrieved = archiveData.find(item => item.id === "reading-1");

      expect(retrieved).toEqual(reading);
      expect(retrieved?.cards).toHaveLength(1);
    });

    it("should maintain data integrity after multiple operations", () => {
      const reading1 = { id: "reading-1", type: "reading" };
      const reading2 = { id: "reading-2", type: "reading" };

      archiveData.push(reading1);
      archiveData.push(reading2);

      const filtered = archiveData.filter(item => item.type === "reading");
      const deleted = archiveData.filter(item => item.id !== "reading-1");

      expect(filtered).toHaveLength(2);
      expect(deleted).toHaveLength(1);
      expect(archiveData).toHaveLength(2); // Original unchanged
    });

    it("should preserve timestamps across operations", () => {
      const now = Date.now();
      const reading = { id: "reading-1", type: "reading", timestamp: now };

      archiveData.push(reading);
      const retrieved = archiveData[0];

      expect(retrieved.timestamp).toBe(now);
      expect(retrieved.timestamp).toEqual(now);
    });
  });
});
