// 정책자금 투자분석 계산 알고리즘 (NPP/IRR 최적화)

import { DetailedNPVCalculation } from './npv-calculator';

export interface InvestmentInput {
  // 초기 투자 정보
  initialInvestment: number; // 초기 투자금 (원)
  policyFundAmount: number; // 정책자금 규모 (원)
  interestRate: number; // 대출금리 (%)
  loanPeriod: number; // 대출 기간 (년)
  gracePeriod: number; // 거치 기간 (년)
  
  // 수익성 분석 (NPP/IRR 최적화)
  annualRevenue: number | number[]; // 연도별 예상 매출 (원) - 단일값 또는 배열
  operatingProfitRate: number; // 영업이익률 (%) - 자동계산 기준
  operatingMargin?: number; // 영업이익률 (%) - UI 입력용 (operatingProfitRate와 동일)
  operatingCostRate?: number; // 운영비율 (%) - 호환성 유지
  taxRate?: number; // 법인세율 (%) - 기본값 25%
  
  // 분석 조건
  discountRate: number; // 할인율 (%) - NPV 계산용
  analysisYears: number; // 분석 기간 (년)
  
  // 새로운 NPP/IRR 최적화 변수들
  revenueGrowthRate?: number; // 매출성장률 (% 연간) - 기본값 5%
  marketPenetrationRate?: number; // 시장점유율 (%) - 기본값 0%
  customerRetentionRate?: number; // 고객유지율 (%) - 기본값 100%
  
  // 시나리오 분석
  scenarioType?: 'pessimistic' | 'neutral' | 'optimistic'; // 시나리오 선택 - 기본값 neutral
  scenarioAdjustmentRate?: number; // 시나리오 조정율 (%) - 기본값 0%
  
  // 재무구조 분석
  debtRatio?: number; // 부채비율 (%) - 기본값 30%
  workingCapitalRatio?: number; // 운전자본비율 (%) - 기본값 15%
  
  // 고급 설정 변수들
  costInflationRate?: number; // 비용상승률 (% 연간)
  additionalLoanRate?: number; // 추가 대출금리 (%)
  depreciationRate?: number; // 감가상각률 (% 연간)
  residualValue?: number; // 잔존가치 (원)
  inflationRate?: number; // 인플레이션율 (%)
  corporateTaxRate?: number; // 법인세율 (고급 설정)
  
  // 시나리오 분석 설정
  enableScenarioAnalysis?: boolean; // 시나리오 분석 활성화
  pessimisticAdjustment?: number; // 비관적 시나리오 조정률 (%)
  optimisticAdjustment?: number; // 낙관적 시나리오 조정률 (%)
  selectedScenario?: 'pessimistic' | 'neutral' | 'optimistic'; // 선택된 시나리오
  scenarioAdjustment?: number; // 선택된 시나리오 조정률 (%)
}

export interface InvestmentResult {
  npv: number; // 순현재가치 (NPV)
  irr: number; // 내부수익률 (IRR)
  paybackPeriod: number; // 할인 투자회수기간 (Discounted Payback Period)
  breakEvenPoint: number; // 손익분기점 (년)
  dscr: number[]; // 부채상환비율 (연도별)
  roi: number; // 투자수익률
  profitabilityIndex: number; // 수익성지수
  cashFlows: CashFlow[]; // 연도별 현금흐름
  
  // 새로운 NPP/IRR 최적화 지표들
  averageROI: number; // 평균 투자수익률
  cumulativeROI: number; // 누적 투자수익률
  riskAdjustedReturn: number; // 위험조정수익률
  marketValueAdded: number; // 시장가치증가액
  economicValueAdded: number; // 경제부가가치
  
  // NPV 상세 정보 추가
  npvDetails?: {
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
  };
  
  // DSCR 상세 정보 추가
  dscrData?: {
    year: number;
    revenue: number;
    operatingProfit: number;
    policyLoanInterest: number;
    policyLoanPrincipal: number;
    remainingPolicyLoan: number;
    otherDebtInterest: number;
    otherDebtPrincipal: number;
    remainingOtherDebt: number;
    totalDebtService: number;
    dscr: number;
  }[];
}

export interface CashFlow {
  year: number;
  revenue: number;
  operatingCost: number;
  ebit: number; // 영업이익
  tax: number;
  netIncome: number; // 순이익
  depreciation: number; // 감가상각
  loanPrincipal: number; // 원금상환
  loanInterest: number; // 이자상환
  netCashFlow: number; // 순현금흐름
  cumulativeCashFlow: number; // 누적현금흐름
  presentValue: number; // 현재가치
  cumulativePV: number; // 누적현재가치
  
  // 새로운 NPP/IRR 최적화 지표들
  operatingProfitRate: number; // 영업이익률 (연도별)
  roic: number; // 투하자본이익률
  fcf: number; // 자유현금흐름
  discountedFCF: number; // 할인된 자유현금흐름
}

// 영업이익률 기반 연간비용 자동계산 알고리즘
export function calculateAnnualCost(revenue: number, operatingProfitRate: number): number {
  // 연간비용 = 매출액 * (1 - 영업이익률/100)
  return revenue * (1 - operatingProfitRate / 100);
}

// 개선된 매출 성장률 계산 (급성장 기업 고려)
export function calculateRevenueWithGrowth(
  baseRevenue: number, 
  growthRate: number, 
  year: number,
  marketPenetrationRate: number = 0,
  customerRetentionRate: number = 100
): number {
  // 기본 성장률 적용
  let revenue = baseRevenue * Math.pow(1 + growthRate / 100, year);
  
  // 시장점유율 효과 반영 (초기 몇 년간 가속)
  if (year <= 3 && marketPenetrationRate > 0) {
    const penetrationBoost = (marketPenetrationRate / 100) * (4 - year) * 0.1;
    revenue *= (1 + penetrationBoost);
  }
  
  // 고객유지율 효과 반영 (중장기 안정성)
  if (year > 3 && customerRetentionRate < 100) {
    const retentionPenalty = (100 - customerRetentionRate) / 100 * 0.05;
    revenue *= (1 - retentionPenalty);
  }
  
  return Math.max(0, revenue);
}

