#!/bin/bash

# 🔐 M-CENTER 환경변수 자동 설정 스크립트

echo "🚀 M-CENTER 별-AI상담사 환경변수 설정을 시작합니다..."

# .env.local 파일 생성
cat > .env.local << 'EOF'
# M-CENTER 랜딩페이지 환경변수 설정 (로컬 개발용)

# 🔧 Gemini AI API (서버 사이드 전용) ⚠️ 보안 중요
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# 🔧 EmailJS 설정 (클라이언트 사이드 허용)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
NEXT_PUBLIC_EMAILJS_TEMPLATE_DIAGNOSIS=YOUR_DIAGNOSIS_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONSULTATION=YOUR_CONSULTATION_TEMPLATE_ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN=YOUR_ADMIN_TEMPLATE_ID

# 🔧 Google Sheets 및 Apps Script 설정 (클라이언트 사이드 허용)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=YOUR_GOOGLE_SHEETS_ID
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=YOUR_GOOGLE_SCRIPT_URL
NEXT_PUBLIC_GOOGLE_SCRIPT_ID=YOUR_GOOGLE_SCRIPT_ID

# 🔧 사이트 설정
NEXT_PUBLIC_BASE_URL=https://your-site-domain.vercel.app

# 🔧 개발 환경 설정
NODE_ENV=development

# 구글시트 연동 (필수)
NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=YOUR_GOOGLE_SCRIPT_DEPLOYMENT_ID
NEXT_PUBLIC_GOOGLE_SHEETS_URL=YOUR_GOOGLE_SHEETS_URL

# 관리자 설정
ADMIN_EMAIL=your-admin@email.com

# 기능 활성화/비활성화
NOTIFICATION_ENABLED=true
AUTO_REPLY_ENABLED=true

# 🤖 AI 상담사 설정
NEXT_PUBLIC_AI_ASSISTANT_NAME=별-AI상담사
NEXT_PUBLIC_AI_ASSISTANT_DESCRIPTION=GEMINI AI 기반 M-CENTER 전문 상담사
EOF

echo "✅ .env.local 파일이 성공적으로 생성되었습니다!"
echo ""
echo "📋 환경변수 템플릿이 설정되었습니다."
echo "⚠️  실제 값으로 교체하세요:"
echo "   🤖 Gemini API Key: Google AI Studio에서 발급"
echo "   📧 EmailJS: EmailJS 대시보드에서 확인"  
echo "   📊 Google Sheets: Google Sheets URL에서 ID 추출"
echo ""
echo "🔍 파일 내용 확인: cat .env.local"
echo "🚀 개발 서버 시작: npm run dev"
echo "🧪 환경변수 테스트: curl http://localhost:3000/api/test-env"
echo ""
echo "⚠️  보안 주의사항:"
echo "   - .env.local 파일은 Git에 커밋되지 않습니다"
echo "   - API 키를 절대 공개하지 마세요"
echo "   - GitHub Secrets를 사용하여 배포하세요"
echo ""
echo "📚 자세한 설정 방법: 환경변수_설정_가이드.md 파일을 확인하세요" 