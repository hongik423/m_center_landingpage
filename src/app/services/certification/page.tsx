'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';

import { 
  Award, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  DollarSign,
  Clock,
  Shield,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Phone,
  ArrowRight,
  ChevronDown,
  Building,
  Globe,
  Users,
  Sparkles,
  FileText,
  Calculator,
  AlertCircle,
  CheckCircle2,
  Play,
  ExternalLink
} from 'lucide-react';

// Apple Store 스타일 인증 서비스 데이터
const certificationServices = [
  {
    id: 'venture',
    title: '벤처기업확인',
    subtitle: '세제혜택 연간 1-2억원',
    description: '스톡옵션 비과세, 정책자금 우대금리로 기업 성장 가속화',
    icon: Target,
    price: '300만원',
    duration: '2-3개월',
    benefits: ['스톡옵션 비과세 5억원', '정책자금 우대금리 0.5%p', '정부지원사업 가점'],
    features: [
      '기술평가 방식 대응',
      '사업화계획서 작성',
      '투자유치 전략',
      '벤처캐피털 IR 지원'
    ],
    image: '/images/VENTURE.png'
  },
  {
    id: 'research-institute',
    title: '기업부설연구소',
    subtitle: 'R&D 세액공제 최대 40%',
    description: '연구개발비 세제혜택 및 정부지원 자격으로 혁신 기반 구축',
    icon: Building,
    price: '500만원',
    duration: '2-3개월',
    benefits: ['세액공제 최대 40%', '정부 R&D 과제 신청 자격', '우수인력 채용 지원'],
    features: [
      '설립신고서 작성',
      '연구시설 및 장비 컨설팅',
      '연구인력 채용 전략',
      '연구과제 관리 시스템'
    ],
    image: '/images/LAB.png'
  },
  {
    id: 'innobiz',
    title: '이노비즈/메인비즈',
    subtitle: '정책자금 우대 및 판로지원',
    description: '기술혁신형/경영혁신형 중소기업 인증으로 경쟁력 강화',
    icon: Star,
    price: '800만원',
    duration: '3-4개월',
    benefits: ['정책자금 우대금리', '온라인 판로개척', '해외진출 지원'],
    features: [
      'R&D 투자 최적화',
      '지식재산권 전략',
      '품질경영시스템',
      '생산성 향상 프로그램'
    ],
    image: '/images/INNOVIZ.png'
  },
  {
    id: 'iso',
    title: 'ISO 인증 시리즈',
    subtitle: '품질·환경·안전 통합인증',
    description: '국제표준 품질경영시스템 구축으로 글로벌 경쟁력 확보',
    icon: Globe,
    price: '1,500만원',
    duration: '4-6개월',
    benefits: ['대기업 납품 자격', '해외진출 기반', '품질 신뢰도 제고'],
    features: [
      'ISO 9001 품질경영',
      'ISO 14001 환경경영',
      'ISO 45001 안전보건',
      'ISO 27001 정보보안'
    ],
    image: '/images/ISO.png'
  },
  {
    id: 'esg',
    title: 'ESG 인증',
    subtitle: '지속가능경영 체계 구축',
    description: '환경·사회·지배구조 종합 관리로 미래 가치 창출',
    icon: Shield,
    price: '3,000만원',
    duration: '6-8개월',
    benefits: ['대기업 파트너십', '해외진출 필수', 'ESG 투자 유치'],
    features: [
      '탄소중립 실행계획',
      '사회적 책임 경영',
      '투명경영 시스템',
      'ESG 성과 공개'
    ],
    image: '/images/ESG.png'
  }
];

// Apple Store 스타일 성장 단계
const growthStages = [
  {
    stage: 'Step 1',
    period: '1-3년',
    title: '신뢰받는 기업의 첫 걸음',
          certifications: ['벤처확인', '연구소설립'],
    effect: '세제혜택 확보 + 정부지원 기반'
  },
  {
    stage: 'Step 2',
    period: '3-7년',
    title: '경쟁력 강화 종합 체계',
          certifications: ['이노비즈/메인비즈', 'ISO 9001'],
      effect: '시장 신뢰도 + 대기업 납품 자격'
  },
  {
    stage: 'Step 3',
    period: '7-10년',
    title: '글로벌 진출 국제 인증',
    certifications: ['ISO 전영역', 'ESG 인증'],
    effect: '해외 진출 + 대기업 파트너십'
  },
  {
    stage: 'Step 4',
    period: '10년+',
    title: '산업 리더 사회적 책임',
          certifications: ['ESG 경영 고도화', 'R&D 허브'],
      effect: '지속가능경영 + 생태계 주도권'
  }
];

