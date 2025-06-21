// 공통 세금 계산 인터페이스
export interface TaxCalculationInput {
  [key: string]: number | string | boolean | Date;
}

export interface TaxCalculationResult {
  taxableAmount: number;        // 과세표준
  calculatedTax: number;        // 산출세액  
  localIncomeTax: number;       // 지방소득세
  totalTax: number;             // 총 세액
  netAmount?: number;           // 실수령액
  breakdown: CalculationBreakdown;
  appliedRates: AppliedRate[];
  deductions: Deduction[];
}

export interface CalculationBreakdown {
  steps: CalculationStep[];
  summary: {
    totalIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    taxBeforeCredits: number;
    taxCredits: number;
    finalTax: number;
  };
}

export interface CalculationStep {
  label: string;
  amount: number;
  formula?: string;
  note?: string;
  description?: string;
}

export interface AppliedRate {
  range: string;
  rate: number;
  amount: number;
  description?: string;                    // 세율 적용 설명
}

export interface Deduction {
  type: string;
  label: string;
  amount: number;
  limit?: number;
  note?: string;                           // 공제 관련 참고사항
}

// 세율 구조
export interface TaxRate {
  min: number;
  max: number;
  rate: number;
  deduction?: number;
}

// 근로소득세 계산기 인터페이스
export interface EarnedIncomeTaxInput extends TaxCalculationInput {
  annualSalary: number;                    // 연봉
  dependents: number;                      // 부양가족 수
  pensionContribution: number;             // 국민연금 기여금
  healthInsurance: number;                 // 건강보험료
  employmentInsurance: number;             // 고용보험료
  personalPensionContribution: number;     // 개인연금 납입액
  housingFund: number;                     // 주택청약종합저축
  medicalExpenses: number;                 // 의료비
  educationExpenses: number;               // 교육비
  donationAmount: number;                  // 기부금
  creditCardUsage: number;                 // 신용카드 사용액
  isDisabled: boolean;                     // 장애인 여부
  isElderly: boolean;                      // 경로우대 여부
}

export interface EarnedIncomeTaxResult extends TaxCalculationResult {
  monthlySalary: number;                   // 월 실수령액
  yearEndTaxSettlement: number;            // 연말정산 예상액
  monthlyWithholding: number;              // 월 원천징수세액
}

// 종합소득세 계산기 인터페이스
export interface ComprehensiveIncomeTaxInput extends TaxCalculationInput {
  // 소득별 금액
  interestIncome: number;                  // 이자소득
  dividendIncome: number;                  // 배당소득
  businessIncome: number;                  // 사업소득
  realEstateRentalIncome: number;          // 부동산임대소득
  earnedIncome: number;                    // 근로소득
  pensionIncome: number;                   // 연금소득
  otherIncome: number;                     // 기타소득
  
  // 필요경비 및 공제
  businessExpenses: number;                // 사업소득 필요경비
  rentalExpenses: number;                  // 임대소득 필요경비
  earnedIncomeDeduction: number;           // 근로소득공제
  
  // 인적공제
  dependents: number;                      // 부양가족 수
  spouseCount: number;                     // 배우자 수
  disabledCount: number;                   // 장애인 수
  elderlyCount: number;                    // 경로우대자 수
  
  // 소득공제
  personalPensionContribution: number;     // 개인연금 납입액
  pensionSavings: number;                  // 연금저축
  housingFund: number;                     // 주택청약종합저축
  medicalExpenses: number;                 // 의료비
  educationExpenses: number;               // 교육비
  donationAmount: number;                  // 기부금
  creditCardUsage: number;                 // 신용카드 사용액
  
  // 세액공제
  childrenCount: number;                   // 자녀 수
  childrenUnder6Count: number;             // 6세 이하 자녀 수
  childTaxCredit: number;                  // 자녀세액공제 (자동계산)
  earnedIncomeTaxCredit: number;           // 근로소득세액공제
  
  // 기타
  previousYearTaxPaid: number;             // 기납부세액
  isSmallBusiness: boolean;                // 소기업 여부 (사업소득 시)
}

export interface ComprehensiveIncomeTaxResult extends TaxCalculationResult {
  totalIncome: number;                     // 총수입금액
  totalGrossIncome: number;                // 총소득금액
  totalDeductibleAmount: number;           // 총소득공제액
  taxableIncome: number;                   // 종합소득과세표준
  progressiveTax: number;                  // 종합소득 산출세액
  totalTaxCredit: number;                  // 총세액공제
  determinedTax: number;                   // 종합소득결정세액
  additionalTax: number;                   // 추가납부세액
  refundTax: number;                       // 환급세액
  effectiveRate: number;                   // 실효세율
  marginalRate: number;                    // 한계세율
}

