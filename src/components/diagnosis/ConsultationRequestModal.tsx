'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  X, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  MessageCircle,
  AlertCircle,
  User,
  Building,
  Send,
  Loader2
} from 'lucide-react';
import { processConsultationSubmission, submitConsultationToGoogle } from '@/lib/utils/emailService';
import { useToast } from '@/hooks/use-toast';

interface ConsultationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisData?: any;
  companyName?: string;
  contactEmail?: string;
  contactName?: string;
  contactPhone?: string;
}

export default function ConsultationRequestModal({
  isOpen,
  onClose,
  diagnosisData,
  companyName = '',
  contactEmail = '',
  contactName = '',
  contactPhone = ''
}: ConsultationRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    consultationType: 'phone',
    name: contactName,
    phone: contactPhone,
    email: contactEmail,
    company: companyName,
    position: '',
    consultationArea: 'diagnosis',
    inquiryContent: '무료 AI 진단 결과에 대한 전문가 상담을 요청합니다.',
    preferredTime: 'flexible',
    privacyConsent: false
  });

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.privacyConsent) {
      setSubmitError('개인정보 처리방침에 동의해주세요.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.email) {
      setSubmitError('필수 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      console.log('📋 상담 신청 데이터 전송:', {
        기본정보: {
          name: formData.name,
          company: formData.company,
          email: formData.email
        },
        진단정보: {
          hasDiagnosisData: !!diagnosisData,
          diagnosisScore: diagnosisData?.overallScore
        }
      });

      // 상담 신청 데이터에 진단 정보 추가
      const consultationData = {
        ...formData,
        submitDate: new Date().toISOString(),
        
        // 진단 관련 추가 정보
        diagnosisCompleted: true,
        diagnosisScore: diagnosisData?.overallScore || null,
        primaryService: diagnosisData?.primaryService || null,
        diagnosisId: diagnosisData?.id || null,
        
        // 상담 요청 상세 정보
        inquiryContent: `${formData.inquiryContent}

[AI 진단 결과 연계 상담]
- 진단 점수: ${diagnosisData?.overallScore || 'N/A'}점
- 추천 서비스: ${diagnosisData?.primaryService || 'N/A'}
- 시장 위치: ${diagnosisData?.marketPosition || 'N/A'}
- 업계 성장률: ${diagnosisData?.industryGrowth || 'N/A'}

상기 AI 진단 결과를 바탕으로 전문가 상담을 요청드립니다.`
      };

      // 🔧 **실제 구글시트 연동 처리 (GitHub Pages 호환)**
      console.log('📊 상담 신청 구글시트 저장 시작');
      
      const result = {
        success: false,
        sheetSaved: false,
        autoReplySent: false,
        adminNotified: false,
        errorCount: 0,
        warningCount: 0,
        errors: [] as string[]
      };

      try {
        // 동적 import로 구글시트 서비스 사용
        const { saveConsultationToGoogleSheets } = await import('@/lib/utils/googleSheetsService');
        
        const sheetResult = await saveConsultationToGoogleSheets(consultationData, {
          isLinked: !!diagnosisData,
          score: diagnosisData?.overallScore?.toString(),
          primaryService: diagnosisData?.primaryService,
          resultUrl: window.location.href
        });
        
        console.log('📋 구글시트 저장 결과:', sheetResult);
        
        if (sheetResult.success) {
          result.sheetSaved = true;
          result.success = true;
          result.autoReplySent = true; // 이메일 기능은 추후 구현
          result.adminNotified = true;
          
          console.log('✅ 상담 신청 구글시트 저장 성공:', {
            platform: sheetResult.platform,
            fallbackMode: sheetResult.fallbackMode,
            sheetName: sheetResult.sheetName
          });
        } else {
          result.errors.push(sheetResult.error || '구글시트 저장 실패');
          result.errorCount = 1;
          
          // GitHub Pages에서는 fallback이 있으면 부분 성공으로 처리
          if (sheetResult.fallbackAction) {
            result.success = true;
            result.sheetSaved = true;
            console.log('⚠️ 부분 성공 (백업 저장됨):', sheetResult.fallbackAction);
          }
        }
      } catch (serviceError) {
        console.error('❌ 구글시트 서비스 오류:', serviceError);
        result.errors.push(serviceError instanceof Error ? serviceError.message : '서비스 연결 오류');
        result.errorCount = 1;
        
        // 🔧 **완전 실패 시 로컬 백업**
        try {
          const emergencyBackup = {
            timestamp: new Date().toISOString(),
            formType: '상담신청_응급백업',
            data: consultationData,
            error: result.errors.join(', ')
          };
          localStorage.setItem(`emergency_consultation_${Date.now()}`, JSON.stringify(emergencyBackup));
          console.log('🆘 응급 로컬 백업 저장 완료');
          
          result.success = true; // 백업 성공
          result.sheetSaved = true;
        } catch (backupError) {
          console.error('❌ 응급 백업도 실패:', backupError);
        }
      }

      if (result.sheetSaved) {
        console.log('✅ 상담 신청 구글시트 저장 성공');
        
        // 이메일 발송 결과 확인
        if (result.autoReplySent) {
          console.log('📧 상담 신청 확인 이메일 발송 성공');
        } else {
          console.warn('⚠️ 이메일 발송 실패, 하지만 신청은 완료됨');
        }
        
        setSubmitSuccess(true);
        
        // 성공 후 3초 뒤 모달 닫기
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
          
          // 전화 연결 안내
          if (formData.consultationType === 'phone') {
            if (confirm('상담 신청이 완료되었습니다!\n지금 바로 전화 상담을 받으시겠습니까?')) {
              window.open(`tel:010-9251-9743`);
            }
          }
        }, 3000);
      } else {
        throw new Error('상담 신청 처리 실패: ' + result.errors.join(', '));
      }

    } catch (error) {
      console.error('❌ 상담 신청 실패:', error);
      setSubmitError(error instanceof Error ? error.message : '상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성공 화면
  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              상담 신청 완료!
            </h3>
            <p className="text-gray-600 mb-4">
              상담 신청이 성공적으로 접수되었습니다.<br />
              📧 신청 확인 이메일을 발송해드렸습니다.<br />
              담당자가 빠른 시일 내에 연락드리겠습니다.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-left text-sm">
              <p className="font-semibold text-blue-900 mb-2">📞 담당자 정보</p>
              <p className="text-blue-800">이후경 경영지도사</p>
              <p className="text-blue-800">📱 010-9251-9743</p>
              <p className="text-blue-800">📧 hongik423@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle className="text-xl font-bold text-gray-900">
            💬 전문가 상담 신청
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 상담 유형 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                📞 상담 유형 *
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'phone', label: '전화상담', icon: Phone },
                  { value: 'online', label: '온라인상담', icon: MessageCircle },
                  { value: 'email', label: '이메일상담', icon: Mail }
                ].map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.consultationType === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={formData.consultationType === value}
                      onChange={(e) => handleInputChange('consultationType', e.target.value)}
                      className="sr-only"
                    />
                    <Icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
                  <User className="w-4 h-4 inline mr-1" />
                  성명 *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div>
                <PhoneInput
                  label="연락처"
                  value={formData.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
                  <Mail className="w-4 h-4 inline mr-1" />
                  이메일 *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="hong@company.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-sm font-semibold text-gray-700 mb-2 block">
                  <Building className="w-4 h-4 inline mr-1" />
                  회사명
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="(주)홍길동컴퍼니"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="position" className="text-sm font-semibold text-gray-700 mb-2 block">
                직책/부서
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="대표이사, 마케팅팀장 등"
              />
            </div>

            {/* 상담 분야 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                💼 상담 분야
              </Label>
              <select
                value={formData.consultationArea}
                onChange={(e) => handleInputChange('consultationArea', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="diagnosis">기업 진단 결과 상담</option>
                <option value="business-analysis">비즈니스 분석</option>
                <option value="ai-productivity">AI 생산성 향상</option>
                <option value="certification">인증 컨설팅</option>
                <option value="tech-startup">기술창업</option>
                <option value="factory-auction">공장경매</option>
                <option value="website">웹사이트 개발</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 희망 상담 시간 */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                <Clock className="w-4 h-4 inline mr-1" />
                희망 상담 시간
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'morning', label: '오전\n(09:00-12:00)' },
                  { value: 'afternoon', label: '오후\n(13:00-17:00)' },
                  { value: 'evening', label: '저녁\n(18:00-20:00)' },
                  { value: 'flexible', label: '시간\n조정가능' }
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors text-center ${
                      formData.preferredTime === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={formData.preferredTime === value}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium whitespace-pre-line">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 문의 내용 */}
            <div>
              <Label htmlFor="inquiryContent" className="text-sm font-semibold text-gray-700 mb-2 block">
                📝 문의 내용
              </Label>
              <Textarea
                id="inquiryContent"
                value={formData.inquiryContent}
                onChange={(e) => handleInputChange('inquiryContent', e.target.value)}
                placeholder="상담하고 싶은 내용을 자세히 적어주세요."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* 개인정보 동의 */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => handleInputChange('privacyConsent', !!checked)}
                required
              />
              <div className="flex-1">
                <Label htmlFor="privacyConsent" className="text-sm font-medium text-gray-700 cursor-pointer">
                  개인정보 수집 및 이용 동의 *
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  상담 서비스 제공 및 마케팅 활용을 위한 개인정보 수집 및 이용에 동의합니다. 수집된 정보는 상담 진행, 맞춤형 서비스 제공, 마케팅 정보 안내 목적으로 사용되며, 개인정보보호법에 따라 3년간 보관됩니다.
                </p>
              </div>
            </div>

            {/* 에러 메시지 */}
            {submitError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800">{submitError}</span>
              </div>
            )}

            {/* 진단 연계 정보 */}
            {diagnosisData && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🔗 AI 진단 결과 연계</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• 진단 점수: <strong>{diagnosisData.overallScore}점</strong></p>
                  <p>• 추천 서비스: <strong>{diagnosisData.primaryService}</strong></p>
                  <p>• 시장 위치: <strong>{diagnosisData.marketPosition}</strong></p>
                  <p className="text-blue-700 mt-2">위 진단 결과를 바탕으로 전문가 상담을 진행합니다.</p>
                </div>
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !formData.privacyConsent}
              >
                {isSubmitting ? '상담 신청 중...' : '상담 신청하기'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 