/**
 * formatters.js — Date, time, and unit formatting helpers
 */

/**
 * Convert a Unix timestamp + UTC offset seconds to a local Date object.
 * @param {number} unixTs  - Unix timestamp (seconds)
 * @param {number} tzOffset - timezone offset in seconds (from OWM)
 */
export function toLocalDate(unixTs, tzOffset) {
  const utcMs = unixTs * 1000 + (new Date().getTimezoneOffset() * 60 * 1000);
  return new Date(utcMs + tzOffset * 1000);
}

/**
 * Format a Unix timestamp to HH:MM (12 or 24h).
 */
export function formatTime(unixTs, tzOffset, use12h = true) {
  const d = toLocalDate(unixTs, tzOffset);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  if (!use12h) return `${String(h).padStart(2, '0')}:${m}`;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/**
 * Format a day label: 'Today', 'Tomorrow', or short weekday name.
 */
export function formatDayLabel(unixTs, tzOffset, t) {
  const now = new Date();
  const d = toLocalDate(unixTs, tzOffset);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (target.getTime() === today.getTime()) return t ? t('today') : 'Today';
  if (target.getTime() === tomorrow.getTime()) return t ? t('tomorrow') : 'Tomorrow';
  return d.toLocaleDateString('en', { weekday: 'short' });
}

/**
 * Convert visibility in metres to km string.
 */
export function formatVisibility(metres) {
  if (metres >= 1000) return `${(metres / 1000).toFixed(1)} km`;
  return `${metres} m`;
}

/**
 * Round a temperature value.
 */
export function formatTemp(val, units = 'metric') {
  const rounded = Math.round(val);
  return `${rounded}°${units === 'metric' ? 'C' : 'F'}`;
}

/**
 * Group OWM forecast list entries by date (YYYY-MM-DD).
 * @param {Array} list  - OWM forecast list
 * @param {number} tzOffset
 * @returns {Object} { 'YYYY-MM-DD': [...entries] }
 */
export function groupForecastByDay(list, tzOffset = 0) {
  return list.reduce((acc, entry) => {
    const d = toLocalDate(entry.dt, tzOffset);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});
}

/**
 * Get daily high and low from a group of forecast entries.
 */
export function getDayHighLow(entries) {
  const temps = entries.map(e => e.main.temp);
  return { high: Math.round(Math.max(...temps)), low: Math.round(Math.min(...temps)) };
}

/**
 * Format wind speed with unit label.
 */
export function formatWind(speed, units = 'metric') {
  return units === 'metric' ? `${speed.toFixed(1)} m/s` : `${speed.toFixed(1)} mph`;
}

/**
 * Get the dominant weather condition from an array of entries.
 */
export function getDominantCondition(entries) {
  if (!entries || entries.length === 0) return { main: 'Clear', id: 800, icon: '01d', description: '' };
  // Pick the midday entry or the first one
  const midday = entries.find(e => {
    const h = new Date(e.dt * 1000).getHours();
    return h >= 11 && h <= 14;
  });
  const entry = midday || entries[Math.floor(entries.length / 2)];
  return entry.weather[0];
}
