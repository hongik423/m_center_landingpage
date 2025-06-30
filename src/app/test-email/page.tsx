'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Send, TestTube, Loader2 } from 'lucide-react';

export default function EmailTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 테스트 데이터
  const [testData, setTestData] = useState({
    name: '홍길동',
    email: 'test@example.com',
    phone: '010-9251-9743',
    company: '테스트회사',
    consultationType: 'phone'
  });

  // Google Apps Script 연결 테스트
  const testGoogleScript = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      toast({
        title: "🧪 Google Apps Script 연결 테스트 시작",
        description: "서버 연결 상태를 확인합니다...",
      });

      const response = await fetch('/api/test-system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'google-script-connection',
          data: testData
        })
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: 'Google Apps Script 연결',
        status: result.success ? 'success' : 'failed',
        duration: `${duration}ms`,
        message: result.message,
        details: result.data,
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      if (result.success) {
        toast({
          title: "✅ Google Apps Script 연결 성공",
          description: `응답시간: ${duration}ms`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "❌ Google Apps Script 연결 실패",
          description: result.error || '알 수 없는 오류',
        });
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: 'Google Apps Script 연결',
        status: 'error',
        duration: `${duration}ms`,
        message: error instanceof Error ? error.message : '네트워크 오류',
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      toast({
        variant: "destructive",
        title: "🔥 테스트 실행 오류",
        description: "네트워크 연결을 확인해주세요",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 상담신청 이메일 테스트
  const testConsultationEmail = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      toast({
        title: "📧 상담신청 이메일 테스트 시작",
        description: "실제 메일 발송을 테스트합니다...",
      });

      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testData,
          privacyConsent: true,
          consultationArea: 'test',
          inquiryContent: '이메일 발송 테스트입니다.',
          preferredTime: 'morning'
        })
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: '상담신청 이메일',
        status: result.success ? 'success' : 'failed',
        duration: `${duration}ms`,
        message: result.message,
        details: result,
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      if (result.success) {
        toast({
          title: "✅ 상담신청 이메일 테스트 성공",
          description: `처리시간: ${duration}ms`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "❌ 상담신청 이메일 테스트 실패",
          description: result.error || '알 수 없는 오류',
        });
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: '상담신청 이메일',
        status: 'error',
        duration: `${duration}ms`,
        message: error instanceof Error ? error.message : '네트워크 오류',
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      toast({
        variant: "destructive",
        title: "🔥 테스트 실행 오류",
        description: "네트워크 연결을 확인해주세요",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 진단 이메일 테스트
  const testDiagnosisEmail = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      toast({
        title: "🔬 진단 이메일 테스트 시작",
        description: "진단 결과 메일 발송을 테스트합니다...",
      });

      const response = await fetch('/api/simplified-diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: testData.company,
          industry: 'technology',
          contactManager: testData.name,
          email: testData.email,
          employeeCount: '10-30',
          growthStage: 'growth',
          businessLocation: '서울',
          mainConcerns: '매출 증대',
          expectedBenefits: '효율성 향상',
          privacyConsent: true,
          submitDate: new Date().toISOString()
        })
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: '진단 이메일',
        status: result.success ? 'success' : 'failed',
        duration: `${duration}ms`,
        message: result.message,
        details: result,
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      if (result.success) {
        toast({
          title: "✅ 진단 이메일 테스트 성공",
          description: `처리시간: ${duration}ms`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "❌ 진단 이메일 테스트 실패",
          description: result.error || '알 수 없는 오류',
        });
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => [...prev, {
        id: Date.now(),
        test: '진단 이메일',
        status: 'error',
        duration: `${duration}ms`,
        message: error instanceof Error ? error.message : '네트워크 오류',
        timestamp: new Date().toLocaleString('ko-KR')
      }]);

      toast({
        variant: "destructive",
        title: "🔥 테스트 실행 오류",
        description: "네트워크 연결을 확인해주세요",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 모든 테스트 실행
  const runAllTests = async () => {
    setTestResults([]);
    await testGoogleScript();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testConsultationEmail();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await testDiagnosisEmail();
  };

  // 결과 초기화
  const clearResults = () => {
    setTestResults([]);
    toast({
      title: "🧹 테스트 결과 초기화",
      description: "모든 테스트 기록이 삭제되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📧 이메일 발송 시스템 테스트
          </h1>
          <p className="text-xl text-gray-600">
            상담신청, 무료진단 메일 발송 기능을 테스트합니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 테스트 설정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                테스트 설정
              </CardTitle>
              <CardDescription>
                테스트에 사용할 데이터를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">이름</label>
                  <Input
                    value={testData.name}
                    onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">이메일</label>
                  <Input
                    type="email"
                    value={testData.email}
                    onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="test@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <PhoneInput
                    label="연락처"
                    value={testData.phone}
                    onChange={(value) => setTestData(prev => ({ ...prev, phone: value }))}
                    placeholder="010-9251-9743"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">회사명</label>
                  <Input
                    value={testData.company}
                    onChange={(e) => setTestData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="테스트회사"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-lg font-semibold text-gray-900">개별 테스트</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={testGoogleScript}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Google Apps Script 연결 테스트
                  </Button>
                  
                  <Button
                    onClick={testConsultationEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    상담신청 이메일 테스트
                  </Button>
                  
                  <Button
                    onClick={testDiagnosisEmail}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    진단 이메일 테스트
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button
                    onClick={runAllTests}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TestTube className="w-4 h-4 mr-2" />}
                    전체 테스트 실행
                  </Button>
                  
                  <Button
                    onClick={clearResults}
                    disabled={isLoading}
                    variant="destructive"
                    className="w-full"
                  >
                    결과 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 테스트 결과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                테스트 결과
                {testResults.length > 0 && (
                  <Badge variant="secondary">{testResults.length}개</Badge>
                )}
              </CardTitle>
              <CardDescription>
                실시간 테스트 결과 및 상태를 확인합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>아직 테스트를 실행하지 않았습니다.</p>
                  <p className="text-sm">좌측에서 테스트를 실행해보세요.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-4 rounded-lg border-2 ${
                        result.status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : result.status === 'failed'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-yellow-50 border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : result.status === 'failed' ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          )}
                          <span className="font-semibold">{result.test}</span>
                        </div>
                        <Badge
                          variant={
                            result.status === 'success'
                              ? 'default'
                              : result.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {result.status === 'success' ? '성공' : result.status === 'failed' ? '실패' : '오류'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>처리시간: {result.duration}</span>
                        <span>{result.timestamp}</span>
                      </div>
                      
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer">상세 정보</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 환경 정보 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔧 환경 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Google Script URL:</span>
                <p className="text-gray-600 truncate">
                  {process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL ? '설정됨' : '미설정'}
                </p>
              </div>
              <div>
                <span className="font-medium">환경:</span>
                <p className="text-gray-600">{process.env.NODE_ENV}</p>
              </div>
              <div>
                <span className="font-medium">시간:</span>
                <p className="text-gray-600">{new Date().toLocaleString('ko-KR')}</p>
              </div>
              <div>
                <span className="font-medium">브라우저:</span>
                <p className="text-gray-600">{typeof window !== 'undefined' ? 'Client' : 'Server'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 