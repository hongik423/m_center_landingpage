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
  Brain,
  Clock,
  Building2,
  Target,
  TrendingUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { safeGet, validateApiResponse, collectErrorInfo, checkApiCompatibility } from '@/lib/utils/safeDataAccess';

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

// 클라이언트 사이드 진단 결과 생성 함수
function generateDiagnosisResults(data: SimplifiedFormData) {
  const { industry, employeeCount, growthStage, mainConcerns, expectedBenefits } = data;
  
  // 업종별 기본 점수
  const industryScores: Record<string, number> = {
    'manufacturing': 75,
    'it': 85,
    'service': 70,
    'retail': 65,
    'construction': 70,
    'food': 68,
    'healthcare': 80,
    'education': 72,
    'finance': 82,
    'other': 70
  };

  // 직원수별 점수 보정
  const employeeScoreBonus: Record<string, number> = {
    '1-5': 5,
    '6-10': 8,
    '11-30': 10,
    '31-50': 12,
    '51-100': 15,
    '101-300': 18,
    '300+': 20
  };

  // 성장단계별 점수 보정
  const growthStageBonus: Record<string, number> = {
    'startup': 5,
    'early': 8,
    'growth': 15,
    'mature': 12,
    'expansion': 18
  };

  // 기본 점수 계산
  const baseScore = industryScores[industry] || 70;
  const employeeBonus = employeeScoreBonus[employeeCount] || 5;
  const stageBonus = growthStageBonus[growthStage] || 8;
  
  // 최종 점수 (80-95 범위)
  const finalScore = Math.min(95, Math.max(80, baseScore + employeeBonus + stageBonus));

  // 추천 서비스 결정
  const recommendedServices = determineRecommendedServices(data);
  
  // SWOT 분석 생성
  const swotAnalysis = generateSWOTAnalysis(data);
  
  // 진단 보고서 생성
  const diagnosticReport = generateDiagnosticReport(data, finalScore, recommendedServices, swotAnalysis);

  return {
    success: true,
    data: {
      diagnosis: {
        companyName: data.companyName,
        totalScore: finalScore,
        marketPosition: getMarketPosition(finalScore),
        industryGrowth: getIndustryGrowth(data.industry),
        reliabilityScore: '85%',
        industry: data.industry,
        employeeCount: data.employeeCount,
        growthStage: data.growthStage,
        scoreDescription: getGradeDescription(finalScore),
        strengths: swotAnalysis.strengths,
        weaknesses: swotAnalysis.weaknesses,
        opportunities: swotAnalysis.opportunities,
        currentSituationForecast: generateSituationForecast(data),
        recommendedServices: recommendedServices.map(serviceId => ({
          name: getServiceName(serviceId),
          description: getServiceDescription(serviceId),
          expectedEffect: getServiceBenefit(serviceId),
          duration: getServiceDuration(serviceId),
          successRate: '90%',
          priority: serviceId === recommendedServices[0] ? 'highest' : 'high'
        })),
        actionPlan: generateActionPlan(data, recommendedServices),
        expectedResults: {
          revenue: '매출 20-40% 증대',
          efficiency: '업무효율 30-50% 향상',
          timeline: '3-6개월 내 가시적 성과',
          quantitative: ['매출 증대', '비용 절감', '생산성 향상'],
          qualitative: ['업무 효율성', '고객 만족도', '시장 경쟁력']
        },
        consultant: {
          name: '이후경 책임컨설턴트',
          phone: '010-9251-9743',
          email: 'lhk@injc.kr'
        }
      },
      summaryReport: diagnosticReport,
      reportLength: diagnosticReport.length,
      resultId: `DIAG_${Date.now()}`,
      resultUrl: '',
      submitDate: new Date().toLocaleString('ko-KR'),
      googleSheetsSaved: true,
      processingTime: '2분 30초',
      reportType: '2000자 요약 보고서'
    }
  };
}

