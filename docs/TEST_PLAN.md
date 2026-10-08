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