// NPV (순현재가치) 계산 - 완전히 정확한 버전
export function calculateNPV(cashFlows: number[], discountRate: number): number {
  if (!Array.isArray(cashFlows) || cashFlows.length === 0) {
    return 0;
  }
  
  if (!isFinite(discountRate) || discountRate < 0) {
    return 0;
  }
  
  // 할인율을 소수로 변환
  const rate = discountRate / 100;
  
  return cashFlows.reduce((npv, cashFlow, year) => {
    if (!isFinite(cashFlow)) {
      return npv;
    }
    
    // year가 0인 경우 (초기 투자)는 할인하지 않음
    if (year === 0) {
      return npv + cashFlow;
    }
    
    // 할인율을 사용하여 현재가치 계산: PV = CF / (1 + r)^t
    const discountFactor = Math.pow(1 + rate, year);
    if (!isFinite(discountFactor) || discountFactor === 0) {
      return npv;
    }
    
    const presentValue = cashFlow / discountFactor;
    return npv + (isFinite(presentValue) ? presentValue : 0);
  }, 0);
}

// 🔥 NEW: 상세 NPV 계산 함수 (단계별 분해)
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
    netCashFlow: -initialInvestment,
    discountRate,
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
    
    // 영업이익 계산 (입력된 영업이익률 사용)
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

// 🔥 NEW: 영업이익률 변동 시나리오 NPV 분석
export function analyzeOperatingProfitScenarios(
  baseInput: InvestmentInput,
  profitRateScenarios: number[] = [10, 12, 14, 16, 18, 20]
): {
  scenario: number;
  npv: number;
  irr: number;
  discountedPaybackPeriod: number;
}[] {
  return profitRateScenarios.map(profitRate => {
    const modifiedInput = { ...baseInput, operatingProfitRate: profitRate };
    const result = performInvestmentAnalysis(modifiedInput);
    
    return {
      scenario: profitRate,
      npv: result.npv,
      irr: result.irr,
      discountedPaybackPeriod: result.paybackPeriod
    };
  });
}

// IRR (내부수익률) 계산 - 개선된 Newton-Raphson 방법
export function calculateIRR(cashFlows: number[], initialGuess: number = 10): number {
  // 입력값 검증
  if (!cashFlows || cashFlows.length < 2) {
    return 0;
  }
  
  // 모든 현금흐름이 같은 부호인 경우 IRR을 계산할 수 없음
  const hasPositive = cashFlows.some(cf => cf > 0);
  const hasNegative = cashFlows.some(cf => cf < 0);
  if (!hasPositive || !hasNegative) {
    return 0;
  }
  
  // 초기 추정값 설정 (%)
  let rate = initialGuess / 100;
  const maxIterations = 100;
  const tolerance = 0.00001;
  
  // Newton-Raphson 반복
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = 0;
    let dnpv = 0; // NPV의 미분값
    
    // NPV와 그 미분값 계산
    for (let t = 0; t < cashFlows.length; t++) {
      const cf = cashFlows[t];
      const discountFactor = Math.pow(1 + rate, t);
      
      if (discountFactor === 0) {
        // 0으로 나누기 방지
        continue;
      }
      
      npv += cf / discountFactor;
      
      // 미분 계산 (t가 0일 때는 미분값이 0)
      if (t > 0) {
        dnpv -= (t * cf) / Math.pow(1 + rate, t + 1);
      }
    }
    
    // 수렴 확인
    if (Math.abs(npv) < tolerance) {
      return rate * 100; // 백분율로 변환
    }
    
    // 미분값이 너무 작으면 중단
    if (Math.abs(dnpv) < tolerance) {
      break;
    }
    
    // Newton-Raphson 업데이트
    const newRate = rate - npv / dnpv;
    
    // 수렴 조건 확인
    if (Math.abs(newRate - rate) < tolerance) {
      return Math.max(-99, Math.min(999, newRate * 100));
    }
    
    // 발산 방지 - 더 보수적인 범위 제한
    if (newRate < -0.99) {
      rate = -0.99;
    } else if (newRate > 10) {
      rate = 10;
    } else {
      rate = newRate;
    }
  }
  
  // 수렴하지 않은 경우 이분법(Bisection Method) 사용
  return calculateIRRBisection(cashFlows);
}

// IRR 계산 - 이분법 (보조 함수)
function calculateIRRBisection(cashFlows: number[]): number {
  let low = -0.99;
  let high = 10;
  const tolerance = 0.00001;
  const maxIterations = 100;
  
  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    
    // NPV 계산
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + mid, t);
    }
    
    if (Math.abs(npv) < tolerance) {
      return mid * 100; // 백분율로 변환
    }
    
    // NPV가 양수면 할인율을 높이고, 음수면 낮춤
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return ((low + high) / 2) * 100;
}

// 단순 회수기간 계산 (할인하지 않은 현금흐름 기준)
export function calculateSimplePaybackPeriod(cashFlows: CashFlow[]): number {
  // 누적 현금흐름이 0 이상이 되는 시점 찾기
  for (let i = 0; i < cashFlows.length; i++) {
    if (cashFlows[i].cumulativeCashFlow >= 0) {
      if (i === 0) {
        // 첫 해에 이미 회수된 경우
        return cashFlows[0].year;
      }
      
      // 선형 보간법으로 정확한 회수기간 계산
      const previousCF = cashFlows[i - 1].cumulativeCashFlow;
      const currentCF = cashFlows[i].cumulativeCashFlow;
      
      if (previousCF < 0 && currentCF >= 0) {
        // 해당 연도의 현금흐름으로 회수되는 비율 계산
        const yearFraction = -previousCF / (currentCF - previousCF);
        return cashFlows[i - 1].year + yearFraction;
      }
      
      return cashFlows[i].year;
    }
  }
  
  // 분석 기간 내에 회수되지 않음
  return -1;
}

// 투자회수기간 계산 (할인된 현금흐름 기준)
export function calculatePaybackPeriod(cumulativeCashFlows: number[]): number {
  // 이 함수는 이제 누적 현재가치(cumulativePV)를 받아서 처리합니다
  // 초기 투자가 없거나 현금흐름이 없는 경우
  if (!cumulativeCashFlows || cumulativeCashFlows.length === 0) {
    return -1;
  }
  
  // 누적 현재가치가 0 이상이 되는 시점 찾기
  for (let i = 0; i < cumulativeCashFlows.length; i++) {
    if (cumulativeCashFlows[i] >= 0) {
      if (i === 0) {
        // 첫 해에 이미 회수된 경우
        return 0;
      }
      
      // 선형 보간법으로 정확한 회수기간 계산
      const previousCF = cumulativeCashFlows[i - 1];
      const currentCF = cumulativeCashFlows[i];
      
      // 이전 년도가 음수이고 현재 년도가 양수인 경우에만 계산
      if (previousCF < 0 && currentCF >= 0) {
        const yearFraction = -previousCF / (currentCF - previousCF);
        return i + yearFraction;
      }
      
      // 이미 양수인 경우 i년에 회수 완료
      return i;
    }
  }
  
  // 분석 기간 내에 회수되지 않음
  return -1;
}