// 양도소득세 계산기 인터페이스
export interface CapitalGainsTaxInput {
  // 기본 정보
  propertyType: 'apartment' | 'house' | 'commercial' | 'land' | 'stock' | 'other';
  
  // 양도 정보
  salePrice: number;                       // 양도가액
  saleDate: string;                        // 양도일
  acquisitionPrice: number;                // 취득가액
  acquisitionDate: string;                 // 취득일
  
  // 비용
  acquisitionCosts: number;                // 취득비용 (등록세, 중개수수료 등)
  improvementCosts: number;                // 개량비 (리모델링 비용 등)
  transferCosts: number;                   // 양도비용 (중개수수료, 인지세 등)
  
  // 특례 및 공제
  isOneHouseOneFamily: boolean;            // 1세대1주택 여부
  residenceYears: number;                  // 실거주 연수
  holdingPeriodYears: number;              // 보유기간 (년)
  isDualUse: boolean;                      // 복합주택 여부 (주택 + 사업용)
  
  // 가점 관련
  hasSchoolDistrict: boolean;              // 학군지역 여부
  isReconstructionArea: boolean;           // 재개발/재건축지역 여부
  isMultipleHouses: boolean;               // 다주택자 여부
  
  // 세대 정보
  age: number;                             // 양도자 나이
  householdMembers: number;                // 세대원 수
  totalHousesOwned: number;                // 보유주택 수
  
  // 특수상황
  isNonResident: boolean;                  // 비거주자 여부
  isForeignerExemption: boolean;           // 외국인 비과세 대상
  isForeclosure: boolean;                  // 경매/공매 여부
  
  // 기타
  previousYearTaxPaid: number;             // 기납부세액 (중간예납)
  specialCases: {
    isGiftProperty: boolean;               // 증여받은 재산 여부
    isInheritedProperty: boolean;          // 상속받은 재산 여부
    isSelfConstruction: boolean;           // 자가건설 여부
    isPublicLandCompensation: boolean;     // 공시지가 보상 대상
  };
}

export interface CapitalGainsTaxResult extends TaxCalculationResult {
  // 기본 계산
  transferIncome: number;                  // 양도차익 (양도가액 - 취득가액 - 제비용)
  
  // 특별공제
  basicDeduction: number;                  // 기본공제 (250만원 또는 연 250만원)
  longTermDeduction: number;               // 장기보유특별공제
  oneHouseDeduction: number;               // 1세대1주택 특별공제
  totalSpecialDeductions: number;          // 특별공제 합계
  
  // 과세표준
  taxableGain: number;                     // 양도소득 과세표준
  
  // 세액 계산
  basicTax: number;                        // 기본세액
  heavyTax: number;                        // 중과세액 (다주택자, 재개발지역 등)
  localIncomeTax: number;                  // 지방소득세 (10%)
  
  // 최종 세액
  totalTax: number;                        // 총 양도소득세
  previousTaxPaid: number;                 // 기납부세액
  additionalPayment: number;               // 추가납부세액
  refundAmount: number;                    // 환급세액
  
  // 세율 정보
  appliedTaxRate: number;                  // 적용된 세율
  effectiveRate: number;                   // 실효세율 (세액/양도차익)
  
  // 보유기간 정보
  holdingYears: number;                    // 보유연수
  holdingMonths: number;                   // 보유개월수
  
  // 비과세/감면 정보
  taxExemption: {
    isExempt: boolean;                     // 비과세 여부
    exemptionType: string;                 // 비과세 유형
    exemptionAmount: number;               // 비과세 금액
    reason: string;                        // 비과세 사유
  };
  
  // 중과세 정보
  heavyTaxInfo: {
    isApplied: boolean;                    // 중과세 적용 여부
    reason: string;                        // 중과세 사유
    additionalRate: number;                // 추가 세율
  };
  
  // 계산과정 상세
  calculationDetails: {
    steps: Array<{ 
      label: string; 
      amount: number; 
      description?: string;
      formula?: string;
    }>;
    deductions: Array<{
      type: string;
      label: string;
      amount: number;
      rate?: number;
    }>;
    taxRates: Array<{
      bracket: string;
      rate: number;
      amount: number;
    }>;
  };
}

// 상속세 계산기 인터페이스
export interface InheritanceTaxInput extends TaxCalculationInput {
  // 상속재산 관련
  totalInheritance: number;                // 총 상속받은 재산
  debtLiabilities: number;                 // 채무·공과금
  funeralExpenses: number;                 // 장례비용
  
  // 피상속인 정보
  deceasedAge: number;                     // 피상속인 나이
  deceasedSpouse: boolean;                 // 배우자 생존 여부
  
