/**
 * Validation error code constants
 * 
 * PR Review Fix: Define constants for validation error keys to avoid magic strings
 * and ensure consistency across the codebase.
 */

export const VALIDATION_ERRORS = {
  INVALID_PICKUP_DATE: 'validation.invalidPickupDate',
  INVALID_DROPOFF_DATE: 'validation.invalidDropoffDate',
  PAST_DATE: 'validation.pastDate',
  SAME_DATE: 'validation.sameDate',
} as const;

export type ValidationError = typeof VALIDATION_ERRORS[keyof typeof VALIDATION_ERRORS];

/**
 * Type guard to check if a string is a valid validation error code
 * @param errorKey - The error key to check
 */
export const isValidationError = (errorKey: string): errorKey is ValidationError => {
  return Object.values(VALIDATION_ERRORS).includes(errorKey as ValidationError);
};

