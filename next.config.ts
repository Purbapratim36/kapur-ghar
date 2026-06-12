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
  // Packages that should NOT be bundled by Next.js — they have dynamic requires
  // or native Node.js deps that break Vercel's bundler. Left as runtime requires.
  serverExternalPackages: [
    "firebase-admin",
    "@google-cloud/firestore",
    "@grpc/grpc-js",
    "google-gax",
    "google-auth-library",
    "farmhash-modern",
    "nodemailer",
    "razorpay",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
