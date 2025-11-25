-- =====================================================
-- DREAMZ APP - Consent & Permission Tracking Migration
-- Fügt Felder für Zustimmungen und Berechtigungen hinzu
-- =====================================================

-- Füge neue Felder zu user_settings hinzu
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS background_activity_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

-- Kommentar für Dokumentation
COMMENT ON COLUMN public.user_settings.background_activity_enabled IS 'User hat Hintergrundaktivität erlaubt';
COMMENT ON COLUMN public.user_settings.terms_accepted IS 'User hat AGB akzeptiert';
COMMENT ON COLUMN public.user_settings.terms_accepted_at IS 'Zeitpunkt der AGB-Zustimmung';
COMMENT ON COLUMN public.user_settings.privacy_accepted IS 'User hat Datenschutzbestimmungen akzeptiert';
COMMENT ON COLUMN public.user_settings.privacy_accepted_at IS 'Zeitpunkt der Datenschutz-Zustimmung';
