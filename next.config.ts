import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static ships a native binary — this stops webpack from trying
  // to bundle/mangle it, which is what Vercel's own ffmpeg-on-vercel
  // reference project recommends.
  serverExternalPackages: ["ffmpeg-static"],
};

export default nextConfig;