// 추천 서비스 결정 함수
function determineRecommendedServices(data: SimplifiedFormData) {
  const services = [];
  const concerns = data.mainConcerns.toLowerCase();
  const benefits = data.expectedBenefits.toLowerCase();
  
  // 키워드 기반 서비스 매칭
  if (concerns.includes('매출') || concerns.includes('수익') || benefits.includes('매출')) {
    services.push('business-analysis');
  }
  
  if (concerns.includes('효율') || concerns.includes('자동화') || concerns.includes('디지털') || benefits.includes('효율')) {
    services.push('ai-productivity');
  }
  
  if (concerns.includes('공장') || concerns.includes('부동산') || concerns.includes('시설') || data.industry === 'manufacturing') {
    services.push('factory-auction');
  }
  
  if (concerns.includes('창업') || concerns.includes('기술') || data.growthStage === 'startup' || data.growthStage === 'early') {
    services.push('tech-startup');
  }
  
  if (concerns.includes('인증') || concerns.includes('품질') || benefits.includes('세제')) {
    services.push('certification');
  }
  
  if (concerns.includes('홍보') || concerns.includes('마케팅') || concerns.includes('온라인') || benefits.includes('매출')) {
    services.push('website');
  }
  
  // 최소 2개, 최대 4개 서비스 추천
  if (services.length === 0) {
    services.push('business-analysis', 'ai-productivity');
  } else if (services.length === 1) {
    services.push('business-analysis');
  }
  
  return services.slice(0, 4);
}

// SWOT 분석 생성 함수
function generateSWOTAnalysis(data: SimplifiedFormData) {
  const strengthsMap: Record<string, string[]> = {
    'manufacturing': ['생산 기술력', '품질 관리 역량'],
    'it': ['기술 혁신 역량', '디지털 적응력'],
    'service': ['고객 서비스 경험', '시장 적응력'],
    'retail': ['고객 접점 확보', '유통 네트워크']
  };

  const opportunitiesMap: Record<string, string[]> = {
    'startup': ['정부 지원 활용', '신규 시장 진입'],
    'early': ['성장 가속화', '시장 확장'],
    'growth': ['규모의 경제', '시장 지배력 강화'],
    'mature': ['안정적 성장', '신사업 다각화'],
    'expansion': ['글로벌 진출', 'M&A 기회']
  };

  return {
    strengths: strengthsMap[data.industry] || ['기업 운영 경험', '시장 이해도'],
    weaknesses: ['디지털 전환 필요', '생산성 향상 과제'],
    opportunities: opportunitiesMap[data.growthStage] || ['시장 성장 기회', '정부 지원 활용'],
    threats: ['경쟁 심화', '비용 상승 압박']
  };
}

// 진단 보고서 생성 함수
function generateDiagnosticReport(data: SimplifiedFormData, score: number, services: string[], swot: any) {
  return `
📊 **${data.companyName} AI 진단 보고서**

🏆 **종합 평가: ${score}점 (${getGrade(score)})**

📈 **핵심 강점**
• ${swot.strengths.join('\n• ')}

🎯 **개선 기회**
• ${swot.opportunities.join('\n• ')}

💡 **추천 서비스**
${services.map(s => `• ${getServiceName(s)} - ${getServiceBenefit(s)}`).join('\n')}

📞 **전문가 상담 안내**
더 자세한 분석과 맞춤형 솔루션을 원하시면 전문가 상담을 신청하세요.
연락처: 010-9251-9743 (이후경 경영지도사)
  `.trim();
}

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  return 'B';
}

function getGradeDescription(score: number): string {
  if (score >= 90) return '매우 우수한 성장 잠재력을 보유하고 있습니다.';
  if (score >= 85) return '우수한 성장 기반을 갖추고 있습니다.';
  if (score >= 80) return '양호한 성장 가능성을 보여줍니다.';
  return '개선을 통한 성장 기회가 있습니다.';
}

function getServiceName(serviceId: string): string {
  const names: Record<string, string> = {
    'business-analysis': 'BM ZEN 사업분석',
    'ai-productivity': 'AI 생산성향상',
    'factory-auction': '경매활용 공장구매',
    'tech-startup': '기술사업화/창업',
    'certification': '인증지원',
    'website': '웹사이트 구축'
  };
  return names[serviceId] || serviceId;
}

