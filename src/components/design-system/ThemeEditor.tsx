'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DesignSystemTheme, useDesignSystem } from '@/contexts/DesignSystemContext'
import { ThemeValidator, ValidationResult, useDebounce } from '@/lib/themeValidator'
import { useThemeEngine } from '@/lib/themeEngine'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

interface ThemeEditorProps {
  className?: string
}

export default function ThemeEditor({ className }: ThemeEditorProps) {
  const { theme: contextTheme, setTheme: setContextTheme } = useDesignSystem()
  const { state: themeState, updateTheme, rollback } = useThemeEngine(contextTheme)
  
  const [jsonInput, setJsonInput] = useState('')
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumberRef = useRef<HTMLDivElement>(null)
  
  // 디바운싱된 JSON 입력값
  const debouncedJsonInput = useDebounce(jsonInput, 500)
  
  // 초기 JSON 설정
  useEffect(() => {
    if (!isEditing && contextTheme) {
      const formattedJson = JSON.stringify(contextTheme, null, 2)
      setJsonInput(formattedJson)
      console.log('Initial theme loaded:', contextTheme)
    }
  }, [contextTheme, isEditing])
  
  // 실시간 검증 및 적용
  useEffect(() => {
    if (!debouncedJsonInput.trim() || !isEditing) return
    
    console.log('Validating JSON:', debouncedJsonInput.substring(0, 100) + '...')
    
    const validationResult = ThemeValidator.validate(debouncedJsonInput, contextTheme)
    setValidation(validationResult)
    
    console.log('Validation result:', {
      isValid: validationResult.isValid,
      errors: validationResult.errors.length,
      warnings: validationResult.warnings.length,
      hasTheme: !!validationResult.theme
    })
    
    if (validationResult.isValid && validationResult.theme) {
      // 실시간으로 테마 적용
      console.log('Applying theme in real-time')
      updateTheme(validationResult.theme, true)
        .then(() => {
          console.log('Real-time theme update successful')
          setHasUnsavedChanges(true)
        })
        .catch((error) => {
          console.error('Real-time theme update failed:', error)
        })
    } else {
      console.warn('Theme validation failed, not applying')
    }
  }, [debouncedJsonInput, contextTheme, isEditing, updateTheme])
  
  const handleJsonChange = useCallback((value: string) => {
    setJsonInput(value)
    if (!isEditing) {
      setIsEditing(true)
    }
  }, [isEditing])

  // 텍스트 영역과 줄 번호 스크롤 동기화
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumberRef.current) {
      const lineNumberContent = lineNumberRef.current.querySelector('div')
      if (lineNumberContent) {
        lineNumberContent.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`
      }
    }
  }, [])
  
  const handleApply = useCallback(async () => {
    if (validation?.isValid && validation.theme) {
      try {
        // 양쪽 시스템 모두 업데이트
        await updateTheme(validation.theme, true)
        setContextTheme(validation.theme)
        setHasUnsavedChanges(false)
        setIsEditing(false)
        console.log('Theme applied successfully:', validation.theme)
      } catch (error) {
        console.error('Error applying theme:', error)
      }
    } else {
      console.warn('Cannot apply theme: validation failed', validation)
    }
  }, [validation, updateTheme, setContextTheme])
  
  const handleReset = useCallback(async () => {
    try {
      setJsonInput(JSON.stringify(contextTheme, null, 2))
      setValidation(null)
      setIsEditing(false)
      setHasUnsavedChanges(false)
      await updateTheme(contextTheme, true)
      console.log('Theme reset successfully')
    } catch (error) {
      console.error('Error resetting theme:', error)
      rollback()
    }
  }, [contextTheme, updateTheme, rollback])
  
  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonInput(formatted)
    } catch (error) {
      // JSON이 유효하지 않으면 포맷팅하지 않음
    }
  }, [jsonInput])
  
  const handleInsertExample = useCallback((example: Partial<DesignSystemTheme>) => {
    const merged = { ...contextTheme, ...example }
    setJsonInput(JSON.stringify(merged, null, 2))
  }, [contextTheme])
  
  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            if (hasUnsavedChanges) handleApply()
            break
          case 'z':
            e.preventDefault()
            if (hasUnsavedChanges) handleReset()
            break
          case 'f':
            e.preventDefault()
            handleFormat()
            break
        }
      }
    }
    
    if (isEditing) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditing, hasUnsavedChanges, handleApply, handleReset, handleFormat])
  
  const getValidationStatusColor = () => {
    if (!validation) return 'secondary'
    if (validation.isValid) return 'default'
    return 'destructive'
  }
  
  const getValidationStatusText = () => {
    if (!validation) return '대기 중'
    if (themeState.isTransitioning) return '적용 중...'
    if (validation.isValid) return '유효함'
    return `${validation.errors.length}개 오류`
  }

  return (
    <div className={className}>
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                테마 에디터
              </h3>
              <Badge 
                variant={getValidationStatusColor()} 
                size="sm"
                className="transition-all duration-200"
              >
                {getValidationStatusText()}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="outline" size="sm">
                  미저장 변경사항
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* 빠른 예시 버튼들 */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const simpleTheme = {
                      colors: {
                        primary: '#ff0000',
                        secondary: '#00ff00',
                        background: '#ffffff',
                        foreground: '#000000'
                      }
                    }
                    console.log('Inserting simple test theme')
                    setJsonInput(JSON.stringify(simpleTheme, null, 2))
                  }}
                >
                  테스트
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('Inserting purple theme example')
                    handleInsertExample({
                      colors: {
                        ...contextTheme.colors,
                        primary: '#8b5cf6',
                        accent: '#f3f4f6'
                      }
                    })
                  }}
                >
                  보라색
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInsertExample({
                    colors: {
                      ...contextTheme.colors,
                      primary: '#ef4444',
                      accent: '#fef2f2'
                    }
                  })}
                >
                  빨간색
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInsertExample({
                    colors: {
                      ...contextTheme.colors,
                      primary: '#10b981',
                      accent: '#f0fdf4'
                    }
                  })}
                >
                  초록색
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFormat}
                disabled={!isEditing}
              >
                포맷팅
              </Button>
            </div>
          </div>
          
          {/* 단축키 안내 */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Ctrl+S: 저장</span>
            <span>Ctrl+Z: 되돌리기</span>
            <span>Ctrl+F: 포맷팅</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {/* JSON 입력 영역 */}
            <div 
              className="relative border rounded-lg bg-background"
              style={{ 
                overflow: 'hidden',
                height: '24rem', /* h-96 */
                contain: 'layout style'
              }}
            >
              <div className="flex h-full">
                {/* 줄 번호 영역 - 완전히 격리 */}
                <div 
                  ref={lineNumberRef}
                  className="bg-muted/30 text-xs text-muted-foreground font-mono select-none border-r border-border"
                  style={{ 
                    width: '3.5rem',
                    height: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                    flexShrink: 0
                  }}
                >
                  <div 
                    className="text-right"
                    style={{ 
                      padding: '1rem 0.5rem',
                      lineHeight: '1.4em',
                      height: 'auto',
                      minHeight: '100%'
                    }}
                  >
                    {jsonInput.split('\n').map((_, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          height: '1.4em', 
                          lineHeight: '1.4em',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 텍스트 입력 영역 - 격리 */}
                <div 
                  className="flex-1 relative"
                  style={{ 
                    overflow: 'hidden',
                    height: '100%'
                  }}
                >
                  <textarea
                    ref={textareaRef}
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    onScroll={handleScroll}
                    className={`
                      text-sm font-mono resize-none border-0 bg-transparent
                      text-foreground
                      focus:outline-none focus:ring-0
                      ${validation?.isValid === false ? 'bg-destructive/5' : ''}
                    `}
                    placeholder="JSON 테마 정의를 입력하세요..."
                    spellCheck={false}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      padding: '1rem',
                      outline: 'none', 
                      boxShadow: 'none', 
                      lineHeight: '1.4em',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      overflow: 'auto'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* 검증 결과 */}
            {validation && (
              <div className="space-y-3">
                {/* 오류 표시 */}
                {validation.errors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-destructive">
                      오류 ({validation.errors.length}개)
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {validation.errors.map((error, index) => (
                        <div 
                          key={index}
                          className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1"
                        >
                          <span className="font-medium">{error.path}:</span> {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* 경고 표시 */}
                {validation.warnings.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-600">
                      경고 ({validation.warnings.length}개)
                    </h4>
                    <div className="space-y-1">
                      {validation.warnings.map((warning, index) => (
                        <div 
                          key={index}
                          className="text-xs text-yellow-600 bg-yellow-50 rounded px-2 py-1"
                        >
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* 액션 버튼들 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    console.log('Apply button clicked', {
                      validationIsValid: validation?.isValid,
                      hasUnsavedChanges,
                      validationTheme: !!validation?.theme
                    })
                    handleApply()
                  }}
                  disabled={!validation?.isValid || !hasUnsavedChanges}
                >
                  저장 및 적용
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasUnsavedChanges}
                >
                  되돌리기
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {validation?.isValid && !themeState.isTransitioning && (
                  <span className="text-green-600">✓ 실시간 미리보기 활성화됨</span>
                )}
                {themeState.isTransitioning && (
                  <span className="text-blue-600">⟳ 테마 전환 중...</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
