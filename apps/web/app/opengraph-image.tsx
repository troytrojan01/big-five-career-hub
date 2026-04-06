import { ImageResponse } from "next/og";

export const alt = "Big Five Career Hub";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #fff8ec 0%, #d9f2ff 50%, #dff6e8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          color: "#111827",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.4em", textTransform: "uppercase" }}>Big Five Career Hub</div>
        <div style={{ marginTop: 28, fontSize: 68, fontWeight: 700, maxWidth: 900 }}>
          Big Tech jobs and interview prep in one focused product.
        </div>
      </div>
    ),
    size,
  );
}
