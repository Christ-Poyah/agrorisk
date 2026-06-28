import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: '#111E14' }} />;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
