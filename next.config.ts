import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  optimizeFonts: {
    inlineFonts: true,
  },
};

export default nextConfig;
