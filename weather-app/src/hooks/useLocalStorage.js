/**
 * useLocalStorage.js — Persistent state backed by localStorage
 */
import { useState, useEffect } from 'react';

/**
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key is absent
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // quota exceeded — silently ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
