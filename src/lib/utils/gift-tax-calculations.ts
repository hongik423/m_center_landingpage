import { GiftTaxInput, GiftTaxResult } from '@/types/tax-calculator.types';
import { GIFT_TAX_2024 } from '@/constants/tax-rates-2024';

/**
 * 증여세 계산기 클래스
 */
export class GiftTaxCalculator {
  private input: GiftTaxInput;

  constructor(input: GiftTaxInput) {
    this.input = input;
  }

  /**
   * 증여세 계산 메인 함수
   */
  calculate(): GiftTaxResult {
    try {
      // 1. 증여재산 가액 계산
      const grossGift = this.calculateGrossGift();
      
      // 2. 관계별 공제 계산
      const relationshipDeduction = this.calculateRelationshipDeduction();
      
      // 3. 특별 공제 계산
      const specialDeductions = this.calculateSpecialDeductions();
      
      // 4. 총 공제액 계산
      const totalDeductions = relationshipDeduction.amount + specialDeductions.total;
      
      // 5. 10년 합산과세 계산
      const cumulativeTaxation = this.calculateCumulativeTaxation(grossGift, totalDeductions);
      
      // 6. 과세표준 계산
      const taxableGift = Math.max(0, cumulativeTaxation.totalGifts - totalDeductions);
      
      // 7. 증여세 산출세액 계산
      const calculatedTax = this.calculateGiftTax(taxableGift);
      
      // 8. 세액공제 계산
      const taxCredits = this.calculateTaxCredits(calculatedTax);
      
      // 9. 할증 및 감면 계산
      const taxAdjustments = this.calculateTaxAdjustments(calculatedTax);
      
      // 10. 최종 세액 계산
      const grossTaxAmount = calculatedTax - taxCredits.total + taxAdjustments.total;
      const currentTaxDue = Math.max(0, grossTaxAmount - cumulativeTaxation.previousTaxPaid);
      const determinedTax = Math.max(0, currentTaxDue);
      
      // 11. 납부세액 계산
      const additionalPayment = Math.max(0, determinedTax - this.input.previousTaxPaid);
      const refundAmount = Math.max(0, this.input.previousTaxPaid - determinedTax);
      
      // 12. 세율 정보 계산
      const effectiveRate = grossGift > 0 ? (determinedTax / grossGift) : 0;
      const marginalRate = this.getMarginalTaxRate(taxableGift);
      
      // 13. 신고 및 납부 기한 계산
      const { filingDueDate, paymentDueDate, installmentAvailable } = this.calculateDeadlines(determinedTax);
      
      // 14. 절세 조언 생성
      const taxSavingAdvice = this.generateTaxSavingAdvice();
      
      // 15. 계산과정 상세
      const calculationBreakdown = {
        totalGift: grossGift,
        totalDeductions: totalDeductions,
        taxableBase: taxableGift,
        grossTax: calculatedTax,
        totalCredits: taxCredits.total,
        finalTax: determinedTax
      };

      return {
        // 기본 정보
        taxableAmount: taxableGift,
        calculatedTax: calculatedTax,
        localIncomeTax: 0, // 증여세는 지방세 없음
        totalTax: determinedTax,
        
        breakdown: {
          steps: this.generateCalculationSteps(grossGift, totalDeductions, taxableGift, calculatedTax, determinedTax),
          summary: {
            totalIncome: grossGift,
            totalDeductions: totalDeductions,
            taxableIncome: taxableGift,
            taxBeforeCredits: calculatedTax,
            taxCredits: taxCredits.total,
            finalTax: determinedTax
          }
        },
        
        appliedRates: this.getAppliedRates(taxableGift),
        deductions: this.generateDeductionList(relationshipDeduction, specialDeductions),
        
        // 증여세 특화 정보
        grossGift,
        giftDeductions: totalDeductions,
        taxableGift,
        relationshipDeduction,
        specialDeductions,
        cumulativeTaxation,
        taxCredits,
        taxAdjustments,
        determinedTax,
        previousTaxPaid: this.input.previousTaxPaid,
        additionalPayment,
        refundAmount,
        effectiveRate,
        marginalRate,
        filingDueDate,
        paymentDueDate,
        installmentAvailable,
        taxSavingAdvice,
        calculationBreakdown
      };
      
    } catch (error) {
      console.error('증여세 계산 중 오류 발생:', error);
      throw new Error('증여세 계산에 실패했습니다.');
    }
  }

