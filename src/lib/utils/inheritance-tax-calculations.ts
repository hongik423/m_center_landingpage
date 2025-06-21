import { InheritanceTaxInput, InheritanceTaxResult } from '@/types/tax-calculator.types';
import { INHERITANCE_TAX_2024 } from '@/constants/tax-rates-2024';

/**
 * 상속세 계산기 클래스
 */
export class InheritanceTaxCalculator {
  private input: InheritanceTaxInput;

  constructor(input: InheritanceTaxInput) {
    this.input = input;
  }

  /**
   * 상속세 계산 메인 함수
   */
  calculate(): InheritanceTaxResult {
    try {
      // 1. 상속재산 가액 계산
      const grossInheritance = this.calculateGrossInheritance();
      
      // 2. 인적공제 계산
      const personalDeductions = this.calculatePersonalDeductions();
      
      // 3. 물적공제 계산
      const propertyDeductions = this.calculatePropertyDeductions();
      
      // 4. 일괄공제 계산 (선택적)
      const lumpSumDeduction = this.calculateLumpSumDeduction();
      
      // 5. 총 공제액 계산 (인적공제 + 물적공제 vs 일괄공제 중 유리한 것)
      const totalDeductionsRegular = personalDeductions.total + propertyDeductions.total;
      const totalDeductions = Math.max(totalDeductionsRegular, lumpSumDeduction);
      const useLumpSum = lumpSumDeduction > totalDeductionsRegular;
      
      // 6. 과세표준 계산
      const taxableInheritance = Math.max(0, grossInheritance - totalDeductions);
      
      // 7. 상속세 산출세액 계산
      const calculatedTax = this.calculateInheritanceTax(taxableInheritance);
      
      // 8. 세액공제 계산
      const taxCredits = this.calculateTaxCredits(calculatedTax);
      
      // 9. 할증 및 감면 계산
      const taxAdjustments = this.calculateTaxAdjustments(calculatedTax);
      
      // 10. 최종 세액 계산
      const determinedTax = Math.max(0, calculatedTax - taxCredits.total + taxAdjustments.total);
      
      // 11. 납부세액 계산
      const additionalPayment = Math.max(0, determinedTax - this.input.previousTaxPaid);
      const refundAmount = Math.max(0, this.input.previousTaxPaid - determinedTax);
      
      // 12. 세율 정보 계산
      const effectiveRate = grossInheritance > 0 ? (determinedTax / grossInheritance) : 0;
      const marginalRate = this.getMarginalTaxRate(taxableInheritance);
      
      // 13. 상속인별 분할 정보 계산
      const inheritanceDistribution = this.calculateInheritanceDistribution(grossInheritance, determinedTax);
      
      // 14. 납부일정 계산
      const paymentSchedule = this.calculatePaymentSchedule(determinedTax);
      
      // 15. 계산과정 상세
      const calculationBreakdown = {
        totalInheritance: grossInheritance,
        totalDeductions: totalDeductions,
        taxableBase: taxableInheritance,
        grossTax: calculatedTax,
        totalCredits: taxCredits.total,
        finalTax: determinedTax
      };

      return {
        // 기본 정보
        taxableAmount: taxableInheritance,
        calculatedTax: calculatedTax,
        localIncomeTax: 0, // 상속세는 지방세 없음
        totalTax: determinedTax,
        
        breakdown: {
          steps: this.generateCalculationSteps(grossInheritance, totalDeductions, taxableInheritance, calculatedTax, determinedTax),
          summary: {
            totalIncome: grossInheritance,
            totalDeductions: totalDeductions,
            taxableIncome: taxableInheritance,
            taxBeforeCredits: calculatedTax,
            taxCredits: taxCredits.total,
            finalTax: determinedTax
          }
        },
        
        appliedRates: this.getAppliedRates(taxableInheritance),
        deductions: this.generateDeductionList(personalDeductions, propertyDeductions, useLumpSum, lumpSumDeduction),
        
        // 상속세 특화 정보
        grossInheritance,
        inheritanceDeductions: totalDeductions,
        taxableInheritance,
        personalDeductions: useLumpSum ? this.getEmptyPersonalDeductions() : personalDeductions,
        propertyDeductions: useLumpSum ? this.getEmptyPropertyDeductions() : propertyDeductions,    
        lumpSumDeduction: useLumpSum ? lumpSumDeduction : 0,
        taxCredits,
        taxAdjustments,
        determinedTax,
        previousTaxPaid: this.input.previousTaxPaid,
        additionalPayment,
        refundAmount,
        effectiveRate,
        marginalRate,
        inheritanceDistribution,
        paymentSchedule,
        calculationBreakdown
      };
      
    } catch (error) {
      console.error('상속세 계산 중 오류 발생:', error);
      throw new Error('상속세 계산에 실패했습니다.');
    }
  }

