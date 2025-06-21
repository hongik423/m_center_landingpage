'use client';

import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  {
                    'bg-blue-600 border-blue-600 text-white': step.isCompleted,
                    'bg-blue-100 border-blue-600 text-blue-600': step.isActive && !step.isCompleted,
                    'bg-gray-100 border-gray-300 text-gray-400': !step.isActive && !step.isCompleted,
                  }
                )}
              >
                {step.isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    {
                      'text-blue-600': step.isActive || step.isCompleted,
                      'text-gray-500': !step.isActive && !step.isCompleted,
                    }
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 transition-colors duration-300',
                  {
                    'bg-blue-600': step.isCompleted,
                    'bg-gray-300': !step.isCompleted,
                  }
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
} 