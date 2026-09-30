import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MessageBubble from './MessageBubble';
import VoiceButton from './VoiceButton';
import './ChatWindow.css';

const DEFAULT_QUICK_QUESTIONS = [
  { icon: '☔', text: 'Will it rain today?' },
  { icon: '👕', text: 'What should I wear today?' },
  { icon: '💨', text: 'How is the wind and humidity?' },
  { icon: '☀️', text: 'What is the UV index and should I wear sunscreen?' },
  { icon: '🌅', text: 'What time is sunrise and sunset?' },
  { icon: '📅', text: 'Summarize the 5-day forecast.' },
];

export default function ChatWindow({
  messages,
  loading,
  onSend,
  onClose,
  speech,
  autoRead,
  onToggleAutoRead,
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleChipClick = (questionText) => {
    onSend(questionText);
  };

  const handleVoiceResult = (transcript) => {
    onSend(transcript);
  };

  return (
    <div className="chat-window" role="dialog" aria-label={t('chat_title')} aria-modal="true">
      {/* Header */}
      <header className="chat-header">
        <div className="chat-header-left">
          <span className="chat-avatar" aria-hidden="true">🌦️</span>
          <div>
            <div className="chat-title-row">
              <span className="chat-title">{t('chat_title')}</span>
              {speech.speaking && (
                <span className="header-speaking-badge" title="AI Voice Active">
                  <span className="speaking-wave" /><span className="speaking-wave" /><span className="speaking-wave" />
                </span>
              )}
            </div>
            <div className="chat-subtitle">ElevenLabs AI Voice · Groq Fast LLM</div>
          </div>
        </div>
        <div className="chat-header-actions">
          <button
            className={`auto-read-btn${autoRead ? ' active' : ''}`}
            onClick={onToggleAutoRead}
            title={autoRead ? 'Auto-voice read enabled' : 'Auto-voice read disabled'}
            aria-label={t('auto_read')}
            aria-pressed={autoRead}
          >
            {autoRead ? '🔊' : '🔇'}
          </button>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">✕</button>
        </div>
      </header>

      {/* Messages */}
      <div className="chat-messages" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span className="chat-empty-icon" aria-hidden="true">🌤️</span>
            <div className="chat-empty-title">Weather Assistant Ready</div>
            <p className="chat-empty-sub">
              Ask any question in your language about rain, temperatures, clothing advice, or upcoming forecasts.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            onSpeak={(text) => speech.speak(text)}
            onStop={speech.stopSpeaking}
            speaking={speech.speaking}
          />
        ))}

        {loading && (
          <div className="typing-indicator-wrap">
            <span className="typing-avatar">🌦️</span>
            <div className="typing-indicator" aria-label="Assistant is thinking">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips (Always available!) */}
      <div className="quick-chips-bar" role="region" aria-label="Quick questions">
        <div className="quick-chips-scroll">
          {DEFAULT_QUICK_QUESTIONS.map((chip, idx) => (
            <button
              key={idx}
              className="quick-chip-btn"
              onClick={() => handleChipClick(chip.text)}
              disabled={loading}
            >
              <span className="chip-icon">{chip.icon}</span>
              <span className="chip-text">{chip.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <form className="chat-input-area" onSubmit={handleSubmit}>
        {speech.isSupported && (
          <VoiceButton
            listening={speech.listening}
            interim={speech.interim}
            error={speech.micError}
            onStart={speech.startListening}
            onStop={speech.stopListening}
            onResult={handleVoiceResult}
          />
        )}
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          value={speech.interim || input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={speech.listening ? 'Listening to your voice…' : t('type_message')}
          aria-label={t('type_message')}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
          }}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={loading || (!input.trim() && !speech.interim)}
          aria-label={t('send')}
          title="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
