import { describe, it, expect, beforeEach, vi } from "vitest";
import { llmCache, cachedLLMCall, getCacheHealth } from "./_core/llmCache";

describe("LLM Cache", () => {
  beforeEach(() => {
    llmCache.clear();
  });

  describe("Basic Cache Operations", () => {
    it("should cache and retrieve values", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value);
      const retrieved = llmCache.get(prompt);

      expect(retrieved).toEqual(value);
    });

    it("should return null for non-existent keys", () => {
      const result = llmCache.get("non-existent");
      expect(result).toBeNull();
    });

    it("should delete cache entries", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value);
      expect(llmCache.get(prompt)).toEqual(value);

      const deleted = llmCache.delete(prompt);
      expect(deleted).toBe(true);
      expect(llmCache.get(prompt)).toBeNull();
    });

    it("should clear all cache entries", () => {
      llmCache.set("prompt1", { content: "response1" });
      llmCache.set("prompt2", { content: "response2" });

      llmCache.clear();

      expect(llmCache.get("prompt1")).toBeNull();
      expect(llmCache.get("prompt2")).toBeNull();
    });
  });

  describe("Cache with Parameters", () => {
    it("should handle cache keys with parameters", () => {
      const prompt = "Test prompt";
      const params1 = { model: "gpt-4", temp: 0.7 };
      const params2 = { model: "gpt-3.5", temp: 0.5 };
      const value1 = { content: "Response 1" };
      const value2 = { content: "Response 2" };

      llmCache.set(prompt, value1, 60000, params1);
      llmCache.set(prompt, value2, 60000, params2);

      expect(llmCache.get(prompt, params1)).toEqual(value1);
      expect(llmCache.get(prompt, params2)).toEqual(value2);
    });
  });

  describe("TTL and Expiration", () => {
    it("should expire cache entries after TTL", async () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      // Set with 100ms TTL
      llmCache.set(prompt, value, 100);
      expect(llmCache.get(prompt)).toEqual(value);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      expect(llmCache.get(prompt)).toBeNull();
    });

    it("should use default TTL of 24 hours", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value); // No TTL specified
      expect(llmCache.get(prompt)).toEqual(value);
    });
  });

  describe("Cache Statistics", () => {
    it("should track cache hits and misses", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value);

      // Miss
      llmCache.get("non-existent");
      // Hit
      llmCache.get(prompt);
      // Hit
      llmCache.get(prompt);

      const stats = llmCache.getStats();
      expect(stats.totalHits).toBe(2);
      expect(stats.totalMisses).toBe(1);
      expect(stats.hitRate).toBeCloseTo(66.67, 1);
    });

    it("should calculate hit rate correctly", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value);

      // 3 hits
      llmCache.get(prompt);
      llmCache.get(prompt);
      llmCache.get(prompt);

      const stats = llmCache.getStats();
      expect(stats.hitRate).toBe(100);
    });

    it("should return 0 hit rate when no requests", () => {
      const stats = llmCache.getStats();
      expect(stats.hitRate).toBe(0);
    });
  });

  describe("Cache Cleanup", () => {
    it("should clean up expired entries", async () => {
      llmCache.set("prompt1", { content: "response1" }, 100);
      llmCache.set("prompt2", { content: "response2" }, 100);
      llmCache.set("prompt3", { content: "response3" }, 10000); // Won't expire

      await new Promise((resolve) => setTimeout(resolve, 150));

      const removed = llmCache.cleanup();
      expect(removed).toBe(2);
      expect(llmCache.get("prompt3")).toEqual({ content: "response3" });
    });
  });

  describe("Cache Size", () => {
    it("should calculate cache size in bytes", () => {
      const prompt = "Test prompt";
      const value = { content: "Test response" };

      llmCache.set(prompt, value);
      const size = llmCache.getSize();

      expect(size).toBeGreaterThan(0);
    });
  });

  describe("Top Entries", () => {
    it("should return most frequently accessed entries", () => {
      llmCache.set("prompt1", { content: "response1" });
      llmCache.set("prompt2", { content: "response2" });

      // Access prompt1 three times
      llmCache.get("prompt1");
      llmCache.get("prompt1");
      llmCache.get("prompt1");

      // Access prompt2 once
      llmCache.get("prompt2");

      const topEntries = llmCache.getTopEntries(2);
      expect(topEntries.length).toBe(2);
      expect(topEntries[0]?.hits).toBe(3);
      expect(topEntries[1]?.hits).toBe(1);
    });
  });

  describe("Cached LLM Call Wrapper", () => {
    it("should cache LLM responses", async () => {
      const mockLLM = vi.fn().mockResolvedValue({ content: "LLM response" });

      const prompt = "Test prompt";

      // First call - should call LLM
      const result1 = await cachedLLMCall(prompt, mockLLM, 60000);
      expect(result1).toEqual({ content: "LLM response" });
      expect(mockLLM).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await cachedLLMCall(prompt, mockLLM, 60000);
      expect(result2).toEqual({ content: "LLM response" });
      expect(mockLLM).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it("should call LLM when cache misses", async () => {
      const mockLLM = vi.fn().mockResolvedValue({ content: "LLM response" });

      const prompt = "Test prompt";
      await cachedLLMCall(prompt, mockLLM, 60000);

      expect(mockLLM).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cache Health", () => {
    it("should return cache health information", () => {
      llmCache.set("prompt1", { content: "response1" });
      llmCache.get("prompt1");

      const health = getCacheHealth();

      expect(health).toHaveProperty("stats");
      expect(health).toHaveProperty("sizeBytes");
      expect(health).toHaveProperty("sizeMB");
      expect(health).toHaveProperty("topEntries");
      expect(health.stats.totalEntries).toBe(1);
      expect(health.stats.totalHits).toBe(1);
    });
  });
});