  /**
   * 상속재산 가액 계산
   */
  private calculateGrossInheritance(): number {
    const totalAssets = this.input.totalInheritance + 
                       this.input.giftWithin10Years + 
                       this.input.premaritalGift + 
                       this.input.businessInheritance + 
                       this.input.nonResidentInheritance;
    
    return Math.max(0, totalAssets - this.input.debtLiabilities);
  }

  /**
   * 인적공제 계산
   */
  private calculatePersonalDeductions() {
    const { personalDeductions } = INHERITANCE_TAX_2024;
    
    // 기초공제 (2억원)
    const basic = personalDeductions.basic;
    
    // 배우자공제 계산
    let spouse = 0;
    if (this.input.spouse) {
      const legalShare = this.calculateSpouseLegalShare();
      spouse = Math.max(personalDeductions.spouse, legalShare);
    }
    
    // 자녀공제 (5천만원 × 인원)
    const children = this.input.children * personalDeductions.children;
    
    // 미성년자공제 (1천만원 × 미성년 연수)
    const minorChildren = this.calculateMinorChildrenDeduction();
    
    // 장애인공제 (1천만원 × 기대여명)
    const disabled = this.calculateDisabledDeduction();
    
    // 65세 이상 공제 (5백만원 × 인원)
    const elderly = this.input.elderlyHeirs * personalDeductions.elderly;
    
    const total = basic + spouse + children + minorChildren + disabled + elderly;
    
    return {
      basic,
      spouse,
      children,
      minorChildren,
      disabled,
      elderly,
      total
    };
  }

  /**
   * 물적공제 계산
   */
  private calculatePropertyDeductions() {
    const { propertyDeductions } = INHERITANCE_TAX_2024;
    
    // 장례비용 (5백만원 한도)
    const funeralExpenses = Math.min(this.input.funeralExpenses, propertyDeductions.funeralExpenses);
    
    // 채무공제
    const debts = this.input.debtLiabilities;
    
    // 공익사업용재산 등 (전액공제)
    const charityDonation = 0; // 입력에서 받을 수 있도록 확장 가능
    
    const total = funeralExpenses + debts + charityDonation;
    
    return {
      funeralExpenses,
      debts,
      charityDonation,
      total
    };
  }

  /**
   * 일괄공제 계산 (5억원 한도)
   */
  private calculateLumpSumDeduction(): number {
    return INHERITANCE_TAX_2024.propertyDeductions.lumpSumDeduction;
  }

  /**
   * 상속세 산출세액 계산
   */
  private calculateInheritanceTax(taxableAmount: number): number {
    const rates = INHERITANCE_TAX_2024.taxRates;
    
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
    // 증여세액공제 (10년 내 증여세)
    const giftTaxCredit = this.input.giftWithin10Years * INHERITANCE_TAX_2024.giftTaxCredit.within10Years;
    
    // 외국납부세액공제
    const foreignTaxCredit = this.input.nonResidentInheritance * 0.1; // 임시 계산
    
    // 기타 세액공제
    const taxDeferred = 0;
    
    const total = Math.min(calculatedTax, giftTaxCredit + foreignTaxCredit + taxDeferred);
    
    return {
      giftTaxCredit: Math.min(giftTaxCredit, calculatedTax),
      foreignTaxCredit: Math.min(foreignTaxCredit, calculatedTax),
      taxDeferred,
      total
    };
  }

  /**
   * 할증 및 감면 계산
   */
  private calculateTaxAdjustments(calculatedTax: number) {
    const { taxAdjustments } = INHERITANCE_TAX_2024;
    let totalAdjustment = 0;
    
    // 신속상속공제 (음수로 처리 - 공제)
    const rapidInheritanceDiscount = 0;
    // 실제로는 신고일자를 기준으로 계산해야 함
    
    // 문화재 감면
    let culturalAssetDiscount = 0;
    if (this.input.culturalAssetDiscount) {
      culturalAssetDiscount = calculatedTax * taxAdjustments.culturalAssetDiscount.generalRate;
    }
    
    // 농지 감면
    let farmLandDiscount = 0;
    if (this.input.farmLandDiscount) {
      farmLandDiscount = Math.min(
        calculatedTax * taxAdjustments.farmLandDiscount.selfCultivation,
        taxAdjustments.farmLandDiscount.maxDeduction
      );
    }
    
    // 가족기업 감면
    let familyBusinessDiscount = 0;
    if (this.input.familyBusinessDiscount) {
      familyBusinessDiscount = Math.min(
        this.input.businessInheritance * taxAdjustments.familyBusinessDeduction.generalRate,
        taxAdjustments.familyBusinessDeduction.maxDeduction
      );
    }
    
    totalAdjustment = -(rapidInheritanceDiscount + culturalAssetDiscount + farmLandDiscount + familyBusinessDiscount);
    
    return {
      rapidInheritanceDiscount,
      culturalAssetDiscount,
      farmLandDiscount,
      familyBusinessDiscount,
      total: totalAdjustment
    };
  }

