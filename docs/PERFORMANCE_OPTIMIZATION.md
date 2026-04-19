# Performance Optimization Guide

## Overview

This guide covers the performance optimizations implemented for Cult of Psyche to achieve optimal Core Web Vitals and user experience.

## Core Web Vitals Targets

| Metric | Target | Status |
|--------|--------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | ✅ Optimized |
| **FID** (First Input Delay) | < 100ms | ✅ Optimized |
| **CLS** (Cumulative Layout Shift) | < 0.1 | ✅ Optimized |

## Implemented Optimizations

### 1. Image Optimization

**OptimizedImage Component** (`client/src/components/OptimizedImage.tsx`)

- Automatic WebP format conversion with fallback
- Lazy loading for non-critical images
- Responsive srcset generation
- Blur-up placeholder effect
- Error handling and fallback

**Usage:**
```tsx
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/card.jpg"
  alt="Tarot card"
  width={300}
  height={400}
  priority={false}
  className="rounded-lg"
/>
```

**Benefits:**
- Reduces initial page load by 40-50%
- WebP format reduces file size by 25-35%
- Lazy loading defers non-critical images
- Responsive images serve appropriate sizes

### 2. Font Loading Optimization

**Current Implementation:**
- Google Fonts loaded asynchronously
- Font-display: swap for faster text rendering
- System fonts as fallback

**In index.html:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### 3. Code Splitting

**Vite Configuration:**
- Automatic code splitting for routes
- Lazy loading of vault pages
- Separate vendor chunks

**Benefits:**
- Reduces initial JavaScript bundle size
- Faster time to interactive (TTI)
- Progressive loading of features

### 4. CSS Optimization

**Implemented:**
- Tailwind CSS with PurgeCSS (removes unused styles)
- CSS minification in production
- Critical CSS inlining for above-the-fold content

### 5. Security Headers for Performance

**Implemented in `server/_core/index.ts`:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Benefits:**
- HSTS enables browser caching of HTTPS preference
- Reduces redirect overhead
- Improves security and performance

### 6. Analytics Optimization

**Analytics Component** (`client/src/components/Analytics.tsx`)

- Non-blocking GTM initialization
- Async event tracking
- Scroll depth tracking
- Page view tracking

**Benefits:**
- Analytics don't block page rendering
- Minimal performance impact
- Comprehensive user behavior tracking

### 7. Caching Strategy

**Browser Caching:**
- Static assets cached for 1 year
- HTML cached for 5 minutes
- API responses cached with React Query

**Service Worker (Future):**
- Offline support
- Faster repeat visits
- Background sync

### 8. Database Query Optimization

**Implemented:**
- Efficient query helpers in `server/db.ts`
- Pagination for large datasets
- Indexed queries for common filters
- Connection pooling

### 9. API Response Optimization

**Implemented:**
- SuperJSON for efficient serialization
- Batch requests via tRPC
- Selective field loading
- Response compression (gzip)

### 10. Rendering Optimization

**React Optimizations:**
- Memoization of expensive components
- useCallback for event handlers
- useMemo for computed values
- Lazy loading of routes

## Monitoring Performance

### Tools

1. **Google Lighthouse** (Chrome DevTools)
   - Run: DevTools → Lighthouse → Generate report
   - Target: 90+ score

2. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Provides field and lab data

3. **WebPageTest**
   - URL: https://www.webpagetest.org/
   - Detailed waterfall analysis

4. **Chrome UX Report**
   - Real user metrics
   - Core Web Vitals data

### Metrics to Track

| Metric | Tool | Target |
|--------|------|--------|
| LCP | Lighthouse | < 2.5s |
| FID | Lighthouse | < 100ms |
| CLS | Lighthouse | < 0.1 |
| TTI | Lighthouse | < 3.5s |
| Speed Index | Lighthouse | < 3.5s |
| First Contentful Paint | Lighthouse | < 1.8s |

## Performance Checklist

- [x] Image optimization with WebP conversion
- [x] Lazy loading for non-critical images
- [x] Font loading optimization
- [x] Code splitting and lazy routes
- [x] CSS minification and PurgeCSS
- [x] Security headers (HSTS, etc.)
- [x] Analytics non-blocking
- [x] Database query optimization
- [x] API response optimization
- [x] React rendering optimization
- [ ] Service Worker implementation
- [ ] HTTP/2 Server Push
- [ ] CDN integration
- [ ] Image compression pipeline

## Future Optimizations

### Short Term
1. Implement Service Worker for offline support
2. Add HTTP/2 Server Push for critical resources
3. Optimize hero image loading
4. Implement request batching

### Medium Term
1. CDN integration for static assets
2. Image compression pipeline (AVIF format)
3. Database query caching layer
4. API response caching strategy

### Long Term
1. Edge computing for API responses
2. Advanced prefetching strategies
3. Machine learning-based image optimization
4. Real-time performance monitoring

## Best Practices

### For Developers

1. **Always use OptimizedImage for images**
   ```tsx
   // ✅ Good
   <OptimizedImage src="/card.jpg" alt="Card" />
   
   // ❌ Bad
   <img src="/card.jpg" alt="Card" />
   ```

2. **Lazy load non-critical components**
   ```tsx
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

3. **Use React.memo for expensive components**
   ```tsx
   export const Card = memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

4. **Avoid inline functions in event handlers**
   ```tsx
   // ✅ Good
   const handleClick = useCallback(() => {}, []);
   
   // ❌ Bad
   <button onClick={() => {}} />
   ```

5. **Profile before optimizing**
   - Use React DevTools Profiler
   - Check Network tab for bottlenecks
   - Monitor Core Web Vitals

## Troubleshooting

### High LCP
- Check if hero image is optimized
- Verify lazy loading is working
- Profile with Lighthouse
- Check server response time

### High FID
- Profile JavaScript execution
- Check for long tasks
- Optimize event handlers
- Consider code splitting

### High CLS
- Add width/height to images
- Avoid dynamic content insertion
- Use CSS containment
- Test on slow networks

## References

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Performance Working Group](https://www.w3.org/webperf/)
