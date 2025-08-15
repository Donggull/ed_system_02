import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Vercel 배포를 위해 일부 ESLint 경고 허용
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript 오류를 무시하지 않음
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true, // 외부 이미지 URL 허용
  },
};

export default nextConfig;
