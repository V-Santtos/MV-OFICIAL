# docs/ — contexto do projeto MV Estética Automotiva

Esta pasta é uma **cópia** da documentação que mora na pasta-mãe do projeto
(`MV-OFICIAL/`, um nível acima deste repositório). Ela existe aqui para que quem
clona o repo receba o contexto junto com o código — antes, esses arquivos ficavam
fora da fronteira do git e nunca subiam.

## O que é cada arquivo

| Arquivo | O que é |
|---|---|
| **`CLAUDE.md`** | Manual de operação do projeto: stack, direção visual, como codar aqui, protocolo de trabalho. **Comece por ele.** |
| **`ANEXO-MEMORIA.md`** | Estado vivo: o que está feito, o que está em andamento, o próximo passo, decisões pendentes. |
| **`regras/ANEXO-REGRAS.md`** | Índice das regras duráveis. Aponta pras fichas por área. |
| **`regras/*.md`** | Uma ficha por área (`sec-hero`, `sec-sobre`, `mobile`, `copy`, `01-stack-arquitetura`…) com o **porquê** de cada decisão travada e os erros que já custaram retrabalho. |

## Como ler

1. `CLAUDE.md` — as regras que valem sempre.
2. `ANEXO-MEMORIA.md` — onde o trabalho parou.
3. `regras/ANEXO-REGRAS.md` → abrir a ficha da área só quando a tarefa pedir.

## ⚠️ Duas ressalvas

**1. Os caminhos são relativos à pasta-mãe.** Os documentos foram escritos de dentro
de `MV-OFICIAL/`, então quando eles citam `site-mv/src/...` querem dizer a raiz
**deste** repositório — some o prefixo `site-mv/`. Da mesma forma, `regras/mobile.md`
aqui é `docs/regras/mobile.md`.

**2. Isto é cópia, não fonte.** A fonte segue em `MV-OFICIAL/`. Se você editar um
arquivo aqui, ele pode ser sobrescrito na próxima sincronização — leve a alteração
para a fonte também, ou avise o Victor.

## O que NÃO está aqui

- `probes/` (ferramentas Playwright de print e medição) — segue fora do repo por decisão de deploy.
- Pastas de material bruto (`GSAP/`, `IMPUT/`, `OUTPUT/`, `human-output/`) e o cache de skills.
