import {
  EarnedIncomeTaxInput,
  EarnedIncomeTaxResult,
  ComprehensiveIncomeTaxInput,
  ComprehensiveIncomeTaxResult,
  CapitalGainsTaxInput,
  CapitalGainsTaxResult,
  TaxRate,
  CalculationBreakdown,
  AppliedRate,
  Deduction
} from '@/types/tax-calculator.types';

// Re-export types for use in components
export type {
  EarnedIncomeTaxInput,
  EarnedIncomeTaxResult,
  ComprehensiveIncomeTaxInput,
  ComprehensiveIncomeTaxResult,
  CapitalGainsTaxInput,
  CapitalGainsTaxResult,
  TaxRate,
  CalculationBreakdown,
  AppliedRate,
  Deduction
};
import {
  INCOME_TAX_RATES_2024,
  DEDUCTION_AMOUNTS_2024,
  EARNED_INCOME_DEDUCTION_2024,
  LOCAL_INCOME_TAX_RATE,
  DEDUCTION_LIMITS_2024,
  INCOME_BRACKETS_2024,
  COMPREHENSIVE_TAX_LIMITS_2024,
  CAPITAL_GAINS_TAX_2024
} from '@/constants/tax-rates-2024';

/**
 * 근로소득세 계산기
 */
export class EarnedIncomeTaxCalculator {
  static calculate(input: EarnedIncomeTaxInput): EarnedIncomeTaxResult {
    // 1단계: 근로소득공제 계산
    const earnedIncomeDeduction = this.calculateEarnedIncomeDeduction(input.annualSalary);
    
    // 2단계: 인적공제 계산  
    const personalDeduction = this.calculatePersonalDeduction(input);
    
    // 3단계: 특별공제/표준공제 계산
    const specialDeduction = this.calculateSpecialDeduction(input);
    const standardDeduction = DEDUCTION_AMOUNTS_2024.standard;
    const deduction = Math.max(specialDeduction, standardDeduction);
    
    // 4단계: 과세표준 계산
    const taxableIncome = Math.max(0, 
      input.annualSalary - earnedIncomeDeduction - personalDeduction - deduction
    );
    
    // 5단계: 산출세액 계산
    const calculatedTax = this.calculateProgressiveTax(taxableIncome, INCOME_TAX_RATES_2024);
    
    // 6단계: 세액공제 계산
    const taxCredit = this.calculateTaxCredit(input);
    
    // 7단계: 결정세액 계산
    const finalTax = Math.max(0, calculatedTax - taxCredit);
    const localIncomeTax = Math.floor(finalTax * LOCAL_INCOME_TAX_RATE);
    const totalTax = finalTax + localIncomeTax;
    
    // 8단계: 월 실수령액 계산
    const monthlyGross = input.annualSalary / 12;
    const monthlyTax = totalTax / 12;
    const monthlySalary = monthlyGross - monthlyTax - input.pensionContribution/12 - input.healthInsurance/12;
    
    return {
      taxableAmount: taxableIncome,
      calculatedTax: finalTax,
      localIncomeTax,
      totalTax,
      monthlySalary: Math.floor(monthlySalary),
      netAmount: input.annualSalary - totalTax,
      yearEndTaxSettlement: 0, // 별도 계산 필요
      monthlyWithholding: Math.floor(monthlyTax),
      breakdown: this.generateBreakdown(input, taxableIncome, calculatedTax, finalTax),
      appliedRates: this.getAppliedRates(taxableIncome),
      deductions: this.getDeductionList(earnedIncomeDeduction, personalDeduction, deduction)
    };
  }

  /**
   * 근로소득공제 계산
   */
  private static calculateEarnedIncomeDeduction(salary: number): number {
    const rates = EARNED_INCOME_DEDUCTION_2024.rates;
    
    for (const rate of rates) {
      if (salary >= rate.min && salary < rate.max) {
        if (rate.base !== undefined) {
          // 구간별 계산
          const excess = salary - rate.min;
          const deduction = rate.base + (excess * rate.rate);
          return Math.min(deduction, rate.maxDeduction);
        } else {
          // 단순 비율 계산
          const deduction = salary * rate.rate;
          return Math.min(deduction, rate.maxDeduction);
        }
      }
    }
    
    // 최고 구간
    return rates[rates.length - 1].maxDeduction;
  }

  /**
   * 인적공제 계산
   */
  private static calculatePersonalDeduction(input: EarnedIncomeTaxInput): number {
    let deduction = DEDUCTION_AMOUNTS_2024.personal.basic; // 본인공제
    deduction += input.dependents * DEDUCTION_AMOUNTS_2024.personal.dependent; // 부양가족공제
    
    if (input.disabledCount && Number(input.disabledCount) > 0) {
      deduction += DEDUCTION_AMOUNTS_2024.personal.disabled * Number(input.disabledCount); // 장애인공제
    }
    
    if (input.elderlyCount && Number(input.elderlyCount) > 0) {
      deduction += DEDUCTION_AMOUNTS_2024.personal.elderly * Number(input.elderlyCount); // 경로우대공제
    }
    
    return deduction;
  }

  /**
   * 특별공제 계산 (개선된 버전 - 2024년 기준)
   */
  private static calculateSpecialDeduction(input: EarnedIncomeTaxInput): number {
    let specialDeduction = 0;
    
    // 1. 의료비 공제 (총급여의 3% 초과분, 한도 없음)
    const medicalThreshold = TaxInputValidator.calculateMedicalExpenseThreshold(input.annualSalary);
    if (input.medicalExpenses > medicalThreshold) {
      const medicalDeduction = input.medicalExpenses - medicalThreshold;
      specialDeduction += medicalDeduction;
    }
    
    // 2. 교육비 공제 (검증된 금액만 적용)
    const educationValidation = TaxInputValidator.validateEducationExpenses(input.educationExpenses, input.dependents);
    specialDeduction += educationValidation.limitedAmount;
    
    // 3. 기부금 공제 (소득금액의 15% 한도)
    const donationLimit = TaxInputValidator.calculateDonationLimit(input.annualSalary);
    const actualDonationDeduction = Math.min(input.donationAmount, donationLimit);
    specialDeduction += actualDonationDeduction;
    
    // 4. 신용카드 등 사용금액 공제 (개선된 계산)
    const cardThreshold = input.annualSalary * DEDUCTION_LIMITS_2024.creditCardRate; // 25%
    if (input.creditCardUsage > cardThreshold) {
      const cardDeduction = (input.creditCardUsage - cardThreshold) * 0.15; // 15% 공제율
      const cardDeductionWithLimit = Math.min(cardDeduction, DEDUCTION_LIMITS_2024.creditCardLimit);
      specialDeduction += cardDeductionWithLimit;
    }
    
    return Math.floor(specialDeduction);
  }

  /**
   * 누진세 계산
   */
  private static calculateProgressiveTax(income: number, rates: TaxRate[]): number {
    let tax = 0;
    let remainingIncome = income;
    
    for (const rate of rates) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      tax += bracketIncome * rate.rate;
      remainingIncome -= bracketIncome;
    }
    
