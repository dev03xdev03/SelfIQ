-- Fix search_path for all existing functions to remove mutable search_path warnings

-- Fix update_updated_at_column
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
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

-- Recreate all triggers that were dropped
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

-- Fix handle_new_user if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
    ) THEN
        EXECUTE 'ALTER FUNCTION public.handle_new_user() SET search_path = public';
    END IF;
END $$;

-- Fix user_has_access_to_story if it exists
DO $$
DECLARE
    func_sig text;
BEGIN
    SELECT pg_get_function_identity_arguments(p.oid) INTO func_sig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'user_has_access_to_story'
    LIMIT 1;
    
    IF func_sig IS NOT NULL THEN
        EXECUTE format('ALTER FUNCTION public.user_has_access_to_story(%s) SET search_path = public', func_sig);
    END IF;
END $$;

-- Fix clean_old_analytics if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'clean_old_analytics'
    ) THEN
        EXECUTE 'ALTER FUNCTION public.clean_old_analytics() SET search_path = public';
    END IF;
END $$;
