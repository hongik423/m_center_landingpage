'use client';

import { useState } from 'react';
import SimplifiedDiagnosisForm from '@/components/diagnosis/SimplifiedDiagnosisForm';
import SimplifiedDiagnosisResults from '@/components/diagnosis/SimplifiedDiagnosisResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Zap, Clock, BarChart3, Brain, CheckCircle2, FileText, Sparkles, Star, Shield, Users } from 'lucide-react';

interface DiagnosisResponse {
  success: boolean;
  message: string;
  data: {
    diagnosis: any;
    summaryReport: string;
    reportLength: number;
    resultId: string;
    resultUrl: string;
    submitDate: string;
    googleSheetsSaved: boolean;
    processingTime: string;
    reportType: string;
  };
}

export default function DiagnosisPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: 소개, 2: 폼, 3: 결과
  const [results, setResults] = useState<DiagnosisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDiagnosisComplete = (data: DiagnosisResponse) => {
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

  // 직관적 메뉴바 컴포넌트 - 모바일 반응형
  const QuickNavigationBar = () => (
    <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* 데스크톱 버전 */}
        <div className="hidden lg:flex items-center justify-center gap-2 py-4">
          <Button
            variant={currentStep === 2 ? "default" : "outline"}
            onClick={() => setCurrentStep(2)}
            className={`btn-diagnosis-primary btn-diagnosis-shine px-8 py-4 text-lg ${
              currentStep === 2 
                ? 'scale-105 shadow-2xl' 
                : ''
            }`}
          >
            <Zap className="w-6 h-6 mr-3 animate-pulse" />
            🚀 진단시작
          </Button>
          
          <Button
            variant={currentStep === 1 ? "default" : "outline"}
            onClick={() => setCurrentStep(1)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              currentStep === 1 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            시스템 소개
          </Button>
          
          {results && (
            <Button
              variant={currentStep === 3 ? "default" : "outline"}
              onClick={() => setCurrentStep(3)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                currentStep === 3 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              결과 보기
            </Button>
          )}
          
          <div className="w-px h-8 bg-gray-300 mx-2"></div>
          
          <div className="text-sm text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-4 py-2 rounded-full">
            <span className="font-medium">🚀 팁:</span> <span className="font-bold text-green-700">진단시작</span>하면 2-3분 만에 AI 진단 완료!
          </div>
        </div>

        {/* 모바일 버전 */}
        <div className="lg:hidden flex flex-col gap-3 py-3">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={currentStep === 2 ? "default" : "outline"}
              onClick={() => setCurrentStep(2)}
              size="sm"
              className={`btn-diagnosis-primary btn-diagnosis-shine flex-1 max-w-40 py-3 text-sm ${
                currentStep === 2 
                  ? 'scale-105 shadow-xl' 
                  : ''
              }`}
            >
              <Zap className="w-5 h-5 mr-1 animate-pulse" />
              <span className="text-sm font-bold">🚀 진단시작</span>
            </Button>
            
            <Button
              variant={currentStep === 1 ? "default" : "outline"}
              onClick={() => setCurrentStep(1)}
              size="sm"
              className={`flex-1 max-w-32 py-2 rounded-full font-medium transition-all duration-200 ${
                currentStep === 1 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              <FileText className="w-4 h-4 mr-1" />
              <span className="text-xs">소개</span>
            </Button>
            
            {results && (
              <Button
                variant={currentStep === 3 ? "default" : "outline"}
                onClick={() => setCurrentStep(3)}
                size="sm"
                className={`flex-1 max-w-32 py-2 rounded-full font-medium transition-all duration-200 ${
                  currentStep === 3 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="text-xs">결과</span>
              </Button>
            )}
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-600 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-3 py-1.5 rounded-full inline-block">
              <span className="font-medium">🚀</span> <span className="font-bold text-green-700">진단시작</span>하면 2-3분 만에 완료!
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // 단계 1: 시스템 소개 - 토스 스타일
  if (currentStep === 1) {
    return (
      <>
        <QuickNavigationBar />
        <div className="min-h-screen gradient-bg-hero relative overflow-hidden pt-16">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400 rounded-full blur-2xl"></div>
            <div className="absolute top-10 right-10 w-60 h-60 bg-purple-400 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-50 h-50 bg-green-400 rounded-full blur-2xl"></div>
          </div>
          
          <div className="container-custom py-20 relative z-10">
            {/* 헤더 섹션 */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 
                              rounded-3xl mb-8 shadow-xl animate-bounce-gentle">
                <Zap className="w-12 h-12 text-white" />
              </div>
              
              <div className="badge-primary mb-6 animate-scale-in">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-semibold">혁신적인 AI 간소화 진단</span>
              </div>
              
              <h1 className="text-hero text-gray-900 mb-8 animate-slide-in">
                <Zap className="inline-block w-16 h-16 mr-4 text-yellow-500" />
                새로운 AI 간소화 진단
              </h1>
              
              <p className="text-body-lg text-gray-600 max-w-5xl mx-auto leading-relaxed animate-slide-in mb-12"
                 style={{ animationDelay: '0.2s' }}>
                기존 복잡한 20여개 입력 항목과 2-3주 처리 시간을 <br />
                <span className="font-bold text-blue-600 text-xl">8개 핵심 정보와 2-3분 처리</span>로 혁신적으로 개선했습니다.
              </p>
            </div>

            {/* 개선 효과 비교 - 토스 스타일 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Clock,
                  title: '⚡ 처리 속도',
                  before: '기존: 2-3주',
                  after: '신규: 2-3분',
                  improvement: '99.9% 단축',
                  color: 'from-green-400 to-emerald-500',
                  delay: '0ms'
                },
                {
                  icon: BarChart3,
                  title: '📝 입력 항목',
                  before: '기존: 20+ 항목',
                  after: '신규: 8개 항목',
                  improvement: '60% 간소화',
                  color: 'from-blue-400 to-cyan-500',
                  delay: '100ms'
                },
                {
                  icon: FileText,
                  title: '📊 보고서',
                  before: '기존: 5000자+',
                  after: '신규: AI진단 보고서',
                  improvement: '핵심 정보 집중',
                  color: 'from-purple-400 to-pink-500',
                  delay: '200ms'
                }
              ].map((item, index) => (
                <Card key={index} 
                      className={`result-card text-center bg-gradient-to-br ${item.color} text-white border-0 
                                 animate-scale-in group cursor-pointer`}
                      style={{ animationDelay: item.delay }}>
                  <CardContent className="p-8">
                    <item.icon className="w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <div className="space-y-3">
                      <div className="text-white/80 line-through">{item.before}</div>
                      <div className="font-bold text-xl">{item.after}</div>
                      <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full inline-block">
                        {item.improvement}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 핵심 특징 - 토스 스타일 */}
            <Card className="result-card mb-16 animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-10">
                <h2 className="text-h1 text-center text-gray-900 mb-12">
                  <span className="text-4xl mr-4">🎯</span>
                  새로운 시스템의 핵심 특징
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      icon: '🚀',
                      title: '즉시 분석',
                      description: '실시간 AI 분석으로 즉시 결과 확인',
                      color: 'bg-gradient-to-br from-blue-50 to-cyan-50'
                    },
                    {
                      icon: '📋',
                      title: '간단 입력',
                      description: '8개 핵심 정보만으로 정확한 진단',
                      color: 'bg-gradient-to-br from-green-50 to-emerald-50'
                    },
                    {
                      icon: '🎯',
                      title: '맞춤 추천',
                      description: '6개 서비스 중 최적 조합 제시',
                      color: 'bg-gradient-to-br from-purple-50 to-pink-50'
                    },
                    {
                      icon: '💾',
                      title: 'PDF 다운로드',
                      description: '전문 보고서 PDF 즉시 저장',
                      color: 'bg-gradient-to-br from-orange-50 to-yellow-50'
                    }
                  ].map((feature, index) => (
                    <div key={index} className={`text-center p-8 ${feature.color} rounded-3xl 
                                                 hover:shadow-lg transition-all duration-300 group`}>
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h4 className="text-h4 text-gray-900 mb-3">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 진단 과정 3단계 */}
            <Card className="result-card mb-16 animate-slide-in" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-10">
                <h2 className="text-h1 text-center text-gray-900 mb-12">
                  <span className="text-4xl mr-4">⚡</span>
                  새로운 진단 과정 (3단계)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: '1',
                      title: '8개 정보 입력',
                      description: '회사명, 업종, 담당자 정보, 직원수, 성장단계, 고민사항, 예상혜택, 기대효과',
                      color: 'bg-blue-100 text-blue-600',
                      bgColor: 'bg-blue-50'
                    },
                    {
                      step: '2',
                      title: 'AI 분석 수행',
                      description: 'SWOT 자동 분석, 현안상황 예측, 6개 서비스 매칭, 성과 예측 분석',
                      color: 'bg-green-100 text-green-600',
                      bgColor: 'bg-green-50'
                    },
                    {
                      step: '3',
                      title: 'AI진단 보고서',
                      description: '종합 평가 및 점수, 핵심 강점/기회, 맞춤 서비스 추천, 전문가 상담 안내',
                      color: 'bg-purple-100 text-purple-600',
                      bgColor: 'bg-purple-50'
                    }
                  ].map((process, index) => (
                    <div key={index} className={`text-center p-8 ${process.bgColor} rounded-3xl`}>
                      <div className={`w-20 h-20 ${process.color} rounded-3xl flex items-center justify-center 
                                      mx-auto mb-6 shadow-lg`}>
                        <span className="text-3xl font-bold">{process.step}</span>
                      </div>
                      <h4 className="text-h4 text-gray-900 mb-4">{process.title}</h4>
                      <p className="text-gray-600">{process.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 기대 효과 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <Card className="result-card animate-slide-in" style={{ animationDelay: '0.8s' }}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-h3 text-gray-900">즉시 확인 가능한 결과</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      '100점 만점 종합 진단 점수',
                      '업계 내 시장 위치 및 성장률',
                      'SWOT 기반 핵심 분석',
                      '6개 서비스 중 최적 매칭'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="result-card animate-slide-in" style={{ animationDelay: '1s' }}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-h3 text-gray-900">전문가 수준의 분석</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      '매출 25-40% 증대 예측',
                      '업무 효율성 30-50% 향상',
                      '3-6개월 내 가시적 성과',
                      '즉시 실행 가능한 액션 플랜'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA 섹션 */}
            <div className="text-center animate-slide-in" style={{ animationDelay: '1.2s' }}>
              <Card className="result-card bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white border-0">
                <CardContent className="p-10">
                  <h2 className="text-h2 mb-6">
                    지금 바로 새로운 AI 진단을 시작해보세요!
                  </h2>
                  
                  <p className="text-body-lg text-blue-100 mb-8 max-w-3xl mx-auto">
                    <strong className="text-white">8개 핵심 정보</strong>만 입력하면 
                    <strong className="text-white"> 2-3분</strong> 내에 전문가 수준의 맞춤형 진단 보고서를 받아볼 수 있습니다.
                  </p>
                  
                  <Button 
                    onClick={handleStartDiagnosis}
                    className="btn-hero bg-white text-blue-600 hover:bg-gray-50 shadow-xl mb-8"
                  >
                    <Zap className="w-6 h-6 mr-3" />
                    새로운 AI 진단 시작하기
                  </Button>
                  
                  <div className="flex flex-wrap justify-center gap-8 text-sm text-blue-100">
                    {[
                      { icon: Shield, text: '100% 무료' },
                      { icon: Clock, text: '2-3분 소요' },
                      { icon: Brain, text: 'AI 기반 분석' },
                      { icon: Users, text: '전문가 상담 가능' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-blue-200 mt-6 text-sm">
                    ⚡ 8개 정보 입력 → 2-3분 분석 → 맞춤형 진단보고서 완성
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 단계 2: 진단 폼 - 토스 스타일
  if (currentStep === 2) {
    return (
      <>
        <QuickNavigationBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
          <div className="container-custom py-8">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={handleBackToIntro}
                className="flex items-center gap-2 hover:bg-white/80 p-3 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">이전으로</span>
              </Button>
              
              <div className="text-center">
                <div className="badge-primary mb-2">
                  <Brain className="w-4 h-4 mr-2" />
                  <span className="font-semibold">AI 간소화 진단</span>
                </div>
                <h1 className="text-h2 text-gray-900">
                  🚀 8개 핵심 정보 입력
                </h1>
                <p className="text-gray-600">간단하게 입력하시면 즉시 분석해드립니다</p>
              </div>
              
              <div className="w-24"></div> {/* Spacer */}
            </div>

            <SimplifiedDiagnosisForm 
              onComplete={handleDiagnosisComplete}
              onBack={handleBackToIntro}
            />
          </div>
        </div>
      </>
    );
  }

  // 단계 3: 결과 표시 - 토스 스타일
  if (currentStep === 3 && results) {
    return (
      <>
        <QuickNavigationBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-16">
          <div className="container-custom py-8">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                onClick={handleStartNew}
                className="flex items-center gap-2 hover:bg-white/80 p-3 rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">새로운 진단</span>
              </Button>
              
              <div className="text-center">
                <div className="badge-success mb-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  <span className="font-semibold">진단 완료</span>
                </div>
                <h1 className="text-h2 text-gray-900">
                  ✅ AI 진단 결과
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
      </>
    );
  }

  return null;
} 