import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 개발 모드 최적화
  experimental: {
    turbo: undefined, // Turbopack 비활성화로 안정성 확보
  },
  
  // 기본 설정
  trailingSlash: false,
  
  // 이미지 최적화
  images: {
    domains: ['picsum.photos'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 웹팩 설정 최적화 - ChunkLoadError 방지
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 모드에서 캐시 무효화 강화
      config.cache = false;
      
      // 청크 로딩 에러 방지
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all'
            }
          }
        }
      };
    }
    return config;
  },
  
  // 성능 설정
  poweredByHeader: false,
  compress: true,
  
  // 에러 방지 설정
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
