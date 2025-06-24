'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Award, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Clock,
  ArrowLeft,
  Target,
  FileCheck,
  DollarSign
} from 'lucide-react';

export default function CertificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '5천만원 세제혜택',
      description: '연간 최대 5천만원 세제혜택 확보',
      icon: DollarSign
    },
    {
      title: '통합 인증 관리',
      description: '벤처·ISO·ESG 인증을 통합 관리',
      icon: FileCheck
    },
    {
      title: '100% 취득 보장',
      description: '조건 충족 시 100% 인증 취득 보장',
      icon: Award
    },
    {
      title: '전문가 지원',
      description: '인증 전문가의 체계적 지원',
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/services')}
                className="p-0 h-auto font-normal"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                서비스 목록
              </Button>
              <span>/</span>
              <span className="text-blue-600 font-medium">인증지원</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-6">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">연간 5천만원 세제혜택</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    인증지원
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>벤처·ISO·ESG 통합 인증</strong>으로 
                  연간 5천만원 세제혜택을 확보하세요.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    5천만원 세제혜택
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <FileCheck className="w-4 h-4 mr-2" />
                    통합 인증 관리
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    100% 취득 보장
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    인증 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    인증 적합성 진단
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">2-4개월</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">세제혜택</span>
                      <span className="font-semibold text-green-600">5천만원</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">취득 보장</span>
                      <span className="font-semibold text-blue-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">비용</span>
                      <span className="font-semibold">300만원~</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              서비스 핵심 특징
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center p-6 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              지금 바로 인증을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              벤처·ISO·ESG 통합 인증으로 연간 5천만원 세제혜택을 확보하고 
              100% 취득 보장으로 안전하게 진행하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Award className="w-5 h-5 mr-2" />
                인증 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <FileCheck className="w-5 h-5 mr-2" />
                인증 적합성 진단
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 