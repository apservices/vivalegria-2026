
-- 1) user_roles: admin-only writes
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) reservas: replace WITH CHECK (true) with a validated insert
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservas;
CREATE POLICY "Public can create reservations with required fields"
  ON public.reservas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    nome_completo IS NOT NULL AND length(btrim(nome_completo)) > 0
    AND email IS NOT NULL AND length(btrim(email)) > 0
    AND telefone IS NOT NULL AND length(btrim(telefone)) > 0
    AND cpf_cnpj IS NOT NULL AND length(btrim(cpf_cnpj)) > 0
    AND data_evento IS NOT NULL
    AND payment_status IS NULL
    AND payment_link IS NULL
    AND payment_session_id IS NULL
    AND contrato_url IS NULL
    AND status_venda IS NULL
  );

-- 3) storage RLS for private buckets (admin-only)
CREATE POLICY "Admins manage contratos - select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'contratos' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage contratos - insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'contratos' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage contratos - update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'contratos' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'contratos' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage contratos - delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'contratos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage base-clientes - select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'base-clientes' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-clientes - insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'base-clientes' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-clientes - update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'base-clientes' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'base-clientes' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-clientes - delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'base-clientes' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage base-prestadores - select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'base-prestadores' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-prestadores - insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'base-prestadores' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-prestadores - update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'base-prestadores' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'base-prestadores' AND public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage base-prestadores - delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'base-prestadores' AND public.has_role(auth.uid(), 'admin'::app_role));

-- 4) Revoke EXECUTE on internal SECURITY DEFINER helpers/triggers from public roles.
-- These are used only from RLS/triggers or from within other definer functions.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_casting_or_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_reclamacao_protocolo() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_reserva_codigo() FROM PUBLIC, anon, authenticated;

-- generate_satisfaction_token enforces admin internally; restrict to signed-in users only.
REVOKE EXECUTE ON FUNCTION public.generate_satisfaction_token(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_satisfaction_token(uuid) TO authenticated;
