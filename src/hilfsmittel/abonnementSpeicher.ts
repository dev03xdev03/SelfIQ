import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasAccessToLockedContentSupabase } from '../dienste/abonnementDienst';

const SUBSCRIPTION_STATUS_KEY = '@selfiq_subscription_status';
const GUEST_MODE_KEY = '@selfiq_guest_mode';

export type SubscriptionStatus = 'active' | 'none';
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  hasAccessToLockedContent: boolean;
  planType: SubscriptionPlan;
  isGuest: boolean;
}

/**
 * Setzt Gast-Modus (kein Zugriff auf Ergebnisse)
 */
export async function setGuestMode(isGuest: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(GUEST_MODE_KEY, isGuest ? 'true' : 'false');
    console.log('[abonnementSpeicher] Guest mode set to:', isGuest);
  } catch (error) {
    console.error('[abonnementSpeicher] Failed to set guest mode:', error);
    throw error;
  }
}

/**
 * Prüft den aktuellen Subscription-Status
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
  try {
    const subscriptionStatus = await AsyncStorage.getItem(
      SUBSCRIPTION_STATUS_KEY,
    );
    const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
    const isGuest = guestMode === 'true';

    // Aktives Abo
    if (subscriptionStatus === 'active') {
      return {
        status: 'active',
        hasAccessToLockedContent: true,
        planType: 'monthly',
        isGuest: false,
      };
    }

    // Kein Abo (Free oder Gast)
    return {
      status: 'none',
      hasAccessToLockedContent: false,
      planType: 'free',
      isGuest,
    };
  } catch (error) {
    console.error(
      '[abonnementSpeicher] Failed to get subscription info:',
      error,
    );
    return {
      status: 'none',
      hasAccessToLockedContent: false,
      planType: 'free',
      isGuest: false,
    };
  }
}

/**
 * Aktiviert ein bezahltes Abo
 */
export async function activateSubscription(): Promise<void> {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
    console.log('[abonnementSpeicher] Subscription activated successfully');
  } catch (error) {
    console.error(
      '[abonnementSpeicher] Failed to activate subscription:',
      error,
    );
    throw error;
  }
}

/**
 * Prüft ob User ein Gast ist
 */
export async function isGuestMode(): Promise<boolean> {
  try {
    const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
    return guestMode === 'true';
  } catch (error) {
    console.error('[abonnementSpeicher] Failed to check guest mode:', error);
    return false;
  }
}

/**
 * Prüft, ob der User Zugriff auf gesperrte Inhalte hat (Supabase + AsyncStorage Fallback)
 */
export async function hasAccessToLockedContent(): Promise<boolean> {
  try {
    // Versuche zuerst Supabase
    const supabaseAccess = await hasAccessToLockedContentSupabase();
    if (supabaseAccess) return true;

    // Fallback zu lokalem AsyncStorage
    const info = await getSubscriptionInfo();
    return info.hasAccessToLockedContent;
  } catch (error) {
    console.error('[abonnementSpeicher] Failed to check access:', error);
    return false;
  }
}
