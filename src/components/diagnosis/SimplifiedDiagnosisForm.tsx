'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building, 
  User, 
  Users, 
  MapPin,
  AlertCircle,
  Star,
  Loader2,
  CheckCircle,
  FileText,
  Brain
} from 'lucide-react';

// 간소화된 폼 검증 스키마 (8개 핵심 필드)
const simplifiedFormSchema = z.object({
  companyName: z.string().min(2, '회사명을 입력해주세요'),
  industry: z.string().min(1, '업종을 선택해주세요'),
  contactManager: z.string().min(2, '담당자명을 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요').min(1, '이메일을 입력해주세요'),
  employeeCount: z.string().min(1, '직원수를 선택해주세요'),
  growthStage: z.string().min(1, '성장단계를 선택해주세요'),
  businessLocation: z.string().min(1, '사업장을 선택해주세요'),
  mainConcerns: z.string().min(20, '고민사항을 구체적으로 입력해주세요 (최소 20자)'),
  expectedBenefits: z.string().min(10, '예상 혜택을 입력해주세요 (최소 10자)'),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: '개인정보 수집 및 이용에 동의해주세요',
  }),
});

type SimplifiedFormData = z.infer<typeof simplifiedFormSchema>;

interface SimplifiedDiagnosisFormProps {
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export default function SimplifiedDiagnosisForm({ onComplete, onBack }: SimplifiedDiagnosisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm<SimplifiedFormData>({
    resolver: zodResolver(simplifiedFormSchema),
    defaultValues: {
      companyName: '',
      industry: '',
      contactManager: '',
      email: '',
      employeeCount: '',
      growthStage: '',
      businessLocation: '',
      mainConcerns: '',
      expectedBenefits: '',
      privacyConsent: false,
    },
  });

  const onSubmit = async (data: SimplifiedFormData) => {
    setIsSubmitting(true);
    setEstimatedTime(180); // 3분 예상 시간

    try {
      // 1단계: 데이터 준비
      setProcessingStage('📊 기업 정보를 분석하고 있습니다...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 2단계: AI 진단 처리
      setProcessingStage('🤖 AI가 맞춤형 진단을 수행하고 있습니다...');
      setEstimatedTime(120);

      const response = await fetch('/api/simplified-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          submitDate: new Date().toLocaleString('ko-KR'),
        }),
      });

      if (!response.ok) {
        throw new Error('진단 처리 중 오류가 발생했습니다.');
      }

      const results = await response.json();

      // 3단계: 보고서 생성
      setProcessingStage('📋 2000자 요약 보고서를 생성하고 있습니다...');
      setEstimatedTime(60);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4단계: 완료
      setProcessingStage('✅ 진단이 완료되었습니다!');
      setEstimatedTime(0);

      if (results.success) {
        // 이메일 발송 결과에 따른 토스트 메시지
        if (results.data.emailSent) {
          toast({
            title: '🎉 AI 진단이 완료되었습니다!',
            description: '📧 신청 확인 이메일을 발송해드렸습니다. 2000자 요약 보고서가 생성되었습니다.',
          });
        } else {
          toast({
            title: '🎉 AI 진단이 완료되었습니다!',
            description: '2000자 요약 보고서가 생성되었습니다. (이메일 발송은 실패했지만 진단은 완료되었습니다)',
          });
        }

        setTimeout(() => {
          onComplete({
            ...data,
            results: results,
            submitSuccess: true,
            emailSent: results.data.emailSent,
          });
        }, 1500);

      } else {
        throw new Error(results.error || '진단 처리 실패');
      }

    } catch (error) {
      console.error('진단 신청 처리 오류:', error);
      setProcessingStage('❌ 처리 중 오류가 발생했습니다.');
      setEstimatedTime(0);
      
      toast({
        title: '❌ 진단 처리 중 오류가 발생했습니다',
        description: '잠시 후 다시 시도해주시거나 전화로 연락 주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 진단 처리 중 UI
  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto relative">
              <Brain className="w-10 h-10 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                🤖 AI 기업 진단 진행 중
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-lg font-semibold text-blue-800 mb-2">
                  {processingStage || '진단을 시작하고 있습니다...'}
                </p>
                
                {estimatedTime > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      ⏱️ 예상 대기시간: 약 {Math.ceil(estimatedTime / 60)}분 {estimatedTime % 60}초
                    </p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${((180 - estimatedTime) / 180) * 100}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                      💡 2-3분만 기다려주시면 맞춤형 2000자 요약 보고서를 받으실 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">✨ 처리 중인 작업들</h4>
                <div className="text-sm text-yellow-700 space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>8개 핵심 정보 분석 및 업계 동향 조사</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>AI 기반 SWOT 분석 및 시장 트렌드 매칭</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>6개 서비스 중 최적 매칭 및 성과 예측</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>2000자 요약 진단 보고서 생성</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            무료 AI진단 신청 양식
          </CardTitle>
          <p className="text-gray-600">
            8개 핵심 정보만 입력하시면 2-3분 내에 맞춤형 AI진단 보고서를 받으실 수 있습니다.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 기업 정보 섹션 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  기업 기본 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>회사명 *</FormLabel>
                        <FormControl>
                          <Input placeholder="회사명을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>업종 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="업종을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturing">제조업</SelectItem>
                            <SelectItem value="it">IT/소프트웨어</SelectItem>
                            <SelectItem value="service">서비스업</SelectItem>
                            <SelectItem value="retail">유통/소매</SelectItem>
                            <SelectItem value="construction">건설업</SelectItem>
                            <SelectItem value="food">식품/외식</SelectItem>
                            <SelectItem value="healthcare">의료/헬스케어</SelectItem>
                            <SelectItem value="education">교육</SelectItem>
                            <SelectItem value="finance">금융/보험</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>담당자명 *</FormLabel>
                        <FormControl>
                          <Input placeholder="담당자명을 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="example@company.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>직원수 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="직원수를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-5">1-5명</SelectItem>
                            <SelectItem value="6-10">6-10명</SelectItem>
                            <SelectItem value="11-30">11-30명</SelectItem>
                            <SelectItem value="31-50">31-50명</SelectItem>
                            <SelectItem value="51-100">51-100명</SelectItem>
                            <SelectItem value="101-300">101-300명</SelectItem>
                            <SelectItem value="300+">300명 이상</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="growthStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>성장단계 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="성장단계를 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">창업 준비</SelectItem>
                            <SelectItem value="early">창업 초기 (1-3년)</SelectItem>
                            <SelectItem value="growth">성장기 (3-7년)</SelectItem>
                            <SelectItem value="mature">성숙기 (7년 이상)</SelectItem>
                            <SelectItem value="expansion">확장기</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사업장 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="사업장을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="seoul">서울</SelectItem>
                            <SelectItem value="gyeonggi">경기</SelectItem>
                            <SelectItem value="incheon">인천</SelectItem>
                            <SelectItem value="busan">부산</SelectItem>
                            <SelectItem value="daegu">대구</SelectItem>
                            <SelectItem value="daejeon">대전</SelectItem>
                            <SelectItem value="gwangju">광주</SelectItem>
                            <SelectItem value="ulsan">울산</SelectItem>
                            <SelectItem value="sejong">세종</SelectItem>
                            <SelectItem value="gangwon">강원</SelectItem>
                            <SelectItem value="chungbuk">충북</SelectItem>
                            <SelectItem value="chungnam">충남</SelectItem>
                            <SelectItem value="jeonbuk">전북</SelectItem>
                            <SelectItem value="jeonnam">전남</SelectItem>
                            <SelectItem value="gyeongbuk">경북</SelectItem>
                            <SelectItem value="gyeongnam">경남</SelectItem>
                            <SelectItem value="jeju">제주</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 주요 고민사항 및 예상 혜택 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  고민사항 및 기대효과
                </h3>

                <FormField
                  control={form.control}
                  name="mainConcerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>주요 고민사항 *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="현재 겪고 있는 경영상의 어려움이나 해결하고 싶은 과제를 구체적으로 적어주세요. (예: 매출 증대, 생산성 향상, 디지털 전환, 품질 개선 등)" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>예상 혜택/기대효과 *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="컨설팅을 통해 얻고자 하는 효과나 목표를 적어주세요. (예: 매출 20% 증대, 업무 효율성 향상, 비용 절감 등)" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacyConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          개인정보 수집 및 이용에 동의합니다 *
                        </FormLabel>
                        <p className="text-sm text-gray-600">
                          입력하신 정보는 AI 진단 및 결과 제공을 위해서만 사용되며, 
                          진단 완료 후 안전하게 처리됩니다.
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                {onBack && (
                  <Button type="button" variant="outline" onClick={onBack}>
                    이전으로
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Star className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? '진단 처리 중...' : '무료 AI 진단 신청'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 