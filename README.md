# BIYA — Parallel Worlds

Site público e oficial da **Biya**, artista digital e VTuber, desenvolvido em **React + TypeScript + Vite**.

A experiência preserva a composição editorial Crystal × Ghost e aprofunda a identidade com animações, parallax, microinterações, galeria interativa, política de uso das artes, Easter Egg e o minijogo original **Parallel Pulse**.

## Produção

- URL oficial: https://biya-prism.zaratakion.workers.dev/
- Stack: React 19.3.0 · React DOM 19.3.0 · TypeScript 7.0.2 · Vite 8.3.3
- Deploy: Cloudflare Workers static assets
- Worker: `biya-prism`
- Idiomas: PT-BR / EN
- Build: `dist/`
- Política: `/art-policy`
- 404 personalizado: ativo

## Crystal × Ghost

Os dois mundos são tratados como estados visuais completos, não como uma simples troca de paleta:

- Crystal usa luz, refração, movimento geométrico e partículas em forma de cristal.
- Ghost usa contraste, névoa, flutuação, brilho violeta e formas mais orgânicas.
- Pointer parallax e scroll acrescentam profundidade sem alterar a composição.
- Todas as animações respeitam `prefers-reduced-motion`.

## Parallel Pulse

Minijogo React + Canvas integrado ao universo da Biya.

O jogador alterna entre **Crystal** e **Ghost** para sincronizar com os sinais que chegam. Acertos aumentam combo e pontuação; corações brancos raros concedem bônus nos dois mundos e três erros encerram o sinal. O recorde é salvo localmente quando o navegador permite.

## Easter Egg

Existe uma interação escondida inspirada no tom público da Biya: digitar **BIYA** — ou descobrir a interação secreta no wordmark — ativa uma pequena “frequência branca” com corações. O diálogo fecha com Escape, mantém o foco do teclado e devolve o foco ao acionador.

## Proteção das artes

Não existe mecanismo de navegador capaz de tornar uma imagem pública impossível de copiar. O projeto usa defesa em camadas para desestimular reutilização indevida:

- `noimageindex` para as imagens;
- opt-out de crawlers conhecidos de treinamento de IA;
- CSP e headers de segurança;
- bloqueio de drag/copy/context menu especificamente nas artes;
- badge de direitos sobre as imagens;
- apenas assets usados em produção são copiados para `public/assets`;
- source maps de produção desativados;
- política explícita contra repost, datasets, treinamento, fine-tuning, LoRA, image-to-image, ControlNet e geração por IA.

A autorização da Biya para o site exibir o material não transfere direitos aos visitantes.

## Bateria de 5

```bash
npm install
npm run verify:five
```

1. TypeScript estrito.
2. Testes unitários.
3. Build de produção.
4. Auditoria de proteção das artes e headers.
5. Auditoria do artefato final.

A mesma bateria roda automaticamente no GitHub Actions.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build e deploy

```bash
npm run build
npm run deploy
```

## Versão publicada e confirmação automática

Cada build de produção agora grava o commit Git que gerou os arquivos em `dist/version.json`, por exemplo:

```json
{
  "site": "biya-prism",
  "revision": "<SHA completo do commit que gerou o build>",
  "shortRevision": "<primeiros 7 caracteres>"
}
```

No rodapé do site, **VERSÃO / abc1234** mostra o mesmo identificador. O endpoint público é `https://biya-prism.zaratakion.workers.dev/version.json` (sem cache de navegador).

O fluxo usa dois portões distintos:
1. **Qualidade do código**: cinco baterias + teste real de Chromium em 320, 375, 768, 1080, 1440 e 3840 px.
2. **Publicação real**: após o sucesso da qualidade na `main`, o workflow `.github/workflows/production-verification.yml` verifica repetidamente se `/version.json` contém o SHA exato do commit. Se o deploy estiver atrasado ou falhar, a verificação fica vermelha, em vez de declarar sucesso sem evidência. Commits já superados pela `main` não disparam alertas de versão obsoleta.

O workflow de produção **não faz deploy**; monitora o deploy automático já configurado no provedor. Não substitui a conferência de direitos de arte nem avaliações visuais humanas.

### Testes de design em navegador

```bash
npm run build
npx playwright install chromium
npm run test:responsive
```

A instalação do Chromium roda no GitHub Actions. O computador local não precisa instalar esse navegador para o CI funcionar. Esses testes detectam possíveis regressões de navegação, viewport e UI responsiva, mas não são uma avaliação estética automática.

Para verificar apenas a produção a partir do terminal, execute:

```bash
EXPECTED_SHA=$(git rev-parse HEAD) node scripts/verify-production.mjs
```

No Windows PowerShell, use `$env:EXPECTED_SHA = (git rev-parse HEAD); node scripts/verify-production.mjs`.
