# 정책자금 상세페이지 및 재무타당성분석기 완전 PRD

## 📋 프로젝트 개요

### 1.1 프로젝트명
**정책자금 상세페이지 및 고도화된 재무타당성분석기**

### 1.2 프로젝트 목표
- 정책자금 신청 전 단계에서 투자 타당성을 정밀 분석할 수 있는 도구 제공
- 5구간 투자규모별 차별화된 평가 시스템 구축
- AI 기반 종합 투자 평가 및 추천 시스템 구현
- 사용자 친화적인 모바일 최적화 인터페이스 제공

### 1.3 핵심 가치 제안
- **정밀한 재무 분석**: NPV, IRR, DSCR, 회수기간 등 핵심 지표 계산
- **투자규모별 맞춤 평가**: 25억 미만~100억 이상 5구간 차별화
- **AI 기반 평가**: 8개 핵심 지표 종합 분석 및 추천
- **실시간 계산**: 입력값 변경 시 즉시 재계산 및 결과 업데이트

---

## 🏗️ 시스템 아키텍처

### 2.1 기술 스택
```typescript
// Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (애니메이션)

// State Management
- Zustand (전역 상태)
- React Hook Form (폼 관리)

// Utilities
- date-fns (날짜 처리)
- zod (스키마 검증)
- lucide-react (아이콘)

// Analysis Engine
- 커스텀 투자분석 알고리즘
- AI 평가 시스템
- 5구간 투자규모 분류 시스템
```

### 2.2 폴더 구조
```
src/
├── app/
│   └── services/
│       └── policy-funding/
│           ├── page.tsx                 # 메인 페이지
│           └── investment-analysis/
│               └── page.tsx             # 투자분석 도구
├── components/
│   ├── investment-analysis/
│   │   ├── InvestmentAnalysisTool.tsx   # 메인 분석 도구
│   │   ├── InvestmentInputForm.tsx      # 입력 폼
│   │   ├── InvestmentResultDisplay.tsx  # 결과 표시
│   │   ├── DSCRDetailedAnalysis.tsx     # DSCR 상세 분석
│   │   ├── AIReportDisplay.tsx          # AI 리포트
│   │   └── AdvancedSettingsPanel.tsx    # 고급 설정
│   └── ui/                              # shadcn/ui 컴포넌트
├── lib/
│   └── utils/
│       ├── investment-analysis.ts       # 핵심 계산 엔진
│       ├── investment-grade.ts          # 등급 계산 시스템
│       ├── npv-calculator.ts            # NPV 상세 계산
│       └── ai-investment-reporter.ts    # AI 평가 시스템
└── types/
    └── investment.types.ts              # 타입 정의
```

---

## 🎯 핵심 기능 명세

### 3.1 정책자금 상세페이지

#### 3.1.1 히어로 섹션
```typescript
interface HeroSection {
  title: string;
  subtitle: string;
  ctaButtons: {
    primary: "투자분석 시작";
    secondary: "상담 신청";
  };
  backgroundImage: string;
  mobileOptimized: boolean;
}
```

#### 3.1.2 성과 지표 대시보드
```typescript
interface PerformanceMetrics {
  successRate: {
    value: 95;
    unit: "%";
    trend: "+12%";
    icon: "Target";
  };
  processingTime: {
    value: 25;
    unit: "일";
    trend: "-5일";
    icon: "Clock";
  };
  averageAmount: {
    value: 4.2;
    unit: "억원";
    trend: "+8%";
    icon: "TrendingUp";
  };
  successCases: {
    value: 800;
    unit: "+";
    trend: "+156";
    icon: "Award";
  };
}
```

#### 3.1.3 AI 기반 특징 섹션
```typescript
interface AIFeatures {
  noCollateral: {
    title: "무자산담보 요구";
    description: "담보 없이도 신용평가만으로 정책자금 확보 가능";
    icon: "Shield";
  };
  aiCreditEvaluation: {
    title: "AI 신용평가";
    description: "빅데이터 기반의 정밀한 기업 신용도 분석";
    icon: "Zap";
  };
  customMatching: {
    title: "금액대출 해결";
    description: "맞춤형 정책자금 매칭으로 최적 대출 조건 제시";
    icon: "Star";
  };
}
```

