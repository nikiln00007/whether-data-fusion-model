import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toLocalDate } from '../../utils/formatters';
import './HourlyChart.css';

const CONDITION_EMOJIS = {
  Clear: '☀️',
  Clouds: '⛅',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️',
  default: '🌤️',
};

export default function HourlyChart({ entries = [], fullForecast = [], selectedDayLabel, units, tzOffset = 0 }) {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState('24h'); // '24h' or 'day'
  const unit = units === 'metric' ? '°C' : '°F';

  // Determine which entries to display
  const displayEntries = useMemo(() => {
    if (viewMode === '24h' && fullForecast && fullForecast.length > 0) {
      // Show next 24 hours (8 intervals of 3 hours)
      return fullForecast.slice(0, 8);
    }
    // If day entries has enough items, use it; otherwise fallback to next 24h
    if (entries && entries.length >= 4) {
      return entries;
    }
    return fullForecast && fullForecast.length > 0 ? fullForecast.slice(0, 8) : entries;
  }, [viewMode, fullForecast, entries]);

  const hourlyData = useMemo(() => {
    if (!displayEntries || displayEntries.length === 0) return [];

    const nowH = new Date().getHours();

    return displayEntries.map((entry, idx) => {
      const d = toLocalDate(entry.dt, tzOffset);
      const h = d.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      const label = `${h12} ${ampm}`;

      const mainCond = entry.weather?.[0]?.main || 'Clear';
      const desc = entry.weather?.[0]?.description || '';
      const isNightHour = h < 6 || h >= 19;
      const emoji = isNightHour && mainCond === 'Clear'
        ? '🌙'
        : (CONDITION_EMOJIS[mainCond] || CONDITION_EMOJIS.default);

      const pop = Math.round((entry.pop || 0) * 100);

      return {
        label,
        fullDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.round(entry.main.temp),
        feelsLike: Math.round(entry.main.feels_like),
        humidity: entry.main.humidity,
        wind: Math.round(entry.wind.speed),
        pop,
        condition: desc.charAt(0).toUpperCase() + desc.slice(1),
        emoji,
        isNow: idx === 0,
      };
    });
  }, [displayEntries, tzOffset]);

  if (hourlyData.length === 0) return null;

  const temps = hourlyData.map(d => d.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const range = maxTemp - minTemp || 1;

  const selectedItem = hourlyData[activeIdx] || hourlyData[0];

  return (
    <section className="hourly-section glass-card" aria-label="Hourly temperature forecast">
      <div className="hourly-header">
        <div>
          <h2 className="hourly-title">{t('hourly_forecast')}</h2>
          <p className="hourly-subtitle">
            {viewMode === '24h' ? 'Next 24 Hours Timeline' : `${selectedDayLabel || 'Day'} Forecast`}
          </p>
        </div>

        {fullForecast && fullForecast.length > 8 && (
          <div className="hourly-toggle-wrap" role="group" aria-label="Forecast view mode">
            <button
              className={`hourly-toggle-btn${viewMode === '24h' ? ' active' : ''}`}
              onClick={() => { setViewMode('24h'); setActiveIdx(0); }}
            >
              24 Hours
            </button>
            <button
              className={`hourly-toggle-btn${viewMode === 'day' ? ' active' : ''}`}
              onClick={() => { setViewMode('day'); setActiveIdx(0); }}
            >
              Selected Day
            </button>
          </div>
        )}
      </div>

      {/* Interactive Detail Card for Hovered/Clicked Hour */}
      {selectedItem && (
        <div className="hourly-detail-panel" aria-live="polite">
          <div className="detail-panel-left">
            <span className="detail-emoji" aria-hidden="true">{selectedItem.emoji}</span>
            <div>
              <div className="detail-time-row">
                <strong className="detail-time">{selectedItem.label}</strong>
                <span className="detail-date">{selectedItem.fullDate}</span>
              </div>
              <div className="detail-condition">{selectedItem.condition}</div>
            </div>
          </div>

          <div className="detail-panel-stats">
            <div className="detail-stat">
              <span className="detail-stat-label">Temp</span>
              <span className="detail-stat-val highlight">{selectedItem.temp}{unit}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Feels like</span>
              <span className="detail-stat-val">{selectedItem.feelsLike}{unit}</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Rain chance</span>
              <span className="detail-stat-val">{selectedItem.pop}%</span>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-label">Wind</span>
              <span className="detail-stat-val">{selectedItem.wind} m/s</span>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Bar Timeline */}
      <div className="hourly-scroll" role="list">
        {hourlyData.map((d, i) => {
          // Calculate proportional bar height between 30% and 92%
          const fillPct = Math.round(((d.temp - minTemp) / range) * 58 + 32);
          const isSelected = i === activeIdx;

          return (
            <button
              key={i}
              type="button"
              className={`hourly-bar-col${isSelected ? ' active' : ''}${d.isNow ? ' now' : ''}`}
              onClick={() => setActiveIdx(i)}
              onMouseEnter={() => setActiveIdx(i)}
              role="listitem"
              aria-label={`${d.label}: ${d.temp}${unit}, ${d.condition}`}
              aria-pressed={isSelected}
            >
              {/* Temp + condition icon */}
              <div className="bar-top-stack">
                <span className="bar-emoji" aria-hidden="true">{d.emoji}</span>
                <span className="bar-label-top">{d.temp}°</span>
              </div>

              {/* Bar track and animated fill */}
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ height: `${fillPct}%` }}
                />
              </div>

              {/* Rain prob badge if rain is forecasted */}
              {d.pop > 0 && (
                <span className="bar-rain-badge">💧{d.pop}%</span>
              )}

              {/* Hour label */}
              <span className="bar-label-bottom">
                {d.isNow ? 'Now' : d.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
