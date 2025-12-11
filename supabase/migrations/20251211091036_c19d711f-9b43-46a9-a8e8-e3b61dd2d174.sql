-- Tabela de profissionais (recreadores)
CREATE TABLE public.profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro TEXT UNIQUE,
  nome_completo TEXT NOT NULL,
  apelido TEXT,
  cpf TEXT,
  data_nascimento DATE,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  pix_chave TEXT,
  transporte TEXT,
  experiencia_tempo TEXT,
  faixa_etaria_experiencia TEXT,
  habilidades JSONB DEFAULT '{}',
  uniformes JSONB DEFAULT '{}',
  tem_cnpj BOOLEAN DEFAULT false,
  frequencia_desejada TEXT,
  interesse_pacotes BOOLEAN DEFAULT false,
  formacao TEXT,
  cursos TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de casting (alocação de profissionais para eventos)
CREATE TABLE public.evento_casting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id UUID REFERENCES public.reservas(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE SET NULL,
  profissional_nome_manual TEXT,
  cache DECIMAL(10,2),
  funcao TEXT DEFAULT 'Recreador',
  confirmado BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evento_casting ENABLE ROW LEVEL SECURITY;

-- RLS policies for profissionais (admin only)
CREATE POLICY "Admins can view all professionals" ON public.profissionais
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert professionals" ON public.profissionais
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update professionals" ON public.profissionais
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete professionals" ON public.profissionais
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for evento_casting (admin only)
CREATE POLICY "Admins can view all casting" ON public.evento_casting
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert casting" ON public.evento_casting
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update casting" ON public.evento_casting
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete casting" ON public.evento_casting
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for better performance
CREATE INDEX idx_profissionais_nome ON public.profissionais(nome_completo);
CREATE INDEX idx_profissionais_apelido ON public.profissionais(apelido);
CREATE INDEX idx_evento_casting_reserva ON public.evento_casting(reserva_id);

-- Trigger for updated_at
CREATE TRIGGER update_profissionais_updated_at
  BEFORE UPDATE ON public.profissionais
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reservas_updated_at();