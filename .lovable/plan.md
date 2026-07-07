## Correções em `/trabalhe-conosco`

### 1. Remover a "Candidatura Rápida"

Em `src/pages/TrabalheConosco.tsx`, remover:
- A seção final `<section>` com o formulário simplificado (nome, email, telefone, cidade, disponibilidade, experiência, sobre você).
- Todo o estado e a lógica associada: `formData`, `disponibilidade`, `handleChange`, `toggleDisponibilidade`, `handleSubmit`, `isSubmitting`, imports de `Input`, `Textarea`, `Label`, `Checkbox`, `useToast`, `supabase`, `maskPhone`, `trackFormSubmit`.

A página passa a ser puramente informativa (hero + benefícios + perfil desejado + diferenciais) e conduz o candidato **apenas** ao cadastro completo via o CTA já existente ("Fazer Cadastro Completo" → `/cadastro-recreador`).

### 2. Garantir tela de sucesso após envio do cadastro completo

O `/cadastro-recreador` já redireciona para `/obrigado?tipo=cadastro` após o insert. Vou:
- Verificar `src/pages/Obrigado.tsx` e, se necessário, ajustar o texto para exibir uma confirmação clara e específica quando `tipo=cadastro` (ex.: "Cadastro enviado com sucesso! Nossa equipe vai avaliar seu perfil e entrar em contato pelo WhatsApp.").
- Manter o toast de sucesso como reforço imediato.

Nada mais é alterado — o formulário completo, a validação por etapas e o insert no banco continuam funcionando como estão hoje.
