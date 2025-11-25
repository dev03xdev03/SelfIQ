/**
 * Dreamz - Choice-Based Story App (Expo Version)
 * Ein interaktives Story-Erlebnis mit Lottie-Animationen
 */

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import * as Font from 'expo-font';
import AppNavigator from './src/navigation/AppNavigator';
import {
  autoLoginWithDevice,
  syncProgressFromCloud,
} from './src/services/deviceSyncService';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(true); // Starte sofort
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    async function initializeApp() {
      try {
        // Lade Fonts
        await Font.loadAsync({
          momstypewriter: require('./assets/fonts/momstypewriter.ttf'),
        });
        setFontsLoaded(true);

        // Auto-Login mit Device ID
        const { loggedIn, user } = await autoLoginWithDevice();

        if (loggedIn && user) {
          console.log('Auto-login successful, syncing progress...');
          // Sync Progress von Cloud (mit User-ID)
          await syncProgressFromCloud(user.id);
          setIsLoggedIn(true);
          setUserName(user.username || '');
        } else {
          setIsLoggedIn(false);
          setUserName('');
        }

        setAppReady(true);
      } catch (error) {
        console.warn('App initialization error:', error);
        setAppReady(true); // Auch bei Fehler weitermachen
      }
    }
    initializeApp();
  }, []);

  if (!appReady) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator isLoggedIn={isLoggedIn} userName={userName} />
    </>
  );
}
