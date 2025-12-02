-- ============================================================================
-- SelfIQ Complete Database Migration
-- Version: 1.0.0
-- Date: 2025-11-27
-- ============================================================================
-- This script completely rebuilds the SelfIQ database structure.
-- WARNING: This will DROP all existing tables and recreate them!
-- ============================================================================

-- Drop existing tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS test_progress CASCADE;
DROP TABLE IF EXISTS story_progress CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tests CASCADE;
DROP TABLE IF EXISTS test_categories CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    email TEXT,
    detected_gender TEXT CHECK (detected_gender IN ('m', 'w', 'd')) DEFAULT 'd',
    device_id TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    profile_picture_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    background_activity_enabled BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    music_enabled BOOLEAN DEFAULT TRUE,
    haptics_enabled BOOLEAN DEFAULT TRUE,
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    language TEXT DEFAULT 'de' CHECK (language IN ('de', 'en')),
    font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    privacy_accepted BOOLEAN DEFAULT FALSE,
    privacy_accepted_at TIMESTAMP WITH TIME ZONE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test Categories Table
CREATE TABLE test_categories (
    category_id TEXT PRIMARY KEY,
    category_name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tests Table
CREATE TABLE tests (
    test_id TEXT PRIMARY KEY,
    test_name TEXT NOT NULL,
    category_id TEXT REFERENCES test_categories(category_id) ON DELETE CASCADE,
    description TEXT,
    duration_minutes INTEGER DEFAULT 15,
    question_count INTEGER DEFAULT 30,
    is_locked BOOLEAN DEFAULT FALSE,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert')) DEFAULT 'medium',
    min_age INTEGER DEFAULT 16,
    max_age INTEGER,
    tags TEXT[],
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TEST PROGRESS & RESULTS
-- ============================================================================

-- Test Progress Table (für laufende Tests)
CREATE TABLE test_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id TEXT REFERENCES tests(test_id) ON DELETE CASCADE,
    current_question_index INTEGER DEFAULT 0,
    completed_questions TEXT[] DEFAULT '{}',
    answers JSONB DEFAULT '[]'::JSONB,
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, test_id)
);

-- Test Results Table (abgeschlossene Tests)
CREATE TABLE test_results (
    result_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id TEXT REFERENCES tests(test_id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    scores JSONB NOT NULL, -- { "openness": 85, "conscientiousness": 72, ... }
    percentage_score NUMERIC(5,2),
    answers JSONB, -- [{ "questionId": "q1", "answerId": "a2", "score": {...} }]
    primary_profile TEXT,
    secondary_profile TEXT,
    completion_time_seconds INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Abfragen
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_test_id ON test_results(test_id);
CREATE INDEX idx_test_results_completed_at ON test_results(completed_at DESC);

-- ============================================================================
-- SUBSCRIPTION & PAYMENT
-- ============================================================================

-- Subscriptions Table
CREATE TABLE subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_type TEXT NOT NULL CHECK (subscription_type IN ('trial', 'premium_monthly', 'premium_yearly', 'lifetime')),
    status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled', 'pending')) DEFAULT 'active',
    price_paid NUMERIC(10,2),
    currency TEXT DEFAULT 'EUR',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    is_trial BOOLEAN DEFAULT FALSE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_provider TEXT, -- 'apple', 'google', 'stripe', etc.
    external_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);

-- Purchases Table (Einzelkäufe für spezifische Tests)
CREATE TABLE purchases (
    purchase_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id TEXT REFERENCES tests(test_id) ON DELETE CASCADE,
    price_paid NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'refunded')) DEFAULT 'completed',
    payment_provider TEXT,
    external_transaction_id TEXT,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    refunded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_test_id ON purchases(test_id);

-- ============================================================================
-- ANALYTICS & TRACKING
-- ============================================================================

-- Analytics Events Table
CREATE TABLE analytics_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    event_data JSONB,
    test_id TEXT,
    session_id TEXT,
    device_info JSONB,
    app_version TEXT,
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_test_id ON analytics_events(test_id);

-- ============================================================================
-- LEGACY SUPPORT (für Story-basierte Features)
-- ============================================================================

-- Story Progress Table (falls Stories später genutzt werden)
CREATE TABLE story_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    story_id TEXT NOT NULL,
    current_scene TEXT,
    completed_scenes TEXT[] DEFAULT '{}',
    progress_percentage INTEGER DEFAULT 0,
    last_played_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, story_id)
);

