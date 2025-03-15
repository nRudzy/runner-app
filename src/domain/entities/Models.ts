/**
 * Modèles de données pour l'application Runner
 */

// Utilisateur
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  swipesRemaining: number;
  premium: boolean;
  savedVehicles: string[]; // IDs des véhicules sauvegardés
  likedVehicles: string[]; // IDs des véhicules likés
  ownedVehicles: string[]; // IDs des véhicules possédés
  settings: UserSettings;
}

// Paramètres utilisateur
export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  language: string;
  distanceUnit: 'km' | 'mi';
  pricePreferences: {
    min: number;
    max: number;
  };
  yearPreferences: {
    min: number;
    max: number;
  };
  maxDistance: number;
  makePreferences: string[];
  fuelTypePreferences: string[];
}

// Véhicule
export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  color: string;
  fuelType: string;
  transmission: string;
  mileage: number;
  power: number;
  images: string[];
  location: string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
  likedBy: string[]; // IDs des utilisateurs qui ont liké le véhicule
}

// Match (connexion entre un utilisateur et un véhicule/propriétaire)
export interface Match {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleOwnerId: string;
  createdAt: Date;
  lastMessageAt?: Date;
  read: boolean;
}

// Message
export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like' | 'system';
  title: string;
  message: string;
  relatedId?: string; // ID du match, message, etc.
  createdAt: Date;
  read: boolean;
}

// Filtre de recherche
export interface SearchFilter {
  userId: string;
  name?: string;
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  distance: number;
  makes: string[];
  fuelTypes: string[];
  transmissionTypes: string[];
  colors: string[];
  onlyWithImages: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Statistiques d'utilisation
export interface UserStats {
  userId: string;
  swipesCount: number;
  likesCount: number;
  passesCount: number;
  matchesCount: number;
  messagesCount: number;
  responseRate: number;
  averageResponseTime: number;
  lastActive: Date;
}

// Rapport d'utilisation
export interface Feedback {
  id: string;
  userId: string;
  vehicleId?: string;
  type: 'bug' | 'feature' | 'complaint' | 'compliment';
  content: string;
  createdAt: Date;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
}

// Préférences de recherche
export interface SearchPreferences {
  id: string;
  userId: string;
  priceRange: [number, number];
  yearRange: [number, number];
  mileageRange: [number, number];
  maxDistance: number;
  makes: string[];
  fuelTypes: string[];
  transmissionTypes: string[];
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Événement de subscription liée aux voitures
export interface VehicleEvent {
  id: string;
  type: 'new_listing' | 'price_drop' | 'sold' | 'updated';
  vehicleId: string;
  previousData?: Partial<Vehicle>;
  newData: Partial<Vehicle>;
  createdAt: Date;
}

// Version simplifiée d'un utilisateur pour les profils publics
export interface PublicUserProfile {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  responseRate?: number;
  averageResponseTime?: number;
  ownedVehiclesCount: number;
}

// Analyse d'activité
export interface ActivitySummary {
  userId: string;
  period: 'day' | 'week' | 'month';
  swipes: number;
  matches: number;
  messages: number;
  dateRange: {
    start: Date;
    end: Date;
  };
}

// Types de carburant disponibles
export enum FuelType {
  Petrol = 'Essence',
  Diesel = 'Diesel',
  Electric = 'Électrique',
  Hybrid = 'Hybride',
  LPG = 'GPL',
  CNG = 'GNV',
  Ethanol = 'Éthanol',
  Hydrogen = 'Hydrogène'
}

// Types de transmission disponibles
export enum TransmissionType {
  Manual = 'Manuelle',
  Automatic = 'Automatique',
  SemiAutomatic = 'Semi-automatique',
  CVT = 'CVT',
  DCT = 'Double embrayage'
}

// Statut du compte
export enum AccountStatus {
  Active = 'actif',
  Suspended = 'suspendu',
  Deleted = 'supprimé',
  PendingVerification = 'en attente de vérification'
}

export interface VehiclePreferences {
  brands?: string[];
  models?: string[];
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  colors?: string[];
  fuelTypes?: string[];
  maxMileage?: number;
  distance?: number; // km radius for search
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PLATINUM = 'PLATINUM'
}

export interface GroupRide {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: User;
  participants: User[];
  maxParticipants: number;
  isJoined?: boolean;
  createdAt: string;
}

export enum NotificationType {
  MATCH = 'MATCH',
  MESSAGE = 'MESSAGE',
  GROUP_RIDE_INVITE = 'GROUP_RIDE_INVITE',
  GROUP_RIDE_UPDATE = 'GROUP_RIDE_UPDATE',
  SYSTEM = 'SYSTEM'
}

export interface Ride {
  id: string;
  name: string;
  organizerId: string;
  joinCode: string;
  date: Date;
  startLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  route?: {
    coordinates: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
  participants: Array<{
    userId: string;
    vehicleId: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
  }>;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export enum VehicleType {
  SEDAN = 'sedan',
  COUPE = 'coupe',
  HATCHBACK = 'hatchback',
  SUV = 'suv',
  TRUCK = 'truck',
  CONVERTIBLE = 'convertible',
  SPORTS_CAR = 'sports_car',
  LUXURY = 'luxury',
  CLASSIC = 'classic',
  MOTORCYCLE = 'motorcycle',
  OTHER = 'other'
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  VIP = 'vip'
}

export interface SubscriptionFeatures {
  tier: SubscriptionTier;
  price: number;
  swipesPerDay: number;
  canMessage: boolean;
  canOrganizeRides: boolean;
  exclusiveEvents: boolean;
  trackDayAccess: boolean;
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  [SubscriptionTier.FREE]: {
    tier: SubscriptionTier.FREE,
    price: 0,
    swipesPerDay: 20,
    canMessage: false,
    canOrganizeRides: false,
    exclusiveEvents: false,
    trackDayAccess: false
  },
  [SubscriptionTier.PREMIUM]: {
    tier: SubscriptionTier.PREMIUM,
    price: 9.99,
    swipesPerDay: 100,
    canMessage: true,
    canOrganizeRides: true,
    exclusiveEvents: false,
    trackDayAccess: false
  },
  [SubscriptionTier.VIP]: {
    tier: SubscriptionTier.VIP,
    price: 19.99,
    swipesPerDay: Infinity,
    canMessage: true,
    canOrganizeRides: true,
    exclusiveEvents: true,
    trackDayAccess: true
  }
}; 