  /**
   * 증여재산 가액 계산
   */
  private calculateGrossGift(): number {
    const totalAssets = this.input.giftAmount + 
                       this.input.marriageGiftAmount + 
                       this.input.educationGiftAmount;
    
    // 부담부증여인 경우 부담액 차감
    const conditionalDeduction = this.input.isConditionalGift ? this.input.giftConditionValue : 0;
    
    return Math.max(0, totalAssets - conditionalDeduction);
  }

  /**
   * 관계별 공제 계산
   */
  private calculateRelationshipDeduction() {
    const { relationshipDeductions } = GIFT_TAX_2024;
    let deductionAmount = 0;
    let deductionType = '';
    let deductionLimit = 0;
    let description = '';

    switch (this.input.donorRelation) {
      case 'spouse':
        deductionAmount = relationshipDeductions.spouse;
        deductionType = '배우자공제';
        deductionLimit = relationshipDeductions.spouse;
        description = '배우자로부터의 증여재산공제';
        break;
      case 'parent':
      case 'grandparent':
        if (this.input.isRecipientMinor) {
          deductionAmount = relationshipDeductions.minorChild;
          deductionType = '미성년자 직계비속공제';
          deductionLimit = relationshipDeductions.minorChild;
          description = '미성년자인 직계비속에 대한 증여재산공제';
        } else {
          deductionAmount = relationshipDeductions.linealDescendant;
          deductionType = '직계존속공제';
          deductionLimit = relationshipDeductions.linealDescendant;
          description = '직계존속으로부터의 증여재산공제';
        }
        break;
      case 'child':
      case 'grandchild':
        deductionAmount = relationshipDeductions.linealAscendant;
        deductionType = '직계비속공제';
        deductionLimit = relationshipDeductions.linealAscendant;
        description = '직계비속으로부터의 증여재산공제';
        break;
      default:
        deductionAmount = relationshipDeductions.other;
        deductionType = '기타공제';
        deductionLimit = relationshipDeductions.other;
        description = '기타 관계로부터의 증여재산공제';
        break;
    }

    return {
      type: deductionType,
      amount: deductionAmount,
      limit: deductionLimit,
      description: description
    };
  }

  /**
   * 특별 공제 계산
   */
  private calculateSpecialDeductions() {
    const { specialDeductions } = GIFT_TAX_2024;
    let marriage = 0;
    let education = 0;
    let startup = 0;

    // 혼인증여공제
    if (this.input.marriageGift && this.input.marriageGiftAmount > 0) {
      if (this.input.donorRelation === 'parent' || this.input.donorRelation === 'grandparent') {
        marriage = Math.min(this.input.marriageGiftAmount, specialDeductions.marriageGift.child);
      } else {
        marriage = Math.min(this.input.marriageGiftAmount, specialDeductions.marriageGift.otherLineal);
      }
    }

    // 교육비공제
    if (this.input.educationGift && this.input.educationGiftAmount > 0) {
      education = Math.min(this.input.educationGiftAmount, specialDeductions.educationGift.domesticEducation);
    }

    // 창업자금공제
    if (this.input.startupDiscount && this.input.giftType === 'business') {
      startup = Math.min(this.input.giftAmount * 0.5, specialDeductions.startupGift.generalStartup);
    }

    return {
      marriage,
      education,
      startup,
      total: marriage + education + startup
    };
  }

  /**
   * 10년 합산과세 계산
   */
  private calculateCumulativeTaxation(currentGift: number, totalDeductions: number) {
    const previousGifts = this.input.previousGifts.reduce((sum, gift) => sum + gift.amount, 0);
    const previousTaxPaid = this.input.previousGifts.reduce((sum, gift) => sum + gift.taxPaid, 0);
    const totalGifts = currentGift + previousGifts;
    
    // 누진계산 (총 증여액 - 총 공제액)에 대한 세액
    const cumulativeTaxableAmount = Math.max(0, totalGifts - totalDeductions);
    const cumulativeTax = this.calculateGiftTax(cumulativeTaxableAmount);
    
    // 이번 납부세액 = 누진계산 세액 - 기납부 세액
    const currentTaxDue = Math.max(0, cumulativeTax - previousTaxPaid);

    return {
      currentGift,
      previousGifts,
      totalGifts,
      previousTaxPaid,
      cumulativeTax,
      currentTaxDue
    };
  }

  /**
   * 증여세 산출세액 계산
   */
  private calculateGiftTax(taxableAmount: number): number {
    const rates = GIFT_TAX_2024.taxRates;
    
    for (const rate of rates) {
      if (taxableAmount >= rate.min && taxableAmount <= rate.max) {
        return Math.max(0, taxableAmount * rate.rate - rate.deduction);
      }
    }
    
    return 0;
  }