// 개정된 할인 회수기간 계산 (정책자금 특성 반영)
// 정책자금을 부채로 인식하여 총투자금액 기준으로 계산
export function calculateDiscountedPaybackPeriod(
  cashFlows: CashFlow[], 
  totalInitialInvestment: number,
  policyFundAmount: number = 0,
  discountRate: number = 10
): number {
  if (!cashFlows || cashFlows.length === 0) {
    return -1;
  }
  
  console.log('🔍 할인회수기간 계산 시작');
  console.log(`총 투자금액: ${(totalInitialInvestment/100000000).toFixed(2)}억원`);
  console.log(`정책자금: ${(policyFundAmount/100000000).toFixed(2)}억원`);
  console.log(`실제 투자금액: ${((totalInitialInvestment - policyFundAmount)/100000000).toFixed(2)}억원`);
  console.log(`할인율: ${discountRate}%`);
  
  // 단순화된 기준: 실제 투자금액 (정책자금 제외)
  const initialInvestment = totalInitialInvestment - policyFundAmount;
  
  // 누적 현재가치 계산
  let cumulativePV = 0;
  console.log('\n연도별 누적현재가치:');
  console.log(`초기 기준: -${(initialInvestment/100000000).toFixed(2)}억원`);
  
  // 누적 현재가치가 초기투자금액을 초과하는 시점 찾기
  for (let i = 0; i < cashFlows.length; i++) {
    const cf = cashFlows[i];
    cumulativePV += cf.presentValue;
    
    console.log(`${cf.year}년: 현재가치=${(cf.presentValue/100000000).toFixed(2)}억, 누적PV=${(cumulativePV/100000000).toFixed(2)}억`);
    
    if (cumulativePV >= initialInvestment) {
      if (i === 0) {
        // 첫 해에 이미 회수된 경우
        console.log(`첫 해에 회수 완료: ${cf.year}년`);
        return cf.year;
      }
      
      // 선형 보간법으로 정확한 회수기간 계산
      const previousCF = cashFlows[i - 1];
      const previousPV = cumulativePV - cf.presentValue;
      const remainingAmount = initialInvestment - previousPV;
      
      if (cf.presentValue > 0) {
        const yearFraction = remainingAmount / cf.presentValue;
        const exactPaybackPeriod = previousCF.year + yearFraction;
        
        console.log(`\n할인회수기간 계산:`);
        console.log(`- 이전년도(${previousCF.year}년) 누적PV: ${(previousPV/100000000).toFixed(2)}억`);
        console.log(`- 현재년도(${cf.year}년) PV: ${(cf.presentValue/100000000).toFixed(2)}억`);
        console.log(`- 잔여회수액: ${(remainingAmount/100000000).toFixed(2)}억`);
        console.log(`- 년도 비율: ${yearFraction.toFixed(3)}`);
        console.log(`- 최종 회수기간: ${exactPaybackPeriod.toFixed(2)}년`);
        
        return Math.max(0, exactPaybackPeriod);
      }
      
      console.log(`정확히 ${cf.year}년에 회수 완료`);
      return cf.year;
    }
  }
  
  console.log('분석 기간 내 투자금 회수 불가');
  return -1;
}

// 손익분기점 계산
export function calculateBreakEvenPoint(cashFlows: CashFlow[]): number {
  for (let i = 0; i < cashFlows.length; i++) {
    if (cashFlows[i].netIncome > 0) {
      if (i === 0) return 0;
      
      // 선형 보간법
      const previousIncome = cashFlows[i - 1].netIncome;
      const currentIncome = cashFlows[i].netIncome;
      
      if (currentIncome - previousIncome === 0) {
        return i;
      }
      
      const yearFraction = -previousIncome / (currentIncome - previousIncome);
      return Math.max(0, (i - 1) + yearFraction);
    }
  }
  
  return -1;
}

// DSCR (부채상환비율) 계산 - 개선된 버전
export function calculateDSCR(ebit: number, depreciation: number, principal: number, interest: number): number {
  const debtService = principal + interest;
  if (debtService === 0) return 0;
  
  // DSCR = 영업현금흐름 / 총 부채상환액
  // 영업현금흐름 = 세후순이익 + 감가상각비 (정확한 공식)
  const taxRate = 0.22; // 법인세율 22%
  const netIncome = ebit * (1 - taxRate);
  const operatingCashFlow = netIncome + depreciation;
  
  if (operatingCashFlow <= 0) return 0;
  
  const dscr = operatingCashFlow / debtService;
  
  // DSCR 유효성 검사 및 현실적 범위 제한
  if (!isFinite(dscr) || dscr < 0) return 0;
  if (dscr > 10) return 10; // 비현실적으로 높은 값 제한
  
  return Math.round(dscr * 100) / 100; // 소수점 2자리로 반올림
}

