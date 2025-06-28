import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingChatbot from '@/components/layout/floating-chatbot';

const inter = Inter({ subsets: ['latin'] });

// 안정성을 위한 단순화

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app'
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
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app',
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
        
        {/* 🔧 최적화된 캐시 설정 */}
        <meta name="version" content="2.0" />
        
        {/* 🔧 한글 폰트 최적화 - Pretendard만 사용 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
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
        
        {/* Vercel 배포 최적화 설정 */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://m-center-landingpage.vercel.app'} />
        
        {/* 전역 에러 처리 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                // ChunkLoadError 처리
                if (e.error && (e.error.name === 'ChunkLoadError' || e.message.includes('ChunkLoadError'))) {
                  console.log('전역 ChunkLoadError 감지됨. 페이지를 새로고침합니다...');
                  window.location.reload();
                  return;
                }
                
                // content.js 관련 에러 무시 (브라우저 확장 프로그램 관련)
                if (e.filename && e.filename.includes('content.js')) {
                  console.log('브라우저 확장 프로그램 에러 무시:', e.message);
                  e.preventDefault();
                  return;
                }
              });
              
              // Promise rejection 에러 처리
              window.addEventListener('unhandledrejection', function(e) {
                // message port 관련 에러 무시
                if (e.reason && e.reason.message && 
                    e.reason.message.includes('message port closed')) {
                  console.log('확장 프로그램 통신 에러 무시:', e.reason.message);
                  e.preventDefault();
                  return;
                }
              });
            `
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>        
        <Providers>
          <div className="min-h-screen flex flex-col" suppressHydrationWarning>
            <Header />
            <main className="flex-1" suppressHydrationWarning>
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