    return Math.floor(tax);
  }

  /**
   * 세액공제 계산 (개선된 버전 - 2024년 기준)
   */
  private static calculateTaxCredit(input: EarnedIncomeTaxInput): number {
    let taxCredit = 0;
    
    // 1. 연금저축 세액공제 (검증된 금액으로 계산)
    const pensionValidation = TaxInputValidator.validatePersonalPension(input.personalPensionContribution);
    if (pensionValidation.limitedAmount > 0) {
      const pensionTaxCredit = Math.min(
        pensionValidation.limitedAmount * 0.135, 
        DEDUCTION_LIMITS_2024.pensionSavingsTaxCredit
      ); // 13.5%, 한도 94.5만원
      taxCredit += pensionTaxCredit;
    }
    
    // 2. 주택청약종합저축 세액공제 (검증된 금액으로 계산)
    const housingValidation = TaxInputValidator.validateHousingFund(input.housingFund);
    if (housingValidation.limitedAmount > 0) {
      const housingTaxCredit = Math.min(
        housingValidation.limitedAmount * 0.4, 
        DEDUCTION_LIMITS_2024.housingFundTaxCredit
      ); // 40%, 한도 24만원
      taxCredit += housingTaxCredit;
    }
    
    return Math.floor(taxCredit);
  }

  /**
   * 계산 과정 상세 내역
   */
  private static generateBreakdown(
    input: EarnedIncomeTaxInput, 
    taxableIncome: number, 
    calculatedTax: number, 
    finalTax: number
  ): CalculationBreakdown {
    const earnedIncomeDeduction = this.calculateEarnedIncomeDeduction(input.annualSalary);
    const personalDeduction = this.calculatePersonalDeduction(input);
    const specialDeduction = this.calculateSpecialDeduction(input);
    const deduction = Math.max(specialDeduction, DEDUCTION_AMOUNTS_2024.standard);
    const taxCredit = this.calculateTaxCredit(input);

    return {
      steps: [
        { label: '연간 급여액', amount: input.annualSalary },
        { label: '근로소득공제', amount: -earnedIncomeDeduction },
        { label: '인적공제', amount: -personalDeduction },
        { label: '특별공제/표준공제', amount: -deduction },
        { label: '과세표준', amount: taxableIncome },
        { label: '산출세액', amount: calculatedTax },
        { label: '세액공제', amount: -taxCredit },
        { label: '결정세액', amount: finalTax },
        { label: '지방소득세', amount: Math.floor(finalTax * LOCAL_INCOME_TAX_RATE) }
      ],
      summary: {
        totalIncome: input.annualSalary,
        totalDeductions: earnedIncomeDeduction + personalDeduction + deduction,
        taxableIncome,
        taxBeforeCredits: calculatedTax,
        taxCredits: taxCredit,
        finalTax: finalTax + Math.floor(finalTax * LOCAL_INCOME_TAX_RATE)
      }
    };
  }

  /**
   * 적용된 세율 구간
   */
  private static getAppliedRates(taxableIncome: number): AppliedRate[] {
    const appliedRates: AppliedRate[] = [];
    let remainingIncome = taxableIncome;
    
    for (const rate of INCOME_TAX_RATES_2024) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      if (bracketIncome > 0) {
        appliedRates.push({
          range: `${rate.min.toLocaleString()}원 ~ ${rate.max === Infinity ? '∞' : rate.max.toLocaleString()}원`,
          rate: rate.rate,
          amount: Math.floor(bracketIncome * rate.rate)
        });
      }
      remainingIncome -= bracketIncome;
    }
    
    return appliedRates;
  }

  /**
   * 공제 항목 목록
   */
  private static getDeductionList(
    earnedIncomeDeduction: number, 
    personalDeduction: number, 
    specialDeduction: number
  ): Deduction[] {
    return [
      { type: 'earned', label: '근로소득공제', amount: earnedIncomeDeduction },
      { type: 'personal', label: '인적공제', amount: personalDeduction },
      { type: 'special', label: '특별공제/표준공제', amount: specialDeduction }
    ];
  }
}

/**
 * 양도소득세 계산기
 */
export class CapitalGainsTaxCalculator {
  static calculate(input: CapitalGainsTaxInput): CapitalGainsTaxResult {
    try {
      // 1단계: 보유기간 계산
      const holdingInfo = this.calculateHoldingPeriod(input.acquisitionDate, input.saleDate);
      
      // 2단계: 양도차익 계산
      const transferIncome = this.calculateTransferIncome(input);
      
      // 3단계: 비과세 여부 확인
      const exemptionInfo = this.checkTaxExemption(input, transferIncome, holdingInfo.years);
      
      if (exemptionInfo.isExempt) {
        return this.createExemptResult(input, transferIncome, holdingInfo, exemptionInfo);
      }
      
      // 4단계: 특별공제 계산
      const deductions = this.calculateSpecialDeductions(input, transferIncome, holdingInfo.years);
      
      // 5단계: 과세표준 계산
      const taxableGain = Math.max(0, transferIncome - deductions.totalSpecialDeductions);
      
      // 6단계: 세액 계산
      const taxInfo = this.calculateTax(input, taxableGain);
      
      // 7단계: 지방소득세 계산
      const localIncomeTax = Math.floor(taxInfo.totalTax * CAPITAL_GAINS_TAX_2024.localIncomeTaxRate);
      
      // 8단계: 최종 세액 계산
      const finalTaxAmount = taxInfo.totalTax + localIncomeTax;
      const additionalPayment = Math.max(0, finalTaxAmount - input.previousYearTaxPaid);
      const refundAmount = Math.max(0, input.previousYearTaxPaid - finalTaxAmount);
      
      return {
        taxableAmount: taxableGain,
        calculatedTax: taxInfo.basicTax,
        localIncomeTax,
        totalTax: finalTaxAmount,
        
        // 양도소득세 전용 필드
        transferIncome,
        basicDeduction: deductions.basicDeduction,
        longTermDeduction: deductions.longTermDeduction,
        oneHouseDeduction: deductions.oneHouseDeduction,
        totalSpecialDeductions: deductions.totalSpecialDeductions,
        taxableGain,
        basicTax: taxInfo.basicTax,
        heavyTax: taxInfo.heavyTax,
        previousTaxPaid: input.previousYearTaxPaid,
        additionalPayment,
        refundAmount,
        appliedTaxRate: taxInfo.appliedRate,
        effectiveRate: transferIncome > 0 ? (finalTaxAmount / transferIncome) * 100 : 0,
        holdingYears: holdingInfo.years,
        holdingMonths: holdingInfo.months,
        
        taxExemption: exemptionInfo,
        heavyTaxInfo: taxInfo.heavyTaxInfo,
        
        calculationDetails: {
          steps: this.generateCalculationSteps(input, transferIncome, deductions, taxableGain, taxInfo, finalTaxAmount),
          deductions: this.getDeductionDetails(deductions),
          taxRates: this.getTaxRateDetails(taxableGain, taxInfo.appliedRate)
        },
        
        breakdown: this.generateBreakdown(input, transferIncome, deductions, taxableGain, finalTaxAmount),
        appliedRates: this.getAppliedRates(taxableGain),
        deductions: this.getDeductionList(deductions)
      };
    } catch (error) {
      console.error('양도소득세 계산 오류:', error);
      throw new Error('양도소득세 계산 중 오류가 발생했습니다.');
    }
  }