  // 상속인 정보
  spouse: boolean;                         // 배우자 여부
  spouseAge: number;                       // 배우자 나이
  children: number;                        // 직계비속 수
  minorChildren: number;                   // 미성년자 자녀 수
  disabledHeirs: number;                   // 장애인 상속인 수
  elderlyHeirs: number;                    // 65세 이상 상속인 수
  
  // 상속 형태
  inheritanceRatio: number;                // 상속비율 (0~1)
  jointInheritance: boolean;               // 공동상속 여부
  
  // 재산 분류
  realEstate: number;                      // 부동산
  deposit: number;                         // 예금
  stock: number;                           // 주식
  bond: number;                            // 채권
  insurance: number;                       // 보험금
  pension: number;                         // 퇴직금·연금
  other: number;                           // 기타재산
  
  // 특수 상황
  giftWithin10Years: number;               // 10년 내 증여재산
  premaritalGift: number;                  // 혼인증여재산
  businessInheritance: number;             // 사업승계재산
  nonResidentInheritance: number;          // 국외재산
  
  // 감면 관련
  familyBusinessDiscount: boolean;         // 가족기업 할인
  farmLandDiscount: boolean;               // 농지 할인
  culturalAssetDiscount: boolean;          // 문화재 할인
  
  // 납세의무 관련
  taxDeferralRequest: boolean;             // 납세유예 신청
  installmentPayment: boolean;             // 분할납부 신청
  
  // 기타
  previousTaxPaid: number;                 // 기납부세액
  isNonResident: boolean;                  // 비거주자 여부
}

export interface InheritanceTaxResult extends TaxCalculationResult {
  // 상속재산 가액
  grossInheritance: number;                // 총 상속재산
  inheritanceDeductions: number;           // 상속재산공제액
  taxableInheritance: number;              // 상속세 과세표준
  
  // 인적공제
  personalDeductions: {
    basic: number;                         // 기초공제 (2억원)
    spouse: number;                        // 배우자공제 (5억원 또는 법정상속분)
    children: number;                      // 자녀공제 (5천만원 × 인원)
    minorChildren: number;                 // 미성년자공제 (1천만원 × 연수)
    disabled: number;                      // 장애인공제 (1천만원 × 연수)
    elderly: number;                       // 65세이상공제 (5백만원 × 인원)
    total: number;                         // 인적공제 합계
  };
  
  // 물적공제
  propertyDeductions: {
    funeralExpenses: number;               // 장례비 (5백만원 한도)
    debts: number;                         // 채무공제
    charityDonation: number;               // 공익사업용재산 등
    total: number;                         // 물적공제 합계
  };
  
  // 일괄공제
  lumpSumDeduction: number;                // 일괄공제 (5억원 한도)
  
  // 상속세액 계산
  calculatedTax: number;                   // 상속세 산출세액
  
  // 세액공제 및 감면
  taxCredits: {
    giftTaxCredit: number;                 // 증여세액공제
    foreignTaxCredit: number;              // 외국납부세액공제
    taxDeferred: number;                   // 세액공제 합계
    total: number;
  };
  
  // 할증 및 감면
  taxAdjustments: {
    rapidInheritanceDiscount: number;      // 신속상속공제 (10~20%)
    culturalAssetDiscount: number;         // 문화재등 감면
    farmLandDiscount: number;              // 농지감면
    familyBusinessDiscount: number;        // 가족기업 감면
    total: number;                         // 할증감면 합계
  };
  
  // 최종 세액
  determinedTax: number;                   // 결정세액
  previousTaxPaid: number;                // 기납부세액
  additionalPayment: number;               // 추가납부세액
  refundAmount: number;                    // 환급세액
  
  // 세율 정보
  effectiveRate: number;                   // 실효세율
  marginalRate: number;                    // 적용세율
  
  // 상속인별 분할 정보
  inheritanceDistribution: Array<{
    heir: string;                          // 상속인
    ratio: number;                         // 상속비율
    inheritedAmount: number;               // 상속받은 금액
    taxAmount: number;                     // 납부세액
  }>;
  
  // 납부 일정
  paymentSchedule: {
    dueDate: Date;                         // 신고납부기한
    installmentAvailable: boolean;         // 분할납부 가능여부
    deferralAvailable: boolean;            // 납세유예 가능여부
    installmentPlan?: Array<{
      installment: number;                 // 회차
      dueDate: Date;                       // 납부기한
      amount: number;                      // 납부금액
    }>;
  };
  
  // 계산과정 상세
  calculationBreakdown: {
    totalInheritance: number;              // 총 상속재산
    totalDeductions: number;               // 총 공제액
    taxableBase: number;                   // 과세표준
    grossTax: number;                      // 산출세액
    totalCredits: number;                  // 총 세액공제
    finalTax: number;                      // 최종세액
  };
}

