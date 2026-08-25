# Refatoração: layout, i18n e ERP

## O que está errado hoje (verificado no código)

- `src/i18n/index.ts` inicializa i18next com `lng: "es"` fixo e usa uma deteção manual só no `useEffect` do root; o pacote `i18next-browser-languagedetector` está instalado mas não é usado. O `<html lang="pt">` está fixo em `__root.tsx`.
- O seletor de idioma em `SiteHeader.tsx` está em `hidden lg:block` (desktop) e também dentro do menu — mas o menu hambúrguer só existe em mobile (`lg:hidden`).
- `src/components/SiteFooter.tsx` tem uma coluna de links "Visitas guiadas / Dízimos e ofertas / Missas ao vivo" — é essa a coluna que aparece "sobrando" ao lado do bloco de doações.
- `src/routes/agendamento.tsx` está inteiramente em português fixo, sem chaves i18n, e o último cartão termina sem espaçamento inferior antes do rodapé.
- `src/routes/contato.tsx` tem um mapa de 440px de altura ocupando a largura toda, empurrando o rodapé para fora do campo de visão.
- `src/routes/index.tsx` usa um array `REVIEWS` fixo e a hero não tem parallax.
- Cortes de página: os blocos usam `Reveal` com `whileInView`; quando o elemento nunca entra no viewport calculado (margem `-80px` + secções altas) o conteúdo fica em `opacity: 0`, o que dá o efeito de "página cortada pela metade".

## O que será feito

### 1. i18n a 100%
- Ligar `i18next-browser-languagedetector` com ordem `localStorage → navigator`, chave `sjg-lang`, `fallbackLng: "es"`; troca instantânea ao clicar (já é reativo via `react-i18next`).
- Sincronizar `<html lang>` com o idioma ativo (via efeito no root, sem quebrar hidratação).
- Traduzir as páginas ainda em português fixo: Agendamento, Galeria e o rodapé.

### 2. Header e menu
- Botão hambúrguer visível em desktop **e** mobile (remover `lg:hidden`), com a navegação inline mantida em ecrãs grandes.
- Overlay do menu em creme do site com transparência + blur (`bg-background/85 backdrop-blur-xl`) em vez de quase transparente, para legibilidade total.
- Seletor de idiomas: no header em desktop; dentro do menu em mobile (`lg:hidden` no bloco interno).
- Fecha ao clicar fora, em qualquer link e com Escape (já existe, será confirmado). Sem item "Início" no menu; a logo faz scroll-to-top.
- Badge "Ao Vivo" pulsante apenas no DOM quando a transmissão está ativa (mantido).

### 3. Doações
- Remover a coluna lateral de links do rodapé que aparece encostada ao bloco (reorganizar o rodapé em 2 colunas: identidade + contactos) e centrar o cartão de doação.
- Valor principal em fonte muito maior (estilo calculadora, `text-6xl/7xl` tabular).
- Manter os presets 10/20/50 €.
- Novo campo de texto "intenção/motivo da doação", incluído na confirmação.
- Coração pulsante (Framer Motion) enquanto se escreve o valor.
- Rodapé de métodos com ícones Apple Pay, Google Pay, PayPal, Klarna (SVGs inline, sem dependência externa).

### 4. Admin e segurança
- Login apenas Google OAuth, ícone de cruz, textos em castelhano; redireciona para `/dashboard` após entrar e devolve utilizadores não autenticados de `/dashboard` para `/admin-auth`.
- Super Admin oculto na lista pública da equipa, com acesso irrestrito.
- Formulário de adição de funcionário por e-mail com checkboxes de permissões (Agenda, Faturação, Transmissão, Conteúdo, Equipa); todas marcadas = Super Admin, nenhuma = Voluntário (só Avisos Internos).

### 5. Correções de layout e efeitos
- **Cortes/scroll**: `Reveal` passa a ter fallback — se o elemento não for observado, fica visível (sem estado preso em `opacity: 0`); margens de viewport reduzidas. Aplicado a História, Agendamento e Doações.
- **Home**: parallax na hero (transform ligado ao scroll, com `prefers-reduced-motion` respeitado); botão "Ver Horários" mantém o scroll suave.
- **História**: fade-in gradual sequencial e página rolável até ao fim.
- **Agendamento**: grelha com espaçamento inferior correto e cartões com altura natural (nada cortado no fundo).
- **Contacto**: mapa mais pequeno e integrado (altura ~260–300px, cantos arredondados, sombra suave, largura contida), garantindo que o rodapé aparece no fim da página.

### 6. Google Reviews
Depende de uma chave da API do Google Places. Sem chave não é possível ler avaliações reais — a implementação fica preparada: leitura via função de servidor com a chave guardada como segredo e o Place ID `ChIJhQQrkLyipBIRlp3-n3kUGHM`, com cache e fallback para as avaliações atuais enquanto a chave não existir. Peço a chave quando chegar a esse ponto.

## Verificação
Após as alterações, percorro todas as rotas com o browser (desktop e mobile), confirmando: troca de idioma persistente após refresh, rodapé visível no fim de cada página, scroll completo em História/Agendamento/Doações, menu a fechar corretamente e o fluxo admin bloqueado sem sessão.
