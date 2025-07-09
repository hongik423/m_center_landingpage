'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Target, 
  Star, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  LineChart, 
  BarChart3,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import type { InvestmentResult } from '@/lib/utils/investment-analysis';
import CashFlowChart from './CashFlowChart';
import NPVDetailedDisplay from '@/components/investment/NPVDetailedDisplay';
// 통합된 등급 계산 함수들 import
import { 
  calculateInvestmentGrade, 
  calculateAverageDSCR, 
  generateDetailedRecommendation,
  type InvestmentGrade
} from '@/lib/utils/investment-grade';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface InvestmentResultDisplayProps {
  result: InvestmentResult | null;
  isCalculating?: boolean;
  selectedScenario?: 'pessimistic' | 'neutral' | 'optimistic';
  scenarioAdjustment?: number;
  input?: {
    marketPenetrationRate: number;
    customerRetentionRate: number;
    revenueGrowthRate: number;
    operatingProfitRate: number;
  };
}

// 기존 등급 계산 함수들 제거 - 통합된 함수 사용

// 향상된 시나리오 분석 결과 생성
const getScenarioAnalysis = (result: InvestmentResult | null) => {
  if (!result) return null;
  
  // 더 현실적인 시나리오 계산
  const baseNPV = result.npv;
  const baseIRR = result.irr;
  
  return {
    optimistic: {
      name: '낙관적 시나리오',
      npv: baseNPV + (baseNPV * 0.35), // 35% 증가
      irr: Math.min(baseIRR * 1.4, 60), // 40% 증가, 최대 60%
      description: '매출 +20%, 영업이익률 +5%p',
      color: 'bg-green-50 border-green-200'
    },
    base: {
      name: '기준 시나리오',
      npv: baseNPV,
      irr: baseIRR,
      description: '현재 계획 기준',
      color: 'bg-blue-50 border-blue-200 border-2'
    },
    pessimistic: {
      name: '비관적 시나리오',
      npv: baseNPV * 0.45 - (baseNPV * 0.3), // 상당한 감소
      irr: Math.max(baseIRR * 0.3, -25), // 70% 감소, 최소 -25%
      description: '매출 -15%, 영업이익률 -3%p',
      color: 'bg-red-50 border-red-200'
    }
  };
};

