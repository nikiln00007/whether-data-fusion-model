/**
 * useChat.js — Chat state management and API communication
 */
import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/chatApi';

export function useChat(weather, language = 'en') {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const send = useCallback(
    async (userText) => {
      if (!userText.trim()) return;

      const userMsg = { role: 'user', content: userText.trim(), ts: Date.now() };
      setMessages(prev => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      // Keep last 10 turns for context
      const recentHistory = [...messages, userMsg].slice(-10);

      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const reply = await sendChatMessage(
          recentHistory.map(m => ({ role: m.role, content: m.content })),
          weather,
          language,
          controller.signal
        );

        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: reply, ts: Date.now() },
        ]);
      } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') return;
        setError('chat_error');
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: '⚠️ Assistant unavailable. Please try again.', ts: Date.now(), isError: true },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, weather, language]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, send, clearChat };
}
