# 세무사 전용 통합 세금계산기 개발 PRD

## 📋 프로젝트 개요

### 프로젝트 정보
- **프로젝트명**: TaxPro Calculator
- **버전**: 1.0.0
- **개발 기간**: 8주 (56일)
- **개발 인원**: Frontend 2명, QA 1명
- **기술 스택**: React 18, TypeScript, Ant Design, Vite

### 목표
세무사가 클라이언트 상담 시 즉시 활용할 수 있는 올인원 세금계산기 웹애플리케이션 개발

---

## 🎯 기능 요구사항

### 핵심 기능 목록

#### 1. 개인세금 계산기
- 근로소득세 계산기
- 종합소득세 계산기  
- 양도소득세 계산기
- 상속세 계산기
- 증여세 계산기

#### 2. 법인세금 계산기
- 법인세 계산기
- 부가가치세 계산기
- 원천징수세 계산기

#### 3. 공통 기능
- 계산 결과 히스토리 관리
- 결과 인쇄/복사 기능
- 빠른계산 바로가기
- 실시간 입력 검증

---

## 🏗️ 시스템 아키텍처

### 전체 구조
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                    │
├─────────────────────────────────────────────────────────┤
│  Components  │  Hooks  │  Utils  │  Types  │  Constants │
├─────────────────────────────────────────────────────────┤
│              Tax Calculation Engine                     │
├─────────────────────────────────────────────────────────┤
│                  Local Storage                          │
└─────────────────────────────────────────────────────────┘
```

### 폴더 구조
```
src/
├── components/
│   ├── common/
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── Forms/
│   │   │   ├── NumberInput.tsx
│   │   │   ├── PercentInput.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── FormSection.tsx
│   │   └── Results/
│   │       ├── ResultCard.tsx
│   │       ├── ResultTable.tsx
│   │       ├── CalculationBreakdown.tsx
│   │       └── ActionButtons.tsx
│   ├── calculators/
│   │   ├── personal/
│   │   │   ├── EarnedIncomeTax/
│   │   │   │   ├── EarnedIncomeTaxCalculator.tsx
│   │   │   │   ├── EarnedIncomeTaxForm.tsx
│   │   │   │   └── EarnedIncomeTaxResult.tsx
│   │   │   ├── ComprehensiveIncomeTax/
│   │   │   ├── CapitalGainsTax/
│   │   │   ├── InheritanceTax/
│   │   │   └── GiftTax/
│   │   └── corporate/
│   │       ├── CorporateTax/
│   │       ├── VAT/
│   │       └── WithholdingTax/
│   └── features/
│       ├── TabNavigation.tsx
│       ├── QuickCalculator.tsx
│       ├── HistoryManager.tsx
│       └── PrintManager.tsx
├── hooks/
│   ├── useCalculator.ts
│   ├── useHistory.ts
│   ├── useValidation.ts
│   └── usePrint.ts
├── utils/
│   ├── calculations/
│   │   ├── personalTax.ts
│   │   ├── corporateTax.ts
│   │   ├── taxRates.ts
│   │   └── deductions.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── storage.ts
├── types/
│   ├── calculator.types.ts
│   ├── tax.types.ts
│   └── common.types.ts
├── constants/
│   ├── taxRates.ts
│   ├── deductions.ts
│   └── messages.ts
├── data/
│   ├── taxTable2024.json
│   └── deductionRates.json
└── styles/
    ├── globals.css
    ├── variables.css
    └── components/
```

---

## 📱 UI/UX 상세 설계

### 전체 레이아웃 명세

#### 컨테이너 사이즈
- **최대 너비**: 1200px
- **최소 너비**: 768px
- **패딩**: 24px
- **여백**: 16px

#### 색상 팔레트
```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --text-color: #262626;
  --text-secondary: #8c8c8c;
  --bg-color: #ffffff;
  --bg-secondary: #fafafa;
  --border-color: #d9d9d9;
}
```

#### 타이포그래피
```css
/* 제목 */
.title-large { font-size: 24px; font-weight: 600; line-height: 32px; }
.title-medium { font-size: 20px; font-weight: 500; line-height: 28px; }
.title-small { font-size: 16px; font-weight: 500; line-height: 24px; }

/* 본문 */
.body-large { font-size: 16px; font-weight: 400; line-height: 24px; }
.body-medium { font-size: 14px; font-weight: 400; line-height: 22px; }
.body-small { font-size: 12px; font-weight: 400; line-height: 20px; }

