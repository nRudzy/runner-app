import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';

// Demo data for matches
const demoMatches = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Sophie Martin',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      location: 'Lyon, France',
    },
    vehicle: {
      id: '201',
      make: 'Porsche',
      model: '911 Carrera',
      year: 2018,
      color: 'Noir',
      image: 'https://images.unsplash.com/photo-1584060573923-589425f3c0db?q=80&w=1000',
    },
    lastMessage: {
      text: 'Votre voiture est magnifique ! Est-ce que je peux la voir en vrai?',
      timestamp: '14:30',
      isRead: true,
    },
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Thomas Dubois',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      location: 'Paris, France',
    },
    vehicle: {
      id: '202',
      make: 'BMW',
      model: 'M4 Competition',
      year: 2021,
      color: 'Bleu',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000',
    },
    lastMessage: {
      text: 'J\'ai la même! On pourrait organiser une sortie?',
      timestamp: 'Hier',
      isRead: false,
    },
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Emma Bernard',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      location: 'Marseille, France',
    },
    vehicle: {
      id: '203',
      make: 'Audi',
      model: 'RS6 Avant',
      year: 2020,
      color: 'Gris',
      image: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1000',
    },
    lastMessage: {
      text: 'Combien de chevaux avez-vous?',
      timestamp: 'Lun',
      isRead: true,
    },
  },
  {
    id: '4',
    user: {
      id: '104',
      name: 'Lucas Petit',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      location: 'Bordeaux, France',
    },
    vehicle: {
      id: '204',
      make: 'Mercedes',
      model: 'AMG GT',
      year: 2019,
      color: 'Rouge',
      image: 'https://images.unsplash.com/photo-1617502090448-a0c7173dbc4b?q=80&w=1000',
    },
    lastMessage: {
      text: 'Est-ce que vous allez au rassemblement dimanche?',
      timestamp: '12/03',
      isRead: true,
    },
  },
  {
    id: '5',
    user: {
      id: '105',
      name: 'Julie Moreau',
      avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
      location: 'Toulouse, France',
    },
    vehicle: {
      id: '205',
      make: 'Volkswagen',
      model: 'Golf GTI',
      year: 2021,
      color: 'Blanc',
      image: 'https://images.unsplash.com/photo-1611967164521-abae8fba4668?q=80&w=1000',
    },
    lastMessage: {
      text: 'Merci pour les conseils de personnalisation!',
      timestamp: '10/03',
      isRead: true,
    },
  },
];

const MatchCard = ({ match, onPress }) => {
  return (
    <TouchableOpacity style={styles.matchCard} onPress={onPress}>
      <View style={styles.matchHeader}>
        <Image source={{ uri: match.user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{match.user.name}</Text>
          <Text style={styles.userLocation}>
            <Ionicons name="location-outline" size={14} color={Colors.darkGray} />
            {' '}{match.user.location}
          </Text>
        </View>
        <Text style={styles.timestamp}>{match.lastMessage.timestamp}</Text>
      </View>

      <View style={styles.vehicleInfo}>
        <Image source={{ uri: match.vehicle.image }} style={styles.vehicleImage} />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>{match.vehicle.make} {match.vehicle.model}</Text>
          <Text style={styles.vehicleSpecs}>{match.vehicle.year} • {match.vehicle.color}</Text>
        </View>
      </View>

      <View style={styles.messageContainer}>
        <Text 
          style={[styles.messageText, !match.lastMessage.isRead && styles.unreadMessage]} 
          numberOfLines={1}
        >
          {match.lastMessage.text}
        </Text>
        {!match.lastMessage.isRead && (
          <View style={styles.unreadBadge} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MatchesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'new'

  const filteredMatches = demoMatches.filter(match => {
    const matchText = `${match.user.name} ${match.vehicle.make} ${match.vehicle.model}`.toLowerCase();
    return matchText.includes(searchQuery.toLowerCase());
  }).filter(match => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !match.lastMessage.isRead;
    if (activeTab === 'new') {
      // For demo purposes, let's consider matches with recent messages (today/yesterday) as new
      return match.lastMessage.timestamp === '14:30' || match.lastMessage.timestamp === 'Hier';
    }
    return true;
  });

  const handleMatchPress = (match) => {
    console.log('Match pressed:', match.id);
    // Navigate to chat screen with this match
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Matchs</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des matchs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.darkGray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]} 
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Non lus</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'new' && styles.activeTab]} 
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>Récents</Text>
        </TouchableOpacity>
      </View>

      {filteredMatches.length > 0 ? (
        <FlatList
          data={filteredMatches}
          renderItem={({ item }) => <MatchCard match={item} onPress={() => handleMatchPress(item)} />}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-sport" size={60} color={Colors.lightGray} />
          <Text style={styles.emptyText}>Aucun match trouvé</Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'all' 
              ? 'Continuez à swiper pour trouver des matchs !' 
              : activeTab === 'unread' 
                ? 'Vous avez lu tous vos messages.' 
                : 'Aucun nouveau match récemment.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.black,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGray,
  },
  activeTabText: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  vehicleInfo: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  vehicleImage: {
    width: 80,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 2,
  },
  vehicleSpecs: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkGray,
  },
  unreadMessage: {
    fontWeight: '600',
    color: Colors.black,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
}); 