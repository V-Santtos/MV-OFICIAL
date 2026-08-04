# Decisões travadas de produto/visual (não reabrir) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

- ✅ Projeto em `MV-OFICIAL/site-mv/`; case externo congelado e só leitura. Só skills da MV-OFICIAL.
- ✅ Next.js estável + App Router + TS + Tailwind v4. **shadcn = Fase 2.** Sem backend agora.
- ✅ **Framer Motion centralizado**; **GSAP só na abertura** (e menu mobile); **Lenis** global.
- ✅ **Paleta:** accent **Royalblue `#3965C8`** · base dark **`#1C1C1C`** (ramp `--bg-0`→`--bg-3`, texto `--text-1`→`--text-4`). **Inter** + **Birthstone** (`--font-script`). Ilhas claras `#f4f4f2`/`#1c1c1c`.
- 🚩 **Princípios visuais:** 100% dark, limpo, minimalista · **azul só p/ o ESSENCIAL** (eyebrow, 1 palavra, CTA, foco), nunca em texto corrido · o "tecnológico" vem dos EFEITOS, não da cor · **vão vazio ≠ sofisticação**.
- ✅ **Sem Google Cloud/faturamento** no projeto (mapa por iframe).
- 🚫 **`aggregateRating` NÃO entra** no JSON-LD, mesmo com 5,0★ reais (rich results proíbe avaliação autosservida em LocalBusiness).
- ⚠️ **Tensão conhecida (não é bug):** o schema é `AutoWash` (lava-jato) porque o schema.org não tem tipo p/ estética/detalhamento — é o vizinho mais próximo.
- 🔑 **"Tirar" pedido pelo Victor = OCULTAR, nunca apagar** (repetiu 3× numa sessão). Um **número ou flag** controla melhor que apagar código/conteúdo, porque a resposta futura pode não ser "tudo ou nada" e reverter vira trocar 1 valor. Aplicado em: cases placeholder por número (`PLACEHOLDERS_VISIVEIS`, ver [sec-rota-servico.md](sec-rota-servico.md)) · depoimentos com campo `real` nunca renderizado (ver [sec-depoimentos.md](sec-depoimentos.md)) · Círculo oculto no mobile via `display:none`, calibração intacta (ver [mobile.md](mobile.md)).
