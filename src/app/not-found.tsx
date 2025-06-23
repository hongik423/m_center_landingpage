'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, HeartCrack } from 'lucide-react';

export default function NotFound() {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl text-center shadow-2xl border-0">
            <CardContent className="p-12">
              {/* 아이콘 */}
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                <HeartCrack className="w-16 h-16 text-blue-600" />
              </div>
              
              {/* 404 텍스트 */}
              <h1 className="text-8xl font-black text-transparent bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text mb-4">
                404
              </h1>
              
              {/* 메시지 */}
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                페이지를 찾을 수 없습니다
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
                다른 페이지를 확인해보시거나 홈으로 돌아가세요.
              </p>
              
              {/* 액션 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  홈으로 가기
                </Link>
                
                <Link 
                  href="/services"
                  className="px-8 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  서비스 둘러보기
                </Link>
              </div>
              
              {/* 추천 링크 */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">추천 페이지</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/services/diagnosis" className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                    AI 무료진단
                  </Link>
                  <Link href="/tax-calculator" className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                    세금계산기
                  </Link>
                  <Link href="/consultation" className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                    무료상담
                  </Link>
                  <Link href="/chatbot" className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors">
                    AI챗봇
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
} 