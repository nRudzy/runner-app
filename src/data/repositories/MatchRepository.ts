/**
 * Repository pour gérer les matches et la messagerie
 */

import ApiClient from '../datasources/ApiClient';
import { Match, Message, User, Vehicle } from '../../domain/entities/Models';

interface MatchWithDetails {
  match: Match;
  user: User;
  vehicle: Vehicle;
  lastMessage?: Message;
  unreadCount: number;
}

interface SendMessageRequest {
  matchId: string;
  content: string;
}

interface MessageResponse {
  messages: Message[];
  page: number;
  totalPages: number;
  hasMore: boolean;
}

class MatchRepository {
  // Récupérer tous les matches de l'utilisateur
  async getMatches(): Promise<MatchWithDetails[]> {
    const response = await ApiClient.get<MatchWithDetails[]>('/matches');
    return response.data;
  }

  // Récupérer un match spécifique
  async getMatchById(matchId: string): Promise<MatchWithDetails> {
    const response = await ApiClient.get<MatchWithDetails>(`/matches/${matchId}`);
    return response.data;
  }

  // Récupérer les messages d'un match avec pagination
  async getMessages(matchId: string, page: number = 1, limit: number = 20): Promise<MessageResponse> {
    const response = await ApiClient.get<MessageResponse>(`/matches/${matchId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Envoyer un message
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    const response = await ApiClient.post<Message>(`/matches/${data.matchId}/messages`, { content: data.content });
    return response.data;
  }

  // Marquer un match comme lu
  async markMatchAsRead(matchId: string): Promise<void> {
    await ApiClient.post(`/matches/${matchId}/read`);
  }

  // Marquer les messages d'un match comme lus
  async markMessagesAsRead(matchId: string): Promise<void> {
    await ApiClient.post(`/matches/${matchId}/messages/read`);
  }

  // Supprimer un match
  async deleteMatch(matchId: string): Promise<void> {
    await ApiClient.delete(`/matches/${matchId}`);
  }

  // Récupérer les statistiques des matches
  async getMatchStats(): Promise<{
    totalMatches: number;
    newMatches: number;
    unreadMessages: number;
    activeConversations: number;
  }> {
    const response = await ApiClient.get('/matches/stats');
    return response.data;
  }

  // Rechercher dans les matches
  async searchMatches(query: string): Promise<MatchWithDetails[]> {
    const response = await ApiClient.get<MatchWithDetails[]>(`/matches/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Récupérer les matches non lus
  async getUnreadMatches(): Promise<MatchWithDetails[]> {
    const response = await ApiClient.get<MatchWithDetails[]>('/matches/unread');
    return response.data;
  }

  // Récupérer les matches récents
  async getRecentMatches(limit: number = 5): Promise<MatchWithDetails[]> {
    const response = await ApiClient.get<MatchWithDetails[]>(`/matches/recent?limit=${limit}`);
    return response.data;
  }

  // Envoyer une image dans un message
  async sendImageMessage(matchId: string, imageUri: string): Promise<Message> {
    const formData = new FormData();
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('image', {
      uri: imageUri,
      name: `message_image_${Date.now()}.${fileType}`,
      type: `image/${fileType}`,
    } as any);
    
    const response = await ApiClient.uploadFile<Message>(`/matches/${matchId}/messages/image`, formData);
    return response.data;
  }
}

export default new MatchRepository(); 