# Refatoração completa — Paróquia Sant Joan de Gràcia

Decisões confirmadas: backend continua mockado (localStorage), Stripe só interface, i18n em 4 idiomas (Castelhano padrão, Catalão, Inglês, Português do Brasil), Place ID das avaliações: `ChIJhQQrkLyipBIRlp3-n3kUGHM`.

## 1. Idiomas (i18n)
- i18next + react-i18next com deteção automática e memória da escolha.
- 4 idiomas: es (padrão), ca, en, pt-BR. Todo o site traduzido, incluindo o painel.
- Seletor visual compacto no header (bandeira/código + menu), presente também no menu móvel.
- O idioma da missa ao vivo continua independente (o que o admin escolhe).

## 2. Header e menu
- Logo passa a ser o botão "Início": na home faz scroll suave para o topo, noutras páginas volta à home.
- "Início" e "Missa Ao Vivo" saem do menu hambúrguer.
- Hambúrguer: overlay translúcido com desfoque, links "flutuantes" com entrada escalonada; fecha ao clicar fora, ao carregar em qualquer link e com a tecla Esc.
- Badge "AO VIVO" pulsante: só é criado no ecrã quando a transmissão está ativa (não existe escondido).

## 3. Home
- Hero com parallax suave no scroll e rolagem suave global.
- "Ver Horários" desliza suavemente até à secção de horários.
- Notícias ordenadas por data com os próximos eventos primeiro; eventos passados mantêm o efeito cinzento.
- Avaliações Google: leitura em tempo real do Place ID indicado. Isto exige uma chave da API Google Places guardada em segredo; enquanto ela não existir, mostro as avaliações atuais como reserva e o carrossel passa automaticamente a dados reais assim que a chave for adicionada.

## 4. História
- Imagens surgem de 0 a 100% com clareamento branco em 1,5s; textos revelam-se em sequência.
- Novo destaque visual: "Antoni Gaudí e o seu templo de culto habitual em Gràcia".
- "Francesc Berenguer i Mestres" e "Antoni Gaudí" abrem pesquisas Google em nova aba.
- Fundo com mosaicos trencadís e formas orgânicas modernistas em marca d'água (SVG leve, sem custo de desempenho).

## 5. Doações
- Campo numérico grande estilo calculadora, com teclado de valores rápidos e mínimo de 1 €.
- Coração que pulsa ao começar a escrever um valor.
- Rodapé de doação com ícones pequenos: Apple Pay, Google Pay, PayPal, Klarna.
- Botão de doar com estado de carregamento; a ligação real ao Stripe (checkout + webhook) fica preparada no código para ser ligada quando quiseres.

## 6. Admin (ERP) e segurança
- Entrada apenas por "Login com Google", com o ícone substituído por uma CRUZ.
- Super Admin (`hisrmendes@gmail.com`) não aparece na lista de equipa.
- Interruptor Aberto/Fechado (verde/vermelho) no cabeçalho do painel, refletido no site público.
- Quadro de Avisos Internos (criar, ler, apagar) visível a toda a equipa.
- Log de auditoria: cada ação regista quem, o quê e quando.
- Gestão de equipa: adicionar por e-mail Gmail com caixas de permissão [Agenda, Faturação, Transmissão, Conteúdo, Equipa]. Todas marcadas = Super Admin; nenhuma = Voluntário (só Avisos Internos).
- Cada separador do painel só aparece a quem tem a permissão correspondente.
- Agendamentos: cada reserva ganha um Ticket ID único; modal responsivo com todos os dados e geração de um PDF do bilhete para conferência.
- Albert vê apenas visitas guiadas; Padre Adilson vê apenas confissões; quem tem permissão total vê tudo.
- Segurança: validação de todos os formulários (zod), limites de tamanho, saneamento de links e do URL da transmissão, rotas do painel protegidas por verificação de sessão e permissão, `noindex` nas páginas internas. Nota honesta: com dados no navegador, esta proteção é de interface — a blindagem real só existe com backend.

## 7. Missa Ao Vivo
- Título e descrição dinâmicos por cima do vídeo.
- Com a transmissão desligada, a página fica bloqueada (mensagem de indisponível) e o link desaparece da navegação.

## 8. Testes
- Percorro todas as páginas com navegador automatizado nos 4 idiomas, em telemóvel e computador, verifico consola sem erros, fluxos de reserva, doação e painel, e corrijo o que falhar.

## Notas técnicas
- Novas dependências: `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `zod`, `jspdf`.
- Traduções em `src/i18n/{es,ca,en,pt-BR}.json`; provider montado em `__root.tsx`.
- Estado mockado em `src/lib/site-state.tsx` estendido com: permissões por membro, avisos internos, auditoria, ticketId nas reservas, estado aberto/fechado.
- Avaliações Google via server function (`createServerFn`) lendo `GOOGLE_PLACES_API_KEY` do ambiente; a chave nunca chega ao navegador.
- Parallax e revelações com Framer Motion (`useScroll`/`useTransform`), respeitando `prefers-reduced-motion`.