// 증여세 계산기 인터페이스
export interface GiftTaxInput {
  // 기본 증여 정보
  giftAmount: number;                      // 증여재산 가액
  giftDate: string;                        // 증여일
  
  // 증여자 정보
  donorAge: number;                        // 증여자 나이
  donorRelation: 'spouse' | 'parent' | 'grandparent' | 'child' | 'grandchild' | 'other';
  
  // 수증자 정보  
  recipientAge: number;                    // 수증자 나이
  isRecipientMinor: boolean;               // 수증자 미성년 여부
  isRecipientDisabled: boolean;            // 수증자 장애인 여부
  
  // 증여 형태
  giftType: 'money' | 'realEstate' | 'stock' | 'business' | 'other';
  isConditionalGift: boolean;              // 부담부증여 여부
  giftConditionValue: number;              // 부담부증여 부담액
  
  // 재산 분류
  cash: number;                            // 현금
  realEstate: number;                      // 부동산
  stock: number;                           // 주식
  bond: number;                            // 채권
  businessAsset: number;                   // 사업용자산
  other: number;                           // 기타재산
  
  // 특수 증여
  marriageGift: boolean;                   // 혼인증여 여부
  marriageGiftAmount: number;              // 혼인증여 금액
  educationGift: boolean;                  // 교육비 증여 여부
  educationGiftAmount: number;             // 교육비 증여 금액
  
  // 10년 내 기존 증여
  previousGifts: Array<{
    date: string;                          // 이전 증여일
    amount: number;                        // 이전 증여액
    taxPaid: number;                       // 기납부 증여세
  }>;
  
  // 공제 및 감면
  familyBusinessDiscount: boolean;         // 가족기업 할인
  farmLandDiscount: boolean;               // 농지 할인
  culturalAssetDiscount: boolean;          // 문화재 할인
  startupDiscount: boolean;                // 창업자금 할인
  
  // 기타
  previousTaxPaid: number;                 // 기납부세액
  isNonResident: boolean;                  // 비거주자 여부
  hasSpecialRelationship: boolean;         // 특수관계 여부
}

export interface GiftTaxResult extends TaxCalculationResult {
  // 증여재산 가액
  grossGift: number;                       // 총 증여재산
  giftDeductions: number;                  // 증여재산공제액
  taxableGift: number;                     // 증여세 과세표준
  
  // 공제 내역
  relationshipDeduction: {
    type: string;                          // 공제 유형
    amount: number;                        // 공제액
    limit: number;                         // 공제한도
    description: string;                   // 공제 설명
  };
  
  // 혼인·교육비 공제
  specialDeductions: {
    marriage: number;                      // 혼인증여공제
    education: number;                     // 교육비공제
    startup: number;                       // 창업자금공제
    total: number;                         // 특별공제 합계
  };
  
  // 10년 합산과세
  cumulativeTaxation: {
    currentGift: number;                   // 이번 증여액
    previousGifts: number;                 // 기존 증여액 합계
    totalGifts: number;                    // 10년 총 증여액
    previousTaxPaid: number;               // 기납부 증여세
    cumulativeTax: number;                 // 누진계산 세액
    currentTaxDue: number;                 // 이번 납부세액
  };
  
  // 증여세액 계산
  calculatedTax: number;                   // 증여세 산출세액
  
  // 세액공제 및 감면
  taxCredits: {
    previousGiftTaxCredit: number;         // 기납부증여세액공제
    foreignTaxCredit: number;              // 외국납부세액공제
    total: number;                         // 세액공제 합계
  };
  
  // 할증 및 감면
  taxAdjustments: {
    familyBusinessDiscount: number;        // 가족기업 감면
    farmLandDiscount: number;              // 농지감면
    culturalAssetDiscount: number;         // 문화재감면
    startupDiscount: number;               // 창업자금감면
    total: number;                         // 할증감면 합계
  };
  
  // 최종 세액
  determinedTax: number;                   // 결정세액
  previousTaxPaid: number;                // 기납부세액
  additionalPayment: number;               // 추가납부세액
  refundAmount: number;                    // 환급세액
  
  // 세율 정보
  effectiveRate: number;                   // 실효세율
  marginalRate: number;                    // 적용세율
  
  // 신고 및 납부 정보
  filingDueDate: Date;                     // 신고기한
  paymentDueDate: Date;                    // 납부기한
  installmentAvailable: boolean;           // 분할납부 가능여부
  
  // 절세 조언
  taxSavingAdvice: Array<{
    type: string;                          // 절세 방법
    description: string;                   // 설명
    expectedSaving: number;                // 예상 절세액
  }>;
  
  // 계산과정 상세
  calculationBreakdown: {
    totalGift: number;                     // 총 증여재산
    totalDeductions: number;               // 총 공제액
    taxableBase: number;                   // 과세표준
    grossTax: number;                      // 산출세액
    totalCredits: number;                  // 총 세액공제
    finalTax: number;                      // 최종세액
  };
}

