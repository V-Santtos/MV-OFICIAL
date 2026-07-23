import { ImageResponse } from "next/og";
import { brand } from "@/content";
import { siteConfig } from "@/lib/seo";

// Imagem OG gerada (1200x630). Marca dark premium + azul de destaque.
// Fase 2: quando houver arte final, trocar por um asset desenhado.
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0e14 0%, #0f141b 100%)",
          color: "#F3F7FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#3965C8" }} />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#3965C8",
            }}
          >
            Estética Automotiva
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 28 }}>
          {brand.name}
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#aab7c4", marginTop: 24, maxWidth: 900 }}>
          Cuidado que vai além da estética. {brand.location}.
        </div>
      </div>
    ),
    { ...size },
  );
}
