import { Image, StyleSheet, Platform } from 'react-native';

import SwipeScreen from '@/components/SwipeScreen';
import ChatScreen from '@/components/ChatScreen';

export default function HomeScreen() {
  return (
    <SwipeScreen onMatch={() => {console.log('match')}} />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
