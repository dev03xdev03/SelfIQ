-- =====================================================
-- DREAMZ APP - SUPABASE DATABASE SCHEMA
-- Vollständige Datenbankstruktur für Live-Betrieb
-- Datum: 25. November 2025
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (erweitert Auth)
-- =====================================================
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    detected_gender TEXT CHECK (detected_gender IN ('m', 'w', 'n')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    total_play_time_minutes INTEGER DEFAULT 0,
    app_version TEXT,
    device_info JSONB
);

-- =====================================================
-- 2. STORIES TABLE (Zentrale Story-Verwaltung)
-- =====================================================
CREATE TABLE public.stories (
    id TEXT PRIMARY KEY,
    story_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Albtraum', 'Mystery', 'Fantasy', 'Horror', 'Thriller', 
        'Romance', 'Sci-Fi', 'Adventure', 'Dark Fantasy', 
        'Psycho', 'Comedy', 'Drama', 'Crime', 'Supernatural'
    )),
    icon_name TEXT NOT NULL,
    gradient_start TEXT NOT NULL,
    gradient_end TEXT NOT NULL,
    video_file TEXT,
    total_phases INTEGER DEFAULT 30,
    age_rating INTEGER NOT NULL CHECK (age_rating IN (0, 6, 12, 16, 18)),
    is_locked BOOLEAN DEFAULT true,
    release_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    play_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0
);

-- =====================================================
-- 3. STORY PROGRESS (User-spezifischer Fortschritt)
-- =====================================================
CREATE TABLE public.story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL REFERENCES public.stories(story_id) ON DELETE CASCADE,
    current_scene TEXT NOT NULL,
    completed_scenes TEXT[] DEFAULT '{}',
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_played_date TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_choices_made INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- =====================================================
-- 4. USER CHOICES (Tracking aller Entscheidungen)
-- =====================================================
CREATE TABLE public.user_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL REFERENCES public.stories(story_id) ON DELETE CASCADE,
    scene_id TEXT NOT NULL,
    choice_id TEXT NOT NULL,
    choice_text TEXT NOT NULL,
    chosen_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID
);

-- =====================================================
-- 5. SUBSCRIPTIONS (Abo-Verwaltung)
-- =====================================================
CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    subscription_type TEXT NOT NULL CHECK (subscription_type IN ('leseratten_abo', 'premium', 'trial')),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    price_paid DECIMAL(10,2),
    currency TEXT DEFAULT 'EUR',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    trial_end_date TIMESTAMPTZ,
    is_trial BOOLEAN DEFAULT false,
    auto_renew BOOLEAN DEFAULT true,
    payment_provider TEXT,
    external_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    UNIQUE(user_id, subscription_type, status)
);

-- =====================================================
-- 6. PURCHASES (Einzelkäufe von Stories)
-- =====================================================
CREATE TABLE public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL REFERENCES public.stories(story_id) ON DELETE CASCADE,
    purchase_type TEXT NOT NULL CHECK (purchase_type IN ('single_story', 'preorder')),
    price_paid DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_provider TEXT NOT NULL,
    external_transaction_id TEXT UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'refunded', 'failed')),
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

