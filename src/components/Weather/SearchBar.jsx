import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCitySuggestions } from '../../services/weatherApi';
import './SearchBar.css';

const POPULAR_CITIES = ['Chennai', 'London', 'Tokyo', 'New York', 'Paris', 'Dubai', 'Sydney'];

/**
 * SearchBar — City input with suggestions, quick-pick popular cities, Enter key, geolocation
 */
export default function SearchBar({ onSearch, loading }) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = useCallback((e) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) { setError('Please enter a city name.'); return; }
    setError('');
    setSuggestions([]);
    onSearch(trimmed);
  }, [value, onSearch]);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setError('');

    // Debounced suggestions
    clearTimeout(debounceRef.current);
    if (v.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await fetchCitySuggestions(v.trim());
          setSuggestions(results.slice(0, 5));
        } catch { setSuggestions([]); }
      }, 350);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (s) => {
    const name = `${s.name}${s.country ? ', ' + s.country : ''}`;
    setValue(name);
    setSuggestions([]);
    onSearch(s.name);
  };

  const handleQuickCity = (city) => {
    setValue(city);
    setError('');
    setSuggestions([]);
    onSearch(city);
  };

  const handleGeo = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        onSearch(null, pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setGeoLoading(false);
        setError('Location access denied.');
      }
    );
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest('.search-bar-wrap')?.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="search-bar-container">
      <form className="search-bar-wrap" onSubmit={handleSubmit} role="search" aria-label="City search">
        <div className="search-input-row">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            id="city-search-input"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={t('search_placeholder')}
            className="search-input"
            aria-label={t('search_placeholder')}
            aria-autocomplete="list"
            aria-expanded={suggestions.length > 0}
            autoComplete="off"
            disabled={loading}
          />
          <button
            type="submit"
            className="search-btn"
            disabled={loading}
            aria-label={t('search_btn')}
          >
            {loading ? <span className="spinner" aria-hidden="true"/> : t('search_btn')}
          </button>
          <button
            type="button"
            className="geo-btn"
            onClick={handleGeo}
            disabled={loading || geoLoading}
            title={t('use_location')}
            aria-label={t('use_location')}
          >
            {geoLoading ? <span className="spinner" aria-hidden="true"/> : '📍'}
          </button>
        </div>

        {error && <p className="search-error" role="alert" aria-live="polite">{error}</p>}

        {suggestions.length > 0 && (
          <ul className="suggestions-list" role="listbox" aria-label="City suggestions">
            {suggestions.map((s, i) => (
              <li key={i}
                role="option"
                tabIndex={0}
                className="suggestion-item"
                onClick={() => selectSuggestion(s)}
                onKeyDown={(e) => e.key === 'Enter' && selectSuggestion(s)}
              >
                <span className="suggestion-pin" aria-hidden="true">📍</span>
                <span>{s.name}{s.state ? `, ${s.state}` : ''}{s.country ? `, ${s.country}` : ''}</span>
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* Popular Quick Cities */}
      <div className="quick-cities-row" aria-label="Popular cities">
        <span className="quick-cities-label">Popular:</span>
        <div className="quick-cities-list">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              className="quick-city-chip"
              onClick={() => handleQuickCity(c)}
              disabled={loading}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
