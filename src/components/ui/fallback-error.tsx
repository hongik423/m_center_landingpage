'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, HelpCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface FallbackErrorProps {
  title?: string;
  message?: string;
  showRefresh?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  className?: string;
}

export function FallbackError({ 
  title = "오류가 발생했습니다",
  message = "예상치 못한 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.",
  showRefresh = true,
  showHome = true,
  onRetry,
  className = ""
}: FallbackErrorProps) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            {message}
          </p>
          
          <div className="space-y-2">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                다시 시도
              </Button>
            )}
            
            {showRefresh && (
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
                variant={onRetry ? "outline" : "default"}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                페이지 새로고침
              </Button>
            )}
            
            {showHome && (
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
                className="w-full"
              >
                <Home className="h-4 w-4 mr-2" />
                홈으로 돌아가기
              </Button>
            )}
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <HelpCircle className="h-3 w-3" />
              문제가 지속되면 관리자에게 문의하세요
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FallbackError; 