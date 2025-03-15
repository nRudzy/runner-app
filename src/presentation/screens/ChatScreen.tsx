import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import { useAuth } from '../../core/context/AuthContext';
import { Message, User, Vehicle } from '../../domain/entities/Models';
import MatchRepository from '../../data/repositories/MatchRepository';

interface ChatScreenProps {
  route: {
    params: {
      matchId: string;
      user: User;
      vehicle: Vehicle;
    }
  };
  navigation: any;
}

export default function ChatScreen({ route, navigation }: ChatScreenProps) {
  const { matchId, user: matchedUser, vehicle } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user: currentUser } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();

    // Mettre à jour le titre de la navigation
    navigation.setOptions({
      title: matchedUser.username || 'Chat',
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleViewProfile}
        >
          <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const fetchMessages = async (loadMore = false) => {
    try {
      const currentPage = loadMore ? page + 1 : 1;
      const response = await MatchRepository.getMessages(matchId, currentPage);
      
      if (loadMore) {
        setMessages(prevMessages => [...prevMessages, ...response.messages]);
        setPage(currentPage);
      } else {
        setMessages(response.messages);
        setPage(1);
      }
      
      setHasMore(response.hasMore);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les messages');
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await MatchRepository.markMessagesAsRead(matchId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setIsSending(true);
    const trimmedMessage = messageText.trim();
    setMessageText('');

    try {
      const newMessage = await MatchRepository.sendMessage({
        matchId,
        content: trimmedMessage,
      });
      
      // Ajouter le nouveau message à la liste
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      
      // Faire défiler jusqu'au nouveau message
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
      setMessageText(trimmedMessage); // Restaurer le texte en cas d'erreur
    } finally {
      setIsSending(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchMessages(true);
    }
  };

  const handleViewProfile = () => {
    navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUser?.id;
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentMessageBubble : styles.receivedMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isCurrentUser ? styles.sentMessageTime : styles.receivedMessageTime
          ]}>
            {formatTime(new Date(item.createdAt))}
          </Text>
        </View>
      </View>
    );
  };

  const renderChatHeader = () => (
    <View style={styles.chatHeader}>
      <View style={styles.vehicleInfoContainer}>
        <Image 
          source={{ uri: vehicle.images[0] }} 
          style={styles.vehicleImage} 
        />
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.vehiclePrice}>{formatPrice(vehicle.price)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.viewVehicleButton} onPress={handleViewProfile}>
        <Text style={styles.viewVehicleButtonText}>Voir</Text>
      </TouchableOpacity>
    </View>
  );

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {renderChatHeader()}
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesListContent}
          inverted
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasMore ? (
              <ActivityIndicator size="small" color={Colors.darkGray} style={styles.loadMoreIndicator} />
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyMessageContainer}>
              <Text style={styles.emptyMessageText}>
                Aucun message pour le moment. Envoyez le premier message!
              </Text>
            </View>
          }
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un message..."
            placeholderTextColor={Colors.darkGray}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!messageText.trim() || isSending) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  headerButton: {
    padding: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  vehicleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  vehicleImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 2,
  },
  vehiclePrice: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  viewVehicleButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewVehicleButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  sentMessageBubble: {
    backgroundColor: Colors.primary,
  },
  receivedMessageBubble: {
    backgroundColor: Colors.white,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  sentMessageText: {
    color: Colors.white,
  },
  receivedMessageText: {
    color: Colors.black,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  sentMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedMessageTime: {
    color: Colors.darkGray,
  },
  emptyMessageContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessageText: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: 16,
    lineHeight: 24,
  },
  loadMoreIndicator: {
    marginVertical: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: Colors.black,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.inactive,
  },
}); 