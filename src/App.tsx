/**
 * Point d'entrée principal de l'application Runner
 * Configure et initialise tous les providers et services nécessaires
 */

import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Contextes et providers
import { AuthProvider } from './core/context/AuthContext';

// Écrans
import LoginScreen from './presentation/screens/LoginScreen';
import RegisterScreen from './presentation/screens/RegisterScreen';
import SwipeScreen from './presentation/screens/SwipeScreen';
import ChatScreen from './presentation/screens/ChatScreen';
import MatchListScreen from './presentation/screens/MatchListScreen';

// Utils et config
import Colors from './core/config/Colors';
import { NetworkDebuggerProvider } from './core/utils/NetworkDebuggerManager';
import { __DEV__ } from './core/config/Constants';

// Navigation
const Stack = createNativeStackNavigator();

// Initialiser les intercepteurs réseau en mode développement
if (__DEV__) {
  // Importation dynamique pour éviter l'exécution en production
  import('./core/utils/NetworkLogger').then(NetworkLogger => {
    // Configuration du logger réseau
    NetworkLogger.default.configure({
      enabled: true,
      maxLogs: 100,
      sensitiveDataKeys: ['password', 'token', 'auth', 'authorization', 'secret'],
    });
    
    console.log('🌐 Intercepteurs réseau initialisés en mode développement');
  });
}

/**
 * Composant principal de l'application
 */
const App: React.FC = () => {
  return (
    <NetworkDebuggerProvider
      config={{
        enabled: __DEV__,
        tapCount: 3,
        triggerPosition: 'topRight',
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
          translucent={false}
        />
        
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerStyle: {
                  backgroundColor: Colors.background,
                  elevation: 0, // Android
                  shadowOpacity: 0, // iOS
                  borderBottomWidth: 0,
                },
                headerTintColor: Colors.textPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                contentStyle: {
                  backgroundColor: Colors.background,
                },
              }}
            >
              {/* Écrans d'authentification */}
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ 
                  title: 'Créer un compte',
                  headerShown: true,
                }}
              />
              
              {/* Écrans principaux de l'application */}
              <Stack.Screen
                name="Swipe"
                component={SwipeScreen}
                options={{ 
                  title: 'Découvrir',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MatchList"
                component={MatchListScreen}
                options={{ 
                  title: 'Mes matchs',
                  headerShown: true,
                }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={({ route }: { route: any }) => ({ 
                  title: route.params?.matchedUser?.fullName || 'Discussion',
                  headerShown: true,
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
    </NetworkDebuggerProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default App; 