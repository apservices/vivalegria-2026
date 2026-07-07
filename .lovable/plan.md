## Achados da auditoria

### 1. Formulários públicos com RLS bloqueando o envio

| Formulário | Tabela | Problema |
|---|---|---|
| `/cadastro-recreador` | `profissionais` | Só existe policy de INSERT para **Admin**. Qualquer candidato tentando se cadastrar recebe erro de permissão. |
| `/avaliacao-evento` (recreadores logados) | `avaliacoes_evento` | Só existe policy de INSERT para **Admin**. Recreador não consegue enviar a própria avaliação do evento. |

Os demais formulários públicos já foram validados e estão OK: Contratar (`reservas`), Trabalhe Conosco (`candidaturas` — corrigido na rodada anterior), Pesquisa de Satisfação (`pesquisas_clientes` via RPC `submit_pesquisa_satisfacao`).

### 2. Dashboard `/admin` — KPIs desconectados do seletor de período

O seletor "7 dias / Mês Atual / Trimestre" no topo **não afeta a maioria dos KPIs**. Bugs concretos em `src/pages/admin/Dashboard.tsx`:

- `reservasNoPeriodo` é calculado mas **nunca é usado**.
- Card **"Reservas no Mês"** ignora o seletor e sempre mostra o mês corrente.
- Card **"Taxa de Confirmação"** calcula sobre **todas** as reservas históricas, não sobre o período selecionado.
- Card **"Cachês no Mês"** também hardcoded no mês corrente.
- Cards **"Pendentes"** e **"Confirmadas/Aprovadas"** são totais globais sem escopo — o usuário não sabe se representam o período ou o histórico.

## Correções

### A. Migração SQL — destravar formulários públicos

1. **`profissionais`** — adicionar policy de INSERT para `anon, authenticated` (com validações mínimas: nome, cpf, email, telefone preenchidos, `status = 'pendente'`).
2. **`avaliacoes_evento`** — adicionar policy de INSERT para `authenticated` que só aceita quando `profissional_id` pertence ao usuário logado (via `profissional_auth.user_id = auth.uid()`).

Nenhuma mudança em GRANTs — as tabelas já têm os grants corretos.

### B. Refatorar `src/pages/admin/Dashboard.tsx`

- Aplicar o `periodo` como filtro **único e consistente** em todos os KPIs de reservas, candidaturas e cachês.
- Renomear cards para deixar o escopo explícito:
  - "Reservas no Mês" → **"Reservas no período"**
  - "Cachês no Mês" → **"Cachês no período"**
  - Adicionar subtítulo "no período" em Pendentes, Confirmadas/Aprovadas e Taxa de Confirmação.
- **"Taxa de Confirmação"** passa a ser: `(confirmadas+aprovadas no período) / (total de reservas no período)`.
- Manter **"Eventos sem Casting"** como visão operacional global (todos os eventos futuros sem equipe), pois é ação urgente independente de período — apenas ajustar copy para deixar claro.
- Ajustar `getDateRange`: "7 dias" passa a ser realmente os últimos 7 dias corridos (hoje é `startOfWeek/endOfWeek`, que é ambíguo).

### C. Verificação final

Após aplicar, executar smoke-test:
- Enviar cadastro em `/cadastro-recreador` e confirmar linha em `admin/recreadores`.
- Como recreador logado, enviar avaliação em `/avaliacao-evento`.
- Alternar o seletor no Dashboard e conferir que **todos** os KPIs mudam de valor coerentemente.

Nenhuma alteração nos demais CRUDs admin, na tabela `clientes` ou nos fluxos de Casting/Financeiro/Reservas nesta rodada — o pedido foi focar em Dashboard/KPIs e formulários públicos.
