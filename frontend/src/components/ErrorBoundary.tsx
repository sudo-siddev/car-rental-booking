import React, { Component, ErrorInfo, ReactNode } from 'react';
import i18n from '../i18n/config';
import { logger } from '../utils/logger';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component for catching React component errors.
 * 
 * PR Review Fix: Removed inline CSS, moved styles to ErrorBoundary.module.css.
 * Extracted ErrorDisplay as functional component for CSS module usage.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReload={this.handleReload}
          onTryAgain={this.handleTryAgain}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReload: () => void;
  onTryAgain: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorInfo, onReload, onTryAgain }) => {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>
        {i18n.t('errorBoundary.title', 'Something went wrong')}
      </h2>
      <p className={styles.errorMessage}>
        {error?.message || i18n.t('errorBoundary.defaultMessage', 'An unexpected error occurred')}
      </p>
      <div className={styles.buttonContainer}>
        <button className={styles.reloadButton} onClick={onReload}>
          {i18n.t('errorBoundary.reload', 'Reload Page')}
        </button>
        <button className={styles.tryAgainButton} onClick={onTryAgain}>
          {i18n.t('errorBoundary.tryAgain', 'Try Again')}
        </button>
      </div>
      {import.meta.env.DEV && errorInfo && (
        <details className={styles.errorDetails}>
          <summary className={styles.errorDetailsSummary}>
            {i18n.t('errorBoundary.details', 'Error Details (Development Only)')}
          </summary>
          <pre className={styles.errorDetailsPre}>
            {error?.stack}
            {'\n\n'}
            {errorInfo.componentStack}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ErrorBoundary;