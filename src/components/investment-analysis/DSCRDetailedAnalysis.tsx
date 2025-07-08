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
  
  // 연도별 DSCR 데이터 - 페이지에서 전달받은 데이터 우선 사용
  const dscrDataByYear = useMemo((): DSCRData[] => {
    // 페이지에서 전달받은 데이터가 있으면 그것을 사용
    if (yearlyDSCRData && yearlyDSCRData.length > 0) {
      return yearlyDSCRData.map(data => ({
        year: data.year,
        revenue: data.revenue,
        operatingProfit: data.operatingProfit,
        policyLoanInterest: data.policyLoanInterest,
        policyLoanPrincipal: data.policyLoanPrincipal,
        otherDebtInterest: data.otherDebtInterest,
        otherDebtPrincipal: data.otherDebtPrincipal,
        totalDebtService: data.totalDebtService,
        dscr: data.dscr
      }));
    }
    
    // 기존 계산 로직 (폴백용) - 잔액 기반 이자 계산으로 개선
    const data: DSCRData[] = [];
    
    for (let year = 1; year <= investmentInput.analysisYears; year++) {
      // 연도별 매출 성장 반영
      const yearlyRevenue = investmentInput.annualRevenue * Math.pow(1 + advancedSettings.revenueGrowthRate / 100, year - 1);
      
      // 연도별 영업이익
      const operatingProfitRate = (investmentInput.operatingProfitRate || 15) / 100;
      const yearlyOperatingProfit = yearlyRevenue * operatingProfitRate;
      
      // 연도별 정책자금 잔액 계산 (원금 균등상환 방식)
      const yearlyPolicyLoanPrincipal = investmentInput.policyLoanAmount / investmentInput.analysisYears;
      const remainingPolicyLoan = investmentInput.policyLoanAmount - (yearlyPolicyLoanPrincipal * (year - 1));
      const yearlyPolicyLoanInterest = remainingPolicyLoan * (investmentInput.policyLoanRate / 100);
      
      // 연도별 기타채무 잔액 계산
      const yearlyOtherDebtPrincipal = investmentInput.otherDebtAmount / investmentInput.analysisYears;
      const remainingOtherDebt = investmentInput.otherDebtAmount - (yearlyOtherDebtPrincipal * (year - 1));
      const yearlyOtherDebtInterest = remainingOtherDebt * (investmentInput.otherDebtRate / 100);
      
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

  // DSCR 평균값 계산
  const avgDSCR = dscrDataByYear.reduce((sum, data) => sum + data.dscr, 0) / dscrDataByYear.length;
  
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
      {/* DSCR 전체 요약 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-6 w-6 text-blue-600" />
              DSCR 부채상환능력 종합 평가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 평균 DSCR */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl ${currentGrade.bgColor} border`}>
                  <currentGrade.icon className={`h-6 w-6 ${currentGrade.color}`} />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{avgDSCR.toFixed(2)}</p>
                    <p className={`text-sm font-medium ${currentGrade.color}`}>평균 DSCR</p>
                  </div>
                </div>
                <Badge className={`mt-2 ${currentGrade.color} ${currentGrade.bgColor}`}>
                  {currentGrade.grade}
                </Badge>
              </div>

              {/* 연간 상환액 */}
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {(dscrDataByYear[0]?.totalDebtService / 100000000).toFixed(1)}억원
                </p>
                <p className="text-sm text-gray-600 mt-1">연간 총 상환액</p>
                <div className="mt-2 text-xs text-gray-500">
                  이자 + 원금상환
                </div>
              </div>

              {/* 영업이익 */}
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {(dscrDataByYear[0]?.operatingProfit / 100000000).toFixed(1)}억원
                </p>
                <p className="text-sm text-gray-600 mt-1">연간 영업이익</p>
                <div className="mt-2 text-xs text-gray-500">
                  1년차 기준
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3단계 평가 기준 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-6 w-6 text-purple-600" />
              DSCR 평가 기준
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-900">🟢 1.25 이상</span>
                </div>
                <h4 className="font-semibold text-green-900 mb-1">매우 안정적</h4>
                <p className="text-sm text-green-700">부채상환여력 충분</p>
                <ul className="mt-2 text-xs text-green-600 space-y-1">
                  <li>• 안정적 현금흐름 확보</li>
                  <li>• 추가 투자 여력 보유</li>
                  <li>• 금융기관 신용도 우수</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-bold text-yellow-900">🟡 1.0~1.25</span>
                </div>
                <h4 className="font-semibold text-yellow-900 mb-1">주의 필요</h4>
                <p className="text-sm text-yellow-700">여유자금 부족</p>
                <ul className="mt-2 text-xs text-yellow-600 space-y-1">
                  <li>• 현금흐름 관리 필요</li>
                  <li>• 비용 절감 노력 요구</li>
                  <li>• 정기적 모니터링 필수</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-bold text-red-900">🔴 1.0 미만</span>
                </div>
                <h4 className="font-semibold text-red-900 mb-1">위험</h4>
                <p className="text-sm text-red-700">상환능력 부족</p>
                <ul className="mt-2 text-xs text-red-600 space-y-1">
                  <li>• 즉시 개선 조치 필요</li>
                  <li>• 자금조달 구조 재검토</li>
                  <li>• 사업계획 수정 필수</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* DSCR 복합 차트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              연도별 DSCR 분석 차트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
            
            {/* 차트 해석 가이드 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">📊 차트 해석 가이드</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-600">🟣 DSCR 비율:</span>
                  <p className="text-gray-600">영업이익 ÷ 총상환액</p>
                </div>
                <div>
                  <span className="font-medium text-blue-600">🔵 대출상환액:</span>
                  <p className="text-gray-600">이자 + 원금상환 합계</p>
                </div>
                <div>
                  <span className="font-medium text-green-600">🟢 영업이익:</span>
                  <p className="text-gray-600">매출 × 영업이익률</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 연도별 DSCR 상세 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="h-6 w-6 text-green-600" />
              연도별 DSCR 상세 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-100">
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">연도</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">영업이익<br/>(억원)</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">원금상환<br/>(억원)</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">이자상환<br/>(억원)</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">총상환액<br/>(억원)</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">DSCR</th>
                    <th className="text-center py-4 px-3 font-bold text-gray-800 border border-gray-300">평가</th>
                  </tr>
                </thead>
                <tbody>
                  {dscrDataByYear.map((data, index) => {
                    const yearGrade = getDSCRGrade(data.dscr);
                    const totalPrincipal = data.policyLoanPrincipal + data.otherDebtPrincipal;
                    const totalInterest = data.policyLoanInterest + data.otherDebtInterest;
                    
                    return (
                      <tr key={index} className="border-b hover:bg-blue-50">
                        <td className="py-3 px-3 text-center font-medium border border-gray-300">{data.year}년</td>
                        <td className="py-3 px-3 text-center font-medium border border-gray-300">
                          {(data.operatingProfit / 100000000).toFixed(1)}
                        </td>
                        <td className="py-3 px-3 text-center border border-gray-300">
                          {(totalPrincipal / 100000000).toFixed(1)}
                        </td>
                        <td className="py-3 px-3 text-center border border-gray-300">
                          {(totalInterest / 100000000).toFixed(1)}
                        </td>
                        <td className="py-3 px-3 text-center font-medium border border-gray-300">
                          {(data.totalDebtService / 100000000).toFixed(1)}
                        </td>
                        <td className={`py-3 px-3 text-center font-bold border border-gray-300 ${yearGrade.color}`}>
                          {data.dscr.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center border border-gray-300">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${yearGrade.color}`}>
                            {yearGrade.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* DSCR 계산 공식 상세 설명 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Info className="h-6 w-6 text-amber-600" />
              DSCR 계산 공식 상세 설명
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 기본 공식 */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-3">📐 기본 계산 공식</h4>
                <div className="text-center p-4 bg-white rounded-lg border border-blue-300">
                  <p className="text-2xl font-bold text-blue-800 mb-2">
                    DSCR = 영업이익 ÷ 총 부채상환액
                  </p>
                  <p className="text-sm text-blue-600">
                    (Debt Service Coverage Ratio)
                  </p>
                </div>
              </div>

              {/* 세부 계산 항목 */}
              <div className="grid md:grid-cols-2 gap-6">
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
                    <li>• <strong>기타채무 원금:</strong> 균등분할상환</li>
                  </ul>
                </div>
              </div>

              {/* 실제 계산 예시 */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-3">📊 1년차 계산 예시</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
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
                <div className="mt-4 p-3 bg-white rounded-lg border-2 border-purple-300">
                  <p className="text-center">
                    <span className="text-lg font-bold text-purple-800">
                      DSCR = {(dscrDataByYear[0]?.operatingProfit / 100000000).toFixed(1)}억 ÷ {(dscrDataByYear[0]?.totalDebtService / 100000000).toFixed(1)}억 = {dscrDataByYear[0]?.dscr.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-center text-sm text-purple-600 mt-1">
                    → {getDSCRGrade(dscrDataByYear[0]?.dscr || 0).grade} 등급
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 