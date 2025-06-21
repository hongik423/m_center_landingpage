import { TaxRate } from '@/types/tax-calculator.types';

// 2024년 개인소득세 세율표
export const INCOME_TAX_RATES_2024: TaxRate[] = [
  { min: 0, max: 14000000, rate: 0.06, deduction: 0 },
  { min: 14000000, max: 50000000, rate: 0.15, deduction: 1260000 },
  { min: 50000000, max: 88000000, rate: 0.24, deduction: 5760000 },
  { min: 88000000, max: 150000000, rate: 0.35, deduction: 15440000 },
  { min: 150000000, max: 300000000, rate: 0.38, deduction: 19940000 },
  { min: 300000000, max: 500000000, rate: 0.40, deduction: 25940000 },
  { min: 500000000, max: 1000000000, rate: 0.42, deduction: 35940000 },
  { min: 1000000000, max: Infinity, rate: 0.45, deduction: 65940000 }
];

// 2024년 공제액 정보
export const DEDUCTION_AMOUNTS_2024 = {
  personal: {
    basic: 1500000,           // 기본공제 (본인)
    spouse: 1500000,          // 배우자공제
    dependent: 1500000,       // 부양가족공제
    disabled: 2000000,        // 장애인공제
    elderly: 1000000,         // 경로우대공제
  },
  standard: 130000,           // 표준공제
};

// 근로소득공제 계산을 위한 구간별 정보
export const EARNED_INCOME_DEDUCTION_2024 = {
  rates: [
    { min: 0, max: 5000000, rate: 0.70, maxDeduction: 3500000 },
    { min: 5000000, max: 15000000, rate: 0.40, base: 3500000, maxDeduction: 9500000 },
    { min: 15000000, max: 45000000, rate: 0.15, base: 9500000, maxDeduction: 14000000 },
    { min: 45000000, max: 100000000, rate: 0.05, base: 14000000, maxDeduction: 16750000 },
    { min: 100000000, max: Infinity, rate: 0, base: 20000000, maxDeduction: 20000000 }
  ]
};

// 지방소득세율
export const LOCAL_INCOME_TAX_RATE = 0.1; // 10%

// 2024년 공제 한도 정보
export const DEDUCTION_LIMITS_2024 = {
  // 소득공제 한도
  personalPension: 7000000,           // 개인연금 납입한도: 연 700만원
  housingFund: 2400000,              // 주택청약종합저축: 연 240만원
  medicalExpenseRate: 0.03,          // 의료비: 총급여의 3% 초과분
  creditCardRate: 0.25,              // 신용카드: 총급여의 25% 초과분
  creditCardLimit: 3000000,          // 신용카드 공제한도: 300만원
  
  // 세액공제 한도
  pensionSavingsTaxCredit: 945000,   // 연금저축 세액공제 한도: 94.5만원
  housingFundTaxCredit: 240000,      // 주택청약 세액공제 한도: 24만원
  
  // 교육비 공제 한도 (연간)
  educationSelf: Infinity,           // 본인: 무제한
  educationChild: 3000000,           // 자녀 1명당: 300만원
  educationKindergarten: 3000000,    // 유치원생 1명당: 300만원
  
  // 기부금 공제 한도
  donationReligious: 0.1,            // 종교단체: 소득금액의 10%
  donationGeneral: 0.15,             // 일반기부금: 소득금액의 15%
  donationPolitical: 0.1,            // 정치자금: 소득금액의 10%
  
  // 인적공제 관련
  dependentAgeLimit: 20,             // 부양가족 나이제한
  elderlyAgeLimit: 70,               // 경로우대 나이제한
};

// 소득구간별 정보
export const INCOME_BRACKETS_2024 = {
  lowIncome: 35000000,               // 저소득층 기준: 3500만원
  middleIncome: 70000000,            // 중간소득층 기준: 7000만원
  highIncome: 120000000,             // 고소득층 기준: 1억 2천만원
};

// 종합소득세 관련 한도 및 기준 (2024년)
export const COMPREHENSIVE_TAX_LIMITS_2024 = {
  // 금융소득종합과세
  financialIncomeThreshold: 20000000,    // 금융소득 2000만원 기준
  
  // 사업소득 관련
  businessExpenseRates: {
    retail: 0.25,                        // 소매업: 25%
    wholesale: 0.20,                     // 도매업: 20%
    manufacturing: 0.20,                 // 제조업: 20%
    service: 0.40,                       // 서비스업: 40%
    professional: 0.60,                  // 전문직: 60%
    general: 0.30,                       // 일반사업: 30%
  },
  
  // 부동산임대소득
  rentalIncome: {
    smallScaleThreshold: 20000000,       // 소규모 임대사업자 기준: 2000만원
    registeredBenefitRate: 0.30,         // 등록임대사업자 30% 세액감면
    standardExpenseRate: 0.60,           // 임대소득 기본 경비율: 60%
    maintenanceExpenseLimit: 0.30,       // 수선비 한도: 임대수입의 30%
  },
  
  // 연금소득 공제 구간
  pensionDeduction: {
    firstBracket: { min: 0, max: 3500000, rate: 0.40 },
    secondBracket: { min: 3500000, max: 7000000, rate: 0.20, base: 1400000 },
    thirdBracket: { min: 7000000, max: 14000000, rate: 0.10, base: 2100000 },
    fourthBracket: { min: 14000000, max: Infinity, rate: 0.05, base: 2800000 },
  },
  
  // 기타소득 관련
  otherIncome: {
    basicDeduction: 3000000,             // 기타소득 기본공제: 300만원
    expenseRate: 0.60,                   // 기타소득 경비율: 60%
    maxExpense: 1200000,                 // 경비 최대한도: 120만원
  },
  
  // 종합소득공제 한도
  comprehensiveDeductions: {
    pensionInsurance: 7000000,           // 연금보험료: 700만원
    specialDeductionMin: 1300000,        // 특별공제 최소금액: 130만원 (표준공제)
    
    // 의료비
    medicalExpenseRate: 0.03,            // 총소득의 3%
    medicalExpenseLimit: Infinity,       // 한도 없음
    
    // 교육비 한도
    educationSelf: Infinity,             // 본인: 무제한
    educationChild: 3000000,             // 자녀당: 300만원
    educationKindergarten: 3000000,      // 유치원생당: 300만원
    
    // 기부금 한도
    donationLimit: 0.30,                 // 소득금액의 30%
    religiousDonationLimit: 0.10,        // 종교단체: 소득금액의 10%
    
    // 신용카드 등
    creditCardRate: 0.25,                // 총급여의 25%
    creditCardLimit: 3000000,            // 최대 300만원
  },
  
  // 세액공제 한도
  taxCredits: {
    pensionSavings: 9450000,             // 연금저축 납입한도: 945만원
    pensionSavingsCreditRate: 0.135,     // 세액공제율: 13.5%
    pensionSavingsCreditLimit: 945000,   // 세액공제 한도: 94.5만원
    
    childTaxCredit: 150000,              // 자녀 1명당: 15만원
    earnedIncomeTaxCreditLimit: 740000,  // 근로소득세액공제 한도: 74만원
  }
};

