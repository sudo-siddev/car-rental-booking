import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPickupDate, setDropoffDate } from '../store/bookingSlice';
import { getTodayDate, getMinDropoffDate, isCompleteDate, isValidDate, isValidDropoffDate } from '../utils/dates';
import { VALIDATION_ERRORS } from '../utils/validationErrors';
import DateField from './DateField';
import styles from './DateSelection.module.css';

/**
 * DateSelection component for selecting pickup and drop-off dates.
 * Includes validation to ensure drop-off is after pickup date and no past dates.
 * Memoized to prevent unnecessary re-renders.
 * 
 * PR Review Fix: Uses date utility functions from utils and DateField sub-component.
 */
const DateSelection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { pickupDate, dropoffDate, selectedVehicle } = useAppSelector((state) => state.booking);
  const [pickupErrorKey, setPickupErrorKey] = useState<string | null>(null);
  const [dropoffErrorKey, setDropoffErrorKey] = useState<string | null>(null);

  const todayString = getTodayDate();
  const minDropoffDate = getMinDropoffDate(pickupDate, todayString);

  const isPickupDisabled = !selectedVehicle;
  const isDropoffDisabled = !selectedVehicle || !pickupDate;

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && isCompleteDate(value)) {
      const selectedDate = new Date(value + 'T00:00:00');
      const todayLocal = new Date();
      todayLocal.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < todayLocal) {
        setPickupErrorKey(VALIDATION_ERRORS.INVALID_PICKUP_DATE);
        return;
      }
    }
    
    dispatch(setPickupDate(value));
    
    if (value && isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setPickupErrorKey(VALIDATION_ERRORS.INVALID_PICKUP_DATE);
      } else {
        setPickupErrorKey(null);
      }
      
      if (dropoffDate && isCompleteDate(dropoffDate) && !isValidDropoffDate(dropoffDate, value)) {
        setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
        dispatch(setDropoffDate(''));
      } else if (dropoffDate && isCompleteDate(dropoffDate)) {
        setDropoffErrorKey(null);
      }
    } else {
      setPickupErrorKey(null);
    }
  };

  const handlePickupBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setPickupErrorKey(VALIDATION_ERRORS.INVALID_PICKUP_DATE);
        dispatch(setPickupDate(''));
      } else {
        setPickupErrorKey(null);
      }
    } else if (value) {
      setPickupErrorKey(VALIDATION_ERRORS.INVALID_PICKUP_DATE);
      dispatch(setPickupDate(''));
    } else {
      setPickupErrorKey(null);
    }
  };

  const handleDropoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value && isCompleteDate(value)) {
      const selectedDate = new Date(value + 'T00:00:00');
      const todayLocal = new Date();
      todayLocal.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < todayLocal) {
        setDropoffErrorKey(VALIDATION_ERRORS.PAST_DATE);
        return;
      }
      
      if (pickupDate && isCompleteDate(pickupDate)) {
        const pickup = new Date(pickupDate + 'T00:00:00');
        pickup.setHours(0, 0, 0, 0);
        if (selectedDate <= pickup) {
          setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
          return;
        }
      }
    }
    
    dispatch(setDropoffDate(value));
    
    if (value && isCompleteDate(value)) {
      if (!pickupDate) {
        setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
        return;
      }
      
      if (!isValidDate(value)) {
        setDropoffErrorKey(VALIDATION_ERRORS.PAST_DATE);
      } else if (!isValidDropoffDate(value, pickupDate)) {
        setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
      } else {
        setDropoffErrorKey(null);
      }
    } else {
      setDropoffErrorKey(null);
    }
  };

  const handleDropoffBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setDropoffErrorKey(null);
      return;
    }
    
    if (isCompleteDate(value)) {
      if (!isValidDate(value)) {
        setDropoffErrorKey(VALIDATION_ERRORS.PAST_DATE);
        dispatch(setDropoffDate(''));
      } else if (pickupDate && !isValidDropoffDate(value, pickupDate)) {
        setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
        dispatch(setDropoffDate(''));
      } else {
        setDropoffErrorKey(null);
      }
    } else {
      setDropoffErrorKey(VALIDATION_ERRORS.INVALID_DROPOFF_DATE);
      dispatch(setDropoffDate(''));
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('rentalDuration')}</h2>
      <div className={styles.dateContainer}>
        <DateField
          id="pickup-date"
          label={t('pickupDate')}
          value={pickupDate}
          min={todayString}
          disabled={isPickupDisabled}
          errorKey={pickupErrorKey}
          onChange={handlePickupChange}
          onBlur={handlePickupBlur}
          ariaLabel={t('pickupDate')}
        />
        <DateField
          id="dropoff-date"
          label={t('dropoffDate')}
          value={dropoffDate}
          min={minDropoffDate}
          disabled={isDropoffDisabled}
          errorKey={dropoffErrorKey}
          onChange={handleDropoffChange}
          onBlur={handleDropoffBlur}
          ariaLabel={t('dropoffDate')}
        />
      </div>
    </section>
  );
});

DateSelection.displayName = 'DateSelection';

export default DateSelection;

