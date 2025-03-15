import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../core/config/Colors';
import AuthService from '../../data/datasources/AuthService';
import { useAuth } from '../../core/context/AuthContext';

interface RegisterScreenProps {
  navigation: any;
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  // State pour les champs du formulaire
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // State pour l'UI
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Accès au contexte d'authentification
  const { register: authRegister } = useAuth();

  // Validation des données du formulaire
  const validateForm = (): boolean => {
    // Vérifier que les champs requis sont remplis
    if (!fullName || !email || !username || !password || !confirmPassword) {
      Alert.alert('Champs incomplets', 'Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    // Vérifier le format de l'email (regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide.');
      return false;
    }

    // Vérifier que les mots de passe correspondent
    if (password !== confirmPassword) {
      Alert.alert('Mots de passe différents', 'Les mots de passe ne correspondent pas.');
      return false;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 8) {
      Alert.alert('Mot de passe trop court', 'Le mot de passe doit contenir au moins 8 caractères.');
      return false;
    }

    // Vérifier le format du nom d'utilisateur (pas d'espaces, caractères spéciaux limités)
    const usernameRegex = /^[a-zA-Z0-9._-]{3,16}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert(
        'Nom d\'utilisateur invalide',
        'Le nom d\'utilisateur doit contenir entre 3 et 16 caractères et ne peut contenir que des lettres, des chiffres, des points, des tirets et des underscores.'
      );
      return false;
    }

    return true;
  };

  // Gestion de l'inscription
  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await authRegister({
        email,
        password,
        username,
        fullName,
        phoneNumber: phoneNumber || undefined,
      });
      
      // La redirection sera gérée par le contexte d'authentification
    } catch (error: any) {
      let errorMessage = 'Une erreur est survenue lors de l\'inscription.';
      
      // Gestion des erreurs spécifiques de l'API
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        
        if (message) {
          errorMessage = message;
        } else if (errors) {
          // Récupérer la première erreur si plusieurs sont présentes
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
        }
      }
      
      Alert.alert('Erreur d\'inscription', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.darkGray} />
          </TouchableOpacity>
          <Text style={styles.title}>Créer un compte</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          {/* Nom complet */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor={Colors.darkGray}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.darkGray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Nom d'utilisateur */}
          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor={Colors.darkGray}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Numéro de téléphone (optionnel) */}
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone (optionnel)"
              placeholderTextColor={Colors.darkGray}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>

          {/* Mot de passe */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              placeholderTextColor={Colors.darkGray}
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityIcon} 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color={Colors.darkGray} 
              />
            </TouchableOpacity>
          </View>

          {/* Confirmation de mot de passe */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={Colors.darkGray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={Colors.darkGray}
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityIcon} 
              onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            >
              <Ionicons 
                name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={22} 
                color={Colors.darkGray} 
              />
            </TouchableOpacity>
          </View>

          {/* Bouton d'inscription */}
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.registerButtonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          {/* Conditions d'utilisation et politique de confidentialité */}
          <Text style={styles.termsText}>
            En vous inscrivant, vous acceptez nos{' '}
            <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>.
          </Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 34, // Même taille que le bouton retour pour équilibrer
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
  },
  formContainer: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.black,
    fontSize: 16,
  },
  visibilityIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
    marginBottom: 30,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: Colors.darkGray,
    fontSize: 16,
    marginRight: 5,
  },
  loginLink: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 