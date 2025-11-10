/**
 * Production-ready logging utility for the frontend application.
 * 
 * PR Review Fix: Defined LOG_LEVELS and BACKEND_LOG_ENDPOINT constants instead of string literals.
 * Removed unnecessary comments.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const;

const BACKEND_LOG_ENDPOINT = '/api/v1/logs';

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private errorTrackingEnabled = false;
  private errorTrackingService: ((error: Error, context?: LogContext) => void) | null = null;

  /**
   * Initialize error tracking service (e.g., Sentry, LogRocket).
   * Should be called during application initialization.
   */
  initErrorTracking(service: (error: Error, context?: LogContext) => void) {
    this.errorTrackingEnabled = true;
    this.errorTrackingService = service;
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, context || '');
    }
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    
    if (this.errorTrackingEnabled && this.errorTrackingService) {
      const error = new Error(message);
      this.errorTrackingService(error, { level: 'warn', ...context });
    } else if (!this.isDevelopment) {
      this.sendToBackend('warn', message, context || {});
    }
  }

  /**
   * Log error messages with full context
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const errorContext = {
      message,
      error: errorObj.message,
      stack: errorObj.stack,
      ...context,
    };

    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, errorObj, context || '');
    }

    if (this.errorTrackingEnabled && this.errorTrackingService) {
      this.errorTrackingService(errorObj, errorContext);
    } else if (!this.isDevelopment) {
      this.sendToBackend('error', message, errorContext);
    }
  }

  /**
   * Send logs to backend logging endpoint (optional)
   */
  private async sendToBackend(level: LogLevel, message: string, context: LogContext): Promise<void> {
    try {
      if (level === LOG_LEVELS.ERROR || level === LOG_LEVELS.WARN) {
        await fetch(BACKEND_LOG_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          }),
        });
      }
    } catch (err) {
      if (this.isDevelopment) {
        console.error('Failed to send log to backend:', err);
      }
    }
  }

  /**
   * Log API errors with request context
   */
  logApiError(
    method: string,
    url: string,
    status: number | undefined,
    error: Error,
    responseData?: unknown
  ): void {
    this.error(`API Error: ${method} ${url}`, error, {
      method,
      url,
      status,
      responseData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log user actions for analytics (optional)
   */
  logUserAction(action: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.debug(`User Action: ${action}`, context);
    }
  }
}

export const logger = new Logger();
