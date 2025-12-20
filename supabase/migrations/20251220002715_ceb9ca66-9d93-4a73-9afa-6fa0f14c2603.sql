-- =========================================================
-- CAMPOS DE PAGAMENTO STRIPE - TABELA RESERVAS
-- =========================================================

-- Status do pagamento
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pendente';

-- Link de pagamento Stripe
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_link TEXT;

-- Session ID do Stripe Checkout
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_session_id TEXT;

-- Data de expiração do link de pagamento
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_expires_at TIMESTAMPTZ;

-- Data de conclusão do pagamento
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ;

-- Método de pagamento (card, pix, boleto)
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Status da venda (lead, pre_reserva, confirmado, realizado, cancelado)
ALTER TABLE public.reservas ADD COLUMN IF NOT EXISTS status_venda TEXT DEFAULT 'lead';

-- Comentários para documentação
COMMENT ON COLUMN public.reservas.payment_status IS 'Status do pagamento: pendente, pago, expirado, cancelado';
COMMENT ON COLUMN public.reservas.payment_link IS 'URL do Stripe Checkout para pagamento';
COMMENT ON COLUMN public.reservas.payment_session_id IS 'ID da sessão Stripe Checkout';
COMMENT ON COLUMN public.reservas.payment_expires_at IS 'Data de expiração do link de pagamento (72h)';
COMMENT ON COLUMN public.reservas.payment_completed_at IS 'Data/hora em que o pagamento foi confirmado';
COMMENT ON COLUMN public.reservas.payment_method IS 'Método de pagamento utilizado: card, pix, boleto';
COMMENT ON COLUMN public.reservas.status_venda IS 'Status da venda: lead, pre_reserva, confirmado, realizado, cancelado';

-- Índice para queries de pagamento
CREATE INDEX IF NOT EXISTS idx_reservas_payment_status ON public.reservas(payment_status);
CREATE INDEX IF NOT EXISTS idx_reservas_status_venda ON public.reservas(status_venda);
CREATE INDEX IF NOT EXISTS idx_reservas_payment_session_id ON public.reservas(payment_session_id);