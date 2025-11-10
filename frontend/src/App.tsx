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
import LanguageSwitcher from './components/LanguageSwitcher';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
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

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Refetch vehicles when connection is restored
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
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.emoji}>🚗</span>
            <h1 className={styles.title}>{t('title')}</h1>
          </div>
          <LanguageSwitcher />
        </header>
        {!isOnline && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#ff9800',
            color: 'white',
            textAlign: 'center',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)'
          }}>
            ⚠️ {t('offline') || 'You are currently offline. Some features may not be available.'}
          </div>
        )}
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