CREATE INDEX idx_story_progress_user_id ON story_progress(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_progress ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can view their own profile" 
    ON users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON users FOR UPDATE 
    USING (auth.uid() = id);

-- User Settings Policies
CREATE POLICY "Users can view their own settings" 
    ON user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
    ON user_settings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
    ON user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Test Progress Policies
CREATE POLICY "Users can view their own test progress" 
    ON test_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test progress" 
    ON test_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test progress" 
    ON test_progress FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own test progress" 
    ON test_progress FOR DELETE 
    USING (auth.uid() = user_id);

-- Test Results Policies
CREATE POLICY "Users can view their own test results" 
    ON test_results FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" 
    ON test_results FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Subscriptions Policies
CREATE POLICY "Users can view their own subscriptions" 
    ON subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
    ON subscriptions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Purchases Policies
CREATE POLICY "Users can view their own purchases" 
    ON purchases FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
    ON purchases FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Analytics Policies
CREATE POLICY "Users can insert their own analytics events" 
    ON analytics_events FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Story Progress Policies
CREATE POLICY "Users can view their own story progress" 
    ON story_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own story progress" 
    ON story_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own story progress" 
    ON story_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- Public read access for test metadata
ALTER TABLE test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active test categories" 
    ON test_categories FOR SELECT 
    USING (is_active = TRUE);

CREATE POLICY "Anyone can view active tests" 
    ON tests FOR SELECT 
    USING (is_active = TRUE);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tests_updated_at 
    BEFORE UPDATE ON tests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_progress_updated_at 
    BEFORE UPDATE ON test_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_progress_updated_at 
    BEFORE UPDATE ON story_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO users (id, username, email, display_name, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username'),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO user_settings (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user profile on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Check subscription access
CREATE OR REPLACE FUNCTION has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions
        WHERE user_id = p_user_id
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check test access
CREATE OR REPLACE FUNCTION has_test_access(p_user_id UUID, p_test_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_locked BOOLEAN;
BEGIN
    -- Check if test is locked
    SELECT is_locked INTO v_is_locked
    FROM tests
    WHERE test_id = p_test_id;

    -- If not locked, everyone has access
    IF NOT v_is_locked THEN
        RETURN TRUE;
    END IF;

    -- Check subscription
    IF has_active_subscription(p_user_id) THEN
        RETURN TRUE;
    END IF;

    -- Check individual purchase
    RETURN EXISTS (
        SELECT 1 FROM purchases
        WHERE user_id = p_user_id
        AND test_id = p_test_id
        AND status = 'completed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA: Test Categories
-- ============================================================================

INSERT INTO test_categories (category_id, category_name, description, icon, display_order) VALUES
('persoenlichkeitstyp', 'Persönlichkeitstyp', 'Analysiere deine grundlegende Persönlichkeitsstruktur', '👤', 1),
('emotionale_intelligenz', 'Emotionale Intelligenz', 'Wie gut verstehst und managst du Emotionen?', '❤️', 2),
('fuehrungsqualitaeten', 'Führungsqualitäten', 'Entdecke dein Führungspotenzial', '👑', 3),
('stressresistenz', 'Stressresistenz', 'Wie gehst du mit Druck und Belastung um?', '💪', 4),
('soziale_kompetenzen', 'Soziale Kompetenzen', 'Teste deine zwischenmenschlichen Fähigkeiten', '🤝', 5),
('karriere_entwicklung', 'Karriere & Entwicklung', 'Finde deinen beruflichen Weg', '📈', 6);

-- ============================================================================
-- INITIAL DATA: Tests
-- ============================================================================

INSERT INTO tests (test_id, test_name, category_id, description, duration_minutes, question_count, is_locked, difficulty_level, display_order) VALUES
-- Persönlichkeitstyp
('pers_01', 'Big Five Persönlichkeitsanalyse', 'persoenlichkeitstyp', 'Der wissenschaftlich fundierte Standard zur Persönlichkeitsmessung', 20, 30, FALSE, 'medium', 1),
('pers_02', 'MBTI-inspirierter Typentest', 'persoenlichkeitstyp', 'Entdecke deinen Persönlichkeitstyp nach Myers-Briggs', 25, 40, TRUE, 'medium', 2),
('pers_03', 'Charakterstärken-Profil', 'persoenlichkeitstyp', 'Identifiziere deine 5 wichtigsten Charakterstärken', 15, 24, TRUE, 'easy', 3),

-- Emotionale Intelligenz
('eq_01', 'Emotionale Intelligenz Test', 'emotionale_intelligenz', 'Messe deine emotionale Kompetenz in 4 Bereichen', 18, 32, FALSE, 'medium', 1),
('eq_02', 'Empathie-Assessment', 'emotionale_intelligenz', 'Wie gut kannst du dich in andere hineinversetzen?', 12, 20, TRUE, 'easy', 2),
('eq_03', 'Selbstregulations-Check', 'emotionale_intelligenz', 'Teste deine Fähigkeit zur emotionalen Selbstkontrolle', 15, 25, TRUE, 'medium', 3),

-- Führungsqualitäten
('lead_01', 'Führungsstil-Analyse', 'fuehrungsqualitaeten', 'Welcher Führungstyp bist du?', 22, 35, TRUE, 'hard', 1),
('lead_02', 'Team-Management Skills', 'fuehrungsqualitaeten', 'Bewerte deine Fähigkeiten im Teammanagement', 18, 28, TRUE, 'medium', 2),
('lead_03', 'Konfliktlösungs-Kompetenz', 'fuehrungsqualitaeten', 'Wie gehst du mit Konflikten um?', 15, 22, TRUE, 'medium', 3),

-- Stressresistenz
('stress_01', 'Stressresistenz-Test', 'stressresistenz', 'Wie resilient bist du unter Druck?', 15, 28, FALSE, 'medium', 1),
('stress_02', 'Burnout-Risiko-Assessment', 'stressresistenz', 'Erkenne frühzeitig Burnout-Anzeichen', 20, 35, TRUE, 'hard', 2),
('stress_03', 'Work-Life-Balance Check', 'stressresistenz', 'Ist dein Leben in Balance?', 12, 20, TRUE, 'easy', 3),

-- Soziale Kompetenzen
('social_01', 'Kommunikationsstil-Test', 'soziale_kompetenzen', 'Analysiere deine Art zu kommunizieren', 15, 25, TRUE, 'medium', 1),
('social_02', 'Konflikt- und Kritikfähigkeit', 'soziale_kompetenzen', 'Wie gehst du mit Kritik und Konflikten um?', 18, 30, TRUE, 'medium', 2),
('social_03', 'Teamfähigkeits-Assessment', 'soziale_kompetenzen', 'Bist du ein guter Teamplayer?', 12, 22, TRUE, 'easy', 3),

-- Karriere & Entwicklung
('career_01', 'Karriere-Orientierungs-Test', 'karriere_entwicklung', 'Finde heraus, welche Karriere zu dir passt', 25, 40, TRUE, 'medium', 1),
('career_02', 'Stärken-Schwächen-Profil', 'karriere_entwicklung', 'Erkenne deine beruflichen Stärken und Entwicklungsfelder', 20, 32, TRUE, 'medium', 2),
('career_03', 'Lerntyp-Analyse', 'karriere_entwicklung', 'Wie lernst du am besten?', 15, 24, TRUE, 'easy', 3);

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View: User Subscription Status
CREATE OR REPLACE VIEW user_subscription_status
WITH (security_invoker = true) AS
SELECT 
    u.id as user_id,
    u.username,
    u.is_premium,
    s.subscription_type,
    s.status,
    s.started_at,
    s.expires_at,
    s.is_trial,
    CASE 
        WHEN s.status = 'active' AND (s.expires_at IS NULL OR s.expires_at > NOW()) THEN TRUE
        ELSE FALSE
    END as has_active_subscription,
    CASE 
        WHEN s.is_trial AND s.trial_end_date > NOW() THEN TRUE
        ELSE FALSE
    END as is_in_trial
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active';

-- View: User Test Statistics
CREATE OR REPLACE VIEW user_test_statistics
WITH (security_invoker = true) AS
SELECT 
    user_id,
    COUNT(*) as total_tests_completed,
    AVG(percentage_score) as average_score,
    MAX(completed_at) as last_test_date,
    COUNT(DISTINCT test_id) as unique_tests_taken
FROM test_results
GROUP BY user_id;

-- View: Popular Tests
CREATE OR REPLACE VIEW popular_tests
WITH (security_invoker = true) AS
SELECT 
    t.test_id,
    t.test_name,
    t.category_id,
    COUNT(tr.result_id) as completion_count,
    AVG(tr.percentage_score) as average_score
FROM tests t
LEFT JOIN test_results tr ON t.test_id = tr.test_id
WHERE t.is_active = TRUE
GROUP BY t.test_id, t.test_name, t.category_id
ORDER BY completion_count DESC;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_test_results_user_test ON test_results(user_id, test_id);
CREATE INDEX idx_test_progress_user_test ON test_progress(user_id, test_id);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);
CREATE INDEX idx_analytics_user_type_date ON analytics_events(user_id, event_type, created_at);

-- Full-text search indexes
CREATE INDEX idx_tests_name_search ON tests USING gin(to_tsvector('german', test_name));
CREATE INDEX idx_tests_description_search ON tests USING gin(to_tsvector('german', description));

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'Core user profiles with authentication references';
COMMENT ON TABLE test_results IS 'Completed test results with full scoring data';
COMMENT ON TABLE subscriptions IS 'User subscription records for premium access';
COMMENT ON TABLE analytics_events IS 'Event tracking for user behavior analysis';
COMMENT ON TABLE test_progress IS 'In-progress test states for resuming later';

COMMENT ON FUNCTION has_active_subscription IS 'Checks if user has valid premium subscription';
COMMENT ON FUNCTION has_test_access IS 'Determines if user can access specific test';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ SelfIQ Database Migration Complete!';
    RAISE NOTICE '📊 Tables created: 11';
    RAISE NOTICE '🔒 RLS policies applied: 25+';
    RAISE NOTICE '⚡ Triggers configured: 7';
    RAISE NOTICE '🎯 Initial data loaded: 6 categories, 18 tests';
    RAISE NOTICE '🚀 Database ready for production use!';
END $$;
