'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Calculator, 
  TrendingUp, 
  Calendar,
  Percent,
  DollarSign,
  Plus,
  Trash2,
  Info,
  Target,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { InvestmentInput } from '@/lib/utils/investment-analysis';
import MobileNumberInput from '@/components/ui/mobile-number-input';

const formSchema = z.object({
  initialInvestment: z.number().min(0, '초기 투자금은 0 이상이어야 합니다'),
  policyFundAmount: z.number().min(0, '정책자금은 0 이상이어야 합니다'),
  interestRate: z.number().min(0).max(100, '대출금리는 0-100% 사이여야 합니다'),
  loanPeriod: z.number().min(1).max(30, '대출기간은 1-30년 사이여야 합니다'),
  gracePeriod: z.number().min(0).max(10, '거치기간은 0-10년 사이여야 합니다'),
  operatingProfitRate: z.number().min(-100).max(200, '영업이익률은 -100-200% 사이여야 합니다'),
  taxRate: z.number().min(0).max(50, '세율은 0-50% 사이여야 합니다'),
  discountRate: z.number().min(0).max(50, '할인율은 0-50% 사이여야 합니다'),
  analysisYears: z.number().min(1).max(30, '분석기간은 1-30년 사이여야 합니다'),
  // 새로운 NPP/IRR 최적화 변수들
  revenueGrowthRate: z.number().min(-50).max(100, '매출성장률은 -50-100% 사이여야 합니다'),
  marketPenetrationRate: z.number().min(0).max(100, '시장점유율은 0-100% 사이여야 합니다'),
  customerRetentionRate: z.number().min(0).max(100, '고객유지율은 0-100% 사이여야 합니다'),
  // 시나리오 분석 추가
  scenarioType: z.enum(['pessimistic', 'neutral', 'optimistic'], {
    required_error: '시나리오를 선택해주세요'
  }),
  scenarioAdjustmentRate: z.number().min(-50).max(50, '시나리오 조정율은 -50-50% 사이여야 합니다'),
  // 재무구조 분석 추가
  debtRatio: z.number().min(0).max(500, '부채비율은 0-500% 사이여야 합니다'),
  workingCapitalRatio: z.number().min(0).max(50, '운전자본비율은 0-50% 사이여야 합니다'),
});

interface InvestmentInputFormProps {
  onSubmit: (data: InvestmentInput) => void;
  isLoading?: boolean;
}

