'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { 
  Globe, 
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Clock,
  ArrowLeft,
  Target,
  Smartphone,
  DollarSign,
  Brain
} from 'lucide-react';

export default function WebsitePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      title: '온라인 매출 30% 증대',
      description: 'AI 기반 최적화로 매출 증대 효과',
      icon: TrendingUp
    },
    {
      title: 'AI 기반 최적화',
      description: '인공지능 기술을 활용한 스마트 웹사이트',
      icon: Brain
    },
    {
      title: '무료 1년 관리',
      description: '구축 후 1년간 무료 유지보수 제공',
      icon: Shield
    },
    {
      title: '모바일 최적화',
      description: '모든 디바이스에서 완벽한 사용자 경험',
      icon: Smartphone
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
              <span className="text-indigo-600 font-medium">웹사이트 구축</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-6">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-800">온라인 매출 30% 증대</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    웹사이트 구축
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                  <strong>AI 기반 디지털 혁신</strong>으로 
                  온라인 매출을 30% 증대시키는 웹사이트를 구축하세요.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    매출 30% 증대
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Brain className="w-4 h-4 mr-2" />
                    AI 기반 최적화
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    무료 1년 관리
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4"
                    onClick={() => router.push('/consultation')}
                  >
                    웹사이트 상담 신청
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-4"
                    onClick={() => router.push('/diagnosis')}
                  >
                    프로젝트 적합성 진단
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">서비스 개요</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">진행 기간</span>
                      <span className="font-semibold">1-3개월</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">매출 증대</span>
                      <span className="font-semibold text-green-600">30%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">무료 관리</span>
                      <span className="font-semibold text-indigo-600">1년</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">비용</span>
                      <span className="font-semibold">500만원~</span>
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
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-indigo-600" />
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
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              디지털 혁신을 시작하세요!
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              AI 기반 웹사이트로 온라인 매출을 30% 증대시키고 
              1년 무료 관리로 안정적인 운영을 보장받으세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4"
                onClick={() => router.push('/consultation')}
              >
                <Globe className="w-5 h-5 mr-2" />
                웹사이트 상담 신청
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4"
                onClick={() => router.push('/diagnosis')}
              >
                <Smartphone className="w-5 h-5 mr-2" />
                프로젝트 적합성 진단
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 