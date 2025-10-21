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

  // Integration with React
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Privacy: don't capture replays by default
  replaysSessionSampleRate: 0.0,
  replaysOnErrorSampleRate: 0.0,
});

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

// Sentry automatically captures uncaught errors and unhandled rejections
// No need for manual window.addEventListener anymore

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
