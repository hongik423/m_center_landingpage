'use client';

import { 
  StockTransferInput, 
  StockTransferResult, 
  DividendTaxInput,
  DividendTaxResult,
  TransferMethodComparison,
  ShareholderTest,
  TaxIncentive,
  TaxSavingTip,
  StockTransferCalculationDetails
} from '@/types/tax-calculator.types';

// 주식이동세금 통합 계산 엔진 (PRD 기반 고도화)

/**
 * 2024년 주식이동 관련 세율 및 기준
 */
export const STOCK_TRANSFER_TAX_RATES_2024 = {
  // 대주주 판정 기준
  shareholderThresholds: {
    listed: {
      ratio: 0.01,    // 1%
      value: 10000000000  // 100억원
    },
    unlisted: {
      ratio: 0.04,    // 4%
      value: 10000000000  // 100억원
    }
  },

  // 주식양도소득세율
  capitalGainsTax: {
    listed: {
      largeShareholder: {
        under1year: 0.30,   // 30%
        under2years: 0.25,  // 25%
        over2years: 0.20    // 20%
      },
      smallShareholder: 0   // 비과세
    },
    unlisted: {
      largeShareholder: {
        under1year: 0.35,   // 35%
        over1year: 0.25     // 25%
      },
      smallShareholder: {
        under1year: 0.30,   // 30%
        over1year: 0.20     // 20%
      }
    }
  },

  // 증여세 공제한도
  giftDeduction: {
    spouse: 600000000,        // 6억
    lineal_descendant: 50000000,  // 5천만원 (성인), 2천만원 (미성년)
    lineal_ascendant: 50000000,   // 5천만원
    sibling: 10000000,        // 1천만원
    other: 10000000           // 1천만원
  },

  // 증여세율
  giftTaxRates: [
    { min: 0, max: 100000000, rate: 0.10, deduction: 0 },
    { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },
    { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },
    { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 },
    { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }
  ],

  // 배당소득세율
  dividendTax: {
    domestic: {
      general: 0.14,        // 14%
      smallCompany: 0.09    // 9%
    },
    foreign: 0.22          // 22%
  },

  // 할증세율
  surcharge: {
    unlistedLargeShareholder: 0.30  // 30%
  }
};

/**
 * 주식양도소득세 계산기
 */
export class StockCapitalGainsTaxCalculator {
  static calculate(input: StockTransferInput): StockTransferResult {
    try {
      // 1단계: 대주주 여부 판정
      const shareholderStatus = this.determineLargeShareholderStatus(input);
      
      // 2단계: 과세 대상 여부 확인
      const isTaxable = this.checkTaxability(input, shareholderStatus.finalStatus === 'large');
      
      if (!isTaxable) {
        return this.generateNonTaxableResult(input, shareholderStatus);
      }
      
      // 3단계: 양도차익 계산
      const capitalGain = this.calculateCapitalGain(input);
      
      // 4단계: 세율 결정
      const taxRate = this.determineTaxRate(input, shareholderStatus.finalStatus === 'large');
      
      // 5단계: 세액 계산
      const taxAmount = Math.floor(Math.max(0, capitalGain) * taxRate.rate);
      const localIncomeTax = Math.floor(taxAmount * 0.1);
      const totalTax = taxAmount + localIncomeTax;
      
      // 6단계: 세제혜택 계산
      const incentives = this.calculateTaxIncentives(input, totalTax);
      const finalTax = Math.max(0, totalTax - incentives.totalBenefit);
      
      // 7단계: 절세 기회 분석
      const savingTips = this.analyzeTaxSavingOpportunities(input, capitalGain, finalTax);
      
      return {
        transferType: 'sale',
        taxableAmount: Math.max(0, capitalGain),
        calculatedTax: taxAmount,
        localIncomeTax,
        totalTax: finalTax,
        
        capitalGain,
        isLargeShareholder: shareholderStatus.finalStatus === 'large',
        shareholderStatus,
        appliedTaxRate: taxRate.rate,
        marginalRate: taxRate.rate,
        effectiveRate: capitalGain > 0 ? (finalTax / capitalGain) * 100 : 0,
        
        taxIncentiveAmount: incentives.totalBenefit,
        netProceeds: (input.transferPrice || 0) - finalTax,
        
        taxSavingOpportunities: savingTips,
        calculationDetails: this.generateCalculationDetails(input, shareholderStatus, capitalGain, taxRate, incentives),
        
        breakdown: this.generateBreakdown(input, capitalGain, finalTax),
        appliedRates: [{ range: `${taxRate.rate * 100}%`, rate: taxRate.rate, amount: taxAmount }],
        deductions: []
      };
    } catch (error) {
      console.error('주식양도소득세 계산 오류:', error);
      throw new Error('주식양도소득세 계산 중 오류가 발생했습니다.');
    }
  }

