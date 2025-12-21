# 📦 Documentação de Migração - Vivalegria

## Migração do Lovable Cloud para Supabase Próprio

Este documento contém todas as informações necessárias para migrar o projeto Vivalegria de um Supabase gerenciado pelo Lovable Cloud para um Supabase próprio.

---

## 📋 Índice

1. [Variáveis de Ambiente](#1-variáveis-de-ambiente)
2. [Configuração do Supabase Client](#2-configuração-do-supabase-client)
3. [Edge Functions](#3-edge-functions)
4. [Schema do Banco de Dados](#4-schema-do-banco-de-dados)
5. [RLS Policies](#5-rls-policies)
6. [Database Functions](#6-database-functions)
7. [Storage Buckets](#7-storage-buckets)
8. [Configuração de Auth](#8-configuração-de-auth)
9. [Checklist de Migração](#9-checklist-de-migração)

---

## 1. Variáveis de Ambiente

### Frontend (.env)

```env
# Supabase - Obrigatórias
VITE_SUPABASE_URL="https://SEU_PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="sua_anon_key_aqui"
VITE_SUPABASE_PROJECT_ID="SEU_PROJECT_REF"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_anon_key_aqui"

# Meta Pixel (opcional)
VITE_META_PIXEL_ID="858586050116261"
```

### Edge Functions (Supabase Dashboard → Settings → Edge Functions → Secrets)

| Secret Name | Descrição | Obrigatória |
|-------------|-----------|-------------|
| `SUPABASE_URL` | URL do projeto Supabase | ✅ Auto |
| `SUPABASE_ANON_KEY` | Chave anônima | ✅ Auto |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (para operações admin) | ✅ Auto |
| `STRIPE_SECRET` | Chave secreta do Stripe (sk_live_...) | ✅ Sim |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe (whsec_...) | ✅ Sim |
| `RESEND_API_KEY` | API key do Resend para emails | ⚠️ Opcional |
| `GOOGLE_PLACES_API` | API key Google Places | ⚠️ Opcional |
| `GEMINI_API` | API key Gemini AI | ⚠️ Opcional |

---

## 2. Configuração do Supabase Client

### Arquivo: `src/integrations/supabase/client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL and Anon Key must be defined in environment variables");
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
```

### Arquivo: `src/integrations/supabase/types.ts`

Este arquivo é **gerado automaticamente** pelo Supabase CLI. Para regenerar:

```bash
npx supabase gen types typescript --project-id SEU_PROJECT_REF > src/integrations/supabase/types.ts
```

---

## 3. Edge Functions

### Funções a Deployar

#### 3.1 `create-checkout-session`

**Localização:** `supabase/functions/create-checkout-session/index.ts`

**Secrets necessárias:**
- `STRIPE_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Config (supabase/config.toml):**
```toml
[functions.create-checkout-session]
verify_jwt = true
```

**Deploy:**
```bash
supabase functions deploy create-checkout-session --project-ref SEU_PROJECT_REF
```

---

#### 3.2 `stripe-webhook`

**Localização:** `supabase/functions/stripe-webhook/index.ts`

**Secrets necessárias:**
- `STRIPE_SECRET`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Config (supabase/config.toml):**
```toml
[functions.stripe-webhook]
verify_jwt = false  # Webhooks externos não têm JWT
```

**Deploy:**
```bash
supabase functions deploy stripe-webhook --project-ref SEU_PROJECT_REF
```

**Configurar Webhook no Stripe Dashboard:**
1. Acesse https://dashboard.stripe.com/webhooks
2. Adicione endpoint: `https://SEU_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
3. Eventos a escutar:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `payment_intent.payment_failed`
4. Copie o Signing Secret para `STRIPE_WEBHOOK_SECRET`

---

#### 3.3 `generate-contract` (placeholder)

**Localização:** `supabase/functions/generate-contract/index.ts`

```toml
[functions.generate-contract]
verify_jwt = true
```

---

#### 3.4 `send-notification` (placeholder)

**Localização:** `supabase/functions/send-notification/index.ts`

```toml
[functions.send-notification]
verify_jwt = true
```

---

## 4. Schema do Banco de Dados

### Enums

```sql
-- Tipos de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'casting', 'recreador');

-- Tipos de cadastro
CREATE TYPE public.tipo_cadastro AS ENUM ('pf', 'pj');

-- Tipos de cliente
CREATE TYPE public.tipo_cliente AS ENUM ('existente', 'novo');
```

### Tabelas

```sql
-- 1. USER_ROLES (crítica para autenticação)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. CLIENTES
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cpf_cnpj TEXT NOT NULL UNIQUE,
    tipo_cadastro TEXT NOT NULL,
    nome_completo TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    cep TEXT,
    endereco TEXT,
    complemento TEXT,
    cidade TEXT,
    notas TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 3. RESERVAS
CREATE TABLE public.reservas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT,
    cliente_id UUID REFERENCES public.clientes(id),
    cpf_cnpj TEXT NOT NULL,
    tipo_cadastro tipo_cadastro NOT NULL,
    tipo_cliente tipo_cliente NOT NULL,
    nome_completo TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    cep TEXT,
    endereco TEXT,
    complemento TEXT,
    cidade TEXT,
    endereco_residencial TEXT,
    endereco_evento_completo TEXT,
    local_evento TEXT NOT NULL,
    tipo_espaco TEXT,
    data_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    numero_criancas INTEGER NOT NULL DEFAULT 15,
    faixa_etaria TEXT,
    pacote_tipo TEXT NOT NULL,
    oficinas_selecionadas TEXT[] DEFAULT '{}',
    extras_selecionados TEXT[] DEFAULT '{}',
    observacoes_evento TEXT,
    total_calculado NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    status_venda TEXT DEFAULT 'lead',
    payment_status TEXT DEFAULT 'pendente',
    payment_link TEXT,
    payment_session_id TEXT,
    payment_expires_at TIMESTAMPTZ,
    payment_completed_at TIMESTAMPTZ,
    payment_method TEXT,
    contrato_url TEXT,
    contrato_gerado_em TIMESTAMPTZ,
    email_enviado_em TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

-- 4. PROFISSIONAIS
CREATE TABLE public.profissionais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    apelido TEXT,
    cpf TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    data_nascimento DATE,
    registro TEXT,
    status TEXT DEFAULT 'ativo',
    pix_chave TEXT,
    transporte TEXT,
    formacao TEXT,
    cursos TEXT,
    experiencia_tempo TEXT,
    experiencia_sucesso TEXT,
    faixa_etaria_experiencia TEXT,
    frequencia_desejada TEXT,
    por_que_recreacao TEXT,
    referencia_profissional TEXT,
    quer_mais_oportunidades TEXT,
    interesses_curto_longo_prazo TEXT,
    tem_cnpj BOOLEAN DEFAULT false,
    interesse_pacotes BOOLEAN DEFAULT false,
    habilidades JSONB DEFAULT '{}',
    uniformes JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

-- 5. PROFISSIONAL_AUTH (liga user_id ao profissional)
CREATE TABLE public.profissional_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (profissional_id)
);
ALTER TABLE public.profissional_auth ENABLE ROW LEVEL SECURITY;

-- 6. EVENTO_CASTING
CREATE TABLE public.evento_casting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id),
    profissional_id UUID REFERENCES public.profissionais(id),
    profissional_nome_manual TEXT,
    funcao TEXT DEFAULT 'Recreador',
    cache NUMERIC,
    confirmado BOOLEAN DEFAULT false,
    pago BOOLEAN DEFAULT false,
    pago_em TIMESTAMPTZ,
    observacoes TEXT,
    observacoes_pagamento TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.evento_casting ENABLE ROW LEVEL SECURITY;

-- 7. CANDIDATURAS
CREATE TABLE public.candidaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    cidade TEXT NOT NULL,
    experiencia TEXT,
    sobre_voce TEXT,
    disponibilidade TEXT[],
    status TEXT NOT NULL DEFAULT 'pendente',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;

-- 8. ADMIN_LOGS
CREATE TABLE public.admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_admin UUID,
    reserva_id UUID REFERENCES public.reservas(id),
    acao TEXT NOT NULL,
    descricao TEXT,
    detalhes JSONB DEFAULT '{}',
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- 9. AVALIACOES_EVENTO
CREATE TABLE public.avaliacoes_evento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id),
    profissional_id UUID REFERENCES public.profissionais(id),
    profissional_nome TEXT,
    respostas JSONB NOT NULL DEFAULT '{}',
    observacoes_admin TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.avaliacoes_evento ENABLE ROW LEVEL SECURITY;

-- 10. PESQUISAS_CLIENTES
CREATE TABLE public.pesquisas_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID REFERENCES public.reservas(id),
    token TEXT NOT NULL,
    respostas JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pesquisas_clientes ENABLE ROW LEVEL SECURITY;

-- 11. TOKENS_PESQUISA
CREATE TABLE public.tokens_pesquisa (
    token TEXT PRIMARY KEY,
    reserva_id UUID NOT NULL REFERENCES public.reservas(id),
    is_active BOOLEAN NOT NULL DEFAULT true,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tokens_pesquisa ENABLE ROW LEVEL SECURITY;

-- 12. RECLAMACOES
CREATE TABLE public.reclamacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reserva_id UUID NOT NULL REFERENCES public.reservas(id),
    protocolo TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    descricao TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'aberto',
    tratativa_interna TEXT,
    nome_cliente TEXT,
    telefone_cliente TEXT,
    responsavel_abertura TEXT,
    codigo_evento_externo TEXT,
    anexos TEXT[],
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reclamacoes ENABLE ROW LEVEL SECURITY;

-- 13. CONTRACT_TEMPLATES
CREATE TABLE public.contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    body_html TEXT NOT NULL,
    footer_html TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

-- 14. EMAIL_TEMPLATES
CREATE TABLE public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
```

---

## 5. RLS Policies

### Função Helper (CRÍTICA - criar primeiro!)

```sql
-- Função para verificar roles (evita recursão infinita)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para verificar se é casting ou admin
CREATE OR REPLACE FUNCTION public.is_casting_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'casting')
  )
$$;
```

### Policies por Tabela

```sql
-- ========== USER_ROLES ==========
CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ========== CLIENTES ==========
CREATE POLICY "Public can lookup clients by cpf_cnpj" ON public.clientes
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert clients" ON public.clientes
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update clients" ON public.clientes
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients" ON public.clientes
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== RESERVAS ==========
CREATE POLICY "Admins can view all reservations" ON public.reservas
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Casting can view reservas" ON public.reservas
FOR SELECT USING (is_casting_or_admin(auth.uid()));

CREATE POLICY "Anyone can create reservations" ON public.reservas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update reservations" ON public.reservas
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reservations" ON public.reservas
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== PROFISSIONAIS ==========
CREATE POLICY "Admins can view all professionals" ON public.profissionais
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Casting can view profissionais" ON public.profissionais
FOR SELECT USING (is_casting_or_admin(auth.uid()));

CREATE POLICY "Recreadores can view own profile" ON public.profissionais
FOR SELECT USING (
  has_role(auth.uid(), 'recreador') AND 
  id IN (SELECT profissional_id FROM profissional_auth WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can insert professionals" ON public.profissionais
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update professionals" ON public.profissionais
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete professionals" ON public.profissionais
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== PROFISSIONAL_AUTH ==========
CREATE POLICY "Admins can manage profissional_auth" ON public.profissional_auth
FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Recreadores can view own link" ON public.profissional_auth
FOR SELECT USING (user_id = auth.uid());

-- ========== EVENTO_CASTING ==========
CREATE POLICY "Admins can view all casting" ON public.evento_casting
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Casting can view evento_casting" ON public.evento_casting
FOR SELECT USING (is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can insert evento_casting" ON public.evento_casting
FOR INSERT WITH CHECK (is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can update evento_casting" ON public.evento_casting
FOR UPDATE USING (is_casting_or_admin(auth.uid()));

CREATE POLICY "Casting can delete evento_casting" ON public.evento_casting
FOR DELETE USING (is_casting_or_admin(auth.uid()));

CREATE POLICY "Recreadores can view own casting" ON public.evento_casting
FOR SELECT USING (
  has_role(auth.uid(), 'recreador') AND
  profissional_id IN (SELECT profissional_id FROM profissional_auth WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can insert casting" ON public.evento_casting
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update casting" ON public.evento_casting
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete casting" ON public.evento_casting
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== CANDIDATURAS ==========
CREATE POLICY "Anyone can submit job applications" ON public.candidaturas
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON public.candidaturas
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications" ON public.candidaturas
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete applications" ON public.candidaturas
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== ADMIN_LOGS ==========
CREATE POLICY "Admins can view all logs" ON public.admin_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert logs" ON public.admin_logs
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

-- ========== AVALIACOES_EVENTO ==========
CREATE POLICY "Admins can view all avaliacoes" ON public.avaliacoes_evento
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert avaliacoes" ON public.avaliacoes_evento
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update avaliacoes" ON public.avaliacoes_evento
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete avaliacoes" ON public.avaliacoes_evento
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== PESQUISAS_CLIENTES ==========
CREATE POLICY "Admins can view all pesquisas" ON public.pesquisas_clientes
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pesquisas" ON public.pesquisas_clientes
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pesquisas" ON public.pesquisas_clientes
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== TOKENS_PESQUISA ==========
CREATE POLICY "Admins can view all tokens" ON public.tokens_pesquisa
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tokens" ON public.tokens_pesquisa
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tokens" ON public.tokens_pesquisa
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tokens" ON public.tokens_pesquisa
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== RECLAMACOES ==========
CREATE POLICY "Admins can manage reclamacoes" ON public.reclamacoes
FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ========== CONTRACT_TEMPLATES ==========
CREATE POLICY "Admins can view all contract templates" ON public.contract_templates
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert contract templates" ON public.contract_templates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contract templates" ON public.contract_templates
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contract templates" ON public.contract_templates
FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ========== EMAIL_TEMPLATES ==========
CREATE POLICY "Admins can view all email templates" ON public.email_templates
FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email templates" ON public.email_templates
FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update email templates" ON public.email_templates
FOR UPDATE USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete email templates" ON public.email_templates
FOR DELETE USING (has_role(auth.uid(), 'admin'));
```

---

## 6. Database Functions

```sql
-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_reservas_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_reservas_updated_at
BEFORE UPDATE ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.update_reservas_updated_at();

-- Gerar código da reserva
CREATE OR REPLACE FUNCTION public.generate_reserva_codigo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence int;
  v_codigo text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 5) AS integer)), 1000) + 1
  INTO v_sequence
  FROM reservas
  WHERE codigo IS NOT NULL AND codigo LIKE 'VIVA%';
  
  v_codigo := 'VIVA' || v_sequence;
  NEW.codigo := v_codigo;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_reserva_codigo_trigger
BEFORE INSERT ON public.reservas
FOR EACH ROW
EXECUTE FUNCTION public.generate_reserva_codigo();

-- Gerar protocolo de reclamação
CREATE OR REPLACE FUNCTION public.generate_reclamacao_protocolo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence int;
  v_protocolo text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(protocolo FROM 10) AS integer)), 0) + 1
  INTO v_sequence
  FROM reclamacoes
  WHERE protocolo IS NOT NULL AND protocolo LIKE 'REC-' || to_char(now(), 'YYYY') || '-%';
  
  v_protocolo := 'REC-' || to_char(now(), 'YYYY') || '-' || LPAD(v_sequence::text, 4, '0');
  NEW.protocolo := v_protocolo;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_reclamacao_protocolo_trigger
BEFORE INSERT ON public.reclamacoes
FOR EACH ROW
EXECUTE FUNCTION public.generate_reclamacao_protocolo();

-- Lookup cliente por CPF/CNPJ
CREATE OR REPLACE FUNCTION public.lookup_cliente_by_cpf_cnpj(p_cpf_cnpj TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente clientes%ROWTYPE;
BEGIN
  SELECT * INTO v_cliente
  FROM clientes
  WHERE cpf_cnpj = p_cpf_cnpj;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('found', false);
  END IF;
  
  RETURN jsonb_build_object(
    'found', true,
    'cliente', jsonb_build_object(
      'id', v_cliente.id,
      'cpf_cnpj', v_cliente.cpf_cnpj,
      'tipo_cadastro', v_cliente.tipo_cadastro,
      'nome_completo', v_cliente.nome_completo,
      'telefone', v_cliente.telefone,
      'email', v_cliente.email,
      'cep', v_cliente.cep,
      'endereco', v_cliente.endereco,
      'complemento', v_cliente.complemento,
      'cidade', v_cliente.cidade
    )
  );
END;
$$;

-- Get or Create Cliente
CREATE OR REPLACE FUNCTION public.get_or_create_cliente(
  p_cpf_cnpj TEXT,
  p_tipo_cadastro TEXT,
  p_nome_completo TEXT,
  p_telefone TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_cep TEXT DEFAULT NULL,
  p_endereco TEXT DEFAULT NULL,
  p_complemento TEXT DEFAULT NULL,
  p_cidade TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente clientes%ROWTYPE;
  v_is_existing boolean := false;
BEGIN
  SELECT * INTO v_cliente
  FROM clientes
  WHERE cpf_cnpj = p_cpf_cnpj;
  
  IF FOUND THEN
    v_is_existing := true;
    UPDATE clientes
    SET 
      nome_completo = COALESCE(NULLIF(p_nome_completo, ''), nome_completo),
      telefone = COALESCE(NULLIF(p_telefone, ''), telefone),
      email = COALESCE(NULLIF(p_email, ''), email),
      cep = COALESCE(NULLIF(p_cep, ''), cep),
      endereco = COALESCE(NULLIF(p_endereco, ''), endereco),
      complemento = COALESCE(NULLIF(p_complemento, ''), complemento),
      cidade = COALESCE(NULLIF(p_cidade, ''), cidade),
      updated_at = now()
    WHERE id = v_cliente.id
    RETURNING * INTO v_cliente;
  ELSE
    INSERT INTO clientes (cpf_cnpj, tipo_cadastro, nome_completo, telefone, email, cep, endereco, complemento, cidade)
    VALUES (p_cpf_cnpj, p_tipo_cadastro, p_nome_completo, p_telefone, p_email, p_cep, p_endereco, p_complemento, p_cidade)
    RETURNING * INTO v_cliente;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'is_existing', v_is_existing,
    'cliente', jsonb_build_object(
      'id', v_cliente.id,
      'cpf_cnpj', v_cliente.cpf_cnpj,
      'tipo_cadastro', v_cliente.tipo_cadastro,
      'nome_completo', v_cliente.nome_completo,
      'telefone', v_cliente.telefone,
      'email', v_cliente.email,
      'cep', v_cliente.cep,
      'endereco', v_cliente.endereco,
      'complemento', v_cliente.complemento,
      'cidade', v_cliente.cidade
    )
  );
END;
$$;

-- Gerar token de pesquisa de satisfação
CREATE OR REPLACE FUNCTION public.generate_satisfaction_token(p_reserva_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token text;
  v_exists boolean;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Apenas administradores podem gerar tokens';
  END IF;
  
  LOOP
    v_token := encode(gen_random_bytes(16), 'hex');
    SELECT EXISTS(SELECT 1 FROM tokens_pesquisa WHERE token = v_token) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  INSERT INTO tokens_pesquisa (token, reserva_id)
  VALUES (v_token, p_reserva_id);
  
  RETURN v_token;
END;
$$;

-- Validar token de pesquisa
CREATE OR REPLACE FUNCTION public.validate_pesquisa_token(p_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_record tokens_pesquisa%ROWTYPE;
  v_reserva reservas%ROWTYPE;
BEGIN
  SELECT * INTO v_token_record
  FROM tokens_pesquisa
  WHERE token = p_token;
  
  IF v_token_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Token inválido');
  END IF;
  
  IF NOT v_token_record.is_active OR v_token_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Este link já foi utilizado');
  END IF;
  
  SELECT * INTO v_reserva
  FROM reservas
  WHERE id = v_token_record.reserva_id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'reserva_id', v_token_record.reserva_id,
    'cliente_nome', COALESCE(v_reserva.nome_completo, ''),
    'data_evento', COALESCE(v_reserva.data_evento::text, '')
  );
END;
$$;

-- Submeter pesquisa de satisfação
CREATE OR REPLACE FUNCTION public.submit_pesquisa_satisfacao(p_token TEXT, p_respostas JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token_record tokens_pesquisa%ROWTYPE;
  v_new_id uuid;
BEGIN
  SELECT * INTO v_token_record
  FROM tokens_pesquisa
  WHERE token = p_token;
  
  IF v_token_record IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Token inválido');
  END IF;
  
  IF NOT v_token_record.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'Este link já foi utilizado');
  END IF;
  
  IF v_token_record.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Pesquisa já foi respondida');
  END IF;
  
  INSERT INTO pesquisas_clientes (reserva_id, token, respostas)
  VALUES (v_token_record.reserva_id, p_token, p_respostas)
  RETURNING id INTO v_new_id;
  
  UPDATE tokens_pesquisa
  SET is_active = false, used_at = now()
  WHERE token = p_token;
  
  RETURN jsonb_build_object('success', true, 'id', v_new_id);
END;
$$;
```

---

## 7. Storage Buckets

```sql
-- Criar buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('contratos', 'contratos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('base-clientes', 'base-clientes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('base-prestadores', 'base-prestadores', false);

-- Policies para contratos
CREATE POLICY "Admins can upload contracts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'contratos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view contracts" ON storage.objects
FOR SELECT USING (bucket_id = 'contratos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contracts" ON storage.objects
FOR UPDATE USING (bucket_id = 'contratos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contracts" ON storage.objects
FOR DELETE USING (bucket_id = 'contratos' AND has_role(auth.uid(), 'admin'));
```

---

## 8. Configuração de Auth

### No Supabase Dashboard → Authentication → Settings

1. **Site URL:** `https://www.vivalegria.com.br` (ou URL do Lovable)
2. **Redirect URLs:**
   - `https://www.vivalegria.com.br/*`
   - `https://SEU_PROJETO.lovable.app/*`
   - `http://localhost:5173/*` (dev)

3. **Email Templates:** Configurar em português
4. **Confirm Email:** Pode desativar para testes
5. **MFA:** Ativar TOTP para admins

### Criar Primeiro Admin

```sql
-- Após criar o usuário no Auth, adicione a role:
INSERT INTO public.user_roles (user_id, role)
VALUES ('UUID_DO_USUARIO', 'admin');
```

---

## 9. Checklist de Migração

### Pré-Migração
- [ ] Exportar código para GitHub
- [ ] Criar projeto Supabase próprio
- [ ] Anotar Project Ref e chaves

### Banco de Dados
- [ ] Criar enums
- [ ] Criar tabelas (na ordem correta - user_roles primeiro)
- [ ] Criar funções helper (has_role, is_casting_or_admin)
- [ ] Criar triggers
- [ ] Criar RLS policies
- [ ] Criar storage buckets

### Edge Functions
- [ ] Deploy `create-checkout-session`
- [ ] Deploy `stripe-webhook`
- [ ] Configurar secrets no Supabase
- [ ] Configurar webhook no Stripe Dashboard

### Frontend
- [ ] Criar novo projeto Lovable SEM Cloud
- [ ] Configurar `.env` com novas credenciais
- [ ] Atualizar `client.ts` se necessário
- [ ] Regenerar `types.ts`

### Testes
- [ ] Login admin funciona
- [ ] Login recreador (magic link) funciona
- [ ] RoleGuard bloqueia acessos
- [ ] Criar reserva funciona
- [ ] Pagamento Stripe funciona
- [ ] Site público carrega normalmente

### Pós-Migração
- [ ] Configurar URLs de redirect
- [ ] Testar em produção
- [ ] Migrar dados (se necessário)

---

## 📞 Suporte

Em caso de dúvidas sobre a migração, consulte:
- [Documentação Supabase](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
