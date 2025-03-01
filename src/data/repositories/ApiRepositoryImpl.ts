import { ApiRepository } from '../../domain/repositories/ApiRepository';
import { User, Vehicle, Match, Message, Ride, SubscriptionTier } from '../../domain/entities/Models';
import { MockApiService } from '../datasources/MockApiService';

export class ApiRepositoryImpl implements ApiRepository {
  private apiService: MockApiService;

  constructor() {
    this.apiService = new MockApiService();
  }

  // Utilisateurs
  getCurrentUser(): Promise<User> {
    return this.apiService.getCurrentUser();
  }

  updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    return this.apiService.updateUserProfile(userId, userData);
  }

  updateUserPreferences(userId: string, preferences: Partial<User['preferences']>): Promise<User> {
    return this.apiService.updateUserPreferences(userId, preferences);
  }

  // Véhicules
  getUserVehicles(userId: string): Promise<Vehicle[]> {
    return this.apiService.getUserVehicles(userId);
  }

  getVehicleDetails(vehicleId: string): Promise<Vehicle> {
    return this.apiService.getVehicleDetails(vehicleId);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    return this.apiService.addVehicle(vehicle);
  }

  updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    return this.apiService.updateVehicle(vehicleId, vehicleData);
  }

  // Swipe et matchs
  getVehiclesToSwipe(userId: string): Promise<Vehicle[]> {
    return this.apiService.getVehiclesToSwipe(userId);
  }

  swipeVehicle(userId: string, vehicleId: string, liked: boolean): Promise<Match | null> {
    return this.apiService.swipeVehicle(userId, vehicleId, liked);
  }

  getUserMatches(userId: string): Promise<Match[]> {
    return this.apiService.getUserMatches(userId);
  }

  // Messages
  sendMessage(matchId: string, senderId: string, content: string): Promise<Message> {
    return this.apiService.sendMessage(matchId, senderId, content);
  }

  getMatchMessages(matchId: string): Promise<Message[]> {
    return this.apiService.getMatchMessages(matchId);
  }

  // Balades
  createRide(ride: Omit<Ride, 'id' | 'joinCode' | 'status'>): Promise<Ride> {
    return this.apiService.createRide(ride);
  }

  getRideDetails(rideId: string): Promise<Ride> {
    return this.apiService.getRideDetails(rideId);
  }

  joinRide(rideId: string, userId: string, vehicleId: string, joinCode: string): Promise<Ride> {
    return this.apiService.joinRide(rideId, userId, vehicleId, joinCode);
  }

  updateRideStatus(rideId: string, status: Ride['status']): Promise<Ride> {
    return this.apiService.updateRideStatus(rideId, status);
  }

  updateParticipantLocation(
    rideId: string,
    userId: string,
    location: { latitude: number; longitude: number }
  ): Promise<Ride> {
    return this.apiService.updateParticipantLocation(rideId, userId, location);
  }

  // Abonnements
  upgradeSubscription(userId: string, tier: SubscriptionTier): Promise<User> {
    return this.apiService.upgradeSubscription(userId, tier);
  }
} 