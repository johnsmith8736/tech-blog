import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Enables static exports
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
