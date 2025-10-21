/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { type LogEntry, LogLevel, getLogLevelName, type Transport } from '../types';

interface DiscordWebhooks {
  errors?: string;
  critical?: string;
}

export class DiscordTransport implements Transport {
  private webhooks: DiscordWebhooks;
  private rateLimitCounts = new Map<string, number>();
  private maxLogsPerMinute: number;
  private windowMs: number;

  constructor(
    webhooks: DiscordWebhooks,
    options: { maxLogsPerMinute: number; windowMs: number }
  ) {
    this.webhooks = webhooks;
    this.maxLogsPerMinute = options.maxLogsPerMinute;
    this.windowMs = options.windowMs;
  }

  async log(entry: LogEntry): Promise<void> {
    // Only log FATAL to Discord (critical-alerts channel)
    // All other errors (ERROR, WARN) are tracked by GlitchTip only
    if (entry.level !== LogLevel.FATAL) {
      return;
    }

    // Only send to critical-alerts if PRODUCTION environment
    // Staging fatal errors should NOT go to critical-alerts
    const environment = entry.context?.environment || 'production';
    if (environment !== 'production') {
      return;
    }

    // Rate limiting
    if (!this.shouldLog(entry.message)) {
      console.warn('[DiscordTransport] Rate limit exceeded for:', entry.message);
      return;
    }

    // Use critical webhook for FATAL errors
    const webhook = this.webhooks.critical;

    if (!webhook) {
      console.warn('[DiscordTransport] No critical webhook configured');
      return;
    }

    try {
      await this.sendToDiscord(webhook, entry);
    } catch (error) {
      console.error('[DiscordTransport] Failed to send log:', error);
    }
  }

  private shouldLog(key: string): boolean {
    const count = this.rateLimitCounts.get(key) || 0;

    if (count >= this.maxLogsPerMinute) {
      return false;
    }

    this.rateLimitCounts.set(key, count + 1);

    // Reset counter after window
    setTimeout(() => {
      this.rateLimitCounts.delete(key);
    }, this.windowMs);

    return true;
  }

  private async sendToDiscord(webhook: string, entry: LogEntry): Promise<void> {
    const color = this.getColor(entry.level);
    const icon = this.getIcon(entry.level);

    const fields: Array<{ name: string; value: string; inline: boolean }> = [];

    // Error details
    if (entry.error) {
      fields.push({
        name: 'Error Message',
        value: `\`\`\`${this.truncate(entry.error.message, 1000)}\`\`\``,
        inline: false,
      });

      if (entry.error.stack) {
        fields.push({
          name: 'Stack Trace',
          value: `\`\`\`${this.truncate(entry.error.stack, 1000)}\`\`\``,
          inline: false,
        });
      }
    }

    // Context
    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = JSON.stringify(this.sanitizeContext(entry.context), null, 2);
      fields.push({
        name: 'Context',
        value: `\`\`\`json\n${this.truncate(contextStr, 1000)}\`\`\``,
        inline: false,
      });
    }

    // Metadata
    fields.push(
      {
        name: 'App',
        value: 'Runicorn',
        inline: true,
      },
      {
        name: 'Environment',
        value: entry.context?.environment || 'unknown',
        inline: true,
      },
      {
        name: 'Version',
        value: entry.context?.appVersion || 'unknown',
        inline: true,
      }
    );

    const embed = {
      embeds: [
        {
          title: `${icon} ${entry.message}`,
          color,
          fields,
          timestamp: new Date(entry.timestamp).toISOString(),
          footer: {
            text: `Level: ${getLogLevelName(entry.level)}`,
          },
        },
      ],
    };

    // Add @everyone for FATAL errors
    const payload =
      entry.level === LogLevel.FATAL
        ? { content: '@everyone', ...embed }
        : embed;

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status}`);
    }
  }

  private getColor(level: LogLevel): number {
    switch (level) {
      case LogLevel.WARN:
        return 16776960; // Yellow
      case LogLevel.ERROR:
        return 15158332; // Red
      case LogLevel.FATAL:
        return 10038562; // Dark Red
      default:
        return 3066993; // Blue
    }
  }

  private getIcon(level: LogLevel): string {
    switch (level) {
      case LogLevel.WARN:
        return '⚠️';
      case LogLevel.ERROR:
        return '🔥';
      case LogLevel.FATAL:
        return '💀';
      default:
        return 'ℹ️';
    }
  }

  private truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    // Remove sensitive fields
    const sensitive = ['password', 'token', 'apiKey', 'secret', 'authorization'];
    const sanitized = { ...context };

    for (const key of Object.keys(sanitized)) {
      if (sensitive.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeContext(sanitized[key] as Record<string, unknown>);
      }
    }

    return sanitized;
  }
}
