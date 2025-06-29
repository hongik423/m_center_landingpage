'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Factory, 
  Rocket, 
  Award, 
  Globe,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  Zap,
  BarChart3,
  Star,
  Quote
} from 'lucide-react';

// AI 실무도입 성공사례 데이터 (SUCESSCASE.MD 기반)
const aiSuccessCases = [
  {
    id: 'manufacturing',
    company: '스마트팩토리솔루션',
    industry: '자동차 부품 제조업',
    employees: '67명',
    revenue: '145억원',
    category: 'AI 업무혁신',
    icon: Factory,
    color: 'from-blue-500 to-purple-600',
    badge: '제조업 혁신',
    challenge: '수작업 비중 68%, 품질 불량률 3.2%, 제안서 작성 지옥',
    solution: 'Business Model Zen + AI 통합 시스템',
    timeframe: '20주 집중 프로그램',
    investment: '8,000만원',
    results: {
      efficiency: '업무 시간 40% 단축',
      quality: '품질 불량률 3.2% → 0.7%',
      productivity: '제안서 작성 8시간 → 2.5시간',
      revenue: '연간 5억 8,000만원 경제 효과',
      roi: 'ROI 375% (6개월 기준)'
    },
    aiTools: [
      'ChatGPT Enterprise - 제안서 자동 작성',
      'Claude Pro - 품질 데이터 분석',
      'Python + AI - 실시간 품질 모니터링',
      'DeepL Pro - 다국어 소통 자동화'
    ],
    process: [
      '1단계: AI 역량 진단 (2주)',
      '2단계: 맞춤 AI 도구 선정 (3주)', 
      '3단계: 실무 적용 및 훈련 (16주)',
      '4단계: 성과 측정 및 최적화 (2주)'
    ],
    testimonial: {
      name: '김철수 대표이사',
      content: 'AI 도입 전후가 완전히 다른 회사가 되었습니다. 직원들이 창조적인 일에 집중할 수 있게 된 게 가장 큰 성과입니다.'
    }
  },
  {
    id: 'creative',
    company: '크리에이티브마케팅',
    industry: '종합 광고 대행',
    employees: '28명',
    revenue: '42억원',
    category: 'AI 창작혁신',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
    badge: '창작업 혁신',
    challenge: '아이디어 고갈, 시간 부족, 창작 업무 병목 현상',
    solution: 'AI 창작 도구 통합 워크플로우',
    timeframe: '10일 완성 (기존 4주)',
    investment: '6,000만원',
    results: {
      efficiency: '창작 시간 81% 단축',
      productivity: '프로젝트 처리량 125% 증가',
      quality: '시안 생성 3개/일 → 20개/일',
      revenue: '연매출 42억 → 68억 (61% 성장)',
      satisfaction: '클라이언트 만족도 88% → 96%'
    },
    aiTools: [
      'Midjourney - 50개 로고 시안 3시간 생성',
      'ChatGPT-4 - 마케팅 전략 수립',
      'Claude - 브랜드 메시지 10개 버전 작성',
      'RunwayML - 영상 제작 1주일 → 1일'
    ],
    process: [
      '1일차: AI 시장 분석 및 인사이트 도출',
      '2-3일차: AI 브랜드 컨셉 개발',
      '4-6일차: AI 콘텐츠 제작',
      '7-10일차: AI 검증 및 최적화'
    ],
    testimonial: {
      name: '박지영 크리에이티브 디렉터',
      content: 'AI가 제 창작 능력을 10배 증폭시켜줬어요. 클라이언트들이 어떻게 이렇게 빨리, 다양한 시안을 만들어내느냐고 놀라워해요.'
    }
  },
  {
    id: 'startup',
    company: 'AI헬스케어테크',
    industry: 'AI 헬스케어 스타트업',
    employees: '15명',
    revenue: '월 8억원',
    category: 'AI 사업화',
    icon: Rocket,
    color: 'from-green-500 to-emerald-600',
    badge: '스타트업',
    challenge: '제품 개발 지연, 투자 유치 어려움, 시장 검증 부족',
    solution: 'AI 기반 린 스타트업 방법론',
    timeframe: '8개월 (예상 24개월)',
    investment: '시드 3억원, 시리즈A 15억원',
    results: {
      development: '제품 개발 기간 66% 단축',
      funding: '투자 유치 성공률 85% (업계 평균 15%)',
      customers: '고객 확보 월 5개 → 월 50개',
      valuation: '기업 가치 150억원',
      growth: '월평균 35% 성장 유지'
    },
    aiTools: [
      'GitHub Copilot - 개발 속도 300% 향상',
      'ChatGPT Code - 버그 수정 시간 80% 단축',
      'Claude - 투자 제안서 논리 구조 강화',
      'AI 빅데이터 분석 - 정확한 시장 규모 산정'
    ],
    process: [
      '1단계: AI 기반 시장 기회 발굴',
      '2단계: AI 기반 MVP 설계',
      '3단계: AI 개발 도구로 빠른 구축',
      '4단계: AI 마케팅으로 고객 확보'
    ],
    testimonial: {
      name: '이지수 대표',
      content: 'AI 없이는 이런 성장이 불가능했을 겁니다. 투자자들이 스타트업 맞나 할 정도로 완성도 높은 사업계획서를 만들 수 있었어요.'
    }
  },
  {
    id: 'investment',
    company: '스마트리얼에스테이트',
    industry: '경매 부동산 투자',
    employees: '8명',
    revenue: '운용자산 450억원',
    category: 'AI 투자분석',
    icon: BarChart3,
    color: 'from-orange-500 to-red-600',
    badge: '투자업',
    challenge: '물건 분석 3일 소요, 시세 분석 부정확, 감정적 투자 판단',
    solution: 'AI 기반 부동산 투자 분석 시스템',
    timeframe: '3시간 완성 (기존 3일)',
    investment: '분석 도구 3,000만원',
    results: {
      speed: '물건 조사 시간 92% 단축',
      accuracy: '시세 분석 정확도 75% → 94%',
      success: '낙찰 성공률 35% → 78%',
      returns: '투자 수익률 연 15% → 35%',
      scale: '월 투자 건수 2건 → 15건'
    },
    aiTools: [
      'ChatGPT-4 - 부동산 투자 분석 전문가',
      'Python + AI - 실시간 경매 데이터 수집',
      '머신러닝 - 가격 예측 정확도 94%',
      'AI 리스크 분석 - 투자 위험도 자동 평가'
    ],
    process: [
      '30분: AI 기초 정보 수집',
      '1시간: AI 시세 분석',
      '1시간: AI 리스크 분석',
      '30분: AI 투자 전략 수립'
    ],
    testimonial: {
      name: '김투자 팀장',
      content: '20년간 부동산 투자를 해왔지만 AI 도입 후가 완전히 다른 세상이었어요. 수익률이 2배 이상 좋아졌어요.'
    }
  },
  {
    id: 'certification',
    company: '그린테크솔루션',
    industry: '환경 기술 개발',
    employees: '95명',
    revenue: '220억원',
    category: 'AI 인증관리',
    icon: Award,
    color: 'from-indigo-500 to-purple-600',
    badge: '인증관리',
    challenge: '인증 준비 8개월, 문서 관리 복잡, ESG 보고서 작성 3주',
    solution: 'AI 기반 통합 인증 관리 시스템',
    timeframe: '3개월 (기존 8개월)',
    investment: '5,000만원',
    results: {
      time: '인증 준비 시간 62% 단축',
      efficiency: '인증 관리 시간 월 120시간 → 24시간',
      accuracy: '문서 오류율 15% → 2%',
      grade: 'ESG B등급 → A등급 달성',
      cost: '연 1억 1,000만원 절감 효과'
    },
    aiTools: [
      'ChatGPT - 27개 보안 정책 초안 자동 작성',
      'Claude - 85개 운영 절차 문서 생성',
      'AI 모니터링 - 24시간 실시간 성과 추적',
      'AI 보고서 - 분기별 ESG 보고서 3일 완성'
    ],
    process: [
      '1개월: AI 현황 분석 및 Gap 도출',
      '2개월: AI 정책 수립 및 문서 작성',
      '3개월: AI 기반 심사 준비'
    ],
    testimonial: {
      name: '박지원 품질경영팀장',
      content: 'AI가 인증 관리의 패러다임을 바꿔놨어요. 실질적인 개선이 이뤄지고 있다는 걸 느껴요.'
    }
  },
  {
    id: 'website',
    company: '디지털마케팅솔루션',
    industry: '디지털 마케팅 에이전시',
    employees: '35명',
    revenue: '65억원',
    category: 'AI 웹최적화',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    badge: '웹사이트',
    challenge: '전환율 2.3%, 체류시간 1분 30초, SEO 랭킹 25위',
    solution: 'AI 기반 웹사이트 개인화 및 최적화',
    timeframe: '실시간 최적화',
    investment: '연 1,200만원',
    results: {
      conversion: '전환율 2.3% → 8.7% (278% 향상)',
      engagement: '체류시간 1분 30초 → 4분 20초',
      seo: 'SEO 랭킹 평균 25위 → 3위',
      revenue: '온라인 매출 비중 15% → 58%',
      roi: 'ROI 2,900% (29배 수익)'
    },
    aiTools: [
      'AI 개인화 엔진 - 사용자별 맞춤 콘텐츠',
      'ChatGPT - 월 50개 SEO 콘텐츠 자동 생성',
      'AI A/B 테스트 - 실시간 자동 최적화',
      'Midjourney - 무제한 비주얼 콘텐츠 생성'
    ],
    process: [
      '실시간: 사용자 행동 분석',
      '즉시: 개인화 콘텐츠 제공',
      '자동: A/B 테스트 및 최적화',
      '지속: 성과 측정 및 개선'
    ],
    testimonial: {
      name: '이마케팅 대표',
      content: 'AI가 우리 웹사이트를 매출 머신으로 바꿔놨어요. 온라인 문의가 월 15건에서 125건으로 늘었거든요.'
    }
  }
];

