'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Award, 
  Shield, 
  Users, 
  FileCheck, 
  BookOpen, 
  Briefcase,
  CheckCircle,
  ArrowRight,
  Building,
  Globe,
  Target,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ESGCertificationPage() {
  const certificationTypes = [
    {
      title: 'ISO 9001',
      description: '품질경영시스템',
      icon: <Award className="h-8 w-8 text-green-600" />,
      benefits: ['품질 향상', '고객 만족도 증대', '프로세스 개선']
    },
    {
      title: 'ISO 14001',
      description: '환경경영시스템',
      icon: <Globe className="h-8 w-8 text-green-600" />,
      benefits: ['환경 보호', '법규 준수', '비용 절감']
    },
    {
      title: 'ISO 45001',
      description: '안전보건경영시스템',
      icon: <Shield className="h-8 w-8 text-green-600" />,
      benefits: ['작업장 안전', '사고 예방', '법적 책임 감소']
    },
    {
      title: 'ESG 경영시스템',
      description: '지속가능경영시스템',
      icon: <Target className="h-8 w-8 text-green-600" />,
      benefits: ['ESG 평가 대응', '투자 유치', '지속가능성 강화']
    }
  ];

  const processSteps = [
    {
      step: '1단계',
      title: '신청 및 계약',
      description: '온라인 신청서 작성 및 심사 계약 체결',
      duration: '1-2일'
    },
    {
      step: '2단계',
      title: '문서 심사',
      description: '경영시스템 문서 검토 및 개선사항 도출',
      duration: '3-5일'
    },
    {
      step: '3단계',
      title: '현장 심사',
      description: '현장 방문을 통한 실제 운영 상태 확인',
      duration: '2-3일'
    },
    {
      step: '4단계',
      title: '인증서 발급',
      description: '심사 결과 검토 후 인증서 발급',
      duration: '5-7일'
    }
  ];

  const features = [
    {
      icon: <Building className="h-6 w-6" />,
      title: 'KAB 인정 인증기관',
      description: '한국인정지원센터로부터 인정받은 공신력 있는 인증기관'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '전문 심사원 보유',
      description: '각 분야별 전문성을 갖춘 경험 많은 심사원 팀'
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: '신속한 인증 처리',
      description: '평균 15일 이내 인증 완료, 업계 최단 기간'
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: '사후관리 서비스',
      description: '인증 후 지속적인 관리 및 개선 지원'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              KAB 인정 ESG 경영시스템 시범 인증기관
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ESG 인증원
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              고객에게 최적의 적합성 평가 서비스를 제공하는<br />
              신뢰받는 인증 파트너
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100"
                asChild
              >
                <Link href="/esg-certification/apply">
                  인증 신청하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/esg-certification/process">
                  인증 절차 안내
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">ESG 인증원의 핵심 가치</h2>
              <p className="text-gray-600">
                공평성을 최고의 가치로 신뢰받는 인증서비스를 제공합니다
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">공평성</h3>
                <p className="text-gray-600">
                  모든 고객에게 공정하고 투명한 심사 서비스 제공
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">전문성</h3>
                <p className="text-gray-600">
                  인증의 전문성을 통한 프로세스의 완전성 추구
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">신뢰성</h3>
                <p className="text-gray-600">
                  KAB 인정을 통한 국제적 공신력 확보
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">인증 서비스</h2>
              <p className="text-gray-600">
                기업의 성장과 지속가능경영을 위한 다양한 인증 서비스를 제공합니다
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificationTypes.map((cert, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mb-4">{cert.icon}</div>
                    <CardTitle className="text-xl">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cert.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      asChild
                    >
                      <Link href={`/esg-certification/services/${cert.title.toLowerCase().replace(' ', '-')}`}>
                        자세히 보기
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">인증 프로세스</h2>
              <p className="text-gray-600">
                신속하고 체계적인 4단계 인증 프로세스
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-green-50 rounded-lg p-6 h-full">
                    <div className="text-green-600 font-bold mb-2">{step.step}</div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                    <div className="text-sm text-green-600 font-medium">
                      소요기간: {step.duration}
                    </div>
                  </div>
                  {index < processSteps.length - 1 && (
                    <ChevronRight className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-green-400 h-6 w-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">왜 ESG 인증원인가?</h2>
              <p className="text-gray-600">
                전문성과 신뢰성을 바탕으로 최고의 인증 서비스를 제공합니다
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-green-600 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 인증을 시작하세요
            </h2>
            <p className="text-xl mb-8 text-green-100">
              전문가가 인증의 모든 과정을 함께합니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100"
                asChild
              >
                <Link href="/esg-certification/consultation">
                  무료 상담 신청
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/esg-certification/contact">
                  문의하기
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div>
                <span className="font-semibold">전화</span>
                <p>02-588-5114</p>
              </div>
              <div>
                <span className="font-semibold">이메일</span>
                <p>ycpark55@naver.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 