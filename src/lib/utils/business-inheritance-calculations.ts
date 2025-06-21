import { 
  BusinessInheritanceInput, 
  BusinessInheritanceResult, 
  EligibilityCheck, 
  RequirementCheck,
  ManagementPlan,
  PenaltyRisk,
  InstallmentPlan,
  CalculationBreakdown,
  CalculationStep,
  AppliedRate,
  Deduction,
  Warning,
  ManagementObligation,
  ManagementTimeline,
  PracticalChecklist,
  ChecklistItem,
  DocumentCategory,
  RequiredDocument
} from '@/types/tax-calculator.types';
import { INHERITANCE_TAX_RATES } from '@/constants/tax-rates-2024';

// 가업상속세 계산기 클래스 (고도화)
export class BusinessInheritanceCalculator {
  
  /**
   * 실무 체크리스트 생성
   */
  static generatePracticalChecklist(input: BusinessInheritanceInput): PracticalChecklist {
    return {
      preApplication: this.getPreApplicationChecklist(input),
      duringApplication: this.getDuringApplicationChecklist(input),
      postApplication: this.getPostApplicationChecklist(input),
      requiredDocuments: this.getRequiredDocuments(input)
    };
  }

  /**
   * 신청 전 체크리스트
   */
  private static getPreApplicationChecklist(input: BusinessInheritanceInput): ChecklistItem[] {
    const checklist: ChecklistItem[] = [
      {
        id: 'business_period',
        category: '기본요건',
        item: '피상속인의 해당 업종 영위 기간 3년 이상 확인',
        required: true,
        completed: input.businessPeriod >= 3,
        note: `현재 업력: ${input.businessPeriod}년`,
        deadline: '상속개시 전'
      },
      {
        id: 'business_classification',
        category: '기본요건',
        item: '중소기업 또는 중견기업 해당 여부 확인',
        required: true,
        completed: true,
        note: `현재 구분: ${input.businessType === 'small' ? '중소기업' : '중견기업'}`,
        deadline: '상속개시 전'
      },
      {
        id: 'asset_valuation',
        category: '재산평가',
        item: '가업용 자산 정확한 평가 완료',
        required: true,
        completed: input.businessAssetValue > 0,
        note: '세무사, 공인회계사 등 전문가 평가 권장',
        deadline: '신고 전'
      },
      {
        id: 'employee_status',
        category: '고용현황',
        item: '종업원 현황 정리 (4대보험 가입자 기준)',
        required: input.employeeCount >= 10,
        completed: input.employeeCount > 0,
        note: `현재 종업원 수: ${input.employeeCount}명`,
        deadline: '신고 전'
      },
      {
        id: 'financial_statements',
        category: '재무현황',
        item: '최근 3년간 재무제표 준비',
        required: true,
        completed: false,
        note: '매출액, 자산규모 확인용',
        deadline: '신고 전'
      }
    ];

    // 조건부 체크리스트 추가
    if (input.employeeCount >= 10) {
      checklist.push({
        id: 'employment_plan',
        category: '고용계획',
        item: '고용유지계획서 작성',
        required: true,
        completed: input.employmentMaintenance,
        note: '종업원 10명 이상 시 필수',
        deadline: '신고 시'
      });
    }

    return checklist;
  }

  /**
   * 신고 중 체크리스트
   */
  private static getDuringApplicationChecklist(input: BusinessInheritanceInput): ChecklistItem[] {
    return [
      {
        id: 'inheritance_tax_return',
        category: '신고서류',
        item: '상속세 과세표준신고 및 자진납부계산서 작성',
        required: true,
        completed: false,
        deadline: '상속개시일로부터 6개월'
      },
      {
        id: 'business_deduction_form',
        category: '신고서류',
        item: '가업상속재산 상속세 과세가액 불산입 신고서 작성',
        required: true,
        completed: false,
        deadline: '상속개시일로부터 6개월'
      },
      {
        id: 'management_plan',
        category: '사후관리',
        item: '사후관리계획서 제출',
        required: true,
        completed: input.continuousManagement,
        note: '10년간 계속경영 의무',
        deadline: '상속개시일로부터 6개월'
      },
      {
        id: 'asset_verification',
        category: '재산확인',
        item: '가업용 자산 명세서 작성 및 증빙서류 첨부',
        required: true,
        completed: false,
        deadline: '신고 시'
      }
    ];
  }

