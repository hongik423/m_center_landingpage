'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Search, 
  MessageCircle, 
  Database, 
  Globe, 
  Youtube, 
  Facebook, 
  Instagram, 
  Bot, 
  Phone, 
  Mail, 
  BarChart3, 
  Target, 
  Zap, 
  CheckCircle, 
  ExternalLink,
  Star,
  Award,
  Lightbulb,
  Rocket,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/layout/header';

export default function WebsiteCaseStudyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  const handleBack = () => {
    window.location.href = '/support/faq';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* M-CENTER 고객지원 Q&A 버튼 */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/support/qa')}
          className="transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-4 py-2 rounded-md hover:bg-pink-50 border-pink-300 hover:border-pink-600 text-pink-700 hover:text-pink-600 relative overflow-hidden group"
        >
          <span className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          <span className="relative flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
            M-CENTER 고객지원 Q&A
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 
                            text-green-700 rounded-full font-semibold text-sm mb-6">
              <Globe className="w-4 h-4" />
              <span>웹사이트 구축 성공사례</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                (가칭)ESG환경사례기업
              </span>
              <br />
              매출증대 웹앱 구축 사례
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
              특허 장비 기반 선별토목사업 전문기업의<br />
              AI 챗봇 · CRM 연동 · 온라인 매출증대 통합 웹앱 구축 성공사례
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'overview', label: '프로젝트 개요', icon: Target },
            { id: 'strategy', label: '디지털 전략', icon: Lightbulb },
            { id: 'features', label: '핵심 기능', icon: Zap },
            { id: 'results', label: '성과 분석', icon: BarChart3 },
            { id: 'process', label: '구축 과정', icon: Rocket }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={`${activeTab === tab.id ? 'bg-gradient-to-r from-green-500 to-blue-600' : ''}`}
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
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-600" />
                    프로젝트 개요
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-green-900 mb-4">🏢 기업 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">기업명</p>
                        <p className="font-semibold">(가칭)ESG환경사례기업</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">업종</p>
                        <p className="font-semibold">선별토목사업 / 환경 솔루션</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">규모</p>
                        <p className="font-semibold">직원 25명, 연매출 50억원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">특허 보유</p>
                        <p className="font-semibold">선별장비 특허 3건</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 사업 분야</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-semibold">쓰레기 매립장 신설 지자체 대상 선별토목사업</p>
                          <p className="text-sm text-gray-600">최고기술수준의 특허 장비를 활용한 폐기물 선별 및 토목공사</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-semibold">환경친화적 폐기물 처리 솔루션</p>
                          <p className="text-sm text-gray-600">ESG 경영 트렌드에 맞춘 지속가능한 환경 솔루션 제공</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className="font-semibold">지자체 맞춤형 컨설팅 서비스</p>
                          <p className="text-sm text-gray-600">지역별 특성을 고려한 최적의 폐기물 처리 방안 제시</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">💡 프로젝트 목표</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-800">온라인 매출 증대</p>
                        <p className="text-sm text-blue-700">기존 오프라인 중심에서 온라인 채널 확장</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-800">브랜드 인지도 향상</p>
                        <p className="text-sm text-blue-700">특허 기술력과 전문성 대외 홍보</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-800">고객 관리 자동화</p>
                        <p className="text-sm text-blue-700">AI 챗봇과 CRM 연동으로 효율성 극대화</p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-800">신규 고객 확보</p>
                        <p className="text-sm text-blue-700">전국 지자체 대상 마케팅 채널 구축</p>
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
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                    디지털 마케팅 전략
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-red-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Youtube className="w-8 h-8 text-red-600" />
                        <h3 className="text-lg font-bold text-red-900">YouTube 마케팅</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-red-800">
                        <li>• 특허 장비 작동 시연 영상</li>
                        <li>• 실제 선별토목 현장 작업 과정</li>
                        <li>• 환경보호 효과 데이터 시각화</li>
                        <li>• 지자체 담당자 인터뷰</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Facebook className="w-8 h-8 text-blue-600" />
                        <h3 className="text-lg font-bold text-blue-900">Facebook 전략</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 지자체 공무원 타겟 광고</li>
                        <li>• ESG 경영 관심 기업 대상</li>
                        <li>• 환경 관련 커뮤니티 참여</li>
                        <li>• 성공사례 스토리텔링</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Instagram className="w-8 h-8 text-purple-600" />
                        <h3 className="text-lg font-bold text-purple-900">Instagram 컨텐츠</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-purple-800">
                        <li>• 환경보호 인포그래픽</li>
                        <li>• 비포&애프터 현장 사진</li>
                        <li>• 특허 기술 간단 설명</li>
                        <li>• 직원들의 일상 스토리</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Search className="w-8 h-8 text-green-600" />
                        <h3 className="text-lg font-bold text-green-900">검색 최적화</h3>
                      </div>
                      <ul className="space-y-2 text-sm text-green-800">
                        <li>• 구글/네이버 SEO 최적화</li>
                        <li>• 지역별 키워드 전략</li>
                        <li>• AI 검색 노출 대응</li>
                        <li>• 전문 용어 롱테일 키워드</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 핵심 키워드 전략</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        '쓰레기 매립장 신설',
                        '선별토목사업',
                        '폐기물 처리 장비',
                        'ESG 환경 솔루션',
                        '지자체 환경사업',
                        '특허 선별기술',
                        '친환경 토목공사',
                        '폐기물 재활용'
                      ].map((keyword, index) => (
                        <Badge key={index} variant="outline" className="justify-center py-2">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'features' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                    핵심 기능 구현
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="w-8 h-8 text-purple-600" />
                      <h3 className="text-xl font-bold text-purple-900">AI 챗봇 24시간 자동 상담</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">🤖 학습 데이터</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• 특허 장비 기술 사양 및 성능 데이터</li>
                          <li>• 과거 프로젝트 수행 경험 및 노하우</li>
                          <li>• 지자체별 폐기물 처리 규정 및 요구사항</li>
                          <li>• 환경 관련 법규 및 인허가 절차</li>
                          <li>• 비용 산정 기준 및 견적 가이드라인</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">💬 상담 시나리오</h4>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• "매립장 규모에 따른 적정 장비 추천"</li>
                          <li>• "프로젝트 기간 및 비용 견적 제공"</li>
                          <li>• "환경 영향 평가 및 개선 효과 설명"</li>
                          <li>• "특허 기술의 차별화 포인트 안내"</li>
                          <li>• "유사 지자체 성공사례 소개"</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-8 h-8 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-900">CRM 강화 시스템</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">📊 고객 데이터 수집</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 지자체 정보 (규모, 예산, 담당자)</li>
                          <li>• 상담 내역 및 관심 분야</li>
                          <li>• 프로젝트 진행 단계</li>
                          <li>• 의사결정 타임라인</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">🎯 맞춤형 마케팅</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 관심도별 자동 등급 분류</li>
                          <li>• 개인화된 이메일 마케팅</li>
                          <li>• 프로젝트 단계별 콘텐츠 제공</li>
                          <li>• 적정 타이밍 영업 알림</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-bold text-green-900">웹앱 통합 기능</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg text-center">
                        <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-800 mb-1">실시간 상담</h4>
                        <p className="text-xs text-green-700">챗봇 → 전문가 연결</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-800 mb-1">성과 대시보드</h4>
                        <p className="text-xs text-green-700">실시간 마케팅 분석</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg text-center">
                        <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-green-800 mb-1">고객 관리</h4>
                        <p className="text-xs text-green-700">통합 CRM 시스템</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'results' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    성과 분석
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">420%</p>
                      <p className="text-sm opacity-90">온라인 문의 증가</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg text-center">
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">85</p>
                      <p className="text-sm opacity-90">신규 지자체 접촉</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">92%</p>
                      <p className="text-sm opacity-90">챗봇 상담 만족도</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg text-center">
                      <Award className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">65%</p>
                      <p className="text-sm opacity-90">매출 증가율</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📈 월별 성과 추이</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">1개월차</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">웹사이트 런칭, 기본 SEO 적용</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">3개월차</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">AI 챗봇 도입, SNS 마케팅 시작</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">6개월차</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">CRM 고도화, 마케팅 자동화</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">12개월차</span>
                        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">목표 달성, 지속적 최적화</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-blue-900 mb-4">🎯 마케팅 성과</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">검색 노출 순위</span>
                          <span className="font-semibold text-blue-900">상위 3위 달성</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">월 방문자 수</span>
                          <span className="font-semibold text-blue-900">15,000명</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">SNS 팔로워</span>
                          <span className="font-semibold text-blue-900">8,500명</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">브랜드 인지도</span>
                          <span className="font-semibold text-blue-900">350% 향상</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-green-900 mb-4">💰 비즈니스 성과</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">신규 계약 건수</span>
                          <span className="font-semibold text-green-900">12건</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">평균 계약 금액</span>
                          <span className="font-semibold text-green-900">8.5억원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">온라인 매출 비중</span>
                          <span className="font-semibold text-green-900">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-green-700">고객 만족도</span>
                          <span className="font-semibold text-green-900">4.8/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'process' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-orange-600" />
                    구축 과정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {[
                      {
                        phase: "1단계",
                        title: "요구사항 분석 및 전략 수립",
                        duration: "2주",
                        color: "blue",
                        tasks: [
                          "기업 현황 및 목표 분석",
                          "경쟁사 벤치마킹",
                          "타겟 고객 페르소나 정의",
                          "디지털 마케팅 전략 수립"
                        ]
                      },
                      {
                        phase: "2단계",
                        title: "웹사이트 설계 및 개발",
                        duration: "6주",
                        color: "green",
                        tasks: [
                          "UI/UX 디자인 및 와이어프레임",
                          "반응형 웹사이트 개발",
                          "CMS 구축 및 관리자 페이지",
                          "기본 SEO 최적화 적용"
                        ]
                      },
                      {
                        phase: "3단계",
                        title: "AI 챗봇 및 CRM 구축",
                        duration: "4주",
                        color: "purple",
                        tasks: [
                          "기업 전용 AI 모델 학습",
                          "챗봇 시나리오 설계 및 구현",
                          "CRM 시스템 구축 및 연동",
                          "고객 데이터 분석 대시보드"
                        ]
                      },
                      {
                        phase: "4단계",
                        title: "디지털 마케팅 런칭",
                        duration: "3주",
                        color: "orange",
                        tasks: [
                          "SNS 채널 구축 및 콘텐츠 제작",
                          "검색엔진 최적화 고도화",
                          "온라인 광고 캠페인 시작",
                          "성과 측정 도구 설정"
                        ]
                      },
                      {
                        phase: "5단계",
                        title: "운영 및 최적화",
                        duration: "지속",
                        color: "red",
                        tasks: [
                          "성과 모니터링 및 분석",
                          "AI 챗봇 지속 학습",
                          "마케팅 캠페인 최적화",
                          "기능 업데이트 및 개선"
                        ]
                      }
                    ].map((step, index) => (
                      <div key={index} className={`bg-${step.color}-50 p-6 rounded-lg border-l-4 border-${step.color}-500`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className={`text-xl font-bold text-${step.color}-900`}>
                            {step.phase}: {step.title}
                          </h3>
                          <Badge variant="outline" className={`bg-${step.color}-100 text-${step.color}-800`}>
                            {step.duration}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {step.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 text-${step.color}-600`} />
                              <span className={`text-sm text-${step.color}-800`}>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 프로젝트 성공 요인</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">전문성</h4>
                        <p className="text-sm text-gray-600">25년 경험의 전문가 팀</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">기술력</h4>
                        <p className="text-sm text-gray-600">최신 AI 및 웹 기술 적용</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-semibold text-gray-900 mb-1">소통</h4>
                        <p className="text-sm text-gray-600">고객과의 긴밀한 협업</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로젝트 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  프로젝트 요약
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">프로젝트 기간</p>
                    <p className="font-semibold">15주 (3.5개월)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">투자 금액</p>
                    <p className="font-semibold">8,500만원</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="font-semibold text-green-600">320%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">매출 증가</p>
                    <p className="font-semibold text-blue-600">65%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 핵심 기술 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  적용 기술
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    'Next.js 14',
                    'React 18',
                    'TypeScript',
                    'Tailwind CSS',
                    'OpenAI GPT-4',
                    'Supabase',
                    'Vercel',
                    'Google Analytics',
                    'Facebook Pixel',
                    'Naver Analytics'
                  ].map((tech, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 상담 신청 */}
            <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Phone className="w-5 h-5" />
                  무료 상담 신청
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-blue-600">
                    귀하의 기업도 ESG환경사례기업과 같은 성공을 경험해보세요!
                  </p>
                  <Button 
                    onClick={handleConsultation}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
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
                    onClick={() => window.open('/images/AI_INNOVATION.pdf', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    AI 생산성향상 사례
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
            className="px-8 py-3 bg-pink-600 hover:bg-pink-700 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
            onClick={() => router.push('/consultation')}
          >
            <span className="absolute inset-0 bg-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
            <span className="relative flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              웹사이트 개발 상담 신청하기
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-pink-600 text-gray-700 hover:text-pink-600 hover:shadow-md relative overflow-hidden group"
            onClick={() => router.push('/services/website')}
          >
            <span className="absolute inset-0 bg-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
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