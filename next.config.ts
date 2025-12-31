import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['rctbmdmtaqehxecuqfaa.supabase.co'],
  },
};

export default nextConfig;