  /**
   * 보유기간 계산
   */
  private static calculateHoldingPeriod(acquisitionDate: string, saleDate: string): {
    years: number;
    months: number;
    days: number;
  } {
    const acquisition = new Date(acquisitionDate);
    const sale = new Date(saleDate);
    
    const diffTime = sale.getTime() - acquisition.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 보유기간 계산 (연단위)
    let years = 0;
    let months = 0;
    
    const yearDiff = sale.getFullYear() - acquisition.getFullYear();
    const monthDiff = sale.getMonth() - acquisition.getMonth();
    const dayDiff = sale.getDate() - acquisition.getDate();
    
    months = yearDiff * 12 + monthDiff;
    if (dayDiff < 0) {
      months--;
    }
    
    years = Math.floor(months / 12);
    
    return {
      years,
      months,
      days: diffDays
    };
  }

  /**
   * 양도차익 계산
   */
  private static calculateTransferIncome(input: CapitalGainsTaxInput): number {
    const totalAcquisitionCost = input.acquisitionPrice + input.acquisitionCosts + input.improvementCosts;
    const netSalePrice = input.salePrice - input.transferCosts;
    
    return Math.max(0, netSalePrice - totalAcquisitionCost);
  }

  /**
   * 비과세 여부 확인
   */
  private static checkTaxExemption(
    input: CapitalGainsTaxInput, 
    transferIncome: number, 
    holdingYears: number
  ): {
    isExempt: boolean;
    exemptionType: string;
    exemptionAmount: number;
    reason: string;
  } {
    // 1세대1주택 비과세 검토
    if (input.isOneHouseOneFamily && 
        input.propertyType === 'apartment' && 
        input.salePrice <= CAPITAL_GAINS_TAX_2024.exemptions.oneHouseExemption &&
        input.residenceYears >= CAPITAL_GAINS_TAX_2024.exemptions.residenceRequirement.minYears) {
      
      return {
        isExempt: true,
        exemptionType: '1세대1주택',
        exemptionAmount: transferIncome,
        reason: `1세대1주택 비과세 (거주요건 ${input.residenceYears}년, 양도가액 ${formatCurrency(input.salePrice)})`
      };
    }

    // 외국인 비과세
    if (input.isForeignerExemption) {
      return {
        isExempt: true,
        exemptionType: '외국인비과세',
        exemptionAmount: transferIncome,
        reason: '외국인 비과세 해당'
      };
    }

    return {
      isExempt: false,
      exemptionType: '',
      exemptionAmount: 0,
      reason: ''
    };
  }

  /**
   * 특별공제 계산
   */
  private static calculateSpecialDeductions(
    input: CapitalGainsTaxInput, 
    transferIncome: number, 
    holdingYears: number
  ): {
    basicDeduction: number;
    longTermDeduction: number;
    oneHouseDeduction: number;
    totalSpecialDeductions: number;
  } {
    // 1. 기본공제
    const basicDeduction = CAPITAL_GAINS_TAX_2024.basicDeduction;
    
    // 2. 장기보유특별공제
    const longTermDeduction = this.calculateLongTermDeduction(input, transferIncome, holdingYears);
    
    // 3. 1세대1주택 특별공제
    const oneHouseDeduction = this.calculateOneHouseDeduction(input, transferIncome, holdingYears);
    
    const totalSpecialDeductions = basicDeduction + longTermDeduction + oneHouseDeduction;
    
    return {
      basicDeduction,
      longTermDeduction,
      oneHouseDeduction,
      totalSpecialDeductions
    };
  }

  /**
   * 장기보유특별공제 계산
   */
  private static calculateLongTermDeduction(
    input: CapitalGainsTaxInput, 
    transferIncome: number, 
    holdingYears: number
  ): number {
    if (holdingYears < 3) return 0;
    
    const isResidential = input.propertyType === 'apartment' || input.propertyType === 'house';
    const deductionRates = isResidential 
      ? CAPITAL_GAINS_TAX_2024.longTermDeduction.residential
      : CAPITAL_GAINS_TAX_2024.longTermDeduction.nonResidential;
    
    // 보유기간에 따른 공제율 결정
    let deductionRate = 0;
    const years = Math.min(holdingYears, 10); // 최대 10년
    
    for (let year = years; year >= 3; year--) {
      if (deductionRates[year as keyof typeof deductionRates]) {
        deductionRate = deductionRates[year as keyof typeof deductionRates] as number;
        break;
      }
    }
    
    return Math.floor(transferIncome * deductionRate);
  }

  /**
   * 1세대1주택 특별공제 계산
   */
  private static calculateOneHouseDeduction(
    input: CapitalGainsTaxInput, 
    transferIncome: number, 
    holdingYears: number
  ): number {
    if (!input.isOneHouseOneFamily || holdingYears < 15) return 0;
    
    const deductionRates = CAPITAL_GAINS_TAX_2024.oneHouseDeduction.deductionByAge;
    let deductionRate = 0;
    
    if (holdingYears >= 30) deductionRate = deductionRates[30];
    else if (holdingYears >= 25) deductionRate = deductionRates[25];
    else if (holdingYears >= 20) deductionRate = deductionRates[20];
    else if (holdingYears >= 15) deductionRate = deductionRates[15];
    
    const calculatedDeduction = Math.floor(transferIncome * deductionRate);
    return Math.min(calculatedDeduction, CAPITAL_GAINS_TAX_2024.oneHouseDeduction.maxDeduction);
  }

  /**
   * 세액 계산
   */
  private static calculateTax(input: CapitalGainsTaxInput, taxableGain: number): {
    basicTax: number;
    heavyTax: number;
    totalTax: number;
    appliedRate: number;
    heavyTaxInfo: {
      isApplied: boolean;
      reason: string;
      additionalRate: number;
    };
  } {
    if (taxableGain <= 0) {
      return {
        basicTax: 0,
        heavyTax: 0,
        totalTax: 0,
        appliedRate: 0,
        heavyTaxInfo: { isApplied: false, reason: '', additionalRate: 0 }
      };
    }
    
    // 🔥 보유기간 계산
    const holdingInfo = this.calculateHoldingPeriod(input.acquisitionDate, input.saleDate);
    
    // 🔥 단기양도 세율 적용 체크 (1년 미만: 70%, 2년 미만: 60%)
    if (holdingInfo.years < 1) {
      // 1년 미만 보유: 70% 일괄 적용
      const shortTermTax = Math.floor(taxableGain * CAPITAL_GAINS_TAX_2024.taxRates.shortTermHolding.under1Year);
      return {
        basicTax: shortTermTax,
        heavyTax: 0,
        totalTax: shortTermTax,
        appliedRate: CAPITAL_GAINS_TAX_2024.taxRates.shortTermHolding.under1Year,
        heavyTaxInfo: { 
          isApplied: true, 
          reason: `단기양도 중과세 (보유기간 ${holdingInfo.years}년 ${holdingInfo.months}개월)`,
          additionalRate: 0 
        }
      };
    } else if (holdingInfo.years < 2) {
      // 2년 미만 보유: 60% 일괄 적용
      const shortTermTax = Math.floor(taxableGain * CAPITAL_GAINS_TAX_2024.taxRates.shortTermHolding.under2Years);
      return {
        basicTax: shortTermTax,
        heavyTax: 0,
        totalTax: shortTermTax,
        appliedRate: CAPITAL_GAINS_TAX_2024.taxRates.shortTermHolding.under2Years,
        heavyTaxInfo: { 
          isApplied: true, 
          reason: `단기양도 중과세 (보유기간 ${holdingInfo.years}년 ${holdingInfo.months}개월)`,
          additionalRate: 0 
        }
      };
    }
    
    // 비거주자 특별세율
    if (input.isNonResident) {
      const nonResidentTax = Math.floor(taxableGain * 0.30); // 30% 일괄 적용
      return {
        basicTax: nonResidentTax,
        heavyTax: 0,
        totalTax: nonResidentTax,
        appliedRate: 0.30,
        heavyTaxInfo: { isApplied: false, reason: '비거주자 일괄세율 30% 적용', additionalRate: 0 }
      };
    }
    
    // 🔥 2년 이상 보유: 일반 누진세율 적용
    const basicTax = this.calculateProgressiveTax(taxableGain, CAPITAL_GAINS_TAX_2024.taxRates.basic);
    let appliedRate = this.getEffectiveRate(taxableGain, CAPITAL_GAINS_TAX_2024.taxRates.basic);
    
    // 중과세 여부 확인
    const heavyTaxInfo = this.checkHeavyTax(input);
    let heavyTax = 0;
    
    if (heavyTaxInfo.isApplied) {
      heavyTax = Math.floor(taxableGain * heavyTaxInfo.additionalRate);
      appliedRate += heavyTaxInfo.additionalRate;
    }
    
    const totalTax = basicTax + heavyTax;
    
    return {
      basicTax,
      heavyTax,
      totalTax,
      appliedRate,
      heavyTaxInfo
    };
  }

