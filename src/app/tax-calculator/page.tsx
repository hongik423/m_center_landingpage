'use client';

import { useState } from 'react';
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
  X
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
      {/* 사용법 안내 */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                🚀 계산기 사용 방법 (3단계로 완료!)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">계산기 선택</h4>
                    <p className="text-sm text-gray-600">아래에서 필요한 계산기를 선택하세요</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">단계별 입력</h4>
                    <p className="text-sm text-gray-600">가이드에 따라 정보를 입력하세요</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">결과 확인</h4>
                    <p className="text-sm text-gray-600">계산 결과와 절세 팁을 확인하세요</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {calculators.map((calc) => (
          <Card 
            key={calc.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 touch-feedback ${
              selectedId === calc.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
            }`}
            onClick={() => onSelect(calc.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 md:p-3 rounded-xl bg-${calc.color}-50`}>
                  <calc.icon className={`w-5 h-5 md:w-6 md:h-6 text-${calc.color}-600`} />
                </div>
                <Badge variant="secondary" className="text-xs">
                  2024년 기준
                </Badge>
              </div>
              <CardTitle className="text-base md:text-lg font-bold mt-2 md:mt-3">
                {calc.title}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm text-gray-600">
                {calc.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-3 md:mb-4">
                {calc.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center text-xs md:text-sm text-gray-700">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* 간단한 입력 순서 안내 - 데스크톱에서만 표시 */}
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg mb-3 md:mb-4 hidden md:block">
                <h4 className="text-xs font-medium text-gray-800 mb-2">💡 입력 순서:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>1️⃣ 기본 소득 정보</div>
                  <div>2️⃣ 공제 항목</div>
                  <div>3️⃣ 세액공제</div>
                </div>
              </div>
              
              <Button 
                className="w-full text-xs md:text-sm py-2 md:py-3 mobile-button touch-feedback" 
                variant={selectedId === calc.id ? "default" : "outline"}
              >
                {selectedId === calc.id ? (
                  <>
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    선택됨
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 네비게이션 헤더 */}
      <Header />
      
      {/* 업데이트 안내 배너 */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm md:text-base font-medium">
                    🎉 세금계산기가 업데이트되었습니다! 
                    <span className="hidden sm:inline"> 모바일 최적화 및 새로운 기능이 추가되었습니다.</span>
                  </p>
                  <p className="text-xs md:text-sm opacity-90">
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
      )}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 섹션 - 모바일 최적화된 사용자 안내 */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 md:px-4 md:py-2 rounded-full mb-4 md:mb-6">
              <Calculator className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              <span className="text-xs md:text-sm font-medium text-blue-800">스마트 세금계산 시스템</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              스마트 세금계산기
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                단계별 가이드로 쉽고 정확하게
              </span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto px-4 leading-relaxed">
              <strong>2024년 최신 세율</strong>을 적용한 단계별 가이드 시스템으로 
              <strong>누구나 쉽게</strong> 세금을 계산할 수 있습니다. 
              <strong>입력값 검증</strong>, <strong>실시간 도움말</strong>, <strong>오류 방지</strong> 기능으로 
              정확한 계산 결과를 보장합니다.
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8 px-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
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
          <div className="mb-8">
            <TaxCalculatorDisclaimer variant="summary" />
          </div>

          {selectedCalculator ? (
            // 선택된 계산기 표시
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCalculator('')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>계산기 선택으로 돌아가기</span>
                </Button>
              </div>
              {renderSelectedCalculator()}
            </div>
          ) : (
            // 계산기 선택 화면
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* 탭 네비게이션 - 모바일 최적화 */}
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 bg-white border shadow-sm">
                <TabsTrigger 
                  value="personal" 
                  className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 text-xs md:text-sm data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <User className="w-3 h-3 md:w-4 md:h-4" />
                  <span>개인세금</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="corporate" 
                  className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 text-xs md:text-sm data-[state=active]:bg-green-50 data-[state=active]:text-green-600"
                >
                  <Building2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span>법인세금</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="business-inheritance" 
                  className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 text-xs md:text-sm data-[state=active]:bg-violet-50 data-[state=active]:text-violet-600"
                >
                  <Crown className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">가업상속세</span>
                  <span className="sm:hidden">가업상속</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stock-transfer" 
                  className="flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 text-xs md:text-sm data-[state=active]:bg-pink-50 data-[state=active]:text-pink-600"
                >
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">주식이동세</span>
                  <span className="sm:hidden">주식이동</span>
                </TabsTrigger>
              </TabsList>

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
    </div>
  );
} 