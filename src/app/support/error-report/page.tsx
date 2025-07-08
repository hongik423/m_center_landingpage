'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Send, CheckCircle, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ErrorReportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    title: '',
    description: '',
    steps: '',
    browser: '',
    device: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 실제 구현에서는 API 호출이나 이메일 전송 로직이 들어갑니다
      await new Promise(resolve => setTimeout(resolve, 2000)); // 임시 딜레이
      
      toast({
        title: "오류 신고가 접수되었습니다",
        description: "빠른 시일 내에 확인 후 답변드리겠습니다. 감사합니다!",
      });

      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        title: '',
        description: '',
        steps: '',
        browser: '',
        device: ''
      });
    } catch (error) {
      toast({
        title: "전송 실패",
        description: "오류 신고 전송 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-100 text-red-700 rounded-full mb-6">
            <AlertTriangle className="h-6 w-6" />
            <span className="font-bold text-lg">시스템 오류 신고</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            문제를 발견하셨나요?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            M-CENTER 서비스 이용 중 발생한 오류나 문제점을 신고해주세요. <br />
            빠른 시일 내에 확인하여 개선하겠습니다.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 신고 폼 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    오류 신고 폼
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">이름 *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="홍길동"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">이메일 *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="hong@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">연락처</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="010-1234-5678"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">오류 분류 *</Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">분류를 선택하세요</option>
                          <option value="calculation">계산 오류</option>
                          <option value="ui">화면 표시 문제</option>
                          <option value="function">기능 동작 오류</option>
                          <option value="performance">성능 이슈</option>
                          <option value="data">데이터 오류</option>
                          <option value="mobile">모바일 이슈</option>
                          <option value="other">기타</option>
                        </select>
                      </div>
                    </div>

                    {/* 오류 상세 */}
                    <div>
                      <Label htmlFor="title">오류 제목 *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="발생한 오류를 간단히 요약해주세요"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">오류 상세 설명 *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        placeholder="어떤 문제가 발생했는지 자세히 설명해주세요..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="steps">재현 단계</Label>
                      <Textarea
                        id="steps"
                        name="steps"
                        value={formData.steps}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="문제를 재현할 수 있는 단계를 순서대로 적어주세요&#10;1. 투자타당성분석기 접속&#10;2. 투자액 95억원 입력&#10;3. 분석 실행&#10;4. 오류 발생"
                      />
                    </div>

                    {/* 환경 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="browser">브라우저</Label>
                        <Input
                          id="browser"
                          name="browser"
                          value={formData.browser}
                          onChange={handleInputChange}
                          placeholder="Chrome 119, Safari 17 등"
                        />
                      </div>
                      <div>
                        <Label htmlFor="device">기기 정보</Label>
                        <Input
                          id="device"
                          name="device"
                          value={formData.device}
                          onChange={handleInputChange}
                          placeholder="Windows 11, iPhone 15, Android 등"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          전송 중...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          오류 신고 제출
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* 긴급 연락처 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">긴급 연락처</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">전화 상담</p>
                        <p className="text-sm text-gray-600">010-9251-9743</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold">이메일 문의</p>
                        <p className="text-sm text-gray-600">support@mcenter.co.kr</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 자주 발생하는 문제 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">자주 발생하는 문제</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="font-semibold text-yellow-800">계산 결과 오류</p>
                        <p className="text-yellow-700">세금계산기나 투자분석 결과가 이상할 때</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-semibold text-blue-800">화면 표시 문제</p>
                        <p className="text-blue-700">모바일에서 화면이 깨지거나 안 보일 때</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="font-semibold text-red-800">기능 동작 안됨</p>
                        <p className="text-red-700">버튼 클릭이나 입력이 안 될 때</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 처리 과정 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">처리 과정</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>신고 접수 (즉시)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>문제 확인 (1일 이내)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>수정 및 배포 (3일 이내)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>결과 안내 (완료 즉시)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 