## Problema

O formulário `/trabalhe-conosco` está falhando ao enviar candidaturas porque a tabela `candidaturas` no banco **não possui GRANTs de acesso** para os papéis `anon` e `authenticated`.

A política RLS existente ("Public can submit job applications") permite o INSERT, mas o PostgREST (Data API) exige GRANTs explícitos além do RLS. Sem eles, qualquer tentativa retorna `permission denied for table candidaturas` — exatamente o sintoma relatado pelos candidatos.

## Correção (migração SQL)

Adicionar os GRANTs corretos para a tabela `candidaturas`:

- `anon` e `authenticated`: `INSERT` (permite envio público do formulário, alinhado à policy existente)
- `authenticated`: `SELECT, UPDATE, DELETE` (para os admins gerenciarem via painel — as policies já restringem a `has_role admin`)
- `service_role`: `ALL` (necessário para edge functions/admin)

## Verificação

Após aplicar a migração, testar o envio do formulário em `/trabalhe-conosco` e confirmar que a candidatura aparece em `admin/candidaturas`.

Nenhuma mudança de frontend é necessária — o código do formulário está correto.
