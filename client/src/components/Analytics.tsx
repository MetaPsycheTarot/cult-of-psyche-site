import { useEffect } from 'react';

/**
 * Analytics Component
 * Initializes Google Tag Manager and GA4 tracking
 * Tracks page views, CTA clicks, form submissions, and custom events
 */
export function Analytics() {
  useEffect(() => {
    // Initialize Google Tag Manager
    const initGTM = () => {
      // GTM Container ID - Replace with your actual GTM ID
      const GTM_ID = import.meta.env.VITE_GTM_ID || 'GTM-XXXXXX';

      // Create noscript iframe for GTM
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.insertBefore(noscript, document.body.firstChild);

      // Load GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', GTM_ID, {
        page_path: window.location.pathname,
        anonymize_ip: true,
      });

      // Make gtag globally available
      (window as any).gtag = gtag;
    };

    initGTM();

    // Track page views
    const trackPageView = () => {
      if ((window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_path: window.location.pathname,
          page_title: document.title,
        });
      }
    };

    // Track on initial load
    trackPageView();

    // Track on route changes (for SPA)
    const handlePopState = () => trackPageView();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null;
}

/**
 * Hook to track custom events
 * Usage: const trackEvent = useTrackEvent(); trackEvent('button_click', { button_name: 'signup' })
 */
export function useTrackEvent() {
  return (eventName: string, eventData?: Record<string, any>) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, eventData || {});
    }
  };
}

/**
 * Hook to track CTA clicks
 * Usage: const trackCTAClick = useTrackCTAClick(); trackCTAClick('signup_button')
 */
export function useTrackCTAClick() {
  return (ctaName: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        cta_name: ctaName,
        cta_location: window.location.pathname,
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Hook to track form submissions
 * Usage: const trackFormSubmit = useTrackFormSubmit(); trackFormSubmit('newsletter_signup', { email: 'user@example.com' })
 */
export function useTrackFormSubmit() {
  return (formName: string, formData?: Record<string, any>) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        form_name: formName,
        form_data: formData || {},
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Hook to track scroll depth
 * Usage: useTrackScrollDepth()
 */
export function useTrackScrollDepth() {
  useEffect(() => {
    let maxScroll = 0;

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;

        // Track scroll depth at 25%, 50%, 75%, 100%
        const thresholds = [25, 50, 75, 100];
        thresholds.forEach((threshold) => {
          if (
            maxScroll >= threshold &&
            maxScroll < threshold + 5 &&
            (window as any).gtag
          ) {
            (window as any).gtag('event', 'scroll_depth', {
              scroll_percentage: threshold,
              page_path: window.location.pathname,
            });
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// Type definitions for window.dataLayer and gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