  /**
   * 중과세 여부 확인
   */
  private static checkHeavyTax(input: CapitalGainsTaxInput): {
    isApplied: boolean;
    reason: string;
    additionalRate: number;
  } {
    // 다주택자 중과세
    if (input.isMultipleHouses || input.totalHousesOwned > 1) {
      return {
        isApplied: true,
        reason: '다주택자 중과세',
        additionalRate: CAPITAL_GAINS_TAX_2024.taxRates.multipleHousesRate
      };
    }
    
    // 조정대상지역 중과세
    if (input.hasSchoolDistrict) {
      return {
        isApplied: true,
        reason: '조정대상지역 중과세',
        additionalRate: CAPITAL_GAINS_TAX_2024.taxRates.adjustmentAreaRate
      };
    }
    
    // 재개발지역 중과세
    if (input.isReconstructionArea) {
      return {
        isApplied: true,
        reason: '재개발지역 중과세',
        additionalRate: CAPITAL_GAINS_TAX_2024.taxRates.reconstructionRate
      };
    }
    
    return {
      isApplied: false,
      reason: '',
      additionalRate: 0
    };
  }

  /**
   * 누진세 계산
   */
  private static calculateProgressiveTax(income: number, rates: TaxRate[]): number {
    let tax = 0;
    let remainingIncome = income;
    
    for (const rate of rates) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      tax += bracketIncome * rate.rate;
      remainingIncome -= bracketIncome;
    }
    
    return Math.floor(tax);
  }

  /**
   * 실효세율 계산
   */
  private static getEffectiveRate(income: number, rates: TaxRate[]): number {
    if (income <= 0) return 0;
    
    const tax = this.calculateProgressiveTax(income, rates);
    return tax / income;
  }

  /**
   * 비과세 결과 생성
   */
  private static createExemptResult(
    input: CapitalGainsTaxInput, 
    transferIncome: number, 
    holdingInfo: { years: number; months: number }, 
    exemptionInfo: any
  ): CapitalGainsTaxResult {
    return {
      taxableAmount: 0,
      calculatedTax: 0,
      localIncomeTax: 0,
      totalTax: 0,
      
      transferIncome,
      basicDeduction: 0,
      longTermDeduction: 0,
      oneHouseDeduction: 0,
      totalSpecialDeductions: 0,
      taxableGain: 0,
      basicTax: 0,
      heavyTax: 0,
      previousTaxPaid: input.previousYearTaxPaid,
      additionalPayment: 0,
      refundAmount: input.previousYearTaxPaid,
      appliedTaxRate: 0,
      effectiveRate: 0,
      holdingYears: holdingInfo.years,
      holdingMonths: holdingInfo.months,
      
      taxExemption: exemptionInfo,
      heavyTaxInfo: { isApplied: false, reason: '', additionalRate: 0 },
      
      calculationDetails: {
        steps: [
          { label: '양도가액', amount: input.salePrice, description: '매매계약서상 금액' },
          { label: '취득가액', amount: -input.acquisitionPrice, description: '원시취득가액' },
          { label: '양도차익', amount: transferIncome, description: '비과세 적용' }
        ],
        deductions: [],
        taxRates: []
      },
      
      breakdown: {
        steps: [
          { label: '양도차익', amount: transferIncome },
          { label: '비과세 적용', amount: -transferIncome },
          { label: '납부할 세액', amount: 0 }
        ],
        summary: {
          totalIncome: transferIncome,
          totalDeductions: transferIncome,
          taxableIncome: 0,
          taxBeforeCredits: 0,
          taxCredits: 0,
          finalTax: 0
        }
      },
      appliedRates: [],
      deductions: []
    };
  }

  /**
   * 계산 과정 단계별 생성
   */
  private static generateCalculationSteps(
    input: CapitalGainsTaxInput,
    transferIncome: number,
    deductions: any,
    taxableGain: number,
    taxInfo: any,
    finalTax: number
  ): Array<{ label: string; amount: number; description?: string; formula?: string }> {
    return [
      { 
        label: '양도가액', 
        amount: input.salePrice, 
        description: '매매계약서상 양도가액',
        formula: '매매계약 금액'
      },
      { 
        label: '취득가액', 
        amount: input.acquisitionPrice, 
        description: '원시취득가액'
      },
      { 
        label: '취득비용', 
        amount: input.acquisitionCosts, 
        description: '등록세, 중개수수료 등'
      },
      { 
        label: '개량비', 
        amount: input.improvementCosts, 
        description: '리모델링 등 개량비'
      },
      { 
        label: '양도비용', 
        amount: input.transferCosts, 
        description: '중개수수료, 인지세 등'
      },
      { 
        label: '양도차익', 
        amount: transferIncome, 
        description: '양도가액 - 취득가액 - 제비용',
        formula: `${formatCurrency(input.salePrice)} - ${formatCurrency(input.acquisitionPrice + input.acquisitionCosts + input.improvementCosts + input.transferCosts)}`
      },
      { 
        label: '기본공제', 
        amount: -deductions.basicDeduction, 
        description: '250만원 기본공제'
      },
      { 
        label: '장기보유특별공제', 
        amount: -deductions.longTermDeduction, 
        description: `보유기간 ${input.holdingPeriodYears || 0}년`
      },
      { 
        label: '과세표준', 
        amount: taxableGain, 
        description: '양도차익 - 특별공제'
      },
      { 
        label: '기본세액', 
        amount: taxInfo.basicTax, 
        description: '누진세율 적용'
      },
      { 
        label: '중과세액', 
        amount: taxInfo.heavyTax, 
        description: taxInfo.heavyTaxInfo.reason || '해당없음'
      },
      { 
        label: '지방소득세', 
        amount: Math.floor(taxInfo.totalTax * 0.1), 
        description: '양도소득세의 10%'
      },
      { 
        label: '총 납부세액', 
        amount: finalTax, 
        description: '양도소득세 + 지방소득세'
      }
    ];
  }

  /**
   * 공제 상세 내역
   */
  private static getDeductionDetails(deductions: any): Array<{
    type: string;
    label: string;
    amount: number;
    rate?: number;
  }> {
    return [
      { type: 'basic', label: '기본공제', amount: deductions.basicDeduction },
      { type: 'longTerm', label: '장기보유특별공제', amount: deductions.longTermDeduction },
      { type: 'oneHouse', label: '1세대1주택 특별공제', amount: deductions.oneHouseDeduction }
    ].filter(item => item.amount > 0);
  }

  /**
   * 세율 구간 상세
   */
  private static getTaxRateDetails(taxableGain: number, appliedRate: number): Array<{
    bracket: string;
    rate: number;
    amount: number;
  }> {
    if (taxableGain <= 0) return [];
    
    const results = [];
    let remainingIncome = taxableGain;
    
    for (const rate of CAPITAL_GAINS_TAX_2024.taxRates.basic) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      if (bracketIncome > 0) {
        results.push({
          bracket: `${formatCurrency(rate.min)} ~ ${rate.max === Infinity ? '∞' : formatCurrency(rate.max)}`,
          rate: rate.rate,
          amount: Math.floor(bracketIncome * rate.rate)
        });
      }
      remainingIncome -= bracketIncome;
    }
    
    return results;
  }

  /**
   * 계산 과정 요약
   */
  private static generateBreakdown(
    input: CapitalGainsTaxInput,
    transferIncome: number,
    deductions: any,
    taxableGain: number,
    finalTax: number
  ): CalculationBreakdown {
    return {
      steps: [
        { label: '양도차익', amount: transferIncome },
        { label: '특별공제', amount: -deductions.totalSpecialDeductions },
        { label: '과세표준', amount: taxableGain },
        { label: '납부세액', amount: finalTax }
      ],
      summary: {
        totalIncome: transferIncome,
        totalDeductions: deductions.totalSpecialDeductions,
        taxableIncome: taxableGain,
        taxBeforeCredits: finalTax,
        taxCredits: 0,
        finalTax
      }
    };
  }

  /**
   * 적용된 세율 구간
   */
  private static getAppliedRates(taxableGain: number): AppliedRate[] {
    if (taxableGain <= 0) return [];
    
    const appliedRates: AppliedRate[] = [];
    let remainingIncome = taxableGain;
    
    for (const rate of CAPITAL_GAINS_TAX_2024.taxRates.basic) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      if (bracketIncome > 0) {
        appliedRates.push({
          range: `${formatCurrency(rate.min)} ~ ${rate.max === Infinity ? '∞' : formatCurrency(rate.max)}`,
          rate: rate.rate,
          amount: Math.floor(bracketIncome * rate.rate)
        });
      }
      remainingIncome -= bracketIncome;
    }
    
    return appliedRates;
  }

  /**
   * 공제 목록
   */
  private static getDeductionList(deductions: any): Deduction[] {
    return [
      { type: 'basic', label: '기본공제', amount: deductions.basicDeduction },
      { type: 'longTerm', label: '장기보유특별공제', amount: deductions.longTermDeduction },
      { type: 'oneHouse', label: '1세대1주택 특별공제', amount: deductions.oneHouseDeduction }
    ].filter(item => item.amount > 0);
  }
}

