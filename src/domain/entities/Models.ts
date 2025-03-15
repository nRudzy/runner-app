export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  preferences?: UserPreferences;
  subscription: SubscriptionType;
  swipesRemaining: number;
  matches: string[];
  createdAt: string;
}

export interface UserPreferences {
  minYear?: number;
  maxYear?: number;
  makes?: string[];
  models?: string[];
  maxPrice?: number;
  fuelTypes?: string[];
  maxMileage?: number;
  colors?: string[];
  transmissionTypes?: string[];
  bodyTypes?: string[];
}

export enum SubscriptionType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  PLATINUM = 'PLATINUM'
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  description: string;
  images: string[];
  isTuned: boolean;
  modifications?: string[];
  location: string;
  createdAt: string;
}

export interface Match {
  id: string;
  userId: string;
  vehicleId: string;
  vehicle: Vehicle;
  owner: User;
  createdAt: string;
  lastMessage?: Message;
  unreadCount?: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: string;
  read: boolean;
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

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
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