// 양도소득세 관련 상수 (2024년)
export const CAPITAL_GAINS_TAX_2024 = {
  // 기본공제
  basicDeduction: 2500000,                 // 기본공제: 250만원
  
  // 장기보유특별공제율 (보유기간별)
  longTermDeduction: {
    residential: {
      // 거주용 부동산
      3: 0.24,   // 3년 이상: 24%
      4: 0.32,   // 4년 이상: 32%
      5: 0.40,   // 5년 이상: 40%
      6: 0.48,   // 6년 이상: 48%
      7: 0.56,   // 7년 이상: 56%
      8: 0.64,   // 8년 이상: 64%
      9: 0.72,   // 9년 이상: 72%
      10: 0.80   // 10년 이상: 80%
    },
    nonResidential: {
      // 비거주용 부동산
      3: 0.06,   // 3년 이상: 6%
      4: 0.12,   // 4년 이상: 12%
      5: 0.18,   // 5년 이상: 18%
      6: 0.24,   // 6년 이상: 24%
      7: 0.30,   // 7년 이상: 30%
      8: 0.36,   // 8년 이상: 36%
      9: 0.42,   // 9년 이상: 42%
      10: 0.48   // 10년 이상: 48%
    }
  },
  
  // 1세대1주택 특별공제
  oneHouseDeduction: {
    exemptionThreshold: 900000000,         // 9억원 (비과세 기준)
    deductionByAge: {
      under15: 0,                          // 15년 미만: 0%
      15: 0.20,                            // 15년 이상: 20%
      20: 0.40,                            // 20년 이상: 40%
      25: 0.50,                            // 25년 이상: 50%
      30: 0.60                             // 30년 이상: 60%
    },
    maxDeduction: 300000000                // 최대 3억원
  },
  
  // 양도소득세율
  taxRates: {
    basic: [
      { min: 0, max: 14000000, rate: 0.06 },        // 1,400만원 이하: 6%
      { min: 14000000, max: 50000000, rate: 0.15 }, // 5,000만원 이하: 15%
      { min: 50000000, max: 88000000, rate: 0.24 }, // 8,800만원 이하: 24%
      { min: 88000000, max: 150000000, rate: 0.35 },// 1억5천만원 이하: 35%
      { min: 150000000, max: 300000000, rate: 0.38 },// 3억원 이하: 38%
      { min: 300000000, max: 500000000, rate: 0.40 },// 5억원 이하: 40%
      { min: 500000000, max: 1000000000, rate: 0.42 },// 10억원 이하: 42%
      { min: 1000000000, max: Infinity, rate: 0.45 } // 10억원 초과: 45%
    ],
    
    // 중과세율 (다주택자)
    multipleHousesRate: 0.20,              // 기본세율에 20%p 가산
    
    // 미등기전매 중과세율
    unregisteredSaleRate: 0.70,            // 70%
    
    // 조정대상지역 중과세율
    adjustmentAreaRate: 0.20,              // 기본세율에 20%p 가산
    
    // 재개발/재건축 중과세율
    reconstructionRate: 0.20,              // 기본세율에 20%p 가산
    
    // 비거주자 세율
    nonResidentRate: [
      { min: 0, max: Infinity, rate: 0.30 } // 일괄 30%
    ]
  },
  
  // 지방소득세율
  localIncomeTaxRate: 0.10,                // 양도소득세의 10%
  
  // 비과세 기준
  exemptions: {
    oneHouseExemption: 900000000,          // 1세대1주택 9억원 비과세
    ruralLandExemption: 10000000,          // 농지 1,000만원 비과세
    
    // 실거주 요건
    residenceRequirement: {
      minYears: 2,                         // 최소 2년 거주
      within5Years: true                   // 양도일 기준 5년 이내 거주
    }
  },
  
  // 부대비용 인정 비율
  incidentalCosts: {
    // 취득 시
    acquisitionCosts: {
      registrationTax: true,               // 등록세
      stampDuty: true,                     // 인지세
      brokerageFee: true,                  // 중개수수료
      legalFee: true                       // 법무사 수수료
    },
    
    // 보유 시 (개량비)
    improvementCosts: {
      renovation: true,                    // 개량비
      extension: true,                     // 증축비
      capitalRepair: true                  // 자본적지출
    },
    
    // 양도 시
    transferCosts: {
      brokerageFee: true,                  // 중개수수료
      stampDuty: true,                     // 인지세
      advertisingCost: true                // 광고비
    }
  },
  
  // 추정 취득가액 (실제 취득가액을 확인할 수 없는 경우)
  estimatedAcquisitionValue: {
    // 기준시가 x 환산율
    conversionRate: {
      before1990: 0.40,                    // 1990년 이전: 40%
      '1990to1997': 0.50,                  // 1990~1997년: 50%
      '1998to2002': 0.70,                  // 1998~2002년: 70%
      '2003to2005': 0.80,                  // 2003~2005년: 80%
      after2006: 0.90                     // 2006년 이후: 90%
    }
  }
};

