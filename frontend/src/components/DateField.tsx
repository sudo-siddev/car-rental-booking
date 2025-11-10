import { useTranslation } from 'react-i18next';
import styles from './DateSelection.module.css';

interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  min: string;
  disabled: boolean;
  errorKey: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  ariaLabel: string;
}

/**
 * DateField Component
 * 
 * PR Review Fix: Extracted from DateSelection to reduce code redundancy.
 */
const DateField: React.FC<DateFieldProps> = ({
  id,
  label,
  value,
  min,
  disabled,
  errorKey,
  onChange,
  onBlur,
  ariaLabel,
}) => {
  const { t } = useTranslation();
  const error = errorKey ? t(errorKey) : null;

  return (
    <div className={styles.dateField}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        min={min}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.dateInput} ${error ? styles.error : ''}`}
        aria-label={ariaLabel}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <span id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default DateField;

