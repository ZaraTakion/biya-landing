# Test Plan — Bateria de 5

## Battery 1 — TypeScript
`npm run battery:1`

Valida tipagem estrita e contratos dos componentes React.

## Battery 2 — Unit tests
`npm run battery:2`

Valida regras do Parallel Pulse, troca Crystal/Ghost, pontuação, combo, limites e contratos de conteúdo.

## Battery 3 — Production build
`npm run battery:3`

Gera `dist/` via Vite sem source maps.

## Battery 4 — Artwork/security audit
`npm run battery:4`

Confere CSP, headers, noimageindex, crawler opt-out, deterrence de drag/context menu, política anti-dataset/IA e quantidade limitada de assets públicos.

## Battery 5 — Release artifact audit
`npm run battery:5`

Confere o conteúdo gerado em `dist/`, metadados sociais, sitemap, robots, policy page e ausência de avisos de desenvolvimento.

## CI

`.github/workflows/quality.yml` executa as cinco baterias em cada push/PR para `main`.


## Revisão complementar de UX / acessibilidade (V5.2)

- [ ] Abrir a galeria por teclado, pressionar Tab e Shift+Tab, fechar com Escape e confirmar retorno do foco ao botão anterior.
- [ ] Acionar o Easter Egg por BIYA e pelo wordmark, fechar com Escape/toque e confirmar retorno do foco.
- [ ] Jogar Parallel Pulse com teclado e toque; confirmar que o coração branco raro soma bônus em Crystal e Ghost.
- [ ] Conferir ausência de scroll horizontal a 320px, 375px, 768px, 1440px e 3840px.
- [ ] Conferir alternância PT/EN e Crystal/Ghost com redução de movimento ativada.

O checklist manual complementa as cinco baterias automatizadas; não é marcado como concluído sem reprodução no navegador em cada resolução.
