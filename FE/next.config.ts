import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typescript.ignoreBuildErrors intentionally left off so type errors
  // fail the build instead of shipping silently to production.
};

export default nextConfig;
