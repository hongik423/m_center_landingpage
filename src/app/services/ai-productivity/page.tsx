'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import { CONSULTANT_INFO, CONTACT_INFO, COMPANY_INFO } from '@/lib/config/branding';
import { 
  Brain, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  Globe,
  Award,
  Calendar,
  Phone,
  Mail,
  Building,
  FileText,
  Lightbulb,
  Zap,
  Shield,
  Rocket,
  Quote,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// 프로그램 특징 데이터
const programFeatures = [
  {
    title: '정부 100% 지원',
    description: '20인 이상 사업장 자부담 0%',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: '20주 집중 프로그램',
    description: '4단계 체계적 컨설팅',
    icon: Clock,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: '19개 영역 통합',
    description: '근로시간부터 조직문화까지',
    icon: Target,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: '전문가 방문',
    description: '현장 맞춤형 솔루션',
    icon: Users,
    color: 'bg-orange-100 text-orange-600'
  }
];

// (주)AAA에너지관리IT기업 성과 데이터
const kevinLabResults = [
  {
    metric: '제안서 작성 시간',
    before: '40시간',
    after: '8시간',
    improvement: '80% 단축',
    color: 'text-green-600'
  },
  {
    metric: 'AI 도구 활용률',
    before: '30%',
    after: '95%',
    improvement: '65%p 향상',
    color: 'text-blue-600'
  },
  {
    metric: '업무 처리 속도',
    before: '기준점',
    after: '+150%',
    improvement: '생산성 향상',
    color: 'text-purple-600'
  },
  {
    metric: '해외 사업 대응',
    before: '3주',
    after: '3일',
    improvement: '90% 단축',
    color: 'text-orange-600'
  }
];

// 19개 영역 데이터
const nineteenAreas = [
  {
    category: '근로시간 분야',
    areas: [
      { name: '근로시간 관리방안 마련', type: '전문형', duration: '5-10주' },
      { name: '근무체계 개편 (일가정양립)', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-blue-200 bg-blue-50'
  },
  {
    category: '임금체계 분야',
    areas: [
      { name: '임금관리체계 개선', type: '전문형', duration: '5-10주' },
      { name: '임금체계 재설계', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-green-200 bg-green-50'
  },
  {
    category: '인사제도 분야',
    areas: [
      { name: '인사제도 개선', type: '전문형', duration: '5-10주' },
      { name: '인사평가제도', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-purple-200 bg-purple-50'
  },
  {
    category: '직장문화 분야',
    areas: [
      { name: '교육훈련 체계', type: '심화형', duration: '10-15주' },
      { name: '복리후생제도', type: '전문형', duration: '5-10주' }
    ],
    color: 'border-orange-200 bg-orange-50'
  },
  {
    category: '안전보건 분야',
    areas: [
      { name: '산업안전보건', type: '전문형', duration: '5-10주' },
      { name: '안전보건관리체계', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-red-200 bg-red-50'
  },
  {
    category: '조직관리 분야',
    areas: [
      { name: '조직문화 개선', type: '심화형', duration: '10-15주' },
      { name: '소통활성화', type: '전문형', duration: '5-10주' },
      { name: '직무분석', type: '전문형', duration: '5-10주' },
      { name: '업무관리체계', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-indigo-200 bg-indigo-50'
  },
  {
    category: '차별개선 분야',
    areas: [
      { name: '차별 없는 일터 조성', type: '진단형', duration: '2-4주' },
      { name: '원하청 상생협력', type: '전문형', duration: '5-10주' }
    ],
    color: 'border-pink-200 bg-pink-50'
  },
  {
    category: '공정채용 분야',
    areas: [
      { name: '채용제도 진단 및 개선', type: '전문형', duration: '5-10주' },
      { name: '채용제도 마련 및 운영', type: '심화형', duration: '10-15주' }
    ],
    color: 'border-cyan-200 bg-cyan-50'
  },
  {
    category: '장년친화 분야',
    areas: [
      { name: '장년친화 인사제도', type: '심화형/특화', duration: '10-20주' }
    ],
    color: 'border-yellow-200 bg-yellow-50'
  }
];

// 4단계 프로세스 데이터
const processSteps = [
  {
    phase: 'Phase 1',
    title: '현황 진단 및 니즈 분석',
    duration: '2주',
    activities: [
      '19개 영역별 현황 분석',
      'AI 적용 가능성 진단',
      '우선순위 설정',
      '맞춤형 계획 수립'
    ],
    color: 'bg-blue-50 border-blue-200'
  },
  {
    phase: 'Phase 2',
    title: 'AI 활용 실무 역량 강화',
    duration: '8주',
    activities: [
      '기본 AI 도구 마스터',
      '업무별 특화 AI 적용',
      '프로세스 자동화',
      '심화 적용 교육'
    ],
    color: 'bg-green-50 border-green-200'
  },
  {
    phase: 'Phase 3',
    title: '조직 및 프로세스 개선',
    duration: '8주',
    activities: [
      '전사 프로세스 재설계',
      '조직 역량 강화',
      '시스템 통합',
      '운영 체계 구축'
    ],
    color: 'bg-purple-50 border-purple-200'
  },
  {
    phase: 'Phase 4',
    title: '통합 운영 및 정착 지원',
    duration: '2주',
    activities: [
      '전체 시스템 통합 테스트',
      '성과 검증',
      '사후관리 계획',
      '지속 운영 체계'
    ],
    color: 'bg-orange-50 border-orange-200'
  }
];

// 신청 일정 데이터
const applicationSchedule = [
  {
    type: '심화형 (2개 요구사항)',
    deadline: '2025년 7월 3일 (목)',
    note: '마감 임박',
    urgent: true
  },
  {
    type: '특화형 (3개 요구사항)',
    deadline: '2025년 5월 22일 (목)',
    note: '예산 소진시 조기 마감',
    urgent: true
  },
  {
    type: '심화형 (1개 요구사항)',
    deadline: '2025년 8월 14일 (목)',
    note: '여유 있음',
    urgent: false
  },
  {
    type: '전문형',
    deadline: '2025년 8월 28일 (목)',
    note: '여유 있음',
    urgent: false
  }
];

export default function AIProductivityPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* 뒤로가기 및 브레드크럼 */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">홈</Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-primary">서비스</Link>
            <span>/</span>
            <span className="text-gray-900">AI 활용 생산성향상</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-primary mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                뒤로가기
              </Link>
            </div>
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🤖 AI 활용 일터혁신상생 지원사업
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong>전문 컨설턴트가 기업을 방문하여 19개 영역별 AI 실무 적용을 통한 일터혁신을 지원하는 정부 100% 지원 프로그램</strong>
            </p>
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">정부 지원</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">20주</div>
                  <div className="text-sm text-gray-600">집중 프로그램</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">19개</div>
                  <div className="text-sm text-gray-600">통합 영역</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">80%</div>
                  <div className="text-sm text-gray-600">업무 시간 단축</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 간소화된 AI 진단 섹션 */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ⚡ 간소화된 AI 진단으로 먼저 확인해보세요!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI 활용 일터혁신상생 지원사업 신청 전에 <strong>7개 정보만 입력하면 2-3분 내에</strong> 
              귀하의 기업 AI 활용 가능성을 분석하고 맞춤형 솔루션을 무료로 제공합니다
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* 진단 과정 안내 */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  🎯 새로운 진단 과정 (3단계)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-purple-600">1</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">7개 정보 입력</h4>
                    <p className="text-sm text-gray-600">회사명, 업종, 담당자, 직원수, 성장단계, 사업장, 고민사항</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">AI 분석 수행</h4>
                    <p className="text-sm text-gray-600">SWOT 분석, 시장 트렌드, AI 활용 가능성 매칭</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">3</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">2000자 보고서</h4>
                    <p className="text-sm text-gray-600">종합 평가, AI 활용 추천, 실행 계획</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA 버튼 */}
            <div className="text-center">
              <Button 
                onClick={() => router.push('/services/diagnosis')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 rounded-xl text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-6 h-6 mr-3" />
                ⚡ 간소화 AI 진단 시작하기
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                ⚡ 7개 정보 입력 → 2-3분 분석 → 2000자 요약 보고서 완성
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              🎯 정부지원 프로그램에 대한 더 자세한 상담이 필요하시다면
            </p>
            <Button 
              className="btn-secondary"
              onClick={() => router.push('/consultation')}
            >
              정부지원 전문가 상담 신청
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* (주)AAA에너지관리IT기업 성공 사례 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏢 검증된 성과: (주)AAA에너지관리IT기업 심층 분석
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              에너지 DX 분야 AI 기술 개발 기업 | 특허 28건, 인증 25건 보유 | 직원 15명 소수 정예 조직
            </p>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-semibold">
                💡 "인력이 부족하고 어려워서 실제 중소기업에 한계가 있다. AI를 가지고 실무에서 도입되는 기술들 활용이 필요했다."
              </p>
              <p className="text-blue-600 text-sm mt-2">- 김경학 대표 인터뷰 중</p>
            </div>
          </div>

          {/* 회사 정보 카드 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-12">
            <div className="grid md:grid-cols-5 gap-6 text-center">
              <div>
                <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">대표</div>
                <div className="text-gray-600">김경학</div>
              </div>
              <div>
                <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">사업분야</div>
                <div className="text-gray-600">에너지 DX AI 기술</div>
              </div>
              <div>
                <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">해외 사업</div>
                <div className="text-gray-600">나이지리아, 케냐 등</div>
              </div>
              <div>
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">보유 자산</div>
                <div className="text-gray-600">특허 28건, 인증 25건</div>
              </div>
              <div>
                <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">조직 특성</div>
                <div className="text-gray-600">15명 소수정예</div>
              </div>
            </div>
          </div>

          {/* 도입 전 당면 과제 */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">⚠️ 도입 전 당면 과제</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-red-800">인력 부족 과부하</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• 1인당 3-4개 업무 영역 동시 담당</li>
                    <li>• 해외 사업 확장 시 언어 장벽 발생</li>
                    <li>• 핵심 인재 의존도 높아 리스크 증가</li>
                    <li>• 야근 및 주말 근무 빈발</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-orange-800">AI 기술 활용 미흡</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li>• 28건 특허 보유하지만 내부 업무는 전통적 방식</li>
                    <li>• AI 기술 개발 역량과 실무 활용 격차</li>
                    <li>• 직원들의 AI 도구 활용률 30% 미만</li>
                    <li>• 최신 AI 트렌드 파악 및 적용 어려움</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-yellow-800">반복 업무 비효율</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• 해외 제안서 작성 1건당 40시간 소요</li>
                    <li>• 다국어 번역 및 현지화 업무 과부하</li>
                    <li>• 반복 업무 비중 60% (데이터 입력, 보고서)</li>
                    <li>• 수작업 기반 업무 프로세스</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 성과 비교 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kevinLabResults.map((result, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">{result.metric}</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Before</div>
                      <div className="font-bold text-red-600">{result.before}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">After</div>
                      <div className="font-bold text-green-600">{result.after}</div>
                    </div>
                  </div>
                  <div className={`mt-4 font-bold ${result.color}`}>
                    ✓ {result.improvement}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 직원별 AI 활용 실제 사례 */}
          <div className="mt-12 mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">👥 직원별 AI 활용 실제 사례</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Building className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-blue-800">김 대표 (CEO)</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-blue-800 mb-1">ChatGPT 활용</div>
                                      <div className="text-sm text-blue-700">• 나이지리아 바이어 대상 영문 제안서 초안 생성</div>
                <div className="text-sm text-blue-700">• 영문 제안서 작성 시간: 4시간 → 1시간</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-blue-800 mb-1">경영진 AI 활용</div>
                                      <div className="text-sm text-blue-700">• 재무 분석 및 의사결정 지원</div>
                <div className="text-sm text-blue-700">• 시장 분석 및 경쟁사 모니터링</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-purple-800">이 과장 (기술개발팀)</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-purple-800 mb-1">Claude 활용</div>
                      <div className="text-xs text-purple-700">• 경쟁사 특허 28건 자동 분석 및 요약</div>
                      <div className="text-xs text-purple-700">• 특허 분석 시간: 20시간 → 3시간</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-purple-800 mb-1">개발 AI 활용</div>
                      <div className="text-xs text-purple-700">• 코드 생성 및 디버깅 지원</div>
                      <div className="text-xs text-purple-700">• 개발 생산성 150% 향상</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-green-800">박 대리 (영업팀)</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-green-800 mb-1">Midjourney 활용</div>
                      <div className="text-xs text-green-700">• 에너지 솔루션 제품 이미지 10개 제작</div>
                      <div className="text-xs text-green-700">• 디자인 외주비: 300만원 → 0원</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-green-800 mb-1">영업 AI 활용</div>
                      <div className="text-xs text-green-700">• 맞춤형 제안 및 니즈 분석</div>
                      <div className="text-xs text-green-700">• 영업 효율성 200% 향상</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 나이지리아 프로젝트 실제 적용 사례 */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🌍 해외 사업 확장 성공 사례: 나이지리아 프로젝트</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-4">🔴 Before: 기존 방식의 한계</h4>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="font-semibold text-red-800 mb-2">시장 조사 및 제안서 작성</div>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>• 시장 조사: 8시간 (수작업 검색)</li>
                        <li>• 기술 명세 작성: 12시간</li>
                        <li>• 견적 산출: 4시간 (엑셀 계산)</li>
                        <li>• 번역 및 현지화: 16시간</li>
                        <li><strong>• 총 소요 시간: 40시간</strong></li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="font-semibold text-orange-800 mb-2">운영상의 문제점</div>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• 시차 8시간으로 실시간 소통 어려움</li>
                        <li>• 현지 법규 확인에 2주 소요</li>
                        <li>• 계약서 번역 및 검토에 1주 소요</li>
                        <li>• 프로젝트 착수까지 3주 소요</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-4">🟢 After: AI 기반 혁신 프로세스</h4>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-800 mb-2">AI 자동화 프로세스</div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• AI 시장 조사: 2시간 (ChatGPT + 웹 크롤링)</li>
                        <li>• AI 기술 명세: 3시간 (Claude + 기존 DB)</li>
                        <li>• AI 견적 산출: 1시간 (자동 계산 시스템)</li>
                        <li>• AI 번역: 2시간 (DeepL API + 검토)</li>
                        <li><strong>• 총 소요 시간: 8시간 (80% 단축)</strong></li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-800 mb-2">글로벌 업무 체계</div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• AI 번역 + 24시간 비동기 협업 시스템</li>
                        <li>• 현지 법규 AI 자동 검색 및 요약</li>
                        <li>• 다국어 계약서 자동 생성 시스템</li>
                        <li><strong>• 프로젝트 착수: 3주 → 3일</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-white/80 rounded-lg p-6">
                  <h5 className="font-bold text-lg text-gray-900 mb-4">🎯 최종 성과</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+2개국</div>
                      <div className="text-sm text-gray-600">추가 진출</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">35%</div>
                      <div className="text-sm text-gray-600">매출 증가</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">5건</div>
                      <div className="text-sm text-gray-600">신규 특허</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">85%</div>
                      <div className="text-sm text-gray-600">계약 성공률</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 주요 성과 하이라이트 */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">💎 핵심 성과 하이라이트</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">🌟 정량적 성과</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">제안서 작성 시간: 40시간 → 8시간 (80% 단축)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">업무 처리 속도: 평균 40% 향상</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">AI 도구 활용률: 30% → 95% (목표 초과 달성)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">해외 사업 대응 속도: 3주 → 3일 (90% 단축)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">직원 1인당 처리 업무량: 3배 증가</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">📊 정성적 성과</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">직원 만족도: 68점 → 89점 (21점 상승)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">업무 스트레스: 스트레스 지수 50% 감소</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">혁신 문화: AI 활용이 일상화된 조직 문화 정착</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">경쟁력: 동종 업계 대비 기술 선도 지위 확보</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">신입 직원 온보딩: 2주 → 3일로 단축</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로그램 특징 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🎯 프로그램 특징
            </h2>
            <p className="text-xl text-gray-600">
              중소기업의 현실적 고민을 해결하는 실무 중심 프로그램
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programFeatures.map((feature, index) => (
              <Card key={index} className="card-hover text-center">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4단계 프로세스 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 4단계 통합 프로세스 + 3개월 사후관리
            </h2>
            <p className="text-xl text-gray-600">
              체계적인 4단계 프로세스로 AI 일터혁신을 완성하고, 지속적인 성장을 지원합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {processSteps.map((step, index) => (
              <Card key={index} className={`${step.color} border-2 card-hover`}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {step.phase}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {step.duration}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {step.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 3개월 사후관리 상세 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🎯 3개월 사후관리 프로그램</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-green-200 bg-white/80">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-green-800">1개월차: 성과 점검</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• AI 도구 활용률 측정 및 분석</li>
                    <li>• 업무 효율성 개선 정도 평가</li>
                    <li>• 직원별 적응도 개별 점검</li>
                    <li>• 추가 교육 및 지원 필요 영역 파악</li>
                    <li>• 목표 대비 달성도 중간 평가</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-white/80">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Rocket className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-blue-800">2개월차: 고도화</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• 고급 AI 도구 및 기능 추가 도입</li>
                    <li>• 프로세스 최적화 및 자동화 확대</li>
                    <li>• 부서 간 연계 시스템 구축</li>
                    <li>• 성과 지표 실시간 모니터링 시스템</li>
                    <li>• 베스트 프랙티스 공유 및 확산</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-white/80">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-lg text-purple-800">3개월차: 자립 지원</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• 자체 운영 역량 완전 이전</li>
                    <li>• 지속적 개선 체계 구축</li>
                    <li>• 신기술 도입 가이드라인 제공</li>
                    <li>• 종합 성과 평가 및 최종 보고서</li>
                    <li>• 향후 발전 방향 로드맵 제시</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

                          {/* (주)AAA에너지관리IT기업 사후관리 실제 성과 */}
            <div className="mt-8">
                              <h4 className="font-bold text-lg text-gray-900 mb-4 text-center">📊 (주)AAA에너지관리IT기업 사후관리 실제 성과 (3개월 후)</h4>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">+2개국</div>
                  <div className="text-sm text-gray-600">나이지리아 외 추가 진출</div>
                  <div className="text-xs text-gray-500 mt-1">케냐, 가나 신규 계약</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">5건</div>
                  <div className="text-sm text-gray-600">신규 특허 출원</div>
                  <div className="text-xs text-gray-500 mt-1">AI 활용 아이디어 발굴</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">3일</div>
                  <div className="text-sm text-gray-600">신입 온보딩 시간</div>
                  <div className="text-xs text-gray-500 mt-1">기존 2주 → 3일</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">80%</div>
                  <div className="text-sm text-gray-600">혁신 아이디어 실행률</div>
                  <div className="text-xs text-gray-500 mt-1">기존 20% → 80%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문 컨설턴트 방문 프로세스 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              👨‍💼 전문 컨설턴트 방문 프로세스
            </h2>
            <p className="text-xl text-gray-600">
              AI 전문가가 직접 기업을 방문하여 맞춤형 솔루션을 제공합니다
            </p>
          </div>

          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              {/* 방문 전 준비 */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-blue-800">1단계: 사전 준비</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• 기업 현황 및 조직도 분석</li>
                    <li>• 19개 영역별 자가진단 실시</li>
                    <li>• AI 활용 우선순위 설정</li>
                    <li>• 예상 효과 및 목표 설정</li>
                    <li>• 방문 일정 및 준비사항 안내</li>
                  </ul>
                </CardContent>
              </Card>

              {/* 현장 방문 */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-green-800">2단계: 현장 진단</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• 전 직원 대상 AI 역량 진단</li>
                    <li>• 업무 프로세스 실시간 관찰</li>
                    <li>• 경영진 및 실무진 개별 인터뷰</li>
                    <li>• 기존 시스템 및 도구 분석</li>
                    <li>• 개선점 및 AI 적용 가능성 발굴</li>
                  </ul>
                </CardContent>
              </Card>

              {/* 솔루션 설계 */}
              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg text-purple-800">3단계: 맞춤 설계</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li>• 기업별 맞춤형 AI 솔루션 설계</li>
                    <li>• 단계별 도입 로드맵 작성</li>
                    <li>• 예상 효과 및 ROI 분석</li>
                    <li>• 필요 교육 및 훈련 계획</li>
                    <li>• 성과 측정 지표 설정</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 실제 방문 일정 예시 */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8">
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📅 실제 방문 일정 예시 ((주)AAA에너지관리IT기업 사례)</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">🕐 1일차: 현황 진단</h4>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">09:00-10:30 경영진 인터뷰</div>
                    <div className="text-xs text-gray-600">• 김경학 대표 1:1 심층 인터뷰<br/>• 사업 방향성 및 해외 확장 계획 논의</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">10:30-12:00 조직 현황 분석</div>
                    <div className="text-xs text-gray-600">• 15명 직원 개별 역량 진단<br/>• 현재 업무 분담 현황 파악</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">14:00-17:00 프로세스 관찰</div>
                    <div className="text-xs text-gray-600">• 제안서 작성 과정 실시간 관찰<br/>• 특허 관리 및 기술개발 프로세스 분석</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-gray-900 mb-4">🕑 2일차: 솔루션 설계</h4>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">09:00-11:00 AI 도구 시연</div>
                    <div className="text-xs text-gray-600">• ChatGPT, Claude 등 실무 적용 데모<br/>• 제안서 자동 생성 시연</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">11:00-15:00 맞춤 솔루션 설계</div>
                    <div className="text-xs text-gray-600">• 19개 영역 중 우선 적용 영역 선정<br/>• 단계별 도입 계획 수립</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm mb-1">15:00-17:00 실행 계획 확정</div>
                    <div className="text-xs text-gray-600">• 20주 프로그램 세부 일정 확정<br/>• 성과 목표 및 측정 지표 설정</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 19개 영역 상세 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📋 19개 영역 통합 AI 실무 적용
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              근로시간부터 장년친화까지, 조직 운영의 모든 영역을 AI로 혁신합니다
            </p>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-semibold">
                💡 각 영역별로 실제 업무에 바로 적용 가능한 AI 도구와 프로세스를 제공합니다
              </p>
            </div>
          </div>

          {/* 영역별 AI 적용 예시 추가 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">🔥 핵심 영역별 AI 혁신 사례</h3>
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-blue-800 mb-4">🕒 근로시간 관리 AI 혁신</h4>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-blue-800 mb-1">스마트 근태 관리</div>
                      <div className="text-xs text-blue-700">• 얼굴 인식 자동 출퇴근 체크<br/>• 실시간 근무시간 자동 계산<br/>• 초과근무 사전 알림 시스템</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-blue-800 mb-1">업무량 예측 AI</div>
                      <div className="text-xs text-blue-700">• 과거 데이터 기반 적정 근무시간 추천<br/>• 프로젝트별 소요 시간 예측<br/>• 월말 정리 시간: 8시간 → 30분</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-green-800 mb-4">💰 임금체계 AI 자동화</h4>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-green-800 mb-1">급여 계산 자동화</div>
                      <div className="text-xs text-green-700">• 근태, 성과 데이터 자동 연동<br/>• 객관적 성과 평가 알고리즘<br/>• 급여 오류 0건 달성</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-green-800 mb-1">성과 평가 AI</div>
                      <div className="text-xs text-green-700">• 업무 성과 데이터 자동 수집<br/>• 다면 평가 AI 분석<br/>• 평가 만족도: 52점 → 88점</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg text-purple-800 mb-4">🎓 교육훈련 개인화</h4>
                  <div className="space-y-3">
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-purple-800 mb-1">맞춤형 학습 AI</div>
                      <div className="text-xs text-purple-700">• 개인별 역량 갭 분석<br/>• 맞춤형 학습 콘텐츠 추천<br/>• 학습 진도 실시간 모니터링</div>
                    </div>
                    <div className="bg-white/60 p-3 rounded">
                      <div className="font-semibold text-sm text-purple-800 mb-1">스킬 매칭 시스템</div>
                      <div className="text-xs text-purple-700">• AI 기반 직무 적합성 분석<br/>• 크로스 트레이닝 최적화<br/>• 학습 효과: 기존 대비 3배 향상</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {nineteenAreas.map((category, index) => (
              <Card key={index} className={`${category.color} border-2 card-hover`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.areas.map((area, idx) => (
                      <div key={idx} className="bg-white/50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{area.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            area.type === '심화형' ? 'bg-purple-100 text-purple-700' :
                            area.type === '전문형' ? 'bg-blue-100 text-blue-700' :
                            area.type === '진단형' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {area.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          기간: {area.duration}
                        </div>
                        {/* 영역별 AI 적용 예시 추가 */}
                        {area.name.includes('근로시간') && (
                          <div className="text-xs text-gray-500">
                            ✓ AI 기반 자동 근태 관리 시스템 구축
                          </div>
                        )}
                        {area.name.includes('근무체계') && (
                          <div className="text-xs text-gray-500">
                            ✓ 유연근무제 + AI 일정 최적화 시스템
                          </div>
                        )}
                        {area.name.includes('임금') && (
                          <div className="text-xs text-gray-500">
                            ✓ AI 기반 성과 평가 및 급여 자동화
                          </div>
                        )}
                        {area.name.includes('교육훈련') && (
                          <div className="text-xs text-gray-500">
                            ✓ 개인화 AI 학습 추천 시스템
                          </div>
                        )}
                        {area.name.includes('조직문화') && (
                          <div className="text-xs text-gray-500">
                            ✓ AI 챗봇 기반 소통 플랫폼 구축
                          </div>
                        )}
                        {area.name.includes('업무관리') && (
                          <div className="text-xs text-gray-500">
                            ✓ 업무 프로세스 AI 자동화 시스템
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 신청 일정 및 방법 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📅 신청 일정 및 방법
            </h2>
            <p className="text-xl text-gray-600">
              마감 임박! 지금 바로 신청하세요
            </p>
          </div>

          {/* 신청 일정 */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">⏰ 신청 마감일</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {applicationSchedule.map((schedule, index) => (
                <Card key={index} className={`card-hover ${schedule.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{schedule.type}</h4>
                      {schedule.urgent && (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          ⚠️ 마감 임박
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-primary mb-1">
                      {schedule.deadline}
                    </div>
                    <div className="text-sm text-gray-600">
                      {schedule.note}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 신청 자격 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  📝 신청 자격
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">20인 이상 사업장 (고용보험가입자명부로 확인)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">AI 기술 실무 활용에 관심 있는 기업</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">인력 부족 해결 및 업무 효율화 필요 기업</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-gray-700">해외 사업 확장 계획이 있는 기업</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  💸 비용 및 지원
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold text-green-800">20~99인 기업</div>
                    <div className="text-2xl font-bold text-green-600">100% 정부 지원</div>
                    <div className="text-sm text-green-700">자부담 0원</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    • 컨설팅 유형: 심화형 (2개 요구사항)<br />
                    • 추가 지원: 컨설팅 완료 후 3개월 사후관리<br />
                    • 컨설팅 기간: 20주 집중 프로그램
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 신청 방법 */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🌐 신청 방법
              </h3>
              <div className="grid md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                  <h4 className="font-semibold mb-2">회원가입</h4>
                  <p className="text-sm text-gray-600">노사발전재단 홈페이지 기업회원 가입</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                  <h4 className="font-semibold mb-2">자가진단</h4>
                  <p className="text-sm text-gray-600">온라인 자가진단 실시 및 기업 현황 파악</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                  <h4 className="font-semibold mb-2">컨설팅 신청</h4>
                  <p className="text-sm text-gray-600">수행기관 '경영지도센터' 선택</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                  <h4 className="font-semibold mb-2">서류 제출</h4>
                  <p className="text-sm text-gray-600">고용보험가입자명부, 사업자등록증 제출</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
                  <h4 className="font-semibold mb-2">컨설팅 시작</h4>
                  <p className="text-sm text-gray-600">선정 발표 후 전문 컨설팅 착수</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 컨설팅 문의 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                📞 컨설팅 문의
              </h2>
              <p className="text-xl text-gray-600">
                AI 일터혁신 전문 컨설턴트가 직접 상담해드립니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 담당자 정보 */}
              <Card className="card-hover">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    👨‍💼 담당 컨설턴트
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-semibold">{CONSULTANT_INFO.name}</div>
                        <div className="text-sm text-gray-600">{COMPANY_INFO.name}</div>
                      </div>
                    </div>
                                          <div className="flex items-center">
                        <Mail className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <div className="font-semibold">hongik423@gmail.com</div>
                          <div className="text-sm text-gray-600">이메일 상담 가능</div>
                        </div>
                      </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <div className="font-semibold">hongik423@gmail.com</div>
                        <div className="text-sm text-gray-600">이메일 상담 가능</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 신청 링크 */}
              <Card className="card-hover">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    🔗 온라인 신청
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-800 mb-2">노사발전재단 홈페이지</div>
                      <div className="text-sm text-blue-600 break-all">https://www.kwpi.or.kr</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">신청 경로:</p>
                      <p className="text-sm text-gray-500">
                        사업소개 → 일터혁신 상생컨설팅 지원 → 참여하기
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="font-semibold text-yellow-800 mb-1">⚠️ 신청 시 주의사항</div>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• 기업당 2개 요구사항 이내 컨설팅 제공</li>
                        <li>• 예산 소진 시 조기 마감 가능</li>
                        <li>• 20인 이상 사업장 대상</li>
                        <li>• 컨설팅 수혜 이력 사전 확인 필요</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 추가 성공 사례 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🏆 더 많은 성공 사례
            </h2>
            <p className="text-xl text-gray-600">
              다양한 업종에서 검증된 AI 일터혁신 성과를 확인하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-blue-800">제조업 A사</h3>
                  <div className="text-sm text-blue-600">직원 45명, 자동차 부품 제조</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-blue-800">생산 계획 AI 자동화</div>
                    <div className="text-xs text-blue-700">• 생산 스케줄링 시간: 6시간 → 30분</div>
                    <div className="text-xs text-blue-700">• 재고 최적화로 보관비 30% 절감</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-blue-800">품질 관리 시스템</div>
                    <div className="text-xs text-blue-700">• AI 영상 인식 품질 검사 도입</div>
                    <div className="text-xs text-blue-700">• 불량률: 3.2% → 0.8%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-green-800">IT서비스 B사</h3>
                  <div className="text-sm text-green-600">직원 28명, 소프트웨어 개발</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-green-800">고객 지원 AI 챗봇</div>
                    <div className="text-xs text-green-700">• 1차 문의 해결률: 40% → 85%</div>
                    <div className="text-xs text-green-700">• 고객 만족도 20% 향상</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-green-800">코드 리뷰 자동화</div>
                    <div className="text-xs text-green-700">• 개발 속도 60% 향상</div>
                    <div className="text-xs text-green-700">• 버그 발생률 50% 감소</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-orange-800">유통업 C사</h3>
                  <div className="text-sm text-orange-600">직원 67명, 온라인 쇼핑몰 운영</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-orange-800">개인화 상품 추천</div>
                    <div className="text-xs text-orange-700">• 구매 전환율: 2.3% → 5.8%</div>
                    <div className="text-xs text-orange-700">• 월 매출 45% 증가</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded">
                    <div className="font-semibold text-sm text-orange-800">재고 예측 AI</div>
                    <div className="text-xs text-orange-700">• 재고 회전율 70% 개선</div>
                    <div className="text-xs text-orange-700">• 창고 운영비 25% 절감</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🚨 마감 임박! 지금 바로 신청하세요!
            </h2>
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block mb-6">
              <span className="font-bold">⚠️ 2025년 7월 3일 (목) 마감</span>
            </div>
            <p className="text-xl mb-8 opacity-90">
                              (주)AAA에너지관리IT기업처럼 AI 일터혁신으로 <strong>업무 시간 80% 단축, 매출 35% 증가</strong>를 경험하세요
            </p>
            
            {/* 프로그램 핵심 혜택 */}
            <div className="bg-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">📋 프로그램 핵심 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">💰 비용 혜택</h4>
                  <ul className="text-sm opacity-90 space-y-1">
                    <li>• 20~99인 기업: 100% 정부 지원 (자부담 0원)</li>
                    <li>• 일반적인 AI 컨설팅 비용: 5,000만원 → 0원</li>
                    <li>• 3개월 사후관리 무료 제공</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎯 예상 효과</h4>
                  <ul className="text-sm opacity-90 space-y-1">
                    <li>• 업무 효율성 평균 40-80% 향상</li>
                    <li>• AI 도구 활용률 95% 이상 달성</li>
                    <li>• 직원 만족도 20점 이상 상승</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 검증된 성과 수치 */}
            <div className="bg-white/10 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">📊 검증된 성과 ((주)AAA에너지관리IT기업 기준)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-sm opacity-90">업무 시간 단축</div>
                  <div className="text-xs opacity-70">제안서 작성: 40h→8h</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">95%</div>
                  <div className="text-sm opacity-90">AI 도구 활용률</div>
                  <div className="text-xs opacity-70">목표 90% 초과 달성</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">150%</div>
                  <div className="text-sm opacity-90">생산성 향상</div>
                  <div className="text-xs opacity-70">1인당 업무량 3배</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">35%</div>
                  <div className="text-sm opacity-90">매출 성장</div>
                  <div className="text-xs opacity-70">해외 진출 성공</div>
                </div>
              </div>
            </div>

            {/* CTA 버튼 */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg"
                  onClick={() => window.open('https://www.kwpi.or.kr', '_blank')}
                >
                  🌐 온라인 신청하기 (노사발전재단)
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 text-lg"
                  onClick={() => window.location.href = 'tel:010-9251-9743'}
                >
                  📞 전화 상담하기 (이후경 컨설턴트)
                  <Phone className="ml-2 w-5 h-5" />
                </Button>
              </div>
              
              {/* 추가 연락 방법 */}
              <div className="text-center text-sm opacity-80">
                <p>📧 이메일 상담: <strong>hongik423@gmail.com</strong></p>
                                  <p>🏢 수행기관: 경영지도센터</p>
              </div>
            </div>

            <div className="bg-yellow-400/20 rounded-lg p-4 mt-8">
              <p className="text-sm opacity-90">
                ⚠️ <strong>신청 주의사항:</strong> 기업당 2개 요구사항 이내, 예산 소진 시 조기 마감, 20인 이상 사업장 대상<br/>
                💡 <strong>신청 팁:</strong> 수행기관 선택 시 반드시 <strong>'경영지도센터'</strong>를 선택해주세요
              </p>
            </div>

            <p className="text-sm opacity-80 mt-6">
              * 본 프로그램은 고용노동부 노사발전재단 주관 일터혁신 상생컨설팅 사업의 일환으로 정부에서 100% 지원하며, 
              (주)AAA에너지관리IT기업 실제 적용 사례를 바탕으로 검증된 효과를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}