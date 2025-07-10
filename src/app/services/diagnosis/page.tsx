'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import SimplifiedDiagnosisForm from '@/components/diagnosis/SimplifiedDiagnosisForm';
import SimplifiedDiagnosisResults from '@/components/diagnosis/SimplifiedDiagnosisResults';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  FileText, 
  Star,
  Target,
  Users,
  Zap,
  TrendingUp,
  Shield,
  Award,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { getImagePath } from '@/lib/utils';

export default function FreeDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'intro' | 'form' | 'results'>('intro');
  const [diagnosisResults, setDiagnosisResults] = useState<any>(null);

  // 페이지 제목 설정
  useEffect(() => {
    document.title = '무료 AI진단 신청 | 기업의별 경영지도센터';
  }, []);

  const handleStartDiagnosis = () => {
    setCurrentStep('form');
  };

  const handleDiagnosisComplete = (results: any) => {
    console.log('🔍 진단 완료 데이터:', results); // 디버깅용 로그
    setDiagnosisResults(results);
    setCurrentStep('results');
  };

  const handleBackToIntro = () => {
    setCurrentStep('intro');
    setDiagnosisResults(null);
  };

  // 결과 페이지
  if (currentStep === 'results' && diagnosisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        {/* 기업의별® M-CENTER 경영지도센터 로고 */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Image
              src={getImagePath('/company-logo-new.svg')}
              alt="기업의별® M-CENTER 경영지도센터"
              width={240}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <SimplifiedDiagnosisResults data={diagnosisResults} />
        </div>
      </div>
    );
  }

  // 진단 폼 페이지
  if (currentStep === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        {/* 기업의별® M-CENTER 경영지도센터 로고 */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-4">
            <Image
              src={getImagePath('/company-logo-new.svg')}
              alt="기업의별® M-CENTER 경영지도센터"
              width={240}
              height={80}
              className="h-16 w-auto"
              priority
            />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <SimplifiedDiagnosisForm 
            onComplete={handleDiagnosisComplete}
            onBack={handleBackToIntro}
          />
        </div>
      </div>
    );
  }

  // 소개 페이지 (새로운 간소화된 버전)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* M-CENTER 고객지원 Q&A 버튼 */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/support/qa')}
              className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-purple-50 border-purple-300 hover:border-purple-600 text-purple-700 hover:text-purple-600 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
                M-CENTER 고객지원 Q&A
              </span>
            </Button>
          </div>

          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">무료 AI진단 신청 시스템</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              무료 AI진단 신청
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                8개 정보로 완성하는 AI진단 보고서
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              복잡한 절차 없이 <strong>8개 핵심 정보</strong>만 입력하면 
              <strong> 2-3분 내</strong>에 맞춤형 AI진단 보고서를 받아볼 수 있습니다.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Clock className="w-4 h-4 mr-2" />
                2-3분 소요
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <FileText className="w-4 h-4 mr-2" />
                전문가급 진단
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                100% 무료
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartDiagnosis}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 h-auto"
              >
                <Brain className="w-5 h-5 mr-2" />
                무료 AI진단 신청하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 hover:shadow-md relative overflow-hidden group"
                onClick={() => router.push('/consultation')}
              >
                <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative">
                  전문가 상담 신청하기
                </span>
              </Button>
            </div>
          </div>

          {/* 새로운 시스템 특징 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">간소화된 입력</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  기존 20개 이상 → <strong>8개 핵심 정보</strong>만 입력하면 
                  정확한 AI진단이 가능합니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">즉시 처리</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  기존 2-3주 → <strong>2-3분</strong> 내에 
                  맞춤형 AI진단 보고서를 받아보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">핵심 요약</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-600">
                  긴 보고서 대신 <strong>종합 분석</strong>으로 
                  핵심만 빠르게 파악할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 진단 과정 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                무료 AI진단 신청 과정
              </CardTitle>
              <CardDescription className="text-center">
                3단계로 완성되는 AI진단 신청 시스템
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">8개 정보 입력</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                    <li>• 회사명</li>
                    <li>• 업종</li>
                    <li>• 담당자 정보</li>
                    <li>• 직원수</li>
                    <li>• 성장단계</li>
                    <li>• 주요 고민사항</li>
                    <li>• 예상 혜택</li>
                    <li>• 기대 효과</li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">AI 분석 수행</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                    <li>• SWOT 자동 분석</li>
                    <li>• 현안상황 예측</li>
                    <li>• 6개 서비스 매칭</li>
                    <li>• 성과 예측 분석</li>
                  </ul>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold text-lg mb-2">AI진단 보고서</h4>
                  <ul className="text-sm text-gray-600 space-y-1 text-left max-w-xs mx-auto">
                    <li>• 종합 평가 및 점수</li>
                    <li>• 핵심 강점/기회</li>
                    <li>• 맞춤 서비스 추천</li>
                    <li>• 전문가 상담 안내</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기대 효과 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                  즉시 확인 가능한 결과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>100점 만점 종합 진단 점수</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>업계 내 시장 위치 및 성장률</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>SWOT 기반 핵심 분석</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>6개 서비스 중 최적 매칭</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-indigo-600" />
                  전문가 수준의 분석
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>매출 25-40% 증대 예측</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>업무 효율성 30-50% 향상</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>3-6개월 내 가시적 성과</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>즉시 실행 가능한 액션 플랜</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA 섹션 */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                지금 바로 무료 AI진단을 신청하세요!
              </h3>
              <p className="text-blue-100 mb-6 text-lg">
                8개 정보만 입력하면 2-3분 내에 전문가 수준의 AI진단 보고서를 받아볼 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleStartDiagnosis}
                  className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 h-auto"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  무료 AI진단 신청하기
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95]"
                  onClick={() => router.push('/consultation')}
                >
                  전문가 상담 신청하기
                </Button>
                
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>100% 무료</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>2-3분 소요</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>전문가 상담 가능</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 