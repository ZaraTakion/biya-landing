# Plano de testes — Definition of Done

**Funcionalidade:** alternância Crystal/Ghost (inclusive pela tecla G); uma só língua por vez, inclusive no título HTML, ARIA, imagens e estados dinâmicos; persistência; galeria; modal (abrir, fechar, Esc, retorno de foco); atalhos de teclado; rolagem.

**Viewport:** 320, 390, 768 e 1440 px sem imagens quebradas ou overflow horizontal; verificação de toque e leitura vertical em dispositivos móveis.

**Acessibilidade:** WCAG 2.2 AA como objetivo de validação, contraste de texto/conteúdo, foco visível, leitores de tela, labels traduzidos, alvos interativos, movimento reduzido.

**Conteúdo:** fontes autorizadas, créditos, URLs de streams, textos biográficos e títulos individuais. Nenhum conteúdo privado/canônico imaginado.

**Desempenho:** medições reais com Lighthouse/Core Web Vitals; alvos de avaliação LCP ≤2,5s, INP ≤200ms, CLS ≤0,1 no percentil apropriado de navegação.

**Publicação:** `noindex, nofollow` permanece ativo até aprovação expressa. Sem mudanças não autorizadas em `main`.
