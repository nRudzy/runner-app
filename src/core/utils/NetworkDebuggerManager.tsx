/**
 * Gestionnaire pour activer le débogueur réseau dans l'application
 * Permet d'activer le débogueur via un geste (triple tap) à un emplacement précis
 */

import React, { useState, useRef, createContext, useContext } from 'react';
import { 
  View, 
  TouchableWithoutFeedback, 
  StyleSheet, 
  Dimensions, 
  Platform,
  AppState,
  AppStateStatus
} from 'react-native';
import NetworkDebugger from '../../presentation/components/NetworkDebugger';

// Interface du contexte
interface NetworkDebuggerContextType {
  showDebugger: () => void;
  hideDebugger: () => void;
  isVisible: boolean;
  setDebuggerEnabled: (enabled: boolean) => void;
  isEnabled: boolean;
}

// Valeurs par défaut du contexte
const defaultContext: NetworkDebuggerContextType = {
  showDebugger: () => {},
  hideDebugger: () => {},
  isVisible: false,
  setDebuggerEnabled: () => {},
  isEnabled: __DEV__, // Activé en mode développement uniquement par défaut
};

// Création du contexte
const NetworkDebuggerContext = createContext<NetworkDebuggerContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte
export const useNetworkDebugger = () => useContext(NetworkDebuggerContext);

// Configuration du gestionnaire
interface NetworkDebuggerConfig {
  enabled?: boolean;
  tapCount?: number; // Nombre de taps pour déclencher
  tapTimeout?: number; // Délai entre les taps en ms
  triggerAreaSize?: number; // Taille de la zone de déclenchement en points
  triggerPosition?: 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft';
}

// Props du provider
interface NetworkDebuggerProviderProps {
  children: React.ReactNode;
  config?: NetworkDebuggerConfig;
}

// Provider principal
export const NetworkDebuggerProvider: React.FC<NetworkDebuggerProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  // État du débogueur
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(config.enabled ?? __DEV__);
  
  // Configuration avec valeurs par défaut
  const {
    tapCount = 3,
    tapTimeout = 500,
    triggerAreaSize = 50,
    triggerPosition = 'topRight',
  } = config;
  
  // Références pour le compteur de taps et le timer
  const tapCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Gestionnaire d'état de l'application
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState !== 'active') {
      // Réinitialiser le compteur et le timer lorsque l'application est en arrière-plan
      resetTapCounter();
    }
  };
  
  // Effet pour suivre l'état de l'application
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      resetTapCounter();
    };
  }, []);
  
  // Réinitialiser le compteur de taps
  const resetTapCounter = () => {
    tapCountRef.current = 0;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Gestionnaire de tap pour activer le débogueur
  const handleTap = () => {
    if (!isEnabled) return;
    
    tapCountRef.current += 1;
    
    // Réinitialiser le timer à chaque tap
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Vérifier si le nombre de taps requis est atteint
    if (tapCountRef.current >= tapCount) {
      showDebugger();
      resetTapCounter();
      return;
    }
    
    // Définir un timer pour réinitialiser le compteur si l'utilisateur arrête de taper
    timerRef.current = setTimeout(() => {
      resetTapCounter();
    }, tapTimeout);
  };
  
  // Fonctions d'affichage/masquage du débogueur
  const showDebugger = () => setIsVisible(true);
  const hideDebugger = () => setIsVisible(false);
  const setDebuggerEnabled = (enabled: boolean) => setIsEnabled(enabled);
  
  // Obtenir le style de position pour la zone de déclenchement
  const getTriggerPositionStyle = () => {
    switch (triggerPosition) {
      case 'topLeft':
        return { top: 0, left: 0 };
      case 'bottomRight':
        return { bottom: 0, right: 0 };
      case 'bottomLeft':
        return { bottom: 0, left: 0 };
      case 'topRight':
      default:
        return { top: 0, right: 0 };
    }
  };
  
  return (
    <NetworkDebuggerContext.Provider
      value={{
        showDebugger,
        hideDebugger,
        isVisible,
        setDebuggerEnabled,
        isEnabled,
      }}
    >
      {children}
      
      {/* Zone invisible pour déclencher le débogueur */}
      {isEnabled && (
        <View style={[styles.triggerArea, { width: triggerAreaSize, height: triggerAreaSize }, getTriggerPositionStyle()]}>
          <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.touchArea} />
          </TouchableWithoutFeedback>
        </View>
      )}
      
      {/* Débogueur réseau */}
      <NetworkDebugger visible={isVisible} onClose={hideDebugger} />
    </NetworkDebuggerContext.Provider>
  );
};

const styles = StyleSheet.create({
  triggerArea: {
    position: 'absolute',
    zIndex: 9999,
  },
  touchArea: {
    width: '100%',
    height: '100%',
    // Décommenter pour rendre la zone visible pendant le développement
    // backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
});

// Composant wrapper pour envelopper toute l'application
interface WithNetworkDebuggerProps {
  children: React.ReactNode;
  config?: NetworkDebuggerConfig;
}

export const withNetworkDebugger = (
  Component: React.ComponentType<any>,
  config?: NetworkDebuggerConfig
) => {
  return (props: any) => (
    <NetworkDebuggerProvider config={config}>
      <Component {...props} />
    </NetworkDebuggerProvider>
  );
};

export default {
  Provider: NetworkDebuggerProvider,
  useNetworkDebugger,
  withNetworkDebugger,
}; 