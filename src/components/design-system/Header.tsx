'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { generateComponentCSS } from '@/lib/themeGenerator'
import Button from '@/components/ui/Button'
import SaveLoadModal from './SaveLoadModal'
import BrowseDesignSystems from './BrowseDesignSystems'

import { useState } from 'react'

interface HeaderProps {
  activeTab?: 'design' | 'export'
  onTabChange?: (tab: 'design' | 'export') => void
}

export default function Header({ activeTab = 'design', onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const { theme: designTheme } = useDesignSystem()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [saveLoadModal, setSaveLoadModal] = useState<{ isOpen: boolean; mode: 'save' | 'load' }>({
    isOpen: false,
    mode: 'save'
  })
  const [isBrowseOpen, setIsBrowseOpen] = useState(false)

  const handleExport = () => {
    const css = generateComponentCSS(designTheme)
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-system.css'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <header className="glass-nav border-0 sticky top-0 z-50">
      {/* 상단 헤더 */}
      <div className="h-16 container mx-auto flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-gradient">
                디자인 시스템 생성기
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block font-medium">
                Modern Design System Builder
              </p>
            </div>
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
            >
              디자인 시스템
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary rounded-full transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <button 
              onClick={() => setIsBrowseOpen(true)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
            >
              디자인 시스템 탐색
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary rounded-full transition-all duration-200 group-hover:w-full"></span>
            </button>
            <Link 
              href="/test-settings" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 relative group"
            >
              테스트 설정
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary rounded-full transition-all duration-200 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* 모바일 메뉴 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-9 h-9 p-0 md:hidden"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-10 h-10 p-0 hover:bg-muted/50 rounded-xl transition-all duration-200 hover-lift"
          >
            {theme === 'light' ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
          </Button>

          <Button variant="outline" size="sm" className="hidden sm:inline-flex hover-lift" onClick={handleExport}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSS 내보내기
          </Button>

          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="hover-lift"
              onClick={() => setSaveLoadModal({ isOpen: true, mode: 'load' })}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5m-5 4h.01M9 7h.01M13 7h.01M17 7h.01" />
              </svg>
              <span className="hidden sm:inline">불러오기</span>
            </Button>
            
            <Button 
              size="sm" 
              className="btn-primary hover-lift"
              onClick={() => setSaveLoadModal({ isOpen: true, mode: 'save' })}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">저장하기</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      {onTabChange && (
        <div className="border-t border-border/50">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex space-x-1">
              <button
                onClick={() => onTabChange('design')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 relative group ${
                  activeTab === 'design'
                    ? 'border-primary text-primary bg-gradient-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
                  </svg>
                  <span>디자인</span>
                </div>
              </button>
              
              <button
                onClick={() => onTabChange('export')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 relative group ${
                  activeTab === 'export'
                    ? 'border-primary text-primary bg-gradient-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>코드 내보내기</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 glass-card animate-slide-in">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-3 py-2 rounded-lg hover:bg-muted/50"
              >
                🎨 디자인 시스템
              </Link>
              <Link 
                href="/components" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-3 py-2 rounded-lg hover:bg-muted/50"
              >
                🧩 컴포넌트 갤러리
              </Link>
              <Link 
                href="/test-settings" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-3 py-2 rounded-lg hover:bg-muted/50"
              >
                ⚙️ 테스트 설정
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Save/Load Modal */}
      <SaveLoadModal
        isOpen={saveLoadModal.isOpen}
        onClose={() => setSaveLoadModal({ isOpen: false, mode: 'save' })}
        mode={saveLoadModal.mode}
      />

      {/* Browse Design Systems Modal */}
      <BrowseDesignSystems
        isOpen={isBrowseOpen}
        onClose={() => setIsBrowseOpen(false)}
      />
    </header>
  )
}
