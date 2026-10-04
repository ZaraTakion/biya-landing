# Fluxo Git e revisão antes da publicação

O repositório existente `ZaraTakion/biya-landing` é público. Uma branch separada impede a substituição automática da `main`, mas **não torna artes e código confidenciais**. Decida junto à Biya se as obras novas podem ser disponibilizadas publicamente antes de executar qualquer `git push`.

## Trabalhar com o pacote sem publicar
1. Extraia o projeto numa pasta de trabalho **fora do repositório público**.
2. Use `python -m http.server 8000 --bind 127.0.0.1` para inspeção local.
3. Execute os testes conforme `README.md` e solicite aprovação de conteúdo, autoria e créditos.

## Depois da autorização para compartilhar em repositório público
Num clone limpo do repositório GitHub, com a branch `feat/parallel-worlds-v02` selecionada, substitua os arquivos versionados pelos arquivos deste pacote (exceto `.git`). Depois revise o `git diff --stat`, `git status`, rode os testes e só então:

```powershell
git add -A
git commit -m "refactor: modularize Biya site and validate pt/en interactions"
git push -u origin feat/parallel-worlds-v02
```

Abra um PR para análise, **sem merge** em `main`. Não configure deploy de branches de revisão. As URLs sociais e os títulos de vídeos/obras precisam ser conferidos.

Publicar na versão principal só com autorização expressa da Biya, checklist editorial completo e critérios de qualidade aprovados.
