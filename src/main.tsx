/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import * as Sentry from '@sentry/react';

// Detect environment based on hostname
const isStaging = window.location.hostname.includes('staging');
const environment = isStaging ? 'staging' : 'production';

// Use different DSN for staging vs production
const dsn = isStaging
  ? 'https://62caf754122b496b909cd150bcd9c535@errors.rnltlabs.de/5' // staging project
  : 'https://9dde03ea83b34199aa70934172918a9d@errors.rnltlabs.de/2'; // production project

// Initialize Sentry error tracking (must be first!)
Sentry.init({
  dsn,
  environment,
  release: `runicorn@${__APP_VERSION__}`, // From vite.config.ts

  // Error tracking
  sampleRate: 1.0, // 100% of errors
  tracesSampleRate: 0.0, // No performance tracking (GlitchTip doesn't support it well)

  // Always enabled (DSN selection handles environment routing)
  enabled: true,
});

// Export Sentry globally for debugging
if (typeof window !== 'undefined') {
  (window as unknown as { Sentry: typeof Sentry; sentryDebug: { dsn: string; environment: string; enabled: boolean } }).Sentry = Sentry;
  (window as unknown as { Sentry: typeof Sentry; sentryDebug: { dsn: string; environment: string; enabled: boolean } }).sentryDebug = { dsn, environment, enabled: true };
}

// Import self-hosted fonts (replaces Google Fonts CDN)
import '@fontsource/figtree/300.css'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/figtree/800.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initializeAnalytics } from './lib/analytics'

// Sentry automatically captures uncaught errors and unhandled rejections
// No need for manual window.addEventListener anymore

// Initialize analytics based on existing consent (ePrivacy compliant)
initializeAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