  /**
   * 신고 후 체크리스트
   */
  private static getPostApplicationChecklist(input: BusinessInheritanceInput): ChecklistItem[] {
    const checklist: ChecklistItem[] = [
      {
        id: 'management_report_1',
        category: '사후관리',
        item: '1차년도 사후관리신고서 제출',
        required: true,
        completed: false,
        deadline: '상속개시일이 속하는 연도의 다음연도 3월 31일'
      },
      {
        id: 'business_continuation',
        category: '사후관리',
        item: '계속경영 의무 이행 확인',
        required: true,
        completed: false,
        note: '10년간 지속',
        deadline: '매년'
      }
    ];

    if (input.employeeCount >= 10) {
      checklist.push({
        id: 'employment_maintenance',
        category: '고용유지',
        item: '고용유지 의무 이행 확인',
        required: true,
        completed: false,
        note: `최소 ${Math.floor(input.employeeCount * 0.8)}명 이상 유지`,
        deadline: '매년'
      });
    }

    return checklist;
  }

  /**
   * 필요서류 목록
   */
  private static getRequiredDocuments(input: BusinessInheritanceInput): DocumentCategory[] {
    const categories: DocumentCategory[] = [
      {
        category: '기본서류',
        documents: [
          {
            name: '상속세 과세표준신고 및 자진납부계산서',
            purpose: '상속세 신고',
            issuer: '납세자 작성',
            required: true
          },
          {
            name: '가업상속재산 상속세 과세가액 불산입 신고서',
            purpose: '가업상속공제 신청',
            issuer: '납세자 작성',
            required: true
          },
          {
            name: '사후관리계획서',
            purpose: '사후관리 의무 확약',
            issuer: '납세자 작성',
            required: true
          }
        ]
      },
      {
        category: '가업 관련 서류',
        documents: [
          {
            name: '사업자등록증',
            purpose: '사업체 확인',
            issuer: '세무서',
            required: true
          },
          {
            name: '법인등기부등본 또는 개인사업자 확인서류',
            purpose: '법적 지위 확인',
            issuer: '법원 또는 세무서',
            validityPeriod: '3개월',
            required: true
          },
          {
            name: '최근 3년간 재무제표',
            purpose: '사업 규모 확인',
            issuer: '회계법인 또는 세무사',
            required: true
          },
          {
            name: '4대보험 가입자명부',
            purpose: '종업원 수 확인',
            issuer: '4대보험공단',
            validityPeriod: '1개월',
            required: input.employeeCount >= 10
          }
        ]
      },
      {
        category: '재산평가 서류',
        documents: [
          {
            name: '부동산 등기부등본',
            purpose: '부동산 소유권 확인',
            issuer: '법원',
            validityPeriod: '3개월',
            required: true
          },
          {
            name: '감정평가서',
            purpose: '자산 가치 평가',
            issuer: '감정평가법인',
            validityPeriod: '6개월',
            required: true
          },
          {
            name: '기계장비 명세서',
            purpose: '사업용 자산 확인',
            issuer: '납세자 작성',
            required: true
          }
        ]
      }
    ];

    // 조건부 서류 추가
    if (input.employeeCount >= 10) {
      categories[1].documents.push({
        name: '고용유지계획서',
        purpose: '고용 유지 의무 확약',
        issuer: '납세자 작성',
        required: true
      });
    }

    return categories;
  }
  /**
   * 가업상속세 계산 메인 함수
   */
  static calculate(input: BusinessInheritanceInput): BusinessInheritanceResult {
    // 1단계: 기본 상속세 계산
    const basicInheritanceResult = this.calculateBasicInheritance(input);
    
    // 2단계: 가업상속공제 적격성 검토
    const eligibilityCheck = this.checkEligibility(input);
    if (!eligibilityCheck.isEligible) {
      throw new Error(`가업상속공제 요건 미충족: ${eligibilityCheck.reason}`);
    }
    
    // 3단계: 가업상속공제액 계산
    const businessDeduction = this.calculateBusinessInheritanceDeduction(input);
    
    // 4단계: 공제 적용 후 과세표준 계산
    const adjustedTaxableAmount = Math.max(0, 
      basicInheritanceResult.taxableAmount - businessDeduction
    );
    
    // 5단계: 최종 상속세 계산
    const finalTax = this.calculateProgressiveTax(adjustedTaxableAmount, INHERITANCE_TAX_RATES);
    const localIncomeTax = Math.floor(finalTax * 0.1);
    const totalTax = finalTax + localIncomeTax;
    
    // 6단계: 절세 효과 계산
    const taxSaving = basicInheritanceResult.totalTax - totalTax;
    const taxSavingRate = basicInheritanceResult.totalTax > 0 
      ? (taxSaving / basicInheritanceResult.totalTax) * 100 
      : 0;
    
    // 7단계: 사후관리 계획 수립
    const managementPlan = this.generateManagementPlan(input, businessDeduction);
    
    // 8단계: 분할납부 계획 수립
    const installmentPlan = this.generateInstallmentPlan(totalTax, input);
    
    return {
      taxableAmount: adjustedTaxableAmount,
      calculatedTax: finalTax,
      localIncomeTax,
      totalTax,
      netAmount: input.totalInheritanceValue - totalTax,
      businessInheritanceDeduction: businessDeduction,
      regularInheritanceTax: basicInheritanceResult.totalTax,
      taxSavingAmount: taxSaving,
      taxSavingRate: Math.round(taxSavingRate * 100) / 100,
      managementPeriod: managementPlan.period,
      employmentMaintenanceRequired: managementPlan.employmentCount,
      penaltyRisk: managementPlan.risks,
      installmentPlan,
      breakdown: this.generateBusinessInheritanceBreakdown(input, businessDeduction, finalTax),
      appliedRates: this.getAppliedRates(adjustedTaxableAmount),
      deductions: this.getBusinessDeductionList(input, businessDeduction)
    };
  }

