'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './card';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ 
  size = 'md', 
  text = '로딩 중...', 
  fullScreen = false,
  className = ''
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <Card className="p-6">
          <CardContent className="pt-0">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return content;
}

export function LoadingPage({ text = '페이지를 불러오는 중...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

export default Loading; 