import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import { GroupRide, User } from '../../domain/entities/Models';
import ServiceLocator from '../../core/di/ServiceLocator';

interface GroupRideDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      rideId: string;
    }
  }
}

export default function GroupRideDetailsScreen({ navigation, route }: GroupRideDetailsScreenProps) {
  const { rideId } = route.params;
  const [ride, setRide] = useState<GroupRide | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const apiRepository = ServiceLocator.getInstance().getApiRepository();

  useEffect(() => {
    loadRideDetails();
  }, []);

  const loadRideDetails = async () => {
    setLoading(true);
    try {
      const user = await apiRepository.getCurrentUser();
      setCurrentUser(user);
      
      const rideDetails = await apiRepository.getGroupRideDetails(rideId);
      setRide(rideDetails);
    } catch (error) {
      console.error('Erreur lors du chargement des détails du trajet:', error);
      Alert.alert('Erreur', 'Impossible de charger les détails du trajet');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const joinRide = async () => {
    if (!ride || !currentUser) return;
    
    try {
      await apiRepository.joinGroupRide(currentUser.id, ride.id);
      
      // Mettre à jour les détails du trajet
      setRide({
        ...ride,
        participants: [...ride.participants, currentUser],
        isJoined: true
      });
      
      Alert.alert('Succès', 'Vous avez rejoint ce trajet en groupe!');
    } catch (error) {
      console.error('Erreur lors de la participation au trajet:', error);
      Alert.alert('Erreur', 'Impossible de rejoindre ce trajet');
    }
  };

  const leaveRide = async () => {
    if (!ride || !currentUser) return;
    
    try {
      await apiRepository.leaveGroupRide(currentUser.id, ride.id);
      
      // Mettre à jour les détails du trajet
      setRide({
        ...ride,
        participants: ride.participants.filter(p => p.id !== currentUser.id),
        isJoined: false
      });
      
      Alert.alert('Succès', 'Vous avez quitté ce trajet en groupe');
    } catch (error) {
      console.error('Erreur lors du départ du trajet:', error);
      Alert.alert('Erreur', 'Impossible de quitter ce trajet');
    }
  };

  const cancelRide = async () => {
    if (!ride || !currentUser) return;
    
    Alert.alert(
      'Annuler le trajet',
      'Êtes-vous sûr de vouloir annuler ce trajet en groupe ? Cette action est irréversible.',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui, annuler', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiRepository.cancelGroupRide(ride.id);
              Alert.alert(
                'Trajet annulé', 
                'Le trajet a été annulé avec succès',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              console.error('Erreur lors de l\'annulation du trajet:', error);
              Alert.alert('Erreur', 'Impossible d\'annuler ce trajet');
            }
          }
        }
      ]
    );
  };

  const shareRide = async () => {
    if (!ride) return;
    
    try {
      const result = await Share.share({
        title: `Trajet en groupe: ${ride.title}`,
        message: `Rejoins-moi pour un trajet en groupe "${ride.title}" le ${formatDate(new Date(ride.date))} à ${formatTime(new Date(ride.date))} à ${ride.location}. Ouvre l'application Runner pour plus de détails!`
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
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

  const isOrganizer = () => {
    return currentUser && ride && currentUser.id === ride.organizer.id;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Chargement des détails...</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={80} color="#ff6b6b" />
        <Text style={styles.errorText}>Impossible de charger les détails du trajet</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const rideDate = new Date(ride.date);
  const isPastRide = rideDate < new Date();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonHeader} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du trajet</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareRide}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{ride.title}</Text>
          {ride.isJoined && (
            <View style={styles.joinedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.joinedText}>Inscrit</Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={22} color={Colors.light.tint} />
              <Text style={styles.infoText}>{formatDate(rideDate)}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={22} color={Colors.light.tint} />
              <Text style={styles.infoText}>{formatTime(rideDate)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={22} color={Colors.light.tint} />
              <Text style={styles.infoText}>{ride.location}</Text>
            </View>
          </View>
          
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerLabel}>Organisé par:</Text>
            <View style={styles.organizer}>
              <Image source={{ uri: ride.organizer.avatar }} style={styles.organizerAvatar} />
              <Text style={styles.organizerName}>{ride.organizer.name}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{ride.description}</Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            Participants ({ride.participants.length}/{ride.maxParticipants})
          </Text>
          <View style={styles.participantsContainer}>
            {ride.participants.map(participant => (
              <View key={participant.id} style={styles.participantItem}>
                <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                <Text style={styles.participantName}>{participant.name}</Text>
                {participant.id === ride.organizer.id && (
                  <View style={styles.organizerBadge}>
                    <Text style={styles.organizerBadgeText}>Organisateur</Text>
                  </View>
                )}
              </View>
            ))}
            
            {ride.participants.length === 0 && (
              <Text style={styles.noParticipantsText}>
                Aucun participant pour le moment
              </Text>
            )}
          </View>
        </View>
        
        {!isPastRide && (
          <View style={styles.actionContainer}>
            {isOrganizer() ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]} 
                onPress={cancelRide}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Annuler le trajet</Text>
              </TouchableOpacity>
            ) : ride.isJoined ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.leaveButton]} 
                onPress={leaveRide}
              >
                <Ionicons name="exit-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Quitter le trajet</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.joinButton]} 
                onPress={joinRide}
                disabled={ride.participants.length >= ride.maxParticipants}
              >
                <Ionicons name="enter-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {ride.participants.length >= ride.maxParticipants ? 'Complet' : 'Rejoindre le trajet'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {isPastRide && (
          <View style={styles.pastRideBanner}>
            <Ionicons name="time" size={24} color="#666" />
            <Text style={styles.pastRideText}>Ce trajet est déjà passé</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButtonHeader: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  joinedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginLeft: 10,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  organizerLabel: {
    fontSize: 14,
    color: '#666',
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  organizerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  organizerName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  participantsContainer: {
    marginTop: 10,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  participantName: {
    marginLeft: 15,
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  organizerBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  organizerBadgeText: {
    fontSize: 12,
    color: '#666',
  },
  noParticipantsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  actionContainer: {
    padding: 15,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
  },
  joinButton: {
    backgroundColor: Colors.light.tint,
  },
  leaveButton: {
    backgroundColor: '#ff6b6b',
  },
  cancelButton: {
    backgroundColor: '#ff6b6b',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  pastRideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    margin: 15,
    marginTop: 0,
    borderRadius: 10,
    marginBottom: 30,
  },
  pastRideText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
}); 