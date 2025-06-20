'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Play, Loader2 } from 'lucide-react';

interface SystemStatus {
  timestamp: string;
  status: string;
  googleSheets: {
    configured: boolean;
    scriptUrl: string;
    sheetsId: string;
  };
  emailService: {
    configured: boolean;
    serviceId: string;
    isSimulation: boolean;
  };
  baseConfig: {
    environment: string;
    baseUrl: string;
  };
  availableFeatures: string[];
}

interface TestResult {
  success: boolean;
  message?: string;
  error?: string;
  platform?: string;
  service?: string;
  isSimulation?: boolean;
}

interface TestResults {
  timestamp: string;
  testType: string;
  results: {
    googleSheets?: TestResult;
    emailService?: TestResult;
    consultation?: TestResult;
  };
}

export default function SystemTestPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<'full' | 'googlesheets' | 'email' | 'consultation'>('full');

  // 시스템 상태 확인
  const checkSystemStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/test-system');
      const data = await response.json();
      
      if (data.success) {
        setSystemStatus(data.data);
      } else {
        console.error('시스템 상태 확인 실패:', data.error);
      }
    } catch (error) {
      console.error('시스템 상태 확인 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 시스템 테스트 실행
  const runSystemTest = async (type: typeof testType) => {
    try {
      setIsLoading(true);
      setTestType(type);
      
      const response = await fetch('/api/test-system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType: type }),
      });
      
      const data = await response.json();
      setTestResults(data.data);
      
    } catch (error) {
      console.error('시스템 테스트 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 시스템 상태 확인
  useEffect(() => {
    checkSystemStatus();
  }, []);

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (configured: boolean) => {
    return configured ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        설정완료
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        미설정
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">M-CENTER 시스템 연동 테스트</h1>
        <p className="text-gray-600">구글시트와 이메일 발송 시스템의 연동 상태를 확인하고 테스트합니다.</p>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">시스템 상태</TabsTrigger>
          <TabsTrigger value="test">연동 테스트</TabsTrigger>
          <TabsTrigger value="results">테스트 결과</TabsTrigger>
        </TabsList>

        {/* 시스템 상태 탭 */}
        <TabsContent value="status" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">현재 시스템 상태</h2>
            <Button onClick={checkSystemStatus} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              상태 새로고침
            </Button>
          </div>

          {systemStatus && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* 구글시트 연동 상태 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.googleSheets.configured)}
                    구글시트 연동
                  </CardTitle>
                  <CardDescription>
                    Google Apps Script와의 연동 상태를 확인합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>연동 상태:</span>
                    {getStatusBadge(systemStatus.googleSheets.configured)}
                  </div>
                  <div className="text-sm">
                    <p><strong>Script URL:</strong></p>
                    <p className="text-gray-600 break-all">{systemStatus.googleSheets.scriptUrl}</p>
                  </div>
                  <div className="text-sm">
                    <p><strong>Sheets ID:</strong></p>
                    <p className="text-gray-600">{systemStatus.googleSheets.sheetsId}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 이메일 서비스 상태 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.emailService.configured)}
                    이메일 서비스
                  </CardTitle>
                  <CardDescription>
                    EmailJS를 통한 이메일 발송 상태를 확인합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>서비스 상태:</span>
                    {systemStatus.emailService.isSimulation ? (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        시뮬레이션
                      </Badge>
                    ) : getStatusBadge(systemStatus.emailService.configured)}
                  </div>
                  <div className="text-sm">
                    <p><strong>Service ID:</strong></p>
                    <p className="text-gray-600">{systemStatus.emailService.serviceId}</p>
                  </div>
                  {systemStatus.emailService.isSimulation && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        현재 시뮬레이션 모드로 동작 중입니다. 실제 이메일이 발송되지 않습니다.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 기본 설정 */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>기본 설정 및 사용 가능한 기능</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">환경:</p>
                      <p className="text-gray-600">{systemStatus.baseConfig.environment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">기본 URL:</p>
                      <p className="text-gray-600 break-all">{systemStatus.baseConfig.baseUrl}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">사용 가능한 기능:</p>
                    <div className="space-y-1">
                      {systemStatus.availableFeatures.map((feature, index) => (
                        <p key={index} className="text-sm text-gray-600">{feature}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    마지막 확인: {new Date(systemStatus.timestamp).toLocaleString('ko-KR')}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* 연동 테스트 탭 */}
        <TabsContent value="test" className="space-y-6">
          <h2 className="text-2xl font-semibold">시스템 연동 테스트</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button 
              onClick={() => runSystemTest('full')} 
              disabled={isLoading}
              className="h-16 flex flex-col gap-1"
            >
              <Play className="h-5 w-5" />
              전체 테스트
            </Button>
            
            <Button 
              onClick={() => runSystemTest('googlesheets')} 
              disabled={isLoading}
              variant="outline"
              className="h-16 flex flex-col gap-1"
            >
              <Play className="h-5 w-5" />
              구글시트만
            </Button>
            
            <Button 
              onClick={() => runSystemTest('email')} 
              disabled={isLoading}
              variant="outline"
              className="h-16 flex flex-col gap-1"
            >
              <Play className="h-5 w-5" />
              이메일만
            </Button>
            
            <Button 
              onClick={() => runSystemTest('consultation')} 
              disabled={isLoading}
              variant="outline"
              className="h-16 flex flex-col gap-1"
            >
              <Play className="h-5 w-5" />
              상담신청만
            </Button>
          </div>

          {isLoading && (
            <Card>
              <CardContent className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>테스트를 실행 중입니다...</p>
                <p className="text-sm text-gray-600">테스트 유형: {testType}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 테스트 결과 탭 */}
        <TabsContent value="results" className="space-y-6">
          <h2 className="text-2xl font-semibold">테스트 결과</h2>
          
          {testResults ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>테스트 개요</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-medium">테스트 시간:</p>
                      <p className="text-gray-600">{new Date(testResults.timestamp).toLocaleString('ko-KR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">테스트 유형:</p>
                      <p className="text-gray-600">{testResults.testType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {/* 구글시트 테스트 결과 */}
                {testResults.results.googleSheets && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(testResults.results.googleSheets.success)}
                        구글시트 연동
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{testResults.results.googleSheets.message}</p>
                      {testResults.results.googleSheets.platform && (
                        <p className="text-xs text-gray-600">플랫폼: {testResults.results.googleSheets.platform}</p>
                      )}
                      {testResults.results.googleSheets.error && (
                        <p className="text-xs text-red-600">오류: {testResults.results.googleSheets.error}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 이메일 테스트 결과 */}
                {testResults.results.emailService && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(testResults.results.emailService.success)}
                        이메일 서비스
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">
                        {testResults.results.emailService.isSimulation ? '시뮬레이션 모드로 동작' : '실제 이메일 발송'}
                      </p>
                      <p className="text-xs text-gray-600">서비스: {testResults.results.emailService.service}</p>
                      {testResults.results.emailService.error && (
                        <p className="text-xs text-red-600">오류: {testResults.results.emailService.error}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 상담신청 테스트 결과 */}
                {testResults.results.consultation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(testResults.results.consultation.success)}
                        상담신청 연동
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{testResults.results.consultation.message}</p>
                      {testResults.results.consultation.platform && (
                        <p className="text-xs text-gray-600">플랫폼: {testResults.results.consultation.platform}</p>
                      )}
                      {testResults.results.consultation.error && (
                        <p className="text-xs text-red-600">오류: {testResults.results.consultation.error}</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-600">테스트를 실행하면 결과가 여기에 표시됩니다.</p>
                <p className="text-sm text-gray-500 mt-2">
                  '연동 테스트' 탭에서 테스트를 실행해 주세요.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 