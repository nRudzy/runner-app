/**
 * Repository pour gérer les préférences utilisateur et les filtres
 */

import ApiClient from '../datasources/ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchFilter, SearchPreferences, UserSettings, VehiclePreferences } from '../../domain/entities/Models';

// Clés pour le stockage local
const STORAGE_KEYS = {
  APP_THEME: 'app_theme',
  SEARCH_HISTORY: 'search_history',
  LAST_USED_FILTER: 'last_used_filter',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  NOTIFICATION_SETTINGS: 'notification_settings',
  LANGUAGE: 'app_language',
};

class UserPreferencesRepository {
  // Récupérer les préférences de recherche depuis l'API
  async getSearchPreferences(): Promise<SearchPreferences> {
    const response = await ApiClient.get<SearchPreferences>('/user/search-preferences');
    return response.data;
  }

  // Mettre à jour les préférences de recherche
  async updateSearchPreferences(preferences: Partial<SearchPreferences>): Promise<SearchPreferences> {
    const response = await ApiClient.put<SearchPreferences>('/user/search-preferences', preferences);
    return response.data;
  }

  // Récupérer les filtres de recherche sauvegardés
  async getSavedFilters(): Promise<SearchFilter[]> {
    const response = await ApiClient.get<SearchFilter[]>('/user/filters');
    return response.data;
  }

  // Sauvegarder un nouveau filtre
  async saveFilter(filter: Omit<SearchFilter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<SearchFilter> {
    const response = await ApiClient.post<SearchFilter>('/user/filters', filter);
    return response.data;
  }

  // Mettre à jour un filtre existant
  async updateFilter(filterId: string, filter: Partial<SearchFilter>): Promise<SearchFilter> {
    const response = await ApiClient.put<SearchFilter>(`/user/filters/${filterId}`, filter);
    return response.data;
  }

  // Supprimer un filtre
  async deleteFilter(filterId: string): Promise<void> {
    await ApiClient.delete(`/user/filters/${filterId}`);
  }

  // Récupérer les préférences de véhicules pour le swipe
  async getVehiclePreferences(): Promise<VehiclePreferences> {
    const response = await ApiClient.get<VehiclePreferences>('/user/vehicle-preferences');
    return response.data;
  }

  // Mettre à jour les préférences de véhicules
  async updateVehiclePreferences(preferences: Partial<VehiclePreferences>): Promise<VehiclePreferences> {
    const response = await ApiClient.put<VehiclePreferences>('/user/vehicle-preferences', preferences);
    return response.data;
  }

  // Récupérer les paramètres utilisateur
  async getUserSettings(): Promise<UserSettings> {
    const response = await ApiClient.get<UserSettings>('/user/settings');
    return response.data;
  }

  // Mettre à jour les paramètres utilisateur
  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await ApiClient.put<UserSettings>('/user/settings', settings);
    return response.data;
  }

  // Fonctions pour le stockage local des préférences
  
  // Thème de l'application (clair/sombre)
  async getAppTheme(): Promise<'light' | 'dark' | 'system'> {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.APP_THEME);
    return (theme as 'light' | 'dark' | 'system') || 'system';
  }

  async setAppTheme(theme: 'light' | 'dark' | 'system'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.APP_THEME, theme);
  }

  // Historique de recherche
  async getSearchHistory(): Promise<string[]> {
    const history = await AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return history ? JSON.parse(history) : [];
  }

  async addSearchTerm(term: string): Promise<void> {
    const history = await this.getSearchHistory();
    // Éviter les doublons
    if (!history.includes(term)) {
      // Garder seulement les 10 dernières recherches
      const updatedHistory = [term, ...history].slice(0, 10);
      await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory));
    }
  }

  async clearSearchHistory(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  }

  // Dernier filtre utilisé
  async getLastUsedFilter(): Promise<SearchFilter | null> {
    const filter = await AsyncStorage.getItem(STORAGE_KEYS.LAST_USED_FILTER);
    return filter ? JSON.parse(filter) : null;
  }

  async saveLastUsedFilter(filter: SearchFilter): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_USED_FILTER, JSON.stringify(filter));
  }

  // Statut de l'onboarding
  async isOnboardingCompleted(): Promise<boolean> {
    const status = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return status === 'true';
  }

  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, String(completed));
  }

  // Paramètres de notification
  async getNotificationSettings(): Promise<{
    matches: boolean;
    messages: boolean;
    vehicleUpdates: boolean;
    marketingEmails: boolean;
  }> {
    const settings = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    return settings ? JSON.parse(settings) : {
      matches: true,
      messages: true,
      vehicleUpdates: true,
      marketingEmails: false,
    };
  }

  async updateNotificationSettings(settings: Partial<{
    matches: boolean;
    messages: boolean;
    vehicleUpdates: boolean;
    marketingEmails: boolean;
  }>): Promise<void> {
    const currentSettings = await this.getNotificationSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(updatedSettings));
  }

  // Langue de l'application
  async getLanguage(): Promise<string> {
    const language = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return language || 'fr'; // Par défaut en français
  }

  async setLanguage(language: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }
}

export default new UserPreferencesRepository(); 