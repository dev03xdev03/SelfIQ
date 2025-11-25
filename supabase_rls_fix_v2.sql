-- =====================================================
-- COMPLETE RLS FIX - Service Role Function Approach
-- =====================================================

-- 1. Entferne alle alten Policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Enable read access for own user" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.users;
DROP POLICY IF EXISTS "Enable update for own user" ON public.users;

-- 2. Erstelle neue, permissive Policies
CREATE POLICY "Enable read access for own user" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for own user" ON public.users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. Trigger Function für automatisches User-Profil (mit SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name, detected_gender)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'username', 'Guest'),
    COALESCE(NEW.raw_user_meta_data->>'detected_gender', 'n')
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

-- 4. Trigger bei neuem Auth User
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Aktiviere RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