// 상속세 관련 상수 (2024년)
export const INHERITANCE_TAX_2024 = {
  // 상속세 세율표
  taxRates: [
    { min: 0, max: 100000000, rate: 0.10, deduction: 0 },           // 1억원 이하: 10%
    { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },   // 5억원 이하: 20%
    { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },  // 10억원 이하: 30%
    { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 }, // 30억원 이하: 40%
    { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }    // 30억원 초과: 50%
  ],
  
  // 인적공제
  personalDeductions: {
    basic: 200000000,                      // 기초공제: 2억원
    spouse: 500000000,                     // 배우자공제: 5억원 (최소한도)
    children: 50000000,                    // 자녀공제: 자녀 1명당 5천만원
    minorChildren: 10000000,               // 미성년자공제: 미성년 연수 × 1천만원
    disabled: 10000000,                    // 장애인공제: 기대여명 × 1천만원
    elderly: 5000000,                      // 65세 이상 공제: 1명당 5백만원
  },
  
  // 물적공제
  propertyDeductions: {
    funeralExpenses: 5000000,              // 장례비용: 5백만원 한도
    charityDonation: Infinity,             // 공익사업용재산: 전액공제
    
    // 일괄공제 (인적공제 대신 선택 가능)
    lumpSumDeduction: 500000000,           // 일괄공제: 5억원 한도
  },
  
  // 배우자 상속공제 (법정상속분과 5억원 중 큰 금액)
  spouseInheritanceDeduction: {
    minimumAmount: 500000000,              // 최소 5억원
    legalShareRatio: {                     // 법정상속분
      withChildren: 0.5,                   // 배우자 + 자녀: 1/2
      withParents: 0.667,                  // 배우자 + 직계존속: 2/3
      withSiblings: 0.667,                 // 배우자 + 형제자매: 2/3
      alone: 1.0                           // 배우자 단독: 전부
    }
  },
  
  // 증여세액공제
  giftTaxCredit: {
    within10Years: 1.0,                    // 10년 내 증여세: 100% 공제
    marriageGift: {                        // 혼인증여공제
      child: 100000000,                    // 자녀: 1억원
      otherRelative: 50000000              // 기타: 5천만원
    }
  },
  
  // 할증 및 감면
  taxAdjustments: {
    // 신속상속공제 (상속개시 후 신속처리)
    rapidInheritanceDiscount: {
      within6Months: 0.20,                 // 6개월 이내: 20% 공제
      within9Months: 0.10,                 // 9개월 이내: 10% 공제
    },
    
    // 가업승계 공제
    familyBusinessDeduction: {
      generalRate: 0.30,                   // 일반 가업승계: 30% 공제
      maxDeduction: 2000000000,            // 최대 20억원
      requirements: {
        holdingPeriod: 10,                 // 10년 이상 보유
        continuationPeriod: 7              // 7년 이상 계속 경영
      }
    },
    
    // 농지 등 감면
    farmLandDiscount: {
      selfCultivation: 0.20,               // 자경농지: 20% 감면
      maxDeduction: 200000000,             // 최대 2억원
      requirements: {
        cultivationYears: 8,               // 8년 이상 자경
        continuationYears: 5               // 5년 이상 계속 경영
      }
    },
    
    // 문화재 등 감면
    culturalAssetDiscount: {
      generalRate: 0.30,                   // 일반 문화재: 30% 감면
      designatedRate: 0.70,                // 지정문화재: 70% 감면
    }
  },
  
  // 납세의무 및 신고
  taxObligations: {
    // 신고 및 납부기한
    filingDeadline: 6,                     // 상속개시일로부터 6개월
    extensionPeriod: 3,                    // 3개월 연장 가능
    
    // 분할납부
    installmentPayment: {
      minimumTax: 2000000,                 // 최소 200만원 이상
      maxInstallments: 5,                  // 최대 5회 분할
      interestRate: 0.036,                 // 연 3.6% (2024년 기준)
    },
    
    // 납세유예
    taxDeferral: {
      qualifyingAssets: ['farmLand', 'forestLand', 'culturalAsset'], // 유예 가능 자산
      deferralPeriod: 5,                   // 5년간 유예
      interestRate: 0.018,                 // 연 1.8%
    }
  },
  
  // 과세대상 자산 평가
  assetValuation: {
    // 부동산 평가
    realEstate: {
      publicNoticePrice: 1.0,              // 공시지가/공시가격 기준
      marketPriceRatio: 0.7,               // 시가표준액의 70%
    },
    
    // 주식 평가
    stock: {
      listedStock: 'closingPrice',         // 상장주식: 종가
      unlistedStock: 'netAssetValue',      // 비상장주식: 순자산가치
      
      // 할인율 (소액주주)
      minorityDiscount: {
        under3Percent: 0.20,               // 3% 미만: 20% 할인
        under10Percent: 0.10,              // 10% 미만: 10% 할인
        over10Percent: 0                   // 10% 이상: 할인 없음
      }
    },
    
    // 골프회원권 등
    membershipRights: {
      golfMembership: 'marketPrice',       // 시가
      countryClub: 'marketPrice'           // 시가
    }
  },
  
  // 국외재산 과세
  foreignAssets: {
    declarationThreshold: 1000000000,      // 10억원 초과 시 신고
    taxRate: 'domesticRate',               // 국내세율 적용
    
    // 외국납부세액공제
    foreignTaxCredit: {
      creditRate: 1.0,                     // 100% 공제
      carryForwardPeriod: 5                // 5년간 이월공제
    }
  },
  
  // 증여재산 합산과세
  giftAddition: {
    additionPeriod: 10,                    // 10년 내 증여재산 합산
    progressiveApplication: true,          // 누진세율 적용
    
    // 증여세 기납부액 공제
    giftTaxPaidCredit: 1.0                 // 100% 공제
  }
};

// 상속세 입력 한도 및 검증 기준 (2024년)
export const INHERITANCE_TAX_LIMITS_2024 = {
  // 금액 한도
  maxInheritanceAmount: 100000000000,        // 1000억원 (현실적 상한선)
  maxDebtAmount: 50000000000,                // 500억원 (채무 상한선)
  funeralExpenseLimit: 5000000,              // 장례비 5백만원 한도
  maxGiftAmount: 50000000000,                // 증여재산 500억원 상한선
  
  // 인원 한도
  maxChildren: 20,                           // 자녀 수 현실적 상한선
  maxMinorChildren: 20,                      // 미성년자 자녀 상한선
  maxDisabledHeirs: 20,                      // 장애인 상속인 상한선
  maxElderlyHeirs: 20,                       // 65세이상 상속인 상한선
  
  // 나이 제한
  minAge: 0,                                 // 최소 나이
  maxAge: 120,                               // 최대 나이
  adultAge: 19,                              // 성인 기준 나이
  elderlyAge: 65,                            // 고령자 기준 나이
  
  // 비율 제한
  minInheritanceRatio: 0,                    // 최소 상속비율 0%
  maxInheritanceRatio: 1,                    // 최대 상속비율 100%
  
  // 실시간 안내 메시지
  messages: {
    funeralExpense: "상속세법상 장례비용은 5백만원 한도로 공제됩니다.",
    basicDeduction: "기초공제는 모든 상속에 2억원이 자동으로 적용됩니다.",
    spouseDeduction: "배우자공제는 최소 5억원이며, 법정상속분과 비교하여 큰 금액이 적용됩니다.",
    childrenDeduction: "자녀공제는 1명당 5천만원씩 적용됩니다.",
    minorDeduction: "미성년자공제는 (19세 - 현재나이) × 1천만원으로 계산됩니다.",
    disabledDeduction: "장애인공제는 기대여명 × 1천만원으로 계산됩니다.",
    elderlyDeduction: "65세 이상 상속인은 1명당 5백만원 공제가 적용됩니다.",
    lumpSumDeduction: "일괄공제(5억원)와 개별공제 중 유리한 방법이 자동 선택됩니다.",
    giftAddition: "10년 내 증여재산은 상속재산에 합산하여 과세됩니다.",
    installmentPayment: "상속세가 200만원 이상일 때 최대 5회 분할납부가 가능합니다.",
    taxRates: "상속세율은 1억원 이하 10%부터 30억원 초과 50%까지 누진세율이 적용됩니다."
  }
};

// 증여세 관련 상수 (2024년)
// 가업상속세 계산기에서 사용할 상속세율
export const INHERITANCE_TAX_RATES = INHERITANCE_TAX_2024.taxRates;

