import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingChatbot from '@/components/layout/floating-chatbot';

const inter = Inter({ subsets: ['latin'] });

// GitHub Pages 기본 경로 설정
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? 'https://hongik423.github.io/m_center_landingpage' 
    : 'http://localhost:3000'
  ),
  title: {
    default: 'M-CENTER | AI 기업진단 및 경영컨설팅',
    template: '%s | M-CENTER'
  },
  description: 'M-CENTER 기업의별 경영지도센터 - AI 기반 무료 진단과 전문 컨설팅으로 중소기업 성장을 지원합니다.',
  keywords: [
    'M-CENTER', '기업진단', 'AI진단', '경영컨설팅', '중소기업', 
    '사업분석', 'BM ZEN', 'AI생산성', '공장경매', '기술창업', 
    '인증지원', '웹사이트구축', '세금계산기'
  ],
  authors: [{ name: 'M-CENTER 경영지도센터' }],
  creator: 'M-CENTER',
  publisher: 'M-CENTER',
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
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://hongik423.github.io/m_center_landingpage/',
    title: 'M-CENTER | AI 기업진단 및 경영컨설팅',
    description: 'AI 기반 무료 진단과 전문 컨설팅으로 중소기업 성장을 지원합니다.',
    siteName: 'M-CENTER',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M-CENTER | AI 기업진단 및 경영컨설팅',
    description: 'AI 기반 무료 진단과 전문 컨설팅으로 중소기업 성장을 지원합니다.',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
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
        
        {/* 🔧 한글 폰트 최적화 - GitHub Pages 한글 렌더링 */}
        <link 
          rel="preconnect" 
          href="https://cdn.jsdelivr.net" 
          crossOrigin="anonymous"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans@latest/css/SpoqaHanSansNeo.css"
        />
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        
        {/* 🔧 성능 최적화: DNS 프리페치 - Google Apps Script 기반 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//script.google.com" />
        <link rel="dns-prefetch" href="//generativelanguage.googleapis.com" />
        
        {/* PWA 메타 태그 */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="M-CENTER" />
        
        {/* GitHub Pages 특별 설정 */}
        {process.env.NEXT_PUBLIC_IS_GITHUB_PAGES === 'true' && (
          <>
            <meta property="og:url" content="https://hongik423.github.io/m_center_landingpage/" />
            <meta property="og:site_name" content="M-CENTER" />
            <link rel="canonical" href="https://hongik423.github.io/m_center_landingpage/" />
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>        
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingChatbot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