// 연도별 DSCR 상세 계산 (정책자금 특화)
export function calculateDetailedDSCR(input: {
  initialInvestment: number;
  annualRevenue: number;
  operatingProfitRate: number;
  analysisYears: number;
  policyLoanAmount?: number;
  policyLoanRate?: number;
  otherDebtAmount?: number;
  otherDebtRate?: number;
}, advancedSettings?: {
  revenueGrowthRate: number;
  costInflationRate: number;
}): {
  year: number;
  revenue: number;
  operatingProfit: number;
  policyLoanInterest: number;
  policyLoanPrincipal: number;
  remainingPolicyLoan: number;
  otherDebtInterest: number;
  otherDebtPrincipal: number;
  remainingOtherDebt: number;
  totalDebtService: number;
  dscr: number;
}[] {
  const settings = {
    revenueGrowthRate: 5,
    costInflationRate: 3,
    ...advancedSettings
  };
  
  const {
    annualRevenue,
    operatingProfitRate = 15,
    analysisYears,
    policyLoanAmount = 0,
    policyLoanRate = 2.5,
    otherDebtAmount = 0,
    otherDebtRate = 5.0
  } = input;
  
  const results = [];
  
  for (let year = 1; year <= analysisYears; year++) {
    // 연도별 매출 성장 반영
    const yearRevenue = annualRevenue * Math.pow(1 + settings.revenueGrowthRate / 100, year - 1);
    
    // 영업이익 계산 (비용 상승률 반영)
    const baseCost = annualRevenue * (1 - operatingProfitRate / 100);
    const adjustedCost = baseCost * Math.pow(1 + settings.costInflationRate / 100, year - 1);
    const operatingProfit = Math.max(0, yearRevenue - adjustedCost);
    
    // 정책자금 관련 계산 (원금 균등상환 방식)
    const policyLoanPrincipal = policyLoanAmount / analysisYears;
    const remainingPolicyLoan = policyLoanAmount - (policyLoanPrincipal * (year - 1));
    const policyLoanInterest = remainingPolicyLoan * (policyLoanRate / 100);
    
    // 기타채무 관련 계산 (원금 균등상환 방식)
    const otherDebtPrincipal = otherDebtAmount / analysisYears;
    const remainingOtherDebt = otherDebtAmount - (otherDebtPrincipal * (year - 1));
    const otherDebtInterest = remainingOtherDebt * (otherDebtRate / 100);
    
    // 총 부채상환액
    const totalDebtService = policyLoanInterest + policyLoanPrincipal + otherDebtInterest + otherDebtPrincipal;
    
    // DSCR 계산 (정확한 공식 적용)
    let dscr = 0;
    if (totalDebtService > 0) {
      const taxRate = 0.22; // 법인세율 22%
      const netIncome = operatingProfit * (1 - taxRate);
      const depreciation = yearRevenue * 0.05; // 매출의 5%를 감가상각비로 추정
      const operatingCashFlow = netIncome + depreciation;
      
      dscr = operatingCashFlow > 0 ? operatingCashFlow / totalDebtService : 0;
      
      // DSCR 유효성 검사
      if (!isFinite(dscr) || dscr < 0) dscr = 0;
      if (dscr > 10) dscr = 10; // 비현실적으로 높은 값 제한
    }
    
    results.push({
      year,
      revenue: yearRevenue,
      operatingProfit,
      policyLoanInterest,
      policyLoanPrincipal,
      remainingPolicyLoan,
      otherDebtInterest,
      otherDebtPrincipal,
      remainingOtherDebt,
      totalDebtService,
      dscr
    });
  }
  
  return results;
}

