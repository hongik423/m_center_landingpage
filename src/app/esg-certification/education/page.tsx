'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Users, 
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Download,
  MapPin,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EducationPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const educationCourses = [
    {
      id: 'iso9001-internal',
      category: 'ISO 9001',
      title: 'ISO 9001 내부심사원 양성과정',
      duration: '3일 (21시간)',
      level: '중급',
      price: '450,000원',
      description: '품질경영시스템 내부심사원 자격 취득 과정',
      objectives: [
        'ISO 9001 요구사항 이해',
        '내부심사 기법 습득',
        '부적합 보고서 작성',
        '시정조치 요구 및 검증'
      ],
      target: '품질관리 담당자, 내부심사원 희망자',
      certification: '수료증 및 내부심사원 자격증 발급'
    },
    {
      id: 'iso14001-internal',
      category: 'ISO 14001',
      title: 'ISO 14001 내부심사원 양성과정',
      duration: '3일 (21시간)',
      level: '중급',
      price: '450,000원',
      description: '환경경영시스템 내부심사원 자격 취득 과정',
      objectives: [
        'ISO 14001 요구사항 이해',
        '환경측면 파악 및 평가',
        '환경법규 준수 평가',
        '내부심사 실습'
      ],
      target: '환경관리 담당자, 내부심사원 희망자',
      certification: '수료증 및 내부심사원 자격증 발급'
    },
    {
      id: 'iso45001-internal',
      category: 'ISO 45001',
      title: 'ISO 45001 내부심사원 양성과정',
      duration: '3일 (21시간)',
      level: '중급',
      price: '450,000원',
      description: '안전보건경영시스템 내부심사원 자격 취득 과정',
      objectives: [
        'ISO 45001 요구사항 이해',
        '위험성평가 방법론',
        '안전보건 법규 이해',
        '사고조사 및 개선'
      ],
      target: '안전보건 담당자, 내부심사원 희망자',
      certification: '수료증 및 내부심사원 자격증 발급'
    },
    {
      id: 'esg-basic',
      category: 'ESG',
      title: 'ESG 경영 기본과정',
      duration: '2일 (14시간)',
      level: '초급',
      price: '350,000원',
      description: 'ESG 경영의 이해와 실무 적용 방법',
      objectives: [
        'ESG 개념 및 중요성 이해',
        '국내외 ESG 평가 기준',
        'ESG 경영전략 수립',
        'ESG 보고서 작성 기초'
      ],
      target: '경영진, ESG 담당자, 전략기획 담당자',
      certification: '수료증 발급'
    },
    {
      id: 'integrated-system',
      category: '통합과정',
      title: '통합경영시스템 구축과정',
      duration: '5일 (35시간)',
      level: '고급',
      price: '750,000원',
      description: 'ISO 9001/14001/45001 통합 구축 및 운영',
      objectives: [
        '통합경영시스템 설계',
        '프로세스 통합 방법',
        '문서 및 기록 통합관리',
        '통합 내부심사 기법'
      ],
      target: '경영시스템 관리자, 품질/환경/안전 통합 담당자',
      certification: '수료증 및 통합심사원 자격증 발급'
    }
  ];

  const educationSchedule = [
    {
      courseId: 'iso9001-internal',
      date: '2024.03.13-15',
      location: '서울',
      status: 'open',
      seats: '12/20'
    },
    {
      courseId: 'iso14001-internal',
      date: '2024.03.20-22',
      location: '서울',
      status: 'open',
      seats: '8/20'
    },
    {
      courseId: 'esg-basic',
      date: '2024.03.27-28',
      location: '온라인',
      status: 'open',
      seats: '25/30'
    },
    {
      courseId: 'iso45001-internal',
      date: '2024.04.03-05',
      location: '부산',
      status: 'open',
      seats: '15/20'
    },
    {
      courseId: 'integrated-system',
      date: '2024.04.15-19',
      location: '서울',
      status: 'waiting',
      seats: '20/20'
    }
  ];

  const getCourseById = (courseId: string) => {
    return educationCourses.find(course => course.id === courseId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              교육 서비스
            </h1>
            <p className="text-xl text-gray-100">
              전문가와 함께하는 체계적인 인증 교육 프로그램<br />
              실무 중심의 교육으로 즉시 적용 가능한 역량 강화
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">교육 과정 안내</h2>
              <p className="text-gray-600">
                기업의 니즈에 맞는 다양한 교육 프로그램을 제공합니다
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="ISO 9001">ISO 9001</TabsTrigger>
                <TabsTrigger value="ISO 14001">ISO 14001</TabsTrigger>
                <TabsTrigger value="ISO 45001">ISO 45001</TabsTrigger>
                <TabsTrigger value="ESG">ESG/통합</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {educationCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className="mb-2">{course.category}</Badge>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {course.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {course.level}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">교육 목표</h4>
                          <ul className="space-y-1">
                            {course.objectives.map((objective, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>교육시간: {course.duration}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span>대상: {course.target}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{course.certification}</span>
                          </div>
                          <div className="flex items-center text-sm font-semibold">
                            <span className="text-lg text-green-600">{course.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedCourse(course.id)}
                        >
                          상세 정보
                        </Button>
                        <Button asChild>
                          <Link href={`/esg-certification/education/apply?course=${course.id}`}>
                            교육 신청
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {['ISO 9001', 'ISO 14001', 'ISO 45001', 'ESG'].map((category) => (
                <TabsContent key={category} value={category} className="space-y-6">
                  {educationCourses
                    .filter(course => 
                      category === 'ESG' 
                        ? course.category === 'ESG' || course.category === '통합과정'
                        : course.category === category
                    )
                    .map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge className="mb-2">{course.category}</Badge>
                              <CardTitle className="text-xl">{course.title}</CardTitle>
                              <CardDescription className="mt-2">
                                {course.description}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              {course.level}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2">교육 목표</h4>
                              <ul className="space-y-1">
                                {course.objectives.map((objective, idx) => (
                                  <li key={idx} className="flex items-start text-sm text-gray-600">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                <span>교육시간: {course.duration}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 text-gray-400 mr-2" />
                                <span>대상: {course.target}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Award className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{course.certification}</span>
                              </div>
                              <div className="flex items-center text-sm font-semibold">
                                <span className="text-lg text-green-600">{course.price}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex gap-3">
                            <Button 
                              variant="outline"
                              onClick={() => setSelectedCourse(course.id)}
                            >
                              상세 정보
                            </Button>
                            <Button asChild>
                              <Link href={`/esg-certification/education/apply?course=${course.id}`}>
                                교육 신청
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Education Schedule */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">교육 일정</h2>
              <p className="text-gray-600">
                향후 3개월간 진행되는 교육 일정입니다
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        교육과정
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        일정
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        장소
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신청현황
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신청
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {educationSchedule.map((schedule, idx) => {
                      const course = getCourseById(schedule.courseId);
                      if (!course) return null;
                      
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {course.duration}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              {schedule.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              {schedule.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {schedule.seats}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={schedule.status === 'open' ? 'default' : 'secondary'}
                              className={schedule.status === 'open' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {schedule.status === 'open' ? '모집중' : '대기'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              size="sm" 
                              variant={schedule.status === 'open' ? 'default' : 'outline'}
                              disabled={schedule.status !== 'open'}
                              asChild
                            >
                              <Link href={`/esg-certification/education/apply?course=${schedule.courseId}&date=${schedule.date}`}>
                                신청
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/esg-certification/education/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  전체 일정 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">교육 특전</h2>
              <p className="text-gray-600">
                ESG 인증원 교육 수료 시 제공되는 혜택
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    공식 수료증 발급
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    KAB 인정 인증기관의 공식 수료증으로 내부심사원 자격 인정
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    교육 자료 제공
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    실무에 즉시 활용 가능한 템플릿, 체크리스트, 가이드라인 제공
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    네트워킹 기회
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    동종업계 전문가들과의 교류 및 정보 공유 기회 제공
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    사후 지원
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    교육 후 6개월간 무료 Q&A 서비스 및 추가 자료 제공
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>교육 신청 안내</strong>
                <ul className="mt-2 space-y-1">
                  <li>• 교육 시작 7일 전까지 신청 가능합니다.</li>
                  <li>• 최소 인원(10명) 미달 시 교육이 취소될 수 있습니다.</li>
                  <li>• 기업 맞춤형 출강 교육도 가능합니다. (별도 문의)</li>
                  <li>• 교육비는 계산서 발행 가능하며, 교육 시작 전 납부해주셔야 합니다.</li>
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
              전문가와 함께 성장하세요
            </h2>
            <p className="text-xl mb-8 text-green-100">
              실무 중심의 교육으로 기업의 경쟁력을 높이세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-700 hover:bg-gray-100"
                asChild
              >
                <Link href="/esg-certification/education/apply">
                  교육 신청하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/esg-certification/education/inquiry">
                  교육 문의하기
                </Link>
              </Button>
            </div>
            <div className="mt-8">
              <Button
                variant="link"
                className="text-white hover:text-green-100"
                asChild
              >
                <Link href="/docs/education-catalog.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  교육 과정 카탈로그 다운로드
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 