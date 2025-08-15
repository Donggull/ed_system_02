'use client'

import { useState, useEffect } from 'react'
import { ComponentType, useDesignSystem } from '@/contexts/DesignSystemContext'

interface ComponentSettingsProps {
  componentType: ComponentType
  onSettingsChange?: (settings: any) => void
}

export default function ComponentSettings({ componentType, onSettingsChange }: ComponentSettingsProps) {
  const { updateComponentSettings, getComponentSettings } = useDesignSystem()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<any>(() => getComponentSettings(componentType))

  // 컴포넌트별 사용 가능한 설정 정의
  const getAvailableSettings = (type: ComponentType) => {
    const settingsMap = {
      button: [
        { key: 'size', label: '크기', type: 'select', options: ['sm', 'default', 'lg'], default: 'default' },
        { key: 'variant', label: '변형', type: 'select', options: ['default', 'secondary', 'outline', 'ghost', 'destructive'], default: 'default' },
        { key: 'loading', label: '로딩 상태', type: 'checkbox', default: false },
        { key: 'disabled', label: '비활성화', type: 'checkbox', default: false }
      ],
      input: [
        { key: 'size', label: '크기', type: 'select', options: ['sm', 'default', 'lg'], default: 'default' },
        { key: 'type', label: '타입', type: 'select', options: ['text', 'email', 'password', 'search'], default: 'text' },
        { key: 'placeholder', label: '플레이스홀더', type: 'text', default: '입력해주세요' },
        { key: 'disabled', label: '비활성화', type: 'checkbox', default: false },
        { key: 'error', label: '에러 상태', type: 'text', default: '' },
        { key: 'success', label: '성공 메시지', type: 'text', default: '' }
      ],
      card: [
        { key: 'variant', label: '변형', type: 'select', options: ['default', 'elevated', 'outlined'], default: 'default' },
        { key: 'padding', label: '패딩', type: 'select', options: ['none', 'sm', 'md', 'lg'], default: 'md' },
        { key: 'showHeader', label: '헤더 표시', type: 'checkbox', default: true },
        { key: 'showFooter', label: '푸터 표시', type: 'checkbox', default: false }
      ],
      badge: [
        { key: 'variant', label: '변형', type: 'select', options: ['default', 'secondary', 'destructive', 'outline'], default: 'default' },
        { key: 'size', label: '크기', type: 'select', options: ['sm', 'default', 'lg'], default: 'default' },
        { key: 'clickable', label: '클릭 가능', type: 'checkbox', default: false }
      ],
      avatar: [
        { key: 'size', label: '크기', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
        { key: 'showBadge', label: '상태 배지', type: 'checkbox', default: false },
        { key: 'badgeColor', label: '배지 색상', type: 'select', options: ['green', 'red', 'blue', 'yellow'], default: 'green' },
        { key: 'fallback', label: '대체 텍스트', type: 'text', default: 'U' }
      ],
      image: [
        { key: 'rounded', label: '둥근 모서리', type: 'checkbox', default: false },
        { key: 'aspectRatio', label: '비율', type: 'select', options: ['auto', 'square', '16:9', '4:3'], default: 'auto' },
        { key: 'objectFit', label: '맞춤', type: 'select', options: ['cover', 'contain', 'fill'], default: 'cover' }
      ]
    }

    return settingsMap[type as keyof typeof settingsMap] || []
  }

  // 기본값으로 설정 초기화
  useEffect(() => {
    const availableSettings = getAvailableSettings(componentType)
    const defaultSettings = availableSettings.reduce((acc, setting) => {
      if (setting.default !== undefined) {
        acc[setting.key] = setting.default
      }
      return acc
    }, {} as any)

    const currentSettings = getComponentSettings(componentType)
    const mergedSettings = { ...defaultSettings, ...currentSettings }
    
    setSettings(mergedSettings)
    updateComponentSettings(componentType, mergedSettings)
  }, [componentType])

  const availableSettings = getAvailableSettings(componentType)

  if (availableSettings.length === 0) {
    return null
  }

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    updateComponentSettings(componentType, newSettings)
    onSettingsChange?.(newSettings)
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <span>세부 설정</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3">
          {availableSettings.map((setting) => (
            <div key={setting.key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {setting.label}
              </label>
              
              {setting.type === 'select' && setting.options && (
                <select
                  value={settings[setting.key] || setting.default || setting.options[0]}
                  onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {setting.options.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {setting.type === 'checkbox' && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[setting.key] !== undefined ? settings[setting.key] : (setting.default || false)}
                    onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                    className="w-3 h-3 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-xs text-foreground">
                    활성화
                  </span>
                </label>
              )}

              {setting.type === 'text' && (
                <input
                  type="text"
                  value={settings[setting.key] || (typeof setting.default === 'string' ? setting.default : '') || ''}
                  onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={typeof setting.default === 'string' ? setting.default : ''}
                />
              )}
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              설정이 변경되면 미리보기에 실시간으로 반영됩니다.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


