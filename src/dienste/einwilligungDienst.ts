import { supabase } from '../bibliothek/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserConsents {
  background_activity_enabled: boolean;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  privacy_accepted: boolean;
  privacy_accepted_at?: string;
}

const CONSENT_STORAGE_KEY = '@selfiq_consents';

/**
 * Lade Zustimmungen aus der Datenbank
 */
export const getUserConsents = async (
  userId: string,
): Promise<UserConsents | null> => {
  try {
    // Für Gäste (guest_XXX) nur lokalen Cache nutzen
    if (userId.startsWith('guest_')) {
      console.log(
        '[einwilligungDienst] Guest user - reading consent from local storage only',
      );
      const cached = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      if (!cached) {
        // Standardwerte für Gäste
        return {
          background_activity_enabled: false,
          terms_accepted: false,
          privacy_accepted: false,
        };
      }
      return JSON.parse(cached);
    }

    const { data, error } = await (supabase as any)
      .from('user_settings')
      .select(
        'background_activity_enabled, terms_accepted, terms_accepted_at, privacy_accepted, privacy_accepted_at',
      )
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user consents:', error);
      return null;
    }

    // Cache lokal
    if (data) {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Exception in getUserConsents:', error);
    return null;
  }
};

/**
 * Aktualisiere Background-Activity-Berechtigung
 */
export const updateBackgroundActivityConsent = async (
  userId: string,
  enabled: boolean,
): Promise<boolean> => {
  try {
    // Für Gäste (guest_XXX) nur lokal speichern
    if (userId.startsWith('guest_')) {
      console.log(
        '[einwilligungDienst] Guest user - storing background consent locally only',
      );
      const cached = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
      const consents: UserConsents = cached
        ? JSON.parse(cached)
        : {
            background_activity_enabled: false,
            terms_accepted: false,
            privacy_accepted: false,
          };
      consents.background_activity_enabled = enabled;
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consents));
      return true;
    }

    const { error } = await (supabase as any)
      .from('user_settings')
      .update({ background_activity_enabled: enabled })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating background activity consent:', error);
      return false;
    }

    // Aktualisiere lokalen Cache
    const consents = await getUserConsents(userId);
    if (consents) {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consents));
    }

    return true;
  } catch (error) {
    console.error('Exception in updateBackgroundActivityConsent:', error);
    return false;
  }
};

/**
 * Akzeptiere AGB und Datenschutzbestimmungen
 */
export const acceptTermsAndPrivacy = async (
  userId: string,
): Promise<boolean> => {
  try {
    console.log(
      '[einwilligungDienst] acceptTermsAndPrivacy called with userId:',
      userId,
    );
    const now = new Date().toISOString();

    // Für Gäste (guest_XXX) nur lokal speichern
    if (userId.startsWith('guest_')) {
      console.log(
        '[einwilligungDienst] Guest user detected - storing consent locally only',
      );
      const guestConsents: UserConsents = {
        background_activity_enabled: false,
        terms_accepted: true,
        terms_accepted_at: now,
        privacy_accepted: true,
        privacy_accepted_at: now,
      };
      await AsyncStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify(guestConsents),
      );
      console.log(
        '[einwilligungDienst] Guest consent stored locally successfully',
      );
      return true;
    }

    console.log('[einwilligungDienst] Regular user - updating database');
    const { error } = await (supabase as any)
      .from('user_settings')
      .update({
        terms_accepted: true,
        terms_accepted_at: now,
        privacy_accepted: true,
        privacy_accepted_at: now,
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error accepting terms and privacy:', error);
      return false;
    }

    // Aktualisiere lokalen Cache
    const consents = await getUserConsents(userId);
    if (consents) {
      await AsyncStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consents));
    }

    return true;
  } catch (error) {
    console.error('Exception in acceptTermsAndPrivacy:', error);
    return false;
  }
};

/**
 * Prüfe ob User bereits zugestimmt hat (aus lokalem Cache)
 */
export const hasAcceptedTerms = async (): Promise<boolean> => {
  try {
    const cached = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
    if (!cached) return false;

    const consents: UserConsents = JSON.parse(cached);
    return consents.terms_accepted && consents.privacy_accepted;
  } catch (error) {
    console.error('Exception in hasAcceptedTerms:', error);
    return false;
  }
};

/**
 * Prüfe ob User Background-Activity erlaubt hat (aus lokalem Cache)
 */
export const hasBackgroundActivityConsent = async (): Promise<boolean> => {
  try {
    const cached = await AsyncStorage.getItem(CONSENT_STORAGE_KEY);
    if (!cached) return false;

    const consents: UserConsents = JSON.parse(cached);
    return consents.background_activity_enabled;
  } catch (error) {
    console.error('Exception in hasBackgroundActivityConsent:', error);
    return false;
  }
};
