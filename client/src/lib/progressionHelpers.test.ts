import { describe, it, expect } from "vitest";
import {
  calculateProgressionLevel,
  calculateUnlockedMilestones,
  getProgressionNarrative,
  getMilestoneMessage,
  PROGRESSION_LEVELS,
  PROGRESSION_MILESTONES,
} from "./progressionHelpers";

describe("progressionHelpers", () => {
  describe("calculateProgressionLevel", () => {
    it("should return Initiate level for 0 readings", () => {
      const result = calculateProgressionLevel(0);
      expect(result.level).toBe(1);
      expect(result.name).toBe("Initiate");
      expect(result.symbol).toBe("◆");
    });

    it("should return Seeker level for 5 readings", () => {
      const result = calculateProgressionLevel(5);
      expect(result.level).toBe(2);
      expect(result.name).toBe("Seeker");
      expect(result.symbol).toBe("◇");
    });

    it("should return Adept level for 20 readings", () => {
      const result = calculateProgressionLevel(20);
      expect(result.level).toBe(3);
      expect(result.name).toBe("Adept");
    });

    it("should return Mystic level for 50 readings", () => {
      const result = calculateProgressionLevel(50);
      expect(result.level).toBe(4);
      expect(result.name).toBe("Mystic");
    });

    it("should return Oracle level for 100 readings", () => {
      const result = calculateProgressionLevel(100);
      expect(result.level).toBe(5);
      expect(result.name).toBe("Oracle");
    });

    it("should return Sage level for 200 readings", () => {
      const result = calculateProgressionLevel(200);
      expect(result.level).toBe(6);
      expect(result.name).toBe("Sage");
    });

    it("should return Archon level for 500 readings", () => {
      const result = calculateProgressionLevel(500);
      expect(result.level).toBe(7);
      expect(result.name).toBe("Archon");
    });

    it("should calculate progress to next level correctly", () => {
      const result = calculateProgressionLevel(10);
      expect(result.progressToNext).toBeGreaterThan(0);
      expect(result.progressToNext).toBeLessThanOrEqual(100);
    });

    it("should have 100% progress at Archon level", () => {
      const result = calculateProgressionLevel(500);
      expect(result.progressToNext).toBe(100);
    });

    it("should track reading count", () => {
      const result = calculateProgressionLevel(42);
      expect(result.readingCount).toBe(42);
    });

    it("should provide next level info when not at max", () => {
      const result = calculateProgressionLevel(10);
      expect(result.nextLevel).toBeDefined();
      expect(result.nextLevel?.level).toBe(3);
    });

    it("should have null next level at Archon", () => {
      const result = calculateProgressionLevel(500);
      expect(result.nextLevel).toBeNull();
    });
  });

  describe("calculateUnlockedMilestones", () => {
    it("should unlock first reading milestone at 1 reading", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 1,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FIRST_READING);
    });

    it("should unlock five readings milestone at 5 readings", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 5,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FIVE_READINGS);
    });

    it("should unlock first comparison milestone", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 1,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FIRST_COMPARISON);
    });

    it("should unlock first share milestone", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 0,
        forumCount: 1,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FIRST_SHARE);
    });

    it("should unlock first PDF milestone", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 1,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FIRST_PDF);
    });

    it("should unlock forum contributor milestone at 5 posts", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 0,
        forumCount: 5,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.FORUM_CONTRIBUTOR);
    });

    it("should unlock reading master milestone at 100 readings", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 100,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(PROGRESSION_MILESTONES.READING_MASTER);
    });

    it("should unlock multiple milestones", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 10,
        comparisonCount: 2,
        forumCount: 3,
        pdfExportCount: 1,
      });
      expect(milestones.length).toBeGreaterThan(1);
    });

    it("should return empty array for no unlocked milestones", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toEqual([]);
    });
  });

  describe("getProgressionNarrative", () => {
    it("should return narrative for Initiate", () => {
      const narrative = getProgressionNarrative(1);
      expect(narrative).toContain("threshold");
    });

    it("should return narrative for Seeker", () => {
      const narrative = getProgressionNarrative(2);
      expect(narrative).toContain("veil");
    });

    it("should return narrative for Adept", () => {
      const narrative = getProgressionNarrative(3);
      expect(narrative).toContain("patterns");
    });

    it("should return narrative for Mystic", () => {
      const narrative = getProgressionNarrative(4);
      expect(narrative).toContain("mysteries");
    });

    it("should return narrative for Oracle", () => {
      const narrative = getProgressionNarrative(5);
      expect(narrative).toContain("oracle");
    });

    it("should return narrative for Sage", () => {
      const narrative = getProgressionNarrative(6);
      expect(narrative).toContain("Wisdom");
    });

    it("should return narrative for Archon", () => {
      const narrative = getProgressionNarrative(7);
      expect(narrative).toContain("archon");
    });

    it("should return default narrative for invalid level", () => {
      const narrative = getProgressionNarrative(999);
      expect(narrative).toBe("The journey continues...");
    });
  });

  describe("getMilestoneMessage", () => {
    it("should return message for first reading milestone", () => {
      const message = getMilestoneMessage("first_reading");
      expect(message).toContain("cards have spoken");
    });

    it("should return message for five readings milestone", () => {
      const message = getMilestoneMessage("five_readings");
      expect(message).toContain("Five times");
    });

    it("should return message for first comparison milestone", () => {
      const message = getMilestoneMessage("first_comparison");
      expect(message).toContain("pattern");
    });

    it("should return message for first share milestone", () => {
      const message = getMilestoneMessage("first_share");
      expect(message).toContain("community");
    });

    it("should return message for first PDF milestone", () => {
      const message = getMilestoneMessage("first_pdf");
      expect(message).toContain("inscribed");
    });

    it("should return message for forum contributor milestone", () => {
      const message = getMilestoneMessage("forum_contributor");
      expect(message).toContain("guide");
    });

    it("should return message for reading master milestone", () => {
      const message = getMilestoneMessage("reading_master");
      expect(message).toContain("hundred");
    });

    it("should return default message for invalid milestone", () => {
      const message = getMilestoneMessage("invalid_milestone");
      expect(message).toBe("A milestone has been reached.");
    });
  });

  describe("PROGRESSION_LEVELS", () => {
    it("should have 7 progression levels", () => {
      expect(Object.keys(PROGRESSION_LEVELS)).toHaveLength(7);
    });

    it("should have correct level numbers", () => {
      expect(PROGRESSION_LEVELS.INITIATE.level).toBe(1);
      expect(PROGRESSION_LEVELS.SEEKER.level).toBe(2);
      expect(PROGRESSION_LEVELS.ADEPT.level).toBe(3);
      expect(PROGRESSION_LEVELS.MYSTIC.level).toBe(4);
      expect(PROGRESSION_LEVELS.ORACLE.level).toBe(5);
      expect(PROGRESSION_LEVELS.SAGE.level).toBe(6);
      expect(PROGRESSION_LEVELS.ARCHON.level).toBe(7);
    });

    it("should have increasing reading requirements", () => {
      const levels = Object.values(PROGRESSION_LEVELS);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i].minReadings).toBeGreaterThan(levels[i - 1].minReadings);
      }
    });
  });

  describe("PROGRESSION_MILESTONES", () => {
    it("should have 7 milestones", () => {
      expect(Object.keys(PROGRESSION_MILESTONES)).toHaveLength(7);
    });

    it("should have unique milestone IDs", () => {
      const ids = Object.values(PROGRESSION_MILESTONES).map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have symbols for all milestones", () => {
      Object.values(PROGRESSION_MILESTONES).forEach((milestone) => {
        expect(milestone.symbol).toBeDefined();
        expect(milestone.symbol.length).toBeGreaterThan(0);
      });
    });
  });
});
