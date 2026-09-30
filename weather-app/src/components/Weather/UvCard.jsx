import React from 'react';
import { useTranslation } from 'react-i18next';
import './UvCard.css';

const UV_LEVELS = [
  { max: 2,  key: 'uv_low',       color: '#4caf50', dots: 1 },
  { max: 5,  key: 'uv_moderate',  color: '#ffeb3b', dots: 2 },
  { max: 7,  key: 'uv_high',      color: '#ff9800', dots: 3 },
  { max: 10, key: 'uv_very_high', color: '#f44336', dots: 4 },
  { max: 99, key: 'uv_extreme',   color: '#9c27b0', dots: 5 },
];

function getUvLevel(uvi) {
  return UV_LEVELS.find(l => uvi <= l.max) || UV_LEVELS[UV_LEVELS.length - 1];
}

export default function UvCard({ uvi }) {
  const { t } = useTranslation();
  if (uvi === null || uvi === undefined) return null;

  const level = getUvLevel(uvi);

  return (
    <article className="uv-card glass-card" aria-label={`UV Index: ${uvi}`}>
      <header className="card-header">
        <span className="card-icon" aria-hidden="true">☀️</span>
        <span className="card-title">{t('uv_index')}</span>
      </header>
      <div className="uv-value" style={{ color: level.color }}>{Math.round(uvi)}</div>
      <div className="uv-dots" aria-label={`UV level ${level.dots} of 5`} role="img">
        {[1,2,3,4,5].map(i => (
          <span key={i} className="uv-dot"
            style={{ background: i <= level.dots ? level.color : 'rgba(0,0,0,0.12)' }}
          />
        ))}
      </div>
      <p className="uv-advice">{t(level.key)}</p>
    </article>
  );
}
