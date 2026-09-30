import React from 'react';
import { useTranslation } from 'react-i18next';
import './HeroTemp.css';

/**
 * HeroTemp — Large interactive temperature display + feels-like + condition description
 */
export default function HeroTemp({ current, units, onUnitsToggle }) {
  const { t } = useTranslation();

  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const unit = units === 'metric' ? 'C' : 'F';
  const targetUnit = units === 'metric' ? '°F' : '°C';
  const description = current.weather[0].description;
  const desc = description.charAt(0).toUpperCase() + description.slice(1);

  return (
    <div className="hero-temp" aria-label={`Temperature: ${temp} degrees ${unit}`}>
      <button
        type="button"
        className="hero-temp-main-btn"
        onClick={onUnitsToggle}
        title={`Click to switch to ${targetUnit}`}
        aria-label={`Current temperature ${temp}°${unit}. Click to switch to ${targetUnit}`}
      >
        <span className="hero-temp-value">{temp}</span>
        <sup className="hero-temp-unit">°{unit}</sup>
      </button>

      <p className="hero-description">{desc}</p>
      <p className="hero-feels-like">
        {t('feels_like')}: <strong>{feelsLike}°{unit}</strong>
      </p>
    </div>
  );
}
