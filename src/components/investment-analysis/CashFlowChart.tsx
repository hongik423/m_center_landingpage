'use client';

import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { CashFlow } from '@/lib/utils/investment-analysis';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CashFlowChartProps {
  cashFlows: CashFlow[];
  dscr: number[];
}

export default function CashFlowChart({ cashFlows, dscr }: CashFlowChartProps) {
  if (!cashFlows || cashFlows.length === 0) {
    return null;
  }

  const cashFlowChartData = {
    labels: cashFlows.map(cf => `${cf.year}년차`),
    datasets: [
      {
        label: '순현금흐름',
        data: cashFlows.map(cf => cf.netCashFlow / 100000000),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: '누적현금흐름',
        data: cashFlows.map(cf => cf.cumulativeCashFlow / 100000000),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ]
  };

  const dscrChartData = {
    labels: cashFlows.map(cf => `${cf.year}년차`),
    datasets: [
      {
        label: 'DSCR',
        data: dscr,
        backgroundColor: dscr.map(d => {
          if (d >= 1.25) return '#10B981';
          if (d >= 1.0) return '#F59E0B';
          return '#EF4444';
        }),
        borderColor: dscr.map(d => {
          if (d >= 1.25) return '#059669';
          if (d >= 1.0) return '#D97706';
          return '#DC2626';
        }),
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const revenueVsCostData = {
    labels: cashFlows.map(cf => `${cf.year}년차`),
    datasets: [
      {
        label: '매출액',
        data: cashFlows.map(cf => cf.revenue / 100000000),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22C55E',
        borderWidth: 2,
      },
      {
        label: '운영비용',
        data: cashFlows.map(cf => cf.operatingCost / 100000000),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#EF4444',
        borderWidth: 2,
      },
      {
        label: '순이익',
        data: cashFlows.map(cf => cf.netIncome / 100000000),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3B82F6',
        borderWidth: 2,
      }
    ]
  };

  const profitabilityData = {
    labels: ['순이익', '세금', '이자비용', '감가상각'],
    datasets: [
      {
        data: [
          cashFlows.reduce((sum, cf) => sum + cf.netIncome, 0) / 100000000,
          cashFlows.reduce((sum, cf) => sum + cf.tax, 0) / 100000000,
          cashFlows.reduce((sum, cf) => sum + cf.loanInterest, 0) / 100000000,
          cashFlows.reduce((sum, cf) => sum + cf.depreciation, 0) / 100000000,
        ],
        backgroundColor: [
          '#10B981',
          '#F59E0B', 
          '#EF4444',
          '#8B5CF6'
        ],
        borderColor: [
          '#059669',
          '#D97706',
          '#DC2626',
          '#7C3AED'
        ],
        borderWidth: 2,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = `${context.parsed.y.toFixed(1)}억원`;
            return `${label}: ${value}`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: any) => `${value}억원`,
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `DSCR: ${context.parsed.y.toFixed(2)}배`
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: { 
          callback: (value: any) => `${value}배`,
          font: {
            size: 11
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = `${context.parsed.toFixed(1)}억원`;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold">현금흐름 추이 분석 ({cashFlows.length}년)</h3>
        </div>
        <div className="h-80">
          <Line data={cashFlowChartData} options={lineChartOptions} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">총 현금유입</p>
            <p className="text-lg font-bold text-blue-700">
              +{(cashFlows.reduce((sum, cf) => sum + Math.max(0, cf.netCashFlow), 0) / 100000000).toFixed(1)}억원
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">최종 누적수익</p>
            <p className="text-lg font-bold text-green-700">
              {(cashFlows[cashFlows.length - 1]?.cumulativeCashFlow / 100000000 || 0).toFixed(1)}억원
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">손익분기점</p>
            <p className="text-lg font-bold text-purple-700">
              {(() => {
                const breakEvenIndex = cashFlows.findIndex(cf => cf.cumulativeCashFlow >= 0);
                return breakEvenIndex >= 0 ? `${breakEvenIndex + 1}년차` : '미도달';
              })()}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-bold">부채상환비율 (DSCR)</h3>
          </div>
          <div className="h-64">
            <Bar data={dscrChartData} options={barChartOptions} />
          </div>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>안전 (≥1.25)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>보통 (1.0-1.25)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>위험 (1.0미만)</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-bold">{cashFlows.length}년 수익성 구조</h3>
          </div>
          <div className="h-64">
            <Doughnut data={profitabilityData} options={doughnutOptions} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-bold">매출 vs 비용 분석</h3>
        </div>
        <div className="h-80">
          <Bar data={revenueVsCostData} options={{
            ...barChartOptions,
            plugins: {
              ...barChartOptions.plugins,
              legend: { 
                display: true,
                position: 'top' as const
              }
            }
          }} />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">평균 매출액</p>
            <p className="text-lg font-bold text-green-700">
              {(cashFlows.reduce((sum, cf) => sum + cf.revenue, 0) / cashFlows.length / 100000000).toFixed(1)}억원
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 font-medium">평균 운영비용</p>
            <p className="text-lg font-bold text-red-700">
              {(cashFlows.reduce((sum, cf) => sum + cf.operatingCost, 0) / cashFlows.length / 100000000).toFixed(1)}억원
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">평균 순이익</p>
            <p className="text-lg font-bold text-blue-700">
              {(cashFlows.reduce((sum, cf) => sum + cf.netIncome, 0) / cashFlows.length / 100000000).toFixed(1)}억원
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">평균 영업이익률</p>
            <p className="text-lg font-bold text-purple-700">
              {(cashFlows.reduce((sum, cf) => sum + cf.operatingProfitRate, 0) / cashFlows.length).toFixed(1)}%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 