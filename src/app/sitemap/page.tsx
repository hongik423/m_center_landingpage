import Header from '@/components/layout/header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const siteMapData = [
  {
    category: '메인 서비스',
    links: [
      { title: '홈페이지', url: '/' },
      { title: '무료 AI 진단', url: '/diagnosis' },
      { title: '챗봇', url: '/chatbot' },
      { title: '상담 신청', url: '/consultation' },
      { title: '회사 소개', url: '/about' },
      { title: '성공사례', url: '/cases' }
    ]
  },
  {
    category: '핵심 서비스',
    links: [
      { title: 'BM ZEN 사업분석', url: '/services/business-analysis' },
      { title: 'AI 활용 생산성향상', url: '/services/ai-productivity' },
      { title: '경매활용 공장구매', url: '/services/factory-auction' },
      { title: '기술사업화/기술창업', url: '/services/tech-startup' },
      { title: '인증지원', url: '/services/certification' },
      { title: '웹사이트 구축', url: '/services/website' },
      { title: '무료 진단', url: '/services/diagnosis' }
    ]
  },
  {
    category: '고객지원',
    links: [
      { title: '고객지원 메인', url: '/support' },
      { title: '자주 묻는 질문', url: '/support/faq' },
      { title: '자료실', url: '/support/downloads' },
      { title: '공지사항', url: '/support/notices' },
      { title: '연락처', url: '/support/contact' }
    ]
  },
  {
    category: '약관 및 정책',
    links: [
      { title: '이용약관', url: '/terms' },
      { title: '개인정보처리방침', url: '/privacy' },
      { title: '사이트맵', url: '/sitemap' }
    ]
  },
  {
    category: 'API 엔드포인트',
    links: [
      { title: 'AI 진단 API', url: '/api/ai-diagnosis' },
      { title: '진단 처리 API', url: '/api/process-diagnosis' },
      { title: '진단 저장 API', url: '/api/save-diagnosis' },
      { title: '채팅 API', url: '/api/chat' },
      { title: '구글시트 테스트 API', url: '/api/test-googlesheets' }
    ]
  }
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              사이트맵
            </h1>
            <p className="text-xl text-gray-600">
              M-CENTER 웹사이트의 전체 구조를 한눈에 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteMapData.map((category, index) => (
              <Card key={index} className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="flex items-center">
                        {link.url.startsWith('/api/') ? (
                          <div className="flex items-center text-gray-600">
                            <span className="text-sm">{link.title}</span>
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">API</span>
                          </div>
                        ) : (
                          <Link 
                            href={link.url}
                            className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <span className="text-sm">{link.title}</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-16">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  더 많은 정보가 필요하신가요?
                </h2>
                <p className="text-gray-600 mb-6">
                  원하시는 페이지를 찾지 못하셨거나 추가 정보가 필요하시면 언제든지 연락주세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/support/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    연락처 보기
                  </Link>
                  <Link 
                    href="/support/faq"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    FAQ 보기
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 