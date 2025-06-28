const https = require('https');
const http = require('http');

console.log('🧪 근로소득세 계산기 오류 테스트 시작...\n');

// 배포된 사이트 테스트
function testDeployedSite() {
  return new Promise((resolve) => {
    console.log('📡 배포된 사이트 테스트: https://m-center-landingpage.vercel.app/tax-calculator');
    
    const req = https.get('https://m-center-landingpage.vercel.app/tax-calculator', (res) => {
      console.log(`✅ 응답 상태: ${res.statusCode}`);
      console.log(`✅ Content-Type: ${res.headers['content-type']}`);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        // HTML 내용에서 autoCalculatedValues 관련 오류 확인
        if (data.includes('autoCalculatedValues is not defined')) {
          console.log('❌ HTML에서 autoCalculatedValues 오류 발견!');
        } else {
          console.log('✅ HTML에서 autoCalculatedValues 오류 없음');
        }
        
        // React 컴포넌트가 정상적으로 포함되었는지 확인
        if (data.includes('근로소득세 계산기') || data.includes('tax-calculator')) {
          console.log('✅ 세금계산기 페이지 정상 로드');
        } else {
          console.log('❌ 세금계산기 페이지 내용 확인 불가');
        }
        
        // Next.js 앱이 정상 로드되었는지 확인
        if (data.includes('__NEXT_DATA__')) {
          console.log('✅ Next.js 애플리케이션 정상 로드');
        } else {
          console.log('❌ Next.js 애플리케이션 로드 문제');
        }
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ 배포 사이트 연결 오류: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ 요청 타임아웃');
      req.destroy();
      resolve();
    });
  });
}

// 로컬 서버 테스트
function testLocalSite() {
  return new Promise((resolve) => {
    console.log('\n📍 로컬 서버 테스트: http://localhost:3000/tax-calculator');
    
    const req = http.get('http://localhost:3000/tax-calculator', (res) => {
      console.log(`✅ 로컬 응답 상태: ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (data.includes('autoCalculatedValues is not defined')) {
          console.log('❌ 로컬에서 autoCalculatedValues 오류 발견!');
        } else {
          console.log('✅ 로컬에서 autoCalculatedValues 오류 없음');
        }
        
        if (data.includes('근로소득세 계산기')) {
          console.log('✅ 로컬 세금계산기 페이지 정상 로드');
        } else {
          console.log('❌ 로컬 세금계산기 페이지 내용 확인 불가');
        }
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ 로컬 서버 연결 오류: ${err.message}`);
      console.log('ℹ️  로컬 서버가 실행되지 않았을 수 있습니다.');
      resolve();
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ 로컬 요청 타임아웃');
      req.destroy();
      resolve();
    });
  });
}

// 빌드 상태 확인
function checkBuildStatus() {
  console.log('\n🔨 빌드 상태 확인...');
  
  const fs = require('fs');
  const path = require('path');
  
  // .next 폴더 확인
  const nextBuildPath = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextBuildPath)) {
    console.log('✅ .next 빌드 폴더 존재');
    
    // 빌드된 페이지 확인
    const buildManifestPath = path.join(nextBuildPath, 'build-manifest.json');
    if (fs.existsSync(buildManifestPath)) {
      console.log('✅ 빌드 매니페스트 파일 존재');
    } else {
      console.log('❌ 빌드 매니페스트 파일 없음');
    }
  } else {
    console.log('❌ .next 빌드 폴더 없음 - npm run build 필요');
  }
  
  // package.json 확인
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`✅ Next.js 버전: ${packageJson.dependencies?.next || '확인 불가'}`);
    console.log(`✅ React 버전: ${packageJson.dependencies?.react || '확인 불가'}`);
  }
}

// 모든 테스트 실행
async function runAllTests() {
  try {
    await testDeployedSite();
    await testLocalSite();
    checkBuildStatus();
    
    console.log('\n📊 테스트 요약:');
    console.log('='.repeat(50));
    console.log('1. 배포된 사이트 응답 확인');
    console.log('2. 로컬 서버 응답 확인 (실행 시)');
    console.log('3. 빌드 상태 확인');
    console.log('4. HTML 내용에서 오류 패턴 검색');
    
    console.log('\n🏁 테스트 완료! 위 결과를 확인하세요.');
    
  } catch (error) {
    console.log(`❌ 테스트 실행 중 오류: ${error.message}`);
  }
}

runAllTests(); 