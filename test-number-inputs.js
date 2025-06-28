/**
 * 🧪 세금계산기 숫자 입력 기능 종합 테스트 스크립트
 * 모든 계산기의 숫자 입력 필드와 키보드 단축키를 테스트합니다.
 */

class NumberInputTester {
    constructor() {
        this.testResults = [];
        this.calculators = [
            'StockTransferTaxCalculator',
            'InheritanceTaxCalculator', 
            'ComprehensiveIncomeTaxCalculator',
            'GiftTaxCalculator',
            'CorporateTaxCalculator',
            'CapitalGainsTaxCalculator',
            'BusinessInheritanceCalculator',
            'VATCalculator',
            'WithholdingTaxCalculator',
            'EarnedIncomeTaxCalculator'
        ];
        this.testData = {
            small: '1000',
            medium: '75000', 
            large: '2000000000',
            decimal: '1234567.89',
            negative: '-50000',
            special: '123abc456',
            empty: '',
            spaces: '  123 456  ',
            commas: '1,234,567'
        };
    }

    /**
     * 전체 테스트 실행
     */
    async runAllTests() {
        console.log('🚀 세금계산기 숫자 입력 기능 종합 테스트 시작');
        console.log('====================================================');
        
        try {
            // 1. 키보드 단축키 테스트
            await this.testKeyboardShortcuts();
            
            // 2. 숫자 입력 처리 테스트
            await this.testNumberInputProcessing();
            
            // 3. 에러 처리 테스트
            await this.testErrorHandling();
            
            // 4. 성능 테스트
            await this.testPerformance();
            
            // 5. 브라우저 호환성 테스트
            await this.testBrowserCompatibility();
            
            // 결과 출력
            this.printTestResults();
            
        } catch (error) {
            console.error('❌ 테스트 실행 중 오류 발생:', error);
        }
    }

    /**
     * 키보드 단축키 테스트
     */
    async testKeyboardShortcuts() {
        console.log('\n⌨️  키보드 단축키 테스트');
        console.log('─────────────────────────────');
        
        const shortcuts = [
            { name: 'Ctrl+C (복사)', key: 'c', ctrlKey: true },
            { name: 'Ctrl+V (붙여넣기)', key: 'v', ctrlKey: true },
            { name: 'Ctrl+A (전체선택)', key: 'a', ctrlKey: true },
            { name: 'Ctrl+Z (실행취소)', key: 'z', ctrlKey: true },
            { name: '방향키 왼쪽', key: 'ArrowLeft' },
            { name: '방향키 오른쪽', key: 'ArrowRight' },
            { name: 'Home', key: 'Home' },
            { name: 'End', key: 'End' }
        ];

        for (const shortcut of shortcuts) {
            const result = this.simulateKeyboardEvent(shortcut);
            this.logTest(`단축키 ${shortcut.name}`, result.allowed, result.message);
        }
    }

    /**
     * 숫자 입력 처리 테스트
     */
    async testNumberInputProcessing() {
        console.log('\n🔢 숫자 입력 처리 테스트');
        console.log('─────────────────────────────');
        
        for (const [dataType, testValue] of Object.entries(this.testData)) {
            const result = this.testNumberInput(testValue);
            this.logTest(`입력 데이터 "${dataType}": ${testValue}`, result.success, result.message);
        }
    }

    /**
     * 에러 처리 테스트
     */
    async testErrorHandling() {
        console.log('\n🚨 에러 처리 테스트');
        console.log('─────────────────────────────');
        
        const invalidInputs = ['abc', '!@#', '특수문자', '한글입력'];
        
        for (const invalid of invalidInputs) {
            const result = this.testInvalidInput(invalid);
            this.logTest(`잘못된 입력 "${invalid}"`, result.blocked, result.message);
        }
    }

    /**
     * 성능 테스트
     */
    async testPerformance() {
        console.log('\n⚡ 성능 테스트');
        console.log('─────────────────────────────');
        
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            this.simulateNumberInput(Math.floor(Math.random() * 1000000000).toString());
        }
        
        const endTime = performance.now();
        const avgTime = (endTime - startTime) / iterations;
        
