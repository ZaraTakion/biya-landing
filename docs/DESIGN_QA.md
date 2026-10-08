# BIYA — Auditoria editorial de design (V5.4)

Data: 2026-10-08. Escopo: identidade, legibilidade, contraste e hierarquia do site já publicado.

## Princípio

**Crystal e Ghost são identidades artísticas, não um pretexto para dificultar a leitura.**
Aprimorar rótulos e metadados de interface sem alterar as artes, a composição editorial ou inventar conteúdo biográfico.

## Evidências verificadas

- Inspeção visual em viewport desktop (~1440 px) nos cinco capítulos e nas duas atmosferas: capítulos e textos auxiliares pequenos, vários detalhes de orientação pouco legíveis.
- Auditoria de CSS verificou uso frequente de 8–10 px em rótulos significativos, além de contrastes fracos.
- Exemplos aproximados de contraste **antes** em superfícies sólidas representativas:
  - `#8c8596` sobre `#f3f1f7` (transmissões): **3,17:1**.
  - `#8d8496` sobre `#f3f1f7` (indicadores): **3,19:1**.
  - `#9691a4` sobre `#f5f5fa` (navegação lateral): **2,81:1**.
  - `#887a92` sobre `#1b1622` (rótulo do rodapé): **4,43:1**.
- Contraste **depois**: tokens `--biya-copy-muted-light` e `--biya-copy-muted-dark`, usados nos principais textos de interface e verificados por testes unitários contra superfícies representativas.

## Melhorias

1. Tipografia funcional de capítulos, miniaturas, metadados, links sociais e rodapé legível, em geral com **11–13 px**.
2. Texto secundário escurecido em superfícies Crystal e clareado em Ghost.
3. Rótulos de navegação e de escolha de mundo com hierarquia visual mantida.
4. Área de toque da seta inferior do portal elevada a 44 px em telas móveis.
5. Nenhuma alteração em imagens autorais nem títulos de obras.

## Pendências que não devem ser marcadas como aprovadas

- [ ] Verificação de contraste calculado **após composição visual**, inclusive imagens e transparência, nos dois mundos.
- [ ] QA real de responsividade e overflow em 320, 375, 390, 768, 1080, 1440 e 3840 px.
- [ ] Testes de zoom de 200% e ajuste de fonte pelo navegador.
- [ ] Auditoria de teclado/screen reader com assistência humana.
- [ ] Revisão visual final pela Biya e confirmação dos créditos de cada obra.

Referências:
- WCAG 2.2, contraste mínimo de texto normal 4,5:1: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Tipografia fluida: https://web.dev/learn/design/typography

Os testes de tokens **não são uma declaração de conformidade WCAG completa**.

## V5.6 — Navegação acessível e reflow (2026-10-08)

**Escopo controlado:** não substituir artes, paletas Crystal/Ghost ou composição dos capítulos.

- Menu móvel: Escape fecha e devolve foco ao botão; clique fora fecha; alteração para desktop encerra o estado aberto; `inert` desativa links enquanto fechado.
- Modal de obras e Easter Egg: dimensões adaptadas ao viewport dinâmico, rolagem interna quando necessário e botão de fechar acessível durante o scroll.
- Quatro novos roteiros Playwright: menu/teclado, modal de arte em 320×568, preferência de movimento reduzido e estresse de reflow com CSS `zoom:2`.
- O teste CSS zoom **simula uma condição de ampliação**; não substitui inspeção humana com zoom nativo do navegador, texto ampliado ou testes de tecnologias assistivas.

### Critérios de aceite
- [ ] Baterias 1–5 aprovadas no último commit.
- [ ] Testes Chromium antigos e V5.6 aprovados no último commit.
- [ ] Verificação independente de Cloudflare: `version.json` corresponde ao SHA da `main`.
- [ ] Revisão manual posterior de Chrome/Firefox/Safari, zoom de 200%, Android e iPhone.