  /**
   * 대주주 여부 판정 (실무 기준)
   */
  private static determineLargeShareholderStatus(input: StockTransferInput) {
    const thresholds = STOCK_TRANSFER_TAX_RATES_2024.shareholderThresholds[input.stockType as 'listed' | 'unlisted'] 
      || STOCK_TRANSFER_TAX_RATES_2024.shareholderThresholds.listed;

    const tests: ShareholderTest[] = [
      {
        testType: 'ratio',
        threshold: thresholds.ratio,
        actualValue: input.personalShareholdingRatio,
        passed: input.personalShareholdingRatio >= thresholds.ratio,
        description: `본인 지분율 ${(thresholds.ratio * 100).toFixed(1)}% 이상`
      },
      {
        testType: 'value',
        threshold: thresholds.value,
        actualValue: input.totalValue,
        passed: input.totalValue >= thresholds.value,
        description: `보유주식가액 ${(thresholds.value / 100000000).toFixed(0)}억원 이상`
      },
      {
        testType: 'family',
        threshold: thresholds.ratio,
        actualValue: input.familyShareholdingRatio,
        passed: input.familyShareholdingRatio >= thresholds.ratio,
        description: `특수관계인 포함 지분율 ${(thresholds.ratio * 100).toFixed(1)}% 이상`
      }
    ];

    const isLarge = tests.some(test => test.passed);

    return {
      personalRatio: input.personalShareholdingRatio,
      familyRatio: input.familyShareholdingRatio,
      valueTest: tests[1].passed,
      ratioTest: tests[0].passed || tests[2].passed,
      finalStatus: isLarge ? 'large' as const : 'small' as const
    };
  }

  /**
   * 과세 대상 여부 확인
   */
  private static checkTaxability(input: StockTransferInput, isLargeShareholder: boolean): boolean {
    // 상장주식 소액주주는 비과세
    if ((input.stockType === 'listed' || input.stockType === 'kosdaq') && !isLargeShareholder) {
      return false;
    }
    
    // 비상장주식은 과세
    return true;
  }

  /**
   * 양도차익 계산
   */
  private static calculateCapitalGain(input: StockTransferInput): number {
    const transferPrice = input.transferPrice || 0;
    const acquisitionPrice = input.acquisitionPrice;
    const transferExpenses = input.transferExpenses;
    
    return transferPrice - acquisitionPrice - transferExpenses;
  }

  /**
   * 세율 결정
   */
  private static determineTaxRate(input: StockTransferInput, isLargeShareholder: boolean): { rate: number; description: string } {
    const rates = STOCK_TRANSFER_TAX_RATES_2024.capitalGainsTax;
    
    if (input.stockType === 'listed' || input.stockType === 'kosdaq') {
      if (isLargeShareholder) {
        const holdingYears = input.holdingYears || 0;
        if (holdingYears < 1) {
          return { rate: rates.listed.largeShareholder.under1year, description: '상장주식 대주주 1년미만' };
        } else if (holdingYears < 2) {
          return { rate: rates.listed.largeShareholder.under2years, description: '상장주식 대주주 1~2년' };
        } else {
          return { rate: rates.listed.largeShareholder.over2years, description: '상장주식 대주주 2년이상' };
        }
      } else {
        return { rate: rates.listed.smallShareholder, description: '상장주식 소액주주 비과세' };
      }
    } else {
      // 비상장주식
      const holdingYears = input.holdingYears || 0;
      if (isLargeShareholder) {
        if (holdingYears < 1) {
          return { rate: rates.unlisted.largeShareholder.under1year, description: '비상장주식 대주주 1년미만' };
        } else {
          return { rate: rates.unlisted.largeShareholder.over1year, description: '비상장주식 대주주 1년이상' };
        }
      } else {
        if (holdingYears < 1) {
          return { rate: rates.unlisted.smallShareholder.under1year, description: '비상장주식 소액주주 1년미만' };
        } else {
          return { rate: rates.unlisted.smallShareholder.over1year, description: '비상장주식 소액주주 1년이상' };
        }
      }
    }
  }

