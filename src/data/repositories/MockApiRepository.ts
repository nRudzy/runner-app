import { ApiRepository } from '../../domain/repositories/ApiRepository';
import { 
  User, 
  Vehicle, 
  Match, 
  Message, 
  GroupRide, 
  SubscriptionType 
} from '../../domain/entities/Models';
import { generateMockVehicles, generateMockUser, generateMockMatches } from '../mocks/MockDataGenerator';

export class MockApiRepository implements ApiRepository {
  private currentUser: User;
  private vehicles: Vehicle[];
  private matches: Match[];
  private messages: Record<string, Message[]> = {};
  private groupRides: GroupRide[] = [];

  constructor() {
    this.currentUser = generateMockUser();
    this.vehicles = generateMockVehicles(20);
    this.matches = generateMockMatches(this.currentUser.id, 5);
    
    // Initialiser les messages pour chaque match
    this.matches.forEach(match => {
      this.messages[match.id] = [];
    });
    
    // Initialiser quelques trajets en groupe
    this.initializeGroupRides();
  }

  private initializeGroupRides(): void {
    const organizer = {
      id: 'org1',
      name: 'Jean Dupont',
      email: 'jean@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      subscription: SubscriptionType.PREMIUM,
      swipesRemaining: 50,
      matches: [],
      createdAt: new Date().toISOString()
    };
    
    const participants = [
      {
        id: 'part1',
        name: 'Marie Martin',
        email: 'marie@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        subscription: SubscriptionType.FREE,
        swipesRemaining: 10,
        matches: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'part2',
        name: 'Pierre Durand',
        email: 'pierre@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        subscription: SubscriptionType.PREMIUM,
        swipesRemaining: 50,
        matches: [],
        createdAt: new Date().toISOString()
      }
    ];
    
    // Créer quelques trajets en groupe
    const now = new Date();
    
    // Trajet passé
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - 5);
    
    this.groupRides.push({
      id: 'ride1',
      title: 'Balade en montagne',
      description: 'Une belle balade sur les routes sinueuses des Alpes. Rendez-vous au parking du téléphérique pour un départ groupé.',
      date: pastDate.toISOString(),
      location: 'Chamonix, France',
      organizer,
      participants: [...participants, this.currentUser],
      maxParticipants: 10,
      isJoined: true,
      createdAt: new Date(pastDate.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString()
    });
    
    // Trajet à venir
    const futureDate1 = new Date();
    futureDate1.setDate(now.getDate() + 3);
    
    this.groupRides.push({
      id: 'ride2',
      title: 'Sortie côtière',
      description: 'Parcours le long de la côte méditerranéenne avec arrêt déjeuner dans une crique isolée. Prévoir maillot de bain!',
      date: futureDate1.toISOString(),
      location: 'Nice, France',
      organizer,
      participants: [...participants],
      maxParticipants: 8,
      isJoined: false,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString()
    });
    
    // Trajet à venir organisé par l'utilisateur courant
    const futureDate2 = new Date();
    futureDate2.setDate(now.getDate() + 7);
    
    this.groupRides.push({
      id: 'ride3',
      title: 'Circuit des vignobles',
      description: 'Découverte des routes à travers les vignobles avec dégustation (modérée!) dans un domaine. Parcours d\'environ 150km.',
      date: futureDate2.toISOString(),
      location: 'Beaune, France',
      organizer: this.currentUser,
      participants: [participants[0]],
      maxParticipants: 6,
      isJoined: true,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString()
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.currentUser;
  }

  async updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
    if (userId === this.currentUser.id) {
      this.currentUser = { ...this.currentUser, ...userData };
    }
    return this.currentUser;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<User> {
    if (userId === this.currentUser.id) {
      this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    }
    return this.currentUser;
  }

  async getVehiclesToSwipe(userId: string): Promise<Vehicle[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.vehicles;
  }

  async getVehicleDetails(vehicleId: string): Promise<Vehicle> {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }

  async swipeVehicle(userId: string, vehicleId: string, liked: boolean): Promise<Match | null> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!liked) {
      return null;
    }
    
    // Simuler un match avec une probabilité de 30%
    const isMatch = Math.random() < 0.3;
    
    if (isMatch) {
      const vehicle = this.vehicles.find(v => v.id === vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      
      const owner: User = {
        id: `user-${Date.now()}`,
        name: `Propriétaire de ${vehicle.make}`,
        email: `owner-${Date.now()}@example.com`,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        subscription: SubscriptionType.FREE,
        swipesRemaining: 10,
        matches: [],
        createdAt: new Date().toISOString()
      };
      
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        userId: userId,
        vehicleId: vehicleId,
        vehicle: vehicle,
        owner: owner,
        createdAt: new Date().toISOString(),
        unreadCount: 0
      };
      
      this.matches.push(newMatch);
      this.messages[newMatch.id] = [];
      
      // Ajouter l'ID du match à l'utilisateur
      this.currentUser.matches.push(newMatch.id);
      
      return newMatch;
    }
    
    return null;
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return this.matches.filter(match => match.userId === userId);
  }

