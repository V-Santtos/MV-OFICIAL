# Git · Deploy · Vercel · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)

- **Repositório = `site-mv/`** (o `MV-OFICIAL` pai NÃO é repo). Branch **`main`**.
- ✅ **JÁ está no GitHub (Public) e EM PRODUÇÃO:** remote **`V-Santtos/MV-OFICIAL`** → deploy **`mv-one-weld.vercel.app`**. Versão segura garantida.
- **Fluxo:** o dev continua no **localhost**; `git push` + redeploy quando cada bloco fechar. Deploy **não é mais** "o último passo de tudo".
- `assets-originais/` (originais das fotos/vídeos) é **versionado de propósito** como backup — fica fora de `public/`, não vai pro deploy. `.gitignore` cobre `node_modules/.next/.env*/.vercel`.
- 🚩 **A conferir na Vercel:** `NEXT_PUBLIC_SITE_URL` real setada (alimenta canonical, OG e sitemap) — checar se ficou no valor certo ou ainda no provisório.
- 🚩 **`probes/` e o `playwright` ficam FORA do repo, de propósito (blindado 2026-08-02).** `.gitignore` cobre `/probes/` inteiro (só cobria `/probes/out/` antes — os `.mjs` iam entrar no commit). Motivo: a Vercel instala `devDependencies` no build, e o pacote `playwright` baixa ~130MB de browser no postinstall. **`package.json`/`package-lock.json` ficam de fora do commit** de propósito, mesmo tendo o `playwright` como devDependency real localmente. ⬜ **Efeito colateral aceito:** os dois arquivos ficam **permanentemente sujos** no `git status` local — não é erro, é o preço de manter a ferramenta. Se incomodar, o caminho é instalar o playwright fora do projeto (global) e limpar o `package.json`.