  /**
   * 세제혜택 계산
   */
  private static calculateTaxIncentives(input: StockTransferInput, baseTax: number): { totalBenefit: number; incentives: TaxIncentive[] } {
    const incentives: TaxIncentive[] = [];
    let totalBenefit = 0;

    // 벤처기업주식 세제혜택
    if (input.isStartupStock) {
      const benefit = Math.min(baseTax * 0.5, 10000000); // 최대 1천만원
      incentives.push({
        type: 'startup',
        description: '벤처기업주식 양도소득세 50% 감면',
        benefit,
        requirements: ['벤처기업확인서', '2년 이상 보유'],
        applicable: input.holdingYears >= 2
      });
      if (input.holdingYears >= 2) {
        totalBenefit += benefit;
      }
    }

    // 중소기업주식 세제혜택
    if (input.isSmallMediumStock) {
      const benefit = Math.min(baseTax * 0.1, 5000000); // 최대 500만원
      incentives.push({
        type: 'sme',
        description: '중소기업주식 양도소득세 10% 감면',
        benefit,
        requirements: ['중소기업확인서', '1년 이상 보유'],
        applicable: input.holdingYears >= 1
      });
      if (input.holdingYears >= 1) {
        totalBenefit += benefit;
      }
    }

    return { totalBenefit, incentives };
  }

  /**
   * 절세 기회 분석
   */
  private static analyzeTaxSavingOpportunities(input: StockTransferInput, capitalGain: number, totalTax: number): TaxSavingTip[] {
    const tips: TaxSavingTip[] = [];

    // 보유기간 연장 효과
    if (input.holdingYears < 2 && input.stockType === 'listed') {
      const currentRate = this.determineTaxRate(input, true).rate;
      const futureRate = STOCK_TRANSFER_TAX_RATES_2024.capitalGainsTax.listed.largeShareholder.over2years;
      const potentialSaving = capitalGain * (currentRate - futureRate);
      
      if (potentialSaving > 0) {
        tips.push({
          category: '보유기간 관리',
          tip: '2년 이상 보유 시 세율 20%로 감소',
          potentialSaving: Math.floor(potentialSaving),
          feasibility: 'high'
        });
      }
    }

    // 분할 매도 효과
    if (capitalGain > 50000000) { // 5천만원 이상
      tips.push({
        category: '매도 전략',
        tip: '연간 분할 매도로 세율 구간 관리',
        potentialSaving: Math.floor(totalTax * 0.1),
        feasibility: 'medium'
      });
    }

    // 손실 주식과 상계
    if (input.hasOtherCapitalGains) {
      tips.push({
        category: '손익 통산',
        tip: '손실 주식과 상계하여 세부담 감소',
        potentialSaving: Math.floor(totalTax * 0.2),
        feasibility: 'high'
      });
    }

    return tips;
  }

  /**
   * 계산 상세 내역 생성
   */
  private static generateCalculationDetails(
    input: StockTransferInput,
    shareholderStatus: any,
    capitalGain: number,
    taxRate: any,
    incentives: any
  ): StockTransferCalculationDetails {
    return {
      shareholderDetermination: {
        tests: [], // 위에서 생성된 tests 활용
        finalResult: shareholderStatus.finalStatus === 'large',
        explanation: `대주주 판정 결과: ${shareholderStatus.finalStatus === 'large' ? '대주주' : '소액주주'}`
      },
      taxCalculationSteps: [
        { label: '양도가액', amount: input.transferPrice || 0, formula: '매매계약 금액' },
        { label: '취득가액', amount: input.acquisitionPrice },
        { label: '양도비용', amount: input.transferExpenses },
        { label: '양도차익', amount: capitalGain, formula: '양도가액 - 취득가액 - 양도비용' },
        { label: '적용세율', amount: taxRate.rate * 100, formula: taxRate.description },
      ],
      applicableIncentives: incentives.incentives,
      riskFactors: this.identifyRiskFactors(input)
    };
  }

  /**
   * 위험 요소 식별
   */
  private static identifyRiskFactors(input: StockTransferInput): string[] {
    const risks: string[] = [];

    if (input.stockType === 'unlisted') {
      risks.push('비상장주식 가치평가 이슈');
    }

    if (input.familyShareholdingRatio > 0.5) {
      risks.push('특수관계인 증여의제 위험');
    }

    if (input.transfereeResidence === 'foreign') {
      risks.push('국외거주자 세무 신고 의무');
    }

    return risks;
  }

