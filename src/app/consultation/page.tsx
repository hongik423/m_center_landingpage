'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react';

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                무료 상담 신청
              </h1>
              <p className="text-xl text-gray-600">
                전문가와 1:1 맞춤 상담으로 최적의 솔루션을 찾아보세요
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* 상담 방법 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  상담 방법 선택
                </h2>
                <div className="space-y-4">
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Phone className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">전화 상담</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        즉시 연결되는 전화 상담으로 빠른 해결책을 제공받으세요
                      </p>
                      <Button className="w-full">
                        전화 상담 신청
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <MessageCircle className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">온라인 상담</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        채팅 또는 화상회의를 통한 온라인 상담을 받아보세요
                      </p>
                      <Button className="w-full">
                        온라인 상담 신청
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Mail className="w-6 h-6 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">방문 상담</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        직접 방문하여 심도 있는 상담을 받아보세요
                      </p>
                      <Button className="w-full">
                        방문 상담 예약
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 연락처 정보 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  연락처 정보
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-primary mr-3" />
                        <div>
                          <div className="font-semibold">전화번호</div>
                          <div className="text-gray-600">1588-0000</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="w-5 h-5 text-primary mr-3" />
                        <div>
                          <div className="font-semibold">이메일</div>
                          <div className="text-gray-600">info@m-center.co.kr</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-primary mr-3" />
                        <div>
                          <div className="font-semibold">운영시간</div>
                          <div className="text-gray-600">
                            평일 09:00 - 18:00<br />
                            (토/일/공휴일 휴무)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        상담 전 준비사항
                      </h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• 현재 사업 현황 및 고민사항</li>
                        <li>• 회사 규모 및 업종</li>
                        <li>• 원하는 컨설팅 분야</li>
                        <li>• 예산 및 일정</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 