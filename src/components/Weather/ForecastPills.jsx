import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDayLabel, getDayHighLow, getDominantCondition, toLocalDate } from '../../utils/formatters';
import './ForecastPills.css';

const CONDITION_EMOJIS = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️',
  Haze: '🌫️', Dust: '💨', Smoke: '💨', default: '🌤️',
};

export default function ForecastPills({ dailyGroups, tzOffset, selectedDay, onSelectDay, units }) {
  const { t } = useTranslation();
  const unit = units === 'metric' ? 'C' : 'F';

  const days = Object.entries(dailyGroups).slice(0, 5);

  return (
    <section className="forecast-section glass-card" aria-label="5-day forecast">
      <h2 className="forecast-title">{t('five_day_forecast')}</h2>
      <div className="forecast-pills-row" role="tablist" aria-label="Select day">
        {days.map(([dateKey, entries], i) => {
          const { high, low } = getDayHighLow(entries);
          const cond = getDominantCondition(entries);
          const emoji = CONDITION_EMOJIS[cond.main] || CONDITION_EMOJIS.default;
          const label = formatDayLabel(entries[0].dt, tzOffset, t);
          const isSelected = dateKey === selectedDay;

          return (
            <button
              key={dateKey}
              role="tab"
              aria-selected={isSelected}
              className={`forecast-pill${isSelected ? ' selected' : ''}`}
              onClick={() => onSelectDay(dateKey)}
              aria-label={`${label}: high ${high}°${unit}, low ${low}°${unit}`}
            >
              <span className="pill-day">{label}</span>
              <span className="pill-emoji" aria-hidden="true">{emoji}</span>
              <span className="pill-temps">{high}/{low}°</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
