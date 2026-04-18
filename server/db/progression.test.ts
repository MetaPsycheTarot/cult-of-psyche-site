import { describe, it, expect } from "vitest";
import {
  PROGRESSION_LEVELS,
  PROGRESSION_MILESTONES,
  calculateProgressionLevel,
  calculateUnlockedMilestones,
  getProgressionNarrative,
  getMilestoneMessage,
} from "./progression";

describe("Progression System", () => {
  describe("Progression Levels", () => {
    it("should have 7 progression levels", () => {
      expect(Object.keys(PROGRESSION_LEVELS)).toHaveLength(7);
    });

    it("should have correct level structure", () => {
      const initiate = PROGRESSION_LEVELS.INITIATE;
      expect(initiate).toHaveProperty("level", 1);
      expect(initiate).toHaveProperty("name", "Initiate");
      expect(initiate).toHaveProperty("minReadings", 0);
      expect(initiate).toHaveProperty("symbol", "◆");
    });
  });

  describe("calculateProgressionLevel", () => {
    it("should return Initiate for 0 readings", () => {
      const result = calculateProgressionLevel(0);
      expect(result.level).toBe(1);
      expect(result.name).toBe("Initiate");
    });

    it("should return Seeker for 5 readings", () => {
      const result = calculateProgressionLevel(5);
      expect(result.level).toBe(2);
      expect(result.name).toBe("Seeker");
    });

    it("should return Adept for 20 readings", () => {
      const result = calculateProgressionLevel(20);
      expect(result.level).toBe(3);
      expect(result.name).toBe("Adept");
    });

    it("should return Archon for 500+ readings", () => {
      const result = calculateProgressionLevel(500);
      expect(result.level).toBe(7);
      expect(result.name).toBe("Archon");
    });

    it("should calculate progress to next level", () => {
      const result = calculateProgressionLevel(10);
      expect(result.progressToNext).toBeGreaterThan(0);
      expect(result.progressToNext).toBeLessThanOrEqual(100);
    });

    it("should show 100% progress for max level", () => {
      const result = calculateProgressionLevel(1000);
      expect(result.progressToNext).toBe(100);
    });
  });

  describe("calculateUnlockedMilestones", () => {
    it("should unlock first reading milestone", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 1,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toContainEqual(
        expect.objectContaining({ id: "first_reading" })
      );
    });

    it("should unlock multiple milestones", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 100,
        comparisonCount: 5,
        forumCount: 5,
        pdfExportCount: 3,
      });
      expect(milestones.length).toBeGreaterThan(1);
    });

    it("should not unlock milestones without requirements", () => {
      const milestones = calculateUnlockedMilestones({
        readingCount: 0,
        comparisonCount: 0,
        forumCount: 0,
        pdfExportCount: 0,
      });
      expect(milestones).toHaveLength(0);
    });
  });

  describe("getProgressionNarrative", () => {
    it("should return narrative for each level", () => {
      for (let level = 1; level <= 7; level++) {
        const narrative = getProgressionNarrative(level);
        expect(narrative).toBeTruthy();
        expect(typeof narrative).toBe("string");
      }
    });

    it("should return default narrative for invalid level", () => {
      const narrative = getProgressionNarrative(99);
      expect(narrative).toBe("The journey continues...");
    });

    it("should contain mystical language", () => {
      const narrative = getProgressionNarrative(1);
      expect(narrative.toLowerCase()).toContain("threshold");
    });
  });

  describe("getMilestoneMessage", () => {
    it("should return message for valid milestone", () => {
      const message = getMilestoneMessage("first_reading");
      expect(message).toBeTruthy();
      expect(typeof message).toBe("string");
    });

    it("should return default message for invalid milestone", () => {
      const message = getMilestoneMessage("invalid");
      expect(message).toBe("A milestone has been reached.");
    });

    it("should contain mystical language", () => {
      const message = getMilestoneMessage("first_reading");
      expect(message.toLowerCase()).toContain("cards");
    });
  });

  describe("Progression Milestones", () => {
    it("should have all required milestones", () => {
      expect(PROGRESSION_MILESTONES).toHaveProperty("FIRST_READING");
      expect(PROGRESSION_MILESTONES).toHaveProperty("FIVE_READINGS");
      expect(PROGRESSION_MILESTONES).toHaveProperty("FIRST_COMPARISON");
      expect(PROGRESSION_MILESTONES).toHaveProperty("FIRST_SHARE");
      expect(PROGRESSION_MILESTONES).toHaveProperty("FIRST_PDF");
      expect(PROGRESSION_MILESTONES).toHaveProperty("FORUM_CONTRIBUTOR");
      expect(PROGRESSION_MILESTONES).toHaveProperty("READING_MASTER");
    });

    it("should have correct milestone structure", () => {
      const milestone = PROGRESSION_MILESTONES.FIRST_READING;
      expect(milestone).toHaveProperty("id");
      expect(milestone).toHaveProperty("name");
      expect(milestone).toHaveProperty("description");
      expect(milestone).toHaveProperty("symbol");
    });
  });
});