// 법인세 계산기 인터페이스
export interface CorporateTaxInput {
  // 기본 법인 정보
  companyName: string;
  businessType: string;
  establishmentDate: string;
  fiscalYearEnd: string;
  
  // 재무 정보
  revenue: number;                        // 매출액
  operatingExpenses: number;              // 영업비용
  nonOperatingIncome: number;             // 영업외수익
  nonOperatingExpenses: number;           // 영업외비용
  specialIncome: number;                  // 특별이익
  specialExpenses: number;                // 특별손실
  
  // 자산 및 고용 정보
  totalAssets: number;                    // 자산총액
  numberOfEmployees: number;              // 직원수
  
  // 이월 결손금
  carryForwardLoss: number;               // 이월결손금
  
  // 세액공제
  rdExpenses: number;                     // 연구개발비
  equipmentInvestment: number;            // 설비투자금액
  equipmentType: string;                  // 설비 종류
  employmentIncrease: number;             // 고용증가 인원
  youngEmployees: number;                 // 청년 고용 인원
  disabledEmployees: number;              // 장애인 고용 인원
  
  // 특별 항목
  charitableDonation: number;             // 공익법인 기부금
  isStartup: boolean;                     // 창업기업 여부
  startupYears: number;                   // 창업 후 경과년수
  
  // 기타
  previousYearTax: number;                // 직전연도 법인세
  foreignTaxCredit: number;               // 외국납부세액공제
}

export interface CorporateTaxResult {
  // 소득 계산
  grossIncome: number;                    // 총수입금액
  totalExpenses: number;                  // 총비용
  taxableIncome: number;                  // 과세표준
  adjustedIncome: number;                 // 조정소득
  
  // 중소기업 판정
  isSmallBusiness: boolean;               // 중소기업 여부
  smallBusinessCriteria: {
    salesCheck: boolean;                  // 매출액 기준
    assetCheck: boolean;                  // 자산총액 기준
    employeeCheck: boolean;               // 직원수 기준
  };
  
  // 세액 계산
  taxBeforeCredits: number;               // 세액공제 전 법인세
  taxCredits: {
    rdCredit: number;                     // 연구개발비 세액공제
    equipmentCredit: number;              // 설비투자 세액공제
    employmentCredit: number;             // 고용증대 세액공제
    startupCredit: number;                // 창업기업 세액공제
    foreignCredit: number;                // 외국납부세액공제
    totalCredits: number;                 // 총 세액공제
  };
  finalTax: number;                       // 최종 법인세
  
  // 지방소득세 (법인세의 10%)
  localIncomeTax: number;                 // 지방소득세
  totalTax: number;                       // 총 납부세액
  
  // 중간예납
  interimPayment: number;                 // 중간예납세액
  finalPayment: number;                   // 최종 납부세액
  
  // 효과적인 세율
  effectiveRate: number;                  // 실효세율
  
  // 절세 조언
  taxSavingAdvice: Array<{
    type: string;
    description: string;
    expectedSaving: number;
  }>;
  
  // 신고 정보
  filingInfo: {
    filingDeadline: string;               // 신고기한
    interimDeadline: string;              // 중간예납 기한
    canInstallment: boolean;              // 분할납부 가능여부
    maxInstallments: number;              // 최대 분할횟수
  };
}

// 법인세 계산 검증 타입
export interface CorporateTaxValidation {
  isValid: boolean;
  errors: { [key: string]: string };
  warnings: { [key: string]: string };
}

// 업종별 중소기업 기준
export interface SmallBusinessCriteria {
  salesLimit: number;                     // 매출액 한도
  employeeLimit: number;                  // 직원수 한도
  assetLimit: number;                     // 자산총액 한도
}

// 부가가치세 계산기 인터페이스
export interface VATInput extends TaxCalculationInput {
  outputVAT: number;                       // 매출세액
  inputVAT: number;                        // 매입세액
  businessType: 'general' | 'simplified' | 'exempt';  // 사업자구분
  taxPeriod: 'first' | 'second';          // 과세기간
}

export interface VATResult extends TaxCalculationResult {
  vatPayable: number;                      // 납부할 세액
  vatRefundable: number;                   // 환급받을 세액
}

// 계산기 타입
export type CalculatorType = 
  | 'earned-income'
  | 'comprehensive-income'
  | 'capital-gains'
  | 'inheritance'
  | 'gift'
  | 'corporate-tax'
  | 'vat'
  | 'withholding';

// 계산 기록
export interface CalculationRecord {
  id: string;
  timestamp: Date;
  type: CalculatorType;
  inputs: Record<string, any>;
  results: TaxCalculationResult;
  title: string;
}

