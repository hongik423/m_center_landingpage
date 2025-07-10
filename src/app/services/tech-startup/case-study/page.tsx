'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  Building, 
  Award,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Star,
  Clock,
  BarChart3,
  Zap,
  FileText,
  Shield,
  DollarSign,
  Globe,
  Youtube,
  Search,
  MessageCircle,
  Database,
  Bot,
  Phone,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/layout/header';

export default function TechStartupCaseStudyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('timeline');

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  const handleBack = () => {
    window.location.href = '/support/faq';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Header />
      
      {/* Q&A로 돌아가기 버튼 */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/support/qa')}
          className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-orange-50 border-orange-300 hover:border-orange-600 text-orange-700 hover:text-orange-600 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <span className="relative flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
            Q&A로 돌아가기
          </span>
        </Button>
      </div>

      {/* 히어로 섹션 */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-8">
          {/* 히어로 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 
                            text-purple-700 rounded-full font-semibold text-sm mb-6">
              <Rocket className="w-4 h-4" />
              <span>기술사업화 성공사례</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                (주)ABC기업
              </span>
              <br />
              레이저솔드링기술 기술사업화 성공사례
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              예비벤처 → 벤처기업 → TIPS 선정 → IPO 준비까지<br />
              시계열 단계별 기술사업화 완전 성공 스토리
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'timeline', label: '시계열 성장과정', icon: Calendar },
            { id: 'strategy', label: '성장 전략', icon: Target },
            { id: 'funding', label: '자금 확보', icon: DollarSign },
            { id: 'marketing', label: '온라인 마케팅', icon: Globe },
            { id: 'results', label: '성과 분석', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`${activeTab === tab.id ? 'bg-gradient-to-r from-purple-500 to-blue-600' : ''}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* 탭 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2">
            {activeTab === 'timeline' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                    시계열 성장 과정 (2019-2025)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 2019-2020: 창업 준비기 */}
                  <div className="relative pl-8 border-l-4 border-purple-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-900 mb-4">
                        2019-2020: 창업 준비기
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">핵심 활동</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• 레이저솔드링기술 특허 출원 (3건)</li>
                            <li>• 예비벤처기업 확인</li>
                            <li>• 창업팀 구성 (5명)</li>
                            <li>• 기술개발 및 시제품 제작</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">확보 자금</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• 창업지원 디딤돌과제: 1억원</li>
                            <li>• 예비창업패키지: 5천만원</li>
                            <li>• 자기자본: 2천만원</li>
                            <li>• 총 자금: 1.7억원</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2021-2022: 벤처기업 성장기 */}
                  <div className="relative pl-8 border-l-4 border-blue-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">
                        2021-2022: 벤처기업 성장기
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">핵심 활동</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 벤처기업 확인 취득</li>
                            <li>• 중소기업 기술개발사업 선정</li>
                            <li>• 대기업 협력업체 등록 (3개사)</li>
                            <li>• 양산 체제 구축</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">확보 자금</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 중소기업 기술개발: 3억원</li>
                            <li>• 정책자금 (공장설립): 8억원</li>
                            <li>• 매출액: 12억원</li>
                            <li>• 총 누적 자금: 24.7억원</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2023: 해외진출 및 투자유치기 */}
                  <div className="relative pl-8 border-l-4 border-green-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-green-900 mb-4">
                        2023: 해외진출 및 투자유치기
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">핵심 활동</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 구매조건부 R&D 선정</li>
                            <li>• 해외시장진출지원사업 선정</li>
                            <li>• TIPS 프로그램 선정</li>
                            <li>• VC 투자유치 성공</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">확보 자금</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 구매조건부 R&D: 5억원</li>
                            <li>• 해외진출지원: 2억원</li>
                            <li>• TIPS 투자: 15억원</li>
                            <li>• 매출액: 35억원</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2024-2025: IPO 준비기 */}
                  <div className="relative pl-8 border-l-4 border-orange-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-orange-900 mb-4">
                        2024-2025: IPO 준비기
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">핵심 활동</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• IPO 전략 수립</li>
                            <li>• 코스닥 상장 준비</li>
                            <li>• 글로벌 시장 확대</li>
                            <li>• 디지털 마케팅 강화</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">목표 성과</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• 예상 매출: 120억원</li>
                            <li>• 기업가치: 500억원</li>
                            <li>• 직원 수: 80명</li>
                            <li>• 해외 매출 비중: 40%</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'strategy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-blue-600" />
                    단계별 성장 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">기술개발 전략</h3>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• 핵심 특허 확보 및 지속적 R&D</li>
                        <li>• 정부 R&D 과제 연속 수행</li>
                        <li>• 대학-연구소 협력 네트워크</li>
                        <li>• 국제 표준화 활동 참여</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">시장진입 전략</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 대기업 협력업체 등록 우선</li>
                        <li>• 틈새시장 공략 후 확장</li>
                        <li>• 해외시장 동시 진출</li>
                        <li>• 고객 맞춤형 솔루션 제공</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">자금조달 전략</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• 정부지원사업 단계적 활용</li>
                        <li>• 정책자금으로 인프라 구축</li>
                        <li>• VC 투자 유치로 성장 가속</li>
                        <li>• IPO 통한 대규모 자금 조달</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-orange-900 mb-4">조직역량 전략</h3>
                      <ul className="space-y-2 text-sm text-orange-800">
                        <li>• 핵심 인재 영입 및 유지</li>
                        <li>• 기술-영업-마케팅 균형</li>
                        <li>• 글로벌 역량 강화</li>
                        <li>• 기업문화 및 거버넌스 구축</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'funding' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    단계별 자금 확보 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">총 누적 자금 확보</h3>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-green-600 mb-2">87억원</p>
                      <p className="text-gray-600">2019-2024년 누적</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        category: "정부 R&D 지원",
                        amount: "15억원",
                        color: "blue",
                        details: ["창업지원 디딤돌과제", "중소기업 기술개발", "구매조건부 R&D", "해외진출지원"]
                      },
                      {
                        category: "정책자금 (공장설립)",
                        amount: "8억원",
                        color: "purple",
                        details: ["시설자금 대출", "연 2.5% 저금리", "10년 분할상환", "M-CENTER 컨설팅"]
                      },
                      {
                        category: "민간투자 (TIPS)",
                        amount: "15억원",
                        color: "green",
                        details: ["시리즈A 투자", "전략적 투자자", "기업가치 100억원", "지분 15% 매각"]
                      },
                      {
                        category: "매출 및 영업수익",
                        amount: "49억원",
                        color: "orange",
                        details: ["국내 매출 30억", "해외 매출 19억", "연평균 성장률 180%", "영업이익률 25%"]
                      }
                    ].map((funding, index) => (
                      <div key={index} className={`bg-${funding.color}-50 p-6 rounded-lg border-l-4 border-${funding.color}-500`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`text-lg font-bold text-${funding.color}-900`}>
                            {funding.category}
                          </h4>
                          <span className={`text-2xl font-bold text-${funding.color}-700`}>
                            {funding.amount}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {funding.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className={`text-xs text-${funding.color}-700 bg-white p-2 rounded`}>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'marketing' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-600" />
                    디지털 마케팅 & 온라인 매출 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 온라인 매출 증대 성과</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">580%</p>
                        <p className="text-sm text-gray-600">온라인 문의 증가</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">45%</p>
                        <p className="text-sm text-gray-600">온라인 매출 비중</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">95%</p>
                        <p className="text-sm text-gray-600">AI 챗봇 만족도</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">200+</p>
                        <p className="text-sm text-gray-600">월 신규 고객</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Youtube className="w-8 h-8 text-red-600" />
                        <h3 className="text-lg font-bold text-red-900">YouTube 기술 마케팅</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li>• 레이저솔드링 기술 시연 영상</li>
                        <li>• 고객사 적용 사례 소개</li>
                        <li>• 기술 세미나 라이브 방송</li>
                        <li>• 구독자 15,000명 달성</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Search className="w-8 h-8 text-blue-600" />
                        <h3 className="text-lg font-bold text-blue-900">검색엔진 최적화</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 기술 키워드 상위 노출</li>
                        <li>• 구글/네이버 1페이지 달성</li>
                        <li>• AI 검색 최적화 대응</li>
                        <li>• 월 방문자 50,000명</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Bot className="w-8 h-8 text-purple-600" />
                        <h3 className="text-lg font-bold text-purple-900">AI 챗봇 상담</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• 24시간 기술 상담 서비스</li>
                        <li>• 제품 사양 자동 추천</li>
                        <li>• 견적 산출 자동화</li>
                        <li>• 상담 만족도 95%</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Database className="w-8 h-8 text-green-600" />
                        <h3 className="text-lg font-bold text-green-900">CRM 시스템</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• 고객 데이터 통합 관리</li>
                        <li>• 영업 기회 자동 추천</li>
                        <li>• 맞춤형 마케팅 자동화</li>
                        <li>• 고객 전환율 40% 향상</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'results' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    종합 성과 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                      <Building className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">500억원</p>
                      <p className="text-sm opacity-90">기업가치</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">120억원</p>
                      <p className="text-sm opacity-90">연매출 (2024)</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">80명</p>
                      <p className="text-sm opacity-90">직원 수</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                      <Globe className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">40%</p>
                      <p className="text-sm opacity-90">해외 매출 비중</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 연도별 성장 추이</h3>
                    <div className="space-y-4">
                      {[
                        { year: '2019', revenue: '0.5억', growth: '창업', color: 'purple' },
                        { year: '2020', revenue: '2억', growth: '300%', color: 'blue' },
                        { year: '2021', revenue: '8억', growth: '300%', color: 'green' },
                        { year: '2022', revenue: '25억', growth: '213%', color: 'yellow' },
                        { year: '2023', revenue: '65억', growth: '160%', color: 'orange' },
                        { year: '2024', revenue: '120억', growth: '85%', color: 'red' }
                      ].map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-16">{data.year}</span>
                          <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                            <div 
                              className={`bg-${data.color}-500 h-3 rounded-full`} 
                              style={{width: `${Math.min(100, (parseInt(data.revenue) / 120) * 100)}%`}}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-20 text-right">{data.revenue}</span>
                          <span className="text-xs text-gray-600 w-16 text-right">({data.growth})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">🏆 주요 성취</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">TIPS 선정 (2023)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">벤처기업 확인 (2021)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">특허 등록 5건</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">대기업 협력업체 등록</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">💰 ROI 분석</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">총 투자금</span>
                          <span className="font-semibold text-green-900">23억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">현재 기업가치</span>
                          <span className="font-semibold text-green-900">500억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">투자 수익률</span>
                          <span className="font-semibold text-green-900">2,174%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">연평균 성장률</span>
                          <span className="font-semibold text-green-900">180%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 기업 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  (주)ABC기업 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">설립연도</p>
                    <p className="font-semibold">2019년</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">핵심기술</p>
                    <p className="font-semibold">레이저솔드링기술</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">특허보유</p>
                    <p className="font-semibold">5건 (출원 3건)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">성장단계</p>
                    <p className="font-semibold text-purple-600">IPO 준비</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 핵심 성공요인 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  성공 요인
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-semibold">단계별 전략</p>
                      <p className="text-xs text-gray-600">체계적인 성장 로드맵</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-semibold">정부지원 활용</p>
                      <p className="text-xs text-gray-600">최적의 지원사업 선택</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-semibold">기술 차별화</p>
                      <p className="text-xs text-gray-600">핵심 특허 확보</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-sm font-semibold">시장 진입</p>
                      <p className="text-xs text-gray-600">대기업 협력 우선</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상담 신청 */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Phone className="w-5 h-5" />
                  기술사업화 상담
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-purple-600">
                    귀하의 기술도 ABC기업과 같은 성공을 경험해보세요!
                  </p>
                  <Button 
                    onClick={handleConsultation}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    상담 신청하기
                  </Button>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>📞 전화: 010-9251-9743</p>
                    <p>📧 이메일: hongik423@gmail.com</p>
                    <p>🕐 상담시간: 평일 09:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 다른 사례 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-gray-500" />
                  다른 성공사례
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.open('/images/bmzwn_CASE.PDF', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    BM ZEN 사업분석 사례
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.location.href = '/services/website/case-study'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    웹사이트 구축 사례
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.open('/images/관광개발시설과튼튼론자금사례.pdf', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    정책자금 확보 사례
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 하단 액션 */}
      <div className="mt-8 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="px-8 py-3 bg-orange-600 hover:bg-orange-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
            onClick={() => router.push('/consultation')}
          >
            <span className="absolute inset-0 bg-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <Rocket className="w-5 h-5 mr-2" />
              기술창업 상담 신청하기
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-orange-600 text-gray-700 hover:text-orange-600 hover:shadow-md relative overflow-hidden group"
            onClick={() => router.push('/services/tech-startup')}
          >
            <span className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
              서비스 상세 보기
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
} 