### 3.2 재무타당성분석기

#### 3.2.1 투자 입력 인터페이스
```typescript
interface InvestmentInput {
  // 기본 투자 정보
  initialInvestment: number;        // 초기 투자금 (원)
  policyFundAmount: number;         // 정책자금 규모 (원)
  annualRevenue: number;            // 연간 매출 (원)
  operatingProfitRate: number;      // 영업이익률 (%)
  discountRate: number;             // 할인율 (%)
  analysisYears: number;            // 분석 기간 (년)
  
  // 대출 조건
  policyLoanAmount: number;         // 정책자금 대출액
  policyLoanRate: number;           // 정책자금 이자율
  gracePeriod: number;              // 거치기간
  repaymentPeriod: number;          // 원금상환기간
  
  // 기타 채무
  otherDebtAmount: number;          // 기타채무액
  otherDebtRate: number;            // 기타채무 이자율
  otherDebtGracePeriod: number;     // 기타채무 거치기간
  otherDebtRepaymentPeriod: number; // 기타채무 상환기간
  
  // 고급 설정
  revenueGrowthRate: number;        // 매출성장률
  costInflationRate: number;        // 비용상승률
  taxRate: number;                  // 법인세율
  scenarioType: 'pessimistic' | 'neutral' | 'optimistic';
}
```

#### 3.2.2 계산 엔진 알고리즘

##### NPV (순현재가치) 계산
```typescript
function calculateNPV(cashFlows: number[], discountRate: number): number {
  const rate = discountRate / 100;
  
  return cashFlows.reduce((npv, cashFlow, year) => {
    if (year === 0) return npv + cashFlow;
    
    const discountFactor = Math.pow(1 + rate, year);
    const presentValue = cashFlow / discountFactor;
    return npv + presentValue;
  }, 0);
}
```

##### IRR (내부수익률) 계산
```typescript
function calculateIRR(cashFlows: number[], initialGuess: number = 10): number {
  // 이분법과 Newton-Raphson 방법 결합
  const bisectionResult = calculateIRRBisection(cashFlows);
  
  if (isFinite(bisectionResult) && Math.abs(bisectionResult) < 500) {
    const newtonResult = calculateIRRNewtonRaphson(cashFlows, bisectionResult);
    
    if (isFinite(newtonResult) && Math.abs(newtonResult - bisectionResult) < 100) {
      return Math.max(-95, Math.min(500, newtonResult));
    }
  }
  
  return Math.max(-95, Math.min(500, bisectionResult));
}
```

##### DSCR (부채상환능력비율) 계산
```typescript
function calculateYearlyDSCR(input: InvestmentInput): DSCRData[] {
  const yearlyData = [];
  
  for (let year = 1; year <= input.analysisYears; year++) {
    // 매출 계산 (성장률 적용)
    const yearlyRevenue = input.annualRevenue * 
      Math.pow(1 + input.revenueGrowthRate / 100, year - 1);
    
    // 영업이익 계산
    const yearlyOperatingProfit = yearlyRevenue * 
      (input.operatingProfitRate / 100);
    
    // 정책자금 상환액 계산
    const policyLoan = calculateDebtPayment(
      input.policyLoanAmount,
      input.policyLoanRate,
      year,
      input.gracePeriod,
      input.repaymentPeriod
    );
    
    // 기타채무 상환액 계산
    const otherDebt = calculateDebtPayment(
      input.otherDebtAmount,
      input.otherDebtRate,
      year,
      input.otherDebtGracePeriod,
      input.otherDebtRepaymentPeriod
    );
    
    // 총 부채상환액
    const totalDebtService = 
      policyLoan.principal + policyLoan.interest + 
      otherDebt.principal + otherDebt.interest;
    
    // DSCR 계산
    const yearlyDSCR = totalDebtService > 0 ? 
      yearlyOperatingProfit / totalDebtService : 0;
    
    yearlyData.push({
      year,
      revenue: yearlyRevenue,
      operatingProfit: yearlyOperatingProfit,
      policyLoanPrincipal: policyLoan.principal,
      policyLoanInterest: policyLoan.interest,
      otherDebtPrincipal: otherDebt.principal,
      otherDebtInterest: otherDebt.interest,
      totalDebtService,
      dscr: yearlyDSCR
    });
  }
  
  return yearlyData;
}
```

