import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasAccessToLockedContentSupabase } from '../services/subscriptionService';

const TRIAL_START_KEY = '@dreamz_trial_start';
const SUBSCRIPTION_STATUS_KEY = '@dreamz_subscription_status';

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'none';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  daysRemaining: number;
  isTrialActive: boolean;
  hasAccessToLockedContent: boolean;
}

/**
 * Startet die 3-tägige Testphase
 */
export async function startTrial(): Promise<void> {
  const now = new Date().toISOString();
  try {
    await AsyncStorage.setItem(TRIAL_START_KEY, now);
    await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'trial');
  } catch (error) {
    console.error('Fehler beim Starten der Testphase:', error);
  }
}

/**
 * Prüft den aktuellen Subscription-Status
 */
export async function getSubscriptionInfo(): Promise<SubscriptionInfo> {
  try {
    const trialStartStr = await AsyncStorage.getItem(TRIAL_START_KEY);
    const subscriptionStatus = await AsyncStorage.getItem(
      SUBSCRIPTION_STATUS_KEY,
    );

    // Kein Trial gestartet
    if (!trialStartStr) {
      return {
        status: 'none',
        trialStartDate: null,
        trialEndDate: null,
        daysRemaining: 3,
        isTrialActive: false,
        hasAccessToLockedContent: false,
      };
    }

    const trialStart = new Date(trialStartStr);
    const now = new Date();
    const trialEnd = new Date(trialStart);
    trialEnd.setDate(trialEnd.getDate() + 3); // 3 Tage Testphase

    const timeDiff = trialEnd.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Testphase noch aktiv
    if (now < trialEnd) {
      return {
        status: 'trial',
        trialStartDate: trialStartStr,
        trialEndDate: trialEnd.toISOString(),
        daysRemaining: Math.max(0, daysRemaining),
        isTrialActive: true,
        hasAccessToLockedContent: true,
      };
    }

    // Testphase abgelaufen, aber aktives Abo
    if (subscriptionStatus === 'active') {
      return {
        status: 'active',
        trialStartDate: trialStartStr,
        trialEndDate: trialEnd.toISOString(),
        daysRemaining: 0,
        isTrialActive: false,
        hasAccessToLockedContent: true,
      };
    }

    // Testphase abgelaufen, kein Abo
    return {
      status: 'expired',
      trialStartDate: trialStartStr,
      trialEndDate: trialEnd.toISOString(),
      daysRemaining: 0,
      isTrialActive: false,
      hasAccessToLockedContent: false,
    };
  } catch (error) {
    console.error('Fehler beim Abrufen der Subscription-Info:', error);
    return {
      status: 'none',
      trialStartDate: null,
      trialEndDate: null,
      daysRemaining: 3,
      isTrialActive: false,
      hasAccessToLockedContent: false,
    };
  }
}

/**
 * Aktiviert ein bezahltes Abo
 */
export async function activateSubscription(): Promise<void> {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
  } catch (error) {
    console.error('Fehler beim Aktivieren des Abos:', error);
  }
}

/**
 * Setzt die Testphase zurück (nur für Entwicklung/Testing)
 */
export async function resetTrial(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TRIAL_START_KEY);
    await AsyncStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
  } catch (error) {
    console.error('Fehler beim Zurücksetzen der Testphase:', error);
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
    console.error('Error checking access:', error);
    return false;
  }
}
