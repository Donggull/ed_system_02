'use client'

import { useState, useRef, useEffect } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import Button from '@/components/ui/Button'
import JsonEditor from './JsonEditor'
import ComponentSelector from './ComponentSelector'

interface SidebarProps {
  width: number
  onWidthChange: (width: number) => void
}

export default function Sidebar({ width, onWidthChange }: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const { applyTheme, jsonValid } = useDesignSystem()

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      // 최소/최대 너비 제한 (픽셀 단위)
      const minWidth = 320
      const maxWidth = 600
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX))
      
      onWidthChange(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, onWidthChange])

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className="glass-card border-r border-border/50 flex flex-col h-screen overflow-hidden relative"
        style={{ 
          width: `${width}px`, 
          minWidth: `${width}px`,
          maxWidth: `${width}px`
        }}
      >
        {/* 배경 패턴 */}
        <div className="absolute inset-0 dot-pattern pointer-events-none opacity-20"></div>
        
        {/* 사이드바 내용 - 전체 높이 사용 */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar relative z-10 h-full">
          {/* JSON 테마 입력 섹션 */}
          <div className="animate-fade-in">
            <div className="glass-card p-4 rounded-xl border border-border/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
                  <h2 className="text-lg font-bold text-gradient">
                    JSON 테마
                  </h2>
                </div>
                <div className={`text-xs font-medium px-3 py-1 rounded-full border transition-all duration-200 ${
                  jsonValid 
                    ? 'bg-success/10 text-success border-success/30 shadow-sm'
                    : 'bg-destructive/10 text-destructive border-destructive/30 shadow-sm'
                }`}>
                  {jsonValid ? '✓ 유효' : '✗ 오류'}
                </div>
              </div>
              
              <JsonEditor />
              
              <Button
                onClick={applyTheme}
                disabled={!jsonValid}
                className="w-full mt-4 btn-primary hover-lift"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                테마 적용하기
              </Button>
            </div>
          </div>

          {/* 컴포넌트 선택 섹션 */}
          <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
            <ComponentSelector />
          </div>
        </div>
      </div>

      {/* 리사이즈 핸들 */}
      <div
        className="w-1 h-screen bg-gradient-to-b from-border/30 via-primary/20 to-border/30 hover:from-primary/40 hover:via-primary/60 hover:to-primary/40 cursor-col-resize transition-all duration-300 relative group"
        onMouseDown={handleMouseDown}
      >
        {/* 리사이즈 핸들 시각적 표시 */}
        <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-center items-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-0.5 h-1 bg-primary/60 rounded-full"></div>
          <div className="w-0.5 h-1 bg-primary/60 rounded-full"></div>
          <div className="w-0.5 h-1 bg-primary/60 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
