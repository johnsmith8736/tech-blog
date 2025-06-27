import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static exports
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
