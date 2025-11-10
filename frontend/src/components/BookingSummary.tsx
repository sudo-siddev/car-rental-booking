import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { selectBookingSummary } from '../store/selectors';
import { translateVehicleName, translateAddonName } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';
import SummaryRow from './SummaryRow';
import styles from './BookingSummary.module.css';

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
        <SummaryRow
          label={t('vehicle')}
          value={translateVehicleName(summary.vehicle.name, t)}
        />
        <SummaryRow
          label={t('duration')}
          value={`${summary.days} ${t('days')}`}
        />
        <SummaryRow
          label={t('baseCost')}
          value={`${formatCurrency(summary.vehicle.costPerDay)} × ${summary.days} ${t('days')} = ${formatCurrency(summary.baseCost)}`}
        />
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
        <SummaryRow
          label={t('subtotal')}
          value={formatCurrency(summary.subtotal)}
        />
        <SummaryRow
          label={t('gst')}
          value={formatCurrency(summary.gst)}
        />
        <SummaryRow
          label={t('totalAmount')}
          value={formatCurrency(summary.total)}
          isTotal={true}
        />
      </div>
    </section>
  );
});

BookingSummary.displayName = 'BookingSummary';

export default BookingSummary;

