import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    domains: ['yvqdhlnwsuwsdscjxuvs.supabase.co'],
  },
};

export default nextConfig;