/* 결과 표시 */
.result-large { font-size: 28px; font-weight: 600; line-height: 36px; }
.result-medium { font-size: 20px; font-weight: 500; line-height: 28px; }
```

### 컴포넌트별 상세 명세

#### 1. MainLayout 컴포넌트
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

#### 2. TabNavigation 컴포넌트
```typescript
interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const tabs: TabItem[] = [
  {
    key: 'personal',
    label: '개인세금',
    icon: <UserOutlined />,
    children: <PersonalTaxCalculators />
  },
  {
    key: 'corporate', 
    label: '법인세금',
    icon: <BankOutlined />,
    children: <CorporateTaxCalculators />
  },
  {
    key: 'quick',
    label: '빠른계산',
    icon: <ThunderboltOutlined />,
    children: <QuickCalculator />
  },
  {
    key: 'history',
    label: '계산기록',
    icon: <HistoryOutlined />,
    children: <HistoryManager />
  }
];
```

#### 3. NumberInput 컴포넌트
```typescript
interface NumberInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  required?: boolean;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  precision?: number;
  disabled?: boolean;
  tooltip?: string;
  error?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  suffix = '원',
  placeholder,
  min = 0,
  max,
  precision = 0,
  disabled = false,
  tooltip,
  error
}) => {
  const handleChange = (val: number | null) => {
    if (val === null || (val >= min && (!max || val <= max))) {
      onChange(val);
    }
  };

  return (
    <Form.Item
      label={
        <span>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
          {tooltip && <Tooltip title={tooltip}><InfoCircleOutlined /></Tooltip>}
        </span>
      }
      validateStatus={error ? 'error' : ''}
      help={error}
    >
      <InputNumber
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        suffix={suffix}
        min={min}
        max={max}
        precision={precision}
        disabled={disabled}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
};
```

---

## 🧮 계산 엔진 상세 설계

### 세금 계산 인터페이스

#### 공통 인터페이스
```typescript
interface TaxCalculationInput {
  [key: string]: number | string | boolean | Date;
}

interface TaxCalculationResult {
  taxableAmount: number;        // 과세표준
  calculatedTax: number;        // 산출세액  
  localIncomeTax: number;       // 지방소득세
  totalTax: number;             // 총 세액
  netAmount?: number;           // 실수령액
  breakdown: CalculationBreakdown;
  appliedRates: AppliedRate[];
  deductions: Deduction[];
}

interface CalculationBreakdown {
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

interface CalculationStep {
  label: string;
  amount: number;
  formula?: string;
  note?: string;
}

interface AppliedRate {
  range: string;
  rate: number;
  amount: number;
}

interface Deduction {
  type: string;
  label: string;
  amount: number;
  limit?: number;
}
```

#### 근로소득세 계산기 인터페이스
```typescript
interface EarnedIncomeTaxInput extends TaxCalculationInput {
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

interface EarnedIncomeTaxResult extends TaxCalculationResult {
  monthlySalary: number;                   // 월 실수령액
  yearEndTaxSettlement: number;            // 연말정산 예상액
  monthlyWithholding: number;              // 월 원천징수세액
}
```

### 세금 계산 공식

#### 1. 근로소득세 계산 로직
```typescript
class EarnedIncomeTaxCalculator {
  static calculate(input: EarnedIncomeTaxInput): EarnedIncomeTaxResult {
    // 1단계: 근로소득공제 계산
    const earnedIncomeDeduction = this.calculateEarnedIncomeDeduction(input.annualSalary);
    
    // 2단계: 인적공제 계산  
    const personalDeduction = this.calculatePersonalDeduction(input);
    
    // 3단계: 특별공제/표준공제 계산
    const specialDeduction = this.calculateSpecialDeduction(input);
    const standardDeduction = 130000; // 2024년 기준
    const deduction = Math.max(specialDeduction, standardDeduction);
    
    // 4단계: 과세표준 계산
    const taxableIncome = Math.max(0, 
      input.annualSalary - earnedIncomeDeduction - personalDeduction - deduction
    );
    
    // 5단계: 산출세액 계산
    const calculatedTax = this.calculateProgressiveTax(taxableIncome, TAX_RATES_2024);
    
    // 6단계: 세액공제 계산
    const taxCredit = this.calculateTaxCredit(input);
    
    // 7단계: 결정세액 계산
    const finalTax = Math.max(0, calculatedTax - taxCredit);
    const localIncomeTax = Math.floor(finalTax * 0.1);
    const totalTax = finalTax + localIncomeTax;
    
    // 8단계: 월 실수령액 계산
    const monthlyGross = input.annualSalary / 12;
    const monthlyTax = totalTax / 12;
    const monthlySalary = monthlyGross - monthlyTax - input.pensionContribution/12 - input.healthInsurance/12;
    
    return {
      taxableAmount: taxableIncome,
      calculatedTax: finalTax,
      localIncomeTax,
      totalTax,
      monthlySalary: Math.floor(monthlySalary),
      netAmount: input.annualSalary - totalTax,
      yearEndTaxSettlement: 0, // 별도 계산 필요
      monthlyWithholding: Math.floor(monthlyTax),
      breakdown: this.generateBreakdown(input, taxableIncome, calculatedTax, finalTax),
      appliedRates: this.getAppliedRates(taxableIncome),
      deductions: this.getDeductionList(earnedIncomeDeduction, personalDeduction, deduction)
    };
  }

  private static calculateEarnedIncomeDeduction(salary: number): number {
    if (salary <= 5000000) return Math.min(salary * 0.7, 3500000);
    if (salary <= 15000000) return Math.min(3500000 + (salary - 5000000) * 0.4, 9500000);
    if (salary <= 45000000) return Math.min(9500000 + (salary - 15000000) * 0.15, 14000000);
    if (salary <= 100000000) return Math.min(14000000 + (salary - 45000000) * 0.05, 16750000);
    return 20000000;
  }

  private static calculatePersonalDeduction(input: EarnedIncomeTaxInput): number {
    let deduction = 1500000; // 본인공제
    deduction += input.dependents * 1500000; // 부양가족공제
    if (input.isDisabled) deduction += 2000000; // 장애인공제
    if (input.isElderly) deduction += 1000000; // 경로우대공제
    return deduction;
  }

  private static calculateProgressiveTax(income: number, rates: TaxRate[]): number {
    let tax = 0;
    let remainingIncome = income;
    
    for (const rate of rates) {
      if (remainingIncome <= 0) break;
      
      const bracketIncome = Math.min(remainingIncome, rate.max - rate.min);
      tax += bracketIncome * rate.rate;
      remainingIncome -= bracketIncome;
    }
    
    return Math.floor(tax);
  }
}
```

#### 2. 세율 테이블 (2024년 기준)
```typescript
const TAX_RATES_2024: TaxRate[] = [
  { min: 0, max: 14000000, rate: 0.06 },
  { min: 14000000, max: 50000000, rate: 0.15 },
  { min: 50000000, max: 88000000, rate: 0.24 },
  { min: 88000000, max: 150000000, rate: 0.35 },
  { min: 150000000, max: 300000000, rate: 0.38 },
  { min: 300000000, max: 500000000, rate: 0.40 },
  { min: 500000000, max: 1000000000, rate: 0.42 },
  { min: 1000000000, max: Infinity, rate: 0.45 }
];

const CORPORATE_TAX_RATES_2024: TaxRate[] = [
  { min: 0, max: 200000000, rate: 0.10 },        // 중소기업 특례
  { min: 200000000, max: 20000000000, rate: 0.20 },   // 중소기업
  { min: 20000000000, max: 300000000000, rate: 0.22 }, // 일반법인
  { min: 300000000000, max: Infinity, rate: 0.25 }     // 일반법인
];
```

#### 3. 양도소득세 계산 로직
```typescript
class CapitalGainsTaxCalculator {
  static calculate(input: CapitalGainsTaxInput): CapitalGainsTaxResult {
    // 1단계: 양도차익 계산
    const capitalGain = input.transferPrice - input.acquisitionPrice - input.transferExpenses;
    
    // 2단계: 양도소득금액 계산 (장기보유특별공제 적용)
    const longTermDeduction = this.calculateLongTermDeduction(capitalGain, input.holdingPeriod);
    const capitalGainIncome = capitalGain - longTermDeduction;
    
    // 3단계: 양도소득과세표준 계산
    const basicDeduction = 2500000; // 기본공제
    const taxableGain = Math.max(0, capitalGainIncome - basicDeduction);
    
    // 4단계: 세율 적용
    let taxRate: number;
    if (input.isOneHousehold && input.isResidential) {
      // 1세대 1주택 비과세 또는 감면
      taxRate = this.getOneHouseholdTaxRate(input.holdingPeriod);
    } else {
      taxRate = this.getGeneralCapitalGainsTaxRate(input.holdingPeriod);
    }
    
    const calculatedTax = Math.floor(taxableGain * taxRate);
    const localIncomeTax = Math.floor(calculatedTax * 0.1);
    const totalTax = calculatedTax + localIncomeTax;
    
    return {
      capitalGain,
      capitalGainIncome,
      taxableAmount: taxableGain,
      calculatedTax,
      localIncomeTax,
      totalTax,
      netProceeds: input.transferPrice - totalTax,
      breakdown: this.generateCapitalGainsBreakdown(input, capitalGain, taxableGain, calculatedTax),
      appliedRates: [{ range: `${taxRate * 100}%`, rate: taxRate, amount: calculatedTax }],
      deductions: [
        { type: 'longTerm', label: '장기보유특별공제', amount: longTermDeduction },
        { type: 'basic', label: '기본공제', amount: basicDeduction }
      ]
    };
  }

  private static calculateLongTermDeduction(capitalGain: number, holdingPeriod: number): number {
    if (holdingPeriod < 1) return 0;
    
    const deductionRates = [
      { years: 1, rate: 0.1 },
      { years: 2, rate: 0.12 },
      { years: 3, rate: 0.16 },
      { years: 4, rate: 0.20 },
      { years: 5, rate: 0.24 },
      { years: 6, rate: 0.28 },
      { years: 7, rate: 0.32 },
      { years: 8, rate: 0.36 },
      { years: 9, rate: 0.40 },
      { years: 10, rate: 0.44 }
    ];
    
    const rate = deductionRates.find(r => holdingPeriod >= r.years)?.rate || 0;
    return Math.floor(capitalGain * rate);
  }
}
```

---

## 🔧 상태 관리 설계

### Context API 구조
```typescript
// 전역 상태 관리
interface AppState {
  activeTab: string;
  calculationHistory: CalculationRecord[];
  currentCalculation: CalculationState | null;
  userPreferences: UserPreferences;
}

interface CalculationState {
  type: CalculatorType;
  inputs: Record<string, any>;
  results: TaxCalculationResult | null;
  isCalculating: boolean;
  errors: Record<string, string>;
}

interface CalculationRecord {
  id: string;
  timestamp: Date;
  type: CalculatorType;
  inputs: Record<string, any>;
  results: TaxCalculationResult;
  title: string;
}

// Context Provider
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({} as any);

// Action Types
type AppAction =
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'ADD_CALCULATION_RECORD'; payload: CalculationRecord }
  | { type: 'SET_CALCULATION_INPUTS'; payload: { type: CalculatorType; inputs: Record<string, any> } }
  | { type: 'SET_CALCULATION_RESULTS'; payload: TaxCalculationResult }
  | { type: 'SET_CALCULATION_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_CALCULATION_ERRORS' }
  | { type: 'SET_CALCULATING'; payload: boolean };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'ADD_CALCULATION_RECORD':
      const newHistory = [action.payload, ...state.calculationHistory].slice(0, 50);
      return { ...state, calculationHistory: newHistory };
    
    case 'SET_CALCULATION_INPUTS':
      return {
        ...state,
        currentCalculation: {
          ...state.currentCalculation!,
          inputs: action.payload.inputs,
          type: action.payload.type
        }
      };
    
    case 'SET_CALCULATION_RESULTS':
      return {
        ...state,
        currentCalculation: {
          ...state.currentCalculation!,
          results: action.payload,
          isCalculating: false
        }
      };
    
    default:
      return state;
  }
};
```

### Custom Hooks

#### useCalculator Hook
```typescript
interface UseCalculatorReturn {
  inputs: Record<string, any>;
  results: TaxCalculationResult | null;
  errors: Record<string, string>;
  isCalculating: boolean;
  updateInput: (field: string, value: any) => void;
  calculate: () => Promise<void>;
  reset: () => void;
  saveToHistory: (title?: string) => void;
}

