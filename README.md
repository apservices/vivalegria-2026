Vivalegria Recreação Infantil - 2026

Bem-vindo ao repositório oficial do site Vivalegria.com.br! Este projeto é uma plataforma premium de recreação infantil em São Paulo, focada em festas de aniversário, eventos corporativos (como SIPAT e Dia das Crianças em empresas), casamentos e brincadeiras personalizadas. Com pacotes Clássico e Select a partir de R$589, o site enfatiza conversão rápida via WhatsApp, SEO local e uma experiência emocional para pais, noivos e empresas.
O site é construído com tecnologias modernas para garantir agilidade, segurança e escalabilidade, integrando automações como secretária IA (n8n/Retell) e CRM básico via Supabase.
Descrição do Projeto
Vivalegria oferece recreação infantil premium com:

Pacotes Personalizados: Clássico (atividades padrão) e Select (oficinas temáticas como slime e pintura facial).
Cobertura: Toda São Paulo e ABC Paulista, com foco em bairros como Vila Mariana, Moema, Jardins e mais.
Diferenciais: Rácio de segurança 1 recreador para 15 crianças, +500 eventos realizados, 100% satisfação garantida.
Funcionalidades Principais: Calculadora de preços dinâmica, formulários com redirecionamento WhatsApp personalizado, blog educativo ("Guia para Pais"), depoimentos reais e FAQ.

O backend usa Supabase para DB real-time (reservas, casting, clientes), com edge functions para geração de contratos PDF. O admin (/admin) inclui dashboard com KPIs, gerenciamento de reservas e financeiro.
Versão Atual: 2026 – Atualizações incluem preços ajustados, blog estratégico e consent mode LGPD.
Recursos e Funcionalidades
Páginas Públicas

Home (/): Hero com destaques, calculadora de preços, depoimentos, blog teasers e CTA WhatsApp.
Pacotes (/pacotes): Detalhes de Clássico/Select + extras, com calculadora interativa.
Contato/Corporativo (/contato, /corporativo): Formulários para leads B2B, com mensagens WhatsApp contextualizadas.
Guia para Pais (/guia-para-pais): Blog com artigos como "10 Brincadeiras que as Crianças Amam" para SEO orgânico.
Política de Privacidade (/privacidade): Conformidade LGPD com consent mode v2 e banner de cookies.

Área Admin (/admin – Protegida)

Dashboard: KPIs (reservas/mês, NPS médio, receita projetada).
Reservas: Kanban pipeline, timeline visual, export CSV.
Clientes CRM: Modais com resumo (eventos, notas, status recorrente/dormido), anti-duplicidade CPF.
Casting: Alocação recreadores + cachês, perfil individual.
Financeiro: Status pagamentos/reembolsos, histórico por evento.
Logs: Auditoria geral com JSONB payloads.

Integrações

WhatsApp: CTAs com mensagens pré-preenchidas (ex: "Quero pacote Select para [data] com [crianças]").
Supabase: Tabelas core (reservas, evento_casting, avaliacoes), RLS segurança, buckets para contratos/PDFs.
Analytics: Consent Mode v2, GA4 tracking (lp_view, form_submit), Meta Pixel.
Automações: n8n para e-mails (welcome/pós-evento), Telegram notificações (nova reserva, NPS<7).

Tecnologias Utilizadas

Frontend: React 18+, Vite, TypeScript, Tailwind CSS, shadcn-ui (components premium).
Backend/DB: Supabase (DB, Auth, Storage, Edge Functions).
Automações: n8n, Retell AI (voz), Chatwoot (chat).
Analytics/Segurança: GA4, Meta Pixel, Consent Mode v2, 2FA (pendente full).
Outros: Chart.js (gráficos KPIs), pdf-lib (geração contratos), Lottie (animações futuras).

Instalação e Setup Local
Requisitos: Node.js 18+ e npm.

Clone o repositório:textgit clone https://github.com/apservices/vivalegria-2026.git
cd vivalegria-2026
Instale dependências:textnpm install
Configure ambiente (copie .env.example para .env e preencha chaves Supabase, WhatsApp, etc.):textSUPABASE_URL=[your_supabase_url](https://vsmyjrbtollbzviquutv.supabase.co)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzbXlqcmJ0b2xsYnp2aXF1dXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDM2MDgsImV4cCI6MjA4MTQxOTYwOH0.LCGArBii_DE_FQJjMcv2i_58nKXCW5HcB_qgQfEkxI4
WHATSAPP_NUMBER=+5511965982251
Rode localmente:textnpm run devAcesse em http://localhost:5173.
Para build produção:textnpm run build

Uso

Desenvolvimento: Use Lovable.dev para edições via prompt (commits auto no repo).
Admin Acesso: /admin requer login Supabase (auth implementado; 2FA pendente).
Teste Conversão: Preencha /contratar e verifique redirecionamento WhatsApp.
KPIs: No admin/dashboard, queries Supabase para métricas (ex: NPS médio, receita/mês).

Deploy

Via Lovable: Acesse Lovable Project > Share > Publish. Suporte a custom domain (vivalegria.com.br já apontado).
Via Vercel: Integre repo ao Vercel > Deploy. Auto-build na main.
Custom Domain: Em Lovable > Settings > Domains. Docs: Custom Domain Guide.

O site atual está hospedado no Lovable/Vercel com HTTPS e CDN para performance.
Contribuições
Contribuições são bem-vindas! Siga estes passos:

Fork o repo.
Crie branch: git checkout -b feature/nome-da-feature.
Commit: git commit -m "Adiciona [feature]".
Push: git push origin feature/nome-da-feature.
Abra Pull Request.

Prioridades atuais: Integração Telegram notificações, mobile admin drawer, schema SEO para pacotes.
Licença
MIT License. Veja LICENSE para detalhes.

Contato: contato@vivalegria.com.br | WhatsApp: +55 11 96598-2251
Atualizado em 16/12/2025 – Versão 2026 com foco em eventos corporativos e automações. 🎉
