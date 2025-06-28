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
  WifiOff
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
      title: "⚡ 상담 신청 처리 중...",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-slate-50 pb-20">
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              전문가 1:1 무료 상담
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              비즈니스 성장의
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                새로운 시작
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              25년 경험의 전문 컨설턴트가 제안하는
              <br />
              <strong className="text-gray-800">맞춤형 성장 솔루션</strong>
            </p>
            
            {!isOnline && (
              <div className="mt-8 mx-auto max-w-md">
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-orange-800 font-medium text-sm">네트워크 연결 확인 필요</p>
                    <p className="text-orange-600 text-xs">인터넷 연결을 확인해 주세요</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: '25년', label: '전문 경험', icon: '🎓' },
              { number: '500+', label: '성공 사례', icon: '🏆' },
              { number: '95%', label: '고객 만족도', icon: '⭐' },
              { number: '300%', label: '평균 성과 향상', icon: '📈' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 상담신청 폼 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">전문가 상담 신청</h2>
                    <p className="text-gray-600 text-sm">24시간 내 연락드립니다</p>
                  </div>
                </div>
              </div>
              
              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* 상담 유형 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      상담 유형 <span className="text-red-500">*</span>
                    </label>
                    <Select 
                      value={formData.consultationType}
                      onValueChange={(value) => handleInputChange('consultationType', value)}
                    >
                      <SelectTrigger className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50">
                        <SelectValue placeholder="원하는 상담 방식을 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        <SelectItem value="phone" className="h-12 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">📞</div>
                            <span>전화 상담</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="online" className="h-12 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">💻</div>
                            <span>온라인 상담 (화상)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="visit" className="h-12 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">🏢</div>
                            <span>방문 상담</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="email" className="h-12 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">📧</div>
                            <span>이메일 상담</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 개인정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <User className="w-4 h-4 text-blue-500" />
                        성명 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="홍길동"
                        className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Phone className="w-4 h-4 text-green-500" />
                        연락처 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="010-1234-5678"
                        className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Mail className="w-4 h-4 text-purple-500" />
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@company.com"
                      className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <Building className="w-4 h-4 text-orange-500" />
                        회사명 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="(주)기업의별"
                        className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                        <User className="w-4 h-4 text-teal-500" />
                        직책/부서
                      </label>
                      <Input
                        type="text"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="대표이사, 마케팅팀장 등"
                        className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* 상담 분야 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      상담 분야
                    </label>
                    <Select 
                      value={formData.consultationArea}
                      onValueChange={(value) => handleInputChange('consultationArea', value)}
                    >
                      <SelectTrigger className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50">
                        <SelectValue placeholder="관심 있는 서비스를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
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

                  {/* 희망 상담 시간 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      희망 상담 시간
                    </label>
                    <Select 
                      value={formData.preferredTime}
                      onValueChange={(value) => handleInputChange('preferredTime', value)}
                    >
                      <SelectTrigger className="h-14 border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50">
                        <SelectValue placeholder="편한 시간대를 선택해주세요" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        <SelectItem value="morning">🌅 오전 (09:00-12:00)</SelectItem>
                        <SelectItem value="afternoon">☀️ 오후 (13:00-17:00)</SelectItem>
                        <SelectItem value="evening">🌆 저녁 (18:00-20:00)</SelectItem>
                        <SelectItem value="flexible">⏰ 시간 조정 가능</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 문의 내용 */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <MessageSquare className="w-4 h-4 text-cyan-500" />
                      문의 내용
                    </label>
                    <Textarea
                      value={formData.inquiryContent}
                      onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
                      placeholder="상담받고 싶은 내용을 자세히 적어주세요.&#10;&#10;예시:&#10;• 우리 회사 매출을 20% 늘리고 싶어요&#10;• 현재 직원 10명, 연매출 5억원 규모입니다&#10;• AI 도입으로 업무 효율성을 높이고 싶습니다"
                      className="min-h-[140px] border-2 border-slate-200 rounded-xl hover:border-blue-300 focus:border-blue-500 transition-colors bg-slate-50/50 resize-none p-4"
                      rows={6}
                    />
                  </div>

                  {/* 개인정보 동의 */}
                  <div className="bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-100 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        id="privacy-consent"
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) => handleInputChange('privacyConsent', checked as boolean)}
                        className="mt-1 w-5 h-5 border-2 border-blue-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        required
                      />
                      <div className="flex-1">
                        <label htmlFor="privacy-consent" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                          <span className="text-red-500 font-medium">*</span> 
                          <strong className="text-gray-800"> 개인정보 수집 및 이용에 동의합니다.</strong>
                          <br />
                          <span className="text-gray-600 text-xs">
                            수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 안전하게 삭제됩니다.
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting || !isOnline}
                      className="w-full h-16 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 hover:from-blue-700 hover:via-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>상담 신청 처리 중...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <span>무료 상담 신청하기</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                    
                    {!isFormValid && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">
                          <span className="font-medium">필수 항목 누락:</span> * 표시된 항목을 모두 입력해주세요
                        </p>
                      </div>
                    )}
                    
                    {submitAttempts >= 2 && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">문제가 지속되시나요?</p>
                            <p className="text-xs text-amber-700">직접 연락주세요: 010-9251-9743</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 개발자 정보 */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <details className="text-xs text-gray-600">
                          <summary className="cursor-pointer font-medium">개발자 정보 (테스트용)</summary>
                          <div className="mt-2 space-y-1">
                            <p>폼 유효성: {isFormValid ? '✅ 유효' : '❌ 무효'}</p>
                            <p>제출 시도: {submitAttempts}회</p>
                            <p>온라인 상태: {isOnline ? '✅ 연결됨' : '❌ 오프라인'}</p>
                            <p>Google Script URL: {process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '기본값 사용'}</p>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-8">
            {/* 상담 프로세스 */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">상담 프로세스</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {[
                  { step: 1, title: '상담 신청', desc: '온라인 신청서 작성', icon: '📝' },
                  { step: 2, title: '일정 조율', desc: '24시간 내 연락드림', icon: '📞' },
                  { step: 3, title: '전문가 상담', desc: '맞춤형 솔루션 제안', icon: '💡' }
                ].map((process, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-sm font-bold text-white">{process.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{process.icon}</span>
                        <h4 className="font-semibold text-gray-900">{process.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{process.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 직접 연락 */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">직접 연락</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">이후경 책임컨설턴트</p>
                      <p className="text-xs text-gray-600">디지털혁신센터</p>
                    </div>
                  </div>
                  <a 
                    href="tel:010-9251-9743" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    📞 010-9251-9743 전화걸기
                  </a>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-2 border-green-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">이메일 문의</p>
                      <p className="text-xs text-gray-600">24시간 접수 가능</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:hongik423@gmail.com" 
                    className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    📧 hongik423@gmail.com
                  </a>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">상담 시간</p>
                      <p className="text-sm text-gray-700">평일 09:00 - 18:00</p>
                      <p className="text-xs text-gray-500">주말·공휴일 이메일 접수</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 신뢰성 통계 */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl shadow-xl shadow-slate-200/50 border border-blue-200/60 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 border-b border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-lg">🌟</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">신뢰할 수 있는 전문가</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '25년', label: '전문 경험', icon: '🎓' },
                    { number: '500+', label: '성공 프로젝트', icon: '🏆' },
                    { number: '95%', label: '고객 만족도', icon: '⭐' },
                    { number: '300%', label: '평균 성과', icon: '📈' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{stat.icon}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 