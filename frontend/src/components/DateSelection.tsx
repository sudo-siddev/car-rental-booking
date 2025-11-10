import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPickupDate, setDropoffDate } from '../store/bookingSlice';
import styles from './DateSelection.module.css';

/**
 * DateSelection component for selecting pickup and drop-off dates.
 * Includes validation to ensure drop-off is after pickup date and no past dates.
 * Memoized to prevent unnecessary re-renders.
 */
const DateSelection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pickupDate, dropoffDate, selectedVehicle } = useAppSelector((state) => state.booking);
  const [pickupError, setPickupError] = useState<string | null>(null);
  const [dropoffError, setDropoffError] = useState<string | null>(null);

  // Get today's date in local timezone to avoid UTC conversion issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Format as YYYY-MM-DD in local timezone (not UTC)
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;

  // Calculate minimum dropoff date (1 day after pickup date)
  const getMinDropoffDate = (): string => {
    if (!pickupDate) return todayString;
    
    const pickup = new Date(pickupDate + 'T00:00:00'); // Add time to avoid UTC issues
    pickup.setDate(pickup.getDate() + 1); // Add 1 day
    
    // Format as YYYY-MM-DD in local timezone
    const year = pickup.getFullYear();
    const month = String(pickup.getMonth() + 1).padStart(2, '0');
    const day = String(pickup.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const minDropoffDate = getMinDropoffDate();

  const isPickupDisabled = !selectedVehicle;
  const isDropoffDisabled = !selectedVehicle || !pickupDate;

  /**
   * Checks if a date string is a complete, valid date format (YYYY-MM-DD)
   */
  const isCompleteDate = (dateString: string): boolean => {
    if (!dateString) return false;
    // Check if it matches YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    // Check if it's a valid date (e.g., not 2025-13-45)
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  /**
   * Validates if a date is not in the past
   * Only validates if the date string is complete
   */
  const isValidDate = (dateString: string): boolean => {
    if (!dateString) return true; // Empty is valid (will be handled by required validation)
    if (!isCompleteDate(dateString)) return true; // Don't validate incomplete dates
    
    // Parse date in local timezone to avoid UTC conversion issues
    const selectedDate = new Date(dateString + 'T00:00:00');
    selectedDate.setHours(0, 0, 0, 0);
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    return selectedDate >= todayLocal;
  };

  /**
   * Validates if dropoff date is after pickup date
   * Only validates if both dates are complete
   */
  const isValidDropoffDate = (dropoffDateString: string, pickupDateString: string): boolean => {
    if (!dropoffDateString || !pickupDateString) return true;
    if (!isCompleteDate(dropoffDateString) || !isCompleteDate(pickupDateString)) return true;
    
    // Parse dates in local timezone to avoid UTC conversion issues
    const dropoff = new Date(dropoffDateString + 'T00:00:00');
    const pickup = new Date(pickupDateString + 'T00:00:00');
    dropoff.setHours(0, 0, 0, 0);
    pickup.setHours(0, 0, 0, 0);
    return dropoff > pickup;
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent setting past dates - validate before dispatching
    if (value && isCompleteDate(value)) {
      const selectedDate = new Date(value + 'T00:00:00');
      const todayLocal = new Date();
      todayLocal.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      // Reject past dates
      if (selectedDate < todayLocal) {
        setPickupError(t('validation.invalidPickupDate'));
        return;
      }
    }
    
    // HTML5 date input already enforces YYYY-MM-DD format
    dispatch(setPickupDate(value));
    
    // Only validate if date is complete
    if (value && isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setPickupError(t('validation.invalidPickupDate'));
      } else {
        setPickupError(null);
      }
      
      // Clear dropoff date if it becomes invalid after pickup date change
      if (dropoffDate && isCompleteDate(dropoffDate) && !isValidDropoffDate(dropoffDate, value)) {
        setDropoffError(t('validation.invalidDropoffDate'));
        dispatch(setDropoffDate(''));
      } else if (dropoffDate && isCompleteDate(dropoffDate)) {
        setDropoffError(null);
      }
    } else {
      setPickupError(null);
    }
  };

  const handlePickupBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only validate if date is complete
    if (value && isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setPickupError(t('validation.invalidPickupDate'));
        dispatch(setPickupDate(''));
      } else {
        setPickupError(null);
      }
    } else if (value) {
      // Clear invalid incomplete date on blur
      setPickupError(t('validation.invalidPickupDate'));
      dispatch(setPickupDate(''));
    } else {
      setPickupError(null);
    }
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Validate date before dispatching
    if (value && isCompleteDate(value)) {
      const selectedDate = new Date(value + 'T00:00:00');
      const todayLocal = new Date();
      todayLocal.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      // Reject past dates
      if (selectedDate < todayLocal) {
        setDropoffError(t('validation.pastDate'));
        return;
      }
      
      // Validate dropoff date is after pickup date
      if (pickupDate && isCompleteDate(pickupDate)) {
        const pickup = new Date(pickupDate + 'T00:00:00');
        pickup.setHours(0, 0, 0, 0);
        if (selectedDate <= pickup) {
          setDropoffError(t('validation.invalidDropoffDate'));
          return;
        }
      }
    }
    
    // HTML5 date input already enforces YYYY-MM-DD format
    dispatch(setDropoffDate(value));
    
    // Only validate if date is complete
    if (value && isCompleteDate(value)) {
      if (!pickupDate) {
        setDropoffError(t('validation.invalidDropoffDate'));
        return;
      }
      
      if (!isValidDate(value)) {
        setDropoffError(t('validation.pastDate'));
      } else if (!isValidDropoffDate(value, pickupDate)) {
        setDropoffError(t('validation.invalidDropoffDate'));
      } else {
        setDropoffError(null);
      }
    } else {
      // Clear error while typing incomplete date
      setDropoffError(null);
    }
  };

  const handleDropoffBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setDropoffError(null);
      return;
    }
    
    // Only validate if date is complete
    if (isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setDropoffError(t('validation.pastDate'));
        dispatch(setDropoffDate(''));
      } else if (pickupDate && !isValidDropoffDate(value, pickupDate)) {
        setDropoffError(t('validation.invalidDropoffDate'));
        dispatch(setDropoffDate(''));
      } else {
        setDropoffError(null);
      }
    } else {
      // Clear invalid incomplete date on blur
      setDropoffError(t('validation.invalidDropoffDate'));
      dispatch(setDropoffDate(''));
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('rentalDuration')}</h2>
      <div className={styles.dateContainer}>
        <div className={styles.dateField}>
          <label htmlFor="pickup-date" className={styles.label}>
            {t('pickupDate')}
          </label>
          <input
            id="pickup-date"
            type="date"
            value={pickupDate}
            min={todayString}
            disabled={isPickupDisabled}
            onChange={handlePickupChange}
            onBlur={handlePickupBlur}
            className={`${styles.dateInput} ${pickupError ? styles.error : ''}`}
            aria-label={t('pickupDate')}
            aria-invalid={!!pickupError}
            aria-describedby={pickupError ? 'pickup-error' : undefined}
          />
          {pickupError && (
            <span id="pickup-error" className={styles.errorMessage} role="alert">
              {pickupError}
            </span>
          )}
        </div>
        <div className={styles.dateField}>
          <label htmlFor="dropoff-date" className={styles.label}>
            {t('dropoffDate')}
          </label>
          <input
            id="dropoff-date"
            type="date"
            value={dropoffDate}
            min={minDropoffDate}
            disabled={isDropoffDisabled}
            onChange={handleDropoffChange}
            onBlur={handleDropoffBlur}
            className={`${styles.dateInput} ${dropoffError ? styles.error : ''}`}
            aria-label={t('dropoffDate')}
            aria-invalid={!!dropoffError}
            aria-describedby={dropoffError ? 'dropoff-error' : undefined}
          />
          {dropoffError && (
            <span id="dropoff-error" className={styles.errorMessage} role="alert">
              {dropoffError}
            </span>
          )}
        </div>
      </div>
    </section>
  );
});

DateSelection.displayName = 'DateSelection';

export default DateSelection;

