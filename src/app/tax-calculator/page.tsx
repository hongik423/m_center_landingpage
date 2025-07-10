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
  Bug,
  AlertTriangle
} from 'lucide-react';
import Header from '@/components/layout/header';
import EarnedIncomeTaxCalculatorComponent from '@/components/tax-calculator/EarnedIncomeTaxCalculator';
import ComprehensiveIncomeTaxCalculatorComponent from '@/components/tax-calculator/ComprehensiveIncomeTaxCalculator';
import CapitalGainsTaxCalculatorComponent from '@/components/tax-calculator/CapitalGainsTaxCalculator';
import { InheritanceTaxCalculatorComponent } from '@/components/tax-calculator/InheritanceTaxCalculator';
import { GiftTaxCalculator } from '@/components/tax-calculator/GiftTaxCalculator';
import SimpleComprehensiveCalculator from '@/components/tax-calculator/SimpleComprehensiveCalculator';
import TaxCalculatorDisclaimer from '@/components/tax-calculator/TaxCalculatorDisclaimer';
import CorporateTaxCalculatorComponent from '@/components/tax-calculator/CorporateTaxCalculator';
import VATCalculator from '@/components/tax-calculator/VATCalculator';
import WithholdingTaxCalculator from '@/components/tax-calculator/WithholdingTaxCalculator';
import BusinessInheritanceCalculatorComponent from '@/components/tax-calculator/BusinessInheritanceCalculator';
import StockTransferTaxCalculator from '@/components/tax-calculator/StockTransferTaxCalculator';

import { Label } from '@/components/ui/label';
import { BetaFeedbackForm } from '@/components/ui/beta-feedback-form';

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

// 전체 계산기 목록 (그리드 표시용)
const taxCalculators = [
  ...personalTaxCalculators.map(calc => ({
    ...calc,
    category: 'personal',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: { bg: 'bg-blue-100', text: 'text-blue-700', label: '개인' },
    buttonStyle: 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300',
    target: '개인 납세자',
  })),
  ...corporateTaxCalculators.map(calc => ({
    ...calc,
    category: 'corporate',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    badge: { bg: 'bg-green-100', text: 'text-green-700', label: '법인' },
    buttonStyle: 'border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300',
    target: '법인 사업자',
  })),
  {
    ...businessInheritanceCalculator,
    category: 'business-inheritance',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    badge: { bg: 'bg-violet-100', text: 'text-violet-700', label: '특수' },
    buttonStyle: 'border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300',
    target: '중소·중견기업',
  },
  {
    ...stockTransferCalculator,
    category: 'stock-transfer',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    badge: { bg: 'bg-pink-100', text: 'text-pink-700', label: '주식' },
    buttonStyle: 'border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300',
    target: '주식 투자자',
  }
];

// 계산기 선택 컴포넌트
interface CalculatorSelectorProps {
  calculators: any[];
  onSelect: (calculatorId: string) => void;
  selectedId?: string;
}

