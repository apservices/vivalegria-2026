-- =========================================================
-- FASE 3 — SISTEMA DE VAGAS + CANDIDATURAS + E-MAILS
-- Data: 16/12/2025
-- Seguro: NÃO altera tabelas existentes
-- =========================================================

-- -------------------------------
-- 1️⃣ VAGAS ABERTAS POR EVENTO
-- -------------------------------
CREATE TABLE IF NOT EXISTS public.evento_vagas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  evento_id uuid NOT NULL REFERENCES public.reservas(id) ON DELETE CASCADE,
  status text CHECK (status IN ('aberta', 'preenchida', 'cancelada')) DEFAULT 'aberta',
  habilidade_necessaria text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

COMMENT ON TABLE public.evento_vagas IS
'Vagas abertas por evento para recreadores se candidatarem';


-- -------------------------------
-- 2️⃣ CANDIDATURAS DE RECREADORES
-- -------------------------------
CREATE TABLE IF NOT EXISTS public.evento_candidaturas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id uuid NOT NULL REFERENCES public.evento_vagas(id) ON DELETE CASCADE,
  recreador_id uuid NOT NULL REFERENCES auth.users(id),
  status text CHECK (status IN ('pendente', 'aprovada', 'rejeitada')) DEFAULT 'pendente',
  motivo_rejeicao text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE (vaga_id, recreador_id)
);

COMMENT ON TABLE public.evento_candidaturas IS
'Candidaturas de recreadores para vagas abertas em eventos';


-- -------------------------------
-- 3️⃣ FILA DE E-MAILS AUTOMÁTICOS
-- -------------------------------
CREATE TABLE IF NOT EXISTS public.email_agendado (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo text CHECK (tipo IN ('confirmacao', 'avaliacao', 'pesquisa', 'pagamento', 'contrato')),
  destinatario text NOT NULL,
  assunto text NOT NULL,
  corpo text NOT NULL,
  dados jsonb,
  status text CHECK (status IN ('agendado', 'enviado', 'falhou')) DEFAULT 'agendado',
  criado_em timestamp DEFAULT now(),
  enviado_em timestamp,
  erro_mensagem text
);

COMMENT ON TABLE public.email_agendado IS
'Fila de e-mails automáticos do sistema (confirmação, avaliação, pesquisa etc)';


-- -------------------------------
-- 4️⃣ ÍNDICES (PERFORMANCE)
-- -------------------------------
CREATE INDEX IF NOT EXISTS idx_evento_vagas_status
  ON public.evento_vagas(status);

CREATE INDEX IF NOT EXISTS idx_evento_candidaturas_status
  ON public.evento_candidaturas(status);

CREATE INDEX IF NOT EXISTS idx_email_agendado_status
  ON public.email_agendado(status);


-- -------------------------------
-- 5️⃣ RLS — SEGURANÇA
-- -------------------------------

-- Vagas
ALTER TABLE public.evento_vagas ENABLE ROW LEVEL SECURITY;

-- Casting pode ver vagas
CREATE POLICY "casting_view_evento_vagas"
ON public.evento_vagas
FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role'
   FROM auth.users
   WHERE id = auth.uid()) = 'casting'
);

-- Candidaturas
ALTER TABLE public.evento_candidaturas ENABLE ROW LEVEL SECURITY;

-- Recreador vê apenas suas candidaturas
CREATE POLICY "recreador_view_own_candidaturas"
ON public.evento_candidaturas
FOR SELECT
USING (auth.uid() = recreador_id);

-- Casting vê todas candidaturas
CREATE POLICY "casting_view_candidaturas"
ON public.evento_candidaturas
FOR SELECT
USING (
  (SELECT raw_user_meta_data->>'role'
   FROM auth.users
   WHERE id = auth.uid()) = 'casting'
);
