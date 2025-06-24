'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Rocket, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Award,
  Clock,
  ArrowLeft,
  Target,
  Lightbulb,
  DollarSign
} from 'lucide-react';

export default function TechStartupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '평균 5억원 자금 확보',
      description: '정부지원 연계로 대규모 자금 확보',
      icon: DollarSign
    },
    {
      title: '성공률 85%',
      description: '검증된 방법론으로 높은 성공률',
      icon: Award
    },
    {
      title: '3년 사후관리',
      description: '사업화 성공까지 지속적 지원',
      icon: Shield
    },
    {
      title: '성공보수제',
      description: '성공 시에만 수수료 지불',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
              <span className="text-green-600 font-medium">기술사업화/기술창업</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
                  <Rocket className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">평균 5억원 자금 확보</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    기술사업화/기술창업
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>정부지원 연계 기술사업화</strong>로 
                  평균 5억원 자금을 확보하고 성공적인 창업을 시작하세요.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    평균 5억원 확보
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Award className="w-4 h-4 mr-2" />
                    성공률 85%
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    3년 사후관리
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    창업 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    사업 적합성 진단
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">6-12개월</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">평균 자금 확보</span>
                      <span className="font-semibold text-green-600">5억원</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">성공률</span>
                      <span className="font-semibold text-blue-600">85%</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">수수료</span>
                      <span className="font-semibold">성공보수제</span>
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
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-green-600" />
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              성공적인 기술창업을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-green-100">
              정부지원 연계로 평균 5억원 자금을 확보하고 
              85% 성공률로 안전하게 창업하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Rocket className="w-5 h-5 mr-2" />
                창업 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Lightbulb className="w-5 h-5 mr-2" />
                사업 적합성 진단
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 