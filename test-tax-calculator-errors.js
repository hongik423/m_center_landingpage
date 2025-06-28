const puppeteer = require('puppeteer');

async function testTaxCalculatorErrors() {
  console.log('🧪 근로소득세 계산기 오류 테스트 시작...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Console 로그와 오류를 캡처
  const logs = [];
  const errors = [];
  
  page.on('console', msg => {
    logs.push(`Console ${msg.type()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });
  
  try {
    console.log('📡 배포된 사이트 테스트...');
    
    // 배포된 사이트 접속
    await page.goto('https://m-center-landingpage.vercel.app/tax-calculator', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ 페이지 로드 완료');
    
    // 페이지 제목 확인
    const title = await page.title();
    console.log(`📄 페이지 제목: ${title}`);
    
    // 잠시 대기 (React 컴포넌트 초기화)
    await page.waitForTimeout(3000);
    
    // autoCalculatedValues 오류 확인
    const hasAutoCalculatedValuesError = errors.some(error => 
      error.includes('autoCalculatedValues is not defined')
    );
    
    if (hasAutoCalculatedValuesError) {
      console.log('❌ autoCalculatedValues 오류 발견!');
    } else {
      console.log('✅ autoCalculatedValues 오류 없음');
    }
    
    // 연봉 입력 필드 찾기
    const salaryInput = await page.$('input[placeholder*="50,000,000"]');
    if (salaryInput) {
      console.log('✅ 연봉 입력 필드 발견');
      
      // 연봉 입력 테스트
      await salaryInput.click();
      await salaryInput.type('50000000');
      console.log('💰 연봉 입력: 50,000,000원');
      
      // 잠시 대기 (자동 계산 실행)
      await page.waitForTimeout(2000);
      
      // 계산 결과 확인
      const dashboardExists = await page.$('[class*="border-blue-200 bg-blue-50"]');
      if (dashboardExists) {
        console.log('✅ 자동 계산 대시보드 렌더링 성공');
      } else {
        console.log('❌ 자동 계산 대시보드 렌더링 실패');
      }
      
    } else {
      console.log('❌ 연봉 입력 필드를 찾을 수 없음');
    }
    
    // 로컬 환경 테스트
    console.log('\n📍 로컬 환경 테스트...');
    await page.goto('http://localhost:3000/tax-calculator', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('✅ 로컬 페이지 로드 완료');
    
    // 잠시 대기
    await page.waitForTimeout(3000);
    
    // 로컬에서 연봉 입력 테스트
    const localSalaryInput = await page.$('input[placeholder*="50,000,000"]');
    if (localSalaryInput) {
      await localSalaryInput.click();
      await localSalaryInput.clear();
      await localSalaryInput.type('75000000');
      console.log('💰 로컬 연봉 입력: 75,000,000원');
      
      await page.waitForTimeout(2000);
      
      const localDashboardExists = await page.$('[class*="border-blue-200 bg-blue-50"]');
      if (localDashboardExists) {
        console.log('✅ 로컬 자동 계산 대시보드 렌더링 성공');
      } else {
        console.log('❌ 로컬 자동 계산 대시보드 렌더링 실패');
      }
    }
    
  } catch (error) {
    console.log(`❌ 테스트 중 오류 발생: ${error.message}`);
  }
  
  // 결과 리포트
  console.log('\n📊 테스트 결과 리포트:');
  console.log('='.repeat(50));
  
  if (errors.length > 0) {
    console.log('🚨 발견된 오류들:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  } else {
    console.log('✅ JavaScript 오류 없음');
  }
  
  if (logs.length > 0) {
    console.log('\n📝 Console 로그:');
    logs.slice(-10).forEach(log => {
      if (!log.includes('Download the React DevTools')) {
        console.log(log);
      }
    });
  }
  
  await browser.close();
  console.log('\n🏁 테스트 완료!');
}

// Puppeteer 없이도 실행 가능한 간단 테스트
async function simpleTaxCalculatorTest() {
  console.log('🧪 간단 세금계산기 테스트 실행...\n');
  
  try {
    // 배포된 사이트 응답 확인
    const https = require('https');
    const testUrl = 'https://m-center-landingpage.vercel.app/tax-calculator';
    
    console.log(`📡 ${testUrl} 접속 테스트...`);
    
    https.get(testUrl, (res) => {
      console.log(`✅ 응답 상태: ${res.statusCode}`);
      console.log(`✅ Content-Type: ${res.headers['content-type']}`);
      
      if (res.statusCode === 200) {
        console.log('✅ 세금계산기 페이지 정상 응답');
      } else {
        console.log('❌ 세금계산기 페이지 응답 오류');
      }
    }).on('error', (err) => {
      console.log(`❌ 연결 오류: ${err.message}`);
    });
    
    // 로컬 서버 응답 확인
    setTimeout(() => {
      const http = require('http');
      const localUrl = 'http://localhost:3000/tax-calculator';
      
      console.log(`\n📍 ${localUrl} 접속 테스트...`);
      
      http.get(localUrl, (res) => {
        console.log(`✅ 로컬 응답 상태: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ 로컬 세금계산기 페이지 정상 응답');
        } else {
          console.log('❌ 로컬 세금계산기 페이지 응답 오류');
        }
      }).on('error', (err) => {
        console.log(`❌ 로컬 연결 오류: ${err.message}`);
      });
    }, 2000);
    
  } catch (error) {
    console.log(`❌ 테스트 중 오류: ${error.message}`);
  }
}

// Puppeteer가 설치되어 있는지 확인
try {
  require('puppeteer');
  testTaxCalculatorErrors();
} catch (error) {
  console.log('ℹ️  Puppeteer가 설치되지 않음. 간단 테스트 실행...\n');
  simpleTaxCalculatorTest();
} 