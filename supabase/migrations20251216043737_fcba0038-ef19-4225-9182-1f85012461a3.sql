-- =========================================================
-- PROFISSIONAL_AUTH - VÍNCULO RECREADOR x AUTH.USERS
-- SAFE / IDEMPOTENT MIGRATION (RESOLVE POLICY DUPLICADA)
-- =========================================================

-- Tabela profissional_auth (garantir existência)
CREATE TABLE IF NOT EXISTS public.profissional_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profissional_id uuid REFERENCES public.profissionais(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id),
  UNIQUE(profissional_id)
);

COMMENT ON TABLE public.profissional_auth IS 'Vínculo entre usuário Supabase Auth e profissional/recreador';

-- RLS
ALTER TABLE public.profissional_auth ENABLE ROW LEVEL SECURITY;

-- Policies (DROP + CREATE - resolve "policy already exists")
DROP POLICY IF EXISTS "Admins can manage profissional_auth" ON public.profissional_auth;
DROP POLICY IF EXISTS "Recreadores can view own link" ON public.profissional_auth; -- se existir

CREATE POLICY "Admins can manage profissional_auth"
ON public.profissional_auth
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Opcional: recreador vê seu próprio vínculo
CREATE POLICY "Recreadores can view own profissional_auth"
ON public.profissional_auth
FOR SELECT
USING (auth.uid() = user_id);