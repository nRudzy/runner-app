/**
 * Utilitaire pour le logging et le débogage des requêtes réseau
 * Permet de visualiser les requêtes, réponses et erreurs pendant le développement
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Platform } from 'react-native';

// États possibles des requêtes
export enum NetworkRequestState {
  REQUEST = 'REQUEST',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

// Interface pour un log d'activité réseau
interface NetworkActivityLog {
  id: string;
  url: string;
  method: string;
  state: NetworkRequestState;
  requestData?: any;
  responseData?: any;
  error?: any;
  timestamp: number;
  duration?: number;
}

// Configuration du logger
interface NetworkLoggerConfig {
  enabled: boolean;
  maxLogs: number;
  filters?: {
    urls?: string[];
    methods?: string[];
  };
  sensitiveDataKeys?: string[];
}

class NetworkLogger {
  private static instance: NetworkLogger;
  private logs: NetworkActivityLog[] = [];
  private requestTimestamps: Map<string, number> = new Map();
  private config: NetworkLoggerConfig = {
    enabled: __DEV__, // Actif uniquement en mode développement
    maxLogs: 100,
    sensitiveDataKeys: ['password', 'token', 'auth', 'authorization', 'secret'],
  };

  // Empêcher l'instanciation directe
  private constructor() {}

  // Singleton pattern
  public static getInstance(): NetworkLogger {
    if (!NetworkLogger.instance) {
      NetworkLogger.instance = new NetworkLogger();
    }
    return NetworkLogger.instance;
  }

  // Configurer le logger
  public configure(config: Partial<NetworkLoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Attacher les intercepteurs à une instance axios
  public attachToAxiosInstance(axiosInstance: any): void {
    if (!this.config.enabled) return;

    // Intercepteur de requête
    axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const id = this.generateRequestId();
        this.requestTimestamps.set(id, Date.now());
        
        const logData: NetworkActivityLog = {
          id,
          url: config.url || 'unknown',
          method: config.method?.toUpperCase() || 'UNKNOWN',
          state: NetworkRequestState.REQUEST,
          requestData: this.sanitizeData(config.data),
          timestamp: Date.now(),
        };

        // Ajouter l'ID de la requête aux en-têtes pour le suivre
        if (config.headers) {
          config.headers['X-Request-ID'] = id;
        } else {
          config.headers = { 'X-Request-ID': id };
        }

        this.addLog(logData);
        this.printToConsole(logData);
        
        return config;
      },
      (error: AxiosError) => {
        this.logError(error);
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponse
    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.logResponse(response);
        return response;
      },
      (error: AxiosError) => {
        this.logError(error);
        return Promise.reject(error);
      }
    );
  }

  // Générer un ID unique pour chaque requête
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  // Nettoyer les données sensibles
  private sanitizeData(data: any): any {
    if (!data) return data;
    
    try {
      const sanitized = JSON.parse(JSON.stringify(data));
      this.config.sensitiveDataKeys?.forEach(key => {
        this.redactSensitiveData(sanitized, key);
      });
      return sanitized;
    } catch (e) {
      return data;
    }
  }

  // Remplacer les données sensibles
  private redactSensitiveData(obj: any, sensitiveKey: string): void {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      if (key.toLowerCase().includes(sensitiveKey.toLowerCase())) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.redactSensitiveData(obj[key], sensitiveKey);
      }
    });
  }

  // Ajouter un log à la liste
  private addLog(log: NetworkActivityLog): void {
    this.logs.unshift(log);
    
    // Garder seulement le nombre maximum de logs
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(0, this.config.maxLogs);
    }
  }

  // Logger une réponse
  private logResponse(response: AxiosResponse): void {
    const requestId = response.config.headers?.['X-Request-ID'] as string;
    const startTime = this.requestTimestamps.get(requestId);
    const duration = startTime ? Date.now() - startTime : undefined;
    
    const logData: NetworkActivityLog = {
      id: requestId || this.generateRequestId(),
      url: response.config.url || 'unknown',
      method: response.config.method?.toUpperCase() || 'UNKNOWN',
      state: NetworkRequestState.RESPONSE,
      responseData: this.sanitizeData(response.data),
      timestamp: Date.now(),
      duration,
    };
    
    this.addLog(logData);
    this.printToConsole(logData);
    
    // Nettoyer le timestamp de la requête
    if (requestId) {
      this.requestTimestamps.delete(requestId);
    }
  }

  // Logger une erreur
  private logError(error: AxiosError): void {
    const requestId = error.config?.headers?.['X-Request-ID'] as string;
    const startTime = requestId ? this.requestTimestamps.get(requestId) : undefined;
    const duration = startTime ? Date.now() - startTime : undefined;
    
    const logData: NetworkActivityLog = {
      id: requestId || this.generateRequestId(),
      url: error.config?.url || 'unknown',
      method: error.config?.method?.toUpperCase() || 'UNKNOWN',
      state: NetworkRequestState.ERROR,
      requestData: this.sanitizeData(error.config?.data),
      responseData: this.sanitizeData(error.response?.data),
      error: {
        message: error.message,
        code: error.code,
        status: error.response?.status,
      },
      timestamp: Date.now(),
      duration,
    };
    
    this.addLog(logData);
    this.printToConsole(logData);
    
    // Nettoyer le timestamp de la requête
    if (requestId) {
      this.requestTimestamps.delete(requestId);
    }
  }

  // Afficher le log dans la console
  private printToConsole(log: NetworkActivityLog): void {
    if (!this.config.enabled) return;

    // Filtrer si nécessaire
    if (this.config.filters) {
      const { urls, methods } = this.config.filters;
      if (urls && !urls.some(url => log.url.includes(url))) return;
      if (methods && !methods.includes(log.method)) return;
    }

    const emoji = this.getStateEmoji(log.state);
    const durationText = log.duration ? `(${log.duration}ms)` : '';
    const timestamp = new Date(log.timestamp).toISOString().split('T')[1].split('.')[0];

    // Style de la console
    if (Platform.OS === 'web') {
      const stateColor = this.getStateColor(log.state);
      console.groupCollapsed(
        `%c🌐 ${emoji} [${timestamp}] ${log.method} ${log.url} ${durationText}`,
        `color: ${stateColor}; font-weight: bold;`
      );
    } else {
      console.group(`🌐 ${emoji} [${timestamp}] ${log.method} ${log.url} ${durationText}`);
    }

    if (log.state === NetworkRequestState.REQUEST) {
      console.log('📤 Request:', log.requestData || 'Aucune donnée');
    } else if (log.state === NetworkRequestState.RESPONSE) {
      console.log('📥 Response:', log.responseData || 'Aucune donnée');
    } else if (log.state === NetworkRequestState.ERROR) {
      console.log('❌ Error:', log.error || 'Erreur inconnue');
      if (log.responseData) {
        console.log('📥 Response:', log.responseData);
      }
    }

    console.groupEnd();
  }

  // Obtenir l'emoji correspondant à l'état
  private getStateEmoji(state: NetworkRequestState): string {
    switch (state) {
      case NetworkRequestState.REQUEST:
        return '🔼';
      case NetworkRequestState.RESPONSE:
        return '🔽';
      case NetworkRequestState.ERROR:
        return '⛔';
      default:
        return '❓';
    }
  }

  // Obtenir la couleur correspondant à l'état
  private getStateColor(state: NetworkRequestState): string {
    switch (state) {
      case NetworkRequestState.REQUEST:
        return '#2196F3'; // Bleu
      case NetworkRequestState.RESPONSE:
        return '#4CAF50'; // Vert
      case NetworkRequestState.ERROR:
        return '#F44336'; // Rouge
      default:
        return '#9E9E9E'; // Gris
    }
  }

  // Obtenir tous les logs
  public getLogs(): NetworkActivityLog[] {
    return [...this.logs];
  }

  // Effacer tous les logs
  public clearLogs(): void {
    this.logs = [];
    this.requestTimestamps.clear();
  }
}

export default NetworkLogger.getInstance(); 