  /**
   * 기본 상속세 계산
   */
  private static calculateBasicInheritance(input: BusinessInheritanceInput): {
    taxableAmount: number;
    totalTax: number;
  } {
    // 상속공제 계산
    const basicDeduction = 200000000; // 기본공제 2억
    const spouseDeduction = input.spouseExists ? 500000000 : 0; // 배우자공제 5억
    const descendantDeduction = input.directDescendants * 50000000; // 직계비속 1인당 5천만원
    const elderlyDeduction = input.hasElderlyPerson ? 100000000 : 0; // 65세 이상 1억
    const disabledDeduction = input.hasDisabledPerson ? 100000000 : 0; // 장애인공제 1억
    const minorDeduction = input.hasMinorChildren ? 50000000 : 0; // 미성년자공제 5천만원
    
    const totalDeduction = basicDeduction + spouseDeduction + descendantDeduction + 
                          elderlyDeduction + disabledDeduction + minorDeduction;
    
    // 과세표준 계산
    const netInheritanceValue = input.totalInheritanceValue - input.debtsAndExpenses;
    const taxableAmount = Math.max(0, netInheritanceValue - totalDeduction);
    
    // 상속세 계산
    const calculatedTax = this.calculateProgressiveTax(taxableAmount, INHERITANCE_TAX_RATES);
    const localIncomeTax = Math.floor(calculatedTax * 0.1);
    const totalTax = calculatedTax + localIncomeTax;
    
    return { taxableAmount, totalTax };
  }

