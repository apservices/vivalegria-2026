## Problema

O build no Vercel falha porque o `index.html` no repositório GitHub está com encoding corrompido (mojibake duplo UTF-8 → Latin1):

- `Recreação` virou `RecreaÃƒÂ§ÃƒÂ£o`
- `☎️` virou caracteres de controle inválidos que o parse5 (parser HTML do Vite) rejeita com `control-character-in-input-stream`

No sandbox o arquivo aparece correto, mas o que está commitado no GitHub está corrompido. Provavelmente houve um commit feito fora do Lovable (editor que salvou como Latin1) ou um merge ruim.

## Correção

1. **Reescrever `index.html`** salvando explicitamente em UTF-8 limpo, com:
   - Todos os acentos corretos (Recreação, São Paulo, Clássico, André)
   - Remover o emoji `☎️` da meta description (é o que gera o control-character) e substituir por texto simples `Tel:` — emojis em meta tags são frágeis e não agregam SEO
   - Manter toda a estrutura atual (GTM, Consent Mode, Pixel, GA)

2. **Verificar `.gitattributes`** para garantir `*.html text eol=lf working-tree-encoding=UTF-8` e prevenir nova corrupção.

3. **Verificar o workflow `.github/workflows/encoding-check.yml`** que já existe — confirmar que está rodando e, se necessário, ajustar para barrar commits com mojibake antes do deploy.

4. **Rodar build local** (`npm run build`) para validar antes de pedir novo deploy.

## Detalhes técnicos

- O parser HTML (parse5) trata bytes `0x80-0x9F` não-mapeados como control characters fatais. O emoji `☎️` (U+260E U+FE0F) quando interpretado como Latin1 e re-encodado como UTF-8 produz a sequência `Ã¢ËœÅ½Ã¯Â¸Â`, onde `Ëœ` (0x98) é control char → erro.
- A correção é puramente no arquivo `index.html` na raiz. Nenhum outro arquivo precisa mudar para destravar o deploy.

## Entrega

- `index.html` reescrito em UTF-8 válido, sem emoji nas metas.
- Confirmação de `.gitattributes` protegendo o encoding.
- Build local validado.
