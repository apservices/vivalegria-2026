
-- Fix clientes public exposure: remove public SELECT and INSERT policies.
-- Public lookups continue to work via the SECURITY DEFINER RPC lookup_cliente_by_cpf_cnpj
-- and the get_or_create_cliente RPC used by the booking flow.
DROP POLICY IF EXISTS "Public can lookup clients by cpf_cnpj" ON public.clientes;
DROP POLICY IF EXISTS "Anyone can insert clients" ON public.clientes;

-- Add an INSERT policy for admins (the existing policies cover SELECT/UPDATE/DELETE for admin).
DROP POLICY IF EXISTS "Admins can insert clients" ON public.clientes;
CREATE POLICY "Admins can insert clients"
ON public.clientes
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Revoke direct anon access to the clientes table; public lookups go through SECURITY DEFINER RPCs.
REVOKE ALL ON public.clientes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;

-- Defense-in-depth INSERT policy for pesquisas_clientes:
-- The SECURITY DEFINER RPC submit_pesquisa_satisfacao still does the inserts, but we add
-- a restrictive WITH CHECK so direct attempts require a valid, unused token row.
DROP POLICY IF EXISTS "Allow survey insertion via validated token" ON public.pesquisas_clientes;
CREATE POLICY "Allow survey insertion via validated token"
ON public.pesquisas_clientes
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tokens_pesquisa t
    WHERE t.token = pesquisas_clientes.token
      AND t.is_active = true
      AND t.used_at IS NULL
  )
);
