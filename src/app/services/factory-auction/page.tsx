'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FloatingChatbot from '@/components/layout/floating-chatbot';
import { 
  Factory, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Building,
  Calculator,
  FileText,
  Users,
  Target,
  Award,
  BarChart3
} from 'lucide-react';

// 핵심 가치 제안 데이터
const coreValues = [
  {
    icon: TrendingDown,
    title: '비용 절감',
    value: '시장가 대비 평균 40% 절약',
    description: '경매를 통한 스마트 투자로 최대 60% 절약 사례 보유'
  },
  {
    icon: DollarSign,
    title: '자금 효율성',
    value: '정책자금 활용으로 자기자본 30% 수준',
    description: '정책자금 100% 활용으로 자기자본 부담 최소화'
  },
  {
    icon: Award,
    title: '세제 혜택',
    value: '연간 2,000만원~5,000만원 절세 효과',
    description: '취득세 감면, 투자세액공제, 감가상각 최적화'
  },
  {
    icon: Clock,
    title: '투자 회수',
    value: '평균 3.2년',
    description: '업종별 차이 있으나 빠른 투자 회수 실현'
  }
];

// 타겟 고객 데이터
const targetCustomers = [
  {
    title: '임대 공장 사용 중인 제조업체',
    subtitle: '매출 10억~100억',
    description: '월 임대료 500만원 이상 지출 기업',
    icon: Factory
  },
  {
    title: '확장 계획이 있는 성장 기업',
    subtitle: '사업 확장 준비',
    description: '생산량 증대 및 시설 확충 필요 기업',
    icon: TrendingDown
  },
  {
    title: '자가 공장 보유 희망 기업',
    subtitle: '안정성 확보',
    description: '임대료 부담 해소 및 자산 확보 희망',
    icon: Building
  },
  {
    title: '정책자금 활용 가능 기업',
    subtitle: '자금 조달 최적화',
    description: '신용등급 양호 및 사업 전망 밝은 기업',
    icon: Shield
  }
];

// 경영지도센터 역할 데이터
const advisorRoles = [
  {
    title: '입지분석',
    description: '최적 공장 위치 선정을 위한 종합적 입지 분석',
    tasks: ['교통 접근성 분석', '주변 인프라 현황 조사', '물류비용 최적화 방안', '향후 개발계획 검토']
  },
  {
    title: '손익분기점분석 자문',
    description: '투자 대비 수익성 분석 및 손익분기점 산정',
    tasks: ['월간/연간 고정비 분석', '변동비 구조 검토', '매출 목표 설정', '투자 회수 기간 산정']
  },
  {
    title: '사업타당성분석',
    description: '공장 투자의 전반적 타당성 및 위험도 평가',
    tasks: ['시장 경쟁력 분석', '재무적 타당성 검토', '리스크 요인 식별', '투자 대안 비교 분석']
  },
  {
    title: '권리분석 서비스',
    description: '경매 부동산의 법적 권리관계 종합 분석',
    tasks: ['소유권 현황 조사', '저당권/전세권 분석', '임차권 및 점유권 검토', '법적 리스크 평가']
  },
  {
    title: '경매물건 공장 검색 서비스',
    description: '산업단지외 적합한 경매 공장 물건 발굴 및 추천',
    tasks: ['경매 공고 정보 모니터링', '업종별 적합성 검토', '투자 조건 매칭', '우선 추천 물건 선별']
  },
  {
    title: '경매 참여 전략 컨설팅',
    description: '성공적인 경매 참여를 위한 실무 전략',
    tasks: ['낙찰 전략 수립', '보증금 준비 계획', '경매 참여 방법 가이드', '경쟁 입찰 대응 전략']
  },
  {
    title: '자금조달 컨설팅',
    description: '공장 구매를 위한 최적 자금 조달 방안',
    tasks: ['정책자금 신청 지원', '은행 대출 조건 협상', '투자 유치 전략', '자금 구조 최적화']
  },
  {
    title: '세무 최적화 컨설팅',
    description: '공장 취득 및 운영 관련 세무 절약 전략',
    tasks: ['취득세 감면 신청', '투자세액공제 활용', '감가상각 최적화', '법인세 절약 방안']
  },
  {
    title: '인허가 및 용도변경 컨설팅',
    description: '공장 운영을 위한 필수 인허가 및 용도변경 지원',
    tasks: ['사업자등록 및 각종 신고', '용도변경 허가 신청', '환경 관련 인허가', '건축 관련 승인 절차']
  }
];

