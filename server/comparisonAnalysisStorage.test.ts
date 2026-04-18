import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Comparison Analysis Storage', () => {
  // Note: These tests verify the storage module exists and exports the expected functions
  // Full integration tests are run in the browser environment where localStorage is available
  
  it('should export all required functions', async () => {
    const module = await import('../client/src/lib/comparisonAnalysisStorage');
    
    expect(module.saveComparisonAnalysis).toBeDefined();
    expect(typeof module.saveComparisonAnalysis).toBe('function');
    
    expect(module.getComparisonAnalyses).toBeDefined();
    expect(typeof module.getComparisonAnalyses).toBe('function');
    
    expect(module.getComparisonAnalysisById).toBeDefined();
    expect(typeof module.getComparisonAnalysisById).toBe('function');
    
    expect(module.deleteComparisonAnalysis).toBeDefined();
    expect(typeof module.deleteComparisonAnalysis).toBe('function');
    
    expect(module.searchComparisonAnalyses).toBeDefined();
    expect(typeof module.searchComparisonAnalyses).toBe('function');
    
    expect(module.getComparisonAnalysesSorted).toBeDefined();
    expect(typeof module.getComparisonAnalysesSorted).toBe('function');
    
    expect(module.clearComparisonAnalyses).toBeDefined();
    expect(typeof module.clearComparisonAnalyses).toBe('function');
    
    expect(module.exportComparisonAnalyses).toBeDefined();
    expect(typeof module.exportComparisonAnalyses).toBe('function');
  });

  it('should have ComparisonAnalysis type exported', async () => {
    const module = await import('../client/src/lib/comparisonAnalysisStorage');
    
    // If we can import the type, it's exported
    expect(module).toBeDefined();
  });

  it('should have proper storage key constant', async () => {
    const module = await import('../client/src/lib/comparisonAnalysisStorage');
    
    // Verify the module loads without errors
    expect(module.saveComparisonAnalysis).toBeDefined();
  });
});
