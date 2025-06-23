'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, DollarSign } from 'lucide-react';
import Link from 'next/link';

const successCases = [
  {
    id: 1,
    company: '○○제조(주)',
    industry: '제조업',
    service: 'BM ZEN 사업분석',
    challenge: '신규 사업 진출 전략 수립 필요',
    solution: 'BM ZEN 프레임워크를 통한 체계적 사업분석',
    results: [
      '신규 사업 매출 120% 증가',
      '시장 점유율 15% 확보',
      '투자비 회수기간 30% 단축'
    ],
    duration: '6개월',
    investment: '5억원',
    category: 'business-analysis'
  },
  {
    id: 2,
    company: '△△세무법인',
    industry: '전문서비스업',
    service: 'AI 활용 생산성향상',
    challenge: '업무 효율성 저하 및 고객 서비스 개선',
    solution: 'AI 도구 도입 및 업무 프로세스 최적화',
    results: [
      '업무 효율성 40% 향상',
      '고객 만족도 95% 달성',
      '직원 업무 만족도 증가'
    ],
    duration: '20주',
    investment: '3억원',
    category: 'ai-productivity'
  },
  {
    id: 3,
    company: '□□테크',
    industry: '기술기업',
    service: '기술사업화/기술창업',
    challenge: '기술 상용화 및 자금 확보',
    solution: '정부지원 연계 기술사업화 프로그램',
    results: [
      '5억원 정부 지원금 확보',
      '기술사업화 성공',
      '연매출 20억원 달성'
    ],
    duration: '12개월',
    investment: '정부지원',
    category: 'tech-startup'
  },
  {
    id: 4,
    company: '◇◇공장',
    industry: '제조업',
    service: '경매활용 공장구매',
    challenge: '생산 시설 확장을 위한 공장 부지 필요',
    solution: '경매 전문가와 함께하는 공장 구매 전략',
    results: [
      '시장가 대비 40% 절약',
      '최적 입지 공장 확보',
      '생산 능력 200% 증대'
    ],
    duration: '3개월',
    investment: '15억원',
    category: 'factory-auction'
  },
  {
    id: 5,
    company: '☆☆기업',
    industry: '서비스업',
    service: '웹사이트 구축',
    challenge: '온라인 마케팅 채널 부재',
    solution: 'AI 기반 웹사이트 및 디지털 마케팅 구축',
    results: [
      '온라인 매출 30% 증대',
      '고객 문의 50% 증가',
      '브랜드 인지도 향상'
    ],
    duration: '2개월',
    investment: '1억원',
    category: 'website'
  },
  {
    id: 6,
    company: '★★벤처',
    industry: 'IT기업',
    service: '인증지원',
    challenge: '벤처기업 인증 및 세제혜택 필요',
    solution: '벤처·이노비즈·ISO 통합 인증 지원',
    results: [
      '연간 5천만원 세제혜택',
      '정부 지원 사업 참여 자격 확보',
      '기업 신뢰도 향상'
    ],
    duration: '4개월',
    investment: '500만원',
    category: 'certification'
  }
];

const categoryColors = {
  'business-analysis': 'bg-blue-100 text-blue-800',
  'ai-productivity': 'bg-purple-100 text-purple-800',
  'factory-auction': 'bg-orange-100 text-orange-800',
  'tech-startup': 'bg-green-100 text-green-800',
  'certification': 'bg-indigo-100 text-indigo-800',
  'website': 'bg-pink-100 text-pink-800'
};

const categoryNames = {
  'business-analysis': 'BM ZEN 사업분석',
  'ai-productivity': 'AI 생산성향상',
  'factory-auction': '공장구매',
  'tech-startup': '기술창업',
  'certification': '인증지원',
  'website': '웹사이트'
};

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              성공사례
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              다양한 업종의 기업들이 M센터와 함께 이룬 성공 스토리를 확인해보세요
            </p>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">324</div>
                <div className="text-sm text-gray-600">성공 프로젝트</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-sm text-gray-600">만족한 고객</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">127억</div>
                <div className="text-sm text-gray-600">고객 절약 효과</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">94.2%</div>
                <div className="text-sm text-gray-600">고객 만족도</div>
              </CardContent>
            </Card>
          </div>

          {/* 성공사례 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successCases.map((case_) => (
              <Card key={case_.id} className="card-hover">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {case_.company}
                      </h3>
                      <p className="text-gray-600 text-sm">{case_.industry}</p>
                    </div>
                    <Badge className={categoryColors[case_.category as keyof typeof categoryColors]}>
                      {categoryNames[case_.category as keyof typeof categoryNames]}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">도전 과제</h4>
                      <p className="text-gray-600 text-sm">{case_.challenge}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">솔루션</h4>
                      <p className="text-gray-600 text-sm">{case_.solution}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">성과</h4>
                      <ul className="space-y-1">
                        {case_.results.map((result, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 pt-4 border-t">
                      <span>기간: {case_.duration}</span>
                      <span>투자: {case_.investment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA 섹션 */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              다음 성공사례의 주인공이 되어보세요
            </h2>
            <p className="text-gray-600 mb-6">
              무료 상담을 통해 귀하의 기업에 맞는 최적의 솔루션을 찾아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consultation" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-semibold inline-block">
                무료 상담 신청
              </Link>
              <Link href="/services" className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg inline-block">
                서비스 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 