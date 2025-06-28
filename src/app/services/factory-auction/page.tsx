'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';

import { 
  Factory, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Shield,
  Award,
  Clock,
  DollarSign,
  ArrowLeft,
  Building,
  Calculator,
  MapPin,
  Gavel,
  Search,
  FileText,
  PieChart,
  Lightbulb,
  RefreshCw,
  Briefcase,
  Globe,
  Rocket,
  Eye,
  TrendingDown,
  AlertTriangle,
  Phone,
  Mail,
  Trophy,
  CheckSquare,
  FileCheck,
  Banknote,
  Home,
  Settings,
  ChevronRight
} from 'lucide-react';

export default function FactoryAuctionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Apple Store 스타일 Hero Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-8">
            <Gavel className="w-4 h-4 mr-2" />
            경매활용 공장구매 컨설팅
          </div>
          
          <h1 className="text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            시장가 대비
            <br />
            <span className="text-blue-600">40% 절약</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Business Model Zen 프레임워크 기반으로 입지분석·사업타당성 검토부터 
            정책자금 연계까지 통합 제공하는 차별화된 공장구매 컨설팅 서비스
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
              onClick={() => router.push('/consultation')}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                전문가 상담 신청
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] hover:shadow-md relative overflow-hidden group"
              onClick={() => router.push('/diagnosis')}
            >
              <span className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                무료 투자 진단
              </span>
            </Button>
          </div>

          {/* 핵심 지표 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: '평균 절약률', value: '40%', icon: TrendingDown },
              { label: '성공률', value: '95%', icon: Target },
              { label: '투자 회수 기간', value: '3.2년', icon: Clock },
              { label: '평균 IRR', value: '26.3%', icon: BarChart3 }
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 특징 */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              차별화된 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              단순한 경매 대행이 아닌, 통합 컨설팅 접근으로 투자 성공률을 극대화합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                icon: Users,
                title: '전문가 네트워크',
                description: '부동산 전문 변호사, 세무사, 건축사, 감정평가사, 금융 전문가 팀',
                features: ['권리 분석 및 법적 리스크 관리', '세무 최적화 및 절세 전략', '정확한 시가 산정']
              },
              {
                icon: Zap,
                title: 'AI 기반 분석',
                description: '빅데이터와 머신러닝을 활용한 정밀 분석 시스템',
                features: ['시세 예측 모델', '낙찰가 예측', '투자 수익률 시뮬레이션']
              },
              {
                icon: Shield,
                title: '원스톱 서비스',
                description: '진단부터 사후관리까지 모든 과정을 통합 관리',
                features: ['종합 투자 진단', '정책자금 연계', '6개월 무상 사후관리']
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-32 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
            지금 시작하세요
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            전문가와의 무료 상담을 통해 최적의 공장구매 전략을 수립하고, 
            확실한 투자 성과를 경험해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-lg hover:shadow-xl relative overflow-hidden group"
              onClick={() => router.push('/consultation')}
            >
              <span className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Phone className="w-5 h-5 mr-2 group-hover:animate-pulse transition-transform duration-200" />
                무료 상담 신청
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] relative overflow-hidden group"
              onClick={() => router.push('/diagnosis')}
            >
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                투자 진단 받기
              </span>
            </Button>
          </div>

          {/* 연락처 정보 */}
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span className="font-medium">010-9251-9743</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">hongik423@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 