// 사용자 설정
export interface UserPreferences {
  defaultCalculator?: CalculatorType;
  saveHistory: boolean;
  autoCalculate: boolean;
  showBreakdown: boolean;
  printFormat: 'detailed' | 'summary';
}

// 유효성 검사 규칙
export interface ValidationRule {
  validate: (value: any) => string | null;
  message: string;
}

// 계산 상태
export interface CalculationState {
  type: CalculatorType;
  inputs: Record<string, any>;
  results: TaxCalculationResult | null;
  isCalculating: boolean;
  errors: Record<string, string>;
}

// 원천징수세 계산 관련 타입들
export interface WithholdingTaxInput {
  // 공통 정보
  incomeType: 'earned' | 'business' | 'other' | 'interest' | 'dividend';
  paymentAmount: number; // 지급액
  paymentDate: string; // 지급일
  paymentCount?: number; // 지급 횟수 (월 단위)
  
  // 근로소득 관련
  dependents?: number; // 부양가족 수
  childrenUnder20?: number; // 20세 이하 자녀 수
  isMainWorker?: boolean; // 주(현)근무지 여부
  
  // 기타소득 관련 (강의료, 원고료 등)
  hasBasicDeduction?: boolean; // 기본공제 적용 여부
  
  // 이자/배당소득 관련
  annualTotalInterest?: number; // 연간 총 이자소득
  isLowIncomeAccount?: boolean; // 서민형 비과세 계좌 여부
  
  // 기타
  previousTaxPaid?: number; // 기납부세액
}

export interface WithholdingTaxResult {
  // 기본 계산 결과
  paymentAmount: number; // 지급액
  taxableAmount: number; // 과세대상액
  incomeTax: number; // 소득세
  localIncomeTax: number; // 지방소득세
  totalTax: number; // 총 세액
  netAmount: number; // 실수령액
  
  // 세율 정보
  appliedRate: number; // 적용 세율
  incomeTaxRate: number; // 소득세율
  localIncomeTaxRate: number; // 지방소득세율
  
  // 상세 정보
  incomeType: string; // 소득 구분
  deductionAmount?: number; // 공제액
  dependentDeduction?: number; // 부양가족공제
  childDeduction?: number; // 자녀공제
  
  // 계산 과정
  breakdown: CalculationBreakdown;
  appliedRules: Array<{
    rule: string;
    description: string;
    amount?: number;
  }>;
  
  // 참고사항
  taxFilingRequired: boolean; // 세무신고 필요 여부
  yearEndSettlementEligible: boolean; // 연말정산 대상 여부
  recommendedActions: string[]; // 권장 사항
  warnings: string[]; // 주의사항
  
  // 납부 정보
  filingDeadline: string; // 신고기한
  paymentDeadline: string; // 납부기한
  receiptRequired: boolean; // 영수증 발급 의무
}

// 원천징수세 계산 옵션
export interface WithholdingTaxCalculationOptions {
  // 근로소득 간이세액표 사용 여부
  useSimplifiedTable?: boolean;
  
  // 외국인 여부 (세율 차등 적용)
  isForeigner?: boolean;
  
  // 비거주자 여부
  isNonResident?: boolean;
  
  // 특별 공제 적용
  specialDeductions?: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
}

// 근로소득 간이세액표 구조
export interface SimplifiedTaxTableEntry {
  min: number;
  max: number;
  rates: {
    none: number; // 부양가족 없음
    1: number;    // 부양가족 1명
    2: number;    // 부양가족 2명
    5: number;    // 부양가족 5명
    6: number;    // 부양가족 6명
    7: number;    // 부양가족 7명
    8: number;    // 부양가족 8명
    9: number;    // 부양가족 9명
    10: number;   // 부양가족 10명
    11: number;   // 부양가족 11명 이상
  };
}

// 원천징수세 계산 검증 오류
export interface WithholdingTaxValidationError {
  field: string;
  message: string;
  code: string;
}

// 원천징수세 계산 통계 정보
export interface WithholdingTaxStatistics {
  // 월별 통계
  monthlyStats: Array<{
    month: number;
    totalPayments: number;
    totalTax: number;
    averageRate: number;
  }>;
  
  // 연간 통계
  annualStats: {
    totalPayments: number;
    totalTax: number;
    averageRate: number;
    taxByType: Record<string, number>;
  };
  
  // 비교 정보
  comparison: {
    previousYear?: {
      totalPayments: number;
      totalTax: number;
      changeRate: number;
    };
    industry?: {
      averageRate: number;
      ranking: number;
    };
  };
}

