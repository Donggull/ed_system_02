'use client'

import { getThemeColor, getThemeGradient, applyOpacity, getChartColors } from '@/lib/themeUtils'

interface ChartProps {
  data: number[]
  labels?: string[]
  height?: number
  className?: string
  animated?: boolean
  theme?: any
  chartType?: 'bar' | 'line' | 'area'
  colors?: string[]
}

export default function Chart({ 
  data, 
  labels, 
  height = 200, 
  className = "",
  animated = true,
  theme,
  chartType = 'bar',
  colors
}: ChartProps) {
  const maxValue = Math.max(...data)
  
  // 테마 기반 색상 생성
  const chartColors = colors || getChartColors(theme, data.length)
  const primaryColor = getThemeColor(theme, 'primary', '#8b5cf6')
  const borderColor = getThemeColor(theme, 'border', '#e2e8f0')
  const mutedColor = getThemeColor(theme, 'mutedForeground', '#64748b')
  
  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Y축 그리드 라인 */}
      <div className="absolute inset-0 flex flex-col justify-between py-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-full h-px"
            style={{ backgroundColor: applyOpacity(borderColor, 0.3) }}
          ></div>
        ))}
      </div>
      
      {/* 차트 바 */}
      <div className="absolute inset-0 flex items-end justify-around px-2 pb-6">
        {data.map((value, i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            {/* 바 */}
            <div
              className={`rounded-t hover:opacity-90 cursor-pointer transition-all duration-500 hover-lift relative overflow-hidden ${
                animated ? 'animate-scale-in' : ''
              }`}
              style={{
                height: `${(value / maxValue) * 85}%`,
                width: `${Math.max(20, 80 / data.length)}px`,
                background: chartColors[i] || primaryColor,
                animationDelay: animated ? `${i * 0.1}s` : '0s'
              }}
            >
              {/* 그라데이션 오버레이 */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: `linear-gradient(180deg, ${applyOpacity(chartColors[i] || primaryColor, 0.8)} 0%, ${applyOpacity(chartColors[i] || primaryColor, 0.2)} 100%)`
                }}
              ></div>
            </div>
            
            {/* 레이블 */}
            {labels && labels[i] && (
              <span 
                className="text-xs whitespace-nowrap font-medium"
                style={{ color: mutedColor }}
              >
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* 호버 툴팁 영역 */}
      <div className="absolute inset-0 flex items-end justify-around px-2 pb-6 pointer-events-none">
        {data.map((value, i) => (
          <div key={i} className="relative">
            <div 
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 rounded px-2 py-1 text-xs opacity-0 hover:opacity-100 transition-opacity shadow-lg backdrop-blur-sm"
              style={{ 
                pointerEvents: 'auto',
                backgroundColor: getThemeColor(theme, 'background', '#ffffff'),
                border: `1px solid ${borderColor}`,
                color: getThemeColor(theme, 'foreground', '#000000')
              }}
            >
              {value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}