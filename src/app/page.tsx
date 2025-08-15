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

  // 사이드바 너비 변경 시 CSS 변수 업데이트
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
  }, [sidebarWidth])

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