  /**
   * 배우자 법정상속분 계산
   */
  private calculateSpouseLegalShare(): number {
    const grossInheritance = this.calculateGrossInheritance();
    const { spouseInheritanceDeduction } = INHERITANCE_TAX_2024;
    
    let ratio = spouseInheritanceDeduction.legalShareRatio.alone;
    
    if (this.input.children > 0) {
      ratio = spouseInheritanceDeduction.legalShareRatio.withChildren;
    }
    // 부모나 형제자매가 있는 경우의 로직도 추가 가능
    
    return grossInheritance * ratio;
  }

  /**
   * 미성년자공제 계산
   */
  private calculateMinorChildrenDeduction(): number {
    if (this.input.minorChildren === 0) return 0;
    
    const { personalDeductions } = INHERITANCE_TAX_2024;
    // 19세까지를 미성년으로 가정 (실제로는 각 자녀의 나이를 받아야 함)
    const averageRemainingYears = 10; // 임시값
    
    return this.input.minorChildren * personalDeductions.minorChildren * averageRemainingYears;
  }

  /**
   * 장애인공제 계산
   */
  private calculateDisabledDeduction(): number {
    if (this.input.disabledHeirs === 0) return 0;
    
    const { personalDeductions } = INHERITANCE_TAX_2024;
    // 기대여명을 75세로 가정 (실제로는 통계청 기대여명 테이블 사용)
    const averageLifeExpectancy = 75;
    const averageAge = 40; // 임시값
    const remainingYears = Math.max(1, averageLifeExpectancy - averageAge);
    
    return this.input.disabledHeirs * personalDeductions.disabled * remainingYears;
  }

  /**
   * 한계세율 계산
   */
  private getMarginalTaxRate(taxableAmount: number): number {
    const rates = INHERITANCE_TAX_2024.taxRates;
    
    for (const rate of rates) {
      if (taxableAmount >= rate.min && taxableAmount <= rate.max) {
        return rate.rate;
      }
    }
    
    return 0;
  }

  /**
   * 상속인별 분할 정보 계산
   */
  private calculateInheritanceDistribution(grossInheritance: number, totalTax: number) {
    const distribution = [];
    const ratio = this.input.inheritanceRatio;
    
    if (this.input.spouse) {
      distribution.push({
        heir: '배우자',
        ratio: ratio,
        inheritedAmount: grossInheritance * ratio,
        taxAmount: totalTax * ratio
      });
    }
    
    if (this.input.children > 0) {
      const childrenRatio = (1 - ratio) / this.input.children;
      for (let i = 1; i <= this.input.children; i++) {
        distribution.push({
          heir: `자녀${i}`,
          ratio: childrenRatio,
          inheritedAmount: grossInheritance * childrenRatio,
          taxAmount: totalTax * childrenRatio
        });
      }
    }
    
    return distribution;
  }

  /**
   * 납부일정 계산
   */
  private calculatePaymentSchedule(totalTax: number) {
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + INHERITANCE_TAX_2024.taxObligations.filingDeadline);
    
    const installmentAvailable = totalTax >= INHERITANCE_TAX_2024.taxObligations.installmentPayment.minimumTax;
    const deferralAvailable = this.input.taxDeferralRequest;
    
    let installmentPlan = undefined;
    if (installmentAvailable && this.input.installmentPayment) {
      installmentPlan = [];
      const installmentAmount = totalTax / INHERITANCE_TAX_2024.taxObligations.installmentPayment.maxInstallments;
      
      for (let i = 1; i <= INHERITANCE_TAX_2024.taxObligations.installmentPayment.maxInstallments; i++) {
        const installmentDate = new Date(dueDate);
        installmentDate.setMonth(installmentDate.getMonth() + (i - 1) * 2);
        
        installmentPlan.push({
          installment: i,
          dueDate: installmentDate,
          amount: installmentAmount
        });
      }
    }
    
