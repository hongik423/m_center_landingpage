@echo off
echo ======================================
echo M-CENTER AI 상담사 Gemini API 설정
echo ======================================
echo.

:: .env.local 파일 생성 또는 업데이트
echo # ===========================================
echo # M-CENTER 경영지도센터 - 환경변수 설정
echo # ===========================================
echo.
echo # ===========================================
echo # Gemini AI API 설정 (AI 챗봇용) - 필수
echo # ===========================================
echo # Google Gemini API 키 (AI 상담사 챗봇용)
echo GEMINI_API_KEY=your_gemini_api_key_here
echo.
echo # ===========================================
echo # Google Apps Script 설정 (필수)
echo # ===========================================
echo NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjlPkXAy1JSZCxhJy00AazUvHbWwR5mpbJwY8Wo7EdJAPvSFn7bPZwZZcVf0icXh1inySn7aEpws1y4Kae-L2ZIajbzwY5iHEBnOznoKkS91UkNIm-OId2C7eZPR3CHSINoNdcskUwA1HhhC2hKgXqsazD9gtX_lAuioR1yMwsawhbpHF5MzGKYvcEVOtkdH2BqWu00sbHtebiNaADZNvsxuZZ2k6IpRruov5jg4BzpFxttmoTdAQTdIe0EQLnM7OCuGNf5gK1fruLiT4CKagjC04WJTQ^&lib=MSO6FP3_fOVcXPyKa1j-76EzN9sd4IQmq
echo NEXT_PUBLIC_GOOGLE_SCRIPT_ID=1eq4jLxuXgVfjH76MJRPq6aetIybwNjD2IpvLWgY3wlfDLPW2h2hzEjAC
echo NEXT_PUBLIC_GOOGLE_SCRIPT_DEPLOYMENT_ID=AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX
echo NEXT_PUBLIC_GOOGLE_SHEETS_ID=1LQNeT0abhMHXktrNjRbxl2XEFWVCwcYr5kVTAcRvpfM
echo NEXT_PUBLIC_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug/edit?usp=sharing
echo.
echo # ===========================================
echo # EmailJS 설정 (이메일 자동 송부용)
echo # ===========================================
echo NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qd9eycz
echo NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=268NPLwN54rPvEias
echo.
echo # ===========================================
echo # 개발/배포 환경 설정
echo # ===========================================
echo NODE_ENV=development
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
echo.
echo # ===========================================
echo # 추가 보안 설정
echo # ===========================================
echo JWT_SECRET=mcenter-jwt-secret-key-2025
echo ADMIN_EMAIL=hongik423@gmail.com
echo NOTIFICATION_ENABLED=true
echo AUTO_REPLY_ENABLED=true
) > .env.local

echo.
echo ✅ .env.local 파일이 생성되었습니다!
echo.
echo 🔑 이제 Gemini API 키를 설정해야 합니다:
echo.
echo 1. Google AI Studio 접속: https://aistudio.google.com/
echo 2. "Get API Key" 클릭
echo 3. 새 프로젝트 생성 또는 기존 프로젝트 선택
echo 4. "Create API Key" 클릭하여 키 생성
echo 5. .env.local 파일을 열고 your_gemini_api_key_here 부분을 실제 키로 변경
echo.
echo 🚀 설정 완료 후 다음 명령어로 서버를 시작하세요:
echo npm run dev
echo.
echo 📞 문의사항: 010-9251-9743 (이후경 경영지도사)
echo.
pause 