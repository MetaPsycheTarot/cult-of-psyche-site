# Schema Markup Implementation Guide

## Overview

Schema markup (structured data) helps search engines understand your website's content and context. The Cult of Psyche website implements JSON-LD schema markup to enhance SEO visibility and enable rich snippets in search results.

## Implemented Schemas

### 1. Organization Schema

The Organization schema provides comprehensive information about the Cult of Psyche brand to search engines.

**Key Information Included:**
- Organization name and alternate names
- Description and website URL
- Logo URL
- Social media profiles (X, YouTube, Facebook, Instagram, TikTok, Discord)
- Contact information
- Founder information
- Areas of expertise (Occult, Tarot, Esoteric Wisdom, Spiritual Guidance)

**Benefits:**
- Improves brand recognition in search results
- Enables Knowledge Panel display on Google
- Links social media profiles for verification
- Establishes organization credibility

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cult of Psyche",
  "url": "https://cultofpsyche.live",
  "logo": "https://cultofpsyche.live/logo.png",
  "sameAs": [
    "https://x.com/PsycheAwakens",
    "https://www.youtube.com/@PsychesNightmares",
    "https://www.facebook.com/profile.php?id=61584496550976",
    "https://www.instagram.com/psycheawakens",
    "https://www.tiktok.com/@cultofpsyche",
    "https://discord.gg/qU7SdW3PYX"
  ]
}
```

### 2. WebSite Schema

The WebSite schema helps search engines understand your site's structure and search functionality.

**Key Information Included:**
- Website name and URL
- Search action endpoint
- Query input parameters

**Benefits:**
- Enables Sitelinks search box in search results
- Improves site navigation understanding
- Increases click-through rates from search results

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Cult of Psyche",
  "url": "https://cultofpsyche.live",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://cultofpsyche.live/search?q={search_term_string}"
    }
  }
}
```

## Implementation Details

### SchemaMarkup Component

Located in `client/src/components/SchemaMarkup.tsx`, this reusable component handles JSON-LD injection:

```typescript
import { SchemaMarkup, organizationSchema, websiteSchema } from "@/components/SchemaMarkup";

// In your component
<SchemaMarkup schema={organizationSchema} />
<SchemaMarkup schema={websiteSchema} />
```

**How it Works:**
1. Creates a `<script type="application/ld+json">` element
2. Injects the schema as JSON content
3. Appends to document head
4. Cleans up on component unmount

### Integration Points

**Home Page (`client/src/pages/Home.tsx`):**
- Organization schema injected at page load
- WebSite schema injected at page load
- Ensures schema is available to search engine crawlers

## Validation

### Testing with Google Rich Results Test

1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your URL: `https://cultofpsyche.live`
3. Verify that Organization schema is detected
4. Check for any errors or warnings

### Testing with Schema.org Validator

1. Visit [Schema.org Validator](https://validator.schema.org/)
2. Enter your URL or paste JSON-LD code
3. Verify all properties are valid
4. Check for recommended properties

## Future Enhancements

### Event Schema
For livestream events and tarot reading sessions:
```json
{
  "@type": "Event",
  "name": "Psyche's Nightmares Livestream",
  "startDate": "2026-04-20T20:00:00Z",
  "endDate": "2026-04-20T22:00:00Z",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://youtube.com/@PsychesNightmares"
  }
}
```

### Product Schema
For tarot readings and occult tools:
```json
{
  "@type": "Product",
  "name": "Tarot Reading",
  "description": "Personalized tarot reading with Psyche Awakens deck",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### BreadcrumbList Schema
For improved navigation in search results:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://cultofpsyche.live"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Vault",
      "item": "https://cultofpsyche.live/vault"
    }
  ]
}
```

## SEO Impact

Schema markup implementation provides the following SEO benefits:

| Benefit | Impact | Timeline |
|---------|--------|----------|
| Enhanced search result appearance | Increased CTR | 2-4 weeks |
| Knowledge Panel eligibility | Brand authority | 4-8 weeks |
| Rich snippets display | Better visibility | 2-4 weeks |
| Improved crawlability | Better indexing | 1-2 weeks |
| Social signal boost | Increased sharing | 4-12 weeks |

## Monitoring

### Google Search Console
1. Submit your sitemap to GSC
2. Monitor "Enhancement" reports for schema errors
3. Track "Rich Results" performance
4. Review "Core Web Vitals" metrics

### Search Rankings
- Track keyword rankings for "occult," "tarot," "psyche"
- Monitor organic traffic growth
- Analyze click-through rates from search results
- Compare performance before/after schema implementation

## References

- [Schema.org Documentation](https://schema.org/)
- [Google Structured Data Documentation](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [JSON-LD Format Guide](https://json-ld.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
