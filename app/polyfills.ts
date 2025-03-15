/**
 * Polyfills pour l'application web
 * Ce fichier est importé dans _layout.tsx pour s'assurer que tous les polyfills sont disponibles
 * avant que d'autres modules ne les utilisent
 */

// Importer le shim Platform
import PlatformShim from './platform-shim';

// Exposer le shim Platform globalement
if (typeof window !== 'undefined' && !window.Platform) {
  window.Platform = PlatformShim;
  console.log('Polyfill: Platform shim exposé globalement');
}

// Autres polyfills si nécessaire...

export { PlatformShim as Platform }; 