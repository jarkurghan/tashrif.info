import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogImage(input: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  const eyebrow = input.eyebrow ?? "tashrif.info";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1211",
          padding: "72px 80px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#2dd4bf",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0d9488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f0fdfa",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            t
          </div>
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#e8f0ee",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {input.title}
          </div>
          <div
            style={{
              color: "#9aada8",
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 860,
            }}
          >
            {input.subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: 8,
            width: 220,
            borderRadius: 8,
            background: "linear-gradient(90deg, #0d9488 0%, #d97706 100%)",
          }}
        />
      </div>
    ),
    { ...ogSize },
  );
}
