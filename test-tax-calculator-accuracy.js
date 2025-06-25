/**
 * 🔥 세무사급 세금계산기 완벽 정확도 테스트
 * 실제 세무 시나리오 기반 무오류 검증
 */

// 테스트 시나리오 1: 상장주식 대주주 양도소득세
console.log('🧪 테스트 시나리오 1: 상장주식 대주주 양도소득세');
const listedLargeShareholderTest = {
  // 삼성전자 주식 20,000주 (지분율 0.0003% 미만이지만 보유가액 150억원)
  companyName: '삼성전자',
  stockType: 'listed',
  stockQuantity: 20000,
  pricePerShare: 75000,           // 현재가 75,000원
  acquisitionPrice: 1200000000,   // 취득가액 12억원 (주당 60,000원)
  transferPrice: 1500000000,      // 양도가액 15억원 (주당 75,000원)
  transferExpenses: 15000000,     // 양도비용 1,500만원 (1%)
  totalValue: 1500000000,         // 총 보유가액 15억원
  personalShareholdingRatio: 0.0003, // 지분율 0.0003%
  familyShareholdingRatio: 0.0003,   // 가족지분율 0.0003%
  holdingYears: 2.5,              // 보유기간 2년 6개월
  
  // 예상 결과 (세무법령 기준)
  expectedResults: {
    isLargeShareholder: true,     // 100억원 초과로 대주주
    capitalGain: 285000000,       // 양도차익 2억 8,500만원
    taxRate: 0.20,                // 2년 이상 보유로 20% 세율
    calculatedTax: 57000000,      // 양도소득세 5,700만원
    localIncomeTax: 5700000,      // 지방소득세 570만원
    totalTax: 62700000,           // 총 세액 6,270만원
    netProceeds: 1437300000       // 실수취액 14억 3,730만원
  }
};

// 테스트 시나리오 2: 비상장주식 소액주주 양도소득세
console.log('🧪 테스트 시나리오 2: 비상장주식 소액주주 양도소득세');
const unlistedSmallShareholderTest = {
  // 중소기업 주식 1,000주 (지분율 1%, 소액주주)
  companyName: '(주)혁신기술',
  stockType: 'unlisted',
  stockQuantity: 1000,
  pricePerShare: 50000,           // 주당 50,000원
  acquisitionPrice: 40000000,     // 취득가액 4,000만원
  transferPrice: 50000000,        // 양도가액 5,000만원
  transferExpenses: 500000,       // 양도비용 50만원
  totalValue: 50000000,           // 총 보유가액 5,000만원
  personalShareholdingRatio: 0.01, // 지분율 1%
  familyShareholdingRatio: 0.01,   // 가족지분율 1%
  holdingYears: 1.5,              // 보유기간 1년 6개월
  
  // 예상 결과
  expectedResults: {
    isLargeShareholder: false,    // 4% 미만이고 100억원 미만으로 소액주주
    capitalGain: 9500000,         // 양도차익 950만원
    taxRate: 0.20,                // 1년 이상 보유로 20% 세율
    calculatedTax: 1900000,       // 양도소득세 190만원
    localIncomeTax: 190000,       // 지방소득세 19만원
    totalTax: 2090000,            // 총 세액 209만원
    netProceeds: 47910000         // 실수취액 4,791만원
  }
};

