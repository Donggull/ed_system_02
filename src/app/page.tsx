'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Fallback components for when main components are not available
function FallbackSidebar({ width, onWidthChange }: { width: number, onWidthChange: (width: number) => void }) {
  return (
    <div 
      className="bg-card border-r border-border h-full flex flex-col"
      style={{ width: `${width}px` }}
    >
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Design System</h2>
        <p className="text-sm text-muted-foreground">컴포넌트를 선택하여 시작하세요</p>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">컴포넌트</h3>
            <div className="space-y-2">
              <div className="p-2 bg-background rounded border text-sm">Button</div>
              <div className="p-2 bg-background rounded border text-sm">Card</div>
              <div className="p-2 bg-background rounded border text-sm">Input</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FallbackHeader({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: 'design' | 'export') => void }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">Design System Generator</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => onTabChange('design')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => onTabChange('export')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'export' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Export
          </button>
        </div>
      </div>
    </header>
  )
}

function FallbackCanvas() {
  return (
    <div className="h-full flex items-center justify-center bg-muted/30">
      <div className="text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="text-2xl font-bold mb-2">디자인 시스템 생성기</h2>
        <p className="text-muted-foreground mb-6">
          왼쪽 사이드바에서 컴포넌트를 선택하여 디자인을 시작하세요
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-medium mb-2">컴포넌트 선택</h3>
            <p className="text-sm text-muted-foreground">원하는 UI 컴포넌트를 선택하세요</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-medium mb-2">테마 커스터마이징</h3>
            <p className="text-sm text-muted-foreground">색상과 스타일을 조정하세요</p>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <h3 className="font-medium mb-2">코드 내보내기</h3>
            <p className="text-sm text-muted-foreground">완성된 코드를 다운로드하세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FallbackExporter() {
  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">코드 내보내기</h2>
        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">지원하는 형식</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">React + TypeScript</h4>
                <p className="text-sm text-muted-foreground">완전한 React 컴포넌트와 타입 정의</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Vue.js</h4>
                <p className="text-sm text-muted-foreground">Vue 3 Composition API 컴포넌트</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">HTML + CSS</h4>
                <p className="text-sm text-muted-foreground">순수 HTML과 CSS 파일</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Storybook</h4>
                <p className="text-sm text-muted-foreground">스토리북 스토리 파일</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">미리보기</h3>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <div className="text-muted-foreground">// 예시 버튼 컴포넌트</div>
              <div className="mt-2">
                <span className="text-blue-600">export</span>{' '}
                <span className="text-blue-600">function</span>{' '}
                <span className="text-green-600">Button</span>() {'{'}
              </div>
              <div className="ml-4 mt-1">
                <span className="text-blue-600">return</span>{' '}
                <span className="text-orange-600">&lt;button&gt;</span>
                <span className="text-gray-800">Click me</span>
                <span className="text-orange-600">&lt;/button&gt;</span>
              </div>
              <div className="mt-1">{'}'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
      <div className="min-h-screen bg-background text-foreground flex">
        {/* 사이드바 - 전체 높이로 고정 */}
        <div className="fixed left-0 top-0 h-screen z-40">
          <FallbackSidebar 
            width={sidebarWidth} 
            onWidthChange={setSidebarWidth}
          />
        </div>
        
        {/* 메인 컨텐츠 영역 */}
        <div 
          className="flex-1 flex flex-col transition-all duration-200"
          style={{ marginLeft: `calc(var(--sidebar-width, ${sidebarWidth}px) + 4px)` }}
        >
          <FallbackHeader activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1 overflow-hidden">
            {activeTab === 'design' ? (
              <FallbackCanvas />
            ) : (
              <FallbackExporter />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}