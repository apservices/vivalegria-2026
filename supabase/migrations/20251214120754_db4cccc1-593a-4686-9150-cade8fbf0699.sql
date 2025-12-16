-- =========================================================
-- CLIENTES
-- SAFE / IDEMPOTENT MIGRATION
-- =========================================================

-- ---------------------------------------------------------
-- TABELA: clientes (garantir existência)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cpf_cnpj text NOT NULL UNIQUE,
  tipo_cadastro text NOT NULL CHECK (tipo_cadastro IN ('pf', 'pj')),
  nome_completo text NOT NULL,
  telefone text,
  email text,
  cep text,
  endereco text,
  complemento text,
  cidade text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.clientes IS
'Cadastro único de clientes por CPF ou CNPJ';

-- ---------------------------------------------------------
-- GARANTIR COLUNAS (caso banco antigo)
-- ---------------------------------------------------------
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS telefone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS complemento text,
  ADD COLUMN IF NOT EXISTS cidade text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ---------------------------------------------------------
-- RLS
-- ---------------------------------------------------------
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- POLICIES (DROP + CREATE)
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Admins can insert clientes" ON public.clientes;
DROP POLICY IF EXISTS "Admins can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Admins can delete clientes" ON public.clientes;

CREATE POLICY "Admins can view clientes"
ON public.clientes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert clientes"
ON public.clientes
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update clientes"
ON public.clientes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete clientes"
ON public.clientes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));
