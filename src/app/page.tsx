'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/design-system/Header'
import Sidebar from '@/components/design-system/Sidebar'
import Canvas from '@/components/design-system/Canvas'
import { CodeExporter } from '@/components/design-system/CodeExporter'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DesignSystemProvider } from '@/contexts/DesignSystemContext'

export default function Home() {
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [activeTab, setActiveTab] = useState<'design' | 'export'>('design')
  const [hasEnvironmentVars, setHasEnvironmentVars] = useState(true)

  // 환경 변수 확인
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey || 
        supabaseUrl === 'https://your-project.supabase.co' || 
        supabaseKey === 'your-anon-key') {
      setHasEnvironmentVars(false)
    }
  }, [])

  // 사이드바 너비 변경 시 CSS 변수 업데이트
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
  }, [sidebarWidth])

  // 환경 변수가 설정되지 않은 경우 경고 표시
  if (!hasEnvironmentVars) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">환경 설정이 필요합니다</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left mb-6">
            <p className="text-lg text-yellow-800 mb-4">
              <strong>문제:</strong> Supabase 데이터베이스 연결 정보가 설정되지 않았습니다.
            </p>
            <div className="space-y-2 text-sm text-yellow-700">
              <p>• 프로젝트 루트에 <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> 파일을 생성하세요</p>
              <p>• 다음 환경 변수를 설정하세요:</p>
              <div className="bg-yellow-100 p-3 rounded font-mono text-xs">
                NEXT_PUBLIC_SUPABASE_URL=your_supabase_url<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">
            환경 변수를 설정한 후 페이지를 새로고침하세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <DesignSystemProvider>
        <div className="min-h-screen bg-background text-foreground flex">
          {/* 사이드바 - 전체 높이로 고정 */}
          <div className="fixed left-0 top-0 h-screen z-40">
            <Sidebar 
              width={sidebarWidth} 
              onWidthChange={setSidebarWidth}
            />
          </div>
          
          {/* 메인 컨텐츠 영역 */}
          <div 
            className="flex-1 flex flex-col transition-all duration-200"
            style={{ marginLeft: `calc(var(--sidebar-width, ${sidebarWidth}px) + 4px)` }}
          >
            <Header activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-hidden">
              {activeTab === 'design' ? (
                <Canvas />
              ) : (
                <div className="h-full overflow-auto">
                  <div className="p-6">
                    <CodeExporter />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DesignSystemProvider>
    </ThemeProvider>
  )
}