# Runner

Une application mobile innovante permettant aux utilisateurs de découvrir et matcher avec des véhicules selon leurs préférences, à la manière de Tinder.

## Fonctionnalités

### Interface Utilisateur
- **Swipe de véhicules** : Interface intuitive de swipe permettant de parcourir les véhicules disponibles
- **Filtres avancés** : Filtrage multicritères par marque, modèle, prix, année, kilométrage, etc.
- **Profils détaillés** : Fiches véhicules complètes avec photos, spécifications et description
- **Système de matching** : Mise en relation entre acheteurs et vendeurs suite aux likes mutuels
- **Messagerie intégrée** : Communication directe entre les utilisateurs après un match
- **Profil utilisateur** : Gestion des informations personnelles et préférences

### Technique
- **Architecture MVVM** : Séparation claire des responsabilités pour une meilleure maintenabilité
- **TypeScript** : Typage fort pour réduire les erreurs et améliorer le développement
- **React Native** : Développement cross-platform pour iOS et Android
- **Animations fluides** : Transitions et animations pour une expérience utilisateur agréable
- **Gestion d'API** : Communication complète avec le backend et gestion de l'authentification
- **Gestion hors ligne** : Fonctionnalités de base disponibles même sans connexion internet
- **Débogueur réseau** : Outil intégré pour visualiser et analyser les requêtes API en développement

## Nouveautés

### Intégration API
- **Client API centralisé** : Communication avec le serveur via un client axios configuré
- **Intercepteurs de requêtes** : Gestion automatique des tokens d'authentification
- **Gestion des erreurs** : Traitement unifié des erreurs API avec refresh de token
- **Repositories spécialisés** : Couche d'accès aux données pour chaque entité (véhicules, utilisateurs, matchs)

### Écrans supplémentaires
- **Écran d'inscription** : Formulaire complet avec validation
- **Liste des matchs** : Visualisation de tous les matchs avec recherche et filtres
- **Chat privé** : Messagerie en temps réel entre les utilisateurs matchés
- **Écran de détails** : Visualisation complète des informations d'un véhicule

### Débogage
- **NetworkLogger** : Intercepteur pour visualiser les requêtes, réponses et erreurs
- **Interface de débogueur** : Visualisation des logs réseau avec filtres et recherche
- **Activation par geste** : Triple tap dans un coin de l'écran pour afficher le débogueur
- **Protection des données sensibles** : Masquage automatique des informations confidentielles

## Installation

```bash
cd runner-app

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

### Dépendances principales

- react-native
- @react-navigation/native
- axios
- @react-native-async-storage/async-storage
- typescript
- react-native-gesture-handler
- @expo/vector-icons

## Structure du projet

```
src/
├── core/               # Couche cœur de l'application
│   ├── api/            # Services d'API et client HTTP
│   ├── config/         # Configuration globale
│   ├── context/        # Contextes React (auth, thème, etc.)
│   └── utils/          # Utilitaires et helpers
├── domain/             # Couche domaine métier
│   ├── entities/       # Modèles de données
│   ├── repositories/   # Interface d'accès aux données
│   └── usecases/       # Logique métier réutilisable
├── presentation/       # Couche présentation UI
│   ├── components/     # Composants réutilisables
│   ├── hooks/          # Hooks personnalisés
│   └── screens/        # Écrans de l'application
└── types/              # Types et interfaces globaux
```

## Architecture

L'application suit une architecture en couches inspirée de Clean Architecture :

1. **Présentation** : Composants d'UI et logique de présentation
2. **Domaine** : Logique métier et modèles de données
3. **Data** : Communication avec l'API et stockage local

Cette séparation permet une meilleure testabilité et une évolution plus facile de chaque partie.

## Mode développeur

Pour activer le débogueur réseau :
1. Assurez-vous d'être en mode développement
2. Effectuez un triple tap dans le coin supérieur droit de l'écran
3. Le panneau de débogage s'ouvrira avec les requêtes et réponses

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE.md pour plus de détails.

## Contact

Équipe de développement - email@example.com