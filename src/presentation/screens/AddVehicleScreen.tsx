import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';

// Mock function to select images from gallery
const selectImages = () => {
  // This would normally use image picker library
  // For now, return demo images
  return [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1000',
  ];
};

// Car brands for dropdown
const carBrands = [
  'Audi', 'BMW', 'Citroën', 'Ferrari', 'Ford', 'Honda', 'Hyundai', 'Jaguar', 
  'Lamborghini', 'Mercedes', 'Nissan', 'Peugeot', 'Porsche', 'Renault', 
  'Toyota', 'Volkswagen', 'Volvo'
];

// Fuel types for dropdown
const fuelTypes = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];

// Car colors for dropdown
const carColors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Marron'];

export default function AddVehicleScreen() {
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    color: '',
    fuelType: '',
    transmission: '',
    description: '',
    features: [],
    location: '',
  });
  
  const [images, setImages] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  
  const handleInputChange = (field, value) => {
    setVehicleData({
      ...vehicleData,
      [field]: value
    });
  };
  
  const handleImageSelect = () => {
    const newImages = selectImages();
    setImages([...images, ...newImages]);
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = ['make', 'model', 'year', 'price'];
    const missingFields = requiredFields.filter(field => !vehicleData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Champs manquants',
        'Veuillez remplir tous les champs obligatoires.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (images.length === 0) {
      Alert.alert(
        'Images manquantes',
        'Veuillez ajouter au moins une photo de votre véhicule.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Submit vehicle data
    console.log('Submitting vehicle data:', { ...vehicleData, images });
    Alert.alert(
      'Véhicule ajouté !',
      'Votre véhicule a été ajouté avec succès.',
      [{ text: 'OK' }]
    );
    
    // Reset form
    setVehicleData({
      make: '',
      model: '',
      year: '',
      price: '',
      mileage: '',
      color: '',
      fuelType: '',
      transmission: '',
      description: '',
      features: [],
      location: '',
    });
    setImages([]);
  };
  
  const renderDropdown = (items, selectedValue, onSelect, field) => {
    return (
      <View style={styles.dropdownContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => {
              handleInputChange(field, item);
              onSelect(false);
            }}
          >
            <Text style={styles.dropdownText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ajouter un véhicule</Text>
          <Text style={styles.subtitle}>Partagez les détails de votre véhicule</Text>
        </View>
        
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.vehicleImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={Colors.red} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={handleImageSelect}>
              <Ionicons name="add" size={40} color={Colors.darkGray} />
              <Text style={styles.addImageText}>Ajouter des photos</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informations du véhicule</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Marque <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={styles.dropdownField}
              onPress={() => setShowBrandDropdown(!showBrandDropdown)}
            >
              <Text style={vehicleData.make ? styles.inputText : styles.placeholderText}>
                {vehicleData.make || 'Sélectionner une marque'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
            {showBrandDropdown && renderDropdown(carBrands, vehicleData.make, setShowBrandDropdown, 'make')}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Modèle <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Golf GTI"
              value={vehicleData.model}
              onChangeText={(text) => handleInputChange('model', text)}
              placeholderTextColor={Colors.darkGray}
            />
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Année <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 2021"
                value={vehicleData.year}
                onChangeText={(text) => handleInputChange('year', text)}
                keyboardType="number-pad"
                placeholderTextColor={Colors.darkGray}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Prix (€) <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 25000"
                value={vehicleData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                keyboardType="number-pad"
                placeholderTextColor={Colors.darkGray}
              />
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Kilométrage</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 45000"
                value={vehicleData.mileage}
                onChangeText={(text) => handleInputChange('mileage', text)}
                keyboardType="number-pad"
                placeholderTextColor={Colors.darkGray}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Couleur</Text>
              <TouchableOpacity
                style={styles.dropdownField}
                onPress={() => setShowColorDropdown(!showColorDropdown)}
              >
                <Text style={vehicleData.color ? styles.inputText : styles.placeholderText}>
                  {vehicleData.color || 'Sélectionner'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.darkGray} />
              </TouchableOpacity>
              {showColorDropdown && renderDropdown(carColors, vehicleData.color, setShowColorDropdown, 'color')}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Type de carburant</Text>
            <TouchableOpacity
              style={styles.dropdownField}
              onPress={() => setShowFuelDropdown(!showFuelDropdown)}
            >
              <Text style={vehicleData.fuelType ? styles.inputText : styles.placeholderText}>
                {vehicleData.fuelType || 'Sélectionner un type de carburant'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.darkGray} />
            </TouchableOpacity>
            {showFuelDropdown && renderDropdown(fuelTypes, vehicleData.fuelType, setShowFuelDropdown, 'fuelType')}
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Transmission</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  vehicleData.transmission === 'Manuelle' && styles.selectedButton
                ]}
                onPress={() => handleInputChange('transmission', 'Manuelle')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    vehicleData.transmission === 'Manuelle' && styles.selectedButtonText
                  ]}
                >
                  Manuelle
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  vehicleData.transmission === 'Automatique' && styles.selectedButton
                ]}
                onPress={() => handleInputChange('transmission', 'Automatique')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    vehicleData.transmission === 'Automatique' && styles.selectedButtonText
                  ]}
                >
                  Automatique
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.selectionButton,
                  vehicleData.transmission === 'Semi-automatique' && styles.selectedButton
                ]}
                onPress={() => handleInputChange('transmission', 'Semi-automatique')}
              >
                <Text
                  style={[
                    styles.buttonText,
                    vehicleData.transmission === 'Semi-automatique' && styles.selectedButtonText
                  ]}
                >
                  Semi-auto
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Localisation</Text>
            <View style={styles.locationInput}>
              <Ionicons name="location-outline" size={20} color={Colors.darkGray} style={styles.locationIcon} />
              <TextInput
                style={styles.locationTextInput}
                placeholder="Ex: Paris, France"
                value={vehicleData.location}
                onChangeText={(text) => handleInputChange('location', text)}
                placeholderTextColor={Colors.darkGray}
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Décrivez votre véhicule (modifications, état, historique...)"
              value={vehicleData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={Colors.darkGray}
            />
          </View>
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Ajouter mon véhicule</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 15,
  },
  imagesSection: {
    marginBottom: 30,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    marginRight: '5%',
    marginBottom: 15,
    position: 'relative',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    color: Colors.darkGray,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  formSection: {
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 8,
  },
  required: {
    color: Colors.red,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    color: Colors.black,
  },
  dropdownField: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: Colors.black,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    minHeight: 120,
    color: Colors.black,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  selectedButtonText: {
    color: Colors.white,
    fontWeight: '500',
  },
  locationInput: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationTextInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: Colors.black,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    maxHeight: 200,
    overflow: 'scroll',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.black,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
}); 