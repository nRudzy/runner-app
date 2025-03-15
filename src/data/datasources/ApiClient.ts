/**
 * Client API pour communiquer avec le backend
 * Basé sur Axios pour gérer les requêtes HTTP
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL de base de l'API - à changer selon l'environnement
const API_BASE_URL = 'https://api.runner.com/v1';

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000, // 15 secondes
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepteur pour les requêtes
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Ajouter le token d'authentification s'il existe
        const token = await AsyncStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // Gestion des erreurs 401 (non autorisé)
        if (error.response && error.response.status === 401) {
          // Effacer le token et rediriger vers la page de connexion
          await AsyncStorage.removeItem('auth_token');
          // La redirection sera gérée par le contexte d'authentification
        }

        // Gestion des erreurs de réseau
        if (!error.response) {
          // Erreur de connexion ou timeout
          console.error('Erreur réseau', error);
        }

        return Promise.reject(error);
      }
    );
  }

  // Pattern Singleton pour avoir une seule instance du client
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Méthodes pour les requêtes HTTP
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // Méthode pour télécharger des fichiers
  public async uploadFile<T>(url: string, file: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.axiosInstance.post<T>(url, file, uploadConfig);
  }
}

export default ApiClient.getInstance(); 