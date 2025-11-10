/**
 * Utility functions for formatting data
 * 
 * PR Review Fix: Moved from BookingConfirmation component to utils for reusability.
 */

/**
 * Format a number as Indian Rupee currency
 * @param amount - The amount to format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date string to DD/MM/YYYY format
 * @param dateString - The date string to format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

