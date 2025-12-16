-- =========================================================
-- SUPABASE / POSTGRES MIGRATION (SAFE / IDEMPOTENT)
-- Remix + Vivalegria Base
-- =========================================================

-- -------------------------------
-- EXTENSIONS
-- -------------------------------
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- -------------------------------
-- SESSION CONFIG
-- -------------------------------
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- =========================================================
-- ENUM TYPES (SAFE CREATION)
-- =========================================================

-- app_role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'app_role'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.app_role AS ENUM (
      'admin',
      'moderator',
      'user'
    );
  END IF;
END
$$;

-- tipo_cadastro
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'tipo_cadastro'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.tipo_cadastro AS ENUM (
      'pf',
      'pj'
    );
  END IF;
END
$$;

-- tipo_cliente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'tipo_cliente'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.tipo_cliente AS ENUM (
      'existente',
      'novo'
    );
  END IF;
END
$$;

-- =========================================================
-- FUNCTIONS
-- =========================================================

-- has_role
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id uuid,
  _role public.app_role
) RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- update_reservas_updated_at
CREATE OR REPLACE FUNCTION public.update_reservas_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- TABLES
-- =========================================================

-- candidaturas
CREATE TABLE IF NOT EXISTS public.candidaturas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  cidade text NOT NULL,
  experiencia text,
  disponibilidade text[],
  sobre_voce text,
  status text DEFAULT 'pendente' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- reservas
CREATE TABLE IF NOT EXISTS public.reservas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  tipo_cliente public.tipo_cliente NOT NULL,
  tipo_cadastro public.tipo_cadastro NOT NULL,
  cpf_cnpj text NOT NULL,
  nome_completo text NOT NULL,
  telefone text NOT NULL,
  email text NOT NULL,
  cep text,
  endereco text,
  complemento text,
  cidade text,
  data_evento date NOT NULL,
  hora_inicio time NOT NULL,
  local_evento text NOT NULL,
  pacote_tipo text NOT NULL,
  numero_criancas integer DEFAULT 15 NOT NULL,
  oficinas_selecionadas text[] DEFAULT '{}'::text[],
  extras_selecionados text[] DEFAULT '{}'::text[],
  total_calculado numeric(10,2) NOT NULL,
  status text DEFAULT 'pendente' NOT NULL
);

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role),
  CONSTRAINT user_roles_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- =========================================================
-- TRIGGERS
-- =========================================================

DROP TRIGGER IF EXISTS update_reservas_updated_at ON public.reservas;

CREATE TRIGGER update_reservas_updated_at
BEFORE UPDATE ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.update_reservas_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- POLICIES (SAFE / IDEMPOTENT)
-- =========================================================

-- ======================
-- CANDIDATURAS
-- ======================

DROP POLICY IF EXISTS "Admins can view all applications" ON public.candidaturas;
CREATE POLICY "Admins can view all applications"
ON public.candidaturas
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update applications" ON public.candidaturas;
CREATE POLICY "Admins can update applications"
ON public.candidaturas
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete applications" ON public.candidaturas;
CREATE POLICY "Admins can delete applications"
ON public.candidaturas
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.candidaturas;
CREATE POLICY "Anyone can submit job applications"
ON public.candidaturas
FOR INSERT
WITH CHECK (true);


-- ======================
-- RESERVAS
-- ======================

DROP POLICY IF EXISTS "Admins can view all reservations" ON public.reservas;
CREATE POLICY "Admins can view all reservations"
ON public.reservas
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update reservations" ON public.reservas;
CREATE POLICY "Admins can update reservations"
ON public.reservas
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservas;
CREATE POLICY "Admins can delete reservations"
ON public.reservas
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservas;
CREATE POLICY "Anyone can create reservations"
ON public.reservas
FOR INSERT
WITH CHECK (true);


-- ======================
-- USER_ROLES
-- ======================

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- END OF MIGRATION
-- =========================================================
