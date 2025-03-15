/**
 * Données de maquette pour les véhicules
 */

import { Vehicle } from '../../domain/entities/Models';

// Constantes pour générer les données aléatoires
const MAKES = ['BMW', 'Audi', 'Mercedes', 'Porsche', 'Tesla', 'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Ford'];
const MODELS = {
  'BMW': ['M3', 'M4', 'M5', 'X5', 'Série 3', 'Série 5', 'i8'],
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q7', 'RS6', 'TT'],
  'Mercedes': ['Classe A', 'Classe C', 'Classe E', 'GLC', 'AMG GT', 'CLA'],
  'Porsche': ['911', 'Cayman', 'Boxster', 'Taycan', 'Panamera', 'Macan'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'],
  'Renault': ['Clio', 'Megane', 'Captur', 'Scenic', 'Espace', 'Talisman'],
  'Peugeot': ['208', '308', '3008', '508', '5008', 'e-208'],
  'Citroën': ['C3', 'C4', 'C5', 'DS4', 'DS7', 'Berlingo'],
  'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc', 'ID.3'],
  'Ford': ['Fiesta', 'Focus', 'Kuga', 'Mustang', 'Puma', 'Explorer'],
};

const COLORS = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Marron', 'Beige'];
const FUEL_TYPES = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];
const TRANSMISSIONS = ['Manuelle', 'Automatique', 'Semi-automatique'];
const CITIES = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg', 'Montpellier', 'Nice'];

const FEATURES = [
  'Climatisation', 'GPS', 'Bluetooth', 'Toit ouvrant', 'Jantes alliage', 
  'Sièges cuir', 'Sièges chauffants', 'Caméra de recul', 'Capteurs de stationnement',
  'Régulateur de vitesse', 'Vitres électriques', 'Système audio premium',
  'Apple CarPlay', 'Android Auto', 'Phares LED', 'Volant multifonction'
];

// Fonctions pour générer des données aléatoires
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomPrice = () => {
  const basePrices = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 80000, 100000];
  const basePrice = getRandomElement(basePrices);
  // Ajouter une variation pour plus de réalisme
  const variation = Math.floor(Math.random() * 2000) - 1000;
  return basePrice + variation;
};

