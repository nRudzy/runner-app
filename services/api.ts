import { User, Vehicle, Match, Message, Ride, SubscriptionTier, VehicleType } from '../constants/Models';
import { v4 as uuidv4 } from 'uuid';

// Données fictives pour simuler une API
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Thomas',
    email: 'thomas@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Passionné de voitures sportives depuis toujours.',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      city: 'Paris'
    },
    preferences: {
      maxDistance: 50,
      vehicleTypes: [VehicleType.SPORTS_CAR, VehicleType.LUXURY],
      yearRange: {
        min: 2010,
        max: 2023
      },
      tuned: true
    },
    subscription: SubscriptionTier.PREMIUM,
    swipesRemaining: 100,
    vehicles: [],
    matches: []
  },
  {
    id: '2',
    name: 'Sophie',
    email: 'sophie@example.com',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Fan de rallye et de voitures classiques.',
    location: {
      latitude: 45.7640,
      longitude: 4.8357,
      city: 'Lyon'
    },
    preferences: {
      maxDistance: 30,
      vehicleTypes: [VehicleType.CLASSIC, VehicleType.SPORTS_CAR],
      yearRange: {
        min: 1960,
        max: 1990
      },
      tuned: false
    },
    subscription: SubscriptionTier.FREE,
    swipesRemaining: 20,
    vehicles: [],
    matches: []
  }
];

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    ownerId: '1',
    make: 'Porsche',
    model: '911 GT3',
    year: 2021,
    type: VehicleType.SPORTS_CAR,
    photos: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f2e'
    ],
    description: 'Ma Porsche 911 GT3, une vraie bête sur circuit.',
    modifications: ['Échappement sport', 'Jantes forgées', 'Suspension sport'],
    isTuned: true
  },
  {
    id: '2',
    ownerId: '2',
    make: 'Alpine',
    model: 'A110',
    year: 2019,
    type: VehicleType.SPORTS_CAR,
    photos: [
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333',
      'https://images.unsplash.com/photo-1580274455191-1c62238fa334'
    ],
    description: 'Alpine A110, légère et agile sur les routes de montagne.',
    modifications: [],
    isTuned: false
  },
  {
    id: '3',
    ownerId: '2',
    make: 'Ford',
    model: 'Mustang',
    year: 1967,
    type: VehicleType.CLASSIC,
    photos: [
      'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0',
      'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf1'
    ],
    description: 'Mustang classique entièrement restaurée.',
    modifications: ['Moteur reconditionné', 'Intérieur d\'origine restauré'],
    isTuned: false
  }
];

// Associer les véhicules aux utilisateurs
mockUsers[0].vehicles = [mockVehicles[0]];
mockUsers[1].vehicles = [mockVehicles[1], mockVehicles[2]];

const mockMatches: Match[] = [];
const mockRides: Ride[] = [];

