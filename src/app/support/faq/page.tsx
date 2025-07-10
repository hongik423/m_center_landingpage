'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  TrendingUp, 
  Rocket, 
  Factory, 
  Award, 
  Globe, 
  Bot,
  ChevronRight,
  Star,
  Target,
  Zap,
  Building,
  Users,
  BarChart3,
  Lightbulb,
  Shield,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Header from '@/components/layout/header';

// 페르소나별 질문 데이터
const faqData = {
  growth: {
    title: '성장형 중소기업 CEO',
    icon: TrendingUp,
    color: 'blue',
    description: '매출 10-50억, 직원 10-50명, 성장 정체기',
    questions: [
      {
        id: 'growth-1',
        question: '우리 회사 매출이 3년째 정체되어 있어요. 어떻게 돌파구를 찾을 수 있을까요?',
        primaryService: 'BM ZEN 사업분석',
        relatedServices: ['AI 생산성향상', '웹사이트 구축'],
        answer: `매출 정체는 많은 중소기업이 겪는 공통적인 문제입니다. 25년간 500개 기업을 직접 지도하면서 발견한 핵심은 '근본 원인 파악'입니다.

**🎯 M-CENTER BM ZEN 사업분석**

**독자적 5단계 프레임워크:**
1️⃣ **가치 발견** - 현재 비즈니스 모델 정밀 진단
2️⃣ **가치 창출** - 새로운 수익 모델 설계  
3️⃣ **가치 제공** - 고객 가치 전달 체계 최적화
4️⃣ **가치 포착** - 수익 창출 메커니즘 강화
5️⃣ **가치 교정** - 지속적 개선 시스템 구축

**📈 검증된 성과:**
• 평균 매출 증대율: 35% (최소 20%, 최대 60%)
• 수익성 개선: 평균 28%
• 성공률: 95% (500개 기업 중 475개 성공)
• ROI: 300-800%

**🏆 실제 성공사례:**
• A제조업체: 매출 45% 증가 (27억 → 39억)
• B서비스업: 수익률 35% 개선
• C유통업: 신규 수익모델로 시장점유율 3배 확대`,
        nextQuestions: [
          '직원들의 업무 효율도 함께 개선하고 싶어요',
          '온라인 마케팅도 강화하고 싶은데요',
          '정부지원도 받을 수 있나요?'
        ]
      },
      {
        id: 'growth-2',
        question: '직원들의 업무 효율이 떨어져서 고민이에요. AI를 도입하면 정말 효과가 있을까요?',
        primaryService: 'AI 생산성향상',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        answer: `AI 도입으로 직원들의 생산성을 획기적으로 향상시킬 수 있습니다!

**🤖 AI 활용 생산성향상 서비스**

**핵심 솔루션:**
• ChatGPT 기업 활용 마스터 프로그램
• 업무 자동화 시스템 구축
• AI 기반 데이터 분석 및 의사결정 지원
• 맞춤형 AI 도구 도입 및 교육

**📊 구체적 효과:**
• 업무 효율성: 40-60% 향상
• 문서 작성 시간: 70% 단축
• 데이터 분석 속도: 5배 향상
• 의사결정 품질: 3배 개선
• 인건비 절감: 25%

**💰 정부지원 혜택:**
• 고용노동부 일터혁신: 100% 정부지원
• 중소벤처기업부 AI 바우처: 최대 2천만원
• 진행 기간: 20주 집중 프로그램
• 실제 비용: 0원 (정부지원 100%)`,
        nextQuestions: [
          '우리 회사의 비즈니스 모델 진단도 받고 싶어요',
          '벤처기업 인증을 받으면 어떤 혜택이 있나요?',
          '온라인 마케팅을 강화하고 싶은데요'
        ]
      }
    ]
  },
  startup: {
    title: '기술창업 준비자/초기 스타트업',
    icon: Rocket,
    color: 'purple',
    description: '기술 보유, 자금 필요, 사업화 경험 부족',
    questions: [
      {
        id: 'startup-1',
        question: '기술은 있는데 사업화 방법을 모르겠어요. 어떻게 시작해야 할까요?',
        primaryService: '기술사업화',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        answer: `기술을 보유하고 계시다니 정말 좋은 출발점이네요! 25년간 200개 이상의 기술기업을 성공시킨 노하우로 도와드리겠습니다.

**🚀 M-CENTER 기술사업화 지원**

**5단계 성공 프로세스:**
1️⃣ **기술 가치 평가** - 시장성 및 상용화 가능성 분석
2️⃣ **사업화 전략 수립** - 시장 진입 및 수익 모델 설계
3️⃣ **정부지원 과제 기획** - R&D 및 사업화 자금 확보
4️⃣ **투자유치 지원** - VC/엔젤 투자 연계
5️⃣ **사업화 실행** - 3년간 지속 지원

**💰 자금 확보 실적:**
• 평균 확보 금액: 5억원
• 정부 R&D: 2-10억원
• 민간 투자: 1-20억원
• 성공률: 85% (100개 중 85개 성공)

**🏆 성공사례:**
• J-AI 스타트업: 정부과제 8억 + 투자 12억 확보
• K-바이오텍: 3년간 총 25억원 자금 조달
• L-핀테크: 시리즈A 50억원 투자 유치`,
        nextQuestions: [
          '정부 R&D 자금을 받으려면 어떤 준비가 필요한가요?',
          '스타트업이 받을 수 있는 인증이나 혜택이 있나요?',
          '우리 기술의 시장성을 어떻게 검증할 수 있을까요?'
        ]
      }
    ]
  },
  manufacturing: {
    title: '제조업 경영진',
    icon: Factory,
    color: 'orange',
    description: '전통 제조업, 고정비 부담, 생산성 이슈',
    questions: [
      {
        id: 'manufacturing-1',
        question: '사업 확장이나 시설 투자를 위한 정책자금이 있나요? 어떻게 활용할 수 있을까요?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        answer: `정책자금을 통해 사업 확장과 투자를 성공적으로 지원해드립니다! 25년간 300건 이상의 정책자금 획득을 성공시킨 전문가가 직접 도와드려요.

**🏛️ 정책자금 활용 서비스**

**전문가 완전 위탁 서비스:**
• 기업 상황 분석 및 적합한 정책자금 매칭
• 사업계획서 작성 및 신청서 준비
• 정부 기관 대응 및 협상
• 자금 집행 계획 수립 및 관리
• 사후 관리 및 성과 보고

**💰 지원 효과:**
• 자금 조달 성공률 95% (업계 최고)
• 평균 확보 금액: 5-100억원
• 이자율: 연 1-3% (시중은행 대비 50% 절약)
• 담보 부담 최소화

**🛡️ 성공 보장:**
• 25년 정책자금 전문 경험
• 정부 기관 네트워크 활용
• 맞춤형 전략 수립
• 100% 성공 보장 시스템

**🏆 성공사례:**
• 관광시설 A사: 100억원 정책자금 확보 (연 2% 저금리)
• 제조업 B사: 50억원 시설자금 획득 (6개월 만에 성공)
• 서비스업 C사: 30억원 성장사다리펀드 유치`,
        nextQuestions: [
          '제조업도 AI를 활용할 수 있나요?',
          'ISO 인증을 받으면 어떤 도움이 되나요?',
          '사업 확장을 위한 투자 전략은 어떻게 수립하나요?'
        ]
      }
    ]
  },
  service: {
    title: '서비스업 소상공인',
    icon: Building,
    color: 'green',
    description: '직원 5-20명, 온라인 마케팅 필요',
    questions: [
      {
        id: 'service-1',
        question: '온라인으로 고객을 늘리고 싶은데, 홈페이지만 만들면 될까요?',
        primaryService: '웹사이트 구축',
        relatedServices: ['BM ZEN 사업분석', 'AI 생산성향상'],
        answer: `단순한 홈페이지가 아닌 매출 증대를 위한 전략적 웹사이트가 필요합니다!

**🌐 M-CENTER 웹사이트 구축 서비스**

**차별화된 특징:**
• SEO 전문가가 직접 최적화
• AI 기반 콘텐츠 자동 생성
• 모바일 퍼스트 반응형 디자인
• 실시간 고객 문의 시스템
• 데이터 분석 대시보드 내장

**📈 검증된 성과:**
• 온라인 문의: 평균 300% 증가
• 검색 노출: 상위 3페이지 보장
• 매출 기여도: 30-50% 증대
• 브랜드 인지도: 5배 향상

**💎 프리미엄 서비스:**
• 1년간 무료 유지보수
• 월 2회 콘텐츠 업데이트
• SEO 성과 월간 리포트
• 24시간 기술 지원

**🏆 성공사례:**
• G제조업: 온라인 주문 월 500건 달성
• H서비스업: 웹 매출 연 15억 달성
• I유통업: 브랜드 검색량 10배 증가`,
        nextQuestions: [
          '우리 사업 모델 자체도 점검받고 싶어요',
          'AI로 업무 효율을 높이고 싶어요',
          '소상공인도 정부지원을 받을 수 있나요?'
        ]
      }
    ]
  },
  policyFunding: {
    title: '정책자금 특별 상담사례',
    icon: Factory,
    color: 'orange',
    description: '대규모 정책자금 확보 실사례',
    questions: [
      {
        id: 'policy-1',
        question: '관광시설 사업을 시작하려는데, 대규모 자금이 필요해요. 정책자금으로 가능할까요?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        answer: `네, 관광시설 개발을 위한 정책자금은 충분히 가능합니다! 
실제 H관광개발(가명)이 100억원 정책자금을 성공적으로 확보한 사례가 있습니다.

**🏛️ 관광시설 정책자금 성공 사례**

**📊 H관광개발 사례 (실명 보호)**
• 사업 내용: 복합 관광 리조트 개발
• 확보 자금: 100억원 (정책자금 70억 + 연계 민간투자 30억)
• 이자율: 연 1.8% (시중은행 대비 3.2%p 절감)
• 상환 조건: 5년 거치 10년 분할상환
• 담보: 토지 담보 50% + 정부 보증 50%

**🎯 성공 요인:**
• 지역 관광산업 활성화 연계 전략
• 고용 창출 효과 극대화 (200명 신규 채용)
• 환경친화적 시설 구축 계획
• 지자체 연계 상생 협력 방안

**💰 지원 프로그램:**
• 문화체육관광부 관광자원개발기금
• 중소벤처기업부 성장사다리펀드
• 지역산업진흥공단 지역특화사업
• 산업은행 정책금융 연계

진행 기간: 8개월 (사업계획 수립 3개월 + 심사 승인 5개월)`,
        nextQuestions: [
          '정책자금 신청 과정이 복잡하다고 들었는데요',
          '우리 회사도 100억원 이상 확보가 가능한가요?',
          '관광업 외에 다른 업종도 대규모 자금 확보가 가능한가요?'
        ]
      },
      {
        id: 'policy-2',
        question: '정책자금 확보를 위해 사업타당성과 비즈니스 모델 검토가 중요하다고 하는데, 어떻게 진행하나요?',
        primaryService: '정책자금',
        relatedServices: ['BM ZEN 사업분석', '인증지원'],
        answer: `정확한 지적입니다! 정책자금 확보의 핵심은 '사업타당성'과 '비즈니스 사업성' 입증입니다.
M-CENTER만의 차별화된 BM ZEN 통합 컨설팅으로 95% 성공률을 달성하고 있습니다.

**🎯 BM ZEN 기반 사업타당성 검토 프레임워크**

**1단계: 가치발견 (Business Viability)**
• 시장 규모 및 성장성 정밀 분석
• 경쟁사 대비 차별화 요소 발굴
• 고객 니즈 및 페인포인트 검증
• 사업 추진 역량 및 리스크 평가

**2단계: 가치창출 (Financial Feasibility)**
• 5년 재무계획 및 수익성 분석
• ROI, NPV, IRR 정밀 계산
• 자금 조달 및 상환 계획 최적화
• 정부지원 효과 극대화 전략

**3단계: 가치제공 (Market Validation)**
• 타겟 시장 진입 전략 수립
• 고객 확보 및 매출 예측 모델
• 파트너십 및 유통 채널 설계
• 지속가능한 성장 동력 확보

**💼 K바이오텍 통합컨설팅 성공사례**
• 사업 분야: 의료기기 개발 및 제조
• 컨설팅 기간: 4개월 (사업타당성 검토 포함)
• 확보 결과: 80억원 (R&D 50억 + 시설 30억)

**🔍 차별화된 검토 결과:**
- 시장성 분석: 연평균 15% 성장 시장 진입
- 기술성 평가: 특허 3건, 기술이전 가능성 검증
- 수익성 분석: 3년 후 흑자 전환, 5년 ROI 280%
- 정책 부합성: 바이오헬스 국가전략과 100% 일치

**⭐ M-CENTER 통합 컨설팅의 차별점:**
• BM ZEN 프레임워크 기반 체계적 분석
• 25년 축적된 업종별 데이터베이스 활용
• 정부 정책 트렌드와 기업 전략 완벽 매칭
• 사업계획서 단순 작성이 아닌 비즈니스 모델 혁신

단순한 서류 작성이 아닌, 진짜 '사업 성공'을 위한 통합 솔루션입니다!`,
        nextQuestions: [
          'BM ZEN 프레임워크가 다른 컨설팅과 어떻게 다른가요?',
          '우리 사업의 시장성과 수익성을 정확히 검증받고 싶어요',
          '정책자금과 비즈니스 모델 개선을 동시에 진행할 수 있나요?'
        ]
      }
    ]
  }
};

// 서비스별 상세 정보
const serviceDetails = {
  'BM ZEN 사업분석': {
    icon: Target,
    color: 'blue',
    description: '비즈니스 모델 최적화를 통한 수익성 개선',
    effect: '매출 20-40% 증대',
    duration: '2-3개월',
    roi: '300-800%',
    link: '/services/business-analysis'
  },
  'AI 생산성향상': {
    icon: Bot,
    color: 'purple',
    description: 'ChatGPT 등 AI 도구 활용 업무 효율화',
    effect: '업무효율 40-60% 향상',
    duration: '1-2개월',
    roi: '400-1000%',
    link: '/services/ai-productivity'
  },
  '정책자금': {
    icon: Factory,
    color: 'orange',
    description: '정부 정책자금 활용한 사업 확장 및 투자',
    effect: '자금 조달 성공률 95%',
    duration: '2-6개월',
    roi: '200-800%',
    link: '/services/policy-funding'
  },
  '기술사업화': {
    icon: Rocket,
    color: 'green',
    description: '기술 기반 사업화 및 창업 지원',
    effect: '평균 5억원 자금 확보',
    duration: '6-12개월',
    roi: '500-2000%',
    link: '/services/tech-startup'
  },
  '인증지원': {
    icon: Award,
    color: 'red',
    description: '벤처/이노비즈/ISO 등 각종 인증 취득',
    effect: '연간 5,000만원 세제혜택',
    duration: '3-6개월',
    roi: '200-600%',
    link: '/services/certification'
  },
  '웹사이트 구축': {
    icon: Globe,
    color: 'cyan',
    description: 'SEO 최적화 웹사이트 구축으로 온라인 마케팅 강화',
    effect: '온라인 매출 30-50% 증대',
    duration: '2-4개월',
    roi: '150-400%',
    link: '/services/website'
  }
};

export default function FAQPage() {
  const [selectedPersona, setSelectedPersona] = useState('growth');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPersona = faqData[selectedPersona as keyof typeof faqData];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 
                          text-blue-700 rounded-full font-semibold text-sm mb-6">
            <MessageCircle className="w-4 h-4" />
            <span>실제 컨설팅 사례 기반 Q&A</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              M-CENTER
            </span>
            <br />
            고객지원 Q&A
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            25년 전문가 경험으로 답변하는 실제 컨설팅 사례<br />
            페르소나별 맞춤형 질문으로 6개 서비스를 자연스럽게 소개합니다
          </p>
        </div>

        {/* 페르소나 선택 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {Object.entries(faqData).map(([key, persona]) => {
            const Icon = persona.icon;
            const isSelected = selectedPersona === key;
            
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedPersona(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(persona.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-gray-900">
                        {persona.title}
                      </CardTitle>
                      <p className="text-xs text-gray-600 mt-1">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* 선택된 페르소나의 질문들 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 질문 목록 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <currentPersona.icon className="w-6 h-6 text-blue-600" />
                  {currentPersona.title} 질문
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPersona.questions.map((faq, index) => (
                    <div key={faq.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <button
                        className="w-full text-left"
                        onClick={() => setSelectedQuestion(selectedQuestion === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-1">
                            Q{index + 1}
                          </Badge>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {faq.question}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Badge className={getColorClasses('blue')}>
                                {faq.primaryService}
                              </Badge>
                              <ChevronRight className="w-4 h-4" />
                              <span>연관 서비스: {faq.relatedServices.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                      
                      {selectedQuestion === faq.id && (
                        <div className="mt-6 pt-6 border-t">
                          <div className="prose max-w-none">
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-blue-900">이후경 경영지도사 답변</span>
                              </div>
                              <div className="text-gray-700 whitespace-pre-line">
                                {faq.answer}
                              </div>
                            </div>
                            
                            {/* 연관 질문 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                💡 더 궁금한 점이 있으시다면:
                              </h4>
                              <div className="space-y-2">
                                {faq.nextQuestions.map((nextQ, idx) => (
                                  <button
                                    key={idx}
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                    onClick={() => {
                                      // 연관 질문 클릭 시 해당 질문으로 이동하는 로직
                                      console.log('연관 질문 클릭:', nextQ);
                                    }}
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    {nextQ}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* 상담 신청 버튼 */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold mb-1">전문가 직접 상담</h4>
                                  <p className="text-sm opacity-90">24시간 내 전문가가 연락드립니다</p>
                                </div>
                                <Button 
                                  onClick={handleConsultation}
                                  className="bg-white text-blue-600 hover:bg-gray-100"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  상담 신청
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 서비스 정보 사이드바 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  6대 핵심 서비스
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(serviceDetails).map(([serviceName, service]) => {
                    const Icon = service.icon;
                    return (
                      <div key={serviceName} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${getColorClasses(service.color)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-semibold text-sm">{serviceName}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-600 font-semibold">{service.effect}</span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              if (serviceName === 'BM ZEN 사업분석') {
                                window.open('/images/bmzwn_CASE.PDF', '_blank');
                              } else if (serviceName === 'AI 생산성향상') {
                                window.open('/images/AI_INNOVATION.pdf', '_blank');
                              } else if (serviceName === '정책자금') {
                                window.open('/images/관광개발시설과튼튼론자금사례.pdf', '_blank');
                              } else {
                                window.location.href = service.link;
                              }
                            }}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                                                         {serviceName === 'BM ZEN 사업분석' || serviceName === 'AI 생산성향상' || serviceName === '정책자금' ? '사례공유' : '자세히'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 즉시 상담 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  즉시 상담 가능
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      25년 전문가가 직접 답변해드립니다
                    </p>
                    <Button 
                      onClick={handleConsultation}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      상담 신청
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>📞 전화: 010-9251-9743</p>
                    <p>📧 이메일: hongik423@gmail.com</p>
                    <p>🕐 상담시간: 평일 09:00-18:00</p>
                    <p>🚨 긴급상담: 24시간 가능</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 무료 혜택 */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <Shield className="w-5 h-5" />
                  무료 혜택
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>무료 기업진단 (30만원 상당)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>맞춤형 성장전략 (50만원 상당)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>정부지원 프로그램 안내</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>성과 보장 약속서 제공</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 