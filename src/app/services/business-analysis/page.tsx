'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
// AIFreeDiagnosis 컴포넌트가 새로운 간소화된 진단 시스템으로 교체되었습니다.
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
  Award,
  TrendingUp,
  Building,
  Zap,
  Shield,
  BarChart3,
  Factory,
  Globe,
  Lightbulb,
  ArrowRight,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';
import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';

export default function BusinessAnalysisPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  const frameworks = [
    {
      step: '1단계',
      title: 'Discovering Value',
      subtitle: '가치 발견',
      description: '전략적 진단을 통한 숨겨진 기회 발굴',
      features: ['사업 환경 분석', '고객 문제 정의', '시장 기회 탐색'],
      color: 'bg-blue-100 text-blue-600',
      icon: Target
    },
    {
      step: '2단계',
      title: 'Creating Value',
      subtitle: '가치 창출',
      description: '차별화된 솔루션 및 비즈니스 모델 설계',
      features: ['해법 개발', '가치 제안', '비교 우위'],
      color: 'bg-green-100 text-green-600',
      icon: Lightbulb
    },
    {
      step: '3단계',
      title: 'Delivering Value',
      subtitle: '가치 제공',
      description: '실행 가능한 비즈니스 시스템 구축',
      features: ['협력 체계', '고객 공감', '실행 계획'],
      color: 'bg-orange-100 text-orange-600',
      icon: Zap
    },
    {
      step: '4단계',
      title: 'Capturing Value',
      subtitle: '가치 포착',
      description: '지속가능한 수익 모델 완성',
      features: ['매출 구조', '비용 효율', '임팩트 측정'],
      color: 'bg-purple-100 text-purple-600',
      icon: TrendingUp
    },
    {
      step: '5단계',
      title: 'Proofing Value',
      subtitle: '가치 교정',
      description: '데이터 기반 지속적 개선',
      features: ['학습 & 피봇', '성과 측정', '전략 조정'],
      color: 'bg-red-100 text-red-600',
      icon: BarChart3
    }
  ];

  const industryPrograms = [
    {
      title: '제조업 특화 프로그램',
      subtitle: 'Industry 4.0 연계 전략',
      description: 'IoT 기반 스마트 제조 및 디지털 플랫폼 구축',
      icon: Factory,
      benefits: ['기존 대비 30% 추가 매출', '연간 5억원 추가 수익', '수익성 50% 향상'],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: '서비스업 특화 프로그램',
      subtitle: '디지털 전환 기반 확장',
      description: 'O2O 융합 서비스 및 구독 모델 전환',
      icon: Users,
      benefits: ['고객 생애가치 3배 증가', '안정적 현금흐름', '마케팅 비용 50% 절감'],
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'IT/기술업 특화 프로그램',
      subtitle: '글로벌 진출 전략',
      description: 'API 이코노미 및 SaaS 모델 전환',
      icon: Globe,
      benefits: ['시장 10배 확장', '수익성 200% 향상', '기술 자산 활용'],
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const successMetrics = [
    { label: '프로젝트 성공률', value: '94.7', suffix: '%', color: 'text-green-600' },
    { label: '총 진행 프로젝트', value: '247', suffix: '건', color: 'text-blue-600' },
    { label: '평균 매출 증가율', value: '287', suffix: '%', color: 'text-purple-600' },
    { label: '세무사 파트너', value: '89', suffix: '명', color: 'text-orange-600' }
  ];

  const processSteps = [
    {
      phase: 'Phase 1',
      title: '종합 사업진단',
      duration: '2-3주',
      description: '45개 핵심 질문 진단 시스템을 통한 현황 분석',
      deliverables: ['현재 BM 강점/약점 분석', '신규사업 기회 우선순위', '3년 성장 시나리오']
    },
    {
      phase: 'Phase 2',
      title: 'BM ZEN Canvas 설계',
      duration: '3-4주',
      description: '맞춤형 비즈니스 모델 설계 및 Canvas 완성',
      deliverables: ['완성된 BM ZEN Canvas', '차별화 전략', '협력 네트워크 구성']
    },
    {
      phase: 'Phase 3',
      title: '실행 전략 수립',
      duration: '2-3주',
      description: '12개월 실행 로드맵 및 단계별 전략 수립',
      deliverables: ['실행 로드맵', '투자 계획', '성과 측정 지표']
    }
  ];

  const testimonials = [
    {
      name: '김세무',
      title: '세무법인 대표',
      company: '○○세무법인',
      content: 'BM ZEN 프레임워크를 통해 고객사의 신규사업 성공률이 95%에 달했습니다. 세무 업무량도 4배 증가했어요.',
      rating: 5,
      results: '세무 수수료 4배 증가'
    },
    {
      name: '이제조',
      title: '대표이사',
      company: '정밀기계(주)',
      content: 'IoT 기반 스마트팩토리 솔루션으로 기존 매출 대비 87% 증가를 달성했습니다. 신규사업이 전체 매출의 29%를 차지합니다.',
      rating: 5,
      results: '매출 87% 증가, 영업이익률 2.25배'
    },
    {
      name: '박서비스',
      title: 'CEO',
      company: '마케팅에이전시',
      content: 'AI 기반 디지털 마케팅 플랫폼으로 매출이 137% 증가했고, 구독 기반 안정 매출을 확보했습니다.',
      rating: 5,
      results: '매출 137% 증가, 고객사 3배 확대'
    }
  ];

  // 안전한 네비게이션 핸들러
  const handleNavigation = (path: string) => {
    if (typeof window !== 'undefined') {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              실패없는 BM ZEN 사업진단과 분석 서비스
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                신규사업 성공률 95%
              </span>
              <br />
              세무사를 위한 비즈니스 혁신 솔루션
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              세계 최초 통합 비즈니스 모델 플랫폼 BM ZEN으로 
              고객사의 신규사업 성공과 세무사의 장기 수익 안정성을 동시에 보장합니다
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
              {successMetrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}{metric.suffix}
                  </div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-primary text-lg px-8 py-4"
                onClick={() => handleNavigation('/services/diagnosis')}
              >
                <Brain className="mr-2 w-5 h-5" />
                무료 AI 진단 받기
              </Button>
              <Button 
                className="btn-secondary text-lg px-8 py-4"
                onClick={() => handleNavigation('/services/diagnosis')}
              >
                <BarChart3 className="mr-2 w-5 h-5" />
                사업분석 신청
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI 무료진단기 섹션 */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🤖 AI 무료진단기로 먼저 확인해보세요!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BM ZEN 프로젝트를 시작하기 전에 AI가 5분만에 귀하의 기업 상황을 분석하고 
              맞춤형 솔루션을 무료로 제공합니다
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <Button 
                className="btn-primary text-lg px-8 py-4"
                onClick={() => handleNavigation('/services/diagnosis')}
              >
                ⚡ 무료 AI 진단 시작하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                ⚡ 7개 정보 입력 → 2-3분 분석 → 2000자 BM ZEN 분석 보고서 완성
              </p>
            </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              🎯 더 정밀한 분석이 필요하시다면 전문가 진단을 받아보세요
            </p>
            <Button 
              className="btn-secondary"
              onClick={() => handleNavigation('/consultation')}
            >
              전문가 상담 신청하기
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        </div>
      </section>

      {/* BM ZEN Framework */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Model ZEN 5단계 프레임워크
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              "Simple is Powerful" - 한국형 비즈니스 모델 혁신 방법론으로 
              사업 실패율을 95% → 5%로 혁신합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {frameworks.map((framework, index) => (
              <Card key={index} className="card-hover border-0 shadow-lg h-full">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${framework.color} rounded-lg flex items-center justify-center mb-6`}>
                    <framework.icon className="w-8 h-8" />
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-primary mb-1">{framework.step}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {framework.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mb-3">
                      {framework.subtitle}
                    </p>
                    <p className="text-gray-700 mb-4">
                      {framework.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {framework.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Guarantee */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              95% 성공률 보장 시스템
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              성공 보장 정책
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-white shadow-lg">
                <CardHeader className="text-center p-0 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">100% 성과 보장</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">6개월 내 목표 미달성 시:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 추가 3개월 무료 컨설팅</li>
                      <li>• 전문가 1:1 집중 멘토링</li>
                      <li>• 비즈니스 모델 재설계 무료</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">12개월 내 사업 실패 시:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 컨설팅 비용 50% 환불</li>
                      <li>• 차기 신규사업 진단 무료</li>
                      <li>• 세무사 파트너십 지속 유지</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 bg-white shadow-lg">
                <CardHeader className="text-center p-0 mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">성공 인센티브</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">목표 150% 초과 달성 시:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 차기 프로젝트 30% 할인</li>
                      <li>• 성공 사례 마케팅 인센티브</li>
                      <li>• 우수 파트너 인증 혜택</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold mb-2">세무사 추천 성사 시:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 건당 300만원 추천 보너스</li>
                      <li>• 우선 교육 기회 제공</li>
                      <li>• 전문가 네트워크 가입</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 진단 프로세스 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              세무사 맞춤형 진단 프로세스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              체계적인 3단계 프로세스로 고객사의 신규사업 성공과 세무사의 수익 증대를 동시에 실현합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {processSteps.map((step, index) => (
              <Card key={index} className="card-hover shadow-lg border-t-4 border-t-blue-500">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mb-1">{step.phase}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4" />
                      {step.duration}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 text-center">{step.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">주요 결과물:</h4>
                    {step.deliverables.map((deliverable, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {deliverable}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 업종별 특화 프로그램 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              업종별 특화 BM ZEN 솔루션
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              각 업종의 특성에 맞는 맞춤형 비즈니스 모델 혁신 전략을 제공합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {industryPrograms.map((program, index) => (
              <Card key={index} className={`card-hover shadow-lg ${program.color} border-2`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <program.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-sm font-semibold text-gray-600 mb-3">{program.subtitle}</p>
                    <p className="text-gray-700">{program.description}</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">예상 성과:</h4>
                    {program.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 고객 성공 사례 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              실제 고객 성공 사례
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              BM ZEN 프레임워크를 통해 실제로 성공한 기업들의 생생한 경험담을 확인해보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge className="bg-green-100 text-green-800">{testimonial.results}</Badge>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                        <Users className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.title}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 연락처 및 상담 신청 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              지금 바로 BM ZEN 프로젝트를 시작하세요!
            </h2>
            <p className="text-xl mb-8 opacity-90">
              95% 성공률 보장 시스템과 함께 고객사의 신규사업 성공과 
              세무사의 안정적 수익 증대를 실현하세요
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">1단계: 무료 종합 진단</h3>
                  <p className="mb-4 opacity-90">
                    45개 질문 진단 시스템으로 현재 상황 분석 및 기회 발굴
                  </p>
                  <div className="text-sm opacity-80 mb-4">
                    소요시간: 90분 / 진단비: 50만원 → 완전 무료
                  </div>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                    onClick={() => handleNavigation('/services/diagnosis')}
                  >
                    무료 진단 신청하기 (무료상담신청 AI 무료진단기)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">전문가 직접 상담</h3>
                  <p className="mb-4 opacity-90">
                    BM ZEN 전문 컨설턴트와 1:1 맞춤 상담 진행
                  </p>
                  <div className="text-sm opacity-80 mb-4">
                    {CONSULTANT_INFO.name} / {CONTACT_INFO.mainEmail}
                  </div>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-gray-100 w-full"
                    onClick={() => window.location.href = 'mailto:hongik423@gmail.com'}
                  >
                    <Mail className="mr-2 w-4 h-4" />
                    이메일 상담
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold mb-4">🎁 세무사 파트너 런칭 특가</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">얼리버드 혜택 (선착순 30개사)</h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>• 무료 진단 + 워크숍: 150만원 → 완전 무료</li>
                    <li>• 실행 지원: 1,500만원 → 1,050만원 (30% 할인)</li>
                    <li>• 세무사 교육: 300만원 → 무료 참여</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">추가 혜택</h4>
                  <ul className="space-y-1 text-sm opacity-90">
                    <li>• 성공률 95% 미달 시: 전액 환불</li>
                    <li>• 목표 150% 초과 시: 성과급 지급</li>
                    <li>• 추천 성사 시: 건당 300만원 보너스</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg mb-4">📧 이메일: hongik423@gmail.com</p>
                              <p className="text-sm opacity-80">
                 {COMPANY_INFO.name} | 서울특별시 강남구
                </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 