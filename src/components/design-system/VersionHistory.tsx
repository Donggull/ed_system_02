'use client'

import { useState, useEffect } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { DesignSystemService } from '@/lib/designSystemService'
import Button from '@/components/ui/Button'
import { Database } from '@/lib/database.types'

type Theme = Database['public']['Tables']['themes']['Row']

interface VersionHistoryProps {
  designSystemId: string | null
  isOpen: boolean
  onClose: () => void
}

export default function VersionHistory({ designSystemId, isOpen, onClose }: VersionHistoryProps) {
  const { setTheme } = useDesignSystem()
  const [versions, setVersions] = useState<Theme[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen && designSystemId) {
      loadVersionHistory()
    }
  }, [isOpen, designSystemId])

  const loadVersionHistory = async () => {
    if (!designSystemId) return

    try {
      setIsLoading(true)
      const system = await DesignSystemService.getDesignSystemWithDetails(designSystemId)
      if (system?.themes) {
        setVersions(system.themes.sort((a, b) => b.version - a.version))
      }
    } catch (error) {
      console.error('Failed to load version history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVersionSelect = async (version: Theme) => {
    try {
      setSelectedVersion(version.version)
      await setTheme(version.theme_data as any, true)
      alert(`버전 ${version.version}이 적용되었습니다.`)
    } catch (error) {
      console.error('Failed to apply version:', error)
      alert('버전 적용에 실패했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">버전 히스토리</h2>
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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-muted-foreground mt-2">로딩 중...</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">버전 히스토리가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div 
                  key={version.id} 
                  className={`border border-border rounded-lg p-4 transition-all duration-200 ${
                    selectedVersion === version.version ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">버전 {version.version}</h3>
                        {selectedVersion === version.version && (
                          <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                            현재 적용됨
                          </span>
                        )}
                      </div>
                      
                      {version.change_description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {version.change_description}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground">
                        생성일: {formatDate(version.created_at)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVersionSelect(version)}
                        disabled={selectedVersion === version.version}
                      >
                        {selectedVersion === version.version ? '적용됨' : '적용하기'}
                      </Button>
                    </div>
                  </div>

                  {/* Theme preview */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>미리보기:</span>
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (version.theme_data as any)?.colors?.primary || '#000' }}
                        title="Primary Color"
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (version.theme_data as any)?.colors?.secondary || '#000' }}
                        title="Secondary Color"
                      />
                      <div 
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: (version.theme_data as any)?.colors?.background || '#fff' }}
                        title="Background Color"
                      />
                      <span>
                        {(version.theme_data as any)?.typography?.fontFamily || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}