  /**
   * 세액공제 계산
   */
  private calculateTaxCredits(calculatedTax: number) {
    // 기납부증여세액공제
    const previousGiftTaxCredit = this.input.previousTaxPaid;
    
    // 외국납부세액공제 (국외재산이 있는 경우)
    const foreignTaxCredit = 0; // 임시 계산
    
    const total = Math.min(calculatedTax, previousGiftTaxCredit + foreignTaxCredit);
    
    return {
      previousGiftTaxCredit: Math.min(previousGiftTaxCredit, calculatedTax),
      foreignTaxCredit: Math.min(foreignTaxCredit, calculatedTax),
      total
    };
  }

  /**
   * 할증 및 감면 계산
   */
  private calculateTaxAdjustments(calculatedTax: number) {
    const { taxAdjustments } = GIFT_TAX_2024;
    let totalAdjustment = 0;
    
    // 가족기업 감면
    let familyBusinessDiscount = 0;
    if (this.input.familyBusinessDiscount && this.input.giftType === 'business') {
      familyBusinessDiscount = Math.min(
        this.input.businessAsset * taxAdjustments.familyBusinessDeduction.generalRate,
        taxAdjustments.familyBusinessDeduction.maxDeduction
      );
    }
    
    // 농지 감면
    let farmLandDiscount = 0;
    if (this.input.farmLandDiscount) {
      farmLandDiscount = Math.min(
        calculatedTax * taxAdjustments.farmLandDiscount.selfCultivation,
        taxAdjustments.farmLandDiscount.maxDeduction
      );
    }
    
    // 문화재 감면
    let culturalAssetDiscount = 0;
    if (this.input.culturalAssetDiscount) {
      culturalAssetDiscount = calculatedTax * taxAdjustments.culturalAssetDiscount.generalRate;
    }
    
    // 창업자금 감면
    let startupDiscount = 0;
    if (this.input.startupDiscount && this.input.giftType === 'business') {
      startupDiscount = calculatedTax * taxAdjustments.startupDiscount.generalRate;
    }
    
    totalAdjustment = -(familyBusinessDiscount + farmLandDiscount + culturalAssetDiscount + startupDiscount);
    
    return {
      familyBusinessDiscount,
      farmLandDiscount,
      culturalAssetDiscount,
      startupDiscount,
      total: totalAdjustment
    };
  }

  /**
   * 신고 및 납부 기한 계산
   */
  private calculateDeadlines(totalTax: number) {
    const giftDate = new Date(this.input.giftDate);
    const filingDueDate = new Date(giftDate);
    filingDueDate.setMonth(filingDueDate.getMonth() + GIFT_TAX_2024.filingAndPayment.filingDeadline);
    
    const paymentDueDate = new Date(giftDate);
    paymentDueDate.setMonth(paymentDueDate.getMonth() + GIFT_TAX_2024.filingAndPayment.paymentDeadline);
    
    const installmentAvailable = totalTax >= GIFT_TAX_2024.filingAndPayment.installmentPayment.minimumTax;
    
    return {
      filingDueDate,
      paymentDueDate,
      installmentAvailable
    };
  }

  /**
   * 절세 조언 생성
   */
  private generateTaxSavingAdvice() {
    const advice = [];
    const { taxSavingStrategies } = GIFT_TAX_2024;
    
    // 연간 한도 활용 조언
    const relationDeduction = this.calculateRelationshipDeduction();
    if (this.input.giftAmount < relationDeduction.limit) {
      const remainingLimit = relationDeduction.limit - this.input.giftAmount;
      advice.push({
        type: '연간 한도 활용',
        description: `${relationDeduction.type} 한도를 ${remainingLimit.toLocaleString()}원 더 활용할 수 있습니다.`,
        expectedSaving: remainingLimit * 0.1 // 대략적인 절세액
      });
    }
    
    // 분할 증여 조언
    if (this.input.giftAmount > relationDeduction.limit * 2) {
      advice.push({
        type: '분할 증여',
        description: '큰 금액을 여러 해에 나누어 증여하면 누진세율 부담을 줄일 수 있습니다.',
        expectedSaving: this.input.giftAmount * 0.05
      });
    }
    
    // 혼인·교육비 증여 조언
    if (!this.input.marriageGift && this.input.recipientAge < 35) {
      advice.push({
        type: '혼인증여 활용',
        description: '혼인증여공제를 활용하면 추가 절세가 가능합니다.',
        expectedSaving: 100000000 * 0.1
      });
    }
    
    return advice;
  }

