'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDesignSystem, ComponentType } from '@/contexts/DesignSystemContext'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import ProfileCard from '@/components/examples/ProfileCard'
import ProductCard from '@/components/examples/ProductCard'
import BlogCard from '@/components/examples/BlogCard'
import { SAMPLE_IMAGES } from '@/lib/imageUtils'
import { CodeExporter } from './CodeExporter'
import ComponentSettings from './ComponentSettings'

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'wide'
type ComponentScale = 0.5 | 0.75 | 1 | 1.25 | 1.5

interface ViewportConfig {
  width: number
  height: number
  label: string
  icon: string
}

const VIEWPORT_CONFIGS: Record<ViewportSize, ViewportConfig> = {
  mobile: { width: 375, height: 667, label: '모바일', icon: '📱' },
  tablet: { width: 768, height: 1024, label: '태블릿', icon: '📱' },
  desktop: { width: 1440, height: 900, label: '데스크톱', icon: '💻' },
  wide: { width: 1920, height: 1080, label: '와이드', icon: '🖥️' }
}

const SCALE_OPTIONS: ComponentScale[] = [0.5, 0.75, 1, 1.25, 1.5]

interface ComponentPreviewEnhancedProps {
  className?: string
}

export default function ComponentPreviewEnhanced({ className }: ComponentPreviewEnhancedProps) {
  const { theme } = useDesignSystem()
  const { getComponentSettings } = useDesignSystem()
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [scale, setScale] = useState<ComponentScale>(1)
  const [selectedComponent, setSelectedComponent] = useState<'profile' | 'product' | 'blog'>('profile')
  const [showGrid, setShowGrid] = useState(false)
  const [showRuler, setShowRuler] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'settings'>('preview')
  const [showComponentSettings, setShowComponentSettings] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  
  const currentViewport = VIEWPORT_CONFIGS[viewport]
  
  // 풀스크린 토글
  const toggleFullscreen = () => {
    if (!isFullscreen && previewRef.current) {
      previewRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else if (isFullscreen) {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }
  
  // 풀스크린 상태 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])
  
  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            setSelectedComponent('profile')
            break
          case '2':
            e.preventDefault()
            setSelectedComponent('product')
            break
          case '3':
            e.preventDefault()
            setSelectedComponent('blog')
            break
          case 'g':
            e.preventDefault()
            setShowGrid(!showGrid)
            break
          case 'r':
            e.preventDefault()
            setShowRuler(!showRuler)
            break
          case 'Enter':
            e.preventDefault()
            toggleFullscreen()
            break
        }
      }
      
      // 스케일 조정
      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        const currentIndex = SCALE_OPTIONS.indexOf(scale)
        if (currentIndex < SCALE_OPTIONS.length - 1) {
          setScale(SCALE_OPTIONS[currentIndex + 1])
        }
      } else if (e.key === '-') {
        e.preventDefault()
        const currentIndex = SCALE_OPTIONS.indexOf(scale)
        if (currentIndex > 0) {
          setScale(SCALE_OPTIONS[currentIndex - 1])
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [scale, showGrid, showRuler])
  
  const renderComponent = () => {
    // 현재 선택된 컴포넌트의 설정값 가져오기
    const componentMap = {
      'profile': 'card',
      'product': 'card', 
      'blog': 'card'
    }
    
    const currentComponentType = componentMap[selectedComponent]
    const componentSettings = getComponentSettings(currentComponentType)
    
    const sampleData = {
      profile: {
        name: 'Sarah Johnson',
        title: 'UX 디자이너',
        avatar: SAMPLE_IMAGES.profiles[0].avatar,
        coverImage: SAMPLE_IMAGES.profiles[0].cover,
        followers: 2847,
        following: 312,
        posts: 89,
        bio: '사용자 경험을 통해 세상을 더 나은 곳으로 만들어갑니다.',
        verified: true,
        badges: ['디자인', '리더십', 'UX/UI']
      },
      product: {
        title: '프리미엄 무선 이어폰',
        description: '고급 노이즈 캔슬링과 최고 음질을 제공하는 무선 이어폰입니다.',
        price: 129000,
        originalPrice: 159000,
        image: SAMPLE_IMAGES.products[0].image,
        rating: 4.8,
        reviewCount: 1247,
        discount: 19,
        inStock: true,
        category: '전자제품',
        tags: ['무선', '노이즈캔슬링', '고음질']
      },
      blog: {
        title: 'React 18의 새로운 기능들: Concurrent Features 완전 정복',
        excerpt: 'React 18에서 도입된 Concurrent Features를 활용하여 더 나은 사용자 경험을 만드는 방법을 알아보겠습니다.',
        coverImage: SAMPLE_IMAGES.blogs[0].cover,
        author: SAMPLE_IMAGES.blogs[0].author,
        publishedAt: '2024-01-15T10:00:00Z',
        readTime: 8,
        category: '개발',
        tags: ['React', 'JavaScript', 'Frontend'],
        likes: 342,
        comments: 28,
        featured: true
      }
    }
    
    // 컴포넌트 설정값 적용
    const applySettings = (component: React.ReactElement) => {
      if (!componentSettings || Object.keys(componentSettings).length === 0) {
        return component
      }
      
      // Card 컴포넌트의 경우
      if (currentComponentType === 'card' && componentSettings.variant) {
        const cardElement = component as React.ReactElement<any>
        return React.cloneElement(cardElement, {
          ...cardElement.props,
          variant: componentSettings.variant,
          className: `${cardElement.props.className || ''} ${componentSettings.padding === 'none' ? 'p-0' : ''}`
        })
      }
      
      return component
    }
    
    switch (selectedComponent) {
      case 'profile':
        return applySettings(<ProfileCard {...sampleData.profile} />)
      case 'product':
        return applySettings(<ProductCard {...sampleData.product} />)
      case 'blog':
        return applySettings(<BlogCard {...sampleData.blog} />)
      default:
        return null
    }
  }
  
  // 현재 선택된 컴포넌트 타입 가져오기
  const getCurrentComponentType = (): ComponentType => {
    const componentMap: Record<string, ComponentType> = {
      'profile': 'card',
      'product': 'card', 
      'blog': 'card'
    }
    return componentMap[selectedComponent]
  }

  return (
    <div className={className}>
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                컴포넌트 미리보기
              </h3>
              <Badge variant="outline" size="sm">
                {currentViewport.icon} {currentViewport.label}
              </Badge>
              <Badge variant="secondary" size="sm">
                {Math.round(scale * 100)}%
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* 컴포넌트 선택 */}
              <div className="flex items-center gap-1">
                <Button
                  variant={selectedComponent === 'profile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedComponent('profile')}
                >
                  프로필
                </Button>
                <Button
                  variant={selectedComponent === 'product' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedComponent('product')}
                >
                  제품
                </Button>
                <Button
                  variant={selectedComponent === 'blog' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedComponent('blog')}
                >
                  블로그
                </Button>
              </div>
              
              {/* 뷰포트 선택 */}
              <div className="flex items-center gap-1">
                {Object.entries(VIEWPORT_CONFIGS).map(([key, config]) => (
                  <Button
                    key={key}
                    variant={viewport === key ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewport(key as ViewportSize)}
                  >
                    {config.icon}
                  </Button>
                ))}
              </div>
              
              {/* 도구 */}
              <div className="flex items-center gap-1">
                <Button
                  variant={showGrid ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setShowGrid(!showGrid)}
                >
                  격자
                </Button>
                <Button
                  variant={showRuler ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setShowRuler(!showRuler)}
                >
                  자
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? '⤏' : '⤢'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* 단축키 안내 */}
          {!isFullscreen && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>1-3: 컴포넌트 선택</span>
              <span>+/-: 확대/축소</span>
              <span>Ctrl+G: 격자</span>
              <span>Ctrl+R: 자</span>
              <span>Ctrl+Enter: 풀스크린</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {/* 탭 네비게이션 */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-4">
            {[
              { id: 'preview', label: '미리보기' },
              { id: 'settings', label: '컴포넌트 설정' },
              { id: 'code', label: '코드 내보내기' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'preview' | 'settings' | 'code')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 컴포넌트 설정 탭 */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground mb-4">
                {selectedComponent === 'profile' ? '프로필 카드' : 
                 selectedComponent === 'product' ? '제품 카드' : '블로그 카드'} 설정
              </h3>
              <ComponentSettings 
                componentType={getCurrentComponentType()}
                onSettingsChange={(settings) => {
                  console.log('Settings changed:', settings)
                  // 설정 변경 시 미리보기 자동 업데이트를 위해 강제 리렌더링
                  setActiveTab('preview')
                  setTimeout(() => setActiveTab('settings'), 100)
                }}
              />
              <div className="mt-6 p-4 border border-border rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">실시간 미리보기</h4>
                <div className="bg-muted/50 rounded-lg p-4 max-h-80 overflow-hidden">
                  <div className="transform scale-75 origin-top-left">
                    {renderComponent()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 코드 내보내기 탭 */}
          {activeTab === 'code' && (
            <CodeExporter />
          )}

          {/* 미리보기 탭 */}
          {activeTab === 'preview' && (
            <>
              {/* 스케일 컨트롤 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">확대/축소:</span>
                  {SCALE_OPTIONS.map((scaleOption) => (
                    <Button
                      key={scaleOption}
                      variant={scale === scaleOption ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setScale(scaleOption)}
                    >
                      {Math.round(scaleOption * 100)}%
                    </Button>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {currentViewport.width} × {currentViewport.height}px
                </div>
              </div>
          
          {/* 미리보기 영역 */}
          <div 
            ref={previewRef}
            className={`
              relative bg-background border rounded-lg overflow-hidden
              ${isFullscreen ? 'fixed inset-0 z-50 border-0 rounded-none' : ''}
            `}
            style={{
              height: isFullscreen ? '100vh' : Math.min(currentViewport.height * scale, 600)
            }}
          >
            {/* 눈금자 */}
            {showRuler && (
              <>
                {/* 수평 눈금자 */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-muted border-b border-border flex items-end text-xs text-muted-foreground z-10">
                  {Array.from({ length: Math.ceil(currentViewport.width / 50) + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute border-l border-border"
                      style={{ left: i * 50 * scale }}
                    >
                      <span className="ml-1">{i * 50}</span>
                    </div>
                  ))}
                </div>
                
                {/* 수직 눈금자 */}
                <div className="absolute top-0 left-0 bottom-0 w-6 bg-muted border-r border-border z-10">
                  {Array.from({ length: Math.ceil(currentViewport.height / 50) + 1 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute border-t border-border text-xs text-muted-foreground"
                      style={{ top: i * 50 * scale + (showRuler ? 24 : 0) }}
                    >
                      <span className="ml-1 rotate-90 inline-block origin-left">{i * 50}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {/* 격자 */}
            {showGrid && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none z-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${20 * scale}px ${20 * scale}px`,
                  marginTop: showRuler ? 24 : 0,
                  marginLeft: showRuler ? 24 : 0
                }}
              />
            )}
            
            {/* 컴포넌트 미리보기 */}
            <div
              className={`
                relative flex items-center justify-center p-8 h-full
                ${theme?.colors?.background === '#000000' || theme?.colors?.background === '#1a1a1a' ? 'bg-gray-900' : 'bg-gray-50'}
                transition-all duration-300
              `}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                width: currentViewport.width,
                height: currentViewport.height,
                margin: '0 auto',
                marginTop: showRuler ? 24 : 0,
                marginLeft: showRuler ? 24 : 'auto',
                marginRight: 'auto'
              }}
            >
              {renderComponent()}
            </div>
            
            {/* 뷰포트 정보 (풀스크린 모드) */}
            {isFullscreen && (
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur rounded-lg p-3 text-sm">
                <div className="text-foreground font-medium">
                  {currentViewport.label} ({currentViewport.width} × {currentViewport.height})
                </div>
                <div className="text-muted-foreground">
                  확대: {Math.round(scale * 100)}%
                </div>
              </div>
            )}
            
            {/* 풀스크린 종료 버튼 */}
            {isFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="absolute top-4 left-4"
              >
                ⤏ 종료
              </Button>
            )}
          </div>
          
          {/* 뷰포트 정보 */}
          {!isFullscreen && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              미리보기 크기: {Math.round(currentViewport.width * scale)} × {Math.round(currentViewport.height * scale)}px
            </div>
          )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
