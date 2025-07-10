'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';

import { 
  Brain, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Shield,
  Award,
  Clock,
  DollarSign,
  ArrowLeft,
  Factory,
  Settings,
  Eye,
  Lightbulb,
  Cog,
  Gauge,
  PieChart,
  LineChart,
  MousePointer,
  BookOpen,
  Wrench,
  Building2,
  Calculator,
  FileSpreadsheet,
  Cpu,
  Camera,
  Database,
  Globe,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Rocket,
  Calendar,
  PhoneCall,
  Code,
  GitGraph,
  Activity,
  Briefcase
} from 'lucide-react';

export default function BusinessAnalysisPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '실제 기업 데이터 기반 진단',
      description: '추상적 이론이 아닌 실제 비즈니스 데이터 분석',
      icon: Database
    },
    {
      title: 'AI 도구 직접 구현',
      description: '컨설팅과 동시에 AI 솔루션 구축 및 운영',
      icon: Cpu
    },
    {
      title: '측정 가능한 성과',
      description: '30일 내 가시적 결과, 6개월 내 ROI 300% 달성',
      icon: BarChart3
    },
    {
      title: '실행 중심 접근',
      description: '전략 수립부터 실행, 성과 측정까지 원스톱 지원',
      icon: Target
    },
    {
      title: '5단계 BM Zen 프레임워크',
      description: '가치 발견→창출→제공→포착→교정의 체계적 접근',
      icon: Settings
    },
    {
      title: '16주 집중 실행 프로그램',
      description: '기반 구축부터 최적화까지 체계적 단계별 진행',
      icon: Calendar
    },
    {
      title: 'AI 기반 품질 검사',
      description: '컴퓨터 비전으로 96.8% 정확도 달성',
      icon: Camera
    },
    {
      title: '실시간 성과 모니터링',
      description: '24/7 KPI 대시보드로 실시간 성과 추적',
      icon: Monitor
    }
  ];

  const processSteps = [
    {
      step: '1단계',
      title: '가치 발견 (Value Discovery)',
      description: 'AI 기반 종합 진단 시스템으로 기업 현황 분석 및 숨겨진 기회 영역 발굴',
      duration: '2-3주',
      icon: Eye,
      details: ['비즈니스 모델 효율성 진단', '생산성 저해 요인 분석', '디지털 성숙도 평가', 'AI 활용 준비도 측정']
    },
    {
      step: '2단계', 
      title: '가치 창출 (Value Creation)',
      description: 'AI 기반 맞춤형 성장 전략 설계 및 스마트 생산 시스템 구축',
      duration: '3-4주',
      icon: Lightbulb,
      details: ['스마트 생산 시스템', '영업-생산 통합 CRM', '데이터 기반 의사결정 시스템', 'ROI 시뮬레이션']
    },
    {
      step: '3단계',
      title: '가치 제공 (Value Delivery)',
      description: '16주 집중 실행 프로그램으로 AI 시스템 구축 및 프로세스 최적화',
      duration: '12-16주',
      icon: Cog,
      details: ['기반 구축', 'AI 시스템 개발', '최적화 및 고도화', '확장 및 발전']
    },
    {
      step: '4단계',
      title: '가치 포착 (Value Capture)',
      description: '실시간 성과 모니터링 시스템으로 KPI 추적 및 성과 측정',
      duration: '지속',
      icon: Gauge,
      details: ['실시간 성과 모니터링', '월간 절감 효과 측정', '정성적 성과 평가', '고객 만족도 추적']
    },
    {
      step: '5단계',
      title: '가치 교정 (Value Adjustment)',
      description: '지속적 개선 시스템으로 성과 최적화 및 차기 발전 계획 수립',
      duration: '지속',
      icon: Settings,
      details: ['월별 성과 리뷰', '업그레이드 계획', '조직 문화 변화 관리', '기술 역량 지속 강화']
    }
  ];

  const caseStudies = [
    {
      industry: '㈜한국정밀기계 (자동차 부품 제조)',
      challenge: '수작업 비중 68%, 품질 불량률 3.2%, 납기 지연 빈발',
      solution: 'BM Zen + AI 스마트 생산 시스템 구축',
      result: '생산성 42% 향상, 품질 불량률 0.7%, 6개월 ROI 290%',
      details: {
        before: { productivity: '100개/일', defectRate: '3.2%', onTimeDelivery: '78%' },
        after: { productivity: '142개/일', defectRate: '0.7%', onTimeDelivery: '96%' },
        investment: '8,000만원',
        monthlyReturns: '5,200만원'
      }
    },
    {
      industry: 'IT 서비스 기업',
      challenge: '반복적 업무로 인한 성장 정체, 낮은 부가가치',
      solution: 'AI 기반 자동화 시스템 + 신규 서비스 개발',
      result: '업무 효율성 87% 향상, 신규 수익원 창출',
      details: {
        before: { automation: '15%', revenue: '100%', satisfaction: '6.2점' },
        after: { automation: '85%', revenue: '180%', satisfaction: '8.4점' },
        investment: '6,000만원',
        monthlyReturns: '3,800만원'
      }
    },
    {
      industry: '중견 제조업',
      challenge: '디지털 전환 지연, 데이터 기반 의사결정 부재',
      solution: '실시간 데이터 파이프라인 + AI 예측 분석 시스템',
      result: '의사결정 속도 60% 향상, 예측 정확도 90% 달성',
      details: {
        before: { digitalMaturity: '32점', decisionSpeed: '100%', accuracy: '65%' },
        after: { digitalMaturity: '78점', decisionSpeed: '160%', accuracy: '90%' },
        investment: '1억 2,000만원',
        monthlyReturns: '7,500만원'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="max-w-6xl mx-auto">
            {/* M-CENTER 고객지원 Q&A 버튼 */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push('/support/qa')}
                className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-green-50 border-green-300 hover:border-green-600 text-green-700 hover:text-green-600 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
                  M-CENTER 고객지원 Q&A
                </span>
              </Button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-2 py-1 rounded-md hover:bg-blue-50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:translate-x-[-2px] transition-transform duration-200" />
                  서비스 목록
                </span>
              </Button>
              <span>/</span>
              <span className="text-blue-600 font-medium">BM ZEN 사업분석</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">실제 기업 검증 완료 · ROI 375% 달성</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BM Zen 프레임워크 기반<br />
                    AI 성장전략 컨설팅
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>AI와 BM Zen으로 기업의 숨겨진 성장 동력을 발굴하고, 측정 가능한 성과를 만들어내는 실행 중심 컨설팅</strong>
                </p>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-200">
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 text-amber-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">핵심 차별점</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>실제 기업 데이터 기반 진단</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>AI 도구 직접 구현</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>30일 내 가시적 결과</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>실행 중심 접근</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <Factory className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold text-gray-900">㈜한국정밀기계 실제 적용 사례</h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    자동차 부품 제조업 · 직원 45명 · 연매출 120억원 · 성장 단계 Step 2
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">42%</div>
                      <div className="text-sm text-gray-600">생산성 향상</div>
                      <div className="text-xs text-gray-500">100개 → 142개/일</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">290%</div>
                      <div className="text-sm text-gray-600">6개월 ROI</div>
                      <div className="text-xs text-gray-500">8천만원 투자</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-600">-78%</div>
                      <div className="text-sm text-gray-600">품질 불량률</div>
                      <div className="text-xs text-gray-500">3.2% → 0.7%</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <Cpu className="w-4 h-4 mr-2" />
                    AI 기반 진단 시스템
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    30일 내 가시적 결과
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    ROI 300% 달성 보장
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    실제 기업 검증 완료
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
                    onClick={() => router.push('/consultation')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative flex items-center">
                      맞춤형 상담 신청 (차별성 확인)
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 hover:shadow-md relative overflow-hidden group"
                    onClick={() => router.push('/diagnosis')}
                  >
                    <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative">
                      무료 진단 받기
                    </span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-orange-300 hover:border-orange-600 text-orange-700 hover:text-orange-600 hover:shadow-md relative overflow-hidden group"
                    onClick={() => window.open('/images/bmzwn_CASE.PDF', '_blank')}
                  >
                    <span className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative flex items-center">
                      <FileSpreadsheet className="w-5 h-5 mr-2" />
                      BM ZEN 사례 공유 (PDF)
                    </span>
                  </Button>
                </div>
              </div>

              <div className="relative px-2 sm:px-0">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">16-24주</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">적용 대상</span>
                      <span className="font-semibold text-blue-600">Step 1-4 기업</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">6개월 ROI</span>
                      <span className="font-semibold text-green-600">290-680%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">생산성 향상</span>
                      <span className="font-semibold text-purple-600">40-60%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">차별화 요소</span>
                      <span className="font-semibold text-blue-600">5단계 독자 프레임워크</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-bold text-green-800">성과 보장</span>
                    </div>
                    <p className="text-sm text-green-700">
                      목표 미달 시 서비스 비용 50% 환불
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: '서비스 개요' },
              { id: 'framework', label: 'BM Zen 프레임워크' },
              { id: 'features', label: 'AI 솔루션' },
              { id: 'process', label: '16주 실행 프로그램' },
              { id: 'cases', label: '실제 기업 사례' },
              { id: 'service-cases', label: '서비스 사례' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {activeTab !== tab.id && (
                  <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                )}
                <span className="relative">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 기업성장솔루션 섹션 */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 
                            text-emerald-700 rounded-full font-semibold text-sm mb-8">
              <Rocket className="w-5 h-5" />
              <span>기업 성장 단계별 맞춤 솔루션</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                기업성장솔루션
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              기업의 성장 단계와 규모에 맞는 차별화된 BM ZEN 솔루션으로<br />
              지속 가능한 성장과 혁신을 실현합니다
            </p>
          </div>

          {/* 성장 단계별 솔루션 카드 */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
            {/* Step 1-2: 스타트업/초기 기업 */}
                          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 text-center pb-6 px-6 lg:px-8 pt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-600 mb-3">BM ZEN Starter</CardTitle>
                  <p className="text-gray-600">Step 1-2 기업 | 연매출 10-100억원</p>
                </CardHeader>
                <CardContent className="relative z-10 px-6 lg:px-8 pb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">🎯 핵심 목표</h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>비즈니스 모델 검증 및 최적화</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>초기 AI 도구 도입 (ChatGPT, 자동화)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>핵심 프로세스 3개 영역 개선</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">150%</div>
                      <div className="text-sm text-gray-600 mb-1">예상 6개월 ROI</div>
                      <div className="text-xs text-gray-500">생산성 20% 이상 향상 보장</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2-3: 성장기 기업 */}
                          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-2 border-blue-200 bg-white overflow-hidden scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 text-sm font-bold">
                    <Star className="w-4 h-4 mr-2" />
                    BEST CHOICE
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 text-center pb-6 px-6 lg:px-8 pt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-600 mb-3">BM ZEN Professional</CardTitle>
                  <p className="text-gray-600">Step 2-3 기업 | 연매출 50-300억원</p>
                </CardHeader>
                <CardContent className="relative z-10 px-6 lg:px-8 pb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">🚀 핵심 목표</h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>완전 맞춤형 AI 솔루션 개발</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>컴퓨터 비전 품질 검사 시스템</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>통합 CRM/ERP 시스템 구축</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">290%</div>
                      <div className="text-sm text-gray-600 mb-1">실제 6개월 ROI</div>
                      <div className="text-xs text-gray-500">한국정밀기계 검증 완료</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3-4: 확장기 기업 */}
                          <Card className="relative group hover:shadow-2xl transition-all duration-500 border-0 bg-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 text-center pb-6 px-6 lg:px-8 pt-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-10 h-10 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl text-purple-600 mb-3">BM ZEN Enterprise</CardTitle>
                  <p className="text-gray-600">Step 3-4 기업 | 연매출 300억원+</p>
                </CardHeader>
                <CardContent className="relative z-10 px-6 lg:px-8 pb-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4">🏢 핵심 목표</h4>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>엔터프라이즈급 AI 플랫폼 구축</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>다국가 확장 지원 시스템</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        <span>조직 전체 디지털 트랜스포메이션</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">500%</div>
                      <div className="text-sm text-gray-600 mb-1">목표 12개월 ROI</div>
                      <div className="text-xs text-gray-500">조직 혁신 완료</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 단계별 진행 프로세스 */}
          <div className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border border-gray-100">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                체계적인 5단계 진행 프로세스
              </h3>
              <p className="text-lg text-gray-600">
                검증된 BM ZEN 프레임워크로 단계별 성과를 보장합니다
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {[
                { step: '1', title: '가치 발견', duration: '2-3주', icon: Eye, color: 'blue' },
                { step: '2', title: '가치 창출', duration: '3-4주', icon: Lightbulb, color: 'green' },
                { step: '3', title: '가치 제공', duration: '12-16주', icon: Cog, color: 'purple' },
                { step: '4', title: '가치 포착', duration: '지속', icon: Gauge, color: 'orange' },
                { step: '5', title: '가치 교정', duration: '지속', icon: Settings, color: 'red' }
              ].map((phase, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${phase.color}-100 to-${phase.color}-200 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <phase.icon className={`w-8 h-8 text-${phase.color}-600`} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{phase.step}단계</h4>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{phase.title}</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {phase.duration}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl">
          {activeTab === 'framework' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 
                                text-blue-700 rounded-full font-semibold text-sm mb-8">
                  <Brain className="w-5 h-5" />
                  <span>실제 기업 검증 완료 · 5단계 체계적 접근</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    BM Zen 5단계 프레임워크
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                  가치 발견부터 교정까지, 체계적인 5단계 접근으로<br />
                  지속 가능한 성장과 혁신을 실현합니다
                </p>
              </div>
              
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-20">
                {processSteps.map((step, index) => (
                  <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-500 group bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="mb-4">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-bold mb-3">
                          {step.step}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                      
                      {/* 상세 내용 */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <ul className="space-y-2 text-xs text-gray-600">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  실제 기업 적용 결과
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">42%</div>
                    <div className="text-sm text-gray-600">생산성 향상</div>
                    <div className="text-xs text-gray-500 mt-1">한국정밀기계</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">290%</div>
                    <div className="text-sm text-gray-600">6개월 ROI</div>
                    <div className="text-xs text-gray-500 mt-1">투자 대비 수익</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">96.8%</div>
                    <div className="text-sm text-gray-600">AI 품질검사</div>
                    <div className="text-xs text-gray-500 mt-1">정확도</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">87%</div>
                    <div className="text-sm text-gray-600">업무 자동화</div>
                    <div className="text-xs text-gray-500 mt-1">효율성 개선</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 
                                text-amber-700 rounded-full font-semibold text-sm mb-8">
                  <Award className="w-5 h-5" />
                  <span>실제 기업 검증 완료 · 차별화된 접근법</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    왜 BM ZEN 사업분석인가요?
                  </span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                  기존 컨설팅의 한계를 극복하고, 실제 기업에서 검증된<br />
                  차별화된 접근법으로 확실한 성과를 보장합니다
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
                <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="p-0 pb-6 relative z-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">✗</span>
                      </div>
                      <CardTitle className="text-2xl text-red-600 font-bold">기존 방식의 한계</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 relative z-10">
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <span className="text-red-500 font-bold text-lg">✗</span>
                        <span>단순 세무 서비스로 한정된 수익 구조</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <span className="text-red-500 font-bold text-lg">✗</span>
                        <span>반복적 업무로 인한 성장 정체</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <span className="text-red-500 font-bold text-lg">✗</span>
                        <span>체계적인 비즈니스 전략 부재</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <span className="text-red-500 font-bold text-lg">✗</span>
                        <span>시장 변화에 대한 대응력 부족</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="p-0 pb-6 relative z-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-blue-600 font-bold">BM ZEN 솔루션</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 relative z-10">
                    <ul className="space-y-4 text-gray-700">
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>5단계 프레임워크로 체계적 접근</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>AI 기반 데이터 분석 및 인사이트</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>맞춤형 비즈니스 모델 설계</span>
                      </li>
                      <li className="flex items-start gap-3 p-3 bg-white/70 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>지속 가능한 성장 전략 수립</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                AI 솔루션 및 핵심 기능
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center p-6 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                5단계 진행 과정
              </h2>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                성공 사례
              </h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {caseStudies.map((study, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-600">{study.industry}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">도전 과제</h4>
                          <p className="text-gray-600 text-sm">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">솔루션</h4>
                          <p className="text-gray-600 text-sm">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">성과</h4>
                          <p className="text-green-600 text-sm font-medium">{study.result}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'service-cases' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                서비스 신청 및 진행 프로세스
              </h2>
              
              {/* 서비스 진행 단계 */}
              <div className="grid lg:grid-cols-5 gap-6 mb-16">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">1단계</h3>
                    <p className="text-sm font-semibold text-green-600 mb-2">무료 사전 진단</p>
                    <p className="text-xs text-gray-600 mb-3">온라인 사전 진단 시스템으로 기본 현황 파악</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      1주
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">2단계</h3>
                    <p className="text-sm font-semibold text-blue-600 mb-2">상세 진단 및 제안</p>
                    <p className="text-xs text-gray-600 mb-3">현장 방문 진단 및 30페이지 종합 분석 보고서</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      1주
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GitGraph className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">3단계</h3>
                    <p className="text-sm font-semibold text-purple-600 mb-2">계약 및 킥오프</p>
                    <p className="text-xs text-gray-600 mb-3">서비스 계약 체결 및 전담 팀 구성</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      1주
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">4단계</h3>
                    <p className="text-sm font-semibold text-orange-600 mb-2">실행 및 모니터링</p>
                    <p className="text-xs text-gray-600 mb-3">AI 시스템 구축 및 프로세스 최적화</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      16-24주
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">5단계</h3>
                    <p className="text-sm font-semibold text-teal-600 mb-2">성과 검증 및 사후관리</p>
                    <p className="text-xs text-gray-600 mb-3">성과 검증 및 지속적 파트너십</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      3-12개월
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* 실제 기업별 서비스 사례 */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  기업 규모별 맞춤 서비스 사례
                </h3>
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* BM Zen Starter */}
                  <Card className="border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                        <Rocket className="w-8 h-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-blue-600">BM Zen Starter</CardTitle>
                      <p className="text-gray-600 text-sm">Step 1-2 기업 대상</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">적용 대상</h4>
                        <p className="text-sm text-gray-600 mb-4">연매출 50-200억원, 직원 10-50명</p>
                        
                        <h4 className="font-bold text-gray-900 mb-2">주요 서비스</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            BM Zen 프레임워크 기반 종합 진단
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            기본 AI 도구 도입 (ChatGPT, Claude)
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            핵심 프로세스 3개 영역 최적화
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            생산성 20% 이상 향상 보장
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">150%</div>
                          <div className="text-sm text-gray-600">예상 6개월 ROI</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* BM Zen Professional */}
                  <Card className="border-2 border-purple-300 relative shadow-xl scale-105">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
                        <Star className="w-4 h-4 mr-1" />
                        추천
                      </Badge>
                    </div>
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                        <Award className="w-8 h-8 text-purple-600" />
                      </div>
                      <CardTitle className="text-xl text-purple-600">BM Zen Professional</CardTitle>
                      <p className="text-gray-600 text-sm">Step 2-3 기업 대상</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">적용 대상</h4>
                        <p className="text-sm text-gray-600 mb-4">연매출 100-500억원, 직원 50-300명</p>
                        
                        <h4 className="font-bold text-gray-900 mb-2">주요 서비스</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            완전 맞춤형 AI 솔루션 개발
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            컴퓨터 비전 품질 검사 시스템
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            통합 CRM/ERP 시스템 구축
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            생산성 40% 이상 향상 보장
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">290%</div>
                          <div className="text-sm text-gray-600">실제 6개월 ROI</div>
                          <div className="text-xs text-gray-500 mt-1">한국정밀기계 사례</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* BM Zen Enterprise */}
                  <Card className="border-2 border-yellow-200 hover:border-yellow-300 transition-all duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-yellow-600" />
                      </div>
                      <CardTitle className="text-xl text-yellow-600">BM Zen Enterprise</CardTitle>
                      <p className="text-gray-600 text-sm">Step 3-4 기업 대상</p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">적용 대상</h4>
                        <p className="text-sm text-gray-600 mb-4">연매출 500억원+, 직원 300명+</p>
                        
                        <h4 className="font-bold text-gray-900 mb-2">주요 서비스</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            전사적 AI 생태계 구축
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            예측 분석 및 의사결정 지원
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            글로벌 확장 대응 시스템
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            생산성 60% 이상 향상 보장
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">680%</div>
                          <div className="text-sm text-gray-600">예상 12개월 ROI</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 특별 혜택 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  특별 혜택 및 보장 서비스
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">무료 사전 진단</h4>
                    <p className="text-sm text-gray-600">사전 진단 및 기본 리포트 무료 제공</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">성과 보장</h4>
                    <p className="text-sm text-gray-600">목표 미달 시 서비스 비용 50% 환불</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">정부 지원 연계</h4>
                    <p className="text-sm text-gray-600">스마트공장, 디지털 뉴딜 등 지원금 최대 활용</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-orange-600" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">분할 결제</h4>
                    <p className="text-sm text-gray-600">성과 연동 분할 결제 (초기 30% → 성과 달성 시 70%)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 BM Zen AI 성장전략 컨설팅을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              실제 기업에서 검증된 BM Zen 프레임워크와 AI 기술로 
              <br className="hidden md:block" />
              30일 내 가시적 결과를 경험하고 6개월 내 ROI 290%를 달성하세요.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-2">42%</div>
                <div className="text-sm text-blue-100">생산성 향상</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-2">290%</div>
                <div className="text-sm text-blue-100">6개월 ROI</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white mb-2">96.8%</div>
                <div className="text-sm text-blue-100">AI 품질검사 정확도</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Users className="w-5 h-5 mr-2" />
                전문가 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Brain className="w-5 h-5 mr-2" />
                무료 AI진단 받기
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 