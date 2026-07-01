## Objetivo
Implementar SEO completo por página: metadata única (title/description/canonical), Open Graph + Twitter tags, JSON-LD específico por rota, e sitemap.xml dinâmico.

## Escopo — Páginas a otimizar

**Institucionais/comerciais:**
- `/` (Home) — já tem SEO/JsonLd, revisar
- `/pacotes` — Product schema
- `/oficinas` — Service schema
- `/quem-somos` — AboutPage
- `/contato` — ContactPage
- `/corporativo` — Service schema
- `/contratar` — WebPage
- `/guia-para-pais` — Article
- `/trabalhe-conosco` — JobPosting

**Landing pages SEO (alta prioridade):**
- `/festa-infantil` — LocalBusiness + Service
- `/recreacao-infantil-sp` — LocalBusiness + FAQ
- `/eventos-corporativos-infantis` — Service
- `/orcamento-lp` — WebPage

**Legais:**
- `/termos`, `/privacidade` — WebPage + noindex opcional

**Excluídas do sitemap (noindex):** `/admin/*`, `/recreador/*`, `/avaliacao-evento`, `/pesquisa-satisfacao`, `/redefinir-senha`, `/obrigado`, `/cadastro-recreador`, `/404`.

## Implementação

### 1. Estender componente `<SEO>` (`src/components/SEO.tsx`)
Adicionar props: `ogType`, `ogImage` absoluto, `noindex`, `article` (published/modified date). Manter defaults atuais. Garantir `og:url` e `canonical` sempre auto-referentes usando `https://vivalegria-2026.lovable.app`.

### 2. Estender `<JsonLd>` (`src/components/JsonLd.tsx`)
Adicionar types: `service`, `article`, `about-page`, `contact-page`, `breadcrumb`, `job-posting`. Aceitar `data` genérico para casos custom. Cada página injeta `<JsonLd type="breadcrumb" ... />` além do schema principal.

### 3. Adicionar `<SEO>` + `<JsonLd>` em cada página listada
Padrão por página:
```tsx
<SEO title="..." description="..." canonical="/rota" ogImage="..." />
<JsonLd type="breadcrumb" data={{ items: [...] }} />
<JsonLd type="service" ... />
```
Reescrever títulos/descrições de páginas hoje genéricas (`FestaInfantil`, `OrcamentoLP`, landing pages duplicadas). Copy focado em SP + bairros (Vila Mariana, Moema, Santo Amaro, Morumbi, Pinheiros, Jardins, ABC).

### 4. Sitemap gerado no build
Criar `scripts/generate-sitemap.ts` com `BASE_URL = "https://vivalegria-2026.lovable.app"` listando apenas rotas públicas indexáveis (14 entradas). Wire via `predev` e `prebuild` no `package.json`. Escreve `public/sitemap.xml`.

### 5. `public/robots.txt`
Adicionar `Sitemap: https://vivalegria-2026.lovable.app/sitemap.xml` ao final, preservando blocos existentes. Adicionar `Disallow: /admin/`, `/recreador/`, `/avaliacao-evento`, `/pesquisa-satisfacao`, `/obrigado`, `/redefinir-senha`.

### 6. `index.html`
Confirmar canonical/OG sitewide apontando para o domínio publicado; remover canonical estático se conflitar com Helmet (Helmet já é o dono per-route). Manter apenas os defaults como fallback para crawlers sem JS.

## Detalhes técnicos

- **Duplicatas detectadas:** existem `src/pages/FestaInfantil.tsx` **e** `src/pages/festa-infantil/index.tsx`, idem para `recreacao-infantil-sp`, `eventos-corporativos-infantis`, `orcamento-lp`. Verificar qual está roteada no `App.tsx` e aplicar SEO apenas nela (não duplicar). Não deletar a outra sem confirmação.
- **og:image absoluto:** manter `/logo-vivalegria.jpg` (já existe em `public/`) como default. Hosting Lovable injeta preview automático quando ausente.
- **Sem SSR:** Helmet muda `<head>` no cliente — Googlebot processa; LinkedIn/Slack/Facebook usam apenas `index.html`. Documentar isso no closing.

## Fora do escopo
- Geração de novas imagens OG por página (usa fallback do hosting).
- Alteração de rotas ou remoção das páginas duplicadas.
- Reescrita de conteúdo/copy fora dos meta tags.
- Novos schemas para páginas admin/recreador.

## Entregáveis
- `src/components/SEO.tsx` estendido
- `src/components/JsonLd.tsx` estendido
- ~14 páginas com `<SEO>` + `<JsonLd>` adequados
- `scripts/generate-sitemap.ts` novo
- `package.json` com hooks `predev`/`prebuild`
- `public/robots.txt` atualizado
- `public/sitemap.xml` gerado
