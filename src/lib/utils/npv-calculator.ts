// NPV 상세 계산 유틸리티

export interface DetailedNPVCalculation {
  year: number;
  revenue: number;
  operatingProfitRate: number;
  operatingProfit: number;
  tax: number;
  netIncome: number;
  depreciation: number;
  loanPrincipal: number;
  loanInterest: number;
  policyLoanPrincipal?: number;
  policyLoanInterest?: number;
  otherDebtPrincipal?: number;
  otherDebtInterest?: number;
  netCashFlow: number;
  discountRate: number;
  discountFactor: number;
  presentValue: number;
  cumulativePV: number;
}

export function calculateDetailedNPV(
  revenue: number,
  operatingProfitRate: number,
  taxRate: number,
  discountRate: number,
  analysisYears: number,
  initialInvestment: number,
  loanSchedule?: { principal: number[], interest: number[] },
  depreciationAmount: number = 0,
  growthRate: number = 0
): {
  npv: number;
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
} {
  const details: DetailedNPVCalculation[] = [];
  let cumulativePV = -initialInvestment;
  
  // 초기 투자 기록
  details.push({
    year: 0,
    revenue: 0,
    operatingProfitRate: 0,
    operatingProfit: 0,
    tax: 0,
    netIncome: 0,
    depreciation: 0,
    loanPrincipal: 0,
    loanInterest: 0,
    policyLoanPrincipal: 0,
    policyLoanInterest: 0,
    otherDebtPrincipal: 0,
    otherDebtInterest: 0,
    netCashFlow: -initialInvestment,
    discountRate: discountRate,
    discountFactor: 1,
    presentValue: -initialInvestment,
    cumulativePV: -initialInvestment
  });
  
  let totalRevenue = 0;
  let totalOperatingProfit = 0;
  let totalNetIncome = 0;
  let totalCashFlow = 0;
  let totalPresentValue = -initialInvestment;
  
  for (let year = 1; year <= analysisYears; year++) {
    // 매출 계산 (성장률 적용)
    const yearRevenue = revenue * Math.pow(1 + growthRate / 100, year - 1);
    
    // 영업이익 계산
    const operatingProfit = yearRevenue * (operatingProfitRate / 100);
    
    // 세금 계산
    const taxableIncome = operatingProfit - (loanSchedule?.interest[year - 1] || 0);
    const tax = Math.max(0, taxableIncome * (taxRate / 100));
    
    // 순이익 계산
    const netIncome = operatingProfit - tax - (loanSchedule?.interest[year - 1] || 0);
    
    // 현금흐름 계산
    const netCashFlow = netIncome + depreciationAmount - (loanSchedule?.principal[year - 1] || 0);
    
    // 할인율 적용
    const discountFactor = Math.pow(1 + discountRate / 100, year);
    const presentValue = netCashFlow / discountFactor;
    
    cumulativePV += presentValue;
    
    // 상세 기록
    details.push({
      year,
      revenue: yearRevenue,
      operatingProfitRate,
      operatingProfit,
      tax,
      netIncome,
      depreciation: depreciationAmount,
      loanPrincipal: loanSchedule?.principal[year - 1] || 0,
      loanInterest: loanSchedule?.interest[year - 1] || 0,
      policyLoanPrincipal: 0,
      policyLoanInterest: 0,
      otherDebtPrincipal: 0,
      otherDebtInterest: 0,
      netCashFlow,
      discountRate,
      discountFactor,
      presentValue,
      cumulativePV
    });
    
    // 합계 업데이트
    totalRevenue += yearRevenue;
    totalOperatingProfit += operatingProfit;
    totalNetIncome += netIncome;
    totalCashFlow += netCashFlow;
    totalPresentValue += presentValue;
  }
  
  return {
    npv: totalPresentValue,
    details,
    summary: {
      totalRevenue,
      totalOperatingProfit,
      totalNetIncome,
      totalCashFlow,
      totalPresentValue,
      initialInvestment,
      netPresentValue: totalPresentValue
    }
  };
} 