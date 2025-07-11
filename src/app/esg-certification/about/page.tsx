'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Award, 
  Target,
  CheckCircle,
  Calendar,
  ChevronRight,
  Shield,
  Scale,
  Heart,
  Globe,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const timelineData = [
    {
      year: 2024,
      events: [
        { month: '02', content: 'KAB ESG 경영시스템 시범 인증기관 지정' },
        { month: '01', content: 'ISO 45001 안전보건경영시스템 인정 확대' }
      ]
    },
    {
      year: 2023,
      events: [
        { month: '11', content: 'IAF MLA 국제상호인정 갱신' },
        { month: '08', content: '누적 인증 기업 1,000개 돌파' },
        { month: '03', content: 'ISO 14001 환경경영시스템 인정 확대' }
      ]
    },
    {
      year: 2022,
      events: [
        { month: '09', content: '온라인 심사 시스템 도입' },
        { month: '05', content: '중소기업 인증 지원 프로그램 시작' }
      ]
    },
    {
      year: 2021,
      events: [
        { month: '12', content: 'KAB 인정 갱신 (3년)' },
        { month: '06', content: 'ISO 9001 품질경영시스템 인정 획득' }
      ]
    },
    {
      year: 2020,
      events: [
        { month: '10', content: '서울 본사 이전 (현 위치)' },
        { month: '03', content: 'ESG 인증원 설립' }
      ]
    }
  ];

  const organizationStructure = {
    ceo: {
      title: '대표이사',
      name: '박영철',
      departments: [
        {
          title: '인증사업본부',
          teams: [
            { name: '품질인증팀', members: 8 },
            { name: '환경안전인증팀', members: 6 },
            { name: 'ESG인증팀', members: 5 }
          ]
        },
        {
          title: '경영지원본부',
          teams: [
            { name: '기획관리팀', members: 4 },
            { name: '고객지원팀', members: 5 },
            { name: '교육사업팀', members: 4 }
          ]
        },
        {
          title: '기술위원회',
          teams: [
            { name: '기술검토위원회', members: 3 },
            { name: '공평성위원회', members: 3 }
          ]
        }
      ]
    }
  };

  const impartialityPrinciples = [
    {
      icon: <Scale className="h-8 w-8" />,
      title: '독립성',
      description: '인증 활동에 있어 어떠한 외부 압력이나 영향을 받지 않으며, 독립적이고 객관적인 심사를 수행합니다.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '공정성',
      description: '모든 고객에게 동일한 기준과 절차를 적용하며, 차별 없는 공정한 인증 서비스를 제공합니다.'
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: '투명성',
      description: '인증 프로세스와 의사결정 과정을 투명하게 공개하며, 고객의 알 권리를 보장합니다.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: '전문성',
      description: '각 분야의 전문 심사원을 보유하고 지속적인 교육을 통해 최고 수준의 전문성을 유지합니다.'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              회사소개
            </h1>
            <p className="text-xl text-gray-100">
              신뢰와 전문성으로 함께하는 ESG 인증원입니다
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="greeting" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-12">
                <TabsTrigger value="greeting">인사말</TabsTrigger>
                <TabsTrigger value="history">연혁</TabsTrigger>
                <TabsTrigger value="organization">조직도</TabsTrigger>
                <TabsTrigger value="impartiality">공평성 선언</TabsTrigger>
              </TabsList>

              {/* 인사말 */}
              <TabsContent value="greeting" className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-1">
                        <div className="w-full h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                          <Users className="h-24 w-24 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <h3 className="text-xl font-semibold">박영철</h3>
                          <p className="text-gray-600">대표이사</p>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold mb-4">
                          고객과 함께 성장하는 ESG 인증원이 되겠습니다
                        </h2>
                        <div className="space-y-4 text-gray-700">
                          <p>
                            안녕하십니까, ESG 인증원 대표이사 박영철입니다.
                          </p>
                          <p>
                            ESG 인증원은 2020년 설립 이래 '고객에게 최적의 적합성 평가 서비스 제공'이라는 
                            미션 아래 품질, 환경, 안전보건 분야의 경영시스템 인증 서비스를 제공해 왔습니다.
                          </p>
                          <p>
                            특히 2024년 한국인정지원센터(KAB)로부터 ESG 경영시스템 시범 인증기관으로 
                            지정받아, 지속가능경영을 추구하는 기업들의 든든한 파트너로서 새로운 도약을 
                            준비하고 있습니다.
                          </p>
                          <p>
                            저희는 단순한 인증서 발급을 넘어, 고객 기업의 실질적인 경영시스템 개선과 
                            지속가능한 성장을 지원하는 것을 목표로 합니다. 공평성과 전문성을 바탕으로 
                            신뢰받는 인증 서비스를 제공하여, 대한민국 기업의 글로벌 경쟁력 강화에 
                            기여하겠습니다.
                          </p>
                          <p>
                            앞으로도 ESG 인증원은 고객 여러분의 목소리에 귀 기울이며, 
                            함께 성장하는 파트너가 되도록 최선을 다하겠습니다.
                          </p>
                          <p>
                            감사합니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 비전과 미션 */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <Target className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>비전</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        아시아 최고의 ESG 경영시스템 인증기관
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Globe className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>미션</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        고객에게 최적의 적합성 평가 서비스 제공
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Award className="h-8 w-8 text-green-600 mb-2" />
                      <CardTitle>핵심가치</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        공평성, 전문성, 신뢰성, 혁신성
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 연혁 */}
              <TabsContent value="history" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">ESG 인증원의 발자취</CardTitle>
                    <CardDescription>
                      2020년 설립 이후 꾸준한 성장을 이어가고 있습니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      {timelineData.map((yearData, yearIndex) => (
                        <div key={yearData.year} className="relative mb-12">
                          {/* Year Badge */}
                          <div 
                            className="absolute left-0 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-green-700 transition-colors"
                            onClick={() => setSelectedYear(selectedYear === yearData.year ? null : yearData.year)}
                          >
                            {yearData.year}
                          </div>
                          
                          {/* Events */}
                          <div className={`ml-24 space-y-4 transition-all duration-300 ${
                            selectedYear === null || selectedYear === yearData.year 
                              ? 'opacity-100' 
                              : 'opacity-30'
                          }`}>
                            {yearData.events.map((event, eventIndex) => (
                              <div key={eventIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <div className="flex items-start gap-3">
                                  <Badge variant="outline" className="mt-0.5">
                                    {event.month}월
                                  </Badge>
                                  <p className="text-gray-700">{event.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 주요 성과 */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">1,000+</div>
                      <p className="text-gray-600">누적 인증 기업</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                      <p className="text-gray-600">전문 심사원</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                      <p className="text-gray-600">고객 만족도</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">15일</div>
                      <p className="text-gray-600">평균 인증 기간</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 조직도 */}
              <TabsContent value="organization" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">조직 구성</CardTitle>
                    <CardDescription>
                      전문성과 효율성을 갖춘 조직 체계로 운영됩니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* CEO */}
                    <div className="text-center mb-8">
                      <div className="inline-block">
                        <Card className="bg-green-600 text-white">
                          <CardContent className="p-4">
                            <Briefcase className="h-8 w-8 mx-auto mb-2" />
                            <h3 className="font-bold">{organizationStructure.ceo.title}</h3>
                            <p>{organizationStructure.ceo.name}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Departments */}
                    <div className="grid md:grid-cols-3 gap-6">
                      {organizationStructure.ceo.departments.map((dept, deptIndex) => (
                        <div key={deptIndex}>
                          <Card className="bg-green-50 mb-4">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-center text-green-800">
                                {dept.title}
                              </h4>
                            </CardContent>
                          </Card>
                          
                          <div className="space-y-2">
                            {dept.teams.map((team, teamIndex) => (
                              <Card key={teamIndex}>
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{team.name}</span>
                                    <Badge variant="secondary">{team.members}명</Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Staff */}
                    <div className="mt-8 text-center">
                      <Card className="inline-block">
                        <CardContent className="p-6">
                          <Users className="h-12 w-12 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold">총 44명</div>
                          <p className="text-gray-600">전체 임직원</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 공평성 선언 */}
              <TabsContent value="impartiality" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">공평성 선언</CardTitle>
                    <CardDescription>
                      ESG 인증원은 공평하고 투명한 인증 서비스를 약속합니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-green-50 p-6 rounded-lg">
                      <p className="text-lg text-center text-green-800 font-medium">
                        "ESG 인증원은 모든 인증 활동에 있어 공평성을 최우선 가치로 하며,<br />
                        어떠한 내외부 압력에도 영향받지 않는 독립적이고 객관적인 심사를 수행할 것을 선언합니다."
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {impartialityPrinciples.map((principle, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <div className="text-green-600">{principle.icon}</div>
                              <CardTitle className="text-lg">{principle.title}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{principle.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 공평성 보장 체계 */}
                    <Card className="mt-8">
                      <CardHeader>
                        <CardTitle>공평성 보장 체계</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>독립적인 공평성위원회 운영을 통한 정기적인 모니터링</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>이해상충 방지를 위한 엄격한 내부 규정 및 윤리강령 준수</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>심사원의 독립성 보장을 위한 정기적인 교육 및 평가</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>고객 불만 및 이의제기에 대한 투명한 처리 절차 운영</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                            <span>인증 결정 과정의 투명성 확보 및 문서화</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Download Button */}
                    <div className="text-center pt-4">
                      <Button variant="outline">
                        <Shield className="h-4 w-4 mr-2" />
                        공평성 선언문 다운로드
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              ESG 인증원과 함께하세요
            </h2>
            <p className="text-xl mb-8 text-green-100">
              신뢰할 수 있는 인증 파트너가 되겠습니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100"
                asChild
              >
                <Link href="/esg-certification/apply">
                  인증 신청하기 <ChevronRight className="ml-2 h-5 w-5" />
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
          </div>
        </div>
      </section>
    </main>
  );
} 