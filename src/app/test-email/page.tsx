'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { checkEmailServiceStatus, initEmailJS } from '@/lib/utils/emailService';
import emailjs from '@emailjs/browser';

export default function TestEmailPage() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [testEmail, setTestEmail] = useState('hongik423@gmail.com');
  const { toast } = useToast();

  const checkEmailJSConfig = async () => {
    setTesting(true);
    const testResults: any = {};
    
    try {
      // 1. 환경변수 확인
      const status = checkEmailServiceStatus();
      testResults.envConfig = status;
      
      // 2. EmailJS 초기화 시도
      try {
        const initResult = initEmailJS();
        testResults.initialization = { success: initResult };
      } catch (error) {
        testResults.initialization = { 
          success: false, 
          error: error instanceof Error ? error.message : '초기화 실패' 
        };
      }

      // 3. 간단한 테스트 이메일 발송
      if (testResults.initialization.success && testEmail) {
        try {
          const templateParams = {
            to_email: testEmail,
            to_name: '테스트 사용자',
            company_name: '테스트 회사',
            industry: '테스트 업종',
            contact_name: '테스트 담당자',
            contact_phone: '010-1234-5678',
            submit_date: new Date().toLocaleString('ko-KR'),
            admin_email: 'hongik423@gmail.com'
          };

          console.log('🧪 테스트 이메일 발송 시도:', templateParams);

          const result = await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            'template_diagnosis_confirmation',
            templateParams
          );

          testResults.testEmail = {
            success: true,
            status: result.status,
            text: result.text
          };

          toast({
            title: '✅ 테스트 이메일 발송 성공!',
            description: `${testEmail}로 테스트 이메일을 발송했습니다.`
          });

        } catch (emailError) {
          testResults.testEmail = {
            success: false,
            error: emailError instanceof Error ? emailError.message : '이메일 발송 실패'
          };

          toast({
            title: '❌ 테스트 이메일 발송 실패',
            description: '콘솔에서 상세 오류를 확인하세요.',
            variant: 'destructive'
          });
        }
      }

      setResults(testResults);
      console.log('📧 EmailJS 테스트 결과:', testResults);

    } catch (error) {
      console.error('EmailJS 테스트 중 오류:', error);
      setResults({
        error: error instanceof Error ? error.message : '테스트 실행 실패'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>📧 EmailJS 설정 테스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                테스트 이메일 주소:
              </label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <Button 
              onClick={checkEmailJSConfig}
              disabled={testing || !testEmail}
              className="w-full"
            >
              {testing ? '테스트 중...' : 'EmailJS 설정 테스트'}
            </Button>
          </div>

          {results && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">테스트 결과</h3>
              
              {/* 환경변수 확인 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">1. 환경변수 설정</h4>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    results.envConfig?.configured 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {results.envConfig?.configured ? '✅ 설정됨' : '❌ 누락됨'}
                  </span>
                  {results.envConfig?.missing?.length > 0 && (
                    <div className="text-sm text-red-600 mt-1">
                      누락된 환경변수: {results.envConfig.missing.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* EmailJS 초기화 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium">2. EmailJS 초기화</h4>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded text-sm ${
                    results.initialization?.success 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {results.initialization?.success ? '✅ 성공' : '❌ 실패'}
                  </span>
                  {results.initialization?.error && (
                    <div className="text-sm text-red-600 mt-1">
                      오류: {results.initialization.error}
                    </div>
                  )}
                </div>
              </div>

              {/* 테스트 이메일 발송 */}
              {results.testEmail && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium">3. 테스트 이메일 발송</h4>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      results.testEmail.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {results.testEmail.success ? '✅ 성공' : '❌ 실패'}
                    </span>
                    {results.testEmail.error && (
                      <div className="text-sm text-red-600 mt-1">
                        오류: {results.testEmail.error}
                      </div>
                    )}
                    {results.testEmail.status && (
                      <div className="text-sm text-green-600 mt-1">
                        상태: {results.testEmail.status}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 전체 결과 (JSON) */}
              <details className="bg-gray-50 p-4 rounded-lg">
                <summary className="font-medium cursor-pointer">상세 결과 (JSON)</summary>
                <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded border">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 EmailJS 운영 방식</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>EmailJS 템플릿:</strong> template_diagnosis_confirmation (진단 신청 확인) 만 사용</li>
              <li>• <strong>관리자 알림:</strong> 구글 Apps Script에서 자동 처리</li>
              <li>• <strong>진단 결과:</strong> 다운로드 방식으로 제공 (이메일 발송 안 함)</li>
              <li>• 서비스 ID: service_qd9eycz</li>
              <li>• Public Key: 268NPLwN54rPvEias</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✅ 설정 확인사항</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• EmailJS 대시보드에서 template_diagnosis_confirmation 템플릿 생성</li>
              <li>• Gmail 서비스 연결 확인</li>
              <li>• 구글 Apps Script 트리거 설정 확인 (관리자 알림용)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 