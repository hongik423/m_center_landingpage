@echo off
chcp 65001 > nul
echo.
echo ┌─────────────────────────────────────────────────────────────┐
echo │  🤖 M-CENTER AI 기능 활성화 도구                           │
echo │  Gemini API 키 설정으로 AI 진단 및 채팅 기능 활성화        │
echo └─────────────────────────────────────────────────────────────┘
echo.

rem .env.local 파일 존재 확인
if exist .env.local (
    echo ✅ .env.local 파일이 존재합니다.
    echo.
    echo 📋 현재 환경변수 설정:
    findstr /B "GEMINI_API_KEY" .env.local 2>nul
    if errorlevel 1 (
        echo ❌ GEMINI_API_KEY가 설정되지 않았습니다.
    ) else (
        echo ✅ GEMINI_API_KEY가 설정되어 있습니다.
    )
    echo.
) else (
    echo ❌ .env.local 파일이 없습니다. 생성하겠습니다...
    echo.
    
    rem 기본 .env.local 파일 생성
    (
        echo # M-CENTER 랜딩페이지 환경변수 설정
        echo.
        echo # 🔧 Google Apps Script 연동 ^(필수^)
        echo NEXT_PUBLIC_GOOGLE_SHEETS_ID=1bAbxAWBWy5dvxBSFf1Mtdt0UiP9hNaFKyjTTlLq_Pug
        echo NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzE4eVxGetQ3Z_xsikwoonK45T4wtryGLorQ4UmGaGRAz-BuZQIzm2VgXcxmJoQ04WX/exec
        echo.
        echo # 🚀 기본 URL 설정
        echo NEXT_PUBLIC_BASE_URL=https://m-center-landingpage.vercel.app
        echo.
        echo # 🤖 AI API 키 ^(실제 키로 교체 필요^)
        echo GEMINI_API_KEY=여기에_실제_Gemini_API_키를_입력하세요
        echo.
        echo # 🌍 환경 설정
        echo NODE_ENV=development
        echo.
        echo # 🔐 보안 설정
        echo JWT_SECRET=m-center-jwt-secret-key-2024
        echo.
        echo # 관리자 설정
        echo ADMIN_EMAIL=admin@m-center.com
        echo.
        echo # 기능 활성화/비활성화
        echo NOTIFICATION_ENABLED=true
        echo AUTO_REPLY_ENABLED=true
    ) > .env.local
    
    echo ✅ .env.local 파일이 생성되었습니다.
    echo.
)

echo 🔑 Gemini API 키를 설정하세요:
echo.
echo 1. Google AI Studio 방문: https://makersuite.google.com/app/apikey
echo 2. 새 API 키 생성 (또는 기존 키 사용)
echo 3. 아래에 API 키를 입력하세요:
echo.

set /p "gemini_key=Gemini API 키 입력: "

if "%gemini_key%"=="" (
    echo ❌ API 키가 입력되지 않았습니다.
    echo 💡 나중에 .env.local 파일에서 직접 수정하세요.
    pause
    exit /b 1
)

rem API 키 형식 검증 (AIza로 시작하는지 확인)
echo %gemini_key% | findstr /B "AIza" >nul
if errorlevel 1 (
    echo ⚠️  경고: 올바른 Gemini API 키 형식이 아닙니다.
    echo 💡 Gemini API 키는 'AIza'로 시작해야 합니다.
    echo 🤔 계속 진행하시겠습니까? (y/n)
    set /p "continue=선택: "
    if /i not "%continue%"=="y" (
        echo ❌ 설정이 취소되었습니다.
        pause
        exit /b 1
    )
)

rem .env.local 파일에서 GEMINI_API_KEY 업데이트
echo.
echo 🔄 API 키를 설정하고 있습니다...

rem 임시 파일 생성
powershell -Command "(Get-Content .env.local) -replace '^GEMINI_API_KEY=.*', 'GEMINI_API_KEY=%gemini_key%' | Set-Content .env.local.tmp"
move .env.local.tmp .env.local

echo ✅ Gemini API 키가 설정되었습니다!
echo.

rem 설정 확인
echo 📋 설정 완료 확인:
findstr /B "GEMINI_API_KEY" .env.local | findstr /V "여기에_실제_Gemini_API_키를_입력하세요"
if errorlevel 1 (
    echo ❌ API 키 설정에 실패했습니다.
) else (
    echo ✅ API 키가 성공적으로 설정되었습니다.
)

echo.
echo 🚀 다음 단계:
echo 1. 개발 서버 재시작: npm run dev
echo 2. 채팅 기능 테스트: http://localhost:3000/chatbot
echo 3. AI 진단 테스트: http://localhost:3000/services/diagnosis
echo.

echo 💡 문제가 있다면 .env.local 파일을 직접 수정하세요.
echo 📋 API 키 형식: GEMINI_API_KEY=AIzaSy...
echo.

pause 