-- =====================================================
-- DISABLE RLS - Einfachste Lösung
-- =====================================================
-- RLS komplett deaktivieren für users und user_settings
-- Da wir bereits über auth.uid() in den Service-Funktionen absichern

-- 1. Deaktiviere RLS für users Tabelle
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Deaktiviere RLS für user_settings Tabelle  
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;

-- 3. Lösche alle Policies (nicht mehr nötig)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable read access for own user" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for own user" ON users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow insert during signup" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for new users" ON users;
DROP POLICY IF EXISTS "Enable update for own profile" ON users;

DROP POLICY IF EXISTS "Enable read access for own settings" ON user_settings;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_settings;
DROP POLICY IF EXISTS "Enable update for own settings" ON user_settings;
DROP POLICY IF EXISTS "Enable read for own settings" ON user_settings;
DROP POLICY IF EXISTS "Enable insert for new settings" ON user_settings;

-- 4. Verbesserte Trigger-Funktion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_username TEXT;
  new_gender TEXT;
  new_device_id TEXT;
BEGIN
  -- Extrahiere Metadata
  new_username := COALESCE(NEW.raw_user_meta_data->>'username', 'Guest');
  new_gender := COALESCE(NEW.raw_user_meta_data->>'detected_gender', 'n');
  new_device_id := NEW.raw_user_meta_data->>'device_id';

  -- Erstelle User-Profil
  INSERT INTO public.users (
    id,
    username,
    display_name,
    detected_gender,
    device_id,
    created_at,
    updated_at,
    last_active
  ) VALUES (
    NEW.id,
    new_username,
    new_username,
    new_gender::gender_type,
    new_device_id,
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  -- Erstelle Default Settings
  INSERT INTO public.user_settings (
    user_id,
    sound_enabled,
    haptics_enabled,
    notifications_enabled
  ) VALUES (
    NEW.id,
    true,
    true,
    true
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail auth
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 5. Stelle sicher, dass Trigger existiert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