export const GIFT_TAX_2024 = {
  // 증여세 세율표 (상속세와 동일)
  taxRates: [
    { min: 0, max: 100000000, rate: 0.10, deduction: 0 },           // 1억원 이하: 10%
    { min: 100000000, max: 500000000, rate: 0.20, deduction: 10000000 },   // 5억원 이하: 20%
    { min: 500000000, max: 1000000000, rate: 0.30, deduction: 60000000 },  // 10억원 이하: 30%
    { min: 1000000000, max: 3000000000, rate: 0.40, deduction: 160000000 }, // 30억원 이하: 40%
    { min: 3000000000, max: Infinity, rate: 0.50, deduction: 460000000 }    // 30억원 초과: 50%
  ],
  
  // 증여재산공제 (관계별)
  relationshipDeductions: {
    spouse: 600000000,                     // 배우자: 6억원
    linealDescendant: 50000000,            // 직계비속(자녀): 5천만원
    linealAscendant: 50000000,             // 직계존속(부모): 5천만원
    minorChild: 20000000,                  // 미성년자 자녀: 2천만원
    other: 10000000,                       // 기타: 1천만원
  },
  
  // 특별 증여공제
  specialDeductions: {
    // 혼인증여공제
    marriageGift: {
      child: 100000000,                    // 자녀: 1억원
      otherLineal: 50000000,               // 기타 직계비속: 5천만원
    },
    
    // 교육비증여공제
    educationGift: {
      domesticEducation: 30000000,         // 국내 교육비: 3천만원
      foreignEducation: 50000000,          // 해외 교육비: 5천만원
    },
    
    // 창업자금증여공제
    startupGift: {
      generalStartup: 100000000,           // 일반 창업자금: 1억원
      techStartup: 200000000,              // 기술창업자금: 2억원
    }
  },
  
  // 10년 합산과세
  cumulativePeriod: 10,                    // 합산기간: 10년
  
  // 증여세 신고 및 납부
  filingAndPayment: {
    filingDeadline: 3,                     // 증여일로부터 3개월 이내 신고
    paymentDeadline: 3,                    // 증여일로부터 3개월 이내 납부
    
    // 분할납부
    installmentPayment: {
      minimumTax: 2000000,                 // 최소 200만원 이상
      maxInstallments: 5,                  // 최대 5회 분할
      interestRate: 0.036,                 // 연 3.6%
    }
  },
  
  // 할증 및 감면
  taxAdjustments: {
    // 가업승계 공제
    familyBusinessDeduction: {
      generalRate: 0.30,                   // 일반 가업승계: 30% 공제
      maxDeduction: 3000000000,            // 최대 30억원
    },
    
    // 농지 등 감면
    farmLandDiscount: {
      selfCultivation: 0.20,               // 자경농지: 20% 감면
      maxDeduction: 200000000,             // 최대 2억원
    },
    
    // 문화재 등 감면
    culturalAssetDiscount: {
      generalRate: 0.30,                   // 일반 문화재: 30% 감면
      designatedRate: 0.70,                // 지정문화재: 70% 감면
    },
    
    // 창업자금 감면
    startupDiscount: {
      generalRate: 0.50,                   // 일반 창업자금: 50% 감면
      techRate: 0.70,                      // 기술창업자금: 70% 감면
    }
  },
  
  // 증여재산 평가
  assetValuation: {
    // 부동산 평가
    realEstate: {
      publicNoticePrice: 1.0,              // 공시지가/공시가격 기준
      marketPriceRatio: 0.8,               // 시가표준액의 80%
    },
    
    // 주식 평가
    stock: {
      listedStock: 'averageClosingPrice',  // 상장주식: 평균 종가
      unlistedStock: 'netAssetValue',      // 비상장주식: 순자산가치
      
      // 할인율
      minorityDiscount: {
        under3Percent: 0.20,               // 3% 미만: 20% 할인
        under10Percent: 0.10,              // 10% 미만: 10% 할인
      }
    }
  },
  
  // 부담부증여
  conditionalGift: {
    debtAssumption: true,                  // 채무인수 인정
    taxBurdenDeduction: true,              // 세금부담 차감
  },
  
  // 절세 전략
  taxSavingStrategies: {
    annualGiftLimit: {
      spouse: 600000000,                   // 배우자 연간 한도
      child: 50000000,                     // 자녀 연간 한도
      grandchild: 50000000,                // 손자녀 연간 한도
    },
    
    // 생전증여 vs 상속 비교
    giftVsInheritance: {
      giftAdvantage: 'propertyAppreciation', // 재산가치 상승 시 증여 유리
      inheritanceAdvantage: 'propertyDepreciation', // 재산가치 하락 시 상속 유리
    }
  }
};

