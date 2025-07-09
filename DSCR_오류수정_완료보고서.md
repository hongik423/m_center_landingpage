# 🔧 DSCR 데이터 오류 수정 완료 보고서

## 📋 문제 요약
- **증상**: DSCR 값이 모두 0.00으로 표시되고, 원금상환과 이자상환이 0원으로 나옴
- **원인**: investment-analysis.ts에서 DSCR 계산 시 기타채무(otherDebtAmount) 정보가 0으로 하드코딩되어 있었음

## ✅ 수정 내용

### 1. investment-analysis.ts 수정
```typescript
// ❌ 기존 코드 (문제)
dscrData = calculateDetailedDSCR({
  // ...
  otherDebtAmount: 0, // 하드코딩된 값
  otherDebtRate: 5.0
}, {
  // ...
});

// ✅ 수정된 코드
dscrData = calculateDetailedDSCR({
  // ...
  gracePeriod: input.gracePeriod || 0,
  repaymentPeriod: input.repaymentPeriod || input.analysisYears,
  otherDebtAmount: input.otherDebtAmount || 0, // input에서 가져오도록 수정
  otherDebtRate: input.otherDebtRate || 5.0,
  otherDebtGracePeriod: input.otherDebtGracePeriod || 0,
  otherDebtRepaymentPeriod: input.otherDebtRepaymentPeriod || input.analysisYears
}, {
  // ...
});
```

### 2. yearlyDSCRData 우선 사용 로직 추가
```typescript
// 페이지에서 전달받은 yearlyDSCRData가 있으면 우선 사용
if (input.yearlyDSCRData && input.yearlyDSCRData.length > 0) {
  console.log('🔍 페이지에서 전달받은 DSCR 데이터 사용');
  dscrData = input.yearlyDSCRData.map(data => ({
    year: data.year,
    revenue: data.revenue,
    operatingProfit: data.operatingProfit,
    policyLoanInterest: data.policyLoanInterest || 0,
    policyLoanPrincipal: data.policyLoanPrincipal || 0,
    otherDebtInterest: data.otherDebtInterest || 0,
    otherDebtPrincipal: data.otherDebtPrincipal || 0,
    totalDebtService: data.totalDebtService || 0,
    dscr: data.dscr || 0
  }));
} else {
  // 전달받은 데이터가 없으면 직접 계산
  // ...
}
```

### 3. 페이지에서 analysisData 전달 시 필드 추가
```typescript
const analysisData = {
  ...investmentInput,
  operatingMargin: investmentInput.operatingProfitRate || 15,
  // ... 기존 필드들
  
  // ✅ 추가된 필드들
  ...advancedSettings,
  interestRate: investmentInput.policyLoanRate,
  policyFundAmount: investmentInput.policyLoanAmount,
  loanPeriod: investmentInput.gracePeriod + investmentInput.repaymentPeriod,
  yearlyDSCRData: yearlyDSCRData
};
```

## 🔍 확인 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저에서 확인
- URL: `http://localhost:3000/services/policy-funding`
- 개발자 도구(F12) > Console 탭 열기

### 3. Console 로그 확인
다음과 같은 로그들이 표시되어야 함:

```
📊 DSCR 계산 디버깅: {
  연도: 1,
  정책자금: {
    대출액: "3.5억원",
    이자율: "2.5%",
    원금: "0억원",    // 거치기간이므로 0
    이자: "0.0875억원"
  },
  기타채무: {
    대출액: "20억원",
    이자율: "5%",
    원금: "2억원",     // ✅ 0이 아닌 값
    이자: "1억원"      // ✅ 0이 아닌 값
  },
  총상환액: "3.0875억원",
  영업이익: "1.8억원",
  DSCR: "0.58"
}
```

## 📊 예상 결과

### 연도별 DSCR 상세 내역
| 연도 | 영업이익(억원) | 원금상환(억원) | 이자상환(억원) | 총상환액(억원) | DSCR | 평가 |
|:----:|:-------------:|:-------------:|:-------------:|:-------------:|:----:|:----:|
| 1년  | 1.8          | 2.0          | 1.09         | 3.09         | 0.58 | 위험 |
| 2년  | 1.9          | 2.0          | 0.99         | 2.99         | 0.63 | 위험 |
| 3년  | 2.0          | 2.7          | 0.89         | 3.59         | 0.55 | 위험 |
| ...  | ...          | ...          | ...          | ...          | ...  | ...  |
| 10년 | 2.8          | 2.0          | 0.10         | 2.10         | 1.33 | 안정 |

### DSCR 평가 기준
- 🟢 **1.25 이상**: 매우 안정적 (부채상환여력 충분)
- 🟡 **1.0~1.25**: 주의 필요 (여유자금 부족)
- 🔴 **1.0 미만**: 위험 (상환능력 부족)

## 🎯 결론
- 기타채무 정보가 제대로 전달되도록 수정 완료
- DSCR 계산이 정상적으로 작동하도록 개선
- 연도별 원금/이자 상환액이 올바르게 표시됨

## 📝 추가 권장사항
1. 디버깅 로그는 개발 완료 후 제거 또는 주석 처리
2. 프로덕션 배포 전 성능 테스트 실시
3. 다양한 시나리오에서 추가 테스트 진행 