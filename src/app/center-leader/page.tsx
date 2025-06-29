'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Phone,
  Mail,
  Building,
  Award,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  MessageCircle,
  Download,
  Lightbulb,
  Shield,
  Clock,
  DollarSign,
  FileText,
  Factory,
  Send
} from 'lucide-react';
import Header from '@/components/layout/header';

export default function CenterLeaderPage() {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 좌측: 프로필 정보 */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border border-white/30 overflow-hidden">
                  <img 
                    src="/M-Center-leader.png" 
                    alt="이후경 경영지도사 프로필 사진"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아이콘으로 대체
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <User className="w-10 h-10 text-white hidden" />
                </div>
                <div>
                  <Badge className="bg-yellow-500 text-black mb-2">28년 검증된 전문가</Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2">이후경 경영지도사</h1>
                  <p className="text-xl text-blue-100">기업의별 경영지도센터장</p>
                </div>
              </div>
              
              <div className="text-2xl mb-6 text-blue-100">
                <span className="text-white font-bold">"기업의 성장은 사람으로부터 시작됩니다"</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">28년</div>
                  <div className="text-sm text-blue-100">총 경력</div>
                  <div className="text-xs text-blue-200">경영지도사 10년 + 대기업 18년</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">200+</div>
                  <div className="text-sm text-blue-100">지원 기업</div>
                  <div className="text-xs text-blue-200">중소기업부터 대기업까지</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">98%</div>
                  <div className="text-sm text-blue-100">고객 만족도</div>
                  <div className="text-xs text-blue-200">재계약률 85%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                  <div className="text-3xl font-bold text-yellow-300">정부지원</div>
                  <div className="text-sm text-blue-100">일터혁신</div>
                  <div className="text-xs text-blue-200">공식 수행기관</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/consultation"
                  className="inline-flex items-center justify-center bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-3 rounded-md transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group text-lg h-12"
                >
                  <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    무료 상담 신청
                  </span>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-lg relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span className="relative flex items-center">
                    <Download className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform duration-200" />
                    프로필 다운로드
                  </span>
                </Button>
              </div>
            </div>
            
            {/* 우측: 핵심 메시지 */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Shield className="w-6 h-6 mr-2 text-yellow-300" />
                    신뢰성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>현대그룹, 삼성생명 출신의 검증된 실무 경험</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Award className="w-6 h-6 mr-2 text-yellow-300" />
                    전문성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>경영지도사 자격 + 28년 현장 노하우</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <TrendingUp className="w-6 h-6 mr-2 text-yellow-300" />
                    실용성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>정부지원사업 연계로 비용 효율적 컨설팅</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Clock className="w-6 h-6 mr-2 text-yellow-300" />
                    지속성
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>프로젝트 완료 후 지속적 사후관리</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 전문가 프로필 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">전문가 프로필</h2>
            <p className="text-xl text-gray-600">28년간 축적된 실무 경험과 전문성</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 기본 정보 카드 */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <User className="w-6 h-6 mr-3 text-blue-600" />
                  전문가 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <span className="font-semibold w-24">성명</span>
                    <span>이후경 경영지도사</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-semibold w-24">연락처</span>
                    <span className="text-blue-600 font-semibold">010-9251-9743</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-red-600" />
                    <span className="font-semibold w-24">이메일</span>
                    <span className="text-blue-600">hongik423@gmail.com</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-600" />
                    <span className="font-semibold w-24">학력</span>
                    <span>대전대학교 기술경영 석사</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-semibold w-24">자격</span>
                    <span>경영지도사(인적자원) / 온실가스관리기사</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 현재 주요 직책 */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Building className="w-6 h-6 mr-3 text-green-600" />
                  현재 주요 직책
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    '기업의별 경영지도센터장',
                    '아이엔제이컨설팅 책임컨설턴트',
                    '월드클래스코리아 HRD실장',
                    'ESG인증원 책임컨설턴트',
                    '한국능률협회컨설팅 EXPERT',
                    'IBK미래성장성 심의회 전문가'
                  ].map((position, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                      <span>{position}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 핵심 서비스 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">전문 컨설팅 서비스</h2>
            <p className="text-xl text-gray-600">6대 핵심서비스 모든영역 - 종합 솔루션 제공</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "BM ZEN 사업분석",
                description: "5단계 프레임워크 기반 전략적 매출증대",
                color: "blue",
                link: "/services/business-analysis"
              },
              {
                icon: <Lightbulb className="w-8 h-8" />,
                title: "AI 생산성향상",
                description: "ChatGPT 활용 업무효율 40-60% 향상",
                color: "purple",
                link: "/services/ai-productivity"
              },
              {
                icon: <Factory className="w-8 h-8" />,
                title: "공장/부동산 경매",
                description: "경매활용 구매전략으로 30-50% 비용절감",
                color: "orange",
                link: "/services/factory-auction"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "기술창업 지원",
                description: "사업화 및 정부지원으로 평균 5억원 확보",
                color: "green",
                link: "/services/tech-startup"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "인증지원 전문",
                description: "ISO/벤처/연구소 인증으로 연간 5천만원 세제혜택",
                color: "red",
                link: "/services/certification"
              },
              {
                icon: <Building className="w-8 h-8" />,
                title: "웹사이트 구축",
                description: "SEO 최적화로 매출 300-500% 증대",
                color: "cyan",
                link: "/services/website"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "전략적 인사관리",
                description: "조직진단부터 인사제도 구축까지",
                color: "indigo",
                link: "/consultation"
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "재무/원가관리",
                description: "ABC 원가계산 기반 정밀 분석",
                color: "yellow",
                link: "/consultation"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "노무관리 전문",
                description: "근로기준법 준수 및 노사관계",
                color: "pink",
                link: "/consultation"
              }
            ].map((service, index) => (
              <Link key={index} href={service.link} className="block">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-200 border-0 cursor-pointer transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group">
                  <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <CardHeader className="relative z-10">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-200">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 경력 타임라인 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">주요 경력 타임라인</h2>
            <p className="text-xl text-gray-600">28년간의 전문성 축적 과정</p>
          </div>
          
          <div className="relative">
            {/* 타임라인 선 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            <div className="space-y-12">
              {/* 2014년~현재 */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <Card className="inline-block max-w-md shadow-lg">
                    <CardHeader className="bg-blue-600 text-white">
                      <CardTitle className="text-lg">2014년~현재 (10년)</CardTitle>
                      <CardDescription className="text-blue-100">경영지도사 / 전문 컨설턴트</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 기업의별 경영지도센터장</li>
                        <li>• 아이엔제이컨설팅 책임컨설턴트</li>
                        <li>• 고용노동부 일터혁신 수행기관 컨설턴트</li>
                        <li>• 200개사 이상 조직/인사 컨설팅 수행</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="flex-1 pl-8"></div>
              </div>
              
              {/* 2006년~2014년 */}
              <div className="relative flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="flex-1 pl-8">
                  <Card className="inline-block max-w-md shadow-lg">
                    <CardHeader className="bg-green-600 text-white">
                      <CardTitle className="text-lg">2006년~2014년 (8년)</CardTitle>
                      <CardDescription className="text-green-100">현대그룹 고려산업개발</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 인사노무담당 실무진</li>
                        <li>• 대기업 인사제도 설계 및 운영 경험</li>
                        <li>• 조직관리 및 노무관리 전문성 구축</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* 1996년~2006년 */}
              <div className="relative flex items-center">
                <div className="flex-1 text-right pr-8">
                  <Card className="inline-block max-w-md shadow-lg">
                    <CardHeader className="bg-purple-600 text-white">
                      <CardTitle className="text-lg">1996년~2006년 (10년)</CardTitle>
                      <CardDescription className="text-purple-100">삼성생명</CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                      <ul className="space-y-2 text-sm">
                        <li>• 지점장 역임</li>
                        <li>• 영업조직 관리 및 성과관리 경험</li>
                        <li>• 팀 리더십 및 조직운영 노하우 축적</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상담 신청 CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">28년 경험의 전문가와 상담하세요</h2>
          <p className="text-xl mb-8 text-blue-100">
            정부지원 프로그램을 활용한 무료 컨설팅 기회를 놓치지 마세요
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/diagnosis" className="block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <CardContent className="p-6 text-center relative z-10">
                  <Target className="w-8 h-8 mx-auto mb-3 text-yellow-300 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold mb-2">무료진단</h3>
                  <p className="text-blue-100 text-sm mb-3">AI 기반 정밀 진단</p>
                  <p className="text-xs text-blue-200">24시간 접수</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white transform hover:scale-[1.05] transition-all duration-200">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">이메일 문의</h3>
                <p className="text-blue-100 text-sm mb-3">hongik423@gmail.com</p>
                <p className="text-xs text-blue-200">24시간 내 회신</p>
              </CardContent>
            </Card>
            
            <Link href="/consultation" className="block">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <CardContent className="p-6 text-center relative z-10">
                  <MessageCircle className="w-8 h-8 mx-auto mb-3 text-yellow-300 group-hover:scale-110 transition-transform duration-200" />
                  <h3 className="font-semibold mb-2">현장 방문</h3>
                  <p className="text-blue-100 text-sm mb-3">무료 진단</p>
                  <p className="text-xs text-blue-200">정밀 현황 분석</p>
                </CardContent>
              </Card>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/diagnosis"
              className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg rounded-md transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group h-14"
            >
              <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Target className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                무료진단 신청
              </span>
            </Link>
            
            <Link 
              href="/consultation"
              className="inline-flex items-center justify-center border border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg rounded-md transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-lg relative overflow-hidden group h-14"
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                1:1 상담 신청
              </span>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <Alert className="bg-white/10 border-white/20 text-white max-w-md mx-auto">
              <Lightbulb className="h-4 w-4 text-yellow-300" />
              <AlertDescription>
                <strong>선착순 혜택</strong> (월 10개사 한정)<br />
                현장 진단비 면제 + 프로젝트 10% 할인
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </div>
  );
} 