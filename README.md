# Runner App - Fonctionnalité de Trajets en Groupe

Cette fonctionnalité permet aux utilisateurs de l'application Runner de créer, rejoindre et gérer des trajets en groupe avec d'autres passionnés de voitures.

## Fonctionnalités principales

### 1. Liste des trajets en groupe
- Affichage des trajets à venir et passés
- Informations détaillées sur chaque trajet (date, lieu, participants, etc.)
- Indication visuelle des trajets auxquels l'utilisateur est inscrit

### 2. Création de trajets en groupe
- Formulaire de création avec validation
- Définition du titre, description, date, lieu et nombre maximum de participants
- L'utilisateur devient automatiquement l'organisateur du trajet

### 3. Détails d'un trajet
- Affichage complet des informations du trajet
- Liste des participants avec leurs avatars
- Actions contextuelles selon le statut de l'utilisateur (rejoindre, quitter, annuler)
- Partage du trajet avec d'autres utilisateurs

### 4. Gestion des participants
- Rejoindre un trajet existant
- Quitter un trajet auquel on est inscrit
- Limitation du nombre de participants selon la valeur définie par l'organisateur

## Structure technique

### Modèles de données
- `GroupRide`: Représente un trajet en groupe avec ses propriétés
- Intégration avec les modèles `User` existants

### Écrans
- `GroupRideScreen`: Liste des trajets en groupe
- `CreateGroupRideScreen`: Création d'un nouveau trajet
- `GroupRideDetailsScreen`: Détails d'un trajet spécifique

### Services
- Méthodes API pour récupérer, créer et gérer les trajets
- Implémentation mock pour les tests et le développement

## Utilisation

1. Accéder à l'écran des trajets en groupe depuis la navigation principale
2. Consulter les trajets disponibles ou créer un nouveau trajet
3. Rejoindre un trajet existant ou gérer ses participations
4. Voir les détails complets d'un trajet et les participants

## Prochaines améliorations

- Ajout de notifications pour les mises à jour de trajets
- Intégration de cartes pour visualiser le lieu de rendez-vous
- Système de commentaires pour les participants
- Galerie de photos pour partager des images du trajet

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
