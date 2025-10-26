/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

const CONSENT_KEY = 'runicorn-cookie-consent';
const UMAMI_SCRIPT_ID = 'umami-analytics';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  timestamp: number;
}

/**
 * Check if analytics cookies are allowed based on user consent
 */
export function shouldLoadAnalytics(): boolean {
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return false;

    const parsed: CookieConsent = JSON.parse(consent);
    return parsed.analytics === true;
  } catch {
    // Invalid consent data, don't load analytics
    return false;
  }
}

/**
 * Get current consent status from localStorage
 */
export function getConsent(): CookieConsent | null {
  try {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) return null;
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

/**
 * Load Umami Analytics script dynamically
 * Only call this after user has given consent!
 */
export function loadUmamiAnalytics(): void {
  // Check if script already exists
  if (document.getElementById(UMAMI_SCRIPT_ID)) {
    if (import.meta.env.DEV) {
      console.info('[Analytics] Umami script already loaded');
    }
    return;
  }

  // Verify consent before loading
  if (!shouldLoadAnalytics()) {
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Attempted to load Umami without consent');
    }
    return;
  }

  // Create and inject Umami script
  const script = document.createElement('script');
  script.id = UMAMI_SCRIPT_ID;
  script.defer = true;
  script.src = 'https://analytics.rnltlabs.de/script.js';
  script.setAttribute('data-website-id', '4e47ed83-80b7-4c48-bfcf-129989ca61ee');

  // Error handling
  script.onerror = () => {
    if (import.meta.env.DEV) {
      console.error('[Analytics] Failed to load Umami script');
    }
  };

  script.onload = () => {
    if (import.meta.env.DEV) {
      console.info('[Analytics] Umami Analytics loaded successfully');
    }
  };

  document.head.appendChild(script);
}

/**
 * Remove Umami Analytics script from DOM
 * Call this if user revokes consent
 */
export function unloadUmamiAnalytics(): void {
  const script = document.getElementById(UMAMI_SCRIPT_ID);
  if (script) {
    script.remove();
    if (import.meta.env.DEV) {
      console.info('[Analytics] Umami script removed');
    }
  }

  // Clear Umami cookies/storage if they exist
  // Umami uses localStorage with 'umami.' prefix
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('umami.')) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore errors
  }
}

/**
 * Initialize analytics based on existing consent
 * Call this on app startup
 */
export function initializeAnalytics(): void {
  if (shouldLoadAnalytics()) {
    loadUmamiAnalytics();
  }
}
