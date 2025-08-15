'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeEngine } from '@/lib/themeEngine'

export interface DesignSystemTheme {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      '2xl': string
      '3xl': string
      '4xl': string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export const defaultTheme: DesignSystemTheme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#2563eb'
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
}

// 기본 필수 컴포넌트
export type CoreComponentType = 
  | 'button' 
  | 'input' 
  | 'card' 
  | 'typography'

// 추가 선택 컴포넌트
export type OptionalComponentType =
  | 'modal'
  | 'navigation'
  | 'loading'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'textarea'
  | 'badge'

// Data Display 카테고리
export type DataDisplayComponentType =
  | 'table'
  | 'list'
  | 'avatar'
  | 'tooltip'

// Feedback 카테고리
export type FeedbackComponentType =
  | 'alert'
  | 'toast'
  | 'notification'
  | 'banner'

// Layout 카테고리
export type LayoutComponentType =
  | 'grid'
  | 'flex'
  | 'container'
  | 'divider'

// Navigation 카테고리
export type NavigationComponentType =
  | 'tabs'
  | 'pagination'
  | 'steps'
  | 'menu'

// Interactive 카테고리
export type InteractiveComponentType =
  | 'accordion'
  | 'collapse'
  | 'drawer'
  | 'popover'

// Media 카테고리
export type MediaComponentType =
  | 'image'
  | 'video'
  | 'gallery'
  | 'carousel'

// Charts 카테고리
export type ChartsComponentType =
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'area-chart'

export type ComponentType = 
  | CoreComponentType
  | OptionalComponentType
  | DataDisplayComponentType
  | FeedbackComponentType
  | LayoutComponentType
  | NavigationComponentType
  | InteractiveComponentType
  | MediaComponentType
  | ChartsComponentType

export interface ComponentCategory {
  id: string
  label: string
  components: {
    type: ComponentType
    label: string
    required?: boolean
  }[]
}

// 컴포넌트별 설정 인터페이스
export interface ComponentSettings {
  [componentType: string]: {
    [settingKey: string]: any
  }
}

interface DesignSystemContextType {
  theme: DesignSystemTheme
  setTheme: (theme: DesignSystemTheme, animated?: boolean) => void
  selectedComponents: ComponentType[]
  toggleComponent: (component: ComponentType) => void
  selectAllInCategory: (categoryId: string) => void
  deselectAllInCategory: (categoryId: string) => void
  selectAll: () => void
  deselectAll: () => void
  jsonInput: string
  setJsonInput: (input: string) => void
  jsonValid: boolean
  setJsonValid: (valid: boolean) => void
  applyTheme: () => void
  componentCategories: ComponentCategory[]
  isThemeTransitioning: boolean
  rollbackTheme: () => void
  // 컴포넌트 설정 관련
  componentSettings: ComponentSettings
  updateComponentSettings: (componentType: string, settings: any) => void
  getComponentSettings: (componentType: string) => any
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined)

export const componentCategories: ComponentCategory[] = [
  {
    id: 'core',
    label: '핵심 컴포넌트',
    components: [
      { type: 'button', label: 'Button', required: true },
      { type: 'input', label: 'Input', required: true },
      { type: 'card', label: 'Card', required: true },
      { type: 'typography', label: 'Typography', required: true },
    ]
  },
  {
    id: 'forms',
    label: '폼 컴포넌트',
    components: [
      { type: 'checkbox', label: 'Checkbox' },
      { type: 'radio', label: 'Radio' },
      { type: 'select', label: 'Select' },
      { type: 'textarea', label: 'Textarea' },
    ]
  },
  {
    id: 'layout',
    label: '레이아웃',
    components: [
      { type: 'modal', label: 'Modal/Dialog' },
      { type: 'navigation', label: 'Navigation' },
      { type: 'grid', label: 'Grid' },
      { type: 'flex', label: 'Flex' },
      { type: 'container', label: 'Container' },
      { type: 'divider', label: 'Divider' },
    ]
  },
  {
    id: 'data-display',
    label: '데이터 표시',
    components: [
      { type: 'table', label: 'Table' },
      { type: 'list', label: 'List' },
      { type: 'badge', label: 'Badge' },
      { type: 'avatar', label: 'Avatar' },
      { type: 'tooltip', label: 'Tooltip' },
    ]
  },
  {
    id: 'feedback',
    label: '피드백',
    components: [
      { type: 'alert', label: 'Alert' },
      { type: 'toast', label: 'Toast' },
      { type: 'notification', label: 'Notification' },
      { type: 'banner', label: 'Banner' },
      { type: 'loading', label: 'Loading States' },
    ]
  },
  {
    id: 'navigation',
    label: '내비게이션',
    components: [
      { type: 'tabs', label: 'Tabs' },
      { type: 'pagination', label: 'Pagination' },
      { type: 'steps', label: 'Steps' },
      { type: 'menu', label: 'Menu' },
    ]
  },
  {
    id: 'interactive',
    label: '인터랙티브',
    components: [
      { type: 'accordion', label: 'Accordion' },
      { type: 'collapse', label: 'Collapse' },
      { type: 'drawer', label: 'Drawer' },
      { type: 'popover', label: 'Popover' },
    ]
  },
  {
    id: 'media',
    label: '미디어',
    components: [
      { type: 'image', label: 'Image' },
      { type: 'video', label: 'Video' },
      { type: 'gallery', label: 'Gallery' },
      { type: 'carousel', label: 'Carousel' },
    ]
  },
  {
    id: 'charts',
    label: '차트',
    components: [
      { type: 'bar-chart', label: 'Bar Chart' },
      { type: 'line-chart', label: 'Line Chart' },
      { type: 'pie-chart', label: 'Pie Chart' },
      { type: 'area-chart', label: 'Area Chart' },
    ]
  },
]

