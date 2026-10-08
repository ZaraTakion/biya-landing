# BIYA — Parallel Worlds

Site público de **Biya**, artista digital e VTuber, publicado com autorização informada pela própria Biya para uso dos materiais selecionados neste projeto.

A composição original foi preservada. O passe final reforça a experiência **Crystal × Ghost** com movimento, profundidade, microinterações e transições ambientais sem transformar o projeto em um redesign.

## Estado

- **Publicação:** pública e autorizada
- **URL:** https://biya-landing.zaratakion.workers.dev/
- **Idiomas:** PT-BR / EN, um por vez
- **Direção visual:** Parallel Worlds · Crystal × Ghost
- **Política de artes:** `/art-policy.html`
- **Indexação:** pública; crawlers conhecidos de treinamento de IA recebem opt-out em `robots.txt`

## Experiência

- troca interativa Crystal / Ghost;
- movimento ambiental contínuo e discreto;
- partículas e sigilos que mudam de comportamento entre os dois mundos;
- parallax suave com ponteiro e scroll;
- entrada progressiva das seções;
- galeria interativa com teclado, swipe e modal;
- microinterações em streams, links e controles;
- suporte a `prefers-reduced-motion`.

## Direitos

Biya autorizou a exibição dos materiais selecionados neste site. Isso não transfere direitos autorais para o projeto nem cria uma licença de reutilização para terceiros.

A política pública proíbe, sem permissão aplicável, repost, edição, uso comercial, scraping para datasets, treinamento, fine-tuning, LoRA e uso do material como entrada ou referência para geração de imagens por IA.

## Compartilhamento

Open Graph e Twitter Card usam o próprio universo visual do projeto para gerar preview ao compartilhar a URL no Discord e outras plataformas.

## Executar localmente

```powershell
cd biya-landing
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000`.

## Testes

```powershell
python -m unittest discover -s tests
python tests/browser_smoke.py
```

O segundo teste requer Playwright e Chromium.