  /**
   * 가업상속공제 적격성 검토 (고도화)
   */
  private static checkEligibility(input: BusinessInheritanceInput): EligibilityCheck {
    const requirements: RequirementCheck[] = [];
    const warnings: Warning[] = [];
    const recommendations: string[] = [];
    
    // 1. 업력 요건 (3년 이상) - 필수
    const businessPeriodCheck: RequirementCheck = {
      requirement: '업력 3년 이상',
      satisfied: input.businessPeriod >= 3,
      description: '가업상속공제를 받기 위해서는 피상속인이 해당 업종을 3년 이상 영위해야 합니다.',
      importance: 'critical',
      documentRequired: '사업자등록증, 법인등기부등본'
    };
    requirements.push(businessPeriodCheck);
    
    if (input.businessPeriod < 3) {
      warnings.push({
        type: 'critical',
        message: `현재 업력이 ${input.businessPeriod}년으로 3년 미만입니다.`,
        suggestion: '가업상속공제 적용이 불가능합니다. 일반 상속세만 적용됩니다.'
      });
    } else if (input.businessPeriod < 7) {
      warnings.push({
        type: 'warning',
        message: `업력이 ${input.businessPeriod}년으로 7년 미만입니다.`,
        suggestion: '공제율 90%가 적용됩니다. 7년 이상 시 100% 공제가 가능합니다.'
      });
    }
    
    // 2. 계속 경영 의사 - 필수
    const continuousManagementCheck: RequirementCheck = {
      requirement: '계속 경영 의사',
      satisfied: input.continuousManagement,
      description: '상속인은 상속받은 가업을 10년간 계속 경영할 의사가 있어야 합니다.',
      importance: 'critical',
      documentRequired: '사후관리계획서'
    };
    requirements.push(continuousManagementCheck);
    
    if (!input.continuousManagement) {
      warnings.push({
        type: 'critical',
        message: '계속 경영 의사가 없습니다.',
        suggestion: '가업상속공제를 받으려면 10년간 계속 경영 의무를 이행해야 합니다.'
      });
    }
    
    // 3. 고용 유지 계획 (종업원 10명 이상인 경우) - 조건부 필수
    const employmentMaintenanceCheck: RequirementCheck = {
      requirement: '고용 유지 계획',
      satisfied: input.employeeCount < 10 || input.employmentMaintenance,
      description: '종업원이 10명 이상인 경우 80% 이상 고용을 유지해야 합니다.',
      importance: input.employeeCount >= 10 ? 'critical' : 'optional',
      documentRequired: input.employeeCount >= 10 ? '고용유지계획서, 4대보험 가입자명부' : undefined
    };
    requirements.push(employmentMaintenanceCheck);
    
    if (input.employeeCount >= 10) {
      if (!input.employmentMaintenance) {
        warnings.push({
          type: 'critical',
          message: '종업원 10명 이상 기업에서 고용유지계획이 없습니다.',
          suggestion: '고용유지계획서를 작성하고 최소 80% 고용을 유지해야 합니다.'
        });
      } else {
        const requiredEmployees = Math.floor(input.employeeCount * 0.8);
        warnings.push({
          type: 'info',
          message: `고용유지 의무: 최소 ${requiredEmployees}명 이상 유지 필요`,
          suggestion: '매년 4대보험 가입자 현황으로 고용유지 실적을 신고해야 합니다.'
        });
      }
    }
    
    // 4. 사업장 소재지 유지 - 중요
    const locationMaintenanceCheck: RequirementCheck = {
      requirement: '사업장 소재지 유지',
      satisfied: input.businessLocationMaintenance,
      description: '원칙적으로 사업장 소재지를 10년간 유지해야 합니다.',
      importance: 'important',
      documentRequired: '사업자등록증, 임대차계약서'
    };
    requirements.push(locationMaintenanceCheck);
    
    if (!input.businessLocationMaintenance) {
      warnings.push({
        type: 'warning',
        message: '사업장 소재지 유지 계획이 없습니다.',
        suggestion: '불가피한 경우 세무서 승인 하에 이전 가능하나, 사전 협의 필요합니다.'
      });
    }
    
    // 5. 기업규모별 추가 검토사항
    if (input.businessType === 'medium') {
      if (input.annualRevenue > 400000000000) { // 4000억 초과
        warnings.push({
          type: 'warning',
          message: '연 매출액이 4000억원을 초과합니다.',
          suggestion: '중견기업 범위를 벗어날 수 있으니 정확한 기업규모 확인이 필요합니다.'
        });
      }
    } else if (input.businessType === 'small') {
      if (input.annualRevenue > 120000000000) { // 1200억 초과
        warnings.push({
          type: 'warning',
          message: '연 매출액이 1200억원을 초과합니다.',
          suggestion: '중소기업 범위를 벗어날 수 있으니 정확한 기업규모 확인이 필요합니다.'
        });
      }
    }
    
    // 6. 가업용 자산 비율 검토
    const businessAssetRatio = input.businessAssetValue / input.totalInheritanceValue;
    if (businessAssetRatio < 0.5) {
      warnings.push({
        type: 'warning',
        message: `가업용 자산 비율이 ${(businessAssetRatio * 100).toFixed(1)}%로 낮습니다.`,
        suggestion: '가업용 자산 비율이 높을수록 절세 효과가 큽니다. 자산 구조 검토를 권장합니다.'
      });
    }
    
    // 추천사항 생성
    if (input.businessPeriod >= 7) {
      recommendations.push('업력 7년 이상으로 100% 공제율 적용 가능');
    }
    
    if (input.businessType === 'medium') {
      recommendations.push('중견기업으로 최대 500억원 공제 가능');
    } else {
      recommendations.push('중소기업으로 최대 300억원 공제 가능');
    }
    
    if (input.employeeCount < 10) {
      recommendations.push('종업원 10명 미만으로 고용유지 의무 면제');
    }
    
    recommendations.push('전문 세무사와 상담하여 정확한 적격성 및 절세 방안 검토 권장');
    recommendations.push('상속개시 전 미리 가업상속공제 요건 정비 권장');
    
    // 전체 적격성 판정
    const criticalRequirements = requirements.filter(req => req.importance === 'critical');
    const isEligible = criticalRequirements.every(req => req.satisfied);
    const failedRequirement = criticalRequirements.find(req => !req.satisfied);
    
    return {
      isEligible,
      reason: failedRequirement?.requirement,
      requirements,
      warnings,
      recommendations
    };
  }

