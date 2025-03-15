/**
 * Constantes globales de l'application
 * Regroupe les valeurs et configurations utilisées dans toute l'application
 */

// Définit si l'application est en mode développement
// Note: Dans une vraie application React Native, cette valeur est automatiquement fournie
export const __DEV__ = true;

// Versions de l'application
export const APP_VERSION = '1.0.0';
export const API_VERSION = 'v1';

// Constantes relatives aux délais (en ms)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 secondes
  DEBOUNCE_SEARCH: 300, // 300ms
  ANIMATION_DURATION: 300, // 300ms pour les animations
  SWIPE_ANIMATION: 250, // 250ms pour l'animation de swipe
  TOAST_DURATION: 3000, // 3 secondes pour les notifications toast
};

// Limites et seuils
export const LIMITS = {
  MAX_MATCHES_PER_PAGE: 20,
  MAX_MESSAGES_PER_PAGE: 30,
  MAX_VEHICLES_PER_PAGE: 20,
  MIN_PASSWORD_LENGTH: 8,
  MAX_DESCRIPTION_LENGTH: 500,
};

// Clés de stockage local
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@Runner:authToken',
  USER_DATA: '@Runner:userData',
  FILTERS: '@Runner:filters',
  ONBOARDING_COMPLETED: '@Runner:onboardingCompleted',
  APP_THEME: '@Runner:appTheme',
  NOTIFICATIONS: '@Runner:notificationsEnabled',
};

// Regex de validation
export const VALIDATION_REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^(\+\d{1,3})?[0-9]{9,12}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Paramètres par défaut
export const DEFAULT_VALUES = {
  SEARCH_RADIUS: 50, // en km
  PRICE_RANGE: [1000, 50000], // en euros
  AGE_RANGE: [0, 30], // en années
  SORT_BY: 'newest',
  ITEMS_PER_PAGE: 20,
};

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: 'https://api.runner.com/v1',
  TIMEOUT: TIMEOUTS.API_REQUEST,
  AUTH_TOKEN_KEY: STORAGE_KEYS.AUTH_TOKEN,
};

export default {
  __DEV__,
  APP_VERSION,
  API_VERSION,
  TIMEOUTS,
  LIMITS,
  STORAGE_KEYS,
  VALIDATION_REGEX,
  DEFAULT_VALUES,
  API_CONFIG,
}; 