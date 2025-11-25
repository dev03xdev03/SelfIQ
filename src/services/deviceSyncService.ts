import { supabase } from '../lib/supabase';
import { getDeviceId } from '../utils/deviceId';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Device Sync Service
 * Ermöglicht Progress-Übertragung zwischen Geräten via Device ID
 */

interface DeviceInfo {
  device_id: string;
  last_active: string;
  username: string;
}

/**
 * Prüft ob es einen bestehenden Account mit dieser Device ID gibt
 */
export const checkExistingDevice = async (): Promise<{
  exists: boolean;
  user?: any;
  error?: Error;
}> => {
  try {
    const deviceId = await getDeviceId();

    // Suche nach User mit dieser Device ID
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (userData) {
      console.log('Existing device found:', userData.username);
      return { exists: true, user: userData };
    }

    return { exists: false };
  } catch (error) {
    console.error('Error checking existing device:', error);
    return { exists: false, error: error as Error };
  }
};

/**
 * Verknüpft aktuelles Gerät mit bestehendem Account (via Username)
 * Nutzer kann seinen Username eingeben um Progress zu übertragen
 */
export const linkDeviceToAccount = async (
  username: string,
): Promise<{ success: boolean; error?: Error }> => {
  try {
    const deviceId = await getDeviceId();

    // Suche User mit diesem Username
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (userError) {
      throw new Error('Username nicht gefunden');
    }

    if (!existingUser) {
      throw new Error('Kein Account mit diesem Username gefunden');
    }

    // Prüfe ob Device ID bereits verwendet wird
    const { data: deviceCheck } = await supabase
      .from('users')
      .select('id')
      .eq('device_id', deviceId)
      .single();

    if (deviceCheck && deviceCheck.id !== existingUser.id) {
      throw new Error(
        'Dieses Gerät ist bereits mit einem anderen Account verknüpft',
      );
    }

    // Verknüpfe Device ID mit bestehendem Account
    const { error: updateError } = await supabase
      .from('users')
      .update({ device_id: deviceId })
      .eq('id', existingUser.id);

    if (updateError) throw updateError;

    // Speichere User ID lokal für Auto-Login
    await AsyncStorage.setItem('@dreamz_user_id', existingUser.id);

    console.log('Device successfully linked to account:', username);
    return { success: true };
  } catch (error) {
    console.error('Error linking device:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Lädt alle Geräte die mit diesem Account verknüpft sind
 * (Für zukünftiges Multi-Device-Feature)
 */
export const getLinkedDevices = async (): Promise<{
  devices: DeviceInfo[];
  error?: Error;
}> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Hole alle Users mit gleicher ID (future: support für multiple devices)
    const { data: userData, error } = await supabase
      .from('users')
      .select('device_id, last_active, username')
      .eq('id', user.id);

    if (error) throw error;

    const devices: DeviceInfo[] =
      userData?.map((u) => ({
        device_id: u.device_id,
        last_active: u.last_active,
        username: u.username,
      })) || [];

    return { devices };
  } catch (error) {
    console.error('Error getting linked devices:', error);
    return { devices: [], error: error as Error };
  }
};

/**
 * Synchronisiert Progress von Server auf lokales Gerät
 * Wird beim ersten App-Start auf neuem Gerät aufgerufen
 */
export const syncProgressFromCloud = async (
  userId?: string,
): Promise<{
  success: boolean;
  syncedStories: number;
  error?: Error;
}> => {
  try {
    let userIdToUse = userId;

    // Falls keine User-ID übergeben wurde, versuche aus Session zu holen
    if (!userIdToUse) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user session - skipping cloud sync');
        return { success: true, syncedStories: 0 };
      }
      userIdToUse = user.id;
    }

    // Lade alle Story-Progress-Einträge
    const { data: progressData, error: progressError } = await supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', userIdToUse);

    if (progressError) throw progressError;

    if (!progressData || progressData.length === 0) {
      return { success: true, syncedStories: 0 };
    }

    // Speichere Progress lokal in AsyncStorage
    for (const progress of progressData) {
      const key = `@episode_progress_${progress.story_id}`;
      const value = JSON.stringify({
        currentScene: progress.current_scene,
        completedScenes: progress.completed_scenes || [],
        lastPlayedDate: progress.last_played_date,
        progressPercentage: progress.progress_percentage,
      });
      await AsyncStorage.setItem(key, value);
    }

    console.log(`Synced ${progressData.length} stories from cloud`);
    return { success: true, syncedStories: progressData.length };
  } catch (error) {
    console.error('Error syncing progress from cloud:', error);
    return { success: false, syncedStories: 0, error: error as Error };
  }
};

/**
 * Auto-Login basierend auf Device ID
 * Wird beim App-Start aufgerufen
 */
export const autoLoginWithDevice = async (): Promise<{
  loggedIn: boolean;
  user?: any;
  error?: Error;
}> => {
  try {
    const deviceId = await getDeviceId();

    // Suche User mit dieser Device ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    if (!userData) {
      // Kein User gefunden - neue Installation
      console.log('Auto-login: No user found for this device');
      return { loggedIn: false };
    }

    // User mit dieser Device ID gefunden!
    // Das bedeutet: User war bereits registriert
    console.log('Auto-login: User found -', userData.username);

    // Speichere Username lokal für CategoryScreen
    await AsyncStorage.setItem('@dreamz_username', userData.username);

    return { loggedIn: true, user: userData };
  } catch (error) {
    console.error('Error during auto-login:', error);
    return { loggedIn: false, error: error as Error };
  }
};
