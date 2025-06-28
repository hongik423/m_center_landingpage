'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Bug, 
  Send, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  TestTube,
  ExternalLink,
  Check,
  Info,
  Clock,
  User,
  Zap,
  ArrowRight
} from 'lucide-react';

// 전역 타입 정의
declare global {
  interface Window {
    openBetaFeedbackForm?: (calculatorName?: string) => void;
  }
}

interface BetaFeedbackFormProps {
  calculatorName: string;
  calculatorType: string;
  className?: string;
}

interface FeedbackData {
  calculatorName: string;
  calculatorType: string;
  userEmail: string;
  feedbackType: string;
  issueDescription: string;
  expectedBehavior: string;
  actualBehavior: string;
  stepsToReproduce: string;
  severity: string;
  browserInfo: string;
  additionalComments: string;
  contactPreference: string;
}

interface ValidationState {
  userEmail: { valid: boolean; message: string };
  feedbackType: { valid: boolean; message: string };
  issueDescription: { valid: boolean; message: string };
  severity: { valid: boolean; message: string };
}

export function BetaFeedbackForm({ calculatorName, calculatorType, className }: BetaFeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackData>({
    calculatorName,
    calculatorType,
    userEmail: '',
    feedbackType: '',
    issueDescription: '',
    expectedBehavior: '',
    actualBehavior: '',
    stepsToReproduce: '',
    severity: '',
    browserInfo: typeof window !== 'undefined' ? navigator.userAgent : '',
    additionalComments: '',
    contactPreference: 'email'
  });

  const [validationState, setValidationState] = useState<ValidationState>({
    userEmail: { valid: false, message: '' },
    feedbackType: { valid: false, message: '' },
    issueDescription: { valid: false, message: '' },
    severity: { valid: false, message: '' }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 전역 함수 등록 - 다른 컴포넌트에서 베타 피드백 폼을 열 수 있도록
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 베타 피드백 폼 열기 함수를 전역에 등록
      (window as any).openBetaFeedbackForm = (targetCalculatorName?: string) => {
        console.log('🎯 전역 함수를 통한 베타 피드백 폼 열기:', targetCalculatorName);
        setIsFormVisible(true);
        
        // 계산기명 업데이트 (전달받은 경우)
        if (targetCalculatorName) {
          setFormData(prev => ({
            ...prev,
            calculatorName: targetCalculatorName
          }));
        }
        
        // 폼이 열릴 때 스크롤하여 보이도록
        setTimeout(() => {
          const formElement = document.querySelector('[data-beta-feedback-form]');
          if (formElement) {
            formElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      };

      // 커스텀 이벤트 리스너 등록
      const handleOpenFeedbackForm = (event: CustomEvent) => {
        console.log('📡 커스텀 이벤트를 통한 베타 피드백 폼 열기:', event.detail);
        setIsFormVisible(true);
        
        if (event.detail?.calculatorName) {
          setFormData(prev => ({
            ...prev,
            calculatorName: event.detail.calculatorName
          }));
        }
        
        setTimeout(() => {
          const formElement = document.querySelector('[data-beta-feedback-form]');
          if (formElement) {
            formElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      };

      window.addEventListener('openBetaFeedbackForm', handleOpenFeedbackForm as EventListener);
      
      // 컴포넌트 언마운트 시 정리
      return () => {
        delete (window as any).openBetaFeedbackForm;
        window.removeEventListener('openBetaFeedbackForm', handleOpenFeedbackForm as EventListener);
      };
    }
  }, []);

  // 실시간 유효성 검사
  useEffect(() => {
    validateField('userEmail', formData.userEmail);
  }, [formData.userEmail]);

  useEffect(() => {
    validateField('feedbackType', formData.feedbackType);
  }, [formData.feedbackType]);

  useEffect(() => {
    validateField('issueDescription', formData.issueDescription);
  }, [formData.issueDescription]);

  useEffect(() => {
    validateField('severity', formData.severity);
  }, [formData.severity, formData.feedbackType]);

  const validateField = (field: keyof ValidationState, value: string) => {
    let valid = false;
    let message = '';

    switch (field) {
      case 'userEmail':
        if (!value) {
          message = '이메일 주소를 입력해주세요';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          message = '올바른 이메일 형식이 아닙니다';
        } else {
          valid = true;
          message = '✓ 올바른 이메일 주소입니다';
        }
        break;

      case 'feedbackType':
        if (!value) {
          message = '피드백 유형을 선택해주세요';
        } else {
          valid = true;
          message = '✓ 피드백 유형이 선택되었습니다';
        }
        break;

      case 'issueDescription':
        if (!value.trim()) {
          message = '문제 설명을 입력해주세요';
        } else if (value.trim().length < 10) {
          message = '더 자세한 설명을 입력해주세요 (최소 10자)';
        } else {
          valid = true;
          message = `✓ 충분한 설명입니다 (${value.trim().length}자)`;
        }
        break;

      case 'severity':
        if (formData.feedbackType === 'bug' && !value) {
          message = '버그 신고 시 심각도를 선택해주세요';
        } else {
          valid = true;
          message = formData.feedbackType === 'bug' ? '✓ 심각도가 선택되었습니다' : '';
        }
        break;
    }

    setValidationState(prev => ({
      ...prev,
      [field]: { valid, message }
    }));
  };

  const updateFormData = (field: keyof FeedbackData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!validationState.userEmail.valid) {
      errors.push('올바른 이메일 주소를 입력해주세요.');
    }

    if (!validationState.feedbackType.valid) {
      errors.push('피드백 유형을 선택해주세요.');
    }

    if (!validationState.issueDescription.valid) {
      errors.push('문제 설명을 더 자세히 입력해주세요.');
    }

    if (formData.feedbackType === 'bug' && !validationState.severity.valid) {
      errors.push('버그 신고 시 심각도를 선택해주세요.');
    }

    return errors;
  };

  const getFieldStatus = (field: keyof ValidationState) => {
    const state = validationState[field];
    if (!state.message) return 'neutral';
    return state.valid ? 'success' : 'error';
  };

  const getFieldStyles = (field: keyof ValidationState) => {
    const status = getFieldStatus(field);
    switch (status) {
      case 'success':
        return 'border-green-500 bg-green-50 focus:ring-green-500';
      case 'error':
        return 'border-red-500 bg-red-50 focus:ring-red-500';
      default:
        return 'border-gray-300 bg-white focus:ring-blue-500';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus({
        type: 'error',
        message: validationErrors[0]
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const feedbackPayload = {
        // 기본 메타데이터
        제출일시: new Date().toLocaleString('ko-KR'),
        폼타입: '베타테스트_피드백',
        계산기명: formData.calculatorName,
        계산기유형: formData.calculatorType,
        
        // 사용자 정보
        사용자이메일: formData.userEmail,
        연락선호방식: formData.contactPreference,
        
        // 피드백 내용 - 한글 키로 변환
        피드백유형: (() => {
          switch (formData.feedbackType) {
            case 'bug': return '🐛 버그 신고';
            case 'improvement': return '💡 개선 제안';
            case 'feature': return '✨ 기능 요청';
            case 'other': return '💬 기타 의견';
            default: return formData.feedbackType;
          }
        })(),
        문제설명: formData.issueDescription,
        기대동작: formData.expectedBehavior,
        실제동작: formData.actualBehavior,
        재현단계: formData.stepsToReproduce,
        심각도: (() => {
          switch (formData.severity) {
            case 'low': return '낮음';
            case 'medium': return '보통';
            case 'high': return '높음';
            case 'critical': return '긴급';
            default: return formData.severity;
          }
        })(),
        추가의견: formData.additionalComments,
        
        // 기술 정보
        브라우저정보: formData.browserInfo,
        제출경로: window.location.href,
        타임스탬프: Date.now(),
        
        // 메타데이터
        dataSource: '베타테스트_피드백시스템'
      };

      const response = await fetch('/api/beta-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackPayload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: '피드백이 성공적으로 접수되었습니다! 검토 후 이메일로 회신드리겠습니다.'
        });
        
        // 폼 초기화
        setFormData(prev => ({
          ...prev,
          userEmail: '',
          feedbackType: '',
          issueDescription: '',
          expectedBehavior: '',
          actualBehavior: '',
          stepsToReproduce: '',
          severity: '',
          additionalComments: ''
        }));
        
        // 5초 후 폼 닫기
        setTimeout(() => {
          setIsFormVisible(false);
          setSubmitStatus({ type: null, message: '' });
          setCurrentStep(1);
        }, 5000);
      } else {
        throw new Error(result.error || '피드백 접수 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('피드백 제출 오류:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 피드백 유형 옵션들
  const feedbackTypes = [
    { 
      value: 'bug', 
      label: '🐛 버그 신고', 
      description: '계산 오류, 화면 문제 등',
      color: 'border-red-400 hover:border-red-500',
      selectedColor: 'border-red-500 bg-red-50 shadow-md'
    },
    { 
      value: 'improvement', 
      label: '💡 개선 제안', 
      description: 'UI/UX 개선 아이디어',
      color: 'border-blue-400 hover:border-blue-500',
      selectedColor: 'border-blue-500 bg-blue-50 shadow-md'
    },
    { 
      value: 'feature', 
      label: '✨ 기능 요청', 
      description: '새로운 기능 제안',
      color: 'border-green-400 hover:border-green-500',
      selectedColor: 'border-green-500 bg-green-50 shadow-md'
    },
    { 
      value: 'other', 
      label: '💬 기타 의견', 
      description: '일반적인 의견이나 질문',
      color: 'border-gray-400 hover:border-gray-500',
      selectedColor: 'border-gray-500 bg-gray-50 shadow-md'
    }
  ];

  // 심각도 옵션들
  const severityLevels = [
    { value: 'low', label: '낮음', description: '사소한 문제', color: 'border-green-400', selectedColor: 'border-green-500 bg-green-50' },
    { value: 'medium', label: '보통', description: '일반적인 문제', color: 'border-yellow-400', selectedColor: 'border-yellow-500 bg-yellow-50' },
    { value: 'high', label: '높음', description: '중요한 문제', color: 'border-orange-400', selectedColor: 'border-orange-500 bg-orange-50' },
    { value: 'critical', label: '긴급', description: '즉시 수정 필요', color: 'border-red-400', selectedColor: 'border-red-500 bg-red-50' }
  ];

  if (!isFormVisible) {
    return (
      <Card data-beta-feedback className={`border-red-300 bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 transition-all hover:shadow-xl hover:scale-[1.02] ${className} relative overflow-hidden`}>
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 right-2 w-20 h-20 bg-red-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-orange-400 rounded-full blur-xl"></div>
        </div>
        
        <CardContent className="p-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-xl shadow-lg">
                  <TestTube className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 font-bold animate-pulse shadow-sm">
                    🧪 BETA
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 font-semibold">
                    💬 피드백 환영
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-red-800 mb-2 flex items-center gap-2">
                  🚨 문제 발견 시 즉시 신고해주세요!
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </h3>
                <p className="text-red-700 font-medium leading-tight">
                  <strong>{calculatorName}</strong> 사용 중 계산 오류, 버그, 불편사항을 발견하시면<br />
                  <span className="text-orange-700">지금 바로 신고</span>해주세요. 
                  <span className="text-blue-700 font-semibold">1-2일 내 빠르게 수정</span>해드립니다!
                </p>
                
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">24시간 접수</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">1-2일 처리</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-700">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">결과 이메일 발송</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 lg:flex-shrink-0">
              <Button 
                onClick={() => setIsFormVisible(true)}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 border-0"
              >
                <Bug className="w-5 h-5 mr-3" />
                🚨 오류 신고하기
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              
              <div className="text-center lg:text-right">
                <p className="text-xs text-gray-600 font-medium">
                  클릭 한 번으로 간편 신고! 👆
                </p>
                <p className="text-xs text-red-600 font-bold animate-pulse">
                  ⚡ 즉시 개발팀 알림
                </p>
              </div>
            </div>
          </div>
          
          {/* 강조 메시지 */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Info className="w-4 h-4" />
              <span className="font-semibold text-sm">💡 이런 문제들을 신고해주세요:</span>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1 text-blue-700">
                <span>🔢</span> 계산 결과 오류
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span>🖱️</span> 버튼이 작동 안함
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span>📱</span> 모바일 화면 문제
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span>💸</span> 세율 적용 오류
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span>🔤</span> 입력값 검증 오류
              </div>
              <div className="flex items-center gap-1 text-blue-700">
                <span>🎨</span> UI/UX 개선 제안
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formProgress = (() => {
    let completed = 0;
    if (validationState.userEmail.valid) completed++;
    if (validationState.feedbackType.valid) completed++;
    if (validationState.issueDescription.valid) completed++;
    if (formData.feedbackType !== 'bug' || validationState.severity.valid) completed++;
    return (completed / 4) * 100;
  })();

  return (
    <Card data-beta-feedback data-beta-feedback-form className={`border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 shadow-lg ${className}`}>
      <CardHeader className="pb-4 bg-gradient-to-r from-orange-100 to-yellow-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TestTube className="w-6 h-6 text-orange-600" />
            <div>
              <CardTitle className="text-lg font-semibold text-orange-800">
                베타테스트 피드백 보내기
              </CardTitle>
              <CardDescription className="text-orange-700">
                {calculatorName}의 개선을 위한 소중한 의견을 들려주세요
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={() => {
              setIsFormVisible(false);
              setCurrentStep(1);
              setSubmitStatus({ type: null, message: '' });
            }}
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:bg-orange-200"
          >
            ✕
          </Button>
        </div>
        
        {/* 진행 상황 표시 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-2">
            <span>작성 진행률</span>
            <span>{Math.round(formProgress)}% 완료</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${formProgress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🔴 Step 1: 이메일 주소 */}
          <div className="space-y-3">
            <Label htmlFor="userEmail" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4" />
              <span>이메일 주소</span>
              <Badge variant="destructive" className="text-xs h-5">필수</Badge>
            </Label>
            <div className="relative">
              <Input
                id="userEmail"
                type="email"
                value={formData.userEmail}
                onChange={(e) => updateFormData('userEmail', e.target.value)}
                placeholder="your@example.com"
                className={`${getFieldStyles('userEmail')} pr-10 transition-all`}
                required
              />
              {getFieldStatus('userEmail') === 'success' && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>
            {validationState.userEmail.message && (
              <p className={`text-xs flex items-center gap-1 ${
                validationState.userEmail.valid ? 'text-green-600' : 'text-red-600'
              }`}>
                <Info className="w-3 h-3" />
                {validationState.userEmail.message}
              </p>
            )}
            <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg border-l-4 border-blue-400">
              💌 피드백에 대한 답변을 받으실 이메일 주소입니다. 개인정보는 안전하게 보호됩니다.
            </p>
          </div>

          {/* 🔴 Step 2: 피드백 유형 선택 */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="w-4 h-4" />
              <span>피드백 유형</span>
              <Badge variant="destructive" className="text-xs h-5">필수</Badge>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <label 
                  key={type.value} 
                  className={`
                    relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                    hover:shadow-md active:scale-98
                    ${formData.feedbackType === type.value ? type.selectedColor : `${type.color} bg-white hover:bg-gray-50`}
                  `}
                >
                  <input
                    type="radio"
                    value={type.value}
                    checked={formData.feedbackType === type.value}
                    onChange={(e) => updateFormData('feedbackType', e.target.value)}
                    className="absolute opacity-0"
                  />
                  
                  {/* 선택 표시 */}
                  <div className="absolute top-3 right-3">
                    {formData.feedbackType === type.value && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">{type.label}</span>
                    <span className="text-xs text-gray-600">{type.description}</span>
                  </div>
                </label>
              ))}
            </div>
            {validationState.feedbackType.message && (
              <p className={`text-xs flex items-center gap-1 ${
                validationState.feedbackType.valid ? 'text-green-600' : 'text-red-600'
              }`}>
                <Info className="w-3 h-3" />
                {validationState.feedbackType.message}
              </p>
            )}
          </div>

                     {/* 🔴 Step 3: 문제 설명 */}
           <div className="space-y-3">
             <Label htmlFor="issueDescription" className="flex items-center gap-2 text-sm font-medium text-gray-700">
               <AlertTriangle className="w-4 h-4" />
               <span>문제 설명</span>
               <Badge variant="destructive" className="text-xs h-5">필수</Badge>
             </Label>
            <div className="relative">
              <Textarea
                id="issueDescription"
                value={formData.issueDescription}
                onChange={(e) => updateFormData('issueDescription', e.target.value)}
                placeholder="어떤 문제가 발생했는지 자세히 설명해주세요...
예시:
- 상속세 계산 시 음수가 나타남
- 버튼을 클릭해도 반응하지 않음
- 계산 결과가 예상과 다름"
                rows={4}
                className={`${getFieldStyles('issueDescription')} transition-all resize-none`}
                required
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {formData.issueDescription.length}/1000
              </div>
            </div>
            {validationState.issueDescription.message && (
              <p className={`text-xs flex items-center gap-1 ${
                validationState.issueDescription.valid ? 'text-green-600' : 'text-red-600'
              }`}>
                <Info className="w-3 h-3" />
                {validationState.issueDescription.message}
              </p>
            )}
          </div>

          {/* 버그 신고 시 추가 필드 */}
          {formData.feedbackType === 'bug' && (
            <div className="space-y-6 bg-red-50 p-4 rounded-xl border border-red-200">
              <div className="flex items-center gap-2 text-red-700 font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>버그 신고 상세 정보</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedBehavior" className="text-sm font-medium text-gray-700">
                    기대한 동작
                  </Label>
                  <Textarea
                    id="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={(e) => updateFormData('expectedBehavior', e.target.value)}
                    placeholder="정상적으로 어떻게 동작해야 하나요?"
                    rows={3}
                    className="transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualBehavior" className="text-sm font-medium text-gray-700">
                    실제 동작
                  </Label>
                  <Textarea
                    id="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={(e) => updateFormData('actualBehavior', e.target.value)}
                    placeholder="실제로는 어떻게 동작했나요?"
                    rows={3}
                    className="transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stepsToReproduce" className="text-sm font-medium text-gray-700">
                  재현 단계
                </Label>
                <Textarea
                  id="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={(e) => updateFormData('stepsToReproduce', e.target.value)}
                  placeholder="문제를 재현하는 단계를 순서대로 적어주세요:
1. 페이지에 접속한다
2. 금액을 입력한다
3. 계산 버튼을 클릭한다
4. 결과를 확인한다"
                  rows={4}
                  className="transition-all"
                />
              </div>

              {/* 심각도 선택 */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Zap className="w-4 h-4" />
                  <span>심각도</span>
                  <Badge variant="destructive" className="text-xs h-5">필수</Badge>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {severityLevels.map((severity) => (
                    <label 
                      key={severity.value} 
                      className={`
                        relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                        hover:shadow-md
                        ${formData.severity === severity.value ? severity.selectedColor : `${severity.color} bg-white hover:bg-gray-50`}
                      `}
                    >
                      <input
                        type="radio"
                        value={severity.value}
                        checked={formData.severity === severity.value}
                        onChange={(e) => updateFormData('severity', e.target.value)}
                        className="absolute opacity-0"
                      />
                      
                      {/* 선택 표시 */}
                      {formData.severity === severity.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                      )}
                      
                      <span className="font-medium text-sm">{severity.label}</span>
                      <span className="text-xs text-gray-600 text-center">{severity.description}</span>
                    </label>
                  ))}
                </div>
                {validationState.severity.message && (
                  <p className={`text-xs flex items-center gap-1 ${
                    validationState.severity.valid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Info className="w-3 h-3" />
                    {validationState.severity.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 추가 의견 */}
          <div className="space-y-3">
            <Label htmlFor="additionalComments" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lightbulb className="w-4 h-4" />
              <span>추가 의견</span>
              <Badge variant="secondary" className="text-xs h-5">선택사항</Badge>
            </Label>
            <Textarea
              id="additionalComments"
              value={formData.additionalComments}
              onChange={(e) => updateFormData('additionalComments', e.target.value)}
              placeholder="기타 의견이나 제안사항이 있으시면 자유롭게 적어주세요..."
              rows={3}
              className="transition-all"
            />
          </div>

          <Separator />

          {/* 상태 메시지 */}
          {submitStatus.type && (
            <Alert className={`${submitStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} transition-all`}>
              {submitStatus.type === 'success' ? 
                <CheckCircle className="h-4 w-4 text-green-600" /> : 
                <AlertTriangle className="h-4 w-4 text-red-600" />
              }
              <AlertDescription className={submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                <div className="space-y-3">
                  <p className="font-medium text-base">{submitStatus.message}</p>
                  
                  {submitStatus.type === 'success' && (
                    <div className="space-y-2 text-sm bg-white p-3 rounded-lg border">
                      <div className="font-medium text-green-800 mb-2">처리 완료 사항:</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>구글시트에 피드백 데이터 저장 완료</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span>관리자 알림 이메일 발송 완료</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-green-600" />
                        <span>접수 확인 이메일 발송 완료</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-700 mt-3 pt-2 border-t">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">예상 처리 시간: 1-2 영업일</span>
                      </div>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 제출 버튼 */}
          <div className="bg-gray-50 p-4 rounded-xl border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>담당자: 이후경 경영지도사 (hongik423@gmail.com)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>처리 시간: 1-2 영업일 내 이메일 회신</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false);
                    setCurrentStep(1);
                    setSubmitStatus({ type: null, message: '' });
                  }}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none"
                >
                  취소
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || validateForm().length > 0}
                  className={`flex-1 md:flex-none transition-all ${
                    validateForm().length === 0 
                      ? 'bg-orange-600 hover:bg-orange-700 shadow-md' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      제출 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      피드백 보내기
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 