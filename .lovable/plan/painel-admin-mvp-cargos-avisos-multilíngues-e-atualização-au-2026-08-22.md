# Painel Admin MVP: cargos, avisos multilíngues e atualização automática

Tudo continua mockado (sem backend), mas com lógica de estado real: cargos com permissões, avisos internos traduzidos, badge de estado dinâmico no header e finanças com atualização automática que nunca interrompe quem está a escrever.

## 1. Cargos e permissões (RBAC)

Substituir as permissões soltas por cargos:

| Cargo | Acesso |
|---|---|
| Super Admin (`hisrmendes@gmail.com`) | Tudo. Oculto das listas públicas de equipa. Cria/edita avisos internos e gere utilizadores |
| Admin | Gere utilizadores e cargos (exceto Super Admin). Cria/edita avisos internos |
| Contábil | Doações e faturação. Avisos internos só leitura |
| Stream | Controlo de transmissão ao vivo. Avisos internos só leitura |
| Jornalista | Painel de conteúdo (notícias públicas, revistas). Avisos internos só leitura |
| Voluntário | Só leitura: avisos internos e faturação. Não publica nem edita nada |

O editor de avisos internos só existe no ecrã para Super Admin e Admin; os restantes veem a lista em modo leitura. A gestão de equipa passa a ser "e-mail + escolha de cargo" (com resumo das áreas que o cargo desbloqueia).

## 2. Avisos internos multilíngues

Cada aviso passa a guardar o texto em castelhano, catalão, português e inglês. O painel mostra sempre a versão do idioma escolhido no seletor do site, com recurso ao castelhano quando falta tradução. Ao criar um aviso, o Admin escreve no idioma atual e as outras versões ficam preenchidas com esse texto marcado como pendente de tradução — pronto para ligar tradução automática mais tarde.

Também corrijo o problema atual em que o painel e o ecrã de login aparecem em português enquanto o resto do site está em castelhano.

## 3. Horários, eventos especiais e badge de estado

- Novo formulário no Admin: horários de abertura por dia da semana + eventos especiais (nome, data, hora início/fim, descrição).
- Badge no header, ao lado do "Missa Ao Vivo", calculado a partir da hora atual:
  - dentro do horário normal → verde **"Aberto"**
  - fora do horário → vermelho/cinza **"Fechado"**
  - durante um evento especial → verde **"Aberto — [Nome do Evento]"**
- Atualiza-se sozinho ao longo do dia e o nome do estado segue o idioma selecionado.

## 4. Finanças e atualização automática não-disruptiva

- Faturação mockada agrupada por mês, com total atual (estrutura já pronta para receber o webhook do Stripe).
- Um temporizador atualiza avisos internos e faturação a cada 45 segundos para todos.
- Proteção do editor: enquanto um editor de avisos ou de finanças estiver aberto ou com um campo focado, a atualização fica em espera e nunca limpa o que está escrito. Quando o editor fecha, os dados novos entram de imediato, com um aviso discreto de "novidades disponíveis" durante a espera.

## Notas técnicas

- `src/lib/site-state.tsx` ganha `role` por utilizador, `can(area, "read" | "write")`, horários/eventos, avisos multilíngues e um contador de refresh; continua tudo em memória + localStorage.
- Registo de "editor ocupado" partilhado no estado, para o `setInterval` saber quando adiar.
- Separadores e ações do dashboard passam a depender do cargo; ações de escrita ficam bloqueadas na função, não só escondidas no ecrã.
- Sem backend nesta fase: os dados continuam por dispositivo, ideal para a demonstração do MVP.