// ROI 데이터
const roiData = [
  {
    type: '연구소설립',
    cost: '500만원',
    effect: '5,000만원 (세액공제)',
    roi: '1,000%',
    period: '1개월',
    highlight: true
  },
  {
    type: '벤처확인',
    cost: '300만원',
    effect: '2,000만원 (금융+세제)',
    roi: '667%',
    period: '2개월',
    highlight: false
  },
  {
    type: '이노비즈',
    cost: '800만원',
    effect: '3,000만원 (금융+판로)',
    roi: '375%',
    period: '3개월',
    highlight: false
  },
  {
    type: 'ISO 9001',
    cost: '1,500만원',
    effect: '1억원 (매출 증대)',
    roi: '667%',
    period: '2개월',
    highlight: true
  },
  {
    type: 'ESG 인증',
    cost: '3,000만원',
    effect: '5억원 (대기업 납품)',
    roi: '1,667%',
    period: '1개월',
    highlight: true
  }
];

export default function CertificationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Apple Store 스타일 Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-8">
              <Award className="w-4 h-4 mr-2" />
              ISO/ESG인증·연구소설립·벤처확인 통합 컨설팅
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              기업 성장을 위한
              <br />
              <span className="text-blue-600">전략적 인증</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              5대 핵심 인증을 통해 연간 5천만원 이상의 세제혜택과 정부지원을 확보하고, 
              기업의 지속가능한 성장을 실현하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/diagnosis">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                  무료 진단 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#services">
                <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200">
                  <Play className="w-5 h-5 mr-2" />
                  서비스 둘러보기
                </Button>
              </Link>
            </div>
          </div>

          {/* 실시간 성과 지표 - Apple 스타일 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: '누적 인증 기업', value: '500+', icon: Building },
              { label: '평균 세제 혜택', value: '5천만원', icon: DollarSign },
              { label: '인증 성공률', value: '98%', icon: Target },
              { label: '고객 만족도', value: '96%', icon: Star }
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

      {/* Apple Store 스타일 성장 단계 */}
      <section id="roadmap" className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              기업 성장 단계별 전략
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              체계적인 인증 로드맵으로 단계별 성과를 달성하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {growthStages.map((stage, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mr-4">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-600 mb-1">{stage.stage}</div>
                    <div className="text-sm text-gray-500">{stage.period}</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {stage.title}
                </h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">필수 인증</h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.certifications.map((cert, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">기대 효과</h4>
                  <p className="text-blue-800 font-medium">{stage.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apple Store 스타일 서비스 섹션 */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              5대 핵심 인증 서비스
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              기업 성장 단계별 맞춤형 인증으로 세제혜택과 정부지원을 확보하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {certificationServices.map((service, index) => (
              <div key={service.id} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                {/* 이미지 섹션 */}
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-blue-600">{service.subtitle}</div>
                </div>
                
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  {service.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-2xl inline-block">
                    <div className="text-sm text-gray-600 mb-1">소요기간</div>
                    <div className="text-2xl font-bold text-gray-900">{service.duration}</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-bold text-gray-900">주요 혜택</h4>
                  <div className="space-y-3">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/consultation">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                    상담 신청하기
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apple Store 스타일 ROI 섹션 */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              투자 효과 분석
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              단계별 투자 대비 확실한 효과로 기업 가치를 극대화하세요
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-6 px-4 text-lg font-bold text-gray-900">인증 유형</th>
                    <th className="text-center py-6 px-4 text-lg font-bold text-gray-900">연간 효과</th>
                    <th className="text-center py-6 px-4 text-lg font-bold text-gray-900">ROI</th>
                    <th className="text-center py-6 px-4 text-lg font-bold text-gray-900">회수 기간</th>
                  </tr>
                </thead>
                <tbody>
                  {roiData.map((item, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${item.highlight ? 'bg-blue-50' : ''}`}>
                      <td className="py-6 px-4">
                        <div className="flex items-center">
                          {item.highlight && <Star className="w-5 h-5 text-blue-600 mr-2" />}
                          <span className="font-semibold text-gray-900">{item.type}</span>
                        </div>
                      </td>
                      <td className="text-center py-6 px-4 font-medium text-gray-700">{item.effect}</td>
                      <td className="text-center py-6 px-4">
                        <span className="font-bold text-blue-600 text-lg">{item.roi}</span>
                      </td>
                      <td className="text-center py-6 px-4 font-medium text-gray-700">{item.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Apple Store 스타일 CTA 섹션 */}
      <section className="py-32 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
            지금 시작하세요
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            전문가와의 무료 상담을 통해 귀하의 기업에 최적화된 인증 전략을 수립하고, 
            확실한 성과를 경험해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/diagnosis">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                무료 진단 받기
              </Button>
            </Link>
            <Link href="/consultation">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg rounded-full font-medium transition-all duration-200">
                <Phone className="w-5 h-5 mr-2" />
                전문가 상담
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 