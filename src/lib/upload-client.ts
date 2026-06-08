export interface UploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
}

/**
 * Uploads a file directly to Cloudinary using a server-generated signature.
 * Bypasses Next.js / Vercel serverless body-size limits — essential for video.
 */
export async function uploadDirectToCloudinary(
  file: File,
  opts: {
    resourceType: "image" | "video";
    folder?: string;
    onProgress?: (pct: number) => void;
  }
): Promise<UploadResult> {
  // Step 1 — get signature from our server
  const sigRes = await fetch("/api/admin/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resourceType: opts.resourceType,
      folder: opts.folder,
    }),
  });
  if (!sigRes.ok) {
    const data = await sigRes.json().catch(() => ({}));
    throw new Error(data.error || "Could not get upload signature");
  }
  const { signature, timestamp, apiKey, folder, uploadUrl } = await sigRes.json();

  // Step 2 — upload directly to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) {
        opts.onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.secure_url) {
          resolve({
            url: json.secure_url,
            publicId: json.public_id,
            resourceType: opts.resourceType,
            format: json.format,
            width: json.width,
            height: json.height,
            duration: json.duration,
          });
        } else {
          reject(new Error(json.error?.message || `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error("Invalid response from Cloudinary"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}
