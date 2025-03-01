import { User, Vehicle, Match, Message, Ride, SubscriptionTier, GroupRide } from '../entities/Models';

export interface ApiRepository {
  // Utilisateurs
  getCurrentUser(): Promise<User>;
  updateUserProfile(userId: string, userData: Partial<User>): Promise<User>;
  updateUserPreferences(userId: string, preferences: Partial<User['preferences']>): Promise<User>;
  
  // Véhicules
  getUserVehicles(userId: string): Promise<Vehicle[]>;
  getVehicleDetails(vehicleId: string): Promise<Vehicle>;
  addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle>;
  updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle>;
  
  // Swipe et matchs
  getVehiclesToSwipe(userId: string): Promise<Vehicle[]>;
  swipeVehicle(userId: string, vehicleId: string, liked: boolean): Promise<Match | null>;
  getUserMatches(userId: string): Promise<Match[]>;
  getMatchDetails(matchId: string): Promise<Match>;
  
  // Messages
  getMessages(matchId: string): Promise<Message[]>;
  sendMessage(matchId: string, senderId: string, text: string): Promise<Message>;
  markMessagesAsRead(matchId: string, userId: string): Promise<void>;
  
  // Balades
  createRide(ride: Omit<Ride, 'id' | 'joinCode' | 'status'>): Promise<Ride>;
  getRideDetails(rideId: string): Promise<Ride>;
  joinRide(rideId: string, userId: string, vehicleId: string, joinCode: string): Promise<Ride>;
  updateRideStatus(rideId: string, status: Ride['status']): Promise<Ride>;
  updateParticipantLocation(
    rideId: string, 
    userId: string, 
    location: { latitude: number; longitude: number }
  ): Promise<Ride>;
  
  // Trajets en groupe
  getGroupRides(userId: string): Promise<GroupRide[]>;
  getGroupRideDetails(rideId: string): Promise<GroupRide>;
  createGroupRide(rideData: Partial<GroupRide>): Promise<GroupRide>;
  joinGroupRide(userId: string, rideId: string): Promise<void>;
  leaveGroupRide(userId: string, rideId: string): Promise<void>;
  cancelGroupRide(rideId: string): Promise<void>;
  
  // Abonnements
  upgradeSubscription(userId: string, tier: SubscriptionTier): Promise<User>;
} 