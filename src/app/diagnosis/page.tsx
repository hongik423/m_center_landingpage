'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiagnosisRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // services/diagnosis로 리디렉션
    router.replace('/services/diagnosis');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">진단 페이지로 이동 중...</p>
      </div>
    </div>
  );
} 