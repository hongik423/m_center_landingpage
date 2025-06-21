'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InputGuideProps {
  label: string;
  description?: string;
  required?: boolean;
  value?: string | number;
  error?: string;
  success?: string;
  hint?: string;
  example?: string;
  unit?: string;
  children: React.ReactNode;
  className?: string;
}

export function InputGuide({
  label,
  description,
  required = false,
  value,
  error,
  success,
  hint,
  example,
  unit,
  children,
  className,
}: InputGuideProps) {
  const hasValue = value !== undefined && value !== '' && value !== 0;
  const hasError = !!error;
  const hasSuccess = !!success && hasValue && !hasError;

  return (
    <div className={cn('space-y-2', className)}>
      {/* 라벨 및 필수 표시 */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
          {label}
          {required && (
            <span className="text-red-500 text-xs bg-red-50 px-1.5 py-0.5 rounded">
              필수
            </span>
          )}
          {unit && (
            <span className="text-gray-500 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
              {unit}
            </span>
          )}
        </label>
        
        {(description || hint || example) && (
          <TooltipProvider>
            <Tooltip>
                             <TooltipTrigger asChild>
                 <button 
                   type="button" 
                   className="text-gray-400 hover:text-gray-600"
                   title="도움말 보기"
                   aria-label="도움말 보기"
                 >
                   <HelpCircle className="w-4 h-4" />
                 </button>
               </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {description && <p className="mb-2">{description}</p>}
                {hint && (
                  <p className="text-blue-600 text-sm">
                    💡 {hint}
                  </p>
                )}
                {example && (
                  <p className="text-gray-500 text-sm mt-2">
                    예시: {example}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* 입력 필드 */}
      <div className="relative">
        {children}
        
        {/* 상태 아이콘 */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {hasSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
      </div>

      {/* 메시지 */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && !error && (
        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {hint && !error && !success && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
          <Info className="w-4 h-4 shrink-0" />
          <span>{hint}</span>
        </div>
      )}
    </div>
  );
} 