  /**
   * 비과세 결과 생성
   */
  private static generateNonTaxableResult(input: StockTransferInput, shareholderStatus: any): StockTransferResult {
    return {
      transferType: 'sale',
      taxableAmount: 0,
      calculatedTax: 0,
      localIncomeTax: 0,
      totalTax: 0,
      
      capitalGain: this.calculateCapitalGain(input),
      isLargeShareholder: false,
      shareholderStatus,
      appliedTaxRate: 0,
      marginalRate: 0,
      effectiveRate: 0,
      
      netProceeds: input.transferPrice || 0,
      taxSavingOpportunities: [],
      calculationDetails: {
        shareholderDetermination: {
          tests: [],
          finalResult: false,
          explanation: '소액주주 비과세'
        },
        taxCalculationSteps: [],
        applicableIncentives: [],
        riskFactors: []
      },
      
      breakdown: { steps: [], summary: { totalIncome: 0, totalDeductions: 0, taxableIncome: 0, taxBeforeCredits: 0, taxCredits: 0, finalTax: 0 } },
      appliedRates: [],
      deductions: []
    };
  }

  /**
   * 계산 내역 생성
   */
  private static generateBreakdown(input: StockTransferInput, capitalGain: number, totalTax: number) {
    return {
      steps: [
        { label: '양도가액', amount: input.transferPrice || 0 },
        { label: '취득가액', amount: input.acquisitionPrice },
        { label: '양도비용', amount: input.transferExpenses },
        { label: '양도차익', amount: capitalGain },
        { label: '양도소득세', amount: totalTax }
      ],
      summary: {
        totalIncome: input.transferPrice || 0,
        totalDeductions: input.acquisitionPrice + input.transferExpenses,
        taxableIncome: capitalGain,
        taxBeforeCredits: totalTax,
        taxCredits: 0,
        finalTax: totalTax
      }
    };
  }
}

/**
 * 주식증여세 계산기
 */
export class StockGiftTaxCalculator {
  static calculate(input: StockTransferInput): StockTransferResult {
    try {
      // 1단계: 증여재산 가액 평가
      const giftValue = this.evaluateStockValue(input);
      
      // 2단계: 증여공제 계산
      const giftDeduction = this.calculateGiftDeduction(input);
      
      // 3단계: 과세표준 계산
      const taxableAmount = Math.max(0, giftValue - giftDeduction);
      
      // 4단계: 증여세 계산
      const calculatedTax = this.calculateProgressiveTax(taxableAmount);
      
      // 5단계: 할증/감면 적용
      const adjustments = this.applyAdjustments(calculatedTax, input);
      
      const finalTax = adjustments.finalTax;
      const localIncomeTax = Math.floor(finalTax * 0.1);
      const totalTax = finalTax + localIncomeTax;

      return {
        transferType: 'gift',
        taxableAmount,
        calculatedTax: finalTax,
        localIncomeTax,
        totalTax,
        
        giftValue,
        giftDeduction,
        isLargeShareholder: input.familyShareholdingRatio >= 0.01,
        shareholderStatus: StockCapitalGainsTaxCalculator['determineLargeShareholderStatus'](input),
        appliedTaxRate: adjustments.effectiveRate,
        marginalRate: adjustments.marginalRate,
        effectiveRate: giftValue > 0 ? (totalTax / giftValue) * 100 : 0,
        
        surchargeRate: adjustments.surchargeRate,
        surchargeAmount: adjustments.surchargeAmount,
        netProceeds: giftValue - totalTax,
        
        taxSavingOpportunities: this.analyzeGiftTaxSavingTips(input, giftValue, totalTax),
        calculationDetails: this.generateGiftCalculationDetails(input, giftValue, giftDeduction, finalTax),
        
        breakdown: this.generateGiftBreakdown(input, giftValue, giftDeduction, finalTax),
        appliedRates: this.getGiftTaxRates(taxableAmount),
        deductions: [{ type: 'gift', label: '증여공제', amount: giftDeduction }]
      };
    } catch (error) {
      console.error('주식증여세 계산 오류:', error);
      throw new Error('주식증여세 계산 중 오류가 발생했습니다.');
    }
  }

  /**
   * 주식 가치 평가
   */
  private static evaluateStockValue(input: StockTransferInput): number {
    if (input.stockType === 'listed' || input.stockType === 'kosdaq') {
      // 상장주식: 평가기준일 전후 2개월 평균가액
      return input.totalValue;
    } else {
      // 비상장주식: 보충적 평가방법
      const netWorthValue = input.netWorthPerShare || 0;
      const earningsValue = input.earningsPerShare || 0;
      
      // 순자산가치 3 : 순손익가치 2 비율
      return Math.floor((netWorthValue * 3 + earningsValue * 2) / 5 * input.stockQuantity);
    }
  }

  /**
   * 증여공제 계산
   */
  private static calculateGiftDeduction(input: StockTransferInput): number {
    const relationship = input.relationship || 'other';
    const deductions = STOCK_TRANSFER_TAX_RATES_2024.giftDeduction;
    
    return deductions[relationship] || deductions.other;
  }

