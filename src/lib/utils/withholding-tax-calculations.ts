import {
  WithholdingTaxInput,
  WithholdingTaxResult,
  WithholdingTaxCalculationOptions,
  SimplifiedTaxTableEntry,
  CalculationBreakdown
} from '@/types/tax-calculator.types';
import {
  WITHHOLDING_TAX_2024,
  WITHHOLDING_TAX_LIMITS_2024
} from '@/constants/tax-rates-2024';

/**
 * 원천징수세 계산 엔진
 * 2024년 세법 기준으로 다양한 소득의 원천징수세를 계산합니다.
 */
export class WithholdingTaxCalculator {
  private input: WithholdingTaxInput;
  private options: WithholdingTaxCalculationOptions;

  constructor(input: WithholdingTaxInput, options: WithholdingTaxCalculationOptions = {}) {
    this.input = input;
    this.options = options;
  }

  /**
   * 원천징수세 계산 메인 함수
   */
  calculate(): WithholdingTaxResult {
    try {
      // 1. 입력값 유효성 검사
      this.validateInput();
      
      // 2. 소득 유형별 원천징수세 계산
      let result: WithholdingTaxResult;
      
      switch (this.input.incomeType) {
        case 'earned':
          result = this.calculateEarnedIncomeWithholding();
          break;
        case 'business':
          result = this.calculateBusinessIncomeWithholding();
          break;
        case 'other':
          result = this.calculateOtherIncomeWithholding();
          break;
        case 'interest':
          result = this.calculateInterestIncomeWithholding();
          break;
        case 'dividend':
          result = this.calculateDividendIncomeWithholding();
          break;
        default:
          throw new Error('지원하지 않는 소득 유형입니다.');
      }
      
      // 3. 추가 정보 설정
      result.recommendedActions = this.generateRecommendations(result);
      result.warnings = this.generateWarnings(result);
      
      return result;
    } catch (error) {
      throw new Error(`원천징수세 계산 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  /**
   * 근로소득 원천징수세 계산
   */
  private calculateEarnedIncomeWithholding(): WithholdingTaxResult {
    const { paymentAmount, dependents = 0, childrenUnder20 = 0 } = this.input;
    const { earnedIncome } = WITHHOLDING_TAX_2024;
    
    // 1. 간이세액표에서 세액 조회
    const taxFromTable = this.lookupSimplifiedTaxTable(paymentAmount, dependents + childrenUnder20);
    
    // 2. 부양가족공제 및 자녀공제 계산
    const dependentDeduction = dependents * earnedIncome.dependentDeduction;
    const childDeduction = childrenUnder20 * earnedIncome.childDeduction;
    const totalDeduction = dependentDeduction + childDeduction;
    
    // 3. 최종 원천징수세액 계산
    const incomeTax = Math.max(0, taxFromTable);
    const localIncomeTax = Math.floor(incomeTax * 0.1); // 지방소득세 10%
    const totalTax = incomeTax + localIncomeTax;
    const netAmount = paymentAmount - totalTax;
    
    // 4. 세율 계산
    const appliedRate = paymentAmount > 0 ? (totalTax / paymentAmount) : 0;
    
    return {
      paymentAmount,
      taxableAmount: paymentAmount,
      incomeTax,
      localIncomeTax,
      totalTax,
      netAmount,
      appliedRate,
      incomeTaxRate: paymentAmount > 0 ? (incomeTax / paymentAmount) : 0,
      localIncomeTaxRate: paymentAmount > 0 ? (localIncomeTax / paymentAmount) : 0,
      incomeType: '근로소득',
      dependentDeduction,
      childDeduction,
      breakdown: this.generateEarnedIncomeBreakdown(paymentAmount, incomeTax, localIncomeTax, totalDeduction),
      appliedRules: this.getEarnedIncomeRules(dependents, childrenUnder20),
      taxFilingRequired: false,
      yearEndSettlementEligible: true,
      recommendedActions: [],
      warnings: [],
      filingDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      paymentDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      receiptRequired: WITHHOLDING_TAX_2024.common.receiptRequired
    };
  }

  /**
   * 사업소득 원천징수세 계산
   */
  private calculateBusinessIncomeWithholding(): WithholdingTaxResult {
    const { paymentAmount } = this.input;
    const { businessIncome } = WITHHOLDING_TAX_2024;
    
    // 1. 사업소득 원천징수세 계산 (3.3%)
    const incomeTax = Math.floor(paymentAmount * businessIncome.incomeTaxRate);
    const localIncomeTax = Math.floor(paymentAmount * businessIncome.localIncomeTaxRate);
    const totalTax = incomeTax + localIncomeTax;
    const netAmount = paymentAmount - totalTax;
    
    return {
      paymentAmount,
      taxableAmount: paymentAmount,
      incomeTax,
      localIncomeTax,
      totalTax,
      netAmount,
      appliedRate: businessIncome.totalRate,
      incomeTaxRate: businessIncome.incomeTaxRate,
      localIncomeTaxRate: businessIncome.localIncomeTaxRate,
      incomeType: '사업소득',
      breakdown: this.generateBusinessIncomeBreakdown(paymentAmount, incomeTax, localIncomeTax),
      appliedRules: [
        {
          rule: '사업소득 원천징수',
          description: '소득세 3% + 지방소득세 0.3% = 3.3% 원천징수',
          amount: totalTax
        }
      ],
      taxFilingRequired: true,
      yearEndSettlementEligible: false,
      recommendedActions: [],
      warnings: [],
      filingDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      paymentDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      receiptRequired: WITHHOLDING_TAX_2024.common.receiptRequired
    };
  }

  /**
   * 기타소득 원천징수세 계산
   */
  private calculateOtherIncomeWithholding(): WithholdingTaxResult {
    const { paymentAmount, hasBasicDeduction = true } = this.input;
    const { otherIncome } = WITHHOLDING_TAX_2024;
    
    // 1. 기본공제 적용
    const deductionAmount = hasBasicDeduction ? otherIncome.basicDeduction : 0;
    const taxableAmount = Math.max(0, paymentAmount - deductionAmount);
    
    // 2. 기타소득 원천징수세 계산 (22%)
    const incomeTax = Math.floor(taxableAmount * otherIncome.incomeTaxRate);
    const localIncomeTax = Math.floor(taxableAmount * otherIncome.localIncomeTaxRate);
    const totalTax = incomeTax + localIncomeTax;
    const netAmount = paymentAmount - totalTax;
    
    return {
      paymentAmount,
      taxableAmount,
      incomeTax,
      localIncomeTax,
      totalTax,
      netAmount,
      appliedRate: taxableAmount > 0 ? (totalTax / taxableAmount) : 0,
      incomeTaxRate: otherIncome.incomeTaxRate,
      localIncomeTaxRate: otherIncome.localIncomeTaxRate,
      incomeType: '기타소득',
      deductionAmount,
      breakdown: this.generateOtherIncomeBreakdown(paymentAmount, deductionAmount, taxableAmount, incomeTax, localIncomeTax),
      appliedRules: [
        {
          rule: '기타소득 원천징수',
          description: '소득세 20% + 지방소득세 2% = 22% 원천징수',
          amount: totalTax
        },
        {
          rule: '기본공제',
          description: '건당 30만원 기본공제 적용',
          amount: deductionAmount
        }
      ],
      taxFilingRequired: taxableAmount > 3000000, // 연간 300만원 초과시
      yearEndSettlementEligible: false,
      recommendedActions: [],
      warnings: [],
      filingDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      paymentDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      receiptRequired: WITHHOLDING_TAX_2024.common.receiptRequired
    };
  }

  /**
   * 이자소득 원천징수세 계산
   */
  private calculateInterestIncomeWithholding(): WithholdingTaxResult {
    const { paymentAmount, annualTotalInterest = 0, isLowIncomeAccount = false } = this.input;
    const { interestIncome } = WITHHOLDING_TAX_2024;
    
    // 1. 비과세 한도 확인
    const exemptionLimit = isLowIncomeAccount 
      ? interestIncome.lowIncomeExemptionLimit 
      : interestIncome.annualExemptionLimit;
    
    // 2. 과세대상 금액 계산
    const taxableAmount = Math.max(0, paymentAmount);
    
    // 3. 이자소득 원천징수세 계산 (15.4%)
    const incomeTax = Math.floor(taxableAmount * interestIncome.incomeTaxRate);
    const localIncomeTax = Math.floor(taxableAmount * interestIncome.localIncomeTaxRate);
    const totalTax = incomeTax + localIncomeTax;
    const netAmount = paymentAmount - totalTax;
    
    return {
      paymentAmount,
      taxableAmount,
      incomeTax,
      localIncomeTax,
      totalTax,
      netAmount,
      appliedRate: interestIncome.totalRate,
      incomeTaxRate: interestIncome.incomeTaxRate,
      localIncomeTaxRate: interestIncome.localIncomeTaxRate,
      incomeType: '이자소득',
      breakdown: this.generateInterestIncomeBreakdown(paymentAmount, incomeTax, localIncomeTax),
      appliedRules: [
        {
          rule: '이자소득 원천징수',
          description: '소득세 14% + 지방소득세 1.4% = 15.4% 원천징수',
          amount: totalTax
        }
      ],
      taxFilingRequired: annualTotalInterest > 20000000, // 금융소득종합과세 기준
      yearEndSettlementEligible: false,
      recommendedActions: [],
      warnings: [],
      filingDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      paymentDeadline: WITHHOLDING_TAX_2024.common.filingDeadline,
      receiptRequired: WITHHOLDING_TAX_2024.common.receiptRequired
    };
  }

  /**
   * 배당소득 원천징수세 계산
   */
  private calculateDividendIncomeWithholding(): WithholdingTaxResult {
    return this.calculateInterestIncomeWithholding(); // 이자소득과 동일한 세율
  }

  /**
   * 간이세액표 조회
   */
  private lookupSimplifiedTaxTable(monthlyPayment: number, totalDependents: number): number {
    const { monthlyTaxTable } = WITHHOLDING_TAX_2024.earnedIncome;
    
    // 부양가족 수에 따른 키 결정
    let dependentKey: keyof SimplifiedTaxTableEntry['rates'];
    if (totalDependents === 0) dependentKey = 'none';
    else if (totalDependents <= 11) dependentKey = totalDependents as keyof SimplifiedTaxTableEntry['rates'];
    else dependentKey = 11;
    
    // 월급여 구간에 따른 세액 조회
    for (const entry of monthlyTaxTable) {
      if (monthlyPayment >= entry.min && monthlyPayment < entry.max) {
        return entry.rates[dependentKey] || 0;
      }
    }
    
    // 최고 구간 적용
    const lastEntry = monthlyTaxTable[monthlyTaxTable.length - 1];
    return lastEntry.rates[dependentKey] || 0;
  }

  /**
   * 입력값 유효성 검사
   */
  private validateInput(): void {
    const { paymentAmount, dependents = 0, paymentCount = 1 } = this.input;
    const { inputLimits, validationMessages } = WITHHOLDING_TAX_LIMITS_2024;
    
    if (paymentAmount < 0) {
      throw new Error(validationMessages.invalidPaymentAmount);
    }
    
    if (paymentAmount > inputLimits.monthlyPayment) {
      throw new Error(validationMessages.monthlyPaymentExceeded);
    }
    
    if (dependents > inputLimits.dependents) {
      throw new Error(validationMessages.dependentsExceeded);
    }
    
    if (paymentCount > inputLimits.paymentCount) {
      throw new Error(validationMessages.paymentCountExceeded);
    }
  }

  /**
   * 근로소득 계산 과정 생성
   */
  private generateEarnedIncomeBreakdown(
    payment: number, 
    incomeTax: number, 
    localTax: number, 
    deduction: number
  ): CalculationBreakdown {
    return {
      steps: [
        { label: '월 급여액', amount: payment, description: '세전 급여' },
        { label: '부양가족공제', amount: -deduction, description: '부양가족 및 자녀공제' },
        { label: '소득세', amount: -incomeTax, description: '간이세액표 적용' },
        { label: '지방소득세', amount: -localTax, description: '소득세의 10%' },
        { label: '실수령액', amount: payment - incomeTax - localTax, description: '최종 수령금액' }
      ],
      summary: {
        totalIncome: payment,
        totalDeductions: deduction,
        taxableIncome: payment,
        taxBeforeCredits: incomeTax + localTax,
        taxCredits: 0,
        finalTax: incomeTax + localTax
      }
    };
  }

  /**
   * 사업소득 계산 과정 생성
   */
  private generateBusinessIncomeBreakdown(payment: number, incomeTax: number, localTax: number): CalculationBreakdown {
    return {
      steps: [
        { label: '사업소득', amount: payment, description: '용역비 등 사업소득' },
        { label: '소득세 (3%)', amount: -incomeTax, description: '사업소득 × 3%' },
        { label: '지방소득세 (0.3%)', amount: -localTax, description: '사업소득 × 0.3%' },
        { label: '실수령액', amount: payment - incomeTax - localTax, description: '최종 수령금액' }
      ],
      summary: {
        totalIncome: payment,
        totalDeductions: 0,
        taxableIncome: payment,
        taxBeforeCredits: incomeTax + localTax,
        taxCredits: 0,
        finalTax: incomeTax + localTax
      }
    };
  }

  /**
   * 기타소득 계산 과정 생성
   */
  private generateOtherIncomeBreakdown(
    payment: number, 
    deduction: number, 
    taxable: number, 
    incomeTax: number, 
    localTax: number
  ): CalculationBreakdown {
    return {
      steps: [
        { label: '기타소득', amount: payment, description: '강의료, 원고료 등' },
        { label: '기본공제', amount: -deduction, description: '건당 30만원 기본공제' },
        { label: '과세대상액', amount: taxable, description: '기타소득 - 기본공제' },
        { label: '소득세 (20%)', amount: -incomeTax, description: '과세대상액 × 20%' },
        { label: '지방소득세 (2%)', amount: -localTax, description: '과세대상액 × 2%' },
        { label: '실수령액', amount: payment - incomeTax - localTax, description: '최종 수령금액' }
      ],
      summary: {
        totalIncome: payment,
        totalDeductions: deduction,
        taxableIncome: taxable,
        taxBeforeCredits: incomeTax + localTax,
        taxCredits: 0,
        finalTax: incomeTax + localTax
      }
    };
  }

  /**
   * 이자소득 계산 과정 생성
   */
  private generateInterestIncomeBreakdown(payment: number, incomeTax: number, localTax: number): CalculationBreakdown {
    return {
      steps: [
        { label: '이자소득', amount: payment, description: '예금이자, 적금이자 등' },
        { label: '소득세 (14%)', amount: -incomeTax, description: '이자소득 × 14%' },
        { label: '지방소득세 (1.4%)', amount: -localTax, description: '이자소득 × 1.4%' },
        { label: '실수령액', amount: payment - incomeTax - localTax, description: '최종 수령금액' }
      ],
      summary: {
        totalIncome: payment,
        totalDeductions: 0,
        taxableIncome: payment,
        taxBeforeCredits: incomeTax + localTax,
        taxCredits: 0,
        finalTax: incomeTax + localTax
      }
    };
  }

  /**
   * 근로소득 관련 규칙 생성
   */
  private getEarnedIncomeRules(dependents: number, children: number): Array<{ rule: string; description: string; amount?: number }> {
    const rules = [];
    
    rules.push({
      rule: '간이세액표 적용',
      description: '2024년 근로소득 간이세액표 기준으로 계산'
    });
    
    if (dependents > 0) {
      rules.push({
        rule: '부양가족공제',
        description: `${dependents}명 × 월 15만원 = ${(dependents * 150000).toLocaleString()}원`,
        amount: dependents * 150000
      });
    }
    
    if (children > 0) {
      rules.push({
        rule: '20세 이하 자녀공제',
        description: `${children}명 × 월 15만원 = ${(children * 150000).toLocaleString()}원`,
        amount: children * 150000
      });
    }
    
    return rules;
  }

  /**
   * 권장사항 생성
   */
  private generateRecommendations(result: WithholdingTaxResult): string[] {
    const recommendations = [];
    const { incomeType } = result;
    const incomeTypeKey = this.input.incomeType;
    
    const recommendationKey = incomeTypeKey as keyof typeof WITHHOLDING_TAX_LIMITS_2024.recommendations;
    if (WITHHOLDING_TAX_LIMITS_2024.recommendations[recommendationKey]) {
      recommendations.push(WITHHOLDING_TAX_LIMITS_2024.recommendations[recommendationKey]);
    }
    
    // 세액이 높은 경우 추가 권장사항
    if (result.totalTax > 500000) {
      recommendations.push('세액이 높습니다. 세무 전문가와 상담을 받아보세요.');
    }
    
    // 연말정산 대상인 경우
    if (result.yearEndSettlementEligible) {
      recommendations.push('연말정산을 통해 최종 정산을 받으시기 바랍니다.');
    }
    
    return recommendations;
  }

  /**
   * 경고사항 생성
   */
  private generateWarnings(result: WithholdingTaxResult): string[] {
    const warnings = [];
    const { paymentAmount, totalTax } = result;
    
    // 고액 지급의 경우
    if (paymentAmount > 10000000) {
      warnings.push(WITHHOLDING_TAX_LIMITS_2024.warnings.highAmount);
    }
    
    // 원천징수세가 없는 경우
    if (totalTax === 0) {
      warnings.push(WITHHOLDING_TAX_LIMITS_2024.warnings.noTaxWithholding);
    }
    
    // 종합소득세 신고 대상인 경우
    if (result.taxFilingRequired) {
      warnings.push('종합소득세 신고 대상입니다. 신고를 누락하지 마세요.');
    }
    
    return warnings;
  }
}

/**
 * 원천징수세 계산 함수 (간편 사용)
 */
export function calculateWithholdingTax(
  input: WithholdingTaxInput,
  options: WithholdingTaxCalculationOptions = {}
): WithholdingTaxResult {
  const calculator = new WithholdingTaxCalculator(input, options);
  return calculator.calculate();
}

/**
 * 소득 유형별 세율 조회
 */
export function getWithholdingTaxRate(incomeType: WithholdingTaxInput['incomeType']): number {
  const rates = WITHHOLDING_TAX_2024;
  
  switch (incomeType) {
    case 'business':
      return rates.businessIncome.totalRate;
    case 'other':
      return rates.otherIncome.totalRate;
    case 'interest':
      return rates.interestIncome.totalRate;
    case 'dividend':
      return rates.dividendIncome.totalRate;
    case 'earned':
    default:
      return 0; // 간이세액표 적용으로 일정하지 않음
  }
}

/**
 * 통화 포맷팅 유틸리티
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원';
} 