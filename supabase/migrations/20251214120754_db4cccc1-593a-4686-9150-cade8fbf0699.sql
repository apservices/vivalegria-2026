-- =============================================
-- 1) TABELA CLIENTES (cadastro único por CPF/CNPJ)
-- =============================================
CREATE TABLE public.clientes (
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

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clientes
CREATE POLICY "Public can lookup clients by cpf_cnpj" 
ON public.clientes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert clients" 
ON public.clientes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update clients" 
ON public.clientes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete clients" 
ON public.clientes 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast CPF/CNPJ lookup
CREATE INDEX idx_clientes_cpf_cnpj ON public.clientes(cpf_cnpj);

-- =============================================
-- 2) ADICIONAR COLUNAS NA TABELA RESERVAS
-- =============================================

-- Adicionar coluna para código único da reserva
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS codigo text UNIQUE;

-- Adicionar coluna para cliente_id (referência)
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES public.clientes(id);

-- Adicionar colunas para contrato
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS contrato_url text;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS contrato_gerado_em timestamptz;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS email_enviado_em timestamptz;

-- =============================================
-- 3) FUNÇÃO PARA GERAR CÓDIGO ÚNICO DA RESERVA
-- =============================================
CREATE OR REPLACE FUNCTION public.generate_reserva_codigo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence int;
  v_codigo text;
BEGIN
  -- Pegar o próximo número na sequência
  SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 5) AS integer)), 1000) + 1
  INTO v_sequence
  FROM reservas
  WHERE codigo IS NOT NULL AND codigo LIKE 'VIVA%';
  
  v_codigo := 'VIVA' || v_sequence;
  NEW.codigo := v_codigo;
  
  RETURN NEW;
END;
$$;

-- Trigger para gerar código automaticamente
DROP TRIGGER IF EXISTS trigger_generate_reserva_codigo ON public.reservas;
CREATE TRIGGER trigger_generate_reserva_codigo
BEFORE INSERT ON public.reservas
FOR EACH ROW
WHEN (NEW.codigo IS NULL)
EXECUTE FUNCTION public.generate_reserva_codigo();

-- =============================================
-- 4) FUNÇÃO PARA BUSCAR OU CRIAR CLIENTE
-- =============================================
CREATE OR REPLACE FUNCTION public.get_or_create_cliente(
  p_cpf_cnpj text,
  p_tipo_cadastro text,
  p_nome_completo text,
  p_telefone text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_cep text DEFAULT NULL,
  p_endereco text DEFAULT NULL,
  p_complemento text DEFAULT NULL,
  p_cidade text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente clientes%ROWTYPE;
  v_is_existing boolean := false;
BEGIN
  -- Buscar cliente existente
  SELECT * INTO v_cliente
  FROM clientes
  WHERE cpf_cnpj = p_cpf_cnpj;
  
  IF FOUND THEN
    v_is_existing := true;
    -- Atualizar dados se necessário
    UPDATE clientes
    SET 
      nome_completo = COALESCE(NULLIF(p_nome_completo, ''), nome_completo),
      telefone = COALESCE(NULLIF(p_telefone, ''), telefone),
      email = COALESCE(NULLIF(p_email, ''), email),
      cep = COALESCE(NULLIF(p_cep, ''), cep),
      endereco = COALESCE(NULLIF(p_endereco, ''), endereco),
      complemento = COALESCE(NULLIF(p_complemento, ''), complemento),
      cidade = COALESCE(NULLIF(p_cidade, ''), cidade),
      updated_at = now()
    WHERE id = v_cliente.id
    RETURNING * INTO v_cliente;
  ELSE
    -- Criar novo cliente
    INSERT INTO clientes (cpf_cnpj, tipo_cadastro, nome_completo, telefone, email, cep, endereco, complemento, cidade)
    VALUES (p_cpf_cnpj, p_tipo_cadastro, p_nome_completo, p_telefone, p_email, p_cep, p_endereco, p_complemento, p_cidade)
    RETURNING * INTO v_cliente;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'is_existing', v_is_existing,
    'cliente', jsonb_build_object(
      'id', v_cliente.id,
      'cpf_cnpj', v_cliente.cpf_cnpj,
      'tipo_cadastro', v_cliente.tipo_cadastro,
      'nome_completo', v_cliente.nome_completo,
      'telefone', v_cliente.telefone,
      'email', v_cliente.email,
      'cep', v_cliente.cep,
      'endereco', v_cliente.endereco,
      'complemento', v_cliente.complemento,
      'cidade', v_cliente.cidade
    )
  );
END;
$$;

-- =============================================
-- 5) FUNÇÃO PARA BUSCAR CLIENTE POR CPF/CNPJ
-- =============================================
CREATE OR REPLACE FUNCTION public.lookup_cliente_by_cpf_cnpj(p_cpf_cnpj text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente clientes%ROWTYPE;
BEGIN
  SELECT * INTO v_cliente
  FROM clientes
  WHERE cpf_cnpj = p_cpf_cnpj;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;
  
  RETURN jsonb_build_object(
    'found', true,
    'cliente', jsonb_build_object(
      'id', v_cliente.id,
      'cpf_cnpj', v_cliente.cpf_cnpj,
      'tipo_cadastro', v_cliente.tipo_cadastro,
      'nome_completo', v_cliente.nome_completo,
      'telefone', v_cliente.telefone,
      'email', v_cliente.email,
      'cep', v_cliente.cep,
      'endereco', v_cliente.endereco,
      'complemento', v_cliente.complemento,
      'cidade', v_cliente.cidade
    )
  );
END;
$$;

-- =============================================
-- 6) ATUALIZAR RESERVAS EXISTENTES COM CÓDIGO
-- =============================================
DO $$
DECLARE
  r record;
  seq int := 1001;
BEGIN
  FOR r IN SELECT id FROM reservas WHERE codigo IS NULL ORDER BY created_at LOOP
    UPDATE reservas SET codigo = 'VIVA' || seq WHERE id = r.id;
    seq := seq + 1;
  END LOOP;
END $$;