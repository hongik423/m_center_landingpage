'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  TestTube,
  Database,
  Settings,
  Activity,
  Users,
  MessageSquare,
  FileText
} from 'lucide-react';
import { 
  saveDiagnosisToGoogleSheets, 
  saveConsultationToGoogleSheets, 
  saveTestDataToGoogleSheets,
  checkGoogleSheetsConnection 
} from '@/lib/utils/googleSheetsService';
import LocalBackupService from '@/lib/utils/localBackupService';

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

export default function GoogleSheetsTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'failed'>('unknown');
  const [backupSummary, setBackupSummary] = useState<any>(null);

  // 결과 추가 함수
  const addResult = (result: Omit<TestResult, 'timestamp'>) => {
    const newResult = {
      ...result,
      timestamp: new Date().toLocaleString('ko-KR')
    };
    setResults(prev => [newResult, ...prev]);
  };

  // 연결 상태 확인
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkGoogleSheetsConnection();
      
      if (result.success) {
        setConnectionStatus('connected');
        addResult({
          success: true,
          message: '✅ 구글시트 연결 성공',
          details: result
        });
      } else {
        setConnectionStatus('failed');
        addResult({
          success: false,
          message: '❌ 구글시트 연결 실패',
          details: result
        });
      }
    } catch (error) {
      setConnectionStatus('failed');
      addResult({
        success: false,
        message: '🔥 연결 테스트 중 오류 발생',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 진단 데이터 테스트
  const testDiagnosisData = async () => {
    setIsLoading(true);
    try {
      const result = await saveTestDataToGoogleSheets('diagnosis');
      
      addResult({
        success: result.success,
        message: result.success ? '✅ 진단 데이터 저장 성공' : '❌ 진단 데이터 저장 실패',
        details: result
      });
      
      // 백업 상태 업데이트
      updateBackupSummary();
    } catch (error) {
      addResult({
        success: false,
        message: '🔥 진단 데이터 테스트 중 오류 발생',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      updateBackupSummary();
    } finally {
      setIsLoading(false);
    }
  };

  // 상담 데이터 테스트
  const testConsultationData = async () => {
    setIsLoading(true);
    try {
      const result = await saveTestDataToGoogleSheets('consultation');
      
      addResult({
        success: result.success,
        message: result.success ? '✅ 상담 데이터 저장 성공' : '❌ 상담 데이터 저장 실패',
        details: result
      });
      
      // 백업 상태 업데이트
      updateBackupSummary();
    } catch (error) {
      addResult({
        success: false,
        message: '🔥 상담 데이터 테스트 중 오류 발생',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      updateBackupSummary();
    } finally {
      setIsLoading(false);
    }
  };

  // 진단-상담 연계 테스트
  const testLinkedData = async () => {
    setIsLoading(true);
    try {
      // 1단계: 진단 데이터 저장
      const diagnosisResult = await saveTestDataToGoogleSheets('diagnosis');
      
      if (diagnosisResult.success) {
        // 2단계: 연계된 상담 데이터 저장
        const consultationData = {
          consultationType: 'phone',
          name: '진단연계 테스트',
          phone: '010-9251-9743',
          email: `linked_test_${Date.now()}@mcenter.test`,
          company: '연계테스트 기업',
          position: '대표이사',
          consultationArea: 'diagnosis',
          inquiryContent: '진단 결과에 대한 상담을 요청합니다.',
          preferredTime: 'morning',
          privacyConsent: true
        };

        const consultationResult = await saveConsultationToGoogleSheets(
          consultationData,
          {
            isLinked: true,
            score: '85',
            primaryService: 'business-analysis',
            resultUrl: window.location.href
          }
        );

        addResult({
          success: diagnosisResult.success && consultationResult.success,
          message: '✅ 진단-상담 연계 데이터 저장 성공',
          details: {
            diagnosis: diagnosisResult,
            consultation: consultationResult,
            linked: true
          }
        });
        
        // 백업 상태 업데이트
        updateBackupSummary();
      } else {
        addResult({
          success: false,
          message: '❌ 진단 데이터 저장 실패로 연계 테스트 중단',
          details: diagnosisResult
        });
        updateBackupSummary();
      }
    } catch (error) {
      addResult({
        success: false,
        message: '🔥 연계 테스트 중 오류 발생',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      updateBackupSummary();
    } finally {
      setIsLoading(false);
    }
  };

  // 환경변수 상태 확인
  const envStatus = {
    googleScriptUrl: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL,
    googleSheetsId: !!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
    scriptId: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_ID,
    deploymentId: !!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID
  };

  const allEnvSet = Object.values(envStatus).every(Boolean);

  // 백업 상태 업데이트
  const updateBackupSummary = () => {
    try {
      const summary = LocalBackupService.getBackupSummary();
      setBackupSummary(summary);
    } catch (error) {
      console.error('백업 상태 조회 실패:', error);
    }
  };

  // 백업 CSV 다운로드
  const downloadBackupCSV = () => {
    try {
      LocalBackupService.downloadBackupCSV();
      addResult({
        success: true,
        message: '✅ 백업 데이터 CSV 다운로드 완료',
        details: { action: 'csv_download' }
      });
      updateBackupSummary();
    } catch (error) {
      addResult({
        success: false,
        message: '❌ CSV 다운로드 실패',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  };

  // 백업 데이터 클리어
  const clearBackupData = () => {
    if (confirm('모든 백업 데이터를 삭제하시겠습니까?')) {
      const success = LocalBackupService.clearAllBackups();
      addResult({
        success,
        message: success ? '✅ 백업 데이터 삭제 완료' : '❌ 백업 데이터 삭제 실패',
        details: { action: 'clear_backups' }
      });
      updateBackupSummary();
    }
  };

  // 결과 클리어
  const clearResults = () => {
    setResults([]);
    setConnectionStatus('unknown');
  };

  // 컴포넌트 마운트 시 백업 상태 업데이트
  React.useEffect(() => {
    updateBackupSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TestTube className="w-6 h-6 text-blue-600" />
              구글시트 연동 테스트 대시보드
            </CardTitle>
            <p className="text-gray-600">
              진단신청자와 상담신청자 데이터가 구글시트에 제대로 저장되는지 테스트합니다.
            </p>
          </CardHeader>
        </Card>

        {/* 환경변수 상태 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Settings className="w-5 h-5" />
              환경변수 설정 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                {envStatus.googleScriptUrl ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Script URL</span>
              </div>
              <div className="flex items-center gap-2">
                {envStatus.googleSheetsId ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Sheets ID</span>
              </div>
              <div className="flex items-center gap-2">
                {envStatus.scriptId ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Script ID</span>
              </div>
              <div className="flex items-center gap-2">
                {envStatus.deploymentId ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">Deployment ID</span>
              </div>
            </div>
            
            {!allEnvSet && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  ⚠️ 일부 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 테스트 버튼들 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="w-5 h-5" />
              테스트 실행
              {connectionStatus !== 'unknown' && (
                <Badge 
                  variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
                  className="ml-2"
                >
                  {connectionStatus === 'connected' ? '연결됨' : '연결 실패'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 연결 확인 */}
              <Button 
                onClick={checkConnection}
                disabled={isLoading}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Database className="w-4 h-4" />
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '연결 확인'}
              </Button>

              {/* 진단 데이터 테스트 */}
              <Button 
                onClick={testDiagnosisData}
                disabled={isLoading || !allEnvSet}
                className="flex items-center gap-2"
                variant="default"
              >
                <FileText className="w-4 h-4" />
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '진단 데이터'}
              </Button>

              {/* 상담 데이터 테스트 */}
              <Button 
                onClick={testConsultationData}
                disabled={isLoading || !allEnvSet}
                className="flex items-center gap-2"
                variant="default"
              >
                <MessageSquare className="w-4 h-4" />
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '상담 데이터'}
              </Button>

              {/* 연계 테스트 */}
              <Button 
                onClick={testLinkedData}
                disabled={isLoading || !allEnvSet}
                className="flex items-center gap-2"
                variant="secondary"
              >
                <Users className="w-4 h-4" />
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '연계 테스트'}
              </Button>
            </div>

            {/* 결과 클리어 버튼 */}
            {results.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button onClick={clearResults} variant="outline" size="sm">
                  결과 클리어
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 테스트 결과 */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                📊 테스트 결과 (최신순)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.message}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {result.timestamp}
                        </p>
                      </div>
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    {result.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                          상세 정보 보기
                        </summary>
                        <pre className="mt-2 text-xs bg-white p-3 rounded border overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 백업 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              💾 로컬 백업 관리
              {backupSummary && backupSummary.total > 0 && (
                <Badge variant="secondary">
                  {backupSummary.total}개 저장됨
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {backupSummary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{backupSummary.total}</div>
                  <div className="text-sm text-gray-600">전체</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-900">{backupSummary.pending}</div>
                  <div className="text-sm text-yellow-600">대기중</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">{backupSummary.sent}</div>
                  <div className="text-sm text-green-600">전송완료</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">{backupSummary.failed}</div>
                  <div className="text-sm text-red-600">실패</div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={downloadBackupCSV}
                className="flex items-center gap-2"
                variant="outline"
                disabled={!backupSummary || backupSummary.total === 0}
              >
                <FileText className="w-4 h-4" />
                CSV 다운로드
              </Button>
              
              <Button 
                onClick={updateBackupSummary}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4" />
                상태 새로고침
              </Button>
              
              <Button 
                onClick={clearBackupData}
                className="flex items-center gap-2"
                variant="destructive"
                disabled={!backupSummary || backupSummary.total === 0}
              >
                <AlertCircle className="w-4 h-4" />
                백업 삭제
              </Button>
            </div>

            {backupSummary && backupSummary.total > 0 && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>⚠️ 중요:</strong> 구글시트 연결이 실패할 때 데이터가 로컬에 백업됩니다. 
                  CSV 다운로드하여 수동으로 구글시트에 입력하거나, 구글시트 연결을 복구한 후 재시도하세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 가이드 */}
        <Card>
          <CardHeader>
            <CardTitle>📘 테스트 가이드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>1. 연결 확인:</strong> 구글시트 Apps Script와의 기본 연결을 확인합니다.
              </div>
              <div>
                <strong>2. 진단 데이터:</strong> AI 무료진단 신청 데이터가 올바르게 저장되는지 테스트합니다.
              </div>
              <div>
                <strong>3. 상담 데이터:</strong> 상담 신청 데이터가 올바르게 저장되는지 테스트합니다.
              </div>
              <div>
                <strong>4. 연계 테스트:</strong> 진단 완료 후 상담 신청 시 데이터가 연계되는지 확인합니다.
              </div>
              <div>
                <strong>5. 백업 관리:</strong> 구글시트 연결 실패 시 로컬 백업 데이터를 관리합니다.
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  💡 <strong>팁:</strong> 구글시트 연결이 실패해도 로컬 백업으로 데이터가 보호됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
} 