// 테스트 시나리오 3: 벤처기업주식 세제혜택
console.log('🧪 테스트 시나리오 3: 벤처기업주식 세제혜택');
const ventureStockTest = {
  // 벤처기업 주식 5,000주 (2년 이상 보유)
  companyName: '(주)스타트업벤처',
  stockType: 'unlisted',
  stockQuantity: 5000,
  pricePerShare: 20000,           // 주당 20,000원
  acquisitionPrice: 50000000,     // 취득가액 5,000만원
  transferPrice: 100000000,       // 양도가액 1억원
  transferExpenses: 1000000,      // 양도비용 100만원
  totalValue: 100000000,          // 총 보유가액 1억원
  personalShareholdingRatio: 0.10, // 지분율 10%
  familyShareholdingRatio: 0.10,   // 가족지분율 10%
  holdingYears: 2.0,              // 보유기간 2년
  isStartupStock: true,           // 벤처기업주식
  
  // 예상 결과
  expectedResults: {
    isLargeShareholder: true,     // 10%로 대주주
    capitalGain: 49000000,        // 양도차익 4,900만원
    baseTaxRate: 0.25,            // 대주주 기본세율 25%
    incentiveRate: 0.5,           // 벤처기업주식 50% 감면
    finalTaxRate: 0.125,          // 최종세율 12.5%
    calculatedTax: 6125000,       // 양도소득세 612만 5천원
    localIncomeTax: 612500,       // 지방소득세 61만 2천 5백원
    totalTax: 6737500,            // 총 세액 673만 7천 5백원
    netProceeds: 93262500         // 실수취액 9,326만 2천 5백원
  }
};

// 테스트 시나리오 4: 증여세 10년 합산과세
console.log('🧪 테스트 시나리오 4: 증여세 10년 합산과세');
const giftTaxTest = {
  // 부모로부터 8천만원 증여 (5년 전 3천만원 증여 기록)
  donorRelation: 'parent',
  recipientAge: 30,
  giftAmount: 80000000,           // 현재 증여액 8,000만원
  previousGifts: [
    {
      date: '2019-03-15',
      amount: 30000000,           // 5년 전 3,000만원 증여
      taxPaid: 0                  // 당시 공제 범위 내
    }
  ],
  
  // 예상 결과
  expectedResults: {
    totalGifts: 110000000,        // 10년 합산 1억 1,000만원
    basicDeduction: 50000000,     // 직계존속 공제 5,000만원
    taxableAmount: 60000000,      // 과세표준 6,000만원
    calculatedTax: 6000000,       // 증여세 600만원 (10% 세율)
    currentTaxDue: 6000000,       // 이번 납부세액 600만원
    netGift: 74000000             // 실수취액 7,400만원
  }
};

// 테스트 시나리오 5: 상속세 배우자공제
console.log('🧪 테스트 시나리오 5: 상속세 배우자공제');
const inheritanceTaxTest = {
  // 총 상속재산 20억원, 배우자와 자녀 2명
  totalInheritance: 2000000000,   // 총 상속재산 20억원
  debtLiabilities: 100000000,     // 채무 1억원
  funeralExpenses: 5000000,       // 장례비용 500만원
  spouse: true,                   // 배우자 있음
  spouseAge: 65,
  children: 2,                    // 자녀 2명
  minorChildren: 0,               // 미성년자 없음
  disabledHeirs: 0,               // 장애인 없음
  elderlyHeirs: 0,                // 65세 이상 없음
  inheritanceRatio: 0.5,          // 상속비율 50%
  
  // 예상 결과
  expectedResults: {
    grossInheritance: 1895000000, // 순 상속재산 18억 9,500만원
    basicDeduction: 200000000,    // 기초공제 2억원
    spouseDeduction: 1000000000,  // 배우자공제 10억원 (법정상속분 고려)
    childrenDeduction: 100000000, // 자녀공제 1억원 (5천만원 × 2명)
    totalDeductions: 1300000000,  // 총 공제액 13억원
    taxableInheritance: 595000000, // 과세표준 5억 9,500만원
    calculatedTax: 59000000,      // 상속세 5,900만원 (10% 세율)
    inheritedAmount: 947500000,   // 상속받는 금액 9억 4,750만원 (50%)
    taxBurden: 29500000           // 세부담 2,950만원 (50%)
  }
};

