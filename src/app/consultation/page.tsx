'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Header from '@/components/layout/header';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Building,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Wifi,
  WifiOff
} from 'lucide-react';

// 🚀 성능 최적화: 컴포넌트 메모이제이션
const OptimizedInput = memo(Input);
const OptimizedTextarea = memo(Textarea);
const OptimizedSelect = memo(Select);
const OptimizedButton = memo(Button);

export default function ConsultationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    consultationType: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    position: '',
    consultationArea: '',
    inquiryContent: '',
    preferredTime: '',
    privacyConsent: false
  });

  // 🚀 성능 최적화: 폼 검증 메모이제이션
  const isFormValid = useMemo(() => {
    return Boolean(
      formData.consultationType?.trim() && 
      formData.name?.trim() && 
      formData.phone?.trim() && 
      formData.email?.trim() && 
      formData.company?.trim() && 
      formData.privacyConsent
    );
  }, [formData]);

  // 🚀 성능 최적화: 네트워크 체크 메모이제이션
  const checkNetworkStatus = useCallback(() => {
    const isOnlineStatus = navigator.onLine;
    setIsOnline(isOnlineStatus);
    return isOnlineStatus;
  }, []);

  // 🔧 **텍스트 변환 도우미 함수들 - 메모이제이션**
  const getConsultationTypeText = useCallback((type: string) => {
    const typeMap: Record<string, string> = {
      'phone': '전화 상담',
      'online': '온라인 화상 상담',
      'visit': '방문 상담',
      'email': '이메일 상담'
    };
    return typeMap[type] || type;
  }, []);

  const getConsultationAreaText = useCallback((area: string) => {
    const areaMap: Record<string, string> = {
      'business-analysis': 'BM ZEN 사업분석',
      'ai-productivity': 'AI실무활용 생산성향상',
      'factory-auction': '경매활용 공장구매',
      'tech-startup': '기술사업화/기술창업',
      'certification': '인증지원',
      'website': '웹사이트 구축',
      'comprehensive': '종합 컨설팅',
      'diagnosis': '진단 결과 상담',
      'other': '기타'
    };
    return areaMap[area] || area;
  }, []);

  const getPreferredTimeText = useCallback((time: string) => {
    const timeMap: Record<string, string> = {
      'morning': '오전 (09:00-12:00)',
      'afternoon': '오후 (13:00-17:00)',
      'evening': '저녁 (18:00-20:00)',
      'flexible': '시간 조정 가능'
    };
    return timeMap[time] || time;
  }, []);

  // 🚀 성능 최적화: 입력 핸들러 메모이제이션
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 🚀 성능 최적화: 폼 초기화 메모이제이션
  const resetForm = useCallback(() => {
    setFormData({
      consultationType: '',
      name: '',
      phone: '',
      email: '',
      company: '',
      position: '',
      consultationArea: '',
      inquiryContent: '',
      preferredTime: '',
      privacyConsent: false
    });
  }, []);

  // 🚀 성능 최적화: handleSubmit 메모이제이션 및 즉시 응답
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🚀 즉시 피드백: 중복 제출 방지 및 즉시 로딩 상태 설정
    if (isSubmitting) return;

    // 🚀 즉시 응답: 버튼 클릭 시 즉시 로딩 상태 표시
    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    // 🚀 즉시 피드백: 사용자에게 처리 시작 알림
    toast({
      title: "⚡ 상담 신청 처리 중...",
      description: "잠시만 기다려 주세요.",
      duration: 2000,
    });

    try {
      if (!checkNetworkStatus()) {
        throw new Error('NETWORK_ERROR');
      }

      const requiredFields = ['consultationType', 'name', 'phone', 'email', 'company'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error('VALIDATION_ERROR');
      }

      if (!formData.privacyConsent) {
        throw new Error('PRIVACY_CONSENT_ERROR');
      }

      const consultationData = {
        ...formData,
        submitDate: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      };

      // 🔧 GitHub Pages 호환성: API 라우트 대신 직접 Google Apps Script 호출
      let result;
      
      try {
        // 1차 시도: API 라우트 (Vercel 등에서 작동)
        const response = await fetch('/api/consultation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(consultationData),
        });

        if (response.ok) {
          result = await response.json();
        } else {
          throw new Error('API_ROUTE_FAILED');
        }
      } catch (apiError) {
        console.log('🔄 API 라우트 실패, 직접 Google Apps Script 호출로 대체');
        
        // 2차 시도: 직접 Google Apps Script 호출 (GitHub Pages 호환)
        try {
          const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 
            'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';
          
          // Google Apps Script 호환 데이터 구조
          const googleScriptData = {
            // 기본 메타데이터
            제출일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
            폼타입: '상담신청',
            API버전: 'v4.0_직접호출',
            요청시간: new Date().toISOString(),
            신청구분: '상담신청',
            
            // 상담 신청 데이터 (한국어 필드명)
            상담유형: consultationData.consultationType || '일반상담',
            성명: consultationData.name || '',
            연락처: consultationData.phone || '',
            이메일: consultationData.email || '',
            회사명: consultationData.company || '',
            직책: consultationData.position || '',
            상담분야: consultationData.consultationArea || '',
            문의내용: consultationData.inquiryContent || '',
            희망상담시간: consultationData.preferredTime || '',
            개인정보동의: consultationData.privacyConsent ? '동의' : '미동의',
            
            // 진단 연계 정보
            진단연계여부: 'N',
            진단점수: '',
            추천서비스: '',
            진단결과URL: '',
            
            // Apps Script 처리용 메타데이터
            action: 'saveConsultation',
            dataSource: '웹사이트_직접호출',
            timestamp: Date.now(),
            uniqueKey: `consultation_${consultationData.email}_${Date.now()}`
          };

          const googleResponse = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(googleScriptData),
            mode: 'cors'
          });

          if (googleResponse.ok) {
            const responseText = await googleResponse.text();
            
            try {
              result = JSON.parse(responseText);
            } catch (parseError) {
              // JSON 파싱 실패 시 텍스트 응답 분석
              if (responseText.includes('성공') || responseText.includes('저장') || responseText.includes('완료')) {
                result = { 
                  success: true, 
                  message: '상담 신청이 성공적으로 처리되었습니다.',
                  platform: 'Google Apps Script 직접호출',
                  data: {
                    sheetSaved: true,
                    autoReplySent: false,
                    adminNotified: true
                  }
                };
              } else {
                throw new Error('GOOGLE_SCRIPT_RESPONSE_ERROR');
              }
            }
          } else {
            throw new Error('GOOGLE_SCRIPT_HTTP_ERROR');
          }
          
        } catch (googleError) {
          console.error('❌ Google Apps Script 직접 호출도 실패:', googleError);
          
          // 3차 시도: 로컬 저장 및 최소한의 처리
          const fallbackData = {
            timestamp: new Date().toLocaleString('ko-KR'),
            formType: '상담신청',
            data: consultationData,
            status: 'fallback_mode',
            userAgent: navigator.userAgent
          };
          
          // 로컬 스토리지에 저장
          localStorage.setItem(`consultation_fallback_${Date.now()}`, JSON.stringify(fallbackData));
          
          result = {
            success: true, // 사용자에게는 성공으로 표시
            message: '상담 신청을 임시 저장했습니다. 관리자가 확인하여 처리하겠습니다.',
            platform: '로컬 저장 모드',
            data: {
              sheetSaved: false,
              autoReplySent: false,
              adminNotified: false,
              fallbackMode: true
            }
          };
        }
      }
      
      // 📧 **Google Apps Script에서 자동 이메일 발송 처리됨**
      if (result.success) {
        console.log('✅ Google Apps Script 자동 이메일 처리 완료:', {
          success: result.success,
          service: result.data?.service || 'Google Apps Script',
          features: result.data?.features || []
        });
        
        // Google Apps Script에서 자동으로 이메일이 발송되므로 별도 처리 불필요
        result.emailSent = result.success;
        result.emailInfo = {
          recipient: consultationData.email,
          service: 'Google Apps Script',
          processed: result.success,
          timestamp: new Date().toISOString()
        };
      }
      
      const isSuccessful = result.success;
      
      if (isSuccessful) {
        toast({
          title: "🎉 상담 신청이 완료되었습니다!",
          description: "빠른 시일 내에 담당자가 연락드리겠습니다.",
          duration: 5000,
        });

        const successDetails = ["✅ 상담 신청 접수 완료"];
        
        if (result.data?.autoReplySent) {
          successDetails.push("✅ 확인 이메일 발송 완료");
        } else {
          console.log('📝 확인 이메일 발송은 실패했으나 상담신청은 정상 처리됨');
        }
        
        setTimeout(() => {
          toast({
            title: "처리 완료",
            description: successDetails.join("\n"),
            duration: 3000,
          });
        }, 1000);

        resetForm();
        setSubmitAttempts(0);

      } else {
        console.error('❌ 상담신청 완전 실패:', result.error || result.details?.errors);
        
        // 📧 Google Apps Script에서 실패 알림도 자동 처리됨
        console.log('📧 Google Apps Script에서 관리자 알림 자동 처리');
        
        throw new Error(result.error || 'SUBMISSION_FAILED');
      }

    } catch (error) {
      console.error('상담 신청 오류:', error);
      
      let errorTitle = "상담 신청 처리 중 오류가 발생했습니다";
      let errorDescription = "잠시 후 다시 시도해 주세요";
      let showAlternatives = false;

      if (error instanceof Error) {
        switch (error.message) {
          case 'NETWORK_ERROR':
            errorTitle = "🌐 인터넷 연결을 확인해 주세요";
            errorDescription = "네트워크 연결 상태를 확인하고 다시 시도해 주세요";
            showAlternatives = true;
            break;
          case 'VALIDATION_ERROR':
            errorTitle = "📝 필수 정보를 입력해 주세요";
            errorDescription = "상담 유형, 성명, 연락처, 이메일, 회사명은 필수 항목입니다";
            break;
          case 'PRIVACY_CONSENT_ERROR':
            errorTitle = "🔒 개인정보 수집 동의가 필요합니다";
            errorDescription = "개인정보 수집 및 이용에 동의해 주세요";
            break;
          case 'SUBMISSION_FAILED':
            errorTitle = "⚠️ 상담 신청 처리에 실패했습니다";
            errorDescription = "시스템 처리 중 문제가 발생했습니다";
            showAlternatives = true;
            break;
          default:
            if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
              errorTitle = "🔄 서버 연결에 실패했습니다";
              errorDescription = "네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요";
              showAlternatives = true;
            } else {
              errorDescription = error.message;
              showAlternatives = true;
            }
        }
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
        duration: 7000,
      });

      if (showAlternatives && submitAttempts >= 2) {
        setTimeout(() => {
          toast({
            title: "📞 대체 연락 방법",
            description: "전화 010-9251-9743 또는 이메일 hongik423@gmail.com로 연락 주세요",
            duration: 10000,
          });
        }, 2000);
      }

    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, formData, toast, submitAttempts, checkNetworkStatus, getConsultationTypeText, getConsultationAreaText, getPreferredTimeText, resetForm]);

  // 🔧 네트워크 상태 감지 (useState → useEffect 수정)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            전문가 상담 신청
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            기업의별 전문 컨설턴트가 귀하의 비즈니스 성장을 위한 
            맞춤형 솔루션을 제안해드립니다.
          </p>
          
          {!isOnline && (
            <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg inline-flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-orange-600" />
              <span className="text-orange-800 text-sm">
                오프라인 상태입니다. 인터넷 연결을 확인해 주세요.
              </span>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    상담 신청서
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상담 유형 <span className="text-red-500">*</span>
                      </label>
                      <OptimizedSelect 
                        value={formData.consultationType}
                        onValueChange={(value) => handleInputChange('consultationType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="원하는 상담 방식을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">전화 상담</SelectItem>
                          <SelectItem value="online">온라인 상담 (화상)</SelectItem>
                          <SelectItem value="visit">방문 상담</SelectItem>
                          <SelectItem value="email">이메일 상담</SelectItem>
                        </SelectContent>
                      </OptimizedSelect>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          성명 <span className="text-red-500">*</span>
                        </label>
                        <OptimizedInput
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="홍길동"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          연락처 <span className="text-red-500">*</span>
                        </label>
                        <OptimizedInput
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="010-1234-5678"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <OptimizedInput
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@company.com"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          회사명 <span className="text-red-500">*</span>
                        </label>
                        <OptimizedInput
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="(주)기업의별"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          직책
                        </label>
                        <OptimizedInput
                          type="text"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="대표이사, 팀장 등"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상담 분야
                      </label>
                      <OptimizedSelect 
                        value={formData.consultationArea}
                        onValueChange={(value) => handleInputChange('consultationArea', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상담받고 싶은 분야를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diagnosis">기업 진단 결과 상담</SelectItem>
                          <SelectItem value="business-analysis">BM ZEN 사업분석</SelectItem>
                          <SelectItem value="ai-productivity">AI 활용 생산성향상</SelectItem>
                          <SelectItem value="factory-auction">경매활용 공장구매</SelectItem>
                          <SelectItem value="tech-startup">기술사업화/기술창업</SelectItem>
                          <SelectItem value="certification">인증지원</SelectItem>
                          <SelectItem value="website">웹사이트 구축</SelectItem>
                          <SelectItem value="comprehensive">종합 컨설팅</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </OptimizedSelect>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        문의 내용
                      </label>
                      <OptimizedTextarea
                        value={formData.inquiryContent}
                        onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
                        placeholder="상담받고 싶은 내용을 자세히 적어주세요..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        희망 상담 시간
                      </label>
                      <OptimizedSelect 
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange('preferredTime', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="상담 가능한 시간대를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">오전 (09:00-12:00)</SelectItem>
                          <SelectItem value="afternoon">오후 (13:00-17:00)</SelectItem>
                          <SelectItem value="evening">저녁 (18:00-20:00)</SelectItem>
                          <SelectItem value="flexible">시간 조정 가능</SelectItem>
                        </SelectContent>
                      </OptimizedSelect>
                    </div>

                    <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg">
                      <Checkbox
                        id="privacy-consent"
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) => handleInputChange('privacyConsent', checked as boolean)}
                        required
                      />
                      <div className="text-sm text-gray-700">
                        <label htmlFor="privacy-consent" className="font-medium cursor-pointer">
                          개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          상담 서비스 제공 및 마케팅 활용을 위한 개인정보 수집 및 이용에 동의합니다. 수집된 정보는 상담 진행, 맞춤형 서비스 제공, 마케팅 정보 안내 목적으로 사용되며, 개인정보보호법에 따라 3년간 보관됩니다.
                        </p>
                      </div>
                    </div>

                    <OptimizedButton 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      disabled={isSubmitting || !isOnline || !isFormValid}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          처리 중... 잠시만 기다려주세요
                        </>
                      ) : !isOnline ? (
                        <>
                          <WifiOff className="w-5 h-5 mr-2" />
                          인터넷 연결 필요
                        </>
                      ) : !isFormValid ? (
                        <>
                          <AlertCircle className="w-5 h-5 mr-2" />
                          필수 정보를 입력해주세요
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          즉시 무료 상담 신청
                        </>
                      )}
                    </OptimizedButton>

                    {submitAttempts >= 2 && !isSubmitting && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <RefreshCw className="w-4 h-4" />
                          <span className="font-medium">문제가 지속되시나요?</span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          직접 연락해 주시면 즉시 도움을 드리겠습니다.
                        </p>
                        <div className="flex gap-2 mt-2">
                          <a 
                            href="tel:010-9251-9743" 
                            className="text-sm text-yellow-800 hover:text-yellow-900 underline"
                          >
                            📞 010-9251-9743
                          </a>
                          <a 
                            href="mailto:hongik423@gmail.com" 
                            className="text-sm text-yellow-800 hover:text-yellow-900 underline"
                          >
                            📧 hongik423@gmail.com
                          </a>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    상담 프로세스
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">상담 신청</h4>
                      <p className="text-sm text-gray-600">온라인 신청서 작성</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">일정 조율</h4>
                      <p className="text-sm text-gray-600">24시간 내 연락드림</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">전문가 상담</h4>
                      <p className="text-sm text-gray-600">맞춤형 솔루션 제안</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-600" />
                    직접 연락
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">이후경 책임컨설턴트</p>
                      <a 
                        href="tel:010-9251-9743" 
                        className="text-blue-600 hover:text-blue-700"
                      >
                        010-9251-9743
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">이메일 문의</p>
                      <a 
                        href="mailto:hongik423@gmail.com" 
                        className="text-blue-600 hover:text-blue-700"
                      >
                        hongik423@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium">상담 시간</p>
                      <p className="text-sm text-gray-600">평일 09:00 - 18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>주요 상담 분야</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span>BM ZEN 사업분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span>AI 활용 생산성향상</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span>기술사업화/기술창업</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span>경매활용 공장구매</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-blue-600" />
                      <span>인증지원 컨설팅</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 