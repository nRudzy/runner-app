import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking, Platform } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import Colors from '../src/core/config/Colors';

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      // Ouvrir le lien dans un navigateur intégré à l'application
      await openBrowserAsync(href);
    } else {
      // Sur le web, utiliser l'ouverture standard
      Linking.openURL(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={[styles.linkText, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
  },
  linkText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
