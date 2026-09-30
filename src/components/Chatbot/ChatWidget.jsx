import React, { useState, useCallback, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../hooks/useChat';
import { useSpeech } from '../../hooks/useSpeech';
import './ChatWidget.css';

const ChatWindow = lazy(() => import('./ChatWindow'));

/**
 * ChatWidget — Floating button + lazily loaded chat panel
 */
export default function ChatWidget({ weather, language }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [autoRead, setAutoRead] = useState(false);

  const { messages, loading, send, clearChat } = useChat(weather, language);

  const handleVoiceResult = useCallback((text) => {
    send(text);
  }, [send]);

  const speech = useSpeech(language, handleVoiceResult);

  // Auto-read new assistant replies
  React.useEffect(() => {
    if (!autoRead || !messages.length) return;
    const last = messages[messages.length - 1];
    if (last.role === 'assistant' && !last.isError) {
      speech.speak(last.content, language);
    }
  }, [messages, autoRead, language]);

  const handleSend = useCallback((text) => {
    send(text);
  }, [send]);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          className="chat-fab"
          onClick={() => setOpen(true)}
          aria-label="Open weather assistant chat"
          aria-expanded={open}
        >
          <span className="chat-fab-icon" aria-hidden="true">🌦️</span>
          {messages.length > 0 && (
            <span className="chat-fab-badge" aria-label={`${messages.length} messages`}>
              {messages.length}
            </span>
          )}
          <span className="chat-fab-label">Ask AI</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="chat-panel" role="region" aria-label="Weather assistant">
          <Suspense fallback={<div className="chat-loading">Loading…</div>}>
            <ChatWindow
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onClose={() => setOpen(false)}
              speech={speech}
              autoRead={autoRead}
              onToggleAutoRead={() => setAutoRead(v => !v)}
            />
          </Suspense>
          <button className="chat-clear-btn" onClick={clearChat} aria-label={t('clear_history')}>
            {t('clear_history')}
          </button>
        </div>
      )}
    </>
  );
}
