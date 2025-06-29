'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Shield, Lock, FileText } from 'lucide-react';

interface PrivacyConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
}

export default function PrivacyConsent({ 
  checked, 
  onCheckedChange, 
  required = true,
  className = ""
}: PrivacyConsentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConsentChange = (newChecked: boolean) => {
    console.log('개인정보 동의 상태 변경:', newChecked);
    onCheckedChange(newChecked);
  };

  const privacyPolicy = {
    title: "개인정보 수집 및 이용 동의서",
    sections: [
      {
        title: "1. 개인정보 수집 목적",
        content: [
          "• 상담 서비스 제공 및 문의사항 응답",
          "• 서비스 관련 정보 제공 및 안내",
          "• 본인 확인 및 연락처 확인"
        ]
      },
      {
        title: "2. 수집하는 개인정보 항목",
        content: [
          "• 필수항목: 성명, 연락처, 이메일, 회사명",
          "• 선택항목: 직책/부서, 문의내용, 희망상담시간"
        ]
      },
      {
        title: "3. 개인정보 보유 및 이용기간",
        content: [
          "• 수집일로부터 3년간 보관",
          "• 상담 완료 후 고객 요청 시 즉시 삭제",
          "• 관련 법령에 따른 보존 의무가 있는 경우 해당 기간까지 보관"
        ]
      },
      {
        title: "4. 개인정보 제3자 제공",
        content: [
          "• 원칙적으로 개인정보를 제3자에게 제공하지 않음",
          "• 법령에 의하거나 정보주체의 별도 동의가 있는 경우에만 제공"
        ]
      },
      {
        title: "5. 개인정보 처리 위탁",
        content: [
          "• Google Workspace (이메일 발송 및 데이터 보관)",
          "• 위탁업체와 개인정보보호 관련 계약 체결"
        ]
      },
      {
        title: "6. 정보주체의 권리",
        content: [
          "• 개인정보 열람, 정정·삭제, 처리정지 요구권",
          "• 개인정보보호법에 따른 권리 행사 가능",
          "• 권리 행사 문의: hongik423@gmail.com"
        ]
      }
    ],
    footer: [
      "※ 개인정보 수집·이용에 동의하지 않을 권리가 있으나, 동의를 거부할 경우 상담 서비스 이용이 제한될 수 있습니다.",
      "※ 만 14세 미만 아동의 경우 법정대리인의 동의가 필요합니다."
    ]
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-3xl p-8 ${className}`}>
      <div className="flex items-start gap-6">
        <div className="flex items-center">
          <Checkbox
            id="privacy-consent-checkbox"
            checked={checked}
            onCheckedChange={handleConsentChange}
            className="w-6 h-6 border-2 border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded-lg transition-all duration-200"
            required={required}
          />
        </div>
        <div className="flex-1">
          <label 
            htmlFor="privacy-consent-checkbox" 
            className="text-base text-gray-700 cursor-pointer leading-relaxed block"
          >
            {required && <span className="text-red-500 font-bold">* </span>}
            <span className="font-bold text-gray-900">개인정보 수집 및 이용에 동의합니다.</span>
            <br />
            <span className="text-gray-600 text-sm">
              M-CENTER는 상담 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.
            </span>
          </label>
          
          <div className="mt-4 flex items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs px-3 py-1 h-8 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  상세 내용 보기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] p-0">
                <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    {privacyPolicy.title}
                  </DialogTitle>
                </DialogHeader>
                <ScrollArea className="px-6 py-4 h-96">
                  <div className="space-y-6">
                    {privacyPolicy.sections.map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          {section.title}
                        </h3>
                        <div className="space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <p key={itemIndex} className="text-gray-700 text-sm leading-relaxed pl-4">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          {privacyPolicy.footer.map((item, index) => (
                            <p key={index} className="text-amber-800 text-sm leading-relaxed">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-6"
                  >
                    닫기
                  </Button>
                  <Button
                    onClick={() => {
                      handleConsentChange(true);
                      setIsDialogOpen(false);
                    }}
                    className="px-6 bg-blue-600 hover:bg-blue-700"
                  >
                    동의하고 닫기
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              개인정보보호법 준수
            </div>
          </div>
        </div>
      </div>
      
      {/* 동의 상태 표시 */}
      {checked && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-green-800 text-sm font-medium">
            개인정보 수집 및 이용에 동의하셨습니다.
          </span>
        </div>
      )}
    </div>
  );
} 