/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { LogLevel } from './types';

export const LOG_CONFIG = {
  // Log level based on environment
  minLevel: import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG,

  // Environment info
  environment: (import.meta.env.MODE as 'production' | 'staging' | 'development'),

  // App version from package.json
  appVersion: import.meta.env.VITE_APP_VERSION || '1.1.0',

  // Discord webhooks
  webhooks: {
    errors: import.meta.env.VITE_DISCORD_WEBHOOK_ERRORS,
    critical: import.meta.env.VITE_DISCORD_WEBHOOK_CRITICAL,
  },

  // Rate limiting (prevent spam)
  rateLimit: {
    maxLogsPerMinute: 10,
    windowMs: 60000, // 1 minute
  },
} as const;
