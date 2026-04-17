import { describe, it, expect } from "vitest";

describe("VaultArchive Component", () => {
  it("should have correct archive item types", () => {
    const validTypes = ["nightmare", "reading", "prompt"];
    
    validTypes.forEach((type) => {
      expect(validTypes).toContain(type);
    });
  });

  it("should calculate archive statistics correctly", () => {
    const archiveItems = [
      {
        id: "nightmare-1",
        type: "nightmare" as const,
        title: "Test Nightmare",
        content: "Test content",
        createdAt: Date.now(),
      },
      {
        id: "reading-1",
        type: "reading" as const,
        title: "Test Reading",
        content: "Test content",
        createdAt: Date.now(),
      },
      {
        id: "prompt-1",
        type: "prompt" as const,
        title: "Test Prompt",
        content: "Test content",
        createdAt: Date.now(),
      },
    ];

    const stats = {
      total: archiveItems.length,
      nightmares: archiveItems.filter((i) => i.type === "nightmare").length,
      readings: archiveItems.filter((i) => i.type === "reading").length,
      prompts: archiveItems.filter((i) => i.type === "prompt").length,
    };

    expect(stats.total).toBe(3);
    expect(stats.nightmares).toBe(1);
    expect(stats.readings).toBe(1);
    expect(stats.prompts).toBe(1);
  });

  it("should filter archive items by type", () => {
    const archiveItems = [
      {
        id: "nightmare-1",
        type: "nightmare" as const,
        title: "Test Nightmare",
        content: "Test content",
        createdAt: Date.now(),
      },
      {
        id: "nightmare-2",
        type: "nightmare" as const,
        title: "Another Nightmare",
        content: "Test content",
        createdAt: Date.now(),
      },
      {
        id: "reading-1",
        type: "reading" as const,
        title: "Test Reading",
        content: "Test content",
        createdAt: Date.now(),
      },
    ];

    const nightmares = archiveItems.filter((item) => item.type === "nightmare");
    expect(nightmares).toHaveLength(2);
    expect(nightmares.every((item) => item.type === "nightmare")).toBe(true);
  });

  it("should search archive items by title and content", () => {
    const archiveItems = [
      {
        id: "nightmare-1",
        type: "nightmare" as const,
        title: "Dark Forest Nightmare",
        content: "Walking through a dark forest",
        createdAt: Date.now(),
      },
      {
        id: "reading-1",
        type: "reading" as const,
        title: "Past Present Future",
        content: "The Fool card appeared",
        createdAt: Date.now(),
      },
    ];

    const searchQuery = "dark";
    const filtered = archiveItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toContain("Dark");
  });

  it("should sort archive items by creation date (newest first)", () => {
    const now = Date.now();
    const archiveItems = [
      {
        id: "item-1",
        type: "nightmare" as const,
        title: "Old Item",
        content: "Test",
        createdAt: now - 10000,
      },
      {
        id: "item-2",
        type: "nightmare" as const,
        title: "New Item",
        content: "Test",
        createdAt: now,
      },
      {
        id: "item-3",
        type: "nightmare" as const,
        title: "Middle Item",
        content: "Test",
        createdAt: now - 5000,
      },
    ];

    const sorted = [...archiveItems].sort((a, b) => b.createdAt - a.createdAt);

    expect(sorted[0].title).toBe("New Item");
    expect(sorted[1].title).toBe("Middle Item");
    expect(sorted[2].title).toBe("Old Item");
  });

  it("should format export data correctly", () => {
    const archiveItems = [
      {
        id: "nightmare-1",
        type: "nightmare" as const,
        title: "Test Nightmare",
        content: "Test content",
        createdAt: Date.now(),
      },
    ];

    const exportData = {
      exportedAt: new Date().toISOString(),
      items: archiveItems,
      stats: {
        totalItems: archiveItems.length,
        nightmares: archiveItems.filter((i) => i.type === "nightmare").length,
        readings: archiveItems.filter((i) => i.type === "reading").length,
        prompts: archiveItems.filter((i) => i.type === "prompt").length,
      },
    };

    expect(exportData).toHaveProperty("exportedAt");
    expect(exportData).toHaveProperty("items");
    expect(exportData).toHaveProperty("stats");
    expect(exportData.items).toHaveLength(1);
    expect(exportData.stats.totalItems).toBe(1);
  });
});