const useCalculator = (calculatorType: CalculatorType): UseCalculatorReturn => {
  const { state, dispatch } = useContext(AppContext);
  const currentCalc = state.currentCalculation;

  const updateInput = useCallback((field: string, value: any) => {
    const newInputs = { ...currentCalc?.inputs, [field]: value };
    dispatch({
      type: 'SET_CALCULATION_INPUTS',
      payload: { type: calculatorType, inputs: newInputs }
    });

    // 실시간 유효성 검사
    const error = validateInput(field, value, calculatorType);
    if (error) {
      dispatch({ type: 'SET_CALCULATION_ERROR', payload: { field, error } });
    } else {
      dispatch({ type: 'CLEAR_FIELD_ERROR', payload: field });
    }
  }, [currentCalc?.inputs, calculatorType, dispatch]);

  const calculate = useCallback(async () => {
    if (!currentCalc?.inputs) return;

    dispatch({ type: 'SET_CALCULATING', payload: true });
    dispatch({ type: 'CLEAR_CALCULATION_ERRORS' });

    try {
      // 전체 유효성 검사
      const validationErrors = validateAllInputs(currentCalc.inputs, calculatorType);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, error]) => {
          dispatch({ type: 'SET_CALCULATION_ERROR', payload: { field, error } });
        });
        return;
      }

      // 계산 실행
      const calculator = getCalculator(calculatorType);
      const results = await calculator.calculate(currentCalc.inputs);
      
      dispatch({ type: 'SET_CALCULATION_RESULTS', payload: results });
    } catch (error) {
      console.error('계산 오류:', error);
      dispatch({ 
        type: 'SET_CALCULATION_ERROR', 
        payload: { field: 'general', error: '계산 중 오류가 발생했습니다.' }
      });
    } finally {
      dispatch({ type: 'SET_CALCULATING', payload: false });
    }
  }, [currentCalc?.inputs, calculatorType, dispatch]);

  const saveToHistory = useCallback((title?: string) => {
    if (!currentCalc?.results) return;

    const record: CalculationRecord = {
      id: generateId(),
      timestamp: new Date(),
      type: calculatorType,
      inputs: currentCalc.inputs,
      results: currentCalc.results,
      title: title || getDefaultTitle(calculatorType, currentCalc.inputs)
    };

    dispatch({ type: 'ADD_CALCULATION_RECORD', payload: record });
    
    // 로컬 스토리지에 저장
    saveToLocalStorage('calculationHistory', record);
  }, [currentCalc, calculatorType, dispatch]);

  return {
    inputs: currentCalc?.inputs || {},
    results: currentCalc?.results || null,
    errors: currentCalc?.errors || {},
    isCalculating: currentCalc?.isCalculating || false,
    updateInput,
    calculate,
    reset: () => dispatch({ type: 'RESET_CALCULATION', payload: calculatorType }),
    saveToHistory
  };
};
```

#### useValidation Hook
```typescript
const useValidation = (calculatorType: CalculatorType) => {
  const validateInput = useCallback((field: string, value: any): string | null => {
    const rules = getValidationRules(calculatorType, field);
    
    for (const rule of rules) {
      const error = rule.validate(value);
      if (error) return error;
    }
    
    return null;
  }, [calculatorType]);

  const validateAllInputs = useCallback((inputs: Record<string, any>): Record<string, string> => {
    const errors: Record<string, string> = {};
    const allRules = getAllValidationRules(calculatorType);
    
    Object.entries(allRules).forEach(([field, rules]) => {
      const value = inputs[field];
      for (const rule of rules) {
        const error = rule.validate(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    });
    
    return errors;
  }, [calculatorType]);

  return { validateInput, validateAllInputs };
};
```

---

## 📊 데이터 구조 및 저장

### 로컬 스토리지 설계
```typescript
// 로컬 스토리지 키
const STORAGE_KEYS = {
  CALCULATION_HISTORY: 'taxcalc_history',
  USER_PREFERENCES: 'taxcalc_preferences',
  TAX_RATES_CACHE: 'taxcalc_rates_cache'
} as const;

// 히스토리 관리
interface StoredCalculationHistory {
  version: string;
  lastUpdated: string;
  records: CalculationRecord[];
}

class StorageManager {
  static saveCalculationRecord(record: CalculationRecord): void {
    const stored = this.getCalculationHistory();
    stored.records = [record, ...stored.records].slice(0, 50); // 최대 50개
    stored.lastUpdated = new Date().toISOString();
    
    localStorage.setItem(
      STORAGE_KEYS.CALCULATION_HISTORY, 
      JSON.stringify(stored)
    );
  }

  static getCalculationHistory(): StoredCalculationHistory {
    const stored = localStorage.getItem(STORAGE_KEYS.CALCULATION_HISTORY);
    if (!stored) {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        records: []
      };
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        records: []
      };
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(STORAGE_KEYS.CALCULATION_HISTORY);
  }
}
```

### 세율 데이터 구조
```typescript
// taxRates.json
{
  "version": "2024.1",
  "lastUpdated": "2024-01-01",
  "incomeTax": {
    "personal": [
      { "min": 0, "max": 14000000, "rate": 0.06, "deduction": 0 },
      { "min": 14000000, "max": 50000000, "rate": 0.15, "deduction": 1260000 },
      { "min": 50000000, "max": 88000000, "rate": 0.24, "deduction": 5760000 },
      { "min": 88000000, "max": 150000000, "rate": 0.35, "deduction": 15440000 },
      { "min": 150000000, "max": 300000000, "rate": 0.38, "deduction": 19940000 },
      { "min": 300000000, "max": 500000000, "rate": 0.40, "deduction": 25940000 },
      { "min": 500000000, "max": 1000000000, "rate": 0.42, "deduction": 35940000 },
      { "min": 1000000000, "max": null, "rate": 0.45, "deduction": 65940000 }
    ],
    "corporate": {
      "small": [
        { "min": 0, "max": 200000000, "rate": 0.10 },
        { "min": 200000000, "max": 20000000000, "rate": 0.20 }
      ],
      "general": [
        { "min": 0, "max": 300000000000, "rate": 0.22 },
        { "min": 300000000000, "max": null, "rate": 0.25 }
      ]
    }
  },
  "capitalGainsTax": {
    "residential": {
      "general": [
        { "holdingPeriod": 0, "rate": 0.06 },
        { "holdingPeriod": 1, "rate": 0.06 },
        { "holdingPeriod": 2, "rate": 0.42 }
      ],
      "oneHousehold": [
        { "holdingPeriod": 0, "rate": 0 },
        { "holdingPeriod": 2, "rate": 0 },
        { "holdingPeriod": 10, "rate": 0 }
      ]
    }
  },
  "inheritanceTax": [
    { "min": 0, "max": 100000000, "rate": 0.10, "deduction": 0 },
    { "min": 100000000, "max": 500000000, "rate": 0.20, "deduction": 10000000 },
    { "min": 500000000, "max": 1000000000, "rate": 0.30, "deduction": 60000000 },
    { "min": 1000000000, "max": 3000000000, "rate": 0.40, "deduction": 160000000 },
    { "min": 3000000000, "max": null, "rate": 0.50, "deduction": 460000000 }
  ],
  "deductions": {
    "personal": {
      "basic": 1500000,
      "spouse": 1500000,
      "dependent": 1500000,
      "disabled": 2000000,
      "elderly": 1000000
    },
    "standard": 130000,
    "earned_income": {
      "rates": [
        { "min": 0, "max": 5000000, "rate": 0.70, "max_deduction": 3500000 },
        { "min": 5000000, "max": 15000000, "rate": 0.40, "base": 3500000, "max_deduction": 9500000 },
        { "min": 15000000, "max": 45000000, "rate": 0.15, "base": 9500000, "max_deduction": 14000000 },
        { "min": 45000000, "max": 100000000, "rate": 0.05, "base": 14000000, "max_deduction": 16750000 },
        { "min": 100000000, "max": null, "rate": 0, "base": 20000000 }
      ]
    }
  }
}
```

---

## 🧪 테스트 전략

### 테스트 케이스 설계

#### 1. 단위 테스트 (Jest + Testing Library)
```typescript
// __tests__/calculators/EarnedIncomeTax.test.ts
describe('EarnedIncomeTaxCalculator', () => {
  describe('calculate', () => {
    test('연봉 5000만원, 부양가족 2명 계산', () => {
      const input: EarnedIncomeTaxInput = {
        annualSalary: 50000000,
        dependents: 2,
        pensionContribution: 2250000,
        healthInsurance: 1500000,
        employmentInsurance: 150000,
        personalPensionContribution: 0,
        housingFund: 0,
        medicalExpenses: 0,
        educationExpenses: 0,
        donationAmount: 0,
        creditCardUsage: 0,
        isDisabled: false,
        isElderly: false
      };

      const result = EarnedIncomeTaxCalculator.calculate(input);

      expect(result.taxableAmount).toBe(31500000); // 예상 과세표준
      expect(result.calculatedTax).toBe(3990000);  // 예상 산출세액
      expect(result.totalTax).toBe(4389000);       // 예상 총세액
      expect(result.monthlySalary).toBeGreaterThan(3000000); // 월 실수령액
    });

    test('최저 과세표준 케이스', () => {
      const input: EarnedIncomeTaxInput = {
        annualSalary: 20000000,
        dependents: 0,
        // ... 기타 필드
      };

      const result = EarnedIncomeTaxCalculator.calculate(input);
      
      expect(result.taxableAmount).toBeGreaterThanOrEqual(0);
      expect(result.calculatedTax).toBeGreaterThanOrEqual(0);
    });

    test('고소득자 케이스 (연봉 5억)', () => {
      const input: EarnedIncomeTaxInput = {
        annualSalary: 500000000,
        dependents: 0,
        // ... 기타 필드
      };

      const result = EarnedIncomeTaxCalculator.calculate(input);
      
      expect(result.calculatedTax).toBeGreaterThan(100000000); // 1억 이상
      expect(result.totalTax).toBeGreaterThan(110000000); // 지방소득세 포함
    });
  });

  describe('calculateEarnedIncomeDeduction', () => {
    test.each([
      [5000000, 3500000],      // 500만원 -> 350만원
      [15000000, 7500000],     // 1500만원 -> 750만원  
      [50000000, 14000000],    // 5000만원 -> 1400만원
      [100000000, 16750000],   // 1억원 -> 1675만원
      [200000000, 20000000]    // 2억원 -> 2000만원
    ])('연봉 %i원일 때 근로소득공제 %i원', (salary, expectedDeduction) => {
      const deduction = EarnedIncomeTaxCalculator.calculateEarnedIncomeDeduction(salary);
      expect(deduction).toBe(expectedDeduction);
    });
  });
});
```

#### 2. 통합 테스트
```typescript
// __tests__/integration/CalculatorWorkflow.test.tsx
describe('계산기 통합 워크플로우', () => {
  test('근로소득세 계산 전체 플로우', async () => {
    render(<App />);
    
    // 1. 개인세금 탭 선택
    fireEvent.click(screen.getByText('개인세금'));
    
    // 2. 근로소득세 계산기 선택
    fireEvent.change(screen.getByRole('combobox'), { 
      target: { value: 'earned-income-tax' } 
    });
    
    // 3. 데이터 입력
    await userEvent.type(screen.getByLabelText('연봉'), '50000000');
    await userEvent.type(screen.getByLabelText('부양가족 수'), '2');
    
    // 4. 계산 버튼 클릭 (또는 자동 계산)
    await waitFor(() => {
      expect(screen.getByText(/과세표준/)).toBeInTheDocument();
    });
    
    // 5. 결과 확인
    expect(screen.getByText(/31,500,000원/)).toBeInTheDocument();
    
    // 6. 히스토리에 저장
    fireEvent.click(screen.getByText('저장'));
    
    // 7. 히스토리 탭에서 확인
    fireEvent.click(screen.getByText('계산기록'));
    expect(screen.getByText(/근로소득세 계산/)).toBeInTheDocument();
  });
});
```

#### 3. E2E 테스트 (Playwright)
```typescript
// e2e/calculator.spec.ts
import { test, expect } from '@playwright/test';

test.describe('세금 계산기 E2E', () => {
  test('전체 계산기 기능 테스트', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // 근로소득세 계산
    await page.click('text=개인세금');
    await page.selectOption('[data-testid=calculator-select]', 'earned-income-tax');
    
    await page.fill('[data-testid=annual-salary]', '50000000');
    await page.fill('[data-testid=dependents]', '2');
    
    await expect(page.locator('[data-testid=taxable-amount]')).toContainText('31,500,000');
    
    // 인쇄 기능 테스트
    await page.click('[data-testid=print-button]');
    // 인쇄 다이얼로그 확인
    
    // 히스토리 저장 테스트
    await page.click('[data-testid=save-button]');
    await page.click('text=계산기록');
    await expect(page.locator('[data-testid=history-item]')).toBeVisible();
  });
});
```

### 성능 테스트
```typescript
// __tests__/performance/CalculationPerformance.test.ts
describe('계산 성능 테스트', () => {
  test('복잡한 계산의 성능', () => {
    const start = performance.now();
    
    // 1000번 계산 실행
    for (let i = 0; i < 1000; i++) {
      EarnedIncomeTaxCalculator.calculate({
        annualSalary: Math.random() * 100000000,
        dependents: Math.floor(Math.random() * 5),
        // ... 기타 랜덤 값
      });
    }
    
    const end = performance.now();
    const duration = end - start;
    
    expect(duration).toBeLessThan(1000); // 1초 이내 완료
  });

  test('메모리 누수 테스트', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // 대량 계산 실행
    for (let i = 0; i < 10000; i++) {
      EarnedIncomeTaxCalculator.calculate(sampleInput);
    }
    
    // 가비지 컬렉션 강제 실행 (테스트 환경에서)
    if (global.gc) global.gc();
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryGrowth = finalMemory - initialMemory;
    
    expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // 10MB 이내
  });
});
```

---

## 🚀 배포 및 운영

### 빌드 설정

#### package.json
```json
{
  "name": "taxpro-calculator",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "jest",
    "test:e2e": "playwright test",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "analyze": "vite-bundle-analyzer"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.12.0",
    "big.js": "^6.2.1",
    "dayjs": "^1.11.10"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "jest": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@playwright/test": "^1.40.0",
    "vite-bundle-analyzer": "^0.7.0"
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          utils: ['big.js', 'dayjs']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd', 'big.js']
  }
});
```

### CI/CD 파이프라인

#### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run E2E tests
        run: |
          npx playwright install
          npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: test-results/

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/
      
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ${{ secrets.AWS_REGION }}
          S3_BUCKET: ${{ secrets.S3_BUCKET }}
        run: |
          aws s3 sync dist/ s3://$S3_BUCKET --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### 모니터링 및 분석

#### 성능 모니터링
```typescript
// src/utils/monitoring.ts
class PerformanceMonitor {
  static trackCalculationTime(calculatorType: string, duration: number) {
    // 계산 시간 추적
    if (window.gtag) {
      window.gtag('event', 'calculation_time', {
        calculator_type: calculatorType,
        duration_ms: duration,
        event_category: 'performance'
      });
    }
  }

