import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any HTTPS host. This way you can paste image URLs from
    // anywhere (Cloudinary, Unsplash, Pexels, Amazon, your own host, etc.)
    // without having to whitelist every domain.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
