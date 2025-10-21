/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { type LogEntry, LogLevel, getLogLevelName, type Transport } from '../types';

export class ConsoleTransport implements Transport {
  log(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = getLogLevelName(entry.level);
    const prefix = `[${timestamp}] [${levelName}]`;

    const style = this.getStyle(entry.level);

    // Format the message
    const message = `${prefix} ${entry.message}`;

    // Log based on level
    switch (entry.level) {
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(`%c${message}`, style, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message, entry.context, entry.error);
        break;
    }
  }

  private getStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #888';
      case LogLevel.INFO:
        return 'color: #0066cc';
      case LogLevel.WARN:
        return 'color: #ff9800';
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return 'color: #f44336; font-weight: bold';
      default:
        return '';
    }
  }
}
