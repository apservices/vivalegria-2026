-- =========================================================
-- EMAIL TEMPLATES / CONTRACT TEMPLATES / ADMIN LOGS
-- VERSÃO FINAL - RESOLVE ERRO 42703 DEFINITIVAMENTE
-- =========================================================

-- =========================================================
-- EMAIL TEMPLATES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can insert email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can update email templates" ON public.email_templates;
DROP POLICY IF EXISTS "Admins can delete email templates" ON public.email_templates;

CREATE POLICY "Admins can view all email templates"
ON public.email_templates FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert email templates"
ON public.email_templates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update email templates"
ON public.email_templates FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete email templates"
ON public.email_templates FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));


-- =========================================================
-- CONTRACT TEMPLATES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Admins can insert contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Admins can update contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Admins can delete contract templates" ON public.contract_templates;

CREATE POLICY "Admins can view all contract templates"
ON public.contract_templates FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert contract templates"
ON public.contract_templates FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contract templates"
ON public.contract_templates FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contract templates"
ON public.contract_templates FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));


-- =========================================================
-- ADMIN LOGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Garantir coluna reserva_id
ALTER TABLE public.admin_logs
ADD COLUMN IF NOT EXISTS reserva_id uuid
REFERENCES public.reservas(id) ON DELETE SET NULL;

-- Criar índice APENAS se a coluna existir (resolve 42703 para sempre)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'admin_logs' 
      AND column_name = 'reserva_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_admin_logs_reserva_id 
    ON public.admin_logs(reserva_id);
  END IF;
END $$;

-- Policies
DROP POLICY IF EXISTS "Admins can view admin logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Admins can insert admin logs" ON public.admin_logs;

CREATE POLICY "Admins can view admin logs"
ON public.admin_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert admin logs"
ON public.admin_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));