  /**
   * 한계세율 계산
   */
  private getMarginalTaxRate(taxableAmount: number): number {
    const rates = GIFT_TAX_2024.taxRates;
    
    for (const rate of rates) {
      if (taxableAmount >= rate.min && taxableAmount <= rate.max) {
        return rate.rate;
      }
    }
    
    return 0;
  }

  // 헬퍼 메서드들
  private generateCalculationSteps(gross: number, deductions: number, taxable: number, calculated: number, final: number) {
    return [
      { label: '총 증여재산', amount: gross, note: '모든 증여재산의 합계' },
      { label: '공제액 합계', amount: deductions, note: '관계별공제 + 특별공제' },
      { label: '과세표준', amount: taxable, note: '10년 합산 후 공제 적용' },
      { label: '산출세액', amount: calculated, note: '과세표준에 세율 적용' },
      { label: '최종 납부세액', amount: final, note: '산출세액 - 세액공제 + 할증감면' }
    ];
  }

  private getAppliedRates(taxableAmount: number) {
    const rates = GIFT_TAX_2024.taxRates;
    const appliedRates = [];
    let remainingAmount = taxableAmount;
    
    for (const rate of rates) {
      if (remainingAmount <= 0) break;
      
      const applicableAmount = Math.min(remainingAmount, rate.max - rate.min);
      if (applicableAmount > 0) {
        appliedRates.push({
          range: `${(rate.min / 10000).toLocaleString()}만원 ~ ${rate.max === Infinity ? '초과' : (rate.max / 10000).toLocaleString() + '만원'}`,
          rate: rate.rate,
          amount: applicableAmount * rate.rate
        });
      }
      
      remainingAmount -= applicableAmount;
    }
    
    return appliedRates;
  }

  private generateDeductionList(relationship: any, special: any) {
    const deductions = [];
    
    if (relationship.amount > 0) {
      deductions.push({
        type: 'relationship',
        label: relationship.type,
        amount: relationship.amount
      });
    }
    
    if (special.marriage > 0) {
      deductions.push({
        type: 'special',
        label: '혼인증여공제',
        amount: special.marriage
      });
    }
    
    if (special.education > 0) {
      deductions.push({
        type: 'special',
        label: '교육비공제',
        amount: special.education
      });
    }
    
    if (special.startup > 0) {
      deductions.push({
        type: 'special',
        label: '창업자금공제',
        amount: special.startup
      });
    }
    
    return deductions;
  }
}

/**
 * 증여세 입력값 검증 클래스
 */
export class GiftTaxInputValidator {
  static validate(input: GiftTaxInput): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // 기본 검증
    if (input.giftAmount < 0) {
      errors.giftAmount = '증여재산은 0원 이상이어야 합니다.';
    }

    if (input.donorAge < 0 || input.donorAge > 120) {
      errors.donorAge = '증여자 나이는 0세~120세 사이여야 합니다.';
    }

    if (input.recipientAge < 0 || input.recipientAge > 120) {
      errors.recipientAge = '수증자 나이는 0세~120세 사이여야 합니다.';
    }

    if (input.giftDate && new Date(input.giftDate) > new Date()) {
      errors.giftDate = '증여일은 현재 날짜보다 이전이어야 합니다.';
    }

    if (input.isConditionalGift && input.giftConditionValue >= input.giftAmount) {
      errors.giftConditionValue = '부담액은 증여액보다 작아야 합니다.';
    }

    return errors;
  }

  static validateAndApplyLimits(input: GiftTaxInput): GiftTaxInput {
    const validatedInput = { ...input };

    // 음수값 방지
    validatedInput.giftAmount = Math.max(0, validatedInput.giftAmount);
    validatedInput.donorAge = Math.max(0, Math.min(120, validatedInput.donorAge));
    validatedInput.recipientAge = Math.max(0, Math.min(120, validatedInput.recipientAge));
    validatedInput.giftConditionValue = Math.max(0, validatedInput.giftConditionValue);
    validatedInput.marriageGiftAmount = Math.max(0, validatedInput.marriageGiftAmount);
    validatedInput.educationGiftAmount = Math.max(0, validatedInput.educationGiftAmount);

    // 미성년자 여부 자동 설정
    validatedInput.isRecipientMinor = validatedInput.recipientAge < 19;

    return validatedInput;
  }
} 