## Problema

As mídias (vídeos do hero, "Quem Somos", "Oficinas" e o logo) usam URLs relativas do CDN interno da Lovable no formato `/__l5e/assets-v1/...`. Esse caminho é servido pela infra da Lovable no domínio `*.lovable.app`, mas **não é proxiado pelo domínio próprio `vivalegria.com.br`** (que está atrás de DNS/CDN externo). Resultado: no domínio custom, as requisições `/__l5e/...` retornam 404/HTML e nem os vídeos nem o logo carregam.

Arquivos afetados hoje:
- `public/videos/hero-vivalegria.mp4.asset.json` → usado em `src/components/VideoHero.tsx`
- `public/videos/quem-somos-bg.mp4.asset.json` → usado em `src/pages/QuemSomos.tsx`
- `public/videos/oficinas-bg.mp4.asset.json` → usado em `src/pages/Oficinas.tsx`
- `public/assets/vivalegria-logo.png.asset.json` → usado em `src/components/Header.tsx`

## Solução

Mover as 4 mídias para um **bucket público no Supabase próprio** do projeto (mesmo backend já usado pelo site) e trocar as URLs por links absolutos `https://<supabase>.supabase.co/storage/v1/object/public/...`. URLs absolutas funcionam em qualquer domínio (Lovable, custom, preview), sem depender do proxy `/__l5e/`.

## Passos

1. **Criar bucket público** `site-media` no Supabase próprio (via `supabase--storage_create_bucket`, `public=true`). Adicionar policy de SELECT público em `storage.objects` se necessário.
2. **Baixar as 4 mídias** do CDN atual da Lovable (via `curl` no sandbox) para `/tmp/`:
   - `hero-vivalegria.mp4`
   - `quem-somos-bg.mp4`
   - `oficinas-bg.mp4`
   - `vivalegria-logo.png`
3. **Fazer upload** dos 4 arquivos para o bucket `site-media` (via `supabase--storage_upload`).
4. **Substituir as referências** nos 4 arquivos-fonte:
   - Remover os imports `../../public/*.asset.json`.
   - Usar a URL pública absoluta do Supabase (constante local ou export centralizado em `src/lib/mediaUrls.ts`).
5. **Remover os `.asset.json`** de `public/videos/` e `public/assets/` — não são mais necessários.
6. **Validar build** local (`bun run build`) para garantir que nenhum import quebrou.
7. **Publicar** e pedir para você recarregar `https://vivalegria.com.br` com cache limpo (Ctrl+F5) para confirmar que hero, logo, "Quem Somos" e "Oficinas" exibem as mídias.

## Detalhes técnicos

- Bucket público + policy `SELECT` para role `anon` (arquivos são estáticos de marketing, sem dado sensível).
- Tamanhos: hero 9.6 MB, quem-somos 4.3 MB, oficinas 3.4 MB, logo 411 KB → dentro do limite padrão de upload.
- Alternativa considerada e descartada: hard-code da URL absoluta `https://vivalegria-2026.lovable.app/__l5e/...`. Funciona, mas cria dependência cross-origin do domínio Lovable e pode ser bloqueada por CORS em `<video>` em alguns navegadores. Supabase Storage é a rota limpa e consistente com o resto da infra do projeto.
- Nenhuma mudança de UI, layout ou lógica — só troca de origem das URLs.
