-- =========================================================
-- AVALIAÇÕES DE EVENTO
-- SAFE / IDEMPOTENT MIGRATION
-- =========================================================

-- -------------------------------
-- TABLE: avaliacoes_evento
-- -------------------------------
CREATE TABLE IF NOT EXISTS public.avaliacoes_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  profissional_id uuid REFERENCES public.profissionais(id) ON DELETE SET NULL,
  profissional_nome text,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  observacoes_admin text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.avaliacoes_evento IS
'Avaliações de eventos preenchidas por profissionais e administradores';


-- -------------------------------
-- INDEXES (SAFE)
-- -------------------------------
CREATE INDEX IF NOT EXISTS idx_avaliacoes_evento_reserva
  ON public.avaliacoes_evento(reserva_id);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_evento_profissional
  ON public.avaliacoes_evento(profissional_id);


-- -------------------------------
-- RLS
-- -------------------------------
ALTER TABLE public.avaliacoes_evento ENABLE ROW LEVEL SECURITY;


-- -------------------------------
-- POLICIES (SAFE)
-- -------------------------------

-- Admin pode ver tudo
DROP POLICY IF EXISTS "Admins can view event evaluations" ON public.avaliacoes_evento;
CREATE POLICY "Admins can view event evaluations"
ON public.avaliacoes_evento
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin pode inserir
DROP POLICY IF EXISTS "Admins can insert event evaluations" ON public.avaliacoes_evento;
CREATE POLICY "Admins can insert event evaluations"
ON public.avaliacoes_evento
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin pode atualizar
DROP POLICY IF EXISTS "Admins can update event evaluations" ON public.avaliacoes_evento;
CREATE POLICY "Admins can update event evaluations"
ON public.avaliacoes_evento
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
