-- BLOCO 3.2: Campos de Negócio no Agendamento
-- Adicionar campos estratégicos do evento na tabela reservas

ALTER TABLE reservas 
  ADD COLUMN IF NOT EXISTS tipo_espaco text,
  ADD COLUMN IF NOT EXISTS faixa_etaria text,
  ADD COLUMN IF NOT EXISTS observacoes_evento text,
  ADD COLUMN IF NOT EXISTS endereco_residencial text,
  ADD COLUMN IF NOT EXISTS endereco_evento_completo text;

-- Comentários para documentação
COMMENT ON COLUMN reservas.tipo_espaco IS 'Tipo de espaço: aberto, fechado, misto';
COMMENT ON COLUMN reservas.faixa_etaria IS 'Faixa etária das crianças: 0-3, 4-6, 7-10, misto';
COMMENT ON COLUMN reservas.observacoes_evento IS 'Observações especiais (alergias, regras do local, etc)';
COMMENT ON COLUMN reservas.endereco_residencial IS 'Endereço residencial do contratante (distinto do evento)';
COMMENT ON COLUMN reservas.endereco_evento_completo IS 'Endereço completo do local do evento';