'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { checkGoogleScriptStatus, getEmailServiceConfig } from '@/lib/utils/emailService';
import { Mail, CheckCircle, AlertCircle, Loader2, Settings, Database, Send } from 'lucide-react';

interface GoogleScriptStatus {
  success: boolean;
  status: 'connected' | 'disconnected' | 'checking';
  message: string;
  timestamp?: string;
}

export default function TestGoogleAppsScriptPage() {
  const [status, setStatus] = useState<GoogleScriptStatus>({
    success: false,
    status: 'checking',
    message: '연결 상태 확인 중...'
  });
  const [emailServiceConfig, setEmailServiceConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 초기 상태 확인
    checkConnectionStatus();
    
    // 이메일 서비스 설정 가져오기
    const config = getEmailServiceConfig();
    setEmailServiceConfig(config);
  }, []);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const result = await checkGoogleScriptStatus();
      
      // Google Apps Script 응답을 우리 타입에 맞게 변환
      const mappedStatus: GoogleScriptStatus = {
        success: result.success,
        status: result.success ? 'connected' : 'disconnected',
        message: result.message,
        timestamp: result.timestamp
      };
      
      setStatus(mappedStatus);
    } catch (error) {
      setStatus({
        success: false,
        status: 'disconnected',
        message: `연결 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    return success ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected': return 'text-red-600 bg-red-50 border-red-200';
      case 'checking': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Apps Script 연결 테스트
          </h1>
          <p className="text-gray-600">
            M-CENTER 통합 이메일 시스템의 연결 상태를 확인합니다
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 연결 상태 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                연결 상태
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg border ${getStatusColor(status.status)}`}>
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(status.success)}
                  <span className="font-semibold">
                    {status.status === 'connected' ? '연결됨' : 
                     status.status === 'checking' ? '확인 중' : '연결 실패'}
                  </span>
                </div>
                <p className="text-sm">{status.message}</p>
                {status.timestamp && (
                  <p className="text-xs mt-2 opacity-75">
                    마지막 확인: {new Date(status.timestamp).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>

              <Button 
                onClick={checkConnectionStatus}
                disabled={isLoading}
                className="w-full"
                variant={status.success ? "outline" : "default"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    연결 확인 중...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    연결 상태 재확인
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* 서비스 설정 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                서비스 설정 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {emailServiceConfig && (
                <>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-semibold text-green-800 mb-2">
                        📧 {emailServiceConfig.provider}
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {emailServiceConfig.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>시트 ID:</strong> {emailServiceConfig.config.sheetsId}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>스크립트 URL:</strong> {emailServiceConfig.config.scriptUrl}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>알림 이메일:</strong> {emailServiceConfig.config.notificationEmail}
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <strong>환경:</strong> {emailServiceConfig.status.isProduction ? '운영' : '개발'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 기능 설명 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🚀 Google Apps Script 통합 시스템</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">구글시트 저장</h3>
                <p className="text-sm text-gray-600">
                  진단신청과 상담신청 데이터를 자동으로 구글시트에 저장
                </p>
              </div>
              <div className="text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">자동 이메일 발송</h3>
                <p className="text-sm text-gray-600">
                  관리자 알림과 신청자 확인 이메일을 자동 발송
                </p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">안정적 운영</h3>
                <p className="text-sm text-gray-600">
                  EmailJS 제거로 단순화된 안정적인 시스템 운영
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 상태별 안내 메시지 */}
        {status.status === 'disconnected' && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 mb-2">연결 문제 해결 방법</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>1. 환경변수 NEXT_PUBLIC_GOOGLE_SCRIPT_URL 확인</li>
                    <li>2. Google Apps Script 웹앱 배포 상태 확인</li>
                    <li>3. 구글시트 권한 설정 확인</li>
                    <li>4. 네트워크 연결 상태 확인</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 