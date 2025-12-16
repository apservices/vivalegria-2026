-- =========================================================
-- CORREÇÃO FINAL: ÍNDICE admin_logs.reserva_id
-- Migration neutralizada + coluna e índice seguros
-- =========================================================

-- 1. Garantir que a coluna reserva_id exista em admin_logs
ALTER TABLE public.admin_logs
ADD COLUMN IF NOT EXISTS reserva_id uuid
REFERENCES public.reservas(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.admin_logs.reserva_id IS 'Vínculo opcional com reserva para timeline de auditoria';

-- 2. Criar o índice SOMENTE se a coluna reserva_id existir
-- (essa verificação no information_schema evita o erro 42703 para sempre)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'admin_logs'
      AND column_name = 'reserva_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_admin_logs_reserva_id
    ON public.admin_logs(reserva_id);
  END IF;
END
$$;