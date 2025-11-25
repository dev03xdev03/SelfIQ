-- =====================================================
-- DEVICE ID SUPPORT - Database Migration
-- =====================================================

-- Füge device_id Spalte zur users Tabelle hinzu
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS device_id TEXT UNIQUE;

-- Index für schnelle Device-Lookups
CREATE INDEX IF NOT EXISTS idx_users_device_id ON public.users(device_id);

-- Update handle_new_user Funktion um device_id zu unterstützen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, detected_gender, device_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'username', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'detected_gender', 'n'),
    COALESCE(NEW.raw_user_meta_data->>'device_id', NULL)
  );
  
  -- Erstelle auch Default Settings
  INSERT INTO public.user_settings (user_id, sound_enabled, haptics_enabled, notifications_enabled)
  VALUES (NEW.id, true, true, true);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail auth
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: User über Device ID finden oder erstellen
CREATE OR REPLACE FUNCTION get_or_create_user_by_device(
  p_device_id TEXT,
  p_username TEXT DEFAULT 'Guest',
  p_detected_gender TEXT DEFAULT 'n'
)
RETURNS TABLE(user_id UUID, is_new_user BOOLEAN) 
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_is_new BOOLEAN := false;
BEGIN
  -- Versuche existierenden User zu finden
  SELECT id INTO v_user_id 
  FROM public.users 
  WHERE device_id = p_device_id
  LIMIT 1;
  
  -- Falls nicht gefunden, erstelle neuen anonymen User
  IF v_user_id IS NULL THEN
    -- Erstelle anonymen Auth User
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      role,
      aud
    )
    VALUES (
      gen_random_uuid(),
      p_device_id || '@device.dreamz.app',
      crypt('device_' || p_device_id, gen_salt('bf')),
      NOW(),
      jsonb_build_object(
        'username', p_username,
        'detected_gender', p_detected_gender,
        'device_id', p_device_id
      ),
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO v_user_id;
    
    v_is_new := true;
  END IF;
  
  RETURN QUERY SELECT v_user_id, v_is_new;
END;
$$ LANGUAGE plpgsql;
