import { supabase } from '../lib/supabase';

/**
 * Tracked ein Analytics Event
 */
export const trackEvent = async (
  eventType: string,
  eventData?: Record<string, any>,
  storyId?: string,
  sceneId?: string,
  sessionId?: string,
): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from('analytics_events').insert({
      user_id: user?.id || null,
      event_type: eventType,
      event_data: eventData,
      story_id: storyId,
      scene_id: sceneId,
      session_id: sessionId,
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Tracked Story Start
 */
export const trackStoryStart = async (
  storyId: string,
  sessionId: string,
): Promise<void> => {
  await trackEvent(
    'story_start',
    { story_id: storyId },
    storyId,
    undefined,
    sessionId,
  );
};

/**
 * Tracked Story Completion
 */
export const trackStoryComplete = async (
  storyId: string,
  sessionId: string,
  totalChoices: number,
): Promise<void> => {
  await trackEvent(
    'story_complete',
    { story_id: storyId, total_choices: totalChoices },
    storyId,
    undefined,
    sessionId,
  );
};

/**
 * Tracked Scene View
 */
export const trackSceneView = async (
  storyId: string,
  sceneId: string,
  sessionId: string,
): Promise<void> => {
  await trackEvent(
    'scene_view',
    { scene_id: sceneId },
    storyId,
    sceneId,
    sessionId,
  );
};

/**
 * Tracked Choice Made
 */
export const trackChoiceMade = async (
  storyId: string,
  sceneId: string,
  choiceId: string,
  sessionId: string,
): Promise<void> => {
  await trackEvent(
    'choice_made',
    { choice_id: choiceId },
    storyId,
    sceneId,
    sessionId,
  );
};

/**
 * Tracked App Open
 */
export const trackAppOpen = async (): Promise<void> => {
  await trackEvent('app_open', { timestamp: new Date().toISOString() });
};

/**
 * Tracked App Close
 */
export const trackAppClose = async (
  sessionDurationSeconds: number,
): Promise<void> => {
  await trackEvent('app_close', { session_duration: sessionDurationSeconds });
};
