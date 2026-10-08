# BIYA V7 — World Resonance & Art Theatre

A reforma V7 adiciona **imersão que serve a experiência**, sem trocar as artes ou romper a dupla direção de arte V6.2.

## O que muda visualmente
- Crystal recebe refração e órbita perolada suave, feita inteiramente em CSS.
- Ghost recebe uma órbita orgânica, luz violeta e sombras mais profundas; os elementos de arte permanecem intocados e sem filtros adicionais.
- A exposição Archive ganha profundidade por camadas, mas sem partículas em Canvas, vídeo de fundo, fontes externas ou bibliotecas de animação.
- Cards de transmissões passam a responder com movimento curto e discreto, condicionado a mouse/hover verdadeiro.

## O que muda funcionalmente
- Um **seletor compacto Crystal/Ghost** aparece depois que o visitante deixa o Portal. Assim o conceito de dois mundos não fica preso ao início. Ele desaparece no Portal (que já tem controles grandes), na seção do jogo (não deve cobrir o Arcade) e durante a abertura de um modal.
- O seletor mostra o estado com `aria-pressed`, opera por teclado/toque e funciona em PT e EN.
- A galeria ampliada agora funciona como **Art Theatre**: imagem original com `object-fit:contain`, botão anterior/próximo, setas esquerda/direita do teclado, Escape, contador e uma faixa de seis miniaturas navegáveis.
- A tela da obra traz título e descrição disponíveis no acervo; **não inventa autoria individual** que não esteja documentada.
- O modal mantém a trava de foco e restauração do elemento anterior, herdadas do hook `useDialogAccessibility`.

## Artes e direitos
Nenhum arquivo em `public/assets` foi alterado, substituído, ampliado artificialmente, gerado ou redesenhado por IA. As imagens continuam com as URLs locais existentes e são carregadas somente para exibição. Os efeitos de luminosidade e órbita são elementos decorativos em CSS, por trás da arte. Aplicam-se `COPYRIGHT.md`, `docs/ASSET_PROVENANCE.md` e `/art-policy`.

O texto `© RIGHTS PRESERVED` é informativo: não constitui barreira de download. A página pública nunca pode impedir completamente cópia de bytes enviados ao navegador.

## Limites e acessibilidade
- Animações só em opacity/transform de CSS; `prefers-reduced-motion` desativa novas animações decorativas e a entrada das imagens do modal.
- `prefers-contrast:more` / `forced-colors` removem ornamentos que dificultam a leitura.
- Não introduz telemetria, scripts de terceiros nem solicita dados do usuário.
- Em celular, o Art Theatre usa navegação compacta, filmstrip horizontal e layout refluível.
- **O minijogo não é alterado**, nem os dados de score ou sua interação de toque/teclado.

## Qualidade
Novo teste `tests/e2e/world-resonance-v7.spec.ts` verifica tema em qualquer seção, PT/EN, controle de foco, modal, seis originais, acessibilidade e layouts em 320, 375, 768, 1440 e 3840px. Esses checks somam-se às cinco baterias existentes e a toda a suite Playwright anterior.

## Publicação
Fazer merge apenas após testes aprovados no PR. Conferir em seguida `https://biya-prism.zaratakion.workers.dev/version.json`: `revision` deve coincidir exatamente com o SHA integrado em `main`. A revisão publicada precisa ser verificada antes de informar que a nova V7 está no ar.