  static trackError(error: Error, context: string) {
    // 에러 추적
    console.error(`Error in ${context}:`, error);
    
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        context
      });
    }
  }

  static trackUsage(action: string, calculatorType?: string) {
    // 사용 패턴 추적
    if (window.gtag) {
      window.gtag('event', action, {
        calculator_type: calculatorType,
        event_category: 'engagement'
      });
    }
  }
}

// 사용 예시
const startTime = performance.now();
const result = await calculator.calculate(inputs);
const endTime = performance.now();

PerformanceMonitor.trackCalculationTime(
  calculatorType, 
  endTime - startTime
);
```

### 운영 체크리스트

#### 배포 전 체크리스트
- [ ] 모든 단위 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 성능 테스트 통과 (계산 시간 < 1초)
- [ ] 크로스 브라우저 테스트 완료
- [ ] 반응형 디자인 테스트 완료
- [ ] 접근성 테스트 완료 (WCAG 2.1 AA)
- [ ] 세율 정보 최신 버전 확인
- [ ] 보안 취약점 스캔 완료

#### 배포 후 체크리스트
- [ ] 프로덕션 환경 동작 확인
- [ ] 모든 계산기 정상 동작 확인
- [ ] 성능 지표 확인 (로딩 시간 < 3초)
- [ ] 에러 모니터링 설정 확인
- [ ] 사용자 피드백 수집 시스템 활성화

---

## 📈 성공 지표 및 KPI

### 기술적 KPI
- **로딩 시간**: 초기 로딩 < 3초, 계산 결과 < 1초
- **정확도**: 국세청 예시 케이스 100% 일치
- **가용성**: 99.9% 업타임
- **에러율**: < 0.1%

### 사용자 경험 KPI
- **작업 완료율**: 계산 작업 95% 이상 성공
- **사용자 만족도**: 4.5/5.0 이상
- **재사용률**: 월간 활성 사용자의 80% 이상이 재방문

### 비즈니스 KPI
- **도입률**: 파트너 세무사의 70% 이상 사용
- **효율성**: 기존 방식 대비 30% 시간 단축
- **정확성**: 계산 오류로 인한 문의 90% 감소

---

---

## 🏢 추가 특화 계산기 - 가업상속 및 주식이동 세금

### 추가 계산기 개요

기본 세금 계산기 외에 세무사가 자주 접하는 특수한 세무 상황을 위한 전문 계산기를 추가 개발합니다.

#### 추가 계산기 목록
1. **가업상속세 계산기** (상속세 특례)
2. **주식이동 세금 통합 계산기**
   - 주식양도소득세 계산기
   - 주식증여세 계산기  
   - 주식상속세 계산기
   - 주식배당소득세 계산기

---

## 🏭 가업상속세 계산기 상세 설계

### 기능 개요
- 중소기업/중견기업의 가업상속 시 적용되는 특례 공제를 반영한 상속세 계산
- 사후관리 의무사항 안내 및 세액 시뮬레이션
- 일반 상속세 대비 절세 효과 비교 분석

### 입력 인터페이스
```typescript
interface BusinessInheritanceInput extends TaxCalculationInput {
  // 기본 상속 정보
  totalInheritanceValue: number;        // 총 상속재산 가액
  businessAssetValue: number;           // 가업용 자산 가액
  personalAssetValue: number;           // 개인 자산 가액
  debtsAndExpenses: number;             // 채무 및 공과금
  
