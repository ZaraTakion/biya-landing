# BIYA — Living Worlds V6.2 (Direção de Arte e Engenharia)

Data: 2026-10-08

## Intenção

A V6 elevou a organização editorial da Biya. Esta versão melhora a sensação de **presença** e **profundidade** sem transformar a página num jogo de partículas. O centro continua sendo a arte original; todos os detalhes novos são CSS/DOM simples e decorativos, sem acesso ao conteúdo pixel das imagens.

### Crystal: refração e delicadeza
- Três fragmentos cristalinos lentos, um halo de profundidade e uma luz de refração ligada ao movimento do ponteiro **somente com mouse preciso**.
- Movimento máximo discreto (até 11 px), sem tremor ou deslocamento do retrato.
- O clique no mundo cria uma atmosfera nova com transição curta e silenciosa.

### Ghost: presença noturna
- A mesma estrutura visual muda de material: fragmentos viram luzes fantasmagóricas e o halo fica assimétrico e violeta.
- A composição Ghost desktop continua invertida; mobile mantém o retrato no fluxo normal da correção V6.1.
- Sem flashes rápidos, autoplay de vídeo, áudio, canvas ou redes de partículas.

### Arquivo de artes
- As seis obras já publicadas possuem iluminação de palco diferenciada conforme seleção.
- A foto e o bloco editorial reaparecem suavemente por `key={art.id}` (React); barra fina indica avanço de 1/6 a 6/6.
- Pontos, miniaturas, setas, swipe, teclado, modal e texto alternativo continuam sendo as interações principais.
- As artes não são filtradas, retocadas nem geradas por IA; o fundo CSS é independente das imagens.

## Performance e acessibilidade

- Novo CSS localizado em `src/react/living-worlds.css`, importado **após** a direção V6. Sem dependências novas.
- Máximo de três peças decorativas, `pointer-events:none`, transform/opacity preferenciais. Nenhuma atualização React a cada frame: o ponteiro é tratado pelo hook de imersão já existente com `requestAnimationFrame`.
- Em telas <=720 px: fragmentos extras e drift reduzidos; estágios nunca são movidos.
- `prefers-reduced-motion: reduce`: todos os novos efeitos animados são desligados e a interface permanece utilizável.
- `prefers-contrast: more` / `forced-colors`: ornamentos potencialmente distrativos são escondidos.
- O projeto conserva as cinco baterias e os testes Playwright incluindo os da V6.1 que confirmam retratos visíveis no celular.

## Critério de publicação

- [ ] Cinco baterias aprovadas no commit final.
- [ ] Todos os testes de Chromium (incluindo `living-worlds.spec.ts`) aprovados no commit final.
- [ ] Commit de merge confirmado diretamente em `/version.json` da Cloudflare.
- [ ] Verificação visual desktop em Crystal/Ghost e teste humano de celulares reais/zoom continuam separados da automação.

## Arte e direitos

Não foram alteradas imagens, créditos, licenças ou permissões. As sete artes adicionais recebidas anteriormente ainda dependem de upload seguro dos arquivos binários e verificação de créditos; os novos efeitos não criam referências a caminhos inexistentes.
