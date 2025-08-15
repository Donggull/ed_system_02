# Vercel 환경 변수 설정 가이드

## 🚨 **중요: Vercel 배포 시 필수 환경 변수 설정**

Vercel에서 Supabase 인증이 작동하려면 다음 환경 변수를 반드시 설정해야 합니다.

## 📝 **설정 방법**

### 1. Vercel 대시보드 접속
- https://vercel.com/dashboard 접속
- `ed-system-02` 프로젝트 선택

### 2. 환경 변수 추가
- `Settings` → `Environment Variables` 메뉴
- 다음 2개 변수를 추가:

```bash
# Variable 1
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://nktjoldoylvwtkzboyaf.supabase.co
Environments: Production, Preview, Development (모두 선택)

# Variable 2  
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdGpvbGRveWx2d3RremJveWFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDcyMzgsImV4cCI6MjA1MDE4MzIzOH0.vnG_0qGVYl2cdfCg2YbH4QKX6CGXqJz__8QAb6VVYjM
Environments: Production, Preview, Development (모두 선택)
```

### 3. 재배포 트리거
환경 변수 설정 후 자동으로 재배포가 시작됩니다.

## ✅ **확인 방법**
- 배포 완료 후 https://ed-system-02.vercel.app 접속
- 우상단 "회원가입" 버튼 클릭하여 정상 작동 확인
- 브라우저 콘솔에서 "Supabase not configured" 메시지가 사라졌는지 확인

## 🔍 **트러블슈팅**
만약 여전히 "Supabase not configured" 메시지가 보인다면:
1. Vercel 환경 변수가 올바르게 설정되었는지 확인
2. 모든 환경(Production, Preview, Development)에 설정되었는지 확인  
3. 최신 배포가 완료되었는지 확인
4. 브라우저 캐시 삭제 후 재시도