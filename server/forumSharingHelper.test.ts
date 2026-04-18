import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
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
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Import after localStorage is mocked
import {
  createComparisonForumPost,
  generateComparisonPostContent,
  saveForumPost,
  getForumPosts,
  getComparisonForumPosts,
  isComparisonAlreadyShared,
  getForumPostForComparison,
  deleteForumPost,
  updateForumPost,
  type ForumPost,
} from '../client/src/lib/forumSharingHelper';
import type { ComparisonAnalysis } from '../client/src/lib/comparisonAnalysisStorage';

describe('Forum Sharing Helper', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const mockComparison: ComparisonAnalysis = {
    id: 'comp-1',
    reading1Id: 'r1',
    reading2Id: 'r2',
    reading1SpreadType: '3-Card',
    reading2SpreadType: 'Celtic Cross',
    analysis: 'This is a test analysis about the two readings.',
    matchingCards: 2,
    differentCards: 3,
    sameOrientations: 1,
    differentOrientations: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  describe('createComparisonForumPost', () => {
    it('should create a forum post from a comparison analysis', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );

      expect(post).toBeDefined();
      expect(post.author).toBe('TestUser');
      expect(post.authorId).toBe('user-123');
      expect(post.category).toBe('insights');
      expect(post.sourceType).toBe('comparison');
      expect(post.sourceId).toBe(mockComparison.id);
      expect(post.title).toContain('3-Card');
      expect(post.title).toContain('Celtic Cross');
    });

    it('should use custom title if provided', () => {
      const customTitle = 'My Custom Comparison Title';
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123',
        customTitle
      );

      expect(post.title).toBe(customTitle);
    });

    it('should use custom content if provided', () => {
      const customContent = 'This is my custom content.';
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123',
        undefined,
        customContent
      );

      expect(post.content).toBe(customContent);
    });

    it('should generate default content with comparison metrics', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );

      expect(post.content).toContain('3-Card');
      expect(post.content).toContain('Celtic Cross');
      expect(post.content).toContain('Matching Cards: 2');
      expect(post.content).toContain('Different Cards: 3');
    });
  });

  describe('generateComparisonPostContent', () => {
    it('should generate formatted content with spread types and metrics', () => {
      const content = generateComparisonPostContent(mockComparison);

      expect(content).toContain('3-Card');
      expect(content).toContain('Celtic Cross');
      expect(content).toContain('Matching Cards: 2');
      expect(content).toContain('Different Cards: 3');
      expect(content).toContain('Same Orientation: 1');
      expect(content).toContain('Different Orientation: 1');
      expect(content).toContain(mockComparison.analysis);
    });

    it('should include AI insights in the content', () => {
      const content = generateComparisonPostContent(mockComparison);
      expect(content).toContain('This is a test analysis about the two readings.');
    });
  });

  describe('saveForumPost', () => {
    it('should save a forum post to localStorage', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );

      const success = saveForumPost(post);
      expect(success).toBe(true);

      const stored = localStorage.getItem('forumPosts');
      expect(stored).toBeDefined();
      const posts = JSON.parse(stored!);
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe(post.id);
    });

    it('should add new posts to the beginning of the list', () => {
      const post1 = createComparisonForumPost(
        mockComparison,
        'User1',
        'user-1'
      );
      const post2 = createComparisonForumPost(
        mockComparison,
        'User2',
        'user-2'
      );

      saveForumPost(post1);
      saveForumPost(post2);

      const posts = getForumPosts();
      expect(posts[0].id).toBe(post2.id);
      expect(posts[1].id).toBe(post1.id);
    });
  });

  describe('getForumPosts', () => {
    it('should return empty array when no posts exist', () => {
      const posts = getForumPosts();
      expect(posts).toEqual([]);
    });

    it('should return all saved forum posts', () => {
      const post1 = createComparisonForumPost(mockComparison, 'User1', 'user-1');
      const post2 = createComparisonForumPost(mockComparison, 'User2', 'user-2');

      saveForumPost(post1);
      saveForumPost(post2);

      const posts = getForumPosts();
      expect(posts).toHaveLength(2);
    });
  });

  describe('getComparisonForumPosts', () => {
    it('should return only comparison-sourced posts', () => {
      const comparisonPost = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );

      // Create a manual post without sourceType
      const manualPost: ForumPost = {
        id: 'manual-1',
        author: 'ManualUser',
        authorId: 'manual-user',
        title: 'Manual Post',
        content: 'This is a manual post',
        createdAt: Date.now(),
        likes: 0,
        replies: 0,
        category: 'general',
      };

      saveForumPost(comparisonPost);
      saveForumPost(manualPost);

      const comparisonPosts = getComparisonForumPosts();
      expect(comparisonPosts).toHaveLength(1);
      expect(comparisonPosts[0].sourceType).toBe('comparison');
    });
  });

  describe('isComparisonAlreadyShared', () => {
    it('should return false when comparison has not been shared', () => {
      const isShared = isComparisonAlreadyShared('comp-1');
      expect(isShared).toBe(false);
    });

    it('should return true when comparison has been shared', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );
      saveForumPost(post);

      const isShared = isComparisonAlreadyShared(mockComparison.id);
      expect(isShared).toBe(true);
    });
  });

  describe('getForumPostForComparison', () => {
    it('should return null when comparison has not been shared', () => {
      const post = getForumPostForComparison('comp-1');
      expect(post).toBeNull();
    });

    it('should return the forum post for a shared comparison', () => {
      const forumPost = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );
      saveForumPost(forumPost);

      const retrieved = getForumPostForComparison(mockComparison.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(forumPost.id);
      expect(retrieved?.sourceId).toBe(mockComparison.id);
    });
  });

  describe('deleteForumPost', () => {
    it('should return false when post does not exist', () => {
      const success = deleteForumPost('non-existent');
      expect(success).toBe(false);
    });

    it('should delete an existing forum post', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );
      saveForumPost(post);

      const deleted = deleteForumPost(post.id);
      expect(deleted).toBe(true);

      const remaining = getForumPosts();
      expect(remaining).toHaveLength(0);
    });
  });

  describe('updateForumPost', () => {
    it('should return false when post does not exist', () => {
      const success = updateForumPost('non-existent', { likes: 5 });
      expect(success).toBe(false);
    });

    it('should update an existing forum post', () => {
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );
      saveForumPost(post);

      const updated = updateForumPost(post.id, { likes: 10, replies: 3 });
      expect(updated).toBe(true);

      const retrieved = getForumPostForComparison(mockComparison.id);
      expect(retrieved?.likes).toBe(10);
      expect(retrieved?.replies).toBe(3);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete sharing workflow', () => {
      // Create and save a forum post
      const post = createComparisonForumPost(
        mockComparison,
        'TestUser',
        'user-123'
      );
      const saved = saveForumPost(post);
      expect(saved).toBe(true);

      // Check if comparison is marked as shared
      expect(isComparisonAlreadyShared(mockComparison.id)).toBe(true);

      // Retrieve the post
      const retrieved = getForumPostForComparison(mockComparison.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.author).toBe('TestUser');

      // Update the post
      updateForumPost(post.id, { likes: 5 });
      const updated = getForumPostForComparison(mockComparison.id);
      expect(updated?.likes).toBe(5);

      // Delete the post
      deleteForumPost(post.id);
      expect(isComparisonAlreadyShared(mockComparison.id)).toBe(false);
    });
  });
});
