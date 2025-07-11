'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Building,
  Users,
  Calendar,
  FileText,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConsultationForm {
  consultationType: string;
  companyName: string;
  businessNumber: string;
  industry: string;
  employeeCount: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  currentCertifications: string[];
  consultationContent: string;
  marketingAgree: boolean;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ConsultationForm>({
    consultationType: '',
    companyName: '',
    businessNumber: '',
    industry: '',
    employeeCount: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    currentCertifications: [],
    consultationContent: '',
    marketingAgree: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const consultationTypes = [
    { value: 'esg-new', label: 'ESG 신규 인증 상담' },
    { value: 'iso-integration', label: 'ISO 통합 인증 상담' },
    { value: 'renewal', label: '인증 갱신 상담' },
    { value: 'education', label: '교육 과정 상담' },
    { value: 'other', label: '기타 문의' }
  ];

  const industries = [
    '제조업',
    '건설업',
    'IT/소프트웨어',
    '서비스업',
    '유통/물류',
    '금융/보험',
    '의료/제약',
    '교육',
    '기타'
  ];

  const certifications = [
    { id: 'iso9001', label: 'ISO 9001' },
    { id: 'iso14001', label: 'ISO 14001' },
    { id: 'iso45001', label: 'ISO 45001' },
    { id: 'iso50001', label: 'ISO 50001' },
    { id: 'none', label: '보유 인증 없음' }
  ];

  const handleCertificationChange = (certId: string, checked: boolean) => {
    if (certId === 'none' && checked) {
      setFormData(prev => ({ ...prev, currentCertifications: ['none'] }));
    } else if (certId !== 'none' && checked) {
      setFormData(prev => ({
        ...prev,
        currentCertifications: prev.currentCertifications.filter(id => id !== 'none').concat(certId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        currentCertifications: prev.currentCertifications.filter(id => id !== certId)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제로는 API 호출
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  if (submitSuccess) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">상담 신청이 완료되었습니다!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  영업일 기준 1일 이내에 담당자가 연락드리겠습니다.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <p className="text-sm text-gray-600 mb-2">문의 전화</p>
                  <p className="text-xl font-bold text-green-600">02-588-5114</p>
                </div>
                <Button 
                  onClick={() => {
                    setSubmitSuccess(false);
                    setFormData({
                      consultationType: '',
                      companyName: '',
                      businessNumber: '',
                      industry: '',
                      employeeCount: '',
                      contactPerson: '',
                      position: '',
                      email: '',
                      phone: '',
                      preferredDate: '',
                      preferredTime: '',
                      currentCertifications: [],
                      consultationContent: '',
                      marketingAgree: false
                    });
                  }}
                  variant="outline"
                >
                  새로운 상담 신청
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              무료 상담 신청
            </h1>
            <p className="text-xl text-gray-100">
              ESG 인증 전문가가 맞춤형 상담을 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">전화 상담</h3>
                  <p className="text-lg font-bold text-green-600">02-588-5114</p>
                  <p className="text-sm text-gray-500">평일 09:00-18:00</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">이메일</h3>
                  <p className="text-sm font-medium">ycpark55@naver.com</p>
                  <p className="text-sm text-gray-500">24시간 접수</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">방문 상담</h3>
                  <p className="text-sm">서울시 강남구</p>
                  <p className="text-sm text-gray-500">사전 예약 필수</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">상담 시간</h3>
                  <p className="text-sm">평균 1시간</p>
                  <p className="text-sm text-gray-500">맞춤형 상담</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* 상담 유형 */}
                <Card>
                  <CardHeader>
                    <CardTitle>상담 유형 선택</CardTitle>
                    <CardDescription>
                      원하시는 상담 유형을 선택해 주세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup 
                      value={formData.consultationType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, consultationType: value }))}
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        {consultationTypes.map((type) => (
                          <div key={type.value} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* 기업 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle>기업 정보</CardTitle>
                    <CardDescription>
                      정확한 상담을 위해 기업 정보를 입력해 주세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">
                          기업명 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessNumber">사업자등록번호</Label>
                        <Input
                          id="businessNumber"
                          value={formData.businessNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, businessNumber: e.target.value }))}
                          placeholder="000-00-00000"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">
                          업종 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="업종을 선택하세요" />
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
                      <div className="space-y-2">
                        <Label htmlFor="employeeCount">
                          직원 수 <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.employeeCount}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="직원 수를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10명</SelectItem>
                            <SelectItem value="11-50">11-50명</SelectItem>
                            <SelectItem value="51-100">51-100명</SelectItem>
                            <SelectItem value="101-300">101-300명</SelectItem>
                            <SelectItem value="301-500">301-500명</SelectItem>
                            <SelectItem value="500+">500명 이상</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>현재 보유 인증</Label>
                      <div className="grid md:grid-cols-3 gap-3">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={cert.id}
                              checked={formData.currentCertifications.includes(cert.id)}
                              onCheckedChange={(checked) => handleCertificationChange(cert.id, checked as boolean)}
                            />
                            <Label htmlFor={cert.id} className="cursor-pointer">
                              {cert.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 담당자 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle>담당자 정보</CardTitle>
                    <CardDescription>
                      상담 담당자의 연락처를 입력해 주세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">
                          담당자명 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">직책</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="예: 품질관리팀장"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          이메일 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          연락처 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="010-0000-0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">희망 상담일</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">희망 시간대</Label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, preferredTime: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="시간대를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">오전 (09:00-12:00)</SelectItem>
                            <SelectItem value="afternoon">오후 (13:00-18:00)</SelectItem>
                            <SelectItem value="anytime">상관없음</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상담 내용 */}
                <Card>
                  <CardHeader>
                    <CardTitle>상담 내용</CardTitle>
                    <CardDescription>
                      구체적인 상담 내용을 작성해 주시면 더 정확한 답변을 드릴 수 있습니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.consultationContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, consultationContent: e.target.value }))}
                      rows={6}
                      placeholder="예: ESG 인증을 준비하고 있는데, 필요한 준비사항과 소요 기간이 궁금합니다."
                    />
                  </CardContent>
                </Card>

                {/* 개인정보 동의 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          <strong>개인정보 수집 및 이용 동의</strong><br />
                          수집 항목: 기업명, 담당자명, 연락처, 이메일<br />
                          수집 목적: 상담 신청 처리 및 결과 안내<br />
                          보유 기간: 상담 완료 후 1년
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketingAgree"
                          checked={formData.marketingAgree}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketingAgree: checked as boolean }))}
                        />
                        <Label htmlFor="marketingAgree" className="cursor-pointer">
                          (선택) 마케팅 정보 수신 동의
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="px-8"
                    disabled={isSubmitting || !formData.consultationType || !formData.companyName || !formData.industry || !formData.employeeCount || !formData.contactPerson || !formData.email || !formData.phone}
                  >
                    {isSubmitting ? (
                      <>처리 중...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        무료 상담 신청하기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
} 