/**
 * 숫자 포맷팅 유틸리티
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR').format(amount);
};

/**
 * 입력값 검증 및 한도 적용 유틸리티
 */
export class TaxInputValidator {
  /**
   * 개인연금 한도 검증
   */
  static validatePersonalPension(amount: number): { isValid: boolean; limitedAmount: number; message?: string } {
    const limit = DEDUCTION_LIMITS_2024.personalPension;
    if (amount > limit) {
      return {
        isValid: false,
        limitedAmount: limit,
        message: `개인연금 납입한도는 연 ${formatCurrency(limit)}입니다.`
      };
    }
    return { isValid: true, limitedAmount: amount };
  }

  /**
   * 주택청약종합저축 한도 검증
   */
  static validateHousingFund(amount: number): { isValid: boolean; limitedAmount: number; message?: string } {
    const limit = DEDUCTION_LIMITS_2024.housingFund;
    if (amount > limit) {
      return {
        isValid: false,
        limitedAmount: limit,
        message: `주택청약종합저축 한도는 연 ${formatCurrency(limit)}입니다.`
      };
    }
    return { isValid: true, limitedAmount: amount };
  }

  /**
   * 신용카드 사용액 공제한도 계산
   */
  static calculateCreditCardDeductionLimit(annualSalary: number): number {
    const threshold = annualSalary * DEDUCTION_LIMITS_2024.creditCardRate;
    return Math.min(DEDUCTION_LIMITS_2024.creditCardLimit, annualSalary - threshold);
  }

  /**
   * 의료비 공제 한도 계산
   */
  static calculateMedicalExpenseThreshold(annualSalary: number): number {
    return annualSalary * DEDUCTION_LIMITS_2024.medicalExpenseRate;
  }

  /**
   * 교육비 공제 한도 검증
   */
  static validateEducationExpenses(amount: number, dependents: number): { isValid: boolean; limitedAmount: number; message?: string } {
    const limit = DEDUCTION_LIMITS_2024.educationSelf + (dependents * DEDUCTION_LIMITS_2024.educationChild);
    if (amount > limit) {
      return {
        isValid: false,
        limitedAmount: limit,
        message: `교육비 공제한도는 본인 무제한 + 자녀 1명당 ${formatCurrency(DEDUCTION_LIMITS_2024.educationChild)}입니다.`
      };
    }
    return { isValid: true, limitedAmount: amount };
  }

  /**
   * 기부금 공제 한도 계산 (간이계산)
   */
  static calculateDonationLimit(annualSalary: number): number {
    return annualSalary * DEDUCTION_LIMITS_2024.donationGeneral; // 15%
  }

  /**
   * 부양가족 수 검증
   */
  static validateDependents(count: number): { isValid: boolean; limitedCount: number; message?: string } {
    if (count > 10) {
      return {
        isValid: false,
        limitedCount: 10,
        message: '부양가족 수는 최대 10명까지 입력 가능합니다.'
      };
    }
    if (count < 0) {
      return {
        isValid: false,
        limitedCount: 0,
        message: '부양가족 수는 0명 이상이어야 합니다.'
      };
    }
    return { isValid: true, limitedCount: count };
  }

  /**
   * 연봉 검증
   */
  static validateAnnualSalary(amount: number): { isValid: boolean; limitedAmount: number; message?: string } {
    if (amount > 10000000000) { // 100억원
      return {
        isValid: false,
        limitedAmount: 10000000000,
        message: '연봉은 최대 100억원까지 입력 가능합니다.'
      };
    }
    if (amount < 0) {
      return {
        isValid: false,
        limitedAmount: 0,
        message: '연봉은 0원 이상이어야 합니다.'
      };
    }
    return { isValid: true, limitedAmount: amount };
  }
}