// 대출 상환 스케줄 계산 (정확한 이자율 반영 버전)
export function calculateLoanSchedule(
  loanAmount: number,
  interestRate: number,
  loanPeriod: number,
  gracePeriod: number = 0
): { principal: number[], interest: number[], remainingBalance: number[] } {
  const principal: number[] = [];
  const interest: number[] = [];
  const remainingBalance: number[] = [];
  
  // 입력값 유효성 검사
  if (loanAmount <= 0 || loanPeriod <= 0 || interestRate < 0) {
    return { principal: [], interest: [], remainingBalance: [] };
  }
  
  const annualRate = interestRate / 100;
  let balance = loanAmount;
  
  // 상환 기간 (거치기간 제외)
  const repaymentPeriod = Math.max(0, loanPeriod - gracePeriod);
  
  for (let year = 0; year < loanPeriod; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    if (year < gracePeriod) {
      // 거치 기간: 이자만 상환
      yearlyInterest = balance * annualRate;
      yearlyPrincipal = 0;
    } else {
      // 상환 기간: 원금 균등상환 방식 (정책자금 표준)
      if (repaymentPeriod > 0) {
        // 원금 균등상환: 매년 동일한 원금 상환
        yearlyPrincipal = loanAmount / repaymentPeriod;
        // 이자는 현재 잔액에 대해서만 계산
        yearlyInterest = balance * annualRate;
        
        // 잔액이 원금상환액보다 작은 경우 조정
        if (yearlyPrincipal > balance) {
          yearlyPrincipal = balance;
        }
      } else {
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
      
      balance = Math.max(0, balance - yearlyPrincipal);
    }
    
    principal.push(Math.max(0, yearlyPrincipal));
    interest.push(Math.max(0, yearlyInterest));
    remainingBalance.push(balance);
  }
  
  return { principal, interest, remainingBalance };
}

// 감가상각 계산 (정액법)
export function calculateDepreciation(assetValue: number, usefulLife: number, years: number): number[] {
  const annualDepreciation = assetValue / Math.max(1, usefulLife);
  const depreciation: number[] = [];
  
  for (let year = 0; year < years; year++) {
    if (year < usefulLife) {
      depreciation.push(annualDepreciation);
    } else {
      depreciation.push(0);
    }
  }
  
  return depreciation;
}

// 자유현금흐름 계산
export function calculateFreeCashFlow(
  netIncome: number,
  depreciation: number,
  workingCapitalChange: number,
  capitalExpenditure: number = 0
): number {
  return netIncome + depreciation - workingCapitalChange - capitalExpenditure;
}

// 투하자본이익률 (ROIC) 계산
export function calculateROIC(
  ebit: number,
  taxRate: number,
  investedCapital: number
): number {
  const nopat = ebit * (1 - taxRate / 100); // 세후순영업이익
  return investedCapital > 0 ? (nopat / investedCapital) * 100 : 0;
}

// 종합 투자분석 수행 (NPP/IRR 최적화 버전 + 시나리오 분석)
export function performInvestmentAnalysis(input: InvestmentInput): InvestmentResult {
  try {
    // 입력값 유효성 검사 및 기본값 설정
    if (!input || input.initialInvestment <= 0) {
      throw new Error('초기 투자금액이 유효하지 않습니다');
    }
    
    // operatingMargin과 operatingProfitRate 호환성 처리
    let operatingProfitRate = input.operatingProfitRate;
    if (input.operatingMargin && input.operatingMargin > 0) {
      operatingProfitRate = input.operatingMargin;
    }
    if (!operatingProfitRate || operatingProfitRate <= 0) {
      operatingProfitRate = 15; // 기본값 15%
    }
    
    // annualRevenue 단일값을 배열로 변환
    let annualRevenueArray: number[];
    if (Array.isArray(input.annualRevenue)) {
      annualRevenueArray = input.annualRevenue;
    } else {
      // 단일값인 경우 분석기간만큼 배열로 변환
      const analysisYears = input.analysisYears || 10;
      annualRevenueArray = new Array(analysisYears).fill(input.annualRevenue);
    }
    
    if (!annualRevenueArray || annualRevenueArray.length === 0) {
      throw new Error('연간 매출 정보가 없습니다');
    }
    
    console.log('🔍 투자분석 입력 데이터 (억원 단위):', {
      초기투자액: (input.initialInvestment / 100000000).toFixed(1) + '억원',
      연간매출: (annualRevenueArray[0] / 100000000).toFixed(1) + '억원',
      영업이익률: operatingProfitRate + '%',
      할인율: (input.discountRate || 10) + '%',
      분석기간: (input.analysisYears || 10) + '년'
    });
    
    const cashFlows: CashFlow[] = [];
    const details: DetailedNPVCalculation[] = []; // details 배열 초기화
    
    // 개선된 기본값 설정
    const revenueGrowthRate = Math.max(-50, Math.min(100, input.revenueGrowthRate || 0)); // 100%로 제한
    const marketPenetrationRate = Math.max(0, Math.min(100, input.marketPenetrationRate || 0));
    const customerRetentionRate = Math.max(0, Math.min(100, input.customerRetentionRate || 100));
    const costInflationRate = Math.max(0, Math.min(20, input.costInflationRate || 0));
    const workingCapitalRatio = Math.max(0, Math.min(50, input.workingCapitalRatio || 5)); // 새로운 필드 적용
    const depreciationRate = Math.max(5, Math.min(40, input.depreciationRate || 10));
    const residualValue = Math.max(0, input.residualValue || 0);
    const corporateTaxRate = Math.max(0, Math.min(40, input.corporateTaxRate || input.taxRate || 22));
    const debtRatio = Math.max(0, Math.min(500, input.debtRatio || 0)); // 부채비율 500%까지
    
    // 영업이익률 기본값 적용 (사용자 입력값 그대로 사용)
    const finalOperatingProfitRate = Math.max(-100, Math.min(200, operatingProfitRate));
    
    // 실제 초기 투자금액 계산
    const actualInitialInvestment = input.initialInvestment - (input.policyFundAmount || 0);
    
    if (actualInitialInvestment <= 0) {
      throw new Error('실제 투자금액이 0 이하입니다. 정책자금이 투자금액보다 큽니다.');
    }
    
    const netCashFlows: number[] = [-actualInitialInvestment];
    
    // 대출 상환 스케줄 계산 (이자율 사용)
    let loanSchedule = { principal: [0], interest: [0], remainingBalance: [0] };
    if (input.policyFundAmount && input.policyFundAmount > 0) {
      try {
        loanSchedule = calculateLoanSchedule(
          input.policyFundAmount,
          input.interestRate || 3.5, // 이자율 (대출 비용 계산용)
          input.loanPeriod || 7,
          input.gracePeriod || 2
        );
      } catch (error) {
        console.warn('대출 스케줄 계산 오류, 기본값 사용:', error);
        loanSchedule = { principal: [], interest: [], remainingBalance: [] };
      }
    }
    
    let cumulativeCashFlow = -actualInitialInvestment;
    let cumulativePV = -actualInitialInvestment;
    let previousWorkingCapital = 0;
    
    // 초기 투자 상세 기록 추가
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
      netCashFlow: -actualInitialInvestment,
      discountRate: input.discountRate || 10,
      discountFactor: 1,
      presentValue: -actualInitialInvestment,
      cumulativePV: -actualInitialInvestment
    });
    
    // 연도별 현금흐름 계산 (NPP/IRR 최적화 + 시나리오 적용)
    for (let year = 0; year < (input.analysisYears || 10); year++) {
      try {
        // 개선된 매출 계산 (급성장 기업 고려)
        const baseRevenue = annualRevenueArray[year] || annualRevenueArray[annualRevenueArray.length - 1] || 0;
        let revenue = calculateRevenueWithGrowth(
          baseRevenue,
          revenueGrowthRate,
          year,
          marketPenetrationRate,
          customerRetentionRate
        );
        
        // 🔥 시나리오 분석 적용 - 매출에 시나리오 조정 적용
        if (input.enableScenarioAnalysis && input.selectedScenario) {
          revenue = applyScenarioAdjustment(
            revenue, 
            input.selectedScenario, 
            input.scenarioAdjustment
          );
        }
        
        if (!isFinite(revenue) || revenue < 0) {
          throw new Error(`${year + 1}년차 매출 계산 오류: ${revenue}`);
        }
        
        // 영업이익률 기반 연간비용 자동계산
        let operatingCost = calculateAnnualCost(revenue, finalOperatingProfitRate);
        
        // 비용상승률 반영
        const costInflationFactor = Math.pow(1 + costInflationRate / 100, year);
        operatingCost = operatingCost * costInflationFactor;
        
        // 🔥 시나리오 분석 적용 - 비용에도 시나리오 조정 적용 (역방향)
        if (input.enableScenarioAnalysis && input.selectedScenario) {
          const costAdjustmentMultiplier = input.selectedScenario === 'pessimistic' ? 1.1 : 
                                           input.selectedScenario === 'optimistic' ? 0.9 : 1.0;
          operatingCost = operatingCost * costAdjustmentMultiplier;
        }
        
        // 감가상각비 계산
        const depreciation = calculateDepreciation(input.initialInvestment, 10, 1)[0] || 0;
        
        // 운전자본 변화 계산 (개선된 필드 적용)
        const currentWorkingCapital = revenue * (workingCapitalRatio / 100);
        const workingCapitalChange = currentWorkingCapital - previousWorkingCapital;
        previousWorkingCapital = currentWorkingCapital;
        
        // EBIT 계산 (영업이익 = 매출 × 영업이익률)
        const ebit = revenue * (finalOperatingProfitRate / 100);
        
        // 세금 계산
        const tax = Math.max(0, ebit * (corporateTaxRate / 100));
        const netIncome = ebit - tax;
        
        // 대출 상환
        const loanPrincipal = year < (input.loanPeriod || 7) && loanSchedule.principal[year] ? 
          loanSchedule.principal[year] : 0;
        const loanInterest = year < (input.loanPeriod || 7) && loanSchedule.interest[year] ? 
          loanSchedule.interest[year] : 0;
        
        // 자유현금흐름 계산
        const fcf = calculateFreeCashFlow(netIncome, depreciation, workingCapitalChange);
        
        // 순현금흐름 계산
        let netCashFlow = fcf - loanPrincipal - loanInterest;
        
        // 마지막 연도에 잔존가치와 운전자본 회수 반영
        if (year === (input.analysisYears || 10) - 1) {
          netCashFlow += residualValue + currentWorkingCapital;
        }
        
        // 유효성 검사
        if (!isFinite(netCashFlow)) {
          console.warn(`${year + 1}년차 현금흐름 계산 오류, 0으로 설정`);
          netCashFlow = 0;
        }
        
        cumulativeCashFlow += netCashFlow;
        
        // 할인율을 사용한 현재가치 계산 (정확한 공식)
        const discountRate = Math.max(0, input.discountRate || 10) / 100;
        const discountFactor = Math.pow(1 + discountRate, year + 1);
        
        const presentValue = isFinite(discountFactor) && discountFactor > 0 ? 
          netCashFlow / discountFactor : 0;
        const discountedFCF = isFinite(discountFactor) && discountFactor > 0 ? 
          fcf / discountFactor : 0;
          
        cumulativePV += isFinite(presentValue) ? presentValue : 0;
        
        // 투하자본이익률 계산
        const roic = calculateROIC(ebit, corporateTaxRate, actualInitialInvestment);
        
        // 연도별 영업이익률 계산 - 입력된 영업이익률 사용 (일관성 유지)
        const yearlyOperatingProfitRate = finalOperatingProfitRate;
        
        // details 배열에 상세 정보 추가
        details.push({
          year: year + 1,
          revenue,
          operatingProfitRate: yearlyOperatingProfitRate,
          operatingProfit: ebit,
          tax,
          netIncome,
          depreciation,
          loanPrincipal,
          loanInterest,
          netCashFlow,
          discountRate: input.discountRate || 10,
          discountFactor: discountFactor,
          presentValue,
          cumulativePV
        });
        
        cashFlows.push({
          year: year + 1,
          revenue,
          operatingCost,
          ebit,
          tax,
          netIncome,
          depreciation,
          loanPrincipal,
          loanInterest,
          netCashFlow,
          cumulativeCashFlow,
          presentValue,
          cumulativePV,
          operatingProfitRate: yearlyOperatingProfitRate,
          roic,
          fcf,
          discountedFCF
        });
        
        netCashFlows.push(netCashFlow);
        
      } catch (error) {
        console.error(`${year + 1}년차 계산 오류:`, error);
        // 오류 발생 시 기본값으로 계속 진행
        netCashFlows.push(0);
        cashFlows.push({
          year: year + 1,
          revenue: 0,
          operatingCost: 0,
          ebit: 0,
          tax: 0,
          netIncome: 0,
          depreciation: 0,
          loanPrincipal: 0,
          loanInterest: 0,
          netCashFlow: 0,
          cumulativeCashFlow,
          presentValue: 0,
          cumulativePV,
          operatingProfitRate: 0,
          roic: 0,
          fcf: 0,
          discountedFCF: 0
        });
      }
    }
    
    // 핵심 지표 계산 (할인율과 이자율 분리)
    let npv = 0;
    let irr = 0;
    let paybackPeriod = -1;
    let breakEvenPoint = -1;
    
    try {
      // NPV는 할인율(discountRate)로 계산
      const discountRateForNPV = Math.max(0, input.discountRate || 10);
      npv = calculateNPV(netCashFlows, discountRateForNPV);
      
      if (!isFinite(npv)) {
        console.warn('NPV 계산 결과가 무한값, 누적 현재가치 사용');
        npv = cumulativePV;
      }
      
      console.log(`🔍 NPV 계산: 할인율 ${discountRateForNPV}%, 결과 ${(npv/100000000).toFixed(1)}억원`);
    } catch (error) {
      console.error('NPV 계산 오류:', error);
      npv = cumulativePV;
    }
    
    try {
      // IRR는 현금흐름 기반으로 계산 (할인율과 무관)
      if (netCashFlows.length > 1) {
        irr = calculateIRR(netCashFlows, 10);
        
        // IRR 유효성 검사 (더 엄격한 기준)
        if (!isFinite(irr) || Math.abs(irr) > 100 || isNaN(irr)) {
          console.warn('IRR 계산 결과가 비정상적, 0으로 설정');
          irr = 0;
        }
        
        // 추가 현실성 검사
        if (irr > 50) {
          console.warn(`IRR ${irr.toFixed(1)}%가 너무 높음, 50%로 제한`);
          irr = 50;
        }
        
        console.log(`🔍 IRR 계산: ${irr.toFixed(1)}%`);
      }
    } catch (error) {
      console.error('IRR 계산 오류:', error);
      irr = 0;
    }
    
    try {
      // 개정된 할인 회수기간 계산 (정책자금 특성 반영)
      paybackPeriod = calculateDiscountedPaybackPeriod(
        cashFlows,
        input.initialInvestment,
        input.policyFundAmount || 0,
        input.discountRate || 10
      );
      console.log(`🔍 개정된 할인 회수기간: ${paybackPeriod > 0 ? paybackPeriod.toFixed(2) + '년' : '미회수'}`);
    } catch (error) {
      console.error('할인 투자회수기간 계산 오류:', error);
      paybackPeriod = -1;
    }
    
    try {
      breakEvenPoint = calculateBreakEvenPoint(cashFlows);
    } catch (error) {
      console.error('손익분기점 계산 오류:', error);
    }
    
    // DSCR 계산
    const dscr = cashFlows.map(cf => {
      try {
        const totalDebtService = cf.loanPrincipal + cf.loanInterest;
        
        if (totalDebtService === 0) {
          return 0; // 부채 없음
        }
        
        const result = calculateDSCR(cf.ebit, cf.depreciation, cf.loanPrincipal, cf.loanInterest);
        return isFinite(result) && result >= 0 ? result : 0;
      } catch (error) {
        return 0;
      }
    });
    
    // 기본 ROI 계산 (개선된 버전)
    // ROI = (총 현금흐름 - 초기투자) / 초기투자 × 100
    // 투자 대비 수익률을 나타내며, 100% 이상이면 투자금액 이상의 수익 발생
    let roi = 0;
    try {
      const totalReturn = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0);
      const netReturn = totalReturn - actualInitialInvestment;
      roi = actualInitialInvestment > 0 ? (netReturn / actualInitialInvestment) * 100 : 0;
      if (!isFinite(roi)) roi = 0;
      console.log(`🔍 ROI 계산: 총수익 ${(totalReturn/100000000).toFixed(1)}억, ROI ${roi.toFixed(1)}%`);
    } catch (error) {
      console.error('ROI 계산 오류:', error);
    }
    
    // 수익성지수(PI) 계산 (개선된 버전)
    // PI = 미래현금흐름의 현재가치 합계 / 초기투자
    // 1.0 이상이면 투자 타당, 높을수록 수익성이 좋음
    let profitabilityIndex = 0;
    try {
      const pvOfCashFlows = cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0);
      const totalPVInflows = pvOfCashFlows + actualInitialInvestment; // 초기투자 제외한 현재가치
      profitabilityIndex = actualInitialInvestment > 0 ? 
        totalPVInflows / actualInitialInvestment : 0;
      if (!isFinite(profitabilityIndex)) profitabilityIndex = 0;
      console.log(`🔍 PI 계산: 현재가치 ${(totalPVInflows/100000000).toFixed(1)}억, PI ${profitabilityIndex.toFixed(2)}`);
    } catch (error) {
      console.error('수익성지수 계산 오류:', error);
    }
    
    // 새로운 NPP/IRR 최적화 지표들
    // 평균 ROI: 연도별 ROIC의 평균값
    const averageROI = cashFlows.length > 0 ? 
      cashFlows.reduce((sum, cf) => sum + cf.roic, 0) / cashFlows.length : 0;
    
    // 누적 ROI: 최종 누적현금흐름 대비 초기투자 수익률
    const cumulativeROI = cashFlows.length > 0 && actualInitialInvestment > 0 ? 
      (cashFlows[cashFlows.length - 1].cumulativeCashFlow - actualInitialInvestment) / actualInitialInvestment * 100 : 0;
    
    // 위험조정수익률: ROI에서 할인율(위험률)을 차감한 수익률
    // 양수이면 위험을 고려해도 수익성이 있음을 의미
    const riskAdjustedReturn = roi - (input.discountRate || 10);
    
    // 시장가치증가액(MVA): NPV와 동일 (기업가치 증가분)
    const marketValueAdded = npv;
    
    // 경제부가가치(EVA): 세후영업이익 - 자본비용
    // 양수이면 자본비용 이상의 가치 창출
    const economicValueAdded = cashFlows.reduce((sum, cf) => {
      const investedCapital = actualInitialInvestment;
      const wacc = input.discountRate || 10;
      const nopat = cf.ebit * (1 - (input.taxRate || 22) / 100);
      const capitalCharge = investedCapital * (wacc / 100);
      const eva = nopat - capitalCharge;
      return sum + eva;
    }, 0);
    
    // NPV 상세 요약 계산
    const totalRevenue = cashFlows.reduce((sum, cf) => sum + cf.revenue, 0);
    const totalOperatingProfit = cashFlows.reduce((sum, cf) => sum + cf.ebit, 0);
    const totalNetIncome = cashFlows.reduce((sum, cf) => sum + cf.netIncome, 0);
    const totalCashFlow = cashFlows.reduce((sum, cf) => sum + cf.netCashFlow, 0);
    const totalPresentValue = cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0);
    
    // DSCR 상세 데이터 계산
    let dscrData: {
      year: number;
      revenue: number;
      operatingProfit: number;
      policyLoanInterest: number;
      policyLoanPrincipal: number;
      otherDebtInterest: number;
      otherDebtPrincipal: number;
      totalDebtService: number;
      dscr: number;
    }[] = [];
    
    try {
      const baseRevenue = Array.isArray(input.annualRevenue) ? input.annualRevenue[0] : input.annualRevenue;
      
      dscrData = calculateDetailedDSCR({
        initialInvestment: input.initialInvestment,
        annualRevenue: baseRevenue,
        operatingProfitRate: finalOperatingProfitRate,
        analysisYears: input.analysisYears || 10,
        policyLoanAmount: input.policyFundAmount || 0,
        policyLoanRate: input.interestRate || 2.5,
        otherDebtAmount: 0, // 기타채무는 향후 확장 가능
        otherDebtRate: 5.0
      }, {
        revenueGrowthRate: revenueGrowthRate,
        costInflationRate: costInflationRate
      });
      
      console.log('🔍 DSCR 상세 데이터 계산 완료:', dscrData.length, '년간');
    } catch (error) {
      console.error('DSCR 상세 데이터 계산 오류:', error);
      dscrData = [];
    }
    
    return {
      npv,
      irr,
      paybackPeriod,
      breakEvenPoint,
      dscr,
      roi,
      profitabilityIndex,
      cashFlows,
      averageROI,
      cumulativeROI,
      riskAdjustedReturn,
      marketValueAdded,
      economicValueAdded,
      npvDetails: {
        npv: npv,
        details,
        summary: {
          totalRevenue,
          totalOperatingProfit,
          totalNetIncome,
          totalCashFlow,
          totalPresentValue,
          initialInvestment: actualInitialInvestment,
          netPresentValue: npv
        }
      },
      dscrData
    };
    
  } catch (error) {
    console.error('투자분석 전체 오류:', error);
    
    // 오류 발생 시 기본 결과 반환
    return {
      npv: 0,
      irr: 0,
      paybackPeriod: -1,
      breakEvenPoint: -1,
      dscr: [],
      roi: 0,
      profitabilityIndex: 0,
      cashFlows: [],
      averageROI: 0,
      cumulativeROI: 0,
      riskAdjustedReturn: 0,
      marketValueAdded: 0,
      economicValueAdded: 0,
      npvDetails: {
        npv: 0,
        details: [],
        summary: {
          totalRevenue: 0,
          totalOperatingProfit: 0,
          totalNetIncome: 0,
          totalCashFlow: 0,
          totalPresentValue: 0,
          initialInvestment: input.initialInvestment - (input.policyFundAmount || 0),
          netPresentValue: 0
        }
      },
      dscrData: []
    };
  }
}

