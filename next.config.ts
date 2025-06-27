import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置
  output: 'export',

  // TypeScript 配置
  typescript: {
    ignoreBuildErrors: true,
  },

  // 图片优化配置（静态导出需要禁用）
  images: {
    unoptimized: true,
  },

  // 确保静态导出时的路径处理
  trailingSlash: true,

  // 禁用服务器端功能，确保完全静态
  experimental: {
    // 其他实验性功能可以在这里配置
  },

  // 优化构建输出
  compress: true,

  // 确保资源路径正确（Cloudflare Pages 兼容）
  assetPrefix: '',
  basePath: '',
};

export default nextConfig;