/**
 * 종합소득세 전용 입력값 검증 및 한도 적용 유틸리티
 */
export class ComprehensiveTaxInputValidator {
  /**
   * 금융소득 종합과세 여부 확인
   */
  static checkFinancialIncomeComprehensive(interestIncome: number, dividendIncome: number): {
    isComprehensive: boolean;
    totalFinancialIncome: number;
    message?: string;
  } {
    const totalFinancialIncome = interestIncome + dividendIncome;
    const threshold = COMPREHENSIVE_TAX_LIMITS_2024.financialIncomeThreshold;
    
    return {
      isComprehensive: totalFinancialIncome > threshold,
      totalFinancialIncome,
      message: totalFinancialIncome > threshold 
        ? `금융소득 ${formatCurrency(totalFinancialIncome)}로 종합과세 대상입니다 (기준: ${formatCurrency(threshold)})`
        : `금융소득 분리과세 대상입니다 (기준: ${formatCurrency(threshold)} 이하)`
    };
  }

  /**
   * 사업소득 필요경비율 계산
   */
  static calculateBusinessExpenseRate(businessType: string = 'general'): {
    rate: number;
    maxExpense: number;
    message: string;
  } {
    const rates = COMPREHENSIVE_TAX_LIMITS_2024.businessExpenseRates;
    const rate = rates[businessType as keyof typeof rates] || rates.general;
    
    return {
      rate,
      maxExpense: Infinity, // 사업소득은 실제 경비 적용 시 한도 없음
      message: `${businessType} 업종 기준 경비율 ${(rate * 100).toFixed(0)}% 적용`
    };
  }

  /**
   * 부동산임대소득 필요경비 검증
   */
  static validateRentalExpenses(
    rentalIncome: number,
    rentalExpenses: number,
    isRegistered: boolean = false
  ): { isValid: boolean; limitedAmount: number; message?: string } {
    const standardRate = COMPREHENSIVE_TAX_LIMITS_2024.rentalIncome.standardExpenseRate;
    const standardExpense = rentalIncome * standardRate;
    
    // 등록 임대사업자 혜택
    const benefitMessage = isRegistered 
      ? ' (등록임대사업자 30% 세액감면 혜택 적용 가능)'
      : ' (등록임대사업자 등록 시 30% 세액감면 혜택)';
    
    if (rentalExpenses > rentalIncome) {
      return {
        isValid: false,
        limitedAmount: rentalIncome,
        message: `임대소득 필요경비는 임대수입을 초과할 수 없습니다${benefitMessage}`
      };
    }
    
    return {
      isValid: true,
      limitedAmount: rentalExpenses,
      message: `기본 경비율 ${(standardRate * 100)}% (${formatCurrency(standardExpense)}) 또는 실제 경비 적용${benefitMessage}`
    };
  }

  /**
   * 연금소득공제 계산
   */
  static calculatePensionDeduction(pensionIncome: number): {
    deductionAmount: number;
    message: string;
  } {
    const brackets = COMPREHENSIVE_TAX_LIMITS_2024.pensionDeduction;
    let deduction = 0;
    let bracketInfo = '';
    
    if (pensionIncome <= brackets.firstBracket.max) {
      deduction = pensionIncome * brackets.firstBracket.rate;
      bracketInfo = `${(brackets.firstBracket.rate * 100)}% 공제`;
    } else if (pensionIncome <= brackets.secondBracket.max) {
      deduction = brackets.secondBracket.base + (pensionIncome - brackets.secondBracket.min) * brackets.secondBracket.rate;
      bracketInfo = `${formatCurrency(brackets.secondBracket.base)} + 초과분의 ${(brackets.secondBracket.rate * 100)}%`;
    } else if (pensionIncome <= brackets.thirdBracket.max) {
      deduction = brackets.thirdBracket.base + (pensionIncome - brackets.thirdBracket.min) * brackets.thirdBracket.rate;
      bracketInfo = `${formatCurrency(brackets.thirdBracket.base)} + 초과분의 ${(brackets.thirdBracket.rate * 100)}%`;
    } else {
      deduction = brackets.fourthBracket.base + (pensionIncome - brackets.fourthBracket.min) * brackets.fourthBracket.rate;
      bracketInfo = `${formatCurrency(brackets.fourthBracket.base)} + 초과분의 ${(brackets.fourthBracket.rate * 100)}%`;
    }
    
    return {
      deductionAmount: Math.floor(deduction),
      message: `연금소득공제: ${bracketInfo}`
    };
  }

  /**
   * 기타소득 필요경비 검증
   */
  static validateOtherIncomeExpenses(
    otherIncome: number,
    isBasicDeductionApplied: boolean = true
  ): { deductionAmount: number; message: string } {
    const limits = COMPREHENSIVE_TAX_LIMITS_2024.otherIncome;
    
    if (isBasicDeductionApplied && otherIncome <= limits.basicDeduction) {
      return {
        deductionAmount: otherIncome,
        message: `기타소득 기본공제 ${formatCurrency(limits.basicDeduction)} 이하로 전액공제`
      };
    }
    
    const expenseByRate = Math.min(otherIncome * limits.expenseRate, limits.maxExpense);
    const actualDeduction = isBasicDeductionApplied 
      ? Math.max(limits.basicDeduction, expenseByRate)
      : expenseByRate;
    
    return {
      deductionAmount: actualDeduction,
      message: `경비율 ${(limits.expenseRate * 100)}% (최대 ${formatCurrency(limits.maxExpense)}) 또는 기본공제 ${formatCurrency(limits.basicDeduction)} 중 유리한 금액`
    };
  }

  /**
   * 종합소득 의료비 공제 한도 계산
   */
  static calculateMedicalExpenseThreshold(totalIncome: number): number {
    return totalIncome * COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.medicalExpenseRate;
  }

  /**
   * 종합소득 기부금 공제 한도 계산
   */
  static calculateDonationLimit(totalIncome: number, isReligious: boolean = false): number {
    const rate = isReligious 
      ? COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.religiousDonationLimit
      : COMPREHENSIVE_TAX_LIMITS_2024.comprehensiveDeductions.donationLimit;
    return totalIncome * rate;
  }

  /**
   * 연금저축 세액공제 검증
   */
  static validatePensionSavings(amount: number): { 
    isValid: boolean; 
    limitedAmount: number; 
    taxCredit: number;
    message?: string; 
  } {
    const limits = COMPREHENSIVE_TAX_LIMITS_2024.taxCredits;
    
    if (amount > limits.pensionSavings) {
      const taxCredit = limits.pensionSavingsCreditLimit;
      return {
        isValid: false,
        limitedAmount: limits.pensionSavings,
        taxCredit,
        message: `연금저축 납입한도는 연 ${formatCurrency(limits.pensionSavings)}입니다 (세액공제 한도: ${formatCurrency(limits.pensionSavingsCreditLimit)})`
      };
    }
    
    const taxCredit = Math.min(amount * limits.pensionSavingsCreditRate, limits.pensionSavingsCreditLimit);
    return {
      isValid: true,
      limitedAmount: amount,
      taxCredit,
      message: `세액공제: ${formatCurrency(taxCredit)} (${(limits.pensionSavingsCreditRate * 100)}%)`
    };
  }

