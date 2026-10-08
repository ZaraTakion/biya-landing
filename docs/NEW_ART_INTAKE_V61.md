# BIYA — Novas artes recebidas (V6.1)

Data: 2026-10-08

## Tratamento e direitos

Sete imagens foram recebidas no chat e devem ser usadas no site **sem qualquer ferramenta de geração ou edição por inteligência artificial**. O tratamento técnico permitido aqui é conversão determinística para WebP e redimensionamento com Pillow/Lanczos, preservando a composição. Os arquivos originais não são sobrescritos.

Os arquivos para web devem ser versões de exibição otimizadas, **não** os arquivos originais em resolução máxima num repositório público. A publicação de uma imagem não impede sua cópia por captura de tela nem sua recuperação pela aba de rede; a marca de direitos é aviso, não DRM. Crédito autoral específico somente após confirmação da Biya. Nenhum artista/crédito foi inventado.

## Correspondência para integração

| Imagem recebida | Origem (attachment) | Local planejado no site | Derivado para web |
| --- | --- | --- | --- |
| Crystal segurando coração facetado | `1000126339.jpg` | Portal Crystal / galeria | `public/assets/biya-extra/crystal-portrait.webp` |
| Ghost roxo com caveira | `1000126340.png` | Portal Ghost / galeria | `public/assets/biya-extra/ghost-skull.webp` |
| Retrato Ghost em close | `1000126341.png` | Galeria de retratos | `public/assets/biya-extra/ghost-closeup.webp` |
| Retrato com boné | `1000126342.png` | Galeria / retratos | `public/assets/biya-extra/casual-portrait.webp` |
| Versão casual/chibi com boné | `1000126343.png` | Galeria / destaque casual | `public/assets/biya-extra/casual-chibi.webp` |
| Coração de cristal isolado | `1000126344.png` | Ornamento Crystal opcional | `public/assets/biya-extra/crystal-heart.webp` |
| Retrato formal de roupa escura | `1000126345.png` | Galeria / Sobre | `public/assets/biya-extra/formal-portrait.webp` |

Os outros dois arquivos recebidos (`1000126346.jpg` e `1000126348.jpg`) são **capturas de tela do bug mobile**, nunca material artístico público.

**Importante:** caminhos nesta tabela são destinos de integração, não prova de que os arquivos binários foram enviados. Para evitar imagem quebrada, somente mudar referências React após verificar que as sete versões web estão no GitHub. A correção do hero V6.1 usa as artes verificadas `/assets/avatars/crystal.webp` e `/assets/avatars/ghost.webp` já disponíveis no projeto.

## Defeito reproduzido por prints do usuário

Ambos os temas exibiam palco circular, texto e badge de direitos, mas sem retrato no mobile. A V6.1 remove o empilhamento de wrappers com retratos ocultos e fixa renderização de imagem ativa, geometria relativa e alt/fetchPriority. O teste `tests/e2e/mobile-hero-art.spec.ts` verifica cada tema em 320, 375, 390, 768 e 1440 px; inclui `naturalWidth`, opacidade CSS, visibilidade, dimensões e ausência de overflow.

## Revisão humana final

- Confirmar cada obra, seu crédito individual e o direito de exibição pública com a Biya.
- Conferir Crystal e Ghost em Brave/Chrome Android e Safari iOS, sem extrapolar conclusão baseada apenas no Chromium.
- Verificar zoom nativo 200%, texto ampliado e redes lentas.