### 3.3 5구간 투자규모별 평가 시스템

#### 3.3.1 투자규모 분류
```typescript
function getInvestmentScaleInfo(initialInvestment: number) {
  const investmentInBillion = initialInvestment;
  
  if (investmentInBillion >= 100) {
    return {
      scale: 'mega',
      riskPremium: 0.18,
      description: '메가 투자 (100억원 이상)',
      minIRR: 20,
      minDSCR: 3.0,
      maxPayback: 3.5
    };
  } else if (investmentInBillion >= 75) {
    return {
      scale: 'large',
      riskPremium: 0.15,
      description: '대규모 투자 (75-100억원)',
      minIRR: 18,
      minDSCR: 2.5,
      maxPayback: 4
    };
  } else if (investmentInBillion >= 50) {
    return {
      scale: 'medium',
      riskPremium: 0.12,
      description: '중규모 투자 (50-75억원)',
      minIRR: 15,
      minDSCR: 2.0,
      maxPayback: 5
    };
  } else if (investmentInBillion >= 25) {
    return {
      scale: 'small',
      riskPremium: 0.08,
      description: '소규모 투자 (25-50억원)',
      minIRR: 12,
      minDSCR: 1.5,
      maxPayback: 6
    };
  } else {
    return {
      scale: 'micro',
      riskPremium: 0.05,
      description: '마이크로 투자 (25억원 미만)',
      minIRR: 10,
      minDSCR: 1.25,
      maxPayback: 8
    };
  }
}
```

#### 3.3.2 동적 점수 구간 생성
```typescript
function getDynamicGradingCriteria(scale: InvestmentScale) {
  const baseWeight = { npv: 30, irr: 25, dscr: 25, payback: 20 };
  
  const scaleAdjustment = {
    mega: { npv: 1.3, irr: 1.2, dscr: 1.4, payback: 0.9 },
    large: { npv: 1.2, irr: 1.1, dscr: 1.3, payback: 1.0 },
    medium: { npv: 1.0, irr: 1.0, dscr: 1.0, payback: 1.0 },
    small: { npv: 0.8, irr: 1.2, dscr: 0.9, payback: 1.1 },
    micro: { npv: 0.7, irr: 1.3, dscr: 0.8, payback: 1.2 }
  };
  
  const adjustment = scaleAdjustment[scale];
  
  return {
    npv: {
      weight: Math.round(baseWeight.npv * adjustment.npv),
      ranges: getScaleSpecificNPVRanges(scale)
    },
    irr: {
      weight: Math.round(baseWeight.irr * adjustment.irr),
      ranges: getScaleSpecificIRRRanges(scale)
    },
    dscr: {
      weight: Math.round(baseWeight.dscr * adjustment.dscr),
      ranges: getScaleSpecificDSCRRanges(scale)
    },
    payback: {
      weight: Math.round(baseWeight.payback * adjustment.payback),
      ranges: getScaleSpecificPaybackRanges(scale)
    }
  };
}
```

### 3.4 AI 기반 종합 평가 시스템