// 가업상속세 관련 타입 정의
export interface BusinessInheritanceInput extends TaxCalculationInput {
  // 기본 상속 정보
  totalInheritanceValue: number;        // 총 상속재산 가액
  businessAssetValue: number;           // 가업용 자산 가액
  personalAssetValue: number;           // 개인 자산 가액
  debtsAndExpenses: number;            // 채무 및 공과금
  
  // 가업 정보
  businessType: 'small' | 'medium';    // 중소기업/중견기업 구분
  businessPeriod: number;              // 업력 (연단위)
  employeeCount: number;               // 종업원 수
  annualRevenue: number;               // 연간 매출액
  
  // 상속인 정보
  inheritorsCount: number;             // 상속인 수
  spouseExists: boolean;               // 배우자 존재 여부
  directDescendants: number;           // 직계비속 수
  relationshipToDeceased: string;      // 피상속인과의 관계
  
  // 사후관리 계획
  continuousManagement: boolean;       // 계속 경영 의사
  employmentMaintenance: boolean;      // 고용 유지 계획
  businessLocationMaintenance: boolean; // 사업장 소재지 유지
  
  // 기타 공제
  hasDisabledPerson: boolean;          // 장애인 상속인 여부
  hasElderlyPerson: boolean;           // 65세 이상 상속인 여부
  hasMinorChildren: boolean;           // 미성년자 상속인 여부
}

export interface BusinessInheritanceResult extends TaxCalculationResult {
  // 가업상속 특화 결과
  businessInheritanceDeduction: number;  // 가업상속공제액
  regularInheritanceTax: number;         // 일반 상속세 (비교용)
  taxSavingAmount: number;               // 절세 효과
  taxSavingRate: number;                 // 절세율
  
  // 사후관리 정보
  managementPeriod: number;              // 사후관리 기간 (년)
  employmentMaintenanceRequired: number; // 고용유지 의무 인원
  penaltyRisk: PenaltyRisk[];           // 사후관리 위반 시 추징 위험
  
  // 연도별 분할납부 계획
  installmentPlan: InstallmentPlan[];   // 분할납부 계획
}

export interface PenaltyRisk {
  violationType: string;                 // 위반 유형
  penaltyRate: number;                  // 추징 세율
  penaltyAmount: number;                // 예상 추징세액
  riskLevel: 'low' | 'medium' | 'high'; // 위험도
}

export interface InstallmentPlan {
  year: number;                         // 납부연도
  amount: number;                       // 납부금액
  dueDate: string;                      // 납부기한
  interestRate: number;                 // 적용 이자율
}

// 가업상속 적격성 검토 결과
export interface EligibilityCheck {
  isEligible: boolean;
  reason?: string;
  requirements: RequirementCheck[];
  warnings: Warning[];
  recommendations: string[];
}

export interface RequirementCheck {
  requirement: string;
  satisfied: boolean;
  description: string;
  importance: 'critical' | 'important' | 'optional';
  documentRequired?: string;
}

export interface Warning {
  type: 'critical' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

// 사후관리 계획
export interface ManagementPlan {
  period: number;
  employmentCount: number;
  risks: PenaltyRisk[];
  obligations: ManagementObligation[];
  timeline: ManagementTimeline[];
}

export interface ManagementObligation {
  category: string;
  obligation: string;
  period: string;
  penalty: string;
  documents: string[];
}

export interface ManagementTimeline {
  year: number;
  tasks: string[];
  deadlines: string[];
  documents: string[];
}

// 실무 체크리스트
export interface PracticalChecklist {
  preApplication: ChecklistItem[];
  duringApplication: ChecklistItem[];
  postApplication: ChecklistItem[];
  requiredDocuments: DocumentCategory[];
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  required: boolean;
  completed: boolean;
  note?: string;
  deadline?: string;
}

export interface DocumentCategory {
  category: string;
  documents: RequiredDocument[];
}

export interface RequiredDocument {
  name: string;
  purpose: string;
  issuer: string;
  validityPeriod?: string;
  required: boolean;
}

// 주식이동세금 통합 계산기 타입 정의 (PRD 기반 고도화)

// 주식이동 통합 입력 인터페이스
export interface StockTransferInput {
  // 주식 기본 정보
  stockType: 'listed' | 'unlisted' | 'kosdaq' | 'konex';
  companyName: string;
  stockQuantity: number;
  pricePerShare: number;
  totalValue: number;
  
  // 보유 현황
  holdingPeriod: number; // 월단위
  holdingYears: number;  // 년단위
  acquisitionPrice: number;
  acquisitionDate: Date;
  marketPrice?: number; // 시장가격 (상장주식)
  
  // 지분 정보 (대주주 판정용)
  totalSharesOutstanding: number;
  personalShareholdingRatio: number;    // 본인 지분율
  spouseShareholdingRatio: number;      // 배우자 지분율
  linealRelativeShareholdingRatio: number; // 직계존비속 지분율
  familyShareholdingRatio: number;      // 특수관계인 포함 지분율
  totalOwnedShares: number;
  
