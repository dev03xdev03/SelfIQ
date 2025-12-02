/**
 * TypeScript Type Definitions für Supabase Database
 * Auto-generiert basierend auf dem Database Schema
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          email: string | null;
          detected_gender: 'm' | 'w' | 'n';
          device_id: string | null;
          is_premium: boolean;
          profile_picture_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          last_login: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          email?: string | null;
          detected_gender?: 'm' | 'w' | 'n';
          device_id?: string | null;
          is_premium?: boolean;
          profile_picture_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          email?: string | null;
          detected_gender?: 'm' | 'w' | 'n';
          device_id?: string | null;
          is_premium?: boolean;
          profile_picture_url?: string | null;
          bio?: string | null;
          updated_at?: string;
          last_login?: string;
        };
      };
      user_settings: {
        Row: {
          user_id: string;
          background_activity_enabled: boolean;
          notifications_enabled: boolean;
          sound_enabled: boolean;
          music_enabled: boolean;
          haptics_enabled: boolean;
          theme: 'light' | 'dark' | 'auto';
          language: 'de' | 'en';
          font_size: 'small' | 'medium' | 'large';
          terms_accepted: boolean;
          terms_accepted_at: string | null;
          privacy_accepted: boolean;
          privacy_accepted_at: string | null;
          marketing_consent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          background_activity_enabled?: boolean;
          notifications_enabled?: boolean;
          sound_enabled?: boolean;
          music_enabled?: boolean;
          haptics_enabled?: boolean;
          theme?: 'light' | 'dark' | 'auto';
          language?: 'de' | 'en';
          font_size?: 'small' | 'medium' | 'large';
          terms_accepted?: boolean;
          terms_accepted_at?: string | null;
          privacy_accepted?: boolean;
          privacy_accepted_at?: string | null;
          marketing_consent?: boolean;
        };
        Update: {
          background_activity_enabled?: boolean;
          notifications_enabled?: boolean;
          sound_enabled?: boolean;
          music_enabled?: boolean;
          haptics_enabled?: boolean;
          theme?: 'light' | 'dark' | 'auto';
          language?: 'de' | 'en';
          font_size?: 'small' | 'medium' | 'large';
          terms_accepted?: boolean;
          terms_accepted_at?: string | null;
          privacy_accepted?: boolean;
          privacy_accepted_at?: string | null;
          marketing_consent?: boolean;
          updated_at?: string;
        };
      };
      test_categories: {
        Row: {
          category_id: string;
          category_name: string;
          description: string | null;
          icon: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
      };
      tests: {
        Row: {
          test_id: string;
          test_name: string;
          category_id: string;
          description: string | null;
          duration_minutes: number;
          question_count: number;
          is_locked: boolean;
          difficulty_level: 'easy' | 'medium' | 'hard' | 'expert';
          min_age: number;
          max_age: number | null;
          tags: string[] | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      test_progress: {
        Row: {
          progress_id: string;
          user_id: string;
          test_id: string;
          current_question_index: number;
          completed_questions: string[];
          answers: TestAnswer[];
          progress_percentage: number;
          started_at: string;
          last_updated: string;
        };
        Insert: {
          user_id: string;
          test_id: string;
          current_question_index?: number;
          completed_questions?: string[];
          answers?: TestAnswer[];
          progress_percentage?: number;
          started_at?: string;
        };
        Update: {
          current_question_index?: number;
          completed_questions?: string[];
          answers?: TestAnswer[];
          progress_percentage?: number;
          last_updated?: string;
        };
      };
      test_results: {
        Row: {
          result_id: string;
          user_id: string;
          test_id: string;
          test_name: string;
          scores: Record<string, number>;
          percentage_score: number;
          answers: TestAnswer[];
          primary_profile: string | null;
          secondary_profile: string | null;
          completion_time_seconds: number | null;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          test_id: string;
          test_name: string;
          scores: Record<string, number>;
          percentage_score?: number;
          answers?: TestAnswer[];
          primary_profile?: string | null;
          secondary_profile?: string | null;
          completion_time_seconds?: number | null;
          completed_at?: string;
        };
      };
      subscriptions: {
        Row: {
          subscription_id: string;
          user_id: string;
          subscription_type: 'premium_monthly' | 'premium_yearly' | 'lifetime';
          status: 'active' | 'expired' | 'cancelled' | 'pending';
          price_paid: number | null;
          currency: string;
          started_at: string;
          expires_at: string | null;
          cancelled_at: string | null;
          auto_renew: boolean;
          payment_provider: string | null;
          external_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          subscription_type: 'premium_monthly' | 'premium_yearly' | 'lifetime';
          status?: 'active' | 'expired' | 'cancelled' | 'pending';
          price_paid?: number | null;
          currency?: string;
          started_at?: string;
          expires_at?: string | null;
          auto_renew?: boolean;
          payment_provider?: string | null;
          external_subscription_id?: string | null;
        };
        Update: {
          subscription_type?: 'premium_monthly' | 'premium_yearly' | 'lifetime';
          status?: 'active' | 'expired' | 'cancelled' | 'pending';
          expires_at?: string | null;
          cancelled_at?: string | null;
          auto_renew?: boolean;
          updated_at?: string;
        };
      };
      purchases: {
        Row: {
          purchase_id: string;
          user_id: string;
          test_id: string;
          price_paid: number;
          currency: string;
          status: 'pending' | 'completed' | 'refunded';
          payment_provider: string | null;
          external_transaction_id: string | null;
          purchased_at: string;
          refunded_at: string | null;
        };
        Insert: {
          user_id: string;
          test_id: string;
          price_paid: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'refunded';
          payment_provider?: string | null;
          external_transaction_id?: string | null;
        };
      };
      analytics_events: {
        Row: {
          event_id: string;
          user_id: string | null;
          event_type: string;
          event_data: Record<string, any> | null;
          test_id: string | null;
          session_id: string | null;
          device_info: Record<string, any> | null;
          app_version: string | null;
          platform: string | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          event_type: string;
          event_data?: Record<string, any> | null;
          test_id?: string | null;
          session_id?: string | null;
          device_info?: Record<string, any> | null;
          app_version?: string | null;
          platform?: string | null;
        };
      };
      story_progress: {
        Row: {
          progress_id: string;
          user_id: string;
          story_id: string;
          current_scene: string | null;
          completed_scenes: string[];
          progress_percentage: number;
          last_played_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          story_id: string;
          current_scene?: string | null;
          completed_scenes?: string[];
          progress_percentage?: number;
          last_played_date?: string;
        };
        Update: {
          current_scene?: string | null;
          completed_scenes?: string[];
          progress_percentage?: number;
          last_played_date?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      user_subscription_status: {
        Row: {
          user_id: string;
          username: string;
          is_premium: boolean;
          subscription_type: string | null;
          status: string | null;
          started_at: string | null;
          expires_at: string | null;
          has_active_subscription: boolean;
        };
      };
      user_test_statistics: {
        Row: {
          user_id: string;
          total_tests_completed: number;
          average_score: number;
          last_test_date: string;
          unique_tests_taken: number;
        };
      };
      popular_tests: {
        Row: {
          test_id: string;
          test_name: string;
          category_id: string;
          completion_count: number;
          average_score: number;
        };
      };
    };
    Functions: {
      has_active_subscription: {
        Args: { p_user_id: string };
        Returns: boolean;
      };
      has_test_access: {
        Args: { p_user_id: string; p_test_id: string };
        Returns: boolean;
      };
    };
  };
}

// Helper Types
export interface TestAnswer {
  questionId: string;
  answerId: string;
  score?: Record<string, number>;
}

export interface SupabaseUser {
  id: string;
  username: string;
  display_name?: string;
  email?: string;
  detected_gender?: 'm' | 'w' | 'n';
  device_id?: string;
  is_premium: boolean;
  created_at: string;
}

export interface SupabaseTestResult {
  result_id: string;
  user_id: string;
  test_id: string;
  test_name: string;
  scores: Record<string, number>;
  percentage_score: number;
  primary_profile?: string;
  secondary_profile?: string;
  completed_at: string;
}

export interface SupabaseSubscription {
  subscription_id: string;
  user_id: string;
  subscription_type: 'premium_monthly' | 'premium_yearly' | 'lifetime';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  expires_at: string | null;
}

export interface SupabaseTest {
  test_id: string;
  test_name: string;
  category_id: string;
  description?: string;
  duration_minutes: number;
  question_count: number;
  is_locked: boolean;
  difficulty_level: 'easy' | 'medium' | 'hard' | 'expert';
}
