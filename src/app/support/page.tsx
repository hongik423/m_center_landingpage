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
  Video,
  Bug,
  AlertTriangle,
  Youtube,
  Play,
  ArrowRight
} from 'lucide-react';
import { 
  generateServiceGuideBook, 
  generateAIManual, 
  generateTaxCalculatorManual 
} from '@/lib/utils/pdfDocumentGenerator';

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
    id: 'service-guide',
    title: '서비스 가이드북',
    description: '6대 핵심서비스 상세 안내서',
    icon: FileText,
    type: 'PDF',
    size: '2.5MB',
    downloadAction: generateServiceGuideBook
  },
  {
    id: 'ai-manual',
    title: 'AI 활용 매뉴얼',
    description: '기업용 AI 도구 활용 가이드',
    icon: FileText,
    type: 'PDF',
    size: '3.2MB',
    downloadAction: generateAIManual
  },
  {
    id: 'tax-calculator-manual',
    title: '세금계산기 사용매뉴얼',
    description: '세금계산기 완벽 활용 가이드',
    icon: FileText,
    type: 'PDF',
    size: '2.1MB',
    downloadAction: generateTaxCalculatorManual
  },

];

export default function SupportPage() {
  // PDF 다운로드 핸들러
  const handleDownload = (resource: typeof supportResources[0]) => {
    if (resource.downloadAction) {
      try {
        resource.downloadAction();
      } catch (error) {
        console.error('PDF 생성 중 오류가 발생했습니다:', error);
        alert('PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } else {
      // 비디오나 기타 파일의 경우
      alert('준비 중인 콘텐츠입니다. 곧 제공될 예정입니다.');
    }
  };
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
                  010-9251-9743<br />
                  평일 09:00 - 18:00
                </p>
                <Button className="w-full" asChild>
                  <a href="tel:010-9251-9743">전화 걸기</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">이메일 문의</h3>
                <p className="text-gray-600 mb-4">
                  hongik423@gmail.com<br />
                  24시간 접수
                </p>
                <Button className="w-full" asChild>
                  <a href="mailto:hongik423@gmail.com">이메일 보내기</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">상담 신청</h3>
                <p className="text-gray-600 mb-4">
                  전문가 상담 신청<br />
                  24시간 접수 가능
                </p>
                <Button className="w-full" asChild>
                  <a href="/consultation">상담신청</a>
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
                  
                  {/* 🚨 오류신고 버튼 */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {
                        // 세금계산기 오류신고 시스템으로 연결
                        window.open('/tax-calculator?error-report=true', '_self');
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Bug className="w-5 h-5" />
                        <span>오류신고로 연결하기</span>
                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                      </div>
                    </Button>
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-500">
                        🚨 시스템 오류나 버그 발견 시 즉시 신고해주세요
                      </p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownload(resource)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      다운로드
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 🎬 세미나 영상 특별 섹션 */}
          <div className="mt-16">
            <div className="flex items-center mb-8">
              <Video className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">세미나 영상</h2>
            </div>
            
            {/* 세미나 영상 특별 카드 */}
            <Card className="relative overflow-hidden bg-gradient-to-r from-red-50 via-purple-50 to-blue-50 border-2 border-gradient-to-r from-red-200 to-blue-200 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 group">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  
                  {/* 왼쪽: 아이콘과 정보 */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 bg-red-100 px-4 py-2 rounded-full mb-6">
                      <Video className="w-6 h-6 text-red-600" />
                      <span className="text-red-600 font-semibold">LIVE ON YOUTUBE</span>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      M-CENTER 세미나 영상
                    </h3>
                    
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      25년 경험의 전문가가 직접 진행하는 실무 중심 온라인 교육
                      <br />
                      <span className="font-semibold text-purple-600">BM ZEN 프레임워크부터 AI 생산성까지</span>
                    </p>
                    
                    {/* 통계 */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">85+</div>
                        <div className="text-sm text-gray-600">영상 수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">12.5K</div>
                        <div className="text-sm text-gray-600">구독자</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">4.9/5</div>
                        <div className="text-sm text-gray-600">만족도</div>
                      </div>
                    </div>
                    
                    {/* 버튼 */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105"
                        onClick={() => window.open('/seminar', '_self')}
                      >
                        <Video className="w-6 h-6 mr-3" />
                        세미나 영상 보기
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="border-2 border-red-200 hover:bg-red-50 text-red-600 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                        onClick={() => window.open('https://www.youtube.com/channel/UCmCTUihEcCGhI0WJXlRfqRA?sub_confirmation=1', '_blank')}
                      >
                        <Youtube className="w-6 h-6 mr-3" />
                        유튜브 구독
                      </Button>
                    </div>
                  </div>
                  
                  {/* 오른쪽: 비주얼 */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* 메인 비디오 썸네일 */}
                      <div className="w-80 h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-2xl overflow-hidden group-hover:shadow-3xl transition-shadow duration-500">
                        <img 
                          src="https://picsum.photos/400/240?random=seminar" 
                          alt="세미나 영상"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* 재생 버튼 오버레이 */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        
                        {/* LIVE 배지 */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            🔴 LIVE
                          </div>
                        </div>
                        
                        {/* 시청자 수 */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          👥 2,543명 시청중
                        </div>
                      </div>
                      
                      {/* 떠다니는 아이콘들 */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                        ⭐
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                        💼
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {/* 그라데이션 테두리 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </Card>
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
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3" asChild>
                <a href="/consultation">
                  <Phone className="w-4 h-4 mr-2" />
                  상담신청
                </a>
              </Button>
              <Button variant="outline" className="px-6 py-3" asChild>
                <a href="mailto:hongik423@gmail.com">
                  <Mail className="w-4 h-4 mr-2" />
                  문의 이메일 보내기
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 