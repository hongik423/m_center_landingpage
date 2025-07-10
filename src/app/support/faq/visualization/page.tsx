'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  LineChart, 
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Phone,
  Download
} from 'lucide-react';
import Header from '@/components/layout/header';
import { 
  ServiceEcosystem, 
  ROIComparison, 
  GrowthStageMapping, 
  EffectComparison,
  ComprehensiveDashboard 
} from '@/components/ui/service-visualization';
import Link from 'next/link';

export default function VisualizationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const visualizationTabs = [
    {
      id: 'overview',
      label: '종합 대시보드',
      icon: BarChart3,
      description: '전체 서비스 성과 요약'
    },
    {
      id: 'ecosystem',
      label: '서비스 생태계',
      icon: PieChart,
      description: 'BM ZEN 중심 연관 서비스'
    },
    {
      id: 'roi',
      label: 'ROI 비교',
      icon: TrendingUp,
      description: '투자 대비 수익률 분석'
    },
    {
      id: 'growth',
      label: '성장 단계',
      icon: LineChart,
      description: '기업 성장별 서비스 매핑'
    }
  ];

  const handleConsultation = () => {
    window.location.href = '/consultation';
  };

  const handleDownload = () => {
    // PDF 다운로드 로직 (추후 구현)
    alert('PDF 다운로드 기능은 준비 중입니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* 히어로 섹션 */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Link href="/support/faq">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Q&A로 돌아가기
              </Button>
            </Link>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              PDF 다운로드
            </Button>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              M-CENTER
            </span>
            <br />
            서비스 시각화 자료
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            직관적 이해를 돕는 데이터 시각화로<br />
            M-CENTER의 6개 서비스 효과를 한눈에 확인하세요
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            {visualizationTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* 탭 콘텐츠 */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  종합 대시보드
                </CardTitle>
                <p className="text-gray-600">
                  M-CENTER의 전체 서비스 성과와 효과를 종합적으로 보여주는 대시보드입니다.
                </p>
              </CardHeader>
              <CardContent>
                <ComprehensiveDashboard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ecosystem" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-blue-600" />
                  서비스 생태계
                </CardTitle>
                <p className="text-gray-600">
                  BM ZEN 사업분석을 중심으로 한 M-CENTER의 통합 서비스 생태계를 보여줍니다.
                </p>
              </CardHeader>
              <CardContent>
                <ServiceEcosystem />
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 서비스 연계 효과</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <strong>BM ZEN + AI 생산성:</strong><br />
                      전략 수립 + 실행력 강화 = 종합 ROI 500-1200%
                    </div>
                    <div>
                      <strong>BM ZEN + 웹사이트:</strong><br />
                      비즈니스 전략 + 온라인 마케팅 = 매출 3배 증가
                    </div>
                    <div>
                      <strong>기술사업화 + 인증:</strong><br />
                      자금 확보 + 신뢰도 향상 = 성공 확률 95%
                    </div>
                    <div>
                      <strong>경매공장 + AI:</strong><br />
                      고정비 절감 + 생산성 향상 = 경쟁력 3배
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  ROI 비교 분석
                </CardTitle>
                <p className="text-gray-600">
                  각 서비스별 투자 대비 수익률을 비교하여 최적의 서비스 조합을 제안합니다.
                </p>
              </CardHeader>
              <CardContent>
                <ROIComparison />
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">🏆 최고 ROI</h4>
                    <p className="text-sm text-green-800">
                      <strong>기술사업화:</strong> 최대 2000%<br />
                      평균 5억원 자금 확보
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">⚡ 최고 효율</h4>
                    <p className="text-sm text-blue-800">
                      <strong>AI 생산성:</strong> 최대 1000%<br />
                      정부지원 100% 가능
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🎯 균형잡힌</h4>
                    <p className="text-sm text-purple-800">
                      <strong>BM ZEN:</strong> 300-800%<br />
                      95% 성공률 보장
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-6 h-6 text-purple-600" />
                  기업 성장 단계별 서비스 매핑
                </CardTitle>
                <p className="text-gray-600">
                  기업의 성장 단계에 따른 최적의 서비스 조합을 제안합니다.
                </p>
              </CardHeader>
              <CardContent>
                <GrowthStageMapping />
                
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📊 단계별 성과 예측</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">5억원</div>
                      <div className="text-sm text-green-800">창업기 평균 자금확보</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">35%</div>
                      <div className="text-sm text-blue-800">성장기 매출 증대</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">3배</div>
                      <div className="text-sm text-purple-800">확장기 시장점유율</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">10년+</div>
                      <div className="text-sm text-orange-800">안정기 지속성장</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 효과 비교 섹션 */}
        <div className="mt-12">
          <EffectComparison />
        </div>

        {/* 상담 신청 CTA */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                데이터로 검증된 M-CENTER의 성과
              </h3>
              <p className="text-lg mb-6 opacity-90">
                25년 전문가 경험 × 500개 기업 성공 사례 × 95% 성공률
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleConsultation}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  무료 상담 신청
                </Button>
                
                <Link href="/support/faq">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Q&A 더 보기
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 추가 정보 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📊 데이터 신뢰성</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                모든 수치는 실제 컨설팅 결과를 기반으로 하며, 
                25년간 축적된 데이터를 분석하여 제공됩니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎯 성과 보장</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                제시된 성과 달성을 보장하며, 
                미달성 시 추가 지원 또는 환불 정책을 운영합니다.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔄 지속 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                서비스 완료 후에도 지속적인 모니터링과 
                사후 관리를 통해 성과를 유지합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
} 