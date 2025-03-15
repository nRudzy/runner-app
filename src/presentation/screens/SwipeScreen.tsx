import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewabilityConfig
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import { Vehicle } from '../../domain/entities/Models';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import FiltersModal from '../components/FiltersModal';

// Mock data for vehicles to swipe
const demoVehicles: Vehicle[] = [
  {
    id: '1',
    ownerId: '101',
    make: 'BMW',
    model: 'M4 Competition',
    year: 2021,
    price: 85000,
    description: 'BMW M4 Competition en parfait état. Première main, entretien BMW à jour. Cette version Competition possède 510ch et de nombreuses options: toit carbone, freins carbone-céramique, échappement sport M Performance.',
    color: 'Bleu São Paulo',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 15000,
    power: 510,
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000',
    ],
    location: 'Paris, France',
    features: ['Toit carbone', 'Freins carbone-céramique', 'Échappement sport M Performance'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likedBy: []
  },
  {
    id: '2',
    ownerId: '102',
    make: 'Porsche',
    model: '911 Carrera S',
    year: 2020,
    price: 125000,
    description: 'Magnifique Porsche 911 Carrera S (992) avec seulement 12000 km. Configuration française, état neuf. Chrono Sport Package, échappement sport, suspension PASM.',
    color: 'Gris Quartz',
    fuelType: 'Essence',
    transmission: 'PDK',
    mileage: 12000,
    power: 450,
    images: [
      'https://images.unsplash.com/photo-1584060573923-589425f3c0db?q=80&w=1000',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000',
    ],
    location: 'Lyon, France',
    features: ['Chrono Sport Package', 'PASM', 'Sièges sport adaptatifs'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likedBy: []
  },
  {
    id: '3',
    ownerId: '103',
    make: 'Audi',
    model: 'RS6 Avant',
    year: 2022,
    price: 130000,
    description: 'Audi RS6 Avant, la familiale sportive par excellence. Moteur V8 bi-turbo de 600ch, 0 à 100 km/h en 3.6s. Pack carbone extérieur, intérieur noir avec surpiqûres rouges.',
    color: 'Gris Nardo',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 8000,
    power: 600,
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000',
      'https://images.unsplash.com/photo-1631830803886-0553c4fe2610?q=80&w=1000',
    ],
    location: 'Marseille, France',
    features: ['Pack carbone', 'Toit panoramique', 'Bang & Olufsen Sound System'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likedBy: []
  },
  {
    id: '4',
    ownerId: '104',
    make: 'Mercedes',
    model: 'AMG GT 63 S',
    year: 2021,
    price: 160000,
    description: 'Mercedes AMG GT 63 S 4 portes, le meilleur des deux mondes : confort et sportivité. 639ch, intérieur AMG Performance, système audio Burmester 3D.',
    color: 'Noir Obsidienne',
    fuelType: 'Essence',
    transmission: 'Automatique',
    mileage: 20000,
    power: 639,
    images: [
      'https://images.unsplash.com/photo-1617502090448-a0c7173dbc4b?q=80&w=1000',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1000',
    ],
    location: 'Bordeaux, France',
    features: ['Pack AMG Night', 'Système audio Burmester', 'Toit panoramique'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likedBy: []
  },
  {
    id: '5',
    ownerId: '105',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2022,
    price: 140000,
    description: 'Tesla Model S Plaid, la berline électrique la plus rapide au monde. 1020ch, 0 à 100 km/h en 2.1s. Autonomie de 600km, Autopilot avancé.',
    color: 'Blanc Nacré',
    fuelType: 'Électrique',
    transmission: 'Automatique',
    mileage: 5000,
    power: 1020,
    images: [
      'https://images.unsplash.com/photo-1620891549027-942faa8ccbbc?q=80&w=1000',
      'https://images.unsplash.com/photo-1620891549027-942faa8ccbbc?q=80&w=1000',
    ],
    location: 'Nice, France',
    features: ['Autopilot avancé', 'Intérieur blanc', 'Roues Arachnid 21"'],
    createdAt: new Date(),
    updatedAt: new Date(),
    likedBy: []
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

interface SwipeScreenProps {
  onMatch: (vehicle: Vehicle) => void;
}

export default function SwipeScreen({ onMatch = () => {} }: SwipeScreenProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(demoVehicles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [noMoreVehicles, setNoMoreVehicles] = useState(false);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp'
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp'
  });

  useEffect(() => {
    if (currentIndex >= vehicles.length) {
      setNoMoreVehicles(true);
    }
  }, [currentIndex, vehicles.length]);
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false
    }).start();
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      setCurrentIndex((prevIndex: number) => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => {
      const currentVehicle = vehicles[currentIndex];
      onMatch(currentVehicle);
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleCardTap = () => {
    if (currentIndex < vehicles.length) {
      setSelectedVehicle(vehicles[currentIndex]);
      setDetailsVisible(true);
    }
  };
  
  const handleFiltersPress = () => {
    setFiltersVisible(true);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    // In a real app, we would fetch new vehicles here
    setTimeout(() => {
      setVehicles(demoVehicles);
      setCurrentIndex(0);
      setNoMoreVehicles(false);
      setIsLoading(false);
    }, 1500);
  };
  
  const renderCards = () => {
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Chargement des véhicules...</Text>
        </View>
      );
    }
    
    if (noMoreVehicles) {
      return (
        <View style={styles.noMoreContainer}>
          <Ionicons name="car-sport" size={80} color={Colors.lightGray} />
          <Text style={styles.noMoreText}>Pas d'autres véhicules</Text>
          <Text style={styles.noMoreSubtext}>Ajustez vos filtres ou revenez plus tard</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color={Colors.white} />
            <Text style={styles.refreshButtonText}>Rafraîchir</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return vehicles
      .map((vehicle: Vehicle, index: number) => {
        if (index < currentIndex) {
          return null;
        }
        
        if (index === currentIndex) {
          return (
            <Animated.View
              key={vehicle.id}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotation }
                  ]
                }
              ]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.cardTouchable}
                onPress={handleCardTap}
              >
                <Image source={{ uri: vehicle.images[0] }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{vehicle.make} {vehicle.model}</Text>
                    <Text style={styles.cardYear}>{vehicle.year}</Text>
                  </View>
                  <View style={styles.cardDetails}>
                    <View style={styles.cardDetail}>
                      <Ionicons name="cash-outline" size={16} color={Colors.primary} />
                      <Text style={styles.cardDetailText}>{vehicle.price} €</Text>
                    </View>
                    <View style={styles.cardDetail}>
                      <Ionicons name="speedometer-outline" size={16} color={Colors.primary} />
                      <Text style={styles.cardDetailText}>{vehicle.mileage} km</Text>
                    </View>
                    <View style={styles.cardDetail}>
                      <Ionicons name="location-outline" size={16} color={Colors.primary} />
                      <Text style={styles.cardDetailText}>{vehicle.location}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {vehicle.description}
                  </Text>
                  <View style={styles.tapForMore}>
                    <Text style={styles.tapForMoreText}>Appuyez pour plus de détails</Text>
                  </View>
                </View>
                
                <Animated.View
                  style={[
                    styles.likeOverlay,
                    { opacity: likeOpacity }
                  ]}
                >
                  <Text style={styles.likeText}>J'AIME</Text>
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.dislikeOverlay,
                    { opacity: dislikeOpacity }
                  ]}
                >
                  <Text style={styles.dislikeText}>PASSER</Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          );
        }
        
        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={vehicle.id}
              style={[
                styles.card,
                styles.nextCard,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }]
                }
              ]}
            >
              <Image source={{ uri: vehicle.images[0] }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{vehicle.make} {vehicle.model}</Text>
                  <Text style={styles.cardYear}>{vehicle.year}</Text>
                </View>
              </View>
            </Animated.View>
          );
        }
        
        return null;
      })
      .reverse();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFiltersPress} style={styles.filtersButton}>
          <Ionicons name="options-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Runner</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>

      {!noMoreVehicles && !isLoading && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={swipeLeft}>
            <Ionicons name="close-circle" size={56} color="#F42B4B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCardTap}>
            <Ionicons name="information-circle" size={42} color="#3498DB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={swipeRight}>
            <Ionicons name="heart-circle" size={56} color="#2ECC71" />
          </TouchableOpacity>
        </View>
      )}

      {selectedVehicle && (
        <VehicleDetailsModal
          visible={detailsVisible}
          vehicle={selectedVehicle}
          onClose={() => setDetailsVisible(false)}
          onLike={swipeRight}
          onPass={swipeLeft}
        />
      )}

      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApplyFilters={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  filtersButton: {
    padding: 8,
  },
  headerRightPlaceholder: {
    width: 24,
  },
  cardsContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  nextCard: {
    top: 10,
  },
  cardTouchable: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: '65%',
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 15,
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    flex: 1,
  },
  cardYear: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetailText: {
    fontSize: 14,
    color: Colors.darkGray,
    marginLeft: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
  },
  tapForMore: {
    alignItems: 'center',
    marginTop: 10,
  },
  tapForMoreText: {
    fontSize: 12,
    color: Colors.darkGray,
    fontStyle: 'italic',
  },
  likeOverlay: {
    position: 'absolute',
    top: 50,
    right: 20,
    transform: [{ rotate: '20deg' }],
  },
  dislikeOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    transform: [{ rotate: '-20deg' }],
  },
  likeText: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#2ECC71',
    color: '#2ECC71',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
  },
  dislikeText: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#F42B4B',
    color: '#F42B4B',
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noMoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 20,
    marginBottom: 10,
  },
  noMoreSubtext: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  refreshButtonText: {
    color: Colors.white,
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.darkGray,
  },
}); 