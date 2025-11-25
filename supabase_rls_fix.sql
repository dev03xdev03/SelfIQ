-- =====================================================
-- RLS POLICY FIX für Guest Signup
-- =====================================================

-- Entferne alte Policies
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Neue Policies für users Tabelle
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);
    
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Stelle sicher dass neue User sich selbst anlegen können
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