  // 가업 정보
  businessType: 'small' | 'medium';    // 중소기업/중견기업 구분
  businessPeriod: number;               // 업력 (연단위)
  employeeCount: number;                // 종업원 수
  annualRevenue: number;                // 연간 매출액
  
  // 상속인 정보
  inheritorsCount: number;              // 상속인 수
  spouseExists: boolean;                // 배우자 존재 여부
  directDescendants: number;            // 직계비속 수
  relationshipToDeceased: string;       // 피상속인과의 관계
  
  // 사후관리 계획
  continuousManagement: boolean;        // 계속 경영 의사
  employmentMaintenance: boolean;       // 고용 유지 계획
  businessLocationMaintenance: boolean; // 사업장 소재지 유지
  
  // 기타 공제
  hasDisabledPerson: boolean;           // 장애인 상속인 여부
  hasElderlyPerson: boolean;            // 65세 이상 상속인 여부
  hasMinorChildren: boolean;            // 미성년자 상속인 여부
}

interface BusinessInheritanceResult extends TaxCalculationResult {
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

interface PenaltyRisk {
  violationType: string;                 // 위반 유형
  penaltyRate: number;                  // 추징 세율
  penaltyAmount: number;                // 예상 추징세액
  riskLevel: 'low' | 'medium' | 'high'; // 위험도
}

interface InstallmentPlan {
  year: number;                         // 납부연도
  amount: number;                       // 납부금액
  dueDate: string;                      // 납부기한
  interestRate: number;                 // 적용 이자율
}
```

### 가업상속세 계산 로직
```typescript
class BusinessInheritanceCalculator {
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
    const taxSavingRate = (taxSaving / basicInheritanceResult.totalTax) * 100;
    
