import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = 'm_center_landingpage';

const nextConfig: NextConfig = {
  // GitHub Pages 배포 시에만 static export 활성화
  ...(isProd && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
  }),
  
  // 이미지 최적화 설정
  images: {
    unoptimized: true,
    domains: ['picsum.photos', 'images.unsplash.com'],
  },
  
  // GitHub Pages용 경로 설정 (프로덕션에서만)
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  
  // 환경변수 설정
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 타입스크립트 설정
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 실험적 기능
  experimental: {
    // AI 챗봇 성능 최적화
    optimizePackageImports: ['lucide-react'],
  },
  
  // 웹팩 설정
  webpack: (config) => {
    // AI 관련 라이브러리 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
