import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kapur Ghar product";

export default async function Image({ params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
  }).catch(() => null);

  const name = product?.name ?? "Kapur Ghar";
  const price = product ? `₹${product.price.toLocaleString("en-IN")}` : "";
  const fabric = product?.fabric ?? "Traditional Assamese Fashion";
  const imageUrl = product?.images?.[0]?.url ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #7a0000 0%, #CC0000 60%, #C5A258 100%)",
          color: "white",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Left side — title */}
        <div
          style={{
            flex: 1,
            padding: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#C5A258",
                marginBottom: 12,
              }}
            >
              {fabric}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {name.slice(0, 80)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {price && (
              <div style={{ fontSize: 40, fontWeight: 700 }}>{price}</div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 22,
                color: "#FFF8E7",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: "#CC0000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 18,
                  border: "2px solid #C5A258",
                }}
              >
                K
              </div>
              Kapur Ghar
            </div>
          </div>
        </div>
        {/* Right side — product image */}
        {imageUrl && (
          <div
            style={{
              width: 460,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 32,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 24,
                border: "4px solid #C5A258",
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
