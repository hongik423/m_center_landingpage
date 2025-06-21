import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import FloatingChatbot from '@/components/layout/floating-chatbot';

const inter = Inter({ subsets: ['latin'] });

// 🔧 서버 사이드에서 안전한 환경 감지
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://hongik423.github.io/m_center_landingpage' 
    : 'http://localhost:3000'),
  title: 'M-CENTER | 기업의별 경영지도센터',
  description: '25년 경험의 전문 경영컨설팅. BM ZEN 사업분석, AI 생산성향상, 경매활용 공장구매 등 6대 핵심서비스로 기업 성장을 돕습니다.',
  keywords: 'M-CENTER, 기업의별, 경영컨설팅, BM ZEN, AI 생산성, 경매 공장구매, 기술창업, 인증지원',
  authors: [{ name: 'M-CENTER', url: 'https://m-center.kr' }],
  openGraph: {
    title: 'M-CENTER | 기업의별 경영지도센터',
    description: '25년 경험의 전문 경영컨설팅으로 기업 성장을 돕습니다',
    url: 'https://m-center.kr',
    siteName: 'M-CENTER',
    images: [
      {
        url: `${basePath}/company-star-logo.svg`,
        width: 1200,
        height: 630,
        alt: 'M-CENTER 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M-CENTER | 기업의별 경영지도센터',
    description: '25년 경험의 전문 경영컨설팅으로 기업 성장을 돕습니다',
    images: [`${basePath}/company-star-logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 🔧 UTF-8 인코딩 명시적 설정 - GitHub Pages 한글 깨짐 방지 */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="Content-Language" content="ko" />
        
        {/* 🔧 모바일 뷰포트 최적화 */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        
        {/* 🔧 캐시 무효화를 위한 메타 태그들 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="last-modified" content={new Date().toISOString()} />
        <meta name="version" content={`v${Date.now()}`} />
        
        {/* 🔧 리소스 프리로딩 최적화 - 즉시 사용되는 이미지만 preload */}
        {/* star-counselor-icon.svg는 사용자가 챗봇 클릭 시에만 필요하므로 preload 제거 */}
        
        {/* EmailJS 라이브러리 로드 */}
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
          async
        />
        
        {/* 🔧 한글 폰트 프리로드 - GitHub Pages 한글 렌더링 최적화 */}
        <link 
          rel="preload" 
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" 
          as="style" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css" 
          as="style" 
          crossOrigin="anonymous"
        />
        
        {/* 🔧 성능 최적화: DNS 프리페치 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//script.google.com" />
        <link rel="dns-prefetch" href="//generativelanguage.googleapis.com" />
        
        {/* 🛡️ 보안 헤더는 next.config.ts에서 HTTP 헤더로 설정 */}
      </head>
      <body className={inter.className} suppressHydrationWarning>        
        <Providers>
          {children}
          <FloatingChatbot />
        </Providers>
      </body>
    </html>
  );
}
