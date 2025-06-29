'use client';

import Header from '@/components/layout/header';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              연락처
            </h1>
            <p className="text-xl text-gray-600">
              언제든지 편하게 연락주세요. 전문 상담원이 도와드리겠습니다.
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
                  <div className="space-y-2 text-gray-600 mb-4">
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
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white" asChild>
                    <a href="mailto:hongik423@gmail.com?subject=오류신고">오류신고</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 오시는 길 */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">오시는 길</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">본사 주소</h3>
                  <p className="text-gray-600 mb-4">
                    서울특별시 강남구 테헤란로 123<br />
                    M-CENTER 빌딩 10층
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-4">교통편</h3>
                  <div className="space-y-2 text-gray-600">
                    <div>• 지하철 2호선 강남역 3번 출구 도보 5분</div>
                    <div>• 버스 146, 540, 360 강남역 하차</div>
                    <div>• 주차장 이용 가능 (건물 지하 1-3층)</div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">지도 영역</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 