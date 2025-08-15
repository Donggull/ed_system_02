'use client'

import React, { useState, useEffect } from 'react'
import { DesignSystemTheme, ComponentType, useDesignSystem } from '@/contexts/DesignSystemContext'
import ComponentSettings from './ComponentSettings'

interface ComponentPreviewProps {
  type: ComponentType
  theme: DesignSystemTheme
}

export default function ComponentPreview({ type, theme }: ComponentPreviewProps) {
  const { getComponentSettings } = useDesignSystem()
  const [componentSettings, setComponentSettings] = useState<any>(() => getComponentSettings(type))
  
  // 설정이 변경될 때마다 업데이트
  useEffect(() => {
    const currentSettings = getComponentSettings(type)
    setComponentSettings(currentSettings)
  }, [type, getComponentSettings])
  
  // 안전한 테마 접근을 위한 헬퍼 함수
  const getThemeValue = (path: string, fallback: string) => {
    try {
      const keys = path.split('.')
      let value: any = theme
      for (const key of keys) {
        value = value?.[key]
      }
      return typeof value === 'string' ? value : fallback
    } catch {
      return fallback
    }
  }
  const getComponentName = (type: ComponentType) => {
    const names = {
      // Core
      button: 'Button',
      input: 'Input',
      card: 'Card',
      typography: 'Typography',
      // Forms
      checkbox: 'Checkbox',
      radio: 'Radio',
      select: 'Select',
      textarea: 'Textarea',
      // Layout
      modal: 'Modal/Dialog',
      navigation: 'Navigation',
      grid: 'Grid',
      flex: 'Flex',
      container: 'Container',
      divider: 'Divider',
      // Data Display
      table: 'Table',
      list: 'List',
      badge: 'Badge',
      avatar: 'Avatar',
      tooltip: 'Tooltip',
      // Feedback
      alert: 'Alert',
      toast: 'Toast',
      notification: 'Notification',
      banner: 'Banner',
      loading: 'Loading States',
      // Navigation
      tabs: 'Tabs',
      pagination: 'Pagination',
      steps: 'Steps',
      menu: 'Menu',
      // Interactive
      accordion: 'Accordion',
      collapse: 'Collapse',
      drawer: 'Drawer',
      popover: 'Popover',
      // Media
      image: 'Image',
      video: 'Video',
      gallery: 'Gallery',
      carousel: 'Carousel',
      // Charts
      'bar-chart': 'Bar Chart',
      'line-chart': 'Line Chart',
      'pie-chart': 'Pie Chart',
      'area-chart': 'Area Chart'
    }
    return names[type] || type
  }

  const renderComponent = () => {
    const baseStyle = {
      fontFamily: getThemeValue('typography.fontFamily', 'system-ui, sans-serif'),
    }

    switch (type) {
      case 'button':
        // 컴포넌트 설정값을 기반으로 동적 스타일 생성
        const getButtonStyles = (variant = 'default') => {
          const size = componentSettings.size || 'default'
          const isLoading = componentSettings.loading || false
          const isDisabled = componentSettings.disabled || false
          
          // 크기별 패딩 설정
          const sizeStyles = {
            sm: { 
              padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
              fontSize: getThemeValue('typography.fontSize.xs', '0.75rem')
            },
            default: { 
              padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
              fontSize: getThemeValue('typography.fontSize.sm', '0.875rem')
            },
            lg: { 
              padding: `${getThemeValue('spacing.md', '1rem')} ${getThemeValue('spacing.xl', '2rem')}`,
              fontSize: getThemeValue('typography.fontSize.base', '1rem')
            }
          }
          
          // 변형별 색상 설정
          const variantStyles = {
            default: {
              backgroundColor: getThemeValue('colors.primary', '#2563eb'),
              color: getThemeValue('colors.background', '#ffffff'),
              border: 'none'
            },
            secondary: {
              backgroundColor: getThemeValue('colors.secondary', '#64748b'),
              color: getThemeValue('colors.background', '#ffffff'),
              border: 'none'
            },
            outline: {
              backgroundColor: 'transparent',
              color: getThemeValue('colors.primary', '#2563eb'),
              border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`
            },
            ghost: {
              backgroundColor: 'transparent',
              color: getThemeValue('colors.foreground', '#0f172a'),
              border: 'none'
            },
            destructive: {
              backgroundColor: getThemeValue('colors.destructive', '#ef4444'),
              color: getThemeValue('colors.destructiveForeground', '#ffffff'),
              border: 'none'
            }
          }
          
          return {
            ...baseStyle,
            ...sizeStyles[size as keyof typeof sizeStyles],
            ...variantStyles[variant as keyof typeof variantStyles],
            borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
            fontWeight: getThemeValue('typography.fontWeight.medium', '500'),
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
            boxShadow: getThemeValue('shadows.sm', '0 1px 2px 0 rgba(0, 0, 0, 0.05)'),
            transition: 'all 0.2s ease-in-out',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }
        }
        
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                style={getButtonStyles(componentSettings.variant || 'default')}
                type="button"
                disabled={componentSettings.disabled || false}
                role="button"
                aria-label="Primary action button"
                tabIndex={0}
              >
                {componentSettings.loading ? (
                  <>
                    <div
                      style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}
                    />
                    Loading...
                  </>
                ) : (
                  'Button Example'
                )}
              </button>
              <button style={getButtonStyles('secondary')} disabled={componentSettings.disabled}>
                Secondary
              </button>
              <button style={getButtonStyles('outline')} disabled={componentSettings.disabled}>
                Outline
              </button>
              <button style={getButtonStyles('ghost')} disabled={componentSettings.disabled}>
                Ghost
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              크기: {componentSettings.size || 'default'} | 
              변형: {componentSettings.variant || 'default'} | 
              {componentSettings.loading && '로딩 중 | '}
              {componentSettings.disabled && '비활성화 | '}
              설정을 변경해보세요!
            </div>
          </div>
        )

      case 'input':
        // 컴포넌트 설정값을 기반으로 동적 스타일 생성
        const getInputStyles = () => {
          const size = componentSettings.size || 'default'
          const isDisabled = componentSettings.disabled || false
          const hasError = componentSettings.error && componentSettings.error.trim() !== ''
          const hasSuccess = componentSettings.success && componentSettings.success.trim() !== ''
          
          // 크기별 패딩 설정
          const sizeStyles = {
            sm: { 
              padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
              fontSize: getThemeValue('typography.fontSize.xs', '0.75rem')
            },
            default: { 
              padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.md', '1rem')}`,
              fontSize: getThemeValue('typography.fontSize.sm', '0.875rem')
            },
            lg: { 
              padding: `${getThemeValue('spacing.md', '1rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
              fontSize: getThemeValue('typography.fontSize.base', '1rem')
            }
          }
          
          // 상태별 보더 색상
          let borderColor = getThemeValue('colors.border', '#e2e8f0')
          if (hasError) borderColor = getThemeValue('colors.destructive', '#ef4444')
          if (hasSuccess) borderColor = getThemeValue('colors.primary', '#2563eb')
          
          return {
            ...baseStyle,
            ...sizeStyles[size as keyof typeof sizeStyles],
            width: '100%',
            backgroundColor: getThemeValue('colors.background', '#ffffff'),
            color: getThemeValue('colors.foreground', '#0f172a'),
            border: `1px solid ${borderColor}`,
            borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
            outline: 'none',
            cursor: isDisabled ? 'not-allowed' : 'text',
            opacity: isDisabled ? 0.6 : 1,
            transition: 'all 0.2s ease-in-out'
          }
        }
        
        return (
          <div className="space-y-4 max-w-md">
            <div>
              <input
                type={componentSettings.type || 'text'}
                placeholder={componentSettings.placeholder || '입력해주세요'}
                disabled={componentSettings.disabled || false}
                style={getInputStyles()}
                aria-label="Text input field"
                role="textbox"
                autoComplete="off"
              />
              {componentSettings.error && componentSettings.error.trim() !== '' && (
                <div className="text-xs text-destructive mt-1">
                  {componentSettings.error}
                </div>
              )}
              {componentSettings.success && componentSettings.success.trim() !== '' && (
                <div className="text-xs text-primary mt-1">
                  {componentSettings.success}
                </div>
              )}
            </div>
            
            <input
              type="email"
              placeholder="이메일 입력 (기본 스타일)"
              disabled={componentSettings.disabled || false}
              style={getInputStyles()}
            />
            
            <input
              type="password"
              placeholder="비밀번호 입력 (기본 스타일)"
              disabled={componentSettings.disabled || false}
              style={getInputStyles()}
            />
            
            <div className="text-xs text-muted-foreground">
              크기: {componentSettings.size || 'default'} | 
              타입: {componentSettings.type || 'text'} | 
              {componentSettings.disabled && '비활성화 | '}
              {componentSettings.error && componentSettings.error.trim() !== '' && 'ⓘ 에러 상태 | '}
              {componentSettings.success && componentSettings.success.trim() !== '' && '✓ 성공 상태 | '}
              설정을 변경해보세요!
            </div>
          </div>
        )

      case 'card':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: getThemeValue('colors.background', '#ffffff'),
              borderRadius: getThemeValue('borderRadius.lg', '0.5rem'),
              padding: getThemeValue('spacing.xl', '2rem'),
              border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
              boxShadow: getThemeValue('shadows.md', '0 4px 6px -1px rgba(0, 0, 0, 0.1)'),
              maxWidth: '400px'
            }}
          >
            <h3
              style={{
                fontSize: getThemeValue('typography.fontSize.lg', '1.125rem'),
                fontWeight: getThemeValue('typography.fontWeight.semibold', '600'),
                color: getThemeValue('colors.foreground', '#0f172a'),
                marginBottom: getThemeValue('spacing.sm', '0.5rem')
              }}
            >
              Card Title
            </h3>
            <p
              style={{
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                color: getThemeValue('colors.mutedForeground', '#64748b'),
                lineHeight: getThemeValue('typography.lineHeight.normal', '1.5'),
                marginBottom: getThemeValue('spacing.lg', '1.5rem')
              }}
            >
              This is a sample card component with some content to demonstrate the design system styling.
            </p>
            <button
              style={{
                backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                color: getThemeValue('colors.background', '#ffffff'),
                borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500'),
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Learn More
            </button>
          </div>
        )

      case 'badge':
        return (
          <div className="flex flex-wrap gap-3">
            <span
              style={{
                ...baseStyle,
                backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                color: getThemeValue('colors.background', '#ffffff'),
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
                fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              Primary Badge
            </span>
            <span
              style={{
                ...baseStyle,
                backgroundColor: getThemeValue('colors.secondary', '#64748b'),
                color: getThemeValue('colors.background', '#ffffff'),
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
                fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              Secondary Badge
            </span>
            <span
              style={{
                ...baseStyle,
                backgroundColor: 'transparent',
                color: getThemeValue('colors.primary', '#2563eb'),
                border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
                fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              Outline Badge
            </span>
          </div>
        )

      case 'checkbox':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: getThemeValue('colors.primary', '#2563eb')
                }}
              />
              <span
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a')
                }}
              >
                Checkbox option 1
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: getThemeValue('colors.primary', '#2563eb')
                }}
              />
              <span
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a')
                }}
              >
                Checkbox option 2 (checked)
              </span>
            </label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="radio-preview"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: getThemeValue('colors.primary', '#2563eb')
                }}
              />
              <span
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a')
                }}
              >
                Radio option 1
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="radio-preview"
                defaultChecked
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: getThemeValue('colors.primary', '#2563eb')
                }}
              />
              <span
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a')
                }}
              >
                Radio option 2 (selected)
              </span>
            </label>
          </div>
        )

      case 'select':
        return (
          <div className="max-w-md">
            <select
              style={{
                ...baseStyle,
                width: '100%',
                padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.md', '1rem')}`,
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                backgroundColor: getThemeValue('colors.background', '#ffffff'),
                color: getThemeValue('colors.foreground', '#0f172a'),
                border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option>Select an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        )

      case 'textarea':
        return (
          <div className="max-w-md">
            <textarea
              placeholder="Enter your message"
              rows={4}
              style={{
                ...baseStyle,
                width: '100%',
                padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.md', '1rem')}`,
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                backgroundColor: getThemeValue('colors.background', '#ffffff'),
                color: getThemeValue('colors.foreground', '#0f172a'),
                border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        )

      case 'typography':
        return (
          <div className="space-y-4">
            <div>
              <h1
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.4xl', '2.25rem'),
                  fontWeight: getThemeValue('typography.fontWeight.bold', '700'),
                  lineHeight: getThemeValue('typography.lineHeight.tight', '1.25'),
                  color: getThemeValue('colors.foreground', '#0f172a'),
                  margin: 0
                }}
              >
                Heading 1
              </h1>
              <h2
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.3xl', '1.875rem'),
                  fontWeight: getThemeValue('typography.fontWeight.bold', '700'),
                  lineHeight: getThemeValue('typography.lineHeight.tight', '1.25'),
                  color: getThemeValue('colors.foreground', '#0f172a'),
                  margin: 0
                }}
              >
                Heading 2
              </h2>
              <h3
                style={{
                  ...baseStyle,
                  fontSize: getThemeValue('typography.fontSize.2xl', '1.5rem'),
                  fontWeight: getThemeValue('typography.fontWeight.semibold', '600'),
                  lineHeight: getThemeValue('typography.lineHeight.tight', '1.25'),
                  color: getThemeValue('colors.foreground', '#0f172a'),
                  margin: 0
                }}
              >
                Heading 3
              </h3>
            </div>
            <p
              style={{
                ...baseStyle,
                fontSize: getThemeValue('typography.fontSize.base', '1rem'),
                fontWeight: getThemeValue('typography.fontWeight.normal', '400'),
                lineHeight: getThemeValue('typography.lineHeight.relaxed', '1.75'),
                color: getThemeValue('colors.foreground', '#0f172a'),
                margin: 0
              }}
            >
              This is a paragraph with regular text styling. It demonstrates how typography looks with the current theme settings.
            </p>
            <p
              style={{
                ...baseStyle,
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                fontWeight: getThemeValue('typography.fontWeight.normal', '400'),
                lineHeight: getThemeValue('typography.lineHeight.normal', '1.5'),
                color: getThemeValue('colors.mutedForeground', '#64748b'),
                margin: 0
              }}
            >
              This is a caption or small text example.
            </p>
          </div>
        )

      case 'modal':
        return (
          <div className="space-y-4">
            <div
              style={{
                backgroundColor: getThemeValue('colors.background', '#ffffff'),
                borderRadius: getThemeValue('borderRadius.lg', '0.5rem'),
                boxShadow: getThemeValue('shadows.xl', '0 20px 25px -5px rgba(0, 0, 0, 0.1)'),
                maxWidth: '400px',
                border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-content"
            >
              <div
                style={{
                  padding: getThemeValue('spacing.xl', '2rem'),
                  borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`
                }}
              >
                <h3
                  id="modal-title"
                  style={{
                    ...baseStyle,
                    fontSize: getThemeValue('typography.fontSize.lg', '1.125rem'),
                    fontWeight: getThemeValue('typography.fontWeight.semibold', '600'),
                    color: getThemeValue('colors.foreground', '#0f172a'),
                    margin: 0
                  }}
                >
                  Modal Title
                </h3>
              </div>
              <div style={{ padding: getThemeValue('spacing.xl', '2rem') }}>
                <p
                  id="modal-content"
                  style={{
                    ...baseStyle,
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    color: getThemeValue('colors.foreground', '#0f172a'),
                    margin: 0,
                    marginBottom: getThemeValue('spacing.lg', '1.5rem')
                  }}
                >
                  This is the modal content. You can place any content here including forms, text, or other components.
                </p>
              </div>
              <div
                style={{
                  padding: getThemeValue('spacing.xl', '2rem'),
                  borderTop: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                  display: 'flex',
                  gap: getThemeValue('spacing.sm', '0.5rem'),
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  style={{
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    color: getThemeValue('colors.foreground', '#0f172a'),
                    borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                    padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    fontWeight: getThemeValue('typography.fontWeight.medium', '500'),
                    border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...baseStyle,
                    backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                    color: getThemeValue('colors.background', '#ffffff'),
                    borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                    padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    fontWeight: getThemeValue('typography.fontWeight.medium', '500'),
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )

      case 'navigation':
        return (
          <div className="space-y-6">
            {/* Header Navigation */}
            <div>
              <h4 style={{ fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), marginBottom: getThemeValue('spacing.sm', '0.5rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Header Navigation
              </h4>
              <div
                style={{
                  backgroundColor: getThemeValue('colors.background', '#ffffff'),
                  borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                  padding: `0 ${getThemeValue('spacing.lg', '1.5rem')}`
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '4rem'
                  }}
                >
                  <div
                    style={{
                      ...baseStyle,
                      fontSize: getThemeValue('typography.fontSize.lg', '1.125rem'),
                      fontWeight: getThemeValue('typography.fontWeight.bold', '700'),
                      color: getThemeValue('colors.foreground', '#0f172a')
                    }}
                  >
                    Brand
                  </div>
                  <nav role="navigation" aria-label="Main navigation">
                    <ul style={{ display: 'flex', gap: getThemeValue('spacing.lg', '1.5rem'), listStyle: 'none', margin: 0, padding: 0 }}>
                      {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                        <li key={item}>
                          <a
                            href="#"
                            style={{
                              ...baseStyle,
                              fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                              color: getThemeValue('colors.mutedForeground', '#64748b'),
                              textDecoration: 'none',
                              cursor: 'pointer'
                            }}
                            role="menuitem"
                            tabIndex={0}
                            aria-current={index === 0 ? 'page' : undefined}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            {/* Breadcrumb */}
            <div>
              <h4 style={{ fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), marginBottom: getThemeValue('spacing.sm', '0.5rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Breadcrumb
              </h4>
              <nav aria-label="Breadcrumb">
                <ol
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: getThemeValue('spacing.xs', '0.25rem'),
                    ...baseStyle,
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    listStyle: 'none',
                    margin: 0,
                    padding: 0
                  }}
                >
                  <li>
                    <a href="#" style={{ color: getThemeValue('colors.mutedForeground', '#64748b'), textDecoration: 'none' }}>
                      Home
                    </a>
                  </li>
                  <li aria-hidden="true" style={{ color: getThemeValue('colors.mutedForeground', '#64748b') }}>/</li>
                  <li>
                    <a href="#" style={{ color: getThemeValue('colors.mutedForeground', '#64748b'), textDecoration: 'none' }}>
                      Category
                    </a>
                  </li>
                  <li aria-hidden="true" style={{ color: getThemeValue('colors.mutedForeground', '#64748b') }}>/</li>
                  <li aria-current="page">
                    <span style={{ color: getThemeValue('colors.foreground', '#0f172a'), fontWeight: getThemeValue('typography.fontWeight.medium', '500') }}>
                      Current Page
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )

      case 'loading':
        return (
          <div className="space-y-6">
            {/* Spinner */}
            <div>
              <h4 style={{ fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), marginBottom: getThemeValue('spacing.sm', '0.5rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Spinner
              </h4>
              <div
                className="ds-animate-spin"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  border: `2px solid ${getThemeValue('colors.muted', '#f1f5f9')}`,
                  borderTop: `2px solid ${getThemeValue('colors.primary', '#2563eb')}`,
                  borderRadius: '50%'
                }}
                role="status"
                aria-label="Loading..."
                aria-live="polite"
              />
            </div>

            {/* Skeleton */}
            <div>
              <h4 style={{ fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), marginBottom: getThemeValue('spacing.sm', '0.5rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Skeleton
              </h4>
              <div className="space-y-2">
                <div
                  style={{
                    height: '1rem',
                    backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                    borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                    width: '100%'
                  }}
                />
                <div
                  style={{
                    height: '1rem',
                    backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                    borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                    width: '80%'
                  }}
                />
                <div
                  style={{
                    height: '1rem',
                    backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                    borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                    width: '60%'
                  }}
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <h4 style={{ fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), marginBottom: getThemeValue('spacing.sm', '0.5rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Progress Bar
              </h4>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={65}
                aria-label="Loading progress"
                style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                  borderRadius: getThemeValue('borderRadius.full', '9999px'),
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                    width: '65%',
                    transition: 'width 0.3s ease-in-out'
                  }}
                />
              </div>
              <span className="sr-only">65% complete</span>
            </div>
          </div>
        )

      // Data Display Components
      case 'table':
        return (
          <div style={{ overflow: 'auto' }}>
            <table style={{ ...baseStyle, width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: getThemeValue('colors.muted', '#f1f5f9') }}>
                  <th style={{ padding: getThemeValue('spacing.md', '1rem'), textAlign: 'left', borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500') }}>Name</th>
                  <th style={{ padding: getThemeValue('spacing.md', '1rem'), textAlign: 'left', borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500') }}>Role</th>
                  <th style={{ padding: getThemeValue('spacing.md', '1rem'), textAlign: 'left', borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500') }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {['John Doe', 'Jane Smith', 'Mike Johnson'].map((name, index) => (
                  <tr key={name} style={{ borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}` }}>
                    <td style={{ padding: getThemeValue('spacing.md', '1rem'), fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>{name}</td>
                    <td style={{ padding: getThemeValue('spacing.md', '1rem'), fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: getThemeValue('colors.mutedForeground', '#64748b') }}>
                      {['Developer', 'Designer', 'Manager'][index]}
                    </td>
                    <td style={{ padding: getThemeValue('spacing.md', '1rem') }}>
                      <span style={{
                        padding: `${getThemeValue('spacing.xs', '0.25rem')} ${getThemeValue('spacing.sm', '0.5rem')}`,
                        borderRadius: getThemeValue('borderRadius.full', '9999px'),
                        fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                        backgroundColor: index === 0 ? getThemeValue('colors.primary', '#2563eb') : getThemeValue('colors.secondary', '#64748b'),
                        color: getThemeValue('colors.background', '#ffffff')
                      }}>
                        {['Active', 'Inactive', 'Pending'][index]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'list':
        return (
          <div className="space-y-2">
            {['First item', 'Second item', 'Third item'].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: getThemeValue('spacing.md', '1rem'),
                  backgroundColor: getThemeValue('colors.background', '#ffffff'),
                  border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                  borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a'),
                  cursor: 'pointer'
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )

      case 'avatar':
        return (
          <div className="flex items-center space-x-4">
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getThemeValue('colors.background', '#ffffff'),
                fontSize: getThemeValue('typography.fontSize.lg', '1.125rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              JD
            </div>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                backgroundColor: getThemeValue('colors.secondary', '#64748b'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getThemeValue('colors.background', '#ffffff'),
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              JS
            </div>
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: getThemeValue('borderRadius.full', '9999px'),
                backgroundColor: getThemeValue('colors.accent', '#f1f5f9'),
                border: `2px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getThemeValue('colors.foreground', '#0f172a'),
                fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                fontWeight: getThemeValue('typography.fontWeight.medium', '500')
              }}
            >
              MJ
            </div>
          </div>
        )

      // Feedback Components
      case 'alert':
        return (
          <div className="space-y-3">
            <div
              style={{
                padding: getThemeValue('spacing.md', '1rem'),
                backgroundColor: getThemeValue('colors.background', '#ffffff'),
                border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`,
                borderLeft: `4px solid ${getThemeValue('colors.primary', '#2563eb')}`,
                borderRadius: getThemeValue('borderRadius.md', '0.375rem')
              }}
            >
              <h4 style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), margin: 0, marginBottom: getThemeValue('spacing.xs', '0.25rem'), color: getThemeValue('colors.foreground', '#0f172a') }}>
                Info Alert
              </h4>
              <p style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: getThemeValue('colors.mutedForeground', '#64748b'), margin: 0 }}>
                This is an informational alert message.
              </p>
            </div>
            <div
              style={{
                padding: getThemeValue('spacing.md', '1rem'),
                backgroundColor: '#fef2f2',
                border: `1px solid #fecaca`,
                borderLeft: `4px solid #ef4444`,
                borderRadius: getThemeValue('borderRadius.md', '0.375rem')
              }}
            >
              <h4 style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), fontWeight: getThemeValue('typography.fontWeight.medium', '500'), margin: 0, marginBottom: getThemeValue('spacing.xs', '0.25rem'), color: '#dc2626' }}>
                Error Alert
              </h4>
              <p style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: '#991b1b', margin: 0 }}>
                This is an error alert message.
              </p>
            </div>
          </div>
        )

      case 'tabs':
        return (
          <div>
            <div style={{ display: 'flex', borderBottom: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}` }}>
              {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, index) => (
                <button
                  key={tab}
                  style={{
                    ...baseStyle,
                    padding: `${getThemeValue('spacing.sm', '0.5rem')} ${getThemeValue('spacing.lg', '1.5rem')}`,
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    backgroundColor: index === 0 ? getThemeValue('colors.background', '#ffffff') : 'transparent',
                    color: index === 0 ? getThemeValue('colors.primary', '#2563eb') : getThemeValue('colors.mutedForeground', '#64748b'),
                    borderBottom: index === 0 ? `2px solid ${getThemeValue('colors.primary', '#2563eb')}` : '2px solid transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div style={{ padding: getThemeValue('spacing.lg', '1.5rem') }}>
              <p style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: getThemeValue('colors.foreground', '#0f172a'), margin: 0 }}>
                Content for the active tab goes here.
              </p>
            </div>
          </div>
        )

      case 'accordion':
        return (
          <div className="space-y-2">
            {['Section 1', 'Section 2', 'Section 3'].map((section, index) => (
              <div key={section} style={{ border: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}`, borderRadius: getThemeValue('borderRadius.md', '0.375rem') }}>
                <button
                  style={{
                    ...baseStyle,
                    width: '100%',
                    padding: getThemeValue('spacing.md', '1rem'),
                    textAlign: 'left',
                    backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                    border: 'none',
                    fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                    fontWeight: getThemeValue('typography.fontWeight.medium', '500'),
                    color: getThemeValue('colors.foreground', '#0f172a'),
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {section}
                  <span>{index === 0 ? '−' : '+'}</span>
                </button>
                {index === 0 && (
                  <div style={{ padding: getThemeValue('spacing.md', '1rem'), borderTop: `1px solid ${getThemeValue('colors.border', '#e2e8f0')}` }}>
                    <p style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), color: getThemeValue('colors.foreground', '#0f172a'), margin: 0 }}>
                      Content for {section} goes here.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      // Layout Components
      case 'grid':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: getThemeValue('spacing.md', '1rem') }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                style={{
                  padding: getThemeValue('spacing.lg', '1.5rem'),
                  backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
                  borderRadius: getThemeValue('borderRadius.md', '0.375rem'),
                  textAlign: 'center',
                  fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                  color: getThemeValue('colors.foreground', '#0f172a')
                }}
              >
                Grid Item {index + 1}
              </div>
            ))}
          </div>
        )

      case 'divider':
        return (
          <div className="space-y-4">
            <div style={{ height: '1px', backgroundColor: getThemeValue('colors.border', '#e2e8f0'), width: '100%' }} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ height: '1px', backgroundColor: getThemeValue('colors.border', '#e2e8f0'), width: '100%' }} />
              <span style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: getThemeValue('colors.background', '#ffffff'),
                padding: `0 ${getThemeValue('spacing.md', '1rem')}`,
                fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'),
                color: getThemeValue('colors.mutedForeground', '#64748b')
              }}>
                OR
              </span>
            </div>
          </div>
        )

      // Charts
      case 'bar-chart':
        return (
          <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: getThemeValue('spacing.sm', '0.5rem') }}>
            {[60, 80, 45, 90, 30].map((height, index) => (
              <div
                key={index}
                style={{
                  width: '40px',
                  height: `${height}%`,
                  backgroundColor: getThemeValue('colors.primary', '#2563eb'),
                  borderRadius: `${getThemeValue('borderRadius.sm', '0.125rem')} ${getThemeValue('borderRadius.sm', '0.125rem')} 0 0`,
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: getThemeValue('colors.background', '#ffffff'),
                  fontSize: getThemeValue('typography.fontSize.xs', '0.75rem'),
                  paddingBottom: getThemeValue('spacing.xs', '0.25rem')
                }}
              >
                {height}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div style={{ 
            padding: getThemeValue('spacing.lg', '1.5rem'), 
            textAlign: 'center', 
            color: getThemeValue('colors.mutedForeground', '#64748b'),
            backgroundColor: getThemeValue('colors.muted', '#f1f5f9'),
            borderRadius: getThemeValue('borderRadius.md', '0.375rem')
          }}>
            <p style={{ ...baseStyle, fontSize: getThemeValue('typography.fontSize.sm', '0.875rem'), margin: 0 }}>
              {getComponentName(type)} 컴포넌트 미리보기가 준비 중입니다.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-background">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          {getComponentName(type)}
        </h3>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
          {type}
        </span>
      </div>
      
      <div className="mb-4">
        {renderComponent()}
      </div>

      {/* 컴포넌트 설정 */}
      <ComponentSettings
        componentType={type}
        onSettingsChange={(newSettings) => {
          setComponentSettings(newSettings)
          // 강제 리렌더링을 위해 약간의 지연 후 업데이트
          setTimeout(() => {
            setComponentSettings({...newSettings})
          }, 50)
        }}
      />

      {/* 코드 예시 */}
      <details className="mt-4">
        <summary className="text-sm font-medium text-foreground cursor-pointer hover:text-primary transition-colors">
          코드 예시 보기
        </summary>
        <pre className="mt-2 p-3 bg-muted rounded text-xs font-mono overflow-x-auto">
          <code>
{`// ${getComponentName(type)} 컴포넌트
const ${getComponentName(type)} = () => {
  return (
    // 생성된 ${getComponentName(type)} 컴포넌트
  )
}`}
          </code>
        </pre>
      </details>
    </div>
  )
}