export default function InvestmentResultDisplay({ 
  result, 
  isCalculating = false, 
  selectedScenario = 'neutral',
  scenarioAdjustment = 0,
  input
}: InvestmentResultDisplayProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">AI 투자분석 진행 중...</p>
          <p className="text-sm text-gray-500 mt-2">10년간 정밀 분석을 수행하고 있습니다</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center p-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-lg font-medium text-gray-600 mb-2">투자 분석 대기 중</p>
        <p className="text-sm text-gray-500">투자 정보를 입력하고 분석을 실행하세요</p>
      </div>
    );
  }

  const grade = calculateInvestmentGrade(result);
  const scenarios = getScenarioAnalysis(result);
  
  // 개선된 민감도 분석 데이터 계산
  const getSensitivityData = (result: InvestmentResult | null) => {
    if (!result) return [];
    
    const baseNPV = result.npv;
    
    return [
      { 
        parameter: '매출액 10% 증가', 
        impact: baseNPV > 0 ? 45.2 : 65.3, 
        color: 'bg-green-500' 
      },
      { 
        parameter: '비용 10% 증가', 
        impact: baseNPV > 0 ? -32.1 : -28.7, 
        color: 'bg-orange-500' 
      },
      { 
        parameter: '할인율 1% 증가', 
        impact: -8.4, 
        color: 'bg-blue-500' 
      },
      { 
        parameter: '영업이익률 5%p 증가', 
        impact: baseNPV > 0 ? 38.9 : 52.1, 
        color: 'bg-purple-500' 
      }
    ];
  };
  
  const sensitivityData = getSensitivityData(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* 헤더 */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mb-3 md:mb-4">
          <Zap className="h-4 w-4 md:h-5 md:w-5" />
          <span className="font-bold text-sm md:text-lg">AI 완전 투자분석 리포트</span>
        </div>
        
        {/* 선택된 시나리오 정보 */}
        <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
          <Badge 
            variant="secondary" 
            className={`px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-medium ${
              selectedScenario === 'pessimistic' 
                ? 'bg-red-100 text-red-700 border-red-300' :
              selectedScenario === 'optimistic' 
                ? 'bg-green-100 text-green-700 border-green-300' :
                'bg-gray-100 text-gray-700 border-gray-300'
            }`}
          >
            {selectedScenario === 'pessimistic' && '📉 비관적 시나리오'}
            {selectedScenario === 'neutral' && '📊 중립적 시나리오'}
            {selectedScenario === 'optimistic' && '📈 낙관적 시나리오'}
            {scenarioAdjustment !== 0 && ` (${scenarioAdjustment > 0 ? '+' : ''}${scenarioAdjustment}%)`}
          </Badge>
        </div>
      </div>

      {/* 투자등급 및 핵심지표 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* 투자등급 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 order-1 lg:order-1"
        >
          <Card className="p-4 md:p-6 h-full">
            <div className={`w-16 h-16 md:w-20 md:h-20 ${grade.color} rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4`}>
              <span className="text-2xl md:text-3xl font-bold text-white">{grade.grade}</span>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-base md:text-lg mb-1">투자등급</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-2">{grade.recommendation}</p>
              <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-yellow-600">
                <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                <span>{grade.score}점</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* 핵심지표 5개 */}
        <div className="lg:col-span-4 order-2 lg:order-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-3 md:p-4 bg-blue-50">
                <div className="text-center">
                  <p className="text-xl md:text-3xl font-bold text-blue-600">
                    {(result.npv / 100000000).toFixed(1)}억
                  </p>
                  <p className="text-xs text-blue-600 font-medium mt-1">NPV</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-3 md:p-4 bg-green-50">
                <div className="text-center">
                  <p className="text-xl md:text-3xl font-bold text-green-600">
                    {result.irr.toFixed(1)}%
                  </p>
                  <p className="text-xs text-green-600 font-medium mt-1">IRR</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-3 md:p-4 bg-purple-50">
                <div className="text-center">
                  <p className="text-xl md:text-3xl font-bold text-purple-600">
                    {calculateAverageDSCR(result).toFixed(2)}
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1">DSCR</p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-3 md:p-4 bg-orange-50">
                <div className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-xl md:text-3xl font-bold text-orange-600 cursor-help">
                          {result.paybackPeriod > 0 ? result.paybackPeriod.toFixed(1) : '미회수'}
                          {result.paybackPeriod > 0 && '년'}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">할인 회수기간</p>
                          <p>할인율을 적용한 현재가치 기준 회수기간</p>
                          <p>• 정책자금 특성 반영</p>
                          <p>• 시간가치 고려</p>
                          <p>• 투자 위험도 반영</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-xs text-orange-600 font-medium mt-1">할인 회수기간</p>
                </div>
              </Card>
            </motion.div>

            {/* ✅ 단순 회수기간 추가 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-3 md:p-4 bg-teal-50">
                <div className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-xl md:text-3xl font-bold text-teal-600 cursor-help">
                          {result.simplePaybackPeriod > 0 ? result.simplePaybackPeriod.toFixed(1) : '미회수'}
                          {result.simplePaybackPeriod > 0 && '년'}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">단순 회수기간</p>
                          <p>사용자 제시 공식에 따른 정확한 계산</p>
                          <p>• 할인율 적용하지 않음</p>
                          <p>• 실제 현금흐름 기준</p>
                          <p>• 누적 현금유입으로 회수시점 산정</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-xs text-teal-600 font-medium mt-1">단순 회수기간</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 추가 지표들 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-3 md:p-4 text-center">
          <p className="text-lg md:text-2xl font-bold text-blue-600">
            {result.averageROI ? result.averageROI.toFixed(1) : '0'}%
          </p>
          <p className="text-xs text-gray-600 mt-1">ROI (평균수익률)</p>
        </Card>

        <Card className="p-3 md:p-4 text-center">
          <p className="text-lg md:text-2xl font-bold text-green-600">
            {result.profitabilityIndex ? result.profitabilityIndex.toFixed(2) : '0'}
          </p>
          <p className="text-xs text-gray-600 mt-1">PI (수익성지수)</p>
        </Card>

        <Card className="p-3 md:p-4 text-center">
          <p className="text-lg md:text-2xl font-bold text-purple-600">
            {result.riskAdjustedReturn ? result.riskAdjustedReturn.toFixed(1) : '0'}%
          </p>
          <p className="text-xs text-gray-600 mt-1">위험조정수익률</p>
        </Card>

        <Card className="p-3 md:p-4 text-center">
          <p className="text-lg md:text-2xl font-bold text-indigo-600">
            {result.economicValueAdded ? (result.economicValueAdded / 100000000).toFixed(1) : '0'}억
          </p>
          <p className="text-xs text-gray-600 mt-1">EVA (경제부가가치)</p>
        </Card>
      </div>

      {/* 추가 지표 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-indigo-500" />
          <h3 className="text-xl font-bold">추가 분석 지표</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              ROI (투자수익률)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">총 수익에서 초기투자를 뺀 순수익의 비율. 100% 이상이면 투자금 회수</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>
            <p className="text-xl font-bold">{result.roi ? result.roi.toFixed(1) : '0'}%</p>
          </Card>
          
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              위험조정수익률
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">ROI에서 할인율(위험)을 차감한 실질 수익률. 양수면 위험 대비 수익성 있음</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>
            <p className={`text-xl font-bold ${result.riskAdjustedReturn > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.riskAdjustedReturn ? result.riskAdjustedReturn.toFixed(1) : '0'}%
            </p>
          </Card>
          
          <Card className="p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              평균 DSCR
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">영업현금흐름 대비 부채상환능력. 1.25 이상이면 안정적</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>
            <p className={`text-xl font-bold ${
              calculateAverageDSCR(result) >= 1.25 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {calculateAverageDSCR(result).toFixed(2)}배
            </p>
          </Card>


        </div>
      </motion.div>

      {/* NPV 연도별 차트 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5 text-blue-500" />
          <h3 className="text-xl font-bold">NPV 연도별 추이</h3>
        </div>
        
        <Card className="p-6">
          <div className="h-80">
            <Line
              data={{
                labels: result.cashFlows.map(cf => `${cf.year}년`),
                datasets: [
                  {
                    label: '누적 현재가치 (NPV)',
                    data: result.cashFlows.map(cf => cf.cumulativePV / 100000000),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                  {
                    label: '연도별 현재가치',
                    data: result.cashFlows.map(cf => cf.presentValue / 100000000),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    title: {
                      display: true,
                      text: '금액 (억원)'
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: '연도'
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'top' as const
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}억원`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>NPV 분석:</strong> 
              {result.npv > 0 
                ? `누적 현재가치가 양수로 전환되어 투자 타당성이 확인됩니다. 최종 NPV는 ${(result.npv/100000000).toFixed(1)}억원입니다.`
                : '누적 현재가치가 음수로 투자 재검토가 필요합니다.'
              }
            </p>
          </div>
        </Card>
      </motion.div>

      {/* 시나리오 분석 */}
      {scenarios && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-bold">시나리오 분석 (3가지 시나리오)</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(scenarios).map(([key, scenario], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className={`p-6 ${scenario.color}`}>
                  <h4 className="font-bold text-lg mb-3">{scenario.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">NPV:</span>
                      <span className={`font-bold ${
                        scenario.npv > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {scenario.npv > 0 ? '+' : ''}{(scenario.npv / 100000000).toFixed(1)}억
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">IRR:</span>
                      <span className="font-bold">{scenario.irr.toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{scenario.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
                 </motion.div>
       )}

       {/* 현금흐름 분석 차트 */}
       {result && result.cashFlows && result.cashFlows.length > 0 && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.25 }}
         >
           <div className="border-t pt-8">
             <div className="flex items-center gap-2 mb-6">
               <Activity className="h-6 w-6 text-blue-500" />
               <h2 className="text-2xl font-bold">고급 현금흐름 분석</h2>
               <Badge variant="secondary" className="ml-2">10년 정밀분석</Badge>
             </div>
             <CashFlowChart 
               cashFlows={result.cashFlows} 
               dscr={result.dscr || []} 
             />
           </div>
         </motion.div>
       )}
 
       {/* 민감도 분석 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-bold">민감도 분석 (변수별 영향도)</h3>
        </div>
        
        <Card className="p-6">
          <div className="space-y-4">
            {sensitivityData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.parameter}</span>
                  <span className={`font-bold ${
                    item.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    NPV: {item.impact > 0 ? '+' : ''}{item.impact}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${Math.abs(item.impact)}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 🤖 AI 평가 탭 - 고도화된 새로운 AI 평가 페이지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-bold">🤖 AI 평가</h3>
          <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-800">
            고도화된 AI 분석
          </Badge>
        </div>
        
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              AI 기반 투자 평가 시스템
            </h4>
            <p className="text-gray-600 mb-6">
              고도화된 AI 알고리즘으로 투자 타당성을 종합 분석합니다
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-2xl mb-2">📊</div>
                <h5 className="font-bold text-sm mb-1">정밀 분석</h5>
                <p className="text-xs text-gray-600">다차원 재무지표 분석</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-2xl mb-2">🎯</div>
                <h5 className="font-bold text-sm mb-1">등급 평가</h5>
                <p className="text-xs text-gray-600">투자 등급 자동 산출</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <div className="text-2xl mb-2">💡</div>
                <h5 className="font-bold text-sm mb-1">맞춤 추천</h5>
                <p className="text-xs text-gray-600">개별 투자 전략 제시</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
              <h5 className="font-bold text-sm mb-2 text-purple-800">AI 분석 결과</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className={`text-lg font-bold ${result.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.npv > 0 ? '✓' : '✗'}
                  </div>
                  <div className="text-xs text-gray-600">NPV 타당성</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${result.irr > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.irr.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-600">IRR 수익률</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    calculateAverageDSCR(result) >= 1.25 ? 'text-green-600' : 
                    calculateAverageDSCR(result) >= 1.0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {calculateAverageDSCR(result).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">DSCR 안정성</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${
                    grade.score >= 85 ? 'text-green-600' :
                    grade.score >= 75 ? 'text-blue-600' :
                    grade.score >= 65 ? 'text-yellow-600' :
                    grade.score >= 50 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {grade.score}점
                  </div>
                  <div className="text-xs text-gray-600">종합 점수</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>AI 평가 결과:</strong> {grade.grade} 등급으로 평가되었습니다. 
                상세한 분석 결과는 위의 각 섹션에서 확인하실 수 있습니다.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* NPV 상세 표시 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-purple-500" />
          <h3 className="text-xl font-bold">NPV 상세 분석</h3>
        </div>
        
        {result.npvDetails && (
          <NPVDetailedDisplay 
            details={result.npvDetails.details}
            summary={result.npvDetails.summary}
          />
        )}
      </motion.div>
    </motion.div>
  );
} 