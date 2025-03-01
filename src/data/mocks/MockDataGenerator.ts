import { User, Vehicle, Match, SubscriptionType } from '../../domain/entities/Models';

export function generateMockUser(): User {
  return {
    id: 'user-1',
    name: 'Jean Martin',
    email: 'jean.martin@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Passionné de voitures sportives et de rallyes.',
    preferences: {
      minYear: 2010,
      maxYear: 2023,
      makes: ['BMW', 'Audi', 'Mercedes'],
      maxPrice: 50000,
      fuelTypes: ['Essence', 'Hybride'],
      maxMileage: 100000,
    },
    subscription: SubscriptionType.PREMIUM,
    swipesRemaining: 50,
    matches: [],
    createdAt: new Date().toISOString()
  };
}

export function generateMockVehicles(count: number): Vehicle[] {
  const vehicles: Vehicle[] = [];
  
  const makes = ['BMW', 'Audi', 'Mercedes', 'Porsche', 'Ferrari', 'Lamborghini', 'Toyota', 'Honda', 'Ford', 'Chevrolet'];
  const models = ['Série 3', 'A4', 'Classe C', '911', '488', 'Huracan', 'Supra', 'Civic Type R', 'Mustang', 'Camaro'];
  const colors = ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Gris', 'Argent', 'Vert', 'Jaune'];
  const fuelTypes = ['Essence', 'Diesel', 'Hybride', 'Électrique'];
  const transmissions = ['Manuelle', 'Automatique', 'Semi-automatique'];
  const bodyTypes = ['Berline', 'Coupé', 'SUV', 'Cabriolet', 'Break'];
  const locations = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Strasbourg', 'Nantes', 'Toulouse'];
  
  for (let i = 0; i < count; i++) {
    const makeIndex = Math.floor(Math.random() * makes.length);
    const modelIndex = Math.floor(Math.random() * models.length);
    const year = 2010 + Math.floor(Math.random() * 14); // Entre 2010 et 2023
    const price = 10000 + Math.floor(Math.random() * 90000); // Entre 10000 et 100000
    const mileage = Math.floor(Math.random() * 150000);
    const colorIndex = Math.floor(Math.random() * colors.length);
    const fuelTypeIndex = Math.floor(Math.random() * fuelTypes.length);
    const transmissionIndex = Math.floor(Math.random() * transmissions.length);
    const bodyTypeIndex = Math.floor(Math.random() * bodyTypes.length);
    const locationIndex = Math.floor(Math.random() * locations.length);
    const isTuned = Math.random() > 0.7; // 30% de chance d'être tuné
    
    const vehicle: Vehicle = {
      id: `vehicle-${i + 1}`,
      userId: `user-${i + 100}`,
      make: makes[makeIndex],
      model: models[modelIndex],
      year,
      price,
      mileage,
      color: colors[colorIndex],
      fuelType: fuelTypes[fuelTypeIndex],
      transmission: transmissions[transmissionIndex],
      bodyType: bodyTypes[bodyTypeIndex],
      description: `Superbe ${makes[makeIndex]} ${models[modelIndex]} de ${year} en parfait état. ${isTuned ? 'Véhicule personnalisé avec plusieurs modifications.' : 'Entretien régulier, carnet à jour.'}`,
      images: [
        `https://source.unsplash.com/random/800x600/?car,${makes[makeIndex].toLowerCase()}`,
        `https://source.unsplash.com/random/800x600/?car,${models[modelIndex].toLowerCase()}`,
        `https://source.unsplash.com/random/800x600/?car,interior`
      ],
      isTuned,
      modifications: isTuned ? generateRandomModifications() : undefined,
      location: locations[locationIndex],
      createdAt: new Date().toISOString()
    };
    
    vehicles.push(vehicle);
  }
  
  return vehicles;
}

function generateRandomModifications(): string[] {
  const possibleMods = [
    'Échappement sport',
    'Suspension rabaissée',
    'Jantes alliage 19"',
    'Reprogrammation moteur',
    'Admission d\'air sport',
    'Freins haute performance',
    'Vitres teintées',
    'Système audio amélioré',
    'Sièges baquets',
    'Volant sport',
    'Kit carrosserie',
    'Aileron arrière',
    'Phares LED',
    'Intercooler amélioré'
  ];
  
  const modCount = 2 + Math.floor(Math.random() * 5); // Entre 2 et 6 modifications
  const mods: string[] = [];
  
  for (let i = 0; i < modCount; i++) {
    const modIndex = Math.floor(Math.random() * possibleMods.length);
    if (!mods.includes(possibleMods[modIndex])) {
      mods.push(possibleMods[modIndex]);
    }
  }
  
  return mods;
}

export function generateMockMatches(userId: string, count: number): Match[] {
  const matches: Match[] = [];
  const vehicles = generateMockVehicles(count);
  
  for (let i = 0; i < count; i++) {
    const vehicle = vehicles[i];
    
    const owner: User = {
      id: `match-user-${i + 1}`,
      name: `Propriétaire ${i + 1}`,
      email: `owner${i + 1}@example.com`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`,
      subscription: SubscriptionType.FREE,
      swipesRemaining: 10,
      matches: [],
      createdAt: new Date().toISOString()
    };
    
    const match: Match = {
      id: `match-${i + 1}`,
      userId,
      vehicleId: vehicle.id,
      vehicle,
      owner,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans les 30 derniers jours
      unreadCount: Math.floor(Math.random() * 5)
    };
    
    matches.push(match);
  }
  
  return matches;
} 