/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Configuration des couleurs de l'application
 * Centralise toutes les couleurs pour maintenir une cohérence visuelle
 */

const Colors = {
  // Couleurs principales
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  
  // Couleurs neutres
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F5F5F5',
  mediumGray: '#E0E0E0',
  darkGray: '#757575',
  
  // Couleurs fonctionnelles
  success: '#4CAF50',
  danger: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  error: '#F44336', // Alias pour danger, pour compatibilité
  
  // Couleurs d'interface
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Couleurs de texte
  textPrimary: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textDisabled: '#BDBDBD',
  textLink: '#1976D2',
  
  // Couleurs d'action
  like: '#4CAF50',
  dislike: '#F44336',
  superLike: '#2196F3',
  
  // Couleurs de statut
  online: '#4CAF50',
  offline: '#9E9E9E',
  busy: '#FFC107',
  
  // Dégradés
  gradient: {
    primary: ['#FF6B6B', '#FF8E8E'],
    secondary: ['#4ECDC4', '#6DEFE7'],
    dark: ['#2B2B2B', '#1A1A1A'],
  },
};

export default Colors; 