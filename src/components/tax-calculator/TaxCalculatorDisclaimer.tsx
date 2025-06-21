'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  FileText, 
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  UserCheck,
  ExternalLink
} from 'lucide-react';

interface TaxCalculatorDisclaimerProps {
  variant?: 'full' | 'compact' | 'modal' | 'summary';
  className?: string;
}

export default function TaxCalculatorDisclaimer({ 
  variant = 'full', 
  className = '' 
}: TaxCalculatorDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(variant === 'full');

  // 250자 요약 면책조항
  if (variant === 'summary') {
    return (
      <div className={`bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 shadow-sm ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-red-900 mb-2 flex items-center">
              🚫 중요 면책 조항 (Legal Disclaimer)
              <Badge variant="destructive" className="ml-2 text-xs">필독</Badge>
            </h4>
            <div className="text-sm text-red-800 leading-relaxed space-y-1">
              <p>
                <strong>본 세금계산기는 참고용/교육용 목적으로만 제공되며, 계산 결과의 정확성을 보장하지 않습니다.</strong> 
                실제 세무신고 시 반드시 세무사 상담을 받으시기 바라며, 본 서비스 이용으로 인한 <strong>민사·형사·행정상 모든 법적 책임, 
                세무신고 오류, 추가 세금 부담, 과소/과다 납부, 세무조사 관련 손해에 대해 일체 책임지지 않습니다.</strong> 
                본 계산기 사용 시 위 조항에 동의하는 것으로 간주합니다.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-red-200">
              <p className="text-xs text-red-700 flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                정확한 세무상담: 국세청 홈택스(hometax.go.kr) 또는 전문 세무사
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ 면책 조항:</strong> 본 계산기는 <strong>참고용</strong>입니다. 
              정확한 세무상담은 세무사에게 문의하세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-yellow-600" />
            <CardTitle className="text-lg text-yellow-900">
              ⚠️ 법적 면책 조항 (Legal Disclaimer)
            </CardTitle>
            <Badge variant="outline" className="text-yellow-700 border-yellow-300">
              필독
            </Badge>
          </div>
          {variant !== 'modal' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-yellow-700 hover:text-yellow-800"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  상세보기
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* 주요 면책 사항 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">🚫 중요 공지사항</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• 본 계산기는 <strong>참고용/교육용</strong> 목적으로만 제공됩니다</li>
                  <li>• 계산 결과의 <strong>정확성을 보장하지 않습니다</strong></li>
                  <li>• 실제 세무신고 시 반드시 <strong>세무사 상담</strong>을 받으시기 바랍니다</li>
                  <li>• 본 서비스 이용으로 인한 <strong>모든 법적 책임을 지지 않습니다</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* 상세 면책 조항들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 계산 정확성 관련 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">계산 정확성</h5>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• 간이 계산 방식 적용</li>
                    <li>• 개인별 상황 차이 미반영</li>
                    <li>• 복잡한 세법 규정 단순화</li>
                    <li>• 최신 세법 변경사항 지연 반영</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 법적 책임 */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Scale className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-purple-900 mb-2">법적 책임</h5>
                  <ul className="text-xs text-purple-800 space-y-1">
                    <li>• 세무신고 오류 책임 없음</li>
                    <li>• 추가 세금 부담 책임 없음</li>
                    <li>• 과소/과다 납부 책임 없음</li>
                    <li>• 세무조사 관련 책임 없음</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 사용 권장사항 */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <UserCheck className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-green-900 mb-2">권장사항</h5>
                  <ul className="text-xs text-green-800 space-y-1">
                    <li>• 전문 세무사 상담 필수</li>
                    <li>• 국세청 홈택스 확인</li>
                    <li>• 최신 세법 규정 확인</li>
                    <li>• 개인 상황별 검토</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 데이터 정확성 */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-orange-900 mb-2">데이터 기준</h5>
                  <ul className="text-xs text-orange-800 space-y-1">
                    <li>• 2024년 세법 기준</li>
                    <li>• 일반적인 케이스 적용</li>
                    <li>• 예외 규정 미적용</li>
                    <li>• 지역별 차이 미반영</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 최종 동의 */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong>본 계산기를 사용함으로써 위의 모든 면책 조항에 동의하는 것으로 간주됩니다.</strong>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              정확한 세무 상담은 국세청 홈택스(hometax.go.kr) 또는 전문 세무사에게 문의하시기 바랍니다.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export { TaxCalculatorDisclaimer }; 