-- Tabela de avaliações de evento (preenchida por profissionais/admins)
CREATE TABLE public.avaliacoes_evento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  profissional_id uuid REFERENCES public.profissionais(id) ON DELETE SET NULL,
  profissional_nome text,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  observacoes_admin text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de tokens para pesquisa de satisfação
CREATE TABLE public.tokens_pesquisa (
  token text PRIMARY KEY,
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE CASCADE NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela de pesquisas de satisfação dos clientes
CREATE TABLE public.pesquisas_clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE SET NULL,
  token text UNIQUE NOT NULL,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.avaliacoes_evento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens_pesquisa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesquisas_clientes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for avaliacoes_evento
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

-- RLS Policies for tokens_pesquisa
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

-- RLS Policies for pesquisas_clientes
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

-- Função para validar token e inserir pesquisa (bypass RLS com SECURITY DEFINER)
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
  -- Buscar token
  SELECT * INTO v_token_record
  FROM tokens_pesquisa
  WHERE token = p_token;
  
  -- Validar existência
  IF v_token_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token inválido');
  END IF;
  
  -- Validar se está ativo
  IF NOT v_token_record.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este link já foi utilizado');
  END IF;
  
  -- Validar se já foi usado
  IF v_token_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Pesquisa já foi respondida');
  END IF;
  
  -- Inserir pesquisa
  INSERT INTO pesquisas_clientes (reserva_id, token, respostas)
  VALUES (v_token_record.reserva_id, p_token, p_respostas)
  RETURNING id INTO v_new_id;
  
  -- Marcar token como usado
  UPDATE tokens_pesquisa
  SET is_active = false, used_at = now()
  WHERE token = p_token;
  
  RETURN jsonb_build_object('success', true, 'id', v_new_id);
END;
$$;

-- Função para validar token (para verificar antes de mostrar formulário)
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
  
  -- Buscar dados da reserva para mostrar contexto
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

-- Função para gerar token único
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
  -- Verificar se usuário é admin
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Apenas administradores podem gerar tokens';
  END IF;
  
  LOOP
    -- Gerar token aleatório
    v_token := encode(gen_random_bytes(16), 'hex');
    
    -- Verificar se já existe
    SELECT EXISTS(SELECT 1 FROM tokens_pesquisa WHERE token = v_token) INTO v_exists;
    
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  -- Inserir token
  INSERT INTO tokens_pesquisa (token, reserva_id)
  VALUES (v_token, p_reserva_id);
  
  RETURN v_token;
END;
$$;