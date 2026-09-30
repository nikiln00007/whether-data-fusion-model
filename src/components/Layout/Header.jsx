import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n/index';
import './Header.css';

export default function Header({
  units, onUnitsToggle,
  language, onLanguageChange,
  favourites, onSelectFavourite, onRemoveFavourite,
}) {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="app-header" role="banner">
        <div className="header-brand">
          <span className="header-logo" aria-hidden="true">🌤️</span>
          <span className="header-title">WeatherVibe</span>
        </div>
        <nav className="header-nav" aria-label="App navigation">
          <button
            className="units-toggle"
            onClick={onUnitsToggle}
            aria-label={`Switch to ${units === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
          >
            °{units === 'metric' ? 'C' : 'F'}
          </button>
          <button
            className="menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open settings"
            aria-expanded={drawerOpen}
          >
            <span className="hamburger-line" /><span className="hamburger-line" /><span className="hamburger-line" />
          </button>
        </nav>
      </header>

      {/* Settings Drawer */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} role="presentation">
          <aside
            className="drawer"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label={t('settings')}
            aria-modal="true"
          >
            <div className="drawer-header">
              <h2 className="drawer-title">{t('settings')}</h2>
              <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close settings">✕</button>
            </div>

            <div className="drawer-section">
              <label className="drawer-label">{t('units')}</label>
              <div className="units-row">
                <button
                  className={`unit-btn${units === 'metric' ? ' active' : ''}`}
                  onClick={() => { onUnitsToggle(); if (units !== 'metric') setDrawerOpen(false); }}
                  aria-pressed={units === 'metric'}
                >°C Metric</button>
                <button
                  className={`unit-btn${units === 'imperial' ? ' active' : ''}`}
                  onClick={() => { onUnitsToggle(); if (units !== 'imperial') setDrawerOpen(false); }}
                  aria-pressed={units === 'imperial'}
                >°F Imperial</button>
              </div>
            </div>

            <div className="drawer-section">
              <label className="drawer-label" htmlFor="lang-select">{t('language')}</label>
              <select
                id="lang-select"
                className="lang-select"
                value={language}
                onChange={e => onLanguageChange(e.target.value)}
                aria-label="Select language"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>

            {favourites.length > 0 && (
              <div className="drawer-section">
                <label className="drawer-label">{t('saved_cities')}</label>
                <ul className="fav-list">
                  {favourites.map(city => (
                    <li key={city} className="fav-item">
                      <button
                        className="fav-city-btn"
                        onClick={() => { onSelectFavourite(city); setDrawerOpen(false); }}
                      >
                        <span aria-hidden="true">⭐</span> {city}
                      </button>
                      <button
                        className="fav-remove-btn"
                        onClick={() => onRemoveFavourite(city)}
                        aria-label={`Remove ${city} from favourites`}
                      >✕</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
