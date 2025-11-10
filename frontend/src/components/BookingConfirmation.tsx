import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideConfirmation, resetBooking } from '../store/bookingSlice';
import { selectBookingSummary } from '../store/selectors';
import { translateVehicleName, translateAddonName } from '../utils/translations';
import { formatCurrency, formatDate } from '../utils/formatters';
import DetailRow from './DetailRow';
import styles from './BookingConfirmation.module.css';

const BookingConfirmation = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showConfirmation, pickupDate, dropoffDate } = useAppSelector((state) => state.booking);
  const summary = useAppSelector(selectBookingSummary);

  if (!showConfirmation || !summary) {
    return null;
  }

  const handleClose = () => {
    dispatch(hideConfirmation());
    dispatch(resetBooking());
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}>
            <svg
              className={styles.checkmarkSvg}
              viewBox="0 0 52 52"
            >
              <circle
                className={styles.checkmarkCircle}
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className={styles.checkmarkCheck}
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
        </div>
        <h2 className={styles.title}>{t('confirmation.title')}</h2>
        <p className={styles.message}>{t('confirmation.message')}</p>
        <div className={styles.details}>
          <h3 className={styles.detailsTitle}>{t('confirmation.bookingDetails')}</h3>
          <DetailRow
            label={t('vehicle')}
            value={`${summary.vehicle.emoji} ${translateVehicleName(summary.vehicle.name, t)}`}
          />
          <DetailRow
            label={t('pickupDate')}
            value={pickupDate ? formatDate(pickupDate) : '-'}
          />
          <DetailRow
            label={t('dropoffDate')}
            value={dropoffDate ? formatDate(dropoffDate) : '-'}
          />
          <DetailRow
            label={t('duration')}
            value={`${summary.days} ${t('days')}`}
          />
          {summary.selectedAddons.length > 0 && (
            <DetailRow
              label={t('selectAddons')}
              value={summary.selectedAddons.map((a) => translateAddonName(a.name, t)).join(', ')}
            />
          )}
          <DetailRow
            label={t('totalAmount')}
            value={formatCurrency(summary.total)}
            isTotal={true}
          />
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          {t('confirmation.close')}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

