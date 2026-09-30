/**
 * i18n/index.js — i18next initialization with all 10 languages
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ta from './ta.json';
import hi from './hi.json';
import te from './te.json';
import ml from './ml.json';
import kn from './kn.json';
import zh from './zh.json';
import es from './es.json';
import fr from './fr.json';
import ar from './ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta },
      hi: { translation: hi },
      te: { translation: te },
      ml: { translation: ml },
      kn: { translation: kn },
      zh: { translation: zh },
      es: { translation: es },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;

export const LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ta', label: 'தமிழ்', dir: 'ltr' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr' },
  { code: 'te', label: 'తెలుగు', dir: 'ltr' },
  { code: 'ml', label: 'മലയാളം', dir: 'ltr' },
  { code: 'kn', label: 'ಕನ್ನಡ', dir: 'ltr' },
  { code: 'zh', label: '中文', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
];