  /**
   * 자녀세액공제 계산
   */
  static calculateChildTaxCredit(numberOfChildren: number): {
    creditAmount: number;
    message: string;
  } {
    const creditPerChild = COMPREHENSIVE_TAX_LIMITS_2024.taxCredits.childTaxCredit;
    const totalCredit = numberOfChildren * creditPerChild;
    
    return {
      creditAmount: totalCredit,
      message: `자녀 ${numberOfChildren}명 × ${formatCurrency(creditPerChild)} = ${formatCurrency(totalCredit)}`
    };
  }

  /**
   * 소득금액 검증 (최대값 제한)
   */
  static validateIncomeAmount(amount: number, incomeType: string): { 
    isValid: boolean; 
    limitedAmount: number; 
    message?: string; 
  } {
    const maxIncome = 50000000000; // 500억원
    
    if (amount > maxIncome) {
      return {
        isValid: false,
        limitedAmount: maxIncome,
        message: `${incomeType}은 최대 ${formatCurrency(maxIncome)}까지 입력 가능합니다`
      };
    }
    
    if (amount < 0) {
      return {
        isValid: false,
        limitedAmount: 0,
        message: `${incomeType}은 0원 이상이어야 합니다`
      };
    }
    
    return { isValid: true, limitedAmount: amount };
  }
}

/**
 * 종합소득세 계산기
 */
export class ComprehensiveIncomeTaxCalculator {
  static calculate(input: ComprehensiveIncomeTaxInput): ComprehensiveIncomeTaxResult {
    // 1단계: 총수입금액 계산
    const totalIncome = this.calculateTotalIncome(input);
    
    // 2단계: 총소득금액 계산 (수입금액 - 필요경비)
    const totalGrossIncome = this.calculateTotalGrossIncome(input);
    
    // 3단계: 종합소득공제 계산
    const totalDeductions = this.calculateTotalDeductions(input);
    
    // 4단계: 종합소득과세표준 계산
    const taxableIncome = Math.max(0, totalGrossIncome - totalDeductions);
    
    // 5단계: 종합소득 산출세액 계산
    const progressiveTax = this.calculateProgressiveTax(taxableIncome, INCOME_TAX_RATES_2024);
    
    // 6단계: 세액공제 계산
    const totalTaxCredit = this.calculateTotalTaxCredit(input, progressiveTax);
    
    // 7단계: 종합소득결정세액 계산
    const determinedTax = Math.max(0, progressiveTax - totalTaxCredit);
    const localIncomeTax = Math.floor(determinedTax * LOCAL_INCOME_TAX_RATE);
    const totalTax = determinedTax + localIncomeTax;
    
    // 8단계: 추가납부세액 또는 환급세액 계산
    const additionalTax = Math.max(0, totalTax - input.previousYearTaxPaid);
    const refundTax = Math.max(0, input.previousYearTaxPaid - totalTax);
    
    // 9단계: 세율 계산
    const effectiveRate = totalGrossIncome > 0 ? (totalTax / totalGrossIncome) * 100 : 0;
    const marginalRate = this.calculateMarginalRate(taxableIncome);
    
    return {
      totalIncome,
      totalGrossIncome,
      totalDeductibleAmount: totalDeductions,
      taxableIncome,
      progressiveTax,
      totalTaxCredit,
      determinedTax,
      additionalTax,
      refundTax,
      effectiveRate,
      marginalRate,
      taxableAmount: taxableIncome,
      calculatedTax: determinedTax,
      localIncomeTax,
      totalTax,
      netAmount: totalGrossIncome - totalTax,
      breakdown: this.generateBreakdown(input, totalIncome, totalGrossIncome, totalDeductions, taxableIncome, progressiveTax, determinedTax),
      appliedRates: this.getAppliedRates(taxableIncome),
      deductions: this.getDeductionList(input, totalDeductions)
    };
  }

  /**
   * 총수입금액 계산
   */
  private static calculateTotalIncome(input: ComprehensiveIncomeTaxInput): number {
    return input.interestIncome +
           input.dividendIncome +
           input.businessIncome +
           input.realEstateRentalIncome +
           input.earnedIncome +
           input.pensionIncome +
           input.otherIncome;
  }

  /**
   * 총소득금액 계산 (수입금액 - 필요경비)
   */
  private static calculateTotalGrossIncome(input: ComprehensiveIncomeTaxInput): number {
    // 이자소득 (필요경비 없음)
    const interestGrossIncome = input.interestIncome;
    
    // 배당소득 (필요경비 없음)
    const dividendGrossIncome = input.dividendIncome;
    
    // 사업소득 (수입금액 - 필요경비)
    const businessGrossIncome = Math.max(0, input.businessIncome - input.businessExpenses);
    
    // 부동산임대소득 (수입금액 - 필요경비)
    const rentalGrossIncome = Math.max(0, input.realEstateRentalIncome - input.rentalExpenses);
    
    // 근로소득 (급여 - 근로소득공제)
    const earnedGrossIncome = Math.max(0, input.earnedIncome - input.earnedIncomeDeduction);
    
    // 연금소득 (필요경비 적용)
    const pensionGrossIncome = Math.max(0, input.pensionIncome - this.calculatePensionDeduction(input.pensionIncome));
    
    // 기타소득 (필요경비 적용)
    const otherGrossIncome = Math.max(0, input.otherIncome - this.calculateOtherIncomeDeduction(input.otherIncome));
    
    return interestGrossIncome + dividendGrossIncome + businessGrossIncome + 
           rentalGrossIncome + earnedGrossIncome + pensionGrossIncome + otherGrossIncome;
  }

  /**
   * 연금소득공제 계산
   */
  private static calculatePensionDeduction(pensionIncome: number): number {
    if (pensionIncome <= 3500000) return pensionIncome * 0.4; // 40%
    if (pensionIncome <= 7000000) return 1400000 + (pensionIncome - 3500000) * 0.2; // 140만원 + 20%
    if (pensionIncome <= 14000000) return 2100000 + (pensionIncome - 7000000) * 0.1; // 210만원 + 10%
    return 2800000 + (pensionIncome - 14000000) * 0.05; // 280만원 + 5%
  }

  /**
   * 기타소득공제 계산
   */
  private static calculateOtherIncomeDeduction(otherIncome: number): number {
    // 기타소득 필요경비 (간이계산 60% 또는 실제 필요경비)
    return Math.min(otherIncome * 0.6, 1200000); // 60% 또는 120만원 한도
  }

