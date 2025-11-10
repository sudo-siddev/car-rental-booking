import React from 'react';
import styles from './BookingSummary.module.css';

interface SummaryRowProps {
  label: string;
  value: React.ReactNode;
  isTotal?: boolean;
}

/**
 * SummaryRow Component
 * 
 * PR Review Fix: Extracted from BookingSummary to reduce code redundancy.
 */
const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isTotal = false }) => {
  return (
    <div className={`${styles.summaryRow} ${isTotal ? styles.totalRow : ''}`}>
      {isTotal ? (
        <>
          <span className={styles.totalLabel}>{label}:</span>
          <span className={styles.totalValue}>{value}</span>
        </>
      ) : (
        <>
          <span className={styles.label}>{label}:</span>
          <span className={styles.value}>{value}</span>
        </>
      )}
    </div>
  );
};

export default SummaryRow;

