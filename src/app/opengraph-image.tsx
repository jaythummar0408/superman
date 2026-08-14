import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Free Online Tools`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 9999,
              border: "8px solid #818cf8",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}>{siteConfig.name}</div>
        </div>
        <div
          style={{
            fontSize: 38,
            color: "#a5b4fc",
            maxWidth: 920,
            textAlign: "center",
            display: "flex",
            lineHeight: 1.3,
          }}
        >
          120+ free, privacy-first online tools for developers &amp; designers
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 16,
            fontSize: 26,
            color: "#cbd5e1",
          }}
        >
          <span>Image</span>
          <span>·</span>
          <span>PDF</span>
          <span>·</span>
          <span>CSS</span>
          <span>·</span>
          <span>Text</span>
          <span>·</span>
          <span>Security</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
