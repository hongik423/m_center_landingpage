# 경영지도센터 통합 플랫폼 UI/UX 디자인 가이드

## 📋 목차
1. [디자인 시스템 개요](#디자인-시스템-개요)
2. [컬러 팔레트](#컬러-팔레트)
3. [페이지 구현 가이드](#페이지-구현-가이드)
4. [레이아웃 컴포넌트](#레이아웃-컴포넌트)
5. [인터랙션 패턴](#인터랙션-패턴)
6. [반응형 브레이크포인트](#반응형-브레이크포인트)

---

## 🎨 디자인 시스템 개요

### 참조 서비스 분석: 토스 (Toss)

#### 토스의 디자인 특징 분석
| 요소 | 토스의 특징 | 경영지도센터 적용 방안 |
|------|-------------|----------------------|
| **디자인 스타일** | 미니멀하고 모던한 카드 기반 레이아웃 | 전문성과 신뢰성을 강조하는 비즈니스 친화적 디자인 |
| **색상 체계** | 블루 컬러 중심의 밝고 친근한 톤 | 전문적인 네이비와 신뢰감 있는 블루 중심 |
| **타이포그래피** | 명확한 계층 구조와 가독성 중심 | 비즈니스 콘텐츠에 최적화된 폰트 체계 |
| **인터랙션** | 부드럽고 직관적인 애니메이션 | 진단과 상담 프로세스를 위한 단계별 가이드 |

### 디자인 철학

#### 핵심 원칙
1. **전문성 (Professionalism)**: 신뢰할 수 있는 비즈니스 파트너임을 시각적으로 전달
2. **단순함 (Simplicity)**: 복잡한 컨설팅 프로세스를 직관적으로 표현
3. **일관성 (Consistency)**: 5개 서비스 영역 간 통일된 경험 제공
4. **접근성 (Accessibility)**: 모든 사용자가 쉽게 이용할 수 있는 인터페이스

#### 무드 앤 톤
- **무드**: 전문적이면서도 친근한, 신뢰할 수 있는
- **톤**: 차분하고 안정적인, 혁신적이면서도 검증된
- **분위기**: 깔끔하고 정돈된, 효율적이고 실용적인

---

## 🎨 컬러 팔레트

### Tailwind CSS 컬러 시스템

#### Primary Colors (주요 색상)
```css
/* 기업 신뢰성을 나타내는 깊은 네이비 */
primary: {
  50: '#eff6ff',   /* 매우 연한 배경 */
  100: '#dbeafe',  /* 연한 배경 */
  200: '#bfdbfe',  /* 호버 상태 */
  300: '#93c5fd',  /* 비활성 상태 */
  400: '#60a5fa',  /* 보조 강조 */
  500: '#3b82f6',  /* 기본 주요 색상 */
  600: '#2563eb',  /* 클릭 상태 */
  700: '#1d4ed8',  /* 강조 텍스트 */
  800: '#1e40af',  /* 다크 모드 */
  900: '#1e3a8a',  /* 최고 강조 */
  950: '#172554'   /* 헤더/푸터 */
}
```

#### Secondary Colors (보조 색상)
```css
/* 성장과 성공을 상징하는 그린 */
secondary: {
  50: '#f0fdf4',   
  100: '#dcfce7',  
  200: '#bbf7d0',  
  300: '#86efac',  
  400: '#4ade80',  
  500: '#22c55e',  /* 성공 메시지, 완료 상태 */
  600: '#16a34a',  
  700: '#15803d',  
  800: '#166534',  
  900: '#14532d',  
  950: '#052e16'   
}
```

#### Accent Colors (강조 색상)
```css
/* 혁신과 AI를 나타내는 퍼플 */
accent: {
  50: '#faf5ff',   
  100: '#f3e8ff',  
  200: '#e9d5ff',  
  300: '#d8b4fe',  
  400: '#c084fc',  
  500: '#a855f7',  /* AI 관련 기능 강조 */
  600: '#9333ea',  
  700: '#7c3aed',  
  800: '#6b21a8',  
  900: '#581c87',  
  950: '#3b0764'   
}
```

#### Warning/Alert Colors (경고 색상)
```css
/* 주의사항과 중요 정보 */
warning: {
  50: '#fffbeb',   
  100: '#fef3c7',  
  200: '#fde68a',  
  300: '#fcd34d',  
  400: '#fbbf24',  
  500: '#f59e0b',  /* 경고 메시지 */
  600: '#d97706',  
  700: '#b45309',  
  800: '#92400e',  
  900: '#78350f',  
  950: '#451a03'   
}

/* 오류와 위험 상황 */
error: {
  50: '#fef2f2',   
  100: '#fee2e2',  
  200: '#fecaca',  
  300: '#fca5a5',  
  400: '#f87171',  
  500: '#ef4444',  /* 오류 메시지 */
  600: '#dc2626',  
  700: '#b91c1c',  
  800: '#991b1b',  
  900: '#7f1d1d',  
  950: '#450a0a'   
}
```

#### Neutral Colors (중성 색상)
```css
/* 텍스트와 배경을 위한 그레이 스케일 */
neutral: {
  50: '#f8fafc',   /* 최상위 배경 */
  100: '#f1f5f9',  /* 카드 배경 */
  200: '#e2e8f0',  /* 구분선 */
  300: '#cbd5e1',  /* 비활성 요소 */
  400: '#94a3b8',  /* 플레이스홀더 */
  500: '#64748b',  /* 보조 텍스트 */
  600: '#475569',  /* 본문 텍스트 */
  700: '#334155',  /* 중요 텍스트 */
  800: '#1e293b',  /* 제목 텍스트 */
  900: '#0f172a',  /* 최고 강조 텍스트 */
  950: '#020617'   /* 다크 모드 */
}
```

### 서비스별 색상 매핑

| 서비스 영역 | 대표 색상 | 용도 | Hex 코드 |
|-------------|-----------|------|----------|
| **AI 활용 생산성향상** | Accent Purple | 아이콘, 강조 요소 | `#a855f7` |
| **경매활용 공장구매** | Warning Orange | 투자 관련 강조 | `#f59e0b` |
| **기술사업화/기술창업** | Secondary Green | 성장, 성공 표현 | `#22c55e` |
| **인증지원** | Primary Blue | 신뢰성, 전문성 | `#3b82f6` |
| **웹사이트 구축** | Accent Purple | 디지털 혁신 | `#a855f7` |

---

## 📄 페이지 구현 가이드

### 1. 홈페이지 (/)

#### 핵심 목적
- Business Model Zen 프레임워크 소개
- 5대 서비스 영역 명확한 전달
- 즉시 진단 시작 유도

#### 주요 컴포넌트

##### Hero Section
```html
<!-- 메인 히어로 섹션 -->
<section class="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-primary-900 mb-6">
        Business Model Zen으로<br>
        <span class="text-primary-600">기업 성장의 5단계</span>를 완성하세요
      </h1>
      <p class="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
        AI, 공장구매, 기술창업, 인증, 웹사이트 - 5대 영역 통합 솔루션으로 
        기업별 맞춤 컨설팅을 경험하세요
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
          무료 진단 시작하기
        </button>
        <button class="bg-white hover:bg-neutral-50 text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
          전문가 상담 신청
        </button>
      </div>
    </div>
  </div>
</section>
```

##### 서비스 카드 섹션
```html
<!-- 5대 핵심 서비스 -->
<section class="py-20 bg-white">
  <div class="container mx-auto px-4">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
        5대 핵심 서비스
      </h2>
      <p class="text-xl text-neutral-600 max-w-2xl mx-auto">
        기업 성장 단계별 맞춤형 솔루션으로 경쟁력을 확보하세요
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- AI 활용 생산성향상 카드 -->
      <div class="bg-white border border-neutral-200 rounded-xl p-8 hover:shadow-lg transition-shadow group">
        <div class="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent-200 transition-colors">
          <svg class="w-8 h-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
            <!-- AI 아이콘 -->
          </svg>
        </div>
        <h3 class="text-xl font-bold text-neutral-900 mb-3">AI 활용 생산성향상</h3>
        <p class="text-neutral-600 mb-4">
          20주 프로그램으로 업무 효율성 40% 향상
        </p>
        <div class="text-accent-600 font-semibold mb-4">
          ✓ 정부 100% 지원
        </div>
        <button class="w-full bg-accent-50 hover:bg-accent-100 text-accent-700 py-3 rounded-lg font-semibold transition-colors">
          AI 진단 시작하기
        </button>
      </div>
      
      <!-- 추가 서비스 카드들... -->
    </div>
  </div>
</section>
```

#### 레이아웃 구조
```
Header (고정)
├── Hero Section (전체 화면)
├── 5대 서비스 카드 그리드
├── 성장 단계 가이드
├── 실시간 성과 지표
├── 고객 후기 슬라이더
└── Footer
```

### 2. 서비스 상세 페이지 (/services/[service])

#### 핵심 목적
- 각 서비스의 상세 정보 제공
- Business Model Zen 5단계 프로세스 설명
- 진단 시작으로 유도

#### 주요 컴포넌트

##### 서비스 히어로
```html
<section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 성장 단계별 헤드라인 -->
      <div class="mb-8">
        <span class="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
          Step 1 (1-3년)
        </span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold mb-6">
        창업 초기, AI로 1인 다역할 완성하세요
      </h1>
      <p class="text-xl text-primary-100 mb-8 max-w-2xl">
        20주 프로그램으로 업무 효율성 40% 향상, 정부 100% 지원
      </p>
      
      <!-- 핵심 지표 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="text-center">
          <div class="text-3xl font-bold text-white">40%</div>
          <div class="text-primary-200">업무 효율성 향상</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-white">20주</div>
          <div class="text-primary-200">집중 프로그램</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-white">100%</div>
          <div class="text-primary-200">정부 지원</div>
        </div>
      </div>
      
      <button class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-50 transition-colors">
        무료 진단 시작하기
      </button>
    </div>
  </div>
</section>
```

### 3. 진단 시스템 페이지 (/diagnosis/[service])

#### 핵심 목적
- 단계별 진단 질문 제시
- 실시간 진행률 표시
- 사용자 친화적 인터페이스

#### 주요 컴포넌트

##### 진단 헤더
```html
<header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button class="text-neutral-500 hover:text-neutral-700">
          ← 뒤로가기
        </button>
        <h1 class="text-lg font-semibold text-neutral-900">
          AI 활용 생산성 진단
        </h1>
      </div>
      
      <!-- 진행률 표시 -->
      <div class="flex items-center space-x-3">
        <span class="text-sm text-neutral-600">3/7 단계</span>
        <div class="w-32 h-2 bg-neutral-200 rounded-full">
          <div class="w-12 h-2 bg-primary-600 rounded-full transition-all duration-300"></div>
        </div>
        <span class="text-sm text-neutral-600">42%</span>
      </div>
    </div>
  </div>
</header>
```

##### 질문 카드
```html
<div class="max-w-2xl mx-auto p-6">
  <div class="bg-white rounded-xl border border-neutral-200 p-8">
    <!-- 질문 헤더 -->
    <div class="mb-6">
      <div class="text-sm text-primary-600 font-semibold mb-2">Step 3: 조직 현황</div>
      <h2 class="text-2xl font-bold text-neutral-900 mb-3">
        현재 가장 큰 생산성 저해 요인은 무엇인가요?
      </h2>
      <p class="text-neutral-600">
        귀하의 조직에서 업무 효율성을 떨어뜨리는 주요 원인을 선택해주세요.
      </p>
    </div>
    
    <!-- 선택 옵션 -->
    <div class="space-y-3">
      <label class="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
        <input type="radio" name="productivity_issue" class="sr-only">
        <div class="w-5 h-5 border-2 border-neutral-300 rounded-full mr-4 flex items-center justify-center">
          <div class="w-3 h-3 bg-primary-600 rounded-full hidden"></div>
        </div>
        <div>
          <div class="font-semibold text-neutral-900">반복적인 업무</div>
          <div class="text-sm text-neutral-600">문서 작성, 데이터 입력 등</div>
        </div>
      </label>
      <!-- 추가 옵션들... -->
    </div>
    
    <!-- 네비게이션 버튼 -->
    <div class="flex justify-between mt-8">
      <button class="px-6 py-3 text-neutral-600 hover:text-neutral-800 font-semibold">
        이전 질문
      </button>
      <button class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors">
        다음 질문
      </button>
    </div>
  </div>
</div>
```

### 4. 진단 결과 페이지 (/results/[id])

#### 핵심 목적
- 분석 결과의 시각적 표현
- 맞춤형 추천사항 제시
- 상담 신청으로 유도

#### 주요 컴포넌트

##### 결과 대시보드
```html
<section class="py-12 bg-neutral-50">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto">
      <!-- 결과 헤더 -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center px-4 py-2 bg-secondary-100 text-secondary-800 rounded-full text-sm font-semibold mb-4">
          ✓ 진단 완료
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          (주)혁신기술님의 AI 활용 잠재력
        </h1>
        <p class="text-xl text-neutral-600">
          귀하의 기업은 충분한 성장 가능성을 보유하고 있습니다
        </p>
      </div>
      
      <!-- 점수 대시보드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="bg-white rounded-xl p-6 text-center border border-neutral-200">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl font-bold text-primary-600">65</span>
          </div>
          <h3 class="font-semibold text-neutral-900 mb-1">AI 활용 성숙도</h3>
          <p class="text-sm text-neutral-600">업종 평균 대비 상위 30%</p>
        </div>
        <!-- 추가 점수 카드들... -->
      </div>
      
      <!-- 레이더 차트 -->
      <div class="bg-white rounded-xl p-8 mb-12 border border-neutral-200">
        <h3 class="text-xl font-bold text-neutral-900 mb-6 text-center">종합 분석 결과</h3>
        <div class="relative h-80 flex items-center justify-center">
          <!-- 차트 컴포넌트 위치 -->
          <img src="https://picsum.photos/400/300?random=chart" alt="분석 결과 차트" class="rounded-lg">
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 🧱 레이아웃 컴포넌트

### Header Component

#### 적용 라우트
- 모든 페이지 (`*`)

#### 핵심 컴포넌트
```html
<header class="bg-white border-b border-neutral-200 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <nav class="flex items-center justify-between h-16">
      <!-- 로고 -->
      <div class="flex items-center">
        <img src="https://picsum.photos/120/40?random=logo" alt="경영지도센터" class="h-8">
      </div>
      
      <!-- 메인 네비게이션 (데스크톱) -->
      <div class="hidden lg:flex items-center space-x-8">
        <div class="relative group">
          <button class="flex items-center text-neutral-700 hover:text-primary-600 font-medium">
            서비스소개
            <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- 드롭다운 메뉴 -->
          <div class="absolute top-full left-0 mt-1 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div class="p-2">
              <a href="/services/ai-productivity" class="flex items-center p-3 rounded-lg hover:bg-neutral-50">
                <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-accent-600">🤖</span>
                </div>
                <div>
                  <div class="font-semibold text-neutral-900">AI 활용 생산성향상</div>
                  <div class="text-sm text-neutral-600">업무 효율성 40% 향상</div>
                </div>
              </a>
              <!-- 추가 서비스 메뉴들... -->
            </div>
          </div>
        </div>
        
        <a href="/diagnosis" class="text-neutral-700 hover:text-primary-600 font-medium">진단및상담</a>
        <a href="/cases" class="text-neutral-700 hover:text-primary-600 font-medium">성공사례</a>
        <a href="/about" class="text-neutral-700 hover:text-primary-600 font-medium">회사소개</a>
        <a href="/support" class="text-neutral-700 hover:text-primary-600 font-medium">고객지원</a>
      </div>
      
      <!-- 액션 버튼들 -->
      <div class="hidden lg:flex items-center space-x-4">
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          무료상담신청
        </button>
        <button class="bg-accent-100 hover:bg-accent-200 text-accent-700 px-4 py-2 rounded-lg font-semibold transition-colors">
          AI챗봇
        </button>
      </div>
      
      <!-- 모바일 메뉴 버튼 -->
      <button class="lg:hidden p-2 text-neutral-600 hover:text-neutral-900">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  </div>
</header>
```

#### 반응형 동작
- **Desktop (1024px+)**: 전체 네비게이션 표시, 드롭다운 메뉴
- **Tablet (768px-1023px)**: 압축된 메뉴, 중요 항목만 표시
- **Mobile (320px-767px)**: 햄버거 메뉴, 플로팅 액션 버튼

### Footer Component

#### 적용 라우트
- 모든 페이지 (`*`)

#### 핵심 컴포넌트
```html
<footer class="bg-neutral-900 text-white">
  <div class="container mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- 회사 정보 -->
      <div>
        <img src="https://picsum.photos/120/40?random=logo-white" alt="경영지도센터" class="h-8 mb-4">
        <p class="text-neutral-300 mb-4">
          Business Model Zen 프레임워크로 기업 성장을 지원하는 전문 컨설팅 기업
        </p>
        <div class="text-sm text-neutral-400">
          <p>📞 010-9251-9743</p>
          <p>📧 hongik423@gmail.com</p>
        </div>
      </div>
      
      <!-- 서비스 링크 -->
      <div>
        <h4 class="font-semibold mb-4">서비스</h4>
        <ul class="space-y-2 text-neutral-300">
          <li><a href="/services/ai-productivity" class="hover:text-white transition-colors">AI 활용 생산성향상</a></li>
          <li><a href="/services/factory-auction" class="hover:text-white transition-colors">경매활용 공장구매</a></li>
          <li><a href="/services/tech-startup" class="hover:text-white transition-colors">기술사업화 경영지도</a></li>
          <li><a href="/services/certification" class="hover:text-white transition-colors">인증지원</a></li>
          <li><a href="/services/website" class="hover:text-white transition-colors">웹사이트 구축</a></li>
        </ul>
      </div>
      
      <!-- 고객지원 -->
      <div>
        <h4 class="font-semibold mb-4">고객지원</h4>
        <ul class="space-y-2 text-neutral-300">
          <li><a href="/support/faq" class="hover:text-white transition-colors">자주묻는질문</a></li>
          <li><a href="/support/notices" class="hover:text-white transition-colors">공지사항</a></li>
          <li><a href="/support/downloads" class="hover:text-white transition-colors">자료실</a></li>
          <li><a href="/support/contact" class="hover:text-white transition-colors">1:1 문의</a></li>
        </ul>
      </div>
      
      <!-- 소셜 미디어 -->
      <div>
        <h4 class="font-semibold mb-4">팔로우하기</h4>
        <div class="flex space-x-3">
          <a href="#" class="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
            <span>📘</span>
          </a>
          <a href="#" class="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
            <span>📱</span>
          </a>
          <a href="#" class="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
            <span>▶️</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- 하단 정보 -->
    <div class="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p class="text-neutral-400 text-sm">© 2025 경영지도센터. All rights reserved.</p>
      <div class="flex space-x-6 mt-4 md:mt-0">
        <a href="/privacy" class="text-neutral-400 hover:text-white text-sm transition-colors">개인정보처리방침</a>
        <a href="/terms" class="text-neutral-400 hover:text-white text-sm transition-colors">이용약관</a>
      </div>
    </div>
  </div>
</footer>
```

### Card Component

#### 적용 라우트
- 홈페이지 (`/`)
- 서비스 페이지 (`/services/*`)
- 성공사례 (`/cases/*`)

#### 기본 카드 구조
```html
<!-- 기본 카드 템플릿 -->
<div class="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg transition-shadow group">
  <!-- 아이콘/이미지 -->
  <div class="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
    <img src="https://picsum.photos/32/32?random=service" alt="서비스 아이콘" class="w-8 h-8">
  </div>
  
  <!-- 제목과 설명 -->
  <h3 class="text-xl font-bold text-neutral-900 mb-3">서비스 제목</h3>
  <p class="text-neutral-600 mb-4">서비스에 대한 간단한 설명이 들어갑니다.</p>
  
  <!-- 핵심 지표 -->
  <div class="text-primary-600 font-semibold mb-4">✓ 주요 혜택</div>
  
  <!-- 액션 버튼 -->
  <button class="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-3 rounded-lg font-semibold transition-colors">
    자세히 보기
  </button>
</div>
```

### Form Component

#### 적용 라우트
- 진단 시스템 (`/diagnosis/*`)
- 상담 신청 (`/consultation/*`)
- 문의 폼 (`/support/contact`)

#### 폼 입력 요소
```html
<!-- 텍스트 입력 -->
<div class="mb-6">
  <label class="block text-sm font-semibold text-neutral-900 mb-2">회사명 *</label>
  <input type="text" 
         class="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
         placeholder="회사명을 입력하세요">
  <p class="mt-1 text-sm text-neutral-500">정확한 회사명을 입력해주세요.</p>
</div>

<!-- 선택 옵션 (라디오) -->
<div class="space-y-3">
  <label class="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
    <input type="radio" name="option" class="sr-only peer">
    <div class="w-5 h-5 border-2 border-neutral-300 rounded-full mr-4 flex items-center justify-center peer-checked:border-primary-600">
      <div class="w-3 h-3 bg-primary-600 rounded-full hidden peer-checked:block"></div>
    </div>
    <div>
      <div class="font-semibold text-neutral-900">옵션 제목</div>
      <div class="text-sm text-neutral-600">옵션에 대한 설명</div>
    </div>
  </label>
</div>

<!-- 다중 선택 (체크박스) -->
<div class="space-y-3">
  <label class="flex items-center p-4 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors">
    <input type="checkbox" class="sr-only peer">
    <div class="w-5 h-5 border-2 border-neutral-300 rounded mr-4 flex items-center justify-center peer-checked:border-primary-600 peer-checked:bg-primary-600">
      <svg class="w-3 h-3 text-white hidden peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>
    <span class="font-semibold text-neutral-900">선택 항목</span>
  </label>
</div>

<!-- 슬라이더 -->
<div class="mb-6">
  <label class="block text-sm font-semibold text-neutral-900 mb-2">만족도 (0-100%)</label>
  <div class="relative">
    <input type="range" min="0" max="100" value="50" 
           class="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer slider">
    <div class="flex justify-between text-xs text-neutral-500 mt-1">
      <span>0%</span>
      <span>50%</span>
      <span>100%</span>
    </div>
  </div>
</div>
```

---

## ⚡ 인터랙션 패턴

### 버튼 인터랙션

#### 기본 버튼 상태
```css
/* Primary 버튼 */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 active:bg-primary-800 
         text-white font-semibold py-3 px-6 rounded-lg 
         transition-all duration-200 transform hover:scale-105;
}

/* Secondary 버튼 */
.btn-secondary {
  @apply bg-white hover:bg-neutral-50 active:bg-neutral-100 
         text-primary-600 border-2 border-primary-600 
         font-semibold py-3 px-6 rounded-lg 
         transition-all duration-200;
}

/* Ghost 버튼 */
.btn-ghost {
  @apply bg-transparent hover:bg-primary-50 
         text-primary-600 hover:text-primary-700 
         font-semibold py-3 px-6 rounded-lg 
         transition-colors duration-200;
}
```

#### 로딩 상태
```html
<button class="btn-primary flex items-center" disabled>
  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  분석 중...
</button>
```

### 카드 호버 효과

```css
.card-hover {
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.card-hover:hover .card-icon {
  @apply scale-110 transition-transform duration-300;
}

.card-hover:hover .card-title {
  @apply text-primary-600 transition-colors duration-300;
}
```

### 애니메이션 패턴

#### 페이지 전환
```css
/* 페이지 진입 애니메이션 */
.page-enter {
  @apply opacity-0 translate-y-4;
  animation: pageEnter 0.5s ease-out forwards;
}

@keyframes pageEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 요소별 지연 애니메이션 */
.stagger-animation > * {
  @apply opacity-0 translate-y-4;
  animation: staggerIn 0.6s ease-out forwards;
}

.stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
.stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
.stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
```

#### 진단 진행률 애니메이션
```css
.progress-bar {
  @apply bg-neutral-200 rounded-full h-2 overflow-hidden;
}

.progress-fill {
  @apply bg-primary-600 h-full rounded-full transition-all duration-500 ease-out;
  width: var(--progress-width);
}

/* 펄스 효과 */
.pulse-effect {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
```

### 모달 및 오버레이

#### 모달 구조
```html
<!-- 모달 오버레이 -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
     onclick="closeModal()">
  <!-- 모달 컨테이너 -->
  <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 transform transition-all duration-300"
       onclick="event.stopPropagation()">
    <!-- 모달 헤더 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-neutral-900">진단 저장</h2>
      <button class="text-neutral-400 hover:text-neutral-600" onclick="closeModal()">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <!-- 모달 본문 -->
    <div class="mb-6">
      <p class="text-neutral-600">
        진행 중인 진단을 저장하시겠습니까? 나중에 이어서 진행할 수 있습니다.
      </p>
    </div>
    
    <!-- 모달 액션 -->
    <div class="flex space-x-3">
      <button class="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-lg font-semibold transition-colors" onclick="closeModal()">
        취소
      </button>
      <button class="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors" onclick="saveProgress()">
        저장
      </button>
    </div>
  </div>
</div>
```

### 알림 및 피드백

#### 토스트 알림
```html
<!-- 성공 알림 -->
<div class="fixed top-4 right-4 bg-secondary-600 text-white px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50">
  <div class="flex items-center">
    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
    </svg>
    <span class="font-semibold">진단이 성공적으로 저장되었습니다!</span>
  </div>
</div>

<!-- 오류 알림 -->
<div class="fixed top-4 right-4 bg-error-600 text-white px-6 py-4 rounded-lg shadow-lg">
  <div class="flex items-center">
    <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>
    <span class="font-semibold">오류가 발생했습니다. 다시 시도해주세요.</span>
  </div>
</div>
```

---

## 📱 반응형 브레이크포인트

### 브레이크포인트 정의
```scss
$breakpoints: (
  'mobile': 320px,   // 최소 모바일 화면
  'tablet': 768px,   // 태블릿 화면
  'desktop': 1024px, // 데스크톱 화면
  'wide': 1440px     // 와이드 스크린
);
```

### Tailwind CSS 커스텀 설정
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '320px',   // 모바일
      'md': '768px',   // 태블릿
      'lg': '1024px',  // 데스크톱
      'xl': '1440px',  // 와이드 스크린
    },
    extend: {
      // 커스텀 컬러 팔레트 추가
      colors: {
        primary: { /* 위에서 정의한 primary 색상 */ },
        secondary: { /* 위에서 정의한 secondary 색상 */ },
        // ...
      }
    }
  }
}
```

### 반응형 레이아웃 패턴

#### Grid 시스템
```html
<!-- 서비스 카드 그리드 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- 카드 아이템들 -->
</div>

<!-- 콘텐츠 + 사이드바 레이아웃 -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-2">
    <!-- 메인 콘텐츠 -->
  </div>
  <div class="lg:col-span-1">
    <!-- 사이드바 -->
  </div>
</div>
```

#### 타이포그래피 반응형
```css
/* 헤딩 크기 조정 */
.heading-1 {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold;
}

.heading-2 {
  @apply text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold;
}

.heading-3 {
  @apply text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold;
}

/* 본문 텍스트 */
.body-text {
  @apply text-sm sm:text-base md:text-lg;
}
```

#### 컨테이너 및 여백
```css
/* 컨테이너 크기 */
.container {
  @apply mx-auto px-4 sm:px-6 lg:px-8;
  max-width: 1440px;
}

/* 섹션 여백 */
.section-padding {
  @apply py-8 sm:py-12 md:py-16 lg:py-20;
}

/* 요소 간 여백 */
.element-spacing {
  @apply space-y-4 sm:space-y-6 md:space-y-8;
}
```

### 모바일 특화 컴포넌트

#### 하단 네비게이션 (모바일)
```html
<!-- 모바일 하단 고정 네비게이션 -->
<nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
  <div class="grid grid-cols-4 gap-1">
    <a href="/" class="flex flex-col items-center py-3 text-primary-600">
      <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
        <!-- 홈 아이콘 -->
      </svg>
      <span class="text-xs font-semibold">홈</span>
    </a>
    <a href="/services" class="flex flex-col items-center py-3 text-neutral-600">
      <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
        <!-- 서비스 아이콘 -->
      </svg>
      <span class="text-xs">서비스</span>
    </a>
    <a href="/diagnosis" class="flex flex-col items-center py-3 text-neutral-600">
      <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
        <!-- 진단 아이콘 -->
      </svg>
      <span class="text-xs">진단</span>
    </a>
    <a href="/support" class="flex flex-col items-center py-3 text-neutral-600">
      <svg class="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
        <!-- 지원 아이콘 -->
      </svg>
      <span class="text-xs">지원</span>
    </a>
  </div>
</nav>
```

#### 플로팅 액션 버튼
```html
<!-- AI 챗봇 플로팅 버튼 -->
<button class="lg:hidden fixed bottom-20 right-4 w-14 h-14 bg-accent-600 hover:bg-accent-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-all duration-300 hover:scale-110">
  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <!-- 챗봇 아이콘 -->
  </svg>
  <div class="absolute -top-1 -right-1 w-4 h-4 bg-error-500 rounded-full flex items-center justify-center">
    <span class="text-xs text-white font-bold">1</span>
  </div>
</button>
```

### 접근성 고려사항

#### 포커스 관리
```css
/* 키보드 포커스 스타일 */
.focus-visible {
  @apply outline-none ring-2 ring-primary-500 ring-offset-2;
}

/* 스킵 링크 */
.skip-link {
  @apply absolute -top-10 left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus:top-4 transition-all;
}
```

#### 색상 대비 및 가독성
```css
/* 최소 대비율 4.5:1 보장 */
.text-contrast-high {
  color: #1e293b; /* neutral-800 */
}

.text-contrast-medium {
  color: #475569; /* neutral-600 */
}

.text-contrast-low {
  color: #64748b; /* neutral-500 */
}
```

---

## 📋 구현 가이드라인

### 개발 우선순위

1. **Phase 1**: 핵심 레이아웃 및 컴포넌트 (Header, Footer, Card)
2. **Phase 2**: 홈페이지 및 서비스 페이지 구현
3. **Phase 3**: 진단 시스템 UI/UX 구현
4. **Phase 4**: 반응형 최적화 및 접근성 개선

### 디자인 시스템 유지보수

#### 컬러 팔레트 확장 원칙
- 기존 neutral, primary, secondary 색상 체계 유지
- 새로운 기능 추가 시 accent 색상 활용
- 브랜드 일관성을 위해 색상 변경 최소화

#### 컴포넌트 재사용 가이드
- 공통 스타일은 Tailwind 클래스로 정의
- 복잡한 인터랙션은 별도 CSS/JS 파일로 분리
- 컴포넌트별 문서화 및 예시 코드 제공

이 UI/UX 디자인 가이드를 따라 구현하면 토스와 같은 세련되고 사용자 친화적인 인터페이스를 제공하면서도, 비즈니스 컨설팅 플랫폼에 적합한 전문성과 신뢰성을 갖춘 디자인을 구현할 수 있습니다.

---

**문서 작성일**: 2025년 6월 15일  
**문서 버전**: v1.0  
**검토자**: UI/UX 디자인팀  
**참조 디자인 시스템**: 토스 (Toss)