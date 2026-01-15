import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 靜態輸出模式（用於 GitHub Pages）
  output: 'export',

  // GitHub Pages 部署路徑（倉庫名稱）
  basePath: '/maternal-ai-platform',

  // 圖片優化配置
  images: {
    unoptimized: true, // GitHub Pages 不支援 Next.js 圖片優化
  },

  // 尾隨斜線（避免 GitHub Pages 路由問題）
  trailingSlash: true,
};

export default nextConfig;
