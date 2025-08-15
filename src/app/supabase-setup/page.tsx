'use client'

import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function SupabaseSetupPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">🔧 Supabase 설정 가이드</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-600">
            ⚠️ Supabase API 키 설정이 필요합니다
          </h2>
          <p className="mb-4 text-gray-700">
            현재 "Invalid API key" 오류가 발생하고 있습니다. 
            Vercel 환경 변수에 올바른 Supabase API 키를 설정해야 합니다.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">📋 해결 단계</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">1단계: Supabase 대시보드에서 API 키 확인</h4>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li><a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" 
                    className="text-blue-600 underline">Supabase 대시보드</a> 접속</li>
                <li>프로젝트 선택 (nktjoldoylvwtkzboyaf)</li>
                <li>왼쪽 메뉴: Settings → API</li>
                <li>"Project API keys" 섹션에서 <code>anon</code> <code>public</code> 키 복사</li>
              </ol>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">2단계: Vercel 환경 변수 설정</h4>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li><a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 underline">Vercel 대시보드</a> 접속</li>
                <li>ed-system-02 프로젝트 선택</li>
                <li>Settings → Environment Variables</li>
                <li>다음 변수들 추가:</li>
              </ol>
              <div className="mt-3 bg-gray-100 p-3 rounded font-mono text-sm">
                <div className="mb-2">
                  <strong>Name:</strong> NEXT_PUBLIC_SUPABASE_URL<br/>
                  <strong>Value:</strong> https://nktjoldoylvwtkzboyaf.supabase.co
                </div>
                <div>
                  <strong>Name:</strong> NEXT_PUBLIC_SUPABASE_ANON_KEY<br/>
                  <strong>Value:</strong> [Supabase에서 복사한 anon public 키]
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium">3단계: 재배포 대기</h4>
              <p className="text-sm mt-2">
                환경 변수 저장 후 Vercel에서 자동으로 재배포됩니다. (약 2-3분 소요)
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50">
          <h3 className="text-lg font-semibold mb-4">🚀 빠른 테스트</h3>
          <p className="mb-4">설정 완료 후 다음으로 이동하여 연결 상태를 확인하세요:</p>
          <div className="space-x-4">
            <Button onClick={() => window.location.href = '/debug-supabase'}>
              연결 상태 확인
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              메인으로 돌아가기
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50">
          <h3 className="text-lg font-semibold mb-4">💡 도움이 필요하신가요?</h3>
          <p className="text-sm">
            설정에 어려움이 있으시면 GitHub Issues에 문의하시거나, 
            Supabase 공식 문서를 참고해주세요.
          </p>
        </Card>
      </div>
    </div>
  )
}