/**
 * Configuration de Metro Bundler pour l'application
 * Assure la compatibilité avec react-native-web
 */

const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Obtenir la configuration par défaut d'Expo
const config = getDefaultConfig(__dirname);

// Ajouter les extensions web
config.resolver.sourceExts.push('web.js', 'web.jsx', 'web.ts', 'web.tsx');

// Assurer que les modules web sont correctement résolus
config.resolver.resolverMainFields = ['browser', 'main', 'react-native'];

// Ajouter des alias pour les modules problématiques si nécessaire
config.resolver.extraNodeModules = {
  // Exemple: 'module-name': path.resolve(__dirname, 'path/to/polyfill'),
};

module.exports = config; 