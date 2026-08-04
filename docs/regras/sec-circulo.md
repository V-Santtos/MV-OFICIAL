# Seção: Círculo (transição CLARO→DARK) · ANEXO-REGRAS
> Legenda: 🐞 bug caro · 🚫 fechado · 🔑 princípio · 🚩 restrição · [← índice](ANEXO-REGRAS.md)
> 📱 O comportamento mobile reformulado está em [mobile.md](mobile.md) (bloco "CÍRCULO mobile").

Círculo escuro cresce com o scroll até cobrir a tela e emendar em Serviços. Seção `260vh` + palco sticky claro; texto por `clipPath: circle(...)`. Copy "Do cuidado *ao resultado*".
- ⚠️ **Centralização (não repetir):** círculo 150vmax → `position:absolute; top/left:50%; margin -75vmax`. **NÃO transform/grid** (o `scale` do Framer sobrescreve).
- ⚠️ **"Scroll morto" widescreen:** `scaleInput [0,0.11,0.34,0.985,1.0]` · `scaleOutput [0.1,0.1,0.28,0.775,0.95]` · `liftInput [0,0.2,0.34]` · `liftOutput [-100,-100,0]`. **Isto é o DESKTOP** — o **mobile tem mapa próprio** (`scaleInputMobile/scaleOutputMobile`, `y=0`, altura 180vh, fade de saída) trocado por `matchMedia`. Ver [mobile.md](mobile.md) "Mobile — Passe de seções".
