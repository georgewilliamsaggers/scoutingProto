import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #84bd00 0%, #00a8b5 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -2,
          }}
        >
          Ag
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          Scout
        </div>
      </div>
    ),
    { ...size }
  );
}