// 증여세 입력 한도 및 검증 기준 (2024년) - 고도화 버전
export const GIFT_TAX_LIMITS_2024 = {
  // 금액 한도
  maxGiftAmount: 100000000000,             // 1000억원 (현실적 상한선)
  maxPreviousGifts: 10,                    // 최대 이전 증여 기록 수
  
  // 관계별 공제 한도 (연간 기준)
  relationshipLimits: {
    spouse: {
      annual: 600000000,                   // 배우자: 연간 6억원
      lifetime: Infinity,                  // 평생 무제한
      period: 10,                          // 합산 기간 10년
      description: "배우자간 증여는 연간 6억원까지 공제되며, 10년 합산과세 적용"
    },
    linealDescendant: {
      annual: 50000000,                    // 직계비속: 연간 5천만원
      lifetime: Infinity,                  // 평생 무제한
      period: 10,                          // 합산 기간 10년
      minorBonus: 20000000,                // 미성년자 추가 공제 2천만원
      description: "직계비속(자녀)은 연간 5천만원, 미성년자는 추가 2천만원 공제"
    },
    linealAscendant: {
      annual: 50000000,                    // 직계존속: 연간 5천만원
      lifetime: Infinity,                  // 평생 무제한
      period: 10,                          // 합산 기간 10년
      description: "직계존속(부모)으로부터 연간 5천만원까지 공제"
    },
    other: {
      annual: 10000000,                    // 기타: 연간 1천만원
      lifetime: Infinity,                  // 평생 무제한
      period: 10,                          // 합산 기간 10년
      description: "기타 관계는 연간 1천만원까지 공제"
    }
  },
  
  // 특별공제 한도
  specialDeductionLimits: {
    marriage: {
      child: 100000000,                    // 자녀: 1억원
      otherLineal: 50000000,               // 기타 직계비속: 5천만원
      requirements: "혼인일로부터 2년 이내 증여",
      period: "평생 1회",
      description: "혼인증여공제는 혼인일 기준 2년 이내 증여분에 대해 평생 1회 적용"
    },
    education: {
      domestic: 30000000,                  // 국내 교육비: 3천만원
      foreign: 50000000,                   // 해외 교육비: 5천만원
      requirements: "교육기관 직접 납부",
      period: "연간",
      ageLimit: 30,                        // 수증자 나이 제한 30세
      description: "교육비는 교육기관에 직접 납부한 경우만 공제, 30세 이하 제한"
    },
    startup: {
      general: 100000000,                  // 일반 창업자금: 1억원
      tech: 200000000,                     // 기술창업자금: 2억원
      requirements: "창업 후 3년 이상 사업 유지",
      period: "평생 1회",
      ageLimit: 40,                        // 수증자 나이 제한 40세
      description: "창업자금은 실제 창업에 사용되고 3년 이상 사업 유지 시 공제"
    }
  },
  
  // 나이 제한
  ageRestrictions: {
    minAge: 0,                             // 최소 나이
    maxAge: 120,                           // 최대 나이
    minorAge: 19,                          // 미성년 기준 나이
    educationMaxAge: 30,                   // 교육비공제 최대 나이
    startupMaxAge: 40,                     // 창업자금공제 최대 나이
    seniorAge: 65,                         // 고령자 기준 나이
  },
  
  // 할인 및 감면 한도
  discountLimits: {
    familyBusiness: {
      rate: 0.30,                          // 30% 감면
      maxAmount: 3000000000,               // 최대 30억원
      requirements: [
        "10년 이상 보유",
        "7년 이상 계속 경영",
        "중소기업 기준 충족"
      ],
      description: "가족기업 감면은 최대 30% 또는 30억원 한도"
    },
    farmLand: {
      rate: 0.20,                          // 20% 감면
      maxAmount: 200000000,                // 최대 2억원
      requirements: [
        "8년 이상 자경",
        "5년 이상 계속 경영",
        "농지법상 자격 요건"
      ],
      description: "농지 감면은 최대 20% 또는 2억원 한도"
    },
    culturalAsset: {
      generalRate: 0.30,                   // 일반 문화재: 30% 감면
      designatedRate: 0.70,                // 지정 문화재: 70% 감면
      requirements: [
        "문화재보호법상 지정",
        "보존 의무 이행"
      ],
      description: "문화재 감면은 지정 여부에 따라 30% 또는 70%"
    }
  },
  
  // 10년 합산과세 관련 한도
  cumulativeTaxLimits: {
    period: 10,                            // 합산 기간 10년
    maxRecords: 20,                        // 최대 증여 기록 수
    prescriptionPeriod: 5,                 // 제척기간 5년
    description: "동일인으로부터 10년 내 증여는 모두 합산하여 누진세율 적용"
  },
  
  // 부담부증여 한도
  conditionalGiftLimits: {
    maxBurdenRatio: 0.80,                  // 최대 부담 비율 80%
    minGiftRatio: 0.20,                    // 최소 순증여 비율 20%
    requirements: [
      "부담액이 증여액의 80%를 초과할 수 없음",
      "순증여액이 20% 이상이어야 함"
    ],
    description: "부담부증여는 부담액이 80%를 초과하면 증여로 보지 않음"
  },
  
  // 신고 및 납부 한도
  filingLimits: {
    exemptionThreshold: 0,                 // 신고 면제 기준액 (없음)
    installmentMinimum: 2000000,           // 분할납부 최소액 200만원
    maxInstallments: 5,                    // 최대 분할 횟수 5회
    deferralMinimum: 10000000,             // 납세유예 최소액 1천만원
    interestRate: 0.036,                   // 연리 3.6%
    description: "모든 증여는 신고 의무, 200만원 이상 시 분할납부 가능"
  },
  
  // 실시간 안내 메시지 (고도화)
  messages: {
    // 기본 안내
    relationshipDeduction: "증여자와 수증자의 관계에 따라 공제액이 달라집니다.",
    cumulativeTaxation: "10년 내 동일인으로부터의 증여는 합산하여 누진세율이 적용됩니다.",
    
    // 공제별 상세 안내
    spouseGift: "배우자간 증여는 연간 6억원까지 공제되며, 평생 무제한 증여 가능합니다.",
    childGift: "자녀에게는 연간 5천만원, 미성년 자녀는 추가 2천만원 공제됩니다.",
    parentGift: "부모로부터는 연간 5천만원까지 공제받을 수 있습니다.",
    
    // 특별공제 안내
    marriageGift: "혼인증여는 혼인일로부터 2년 이내 증여분에 대해 평생 1회 공제됩니다.",
    educationGift: "교육비는 교육기관에 직접 납부한 경우만 공제되며, 30세 이하만 가능합니다.",
    startupGift: "창업자금은 실제 창업에 사용되고 3년 이상 사업 유지 시 공제됩니다.",
    
    // 절차 및 기한 안내
    filingDeadline: "증여세는 증여일로부터 3개월 이내에 신고·납부해야 합니다.",
    installmentPayment: "증여세가 200만원 이상일 때 최대 5회 분할납부가 가능합니다.",
    
    // 세율 및 계산 안내
    taxRates: "증여세율은 1억원 이하 10%부터 30억원 초과 50%까지 누진세율이 적용됩니다.",
    progressiveRate: "10년 합산금액이 클수록 더 높은 세율이 적용되므로 분할증여를 권장합니다.",
    
    // 절세 전략 안내
    taxSaving: "관계별 연간 한도를 활용한 분할증여가 가장 효과적인 절세 방법입니다.",
    timing: "재산 가치가 낮을 때 증여하면 향후 가치 상승분에 대한 세금을 절약할 수 있습니다."
  },
  
  // 경고 메시지
  warnings: {
    excessiveAmount: "한 번에 많은 금액을 증여하면 높은 세율이 적용됩니다.",
    cumulativeRisk: "기존 증여 이력이 있으면 합산하여 더 높은 세율이 적용될 수 있습니다.",
    conditionalGift: "부담부증여는 부담액이 너무 크면 증여로 인정받지 못할 수 있습니다.",
    filingRequired: "증여금액과 관계없이 모든 증여는 3개월 이내 신고해야 합니다.",
    specialRequirements: "특별공제는 까다로운 요건이 있으므로 사전에 충족 여부를 확인하세요."
  }
};

