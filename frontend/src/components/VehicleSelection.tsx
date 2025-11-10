import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectVehicle, fetchAddons } from '../store/bookingSlice';
import { Vehicle } from '../types';
import { translateVehicleName } from '../utils/translations';
import styles from './VehicleSelection.module.css';

/**
 * VehicleSelection component allows users to select a vehicle type.
 * Memoized to prevent unnecessary re-renders when other parts of the state change.
 */
const VehicleSelection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { vehicles, selectedVehicle } = useAppSelector((state) => state.booking);

  const handleSelect = (vehicle: Vehicle) => {
    dispatch(selectVehicle(vehicle));
    // Fetch vehicle-specific addons when a vehicle is selected
    dispatch(fetchAddons(vehicle.id));
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('selectVehicle')}</h2>
      <div className={styles.vehicleGrid}>
        {vehicles.map((vehicle) => {
          const translatedName = translateVehicleName(vehicle.name, t);
          return (
            <button
              key={vehicle.id}
              className={`${styles.vehicleCard} ${
                selectedVehicle?.id === vehicle.id ? styles.selected : ''
              }`}
              onClick={() => handleSelect(vehicle)}
              aria-label={`Select ${translatedName}`}
              aria-pressed={selectedVehicle?.id === vehicle.id}
            >
              <span className={styles.emoji}>{vehicle.emoji}</span>
              <span className={styles.name}>{translatedName}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
});

VehicleSelection.displayName = 'VehicleSelection';

export default VehicleSelection;

