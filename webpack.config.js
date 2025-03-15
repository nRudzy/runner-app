/**
 * Configuration webpack pour l'application web
 */

const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Ajouter des alias pour les modules problématiques
  config.resolve.alias = {
    ...config.resolve.alias,
    // Assurer que react-native pointe vers react-native-web
    'react-native$': 'react-native-web',
    // Vous pouvez ajouter d'autres alias ici si nécessaire
  };
  
  // Ajouter des extensions web
  config.resolve.extensions = [
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    ...config.resolve.extensions,
  ];
  
  // Ajouter des polyfills pour les modules manquants
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native': require.resolve('react-native-web'),
  };
  
  return config;
}; 