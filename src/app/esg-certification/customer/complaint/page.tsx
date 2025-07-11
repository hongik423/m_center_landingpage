'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Upload,
  Search,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Users,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ComplaintForm {
  type: '불만' | '이의제기';
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  certificationNumber: string;
  subject: string;
  content: string;
  attachments: File[];
}

interface ComplaintStatus {
  receiptNumber: string;
  status: '접수' | '검토중' | '처리중' | '완료';
  submittedDate: string;
  currentStep: number;
  history: {
    date: string;
    status: string;
    description: string;
  }[];
}

export default function ComplaintPage() {
  const [activeTab, setActiveTab] = useState('process');
  const [formData, setFormData] = useState<ComplaintForm>({
    type: '불만',
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    certificationNumber: '',
    subject: '',
    content: '',
    attachments: []
  });
  const [searchReceiptNumber, setSearchReceiptNumber] = useState('');
  const [complaintStatus, setComplaintStatus] = useState<ComplaintStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; receiptNumber?: string } | null>(null);

  const processSteps = [
    {
      number: 1,
      title: '접수',
      description: '불만/이의제기 접수 및 접수번호 발급',
      icon: <FileText className="h-6 w-6" />
    },
    {
      number: 2,
      title: '내용 검토',
      description: '접수된 내용의 타당성 및 세부사항 검토',
      icon: <Search className="h-6 w-6" />
    },
    {
      number: 3,
      title: '조사',
      description: '관련 부서 조사 및 사실관계 확인',
      icon: <Users className="h-6 w-6" />
    },
    {
      number: 4,
      title: '원인 분석',
      description: '문제 발생 원인 분석 및 개선방안 도출',
      icon: <AlertCircle className="h-6 w-6" />
    },
    {
      number: 5,
      title: '시정조치',
      description: '필요시 시정조치 실시 및 재발방지 대책 수립',
      icon: <Shield className="h-6 w-6" />
    },
    {
      number: 6,
      title: '결과 통보',
      description: '처리 결과 고객 통보 및 피드백 수렴',
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      number: 7,
      title: '종결',
      description: '처리 완료 및 기록 보관',
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제로는 API 호출
    setTimeout(() => {
      const receiptNumber = `ESG-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setSubmitResult({ success: true, receiptNumber });
      setIsSubmitting(false);
      setActiveTab('status');
    }, 2000);
  };

  const handleStatusSearch = () => {
    // 실제로는 API 호출
    if (searchReceiptNumber) {
      setComplaintStatus({
        receiptNumber: searchReceiptNumber,
        status: '처리중',
        submittedDate: '2024-02-10',
        currentStep: 3,
        history: [
          {
            date: '2024-02-10 09:30',
            status: '접수',
            description: '불만사항이 정상적으로 접수되었습니다.'
          },
          {
            date: '2024-02-11 14:20',
            status: '검토중',
            description: '담당부서에서 내용을 검토하고 있습니다.'
          },
          {
            date: '2024-02-13 10:15',
            status: '처리중',
            description: '관련 부서 조사가 진행 중입니다.'
          }
        ]
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              불만 및 이의제기
            </h1>
            <p className="text-xl text-gray-100">
              고객의 소중한 의견을 듣고 개선하겠습니다
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="process">처리 프로세스</TabsTrigger>
                <TabsTrigger value="submit">온라인 접수</TabsTrigger>
                <TabsTrigger value="status">처리현황 조회</TabsTrigger>
              </TabsList>

              {/* 처리 프로세스 */}
              <TabsContent value="process" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">불만/이의제기 처리 절차</CardTitle>
                    <CardDescription>
                      고객의 불만사항과 이의제기를 신속하고 공정하게 처리합니다
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Process Timeline */}
                    <div className="relative">
                      {processSteps.map((step, index) => (
                        <div key={step.number} className="flex items-start mb-8 last:mb-0">
                          <div className="flex flex-col items-center mr-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {step.icon}
                            </div>
                            {index < processSteps.length - 1 && (
                              <div className="w-0.5 h-20 bg-gray-300 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">
                              {step.number}. {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Processing Time */}
                    <Alert className="mt-8">
                      <Clock className="h-4 w-4" />
                      <AlertTitle>처리 기간</AlertTitle>
                      <AlertDescription>
                        접수일로부터 14일 이내 처리를 원칙으로 하며, 복잡한 사안의 경우 30일까지 연장될 수 있습니다.
                        처리 기간 연장 시 사전에 고객님께 안내드립니다.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Phone className="h-5 w-5 mr-2" />
                        전화 접수
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600 mb-2">02-588-5114</p>
                      <p className="text-gray-600">평일 09:00 ~ 18:00</p>
                      <p className="text-sm text-gray-500 mt-2">
                        점심시간 12:00 ~ 13:00 제외
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Mail className="h-5 w-5 mr-2" />
                        이메일 접수
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl font-bold text-green-600 mb-2">complaint@esgrr.co.kr</p>
                      <p className="text-gray-600">24시간 접수 가능</p>
                      <p className="text-sm text-gray-500 mt-2">
                        영업일 기준 1일 이내 회신
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 온라인 접수 */}
              <TabsContent value="submit" className="space-y-8">
                {submitResult ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">접수가 완료되었습니다</h2>
                      <p className="text-gray-600 mb-4">
                        접수번호: <span className="font-bold text-green-600">{submitResult.receiptNumber}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        접수번호를 통해 처리 현황을 조회하실 수 있습니다.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={() => {
                            setActiveTab('status');
                            setSearchReceiptNumber(submitResult.receiptNumber || '');
                          }}
                        >
                          처리현황 조회
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSubmitResult(null);
                            setFormData({
                              type: '불만',
                              companyName: '',
                              contactPerson: '',
                              email: '',
                              phone: '',
                              certificationNumber: '',
                              subject: '',
                              content: '',
                              attachments: []
                            });
                          }}
                        >
                          새로운 접수
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <Card>
                      <CardHeader>
                        <CardTitle>불만/이의제기 접수</CardTitle>
                        <CardDescription>
                          아래 양식을 작성하여 불만사항 또는 이의제기를 접수해 주세요
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Type Selection */}
                        <div className="space-y-3">
                          <Label>접수 유형 *</Label>
                          <RadioGroup 
                            value={formData.type} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as '불만' | '이의제기' }))}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="불만" id="complaint" />
                              <Label htmlFor="complaint">불만</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="이의제기" id="appeal" />
                              <Label htmlFor="appeal">이의제기</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Company Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="companyName">기업명 *</Label>
                            <Input
                              id="companyName"
                              value={formData.companyName}
                              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="certificationNumber">인증번호</Label>
                            <Input
                              id="certificationNumber"
                              value={formData.certificationNumber}
                              onChange={(e) => setFormData(prev => ({ ...prev, certificationNumber: e.target.value }))}
                              placeholder="ESG-XXXX-XXXX"
                            />
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contactPerson">담당자명 *</Label>
                            <Input
                              id="contactPerson"
                              value={formData.contactPerson}
                              onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">연락처 *</Label>
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

                        <div className="space-y-2">
                          <Label htmlFor="email">이메일 *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">제목 *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content">내용 * (최소 100자)</Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            rows={8}
                            minLength={100}
                            required
                            placeholder="불만사항 또는 이의제기 내용을 상세히 작성해 주세요."
                          />
                          <p className="text-sm text-gray-500">
                            {formData.content.length}/100자
                          </p>
                        </div>

                        {/* File Upload */}
                        <div className="space-y-2">
                          <Label>첨부파일</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                              accept=".pdf,.doc,.docx,.hwp,.jpg,.jpeg,.png"
                            />
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center cursor-pointer"
                            >
                              <Upload className="h-12 w-12 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">
                                클릭하여 파일을 선택하거나 드래그하여 업로드
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                PDF, DOC, HWP, JPG, PNG (최대 10MB)
                              </span>
                            </label>
                          </div>
                          
                          {formData.attachments.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {formData.attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{file.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    삭제
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                          <Button type="button" variant="outline">
                            취소
                          </Button>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? '접수 중...' : '접수하기'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </form>
                )}
              </TabsContent>

              {/* 처리현황 조회 */}
              <TabsContent value="status" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>처리현황 조회</CardTitle>
                    <CardDescription>
                      접수번호를 입력하여 처리 진행상황을 확인하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-8">
                      <Input
                        placeholder="접수번호 입력 (예: ESG-2024-0001)"
                        value={searchReceiptNumber}
                        onChange={(e) => setSearchReceiptNumber(e.target.value)}
                      />
                      <Button onClick={handleStatusSearch}>
                        조회
                      </Button>
                    </div>

                    {complaintStatus && (
                      <div className="space-y-6">
                        {/* Status Overview */}
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">접수번호</p>
                              <p className="font-semibold">{complaintStatus.receiptNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">접수일</p>
                              <p className="font-semibold">{complaintStatus.submittedDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">현재 상태</p>
                              <Badge className={
                                complaintStatus.status === '완료' ? 'bg-green-100 text-green-700' :
                                complaintStatus.status === '처리중' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }>
                                {complaintStatus.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">처리 진행률</span>
                            <span className="text-sm text-gray-600">
                              {Math.round((complaintStatus.currentStep / 7) * 100)}%
                            </span>
                          </div>
                          <Progress value={(complaintStatus.currentStep / 7) * 100} className="h-2" />
                        </div>

                        {/* Process Steps Status */}
                        <div className="space-y-3">
                          {processSteps.map((step, index) => (
                            <div 
                              key={step.number}
                              className={`flex items-center p-3 rounded-lg ${
                                index < complaintStatus.currentStep 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                index < complaintStatus.currentStep 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-300 text-gray-600'
                              }`}>
                                {index < complaintStatus.currentStep ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  step.number
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${
                                  index < complaintStatus.currentStep ? 'text-green-700' : 'text-gray-600'
                                }`}>
                                  {step.title}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* History */}
                        <div>
                          <h3 className="font-semibold mb-3">처리 이력</h3>
                          <div className="space-y-3">
                            {complaintStatus.history.map((item, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-white border rounded-lg">
                                <div className="text-gray-500">
                                  <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium">{item.status}</span>
                                    <span className="text-sm text-gray-500">{item.date}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
} 