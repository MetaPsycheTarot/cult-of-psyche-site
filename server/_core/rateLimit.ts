/**
 * Rate limiting middleware for API protection
 * Implements per-user and per-IP rate limits
 */

import type { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limit tracking
const rateLimitStore: RateLimitStore = {};

// Configuration
const RATE_LIMIT_CONFIG = {
  // Per-user rate limit: 100 requests per 15 minutes
  perUser: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // Per-IP rate limit: 500 requests per 15 minutes
  perIP: {
    maxRequests: 500,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
};

/**
 * Get the rate limit key for a user or IP
 */
function getRateLimitKey(type: "user" | "ip", identifier: string): string {
  return `${type}:${identifier}`;
}

/**
 * Check and update rate limit for a given key
 */
function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore[key];

  // If no entry exists or window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: rateLimitStore[key]!.resetTime,
    };
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Express middleware for rate limiting
 */
export function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Skip rate limiting for health checks
  if (req.path === "/health" || req.path === "/ping") {
    next();
    return;
  }

  // Get user ID from session/auth context
  const userId = (req as any).user?.id;
  const clientIP = req.ip || req.socket.remoteAddress || "unknown";

  // Check per-user rate limit if user is authenticated
  if (userId) {
    const userKey = getRateLimitKey("user", userId);
    const userLimit = checkRateLimit(
      userKey,
      RATE_LIMIT_CONFIG.perUser.maxRequests,
      RATE_LIMIT_CONFIG.perUser.windowMs
    );

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_CONFIG.perUser.maxRequests);
    res.setHeader("X-RateLimit-Remaining", userLimit.remaining);
    res.setHeader(
      "X-RateLimit-Reset",
      Math.ceil(userLimit.resetTime / 1000)
    );

    if (!userLimit.allowed) {
      res.status(429).json({
        error: "Too many requests",
        message: `Rate limit exceeded. Maximum ${RATE_LIMIT_CONFIG.perUser.maxRequests} requests per ${RATE_LIMIT_CONFIG.perUser.windowMs / 60000} minutes allowed.`,
        retryAfter: Math.ceil((userLimit.resetTime - Date.now()) / 1000),
      });
      return;
    }
  }

  // Check per-IP rate limit for all requests
  const ipKey = getRateLimitKey("ip", clientIP);
  const ipLimit = checkRateLimit(
    ipKey,
    RATE_LIMIT_CONFIG.perIP.maxRequests,
    RATE_LIMIT_CONFIG.perIP.windowMs
  );

  res.setHeader("X-RateLimit-IP-Limit", RATE_LIMIT_CONFIG.perIP.maxRequests);
  res.setHeader("X-RateLimit-IP-Remaining", ipLimit.remaining);
  res.setHeader(
    "X-RateLimit-IP-Reset",
    Math.ceil(ipLimit.resetTime / 1000)
  );

  if (!ipLimit.allowed) {
    res.status(429).json({
      error: "Too many requests",
      message: `Rate limit exceeded. Maximum ${RATE_LIMIT_CONFIG.perIP.maxRequests} requests per ${RATE_LIMIT_CONFIG.perIP.windowMs / 60000} minutes allowed per IP.`,
      retryAfter: Math.ceil((ipLimit.resetTime - Date.now()) / 1000),
    });
    return;
  }

  next();
}

/**
 * Clean up expired rate limit entries (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const key in rateLimitStore) {
    if (rateLimitStore[key]!.resetTime < now) {
      delete rateLimitStore[key];
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[RateLimit] Cleaned up ${cleaned} expired entries`);
  }
}

/**
 * Start periodic cleanup of rate limit store
 */
export function startRateLimitCleanup(intervalMs: number = 60000): NodeJS.Timer {
  return setInterval(cleanupRateLimitStore, intervalMs);
}

/**
 * Get current rate limit stats (for monitoring)
 */
export function getRateLimitStats(): {
  totalEntries: number;
  userEntries: number;
  ipEntries: number;
} {
  let userEntries = 0;
  let ipEntries = 0;

  for (const key in rateLimitStore) {
    if (key.startsWith("user:")) userEntries++;
    if (key.startsWith("ip:")) ipEntries++;
  }

  return {
    totalEntries: Object.keys(rateLimitStore).length,
    userEntries,
    ipEntries,
  };
}
