-- Remove unused tables that have RLS enabled but no policies
-- These tables are not used in the current app version

DROP TABLE IF EXISTS user_choices CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
