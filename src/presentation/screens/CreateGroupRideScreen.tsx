import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../core/config/Colors';
import ServiceLocator from '../../core/di/ServiceLocator';

interface CreateGroupRideScreenProps {
  navigation: any;
}

export default function CreateGroupRideScreen({ navigation }: CreateGroupRideScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const apiRepository = ServiceLocator.getInstance().getApiRepository();

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = new Date(date);
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour le trajet');
      return false;
    }
    
    if (!description.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une description pour le trajet');
      return false;
    }
    
    if (!location.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un lieu de rendez-vous');
      return false;
    }
    
    if (date <= new Date()) {
      Alert.alert('Erreur', 'La date du trajet doit être dans le futur');
      return false;
    }
    
    const participants = parseInt(maxParticipants);
    if (isNaN(participants) || participants < 2 || participants > 50) {
      Alert.alert('Erreur', 'Le nombre de participants doit être entre 2 et 50');
      return false;
    }
    
    return true;
  };

  const createRide = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const user = await apiRepository.getCurrentUser();
      
      const newRide = {
        title,
        description,
        location,
        date: date.toISOString(),
        maxParticipants: parseInt(maxParticipants),
        organizerId: user.id
      };
      
      await apiRepository.createGroupRide(newRide);
      
      Alert.alert(
        'Succès', 
        'Votre trajet en groupe a été créé avec succès!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erreur lors de la création du trajet:', error);
      Alert.alert('Erreur', 'Impossible de créer le trajet en groupe');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titre</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Titre du trajet"
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Description du trajet, itinéraire, etc."
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lieu de rendez-vous</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Adresse ou lieu de rendez-vous"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color={Colors.light.tint} />
              <Text style={styles.datePickerText}>{formatDate(date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Heure</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color={Colors.light.tint} />
              <Text style={styles.datePickerText}>{formatTime(date)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre maximum de participants</Text>
            <TextInput
              style={styles.input}
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              placeholder="Nombre de participants"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color={Colors.light.tint} />
            <Text style={styles.infoText}>
              En créant ce trajet en groupe, vous acceptez d'en être l'organisateur et d'être responsable de sa coordination.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.createButton}
            onPress={createRide}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Créer le trajet</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.backFloatingButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginTop: 5,
    color: '#888',
    fontSize: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.tint,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  backFloatingButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 