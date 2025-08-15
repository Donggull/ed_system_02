import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ],
  },
  // 환경 변수가 없을 때도 빌드가 성공하도록 설정
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
  },
  // 정적 파일 생성을 위한 설정
  trailingSlash: false,
  // TypeScript 에러가 있어도 빌드를 계속 진행
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint 에러가 있어도 빌드를 계속 진행
  eslint: {
    ignoreDuringBuilds: false,
  }
};

export default nextConfig;
