'use client'

import { useEffect } from 'react'
import { useDesignSystem } from '@/contexts/DesignSystemContext'
import { generateCSSVariables, applyCSSVariables } from '@/lib/themeGenerator'
import ComponentPreview from './ComponentPreview'
import ThemePreview from './ThemePreview'
import { getThemeColor, applyOpacity, getContrastColor } from '@/lib/themeUtils'

export default function Canvas() {
  const { selectedComponents, theme } = useDesignSystem()

  // 테마 색상 추출
  const primaryColor = getThemeColor(theme, 'primary', '#8b5cf6')
  const backgroundColor = getThemeColor(theme, 'background', '#ffffff')
  const foregroundColor = getThemeColor(theme, 'foreground', '#0f172a')
  const mutedColor = getThemeColor(theme, 'mutedForeground', '#64748b')
  const borderColor = getThemeColor(theme, 'border', '#e2e8f0')
  const primaryTextColor = getContrastColor(primaryColor)

  // 테마가 변경될 때마다 CSS 변수 적용
  useEffect(() => {
    try {
      if (theme && typeof theme === 'object') {
        const variables = generateCSSVariables(theme)
        applyCSSVariables(variables)
      }
    } catch (error) {
      console.error('Error applying theme variables in Canvas:', error)
    }
  }, [theme])

  return (
    <div
      className="h-full bg-background overflow-auto custom-scrollbar relative"
      style={{ minWidth: '500px' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern pointer-events-none"></div>
      
      <div className="p-6 relative z-10">
        {/* 헤더 */}
        <div className="mb-8 animate-fade-in">
          <div 
            className="glass-card p-6 rounded-2xl"
            style={{ 
              borderColor: applyOpacity(borderColor, 0.3),
              backgroundColor: applyOpacity(backgroundColor, 0.8)
            }}
          >
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ 
                color: primaryColor,
                textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}`
              }}
            >
              컴포넌트 미리보기
            </h2>
            <p className="text-lg" style={{ color: mutedColor }}>
              생성된 컴포넌트들을 실시간으로 확인하세요 ✨
            </p>
          </div>
        </div>

        {/* 테마 정보 */}
        <div 
          className="mb-8 glass-card p-6 rounded-2xl animate-slide-in"
          style={{ 
            borderColor: applyOpacity(borderColor, 0.3),
            backgroundColor: applyOpacity(backgroundColor, 0.8)
          }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: foregroundColor }}>
            <span className="mr-2">🎨</span>
            현재 테마
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              className="hover-lift p-3 rounded-xl border"
              style={{ 
                backgroundColor: applyOpacity(backgroundColor, 0.5),
                borderColor: applyOpacity(borderColor, 0.5)
              }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: foregroundColor }}>Primary</p>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-xl border shadow-md hover:shadow-lg transition-shadow"
                  style={{ 
                    backgroundColor: primaryColor,
                    borderColor: borderColor
                  }}
                />
                <span 
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ 
                    color: mutedColor,
                    backgroundColor: applyOpacity(borderColor, 0.5)
                  }}
                >
                  {primaryColor}
                </span>
              </div>
            </div>
            
            <div 
              className="hover-lift p-3 rounded-xl border"
              style={{ 
                backgroundColor: applyOpacity(backgroundColor, 0.5),
                borderColor: applyOpacity(borderColor, 0.5)
              }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: foregroundColor }}>Secondary</p>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-xl border shadow-md hover:shadow-lg transition-shadow"
                  style={{ 
                    backgroundColor: getThemeColor(theme, 'secondary', '#64748b'),
                    borderColor: borderColor
                  }}
                />
                <span 
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ 
                    color: mutedColor,
                    backgroundColor: applyOpacity(borderColor, 0.5)
                  }}
                >
                  {getThemeColor(theme, 'secondary', '#64748b')}
                </span>
              </div>
            </div>
            
            <div 
              className="hover-lift p-3 rounded-xl border"
              style={{ 
                backgroundColor: applyOpacity(backgroundColor, 0.5),
                borderColor: applyOpacity(borderColor, 0.5)
              }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: foregroundColor }}>Background</p>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-xl border shadow-md hover:shadow-lg transition-shadow"
                  style={{ 
                    backgroundColor: backgroundColor,
                    borderColor: borderColor
                  }}
                />
                <span 
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ 
                    color: mutedColor,
                    backgroundColor: applyOpacity(borderColor, 0.5)
                  }}
                >
                  {backgroundColor}
                </span>
              </div>
            </div>
            
            <div 
              className="hover-lift p-3 rounded-xl border"
              style={{ 
                backgroundColor: applyOpacity(backgroundColor, 0.5),
                borderColor: applyOpacity(borderColor, 0.5)
              }}
            >
              <p className="text-sm font-semibold mb-3" style={{ color: foregroundColor }}>Foreground</p>
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-xl border shadow-md hover:shadow-lg transition-shadow"
                  style={{ 
                    backgroundColor: foregroundColor,
                    borderColor: borderColor
                  }}
                />
                <span 
                  className="text-xs font-mono px-2 py-1 rounded"
                  style={{ 
                    color: mutedColor,
                    backgroundColor: applyOpacity(borderColor, 0.5)
                  }}
                >
                  {foregroundColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 테마 미리보기 - 전체 미리보기 */}
        <ThemePreview className="mb-8" />

        {/* 개별 컴포넌트 미리보기 그리드 */}
        {selectedComponents.length > 0 && (
          <>
            <div className="flex items-center space-x-2 mb-6 animate-fade-in">
              <span className="text-lg">🔧</span>
              <h3 
                className="text-xl font-bold"
                style={{ 
                  color: primaryColor,
                  textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}`
                }}
              >
                선택된 컴포넌트들
              </h3>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {selectedComponents.map((componentType) => (
                <ComponentPreview
                  key={componentType}
                  type={componentType}
                  theme={theme}
                />
              ))}
            </div>
          </>
        )}

        {/* 빈 상태 */}
        {selectedComponents.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div 
              className="glass-card max-w-md mx-auto p-8 rounded-2xl"
              style={{ 
                borderColor: applyOpacity(borderColor, 0.3),
                backgroundColor: applyOpacity(backgroundColor, 0.8)
              }}
            >
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center hover-lift"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${applyOpacity(primaryColor, 0.8)} 100%)` 
                }}
              >
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke={primaryTextColor}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z"
                  />
                </svg>
              </div>
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ 
                  color: primaryColor,
                  textShadow: `0 0 20px ${applyOpacity(primaryColor, 0.3)}`
                }}
              >
                컴포넌트를 선택하세요
              </h3>
              <p className="text-pretty leading-relaxed" style={{ color: mutedColor }}>
                왼쪽 사이드바에서 원하는 컴포넌트를 선택하면<br/>
                실시간 미리보기가 여기에 표시됩니다 ✨
              </p>
              <div className="flex items-center justify-center space-x-2 mt-6">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: applyOpacity(primaryColor, 0.3) }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-pulse" 
                  style={{
                    animationDelay: '0.2s',
                    backgroundColor: applyOpacity(primaryColor, 0.5)
                  }}
                ></div>
                <div 
                  className="w-2 h-2 rounded-full animate-pulse" 
                  style={{
                    animationDelay: '0.4s',
                    backgroundColor: applyOpacity(primaryColor, 0.7)
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
