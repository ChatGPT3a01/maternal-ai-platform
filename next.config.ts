import type { NextConfig } from "next";

// 部署目標：'ghpages'（預設，含 basePath） 或 'netlify'（根目錄）
// 用法：DEPLOY_TARGET=netlify npm run build
const deployTarget = process.env.DEPLOY_TARGET || 'ghpages';
const isNetlify = deployTarget === 'netlify';

const nextConfig: NextConfig = {
  // 靜態輸出模式（同時適用於 GitHub Pages 與 Netlify）
  output: 'export',

  // 只有 GitHub Pages 部署時才需要 basePath（因為部署在 /maternal-ai-platform 子路徑）
  ...(isNetlify ? {} : { basePath: '/maternal-ai-platform' }),

  // 圖片優化配置（靜態匯出不支援 Next.js 圖片優化）
  images: {
    unoptimized: true,
  },

  // 尾隨斜線（避免靜態主機路由問題）
  trailingSlash: true,
};

export default nextConfig;