  async getMatchDetails(matchId: string): Promise<Match> {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    return match;
  }

  async getMessages(matchId: string): Promise<Message[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return this.messages[matchId] || [];
  }

  async sendMessage(matchId: string, senderId: string, text: string): Promise<Message> {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId,
      text,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    if (!this.messages[matchId]) {
      this.messages[matchId] = [];
    }
    
    this.messages[matchId].push(newMessage);
    
    // Mettre à jour le dernier message du match
    match.lastMessage = newMessage;
    
    // Incrémenter le compteur de messages non lus si le message n'est pas de l'utilisateur courant
    if (senderId !== this.currentUser.id) {
      match.unreadCount = (match.unreadCount || 0) + 1;
    }
    
    return newMessage;
  }

  async markMessagesAsRead(matchId: string, userId: string): Promise<void> {
    const match = this.matches.find(m => m.id === matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    
    // Marquer tous les messages comme lus
    if (this.messages[matchId]) {
      this.messages[matchId] = this.messages[matchId].map(msg => {
        if (msg.senderId !== userId && !msg.read) {
          return { ...msg, read: true };
        }
        return msg;
      });
    }
    
    // Réinitialiser le compteur de messages non lus
    match.unreadCount = 0;
  }

  async getGroupRides(userId: string): Promise<GroupRide[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Marquer les trajets auxquels l'utilisateur participe
    return this.groupRides.map(ride => ({
      ...ride,
      isJoined: ride.participants.some(p => p.id === userId) || ride.organizer.id === userId
    }));
  }

  async getGroupRideDetails(rideId: string): Promise<GroupRide> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ride = this.groupRides.find(r => r.id === rideId);
    if (!ride) {
      throw new Error('Group ride not found');
    }
    
    // Marquer le trajet comme rejoint si l'utilisateur y participe
    const isJoined = ride.participants.some(p => p.id === this.currentUser.id) || 
                     ride.organizer.id === this.currentUser.id;
    
    return {
      ...ride,
      isJoined
    };
  }

  async createGroupRide(rideData: Partial<GroupRide>): Promise<GroupRide> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newRide: GroupRide = {
      id: `ride-${Date.now()}`,
      title: rideData.title || 'Nouveau trajet',
      description: rideData.description || '',
      date: rideData.date || new Date().toISOString(),
      location: rideData.location || '',
      organizer: this.currentUser,
      participants: [],
      maxParticipants: rideData.maxParticipants || 10,
      isJoined: true,
      createdAt: new Date().toISOString()
    };
    
    this.groupRides.push(newRide);
    
    return newRide;
  }

  async joinGroupRide(userId: string, rideId: string): Promise<void> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ride = this.groupRides.find(r => r.id === rideId);
    if (!ride) {
      throw new Error('Group ride not found');
    }
    
    // Vérifier si l'utilisateur est déjà participant
    if (ride.participants.some(p => p.id === userId) || ride.organizer.id === userId) {
      return;
    }
    
    // Vérifier si le trajet est complet
    if (ride.participants.length >= ride.maxParticipants) {
      throw new Error('Group ride is full');
    }
    
    // Ajouter l'utilisateur aux participants
    ride.participants.push(this.currentUser);
  }

  async leaveGroupRide(userId: string, rideId: string): Promise<void> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const ride = this.groupRides.find(r => r.id === rideId);
    if (!ride) {
      throw new Error('Group ride not found');
    }
    
    // Vérifier si l'utilisateur est l'organisateur
    if (ride.organizer.id === userId) {
      throw new Error('Organizer cannot leave the ride');
    }
    
    // Retirer l'utilisateur des participants
    ride.participants = ride.participants.filter(p => p.id !== userId);
  }

  async cancelGroupRide(rideId: string): Promise<void> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rideIndex = this.groupRides.findIndex(r => r.id === rideId);
    if (rideIndex === -1) {
      throw new Error('Group ride not found');
    }
    
    // Supprimer le trajet
    this.groupRides.splice(rideIndex, 1);
  }

  async upgradeSubscription(userId: string, subscriptionType: string): Promise<User> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 700));
    
    if (userId === this.currentUser.id) {
      this.currentUser.subscription = subscriptionType as SubscriptionType;
      
      // Mettre à jour le nombre de swipes en fonction de l'abonnement
      switch (subscriptionType) {
        case SubscriptionType.FREE:
          this.currentUser.swipesRemaining = 10;
          break;
        case SubscriptionType.PREMIUM:
          this.currentUser.swipesRemaining = 50;
          break;
        case SubscriptionType.PLATINUM:
          this.currentUser.swipesRemaining = 100;
          break;
      }
    }
    
    return this.currentUser;
  }
} 