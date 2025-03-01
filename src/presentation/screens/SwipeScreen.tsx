import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Vehicle } from '../../domain/entities/Models';
import VehicleCard from '../components/VehicleCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import ServiceLocator from '../../core/di/ServiceLocator';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

interface SwipeScreenProps {
  onMatch: (match: any) => void;
}

export default function SwipeScreen({ onMatch }: SwipeScreenProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [noMoreVehicles, setNoMoreVehicles] = useState(false);
  const [swipesRemaining, setSwipesRemaining] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const apiRepository = ServiceLocator.getInstance().getApiRepository();
  
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  useEffect(() => {
    loadVehicles();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await apiRepository.getCurrentUser();
      setSwipesRemaining(user.swipesRemaining);
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    }
  };

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const user = await apiRepository.getCurrentUser();
      const vehiclesToSwipe = await apiRepository.getVehiclesToSwipe(user.id);
      setVehicles(vehiclesToSwipe);
      setCurrentIndex(0);
      setNoMoreVehicles(vehiclesToSwipe.length === 0);
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false
    }).start();
  };

  const swipeLeft = () => {
    if (swipesRemaining <= 0) {
      resetPosition();
      return;
    }

    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(false));
  };

  const swipeRight = () => {
    if (swipesRemaining <= 0) {
      resetPosition();
      return;
    }

    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(true));
  };

  const onSwipeComplete = async (liked: boolean) => {
    const currentVehicle = vehicles[currentIndex];
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(prevIndex => prevIndex + 1);
    setSwipesRemaining(prev => prev - 1);

    if (liked && currentVehicle) {
      try {
        const user = await apiRepository.getCurrentUser();
        const match = await apiRepository.swipeVehicle(user.id, currentVehicle.id, true);
        if (match) {
          onMatch(match);
        }
      } catch (error) {
        console.error('Erreur lors du swipe:', error);
      }
    }
  };

  const renderCards = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement des véhicules...</Text>
        </View>
      );
    }

    if (noMoreVehicles) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Ionicons name="car-sport" size={80} color={Colors.light.tint} />
          <Text style={styles.noMoreCardsText}>Plus de véhicules à découvrir</Text>
          <Text style={styles.noMoreCardsSubText}>Revenez plus tard ou modifiez vos préférences</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadVehicles}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshButtonText}>Rafraîchir</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentIndex >= vehicles.length) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.light.tint} />
          <Text style={styles.noMoreCardsText}>Vous avez vu tous les véhicules</Text>
          <Text style={styles.noMoreCardsSubText}>Revenez plus tard pour découvrir de nouveaux véhicules</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadVehicles}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshButtonText}>Rafraîchir</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (swipesRemaining <= 0) {
      return (
        <View style={styles.noMoreCardsContainer}>
          <Ionicons name="alert-circle" size={80} color={Colors.light.tint} />
          <Text style={styles.noMoreCardsText}>Plus de swipes disponibles</Text>
          <Text style={styles.noMoreCardsSubText}>Passez à un abonnement supérieur pour plus de swipes</Text>
          <TouchableOpacity style={styles.upgradeButton}>
            <Ionicons name="star" size={20} color="#fff" />
            <Text style={styles.upgradeButtonText}>Passer à Premium</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return vehicles
      .map((vehicle, index) => {
        if (index < currentIndex) {
          return null;
        }

        if (index === currentIndex) {
          return (
            <Animated.View
              key={vehicle.id}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    { translateX: position.x },
                    { rotate: rotation }
                  ]
                }
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
                <Text style={styles.likeText}>J'AIME</Text>
              </Animated.View>
              <Animated.View style={[styles.dislikeContainer, { opacity: dislikeOpacity }]}>
                <Text style={styles.dislikeText}>PASSE</Text>
              </Animated.View>
              <VehicleCard vehicle={vehicle} />
            </Animated.View>
          );
        }

        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={vehicle.id}
              style={[
                styles.cardContainer,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }]
                }
              ]}
            >
              <VehicleCard vehicle={vehicle} />
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.swipesCounter}>
        <Ionicons name="flame" size={20} color={Colors.light.tint} />
        <Text style={styles.swipesText}>{swipesRemaining} swipes restants</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]} 
          onPress={swipeLeft}
          disabled={currentIndex >= vehicles.length || swipesRemaining <= 0}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.likeButton]} 
          onPress={swipeRight}
          disabled={currentIndex >= vehicles.length || swipesRemaining <= 0}
        >
          <Ionicons name="heart" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  swipesCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  swipesText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cardContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  likeButton: {
    backgroundColor: Colors.light.tint,
  },
  dislikeButton: {
    backgroundColor: '#ff6b6b',
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1,
    transform: [{ rotate: '15deg' }],
    borderWidth: 3,
    borderColor: Colors.light.tint,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  likeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  dislikeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1,
    transform: [{ rotate: '-15deg' }],
    borderWidth: 3,
    borderColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dislikeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  noMoreCardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMoreCardsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  noMoreCardsSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 30,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: '#ffa500',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 