  /**
   * 가업상속공제액 계산
   */
  private static calculateBusinessInheritanceDeduction(input: BusinessInheritanceInput): number {
    // 가업상속공제 한도 결정
    const maxDeduction = input.businessType === 'small' ? 30000000000 : 50000000000; // 300억 or 500억
    
    // 실제 가업용 자산 가액과 한도 중 작은 금액
    const applicableAmount = Math.min(input.businessAssetValue, maxDeduction);
    
    // 업력에 따른 공제율 적용
    let deductionRate = 1.0;
    if (input.businessPeriod < 3) {
      deductionRate = 0.8; // 3년 미만: 80%
    } else if (input.businessPeriod < 7) {
      deductionRate = 0.9; // 3년~7년 미만: 90%
    }
    // 7년 이상: 100%
    
    return Math.floor(applicableAmount * deductionRate);
  }

  /**
   * 누진세 계산
   */
  private static calculateProgressiveTax(income: number, rates: any[]): number {
    let tax = 0;
    let remainingIncome = income;
    
    for (const rate of rates) {
      if (remainingIncome <= 0) break;
      
      const min = rate.min || 0;
      const max = rate.max || Infinity;
      const bracketIncome = Math.min(remainingIncome, max - min);
      
      if (bracketIncome > 0) {
        tax += bracketIncome * rate.rate;
        remainingIncome -= bracketIncome;
      }
    }
    
    return Math.floor(tax);
  }

