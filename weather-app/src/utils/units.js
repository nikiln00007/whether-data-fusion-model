/**
 * units.js — Unit conversion helpers
 */

export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

export function fahrenheitToCelsius(f) {
  return ((f - 32) * 5) / 9;
}

export function msToMph(ms) {
  return ms * 2.237;
}

export function mphToMs(mph) {
  return mph / 2.237;
}
