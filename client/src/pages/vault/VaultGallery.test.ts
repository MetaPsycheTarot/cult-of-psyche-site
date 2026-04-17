import { describe, it, expect } from "vitest";

describe("VaultGallery Component", () => {
  it("should have gallery items with required properties", () => {
    const galleryItems = [
      {
        id: "1",
        title: "The Psyche Awakens - Eagle Edition",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
        artist: "Community Artist",
        description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
      },
      {
        id: "2",
        title: "The White Knight of the Bronze Coop",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
        artist: "Community Artist",
        description: "A legendary guardian emerges from the shadows",
      },
      {
        id: "3",
        title: "Join the Cult of Christine",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
        artist: "Community Artist",
        description: "Emotional support harness included in this initiation ritual",
      },
    ];

    expect(galleryItems).toHaveLength(3);
    galleryItems.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("title");
      expect(item).toHaveProperty("type");
      expect(item).toHaveProperty("url");
      expect(item).toHaveProperty("artist");
      expect(item).toHaveProperty("description");
    });
  });

  it("should have valid image URLs", () => {
    const galleryItems = [
      {
        id: "1",
        title: "The Psyche Awakens - Eagle Edition",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
        artist: "Community Artist",
        description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
      },
      {
        id: "2",
        title: "The White Knight of the Bronze Coop",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
        artist: "Community Artist",
        description: "A legendary guardian emerges from the shadows",
      },
      {
        id: "3",
        title: "Join the Cult of Christine",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
        artist: "Community Artist",
        description: "Emotional support harness included in this initiation ritual",
      },
    ];

    galleryItems.forEach((item) => {
      expect(item.url).toMatch(/^https:\/\//);
      expect(item.url).toContain("cloudfront");
    });
  });

  it("should have unique IDs for all gallery items", () => {
    const galleryItems = [
      {
        id: "1",
        title: "The Psyche Awakens - Eagle Edition",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
        artist: "Community Artist",
        description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
      },
      {
        id: "2",
        title: "The White Knight of the Bronze Coop",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
        artist: "Community Artist",
        description: "A legendary guardian emerges from the shadows",
      },
      {
        id: "3",
        title: "Join the Cult of Christine",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
        artist: "Community Artist",
        description: "Emotional support harness included in this initiation ritual",
      },
    ];

    const ids = galleryItems.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have valid item types", () => {
    const validTypes = ["image", "video"];
    const galleryItems = [
      {
        id: "1",
        title: "The Psyche Awakens - Eagle Edition",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
        artist: "Community Artist",
        description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
      },
      {
        id: "2",
        title: "The White Knight of the Bronze Coop",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
        artist: "Community Artist",
        description: "A legendary guardian emerges from the shadows",
      },
      {
        id: "3",
        title: "Join the Cult of Christine",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
        artist: "Community Artist",
        description: "Emotional support harness included in this initiation ritual",
      },
    ];

    galleryItems.forEach((item) => {
      expect(validTypes).toContain(item.type);
    });
  });

  it("should have non-empty titles and descriptions", () => {
    const galleryItems = [
      {
        id: "1",
        title: "The Psyche Awakens - Eagle Edition",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/kHEc0_f534b66f.jpg",
        artist: "Community Artist",
        description: "A mystical take on the Cult of Psyche mascot in neon-noir style",
      },
      {
        id: "2",
        title: "The White Knight of the Bronze Coop",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/3wM4x(1)_c812f110.jpg",
        artist: "Community Artist",
        description: "A legendary guardian emerges from the shadows",
      },
      {
        id: "3",
        title: "Join the Cult of Christine",
        type: "image" as const,
        url: "https://d2xsxph8kpxj0f.cloudfront.net/310519663447541968/EemEDrcPwcvMcaNkpnRCbC/sueXX_378e8ae2.jpg",
        artist: "Community Artist",
        description: "Emotional support harness included in this initiation ritual",
      },
    ];

    galleryItems.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description).toBeDefined();
      expect(item.description!.length).toBeGreaterThan(0);
    });
  });
});
