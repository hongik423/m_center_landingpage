'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  DollarSign,
  Clock,
  Shield,
  BookOpen,
  Award,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  views: number;
  helpful: number;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '전체', icon: <HelpCircle className="h-4 w-4" /> },
    { id: 'certification', label: '인증절차', icon: <FileQuestion className="h-4 w-4" /> },
    { id: 'cost', label: '비용', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'period', label: '기간', icon: <Clock className="h-4 w-4" /> },
    { id: 'requirements', label: '요구사항', icon: <Shield className="h-4 w-4" /> },
    { id: 'education', label: '교육', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'other', label: '기타', icon: <Award className="h-4 w-4" /> }
  ];

  const faqs: FAQItem[] = [
    // 인증절차 관련
    {
      id: '1',
      category: 'certification',
      question: 'ESG 경영시스템 인증을 받으려면 어떤 절차를 거쳐야 하나요?',
      answer: `ESG 경영시스템 인증 절차는 다음과 같습니다:

1. 인증 신청: 온라인 또는 서면으로 인증 신청서를 제출합니다.
2. 계약 체결: 심사 범위와 비용을 확정하고 계약을 체결합니다.
3. 1단계 심사(문서심사): 경영시스템 문서의 적합성을 검토합니다.
4. 2단계 심사(현장심사): 현장에서 실제 운영 상태를 확인합니다.
5. 시정조치: 부적합 사항이 있을 경우 시정조치를 실시합니다.
6. 인증 결정: 심사 결과를 검토하여 인증 여부를 결정합니다.
7. 인증서 발급: 인증이 승인되면 3년 유효기간의 인증서를 발급합니다.`,
      views: 342,
      helpful: 89
    },
    {
      id: '2',
      category: 'certification',
      question: '인증 심사는 얼마나 자주 받아야 하나요?',
      answer: `인증 심사는 다음과 같은 주기로 실시됩니다:

- 최초 인증 심사: 인증을 처음 받을 때
- 사후관리 심사: 매년 1회 (인증 후 1년, 2년차)
- 갱신 심사: 3년마다 (인증서 만료 전)

사후관리 심사는 인증 요구사항이 지속적으로 충족되고 있는지 확인하는 과정이며,
갱신 심사는 전체 시스템을 재평가하여 인증을 갱신하는 과정입니다.`,
      views: 256,
      helpful: 67
    },
    {
      id: '3',
      category: 'certification',
      question: '온라인 심사도 가능한가요?',
      answer: `네, 가능합니다. ESG 인증원은 온라인 심사 시스템을 운영하고 있습니다.

온라인 심사가 가능한 경우:
- 문서 심사 (1단계 심사)
- 코로나19 등 특수 상황
- 해외 사업장 심사
- 사후관리 심사 중 일부

단, 최초 인증의 2단계 심사(현장심사)는 원칙적으로 현장 방문이 필요하며,
온라인 심사 가능 여부는 사전에 협의가 필요합니다.`,
      views: 189,
      helpful: 45
    },

    // 비용 관련
    {
      id: '4',
      category: 'cost',
      question: '인증 심사 비용은 어떻게 산정되나요?',
      answer: `인증 심사 비용은 다음 요소들을 고려하여 산정됩니다:

1. 기업 규모 (종업원 수)
2. 사업장 수 및 위치
3. 인증 범위 (적용 부서/프로세스)
4. 업종의 복잡성
5. 통합 심사 여부 (ISO 9001, 14001, 45001 등)

기본 심사비는 종업원 수에 따라 결정되며, 추가 요소에 따라 조정됩니다.
정확한 견적은 신청서 검토 후 제공됩니다.

참고로 정부 지원사업을 통해 인증 비용의 일부를 지원받을 수 있습니다.`,
      views: 423,
      helpful: 112
    },
    {
      id: '5',
      category: 'cost',
      question: '인증 비용 외에 추가로 발생하는 비용이 있나요?',
      answer: `인증 심사비 외에 발생할 수 있는 비용은 다음과 같습니다:

필수 비용:
- 연간 사후관리 심사비 (매년)
- 3년 후 갱신 심사비

선택적 비용:
- 컨설팅 비용 (필요시)
- 내부심사원 교육비
- 인증 마크 사용료 (선택사항)
- 출장비 (원거리 사업장의 경우)

추가 비용이 발생할 수 있는 경우:
- 부적합 사항에 대한 추가 확인 심사
- 인증 범위 확대 심사
- 중대한 변경사항 발생 시 특별 심사`,
      views: 198,
      helpful: 52
    },

    // 기간 관련
    {
      id: '6',
      category: 'period',
      question: '인증을 받는데 얼마나 걸리나요?',
      answer: `일반적인 인증 취득 기간은 다음과 같습니다:

전체 소요 기간: 약 2-3개월

세부 일정:
1. 신청서 검토 및 계약: 1주일
2. 1단계 심사(문서심사): 1-2주
3. 문서 보완 기간: 2-4주 (필요시)
4. 2단계 심사(현장심사): 1-3일
5. 시정조치 기간: 2-4주 (부적합 발생시)
6. 인증 결정 및 발급: 1-2주

기업의 준비 상태와 시스템 구축 정도에 따라 기간은 단축되거나 연장될 수 있습니다.`,
      views: 367,
      helpful: 94
    },
    {
      id: '7',
      category: 'period',
      question: '인증서의 유효기간은 얼마나 되나요?',
      answer: `ESG 경영시스템 인증서의 유효기간은 3년입니다.

유효기간 관리:
- 발급일로부터 3년간 유효
- 매년 사후관리 심사를 통해 유효성 유지
- 만료 3개월 전 갱신 심사 실시 권장
- 갱신 심사 통과 시 새로운 3년 인증서 발급

주의사항:
- 사후관리 심사를 받지 않으면 인증이 정지될 수 있습니다
- 중대한 변경사항 발생 시 즉시 인증기관에 통보해야 합니다`,
      views: 234,
      helpful: 61
    },

    // 요구사항 관련
    {
      id: '8',
      category: 'requirements',
      question: 'ESG 경영시스템 인증을 받기 위한 필수 요구사항은 무엇인가요?',
      answer: `ESG 경영시스템 인증의 주요 요구사항은 다음과 같습니다:

환경(E) 영역:
- 환경 방침 및 목표 수립
- 환경 영향 평가 및 관리
- 에너지 및 자원 사용 모니터링
- 폐기물 관리 체계

사회(S) 영역:
- 인권 정책 및 실행
- 안전보건 관리 체계
- 공급망 관리
- 지역사회 공헌 활동

지배구조(G) 영역:
- 윤리경영 체계
- 이사회 구성 및 운영
- 리스크 관리 체계
- 정보 공개 및 투명성

모든 영역에서 PDCA(Plan-Do-Check-Act) 사이클에 따른 지속적 개선이 요구됩니다.`,
      views: 412,
      helpful: 108
    },
    {
      id: '9',
      category: 'requirements',
      question: '중소기업도 ESG 인증을 받을 수 있나요?',
      answer: `네, 물론 가능합니다. ESG 인증원은 중소기업을 위한 맞춤형 지원을 제공합니다.

중소기업 지원 사항:
- 기업 규모에 맞는 간소화된 요구사항 적용
- 단계별 인증 접근법 제공
- 중소기업 할인 혜택
- 정부 지원사업 연계 안내

중소기업의 장점:
- 빠른 의사결정으로 신속한 시스템 구축 가능
- 변화에 대한 유연한 대응
- 전 직원의 참여가 용이

많은 중소기업들이 ESG 인증을 통해 대기업과의 거래 기회를 확대하고 있습니다.`,
      views: 389,
      helpful: 101
    },

    // 교육 관련
    {
      id: '10',
      category: 'education',
      question: '내부심사원 교육은 필수인가요?',
      answer: `내부심사원 양성은 ESG 경영시스템 운영의 필수 요구사항입니다.

내부심사원의 역할:
- 연 1회 이상 내부심사 실시
- 시스템의 적합성 및 효과성 평가
- 개선 기회 발굴

교육 내용:
- ESG 경영시스템 요구사항 이해
- 심사 기법 및 방법론
- 부적합 보고서 작성
- 실습 및 사례 연구

ESG 인증원 교육 과정:
- 기간: 3일 (21시간)
- 수료 기준: 출석률 80% 이상, 평가 시험 통과
- 수료증 발급`,
      views: 276,
      helpful: 72
    },
    {
      id: '11',
      category: 'education',
      question: '교육은 온라인으로도 받을 수 있나요?',
      answer: `네, 온라인 교육도 제공하고 있습니다.

온라인 교육 과정:
- 실시간 화상 교육 (Zoom 활용)
- 녹화 강의 + 실시간 Q&A 세션
- 온라인 평가 및 과제

온라인 교육의 장점:
- 시간과 장소의 제약 없음
- 교육 비용 절감 (출장비 등)
- 반복 학습 가능 (녹화 제공)

오프라인 교육이 필요한 경우:
- 실습이 중요한 과정
- 네트워킹이 필요한 경우
- 집중 학습을 원하는 경우

교육 효과는 온/오프라인 모두 동일하게 인정됩니다.`,
      views: 167,
      helpful: 43
    },

    // 기타
    {
      id: '12',
      category: 'other',
      question: '인증을 받으면 어떤 혜택이 있나요?',
      answer: `ESG 인증 취득 시 다양한 혜택이 있습니다:

비즈니스 혜택:
- 대기업 협력사 등록 시 가점
- 공공기관 입찰 시 우대
- 투자 유치 시 유리
- 수출 시 바이어 신뢰도 향상

정부 지원:
- 각종 정책자금 우대
- R&D 과제 선정 시 가점
- 세제 혜택 (일부 지자체)

내부 개선 효과:
- 체계적인 경영시스템 구축
- 리스크 관리 능력 향상
- 직원 만족도 및 생산성 향상
- 비용 절감 (에너지, 폐기물 등)

브랜드 가치:
- 기업 이미지 제고
- 고객 신뢰도 향상`,
      views: 456,
      helpful: 119
    },
    {
      id: '13',
      category: 'other',
      question: '다른 인증(ISO 9001 등)을 보유하고 있으면 심사가 간소화되나요?',
      answer: `네, 기존 인증 보유 시 통합심사를 통해 효율적인 심사가 가능합니다.

통합심사의 장점:
- 심사 일수 단축 (최대 30% 절감)
- 심사 비용 절감
- 중복 문서 최소화
- 일관된 경영시스템 구축

통합 가능한 인증:
- ISO 9001 (품질경영시스템)
- ISO 14001 (환경경영시스템)
- ISO 45001 (안전보건경영시스템)
- ISO 50001 (에너지경영시스템)

특히 ISO 14001과 45001은 ESG의 E(환경)와 S(사회) 영역과 직접적으로 연계되어
시너지 효과가 큽니다.`,
      views: 234,
      helpful: 61
    }
  ];

  // 검색 및 카테고리 필터링
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 카테고리별 FAQ 수 계산
  const categoryCounts = categories.reduce((acc, category) => {
    if (category.id === 'all') {
      acc[category.id] = faqs.length;
    } else {
      acc[category.id] = faqs.filter(faq => faq.category === category.id).length;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              자주 묻는 질문
            </h1>
            <p className="text-xl text-gray-100">
              ESG 인증에 대해 궁금하신 점을 찾아보세요
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="질문을 검색해보세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-6 text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>카테고리</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className="flex items-center">
                            {category.icon}
                            <span className="ml-3">{category.label}</span>
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {categoryCounts[category.id]}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      추가 문의
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      찾으시는 답변이 없으신가요?
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>전화:</strong> 02-588-5114
                      </p>
                      <p className="text-sm">
                        <strong>이메일:</strong> info@esgrr.co.kr
                      </p>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      1:1 문의하기
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ List */}
              <div className="lg:col-span-3">
                {filteredFAQs.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">검색 결과가 없습니다.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        다른 키워드로 검색해보세요.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <Card key={faq.id}>
                        <AccordionItem value={faq.id} className="border-0">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-start text-left">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {faq.question}
                                </h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      {categories.find(c => c.id === faq.category)?.label}
                                    </Badge>
                                  </span>
                                  <span>조회 {faq.views}</span>
                                  <span>도움됨 {faq.helpful}</span>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="prose max-w-none">
                              <pre className="whitespace-pre-wrap font-sans text-gray-700 text-sm leading-relaxed">
                                {faq.answer}
                              </pre>
                            </div>
                            <div className="mt-6 pt-4 border-t flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                이 답변이 도움이 되셨나요?
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  👍 도움됨
                                </Button>
                                <Button variant="outline" size="sm">
                                  👎 도움안됨
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 