export function DesignSystemProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DesignSystemTheme>(defaultTheme)
  const [selectedComponents, setSelectedComponents] = useState<ComponentType[]>(['button', 'input', 'card', 'typography'])
  const [jsonInput, setJsonInput] = useState<string>(JSON.stringify(defaultTheme, null, 2))
  const [jsonValid, setJsonValid] = useState<boolean>(true)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState<boolean>(false)
  const [themeEngine, setThemeEngine] = useState<ThemeEngine | null>(null)
  const [componentSettings, setComponentSettings] = useState<ComponentSettings>({})

  // 테마 엔진 초기화
  useEffect(() => {
    const engine = ThemeEngine.getInstance(defaultTheme)
    setThemeEngine(engine)
    
    engine.initialize()
    
    // 테마 상태 구독
    const unsubscribe = engine.subscribe((state) => {
      setThemeState(state.current)
      setIsThemeTransitioning(state.isTransitioning)
    })
    
    return unsubscribe
  }, [])

  const setTheme = async (newTheme: DesignSystemTheme, animated = true) => {
    console.log('DesignSystemContext.setTheme called', {
      hasThemeEngine: !!themeEngine,
      animated,
      newThemeKeys: Object.keys(newTheme || {})
    })
    
    if (themeEngine) {
      await themeEngine.updateTheme(newTheme, animated)
      console.log('DesignSystemContext.setTheme completed via engine')
    } else {
      console.warn('No theme engine available, using fallback')
      setThemeState(newTheme)
    }
  }

  const rollbackTheme = () => {
    if (themeEngine) {
      themeEngine.rollback()
    }
  }

  const toggleComponent = (component: ComponentType) => {
    setSelectedComponents(prev => 
      prev.includes(component)
        ? prev.filter(c => c !== component)
        : [...prev, component]
    )
  }

  const selectAllInCategory = (categoryId: string) => {
    const category = componentCategories.find(cat => cat.id === categoryId)
    if (category) {
      const categoryComponents = category.components.map(comp => comp.type)
      setSelectedComponents(prev => [
        ...prev.filter(comp => !categoryComponents.includes(comp)),
        ...categoryComponents
      ])
    }
  }

  const deselectAllInCategory = (categoryId: string) => {
    const category = componentCategories.find(cat => cat.id === categoryId)
    if (category) {
      const categoryComponents = category.components.map(comp => comp.type)
      setSelectedComponents(prev => 
        prev.filter(comp => !categoryComponents.includes(comp))
      )
    }
  }

  const selectAll = () => {
    const allComponents = componentCategories.flatMap(cat => 
      cat.components.map(comp => comp.type)
    )
    setSelectedComponents(allComponents)
  }

  const deselectAll = () => {
    // 필수 컴포넌트는 유지
    const requiredComponents = componentCategories
      .flatMap(cat => cat.components)
      .filter(comp => comp.required)
      .map(comp => comp.type)
    setSelectedComponents(requiredComponents)
  }

  const applyTheme = () => {
    try {
      const parsedTheme = JSON.parse(jsonInput)
      setTheme(parsedTheme, true)
      setJsonValid(true)
    } catch (error) {
      setJsonValid(false)
    }
  }

  // 컴포넌트 설정 관리 함수들
  const updateComponentSettings = (componentType: string, settings: any) => {
    setComponentSettings(prev => ({
      ...prev,
      [componentType]: {
        ...prev[componentType],
        ...settings
      }
    }))
  }

  const getComponentSettings = (componentType: string) => {
    return componentSettings[componentType] || {}
  }

  return (
    <DesignSystemContext.Provider value={{
      theme,
      setTheme,
      selectedComponents,
      toggleComponent,
      selectAllInCategory,
      deselectAllInCategory,
      selectAll,
      deselectAll,
      jsonInput,
      setJsonInput,
      jsonValid,
      setJsonValid,
      applyTheme,
      componentCategories,
      isThemeTransitioning,
      rollbackTheme,
      componentSettings,
      updateComponentSettings,
      getComponentSettings
    }}>
      {children}
    </DesignSystemContext.Provider>
  )
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext)
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider')
  }
  return context
}
