'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // GitHub Pages 환경에서 자주 발생하는 오류들 로깅
    const isGitHubPages = typeof window !== 'undefined' && 
                         window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
      console.error('🔧 GitHub Pages 환경에서 오류 발생:', {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
    
    // 특정 오류 패턴 감지
    if (error.message.includes('Cannot read properties of undefined')) {
      console.warn('⚠️ 데이터 접근 오류 감지 - API 응답 구조 검증 필요');
    }
    
    if (error.message.includes('data')) {
      console.warn('⚠️ data 속성 관련 오류 감지 - 안전한 데이터 접근 패턴 적용 권장');
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // GitHub Pages 환경 감지
      const isGitHubPages = typeof window !== 'undefined' && 
                           window.location.hostname.includes('github.io');
      
      // 데이터 관련 오류 감지
      const isDataError = this.state.error?.message.includes('Cannot read properties of undefined') ||
                         this.state.error?.message.includes('data');

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-900">
                {isDataError ? '🔧 데이터 처리 오류' : '시스템 오류가 발생했습니다'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 text-center">
                {isDataError ? (
                  <div>
                    <p className="mb-2">
                      API 응답 데이터 처리 중 오류가 발생했습니다.
                    </p>
                    {isGitHubPages && (
                      <p className="text-blue-600 bg-blue-50 p-2 rounded">
                        💡 GitHub Pages 환경에서 발생할 수 있는 일시적 문제입니다.
                      </p>
                    )}
                  </div>
                ) : (
                  <p>
                    예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                  </p>
                )}
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-red-600">스택 트레이스 보기</summary>
                      <pre className="text-xs mt-1 whitespace-pre-wrap text-red-700">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  페이지 새로고침
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="outline"
                  className="w-full"
                >
                  홈으로 돌아가기
                </Button>
                
                {isDataError && (
                  <Button 
                    onClick={() => window.location.href = '/services/diagnosis'} 
                    variant="outline"
                    className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    새로운 진단 시작하기
                  </Button>
                )}
              </div>
              
              {isGitHubPages && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-1">🔧 GitHub Pages 환경 안내:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>정적 배포 환경에서 일부 기능이 제한될 수 있습니다</li>
                    <li>새로고침으로 대부분의 문제가 해결됩니다</li>
                    <li>문제가 지속되면 010-9251-9743으로 연락주세요</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 