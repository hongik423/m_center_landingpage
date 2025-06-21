import { VATInput, VATResult } from '@/types/tax-calculator.types';

// 부가가치세 관련 상수
export const VAT_RATES = {
  STANDARD: 0.1,              // 표준세율 10%
  ZERO: 0,                    // 영세율 0%
  EXEMPT: 0,                  // 면세 0%
} as const;

// 간이과세 업종별 부가가치율
export const SIMPLIFIED_VAT_RATES = {
  '제조업': 0.015,           // 1.5%
  '도소매업': 0.025,         // 2.5%
  '음식점업': 0.04,          // 4%
  '서비스업': 0.04,          // 4%
  '건설업': 0.02,            // 2%
  '부동산임대업': 0.03,      // 3%
  '운수업': 0.03,            // 3%
  '기타': 0.04,              // 4%
} as const;

// 간이과세 기준금액
export const SIMPLIFIED_THRESHOLD = {
  GOODS: 80000000,           // 재화공급업 8천만원
  SERVICES: 40000000,        // 용역공급업 4천만원
} as const;

// 면세 한도
export const EXEMPT_THRESHOLD = 30000000; // 3천만원

// 고도화된 부가가치세 계산 함수
export function calculateVAT(input: VATInput, salesAmount?: number, businessCategory?: string): VATResult {
  // 입력값 검증
  if (input.outputVAT < 0 || input.inputVAT < 0) {
    throw new Error('매출세액과 매입세액은 0 이상이어야 합니다.');
  }

  let vatPayable = 0;
  let vatRefundable = 0;
  let taxableAmount = 0;
  let calculatedTax = 0;
        const localIncomeTax = 0;
  let totalTax = 0;
  let netAmount = 0;
  let appliedVATRate = 0;
  let inputTaxCreditLimit = 0;
  let actualInputTaxCredit = 0;

  // 사업자 구분에 따른 계산
  switch (input.businessType) {
    case 'general': {
      // 일반과세자: 매출세액 - 매입세액
      appliedVATRate = VAT_RATES.STANDARD;
      taxableAmount = input.outputVAT / VAT_RATES.STANDARD;
      calculatedTax = input.outputVAT;
      actualInputTaxCredit = input.inputVAT; // 일반과세자는 매입세액 전액 공제
      
      const netVAT = input.outputVAT - actualInputTaxCredit;
      
      if (netVAT > 0) {
        vatPayable = netVAT;
        totalTax = netVAT;
      } else {
        vatRefundable = Math.abs(netVAT);
        netAmount = Math.abs(netVAT);
      }
      break;
    }
    
    case 'simplified': {
      // 간이과세자: 매출액 × 업종별 부가가치율 - 매입세액(한도 내)
      if (!salesAmount || !businessCategory) {
        throw new Error('간이과세자는 매출액과 업종 정보가 필요합니다.');
      }
      
      appliedVATRate = getVATRateByBusiness(businessCategory);
      taxableAmount = salesAmount;
      calculatedTax = Math.floor(salesAmount * appliedVATRate); // 원 단위 절사
      
      // 중요: 간이과세자는 납부할 세액 범위 내에서만 매입세액 공제 가능
      inputTaxCreditLimit = calculatedTax;
      actualInputTaxCredit = Math.min(input.inputVAT, inputTaxCreditLimit);
      
      vatPayable = Math.max(0, calculatedTax - actualInputTaxCredit);
      totalTax = vatPayable;
      
      // 간이과세자는 환급 불가 (납부할 세액 범위 내에서만 공제)
      if (input.inputVAT > calculatedTax) {
        // 매입세액이 납부할 세액보다 큰 경우에도 환급은 불가
        vatRefundable = 0;
      }
      break;
    }
    
    case 'exempt': {
      // 면세사업자: 부가가치세 납부의무 없음
      appliedVATRate = 0;
      vatPayable = 0;
      vatRefundable = 0;
      calculatedTax = 0;
      totalTax = 0;
      taxableAmount = salesAmount || (input.outputVAT / VAT_RATES.STANDARD);
      actualInputTaxCredit = 0; // 면세사업자는 매입세액공제 불가
      break;
    }
    
    default:
      throw new Error('올바르지 않은 사업자 구분입니다.');
  }

  // 고도화된 계산 과정 상세
  const breakdown = {
    steps: input.businessType === 'general' ? [
      {
        label: '매출세액',
        amount: input.outputVAT,
        formula: `매출액 ${taxableAmount.toLocaleString()}원 × 10%`,
        note: '일반과세자는 매출액에 표준세율 10% 적용'
      },
      {
        label: '매입세액공제',
        amount: actualInputTaxCredit,
        formula: `매입세액 ${input.inputVAT.toLocaleString()}원 (전액공제)`,
        note: '일반과세자는 적격 세금계산서상 매입세액 전액 공제'
      },
      {
        label: vatPayable > 0 ? '차감납부세액' : '환급세액',
        amount: vatPayable > 0 ? vatPayable : vatRefundable,
        formula: `${input.outputVAT.toLocaleString()}원 - ${actualInputTaxCredit.toLocaleString()}원`,
        note: vatPayable > 0 ? '납부할 세액입니다' : '환급받을 세액입니다'
      }
    ] : input.businessType === 'simplified' ? [
      {
        label: '매출액',
        amount: taxableAmount,
        formula: `${businessCategory} 매출액`,
        note: '간이과세자는 매출액 기준으로 계산'
      },
      {
        label: '부가가치세액',
        amount: calculatedTax,
        formula: `${taxableAmount.toLocaleString()}원 × ${(appliedVATRate * 100).toFixed(1)}%`,
        note: `${businessCategory} 부가가치율 ${(appliedVATRate * 100).toFixed(1)}% 적용`
      },
      {
        label: '매입세액공제',
        amount: actualInputTaxCredit,
        formula: `매입세액 ${input.inputVAT.toLocaleString()}원 중 ${actualInputTaxCredit.toLocaleString()}원 공제`,
        note: input.inputVAT > inputTaxCreditLimit 
          ? `납부할 세액 ${inputTaxCreditLimit.toLocaleString()}원 한도 내에서만 공제` 
          : '전액 공제'
      },
      {
        label: '납부세액',
        amount: vatPayable,
        formula: `${calculatedTax.toLocaleString()}원 - ${actualInputTaxCredit.toLocaleString()}원`,
        note: '간이과세자는 환급 불가 (납부할 세액 범위 내 공제)'
      }
    ] : [
      {
        label: '면세사업',
        amount: 0,
        formula: '연매출 3천만원 이하',
        note: '부가가치세 납부의무 없음'
      }
    ],
    summary: {
      totalIncome: taxableAmount,
      totalDeductions: actualInputTaxCredit,
      taxableIncome: taxableAmount,
      taxBeforeCredits: calculatedTax,
      taxCredits: actualInputTaxCredit,
      finalTax: totalTax
    }
  };

  // 적용세율 정보 (고도화)
  const appliedRates = [
    {
      range: input.businessType === 'general' ? '일반과세 (표준세율)' : 
             input.businessType === 'simplified' ? `간이과세 (${businessCategory || '기타'})` : '면세',
      rate: appliedVATRate,
      amount: calculatedTax,
      description: input.businessType === 'general' ? 
        '매출액에 10% 표준세율 적용' :
        input.businessType === 'simplified' ?
        `${businessCategory} 업종의 부가가치율 ${(appliedVATRate * 100).toFixed(1)}% 적용` :
        '연매출 3천만원 이하 면세'
    }
  ];

  // 공제 내역 (고도화)
  const deductions = [
    {
      type: 'input_vat',
      label: input.businessType === 'simplified' ? '매입세액공제 (한도 적용)' : '매입세액공제',
      amount: actualInputTaxCredit,
      limit: input.businessType === 'simplified' ? inputTaxCreditLimit : undefined,
      note: input.businessType === 'simplified' && input.inputVAT > inputTaxCreditLimit ?
        `매입세액 ${input.inputVAT.toLocaleString()}원 중 ${inputTaxCreditLimit.toLocaleString()}원만 공제 가능` :
        input.businessType === 'exempt' ? '면세사업자는 매입세액공제 불가' :
        '적격 세금계산서상 매입세액 전액 공제'
    }
  ];

  return {
    taxableAmount,
    calculatedTax,
    localIncomeTax,
    totalTax,
    netAmount,
    vatPayable,
    vatRefundable,
    breakdown,
    appliedRates,
    deductions
  };
}

