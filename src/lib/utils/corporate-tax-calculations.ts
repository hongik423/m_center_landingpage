import { 
  CorporateTaxInput, 
  CorporateTaxResult, 
  CorporateTaxValidation,
  SmallBusinessCriteria 
} from '@/types/tax-calculator.types';
import { 
  CORPORATE_TAX_2024, 
  CORPORATE_TAX_LIMITS_2024 
} from '@/constants/tax-rates-2024';

// 법인세 계산 클래스
export class CorporateTaxCalculator {
  private input: CorporateTaxInput;

  constructor(input: CorporateTaxInput) {
    this.input = input;
  }

  // 메인 계산 함수
  calculate(): CorporateTaxResult {
    // 1. 소득 계산
    const grossIncome = this.calculateGrossIncome();
    const totalExpenses = this.calculateTotalExpenses();
    const taxableIncome = this.calculateTaxableIncome(grossIncome, totalExpenses);
    
    // 2. 중소기업 판정
    const smallBusinessCheck = this.checkSmallBusiness();
    
    // 3. 세액 계산
    const taxBeforeCredits = this.calculateBasicTax(taxableIncome, smallBusinessCheck.isSmallBusiness);
    const taxCredits = this.calculateTaxCredits(smallBusinessCheck.isSmallBusiness);
    const finalTax = Math.max(0, taxBeforeCredits - taxCredits.totalCredits);
    
    // 4. 지방소득세 및 기타 계산
    const localIncomeTax = Math.floor(finalTax * 0.1);
    const totalTax = finalTax + localIncomeTax;
    const interimPayment = this.calculateInterimPayment();
    const finalPayment = Math.max(0, totalTax - interimPayment);
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) : 0;
    
    // 5. 절세 조언 생성
    const taxSavingAdvice = this.generateTaxSavingAdvice(smallBusinessCheck.isSmallBusiness);
    
    // 6. 신고 정보
    const filingInfo = this.getFilingInfo(finalTax);