    // 7단계: 사후관리 계획 수립
    const managementPlan = this.generateManagementPlan(input);
    
    // 8단계: 분할납부 계획 수립
    const installmentPlan = this.generateInstallmentPlan(totalTax, input);
    
    return {
      taxableAmount: adjustedTaxableAmount,
      calculatedTax: finalTax,
      localIncomeTax,
      totalTax,
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

  private static checkEligibility(input: BusinessInheritanceInput): { isEligible: boolean; reason?: string } {
    // 업력 요건 (3년 이상)
    if (input.businessPeriod < 3) {
      return { isEligible: false, reason: '업력 3년 이상 요건 미충족' };
    }
    
    // 상속인의 경영 참여 의사
    if (!input.continuousManagement) {
      return { isEligible: false, reason: '계속 경영 의사 없음' };
    }
    
    // 고용 유지 계획
    if (!input.employmentMaintenance && input.employeeCount >= 10) {
      return { isEligible: false, reason: '고용 유지 계획 수립 필요' };
    }
    
    return { isEligible: true };
  }

  private static generateManagementPlan(input: BusinessInheritanceInput): {
    period: number;
    employmentCount: number;
    risks: PenaltyRisk[];
  } {
    const managementPeriod = 10; // 10년간 사후관리
    const employmentCount = Math.floor(input.employeeCount * 0.8); // 80% 이상 고용 유지
    
    const risks: PenaltyRisk[] = [
      {
        violationType: '경영 참여 의무 위반',
        penaltyRate: 0.2,
        penaltyAmount: input.businessInheritanceDeduction * 0.2,
        riskLevel: 'high'
      },
      {
        violationType: '고용 유지 의무 위반',
        penaltyRate: 0.1,
        penaltyAmount: input.businessInheritanceDeduction * 0.1,
        riskLevel: 'medium'
      },
      {
        violationType: '사업장 이전',
        penaltyRate: 0.15,
        penaltyAmount: input.businessInheritanceDeduction * 0.15,
        riskLevel: 'low'
      }
    ];
    
    return { period: managementPeriod, employmentCount, risks };
  }
}
```

---

## 📈 주식이동 세금 통합 계산기 설계

### 기능 개요
- 주식의 이동 방식(양도/증여/상속/배당)에 따른 세금 통합 계산
- 상장/비상장, 대주주/소액주주 구분 자동 판별
- 최적 이동 방식 세금 비교 및 추천

### 공통 입력 인터페이스
```typescript
interface StockTransferInput extends TaxCalculationInput {
  // 주식 기본 정보
  stockType: 'listed' | 'unlisted';     // 상장/비상장
  companyName: string;                  // 회사명
  stockQuantity: number;                // 주식 수량
  pricePerShare: number;                // 주당 가격
  totalValue: number;                   // 총 가액
  
  // 보유 현황
  holdingPeriod: number;                // 보유기간 (월단위)
  acquisitionPrice: number;             // 취득가액
  acquisitionDate: Date;                // 취득일자
  
  // 지분 정보
  totalSharesOutstanding: number;       // 총 발행주식수
  shareholdingRatio: number;            // 지분율
  isLargestShareholder: boolean;        // 대주주 여부
  familyShareholdingRatio: number;      // 특수관계인 포함 지분율
  
  // 이동 정보
  transferType: 'sale' | 'gift' | 'inheritance' | 'dividend'; // 이동 유형
  transferPrice?: number;               // 양도가액 (매매시)
  transferDate: Date;                   // 이동일자
  
  // 당사자 정보
  transferorAge?: number;               // 양도자 나이
  transfereeAge?: number;               // 양수자 나이
  relationship?: string;                // 양도자-양수자 관계
  transfereeResidence: 'domestic' | 'foreign'; // 양수자 거주지
  
  // 세무 정보
  hasOtherCapitalGains: boolean;        // 기타 양도소득 존재 여부
  previousGiftHistory: GiftHistory[];   // 이전 증여 이력
  taxExemptionApplicable: boolean;      // 비과세 적용 가능 여부
}

interface GiftHistory {
  date: Date;
  amount: number;
  relationship: string;
  giftType: string;
}
```

### 주식양도소득세 계산 로직
```typescript
class StockCapitalGainsTaxCalculator {
  static calculate(input: StockTransferInput): StockTransferResult {
    // 1단계: 대주주 여부 판정
    const isLargeShareholder = this.determineLargeShareholderStatus(input);
    
    // 2단계: 과세 대상 여부 확인
    const isTaxable = this.checkTaxability(input, isLargeShareholder);
    
    if (!isTaxable) {
      return this.generateNonTaxableResult(input);
    }
    
    // 3단계: 양도차익 계산
    const capitalGain = input.transferPrice! - input.acquisitionPrice;
    
    // 4단계: 양도소득세 계산
    let taxRate: number;
    if (input.stockType === 'listed') {
      // 상장주식
      taxRate = isLargeShareholder ? this.getListedLargeShareholderRate(input.holdingPeriod) : 0;
    } else {
      // 비상장주식
      taxRate = this.getUnlistedStockTaxRate(input.holdingPeriod, isLargeShareholder);
    }
    
    const calculatedTax = Math.floor(Math.max(0, capitalGain) * taxRate);
    const localIncomeTax = Math.floor(calculatedTax * 0.1);
    const totalTax = calculatedTax + localIncomeTax;
    
    // 5단계: 세부 계산 내역 생성
    const breakdown = this.generateStockTransferBreakdown(input, capitalGain, calculatedTax);
    
    return {
      transferType: 'sale',
      capitalGain,
      taxableAmount: Math.max(0, capitalGain),
      calculatedTax,
      localIncomeTax,
      totalTax,
      netProceeds: input.transferPrice! - totalTax,
      isLargeShareholder,
      appliedTaxRate: taxRate,
      breakdown,
      appliedRates: [{ range: `${taxRate * 100}%`, rate: taxRate, amount: calculatedTax }],
      deductions: []
    };
  }

  private static determineLargeShareholderStatus(input: StockTransferInput): boolean {
    // 대주주 판정 기준
    const shareholdingThreshold = input.stockType === 'listed' ? 0.01 : 0.04; // 상장 1%, 비상장 4%
    const valueThreshold = input.stockType === 'listed' ? 10000000000 : 10000000000; // 100억원
    
    return (
      input.shareholdingRatio >= shareholdingThreshold ||
      input.totalValue >= valueThreshold ||
      input.familyShareholdingRatio >= shareholdingThreshold
    );
  }

  private static checkTaxability(input: StockTransferInput, isLargeShareholder: boolean): boolean {
    // 상장주식 소액주주는 대부분 비과세
    if (input.stockType === 'listed' && !isLargeShareholder) {
      return false;
    }
    
    // 비상장주식은 대부분 과세
    return true;
  }

