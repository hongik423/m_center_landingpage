// In Next.js, this file would be called: app/providers.tsx
'use client';

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ui/error-boundary';
import { useEffect, useState } from 'react';
import { validateEnv, logEnvStatus, isDevelopment } from '@/lib/config/env';
import { initEmailJS } from '@/lib/utils/emailService';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isEnvValid, setIsEnvValid] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            gcTime: 5 * 60 * 1000, // 5분 (cacheTime → gcTime으로 변경됨)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // 환경변수 검증 및 초기화
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 개발 환경에서만 상세 로깅
        if (isDevelopment()) {
          console.log('🚀 애플리케이션 초기화 중...');
        }

        // 환경변수 검증 (클라이언트 사이드용)
        const clientEnvCheck = {
          hasEmailJSServiceId: !!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          hasEmailJSPublicKey: !!process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
          hasGoogleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
        };

        const isClientEnvValid = Object.values(clientEnvCheck).every(Boolean);

        if (!isClientEnvValid) {
          console.warn('⚠️ 일부 환경변수가 설정되지 않았습니다:', {
            emailJS: clientEnvCheck.hasEmailJSServiceId && clientEnvCheck.hasEmailJSPublicKey,
            googleSheets: clientEnvCheck.hasGoogleSheetsId,
          });
        }

        // EmailJS 초기화
        const emailJSInitialized = initEmailJS();
        
        if (isDevelopment()) {
          logEnvStatus();
          console.log('📧 EmailJS 초기화:', emailJSInitialized ? '성공' : '실패');
        }

        setIsEnvValid(isClientEnvValid);
        setIsInitialized(true);

        if (isDevelopment()) {
          console.log('✅ 애플리케이션 초기화 완료');
        }

      } catch (error) {
        console.error('❌ 애플리케이션 초기화 실패:', error);
        setIsEnvValid(false);
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // 환경변수 오류 상태 UI
  if (isInitialized && !isEnvValid && isDevelopment()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-red-900 mb-2">
              환경변수 설정 필요
            </h2>
            <p className="text-red-700 mb-4 text-sm">
              일부 필수 환경변수가 설정되지 않았습니다.
              <br />
              개발을 계속하려면 <code className="bg-red-100 px-1 rounded">.env.local</code> 파일을 확인해주세요.
            </p>
            <div className="text-left bg-red-50 p-3 rounded mb-4">
              <p className="text-xs text-red-600 font-mono">
                필수 환경변수:
                <br />• NEXT_PUBLIC_EMAILJS_SERVICE_ID
                <br />• NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  
                <br />• NEXT_PUBLIC_GOOGLE_SHEETS_ID
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              설정 후 새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 초기화 중 로딩 화면
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">애플리케이션 초기화 중...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
      </QueryClientProvider>
    </ThemeProviderWrapper>
  );
}
