import React from 'react';
import './polyfills'; // Importer les polyfills en premier
import { Platform } from './polyfills'; // Importer Platform depuis notre polyfill
import { Stack } from "expo-router";
import { AuthProvider } from "../src/core/context/AuthContext";
import { NetworkDebuggerProvider } from "../src/core/utils/NetworkDebuggerManager";
import { __DEV__ } from "../src/core/config/Constants";
import { StatusBar } from "react-native";
import Colors from "../src/core/config/Colors";

// Vérifier que Platform est correctement importé
console.log('Platform dans _layout.tsx:', Platform);

export default function RootLayout() {
  return (
    <NetworkDebuggerProvider
      config={{
        enabled: __DEV__,
        tapCount: 3,
        triggerPosition: 'topRight',
      }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      
      <AuthProvider>
        <Stack
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
        />
      </AuthProvider>
    </NetworkDebuggerProvider>
  );
} 