  private static getListedLargeShareholderRate(holdingPeriod: number): number {
    if (holdingPeriod < 12) return 0.30; // 1년 미만: 30%
    if (holdingPeriod < 24) return 0.25; // 1년~2년: 25%
    return 0.20; // 2년 이상: 20%
  }

  private static getUnlistedStockTaxRate(holdingPeriod: number, isLargeShareholder: boolean): number {
    const baseRate = isLargeShareholder ? 0.25 : 0.20;
    
    if (holdingPeriod < 12) return baseRate + 0.10; // 단기보유 가산세
    return baseRate;
  }
}
```

### 주식증여세 계산 로직
```typescript
class StockGiftTaxCalculator {
  static calculate(input: StockTransferInput): StockTransferResult {
    // 1단계: 증여재산 가액 평가
    const giftValue = this.evaluateStockValue(input);
    
    // 2단계: 증여공제 계산
    const giftDeduction = this.calculateGiftDeduction(input);
    
    // 3단계: 과세표준 계산
    const taxableAmount = Math.max(0, giftValue - giftDeduction);
    
    // 4단계: 증여세 계산
    const calculatedTax = this.calculateProgressiveTax(taxableAmount, GIFT_TAX_RATES);
    const localIncomeTax = Math.floor(calculatedTax * 0.1);
    const totalTax = calculatedTax + localIncomeTax;
    
    // 5단계: 할증/감면 적용
    const adjustedTax = this.applyAdjustments(totalTax, input);
    
    return {
      transferType: 'gift',
      giftValue,
      giftDeduction,
      taxableAmount,
      calculatedTax: adjustedTax.tax,
      localIncomeTax: Math.floor(adjustedTax.tax * 0.1),
      totalTax: adjustedTax.totalTax,
      surchargeRate: adjustedTax.surchargeRate,
      breakdown: this.generateGiftTaxBreakdown(input, giftValue, adjustedTax.tax),
      appliedRates: this.getGiftTaxRates(taxableAmount),
      deductions: [
        { type: 'gift', label: '증여공제', amount: giftDeduction }
      ]
    };
  }

  private static evaluateStockValue(input: StockTransferInput): number {
    if (input.stockType === 'listed') {
      // 상장주식: 평가기준일 전후 2개월 평균가액
      return input.totalValue;
    } else {
      // 비상장주식: 순손익가치와 순자산가치의 가중평균
      // 실제로는 더 복잡한 평가 방법 적용
      return input.totalValue;
    }
  }

  private static calculateGiftDeduction(input: StockTransferInput): number {
    const deductionLimits: Record<string, number> = {
      'spouse': 600000000,      // 배우자: 6억
      'lineal_descendant': 50000000, // 직계비속: 5천만원
      'lineal_ascendant': 50000000,  // 직계존속: 5천만원
      'sibling': 10000000,      // 형제자매: 1천만원
      'other': 10000000         // 기타: 1천만원
    };
    
    const relationshipKey = this.mapRelationshipKey(input.relationship || 'other');
    return deductionLimits[relationshipKey] || 10000000;
  }

  private static applyAdjustments(baseTax: number, input: StockTransferInput): {
    tax: number;
    totalTax: number;
    surchargeRate: number;
  } {
    let adjustedTax = baseTax;
    let surchargeRate = 0;
    
    // 비상장주식 할증세율 적용
    if (input.stockType === 'unlisted' && input.isLargestShareholder) {
      surchargeRate = 0.30; // 30% 할증
      adjustedTax = baseTax * (1 + surchargeRate);
    }
    
    // 재외국민 증여세 감면 등 기타 조정사항 적용
    // ...
    
    const totalTax = adjustedTax + Math.floor(adjustedTax * 0.1);
    
    return { tax: adjustedTax, totalTax, surchargeRate };
  }
}
```

### 주식배당소득세 계산 로직
```typescript
class StockDividendTaxCalculator {
  static calculate(input: DividendInput): DividendTaxResult {
    // 1단계: 배당소득 구분
    const dividendType = this.classifyDividend(input);
    
    // 2단계: 원천징수세율 결정
    const withholdingRate = this.getWithholdingRate(dividendType, input.transfereeResidence);
    
    // 3단계: 원천징수세액 계산
    const withholdingTax = Math.floor(input.dividendAmount * withholdingRate);
    const localIncomeTax = Math.floor(withholdingTax * 0.1);
    const totalWithholdingTax = withholdingTax + localIncomeTax;
    
    // 4단계: 종합소득 신고 시 추가/환급세액 계산
    const comprehensiveResult = this.calculateComprehensiveTax(input);
    
    return {
      dividendAmount: input.dividendAmount,
      dividendType,
      withholdingRate,
      withholdingTax,
      localIncomeTax,
      totalWithholdingTax,
      netDividend: input.dividendAmount - totalWithholdingTax,
      comprehensiveInclusion: comprehensiveResult.shouldInclude,
      additionalTax: comprehensiveResult.additionalTax,
      refundAmount: comprehensiveResult.refundAmount,
      finalNetDividend: comprehensiveResult.finalNetAmount
    };
  }

  private static getWithholdingRate(dividendType: string, residence: string): number {
    if (residence === 'foreign') {
      return 0.22; // 비거주자: 22%
    }
    
    switch (dividendType) {
      case 'general': return 0.14;    // 일반배당: 14%
      case 'small_company': return 0.09; // 소기업배당: 9%
      default: return 0.14;
    }
  }
}
```

### 통합 비교 분석 기능
```typescript
class StockTransferComparisonCalculator {
  static compareAllMethods(input: StockTransferInput): TransferMethodComparison {
    const saleResult = StockCapitalGainsTaxCalculator.calculate({
      ...input,
      transferType: 'sale'
    });
    
    const giftResult = StockGiftTaxCalculator.calculate({
      ...input,
      transferType: 'gift'
    });
    
    // 각 방법별 세부담 및 순수취액 비교
    const comparison: TransferMethodComparison = {
      sale: {
        totalTax: saleResult.totalTax,
        netAmount: saleResult.netProceeds,
        effectiveRate: (saleResult.totalTax / input.totalValue) * 100
      },
      gift: {
        totalTax: giftResult.totalTax,
        netAmount: input.totalValue - giftResult.totalTax,
        effectiveRate: (giftResult.totalTax / input.totalValue) * 100
      },
      inheritance: {
        // 상속 시나리오 계산
      }
    };
    
    // 최적 방법 추천
    const recommendation = this.recommendOptimalMethod(comparison, input);
    
    return {
      ...comparison,
      recommendation
    };
  }