-- =====================================================
-- 7. USER SETTINGS (App-Einstellungen)
-- =====================================================
CREATE TABLE public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    sound_enabled BOOLEAN DEFAULT true,
    haptics_enabled BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    background_activity_enabled BOOLEAN DEFAULT false,
    terms_accepted BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMPTZ,
    privacy_accepted BOOLEAN DEFAULT false,
    privacy_accepted_at TIMESTAMPTZ,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    language TEXT DEFAULT 'de' CHECK (language IN ('de', 'en')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. ACHIEVEMENTS (Erfolge)
-- =====================================================
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    points INTEGER DEFAULT 0,
    rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- =====================================================
-- 9. ANALYTICS (Anonyme Nutzungsdaten)
-- =====================================================
CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    story_id TEXT,
    scene_id TEXT,
    session_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 10. FEEDBACK (User-Feedback)
-- =====================================================
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    story_id TEXT REFERENCES public.stories(story_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    feedback_type TEXT CHECK (feedback_type IN ('bug', 'feature', 'story', 'general')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES für Performance
-- =====================================================

-- Users
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_last_active ON public.users(last_active);

-- Stories
CREATE INDEX idx_stories_category ON public.stories(category);
CREATE INDEX idx_stories_is_locked ON public.stories(is_locked);
CREATE INDEX idx_stories_release_date ON public.stories(release_date);

-- Story Progress
CREATE INDEX idx_story_progress_user ON public.story_progress(user_id);
CREATE INDEX idx_story_progress_story ON public.story_progress(story_id);
CREATE INDEX idx_story_progress_last_played ON public.story_progress(last_played_date);

-- User Choices
CREATE INDEX idx_user_choices_user ON public.user_choices(user_id);
CREATE INDEX idx_user_choices_story ON public.user_choices(story_id);
CREATE INDEX idx_user_choices_session ON public.user_choices(session_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON public.subscriptions(expires_at);

-- Purchases
CREATE INDEX idx_purchases_user ON public.purchases(user_id);
CREATE INDEX idx_purchases_story ON public.purchases(story_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

-- Analytics
CREATE INDEX idx_analytics_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_created ON public.analytics_events(created_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS auf allen Tabellen
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users: Nur eigene Daten sehen/ändern
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Stories: Alle können lesen
CREATE POLICY "Anyone can view stories" ON public.stories
    FOR SELECT USING (true);

-- Story Progress: Nur eigene Daten
CREATE POLICY "Users can view own progress" ON public.story_progress
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own progress" ON public.story_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own progress" ON public.story_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- User Choices: Nur eigene Daten
CREATE POLICY "Users can view own choices" ON public.user_choices
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own choices" ON public.user_choices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions: Nur eigene Daten
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Purchases: Nur eigene Daten
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own purchases" ON public.purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Settings: Nur eigene Einstellungen
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements: Alle können lesen
CREATE POLICY "Anyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

-- User Achievements: Nur eigene
CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics: Nur eigene Events
CREATE POLICY "Users can insert own analytics" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback: Nur eigenes Feedback
CREATE POLICY "Users can view own feedback" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can insert own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_progress_updated_at BEFORE UPDATE ON public.story_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON public.feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Check if user has access to locked content
CREATE OR REPLACE FUNCTION user_has_access_to_story(p_user_id UUID, p_story_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    story_locked BOOLEAN;
    has_subscription BOOLEAN;
    has_purchase BOOLEAN;
BEGIN
    -- Check if story is locked
    SELECT is_locked INTO story_locked FROM public.stories WHERE story_id = p_story_id;
    
    IF NOT story_locked THEN
        RETURN TRUE;
    END IF;
    
    -- Check for active subscription
    SELECT EXISTS(
        SELECT 1 FROM public.subscriptions
        WHERE user_id = p_user_id
        AND status = 'active'
        AND expires_at > NOW()
    ) INTO has_subscription;
    
    IF has_subscription THEN
        RETURN TRUE;
    END IF;
    
    -- Check for individual purchase
    SELECT EXISTS(
        SELECT 1 FROM public.purchases
        WHERE user_id = p_user_id
        AND story_id = p_story_id
        AND status = 'completed'
    ) INTO has_purchase;
    
    RETURN has_purchase;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user story statistics
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS TABLE(
    total_stories_started INTEGER,
    total_stories_completed INTEGER,
    total_choices_made INTEGER,
    total_achievements INTEGER,
    completion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT sp.story_id)::INTEGER as total_stories_started,
        COUNT(DISTINCT sp.story_id) FILTER (WHERE sp.completed_at IS NOT NULL)::INTEGER as total_stories_completed,
        COALESCE(SUM(sp.total_choices_made), 0)::INTEGER as total_choices_made,
        COUNT(DISTINCT ua.achievement_id)::INTEGER as total_achievements,
        CASE 
            WHEN COUNT(DISTINCT sp.story_id) > 0 
            THEN ROUND(
                (COUNT(DISTINCT sp.story_id) FILTER (WHERE sp.completed_at IS NOT NULL)::NUMERIC / 
                COUNT(DISTINCT sp.story_id)::NUMERIC) * 100, 2
            )
            ELSE 0
        END as completion_rate
    FROM public.story_progress sp
    LEFT JOIN public.user_achievements ua ON ua.user_id = p_user_id
    WHERE sp.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA (Stories)
-- =====================================================

INSERT INTO public.stories (id, story_id, name, description, category, icon_name, gradient_start, gradient_end, video_file, age_rating, is_locked) VALUES
('alb_01', 'alb_01', 'Die Nacht ohne Ende', 'Eine endlose Nacht voller Schrecken', 'Albtraum', 'moon', '#1e3c72', '#2a5298', 'nightwithoutend.mp4', 16, false),
('mys_01', 'mys_01', 'Das Echo der Vergangenheit', 'Geheimnisse die niemals ruhen', 'Mystery', 'search', '#667eea', '#764ba2', 'echo.mp4', 12, false),
('fan_01', 'fan_01', 'Das verlorene Königreich', 'Eine epische Fantasy-Reise', 'Fantasy', 'castle', '#f093fb', '#f5576c', 'lostkingdom.mp4', 12, false),
('hor_01', 'hor_01', 'Der Raum ohne Ausgang', 'Purer Horror im verschlossenen Raum', 'Horror', 'skull', '#fc4a1a', '#f7b733', 'secretroom.mp4', 18, true),
('thr_01', 'thr_01', '72 Stunden bis Mitternacht', 'Ein Wettlauf gegen die Zeit', 'Thriller', 'time', '#4facfe', '#00f2fe', 'midnight.mp4', 16, true),
('rom_01', 'rom_01', 'Der Puls der Ewigkeit', 'Eine zeitlose Liebesgeschichte', 'Romance', 'heart', '#fa709a', '#fee140', 'pulse.mp4', 12, true),
('sci_01', 'sci_01', 'Protokoll Omega', 'Die Zukunft steht auf dem Spiel', 'Sci-Fi', 'planet', '#30cfd0', '#330867', 'protocol.mp4', 16, true),
('adv_01', 'adv_01', 'Die Tiefen des siebten Ozeans', 'Ein Unterwasserabenteuer', 'Adventure', 'boat', '#a8edea', '#fed6e3', '7ocean.mp4', 6, true),
('daf_01', 'daf_01', 'Der dunkle König', 'Dark Fantasy Abenteuer', 'Dark Fantasy', 'flame', '#2e1437', '#5d1e5f', null, 16, true),
('psy_01', 'psy_01', 'Die Fragmente meiner Seele', 'Psychologischer Thriller', 'Psycho', 'eye', '#232526', '#414345', null, 18, true),
('com_01', 'com_01', 'Murphy''s Law – Der Tag an dem alles schiefging', 'Comedy-Abenteuer', 'Comedy', 'happy', '#f7971e', '#ffd200', null, 12, true),
('dra_01', 'dra_01', 'Zwischen den Welten', 'Intensives Drama', 'Drama', 'people', '#536976', '#292e49', null, 16, true),
('cri_01', 'cri_01', 'Das kalte Herz von Berlin', 'Kriminalfall', 'Crime', 'shield-checkmark', '#141e30', '#243b55', null, 18, true),
('sup_01', 'sup_01', 'Die Chroniken der letzten Hexe', 'Übernatürliches Abenteuer', 'Supernatural', 'sparkles', '#834d9b', '#d04ed6', null, 16, true);

-- =====================================================
-- VIEWS für häufige Queries
-- =====================================================

-- User Progress Overview
CREATE VIEW user_progress_overview AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT sp.story_id) as stories_started,
    COUNT(DISTINCT sp.story_id) FILTER (WHERE sp.completed_at IS NOT NULL) as stories_completed,
    COALESCE(AVG(sp.progress_percentage), 0) as avg_progress,
    MAX(sp.last_played_date) as last_active
FROM public.users u
LEFT JOIN public.story_progress sp ON u.id = sp.user_id
GROUP BY u.id, u.username;

-- Story Statistics
CREATE VIEW story_statistics AS
SELECT 
    s.story_id,
    s.name,
    s.category,
    COUNT(DISTINCT sp.user_id) as total_players,
    COUNT(DISTINCT sp.user_id) FILTER (WHERE sp.completed_at IS NOT NULL) as total_completions,
    COALESCE(AVG(sp.progress_percentage), 0) as avg_progress,
    s.play_count,
    s.completion_count
FROM public.stories s
LEFT JOIN public.story_progress sp ON s.story_id = sp.story_id
GROUP BY s.story_id, s.name, s.category, s.play_count, s.completion_count;

-- =====================================================
-- BACKUP & MAINTENANCE
-- =====================================================

-- Function: Clean old analytics (older than 90 days)
CREATE OR REPLACE FUNCTION clean_old_analytics()
RETURNS void AS $$
BEGIN
    DELETE FROM public.analytics_events
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- GRANT PERMISSIONS (für authenticated users)
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- ENDE DES SCHEMAS
-- =====================================================
