import { supabase } from '../lib/supabase';
import { EpisodeProgress } from '../utils/progressStorage';

/**
 * Lädt Story-Fortschritt für aktuellen User
 */
export const loadProgressFromSupabase = async (
  storyId: string,
): Promise<EpisodeProgress | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('story_id', storyId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    if (!data) return null;

    return {
      episodeId: data.story_id,
      currentScene: data.current_scene,
      completedScenes: data.completed_scenes || [],
      progress: data.progress_percentage,
      lastPlayedDate: data.last_played_date,
    };
  } catch (error) {
    console.error('Error loading progress from Supabase:', error);
    return null;
  }
};

/**
 * Speichert Story-Fortschritt in Supabase
 */
export const saveProgressToSupabase = async (
  progress: EpisodeProgress,
): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('story_progress').upsert(
      {
        user_id: user.id,
        story_id: progress.episodeId,
        current_scene: progress.currentScene,
        completed_scenes: progress.completedScenes,
        progress_percentage: progress.progress,
        last_played_date: progress.lastPlayedDate,
      },
      {
        onConflict: 'user_id,story_id',
      },
    );

    if (error) throw error;
  } catch (error) {
    console.error('Error saving progress to Supabase:', error);
  }
};

/**
 * Lädt alle Story-Fortschritte für aktuellen User
 */
export const loadAllProgressFromSupabase = async (): Promise<{
  [episodeId: string]: EpisodeProgress;
}> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('story_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const progressMap: { [episodeId: string]: EpisodeProgress } = {};
    data?.forEach((item) => {
      progressMap[item.story_id] = {
        episodeId: item.story_id,
        currentScene: item.current_scene,
        completedScenes: item.completed_scenes || [],
        progress: item.progress_percentage,
        lastPlayedDate: item.last_played_date,
      };
    });

    return progressMap;
  } catch (error) {
    console.error('Error loading all progress from Supabase:', error);
    return {};
  }
};

/**
 * Speichert User-Choice in Supabase
 */
export const saveChoiceToSupabase = async (
  storyId: string,
  sceneId: string,
  choiceId: string,
  choiceText: string,
  sessionId?: string,
): Promise<void> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_choices').insert({
      user_id: user.id,
      story_id: storyId,
      scene_id: sceneId,
      choice_id: choiceId,
      choice_text: choiceText,
      session_id: sessionId,
    });
  } catch (error) {
    console.error('Error saving choice to Supabase:', error);
  }
};
