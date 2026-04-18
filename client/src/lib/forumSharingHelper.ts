/**
 * Helper functions for sharing comparison analyses to the forum
 */

import type { ComparisonAnalysis } from './comparisonAnalysisStorage';

export interface ForumPost {
  id: string;
  author: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: number;
  likes: number;
  replies: number;
  category: 'insights' | 'nightmares' | 'rituals' | 'general' | 'support';
  isPinned?: boolean;
  sourceType?: 'comparison'; // Track that this came from a comparison
  sourceId?: string; // Reference to the original comparison analysis
}

/**
 * Create a forum post from a comparison analysis
 */
export function createComparisonForumPost(
  analysis: ComparisonAnalysis,
  userName: string,
  userId: string,
  customTitle?: string,
  customContent?: string
): ForumPost {
  const title = customTitle || `Tarot Comparison: ${analysis.reading1SpreadType} ↔ ${analysis.reading2SpreadType}`;
  
  const content = customContent || generateComparisonPostContent(analysis);

  return {
    id: `comparison-${Date.now()}`,
    author: userName,
    authorId: userId,
    title,
    content,
    createdAt: Date.now(),
    likes: 0,
    replies: 0,
    category: 'insights',
    sourceType: 'comparison',
    sourceId: analysis.id,
  };
}

/**
 * Generate default forum post content from a comparison analysis
 */
export function generateComparisonPostContent(analysis: ComparisonAnalysis): string {
  return `🔮 **Tarot Reading Comparison Analysis**

**Spread Types:**
- Reading 1: ${analysis.reading1SpreadType}
- Reading 2: ${analysis.reading2SpreadType}

**Card Comparison Metrics:**
- Matching Cards: ${analysis.matchingCards}
- Different Cards: ${analysis.differentCards}
- Same Orientation: ${analysis.sameOrientations}
- Different Orientation: ${analysis.differentOrientations}

**AI Insights:**
${analysis.analysis}

---
*Share your thoughts and interpretations in the replies below. What patterns do you see? How do these readings relate to your spiritual journey?*`;
}

/**
 * Save a forum post to localStorage
 */
export function saveForumPost(post: ForumPost): boolean {
  try {
    const existing = localStorage.getItem('forumPosts');
    const posts = existing ? JSON.parse(existing) : [];
    posts.unshift(post); // Add to beginning (newest first)
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Failed to save forum post:', error);
    return false;
  }
}

/**
 * Get all forum posts
 */
export function getForumPosts(): ForumPost[] {
  try {
    const stored = localStorage.getItem('forumPosts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to retrieve forum posts:', error);
    return [];
  }
}

/**
 * Get forum posts from comparison analyses
 */
export function getComparisonForumPosts(): ForumPost[] {
  const posts = getForumPosts();
  return posts.filter(post => post.sourceType === 'comparison');
}

/**
 * Check if a comparison analysis has already been shared to the forum
 */
export function isComparisonAlreadyShared(analysisId: string): boolean {
  const posts = getForumPosts();
  return posts.some(post => post.sourceId === analysisId);
}

/**
 * Get the forum post for a specific comparison analysis
 */
export function getForumPostForComparison(analysisId: string): ForumPost | null {
  const posts = getForumPosts();
  return posts.find(post => post.sourceId === analysisId) || null;
}

/**
 * Delete a forum post
 */
export function deleteForumPost(postId: string): boolean {
  try {
    const existing = localStorage.getItem('forumPosts');
    if (!existing) return false;
    
    const posts = JSON.parse(existing);
    const filtered = posts.filter((p: ForumPost) => p.id !== postId);
    localStorage.setItem('forumPosts', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete forum post:', error);
    return false;
  }
}

/**
 * Update a forum post
 */
export function updateForumPost(postId: string, updates: Partial<ForumPost>): boolean {
  try {
    const existing = localStorage.getItem('forumPosts');
    if (!existing) return false;
    
    const posts = JSON.parse(existing);
    const index = posts.findIndex((p: ForumPost) => p.id === postId);
    if (index === -1) return false;
    
    posts[index] = { ...posts[index], ...updates };
    localStorage.setItem('forumPosts', JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Failed to update forum post:', error);
    return false;
  }
}
