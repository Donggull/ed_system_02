import { DesignSystemTheme } from '@/contexts/DesignSystemContext'

export interface ValidationError {
  path: string
  message: string
  type: 'missing' | 'invalid' | 'type'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  theme: DesignSystemTheme | null
  warnings: string[]
}

// 색상 값 유효성 검증
export class ColorValidator {
  private static HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  private static RGB_REGEX = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/
  private static RGBA_REGEX = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/
  private static HSL_REGEX = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/
  private static HSLA_REGEX = /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0?\.\d+)\s*\)$/

  static isValidColor(color: string): boolean {
    if (typeof color !== 'string') return false
    
    const trimmed = color.trim()
    
    // CSS 키워드 색상
    const cssColors = [
      'transparent', 'currentColor', 'inherit', 'initial', 'unset',
      'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'grey'
    ]
    
    if (cssColors.includes(trimmed.toLowerCase())) return true
    
    // HEX 색상
    if (this.HEX_REGEX.test(trimmed)) return true
    
    // RGB/RGBA 색상
    if (this.RGB_REGEX.test(trimmed) || this.RGBA_REGEX.test(trimmed)) {
      const match = trimmed.match(this.RGB_REGEX) || trimmed.match(this.RGBA_REGEX)
      if (match) {
        const [, r, g, b] = match
        return this.isValidRGBValue(+r) && this.isValidRGBValue(+g) && this.isValidRGBValue(+b)
      }
    }
    
    // HSL/HSLA 색상
    if (this.HSL_REGEX.test(trimmed) || this.HSLA_REGEX.test(trimmed)) {
      const match = trimmed.match(this.HSL_REGEX) || trimmed.match(this.HSLA_REGEX)
      if (match) {
        const [, h, s, l] = match
        return +h >= 0 && +h <= 360 && +s >= 0 && +s <= 100 && +l >= 0 && +l <= 100
      }
    }
    
    return false
  }
  
  private static isValidRGBValue(value: number): boolean {
    return value >= 0 && value <= 255
  }
  
  static normalizeColor(color: string): string {
    const trimmed = color.trim()
    
    // 3자리 HEX를 6자리로 변환
    const hex3Match = trimmed.match(/^#([A-Fa-f0-9]{3})$/)
    if (hex3Match) {
      const [, hex] = hex3Match
      return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    }
    
    return trimmed
  }
}

// 테마 스키마 정의
export const THEME_SCHEMA = {
  colors: {
    primary: 'string',
    secondary: 'string',
    background: 'string',
    foreground: 'string',
    muted: 'string',
    mutedForeground: 'string',
    accent: 'string',
    accentForeground: 'string',
    destructive: 'string',
    destructiveForeground: 'string',
    border: 'string',
    input: 'string',
    ring: 'string'
  },
  typography: {
    fontFamily: 'string',
    fontSize: {
      xs: 'string',
      sm: 'string',
      base: 'string',
      lg: 'string',
      xl: 'string',
      '2xl': 'string',
      '3xl': 'string',
      '4xl': 'string'
    },
    fontWeight: {
      normal: 'string',
      medium: 'string',
      semibold: 'string',
      bold: 'string'
    },
    lineHeight: {
      tight: 'string',
      normal: 'string',
      relaxed: 'string'
    }
  },
  spacing: {
    xs: 'string',
    sm: 'string',
    md: 'string',
    lg: 'string',
    xl: 'string',
    '2xl': 'string',
    '3xl': 'string',
    '4xl': 'string'
  },
  borderRadius: {
    none: 'string',
    sm: 'string',
    md: 'string',
    lg: 'string',
    xl: 'string',
    full: 'string'
  },
  shadows: {
    none: 'string',
    sm: 'string',
    md: 'string',
    lg: 'string',
    xl: 'string'
  }
}

export class ThemeValidator {
  private static validateValue(value: any, expectedType: string, path: string): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (value === undefined || value === null) {
      errors.push({
        path,
        message: `필수 속성 '${path}'가 누락되었습니다.`,
        type: 'missing'
      })
      return errors
    }
    
    if (expectedType === 'string' && typeof value !== 'string') {
      errors.push({
        path,
        message: `'${path}'는 문자열이어야 합니다. 현재 타입: ${typeof value}`,
        type: 'type'
      })
      return errors
    }
    
    // 색상 속성 검증
    if (path.includes('colors') && typeof value === 'string') {
      if (!ColorValidator.isValidColor(value)) {
        errors.push({
          path,
          message: `'${path}'의 색상 값이 유효하지 않습니다: ${value}`,
          type: 'invalid'
        })
      }
    }
    
