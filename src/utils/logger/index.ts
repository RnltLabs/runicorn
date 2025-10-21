/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { LogLevel, type LogContext, type LogEntry, type Transport } from './types';
import { LOG_CONFIG } from './config';
import { ConsoleTransport } from './transports/console';
import { DiscordTransport } from './transports/discord';

class Logger {
  private minLevel: LogLevel;
  private transports: Transport[];
  private context: Partial<LogContext>;
  private sessionId: string;

  constructor() {
    this.minLevel = LOG_CONFIG.minLevel;
    this.context = {
      environment: LOG_CONFIG.environment,
      appVersion: LOG_CONFIG.appVersion,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    // Generate session ID
    this.sessionId = this.generateSessionId();

    // Setup transports
    this.transports = [
      new ConsoleTransport(),
    ];

    // Add Discord transport in production
    if (import.meta.env.PROD) {
      this.transports.push(
        new DiscordTransport(LOG_CONFIG.webhooks, LOG_CONFIG.rateLimit)
      );
    }
  }

  /**
   * Set global context for all logs
   */
  setContext(context: Partial<LogContext>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Add context for this log only
   */
  withContext(context: Partial<LogContext>) {
    return {
      debug: (message: string, additionalContext?: Record<string, unknown>) =>
        this.log(LogLevel.DEBUG, message, { ...context, ...additionalContext }),
      info: (message: string, additionalContext?: Record<string, unknown>) =>
        this.log(LogLevel.INFO, message, { ...context, ...additionalContext }),
      warn: (message: string, additionalContext?: Record<string, unknown>) =>
        this.log(LogLevel.WARN, message, { ...context, ...additionalContext }),
      error: (message: string, error?: Error, additionalContext?: Record<string, unknown>) =>
        this.log(LogLevel.ERROR, message, { ...context, ...additionalContext }, error),
      fatal: (message: string, error?: Error, additionalContext?: Record<string, unknown>) =>
        this.log(LogLevel.FATAL, message, { ...context, ...additionalContext }, error),
    };
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.FATAL, message, context, error);
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    // Check if we should log this level
    if (level < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context: {
        ...this.context,
        sessionId: this.sessionId,
        ...context,
      },
      error,
      timestamp: Date.now(),
    };

    // Send to all transports
    for (const transport of this.transports) {
      try {
        const result = transport.log(entry);
        // Handle async transports
        if (result instanceof Promise) {
          result.catch((err) => {
            console.error('[Logger] Transport failed:', err);
          });
        }
      } catch (err) {
        console.error('[Logger] Transport failed:', err);
      }
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types
export type { LogLevel, LogContext };
