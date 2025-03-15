import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Vehicle } from '../constants/Models';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <Image 
        source={{ uri: vehicle.photos[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.year}>{vehicle.year}</Text>
        </View>
        
        {vehicle.isTuned && (
          <View style={styles.tunedBadge}>
            <Ionicons name="flash" size={16} color="#fff" />
            <Text style={styles.tunedText}>Tuné</Text>
          </View>
        )}
        
        {vehicle.description && (
          <Text style={styles.description} numberOfLines={2}>
            {vehicle.description}
          </Text>
        )}
        
        {vehicle.modifications && vehicle.modifications.length > 0 && (
          <View style={styles.modificationContainer}>
            <Text style={styles.modificationTitle}>Modifications:</Text>
            <View style={styles.modificationList}>
              {vehicle.modifications.slice(0, 3).map((mod, index) => (
                <View key={index} style={styles.modificationItem}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.light.tint} />
                  <Text style={styles.modificationText}>{mod}</Text>
                </View>
              ))}
              {vehicle.modifications.length > 3 && (
                <Text style={styles.moreModifications}>
                  +{vehicle.modifications.length - 3} plus...
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: width * 1.3,
    borderRadius: 20,
    backgroundColor: '#fff',
    ...(Platform.OS === 'web' 
      ? {
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'
        } 
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }
    ),
    elevation: 5,
    overflow: 'hidden',
    margin: 10,
  },
  image: {
    width: '100%',
    height: '65%',
  },
  infoContainer: {
    padding: 15,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  year: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  tunedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tunedText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    lineHeight: 22,
  },
  modificationContainer: {
    marginTop: 5,
  },
  modificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#444',
  },
  modificationList: {
    marginTop: 5,
  },
  modificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modificationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  moreModifications: {
    fontSize: 14,
    color: Colors.light.tint,
    marginTop: 5,
    fontWeight: '500',
  },
}); 