# BIYA / Parallel Worlds — Redesign editorial V6.0

Data: 2026-10-08. Escopo: reformulação perceptível da aparência, arquitetura de informação e organização visual, sobre o código React existente. Esta entrega não altera obras originais nem atribui créditos que não foram confirmados.

## Por que uma reformulação de verdade

Uma auditoria das telas desktop encontrou cinco problemas:
1. Barras duplicadas, `/02`, etiquetas artificiais e navegação redundante competiam pela atenção.
2. O hero era quase o mesmo nos dois mundos, com diferenças sobretudo de paleta.
3. A arte da galeria sofria com bordas, marcas técnicas e ornamentos concorrentes.
4. A seção de streams tinha um bloco de dados de aparência genérica e pouco espaço para as próprias miniaturas.
5. O jogo parecia uma aplicação separada, com estética excessivamente técnica.

## Decisões implementadas

### Crystal / diário de luz
- Composição editorial de texto à esquerda e arte à direita; fundo pérola e rosa com atmosfera luminosa.
- Tipografia forte e contemporânea para o nome, itálico serifado para a assinatura artística.
- Moldura circular suave atrás da arte, sem girar ou alterar os pixels da ilustração.

### Ghost / aparição noturna
- Composição desktop **invertida**: a ilustração vem primeiro, texto e título serifado surgem à direita.
- Paleta de ameixa escura, contraste elevado, brilho violeta e forma orgânica de aura.
- Galeria e transmissões preservam hierarquia de arte, mas recebem assinatura de fundo noturno.

### Organização do site
- Removidos: barra de conceito duplicada, ticker giratório, interlúdio repetitivo, navegação lateral duplicada, pequeno overlay fixo de copyright, elemento grande `A` de decoração, cruzes da galeria, adesivo fictício `BIYA ART STUDIO`, metadados verticais sem função.
- Transformado o bloco de '03 métricas' de Sinal em uma linha editorial com caminho inequívoco ao YouTube.
- Galeria passa a priorizar superfície visual ampla, descrição humana, miniaturas acessíveis e navegação anterior/próxima; modal, seis peças e seus arquivos permanecem.
- As transmissões permanecem no site com suas três imagens existentes, sem inventar vídeos/links individualizados.
- Parallel Pulse permanece jogável, com moldura e hierarquia adaptadas à direção de arte.
- Footer fica enxuto, com links sociais, política de artes e hash verificável do build.

### Preservação
- React/TS/Vite, PT/EN, dois temas, política, proteção dissuasória de imagens, minijogo, Easter Egg e deploy seguem operacionais.
- Não alteramos, geramos ou substituímos as imagens originais.
- Nenhuma afirmação nova de autorização/copyright foi inventada. Prova documental e créditos individuais continuam dependentes de verificação humana.

## Aceite mensurável
- [ ] TypeScript / Vitest / build / auditoria de segurança / release (cinco baterias) aprovadas no último commit do PR.
- [ ] Playwright: testes anteriores de 320 a 3840 px, menu/modal, contraste dos dois mundos, reflow de texto, V6 estrutura/desktop/mobile.
- [ ] `main` atualizada somente após aprovação da branch.
- [ ] Cloudflare: endpoint `version.json` com o SHA exato pós-merge; fluxo `Verify BIYA Production Revision` aprovado.
- [ ] Inspeção manual pós-publicação em browser desktop dos dois mundos.
- [ ] QA humano em iOS/Android, leitores de tela, e aprovação final da Biya — não podem ser simulados por testes de CI.

## Limites e critérios de publicação

Um site com artes protegidas não pode impedir totalmente salvamento por captura de tela ou rede; as medidas existentes são dissuasórias, não uma garantia absoluta de proteção. Os materiais exibidos requerem autorização e créditos individualizados verificáveis pela responsável.

O novo stylesheet `src/react/design-v6.css` entra **por último**: torna o visual transformado evidente sem apagar as fundações existentes de acessibilidade. Em manutenção futura, preferir consolidar estilos antigos ao adicionar mais camadas.
