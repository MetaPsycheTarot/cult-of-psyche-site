/**
 * Input validation and sanitization utilities
 * Protects against injection attacks and malformed data
 */

import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize user-generated content to prevent XSS attacks
 */
export function sanitizeHtml(content: string): string {
  if (!content || typeof content !== "string") {
    return "";
  }
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "li", "ol"],
    ALLOWED_ATTR: ["href", "title"],
  });
}

/**
 * Sanitize plain text (remove any HTML/script tags)
 */
export function sanitizeText(content: string): string {
  if (!content || typeof content !== "string") {
    return "";
  }
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Common validation schemas
 */
export const ValidationSchemas = {
  // User input
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),

  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters"),

  // Forum/comment content
  forumTitle: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .transform(sanitizeText),

  forumContent: z
    .string()
    .min(1, "Content cannot be empty")
    .max(5000, "Content must be less than 5000 characters")
    .transform(sanitizeHtml),

  // Reading/tarot content
  readingQuestion: z
    .string()
    .max(500, "Question must be less than 500 characters")
    .transform(sanitizeText)
    .optional(),

  readingInterpretation: z
    .string()
    .max(2000, "Interpretation must be less than 2000 characters")
    .transform(sanitizeHtml),

  // General
  url: z
    .string()
    .url("Invalid URL")
    .max(2048, "URL must be less than 2048 characters"),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
    .max(100, "Slug must be less than 100 characters"),

  id: z
    .string()
    .uuid("Invalid ID format"),

  positiveInt: z
    .number()
    .int("Must be an integer")
    .positive("Must be a positive number"),

  nonNegativeInt: z
    .number()
    .int("Must be an integer")
    .nonnegative("Must be a non-negative number"),
};

/**
 * Middleware to validate request body against a schema
 */
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("; ");
        throw new Error(`Validation failed: ${messages}`);
      }
      throw error;
    }
  };
}

/**
 * Create a validation error response
 */
export function createValidationError(message: string, details?: Record<string, string>) {
  return {
    error: "Validation Error",
    message,
    details,
  };
}

/**
 * Validate and sanitize forum post input
 */
export const forumPostSchema = z.object({
  title: ValidationSchemas.forumTitle,
  content: ValidationSchemas.forumContent,
  category: z.enum(["general", "readings", "lore", "help", "showcase"]),
  tags: z
    .array(z.string().max(50))
    .max(5, "Maximum 5 tags allowed")
    .optional(),
});

export type ForumPostInput = z.infer<typeof forumPostSchema>;

/**
 * Validate and sanitize reading input
 */
export const readingInputSchema = z.object({
  cardCount: z.enum(["1", "3", "5", "10"]),
  question: ValidationSchemas.readingQuestion,
  suit: z.enum(["major", "wands", "cups", "swords", "pentacles", "all"]).optional(),
});

export type ReadingInput = z.infer<typeof readingInputSchema>;

/**
 * Validate and sanitize user profile update
 */
export const profileUpdateSchema = z.object({
  username: ValidationSchemas.username.optional(),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .transform(sanitizeText)
    .optional(),
  avatar: ValidationSchemas.url.optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
