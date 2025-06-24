import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Vercel 최적화 설정
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // 정적 자산 경로 최적화
  trailingSlash: false,
  
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
  
  // HTTP 헤더 최적화
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // 라우팅 최적화
  async rewrites() {
    return [
      {
        source: '/services/tech-startup',
        destination: '/services/tech-startup',
      },
    ];
  },
  
  // Webpack 설정 - 경로 매핑 해결
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    };
    return config;
  },
  
  // 환경변수 검증
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },
};

export default nextConfig;
