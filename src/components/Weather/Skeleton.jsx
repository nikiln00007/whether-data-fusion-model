import React from 'react';
import './Skeleton.css';

export function SkeletonBlock({ width = '100%', height = '20px', radius = '8px', style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  );
}

export function WeatherSkeleton() {
  return (
    <div className="skeleton-weather" aria-label="Loading weather data…" role="status">
      <div className="skeleton-hero">
        <SkeletonBlock width="180px" height="180px" radius="50%" style={{ margin: '0 auto' }} />
        <SkeletonBlock width="140px" height="100px" radius="16px" style={{ margin: '16px auto 0' }} />
        <SkeletonBlock width="100px" height="20px" radius="8px" style={{ margin: '8px auto 0' }} />
      </div>
      <div className="skeleton-strip">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-stat-item">
            <SkeletonBlock width="36px" height="36px" radius="50%" />
            <SkeletonBlock width="60px" height="14px" radius="6px" style={{ marginTop: '8px' }} />
            <SkeletonBlock width="48px" height="18px" radius="6px" style={{ marginTop: '4px' }} />
          </div>
        ))}
      </div>
      <div className="skeleton-cards">
        <SkeletonBlock width="100%" height="120px" radius="20px" />
        <SkeletonBlock width="100%" height="120px" radius="20px" />
      </div>
      <SkeletonBlock width="100%" height="160px" radius="20px" style={{ marginTop: '16px' }} />
      <SkeletonBlock width="100%" height="140px" radius="20px" style={{ marginTop: '16px' }} />
    </div>
  );
}
