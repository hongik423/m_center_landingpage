# 토스 스타일 디자인 가이드 - 경영지도센터

## 📋 문서 개요
| 항목 | 내용 |
|------|------|
| **프로젝트명** | 경영지도센터 통합 플랫폼 디자인 시스템 |
| **디자인 스타일** | 토스(Toss) 영감 미니멀 비즈니스 |
| **버전** | v1.0 |
| **작성일** | 2025년 6월 24일 |
| **작성자** | 이후경 경영지도사 |

---

## 🎨 디자인 철학

### 핵심 원칙
1. **신뢰성 (Trust)**: 금융 서비스 수준의 안정감과 신뢰성
2. **명료성 (Clarity)**: 복잡한 정보를 직관적으로 전달
3. **효율성 (Efficiency)**: 빠르고 편리한 사용자 경험
4. **전문성 (Professionalism)**: B2B 서비스에 적합한 비즈니스 감각

### 토스 디자인에서 영감을 받은 요소
- **대담한 타이포그래피**: 중요한 메시지를 강조하는 큰 글씨
- **명확한 계층구조**: 정보의 우선순위가 명확한 레이아웃
- **직관적인 아이콘**: 복잡한 개념을 간단한 시각으로 표현
- **부드러운 인터랙션**: 자연스럽고 부드러운 애니메이션
- **데이터 시각화**: 숫자와 성과를 효과적으로 표현

---

## 🎨 컬러 팔레트

### 주요 컬러 (Primary Colors)
```css
:root {
  /* 브랜드 블루 (신뢰, 전문성) */
  --primary-50: #EBF5FF;
  --primary-100: #DBEAFE;
  --primary-200: #BFDBFE;
  --primary-300: #93C5FD;
  --primary-400: #60A5FA;
  --primary-500: #3B82F6;  /* 메인 브랜드 컬러 */
  --primary-600: #2563EB;
  --primary-700: #1D4ED8;
  --primary-800: #1E40AF;
  --primary-900: #1E3A8A;
  
  /* 액센트 그린 (성공, 성장) */
  --accent-50: #ECFDF5;
  --accent-100: #D1FAE5;
  --accent-200: #A7F3D0;
  --accent-300: #6EE7B7;
  --accent-400: #34D399;
  --accent-500: #10B981;  /* 성공/완료 상태 */
  --accent-600: #059669;
  --accent-700: #047857;
  --accent-800: #065F46;
  --accent-900: #064E3B;
}
```

### 중성 컬러 (Neutral Colors)
```css
:root {
  /* 그레이 스케일 */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* 시멘틱 컬러 */
  --success: #10B981;  /* 성공 */
  --warning: #F59E0B;  /* 주의 */
  --error: #EF4444;    /* 오류 */
  --info: #3B82F6;     /* 정보 */
}
```

### 컬러 사용 가이드
| 용도 | 컬러 | 사용 예시 |
|------|------|----------|
| **브랜드 아이덴티티** | Primary 500 | 로고, 주요 CTA 버튼, 링크 |
| **성공/성과 강조** | Accent 500 | 진단 결과 좋음, 완료 상태 |
| **본문 텍스트** | Gray 700 | 일반 텍스트, 설명 |
| **보조 텍스트** | Gray 500 | 캡션, 부가 정보 |
| **배경색** | Gray 50 | 카드 배경, 섹션 구분 |
| **경계선** | Gray 200 | 카드 테두리, 구분선 |

---

## ✏️ 타이포그래피

### 폰트 패밀리
```css
:root {
  /* 주요 폰트 (한글 최적화) */
  --font-family-primary: "Pretendard", -apple-system, BlinkMacSystemFont, 
                         "Segoe UI", "Noto Sans KR", sans-serif;
  
  /* 숫자 전용 폰트 (가독성) */
  --font-family-mono: "JetBrains Mono", "D2Coding", "Consolas", monospace;
}
```

### 타이포그래피 스케일
```css
/* 토스 스타일 타이포그래피 */
.text-hero {
  font-size: 3.5rem;      /* 56px */
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.text-h1 {
  font-size: 2.5rem;      /* 40px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.text-h2 {
  font-size: 2rem;        /* 32px */
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.text-h3 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.text-h4 {
  font-size: 1.25rem;     /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

.text-body-lg {
  font-size: 1.125rem;    /* 18px */
  font-weight: 400;
  line-height: 1.6;
}

.text-body {
  font-size: 1rem;        /* 16px */
  font-weight: 400;
  line-height: 1.6;
}

.text-body-sm {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.5;
}

.text-caption {
  font-size: 0.75rem;     /* 12px */
  font-weight: 400;
  line-height: 1.4;
  color: var(--gray-500);
}
```

