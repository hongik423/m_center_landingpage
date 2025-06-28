'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  User,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  ArrowLeft,
  Shield,
  PiggyBank,
  ArrowRight,
  Crown,
  Info,
  AlertCircle,
  RefreshCw,
  X,
  Bug
} from 'lucide-react';
import Header from '@/components/layout/header';
import EarnedIncomeTaxCalculatorComponent from '@/components/tax-calculator/EarnedIncomeTaxCalculator';
import ComprehensiveIncomeTaxCalculatorComponent from '@/components/tax-calculator/ComprehensiveIncomeTaxCalculator';
import CapitalGainsTaxCalculatorComponent from '@/components/tax-calculator/CapitalGainsTaxCalculator';
import { InheritanceTaxCalculatorComponent } from '@/components/tax-calculator/InheritanceTaxCalculator';
import GiftTaxCalculator from '@/components/tax-calculator/GiftTaxCalculator';
import SimpleComprehensiveCalculator from '@/components/tax-calculator/SimpleComprehensiveCalculator';
import TaxCalculatorDisclaimer from '@/components/tax-calculator/TaxCalculatorDisclaimer';
import CorporateTaxCalculatorComponent from '@/components/tax-calculator/CorporateTaxCalculator';
import VATCalculator from '@/components/tax-calculator/VATCalculator';
import WithholdingTaxCalculator from '@/components/tax-calculator/WithholdingTaxCalculator';
import BusinessInheritanceCalculatorComponent from '@/components/tax-calculator/BusinessInheritanceCalculator';
import StockTransferTaxCalculator from '@/components/tax-calculator/StockTransferTaxCalculator';
import { FloatingErrorReportButton } from '@/components/ui/floating-error-report-button';
import { Label } from '@/components/ui/label';

// 개인세금 계산기 목록
const personalTaxCalculators = [
  {
    id: 'earned-income',
    title: '근로소득세 계산기',
    description: '급여 소득자를 위한 소득세 계산',
    icon: User,
    color: 'blue',
    features: ['월급실수령액', '연말정산', '부양가족공제']
  },
  {
    id: 'comprehensive-income',
    title: '종합소득세 계산기',
    description: '사업소득, 기타소득 포함 종합소득세',
    icon: FileText,
    color: 'green',
    features: ['사업소득', '부동산임대', '금융소득']
  },
  {
    id: 'capital-gains',
    title: '양도소득세 계산기',
    description: '부동산, 주식 양도소득세 계산',
    icon: TrendingUp,
    color: 'purple',
    features: ['1세대1주택', '장기보유특별공제', '비과세']
  },
  {
    id: 'inheritance',
    title: '상속세 계산기',
    description: '상속재산에 대한 상속세 계산',
    icon: Building2,
    color: 'orange',
    features: ['상속공제', '세대생략', '농지상속']
  },
  {
    id: 'gift',
    title: '증여세 계산기',
    description: '증여재산에 대한 증여세 계산',
    icon: DollarSign,
    color: 'pink',
    features: ['배우자증여', '직계존속', '10년합산']
  }
];

// 법인세금 계산기 목록
const corporateTaxCalculators = [
  {
    id: 'corporate-tax',
    title: '법인세 계산기',
    description: '법인의 소득에 대한 법인세 계산',
    icon: Building2,
    color: 'indigo',
    features: ['중소기업특례', '세액공제', '이월결손금']
  },
  {
    id: 'vat',
    title: '부가가치세 계산기',
    description: '매출, 매입세액 부가가치세 계산',
    icon: Calculator,
    color: 'cyan',
    features: ['일반과세', '간이과세', '면세사업']
  },
  {
    id: 'withholding',
    title: '원천징수세 계산기',
    description: '급여, 용역비 원천징수세 계산',
    icon: FileText,
    color: 'emerald',
    features: ['급여원천징수', '사업소득', '기타소득']
  }
];

