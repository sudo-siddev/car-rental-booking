import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleAddon } from '../store/bookingSlice';
import { translateAddonName } from '../utils/translations';
import styles from './AddonsSelection.module.css';

/**
 * AddonsSelection component for selecting rental add-ons.
 * Disabled until a vehicle is selected.
 * Memoized to prevent unnecessary re-renders.
 */
const AddonsSelection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addons, selectedAddons, selectedVehicle } = useAppSelector((state) => state.booking);

  const handleToggle = (addonId: number) => {
    dispatch(toggleAddon(addonId));
  };

  if (!selectedVehicle) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('selectAddons')}</h2>
        <div className={styles.message}>
          <p>{t('selectVehicleFirst')}</p>
        </div>
      </section>
    );
  }

  // Display loading state while addons are being fetched
  if (addons.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('selectAddons')}</h2>
        <div className={styles.message}>
          <p>{t('loading') || 'Loading addons...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('selectAddons')}</h2>
      <div className={styles.addonsGrid}>
        {addons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.id);
          const translatedName = translateAddonName(addon.name, t);
          return (
            <label
              key={addon.id}
              className={`${styles.addonCard} ${isSelected ? styles.selected : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggle(addon.id)}
                className={styles.checkbox}
                aria-label={translatedName}
              />
              <span className={styles.addonName}>{translatedName}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
});

AddonsSelection.displayName = 'AddonsSelection';

export default AddonsSelection;