#### 3.4.1 AI 평가 알고리즘
```typescript
function generateAIInvestmentEvaluation(
  result: InvestmentResult, 
  input: InvestmentInput
): AIEvaluation {
  const scaleInfo = getInvestmentScaleInfo(input.initialInvestment);
  const grade = calculateInvestmentGrade(result, input.initialInvestment);
  
  // 8개 핵심 지표 분석
  const metrics = {
    npv: analyzeNPVMetric(result.npv, scaleInfo),
    irr: analyzeIRRMetric(result.irr, scaleInfo),
    dscr: analyzeDSCRMetric(calculateAverageDSCR(result), scaleInfo),
    payback: analyzePaybackMetric(result.paybackPeriod, scaleInfo),
    profitability: analyzeProfitabilityMetric(result, input),
    stability: analyzeStabilityMetric(result, input),
    growth: analyzeGrowthMetric(result, input),
    risk: analyzeRiskMetric(result, input, scaleInfo)
  };
  
  // 종합 신뢰도 계산
  const confidence = calculateConfidence(metrics, grade);
  
  // AI 추천 생성
  const recommendation = generateAIRecommendation(grade, metrics, scaleInfo);
  
  return {
    overallGrade: grade,
    metrics,
    confidence,
    recommendation,
    scaleAnalysis: scaleInfo,
    timestamp: new Date().toISOString()
  };
}
```

#### 3.4.2 지표별 분석 함수
```typescript
function analyzeNPVMetric(npv: number, scaleInfo: InvestmentScaleInfo) {
  const npvInBillion = npv / 100000000;
  
  let score = 0;
  let analysis = '';
  let recommendation = '';
  
  // 투자규모별 NPV 기준 적용
  const thresholds = getNPVThresholds(scaleInfo.scale);
  
  if (npvInBillion >= thresholds.excellent) {
    score = 100;
    analysis = `NPV ${npvInBillion.toFixed(1)}억원으로 ${scaleInfo.description} 대비 탁월한 수준`;
    recommendation = '즉시 투자 실행 권장';
  } else if (npvInBillion >= thresholds.good) {
    score = 80;
    analysis = `NPV ${npvInBillion.toFixed(1)}억원으로 ${scaleInfo.description} 대비 양호한 수준`;
    recommendation = '투자 실행 권장';
  } else if (npvInBillion >= thresholds.fair) {
    score = 60;
    analysis = `NPV ${npvInBillion.toFixed(1)}억원으로 ${scaleInfo.description} 대비 보통 수준`;
    recommendation = '신중한 검토 후 투자 고려';
  } else {
    score = 30;
    analysis = `NPV ${npvInBillion.toFixed(1)}억원으로 ${scaleInfo.description} 대비 부족한 수준`;
    recommendation = '투자 계획 재검토 필요';
  }
  
  return { score, analysis, recommendation };
}
```

---

## 🎨 UI/UX 디자인 가이드

### 4.1 디자인 시스템

#### 4.1.1 컬러 팔레트
```typescript
const colors = {
  primary: {
    blue: '#1e40af',
    lightBlue: '#3b82f6',
    darkBlue: '#1e3a8a'
  },
  secondary: {
    green: '#10b981',
    purple: '#8b5cf6',
    orange: '#f59e0b'
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  grades: {
    AA: '#10b981',  // 에메랄드
    A: '#3b82f6',   // 블루
    B: '#f59e0b',   // 옐로우
    C: '#f97316',   // 오렌지
    D: '#ef4444'    // 레드
  }
};
```

#### 4.1.2 타이포그래피
```css
.text-hero {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
}

.text-section-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
}

.text-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.text-body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
}
```

#### 4.1.3 컴포넌트 스타일
```typescript
const cardStyles = {
  base: "bg-white rounded-lg border border-gray-200 shadow-sm",
  elevated: "bg-white rounded-lg border border-gray-200 shadow-lg",
  gradient: "bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200",
  success: "bg-green-50 border-green-200 rounded-lg",
  warning: "bg-yellow-50 border-yellow-200 rounded-lg",
  error: "bg-red-50 border-red-200 rounded-lg"
};

const buttonStyles = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-6 py-3 rounded-lg transition-colors",
  success: "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors",
  outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-6 py-3 rounded-lg transition-colors"
};
```

### 4.2 반응형 디자인

