import { useTranslation } from 'react-i18next';
import styles from './OfflineBanner.module.css';

/**
 * OfflineBanner Component
 * 
 * PR Review Fix: Extracted from inline JSX in App.tsx to separate component.
 */
const OfflineBanner = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.banner}>
      ⚠️ {t('offline') || 'You are currently offline. Some features may not be available.'}
    </div>
  );
};

export default OfflineBanner;

