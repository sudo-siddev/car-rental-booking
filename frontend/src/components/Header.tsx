import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

/**
 * Header Component
 * 
 * PR Review Fix: Extracted header from App.tsx to separate reusable component.
 */
const Header = () => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <span className={styles.emoji}>🚗</span>
        <h1 className={styles.title}>{t('title')}</h1>
      </div>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;

