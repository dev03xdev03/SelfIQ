import { supabase } from '../bibliothek/supabase';

/**
 * Prüft ob User Zugriff auf locked Content hat
 */
export const hasAccessToLockedContentSupabase = async (): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // Prüfe aktive Subscription
    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .single();

    return !!subscription;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};

/**
 * Prüft ob User Zugriff auf spezifische Story hat
 */
export const hasAccessToStory = async (storyId: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // 1. Prüfe ob Story unlocked ist
    const { data: story } = await (supabase as any)
      .from('stories')
      .select('is_locked')
      .eq('story_id', storyId)
      .single();

    if (!story?.is_locked) return true;

    // 2. Prüfe aktive Subscription
    const hasSubscription = await hasAccessToLockedContentSupabase();
    if (hasSubscription) return true;

    // 3. Prüfe einzelnen Purchase
    const { data: purchase } = await (supabase as any)
      .from('purchases')
      .select('*')
      .eq('user_id', user.id)
      .eq('story_id', storyId)
      .eq('status', 'completed')
      .single();

    return !!purchase;
  } catch (error) {
    console.error('Error checking story access:', error);
    return false;
  }
};

/**
 * Erstellt eine Subscription (nach erfolgreichem Payment)
 */
export const createSubscription = async (
  subscriptionType: 'leseratten_abo' | 'premium',
  pricePaid: number,
  expiresAt: Date,
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await (supabase as any).from('subscriptions').insert({
      user_id: user.id,
      subscription_type: subscriptionType,
      status: 'active',
      price_paid: pricePaid,
      expires_at: expiresAt.toISOString(),
    });

    return !error;
  } catch (error) {
    console.error('Error creating subscription:', error);
    return false;
  }
};

/**
 * Erstellt einen Purchase (nach erfolgreichem Payment)
 */
export const createPurchase = async (
  storyId: string,
  pricePaid: number,
  paymentProvider: string,
  transactionId: string,
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await (supabase as any).from('purchases').insert({
      user_id: user.id,
      story_id: storyId,
      purchase_type: 'single_story',
      price_paid: pricePaid,
      payment_provider: paymentProvider,
      external_transaction_id: transactionId,
      status: 'completed',
    });

    return !error;
  } catch (error) {
    console.error('Error creating purchase:', error);
    return false;
  }
};

/**
 * Lädt alle Stories mit Locked-Status
 */
export const loadAllStories = async () => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading stories:', error);
    return [];
  }
};
