-- Fix SECURITY DEFINER views by recreating them without that flag

-- Drop and recreate popular_tests view
DROP VIEW IF EXISTS popular_tests CASCADE;
CREATE VIEW popular_tests AS
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

-- Drop and recreate user_subscription_status view
DROP VIEW IF EXISTS user_subscription_status CASCADE;
CREATE VIEW user_subscription_status AS
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

-- Drop and recreate user_test_statistics view
DROP VIEW IF EXISTS user_test_statistics CASCADE;
CREATE VIEW user_test_statistics AS
SELECT 
    user_id,
    COUNT(*) as total_tests_completed,
    AVG(percentage_score) as average_score,
    MAX(completed_at) as last_test_date,
    COUNT(DISTINCT test_id) as unique_tests_taken
FROM test_results
GROUP BY user_id;
