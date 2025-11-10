/**
 * Production-ready logging utility for the frontend application.
 * Provides structured logging with different log levels and optional
 * integration with error tracking services (e.g., Sentry, LogRocket).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

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
    // In production, you might want to send to analytics service
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: LogContext): void {
    // Only log to console in development
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '');
    }
    
    // Send warnings to error tracking in production
    if (this.errorTrackingEnabled && this.errorTrackingService) {
      const error = new Error(message);
      this.errorTrackingService(error, { level: 'warn', ...context });
    } else if (!this.isDevelopment) {
      // In production without error tracking, send to backend
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

    // Only log to console in development
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, errorObj, context || '');
    }

    // Send to error tracking service in production
    if (this.errorTrackingEnabled && this.errorTrackingService) {
      this.errorTrackingService(errorObj, errorContext);
    } else if (!this.isDevelopment) {
      // In production without error tracking, send to backend logging endpoint
      this.sendToBackend('error', message, errorContext);
    }
  }

  /**
   * Send logs to backend logging endpoint (optional)
   */
  private async sendToBackend(level: LogLevel, message: string, context: LogContext): Promise<void> {
    try {
      // Only send errors and warnings to reduce noise
      if (level === 'error' || level === 'warn') {
        await fetch('/api/v1/logs', {
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
      // Silently fail - don't let logging errors break the app
      // Only log in development to avoid console statements in production
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
    // In production, send to analytics service
  }
}

// Export singleton instance
export const logger = new Logger();

