import { supabase } from '../bibliothek/supabase';
import { SupabaseTest, SupabaseTestResult } from '../typen/database.typen';
import { TestErgebnis, TestFortschritt } from '../typen/test.typen';

/**
 * Lädt alle verfügbaren Tests aus der Datenbank
 */
export const getAllTests = async (): Promise<SupabaseTest[]> => {
  try {
    const { data, error } = (await supabase
      .from('tests')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })) as any;

    if (error) {
      console.error('[testDienst] Error loading tests:', error.message);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('[testDienst] Failed to load tests:', error);
    return [];
  }
};

/**
 * Lädt Tests nach Kategorie
 */
export const getTestsByCategory = async (
  categoryId: string,
): Promise<SupabaseTest[]> => {
  try {
    const { data, error } = (await supabase
      .from('tests')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })) as any;

    if (error) {
      console.error(
        '[testDienst] Error loading tests by category:',
        error.message,
      );
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error(
      `[testDienst] Failed to load tests for category ${categoryId}:`,
      error,
    );
    return [];
  }
};

/**
 * Prüft ob User Zugriff auf einen Test hat
 */
export const checkTestAccess = async (testId: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.warn('[testDienst] No authenticated user for test access check');
      return false;
    }

    // Nutze die Supabase Function
    const { data, error } = await (supabase as any).rpc('has_test_access', {
      p_user_id: user.id,
      p_test_id: testId,
    });

    if (error) {
      console.error('[testDienst] Error checking test access:', error.message);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error(
      `[testDienst] Failed to check access for test ${testId}:`,
      error,
    );
    return false;
  }
};

/**
 * Speichert Test-Fortschritt
 */
export const saveTestProgress = async (
  progress: TestFortschritt,
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('test_progress').upsert(
      {
        user_id: user.id,
        test_id: progress.testId,
        current_question_index: progress.aktuelleFrage
          ? parseInt(progress.aktuelleFrage.replace('q', '')) - 1
          : 0,
        completed_questions: progress.abgeschlosseneFragen,
        progress_percentage: progress.fortschritt,
        last_updated: new Date().toISOString(),
      } as any,
      {
        onConflict: 'user_id,test_id',
      } as any,
    );

    return !error;
  } catch (error) {
    console.error('Error saving test progress:', error);
    return false;
  }
};

/**
 * Lädt Test-Fortschritt
 */
export const loadTestProgress = async (
  testId: string,
): Promise<TestFortschritt | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = (await supabase
      .from('test_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .single()) as any;

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      testId: data.test_id,
      abgeschlosseneFragen: data.completed_questions || [],
      letztesSpielDatum: data.last_updated,
      aktuelleFrage: `q${data.current_question_index + 1}`,
      fortschritt: data.progress_percentage,
    };
  } catch (error) {
    console.error('Error loading test progress:', error);
    return null;
  }
};

/**
 * Speichert Test-Ergebnis
 */
export const saveTestResult = async (
  result: TestErgebnis,
  primaryProfile?: string,
  secondaryProfile?: string,
  completionTimeSeconds?: number,
): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('test_results').insert({
      user_id: user.id,
      test_id: result.testId,
      test_name: result.testName,
      scores: result.scores,
      percentage_score: result.prozent,
      answers: result.antworten.map((a) => ({
        questionId: a.frageId,
        answerId: a.antwortId,
      })),
      primary_profile: primaryProfile,
      secondary_profile: secondaryProfile,
      completion_time_seconds: completionTimeSeconds,
      completed_at: new Date().toISOString(),
    } as any);

    if (error) throw error;

    // Lösche Test-Fortschritt nach Abschluss
    await supabase
      .from('test_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('test_id', result.testId);

    return true;
  } catch (error) {
    console.error('Error saving test result:', error);
    return false;
  }
};

/**
 * Lädt alle Test-Ergebnisse des Users
 */
export const getUserTestResults = async (): Promise<SupabaseTestResult[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = (await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })) as any;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading user test results:', error);
    return [];
  }
};

/**
 * Lädt spezifisches Test-Ergebnis
 */
export const getTestResult = async (
  testId: string,
): Promise<SupabaseTestResult | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = (await supabase
      .from('test_results')
      .select('*')
      .eq('user_id', user.id)
      .eq('test_id', testId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single()) as any;

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error loading test result:', error);
    return null;
  }
};

/**
 * Lädt Test-Statistiken des Users
 */
export const getUserTestStatistics = async (): Promise<{
  totalCompleted: number;
  averageScore: number;
  lastTestDate: string | null;
  uniqueTestsTaken: number;
} | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = (await supabase
      .from('user_test_statistics')
      .select('*')
      .eq('user_id', user.id)
      .single()) as any;

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      totalCompleted: data.total_tests_completed,
      averageScore: data.average_score,
      lastTestDate: data.last_test_date,
      uniqueTestsTaken: data.unique_tests_taken,
    };
  } catch (error) {
    console.error('Error loading test statistics:', error);
    return null;
  }
};

/**
 * Löscht Test-Fortschritt (z.B. bei Neustart)
 */
export const deleteTestProgress = async (testId: string): Promise<boolean> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('test_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('test_id', testId);

    return !error;
  } catch (error) {
    console.error('Error deleting test progress:', error);
    return false;
  }
};

/**
 * Lädt beliebte Tests (aus View)
 */
export const getPopularTests = async (): Promise<
  Array<{
    test_id: string;
    test_name: string;
    category_id: string;
    completion_count: number;
    average_score: number;
  }>
> => {
  try {
    const { data, error } = (await supabase
      .from('popular_tests')
      .select('*')
      .limit(10)) as any;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading popular tests:', error);
    return [];
  }
};
