'use client'

import { useState, useEffect } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { DesignSystemService } from '@/lib/designSystemService'
import Button from '@/components/ui/Button'
import RatingModal from './RatingModal'
import { Database } from '@/lib/database.types'

type DesignSystem = Database['public']['Tables']['design_systems']['Row']

interface BrowseDesignSystemsProps {
  isOpen: boolean
  onClose: () => void
}

const categories = [
  { value: '', label: '전체' },
  { value: 'corporate', label: '기업용' },
  { value: 'startup', label: '스타트업' },
  { value: 'ecommerce', label: '이커머스' },
  { value: 'blog', label: '블로그' },
  { value: 'portfolio', label: '포트폴리오' },
  { value: 'landing', label: '랜딩페이지' },
  { value: 'dashboard', label: '대시보드' },
  { value: 'mobile', label: '모바일' }
]

const sortOptions = [
  { value: 'updated_at', label: '최근 업데이트' },
  { value: 'created_at', label: '최근 생성' },
  { value: 'likes_count', label: '인기순' },
  { value: 'downloads_count', label: '다운로드순' }
]

export default function BrowseDesignSystems({ isOpen, onClose }: BrowseDesignSystemsProps) {
  const { setTheme } = useDesignSystem()
  const [systems, setSystems] = useState<DesignSystem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    tags: '',
    sortBy: 'updated_at' as 'created_at' | 'updated_at' | 'likes_count' | 'downloads_count'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; systemId: string | null; systemName: string }>({
    isOpen: false,
    systemId: null,
    systemName: ''
  })

  useEffect(() => {
    if (isOpen) {
      loadPublicSystems()
    }
  }, [isOpen, filters])

  const loadPublicSystems = async () => {
    try {
      setIsLoading(true)
      const tags = filters.tags ? filters.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined
      const systems = await DesignSystemService.getPublicDesignSystems(
        50, // limit
        0,  // offset
        filters.category || undefined,
        tags,
        filters.sortBy
      )
      setSystems(systems)
    } catch (error) {
      console.error('Failed to load public systems:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySystem = async (system: DesignSystem) => {
    try {
      await setTheme(system.theme_data as any, true)
      
      // Record download
      await DesignSystemService.recordDownload(system.id, 'theme_only')
      
      alert(`"${system.name}" 디자인 시스템이 적용되었습니다!`)
      onClose()
    } catch (error) {
      console.error('Failed to apply system:', error)
      alert('디자인 시스템 적용에 실패했습니다.')
    }
  }

  const handleDownload = async (system: DesignSystem) => {
    try {
      // Record download
      await DesignSystemService.recordDownload(system.id, 'full')
      
      // Create downloadable JSON
      const downloadData = {
        name: system.name,
        description: system.description,
        theme: system.theme_data,
        selectedComponents: system.selected_components,
        componentSettings: system.component_settings,
        tags: system.tags,
        category: system.category,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${system.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_design_system.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      // Update download count in UI
      setSystems(prev => prev.map(s => 
        s.id === system.id 
          ? { ...s, downloads_count: s.downloads_count + 1 }
          : s
      ))
    } catch (error) {
      console.error('Failed to download system:', error)
      alert('다운로드에 실패했습니다.')
    }
  }

  const toggleFavorite = async (systemId: string) => {
    try {
      await DesignSystemService.toggleFavorite(systemId)
      // In a real app, you'd refresh the systems or update the favorite status
      alert('즐겨찾기가 업데이트되었습니다.')
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      alert('즐겨찾기 업데이트에 실패했습니다.')
    }
  }

  const filteredSystems = systems.filter(system => {
    if (!searchTerm) return true
    return (
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">공개 디자인 시스템 탐색</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="태그 (쉼표로 구분)"
              value={filters.tags}
              onChange={(e) => setFilters(prev => ({ ...prev, tags: e.target.value }))}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">로딩 중...</p>
            </div>
          ) : filteredSystems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">조건에 맞는 디자인 시스템을 찾을 수 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSystems.map((system) => (
                <div key={system.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
                  <div className="mb-3">
                    <h3 className="font-medium text-lg">{system.name}</h3>
                    {system.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {system.description}
                      </p>
                    )}
                  </div>

                  {/* Theme Preview */}
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-muted-foreground">색상:</span>
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (system.theme_data as any)?.colors?.primary || '#000' }}
                        title="Primary"
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (system.theme_data as any)?.colors?.secondary || '#000' }}
                        title="Secondary"
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (system.theme_data as any)?.colors?.background || '#fff' }}
                        title="Background"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      폰트: {(system.theme_data as any)?.typography?.fontFamily || 'Unknown'}
                    </p>
                  </div>

                  {/* Tags */}
                  {system.tags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {system.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {system.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-xs rounded">
                            +{system.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center space-x-3">
                      <span>❤️ {system.likes_count}</span>
                      <span>⬇️ {system.downloads_count}</span>
                      {system.category && <span>📁 {system.category}</span>}
                    </div>
                    <span>{new Date(system.updated_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleApplySystem(system)}
                    >
                      적용하기
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownload(system)}
                    >
                      다운로드
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleFavorite(system.id)}
                      className="px-2"
                      title="즐겨찾기"
                    >
                      ⭐
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setRatingModal({ 
                        isOpen: true, 
                        systemId: system.id, 
                        systemName: system.name 
                      })}
                      className="px-2"
                      title="평가하기"
                    >
                      💬
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, systemId: null, systemName: '' })}
        designSystemId={ratingModal.systemId}
        designSystemName={ratingModal.systemName}
      />
    </div>
  )
}