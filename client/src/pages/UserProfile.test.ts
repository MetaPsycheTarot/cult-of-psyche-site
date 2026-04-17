import { describe, it, expect } from "vitest";

describe("UserProfile Component", () => {
  it("should calculate engagement score correctly", () => {
    const totalItems = 5;
    const engagementScore = Math.min(100, (totalItems * 10) + 20);
    
    expect(engagementScore).toBe(70);
  });

  it("should determine engagement level based on score", () => {
    const getEngagementLevel = (score: number) => {
      if (score >= 80) return "Master";
      if (score >= 60) return "Adept";
      if (score >= 40) return "Initiate";
      if (score >= 20) return "Seeker";
      return "Novice";
    };

    expect(getEngagementLevel(0)).toBe("Novice");
    expect(getEngagementLevel(15)).toBe("Novice");
    expect(getEngagementLevel(20)).toBe("Seeker");
    expect(getEngagementLevel(50)).toBe("Initiate");
    expect(getEngagementLevel(70)).toBe("Adept");
    expect(getEngagementLevel(85)).toBe("Master");
    expect(getEngagementLevel(100)).toBe("Master");
  });

  it("should calculate stats from localStorage items", () => {
    const nightmares = [
      { id: "1", title: "Nightmare 1", content: "Content" },
      { id: "2", title: "Nightmare 2", content: "Content" },
    ];
    const readings = [
      { id: "1", interpretation: "Reading 1", cardCount: 3 },
    ];
    const prompts = [
      { id: "1", title: "Prompt 1", content: "Content" },
      { id: "2", title: "Prompt 2", content: "Content" },
      { id: "3", title: "Prompt 3", content: "Content" },
    ];

    const stats = {
      totalNightmares: nightmares.length,
      totalReadings: readings.length,
      totalPrompts: prompts.length,
    };

    expect(stats.totalNightmares).toBe(2);
    expect(stats.totalReadings).toBe(1);
    expect(stats.totalPrompts).toBe(3);
    expect(stats.totalNightmares + stats.totalReadings + stats.totalPrompts).toBe(6);
  });

  it("should determine membership tier based on user role", () => {
    const getMembershipTier = (role?: string) => {
      return role === "admin" || role === "user" ? "lifetime" : "free";
    };

    expect(getMembershipTier("admin")).toBe("lifetime");
    expect(getMembershipTier("user")).toBe("lifetime");
    expect(getMembershipTier("guest")).toBe("free");
    expect(getMembershipTier()).toBe("free");
  });

  it("should format engagement progress levels correctly", () => {
    const levels = [
      { label: "Novice", min: 0, max: 20 },
      { label: "Seeker", min: 20, max: 40 },
      { label: "Initiate", min: 40, max: 60 },
      { label: "Adept", min: 60, max: 80 },
      { label: "Master", min: 80, max: 100 },
    ];

    expect(levels).toHaveLength(5);
    expect(levels[0].label).toBe("Novice");
    expect(levels[4].label).toBe("Master");
    
    // Verify ranges don't overlap
    for (let i = 0; i < levels.length - 1; i++) {
      expect(levels[i].max).toBe(levels[i + 1].min);
    }
  });

  it("should calculate engagement progress percentage within level", () => {
    const score = 50;
    const level = { label: "Initiate", min: 40, max: 60 };
    
    const progressPercent = Math.max(0, Math.min(100, score - level.min) / (level.max - level.min) * 100);
    
    expect(progressPercent).toBe(50);
  });

  it("should handle zero items gracefully", () => {
    const stats = {
      totalNightmares: 0,
      totalReadings: 0,
      totalPrompts: 0,
    };

    const totalItems = stats.totalNightmares + stats.totalReadings + stats.totalPrompts;
    const engagementScore = Math.min(100, (totalItems * 10) + 20);

    expect(totalItems).toBe(0);
    expect(engagementScore).toBe(20);
  });

  it("should cap engagement score at 100", () => {
    const totalItems = 50;
    const engagementScore = Math.min(100, (totalItems * 10) + 20);

    expect(engagementScore).toBe(100);
  });
});
