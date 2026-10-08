# Arquitetura — BIYA / Parallel Worlds V5

## Runtime

A aplicação pública é React 19 + TypeScript e usa Vite para build. `index.html` inicializa `src/main.tsx`; a política de artes possui uma segunda entrada Vite em `art-policy.html`.

## Camadas

- `src/react/App.tsx`: composição principal, navegação, mundos, galeria, Signal, About e rodapé.
- `src/react/data.ts`: conteúdo editorial tipado, links públicos e metadados das imagens.
- `src/react/useImmersion.ts`: progressão de scroll, pointer parallax, reveal e deterrence de cópia casual.
- `src/react/MiniGame.tsx`: Parallel Pulse em Canvas 2D.
- `src/react/gameLogic.ts`: regras puras e testáveis do minijogo.
- `src/react/EasterEgg.tsx`: frequência secreta baseada em interação de teclado/wordmark.
- `src/react/PolicyApp.tsx`: política de uso das artes em PT/EN.
- `src/css/*`: base visual histórica do Parallel Worlds, reutilizada pela camada React.
- `src/react/react.css`: integração React, game, segurança visual e componentes novos.

## Estado

React controla idioma, mundo visual, galeria, modal, jogo, navegação ativa e Easter Egg. Não há dependência do antigo runtime vanilla JS.

## Direitos

O site exibe somente o subconjunto necessário de assets em `public/assets`. Regras de crawler, headers e política pública formam uma camada de deterrence; não são DRM e não tornam imagens públicas tecnicamente impossíveis de copiar.