    return {
      grossIncome,
      totalExpenses,
      taxableIncome,
      adjustedIncome: taxableIncome,
      isSmallBusiness: smallBusinessCheck.isSmallBusiness,
      smallBusinessCriteria: smallBusinessCheck.smallBusinessCriteria,
      taxBeforeCredits,
      taxCredits,
      finalTax,
      localIncomeTax,
      totalTax,
      interimPayment,
      finalPayment,
      effectiveRate,
      taxSavingAdvice,
      filingInfo
    };
  }

  // 총수입금액 계산
  private calculateGrossIncome(): number {
    return this.input.revenue + 
           this.input.nonOperatingIncome + 
           this.input.specialIncome;
  }

  // 총비용 계산
  private calculateTotalExpenses(): number {
    return this.input.operatingExpenses + 
           this.input.nonOperatingExpenses + 
           this.input.specialExpenses;
  }

  // 과세표준 계산
  private calculateTaxableIncome(grossIncome: number, totalExpenses: number): number {
    const beforeLossOffset = grossIncome - totalExpenses;
    const afterLossOffset = Math.max(0, beforeLossOffset - this.input.carryForwardLoss);
    return Math.max(0, afterLossOffset);
  }

  // 중소기업 판정
  private checkSmallBusiness(): {
    isSmallBusiness: boolean;
    smallBusinessCriteria: {
      salesCheck: boolean;
      assetCheck: boolean;
      employeeCheck: boolean;
    };
  } {
    const criteria = CORPORATE_TAX_2024.smallBusinessCriteria;
    
    // 업종별 매출액 기준
    const salesLimit = criteria.salesCriteria[this.input.businessType as keyof typeof criteria.salesCriteria] || 
                      criteria.salesCriteria.other;
    const salesCheck = this.input.revenue <= salesLimit;
    
    // 자산총액 기준
    const assetCheck = this.input.totalAssets <= criteria.assetCriteria;
    
    // 업종별 직원수 기준
    const employeeLimit = criteria.employeeCriteria[this.input.businessType as keyof typeof criteria.employeeCriteria] || 
                         criteria.employeeCriteria.other;
    const employeeCheck = this.input.numberOfEmployees <= employeeLimit;
    
    // 모든 기준을 충족해야 중소기업
    const isSmallBusiness = salesCheck && assetCheck && employeeCheck;

    return {
      isSmallBusiness,
      smallBusinessCriteria: {
        salesCheck,
        assetCheck,
        employeeCheck
      }
    };
  }

  // 기본 법인세 계산
  private calculateBasicTax(taxableIncome: number, isSmallBusiness: boolean): number {
    if (taxableIncome <= 0) return 0;
    
    const rates = isSmallBusiness ? 
      CORPORATE_TAX_2024.smallBusinessRates : 
      CORPORATE_TAX_2024.taxRates;
    
    let tax = 0;
    let remainingIncome = taxableIncome;
    
    for (const bracket of rates) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, bracket.max - bracket.min);
      tax += bracketIncome * bracket.rate;
      remainingIncome -= bracketIncome;
      
      if (remainingIncome <= 0) break;
    }
    
    return Math.floor(tax);
  }

  // 세액공제 계산
  private calculateTaxCredits(isSmallBusiness: boolean): {
    rdCredit: number;
    equipmentCredit: number;
    employmentCredit: number;
    startupCredit: number;
    foreignCredit: number;
    totalCredits: number;
  } {
    const credits = CORPORATE_TAX_2024.taxCredits;
    
    // 연구개발비 세액공제
    const rdCredit = this.calculateRDCredit(credits, isSmallBusiness);
    
    // 설비투자 세액공제
    const equipmentCredit = this.calculateEquipmentCredit(credits, isSmallBusiness);
    
    // 고용증대 세액공제
    const employmentCredit = this.calculateEmploymentCredit(credits);
    
    // 창업기업 세액공제
    const startupCredit = this.calculateStartupCredit(credits, isSmallBusiness);
    
    // 외국납부세액공제
    const foreignCredit = Math.min(this.input.foreignTaxCredit, this.input.previousYearTax);
    
    const totalCredits = rdCredit + equipmentCredit + employmentCredit + startupCredit + foreignCredit;
    
    return {
      rdCredit,
      equipmentCredit,
      employmentCredit,
      startupCredit,
      foreignCredit,
      totalCredits
    };
  }

  // 연구개발비 세액공제 계산
  private calculateRDCredit(credits: any, isSmallBusiness: boolean): number {
    if (this.input.rdExpenses <= 0) return 0;
    
    const rdConfig = isSmallBusiness ? credits.rdCredit.smallBusiness : credits.rdCredit.largeBusiness;
    const credit = this.input.rdExpenses * rdConfig.generalRate;
    
    return Math.min(credit, rdConfig.maxCredit);
  }

  // 설비투자 세액공제 계산
  private calculateEquipmentCredit(credits: any, isSmallBusiness: boolean): number {
    if (this.input.equipmentInvestment <= 0) return 0;
    
    const equipConfig = isSmallBusiness ? credits.equipmentCredit.smallBusiness : credits.equipmentCredit.largeBusiness;
    
    let rate = equipConfig.generalRate;
    
    // 설비 종류에 따른 세율 조정
    switch (this.input.equipmentType) {
      case 'safety':
        rate = equipConfig.safetyRate;
        break;
      case 'environment':
        rate = equipConfig.environmentRate;
        break;
      case 'energy':
        rate = equipConfig.energyRate;
        break;
    }
    
    return Math.floor(this.input.equipmentInvestment * rate);
  }

  // 고용증대 세액공제 계산
  private calculateEmploymentCredit(credits: any): number {
    const empConfig = credits.employmentCredit.regularEmployee;
    
    let credit = 0;
    credit += this.input.youngEmployees * empConfig.young;
    credit += this.input.disabledEmployees * empConfig.disabled;
    credit += Math.max(0, this.input.employmentIncrease - this.input.youngEmployees - this.input.disabledEmployees) * empConfig.general;
    
    return credit;
  }

  // 창업기업 세액공제 계산
  private calculateStartupCredit(credits: any, isSmallBusiness: boolean): number {
    if (!this.input.isStartup || !isSmallBusiness) return 0;
    if (this.input.startupYears > credits.startupCredit.smallBusiness.period) return 0;
    
    const startupConfig = credits.startupCredit.smallBusiness;
    const credit = this.input.previousYearTax * startupConfig.rate;
    
    return Math.min(credit, startupConfig.maxCredit);
  }

  // 중간예납 계산
  private calculateInterimPayment(): number {
    const config = CORPORATE_TAX_2024.filing.interimPayment;
    const interimTax = this.input.previousYearTax * config.rate;
    
    if (interimTax < config.exemptionThreshold) return 0;
    
    return Math.max(interimTax, config.minimumTax);
  }

  // 신고 정보 생성
  private getFilingInfo(finalTax: number): {
    filingDeadline: string;
    interimDeadline: string;
    canInstallment: boolean;
    maxInstallments: number;
  } {
    const filing = CORPORATE_TAX_2024.filing;
    const fiscalYearEnd = new Date(this.input.fiscalYearEnd);
    
    // 신고기한 (사업연도 종료일로부터 3개월)
    const filingDeadline = new Date(fiscalYearEnd);
    filingDeadline.setMonth(filingDeadline.getMonth() + filing.filingDeadline.annual);
    
    // 중간예납 기한 (사업연도 시작일로부터 6개월)
    const interimDeadline = new Date(fiscalYearEnd);
    interimDeadline.setMonth(interimDeadline.getMonth() - 6);
    
    const canInstallment = finalTax >= filing.payment.installment.minimumTax;
    
    return {
      filingDeadline: filingDeadline.toLocaleDateString('ko-KR'),
      interimDeadline: interimDeadline.toLocaleDateString('ko-KR'),
      canInstallment,
      maxInstallments: filing.payment.installment.maxInstallments
    };
  }

  // 절세 조언 생성
  private generateTaxSavingAdvice(isSmallBusiness: boolean): Array<{
    type: string;
    description: string;
    expectedSaving: number;
  }> {
    const advice = [];
    
    // 중소기업 혜택 조언
    if (!isSmallBusiness) {
      const potentialSaving = this.estimateSmallBusinessSaving();
      if (potentialSaving > 0) {
        advice.push({
          type: "중소기업 요건 검토",
          description: "중소기업 요건을 충족하면 더 낮은 세율과 다양한 세액공제 혜택을 받을 수 있습니다.",
          expectedSaving: potentialSaving
        });
      }
    }
    
    // 연구개발비 세액공제 조언
    if (this.input.rdExpenses < this.input.revenue * 0.05) {
      advice.push({
        type: "연구개발비 투자 확대",
        description: "연구개발비 투자를 확대하면 30~40%의 세액공제 혜택을 받을 수 있습니다.",
        expectedSaving: this.input.revenue * 0.05 * (isSmallBusiness ? 0.3 : 0.2)
      });
    }
    
    // 고용증대 세액공제 조언
    if (this.input.employmentIncrease === 0) {
      advice.push({
        type: "고용증대 세액공제",
        description: "청년·장애인 등 취업취약계층을 고용하면 1인당 최대 180만원의 세액공제를 받을 수 있습니다.",
        expectedSaving: 1800000
      });
    }
    
    // 결손금 이월 조언
    if (this.input.carryForwardLoss === 0 && this.input.revenue > 0) {
      advice.push({
        type: "결손금 관리",
        description: "과거 결손금이 있다면 10년간 이월하여 소득과 상계할 수 있습니다.",
        expectedSaving: 0
      });
    }

    return advice;
  }

  // 중소기업 세율 적용 시 절세액 추정
  private estimateSmallBusinessSaving(): number {
    const grossIncome = this.calculateGrossIncome();
    const totalExpenses = this.calculateTotalExpenses();
    const taxableIncome = this.calculateTaxableIncome(grossIncome, totalExpenses);
    
    const currentTax = this.calculateBasicTax(taxableIncome, false);
    const smallBusinessTax = this.calculateBasicTax(taxableIncome, true);
    
    return Math.max(0, currentTax - smallBusinessTax);
  }
}

