import { useEffect } from "react";

interface SchemaMarkupProps {
  schema: Record<string, any>;
}

/**
 * SchemaMarkup Component
 * Injects JSON-LD schema markup into the document head for SEO enhancement.
 * Supports Organization, LocalBusiness, Event, Product, and other schema types.
 */
export function SchemaMarkup({ schema }: SchemaMarkupProps) {
  useEffect(() => {
    // Create script element for JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);

    // Append to document head
    document.head.appendChild(script);

    // Cleanup: remove script on unmount
    return () => {
      document.head.removeChild(script);
    };
  }, [schema]);

  return null;
}

/**
 * Organization Schema for Cult of Psyche
 * Provides search engines with comprehensive information about the organization
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cult of Psyche",
  alternateName: "Psyche Awakens",
  description: "Exclusive occult content, tarot readings, and esoteric wisdom community",
  url: "https://cultofpsyche.live",
  logo: "https://cultofpsyche.live/logo.png",
  sameAs: [
    "https://x.com/PsycheAwakens",
    "https://www.youtube.com/@PsychesNightmares",
    "https://www.facebook.com/profile.php?id=61584496550976",
    "https://www.instagram.com/psycheawakens",
    "https://www.tiktok.com/@cultofpsyche",
    "https://discord.gg/qU7SdW3PYX",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    email: "support@cultofpsyche.live",
  },
  founder: {
    "@type": "Person",
    name: "Psyche Awakens",
  },
  foundingDate: "2024",
  areaServed: "Worldwide",
  knowsAbout: ["Occult", "Tarot", "Esoteric Wisdom", "Spiritual Guidance"],
};

/**
 * WebSite Schema for Cult of Psyche
 * Helps search engines understand the website structure and search functionality
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cult of Psyche",
  url: "https://cultofpsyche.live",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://cultofpsyche.live/search?q={search_term_string}",
    },
    query_input: "required name=search_term_string",
  },
};

/**
 * BreadcrumbList Schema
 * Helps search engines understand site navigation structure
 */
export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