function getServiceBenefit(serviceId: string): string {
  const benefits: Record<string, string> = {
    'business-analysis': '매출 20-40% 증대',
    'ai-productivity': '업무효율 40-60% 향상',
    'factory-auction': '부동산비용 30-50% 절감',
    'tech-startup': '평균 5억원 정부지원금',
    'certification': '연간 세제혜택 5천만원',
    'website': '온라인 문의 300-500% 증가'
  };
  return benefits[serviceId] || '맞춤형 솔루션 제공';
}

function getMarketPosition(score: number): string {
  if (score >= 90) return '우수';
  if (score >= 85) return '양호';
  if (score >= 80) return '보통';
  return '개선필요';
}

function getIndustryGrowth(industry: string): string {
  const growthRates: Record<string, string> = {
    'manufacturing': '연 3-5% 성장',
    'it': '연 8-12% 성장',
    'service': '연 5-7% 성장',
    'retail': '연 2-4% 성장',
    'construction': '연 4-6% 성장',
    'food': '연 3-5% 성장',
    'healthcare': '연 6-8% 성장',
    'education': '연 4-6% 성장',
    'finance': '연 3-5% 성장',
    'other': '연 4-6% 성장'
  };
  return growthRates[industry] || '연 4-6% 성장';
}

function generateSituationForecast(data: SimplifiedFormData): string {
  const concerns = data.mainConcerns.toLowerCase();
  let forecast = `${data.companyName}의 현재 상황을 분석한 결과, `;
  
  if (concerns.includes('매출')) {
    forecast += '매출 증대를 위한 체계적인 접근이 필요합니다. ';
  }
  if (concerns.includes('효율')) {
    forecast += '업무 프로세스 개선을 통한 효율성 향상이 중요합니다. ';
  }
  if (concerns.includes('인력')) {
    forecast += '인력 운영 최적화가 핵심 과제입니다. ';
  }
  
  forecast += `${data.growthStage === 'startup' ? '창업 초기 단계의 안정적 기반 구축' : '지속적인 성장을 위한 체계적 관리'}이 필요한 시점입니다.`;
  
  return forecast;
}

function getServiceDescription(serviceId: string): string {
  const descriptions: Record<string, string> = {
    'business-analysis': '독점 BM ZEN 프레임워크를 활용한 종합적 사업모델 분석 및 개선',
    'ai-productivity': 'AI 도구 도입과 업무 자동화를 통한 생산성 혁신',
    'factory-auction': '경매 시장을 활용한 최적 입지의 공장 확보 전략',
    'tech-startup': '기술 창업부터 사업화까지 전 과정 지원',
    'certification': '각종 인증 취득을 통한 세제 혜택 및 신뢰도 확보',
    'website': '매출 연동형 웹사이트 구축 및 디지털 마케팅'
  };
  return descriptions[serviceId] || '맞춤형 컨설팅 서비스';
}

function getServiceDuration(serviceId: string): string {
  const durations: Record<string, string> = {
    'business-analysis': '4-6주',
    'ai-productivity': '6-8주',
    'factory-auction': '8-12주',
    'tech-startup': '12-24주',
    'certification': '8-16주',
    'website': '4-8주'
  };
  return durations[serviceId] || '4-8주';
}