// 시나리오 분석
export interface ScenarioAnalysis {
  conservative: InvestmentResult;
  base: InvestmentResult;
  optimistic: InvestmentResult;
}

export function performScenarioAnalysis(baseInput: InvestmentInput): ScenarioAnalysis {
  // 보수적 시나리오: 매출 20% 감소, 영업이익률 20% 하락
  const conservativeInput: InvestmentInput = {
    ...baseInput,
    annualRevenue: baseInput.annualRevenue.map(r => r * 0.8),
    operatingProfitRate: Math.max(-50, baseInput.operatingProfitRate * 0.8), // 영업이익률 20% 감소
    operatingCostRate: baseInput.operatingCostRate ? baseInput.operatingCostRate * 1.1 : undefined // 호환성
  };
  
  // 기본 시나리오
  const base = performInvestmentAnalysis(baseInput);
  
  // 낙관적 시나리오: 매출 20% 증가, 영업이익률 25% 상승
  const optimisticInput: InvestmentInput = {
    ...baseInput,
    annualRevenue: baseInput.annualRevenue.map(r => r * 1.2),
    operatingProfitRate: Math.min(100, baseInput.operatingProfitRate * 1.25), // 영업이익률 25% 증가
    operatingCostRate: baseInput.operatingCostRate ? baseInput.operatingCostRate * 0.95 : undefined // 호환성
  };
  
  return {
    conservative: performInvestmentAnalysis(conservativeInput),
    base,
    optimistic: performInvestmentAnalysis(optimisticInput)
  };
}

