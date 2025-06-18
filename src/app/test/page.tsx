'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const router = useRouter();

  useEffect(() => {
    // 테스트 페이지를 새로운 간소화된 진단 시스템으로 리디렉션
    router.push('/services/diagnosis');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          새로운 간소화된 진단 시스템으로 이동 중...
        </h1>
        <p className="text-gray-600">
          잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
} 