// Générer un ID aléatoire
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Générer un véhicule aléatoire
const generateRandomVehicle = (): Vehicle => {
  const make = getRandomElement(MAKES);
  const year = getRandomInt(2005, 2023);
  const mileage = getRandomInt(1000, 150000);
  const ownerId = generateId();
  
  return {
    id: generateId(),
    ownerId,
    make,
    model: getRandomElement(MODELS[make]),
    year,
    price: getRandomPrice(),
    description: `Superbe ${make} en excellent état. Entretien rigoureux et régulier. Véhicule non-fumeur. Révision complète effectuée récemment. Pneus neufs. Véhicule très agréable à conduire et bien entretenu.`,
    color: getRandomElement(COLORS),
    fuelType: getRandomElement(FUEL_TYPES),
    transmission: getRandomElement(TRANSMISSIONS),
    mileage,
    power: getRandomInt(90, 500),
    images: [
      `https://source.unsplash.com/featured/?car,${make},${getRandomInt(1, 1000)}`,
      `https://source.unsplash.com/featured/?car,${make},${getRandomInt(1001, 2000)}`,
      `https://source.unsplash.com/featured/?car,${make},${getRandomInt(2001, 3000)}`,
    ],
    location: getRandomElement(CITIES),
    features: getRandomElements(FEATURES, getRandomInt(5, 10)),
    createdAt: new Date(Date.now() - getRandomInt(1, 90) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    likedBy: []
  };
};

// Exporter une liste de véhicules générés aléatoirement
export const generateMockVehicles = (count: number = 20): Vehicle[] => {
  return Array.from({ length: count }, () => generateRandomVehicle());
};

// Générer un ensemble fixe de véhicules pour avoir des données constantes
export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    ownerId: 'u1',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2021,
    price: 89500,
    description: 'BMW M4 Competition en parfait état. Cette voiture sportive offre des performances exceptionnelles avec son moteur 6 cylindres en ligne de 510 ch. Intérieur cuir Merino, pack carbone, système audio Harman Kardon. Voiture non-fumeur, toujours garage.',
    color: 'Bleu',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 15000,
    power: 510,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000',
      'https://images.unsplash.com/photo-1633507104446-8e94bd03f1b8?q=80&w=1000',
      'https://images.unsplash.com/photo-1662660256953-a5f7f6438524?q=80&w=1000',
    ],
    location: 'Paris',
    features: ['Climatisation', 'GPS', 'Bluetooth', 'Sièges cuir', 'Caméra de recul', 'Phares LED', 'Apple CarPlay', 'Android Auto'],
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-15'),
    likedBy: []
  },
  {
    id: 'v2',
    ownerId: 'u2',
    make: 'Porsche',
    model: '911 Carrera',
    year: 2020,
    price: 115000,
    description: 'Magnifique Porsche 911 Carrera avec seulement 12000 km. Première main, entretien complet récent chez Porsche. Pack Sport Chrono, jantes 20", échappement sport, intérieur tout cuir. État proche du neuf.',
    color: 'Noir',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 12000,
    power: 450,
    images: [
      'https://images.unsplash.com/photo-1584060573923-589425f3c0db?q=80&w=1000',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000',
      'https://images.unsplash.com/photo-1626624340240-aadc087dd7f1?q=80&w=1000',
    ],
    location: 'Lyon',
    features: ['Climatisation', 'GPS', 'Bluetooth', 'Toit ouvrant', 'Sièges cuir', 'Sièges chauffants', 'Système audio premium'],
    createdAt: new Date('2023-09-27'),
    updatedAt: new Date('2023-09-27'),
    likedBy: []
  },
  {
    id: 'v3',
    ownerId: 'u3',
    make: 'Tesla',
    model: 'Model 3 Performance',
    year: 2022,
    price: 62000,
    description: 'Tesla Model 3 Performance. Autonomie 547 km, 0 à 100 km/h en 3,3 secondes. Full options avec Autopilot avancé, intérieur blanc, toit panoramique en verre. Véhicule comme neuf.',
    color: 'Blanc',
    fuelType: 'Électrique',
    transmission: 'Automatique',
    mileage: 8000,
    power: 513,
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1000',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
      'https://images.unsplash.com/photo-1594141380593-8e0c1ebdda04?q=80&w=1000',
    ],
    location: 'Bordeaux',
    features: ['Autopilot', 'Toit panoramique', 'Sièges chauffants', 'Caméra 360°', 'Supercharging gratuit', 'Premium Connectivity'],
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-05'),
    likedBy: []
  },
  {
    id: 'v4',
    ownerId: 'u4',
    make: 'Audi',
    model: 'RS6 Avant',
    year: 2021,
    price: 135000,
    description: 'Audi RS6 Avant pack dynamique plus. Freins céramique, suspension pneumatique adaptative, pack esthétique carbone. Un break familial aux performances de supercar. À voir absolument!',
    color: 'Gris',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 17500,
    power: 600,
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000',
      'https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=1000',
      'https://images.unsplash.com/photo-1657033929683-dfc6676737d4?q=80&w=1000',
    ],
    location: 'Marseille',
    features: ['Bang & Olufsen Advanced', 'Toit panoramique', 'Vision nocturne', 'Sièges sport RS', 'Head-up display', 'Jantes 22"'],
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2023-10-10'),
    likedBy: []
  },
  {
    id: 'v5',
    ownerId: 'u5',
    make: 'Mercedes',
    model: 'AMG GT',
    year: 2019,
    price: 98500,
    description: 'Mercedes AMG GT équipé du Pack Night. Première main, carnet d\'entretien complet Mercedes. Véhicule exceptionnel alliant luxe et sportivité. À saisir rapidement!',
    color: 'Rouge',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 29000,
    power: 550,
    images: [
      'https://images.unsplash.com/photo-1617502090448-a0c7173dbc4b?q=80&w=1000',
      'https://images.unsplash.com/photo-1663666367642-4c010ea4c10f?q=80&w=1000',
      'https://images.unsplash.com/photo-1618093583654-ef4f2b9d034b?q=80&w=1000',
    ],
    location: 'Nice',
    features: ['Burmester Surround', 'Pack Performance', 'Sièges AMG Performance', 'COMAND Online', 'Échappement sport', 'Suspension active'],
    createdAt: new Date('2023-08-22'),
    updatedAt: new Date('2023-08-22'),
    likedBy: []
  },
  {
    id: 'v6',
    ownerId: 'u6',
    make: 'Volkswagen',
    model: 'Golf GTI',
    year: 2021,
    price: 42000,
    description: 'Volkswagen Golf GTI dernière génération. Véhicule sportif mais pratique pour un usage quotidien. Jantes 19", système Dynaudio, Digital Cockpit Pro. Véhicule en excellent état.',
    color: 'Blanc',
    fuelType: 'Essence',
    transmission: 'Manuelle',
    mileage: 22000,
    power: 245,
    images: [
      'https://images.unsplash.com/photo-1611967164521-abae8fba4668?q=80&w=1000',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000',
      'https://images.unsplash.com/photo-1534093607318-f025413f49cb?q=80&w=1000',
    ],
    location: 'Lille',
    features: ['DSG', 'Active Info Display', 'App-Connect', 'Keyless Access', 'Adaptive Cruise Control', 'Front Assist'],
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15'),
    likedBy: []
  },
];

export default MOCK_VEHICLES; 