import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserConsents {
  background_activity_enabled: boolean;
  terms_accepted: boolean;
  terms_accepted_at?: string;
  privacy_accepted: boolean;
  privacy_accepted_at?: string;
}

const CONSENT_STORAGE_KEY = '@dreamz_consents';

/**
 * Lade Zustimmungen aus der Datenbank
 */
export const getUserConsents = async (
  userId: string,
): Promise<UserConsents | null> => {
  try {
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    const now = new Date().toISOString();

    const { error } = await supabase
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
