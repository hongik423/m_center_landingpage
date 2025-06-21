'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StepIndicator } from '@/components/ui/step-indicator';
import { 
  Calculator, 
  FileText, 
  Download, 
  Share2, 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorStep {
  id: string;
  title: string;
  description: string;
}

interface CalculatorWrapperProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  steps: CalculatorStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onCalculate?: () => void;
  onBack?: () => void;
  showResults?: boolean;
  results?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  canCalculate?: boolean;
}

export function CalculatorWrapper({
  title,
  description,
  icon: Icon = Calculator,
  steps,
  currentStep,
  onStepChange,
  onCalculate,
  onBack,
  showResults = false,
  results,
  children,
  className,
  canCalculate = true,
}: CalculatorWrapperProps) {
  const [isCalculating, setIsCalculating] = useState(false);

  const stepsWithStatus = steps.map((step, index) => ({
    ...step,
    isCompleted: index < currentStep,
    isActive: index === currentStep,
  }));

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleCalculate = async () => {
    if (!onCalculate) return;
    
    setIsCalculating(true);
    try {
      await onCalculate();
    } catch (error) {
      console.error('계산 중 오류 발생:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          )}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600">{description}</p>
            </div>
          </div>
        </div>
        <Badge variant="secondary">2024년 기준</Badge>
      </div>

      {/* 진행 단계 표시 */}
      {!showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              계산 진행 단계
            </CardTitle>
            <CardDescription>
              아래 단계를 순서대로 진행하여 정확한 세금을 계산하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator steps={stepsWithStatus} />
          </CardContent>
        </Card>
      )}

      {/* 사용법 안내 */}
      {currentStep === 0 && !showResults && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              계산기 사용법
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">정확한 정보 입력</h4>
                  <p className="text-sm text-gray-600">필수 입력값을 정확히 입력하세요</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">단계별 진행</h4>
                  <p className="text-sm text-gray-600">각 단계를 순서대로 완료하세요</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">결과 확인</h4>
                  <p className="text-sm text-gray-600">계산 결과와 절세 방법을 확인하세요</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">보고서 출력</h4>
                  <p className="text-sm text-gray-600">필요시 계산 보고서를 출력하세요</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 메인 컨텐츠 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {!showResults ? (
                  <>
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {currentStep + 1}
                    </span>
                    {steps[currentStep]?.title}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    계산 완료
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {!showResults ? steps[currentStep]?.description : '세금 계산이 완료되었습니다.'}
              </CardDescription>
            </div>
            {showResults && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PDF 저장
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  공유
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showResults ? results : children}
        </CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      {!showResults && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 단계
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNextStep}>
                다음 단계
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCalculate} 
                disabled={isCalculating || !canCalculate}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                {isCalculating ? '계산 중...' : '세금 계산하기'}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 주의사항 */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-900">계산 결과 주의사항</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• 본 계산기는 참고용이며, 실제 세무 신고시에는 전문가와 상담하시기 바랍니다.</li>
                <li>• 개인별 특수 상황은 별도로 고려되어야 할 수 있습니다.</li>
                <li>• 세법 개정에 따라 계산 결과가 달라질 수 있습니다.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 