  /**
   * 종합소득공제 계산
   */
  private static calculateTotalDeductions(input: ComprehensiveIncomeTaxInput): number {
    // 1. 인적공제
    let personalDeduction = DEDUCTION_AMOUNTS_2024.personal.basic; // 본인공제
    personalDeduction += input.dependents * DEDUCTION_AMOUNTS_2024.personal.dependent; // 부양가족공제
    
    if (input.spouseCount && input.spouseCount > 0) {
      personalDeduction += (DEDUCTION_AMOUNTS_2024.personal.spouse || 1500000) * input.spouseCount; // 배우자공제
    }
    
    if (input.disabledCount && input.disabledCount > 0) {
      personalDeduction += DEDUCTION_AMOUNTS_2024.personal.disabled * input.disabledCount; // 장애인공제
    }
    
    if (input.elderlyCount && input.elderlyCount > 0) {
      personalDeduction += DEDUCTION_AMOUNTS_2024.personal.elderly * input.elderlyCount; // 경로우대공제
    }

    // 2. 연금보험료공제
    const pensionDeduction = input.personalPensionContribution + input.pensionSavings;

    // 3. 특별공제 계산
    const specialDeduction = this.calculateSpecialDeduction(input);
    const standardDeduction = DEDUCTION_AMOUNTS_2024.standard;
    const deduction = Math.max(specialDeduction, standardDeduction);

    // 4. 그 밖의 소득공제
    const otherDeductions = input.housingFund; // 주택청약종합저축 등

    return personalDeduction + pensionDeduction + deduction + otherDeductions;
  }

  /**
   * 특별공제 계산
   */
  private static calculateSpecialDeduction(input: ComprehensiveIncomeTaxInput): number {
    let specialDeduction = 0;
    
    // 의료비공제 (총급여의 3% 초과분)
    const totalEarned = input.earnedIncome || 0;
    const medicalThreshold = totalEarned * 0.03;
    if (input.medicalExpenses > medicalThreshold) {
      specialDeduction += (input.medicalExpenses - medicalThreshold);
    }
    
    // 교육비공제
    specialDeduction += input.educationExpenses;
    
    // 기부금공제
    specialDeduction += input.donationAmount;
    
    // 신용카드 등 사용금액 공제
    const cardThreshold = totalEarned * 0.25;
    if (input.creditCardUsage > cardThreshold) {
      const cardDeduction = (input.creditCardUsage - cardThreshold) * 0.15;
      specialDeduction += Math.min(cardDeduction, 3000000); // 한도 300만원
    }
    
    return specialDeduction;
  }

  /**
   * 세액공제 계산
   */
  private static calculateTotalTaxCredit(input: ComprehensiveIncomeTaxInput, calculatedTax: number): number {
    let taxCredit = 0;
    
    // 자녀세액공제
    taxCredit += input.childTaxCredit;
    
    // 근로소득세액공제
    if (input.earnedIncome > 0) {
      taxCredit += this.calculateEarnedIncomeTaxCredit(calculatedTax, input.earnedIncome);
    }
    
    // 연금저축세액공제
    if (input.pensionSavings > 0) {
      taxCredit += Math.min(input.pensionSavings * 0.135, 945000); // 13.5%, 한도 94.5만원
    }
    
    // 기타세액공제
    taxCredit += input.earnedIncomeTaxCredit;
    
    return taxCredit;
  }

  /**
   * 근로소득세액공제 계산
   */
  private static calculateEarnedIncomeTaxCredit(calculatedTax: number, earnedIncome: number): number {
    if (earnedIncome === 0) return 0;
    
    if (calculatedTax <= 1300000) {
      return Math.floor(calculatedTax * 0.55);
    } else {
      return Math.floor(715000 + (calculatedTax - 1300000) * 0.3);
    }
  }

  /**
   * 한계세율 계산
   */
  private static calculateMarginalRate(taxableIncome: number): number {
    for (const rate of INCOME_TAX_RATES_2024) {
      if (taxableIncome >= rate.min && taxableIncome < rate.max) {
        return rate.rate * 100;
      }
    }
    return INCOME_TAX_RATES_2024[INCOME_TAX_RATES_2024.length - 1].rate * 100;
  }

  /**
   * 누진세 계산
   */
  private static calculateProgressiveTax(income: number, rates: TaxRate[]): number {
    let tax = 0;
    let remainingIncome = income;
    
    for (const rate of rates) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      tax += bracketIncome * rate.rate;
      remainingIncome -= bracketIncome;
    }
    
    return Math.floor(tax);
  }

  /**
   * 계산 과정 상세 내역
   */
  private static generateBreakdown(
    input: ComprehensiveIncomeTaxInput,
    totalIncome: number,
    totalGrossIncome: number,
    totalDeductions: number,
    taxableIncome: number,
    progressiveTax: number,
    determinedTax: number
  ): CalculationBreakdown {
    const totalTaxCredit = this.calculateTotalTaxCredit(input, progressiveTax);
    const localIncomeTax = Math.floor(determinedTax * LOCAL_INCOME_TAX_RATE);

    return {
      steps: [
        { label: '총수입금액', amount: totalIncome },
        { label: '총소득금액', amount: totalGrossIncome },
        { label: '종합소득공제', amount: -totalDeductions },
        { label: '종합소득과세표준', amount: taxableIncome },
        { label: '종합소득산출세액', amount: progressiveTax },
        { label: '세액공제', amount: -totalTaxCredit },
        { label: '종합소득결정세액', amount: determinedTax },
        { label: '지방소득세', amount: localIncomeTax },
        { label: '총납부세액', amount: determinedTax + localIncomeTax }
      ],
      summary: {
        totalIncome,
        totalDeductions,
        taxableIncome,
        taxBeforeCredits: progressiveTax,
        taxCredits: totalTaxCredit,
        finalTax: determinedTax + localIncomeTax
      }
    };
  }

  /**
   * 적용된 세율 구간
   */
  private static getAppliedRates(taxableIncome: number): AppliedRate[] {
    const appliedRates: AppliedRate[] = [];
    let remainingIncome = taxableIncome;
    
    for (const rate of INCOME_TAX_RATES_2024) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      if (bracketIncome > 0) {
        appliedRates.push({
          range: `${rate.min.toLocaleString()}원 ~ ${rate.max === Infinity ? '∞' : rate.max.toLocaleString()}원`,
          rate: rate.rate,
          amount: Math.floor(bracketIncome * rate.rate)
        });
      }
      remainingIncome -= bracketIncome;
    }
    
    return appliedRates;
  }

  /**
   * 공제 항목 목록
   */
  private static getDeductionList(input: ComprehensiveIncomeTaxInput, totalDeductions: number): Deduction[] {
    const deductions: Deduction[] = [];
    
    // 인적공제
    let personalDeduction = DEDUCTION_AMOUNTS_2024.personal.basic;
    personalDeduction += input.dependents * DEDUCTION_AMOUNTS_2024.personal.dependent;
    if (input.spouseCount && input.spouseCount > 0) personalDeduction += 1500000 * input.spouseCount;
    if (input.disabledCount && input.disabledCount > 0) personalDeduction += DEDUCTION_AMOUNTS_2024.personal.disabled * input.disabledCount;
    if (input.elderlyCount && input.elderlyCount > 0) personalDeduction += DEDUCTION_AMOUNTS_2024.personal.elderly * input.elderlyCount;
    
    deductions.push({ type: 'personal', label: '인적공제', amount: personalDeduction });
    
    // 연금보험료공제
    const pensionDeduction = input.personalPensionContribution + input.pensionSavings;
    if (pensionDeduction > 0) {
      deductions.push({ type: 'pension', label: '연금보험료공제', amount: pensionDeduction });
    }
    
    // 특별공제
    const specialDeduction = this.calculateSpecialDeduction(input);
    if (specialDeduction > 0) {
      deductions.push({ type: 'special', label: '특별공제', amount: specialDeduction });
    }
    
    return deductions;
  }
} 