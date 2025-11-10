import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { hideConfirmation, resetBooking } from '../store/bookingSlice';
import { selectBookingSummary } from '../store/selectors';
import { translateVehicleName, translateAddonName } from '../utils/translations';
import styles from './BookingConfirmation.module.css';

const BookingConfirmation = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showConfirmation, pickupDate, dropoffDate } = useAppSelector((state) => state.booking);
  const summary = useAppSelector(selectBookingSummary);

  if (!showConfirmation || !summary) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

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
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('vehicle')}:</span>
            <span className={styles.detailValue}>
              {summary.vehicle.emoji} {translateVehicleName(summary.vehicle.name, t)}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('pickupDate')}:</span>
            <span className={styles.detailValue}>
              {pickupDate ? formatDate(pickupDate) : '-'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dropoffDate')}:</span>
            <span className={styles.detailValue}>
              {dropoffDate ? formatDate(dropoffDate) : '-'}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('duration')}:</span>
            <span className={styles.detailValue}>
              {summary.days} {t('days')}
            </span>
          </div>
          {summary.selectedAddons.length > 0 && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('selectAddons')}:</span>
              <span className={styles.detailValue}>
                {summary.selectedAddons.map((a) => translateAddonName(a.name, t)).join(', ')}
              </span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('totalAmount')}:</span>
            <span className={styles.totalValue}>{formatCurrency(summary.total)}</span>
          </div>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          {t('confirmation.close')}
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