#### 4.2.1 브레이크포인트
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
```

#### 4.2.2 모바일 최적화
```typescript
const mobileOptimizations = {
  stickyNavigation: {
    enabled: true,
    position: 'top-16',
    background: 'bg-white/95 backdrop-blur-sm'
  },
  touchOptimized: {
    minTouchTarget: '44px',
    spacing: 'gap-4',
    padding: 'p-4'
  },
  performance: {
    lazyLoading: true,
    imageOptimization: true,
    codesplitting: true
  }
};
```

---

## 📊 데이터 구조 및 타입 정의

### 5.1 핵심 인터페이스

#### 5.1.1 투자 결과 타입
```typescript
interface InvestmentResult {
  npv: number;
  irr: number;
  paybackPeriod: number;
  simplePaybackPeriod: number;
  breakEvenPoint: number;
  dscr: number[];
  roi: number;
  profitabilityIndex: number;
  cashFlows: CashFlow[];
  
  // 고급 지표
  averageROI: number;
  cumulativeROI: number;
  riskAdjustedReturn: number;
  marketValueAdded: number;
  economicValueAdded: number;
  
  // 상세 데이터
  npvDetails?: NPVDetailedCalculation;
  dscrData?: DSCRDetailedData[];
}
```

#### 5.1.2 투자 등급 타입
```typescript
interface InvestmentGrade {
  grade: string;
  score: number;
  recommendation: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradeDesc: string;
  details: {
    npvScore: number;
    irrScore: number;
    dscrScore: number;
    paybackScore: number;
  };
  investmentScale: 'mega' | 'large' | 'medium' | 'small' | 'micro';
  riskPremium: number;
  adjustedScore: number;
}
```

#### 5.1.3 AI 평가 타입
```typescript
interface AIEvaluation {
  overallGrade: InvestmentGrade;
  metrics: {
    npv: MetricAnalysis;
    irr: MetricAnalysis;
    dscr: MetricAnalysis;
    payback: MetricAnalysis;
    profitability: MetricAnalysis;
    stability: MetricAnalysis;
    growth: MetricAnalysis;
    risk: MetricAnalysis;
  };
  confidence: number;
  recommendation: string;
  scaleAnalysis: InvestmentScaleInfo;
  timestamp: string;
}
```

### 5.2 계산 결과 구조

#### 5.2.1 현금흐름 데이터
```typescript
interface CashFlow {
  year: number;
  revenue: number;
  operatingCost: number;
  ebit: number;
  tax: number;
  netIncome: number;
  depreciation: number;
  loanPrincipal: number;
  loanInterest: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  presentValue: number;
  cumulativePV: number;
  operatingProfitRate: number;
  roic: number;
  fcf: number;
  discountedFCF: number;
}
```

#### 5.2.2 DSCR 상세 데이터
```typescript
interface DSCRDetailedData {
  year: number;
  revenue: number;
  operatingProfit: number;
  policyLoanPrincipal: number;
  policyLoanInterest: number;
  remainingPolicyLoan: number;
  otherDebtPrincipal: number;
  otherDebtInterest: number;
  remainingOtherDebt: number;
  totalDebtService: number;
  dscr: number;
  isGracePeriod: boolean;
  isRepaymentPeriod: boolean;
  isPostRepayment: boolean;
  scenarioType: string;
  scenarioAdjustment: number;
}
```

---

## 🔄 사용자 플로우 (User Flow)

### 6.1 메인 플로우

#### 6.1.1 정책자금 페이지 진입
```
사용자 → 정책자금 서비스 페이지 → 히어로 섹션 → 투자분석 시작 버튼 클릭
```

#### 6.1.2 투자분석 프로세스
```
Step 1: 투자정보 입력
├── 기본 정보 (투자금, 매출, 이익률)
├── 대출 조건 (정책자금, 기타채무)
├── 분석 설정 (기간, 할인율)
└── 고급 설정 (성장률, 시나리오)

Step 2: 분석 실행
├── NPV/IRR 계산
├── DSCR 분석
├── 회수기간 계산
└── AI 종합 평가

