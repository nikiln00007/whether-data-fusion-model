/**
 * useSpeech.js — Web Speech API: recognition (STT) + ElevenLabs AI Voice (TTS) with fallback
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const LANG_LOCALES = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  zh: 'zh-CN',
  es: 'es-ES',
  fr: 'fr-FR',
  ar: 'ar-SA',
};

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition || null
    : null;

/**
 * @param {string} lang  - i18n language code
 * @param {function} onResult - callback(transcript: string)
 */
export function useSpeech(lang = 'en', onResult) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [micError, setMicError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  const isSupported = Boolean(SpeechRecognition);

  // --- STT (Speech-to-Text) ---
  const startListening = useCallback(() => {
    if (!SpeechRecognition) return;
    setMicError(null);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_LOCALES[lang] || 'en-IN';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };
    recognition.onerror = (e) => {
      setListening(false);
      setInterim('');
      if (e.error === 'not-allowed') setMicError('mic_denied');
      else if (e.error === 'no-speech') setMicError('mic_no_speech');
      else setMicError('mic_error');
    };
    recognition.onresult = (e) => {
      let interimText = '';
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interimText += e.results[i][0].transcript;
      }
      setInterim(interimText);
      if (finalText) {
        onResult?.(finalText.trim());
        setInterim('');
      }
    };

    try {
      recognition.start();
    } catch {
      setMicError('mic_error');
    }
  }, [lang, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim('');
  }, []);

  // --- Native Browser Fallback TTS ---
  const fallbackSpeak = useCallback((text, speechLang = lang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_LOCALES[speechLang] || 'en-IN';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const locale = LANG_LOCALES[speechLang] || 'en-IN';
    const match =
      voices.find(v => v.lang === locale) ||
      voices.find(v => v.lang.startsWith(locale.split('-')[0]));
    if (match) utterance.voice = match;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [lang]);

  // --- TTS (ElevenLabs realistic audio with seamless browser fallback) ---
  const speak = useCallback(async (text, speechLang = lang) => {
    if (!text) return;

    // Stop currently playing audio or speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: speechLang }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          fallbackSpeak(text, speechLang);
        };

        await audio.play();
        return;
      }
    } catch {
      // Fall back seamlessly
    }

    fallbackSpeak(text, speechLang);
  }, [lang, fallbackSpeak]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    isSupported,
    listening,
    interim,
    micError,
    speaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