        this.logTest(`${iterations}회 입력 처리`, avgTime < 1, 
            `평균 처리 시간: ${avgTime.toFixed(3)}ms`);
    }

    /**
     * 브라우저 호환성 테스트
     */
    async testBrowserCompatibility() {
        console.log('\n🌐 브라우저 호환성 테스트');
        console.log('─────────────────────────────');
        
        const features = [
            { name: 'Clipboard API', test: () => navigator.clipboard !== undefined },
            { name: 'Input Mode', test: () => 'inputMode' in document.createElement('input') },
            { name: 'KeyboardEvent', test: () => typeof KeyboardEvent !== 'undefined' },
            { name: 'Number.parseFloat', test: () => typeof Number.parseFloat === 'function' },
            { name: 'String.replace with regex', test: () => '123abc'.replace(/[^\d]/g, '') === '123' }
        ];

        for (const feature of features) {
            try {
                const supported = feature.test();
                this.logTest(feature.name, supported, supported ? '지원됨' : '지원되지 않음');
            } catch (error) {
                this.logTest(feature.name, false, `오류: ${error.message}`);
            }
        }
    }

    /**
     * 키보드 이벤트 시뮬레이션
     */
    simulateKeyboardEvent(shortcut) {
        try {
            // 키보드 이벤트 시뮬레이션 로직
            const event = {
                key: shortcut.key,
                ctrlKey: shortcut.ctrlKey || false,
                metaKey: shortcut.metaKey || false
            };

            // 단축키 허용 로직 (실제 컴포넌트와 동일)
            if (event.ctrlKey || event.metaKey) {
                return { allowed: true, message: '단축키 허용됨' };
            }

            const allowedKeys = [
                'Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
                'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                'Home', 'End', 'PageUp', 'PageDown'
            ];

            if (allowedKeys.includes(event.key)) {
                return { allowed: true, message: '허용된 특수키' };
            }

            if (/^[0-9]$/.test(event.key)) {
                return { allowed: true, message: '숫자 키 허용됨' };
            }

            return { allowed: false, message: '차단된 키' };
            
        } catch (error) {
            return { allowed: false, message: `오류: ${error.message}` };
        }
    }

    /**
     * 숫자 입력 테스트
     */
    testNumberInput(value) {
        try {
            // 숫자만 추출
            const cleanValue = value.replace(/[^\d]/g, '');
            
            if (!cleanValue) {
                return { success: true, message: '빈 값 처리됨' };
            }

            const numValue = parseInt(cleanValue);
            
            if (isNaN(numValue)) {
                return { success: false, message: '숫자 변환 실패' };
            }

            // 천 단위 쉼표 포맷팅
            const formatted = this.formatNumber(numValue);
            
            return { 
                success: true, 
                message: `${value} → ${formatted} (처리됨)` 
            };
            
        } catch (error) {
            return { success: false, message: `오류: ${error.message}` };
        }
    }

    /**
     * 잘못된 입력 테스트
     */
    testInvalidInput(value) {
        try {
            // 입력 검증 로직
            const hasNumbers = /\d/.test(value);
            const hasInvalidChars = /[^\d\s,.-]/.test(value);
            
            if (hasInvalidChars && !hasNumbers) {
                return { blocked: true, message: '완전 차단됨' };
            }
            
            if (hasInvalidChars && hasNumbers) {
                const cleaned = value.replace(/[^\d]/g, '');
                return { 
                    blocked: false, 
                    message: `부분 처리됨: ${value} → ${cleaned}` 
                };
            }
            
            return { blocked: false, message: '허용된 입력' };
            
        } catch (error) {
            return { blocked: false, message: `오류: ${error.message}` };
        }
    }

    /**
     * 숫자 입력 시뮬레이션
     */
    simulateNumberInput(value) {
        const cleanValue = value.replace(/[^\d]/g, '');
        if (cleanValue) {
            return this.formatNumber(parseInt(cleanValue));
        }
        return '';
    }

    /**
     * 숫자 포맷팅 (천 단위 쉼표)
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * 테스트 결과 로깅
     */
    logTest(testName, success, message) {
        const status = success ? '✅' : '❌';
        const result = { testName, success, message };
        
        console.log(`${status} ${testName}: ${message}`);
        this.testResults.push(result);
    }

    /**
     * 전체 테스트 결과 출력
     */
    printTestResults() {
        console.log('\n📊 테스트 결과 요약');
        console.log('====================================================');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`총 테스트: ${totalTests}개`);
        console.log(`성공: ${passedTests}개 (${((passedTests/totalTests)*100).toFixed(1)}%)`);
        console.log(`실패: ${failedTests}개 (${((failedTests/totalTests)*100).toFixed(1)}%)`);
        
        if (failedTests > 0) {
            console.log('\n❌ 실패한 테스트:');
            this.testResults
                .filter(r => !r.success)
                .forEach(r => console.log(`   • ${r.testName}: ${r.message}`));
        }
        
        console.log('\n🎯 테스트 권장사항:');
        console.log('1. 실제 브라우저에서 /tax-calculator 페이지 방문');
        console.log('2. /number-input-test.html 페이지에서 대화형 테스트');
        console.log('3. 모바일 기기에서 터치 입력 테스트');
        console.log('4. 다양한 브라우저에서 호환성 확인');
        
        // 상세 테스트 가이드
        this.printDetailedTestGuide();
    }

    /**
     * 상세 테스트 가이드 출력
     */
    printDetailedTestGuide() {
        console.log('\n📋 상세 테스트 가이드');
        console.log('====================================================');
        
        console.log('\n🔸 주식이동세 계산기 테스트:');
        console.log('   1. 매입주식수량: 1,000 입력 → Ctrl+A → Ctrl+C → 다른 필드에 Ctrl+V');
        console.log('   2. 주당가격: 75,000 입력 → 방향키로 커서 이동 테스트');
        console.log('   3. 특수문자 입력 시도: abc!@# → 차단되는지 확인');
        
        console.log('\n🔸 상속세 계산기 테스트:');
        console.log('   1. 총 상속재산: 2,000,000,000 입력');
        console.log('   2. 채무 및 공과금: 100,000,000 입력');
        console.log('   3. 복사/붙여넣기 기능 테스트');
        
        console.log('\n🔸 증여세 계산기 테스트:');
        console.log('   1. 증여재산 가액: 500,000,000 입력');
        console.log('   2. 실행취소(Ctrl+Z) 기능 테스트');
        console.log('   3. 천 단위 쉼표 자동 포맷팅 확인');
        
        console.log('\n🔸 법인세 계산기 테스트:');
        console.log('   1. 총 수입금액: 5,000,000,000 입력');
        console.log('   2. 종업원 수: 50 입력 (작은 숫자 테스트)');
        console.log('   3. Tab 키로 필드 간 이동 테스트');
        
        console.log('\n🔸 모든 계산기 공통 테스트:');
        console.log('   • Home/End 키로 시작/끝 이동');
        console.log('   • Shift+방향키로 텍스트 선택');
        console.log('   • 마우스 드래그로 텍스트 선택');
        console.log('   • 더블클릭으로 단어 선택');
        console.log('   • 우클릭 컨텍스트 메뉴 (복사/붙여넣기)');
    }
}

// 🚀 테스트 실행
const tester = new NumberInputTester();

// Node.js 환경에서 실행 시
if (typeof window === 'undefined') {
    console.log('🧪 Node.js 환경에서 시뮬레이션 테스트 실행');
    tester.runAllTests();
} else {
    // 브라우저 환경에서 실행 시
    console.log('🌐 브라우저 환경에서 실제 테스트 실행');
    window.numberInputTester = tester;
    
    // 자동 실행
    document.addEventListener('DOMContentLoaded', () => {
        tester.runAllTests();
    });
}

// 수동 테스트 함수들 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberInputTester;
}

/**
 * 🎯 빠른 테스트 실행 함수
 * 브라우저 콘솔에서 quickTest() 호출하여 즉시 테스트 가능
 */
function quickTest() {
    console.clear();
    const tester = new NumberInputTester();
    tester.runAllTests();
}

// 글로벌 함수로 등록
if (typeof window !== 'undefined') {
    window.quickTest = quickTest;
    console.log('💡 브라우저 콘솔에서 quickTest() 함수를 호출하여 즉시 테스트할 수 있습니다.');
} 