'use client'

import { DesignSystemTheme } from '@/contexts/DesignSystemContext'

export interface ThemeState {
  current: DesignSystemTheme
  previous: DesignSystemTheme | null
  isTransitioning: boolean
  lastUpdate: number
}

export class ThemeEngine {
  private static instance: ThemeEngine
  private state: ThemeState
  private listeners: Set<(state: ThemeState) => void> = new Set()
  private transitionDuration = 300 // ms

  private constructor(initialTheme: DesignSystemTheme) {
    this.state = {
      current: initialTheme,
      previous: null,
      isTransitioning: false,
      lastUpdate: Date.now()
    }
  }

  static getInstance(initialTheme?: DesignSystemTheme): ThemeEngine {
    if (!ThemeEngine.instance && initialTheme) {
      ThemeEngine.instance = new ThemeEngine(initialTheme)
    }
    return ThemeEngine.instance
  }

  subscribe(listener: (state: ThemeState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  async updateTheme(newTheme: DesignSystemTheme, animated = true): Promise<void> {
    console.log('ThemeEngine.updateTheme called', {
      isTransitioning: this.state.isTransitioning,
      animated,
      newThemeKeys: Object.keys(newTheme || {}),
      hasColors: !!(newTheme?.colors),
      hasTypography: !!(newTheme?.typography)
    })
    
    if (this.state.isTransitioning) {
      console.warn('ThemeEngine: Already transitioning, skipping update')
      return // 이미 전환 중이면 무시
    }

    // 테마 유효성 기본 검사
    if (!newTheme || typeof newTheme !== 'object') {
      console.warn('ThemeEngine: Invalid theme provided, using current theme')
      return
    }

    const previousTheme = { ...this.state.current }
    
    this.state = {
      current: newTheme,
      previous: previousTheme,
      isTransitioning: animated,
      lastUpdate: Date.now()
    }

    this.notify()

    try {
      if (animated) {
        // CSS 변수 업데이트 (애니메이션 포함)
        await this.applyCSSVariablesAnimated(newTheme, previousTheme)
      } else {
        // 즉시 업데이트
        this.applyCSSVariables(newTheme)
      }
    } catch (error) {
      console.error('ThemeEngine: Error updating theme, rolling back:', error)
      // 오류 발생 시 롤백
      this.state = {
        current: previousTheme,
        previous: this.state.previous,
        isTransitioning: false,
        lastUpdate: Date.now()
      }
      this.applyCSSVariables(previousTheme)
    }

    // 전환 완료
    this.state.isTransitioning = false
    this.notify()
    
    console.log('ThemeEngine.updateTheme completed successfully')
  }

  private applyCSSVariables(theme: DesignSystemTheme): void {
    const root = document.documentElement
    
    // 색상 변수 (안전성 검사 포함)
    if (theme.colors && typeof theme.colors === 'object') {
      Object.entries(theme.colors).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--color-${this.kebabCase(key)}`, value)
        }
      })
    }

    // 타이포그래피 변수
    if (theme.typography && typeof theme.typography === 'object') {
      if (typeof theme.typography.fontFamily === 'string') {
        root.style.setProperty('--font-family', theme.typography.fontFamily)
      }
      
      if (theme.typography.fontSize && typeof theme.typography.fontSize === 'object') {
        Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--font-size-${key}`, value)
          }
        })
      }
      
      if (theme.typography.fontWeight && typeof theme.typography.fontWeight === 'object') {
        Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--font-weight-${key}`, value)
          }
        })
      }
      
      if (theme.typography.lineHeight && typeof theme.typography.lineHeight === 'object') {
        Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--line-height-${key}`, value)
          }
        })
      }
    }

    // 간격 변수
    if (theme.spacing && typeof theme.spacing === 'object') {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--spacing-${key}`, value)
        }
      })
    }

    // 모서리 둥글기 변수
    if (theme.borderRadius && typeof theme.borderRadius === 'object') {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--border-radius-${key}`, value)
        }
      })
    }

    // 그림자 변수
    if (theme.shadows && typeof theme.shadows === 'object') {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--shadow-${key}`, value)
        }
      })
    }
  }

  private async applyCSSVariablesAnimated(
    newTheme: DesignSystemTheme, 
    previousTheme: DesignSystemTheme
  ): Promise<void> {
    const root = document.documentElement
    
    // 전환 애니메이션 활성화
    root.style.setProperty('--theme-transition-duration', `${this.transitionDuration}ms`)
    root.classList.add('theme-transitioning')

    // 애니메이션 가능한 속성들만 전환
    await this.animateColorTransition(newTheme.colors, previousTheme.colors)
    
    // 나머지 속성들은 즉시 적용
    this.applySafeNonAnimatedProperties(newTheme)

    // 애니메이션 완료 대기
    await new Promise(resolve => setTimeout(resolve, this.transitionDuration))
    
    // 전환 클래스 제거
    root.classList.remove('theme-transitioning')
  }

  private async animateColorTransition(
    newColors: DesignSystemTheme['colors'],
    previousColors: DesignSystemTheme['colors']
  ): Promise<void> {
    const root = document.documentElement
    
    // 색상 객체 유효성 검사
    if (!newColors || typeof newColors !== 'object') {
      console.warn('animateColorTransition: newColors is invalid')
      return
    }
    
    if (!previousColors || typeof previousColors !== 'object') {
      console.warn('animateColorTransition: previousColors is invalid')
      return
    }
    
    // 색상 전환을 위한 중간 단계 생성
    const steps = 10
    const stepDuration = this.transitionDuration / steps

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      
      try {
        Object.entries(newColors).forEach(([key, newValue]) => {
          const oldValue = previousColors[key as keyof typeof previousColors]
          
          // 값 유효성 검사
          if (typeof newValue !== 'string' || typeof oldValue !== 'string') {
            return
          }
          
          if (this.isAnimatableColor(newValue) && this.isAnimatableColor(oldValue)) {
            const interpolatedColor = this.interpolateColor(oldValue, newValue, progress)
            root.style.setProperty(`--color-${this.kebabCase(key)}`, interpolatedColor)
          } else {
            // 애니메이션 불가능한 색상은 즉시 변경
            root.style.setProperty(`--color-${this.kebabCase(key)}`, newValue)
          }
        })
      } catch (error) {
        console.error('Error in color animation step:', error)
        // 오류 발생 시 최종 색상으로 즉시 변경
        this.applyCSSVariables({ colors: newColors } as DesignSystemTheme)
        break
      }
      
      if (i < steps) {
        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }
    }
  }

  private applyNonAnimatedProperties(theme: DesignSystemTheme): void {
    const root = document.documentElement
    
    // 타이포그래피
    root.style.setProperty('--font-family', theme.typography.fontFamily)
    
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value)
    })
    
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value)
    })
    
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value)
    })

    // 간격
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    // 모서리 둥글기
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value)
    })

    // 그림자
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })
  }

  private isAnimatableColor(color: string): boolean {
    // HEX, RGB, HSL 색상만 애니메이션 가능
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const rgbRegex = /^rgba?\(/
    const hslRegex = /^hsla?\(/
    
    return hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color)
  }

  private interpolateColor(color1: string, color2: string, progress: number): string {
    try {
      const rgb1 = this.colorToRgb(color1)
      const rgb2 = this.colorToRgb(color2)
      
      if (!rgb1 || !rgb2) return color2
      
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress)
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress)
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress)
      
      return `rgb(${r}, ${g}, ${b})`
    } catch {
      return color2
    }
  }

  private colorToRgb(color: string): { r: number; g: number; b: number } | null {
    // HEX to RGB
    const hexMatch = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    if (hexMatch) {
      const hex = hexMatch[1]
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        }
      } else {
        return {
          r: parseInt(hex.substr(0, 2), 16),
          g: parseInt(hex.substr(2, 2), 16),
          b: parseInt(hex.substr(4, 2), 16)
        }
      }
    }

    // RGB to RGB
    const rgbMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)$/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      }
    }

    return null
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  }

  rollback(): void {
    if (this.state.previous && typeof this.state.previous === 'object') {
      console.log('ThemeEngine: Rolling back to previous theme')
      this.updateTheme(this.state.previous, true)
    } else {
      console.warn('ThemeEngine: No previous theme available for rollback')
    }
  }

  // 안전한 비애니메이션 속성 적용
  private applySafeNonAnimatedProperties(theme: DesignSystemTheme): void {
    const root = document.documentElement
    
    try {
      // 타이포그래피 (안전성 검사 포함)
      if (theme.typography && typeof theme.typography === 'object') {
        if (typeof theme.typography.fontFamily === 'string') {
          root.style.setProperty('--font-family', theme.typography.fontFamily)
        }
        
        if (theme.typography.fontSize && typeof theme.typography.fontSize === 'object') {
          Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
            if (typeof value === 'string') {
              root.style.setProperty(`--font-size-${key}`, value)
            }
          })
        }
        
        if (theme.typography.fontWeight && typeof theme.typography.fontWeight === 'object') {
          Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
            if (typeof value === 'string') {
              root.style.setProperty(`--font-weight-${key}`, value)
            }
          })
        }
        
        if (theme.typography.lineHeight && typeof theme.typography.lineHeight === 'object') {
          Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
            if (typeof value === 'string') {
              root.style.setProperty(`--line-height-${key}`, value)
            }
          })
        }
      }

      // 간격
      if (theme.spacing && typeof theme.spacing === 'object') {
        Object.entries(theme.spacing).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--spacing-${key}`, value)
          }
        })
      }

      // 모서리 둥그리
      if (theme.borderRadius && typeof theme.borderRadius === 'object') {
        Object.entries(theme.borderRadius).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--border-radius-${key}`, value)
          }
        })
      }

      // 그림자
      if (theme.shadows && typeof theme.shadows === 'object') {
        Object.entries(theme.shadows).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--shadow-${key}`, value)
          }
        })
      }
    } catch (error) {
      console.error('Error applying non-animated properties:', error)
    }
  }

  getState(): ThemeState {
    return { ...this.state }
  }

  // 초기 CSS 변수 설정
  initialize(): void {
    this.applyCSSVariables(this.state.current)
    this.addGlobalStyles()
  }

  private addGlobalStyles(): void {
    if (typeof document === 'undefined') return

    const styleId = 'theme-engine-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      :root {
        --theme-transition-duration: 300ms;
      }
      
      .theme-transitioning * {
        transition: 
          background-color var(--theme-transition-duration) ease,
          border-color var(--theme-transition-duration) ease,
          color var(--theme-transition-duration) ease,
          box-shadow var(--theme-transition-duration) ease !important;
      }
      
      .theme-transitioning *:before,
      .theme-transitioning *:after {
        transition: 
          background-color var(--theme-transition-duration) ease,
          border-color var(--theme-transition-duration) ease,
          color var(--theme-transition-duration) ease,
          box-shadow var(--theme-transition-duration) ease !important;
      }
    `
    
    document.head.appendChild(style)
  }
}

// React 훅
export function useThemeEngine(initialTheme: DesignSystemTheme) {
  const [state, setState] = React.useState<ThemeState>(() => {
    const engine = ThemeEngine.getInstance(initialTheme)
    return engine.getState()
  })

  React.useEffect(() => {
    const engine = ThemeEngine.getInstance()
    engine.initialize()
    
    const unsubscribe = engine.subscribe(setState)
    return unsubscribe
  }, [])

  const updateTheme = React.useCallback(async (theme: DesignSystemTheme, animated = true) => {
    console.log('useThemeEngine.updateTheme called', { 
      themeKeys: Object.keys(theme || {}),
      animated,
      engineExists: !!ThemeEngine.getInstance()
    })
    
    const engine = ThemeEngine.getInstance()
    await engine.updateTheme(theme, animated)
    
    console.log('useThemeEngine.updateTheme completed')
  }, [])

  const rollback = React.useCallback(() => {
    const engine = ThemeEngine.getInstance()
    engine.rollback()
  }, [])

  return {
    state,
    updateTheme,
    rollback
  }
}

import React from 'react'
