/**
 * 테마 유틸리티 함수들
 */

export interface ThemeColors {
  primary?: string
  secondary?: string  
  accent?: string
  background?: string
  foreground?: string
  muted?: string
  mutedForeground?: string
  border?: string
  success?: string
  warning?: string
  destructive?: string
}

/**
 * 테마에서 색상을 가져오는 함수
 */
export const getThemeColor = (theme: any, colorKey: keyof ThemeColors, fallback: string): string => {
  if (!theme || !theme.colors) return fallback
  return theme.colors[colorKey] || fallback
}

/**
 * 테마 색상을 CSS 변수로 변환하는 함수
 */
export const getThemeColorVar = (theme: any, colorKey: keyof ThemeColors, fallback: string): string => {
  const color = getThemeColor(theme, colorKey, fallback)
  return color
}

/**
 * 색상에 투명도를 적용하는 함수
 */
export const applyOpacity = (color: string, opacity: number): string => {
  // hex 색상 형태인지 확인
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  
  // rgb 색상 형태인지 확인
  if (color.startsWith('rgb')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`)
  }
  
  // hsl 색상 형태인지 확인  
  if (color.startsWith('hsl')) {
    return color.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`)
  }
  
  // 기본적으로 CSS 변수나 다른 형태의 색상일 경우
  return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)`
}

/**
 * 테마에서 그라데이션 색상을 생성하는 함수
 */
export const getThemeGradient = (theme: any, direction: string = '135deg'): string => {
  const primary = getThemeColor(theme, 'primary', '#8b5cf6')
  const secondary = getThemeColor(theme, 'secondary', '#64748b')
  
  return `linear-gradient(${direction}, ${primary} 0%, ${adjustBrightness(primary, 20)} 100%)`
}

/**
 * 색상의 밝기를 조정하는 함수
 */
export const adjustBrightness = (color: string, percent: number): string => {
  if (!color.startsWith('#')) return color
  
  const hex = color.replace('#', '')
  const r = Math.min(255, Math.max(0, parseInt(hex.substr(0, 2), 16) + percent))
  const g = Math.min(255, Math.max(0, parseInt(hex.substr(2, 2), 16) + percent))
  const b = Math.min(255, Math.max(0, parseInt(hex.substr(4, 2), 16) + percent))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * 색상이 어두운지 밝은지 판단하는 함수
 */
export const isColorDark = (color: string): boolean => {
  if (!color.startsWith('#')) return false
  
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // 밝기 계산 (0-255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}

/**
 * 대비되는 색상을 반환하는 함수
 */
export const getContrastColor = (backgroundColor: string, lightColor: string = '#ffffff', darkColor: string = '#000000'): string => {
  return isColorDark(backgroundColor) ? lightColor : darkColor
}

/**
 * 다중 색상 팔레트를 생성하는 함수
 */
export const generateColorPalette = (theme: any): string[] => {
  const primary = getThemeColor(theme, 'primary', '#8b5cf6')
  
  return [
    primary,
    adjustBrightness(primary, -30),
    adjustBrightness(primary, -60),
    adjustBrightness(primary, 30),
    adjustBrightness(primary, 60),
    getThemeColor(theme, 'secondary', '#64748b'),
    getThemeColor(theme, 'success', '#22c55e'),
    getThemeColor(theme, 'warning', '#f59e0b'),
    getThemeColor(theme, 'destructive', '#ef4444')
  ]
}

/**
 * 차트용 색상 배열을 생성하는 함수
 */
export const getChartColors = (theme: any, count: number = 6): string[] => {
  const primary = getThemeColor(theme, 'primary', '#8b5cf6')
  const secondary = getThemeColor(theme, 'secondary', '#64748b')
  const success = getThemeColor(theme, 'success', '#22c55e')
  const warning = getThemeColor(theme, 'warning', '#f59e0b')
  
  const baseColors = [primary, secondary, success, warning]
  const colors: string[] = []
  
  for (let i = 0; i < count; i++) {
    const baseColor = baseColors[i % baseColors.length]
    const variation = Math.floor(i / baseColors.length) * 20
    colors.push(adjustBrightness(baseColor, variation - 10))
  }
  
  return colors
}