// 법인세 관련 상수 (2024년)
export const CORPORATE_TAX_2024 = {
  // 법인세 세율표
  taxRates: [
    { min: 0, max: 200000000, rate: 0.10, description: '2억원 이하: 10%' },           // 2억원 이하: 10%
    { min: 200000000, max: 20000000000, rate: 0.20, description: '200억원 이하: 20%' }, // 200억원 이하: 20%
    { min: 20000000000, max: 300000000000, rate: 0.22, description: '3000억원 이하: 22%' }, // 3000억원 이하: 22%
    { min: 300000000000, max: Infinity, rate: 0.25, description: '3000억원 초과: 25%' }    // 3000억원 초과: 25%
  ],

  // 중소기업 특례세율 (2024년)
  smallBusinessRates: [
    { min: 0, max: 200000000, rate: 0.10, description: '2억원 이하: 10%' },           // 2억원 이하: 10%
    { min: 200000000, max: 20000000000, rate: 0.20, description: '200억원 이하: 20%' }, // 200억원 이하: 20%
    { min: 20000000000, max: Infinity, rate: 0.22, description: '200억원 초과: 22%' }    // 200억원 초과: 22%
  ],

  // 중소기업 판정 기준
  smallBusinessCriteria: {
    // 업종별 매출액 기준 (단위: 원)
    salesCriteria: {
      manufacturing: 120000000000,        // 제조업: 1200억원
      mining: 120000000000,               // 광업: 1200억원
      construction: 120000000000,         // 건설업: 1200억원
      transportation: 120000000000,       // 운수업: 1200억원
      wholesale: 80000000000,             // 도매업: 800억원
      retail: 30000000000,                // 소매업: 300억원
      service: 30000000000,               // 서비스업: 300억원
      software: 30000000000,              // 소프트웨어업: 300억원
      other: 30000000000                  // 기타: 300억원
    },
    
    // 자산총액 기준 (단위: 원)
    assetCriteria: 50000000000,           // 500억원

    // 업종별 종업원 수 기준
    employeeCriteria: {
      manufacturing: 300,                 // 제조업: 300명
      construction: 300,                  // 건설업: 300명
      transportation: 300,                // 운수업: 300명
      software: 300,                      // 소프트웨어업: 300명
      service: 200,                       // 서비스업: 200명
      wholesale: 100,                     // 도매업: 100명
      retail: 50,                         // 소매업: 50명
      other: 50                           // 기타: 50명
    }
  },

  // 각종 공제 및 감면
  deductions: {
    // 기본공제
    basicDeductions: {
      charitableDonation: {
        rate: 1.0,                        // 전액공제
        description: "공익법인 등에 지급하는 기부금"
      },
      specialDeduction: {
        rate: 0.50,                       // 50% 한도
        description: "지정기부금 등 특별공제"
      }
    },

    // 손익 관련
    lossCarryForward: {
      period: 10,                         // 10년간 이월
      description: "결손금의 소급공제 및 이월공제"
    },

    // 준비금 및 충당금
    reserves: {
      badDebtReserve: {
        rate: 0.001,                      // 0.1%
        description: "대손충당금 한도"
      },
      retirementReserve: {
        description: "퇴직급여충당금"
      }
    }
  },

  // 세액공제
  taxCredits: {
    // 연구개발비 세액공제
    rdCredit: {
      smallBusiness: {
        generalRate: 0.30,                // 일반: 30%
        newGrowthRate: 0.40,              // 신성장원동력: 40%
        coreRate: 0.40,                   // 원천기술: 40%
        maxCredit: 2000000000             // 최대 20억원
      },
      largeBusiness: {
        generalRate: 0.20,                // 일반: 20%
        newGrowthRate: 0.30,              // 신성장원동력: 30%
        coreRate: 0.30,                   // 원천기술: 30%
        maxCredit: 10000000000            // 최대 100억원
      }
    },

    // 설비투자 세액공제
    equipmentCredit: {
      smallBusiness: {
        generalRate: 0.10,                // 일반설비: 10%
        safetyRate: 0.20,                 // 안전설비: 20%
        environmentRate: 0.20,            // 환경설비: 20%
        energyRate: 0.20                  // 에너지절약설비: 20%
      },
      largeBusiness: {
        generalRate: 0.07,                // 일반설비: 7%
        safetyRate: 0.10,                 // 안전설비: 10%
        environmentRate: 0.10,            // 환경설비: 10%
        energyRate: 0.10                  // 에너지절약설비: 10%
      }
    },

    // 고용증대 세액공제
    employmentCredit: {
      regularEmployee: {
        young: 1100000,                   // 청년 정규직: 110만원
        disabled: 1800000,                // 장애인: 180만원
        general: 800000,                  // 일반: 80만원
        elderly: 900000                   // 고령자: 90만원
      },
      requirements: {
        minEmploymentPeriod: 12,          // 최소 고용기간: 12개월
        minIncreaseRate: 0.05             // 최소 증가율: 5%
      }
    },

    // 창업기업 세액공제
    startupCredit: {
      smallBusiness: {
        rate: 0.50,                       // 50% 공제
        maxCredit: 1000000000,            // 최대 10억원
        period: 5                         // 5년간
      },
      requirements: {
        establishmentPeriod: 3,           // 설립 후 3년 이내
        minInvestment: 100000000          // 최소 투자액: 1억원
      }
    }
  },

  // 신고 및 납부
  filing: {
    // 신고기한
    filingDeadline: {
      annual: 3,                          // 사업연도 종료일로부터 3개월
      interim: 2                          // 중간예납: 2개월
    },

    // 납부방법
    payment: {
      fullPayment: "일시납부",
      installment: {
        maxInstallments: 6,               // 최대 6회 분할
        minimumTax: 10000000,             // 최소 1천만원 이상
        interestRate: 0.036               // 연 3.6%
      }
    },

    // 중간예납
    interimPayment: {
      rate: 0.50,                         // 50%
      minimumTax: 200000,                 // 최소 20만원
      exemptionThreshold: 200000          // 면제기준: 20만원
    }
  },

  // 가산세
  penalties: {
    // 무신고 가산세
    nonFiling: {
      general: 0.20,                      // 일반: 20%
      fraudulent: 0.40                    // 부정: 40%
    },

    // 과소신고 가산세
    underReporting: {
      general: 0.10,                      // 일반: 10%
      fraudulent: 0.40                    // 부정: 40%
    },

    // 납부지연 가산세
    latePayment: {
      dailyRate: 0.025 / 365,             // 일 0.025%
      maxRate: 0.25                       // 최대 25%
    }
  },

  // 기타 특례
  specialProvisions: {
    // 비과세 소득
    exemptIncome: {
      municipalBond: "지방채 이자소득",
      foreignIncome: "외국법인세액공제 대상소득",
      dividend: "투자회사 배당소득"
    },

    // 손금불산입
    nonDeductible: {
      entertainment: {
        limit: 12000000,                  // 연간 1200만원
        rateLimit: 0.002                  // 매출액의 0.2%
      },
      penalty: "벌금, 과료, 과태료",
      donation: "정치자금, 종교단체 기부금"
    },

    // 이월공제
    carryForward: {
      loss: 10,                           // 결손금: 10년
      foreignTaxCredit: 5,                // 외국납부세액공제: 5년
      investmentTaxCredit: 5              // 투자세액공제: 5년
    }
  }
};

// 법인세 계산기 입력 한도 (2024년)
export const CORPORATE_TAX_LIMITS_2024 = {
  // 금액 한도
  maxRevenue: 1000000000000,              // 최대 매출액: 1조원
  maxExpense: 1000000000000,              // 최대 비용: 1조원
  maxAssets: 1000000000000,               // 최대 자산: 1조원
  maxEmployees: 100000,                   // 최대 직원수: 10만명

  // 업종 코드
  businessTypes: {
    manufacturing: "제조업",
    construction: "건설업",
    wholesale: "도매업",
    retail: "소매업",
    service: "서비스업",
    software: "소프트웨어업",
    transportation: "운수업",
    mining: "광업",
    agriculture: "농업",
    finance: "금융업",
    realestate: "부동산업",
    education: "교육업",
    health: "보건업",
    other: "기타"
  },

  // 계산 관련 메시지
  messages: {
    smallBusiness: "중소기업은 더 낮은 세율과 다양한 세액공제 혜택을 받을 수 있습니다.",
    rdCredit: "연구개발비 세액공제는 중소기업 최대 30~40%, 대기업 20~30% 적용됩니다.",
    equipmentCredit: "설비투자 세액공제는 투자 규모와 설비 종류에 따라 7~20% 적용됩니다.",
    employmentCredit: "고용증대 세액공제는 청년·장애인 등 취업취약계층 고용 시 추가 혜택이 있습니다.",
    filingDeadline: "법인세는 사업연도 종료일로부터 3개월 이내에 신고·납부해야 합니다.",
    interimPayment: "중간예납은 직전연도 법인세의 50%를 6개월 후에 납부합니다.",
    lossCarryForward: "결손금은 10년간 이월하여 향후 소득과 상계할 수 있습니다.",
    taxRates: "법인세율은 소득규모에 따라 10%~25% 누진세율이 적용됩니다."
  },

  // 경고 메시지
  warnings: {
    smallBusinessCheck: "중소기업 요건을 정확히 확인하여 더 낮은 세율 혜택을 놓치지 마세요.",
    creditRequirements: "세액공제는 까다로운 요건이 있으므로 사전에 충족 여부를 확인하세요.",
    penaltyRisk: "신고 기한을 놓치면 무신고 가산세 20~40%가 부과됩니다.",
    documentPreparation: "세무조사에 대비하여 증빙서류를 체계적으로 관리하세요."
  }
};

