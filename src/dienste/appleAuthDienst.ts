import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '../bibliothek/supabase';
import { getDeviceId } from '../hilfsmittel/geraeteId';
import { AuthUser } from './authentifizierungDienst';

export interface AppleAuthResult {
  user: AuthUser | null;
  error: Error | null;
  isNewUser: boolean;
}

/**
 * Prüft ob Apple Sign In auf dem Gerät verfügbar ist
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.error('Error checking Apple Auth availability:', error);
    return false;
  }
};

/**
 * Sign in mit Apple
 * Erstellt einen neuen User oder loggt einen existierenden ein
 */
export const signInWithApple = async (): Promise<AppleAuthResult> => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Apple ID Token für Supabase Auth verwenden
    const { data: authData, error: authError } =
      await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from Apple sign in');

    const deviceId = await getDeviceId();
    const userId = (authData.user as any).id || 'temp_user_id';

    // Prüfe ob User-Profil bereits existiert
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    let isNewUser = false;

    // Falls User noch nicht existiert, erstelle Profil
    if (userError || !userData) {
      isNewUser = true;

      // Versuche Namen aus Apple Credential zu extrahieren
      let displayName = '';
      if (credential.fullName) {
        const firstName = credential.fullName.givenName || '';
        const lastName = credential.fullName.familyName || '';
        displayName = `${firstName} ${lastName}`.trim();
      }

      // Erstelle User-Profil
      const { data: newUserData, error: insertError } = await (supabase as any)
        .from('users')
        .insert({
          id: userId,
          username: displayName || `user_${userId.slice(0, 8)}`,
          display_name: displayName || null,
          device_id: deviceId,
          detected_gender: 'n', // Standard, kann später angepasst werden
          is_premium: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;
      userData = newUserData;
    } else {
      // Update device_id falls User existiert
      await (supabase as any)
        .from('users')
        .update({ device_id: deviceId })
        .eq('id', userId);
    }

    if (!userData) {
      throw new Error('User data could not be loaded');
    }

    const userObj = userData as any;

    return {
      user: {
        id: userObj.id,
        username: userObj.username,
        display_name: userObj.display_name,
        detected_gender: userObj.detected_gender,
        device_id: userObj.device_id,
      },
      error: null,
      isNewUser,
    };
  } catch (error: any) {
    console.error('Apple Sign In Error Details:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });

    // Aussagekräftigere Fehlermeldung
    let errorMessage = 'Unbekannter Fehler';
    if (error?.code === 'ERR_CANCELED') {
      errorMessage = 'Apple Sign In wurde abgebrochen';
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      user: null,
      error: new Error(errorMessage),
      isNewUser: false,
    };
  }
};

/**
 * Update User-Name nach Apple Login (falls User seinen Namen ändern möchte)
 */
export const updateUserName = async (
  userId: string,
  newName: string,
  detectedGender?: 'm' | 'w' | 'n',
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await (supabase as any)
      .from('users')
      .update({
        username: newName,
        display_name: newName,
        detected_gender: detectedGender || 'n',
      })
      .eq('id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Error updating user name:', error);
    return { error };
  }
};
