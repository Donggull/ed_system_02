'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useDesignSystem, defaultTheme } from '@/contexts/DesignSystemContext'

export default function JsonEditor() {
  const { jsonInput, setJsonInput, setJsonValid } = useDesignSystem()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumberRef = useRef<HTMLDivElement>(null)

  const validateJson = (value: string) => {
    try {
      JSON.parse(value)
      setJsonValid(true)
    } catch (error) {
      setJsonValid(false)
    }
  }

  const handleChange = (value: string) => {
    setJsonInput(value)
    validateJson(value)
  }

  // 텍스트 영역과 줄 번호 스크롤 동기화
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumberRef.current) {
      const lineNumberContent = lineNumberRef.current.querySelector('div')
      if (lineNumberContent) {
        lineNumberContent.style.transform = `translateY(-${textareaRef.current.scrollTop}px)`
      }
    }
  }, [])

  const loadTemplate = () => {
    const template = JSON.stringify(defaultTheme, null, 2)
    setJsonInput(template)
    setJsonValid(true)
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonInput(formatted)
      setJsonValid(true)
    } catch (error) {
      // JSON이 유효하지 않으면 그대로 둠
    }
  }

  useEffect(() => {
    validateJson(jsonInput)
  }, [jsonInput, setJsonValid])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          테마 JSON
        </span>
        <div className="flex space-x-1">
          <button
            onClick={loadTemplate}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            템플릿
          </button>
          <span className="text-xs text-muted-foreground">•</span>
          <button
            onClick={formatJson}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            정리
          </button>
        </div>
      </div>

      {/* JSON 입력 영역 - 완전히 격리된 라인 넘버 */}
      <div 
        className="relative border rounded-md bg-background"
        style={{ 
          overflow: 'hidden',
          height: '20rem', /* h-80 */
          contain: 'layout style'
        }}
      >
        <div className="flex h-full">
          {/* 줄 번호 영역 - 완전히 격리 */}
          <div 
            ref={lineNumberRef}
            className="bg-muted/30 text-xs text-muted-foreground font-mono select-none border-r border-border"
            style={{ 
              width: '2.5rem',
              height: '100%',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <div 
              className="text-right"
              style={{ 
                padding: '0.75rem 0.25rem',
                lineHeight: '1.5',
                height: 'auto',
                minHeight: '100%'
              }}
            >
              {jsonInput.split('\n').map((_, index) => (
                <div 
                  key={index} 
                  style={{ 
                    height: '1.5em', 
                    lineHeight: '1.5',
                    whiteSpace: 'nowrap',
                    paddingRight: '0.25rem'
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
              onChange={(e) => handleChange(e.target.value)}
              onScroll={handleScroll}
              className="text-xs font-mono resize-none border-0 bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="JSON 테마를 입력하세요..."
              spellCheck={false}
              style={{ 
                width: '100%',
                height: '100%',
                padding: '0.75rem',
                outline: 'none', 
                boxShadow: 'none', 
                lineHeight: '1.5',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                overflow: 'auto'
              }}
            />
          </div>
        </div>
      </div>

      {/* JSON 도움말 */}
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground transition-colors">
          JSON 스키마 도움말
        </summary>
        <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
          <p><strong>colors:</strong> primary, secondary, background, foreground 등</p>
          <p><strong>typography:</strong> fontFamily, fontSize, fontWeight, lineHeight</p>
          <p><strong>spacing:</strong> xs, sm, md, lg, xl, 2xl, 3xl, 4xl</p>
          <p><strong>borderRadius:</strong> none, sm, md, lg, xl, full</p>
          <p><strong>shadows:</strong> none, sm, md, lg, xl</p>
        </div>
      </details>
    </div>
  )
}
