'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/header';
import { 
  Brain, 
  CheckCircle, 
  Clock, 
  FileText, 
  MessageSquare, 
  Star,
  Target,
  Users,
  Calendar,
  Award
} from 'lucide-react';
import TestComponent from '@/components/diagnosis/TestComponent';
import DiagnosisForm from '@/components/diagnosis/DiagnosisForm';
import DiagnosisResults from '@/components/diagnosis/DiagnosisResults';

export default function DiagnosisPage() {
  const [currentStep, setCurrentStep] = useState<'overview' | 'diagnosis' | 'results'>('overview');
  const [diagnosisData, setDiagnosisData] = useState(null);

  const features = [
    {
      icon: Brain,
      title: '정밀 진단 시스템',
      description: 'AI 기반 다차원 분석을 통한 정확한 진단'
    },
    {
      icon: Target,
      title: '맞춤형 솔루션',
      description: '개별 상황에 최적화된 해결책 제시'
    },
    {
      icon: FileText,
      title: '상세 보고서',
      description: '체계적이고 실행 가능한 진단 보고서 제공'
    },
    {
      icon: MessageSquare,
      title: '전문가 상담',
      description: '진단 결과에 대한 전문가 1:1 상담'
    }
  ];

  const diagnosisTypes = [
    {
      title: '비즈니스 진단',
      description: '사업 모델, 수익성, 성장 가능성 종합 분석',
      duration: '2-3일',
      price: '500,000원',
      features: ['시장 분석', '경쟁력 평가', '성장 전략', '리스크 분석']
    },
    {
      title: '기술 진단',
      description: '기술 역량, 시스템 구조, 디지털 전환 준비도 평가',
      duration: '3-5일',
      price: '800,000원',
      features: ['기술 스택 분석', '보안 평가', '확장성 검토', '최적화 방안']
    },
    {
      title: '조직 진단',
      description: '조직 문화, 인력 역량, 운영 효율성 평가',
      duration: '1-2주',
      price: '1,200,000원',
      features: ['조직 문화 분석', '인력 평가', '프로세스 개선', '변화 관리']
    }
  ];

  const testimonials = [
    {
      name: '김영수',
      company: '테크스타트업 CEO',
      rating: 5,
      comment: '정확한 진단과 실행 가능한 솔루션을 제공해주셔서 사업 방향을 명확히 할 수 있었습니다.'
    },
    {
      name: '박미정',
      company: '제조업체 대표',
      rating: 5,
      comment: '디지털 전환에 대한 불안감이 있었는데, 단계별 로드맵을 제시해주어 큰 도움이 되었습니다.'
    }
  ];

  if (currentStep === 'diagnosis') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DiagnosisForm 
            onComplete={(data) => {
              setDiagnosisData(data);
              setCurrentStep('results');
            }}
            onBack={() => setCurrentStep('overview')}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DiagnosisResults 
            data={diagnosisData}
            onBack={() => setCurrentStep('diagnosis')}
            onNewDiagnosis={() => setCurrentStep('overview')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Brain className="h-4 w-4" />
            전문 진단 서비스
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            정밀 진단으로
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}성공을 설계{' '}
            </span>
            하세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI 기반 다차원 분석과 전문가의 경험을 결합하여
            귀하의 비즈니스에 최적화된 솔루션을 제시합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              onClick={() => setCurrentStep('diagnosis')}
            >
              무료 진단 시작하기
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              상담 예약하기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 우리의 진단 서비스를 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              데이터 기반의 정확한 분석과 실무 경험이 풍부한 전문가의 인사이트를 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Diagnosis Types Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              진단 서비스 유형
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              귀하의 니즈에 맞는 맞춤형 진단 서비스를 선택하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {diagnosisTypes.map((type, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <Badge variant="secondary">인기</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {type.duration}
                    </div>
                    <div className="font-semibold text-lg text-blue-600">
                      {type.price}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    진단 신청하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              진단 프로세스
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              체계적이고 투명한 프로세스로 최고의 결과를 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: '신청 및 상담', description: '온라인 신청 후 초기 상담을 통해 요구사항 파악' },
              { step: '02', title: '데이터 수집', description: '정확한 진단을 위한 필요 정보 및 데이터 수집' },
              { step: '03', title: '분석 및 진단', description: 'AI 시스템과 전문가가 협업하여 심층 분석' },
              { step: '04', title: '보고서 제공', description: '실행 가능한 솔루션이 포함된 상세 보고서 전달' }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  {process.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{process.title}</h3>
                <p className="text-gray-600 text-sm">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              고객의 성공 스토리
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              실제 고객들이 경험한 변화와 성과를 확인해보세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            무료 초기 진단을 통해 귀하의 비즈니스 현황을 파악하고,
            성장을 위한 첫걸음을 내딛어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="px-8 py-3 text-lg"
              onClick={() => setCurrentStep('diagnosis')}
            >
              무료 진단 시작하기
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              <Calendar className="h-5 w-5 mr-2" />
              상담 예약하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 