Step 3: 결과 확인
├── 핵심지표 대시보드
├── 상세 재무분석
├── DSCR 연도별 분석
├── 시나리오 분석
└── AI 종합평가 및 추천
```

### 6.2 상호작용 플로우

#### 6.2.1 실시간 계산
```typescript
const handleInputChange = (field: string, value: number) => {
  // 입력값 업데이트
  setInvestmentInput(prev => ({
    ...prev,
    [field]: value
  }));
  
  // 500ms 디바운스 후 자동 재계산
  if (analysisResult) {
    setTimeout(() => {
      handleInvestmentAnalysis();
    }, 500);
  }
};
```

#### 6.2.2 탭 네비게이션
```typescript
const tabStructure = {
  'ai-evaluation': '🤖 AI 종합평가',
  'financial': '💎 재무분석',
  'summary': '📊 핵심지표',
  'scenarios': '📈 시나리오',
  'ai-report': '🧠 AI 리포트'
};
```

---

## 🧪 테스트 전략

### 7.1 단위 테스트

#### 7.1.1 계산 엔진 테스트
```typescript
describe('Investment Analysis Engine', () => {
  test('NPV calculation accuracy', () => {
    const cashFlows = [-5000000000, 1200000000, 1400000000, 1600000000];
    const discountRate = 10;
    const result = calculateNPV(cashFlows, discountRate);
    
    expect(result).toBeCloseTo(expectedNPV, 2);
  });
  
  test('IRR calculation convergence', () => {
    const cashFlows = [-5000000000, 1200000000, 1400000000, 1600000000];
    const result = calculateIRR(cashFlows);
    
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(100);
  });
  
  test('DSCR calculation with grace period', () => {
    const input = {
      operatingProfit: 1500000000,
      policyLoanAmount: 2000000000,
      policyLoanRate: 2.5,
      gracePeriod: 2,
      repaymentPeriod: 5
    };
    
    const result = calculateDSCR(input);
    expect(result).toBeGreaterThan(0);
  });
});
```

#### 7.1.2 등급 계산 테스트
```typescript
describe('Investment Grade Calculation', () => {
  test('5-tier scale classification', () => {
    const testCases = [
      { investment: 120, expectedScale: 'mega' },
      { investment: 80, expectedScale: 'large' },
      { investment: 60, expectedScale: 'medium' },
      { investment: 35, expectedScale: 'small' },
      { investment: 15, expectedScale: 'micro' }
    ];
    
    testCases.forEach(({ investment, expectedScale }) => {
      const scaleInfo = getInvestmentScaleInfo(investment);
      expect(scaleInfo.scale).toBe(expectedScale);
    });
  });
  
  test('Risk premium application', () => {
    const megaResult = calculateInvestmentGrade(mockResult, 120);
    const microResult = calculateInvestmentGrade(mockResult, 15);
    
    expect(megaResult.riskPremium).toBeGreaterThan(microResult.riskPremium);
    expect(megaResult.adjustedScore).toBeLessThan(megaResult.score);
  });
});
```

### 7.2 통합 테스트

#### 7.2.1 전체 분석 플로우 테스트
```typescript
describe('Complete Analysis Flow', () => {
  test('End-to-end investment analysis', async () => {
    const input = createMockInvestmentInput();
    const result = await performInvestmentAnalysis(input);
    
    expect(result.npv).toBeDefined();
    expect(result.irr).toBeDefined();
    expect(result.paybackPeriod).toBeDefined();
    expect(result.dscrData).toHaveLength(input.analysisYears);
  });
  
  test('AI evaluation generation', async () => {
    const input = createMockInvestmentInput();
    const result = await performInvestmentAnalysis(input);
    const aiEvaluation = generateAIInvestmentEvaluation(result, input);
    
    expect(aiEvaluation.overallGrade).toBeDefined();
    expect(aiEvaluation.confidence).toBeGreaterThan(0);
    expect(aiEvaluation.confidence).toBeLessThanOrEqual(100);
  });
});
```

### 7.3 성능 테스트

#### 7.3.1 계산 성능 벤치마크
```typescript
describe('Performance Benchmarks', () => {
  test('Large dataset calculation performance', () => {
    const startTime = performance.now();
    
    const input = {
      ...mockInput,
      analysisYears: 20
    };
    
    const result = performInvestmentAnalysis(input);
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    expect(executionTime).toBeLessThan(1000); // 1초 이내
    expect(result.cashFlows).toHaveLength(20);
  });
});
```

---

## 🚀 배포 및 운영

### 8.1 배포 환경

#### 8.1.1 Vercel 배포 설정
```json
{
  "name": "m_center_landingpage",
  "version": "2.0.0",
  "scripts": {
    "dev": "next dev -p 3005",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.13",
    "react": "^18.3.1",
    "typescript": "^5.6.2",
    "tailwindcss": "^3.4.1"
  }
}
```

#### 8.1.2 환경 변수 설정
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://m-center-landingpage.vercel.app
NEXT_PUBLIC_API_URL=https://api.m-center.kr
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your_sheets_id
```

