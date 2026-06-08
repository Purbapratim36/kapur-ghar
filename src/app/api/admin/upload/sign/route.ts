import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

/**
 * Returns a signed Cloudinary upload payload. The browser uses this to upload
 * directly to Cloudinary, bypassing our serverless function's body-size limit.
 * Critical for videos which can be tens of MB.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary credentials not configured" },
      { status: 500 }
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  const body = await req.json().catch(() => ({}));
  const resourceType: "image" | "video" =
    body.resourceType === "video" ? "video" : "image";
  const folder: string = typeof body.folder === "string" ? body.folder : "kapur-ghar/hero";

  const timestamp = Math.round(Date.now() / 1000);

  // Parameters to sign (must match what the client sends)
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resourceType,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
  });
}