// 가업상속세 계산기
const businessInheritanceCalculator = {
  id: 'business-inheritance',
  title: '가업상속세금 계산기',
  description: '중소기업·중견기업 가업상속공제 적용 상속세 계산',
  icon: Crown,
  color: 'violet',
  features: ['최대 500억 공제', '10년 사후관리', '실무 관리 시스템', '리스크 모니터링']
};

// 주식이동세 계산기
const stockTransferCalculator = {
  id: 'stock-transfer',
  title: '주식이동세금 계산기',
  description: '주식 매매시 발생하는 양도소득세 정확한 계산',
  icon: TrendingUp,
  color: 'pink',
  features: ['상장/비상장 구분', '장기보유특별공제', '대주주 여부 반영', '절세 전략 제공']
};

// 계산기 선택 컴포넌트
interface CalculatorSelectorProps {
  calculators: any[];
  onSelect: (calculatorId: string) => void;
  selectedId?: string;
}

function CalculatorSelector({ calculators, onSelect, selectedId }: CalculatorSelectorProps) {
  return (
    <>
      {/* 🔥 모바일 최적화된 사용법 안내 */}
      <Card className="mb-6 lg:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4">
                🚀 계산기 사용 방법 (3단계로 완료!)
              </h3>
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 lg:gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">계산기 선택</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">필요한 세금 계산기를 선택</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">단계별 입력</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">가이드에 따라 정보 입력</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">결과 확인</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-tight">계산 결과와 절세 팁 확인</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {calculators.map((calc) => (
          <Card 
            key={calc.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 touch-manipulation border ${
              selectedId === calc.id ? 'ring-2 ring-blue-500 shadow-lg border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(calc.id)}
          >
            <CardHeader className="pb-3 px-4 sm:px-5 pt-4 sm:pt-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 sm:p-3 rounded-xl bg-${calc.color}-50 flex-shrink-0`}>
                  <calc.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${calc.color}-600`} />
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1 flex-shrink-0">
                  2024년 기준
                </Badge>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold leading-tight mb-2">
                {calc.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 leading-tight">
                {calc.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
              {/* 주요 기능 - 컴팩트한 표시 */}
              <div className="mb-4">
                <div className="grid grid-cols-1 gap-2">
                  {calc.features.slice(0, 3).map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 🔥 모바일용 프로세스 안내 - 더 간결하게 */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg mb-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">i</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800">간편 계산 과정</h4>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">1</div>
                    정보입력
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">2</div>
                    자동계산
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-xs">3</div>
                    결과확인
                  </span>
                </div>
              </div>
              
              <Button 
                className={`w-full text-sm py-3 touch-manipulation font-semibold transition-all duration-200 ${
                  selectedId === calc.id 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                    : 'border-2 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                variant={selectedId === calc.id ? "default" : "outline"}
              >
                {selectedId === calc.id ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    현재 선택됨
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    계산 시작하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

// 단일 계산기 표시 컴포넌트
function SingleCalculatorDisplay({ calculator, onSelect }: { calculator: any, onSelect: (id: string) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 사용법 안내 */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-purple-900 mb-4">
              🎯 {calculator.title} 사용 가이드
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                  1
                </div>
                <h4 className="font-medium text-gray-900">기본 정보</h4>
                <p className="text-sm text-gray-600">상속재산, 피상속인 정보 입력</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                  2
                </div>
                <h4 className="font-medium text-gray-900">공제 적용</h4>
                <p className="text-sm text-gray-600">가업상속공제, 일반공제 계산</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                  3
                </div>
                <h4 className="font-medium text-gray-900">세액 계산</h4>
                <p className="text-sm text-gray-600">최종 상속세액 및 절세액 산출</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                  4
                </div>
                <h4 className="font-medium text-gray-900">관리 시스템</h4>
                <p className="text-sm text-gray-600">10년 사후관리 계획 수립</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2"
        onClick={() => onSelect(calculator.id)}
      >
        <CardHeader className="pb-4 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 bg-${calculator.color}-50 rounded-xl flex items-center justify-center`}>
            <calculator.icon className={`w-8 h-8 text-${calculator.color}-600`} />
          </div>
          <Badge variant="secondary" className="mb-3">
            2024년 최신 기준
          </Badge>
          <CardTitle className="text-2xl font-bold">
            {calculator.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {calculator.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {calculator.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center text-gray-700 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* 특별 안내 */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 mb-2">📋 중요 안내사항</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• 가업상속공제는 <strong>중소기업·중견기업</strong>에만 적용됩니다</li>
                  <li>• 공제 적용 후 <strong>10년간 사후관리</strong> 의무가 있습니다</li>
                  <li>• 정확한 계산을 위해 <strong>최신 재무제표</strong>를 준비해주세요</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button className="w-full" size="lg">
            <Calculator className="w-5 h-5 mr-2" />
            전문 계산 시작하기
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TaxCalculatorPage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [selectedCalculator, setSelectedCalculator] = useState<string>('');
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  
  // 🚨 오류신고 버튼을 위한 함수 - 개선된 버전
  const scrollToErrorReport = () => {
    // 베타 피드백 폼이 있는 위치로 스크롤
    const feedbackSection = document.querySelector('[data-beta-feedback]');
    if (feedbackSection) {
      // 먼저 스크롤
      feedbackSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // 베타 피드백 폼 자동 열기 (여러 방법으로 시도)
      setTimeout(() => {
        // 첫 번째 시도: 오류 신고하기 버튼 찾기
        let feedbackButton = feedbackSection.querySelector('button:has(svg + span)') as HTMLButtonElement;
        
        // 두 번째 시도: 텍스트로 찾기
        if (!feedbackButton) {
          const buttons = feedbackSection.querySelectorAll('button');
          buttons.forEach(button => {
            if (button.textContent?.includes('오류 신고')) {
              feedbackButton = button as HTMLButtonElement;
            }
          });
        }
        
        // 버튼 클릭
        if (feedbackButton) {
          feedbackButton.click();
          console.log('✅ 베타 피드백 폼 자동 열기 성공');
        } else {
          console.log('⚠️ 베타 피드백 버튼을 찾을 수 없음');
        }
      }, 800); // 스크롤 완료 후 약간 더 기다림
    } else {
      console.log('⚠️ 베타 피드백 섹션을 찾을 수 없음');
      
      // 대안: 페이지 하단으로 스크롤
      window.scrollTo({
        top: document.body.scrollHeight - window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // 🔥 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 전역 단축키
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setActiveTab('personal');
            break;
          case '2':
            e.preventDefault();
            setActiveTab('corporate');
            break;
          case '3':
            e.preventDefault();
            setActiveTab('special');
            break;
          case 'h':
            e.preventDefault();
            setShowKeyboardGuide(!showKeyboardGuide);
            break;
          case 'd':
            e.preventDefault();
            setIsDarkMode(!isDarkMode);
            break;
        }
      }
      
      // F 키 단축키
      switch (e.key) {
        case 'F1':
          e.preventDefault();
          setShowKeyboardGuide(!showKeyboardGuide);
          break;
        case 'F2':
          e.preventDefault();
          setShowAccessibilityPanel(!showAccessibilityPanel);
          break;
        case 'Escape':
          setSelectedCalculator('');
          setShowKeyboardGuide(false);
          setShowAccessibilityPanel(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showKeyboardGuide, isDarkMode, showAccessibilityPanel]);

  // 🔥 다크모드 클래스 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 🔥 폰트 크기 적용
  useEffect(() => {
    const fontSizes = {
      small: '14px',
      normal: '16px',
      large: '18px',
      xlarge: '20px'
    };
    document.documentElement.style.fontSize = fontSizes[fontSize as keyof typeof fontSizes];
  }, [fontSize]);

  // 🔥 고대비 모드 적용
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // 강제 새로고침 함수
  const forceRefresh = () => {
    // 브라우저 캐시 무효화를 위한 타임스탬프 추가
    const timestamp = new Date().getTime();
    const currentUrl = window.location.href.split('?')[0];
    window.location.href = `${currentUrl}?v=${timestamp}`;
  };

  // 선택된 계산기 렌더링
  const renderSelectedCalculator = () => {
    switch (selectedCalculator) {
      case 'earned-income':
        return <EarnedIncomeTaxCalculatorComponent />;
      case 'comprehensive-income':
        return <ComprehensiveIncomeTaxCalculatorComponent />;
      case 'capital-gains':
        return <CapitalGainsTaxCalculatorComponent />;
      case 'inheritance':
        return <InheritanceTaxCalculatorComponent />;
      case 'gift':
        return <GiftTaxCalculator />;
      case 'corporate-tax':
        return <CorporateTaxCalculatorComponent />;
      case 'vat':
        return <VATCalculator />;
      case 'withholding':
        return <WithholdingTaxCalculator />;
      case 'business-inheritance':
        return <BusinessInheritanceCalculatorComponent />;
      case 'stock-transfer':
        return <StockTransferTaxCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
    } ${
      highContrast ? 'contrast-more' : ''
    }`}>
      {/* 네비게이션 헤더 */}
      <Header />
      
      {/* 🔥 접근성 패널 */}
      {showAccessibilityPanel && (
        <div className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">접근성 설정</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAccessibilityPanel(false)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-4">
            {/* 폰트 크기 */}
            <div>
              <Label className="text-sm font-medium mb-2 block">폰트 크기</Label>
              <div className="grid grid-cols-4 gap-2">
                {['small', 'normal', 'large', 'xlarge'].map((size) => (
                  <Button
                    key={size}
                    variant={fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFontSize(size)}
                    className="text-xs"
                  >
                    {size === 'small' ? 'S' : size === 'normal' ? 'M' : size === 'large' ? 'L' : 'XL'}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* 다크모드 */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">다크모드</Label>
              <Button
                variant={isDarkMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-16"
              >
                {isDarkMode ? 'ON' : 'OFF'}
              </Button>
            </div>
            
            {/* 고대비 모드 */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">고대비 모드</Label>
              <Button
                variant={highContrast ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHighContrast(!highContrast)}
                className="w-16"
              >
                {highContrast ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 키보드 단축키 가이드 */}
      {showKeyboardGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">⌨️ 키보드 단축키</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">탭 이동</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+1</kbd>
                      <span>개인세금</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+2</kbd>
                      <span>법인세금</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+3</kbd>
                      <span>특수계산</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">기능</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">F1</kbd>
                      <span>도움말</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">F2</kbd>
                      <span>접근성</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Ctrl+D</kbd>
                      <span>다크모드</span>
                    </div>
                    <div className="flex justify-between">
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd>
                      <span>닫기</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>팁:</strong> 계산기 내에서 Tab 키로 필드 간 이동, Enter로 계산 실행이 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 업데이트 안내 배너 */}
      {showUpdateBanner && (
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-purple-700' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm md:text-base font-medium">
                    🎉 세금계산기가 업데이트되었습니다! 
                    <span className="hidden sm:inline"> 접근성 개선 및 키보드 단축키가 추가되었습니다.</span>
                  </p>
                  <p className="text-xs md:text-sm opacity-90">
                    <kbd className="px-1 py-0.5 bg-white bg-opacity-20 rounded">F1</kbd>로 단축키 가이드를 확인하세요.
                    최신 버전이 보이지 않으시면 
                    <button 
                      onClick={forceRefresh}
                      className="underline ml-1 hover:text-yellow-200 transition-colors font-medium"
                    >
                      여기를 클릭하여 새로고침
                    </button>
                    해주세요.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardGuide(true)}
                  className="text-white hover:bg-white hover:bg-opacity-20 text-xs"
                >
                  단축키
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAccessibilityPanel(true)}
                  className="text-white hover:bg-white hover:bg-opacity-20 text-xs"
                >
                  접근성
                </Button>
                <button
                  onClick={() => setShowUpdateBanner(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="배너 닫기"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 - 모바일 최적화된 사용자 안내 */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 md:px-4 md:py-2 rounded-full mb-6 md:mb-8">
              <Calculator className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-800">스마트 세금계산 시스템</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              <div className="flex items-center justify-center gap-3 mb-2">
                스마트 세금계산기
                <Badge className="bg-orange-100 text-orange-700 border-orange-300 text-sm md:text-base px-2 py-1 animate-pulse">
                  🧪 BETA
                </Badge>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                단계별 가이드로 쉽고 정확하게
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto px-4 leading-relaxed">
              <strong>2024년 최신 세율</strong>을 적용한 단계별 가이드 시스템으로 
              <strong>누구나 쉽게</strong> 세금을 계산할 수 있습니다. 
              <strong>입력값 검증</strong>, <strong>실시간 도움말</strong>, <strong>오류 방지</strong> 기능으로 
              정확한 계산 결과를 보장합니다.
            </p>

            {/* 🧪 베타테스트 안내 */}
            <div className="max-w-4xl mx-auto mb-8 md:mb-12 px-4">
              <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border border-red-200 rounded-lg p-4 md:p-6 relative overflow-hidden">
                {/* 배경 패턴 */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-2 right-2 w-16 h-16 bg-red-400 rounded-full blur-xl"></div>
                  <div className="absolute bottom-2 left-2 w-12 h-12 bg-orange-400 rounded-full blur-lg"></div>
                </div>
                
                <div className="flex items-start gap-3 relative z-10">
                  <div className="flex-shrink-0">
                    <Badge className="bg-red-100 text-red-700 border-red-300 font-bold animate-pulse">
                      🧪 베타테스트
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
                      🚨 베타테스트 중인 서비스입니다
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </h3>
                    <p className="text-sm md:text-base text-red-800 font-medium mb-4 leading-relaxed">
                      현재 <strong>세무계산기 베타테스트</strong>를 진행 중입니다. 사용 중 발견하신 
                      <span className="text-red-600 font-bold">계산 오류, 버그, 불편사항</span>이 있으시면 
                      <span className="bg-red-100 px-2 py-1 rounded font-bold text-red-700">화면 우하단 플로팅 버튼</span> 또는 
                      각 계산기 하단의 <strong>"🚨 오류 신고하기"</strong> 버튼을 통해 의견을 보내주세요. 
                      여러분의 소중한 피드백이 더 나은 서비스를 만듭니다.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-2">
                          <Bug className="w-4 h-4" />
                          오류 신고 방법
                        </div>
                        <ul className="text-xs text-red-600 space-y-1">
                          <li>• 📱 <strong>플로팅 버튼:</strong> 화면 우하단 빨간 버튼</li>
                          <li>• 📋 <strong>각 계산기:</strong> 하단 "오류 신고하기" 버튼</li>
                          <li>• ⚡ <strong>즉시 접수:</strong> 개발팀 실시간 알림</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-2">
                          <Clock className="w-4 h-4" />
                          처리 프로세스
                        </div>
                        <ul className="text-xs text-blue-600 space-y-1">
                          <li>• 📧 <strong>접수 확인:</strong> 이메일 자동 발송</li>
                          <li>• 🔧 <strong>빠른 수정:</strong> 1-2일 내 처리</li>
                          <li>• 📬 <strong>결과 회신:</strong> 수정 완료 후 알림</li>
                        </ul>
                      </div>
                    </div>
                    
                                         <div className="text-xs md:text-sm text-orange-700 bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border border-orange-200">
                       <div className="flex items-center gap-2 font-bold text-orange-800 mb-2">
                         <CheckCircle className="w-4 h-4" />
                         💌 피드백 절차 요약
                       </div>
                       <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                         <span className="bg-orange-200 px-2 py-1 rounded font-medium">계산기 사용</span>
                         <span>→</span>
                         <span className="bg-red-200 px-2 py-1 rounded font-medium">오류 발견</span>
                         <span>→</span>
                         <span className="bg-blue-200 px-2 py-1 rounded font-medium">신고 버튼 클릭</span>
                         <span>→</span>
                         <span className="bg-green-200 px-2 py-1 rounded font-medium">이메일 회신</span>
                       </div>
                       
                       {/* 🚨 즉시 오류신고 버튼 */}
                       <div className="flex justify-center mt-3">
                         <Button
                           onClick={scrollToErrorReport}
                           className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                         >
                           <Bug className="w-4 h-4 mr-2" />
                           🚨 지금 바로 오류신고하기
                         </Button>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 px-4">
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                단계별 입력 가이드
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                실시간 입력 검증
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2">
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                진행 상황 표시
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 hidden sm:inline-flex">
                <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                상세 설명 제공
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 hidden sm:inline-flex">
                <PiggyBank className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                절세 팁 안내
              </Badge>
            </div>
          </div>

          {/* 세금계산기 특징 카드들 - 모바일 최적화 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 px-4 md:px-0">
            <Card className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                <CardTitle className="text-base md:text-lg">단계별 안내</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  복잡한 세금 계산을 <strong>3단계</strong>로 나누어 
                  <strong>차근차근 안내</strong>해드립니다. 
                  진행 상황을 한눈에 확인하세요.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                <CardTitle className="text-base md:text-lg">입력 도우미</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  <strong>필수 입력값 표시</strong>, <strong>실시간 검증</strong>, 
                  <strong>도움말 툴팁</strong>으로 
                  입력 실수를 방지하고 정확한 계산을 도와줍니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <CardTitle className="text-base md:text-lg">상세 결과</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  계산 결과를 <strong>시각적으로 표현</strong>하고 
                  <strong>절세 팁</strong>과 <strong>주의사항</strong>을 
                  함께 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 법적 면책 조항 - 250자 요약본 */}
          <div className="mb-12 md:mb-16">
            <TaxCalculatorDisclaimer variant="summary" />
          </div>

          {selectedCalculator ? (
            // 선택된 계산기 표시
            <div className="space-y-6">
              {/* 🎯 강력한 가시성 개선: 계산기 선택으로 돌아가기 버튼 */}
              <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-4 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">세금계산기 실행 중</h3>
                      <p className="text-sm text-gray-600">
                        {personalTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
                         corporateTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
                         businessInheritanceCalculator.id === selectedCalculator ? businessInheritanceCalculator.title :
                         stockTransferCalculator.id === selectedCalculator ? stockTransferCalculator.title : ''}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedCalculator('')}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-3 px-6"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span className="text-base">계산기 선택으로 돌아가기</span>
                  </Button>
                </div>
                
                {/* 진행 상황 표시 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>계산기 활성화됨</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>단계별 입력 가이드 제공</span>
                    <span className="text-gray-400">•</span>
                    <span className="hidden sm:inline">실시간 검증 활성화</span>
                  </div>
                </div>
              </div>
              
              {renderSelectedCalculator()}
            </div>
          ) : (
            // 계산기 선택 화면
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* 🎯 단순하고 직관적인 세금 종류 메뉴바 */}
              <div className="mb-12 md:mb-16">
                {/* 간단한 제목 */}
                <div className="text-center mb-8 md:mb-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">세금 종류 선택</h3>
                  <p className="text-gray-600">계산하고 싶은 세금 종류를 선택해주세요</p>
                </div>
                
                              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm gap-2 md:gap-3">
                <TabsTrigger 
                  value="personal" 
                  className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] py-4 sm:py-6 px-3 sm:px-4 rounded-lg text-gray-700 font-medium transition-all hover:bg-blue-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md overflow-hidden"
                >
                  <User className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-blue-600 data-[state=active]:text-white flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold mb-1 text-center leading-tight">개인세금</span>
                  <span className="text-xs sm:text-sm text-center leading-tight px-1">
                    <span className="block">근로·종합소득세</span>
                    <span className="block">양도·상속·증여세</span>
                  </span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="corporate" 
                  className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] py-4 sm:py-6 px-3 sm:px-4 rounded-lg text-gray-700 font-medium transition-all hover:bg-green-50 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md overflow-hidden"
                >
                  <Building2 className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-green-600 data-[state=active]:text-white flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold mb-1 text-center leading-tight">법인세금</span>
                  <span className="text-xs sm:text-sm text-center leading-tight px-1">
                    <span className="block">법인세·부가가치세</span>
                    <span className="block">원천징수세</span>
                  </span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="business-inheritance" 
                  className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] py-4 sm:py-6 px-3 sm:px-4 rounded-lg text-gray-700 font-medium transition-all hover:bg-violet-50 data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-md overflow-hidden"
                >
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-violet-600 data-[state=active]:text-white flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold mb-1 text-center leading-tight">가업상속세</span>
                  <span className="text-xs sm:text-sm text-center leading-tight px-1">
                    <span className="block">중소기업 가업승계</span>
                    <span className="block">최대 500억 공제</span>
                  </span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="stock-transfer" 
                  className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] py-4 sm:py-6 px-3 sm:px-4 rounded-lg text-gray-700 font-medium transition-all hover:bg-pink-50 data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md overflow-hidden"
                >
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 text-pink-600 data-[state=active]:text-white flex-shrink-0" />
                  <span className="text-base sm:text-lg font-bold mb-1 text-center leading-tight">주식이동세</span>
                  <span className="text-xs sm:text-sm text-center leading-tight px-1">
                    <span className="block">주식 매매시</span>
                    <span className="block">양도소득세 계산</span>
                  </span>
                </TabsTrigger>
              </TabsList>
              </div>

              {/* 탭 컨텐츠 */}
              <TabsContent value="personal" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">개인세금 계산기</h2>
                  <p className="text-gray-600 mb-6">개인 납세자를 위한 다양한 세금 계산기</p>
                  <CalculatorSelector 
                    calculators={personalTaxCalculators}
                    onSelect={setSelectedCalculator}
                    selectedId={selectedCalculator}
                  />
                </div>
              </TabsContent>

              <TabsContent value="corporate" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">법인세금 계산기</h2>
                  <p className="text-gray-600 mb-6">법인 사업자를 위한 세금 계산기</p>
                  <CalculatorSelector 
                    calculators={corporateTaxCalculators}
                    onSelect={setSelectedCalculator}
                    selectedId={selectedCalculator}
                  />
                </div>
              </TabsContent>

              <TabsContent value="business-inheritance" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-violet-600" />
                    가업상속세금 계산기
                  </h2>
                  <p className="text-gray-600 mb-6">
                    중소기업·중견기업 가업상속공제를 적용한 상속세 계산과 10년 사후관리 시스템
                  </p>
                  <SingleCalculatorDisplay 
                    calculator={businessInheritanceCalculator}
                    onSelect={setSelectedCalculator}
                  />
                </div>
              </TabsContent>

              <TabsContent value="stock-transfer" className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-pink-600" />
                    주식이동세금 계산기
                  </h2>
                  <p className="text-gray-600 mb-6">
                    주식 매매시 발생하는 양도소득세 정확한 계산과 절세 전략 제공
                  </p>
                  <SingleCalculatorDisplay 
                    calculator={stockTransferCalculator}
                    onSelect={setSelectedCalculator}
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      {/* 🚨 플로팅 오류신고 버튼 */}
      <FloatingErrorReportButton
        calculatorName={
          selectedCalculator 
            ? (personalTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               corporateTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               businessInheritanceCalculator.id === selectedCalculator ? businessInheritanceCalculator.title :
               stockTransferCalculator.id === selectedCalculator ? stockTransferCalculator.title : '세금계산기')
            : '세금계산기'
        }
        onReportClick={scrollToErrorReport}
      />
    </div>
  );
} 