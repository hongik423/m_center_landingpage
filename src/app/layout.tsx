import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: '기업의별 경영지도센터 | Business Model Zen 프레임워크 기반 기업 성장 솔루션',
  description: 'AI활용, 공장구매, 기술창업, 인증지원, 웹사이트구축 - 5대 영역 통합 솔루션으로 기업 성장을 지원하는 전문 컨설팅 플랫폼',
  keywords: '경영컨설팅, AI활용, 공장구매, 기술창업, 인증지원, 웹사이트구축, Business Model Zen, 기업의별',
  authors: [{ name: '기업의별 경영지도센터' }],
  openGraph: {
    title: '기업의별 경영지도센터',
    description: 'Business Model Zen 프레임워크로 기업 성장의 5단계를 완성하세요',
    type: 'website',
    locale: 'ko_KR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
