import { supabase } from '../bibliothek/supabase';
import { getDeviceId } from '../hilfsmittel/geraeteId';

export interface AuthUser {
  id: string;
  username: string;
  display_name?: string;
  detected_gender?: 'm' | 'w' | 'd';
  device_id?: string;
  is_guest?: boolean;
  created_at?: string;
}

/**
 * Registriere einen neuen User - mit Device ID Support
 */
export const signUp = async (
  email: string,
  password: string,
  username: string,
  detectedGender?: 'm' | 'w' | 'd',
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
          detected_gender: detectedGender || 'd',
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
    let { data: userData, error: userError } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // Falls Trigger fehlgeschlagen: Erstelle User-Profil manuell
    if (userError && userError.code === 'PGRST116') {
      console.log('Trigger failed, creating user profile manually');

      const { data: newUser, error: insertError } = await (supabase as any)
        .from('users')
        .insert({
          id: authData.user.id,
          username,
          display_name: username,
          detected_gender: detectedGender || 'd',
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
    const { error: settingsError } = await (supabase as any)
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
    const { data: userData, error: userError } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    // Update last_active
    await (supabase as any)
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
 * Guest Login (ohne Registrierung) - mit Device ID und 72h Limit
 */
export const signInAsGuest = async (
  username: string,
  detectedGender?: 'm' | 'w' | 'd',
): Promise<{
  user: AuthUser | null;
  error: Error | null;
  isExpired?: boolean;
  wrongName?: boolean;
  correctName?: string;
}> => {
  try {
    // Hole Device ID
    const deviceId = await getDeviceId();
    console.log('[authentifizierungDienst] Device ID:', deviceId);

    // Prüfe ob User mit dieser Device ID bereits existiert
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('device_id', deviceId)
      .eq('is_guest', true)
      .maybeSingle();

    if (existingUser) {
      console.log('[authentifizierungDienst] Existing guest user found');

      // Prüfe 72h Limit - STRIKT: Nach Ablauf KEIN Gast-Zugang mehr
      const createdAt = new Date(existingUser.created_at);
      const now = new Date();
      const hoursSinceCreation =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCreation > 72) {
        console.log(
          '[authentifizierungDienst] Guest account PERMANENTLY expired (>72h) - Apple Sign-In required',
        );
        // Gast-Account ist abgelaufen und kann NICHT mehr als Gast genutzt werden
        return {
          user: null,
          error: new Error(
            'Gast-Zeitraum abgelaufen. Bitte mit Apple anmelden.',
          ),
          isExpired: true,
        };
      }

      // WICHTIG: Prüfe ob der eingegebene Name mit dem gespeicherten übereinstimmt
      if (
        username &&
        username.trim().toLowerCase() !== existingUser.username.toLowerCase()
      ) {
        console.log(
          '[authentifizierungDienst] Wrong name entered - returning error',
        );
        return {
          user: null,
          error: null,
          wrongName: true,
          correctName: existingUser.username,
        };
      }

      // Name stimmt überein - Update nur last_active
      console.log(
        '[authentifizierungDienst] Correct name - updating last_active',
      );

      await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('id', existingUser.id);

      return { user: existingUser, error: null, isExpired: false };
    }

    console.log(
      '[authentifizierungDienst] No existing guest, creating new guest in DB',
    );

    // Erstelle neuen Gast-User in Datenbank
    const guestId = `guest_${deviceId}_${Date.now()}`;
    const { data: newGuestUser, error: insertError } = await supabase
      .from('users')
      .insert({
        id: guestId,
        username: username || 'Gast',
        display_name: username || 'Gast',
        detected_gender: detectedGender || 'd',
        device_id: deviceId,
        is_guest: true,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        '[authentifizierungDienst] Error creating guest in DB:',
        insertError,
      );
      // Fallback: Lokaler Gast ohne DB
      return {
        user: {
          id: guestId,
          username: username || 'Gast',
          display_name: username || 'Gast',
          detected_gender: detectedGender,
          device_id: deviceId,
        },
        error: null,
        isExpired: false,
      };
    }

    console.log(
      '[authentifizierungDienst] Guest user created in DB:',
      newGuestUser.id,
    );
    return { user: newGuestUser, error: null, isExpired: false };
  } catch (error) {
    console.error('[authentifizierungDienst] Error in signInAsGuest:', error);

    // Fallback: Lokaler Gast-Modus ohne DB
    const deviceId = await getDeviceId();
    return {
      user: {
        id: `guest_${deviceId}`,
        username: username || 'Gast',
        display_name: username || 'Gast',
        detected_gender: detectedGender,
        device_id: deviceId,
      },
      error: null,
      isExpired: false,
    };
  }
};

/**
 * Prüft ob ein Gast-Account abgelaufen ist (>72h)
 */
export const checkGuestExpiration = async (
  userId: string,
): Promise<boolean> => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('created_at, is_guest')
      .eq('id', userId)
      .single();

    if (!user || !user.is_guest) {
      return false;
    }

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const hoursSinceCreation =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return hoursSinceCreation > 72;
  } catch (error) {
    console.error(
      '[authentifizierungDienst] Error checking guest expiration:',
      error,
    );
    return false;
  }
};
