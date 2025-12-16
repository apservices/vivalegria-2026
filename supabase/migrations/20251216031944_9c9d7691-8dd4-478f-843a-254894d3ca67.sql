-- Fase 2: Adicionar coluna notas em clientes para CRM
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS notas TEXT;

-- Fase 2: Adicionar coluna descricao em admin_logs para timeline legível
ALTER TABLE public.admin_logs ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Adicionar coluna payload em admin_logs para detalhes técnicos em JSON
ALTER TABLE public.admin_logs ADD COLUMN IF NOT EXISTS payload JSONB DEFAULT '{}'::jsonb;

-- Criar índice para buscar logs por reserva_id (timeline)
CREATE INDEX IF NOT EXISTS idx_admin_logs_reserva_id ON public.admin_logs(reserva_id);

-- Criar índice para buscar logs por data
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);