'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  Building, 
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProcessPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const certificationSteps = [
    {
      id: 1,
      title: '인증 신청 및 계약',
      icon: <FileText className="h-8 w-8" />,
      duration: '1-2일',
      description: '온라인 또는 오프라인으로 인증 신청서를 제출하고 계약을 체결합니다.',
      details: [
        '온라인 신청서 작성 (기업 정보, 인증 범위 등)',
        '필요 서류 제출 (사업자등록증, 조직도 등)',
        '심사 비용 산정 및 견적서 발급',
        '인증 계약서 체결',
        '심사 일정 협의 및 확정'
      ],
      documents: ['인증신청서', '사업자등록증', '조직도', '프로세스맵']
    },
    {
      id: 2,
      title: '문서 심사 (1단계 심사)',
      icon: <Search className="h-8 w-8" />,
      duration: '3-5일',
      description: '경영시스템 문서의 적합성을 검토하고 개선사항을 도출합니다.',
      details: [
        '경영매뉴얼 및 절차서 검토',
        '법규 및 규격 요구사항 충족 여부 확인',
        '문서화된 정보의 적절성 평가',
        '개선 필요사항 보고서 작성',
        '시정조치 계획 수립 지원'
      ],
      documents: ['경영매뉴얼', '절차서', '지침서', '관련 기록']
    },
    {
      id: 3,
      title: '현장 심사 (2단계 심사)',
      icon: <Building className="h-8 w-8" />,
      duration: '2-3일',
      description: '현장을 방문하여 경영시스템의 실제 운영 상태를 확인합니다.',
      details: [
        '경영진 인터뷰 및 경영검토 확인',
        '프로세스별 현장 심사 수행',
        '내부심사 및 시정조치 이행 확인',
        '법규 준수 및 고객 요구사항 충족 확인',
        '심사 결과 보고서 작성'
      ],
      documents: ['내부심사 보고서', '시정조치 기록', '교육훈련 기록']
    },
    {
      id: 4,
      title: '인증서 발급',
      icon: <Award className="h-8 w-8" />,
      duration: '5-7일',
      description: '심사 결과를 검토하고 인증 기준을 충족하면 인증서를 발급합니다.',
      details: [
        '심사 보고서 기술 검토',
        '인증 위원회 심의 및 승인',
        '인증서 및 인증마크 발급',
        'KAB 등록 및 공시',
        '사후관리 일정 안내'
      ],
      documents: ['인증서', '인증마크 사용 가이드', '사후관리 계획서']
    }
  ];

  const certificationTypes = [
    {
      name: 'ISO 9001',
      title: '품질경영시스템',
      requirements: [
        '품질방침 및 목표 수립',
        '프로세스 접근법 적용',
        '고객만족 모니터링',
        '지속적 개선 체계'
      ]
    },
    {
      name: 'ISO 14001',
      title: '환경경영시스템',
      requirements: [
        '환경방침 수립',
        '환경측면 파악 및 평가',
        '법규 준수 평가',
        '환경목표 및 실행계획'
      ]
    },
    {
      name: 'ISO 45001',
      title: '안전보건경영시스템',
      requirements: [
        '위험성평가 실시',
        '안전보건 방침 수립',
        '근로자 참여 및 협의',
        '비상사태 대비 및 대응'
      ]
    },
    {
      name: 'ESG',
      title: 'ESG 경영시스템',
      requirements: [
        'ESG 경영방침 수립',
        '이해관계자 식별 및 소통',
        'ESG 리스크 평가',
        '지속가능경영 보고'
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              인증 절차 안내
            </h1>
            <p className="text-xl text-gray-100">
              체계적이고 투명한 인증 프로세스로<br />
              신속하고 정확한 인증 서비스를 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">인증 프로세스 개요</h2>
              <p className="text-gray-600">
                신청부터 인증서 발급까지 평균 15일 이내 완료
              </p>
            </div>

            {/* Process Timeline */}
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-green-200 transform -translate-y-1/2 hidden md:block"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {certificationSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div className="bg-white rounded-lg shadow-lg p-6 relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
                        <div className="text-green-600">{step.icon}</div>
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-center mb-4">
                        {step.description}
                      </p>
                      <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                        <Clock className="h-4 w-4 mr-1" />
                        {step.duration}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                      >
                        {expandedStep === step.id ? (
                          <>
                            간략히 보기 <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            자세히 보기 <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    {index < certificationSteps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-green-400 h-6 w-6 z-20" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedStep && (
              <div className="mt-8">
                {certificationSteps.map((step) => (
                  expandedStep === step.id && (
                    <Card key={step.id} className="border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-green-600">{step.icon}</span>
                          {step.title} 상세 정보
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">주요 활동</h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm text-gray-600">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3">필요 서류</h4>
                            <ul className="space-y-2">
                              {step.documents.map((doc, idx) => (
                                <li key={idx} className="flex items-center">
                                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-600">{doc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Certification Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">인증 규격별 요구사항</h2>
              <p className="text-gray-600">
                각 인증 규격에 따른 주요 요구사항을 확인하세요
              </p>
            </div>

            <Tabs defaultValue="ISO 9001" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {certificationTypes.map((type) => (
                  <TabsTrigger key={type.name} value={type.name}>
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {certificationTypes.map((type) => (
                <TabsContent key={type.name} value={type.name}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>
                        {type.name} 인증을 위한 주요 요구사항
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid md:grid-cols-2 gap-4">
                        {type.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert className="border-green-200 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">인증 준비 시 유의사항</AlertTitle>
              <AlertDescription className="text-green-700 mt-2">
                <ul className="space-y-2 mt-3">
                  <li>• 인증 신청 전 내부 경영시스템을 최소 3개월 이상 운영하셔야 합니다.</li>
                  <li>• 내부심사 및 경영검토를 최소 1회 이상 실시하셔야 합니다.</li>
                  <li>• 모든 프로세스에 대한 기록이 유지되어야 합니다.</li>
                  <li>• 법규 및 고객 요구사항을 파악하고 준수하셔야 합니다.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              인증 준비가 되셨나요?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              전문가와 함께 인증을 준비하세요
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
                <Link href="/esg-certification/consultation">
                  무료 상담 받기
                </Link>
              </Button>
            </div>
            <div className="mt-8">
              <Button
                variant="link"
                className="text-white hover:text-green-100"
                asChild
              >
                <Link href="/docs/certification-guide.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  인증 절차 안내서 다운로드
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 