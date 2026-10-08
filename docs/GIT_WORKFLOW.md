# Git workflow — BIYA / Parallel Worlds

## Produção

A `main` é a branch de produção do site autorizado pela Biya.

Antes de merge/push em `main`:
1. revisar o diff;
2. executar `npm run verify:five`;
3. confirmar que a política de artes continua acessível;
4. conferir que nenhum texto de desenvolvimento/pré-lançamento voltou;
5. conferir o deploy público.

## Desenvolvimento

Para mudanças grandes, use uma branch `feat/*`, execute a bateria de 5 e abra PR. Correções pequenas e autorizadas podem seguir o fluxo de manutenção da `main`.

## Assets e direitos

O repositório é público. Isso significa que qualquer arquivo versionado nele pode ser acessado por terceiros e o histórico Git pode preservar versões antigas. As proteções do site reduzem reutilização casual, mas não substituem um repositório privado nem funcionam como DRM.

Não adicione novas artes sem autorização de publicação e sem confirmar o titular aplicável.
