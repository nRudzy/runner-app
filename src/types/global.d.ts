/**
 * Déclarations de types globaux pour l'application
 * Ce fichier définit les types qui sont utilisés dans toute l'application
 * et n'ont pas besoin d'être importés explicitement
 */

// Déclaration des modules sans définitions de types
declare module '@expo/vector-icons';
declare module 'react-native-*';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

// Types pour NodeJS
declare namespace NodeJS {
  interface Timeout {}
  interface Process {
    env: {
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: string | undefined;
    };
  }
}

// Types pour les événements personnalisés
interface CustomEventMap {
  'auth:login': CustomEvent<{ userId: string }>;
  'auth:logout': CustomEvent;
  'match:new': CustomEvent<{ matchId: string; vehicleId: string }>;
  'message:new': CustomEvent<{ messageId: string; matchId: string }>;
}

// Extension de l'interface Window pour les événements personnalisés
declare global {
  interface Document {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (ev: CustomEventMap[K]) => void
    ): void;
    removeEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (ev: CustomEventMap[K]) => void
    ): void;
    dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
  }
}

// Extension pour les composants et hooks React Native
declare module 'react-native' {
  export interface ViewProps {
    testID?: string;
  }
  
  export interface TextProps {
    testID?: string;
  }
}

// Augmenter le type de style pour React Native
declare module 'react-native' {
  export interface TextStyle {
    textDecorationColor?: string;
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
  }
}

// Définition de l'environnement de développement
declare const __DEV__: boolean; 