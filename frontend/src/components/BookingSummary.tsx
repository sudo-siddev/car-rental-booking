import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { selectBookingSummary } from '../store/selectors';
import { translateVehicleName, translateAddonName } from '../utils/translations';
import styles from './BookingSummary.module.css';

/**
 * Formats a number as Indian Rupee currency.
 *
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹12,500")
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * BookingSummary component displays the cost breakdown of the booking.
 * Only renders when a valid booking summary is available.
 * Memoized to prevent unnecessary re-renders.
 */
const BookingSummary = memo(() => {
  const { t } = useTranslation();
  const summary = useAppSelector(selectBookingSummary);

  if (!summary) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('bookingSummary')}</h2>
      <div className={styles.summaryContent}>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t('vehicle')}:</span>
          <span className={styles.value}>{translateVehicleName(summary.vehicle.name, t)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t('duration')}:</span>
          <span className={styles.value}>
            {summary.days} {t('days')}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t('baseCost')}:</span>
          <span className={styles.value}>
            {formatCurrency(summary.vehicle.costPerDay)} × {summary.days} {t('days')} ={' '}
            {formatCurrency(summary.baseCost)}
          </span>
        </div>
        {summary.selectedAddons.length > 0 && (
          <div className={styles.addonsSection}>
            <div className={styles.label}>{t('selectAddons')}:</div>
            {summary.selectedAddons.map((addon) => {
              const translatedAddonName = translateAddonName(addon.name, t);
              return (
                <div key={addon.id} className={styles.addonRow}>
                  <span className={styles.addonItem}>
                    • {translatedAddonName} ({formatCurrency(addon.costPerDay)} × {summary.days} {t('days')})
                  </span>
                  <span className={styles.addonValue}>
                    {formatCurrency(addon.costPerDay * summary.days)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t('subtotal')}:</span>
          <span className={styles.value}>{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.label}>{t('gst')}:</span>
          <span className={styles.value}>{formatCurrency(summary.gst)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span className={styles.totalLabel}>{t('totalAmount')}:</span>
          <span className={styles.totalValue}>{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </section>
  );
});

BookingSummary.displayName = 'BookingSummary';

export default BookingSummary;