### 8.2 모니터링 및 로깅

#### 8.2.1 에러 트래킹
```typescript
interface ErrorLog {
  timestamp: string;
  component: string;
  error: Error;
  userAgent: string;
  url: string;
  userId?: string;
}

const logError = (error: Error, component: string) => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    component,
    error,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // 에러 로깅 서비스로 전송
  console.error('Application Error:', errorLog);
};
```

#### 8.2.2 성능 모니터링
```typescript
const performanceMonitor = {
  trackAnalysisTime: (startTime: number, endTime: number) => {
    const duration = endTime - startTime;
    
    if (duration > 5000) {
      console.warn('Slow analysis detected:', duration + 'ms');
    }
    
    // 성능 메트릭 수집
    return {
      duration,
      timestamp: new Date().toISOString(),
      type: 'investment_analysis'
    };
  }
};
```

---

## 📚 개발 가이드

### 9.1 코딩 컨벤션

#### 9.1.1 TypeScript 규칙
```typescript
// 인터페이스 명명: PascalCase
interface InvestmentInput {
  initialInvestment: number;
}

// 함수 명명: camelCase
function calculateInvestmentGrade(): InvestmentGrade {
  // 구현
}

// 상수 명명: UPPER_SNAKE_CASE
const DEFAULT_DISCOUNT_RATE = 10;

// 타입 가드 사용
function isValidInvestmentInput(input: any): input is InvestmentInput {
  return typeof input.initialInvestment === 'number' &&
         input.initialInvestment > 0;
}
```

#### 9.1.2 컴포넌트 구조
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { ComponentProps } from './types';

interface Props extends ComponentProps {
  onAnalysisComplete: (result: InvestmentResult) => void;
}

export default function InvestmentAnalysisTool({ onAnalysisComplete }: Props) {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  
  // 이벤트 핸들러
  const handleSubmit = async (data: InvestmentInput) => {
    setIsLoading(true);
    try {
      const result = await performInvestmentAnalysis(data);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 렌더링
  return (
    <div className="investment-analysis-tool">
      {/* 컴포넌트 내용 */}
    </div>
  );
}
```

### 9.2 성능 최적화

#### 9.2.1 메모이제이션
```typescript
import { useMemo, useCallback } from 'react';

const InvestmentResultDisplay = ({ result, input }) => {
  // 복잡한 계산 결과 메모이제이션
  const gradingCriteria = useMemo(() => {
    return getDynamicGradingCriteria(getInvestmentScaleInfo(input.initialInvestment).scale);
  }, [input.initialInvestment]);
  
  // 콜백 함수 메모이제이션
  const handleExport = useCallback(() => {
    exportToExcel(result);
  }, [result]);
  
  return (
    <div>
      {/* 컴포넌트 렌더링 */}
    </div>
  );
};
```

#### 9.2.2 지연 로딩
```typescript
import { lazy, Suspense } from 'react';

const AIReportDisplay = lazy(() => import('./AIReportDisplay'));
const AdvancedSettingsPanel = lazy(() => import('./AdvancedSettingsPanel'));

const InvestmentAnalysisTool = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AIReportDisplay />
      </Suspense>
      
      <Suspense fallback={<div>Loading advanced settings...</div>}>
        <AdvancedSettingsPanel />
      </Suspense>
    </div>
  );
};
```

---

## 🔧 유지보수 및 확장

### 10.1 코드 구조 확장성

#### 10.1.1 새로운 지표 추가
```typescript
// 새로운 지표 인터페이스
interface NewMetric {
  name: string;
  calculate: (input: InvestmentInput, result: InvestmentResult) => number;
  weight: number;
  ranges: ScoreRange[];
}

