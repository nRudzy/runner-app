/**
 * Shim pour Platform
 * Ce fichier est utilisé pour s'assurer que Platform est disponible globalement
 */

// Vérifier si nous sommes dans un environnement web
const isWeb = typeof window !== 'undefined';

// Créer un objet Platform de base
const PlatformShim = {
  OS: isWeb ? 'web' : 'unknown',
  select: function(obj) {
    if (!obj) return null;
    return obj[this.OS] || obj.default;
  }
};

// Exposer Platform globalement si nous sommes dans un environnement web
if (isWeb) {
  try {
    // Essayer d'utiliser le Platform de react-native s'il est disponible
    const reactNative = require('react-native');
    if (reactNative && reactNative.Platform) {
      window.Platform = reactNative.Platform;
      console.log('Platform de react-native utilisé');
    } else {
      window.Platform = PlatformShim;
      console.log('PlatformShim utilisé (react-native.Platform non disponible)');
    }
  } catch (e) {
    // Fallback sur notre shim
    window.Platform = PlatformShim;
    console.log('PlatformShim utilisé (erreur lors de l\'import de react-native)');
  }
}

// Exporter notre shim pour les imports
export default isWeb ? (window.Platform || PlatformShim) : PlatformShim; 