// 수익 모델 데이터
const revenueModel = [
  { item: '입지분석 컨설팅', description: '최적 공장 위치 선정을 위한 종합적 분석' },
  { item: '손익분기점분석', description: '투자 대비 수익성 분석 및 손익분기점 산정' },
  { item: '사업타당성분석', description: '공장 투자의 전반적 타당성 및 위험도 평가' },
  { item: '권리분석 서비스', description: '소유권, 저당권, 임차권 등 법적 권리관계 종합 분석' },
  { item: '경매물건 공장 검색 서비스', description: '산업단지외 적합한 경매 공장 물건 발굴 및 추천' },
  { item: '경매 참여 전략 컨설팅', description: '낙찰 전략, 보증금 준비, 경매 참여 방법 등 실무 가이드' },
  { item: '자금조달 컨설팅', description: '정책자금, 은행 대출, 투자 유치 등 최적 자금 조달 방안' },
  { item: '세무 최적화 컨설팅', description: '취득세 감면, 투자세액공제, 감가상각 등 세무 전략' },
  { item: '인허가 및 용도변경 컨설팅', description: '공장 운영 필요 인허가, 용도변경 절차 및 승인 지원' },
  { item: '종합 컨설팅 패키지', description: '9개 분야 전문 컨설팅 통합 서비스 제공' }
];

// 프로세스 단계 데이터
const processSteps = [
  {
    phase: 'Phase 1',
    title: '고객 발굴 및 진단',
    duration: '1주',
    tasks: [
      '기존 고객사 중 적합 업체 선별',
      '24개 항목 진단 실시',
      '재무제표 기반 투자 역량 분석',
      '세제혜택 시뮬레이션 제공',
      '1차 상담 및 서비스 제안'
    ]
  },
  {
    phase: 'Phase 2',
    title: '투자 전략 수립',
    duration: '2주',
    tasks: [
      '최적 투자 규모 산정',
      '정책자금 신청서 작성 지원',
      '세제혜택 최적화 계획',
      '투자 구조 설계 (개인 vs 법인)',
      '예상 절세 효과 계산서 작성'
    ]
  },
  {
    phase: 'Phase 3',
    title: '실행 및 사후관리',
    duration: '4주~',
    tasks: [
      '정책자금 신청 및 승인 지원',
      '경매 참여 전략 수립',
      '취득세 신고 및 감면 신청',
      '등기 이전 및 각종 신고',
      '운영 개시 후 세무 관리'
    ]
  }
];

// 성공 사례 데이터
const successCase = {
  company: '자동차부품 제조업 A사',
  investment: {
    existing: '월 1,000만원 (연 1.2억원)',
    scale: '15억원 (낙찰가 12억원)',
    capital: '자기자본 3억원, 정책자금 9억원'
  },
  results: {
    savings: '임대료 절약 3.6억원',
    tax: '세제혜택 1.8억원',
    asset: '자산가치 상승 3억원',
    total: '총 효과 8.4억원'
  },
  advisorRevenue: {
    consulting: '교통 접근성 및 인프라 분석',
    tax: '투자 회수 기간 3.2년 산정',
    policy: '재무적 타당성 검증 완료',
    rights: '법적 리스크 없음 확인',
    search: '최적 경매물건 발굴 완료',
    auction: '경매 낙찰 전략 수립 완료',
    funding: '정책자금 5억원 조달 성공',
    tax_opt: '연간 2,000만원 절세 효과',
    permit: '모든 인허가 승인 완료',
    total: '9개 영역 종합 분석 완료'
  }
};

