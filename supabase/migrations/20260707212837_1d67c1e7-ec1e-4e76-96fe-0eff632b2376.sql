-- 1) Permitir que candidatos enviem cadastro de recreador (com validações básicas)
CREATE POLICY "Public can submit recreador applications"
ON public.profissionais
FOR INSERT
TO anon, authenticated
WITH CHECK (
  nome_completo IS NOT NULL
  AND length(btrim(nome_completo)) BETWEEN 3 AND 200
  AND cpf IS NOT NULL
  AND length(btrim(cpf)) BETWEEN 11 AND 20
  AND email IS NOT NULL
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND telefone IS NOT NULL
  AND length(btrim(telefone)) BETWEEN 8 AND 30
  AND status = 'pendente'
);

-- 2) Permitir que recreadores enviem avaliação do próprio evento
CREATE POLICY "Recreadores can insert own avaliacoes"
ON public.avaliacoes_evento
FOR INSERT
TO authenticated
WITH CHECK (
  profissional_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.profissional_auth pa
    WHERE pa.profissional_id = avaliacoes_evento.profissional_id
      AND pa.user_id = auth.uid()
  )
);