// 민감도 분석
export interface SensitivityAnalysis {
  parameter: string;
  baseValue: number;
  variations: {
    change: number; // 변화율 (%)
    npv: number;
    irr: number;
  }[];
}

// 민감도 분석 개선 (영업이익률 기반)
export function performSensitivityAnalysis(baseInput: InvestmentInput): SensitivityAnalysis[] {
  const results: SensitivityAnalysis[] = [];
  const variations = [-15, -10, -5, 0, 5, 10, 15]; // 변화율
  
  // 매출 민감도
  const revenueAnalysis: SensitivityAnalysis = {
    parameter: '매출액',
    baseValue: baseInput.annualRevenue[0],
    variations: []
  };
  
  variations.forEach(change => {
    const modifiedInput = {
      ...baseInput,
      annualRevenue: baseInput.annualRevenue.map(r => r * (1 + change / 100))
    };
    const result = performInvestmentAnalysis(modifiedInput);
    revenueAnalysis.variations.push({
      change,
      npv: result.npv,
      irr: result.irr
    });
  });
  
  results.push(revenueAnalysis);
  
  // 영업이익률 민감도 (새로 추가)
  const profitRateAnalysis: SensitivityAnalysis = {
    parameter: '영업이익률',
    baseValue: baseInput.operatingProfitRate,
    variations: []
  };
  
  variations.forEach(change => {
    const modifiedInput = {
      ...baseInput,
      operatingProfitRate: Math.max(-100, Math.min(200, baseInput.operatingProfitRate * (1 + change / 100)))
    };
    const result = performInvestmentAnalysis(modifiedInput);
    profitRateAnalysis.variations.push({
      change,
      npv: result.npv,
      irr: result.irr
    });
  });
  
  results.push(profitRateAnalysis);
  
  // 할인율 민감도
  const discountAnalysis: SensitivityAnalysis = {
    parameter: '할인율',
    baseValue: baseInput.discountRate,
    variations: []
  };
  
  variations.forEach(change => {
    const modifiedInput = {
      ...baseInput,
      discountRate: Math.max(1, Math.min(25, baseInput.discountRate * (1 + change / 100)))
    };
    const result = performInvestmentAnalysis(modifiedInput);
    discountAnalysis.variations.push({
      change,
      npv: result.npv,
      irr: result.irr
    });
  });
  
  results.push(discountAnalysis);
  
  // 매출성장률 민감도 (새로 추가)
  const growthRateAnalysis: SensitivityAnalysis = {
    parameter: '매출성장률',
    baseValue: baseInput.revenueGrowthRate,
    variations: []
  };
  
  variations.forEach(change => {
    const modifiedInput = {
      ...baseInput,
      revenueGrowthRate: Math.max(-50, Math.min(300, baseInput.revenueGrowthRate * (1 + change / 100)))
    };
    const result = performInvestmentAnalysis(modifiedInput);
    growthRateAnalysis.variations.push({
      change,
      npv: result.npv,
      irr: result.irr
    });
  });
  
  results.push(growthRateAnalysis);
  
  return results;
}

