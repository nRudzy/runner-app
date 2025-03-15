/**
 * Composant pour visualiser les logs réseau pendant le développement
 * Accessible depuis un geste de dev (triple tap dans le coin supérieur droit par exemple)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetworkLogger, { NetworkRequestState } from '../../core/utils/NetworkLogger';
import Colors from '../../core/config/Colors';

// Interface pour les props du composant
interface NetworkDebuggerProps {
  visible: boolean;
  onClose: () => void;
}

// Interface pour un élément de log
interface LogItem {
  id: string;
  url: string;
  method: string;
  state: NetworkRequestState;
  requestData?: any;
  responseData?: any;
  error?: any;
  timestamp: number;
  duration?: number;
}

const NetworkDebugger: React.FC<NetworkDebuggerProps> = ({ visible, onClose }) => {
  // État pour les logs et le filtrage
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    request: true,
    response: true,
    error: true,
  });

  // Charger les logs au montage et lors des mises à jour
  useEffect(() => {
    if (visible) {
      refreshLogs();
      
      // Rafraîchir les logs toutes les 2 secondes
      const intervalId = setInterval(() => {
        refreshLogs();
      }, 2000);
      
      return () => clearInterval(intervalId);
    }
  }, [visible]);

  // Filtrer les logs lorsque la requête de recherche ou les filtres changent
  useEffect(() => {
    filterLogs();
  }, [logs, searchQuery, activeFilters]);

  // Récupérer les logs depuis le NetworkLogger
  const refreshLogs = () => {
    const currentLogs = NetworkLogger.getLogs() as LogItem[];
    setLogs(currentLogs);
  };

  // Filtrer les logs selon la recherche et les filtres actifs
  const filterLogs = () => {
    let filtered = [...logs];
    
    // Filtrer par état
    filtered = filtered.filter(log => {
      if (log.state === NetworkRequestState.REQUEST && !activeFilters.request) return false;
      if (log.state === NetworkRequestState.RESPONSE && !activeFilters.response) return false;
      if (log.state === NetworkRequestState.ERROR && !activeFilters.error) return false;
      return true;
    });
    
    // Filtrer par texte de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => {
        return (
          log.url.toLowerCase().includes(query) ||
          log.method.toLowerCase().includes(query) ||
          JSON.stringify(log.requestData || {}).toLowerCase().includes(query) ||
          JSON.stringify(log.responseData || {}).toLowerCase().includes(query) ||
          JSON.stringify(log.error || {}).toLowerCase().includes(query)
        );
      });
    }
    
    setFilteredLogs(filtered);
  };

  // Effacer tous les logs
  const clearAllLogs = () => {
    NetworkLogger.clearLogs();
    setLogs([]);
    setFilteredLogs([]);
    setSelectedLog(null);
  };

  // Obtenir la couleur en fonction de l'état
  const getStateColor = (state: NetworkRequestState) => {
    switch (state) {
      case NetworkRequestState.REQUEST:
        return Colors.primary;
      case NetworkRequestState.RESPONSE:
        return Colors.success;
      case NetworkRequestState.ERROR:
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  // Obtenir l'icône en fonction de l'état
  const getStateIcon = (state: NetworkRequestState) => {
    switch (state) {
      case NetworkRequestState.REQUEST:
        return 'arrow-up-circle';
      case NetworkRequestState.RESPONSE:
        return 'arrow-down-circle';
      case NetworkRequestState.ERROR:
        return 'warning';
      default:
        return 'help-circle';
    }
  };

  // Formater la date pour l'affichage
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  // Rendre un élément de log
  const renderLogItem = ({ item }: { item: LogItem }) => (
    <TouchableOpacity
      style={styles.logItem}
      onPress={() => setSelectedLog(item)}
    >
      <View style={styles.logHeader}>
        <View style={styles.methodContainer}>
          <Text style={[styles.methodText, { backgroundColor: getStateColor(item.state) }]}>
            {item.method}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Ionicons name={getStateIcon(item.state)} size={16} color={getStateColor(item.state)} />
          {item.duration && (
            <Text style={styles.durationText}>
              {item.duration}ms
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">
        {item.url}
      </Text>
      <Text style={styles.timestampText}>
        {formatTime(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  // Rendre le contenu du log
  const renderLogDetail = () => {
    if (!selectedLog) return null;

    return (
      <Modal
        visible={!!selectedLog}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedLog(null)}
      >
        <SafeAreaView style={styles.detailModalContainer}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>
              <Text style={{ color: getStateColor(selectedLog.state) }}>
                {selectedLog.method}
              </Text>
              {' - '}
              {selectedLog.url}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedLog(null)}
            >
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.detailScrollView}>
            <View style={styles.detailInfoRow}>
              <Text style={styles.detailInfoLabel}>Statut:</Text>
              <Text style={[styles.detailInfoValue, { color: getStateColor(selectedLog.state) }]}>
                {selectedLog.state}
              </Text>
            </View>
            
            <View style={styles.detailInfoRow}>
              <Text style={styles.detailInfoLabel}>Heure:</Text>
              <Text style={styles.detailInfoValue}>{formatTime(selectedLog.timestamp)}</Text>
            </View>
            
            {selectedLog.duration && (
              <View style={styles.detailInfoRow}>
                <Text style={styles.detailInfoLabel}>Durée:</Text>
                <Text style={styles.detailInfoValue}>{selectedLog.duration}ms</Text>
              </View>
            )}
            
            {selectedLog.requestData && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Requête</Text>
                <View style={styles.jsonContainer}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(selectedLog.requestData, null, 2)}
                  </Text>
                </View>
              </View>
            )}
            
            {selectedLog.responseData && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Réponse</Text>
                <View style={styles.jsonContainer}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(selectedLog.responseData, null, 2)}
                  </Text>
                </View>
              </View>
            )}
            
            {selectedLog.error && (
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Erreur</Text>
                <View style={styles.jsonContainer}>
                  <Text style={styles.jsonText}>
                    {JSON.stringify(selectedLog.error, null, 2)}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  // Composant principal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Débogueur Réseau</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color={Colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Filtrer les requêtes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllLogs}
          >
            <Text style={styles.clearButtonText}>Effacer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.request ? styles.filterButtonActive : null,
              { borderColor: Colors.primary }
            ]}
            onPress={() => setActiveFilters(prev => ({ ...prev, request: !prev.request }))}
          >
            <Ionicons
              name="arrow-up-circle"
              size={16}
              color={activeFilters.request ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterButtonText,
                { color: activeFilters.request ? Colors.primary : Colors.textSecondary }
              ]}
            >
              Requêtes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.response ? styles.filterButtonActive : null,
              { borderColor: Colors.success }
            ]}
            onPress={() => setActiveFilters(prev => ({ ...prev, response: !prev.response }))}
          >
            <Ionicons
              name="arrow-down-circle"
              size={16}
              color={activeFilters.response ? Colors.success : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterButtonText,
                { color: activeFilters.response ? Colors.success : Colors.textSecondary }
              ]}
            >
              Réponses
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilters.error ? styles.filterButtonActive : null,
              { borderColor: Colors.error }
            ]}
            onPress={() => setActiveFilters(prev => ({ ...prev, error: !prev.error }))}
          >
            <Ionicons
              name="warning"
              size={16}
              color={activeFilters.error ? Colors.error : Colors.textSecondary}
            />
            <Text
              style={[
                styles.filterButtonText,
                { color: activeFilters.error ? Colors.error : Colors.textSecondary }
              ]}
            >
              Erreurs
            </Text>
          </TouchableOpacity>
        </View>
        
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-offline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>
              Aucune requête réseau trouvée
            </Text>
            <Text style={styles.emptySubText}>
              Les requêtes apparaîtront ici lorsque votre application communiquera avec le serveur
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredLogs}
            keyExtractor={item => item.id}
            renderItem={renderLogItem}
            style={styles.logList}
            contentContainerStyle={styles.logListContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={styles.listFooter} />}
          />
        )}
        
        {renderLogDetail()}
      </SafeAreaView>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  clearSearchButton: {
    padding: 4,
  },
  clearButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.cardBackground,
  },
  filterButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  logList: {
    flex: 1,
  },
  logListContent: {
    paddingHorizontal: 16,
  },
  logItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  methodContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  methodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  urlText: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  listFooter: {
    height: 20,
  },
  detailModalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  detailScrollView: {
    flex: 1,
    padding: 16,
  },
  detailInfoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailInfoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 70,
  },
  detailInfoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: '500',
  },
  detailSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  jsonContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jsonText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: Colors.textPrimary,
  },
});

export default NetworkDebugger; 