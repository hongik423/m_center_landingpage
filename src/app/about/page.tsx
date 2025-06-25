'use client';

import { Header } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { Users, Target, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* 회사 소개 헤더 */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              기업의별 경영지도센터
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Business Model Zen으로 기업의 5단계 성장을 완성하는 
              대한민국 대표 경영컨설팅 전문기업입니다
            </p>
          </div>

          {/* 미션, 비전, 가치 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="text-center">
              <CardContent className="p-8">
                <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">미션</h3>
                <p className="text-gray-600">
                  기업의 지속가능한 성장을 위한 맞춤형 솔루션 제공으로 
                  국가 경제 발전에 기여한다
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">비전</h3>
                <p className="text-gray-600">
                  Business Model Zen으로 글로벌 스탠다드의 
                  경영컨설팅 서비스를 제공하는 선도기업
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">가치</h3>
                <p className="text-gray-600">
                  고객 성공, 전문성, 혁신, 신뢰를 바탕으로 
                  최고의 서비스를 제공한다
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 회사 연혁 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              회사 연혁
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                    2020
                  </div>
                  <div className="ml-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      기업의별 경영지도센터 설립
                    </h3>
                    <p className="text-gray-600">
                      경영컨설팅 전문기업으로 출발, BM ZEN 프레임워크 개발
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                    2021
                  </div>
                  <div className="ml-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      5대 핵심 서비스 런칭
                    </h3>
                    <p className="text-gray-600">
                      AI 생산성향상, 기술창업, 공장구매, 인증지원, 웹사이트 구축 서비스 시작
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                    2022
                  </div>
                  <div className="ml-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      정부 지원 사업 파트너십 체결
                    </h3>
                    <p className="text-gray-600">
                      중소벤처기업부, 산업통상자원부 등 정부 기관과 협력 관계 구축
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                    2023
                  </div>
                  <div className="ml-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      고객 1,000개 기업 돌파
                    </h3>
                    <p className="text-gray-600">
                      누적 고객 1,000개 기업 달성, 고객 만족도 94% 이상 유지
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 w-24 text-primary font-bold text-lg">
                    2024
                  </div>
                  <div className="ml-8">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      AI 기반 진단 시스템 도입
                    </h3>
                    <p className="text-gray-600">
                      최신 AI 기술을 활용한 기업 진단 및 맞춤 솔루션 제공 시스템 구축
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 조직 구성 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              조직 구성
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    경영컨설팅팀
                  </h3>
                  <p className="text-sm text-gray-600">
                    BM ZEN 전문 컨설턴트
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    기술지원팀
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI·IT 기술 전문가
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    정부지원팀
                  </h3>
                  <p className="text-sm text-gray-600">
                    정부 사업 연계 전문가
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    고객지원팀
                  </h3>
                  <p className="text-sm text-gray-600">
                    24시간 고객 서비스
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 인증 및 파트너십 */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              인증 및 파트너십
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-white rounded-lg p-4 mb-2">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">벤처기업</h4>
                <p className="text-sm text-gray-600">2020.12 인증</p>
              </div>
              <div>
                <div className="bg-white rounded-lg p-4 mb-2">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">이노비즈</h4>
                <p className="text-sm text-gray-600">2021.03 인증</p>
              </div>
              <div>
                <div className="bg-white rounded-lg p-4 mb-2">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">ISO 9001</h4>
                <p className="text-sm text-gray-600">2021.06 인증</p>
              </div>
              <div>
                <div className="bg-white rounded-lg p-4 mb-2">
                  <Award className="w-12 h-12 text-primary mx-auto" />
                </div>
                <h4 className="font-semibold text-gray-900">정부 협력기관</h4>
                <p className="text-sm text-gray-600">2022.01 지정</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 