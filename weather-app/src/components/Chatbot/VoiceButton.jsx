import React from 'react';
import { useTranslation } from 'react-i18next';
import './VoiceButton.css';

/**
 * VoiceButton — Mic button with pulse animation and error tooltip
 */
export default function VoiceButton({ listening, interim, error, onStart, onStop }) {
  const { t } = useTranslation();

  const handleClick = () => {
    if (listening) onStop();
    else onStart();
  };

  return (
    <div className="voice-btn-wrap">
      <button
        type="button"
        className={`voice-btn${listening ? ' listening' : ''}`}
        onClick={handleClick}
        aria-label={listening ? 'Stop listening' : 'Start voice input'}
        aria-pressed={listening}
        title={error ? t(error) : (listening ? 'Tap to stop' : 'Tap to speak')}
      >
        <span aria-hidden="true">{listening ? '⏹' : '🎤'}</span>
        {listening && <span className="voice-pulse" aria-hidden="true" />}
      </button>
      {error && (
        <div className="voice-error-tip" role="alert" aria-live="assertive">
          {t(error)}
        </div>
      )}
    </div>
  );
}
