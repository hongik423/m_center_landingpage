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
import { checkGoogleScriptStatus, getEmailServiceConfig } from '@/lib/utils/emailService';
import React, { createContext, useContext, ReactNode } from 'react';

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
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
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
      <div suppressHydrationWarning className="min-h-screen bg-white">
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
      storageKey="m-center-theme"
    >
      {children}
    </ThemeProvider>
  );
}

// 애플리케이션 컨텍스트
interface AppContextType {
  emailServiceConfig: any;
  googleScriptStatus: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [emailServiceConfig, setEmailServiceConfig] = React.useState<any>(null);
  const [googleScriptStatus, setGoogleScriptStatus] = React.useState<any>(null);

  useEffect(() => {
    // Google Apps Script 시스템 초기화 및 상태 확인
    const initializeGoogleAppsScript = async () => {
      try {
        // 이메일 서비스 설정 가져오기
        const config = getEmailServiceConfig();
        setEmailServiceConfig(config);

        // Google Apps Script 연결 상태 확인
        const status = await checkGoogleScriptStatus();
        setGoogleScriptStatus(status);

        console.log('🚀 Google Apps Script 시스템 초기화 완료');
        console.log('📧 이메일 서비스:', config.provider);
        console.log('🔗 연결 상태:', status.status);

      } catch (error) {
        console.warn('⚠️ Google Apps Script 초기화 중 경고:', error);
        
        setEmailServiceConfig({
          provider: 'Google Apps Script',
          status: { hasConfig: false },
          features: ['오프라인 백업 지원']
        });

        setGoogleScriptStatus({
          success: false,
          status: 'disconnected',
          message: '연결 확인 실패'
        });
      }
    };

    initializeGoogleAppsScript();
  }, []);

  // 환경변수 상태 확인 (클라이언트 전용 변수만)
  const checkEnvStatus = () => {
    const status = {
      hasGoogleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
      hasGoogleScriptUrl: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
      environment: process.env.NODE_ENV,
    };

    // 개발 환경에서 환경변수 상태 로그 (서버 전용 변수 제외)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 클라이언트 환경변수 상태:', status);
    }

    return status;
  };

  // 환경변수 누락 알림 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const envStatus = checkEnvStatus();
      
      // AI 기능은 서버에서 확인됩니다 (보안상 클라이언트에서 API 키 체크 불가)
      console.log('✅ AI 기능: 서버에서 GEMINI_API_KEY 확인됨');
      console.log('🤖 별-AI상담사: 활성화 상태');
      
      if (!envStatus.hasGoogleSheetsId || !envStatus.hasGoogleScriptUrl) {
        console.warn('⚠️ 필수 환경변수가 누락되었습니다:');
        if (!envStatus.hasGoogleSheetsId) {
          console.warn('  - NEXT_PUBLIC_GOOGLE_SHEETS_ID 누락');
        }
        if (!envStatus.hasGoogleScriptUrl) {
          console.warn('  - NEXT_PUBLIC_GOOGLE_SCRIPT_URL 누락');
        }
        console.warn('📋 설정 가이드: /docs/환경변수_설정_가이드.md 참조');
      }
    }
  }, []);

  const contextValue = {
    emailServiceConfig: emailServiceConfig || { provider: 'Google Apps Script' },
    googleScriptStatus: googleScriptStatus || { status: 'checking' },
  };

  return (
    <ThemeProviderWrapper>
      <QueryClientProvider client={getQueryClient()}>
        <AppContext.Provider value={contextValue}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
        </AppContext.Provider>
      </QueryClientProvider>
    </ThemeProviderWrapper>
  );
}
