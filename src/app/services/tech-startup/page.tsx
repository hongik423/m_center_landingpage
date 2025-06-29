'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';

import { 
  Rocket, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Award,
  Clock,
  ArrowLeft,
  Target,
  Lightbulb,
  DollarSign,
  Star,
  Building2,
  FileText,
  Zap,
  Brain,
  Factory,
  Globe,
  BookOpen,
  BarChart3,
  Phone,
  Calendar,
  ChevronRight,
  PieChart,
  Briefcase,
  Settings,
  UserCheck,
  Cpu,
  Network,
  TrendingDown,
  MapPin,
  MessageSquare
} from 'lucide-react';

export default function TechStartupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // 핵심 가치 제안
  const coreValues = [
    {
      title: '자금 조달 최적화',
      description: '평균 5억원 (정부지원 3억 + 민간투자 2억)',
      value: '5억원',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: '성공률 극대화',
      description: '체계적 준비로 창업 성공률 95% 달성',
      value: '95%',
      icon: Award,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: '기술 보호 강화',
      description: '핵심 특허 3-5건 출원 및 IP 포트폴리오 구축',
      value: '3-5건',
      icon: Shield,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: '세제 혜택 최대화',
      description: '연구개발비 세액공제 최대 40% 활용',
      value: '40%',
      icon: Target,
      color: 'from-orange-500 to-red-600'
    }
  ];

  // Business Model Zen 5단계
  const bmzFramework = [
    {
      stage: '1단계',
      title: '가치 발견',
      description: '기술사업화 적합성 진단',
      details: ['기술 역량 평가', '시장 가능성 분석', '사업 실행력 검토', '성장 잠재력 진단'],
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      stage: '2단계',
      title: '가치 창출',
      description: '맞춤형 사업화 전략 설계',
      details: ['기술 가치 평가', '시장 진입 전략', '재무 모델링', '리스크 분석'],
      icon: Brain,
      color: 'from-purple-400 to-pink-500'
    },
    {
      stage: '3단계',
      title: '가치 제공',
      description: '전문가 실행 지원',
      details: ['기반 구축', '자금 확보', '사업 실행', '성장 가속화'],
      icon: Rocket,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      stage: '4단계',
      title: '가치 포착',
      description: '성과 측정',
      details: ['자금 확보 성과', '특허 출원 실적', '매출 달성 현황', '고용 창출 효과'],
      icon: BarChart3,
      color: 'from-green-400 to-teal-500'
    },
    {
      stage: '5단계',
      title: '가치 교정',
      description: '6개월 사후관리',
      details: ['월별 성과 모니터링', '추가 R&D 과제 발굴', '후속 투자 유치', '차기 성장 전략'],
      icon: Settings,
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  // 성장 4단계별 전략
  const growthStages = [
    {
      stage: 'Step 1',
      period: '창업-3년',
      title: '실패 없는 창업, 확실한 시작',
      target: '안정적 사업 기반 구축',
      keyActions: ['사업계획 타당성 검토', '초기 창업자금 종합 지원', '창업성장 기술개발 R&D'],
      funding: ['디딤돌 창업과제 (1억원)', 'TIPS 프로그램 (3억원)', '중진공 창업자금 (1억원)'],
      icon: Building2,
      color: 'from-emerald-500 to-green-600'
    },
    {
      stage: 'Step 2',
      period: '3-7년',
      title: '기술경쟁력으로 자본 증대',
      target: '조직 확장 및 기술 고도화',
      keyActions: ['연구소 설립', '벤처인증 취득', '고성과 조직구축'],
      funding: ['기업부설연구소 설립', '벤처기업확인 취득', '이노비즈/메인비즈 인증'],
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      stage: 'Step 3',
      period: '7-10년',
      title: '혁신기술로 시장 주도',
      target: '시장 경쟁 차별화 및 사업 다각화',
      keyActions: ['정부 R&D 과제 수주', '사업다각화', '스마트 제조'],
      funding: ['산업기술혁신사업', '스마트공장 구축', '신규사업 진출'],
      icon: Factory,
      color: 'from-purple-500 to-violet-600'
    },
    {
      stage: 'Step 4',
      period: '10년 이상',
      title: '지속 혁신으로 미래 개척',
      target: '글로벌 진출 및 혁신 생태계 구축',
      keyActions: ['사업구조 재편', '사내벤처 운영', '글로벌 진출'],
      funding: ['지주회사 체제', '스케일업 금융', '해외 진출 지원'],
      icon: Globe,
      color: 'from-red-500 to-pink-600'
    }
  ];

  // 실행 프로세스 4-Phase
  const executionPhases = [
    {
      phase: 'Phase 1',
      period: '1-4주',
      title: '기반 구축',
      activities: ['사업계획서 고도화', '기술사업 타당성 검토', '팀 빌딩 최적화', '초기 자금 조달 전략'],
      deliverables: ['완성된 사업계획서', '기술성 평가 리포트', '팀 구성 계획', '자금 조달 로드맵'],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      phase: 'Phase 2',
      period: '5-12주',
      title: '자금 확보',
      activities: ['정책자금 신청', '민간 투자 유치', 'R&D 과제 기획', '심사 대응 지원'],
      deliverables: ['정책자금 승인', '투자 유치 성공', 'R&D 과제 선정', '자금 확보 완료'],
      color: 'from-green-500 to-teal-500'
    },
    {
      phase: 'Phase 3',
      period: '13-20주',
      title: '사업 실행',
      activities: ['연구소 설립', '벤처인증 취득', '기술개발 지원', '시장 진입'],
      deliverables: ['연구소 설립 완료', '벤처기업 인증', '제품 개발 완료', '초기 매출 창출'],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      phase: 'Phase 4',
      period: '21-24주',
      title: '성장 가속화',
      activities: ['사업 확장', '추가 투자 유치', '조직 체계화', '지속 성장 전략'],
      deliverables: ['매출 확대', '시리즈 A 투자', '조직 안정화', '성장 계획 수립'],
      color: 'from-purple-500 to-pink-500'
    }
  ];

  // 정부 R&D 프로그램
  const rdPrograms = [
    {
      name: '디딤돌 창업과제',
      funding: '1억원',
      period: '3년',
      target: '창업 초기',
      successRate: '85%',
      description: '기술성 평가 집중 대비'
    },
    {
      name: 'TIPS',
      funding: '3억원',
      period: '3년',
      target: '성장 단계',
      successRate: '72%',
      description: '민간 매칭 투자 확보'
    },
    {
      name: '중기 기혁',
      funding: '5억원',
      period: '3년',
      target: '확장 단계',
      successRate: '68%',
      description: '사업화 계획 구체화'
    },
    {
      name: '산업기술혁신',
      funding: '10억원',
      period: '5년',
      target: '성숙 단계',
      successRate: '65%',
      description: '컨소시엄 구성 최적화'
    }
  ];

  // 성과 지표
  const performanceMetrics = [
    {
      metric: '자금 확보 성공률',
      target: '80%',
      actual: '87%',
      description: '승인액/신청액 기준'
    },
    {
      metric: '특허 출원 건수',
      target: '3-5건',
      actual: '평균 4.2건',
      description: '핵심 기술 특허 포트폴리오'
    },
    {
      metric: '매출 달성률',
      target: '100%',
      actual: '125%',
      description: '실제매출/목표매출 기준'
    },
    {
      metric: '고용 창출 효과',
      target: '10명',
      actual: '평균 12명',
      description: '신규 채용 인원 수'
    }
  ];

  // 고객 사례
  const successCases = [
    {
      company: '바이오벤처 C사',
      industry: '바이오 진단 키트',
      period: '설립 2년',
      employees: '15명',
      investment: '8억원 (정부 5억 + 엔젤 3억)',
      patents: '6건',
      revenue: '설립 3년차 연매출 12억원',
      valuation: '시리즈 A 투자 시 150억원',
      jobs: '연구개발 인력 20명 채용'
    },
    {
      company: 'AI 스타트업 D사',
      industry: '산업용 AI 솔루션',
      period: '설립 3년',
      employees: '25명',
      investment: '12억원 (정부 4억 + VC 8억)',
      patents: '4건',
      revenue: '대기업 파트너십 체결',
      valuation: '2026년 코스닥 상장 목표',
      jobs: '해외 진출 동남아 3개국'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal hover:text-blue-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                서비스 목록
              </Button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-blue-600 font-medium">기술사업화/기술창업</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                  <Rocket className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">평균 5억원 자금 확보로 기술창업 성공률 95% 달성</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    기술사업화/기술창업
                  </span>
                  <br />
                  <span className="text-2xl md:text-3xl lg:text-4xl text-gray-700">
                    컨설팅
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong className="text-blue-600">Business Model Zen 프레임워크</strong> 기반 기술사업화 전주기 지원으로 
                  평균 5억원 자금을 확보하고 성공적인 기술창업을 실현하세요.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-gray-600">창업 성공률</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                    <div className="text-2xl font-bold text-purple-600">5억원</div>
                    <div className="text-sm text-gray-600">평균 자금 확보</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100">
                    <div className="text-2xl font-bold text-green-600">3-5건</div>
                    <div className="text-sm text-gray-600">특허 출원</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-orange-100">
                    <div className="text-2xl font-bold text-orange-600">40%</div>
                    <div className="text-sm text-gray-600">세액공제 최대</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 개선된 무료 상담 신청 버튼 */}
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                    onClick={() => router.push('/consultation')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative flex items-center">
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce transition-transform duration-200" />
                      무료 상담 신청
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                  
                  {/* 개선된 기술사업화 적합성 진단 버튼 */}
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 border-2 border-blue-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 hover:bg-blue-50 transform hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative overflow-hidden group"
                    onClick={() => router.push('/diagnosis')}
                  >
                    <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative flex items-center">
                      <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      기술사업화 적합성 진단
                    </span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-blue-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">전문가 수준의 서비스</h3>
                      <p className="text-sm text-gray-600">세무사 전문가를 위한 탁월한 서비스</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">6개월 (24주)</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">평균 자금 확보</span>
                      <span className="font-semibold text-blue-600">5억원</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">창업 성공률</span>
                      <span className="font-semibold text-green-600">95%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">특허 출원</span>
                      <span className="font-semibold text-purple-600">3-5건</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">사후 관리</span>
                      <span className="font-semibold">6개월 무상</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">서비스 핵심 가치</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                기술사업화의 전략적 의미
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                기술사업화는 단순한 창업을 넘어선 <strong className="text-blue-600">기술 기반 혁신 비즈니스 창출</strong>입니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`h-24 bg-gradient-to-r ${value.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <value.icon className="w-10 h-10 text-white relative z-10" />
                    </div>
                    <div className="p-6">
                      <div className="text-2xl font-bold text-gray-900 mb-2">{value.value}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 세무사 관점의 차별화 포인트 */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">세무사 시각에서 주목할 포인트</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">연구개발비 세액공제 최적화 (신규 40%, 계속 25%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">벤처기업 세제 혜택 (법인세 50% 감면, 4년간)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">기술취득세액공제 (기술출자 시 양도소득세 이연)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">스톡옵션 과세특례 (비과세 한도 5억원)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성장 4단계별 맞춤 전략 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">성장 4단계별 맞춤 전략</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                기업 성장 단계별 전문 지원
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                창업부터 글로벌 진출까지, 각 성장 단계에 최적화된 전략적 지원을 제공합니다.
              </p>
            </div>

            <div className="space-y-8">
              {growthStages.map((stage, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-4 gap-0">
                      <div className={`bg-gradient-to-r ${stage.color} p-6 flex flex-col justify-center items-center text-white relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                        <stage.icon className="w-12 h-12 mb-3 relative z-10" />
                        <div className="text-lg font-bold mb-1 relative z-10">{stage.stage}</div>
                        <div className="text-sm text-white/90 relative z-10">{stage.period}</div>
                      </div>
                      <div className="lg:col-span-3 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{stage.title}</h3>
                        <p className="text-gray-600 mb-4 font-medium">핵심 목표: {stage.target}</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Zap className="w-4 h-4 mr-2 text-blue-500" />
                              주요 실행 전략
                            </h4>
                            <div className="space-y-2">
                              {stage.keyActions.map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                              자금 지원 방안
                            </h4>
                            <div className="space-y-2">
                              {stage.funding.map((fund, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                  <span className="text-sm text-gray-700">{fund}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Zen Framework */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Business Model Zen 프레임워크</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                5단계 가치 창출 체계
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                체계적이고 검증된 프레임워크로 기술사업화 성공률을 극대화합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {bmzFramework.map((stage, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`h-20 bg-gradient-to-r ${stage.color} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <stage.icon className="w-8 h-8 text-white relative z-10" />
                    </div>
                    <div className="p-4">
                      <div className="text-sm font-bold text-gray-500 mb-1">{stage.stage}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{stage.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                      <div className="space-y-1">
                        {stage.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {index < bmzFramework.length - 1 && (
                      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center z-10 lg:block hidden">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 전문가 수준의 실행 프로세스 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
                <Settings className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">전문가 수준의 실행 프로세스</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                4-Phase 집중 컨설팅 프로그램
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                단계별 체계적 접근으로 기술사업화 성공을 보장합니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {executionPhases.map((phase, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`h-16 bg-gradient-to-r ${phase.color} flex items-center justify-center relative`}>
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300"></div>
                      <div className="text-white font-bold text-lg relative z-10">
                        {phase.phase}: {phase.title}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">{phase.period}</span>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-blue-500" />
                          주요 활동
                        </h4>
                        <div className="space-y-2">
                          {phase.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Award className="w-4 h-4 mr-2 text-green-500" />
                          주요 성과물
                        </h4>
                        <div className="space-y-2">
                          {phase.deliverables.map((deliverable, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{deliverable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 정부 R&D 및 정책자금 최적화 */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">정부 R&D 및 정책자금 최적화</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                주요 R&D 프로그램 매칭
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                창업 단계별 최적 R&D 프로그램을 매칭하여 자금 확보 성공률을 극대화합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {rdPrograms.map((program, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900">{program.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">지원 규모</span>
                        <span className="font-bold text-green-600">{program.funding}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">지원 기간</span>
                        <span className="font-semibold">{program.period}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">대상 단계</span>
                        <span className="font-semibold text-blue-600">{program.target}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">성공률</span>
                        <span className="font-bold text-orange-600">{program.successRate}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600">{program.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 정책금융 최적 조합 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-blue-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">정책금융 최적 조합</h3>
                  <p className="text-sm text-gray-600">단계별 최적 자금 조달 전략</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-sm font-medium text-blue-800 mb-1">1단계</div>
                  <div className="text-xs text-blue-600 mb-2">중진공 창업자금</div>
                  <div className="font-bold text-blue-900">1억원</div>
                  <div className="text-xs text-blue-700">무이자 3년</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
                  <div className="text-sm font-medium text-green-800 mb-1">2단계</div>
                  <div className="text-xs text-green-600 mb-2">기보/신보 보증부 대출</div>
                  <div className="font-bold text-green-900">5억원</div>
                  <div className="text-xs text-green-700">보증 지원</div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-sm font-medium text-purple-800 mb-1">3단계</div>
                  <div className="text-xs text-purple-600 mb-2">성장사다리펀드</div>
                  <div className="font-bold text-purple-900">10억원</div>
                  <div className="text-xs text-purple-700">투자 지원</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
                  <div className="text-sm font-medium text-orange-800 mb-1">4단계</div>
                  <div className="text-xs text-orange-600 mb-2">산업은행 성장금융</div>
                  <div className="font-bold text-orange-900">30억원</div>
                  <div className="text-xs text-orange-700">대규모 금융</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성과 측정 및 ROI 분석 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">성과 측정 및 ROI 분석</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                검증된 투자 성과
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                정량적 성과 지표를 통해 투자 효과를 명확하게 측정하고 검증합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{metric.metric}</h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">목표: {metric.target}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-green-600">{metric.actual}</span>
                    </div>
                    <p className="text-xs text-gray-600">{metric.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ROI 분석 */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 md:p-8 border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">종합 ROI 분석</h3>
                <p className="text-gray-600">5억원 투자 기준 수익률 분석</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">42.5%</div>
                    <div className="text-sm text-gray-600 mb-1">내부 수익률 (IRR)</div>
                    <div className="text-xs text-gray-500">기본 시나리오</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">3.3년</div>
                    <div className="text-sm text-gray-600 mb-1">투자 회수 기간</div>
                    <div className="text-xs text-gray-500">평균 회수 기간</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">15억원</div>
                    <div className="text-sm text-gray-600 mb-1">3년 누적 매출</div>
                    <div className="text-xs text-gray-500">목표 매출 달성</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객 사례 */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">고객 사례 및 실증 데이터</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                검증된 성공 사례
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                실제 고객사의 성공 사례를 통해 검증된 성과를 확인하세요.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {successCases.map((case_, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{case_.company}</CardTitle>
                        <p className="text-blue-100 text-sm">{case_.industry}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">설립 현황</div>
                        <div className="font-semibold">{case_.period}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">직원 수</div>
                        <div className="font-semibold">{case_.employees}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm"><strong>투자 유치:</strong> {case_.investment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm"><strong>특허 출원:</strong> {case_.patents}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                        <span className="text-sm"><strong>매출 성과:</strong> {case_.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" />
                        <span className="text-sm"><strong>기업 가치:</strong> {case_.valuation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm"><strong>고용 창출:</strong> {case_.jobs}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 상담 및 문의 CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              성공적인 기술창업을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Business Model Zen 프레임워크로 평균 5억원 자금을 확보하고 
              95% 성공률로 안전하게 기술사업화를 실현하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => router.push('/consultation')}
              >
                <Phone className="w-5 h-5 mr-2" />
                무료 상담 신청
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Brain className="w-5 h-5 mr-2" />
                기술사업화 적합성 진단
              </Button>
            </div>
            <div className="text-center">
              <p className="text-blue-200 mb-2">전문가 직접 상담</p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">010-9251-9743</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>hongik423@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 