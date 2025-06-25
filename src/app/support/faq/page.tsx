'use client';

import Header from '@/components/layout/header';

import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const faqData = [
  {
    category: '서비스 일반',
    questions: [
      {
        q: 'BM ZEN 사업분석은 어떤 서비스인가요?',
        a: 'Business Model Zen은 기업의 5단계 성장 프레임워크를 통해 체계적인 사업분석과 성장 전략을 제공하는 서비스입니다.'
      },
      {
        q: '무료 진단은 어떻게 진행되나요?',
        a: '온라인 설문지 작성 후 15분 내에 AI 기반 진단 결과를 제공하며, 필요시 전문가 상담으로 연결됩니다.'
      },
      {
        q: '서비스 비용은 어떻게 되나요?',
        a: '서비스별로 상이하며, 무료 상담을 통해 정확한 견적을 제공해드립니다. 정부지원 프로그램도 활용 가능합니다.'
      }
    ]
  },
  {
    category: '정부지원',
    questions: [
      {
        q: '정부지원 프로그램에는 어떤 것들이 있나요?',
        a: 'AI 생산성향상(100% 지원), 기술창업(평균 5억원), 벤처인증 등 다양한 정부지원 프로그램과 연계되어 있습니다.'
      },
      {
        q: '정부지원 신청 자격은 어떻게 확인하나요?',
        a: '기업 규모, 업종, 설립 연차 등에 따라 자격이 상이합니다. 무료 상담을 통해 맞춤형 지원 프로그램을 안내해드립니다.'
      }
    ]
  },
  {
    category: '기술지원',
    questions: [
      {
        q: 'AI 도구 도입에 기술적 지원이 가능한가요?',
        a: '네, 전문 기술지원팀이 AI 도구 선정부터 도입, 교육, 사후관리까지 전 과정을 지원합니다.'
      },
      {
        q: '웹사이트 구축 후 유지보수는 어떻게 되나요?',
        a: '구축 후 1년간 무료 유지보수를 제공하며, 이후에도 합리적인 비용으로 지속적인 관리가 가능합니다.'
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              자주 묻는 질문
            </h1>
            <p className="text-xl text-gray-600">
              고객님들이 자주 문의하시는 내용을 정리했습니다.
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center mb-8">
              <HelpCircle className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">FAQ</h2>
            </div>
            
            <div className="space-y-8">
              {faqData.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-primary pl-4">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <Card key={faqIndex} className="card-hover">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Q. {faq.q}
                          </h4>
                          <p className="text-gray-600">
                            A. {faq.a}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 