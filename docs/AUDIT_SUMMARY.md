# Auditoria V5 — BIYA / Parallel Worlds

## Estado

Migração concluída para React + TypeScript + Vite.

## Mudanças principais

- runtime vanilla JS removido;
- estado e interações migrados para React;
- Crystal/Ghost transformados em estados de identidade com motion distinto;
- Parallel Pulse criado como minijogo autoral;
- Easter Egg adicionado com base em comportamento público verificável da Biya;
- política de uso das artes migrada para React;
- site marcado como público/final;
- Open Graph e Discord preview preservados;
- proteção em camadas aplicada às artes;
- cinco baterias automatizadas no GitHub Actions.

## Limite técnico importante

Nenhum site público consegue garantir que uma imagem exibida no navegador nunca será copiada. O projeto reduz exposição e comunica/protege direitos, mas não representa essas medidas como DRM.

## Produção

- Worker: `biya-prism`
- URL canônica: https://biya-prism.zaratakion.workers.dev/
- 404: personalizado e não indexável
- CSP: sem `unsafe-inline`
