import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import { GroupRide } from '../../domain/entities/Models';
import ServiceLocator from '../../core/di/ServiceLocator';

interface GroupRideScreenProps {
  navigation: any;
}

export default function GroupRideScreen({ navigation }: GroupRideScreenProps) {
  const [upcomingRides, setUpcomingRides] = useState<GroupRide[]>([]);
  const [pastRides, setPastRides] = useState<GroupRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const apiRepository = ServiceLocator.getInstance().getApiRepository();

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    setLoading(true);
    try {
      const user = await apiRepository.getCurrentUser();
      const rides = await apiRepository.getGroupRides(user.id);
      
      const now = new Date();
      const upcoming = rides.filter(ride => new Date(ride.date) > now);
      const past = rides.filter(ride => new Date(ride.date) <= now);
      
      setUpcomingRides(upcoming);
      setPastRides(past);
    } catch (error) {
      console.error('Erreur lors du chargement des trajets en groupe:', error);
      Alert.alert('Erreur', 'Impossible de charger les trajets en groupe');
    } finally {
      setLoading(false);
    }
  };

  const joinRide = async (rideId: string) => {
    try {
      const user = await apiRepository.getCurrentUser();
      await apiRepository.joinGroupRide(user.id, rideId);
      
      // Mettre à jour la liste des trajets
      setUpcomingRides(prev => 
        prev.map(ride => 
          ride.id === rideId 
            ? { ...ride, participants: [...ride.participants, user], isJoined: true } 
            : ride
        )
      );
      
      Alert.alert('Succès', 'Vous avez rejoint ce trajet en groupe!');
    } catch (error) {
      console.error('Erreur lors de la participation au trajet:', error);
      Alert.alert('Erreur', 'Impossible de rejoindre ce trajet');
    }
  };

  const leaveRide = async (rideId: string) => {
    try {
      const user = await apiRepository.getCurrentUser();
      await apiRepository.leaveGroupRide(user.id, rideId);
      
      // Mettre à jour la liste des trajets
      setUpcomingRides(prev => 
        prev.map(ride => 
          ride.id === rideId 
            ? { 
                ...ride, 
                participants: ride.participants.filter(p => p.id !== user.id),
                isJoined: false 
              } 
            : ride
        )
      );
      
      Alert.alert('Succès', 'Vous avez quitté ce trajet en groupe');
    } catch (error) {
      console.error('Erreur lors du départ du trajet:', error);
      Alert.alert('Erreur', 'Impossible de quitter ce trajet');
    }
  };

  const createRide = () => {
    navigation.navigate('CreateGroupRide');
  };

  const renderRideItem = ({ item }: { item: GroupRide }) => {
    const formattedDate = new Date(item.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    const formattedTime = new Date(item.date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.rideCard}>
        <View style={styles.rideHeader}>
          <Text style={styles.rideTitle}>{item.title}</Text>
          {item.isJoined && (
            <View style={styles.joinedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#fff" />
              <Text style={styles.joinedText}>Inscrit</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rideInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.infoText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.infoText}>{formattedTime}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={18} color={Colors.light.tint} />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
        </View>
        
        <Text style={styles.rideDescription}>{item.description}</Text>
        
        <View style={styles.participantsContainer}>
          <Text style={styles.participantsTitle}>
            Participants ({item.participants.length}/{item.maxParticipants})
          </Text>
          <View style={styles.avatarList}>
            {item.participants.slice(0, 5).map((participant, index) => (
              <Image 
                key={participant.id} 
                source={{ uri: participant.avatar }} 
                style={[styles.avatar, { marginLeft: index > 0 ? -15 : 0 }]} 
              />
            ))}
            {item.participants.length > 5 && (
              <View style={[styles.avatar, styles.moreAvatar]}>
                <Text style={styles.moreAvatarText}>+{item.participants.length - 5}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.organizedByContainer}>
          <Text style={styles.organizedByText}>Organisé par:</Text>
          <View style={styles.organizerContainer}>
            <Image source={{ uri: item.organizer.avatar }} style={styles.organizerAvatar} />
            <Text style={styles.organizerName}>{item.organizer.name}</Text>
          </View>
        </View>
        
        {activeTab === 'upcoming' && (
          <View style={styles.actionContainer}>
            {item.isJoined ? (
              <TouchableOpacity 
                style={[styles.actionButton, styles.leaveButton]} 
                onPress={() => leaveRide(item.id)}
              >
                <Ionicons name="exit-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Quitter</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.joinButton]} 
                onPress={() => joinRide(item.id)}
                disabled={item.participants.length >= item.maxParticipants}
              >
                <Ionicons name="enter-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {item.participants.length >= item.maxParticipants ? 'Complet' : 'Rejoindre'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.detailsButton]} 
              onPress={() => navigation.navigate('GroupRideDetails', { rideId: item.id })}
            >
              <Ionicons name="information-circle-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Détails</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {activeTab === 'past' && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.detailsButton, { alignSelf: 'center' }]} 
            onPress={() => navigation.navigate('GroupRideDetails', { rideId: item.id })}
          >
            <Ionicons name="information-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Voir les détails</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-sport" size={80} color={Colors.light.tint} />
      <Text style={styles.emptyText}>
        {activeTab === 'upcoming' 
          ? 'Aucun trajet en groupe à venir' 
          : 'Aucun trajet en groupe passé'}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity style={styles.createButton} onPress={createRide}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Créer un trajet</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} 
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            À venir
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'past' && styles.activeTab]} 
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            Passés
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Chargement des trajets...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'upcoming' ? upcomingRides : pastRides}
          renderItem={renderRideItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity style={styles.floatingButton} onPress={createRide}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.light.tint,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: Colors.light.tint,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  rideCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rideTitle: {
    fontSize: 18,
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
  },
  joinedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 5,
  },
  rideInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  rideDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  participantsContainer: {
    marginBottom: 15,
  },
  participantsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
  },
  avatarList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  moreAvatar: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  organizedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  organizedByText: {
    fontSize: 14,
    color: '#666',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  organizerAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  organizerName: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  joinButton: {
    backgroundColor: Colors.light.tint,
  },
  leaveButton: {
    backgroundColor: '#ff6b6b',
  },
  detailsButton: {
    backgroundColor: '#5e5ce6',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
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