# 기업의별 경영지도센터 랜딩페이지

**Business Model Zen 프레임워크 기반 기업 성장 솔루션**

기업의별 경영지도센터는 AI 활용, 공장구매, 기술창업, 인증지원, 웹사이트구축 등 5대 영역 통합 솔루션으로 기업별 맞춤 컨설팅을 제공하는 전문 플랫폼입니다.

## 🌟 주요 특징

### 5대 핵심 서비스
- **AI 활용 생산성향상**: 업무 효율성 40% 향상, 정부 100% 지원
- **경매활용 공장구매**: 시장가 대비 40% 절약, 전문가 동행 지원
- **기술사업화/기술창업**: 평균 5억원 자금 확보, 성공률 85%
- **인증지원**: 연간 5천만원 세제혜택, 통합 인증 관리
- **웹사이트 구축**: 온라인 매출 30% 증대, AI 기반 최적화

### Business Model Zen 프레임워크
기업 성장 단계별 맞춤형 지원 시스템:
1. **Step 1 (1-3년)**: 안정적 기반 구축
2. **Step 2 (3-7년)**: 성장 동력 강화
3. **Step 3 (7-10년)**: 시장 주도 지위
4. **Step 4 (10년+)**: 지속가능 성장

## 🚀 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui, Lucide React
- **Deployment**: Vercel
- **Package Manager**: npm

## 📋 주요 기능

### 🎯 진단 시스템
- 5개 서비스 영역별 맞춤 진단
- 15분 내 완료 가능한 질문 체계
- 실시간 진행률 표시
- 개인화된 결과 분석

### 🤖 AI 챗봇
- 24/7 자동 상담 지원
- 서비스별 맞춤 정보 제공
- 빠른 답변 기능
- 상담 신청 연결

### 📊 성과 지표
- 실시간 성과 데이터 표시
- 카운트업 애니메이션
- 고객 만족도 시각화
- 성공 사례 갤러리

### 📱 반응형 디자인
- 완전 반응형 웹 디자인
- 모바일 최적화
- 접근성 (WCAG) 준수
- 크로스 브라우저 호환성

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary**: 기업 신뢰성을 나타내는 네이비 계열
- **Secondary**: 성장과 성공을 상징하는 그린 계열
- **Accent**: 혁신과 AI를 나타내는 퍼플 계열

### 타이포그래피
- **헤딩**: Geist Sans (가독성과 모던함)
- **본문**: 시스템 폰트 (한글 최적화)

## 🏗️ 프로젝트 구조

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── globals.css        # 글로벌 스타일
│   └── providers.tsx      # 컨텍스트 프로바이더
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── layout/           # 레이아웃 컴포넌트
│       ├── header.tsx    # 헤더 (네비게이션)
│       ├── footer.tsx    # 푸터
│       └── floating-chatbot.tsx  # AI 챗봇
├── lib/                   # 유틸리티 함수
└── styles/               # 추가 스타일
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.17 이상
- npm 9.0 이상

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/your-repo/m_center_landingpage.git

# 디렉토리 이동
cd m_center_landingpage

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 실행되면 [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅 검사
npm run lint
```

## 📈 성과 지표

현재까지의 성과:
- ✅ **1,247건** 완료된 진단
- 🎯 **324건** 성공 프로젝트
- 💰 **127억원** 고객 절약 효과
- ⭐ **94.2%** 고객 만족도

## 📞 연락처

**기업의별 경영지도센터**
- 📱 전화: 010-9251-9743
- 📧 이메일: lhk@injc.kr
- 🌐 웹사이트: [기업의별 경영지도센터](https://m-center.example.com)
- 📍 주소: 서울특별시 강남구

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면:

1. 이 저장소를 Fork 하세요
2. 새로운 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push 하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📊 개발 진척도

- [x] 기본 레이아웃 구성
- [x] 홈페이지 구현
- [x] 반응형 디자인
- [x] AI 챗봇 구현
- [x] SEO 최적화
- [ ] 진단 시스템 구현
- [ ] 상담 신청 시스템
- [ ] 결제 시스템 연동
- [ ] 관리자 페이지

---

**기업의별 경영지도센터** - Business Model Zen으로 기업 성장의 5단계를 완성하세요
