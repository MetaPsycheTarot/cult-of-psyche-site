/**
 * Lazy Loading Utilities
 * Provides utilities for lazy loading components and images
 * Improves initial page load time and reduces memory usage
 */

import React, { lazy, Suspense, type ComponentType, type ReactNode } from "react";

/**
 * Create a lazy-loaded component with error boundary
 */
export function createLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
): ComponentType<P> {
  const LazyComponent = lazy(importFunc);
  const defaultFallback = fallback || "Loading...";

  return (props: P) => React.createElement(
    Suspense,
    { fallback: defaultFallback },
    React.createElement(LazyComponent, props)
  );
}

/**
 * Intersection Observer for lazy loading images
 */
export function setupImageLazyLoading() {
  if (!("IntersectionObserver" in window)) {
    // Fallback for browsers that don't support IntersectionObserver
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((img) => {
      const src = (img as HTMLImageElement).dataset.src;
      if (src) {
        (img as HTMLImageElement).src = src;
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
          img.src = src;
        }
        if (srcset) {
          img.srcset = srcset;
        }

        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll("img[data-src]");
  images.forEach((img) => imageObserver.observe(img));
}

/**
 * Intersection Observer for lazy loading elements
 */
export function setupElementLazyLoading(selector: string = "[data-lazy]") {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const elementObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        element.classList.add("visible");
        elementObserver.unobserve(element);
      }
    });
  });

  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => elementObserver.observe(element));
}

/**
 * Prefetch resources for better performance
 */
export function prefetchResource(url: string, type: "script" | "style" | "image" = "script") {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;

  if (type === "script") {
    link.as = "script";
  } else if (type === "style") {
    link.as = "style";
  } else if (type === "image") {
    link.as = "image";
  }

  document.head.appendChild(link);
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, type: "script" | "style" | "font" = "script") {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = url;

  if (type === "script") {
    link.as = "script";
  } else if (type === "style") {
    link.as = "style";
  } else if (type === "font") {
    link.as = "font";
    link.crossOrigin = "anonymous";
  }

  document.head.appendChild(link);
}

/**
 * Request idle callback with fallback
 */
export function requestIdleTask(callback: () => void, timeout: number = 2000) {
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * Debounce function for performance-sensitive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance-sensitive operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Performance monitoring utilities
 */
export const PerformanceMonitor = {
  /**
   * Mark performance checkpoint
   */
  mark(name: string) {
    if ("performance" in window && "mark" in window.performance) {
      window.performance.mark(name);
    }
  },

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark: string) {
    if ("performance" in window && "measure" in window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn(`Failed to measure ${name}:`, e);
      }
    }
  },

  /**
   * Get all measurements
   */
  getMeasurements() {
    if ("performance" in window && "getEntriesByType" in window.performance) {
      return window.performance.getEntriesByType("measure");
    }
    return [];
  },

  /**
   * Get Web Vitals
   */
  getWebVitals() {
    if ("performance" in window && "getEntriesByType" in window.performance) {
      const paintEntries = window.performance.getEntriesByType("paint");
      const navigationTiming = window.performance.getEntriesByType("navigation")[0];

      return {
        FCP: paintEntries.find((e: PerformanceEntry) => e.name === "first-contentful-paint")
          ?.startTime,
        LCP: paintEntries.find((e: PerformanceEntry) => e.name === "largest-contentful-paint")
          ?.startTime,
        TTFB:
          (navigationTiming as PerformanceNavigationTiming)?.responseStart -
          (navigationTiming as PerformanceNavigationTiming)?.fetchStart,
        DOMContentLoaded:
          (navigationTiming as PerformanceNavigationTiming)?.domContentLoadedEventEnd -
          (navigationTiming as PerformanceNavigationTiming)?.fetchStart,
        LoadComplete:
          (navigationTiming as PerformanceNavigationTiming)?.loadEventEnd -
          (navigationTiming as PerformanceNavigationTiming)?.fetchStart,
      };
    }
    return null;
  },
};
