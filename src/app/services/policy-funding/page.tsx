'use client';

import React, { useState } from 'react';
import { Calculator, TrendingUp, CheckCircle, Building2, ChevronDown, ChevronUp, Target, Award, Clock, Star, Zap, Shield, Users, ArrowRight, Play, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { performInvestmentAnalysis } from '@/lib/utils/investment-analysis';
import InvestmentResultDisplay from '@/components/investment-analysis/InvestmentResultDisplay';
import DSCRDetailedAnalysis from '@/components/investment-analysis/DSCRDetailedAnalysis';
import type { InvestmentResult } from '@/lib/utils/investment-analysis';

export default function PolicyFundingPage() {
  const { toast } = useToast();
  
  // 투자정보 입력 상태 관리
  const [investmentInput, setInvestmentInput] = useState({
    initialInvestment: 500000000, // 5억원
    annualRevenue: 1200000000, // 12억원
    operatingProfitRate: 15, // 영업이익률 15%
    discountRate: 10, // 할인율 10%
    analysisYears: 10, // 분석기간 10년
    // DSCR 계산을 위한 부채 정보
    policyLoanAmount: 350000000, // 정책자금융자액 3.5억원 (초기투자액의 70%)
    policyLoanRate: 2.5, // 정책자금 이자율 2.5%
    otherDebtAmount: 0, // 기타채무액
    otherDebtRate: 5.0, // 기타채무 이자율 5.0%
  });

  // 분석 결과 상태 관리
  const [analysisResult, setAnalysisResult] = useState<InvestmentResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // 고급설정 패널 상태 관리
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    revenueGrowthRate: 5, // 매출성장률 5%
    costInflationRate: 3, // 비용상승률 3%
    debtRatio: 30, // 부채비율 30%
    workingCapitalRatio: 15, // 운전자본비율 15%
    depreciationRate: 10, // 감가상각률 10%
    taxRate: 25, // 법인세율 25%
    scenarioType: 'neutral' as 'pessimistic' | 'neutral' | 'optimistic',
  });

  // 성과 지표 데이터 (이미지 기반)
  const performanceMetrics = [
    { value: 95, label: "선정 성공률", unit: "%", trend: "+12%", icon: Target, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
    { value: 25, label: "평균 처리기간", unit: "일", trend: "-5일", icon: Clock, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
    { value: 4.2, label: "평균 확보금액", unit: "억원", trend: "+8%", icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
    { value: 800, label: "성공 사례", unit: "+", trend: "+156", icon: Award, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" }
  ];

  // AI 기반 분석 시스템 특징
  const aiFeatures = [
    {
      icon: Shield,
      title: "무자산담보 요구",
      description: "담보 없이도 신용평가만으로 정책자금 확보 가능",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Zap,
      title: "AI 신용평가",
      description: "빅데이터 기반의 정밀한 기업 신용도 분석",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Star,
      title: "금액대출 해결",
      description: "맞춤형 정책자금 매칭으로 최적 대출 조건 제시",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  // 투자타당성 분석 실행
  const handleInvestmentAnalysis = async () => {
    setIsCalculating(true);
    try {
      // 연도별 DSCR 상세 데이터 계산
      const yearlyDSCRData = calculateYearlyDSCR();
      const dscrData = calculateDSCR();
      
      // 연도별 매출 배열 생성 (성장률 적용)
      const revenueGrowthRate = (advancedSettings.revenueGrowthRate || 5) / 100;
      const annualRevenueArray = [];
      for (let year = 1; year <= investmentInput.analysisYears; year++) {
        const yearlyRevenue = investmentInput.annualRevenue * Math.pow(1 + revenueGrowthRate, year - 1);
        annualRevenueArray.push(yearlyRevenue);
      }
      
      const result = await performInvestmentAnalysis({
        initialInvestment: investmentInput.initialInvestment,
        annualRevenue: annualRevenueArray, // 연도별 매출 배열
        operatingMargin: investmentInput.operatingProfitRate,
        discountRate: investmentInput.discountRate,
        analysisYears: investmentInput.analysisYears,
        // 고급설정 적용
        ...advancedSettings,
        // DSCR 정보 추가 (연도별 상세 데이터 포함)
        policyFundAmount: investmentInput.policyLoanAmount,
        interestRate: investmentInput.policyLoanRate,
        loanPeriod: investmentInput.analysisYears,
        gracePeriod: 0,
        dscrData: dscrData,
        yearlyDSCRData: yearlyDSCRData, // 연도별 DSCR 상세 데이터 추가
      });
      setAnalysisResult(result);
      toast({
        title: "분석 완료",
        description: `투자타당성 분석이 성공적으로 완료되었습니다. 평균 DSCR: ${dscrData.dscr.toFixed(2)}`,
      });
    } catch (error) {
      console.error('분석 에러:', error);
      toast({
        title: "분석 실패",
        description: "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  // 입력값 업데이트 함수
  const updateInvestmentInput = (field: string, value: number) => {
    setInvestmentInput(prev => ({
      ...prev,
      [field]: value * 100000000 // 입력한 값을 억원으로 변환
    }));
  };

  // 백분율 입력값 업데이트
  const updatePercentageInput = (field: string, value: number) => {
    setInvestmentInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 고급설정 업데이트 함수
  const updateAdvancedSettings = (field: string, value: number | string) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // DSCR 연도별 상세 계산 함수
  const calculateYearlyDSCR = () => {
    const analysisYears = investmentInput.analysisYears;
    const yearlyDSCRData = [];
    
    // 매출 성장률 (고급 설정에서 가져오거나 기본값 5%)
    const revenueGrowthRate = (advancedSettings.revenueGrowthRate || 5) / 100;
    
    for (let year = 1; year <= analysisYears; year++) {
      // 연도별 매출액 (성장률 적용)
      const yearlyRevenue = investmentInput.annualRevenue * Math.pow(1 + revenueGrowthRate, year - 1);
      
      // 연도별 영업이익
      const operatingProfitRate = (investmentInput.operatingProfitRate || 15) / 100;
      const yearlyOperatingProfit = yearlyRevenue * operatingProfitRate;
      
      // 연도별 정책자금 잔액 계산 (원금 균등상환 방식)
      const yearlyPolicyLoanPrincipal = investmentInput.policyLoanAmount / analysisYears;
      const remainingPolicyLoan = investmentInput.policyLoanAmount - (yearlyPolicyLoanPrincipal * (year - 1));
      const yearlyPolicyLoanInterest = remainingPolicyLoan * (investmentInput.policyLoanRate / 100);
      
      // 연도별 기타채무 잔액 계산
      const yearlyOtherDebtPrincipal = investmentInput.otherDebtAmount / analysisYears;
      const remainingOtherDebt = investmentInput.otherDebtAmount - (yearlyOtherDebtPrincipal * (year - 1));
      const yearlyOtherDebtInterest = remainingOtherDebt * (investmentInput.otherDebtRate / 100);
      
      // 연도별 총 부채상환액
      const yearlyTotalDebtService = yearlyPolicyLoanPrincipal + yearlyPolicyLoanInterest + 
                                   yearlyOtherDebtPrincipal + yearlyOtherDebtInterest;
      
      // 연도별 DSCR 계산
      const yearlyDSCR = yearlyTotalDebtService > 0 ? yearlyOperatingProfit / yearlyTotalDebtService : 0;
      
      yearlyDSCRData.push({
        year,
        revenue: yearlyRevenue,
        operatingProfit: yearlyOperatingProfit,
        policyLoanPrincipal: yearlyPolicyLoanPrincipal,
        policyLoanInterest: yearlyPolicyLoanInterest,
        remainingPolicyLoan,
        otherDebtPrincipal: yearlyOtherDebtPrincipal,
        otherDebtInterest: yearlyOtherDebtInterest,
        remainingOtherDebt,
        totalDebtService: yearlyTotalDebtService,
        dscr: yearlyDSCR
      });
    }
    
    return yearlyDSCRData;
  };

  // 기존 DSCR 계산 함수 (평균값 계산용)
  const calculateDSCR = () => {
    const yearlyData = calculateYearlyDSCR();
    if (yearlyData.length === 0) return { dscr: 0 };
    
    // 평균 DSCR 계산
    const avgDSCR = yearlyData.reduce((sum, data) => sum + data.dscr, 0) / yearlyData.length;
    
    return {
      operatingProfit: yearlyData[0]?.operatingProfit || 0,
      policyLoanInterest: yearlyData[0]?.policyLoanInterest || 0,
      otherDebtInterest: yearlyData[0]?.otherDebtInterest || 0,
      policyLoanPrincipal: yearlyData[0]?.policyLoanPrincipal || 0,
      otherDebtPrincipal: yearlyData[0]?.otherDebtPrincipal || 0,
      totalDebtService: yearlyData[0]?.totalDebtService || 0,
      dscr: avgDSCR,
      yearlyData
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO Section - 이미지 기반 디자인 */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              중소기업 성장 동력을
              <br />
              <span className="text-yellow-300">확실하게 뒷받침</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Apple Store 수준의 세밀한 검증과 철저한 사후관리 프로세스를 완비한
              <br />
              <span className="text-yellow-200 font-semibold">진단까지 한번에 제공됩니다</span>
            </p>
            
            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                onClick={() => {
                  const diagnosisSection = document.getElementById('diagnosis-section');
                  diagnosisSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                무료 진단 신청하기
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => {
                  const consultationSection = document.getElementById('consultation-section');
                  consultationSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Users className="w-5 h-5 mr-2" />
                상담신청 하기
              </Button>
            </div>
            
            {/* 성과 지표 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {performanceMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-white/20 rounded-full">
                        <IconComponent className="w-8 h-8 text-yellow-300" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl lg:text-4xl font-bold mb-2">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-blue-100 text-sm mb-1">
                        {metric.label}
                      </div>
                      <div className="text-yellow-300 text-xs font-semibold">
                        {metric.trend}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* AI 기반 분석 시스템 섹션 */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🤖 AI 기반 분석 시스템
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              혁신적 AI 기술로 정확하고 빠른 정책자금 매칭 서비스
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`p-8 rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  <div className="text-center">
                    <div className={`inline-flex p-4 rounded-full ${feature.bgColor} mb-6`}>
                      <IconComponent className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 혁신적 듀얼라인 방법론 섹션 */}
      <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              🔄 혁신적 듀얼라인 방법론
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              정책자금 확보와 투자타당성 분석을 동시에 진행하는 통합 컨설팅 시스템
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* 정책자금 확보 라인 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-blue-900">정책자금 확보 라인</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">기업 현황 정밀 진단 및 적합성 평가</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">최적 정책자금 매칭 및 신청서 작성</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">심사 과정 전반 컨설팅 및 사후관리</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">95% 이상의 높은 선정 성공률 보장</span>
                </li>
              </ul>
            </div>
            
            {/* 투자타당성 분석 라인 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900">투자타당성 분석 라인</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">전문가급 NPV, IRR, DSCR 정밀 계산</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">연도별 상세 현금흐름 시나리오 분석</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">리스크 평가 및 민감도 분석 제공</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">AI 기반 투자 포트폴리오 최적화</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 통합 혜택 */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-emerald-200 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4">통합 서비스 특별 혜택</h3>
              <p className="text-lg text-gray-700 mb-6">
                두 라인을 동시에 진행할 경우 <span className="font-bold text-emerald-600">30% 할인</span> 및 
                <span className="font-bold text-emerald-600"> 우선 심사 지원</span>
              </p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  통합 서비스 신청하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기존 투자타당성분석기 섹션 */}
      <div id="diagnosis-section" className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              💼 정책자금투자타당성분석기
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              전문가급 투자분석 알고리즘으로 연도별 상세 NPV 계산과 영업이익률 연계 투자타당성 검토를 제공합니다
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                📊 연도별 NPV 계산
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                💰 억원 단위 자동 변환
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                📈 영업이익률 연계 분석
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                🎯 정책자금 매칭 제안
              </span>
            </div>
          </div>

          {/* 3단계 사용 가이드 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              🔍 3단계 간편 투자분석 가이드
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-bold text-blue-900 mb-2">1단계: 기본정보 입력</h3>
                <p className="text-sm text-blue-700">
                  초기투자액, 예상매출, 영업이익률을<br />
                  억원 단위로 입력해주세요
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-bold text-purple-900 mb-2">2단계: 분석조건 설정</h3>
                <p className="text-sm text-purple-700">
                  할인율과 분석기간을 설정하고<br />
                  '분석 시작' 버튼을 클릭하세요
                </p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-bold text-emerald-900 mb-2">3단계: 결과 확인</h3>
                <p className="text-sm text-emerald-700">
                  NPV, IRR, 투자회수기간 등<br />
                  상세한 분석결과를 확인하세요
                </p>
              </div>
            </div>
          </div>

          {/* 분석 도구 메인 섹션 */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="space-y-8">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Compact Input Section - 1/4 width */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center">
                      <span className="mr-2">📝</span>
                      투자 정보 입력
                    </h3>
                    <p className="text-sm text-green-700">
                      모든 정보를 정확히 입력하면 연도별 상세 분석이 가능합니다.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                        💰 초기 투자액 (억원)
                        <span className="ml-2 text-xs font-normal text-red-500">(필수)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={investmentInput.initialInvestment / 100000000}
                        onChange={(e) => {
                          const value = Number(e.target.value) * 100000000;
                          setInvestmentInput(prev => ({
                            ...prev,
                            initialInvestment: value
                          }));
                        }}
                        className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="5"
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        💡 예: 5 → 5억원으로 자동 계산
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                        📈 예상 연간 매출 (억원)
                        <span className="ml-2 text-xs font-normal text-red-500">(필수)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={investmentInput.annualRevenue / 100000000}
                        onChange={(e) => {
                          const value = Number(e.target.value) * 100000000;
                          setInvestmentInput(prev => ({
                            ...prev,
                            annualRevenue: value
                          }));
                        }}
                        className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="12"
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        예: 12 → 연간 12억원 매출
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center">
                        📊 영업이익률 (%)
                        <span className="ml-2 text-xs font-normal text-red-500">(필수)</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={investmentInput.operatingProfitRate || 15}
                        onChange={(e) => {
                          setInvestmentInput(prev => ({
                            ...prev,
                            operatingProfitRate: Number(e.target.value)
                          }));
                        }}
                        className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="15"
                        required
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        💡 예: 15 → 영업이익률 15% (연도별 상세 NPV 계산에 반영)
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          ⚡ 할인율 (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={investmentInput.discountRate}
                          onChange={(e) => setInvestmentInput(prev => ({
                            ...prev,
                            discountRate: Number(e.target.value)
                          }))}
                          className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          기본값: 10%
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          📅 분석 기간 (년)
                        </label>
                        <input
                          type="number"
                          value={investmentInput.analysisYears}
                          onChange={(e) => setInvestmentInput(prev => ({
                            ...prev,
                            analysisYears: Number(e.target.value)
                          }))}
                          className="w-full p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="10"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          권장: 5-10년
                        </p>
                      </div>
                    </div>

                    {/* DSCR 계산을 위한 부채정보 섹션 */}
                    <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                      <h4 className="font-bold text-yellow-900 mb-3 flex items-center">
                        <span className="mr-2">💳</span>
                        DSCR 계산을 위한 부채 정보
                      </h4>
                      <p className="text-xs text-yellow-700 mb-4">
                        부채상환능력(DSCR) = 영업이익 ÷ (이자 + 원금상환액)
                      </p>
                      
                      <div className="space-y-3">
                        {/* 정책자금융자액 */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-yellow-900 mb-1">
                              🏛️ 정책자금융자액 (억원)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={investmentInput.policyLoanAmount / 100000000}
                              onChange={(e) => {
                                const value = Number(e.target.value) * 100000000;
                                setInvestmentInput(prev => ({
                                  ...prev,
                                  policyLoanAmount: value
                                }));
                              }}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="3.5"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-yellow-900 mb-1">
                              💰 정책자금 이자율 (%)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={investmentInput.policyLoanRate}
                              onChange={(e) => setInvestmentInput(prev => ({
                                ...prev,
                                policyLoanRate: Number(e.target.value)
                              }))}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="2.5"
                            />
                          </div>
                        </div>

                        {/* 기타채무액 */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-yellow-900 mb-1">
                              🏦 기타채무액 (억원)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={investmentInput.otherDebtAmount / 100000000}
                              onChange={(e) => {
                                const value = Number(e.target.value) * 100000000;
                                setInvestmentInput(prev => ({
                                  ...prev,
                                  otherDebtAmount: value
                                }));
                              }}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-yellow-900 mb-1">
                              📊 기타채무 이자율 (%)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={investmentInput.otherDebtRate}
                              onChange={(e) => setInvestmentInput(prev => ({
                                ...prev,
                                otherDebtRate: Number(e.target.value)
                              }))}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="5.0"
                            />
                          </div>
                        </div>

                        {/* 실시간 DSCR 계산 표시 */}
                        <div className="bg-white p-3 rounded-lg border border-yellow-300">
                          <h5 className="text-xs font-bold text-yellow-900 mb-2">🔢 실시간 DSCR 계산</h5>
                          {(() => {
                            const dscrData = calculateDSCR();
                            return (
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>영업이익:</span>
                                  <span className="font-bold">{((dscrData.operatingProfit || 0) / 100000000).toFixed(2)}억원</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>정책자금 이자:</span>
                                  <span>{((dscrData.policyLoanInterest || 0) / 100000000).toFixed(2)}억원</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>기타채무 이자:</span>
                                  <span>{((dscrData.otherDebtInterest || 0) / 100000000).toFixed(2)}억원</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>원금상환액:</span>
                                  <span>{(((dscrData.policyLoanPrincipal || 0) + (dscrData.otherDebtPrincipal || 0)) / 100000000).toFixed(2)}억원</span>
                                </div>
                                <div className="border-t pt-1 mt-2">
                                  <div className="flex justify-between font-bold">
                                    <span>DSCR:</span>
                                    <span className={`${dscrData.dscr >= 1.25 ? 'text-green-600' : dscrData.dscr >= 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {dscrData.dscr.toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="text-xs mt-1">
                                    {dscrData.dscr >= 1.25 ? '✅ 우수 (1.25 이상)' : 
                                     dscrData.dscr >= 1.0 ? '⚠️ 보통 (1.0~1.25)' : 
                                     '❌ 위험 (1.0 미만)'}
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* 고급설정 버튼 */}
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200"
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      고급설정
                      {showAdvancedSettings ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                    
                    {/* 고급설정 패널 */}
                    {showAdvancedSettings && (
                      <div className="mt-4 p-6 bg-gray-50 rounded-lg border-2 border-gray-200 space-y-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">🔧 고급 분석 설정</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* 매출성장률 */}
                          <div>
                            <label htmlFor="revenueGrowthRate" className="block text-sm font-medium text-gray-700 mb-2">
                              📈 매출성장률 (연간)
                            </label>
                            <div className="relative">
                              <input
                                id="revenueGrowthRate"
                                type="number"
                                value={advancedSettings.revenueGrowthRate}
                                onChange={(e) => updateAdvancedSettings('revenueGrowthRate', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="50"
                                step="0.1"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>

                          {/* 비용상승률 */}
                          <div>
                            <label htmlFor="costInflationRate" className="block text-sm font-medium text-gray-700 mb-2">
                              📊 비용상승률 (연간)
                            </label>
                            <div className="relative">
                              <input
                                id="costInflationRate"
                                type="number"
                                value={advancedSettings.costInflationRate}
                                onChange={(e) => updateAdvancedSettings('costInflationRate', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="20"
                                step="0.1"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>

                          {/* 부채비율 */}
                          <div>
                            <label htmlFor="debtRatio" className="block text-sm font-medium text-gray-700 mb-2">
                              💳 부채비율
                            </label>
                            <div className="relative">
                              <input
                                id="debtRatio"
                                type="number"
                                value={advancedSettings.debtRatio}
                                onChange={(e) => updateAdvancedSettings('debtRatio', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="80"
                                step="1"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>

                          {/* 운전자본비율 */}
                          <div>
                            <label htmlFor="workingCapitalRatio" className="block text-sm font-medium text-gray-700 mb-2">
                              🏦 운전자본비율
                            </label>
                            <div className="relative">
                              <input
                                id="workingCapitalRatio"
                                type="number"
                                value={advancedSettings.workingCapitalRatio}
                                onChange={(e) => updateAdvancedSettings('workingCapitalRatio', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="50"
                                step="1"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>

                          {/* 감가상각률 */}
                          <div>
                            <label htmlFor="depreciationRate" className="block text-sm font-medium text-gray-700 mb-2">
                              📉 감가상각률 (연간)
                            </label>
                            <div className="relative">
                              <input
                                id="depreciationRate"
                                type="number"
                                value={advancedSettings.depreciationRate}
                                onChange={(e) => updateAdvancedSettings('depreciationRate', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="30"
                                step="0.5"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>

                          {/* 법인세율 */}
                          <div>
                            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                              🏛️ 법인세율
                            </label>
                            <div className="relative">
                              <input
                                id="taxRate"
                                type="number"
                                value={advancedSettings.taxRate}
                                onChange={(e) => updateAdvancedSettings('taxRate', Number(e.target.value))}
                                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                                min="0"
                                max="40"
                                step="0.5"
                              />
                              <span className="absolute right-2 top-2.5 text-gray-500 text-sm">%</span>
                            </div>
                          </div>
                        </div>

                        {/* 시나리오 선택 */}
                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            🎯 분석 시나리오
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { key: 'pessimistic', label: '비관적', color: 'bg-red-100 text-red-800' },
                              { key: 'neutral', label: '중립적', color: 'bg-blue-100 text-blue-800' },
                              { key: 'optimistic', label: '낙관적', color: 'bg-green-100 text-green-800' },
                            ].map((scenario) => (
                              <button
                                key={scenario.key}
                                onClick={() => updateAdvancedSettings('scenarioType', scenario.key)}
                                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  advancedSettings.scenarioType === scenario.key
                                    ? `${scenario.color} ring-2 ring-offset-2 ring-blue-500`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {scenario.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 설정 초기화 버튼 */}
                        <div className="flex justify-end pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAdvancedSettings({
                              revenueGrowthRate: 5,
                              costInflationRate: 3,
                              debtRatio: 30,
                              workingCapitalRatio: 15,
                              depreciationRate: 10,
                              taxRate: 25,
                              scenarioType: 'neutral',
                            })}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            기본값 복원
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleInvestmentAnalysis}
                      disabled={isCalculating || !investmentInput.initialInvestment || !investmentInput.annualRevenue || !(investmentInput.operatingProfitRate || 15)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCalculating ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          🔄 연도별 NPV 계산 중...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Calculator className="w-5 h-5 mr-2" />
                          🚀 투자타당성 분석 시작
                        </div>
                      )}
                    </Button>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-lg mr-2">💡</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-yellow-800 text-sm mb-2">연도별 NPV 계산 정보</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-yellow-700">
                            <div className="space-y-1">
                              <div>• <strong>1년차 매출:</strong> {investmentInput.annualRevenue ? (investmentInput.annualRevenue / 100000000).toFixed(1) : '0'}억원</div>
                              <div>• <strong>영업이익률:</strong> {investmentInput.operatingProfitRate || 15}%</div>
                              <div>• <strong>분석기간:</strong> {investmentInput.analysisYears}년간 상세 계산</div>
                            </div>
                            <div className="space-y-1">
                              <div>• <strong>정책자금:</strong> {investmentInput.policyLoanAmount ? (investmentInput.policyLoanAmount / 100000000).toFixed(1) : '0'}억원 ({investmentInput.policyLoanRate}%)</div>
                              <div>• <strong>기타부채:</strong> {investmentInput.otherDebtAmount ? (investmentInput.otherDebtAmount / 100000000).toFixed(1) : '0'}억원 ({investmentInput.otherDebtRate}%)</div>
                              <div>• <strong>평균 DSCR:</strong> {(() => {
                                try {
                                  const dscrData = calculateDSCR();
                                  return (
                                    <span className={`font-bold ${dscrData.dscr >= 1.25 ? 'text-green-600' : dscrData.dscr >= 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                                      {dscrData.dscr.toFixed(2)} {dscrData.dscr >= 1.25 ? '(우수)' : dscrData.dscr >= 1.0 ? '(보통)' : '(위험)'}
                                    </span>
                                  );
                                } catch (error) {
                                  return <span className="text-gray-500">계산 중...</span>;
                                }
                              })()}</div>
                            </div>
                          </div>
                          
                          {/* 연도별 DSCR 미리보기 */}
                          {(() => {
                            try {
                              const yearlyData = calculateYearlyDSCR();
                              if (yearlyData.length > 0 && yearlyData.length <= 3) {
                                return (
                                  <div className="mt-3 p-2 bg-white rounded border border-yellow-300">
                                    <div className="text-xs text-yellow-800 font-medium mb-1">📊 연도별 DSCR 미리보기:</div>
                                    <div className="flex gap-2 text-xs">
                                      {yearlyData.map((data, idx) => (
                                        <span key={idx} className={`px-2 py-1 rounded ${data.dscr >= 1.25 ? 'bg-green-100 text-green-700' : data.dscr >= 1.0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                          {data.year}년: {data.dscr.toFixed(2)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            } catch (error) {
                              return null;
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 분석 결과 표시 섹션 - 3/4 너비 */}
                <div className="space-y-6 lg:col-span-3">
                  <InvestmentResultDisplay 
                    result={analysisResult} 
                    isCalculating={isCalculating}
                  />
                  
                  {/* DSCR 상세 분석 섹션 */}
                  {!isCalculating && (
                    <div className="mt-8">
                      <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
                        <h2 className="text-2xl font-bold mb-2 flex items-center">
                          <Shield className="h-6 w-6 mr-2" />
                          고도화된 DSCR 부채상환능력 분석
                        </h2>
                        <p className="text-blue-100">
                          연도별 상세 분석과 복합 차트로 부채상환능력을 정밀 진단합니다
                        </p>
                      </div>
                      
                      <DSCRDetailedAnalysis 
                        investmentInput={investmentInput}
                        advancedSettings={advancedSettings}
                        yearlyDSCRData={calculateYearlyDSCR()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정책자금 종류별 상세정보 섹션 */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            정책자금 종류별 상세정보
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            100여 가지 정책자금 중에서 기업에 가장 적합한 자금을 매칭해드립니다.
            각 자금별 특성과 조건을 상세히 안내합니다.
          </p>
        </div>

        <div className="space-y-12">
          {/* 중소벤처기업부 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              중소벤처기업부
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">기술개발사업화자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 10억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">0~2%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">5년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">기술 개발</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">사업화 지원</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">무담보 가능</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        기술 개발 기업
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        연구개발 중심
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        혁신형 기업
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">청년창업자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 5억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">1.5%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">7년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">청년 우대</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">멘토링 제공</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">네트워킹 지원</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        39세 이하
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        창업 3년 이내
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        기술창업
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 산업통상자원부 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              산업통상자원부
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">산업혁신자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 20억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">1.75%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">7년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">대규모 투자</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">설비 지원</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">R&D 연계</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        제조업
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        대규모 투자
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        공장 증설
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">튼튼론 시설자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 15억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">1.8%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">8년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">시설 투자</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">장기 대출</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">저금리</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        제조업체
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        시설 현대화
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        생산성 향상
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 문화체육관광부 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              문화체육관광부
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">관광시설자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 30억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">1.5%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">10년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">관광산업 특화</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">장기 대출</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">시설 현대화</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        관광업체
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        숙박시설
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        레저시설
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">문화콘텐츠투자지원자금</h4>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">최대 8억원</div>
                      <div className="text-xs text-gray-600">지원한도</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">2.0%</div>
                      <div className="text-xs text-gray-600">금리</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">5년</div>
                      <div className="text-xs text-gray-600">대출기간</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">주요 특징</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">콘텐츠 제작</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">IP 개발</Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">해외진출 지원</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">적합한 기업</h5>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        문화콘텐츠 기업
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        게임/영상 제작
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        출판/만화
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정책자금 관련 기관 링크 섹션 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-gray-200 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            🏛️ 정책자금 관련 기관 바로가기
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            정책자금 신청과 관련된 주요 기관들의 공식 홈페이지로 바로 이동하실 수 있습니다.<br />
            <span className="text-purple-600 font-semibold">각 기관별 자세한 자금 정보와 신청 방법을 확인하세요.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* 중진공 */}
          <a 
            href="https://www.sbc.or.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-blue-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">중진공</h3>
              <p className="text-xs text-gray-600">중소기업진흥공단</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-blue-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 소진공 */}
          <a 
            href="https://www.semas.or.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-green-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">소진공</h3>
              <p className="text-xs text-gray-600">소상공인진흥공단</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-green-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 기보 */}
          <a 
            href="https://www.kibo.or.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-purple-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">기보</h3>
              <p className="text-xs text-gray-600">기술보증기금</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-purple-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 신보 */}
          <a 
            href="https://www.kodit.co.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-indigo-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">신보</h3>
              <p className="text-xs text-gray-600">신용보증기금</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-indigo-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* TIPS */}
          <a 
            href="https://www.jointips.or.kr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-orange-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">TIPS</h3>
              <p className="text-xs text-gray-600">민간투자주도형 기술창업지원</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-orange-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 기업마당 */}
          <a 
            href="https://www.bizinfo.go.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-teal-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-200 transition-colors">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">기업마당</h3>
              <p className="text-xs text-gray-600">기업지원정보 통합포털</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-teal-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 창업진흥원 */}
          <a 
            href="https://www.kised.or.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-pink-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-200 transition-colors">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">창업진흥원</h3>
              <p className="text-xs text-gray-600">창업기업 지원기관</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-pink-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* IRIS */}
          <a 
            href="https://www.iris.go.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-cyan-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-200 transition-colors">
                <Target className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">IRIS</h3>
              <p className="text-xs text-gray-600">범부처통합연구지원시스템</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-cyan-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 중소벤처24 */}
          <a 
            href="https://www.smes.go.kr/main/index" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-emerald-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">중소벤처24</h3>
              <p className="text-xs text-gray-600">중소벤처기업 통합서비스</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-emerald-600 mx-auto" />
              </div>
            </div>
          </a>

          {/* 보증재단 */}
          <a 
            href="https://untact.koreg.or.kr/web/index.do" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-yellow-300"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-200 transition-colors">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">보증재단</h3>
              <p className="text-xs text-gray-600">지역신용보증재단</p>
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-4 w-4 text-yellow-600 mx-auto" />
              </div>
            </div>
          </a>
        </div>

        {/* 추가 안내 정보 */}
        <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">💡 정책자금 신청 전 확인사항</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>기업 요건 및 자격 조건 확인</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>필요 서류 미리 준비</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>신청 기간 및 마감일 확인</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>투자계획서 작성 및 검토</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>사업타당성 분석 실시</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>전문가 컨설팅 받기</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-8 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => {
                const diagnosisSection = document.getElementById('diagnosis-section');
                diagnosisSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Calculator className="w-5 h-5 mr-2" />
              투자타당성분석 실시하기
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                const consultationSection = document.getElementById('consultation-section');
                consultationSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Users className="w-5 h-5 mr-2" />
              전문가 상담 신청하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 