// 테스트 시나리오 6: 종합소득세 복합소득
console.log('🧪 테스트 시나리오 6: 종합소득세 복합소득');
const comprehensiveIncomeTest = {
  // 다양한 소득이 있는 고소득자
  earnedIncome: 120000000,        // 근로소득 1억 2,000만원
  businessIncome: 80000000,       // 사업소득 8,000만원
  realEstateRentalIncome: 50000000, // 부동산임대소득 5,000만원
  interestIncome: 10000000,       // 이자소득 1,000만원
  dividendIncome: 15000000,       // 배당소득 1,500만원
  pension: 30000000,              // 연금소득 3,000만원
  
  // 공제 정보
  earnedIncomeDeduction: 15000000, // 근로소득공제 1,500만원
  personalDeduction: 1500000,     // 기본공제 150만원 (본인)
  spouseDeduction: 1500000,       // 배우자공제 150만원
  dependentDeduction: 3000000,    // 부양가족공제 300만원 (2명)
  
  // 예상 결과
  expectedResults: {
    totalIncome: 305000000,       // 총 소득 3억 500만원
    totalDeductions: 21000000,    // 총 공제 2,100만원
    taxableIncome: 284000000,     // 과세표준 2억 8,400만원
    calculatedTax: 85200000,      // 종합소득세 8,520만원 (30% 구간)
    localIncomeTax: 8520000,      // 지방소득세 852만원
    totalTax: 93720000,           // 총 세액 9,372만원
    netIncome: 211280000          // 실수령액 2억 1,128만원
  }
};

console.log('='.repeat(80));
console.log('🎯 세무사급 완벽 정확도 테스트 시나리오 생성 완료');
console.log('='.repeat(80));
console.log('');
console.log('✅ 준비된 테스트 케이스:');
console.log('1. 상장주식 대주주 양도소득세 (100억원 기준)');
console.log('2. 비상장주식 소액주주 양도소득세 (4% 기준)');
console.log('3. 벤처기업주식 세제혜택 (50% 감면)');
console.log('4. 증여세 10년 합산과세 시나리오');
console.log('5. 상속세 배우자공제 최적화');
console.log('6. 종합소득세 복합소득 계산');
console.log('');
console.log('🔥 각 계산기별 실제 세무법령 준수 여부를 검증합니다.');
console.log('💰 세무사 실무에서 사용 가능한 정확도를 목표로 합니다.');
console.log('');

// 오류 검출 함수
function validateCalculationAccuracy(testScenario, actualResult, expectedResult) {
  const errors = [];
  const tolerance = 0.01; // 1% 오차 허용
  
  Object.keys(expectedResult).forEach(key => {
    const expected = expectedResult[key];
    const actual = actualResult[key];
    
    if (typeof expected === 'number' && typeof actual === 'number') {
      const diff = Math.abs(expected - actual);
      const percentDiff = expected > 0 ? (diff / expected) : 0;
      
      if (percentDiff > tolerance) {
        errors.push({
          field: key,
          expected: expected,
          actual: actual,
          difference: diff,
          percentDiff: (percentDiff * 100).toFixed(2) + '%'
        });
      }
    } else if (expected !== actual) {
      errors.push({
        field: key,
        expected: expected,
        actual: actual,
        type: 'value_mismatch'
      });
    }
  });
  
  return {
    isAccurate: errors.length === 0,
    errors: errors,
    accuracyScore: Math.max(0, (1 - errors.length / Object.keys(expectedResult).length) * 100)
  };
}

// 성능 측정 함수
function measureCalculationPerformance(calculationFunction, input) {
  const startTime = performance.now();
  const result = calculationFunction(input);
  const endTime = performance.now();
  
  return {
    result: result,
    executionTime: endTime - startTime,
    performanceGrade: endTime - startTime < 100 ? 'A' : 
                     endTime - startTime < 500 ? 'B' : 
                     endTime - startTime < 1000 ? 'C' : 'D'
  };
}

console.log('📊 테스트 유틸리티 함수 준비 완료');
console.log('- validateCalculationAccuracy(): 계산 정확도 검증');
console.log('- measureCalculationPerformance(): 성능 측정');
console.log('');
console.log('🚀 이제 실제 웹브라우저에서 각 계산기를 테스트하겠습니다!'); 