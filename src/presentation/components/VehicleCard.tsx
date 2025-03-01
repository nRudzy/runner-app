import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Vehicle } from '../../domain/entities/Models';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH * 0.9;

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.95}
      onPress={onPress}
    >
      <Image 
        source={{ uri: vehicle.images[0] }} 
        style={styles.image} 
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.year}>{vehicle.year}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.detailText}>{vehicle.mileage} km</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="color-palette-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.detailText}>{vehicle.color}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="flash-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.detailText}>{vehicle.fuelType}</Text>
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description} numberOfLines={3}>
            {vehicle.description}
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{vehicle.price} €</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{vehicle.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 520,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    padding: 15,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  year: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
    marginLeft: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  descriptionContainer: {
    marginBottom: 15,
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
}); 