  /**
   * 누진세율 계산
   */
  private static calculateProgressiveTax(taxableAmount: number): number {
    const rates = STOCK_TRANSFER_TAX_RATES_2024.giftTaxRates;
    
    for (const rate of rates) {
      if (taxableAmount >= rate.min && taxableAmount < rate.max) {
        return Math.floor(taxableAmount * rate.rate - rate.deduction);
      }
    }
    
    return 0;
  }

  /**
   * 할증/감면 적용
   */
  private static applyAdjustments(baseTax: number, input: StockTransferInput): {
    finalTax: number;
    surchargeRate: number;
    surchargeAmount: number;
    effectiveRate: number;
    marginalRate: number;
  } {
    let finalTax = baseTax;
    let surchargeRate = 0;
    let surchargeAmount = 0;

    // 비상장주식 대주주 할증
    if (input.stockType === 'unlisted' && input.familyShareholdingRatio >= 0.04) {
      surchargeRate = STOCK_TRANSFER_TAX_RATES_2024.surcharge.unlistedLargeShareholder;
      surchargeAmount = Math.floor(baseTax * surchargeRate);
      finalTax = baseTax + surchargeAmount;
    }

    return {
      finalTax,
      surchargeRate,
      surchargeAmount,
      effectiveRate: finalTax / input.totalValue * 100,
      marginalRate: surchargeRate + 0.5 // 최고세율 가정
    };
  }

  /**
   * 증여세 절세 팁 분석
   */
  private static analyzeGiftTaxSavingTips(input: StockTransferInput, giftValue: number, totalTax: number): TaxSavingTip[] {
    const tips: TaxSavingTip[] = [];

    // 공제한도 활용
    const availableDeduction = this.calculateGiftDeduction(input);
    if (giftValue > availableDeduction) {
      tips.push({
        category: '공제 활용',
        tip: '연간 공제한도 내 분할 증여',
        potentialSaving: Math.floor(totalTax * 0.3),
        feasibility: 'high'
      });
    }

    // 가족간 분산 증여
    if (input.relationship === 'lineal_descendant') {
      tips.push({
        category: '분산 전략',
        tip: '배우자 및 자녀들에게 분산 증여',
        potentialSaving: Math.floor(totalTax * 0.2),
        feasibility: 'medium'
      });
    }

    return tips;
  }

  // 기타 보조 메서드들...
  private static generateGiftCalculationDetails(input: StockTransferInput, giftValue: number, giftDeduction: number, finalTax: number): StockTransferCalculationDetails {
    return {
      shareholderDetermination: {
        tests: [],
        finalResult: input.familyShareholdingRatio >= 0.04,
        explanation: '증여세 할증 적용 여부'
      },
      taxCalculationSteps: [
        { label: '증여재산가액', amount: giftValue },
        { label: '증여공제', amount: giftDeduction },
        { label: '과세표준', amount: Math.max(0, giftValue - giftDeduction) },
        { label: '증여세액', amount: finalTax }
      ],
      applicableIncentives: [],
      riskFactors: ['증여의제 위험', '가치평가 분쟁 가능성']
    };
  }

  private static generateGiftBreakdown(input: StockTransferInput, giftValue: number, giftDeduction: number, finalTax: number) {
    return {
      steps: [
        { label: '증여재산가액', amount: giftValue },
        { label: '증여공제', amount: -giftDeduction },
        { label: '과세표준', amount: Math.max(0, giftValue - giftDeduction) },
        { label: '증여세', amount: finalTax }
      ],
      summary: {
        totalIncome: giftValue,
        totalDeductions: giftDeduction,
        taxableIncome: Math.max(0, giftValue - giftDeduction),
        taxBeforeCredits: finalTax,
        taxCredits: 0,
        finalTax
      }
    };
  }

  private static getGiftTaxRates(taxableAmount: number) {
    const rates = STOCK_TRANSFER_TAX_RATES_2024.giftTaxRates;
    
    for (const rate of rates) {
      if (taxableAmount >= rate.min && taxableAmount < rate.max) {
        return [{ range: `${rate.rate * 100}%`, rate: rate.rate, amount: taxableAmount * rate.rate - rate.deduction }];
      }
    }
    
    return [];
  }
}

/**
 * 주식이동세금 통합 계산기 (메인 클래스)
 */
export class StockTransferTaxCalculator {
  static calculate(input: StockTransferInput): StockTransferResult {
    switch (input.transferType) {
      case 'sale':
        return StockCapitalGainsTaxCalculator.calculate(input);
      case 'gift':
      case 'inheritance':
        return StockGiftTaxCalculator.calculate(input);
      default:
        throw new Error('지원되지 않는 이동 방식입니다.');
    }
  }
} 