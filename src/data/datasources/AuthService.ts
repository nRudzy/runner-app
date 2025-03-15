/**
 * Service d'authentification pour gérer les utilisateurs
 */

import ApiClient from './ApiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../domain/entities/Models';

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
}

interface ResetPasswordRequest {
  email: string;
}

class AuthService {
  // Enregistrer un nouvel utilisateur
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await ApiClient.post<LoginResponse>('/auth/register', data);
    await this.saveUserSession(response.data);
    return response.data;
  }

  // Connecter un utilisateur existant
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await ApiClient.post<LoginResponse>('/auth/login', data);
    await this.saveUserSession(response.data);
    return response.data;
  }

  // Déconnecter l'utilisateur
  async logout(): Promise<void> {
    try {
      await ApiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    } finally {
      // Toujours supprimer le token local même si la requête API échoue
      await this.clearUserSession();
    }
  }

  // Demander un reset de mot de passe
  async requestPasswordReset(data: ResetPasswordRequest): Promise<void> {
    await ApiClient.post('/auth/reset-password', data);
  }

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  // Récupérer l'utilisateur actuel
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('current_user');
      if (userJson) {
        return JSON.parse(userJson) as User;
      }
      
      // Si pas d'utilisateur en cache, essayer de le récupérer depuis l'API
      const response = await ApiClient.get<User>('/auth/me');
      await AsyncStorage.setItem('current_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur', error);
      return null;
    }
  }

  // Mise à jour du profil utilisateur
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await ApiClient.put<User>('/auth/profile', userData);
    const updatedUser = response.data;
    
    // Mettre à jour le cache local
    const currentUserJson = await AsyncStorage.getItem('current_user');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson) as User;
      const mergedUser = { ...currentUser, ...updatedUser };
      await AsyncStorage.setItem('current_user', JSON.stringify(mergedUser));
    }
    
    return updatedUser;
  }

  // Méthodes privées pour gérer la session
  private async saveUserSession(data: LoginResponse): Promise<void> {
    await AsyncStorage.setItem('auth_token', data.token);
    await AsyncStorage.setItem('current_user', JSON.stringify(data.user));
  }

  private async clearUserSession(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('current_user');
  }
}

export default new AuthService(); 