// 지표 레지스트리에 추가
const METRICS_REGISTRY = {
  npv: NPVMetric,
  irr: IRRMetric,
  dscr: DSCRMetric,
  payback: PaybackMetric,
  // 새로운 지표 추가
  newMetric: NewMetric
};
```

#### 10.1.2 새로운 투자규모 구간 추가
```typescript
const INVESTMENT_SCALES = {
  // 기존 구간
  mega: { min: 100, riskPremium: 0.18 },
  large: { min: 75, riskPremium: 0.15 },
  medium: { min: 50, riskPremium: 0.12 },
  small: { min: 25, riskPremium: 0.08 },
  micro: { min: 0, riskPremium: 0.05 },
  
  // 새로운 구간 추가 예시
  // ultra: { min: 500, riskPremium: 0.25 }
};
```

### 10.2 API 확장

#### 10.2.1 외부 데이터 연동
```typescript
interface ExternalDataSource {
  name: string;
  endpoint: string;
  apiKey: string;
  rateLimit: number;
}

const DATA_SOURCES = {
  marketData: {
    name: 'Market Data API',
    endpoint: 'https://api.marketdata.com',
    apiKey: process.env.MARKET_DATA_API_KEY,
    rateLimit: 1000
  },
  economicIndicators: {
    name: 'Economic Indicators API',
    endpoint: 'https://api.economic.gov',
    apiKey: process.env.ECONOMIC_API_KEY,
    rateLimit: 500
  }
};
```

#### 10.2.2 AI 모델 업그레이드
```typescript
interface AIModelConfig {
  version: string;
  endpoint: string;
  parameters: {
    temperature: number;
    maxTokens: number;
    model: string;
  };
}

const AI_MODELS = {
  current: {
    version: '1.0.0',
    endpoint: '/api/ai-evaluation',
    parameters: {
      temperature: 0.7,
      maxTokens: 2000,
      model: 'gemini-pro'
    }
  },
  // 새로운 모델 추가 시
  // next: {
  //   version: '2.0.0',
  //   endpoint: '/api/ai-evaluation-v2',
  //   parameters: {
  //     temperature: 0.5,
  //     maxTokens: 4000,
  //     model: 'gemini-pro-vision'
  //   }
  // }
};
```

---

## 📖 결론

이 PRD는 정책자금 상세페이지와 재무타당성분석기의 완전한 개발 가이드를 제공합니다. 5구간 투자규모별 평가 시스템과 AI 기반 종합 평가를 통해 사용자에게 정밀하고 신뢰할 수 있는 투자 분석 도구를 제공할 수 있습니다.

### 주요 성과
- ✅ 정밀한 NPV/IRR/DSCR 계산 엔진
- ✅ 5구간 투자규모별 차별화된 평가 시스템
- ✅ AI 기반 8개 지표 종합 분석
- ✅ 반응형 모바일 최적화 UI
- ✅ 실시간 계산 및 결과 업데이트
- ✅ 포괄적인 테스트 및 성능 최적화

### 기술적 우수성
- TypeScript 기반 타입 안전성
- 모듈화된 확장 가능한 아키텍처
- 성능 최적화된 계산 알고리즘
- 포괄적인 에러 처리 및 검증

이 문서를 기반으로 동일한 기능과 성능을 가진 정책자금 상세페이지를 완벽하게 재구현할 수 있습니다. 