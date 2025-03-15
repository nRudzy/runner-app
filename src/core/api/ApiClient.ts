/**
 * Client API centralisé pour toutes les communications avec le serveur
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetworkLogger from '../utils/NetworkLogger';

// Configuration de l'API
const API_CONFIG = {
  BASE_URL: 'https://api.runner.com/v1', // URL de base de l'API
  TIMEOUT: 30000, // Timeout en millisecondes
  AUTH_TOKEN_KEY: '@Runner:authToken', // Clé pour stocker le token dans AsyncStorage
};

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  private constructor() {
    // Créer l'instance Axios avec la configuration de base
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Attacher les intercepteurs pour la gestion des tokens
    this.setupInterceptors();
    
    // Attacher le logger réseau en mode développement
    NetworkLogger.attachToAxiosInstance(this.axiosInstance);
    
    // Charger le token au démarrage
    this.loadAuthToken();
  }

  // Singleton pattern
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Charger le token d'authentification depuis le stockage local
  private async loadAuthToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(API_CONFIG.AUTH_TOKEN_KEY);
      if (token) {
        this.authToken = token;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du token d\'authentification:', error);
    }
  }

  // Sauvegarder le token d'authentification dans le stockage local
  private async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_CONFIG.AUTH_TOKEN_KEY, token);
      this.authToken = token;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token d\'authentification:', error);
    }
  }

  // Supprimer le token d'authentification du stockage local
  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(API_CONFIG.AUTH_TOKEN_KEY);
      this.authToken = null;
    } catch (error) {
      console.error('Erreur lors de la suppression du token d\'authentification:', error);
    }
  }

  // Configurer les intercepteurs pour les requêtes et réponses
  private setupInterceptors(): void {
    // Intercepteur de requête pour ajouter le token d'authentification
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (this.authToken) {
          config.headers = config.headers || {};
          config.headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse pour gérer les erreurs et le rafraîchissement des tokens
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Si l'erreur est 401 (Non autorisé) et que ce n'est pas une requête de rafraîchissement
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          // Marquer la requête comme déjà retentée pour éviter les boucles infinies
          originalRequest._retry = true;
          
          try {
            // Essayer de rafraîchir le token (à implémenter selon votre API)
            // const refreshResponse = await this.refreshToken();
            
            // Si implémenté, sauvegarder le nouveau token et réessayer la requête
            // await this.saveAuthToken(refreshResponse.data.token);
            // return this.axiosInstance(originalRequest);
            
            // Pour l'instant, on déconnecte l'utilisateur si le token est invalide
            await this.removeAuthToken();
            
            // Déclencher un événement de déconnexion
            // À implémenter selon votre système d'événements
            return Promise.reject(error);
          } catch (refreshError) {
            // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
            await this.removeAuthToken();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Méthode pour définir le token manuellement (après login par exemple)
  public async setAuthToken(token: string): Promise<void> {
    await this.saveAuthToken(token);
  }

  // Méthode pour déconnecter l'utilisateur
  public async logout(): Promise<void> {
    await this.removeAuthToken();
  }

  // Méthodes génériques pour les requêtes HTTP
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }
}

export default ApiClient.getInstance(); 