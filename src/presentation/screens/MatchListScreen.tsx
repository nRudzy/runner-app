import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import MatchRepository from '../../data/repositories/MatchRepository';
import { useAuth } from '../../core/context/AuthContext';
import { MatchWithDetails } from '../../domain/entities/Models';

interface MatchListScreenProps {
  navigation: any;
}

export default function MatchListScreen({ navigation }: MatchListScreenProps) {
  const [matches, setMatches] = useState<MatchWithDetails[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'new'>('all');
  const { user } = useAuth();

  // Chargement initial et rafraîchissement des matches
  const fetchMatches = useCallback(async (showFullScreenLoader = true) => {
    if (showFullScreenLoader) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      let fetchedMatches;
      
      // Récupérer les matches en fonction de l'onglet actif
      switch (activeTab) {
        case 'unread':
          fetchedMatches = await MatchRepository.getUnreadMatches();
          break;
        case 'new':
          fetchedMatches = await MatchRepository.getRecentMatches(10);
          break;
        default:
          fetchedMatches = await MatchRepository.getMatches();
      }
      
      setMatches(fetchedMatches);
      applySearchFilter(fetchedMatches, searchQuery);
    } catch (error) {
      console.error('Error fetching matches:', error);
      Alert.alert('Erreur', 'Impossible de charger les matches');
    } finally {
      if (showFullScreenLoader) setIsLoading(false);
      else setIsRefreshing(false);
    }
  }, [activeTab, searchQuery]);

  // Filtrer les matches par recherche
  const applySearchFilter = (matchList: MatchWithDetails[], query: string) => {
    if (!query.trim()) {
      setFilteredMatches(matchList);
      return;
    }
    
    const formattedQuery = query.toLowerCase().trim();
    
    const filtered = matchList.filter(match => {
      // Rechercher dans le nom du véhicule
      const vehicleName = `${match.vehicle.make} ${match.vehicle.model}`.toLowerCase();
      // Rechercher dans le nom d'utilisateur
      const userName = match.user.username?.toLowerCase() || '';
      // Rechercher dans le dernier message
      const lastMessage = match.lastMessage?.content.toLowerCase() || '';
      // Rechercher dans la localisation
      const location = match.vehicle.location?.toLowerCase() || '';
      
      return vehicleName.includes(formattedQuery)
        || userName.includes(formattedQuery)
        || lastMessage.includes(formattedQuery)
        || location.includes(formattedQuery);
    });
    
    setFilteredMatches(filtered);
  };

  // Charger les matches au démarrage et lors du changement d'onglet
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches, activeTab]);

  // Appliquer le filtre de recherche
  useEffect(() => {
    applySearchFilter(matches, searchQuery);
  }, [searchQuery]);

  // Rafraîchir les données
  const handleRefresh = () => {
    fetchMatches(false);
  };

  // Aller au chat
  const handleMatchPress = (match: MatchWithDetails) => {
    navigation.navigate('Chat', {
      matchId: match.match.id,
      user: match.user,
      vehicle: match.vehicle,
    });
  };

  // Changer d'onglet
  const handleTabChange = (tab: 'all' | 'unread' | 'new') => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  // Rendu de l'élément match
  const renderMatchItem = ({ item }: { item: MatchWithDetails }) => {
    const lastMessageDate = item.lastMessage 
      ? new Date(item.lastMessage.createdAt)
      : new Date(item.match.createdAt);
    
    // Formatter la date pour affichage
    const formattedDate = formatMessageDate(lastMessageDate);
    
    return (
      <TouchableOpacity 
        style={styles.matchCard} 
        onPress={() => handleMatchPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.matchHeader}>
          <Image 
            source={{ uri: item.user.avatar || 'https://via.placeholder.com/50' }}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.username}</Text>
            <Text style={styles.userLocation}>
              <Ionicons name="location-outline" size={14} color={Colors.darkGray} />
              {' '}{item.user.location || 'Non spécifié'}
            </Text>
          </View>
          <Text style={styles.timestamp}>{formattedDate}</Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.vehicleInfo}>
          <Image 
            source={{ uri: item.vehicle.images[0] }} 
            style={styles.vehicleImage}
          />
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{item.vehicle.make} {item.vehicle.model}</Text>
            <Text style={styles.vehicleSpecs}>{item.vehicle.year} • {item.vehicle.color}</Text>
            <Text style={styles.vehiclePrice}>{formatPrice(item.vehicle.price)}</Text>
          </View>
        </View>

        {item.lastMessage && (
          <View style={styles.messageContainer}>
            <Text 
              style={[styles.messageText, !item.match.read && styles.unreadMessage]} 
              numberOfLines={1}
            >
              {item.lastMessage.content}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // Formatter la date du message
  const formatMessageDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Même jour (afficher l'heure)
    if (date.getDate() === now.getDate() && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear()) {
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Hier
    if (date.getDate() === yesterday.getDate() && 
        date.getMonth() === yesterday.getMonth() && 
        date.getFullYear() === yesterday.getFullYear()) {
      return 'Hier';
    }
    
    // Cette semaine (afficher le jour)
    if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[date.getDay()];
    }
    
    // Cette année (afficher jour/mois)
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    
    // Autre (afficher jour/mois/année)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };
  
  // Formatter le prix
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matches</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher dans vos matches..."
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
          onPress={() => handleTabChange('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]} 
          onPress={() => handleTabChange('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>Non lus</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'new' && styles.activeTab]} 
          onPress={() => handleTabChange('new')}
        >
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>Récents</Text>
        </TouchableOpacity>
      </View>

      {filteredMatches.length > 0 ? (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatchItem}
          keyExtractor={item => item.match.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginRight: 5,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  vehicleInfo: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  vehicleImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 2,
  },
  vehicleSpecs: {
    fontSize: 13,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  vehiclePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
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