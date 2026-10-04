# Arquitetura e decisões de design

## Objetivo
Site de apresentação e portfólio destinado à Biya, artista e VTuber. Crystal/Ghost é uma metáfora visual de contraste e textura, **não lore**. A comunicação é centrada na artista e em suas obras, não na autoria do desenvolvedor.

## Componentes
- `main`: organiza as inicializações.
- `state`: estado único de idioma, atmosfera e obra; notifica assinantes sem acoplamento entre os módulos.
- `i18n`: strings `pt-BR` e `en`, títulos de página, conteúdos de atributos e regiões vivas de atualização. Um único idioma ativo por vez.
- `world`: atualiza o universo, a OC, a cópia editorial, ARIA e movimentos suaves não essenciais.
- `gallery`: dados externos ao componente, foco, modal, setas, swipe e estado ARIA.
- `navigation`: progressão de leitura e navegação por seções com IntersectionObserver.
- `media/artworks`: metadados separados do DOM, a serem verificados antes da publicação.

## Escolhas
- HTML/CSS/JS sem bundler: baixo custo, GitHub Pages fácil, poucos recursos.
- ES Modules: dependências explícitas, funções pequenas e módulos testáveis.
- Acessibilidade: imagens dimensionadas, `aria-pressed`, regiões ao vivo, `dialog` nativo, skip-link, foco visível, modo movimento reduzido, apenas imagem ativa exposta ao leitor de tela.
- Mobile: ordem de leitura em coluna com ajustes progressivos de viewport.

## Barreiras de publicação
A Biya deve aprovar textos, visual, recursos, direitos de uso, créditos, plataforma de hospedagem, domínio e administração. Não publicar como site oficial antecipadamente. O repositório no GitHub é público: **branch não é privacidade**.

## Correção de formato de mídia

O ZIP continha **sete arquivos JPEG com extensão `.webp`** (`shot1–4` e `live1–3`). Eles foram renomeados para `.jpg`, sem qualquer alteração dos pixels ou dos bytes; os caminhos em HTML e dados foram atualizados. Os 12 WebP verdadeiros permaneceram inalterados.
