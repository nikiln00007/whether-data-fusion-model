import React from 'react';
import { useTranslation } from 'react-i18next';
import './ErrorBanner.css';

/**
 * ErrorBanner — Friendly error display with retry button
 */
export default function ErrorBanner({ errorKey, onRetry }) {
  const { t } = useTranslation();

  const icons = {
    error_404: '🔍',
    error_401: '🔑',
    error_429: '⏳',
    error_network: '📡',
    error_generic: '⚠️',
  };

  const icon = icons[errorKey] || '⚠️';
  const message = t(errorKey) || errorKey;

  return (
    <div className="error-banner glass-card" role="alert" aria-live="assertive">
      <span className="error-icon" aria-hidden="true">{icon}</span>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry} aria-label={t('retry')}>
          {t('retry')}
        </button>
      )}
    </div>
  );
}