// 부가가치세 관련 상수 (2024년)
export const VAT_2024 = {
  // 부가가치세 세율
  rates: {
    standard: 0.10,                       // 표준세율: 10%
    zero: 0.00,                           // 영세율: 0%
    exempt: 0.00                          // 면세: 0%
  },

  // 사업자 구분 기준
  businessClassification: {
    // 면세사업자 기준
    exemption: {
      threshold: 30000000,                // 연매출 3천만원 이하
      description: "연매출액 3천만원 이하 소규모 사업자"
    },

    // 간이과세자 기준
    simplified: {
      goods: 80000000,                    // 재화공급업: 8천만원
      services: 40000000,                 // 용역공급업: 4천만원
      description: "업종별 기준금액 이하 사업자"
    },

    // 일반과세자 기준
    general: {
      description: "간이과세 기준을 초과하는 사업자"
    }
  },

  // 간이과세자 업종별 부가가치율
  simplifiedRates: {
    manufacturing: 0.015,                 // 제조업: 1.5%
    wholesale: 0.025,                     // 도매업: 2.5%
    retail: 0.025,                        // 소매업: 2.5%
    restaurant: 0.040,                    // 음식점업: 4.0%
    service: 0.040,                       // 서비스업: 4.0%
    construction: 0.020,                  // 건설업: 2.0%
    realEstate: 0.030,                    // 부동산임대업: 3.0%
    transportation: 0.030,                // 운수업: 3.0%
    other: 0.040                          // 기타: 4.0%
  },

  // 영세율 적용 대상
  zeroRateItems: {
    exports: "수출품목",
    internationalServices: "국제용역",
    foreignCurrency: "외화획득용역",
    ships: "외항선박",
    aircraft: "항공기"
  },

  // 면세 대상
  exemptItems: {
    basicNecessities: "기초생활필수재",
    education: "교육용역",
    medical: "의료보건용역",
    finance: "금융보험용역",
    realestate: "토지 및 건물 임대",
    agriculture: "농·수·축산물",
    books: "도서·신문",
    passenger: "여객운송",
    post: "우편",
    broadcasting: "방송",
    electricity: "전기·연탄·가스",
    water: "수도",
    cultural: "문화·예술용역"
  },

  // 신고 및 납부
  filing: {
    // 과세기간
    taxPeriods: {
      first: {
        period: "1~6월",
        filingDeadline: "7월 25일",
        description: "1기 과세기간"
      },
      second: {
        period: "7~12월", 
        filingDeadline: "1월 25일",
        description: "2기 과세기간"
      }
    },

    // 예정신고 (간이과세자)
    preliminaryFiling: {
      period: "1분기, 3분기",
      deadline: "다음달 25일",
      description: "간이과세자는 예정신고 의무"
    },

    // 신고방법
    filingMethods: {
      hometax: "홈택스 전자신고",
      visit: "세무기관 방문신고",
      mail: "우편신고",
      proxy: "세무대리인 신고"
    }
  },

  // 매입세액공제
  inputTaxCredit: {
    // 공제 요건
    requirements: {
      taxInvoice: "세금계산서 수취",
      businessPurpose: "사업목적 사용",
      correctIssue: "적정발급 확인"
    },

    // 공제 제한
    limitations: {
      personal: "개인사용분 제외",
      entertainment: "접대비 관련 제한",
      luxury: "고급오락장소 이용분 제외",
      passenger: "승용차 관련 제한"
    },

    // 간이과세자 매입세액공제
    simplifiedCredit: {
      rate: 1.0,                          // 100% 공제
      limitation: "납부할 세액 한도 내",
      description: "간이과세자는 납부할 세액 범위 내에서만 공제"
    }
  },

  // 세금계산서
  taxInvoice: {
    // 발급의무
    issuanceObligation: {
      general: "일반과세자는 의무발급",
      simplified: "간이과세자는 선택발급",
      exempt: "면세사업자는 발급불가"
    },

    // 필수기재사항
    requiredItems: [
      "공급자 사업자등록번호",
      "공급받는자 사업자등록번호", 
      "공급가액",
      "부가가치세액",
      "작성연월일"
    ],

    // 전자세금계산서
    electronic: {
      obligation: "연매출 3억원 이상",
      advantage: "수수료 절약, 자동보관",
      penalty: "미발급시 가산세 부과"
    }
  },

  // 가산세
  penalties: {
    // 무신고 가산세
    nonFiling: {
      rate: 0.20,                         // 20%
      description: "신고기한 내 미신고시"
    },

    // 과소신고 가산세  
    underReporting: {
      rate: 0.10,                         // 10%
      description: "신고세액이 부족한 경우"
    },

    // 납부지연 가산세
    latePayment: {
      dailyRate: 0.022 / 365,             // 일 0.022%
      description: "납부기한 경과시"
    },

    // 세금계산서 관련 가산세
    taxInvoice: {
      nonIssuance: 0.02,                  // 미발급: 2%
      lateIssuance: 0.01,                 // 지연발급: 1%
      incorrectIssuance: 0.01,            // 부실기재: 1%
      electronicViolation: 0.005          // 전자발급 위반: 0.5%
    }
  },

  // 환급
  refund: {
    // 환급 대상
    eligibleCases: {
      inputExcess: "매입세액이 매출세액 초과",
      exporters: "수출업체",
      newBusiness: "신설사업체",
      facilities: "대규모 설비투자"
    },

    // 환급 절차
    procedure: {
      application: "신고서 제출과 동시 신청",
      review: "세무서 검토 (30일 이내)",
      payment: "승인 후 14일 이내 지급"
    },

    // 환급가산금
    refundInterest: {
      rate: 0.025,                        // 연 2.5%
      period: "환급기한 경과일로부터",
      description: "환급지연시 가산금 지급"
    }
  },

  // 특례 및 감면
  specialProvisions: {
    // 농어민 특례
    farmer: {
      simplifiedRate: 0.025,              // 일반 부가가치율 2.5%
      exemptionThreshold: 30000000,       // 면세점 3천만원
      description: "농어민에 대한 특례 적용"
    },

    // 소상공인 특례
    smallBusiness: {
      simplifiedChoice: "간이과세 선택권",
      taxInvoiceOption: "세금계산서 발급 선택",
      description: "소상공인 부담 경감 특례"
    },

    // 창업자 특례
    startup: {
      exemptionExtension: "면세점 연장적용",
      registrationDelay: "사업자등록 유예",
      description: "창업촉진을 위한 특례"
    }
  }
};