  private static recommendOptimalMethod(
    comparison: TransferMethodComparison,
    input: StockTransferInput
  ): TransferRecommendation {
    // 세부담 최소화 관점에서 최적 방법 선택
    const methods = Object.entries(comparison);
    const optimal = methods.reduce((min, current) => 
      current[1].totalTax < min[1].totalTax ? current : min
    );
    
    return {
      recommendedMethod: optimal[0] as TransferMethod,
      reason: `세부담 최소화 (세액: ${optimal[1].totalTax.toLocaleString()}원)`,
      taxSaving: Math.max(...methods.map(m => m[1].totalTax)) - optimal[1].totalTax,
      considerations: this.generateConsiderations(input, optimal[0] as TransferMethod)
    };
  }
}
```

### UI 컴포넌트 추가 설계

#### 탭 구조 확장
```typescript
// 기존 탭에 추가
const extendedTabs: TabItem[] = [
  // ... 기존 탭들
  {
    key: 'special',
    label: '특화계산',
    icon: <StarOutlined />,
    children: <SpecialTaxCalculators />
  }
];

// 특화계산 탭 하위 메뉴
const specialCalculators = [
  {
    key: 'business-inheritance',
    label: '가업상속세',
    component: <BusinessInheritanceCalculator />
  },
  {
    key: 'stock-transfer',
    label: '주식이동세금',
    component: <StockTransferCalculator />
  }
];
```

#### 주식이동 계산기 UI 설계
```typescript
interface StockTransferCalculatorProps {
  onCalculate: (result: StockTransferResult) => void;
}

const StockTransferCalculator: React.FC<StockTransferCalculatorProps> = ({ onCalculate }) => {
  const [transferType, setTransferType] = useState<TransferType>('sale');
  const [inputs, setInputs] = useState<StockTransferInput>({});
  const [comparisonMode, setComparisonMode] = useState(false);

  return (
    <div className="stock-transfer-calculator">
      {/* 계산 방식 선택 */}
      <Card title="이동 방식 선택">
        <Radio.Group value={transferType} onChange={(e) => setTransferType(e.target.value)}>
          <Radio.Button value="sale">양도 (매매)</Radio.Button>
          <Radio.Button value="gift">증여</Radio.Button>
          <Radio.Button value="inheritance">상속</Radio.Button>
          <Radio.Button value="dividend">배당</Radio.Button>
        </Radio.Group>
        
        <Switch 
          checked={comparisonMode}
          onChange={setComparisonMode}
          checkedChildren="비교모드"
          unCheckedChildren="단일계산"
        />
      </Card>

      {/* 주식 정보 입력 */}
      <Card title="주식 정보">
        <Row gutter={16}>
          <Col span={12}>
            <NumberInput
              label="주식 수량"
              value={inputs.stockQuantity}
              onChange={(value) => setInputs({...inputs, stockQuantity: value})}
              suffix="주"
              required
            />
          </Col>
          <Col span={12}>
            <NumberInput
              label="주당 가격"
              value={inputs.pricePerShare}
              onChange={(value) => setInputs({...inputs, pricePerShare: value})}
              suffix="원"
              required
            />
          </Col>
        </Row>
        
        <Select
          placeholder="상장/비상장 구분"
          value={inputs.stockType}
          onChange={(value) => setInputs({...inputs, stockType: value})}
        >
          <Option value="listed">상장주식</Option>
          <Option value="unlisted">비상장주식</Option>
        </Select>
      </Card>

      {/* 조건부 입력 필드 */}
      {transferType === 'sale' && (
        <Card title="양도 정보">
          <NumberInput
            label="양도가액"
            value={inputs.transferPrice}
            onChange={(value) => setInputs({...inputs, transferPrice: value})}
            required
          />
          <DatePicker
            label="양도일자"
            value={inputs.transferDate}
            onChange={(date) => setInputs({...inputs, transferDate: date})}
          />
        </Card>
      )}

      {transferType === 'gift' && (
        <Card title="증여 정보">
          <Select
            label="수증자와의 관계"
            value={inputs.relationship}
            onChange={(value) => setInputs({...inputs, relationship: value})}
          >
            <Option value="spouse">배우자</Option>
            <Option value="lineal_descendant">직계비속</Option>
            <Option value="lineal_ascendant">직계존속</Option>
            <Option value="sibling">형제자매</Option>
            <Option value="other">기타</Option>
          </Select>
        </Card>
      )}

      {/* 결과 표시 영역 */}
      {comparisonMode ? (
        <StockTransferComparison inputs={inputs} />
      ) : (
        <StockTransferResult 
          transferType={transferType}
          inputs={inputs}
        />
      )}
    </div>
  );
};
```

---

## 📊 데이터 구조 확장

### 추가 세율 데이터
```json
// taxRates.json 확장
{
  "businessInheritance": {
    "maxDeduction": {
      "small": 30000000000,
      "medium": 50000000000
    },
    "deductionRates": {
      "under3years": 0.8,
      "3to7years": 0.9,
      "over7years": 1.0
    },
    "penaltyRates": {
      "managementViolation": 0.2,
      "employmentViolation": 0.1,
      "locationViolation": 0.15
    }
  },
  "stockTransfer": {
    "capitalGainsTax": {
      "listed": {
        "largeShareholder": {
          "under1year": 0.30,
          "1to2years": 0.25,
          "over2years": 0.20
        },
        "smallShareholder": 0.0
      },
      "unlisted": {
        "largeShareholder": {
          "under1year": 0.35,
          "over1year": 0.25
        },
        "smallShareholder": {
          "under1year": 0.30,
          "over1year": 0.20
        }
      }
    },
    "giftTax": {
      "surchargeRates": {
        "unlistedLargeShareholder": 0.30
      },
      "deductionLimits": {
        "spouse": 600000000,
        "lineal_descendant": 50000000,
        "lineal_ascendant": 50000000,
        "sibling": 10000000,
        "other": 10000000
      }
    },
    "dividendTax": {
      "withholding": {
        "domestic": {
          "general": 0.14,
          "smallCompany": 0.09
        },
        "foreign": 0.22
      }
    }
  }
}
```

### 계산 히스토리 확장
```typescript
interface ExtendedCalculationRecord extends CalculationRecord {
  // 가업상속 관련
  businessInheritanceDetails?: {
    businessType: string;
    deductionAmount: number;
    taxSavingAmount: number;
    managementPeriod: number;
  };
  
  // 주식이동 관련
  stockTransferDetails?: {
    transferType: string;
    stockType: string;
    isLargeShareholder: boolean;
    comparisonResults?: TransferMethodComparison;
    recommendedMethod?: string;
  };
}
```

---

## 🧪 추가 테스트 케이스

### 가업상속세 테스트
```typescript
describe('BusinessInheritanceCalculator', () => {
  test('중소기업 가업상속공제 계산', () => {
    const input: BusinessInheritanceInput = {
      totalInheritanceValue: 10000000000,
      businessAssetValue: 8000000000,
      businessType: 'small',
      businessPeriod: 10,
      employeeCount: 50,
      continuousManagement: true,
      employmentMaintenance: true
    };

    const result = BusinessInheritanceCalculator.calculate(input);

    expect(result.businessInheritanceDeduction).toBe(8000000000); // 80억 전액 공제
    expect(result.taxSavingAmount).toBeGreaterThan(1000000000); // 10억 이상 절세
  });
});

describe('StockCapitalGainsTaxCalculator', () => {
  test('상장주식 대주주 양도소득세', () => {
    const input: StockTransferInput = {
      stockType: 'listed',
      shareholdingRatio: 0.02, // 2%
      holdingPeriod: 36, // 3년
      acquisitionPrice: 1000000000,
      transferPrice: 1500000000
    };

    const result = StockCapitalGainsTaxCalculator.calculate(input);

    expect(result.isLargeShareholder).toBe(true);
    expect(result.appliedTaxRate).toBe(0.20); // 2년 이상 보유
    expect(result.calculatedTax).toBe(100000000); // 5억차익 × 20%
  });
});
```

---

이 추가 설계를 통해 세무사들이 자주 접하는 가업상속과 주식이동 관련 복잡한 세무 계산을 정확하고 신속하게 처리할 수 있는 전문 도구를 제공할 수 있습니다. 각 계산기는 해당 분야의 전문성을 반영하여 실무에서 즉시 활용 가능하도록 설계되었습니다.