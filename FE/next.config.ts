import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typescript.ignoreBuildErrors intentionally left off so type errors
  // fail the build instead of shipping silently to production.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
