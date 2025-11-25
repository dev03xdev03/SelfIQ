import * as Application from 'expo-application';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEVICE_ID_KEY = '@dreamz_device_id';

/**
 * Holt oder erstellt eine eindeutige Device ID
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    // Prüfe ob bereits eine Device ID gespeichert ist
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);

    if (deviceId) {
      return deviceId;
    }

    // Erstelle neue Device ID basierend auf Platform
    if (Platform.OS === 'ios') {
      // iOS: Verwende IFV (Identifier for Vendor)
      deviceId = await Application.getIosIdForVendorAsync();
    } else if (Platform.OS === 'android') {
      // Android: Verwende Installation ID
      deviceId = Application.getAndroidId();
    } else {
      // Fallback: Generiere UUID
      deviceId = generateUUID();
    }

    // Speichere Device ID
    if (deviceId) {
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId || generateUUID();
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback UUID
    return generateUUID();
  }
};

/**
 * Generiert eine einfache UUID (Fallback)
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Reset Device ID (nur für Testing)
 */
export const resetDeviceId = async (): Promise<void> => {
  await AsyncStorage.removeItem(DEVICE_ID_KEY);
};
