/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
};

export function getLogLevelName(level: LogLevel): string {
  return LOG_LEVEL_NAMES[level] || 'UNKNOWN';
}

export interface LogContext {
  // User Context
  userId?: string;
  sessionId?: string;

  // Environment
  environment: 'production' | 'staging' | 'development';
  appVersion: string;

  // Browser
  userAgent: string;
  viewport?: { width: number; height: number };

  // App State
  route?: string;

  // Custom
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Partial<LogContext>;
  error?: Error;
  timestamp: number;
}

export interface Transport {
  log(entry: LogEntry): void | Promise<void>;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  transports: Transport[];
  context: Partial<LogContext>;
}
