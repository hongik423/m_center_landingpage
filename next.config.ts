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
  
  // React Strict Mode 활성화
  reactStrictMode: true,
  
  // ESLint 설정 - 개발 중에는 무시하지 않음
  eslint: {
    ignoreDuringBuilds: isProd && isGitHubPages, // GitHub Pages 배포 시에만 무시
  },
  
  // 타입스크립트 설정 - 개발 중에는 무시하지 않음
  typescript: {
    ignoreBuildErrors: isProd && isGitHubPages, // GitHub Pages 배포 시에만 무시
  },
  
  // GitHub Pages는 정적 호스팅이므로 서버 기능 비활성화
  ...(!isGitHubPages && {
    // 🔧 리다이렉트 설정 (정적 파일 및 API 라우트 최적화)
    async redirects() {
      return [
        // 존재하지 않는 .txt 파일 요청을 메인 페이지로 리다이렉트
        {
          source: '/:path*.txt',
          destination: '/',
          permanent: false,
        }
      ];
    },

    // 🔧 리라이트 설정 
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        }
      ];
    },

    // 🔧 헤더 설정으로 CORS 및 보안 강화
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
            { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
            { key: 'Access-Control-Max-Age', value: '86400' },
          ],
        },
        // 정적 자산에 대한 캐싱 헤더
        {
          source: '/:path*.svg',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/:path*.png',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        // 존재하지 않는 .txt 파일에 대한 404 헤더
        {
          source: '/:path*.txt',
          headers: [
            { key: 'X-Robots-Tag', value: 'noindex' },
          ],
        }
      ];
    },
  }),
  
  // 서버 외부 패키지 설정 (GitHub Pages에서는 비활성화)
  ...(!isGitHubPages && {
    serverExternalPackages: ['openai'],
  }),
  
  // 실험적 기능
  experimental: {
    // AI 챗봇 성능 최적화
    optimizePackageImports: ['lucide-react'],
  },
  
  // 웹팩 설정
  webpack: (config, { dev, isServer }) => {
    // GitHub Pages 빌드 시 클라이언트 전용 라이브러리 처리
    if (isProd && isGitHubPages) {
      // 서버 사이드에서 브라우저 전용 모듈 제외
      if (isServer) {
        config.externals = [
          ...((config.externals as any[]) || []),
          '@emailjs/browser',
          'emailjs-com'
        ];
      }
      
      // 클라이언트 사이드 fallback 설정
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        stream: false,
        crypto: false,
        path: false,
        os: false,
        util: false,
        process: false,
        buffer: false,
      };
      
      // 소스맵 비활성화
      config.devtool = false;
    }
    
    return config;
  },
  
  // GitHub Pages 배포 시에만 추가 설정
  ...(isProd && isGitHubPages && {
    generateEtags: false,
    compress: true,
  }),
  
  // 개발 환경 최적화 (Next.js 15.3.4 호환)
  ...(!isProd && {
    // 개발 서버 설정
    devIndicators: {
      position: 'bottom-right',
    },
  }),
};

export default nextConfig;
