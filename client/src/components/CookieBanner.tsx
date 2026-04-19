import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'cult-of-psyche-cookie-consent';
const COOKIE_EXPIRY_DAYS = 365;

/**
 * CookieBanner Component
 * Implements GDPR-compliant cookie consent banner
 * Manages user preferences for different cookie categories
 */
export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
  });

  // Check if user has already made a choice
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      const consent = JSON.parse(savedConsent);
      setPreferences(consent);
      applyConsent(consent);
    }
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Apply analytics consent
    if (prefs.analytics) {
      // Initialize Google Analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted',
        });
      }
    } else {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied',
        });
      }
    }

    // Apply marketing consent
    if (prefs.marketing) {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
        });
      }
    } else {
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
        });
      }
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    saveCookiePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const rejected: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    saveCookiePreferences(rejected);
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    applyConsent(prefs);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-midnight border-t border-cyan/30 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!showDetails ? (
          // Main banner
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-hot-pink mb-2">Cookie Preferences</h3>
              <p className="text-gray-300 text-sm">
                We use cookies to enhance your experience, analyze site traffic, and enable marketing features. 
                Essential cookies are always enabled. You can customize your preferences below.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                <a href="/privacy" className="text-cyan hover:text-hot-pink underline">Privacy Policy</a>
                {' '}&bull;{' '}
                <a href="/terms" className="text-cyan hover:text-hot-pink underline">Terms of Service</a>
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="border-cyan text-cyan hover:bg-cyan/10"
              >
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="border-gray-500 text-gray-300 hover:bg-gray-500/10"
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="bg-hot-pink hover:bg-hot-pink/90 text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-hot-pink">Cookie Preferences</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Essential Cookies */}
              <div className="border border-cyan/30 rounded-lg p-4 bg-midnight/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-cyan">Essential Cookies</h4>
                  <input
                    type="checkbox"
                    checked={preferences.essential}
                    disabled
                    className="mt-1 cursor-not-allowed"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Required for the website to function. These cannot be disabled.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Session management</p>
                  <p>• Security</p>
                  <p>• User preferences</p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-cyan/30 rounded-lg p-4 bg-midnight/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-cyan">Analytics Cookies</h4>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="mt-1 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Help us understand how you use our site to improve performance.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Page views</p>
                  <p>• User behavior</p>
                  <p>• Performance metrics</p>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-cyan/30 rounded-lg p-4 bg-midnight/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-cyan">Marketing Cookies</h4>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="mt-1 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Enable personalized ads and marketing content based on your interests.
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• Personalized ads</p>
                  <p>• Retargeting</p>
                  <p>• Social media integration</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-cyan/30">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                className="border-gray-500 text-gray-300 hover:bg-gray-500/10"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="border-gray-500 text-gray-300 hover:bg-gray-500/10"
              >
                Reject All
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="bg-cyan hover:bg-cyan/90 text-midnight"
              >
                Save Preferences
              </Button>
              <Button
                onClick={handleAcceptAll}
                className="bg-hot-pink hover:bg-hot-pink/90 text-white"
              >
                Accept All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook to check if a cookie category is enabled
 * Usage: const analyticsEnabled = useCookieConsent('analytics');
 */
export function useCookieConsent(category: keyof CookiePreferences): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      const consent = JSON.parse(savedConsent) as CookiePreferences;
      setIsEnabled(consent[category]);
    }
  }, [category]);

  return isEnabled;
}

/**
 * Hook to update cookie preferences
 * Usage: const updateConsent = useUpdateCookieConsent();
 */
export function useUpdateCookieConsent() {
  return (preferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    window.location.reload();
  };
}