    // CSS 단위 검증
    if ((path.includes('spacing') || path.includes('borderRadius')) && typeof value === 'string') {
      if (!this.isValidCSSUnit(value)) {
        errors.push({
          path,
          message: `'${path}'의 CSS 단위가 유효하지 않습니다: ${value}`,
          type: 'invalid'
        })
      }
    }
    
    // 폰트 관련 검증
    if (path.includes('fontSize') && typeof value === 'string') {
      if (!this.isValidFontSize(value)) {
        errors.push({
          path,
          message: `'${path}'의 폰트 크기가 유효하지 않습니다: ${value}`,
          type: 'invalid'
        })
      }
    }
    
    if (path.includes('fontWeight') && typeof value === 'string') {
      if (!this.isValidFontWeight(value)) {
        errors.push({
          path,
          message: `'${path}'의 폰트 굵기가 유효하지 않습니다: ${value}`,
          type: 'invalid'
        })
      }
    }
    
    return errors
  }
  
  private static validateObject(obj: any, schema: any, basePath = ''): ValidationError[] {
    const errors: ValidationError[] = []
    
    for (const [key, expectedType] of Object.entries(schema)) {
      const currentPath = basePath ? `${basePath}.${key}` : key
      const value = obj?.[key]
      
      if (typeof expectedType === 'object' && expectedType !== null) {
        if (value && typeof value === 'object') {
          errors.push(...this.validateObject(value, expectedType, currentPath))
        } else {
          errors.push({
            path: currentPath,
            message: `'${currentPath}'는 객체여야 합니다.`,
            type: 'type'
          })
        }
      } else {
        errors.push(...this.validateValue(value, expectedType as string, currentPath))
      }
    }
    
    return errors
  }
  
  private static isValidCSSUnit(value: string): boolean {
    const CSS_UNIT_REGEX = /^(\d+(\.\d+)?)(px|em|rem|%|vh|vw|pt|cm|mm|in|pc|ex|ch|vmin|vmax)$|^0$/
    return CSS_UNIT_REGEX.test(value.trim())
  }
  
  private static isValidFontSize(value: string): boolean {
    const FONT_SIZE_REGEX = /^(\d+(\.\d+)?)(px|em|rem|%|pt)$|^(xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger)$/
    return FONT_SIZE_REGEX.test(value.trim())
  }
  
  private static isValidFontWeight(value: string): boolean {
    const numericWeight = parseInt(value)
    if (!isNaN(numericWeight)) {
      return numericWeight >= 100 && numericWeight <= 900 && numericWeight % 100 === 0
    }
    
    const namedWeights = ['normal', 'bold', 'bolder', 'lighter']
    return namedWeights.includes(value.trim())
  }
  
  private static applyDefaults(partialTheme: any, defaultTheme: DesignSystemTheme): DesignSystemTheme {
    const result = JSON.parse(JSON.stringify(defaultTheme))
    
    const mergeDeep = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {}
          mergeDeep(target[key], source[key])
        } else if (source[key] !== undefined) {
          target[key] = source[key]
        }
      }
    }
    
    mergeDeep(result, partialTheme)
    return result
  }
  
  static validate(themeJson: string, defaultTheme: DesignSystemTheme): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: string[] = []
    
    // JSON 파싱 검증
    let parsedTheme: any
    try {
      parsedTheme = JSON.parse(themeJson)
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          path: 'root',
          message: `JSON 파싱 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          type: 'invalid'
        }],
        theme: null,
        warnings: []
      }
    }
    
    // 스키마 검증
    const schemaErrors = this.validateObject(parsedTheme, THEME_SCHEMA)
    errors.push(...schemaErrors)
    
    // 경고 생성 (누락된 속성들)
    const missingErrors = errors.filter(e => e.type === 'missing')
    if (missingErrors.length > 0) {
      warnings.push(`${missingErrors.length}개의 속성이 누락되어 기본값으로 대체됩니다.`)
    }
    
    // 색상 정규화
    if (parsedTheme.colors) {
      for (const [key, value] of Object.entries(parsedTheme.colors)) {
        if (typeof value === 'string' && ColorValidator.isValidColor(value)) {
          parsedTheme.colors[key] = ColorValidator.normalizeColor(value)
        }
      }
    }
    
    // 기본값 적용
    const finalTheme = this.applyDefaults(parsedTheme, defaultTheme)
    
    // 치명적 오류만 체크 (타입 오류, 유효하지 않은 값)
    const criticalErrors = errors.filter(e => e.type === 'invalid' || e.type === 'type')
    
    return {
      isValid: criticalErrors.length === 0,
      errors,
      theme: criticalErrors.length === 0 ? finalTheme : null,
      warnings
    }
  }
}

// 디바운스 훅
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// React import 추가
import React from 'react'