  /**
   * 사후관리 계획 생성 (고도화)
   */
  private static generateManagementPlan(input: BusinessInheritanceInput, deductionAmount: number): ManagementPlan {
    const managementPeriod = 10; // 10년간 사후관리
    const employmentCount = Math.floor(input.employeeCount * 0.8); // 80% 이상 고용 유지
    
    // 위험도별 추징 비율 및 금액
    const risks: PenaltyRisk[] = [
      {
        violationType: '계속경영 의무 위반 (완전 중단)',
        penaltyRate: 1.0, // 100% 추징
        penaltyAmount: Math.floor(deductionAmount * 1.0),
        riskLevel: 'high'
      },
      {
        violationType: '계속경영 의무 위반 (일부 중단)',
        penaltyRate: 0.2, // 20% 추징  
        penaltyAmount: Math.floor(deductionAmount * 0.2),
        riskLevel: 'high'
      },
      {
        violationType: '고용유지 의무 위반 (80% 미만)',
        penaltyRate: 0.1, // 10% 추징
        penaltyAmount: Math.floor(deductionAmount * 0.1),
        riskLevel: 'medium'
      },
      {
        violationType: '사업장 소재지 무단 이전',
        penaltyRate: 0.15, // 15% 추징
        penaltyAmount: Math.floor(deductionAmount * 0.15),
        riskLevel: 'medium'
      },
      {
        violationType: '사후관리신고서 미제출',
        penaltyRate: 0.05, // 5% 추징
        penaltyAmount: Math.floor(deductionAmount * 0.05),
        riskLevel: 'low'
      }
    ];
    
    // 상세 의무사항
    const obligations: ManagementObligation[] = [
      {
        category: '계속경영',
        obligation: '가업을 직접 경영하거나 경영에 참여해야 함',
        period: '10년간',
        penalty: '위반 시 공제세액 전액 또는 20% 추징',
        documents: ['사업자등록증', '법인등기부등본', '재무제표', '매출실적 증명서']
      },
      {
        category: '고용유지',
        obligation: `종업원 ${employmentCount}명 이상 고용 유지`,
        period: '10년간',
        penalty: '위반 시 공제세액의 10% 추징',
        documents: ['4대보험 가입자명부', '근로계약서', '급여대장']
      },
      {
        category: '사업장 유지',
        obligation: '사업장 소재지를 동일 시·군·구 내 유지',
        period: '10년간',
        penalty: '위반 시 공제세액의 15% 추징',
        documents: ['사업자등록증', '임대차계약서', '소재지 변경신고서']
      },
      {
        category: '신고의무',
        obligation: '매년 사후관리 현황 신고',
        period: '10년간',
        penalty: '미신고 시 공제세액의 5% 추징',
        documents: ['사후관리신고서', '고용현황신고서', '경영현황신고서']
      }
    ];
    
    // 연도별 타임라인
    const timeline: ManagementTimeline[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let year = 0; year < 10; year++) {
      const targetYear = currentYear + year;
      const tasks: string[] = [];
      const deadlines: string[] = [];
      const documents: string[] = [];
      
      if (year === 0) {
        // 1년차: 초기 설정
        tasks.push('사후관리계획서 제출', '가업상속공제 신고', '계속경영 개시');
        deadlines.push('상속개시일로부터 6개월 이내');
        documents.push('사후관리계획서', '가업상속공제신고서');
      }
      
      // 매년 공통 업무
      tasks.push('사후관리신고서 제출', '계속경영 확인', '고용현황 신고');
      deadlines.push(`${targetYear + 1}년 3월 31일`);
      documents.push('사후관리신고서', '고용현황신고서', '재무제표');
      
      if (input.employeeCount >= 10) {
        tasks.push('고용유지 실적 신고');
        documents.push('4대보험 가입자명부');
      }
      
      // 중간 점검 (5년차)
      if (year === 4) {
        tasks.push('중간 점검 및 향후 계획 수립');
        documents.push('중간평가보고서');
      }
      
      // 최종 년도 (10년차)
      if (year === 9) {
        tasks.push('사후관리 완료 신고', '최종 실적 정리');
        documents.push('사후관리완료신고서', '10년간 실적 종합보고서');
      }
      
      timeline.push({
        year: targetYear,
        tasks,
        deadlines,
        documents
      });
    }
    
    return { 
      period: managementPeriod, 
      employmentCount, 
      risks,
      obligations,
      timeline
    };
  }

