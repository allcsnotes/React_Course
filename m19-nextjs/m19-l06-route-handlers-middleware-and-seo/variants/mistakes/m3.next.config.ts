import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
  },
  cacheComponents: true,
  partialPrefetching: false,
};

export default nextConfig;
