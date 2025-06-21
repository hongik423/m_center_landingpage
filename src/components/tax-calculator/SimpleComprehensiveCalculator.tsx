'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

export default function SimpleComprehensiveCalculator() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-50 p-2 rounded-xl">
              <PieChart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                종합소득세 계산기
              </CardTitle>
              <CardDescription className="text-gray-600">
                2024년 세율 기준 · 다양한 소득 유형 통합 계산
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            종합소득세 계산기가 정상적으로 로드되었습니다
          </h3>
          <p className="text-gray-600">
            현재 기본 버전이 표시되고 있습니다. 전체 기능을 이용하려면 새로고침해주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 