// 입력값 검증 클래스
export class CorporateTaxInputValidator {
  static validate(input: CorporateTaxInput): CorporateTaxValidation {
    const errors: { [key: string]: string } = {};
    const warnings: { [key: string]: string } = {};
    
    // 필수 입력값 검증
    if (!input.companyName?.trim()) {
      errors.companyName = "회사명을 입력해주세요.";
    }
    
    if (!input.businessType) {
      errors.businessType = "업종을 선택해주세요.";
    }
    
    if (input.revenue < 0) {
      errors.revenue = "매출액은 0 이상이어야 합니다.";
    }
    
    if (input.revenue > CORPORATE_TAX_LIMITS_2024.maxRevenue) {
      errors.revenue = `매출액이 한도(${CORPORATE_TAX_LIMITS_2024.maxRevenue.toLocaleString()}원)를 초과했습니다.`;
    }
    
    if (input.operatingExpenses < 0) {
      errors.operatingExpenses = "영업비용은 0 이상이어야 합니다.";
    }
    
    if (input.totalAssets < 0) {
      errors.totalAssets = "자산총액은 0 이상이어야 합니다.";
    }
    
    if (input.numberOfEmployees < 0) {
      errors.numberOfEmployees = "직원수는 0 이상이어야 합니다.";
    }
    
    if (input.numberOfEmployees > CORPORATE_TAX_LIMITS_2024.maxEmployees) {
      warnings.numberOfEmployees = "직원수가 매우 많습니다. 입력값을 확인해주세요.";
    }
    
    // 논리적 검증
    if (input.operatingExpenses > input.revenue * 2) {
      warnings.operatingExpenses = "영업비용이 매출액 대비 매우 높습니다. 입력값을 확인해주세요.";
    }
    
    if (input.rdExpenses > input.revenue * 0.3) {
      warnings.rdExpenses = "연구개발비가 매출액 대비 매우 높습니다. 입력값을 확인해주세요.";
    }
    
    // 날짜 검증
    if (input.establishmentDate) {
      const estDate = new Date(input.establishmentDate);
      const now = new Date();
      if (estDate > now) {
        errors.establishmentDate = "설립일은 현재 날짜보다 이전이어야 합니다.";
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }

  // 입력값에 한도 적용
  static validateAndApplyLimits(input: CorporateTaxInput): CorporateTaxInput {
    const limits = CORPORATE_TAX_LIMITS_2024;
    
    return {
      ...input,
      revenue: Math.min(Math.max(0, input.revenue), limits.maxRevenue),
      operatingExpenses: Math.min(Math.max(0, input.operatingExpenses), limits.maxExpense),
      totalAssets: Math.min(Math.max(0, input.totalAssets), limits.maxAssets),
      numberOfEmployees: Math.min(Math.max(0, input.numberOfEmployees), limits.maxEmployees),
      rdExpenses: Math.max(0, input.rdExpenses),
      equipmentInvestment: Math.max(0, input.equipmentInvestment),
      carryForwardLoss: Math.max(0, input.carryForwardLoss),
      charitableDonation: Math.max(0, input.charitableDonation),
      foreignTaxCredit: Math.max(0, input.foreignTaxCredit),
      startupYears: Math.min(Math.max(0, input.startupYears), 10)
    };
  }
} 