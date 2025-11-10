/**
 * Error code constants for API errors
 * 
 * PR Review Fix: Store error codes (translation keys) in Redux instead of translated strings.
 * Error codes are translated at display time, enabling error messages to update immediately
 * when the language changes without page reload.
 */

export const ERROR_CODES = {
  OFFLINE: 'errors.offline',
  NETWORK_ERROR: 'errors.networkError',
  TIMEOUT: 'errors.timeout',
  UNEXPECTED: 'errors.unexpected',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Type guard to check if a string is a valid error code
 * @param message - The error message/code to check
 */
export const isErrorCode = (message: string): message is ErrorCode => {
  return Object.values(ERROR_CODES).includes(message as ErrorCode);
};

/**
 * Custom error class for API errors that includes an error code (translation key).
 * Error messages are translated at display time, not at error creation time.
 */
export class ApiError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message?: string
  ) {
    super(message || errorCode);
    this.name = 'ApiError';
  }
}