export default function FactoryAuctionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Factory className="w-4 h-4 mr-2" />
              경영지도센터 컨설팅 서비스
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              경매활용 공장구매<br />
              <span className="text-gradient">컨설팅 가이드</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              "중소기업 대표님, 공장 임대료 연간 1억 절약하며 자가 공장 확보하세요!"<br />
              시장가 대비 평균 40% 절약으로 자금 효율성 극대화
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary text-lg px-8 py-4">
                <Calculator className="mr-2 w-5 h-5" />
                ROI 계산하기
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4">
                <Phone className="mr-2 w-5 h-5" />
                전문가 상담
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 제안 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              핵심 효과
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              경매를 통한 공장 매입의 전략적 의미와 핵심 가치
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {value.value}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 타겟 고객 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              최적 고객군
            </h2>
            <p className="text-xl text-gray-600">
              경영지도센터가 지원하는 이상적인 고객 프로필
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {targetCustomers.map((customer, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <customer.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {customer.title}
                      </h3>
                      <div className="text-orange-600 font-semibold mb-2">
                        {customer.subtitle}
                      </div>
                      <p className="text-gray-600">
                        {customer.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 세무사 역할과 수익모델 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              경영지도센터의 역할
            </h2>
            <p className="text-xl text-gray-600">
              전문적인 분석과 컨설팅으로 최적의 투자결정 지원
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 주요 역할 */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">핵심 컨설팅 영역 (9가지)</h3>
              <div className="space-y-6">
                {advisorRoles.map((role, index) => (
                  <Card key={index} className="card-hover">
                    <CardContent className="p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {role.title}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {role.description}
                      </p>
                      <ul className="space-y-2">
                        {role.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 수익 구조 */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">컨설팅 서비스</h3>
              <Card className="card-hover mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {revenueModel.map((item, index) => (
                      <div key={index} className="py-3 border-b border-gray-100 last:border-b-0">
                        <div className="font-semibold text-gray-900 mb-2">
                          {item.item}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* 단계별 프로세스 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              단계별 프로세스 가이드
            </h2>
            <p className="text-xl text-gray-600">
              경영지도센터가 수행하는 단계별 컨설팅 프로세스
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {step.phase}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {step.duration}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {step.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              성공 사례 및 수익 시뮬레이션
            </h2>
            <p className="text-xl text-gray-600">
              실제 성공 사례를 통한 구체적인 수익 분석
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="card-hover shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Case Study: {successCase.company}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* 투자 개요 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">투자 개요</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-600">기존 임대료</div>
                        <div className="font-semibold">{successCase.investment.existing}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">투자 규모</div>
                        <div className="font-semibold">{successCase.investment.scale}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">자금 구조</div>
                        <div className="font-semibold">{successCase.investment.capital}</div>
                      </div>
                    </div>
                  </div>

                  {/* 3년간 성과 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">3년간 성과</h4>
                    <div className="space-y-3">
                      {Object.entries(successCase.results).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm text-gray-600">
                            {key === 'savings' && '임대료 절약'}
                            {key === 'tax' && '세제혜택'}
                            {key === 'asset' && '자산가치 상승'}
                            {key === 'total' && '총 효과'}
                          </div>
                          <div className={`font-semibold ${key === 'total' ? 'text-lg text-orange-600' : ''}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 세무사 수익 */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">경영지도센터 컨설팅 비용</h4>
                    <div className="space-y-3">
                      {Object.entries(successCase.advisorRevenue).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-sm text-gray-600">
                            {key === 'consulting' && '입지분석 컨설팅'}
                            {key === 'tax' && '손익분기점분석'}
                            {key === 'policy' && '사업타당성분석'}
                            {key === 'rights' && '권리분석 서비스'}
                            {key === 'search' && '경매물건 검색 서비스'}
                            {key === 'auction' && '경매 참여 전략'}
                            {key === 'funding' && '자금조달 컨설팅'}
                            {key === 'tax_opt' && '세무 최적화'}
                            {key === 'permit' && '인허가 및 용도변경'}
                            {key === 'total' && '종합 컨설팅 서비스'}
                          </div>
                          <div className={`font-semibold ${key === 'total' ? 'text-lg text-orange-600' : ''}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 파트너 지원 센터 */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              경영지도센터 문의처
            </h2>
            <p className="text-xl mb-8 opacity-90">
              전문 컨설턴트가 귀하의 성공적인 공장 투자를 함께합니다
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-4" />
                <div className="font-semibold">담당자</div>
                <div>이후경 책임컨설턴트</div>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-4" />
                <div className="font-semibold">직통전화</div>
                <div>010-9251-9743</div>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <div className="font-semibold">이메일</div>
                <div>hongik423@gmail.com</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('tel:010-9251-9743')}
              >
                <Phone className="mr-2 w-5 h-5" />
                전화 상담 신청
              </Button>
              <Button 
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                onClick={() => window.open('mailto:hongik423@gmail.com')}
              >
                <Mail className="mr-2 w-5 h-5" />
                이메일 문의
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* 플로팅 챗봇 */}
      <FloatingChatbot />
    </div>
  );
} 