'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function DebugSupabasePage() {
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [connectionTest, setConnectionTest] = useState<string>('Testing...')

  useEffect(() => {
    async function testConnection() {
      try {
        // 환경 변수 확인
        const envInfo = {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          isConfigured: isSupabaseConfigured(),
          windowDefined: typeof window !== 'undefined',
        }

        setDebugInfo(envInfo)

        // Supabase 연결 테스트
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setConnectionTest(`연결 오류: ${error.message}`)
        } else {
          setConnectionTest('연결 성공! Supabase가 정상 작동 중입니다.')
        }

        // 추가 테스트: 간단한 쿼리
        try {
          const { data: testData, error: testError } = await supabase
            .from('user_profiles')
            .select('id')
            .limit(1)

          console.log('DB 테스트 결과:', { testData, testError })
        } catch (dbError) {
          console.error('DB 테스트 오류:', dbError)
        }

      } catch (error) {
        console.error('연결 테스트 중 오류:', error)
        setConnectionTest(`테스트 오류: ${error}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Supabase 연결 디버깅</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">환경 변수 상태</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">연결 테스트 결과</h2>
          <p className={`p-4 rounded ${
            connectionTest.includes('성공') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connectionTest}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">브라우저 환경 변수</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> 
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ 미설정'}
              </span>
            </p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> 
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                  ? `✅ 설정됨 (${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length}자)`
                  : '❌ 미설정'
                }
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">해결 방법</h2>
          {!isSupabaseConfigured() ? (
            <div className="space-y-3">
              <p className="text-red-600 font-medium">⚠️ Supabase가 설정되지 않았습니다!</p>
              <div className="bg-yellow-50 p-4 rounded border">
                <h3 className="font-medium mb-2">Vercel 환경 변수 설정 필요:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Vercel 대시보드 → 프로젝트 설정 → Environment Variables</li>
                  <li>NEXT_PUBLIC_SUPABASE_URL 추가</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY 추가</li>
                  <li>재배포 대기</li>
                </ol>
              </div>
            </div>
          ) : (
            <p className="text-green-600 font-medium">✅ Supabase 설정이 완료되었습니다!</p>
          )}
        </div>
      </div>
    </div>
  )
}