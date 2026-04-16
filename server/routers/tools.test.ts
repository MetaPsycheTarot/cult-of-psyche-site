import { describe, it, expect, vi } from "vitest";
import { toolsRouter } from "./tools";
import type { TrpcContext } from "../_core/context";

// Mock the LLM module
vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            title: "The Dissolution of Self",
            scenario: "You find yourself in a room where mirrors reflect not your image, but countless versions of you, each speaking in a voice you no longer recognize. The walls breathe. Your hands become unfamiliar. Which reflection is real?",
            theme: "identity dissolution",
            intensity: "high",
          }),
        },
      },
    ],
  }),
}));

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tools.generateNightmare", () => {
  it("generates a nightmare with default parameters", async () => {
    const ctx = createAuthContext();
    const caller = toolsRouter.createCaller(ctx);

    const result = await caller.generateNightmare({});

    expect(result.success).toBe(true);
    expect(result.nightmare).toBeDefined();
    expect(result.nightmare?.title).toBe("The Dissolution of Self");
    expect(result.nightmare?.scenario).toContain("mirrors");
    expect(result.nightmare?.theme).toBe("identity dissolution");
    expect(result.nightmare?.intensity).toBe("high");
  });

  it("generates a nightmare with specific theme", async () => {
    const ctx = createAuthContext();
    const caller = toolsRouter.createCaller(ctx);

    const result = await caller.generateNightmare({
      theme: "cosmic",
    });

    expect(result.success).toBe(true);
    expect(result.nightmare).toBeDefined();
  });

  it("generates a nightmare with specific intensity", async () => {
    const ctx = createAuthContext();
    const caller = toolsRouter.createCaller(ctx);

    const result = await caller.generateNightmare({
      intensity: "low",
    });

    expect(result.success).toBe(true);
    expect(result.nightmare).toBeDefined();
  });

  it("generates a nightmare with both theme and intensity", async () => {
    const ctx = createAuthContext();
    const caller = toolsRouter.createCaller(ctx);

    const result = await caller.generateNightmare({
      theme: "void",
      intensity: "high",
    });

    expect(result.success).toBe(true);
    expect(result.nightmare).toBeDefined();
    expect(result.nightmare?.id).toMatch(/^nightmare-/);
    expect(result.nightmare?.generatedAt).toBeInstanceOf(Date);
  });
});
