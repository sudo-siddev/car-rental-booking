/**
 * Date utility functions
 * 
 * PR Review Fix: Moved date utility functions from DateSelection component to utils for reusability.
 */

/**
 * Get today's date formatted as YYYY-MM-DD in local timezone
 * @returns Today's date string in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date string as YYYY-MM-DD in local timezone
 * @param date - The date to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate minimum dropoff date (1 day after pickup date)
 * @param pickupDate - The pickup date string (YYYY-MM-DD) or null
 * @param todayString - Today's date string (YYYY-MM-DD)
 * @returns Minimum dropoff date string in YYYY-MM-DD format
 */
export const getMinDropoffDate = (pickupDate: string | null, todayString: string): string => {
  if (!pickupDate) return todayString;
  
  const pickup = new Date(pickupDate + 'T00:00:00');
  pickup.setDate(pickup.getDate() + 1);
  return formatDateString(pickup);
};

/**
 * Checks if a date string is a complete, valid date format (YYYY-MM-DD)
 * @param dateString - The date string to check
 * @returns True if the date string is complete and valid
 */
export const isCompleteDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validates if a date is not in the past
 * Only validates if the date string is complete
 * @param dateString - The date string to validate
 * @returns True if the date is valid (not in the past or empty)
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return true;
  if (!isCompleteDate(dateString)) return true;
  
  const selectedDate = new Date(dateString + 'T00:00:00');
  selectedDate.setHours(0, 0, 0, 0);
  const todayLocal = new Date();
  todayLocal.setHours(0, 0, 0, 0);
  return selectedDate >= todayLocal;
};

/**
 * Validates if dropoff date is after pickup date
 * Only validates if both dates are complete
 * @param dropoffDateString - The dropoff date string
 * @param pickupDateString - The pickup date string
 * @returns True if the dropoff date is after pickup date
 */
export const isValidDropoffDate = (dropoffDateString: string, pickupDateString: string): boolean => {
  if (!dropoffDateString || !pickupDateString) return true;
  if (!isCompleteDate(dropoffDateString) || !isCompleteDate(pickupDateString)) return true;
  
  const dropoff = new Date(dropoffDateString + 'T00:00:00');
  const pickup = new Date(pickupDateString + 'T00:00:00');
  dropoff.setHours(0, 0, 0, 0);
  pickup.setHours(0, 0, 0, 0);
  return dropoff > pickup;
};

