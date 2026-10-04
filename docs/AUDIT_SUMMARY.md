# Auditoria V02 — síntese executiva

**Fonte única de implementação:** `biya-parallel-worlds-v02-pt-en(1).zip` fornecido pelo usuário. A aparência artística, as ilustrações e os principais componentes foram preservados. Não foi utilizado o documento TXT anterior.

| Antes | Refatoração aplicada |
| --- | --- |
| HTML + CSS + JS e traduções monolíticas | HTML semântico com CSS modular e ES Modules por responsabilidade |
| Textos institucionais como tributo/fan project | Apresentação centrada na Biya e no acervo; pré-lançamento sem afirmar autorização final |
| Texto de galeria não estruturado em HTML | Dados das obras separados de traduções e controles |
| Traduções abrangendo a maior parte da interface | PT/EN exclusivo incluindo título, metadados, descrições de mídia, seleção do mundo, ARIA e obra/modal |
| Imagem da outra atmosfera oculta apenas por opacidade | Estado `aria-hidden` acompanha a imagem visível |
| Imagens sem `width` e `height` | Dimensões intrínsecas para reduzir layout shift |
| Controles da galeria sem feedback acessível explícito | `aria-current`, região ao vivo, foco restaurado, alvos interativos ampliados |
| Sete JPEGs com extensão `.webp` | Renomeados corretamente como `.jpg` sem recompactar ou alterar conteúdo original |
| Sem plano de testes | Testes estruturais e testes no Chromium em diferentes viewports |

## O que falta para a Biya validar
- Autoria e créditos de todas as artes, inclusive a possibilidade de obras feitas por terceiros.
- Títulos verdadeiros das obras, caso existam, e localização das fontes.
- Links de transmissões individuais; os links atuais vão apenas ao canal.
- Conteúdo institucional, redes, permissões de divulgação e governança.
- Medições Lighthouse reais, WCAG assistiva/manual, testes em outros navegadores, domínio/SEO de produção.

## Posição de lançamento
A presença digital foi desenhada **para a Biya** e deverá ser administrada pela artista se aprovada. O código não deve se declarar lançamento oficial enquanto não houver a autorização final. `noindex,nofollow` está ativo, mas não protege a confidencialidade do conteúdo publicado.
