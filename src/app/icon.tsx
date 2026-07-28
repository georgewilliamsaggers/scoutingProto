import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 96,
        }}
      >
        <div
          style={{
            fontSize: 160,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -4,
          }}
        >
          Ag
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 36,
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: 6,
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
