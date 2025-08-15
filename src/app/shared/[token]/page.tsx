'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { DesignSystemService, DesignSystemWithDetails } from '@/lib/designSystemService'
import { DesignSystemTheme } from '@/contexts/DesignSystemContext'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function SharedDesignSystemPage() {
  const params = useParams()
  const token = params?.token as string
  const [system, setSystem] = useState<DesignSystemWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      loadSharedSystem()
    }
  }, [token])

  const loadSharedSystem = async () => {
    try {
      setIsLoading(true)
      const sharedSystem = await DesignSystemService.getSharedDesignSystem(token)
      setSystem(sharedSystem)
    } catch (error: any) {
      console.error('Failed to load shared system:', error)
      setError(error.message || '공유된 디자인 시스템을 찾을 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!system) return

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
        exportedAt: new Date().toISOString(),
        originalAuthor: system.user_id,
        sharedFrom: window.location.href
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
    } catch (error) {
      console.error('Failed to download system:', error)
      alert('다운로드에 실패했습니다.')
    }
  }

  const handleCopyTheme = async () => {
    if (!system) return

    try {
      const themeJson = JSON.stringify(system.theme_data, null, 2)
      await navigator.clipboard.writeText(themeJson)
      alert('테마 데이터가 클립보드에 복사되었습니다!')
    } catch (error) {
      console.error('Failed to copy theme:', error)
      alert('복사에 실패했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-4">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">접근할 수 없음</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!system) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">디자인 시스템을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const theme = system.theme_data as DesignSystemTheme

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{system.name}</h1>
              <p className="text-muted-foreground">공유된 디자인 시스템</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/">
                <Button variant="outline">홈으로</Button>
              </Link>
              <Button variant="outline" onClick={handleCopyTheme}>
                테마 복사
              </Button>
              <Button onClick={handleDownload}>
                다운로드
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Info */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">시스템 정보</h2>
                {system.description && (
                  <p className="text-muted-foreground mb-4">{system.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">버전:</span>
                    <span>{system.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">생성일:</span>
                    <span>{formatDate(system.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">업데이트:</span>
                    <span>{formatDate(system.updated_at)}</span>
                  </div>
                  {system.category && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">카테고리:</span>
                      <span>{system.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">다운로드:</span>
                    <span>{system.downloads_count}회</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">좋아요:</span>
                    <span>{system.likes_count}개</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {system.tags.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {system.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-sm rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Components */}
              <div>
                <h3 className="font-medium mb-3">포함된 컴포넌트</h3>
                <div className="space-y-1">
                  {system.selected_components.map((component) => (
                    <div key={component} className="text-sm text-muted-foreground">
                      • {component}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Preview */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-6">테마 미리보기</h2>
              
              {/* Color Palette */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">색상 팔레트</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(theme.colors).map(([name, color]) => (
                    <div key={name} className="text-center">
                      <div 
                        className="w-full h-20 rounded-lg border border-border mb-2"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-sm font-medium capitalize">{name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{color}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">타이포그래피</h3>
                <div 
                  className="space-y-3"
                  style={{ fontFamily: theme.typography.fontFamily }}
                >
                  <div>
                    <span className="text-xs text-muted-foreground mr-3">Font Family:</span>
                    <span className="font-medium">{theme.typography.fontFamily}</span>
                  </div>
                  
                  {Object.entries(theme.typography.fontSize).map(([size, value]) => (
                    <div key={size} className="flex items-center space-x-4">
                      <span className="text-xs text-muted-foreground w-12">{size}:</span>
                      <span style={{ fontSize: value }}>
                        The quick brown fox jumps over the lazy dog
                      </span>
                      <span className="text-xs text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div className="mb-8">
                <h3 className="font-medium mb-4">간격</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(theme.spacing).map(([name, value]) => (
                    <div key={name} className="text-center">
                      <div 
                        className="bg-primary mx-auto mb-2"
                        style={{ 
                          width: value,
                          height: value,
                          maxWidth: '100px',
                          maxHeight: '100px'
                        }}
                      />
                      <div className="text-sm font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h3 className="font-medium mb-4">모서리 둥글기</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {Object.entries(theme.borderRadius).map(([name, value]) => (
                    <div key={name} className="text-center">
                      <div 
                        className="w-16 h-16 bg-primary mx-auto mb-2"
                        style={{ borderRadius: value }}
                      />
                      <div className="text-sm font-medium">{name}</div>
                      <div className="text-xs text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}