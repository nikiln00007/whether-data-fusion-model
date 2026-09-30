import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatVisibility } from '../../utils/formatters';
import './UvCard.css';

/**
 * RainCard — Shows rain probability or (if raining) a rainfall gauge + extra stats
 */
export default function RainCard({ current, forecastDay }) {
  const { t } = useTranslation();

  const isRaining = ['Rain', 'Drizzle', 'Thunderstorm'].includes(current.weather[0].main);
  const rainRate = current.rain?.['1h'] ?? null;
  const pop = forecastDay
    ? Math.round(Math.max(...forecastDay.map(e => (e.pop || 0))) * 100)
    : 0;
  const visibility = current.visibility;
  const pressure = current.main.pressure;

  if (isRaining && rainRate !== null) {
    // Gauge mode
    const fillPct = Math.min(100, (rainRate / 10) * 100); // 10 mm/h = full
    return (
      <article className="rain-card glass-card" aria-label="Rainfall rate">
        <header className="card-header">
          <span className="card-icon" aria-hidden="true">🌧️</span>
          <span className="card-title">{t('rainfall_rate')}</span>
        </header>
        <div className="rain-gauge-wrap">
          <div className="rain-gauge-tube" aria-label={`Rainfall ${rainRate} mm/h`} role="img">
            <div className="rain-gauge-fill" style={{ height: `${fillPct}%` }} />
          </div>
          <div className="rain-gauge-info">
            <span className="rain-gauge-label">mm/h</span>
            <span className="rain-gauge-val">{rainRate.toFixed(1)}</span>
          </div>
        </div>
        <div className="extra-stats">
          <div className="extra-stat-row">
            <span className="extra-stat-label">{t('visibility')}</span>
            <span className="extra-stat-val">{formatVisibility(visibility)}</span>
          </div>
          <div className="vis-bar-track" role="img" aria-label={`Visibility ${formatVisibility(visibility)}`}>
            <div className="vis-bar-fill" style={{ width: `${Math.min(100, (visibility / 10000) * 100)}%` }} />
          </div>
          <div className="extra-stat-row" style={{marginTop:'4px'}}>
            <span className="extra-stat-label">{t('pressure')}</span>
            <span className="extra-stat-val">{pressure} hPa</span>
          </div>
        </div>
      </article>
    );
  }

  // Normal mode — rain probability
  return (
    <article className="rain-card glass-card" aria-label={`Rain probability ${pop}%`}>
      <header className="card-header">
        <span className="card-icon" aria-hidden="true">☂️</span>
        <span className="card-title">{t('rain_prob')}</span>
      </header>
      <div className="rain-prob-value">{pop}%</div>
      <p className="rain-advice">{pop >= 50 ? t('umbrella_yes') : t('umbrella_no')}</p>
    </article>
  );
}
