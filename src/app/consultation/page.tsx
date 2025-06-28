'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/layout/header';
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
      title: "✨ 상담 신청 처리 중...",
      description: "잠시만 기다려 주세요.",
      duration: 2000,
    });

    try {
      if (!isFormValid) {
        throw new Error('VALIDATION_ERROR');
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
        개인정보동의: consultationData.privacyConsent ? '동의' : '미동의',
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
          console.log('📥 Google Apps Script 응답:', responseText);
          
          toast({
            title: "🎉 상담 신청이 완료되었습니다!",
            description: "24시간 내에 담당자가 연락드리겠습니다.",
            duration: 5000,
          });

          resetForm();
          setSubmitAttempts(0);
          return;
        }
      } catch (error) {
        console.warn('⚠️ Google Apps Script 실패, 백업 시스템 시도:', error);
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
            title: "🎉 상담 신청이 완료되었습니다!",
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
                          <SelectItem value="other">💬 기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 희망 시간 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        희망 시간
                      </label>
                      <Select 
                        value={formData.preferredTime}
                        onValueChange={(value) => handleInputChange('preferredTime', value)}
                      >
                        <SelectTrigger className="h-16 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 text-base font-medium">
                          <SelectValue placeholder="편한 시간대를 선택해주세요" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
                          <SelectItem value="morning">🌅 오전 (09:00-12:00)</SelectItem>
                          <SelectItem value="afternoon">☀️ 오후 (13:00-17:00)</SelectItem>
                          <SelectItem value="evening">🌆 저녁 (18:00-20:00)</SelectItem>
                          <SelectItem value="flexible">⏰ 시간 조정 가능</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 문의 내용 */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-base font-semibold text-gray-900">
                        <MessageSquare className="w-5 h-5 text-cyan-500" />
                        문의 내용
                      </label>
                      <Textarea
                        value={formData.inquiryContent}
                        onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
                        placeholder="상담받고 싶은 내용을 자세히 적어주세요.&#10;&#10;예시:&#10;• 우리 회사 매출을 20% 늘리고 싶어요&#10;• 현재 직원 10명, 연매출 5억원 규모입니다&#10;• AI 도입으로 업무 효율성을 높이고 싶습니다"
                        className="min-h-[160px] border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all bg-gray-50/50 resize-none p-6 text-base font-medium"
                        rows={6}
                      />
                    </div>

                    {/* 🍎 개인정보 동의 (애플스토어 스타일) */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-3xl p-8">
                      <div className="flex items-start gap-6">
                        <Checkbox
                          id="privacy-consent"
                          checked={formData.privacyConsent}
                          onCheckedChange={(checked) => handleInputChange('privacyConsent', checked as boolean)}
                          className="mt-1 w-6 h-6 border-2 border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-lg"
                          required
                        />
                        <div className="flex-1">
                          <label htmlFor="privacy-consent" className="text-base text-gray-700 cursor-pointer leading-relaxed">
                            <span className="text-red-500 font-bold">*</span> 
                            <span className="font-bold text-gray-900"> 개인정보 수집 및 이용에 동의합니다.</span>
                            <br />
                            <span className="text-gray-600 text-sm">
                              수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 안전하게 관리됩니다.
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 🍎 제출 버튼 (애플스토어 스타일) */}
                    <div className="pt-8">
                      <Button
                        type="submit"
                        disabled={!isFormValid || isSubmitting || !isOnline}
                        className="w-full h-20 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-xl rounded-3xl shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-4">
                            <Loader2 className="w-7 h-7 animate-spin" />
                            <span>상담 신청 처리 중...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <span>무료 상담 신청하기</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                      
                      {!isFormValid && (
                        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4">
                          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          <p className="text-base text-red-700">
                            <span className="font-bold">필수 항목 누락:</span> * 표시된 항목을 모두 입력해주세요
                          </p>
                        </div>
                      )}
                      
                      {submitAttempts >= 2 && (
                        <div className="mt-6 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <Phone className="w-6 h-6 text-amber-600 flex-shrink-0" />
                            <div>
                              <p className="text-base font-bold text-amber-800">문제가 지속되시나요?</p>
                              <p className="text-sm text-amber-700">직접 연락주세요: 010-9251-9743</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* 🍎 사이드바 (애플스토어 스타일) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* 상담 프로세스 */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-200/30 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">상담 프로세스</h3>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  {[
                    { step: '01', title: '상담 신청', desc: '온라인 신청서 작성', emoji: '📝' },
                    { step: '02', title: '일정 조율', desc: '24시간 내 연락드림', emoji: '📞' },
                    { step: '03', title: '전문가 상담', desc: '맞춤형 솔루션 제안', emoji: '💡' }
                  ].map((process, index) => (
                    <div key={index} className="flex items-center gap-6 group cursor-pointer">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg font-bold text-white">{process.step}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{process.emoji}</span>
                          <h4 className="font-bold text-gray-900 text-lg">{process.title}</h4>
                        </div>
                        <p className="text-gray-600 font-medium">{process.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🍎 직접 연락 (애플스토어 스타일) */}
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-200/30 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">직접 연락</h3>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200/50 rounded-3xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">이후경 책임컨설턴트</p>
                        <p className="text-sm text-gray-600">디지털혁신센터장</p>
                      </div>
                    </div>
                    <a 
                      href="tel:010-9251-9743" 
                      className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      📞 010-9251-9743 전화걸기
                    </a>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200/50 rounded-3xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">이메일 문의</p>
                        <p className="text-sm text-gray-600">24시간 접수 가능</p>
                      </div>
                    </div>
                    <a 
                      href="mailto:hongik423@gmail.com" 
                      className="block w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      📧 hongik423@gmail.com
                    </a>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg mb-2">상담 시간</p>
                        <p className="text-gray-700 font-medium">평일 09:00 - 18:00</p>
                        <p className="text-sm text-gray-500">주말·공휴일 이메일 접수</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🍎 신뢰성 통계 (애플스토어 스타일) */}
              <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl shadow-2xl shadow-gray-400/30 overflow-hidden text-white">
                <div className="bg-gradient-to-r from-white/10 to-white/5 px-8 py-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Professional Expert</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { number: '25년', label: '전문 경험', emoji: '🎓' },
                      { number: '500+', label: '성공 프로젝트', emoji: '🏆' },
                      { number: '95%', label: '고객 만족도', emoji: '⭐' },
                      { number: '300%', label: '평균 성과', emoji: '📈' }
                    ].map((stat, index) => (
                      <div key={index} className="text-center group cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                          <span className="text-2xl">{stat.emoji}</span>
                        </div>
                        <div className="text-3xl font-bold mb-2">{stat.number}</div>
                        <p className="text-sm font-medium text-white/80">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 