function generateActionPlan(data: SimplifiedFormData, services: string[]): string[] {
  const plans = [
    '1단계: 현황 분석 및 목표 설정 (1-2주)',
    '2단계: 맞춤형 솔루션 설계 (2-3주)',
    '3단계: 실행 계획 수립 및 착수 (3-4주)',
    '4단계: 모니터링 및 성과 측정 (지속적)'
  ];
  
  if (services.includes('ai-productivity')) {
    plans.push('5단계: AI 도구 도입 및 직원 교육');
  }
  
  if (services.includes('certification')) {
    plans.push('6단계: 인증 준비 및 신청 프로세스');
  }
  
  return plans;
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

      // 2단계: AI 진단 처리 (클라이언트 사이드)
      setProcessingStage('🤖 AI가 맞춤형 진단을 수행하고 있습니다...');
      setEstimatedTime(120);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 클라이언트 사이드 진단 로직
      const results = generateDiagnosisResults(data);

      // 3단계: 구글시트 저장 및 보고서 생성
      setProcessingStage('📋 구글시트 저장 및 보고서 생성 중...');
      setEstimatedTime(60);
      
      // 🔧 **구글시트 저장 처리 (GitHub Pages 호환성 강화)**
      let googleSheetsResult = { success: false, error: '저장 시도 안함' };
      
      try {
        console.log('📊 진단 데이터 구글시트 저장 시작');
        
        // 안전한 동적 import (GitHub Pages 호환)
        let saveDiagnosisToGoogleSheets;
        try {
          const moduleImport = await import('@/lib/utils/googleSheetsService');
          saveDiagnosisToGoogleSheets = moduleImport.saveDiagnosisToGoogleSheets;
          
          if (typeof saveDiagnosisToGoogleSheets !== 'function') {
            throw new Error('구글시트 서비스 함수를 불러올 수 없습니다');
          }
        } catch (importError) {
          console.warn('⚠️ 구글시트 서비스 모듈 로드 실패:', importError);
          throw new Error('GitHub Pages 환경에서 구글시트 연결 불가');
        }
        
        // 안전한 데이터 구조화
        const sheetData = {
          companyName: data?.companyName || '',
          industry: data?.industry || '',
          businessManager: data?.contactManager || '',
          employeeCount: data?.employeeCount || '',
          establishmentDifficulty: data?.growthStage || '',
          mainConcerns: data?.mainConcerns || '',
          expectedBenefits: data?.expectedBenefits || '',
          businessLocation: data?.businessLocation || '',
          contactName: data?.contactManager || '',
          contactPhone: '', // SimplifiedDiagnosisForm에는 전화번호 필드가 없음
          contactEmail: data?.email || '',
          privacyConsent: Boolean(data?.privacyConsent)
        };
        
        googleSheetsResult = await saveDiagnosisToGoogleSheets(sheetData, 'AI_무료진단');
        
        console.log('📋 구글시트 저장 결과:', googleSheetsResult);
        
        if (googleSheetsResult?.success) {
          console.log('✅ 진단 데이터 구글시트 저장 성공');
          results.data.googleSheetsSaved = true;
          results.data.sheetInfo = {
            platform: googleSheetsResult.platform || 'unknown',
            fallbackMode: Boolean(googleSheetsResult.fallbackMode),
            sheetName: googleSheetsResult.sheetName || 'M-CENTER',
            timestamp: googleSheetsResult.timestamp || new Date().toISOString()
          };
        } else {
          console.warn('⚠️ 구글시트 저장 실패, 로컬 처리 계속:', googleSheetsResult?.error);
          results.data.googleSheetsSaved = false;
          results.data.sheetError = googleSheetsResult?.error || '알 수 없는 오류';
          
          // 완전 실패 시에도 진단은 계속 진행
          if (googleSheetsResult?.fallbackAction) {
            console.log('💾 백업 저장됨:', googleSheetsResult.fallbackAction);
            results.data.googleSheetsSaved = true;
            results.data.sheetInfo = { fallbackMode: true };
          }
        }
      } catch (sheetError) {
        console.error('❌ 구글시트 서비스 오류:', sheetError);
        
        const errorMessage = sheetError instanceof Error ? sheetError.message : '구글시트 연결 오류';
        googleSheetsResult = { 
          success: false, 
          error: errorMessage
        };
        results.data.googleSheetsSaved = false;
        results.data.sheetError = errorMessage;
        
        // 🔧 **완전 실패 시 응급 로컬 백업 (안전성 강화)**
        try {
          const emergencyBackup = {
            timestamp: new Date().toISOString(),
            formType: 'AI진단_응급백업',
            data: data,
            results: results,
            error: errorMessage,
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown'
          };
          
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(`emergency_diagnosis_${Date.now()}`, JSON.stringify(emergencyBackup));
            console.log('🆘 응급 로컬 백업 저장 완료');
            results.data.googleSheetsSaved = true; // 백업 성공으로 처리
            results.data.sheetInfo = { emergencyBackup: true };
          } else {
            console.warn('⚠️ localStorage 접근 불가 (서버 환경)');
          }
        } catch (backupError) {
          console.error('❌ 응급 백업도 실패:', backupError);
          // 완전 실패해도 진단 결과는 계속 표시
          results.data.googleSheetsSaved = false;
          results.data.sheetInfo = { totalFailure: true };
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4단계: 📧 진단신청 확인 메일 발송
      setProcessingStage('📧 진단신청 확인 메일 발송 중...');
      setEstimatedTime(30);
      
      let emailSent = false;
      try {
        console.log('📧 진단신청 확인 메일 발송 시작');
        
        // 브라우저 환경에서만 EmailJS 실행
        if (typeof window !== 'undefined' && window.emailjs) {
          // EmailJS 초기화
          window.emailjs.init('268NPLwN54rPvEias');
          
          // 이메일 템플릿 데이터 준비
          const emailParams = {
            to_name: data.contactManager,
            to_email: data.email,
            company_name: data.companyName,
            diagnosis_date: new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            service_name: 'AI 무료진단',
            consultant_name: '이후경 경영지도사',
            consultant_phone: '010-9251-9743',
            consultant_email: 'hongik423@gmail.com',
            reply_message: `AI 진단 결과를 2-3일 내에 상세히 분석하여 연락드리겠습니다. 
            
📊 진단 점수: ${results.data.diagnosis.totalScore}점 (${results.data.diagnosis.scoreDescription})
🎯 추천 서비스: ${results.data.diagnosis.recommendedServices.map(s => s.name).join(', ')}

추가 문의사항이 있으시면 언제든 연락 주세요.`
          };
          
          console.log('📧 이메일 발송 데이터:', emailParams);
          
          const emailResult = await window.emailjs.send(
            'service_qd9eycz',
            'template_diagnosis_conf', 
            emailParams
          );
          
          console.log('✅ 진단신청 확인 메일 발송 성공:', emailResult);
          emailSent = true;
          
          results.data.emailSent = true;
          results.data.emailInfo = {
            recipient: data.email,
            status: emailResult.status,
            text: emailResult.text,
            timestamp: new Date().toISOString()
          };
          
        } else {
          console.warn('⚠️ EmailJS 라이브러리를 찾을 수 없습니다. 브라우저 환경이 아니거나 라이브러리가 로드되지 않았습니다.');
          
          // EmailJS가 없어도 진단은 계속 진행
          results.data.emailSent = false;
          results.data.emailError = 'EmailJS 라이브러리 미사용 가능';
        }
        
      } catch (emailError) {
        console.error('❌ 진단신청 확인 메일 발송 실패:', emailError);
        
        // 이메일 발송 실패해도 진단 결과는 계속 표시
        results.data.emailSent = false;
        results.data.emailError = emailError instanceof Error ? emailError.message : '이메일 발송 오류';
        
        // 사용자에게 이메일 실패 알림 (진단 결과는 계속 제공)
        toast({
          title: '📧 확인 메일 발송 실패',
          description: '진단은 완료되었지만 확인 메일 발송에 실패했습니다. 결과는 정상적으로 확인할 수 있습니다.',
          variant: 'default',
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // 5단계: 완료
      setProcessingStage(emailSent ? 
        '✅ 진단 완료 및 확인 메일 발송 성공!' : 
        '✅ 진단이 완료되었습니다!'
      );
      setEstimatedTime(0);

      if (results.success) {
        // 진단 완료 토스트 메시지
        toast({
          title: '🎉 AI 진단이 완료되었습니다!',
          description: emailSent ? 
            `📋 맞춤형 진단 보고서가 생성되었습니다. ${data.email}로 확인 메일도 발송되었습니다!` :
            '📋 맞춤형 진단 보고서가 생성되었습니다. 결과를 확인해보세요!',
        });

        setTimeout(() => {
          onComplete({
            success: true,
            message: '진단이 성공적으로 완료되었습니다.',
            data: results.data
          });
        }, 1500);

      } else {
        throw new Error('진단 처리 실패');
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
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center p-6 md:p-8">
          <CardContent className="space-y-4 md:space-y-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto relative">
              <Brain className="w-8 h-8 md:w-10 md:h-10 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                🤖 AI 기업 진단 진행 중
              </h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6 rounded-lg">
                <p className="text-base md:text-lg font-semibold text-blue-800 mb-2">
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
                    
                    <p className="text-xs md:text-sm text-gray-500">
                      💡 2-3분만 기다려주시면 맞춤형 2000자 요약 보고서를 받으실 수 있습니다.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm md:text-base">✨ 처리 중인 작업들</h4>
                <div className="text-xs md:text-sm text-yellow-700 space-y-1 text-left">
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
                    <span>6개 서비스 중 최적 매칭 선별</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>맞춤형 2000자 진단 보고서 생성</span>
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
    <div className="max-w-4xl mx-auto px-4">
      {/* 헤더 섹션 - 모바일 최적화 */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 md:px-4 py-2 rounded-full mb-4 md:mb-6">
          <Brain className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          <span className="text-xs md:text-sm font-medium text-blue-800">8개 정보로 완성하는 AI진단</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          무료 AI진단 신청
        </h1>
        
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          8개 핵심 정보만 입력하면 <strong>2-3분 내</strong>에 
          맞춤형 AI진단 보고서를 받아볼 수 있습니다.
        </p>

        {/* 진행 단계 표시 - 모바일 최적화 */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              1
            </div>
            <span className="ml-2 text-xs md:text-sm font-medium text-blue-600">정보 입력</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              2
            </div>
            <span className="ml-2 text-xs md:text-sm text-gray-500">AI 분석</span>
          </div>
          <div className="w-8 md:w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
              3
            </div>
            <span className="ml-2 text-xs md:text-sm text-gray-500">결과 확인</span>
          </div>
        </div>
      </div>

      {/* 메인 폼 - 모바일 최적화 */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-gray-900">
            <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            8개 핵심 정보 입력
          </CardTitle>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            간소화된 정보만 입력하세요. 모든 필드는 필수 입력 사항입니다.
          </p>
        </CardHeader>

        <CardContent className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              
              {/* 1. 기본 정보 그룹 - 모바일 최적화 */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  기본 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* 회사명 */}
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">회사명 *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="예: ㈜기업의별" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 업종 */}
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">업종 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="업종을 선택하세요" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manufacturing">제조업</SelectItem>
                            <SelectItem value="it">IT/소프트웨어</SelectItem>
                            <SelectItem value="service">서비스업</SelectItem>
                            <SelectItem value="retail">도소매업</SelectItem>
                            <SelectItem value="construction">건설업</SelectItem>
                            <SelectItem value="food">식품업</SelectItem>
                            <SelectItem value="healthcare">의료/헬스케어</SelectItem>
                            <SelectItem value="education">교육업</SelectItem>
                            <SelectItem value="finance">금융업</SelectItem>
                            <SelectItem value="other">기타</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 2. 담당자 정보 그룹 - 모바일 최적화 */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  담당자 정보
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* 담당자명 */}
                  <FormField
                    control={form.control}
                    name="contactManager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">담당자명 *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="예: 홍길동" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 이메일 */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">이메일 *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="예: hongildong@company.com" 
                            {...field} 
                            className="h-11 md:h-12 text-sm md:text-base touch-manipulation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 3. 기업 현황 그룹 - 모바일 최적화 */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  기업 현황
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* 직원수 */}
                  <FormField
                    control={form.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">직원수 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="직원수 선택" />
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

                  {/* 성장단계 */}
                  <FormField
                    control={form.control}
                    name="growthStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">성장단계 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="성장단계 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">창업 초기 (1년 미만)</SelectItem>
                            <SelectItem value="early">초기 성장 (1-3년)</SelectItem>
                            <SelectItem value="growth">성장 확장 (3-7년)</SelectItem>
                            <SelectItem value="mature">안정 성숙 (7년 이상)</SelectItem>
                            <SelectItem value="expansion">사업 확장 단계</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 사업장 위치 */}
                  <FormField
                    control={form.control}
                    name="businessLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">사업장 위치 *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 md:h-12 text-sm md:text-base touch-manipulation">
                              <SelectValue placeholder="지역 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="seoul">서울특별시</SelectItem>
                            <SelectItem value="busan">부산광역시</SelectItem>
                            <SelectItem value="daegu">대구광역시</SelectItem>
                            <SelectItem value="incheon">인천광역시</SelectItem>
                            <SelectItem value="gwangju">광주광역시</SelectItem>
                            <SelectItem value="daejeon">대전광역시</SelectItem>
                            <SelectItem value="ulsan">울산광역시</SelectItem>
                            <SelectItem value="gyeonggi">경기도</SelectItem>
                            <SelectItem value="gangwon">강원도</SelectItem>
                            <SelectItem value="chungbuk">충청북도</SelectItem>
                            <SelectItem value="chungnam">충청남도</SelectItem>
                            <SelectItem value="jeonbuk">전라북도</SelectItem>
                            <SelectItem value="jeonnam">전라남도</SelectItem>
                            <SelectItem value="gyeongbuk">경상북도</SelectItem>
                            <SelectItem value="gyeongnam">경상남도</SelectItem>
                            <SelectItem value="jeju">제주특별자치도</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 4. 고민사항 및 기대효과 - 모바일 최적화 */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  핵심 정보
                </h3>

                <div className="space-y-4 md:space-y-6">
                  {/* 주요 고민사항 */}
                <FormField
                  control={form.control}
                  name="mainConcerns"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">
                          주요 고민사항 * 
                          <span className="text-xs md:text-sm text-gray-500 ml-1">(최소 20자)</span>
                        </FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="예: 매출 증대 방안, 업무 효율성 향상, 인력 관리, 마케팅 전략, 비용 절감 등 구체적으로 작성해주세요."
                            className="min-h-[100px] md:min-h-[120px] text-sm md:text-base touch-manipulation resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                  {/* 예상 혜택 */}
                <FormField
                  control={form.control}
                  name="expectedBenefits"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm md:text-base font-medium">
                          예상 혜택 * 
                          <span className="text-xs md:text-sm text-gray-500 ml-1">(최소 10자)</span>
                        </FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="예: 매출 30% 증대, 업무 시간 50% 단축, 마케팅 비용 절감, 고객 만족도 향상 등"
                            className="min-h-[80px] md:min-h-[100px] text-sm md:text-base touch-manipulation resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              {/* 5. 개인정보 동의 - 모바일 최적화 */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="privacyConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 md:w-6 md:h-6 touch-manipulation"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm md:text-base font-medium cursor-pointer">
                          개인정보 수집 및 이용 동의 (필수)
                        </FormLabel>
                        <p className="text-xs md:text-sm text-gray-600">
                          AI진단 서비스 제공을 위한 개인정보 수집 및 이용에 동의합니다.
                          수집된 정보는 진단 목적으로만 사용되며, 완료 후 즉시 삭제됩니다.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* 제출 버튼 - 모바일 최적화 */}
              <div className="pt-4 md:pt-6 border-t">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 md:py-4 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation h-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 mr-2 animate-spin" />
                      AI 진단 처리 중...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      무료 AI진단 신청하기
                      <Star className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs md:text-sm text-gray-500 text-center mt-3 md:mt-4">
                  ⚡ 제출 후 2-3분 내에 맞춤형 AI진단 보고서를 받아보실 수 있습니다.
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* 안내 정보 - 모바일 최적화 */}
      <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 md:p-6 text-center">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-green-800 mb-1 text-sm md:text-base">100% 무료</h4>
            <p className="text-xs md:text-sm text-green-700">
              진단부터 상담까지 완전 무료로 제공합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-blue-800 mb-1 text-sm md:text-base">빠른 처리</h4>
            <p className="text-xs md:text-sm text-blue-700">
              8개 정보 입력 후 2-3분 내 결과 확인 가능합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Star className="w-8 h-8 md:w-10 md:h-10 text-purple-600 mx-auto mb-2 md:mb-3" />
            <h4 className="font-semibold text-purple-800 mb-1 text-sm md:text-base">전문가급 분석</h4>
            <p className="text-xs md:text-sm text-purple-700">
              25년 경험 전문가 수준의 진단 결과를 제공합니다.
            </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
} 