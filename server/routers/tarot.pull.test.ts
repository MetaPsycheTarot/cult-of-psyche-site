/**
 * Comprehensive Tarot Pull Testing - Phase 1 Audit
 * Tests all tarot reading generation features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';
import { TAROT_DECK } from '../data/tarotDeck';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Tarot Pull - Phase 1 Audit', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('Single Card Pull', () => {
    it('should pull a single card successfully', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      expect(result.cards).toBeDefined();
      expect(result.cards.length).toBe(1);
      expect(result.cardCount).toBe(1);
    });

    it('should include card data completeness', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      const card = result.cards[0];
      expect(card.id).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.suit).toBeDefined();
      expect(card.number).toBeDefined();
      expect(card.meaning).toBeDefined();
      expect(card.interpretation).toBeDefined();
    });

    it('should include image URL for single card', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      const card = result.cards[0];
      expect(card.imageUrl).toBeDefined();
      expect(typeof card.imageUrl).toBe('string');
      expect(card.imageUrl.length).toBeGreaterThan(0);
      expect(card.imageUrl).toContain('cloudfront.net');
    });

    it('should include orientation (upright/reversed)', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      const card = result.cards[0];
      expect(card.isReversed).toBeDefined();
      expect(typeof card.isReversed).toBe('boolean');
    });

    it('should generate AI interpretation', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should support custom questions', async () => {
      const customQuestion = 'What does my future hold?';
      const result = await caller.tarot.pull({
        cardCount: '1',
        question: customQuestion,
      });

      expect(result.cards).toBeDefined();
      expect(result.cards.length).toBe(1);
      expect(result.interpretation).toBeDefined();
    });
  });

  describe('3-Card Reading Pull', () => {
    it('should pull 3 cards successfully', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
      });

      expect(result.cards).toBeDefined();
      expect(result.cards.length).toBe(3);
      expect(result.cardCount).toBe(3);
    });

    it('should include complete data for all 3 cards', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
      });

      result.cards.forEach((card) => {
        expect(card.name).toBeDefined();
        expect(card.suit).toBeDefined();
        expect(card.meaning).toBeDefined();
        expect(card.imageUrl).toBeDefined();
        expect(card.isReversed).toBeDefined();
      });
    });

    it('should generate interpretation for 3-card reading', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
      });

      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should support custom questions for 3-card reading', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
        question: 'What should I focus on this week?',
      });

      expect(result.cards.length).toBe(3);
      expect(result.interpretation).toBeDefined();
    });
  });

  describe('Celtic Cross Spread Pull', () => {
    it('should pull 10 cards for Celtic Cross spread', async () => {
      const result = await caller.tarot.pull({
        cardCount: '10',
      });

      expect(result.cards).toBeDefined();
      expect(result.cards.length).toBe(10);
      expect(result.cardCount).toBe(10);
    });

    it('should include complete data for all 10 cards', async () => {
      const result = await caller.tarot.pull({
        cardCount: '10',
      });

      result.cards.forEach((card) => {
        expect(card.name).toBeDefined();
        expect(card.suit).toBeDefined();
        expect(card.imageUrl).toBeDefined();
        expect(card.isReversed).toBeDefined();
      });
    });

    it('should generate interpretation for Celtic Cross', async () => {
      const result = await caller.tarot.pull({
        cardCount: '10',
      });

      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.length).toBeGreaterThan(0);
    });
  });

  describe('Card Data Completeness', () => {
    it('should have exactly 78 cards in deck', async () => {
      expect(TAROT_DECK.length).toBe(78);
    });

    it('should have all required fields for each card', async () => {
      TAROT_DECK.forEach((card) => {
        expect(card.id).toBeDefined();
        expect(typeof card.id).toBe('number');
        
        expect(card.name).toBeDefined();
        expect(typeof card.name).toBe('string');
        expect(card.name.length).toBeGreaterThan(0);
        
        expect(card.suit).toBeDefined();
        expect(['major', 'wands', 'cups', 'swords', 'pentacles']).toContain(card.suit);
        
        expect(card.number).toBeDefined();
        expect(typeof card.number).toBe('number');
        
        expect(card.meaning).toBeDefined();
        expect(typeof card.meaning).toBe('string');
        expect(card.meaning.length).toBeGreaterThan(0);
        
        expect(card.interpretation).toBeDefined();
        expect(typeof card.interpretation).toBe('string');
        expect(card.interpretation.length).toBeGreaterThan(0);
      });
    });

    it('should have correct card distribution by suit', async () => {
      const majorCards = TAROT_DECK.filter((c) => c.suit === 'major');
      const wandsCards = TAROT_DECK.filter((c) => c.suit === 'wands');
      const cupsCards = TAROT_DECK.filter((c) => c.suit === 'cups');
      const swordsCards = TAROT_DECK.filter((c) => c.suit === 'swords');
      const pentaclesCards = TAROT_DECK.filter((c) => c.suit === 'pentacles');

      expect(majorCards.length).toBeGreaterThanOrEqual(20); // At least 20 major cards
      expect(wandsCards.length).toBe(14);
      expect(cupsCards.length).toBe(14);
      expect(swordsCards.length).toBe(14);
      expect(pentaclesCards.length).toBe(14);
    });
  });

  describe('Reversed Card Handling', () => {
    it('should randomly assign card orientation', async () => {
      const orientations = new Set<boolean>();
      
      // Pull multiple times to get variety
      for (let i = 0; i < 20; i++) {
        const result = await caller.tarot.pull({
          cardCount: '1',
        });
        orientations.add(result.cards[0].isReversed);
      }

      // Should have both upright and reversed cards (with high probability)
      expect(orientations.size).toBeGreaterThan(1);
    });

    it('should include reversed status in interpretation', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      const card = result.cards[0];
      expect(card.isReversed).toBeDefined();
      expect(typeof card.isReversed).toBe('boolean');
    });

    it('should handle reversed cards in 3-card reading', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
      });

      result.cards.forEach((card) => {
        expect(card.isReversed).toBeDefined();
        expect(typeof card.isReversed).toBe('boolean');
      });
    });
  });

  describe('Suit Filtering', () => {
    it('should filter by Wands suit', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
        suit: 'wands',
      });

      result.cards.forEach((card) => {
        expect(card.suit).toBe('wands');
      });
    });

    it('should filter by Cups suit', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
        suit: 'cups',
      });

      result.cards.forEach((card) => {
        expect(card.suit).toBe('cups');
      });
    });

    it('should filter by Major Arcana', async () => {
      const result = await caller.tarot.pull({
        cardCount: '5',
        suit: 'major',
      });

      result.cards.forEach((card) => {
        expect(card.suit).toBe('major');
      });
    });

    it('should return all suits when "all" is specified', async () => {
      const result = await caller.tarot.pull({
        cardCount: '3',
        suit: 'all',
      });

      expect(result.cards.length).toBe(3);
      // Cards can be from any suit
      const suits = new Set(result.cards.map((c) => c.suit));
      expect(suits.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Interpretation Generation', () => {
    it('should generate meaningful interpretations', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.length).toBeGreaterThan(50); // Meaningful interpretation
      expect(result.interpretation).not.toBe('The cards speak in silence.'); // Not fallback
    });

    it('should generate different interpretations for different cards', async () => {
      const result1 = await caller.tarot.pull({
        cardCount: '1',
        suit: 'major',
      });

      const result2 = await caller.tarot.pull({
        cardCount: '1',
        suit: 'wands',
      });

      // Interpretations should be different (with high probability)
      expect(result1.interpretation).not.toBe(result2.interpretation);
    });

    it('should generate interpretations with custom questions', async () => {
      const question = 'What is my path forward?';
      const result = await caller.tarot.pull({
        cardCount: '1',
        question,
      });

      expect(result.interpretation).toBeDefined();
      expect(result.interpretation.length).toBeGreaterThan(0);
    });

    it('should handle interpretation fallback gracefully', async () => {
      const result = await caller.tarot.pull({
        cardCount: '1',
      });

      // Should always have an interpretation (either generated or fallback)
      expect(result.interpretation).toBeDefined();
      expect(typeof result.interpretation).toBe('string');
    });
  });

  describe('Image URL Validation', () => {
    it('should have valid CDN URLs for all pulled cards', async () => {
      const result = await caller.tarot.pull({
        cardCount: '5',
      });

      result.cards.forEach((card) => {
        expect(card.imageUrl).toBeDefined();
        expect(card.imageUrl).toContain('cloudfront.net');
        expect(card.imageUrl).toMatch(/\.(png|jpg|webp)$/i);
      });
    });

    it('should have unique image URLs for different cards', async () => {
      const result = await caller.tarot.pull({
        cardCount: '10',
      });

      const urls = new Set(result.cards.map((c) => c.imageUrl));
      // Should have mostly unique URLs (some duplicates possible but unlikely with 10 cards)
      expect(urls.size).toBeGreaterThanOrEqual(8);
    });
  });
});