### 강조 스타일
```css
/* 토스식 강조 표현 */
.text-emphasis {
  font-weight: 700;
  color: var(--primary-600);
}

.text-highlight {
  background: linear-gradient(120deg, 
    var(--primary-100) 0%, 
    var(--primary-100) 100%);
  background-repeat: no-repeat;
  background-size: 100% 40%;
  background-position: 0 85%;
}

.text-number {
  font-family: var(--font-family-mono);
  font-weight: 600;
  color: var(--primary-600);
}

.text-success {
  font-weight: 600;
  color: var(--accent-600);
}
```

---

## 🎯 컴포넌트 디자인

### 버튼 (Buttons)
```css
/* 주요 액션 버튼 (토스 스타일) */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 보조 버튼 */
.btn-secondary {
  background: white;
  color: var(--primary-600);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid var(--primary-200);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

/* 큰 버튼 (히어로 섹션용) */
.btn-hero {
  background: var(--primary-500);
  color: white;
  padding: 20px 32px;
  border-radius: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.btn-hero:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}
```

### 카드 (Cards)
```css
/* 토스 스타일 카드 */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-100);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 서비스 카드 */
.service-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  border: 2px solid var(--gray-100);
  transition: all 0.3s ease;
  cursor: pointer;
}

.service-card:hover {
  border-color: var(--primary-200);
  background: var(--primary-50);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
}

.service-card .icon {
  font-size: 3rem;
  margin-bottom: 16px;
  display: block;
}

.service-card .title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.service-card .description {
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.5;
}
```

### 입력 필드 (Form Elements)
```css
/* 토스 스타일 입력 필드 */
.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: var(--primary-50);
}

.form-input::placeholder {
  color: var(--gray-400);
}

/* 라벨 */
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
}

/* 체크박스 (토스 스타일) */
.checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--gray-300);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox:checked {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}
```

---

## 📊 데이터 시각화

### 진단 결과 차트
```css
/* 레이더 차트 스타일 */
.radar-chart {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.radar-chart .title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-800);
  text-align: center;
  margin-bottom: 20px;
}

/* 점수 표시 */
.score-display {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, 
    var(--primary-50) 0%, 
    var(--accent-50) 100%);
  border-radius: 16px;
  margin: 16px 0;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: var(--primary-600);
  line-height: 1;
}

.score-label {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-top: 4px;
}

/* 진행률 바 */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--primary-500) 0%, 
    var(--accent-500) 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
}
```

### 성과 지표 카드
```css
.metric-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid var(--accent-500);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-family-mono);
  color: var(--accent-600);
  line-height: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-top: 4px;
}

.metric-change {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 8px;
}

.metric-change.positive {
  color: var(--accent-600);
}

.metric-change.positive::before {
  content: '↗ ';
}

.metric-change.negative {
  color: var(--error);
}

.metric-change.negative::before {
  content: '↘ ';
}
```

---

## 🎭 애니메이션 및 인터랙션

### 마이크로 인터랙션
```css
/* 토스 스타일 부드러운 애니메이션 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* 페이지 로딩 애니메이션 */
.animate-slide-in {
  animation: slideInUp 0.6s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.4s ease-out;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* 호버 효과 */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-glow {
  transition: box-shadow 0.3s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}
```

### 로딩 스피너
```css
/* 토스 스타일 로딩 스피너 */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 결과 로딩 */
.result-loading {
  text-align: center;
  padding: 40px 20px;
}

.result-loading .spinner {
  margin-bottom: 16px;
}

.result-loading .text {
  font-size: 1.125rem;
  color: var(--gray-600);
  font-weight: 500;
}
```

---

## 🎨 레이아웃 패턴

### 히어로 섹션
```css
.hero-section {
  background: linear-gradient(135deg, 
    var(--primary-50) 0%, 
    var(--accent-50) 100%);
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="%23E5E7EB" opacity="0.3"/></svg>');
  animation: float 20s linear infinite;
}

@keyframes float {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 24px;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--gray-600);
  margin-bottom: 40px;
  line-height: 1.6;
}
```