// 사업자 유형 판정 함수
export function determineBusinessType(annualSales: number, businessCategory: string): 'general' | 'simplified' | 'exempt' {
  // 면세 판정
  if (annualSales <= EXEMPT_THRESHOLD) {
    return 'exempt';
  }
  
  // 간이과세 판정
  const isGoods = ['제조업', '도소매업'].includes(businessCategory);
  const threshold = isGoods ? SIMPLIFIED_THRESHOLD.GOODS : SIMPLIFIED_THRESHOLD.SERVICES;
  
  if (annualSales <= threshold) {
    return 'simplified';
  }
  
  return 'general';
}

// 업종별 부가가치율 조회
export function getVATRateByBusiness(businessCategory: string): number {
  return SIMPLIFIED_VAT_RATES[businessCategory as keyof typeof SIMPLIFIED_VAT_RATES] || SIMPLIFIED_VAT_RATES['기타'];
}

// 부가가치세 신고기한 계산
export function getVATFilingDeadline(taxPeriod: 'first' | 'second', year: number): Date {
  if (taxPeriod === 'first') {
    // 1기: 7월 25일
    return new Date(year, 6, 25); // 월은 0부터 시작
  } else {
    // 2기: 다음해 1월 25일
    return new Date(year + 1, 0, 25);
  }
}

// 매출액 기준 세액 계산 (간이과세용)
export function calculateSimplifiedVAT(sales: number, businessCategory: string, inputVAT: number): number {
  const vatRate = getVATRateByBusiness(businessCategory);
  const calculatedVAT = Math.floor(sales * vatRate);
  return Math.max(0, calculatedVAT - inputVAT);
}

// 면세 사업 여부 판정
export function isExemptBusiness(annualSales: number): boolean {
  return annualSales <= EXEMPT_THRESHOLD;
}

// 세액 환급/추납 판정
export function determineVATSettlement(outputVAT: number, inputVAT: number, businessType: string): {
  isRefund: boolean;
  amount: number;
  type: '환급' | '추납' | '신고' | '면세';
} {
  if (businessType === 'exempt') {
    return { isRefund: false, amount: 0, type: '면세' };
  }
  
  const netVAT = outputVAT - inputVAT;
  
  if (netVAT > 0) {
    return { isRefund: false, amount: netVAT, type: '추납' };
  } else if (netVAT < 0) {
    return { isRefund: true, amount: Math.abs(netVAT), type: '환급' };
  } else {
    return { isRefund: false, amount: 0, type: '신고' };
  }
} 