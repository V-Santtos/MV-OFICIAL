"use client";

import { useEffect } from "react";
import { capturarAtribuicao } from "@/lib/lead/atribuicao";

/**
 * Guarda UTMs e `fbclid` da URL de ENTRADA (ver `lib/lead/atribuicao.ts`).
 * Headless e montado no layout: roda uma vez por carregamento, em qualquer
 * rota, pra campanha não se perder quando o visitante entra pela home e só
 * preenche o formulário numa página de serviço.
 */
export function AtribuicaoCaptura() {
  useEffect(() => {
    capturarAtribuicao();
  }, []);

  return null;
}
