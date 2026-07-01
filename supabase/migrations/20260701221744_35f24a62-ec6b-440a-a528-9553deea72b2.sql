
-- Tighten permissive INSERT policy on candidaturas: require valid public fields and block privileged fields
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.candidaturas;

CREATE POLICY "Public can submit job applications"
ON public.candidaturas
FOR INSERT
TO anon, authenticated
WITH CHECK (
  nome_completo IS NOT NULL AND length(btrim(nome_completo)) BETWEEN 3 AND 200
  AND email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 254
  AND telefone IS NOT NULL AND length(btrim(telefone)) BETWEEN 8 AND 30
  AND cidade IS NOT NULL AND length(btrim(cidade)) BETWEEN 2 AND 120
  AND (experiencia IS NULL OR length(experiencia) <= 5000)
  AND (sobre_voce IS NULL OR length(sobre_voce) <= 5000)
  AND status = 'pendente'
);
