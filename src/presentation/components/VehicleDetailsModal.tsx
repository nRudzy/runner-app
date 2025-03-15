import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import { Vehicle } from '../../domain/entities/Models';

const { width, height } = Dimensions.get('window');

interface VehicleDetailsModalProps {
  visible: boolean;
  vehicle: Vehicle;
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

export default function VehicleDetailsModal({
  visible,
  vehicle,
  onClose,
  onLike,
  onPass,
}: VehicleDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const renderImageItem = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.slideItem}>
      <Image
        source={{ uri: item }}
        style={styles.slideImage}
        resizeMode="cover"
      />
      {index === currentImageIndex && (
        <View style={styles.imagePagerContainer}>
          <Text style={styles.imagePagerText}>
            {currentImageIndex + 1}/{vehicle.images.length}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.carouselContainer}>
          <FlatList
            data={vehicle.images}
            renderItem={renderImageItem}
            keyExtractor={(_, index) => `image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        </View>

        <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.titleSection}>
            <View>
              <Text style={styles.makeModel}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.year}>{vehicle.year}</Text>
            </View>
            <Text style={styles.price}>{formatPrice(vehicle.price)}</Text>
          </View>

          <View style={styles.locationSection}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <Text style={styles.locationText}>{vehicle.location}</Text>
          </View>

          <View style={styles.specsSection}>
            <View style={styles.specItem}>
              <Ionicons name="speedometer-outline" size={24} color={Colors.darkGray} />
              <Text style={styles.specValue}>{vehicle.mileage} km</Text>
              <Text style={styles.specLabel}>Kilométrage</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="flash-outline" size={24} color={Colors.darkGray} />
              <Text style={styles.specValue}>{vehicle.power} ch</Text>
              <Text style={styles.specLabel}>Puissance</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="color-palette-outline" size={24} color={Colors.darkGray} />
              <Text style={styles.specValue}>{vehicle.color}</Text>
              <Text style={styles.specLabel}>Couleur</Text>
            </View>
            <View style={styles.specItem}>
              <Ionicons name="water-outline" size={24} color={Colors.darkGray} />
              <Text style={styles.specValue}>{vehicle.fuelType}</Text>
              <Text style={styles.specLabel}>Carburant</Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{vehicle.description}</Text>
          </View>

          {vehicle.features && vehicle.features.length > 0 && (
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Équipements</Text>
              <View style={styles.featuresList}>
                {vehicle.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Propriétaire</Text>
            <View style={styles.ownerCard}>
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerInitials}>
                  {vehicle.make.charAt(0)}
                </Text>
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>Propriétaire {vehicle.ownerId}</Text>
                <Text style={styles.memberSince}>Membre depuis 2023</Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contacter</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.spacing} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.passButton]} 
            onPress={onPass}
          >
            <Ionicons name="close-circle" size={35} color="#fff" />
            <Text style={styles.actionButtonText}>Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]} 
            onPress={onLike}
          >
            <Ionicons name="heart-circle" size={35} color="#fff" />
            <Text style={styles.actionButtonText}>J'aime</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContainer: {
    height: height * 0.4,
    backgroundColor: Colors.black,
  },
  slideItem: {
    width,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imagePagerContainer: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imagePagerText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  makeModel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  year: {
    fontSize: 18,
    color: Colors.darkGray,
    marginTop: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: Colors.darkGray,
    marginLeft: 5,
  },
  specsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    padding: 15,
  },
  specItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  specValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginTop: 5,
  },
  specLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    marginTop: 2,
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkGray,
  },
  featuresSection: {
    marginBottom: 25,
  },
  featuresList: {
    marginTop: 5,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    color: Colors.darkGray,
    marginLeft: 10,
  },
  contactSection: {
    marginBottom: 25,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerInitials: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
  },
  ownerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
  },
  memberSince: {
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  contactButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    width: '48%',
  },
  passButton: {
    backgroundColor: '#F42B4B',
  },
  likeButton: {
    backgroundColor: '#2ECC71',
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  spacing: {
    height: 20,
  },
}); 