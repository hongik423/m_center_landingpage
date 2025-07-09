'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DetailedNPVCalculation } from '@/lib/utils/investment-analysis';
import { Calculator, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

// 금액 포맷팅 함수
const formatCurrency = (value: number): string => {
  if (value === 0) return '0원';
  
  const absValue = Math.abs(value);
  const isNegative = value < 0;
  
  if (absValue >= 100000000) {
    // 억 단위
    const billions = absValue / 100000000;
    return `${isNegative ? '-' : ''}${billions.toFixed(2)}억원`;
  } else if (absValue >= 10000) {
    // 만원 단위
    const tenThousands = absValue / 10000;
    return `${isNegative ? '-' : ''}${tenThousands.toFixed(0)}만원`;
  } else {
    return `${isNegative ? '-' : ''}${absValue.toFixed(0)}원`;
  }
};

// 퍼센트 포맷팅 함수
const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

interface NPVDetailedDisplayProps {
  details: DetailedNPVCalculation[];
  summary: {
    totalRevenue: number;
    totalOperatingProfit: number;
    totalNetIncome: number;
    totalCashFlow: number;
    totalPresentValue: number;
    initialInvestment: number;
    netPresentValue: number;
  };
}

export default function NPVDetailedDisplay({ details, summary }: NPVDetailedDisplayProps) {
  return (
    <div className="space-y-6">
      {/* NPV 계산 공식 설명 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            NPV 계산 공식
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="font-mono text-sm">
              NPV = Σ [CFt / (1 + r)^t] - 초기투자
            </p>
            <p className="text-sm text-gray-600">
              • CFt: t년도의 현금흐름<br />
              • r: 할인율 (연 %)<br />
              • t: 연차 (1, 2, 3...)<br />
              • 초기투자: 0년차 투자금액
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 연도별 상세 계산 내역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            연도별 NPV 계산 상세
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">연차</TableHead>
                  <TableHead className="text-right">매출액</TableHead>
                  <TableHead className="text-center">영업이익률</TableHead>
                  <TableHead className="text-right">영업이익</TableHead>
                  <TableHead className="text-right">세금</TableHead>
                  <TableHead className="text-right">순이익</TableHead>
                  <TableHead className="text-right">감가상각</TableHead>
                  <TableHead className="text-center" colSpan={2}>정책자금<br/>(억원)</TableHead>
                  <TableHead className="text-center" colSpan={2}>기타채무<br/>(억원)</TableHead>
                  <TableHead className="text-right">순현금흐름</TableHead>
                  <TableHead className="text-center">할인율</TableHead>
                  <TableHead className="text-right">현재가치</TableHead>
                  <TableHead className="text-right">누적 PV</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead colSpan={7}></TableHead>
                  <TableHead className="text-right text-xs">원금</TableHead>
                  <TableHead className="text-right text-xs">이자</TableHead>
                  <TableHead className="text-right text-xs">원금</TableHead>
                  <TableHead className="text-right text-xs">이자</TableHead>
                  <TableHead colSpan={4}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail, index) => {
                  // ✅ 초기 투자 표시 (정책자금도 투자액에 포함)
                  if (detail.year === 0) {
                    return (
                      <TableRow key={index} className="bg-blue-50">
                        <TableCell className="text-center font-bold">초기 투자</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-center">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          {formatCurrency(detail.netCashFlow)}
                        </TableCell>
                        <TableCell className="text-center">-</TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          {formatCurrency(detail.presentValue)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(detail.cumulativePV)}
                        </TableCell>
                      </TableRow>
                    );
                  }
                  
                  // 일반 연도 행
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-center font-medium">{`${detail.year}년`}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.revenue)}</TableCell>
                      <TableCell className="text-center">{`${detail.operatingProfitRate}%`}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.operatingProfit)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.tax)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.netIncome)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.depreciation)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.policyLoanPrincipal || detail.loanPrincipal || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.policyLoanInterest || detail.loanInterest || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.otherDebtPrincipal || 0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(detail.otherDebtInterest || 0)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(detail.netCashFlow)}</TableCell>
                      <TableCell className="text-center">{`1/${detail.discountFactor.toFixed(3)}`}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(detail.presentValue)}</TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(detail.cumulativePV)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 계산 과정 시각화 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            NPV 계산 과정 예시 (123억 매출, 14% 영업이익률)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">1년차 계산 예시:</h4>
              <div className="space-y-1 text-sm">
                <p>• 매출액: 123억원</p>
                <p>• 영업이익: 123억 × 14% = 17.22억원</p>
                <p>• 세금(22%): 17.22억 × 22% = 3.79억원</p>
                <p>• 순이익: 17.22억 - 3.79억 = 13.43억원</p>
                <p>• 현금흐름: 13.43억 + 감가상각 - 대출상환</p>
                <p className="font-semibold">• 현재가치(할인율 10%): 현금흐름 ÷ 1.1 = PV</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 NPV 계산 핵심 포인트:</h4>
              <div className="space-y-1 text-sm">
                <p>• 단순 합계: 17.22억 × 9년 = 154.98억원</p>
                <p className="text-red-600 font-semibold">
                  • 하지만 시간가치를 고려하면 실제 가치는 더 낮음!
                </p>
                <p>• 할인된 현재가치 합계: {formatCurrency(summary.totalPresentValue + summary.initialInvestment)}</p>
                <p className="text-blue-600 font-semibold">
                  • <strong>중요:</strong> NPV 계산은 "전체 투자액" 기준으로 계산됩니다
                </p>
                <p>• 전체 투자액 차감: -{formatCurrency(summary.initialInvestment)}</p>
                <p className="font-bold text-lg">
                  • 최종 NPV: {formatCurrency(summary.netPresentValue)}
                </p>
              </div>
            </div>
            
            {/* ✅ 정책자금 투자 특성 설명 수정 */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-800">🏛️ 정책자금 투자의 올바른 이해:</h4>
              <div className="space-y-1 text-sm text-yellow-700">
                <p>• <strong>정책자금:</strong> 정부/지자체 저금리 융자 (상환 의무 있음)</p>
                <p>• <strong>투자 책임:</strong> 사업자가 전체 투자금액에 대해 책임집니다</p>
                <p>• <strong>NPV 계산:</strong> 전체 투자액 기준으로 계산하는 것이 맞습니다</p>
                <p className="font-medium text-red-700">
                  ✅ 정책자금도 상환해야 하는 자금이므로 전체 투자액이 NPV 계산 기준입니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 요약 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            NPV 계산 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">총 매출액 (9년)</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">총 영업이익</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalOperatingProfit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">총 순이익</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalNetIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">총 현금흐름</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalCashFlow)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">현재가치 합계</p>
              <p className="text-xl font-bold">{formatCurrency(summary.totalPresentValue + summary.initialInvestment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">초기 투자금</p>
              <p className="text-xl font-bold text-red-600">-{formatCurrency(summary.initialInvestment)}</p>
            </div>
            <div className="col-span-2 border-t pt-4">
              <p className="text-sm text-gray-600">순현재가치 (NPV)</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(summary.netPresentValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 