-- Parte 1: Adicionar novos roles ao enum e criar tabelas básicas
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'casting';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'recreador';