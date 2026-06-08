import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

// Vercel's serverless functions cap body size at ~4.5MB on hobby tier.
// We limit image uploads to 5MB and recommend Cloudinary handle compression.
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  // Verify Cloudinary is configured
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
      },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP and AVIF images are allowed." },
        { status: 400 }
      );
    }

    // Convert File → Buffer → base64 data URI for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const { url, publicId } = await uploadImage(dataUri, "kapur-ghar/products");

    return NextResponse.json({ url, publicId }, { status: 201 });
  } catch (error) {
    console.error("Upload API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
