import React from 'react';
import styles from './BookingConfirmation.module.css';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  isTotal?: boolean;
}

/**
 * DetailRow Component
 * 
 * PR Review Fix: Extracted from BookingConfirmation to reduce code redundancy.
 */
const DetailRow: React.FC<DetailRowProps> = ({ label, value, isTotal = false }) => {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}:</span>
      {isTotal ? (
        <span className={styles.totalValue}>{value}</span>
      ) : (
        <span className={styles.detailValue}>{value}</span>
      )}
    </div>
  );
};

export default DetailRow;

