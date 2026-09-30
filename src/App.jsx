import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LANGUAGES } from './i18n/index';
import Header from './components/Layout/Header';
import Weather from './components/Weather/Weather';
import './i18n/index';
import './index.css';

/** Simple React error boundary */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:'2rem',textAlign:'center',fontFamily:'Inter,sans-serif'}}>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}
            style={{marginTop:'1rem',padding:'8px 24px',borderRadius:'24px',background:'#5EB6FF',color:'#fff',border:'none',cursor:'pointer'}}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { i18n } = useTranslation();

  const [units, setUnits] = useLocalStorage('weather_units', 'metric');
  const [language, setLanguage] = useLocalStorage('weather_lang', 'en');
  const [favourites, setFavourites] = useLocalStorage('weather_favs', []);
  const [weatherData, setWeatherData] = useState(null);
  const [currentCity, setCurrentCity] = useState('');

  // Keep a ref to the search trigger for favourite selection
  const searchTriggerRef = useRef(null);

  const handleUnitsToggle = useCallback(() => {
    setUnits(u => u === 'metric' ? 'imperial' : 'metric');
  }, [setUnits]);

  const handleLanguageChange = useCallback((code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    // RTL for Arabic
    const lang = LANGUAGES.find(l => l.code === code);
    document.documentElement.setAttribute('dir', lang?.dir || 'ltr');
    document.documentElement.setAttribute('lang', code);
  }, [i18n, setLanguage]);

  // Called from Weather when data loads
  const handleWeatherLoaded = useCallback((data) => {
    setWeatherData(data);
    if (data?.current?.name) setCurrentCity(data.current.name);
  }, []);

  // Toggle favourite city
  const toggleFavourite = useCallback((city) => {
    if (!city) return;
    setFavourites(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
  }, [setFavourites]);

  const handleSelectFavourite = useCallback((city) => {
    searchTriggerRef.current?.(city);
  }, []);

  const handleRemoveFavourite = useCallback((city) => {
    setFavourites(prev => prev.filter(c => c !== city));
  }, [setFavourites]);

  return (
    <ErrorBoundary>
      <div className="app-wrapper" lang={language}>
        {/* Animated background blobs */}
        <div className="bg-blob bg-blob-1" aria-hidden="true" />
        <div className="bg-blob bg-blob-2" aria-hidden="true" />
        <div className="bg-blob bg-blob-3" aria-hidden="true" />

        <Header
          units={units}
          onUnitsToggle={handleUnitsToggle}
          language={language}
          onLanguageChange={handleLanguageChange}
          favourites={favourites}
          onSelectFavourite={handleSelectFavourite}
          onRemoveFavourite={handleRemoveFavourite}
        />

        <main className="app-main" aria-label="Weather dashboard">
          <div className="app-container">
            <Weather
              units={units}
              onUnitsToggle={handleUnitsToggle}
              lang={language}
              onWeatherLoaded={handleWeatherLoaded}
              searchTriggerRef={searchTriggerRef}
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
              currentCity={currentCity}
            />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
