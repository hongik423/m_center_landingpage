'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Factory, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  Phone, 
  Mail, 
  ExternalLink,
  Star,
  Award,
  Target,
  Zap,
  Users,
  BarChart3,
  Briefcase,
  Wrench,
  RefreshCw,
  Lightbulb,
  PiggyBank,
  CreditCard,
  BanknoteIcon,
  Percent
} from 'lucide-react';
import Header from '@/components/layout/header';

export default function PolicyFundingCaseStudyPage() {
  const [activeTab, setActiveTab] = useState('timeline');

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  const handleBack = () => {
    window.location.href = '/support/faq';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header />
      
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="mb-8">
          <Button 
            onClick={handleBack}
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Q&A로 돌아가기
          </Button>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 
                            text-orange-700 rounded-full font-semibold text-sm mb-6">
              <Factory className="w-4 h-4" />
              <span>정책자금 활용사례</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                (주)ABC기업
              </span>
              <br />
              정책자금 시계열 활용 완전 사례
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              창업자금 → 운영자금 → 시설자금 → 구조개선자금 → 사업전환자금까지<br />
              기업 생애주기별 정책자금 완전 활용 성공 스토리
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'timeline', label: '시계열 자금활용', icon: Calendar },
            { id: 'institutions', label: '금융기관별 활용', icon: Building },
            { id: 'guarantee', label: '보증기관 활용', icon: Shield },
            { id: 'strategy', label: '단계별 전략', icon: Target },
            { id: 'results', label: '성과 분석', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`${activeTab === tab.id ? 'bg-gradient-to-r from-orange-500 to-red-600' : ''}`}
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
                    <Calendar className="w-6 h-6 text-orange-600" />
                    시계열 정책자금 활용 과정 (2019-2025)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 1단계: 창업자금 */}
                  <div className="relative pl-8 border-l-4 border-green-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-green-900 mb-4">
                        2019년: 창업자금 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">활용 정책자금</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 창업지원자금: 5천만원 (기보 보증)</li>
                            <li>• 청년창업자금: 3천만원 (신보 보증)</li>
                            <li>• 예비창업패키지: 5천만원 (정부지원)</li>
                            <li>• 총 확보 자금: 1.3억원</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">자금 활용처</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 사업자등록 및 법인설립</li>
                            <li>• 초기 운영자금</li>
                            <li>• 시제품 개발비</li>
                            <li>• 사무실 보증금 및 임대료</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2단계: 운영자금 */}
                  <div className="relative pl-8 border-l-4 border-blue-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">
                        2020-2021년: 운영자금 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">활용 정책자금</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 운영자금 대출: 2억원 (기보 보증)</li>
                            <li>• 특허담보 대출: 1억원 (신보 보증)</li>
                            <li>• 매출채권 담보 대출: 1.5억원</li>
                            <li>• 총 확보 자금: 4.5억원</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">자금 활용처</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 인건비 및 제조원가</li>
                            <li>• 원재료 구매</li>
                            <li>• 마케팅 및 영업비용</li>
                            <li>• 연구개발 투자</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3단계: 시설자금 */}
                  <div className="relative pl-8 border-l-4 border-purple-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-900 mb-4">
                        2022년: 시설자금 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">활용 정책자금</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• 공장설립자금: 8억원 (중진공)</li>
                            <li>• 설비자금: 5억원 (기보 보증)</li>
                            <li>• 지역보증재단: 2억원</li>
                            <li>• 총 확보 자금: 15억원</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">자금 활용처</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• 공장 부지 매입</li>
                            <li>• 공장 건축 비용</li>
                            <li>• 생산설비 도입</li>
                            <li>• 품질관리 시설</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4단계: 구조개선자금 */}
                  <div className="relative pl-8 border-l-4 border-orange-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-orange-900 mb-4">
                        2023년: 구조개선자금 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">활용 정책자금</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• 구조개선자금: 10억원 (중진공)</li>
                            <li>• 스마트공장 구축: 3억원</li>
                            <li>• 친환경 전환: 2억원</li>
                            <li>• 총 확보 자금: 15억원</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">자금 활용처</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• 생산라인 자동화</li>
                            <li>• 디지털화 투자</li>
                            <li>• 친환경 설비 도입</li>
                            <li>• 조직 구조조정</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5단계: 사업전환자금 */}
                  <div className="relative pl-8 border-l-4 border-red-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-red-900 mb-4">
                        2024-2025년: 사업전환자금 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">활용 정책자금</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 사업전환자금: 12억원 (중진공)</li>
                            <li>• 신사업 개발: 5억원</li>
                            <li>• 해외진출 지원: 3억원</li>
                            <li>• 총 확보 자금: 20억원</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">자금 활용처</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• 신제품 개발</li>
                            <li>• 새로운 시장 진출</li>
                            <li>• 글로벌 확장</li>
                            <li>• 디지털 전환</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'institutions' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-blue-600" />
                    금융기관별 활용 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">중소기업진흥공단</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">활용 자금</span>
                          <span className="text-sm font-bold text-blue-700">35억원</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 공장설립자금: 8억원</li>
                          <li>• 구조개선자금: 10억원</li>
                          <li>• 사업전환자금: 12억원</li>
                          <li>• 해외진출지원: 3억원</li>
                          <li>• 스마트공장: 2억원</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">기술보증기금</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">활용 자금</span>
                          <span className="text-sm font-bold text-green-700">12억원</span>
                        </div>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 창업지원자금: 5천만원</li>
                          <li>• 운영자금: 2억원</li>
                          <li>• 특허담보대출: 1억원</li>
                          <li>• 설비자금: 5억원</li>
                          <li>• 기술개발자금: 3.5억원</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">신용보증기금</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">활용 자금</span>
                          <span className="text-sm font-bold text-purple-700">8억원</span>
                        </div>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• 청년창업자금: 3천만원</li>
                          <li>• 매출채권담보: 1.5억원</li>
                          <li>• 일반운영자금: 3억원</li>
                          <li>• 시설자금: 2.5억원</li>
                          <li>• 긴급자금: 1억원</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-orange-900 mb-4">지역보증재단</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">활용 자금</span>
                          <span className="text-sm font-bold text-orange-700">5억원</span>
                        </div>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• 지역특화자금: 2억원</li>
                          <li>• 소상공인자금: 1억원</li>
                          <li>• 지역상생자금: 1.5억원</li>
                          <li>• 지역혁신자금: 5천만원</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'guarantee' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    보증기관 활용 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">보증 활용 효과</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">95%</p>
                        <p className="text-sm text-gray-600">보증 승인률</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">2.5%</p>
                        <p className="text-sm text-gray-600">평균 금리</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">85%</p>
                        <p className="text-sm text-gray-600">보증 비율</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">60억원</p>
                        <p className="text-sm text-gray-600">총 보증 금액</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        stage: "창업 초기",
                        guarantee: "기보 + 신보",
                        amount: "8천만원",
                        rate: "3.5%",
                        details: ["창업지원자금", "청년창업자금", "초기운영자금"]
                      },
                      {
                        stage: "성장 단계",
                        guarantee: "기보 + 매출담보",
                        amount: "4.5억원",
                        rate: "2.8%",
                        details: ["운영자금", "특허담보", "매출채권담보"]
                      },
                      {
                        stage: "확장 단계",
                        guarantee: "중진공 + 기보",
                        amount: "15억원",
                        rate: "2.2%",
                        details: ["공장설립", "설비자금", "지역보증"]
                      },
                      {
                        stage: "구조개선",
                        guarantee: "중진공 직접",
                        amount: "15억원",
                        rate: "1.8%",
                        details: ["구조개선", "스마트공장", "친환경전환"]
                      },
                      {
                        stage: "사업전환",
                        guarantee: "중진공 + 해외",
                        amount: "20억원",
                        rate: "1.5%",
                        details: ["사업전환", "신사업개발", "해외진출"]
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-900">{item.stage}</h4>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-green-600">{item.guarantee}</span>
                            <span className="text-lg font-bold text-blue-600">{item.amount}</span>
                            <span className="text-sm text-orange-600">금리 {item.rate}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.details.map((detail, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-xs rounded text-gray-700">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'strategy' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-purple-600" />
                    단계별 정책자금 활용 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">창업 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• 기보/신보 보증 동시 활용</li>
                        <li>• 정부지원사업 우선 신청</li>
                        <li>• 특허 등 IP 담보 활용</li>
                        <li>• 단계별 자금 조달 계획</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">성장 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 매출 기반 담보 대출</li>
                        <li>• 운영자금 안정적 확보</li>
                        <li>• 기술개발 연계 자금</li>
                        <li>• 신용등급 관리 강화</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">확장 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• 대규모 시설투자 계획</li>
                        <li>• 중진공 직접 대출 활용</li>
                        <li>• 지역보증재단 연계</li>
                        <li>• 투자타당성 검토 필수</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-orange-900 mb-4">전환 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-orange-800">
                        <li>• 구조개선 사전 준비</li>
                        <li>• 사업전환 타당성 검토</li>
                        <li>• 정부정책 트렌드 반영</li>
                        <li>• 장기적 관점 접근</li>
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
                    정책자금 활용 성과 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">60억원</p>
                      <p className="text-sm opacity-90">총 확보 자금</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                      <Percent className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">2.1%</p>
                      <p className="text-sm opacity-90">평균 금리</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">850%</p>
                      <p className="text-sm opacity-90">매출 증가율</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">80명</p>
                      <p className="text-sm opacity-90">고용 창출</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 단계별 성과 추이</h3>
                    <div className="space-y-4">
                      {[
                        { stage: '창업 (2019)', funding: '1.3억', revenue: '0.5억', employees: '3명' },
                        { stage: '성장 (2020-21)', funding: '4.5억', revenue: '5억', employees: '15명' },
                        { stage: '확장 (2022)', funding: '15억', revenue: '25억', employees: '35명' },
                        { stage: '구조개선 (2023)', funding: '15억', revenue: '50억', employees: '60명' },
                        { stage: '사업전환 (2024-25)', funding: '20억', revenue: '120억', employees: '80명' }
                      ].map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-32">{data.stage}</span>
                          <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" 
                              style={{width: `${Math.min(100, (parseInt(data.revenue) / 120) * 100)}%`}}
                            ></div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">{data.revenue}</div>
                            <div className="text-xs text-gray-600">{data.funding} 확보</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">💰 자금 절약 효과</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">시중은행 대비</span>
                          <span className="font-semibold text-blue-900">연 3.2%p 절약</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">총 이자 절약</span>
                          <span className="font-semibold text-blue-900">12억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">보증료 포함</span>
                          <span className="font-semibold text-blue-900">8억원 절약</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">총 절약 효과</span>
                          <span className="font-semibold text-blue-900">20억원</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">🏆 핵심 성과</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">6년간 연속 자금 확보</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">매출 240배 증가</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">고용 27배 증가</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">업계 선도기업 도약</span>
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
                    <p className="text-sm text-gray-600">업종</p>
                    <p className="font-semibold">레이저솔드링 제조업</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">총 정책자금</p>
                    <p className="font-semibold text-orange-600">60억원</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">활용 기간</p>
                    <p className="font-semibold">2019-2025년 (6년)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">현재 단계</p>
                    <p className="font-semibold text-red-600">사업전환</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 활용 기관 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  활용 기관
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">중소기업진흥공단</span>
                    <span className="font-semibold text-blue-600">35억원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">기술보증기금</span>
                    <span className="font-semibold text-green-600">12억원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">신용보증기금</span>
                    <span className="font-semibold text-purple-600">8억원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">지역보증재단</span>
                    <span className="font-semibold text-orange-600">5억원</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상담 신청 */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Phone className="w-5 h-5" />
                  정책자금 상담
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-orange-600">
                    귀하의 기업도 ABC기업과 같은 정책자금 활용 성공을 경험해보세요!
                  </p>
                  <Button 
                    onClick={handleConsultation}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
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
                    onClick={() => window.location.href = '/services/tech-startup/case-study'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    기술사업화 사례
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
                    onClick={() => window.open('/images/bmzwn_CASE.PDF', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    BM ZEN 사업분석 사례
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 