    return {
      dueDate,
      installmentAvailable,
      deferralAvailable,
      installmentPlan
    };
  }

  // 헬퍼 메서드들
  private generateCalculationSteps(gross: number, deductions: number, taxable: number, calculated: number, final: number) {
    return [
      { label: '총 상속재산', amount: gross, note: '모든 상속재산의 합계' },
      { label: '공제액 합계', amount: deductions, note: '인적공제 + 물적공제 (또는 일괄공제)' },
      { label: '과세표준', amount: taxable, note: '총 상속재산 - 공제액' },
      { label: '산출세액', amount: calculated, note: '과세표준에 세율 적용' },
      { label: '최종 납부세액', amount: final, note: '산출세액 - 세액공제 + 할증감면' }
    ];
  }

  private getAppliedRates(taxableAmount: number) {
    const rates = INHERITANCE_TAX_2024.taxRates;
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

  private generateDeductionList(personal: any, property: any, useLumpSum: boolean, lumpSum: number) {
    const deductions = [];
    
    if (useLumpSum) {
      deductions.push({
        type: 'lumpSum',
        label: '일괄공제',
        amount: lumpSum
      });
    } else {
      if (personal.basic > 0) {
        deductions.push({ type: 'personal', label: '기초공제', amount: personal.basic });
      }
      if (personal.spouse > 0) {
        deductions.push({ type: 'personal', label: '배우자공제', amount: personal.spouse });
      }
      if (personal.children > 0) {
        deductions.push({ type: 'personal', label: '자녀공제', amount: personal.children });
      }
      if (personal.minorChildren > 0) {
        deductions.push({ type: 'personal', label: '미성년자공제', amount: personal.minorChildren });
      }
      if (personal.disabled > 0) {
        deductions.push({ type: 'personal', label: '장애인공제', amount: personal.disabled });
      }
      if (personal.elderly > 0) {
        deductions.push({ type: 'personal', label: '65세이상공제', amount: personal.elderly });
      }
      if (property.funeralExpenses > 0) {
        deductions.push({ type: 'property', label: '장례비공제', amount: property.funeralExpenses });
      }
      if (property.debts > 0) {
        deductions.push({ type: 'property', label: '채무공제', amount: property.debts });
      }
    }
    
    return deductions;
  }

  private getEmptyPersonalDeductions() {
    return {
      basic: 0,
      spouse: 0,
      children: 0,
      minorChildren: 0,
      disabled: 0,
      elderly: 0,
      total: 0
    };
  }

  private getEmptyPropertyDeductions() {
    return {
      funeralExpenses: 0,
      debts: 0,
      charityDonation: 0,
      total: 0
    };
  }
}

/**
 * 상속세 입력값 검증 클래스
 */
export class InheritanceTaxInputValidator {
  static validate(input: InheritanceTaxInput): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    // 기본 검증
    if (input.totalInheritance < 0) {
      errors.totalInheritance = '상속재산은 0원 이상이어야 합니다.';
    }

    if (input.debtLiabilities < 0) {
      errors.debtLiabilities = '채무는 0원 이상이어야 합니다.';
    }

    if (input.funeralExpenses < 0) {
      errors.funeralExpenses = '장례비용은 0원 이상이어야 합니다.';
    }

    if (input.funeralExpenses > INHERITANCE_TAX_2024.propertyDeductions.funeralExpenses) {
      errors.funeralExpenses = `장례비용은 ${(INHERITANCE_TAX_2024.propertyDeductions.funeralExpenses / 10000).toLocaleString()}만원을 초과할 수 없습니다.`;
    }

    if (input.children < 0) {
      errors.children = '자녀 수는 0명 이상이어야 합니다.';
    }

    if (input.minorChildren > input.children) {
      errors.minorChildren = '미성년자 자녀 수는 전체 자녀 수를 초과할 수 없습니다.';
    }

    if (input.inheritanceRatio < 0 || input.inheritanceRatio > 1) {
      errors.inheritanceRatio = '상속비율은 0과 1 사이의 값이어야 합니다.';
    }

    return errors;
  }

  static validateAndApplyLimits(input: InheritanceTaxInput): InheritanceTaxInput {
    const validatedInput = { ...input };

    // 장례비용 한도 적용
    validatedInput.funeralExpenses = Math.min(
      validatedInput.funeralExpenses,
      INHERITANCE_TAX_2024.propertyDeductions.funeralExpenses
    );

    // 음수값 방지
    validatedInput.totalInheritance = Math.max(0, validatedInput.totalInheritance);
    validatedInput.debtLiabilities = Math.max(0, validatedInput.debtLiabilities);
    validatedInput.funeralExpenses = Math.max(0, validatedInput.funeralExpenses);
    validatedInput.children = Math.max(0, validatedInput.children);
    validatedInput.minorChildren = Math.max(0, Math.min(validatedInput.minorChildren, validatedInput.children));
    validatedInput.disabledHeirs = Math.max(0, validatedInput.disabledHeirs);
    validatedInput.elderlyHeirs = Math.max(0, validatedInput.elderlyHeirs);

    // 상속비율 제한
    validatedInput.inheritanceRatio = Math.max(0, Math.min(1, validatedInput.inheritanceRatio));

    return validatedInput;
  }
} 