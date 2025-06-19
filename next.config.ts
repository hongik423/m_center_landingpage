import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'm_center_landingpage';

const nextConfig: NextConfig = {
  // ⚠️ 중요: 개발 환경에서는 절대 static export 사용하지 않음
  // GitHub Pages 배포 시에만 static export 활성화
  ...(isProd && isGitHubPages && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'out',
  }),
  
  // 이미지 최적화 설정
  images: {
    unoptimized: isProd && isGitHubPages,
    domains: ['picsum.photos', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.github.io',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  
  // GitHub Pages용 경로 설정 (GitHub Pages 배포 시에만)
  basePath: (isProd && isGitHubPages) ? `/${repoName}` : '',
  assetPrefix: (isProd && isGitHubPages) ? `/${repoName}/` : '',
  
  // 환경변수 설정
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BASE_PATH: (isProd && isGitHubPages) ? `/${repoName}` : '',
    NEXT_PUBLIC_IS_GITHUB_PAGES: isGitHubPages ? 'true' : 'false',
  },
  
  // 개발 환경에서 Fast Refresh 최적화
  ...(!isProd && {
    reactStrictMode: true,
    swcMinify: true,
  }),
  
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
    // 개발 환경에서 서버 컴포넌트 디버깅
    ...(!isProd && {
      serverComponentsExternalPackages: ['openai'],
    }),
  },
  
  // 웹팩 설정
  webpack: (config, { dev, isServer }) => {
    // AI 관련 라이브러리 최적화
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    // 개발 환경에서 API 라우트 호환성 강화
    if (dev && !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    // GitHub Pages 환경에서 발생할 수 있는 모듈 해결 문제 처리
    if (isProd && isGitHubPages) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
      
      // 소스맵 최적화
      config.devtool = false;
      
      // 번들 크기 최적화
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // GitHub Pages 배포 시에만 추가 설정
  ...(isProd && isGitHubPages && {
    generateEtags: false,
    compress: true,
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  // 개발 환경 최적화
  ...(!isProd && {
    // 개발 서버 설정
    devIndicators: {
      buildActivity: true,
      buildActivityPosition: 'bottom-right',
    },
    // 빠른 새로고침
    fastRefresh: true,
  }),
};

export default nextConfig;
