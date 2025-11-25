import { supabase } from '../lib/supabase';
import { getDeviceId } from '../utils/deviceId';

export interface AuthUser {
  id: string;
  username: string;
  display_name?: string;
  detected_gender?: 'm' | 'w' | 'n';
  device_id?: string;
}

/**
 * Registriere einen neuen User - mit Device ID Support
 */
export const signUp = async (
  email: string,
  password: string,
  username: string,
  detectedGender?: 'm' | 'w' | 'n',
  deviceId?: string,
): Promise<{ user: AuthUser | null; error: Error | null }> => {
  try {
    // Registriere User in Supabase Auth mit Metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          detected_gender: detectedGender || 'n',
          device_id: deviceId || null,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from signup');

    // User-Profil wird automatisch durch Trigger erstellt
    // Warte kurz auf Trigger
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Versuche User-Profil zu laden
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // Falls Trigger fehlgeschlagen: Erstelle User-Profil manuell
    if (userError && userError.code === 'PGRST116') {
      console.log('Trigger failed, creating user profile manually');

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          display_name: username,
          detected_gender: detectedGender || 'n',
          device_id: deviceId || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // Fallback: Return basic user info
        return {
          user: {
            id: authData.user.id,
            username,
            display_name: username,
            detected_gender: detectedGender,
            device_id: deviceId,
          },
          error: null,
        };
      }

      userData = newUser;
    } else if (userError) {
      console.warn('Could not load user profile:', userError);
      return {
        user: {
          id: authData.user.id,
          username,
          display_name: username,
          detected_gender: detectedGender,
          device_id: deviceId,
        },
        error: null,
      };
    }

    // Erstelle Default Settings falls nicht vorhanden
    const { error: settingsError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: authData.user.id,
          sound_enabled: true,
          haptics_enabled: true,
          notifications_enabled: true,
        },
        {
          onConflict: 'user_id',
        },
      );

    return { user: userData, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { user: null, error: error as Error };
  }
};

/**
 * Login bestehender User
 */
export const signIn = async (
  email: string,
  password: string,
): Promise<{ user: AuthUser | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user returned from signin');

    // Lade User-Profil
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    // Update last_active
    await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', data.user.id);

    return { user: userData, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, error: error as Error };
  }
};

/**
 * Logout
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error as Error };
  }
};

/**
 * Aktuell eingeloggter User
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Guest Login (ohne Registrierung) - mit Device ID
 */
export const signInAsGuest = async (
  username: string,
  detectedGender?: 'm' | 'w' | 'n',
): Promise<{ user: AuthUser | null; error: Error | null }> => {
  try {
    // Hole Device ID
    const deviceId = await getDeviceId();
    console.log('Device ID:', deviceId);

    // Prüfe ob User mit dieser Device ID bereits existiert
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (existingUser) {
      console.log('User with this device already exists, logging in...');
      // User existiert bereits - hole die Session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Session ist bereits aktiv
        return { user: existingUser, error: null };
      }

      // Kein Session - versuche mit gespeichertem Refresh Token
      return { user: existingUser, error: null };
    }

    // Neuer User - erstelle Account
    const guestEmail = `guest_${deviceId}@dreamz.app`;
    const guestPassword = Math.random().toString(36).slice(-12);

    return await signUp(
      guestEmail,
      guestPassword,
      username,
      detectedGender,
      deviceId,
    );
  } catch (error) {
    console.error('Error signing in as guest:', error);
    return { user: null, error: error as Error };
  }
};
