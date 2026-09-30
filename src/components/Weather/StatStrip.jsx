import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime, formatWind } from '../../utils/formatters';
import './StatStrip.css';

const StatItem = ({ icon, label, value }) => (
  <div className="stat-item">
    <span className="stat-icon" aria-hidden="true">{icon}</span>
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
);

/**
 * StatStrip — 3-column card: Humidity, Wind, Sunrise
 */
export default function StatStrip({ current, units }) {
  const { t } = useTranslation();
  const tz = current.timezone;

  return (
    <section className="stat-strip glass-card" aria-label="Weather statistics">
      <StatItem
        icon="💧"
        label={t('humidity')}
        value={`${current.main.humidity}%`}
      />
      <div className="stat-divider" aria-hidden="true" />
      <StatItem
        icon="💨"
        label={t('wind')}
        value={formatWind(current.wind.speed, units)}
      />
      <div className="stat-divider" aria-hidden="true" />
      <StatItem
        icon="🌅"
        label={t('sunrise')}
        value={formatTime(current.sys.sunrise, tz)}
      />
    </section>
  );
}
