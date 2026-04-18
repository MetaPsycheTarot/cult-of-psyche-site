import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage for Node.js environment
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
};

let localStorageMock = createLocalStorageMock();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Import after localStorage is mocked
import { saveComparisonAnalysis, getComparisonAnalyses, getComparisonAnalysisById, deleteComparisonAnalysis, searchComparisonAnalyses, getComparisonAnalysesSorted, clearComparisonAnalyses, exportComparisonAnalyses } from '../client/src/lib/comparisonAnalysisStorage';
import type { ComparisonAnalysis } from '../client/src/lib/comparisonAnalysisStorage';

describe('Comparison Analysis Storage', () => {
  beforeEach(() => {
    // Create fresh localStorage for each test
    localStorageMock = createLocalStorageMock();
    (global as any).localStorage = localStorageMock;
  });

  afterEach(() => {
    // Clean up after each test
    localStorageMock.clear();
  });

  describe('saveComparisonAnalysis', () => {
    it('should save a new comparison analysis', () => {
      const result = saveComparisonAnalysis(
        'reading-1',
        'reading-2',
        '3-Card',
        'Single',
        'Test analysis content',
        2,
        1,
        1,
        1
      );

      expect(result).toBeDefined();
      expect(result.id).toMatch(/^comparison-/);
      expect(result.reading1Id).toBe('reading-1');
      expect(result.reading2Id).toBe('reading-2');
      expect(result.analysis).toBe('Test analysis content');
      expect(result.matchingCards).toBe(2);
      expect(result.differentCards).toBe(1);
    });

    it('should persist to localStorage', () => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test', 1, 1, 1, 0);
      const stored = localStorage.getItem('comparisonAnalyses');
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
    });
  });

  describe('getComparisonAnalyses', () => {
    it('should return empty array when no analyses exist', () => {
      const result = getComparisonAnalyses();
      expect(result).toEqual([]);
    });

    it('should return all saved analyses', () => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'A1', 1, 1, 1, 0);
      saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'A2', 2, 2, 1, 1);

      const result = getComparisonAnalyses();
      expect(result).toHaveLength(2);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('comparisonAnalyses', 'invalid json');
      const result = getComparisonAnalyses();
      expect(result).toEqual([]);
    });
  });

  describe('getComparisonAnalysisById', () => {
    it('should return null when analysis does not exist', () => {
      const result = getComparisonAnalysisById('non-existent');
      expect(result).toBeNull();
    });

    it('should return the analysis by ID', () => {
      const saved = saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test', 1, 1, 1, 0);
      const result = getComparisonAnalysisById(saved.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(saved.id);
      expect(result?.analysis).toBe('Test');
    });
  });

  describe('deleteComparisonAnalysis', () => {
    it('should return false when analysis does not exist', () => {
      const result = deleteComparisonAnalysis('non-existent');
      expect(result).toBe(false);
    });

    it('should delete an existing analysis', () => {
      const saved = saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test', 1, 1, 1, 0);
      const result = deleteComparisonAnalysis(saved.id);
      expect(result).toBe(true);

      const remaining = getComparisonAnalyses();
      expect(remaining).toHaveLength(0);
    });

    it('should only delete the specified analysis', () => {
      const a1 = saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'A1', 1, 1, 1, 0);
      const a2 = saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'A2', 2, 2, 1, 1);

      deleteComparisonAnalysis(a1.id);

      const remaining = getComparisonAnalyses();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(a2.id);
    });
  });

  describe('searchComparisonAnalyses', () => {
    beforeEach(() => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'The Magician revealed truths', 1, 1, 1, 0);
      saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'The Fool begins a journey', 2, 2, 1, 1);
      saveComparisonAnalysis('r5', 'r6', 'Single', 'Single', 'Transformation and change', 1, 1, 1, 0);
    });

    it('should search by analysis content', () => {
      const results = searchComparisonAnalyses('Magician');
      expect(results).toHaveLength(1);
      expect(results[0].analysis).toContain('Magician');
    });

    it('should search by spread type', () => {
      const results = searchComparisonAnalyses('Pyramid');
      expect(results).toHaveLength(1);
      expect(results[0].reading1SpreadType).toBe('Pyramid');
    });

    it('should be case-insensitive', () => {
      const results = searchComparisonAnalyses('transformation');
      expect(results).toHaveLength(1);
      expect(results[0].analysis).toContain('Transformation');
    });

    it('should return empty array when no matches', () => {
      const results = searchComparisonAnalyses('nonexistent');
      expect(results).toHaveLength(0);
    });

    it('should return multiple matches', () => {
      const results = searchComparisonAnalyses('a');
      expect(results.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getComparisonAnalysesSorted', () => {
    it('should return analyses sorted by most recent first', async () => {
      const a1 = saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'First', 1, 1, 1, 0);
      
      // Add small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const a2 = saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'Second', 2, 2, 1, 1);

      const sorted = getComparisonAnalysesSorted();
      expect(sorted[0].id).toBe(a2.id);
      expect(sorted[1].id).toBe(a1.id);
    });
  });

  describe('clearComparisonAnalyses', () => {
    it('should clear all analyses', () => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test 1', 1, 1, 1, 0);
      saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'Test 2', 2, 2, 1, 1);

      clearComparisonAnalyses();
      const result = getComparisonAnalyses();
      expect(result).toHaveLength(0);
    });
  });

  describe('exportComparisonAnalyses', () => {
    it('should export all analyses as JSON', () => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test 1', 1, 1, 1, 0);
      saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'Test 2', 2, 2, 1, 1);

      const exported = exportComparisonAnalyses();
      const parsed = JSON.parse(exported);
      
      expect(parsed.totalAnalyses).toBe(2);
      expect(parsed.analyses).toHaveLength(2);
      expect(parsed.exportedAt).toBeDefined();
    });

    it('should include timestamp in export', () => {
      saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Test', 1, 1, 1, 0);
      const exported = exportComparisonAnalyses();
      const parsed = JSON.parse(exported);
      
      const timestamp = new Date(parsed.exportedAt);
      expect(timestamp.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete workflow', () => {
      const a1 = saveComparisonAnalysis('r1', 'r2', 'Single', '3-Card', 'Analysis 1', 1, 1, 1, 0);
      const a2 = saveComparisonAnalysis('r3', 'r4', 'Pyramid', 'Celtic Cross', 'Analysis 2', 2, 2, 1, 1);

      // Verify retrieval
      expect(getComparisonAnalyses()).toHaveLength(2);

      // Search
      const searchResults = searchComparisonAnalyses('Analysis 1');
      expect(searchResults).toHaveLength(1);

      // Get by ID
      const retrieved = getComparisonAnalysisById(a1.id);
      expect(retrieved?.analysis).toBe('Analysis 1');

      // Delete one
      deleteComparisonAnalysis(a1.id);
      const afterDelete = getComparisonAnalyses();
      expect(afterDelete).toHaveLength(1);

      // Export remaining
      const exported = exportComparisonAnalyses();
      const parsed = JSON.parse(exported);
      expect(parsed.totalAnalyses).toBe(1);
      expect(parsed.analyses[0].id).toBe(a2.id);
    });
  });
});
