export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  location: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  preferences: {
    maxDistance: number;
    vehicleTypes: VehicleType[];
    yearRange: {
      min: number;
      max: number;
    };
    tuned: boolean;
  };
  subscription: SubscriptionTier;
  swipesRemaining: number;
  vehicles: Vehicle[];
  matches: string[]; // IDs des utilisateurs avec qui on a matché
}

export interface Vehicle {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  photos: string[];
  description?: string;
  modifications?: string[];
  isTuned: boolean;
}

export interface Match {
  id: string;
  users: [string, string]; // IDs des deux utilisateurs
  vehicles: [string, string]; // IDs des deux véhicules
  createdAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
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