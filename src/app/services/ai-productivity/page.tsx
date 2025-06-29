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
  Lightbulb,
  Rocket,
  Settings
} from 'lucide-react';

export default function AIProductivityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '고용노동부 노사발전재단 주관',
      description: '정부 공식 일터혁신 상생컨설팅 지원사업',
      icon: Award
    },
    {
      title: '기업 규모별 맞춤 지원',
      description: '20~99인 기업 100% 무료, 규모별 차등 지원',
      icon: Users
    },
    {
      title: '전문 맞춤형 컨설팅',
      description: '진단형(2~4주), 전문형(5~10주), 심화형(10~20주)',
      icon: Clock
    },
    {
      title: 'AI 기술 융합 혁신',
      description: '전통 인사제도와 최신 AI 기술의 완벽한 결합',
      icon: Settings
    },
    {
      title: '실제 기업 적용 성과',
      description: '제안서 작성 50% 단축, 업무 효율성 40% 향상',
      icon: TrendingUp
    },
    {
      title: '전문 컨설턴트 지원',
      description: '경영지도센터 전문 컨설턴트의 현장 방문 지원',
      icon: Target
    }
  ];

  const curriculum = [
    {
      week: '1단계',
      title: '근로시간 관리방안 마련 (AI 활용)',
      description: 'AI 기반 근무시간 관리 시스템 구축 및 자동화 도입',
      topics: ['근무시간 관리기준 마련', '초과근로 관리방안', '근로시간관리시스템 구축', '연차휴가 사용 촉진방안', 'AI 활용 자동화']
    },
    {
      week: '2단계',
      title: '업무관리체계 개선 (디지털 혁신)',
      description: '업무 프로세스 표준화 및 디지털 워크플로우 시스템 구축',
      topics: ['업무 프로세스 표준화', '디지털 워크플로우 시스템', '업무 자동화 도구(RPA, AI)', '성과 모니터링 대시보드', '문서관리 시스템 고도화']
    },
    {
      week: '3단계',
      title: '인사평가제도 AI 기반 혁신',
      description: 'AI 기반 성과분석 도구 도입 및 객관적 평가 체계 구축',
      topics: ['다면평가시스템 도입', 'MBO(목표관리) 시스템', '역량평가 모델 설계', 'AI 기반 성과분석', '평가결과 피드백 연계']
    },
    {
      week: '4단계',
      title: '교육훈련 체계 디지털화',
      description: '디지털 교육 플랫폼 구축 및 AI 맞춤형 학습 시스템 도입',
      topics: ['디지털 교육 플랫폼 구축', 'AI 맞춤형 학습 시스템', '역량 진단 및 개발계획', '교육 성과 측정', '온라인 교육 시스템']
    },
    {
      week: '5단계',
      title: '소통활성화 및 조직문화 개선',
      description: 'AI 챗봇 기반 소통 시스템 및 디지털 협업 플랫폼 구축',
      topics: ['디지털 소통 플랫폼 구축', 'AI 챗봇 소통 시스템', '익명 건의함 및 피드백', '부서간 협업 개선', '조직문화 진단 및 개선']
    }
  ];

  const benefits = [
    {
      category: '개인 역량',
      items: ['AI 도구 활용 능력 향상', '업무 효율성 40% 증가', '창의적 문제 해결 능력', '디지털 리터러시 향상']
    },
    {
      category: '기업 성과',
      items: ['운영 비용 30% 절감', '고객 만족도 25% 향상', '업무 자동화 구현', '경쟁력 확보']
    },
    {
      category: '미래 준비',
      items: ['AI 트렌드 대응', '새로운 비즈니스 모델', '혁신 문화 조성', '지속 성장 기반']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              {/* 🔥 개선된 뒤로가기 버튼 */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] px-2 py-1 rounded-md hover:bg-purple-50 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-1 group-hover:translate-x-[-2px] transition-transform duration-200" />
                  서비스 목록
                </span>
              </Button>
              <span>/</span>
              <span className="text-purple-600 font-medium">AI 활용 생산성향상</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-6">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">고용노동부 노사발전재단 주관</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    2025년 일터혁신 상생컨설팅
                  </span>
                  <br />
                  <span className="text-xl md:text-2xl lg:text-3xl text-gray-700">
                    AI 활용 생산성향상
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>정부 100% 지원</strong>으로 AI 기술 융합 일터혁신을 실현하고 
                  업무 효율성을 <strong>40% 향상</strong>시키는 전문 맞춤형 컨설팅 프로그램
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2 bg-green-50 text-green-700 border-green-200">
                    <Award className="w-4 h-4 mr-2" />
                    20~99인 기업 100% 무료
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    업무 효율성 40% 향상
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-purple-50 text-purple-700 border-purple-200">
                    <Clock className="w-4 h-4 mr-2" />
                    10~20주 단계별 프로그램
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 bg-orange-50 text-orange-700 border-orange-200">
                    <Shield className="w-4 h-4 mr-2" />
                    노사발전재단 공식 인증
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 🔥 개선된 지금 신청하기 버튼 */}
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
                    onClick={() => router.push('/consultation')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative flex items-center">
                      지금 신청하기
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Button>
                  
                  {/* 🔥 개선된 적합성 진단받기 버튼 */}
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] border-gray-300 hover:border-purple-600 text-gray-700 hover:text-purple-600 hover:shadow-md relative overflow-hidden group"
                    onClick={() => router.push('/diagnosis')}
                  >
                    <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    <span className="relative">
                      적합성 진단받기
                    </span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">프로그램 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">주관 기관</span>
                      <span className="font-semibold text-blue-600">고용노동부</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">시행 기관</span>
                      <span className="font-semibold">노사발전재단</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">10주~20주</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">지원 대상</span>
                      <span className="font-semibold text-purple-600">20인 이상 사업장</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">20~99인 기업</span>
                      <span className="font-semibold text-green-600">100% 정부지원</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">참가 비용</span>
                      <span className="font-semibold text-red-600">무료*</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      * 기업 규모별 자부담율 상이 (20~99인 기업 완전무료)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: '프로그램 개요' },
              { id: 'features', label: '주요 특징' },
              { id: 'curriculum', label: '커리큘럼' },
              { id: 'benefits', label: '기대 효과' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {activeTab !== tab.id && (
                  <span className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                )}
                <span className="relative">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                AI 기술 융합 일터혁신 컨설팅
              </h2>
              
              {/* 기업 규모별 지원 혜택 */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  기업 규모별 지원 혜택
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 border-2 border-green-200 bg-green-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-green-700">20~99인 기업</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">0%</div>
                        <div className="text-sm text-green-700">자부담</div>
                        <div className="text-xs text-green-600 mt-2 font-semibold">100% 정부 지원</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-blue-700">100인 이상</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">10%</div>
                        <div className="text-sm text-blue-700">자부담</div>
                        <div className="text-xs text-blue-600 mt-2">연속참여기업</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-purple-700">300인 이상</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">20%</div>
                        <div className="text-sm text-purple-700">자부담</div>
                        <div className="text-xs text-purple-600 mt-2">80% 정부 지원</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-4 border-2 border-gray-200 bg-gray-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-gray-700">1000인 이상</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-600 mb-2">30%</div>
                        <div className="text-sm text-gray-700">자부담</div>
                        <div className="text-xs text-gray-600 mt-2">공공기관 포함</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 9개 분야 19개 요구사항 상세 설명 */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  9개 분야 19개 요구사항으로 구성된 체계적 일터혁신
                </h3>
                
                {/* 주요 AI 융합 영역 (1-3분야) */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-blue-600">1. 근로시간 분야 (AI 활용)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 text-xs">•</span>
                          <strong>근로시간 관리방안 마련</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 text-xs">•</span>
                          <strong>근무체계 개편</strong> (일가정양립 포함) [심화형]
                        </li>
                        <li className="bg-blue-100 p-3 rounded-lg mt-3">
                          <strong className="text-blue-800 text-xs">AI 혁신 기능:</strong>
                          <div className="text-xs text-blue-700 mt-1 space-y-1">
                            <div>• 스마트 근태 관리 자동화</div>
                            <div>• 업무량 예측 알고리즘</div>
                            <div>• 연차 최적화 AI 추천</div>
                            <div>• 유연근무제 스케줄링</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-purple-600">2. 임금체계 분야 (AI 분석)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2 text-xs">•</span>
                          <strong>임금관리체계 개선</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2 text-xs">•</span>
                          <strong>임금체계 재설계</strong> [심화형]
                        </li>
                        <li className="bg-purple-100 p-3 rounded-lg mt-3">
                          <strong className="text-purple-800 text-xs">AI 분석 기능:</strong>
                          <div className="text-xs text-purple-700 mt-1 space-y-1">
                            <div>• 임금 격차 AI 분석</div>
                            <div>• 성과 연동 평가 시스템</div>
                            <div>• 동종업계 임금 비교</div>
                            <div>• 직무 기반 임금 설계</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-green-600">3. 근로자참여·협력 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 text-xs">•</span>
                          <strong>인사제도 개선</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-2 text-xs">•</span>
                          <strong>인사평가제도</strong> [심화형]
                        </li>
                        <li className="bg-green-100 p-3 rounded-lg mt-3">
                          <strong className="text-green-800 text-xs">AI 혁신 영역:</strong>
                          <div className="text-xs text-green-700 mt-1 space-y-1">
                            <div>• 다면평가 시스템</div>
                            <div>• AI 기반 성과분석</div>
                            <div>• MBO 목표관리 시스템</div>
                            <div>• 역량평가 모델 설계</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 조직관리 및 평가 분야 (4-6분야) */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-orange-600">4. 직장문화 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-orange-500 mr-2 text-xs">•</span>
                          <strong>교육훈련 체계</strong> [심화형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-orange-500 mr-2 text-xs">•</span>
                          <strong>복리후생제도</strong> [전문형]
                        </li>
                        <li className="bg-orange-100 p-3 rounded-lg mt-3">
                          <strong className="text-orange-800 text-xs">디지털 교육:</strong>
                          <div className="text-xs text-orange-700 mt-1 space-y-1">
                            <div>• AI 맞춤형 학습 시스템</div>
                            <div>• 역량 진단 및 개발</div>
                            <div>• 선택적 복리후생</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-red-600">5. 직무역량 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2 text-xs">•</span>
                          <strong>산업안전보건</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2 text-xs">•</span>
                          <strong>안전보건관리체계</strong> [심화형]
                        </li>
                        <li className="bg-red-100 p-3 rounded-lg mt-3">
                          <strong className="text-red-800 text-xs">스마트 안전:</strong>
                          <div className="text-xs text-red-700 mt-1 space-y-1">
                            <div>• IoT·AI 안전관리</div>
                            <div>• 예방중심 안전문화</div>
                            <div>• 위험성 평가 시스템</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-indigo-600">6. 조직관리·평가 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2 text-xs">•</span>
                          <strong>조직문화 개선</strong> [심화형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2 text-xs">•</span>
                          <strong>소통활성화</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2 text-xs">•</span>
                          <strong>직무분석</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-500 mr-2 text-xs">•</span>
                          <strong>업무관리체계</strong> [심화형]
                        </li>
                        <li className="bg-indigo-100 p-3 rounded-lg mt-3">
                          <strong className="text-indigo-800 text-xs">디지털 혁신:</strong>
                          <div className="text-xs text-indigo-700 mt-1 space-y-1">
                            <div>• AI 챗봇 소통 시스템</div>
                            <div>• 워크플로우 자동화</div>
                            <div>• RPA 업무 자동화</div>
                            <div>• 성과 모니터링 대시보드</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* 나머지 3개 분야 (7-9분야) */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-teal-600">7. 차별개선·원하청상생</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2 text-xs">•</span>
                          <strong>차별 없는 일터 조성</strong> [진단형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2 text-xs">•</span>
                          <strong>사내하도급 근로자 보호</strong> [전문형]
                        </li>
                        <li className="bg-teal-100 p-3 rounded-lg mt-3">
                          <strong className="text-teal-800 text-xs">공정성 확보:</strong>
                          <div className="text-xs text-teal-700 mt-1 space-y-1">
                            <div>• 차별 실태 진단</div>
                            <div>• 임금격차 해소</div>
                            <div>• 상생협력 프로그램</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-cyan-600">8. 공정채용 분야</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-cyan-500 mr-2 text-xs">•</span>
                          <strong>채용제도 진단 및 개선</strong> [전문형]
                        </li>
                        <li className="flex items-start">
                          <span className="text-cyan-500 mr-2 text-xs">•</span>
                          <strong>채용제도 마련 및 운영</strong> [심화형]
                        </li>
                        <li className="bg-cyan-100 p-3 rounded-lg mt-3">
                          <strong className="text-cyan-800 text-xs">AI 채용 시스템:</strong>
                          <div className="text-xs text-cyan-700 mt-1 space-y-1">
                            <div>• AI 기반 서류심사</div>
                            <div>• 블라인드 채용</div>
                            <div>• 직무적합성 평가</div>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200">
                    <CardHeader className="p-0 pb-4">
                      <CardTitle className="text-lg text-pink-600">9. 장년친화 분야 ★</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-pink-500 mr-2 text-xs">•</span>
                          <strong>장년친화 인사제도</strong> [심화형/특화]
                        </li>
                        <li className="bg-pink-100 p-3 rounded-lg mt-3">
                          <strong className="text-pink-800 text-xs">2025년 특화 과제:</strong>
                          <div className="text-xs text-pink-700 mt-1 space-y-1">
                            <div>• 고령화 대응 계속 고용</div>
                            <div>• 장년 적합 직무 개발</div>
                            <div>• 임금피크제 설계</div>
                            <div>• 세대 통합 문화</div>
                          </div>
                        </li>
                        <div className="mt-3 bg-gradient-to-r from-pink-200 to-rose-200 rounded-lg p-2 text-center">
                          <span className="text-xs font-bold text-pink-800">특화 컨설팅 우선 선정</span>
                        </div>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 적용 성과 사례 */}
              <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-orange-600 text-center">
                    (주)AAA에너지관리IT기업 적용 성과
                  </CardTitle>
                  <p className="text-center text-gray-600">
                    에너지 DX 분야 AI 기술 개발 기업 | 특허 28건, 인증 25건 보유
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">50%</div>
                      <div className="text-sm text-gray-700">제안서 작성<br />시간 단축</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">40%</div>
                      <div className="text-sm text-gray-700">업무 프로세스<br />효율성 향상</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">90%</div>
                      <div className="text-sm text-gray-700">AI 도구<br />활용률 달성</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                      <div className="text-sm text-gray-700">해외 사업<br />확장 지원</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                프로그램 핵심 특징
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center p-6 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 컨설팅 유형별 상세 설명 */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  컨설팅 유형 및 내용
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="p-5 border-2 border-green-200 bg-green-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-green-700 text-center">🔍 진단 컨설팅</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-green-800 text-sm mb-1">연계형 (2주)</h4>
                          <p className="text-xs text-green-700">수행계획서 작성 후 전문컨설팅 연계</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-green-800 text-sm mb-1">자문형 (4주)</h4>
                          <p className="text-xs text-green-700">법·제도 안내 및 정부지원사업 연계</p>
                        </div>
                        <div className="text-center mt-3">
                          <Badge variant="outline" className="bg-green-100 text-green-800">10월 16일 마감</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-5 border-2 border-blue-200 bg-blue-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-blue-700 text-center">🔧 전문 컨설팅</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-blue-800 text-sm mb-1">전문형 (5주/10주)</h4>
                          <p className="text-xs text-blue-700">체계 마련·구축 등 제도 설계</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-blue-800 text-sm mb-1">심화형 (10주/15주)</h4>
                          <p className="text-xs text-blue-700">기존 제도 재편 및 고도화</p>
                        </div>
                        <div className="text-center mt-3">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">8월 28일 마감</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-5 border-2 border-purple-200 bg-purple-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-purple-700 text-center">🎯 특화 컨설팅</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-purple-800 text-sm mb-1">일가정양립 (10~20주)</h4>
                          <p className="text-xs text-purple-700">저출생 대응 여건 조성</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-purple-800 text-sm mb-1">장년친화 (10~20주)</h4>
                          <p className="text-xs text-purple-700">고령화 대응 계속 고용</p>
                        </div>
                        <div className="text-center mt-3">
                          <Badge variant="outline" className="bg-red-100 text-red-800">7월 3일 마감</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-5 border-2 border-orange-200 bg-orange-50">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-lg text-orange-700 text-center">⚡ AI 융합형</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-orange-800 text-sm mb-1">경영지도센터 특화</h4>
                          <p className="text-xs text-orange-700">전통 제도 + AI 기술 융합</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-bold text-orange-800 text-sm mb-1">차별화 접근</h4>
                          <p className="text-xs text-orange-700">실제 기업 적용 성과 검증</p>
                        </div>
                        <div className="text-center mt-3">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800">지금 신청</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 2025년 특화 프로그램 */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  🏆 2025년 특화 프로그램
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-blue-600 text-center">
                        🏠 일가정양립 여건 조성 특화
                      </CardTitle>
                      <p className="text-sm text-blue-700 text-center">저출생 대응 정책 연계</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-blue-800 text-sm mb-2">✨ 핵심 내용</h4>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• 유연근무제 전면 도입 (재택, 시차출퇴근)</li>
                            <li>• AI 기반 일정 관리 및 업무 조정</li>
                            <li>• 직장 내 육아 지원 프로그램</li>
                            <li>• 성과 중심 평가 체계 구축</li>
                          </ul>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg text-center">
                          <span className="text-xs font-bold text-blue-800">10주~20주 집중 지원</span>
                          <div className="text-xs text-blue-700 mt-1">요구사항 2번 해당</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-pink-600 text-center">
                        👥 장년친화 고용 지원 특화
                      </CardTitle>
                      <p className="text-sm text-pink-700 text-center">고령화 대응 정책 연계</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg">
                          <h4 className="font-semibold text-pink-800 text-sm mb-2">✨ 핵심 내용</h4>
                          <ul className="text-xs text-pink-700 space-y-1">
                            <li>• AI 분석 기반 적정 업무 배치</li>
                            <li>• 생애주기별 맞춤형 보상 체계</li>
                            <li>• 숙련 기술자 노하우 디지털화</li>
                            <li>• 세대 통합 협업 강화 프로그램</li>
                          </ul>
                        </div>
                        <div className="bg-pink-100 p-3 rounded-lg text-center">
                          <span className="text-xs font-bold text-pink-800">10주~20주 집중 지원</span>
                          <div className="text-xs text-pink-700 mt-1">요구사항 19번 해당</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 신청 일정 및 담당자 */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-purple-600">📅 2025년 신청 일정</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">진단컨설팅(자문형)</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">10월 16일 (목)</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">전문컨설팅(전문형)</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">8월 28일 (목)</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">심화형 (1개 요구사항)</span>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">8월 14일 (목)</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">심화형 (2개 요구사항)</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">7월 3일 (목) ⚠️</Badge>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">특화형 (3개 요구사항)</span>
                        <Badge variant="outline" className="bg-red-50 text-red-700">5월 22일 (목) ⚠️</Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-4">
                        ⚠️ 예산 소진 시 조기 마감 가능 | 마감 임박 일정 우선 신청 권장
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-blue-600">👨‍💼 담당 컨설턴트</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">이후경</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">이후경 책임컨설턴트</h3>
                        <p className="text-sm text-gray-600 mb-3">경영지도센터</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">이메일</span>
                          <span className="font-medium text-blue-600">hongik423@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">연락처</span>
                          <span className="font-medium text-purple-600">010-9251-9743</span>
                        </div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg text-center">
                        <span className="text-xs font-bold text-yellow-800">🚨 중요 안내</span>
                        <div className="text-xs text-yellow-700 mt-1">
                          신청 시 반드시 "아이엔제이컨설팅" 선택 필수
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                5단계 AI 융합 혁신 프로세스
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                전통적인 일터혁신과 최신 AI 기술을 결합한 <strong>체계적 5단계 프로세스</strong>로 
                기업의 디지털 전환과 생산성 혁신을 동시에 실현합니다.
              </p>
              <div className="grid lg:grid-cols-1 gap-6">
                {curriculum.map((item, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-white to-gray-50">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-8">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                            {item.week}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                              {index < 2 ? '전문형/심화형' : index < 4 ? '심화형' : '전문형/심화형'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-6 leading-relaxed text-lg">{item.description}</p>
                          
                          {/* 세부 과제들을 시각적으로 개선 */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {item.topics.map((topic, idx) => (
                              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-700">{topic}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* AI 혁신 포인트 추가 */}
                          {index === 0 && (
                            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-bold text-blue-800 text-sm mb-2">🤖 AI 혁신 포인트</h4>
                              <div className="text-xs text-blue-700 space-y-1">
                                <div>• 스마트 근태 관리 자동화 시스템 구축</div>
                                <div>• 업무량 예측 AI 알고리즘 도입</div>
                                <div>• 연차 사용 최적화 추천 엔진</div>
                              </div>
                            </div>
                          )}
                          
                          {index === 1 && (
                            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-bold text-green-800 text-sm mb-2">⚡ 디지털 혁신 포인트</h4>
                              <div className="text-xs text-green-700 space-y-1">
                                <div>• RPA 기반 업무 자동화 도구 도입</div>
                                <div>• 실시간 성과 모니터링 대시보드</div>
                                <div>• 클라우드 기반 협업 플랫폼 구축</div>
                              </div>
                            </div>
                          )}
                          
                          {index === 2 && (
                            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <h4 className="font-bold text-purple-800 text-sm mb-2">📊 AI 분석 포인트</h4>
                              <div className="text-xs text-purple-700 space-y-1">
                                <div>• 빅데이터 기반 성과 분석 시스템</div>
                                <div>• 360도 평가 자동화 플랫폼</div>
                                <div>• 예측 분석을 통한 인재 관리</div>
                              </div>
                            </div>
                          )}
                          
                          {index === 3 && (
                            <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <h4 className="font-bold text-orange-800 text-sm mb-2">🎓 에듀테크 포인트</h4>
                              <div className="text-xs text-orange-700 space-y-1">
                                <div>• 개인별 맞춤형 AI 학습 경로 설계</div>
                                <div>• VR/AR 활용 몰입형 교육 환경</div>
                                <div>• 학습 성과 실시간 분석 및 피드백</div>
                              </div>
                            </div>
                          )}
                          
                          {index === 4 && (
                            <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                              <h4 className="font-bold text-indigo-800 text-sm mb-2">🌟 소통 혁신 포인트</h4>
                              <div className="text-xs text-indigo-700 space-y-1">
                                <div>• AI 챗봇 기반 24시간 소통 지원</div>
                                <div>• 감정 분석을 통한 조직 문화 모니터링</div>
                                <div>• 협업 패턴 분석 및 최적화 제안</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* 컨설팅 착수 절차 추가 */}
              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  📋 컨설팅 착수 절차
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 border-2 border-blue-200 bg-blue-50 text-center">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        1
                      </div>
                      <h4 className="font-bold text-blue-800 mb-2">진단컨설팅</h4>
                      <p className="text-sm text-blue-700">
                        현장 방문 및 기업 현황 정밀 진단 (2주)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6 border-2 border-purple-200 bg-purple-50 text-center">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        2
                      </div>
                      <h4 className="font-bold text-purple-800 mb-2">수행계획 수립</h4>
                      <p className="text-sm text-purple-700">
                        수행계획서 및 노사대표합의확인서 제출
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6 border-2 border-green-200 bg-green-50 text-center">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        3
                      </div>
                      <h4 className="font-bold text-green-800 mb-2">심사·선정</h4>
                      <p className="text-sm text-green-700">
                        심화/특화형의 경우 심사 과정 (전문형은 바로 진행)
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6 border-2 border-orange-200 bg-orange-50 text-center">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        4
                      </div>
                      <h4 className="font-bold text-orange-800 mb-2">본격 컨설팅</h4>
                      <p className="text-sm text-orange-700">
                        5주~20주 집중 AI 융합 혁신 컨설팅 수행
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                AI 융합 일터혁신의 체계적 기대 효과
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                전통적인 인사제도 개선과 최신 AI 기술 융합으로 <strong>단계별·체계적 성과</strong>를 실현합니다.
              </p>
              
              {/* 핵심 성과 지표 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 border-2 border-orange-200 bg-orange-50 text-center">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-orange-600 mb-2">50%</div>
                    <div className="text-sm font-medium text-orange-800">제안서 작성 시간 단축</div>
                    <div className="text-xs text-orange-600 mt-1">실제 적용 기업 검증</div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 border-2 border-blue-200 bg-blue-50 text-center">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                    <div className="text-sm font-medium text-blue-800">업무 프로세스 효율성</div>
                    <div className="text-xs text-blue-600 mt-1">AI 자동화 도구 활용</div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 border-2 border-purple-200 bg-purple-50 text-center">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-purple-600 mb-2">90%</div>
                    <div className="text-sm font-medium text-purple-800">AI 도구 활용률</div>
                    <div className="text-xs text-purple-600 mt-1">직원 디지털 역량 향상</div>
                  </CardContent>
                </Card>
                
                <Card className="p-6 border-2 border-green-200 bg-green-50 text-center">
                  <CardContent className="p-0">
                    <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                    <div className="text-sm font-medium text-green-800">해외 사업 확장 지원</div>
                    <div className="text-xs text-green-600 mt-1">글로벌 경쟁력 확보</div>
                  </CardContent>
                </Card>
              </div>

              {/* 체계적 기대 효과 */}
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-blue-600 text-center">🏢 조직 혁신 효과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-blue-800 text-sm mb-2">근로시간 관리 혁신</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• AI 기반 자동 근태 관리</li>
                          <li>• 초과근로 30% 감소</li>
                          <li>• 연차 사용률 25% 향상</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-blue-800 text-sm mb-2">업무 프로세스 개선</h4>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• RPA 도입으로 반복업무 70% 자동화</li>
                          <li>• 문서 처리 시간 50% 단축</li>
                          <li>• 실시간 성과 모니터링</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-purple-600 text-center">💼 경영 성과 효과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-purple-800 text-sm mb-2">비용 절감 효과</h4>
                        <ul className="text-xs text-purple-700 space-y-1">
                          <li>• 운영 비용 30% 절감</li>
                          <li>• 인사관리 효율성 45% 향상</li>
                          <li>• 교육훈련 비용 20% 절약</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-purple-800 text-sm mb-2">매출 증대 효과</h4>
                        <ul className="text-xs text-purple-700 space-y-1">
                          <li>• 고객 만족도 25% 향상</li>
                          <li>• 제안서 수주율 35% 개선</li>
                          <li>• 신규 사업 기회 확대</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-green-600 text-center">🚀 미래 경쟁력 효과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 text-sm mb-2">디지털 전환 완성</h4>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• AI 도구 활용률 90% 달성</li>
                          <li>• 디지털 리터러시 80% 향상</li>
                          <li>• 데이터 기반 의사결정 체계</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-green-800 text-sm mb-2">지속성장 기반</h4>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• 혁신 문화 정착</li>
                          <li>• 인재 유치·유지 능력 강화</li>
                          <li>• 글로벌 시장 진출 기반</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 2025년 특화 효과 */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  🏆 2025년 특화 프로그램 기대 효과
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-blue-600">🏠 일가정양립 여건 조성 효과</CardTitle>
                      <p className="text-sm text-blue-700">저출생 대응 정책 연계 성과</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">80%</div>
                          <div className="text-xs text-blue-700">유연근무 활용률</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">35%</div>
                          <div className="text-xs text-blue-700">직원 만족도 향상</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">25%</div>
                          <div className="text-xs text-blue-700">이직률 감소</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">40%</div>
                          <div className="text-xs text-blue-700">업무 효율성 증대</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="p-6 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-pink-600">👥 장년친화 고용 지원 효과</CardTitle>
                      <p className="text-sm text-pink-700">고령화 대응 정책 연계 성과</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-pink-600">95%</div>
                          <div className="text-xs text-pink-700">장년 인력 유지율</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-pink-600">60%</div>
                          <div className="text-xs text-pink-700">노하우 전수 효과</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-pink-600">30%</div>
                          <div className="text-xs text-pink-700">세대간 협업 향상</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center">
                          <div className="text-2xl font-bold text-pink-600">50%</div>
                          <div className="text-xs text-pink-700">경험 기반 혁신</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 추천 신청 전략 */}
              <Card className="p-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl text-orange-600 text-center">
                    💡 추천 신청 전략
                  </CardTitle>
                  <p className="text-center text-orange-700">
                    최적의 성과를 위한 아이엔제이컨설팅 맞춤형 전략
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <h4 className="font-bold text-orange-800 mb-3">🤖 AI 융합 혁신 전략</h4>
                      <div className="text-sm text-orange-700 space-y-2">
                        <div>• <strong>근무체계 개편</strong> + <strong>업무관리체계</strong></div>
                        <div>• 심화형 2개 요구사항 조합</div>
                        <div>• AI 기술 완전 융합</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <h4 className="font-bold text-orange-800 mb-3">🌟 조직문화 혁신 전략</h4>
                      <div className="text-sm text-orange-700 space-y-2">
                        <div>• <strong>조직문화 개선</strong> + <strong>소통활성화</strong></div>
                        <div>• 심화형 + 전문형 조합</div>
                        <div>• 인적 자원 최적화</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-orange-200">
                      <h4 className="font-bold text-orange-800 mb-3">📊 인사제도 혁신 전략</h4>
                      <div className="text-sm text-orange-700 space-y-2">
                        <div>• <strong>인사평가제도</strong> + <strong>임금체계 재설계</strong></div>
                        <div>• 심화형 2개 요구사항</div>
                        <div>• 데이터 기반 공정성</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-orange-100 p-4 rounded-lg text-center">
                    <span className="text-sm font-bold text-orange-800">
                      👉 20~99인 기업은 100% 무료! 지금 바로 신청하여 AI 혁신의 기회를 놓치지 마세요!
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto text-white">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              🚨 2025년 일터혁신 상생컨설팅 신청 마감 임박!
            </h2>
            <p className="text-xl mb-6 text-purple-100">
              고용노동부 노사발전재단 공식 지원사업으로 
              <strong>20~99인 기업은 100% 무료</strong>로 AI 혁신을 실현하세요!
            </p>
            
            {/* 신청 방법 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">📋 신청 방법</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left text-sm">
                <div>
                  <h4 className="font-semibold mb-2">1️⃣ 온라인 신청 (필수)</h4>
                  <p className="text-purple-100">
                    노사발전재단 홈페이지<br />
                    <span className="text-yellow-300">https://www.kwpi.or.kr</span>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2️⃣ 컨설팅 수행기관 선택</h4>
                  <p className="text-purple-100">
                    신청시 반드시<br />
                    <span className="text-yellow-300">"아이엔제이컨설팅"</span> 선택
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3️⃣ 필수 서류 제출</h4>
                  <p className="text-purple-100">
                    • 고용보험가입자명부 (20인 이상 확인)<br />
                    • 사업자등록증
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">4️⃣ 담당자 연락</h4>
                  <p className="text-purple-100">
                    이후경 책임컨설턴트<br />
                    <span className="text-yellow-300">010-9251-9743</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-4 font-bold"
                onClick={() => window.open('https://www.kwpi.or.kr', '_blank')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                노사발전재단 신청하기
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Brain className="w-5 h-5 mr-2" />
                사전 상담받기
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-purple-200">
              ⚠️ 예산 소진 시 조기 마감 가능 | 20인 이상 사업장 대상
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 