// Service API
export const api = {
  // Utilisateurs
  getCurrentUser: (): Promise<User> => {
    return Promise.resolve(mockUsers[0]);
  },
  
  updateUserProfile: (userId: string, userData: Partial<User>): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return Promise.reject(new Error('Utilisateur non trouvé'));
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return Promise.resolve(mockUsers[userIndex]);
  },
  
  updateUserPreferences: (userId: string, preferences: Partial<User['preferences']>): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return Promise.reject(new Error('Utilisateur non trouvé'));
    }
    
    mockUsers[userIndex].preferences = { ...mockUsers[userIndex].preferences, ...preferences };
    return Promise.resolve(mockUsers[userIndex]);
  },
  
  // Véhicules
  getUserVehicles: (userId: string): Promise<Vehicle[]> => {
    return Promise.resolve(mockVehicles.filter(v => v.ownerId === userId));
  },
  
  getVehicleDetails: (vehicleId: string): Promise<Vehicle> => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      return Promise.reject(new Error('Véhicule non trouvé'));
    }
    return Promise.resolve(vehicle);
  },
  
  addVehicle: (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: uuidv4()
    };
    mockVehicles.push(newVehicle);
    
    // Mettre à jour l'utilisateur
    const userIndex = mockUsers.findIndex(u => u.id === vehicle.ownerId);
    if (userIndex !== -1) {
      mockUsers[userIndex].vehicles.push(newVehicle);
    }
    
    return Promise.resolve(newVehicle);
  },
  
  updateVehicle: (vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
    const vehicleIndex = mockVehicles.findIndex(v => v.id === vehicleId);
    if (vehicleIndex === -1) {
      return Promise.reject(new Error('Véhicule non trouvé'));
    }
    
    mockVehicles[vehicleIndex] = { ...mockVehicles[vehicleIndex], ...vehicleData };
    return Promise.resolve(mockVehicles[vehicleIndex]);
  },
  
  // Swipe et matchs
  getVehiclesToSwipe: (userId: string): Promise<Vehicle[]> => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return Promise.reject(new Error('Utilisateur non trouvé'));
    }
    
    // Filtrer les véhicules selon les préférences de l'utilisateur
    return Promise.resolve(
      mockVehicles.filter(v => 
        v.ownerId !== userId && // Pas les véhicules de l'utilisateur
        user.preferences.vehicleTypes.includes(v.type) &&
        v.year >= user.preferences.yearRange.min &&
        v.year <= user.preferences.yearRange.max &&
        (user.preferences.tuned ? v.isTuned : true)
      )
    );
  },
  
  swipeVehicle: (userId: string, vehicleId: string, liked: boolean): Promise<Match | null> => {
    if (!liked) {
      return Promise.resolve(null); // Pas de match si l'utilisateur n'a pas aimé le véhicule
    }
    
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      return Promise.reject(new Error('Véhicule non trouvé'));
    }
    
    const user = mockUsers.find(u => u.id === userId);
    const vehicleOwner = mockUsers.find(u => u.id === vehicle.ownerId);
    
    if (!user || !vehicleOwner) {
      return Promise.reject(new Error('Utilisateur non trouvé'));
    }
    
    // Vérifier si l'autre utilisateur a déjà liké un de nos véhicules
    const userVehicles = mockVehicles.filter(v => v.ownerId === userId);
    const hasMatch = userVehicles.some(userVehicle => {
      // Simuler que l'autre utilisateur a déjà liké notre véhicule (50% de chance)
      return Math.random() > 0.5;
    });
    
    if (hasMatch) {
      // Créer un match
      const newMatch: Match = {
        id: uuidv4(),
        users: [userId, vehicle.ownerId],
        vehicles: [userVehicles[0].id, vehicleId],
        createdAt: new Date(),
        messages: []
      };
      
      mockMatches.push(newMatch);
      
      // Mettre à jour les utilisateurs
      user.matches.push(vehicle.ownerId);
      vehicleOwner.matches.push(userId);
      
      return Promise.resolve(newMatch);
    }
    
    return Promise.resolve(null);
  },
  
  getUserMatches: (userId: string): Promise<Match[]> => {
    return Promise.resolve(mockMatches.filter(m => m.users.includes(userId)));
  },
  
  // Messages
  sendMessage: (matchId: string, senderId: string, content: string): Promise<Message> => {
    const matchIndex = mockMatches.findIndex(m => m.id === matchId);
    if (matchIndex === -1) {
      return Promise.reject(new Error('Match non trouvé'));
    }
    
    const newMessage: Message = {
      id: uuidv4(),
      senderId,
      content,
      timestamp: new Date(),
      read: false
    };
    
    mockMatches[matchIndex].messages.push(newMessage);
    return Promise.resolve(newMessage);
  },
  
  getMatchMessages: (matchId: string): Promise<Message[]> => {
    const match = mockMatches.find(m => m.id === matchId);
    if (!match) {
      return Promise.reject(new Error('Match non trouvé'));
    }
    
    return Promise.resolve(match.messages);
  },
  
  // Balades
  createRide: (ride: Omit<Ride, 'id' | 'joinCode' | 'status'>): Promise<Ride> => {
    const newRide: Ride = {
      ...ride,
      id: uuidv4(),
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: 'planned'
    };
    
    mockRides.push(newRide);
    return Promise.resolve(newRide);
  },
  
  getRideDetails: (rideId: string): Promise<Ride> => {
    const ride = mockRides.find(r => r.id === rideId);
    if (!ride) {
      return Promise.reject(new Error('Balade non trouvée'));
    }
    
    return Promise.resolve(ride);
  },
  
  joinRide: (rideId: string, userId: string, vehicleId: string, joinCode: string): Promise<Ride> => {
    const rideIndex = mockRides.findIndex(r => r.id === rideId && r.joinCode === joinCode);
    if (rideIndex === -1) {
      return Promise.reject(new Error('Balade non trouvée ou code incorrect'));
    }
    
    // Vérifier si l'utilisateur est déjà participant
    if (mockRides[rideIndex].participants.some(p => p.userId === userId)) {
      return Promise.reject(new Error('Vous participez déjà à cette balade'));
    }
    
    mockRides[rideIndex].participants.push({
      userId,
      vehicleId
    });
    
    return Promise.resolve(mockRides[rideIndex]);
  },
  
  updateRideStatus: (rideId: string, status: Ride['status']): Promise<Ride> => {
    const rideIndex = mockRides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) {
      return Promise.reject(new Error('Balade non trouvée'));
    }
    
    mockRides[rideIndex].status = status;
    return Promise.resolve(mockRides[rideIndex]);
  },
  
  updateParticipantLocation: (
    rideId: string, 
    userId: string, 
    location: { latitude: number; longitude: number }
  ): Promise<Ride> => {
    const rideIndex = mockRides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) {
      return Promise.reject(new Error('Balade non trouvée'));
    }
    
    const participantIndex = mockRides[rideIndex].participants.findIndex(p => p.userId === userId);
    if (participantIndex === -1) {
      return Promise.reject(new Error('Participant non trouvé'));
    }
    
    mockRides[rideIndex].participants[participantIndex].currentLocation = location;
    return Promise.resolve(mockRides[rideIndex]);
  },
  
  // Abonnements
  upgradeSubscription: (userId: string, tier: SubscriptionTier): Promise<User> => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return Promise.reject(new Error('Utilisateur non trouvé'));
    }
    
    mockUsers[userIndex].subscription = tier;
    return Promise.resolve(mockUsers[userIndex]);
  }
}; 