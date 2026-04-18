/**
 * Utility functions for managing AI comparison analysis storage in localStorage
 */

export interface ComparisonAnalysis {
  id: string;
  reading1Id: string;
  reading2Id: string;
  reading1SpreadType: string;
  reading2SpreadType: string;
  analysis: string;
  matchingCards: number;
  differentCards: number;
  sameOrientations: number;
  differentOrientations: number;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'comparisonAnalyses';

/**
 * Save a new comparison analysis to localStorage
 */
export function saveComparisonAnalysis(
  reading1Id: string,
  reading2Id: string,
  reading1SpreadType: string,
  reading2SpreadType: string,
  analysis: string,
  matchingCards: number,
  differentCards: number,
  sameOrientations: number,
  differentOrientations: number
): ComparisonAnalysis {
  const analyses = getComparisonAnalyses();
  
  const newAnalysis: ComparisonAnalysis = {
    id: `comparison-${Date.now()}`,
    reading1Id,
    reading2Id,
    reading1SpreadType,
    reading2SpreadType,
    analysis,
    matchingCards,
    differentCards,
    sameOrientations,
    differentOrientations,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  analyses.push(newAnalysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  
  return newAnalysis;
}

/**
 * Get all comparison analyses from localStorage
 */
export function getComparisonAnalyses(): ComparisonAnalysis[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to parse comparison analyses from localStorage:', error);
    return [];
  }
}

/**
 * Get a specific comparison analysis by ID
 */
export function getComparisonAnalysisById(id: string): ComparisonAnalysis | null {
  const analyses = getComparisonAnalyses();
  return analyses.find(a => a.id === id) || null;
}

/**
 * Delete a comparison analysis by ID
 */
export function deleteComparisonAnalysis(id: string): boolean {
  const analyses = getComparisonAnalyses();
  const filtered = analyses.filter(a => a.id !== id);
  
  if (filtered.length === analyses.length) {
    return false; // Item not found
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Search comparison analyses by query
 */
export function searchComparisonAnalyses(query: string): ComparisonAnalysis[] {
  const analyses = getComparisonAnalyses();
  const lowerQuery = query.toLowerCase();
  
  return analyses.filter(a =>
    a.analysis.toLowerCase().includes(lowerQuery) ||
    a.reading1SpreadType.toLowerCase().includes(lowerQuery) ||
    a.reading2SpreadType.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get comparison analyses sorted by most recent first
 */
export function getComparisonAnalysesSorted(): ComparisonAnalysis[] {
  const analyses = getComparisonAnalyses();
  return analyses.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Clear all comparison analyses
 */
export function clearComparisonAnalyses(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export comparison analyses as JSON
 */
export function exportComparisonAnalyses(): string {
  const analyses = getComparisonAnalyses();
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    totalAnalyses: analyses.length,
    analyses,
  }, null, 2);
}
