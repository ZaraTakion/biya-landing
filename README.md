# BIYA — Parallel Worlds

Website artístico **em desenvolvimento para a Biya**. Base de referência: `biya-parallel-worlds-v02-pt-en(1).zip`, fornecida por Zara. Esta é uma implementação técnica de pré-lançamento, **não uma publicação oficialmente aprovada**. A atribuição de propriedade, as credenciais, os conteúdos e a disponibilização pública dependem de revisão e autorização expressa da Biya.

## Executar localmente

Pré-requisitos: Python 3 ou outro servidor HTTP estático; navegador atualizado.

```powershell
cd biya-landing
python -m http.server 8000 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8000`. Os arquivos usam **ES Modules**, portanto não abra `index.html` diretamente com `file://` (restrições de segurança do navegador).

## Estrutura

```text
biya-landing/
├── index.html
├── assets/{artwork,avatars,streams}/
├── src/css/{tokens,base,layout,components,motion}.css
├── src/js/{main,state,i18n,world,gallery,navigation}.js
├── src/data/{artworks,media}.js
├── src/data/translations/{pt-BR,en}.js
├── tests/
├── docs/
└── README.md
```

## Recursos

- **Crystal/Ghost:** modos de direção de arte, não histórias canônicas ou biografias da Biya. Botões e tecla **G** alternam o modo quando o foco não está em um campo editável ou modal.
- **Galeria:** navegação por botões, indicadores, setas dentro do componente e gesto horizontal em telas de toque. `dialog` nativo com fechamento por Escape e botão.
- **Idiomas exclusivos:** português do Brasil (`pt-BR`) e inglês (`en`). O idioma ativo cobre navegação, obras, elementos dinâmicos, documentos e atributos ARIA. Preferência salva quando o navegador permitir.
- **Responsividade:** adaptação para telas pequenas e grandes, com opção de movimento reduzido.
- **Sem dependências externas no código JavaScript:** projeto estático leve.

## Conteúdo e edição

- Dados e caminhos das obras: `src/data/artworks.js` (títulos/descrições em `src/data/translations/`).
- Dados das transmissões: `src/data/media.js`. **As URLs de vídeos individuais ainda não foram verificadas; os cartões levam ao canal**, de forma intencional e explícita.
- Cópias de interface e descrições: `src/data/translations/pt-BR.js` e `en.js`. Uma mesma chave precisa existir nos dois idiomas. Não inserir HTML arbitrário em conteúdo remoto.
- Cores e tokens: `src/css/tokens.css`; padrões comuns: `base.css`; geometria responsiva: `layout.css`; controles: `components.css`; movimento: `motion.css`.

## Validação e publicação

1. O site usa `noindex, nofollow` durante a revisão. **Isso não é controle de privacidade**. Nunca publicar conteúdo restrito em repositório ou hospedagem pública.
2. A identidade oficial e a publicação exigem aprovação da Biya. Não inventar lore, preferências ou dados biográficos.
3. Todos os 19 recursos de imagem foram derivados da fonte anexada sem gerar novas artes. Escopo de autorização, direitos e créditos finais precisam ser documentados **individualmente**.
4. Nomes de algumas obras são **rótulos editoriais provisórios**, não títulos oficiais. Consulte `docs/CONTENT_CHECKLIST.md`.
5. Conferir links e vídeos antes do lançamento; abrir a revisão em uma branch dedicada e fazer testes manuais/automatizados.
6. Para executar verificações: `python -m unittest discover -s tests` e `python tests/browser_smoke.py` (segundo comando requer `playwright` e Chromium).
7. Remover `noindex, nofollow` somente após aprovação e testes finais, em configuração de publicação controlada.

Arquitetura, decisões e critérios de aceite em `docs/ARCHITECTURE.md` e `docs/TEST_PLAN.md`.
