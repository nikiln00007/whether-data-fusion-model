/**
 * useWeather.js — Custom hook that fetches weather + forecast data
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
} from '../services/weatherApi';
import { groupForecastByDay, getDayHighLow, getDominantCondition } from '../utils/formatters';
import { themeFromWeather } from '../utils/themeFromWeather';

const DEFAULT_STATE = {
  current: null,
  forecast: null,
  dailyGroups: {},
  theme: 'clear',
  loading: false,
  error: null,
};

/**
 * @param {string} city  - city name (empty = no initial fetch)
 * @param {'metric'|'imperial'} units
 * @param {string} lang
 */
export function useWeather(city, units = 'metric', lang = 'en') {
  const [state, setState] = useState(DEFAULT_STATE);
  const abortRef = useRef(null);

  const load = useCallback(
    async (searchCity, lat, lon) => {
      // Cancel previous request
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const [current, forecastData] = await Promise.all([
          lat !== undefined
            ? fetchWeatherByCoords(lat, lon, units, lang, controller.signal)
            : fetchCurrentWeather(searchCity, units, lang, controller.signal),
          lat !== undefined
            ? fetchForecastByCoords(lat, lon, units, lang, controller.signal)
            : fetchForecast(searchCity, units, lang, controller.signal),
        ]);

        const tzOffset = current.timezone;
        const dailyGroups = groupForecastByDay(forecastData.list, tzOffset);

        // Determine if it's night at the searched location
        const nowUtc = Date.now() / 1000;
        const sunriseUtc = current.sys.sunrise;
        const sunsetUtc = current.sys.sunset;
        const isNight = nowUtc < sunriseUtc || nowUtc > sunsetUtc;

        const theme = themeFromWeather(
          current.weather[0].main,
          current.weather[0].id,
          current.main.temp,
          isNight
        );

        setState({
          current,
          forecast: forecastData,
          dailyGroups,
          theme,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;

        let message = 'An unexpected error occurred. Please try again.';
        if (err.response) {
          const status = err.response.status;
          if (status === 401) message = 'error_401';
          else if (status === 404) message = 'error_404';
          else if (status === 429) message = 'error_429';
          else message = 'error_generic';
        } else if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
          message = 'error_network';
        } else {
          message = 'error_generic';
        }

        setState(prev => ({ ...prev, loading: false, error: message }));
      }
    },
    [units, lang]
  );

  // Re-fetch when city changes
  useEffect(() => {
    if (city && city.trim()) load(city.trim());
  }, [city, load]);

  const retry = useCallback(() => {
    if (city && city.trim()) load(city.trim());
  }, [city, load]);

  const loadByCoords = useCallback(
    (lat, lon) => load(null, lat, lon),
    [load]
  );

  return { ...state, retry, loadByCoords };
}
