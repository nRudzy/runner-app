import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import MultiSlider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: () => void;
}

export default function FiltersModal({
  visible,
  onClose,
  onApplyFilters,
}: FiltersModalProps) {
  // État des filtres
  const [priceRange, setPriceRange] = useState([5000, 150000]);
  const [yearRange, setYearRange] = useState([2010, 2023]);
  const [mileageRange, setMileageRange] = useState([0, 100000]);
  const [distance, setDistance] = useState(50);
  const [makes, setMakes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissionTypes, setTransmissionTypes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [onlyWithImages, setOnlyWithImages] = useState(true);

  // Options pour les filtres
  const makeOptions = [
    'BMW', 'Audi', 'Mercedes', 'Porsche', 'Tesla', 
    'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'Ford'
  ];
  
  const fuelTypeOptions = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];
  
  const transmissionOptions = ['Manuelle', 'Automatique', 'Semi-automatique'];
  
  const colorOptions = [
    'Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 
    'Vert', 'Jaune', 'Orange', 'Marron', 'Beige'
  ];

  // Gestion des sélections
  const toggleMake = (make: string) => {
    if (makes.includes(make)) {
      setMakes(makes.filter(m => m !== make));
    } else {
      setMakes([...makes, make]);
    }
  };

  const toggleFuelType = (fuelType: string) => {
    if (fuelTypes.includes(fuelType)) {
      setFuelTypes(fuelTypes.filter(f => f !== fuelType));
    } else {
      setFuelTypes([...fuelTypes, fuelType]);
    }
  };

  const toggleTransmission = (transmission: string) => {
    if (transmissionTypes.includes(transmission)) {
      setTransmissionTypes(transmissionTypes.filter(t => t !== transmission));
    } else {
      setTransmissionTypes([...transmissionTypes, transmission]);
    }
  };

  const toggleColor = (color: string) => {
    if (colors.includes(color)) {
      setColors(colors.filter(c => c !== color));
    } else {
      setColors([...colors, color]);
    }
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setPriceRange([5000, 150000]);
    setYearRange([2010, 2023]);
    setMileageRange([0, 100000]);
    setDistance(50);
    setMakes([]);
    setFuelTypes([]);
    setTransmissionTypes([]);
    setColors([]);
    setOnlyWithImages(true);
  };

  // Appliquer les filtres et fermer le modal
  const applyFilters = () => {
    onApplyFilters();
    onClose();
  };

  // Formatter les prix
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtres</Text>
          <TouchableOpacity onPress={resetFilters} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Prix */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Prix</Text>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>Min: {formatPrice(priceRange[0])}</Text>
              <Text style={styles.rangeLabel}>Max: {formatPrice(priceRange[1])}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <MultiSlider 
                style={styles.slider}
                minimumValue={0}
                maximumValue={300000}
                step={1000}
                value={priceRange[0]}
                onValueChange={(value) => setPriceRange([value, priceRange[1]])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
              <MultiSlider 
                style={styles.slider}
                minimumValue={0}
                maximumValue={300000}
                step={1000}
                value={priceRange[1]}
                onValueChange={(value) => setPriceRange([priceRange[0], value])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
            </View>
          </View>

          {/* Année */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Année</Text>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>Min: {yearRange[0]}</Text>
              <Text style={styles.rangeLabel}>Max: {yearRange[1]}</Text>
            </View>
            <View style={styles.sliderContainer}>
              <MultiSlider 
                style={styles.slider}
                minimumValue={1990}
                maximumValue={2023}
                step={1}
                value={yearRange[0]}
                onValueChange={(value) => setYearRange([value, yearRange[1]])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
              <MultiSlider 
                style={styles.slider}
                minimumValue={1990}
                maximumValue={2023}
                step={1}
                value={yearRange[1]}
                onValueChange={(value) => setYearRange([yearRange[0], value])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
            </View>
          </View>

          {/* Kilométrage */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Kilométrage</Text>
            <View style={styles.rangeLabels}>
              <Text style={styles.rangeLabel}>Min: {mileageRange[0]} km</Text>
              <Text style={styles.rangeLabel}>Max: {mileageRange[1]} km</Text>
            </View>
            <View style={styles.sliderContainer}>
              <MultiSlider 
                style={styles.slider}
                minimumValue={0}
                maximumValue={200000}
                step={1000}
                value={mileageRange[0]}
                onValueChange={(value) => setMileageRange([value, mileageRange[1]])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
              <MultiSlider 
                style={styles.slider}
                minimumValue={0}
                maximumValue={200000}
                step={1000}
                value={mileageRange[1]}
                onValueChange={(value) => setMileageRange([mileageRange[0], value])}
                minimumTrackTintColor={Colors.primary}
                maximumTrackTintColor={Colors.lightGray}
                thumbTintColor={Colors.primary}
              />
            </View>
          </View>

          {/* Distance */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Distance maximale: {distance} km</Text>
            <MultiSlider 
              style={styles.slider}
              minimumValue={5}
              maximumValue={500}
              step={5}
              value={distance}
              onValueChange={(value) => setDistance(value)}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.lightGray}
              thumbTintColor={Colors.primary}
            />
          </View>

          {/* Marques */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Marques</Text>
            <View style={styles.optionsGrid}>
              {makeOptions.map(make => (
                <TouchableOpacity
                  key={make}
                  style={[
                    styles.optionButton,
                    makes.includes(make) ? styles.optionButtonSelected : null
                  ]}
                  onPress={() => toggleMake(make)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      makes.includes(make) ? styles.optionButtonTextSelected : null
                    ]}
                  >
                    {make}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Type de carburant */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Carburant</Text>
            <View style={styles.optionsGrid}>
              {fuelTypeOptions.map(fuel => (
                <TouchableOpacity
                  key={fuel}
                  style={[
                    styles.optionButton,
                    fuelTypes.includes(fuel) ? styles.optionButtonSelected : null
                  ]}
                  onPress={() => toggleFuelType(fuel)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      fuelTypes.includes(fuel) ? styles.optionButtonTextSelected : null
                    ]}
                  >
                    {fuel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Type de transmission */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Transmission</Text>
            <View style={styles.optionsGrid}>
              {transmissionOptions.map(transmission => (
                <TouchableOpacity
                  key={transmission}
                  style={[
                    styles.optionButton,
                    transmissionTypes.includes(transmission) ? styles.optionButtonSelected : null
                  ]}
                  onPress={() => toggleTransmission(transmission)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      transmissionTypes.includes(transmission) ? styles.optionButtonTextSelected : null
                    ]}
                  >
                    {transmission}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Couleurs */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Couleurs</Text>
            <View style={styles.optionsGrid}>
              {colorOptions.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.optionButton,
                    colors.includes(color) ? styles.optionButtonSelected : null
                  ]}
                  onPress={() => toggleColor(color)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      colors.includes(color) ? styles.optionButtonTextSelected : null
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Avec photos uniquement */}
          <View style={styles.switchSection}>
            <Text style={styles.sectionTitle}>Uniquement avec photos</Text>
            <Switch
              value={onlyWithImages}
              onValueChange={setOnlyWithImages}
              trackColor={{ false: Colors.lightGray, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.spacing} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    padding: 5,
  },
  resetButton: {
    padding: 5,
  },
  resetButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rangeLabel: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  sliderContainer: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    color: Colors.darkGray,
    fontSize: 14,
  },
  optionButtonTextSelected: {
    color: Colors.white,
    fontWeight: '500',
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  spacing: {
    height: 20,
  },
}); 