// 통합 성과 지표
const overallStats = [
  { icon: TrendingUp, label: '참여 기업', value: '247개사', color: 'text-blue-600' },
  { icon: Target, label: '평균 효율성 향상', value: '48%', color: 'text-green-600' },
  { icon: DollarSign, label: '평균 연간 절감', value: '1.2억원', color: 'text-purple-600' },
  { icon: Star, label: '고객 만족도', value: '94%', color: 'text-orange-600' }
];

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState(aiSuccessCases[0]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">AI 실무도입 성공사례</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="block">실제 기업들의</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI 혁신 성과
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              247개 기업이 20주 프로그램으로 달성한 <strong className="text-gray-800">평균 48% 효율성 향상</strong>과<br />
              <strong className="text-gray-800">연 1.2억원 절감 효과</strong>의 실제 사례를 확인해보세요
            </p>
          </div>

          {/* 통합 성과 지표 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {overallStats.map((stat, index) => (
              <Card key={index} className="text-center bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 성공사례 상세 섹션 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              업종별 AI 실무도입 성공사례
            </h2>
            <p className="text-lg text-gray-600">
              각 업종의 특성에 맞는 AI 활용법과 구체적인 성과를 확인해보세요
            </p>
          </div>

          {/* 사례 선택 탭 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {aiSuccessCases.map((case_) => (
              <button
                key={case_.id}
                onClick={() => setSelectedCase(case_)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group ${
                  selectedCase.id === case_.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedCase.id !== case_.id && (
                  <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                )}
                <span className="relative flex items-center gap-3">
                  <case_.icon className={`w-5 h-5 ${selectedCase.id === case_.id ? '' : 'group-hover:scale-110 transition-transform duration-200'}`} />
                  {case_.company}
                </span>
              </button>
            ))}
          </div>

          {/* 선택된 사례 상세 내용 */}
          <div className="max-w-7xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* 헤더 */}
                <div className={`bg-gradient-to-r ${selectedCase.color} p-8 text-white`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                          <selectedCase.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-white">{selectedCase.company}</h3>
                          <p className="text-blue-100">{selectedCase.industry}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="text-2xl font-bold">{selectedCase.employees}</div>
                          <div className="text-sm text-blue-100">직원 수</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{selectedCase.revenue}</div>
                          <div className="text-sm text-blue-100">연매출</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{selectedCase.timeframe}</div>
                          <div className="text-sm text-blue-100">프로젝트 기간</div>
                        </div>
                      </div>
                    </div>
                    
                    <Badge className="bg-white/20 text-white border-white/30">
                      {selectedCase.badge}
                    </Badge>
                  </div>
                </div>

                {/* 본문 */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 좌측: 도전과제 & 솔루션 */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6 text-red-500" />
                          도전과제
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{selectedCase.challenge}</p>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Zap className="w-6 h-6 text-blue-500" />
                          AI 솔루션
                        </h4>
                        <p className="text-gray-700 mb-4 leading-relaxed">{selectedCase.solution}</p>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-semibold text-gray-900 mb-3">활용한 AI 도구</h5>
                          <ul className="space-y-2">
                            {selectedCase.aiTools.map((tool, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {tool}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Clock className="w-6 h-6 text-purple-500" />
                          실행 프로세스
                        </h4>
                        <div className="space-y-3">
                          {selectedCase.process.map((step, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 우측: 성과 지표 */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                          <TrendingUp className="w-6 h-6 text-green-500" />
                          달성 성과
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {Object.entries(selectedCase.results).map(([key, value], index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600 mb-1">{value}</div>
                              <div className="text-sm text-gray-600 capitalize">
                                {key === 'efficiency' && '업무 효율성'}
                                {key === 'quality' && '품질 개선'}
                                {key === 'productivity' && '생산성 향상'}
                                {key === 'revenue' && '매출 증대'}
                                {key === 'roi' && '투자 수익률'}
                                {key === 'accuracy' && '정확도 향상'}
                                {key === 'success' && '성공률'}
                                {key === 'returns' && '수익률'}
                                {key === 'development' && '개발 단축'}
                                {key === 'funding' && '투자 유치'}
                                {key === 'customers' && '고객 확보'}
                                {key === 'valuation' && '기업 가치'}
                                {key === 'growth' && '성장률'}
                                {key === 'speed' && '처리 속도'}
                                {key === 'scale' && '처리 규모'}
                                {key === 'time' && '시간 단축'}
                                {key === 'grade' && '등급 상승'}
                                {key === 'cost' && '비용 절감'}
                                {key === 'conversion' && '전환율'}
                                {key === 'engagement' && '참여도'}
                                {key === 'seo' && 'SEO 순위'}
                                {key === 'satisfaction' && '만족도'}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-6 bg-gray-900 rounded-lg text-white">
                          <div className="flex items-start gap-4">
                            <Quote className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
                            <div>
                              <p className="text-gray-200 mb-3 italic leading-relaxed">
                                "{selectedCase.testimonial.content}"
                              </p>
                              <div className="text-blue-300 font-semibold">
                                {selectedCase.testimonial.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Model Zen 프레임워크 */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              5단계 AI 실무도입 프레임워크
            </h2>
            <p className="text-lg text-gray-600">
              모든 성공사례에 적용된 검증된 방법론
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
                              { step: '1단계', title: '가치 발견', desc: 'AI 역량 진단', icon: '1', color: 'from-blue-400 to-blue-600' },
                  { step: '2단계', title: '가치 창출', desc: '맞춤 전략 설계', icon: '2', color: 'from-green-400 to-green-600' },
    { step: '3단계', title: '가치 제공', desc: '실무 적용', icon: '3', color: 'from-purple-400 to-purple-600' },
    { step: '4단계', title: '가치 포착', desc: '성과 측정', icon: '4', color: 'from-orange-400 to-orange-600' },
                              { step: '5단계', title: '가치 교정', desc: '지속 발전', icon: '5', color: 'from-pink-400 to-pink-600' }
            ].map((phase, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-2xl`}>
                    {phase.icon}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{phase.step}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{phase.title}</h3>
                  <p className="text-sm text-gray-600">{phase.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            다음 성공사례의 주인공이 되어보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            247개 기업이 검증한 20주 집중 프로그램으로<br />
            <strong className="text-white">평균 48% 효율성 향상</strong>과 <strong className="text-white">연 1.2억원 절감</strong>을 경험하세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/diagnosis"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-md transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Brain className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                무료 AI 진단 시작하기
              </span>
            </Link>
            
            <Link 
              href="/consultation"
              className="inline-flex items-center justify-center border border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-md transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Users className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                전문가 상담 신청
              </span>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-blue-200">
            ✓ 20주 집중 프로그램 ✓ 성과 보장 ✓ 6개월 사후관리
          </div>
        </div>
      </section>
    </div>
  );
} 