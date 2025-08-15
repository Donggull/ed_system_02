'use client'

import { useState, useEffect } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { DesignSystemService, SaveDesignSystemParams } from '@/lib/designSystemService'
import { getCurrentUser } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import ShareModal from './ShareModal'
import VersionHistory from './VersionHistory'
import { Database } from '@/lib/database.types'

type DesignSystem = Database['public']['Tables']['design_systems']['Row']

interface SaveLoadModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'save' | 'load'
}

export default function SaveLoadModal({ isOpen, onClose, mode }: SaveLoadModalProps) {
  const { theme, selectedComponents, componentSettings, setTheme, selectAll } = useDesignSystem()
  const [isLoading, setIsLoading] = useState(false)
  const [savedSystems, setSavedSystems] = useState<DesignSystem[]>([])
  const [user, setUser] = useState<any>(null)
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; systemId: string | null }>({
    isOpen: false,
    systemId: null
  })
  const [versionModal, setVersionModal] = useState<{ isOpen: boolean; systemId: string | null }>({
    isOpen: false,
    systemId: null
  })
  
  // Save form state
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    isPublic: false
  })

  useEffect(() => {
    if (isOpen) {
      loadUser()
      if (mode === 'load') {
        loadSavedSystems()
      }
    }
  }, [isOpen, mode])

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Failed to load user:', error)
    }
  }

  const loadSavedSystems = async () => {
    try {
      setIsLoading(true)
      const systems = await DesignSystemService.getUserDesignSystems()
      setSavedSystems(systems)
    } catch (error) {
      console.error('Failed to load saved systems:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!saveForm.name.trim()) {
      alert('디자인 시스템 이름을 입력해주세요.')
      return
    }

    try {
      setIsLoading(true)
      
      const saveParams: SaveDesignSystemParams = {
        name: saveForm.name,
        description: saveForm.description || undefined,
        theme,
        selectedComponents,
        componentSettings,
        category: saveForm.category || undefined,
        tags: saveForm.tags ? saveForm.tags.split(',').map(tag => tag.trim()) : undefined,
        isPublic: saveForm.isPublic
      }

      await DesignSystemService.saveDesignSystem(saveParams)
      
      alert('디자인 시스템이 저장되었습니다!')
      setSaveForm({
        name: '',
        description: '',
        category: '',
        tags: '',
        isPublic: false
      })
      onClose()
    } catch (error) {
      console.error('Failed to save design system:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async (systemId: string) => {
    try {
      setIsLoading(true)
      const system = await DesignSystemService.getDesignSystemWithDetails(systemId)
      
      if (system) {
        // Apply the loaded theme and settings
        await setTheme(system.theme_data as any, true)
        
        // Load selected components
        // Note: We'll need to update the context to handle loading selected components
        // For now, we'll just set the theme
        
        alert('디자인 시스템이 로드되었습니다!')
        onClose()
      }
    } catch (error) {
      console.error('Failed to load design system:', error)
      alert('로드에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (systemId: string) => {
    if (!confirm('정말로 이 디자인 시스템을 삭제하시겠습니까?')) {
      return
    }

    try {
      setIsLoading(true)
      await DesignSystemService.deleteDesignSystem(systemId)
      await loadSavedSystems()
      alert('삭제되었습니다.')
    } catch (error) {
      console.error('Failed to delete design system:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">
            {mode === 'save' ? '디자인 시스템 저장' : '저장된 디자인 시스템'}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">로그인이 필요한 기능입니다.</p>
              <Button onClick={() => window.location.href = '/auth'}>
                로그인하기
              </Button>
            </div>
          ) : mode === 'save' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">이름 *</label>
                <input
                  type="text"
                  value={saveForm.name}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="내 디자인 시스템"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="디자인 시스템에 대한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <select
                  value={saveForm.category}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">카테고리 선택</option>
                  <option value="corporate">기업용</option>
                  <option value="startup">스타트업</option>
                  <option value="ecommerce">이커머스</option>
                  <option value="blog">블로그</option>
                  <option value="portfolio">포트폴리오</option>
                  <option value="landing">랜딩페이지</option>
                  <option value="dashboard">대시보드</option>
                  <option value="mobile">모바일</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">태그</label>
                <input
                  type="text"
                  value={saveForm.tags}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="태그1, 태그2, 태그3"
                />
                <p className="text-xs text-muted-foreground mt-1">쉼표로 구분하여 입력하세요</p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={saveForm.isPublic}
                  onChange={(e) => setSaveForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm font-medium">
                  공개 디자인 시스템으로 저장
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? '저장 중...' : '저장하기'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-muted-foreground mt-2">로딩 중...</p>
                </div>
              ) : savedSystems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">저장된 디자인 시스템이 없습니다.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {savedSystems.map((system) => (
                    <div key={system.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{system.name}</h3>
                          {system.description && (
                            <p className="text-sm text-muted-foreground mt-1">{system.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>버전 {system.version}</span>
                            <span>생성일: {new Date(system.created_at).toLocaleDateString()}</span>
                            {system.category && <span>카테고리: {system.category}</span>}
                            {system.is_public && <span className="text-primary">공개</span>}
                          </div>
                          {system.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {system.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleLoad(system.id)}>
                            로드
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShareModal({ isOpen: true, systemId: system.id })}
                          >
                            공유
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setVersionModal({ isOpen: true, systemId: system.id })}
                          >
                            이력
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(system.id)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={() => setShareModal({ isOpen: false, systemId: null })}
        designSystemId={shareModal.systemId}
      />

      {/* Version History Modal */}
      <VersionHistory
        isOpen={versionModal.isOpen}
        onClose={() => setVersionModal({ isOpen: false, systemId: null })}
        designSystemId={versionModal.systemId}
      />
    </div>
  )
}