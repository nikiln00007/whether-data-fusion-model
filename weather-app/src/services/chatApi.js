/**
 * chatApi.js — Proxied chat service
 * All LLM requests go through the local Express proxy so
 * the API key is never exposed in the browser bundle.
 */
import axios from 'axios';

const CHAT_URL = import.meta.env.VITE_CHAT_URL || '/api/chat';

/**
 * Send a message to the AI chatbot through the proxy.
 *
 * @param {Array} messages - Array of { role, content } objects
 * @param {object} weather  - Current weather + forecast data
 * @param {string} language - Language code (e.g. 'en', 'ta', 'hi')
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>} - The assistant's reply text
 */
export async function sendChatMessage(messages, weather, language, signal) {
  const { data } = await axios.post(
    CHAT_URL,
    { messages, weather, language },
    {
      signal,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return data.reply;
}
