/**
 * themeFromWeather.js — Maps OWM condition codes to UI themes
 */

/**
 * Returns a theme name based on weather condition id/main and local hour.
 * @param {string} main  - weather[0].main
 * @param {number} id    - weather[0].id
 * @param {number} temp  - current temperature (metric)
 * @param {boolean} isNight
 * @returns {string} theme name
 */
export function themeFromWeather(main = '', id = 800, temp = 20, isNight = false) {
  if (isNight) return 'night';
  if (temp >= 38) return 'hot';

  const m = main.toLowerCase();

  if (m === 'thunderstorm') return 'thunderstorm';
  if (m === 'drizzle' || m === 'rain') return 'rain';
  if (m === 'snow') return 'snow';
  if (m === 'fog' || m === 'mist' || m === 'haze' || m === 'smoke' || m === 'dust' || m === 'sand' || m === 'ash' || m === 'squall' || m === 'tornado') return 'fog';

  // Clear and clouds → default (clear/sunny)
  return 'clear';
}

/**
 * Maps theme name to a human-readable label.
 */
export const THEME_LABELS = {
  clear: 'Clear',
  thunderstorm: 'Thunderstorm',
  rain: 'Rainy',
  snow: 'Snowy',
  fog: 'Foggy',
  night: 'Night',
  hot: 'Hot',
};
