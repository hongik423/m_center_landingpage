import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vercel 최적화 설정
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 이미지 최적화
  images: {
    domains: ['picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 빌드 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
  
  // 환경변수 검증
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
};

export default nextConfig;
