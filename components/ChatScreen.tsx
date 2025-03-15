import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Match, Message, User, Vehicle } from '../constants/Models';
import { api } from '../services/api';

interface ChatScreenProps {
  matchId: string;
  onClose: () => void;
}

export default function ChatScreen({ matchId, onClose }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [otherVehicle, setOtherVehicle] = useState<Vehicle | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadData();
  }, [matchId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les données du match
      const matches = await api.getUserMatches(await getCurrentUserId());
      const currentMatch = matches.find(m => m.id === matchId);
      
      if (!currentMatch) {
        throw new Error('Match non trouvé');
      }
      
      setMatch(currentMatch);
      
      // Charger les messages
      const matchMessages = await api.getMatchMessages(matchId);
      setMessages(matchMessages);
      
      // Charger les données des utilisateurs
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      
      // Trouver l'autre utilisateur
      const otherUserId = currentMatch.users.find(id => id !== user.id);
      if (otherUserId) {
        // Dans une vraie application, nous aurions une API pour obtenir les détails de l'utilisateur
        // Ici, nous simulons avec des données fictives
        const otherUserData = {
          id: otherUserId,
          name: 'Autre utilisateur',
          email: 'autre@example.com',
          profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
          bio: 'Passionné de voitures classiques',
          location: {
            latitude: 48.8566,
            longitude: 2.3522,
            city: 'Paris'
          },
          preferences: {
            maxDistance: 50,
            vehicleTypes: [],
            yearRange: {
              min: 1960,
              max: 2023
            },
            tuned: true
          },
          subscription: 'premium' as any,
          swipesRemaining: 100,
          vehicles: [],
          matches: []
        };
        setOtherUser(otherUserData);
        
        // Charger le véhicule de l'autre utilisateur
        const otherVehicleId = currentMatch.vehicles.find(id => {
          const vehicle = user.vehicles.find(v => v.id === id);
          return !vehicle; // Si le véhicule n'appartient pas à l'utilisateur actuel
        });
        
        if (otherVehicleId) {
          const vehicleData = await api.getVehicleDetails(otherVehicleId);
          setOtherVehicle(vehicleData);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserId = async (): Promise<string> => {
    const user = await api.getCurrentUser();
    return user.id;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !match || !currentUser) return;
    
    try {
      const message = await api.sendMessage(match.id, currentUser.id, newMessage.trim());
      setMessages(prevMessages => [...prevMessages, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = currentUser && item.senderId === currentUser.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}>
            {item.content}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Chargement de la conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {otherUser && otherVehicle && (
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: otherUser.profilePicture }} 
              style={styles.userAvatar} 
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <Text style={styles.vehicleInfo}>
                {otherVehicle.make} {otherVehicle.model} ({otherVehicle.year})
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Écrivez un message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !newMessage.trim() ? styles.sendButtonDisabled : {}
          ]} 
          onPress={sendMessage}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userTextInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#666',
  },
  moreButton: {
    padding: 5,
  },
  messagesContainer: {
    padding: 15,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: '80%',
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginBottom: 2,
  },
  currentUserBubble: {
    backgroundColor: Colors.light.tint,
    borderTopRightRadius: 5,
  },
  otherUserBubble: {
    backgroundColor: '#e5e5ea',
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
}); 