function CalculatorSelector({ calculators, onSelect, selectedId }: CalculatorSelectorProps) {
  return (
    <>
      {/* 🔥 모바일 가시성 개선 - 흑색 바탕에 흰색 텍스트 */}
      <Card className="mb-4 lg:mb-6 bg-gray-800 border-gray-600">
        <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-900/50 rounded-lg flex-shrink-0">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
                💡 빠른 계산 가이드
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                <div className="text-center p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1">
                    1
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 font-medium">카드 선택</p>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1">
                    2
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 font-medium">샘플 테스트</p>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1">
                    3
                  </div>
                  <p className="text-xs sm:text-sm text-gray-200 font-medium">결과 확인</p>
                </div>
              </div>
              
              {/* 🔥 컴팩트한 샘플 데이터 안내 - 흑색 바탕 개선 */}
              <div className="p-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-700">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-green-200 font-medium">
                    각 계산기마다 <strong className="bg-green-800 px-1 rounded text-green-100">샘플 데이터</strong> 버튼으로 즉시 체험 가능!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 모바일 최적화된 메트릭스 그리드 - 스크롤 없이 모든 계산기 표시 */}
      <div className="space-y-4">
        {/* 개인세금 계산기 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">개인세금 계산기</h3>
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">5개</Badge>
          </div>
          
          {/* 🔥 모바일: 2x3 그리드, 태블릿: 3x2 그리드, 데스크톱: 5x1 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
            {personalTaxCalculators.map((calc) => (
              <Card 
                key={calc.id}
                className={`mobile-compact-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border bg-gray-700
                  transform hover:scale-[1.02] active:scale-[0.98] active:shadow-md hover:bg-gray-600
                  ${selectedId === calc.id ? 'ring-2 ring-blue-400 shadow-lg border-blue-400 bg-blue-900/30' : 'border-gray-600 hover:border-gray-500'}
                `}
                onClick={(e) => {
                  console.log('🔥 개인세금 카드 클릭됨:', calc.id, calc.title);
                  e.preventDefault();
                  onSelect(calc.id);
                }}
                // 🔥 개선된 모바일 터치 이벤트
                onTouchStart={(e) => {
                  console.log('📱 개인세금 터치 시작:', calc.id);
                  e.currentTarget.style.transform = 'scale(0.95)';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                  if (navigator.vibrate) navigator.vibrate(10);
                }}
                onTouchEnd={(e) => {
                  console.log('📱 개인세금 터치 종료:', calc.id);
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                  setTimeout(() => {
                    console.log('🎯 개인세금 터치 후 선택 실행:', calc.id);
                    onSelect(calc.id);
                  }, 50);
                }}
                onTouchCancel={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                }}
                // 키보드 접근성
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('⌨️ 키보드로 개인세금 계산기 선택:', calc.id);
                    onSelect(calc.id);
                  }
                }}
                aria-label={`${calc.title} 선택`}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  {/* 아이콘과 제목 */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-${calc.color}-50 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                    <calc.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${calc.color}-600`} />
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1 leading-tight">
                    {calc.title.replace(' 계산기', '')}
                  </h4>
                  
                  <p className="text-xs text-gray-300 mb-2 leading-tight line-clamp-2">
                    {calc.description}
                  </p>
                  
                  {/* 주요 기능 1개만 표시 */}
                  <div className="flex items-center justify-center text-xs text-gray-200 bg-gray-600 px-2 py-1 rounded-md mb-2">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-1 flex-shrink-0" />
                    <span className="font-medium truncate">{calc.features[0]}</span>
                  </div>
                  
                  {/* 계산 버튼 */}
                  <Button 
                    size="sm"
                    className={`w-full text-xs py-1.5 font-semibold transition-all duration-200
                      ${selectedId === calc.id 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                        : 'border hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    variant={selectedId === calc.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔴 개인세금 버튼 클릭됨:', calc.id, calc.title);
                      onSelect(calc.id);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      if (navigator.vibrate) navigator.vibrate(5);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        console.log('🎯 개인세금 버튼 터치 후 선택 실행:', calc.id);
                        onSelect(calc.id);
                      }, 50);
                    }}
                    aria-label={`${calc.title} 계산기 시작`}
                  >
                    {selectedId === calc.id ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        선택됨
                      </>
                    ) : (
                      <>
                        <Calculator className="w-3 h-3 mr-1" />
                        계산하기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 법인세금 계산기 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">법인세금 계산기</h3>
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">3개</Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 mb-6">
            {corporateTaxCalculators.map((calc) => (
              <Card 
                key={calc.id}
                className={`mobile-compact-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border 
                  transform hover:scale-[1.02] active:scale-[0.98] active:shadow-md
                  ${selectedId === calc.id ? 'ring-2 ring-green-500 shadow-lg border-green-200 bg-green-50' : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={(e) => {
                  console.log('🔥 법인세금 카드 클릭됨:', calc.id, calc.title);
                  e.preventDefault();
                  onSelect(calc.id);
                }}
                onTouchStart={(e) => {
                  console.log('📱 법인세금 터치 시작:', calc.id);
                  e.currentTarget.style.transform = 'scale(0.95)';
                  e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.05)';
                  if (navigator.vibrate) navigator.vibrate(10);
                }}
                onTouchEnd={(e) => {
                  console.log('📱 법인세금 터치 종료:', calc.id);
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                  setTimeout(() => {
                    console.log('🎯 법인세금 터치 후 선택 실행:', calc.id);
                    onSelect(calc.id);
                  }, 50);
                }}
                onTouchCancel={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('⌨️ 키보드로 법인세금 계산기 선택:', calc.id);
                    onSelect(calc.id);
                  }
                }}
                aria-label={`${calc.title} 선택`}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-${calc.color}-50 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                    <calc.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${calc.color}-600`} />
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                    {calc.title.replace(' 계산기', '')}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-tight line-clamp-2">
                    {calc.description}
                  </p>
                  
                  <div className="flex items-center justify-center text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded-md mb-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                    <span className="font-medium truncate">{calc.features[0]}</span>
                  </div>
                  
                  <Button 
                    size="sm"
                    className={`w-full text-xs py-1.5 font-semibold transition-all duration-200
                      ${selectedId === calc.id 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg' 
                        : 'border hover:border-green-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    variant={selectedId === calc.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔴 법인세금 버튼 클릭됨:', calc.id, calc.title);
                      onSelect(calc.id);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      if (navigator.vibrate) navigator.vibrate(5);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        console.log('🎯 법인세금 버튼 터치 후 선택 실행:', calc.id);
                        onSelect(calc.id);
                      }, 50);
                    }}
                    aria-label={`${calc.title} 계산기 시작`}
                  >
                    {selectedId === calc.id ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        선택됨
                      </>
                    ) : (
                      <>
                        <Calculator className="w-3 h-3 mr-1" />
                        계산하기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 특수 계산기 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">특수 계산기</h3>
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-200">2개</Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-3">
            {[businessInheritanceCalculator, stockTransferCalculator].map((calc) => (
              <Card 
                key={calc.id}
                className={`mobile-compact-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border 
                  transform hover:scale-[1.02] active:scale-[0.98] active:shadow-md
                  ${selectedId === calc.id ? 'ring-2 ring-violet-500 shadow-lg border-violet-200 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}
                `}
                onClick={(e) => {
                  console.log('🔥 특수 계산기 카드 클릭됨:', calc.id, calc.title);
                  e.preventDefault();
                  onSelect(calc.id);
                }}
                onTouchStart={(e) => {
                  console.log('📱 특수 계산기 터치 시작:', calc.id);
                  e.currentTarget.style.transform = 'scale(0.95)';
                  e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
                  if (navigator.vibrate) navigator.vibrate(10);
                }}
                onTouchEnd={(e) => {
                  console.log('📱 특수 계산기 터치 종료:', calc.id);
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                  setTimeout(() => {
                    console.log('🎯 특수 계산기 터치 후 선택 실행:', calc.id);
                    onSelect(calc.id);
                  }, 50);
                }}
                onTouchCancel={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    console.log('⌨️ 키보드로 특수 계산기 선택:', calc.id);
                    onSelect(calc.id);
                  }
                }}
                aria-label={`${calc.title} 선택`}
                role="button"
                tabIndex={0}
              >
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-${calc.color}-50 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110`}>
                    <calc.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${calc.color}-600`} />
                  </div>
                  
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 leading-tight">
                    {calc.title.replace(' 계산기', '').replace('세금', '')}
                  </h4>
                  
                  <p className="text-xs text-gray-600 mb-2 leading-tight line-clamp-2">
                    {calc.description}
                  </p>
                  
                  <div className="flex items-center justify-center text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded-md mb-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                    <span className="font-medium truncate">{calc.features[0]}</span>
                  </div>
                  
                  <Button 
                    size="sm"
                    className={`w-full text-xs py-1.5 font-semibold transition-all duration-200
                      ${selectedId === calc.id 
                        ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg' 
                        : 'border hover:border-violet-600 hover:text-violet-600 hover:bg-violet-50'
                      }`}
                    variant={selectedId === calc.id ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔴 특수 계산기 버튼 클릭됨:', calc.id, calc.title);
                      onSelect(calc.id);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      if (navigator.vibrate) navigator.vibrate(5);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        console.log('🎯 특수 계산기 버튼 터치 후 선택 실행:', calc.id);
                        onSelect(calc.id);
                      }, 50);
                    }}
                    aria-label={`${calc.title} 계산기 시작`}
                  >
                    {selectedId === calc.id ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        선택됨
                      </>
                    ) : (
                      <>
                        <Calculator className="w-3 h-3 mr-1" />
                        계산하기
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
              {calculator.title} 사용 가이드
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
        className="mobile-card-enhanced transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2"
        onClick={(e) => {
          console.log('🔥 단일 계산기 카드 클릭됨:', calculator.id, calculator.title);
          e.preventDefault();
          onSelect(calculator.id);
        }}
        // 🔥 개선된 모바일 터치 최적화
        onTouchStart={(e) => {
          console.log('📱 단일 계산기 터치 시작:', calculator.id);
          e.currentTarget.style.transform = 'scale(0.98)';
          e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
          if (navigator.vibrate) navigator.vibrate(15);
        }}
        onTouchEnd={(e) => {
          console.log('📱 단일 계산기 터치 종료:', calculator.id);
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '';
          // 터치 종료 시 명시적으로 클릭 이벤트 실행
          setTimeout(() => {
            console.log('🎯 단일 계산기 터치 후 선택 실행:', calculator.id);
            onSelect(calculator.id);
          }, 50);
        }}
        onTouchCancel={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '';
        }}
        // 키보드 접근성
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            console.log('⌨️ 키보드로 단일 계산기 선택:', calculator.id);
            onSelect(calculator.id);
          }
        }}
        aria-label={`${calculator.title} 선택`}
        role="button"
        tabIndex={0}
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
                <h4 className="font-medium text-amber-900 mb-2">중요 안내사항</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• 가업상속공제는 <strong>중소기업·중견기업</strong>에만 적용됩니다</li>
                  <li>• 공제 적용 후 <strong>10년간 사후관리</strong> 의무가 있습니다</li>
                  <li>• 정확한 계산을 위해 <strong>최신 재무제표</strong>를 준비해주세요</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button 
            className="mobile-button-enhanced" 
            size="lg"
            onClick={(e) => {
              e.stopPropagation(); // 부모 카드 클릭 이벤트 방지
              console.log('🔴 단일 계산기 버튼 클릭됨:', calculator.id, calculator.title);
              onSelect(calculator.id);
            }}
            // 모바일 터치 피드백
            onTouchStart={(e) => {
              e.stopPropagation();
              console.log('📱 단일 계산기 버튼 터치:', calculator.id);
              if (navigator.vibrate) navigator.vibrate(10);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              // 터치 종료 시 명시적으로 클릭 이벤트 실행
              setTimeout(() => {
                console.log('🎯 단일 계산기 버튼 터치 후 선택 실행:', calculator.id);
                onSelect(calculator.id);
              }, 50);
            }}
            aria-label={`${calculator.title} 계산 시작`}
          >
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
    console.log('🔥 상단 오류신고 버튼 클릭됨 - 개선된 버전');
    
    try {
      // 1단계: 전역 함수로 베타 피드백 폼 열기 시도 (최신 방법)
      if (typeof window !== 'undefined' && (window as any).openBetaFeedbackForm) {
        console.log('🎯 전역 함수를 통한 베타 피드백 폼 열기 시도');
        (window as any).openBetaFeedbackForm(
          selectedCalculator 
            ? (personalTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               corporateTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               '세금계산기')
            : '세금계산기'
        );
        
        // 성공 알림
        if (window.innerWidth < 768) {
          const successMsg = document.createElement('div');
          successMsg.textContent = '✅ 오류신고 폼이 열렸습니다!';
          successMsg.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #10b981; color: white; padding: 12px 24px; border-radius: 8px;
            font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          `;
          document.body.appendChild(successMsg);
          setTimeout(() => {
            if (document.body.contains(successMsg)) {
              document.body.removeChild(successMsg);
            }
          }, 2000);
        }
        return;
      }

      // 2단계: 커스텀 이벤트 발송
      console.log('📡 커스텀 이벤트를 통한 베타 피드백 폼 열기 시도');
      const event = new CustomEvent('openBetaFeedbackForm', {
        detail: { 
          calculatorName: selectedCalculator 
            ? (personalTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               corporateTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
               '세금계산기')
            : '세금계산기'
        }
      });
      window.dispatchEvent(event);

      // 성공 알림
      if (window.innerWidth < 768) {
        const successMsg = document.createElement('div');
        successMsg.textContent = '✅ 오류신고 폼을 찾고 있습니다...';
        successMsg.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px;
          font-weight: bold; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(successMsg);
        setTimeout(() => {
          if (document.body.contains(successMsg)) {
            document.body.removeChild(successMsg);
          }
        }, 2000);
      }

      // 3단계: 통합 오류신고 섹션으로 스크롤 (백업 방법)
      setTimeout(() => {
        const errorReportSection = document.getElementById('beta-feedback-section');
        if (errorReportSection) {
          console.log('🎯 통합 오류신고 섹션으로 스크롤');
          errorReportSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          // 4단계: 페이지 하단으로 스크롤 (최종 백업)
          console.log('📜 페이지 하단으로 스크롤');
          window.scrollTo({
            top: document.body.scrollHeight - window.innerHeight + 50,
            behavior: 'smooth'
          });
        }
      }, 500);

    } catch (error) {
      console.error('❌ 상단 오류신고 버튼 클릭 중 오류:', error);
      
      // 오류 발생 시 안전한 대안
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight - window.innerHeight + 50,
          behavior: 'smooth'
        });
        
        // 사용자에게 안내
        setTimeout(() => {
          const errorMsg = document.createElement('div');
          errorMsg.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
              <div style="font-weight: bold; margin-bottom: 4px;">오류신고 안내</div>
              <div style="font-size: 14px;">화면 하단에서 "오류 신고하기" 버튼을 찾아주세요!</div>
            </div>
          `;
          errorMsg.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px;
            font-family: inherit; z-index: 9999; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            max-width: 90vw; width: 300px;
          `;
          document.body.appendChild(errorMsg);
          
          setTimeout(() => {
            if (document.body.contains(errorMsg)) {
              document.body.removeChild(errorMsg);
            }
          }, 3000);
          
          errorMsg.addEventListener('click', () => {
            if (document.body.contains(errorMsg)) {
              document.body.removeChild(errorMsg);
            }
          });
        }, 1000);
      }, 500);
    }
  };

  // 🚨 URL 파라미터 체크 - 오류신고 자동 활성화 & 계산기 선택
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // 🔥 NEW: 계산기 선택 파라미터 처리
    const calculatorParam = urlParams.get('calculator');
    if (calculatorParam) {
      console.log('🎯 URL에서 계산기 선택 파라미터 발견:', calculatorParam);
      
      // 유효한 계산기 ID인지 확인
      const allCalculatorIds = [
        ...personalTaxCalculators.map(c => c.id),
        ...corporateTaxCalculators.map(c => c.id),
        businessInheritanceCalculator.id,
        stockTransferCalculator.id
      ];
      
      if (allCalculatorIds.includes(calculatorParam)) {
        console.log('✅ 유효한 계산기 ID - 자동 선택 실행:', calculatorParam);
        
        // 페이지 로딩 후 잠시 후에 계산기 선택 (DOM이 준비된 후)
        setTimeout(() => {
          handleCalculatorSelect(calculatorParam);
          
          // 사용자에게 안내 메시지 표시
          const welcomeMsg = document.createElement('div');
          welcomeMsg.innerHTML = `
            <div style="text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🧮</div>
              <div style="font-weight: bold; margin-bottom: 4px; color: #7c3aed;">계산기 자동 선택됨</div>
              <div style="font-size: 14px; color: #6b7280;">모바일 메뉴에서 선택하신 계산기를 준비했습니다!</div>
            </div>
          `;
          welcomeMsg.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border: 2px solid #7c3aed; padding: 20px; border-radius: 12px;
            font-family: inherit; z-index: 9999; box-shadow: 0 8px 24px rgba(124,58,237,0.15);
            max-width: 90vw; width: 320px; animation: slideIn 0.3s ease-out;
          `;
          
          // CSS 애니메이션 추가
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideIn {
              from { opacity: 0; transform: translate(-50%, -60%); }
              to { opacity: 1; transform: translate(-50%, -50%); }
            }
          `;
          document.head.appendChild(style);
          
          document.body.appendChild(welcomeMsg);
          
          setTimeout(() => {
            if (document.body.contains(welcomeMsg)) {
              welcomeMsg.style.transition = 'opacity 0.3s ease-out';
              welcomeMsg.style.opacity = '0';
              setTimeout(() => {
                if (document.body.contains(welcomeMsg)) {
                  document.body.removeChild(welcomeMsg);
                }
              }, 300);
            }
          }, 2500);
          
          welcomeMsg.addEventListener('click', () => {
            if (document.body.contains(welcomeMsg)) {
              document.body.removeChild(welcomeMsg);
            }
          });
        }, 500);
      } else {
        console.log('❌ 유효하지 않은 계산기 ID:', calculatorParam);
      }
    }
    
    // 오류신고 자동 활성화 처리
    if (urlParams.get('error-report') === 'true') {
      // 페이지 로딩 후 1초 후에 오류신고 폼 자동 열기
      const timer = setTimeout(() => {
        console.log('🚨 고객지원에서 연결된 오류신고 요청 - 자동 활성화');
        scrollToErrorReport();
        
        // URL에서 파라미터 제거 (깔끔하게)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // 사용자에게 안내 메시지 표시
        const welcomeMsg = document.createElement('div');
        welcomeMsg.innerHTML = `
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🚨</div>
            <div style="font-weight: bold; margin-bottom: 4px; color: #dc2626;">오류신고 시스템 연결됨</div>
            <div style="font-size: 14px; color: #6b7280;">고객지원에서 요청하신 오류신고 폼을 준비 중입니다...</div>
          </div>
        `;
        welcomeMsg.style.cssText = `
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: white; border: 2px solid #dc2626; padding: 20px; border-radius: 12px;
          font-family: inherit; z-index: 9999; box-shadow: 0 8px 24px rgba(220,38,38,0.15);
          max-width: 90vw; width: 320px; animation: slideIn 0.3s ease-out;
        `;
        
        // CSS 애니메이션 추가
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from { opacity: 0; transform: translate(-50%, -60%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
          }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(welcomeMsg);
        
        setTimeout(() => {
          if (document.body.contains(welcomeMsg)) {
            welcomeMsg.style.transition = 'opacity 0.3s ease-out';
            welcomeMsg.style.opacity = '0';
            setTimeout(() => {
              if (document.body.contains(welcomeMsg)) {
                document.body.removeChild(welcomeMsg);
              }
            }, 300);
          }
        }, 3000);
        
        welcomeMsg.addEventListener('click', () => {
          if (document.body.contains(welcomeMsg)) {
            document.body.removeChild(welcomeMsg);
          }
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

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

  // 🔥 개선된 계산기 선택 핸들러 - 탭 자동 이동 기능
  const handleCalculatorSelect = (calculatorId: string) => {
    console.log('🚀 handleCalculatorSelect 호출됨:', calculatorId);
    
    // 계산기 ID에 따라 적절한 탭으로 이동
    const personalIds = personalTaxCalculators.map(c => c.id);
    const corporateIds = corporateTaxCalculators.map(c => c.id);
    
    if (personalIds.includes(calculatorId)) {
      console.log('📂 개인세금 탭으로 이동:', calculatorId);
      setActiveTab('personal');
    } else if (corporateIds.includes(calculatorId)) {
      console.log('📂 법인세금 탭으로 이동:', calculatorId);
      setActiveTab('corporate');
    } else if (calculatorId === 'business-inheritance') {
      console.log('📂 가업상속세 탭으로 이동:', calculatorId);
      setActiveTab('business-inheritance');
    } else if (calculatorId === 'stock-transfer') {
      console.log('📂 주식이동세 탭으로 이동:', calculatorId);
      setActiveTab('stock-transfer');
    }
    
    // 계산기 선택
    console.log('✅ setSelectedCalculator 호출:', calculatorId);
    setSelectedCalculator(calculatorId);
    
    // 모바일에서 확실히 보이도록 스크롤 추가
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-900'
    } ${
      highContrast ? 'contrast-more' : ''
    }`}>
      {/* 네비게이션 헤더 */}
      <Header />
      
      {/* 🔥 모바일 상단 여백 확보 */}
      <div className="h-4 sm:h-6 bg-gray-900"></div>
      
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
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* 🔥 모바일 가시성 개선 - 흑색 바탕에 흰색 텍스트 */}
          <section className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
            
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 left-5 w-20 h-20 bg-blue-400 rounded-full blur-xl"></div>
              <div className="absolute top-20 right-10 w-32 h-32 bg-purple-400 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-indigo-400 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative z-10 py-8 lg:py-12 px-6">
              <div className="text-center">
                {/* 메인 타이틀 - 흰색 텍스트 */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
                  <span className="block">🧮 M-CENTER 전문 세금계산기</span>
                </h1>
                
                {/* 간단한 소개 문구 - 밝은 회색 텍스트 */}
                <p className="text-lg lg:text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
                  2024년 최신 세법을 반영한 11개 전문 계산기로 정확한 세금 계산을 지원합니다
                </p>
                
                {/* 추가 정보 */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>2024년 세법 반영</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span>정확한 계산</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-purple-400" />
                    <span>11개 전문 계산기</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                         stockTransferCalculator.id === selectedCalculator ? stockTransferCalculator.title : '세금계산기'}
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
                    <span className="hidden sm:inline">단계별 입력 가이드 제공</span>
                  </div>
                </div>
              </div>
              
              {renderSelectedCalculator()}
            </div>
          ) : (
            // 계산기 선택 화면
            <div className="w-full">
              {/* 🔥 모바일 가시성 개선 - 흑색 바탕에 흰색 텍스트 */}
              <div className="mb-12 md:mb-16">
                {/* 깔끔한 제목 - 흰색 텍스트 */}
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="text-3xl md:text-4xl font-light text-white mb-3 tracking-tight">세금계산기</h3>
                  <p className="text-lg text-gray-300 font-light">필요한 계산기를 선택해주세요</p>
                </div>
                
                {/* 🔥 흑색 바탕에 흰색 텍스트로 개선된 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                  <button 
                    onClick={() => setActiveTab('personal')}
                    className={`group relative bg-gray-800 border border-gray-600 rounded-2xl p-6 md:p-8 
                              hover:border-blue-400/80 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-700
                              transition-all duration-300 cursor-pointer text-left h-auto min-h-[200px] flex flex-col justify-between
                              mobile-safe-click mobile-touch-feedback
                              ${activeTab === 'personal' 
                                ? 'border-blue-400 shadow-xl bg-blue-900/30 ring-2 ring-blue-400/50' 
                                : 'border-gray-600'}`}
                    // 🔥 개선된 모바일 터치 최적화
                    onTouchStart={(e) => {
                      console.log('📱 개인세금 탭 터치 시작');
                      e.currentTarget.style.transform = 'scale(0.95)';
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                      if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    onTouchEnd={(e) => {
                      console.log('📱 개인세금 탭 터치 종료');
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                      // 터치 종료 시 명시적으로 탭 변경 실행
                      setTimeout(() => {
                        console.log('🎯 개인세금 탭 선택 실행');
                        setActiveTab('personal');
                      }, 50);
                    }}
                    onTouchCancel={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    // 키보드 접근성
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        console.log('⌨️ 키보드로 개인세금 탭 선택');
                        setActiveTab('personal');
                      }
                    }}
                    aria-label="개인세금 계산기 탭 선택"
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div className="mb-6">
                        <User className={`w-10 h-10 transition-colors duration-300 ${
                          activeTab === 'personal' 
                            ? 'text-blue-400' 
                            : 'text-gray-300 group-hover:text-blue-400'
                        }`} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">개인세금</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        근로소득세, 종합소득세<br />
                        양도·상속·증여세
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="text-xs text-gray-400 font-medium">PERSONAL TAX</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('corporate')}
                    className={`group relative bg-gray-800 border border-gray-600 rounded-2xl p-6 md:p-8 
                              hover:border-green-400/80 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-700
                              transition-all duration-300 cursor-pointer text-left h-auto min-h-[200px] flex flex-col justify-between
                              mobile-safe-click mobile-touch-feedback
                              ${activeTab === 'corporate' 
                                ? 'border-green-400 shadow-xl bg-green-900/30 ring-2 ring-green-400/50' 
                                : 'border-gray-600'}`}
                    // 🔥 개선된 모바일 터치 최적화
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.05)';
                      if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    onTouchCancel={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    // 키보드 접근성
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab('corporate');
                      }
                    }}
                    aria-label="법인세금 계산기 탭 선택"
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div className="mb-6">
                        <Building2 className={`w-10 h-10 transition-colors duration-300 ${
                          activeTab === 'corporate' 
                            ? 'text-green-400' 
                            : 'text-gray-300 group-hover:text-green-400'
                        }`} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">법인세금</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        법인세, 부가가치세<br />
                        원천징수세
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="text-xs text-gray-400 font-medium">CORPORATE TAX</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('business-inheritance')}
                    className={`group relative bg-gray-800 border border-gray-600 rounded-2xl p-6 md:p-8 
                              hover:border-violet-400/80 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-700
                              transition-all duration-300 cursor-pointer text-left h-auto min-h-[200px] flex flex-col justify-between
                              mobile-safe-click mobile-touch-feedback
                              ${activeTab === 'business-inheritance' 
                                ? 'border-violet-400 shadow-xl bg-violet-900/30 ring-2 ring-violet-400/50' 
                                : 'border-gray-600'}`}
                    // 🔥 개선된 모바일 터치 최적화
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.05)';
                      if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    onTouchCancel={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    // 키보드 접근성
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab('business-inheritance');
                      }
                    }}
                    aria-label="가업상속세 계산기 탭 선택"
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div className="mb-6">
                        <Crown className={`w-10 h-10 transition-colors duration-300 ${
                          activeTab === 'business-inheritance' 
                            ? 'text-violet-400' 
                            : 'text-gray-300 group-hover:text-violet-400'
                        }`} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">가업상속세</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        중소기업 가업승계<br />
                        최대 500억 공제
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="text-xs text-gray-400 font-medium">BUSINESS SUCCESSION</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('stock-transfer')}
                    className={`group relative bg-gray-800 border border-gray-600 rounded-2xl p-6 md:p-8 
                              hover:border-rose-400/80 hover:shadow-xl hover:-translate-y-1 hover:bg-gray-700
                              transition-all duration-300 cursor-pointer text-left h-auto min-h-[200px] flex flex-col justify-between
                              mobile-safe-click mobile-touch-feedback
                              ${activeTab === 'stock-transfer' 
                                ? 'border-rose-400 shadow-xl bg-rose-900/30 ring-2 ring-rose-400/50' 
                                : 'border-gray-600'}`}
                    // 🔥 개선된 모바일 터치 최적화
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.95)';
                      e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.05)';
                      if (navigator.vibrate) navigator.vibrate(20);
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    onTouchCancel={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '';
                    }}
                    // 키보드 접근성
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveTab('stock-transfer');
                      }
                    }}
                    aria-label="주식이동세 계산기 탭 선택"
                    role="button"
                    tabIndex={0}
                  >
                    <div>
                      <div className="mb-6">
                        <TrendingUp className={`w-10 h-10 transition-colors duration-300 ${
                          activeTab === 'stock-transfer' 
                            ? 'text-rose-400' 
                            : 'text-gray-300 group-hover:text-rose-400'
                        }`} />
                      </div>
                      <h4 className="text-xl font-semibold text-white mb-3 tracking-tight">주식이동세</h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        주식 매매시<br />
                        양도소득세 계산
                      </p>
                    </div>
                    <div className="pt-4">
                      <div className="text-xs text-gray-400 font-medium">STOCK TRANSFER</div>
                    </div>
                  </button>
                </div>
                
                {/* 선택된 카테고리 안내 - 흑색 바탕 개선 */}
                <div className="text-center mt-12">
                  <div className="inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-200">
                      {activeTab === 'personal' && '개인 납세자용 계산기'}
                      {activeTab === 'corporate' && '법인 사업자용 계산기'}
                      {activeTab === 'business-inheritance' && '가업상속공제 전문 계산기'}
                      {activeTab === 'stock-transfer' && '주식양도소득세 전문 계산기'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 탭 컨텐츠 - 흑색 바탕 개선 */}
              {activeTab === 'personal' && (
                <div className="space-y-8 mt-12">
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-600 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-blue-900/50 rounded-2xl flex items-center justify-center border border-blue-700">
                        <User className="w-7 h-7 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">개인세금 계산기</h2>
                        <p className="text-gray-300 text-lg font-light mt-1">개인 납세자를 위한 정확한 세금 계산</p>
                      </div>
                    </div>
                    <CalculatorSelector 
                      calculators={personalTaxCalculators}
                      onSelect={handleCalculatorSelect}
                      selectedId={selectedCalculator}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'corporate' && (
                <div className="space-y-8 mt-12">
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-600 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-green-900/50 rounded-2xl flex items-center justify-center border border-green-700">
                        <Building2 className="w-7 h-7 text-green-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">법인세금 계산기</h2>
                        <p className="text-gray-300 text-lg font-light mt-1">법인 사업자를 위한 전문 세금 계산</p>
                      </div>
                    </div>
                    <CalculatorSelector 
                      calculators={corporateTaxCalculators}
                      onSelect={handleCalculatorSelect}
                      selectedId={selectedCalculator}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'business-inheritance' && (
                <div className="space-y-8 mt-12">
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-600 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-violet-900/50 rounded-2xl flex items-center justify-center border border-violet-700">
                        <Crown className="w-7 h-7 text-violet-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">가업상속세금 계산기</h2>
                        <p className="text-gray-300 text-lg font-light mt-1">중소기업 가업상속공제 전문 계산</p>
                      </div>
                    </div>
                    <SingleCalculatorDisplay 
                      calculator={businessInheritanceCalculator}
                      onSelect={handleCalculatorSelect}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'stock-transfer' && (
                <div className="space-y-8 mt-12">
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-600 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-rose-900/50 rounded-2xl flex items-center justify-center border border-rose-700">
                        <TrendingUp className="w-7 h-7 text-rose-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">주식이동세금 계산기</h2>
                        <p className="text-gray-300 text-lg font-light mt-1">주식 양도소득세 전문 계산</p>
                      </div>
                    </div>
                    <SingleCalculatorDisplay 
                      calculator={stockTransferCalculator}
                      onSelect={handleCalculatorSelect}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 세금계산기 특징 카드들 - 모바일 최적화 (계산기가 선택되지 않았을 때만 표시) */}
          {!selectedCalculator && (
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
          )}

          {/* 법적 면책 조항 - 250자 요약본 (계산기가 선택되지 않았을 때만 표시) */}
          {!selectedCalculator && (
            <div className="mb-12 md:mb-16">
              <TaxCalculatorDisclaimer variant="summary" />
            </div>
          )}
        </div>
      </div>
      
      {/* 🚨 통합 오류신고 섹션 - 모든 세금계산기 아래에 하나만 배치 */}
      <div className="mt-16 mb-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 md:p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bug className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-3">M-CENTER 전문 세금계산기</h2>
          <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-400 rounded-full px-4 py-2 mb-4">
            <Bug className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">BETA 테스트 진행 중 - 오류 신고 환영!</span>
          </div>
          <p className="text-red-700 text-lg">
            계산 오류나 개선사항이 있으시면 언제든 신고해주세요
          </p>
        </div>

        {/* 베타 테스트 중요 안내 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-orange-200">
          <h3 className="text-xl font-bold mb-4 text-red-600 text-center">
            <span>🚨 중요 안내: 베타 테스트 중</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">현재 베타 테스트 단계입니다</p>
                <p className="text-gray-600 text-sm">계산 결과는 참고용이며, 실제 세무신고 시 전문가 검토를 권장합니다</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">2024년 최신 세법 반영</p>
                <p className="text-gray-600 text-sm">11개 전문 계산기로 정확한 세금 계산을 지원합니다</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 오류신고 카드 */}
          <Card className="border-red-300 bg-white/80">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-800">🚨 계산 오류 신고</CardTitle>
              <CardDescription className="text-red-600">
                잘못된 계산 결과나 시스템 오류를 발견하셨나요?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={scrollToErrorReport}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                size="lg"
              >
                <Bug className="w-5 h-5 mr-2" />
                지금 바로 오류신고하기
              </Button>
            </CardContent>
          </Card>
          
          {/* 베타피드백 카드 */}
          <Card className="border-orange-300 bg-white/80">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-orange-800">💡 개선 제안</CardTitle>
              <CardDescription className="text-orange-600">
                더 나은 서비스를 위한 아이디어나 의견을 들려주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div id="beta-feedback-section">
                <BetaFeedbackForm 
                  calculatorName={
                    selectedCalculator 
                      ? (personalTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
                         corporateTaxCalculators.find(c => c.id === selectedCalculator)?.title ||
                         businessInheritanceCalculator.id === selectedCalculator ? businessInheritanceCalculator.title :
                         stockTransferCalculator.id === selectedCalculator ? stockTransferCalculator.title : '세금계산기')
                      : '세금계산기'
                  }
                  calculatorType="tax"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 연락처 정보 및 처리 절차 */}
        <div className="mt-6 p-4 bg-white/60 rounded-lg border border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-3">
              <strong>📋 처리 절차:</strong> 24시간 내 접수 → 1-2일 검토 → 이메일로 결과 회신
            </p>
            <p className="mb-2">
              <strong>긴급 문의:</strong> 심각한 오류나 즉시 해결이 필요한 문제는
            </p>
            <p>
              📧 <strong>hongik423@gmail.com</strong> 또는 
              📞 <strong>010-9251-9743</strong>으로 연락주세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 