'use client';

import { useState } from 'react';
import SimplifiedDiagnosisForm from '@/components/diagnosis/SimplifiedDiagnosisForm';
import SimplifiedDiagnosisResults from '@/components/diagnosis/SimplifiedDiagnosisResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Clock, BarChart3 } from 'lucide-react';

interface DiagnosisData {
  success: boolean;
  message: string;
  data: any;
  resultId: string;
  resultUrl: string;
}

export default function DiagnosisPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: 소개, 2: 폼, 3: 결과
  const [results, setResults] = useState<DiagnosisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiagnosisComplete = (data: DiagnosisData) => {
    setResults(data);
    setIsLoading(false);
    setCurrentStep(3);
  };

  const handleStartNew = () => {
    setResults(null);
    setCurrentStep(1);
  };

  const handleBackToIntro = () => {
    setCurrentStep(1);
  };

  const handleStartDiagnosis = () => {
    setCurrentStep(2);
  };

  // 단계 1: 시스템 소개
  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* 헤더 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              ⚡ 새로운 AI 간소화 진단
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              기존 복잡한 20여개 입력 항목과 2-3주 처리 시간을 
              <span className="font-bold text-blue-600"> 7개 핵심 정보와 2-3분 처리</span>로 혁신적으로 개선했습니다.
            </p>
          </div>

          {/* 개선 효과 비교 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-200">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">⚡ 처리 속도</h3>
                <div className="space-y-2">
                  <div className="text-gray-500 line-through">기존: 2-3주</div>
                  <div className="text-green-600 font-bold text-xl">신규: 2-3분</div>
                  <div className="text-sm text-green-600">99.9% 단축</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-blue-200">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">📝 입력 항목</h3>
                <div className="space-y-2">
                  <div className="text-gray-500 line-through">기존: 20+ 항목</div>
                  <div className="text-blue-600 font-bold text-xl">신규: 7개 항목</div>
                  <div className="text-sm text-blue-600">65% 간소화</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">📊 보고서</h3>
                <div className="space-y-2">
                  <div className="text-gray-500 line-through">기존: 5000자+</div>
                  <div className="text-purple-600 font-bold text-xl">신규: 2000자 요약</div>
                  <div className="text-sm text-purple-600">핵심 정보 집중</div>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 특징 */}
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              🎯 새로운 시스템의 핵심 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-3">🚀</div>
                <h4 className="font-bold text-lg mb-2">즉시 분석</h4>
                <p className="text-sm text-gray-600">실시간 AI 분석으로 즉시 결과 확인</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-bold text-lg mb-2">간단 입력</h4>
                <p className="text-sm text-gray-600">7개 핵심 정보만으로 정확한 진단</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-lg mb-2">맞춤 추천</h4>
                <p className="text-sm text-gray-600">6개 서비스 중 최적 조합 제시</p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-3">💾</div>
                <h4 className="font-bold text-lg mb-2">PDF 다운로드</h4>
                <p className="text-sm text-gray-600">전문 보고서 PDF 즉시 저장</p>
              </div>
            </div>
          </div>

          {/* 시작 버튼 */}
          <div className="text-center">
            <Button 
              onClick={handleStartDiagnosis}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              새로운 AI 진단 시작하기
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              ⚡ 7개 정보 입력 → 2-3분 분석 → 2000자 요약 보고서 완성
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 단계 2: 진단 폼
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={handleBackToIntro}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              이전으로
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 AI 간소화 진단
              </h1>
              <p className="text-gray-600">7개 핵심 정보만 입력하세요</p>
            </div>
            <div className="w-24"></div> {/* Spacer */}
          </div>

          <SimplifiedDiagnosisForm 
            onComplete={handleDiagnosisComplete}
            onBack={handleBackToIntro}
          />
        </div>
      </div>
    );
  }

  // 단계 3: 결과 표시
  if (currentStep === 3 && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={handleStartNew}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              새로운 진단
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                ✅ 진단 완료
              </h1>
              <p className="text-gray-600">결과를 확인하고 PDF로 저장하세요</p>
            </div>
            <div className="w-24"></div> {/* Spacer */}
          </div>

          <SimplifiedDiagnosisResults 
            data={results} 
          />
        </div>
      </div>
    );
  }

  return null;
} 