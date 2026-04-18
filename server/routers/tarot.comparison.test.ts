import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tarotRouter } from './tarot';

// Mock the LLM invocation
vi.mock('../_core/llm', () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [
      {
        message: {
          content: 'The cards reveal a profound connection between these readings, suggesting cycles of transformation and renewal.',
        },
      },
    ],
  })),
}));

describe('Tarot Router - Reading Comparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze two readings and return mystical insights', async () => {
    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    const result = await caller.analyzeReadingComparison({
      reading1: {
        cards: [
          { name: 'The Magician', suit: 'major', isReversed: false },
          { name: 'The High Priestess', suit: 'major', isReversed: true },
        ],
        spreadType: '3-Card',
        interpretation: 'A reading about manifestation and hidden knowledge.',
      },
      reading2: {
        cards: [
          { name: 'The Magician', suit: 'major', isReversed: false },
          { name: 'The Fool', suit: 'major', isReversed: false },
        ],
        spreadType: 'Single',
        interpretation: 'A reading about new beginnings and potential.',
      },
    });

    expect(result).toBeDefined();
    expect(result.analysis).toBeDefined();
    expect(typeof result.analysis).toBe('string');
    expect(result.analysis.length).toBeGreaterThan(0);
  });

  it('should handle readings with different spread types', async () => {
    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    const result = await caller.analyzeReadingComparison({
      reading1: {
        cards: [
          { name: 'The Lovers', suit: 'major', isReversed: false },
          { name: 'The Tower', suit: 'major', isReversed: true },
          { name: 'The Star', suit: 'major', isReversed: false },
          { name: 'The Moon', suit: 'major', isReversed: false },
          { name: 'The Sun', suit: 'major', isReversed: false },
        ],
        spreadType: 'Celtic Cross',
        interpretation: 'A complex reading about relationships and transformation.',
      },
      reading2: {
        cards: [
          { name: 'The Hermit', suit: 'major', isReversed: false },
          { name: 'The Wheel of Fortune', suit: 'major', isReversed: true },
          { name: 'The World', suit: 'major', isReversed: false },
        ],
        spreadType: 'Pyramid',
        interpretation: 'A reading about introspection and completion.',
      },
    });

    expect(result.analysis).toBeDefined();
    expect(typeof result.analysis).toBe('string');
  });

  it('should include card names and orientations in analysis', async () => {
    const { invokeLLM } = await import('../_core/llm');
    const mockInvoke = vi.mocked(invokeLLM);

    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    await caller.analyzeReadingComparison({
      reading1: {
        cards: [{ name: 'Justice', suit: 'major', isReversed: true }],
        spreadType: 'Single',
        interpretation: 'A reading about balance.',
      },
      reading2: {
        cards: [{ name: 'Justice', suit: 'major', isReversed: false }],
        spreadType: 'Single',
        interpretation: 'Another reading about balance.',
      },
    });

    // Verify that LLM was called with the correct card information
    expect(mockInvoke).toHaveBeenCalled();
    const callArgs = mockInvoke.mock.calls[0]?.[0];
    expect(callArgs?.messages).toBeDefined();
    const userMessage = callArgs?.messages.find((m: any) => m.role === 'user');
    expect(userMessage?.content).toContain('Justice (Reversed)');
    expect(userMessage?.content).toContain('Justice');
  });

  it('should handle reversed cards in comparison', async () => {
    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    const result = await caller.analyzeReadingComparison({
      reading1: {
        cards: [
          { name: 'The Emperor', suit: 'major', isReversed: false },
          { name: 'The Empress', suit: 'major', isReversed: true },
        ],
        spreadType: '3-Card',
        interpretation: 'Reading 1 interpretation',
      },
      reading2: {
        cards: [
          { name: 'The Emperor', suit: 'major', isReversed: true },
          { name: 'The Empress', suit: 'major', isReversed: false },
        ],
        spreadType: '3-Card',
        interpretation: 'Reading 2 interpretation',
      },
    });

    expect(result.analysis).toBeDefined();
    expect(typeof result.analysis).toBe('string');
  });

  it('should return fallback message if LLM response is invalid', async () => {
    const { invokeLLM } = await import('../_core/llm');
    const mockInvoke = vi.mocked(invokeLLM);
    
    // Mock LLM to return invalid response
    mockInvoke.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    } as any);

    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    const result = await caller.analyzeReadingComparison({
      reading1: {
        cards: [{ name: 'The Magician', suit: 'major', isReversed: false }],
        spreadType: 'Single',
        interpretation: 'Test interpretation',
      },
      reading2: {
        cards: [{ name: 'The High Priestess', suit: 'major', isReversed: false }],
        spreadType: 'Single',
        interpretation: 'Test interpretation',
      },
    });

    expect(result.analysis).toBe('The cards reveal their secrets in silence.');
  });

  it('should require authentication', async () => {
    // Create caller without user context
    const caller = tarotRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    } as any);

    try {
      await caller.analyzeReadingComparison({
        reading1: {
          cards: [{ name: 'The Magician', suit: 'major', isReversed: false }],
          spreadType: 'Single',
          interpretation: 'Test',
        },
        reading2: {
          cards: [{ name: 'The High Priestess', suit: 'major', isReversed: false }],
          spreadType: 'Single',
          interpretation: 'Test',
        },
      });
      expect.fail('Should have thrown authentication error');
    } catch (error: any) {
      expect(error.code).toBe('UNAUTHORIZED');
    }
  });

  it('should validate input schema', async () => {
    const caller = tarotRouter.createCaller({
      user: { id: 'test-user', role: 'user' },
      req: {} as any,
      res: {} as any,
    } as any);

    try {
      await caller.analyzeReadingComparison({
        reading1: {
          cards: [{ name: 'The Magician', suit: 'major', isReversed: false }],
          spreadType: 'Single',
          interpretation: 'Test',
        },
        reading2: {
          // Missing required fields
          cards: [],
        } as any,
      });
      expect.fail('Should have thrown validation error');
    } catch (error: any) {
      expect(error.code).toBe('BAD_REQUEST');
    }
  });
});
