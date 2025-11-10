import { useTranslation } from 'react-i18next';
import { isErrorCode } from '../utils/errorCodes';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage Component
 * 
 * PR Review Fix: Translates error codes at display time (not at error creation time).
 * If message is an error code, it's translated; otherwise displayed as-is (server errors).
 */
const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  const { t } = useTranslation();

  const displayMessage = isErrorCode(message)
    ? t(message, message)
    : message;

  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>{displayMessage}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          {t('retry')}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

