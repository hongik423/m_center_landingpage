'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Shield, 
  CheckCircle, 
  Target, 
  TrendingUp, 
  Users, 
  Building, 
  FileText,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Star,
  Lightbulb,
  Clock,
  BarChart3,
  Zap,
  DollarSign,
  Phone,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/layout/header';

export default function CertificationCaseStudyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  const handleBack = () => {
    window.location.href = '/support/faq';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
      <Header />
      
      {/* Q&A로 돌아가기 버튼 */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/support/qa')}
          className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-blue-50 border-blue-300 hover:border-blue-600 text-blue-700 hover:text-blue-600 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <span className="relative flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
            Q&A로 돌아가기
          </span>
        </Button>
      </div>

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 
                            text-red-700 rounded-full font-semibold text-sm mb-6">
              <Award className="w-4 h-4" />
              <span>인증지원 활용사례</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                (주)ABC기업
              </span>
              <br />
              인증 전략적 활용 완전 사례
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              창업 → 벤처인증 → ISO 인증 → 연구소 → 이노비즈 → 투자유치까지<br />
              기업 성장단계별 인증 전략적 활용 성공 스토리
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'timeline', label: '시계열 인증획득', icon: Calendar },
            { id: 'certifications', label: '인증별 효과', icon: Award },
            { id: 'strategy', label: '전략적 활용', icon: Target },
            { id: 'benefits', label: '혜택 분석', icon: DollarSign },
            { id: 'results', label: '성과 분석', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`${activeTab === tab.id ? 'bg-gradient-to-r from-red-500 to-pink-600' : ''}`}
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
                    <Calendar className="w-6 h-6 text-red-600" />
                    시계열 인증 획득 과정 (2019-2025)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* 1단계: 창업 초기 인증 */}
                  <div className="relative pl-8 border-l-4 border-green-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-green-900 mb-4">
                        2019년: 창업 초기 인증 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">획득 인증</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 사업자등록 및 법인설립</li>
                            <li>• 특허 출원 (3건)</li>
                            <li>• 예비벤처기업 확인</li>
                            <li>• 기술개발 신고</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">활용 효과</h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• 창업지원자금 5천만원</li>
                            <li>• 정부 R&D 지원 자격</li>
                            <li>• 세제혜택 연 500만원</li>
                            <li>• 창업 생태계 진입</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2단계: 벤처기업 인증 */}
                  <div className="relative pl-8 border-l-4 border-blue-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-blue-900 mb-4">
                        2020년: 벤처기업 인증 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">획득 인증</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 벤처기업 확인 (기술평가형)</li>
                            <li>• 특허 등록 (2건)</li>
                            <li>• 기술혁신형 중소기업(INNO-BIZ)</li>
                            <li>• 연구개발전담부서 인정</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">활용 효과</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 정책자금 3억원 확보</li>
                            <li>• 세제혜택 연 2천만원</li>
                            <li>• 정부 R&D 가점</li>
                            <li>• 투자유치 신뢰도 향상</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3단계: ISO 인증 */}
                  <div className="relative pl-8 border-l-4 border-purple-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-purple-900 mb-4">
                        2021년: ISO 통합 인증 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">획득 인증</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• ISO 9001 (품질경영시스템)</li>
                            <li>• ISO 14001 (환경경영시스템)</li>
                            <li>• ISO 45001 (안전보건경영시스템)</li>
                            <li>• 수출기업 등록</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">활용 효과</h4>
                          <ul className="text-sm text-purple-700 space-y-1">
                            <li>• 대기업 협력업체 등록</li>
                            <li>• 해외 수출 채널 확보</li>
                            <li>• 품질 신뢰도 향상</li>
                            <li>• 입찰 가점 확보</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4단계: 연구소 설립 */}
                  <div className="relative pl-8 border-l-4 border-orange-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-orange-900 mb-4">
                        2022년: 연구소 설립 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">획득 인증</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• 기업부설연구소 설립</li>
                            <li>• 연구개발전담부서 인정</li>
                            <li>• 특허 추가 등록 (5건)</li>
                            <li>• 기술이전 계약</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-2">활용 효과</h4>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• R&D 세액공제 30%</li>
                            <li>• 정부 R&D 과제 5억원</li>
                            <li>• 연구인력 개발비 지원</li>
                            <li>• 기술료 수입 창출</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5단계: 투자유치 준비 */}
                  <div className="relative pl-8 border-l-4 border-red-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="text-xl font-bold text-red-900 mb-4">
                        2023-2024년: 투자유치 준비 단계
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">획득 인증</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• TIPS 프로그램 선정</li>
                            <li>• 이노비즈 재인증</li>
                            <li>• 메인비즈 인증</li>
                            <li>• 글로벌 강소기업 선정</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">활용 효과</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            <li>• VC 투자 15억원 유치</li>
                            <li>• 기업가치 500억원 달성</li>
                            <li>• 해외 진출 지원</li>
                            <li>• IPO 준비 자격</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'certifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-blue-600" />
                    인증별 효과 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">벤처기업 인증</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">세제혜택</span>
                          <span className="text-sm font-bold text-blue-700">연 2천만원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">정책자금</span>
                          <span className="text-sm font-bold text-blue-700">3억원</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 법인세 50% 감면 (2년)</li>
                          <li>• 취득세 50% 감면</li>
                          <li>• 정부 R&D 가점</li>
                          <li>• 투자유치 신뢰도 향상</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">ISO 통합 인증</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">매출 증대</span>
                          <span className="text-sm font-bold text-green-700">연 15억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">수출 계약</span>
                          <span className="text-sm font-bold text-green-700">5억원</span>
                        </div>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• 대기업 협력업체 등록</li>
                          <li>• 해외 바이어 신뢰 확보</li>
                          <li>• 품질 클레임 90% 감소</li>
                          <li>• 입찰 가점 확보</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">연구소 설립</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">R&D 세액공제</span>
                          <span className="text-sm font-bold text-purple-700">연 1.5억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">정부 R&D</span>
                          <span className="text-sm font-bold text-purple-700">5억원</span>
                        </div>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• 연구개발비 30% 세액공제</li>
                          <li>• 연구인력 개발비 지원</li>
                          <li>• 기술료 수입 창출</li>
                          <li>• 산학연 협력 확대</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-orange-900 mb-4">이노비즈 인증</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">정책자금</span>
                          <span className="text-sm font-bold text-orange-700">10억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">세제혜택</span>
                          <span className="text-sm font-bold text-orange-700">연 3천만원</span>
                        </div>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• 기술개발자금 우대</li>
                          <li>• 공공조달 가점</li>
                          <li>• 수출보험료 할인</li>
                          <li>• 기술보증 우대</li>
                        </ul>
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
                    <Target className="w-6 h-6 text-purple-600" />
                    전략적 인증 활용 방법
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">창업 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• 예비벤처 → 벤처기업 단계적 진행</li>
                        <li>• 특허 출원 우선 추진</li>
                        <li>• 정부지원사업 자격 확보</li>
                        <li>• 세제혜택 최대화</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">성장 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• ISO 인증 통합 취득</li>
                        <li>• 대기업 협력 기반 구축</li>
                        <li>• 수출 채널 확보</li>
                        <li>• 품질 신뢰도 향상</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-purple-900 mb-4">확장 단계 전략</h3>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• 연구소 설립으로 R&D 역량 강화</li>
                        <li>• 특허 포트폴리오 확대</li>
                        <li>• 정부 R&D 과제 연속 수행</li>
                        <li>• 기술료 수입 다각화</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-orange-900 mb-4">투자유치 전략</h3>
                      <ul className="space-y-2 text-sm text-orange-800">
                        <li>• TIPS 프로그램 활용</li>
                        <li>• 이노비즈 재인증으로 신뢰도 강화</li>
                        <li>• 글로벌 강소기업 선정</li>
                        <li>• 기업가치 평가 근거 마련</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 인증 연계 효과</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">벤처기업 + 이노비즈</span>
                        <span className="text-sm font-bold text-green-600">세제혜택 5천만원/년</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ISO 인증 + 연구소</span>
                        <span className="text-sm font-bold text-blue-600">매출 증대 20억원/년</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">특허 + 기술이전</span>
                        <span className="text-sm font-bold text-purple-600">기술료 수입 2억원/년</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">TIPS + VC 투자</span>
                        <span className="text-sm font-bold text-orange-600">투자유치 15억원</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'benefits' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    인증 혜택 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">총 혜택 규모</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">25억원</p>
                        <p className="text-sm text-gray-600">세제혜택 (5년)</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">18억원</p>
                        <p className="text-sm text-gray-600">정책자금</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">15억원</p>
                        <p className="text-sm text-gray-600">VC 투자</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">58억원</p>
                        <p className="text-sm text-gray-600">총 혜택</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        category: "세제혜택",
                        amount: "25억원",
                        color: "green",
                        details: ["법인세 감면 12억", "취득세 감면 3억", "R&D 세액공제 10억"]
                      },
                      {
                        category: "정책자금",
                        amount: "18억원",
                        color: "blue",
                        details: ["창업자금 3억", "기술개발자금 5억", "시설자금 10억"]
                      },
                      {
                        category: "매출 증대",
                        amount: "100억원",
                        color: "purple",
                        details: ["대기업 납품 60억", "수출 매출 25억", "신규 채널 15억"]
                      },
                      {
                        category: "투자유치",
                        amount: "15억원",
                        color: "orange",
                        details: ["TIPS 투자 15억", "기업가치 500억", "IPO 준비 완료"]
                      }
                    ].map((benefit, index) => (
                      <div key={index} className={`bg-${benefit.color}-50 p-6 rounded-lg border-l-4 border-${benefit.color}-500`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`text-lg font-bold text-${benefit.color}-900`}>
                            {benefit.category}
                          </h4>
                          <span className={`text-2xl font-bold text-${benefit.color}-700`}>
                            {benefit.amount}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {benefit.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className={`text-xs text-${benefit.color}-700 bg-white p-2 rounded`}>
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

            {activeTab === 'results' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    인증 활용 성과 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                      <Award className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">12개</p>
                      <p className="text-sm opacity-90">획득 인증</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">58억원</p>
                      <p className="text-sm opacity-90">총 혜택</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">240배</p>
                      <p className="text-sm opacity-90">매출 증가</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                      <Building className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">500억원</p>
                      <p className="text-sm opacity-90">기업가치</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 연도별 인증 효과</h3>
                    <div className="space-y-4">
                      {[
                        { year: '2019', certs: '2개', benefits: '0.5억', revenue: '0.5억' },
                        { year: '2020', certs: '4개', benefits: '3억', revenue: '2억' },
                        { year: '2021', certs: '7개', benefits: '8억', revenue: '8억' },
                        { year: '2022', certs: '9개', benefits: '15억', revenue: '25억' },
                        { year: '2023', certs: '11개', benefits: '25억', revenue: '65억' },
                        { year: '2024', certs: '12개', benefits: '58억', revenue: '120억' }
                      ].map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-16">{data.year}</span>
                          <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" 
                              style={{width: `${Math.min(100, (parseInt(data.revenue) / 120) * 100)}%`}}
                            ></div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">{data.revenue}</div>
                            <div className="text-xs text-gray-600">{data.certs} 인증</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">🏆 핵심 성과</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">6년간 12개 인증 획득</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">매출 240배 증가</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">기업가치 500억원 달성</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-blue-700">IPO 준비 완료</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">💰 ROI 분석</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">인증 비용</span>
                          <span className="font-semibold text-green-900">2억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">총 혜택</span>
                          <span className="font-semibold text-green-900">58억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">투자 수익률</span>
                          <span className="font-semibold text-green-900">2,900%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">연평균 ROI</span>
                          <span className="font-semibold text-green-900">580%</span>
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
                    <p className="text-sm text-gray-600">총 인증</p>
                    <p className="font-semibold text-red-600">12개</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">인증 기간</p>
                    <p className="font-semibold">2019-2024년 (6년)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">현재 상태</p>
                    <p className="font-semibold text-green-600">IPO 준비</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 주요 인증 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  주요 인증 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">벤처기업 확인</span>
                    <Badge className="bg-blue-100 text-blue-700">유효</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ISO 9001/14001/45001</span>
                    <Badge className="bg-green-100 text-green-700">유효</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">기업부설연구소</span>
                    <Badge className="bg-purple-100 text-purple-700">운영</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">이노비즈 인증</span>
                    <Badge className="bg-orange-100 text-orange-700">유효</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">특허 등록</span>
                    <Badge className="bg-red-100 text-red-700">8건</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상담 신청 */}
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Phone className="w-5 h-5" />
                  인증지원 상담
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-red-600">
                    귀하의 기업도 ABC기업과 같은 인증 전략적 활용 성공을 경험해보세요!
                  </p>
                  <Button 
                    onClick={handleConsultation}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
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
                    onClick={() => window.location.href = '/services/policy-funding/case-study'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    정책자금 활용사례
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left"
                    onClick={() => window.location.href = '/services/website/case-study'}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    웹사이트 구축 사례
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
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
            onClick={() => router.push('/consultation')}
          >
            <span className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <Award className="w-5 h-5 mr-2" />
              인증 컨설팅 상담 신청하기
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 hover:shadow-md relative overflow-hidden group"
            onClick={() => router.push('/services/certification')}
          >
            <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
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