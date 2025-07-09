'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, CheckCircle, Building2, ChevronDown, ChevronUp, Target, Award, Clock, Star, Zap, Shield, Users, ArrowRight, Play, FileText, BarChart3, Brain, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { performInvestmentAnalysis } from '@/lib/utils/investment-analysis';
import InvestmentResultDisplay from '@/components/investment-analysis/InvestmentResultDisplay';
import DSCRDetailedAnalysis from '@/components/investment-analysis/DSCRDetailedAnalysis';
import type { InvestmentResult } from '@/lib/utils/investment-analysis';
// 통합된 등급 계산 함수들 import
import { 
  calculateInvestmentGrade, 
  calculateAverageDSCR, 
  generateDetailedRecommendation,
  getGradingCriteria,
  type InvestmentGrade
} from '@/lib/utils/investment-grade';

export default function PolicyFundingPage() {
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);
  
  // 🔥 모바일 디바이스 감지
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 🔥 페이지 로드 시 자동으로 분석 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log('페이지 로드 시 자동 분석 실행');
      handleInvestmentAnalysis();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // 투자정보 입력 상태 관리
  const [investmentInput, setInvestmentInput] = useState({
    initialInvestment: 500000000, // 5억원
    annualRevenue: 10000000000, // 100억원
    operatingProfitRate: 17.5, // 영업이익률 17.5%
    discountRate: 10, // 할인율 10%
    analysisYears: 10, // 분석기간 10년
    
    // DSCR 계산을 위한 부채 정보
    policyLoanAmount: 350000000, // 정책자금 3.5억원
    policyLoanRate: 2.5, // 정책자금 이자율 2.5%
    gracePeriod: 2, // 거치기간 2년 (이자만 납부)
    repaymentPeriod: 5, // 원금상환기간 5년 (거치기간 후 원금+이자 납부)
    
    otherDebtAmount: 3000000000, // 기타채무 30억원
    otherDebtRate: 5.3, // 기타채무 이자율 5.3%
    otherDebtGracePeriod: 0, // 기타채무 거치기간 0년 (즉시 원금상환 시작)
    otherDebtRepaymentPeriod: 10, // 기타채무 원금상환기간 10년
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
    taxRate: 22, // 법인세율 22%
    scenarioType: 'neutral' as 'pessimistic' | 'neutral' | 'optimistic',
    enableScenarioAnalysis: false,
    selectedScenario: 'neutral',
    pessimisticAdjustment: 0,
    optimisticAdjustment: 0,
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
    setAnalysisResult(null);

    try {
      // 🔥 시나리오 분석을 반영한 분석 데이터 준비
      const yearlyDSCRData = calculateYearlyDSCR();
      
      const analysisData = {
        ...investmentInput,
        operatingMargin: investmentInput.operatingProfitRate || 15,
        scenarioType: advancedSettings.selectedScenario,
        enableScenarioAnalysis: advancedSettings.enableScenarioAnalysis,
        scenarioAdjustmentRate: advancedSettings.selectedScenario === 'pessimistic' 
          ? advancedSettings.pessimisticAdjustment 
          : advancedSettings.selectedScenario === 'optimistic' 
          ? advancedSettings.optimisticAdjustment 
          : 0,
        // ✅ 고급 설정 값들 추가
        ...advancedSettings,
        // ✅ 이자율 필드 추가 (policyLoanRate를 interestRate로 매핑)
        interestRate: investmentInput.policyLoanRate,
        // ✅ policyFundAmount 필드 추가 (policyLoanAmount를 policyFundAmount로도 매핑)
        policyFundAmount: investmentInput.policyLoanAmount,
        // ✅ 대출 기간 필드 추가
        loanPeriod: investmentInput.gracePeriod + investmentInput.repaymentPeriod,
        // DSCR 데이터 추가
        yearlyDSCRData: yearlyDSCRData
      };

      // 실제 투자분석 수행
      const result = await performInvestmentAnalysis(analysisData);
      setAnalysisResult(result);
    } catch (error) {
      console.error('투자분석 오류:', error);
      setAnalysisResult(null);
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
    
    // 🔥 입력값 변경 시 자동으로 분석 재실행
    if (analysisResult) {
      setTimeout(() => {
        handleInvestmentAnalysis();
      }, 500);
    }
  };

  // 백분율 입력값 업데이트
  const updatePercentageInput = (field: string, value: number) => {
    setInvestmentInput(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 🔥 입력값 변경 시 자동으로 분석 재실행
    if (analysisResult) {
      setTimeout(() => {
        handleInvestmentAnalysis();
      }, 500);
    }
  };

  // 고급설정 업데이트 함수
  const updateAdvancedSettings = (field: string, value: number | string) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 🔥 고급설정 변경 시 자동으로 분석 재실행
    if (analysisResult) {
      setTimeout(() => {
        handleInvestmentAnalysis();
      }, 500);
    }
  };

  // DSCR 연도별 상세 계산 함수 (거치기간/상환기간 반영)
  const calculateYearlyDSCR = () => {
    const analysisYears = investmentInput.analysisYears;
    const gracePeriod = investmentInput.gracePeriod || 0; // 거치기간
    const repaymentPeriod = investmentInput.repaymentPeriod || analysisYears; // 원금상환기간
    const otherDebtGracePeriod = investmentInput.otherDebtGracePeriod || 0; // 기타채무 거치기간
    const otherDebtRepaymentPeriod = investmentInput.otherDebtRepaymentPeriod || analysisYears; // 기타채무 원금상환기간
    const yearlyDSCRData = [];
    
    // 매출 성장률 (고급 설정에서 가져오거나 기본값 5%)
    const revenueGrowthRate = (advancedSettings.revenueGrowthRate || 5) / 100;
    
    // 🔥 시나리오 분석 반영
    let scenarioMultiplier = 1;
    let profitRateAdjustment = 0;
    
    if (advancedSettings.enableScenarioAnalysis) {
      switch (advancedSettings.selectedScenario) {
        case 'pessimistic':
          // 비관적: 매출 감소, 영업이익률 감소
          scenarioMultiplier = 1 + (advancedSettings.pessimisticAdjustment / 100);
          profitRateAdjustment = -3; // 영업이익률 3%p 감소
          break;
        case 'optimistic':
          // 낙관적: 매출 증가, 영업이익률 증가
          scenarioMultiplier = 1 + (advancedSettings.optimisticAdjustment / 100);
          profitRateAdjustment = 2; // 영업이익률 2%p 증가
          break;
        default:
          scenarioMultiplier = 1;
          profitRateAdjustment = 0;
      }
    }
    
    // 🔥 통일된 원금상환 계산 함수
    const calculateDebtPayment = (loanAmount: number, rate: number, year: number, gracePeriod: number, repaymentPeriod: number) => {
      let principal = 0;
      let interest = 0;
      let remainingBalance = loanAmount;
      
      if (loanAmount <= 0) return { principal, interest, remainingBalance };
      
      if (year <= gracePeriod) {
        // 거치기간: 이자만 납부
        principal = 0;
        interest = loanAmount * (rate / 100);
        remainingBalance = loanAmount;
      } else if (year <= gracePeriod + repaymentPeriod) {
        // 상환기간: 원금 균등분할 상환
        const repaymentYear = year - gracePeriod; // 상환 시작 후 몇 년차
        principal = loanAmount / repaymentPeriod; // 연간 원금상환액
        
        // 잔금 계산 (이전까지 상환한 원금 차감)
        remainingBalance = loanAmount - (principal * (repaymentYear - 1));
        
        // 이자는 잔금 기준으로 계산
        interest = remainingBalance * (rate / 100);
        
        // 상환 후 잔금
        remainingBalance = remainingBalance - principal;
      } else {
        // 상환 완료 후
        principal = 0;
        interest = 0;
        remainingBalance = 0;
      }
      
      return { 
        principal: Math.max(0, principal), 
        interest: Math.max(0, interest), 
        remainingBalance: Math.max(0, remainingBalance) 
      };
    };
    
    for (let year = 1; year <= analysisYears; year++) {
      // 연도별 매출액 (성장률 및 시나리오 적용)
      const baseRevenue = investmentInput.annualRevenue * Math.pow(1 + revenueGrowthRate, year - 1);
      const yearlyRevenue = baseRevenue * scenarioMultiplier;
      
      // 연도별 영업이익률 (시나리오 조정 반영)
      const baseOperatingProfitRate = (investmentInput.operatingProfitRate || 15) / 100;
      const adjustedProfitRate = Math.max(0, Math.min(1, baseOperatingProfitRate + (profitRateAdjustment / 100)));
      const yearlyOperatingProfit = yearlyRevenue * adjustedProfitRate;
      
      // 🔥 정책자금 계산 (통일된 방식)
      const policyLoan = calculateDebtPayment(
        investmentInput.policyLoanAmount,
        investmentInput.policyLoanRate,
        year,
        gracePeriod,
        repaymentPeriod
      );
      
      // 🔥 기타채무 계산 (통일된 방식)
      const otherDebt = calculateDebtPayment(
        investmentInput.otherDebtAmount,
        investmentInput.otherDebtRate,
        year,
        otherDebtGracePeriod,
        otherDebtRepaymentPeriod
      );
      
      // 연도별 총 부채상환액 (정책자금 + 기타채무)
      const yearlyTotalDebtService = 
        policyLoan.principal + policyLoan.interest + 
        otherDebt.principal + otherDebt.interest;
      
      // 🔥 연도별 DSCR 계산 (안전장치 추가)
      let yearlyDSCR = 0;
      if (yearlyTotalDebtService > 0) {
        yearlyDSCR = yearlyOperatingProfit / yearlyTotalDebtService;
        
        // 🔥 비현실적인 DSCR 값 제한 (100 이상이면 문제 있음)
        if (yearlyDSCR > 100) {
          console.warn(`⚠️ ${year}년차 DSCR이 비현실적으로 높음: ${yearlyDSCR.toFixed(2)}, 총상환액: ${yearlyTotalDebtService}`);
          yearlyDSCR = Math.min(yearlyDSCR, 100); // 최대 100으로 제한
        }
        
        // 🔥 NaN이나 Infinity 체크
        if (!isFinite(yearlyDSCR) || isNaN(yearlyDSCR)) {
          console.warn(`⚠️ ${year}년차 DSCR 계산 오류: NaN 또는 Infinity`);
          yearlyDSCR = 0;
        }
      } else {
        // 🔥 총 상환액이 0이면 DSCR은 무한대가 되어야 하지만, 실제로는 부채가 없다는 의미
        console.warn(`⚠️ ${year}년차 총 상환액이 0원: 부채가 없거나 계산 오류`);
        yearlyDSCR = 0; // 부채가 없으면 DSCR은 의미가 없으므로 0으로 설정
      }
      
      // 디버깅 로그 (개발 시에만 사용)
      if (year <= 3) {
        console.log(`📊 ${year}년차 DSCR 계산 디버깅:`, {
          '연도': year,
          '매출': (yearlyRevenue / 100000000).toFixed(2) + '억원',
          '영업이익': (yearlyOperatingProfit / 100000000).toFixed(2) + '억원',
          '정책자금': {
            '원금': (policyLoan.principal / 100000000).toFixed(2) + '억원',
            '이자': (policyLoan.interest / 100000000).toFixed(2) + '억원',
          },
          '기타채무': {
            '원금': (otherDebt.principal / 100000000).toFixed(2) + '억원',
            '이자': (otherDebt.interest / 100000000).toFixed(2) + '억원',
          },
          '총상환액': (yearlyTotalDebtService / 100000000).toFixed(2) + '억원',
          'DSCR': yearlyDSCR.toFixed(2),
          '거치/상환정보': {
            '정책자금_거치기간': gracePeriod + '년',
            '정책자금_상환기간': repaymentPeriod + '년',
            '기타채무_거치기간': otherDebtGracePeriod + '년',
            '기타채무_상환기간': otherDebtRepaymentPeriod + '년',
          }
        });
      }
      
      yearlyDSCRData.push({
        year,
        revenue: yearlyRevenue,
        operatingProfit: yearlyOperatingProfit,
        policyLoanPrincipal: policyLoan.principal,
        policyLoanInterest: policyLoan.interest,
        remainingPolicyLoan: policyLoan.remainingBalance,
        otherDebtPrincipal: otherDebt.principal,
        otherDebtInterest: otherDebt.interest,
        remainingOtherDebt: otherDebt.remainingBalance,
        totalDebtService: yearlyTotalDebtService,
        dscr: yearlyDSCR,
        // 추가 정보
        isGracePeriod: year <= gracePeriod,
        isRepaymentPeriod: year > gracePeriod && year <= gracePeriod + repaymentPeriod,
        isPostRepayment: year > gracePeriod + repaymentPeriod,
        isOtherDebtGracePeriod: year <= otherDebtGracePeriod,
        isOtherDebtRepaymentPeriod: year > otherDebtGracePeriod && year <= otherDebtGracePeriod + otherDebtRepaymentPeriod,
        isOtherDebtPostRepayment: year > otherDebtGracePeriod + otherDebtRepaymentPeriod,
        // 시나리오 정보
        scenarioType: advancedSettings.selectedScenario,
        scenarioAdjustment: advancedSettings.selectedScenario === 'pessimistic' ? 
          advancedSettings.pessimisticAdjustment : 
          advancedSettings.selectedScenario === 'optimistic' ? 
          advancedSettings.optimisticAdjustment : 0
      });
    }
    
    return yearlyDSCRData;
  };

  // 기존 DSCR 계산 함수 (평균값 계산용)
  const calculateDSCR = () => {
    const yearlyData = calculateYearlyDSCR();
    if (yearlyData.length === 0) return { dscr: 0 };
    
    // 🔥 요구사항에 맞는 평균 DSCR 계산: 분석기간 총 영업이익 ÷ 총 부채상환액
    const totalOperatingProfit = yearlyData.reduce((sum, data) => sum + data.operatingProfit, 0);
    const totalDebtService = yearlyData.reduce((sum, data) => sum + data.totalDebtService, 0);
    const avgDSCR = totalDebtService > 0 ? totalOperatingProfit / totalDebtService : 0;
    
    // 디버깅 로그 (개발 시에만 사용)
    console.log('🔍 정책자금 페이지 평균 DSCR 계산:', {
      totalOperatingProfit: (totalOperatingProfit / 100000000).toFixed(2) + '억원',
      totalDebtService: (totalDebtService / 100000000).toFixed(2) + '억원',
      avgDSCR: avgDSCR.toFixed(3),
      method: '분석기간 총 영업이익 ÷ 총 부채상환액'
    });
    
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

  // 헬퍼: 평균 DSCR 가져오기
  const getAverageDSCR = () => {
    if (analysisResult && analysisResult.dscrData && analysisResult.dscrData.length > 0) {
      // 🔥 요구사항에 맞는 계산: 분석기간 총 영업이익 ÷ 총 부채상환액
      const totalOperatingProfit = analysisResult.dscrData.reduce((acc, d) => acc + (d.operatingProfit || 0), 0);
      const totalDebtService = analysisResult.dscrData.reduce((acc, d) => acc + (d.totalDebtService || 0), 0);
      return totalDebtService > 0 ? totalOperatingProfit / totalDebtService : 0;
    }
    return calculateDSCR().dscr;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 모바일 Sticky 네비게이션 */}
      {isMobile && (
        <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40 py-2">
          <div className="flex justify-center space-x-2 px-4">
            <button
              onClick={() => document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              🏠 홈
            </button>
            <button
              onClick={() => document.getElementById('diagnosis-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              💼 분석기
            </button>
            <button
              onClick={() => document.getElementById('dscr-detailed-analysis')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              📊 DSCR
            </button>
            <button
              onClick={() => document.getElementById('ai-features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
            >
              🤖 AI기능
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        /* 모바일 최적화 전역 스타일 */
        .mobile-hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%);
          position: relative;
          overflow: hidden;
        }
        
        .mobile-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 60%);
          z-index: 1;
        }
        
        .mobile-cta-button {
          min-height: 56px;
          padding: 16px 32px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: translateY(0);
        }
        
        .mobile-cta-button:active {
          transform: translateY(2px) scale(0.98);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
                 @media (max-width: 768px) {
           .mobile-safe-area {
             padding-bottom: env(safe-area-inset-bottom);
           }
           
           /* 모바일 터치 최적화 */
           body {
             -webkit-font-smoothing: antialiased;
             -moz-osx-font-smoothing: grayscale;
           }
           
           /* 모바일 스크롤 최적화 */
           html {
             scroll-behavior: smooth;
             -webkit-overflow-scrolling: touch;
           }
           
           /* 모바일 입력 필드 최적화 */
           input[type="text"], input[type="number"], input[type="tel"] {
             font-size: 16px !important; /* iOS 줌 방지 */
             -webkit-appearance: none;
             border-radius: 12px;
           }
           
           /* 모바일 버튼 최적화 */
           button {
             -webkit-tap-highlight-color: transparent;
             touch-action: manipulation;
           }
           
           /* 모바일 애니메이션 성능 최적화 */
           .mobile-optimized * {
             will-change: transform;
             transform: translateZ(0);
           }
         }
      `}</style>
      
             {/* 🔥 모바일 최적화된 HERO Section */}
       <div id="hero-section" className={`mobile-hero relative ${isMobile ? 'min-h-screen' : ''} text-white overflow-hidden`}>
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }} />
        </div>
        
        <div className={`relative container mx-auto px-4 ${isMobile ? 'py-12 min-h-screen flex flex-col justify-center' : 'py-16 lg:py-24'}`}>
          <div className={`text-center ${isMobile ? 'space-y-8' : 'mb-12'}`}>
            <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl lg:text-6xl'} font-bold mb-6 leading-tight z-10 relative`}>
              {isMobile ? (
                <>
                  🚀 중소기업 성장동력<br />
                  <span className="text-yellow-300 text-4xl">확실한 뒷받침</span>
                </>
              ) : (
                <>
                  중소기업 성장 동력을<br />
                  <span className="text-yellow-300">확실하게 뒷받침</span>
                </>
              )}
            </h1>
            <p className={`${isMobile ? 'text-lg px-4' : 'text-xl lg:text-2xl'} text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed z-10 relative`}>
              {isMobile ? (
                <>
                  💼 세밀한 검증 + 철저한 사후관리<br />
                  <span className="text-yellow-200 font-bold text-xl">진단까지 한번에!</span>
                </>
              ) : (
                <>
                  세밀한 검증과 철저한 사후관리 프로세스를 완비한<br />
                  <span className="text-yellow-200 font-semibold">진단까지 한번에 제공됩니다</span>
                </>
              )}
            </p>
            
            {/* 🔥 모바일 최적화된 CTA 버튼들 */}
            <div className={`${isMobile ? 'space-y-4 px-4' : 'flex flex-col sm:flex-row gap-4 justify-center'} mb-16 z-10 relative`}>
              <Button 
                size="lg" 
                className={`${isMobile ? 'mobile-cta-button w-full' : ''} bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl`}
                onClick={() => {
                  const diagnosisSection = document.getElementById('diagnosis-section');
                  diagnosisSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={isMobile ? {
                  minHeight: '64px',
                  fontSize: '20px',
                  fontWeight: '800'
                } : undefined}
              >
                <Play className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} mr-3`} />
                {isMobile ? '🔥 무료진단 신청' : '무료 진단 신청하기'}
              </Button>
              <Button 
                size="lg" 
                className={`${isMobile ? 'mobile-cta-button w-full' : ''} bg-white text-blue-900 border-2 border-white hover:bg-blue-50 hover:border-blue-200 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg`}
                onClick={() => {
                  const consultationSection = document.getElementById('consultation-section');
                  consultationSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={isMobile ? {
                  minHeight: '64px',
                  fontSize: '20px',
                  fontWeight: '800'
                } : undefined}
              >
                <Users className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'} mr-3`} />
                {isMobile ? '💬 상담신청' : '상담신청 하기'}
              </Button>
            </div>
            
            {/* 🔥 모바일 최적화된 성과 지표 */}
            <div className={`${isMobile ? 'grid grid-cols-2 gap-4 px-4' : 'grid grid-cols-2 lg:grid-cols-4 gap-6'} max-w-6xl mx-auto z-10 relative`}>
              {performanceMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <div 
                    key={index} 
                    className={`bg-white/10 backdrop-blur-sm ${isMobile ? 'rounded-xl p-4' : 'rounded-2xl p-6'} border border-white/20 hover:bg-white/20 transition-all duration-300 ${isMobile ? 'active:scale-95 touch-manipulation' : ''}`}
                    style={isMobile ? {
                      minHeight: '140px',
                      boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)'
                    } : undefined}
                  >
                    <div className={`flex items-center justify-center ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      <div className={`${isMobile ? 'p-2' : 'p-3'} bg-white/20 rounded-full`}>
                        <IconComponent className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-300`} />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold mb-2 text-white`}>
                        {metric.value}{metric.unit}
                      </div>
                      <div className={`text-blue-100 ${isMobile ? 'text-xs' : 'text-sm'} mb-1 font-medium`}>
                        {metric.label}
                      </div>
                      <div className={`text-yellow-300 ${isMobile ? 'text-xs' : 'text-xs'} font-semibold`}>
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

      {/* 🔥 모바일 최적화된 AI 기반 분석 시스템 섹션 */}
      <div id="ai-features" className={`${isMobile ? 'py-8' : 'py-16'} bg-white`}>
        <div className={`container mx-auto ${isMobile ? 'px-2' : 'px-4'}`}>
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12'}`}>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'} font-bold text-gray-900 mb-4`}>
              🤖 AI 기반 분석 시스템
            </h2>
            <p className={`${isMobile ? 'text-base px-4' : 'text-xl'} text-gray-600 max-w-3xl mx-auto`}>
              {isMobile ? 'AI 기술로 빠른 정책자금 매칭' : '혁신적 AI 기술로 정확하고 빠른 정책자금 매칭 서비스'}
            </p>
          </div>
          
          <div className={`${isMobile ? 'space-y-6 px-4' : 'grid md:grid-cols-3 gap-8'} max-w-5xl mx-auto`}>
            {aiFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`${isMobile ? 'p-6 rounded-xl active:scale-95 touch-manipulation' : 'p-8 rounded-2xl hover:scale-105'} border-2 ${feature.borderColor} ${feature.bgColor} hover:shadow-lg transition-all duration-300 transform`}
                  style={isMobile ? {
                    minHeight: '180px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  } : undefined}
                >
                  <div className="text-center">
                    <div className={`inline-flex ${isMobile ? 'p-3' : 'p-4'} rounded-full ${feature.bgColor} ${isMobile ? 'mb-4' : 'mb-6'}`}>
                      <IconComponent className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} ${feature.color}`} />
                    </div>
                    <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-sm' : ''}`}>
                      {isMobile ? feature.description.substring(0, 50) + '...' : feature.description}
                    </p>
                    {isMobile && (
                      <div className="mt-3">
                        <span className="text-xs text-blue-600 font-medium">터치하여 자세히 보기</span>
                      </div>
                    )}
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

             {/* 🔥 모바일 최적화된 투자타당성분석기 섹션 */}
       <div id="diagnosis-section" className={`${isMobile ? 'pt-16 pb-8' : 'py-16'} bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50`}>
        <div className={`container mx-auto px-4 ${isMobile ? '' : 'max-w-7xl'}`}>
          <div className={`text-center ${isMobile ? 'mb-6 px-2' : 'mb-8'}`}>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4`}>
              {isMobile ? '💼 투자타당성분석기' : '💼 정책자금투자타당성분석기'}
            </h1>
            <p className={`${isMobile ? 'text-base px-2' : 'text-xl'} text-gray-700 leading-relaxed max-w-4xl mx-auto`}>
              {isMobile ? (
                <>
                  🎯 전문가급 NPV/IRR 계산<br />
                  📊 연도별 상세 투자타당성 검토
                </>
              ) : (
                '전문가급 투자분석 알고리즘으로 연도별 상세 NPV 계산과 영업이익률 연계 투자타당성 검토를 제공합니다'
              )}
            </p>
            <div className={`${isMobile ? 'grid grid-cols-2 gap-2 mt-4' : 'flex flex-wrap justify-center gap-3 mt-6'}`}>
              <span className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} bg-blue-100 text-blue-800 rounded-full font-medium`}>
                📊 NPV 계산
              </span>
              <span className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} bg-purple-100 text-purple-800 rounded-full font-medium`}>
                💰 억원 변환
              </span>
              <span className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} bg-emerald-100 text-emerald-800 rounded-full font-medium`}>
                📈 이익률 분석
              </span>
              <span className={`${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2 text-sm'} bg-orange-100 text-orange-800 rounded-full font-medium`}>
                🎯 자금 매칭
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
                        value={investmentInput.initialInvestment === 0 ? '' : investmentInput.initialInvestment / 100000000}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value) * 100000000;
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
                        value={investmentInput.annualRevenue === 0 ? '' : investmentInput.annualRevenue / 100000000}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : Number(e.target.value) * 100000000;
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
                        value={investmentInput.operatingProfitRate === 0 ? '' : investmentInput.operatingProfitRate}
                        onChange={(e) => {
                          setInvestmentInput(prev => ({
                            ...prev,
                            operatingProfitRate: e.target.value === '' ? 0 : Number(e.target.value)
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
                          value={investmentInput.discountRate === 0 ? '' : investmentInput.discountRate}
                          onChange={(e) => setInvestmentInput(prev => ({
                            ...prev,
                            discountRate: e.target.value === '' ? 0 : Number(e.target.value)
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
                          value={investmentInput.analysisYears === 0 ? '' : investmentInput.analysisYears}
                          onChange={(e) => setInvestmentInput(prev => ({
                            ...prev,
                            analysisYears: e.target.value === '' ? 0 : Number(e.target.value)
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
                              value={investmentInput.policyLoanAmount === 0 ? '' : investmentInput.policyLoanAmount / 100000000}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : Number(e.target.value) * 100000000;
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
                              value={investmentInput.policyLoanRate === 0 ? '' : investmentInput.policyLoanRate}
                              onChange={(e) => setInvestmentInput(prev => ({
                                ...prev,
                                policyLoanRate: e.target.value === '' ? 0 : Number(e.target.value)
                              }))}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="2.5"
                            />
                          </div>
                        </div>

                        {/* 🔥 거치기간 및 상환기간 */}
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                          <h5 className="text-xs font-bold text-orange-900 mb-2 flex items-center">
                            <span className="mr-1">⏰</span>
                            정책자금 거치/상환 조건
                          </h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                🔄 거치기간 (년)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="5"
                                step="1"
                                value={investmentInput.gracePeriod === 0 ? '' : investmentInput.gracePeriod}
                                onChange={(e) => setInvestmentInput(prev => ({
                                  ...prev,
                                  gracePeriod: e.target.value === '' ? 0 : Number(e.target.value)
                                }))}
                                className="w-full p-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="2"
                              />
                              <p className="text-xs text-orange-600 mt-1">이자만 납부</p>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-orange-900 mb-1">
                                💸 원금상환기간 (년)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                step="1"
                                value={investmentInput.repaymentPeriod === 0 ? '' : investmentInput.repaymentPeriod}
                                onChange={(e) => setInvestmentInput(prev => ({
                                  ...prev,
                                  repaymentPeriod: e.target.value === '' ? 0 : Number(e.target.value)
                                }))}
                                className="w-full p-2 text-sm border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="5"
                              />
                              <p className="text-xs text-orange-600 mt-1">원금+이자 납부</p>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-white rounded border border-orange-300">
                            <div className="text-xs text-orange-800 space-y-1">
                              <div className="flex justify-between">
                                <span>총 대출기간:</span>
                                <span className="font-bold">{investmentInput.gracePeriod + investmentInput.repaymentPeriod}년</span>
                              </div>
                              <div className="flex justify-between">
                                <span>거치기간 {investmentInput.gracePeriod === 0 ? '(즉시 상환)' : `(1~${investmentInput.gracePeriod}년)`}:</span>
                                <span className="text-blue-600">{investmentInput.gracePeriod === 0 ? '없음' : '이자만 납부'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>상환기간 ({investmentInput.gracePeriod + 1}~{investmentInput.gracePeriod + investmentInput.repaymentPeriod}년):</span>
                                <span className="text-red-600">원금+이자 납부</span>
                              </div>
                            </div>
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
                              value={investmentInput.otherDebtAmount === 0 ? '' : investmentInput.otherDebtAmount / 100000000}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : Number(e.target.value) * 100000000;
                                setInvestmentInput(prev => ({
                                  ...prev,
                                  otherDebtAmount: value
                                }));
                              }}
                              className="w-full p-2 text-sm border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                              placeholder="20"
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

                        {/* 🔥 기타채무 거치기간 및 상환기간 */}
                        {investmentInput.otherDebtAmount > 0 && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h5 className="text-xs font-bold text-blue-900 mb-2 flex items-center">
                              <span className="mr-1">⏰</span>
                              기타채무 거치/상환 조건
                            </h5>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-bold text-blue-900 mb-1">
                                  🔄 거치기간 (년)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="1"
                                  value={investmentInput.otherDebtGracePeriod === 0 ? '' : investmentInput.otherDebtGracePeriod}
                                  onChange={(e) => setInvestmentInput(prev => ({
                                    ...prev,
                                    otherDebtGracePeriod: e.target.value === '' ? 0 : Number(e.target.value)
                                  }))}
                                  className="w-full p-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="0"
                                />
                                <p className="text-xs text-blue-600 mt-1">이자만 납부</p>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-blue-900 mb-1">
                                  💸 원금상환기간 (년)
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="1"
                                  value={investmentInput.otherDebtRepaymentPeriod === 0 ? '' : investmentInput.otherDebtRepaymentPeriod}
                                  onChange={(e) => setInvestmentInput(prev => ({
                                    ...prev,
                                    otherDebtRepaymentPeriod: e.target.value === '' ? 0 : Number(e.target.value)
                                  }))}
                                  className="w-full p-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="10"
                                />
                                <p className="text-xs text-blue-600 mt-1">원금+이자 납부</p>
                              </div>
                            </div>
                            <div className="mt-2 p-2 bg-white rounded border border-blue-300">
                              <div className="text-xs text-blue-800 space-y-1">
                                <div className="flex justify-between">
                                  <span>총 대출기간:</span>
                                  <span className="font-bold">{investmentInput.otherDebtGracePeriod + investmentInput.otherDebtRepaymentPeriod}년</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>거치기간 {investmentInput.otherDebtGracePeriod === 0 ? '(즉시 상환)' : `(1~${investmentInput.otherDebtGracePeriod}년)`}:</span>
                                  <span className="text-blue-600">{investmentInput.otherDebtGracePeriod === 0 ? '없음' : '이자만 납부'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>상환기간 ({investmentInput.otherDebtGracePeriod + 1}~{investmentInput.otherDebtGracePeriod + investmentInput.otherDebtRepaymentPeriod}년):</span>
                                  <span className="text-red-600">원금+이자 납부</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 실시간 DSCR 계산 표시 */}
                        <div className="bg-white p-3 rounded-lg border border-yellow-300 md:static sticky top-20 z-30 mx-auto w-full max-w-sm md:max-w-none">
                          <h5 className="text-xs font-bold text-yellow-900 mb-2">🔢 DSCR 부채상환능력 분석</h5>
                          {(() => {
                            const dscrInfo = calculateDSCR();
                            const statusText = dscrInfo.dscr >= 1.25 ? '안정적' : dscrInfo.dscr >= 1.0 ? '주의' : '위험';
                            const statusColor = dscrInfo.dscr >= 1.25 ? 'text-green-600' : dscrInfo.dscr >= 1.0 ? 'text-yellow-600' : 'text-red-600';
                            return (
                              <div className="space-y-2 text-xs">
                                {/* DSCR 값 */}
                                <div className="text-center">
                                  <span className={`text-2xl font-extrabold ${statusColor}`}>{dscrInfo.dscr.toFixed(2)}</span>
                                  <span className={`ml-1 font-medium ${statusColor}`}>{statusText}</span>
                                </div>
                                {/* 분석 링크 */}
                                <div className="text-center">
                                  <button
                                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors text-[11px] underline font-medium"
                                    onClick={() => {
                                      const dscrSection = document.getElementById('dscr-detailed-analysis');
                                      if (dscrSection) dscrSection.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    고도화된 DSCR 부채상환능력 분석 보기 →
                                  </button>
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
                              taxRate: 22,
                              scenarioType: 'neutral',
                            })}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            기본값 복원
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* 시나리오 선택 추가 */}
                    {!isCalculating && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                          <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                          시나리오 분석
                        </h4>
                        
                        {/* 시나리오 분석 활성화 */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-gray-700">시나리오 분석 활성화</span>
                          <button
                            onClick={() => updateAdvancedSettings('enableScenarioAnalysis', !advancedSettings.enableScenarioAnalysis)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              advancedSettings.enableScenarioAnalysis ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                advancedSettings.enableScenarioAnalysis ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        {advancedSettings.enableScenarioAnalysis && (
                          <>
                            {/* 시나리오 선택 버튼 */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {[
                                { key: 'pessimistic', label: '비관적', icon: '📉', color: 'border-red-300 text-red-700 bg-red-50' },
                                { key: 'neutral', label: '중립적', icon: '📊', color: 'border-gray-300 text-gray-700 bg-gray-50' },
                                { key: 'optimistic', label: '낙관적', icon: '📈', color: 'border-green-300 text-green-700 bg-green-50' }
                              ].map((scenario) => (
                                <button
                                  key={scenario.key}
                                  onClick={() => {
                                    updateAdvancedSettings('selectedScenario', scenario.key);
                                    // 시나리오별 기본 조정률 설정
                                    if (scenario.key === 'pessimistic') {
                                      updateAdvancedSettings('pessimisticAdjustment', -20);
                                    } else if (scenario.key === 'optimistic') {
                                      updateAdvancedSettings('optimisticAdjustment', 30);
                                    }
                                  }}
                                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                                    advancedSettings.selectedScenario === scenario.key
                                      ? `${scenario.color} border-opacity-100 font-bold`
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="text-xl mb-1">{scenario.icon}</div>
                                  <div className="text-xs">{scenario.label}</div>
                                </button>
                              ))}
                            </div>
                            
                            {/* 시나리오 조정률 */}
                            <div className="space-y-3">
                              {advancedSettings.selectedScenario === 'pessimistic' && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">비관적 조정률 (%)</label>
                                  <input
                                    type="number"
                                    value={advancedSettings.pessimisticAdjustment}
                                    onChange={(e) => updateAdvancedSettings('pessimisticAdjustment', Number(e.target.value))}
                                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                                    min="-50"
                                    max="0"
                                    step="5"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">매출액이 {Math.abs(advancedSettings.pessimisticAdjustment)}% 감소하고 영업이익률이 3%p 감소합니다</p>
                                </div>
                              )}
                              
                              {advancedSettings.selectedScenario === 'optimistic' && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">낙관적 조정률 (%)</label>
                                  <input
                                    type="number"
                                    value={advancedSettings.optimisticAdjustment}
                                    onChange={(e) => updateAdvancedSettings('optimisticAdjustment', Number(e.target.value))}
                                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                                    min="0"
                                    max="100"
                                    step="5"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">매출액이 {advancedSettings.optimisticAdjustment}% 증가하고 영업이익률이 2%p 증가합니다</p>
                                </div>
                              )}
                              
                              {advancedSettings.selectedScenario === 'neutral' && (
                                <p className="text-xs text-gray-500">현재 입력한 값 그대로 분석합니다</p>
                              )}
                            </div>
                            
                            {/* 시나리오 요약 */}
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">선택된 시나리오:</span>
                                <span className="font-bold text-blue-700">
                                  {advancedSettings.selectedScenario === 'pessimistic' ? '비관적' :
                                   advancedSettings.selectedScenario === 'optimistic' ? '낙관적' : '중립적'}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
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
                                  const avg = getAverageDSCR();
                                  const statusText = avg >= 1.25 ? '안정적' : avg >= 1.0 ? '주의' : '위험';
                                  const statusColor = avg >= 1.25 ? 'text-green-600' : avg >= 1.0 ? 'text-yellow-600' : 'text-red-600';
                                  return (
                                    <div className="inline-flex flex-col">
                                      <button
                                        onClick={() => {
                                          const dscrSection = document.getElementById('dscr-detailed-analysis');
                                          if (dscrSection) dscrSection.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className={`font-bold underline cursor-pointer hover:text-blue-800 transition-colors ${statusColor}`}
                                      >
                                        {avg.toFixed(2)} {statusText} →
                                      </button>
                                      <span className="text-xs text-gray-500 mt-1">
                                        분석기간 총 영업이익 ÷ 총 부채상환액
                                      </span>
                                    </div>
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
                              if (yearlyData.length > 0) {
                                return (
                                  <div className="mt-3 p-2 bg-white rounded border border-yellow-300">
                                    <div className="text-xs text-yellow-800 font-medium mb-1">📊 연도별 DSCR 상세 분석:</div>
                                    <div className="flex gap-2 text-xs">
                                      <span 
                                        className="px-2 py-1 rounded bg-blue-100 text-blue-700 cursor-pointer hover:bg-blue-200 transition-colors underline"
                                        onClick={() => {
                                          const dscrSection = document.getElementById('dscr-detailed-analysis');
                                          if (dscrSection) {
                                            dscrSection.scrollIntoView({ behavior: 'smooth' });
                                          }
                                        }}
                                      >
                                        고도화된 DSCR 부채상환능력 분석에서 확인 →
                                      </span>
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
                  {/* 탭 구조 추가 */}
                  <Tabs defaultValue="analysis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="analysis" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        투자분석
                      </TabsTrigger>
                      <TabsTrigger value="ai-evaluation" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        🤖 AI 평가
                      </TabsTrigger>
                      <TabsTrigger value="dscr-analysis" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        DSCR 분석
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="analysis" className="space-y-6">
                      <InvestmentResultDisplay 
                        result={analysisResult} 
                        isCalculating={isCalculating}
                        selectedScenario={advancedSettings.enableScenarioAnalysis ? advancedSettings.selectedScenario : 'neutral'}
                        scenarioAdjustment={
                          advancedSettings.enableScenarioAnalysis ? 
                          (advancedSettings.selectedScenario === 'pessimistic' ? 
                            advancedSettings.pessimisticAdjustment : 
                            advancedSettings.selectedScenario === 'optimistic' ? 
                            advancedSettings.optimisticAdjustment : 0) : 0
                        }
                      />
                    </TabsContent>
                    
                    <TabsContent value="ai-evaluation" className="space-y-6">
                      {/* 고도화된 AI 평가 페이지 */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                        <div className="text-center mb-8">
                          <div className="text-5xl mb-4">🤖</div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            고도화된 AI 투자 평가 시스템
                          </h2>
                          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            최신 AI 알고리즘을 활용하여 투자 타당성을 다각도로 분석하고 
                            개별 맞춤형 투자 전략을 제시합니다.
                          </p>
                        </div>
                        
                        {isCalculating ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-6"></div>
                            <p className="text-gray-600 text-lg">AI가 투자 데이터를 분석 중입니다...</p>
                            <p className="text-gray-500 text-sm mt-2">복합 지표 분석, 리스크 평가, 시장 전망 분석을 진행하고 있습니다.</p>
                          </div>
                        ) : analysisResult ? (
                          <div className="space-y-8">
                            {/* AI 분석 결과 대시보드 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                AI 종합 투자 등급 분석
                              </h3>
                              
                              {(() => {
                                // 통합된 등급 계산 함수 사용
                                const grade = calculateInvestmentGrade(analysisResult);
                                
                                return (
                                  <div className="space-y-6">
                                    {/* 투자 등급 카드 */}
                                    <div className={`p-6 rounded-xl border-2 ${grade.bgColor} ${grade.borderColor}`}>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                          <div className={`text-5xl font-bold mb-2 ${grade.color}`}>
                                            {grade.grade}
                                          </div>
                                          <div className="text-lg text-gray-700 mb-2">투자 등급</div>
                                          <div className="text-sm text-gray-600">
                                            종합 점수: {grade.score}점 / 100점
                                          </div>
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                          <h4 className="font-bold text-gray-900 mb-3">등급 평가 해설</h4>
                                          <p className={`text-sm mb-4 ${grade.color} leading-relaxed`}>
                                            {grade.gradeDesc}
                                          </p>
                                          
                                          <div className="grid grid-cols-2 gap-3">
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">NPV 타당성</span>
                                              <span className={`font-bold ${analysisResult.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {analysisResult.npv > 0 ? '✓ 양수' : '✗ 음수'} ({grade.details.npvScore}점)
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">IRR 수익률</span>
                                              <span className="font-bold text-blue-600">
                                                {analysisResult.irr.toFixed(1)}% ({grade.details.irrScore}점)
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">DSCR 안정성</span>
                                              <span className={`font-bold ${
                                                calculateAverageDSCR(analysisResult) >= 1.25 ? 'text-green-600' : 
                                                calculateAverageDSCR(analysisResult) >= 1.0 ? 'text-yellow-600' : 'text-red-600'
                                              }`}>
                                                {calculateAverageDSCR(analysisResult).toFixed(2)}배 ({grade.details.dscrScore}점)
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">회수기간</span>
                                              <span className="font-bold text-purple-600">
                                                {analysisResult.paybackPeriod.toFixed(1)}년 ({grade.details.paybackScore}점)
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* AI 분석 해설 */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Brain className="h-5 w-5 text-purple-600" />
                                        AI 분석 해설
                                      </h4>
                                      
                                      <div className="space-y-4">
                                        {/* 점수 구간 표 추가 */}
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                          <h5 className="font-bold text-gray-900 mb-3">📊 분야별 점수 구간표</h5>
                                          <div className="space-y-3">
                                            {(() => {
                                              const criteria = getGradingCriteria();
                                              return Object.entries(criteria).map(([key, criterion]) => (
                                                <div key={key} className="border-l-4 border-blue-500 pl-3">
                                                  <div className="font-medium text-sm text-gray-900 mb-1">
                                                    {criterion.title} (총 {criterion.weight}점)
                                                  </div>
                                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
                                                    {criterion.ranges.map((range, index) => (
                                                      <div key={index} className="text-gray-700">
                                                        {range.desc}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              ));
                                            })()}
                                          </div>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-4">
                                          <div className="p-4 bg-white rounded-lg">
                                            <h5 className="font-bold text-blue-900 mb-2">📊 재무 지표 분석</h5>
                                            <ul className="text-sm text-blue-800 space-y-1">
                                              <li>• NPV {(analysisResult.npv/100000000).toFixed(1)}억원 - {analysisResult.npv > 0 ? '투자 타당성 확보' : '투자 타당성 부족'}</li>
                                              <li>• IRR {analysisResult.irr.toFixed(1)}% - {analysisResult.irr > 15 ? '높은 수익률' : analysisResult.irr > 10 ? '보통 수익률' : '낮은 수익률'}</li>
                                              <li>• DSCR {calculateAverageDSCR(analysisResult).toFixed(2)}배 - {calculateAverageDSCR(analysisResult) >= 1.25 ? '안정적 상환능력' : '상환능력 주의'}</li>
                                              <li>• 회수기간 {analysisResult.paybackPeriod.toFixed(1)}년 - {analysisResult.paybackPeriod <= 5 ? '빠른 회수' : '긴 회수기간'}</li>
                                            </ul>
                                          </div>
                                          
                                          <div className="p-4 bg-white rounded-lg">
                                            <h5 className="font-bold text-purple-900 mb-2">🎯 투자 적합성 평가</h5>
                                            <ul className="text-sm text-purple-800 space-y-1">
                                              <li>• 정책자금 활용도: {investmentInput.policyLoanAmount > 0 ? '높음' : '낮음'}</li>
                                              <li>• 부채 구조: {calculateAverageDSCR(analysisResult) >= 1.25 ? '안정적' : '개선 필요'}</li>
                                              <li>• 성장성: {advancedSettings.revenueGrowthRate > 5 ? '높음' : '보통'}</li>
                                              <li>• 리스크 수준: {grade.score >= 80 ? '낮음' : grade.score >= 60 ? '보통' : '높음'}</li>
                                            </ul>
                                          </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white rounded-lg">
                                          <h5 className="font-bold text-gray-900 mb-2">💡 AI 종합 의견</h5>
                                          <p className="text-sm text-gray-700 leading-relaxed">
                                            {grade.score >= 80 
                                              ? "현재 사업 계획은 재무적으로 매우 건전하며, 정책자금을 활용한 투자 실행을 적극 권장합니다. 모든 주요 지표가 양호하여 성공 가능성이 높습니다."
                                              : grade.score >= 70
                                              ? "전반적으로 투자 타당성이 인정되나, 일부 지표에서 개선 여지가 있습니다. 리스크 관리 방안을 수립한 후 투자를 진행하시기 바랍니다."
                                              : grade.score >= 60
                                              ? "투자 실행 전 사업 계획의 보완이 필요합니다. 특히 수익성과 안정성 측면에서 개선 방안을 마련하시기 바랍니다."
                                              : "현재 조건에서는 투자 리스크가 높습니다. 사업 모델과 재무 구조를 전면 재검토한 후 재분석을 권장합니다."
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            
                            {/* 상세 투자 분석 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                상세 투자 분석 리포트
                              </h3>
                              
                              <div className="grid md:grid-cols-2 gap-6">
                                {/* 투자 강점 */}
                                <div className="space-y-4">
                                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4" />
                                      투자 강점 요인
                                    </h4>
                                    <ul className="text-sm text-green-800 space-y-2">
                                      {analysisResult.npv > 0 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-600 mt-1">•</span>
                                          <span>NPV 양수로 투자 타당성 확보 ({(analysisResult.npv/100000000).toFixed(1)}억원)</span>
                                        </li>
                                      )}
                                      {analysisResult.irr > 15 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-600 mt-1">•</span>
                                          <span>높은 IRR({analysisResult.irr.toFixed(1)}%)로 수익성 우수</span>
                                        </li>
                                      )}
                                      {calculateAverageDSCR(analysisResult) >= 1.25 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-600 mt-1">•</span>
                                          <span>안정적인 부채상환능력 (DSCR {calculateAverageDSCR(analysisResult).toFixed(2)}배)</span>
                                        </li>
                                      )}
                                      {analysisResult.paybackPeriod <= 5 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-600 mt-1">•</span>
                                          <span>빠른 투자금 회수 ({analysisResult.paybackPeriod.toFixed(1)}년)</span>
                                        </li>
                                      )}
                                      {investmentInput.policyLoanAmount > 0 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-green-600 mt-1">•</span>
                                          <span>정책자금 활용으로 자본 효율성 극대화</span>
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                  
                                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                      <Target className="h-4 w-4" />
                                      시장 기회 요인
                                    </h4>
                                    <ul className="text-sm text-blue-800 space-y-2">
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>정책자금 지원으로 초기 자본 부담 완화</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>연간 {advancedSettings.revenueGrowthRate}% 매출 성장 전망</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{investmentInput.operatingProfitRate}% 영업이익률 유지 가능</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>저금리 정책자금으로 금융 비용 절감</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                {/* 투자 리스크 */}
                                <div className="space-y-4">
                                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                    <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4" />
                                      투자 리스크 요인
                                    </h4>
                                    <ul className="text-sm text-orange-800 space-y-2">
                                      {analysisResult.npv <= 0 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-orange-600 mt-1">•</span>
                                          <span>NPV 음수로 투자 타당성 부족</span>
                                        </li>
                                      )}
                                      {analysisResult.irr <= 10 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-orange-600 mt-1">•</span>
                                          <span>낮은 IRR({analysisResult.irr.toFixed(1)}%)로 수익성 제한</span>
                                        </li>
                                      )}
                                      {calculateAverageDSCR(analysisResult) < 1.25 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-orange-600 mt-1">•</span>
                                          <span>부채상환능력 보완 필요 (DSCR {calculateAverageDSCR(analysisResult).toFixed(2)}배)</span>
                                        </li>
                                      )}
                                      {analysisResult.paybackPeriod > 7 && (
                                        <li className="flex items-start gap-2">
                                          <span className="text-orange-600 mt-1">•</span>
                                          <span>긴 투자금 회수기간 ({analysisResult.paybackPeriod.toFixed(1)}년)</span>
                                        </li>
                                      )}
                                      <li className="flex items-start gap-2">
                                        <span className="text-orange-600 mt-1">•</span>
                                        <span>시장 변동성 및 경기 민감도 고려 필요</span>
                                      </li>
                                    </ul>
                                  </div>
                                  
                                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      리스크 관리 방안
                                    </h4>
                                    <ul className="text-sm text-red-800 space-y-2">
                                      <li className="flex items-start gap-2">
                                        <span className="text-red-600 mt-1">•</span>
                                        <span>단계적 투자 실행으로 리스크 분산</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-red-600 mt-1">•</span>
                                        <span>현금흐름 모니터링 시스템 구축</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-red-600 mt-1">•</span>
                                        <span>비상 자금 확보 및 유동성 관리</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-red-600 mt-1">•</span>
                                        <span>정기적인 사업 성과 검토 및 조정</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* AI 추천 실행 전략 */}
                            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                AI 추천 실행 전략
                              </h3>
                              
                              <div className="space-y-6">
                                {/* 단계별 실행 계획 */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-gray-900 mb-3">🎯 단기 실행 계획 (1-3개월)</h4>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                      <span className="text-sm font-medium">정책자금 신청서 작성 및 제출</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                      <span className="text-sm font-medium">사업계획서 정밀 검토 및 보완</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                      <span className="text-sm font-medium">자금 조달 계획 최종 확정</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h4 className="font-bold text-gray-900 mb-3">🚀 중장기 실행 계획 (3-12개월)</h4>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                                      <span className="text-sm font-medium">투자 실행 및 사업 개시</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                                      <span className="text-sm font-medium">성과 모니터링 및 조정</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                                      <span className="text-sm font-medium">성장 전략 수립 및 확장</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* 핵심 성공 요인 */}
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                                  <h4 className="font-bold text-purple-900 mb-3">🔑 핵심 성공 요인</h4>
                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-white rounded-lg">
                                      <div className="text-2xl mb-2">📈</div>
                                      <div className="font-bold text-sm mb-1">수익성 관리</div>
                                      <div className="text-xs text-gray-600">영업이익률 {investmentInput.operatingProfitRate}% 유지</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg">
                                      <div className="text-2xl mb-2">💰</div>
                                      <div className="font-bold text-sm mb-1">현금흐름 관리</div>
                                      <div className="text-xs text-gray-600">DSCR 1.25배 이상 유지</div>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg">
                                      <div className="text-2xl mb-2">🎯</div>
                                      <div className="font-bold text-sm mb-1">성장 관리</div>
                                      <div className="text-xs text-gray-600">연간 {advancedSettings.revenueGrowthRate}% 성장률 달성</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="text-6xl mb-6">📊</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">투자분석을 먼저 실행해주세요</h3>
                            <p className="text-gray-600 text-lg mb-2">AI 평가를 위해서는 투자 데이터가 필요합니다.</p>
                            <p className="text-gray-500 text-sm">왼쪽 패널에서 투자 정보를 입력하고 '🚀 투자타당성 분석 시작' 버튼을 클릭하세요.</p>
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                              <h4 className="font-bold text-blue-900 mb-2">💡 분석 준비 체크리스트</h4>
                              <ul className="text-sm text-blue-800 space-y-1 text-left">
                                <li>• 초기투자금액 입력</li>
                                <li>• 연간매출액 입력</li>
                                <li>• 영업이익률 설정</li>
                                <li>• 정책자금 조건 입력</li>
                                <li>• 분석기간 설정</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="dscr-analysis" className="space-y-6">
                      {/* DSCR 상세 분석 섹션 */}
                      <div id="dscr-detailed-analysis">
                        <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
                          <h2 className="text-2xl font-bold mb-2 flex items-center">
                            <Shield className="h-6 w-6 mr-2" />
                            고도화된 DSCR 부채상환능력 분석
                          </h2>
                          <p className="text-blue-100">
                            연도별 상세 분석과 복합 차트로 부채상환능력을 정밀 진단합니다
                          </p>
                        </div>
                        
                        {isCalculating ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">DSCR 분석 중...</p>
                          </div>
                        ) : (
                          <DSCRDetailedAnalysis 
                            investmentInput={investmentInput}
                            advancedSettings={advancedSettings}
                            yearlyDSCRData={calculateYearlyDSCR()}
                          />
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정책자금 종류별 상세정보 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 border border-gray-200 mt-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              정책자금 종류별 상세정보
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              100여 가지 정책자금 중에서 기업에 가장 적합한 자금을 매칭해드립니다.
              각 자금별 특성과 조건을 상세히 안내합니다.
            </p>
          </div>

          <div className="space-y-12 md:space-y-16">
            {/* 중소벤처기업부 */}
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                중소벤처기업부
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                산업통상자원부
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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
            <div className="max-w-6xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                문화체육관광부
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
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
      </div>

      {/* 정책자금 관련 기관 링크 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 md:p-8 lg:p-12 border border-gray-200 mt-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              🏛️ 정책자금 관련 기관 바로가기
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              정책자금 신청과 관련된 주요 기관들의 공식 홈페이지로 바로 이동하실 수 있습니다.<br />
              <span className="text-purple-600 font-semibold">각 기관별 자세한 자금 정보와 신청 방법을 확인하세요.</span>
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {/* 중진공 */}
              <a 
                href="https://www.sbc.or.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-blue-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-green-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-purple-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-indigo-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-orange-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-teal-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-pink-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-cyan-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-emerald-300"
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
                className="group bg-white rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-yellow-300"
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
          </div>

          {/* 추가 안내 정보 */}
          <div className="mt-8 md:mt-12 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl border border-gray-200">
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
          </div>

          {/* CTA 섹션 */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Link href="/consultation">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  전문가 상담 신청
                </Button>
              </Link>
              <Link href="/analysis">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  투자분석 시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 