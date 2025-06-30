'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PrivacyConsent from '@/components/ui/privacy-consent';
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
  WifiOff,
  Sparkles,
  Star
} from 'lucide-react';

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

  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitAttempts(prev => prev + 1);

    toast({
              title: "상담 신청 처리 중...",
      description: "잠시만 기다려 주세요.",
      duration: 2000,
    });

    try {
      if (!isFormValid) {
        console.log('폼 검증 실패:', {
          consultationType: formData.consultationType,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          privacyConsent: formData.privacyConsent
        });
        throw new Error('VALIDATION_ERROR');
      }

      // 개인정보 동의 재확인
      if (!formData.privacyConsent || formData.privacyConsent !== true) {
        console.log('개인정보 동의 상태 확인 실패:', formData.privacyConsent);
        toast({
          variant: "destructive",
          title: "개인정보 동의 필요",
          description: "개인정보 수집 및 이용에 동의해주세요. 이는 필수 사항입니다.",
          duration: 5000,
        });
        return;
      }

      const consultationData = {
        ...formData,
        submitDate: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
      };

      // 메일 발송 시도 1: Google Apps Script
      const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || 
        'https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec';
      
      const postData = {
        제출일시: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
        폼타입: '상담신청',
        상담유형: consultationData.consultationType,
        성명: consultationData.name,
        연락처: consultationData.phone,
        이메일: consultationData.email,
        회사명: consultationData.company,
        직책: consultationData.position || '',
        상담분야: consultationData.consultationArea || '',
        문의내용: consultationData.inquiryContent || '',
        희망상담시간: consultationData.preferredTime || '',
        개인정보동의: consultationData.privacyConsent === true ? '동의' : '미동의',
        action: 'saveConsultation',
        dataSource: '웹사이트_상담신청',
        timestamp: Date.now()
      };

      console.log('📤 Google Apps Script 데이터 전송:', postData);

      try {
        const response = await fetch(googleScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          const responseText = await response.text();
          console.log('Google Apps Script 응답:', responseText);
          
          toast({
            title: "상담 신청이 완료되었습니다!",
            description: "24시간 내에 담당자가 연락드리겠습니다.",
            duration: 5000,
          });

          resetForm();
          setSubmitAttempts(0);
          return;
        }
      } catch (error) {
        console.warn('Google Apps Script 실패, 백업 시스템 시도:', error);
      }

      // 메일 발송 시도 2: API Route 백업
      try {
        const apiResponse = await fetch('/api/consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(consultationData)
        });

        if (apiResponse.ok) {
          toast({
            title: "상담 신청이 완료되었습니다!",
            description: "24시간 내에 담당자가 연락드리겠습니다.",
            duration: 5000,
          });

          resetForm();
          setSubmitAttempts(0);
          return;
        }
      } catch (error) {
        console.warn('⚠️ API 백업도 실패:', error);
      }

      // 모든 방법 실패 시
      throw new Error('ALL_METHODS_FAILED');

    } catch (error) {
      console.error('❌ 상담 신청 오류:', error);
      
      let errorTitle = "상담 신청 처리 중 오류가 발생했습니다";
      let errorDescription = "잠시 후 다시 시도해 주세요";

      if (error instanceof Error) {
        if (error.message === 'VALIDATION_ERROR') {
          errorTitle = "📝 필수 정보를 입력해 주세요";
          errorDescription = "상담 유형, 성명, 연락처, 이메일, 회사명은 필수 항목입니다";
        } else if (error.message === 'ALL_METHODS_FAILED') {
          errorTitle = "🔄 시스템 오류";
          errorDescription = "네트워크 문제일 수 있습니다. 직접 연락해 주세요";
        }
      }

      toast({
        variant: "destructive",
        title: errorTitle,
        description: errorDescription,
        duration: 7000,
      });

      if (submitAttempts >= 2) {
        setTimeout(() => {
          toast({
            title: "📞 직접 연락",
            description: "전화 010-9251-9743 또는 이메일 hongik423@gmail.com",
            duration: 10000,
          });
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, formData, isFormValid, toast, submitAttempts, resetForm]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      {/* 🍎 애플스토어 스타일 히어로 섹션 */}
      <section className="relative bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center mb-20">
            {/* 상단 배지 */}
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Professional Consultation
            </div>
            
            {/* 메인 타이틀 */}
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight leading-none">
              비즈니스의
              <br />
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                새로운 시작
              </span>
            </h1>
            
            {/* 서브 타이틀 */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              25년 경험의 전문가와 함께
              <br />
              성장의 기회를 발견하세요
            </p>
            
            {/* 네트워크 상태 */}
            {!isOnline && (
              <div className="mt-8 mx-auto max-w-md">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                  <WifiOff className="w-5 h-5 text-orange-600" />
                  <div className="text-left">
                    <p className="text-orange-800 font-medium text-sm">연결을 확인해주세요</p>
                    <p className="text-orange-600 text-xs">인터넷 연결 상태를 점검해주세요</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 🍎 애플스토어 스타일 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { number: '25년', label: '전문 경험', color: 'from-blue-500 to-blue-600' },
              { number: '500+', label: '성공 사례', color: 'from-green-500 to-green-600' },
              { number: '95%', label: '고객 만족도', color: 'from-purple-500 to-purple-600' },
              { number: '300%', label: '평균 성과', color: 'from-orange-500 to-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {index === 0 ? '🎓' : index === 1 ? '🏆' : index === 2 ? '⭐' : '📈'}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🍎 애플스토어 스타일 메인 콘텐츠 */}
      <main className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* 🍎 상담신청 폼 (애플스토어 스타일) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-200/30 overflow-hidden backdrop-blur-sm">
                
                {/* 🍎 헤더 */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-10 py-8 border-b border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">전문가 상담</h2>
                      <p className="text-gray-600 font-medium">24시간 내 연락드립니다</p>
                    </div>
                  </div>
                </div>
                
                {/* 🍎 폼 영역 */}
                <div className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* 상담 유형 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        상담 방식 <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        value={formData.consultationType}
                        onValueChange={(value) => handleInputChange('consultationType', value)}
                      >
                        <SelectTrigger className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium">
                          <SelectValue placeholder="상담 방식을 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
                          <SelectItem value="phone" className="h-14 rounded-xl m-1">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <Phone className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium">전화 상담</div>
                                <div className="text-xs text-gray-500">즉시 연결 가능</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="online" className="h-14 rounded-xl m-1">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium">화상 상담</div>
                                <div className="text-xs text-gray-500">온라인 미팅</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="visit" className="h-14 rounded-xl m-1">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Building className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <div className="font-medium">방문 상담</div>
                                <div className="text-xs text-gray-500">직접 방문</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="email" className="h-14 rounded-xl m-1">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Mail className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <div className="font-medium">이메일 상담</div>
                                <div className="text-xs text-gray-500">서면 상담</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 🍎 개인정보 그리드 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                          <User className="w-5 h-5 text-blue-500" />
                          성명 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="홍길동"
                          className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6"
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                          <Phone className="w-5 h-5 text-green-500" />
                          연락처 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="010-1234-5678"
                          className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <Mail className="w-5 h-5 text-purple-500" />
                        이메일 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="example@company.com"
                        className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                          <Building className="w-5 h-5 text-orange-500" />
                          회사명 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="(주)기업의별"
                          className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6"
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                          <User className="w-5 h-5 text-teal-500" />
                          직책/부서
                        </label>
                        <Input
                          type="text"
                          value={formData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="대표이사, 마케팅팀장 등"
                          className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6"
                        />
                      </div>
                    </div>

                    {/* 상담 분야 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        관심 서비스
                      </label>
                      <Select 
                        value={formData.consultationArea}
                        onValueChange={(value) => handleInputChange('consultationArea', value)}
                      >
                        <SelectTrigger className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium">
                          <SelectValue placeholder="관심 있는 서비스를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
                          <SelectItem value="business-analysis">📊 BM ZEN 사업분석</SelectItem>
                          <SelectItem value="ai-productivity">🤖 AI실무활용 생산성향상</SelectItem>
                          <SelectItem value="factory-auction">🏭 경매활용 공장구매</SelectItem>
                          <SelectItem value="tech-startup">🚀 기술사업화/기술창업</SelectItem>
                          <SelectItem value="certification">🏆 인증지원</SelectItem>
                          <SelectItem value="website">🌐 웹사이트 구축</SelectItem>
                          <SelectItem value="comprehensive">📋 종합 컨설팅</SelectItem>
                          <SelectItem value="diagnosis">🔍 진단 결과 상담</SelectItem>
                          <SelectItem value="other">💬 기타 문의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 문의 내용 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <MessageSquare className="w-5 h-5 text-indigo-500" />
                        문의 내용
                      </label>
                      <Textarea
                        value={formData.inquiryContent}
                        onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
                        placeholder="상세한 문의 내용을 입력해주세요&#10;(현재 상황, 목표, 예산 등)"
                        className="min-h-32 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium px-6 py-4 resize-none"
                        rows={4}
                      />
                    </div>

                    {/* 희망 상담 시간 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <Calendar className="w-5 h-5 text-rose-500" />
                        희망 상담 시간
                      </label>
                      <Select 
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange('preferredTime', value)}
                      >
                        <SelectTrigger className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium">
                          <SelectValue placeholder="편리한 시간대를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
                          <SelectItem value="morning">🌅 오전 (09:00-12:00)</SelectItem>
                          <SelectItem value="afternoon">☀️ 오후 (13:00-18:00)</SelectItem>
                          <SelectItem value="evening">🌆 저녁 (18:00-21:00)</SelectItem>
                          <SelectItem value="flexible">⏰ 시간 협의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 🍎 애플스토어 스타일 개인정보 동의 */}
                    <div className="apple-card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50">
                      <PrivacyConsent
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) => handleInputChange('privacyConsent', checked)}
                        required={true}
                        className="apple-form-group"
                      />
                    </div>

                    {/* 🍎 애플스토어 스타일 제출 버튼 */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting || !isOnline}
                        className={`
                          apple-button w-full h-20 text-lg font-semibold transition-all duration-300
                          ${isFormValid && !isSubmitting && isOnline
                            ? 'apple-button-primary hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            상담 신청 처리 중...
                          </div>
                        ) : !isOnline ? (
                          <div className="flex items-center gap-3">
                            <WifiOff className="w-6 h-6" />
                            네트워크 연결을 확인해주세요
                          </div>
                        ) : !isFormValid ? (
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6" />
                            필수 정보를 입력해주세요
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" />
                            상담 신청하기
                            <ArrowRight className="w-6 h-6" />
                          </div>
                        )}
                      </button>

                      {/* 재시도 안내 */}
                      {submitAttempts > 0 && !isSubmitting && (
                        <div className="apple-card bg-orange-50 border-orange-200 mt-6">
                          <div className="text-center">
                            <AlertCircle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                            <p className="text-orange-800 font-medium mb-1">
                              {submitAttempts === 1 ? '문제가 발생했습니다' : '계속해서 문제가 발생합니다'}
                            </p>
                            <p className="text-orange-600 text-sm">
                              {submitAttempts >= 2 
                                ? '직접 연락을 권장드립니다: 010-9251-9743'
                                : '다시 시도하거나 직접 연락해 주세요'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                  </form>
                </div>
              </div>
            </div>

            {/* 🍎 애플스토어 스타일 사이드바 */}
            <div className="lg:col-span-2 apple-spacing-lg">
              
              {/* 빠른 연락 */}
              <div className="apple-card-large bg-white border border-gray-200">
                <div className="text-center mb-8">
                  <div className="apple-icon-large bg-gradient-to-br from-green-500 to-emerald-600 mx-auto mb-6 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="apple-subtitle text-gray-900">빠른 연락</h3>
                  <p className="apple-caption text-gray-600">즉시 상담이 필요하시면</p>
                </div>
                
                <div className="apple-spacing-sm">
                  <a href="tel:010-9251-9743">
                    <button className="apple-button-secondary mobile-full-width">
                      <Phone className="w-5 h-5 mr-2" />
                      전화 상담 (010-9251-9743)
                    </button>
                  </a>
                  
                  <a href="mailto:hongik423@gmail.com">
                    <button className="apple-button-outline mobile-full-width">
                      <Mail className="w-5 h-5 mr-2" />
                      이메일 문의
                    </button>
                  </a>
                </div>

                <div className="apple-card bg-gray-50 mt-6">
                  <div className="text-center">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900 mb-1">상담 시간</p>
                    <p className="text-sm text-gray-600">평일 09:00 ~ 18:00</p>
                    <p className="text-xs text-gray-500 mt-1">주말/공휴일 상담 가능</p>
                  </div>
                </div>
              </div>

              {/* 전문가 프로필 */}
              <div className="apple-card-large bg-white border border-gray-200">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">이후경 M센터장</h3>
                  <p className="text-gray-600 font-medium">25년 경험 전문가</p>
                </div>

                <div className="apple-spacing-xs text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>중소벤처기업부 경영지도사</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>500+ 기업 성장 지원</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>95% 고객 만족도</span>
                  </div>
                </div>
              </div>

              {/* 서비스 안내 */}
              <div className="apple-card-large bg-white border border-gray-200">
                <h3 className="apple-subtitle mb-6 text-gray-900">핵심 서비스</h3>
                <div className="apple-spacing-xs">
                  {[
                    { title: 'BM ZEN 사업분석', desc: '혁신 프레임워크', color: 'text-blue-600', link: '/services/business-analysis' },
                    { title: 'AI 생산성 향상', desc: '정부 100% 지원', color: 'text-purple-600', link: '/services/ai-productivity' },
                    { title: '공장구매 절약', desc: '40% 비용절감', color: 'text-orange-600', link: '/services/factory-auction' },
                    { title: '기술창업 지원', desc: '5억원 자금확보', color: 'text-green-600', link: '/services/tech-startup' }
                  ].map((service, index) => (
                    <a 
                      key={index} 
                      href={service.link}
                      className="block group cursor-pointer"
                    >
                      <div className="apple-card bg-white border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02]">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${service.color.replace('text-', 'bg-')} group-hover:scale-110 transition-transform duration-200`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-overflow-safe group-hover:text-blue-700 transition-colors duration-200">{service.title}</p>
                            <p className="text-sm text-gray-600 text-overflow-safe group-hover:text-blue-600 transition-colors duration-200">{service.desc}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 고객 후기 */}
              <div className="apple-card-large bg-white border border-gray-200">
                <h3 className="apple-subtitle mb-6 text-gray-900">고객 후기</h3>
                <div className="apple-spacing-sm">
                  {[
                    {
                      name: '김대표',
                      company: '제조업',
                      review: '전문적인 분석으로 매출이 300% 증가했습니다.',
                      rating: 5
                    },
                    {
                      name: '이사장',
                      company: 'IT업',
                      review: 'AI 도입으로 업무 효율성이 크게 향상되었어요.',
                      rating: 5
                    }
                  ].map((review, index) => (
                    <div key={index} className="apple-card bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm mb-3 text-overflow-safe">"{review.review}"</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                          <p className="text-xs text-gray-600">{review.company}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* 🍎 애플스토어 스타일 푸터 CTA */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mobile-container text-center">
          <h2 className="apple-title text-gray-900 mb-6">
            성장의 기회를
            <br />
            놓치지 마세요
          </h2>
          <p className="apple-body text-gray-600 max-w-2xl mx-auto mb-8">
            지금 상담 신청하시면 24시간 내에
            <br />
            전문가가 직접 연락드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <a href="tel:010-9251-9743">
              <button className="apple-button bg-green-600 text-white hover:bg-green-700 mobile-full-width shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5 mr-2" />
                즉시 전화상담
              </button>
            </a>
            <button 
              className="apple-button bg-blue-600 hover:bg-blue-700 text-white mobile-full-width shadow-lg hover:shadow-xl"
              onClick={() => {
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              상담신청하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 