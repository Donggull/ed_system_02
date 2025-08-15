'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/design-system/Header'
import Sidebar from '@/components/design-system/Sidebar'
import Canvas from '@/components/design-system/Canvas'
import { CodeExporter } from '@/components/design-system/CodeExporter'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { DesignSystemProvider, useDesignSystem } from '@/contexts/DesignSystemContext'
import SaveModal from '@/components/design-system/SaveModal'
import ShareModal from '@/components/design-system/ShareModal'
import { designSystemService, type DesignSystemData, type DesignSystemWithDetails } from '@/lib/designSystemService'

function HomeContent() {
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [activeTab, setActiveTab] = useState<'design' | 'export'>('design')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [savedDesignSystem, setSavedDesignSystem] = useState<DesignSystemWithDetails | null>(null)
  
  const { selectedComponents, theme } = useDesignSystem()

  // 사이드바 너비 변경 시 CSS 변수 업데이트
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`)
  }, [sidebarWidth])

  const handleSave = () => {
    setShowSaveModal(true)
  }

  const handleShare = () => {
    if (savedDesignSystem) {
      setShowShareModal(true)
    } else {
      alert('먼저 디자인 시스템을 저장해주세요.')
    }
  }

  const handleSaveSubmit = async (saveData: {
    name: string
    description: string
    tags: string[]
    category: string
  }) => {
    try {
      console.log('🚀 저장 프로세스 시작:', saveData);
      
      // 임시 사용자 ID - Supabase auth 미구현으로 인해 null로 설정
      const userId = null
      
      const designSystemData: DesignSystemData = {
        name: saveData.name,
        description: saveData.description,
        tags: saveData.tags,
        category: saveData.category,
        components: (selectedComponents || []).map((compType, index) => ({
          name: compType.charAt(0).toUpperCase() + compType.slice(1),
          type: compType,
          props: {},
          styles: {},
          code: null,
          preview_url: null,
          order_index: index
        })),
        themes: [{
          name: 'Default Theme',
          colors: theme?.colors || {},
          typography: theme?.typography || {},
          spacing: theme?.spacing || {},
          is_default: true
        }]
      }

      console.log('📊 저장할 데이터:', {
        name: designSystemData.name,
        componentsCount: designSystemData.components.length,
        themesCount: designSystemData.themes.length
      });

      const designSystemId = await designSystemService.saveDesignSystem(designSystemData, userId)
      console.log('✅ 디자인 시스템 저장 완료, ID:', designSystemId);
      
      // 저장된 디자인 시스템 정보 가져오기
      const savedSystem = await designSystemService.getDesignSystem(designSystemId, userId)
      setSavedDesignSystem(savedSystem)
      
      console.log('🎉 전체 저장 프로세스 완료');
      alert('디자인 시스템이 성공적으로 저장되었습니다!')
    } catch (error) {
      console.error('❌ 저장 실패:', error)
      alert(`저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      throw error
    }
  }

  const handleTogglePublic = async (isPublic: boolean) => {
    if (!savedDesignSystem) return
    
    try {
      const userId = null
      await designSystemService.togglePublic(savedDesignSystem.id, userId, isPublic)
      
      // 업데이트된 정보 가져오기
      const updatedSystem = await designSystemService.getDesignSystem(savedDesignSystem.id, userId)
      setSavedDesignSystem(updatedSystem)
    } catch (error) {
      console.error('공개 설정 변경 실패:', error)
      throw error
    }
  }

  return (
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
        <Header 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSave={handleSave}
          onShare={handleShare}
        />
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

      {/* 모달들 */}
      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveSubmit}
      />

      {savedDesignSystem && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          designSystem={savedDesignSystem}
          onTogglePublic={handleTogglePublic}
        />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <DesignSystemProvider>
        <HomeContent />
      </DesignSystemProvider>
    </ThemeProvider>
  )
}