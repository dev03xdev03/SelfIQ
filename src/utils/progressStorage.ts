import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loadProgressFromSupabase,
  saveProgressToSupabase,
  loadAllProgressFromSupabase,
} from '../services/progressService';

export interface EpisodeProgress {
  episodeId: string;
  completedScenes: string[];
  lastPlayedDate: string;
  currentScene: string;
  progress: number; // 0-100
}

const PROGRESS_KEY = '@dreamz_progress';

/**
 * Lädt den Fortschritt für eine bestimmte Episode (Supabase + AsyncStorage Fallback)
 */
export const loadEpisodeProgress = async (
  episodeId: string,
): Promise<EpisodeProgress | null> => {
  try {
    // Versuche zuerst Supabase
    const supabaseProgress = await loadProgressFromSupabase(episodeId);
    if (supabaseProgress) return supabaseProgress;

    // Fallback zu AsyncStorage
    const allProgress = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return null;

    const progressData = JSON.parse(allProgress);
    return progressData[episodeId] || null;
  } catch (error) {
    console.error('Error loading episode progress:', error);
    return null;
  }
};

/**
 * Speichert den Fortschritt für eine Episode (Supabase + AsyncStorage)
 */
export const saveEpisodeProgress = async (
  progress: EpisodeProgress,
): Promise<void> => {
  try {
    // Speichere in Supabase
    await saveProgressToSupabase(progress);

    // Speichere auch lokal in AsyncStorage (Offline-Support)
    const allProgress = await AsyncStorage.getItem(PROGRESS_KEY);
    const progressData = allProgress ? JSON.parse(allProgress) : {};

    progressData[progress.episodeId] = progress;

    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving episode progress:', error);
  }
};

/**
 * Lädt alle Episode-Fortschritte (Supabase + AsyncStorage Fallback)
 */
export const loadAllProgress = async (): Promise<{
  [episodeId: string]: EpisodeProgress;
}> => {
  try {
    // Versuche zuerst Supabase
    const supabaseProgress = await loadAllProgressFromSupabase();
    if (Object.keys(supabaseProgress).length > 0) return supabaseProgress;

    // Fallback zu AsyncStorage
    const allProgress = await AsyncStorage.getItem(PROGRESS_KEY);
    return allProgress ? JSON.parse(allProgress) : {};
  } catch (error) {
    console.error('Error loading all progress:', error);
    return {};
  }
};

/**
 * Löscht den Fortschritt für eine Episode
 */
export const deleteEpisodeProgress = async (
  episodeId: string,
): Promise<void> => {
  try {
    const allProgress = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return;

    const progressData = JSON.parse(allProgress);
    delete progressData[episodeId];

    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error deleting episode progress:', error);
  }
};

/**
 * Berechnet den Fortschritt in Prozent basierend auf abgeschlossenen Phasen
 */
export const calculateProgress = (
  completedScenes: string[],
  totalScenes: number,
): number => {
  return Math.round((completedScenes.length / totalScenes) * 100);
};
