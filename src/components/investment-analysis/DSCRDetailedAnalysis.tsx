'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Calculator,
  Info,
  Shield,
  Target,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/utils';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface DSCRData {
  year: number;
  revenue: number;
  operatingProfit: number;
  policyLoanInterest: number;
  policyLoanPrincipal: number;
  otherDebtInterest: number;
  otherDebtPrincipal: number;
  totalDebtService: number;
  dscr: number;
}

interface DSCRDetailedAnalysisProps {
  investmentInput: {
    initialInvestment: number;
    annualRevenue: number;
    operatingProfitRate: number;
    analysisYears: number;
    policyLoanAmount: number;
    policyLoanRate: number;
    gracePeriod?: number; // 거치기간
    repaymentPeriod?: number; // 원금상환기간
    otherDebtAmount: number;
    otherDebtRate: number;
    otherDebtGracePeriod?: number; // 기타채무 거치기간
    otherDebtRepaymentPeriod?: number; // 기타채무 원금상환기간
  };
  advancedSettings?: {
    revenueGrowthRate: number;
    costInflationRate: number;
  };
  yearlyDSCRData?: DSCRData[]; // 페이지에서 계산된 연도별 데이터
}

export default function DSCRDetailedAnalysis({ 
  investmentInput, 
  advancedSettings = { revenueGrowthRate: 5, costInflationRate: 3 },
  yearlyDSCRData
}: DSCRDetailedAnalysisProps) {
  
  // 디버깅 로그 (개발 시에만 사용)
  // console.log('🔍 DSCRDetailedAnalysis - yearlyDSCRData:', yearlyDSCRData);
  // console.log('🔍 DSCRDetailedAnalysis - investmentInput:', investmentInput);
  // console.log('🔍 DSCRDetailedAnalysis - advancedSettings:', advancedSettings);
  
  // 연도별 DSCR 데이터 - 페이지에서 전달받은 데이터 우선 사용
  const dscrDataByYear = useMemo((): DSCRData[] => {
    // 페이지에서 전달받은 데이터가 있으면 그것을 사용
    if (yearlyDSCRData && yearlyDSCRData.length > 0) {
      // console.log('Using yearlyDSCRData from props');
      const mappedData = yearlyDSCRData.map(data => ({
        year: data.year,
        revenue: data.revenue,
        operatingProfit: data.operatingProfit,
        policyLoanInterest: data.policyLoanInterest || 0,
        policyLoanPrincipal: data.policyLoanPrincipal || 0,
        otherDebtInterest: data.otherDebtInterest || 0,
        otherDebtPrincipal: data.otherDebtPrincipal || 0,
        totalDebtService: data.totalDebtService || 0,
        dscr: data.dscr || 0
      }));
      // console.log('Mapped data:', mappedData);
      return mappedData;
    }
    
    // console.log('Calculating DSCR data locally');
    // 기존 계산 로직 (폴백용) - 거치기간/상환기간 고려
    const data: DSCRData[] = [];
    
    const gracePeriod = investmentInput.gracePeriod || 0;
    const repaymentPeriod = investmentInput.repaymentPeriod || investmentInput.analysisYears;
    const otherDebtGracePeriod = investmentInput.otherDebtGracePeriod || 0;
    const otherDebtRepaymentPeriod = investmentInput.otherDebtRepaymentPeriod || investmentInput.analysisYears;
    
    for (let year = 1; year <= investmentInput.analysisYears; year++) {
      // 연도별 매출 성장 반영
      const yearlyRevenue = investmentInput.annualRevenue * Math.pow(1 + advancedSettings.revenueGrowthRate / 100, year - 1);
      
      // 연도별 영업이익
      const operatingProfitRate = (investmentInput.operatingProfitRate || 15) / 100;
      const yearlyOperatingProfit = yearlyRevenue * operatingProfitRate;
      
      // 정책자금 거치기간/상환기간 고려
      let yearlyPolicyLoanPrincipal = 0;
      let yearlyPolicyLoanInterest = 0;
      
      if (year <= gracePeriod) {
        // 거치기간: 이자만
        yearlyPolicyLoanPrincipal = 0;
        yearlyPolicyLoanInterest = investmentInput.policyLoanAmount * (investmentInput.policyLoanRate / 100);
      } else if (year <= gracePeriod + repaymentPeriod) {
        // 상환기간: 원금+이자
        const repaymentYear = year - gracePeriod;
        yearlyPolicyLoanPrincipal = investmentInput.policyLoanAmount / repaymentPeriod;
        const remainingPolicyLoan = investmentInput.policyLoanAmount - (yearlyPolicyLoanPrincipal * (repaymentYear - 1));
        yearlyPolicyLoanInterest = remainingPolicyLoan * (investmentInput.policyLoanRate / 100);
      }
      
      // 기타채무 거치기간/상환기간 고려
      let yearlyOtherDebtPrincipal = 0;
      let yearlyOtherDebtInterest = 0;
      
      if (investmentInput.otherDebtAmount > 0) {
        if (year <= otherDebtGracePeriod) {
          // 거치기간: 이자만
          yearlyOtherDebtPrincipal = 0;
          yearlyOtherDebtInterest = investmentInput.otherDebtAmount * (investmentInput.otherDebtRate / 100);
        } else if (year <= otherDebtGracePeriod + otherDebtRepaymentPeriod) {
          // 상환기간: 원금+이자
          const repaymentYear = year - otherDebtGracePeriod;
          yearlyOtherDebtPrincipal = investmentInput.otherDebtAmount / otherDebtRepaymentPeriod;
          const remainingOtherDebt = investmentInput.otherDebtAmount - (yearlyOtherDebtPrincipal * (repaymentYear - 1));
          yearlyOtherDebtInterest = remainingOtherDebt * (investmentInput.otherDebtRate / 100);
        }
      }
      
      // 연도별 총 부채상환액
      const yearlyTotalDebtService = yearlyPolicyLoanPrincipal + yearlyPolicyLoanInterest + 
                                   yearlyOtherDebtPrincipal + yearlyOtherDebtInterest;
      
      // 연도별 DSCR 계산
      const yearlyDSCR = yearlyTotalDebtService > 0 ? yearlyOperatingProfit / yearlyTotalDebtService : 0;
      
      data.push({
        year,
        revenue: yearlyRevenue,
        operatingProfit: yearlyOperatingProfit,
        policyLoanInterest: yearlyPolicyLoanInterest,
        policyLoanPrincipal: yearlyPolicyLoanPrincipal,
        otherDebtInterest: yearlyOtherDebtInterest,
        otherDebtPrincipal: yearlyOtherDebtPrincipal,
        totalDebtService: yearlyTotalDebtService,
        dscr: yearlyDSCR
      });
    }
    
    return data;
  }, [investmentInput, advancedSettings, yearlyDSCRData]);

  // 평균 DSCR = (분석기간 총 영업이익) / (분석기간 총 부채상환액)
  const aggregateOperatingProfit = dscrDataByYear.reduce((sum, d) => sum + d.operatingProfit, 0);
  const aggregateDebtService = dscrDataByYear.reduce((sum, d) => sum + d.totalDebtService, 0);
  const avgDSCR = aggregateDebtService > 0 ? aggregateOperatingProfit / aggregateDebtService : 0;
  
  // 디버깅: 최종 데이터 확인 (개발 시에만 사용)
  // console.log('🔍 최종 dscrDataByYear:', dscrDataByYear);
  // console.log('🔍 첫 번째 연도 데이터:', dscrDataByYear[0]);
  
  // DSCR 등급 결정
  const getDSCRGrade = (dscr: number) => {
    if (dscr >= 1.25) return { grade: '우수', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle };
    if (dscr >= 1.0) return { grade: '주의', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: AlertTriangle };
    return { grade: '위험', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertCircle };
  };

  const currentGrade = getDSCRGrade(avgDSCR);

  // 복합 차트 데이터 설정
  const chartData = {
    labels: dscrDataByYear.map(data => `${data.year}년차`),
    datasets: [
      {
        type: 'line' as const,
        label: '🟣 DSCR 비율',
        data: dscrDataByYear.map(data => data.dscr),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        pointRadius: 6,
        pointBorderColor: '#8B5CF6',
        pointBackgroundColor: '#FFFFFF',
        pointBorderWidth: 2,
        yAxisID: 'y',
        tension: 0.3,
      },
      {
        type: 'line' as const,
        label: '🔵 연간 대출상환액 (억원)',
        data: dscrDataByYear.map(data => data.totalDebtService / 100000000),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        borderWidth: 3,
        pointRadius: 5,
        pointBorderColor: '#3B82F6',
        pointBackgroundColor: '#FFFFFF',
        pointBorderWidth: 2,
        yAxisID: 'y1',
        tension: 0.3,
        fill: true,
      },
      {
        type: 'line' as const,
        label: '🟢 연간 영업이익 (억원)',
        data: dscrDataByYear.map(data => data.operatingProfit / 100000000),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        pointBorderColor: '#10B981',
        pointBackgroundColor: '#FFFFFF',
        yAxisID: 'y1',
        tension: 0.3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'DSCR 부채상환능력 연도별 분석',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const dataIndex = context.dataIndex;
            const yearData = dscrDataByYear[dataIndex];
            
            if (context.dataset.label?.includes('DSCR')) {
              if (yearData.dscr >= 1.25) return '✅ 매우 안정적';
              if (yearData.dscr >= 1.0) return '⚠️ 주의 필요';
              return '❌ 위험';
            }
            return '';
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: '연도',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'DSCR 비율',
          color: '#8B5CF6',
        },
        ticks: {
          color: '#8B5CF6',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '금액 (억원)',
          color: '#3B82F6',
        },
        ticks: {
          color: '#3B82F6',
        },
        grid: {
          drawOnChartArea: true,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* 🔥 평균 DSCR 대시보드 추가 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              📊 분석기간 평균 DSCR 대시보드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* 평균 DSCR 값 - 모바일 최적화 */}
              <div className="text-center p-4 bg-white rounded-xl border-2 border-blue-300 order-1">
                <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full ${currentGrade.bgColor} mb-3`}>
                  <span className="text-2xl md:text-3xl font-bold text-blue-600">{avgDSCR.toFixed(2)}</span>
                </div>
                <h3 className="font-bold text-base md:text-lg text-gray-800 mb-1">평균 DSCR</h3>
                <p className={`text-sm font-medium ${currentGrade.color}`}>{currentGrade.grade}</p>
                
                {/* 🔥 모바일 전용 간단한 설명 추가 */}
                <div className="block md:hidden mt-2 text-xs text-gray-600">
                  총 영업이익 ÷ 총 부채상환액
                </div>
              </div>

              {/* 계산 공식 - 모바일에서는 숨김 */}
              <div className="hidden md:block p-4 bg-white rounded-xl border border-gray-200 order-2">
                <h4 className="font-bold text-gray-800 mb-3">📐 계산 공식</h4>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-800 mb-2">
                    분석기간 총 영업이익
                  </p>
                  <hr className="border-t-2 border-blue-800 my-1" />
                  <p className="text-lg font-bold text-blue-800">
                    분석기간 총 부채상환액
                  </p>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <p>• 총 영업이익: {(aggregateOperatingProfit / 100000000).toFixed(1)}억원</p>
                  <p>• 총 부채상환액: {(aggregateDebtService / 100000000).toFixed(1)}억원</p>
                </div>
              </div>

              {/* 평가 기준 - 모바일 최적화 */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 order-3">
                <h4 className="font-bold text-gray-800 mb-3 text-sm md:text-base">📋 평가 기준</h4>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                    <span>1.25 이상: 우수</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 flex-shrink-0" />
                    <span>1.0 ~ 1.25: 주의</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                    <span>1.0 미만: 위험</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 🔥 모바일 전용 상세 정보 (접기/펼치기) */}
            <div className="block md:hidden mt-4">
              <details className="group">
                <summary className="cursor-pointer p-3 bg-blue-100 rounded-lg text-sm font-medium text-blue-800 hover:bg-blue-200 transition-colors">
                  📐 상세 계산 공식 보기
                </summary>
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 text-sm">
                  <div className="text-center mb-3">
                    <p className="font-bold text-blue-800 mb-1">분석기간 총 영업이익</p>
                    <hr className="border-t-2 border-blue-800 my-1" />
                    <p className="font-bold text-blue-800">분석기간 총 부채상환액</p>
                  </div>
                  <div className="text-gray-600 space-y-1">
                    <p>• 총 영업이익: {(aggregateOperatingProfit / 100000000).toFixed(1)}억원</p>
                    <p>• 총 부채상환액: {(aggregateDebtService / 100000000).toFixed(1)}억원</p>
                    <p>• 평균 DSCR: {avgDSCR.toFixed(3)}</p>
                  </div>
                </div>
              </details>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 연도별 DSCR 상세 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-4 md:p-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Calculator className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              📊 연도별 DSCR 상세 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 🔥 모바일 버전: 카드 형태로 표시 */}
            <div className="block md:hidden space-y-4">
              {dscrDataByYear.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  데이터가 없습니다. 투자분석을 먼저 실행해주세요.
                </div>
              ) : (
                dscrDataByYear.map((data) => {
                  const dscrStatus = data.dscr >= 1.25 ? 'safe' : data.dscr >= 1.0 ? 'warning' : 'danger';
                  const statusText = dscrStatus === 'safe' ? '안정' : dscrStatus === 'warning' ? '주의' : '위험';
                  const statusColor = dscrStatus === 'safe' ? 'text-green-600' : dscrStatus === 'warning' ? 'text-yellow-600' : 'text-red-600';
                  const statusBgColor = dscrStatus === 'safe' ? 'bg-green-50 border-green-200' : dscrStatus === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';
                  
                  return (
                    <div key={data.year} className={`p-4 rounded-xl border-2 ${statusBgColor} hover:shadow-md transition-shadow`}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-gray-800">{data.year}년차</h3>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${statusColor}`}>{data.dscr.toFixed(2)}</div>
                          <div className={`text-sm font-medium ${statusColor}`}>{statusText}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">영업이익:</span>
                            <span className="font-medium">{(data.operatingProfit / 100000000).toFixed(2)}억원</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">정책자금 원금:</span>
                            <span className="font-medium">{(data.policyLoanPrincipal / 100000000).toFixed(2)}억원</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">정책자금 이자:</span>
                            <span className="font-medium">{(data.policyLoanInterest / 100000000).toFixed(2)}억원</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">기타채무 원금:</span>
                            <span className="font-medium">{(data.otherDebtPrincipal / 100000000).toFixed(2)}억원</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">기타채무 이자:</span>
                            <span className="font-medium">{(data.otherDebtInterest / 100000000).toFixed(2)}억원</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-gray-800 font-medium">총 상환액:</span>
                            <span className="font-bold">{((data.policyLoanPrincipal + data.otherDebtPrincipal + data.policyLoanInterest + data.otherDebtInterest) / 100000000).toFixed(2)}억원</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 🔥 데스크톱 버전: 기존 테이블 유지 */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">연<br/>도</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">영업이익<br/>(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">정책자금원금<br/>상환(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">기타자금원금<br/>상환(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">정책자금이자<br/>상환(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">기타채무이자<br/>상환(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">총상환액<br/>(억원)</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">DSCR</th>
                    <th className="text-center py-3 px-2 font-bold text-gray-800 border border-gray-400 bg-gray-200">평가</th>
                  </tr>
                </thead>
                <tbody>
                  {dscrDataByYear.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-500 border border-gray-400">
                        데이터가 없습니다. 투자분석을 먼저 실행해주세요.
                      </td>
                    </tr>
                  ) : (
                    dscrDataByYear.map((data) => {
                      const dscrStatus = data.dscr >= 1.25 ? 'safe' : data.dscr >= 1.0 ? 'warning' : 'danger';
                      const statusText = dscrStatus === 'safe' ? '안정' : dscrStatus === 'warning' ? '주의' : '위험';
                      const statusColor = dscrStatus === 'safe' ? 'text-green-600' : dscrStatus === 'warning' ? 'text-yellow-600' : 'text-red-600';
                      return (
                        <tr key={data.year} className="hover:bg-gray-50">
                          <td className="text-center py-2 px-2 font-medium border border-gray-400 bg-gray-50">{data.year}년</td>
                          <td className="text-center py-2 px-2 border border-gray-400">{(data.operatingProfit / 100000000).toFixed(2)}</td>
                          <td className="text-center py-2 px-2 border border-gray-400">{(data.policyLoanPrincipal / 100000000).toFixed(2)}</td>
                          <td className="text-center py-2 px-2 border border-gray-400">{(data.otherDebtPrincipal / 100000000).toFixed(2)}</td>
                          <td className="text-center py-2 px-2 border border-gray-400">{(data.policyLoanInterest / 100000000).toFixed(2)}</td>
                          <td className="text-center py-2 px-2 border border-gray-400">{(data.otherDebtInterest / 100000000).toFixed(2)}</td>
                          <td className="text-center py-2 px-2 font-bold border border-gray-400">{((data.policyLoanPrincipal + data.otherDebtPrincipal + data.policyLoanInterest + data.otherDebtInterest) / 100000000).toFixed(2)}</td>
                          <td className={`text-center py-2 px-2 font-bold border border-gray-400 ${statusColor}`}>{data.dscr.toFixed(2)}</td>
                          <td className={`text-center py-2 px-2 font-medium border border-gray-400 ${statusColor}`}>
                            {statusText}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* 표 하단 설명 추가 */}
            <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 DSCR (Debt Service Coverage Ratio)</strong>: 영업이익 ÷ 총상환액으로 계산되며, 1.25 이상이면 안정적인 상환능력을 의미합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* DSCR 계산 공식 상세 설명 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-4 md:p-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Info className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
              DSCR 계산 공식 상세 설명
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              {/* 기본 공식 */}
              <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2 md:mb-3 text-sm md:text-base">📐 기본 계산 공식</h4>
                <div className="text-center p-3 md:p-4 bg-white rounded-lg border border-blue-300">
                  <p className="text-lg md:text-2xl font-bold text-blue-800 mb-1 md:mb-2">
                    DSCR = 영업이익 ÷ 총 부채상환액
                  </p>
                  <p className="text-xs md:text-sm text-blue-600">
                    (Debt Service Coverage Ratio)
                  </p>
                </div>
              </div>

              {/* 🔥 모바일 버전: 접기/펼치기 형태로 세부 정보 제공 */}
              <div className="block md:hidden space-y-3">
                <details className="group">
                  <summary className="cursor-pointer p-3 bg-green-100 rounded-lg text-sm font-medium text-green-800 hover:bg-green-200 transition-colors">
                    💰 영업이익 계산 방식 보기
                  </summary>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-200 text-sm">
                    <ul className="space-y-1 text-green-700">
                      <li>• <strong>기본 공식:</strong> 매출액 × 영업이익률</li>
                      <li>• <strong>매출 성장:</strong> 연평균 {advancedSettings.revenueGrowthRate}% 반영</li>
                      <li>• <strong>비용 상승:</strong> 연평균 {advancedSettings.costInflationRate}% 반영</li>
                      <li>• <strong>실제 계산:</strong> 연도별 변동 반영</li>
                    </ul>
                  </div>
                </details>

                <details className="group">
                  <summary className="cursor-pointer p-3 bg-orange-100 rounded-lg text-sm font-medium text-orange-800 hover:bg-orange-200 transition-colors">
                    🏦 총 부채상환액 계산 방식 보기
                  </summary>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-orange-200 text-sm">
                    <ul className="space-y-1 text-orange-700">
                      <li>• <strong>정책자금 이자:</strong> 연 {investmentInput.policyLoanRate}%</li>
                      {investmentInput.gracePeriod && investmentInput.gracePeriod > 0 ? (
                        <>
                          <li>• <strong>거치기간:</strong> {investmentInput.gracePeriod}년 (이자만 납부)</li>
                          <li>• <strong>상환기간:</strong> {investmentInput.repaymentPeriod || 5}년 (원금+이자)</li>
                        </>
                      ) : (
                        <li>• <strong>정책자금 원금:</strong> 균등분할상환</li>
                      )}
                      <li>• <strong>기타채무 이자:</strong> 연 {investmentInput.otherDebtRate}%</li>
                      {investmentInput.otherDebtGracePeriod && investmentInput.otherDebtGracePeriod > 0 ? (
                        <>
                          <li>• <strong>기타채무 거치기간:</strong> {investmentInput.otherDebtGracePeriod}년 (이자만 납부)</li>
                          <li>• <strong>기타채무 상환기간:</strong> {investmentInput.otherDebtRepaymentPeriod || 5}년 (원금+이자)</li>
                        </>
                      ) : (
                        <li>• <strong>기타채무 원금:</strong> 균등분할상환</li>
                      )}
                    </ul>
                  </div>
                </details>
              </div>

              {/* 🔥 데스크톱 버전: 기존 2열 레이아웃 유지 */}
              <div className="hidden md:grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-bold text-green-900 mb-3">💰 영업이익 계산</h4>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• <strong>기본 공식:</strong> 매출액 × 영업이익률</li>
                    <li>• <strong>매출 성장:</strong> 연평균 {advancedSettings.revenueGrowthRate}% 반영</li>
                    <li>• <strong>비용 상승:</strong> 연평균 {advancedSettings.costInflationRate}% 반영</li>
                    <li>• <strong>실제 계산:</strong> 연도별 변동 반영</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <h4 className="font-bold text-orange-900 mb-3">🏦 총 부채상환액 계산</h4>
                  <ul className="space-y-2 text-sm text-orange-700">
                    <li>• <strong>정책자금 이자:</strong> 연 {investmentInput.policyLoanRate}%</li>
                    {investmentInput.gracePeriod && investmentInput.gracePeriod > 0 ? (
                      <>
                        <li>• <strong>거치기간:</strong> {investmentInput.gracePeriod}년 (이자만 납부)</li>
                        <li>• <strong>상환기간:</strong> {investmentInput.repaymentPeriod || 5}년 (원금+이자)</li>
                      </>
                    ) : (
                      <li>• <strong>정책자금 원금:</strong> 균등분할상환</li>
                    )}
                    <li>• <strong>기타채무 이자:</strong> 연 {investmentInput.otherDebtRate}%</li>
                    {investmentInput.otherDebtGracePeriod && investmentInput.otherDebtGracePeriod > 0 ? (
                      <>
                        <li>• <strong>기타채무 거치기간:</strong> {investmentInput.otherDebtGracePeriod}년 (이자만 납부)</li>
                        <li>• <strong>기타채무 상환기간:</strong> {investmentInput.otherDebtRepaymentPeriod || 5}년 (원금+이자)</li>
                      </>
                    ) : (
                      <li>• <strong>기타채무 원금:</strong> 균등분할상환</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 실제 계산 예시 */}
              <div className="p-3 md:p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">📊 1년차 계산 예시</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-green-700 mb-2">영업이익 계산:</h5>
                    <p>매출: {(dscrDataByYear[0]?.revenue / 100000000).toFixed(1)}억원</p>
                    <p>영업이익: {(dscrDataByYear[0]?.operatingProfit / 100000000).toFixed(1)}억원</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-orange-700 mb-2">부채상환액 계산:</h5>
                    <p>정책자금 상환: {((dscrDataByYear[0]?.policyLoanInterest + dscrDataByYear[0]?.policyLoanPrincipal) / 100000000).toFixed(2)}억원</p>
                    <p>기타채무 상환: {((dscrDataByYear[0]?.otherDebtInterest + dscrDataByYear[0]?.otherDebtPrincipal) / 100000000).toFixed(2)}억원</p>
                    <p className="font-semibold">총 상환액: {(dscrDataByYear[0]?.totalDebtService / 100000000).toFixed(1)}억원</p>
                  </div>
                </div>
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white rounded-lg border-2 border-purple-300">
                  <p className="text-center">
                    <span className="text-base md:text-lg font-bold text-purple-800">
                      DSCR = {(dscrDataByYear[0]?.operatingProfit / 100000000).toFixed(1)}억 ÷ {(dscrDataByYear[0]?.totalDebtService / 100000000).toFixed(1)}억 = {dscrDataByYear[0]?.dscr.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-center text-xs md:text-sm text-purple-600 mt-1">
                    → {getDSCRGrade(dscrDataByYear[0]?.dscr || 0).grade} 등급
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 🔥 DSCR 차트 섹션 추가 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-4 md:p-6">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              📈 DSCR 연도별 추세 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dscrDataByYear.length > 0 ? (
              <div className="space-y-4">
                {/* 🔥 모바일 알림 */}
                <div className="block md:hidden p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    💡 <strong>모바일 차트 안내:</strong> 차트를 좌우로 스크롤하거나 확대/축소할 수 있습니다.
                  </p>
                </div>
                
                {/* 차트 컨테이너 */}
                <div className="w-full h-64 md:h-80 overflow-x-auto">
                  <div className="min-w-full md:min-w-0">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
                
                {/* 차트 설명 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-1 bg-purple-600 rounded"></div>
                      <span className="font-medium">DSCR 비율</span>
                    </div>
                    <p className="text-purple-700">연도별 부채상환능력 지수</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-1 bg-blue-600 rounded"></div>
                      <span className="font-medium">대출상환액</span>
                    </div>
                    <p className="text-blue-700">연간 총 부채상환액</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-1 bg-green-600 rounded dashed"></div>
                      <span className="font-medium">영업이익</span>
                    </div>
                    <p className="text-green-700">연간 영업이익</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>데이터가 없습니다. 투자분석을 먼저 실행해주세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 