  // 이동 정보
  transferType: 'sale' | 'gift' | 'inheritance' | 'dividend';
  transferPrice?: number;
  transferDate: Date;
  transferExpenses: number; // 양도비용
  
  // 당사자 정보
  transferorAge?: number;
  transfereeAge?: number;
  relationship?: 'spouse' | 'lineal_descendant' | 'lineal_ascendant' | 'sibling' | 'other';
  transfereeResidence: 'domestic' | 'foreign';
  
  // 세무 정보
  hasOtherCapitalGains: boolean;
  previousGiftHistory: GiftHistory[];
  otherIncomeAmount: number;
  comprehensiveIncomeTaxPayer: boolean;
  
  // 평가 정보 (비상장주식)
  netWorthPerShare?: number;     // 순자산가치
  earningsPerShare?: number;     // 순손익가치
  evaluationMethod?: 'supplementary' | 'comparable' | 'dcf';
  
  // 특례 적용
  isStartupStock: boolean;       // 벤처기업주식 여부
  isSmallMediumStock: boolean;   // 중소기업주식 여부
  qualifiesForTaxIncentive: boolean; // 세제혜택 대상 여부
}

export interface GiftHistory {
  date: Date;
  amount: number;
  relationship: string;
  giftType: string;
  deductionUsed: number;
}

// 주식이동 계산 결과
export interface StockTransferResult extends TaxCalculationResult {
  transferType: 'sale' | 'gift' | 'inheritance' | 'dividend';
  
  // 기본 계산
  capitalGain?: number;          // 양도차익
  giftValue?: number;           // 증여재산가액
  inheritanceValue?: number;    // 상속재산가액
  dividendAmount?: number;      // 배당금액
  
  // 대주주 판정
  isLargeShareholder: boolean;
  shareholderStatus: {
    personalRatio: number;
    familyRatio: number;
    valueTest: boolean;
    ratioTest: boolean;
    finalStatus: 'large' | 'small';
  };
  
  // 세율 정보
  appliedTaxRate: number;
  marginalRate: number;
  effectiveRate: number;
  
  // 공제 내역
  basicDeduction?: number;
  longTermDeduction?: number;
  giftDeduction?: number;
  inheritanceDeduction?: number;
  
  // 할증/감면
  surchargeRate?: number;       // 할증세율
  surchargeAmount?: number;     // 할증세액
  taxIncentiveAmount?: number;  // 세제혜택 금액
  
  // 최적화 정보
  netProceeds: number;          // 실수취액
  recommendedAction?: string;   // 권장 행동
  taxSavingOpportunities: TaxSavingTip[];
  
  // 상세 내역
  calculationDetails: StockTransferCalculationDetails;
  comparisonResults?: TransferMethodComparison;
}

export interface StockTransferCalculationDetails {
  shareholderDetermination: {
    tests: ShareholderTest[];
    finalResult: boolean;
    explanation: string;
  };
  
  taxCalculationSteps: CalculationStep[];
  
  applicableIncentives: TaxIncentive[];
  
  riskFactors: string[];
}

export interface ShareholderTest {
  testType: 'ratio' | 'value' | 'family';
  threshold: number;
  actualValue: number;
  passed: boolean;
  description: string;
}

export interface TaxIncentive {
  type: string;
  description: string;
  benefit: number;
  requirements: string[];
  applicable: boolean;
}

export interface TaxSavingTip {
  category: string;
  tip: string;
  potentialSaving: number;
  feasibility: 'high' | 'medium' | 'low';
}

// 이동 방식별 비교
export interface TransferMethodComparison {
  sale: TransferMethodResult;
  gift: TransferMethodResult;
  inheritance: TransferMethodResult;
  dividend?: TransferMethodResult;
  
  recommendation: {
    recommendedMethod: 'sale' | 'gift' | 'inheritance' | 'dividend';
    reason: string;
    taxSaving: number;
    considerations: string[];
  };
}

export interface TransferMethodResult {
  totalTax: number;
  netAmount: number;
  effectiveRate: number;
  timeframe: string;
  requirements: string[];
  risks: string[];
}

// 주식 배당소득세 관련
export interface DividendTaxInput extends StockTransferInput {
  dividendAmount: number;
  dividendType: 'general' | 'qualified' | 'preferred';
  withholdingTaxRate: number;
  sourceCountry: string;
}

export interface DividendTaxResult extends StockTransferResult {
  dividendAmount: number;
  withholdingTax: number;
  comprehensiveInclusion: boolean;
  additionalTax: number;
  refundAmount: number;
  finalNetDividend: number;
} 