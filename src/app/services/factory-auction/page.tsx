'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Factory, 
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
  Building,
  Calculator,
  MapPin,
  Gavel,
  Search,
  FileText,
  PieChart,
  Lightbulb,
  RefreshCw,
  Briefcase,
  Globe,
  Rocket,
  Eye,
  TrendingDown,
  AlertTriangle,
  Phone,
  Mail,
  Trophy,
  CheckSquare,
  FileCheck,
  Banknote,
  Home,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function FactoryAuctionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                서비스 목록
              </Button>
              <span>/</span>
              <span className="text-orange-600 font-medium">경매활용 공장구매 컨설팅</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full mb-6">
                  <Gavel className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">시장가 대비 평균 40% 절약 · 최대 60% 사례 보유</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    경매활용<br />공장구매 컨설팅
                  </span>
                </h1>
                
                <div className="space-y-4 mb-8">
                  <p className="text-xl text-gray-700 font-semibold">
                    "자금 효율성 극대화, 정책자금 연계 종합 부동산 투자 전략"
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Business Model Zen 프레임워크 기반으로 
                    <strong className="text-orange-600"> 입지분석·사업타당성 검토·비즈니스모델 진단</strong>과 
                    <strong className="text-yellow-600"> 구조개선·사업전환·정책자금 컨설팅</strong>을 
                    통합 제공하는 차별화된 컨설팅 서비스
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  <Badge variant="outline" className="px-3 py-2 justify-center">
                    <TrendingDown className="w-4 h-4 mr-2" />
                    40% 절약
                  </Badge>
                  <Badge variant="outline" className="px-3 py-2 justify-center">
                    <Users className="w-4 h-4 mr-2" />
                    전문가팀
                  </Badge>
                  <Badge variant="outline" className="px-3 py-2 justify-center">
                    <Award className="w-4 h-4 mr-2" />
                    성공보수제
                  </Badge>
                  <Badge variant="outline" className="px-3 py-2 justify-center">
                    <Shield className="w-4 h-4 mr-2" />
                    95% 성공률
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-8 py-4 text-lg"
                    onClick={() => router.push('/consultation')}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    전문가 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-2"
                    onClick={() => router.push('/diagnosis')}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    무료 투자 적합성 진단
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-lg border">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">010-9251-9743</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">hongik423@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
                  {/* 배경 장식 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">서비스 핵심 지표</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TrendingDown className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">평균 절약률</div>
                          <div className="font-bold text-green-600">40%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">최대 60%</div>
                        <div className="text-xs text-gray-500">사례 보유</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">투자 회수 기간</div>
                          <div className="font-bold text-blue-600">3.2년</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">26.3%</div>
                        <div className="text-xs text-gray-500">평균 IRR</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">성공률</div>
                          <div className="font-bold text-purple-600">95%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">100%</div>
                        <div className="text-xs text-gray-500">정책자금 승인률</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">자기자본 비율</div>
                          <div className="font-bold text-orange-600">28%</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">6.2%</div>
                        <div className="text-xs text-gray-500">연평균 자산상승률</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">담당 컨설턴트</div>
                      <div className="font-bold text-gray-900">이후경 책임컨설턴트</div>
                      <div className="text-xs text-gray-500">기업의별 경영지도센터</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Zen Framework */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Model Zen <span className="text-orange-600">프레임워크</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              체계적인 5단계 가치 창출 프로세스로 경매 공장구매의 모든 과정을 완벽하게 관리합니다
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                icon: Search,
                title: '가치 발견',
                subtitle: '현황 진단',
                description: '종합 투자 적합성 진단을 통한 맞춤형 투자 전략 발굴',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                step: '02',
                icon: Lightbulb,
                title: '가치 창출',
                subtitle: '전략 설계',
                description: '정량적 분석 모델 기반 최적 투자 전략 및 자본구조 설계',
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50'
              },
              {
                step: '03',
                icon: Rocket,
                title: '가치 제공',
                subtitle: '실행 지원',
                description: '3-Phase 집중 컨설팅으로 투자 준비부터 사후관리까지',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                step: '04',
                icon: Target,
                title: '가치 포착',
                subtitle: '성과 측정',
                description: '정량적 투자 효과 검증 및 ROI 극대화 달성',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'bg-orange-50'
              },
              {
                step: '05',
                icon: RefreshCw,
                title: '가치 교정',
                subtitle: '지속 관리',
                description: '6개월 사후관리를 통한 지속적 자산 가치 최적화',
                color: 'from-red-500 to-red-600',
                bgColor: 'bg-red-50'
              }
            ].map((framework, index) => (
              <Card key={index} className={`${framework.bgColor} border-0 text-center relative overflow-hidden`}>
                <CardContent className="p-6">
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-gray-500 mb-2">STEP {framework.step}</div>
                    <div className={`w-16 h-16 bg-gradient-to-r ${framework.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <framework.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{framework.title}</h3>
                    <div className="text-sm font-medium text-gray-600 mb-3">{framework.subtitle}</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{framework.description}</p>
                  </div>
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/20 rounded-full"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-gray-50 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: '서비스 차별화', icon: Star },
              { id: 'framework', label: '컨설팅 프로세스', icon: BarChart3 },
              { id: 'funding', label: '정책자금 연계', icon: DollarSign },
              { id: 'cases', label: '성공 사례', icon: Trophy },
              { id: 'diagnosis', label: '투자 진단', icon: Search }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-600 text-orange-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          
          {/* 서비스 차별화 */}
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  차별화된 <span className="text-orange-600">경쟁 우위</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  단순한 경매 대행이 아닌, 통합 컨설팅 접근으로 투자 성공률을 극대화합니다
                </p>
              </div>

              {/* 경쟁사 비교 */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">경쟁사 대비 압도적 우위</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-orange-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">비교 항목</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-500">일반 부동산</th>
                        <th className="text-center py-4 px-4 font-semibold text-gray-500">경매 전문업체</th>
                        <th className="text-center py-4 px-4 font-semibold text-orange-600 bg-orange-100 rounded-t-lg">기업의별 경영지도센터</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['전문성', '낮음', '중간', '매우 높음'],
                        ['정책자금 연계', '없음', '제한적', '완벽 연계'],
                        ['세무 최적화', '없음', '없음', '전문 세무사 팀'],
                        ['사후 관리', '없음', '제한적', '6개월 무상'],
                        ['성공률', '60%', '75%', '95%'],
                        ['비즈니스 진단', '없음', '없음', 'BMZ 프레임워크'],
                        ['정책자금 승인률', '50%', '70%', '100%']
                      ].map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-4 px-4 font-medium text-gray-900">{row[0]}</td>
                          <td className="py-4 px-4 text-center text-gray-500">{row[1]}</td>
                          <td className="py-4 px-4 text-center text-gray-500">{row[2]}</td>
                          <td className="py-4 px-4 text-center font-bold text-orange-600 bg-orange-50">{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 핵심 차별화 요소 */}
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Users,
                    title: '전문가 네트워크',
                    description: '부동산 전문 변호사, 세무사, 건축사, 감정평가사, 금융 전문가 팀',
                    features: ['권리 분석 및 법적 리스크 관리', '세무 최적화 및 절세 전략', '건물 안전성 및 활용도 평가', '정확한 시가 산정', '최적 자금 조달 구조 설계']
                  },
                  {
                    icon: Zap,
                    title: 'AI 기반 분석 시스템',
                    description: '빅데이터와 머신러닝을 활용한 정밀 분석 시스템',
                    features: ['시세 예측 모델', '낙찰가 예측', '위성 이미지 입지 평가', '실시간 경매 모니터링', '투자 수익률 시뮬레이션']
                  },
                  {
                    icon: Shield,
                    title: '원스톱 서비스',
                    description: '진단부터 사후관리까지 모든 과정을 통합 관리',
                    features: ['종합 투자 진단', '정책자금 연계', '법무·세무·금융 커버', '6개월 무상 사후관리', '성과 보장 시스템']
                  }
                ].map((item, index) => (
                  <Card key={index} className="border-0 shadow-xl">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-8 h-8 text-orange-600" />
                      </div>
                      <CardTitle className="text-xl text-gray-900 mb-2">{item.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 컨설팅 프로세스 */}
          {activeTab === 'framework' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  3-Phase <span className="text-orange-600">집중 컨설팅</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  체계적인 3단계 프로세스로 투자 준비부터 사후관리까지 완벽 지원
                </p>
              </div>

              <div className="space-y-12">
                {[
                  {
                    phase: 'Phase 1',
                    title: '투자 준비 및 전략 수립',
                    duration: '2-3주',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'bg-blue-50',
                    processes: [
                      { 
                        title: '종합 투자 적합성 진단',
                        items: ['재무 역량 분석', '법적 리스크 검토', '세무 최적화 방안', '사업 연계성 평가']
                      },
                      { 
                        title: '맞춤형 투자 전략 설계',
                        items: ['NPV/IRR 분석', '민감도 분석', '최적 자본구조 설계', '투자 한도 설정']
                      },
                      { 
                        title: '정책자금 사전 심사',
                        items: ['중진공 시설자금', '신보 보증부 대출', '기보 기술담보 대출', '산업은행 정책금융']
                      }
                    ]
                  },
                  {
                    phase: 'Phase 2',
                    title: '물건 선별 및 실행',
                    duration: '4-6주',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'bg-green-50',
                    processes: [
                      { 
                        title: 'AI 기반 물건 스크리닝',
                        items: ['가격 경쟁력 분석', '입지 점수 평가', '법적 리스크 검토', '확장성 평가']
                      },
                      { 
                        title: '전문가 실사 체계',
                        items: ['법적 실사 (변호사)', '기술 실사 (건축사)', '환경 실사 (환경 컨설턴트)', '세무 실사 (세무사)']
                      },
                      { 
                        title: '경매 참여 및 낙찰',
                        items: ['최적 입찰가 산정', '경매 참여 전략', '낙찰 후 절차', '매각허가 신청']
                      }
                    ]
                  },
                  {
                    phase: 'Phase 3',
                    title: '사후관리 및 최적화',
                    duration: '2-4주 + 6개월',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'bg-purple-50',
                    processes: [
                      { 
                        title: '소유권 이전 및 자금 실행',
                        items: ['잔금 납부 및 등기', '정책자금 실행', '인허가 지원', '세무 신고']
                      },
                      { 
                        title: '6개월 사후관리',
                        items: ['월별 자산 가치 모니터링', '세무 최적화', '추가 투자 기회', '매각 타이밍 상담']
                      },
                      { 
                        title: '성과 측정 및 보고',
                        items: ['투자 효과 검증', 'ROI 분석', '만족도 조사', '개선 방안 제시']
                      }
                    ]
                  }
                ].map((phase, index) => (
                  <div key={index} className={`${phase.bgColor} rounded-3xl p-8`}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">{phase.phase}</div>
                        <h3 className="text-2xl font-bold text-gray-900">{phase.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{phase.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {phase.processes.map((process, pIndex) => (
                        <Card key={pIndex} className="bg-white border-0 shadow-md">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg text-gray-900">{process.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="space-y-2">
                              {process.items.map((item, iIndex) => (
                                <li key={iIndex} className="flex items-start text-sm">
                                  <ChevronRight className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 정책자금 연계 */}
          {activeTab === 'funding' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-orange-600">정책자금</span> 완벽 연계
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  구조개선자금, 사업전환자금, 각종 정책자금을 100% 활용하여 자기자본 부담을 최소화합니다
                </p>
              </div>

              {/* 정책자금 프로그램 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {[
                  {
                    institution: '중소벤처기업진흥공단',
                    fund: '시설자금',
                    limit: '30억원',
                    rate: '1.5-2.5%',
                    period: '10년',
                    color: 'from-blue-500 to-blue-600'
                  },
                  {
                    institution: '신용보증기금',
                    fund: '보증부 대출',
                    limit: '50억원',
                    rate: '시중-0.5%p',
                    period: '10년',
                    color: 'from-green-500 to-green-600'
                  },
                  {
                    institution: '기술보증기금',
                    fund: '기술담보 대출',
                    limit: '30억원',
                    rate: '시중-0.3%p',
                    period: '10년',
                    color: 'from-purple-500 to-purple-600'
                  },
                  {
                    institution: '산업은행',
                    fund: '정책금융',
                    limit: '무제한',
                    rate: '협의',
                    period: '15년',
                    color: 'from-orange-500 to-orange-600'
                  }
                ].map((fund, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${fund.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Banknote className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{fund.institution}</h3>
                      <div className="text-sm text-orange-600 font-medium mb-4">{fund.fund}</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">한도</span>
                          <span className="font-medium">{fund.limit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">금리</span>
                          <span className="font-medium text-green-600">{fund.rate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">기간</span>
                          <span className="font-medium">{fund.period}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 세제혜택 */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">세제혜택 최적화</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      title: '취득 단계',
                      benefits: [
                        '취득세 50% 감면 (창업기업)',
                        '이노비즈 25% 감면',
                        '벤처기업 50% 감면',
                        '산업단지 75% 감면'
                      ],
                      savings: '최대 1,500만원 절약'
                    },
                    {
                      title: '보유 단계',
                      benefits: [
                        '재산세 50% 감면 (창업기업)',
                        '공장시설 별도 세율',
                        '스마트팩토리 추가 감면',
                        '5년간 지속 적용'
                      ],
                      savings: '연간 1,000-5,000만원'
                    },
                    {
                      title: '운영 단계',
                      benefits: [
                        '투자세액공제 3-10%',
                        'R&D 세액공제 25-40%',
                        '중소기업 특별감면 10%',
                        '감가상각 최적화'
                      ],
                      savings: '연간 2,000-8,000만원'
                    }
                  ].map((stage, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">{stage.title}</h4>
                      <ul className="space-y-2 mb-4">
                        {stage.benefits.map((benefit, bIndex) => (
                          <li key={bIndex} className="flex items-start text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-green-800 font-medium">절세 효과</div>
                        <div className="text-lg font-bold text-green-600">{stage.savings}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 성공 사례 */}
          {activeTab === 'cases' && (
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-orange-600">검증된</span> 성공 사례
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  다양한 업종과 규모의 기업들이 경험한 실제 성과를 확인하세요
                </p>
              </div>

              {/* 주요 성공 사례 */}
              <div className="grid lg:grid-cols-2 gap-8 mb-16">
                {[
                  {
                    company: '제조업 A사',
                    industry: '자동차 부품 제조',
                    revenue: '매출 50억',
                    employees: '직원 30명',
                    investment: '15억원',
                    finalPrice: '12억원',
                    originalPrice: '20억원',
                    savings: '8억원 (40%)',
                    selfCapital: '3억원 (20%)',
                    policyFunds: '9억원',
                    roiPeriod: '3.1년',
                    annualSavings: '1억 2,000만원',
                    taxBenefits: '연간 3,500만원',
                    assetValue: '18억원 (5년 후)',
                    details: [
                      '연간 임대료 절약: 1억 2,000만원',
                      '세제 혜택: 연간 3,500만원',
                      '투자 회수 기간: 3.1년',
                      '5년 후 자산 가치: 18억원 (연 8.5% 상승)'
                    ]
                  },
                  {
                    company: 'IT 서비스 B사',
                    industry: '소프트웨어 개발',
                    revenue: '매출 30억',
                    employees: '직원 50명',
                    investment: '8억원',
                    finalPrice: '6억원',
                    originalPrice: '10억원',
                    savings: '4억원 (40%)',
                    selfCapital: '2억원 (25%)',
                    policyFunds: '4억원',
                    roiPeriod: '3.8년',
                    annualSavings: '8,000만원',
                    taxBenefits: '연간 2,000만원',
                    assetValue: '9억원 (5년 후)',
                    details: [
                      '스마트 오피스 구축으로 생산성 30% 향상',
                      '우수 인력 유치 용이성 증대',
                      '기업 신용등급 A-로 2단계 상승',
                      'IPO 준비 시 자산 가치 인정'
                    ]
                  }
                ].map((case_, index) => (
                  <Card key={index} className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                          <Building className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{case_.company}</CardTitle>
                          <p className="text-sm text-gray-600">{case_.industry}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{case_.revenue}</span>
                        <span>{case_.employees}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">시장가</div>
                          <div className="text-lg font-bold text-gray-900">{case_.originalPrice}</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-sm text-blue-600">낙찰가</div>
                          <div className="text-lg font-bold text-blue-600">{case_.finalPrice}</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="text-sm text-green-600">절약 효과</div>
                          <div className="text-lg font-bold text-green-600">{case_.savings}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3">
                          <div className="text-sm text-purple-600">회수 기간</div>
                          <div className="text-lg font-bold text-purple-600">{case_.roiPeriod}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">특별 성과</h4>
                        <ul className="space-y-2">
                          {case_.details.map((detail, dIndex) => (
                            <li key={dIndex} className="flex items-start text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 통계 데이터 */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">업종별 성과 분석</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { industry: '제조업', discount: '42%', period: '3.2년', satisfaction: '95%' },
                    { industry: '물류업', discount: '38%', period: '3.8년', satisfaction: '92%' },
                    { industry: 'IT/서비스', discount: '35%', period: '4.1년', satisfaction: '88%' },
                    { industry: '도소매업', discount: '40%', period: '3.5년', satisfaction: '90%' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md">
                      <h4 className="font-bold text-gray-900 mb-4">{stat.industry}</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{stat.discount}</div>
                          <div className="text-xs text-gray-600">평균 할인율</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{stat.period}</div>
                          <div className="text-xs text-gray-600">회수 기간</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{stat.satisfaction}</div>
                          <div className="text-xs text-gray-600">만족도</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 투자 진단 */}
          {activeTab === 'diagnosis' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  <span className="text-orange-600">24개 질문</span> 투자 진단
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  15분 투자로 맞춤형 투자 전략과 예상 수익률을 확인하세요
                </p>
              </div>

              {/* 진단 프로세스 */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">진단 프로세스</h3>
                <div className="grid md:grid-cols-6 gap-4">
                  {[
                    { step: '1단계', title: '기업 기본 정보', questions: '4문항' },
                    { step: '2단계', title: '투자 목적 및 규모', questions: '4문항' },
                    { step: '3단계', title: '자금 조달 능력', questions: '4문항' },
                    { step: '4단계', title: '입지 요구사항', questions: '4문항' },
                    { step: '5단계', title: '리스크 수용도', questions: '4문항' },
                    { step: '6단계', title: '정책자금 활용', questions: '4문항' }
                  ].map((stage, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center shadow-sm">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="text-xs font-medium text-gray-600 mb-1">{stage.step}</div>
                      <div className="text-sm font-bold text-gray-900 mb-1">{stage.title}</div>
                      <div className="text-xs text-orange-600">{stage.questions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 진단 결과 */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-green-600" />
                      자동 생성 리포트
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        '투자 적합성 점수 (0-100점)',
                        '권장 투자 규모 및 지역',
                        '최적 자금 조달 구조',
                        '예상 투자 효과 시뮬레이션',
                        '단계별 실행 로드맵',
                        '정책자금 신청 가이드'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      전문가 상담
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        '1차 상담: 기본 적합성 검토 (30분)',
                        '진단 결과 검토 및 해석',
                        '투자 목적 및 전략 방향성 확인',
                        '자금 조달 가능성 1차 평가',
                        '법적/세무적 이슈 사전 점검',
                        '다음 단계 계획 수립'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white px-12 py-6 text-lg"
                  onClick={() => router.push('/diagnosis')}
                >
                  <Search className="w-6 h-6 mr-3" />
                  무료 투자 진단 시작하기
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
                <p className="text-sm text-gray-600 mt-4">
                  * 진단 소요시간: 약 15분 | 즉시 결과 확인 가능
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-yellow-600 to-amber-600 relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle r="3" cx="10" cy="10"/%3E%3Ccircle r="3" cx="50" cy="50"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">전문가 추천 No.1 경매 컨설팅</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              지금 시작하세요!<br />
              <span className="text-yellow-200">차별화된 투자 기회</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-4 text-orange-100 font-medium">
              "시장가 대비 평균 40% 절약, 정책자금 100% 활용"
            </p>
            
            <p className="text-lg mb-12 text-orange-100 max-w-3xl mx-auto leading-relaxed">
              입지분석·사업타당성 검토·비즈니스모델 진단과 구조개선·사업전환·정책자금 컨설팅을 
              통합 제공하는 유일한 경매 공장구매 컨설팅 서비스
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-300 mb-2">95%</div>
                <div className="text-sm text-orange-100">투자 성공률</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-300 mb-2">3.2년</div>
                <div className="text-sm text-orange-100">평균 회수기간</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-300 mb-2">100%</div>
                <div className="text-sm text-orange-100">정책자금 승인률</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 px-10 py-6 text-lg font-semibold shadow-2xl"
                onClick={() => router.push('/consultation')}
              >
                <Phone className="w-6 h-6 mr-3" />
                전문가 상담 신청
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-10 py-6 text-lg font-semibold"
                onClick={() => router.push('/diagnosis')}
              >
                <Search className="w-6 h-6 mr-3" />
                무료 투자 진단
              </Button>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-bold text-yellow-300 mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    즉시 상담 가능
                  </h4>
                  <div className="space-y-2 text-sm text-orange-100">
                    <p><strong>담당:</strong> 이후경 책임컨설턴트</p>
                    <p><strong>전화:</strong> 010-9251-9743</p>
                    <p><strong>이메일:</strong> hongik423@gmail.com</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    서비스 보장
                  </h4>
                  <div className="space-y-2 text-sm text-orange-100">
                    <p>• 90% 이상 정확도의 낙찰가 예측</p>
                    <p>• 정책자금 승인률 95% 보장</p>
                    <p>• 미달성 시 차액 보상</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 