// 시나리오 자동계산 엔진
export function applyScenarioAdjustment(
  baseValue: number,
  scenarioType: 'pessimistic' | 'neutral' | 'optimistic',
  customAdjustmentRate?: number
): number {
  let adjustmentRate = 0;
  
  // 사용자 지정 조정율이 있으면 우선 사용
  if (customAdjustmentRate !== undefined && customAdjustmentRate !== 0) {
    adjustmentRate = customAdjustmentRate / 100;
  } else {
    // 기본 시나리오별 조정율
    switch (scenarioType) {
      case 'pessimistic':
        adjustmentRate = -0.20; // -20%
        break;
      case 'neutral':
        adjustmentRate = 0; // 0%
        break;
      case 'optimistic':
        adjustmentRate = 0.25; // +25%
        break;
    }
  }
  
  return baseValue * (1 + adjustmentRate);
}

// 시나리오별 상세 조정 함수
export function calculateScenarioAdjustedCashFlow(
  baseCashFlow: CashFlow,
  scenarioType: 'pessimistic' | 'neutral' | 'optimistic',
  adjustmentRate: number = 0
): CashFlow {
  const revenueAdjustment = applyScenarioAdjustment(
    baseCashFlow.revenue, 
    scenarioType, 
    adjustmentRate
  );
  
  // 비관적 시나리오에서는 비용이 더 높아지고, 낙관적에서는 비용이 낮아짐
  const costAdjustmentMultiplier = scenarioType === 'pessimistic' ? 1.1 : 
                                   scenarioType === 'optimistic' ? 0.9 : 1.0;
  
  const adjustedOperatingCost = baseCashFlow.operatingCost * costAdjustmentMultiplier;
  const adjustedEbit = revenueAdjustment - adjustedOperatingCost - baseCashFlow.depreciation;
  const adjustedTax = Math.max(0, adjustedEbit * (baseCashFlow.tax / baseCashFlow.ebit || 0));
  const adjustedNetIncome = adjustedEbit - adjustedTax;
  
  // 자유현금흐름 재계산
  const adjustedFcf = calculateFreeCashFlow(
    adjustedNetIncome,
    baseCashFlow.depreciation,
    0 // 운전자본 변화는 기본값 유지
  );
  
  const adjustedNetCashFlow = adjustedFcf - baseCashFlow.loanPrincipal - baseCashFlow.loanInterest;
  
  return {
    ...baseCashFlow,
    revenue: revenueAdjustment,
    operatingCost: adjustedOperatingCost,
    ebit: adjustedEbit,
    tax: adjustedTax,
    netIncome: adjustedNetIncome,
    fcf: adjustedFcf,
    netCashFlow: adjustedNetCashFlow,
    discountedFCF: adjustedFcf / Math.pow(1 + baseCashFlow.presentValue / baseCashFlow.netCashFlow, baseCashFlow.year),
    operatingProfitRate: revenueAdjustment > 0 ? (adjustedEbit / revenueAdjustment) * 100 : 0,
  };
}

// 시나리오 분석 결과 인터페이스
export interface ScenarioAnalysisResult {
  pessimistic: InvestmentResult;
  neutral: InvestmentResult;
  optimistic: InvestmentResult;
  selectedScenario: InvestmentResult;
  scenarioComparison: {
    npvRange: { min: number; max: number; selected: number };
    irrRange: { min: number; max: number; selected: number };
    discountedPaybackRange: { min: number; max: number; selected: number };
  };
}
