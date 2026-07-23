import {
  Hero,
  Posicionamento,
  Sobre,
  Circulo,
  Servicos,
  Processo,
  Depoimentos,
  Contato,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Posicionamento />
      {/* Etapa 1 da ilha clara (Victor, 2026-07-16) — posição provisória p/ teste. */}
      <Sobre />
      {/* Transição claro → dark (círculo Drive Luxury) — provisória, após a ilha clara. */}
      <Circulo />
      <Servicos />
      <Processo />
      <Depoimentos />
      <Contato />
    </>
  );
}
