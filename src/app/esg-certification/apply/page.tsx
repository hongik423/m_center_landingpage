'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Calculator,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ApplyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 기업 정보
    companyName: '',
    businessNumber: '',
    ceoName: '',
    companyAddress: '',
    industry: '',
    employeeCount: '',
    
    // 담당자 정보
    contactName: '',
    contactPosition: '',
    contactEmail: '',
    contactPhone: '',
    
    // 인증 정보
    certificationType: '',
    certificationScope: '',
    hasExistingCertification: 'no',
    existingCertificationDetails: '',
    
    // 추가 정보
    specialRequirements: '',
    preferredAuditDate: '',
    
    // 파일 업로드
    businessLicense: null,
    organizationChart: null,
    processMap: null,
    additionalFiles: []
  });

  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const certificationTypes = [
    { value: 'iso9001', label: 'ISO 9001 (품질경영시스템)' },
    { value: 'iso14001', label: 'ISO 14001 (환경경영시스템)' },
    { value: 'iso45001', label: 'ISO 45001 (안전보건경영시스템)' },
    { value: 'esg', label: 'ESG 경영시스템' },
    { value: 'integrated', label: '통합 인증 (2개 이상)' }
  ];

  const employeeRanges = [
    { value: '1-10', label: '1-10명', baseCost: 2000000 },
    { value: '11-30', label: '11-30명', baseCost: 2500000 },
    { value: '31-50', label: '31-50명', baseCost: 3000000 },
    { value: '51-100', label: '51-100명', baseCost: 3500000 },
    { value: '101-300', label: '101-300명', baseCost: 4500000 },
    { value: '301-500', label: '301-500명', baseCost: 5500000 },
    { value: '500+', label: '500명 이상', baseCost: 6500000 }
  ];

  const industries = [
    '제조업',
    '건설업',
    '서비스업',
    'IT/소프트웨어',
    '유통/물류',
    '금융/보험',
    '의료/제약',
    '교육',
    '기타'
  ];

  const calculateCost = () => {
    const employeeRange = employeeRanges.find(r => r.value === formData.employeeCount);
    if (!employeeRange) return;

    let cost = employeeRange.baseCost;
    
    // 인증 유형에 따른 추가 비용
    if (formData.certificationType === 'esg') {
      cost *= 1.2;
    } else if (formData.certificationType === 'integrated') {
      cost *= 1.8;
    }

    setEstimatedCost(cost);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 직원수나 인증 유형 변경 시 비용 재계산
    if (field === 'employeeCount' || field === 'certificationType') {
      calculateCost();
    }
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    handleInputChange(field, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 여기에 실제 제출 로직 구현
      // API 호출 등
      
      // 성공 시 완료 페이지로 이동
      setTimeout(() => {
        router.push('/esg-certification/apply/complete');
      }, 2000);
    } catch (error) {
      console.error('신청 중 오류 발생:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.companyName && formData.businessNumber && 
               formData.ceoName && formData.industry && formData.employeeCount;
      case 2:
        return formData.contactName && formData.contactEmail && 
               formData.contactPhone && formData.contactPosition;
      case 3:
        return formData.certificationType && formData.certificationScope;
      default:
        return false;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">온라인 인증 신청</h1>
            <p className="text-gray-600">
              아래 정보를 입력하여 인증 신청을 완료하세요
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  step < 4 ? 'border-r border-gray-300' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    currentStep >= step
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    step
                  )}
                </div>
                <p className="text-sm font-medium">
                  {step === 1 && '기업 정보'}
                  {step === 2 && '담당자 정보'}
                  {step === 3 && '인증 정보'}
                  {step === 4 && '서류 제출'}
                </p>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent className="p-6">
                {/* Step 1: 기업 정보 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">기업 정보</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">기업명 *</Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="(주)예시기업"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessNumber">사업자등록번호 *</Label>
                        <Input
                          id="businessNumber"
                          value={formData.businessNumber}
                          onChange={(e) => handleInputChange('businessNumber', e.target.value)}
                          placeholder="000-00-00000"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ceoName">대표자명 *</Label>
                        <Input
                          id="ceoName"
                          value={formData.ceoName}
                          onChange={(e) => handleInputChange('ceoName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="industry">업종 *</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => handleInputChange('industry', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="업종 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="companyAddress">회사 주소</Label>
                      <Input
                        id="companyAddress"
                        value={formData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        placeholder="전체 주소를 입력하세요"
                      />
                    </div>

                    <div>
                      <Label htmlFor="employeeCount">직원수 *</Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => handleInputChange('employeeCount', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="직원수 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: 담당자 정보 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">담당자 정보</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">담당자명 *</Label>
                        <Input
                          id="contactName"
                          value={formData.contactName}
                          onChange={(e) => handleInputChange('contactName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPosition">직책 *</Label>
                        <Input
                          id="contactPosition"
                          value={formData.contactPosition}
                          onChange={(e) => handleInputChange('contactPosition', e.target.value)}
                          placeholder="예: 품질관리팀장"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactEmail">이메일 *</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          placeholder="example@company.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">연락처 *</Label>
                        <Input
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          placeholder="010-0000-0000"
                          required
                        />
                      </div>
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        담당자 정보는 인증 심사 진행 시 연락을 위해 사용됩니다.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {/* Step 3: 인증 정보 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">인증 정보</h2>
                    
                    <div>
                      <Label htmlFor="certificationType">인증 규격 *</Label>
                      <Select
                        value={formData.certificationType}
                        onValueChange={(value) => handleInputChange('certificationType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="인증 규격 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="certificationScope">인증 범위 *</Label>
                      <Textarea
                        id="certificationScope"
                        value={formData.certificationScope}
                        onChange={(e) => handleInputChange('certificationScope', e.target.value)}
                        placeholder="인증 받고자 하는 사업 범위를 구체적으로 기술해주세요"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <Label>기존 인증 보유 여부</Label>
                      <RadioGroup
                        value={formData.hasExistingCertification}
                        onValueChange={(value) => handleInputChange('hasExistingCertification', value)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes">예</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no">아니오</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {formData.hasExistingCertification === 'yes' && (
                      <div>
                        <Label htmlFor="existingCertificationDetails">기존 인증 정보</Label>
                        <Textarea
                          id="existingCertificationDetails"
                          value={formData.existingCertificationDetails}
                          onChange={(e) => handleInputChange('existingCertificationDetails', e.target.value)}
                          placeholder="보유 중인 인증 규격, 인증기관, 유효기간 등을 입력해주세요"
                          rows={3}
                        />
                      </div>
                    )}

                    {/* 예상 비용 */}
                    {estimatedCost > 0 && (
                      <Card className="bg-green-50 border-green-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            예상 심사 비용
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-green-700">
                            {estimatedCost.toLocaleString()}원
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            * 실제 비용은 심사 범위와 복잡도에 따라 달라질 수 있습니다.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 4: 서류 제출 */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">서류 제출</h2>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        파일은 PDF, DOC, DOCX, HWP 형식만 가능하며, 각 파일당 최대 10MB까지 업로드 가능합니다.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="businessLicense">사업자등록증 *</Label>
                        <div className="mt-2">
                          <Input
                            id="businessLicense"
                            type="file"
                            accept=".pdf,.doc,.docx,.hwp"
                            onChange={(e) => handleFileUpload('businessLicense', e.target.files)}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="organizationChart">조직도</Label>
                        <div className="mt-2">
                          <Input
                            id="organizationChart"
                            type="file"
                            accept=".pdf,.doc,.docx,.hwp,.ppt,.pptx"
                            onChange={(e) => handleFileUpload('organizationChart', e.target.files)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="processMap">프로세스맵</Label>
                        <div className="mt-2">
                          <Input
                            id="processMap"
                            type="file"
                            accept=".pdf,.doc,.docx,.hwp,.ppt,.pptx"
                            onChange={(e) => handleFileUpload('processMap', e.target.files)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specialRequirements">추가 요청사항</Label>
                      <Textarea
                        id="specialRequirements"
                        value={formData.specialRequirements}
                        onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                        placeholder="심사 시 특별히 요청하실 사항이 있으면 입력해주세요"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredAuditDate">희망 심사 일정</Label>
                      <Input
                        id="preferredAuditDate"
                        type="date"
                        value={formData.preferredAuditDate}
                        onChange={(e) => handleInputChange('preferredAuditDate', e.target.value)}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <Label htmlFor="terms" className="text-sm">
                        인증 신청 약관 및 개인정보 처리방침에 동의합니다. *
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      이전
                    </Button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepComplete(currentStep)}
                      >
                        다음
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            제출 중...
                          </>
                        ) : (
                          '신청서 제출'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </main>
  );
} 