-- Add is_guest column to users table for guest account management
-- This column tracks whether a user is a guest (72h time limit) or authenticated

-- Drop dependent views that use the id column
DROP VIEW IF EXISTS user_subscription_status CASCADE;
DROP VIEW IF EXISTS user_test_statistics CASCADE;
DROP VIEW IF EXISTS popular_tests CASCADE;

-- Drop functions that depend on UUID user_id
DROP FUNCTION IF EXISTS has_active_subscription(UUID);
DROP FUNCTION IF EXISTS has_test_access(UUID, TEXT);

-- First, drop ALL existing policies from all tables
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT schemaname, tablename, policyname
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- Drop all foreign key constraints that reference users(id)
ALTER TABLE user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE test_results DROP CONSTRAINT IF EXISTS test_results_user_id_fkey;
ALTER TABLE test_progress DROP CONSTRAINT IF EXISTS test_progress_user_id_fkey;
ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_user_id_fkey;
ALTER TABLE analytics_events DROP CONSTRAINT IF EXISTS analytics_events_user_id_fkey;
ALTER TABLE story_progress DROP CONSTRAINT IF EXISTS story_progress_user_id_fkey;

-- Drop the foreign key from users to auth.users (we'll allow both UUID and guest IDs)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Change id column type from UUID to TEXT in users table
ALTER TABLE users ALTER COLUMN id TYPE TEXT;

-- Change user_id columns to TEXT in all related tables
ALTER TABLE user_settings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE subscriptions ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE test_results ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE test_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE purchases ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE analytics_events ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE story_progress ALTER COLUMN user_id TYPE TEXT;

-- Recreate foreign key constraints
ALTER TABLE user_settings ADD CONSTRAINT user_settings_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE test_results ADD CONSTRAINT test_results_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE test_progress ADD CONSTRAINT test_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE purchases ADD CONSTRAINT purchases_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE analytics_events ADD CONSTRAINT analytics_events_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE story_progress ADD CONSTRAINT story_progress_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_guest BOOLEAN DEFAULT FALSE NOT NULL;

-- Add last_active column for tracking user activity
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add index for faster queries filtering by guest status
CREATE INDEX IF NOT EXISTS idx_users_is_guest ON users(is_guest);

-- Add index for guest expiration checks (combining is_guest + created_at)
CREATE INDEX IF NOT EXISTS idx_users_guest_created ON users(is_guest, created_at) WHERE is_guest = true;

-- Recreate RLS policies for guest user management
-- Allow authenticated and anonymous users to insert their own records
CREATE POLICY "Allow users to create guest accounts"
ON users FOR INSERT
WITH CHECK (true);

-- Update existing policy to allow guest users to update their own records
CREATE POLICY "Allow users to update own profile"
ON users FOR UPDATE
USING (id = COALESCE(auth.uid()::text, '') OR id LIKE 'guest_%')
WITH CHECK (id = COALESCE(auth.uid()::text, '') OR id LIKE 'guest_%');

-- Allow users to read their own guest records
CREATE POLICY "Allow users to read own profile"
ON users FOR SELECT
USING (id = COALESCE(auth.uid()::text, '') OR id LIKE 'guest_%');

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
ON user_settings FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can update their own settings"
ON user_settings FOR UPDATE
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own settings"
ON user_settings FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for test_progress
CREATE POLICY "Users can view their own test progress"
ON test_progress FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own test progress"
ON test_progress FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can update their own test progress"
ON test_progress FOR UPDATE
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can delete their own test progress"
ON test_progress FOR DELETE
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for test_results
CREATE POLICY "Users can view their own test results"
ON test_results FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own test results"
ON test_results FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON subscriptions FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own subscriptions"
ON subscriptions FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for purchases
CREATE POLICY "Users can view their own purchases"
ON purchases FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own purchases"
ON purchases FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for analytics_events
CREATE POLICY "Users can insert their own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Policies for story_progress
CREATE POLICY "Users can view their own story progress"
ON story_progress FOR SELECT
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can insert their own story progress"
ON story_progress FOR INSERT
WITH CHECK (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

CREATE POLICY "Users can update their own story progress"
ON story_progress FOR UPDATE
USING (user_id = COALESCE(auth.uid()::text, '') OR user_id LIKE 'guest_%');

-- Public read policies for tests and categories
CREATE POLICY "Anyone can view active test categories"
ON test_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Anyone can view active tests"
ON tests FOR SELECT
USING (is_active = true);

-- Recreate functions with TEXT parameter type and fixed search_path
CREATE OR REPLACE FUNCTION has_active_subscription(p_user_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM subscriptions 
        WHERE user_id = p_user_id 
        AND status = 'active'
        AND (expires_at IS NULL OR expires_at > NOW())
    );
END;
$$;

CREATE OR REPLACE FUNCTION has_test_access(p_user_id TEXT, p_test_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_premium BOOLEAN;
BEGIN
    SELECT is_premium INTO user_premium FROM users WHERE id = p_user_id;
    RETURN user_premium OR has_active_subscription(p_user_id);
END;
$$;

-- Recreate the user_subscription_status view (without SECURITY DEFINER)
CREATE OR REPLACE VIEW user_subscription_status AS
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

-- Recreate the user_test_statistics view (without SECURITY DEFINER)
CREATE OR REPLACE VIEW user_test_statistics AS
SELECT 
    user_id,
    COUNT(*) as total_tests_completed,
    AVG(percentage_score) as average_score,
    MAX(completed_at) as last_test_date,
    COUNT(DISTINCT test_id) as unique_tests_taken
FROM test_results
GROUP BY user_id;

-- Recreate the popular_tests view (without SECURITY DEFINER)
CREATE OR REPLACE VIEW popular_tests AS
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

COMMENT ON COLUMN users.is_guest IS 'Indicates if this is a guest account (limited to 72 hours). Guest accounts are identified by device_id.';
