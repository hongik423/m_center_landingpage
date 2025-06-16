'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, MessageCircle, Zap, Brain, Clock } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                AI 챗봇 상담
              </h1>
              <p className="text-xl text-gray-600">
                24시간 언제든지 AI 챗봇과 실시간 상담을 진행하세요
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">24시간 지원</h3>
                  <p className="text-gray-600">언제든지 이용 가능한 AI 상담</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">즉시 응답</h3>
                  <p className="text-gray-600">실시간 답변으로 빠른 해결</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">전문 지식</h3>
                  <p className="text-gray-600">경영컨설팅 전문 AI</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Bot className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  AI 챗봇과 대화하기
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] mb-6">
                  <div className="text-center text-gray-500 flex items-center justify-center h-full">
                    <div>
                      <Bot className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg">AI 챗봇이 준비 중입니다...</p>
                      <p className="text-sm mt-2">곧 서비스를 시작할 예정입니다.</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button className="mr-4">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    대화 시작하기
                  </Button>
                  <Button variant="outline">
                    전문가 상담 신청
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                AI 챗봇 이용 안내
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• 기본적인 경영 상담 및 정보 제공</li>
                <li>• 서비스 안내 및 예약 접수</li>
                <li>• 복잡한 상담은 전문가 연결 지원</li>
                <li>• 개인정보는 안전하게 보호됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 