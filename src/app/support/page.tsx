'use client';

import Header from '@/components/layout/header';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  HelpCircle, 
  FileText,
  Download,
  Video
} from 'lucide-react';

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
        a: 'AI 생산성향상(100% 지원), 기술창업(평균 5억원), 벤처확인 등 다양한 정부지원 프로그램과 연계되어 있습니다.'
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

const supportResources = [
  {
    title: '서비스 가이드북',
    description: '6대 핵심서비스 상세 안내서',
    icon: FileText,
    type: 'PDF',
    size: '2.5MB'
  },
  {
    title: 'AI 활용 매뉴얼',
    description: '기업용 AI 도구 활용 가이드',
    icon: FileText,
    type: 'PDF',
    size: '3.2MB'
  },
  {
    title: '정부지원 신청 가이드',
    description: '정부지원 프로그램 신청 방법',
    icon: FileText,
    type: 'PDF',
    size: '1.8MB'
  },
  {
    title: '온라인 세미나 영상',
    description: 'BM ZEN 프레임워크 소개',
    icon: Video,
    type: 'Video',
    size: '45분'
  }
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              고객지원
            </h1>
            <p className="text-xl text-gray-600">
              언제든지 도움이 필요하시면 연락주세요. 최선을 다해 지원해드리겠습니다.
            </p>
          </div>

          {/* 연락처 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="p-8">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">전화 상담</h3>
                <p className="text-gray-600 mb-4">
                  1588-0000<br />
                  평일 09:00 - 18:00
                </p>
                <Button className="w-full">
                  전화 걸기
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">이메일 문의</h3>
                <p className="text-gray-600 mb-4">
                  info@m-center.co.kr<br />
                  24시간 접수
                </p>
                <Button className="w-full">
                  이메일 보내기
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">온라인 채팅</h3>
                <p className="text-gray-600 mb-4">
                  실시간 채팅 상담<br />
                  평일 09:00 - 18:00
                </p>
                <Button className="w-full">
                  채팅 시작
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 운영시간 */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">운영시간</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">일반 상담</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>평일</span>
                      <span>09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>토요일</span>
                      <span>10:00 - 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>일요일/공휴일</span>
                      <span>휴무</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">긴급 지원</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>기술 지원</span>
                      <span>24시간 (이메일)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>시스템 장애</span>
                      <span>24시간 (전화)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>응급 상담</span>
                      <span>평일 연장 가능</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 자주 묻는 질문 */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <HelpCircle className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">자주 묻는 질문</h2>
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

          {/* 지원 자료실 */}
          <div>
            <div className="flex items-center mb-8">
              <Download className="w-6 h-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">지원 자료실</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportResources.map((resource, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 text-center">
                    <resource.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-4">
                      {resource.type} • {resource.size}
                    </div>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 추가 지원 요청 */}
          <div className="mt-16 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              원하는 답변을 찾지 못하셨나요?
            </h2>
            <p className="text-gray-600 mb-6">
              전문 상담원이 직접 도와드리겠습니다. 언제든지 연락주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3">
                <Phone className="w-4 h-4 mr-2" />
                즉시 전화 상담
              </Button>
              <Button variant="outline" className="px-6 py-3">
                <Mail className="w-4 h-4 mr-2" />
                문의 이메일 보내기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 