// 부가가치세 계산기 입력 한도 (2024년)
export const VAT_LIMITS_2024 = {
  // 금액 한도
  maxAmount: 100000000000,                // 최대 1000억원
  minAmount: 0,                           // 최소 0원

  // 사업자 구분별 한도
  businessTypeLimits: {
    exempt: {
      maxSales: 30000000,                 // 면세: 최대 3천만원
      description: "연매출 3천만원 초과시 과세사업자"
    },
    simplified: {
      goods: 80000000,                    // 재화: 최대 8천만원
      services: 40000000,                 // 용역: 최대 4천만원
      description: "기준 초과시 일반과세자"
    },
    general: {
      unlimited: true,                    // 무제한
      description: "매출액 제한 없음"
    }
  },

  // 업종별 분류
  businessCategories: {
    manufacturing: "제조업",
    wholesale: "도매업", 
    retail: "소매업",
    restaurant: "음식점업",
    service: "서비스업",
    construction: "건설업",
    realEstate: "부동산임대업",
    transportation: "운수업",
    other: "기타"
  },

  // 메시지
  messages: {
    businessType: "연매출액과 업종에 따라 사업자 유형이 자동 판정됩니다.",
    vatCalculation: "일반과세자는 매출세액에서 매입세액을 차감하여 계산합니다.",
    simplifiedCalculation: "간이과세자는 매출액에 업종별 부가가치율을 적용합니다.",
    exemptBusiness: "면세사업자는 부가가치세 납부의무가 없습니다.",
    filingDeadline: "부가가치세는 과세기간 종료 후 25일 이내 신고·납부해야 합니다.",
    taxInvoice: "매입세액공제를 위해서는 적격한 세금계산서가 필요합니다.",
    refund: "매입세액이 매출세액보다 많으면 환급받을 수 있습니다.",
    penalty: "신고기한을 놓치면 무신고 가산세 20%가 부과됩니다."
  },

  // 주의사항
  warnings: {
    businessTypeCheck: "사업자 유형을 정확히 파악하여 올바른 계산 방법을 적용하세요.",
    invoiceManagement: "세금계산서 수취 및 보관을 철저히 하여 매입세액공제를 받으세요.",
    filingDeadline: "신고기한을 엄수하여 가산세 부과를 방지하세요.",
    thresholdManagement: "매출액이 기준을 초과하면 사업자 유형이 변경됩니다.",
    exemptLimitation: "면세사업자도 일정 규모 이상시 과세사업자로 전환됩니다."
  }
}; 

// 원천징수세 관련 상수 (2024년 기준)
export const WITHHOLDING_TAX_2024 = {
  // 근로소득 원천징수세 (간이세액표 적용)
  earnedIncome: {
    // 월급여 구간별 간이세액표 (2024년)
    monthlyTaxTable: [
      { min: 0, max: 800000, rates: { none: 0, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 800000, max: 830000, rates: { none: 0, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 830000, max: 860000, rates: { none: 1800, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 860000, max: 890000, rates: { none: 3600, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 890000, max: 920000, rates: { none: 5400, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 920000, max: 950000, rates: { none: 7200, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 950000, max: 980000, rates: { none: 9000, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 980000, max: 1020000, rates: { none: 10800, 1: 0, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 1020000, max: 1060000, rates: { none: 12600, 1: 3600, 2: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0 } },
      { min: 1500000, max: 1600000, rates: { none: 46800, 1: 34200, 2: 25200, 5: 16200, 6: 12600, 7: 9000, 8: 7200, 9: 5400, 10: 3600, 11: 1800 } },
      { min: 2000000, max: 2100000, rates: { none: 81000, 1: 68400, 2: 59400, 5: 50400, 6: 46800, 7: 43200, 8: 41400, 9: 39600, 10: 37800, 11: 36000 } },
      { min: 3000000, max: 3200000, rates: { none: 162000, 1: 149400, 2: 140400, 5: 131400, 6: 127800, 7: 124200, 8: 122400, 9: 120600, 10: 118800, 11: 117000 } },
      { min: 5000000, max: 5500000, rates: { none: 324000, 1: 311400, 2: 302400, 5: 293400, 6: 289800, 7: 286200, 8: 284400, 9: 282600, 10: 280800, 11: 279000 } },
      { min: 10000000, max: 15000000, rates: { none: 864000, 1: 851400, 2: 842400, 5: 833400, 6: 829800, 7: 826200, 8: 824400, 9: 822600, 10: 820800, 11: 819000 } }
    ],
    // 부양가족 공제 (월 15만원)
    dependentDeduction: 150000,
    // 20세 이하 자녀 추가공제 (월 15만원)
    childDeduction: 150000
  },
  
  // 사업소득 원천징수세 (용역비 등)
  businessIncome: {
    // 소득세 3% + 지방소득세 0.3% = 3.3%
    totalRate: 0.033,
    incomeTaxRate: 0.03,
    localIncomeTaxRate: 0.003,
    // 건당 한도 없음
    minimumAmount: 0,
    maximumAmount: null
  },
  
  // 기타소득 원천징수세 (강의료, 원고료 등)
  otherIncome: {
    // 소득세 20% + 지방소득세 2% = 22%
    totalRate: 0.22,
    incomeTaxRate: 0.20,
    localIncomeTaxRate: 0.02,
    // 기본공제 30만원
    basicDeduction: 300000,
    // 건당 한도 없음
    minimumAmount: 0,
    maximumAmount: null
  },
  
  // 이자소득 원천징수세
  interestIncome: {
    // 소득세 14% + 지방소득세 1.4% = 15.4%
    totalRate: 0.154,
    incomeTaxRate: 0.14,
    localIncomeTaxRate: 0.014,
    // 연간 비과세 한도 2,000만원
    annualExemptionLimit: 20000000,
    // 서민형 비과세 한도 5,000만원
    lowIncomeExemptionLimit: 50000000
  },
  
  // 배당소득 원천징수세
  dividendIncome: {
    // 소득세 14% + 지방소득세 1.4% = 15.4%
    totalRate: 0.154,
    incomeTaxRate: 0.14,
    localIncomeTaxRate: 0.014,
    // 비과세 한도 없음
    exemptionLimit: 0
  },
  
  // 공통 사항
  common: {
    // 신고기한 (다음달 10일)
    filingDeadline: '다음달 10일',
    // 원천징수영수증 발급 의무
    receiptRequired: true,
    // 연말정산 대상 여부
    yearEndTaxSettlement: {
      earnedIncome: true,
      businessIncome: false,
      otherIncome: false,
      interestIncome: false,
      dividendIncome: false
    }
  }
};

// 원천징수세 한도 및 제한사항 (2024년)
export const WITHHOLDING_TAX_LIMITS_2024 = {
  // 입력 한도
  inputLimits: {
    monthlyPayment: 100000000, // 월 지급액 1억원
    annualPayment: 1000000000, // 연 지급액 10억원
    dependents: 20, // 부양가족 수 20명
    paymentCount: 1000 // 지급 횟수 1,000회
  },
  
  // 검증 메시지
  validationMessages: {
    monthlyPaymentExceeded: '월 지급액이 한도를 초과했습니다.',
    annualPaymentExceeded: '연 지급액이 한도를 초과했습니다.',
    dependentsExceeded: '부양가족 수가 한도를 초과했습니다.',
    paymentCountExceeded: '지급 횟수가 한도를 초과했습니다.',
    invalidPaymentAmount: '지급액은 0원 이상이어야 합니다.'
  },
  
  // 경고사항
  warnings: {
    highAmount: '지급액이 높습니다. 계산 결과를 재확인해주세요.',
    manyDependents: '부양가족 수가 많습니다. 소득공제 요건을 확인해주세요.',
    frequentPayments: '지급 횟수가 많습니다. 원천징수 신고를 누락하지 마세요.',
    noTaxWithholding: '원천징수세액이 없습니다. 세법 규정을 확인해주세요.'
  },
  
  // 권고사항
  recommendations: {
    earnedIncome: '연말정산을 통해 정확한 세액을 정산받으세요.',
    businessIncome: '종합소득세 신고 시 기납부세액으로 공제받을 수 있습니다.',
    otherIncome: '연간 300만원 초과 시 종합소득세 신고 대상입니다.',
    interestIncome: '금융소득종합과세 기준(2,000만원)을 주의하세요.',
    dividendIncome: '배당소득도 금융소득종합과세 대상입니다.'
  }
}; 