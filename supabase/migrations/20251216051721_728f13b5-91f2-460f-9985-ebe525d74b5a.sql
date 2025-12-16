-- Adicionar colunas faltantes na tabela profissionais
ALTER TABLE public.profissionais 
  ADD COLUMN IF NOT EXISTS por_que_recreacao text,
  ADD COLUMN IF NOT EXISTS experiencia_sucesso text,
  ADD COLUMN IF NOT EXISTS referencia_profissional text,
  ADD COLUMN IF NOT EXISTS quer_mais_oportunidades text,
  ADD COLUMN IF NOT EXISTS interesses_curto_longo_prazo text;

-- Adicionar colunas faltantes na tabela reclamacoes
ALTER TABLE public.reclamacoes 
  ADD COLUMN IF NOT EXISTS responsavel_abertura text,
  ADD COLUMN IF NOT EXISTS nome_cliente text,
  ADD COLUMN IF NOT EXISTS telefone_cliente text,
  ADD COLUMN IF NOT EXISTS anexos text[],
  ADD COLUMN IF NOT EXISTS codigo_evento_externo text;