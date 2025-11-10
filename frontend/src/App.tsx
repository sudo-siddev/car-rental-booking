import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchVehicles, fetchAddons, showConfirmation } from './store/bookingSlice';
import { selectIsBookingValid } from './store/selectors';
import VehicleSelection from './components/VehicleSelection';
import DateSelection from './components/DateSelection';
import AddonsSelection from './components/AddonsSelection';
import BookingSummary from './components/BookingSummary';
import BookingConfirmation from './components/BookingConfirmation';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import OfflineBanner from './components/OfflineBanner';
import Header from './components/Header';
import styles from './App.module.css';
import './i18n/config';

function App() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.booking);
  const isBookingValid = useAppSelector(selectIsBookingValid);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!loading && !error) {
        dispatch(fetchVehicles());
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, loading, error]);

  const handleBookNow = () => {
    if (isBookingValid) {
      dispatch(showConfirmation());
    }
  };

  const handleRetry = () => {
    dispatch(fetchVehicles());
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Header />
        {!isOnline && <OfflineBanner />}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        {!loading && !error && (
          <>
            <VehicleSelection />
            <DateSelection />
            <AddonsSelection />
            <BookingSummary />
            <button
              className={styles.bookButton}
              onClick={handleBookNow}
              disabled={!isBookingValid}
              aria-label={t('bookNow')}
            >
              {t('bookNow')}
            </button>
          </>
        )}
        <BookingConfirmation />
      </div>
    </div>
  );
}

export default App;

