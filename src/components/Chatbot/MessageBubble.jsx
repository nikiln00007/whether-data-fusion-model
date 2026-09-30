import React, { useState } from 'react';
import './MessageBubble.css';

/**
 * MessageBubble — Single chat message with timestamp, copy, and speak buttons
 */
export default function MessageBubble({ message, onSpeak, onStop, speaking }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const timeLabel = new Date(message.ts).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={`bubble-wrap${isUser ? ' user' : ' assistant'}${message.isError ? ' error' : ''}`}>
      {!isUser && (
        <span className="bubble-avatar" aria-hidden="true">🌦️</span>
      )}
      <div className="bubble-body">
        <div
          className="bubble-text"
          aria-label={`${isUser ? 'You' : 'Assistant'}: ${message.content}`}
        >
          {message.content}
        </div>
        <div className="bubble-footer">
          <span className="bubble-time">{timeLabel}</span>
          {!isUser && (
            <div className="bubble-actions">
              <button
                className={`bubble-btn${copied ? ' copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy message"
                title={copied ? 'Copied to clipboard!' : 'Copy'}
              >
                {copied ? '✓ Copied' : '📋'}
              </button>
              <button
                className={`bubble-btn${speaking ? ' active-speak' : ''}`}
                onClick={() => speaking ? onStop() : onSpeak(message.content)}
                aria-label={speaking ? 'Stop speaking' : 'Read aloud with AI voice'}
                title={speaking ? 'Stop reading' : 'Play voice'}
              >
                {speaking ? (
                  <>
                    ⏹️
                    <span className="audio-waves" aria-hidden="true">
                      <span /><span /><span />
                    </span>
                  </>
                ) : (
                  '🔊'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
