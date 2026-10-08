# Arquitetura e decisões de design

## Objetivo

Site público de apresentação e portfólio destinado à Biya, artista digital e VTuber. A publicação e a exibição dos materiais selecionados foram autorizadas pela Biya.

Crystal/Ghost funciona como linguagem visual de contraste, luz e textura; o site não atribui lore ou biografia não confirmada.

## Componentes

- `main`: inicializações.
- `state`: idioma, atmosfera e obra ativa.
- `i18n`: PT-BR / EN, com um idioma ativo por vez.
- `world`: alternância Crystal/Ghost, cópia, ARIA e parallax.
- `gallery`: galeria, foco, modal, teclado e swipe.
- `navigation`: progresso de leitura e seção ativa.
- `motion`: atmosfera, entradas, microinterações e transições, respeitando movimento reduzido.
- `media/artworks`: metadados do acervo.

## Imersão

A versão final preserva a composição e adiciona:
- partículas e sigilos ambientais;
- movimento distinto em Crystal e Ghost;
- profundidade sutil por ponteiro/scroll;
- respiração visual da personagem e dos elementos de cenário;
- entradas progressivas das seções;
- feedback de hover discreto.

## Acessibilidade

Imagens dimensionadas, `aria-pressed`, regiões vivas, `dialog` nativo, skip-link, foco visível, teclado e `prefers-reduced-motion`.

## Direitos

A autorização de exibição não concede licença de reutilização a terceiros. Consulte `/art-policy.html` e `docs/ART_POLICY.md`.

## Correção de formato de mídia

O pacote continha sete arquivos JPEG com extensão `.webp` (`shot1–4` e `live1–3`). Eles foram renomeados para `.jpg`, sem alteração dos pixels ou bytes.