### 서비스 그리드
```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px;
  }
}
```

### 진단 폼 레이아웃
```css
.diagnosis-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.progress-header {
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-bar-container {
  margin-bottom: 16px;
}

.step-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--gray-600);
}

.question-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.question-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
  line-height: 1.4;
}

.question-options {
  margin: 24px 0;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.option-item.selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}
```

---

## 📱 모바일 반응형 디자인

### 브레이크포인트
```css
/* 토스 스타일 반응형 브레이크포인트 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* 모바일 우선 설계 */
@media (max-width: 767px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .btn-hero {
    width: 100%;
    padding: 18px;
  }
  
  .service-card {
    padding: 24px 20px;
  }
  
  .question-card {
    padding: 24px 20px;
    border-radius: 16px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 모바일 네비게이션
```css
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 12px 0;
  z-index: 100;
  display: none;
}

@media (max-width: 767px) {
  .mobile-nav {
    display: flex;
    justify-content: space-around;
  }
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--gray-500);
  font-size: 0.75rem;
  transition: color 0.2s ease;
}

.mobile-nav-item.active {
  color: var(--primary-500);
}

.mobile-nav-item .icon {
  font-size: 1.5rem;
  margin-bottom: 4px;
}
```

---

## 🎪 특별 컴포넌트

### AI 챗봇 UI
```css
/* 토스 스타일 챗봇 */
.chatbot-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.chatbot-trigger {
  width: 60px;
  height: 60px;
  background: var(--primary-500);
  border-radius: 50%;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  transition: all 0.3s ease;
}

.chatbot-trigger:hover {
  background: var(--primary-600);
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(59, 130, 246, 0.5);
}

.chatbot-panel {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: none;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  background: var(--primary-500);
  color: white;
  padding: 20px;
  text-align: center;
}

.chatbot-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.chatbot-input {
  padding: 20px;
  border-top: 1px solid var(--gray-200);
}

.chat-message {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.chat-bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.4;
}

.chat-bubble.bot {
  background: var(--gray-100);
  color: var(--gray-800);
}

.chat-bubble.user {
  background: var(--primary-500);
  color: white;
}
```

### 성과 대시보드
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--primary-500) 0%, 
    var(--accent-500) 100%);
}

.dashboard-title {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-bottom: 8px;
  font-weight: 500;
}

.dashboard-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  font-family: var(--font-family-mono);
  line-height: 1.2;
}

.dashboard-trend {
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-up {
  color: var(--accent-600);
}

.trend-down {
  color: var(--error);
}
```

---

## 🎨 다크 모드 (옵션)

### 다크 테마 컬러
```css
[data-theme="dark"] {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --border-color: #334155;
}

[data-theme="dark"] .card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .form-input {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .form-input:focus {
  background: var(--bg-primary);
}
```

---

## 📏 공간 및 그리드 시스템

### 스페이싱
```css
:root {
  /* 토스 스타일 일관된 spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}

/* 유틸리티 클래스 */
.p-4 { padding: var(--space-4); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }

.m-4 { margin: var(--space-4); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }

.mb-4 { margin-bottom: var(--space-4); }
.mb-6 { margin-bottom: var(--space-6); }
.mb-8 { margin-bottom: var(--space-8); }
```

---

## 📞 문서 정보

### 디자인 가이드 적용
이 디자인 가이드는 토스의 신뢰성과 사용성을 경영지도센터의 전문성과 결합하여 B2B 고객에게 최적화된 경험을 제공합니다.

### 핵심 특징
- **신뢰성**: 금융 서비스 수준의 안정감
- **전문성**: B2B에 최적화된 비즈니스 톤앤매너  
- **효율성**: 직관적이고 빠른 사용자 경험
- **확장성**: 다양한 디바이스와 화면에서 일관된 경험

### 연락처
- **담당자**: 이후경 경영지도사
- **이메일**: hongik423@gmail.com
- **전화**: 010-9251-9743

---

*이 디자인 가이드를 통해 사용자에게 신뢰할 수 있고 효율적인 경영지도 서비스 경험을 제공하여 매출 증대 목표를 달성할 수 있을 것입니다.*