  /**
   * 분할납부 계획 생성
   */
  private static generateInstallmentPlan(totalTax: number, input: BusinessInheritanceInput): InstallmentPlan[] {
    const plan: InstallmentPlan[] = [];
    const baseYear = new Date().getFullYear();
    
    // 5년 분할납부 계획 (연 20%씩)
    for (let i = 0; i < 5; i++) {
      plan.push({
        year: baseYear + i,
        amount: Math.floor(totalTax * 0.2),
        dueDate: `${baseYear + i}-12-31`,
        interestRate: 0.025 // 2.5% 이자율
      });
    }
    
    return plan;
  }

  /**
   * 계산 내역 생성
   */
  private static generateBusinessInheritanceBreakdown(
    input: BusinessInheritanceInput, 
    businessDeduction: number, 
    finalTax: number
  ): CalculationBreakdown {
    const steps: CalculationStep[] = [
      {
        label: '총 상속재산 가액',
        amount: input.totalInheritanceValue,
        note: '가업용 자산 + 개인 자산'
      },
      {
        label: '채무 및 공과금',
        amount: -input.debtsAndExpenses,
        note: '상속재산에서 차감'
      },
      {
        label: '가업상속공제',
        amount: -businessDeduction,
        note: `${input.businessType === 'small' ? '중소기업' : '중견기업'} 특례공제`
      },
      {
        label: '기타 상속공제',
        amount: -(200000000 + (input.spouseExists ? 500000000 : 0) + (input.directDescendants * 50000000)),
        note: '기본공제 + 배우자공제 + 직계비속공제'
      },
      {
        label: '상속세 과세표준',
        amount: Math.max(0, input.totalInheritanceValue - input.debtsAndExpenses - businessDeduction - 
               (200000000 + (input.spouseExists ? 500000000 : 0) + (input.directDescendants * 50000000))),
        note: '세금 계산의 기준 금액'
      },
      {
        label: '산출세액',
        amount: finalTax,
        note: '누진세율 적용'
      }
    ];
    
    return {
      steps,
      summary: {
        totalIncome: input.totalInheritanceValue,
        totalDeductions: businessDeduction + 200000000 + (input.spouseExists ? 500000000 : 0) + 
                        (input.directDescendants * 50000000),
        taxableIncome: Math.max(0, input.totalInheritanceValue - input.debtsAndExpenses - businessDeduction - 
                               (200000000 + (input.spouseExists ? 500000000 : 0) + (input.directDescendants * 50000000))),
        taxBeforeCredits: finalTax,
        taxCredits: 0,
        finalTax: finalTax
      }
    };
  }

  /**
   * 적용 세율 정보 생성
   */
  private static getAppliedRates(taxableAmount: number): AppliedRate[] {
    const rates: AppliedRate[] = [];
    let remainingAmount = taxableAmount;
    
    for (const rate of INHERITANCE_TAX_RATES) {
      if (remainingAmount <= 0) break;
      
      const min = rate.min || 0;
      const max = rate.max || Infinity;
      const bracketAmount = Math.min(remainingAmount, max - min);
      
      if (bracketAmount > 0) {
        rates.push({
          range: `${(min / 100000000).toFixed(0)}억 ~ ${max === Infinity ? '초과' : (max / 100000000).toFixed(0) + '억'}`,
          rate: rate.rate,
          amount: Math.floor(bracketAmount * rate.rate)
        });
        remainingAmount -= bracketAmount;
      }
    }
    
    return rates;
  }

  /**
   * 공제 목록 생성
   */
  private static getBusinessDeductionList(input: BusinessInheritanceInput, businessDeduction: number): Deduction[] {
    const deductions: Deduction[] = [
      {
        type: 'business',
        label: '가업상속공제',
        amount: businessDeduction
      },
      {
        type: 'basic',
        label: '기본공제',
        amount: 200000000
      }
    ];
    
    if (input.spouseExists) {
      deductions.push({
        type: 'spouse',
        label: '배우자공제',
        amount: 500000000
      });
    }
    
    if (input.directDescendants > 0) {
      deductions.push({
        type: 'descendant',
        label: '직계비속공제',
        amount: input.directDescendants * 50000000
      });
    }
    
    return deductions;
  }
} 