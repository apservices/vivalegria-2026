-- Tabela para vincular recreadores a usuários auth
CREATE TABLE IF NOT EXISTS public.profissional_auth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  profissional_id uuid REFERENCES public.profissionais(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Tabela de reclamações
CREATE TABLE IF NOT EXISTS public.reclamacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id uuid REFERENCES public.reservas(id) ON DELETE CASCADE NOT NULL,
  protocolo text UNIQUE NOT NULL,
  categoria text NOT NULL,
  descricao text NOT NULL,
  status text DEFAULT 'aberto' NOT NULL,
  tratativa_interna text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Adicionar campos de negócio à reservas
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS tipo_espaco text;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS faixa_etaria text;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS observacoes_evento text;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS endereco_residencial text;
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS endereco_evento_completo text;

-- RLS para profissional_auth
ALTER TABLE public.profissional_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage profissional_auth" 
ON public.profissional_auth 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recreadores can view own link" 
ON public.profissional_auth 
FOR SELECT 
USING (user_id = auth.uid());

-- RLS para reclamacoes
ALTER TABLE public.reclamacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage reclamacoes" 
ON public.reclamacoes 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Função para gerar protocolo único de reclamação
CREATE OR REPLACE FUNCTION public.generate_reclamacao_protocolo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_sequence int;
  v_protocolo text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(protocolo FROM 10) AS integer)), 0) + 1
  INTO v_sequence
  FROM reclamacoes
  WHERE protocolo IS NOT NULL AND protocolo LIKE 'REC-' || to_char(now(), 'YYYY') || '-%';
  
  v_protocolo := 'REC-' || to_char(now(), 'YYYY') || '-' || LPAD(v_sequence::text, 4, '0');
  NEW.protocolo := v_protocolo;
  
  RETURN NEW;
END;
$$;

-- Trigger para gerar protocolo automaticamente
DROP TRIGGER IF EXISTS generate_reclamacao_protocolo_trigger ON public.reclamacoes;
CREATE TRIGGER generate_reclamacao_protocolo_trigger
  BEFORE INSERT ON public.reclamacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_reclamacao_protocolo();

-- Função para verificar se usuário é casting ou admin
CREATE OR REPLACE FUNCTION public.is_casting_or_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'casting')
  )
$$;

-- RLS para casting ver reservas (somente SELECT)
CREATE POLICY "Casting can view reservas" 
ON public.reservas 
FOR SELECT 
USING (public.is_casting_or_admin(auth.uid()));

-- RLS para casting gerenciar evento_casting
CREATE POLICY "Casting can view evento_casting" 
ON public.evento_casting 
FOR SELECT 
USING (public.is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can insert evento_casting" 
ON public.evento_casting 
FOR INSERT 
WITH CHECK (public.is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can update evento_casting" 
ON public.evento_casting 
FOR UPDATE 
USING (public.is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can delete evento_casting" 
ON public.evento_casting 
FOR DELETE 
USING (public.is_casting_or_admin(auth.uid()));

-- RLS para recreadores verem próprios dados de casting
CREATE POLICY "Recreadores can view own casting" 
ON public.evento_casting 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'recreador') AND 
  profissional_id IN (
    SELECT profissional_id FROM public.profissional_auth WHERE user_id = auth.uid()
  )
);

-- Casting pode ver profissionais
CREATE POLICY "Casting can view profissionais" 
ON public.profissionais 
FOR SELECT 
USING (public.is_casting_or_admin(auth.uid()));

-- Recreadores podem ver próprio perfil
CREATE POLICY "Recreadores can view own profile" 
ON public.profissionais 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'recreador') AND 
  id IN (
    SELECT profissional_id FROM public.profissional_auth WHERE user_id = auth.uid()
  )
);