# Seção: Depoimentos — título com beat + mural em cascata · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

Mural = marquee infinito vertical (3 colunas). Problema-raiz: nasce cheio e em movimento = anti-cascata.
- 🔑 **A cura é a CASCATA:** `columnCascade` revela as 3 colunas em stagger via `useInView` controlado. Fade do título 1.0s + gatilho a `-18%`.
- 🚫 **NÃO repetir — palco de tela cheia (`min-height:82vh`):** virou vão morto. **Vão vazio ≠ sofisticação; o sequenciamento vem do MOVIMENTO, não do espaço.**
- 🚩 **ORDEM DO ARRAY É LOAD-BEARING (9/9 depoimentos reais, 2026-08-01).** `Depoimentos.tsx` fatia em colunas fixas `slice(0,3)/slice(3,6)/slice(6,9)`. Mauriane (índice 4) e Thayná (índice 8) são as duas únicas Nivus e as duas falam "15 dias" — estão em colunas diferentes DE PROPÓSITO, com durações de scroll diferentes (28s vs 19s), pra nunca rolarem coladas. **Reordenar o array sem checar isso quebra a leitura da seção.**
- `content/depoimentos.ts` tem o campo interno `real: true/false` (nunca renderizado, mesma convenção do `placeholder` dos cases — ver [sec-rota-servico.md](sec-rota-servico.md)). Hoje **9/9 são reais**, zero placeholder.
- ⚠️ **Efeito colateral aceito, ainda em aberto:** os placeholders que saíram eram os únicos que falavam de PROCESSO (prazo, registro fotográfico, "não corta caminho"). Nenhum depoimento real fala isso — a seção ficou mais verdadeira e menos vendedora. **O argumento técnico de processo precisa ser recuperado em outra seção** (não decidido onde).