export default function InvestmentInputForm({ onSubmit, isLoading }: InvestmentInputFormProps) {
  // 초기 매출값을 실제 값으로 설정 (125억원)
  const [annualRevenues, setAnnualRevenues] = useState<number[]>([
    12500000000, 12500000000, 12500000000, 12500000000, 12500000000,
    12500000000, 12500000000, 12500000000, 12500000000, 12500000000
  ]);
  const [calculatedCosts, setCalculatedCosts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // 🔥 모바일 디바이스 감지
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🔥 모바일 키보드 감지 및 뷰포트 조정
  useEffect(() => {
    if (!isMobile) return;

    const initialViewportHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      const threshold = 150; // 키보드가 올라왔다고 판단하는 기준

      if (heightDifference > threshold) {
        setKeyboardOpen(true);
        document.body.classList.add('keyboard-open');
      } else {
        setKeyboardOpen(false);
        document.body.classList.remove('keyboard-open');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('keyboard-open');
    };
  }, [isMobile]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialInvestment: 9500000000, // 95억원 (이미지와 동일)
      policyFundAmount: 8000000000, // 80억 (이미지와 동일)
      interestRate: 5.6, // 5.6% (이미지와 동일)
      loanPeriod: 7,
      gracePeriod: 2,
      operatingProfitRate: 14, // 영업이익률 14% (이미지와 동일)
      taxRate: 22,
      discountRate: 10, // 할인율 10% (이미지와 동일)
      analysisYears: 9, // 9년 (이미지와 동일)
      revenueGrowthRate: 10, // 매출성장률 10%
      marketPenetrationRate: 20, // 시장점유율 20%
      customerRetentionRate: 90, // 고객유지율 90%
      scenarioType: 'neutral',
      scenarioAdjustmentRate: 0,
      debtRatio: 88, // 부채비율 88% (이미지와 동일)
      workingCapitalRatio: 5,
    },
  });

  // 분석 기간 변경 시 연도별 매출 데이터 자동 조정
  const analysisYears = form.watch('analysisYears');
  
  useEffect(() => {
    const currentLength = annualRevenues.length;
    const targetLength = analysisYears;
    
    if (currentLength !== targetLength) {
      const newRevenues = Array.from({ length: targetLength }, (_, i) => 
        i < currentLength ? annualRevenues[i] : 0
      );
      const newCosts = Array.from({ length: targetLength }, (_, i) => 
        i < calculatedCosts.length ? calculatedCosts[i] : 0
      );
      
      setAnnualRevenues(newRevenues);
      setCalculatedCosts(newCosts);
    }
  }, [analysisYears]);

  // 영업이익률 기반 연간비용 자동계산 알고리즘
  const calculateAnnualCosts = () => {
    const operatingProfitRate = form.getValues('operatingProfitRate');
    const newCalculatedCosts = annualRevenues.map(revenue => {
      if (revenue > 0) {
        // 연간비용 = 매출액 * (1 - 영업이익률/100)
        return revenue * (1 - operatingProfitRate / 100);
      }
      return 0;
    });
    setCalculatedCosts(newCalculatedCosts);
  };

  // 매출 또는 영업이익률 변경 시 연간비용 자동계산
  useEffect(() => {
    calculateAnnualCosts();
  }, [annualRevenues, form.watch('operatingProfitRate')]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('📝 폼 제출 값:', values);
    console.log('💰 연간 매출 데이터:', annualRevenues);
    
    const input: InvestmentInput = {
      ...values,
      annualRevenue: annualRevenues.slice(0, values.analysisYears), // 분석 기간에 맞춰 자르기
      operatingCostRate: 100 - values.operatingProfitRate, // 호환성을 위해 변환
      // 새로운 NPP/IRR 최적화 변수들
      revenueGrowthRate: values.revenueGrowthRate,
      marketPenetrationRate: values.marketPenetrationRate,
      customerRetentionRate: values.customerRetentionRate,
      scenarioType: values.scenarioType,
      scenarioAdjustmentRate: values.scenarioAdjustmentRate,
      debtRatio: values.debtRatio,
      workingCapitalRatio: values.workingCapitalRatio,
    };
    
    console.log('📊 최종 투자분석 입력값:', input);
    onSubmit(input);
  };

  const updateRevenue = (index: number, value: number) => {
    const newRevenues = [...annualRevenues];
    newRevenues[index] = value;
    setAnnualRevenues(newRevenues);
  };

  // 개선된 숫자 입력 처리 함수
  const handleNumberInput = (value: string, onChange: (value: number) => void) => {
    // 빈 문자열인 경우 그대로 유지 (0으로 강제 변환하지 않음)
    if (value === '' || value === undefined || value === null) {
      // 빈 값은 사용자가 입력할 수 있도록 그대로 두고, 최종적으로만 0으로 처리
      return;
    }
    
    // 숫자가 아닌 문자 제거
    const cleanValue = value.replace(/[^0-9.-]/g, '');
    
    // 숫자로 변환
    const numValue = parseFloat(cleanValue);
    
    // 유효한 숫자인 경우에만 업데이트
    if (!isNaN(numValue) && isFinite(numValue)) {
      onChange(numValue);
    } else if (cleanValue === '-') {
      // 음수 입력 중인 경우 그대로 유지
      return;
    } else if (cleanValue === '') {
      // 완전히 삭제된 경우만 0으로 설정
      onChange(0);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // 억원 단위로 표시하는 함수
  const formatToEokWon = (value: number) => {
    return `${(value / 100000000).toFixed(1)}억원`;
  };

  return (
    <TooltipProvider>
      <div className={`${isMobile ? 'mobile-optimized' : ''} ${keyboardOpen ? 'keyboard-active' : ''}`}>
        <style jsx global>{`
          .mobile-optimized {
            /* 모바일 최적화 전역 스타일 */
            -webkit-text-size-adjust: 100%;
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
          }
          
          .keyboard-active {
            /* 키보드 활성화 시 스크롤 최적화 */
            height: 100vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .mobile-touch-area {
            min-height: 48px;
            min-width: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-input-field {
            font-size: 16px !important; /* iOS 줌 방지 */
            border-radius: 12px;
            padding: 16px;
            border: 2px solid #e2e8f0;
            transition: all 0.2s ease;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .mobile-input-field:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: scale(1.02);
          }
          
          .mobile-button {
            min-height: 56px;
            padding: 16px 24px;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .mobile-button:active {
            transform: scale(0.98);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
          
          .mobile-card {
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
            border: 1px solid #e2e8f0;
          }
          
          @media (max-width: 768px) {
            .mobile-card {
              margin: 16px;
              padding: 20px;
            }
          }
        `}</style>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
            {/* 🔥 모바일 최적화된 핵심 분석 조건 */}
            <div className={`mobile-card bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 ${isMobile ? 'mx-2' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-800">🔥 핵심 NPV/IRR 분석 조건</h3>
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <AlertTriangle className="w-4 h-4" />
                <span>투자 성과에 가장 큰 영향을 미치는 핵심 변수들</span>
              </div>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
              <FormField
                control={form.control}
                name="analysisYears"
                render={({ field }) => (
                  <FormItem className={isMobile ? 'mb-6' : ''}>
                    <FormLabel className={`flex items-center font-semibold text-blue-700 ${isMobile ? 'text-lg mb-3' : ''}`}>
                      📅 분석 기간 (NPV/IRR 계산)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={`${isMobile ? 'w-5 h-5 ml-2' : 'w-4 h-4 ml-1'} text-blue-400 mobile-touch-area`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>NPV와 IRR을 계산할 전체 기간 (연도별 매출 데이터가 자동 조정됩니다)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="9"
                        suffix="년"
                        autoComma={false}
                        minValue={1}
                        maxValue={30}
                        className={`${isMobile ? 'mobile-input-field text-xl' : ''} font-semibold text-blue-700 border-2 border-blue-300`}
                        mobileOptimized={true}
                        style={isMobile ? {
                          fontSize: '18px',
                          minHeight: '56px',
                          padding: '16px',
                          borderRadius: '12px'
                        } : undefined}
                      />
                    </FormControl>
                    <FormDescription className={`text-blue-600 ${isMobile ? 'text-base mt-3' : ''}`}>
                      현재 설정: {field.value}년간 분석 ({field.value}년 매출 데이터 필요)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountRate"
                render={({ field }) => (
                  <FormItem className={isMobile ? 'mb-6' : ''}>
                    <FormLabel className={`flex items-center font-semibold text-blue-700 ${isMobile ? 'text-lg mb-3' : ''}`}>
                      📊 할인율 (WACC)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={`${isMobile ? 'w-5 h-5 ml-2' : 'w-4 h-4 ml-1'} text-blue-400 mobile-touch-area`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>NPV 계산에 사용되는 할인율 (가중평균자본비용)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="10"
                        suffix="%"
                        allowDecimals={true}
                        autoComma={false}
                        minValue={0}
                        maxValue={50}
                        className={`${isMobile ? 'mobile-input-field text-xl' : ''} font-semibold text-blue-700 border-2 border-blue-300`}
                        mobileOptimized={true}
                        style={isMobile ? {
                          fontSize: '18px',
                          minHeight: '56px',
                          padding: '16px',
                          borderRadius: '12px'
                        } : undefined}
                      />
                    </FormControl>
                    <FormDescription className={`text-blue-600 ${isMobile ? 'text-base mt-3' : ''}`}>
                      현재 설정: {formatPercent(field.value)}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operatingProfitRate"
                render={({ field }) => (
                  <FormItem className={isMobile ? 'mb-6' : ''}>
                    <FormLabel className={`flex items-center font-semibold text-blue-700 ${isMobile ? 'text-lg mb-3' : ''}`}>
                      💰 영업이익률 (핵심)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={`${isMobile ? 'w-5 h-5 ml-2' : 'w-4 h-4 ml-1'} text-blue-400 mobile-touch-area`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>매출 대비 영업이익 비율 (연간비용 자동계산에 사용)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="14"
                        suffix="%"
                        allowDecimals={true}
                        autoComma={false}
                        minValue={-100}
                        maxValue={200}
                        className={`${isMobile ? 'mobile-input-field text-xl' : ''} font-semibold text-blue-700 border-2 border-blue-300`}
                        mobileOptimized={true}
                        style={isMobile ? {
                          fontSize: '18px',
                          minHeight: '56px',
                          padding: '16px',
                          borderRadius: '12px'
                        } : undefined}
                      />
                    </FormControl>
                    <FormDescription className={`text-blue-600 ${isMobile ? 'text-base mt-3 font-medium' : ''}`}>
                      현재 설정: {formatPercent(field.value)} {isMobile && '(높은 성장 기업은 200% 이상도 가능)'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* 🔥 모바일 최적화된 초기 투자 정보 */}
          <div className={`mobile-card ${isMobile ? 'mx-2' : ''}`}>
            <h3 className={`${isMobile ? 'text-xl' : 'text-lg'} font-semibold mb-6 flex items-center text-gray-800`}>
              <DollarSign className={`${isMobile ? 'w-6 h-6 mr-3' : 'w-5 h-5 mr-2'}`} />
              💎 초기 투자 정보
            </h3>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
              <FormField
                control={form.control}
                name="initialInvestment"
                render={({ field }) => (
                  <FormItem className={isMobile ? 'mb-8' : ''}>
                    <FormLabel className={`flex items-center ${isMobile ? 'text-lg mb-3 font-bold text-green-700' : ''}`}>
                      💎 초기 투자금
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={`${isMobile ? 'w-5 h-5 ml-2' : 'w-4 h-4 ml-1'} text-gray-400 mobile-touch-area`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>사업 시작에 필요한 자기자본 투자금액 (NPV 계산의 기준점)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="9,500,000,000"
                        suffix="원"
                        displayUnit="억원"
                        unitDivider={100000000}
                        className={`${isMobile ? 'mobile-input-field' : ''} text-lg font-semibold border-2 border-green-300 focus:border-green-500`}
                        mobileOptimized={true}
                        autoComma={true}
                        style={isMobile ? {
                          fontSize: '20px',
                          minHeight: '64px',
                          padding: '20px',
                          borderRadius: '16px',
                          fontWeight: 'bold'
                        } : undefined}
                      />
                    </FormControl>
                    {isMobile && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-700 text-sm font-medium">
                          💡 억원 단위로 자동 변환됩니다
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policyFundAmount"
                render={({ field }) => (
                  <FormItem className={isMobile ? 'mb-8' : ''}>
                    <FormLabel className={`flex items-center ${isMobile ? 'text-lg mb-3 font-bold text-blue-700' : ''}`}>
                      🏛️ 정책자금 규모
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className={`${isMobile ? 'w-5 h-5 ml-2' : 'w-4 h-4 ml-1'} text-gray-400 mobile-touch-area`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>정부 또는 공공기관에서 지원받는 정책자금 (현금흐름 계산에 반영)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="8,000,000,000"
                        suffix="원"
                        displayUnit="억원"
                        unitDivider={100000000}
                        className={`${isMobile ? 'mobile-input-field' : ''} border-2 border-blue-300 focus:border-blue-500`}
                        mobileOptimized={true}
                        autoComma={true}
                        style={isMobile ? {
                          fontSize: '20px',
                          minHeight: '64px',
                          padding: '20px',
                          borderRadius: '16px',
                          fontWeight: 'bold'
                        } : undefined}
                      />
                    </FormControl>
                    {isMobile && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-700 text-sm font-medium">
                          🏛️ 정부 지원 정책자금 금액
                        </p>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="analysisYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center font-semibold text-red-700">
                      📅 평가 기간 (필수) ⚠️
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-red-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>⚠️ NPV/IRR 계산에 필수적인 분석 기간! 연도별 매출 데이터 길이가 자동 조정됩니다</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="10"
                          value={field.value === 0 ? '0' : field.value || ''}
                          onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                          onFocus={(e) => e.target.select()}
                          className="pr-10 text-lg font-bold border-2 border-red-300 focus:border-red-500 bg-red-50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-red-500 font-bold">
                          년
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-red-600 font-bold">
                      ⚠️ 현재 설정: {field.value}년간 분석 ({field.value}년 매출 데이터 필요)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* 대출 조건 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Percent className="w-5 h-5 mr-2" />
              대출 조건
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      대출금리
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>정책자금 대출에 적용되는 연이자율</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="5.6"
                        suffix="%"
                        allowDecimals={true}
                        autoComma={false}
                        className="border-2 border-orange-300 focus:border-orange-500"
                        mobileOptimized={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loanPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>대출 기간</FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="7"
                        suffix="년"
                        autoComma={false}
                        minValue={1}
                        maxValue={30}
                        className="border-2 border-orange-300 focus:border-orange-500"
                        mobileOptimized={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gracePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>거치 기간</FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="2"
                        suffix="년"
                        autoComma={false}
                        minValue={0}
                        maxValue={10}
                        className="border-2 border-orange-300 focus:border-orange-500"
                        mobileOptimized={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* 수익성 분석 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              수익성 분석 ({analysisYears}년간)
            </h3>
            
            {/* 매출성장률 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                control={form.control}
                name="revenueGrowthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      매출성장률 (연간 CAGR)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>연간 매출 CAGR증가율 (복합연간성장률) - 일반 기업 5-15%, 급성장 기업 20-100%</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="10"
                        suffix="%"
                        allowDecimals={true}
                        autoComma={false}
                        minValue={-50}
                        maxValue={100}
                        className="border-2 border-purple-300 focus:border-purple-500"
                        mobileOptimized={true}
                      />
                    </FormControl>
                    <FormDescription>
                      매출 CAGR증가율: 일반 기업 5-15%, 급성장 기업 20-100%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>법인세율</FormLabel>
                    <FormControl>
                      <MobileNumberInput
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="22"
                        suffix="%"
                        allowDecimals={true}
                        autoComma={false}
                        minValue={0}
                        maxValue={50}
                        className="border-2 border-gray-300 focus:border-gray-500"
                        mobileOptimized={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 연도별 매출 및 자동계산된 비용 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  {analysisYears}년간 연도별 매출 및 자동계산된 연간비용
                </Label>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    연간비용 = 매출액 × (1 - 영업이익률/100)
                  </span>
                </div>
              </div>
              
              {annualRevenues.slice(0, analysisYears).map((revenue, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-12">{index + 1}년차</span>
                      <Label className="text-sm">매출액</Label>
                    </div>
                    <MobileNumberInput
                      value={revenue || ''}
                      onChange={(value) => updateRevenue(index, value)}
                      placeholder="12,500,000,000"
                      suffix="원"
                      displayUnit="억원"
                      unitDivider={100000000}
                      className="border-2 border-gray-300 focus:border-blue-500"
                      mobileOptimized={true}
                      autoComma={true}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm text-blue-600">자동계산된 연간비용</Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={calculatedCosts[index] ? formatCurrency(calculatedCosts[index]) : '0원'}
                        disabled
                        className="bg-blue-50 text-blue-700 font-medium"
                      />
                    </div>
                    <div className="text-xs text-blue-600">
                      영업이익률 {formatPercent(form.watch('operatingProfitRate'))} 기준
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* 고급 NPP/IRR 분석 설정 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Target className="w-5 h-5 mr-2" />
                고급 NPP/IRR 분석 설정
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
              >
                {showAdvancedInputs ? '간단히 보기' : '고급 설정'}
              </Button>
            </div>

            {showAdvancedInputs && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="marketPenetrationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        시장점유율
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>목표 시장에서 차지할 예상 점유율</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="5"
                            value={field.value === 0 ? '0' : field.value || ''}
                            onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                            onFocus={(e) => e.target.select()}
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerRetentionRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        고객유지율
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>기존 고객을 유지할 수 있는 비율</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="85"
                            value={field.value === 0 ? '0' : field.value || ''}
                            onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                            onFocus={(e) => e.target.select()}
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            %
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* 시나리오 분석 선택 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              시나리오 분석 선택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="scenarioType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      시나리오 분석 선택
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>투자 분석에 적용할 시나리오를 선택하세요</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="시나리오를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pessimistic">📉 비관적 시나리오</SelectItem>
                          <SelectItem value="neutral">➡️ 중립적 시나리오</SelectItem>
                          <SelectItem value="optimistic">📈 낙관적 시나리오</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scenarioAdjustmentRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      시나리오 조정율
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>선택한 시나리오에 따른 매출/비용 조정율 (-50% ~ +50%)</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={field.value === 0 ? '0' : field.value || ''}
                          onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                          onFocus={(e) => e.target.select()}
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      비관적: -10~-30%, 중립적: 0%, 낙관적: +10~+30%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* 재무구조 분석 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Percent className="w-5 h-5 mr-2" />
              재무구조 분석
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="debtRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      부채비율
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>부채 대비 자본의 비율 (부채/자기자본 × 100) - 상한 500%까지 가능</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={field.value === 0 ? '0' : field.value || ''}
                          onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                          onFocus={(e) => e.target.select()}
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      부채/자기자본 비율 (0-500% 입력 가능)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workingCapitalRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      운전자본비율
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>매출 대비 운전자본 비율 - 운전자본은 유동자산에서 유동부채를 뺀 순운전자본으로, 일상적인 영업활동에 필요한 자금을 의미합니다. 일반적으로 매출의 5-15% 수준입니다.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="5"
                          value={field.value === 0 ? '0' : field.value || ''}
                          onChange={(e) => handleNumberInput(e.target.value, field.onChange)}
                          onFocus={(e) => e.target.select()}
                          className="pr-10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      매출 대비 운전자본 비율 (순운전자본/매출 × 100) - 일반적으로 5-15%
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 🔥 모바일 최적화된 제출 버튼 */}
          <div className={`${isMobile ? 'fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-50' : ''}`}>
            <Button 
              type="submit" 
              className={`w-full ${isMobile ? 'mobile-button h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`} 
              size="lg" 
              disabled={isLoading}
              style={isMobile ? {
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: 'bold',
                minHeight: '64px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              } : undefined}
            >
              {isLoading ? (
                <>
                  <Calculator className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} mr-3 animate-spin`} />
                  {isMobile ? '분석 중...' : `${analysisYears}년간 NPV/IRR 분석 중...`}
                </>
              ) : (
                <>
                  <Calculator className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} mr-3`} />
                  {isMobile ? '투자분석 시작 🚀' : `${analysisYears}년간 NPV/IRR 투자 분석 시작`}
                </>
              )}
            </Button>
            
            {/* 모바일 하단 여백 (Safe Area) */}
            {isMobile && <div className="h-4"></div>}
          </div>
          
          {/* 모바일에서 하단 버튼 공간 확보 */}
          {isMobile && <div className="h-24"></div>}
        </form>
      </Form>
      </div>
    </TooltipProvider>
  );
} 