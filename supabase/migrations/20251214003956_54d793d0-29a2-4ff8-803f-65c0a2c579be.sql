-- =========================================================
-- AVALIAÇÕES DE EVENTO + PESQUISA DE SATISFAÇÃO
-- SAFE / IDEMPOTENT MIGRATION
-- =========================================================

-- =========================================================
-- TABELA: avaliacoes_evento
-- =========================================================
CREATE TABLE IF NOT EXISTS public.avaliacoes_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  profissional_id uuid REFERENCES public.profissionais(id) ON DELETE SET NULL,
  profissional_nome text,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  observacoes_admin text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.avaliacoes_evento ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all avaliacoes" ON public.avaliacoes_evento;
DROP POLICY IF EXISTS "Admins can insert avaliacoes" ON public.avaliacoes_evento;
DROP POLICY IF EXISTS "Admins can update avaliacoes" ON public.avaliacoes_evento;
DROP POLICY IF EXISTS "Admins can delete avaliacoes" ON public.avaliacoes_evento;

CREATE POLICY "Admins can view all avaliacoes"
ON public.avaliacoes_evento
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert avaliacoes"
ON public.avaliacoes_evento
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update avaliacoes"
ON public.avaliacoes_evento
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete avaliacoes"
ON public.avaliacoes_evento
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- TABELA: tokens_pesquisa
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tokens_pesquisa (
  token text PRIMARY KEY,
  reserva_id uuid NOT NULL REFERENCES public.reservas(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tokens_pesquisa ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all tokens" ON public.tokens_pesquisa;
DROP POLICY IF EXISTS "Admins can insert tokens" ON public.tokens_pesquisa;
DROP POLICY IF EXISTS "Admins can update tokens" ON public.tokens_pesquisa;
DROP POLICY IF EXISTS "Admins can delete tokens" ON public.tokens_pesquisa;

CREATE POLICY "Admins can view all tokens"
ON public.tokens_pesquisa
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert tokens"
ON public.tokens_pesquisa
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tokens"
ON public.tokens_pesquisa
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tokens"
ON public.tokens_pesquisa
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- TABELA: pesquisas_clientes
-- =========================================================
CREATE TABLE IF NOT EXISTS public.pesquisas_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  token text UNIQUE NOT NULL,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pesquisas_clientes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all pesquisas" ON public.pesquisas_clientes;
DROP POLICY IF EXISTS "Admins can update pesquisas" ON public.pesquisas_clientes;
DROP POLICY IF EXISTS "Admins can delete pesquisas" ON public.pesquisas_clientes;

CREATE POLICY "Admins can view all pesquisas"
ON public.pesquisas_clientes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pesquisas"
ON public.pesquisas_clientes
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pesquisas"
ON public.pesquisas_clientes
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- FUNÇÃO: submit_pesquisa_satisfacao (PÚBLICA VIA TOKEN)
-- =========================================================
CREATE OR REPLACE FUNCTION public.submit_pesquisa_satisfacao(
  p_token text,
  p_respostas jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_record tokens_pesquisa%ROWTYPE;
  v_new_id uuid;
BEGIN
  SELECT * INTO v_token_record
  FROM tokens_pesquisa
  WHERE token = p_token;

  IF v_token_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token inválido');
  END IF;

  IF NOT v_token_record.is_active OR v_token_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este link já foi utilizado');
  END IF;

  INSERT INTO pesquisas_clientes (reserva_id, token, respostas)
  VALUES (v_token_record.reserva_id, p_token, p_respostas)
  RETURNING id INTO v_new_id;

  UPDATE tokens_pesquisa
  SET is_active = false,
      used_at = now()
  WHERE token = p_token;

  RETURN jsonb_build_object('success', true, 'id', v_new_id);
END;
$$;

-- =========================================================
-- FUNÇÃO: validate_pesquisa_token
-- =========================================================
CREATE OR REPLACE FUNCTION public.validate_pesquisa_token(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_record tokens_pesquisa%ROWTYPE;
  v_reserva reservas%ROWTYPE;
BEGIN
  SELECT * INTO v_token_record
  FROM tokens_pesquisa
  WHERE token = p_token;

  IF v_token_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Token inválido');
  END IF;

  IF NOT v_token_record.is_active OR v_token_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Este link já foi utilizado');
  END IF;

  SELECT * INTO v_reserva
  FROM reservas
  WHERE id = v_token_record.reserva_id;

  RETURN jsonb_build_object(
    'valid', true,
    'reserva_id', v_token_record.reserva_id,
    'cliente_nome', COALESCE(v_reserva.nome_completo, ''),
    'data_evento', COALESCE(v_reserva.data_evento::text, '')
  );
END;
$$;

-- =========================================================
-- FUNÇÃO: generate_satisfaction_token (ADMIN ONLY)
-- =========================================================
CREATE OR REPLACE FUNCTION public.generate_satisfaction_token(p_reserva_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_exists boolean;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Apenas administradores podem gerar tokens';
  END IF;

  LOOP
    v_token := encode(gen_random_bytes(16), 'hex');
    SELECT EXISTS (
      SELECT 1 FROM tokens_pesquisa WHERE token = v_token
    ) INTO v_exists;

    EXIT WHEN NOT v_exists;
  END LOOP;

  INSERT INTO tokens_pesquisa (token, reserva_id)
  VALUES (v_token, p_reserva_id);

  RETURN v_token;
END;
$$;
