import React, { useState, useCallback } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { formatVisibility } from '../../utils/formatters';
import SearchBar from './SearchBar';
import WeatherIllustration from './WeatherIllustration';
import HeroTemp from './HeroTemp';
import StatStrip from './StatStrip';
import RainCard from './RainCard';
import ForecastPills from './ForecastPills';
import HourlyChart from './HourlyChart';
import ErrorBanner from './ErrorBanner';
import { WeatherSkeleton } from './Skeleton';
import './Weather.css';

/**
 * Weather — Main weather display component.
 */
export default function Weather({ units, onUnitsToggle, lang, onWeatherLoaded, searchTriggerRef, favourites = [], onToggleFavourite }) {
  const [city, setCity] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);

  const { current, forecast, dailyGroups, theme, loading, error, retry, loadByCoords } =
    useWeather(city, units, lang);

  React.useEffect(() => {
    if (current && forecast) onWeatherLoaded?.({ current, forecast });
  }, [current, forecast]);

  React.useEffect(() => {
    const keys = Object.keys(dailyGroups);
    if (keys.length > 0 && (!selectedDay || !dailyGroups[selectedDay])) setSelectedDay(keys[0]);
  }, [dailyGroups]);

  const handleSearch = useCallback((name, lat, lon) => {
    setSelectedDay(null);
    if (lat !== undefined) { loadByCoords(lat, lon); setCity(''); }
    else setCity(name);
  }, [loadByCoords]);

  React.useEffect(() => {
    if (searchTriggerRef) searchTriggerRef.current = (name) => handleSearch(name);
  }, [handleSearch, searchTriggerRef]);

  const tzOffset = current?.timezone || 0;
  const selectedEntries = selectedDay ? dailyGroups[selectedDay] : null;
  const isFavourite = current ? favourites.includes(current.name) : false;

  return (
    <div className="weather-root">
      <ThemeApplier theme={theme} />

      <div className="weather-search-area">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {loading && <WeatherSkeleton />}

      {!loading && error && <ErrorBanner errorKey={error} onRetry={retry} />}

      {!loading && !error && !current && (
        <div className="weather-empty">
          <WeatherIllustration theme="clear" />
          <p className="weather-empty-text">Search a city to see weather info.</p>
        </div>
      )}

      {!loading && current && (
        <div className="weather-content">
          <section className="hero-section" aria-label="Current weather">
            <div className="city-label" aria-live="polite">
              <span aria-hidden="true">📍</span>
              <strong>{current.name}</strong>
              {current.sys?.country && <span className="city-country">, {current.sys.country}</span>}
              <button
                className={`fav-toggle-btn${isFavourite ? ' active' : ''}`}
                onClick={() => onToggleFavourite?.(current.name)}
                aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                title={isFavourite ? '★ Saved' : '☆ Save city'}
              >
                {isFavourite ? '⭐' : '☆'}
              </button>
            </div>
            <WeatherIllustration theme={theme} />
            <HeroTemp current={current} units={units} onUnitsToggle={onUnitsToggle} />
          </section>

          <StatStrip current={current} units={units} />

          <div className="cards-row">
            <RainCard
              current={current}
              forecastDay={selectedEntries || Object.values(dailyGroups)[0]}
            />
            <ExtraCard current={current} />
          </div>

          {Object.keys(dailyGroups).length > 0 && (
            <ForecastPills
              dailyGroups={dailyGroups}
              tzOffset={tzOffset}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              units={units}
            />
          )}

          {forecast?.list && (
            <HourlyChart
              entries={selectedEntries || []}
              fullForecast={forecast.list}
              selectedDayLabel={selectedDay}
              units={units}
              tzOffset={tzOffset}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ThemeApplier({ theme }) {
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'clear');
  }, [theme]);
  return null;
}

function ExtraCard({ current }) {
  return (
    <article className="extra-card glass-card" aria-label="Extra weather stats">
      <div className="extra-card-row">
        <span className="extra-card-icon" aria-hidden="true">👁️</span>
        <div>
          <div className="extra-card-label">Visibility</div>
          <div className="extra-card-val">{formatVisibility(current.visibility)}</div>
        </div>
      </div>
      <div className="extra-card-row">
        <span className="extra-card-icon" aria-hidden="true">🔵</span>
        <div>
          <div className="extra-card-label">Pressure</div>
          <div className="extra-card-val">{current.main.pressure} hPa</div>
        </div>
      </div>
      <div className="extra-card-row">
        <span className="extra-card-icon" aria-hidden="true">🌇</span>
        <div>
          <div className="extra-card-label">Sunset</div>
          <div className="extra-card-val">
            {new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </article>
  );
}
