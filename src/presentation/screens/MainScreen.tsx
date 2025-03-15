import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import SwipeScreen from './SwipeScreen';
import ProfileScreen from './ProfileScreen';
import MatchesScreen from './MatchesScreen';
import AddVehicleScreen from './AddVehicleScreen';

type TabScreens = 'swipe' | 'matches' | 'add' | 'profile';

/**
 * Main screen component that serves as the container for the app's navigation
 */
export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabScreens>('swipe');

  const renderScreen = () => {
    switch (activeTab) {
      case 'swipe':
        return <SwipeScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'add':
        return <AddVehicleScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <SwipeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('swipe')}
        >
          <Ionicons 
            name="car-sport" 
            size={24} 
            color={activeTab === 'swipe' ? Colors.primary : Colors.darkGray} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('matches')}
        >
          <Ionicons 
            name="heart" 
            size={24} 
            color={activeTab === 'matches' ? Colors.primary : Colors.darkGray} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('add')}
        >
          <View style={styles.addButton}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? Colors.primary : Colors.darkGray} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
}); 