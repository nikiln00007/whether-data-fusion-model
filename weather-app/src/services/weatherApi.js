/**
 * weatherApi.js — OpenWeatherMap service layer
 * All API calls go through here; the key is read from env vars.
 */
import axios from 'axios';

const BASE = 'https://api.openweathermap.org';
const KEY = import.meta.env.VITE_WEATHER_KEY;

/** Shared axios instance with a 10s timeout */
const api = axios.create({ baseURL: BASE, timeout: 10000 });

/**
 * Fetch current weather for a city name.
 * @param {string} city
 * @param {'metric'|'imperial'} units
 * @param {string} lang  - two-letter ISO code
 * @param {AbortSignal} [signal]
 */
export async function fetchCurrentWeather(city, units = 'metric', lang = 'en', signal) {
  const { data } = await api.get(
    `/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${KEY}&units=${units}&lang=${lang}`,
    { signal }
  );
  return data;
}

/**
 * Fetch current weather by coordinates (geolocation).
 */
export async function fetchWeatherByCoords(lat, lon, units = 'metric', lang = 'en', signal) {
  const { data } = await api.get(
    `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=${units}&lang=${lang}`,
    { signal }
  );
  return data;
}

/**
 * Fetch 5-day / 3-hour forecast for a city.
 */
export async function fetchForecast(city, units = 'metric', lang = 'en', signal) {
  const { data } = await api.get(
    `/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${KEY}&units=${units}&lang=${lang}`,
    { signal }
  );
  return data;
}

/**
 * Fetch 5-day / 3-hour forecast by coordinates.
 */
export async function fetchForecastByCoords(lat, lon, units = 'metric', lang = 'en', signal) {
  const { data } = await api.get(
    `/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=${units}&lang=${lang}`,
    { signal }
  );
  return data;
}

/**
 * Geocoding: get up to 5 city suggestions.
 */
export async function fetchCitySuggestions(query, signal) {
  const { data } = await api.get(
    `/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${KEY}`,
    { signal }
  );
  return data;
}
